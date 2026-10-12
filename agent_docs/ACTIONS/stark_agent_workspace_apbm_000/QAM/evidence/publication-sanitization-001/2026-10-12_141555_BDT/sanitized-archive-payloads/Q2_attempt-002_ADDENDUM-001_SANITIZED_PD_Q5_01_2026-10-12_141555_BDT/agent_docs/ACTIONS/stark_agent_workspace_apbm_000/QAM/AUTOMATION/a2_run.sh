#!/usr/bin/env bash
# Attempt-002 stage runner (disposable QA instrument). Runs one command from the repo root inside a fresh user+network namespace
# (unshare -rn: loopback only, no host services, no external route) with env -i (PATH/HOME/LANG/run-owned TMPDIR + explicit KEY=VAL
# extras). Never sources dotenv. Records command, start, duration and exit to <outdir>/<stage>.cmd.json; output to <stage>.log.
# Usage: a2_run.sh <stage> <outdir> [KEY=VAL ...] -- <command...>
set -uo pipefail
stage="$1"; outdir="$2"; shift 2
extra=(); while [ "$#" -gt 0 ] && [ "$1" != "--" ]; do extra+=("$1"); shift; done; shift
repo="$(cd "$(dirname "$0")/../../../../.." && pwd)"
tmp="/tmp/claude-1000/qa-a2-tmp/${stage}"; mkdir -p "$outdir" "$tmp"
nodebin="/home/moose/.nvm/versions/node/v24.15.0/bin"
start_iso=$(date --iso-8601=seconds); t0=$(date +%s%N)
( cd "$repo" && unshare -rn sh -c 'ip link set lo up && exec "$@"' sh \
    env -i PATH="$nodebin:/usr/local/bin:/usr/bin:/bin" HOME="$HOME" LANG=C.UTF-8 TMPDIR="$tmp" NEXT_TELEMETRY_DISABLED=1 CI=1 \
    "${extra[@]}" "$@" ) > "$outdir/$stage.log" 2>&1
rc=$?; t1=$(date +%s%N)
python3 -I - "$outdir/$stage.cmd.json" "$stage" "$start_iso" "$(( (t1 - t0) / 1000000 ))" "$rc" "$tmp" "${#extra[@]}" "${extra[@]}" "$@" <<'EOF'
import json, sys
out, stage, started, ms, rc, tmp, n = sys.argv[1:8]; rest = sys.argv[8:]; n = int(n)
json.dump({'stage': stage, 'command': rest[n:], 'extra_env_keys': [e.split('=', 1)[0] for e in rest[:n]], 'started': started,
           'duration_s': int(ms) / 1000, 'exit': int(rc), 'cwd': 'repo root', 'namespace': 'unshare -rn; lo up; no external route',
           'env': 'env -i PATH HOME LANG TMPDIR NEXT_TELEMETRY_DISABLED=1 CI=1 + extra', 'tmpdir': tmp}, open(out, 'w'), indent=2)
EOF
echo "STAGE $stage exit=$rc duration=$(( (t1 - t0) / 1000000 ))ms log=$outdir/$stage.log"
exit $rc
