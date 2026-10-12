# q2-attempt-002 evidence index

Candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5` = execution HEAD · plan v0.3 `6b3f5df3…` · binding `06aed917…` · release `adb0a642…` · freeze r4 `3c134849…` / r5 `f668a286…` · every test body inside `unshare -rn` via `AUTOMATION/a2_run.sh`.

| Path | Contents |
|---|---|
| `EXECUTION_REPORT.md` | Identity, commands/exits, corrections, environment notes, build-generated changes, recommendation |
| `AC_MATRIX.md` | Complete 24-row matrix with literal grades and evidence |
| `INSTRUMENT_RETRY_LEDGER.md` | Every instrument/environment event, diagnostic rerun and freeze revision |
| `preparation/` | INSTALL_RECORD; APPROVED_INVENTORY; INSTRUMENT_FREEZE r1–r5 + receipts; instrument-baseline (40 pre-correction instruments + sha256 list); gate-preflight run1/run2, gate-postbuild; gate-fix-1/s00-fix-1/s20-fix-1 diffs; gate-controls (6 controls + mirror baselines + summary); namespace-controls; policy-controls (run1 failed instrument, run2 final); secondary-copies COPY_RECORD; NEXT_ENV_DISPOSITION; PREBUILD_NEXT |
| `acceptance/E/` | Build namespace escape controls; build log/command (exit 0) |
| `acceptance/F/` | output-audit.json, static-audit.json, chat-auth-relation.txt |
| `acceptance/B/`, `C/`, `D/` | tsc; maintained Jest JSON/log + count-drift-check + F04 assertions; QA Jest JSON/log |
| `acceptance/G/` | Playwright results, 34 per-test policy ledgers, records/*.json, screens/*.png (25 renders + S-20 collateral + others) |
| `acceptance/G-diag-s20/` | Targeted S-20 with OS Inter hidden (environment diagnostic) |
| `acceptance/H/` | Secondary workspace copy (33) and repair copy (27): results, ledgers, rewired outputs |
| `teardown/` | Process/port/temp teardown, files modified since session start, post-run gate |
