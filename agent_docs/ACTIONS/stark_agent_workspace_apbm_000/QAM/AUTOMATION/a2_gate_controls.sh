#!/usr/bin/env bash
# Attempt-002 gate negative controls (plan v0.3 §2.7). Never touches product files in the real checkout: binding/freeze controls use
# scratch copies; source/HEAD controls use a disposable `git clone --shared` mirror (reads the real object store; writes only scratch).
# Each control must add its expected failing check on top of the baseline failure set of an unmodified mirror.
# Usage: a2_gate_controls.sh <scratch_dir> <out_dir>
set -uo pipefail
S="$1"; O="$2"; R="$(cd "$(dirname "$0")/../../../../.." && pwd)"; QR=agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM; Q="$R/$QR"
P="$Q/evidence/q2-attempt-002/preparation"; CAND=8eb5789d9021ad06c15db36db74419a2b5c68fc5; PAR=9c50884d4c4513b6969311d5be7c05828104ed3d
mkdir -p "$O"; rm -rf "$S/clone" "$S/ctl"; mkdir -p "$S/ctl"
gate() { python3 -I "$Q/AUTOMATION/q2a2_gate.py" --repo "$1" --binding "$2" --candidate $CAND --parent $PAR --approved "$P/APPROVED_INVENTORY.json" \
  --freeze "$3" --node-modules "$R/node_modules" --supplied-patch "$Q/evidence/local-candidate-commit-001/2026-10-11_161409_BDT/committed-product-test.patch" --out "$O/$4.json" > "$O/$4.out" 2>&1; echo "$4 exit=$?" >> "$O/exits.txt"; }
B="$Q/HANDOFFS/LEAD_RETEST_002_BINDING_2026-10-11.json"; F="$P/INSTRUMENT_FREEZE.json"
: > "$O/exits.txt"
# Mirror: candidate checkout + the real untracked/modified QAM and root documents + the generated next-env file.
git clone -q --shared -b qa/frontend-apbm-000 "$R" "$S/clone"
( cd "$R" && git status --porcelain=v1 -uall | cut -c4- | grep -v '^"' ) | while read -r p; do mkdir -p "$S/clone/$(dirname "$p")"; cp -p "$R/$p" "$S/clone/$p"; done
cp -p "$R/next-env.d.ts" "$S/clone/next-env.d.ts"
gate "$S/clone" "$B" "$F" C0-mirror-baseline
python3 -I - "$B" "$S/ctl/binding-tampered.json" <<'EOF'
import json, sys; b = json.load(open(sys.argv[1])); k = 'src/app/layout.tsx'; b['reviewed_payload_files'][k]['sha256'] = '0' * 64; json.dump(b, open(sys.argv[2], 'w'))
EOF
gate "$R" "$S/ctl/binding-tampered.json" "$F" NC1-tampered-binding-hash
python3 -I - "$F" "$S/ctl/freeze-tampered.json" <<'EOF'
import json, sys; f = json.load(open(sys.argv[1])); k = sorted(f['instruments'])[0]; f['instruments'][k] = 'f' * 64; json.dump(f, open(sys.argv[2], 'w'))
EOF
gate "$R" "$B" "$S/ctl/freeze-tampered.json" NC5-unapproved-instrument-hash
echo 'export const unauthorized = 1;' > "$S/clone/src/qa_unauthorized_probe.ts"; gate "$S/clone" "$B" "$F" NC2-unauthorized-source-addition; rm -f "$S/clone/src/qa_unauthorized_probe.ts"
cp -p "$S/clone/src/app/layout.tsx" "$S/ctl/layout.bak"; echo '// qa changed source probe' >> "$S/clone/src/app/layout.tsx"; gate "$S/clone" "$B" "$F" NC3-changed-source; cp -p "$S/ctl/layout.bak" "$S/clone/src/app/layout.tsx"
echo 'console.log(1)' > "$S/clone/$QR/AUTOMATION/qa_unfrozen_probe.cjs"; gate "$S/clone" "$B" "$F" NC6-unfrozen-executable; rm -f "$S/clone/$QR/AUTOMATION/qa_unfrozen_probe.cjs"
git -C "$S/clone" checkout -q --detach $PAR; gate "$S/clone" "$B" "$F" NC4-non-ancestor-head; git -C "$S/clone" checkout -q qa/frontend-apbm-000
gate "$S/clone" "$B" "$F" C0b-mirror-restored
python3 -I - "$O" <<'EOF'
import json, os, sys
O = sys.argv[1]; fails = lambda n: set(json.load(open(os.path.join(O, n + '.json')))['failed'])
base = fails('C0-mirror-baseline'); exp = {'NC1-tampered-binding-hash': 'G5', 'NC2-unauthorized-source-addition': 'G9', 'NC3-changed-source': 'G9',
       'NC4-non-ancestor-head': 'G2', 'NC5-unapproved-instrument-hash': 'G15', 'NC6-unfrozen-executable': 'G15'}
res = {'baseline_failures': sorted(base), 'restored_matches_baseline': fails('C0b-mirror-restored') == base, 'controls': {}}
for n, cid in exp.items():
    f = fails(n); added = sorted(f - base) if n.startswith(('NC2', 'NC3', 'NC4', 'NC6')) else sorted(f)
    res['controls'][n] = {'failed': sorted(f), 'added_vs_baseline': added, 'expected_check': cid, 'detected': any(x.startswith(cid + ' ') for x in f)}
res['all_detected'] = all(c['detected'] for c in res['controls'].values()) and res['restored_matches_baseline']
json.dump(res, open(os.path.join(O, 'CONTROLS_SUMMARY.json'), 'w'), indent=2); print(json.dumps(res, indent=1))
EOF
rm -rf "$S/clone" "$S/ctl"
