#!/usr/bin/env python3
"""Validate source/font identity and protected paths without live access."""
import datetime
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[6]
OUT = Path(__file__).resolve().parent
QAM = OUT.parent.parent
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
prov = json.loads((ROOT/'src/app/fonts/inter/PROVENANCE.json').read_text())
raw = (OUT/'font-source-google.css').read_text()
expected = raw
for asset in prov['assets']:
    assert sha(ROOT/'src/app/fonts/inter'/asset['file']) == asset['sha256']
    expected = expected.replace(asset['source_url'], './inter/'+asset['file'])
assert (ROOT/'src/app/fonts/inter.css').read_text().startswith(expected)
assert hashlib.sha256(raw.encode()).hexdigest() == prov['source_css_sha256']
assert sha(ROOT/'src/app/fonts/inter/OFL.txt') == prov['license']['sha256']
entry = json.loads((OUT/'entry-state.json').read_text())
checks = {p: sha(ROOT/p) == h for p,h in entry['protected_hashes'].items()}
for p in ['QAM/FINDINGS','QAM/AUTOMATION','QAM/evidence/q2-attempt-001','ACCEPTANCE_SPEC.md','RULINGS_ADDENDUM.md','DESIGN']:
    path = 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/'+p
    checks[path] = not subprocess.check_output(['git','diff',entry['parent_sha'],'--',path],cwd=ROOT)
assert all(checks.values()), 'Protected input changed'
assert not subprocess.check_output(['git','diff',entry['parent_sha'],'--','src/app/api','src/services','src/utils/supabase','supabase','next.config.js','tsconfig.json'],cwd=ROOT)
record = {'recorded_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':'python3 agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/engineering-repair-001/verify_inputs.py','exit_code':0,'font_source_css_sha256':prov['source_css_sha256'],'font_faces':7,'source_css_unchanged_except_relative_asset_urls':True,'license_equality':True,'protected_equality':checks,'other_API_service_schema_config_equality':True,'D4':'ALLOW (original release unchanged)','D7':'OMIT (original release unchanged)','production_build':'NOT RUN; next Lead-approved independent attempt owns build/output identity/separation scan'}
(OUT/'font-and-protected-verification.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps(record))
