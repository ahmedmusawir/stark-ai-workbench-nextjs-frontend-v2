#!/usr/bin/env bash
# APBM001 P0-3 — ADK Cloud Run deployment metadata. OWNER-RUN, READ-ONLY.
#
# Uses only: gcloud run services describe, gcloud run services get-iam-policy,
# gcloud run revisions describe (serving revisions). Nothing is restarted,
# deployed, invoked or changed, and no session is created. Raw JSON is parsed
# in memory and never printed or written to disk. Only allowlisted metadata is
# printed: environment VALUES are reduced to a URI scheme/host class, args are
# masked, and secrets are shown only as secret-reference names.
#
# Usage (Cloud Shell, or any machine with gcloud + python3, signed in with at
# least roles/run.viewer on the project):
#   bash p0_3_adk_cloud_run_metadata.sh [SERVICE] [REGION] [PROJECT]
# Defaults come from existing records (RECON_ADK_CONTINUATION_20261004-115739.md):
#   adk-bundle-prod-v2  us-east1  952978338090   (project number; a project ID also works)
# If P0-1 printed a different Cloud Run service/region/project for ADK_BUNDLE_URL_V1, pass those.
set -euo pipefail
SERVICE="${1:-adk-bundle-prod-v2}"
REGION="${2:-us-east1}"
PROJECT="${3:-952978338090}"
exec python3 -I - "$SERVICE" "$REGION" "$PROJECT" <<'PY'
import json, os, re, subprocess, sys
from urllib.parse import urlsplit, parse_qs

SERVICE, REGION, PROJECT = sys.argv[1:4]
FIXTURE = os.environ.get("P0_OFFLINE_FIXTURE")  # self-test only: read JSON files instead of calling gcloud

URI_RE = re.compile(r"([A-Za-z][A-Za-z0-9+.\-]*://)[^\s'\"]+")
KV_SECRET_RE = re.compile(r"(?i)\b([A-Za-z0-9_\-]*(?:pass(?:word)?|pwd|secret|token|api[_-]?key|credential)[A-Za-z0-9_\-]*)\s*([=:])\s*[^\s'\"]+")
LONG_RE = re.compile(r"[A-Za-z0-9+/_\-]{32,}={0,2}")

def mask(text):
    text = URI_RE.sub(lambda m: m.group(1) + "<redacted>", str(text))
    text = KV_SECRET_RE.sub(lambda m: m.group(1) + m.group(2) + "<redacted>", text)
    return LONG_RE.sub("<redacted-long>", text)

