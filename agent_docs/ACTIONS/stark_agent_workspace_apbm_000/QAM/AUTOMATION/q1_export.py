#!/usr/bin/env python3
"""Q1 export (disposable): explicit-allowlist ZIP + FILE_INDEX + receipt + Downloads copy.
Never overwrites an existing archive. Rejects symlinks and traversal. Scans text for secret patterns."""
import datetime, hashlib, json, pathlib, re, shutil, sys, zipfile

REPO = pathlib.Path(__file__).resolve().parents[5]
MOD = "agent_docs/ACTIONS/stark_agent_workspace_apbm_000"
ENG = f"{MOD}/evidence/engineering-attempt-001"
Q1 = f"{MOD}/QAM/evidence/q1-attempt-001"
ZIP = REPO / MOD / "QAM/HANDOFFS/Q1_attempt-001.zip"
RECEIPT = REPO / MOD / "QAM/HANDOFFS/Q1_attempt-001_RECEIPT.json"
COPY = pathlib.Path.home() / "Downloads/Q1_attempt-001.zip"
SECRET = re.compile(rb"eyJ[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA |EC )?PRIVATE KEY|" rb"service" rb"_role|AKIA[0-9A-Z]{16}")

ALLOW = [  # (archive path, source path, purpose)
    ("REVIEW_START_HERE.md", f"{MOD}/QAM/HANDOFFS/Q1_REVIEW_START_HERE.md", "Lead entry: decisions first"),
    ("QAM/QAM_TEST_PLAN.md", f"{MOD}/QAM/QAM_TEST_PLAN.md", "Independent draft plan QA-APBM000-PLAN v0.1"),
    ("QAM/QAM_PREFLIGHT.md", f"{MOD}/QAM/QAM_PREFLIGHT.md", "Q1 readiness record"),
    ("QAM/QAM_STATE.json", f"{MOD}/QAM/QAM_STATE.json", "Routing state after Q1"),
    ("QAM/QAM_MANIFEST.md", f"{MOD}/QAM/QAM_MANIFEST.md", "Engineer facts manifest"),
    ("QAM/QAM_RISK_REQUIREMENTS.md", f"{MOD}/QAM/QAM_RISK_REQUIREMENTS.md", "Architect risk inputs"),
    ("QAM/QAM_CHECKPOINTS.md", f"{MOD}/QAM/QAM_CHECKPOINTS.md", "Checkpoint owners"),
    ("QAM/QAM_ENTRY.md", f"{MOD}/QAM/QAM_ENTRY.md", "QA entry procedure"),
    ("QAM/AC_EVIDENCE_MATRIX.md", f"{MOD}/QAM/AC_EVIDENCE_MATRIX.md", "AC matrix (NOT RUN; unchanged)"),
    ("QAM/HANDOFFS/QA_HANDOFF.md", f"{MOD}/QAM/HANDOFFS/QA_HANDOFF.md", "Engineer factual handoff"),
    ("contract/ACCEPTANCE_SPEC.md", f"{MOD}/ACCEPTANCE_SPEC.md", "Frozen acceptance v1.0"),
    ("contract/RULINGS_ADDENDUM.md", f"{MOD}/RULINGS_ADDENDUM.md", "Rulings v1.0"),
    ("contract/GOVERNANCE.md", f"{MOD}/GOVERNANCE.md", "Governance"),
    ("contract/KNOWN_LIMITS.md", f"{MOD}/KNOWN_LIMITS.md", "Known limits / inherited-failure rule"),
    ("contract/DATA_CONTRACT.md", f"{MOD}/DATA_CONTRACT.md", "Data/navigation contract"),
    ("contract/FILE_SCOPE.md", f"{MOD}/FILE_SCOPE.md", "Allowed/protected paths"),
    ("engineer/candidate-scope.json", f"{ENG}/candidate-scope.json", "Engineer 218-input scope"),
    ("engineer/changed-source-inventory.json", f"{ENG}/changed-source-inventory.json", "Engineer 28-file inventory"),
    ("engineer/jest-comparison.json", f"{ENG}/jest-comparison.json", "Engineer Jest comparison"),
    ("engineer/INHERITED_FAILURES.md", f"{ENG}/INHERITED_FAILURES.md", "Engineer inherited failure list"),
    ("engineer/ENGINEER_AC_CLAIMS.md", f"{ENG}/ENGINEER_AC_CLAIMS.md", "Engineer per-AC claims (input only)"),
    ("qa-tooling/q1_candidate_identity.py", f"{MOD}/QAM/AUTOMATION/q1_candidate_identity.py", "QA identity instrument"),
    ("qa-tooling/q1_jest_compare.py", f"{MOD}/QAM/AUTOMATION/q1_jest_compare.py", "QA Jest comparison instrument"),
    ("qa-tooling/q1_export.py", f"{MOD}/QAM/AUTOMATION/q1_export.py", "This export instrument"),
]
for p in sorted((REPO / Q1).iterdir()):
    ALLOW.append((f"qa-evidence/q1-attempt-001/{p.name}", f"{Q1}/{p.name}", "Q1 evidence (see INDEX.md)"))

