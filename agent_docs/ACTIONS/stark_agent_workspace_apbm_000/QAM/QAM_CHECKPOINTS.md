# Checkpoints and exact owners

| Checkpoint | Owner action | Required output / current state |
|---|---|---|
| Build entry/completion | Engineer executes within module; no routine Director stops | Factual engineering return; NOT STARTED |
| Candidate/QA branch | Tony commits selective candidate and opens qa/frontend-apbm-000 | Full SHA and branch; PENDING |
| Q1 | Independent Executor intake + plan | Indexed Q1 ZIP; PENDING |
| Q1b | QA Lead approves plan; Architect rules scope questions; Tony commits approved instructions and releases Q2 | Candidate/plan/ruling-bound record; PENDING |
| Q2 | Executor runs complete approved test body | Report, AC matrix, evidence, findings; PENDING |
| Q3 adjudication | QA Lead classifies findings | Certifiable/repair/contract/environment/instrument ruling; PENDING |
| Q4 if needed | Architect bounds repair; Engineer fixes; Tony commits; QA retests | New candidate, linked finding, affected + required regression proof; CONDITIONAL |
| Q5 | Executor cleans declared artifacts after Lead disposition | Safe final package/cleanup; PENDING |
| Gate Q | QA Lead certifies phase scope and separately grades process | Exact certificate; NOT ISSUED |
| Closeout | Architect instructs; Engineer records; Tony commits/merges/pushes | Exact approved scope and final Git receipts; PENDING |

Tony's manual check is focused comfort/visual judgment on a completed build, not the repeated QA matrix. No fresh design approval needed for faithful implementation. Credentials are not needed for the default fixture plan. A new live account/access need must be explicit, not an endless surprise prompt chain.

## Current status appended by QA Executor (2026-10-05 Asia/Dhaka)

| Checkpoint | Actual state |
|---|---|
| Candidate/QA branch | DONE: product candidate 22ce03b on qa/frontend-apbm-000. Execution HEAD 2f488e4 (QAM docs commit). |
| Q1 | DONE: Q1_attempt-001.zip sha256 aa7c3a5e…f0d5, READY_FOR_PLAN_REVIEW |
| Q1b | Lead APPROVED plan v0.2 (8ddb743f…0337, Q1B_REVIEW.md ce02c5cb…fe2f). Installed byte-exact, **not committed**. Director D4/D7/Q2 release PENDING. |
| Q2 | NOT STARTED. Blocked by the working-tree manifest roster swap (config drift), the uncommitted Q1b records and the missing Director release. Q2 identity instrument prepared (AUTOMATION/q2_identity.py). |
