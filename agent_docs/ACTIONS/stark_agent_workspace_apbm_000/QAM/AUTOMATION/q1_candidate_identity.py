#!/usr/bin/env python3
"""Q1 intake instrument (disposable, read-only).

Independently re-derives candidate identity from Git objects at HEAD and compares
it with the Engineer's recorded scope/inventory/protected/frozen hashes.
Uses only read-only git plumbing (rev-parse, show, diff, ls-tree, status).
Writes one JSON result to QAM/evidence/q1-attempt-001/.
"""
import hashlib, json, subprocess, sys, datetime, pathlib

REPO = pathlib.Path(__file__).resolve().parents[5]
MOD = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000"
ENG = f"{MOD}/evidence/engineering-attempt-001"
BASE = "20ef380bdd6eed5e111d953d6404992add7a88a6"
OUT = REPO / MOD / "QAM/evidence/q1-attempt-001/candidate-identity-check.json"


def git(*a, binary=False):
    r = subprocess.run(["git", "-C", str(REPO), *a], capture_output=True)
    if r.returncode != 0:
        return None
    return r.stdout if binary else r.stdout.decode()


def blob_sha(rev, path):
    b = git("show", f"{rev}:{path}", binary=True)
    return None if b is None else hashlib.sha256(b).hexdigest()


def wt_sha(path):
    p = REPO / path
    return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None


def load(name):
    return json.loads((REPO / ENG / name).read_text())


head = git("rev-parse", "HEAD").strip()
res = {
    "recorded_at": datetime.datetime.now().astimezone().isoformat(),
    "instrument": f"{MOD}/QAM/AUTOMATION/q1_candidate_identity.py",
    "branch": git("rev-parse", "--abbrev-ref", "HEAD").strip(),
    "head": head,
    "head_parents": git("rev-list", "--parents", "-n1", "HEAD").split()[1:],
    "baseline": BASE,
    "status_porcelain": git("status", "--porcelain=v1", "--untracked-files=all"),
}

# 1. 218 candidate-scope inputs
scope = load("candidate-scope.json")
mism = []
for i in scope["inputs"]:
    h, w = blob_sha("HEAD", i["path"]), wt_sha(i["path"])
    if h != i["sha256"] or w != i["sha256"]:
        mism.append({"path": i["path"], "recorded": i["sha256"], "head": h, "worktree": w})
res["candidate_scope"] = {
    "file_sha256": wt_sha(f"{ENG}/candidate-scope.json"),
    "inputs": len(scope["inputs"]),
    "mismatches": mism,
}

# 2. 28 changed-source inventory
inv = load("changed-source-inventory.json")
res["changed_source_inventory"] = {
    "entries": len(inv),
    "mismatches": [
        {"path": x["path"], "recorded": x["candidate_sha256"], "head": blob_sha("HEAD", x["path"])}
        for x in inv if blob_sha("HEAD", x["path"]) != x["candidate_sha256"]
    ],
}

# 3. 191 protected files: baseline == HEAD == recorded
prot = load("protected-file-equality.json")
pm = []
for x in prot["files"]:
    b, h = blob_sha(BASE, x["path"]), blob_sha("HEAD", x["path"])
    if not (b == h == x["candidate_sha256"] == x["entry_sha256"]):
        pm.append({"path": x["path"], "baseline": b, "head": h, "recorded": x["candidate_sha256"]})
res["protected_files"] = {"compared": len(prot["files"]), "mismatches": pm}

# 4. 171 frozen packet files (allow documented relocation edits)
frozen = load("frozen-packet-equality.json")
reloc = {d["path"]: d["after_sha256"] for d in load("handoff-location-correction.json")["changed_documents"]}
fm = []
for x in frozen["files"]:
    h = blob_sha("HEAD", x["path"])
    if h != x["sha256"]:
        fm.append({"path": x["path"], "recorded": x["sha256"], "head": h,
                   "explained_by_relocation": reloc.get(x["path"]) == h})
res["frozen_packet"] = {"compared": len(frozen["files"]), "mismatches": fm}
res["relocation_docs"] = [
    {"path": p, "after": a, "head": blob_sha("HEAD", p), "equal": blob_sha("HEAD", p) == a}
    for p, a in reloc.items()
]

# 5. Commit content vs staging allowlist
staging = set((REPO / ENG / "staging-paths.txt").read_text().split("\n")) - {""}
ns = [l.split("\t") for l in git("diff", "--name-status", "--no-renames", BASE, "HEAD").splitlines()]
changed = {p[-1]: p[0] for p in ns}
outside = {p: s for p, s in changed.items() if p not in staging}
res["commit_vs_staging"] = {
    "commit_paths": len(changed),
    "staging_paths": len(staging),
    "staging_not_in_commit": sorted(p for p in staging if p not in changed),
    "commit_outside_staging": outside,
    "deleted_in_commit": sorted(p for p, s in changed.items() if s == "D"),
}

# 6. Product/config/test/dependency drift outside the 28 declared files
inv_paths = {x["path"] for x in inv}
code = [p for p in changed if not p.startswith("agent_docs/") and p not in inv_paths]
res["undeclared_code_or_config_changes"] = {p: changed[p] for p in code}

# 7. Contract identity at HEAD
res["contract_hashes_head"] = {
    n: blob_sha("HEAD", f"{MOD}/{n}")
    for n in ["ACCEPTANCE_SPEC.md", "RULINGS_ADDENDUM.md", "GOVERNANCE.md", "KNOWN_LIMITS.md",
              "DATA_CONTRACT.md", "FILE_SCOPE.md", "QAM/QAM_RISK_REQUIREMENTS.md",
              "QAM/HANDOFFS/QA_HANDOFF.md", "QAM/QAM_ENTRY.md"]
}

ok = (head and not res["status_porcelain"] and not mism and not res["changed_source_inventory"]["mismatches"]
      and not pm and all(m["explained_by_relocation"] for m in fm)
      and not res["undeclared_code_or_config_changes"])
res["verdict"] = "CANDIDATE_EQUIVALENT" if ok else "DRIFT_OR_GAP_FOUND"

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(res, indent=2) + "\n")
print(json.dumps({k: (v if not isinstance(v, (dict, list)) or k == "verdict" else "...") for k, v in res.items()}, indent=1))
print("verdict:", res["verdict"])
