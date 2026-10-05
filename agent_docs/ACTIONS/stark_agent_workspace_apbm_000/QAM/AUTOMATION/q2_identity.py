#!/usr/bin/env python3
"""Q2 identity instrument (disposable, read-only) per QAM_TEST_PLAN v0.2 §11.1.

Pins an explicit product candidate separately from the execution HEAD, proves ancestry,
lists every intervening commit/path, and compares candidate blobs, HEAD blobs AND
working-tree bytes for every product/config/test/dependency/design/contract path.
Raw anomalies are retained with a per-path class; nothing is silently waived.

Git use: read-only plumbing with --no-optional-locks. With --worktree pointing elsewhere
(self-test), GIT_WORK_TREE and a TEMPORARY index copy are used; the real index is never written.

usage: q2_identity.py --candidate SHA --out FILE [--head REV] [--worktree DIR] [--approved JSON]
       q2_identity.py --selftest SCRATCH_DIR
"""
import argparse, datetime, hashlib, json, os, pathlib, shutil, subprocess, sys, tarfile, io

REPO = pathlib.Path(__file__).resolve().parents[5]
MOD = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000"
QAM = f"{MOD}/QAM/"
ENG = f"{MOD}/evidence/engineering-attempt-001"
BASE = "20ef380bdd6eed5e111d953d6404992add7a88a6"
BRANCH = "qa/frontend-apbm-000"
CONTRACT = {f"{MOD}/ACCEPTANCE_SPEC.md": "57f8d9f4dec8ca826326067254b0916ef65ccd51b635a8ac6ead73e8ab469fcc",
            f"{MOD}/RULINGS_ADDENDUM.md": "99d4c40f7094106f4386d4d8ff5535228feb653dcbe0fd948a14a0ff1ec3b36f"}
NEXT_ENV = "next-env.d.ts"


class Git:
    def __init__(self, worktree):
        self.env = dict(os.environ, GIT_OPTIONAL_LOCKS="0")
        self.worktree = pathlib.Path(worktree).resolve()
        if self.worktree != REPO:
            tmp_index = self.worktree.parent / (self.worktree.name + ".index")
            shutil.copy2(REPO / ".git/index", tmp_index)
            self.env.update(GIT_DIR=str(REPO / ".git"), GIT_WORK_TREE=str(self.worktree), GIT_INDEX_FILE=str(tmp_index))

    def run(self, *a, binary=False, ok=(0,)):
        r = subprocess.run(["git", "--no-optional-locks", *a], cwd=self.worktree, env=self.env, capture_output=True)
        if r.returncode not in ok:
            raise RuntimeError(f"git {' '.join(a)} -> {r.returncode}: {r.stderr.decode()[:300]}")
        return r if ok != (0,) else (r.stdout if binary else r.stdout.decode())

    def tree(self, rev):  # path -> blob oid
        out = {}
        for line in self.run("ls-tree", "-r", "-z", rev, binary=True).split(b"\0"):
            if line:
                meta, path = line.split(b"\t", 1)
                out[path.decode()] = meta.split()[2].decode()
        return out

    def blobs_sha256(self, oids):  # oid -> sha256 via one cat-file --batch
        uniq = sorted(set(oids))
        r = subprocess.run(["git", "--no-optional-locks", "cat-file", "--batch"], cwd=self.worktree, env=self.env,
                           input=("\n".join(uniq) + "\n").encode(), capture_output=True, check=True).stdout
        res, i = {}, 0
        for oid in uniq:
            nl = r.index(b"\n", i); size = int(r[i:nl].split()[2]); body = r[nl + 1:nl + 1 + size]
            res[oid] = hashlib.sha256(body).hexdigest(); i = nl + 1 + size + 1
        return res


def sha_file(p):
    return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() and not p.is_symlink() else None


