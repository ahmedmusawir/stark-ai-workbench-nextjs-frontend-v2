#!/usr/bin/env python3
"""Reviewable working-tree patches/inventory; never writes the Git index."""
import datetime
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[6]
OUT = Path(__file__).resolve().parent
PARENT = '9c50884d4c4513b6969311d5be7c05828104ed3d'
def git(*args):
    result = subprocess.run(['git', *args], cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode not in (0, 1): raise RuntimeError(result.stderr.decode())
    return result.stdout
def sha(data): return hashlib.sha256(data).hexdigest()
def patch(paths):
    tracked = [p for p in paths if git('ls-files', '--', p)]
    data = git('diff', '--binary', PARENT, '--', *tracked) if tracked else b''
    for p in sorted(set(paths) - set(tracked)):
        data += git('diff', '--no-index', '--binary', '--', '/dev/null', p)
    return data
assert git('rev-parse', 'HEAD').decode().strip() == PARENT, 'Parent changed; do not silently repin'
product = [
    'src/components/workspace/WorkspaceEntry.tsx', 'src/components/workspace/Workspace.tsx',
    'src/app/(cyberize)/chat/workspace.scss', 'src/__tests__/config/manifest.test.ts',
    'src/app/layout.tsx', 'src/__tests__/workspace/signout.test.tsx',
    'tests/workspace/repair.config.ts', 'tests/workspace/repair.spec.ts',
    *[str(p.relative_to(ROOT)) for p in sorted((ROOT / 'src/app/fonts').rglob('*')) if p.is_file()],
]
product_data = patch(product)
(OUT / 'product.patch').write_bytes(product_data)
if '--product-only' in sys.argv:
    print(json.dumps({'parent_sha': PARENT, 'product_patch_sha256': sha(product_data), 'product_files': len(product)}))
    sys.exit(0)
status = git('status', '--porcelain=v1', '-z', '--untracked-files=all').decode().split('\0')
actual = [s[3:] for s in status if s]
excluded = ['package-lock.json']
authored = sorted(set(actual) - set(excluded))
generated = [str((OUT / n).relative_to(ROOT)) for n in ['product.patch', 'repair-authored.patch', 'file-inventory.json', 'repair-identity.json', 'staging-paths.txt']]
authored = sorted(set(authored + generated))
# New evidence content is inventoried by hash. Review patch includes the exact
# product/test/binary font delta and handoff/changelog text, avoiding recursion.
review_paths = [p for p in authored if not p.startswith(str(OUT.relative_to(ROOT)) + '/')]
review_data = patch(review_paths)
(OUT / 'repair-authored.patch').write_bytes(review_data)
disposable = [p for p in authored if '/browser-artifacts/' in p]
staging = [p for p in authored if p not in disposable]
(OUT / 'staging-paths.txt').write_text('\n'.join(staging) + '\n')
inventory = []
for p in authored:
    file = ROOT / p
    row = {'path': p, 'proposed_staging': p in staging, 'kind': 'product/test' if p in product else 'engineering record'}
    if p.endswith('/file-inventory.json') or p.endswith('/repair-identity.json'):
        row.update({'sha256': None, 'note': 'Identity/inventory cross-reference; no recursive self hash. Inventory hash is recorded in repair-identity.json.'})
    else:
        data = file.read_bytes()
        row.update({'bytes': len(data), 'sha256': sha(data)})
    inventory.append(row)
(OUT / 'file-inventory.json').write_text(json.dumps({'parent_sha': PARENT, 'files': inventory, 'excluded_preexisting_change': excluded}, indent=2)+'\n')
identity = {
    'recorded_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'parent_sha': PARENT, 'branch': git('branch', '--show-current').decode().strip(),
    'repaired_commit_sha': None, 'identity_boundary': 'Uncommitted repair delta from parent; inherited package-lock change separately preserved, not part of repair.',
    'product_patch_sha256': sha(product_data), 'review_patch_sha256': sha(review_data),
    'inventory_sha256': sha((OUT/'file-inventory.json').read_bytes()),
    'staging_paths_sha256': sha((OUT/'staging-paths.txt').read_bytes()),
    'product_test_file_count': len(product), 'authored_file_count': len(authored), 'proposed_staging_file_count': len(staging),
    'excluded_from_staging': excluded + disposable,
    'actual_status': git('status', '--short', '--untracked-files=all').decode(),
    'staged_diff': git('diff', '--cached', '--stat').decode(),
}
(OUT / 'repair-identity.json').write_text(json.dumps(identity, indent=2)+'\n')
print(json.dumps({k:v for k,v in identity.items() if k not in ['actual_status']}))
