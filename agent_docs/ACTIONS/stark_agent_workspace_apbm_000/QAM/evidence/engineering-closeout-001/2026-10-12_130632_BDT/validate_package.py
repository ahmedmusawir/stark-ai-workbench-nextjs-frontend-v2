#!/usr/bin/env python3
"""Validate closeout ZIP CRC, inventory membership, sizes and hashes only."""
import hashlib, json, sys, zipfile
from pathlib import PurePosixPath
with zipfile.ZipFile(sys.argv[1]) as z:
    names=z.namelist()
    assert len(names)==len(set(names))
    assert z.testzip() is None
    indices=[n for n in names if '/engineering-closeout-001/' in n and n.endswith('/FILE_INDEX.json')]
    assert len(indices)==1
    d=json.loads(z.read(indices[0]))
    assert set(names)=={r['path'] for r in d['files']}|{indices[0]}
    for r in d['files']:
        p=PurePosixPath(r['path']); assert not p.is_absolute() and '..' not in p.parts
        data=z.read(r['path']); assert len(data)==r['bytes'] and hashlib.sha256(data).hexdigest()==r['sha256']
    print(json.dumps({'candidate':d['candidate'],'files':len(d['files']),'crc':'PASS','inventory':'PASS'}))
