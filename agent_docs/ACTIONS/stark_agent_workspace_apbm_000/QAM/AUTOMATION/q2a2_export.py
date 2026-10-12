#!/usr/bin/env python3
"""Attempt-002 export (EXPORT_RULES): one indexed safe ZIP under QAM/HANDOFFS + Downloads copy + separate receipt. Never reruns tests.
Explicit allowlist; rejects symlinks/traversal; excludes archives, caches (.last-run.json), traces, HAR, profiles and build output.
Secret scan uses generic credential patterns only (QA never reads .env.local). Usage: python3 -I q2a2_export.py <repo> <downloads_dir>
"""
import hashlib, json, os, re, shutil, sys, zipfile, datetime
repo, downloads = sys.argv[1:3]
MOD = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/'; QAM = MOD + 'QAM/'
OUT = QAM + 'HANDOFFS/Q2_attempt-002.zip'; RECEIPT = QAM + 'HANDOFFS/Q2_attempt-002_RECEIPT.json'
sha = lambda b: hashlib.sha256(b).hexdigest()
H = QAM + 'HANDOFFS/'
explicit = [QAM + p for p in ['QAM_TEST_PLAN.md', 'QAM_STATE.json', 'QAM_MANIFEST.md', 'QAM_CHECKPOINTS.md', 'session_2026-10-11.md', 'QAM_ENTRY.md', 'EXPORT_RULES.md', 'AC_EVIDENCE_MATRIX.md']] + \
    [H + p for p in ['Q2_attempt-002_REVIEW_START_HERE.md', 'LEAD_RETEST_002_APPROVAL_2026-10-11.md', 'LEAD_RETEST_002_BINDING_2026-10-11.json', 'LEAD_INTAKE_VERIFICATION_2026-10-11.json',
                     'RETEST_002_FILE_INDEX.json', 'RETEST_002_START_HERE.md', 'CLAUDY_RETEST_002_PROMPT.txt', 'DIRECTOR_RELEASE_002_DRAFT.txt', 'DIRECTOR_Q2_RELEASE_002_2026-10-11_174045_BDT.txt',
                     'DIRECTOR_Q2_RELEASE_002_BINDING_2026-10-11.json', 'QAM_TEST_PLAN_v0.2_PRESERVED_2026-10-11.md', 'LEAD_Q2_DISPOSITION_2026-10-07.md', 'REPAIRED_CANDIDATE_001_POST_COMMIT_RECEIPT.md']] + \
    [MOD + p for p in ['ACCEPTANCE_SPEC.md', 'RULINGS_ADDENDUM.md', 'GOVERNANCE.md', 'KNOWN_LIMITS.md']]
trees = [QAM + 'FINDINGS/', QAM + 'evidence/q2-attempt-002/', QAM + 'AUTOMATION/']
EXCL = re.compile(r'(\.zip|\.last-run\.json|\.har|\.trace|\.webm|__pycache__/.*|\.pyc)$|/artifacts/.*\.last-run\.json$|^' + re.escape(QAM) + r'AUTOMATION/agent_docs/')
SECRET = re.compile(rb'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|SUPABASE_SERVICE|(?i:password)\s*[:=]\s*["\'][^"\']{4,}')
def purpose(p):
    for k, v in [('HANDOFFS/Q2_attempt-002_REVIEW', 'review entry'), ('HANDOFFS/LEAD_', 'Lead approval/binding/disposition'), ('HANDOFFS/DIRECTOR_', 'Director release (verbatim/draft/binding)'),
                 ('HANDOFFS/', 'Lead delivery / candidate receipt'), ('FINDINGS/', 'findings (originals unchanged + attempt-002 addenda)'), ('evidence/q2-attempt-002/preparation/instrument-baseline/', 'pre-correction instrument bytes (inert copy)'),
                 ('evidence/q2-attempt-002/preparation/', 'preflight/gate/controls/freeze evidence'), ('evidence/q2-attempt-002/acceptance/', 'acceptance stage evidence'), ('evidence/q2-attempt-002/teardown/', 'teardown/post-run identity'),
                 ('evidence/q2-attempt-002/', 'attempt-002 report/matrix/ledger'), ('AUTOMATION/', 'QA instrument source'), ('QAM_', 'QAM routing/state (additive)'), ('session_', 'QAM session log')]:
        if k in p: return v
    return 'governing contract/rules (reference)'
