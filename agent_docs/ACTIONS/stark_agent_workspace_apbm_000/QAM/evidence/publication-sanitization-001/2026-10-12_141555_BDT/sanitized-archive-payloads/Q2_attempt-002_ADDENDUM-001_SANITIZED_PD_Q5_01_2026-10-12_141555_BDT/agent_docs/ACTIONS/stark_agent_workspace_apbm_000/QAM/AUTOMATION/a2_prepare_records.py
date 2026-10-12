#!/usr/bin/env python3
"""Attempt-002 preparation records (disposable QA instrument; read-only Git).
approved: pre-existing untracked QAM files that fall under the session-start `git status` snapshot (Claude Code context at 17:40 BDT)
          with hashes; the installed Lead delivery (from INSTALL_RECORD.json); path-approved Executor documents; inert evidence copies.
freeze:   every changed/new AUTOMATION file with SHA-256, plus the exact commands and output paths; the freeze digest goes to a
          separate receipt, never into the manifest itself.
Usage: python3 -I a2_prepare_records.py <repo> <approved_out> <freeze_out> <receipt_out> [executor_doc ...]
"""
import hashlib, json, os, subprocess, sys, datetime
repo, approved_out, freeze_out, receipt_out, *docs = sys.argv[1:]
QAM = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/'
SNAPSHOT = [QAM + p for p in [  # untracked entries listed in the session-start git status (before any Executor write)
    'HANDOFFS/APBM000_ADDMEMBER_TEST_REPAIR_001_REVIEW_2026-10-11_134025_BDT.zip', 'HANDOFFS/APBM000_DEPENDENCY_DIAGNOSTIC_REVIEW_2026-10-08_131602_BDT.zip',
    'HANDOFFS/APBM000_ENGINEERING_REPAIR_001_REVIEW_2026-10-08_112512_BDT.zip', 'HANDOFFS/APBM000_QA_LEAD_INTAKE_8eb5789d9021_2026-10-11_161409_BDT.zip',
    'HANDOFFS/REPAIRED_CANDIDATE_001_POST_COMMIT_RECEIPT.md', 'HANDOFFS/REVIEW_START_HERE.md',
    'evidence/addmember-test-repair-001/2026-10-11_134025_BDT/EXPORT_RECEIPT.json', 'evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/browser-artifacts/',
    'evidence/engineering-repair-001/browser-artifacts/', 'evidence/local-candidate-commit-001/', 'evidence/selective-commit-preparation-001/']]
SESSION_START = datetime.datetime.fromisoformat('2026-10-11T17:40:45+06:00').timestamp()
sha = lambda p: hashlib.sha256(open(os.path.join(repo, p), 'rb').read()).hexdigest()
git = lambda *a: subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout
untracked = git('ls-files', '--others', '--exclude-standard').split('\n')
pre, unmatched_old = {}, []
for p in filter(None, untracked):
    if any(p == s or (s.endswith('/') and p.startswith(s)) for s in SNAPSHOT):
        if os.path.getmtime(os.path.join(repo, p)) >= SESSION_START: raise SystemExit(f'pre-existing snapshot path modified after session start: {p}')
        pre[p] = sha(p)
    # q2-attempt-002/ did not exist at session start (install precondition); tar-restored baseline copies keep old mtimes.
    elif not p.startswith(QAM + 'evidence/q2-attempt-002/') and os.path.getmtime(os.path.join(repo, p)) < SESSION_START: unmatched_old.append(p)
if unmatched_old: raise SystemExit(f'untracked files older than session start but absent from snapshot: {unmatched_old}')
inst = json.load(open(os.path.join(repo, QAM, 'evidence/q2-attempt-002/preparation/INSTALL_RECORD.json')))
installed = {'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/' + m['path']: m['post_install_sha256'] for m in inst['members']}
base = {}
for line in open(os.path.join(repo, QAM, 'evidence/q2-attempt-002/preparation/instrument-baseline.sha256')):
    h, p = line.split(None, 1); base[QAM + 'evidence/q2-attempt-002/preparation/instrument-baseline/' + p.strip()] = h
