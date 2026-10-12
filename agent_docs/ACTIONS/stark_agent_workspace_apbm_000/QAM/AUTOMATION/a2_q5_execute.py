#!/usr/bin/env python3
"""Bounded Q5 executor for APBM_000 attempt-002 (Lead authorization 2026-10-11 19:23). All checks run BEFORE any change; any
mismatch -> exit 2 with nothing changed. Authorized actions only:
  A. root option A: exact 1,030-byte prepend -> QAM/QA_RECOVERY.md (create-only; identical existing = no-op; different = STOP);
     RECOVERY.md := remainder (must hash to edfffe35…); delete root session_2026-10-11.md after hash + QAM-copy confirmation.
  B. delete exactly the proposal rows with category == 'cache' and proposed_action == 'DELETE' (expected 5), each untracked and
     hash-matched. Nothing else is deleted. Usage: python3 -I a2_q5_execute.py <repo> <out_json>
"""
import hashlib, json, os, subprocess, sys, datetime
repo, out = sys.argv[1:3]
Q = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/'; AD = Q + 'evidence/q2-attempt-002-addendum-001/'
PROPOSAL, PROPOSAL_SHA = AD + 'q5-proposal/Q5_PROPOSAL_PATHS.json', '242f95eb508e55e5a81f3e660197857fded1d730e97494d92ebd181590d6e7ed'
REMAINDER_SHA = 'edfffe35c9226c36ce8b8e12acff2375617b664fa3d7ec9cc94a16a03d83fcb8'
sha = lambda b: hashlib.sha256(b).hexdigest(); P = lambda p: os.path.join(repo, p); rd = lambda p: open(P(p), 'rb').read()
now = lambda: datetime.datetime.now().astimezone().isoformat(timespec='seconds')
git = lambda *a: subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True)
rec = {'record': 'Q5 attempt-002 execution', 'started': now(), 'candidate': '8eb5789d9021ad06c15db36db74419a2b5c68fc5', 'checks': [], 'actions': [], 'post': []}
def chk(name, ok, **d):
    rec['checks'].append({'check': name, 'ok': bool(ok), **d})
    return ok
def finish(code):
    rec['finished'] = now(); rec['result'] = 'COMPLETE' if code == 0 else 'STOPPED_NO_CHANGE' if not rec['actions'] else 'STOPPED_AFTER_PARTIAL_ACTIONS'
    json.dump(rec, open(out, 'w'), indent=2); print(json.dumps({'result': rec['result'], 'failed': [c['check'] for c in rec['checks'] + rec['post'] if not c['ok']]}, indent=1)); sys.exit(code)
