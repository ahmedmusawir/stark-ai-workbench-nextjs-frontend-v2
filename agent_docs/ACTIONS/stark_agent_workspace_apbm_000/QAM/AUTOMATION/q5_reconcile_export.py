#!/usr/bin/env python3
"""Q5 attempt-002 reconciliation review package (current review package): HANDOFFS/Q5_attempt-002_REVIEW-002.zip + receipt +
Downloads copy. Earlier packages are referenced by receipt (no nested archives) and left unchanged. Explicit allowlist; rejects
symlinks/traversal/archives/caches; generic secret-pattern scan; never reads .env.local. Usage: python3 -I q5_reconcile_export.py <repo> <downloads>
"""
import hashlib, json, os, re, shutil, sys, zipfile, datetime
repo, downloads = sys.argv[1:3]
Q = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/'; H = Q + 'HANDOFFS/'; E5 = Q + 'evidence/q5-attempt-002/'; AD = Q + 'evidence/q2-attempt-002-addendum-001/'
RD = E5 + 'reconciliation-2026-10-12/'; SELF = Q + 'AUTOMATION/q5_reconcile_export.py'
EXPORTERS = {SELF, Q + 'AUTOMATION/q5_export.py'}  # exact paths; both contain the scanner's own pattern list
OUT = H + 'Q5_attempt-002_REVIEW-002.zip'; RECEIPT = H + 'Q5_attempt-002_REVIEW-002_RECEIPT.json'; REVIEW = H + 'Q5_attempt-002_REVIEW-002_START_HERE.md'
explicit = [REVIEW, H + 'LEAD_Q5_RECONCILIATION_RULING_2026-10-12_115503_BDT.txt', H + 'LEAD_Q5_CLEANUP_INSTRUCTION_2026-10-12_114722_BDT.txt',
            H + 'LEAD_Q5_AUTHORIZATION_2026-10-11_192313_BDT.txt', H + 'LEAD_Q5_AUTHORIZATION_2026-10-11_192313_BDT_BINDING.json',
            H + 'Q5_attempt-002_RECEIPT.json', H + 'Q5_attempt-002_REVIEW_START_HERE.md', H + 'Q2_attempt-002_RECEIPT.json', H + 'Q2_attempt-002_ADDENDUM-001_RECEIPT.json',
            Q + 'QA_RECOVERY.md', Q + 'QAM_STATE.json', Q + 'QAM_CHECKPOINTS.md', Q + 'QAM_MANIFEST.md', Q + 'session_2026-10-11.md', Q + 'session_2026-10-12.md',
            AD + 'q5-proposal/Q5_PROPOSAL_PATHS.json', AD + 'q5-proposal/Q5_PROPOSAL.md', AD + 'root-files/ROOT_FILES_ACCOUNT.json', AD + 'root-files/root-session_2026-10-11.md.txt',
            AD + 'root-files/PLACEMENT_CORRECTION_PROPOSAL.md', AD + 'PROCESS_DEVIATION_AND_QUALIFICATIONS.md',
            Q + 'evidence/q2-attempt-002/INSTRUMENT_RETRY_LEDGER.md', Q + 'evidence/q2-attempt-002/EXECUTION_REPORT.md', Q + 'evidence/q2-attempt-002/preparation/instrument-baseline.sha256'] + \
           [Q + 'FINDINGS/' + f for f in ['Q2-F01_signout_storage_unavailable.md', 'Q2-F02_drawer_breakpoint_focus_target.md', 'Q2-F03_breadcrumb_target_size.md', 'Q2-F04_manifest_test_bundle_coverage.md',
                                         'DIRECTOR-OBS-001.md', 'DIRECTOR-OBS-001_EXECUTOR-ADDENDUM-003.md']] + \
           [Q + 'AUTOMATION/' + f for f in ['a2_q5_execute.py', 'a2_q5_reconcile.py', 'q5_reconcile_export.py', 'q5_export.py', 'q2a2_gate.py', 'a2_prepare_records.py', 'a2_q5_proposal.py']]
members = list(explicit)
for dp, _, fn in os.walk(os.path.join(repo, E5)):
    for f in fn: members.append(os.path.relpath(os.path.join(dp, f), repo))
