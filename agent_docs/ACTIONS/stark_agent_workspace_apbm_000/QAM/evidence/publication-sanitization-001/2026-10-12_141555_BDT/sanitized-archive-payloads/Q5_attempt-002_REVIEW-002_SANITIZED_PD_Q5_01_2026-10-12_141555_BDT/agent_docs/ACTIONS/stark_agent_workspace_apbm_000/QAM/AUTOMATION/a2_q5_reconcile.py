#!/usr/bin/env python3
"""Q5 evidence reconciliation (read-only; changes nothing in the checkout). Compares FRESH hashes (computed now) with HISTORICAL
hash records made at the time: authoritative proposal (pre-cleanup, 2026-10-11 18:33), Q5 action log pre-checks (19:24:55),
post-Q5 inventory (19:25), freeze r10, package FILE_INDEXes (Q2 attempt-002 18:15, addendum 18:33:15, Q5 19:26:14), instrument
baseline list, approved inventories. Every difference must be an authorized cleanup target, a listed authorized record update
(append-only updates verified as byte-prefix extensions of the packaged earlier version), or a listed new record; anything else
is UNEXPLAINED and the run exits 2. Usage: python3 -I a2_q5_reconcile.py <repo> <authorized_json> <out_json>
"""
import hashlib, json, os, subprocess, sys, zipfile, datetime
repo, auth_path, out = sys.argv[1:4]
Q = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/'; E5 = Q + 'evidence/q5-attempt-002/'; AD = Q + 'evidence/q2-attempt-002-addendum-001/'
P = lambda p: os.path.join(repo, p); sha = lambda b: hashlib.sha256(b).hexdigest()
PRIVATE = {'.env.local'}  # never read: presence only (see PD-Q5-01)
fresh = lambda p: None if p in PRIVATE else sha(open(P(p), 'rb').read()) if os.path.isfile(P(p)) else None
git = lambda *a: subprocess.run(['git', '-C', repo, *a], capture_output=True)
A = json.load(open(auth_path))  # {'cleanup': [...], 'append_only': {path: reason}, 'rewritten': {path: reason}, 'new_records_prefixes': [...]}
res = {'run': datetime.datetime.now().astimezone().isoformat(timespec='seconds'), 'mode': 'read-only', 'sources': {}, 'postconditions': [], 'paths': {}, 'packages': {}, 'unexplained': []}
def src(name, path, note):
    res['sources'][name] = {'path': path, 'sha256': fresh(path), 'note': note}
# ---- historical sources ----
src('proposal_pre_cleanup', AD + 'q5-proposal/Q5_PROPOSAL_PATHS.json', 'pre-cleanup full path/hash inventory, 2026-10-11 18:33:04 (authoritative, expected 242f95eb…)')
src('post_q5_inventory', E5 + 'POST_Q5_INVENTORY.json', 'post-cleanup path/hash inventory, 2026-10-11 19:25:17 (file mtime)')
src('q5_action_log', E5 + 'Q5_ACTIONS.json', 'pre-checks/actions/post-checks, 2026-10-11 19:24:55')
src('freeze_r10', E5 + 'INSTRUMENT_FREEZE.r10.json', 'instrument hashes frozen before Q5 execution')
src('state_before', E5 + 'state-before.txt', 'status (QAM/evidence untracked filtered out) + root/cache hashes, 19:24:48')
src('state_after', E5 + 'state-after.txt', 'status + root/cache hashes, 19:25:16')
src('baseline_list', Q + 'evidence/q2-attempt-002/preparation/instrument-baseline.sha256', '40 pre-correction instrument copies')
pre = {r['path']: r for r in json.load(open(P(AD + 'q5-proposal/Q5_PROPOSAL_PATHS.json')))['rows'] if r.get('sha256')}
post = {r['path']: r for r in json.load(open(P(E5 + 'POST_Q5_INVENTORY.json')))['rows'] if r.get('sha256')}
actions = json.load(open(P(E5 + 'Q5_ACTIONS.json'))); freeze = json.load(open(P(E5 + 'INSTRUMENT_FREEZE.r10.json')))['instruments']
pkgs = {}
for z, r in [('Q2_attempt-002', 'Q2_attempt-002_RECEIPT.json'), ('Q2_attempt-002_ADDENDUM-001', 'Q2_attempt-002_ADDENDUM-001_RECEIPT.json'), ('Q5_attempt-002', 'Q5_attempt-002_RECEIPT.json')]:
    zp = Q + 'HANDOFFS/' + z + '.zip'; rc = json.load(open(P(Q + 'HANDOFFS/' + r))); zf = zipfile.ZipFile(P(zp)); idx = json.loads(zf.read('FILE_INDEX.json'))
    pkgs[z] = (zf, {m['path']: m for m in idx['members'] if m['path'] != 'REVIEW_START_HERE.md'})
    res['packages'][z] = {'archive_fresh_sha256': fresh(zp), 'receipt_sha256': rc['archive_sha256'], 'archive_matches_receipt': fresh(zp) == rc['archive_sha256'],
                          'downloads_copy': rc['downloads_copy'], 'downloads_copy_matches': os.path.isfile(rc['downloads_copy']) and sha(open(rc['downloads_copy'], 'rb').read()) == rc['archive_sha256'],
                          'index_created': idx['created'], 'members_indexed': len(idx['members']), 'zip_testzip': 'OK' if zf.testzip() is None else 'BAD'}
