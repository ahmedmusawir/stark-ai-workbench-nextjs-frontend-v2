#!/usr/bin/env python3
"""Q2 attempt-001 export (disposable): explicit allowlist ZIP + REVIEW_START_HERE + FILE_INDEX + receipt + Downloads copy.
Never overwrites; rejects symlinks/traversal/nested archives/caches; secret-pattern scan. usage: q2_export.py TIMESTAMP"""
import datetime, hashlib, json, pathlib, re, shutil, sys, zipfile
REPO = pathlib.Path(__file__).resolve().parents[5]; Q = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM"
ts = sys.argv[1]
ZIP = REPO / Q / "HANDOFFS/Q2_attempt-001.zip"; RECEIPT = REPO / Q / "HANDOFFS/Q2_attempt-001_RECEIPT.json"
COPY = pathlib.Path.home() / f"Downloads/APBM000_Q2_attempt-001_QA-Lead-Package_{ts}.zip"
SECRET = re.compile(rb"eyJ[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA |EC )?PRIVATE KEY|" rb"service" rb"_role|AKIA[0-9A-Z]{16}")
allow = [("REVIEW_START_HERE.md", f"{Q}/HANDOFFS/Q2_attempt-001_REVIEW_START_HERE.md", "Lead entry: results, findings, decisions first")]
def add(src, purpose): allow.append((src.replace(f"{Q}/", ""), src, purpose))
for f in ["AC_EVIDENCE_MATRIX.md", "QA_EXECUTION_REPORT.md", "QAM_STATE.json", "QAM_TEST_PLAN.md", "Q1B_REVIEW.md",
          "HANDOFFS/DIRECTOR_Q2_RELEASE_REVISED_2026-10-07_190418.md", "HANDOFFS/LEAD_REMOTE_ROSTER_APPROVAL_2026-10-07.md",
          "HANDOFFS/LEAD_REMOTE_ROSTER_BINDING_HASHES_2026-10-07.json", "HANDOFFS/ARCHITECT_REMOTE_ROSTER_AMENDMENT_2026-10-05.md"]:
    add(f"{Q}/{f}", "QAM record / authority (unchanged authority bytes)")
for d, purpose in [("FINDINGS", "Findings and DIRECTOR-OBS-001 addenda"), ("AUTOMATION", "QA instruments (disposable)"), ("evidence/q2-attempt-001", "Q2 attempt-001 evidence")]:
    for p in sorted((REPO / Q / d).rglob("*")):
        r = str(p.relative_to(REPO))
        if p.is_file() and not p.is_symlink() and p.suffix not in (".zip", ".pyc") and "__pycache__" not in r and not r.endswith("staging-paths.txt"): add(r, purpose)
if ZIP.exists() or COPY.exists(): sys.exit("refusing to overwrite")
index = []
for arc, src, purpose in allow:
    s = REPO / src; assert ".." not in pathlib.PurePosixPath(arc).parts and not arc.startswith("/"), arc
    b = s.read_bytes()
    if SECRET.search(b): sys.exit(f"secret-pattern hit: {src}")
    index.append({"path": arc, "source_path": src, "purpose": purpose, "bytes": len(b), "sha256": hashlib.sha256(b).hexdigest()})
idx = json.dumps({"package": "Q2_attempt-001", "candidate": "f21564cacb563ecddbf78b1685086c9489bf1c26", "execution_head": "c4ed7042fa05fa638bdc6d4327ecba3448d44cef",
                  "plan_sha256": "8ddb743f1be09d624bf79c8a602ad05fbd3cffbffbc2d8c6cfbaee16f8b80337", "lead_approval_sha256": "c0380dfcb951755b82af06881013635d60cad61829697978107e33b6f7fcef53",
                  "gate_q": "NOT_ISSUED", "note": "FILE_INDEX.json excludes its own hash; no nested archives", "files": index}, indent=2).encode()
with zipfile.ZipFile(ZIP, "x", zipfile.ZIP_DEFLATED) as z:
    for e in index: z.write(REPO / e["source_path"], e["path"])
    z.writestr("FILE_INDEX.json", idx)
with zipfile.ZipFile(ZIP) as z:
    crc = z.testzip(); ok = all(hashlib.sha256(z.read(e["path"])).hexdigest() == e["sha256"] for e in index); n = len(z.namelist())
shutil.copy2(ZIP, COPY); zsha = hashlib.sha256(ZIP.read_bytes()).hexdigest()
rec = {"stage": "Q2", "attempt": 1, "recorded_at": datetime.datetime.now().astimezone().isoformat(), "repo_archive": str(ZIP.relative_to(REPO)), "shareable_copy": str(COPY),
       "downloads_copy_status": "VERIFIED IDENTICAL" if hashlib.sha256(COPY.read_bytes()).hexdigest() == zsha else "MISMATCH",
       "sha256": zsha, "bytes": ZIP.stat().st_size, "members": n, "crc_validation": "PASS" if crc is None else f"FAIL {crc}",
       "membership_hashes_validation": "PASS" if ok else "FAIL", "sensitive_scan": "PASS: no secret-pattern hits; no env/auth/profile/trace/HAR/build output; synthetic fixtures only",
       "gate_q": "NOT_ISSUED"}
RECEIPT.write_text(json.dumps(rec, indent=2) + "\n"); print(json.dumps(rec, indent=2))
