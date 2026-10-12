#!/usr/bin/env python3
"""Isolate browser and fixture together; loopback-only, no QA attempt dispatch."""
import datetime
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[6]
OUT = Path(__file__).resolve().parent
if '--inside' in sys.argv:
    subprocess.run(['ip', 'link', 'set', 'lo', 'up'], check=True)
    subprocess.run(['ip', '-brief', 'address'], check=True)
    sys.exit(subprocess.run(['node', 'node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/workspace/repair.config.ts'], cwd=ROOT).returncode)
env = {k: os.environ[k] for k in ('PATH', 'HOME', 'LANG', 'TMPDIR') if k in os.environ}
env.update({'CI': '1', 'NEXT_TELEMETRY_DISABLED': '1'})
command = ['unshare', '-rn', 'python3', str(Path(__file__).resolve()), '--inside']
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
t = time.monotonic()
with (OUT / 'browser.log').open('w') as log:
    result = subprocess.run(command, cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT)
record = {'command': command, 'inner_command': ['node', 'node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/workspace/repair.config.ts'], 'cwd': str(ROOT), 'started_at': started, 'seconds': round(time.monotonic()-t,3), 'exit_code': result.returncode, 'network': 'new user/network namespace; only loopback interface enabled; browser and fixture in same namespace; browser exact local-origin route guard; no production auth/services or QA font hook', 'log': 'browser.log'}
(OUT / 'browser-command.json').write_text(json.dumps(record, indent=2)+'\n')
print(json.dumps(record))
print('\n'.join((OUT / 'browser.log').read_text().splitlines()[-22:]))
sys.exit(result.returncode)
