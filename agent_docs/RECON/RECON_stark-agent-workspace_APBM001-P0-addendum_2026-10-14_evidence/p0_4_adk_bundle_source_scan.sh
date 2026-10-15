#!/usr/bin/env bash
# APBM001 P0-4 — ADK bundle source scan. OWNER-RUN, READ-ONLY, local. OPTIONAL.
#
# Run only if P0-3 shows no explicit session-storage setting (e.g. a custom
# server or image entrypoint), or if P0-1 shows a non-Cloud-Run ADK target.
# It greps the ADK bundle repository for session-service, deployment and
# ADK-version lines, masks URIs/credential-like values, and prints at most 200
# lines. It never opens .env files, venvs or .git.
#
# Usage: bash p0_4_adk_bundle_source_scan.sh /path/to/the/adk-bundle-repository
set -euo pipefail
ROOT="${1:?usage: bash p0_4_adk_bundle_source_scan.sh /path/to/the/adk-bundle-repository}"
cd "$ROOT"
REV="$(git rev-parse --short HEAD 2>/dev/null || echo no-git)"
echo "# APBM001-P0-4 bundle source scan v1 — repo: $(basename "$PWD") @ ${REV} — masked"
{ grep -rnIE \
    --include='*.py' --include='Dockerfile*' --include='*.sh' --include='*.yaml' --include='*.yml' \
    --include='*.toml' --include='requirements*.txt' --include='Procfile' --include='Makefile' \
    --exclude='.env*' --exclude-dir=.git --exclude-dir=.venv --exclude-dir=venv \
    --exclude-dir=node_modules --exclude-dir=__pycache__ --exclude-dir=site-packages \
    -e 'session_service_uri|session_db_url|SessionService|get_fast_api_app|api_server|adk (web|run|deploy)' \
    -e 'google-adk|DATABASE_URL|SESSION_|AGENT_ENGINE|reasoning_engine|memory_service' \
    -e 'allow-unauthenticated|--ingress|min-instances|max-instances|gcloud run deploy' . || true; } \
| python3 -I -c '
import re, sys
uri = re.compile(r"([A-Za-z][A-Za-z0-9+.\-]*://)[^\s\x27\x22]+")
kv = re.compile(r"(?i)\b([A-Za-z0-9_\-]*(?:pass(?:word)?|pwd|secret|token|api[_-]?key|credential)[A-Za-z0-9_\-]*)\s*([=:])\s*[^\s\x27\x22]+")
long_tok = re.compile(r"[A-Za-z0-9+/_\-]{40,}={0,2}")
n = 0
for line in sys.stdin:
    line = uri.sub(lambda m: m.group(1) + "<redacted>", line.rstrip("\n"))
    line = kv.sub(lambda m: m.group(1) + m.group(2) + "<redacted>", line)
    print(long_tok.sub("<redacted-long>", line)[:300])
    n += 1
    if n >= 200:
        print("# … truncated at 200 lines"); break
print(f"# lines: {n}")
'
