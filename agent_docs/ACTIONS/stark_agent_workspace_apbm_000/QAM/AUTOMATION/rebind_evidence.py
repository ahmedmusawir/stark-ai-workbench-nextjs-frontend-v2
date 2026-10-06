#!/usr/bin/env python3
"""Remote-roster rebind evidence (disposable, read-only) per ARCHITECT_REMOTE_ROSTER_AMENDMENT_2026-10-05.

Commit-bound: every product fact is read from Git objects of the named commits
(git --no-optional-locks; no index/worktree writes). Writes only into OUT dir; refuses to overwrite.
usage: rebind_evidence.py OUT_DIR
"""
import datetime, hashlib, json, pathlib, subprocess, sys

REPO = pathlib.Path(__file__).resolve().parents[5]
OLD = "22ce03ba3871ea53e5253f2e3f060a1bab3226a3"
NEW = "f21564cacb563ecddbf78b1685086c9489bf1c26"
MOD = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000"
PATHS = ["config/agents.manifest.json", "config/agents.manifest-hermes.json", "config/agents.manifest copy.json"]
AMENDMENT = {  # exact table from the Architect amendment
    "config/agents.manifest.json": ("638e95a166e9e196175bd630ce76560db1ef98dbe72d40f31d9a109782027ae8",
                                    "6c27f420127db7125a43ddba6347470b19d3be39769b44bb2b85bd6d9526b6d9", "M"),
    "config/agents.manifest-hermes.json": (None, "638e95a166e9e196175bd630ce76560db1ef98dbe72d40f31d9a109782027ae8", "A"),
    "config/agents.manifest copy.json": ("6c27f420127db7125a43ddba6347470b19d3be39769b44bb2b85bd6d9526b6d9", None, "D"),
}


def git(*a, binary=False, ok=(0,)):
    r = subprocess.run(["git", "--no-optional-locks", *a], cwd=REPO, capture_output=True)
    if r.returncode not in ok:
        raise RuntimeError(f"git {a}: {r.stderr.decode()[:200]}")
    return r.stdout if binary else r.stdout.decode()


def blob(rev, path):
    r = subprocess.run(["git", "--no-optional-locks", "show", f"{rev}:{path}"], cwd=REPO, capture_output=True)
    return r.stdout if r.returncode == 0 else None


def classify(p):
    if p.startswith(f"{MOD}/QAM/"):
        return "QAM"
    if p.startswith("agent_docs/"):
        return "DOCS_OUTSIDE_QAM"
    return "PRODUCT_CONFIG_TEST_DEP"


out = pathlib.Path(sys.argv[1])
if out.exists():
    sys.exit(f"refusing to overwrite {out}")
(out / "blobs").mkdir(parents=True)
res = {"recorded_at": datetime.datetime.now().astimezone().isoformat(),
       "instrument": f"{MOD}/QAM/AUTOMATION/rebind_evidence.py",
       "old_candidate": OLD, "new_candidate": NEW,
       "new_commit_resolved": git("rev-parse", f"{NEW}^{{commit}}").strip(),
       "new_parent": git("rev-parse", f"{NEW}^").strip(),
       "old_is_ancestor_of_new": git("merge-base", "--is-ancestor", OLD, NEW, ok=(0, 1)) == "" and
                                 subprocess.run(["git", "--no-optional-locks", "merge-base", "--is-ancestor", OLD, NEW], cwd=REPO).returncode == 0,
       "current_head": git("rev-parse", "HEAD").strip()}

# 1. Exact three-file diff (binary-safe, no textconv/renames)
diff = git("diff", "--no-ext-diff", "--no-textconv", "--no-renames", "--binary", OLD, NEW, "--", *PATHS, binary=True)
(out / "config-delta.patch").write_bytes(diff)
res["config_delta_patch_sha256"] = hashlib.sha256(diff).hexdigest()

# 2. Blobs + hashes, checked against the Architect table
files = []
for p in PATHS:
    row = {"path": p}
    for tag, rev in (("old", OLD), ("new", NEW)):
        b = blob(rev, p)
        row[f"{tag}_sha256"] = hashlib.sha256(b).hexdigest() if b is not None else None
        if b is not None:
            name = f"{tag}-{p.replace('/', '__').replace(' ', '_')}"
            (out / "blobs" / name).write_bytes(b)
            row[f"{tag}_blob_file"] = f"blobs/{name}"
    exp_old, exp_new, status = AMENDMENT[p]
    row["amendment_status"] = status
    row["matches_amendment"] = row["old_sha256"] == exp_old and row["new_sha256"] == exp_new
    files.append(row)
res["files"] = files

