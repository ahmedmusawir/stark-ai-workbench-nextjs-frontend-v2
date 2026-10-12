"""Authorized engineering checks, each once, in a networkless namespace."""
import datetime
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[7]
OUT = Path(__file__).resolve().parent
CHECKS = {
    'addmember': ['npm', 'test', '--', '--runInBand', '--runTestsByPath',
                  'src/__tests__/admin/AddMemberForm.test.tsx', '--json',
                  '--outputFile=' + str(OUT / 'addmember.json')],
    'full': ['npm', 'test', '--', '--runInBand', '--json',
             '--outputFile=' + str(OUT / 'full.json')],
    'typecheck': ['npx', '--no-install', 'tsc', '--noEmit'],
}
name = sys.argv[1]
if name != 'addmember':
    first = json.loads((OUT / 'addmember-command.json').read_text())
    tests = json.loads((OUT / 'addmember.json').read_text())
    assert first['exit_code'] == 0 and tests['numPassedTests'] == 7 and tests['numFailedTests'] == 0
env = {k: os.environ[k] for k in ('PATH', 'HOME', 'LANG', 'TMPDIR') if k in os.environ}
env.update({'CI': '1', 'NEXT_TELEMETRY_DISABLED': '1'})
command = ['unshare', '-rn', *CHECKS[name]]
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
with (OUT / (name + '-invocation.json')).open('x') as marker:
    marker.write(json.dumps({'started_at': started, 'command': command, 'authorized_invocations': 1}, indent=2) + '\n')
t = time.monotonic()
with (OUT / (name + '.log')).open('w') as log:
    result = subprocess.run(command, cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT)
record = {'command': command, 'cwd': str(ROOT), 'started_at': started,
          'seconds': round(time.monotonic() - t, 3), 'exit_code': result.returncode,
          'log': name + '.log', 'invocations': 1,
          'network': 'unshare -rn; no external network or live service access; sanitized environment; no QA font hook'}
(OUT / (name + '-command.json')).write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps(record))
print('\n'.join((OUT / (name + '.log')).read_text().splitlines()[-22:]))
sys.exit(result.returncode)
