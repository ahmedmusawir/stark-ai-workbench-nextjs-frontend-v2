#!/usr/bin/env python3
"""Q5 retention/deletion PROPOSAL generator (read-only; deletes nothing). Path-by-path for every untracked/modified path, every
AUTOMATION file, and every generated/cache entry; tracked unchanged historical evidence is listed per directory.
Usage: python3 -I a2_q5_proposal.py <repo> <out_json>
"""
import hashlib, json, os, subprocess, sys, datetime
repo, out = sys.argv[1:3]
MOD = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/'; Q = MOD + 'QAM/'
git = lambda *a: subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout
sha = lambda p: hashlib.sha256(open(os.path.join(repo, p), 'rb').read()).hexdigest()
SESSION_START = datetime.datetime.fromisoformat('2026-10-11T17:40:45+06:00').timestamp()
rows = []
def add(path, kind, action, reason, owner='QA Lead approves; Claudy executes in Q5', tracked=None):
    p = os.path.join(repo, path); f = os.path.isfile(p)
    rows.append({'path': path, 'category': kind, 'proposed_action': action, 'reason': reason, 'owner': owner, 'tracked': tracked,
                 'bytes': os.path.getsize(p) if f else None, 'sha256': sha(path) if f and os.path.getsize(p) < 50_000_000 else None})
status = {l[3:]: l[:2] for l in git('status', '--porcelain=v1', '-uall').splitlines()}
tracked = set(git('ls-files').split('\n'))
def classify(p, st):
    t = p in tracked; mine = os.path.getmtime(os.path.join(repo, p)) >= SESSION_START if os.path.exists(os.path.join(repo, p)) else False
    if p == 'RECOVERY.md': return add(p, 'root pointer (Executor)', 'CORRECT per addendum root-files proposal A (remove 1,030-byte prepend; content to QAM/QA_RECOVERY.md)', 'QA record outside QAM', tracked=t)
    if p == 'session_2026-10-11.md': return add(p, 'root pointer (Executor)', 'DELETE after hash check (content preserved in addendum)', 'pointer-only file outside QAM', tracked=t)
    if p.endswith('.last-run.json'):
        if not mine: return add(p, 'cache (not QA-owned)', 'NO QA ACTION (owner may delete)', 'Playwright last-run cache in a pre-existing Engineer evidence folder', 'Tony', tracked=t)
        if '/policy-controls.run1/' in p: return add(p, 'durable QA record (failed-run cache)', 'RETAIN', 'only machine record of the failed control run 1 test IDs; small', tracked=t)
        return add(p, 'cache', 'DELETE', 'Playwright last-run cache; results JSON/log hold the same outcome', tracked=t)
    if p.startswith(Q + 'evidence/q2-attempt-002/preparation/instrument-baseline/'): return add(p, 'durable QA record (inert instrument copy)', 'RETAIN', 'pre-correction instrument bytes; basis of every attempt-002 diff', tracked=t)
    if p.startswith(Q + 'evidence/q2-attempt-002') : return add(p, 'durable QA record', 'RETAIN', 'attempt-002 / addendum evidence referenced by the report, matrix and packages', tracked=t)
    if p.startswith(Q + 'AUTOMATION/secondary-a2/') or p.startswith(Q + 'AUTOMATION/repair-harness/'):
        return add(p, 'disposable instrument (Engineer-suite copy)', 'RETAIN through Gate Q; DELETE-ELIGIBLE after Gate Q', 'duplicate of Engineer source with recorded diff/hashes (COPY_RECORD.json) and packaged in Q2_attempt-002.zip', tracked=t)
    if p.startswith(Q + 'AUTOMATION/'):
        return add(p, 'disposable instrument (QA-owned source)', 'RETAIN', 'frozen by hash in attempt-002/addendum evidence; needed to reproduce or audit results; small', tracked=t)
    if p.startswith(Q + 'HANDOFFS/') and p.endswith('.zip'):
        if mine: return add(p, 'durable QA package', 'RETAIN (commit decision: Tony)', 'package of record; Downloads copy and receipt exist; attempt-001 package precedent is committed', 'Tony', tracked=t)
        return add(p, 'pre-existing archive (not QA-owned)', 'NO QA ACTION', 'Engineer/Lead review archive from before this session; owner decides', 'Tony', tracked=t)
    if not mine and not t: return add(p, 'pre-existing record (not QA-owned)', 'NO QA ACTION', 'Cody commit/package-step record present at session start (hash-matched in attempt-002 gates)', 'Tony', tracked=t)
    if p.startswith(Q): return add(p, 'durable QA record', 'RETAIN', 'QAM record/state/handoff/finding (append-only history)', tracked=t)
    return add(p, 'UNCLASSIFIED', 'REVIEW', 'outside expected QA scope', 'QA Lead', tracked=t)
