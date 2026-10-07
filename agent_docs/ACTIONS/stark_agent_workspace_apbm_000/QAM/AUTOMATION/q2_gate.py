#!/usr/bin/env python3
"""Q2-0 combined approval/identity gate (disposable, read-only) per LEAD_REMOTE_ROSTER_APPROVAL_2026-10-07 L2.

1. Verifies every pin in the Lead binding-hash record and the package index (binding file hash), the frozen
   records manifest against the hash pinned in selective-staging.json, and that the amendment JSON used is the pinned one.
2. Proves branch, revised-candidate ancestry, no merge commits, empty index, no concurrent Next dev/product writer.
3. Runs q2_identity_v2.py with the exact approved arguments and classifies EVERY raw anomaly against an explicit,
   finite allowlist. Anything unexplained blocks, regardless of the tool's raw verdict.
usage: q2_gate.py OUT_DIR [--records PATH] [--binding PATH]   (overrides only for expected-red controls)
"""
import hashlib, json, pathlib, subprocess, sys, datetime

REPO = pathlib.Path(__file__).resolve().parents[5]
MOD = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000"; Q = f"{MOD}/QAM"
CAND = "f21564cacb563ecddbf78b1685086c9489bf1c26"
BIND = f"{Q}/HANDOFFS/LEAD_REMOTE_ROSTER_BINDING_HASHES_2026-10-07.json"
INDEX = f"{Q}/HANDOFFS/LEAD_REMOTE_ROSTER_PACKAGE_INDEX_2026-10-07.json"
RECORDS = f"{Q}/AUTOMATION/q2_qam_records_2026-10-07.json"
STAGING = f"{Q}/evidence/q2-start-prep-2026-10-07/selective-staging.json"
AMEND = f"{Q}/AUTOMATION/roster_amendment_2026-10-05.json"
# Explicit, finite allowlist of non-product anomalies (Lead L3/L6)
ALLOWED_DOCS = {"agent_docs/RESPONSES/response_2026-10-05_114929_apbm-000-q1-qa-intake.md",
                "agent_docs/RESPONSES/response_2026-10-05_182656_apbm-000-q2-pending-decisions.md",
                "agent_docs/RESPONSES/response_2026-10-05_183159_apbm-000-q2-prep-still-blocked.md",
                "agent_docs/RESPONSES/response_2026-10-05_193516_apbm-000-q2-held-ruling-request.md",
                "agent_docs/RESPONSES/response_2026-10-07_184448_apbm-000-q2-hold-lead-files-missing.md",
                "agent_docs/RESPONSES/response_2026-10-07_185841_apbm-000-lead-approval-installed-commit-list.md"}
ALLOWED_QAM_UNLISTED = {RECORDS: "records manifest cannot list itself (Lead L6); pinned in selective-staging.json",
                        STAGING: "staging record pins the records manifest (non-circular)",
                        f"{Q}/HANDOFFS/DIRECTOR_Q2_RELEASE_REVISED_2026-10-07_190418.md": "authorized new release record (Lead L5)"}
ALLOWED_QAM_PREFIX = (f"{Q}/evidence/q2-attempt-001/", f"{Q}/AUTOMATION/")  # append-only Q2 outputs / disposable instruments


def sha(rel):
    p = REPO / rel
    return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None


def git(*a, ok=(0,)):
    r = subprocess.run(["git", "--no-optional-locks", *a], cwd=REPO, capture_output=True, text=True)
    if r.returncode not in ok:
        raise RuntimeError(r.stderr)
    return r


