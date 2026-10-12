#!/usr/bin/env python3
"""Engineering checks only; run installed commands in a networkless namespace."""
import datetime
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[6]
OUT = Path(__file__).resolve().parent
CHECKS = {
    'baseline-full': ['npm', 'test', '--', '--runInBand', '--json', '--outputFile=' + str(OUT / 'baseline-full.json')],
    'focused': ['npm', 'test', '--', '--runInBand', '--runTestsByPath', 'src/__tests__/workspace/signout.test.tsx', 'src/__tests__/workspace/navigation.test.ts', 'src/__tests__/workspace/components.test.tsx', 'src/__tests__/workspace/productionAdapter.test.ts', 'src/__tests__/chat/chatStore.persist.test.ts', 'src/__tests__/chat/chatStore.modeSplit.test.ts', 'src/__tests__/chat/chatStore.sessions.test.ts', 'src/__tests__/config/manifest.test.ts', '--json', '--outputFile=' + str(OUT / 'focused.json')],
    'full': ['npm', 'test', '--', '--runInBand', '--json', '--outputFile=' + str(OUT / 'full.json')],
    'typecheck': ['npx', '--no-install', 'tsc', '--noEmit'],
}

name = sys.argv[1]
command = ['unshare', '-rn', *CHECKS[name]]
# No personal credentials, font hooks, service configuration or NODE_OPTIONS.
env = {k: os.environ[k] for k in ('PATH', 'HOME', 'LANG', 'TMPDIR') if k in os.environ}
env.update({'CI': '1', 'NEXT_TELEMETRY_DISABLED': '1'})
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
t = time.monotonic()
with (OUT / (name + '.log')).open('w') as log:
    result = subprocess.run(command, cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT)
record = {'command': command, 'cwd': str(ROOT), 'started_at': started, 'seconds': round(time.monotonic() - t, 3), 'exit_code': result.returncode, 'log': name + '.log', 'network': 'unshare -rn; no network interfaces except down loopback; no QA font hook'}
(OUT / (name + '-command.json')).write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps(record))
print('\n'.join((OUT / (name + '.log')).read_text().splitlines()[-18:]))
sys.exit(result.returncode)