if ZIP.exists() or COPY.exists():
    sys.exit("refusing to overwrite existing Q1_attempt-001 archive")
index, hits = [], []
for arc, src, purpose in ALLOW:
    s = REPO / src
    assert ".." not in pathlib.PurePosixPath(arc).parts and not arc.startswith("/"), arc
    if s.is_symlink() or not s.is_file():
        sys.exit(f"rejected (symlink/missing): {src}")
    b = s.read_bytes()
    if SECRET.search(b):
        hits.append(src)
    index.append({"path": arc, "source_path": src, "purpose": purpose, "bytes": len(b), "sha256": hashlib.sha256(b).hexdigest()})
if hits:
    sys.exit(f"secret-pattern hits, not exporting: {hits}")
idx = json.dumps({"package": "Q1_attempt-001", "candidate": "22ce03ba3871ea53e5253f2e3f060a1bab3226a3",
                  "note": "FILE_INDEX.json excludes its own hash", "files": index}, indent=2).encode()
with zipfile.ZipFile(ZIP, "x", zipfile.ZIP_DEFLATED) as z:
    for e in index:
        z.write(REPO / e["source_path"], e["path"])
    z.writestr("FILE_INDEX.json", idx)
with zipfile.ZipFile(ZIP) as z:
    crc = z.testzip()
    ok = all(hashlib.sha256(z.read(e["path"])).hexdigest() == e["sha256"] for e in index) and z.read("FILE_INDEX.json") == idx
    members = len(z.namelist())
shutil.copy2(ZIP, COPY)
zsha = hashlib.sha256(ZIP.read_bytes()).hexdigest()
receipt = {
    "stage": "Q1", "attempt": 1, "recorded_at": datetime.datetime.now().astimezone().isoformat(),
    "repo_archive": str(ZIP), "shareable_copy": str(COPY),
    "downloads_copy_status": "VERIFIED IDENTICAL" if hashlib.sha256(COPY.read_bytes()).hexdigest() == zsha else "MISMATCH",
    "sha256": zsha, "bytes": ZIP.stat().st_size, "members": members,
    "crc_validation": "PASS" if crc is None else f"FAIL: {crc}",
    "membership_hashes_validation": "PASS" if ok else "FAIL",
    "sensitive_scan": "PASS: no secret-pattern hits in allowlisted files; no env/auth/profile/trace/build output included",
    "plan_sha256": next(e["sha256"] for e in index if e["path"] == "QAM/QAM_TEST_PLAN.md"),
    "design_dependency": "Referenced by hash 77d1b42698219470fc4e3a0c0427927683bdb34e5888cd9abd60a430812895c1; not nested",
}
RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps(receipt, indent=2))