def classify(path):
    if path.startswith(QAM):
        return "QAM"
    if path.startswith(f"{MOD}/DESIGN/") or path in CONTRACT:
        return "DESIGN_OR_CONTRACT"
    if path.startswith("agent_docs/"):
        return "DOCS_OUTSIDE_QAM"
    return "PRODUCT_CONFIG_TEST_DEP"


def load_json(rel):
    return json.loads((REPO / rel).read_text())


def check(candidate, head, worktree, approved_path, out):
    g = Git(worktree)
    wt = g.worktree
    head_sha = g.run("rev-parse", head).strip()
    cand_sha = g.run("rev-parse", candidate).strip()
    anomalies = []
    def anomaly(kind, path, detail, cls=None):
        anomalies.append({"kind": kind, "path": path, "class": cls if cls else (classify(path) if path else "-"), "detail": detail})

    branch = g.run("rev-parse", "--abbrev-ref", "HEAD").strip()
    if head == "HEAD" and branch != BRANCH:
        anomaly("WRONG_BRANCH", "", f"{branch} != {BRANCH}", "IDENTITY")
    is_anc = g.run("merge-base", "--is-ancestor", cand_sha, head_sha, ok=(0, 1)).returncode == 0
    if not is_anc:
        anomaly("CANDIDATE_NOT_ANCESTOR", "", f"{cand_sha} not ancestor of {head_sha}", "IDENTITY")

    # Intervening commits and every path they touch
    commits = []
    if is_anc:
        for c in g.run("rev-list", "--reverse", f"{cand_sha}..{head_sha}").split():
            ns = [l.split("\t") for l in g.run("diff-tree", "--no-commit-id", "-r", "-M", "--name-status", c).splitlines()]
            commits.append({"sha": c, "subject": g.run("log", "-1", "--format=%s", c).strip(),
                            "paths": [{"status": p[0], "path": p[-1], **({"from": p[1]} if len(p) == 3 else {}),
                                       "class": classify(p[-1])} for p in ns]})

    # Approved QAM record hashes (explicit, per path)
    approved = json.loads(pathlib.Path(approved_path).read_text())["files"] if approved_path else {}

    # Blob + working-tree comparison of all product/design/contract paths
    ct, ht = g.tree(cand_sha), g.tree(head_sha)
    scope = sorted(p for p in set(ct) | set(ht) if classify(p) in ("PRODUCT_CONFIG_TEST_DEP", "DESIGN_OR_CONTRACT"))
    sha = g.blobs_sha256([ct[p] for p in scope if p in ct] + [ht[p] for p in scope if p in ht])
    compared = 0
    for p in scope:
        c = sha.get(ct.get(p)); h = sha.get(ht.get(p)); w = sha_file(wt / p)
        compared += 1
        if c != h:
            anomaly("COMMITTED_DIFF_FROM_CANDIDATE", p, {"candidate": c, "head": h})
        if w != c:
            anomaly("WORKTREE_DIFF_FROM_CANDIDATE", p, {"candidate": c, "worktree": w})
    for p, exp in CONTRACT.items():
        if sha_file(wt / p) != exp:
            anomaly("CONTRACT_HASH_MISMATCH", p, {"expected": exp, "worktree": sha_file(wt / p)})

    # Untracked (not ignored) and staged paths
    for p in g.run("ls-files", "--others", "--exclude-standard", "-z").split("\0"):
        if not p:
            continue
        cls = classify(p)
        if cls == "QAM":
            if approved.get(p, {}).get("sha256") != sha_file(wt / p):
                anomaly("QAM_UNTRACKED_UNLISTED_OR_HASH", p, {"worktree": sha_file(wt / p), "approved": approved.get(p)})
        else:
            anomaly("UNTRACKED_" + cls, p, {"worktree": sha_file(wt / p)})
    for line in g.run("diff", "--cached", "--name-status").splitlines():
        anomaly("STAGED_CHANGE", line.split("\t")[-1], line)
    # Tracked QAM paths that differ from HEAD in the worktree, or changed since candidate
    for p in sorted(set(g.run("diff", "--name-only", cand_sha).split()) | set(g.run("diff", "--name-only", cand_sha, head_sha).split())):
        if classify(p) == "QAM" and approved.get(p, {}).get("sha256") != sha_file(wt / p):
            anomaly("QAM_CHANGED_UNLISTED_OR_HASH", p, {"worktree": sha_file(wt / p), "approved": approved.get(p)})
        elif classify(p) == "DOCS_OUTSIDE_QAM":
            anomaly("DOCS_OUTSIDE_QAM_CHANGED", p, {"worktree": sha_file(wt / p)})

    # Engineer records: 28 changed, 191 protected, 218 pinned scope, next-env.d.ts
    inv = load_json(f"{ENG}/changed-source-inventory.json")
    for x in inv:
        if sha.get(ct.get(x["path"])) != x["candidate_sha256"] or sha_file(wt / x["path"]) != x["candidate_sha256"]:
            anomaly("CHANGED_INVENTORY_MISMATCH", x["path"], x["candidate_sha256"])
    prot = load_json(f"{ENG}/protected-file-equality.json")["files"]
    bt = g.tree(BASE); bsha = g.blobs_sha256([bt[x["path"]] for x in prot if x["path"] in bt])
    for x in prot:
        vals = {bsha.get(bt.get(x["path"])), sha.get(ct.get(x["path"])), sha_file(wt / x["path"]), x["candidate_sha256"]}
        if len(vals) != 1:
            anomaly("PROTECTED_MISMATCH", x["path"], sorted(map(str, vals)))
    pinned = load_json(f"{ENG}/candidate-scope.json")["inputs"]
    for x in pinned:
        if sha_file(wt / x["path"]) != x["sha256"]:
            anomaly("PINNED_INPUT_WORKTREE_MISMATCH", x["path"], {"recorded": x["sha256"], "worktree": sha_file(wt / x["path"])})
        elif x["path"] == NEXT_ENV:
            pass  # gitignored generated header: worktree bytes verified above; no blob exists by design
        elif sha.get(ct.get(x["path"])) != x["sha256"]:
            anomaly("PINNED_INPUT_BLOB_MISMATCH", x["path"], x["sha256"])

    # Root handoff pointer placement (§11.1): report only
    root_ptr = f"{MOD}/QA_HANDOFF.md"
    if (wt / root_ptr).exists():
        anomaly("ROOT_HANDOFF_POINTER_PRESENT", root_ptr, "Report to Architect/Cody; Executor does not edit outside QAM", "PLACEMENT")

    blocking = [a for a in anomalies if a["class"] in ("IDENTITY", "PRODUCT_CONFIG_TEST_DEP", "DESIGN_OR_CONTRACT")
                or a["kind"] in ("CHANGED_INVENTORY_MISMATCH", "PROTECTED_MISMATCH", "PINNED_INPUT_WORKTREE_MISMATCH",
                                 "PINNED_INPUT_BLOB_MISMATCH", "CONTRACT_HASH_MISMATCH", "STAGED_CHANGE")]
    res = {
        "recorded_at": datetime.datetime.now().astimezone().isoformat(),
        "instrument": f"{QAM}AUTOMATION/q2_identity.py", "instrument_sha256": sha_file(pathlib.Path(__file__)),
        "product_candidate": cand_sha, "execution_head": head_sha, "branch": branch, "worktree": str(wt),
        "candidate_is_ancestor": is_anc, "intervening_commits": commits,
        "paths_compared_blob_and_worktree": compared, "inventory_checked": len(inv), "protected_checked": len(prot),
        "pinned_checked": len(pinned), "approved_qam_manifest": str(approved_path) if approved_path else None,
        "raw_anomalies": anomalies,
        "raw_verdict": "PRODUCT_EQUIVALENT" if not blocking else "PRODUCT_DRIFT_OR_IDENTITY_FAILURE",
        "blocking_anomaly_count": len(blocking),
        "nonblocking_anomalies_need_adjudication": len(anomalies) - len(blocking),
    }
    out = pathlib.Path(out)
    if out.exists():
        sys.exit(f"refusing to overwrite {out}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(res, indent=2) + "\n")
    return res


def selftest(scratch):
    """Expected-red controls on disposable inputs only (never the real product tree)."""
    scratch = pathlib.Path(scratch).resolve(); scratch.mkdir(parents=True, exist_ok=True)
    results = {}
    # 1. Non-ancestor HEAD: candidate 22ce03b vs HEAD=baseline (read-only)
    r = check("22ce03ba3871ea53e5253f2e3f060a1bab3226a3", BASE, REPO, None, scratch / "st1.json")
    results["non_ancestor_head"] = any(a["kind"] == "CANDIDATE_NOT_ANCESTOR" for a in r["raw_anomalies"])
    # 2. Unauthorized source addition + mutated product file: disposable worktree = git archive of candidate
    wt = scratch / "wt"; wt.mkdir()
    tar = subprocess.run(["git", "--no-optional-locks", "archive", "22ce03ba3871ea53e5253f2e3f060a1bab3226a3"],
                         cwd=REPO, capture_output=True, check=True).stdout
    tarfile.open(fileobj=io.BytesIO(tar)).extractall(wt, filter="data")
    shutil.copy2(REPO / NEXT_ENV, wt / NEXT_ENV)
    (wt / "src/__qa_selftest_unauthorized.ts").write_text("export const x = 1;\n")
    with open(wt / "src/config/manifest.ts", "a") as f:
        f.write("\n// qa selftest mutation\n")
    r = check("22ce03ba3871ea53e5253f2e3f060a1bab3226a3", "22ce03ba3871ea53e5253f2e3f060a1bab3226a3", wt, None, scratch / "st2.json")
    kinds = {(a["kind"], a["path"]) for a in r["raw_anomalies"]}
    results["unauthorized_source_addition"] = ("UNTRACKED_PRODUCT_CONFIG_TEST_DEP", "src/__qa_selftest_unauthorized.ts") in kinds
    results["mutated_product_file"] = ("WORKTREE_DIFF_FROM_CANDIDATE", "src/config/manifest.ts") in kinds
    # 3. Mutated copied record: approved-QAM manifest with one wrong hash must be reported
    rec = scratch / "approved-mutated.json"
    rec.write_text(json.dumps({"files": {f"{QAM}QAM_TEST_PLAN.md": {"sha256": "0" * 64}}}))
    r = check("22ce03ba3871ea53e5253f2e3f060a1bab3226a3", "HEAD", REPO, rec, scratch / "st3.json")
    results["mutated_copied_record"] = any(a["path"] == f"{QAM}QAM_TEST_PLAN.md" and a["kind"].startswith("QAM_")
                                           for a in r["raw_anomalies"])
    results["all_controls_red_as_expected"] = all(results.values())
    print(json.dumps(results, indent=2))
    return results


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--candidate"); ap.add_argument("--head", default="HEAD"); ap.add_argument("--worktree", default=str(REPO))
    ap.add_argument("--approved"); ap.add_argument("--out"); ap.add_argument("--selftest")
    a = ap.parse_args()
    if a.selftest:
        sys.exit(0 if selftest(a.selftest)["all_controls_red_as_expected"] else 1)
    r = check(a.candidate, a.head, a.worktree, a.approved, a.out)
    print(json.dumps({k: r[k] for k in ("product_candidate", "execution_head", "branch", "candidate_is_ancestor",
                                        "paths_compared_blob_and_worktree", "raw_verdict", "blocking_anomaly_count",
                                        "nonblocking_anomalies_need_adjudication")}, indent=1))
    for x in r["raw_anomalies"]:
        print(f'  [{x["class"]}] {x["kind"]}: {x["path"]}')
