#!/usr/bin/env python3
"""Check review archive CRC, membership, sizes and SHA-256; no test execution."""
import hashlib, json, sys, zipfile
from pathlib import PurePosixPath
with zipfile.ZipFile(sys.argv[1]) as z:
    assert z.testzip() is None, 'CRC failure'
    names = z.namelist()
    assert len(names) == len(set(names)), 'Duplicate members'
    indices = [n for n in names if n.endswith('/local-candidate-commit-001/' + sys.argv[2] + '/FILE_INDEX.json')] if len(sys.argv) > 2 else [n for n in names if '/local-candidate-commit-001/' in n and n.endswith('/FILE_INDEX.json')]
    assert len(indices) == 1, 'Inventory must be unique'
    index = json.loads(z.read(indices[0]))
    assert set(names) == {r['path'] for r in index['files']} | {indices[0]}, 'Membership differs'
    for r in index['files']:
        p = PurePosixPath(r['path'])
        assert not p.is_absolute() and '..' not in p.parts, 'Unsafe member'
        data = z.read(r['path'])
        assert len(data) == r['bytes'], r['path']
        assert hashlib.sha256(data).hexdigest() == r['sha256'], r['path']
    print(json.dumps({'candidate_sha': index['candidate_sha'], 'payload_files': len(index['files']), 'crc': 'PASS', 'inventory_hashes': 'PASS', 'membership': 'PASS'}))
