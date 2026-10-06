# Director Q2 release record: APBM_000

Recorded by the independent QA Executor (Claudy) on 2026-10-05 at 19:35:16 Asia/Dhaka. Source: Tony (Director) in the Executor's Claude Code session. Text verbatim:

> "Allow the font download needed for the build. Skip my optional visual check. Begin testing after verifying the commit."

## Interpretation (Executor; nothing added beyond the words)

| Item | Recorded value |
|---|---|
| D4 | **ALLOW**: font download needed for the build, under plan v0.2 §11.2 enforcement |
| D7 | **OMIT**: Director comfort check skipped by Director choice. The Lead records whether the omission matters. |
| Q2 release | **Granted, conditional on commit verification** ("after verifying the commit") |
| Candidate / plan named by Director | Not recited. The Executor bound them at verification: approved product reference 22ce03ba…, plan v0.2 8ddb743f…0337 (committed byte-exact in 9a65cdd and f21564c) |
| N1 | Not mentioned. It remains a non-blocking acknowledgement request. |

## Commit verification result: **Q2 HELD at Q2-0 (no acceptance body executed)**

- Execution HEAD is `f21564cacb563ecddbf78b1685086c9489bf1c26` (Tony, 19:31:01, "keep this must ... do not change if you do my remote agents wont work"), pushed to origin. It is the child of 9a65cdd. Candidate 22ce03b is an ancestor.
- f21564c changes **product config** relative to the candidate:
  - `config/agents.manifest.json` modified (Hermes roster → remote ADK roster)
  - `config/agents.manifest-hermes.json` added
  - `config/agents.manifest copy.json` deleted
- Under plan v0.2 Q2-0 and §11.1, intervening product/config drift means **STOP and get a fresh Lead candidate/plan binding**. Raw verdict: PRODUCT_DRIFT_OR_IDENTITY_FAILURE (`evidence/q2-prep-003/identity-head-f21564c.json`).
- The Executor will not change, restore or rename any manifest file (standing Director instruction).
- The release stays on record and becomes effective once the Lead rebinds (or confirms the 22ce03b extract route) under the ruling request `HANDOFFS/Q2_RULING_REQUEST_2026-10-05_193516.md`.