inert = {p: 'Engineer package validator inside a pre-existing evidence export; never executed by QA' for p in pre if p.endswith(('.py', '.cjs', '.js', '.ts'))}
approved = {'preexisting_untracked': pre, 'installed_delivery': installed, 'executor_docs': docs, 'instrument_baseline_copies': base, 'inert_executable_records': inert}
json.dump(approved, open(approved_out, 'w'), indent=2)
changed = [l[3:] for l in git('status', '--porcelain=v1', '-uall', '--', QAM + 'AUTOMATION').splitlines()]
freeze = {'record': 'APBM000 Q2 attempt-002 instrument freeze', 'frozen_at': datetime.datetime.now().astimezone().isoformat(timespec='seconds'),
          'instruments': {p: sha(p) for p in sorted(changed)},
          'baseline_manifest': QAM + 'evidence/q2-attempt-002/preparation/instrument-baseline.sha256',
          'commands': {
            'A-gate': 'python3 -I AUTOMATION/q2a2_gate.py --repo <repo> --binding HANDOFFS/LEAD_RETEST_002_BINDING_2026-10-11.json --candidate 8eb5789d… --parent 9c50884d… --approved <approved> --freeze <freeze> --supplied-patch <committed-product-test.patch> --out <A>/gate*.json',
            'A-controls': 'a2_run.sh A-controls <A> QA_OUT=<A>/policy-controls -- node node_modules/@playwright/test/cli.js test --config AUTOMATION/playwright.qa.config.ts s00_policy_controls',
            'B': 'a2_run.sh B <B> -- node node_modules/typescript/bin/tsc --noEmit --incremental false',
            'C': 'a2_run.sh C <C> -- node node_modules/jest/bin/jest.js --runInBand --ci --json --outputFile=<C>/maintained.json',
            'D': 'a2_run.sh D <D> -- node node_modules/jest/bin/jest.js --runInBand --ci --config <QAM>/AUTOMATION/jest.qa.config.js --json --outputFile=<D>/qa-jest.json',
            'E-controls': 'a2_run.sh E-controls <E> -- node AUTOMATION/netns_escape_controls.cjs',
            'E': 'a2_run.sh E <E> -- node node_modules/next/dist/bin/next build',
            'F': 'python3 -I AUTOMATION/a2_output_audit.py + node AUTOMATION/static_audit.cjs (see F record)',
            'G': 'a2_run.sh G <G> QA_OUT=<G> -- node node_modules/@playwright/test/cli.js test --config AUTOMATION/playwright.qa.config.ts',
            'H1': 'a2_run.sh H1 <H> -- node node_modules/@playwright/test/cli.js test --config AUTOMATION/secondary-a2/playwright.workspace-copy.config.ts',
            'H2': 'a2_run.sh H2 <H> -- node node_modules/@playwright/test/cli.js test --config AUTOMATION/secondary-a2/playwright.repair-copy.config.ts',
            'I': 'q2a2_gate.py post-run + teardown record'},
          'outputs': {k: QAM + 'evidence/q2-attempt-002/' + v for k, v in {'A': 'preparation/', 'B..I': 'acceptance/<stage>/', 'teardown': 'teardown/', 'control': 'control/'}.items()}}
json.dump(freeze, open(freeze_out, 'w'), indent=2)
receipt = {'freeze_manifest': os.path.relpath(freeze_out, repo), 'freeze_sha256': hashlib.sha256(open(freeze_out, 'rb').read()).hexdigest(),
           'approved_inventory': os.path.relpath(approved_out, repo), 'approved_sha256': hashlib.sha256(open(approved_out, 'rb').read()).hexdigest(),
           'instrument_count': len(freeze['instruments']), 'preexisting_untracked': len(pre), 'written': datetime.datetime.now().astimezone().isoformat(timespec='seconds')}
json.dump(receipt, open(receipt_out, 'w'), indent=2); print(json.dumps(receipt, indent=2))