def gcloud(kind, name=None):
    if FIXTURE:
        fname = {"service": "service.json", "iam": "iam.json"}.get(kind) or f"revision-{name}.json"
        with open(os.path.join(FIXTURE, fname)) as fh:
            return json.load(fh)
    base = {"service": ["gcloud", "run", "services", "describe", SERVICE],
            "iam": ["gcloud", "run", "services", "get-iam-policy", SERVICE],
            "revision": ["gcloud", "run", "revisions", "describe", name or ""]}[kind]
    cmd = base + ["--region", REGION, "--project", PROJECT, "--format=json"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        last = (r.stderr.strip().splitlines() or [""])[-1]
        return {"_error": f"{' '.join(base[:4])} exit {r.returncode}: {mask(last)}"}
    return json.loads(r.stdout)

def db_host_class(value):
    if value.startswith("$"):
        return {"class": "shell-variable-reference", "variable": value.strip("${}")}
    try:
        u = urlsplit(value)
    except ValueError:
        return {"class": "unparseable"}
    host = (u.hostname or "").lower()
    out = {"scheme": u.scheme, "credentials_present": bool(u.username or u.password)}
    q = parse_qs(u.query)
    sock = (q.get("host") or q.get("unix_sock") or [""])[0]
    if u.scheme.startswith("sqlite"):
        out["class"] = "sqlite-file"
        out["path"] = u.path or None  # a file path, not a secret; container disk is ephemeral
    elif u.scheme.startswith("agentengine"):
        out["class"] = "vertex-agent-engine"
        out["resource"] = (u.netloc + u.path) or None
    elif sock.startswith("/cloudsql/"):
        out["class"] = "cloudsql-socket"
        out["instance"] = sock[len("/cloudsql/"):]
    elif host.endswith(".pooler.supabase.com"):
        user = u.username or ""
        out["class"] = "supabase-pooler"
        out["supabase_project_ref"] = user.split(".", 1)[1] if "." in user else None
    elif re.fullmatch(r"db\.[a-z0-9]+\.supabase\.co", host):
        out["class"] = "supabase-direct"
        out["supabase_project_ref"] = host.split(".")[1]
    elif host in ("localhost", "127.0.0.1", "::1"):
        out["class"] = "localhost"
    elif host:
        out["class"] = "other-host"
    else:
        out["class"] = "no-host"
    return out

BOOLISH = {"true", "false", "0", "1", "yes", "no", "on", "off"}
STORAGE_NAME_RE = re.compile(r"(?i)session|database|db_?url|postgres|sqlite|agent_?engine|reasoning_?engine|memory_?service")

def env_entry(e):
    item = {"name": e.get("name")}
    if "valueFrom" in e:
        ref = e["valueFrom"].get("secretKeyRef") or {}
        item["source"] = "secret-ref"
        item["secret"] = ref.get("name")
        item["secret_version_or_key"] = ref.get("key")
    elif "value" in e:
        v = str(e.get("value", ""))
        if re.match(r"^[A-Za-z][A-Za-z0-9+.\-]*://", v):
            item["source"] = "literal-uri"
            item["uri"] = db_host_class(v)
        elif v.strip().lower() in BOOLISH:
            item["source"] = "literal-flag"
            item["value"] = v.strip().lower()
        else:
            item["source"] = "literal (value not printed)"
    if STORAGE_NAME_RE.search(item["name"] or ""):
        item["storage_related_name"] = True
    return item

def find_flag(tokens, flags):
    found = []
    for i, tok in enumerate(tokens):
        for f in flags:
            if tok == f and i + 1 < len(tokens):
                found.append({"flag": f, "value": db_host_class(tokens[i + 1])})
            elif tok.startswith(f + "="):
                found.append({"flag": f, "value": db_host_class(tok.split("=", 1)[1])})
            elif f in tok and " " in tok:  # shell-form command string
                m = re.search(re.escape(f) + r"[ =]+([^\s'\"]+)", tok)
                if m:
                    found.append({"flag": f, "value": db_host_class(m.group(1)), "shell_form": True})
    return found

SESSION_FLAGS = ("--session_service_uri", "--session_db_url", "--session-service-uri", "--memory_service_uri")

def container_view(c):
    cmd = [str(x) for x in (c.get("command") or [])]
    args = [str(x) for x in (c.get("args") or [])]
    joined = " ".join(cmd + args)
    return {
        "image": c.get("image"),
        "command_masked": [mask(x) for x in cmd],
        "args_masked": [mask(x) for x in args],
        "ports": [p.get("containerPort") for p in (c.get("ports") or [])],
        "env": [env_entry(e) for e in (c.get("env") or [])],
        "volume_mounts": [{"name": v.get("name"), "mountPath": v.get("mountPath")} for v in (c.get("volumeMounts") or [])],
        "session_flags": find_flag(cmd + args, SESSION_FLAGS),
        "mentions_adk_cli": bool(re.search(r"\badk\b", joined)),
        "mentions_api_server": "api_server" in joined,
        "resources_limits": (c.get("resources") or {}).get("limits"),
    }

ANN = ("autoscaling.knative.dev/minScale", "autoscaling.knative.dev/maxScale",
       "run.googleapis.com/sessionAffinity", "run.googleapis.com/cloudsql-instances",
       "run.googleapis.com/execution-environment", "run.googleapis.com/cpu-throttling",
       "run.googleapis.com/startup-cpu-boost", "run.googleapis.com/vpc-access-connector",
       "run.googleapis.com/vpc-access-egress")

def template_view(meta, spec):
    ann = (meta or {}).get("annotations") or {}
    return {
        "annotations": {k: ann.get(k) for k in ANN if k in ann},
        "containerConcurrency": spec.get("containerConcurrency"),
        "timeoutSeconds": spec.get("timeoutSeconds"),
        "serviceAccountName": spec.get("serviceAccountName"),
        "containers": [container_view(c) for c in (spec.get("containers") or [])],
        "volumes": [{"name": v.get("name"),
                     "type": next((k for k in v if k != "name"), None),
                     "secret": (v.get("secret") or {}).get("secretName")} for v in (spec.get("volumes") or [])],
    }

def member_class(m):
    if m in ("allUsers", "allAuthenticatedUsers"):
        return m
    kind = m.split(":", 1)[0]
    return m if kind == "serviceAccount" else kind + ":<redacted>"

svc = gcloud("service")
out = {"p0": "APBM001-P0-3 ADK Cloud Run metadata v1",
       "requested": {"service": SERVICE, "region": REGION, "project": PROJECT}}
if "_error" in svc:
    out["service_error"] = svc["_error"]
else:
    meta, spec, status = svc.get("metadata", {}), svc.get("spec", {}), svc.get("status", {})
    ann = meta.get("annotations") or {}
    out["service"] = {
        "name": meta.get("name"),
        "namespace_project": meta.get("namespace"),
        "region_label": (meta.get("labels") or {}).get("cloud.googleapis.com/location"),
        "url": status.get("url"),
        "ingress": ann.get("run.googleapis.com/ingress"),
        "ingress_status": ann.get("run.googleapis.com/ingress-status"),
        "invoker_iam_disabled": ann.get("run.googleapis.com/invoker-iam-disabled"),
        "launch_stage": ann.get("run.googleapis.com/launch-stage"),
        "latestReadyRevisionName": status.get("latestReadyRevisionName"),
        "latestCreatedRevisionName": status.get("latestCreatedRevisionName"),
        "traffic": [{k: t.get(k) for k in ("revisionName", "percent", "latestRevision", "tag")} for t in (status.get("traffic") or [])],
        "conditions": [{k: c.get(k) for k in ("type", "status", "reason")} for c in (status.get("conditions") or [])],
        "template": template_view((spec.get("template") or {}).get("metadata"), (spec.get("template") or {}).get("spec") or {}),
    }
    serving = sorted({t.get("revisionName") or status.get("latestReadyRevisionName")
                      for t in (status.get("traffic") or []) if (t.get("percent") or 0) > 0} - {None, ""})
    out["serving_revisions"] = []
    for rev in serving:
        r = gcloud("revision", rev)
        if "_error" in r:
            out["serving_revisions"].append({"name": rev, "error": r["_error"]})
            continue
        rm = r.get("metadata", {})
        out["serving_revisions"].append({
            "name": rm.get("name"),
            "created": rm.get("creationTimestamp"),
            "imageDigest": (r.get("status") or {}).get("imageDigest"),
            **template_view(rm, r.get("spec") or {}),
        })

iam = gcloud("iam")
if "_error" in iam:
    out["iam_error"] = iam["_error"]
else:
    bindings = [{"role": b.get("role"), "members": sorted(member_class(m) for m in (b.get("members") or []))}
                for b in (iam.get("bindings") or [])]
    out["iam"] = {"bindings": bindings,
                  "public_principals_present": sorted({m for b in bindings for m in b["members"] if m in ("allUsers", "allAuthenticatedUsers")})}

# Hints only (not verdicts): the addendum interprets these.
hints = []
for scope in [out.get("service", {}).get("template", {})] + out.get("serving_revisions", []):
    for c in scope.get("containers", []) if isinstance(scope, dict) else []:
        if c["session_flags"]:
            hints.append({"signal": "explicit session flag", "detail": c["session_flags"]})
        for e in c["env"]:
            if e.get("storage_related_name"):
                hints.append({"signal": "storage-related env name", "detail": e})
        if c["mentions_adk_cli"] and c["mentions_api_server"] and not c["session_flags"]:
            hints.append({"signal": "adk api_server without a session flag in command/args"})
        if not c["mentions_adk_cli"]:
            hints.append({"signal": "entrypoint not visible as `adk` CLI (image default or custom server); session config may be in code: run P0-4"})
out["storage_hints"] = hints
print(json.dumps(out, indent=2, sort_keys=True, default=str))
PY