base = {Q + 'evidence/q2-attempt-002/preparation/instrument-baseline/' + l.split(None, 1)[1].strip(): l.split()[0] for l in open(P(Q + 'evidence/q2-attempt-002/preparation/instrument-baseline.sha256'))}
# ---- postconditions (fresh) ----
acct = json.load(open(P(AD + 'root-files/ROOT_FILES_ACCOUNT.json')))
def pc(name, ok, **d): res['postconditions'].append({'check': name, 'ok': bool(ok), **d})
head = git('show', 'HEAD:RECOVERY.md').stdout
pc('root RECOVERY.md = HEAD bytes = edfffe35…', open(P('RECOVERY.md'), 'rb').read() == head and fresh('RECOVERY.md') == 'edfffe35c9226c36ce8b8e12acff2375617b664fa3d7ec9cc94a16a03d83fcb8', fresh_sha256=fresh('RECOVERY.md'))
pc('QAM/QA_RECOVERY.md = reviewed 1,030-byte prepend', open(P(Q + 'QA_RECOVERY.md'), 'rb').read() == acct['RECOVERY.md']['prepended_text'].encode(), fresh_sha256=fresh(Q + 'QA_RECOVERY.md'), historical_prepend_sha256=acct['RECOVERY.md']['prepended_sha256'])
pc('root session_2026-10-11.md absent and untracked', not os.path.exists(P('session_2026-10-11.md')) and git('ls-files', '--error-unmatch', 'session_2026-10-11.md').returncode != 0)
pc('root session preserved copy intact (= reviewed 4ce2ae02…)', fresh(AD + 'root-files/root-session_2026-10-11.md.txt') == acct['session_2026-10-11.md']['sha256'])
for p in A['cleanup_caches']:
    pc(f'cache absent and untracked: {p}', not os.path.exists(P(p)) and git('ls-files', '--error-unmatch', p).returncode != 0,
       historical_pre_removal_sha256=next((a['before_sha256'] for a in actions['actions'] if a.get('path') == p), None))
for p in A['preserved_caches']:
    pc(f'preserved cache present and = pre-cleanup hash: {p}', fresh(p) is not None and fresh(p) == pre.get(p, {}).get('sha256'), fresh_sha256=fresh(p), historical_sha256=pre.get(p, {}).get('sha256'))
pc('Q5 action log: COMPLETE, 15/15 pre-checks, 7/7 post-checks', actions['result'] == 'COMPLETE' and all(c['ok'] for c in actions['checks']) and all(c['ok'] for c in actions['post']) and len(actions['checks']) == 15 and len(actions['post']) == 7)
pc('HEAD = candidate; index empty', git('rev-parse', 'HEAD').stdout.decode().strip() == '8eb5789d9021ad06c15db36db74419a2b5c68fc5' and git('diff', '--cached', '--name-only').stdout.strip() == b'')
pc('tracked QAM evidence unchanged vs HEAD', git('diff', '--quiet', 'HEAD', '--', Q + 'evidence').returncode == 0)
pc('no product/test/dependency changes', git('status', '--porcelain=v1', '--', 'src', 'tests', 'config', 'public', 'supabase', 'package.json', 'package-lock.json').stdout.strip() == b'')
# ---- path-by-path preservation ----
cleanup_all = set(A['cleanup_caches']) | {'RECOVERY.md', 'session_2026-10-11.md'}
universe = set(pre) | set(post) | set(freeze) | set(base) | {p for z in pkgs.values() for p in z[1]}
def latest(p):
    for name, d in [('Q5 package index 19:26', pkgs['Q5_attempt-002'][1]), ('post-Q5 inventory 19:25', post), ('freeze r10 19:24', {k: {'sha256': v} for k, v in freeze.items()}),
                    ('addendum package index 18:33:15', pkgs['Q2_attempt-002_ADDENDUM-001'][1]), ('proposal 18:33:04', pre), ('Q2 attempt-002 package index 18:15', pkgs['Q2_attempt-002'][1]),
                    ('instrument baseline list', {k: {'sha256': v} for k, v in base.items()})]:
        if p in d: return name, d[p]['sha256']
    return None, None