# 3. Bundles and agent-to-bundle assignment from actual JSON
def roster(b):
    d = json.loads(b)
    return {"bundles": [{"id": x["id"], "urlEnv": x.get("urlEnv"), "label": x.get("label")} for x in d["bundles"]],
            "agents": [{"name": a["name"], "bundle": a["bundle"], "label": a.get("label")} for a in d["agents"]]}
old_active, new_active = roster(blob(OLD, PATHS[0])), roster(blob(NEW, PATHS[0]))
res["active_manifest"] = {"old": old_active, "new": new_active,
                          "bundles_identical": old_active["bundles"] == new_active["bundles"],
                          "every_new_agent_bundle_declared": all(a["bundle"] in {b["id"] for b in new_active["bundles"]} for a in new_active["agents"]),
                          "new_agent_names_unique": len({a["name"] for a in new_active["agents"]}) == len(new_active["agents"])}

# 4. Full changed-path list old -> new, classified
ns = [l.split("\t") for l in git("diff", "--name-status", "--no-renames", OLD, NEW).splitlines()]
changes = [{"status": s[0], "path": s[-1], "class": classify(s[-1])} for s in ns]
res["changed_paths_old_to_new"] = changes
res["changed_path_counts"] = {c: sum(1 for x in changes if x["class"] == c) for c in ("QAM", "DOCS_OUTSIDE_QAM", "PRODUCT_CONFIG_TEST_DEP")}
res["product_changes_exactly_amendment"] = sorted(x["path"] for x in changes if x["class"] == "PRODUCT_CONFIG_TEST_DEP") == sorted(PATHS)

# 5. Importers of any agents.manifest* file at NEW (commit-bound git grep, all tracked non-doc files)
g = subprocess.run(["git", "--no-optional-locks", "grep", "-n", "-I", "-e", "agents.manifest", NEW, "--", ".", ":!agent_docs", ":!config"],
                   cwd=REPO, capture_output=True).stdout.decode()
hits = [l.split(":", 1)[1] for l in g.splitlines()]
res["manifest_references_at_new"] = hits
res["import_statements"] = [h for h in hits if "import " in h or "require(" in h]
res["only_manifest_ts_imports_active"] = (
    all(h.startswith(("src/config/manifest.ts", "src/__tests__/config/manifest.test.ts")) for h in res["import_statements"])
    and not any("manifest-hermes" in h or "manifest copy" in h for h in hits))

# 6. Working tree vs NEW for the three paths, root pointer, next-env provenance
res["worktree_vs_new"] = {p: {"worktree_sha256": hashlib.sha256((REPO / p).read_bytes()).hexdigest() if (REPO / p).is_file() else None}
                          for p in PATHS}
ne = (REPO / "next-env.d.ts").read_bytes()
pinned = "7b550dda9686c16f36a17bf9051d5dbf31e98555b30d114ac49fc49a1e712651"
res["next_env"] = {"worktree_sha256": hashlib.sha256(ne).hexdigest(), "pinned_build_variant_sha256": pinned,
                   "is_pinned_build_variant": hashlib.sha256(ne).hexdigest() == pinned,
                   "is_exact_dev_variant_of_pinned": hashlib.sha256(ne.replace(b"./.next/dev/types/routes.d.ts", b"./.next/types/routes.d.ts")).hexdigest() == pinned
                       and b"./.next/dev/types/routes.d.ts" in ne,
                   "gitignored": subprocess.run(["git", "--no-optional-locks", "check-ignore", "-q", "next-env.d.ts"], cwd=REPO).returncode == 0}
res["root_handoff_pointer_present"] = (REPO / MOD / "QA_HANDOFF.md").exists()

res["verdict"] = ("AMENDMENT_EVIDENCE_CONSISTENT" if all(f["matches_amendment"] for f in files) and res["product_changes_exactly_amendment"]
                  and res["active_manifest"]["bundles_identical"] and res["active_manifest"]["every_new_agent_bundle_declared"]
                  and res["only_manifest_ts_imports_active"] else "AMENDMENT_EVIDENCE_MISMATCH")
(out / "rebind-evidence.json").write_text(json.dumps(res, indent=2) + "\n")
print(json.dumps({k: res[k] for k in ("new_commit_resolved", "new_parent", "old_is_ancestor_of_new", "current_head",
                                      "changed_path_counts", "product_changes_exactly_amendment", "only_manifest_ts_imports_active",
                                      "verdict")}, indent=1))
for f in files:
    print(f["amendment_status"], f["path"], "old", (f["old_sha256"] or "absent")[:12], "new", (f["new_sha256"] or "absent")[:12], "match", f["matches_amendment"])
print("bundles identical:", res["active_manifest"]["bundles_identical"], "| next-env:", res["next_env"])
