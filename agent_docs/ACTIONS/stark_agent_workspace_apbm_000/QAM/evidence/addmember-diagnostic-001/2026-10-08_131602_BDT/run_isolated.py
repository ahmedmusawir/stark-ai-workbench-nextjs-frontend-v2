"""One authorized target-only diagnostic; do not repeat this attempt."""
import datetime
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[7]
OUT = Path(__file__).resolve().parent
command = [
    'unshare', '-rn', 'npm', 'test', '--', '--runInBand',
    '--runTestsByPath', 'src/__tests__/admin/AddMemberForm.test.tsx',
    '--testNamePattern=^AddMemberForm does not redirect when addMember returns an error$',
    '--json', '--outputFile=' + str(OUT / 'isolated.json'),
]
env = {k: os.environ[k] for k in ('PATH', 'HOME', 'LANG', 'TMPDIR') if k in os.environ}
env.update({'CI': '1', 'NEXT_TELEMETRY_DISABLED': '1'})
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
with (OUT / 'isolated-invocation.json').open('x') as marker:
    marker.write(json.dumps({'started_at': started, 'authorized_invocations': 1, 'command': command}, indent=2) + '\n')
t = time.monotonic()
with (OUT / 'isolated.log').open('w') as log:
    result = subprocess.run(command, cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT)
record = {'command': command, 'cwd': str(ROOT), 'started_at': started,
          'seconds': round(time.monotonic() - t, 3), 'exit_code': result.returncode,
          'log': 'isolated.log', 'network': 'unshare -rn, no external network; sanitized environment; no QA font hook',
          'scope': 'Only the one named failing test; other tests filtered out',
          'invocations': 1, 'full_suite_rerun': False}
(OUT / 'isolated-command.json').write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps(record))
print('\n'.join((OUT / 'isolated.log').read_text().splitlines()[-22:]))
sys.exit(result.returncode)