def packaged_version(p):
    for z in ['Q5_attempt-002', 'Q2_attempt-002_ADDENDUM-001', 'Q2_attempt-002']:
        if p in pkgs[z][1]: return z, pkgs[z][0].read(p)
    return None, None
for p in sorted(universe):
    cur = fresh(p); name, hist = latest(p); prehash = pre.get(p, {}).get('sha256')
    row = {'fresh_sha256': cur, 'latest_historical_source': name, 'latest_historical_sha256': hist, 'pre_cleanup_sha256': prehash,
           'unchanged_since_pre_cleanup': cur is not None and cur == prehash}
    if p in PRIVATE: res['paths'][p] = {'class': 'PRIVATE (presence only; not read or re-hashed)', 'present': os.path.isfile(P(p)), 'ok': True}; continue
    if p in cleanup_all: row['class'] = 'AUTHORIZED CLEANUP TARGET (2026-10-11 19:24:55)'; row['ok'] = cur is None if p != 'RECOVERY.md' else cur == 'edfffe35c9226c36ce8b8e12acff2375617b664fa3d7ec9cc94a16a03d83fcb8'
    elif cur is not None and cur == hist: row['class'] = 'PRESERVED (fresh = latest historical record)'; row['ok'] = True
    elif p in A['append_only']:
        z, old = packaged_version(p); now_b = open(P(p), 'rb').read() if cur else b''
        row['class'] = 'AUTHORIZED RECORD UPDATE (append-only)'; row['reason'] = A['append_only'][p]
        row['prefix_checked_against'] = z; row['ok'] = old is not None and now_b.startswith(old)
    elif p in A['rewritten']:
        row['class'] = 'AUTHORIZED RECORD UPDATE (structured rewrite)'; row['reason'] = A['rewritten'][p]; z, old = packaged_version(p)
        if p.endswith('.json') and old is not None:
            o, n = json.loads(old), json.load(open(P(p))); hist_vals = [v for k, v in n.items() if k.startswith('history_')]
            lost = [k for k in o if not (k in n and n[k] == o[k]) and not any(isinstance(h, dict) and h.get(k) == o[k] for h in hist_vals)]
            row['prior_values_preserved_or_in_history'] = not lost; row['unpreserved_prior_keys'] = lost; row['ok'] = not lost
        else: row['ok'] = old is not None
    else:
        row['class'] = 'UNEXPLAINED'; row['ok'] = False
    if not row['ok']: res['unexplained'].append(p)
    res['paths'][p] = row
# ---- new records since the Q5 package (must match an allowed prefix) ----
status = [l[3:].decode() for l in git('status', '--porcelain=v1', '-uall').stdout.splitlines()]
newer = [p for p in status if p not in universe and os.path.isfile(P(p))]
for p in newer:
    ok = any(p.startswith(x) for x in A['new_records_prefixes'])
    res['paths'][p] = {'fresh_sha256': fresh(p), 'class': 'NEW RECORD after Q5 package (authorized)' if ok else 'UNEXPLAINED', 'ok': ok}
    if not ok: res['unexplained'].append(p)
summary = {}
for r in res['paths'].values(): summary[r['class']] = summary.get(r['class'], 0) + 1
res['summary'] = summary; res['pre_cleanup_paths_unchanged'] = sum(1 for r in res['paths'].values() if r.get('unchanged_since_pre_cleanup'))
res['verdict'] = 'RECONCILED' if not res['unexplained'] and all(c['ok'] for c in res['postconditions']) and all(v['archive_matches_receipt'] and v['downloads_copy_matches'] for v in res['packages'].values()) else 'STOP_UNEXPLAINED'
json.dump(res, open(out, 'w'), indent=2)
print(json.dumps({'verdict': res['verdict'], 'summary': summary, 'postconditions_failed': [c['check'] for c in res['postconditions'] if not c['ok']], 'unexplained': res['unexplained'][:20]}, indent=1))
sys.exit(0 if res['verdict'] == 'RECONCILED' else 2)