# ---------- verification (no changes) ----------
ok = chk('HEAD is candidate', git('rev-parse', 'HEAD').stdout.strip() == rec['candidate'])
ok &= chk('index empty', git('diff', '--cached', '--name-only').stdout.strip() == '')
ok &= chk('authoritative proposal hash', sha(rd(PROPOSAL)) == PROPOSAL_SHA, sha256=sha(rd(PROPOSAL)))
acct = json.load(open(P(AD + 'root-files/ROOT_FILES_ACCOUNT.json')))
cur = rd('RECOVERY.md'); pre, rem = cur[:1030], cur[1030:]
ok &= chk('RECOVERY.md current = reviewed worktree hash', sha(cur) == acct['RECOVERY.md']['worktree_sha256'], sha256=sha(cur), bytes=len(cur))
ok &= chk('prepend = reviewed 1,030 bytes', len(acct['RECOVERY.md']['prepended_text'].encode()) == 1030 and sha(pre) == acct['RECOVERY.md']['prepended_sha256'] and pre == acct['RECOVERY.md']['prepended_text'].encode(), sha256=sha(pre))
ok &= chk('remainder = Lead hash = HEAD blob', sha(rem) == REMAINDER_SHA == acct['RECOVERY.md']['head_blob_sha256'] and rem == subprocess.run(['git', '-C', repo, 'show', 'HEAD:RECOVERY.md'], capture_output=True).stdout, sha256=sha(rem))
qr = P(Q + 'QA_RECOVERY.md'); qr_exists = os.path.exists(qr)
ok &= chk('QA_RECOVERY.md absent or identical', (not qr_exists) or open(qr, 'rb').read() == pre, exists=qr_exists)
ses = rd('session_2026-10-11.md'); copy = rd(AD + 'root-files/root-session_2026-10-11.md.txt')
ok &= chk('root session = reviewed hash and QAM copy identical', sha(ses) == acct['session_2026-10-11.md']['sha256'] and copy == ses, sha256=sha(ses), qam_copy=AD + 'root-files/root-session_2026-10-11.md.txt')
ok &= chk('root session untracked', git('ls-files', '--error-unmatch', 'session_2026-10-11.md').returncode != 0)
rows = [r for r in json.load(open(P(PROPOSAL)))['rows'] if r['category'] == 'cache' and r['proposed_action'] == 'DELETE']
ok &= chk('exactly five cache/DELETE rows', len(rows) == 5, paths=[r['path'] for r in rows])
for r in rows:
    p = r['path']; ex = os.path.isfile(P(p)) and not os.path.islink(P(p))
    st = git('status', '--porcelain=v1', '--', p).stdout.strip()
    ok &= chk(f'cache verified: {p}', ex and r['tracked'] is False and git('ls-files', '--error-unmatch', p).returncode != 0 and st.startswith('??') and sha(rd(p)) == r['sha256']
              and p.endswith('/.last-run.json') and p.startswith(Q + 'evidence/q2-attempt-002/'), sha256=sha(rd(p)) if ex else None, recorded=r['sha256'], status=st)
if not ok: finish(2)
# ---------- actions ----------
if not qr_exists:
    with open(qr, 'xb') as f: f.write(pre)
    rec['actions'].append({'at': now(), 'action': 'create QAM/QA_RECOVERY.md with the exact 1,030-byte prepend', 'path': Q + 'QA_RECOVERY.md', 'after_sha256': sha(open(qr, 'rb').read())})
else: rec['actions'].append({'at': now(), 'action': 'QAM/QA_RECOVERY.md already identical; no-op'})
with open(P('RECOVERY.md'), 'wb') as f: f.write(rem)
rec['actions'].append({'at': now(), 'action': 'remove the 1,030-byte prepend from root RECOVERY.md', 'before_sha256': sha(cur), 'after_sha256': sha(rd('RECOVERY.md'))})
os.remove(P('session_2026-10-11.md'))
rec['actions'].append({'at': now(), 'action': 'delete root session_2026-10-11.md (preserved at ' + AD + 'root-files/root-session_2026-10-11.md.txt)', 'before_sha256': sha(ses)})
for r in rows:
    before = sha(rd(r['path'])); os.remove(P(r['path']))
    rec['actions'].append({'at': now(), 'action': 'delete cache', 'path': r['path'], 'before_sha256': before, 'bytes': r['bytes']})
# ---------- post-verification ----------
chk2 = lambda n, o, **d: rec['post'].append({'check': n, 'ok': bool(o), **d}) or o
good = chk2('QA_RECOVERY.md = exact prepend', open(qr, 'rb').read() == pre, sha256=sha(open(qr, 'rb').read()))
good &= chk2('RECOVERY.md = edfffe35… and clean vs HEAD', sha(rd('RECOVERY.md')) == REMAINDER_SHA and git('status', '--porcelain=v1', '--', 'RECOVERY.md').stdout.strip() == '')
good &= chk2('root session removed', not os.path.exists(P('session_2026-10-11.md')))
good &= chk2('five caches removed', all(not os.path.exists(P(r['path'])) for r in rows))
good &= chk2('failed-run cache preserved', os.path.isfile(P(Q + 'evidence/q2-attempt-002/preparation/policy-controls.run1/artifacts/.last-run.json')))
good &= chk2('HEAD still candidate', git('rev-parse', 'HEAD').stdout.strip() == rec['candidate'])
good &= chk2('no product/test/dependency status', git('status', '--porcelain=v1', '--', 'src', 'tests', 'config', 'public', 'supabase', 'package.json', 'package-lock.json').stdout.strip() == '')
finish(0 if good else 3)