def main(out, records=RECORDS, binding=BIND):
    out = pathlib.Path(out); out = out if out.is_absolute() else (REPO / out); out.mkdir(parents=True, exist_ok=True)
    checks, blocks = [], []
    def check(name, ok, detail=None):
        checks.append({"check": name, "ok": bool(ok), "detail": detail})
        if not ok: blocks.append(name)

    # 1. Authority / tool pins
    b = json.loads((REPO / binding).read_text())
    idx = {e["path"]: e["sha256"] for e in json.loads((REPO / INDEX).read_text())["files"]}
    check("binding_record_matches_package_index", sha(binding) == idx.get("QAM/HANDOFFS/LEAD_REMOTE_ROSTER_BINDING_HASHES_2026-10-07.json"),
          {"actual": sha(binding)})
    check("binding_candidate", b.get("product_candidate") == CAND, b.get("product_candidate"))
    for e in b["files"]:
        check(f"pin:{e['path'].replace(MOD + '/', '')}", sha(e["path"]) == e["sha256"], {"expected": e["sha256"], "actual": sha(e["path"])})
    pinned_records = json.loads((REPO / STAGING).read_text())["records_manifest"]["sha256"]
    check("records_manifest_matches_staging_pin", sha(records) == pinned_records, {"expected": pinned_records, "actual": sha(records)})
    check("amendment_is_pinned_file", any(e["path"] == AMEND and e["sha256"] == sha(AMEND) for e in b["files"]))
    for rel, pin in [(f"{Q}/HANDOFFS/LEAD_REMOTE_ROSTER_APPROVAL_2026-10-07.md", None)]:
        check("approval_committed_at_HEAD", git("cat-file", "-e", f"HEAD:{rel}", ok=(0, 128)).returncode == 0)

    # 2. Repository conditions
    head = git("rev-parse", "HEAD").stdout.strip()
    check("branch", git("rev-parse", "--abbrev-ref", "HEAD").stdout.strip() == "qa/frontend-apbm-000")
    check("candidate_ancestor_of_head", git("merge-base", "--is-ancestor", CAND, head, ok=(0, 1)).returncode == 0)
    merges = git("rev-list", "--merges", f"{CAND}..{head}").stdout.split()
    check("no_merge_commits_after_candidate", not merges, merges)
    check("index_empty", git("diff", "--cached", "--name-only").stdout.strip() == "")
    ps = subprocess.run(["ps", "-eo", "pid,args"], capture_output=True, text=True).stdout
    writers = [l.strip() for l in ps.splitlines() if ("next dev" in l or "next-server" in l or "next start" in l) and "grep" not in l]
    check("no_next_dev_or_server_process", not writers, writers)
    inter = []
    for c in git("rev-list", "--reverse", f"{CAND}..{head}").stdout.split():
        files = [l.split("\t") for l in git("diff-tree", "--no-commit-id", "-r", "-M", "--name-status", c).stdout.splitlines()]
        inter.append({"commit": c, "subject": git("log", "-1", "--format=%s", c).stdout.strip(), "changes": files})
        for f in files:
            p = f[-1]
            if not (p.startswith(Q + "/") or p in ALLOWED_DOCS):
                blocks.append(f"intervening_unapproved_path:{c[:7]}:{p}")
    check("intervening_paths_only_QAM_or_listed_docs", not any(x.startswith("intervening_unapproved_path") for x in blocks))

    # 3. Identity v2 with exact approved arguments
    ident = out / "q2-0-identity-v2.json"
    r = subprocess.run([sys.executable, "-B", str(REPO / Q / "AUTOMATION/q2_identity_v2.py"), "--candidate", CAND, "--head", "HEAD",
                        "--amendment", str(REPO / AMEND), "--accept-next-env-dev-variant", "--approved", str(REPO / records),
                        "--out", str(ident)], cwd=REPO, capture_output=True, text=True)
    check("identity_tool_exit_0", r.returncode == 0, r.stderr[-500:])
    idr = json.loads(ident.read_text())
    check("identity_raw_verdict_PRODUCT_EQUIVALENT", idr["raw_verdict"] == "PRODUCT_EQUIVALENT", idr["raw_verdict"])
    dispositions = []
    for a in idr["raw_anomalies"]:
        k, p, c = a["kind"], a["path"], a["class"]
        if c == "AMENDMENT" and k == "AMENDED_TRANSITION_VERIFIED":
            d = ("ALLOWED", "Architect amendment exact transition (Lead L1)")
        elif c == "GENERATED_BOUNDED" and k == "NEXT_ENV_DEV_VARIANT" and a["detail"].get("worktree") in (
                "7b550dda9686c16f36a17bf9051d5dbf31e98555b30d114ac49fc49a1e712651", "7ad303e40d4fddf44f156129e397511953a71481c5cfd86b1862649aaaf240cc"):
            d = ("ALLOWED", "next-env.d.ts exact dev variant (Lead L3)")
        elif c == "PLACEMENT" and k == "ROOT_HANDOFF_POINTER_PRESENT":
            d = ("ALLOWED_NONBLOCKING", "root pointer: documentation placement finding (Lead L6)")
        elif c == "DOCS_OUTSIDE_QAM" and p in ALLOWED_DOCS:
            d = ("ALLOWED_NONBLOCKING", "historical RESPONSES documentation (Lead L6)")
        elif c == "QAM" and p in ALLOWED_QAM_UNLISTED:
            d = ("ALLOWED", ALLOWED_QAM_UNLISTED[p])
        elif c == "QAM" and p.startswith(ALLOWED_QAM_PREFIX) and k == "QAM_UNTRACKED_UNLISTED_OR_HASH" and (a["detail"] or {}).get("approved") is None:
            d = ("ALLOWED", "new append-only Q2 output / disposable instrument (untracked, not previously recorded)")
        else:
            d = ("BLOCK", "unexplained anomaly")
            blocks.append(f"anomaly:{k}:{p}")
        dispositions.append({**a, "disposition": d[0], "reason": d[1]})
    res = {"recorded_at": datetime.datetime.now().astimezone().isoformat(), "gate": f"{Q}/AUTOMATION/q2_gate.py",
           "gate_sha256": sha(f"{Q}/AUTOMATION/q2_gate.py"), "candidate": CAND, "execution_head": head,
           "records_manifest": {"path": records, "sha256": sha(records)}, "binding_record": {"path": binding, "sha256": sha(binding)},
           "checks": checks, "intervening_commits": inter, "anomaly_dispositions": dispositions,
           "identity_output": str(ident.relative_to(REPO)), "blocks": blocks,
           "verdict": "Q2_0_PASS" if not blocks else "Q2_0_STOP"}
    (out / "q2-0-gate.json").write_text(json.dumps(res, indent=2) + "\n")
    print(json.dumps({"verdict": res["verdict"], "execution_head": head, "blocks": blocks,
                      "checks_failed": [c["check"] for c in checks if not c["ok"]]}, indent=1))
    return res


if __name__ == "__main__":
    a = sys.argv[1:]
    kw = {}
    if "--records" in a: kw["records"] = a[a.index("--records") + 1]
    if "--binding" in a: kw["binding"] = a[a.index("--binding") + 1]
    r = main(a[0], **kw)
    sys.exit(0 if r["verdict"] == "Q2_0_PASS" else 1)
