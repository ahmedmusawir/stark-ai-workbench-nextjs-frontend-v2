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

## Current status appended by QA Executor (2026-10-11 Asia/Dhaka, Q2 attempt-002)

Rows above are preserved as dated history.

| Checkpoint | Actual state |
|---|---|
| Q3 (attempt-001) | Lead disposition installed (`HANDOFFS/LEAD_Q2_DISPOSITION_2026-10-07.md`) |
| Q4 | Repaired candidate `8eb5789d…` committed by Tony; Lead intake accepted; plan v0.3 approved (`HANDOFFS/LEAD_RETEST_002_APPROVAL_2026-10-11.md`); Director release recorded verbatim |
| Q2 attempt-002 | DONE 2026-10-11 18:08: tsc 0; build 0; maintained Jest 290/290; QA Jest 31/31; browser 34/34; secondary 33/33 + 27/27; proposed 23 PASS, AC000-24 NOT RUN; F01–F04 retest PASS |
| Q3 (attempt-002) | PENDING — QA Lead findings disposition |
| Q5 | NOT STARTED — not authorized |
| Gate Q | PENDING |

## Current status appended by QA Executor (2026-10-11 19:25 Asia/Dhaka)

| Checkpoint | Actual state |
|---|---|
| Q3 (attempt-002) | DONE: Lead accepted F01–F04 as resolved (fixture scope); addendum-001 accepted |
| Q5 | DONE (bounded): root placement corrected (option A); 5 authorized caches deleted; everything else retained per amended disposition (`evidence/q5-attempt-002/`) |
| Gate Q | PENDING — QA Lead certification review |

## Appended by QA Executor (2026-10-12 Asia/Dhaka)

| Checkpoint | Actual state |
|---|---|
| Q5 reconciliation | Lead ruling 2026-10-12 11:55: the 2026-10-11 Q5 post-state is accepted as expected; evidence reconciled and packaged as `HANDOFFS/Q5_attempt-002_REVIEW-002.zip` (current review package) |
| Gate Q | PENDING — QA Lead certification review + separate process verdict |


## Current Architect-authorized engineering closeout — 2026-10-12T13:10:40.681454+06:00

Earlier pending/status blocks above are preserved as dated history. Controlling independent record: [APBM000_GATE_Q_CERTIFICATE_2026-10-12.txt](HANDOFFS/APBM000_GATE_Q_CERTIFICATE_2026-10-12.txt), SHA-256 `6cfe664f5c10f2aa2ee810328db6e465869af9607af82b6a2ae5d921cac43a49`, for exact candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5` on `qa/frontend-apbm-000`. Gate Q **PASS** for the certified bounded scope; Q5 **ACCEPTED / COMPLETE**; process verdict **NONCOMPLIANT**. Engineering closeout **IN PROGRESS**, Git integration **PENDING TONY**, APBM_001 **NOT LAUNCHED**. Cody is the sole active writer; Claudy is paused under the explicit Architect transfer. D4 **ALLOW**, D7 **OMIT**.

Fixture-qualified workspace UI and source/build regression under independent plan v0.3 passed; F01–F04 are resolved within tested fixture scope. No live ADK/Supabase/GCS/GHL integration, durable-session/persistence, authenticated production-route, server logout, token-revocation, deployment or Gate D certification. DIRECTOR-OBS-001 remains UNTRIAGED-live; O-1 remains an observation. Earlier fallback rows are qualified by OS-installed Inter; use the accepted targeted fallback diagnostic. Q5's 51-minute inventory gap, filtered status excerpt and path-classified Executor-document entries remain disclosed; no contemporaneous inventory is reconstructed.

PD-002-01 (proceeded after GATE_STOP without ruling) and PD-Q5-01 (earlier private-file digest generation) remain process violations; no future override or retrospective permission. Preserve the two digest-bearing originals and derivative archives unchanged. Tony's retention/publication decision is required before committing/publishing those payloads; they are excluded from the new closeout ZIP. No redaction or credential rotation is ordered by the available evidence. Instruments, Engineer-suite copies, historical failures, failed-run/Engineer caches and Stage E output remain retained; Gate Q grants no deletion authority.

No suite/build/live probe or product/test/dependency/config/acceptance/roster change is part of this closeout. Stop at **READY FOR ARCHITECT REVIEW / DIRECTOR DISPOSITION**; final engineering closure, Git integration and APBM_001 launch await their owners.
