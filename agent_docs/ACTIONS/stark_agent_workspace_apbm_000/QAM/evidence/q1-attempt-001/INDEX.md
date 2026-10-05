# q1-attempt-001 evidence index

Candidate `22ce03ba3871ea53e5253f2e3f060a1bab3226a3` · branch `qa/frontend-apbm-000` · plan QA-APBM000-PLAN v0.1 (draft) · environment per `readiness-results.json`. Q1 intake and readiness only. No Q2 acceptance results here.

| File | What it is |
|---|---|
| candidate-identity-check.json | Output of `../../AUTOMATION/q1_candidate_identity.py`: HEAD/branch/status, 218 scope inputs, 28 changed files, 191 protected, 171 frozen, relocation docs, commit vs staging allowlist, undeclared changes, contract hashes. The strict `verdict` field reads DRIFT_OR_GAP_FOUND only because of the docs-only, untracked and gitignored items adjudicated in QAM_PREFLIGHT §1. |
| jest-candidate-22ce03b.log | Full guarded Jest on the committed candidate (paths rewritten) |
| jest-baseline-20ef380.log | Full guarded Jest on the read-only baseline extract (paths rewritten) |
| jest-independent-comparison.json | Output of `../../AUTOMATION/q1_jest_compare.py`: exact-name new/resolved/retained, compared with the Engineer list |
| INHERITED_FAILURE_ASSESSMENT.md | Independent root-cause classes A/B/C and recommendation for Lead decision D2 |
| tsc-candidate.log | TypeScript noEmit output (empty = no diagnostics, exit 0) |
| harness-probe.log, harness-probe3.log | Harness boot on QA port 43181 (normal, and inside the `unshare -rn` namespace) |
| chrome-smoke.cjs | Chrome launch smoke script (attempt 1 failed for a QA TMPDIR reason, attempt 2 passed) |
| guard-controls.cjs | Expected-red Node guard probes (non-routable/reserved targets only) |
| readiness-results.json | Structured record of probes P1–P9, versions, process/teardown state |

| jest-candidate-22ce03b.json, jest-baseline-20ef380.json | Raw Jest `--json` results (paths rewritten). The Q2 comparison input. |

The baseline source extract stayed in the QA scratchpad (outside the repo). It is reproducible with `git archive 20ef380… \| tar -x` and the commands in `readiness-results.json`.
