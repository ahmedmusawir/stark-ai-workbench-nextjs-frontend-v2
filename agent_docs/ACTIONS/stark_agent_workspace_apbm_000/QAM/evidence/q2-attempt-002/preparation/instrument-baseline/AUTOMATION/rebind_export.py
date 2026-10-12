#!/usr/bin/env python3
"""Rebind review export (disposable): explicit allowlist ZIP + REVIEW_START_HERE + FILE_INDEX + receipt + Downloads copy.
Never overwrites; rejects symlinks/traversal; secret-pattern scan. usage: rebind_export.py TIMESTAMP"""
import datetime, hashlib, json, pathlib, re, shutil, sys, zipfile
REPO = pathlib.Path(__file__).resolve().parents[5]; Q = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM"; M = Q.rsplit("/", 1)[0]
ts = sys.argv[1]
ZIP = REPO / Q / f"HANDOFFS/ROSTER_REBIND_REVIEW_{ts}.zip"; RECEIPT = REPO / Q / f"HANDOFFS/ROSTER_REBIND_REVIEW_{ts}_RECEIPT.json"
COPY = pathlib.Path.home() / f"Downloads/APBM000_Roster-Rebind-Review_{ts}.zip"
SECRET = re.compile(rb"eyJ[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA |EC )?PRIVATE KEY|" rb"service" rb"_role|AKIA[0-9A-Z]{16}")
allow = [("REVIEW_START_HERE.md", f"{Q}/HANDOFFS/ROSTER_REBIND_REVIEW_{ts}.md", "Lead entry: decisions L1-L6 first")]
def add(src, purpose, arc=None): allow.append((arc or src.replace(f"{M}/", ""), src, purpose))
for f in ["HANDOFFS/ARCHITECT_REMOTE_ROSTER_AMENDMENT_2026-10-05.md", "HANDOFFS/ARCHITECT_PACKAGE_INDEX.json"]: add(f"{Q}/{f}", "Architect amendment (installed, index-verified)")
for f in ["HANDOFFS/DIRECTOR_Q2_RELEASE_2026-10-05_193516.md", "HANDOFFS/Q2_RULING_REQUEST_2026-10-05_193516.md", "QAM_STATE.json", "QAM_TEST_PLAN.md", "Q1B_REVIEW.md"]: add(f"{Q}/{f}", "Current QAM record")
for f in ["q2_identity.py", "q2_identity_v2.py", "roster_amendment_2026-10-05.json", "rebind_evidence.py", "rebind_export.py", "q2_approved_qam_records.json"]: add(f"{Q}/AUTOMATION/{f}", "QA tooling (v1 preserved for diff)")
for d in ["evidence/remote-roster-rebind-001", "evidence/q2-prep-003"]:
    for p in sorted((REPO / Q / d).rglob("*")):
        if p.is_file(): add(str(p.relative_to(REPO)), f"Evidence {d}")
for f in ["ACCEPTANCE_SPEC.md", "RULINGS_ADDENDUM.md"]: add(f"{M}/{f}", "Contract (unchanged)", f"contract/{f}")
if ZIP.exists() or COPY.exists(): sys.exit("refusing to overwrite")
index = []
for arc, src, purpose in allow:
    s = REPO / src
    assert ".." not in pathlib.PurePosixPath(arc).parts and not arc.startswith("/"), arc
    if s.is_symlink() or not s.is_file(): sys.exit(f"rejected: {src}")
    b = s.read_bytes()
    if SECRET.search(b): sys.exit(f"secret-pattern hit: {src}")
    index.append({"path": arc, "source_path": src, "purpose": purpose, "bytes": len(b), "sha256": hashlib.sha256(b).hexdigest()})
idx = json.dumps({"package": f"ROSTER_REBIND_REVIEW_{ts}", "old_candidate": "22ce03ba3871ea53e5253f2e3f060a1bab3226a3",
                  "proposed_candidate": "f21564cacb563ecddbf78b1685086c9489bf1c26", "note": "FILE_INDEX.json excludes its own hash", "files": index}, indent=2).encode()
with zipfile.ZipFile(ZIP, "x", zipfile.ZIP_DEFLATED) as z:
    for e in index: z.write(REPO / e["source_path"], e["path"])
    z.writestr("FILE_INDEX.json", idx)
with zipfile.ZipFile(ZIP) as z:
    crc = z.testzip(); ok = all(hashlib.sha256(z.read(e["path"])).hexdigest() == e["sha256"] for e in index); n = len(z.namelist())
shutil.copy2(ZIP, COPY); zsha = hashlib.sha256(ZIP.read_bytes()).hexdigest()
rec = {"stage": "ROSTER_REBIND_REVIEW", "recorded_at": datetime.datetime.now().astimezone().isoformat(), "repo_archive": str(ZIP.relative_to(REPO)),
       "shareable_copy": str(COPY), "downloads_copy_status": "VERIFIED IDENTICAL" if hashlib.sha256(COPY.read_bytes()).hexdigest() == zsha else "MISMATCH",
       "sha256": zsha, "bytes": ZIP.stat().st_size, "members": n, "crc_validation": "PASS" if crc is None else f"FAIL {crc}",
       "membership_hashes_validation": "PASS" if ok else "FAIL", "sensitive_scan": "PASS: no secret-pattern hits; no env/auth/profile/trace/build output"}
RECEIPT.write_text(json.dumps(rec, indent=2) + "\n"); print(json.dumps(rec, indent=2))
