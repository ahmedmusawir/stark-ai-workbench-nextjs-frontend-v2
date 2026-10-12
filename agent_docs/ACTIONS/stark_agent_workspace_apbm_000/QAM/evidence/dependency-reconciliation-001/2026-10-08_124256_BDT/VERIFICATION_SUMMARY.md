# Reconciled dependency verification

Focused 64/64, typecheck PASS, engineering browser 27/27. **Full Jest 289 passed / 1 failed, FAIL, no waiver.** Every check ran once with installed committed versions.

| Command/check | Exit | Evidence |
| --- | ---: | --- |
| npm ci | 0 | `npm-ci-command.json` |
| focused maintained regressions | 0 | `focused-command.json` |
| full maintained Jest | 1 | `full-command.json` |
| typecheck | 0 | `typecheck-command.json` |
| engineering offline browser | 0 | `browser-command.json` |

Exact failure/mechanism limits: FULL_SUITE_FAILURE.md and full-suite-failure.json. Actual versions: installed-versions.json. Normal independent production build/acceptance NOT RUN; Gate Q pending.