for p, st in sorted(status.items()): classify(p, st)
for p in sorted(x for x in tracked if x.startswith(Q + 'AUTOMATION/') and x not in status):
    if p.startswith(Q + 'AUTOMATION/agent_docs/'):
        add(p, 'historical evidence, misplaced (tracked)', 'RETAIN; optional byte-exact relocation to evidence/q2-attempt-001/q2-6|q2-7/startup-attempt-0/ by commit (Tony)', 'unique record of attempt-001 browser startup attempt 0 (webServer failed, 0 tests) written under AUTOMATION by the config path defect; differs from the evidence/q2-attempt-001 run records', 'Tony (Git)', tracked=True)
    else: add(p, 'disposable instrument (QA-owned source, committed)', 'RETAIN', 'historical instrument referenced by attempt-001 evidence', tracked=True)
# Generated output and caches outside Git
nx = os.path.join(repo, '.next')
for e in sorted(os.listdir(nx)):
    m = os.path.getmtime(os.path.join(nx, e)); ours = m >= SESSION_START
    if e == 'dev': add('.next/dev', 'generated output (not run-owned)', 'NO QA ACTION', 'pre-existing 2026-10-08 dev output (Engineer window); not created by QA', 'Tony', tracked=False)
    else: add(f'.next/{e}', 'generated output (Stage E, run-owned)' if ours else 'generated output (pre-existing)', 'RETAIN until Director comfort check, then DELETE' if ours else 'NO QA ACTION',
              'production build output of the accepted Stage E build (BUILD_ID QWT8ECmIa187SCzTCHuq2); evidence already recorded; Tony\'s comfort check uses a completed build' if ours else 'not created by QA', tracked=False)
add('next-env.d.ts', 'generated (gitignored)', 'RETAIN', 'pinned build form 7b550dda… regenerated by Stage E; Next owns this file', 'Next/Tony', tracked=False)
add('tsconfig.tsbuildinfo', 'cache (pre-existing)', 'NO QA ACTION', 'written 13:42 before the session; not QA-owned', 'Tony', tracked=False)
add('.env.local', 'private environment', 'NO QA ACTION (never read)', 'D4: presence only', 'Tony', tracked=False)
# Tracked, unchanged historical QA evidence: per directory
for d in sorted({p.split('/')[5] for p in tracked if p.startswith(Q + 'evidence/') and p.count('/') > 5}):
    n = sum(1 for p in tracked if p.startswith(f'{Q}evidence/{d}/'))
    rows.append({'path': f'{Q}evidence/{d}/ ({n} tracked files)', 'category': 'historical evidence (committed)', 'proposed_action': 'RETAIN (immutable)', 'reason': 'historical record; never rewritten', 'owner': '—', 'tracked': True, 'bytes': None, 'sha256': None})
summary = {}
for r in rows: summary.setdefault(r['category'], {}).setdefault(r['proposed_action'], 0); summary[r['category']][r['proposed_action']] += 1
json.dump({'proposal': 'Q5 retention/deletion — NOT EXECUTED', 'generated': datetime.datetime.now().astimezone().isoformat(timespec='seconds'), 'summary': summary, 'rows': rows}, open(out, 'w'), indent=2)
print(json.dumps(summary, indent=1))