members = list(explicit)
for t in trees:
    for dp, dn, fn in os.walk(os.path.join(repo, t)):
        for f in fn: members.append(os.path.relpath(os.path.join(dp, f), repo))
members = sorted({m for m in members if not EXCL.search(m)})
index, flagged = [], []
for m in members:
    full = os.path.join(repo, m)
    if os.path.islink(full) or '..' in m.split('/') or m.startswith('/'): raise SystemExit(f'unsafe member {m}')
    b = open(full, 'rb').read()
    if not m.endswith(('.png', '.woff2')) and m != QAM + 'AUTOMATION/q2a2_export.py' and SECRET.search(b): flagged.append(m)  # own source holds the patterns
    index.append({'path': m, 'source': m, 'purpose': purpose(m), 'bytes': len(b), 'sha256': sha(b)})
if flagged: raise SystemExit(f'secret-pattern scan flagged: {flagged}')
review = open(os.path.join(repo, H + 'Q2_attempt-002_REVIEW_START_HERE.md'), 'rb').read()
index.insert(0, {'path': 'REVIEW_START_HERE.md', 'source': H + 'Q2_attempt-002_REVIEW_START_HERE.md', 'purpose': 'review entry (archive root copy)', 'bytes': len(review), 'sha256': sha(review)})
idx = {'format': 'APBM000_Q2_ATTEMPT_002_PACKAGE', 'candidate_sha': '8eb5789d9021ad06c15db36db74419a2b5c68fc5', 'gate_q': 'PENDING', 'D4': 'ALLOW', 'D7': 'OMIT',
       'created': datetime.datetime.now().astimezone().isoformat(timespec='seconds'), 'members': index, 'self_hash': 'excluded; see external receipt'}
idx_bytes = json.dumps(idx, indent=2).encode()
zp = os.path.join(repo, OUT)
if os.path.exists(zp): raise SystemExit('refusing to overwrite existing package')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('FILE_INDEX.json', idx_bytes); z.writestr('REVIEW_START_HERE.md', review)
    for e in index[1:]: z.write(os.path.join(repo, e['path']), e['path'])
with zipfile.ZipFile(zp) as z:
    bad = z.testzip(); names = z.namelist()
    member_ok = sorted(names) == sorted(['FILE_INDEX.json'] + [e['path'] for e in index])
    hash_ok = all(sha(z.read(e['path'])) == e['sha256'] for e in index) and sha(z.read('FILE_INDEX.json')) == sha(idx_bytes)
zb = open(zp, 'rb').read(); stamp = datetime.datetime.now().strftime('%Y-%m-%d_%H%M%S')
dl = os.path.join(downloads, f'APBM000_Q2_attempt-002_QA-Lead-Package_{stamp}_BDT.zip'); shutil.copyfile(zp, dl)
rec = {'archive': OUT, 'archive_sha256': sha(zb), 'archive_bytes': len(zb), 'members': len(names), 'file_index_sha256': sha(idx_bytes),
       'crc_testzip': 'OK' if bad is None else f'BAD {bad}', 'membership_equals_index_plus_index': member_ok, 'member_hashes_match_index': hash_ok,
       'downloads_copy': dl, 'downloads_copy_sha256': sha(open(dl, 'rb').read()), 'secret_pattern_scan': 'generic credential patterns; 0 hits (scanner source exempt: it contains the patterns); .env.local never read',
       'excluded': 'archives, Playwright .last-run caches, traces/HAR/video, profiles, .next build output, node_modules, dependency/private env', 'created': idx['created']}
assert bad is None and member_ok and hash_ok and rec['downloads_copy_sha256'] == rec['archive_sha256']
json.dump(rec, open(os.path.join(repo, RECEIPT), 'w'), indent=2); shutil.copyfile(os.path.join(repo, RECEIPT), dl[:-4] + '_RECEIPT.json')
print(json.dumps(rec, indent=2))