members = sorted(set(m for m in members if not re.search(r'\.(zip|har)$|\.last-run\.json$|__pycache__', m)))
SECRET = re.compile(rb'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|service_role|SUPABASE_SERVICE|(?i:password)\s*[:=]\s*["\'][^"\']{4,}')
sha = lambda b: hashlib.sha256(b).hexdigest(); index, flagged = [], []
for m in members:
    full = os.path.join(repo, m)
    if os.path.islink(full) or '..' in m.split('/') or m.endswith('.env.local'): raise SystemExit(f'unsafe member {m}')
    b = open(full, 'rb').read()
    if m not in EXPORTERS and SECRET.search(b): flagged.append(m)  # exporter sources hold the pattern list itself
    purpose = ('reconciliation 2026-10-12' if m.startswith(RD) else 'Q5 record 2026-10-11/12' if m.startswith(E5) else 'instrument source' if '/AUTOMATION/' in m
               else 'authoritative proposal / root account (unchanged)' if m.startswith(AD) else 'record')
    index.append({'path': m, 'source': m, 'purpose': purpose, 'bytes': len(b), 'sha256': sha(b)})
if flagged: raise SystemExit(f'secret-pattern scan flagged: {flagged}')
review = open(os.path.join(repo, REVIEW), 'rb').read()
index.insert(0, {'path': 'REVIEW_START_HERE.md', 'source': REVIEW, 'purpose': 'review entry (archive root copy)', 'bytes': len(review), 'sha256': sha(review)})
idx_bytes = json.dumps({'format': 'APBM000_Q5_ATTEMPT_002_REVIEW_002', 'status': 'CURRENT REVIEW PACKAGE (supersedes Q5_attempt-002.zip for review; that package preserved unchanged)',
                        'candidate_sha': '8eb5789d9021ad06c15db36db74419a2b5c68fc5', 'gate_q': 'PENDING', 'D4': 'ALLOW', 'D7': 'OMIT',
                        'created': datetime.datetime.now().astimezone().isoformat(timespec='seconds'), 'members': index, 'self_hash': 'excluded; see external receipt'}, indent=2).encode()
zp = os.path.join(repo, OUT)
if os.path.exists(zp): raise SystemExit('refusing to overwrite existing package')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('FILE_INDEX.json', idx_bytes); z.writestr('REVIEW_START_HERE.md', review)
    for e in index[1:]: z.write(os.path.join(repo, e['path']), e['path'])
with zipfile.ZipFile(zp) as z:
    bad = z.testzip(); names = z.namelist()
    ok = sorted(names) == sorted(['FILE_INDEX.json'] + [e['path'] for e in index]) and all(sha(z.read(e['path'])) == e['sha256'] for e in index)
zb = open(zp, 'rb').read(); dl = os.path.join(downloads, f"APBM000_Q5_attempt-002_REVIEW-002_{datetime.datetime.now().strftime('%Y-%m-%d_%H%M%S')}_BDT.zip"); shutil.copyfile(zp, dl)
rec = {'archive': OUT, 'status': 'current review package', 'archive_sha256': sha(zb), 'archive_bytes': len(zb), 'members': len(names), 'file_index_sha256': sha(idx_bytes),
       'crc_testzip': 'OK' if bad is None else f'BAD {bad}', 'membership_and_hashes_match_index': ok, 'downloads_copy': dl, 'downloads_copy_sha256': sha(open(dl, 'rb').read()),
       'secret_pattern_scan': 'generic credential patterns; 0 hits (exporter sources q5_export.py and q5_reconcile_export.py exempt by exact path: they contain the patterns)',
       'note': '.env.local was not read by this export; the included Q5 proposal and post-Q5 inventory carry the earlier .env.local digest (PD-Q5-01)'}
assert bad is None and ok and rec['downloads_copy_sha256'] == rec['archive_sha256']
json.dump(rec, open(os.path.join(repo, RECEIPT), 'w'), indent=2); shutil.copyfile(os.path.join(repo, RECEIPT), dl[:-4] + '_RECEIPT.json'); print(json.dumps(rec, indent=2))
