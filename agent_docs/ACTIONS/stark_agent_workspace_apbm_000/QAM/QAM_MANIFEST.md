# QAM manifest — engineering facts, no approval

Status: ENGINEERING FACTS COMPLETE; independent Q1 pending.

| Field | Recorded value |
|---|---|
| Module | stark_agent_workspace_apbm_000 v1.0 |
| Repository | `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2` |
| Evidence baseline / current engineering HEAD | `20ef380bdd6eed5e111d953d6404992add7a88a6` |
| Actual engineering branch | frontend-apbm |
| Intended QA branch | qa/frontend-apbm-000 — not created by Engineer |
| Product candidate SHA | UNCOMMITTED; Director must commit reviewed scope; current HEAD is baseline only |
| Dirty inventory | ../evidence/engineering-attempt-001/changed-source-inventory.json and candidate-identity.json; entry-identity.json separates prior work |
| Full candidate scope | ../evidence/engineering-attempt-001/candidate-scope.json, SHA256 `338dbdf4ee6a93590ce3114b34b49e66ec8c90df1020205ff6ec38e5d63c87cf`; 218 inputs, product/tests/config/lock/build/fonts |
| Acceptance/ruling integrity | ../evidence/engineering-attempt-001/frozen-packet-equality.json; acceptance and ruling files unchanged, hashes recorded; repin at Q1b |
| Current QA HEAD / docs successors | NOT RECORDED — independent Q1 |
| Independent plan version/hash / Lead approval | NONE — pending Q1/Q1b |
| Director Q2 release | NONE |
| Target | Real presentation in isolated fixture harness; production source/build/mocked adapter regression; zero live service allowance |
| Runtime/browser | Node 26.7.0, npm 11.19.0, Next 16.2.6, Playwright 1.59.1, installed Chrome 154.0.8037.92 at /opt/google/chrome/chrome |
| Port/config/boot/teardown | 127.0.0.1:43170; playwright.workspace.config.ts; node tests/workspace/harness.cjs; own server SIGTERM/SIGINT cleanup; no server reuse |
| Commands/fixtures/guards | ../evidence/engineering-attempt-001/REPRODUCTION.md; no production auth/services in fixture graph; browser exact-origin and Node loopback guard |
| Self-check results | Build/TS PASS; targeted 57/57; browser 33/33; full Jest 250 pass/37 inherited fail, zero new; retained failures await Lead adjudication |
| Handoff/evidence | HANDOFFS/QA_HANDOFF.md and ../evidence/engineering-attempt-001/ENGINEER_AC_CLAIMS.md |
| Gate Q | NOT ISSUED; AC000-24 NOT RUN |

Recorded 2026-10-04T21:59:35.844675+06:00. Engineer supplies facts only. QA must pin the committed candidate and derive its own plan. Any later source/test/config/dependency change requires impact classification; docs-only equivalence cannot be guessed from a newer HEAD.

Director-requested path correction 2026-10-04T22:14:42.603752+06:00: QAM_ENTRY now reads HANDOFFS/QA_HANDOFF.md; source candidate and acceptance criteria unchanged. Original frozen-packet equality is historical; path correction is recorded in ../evidence/engineering-attempt-001/handoff-location-correction.json.

## Current facts appended by QA Executor — 2026-10-05T18:26+06:00

The historical rows above (UNCOMMITTED, pointer wording) are preserved as the record of that time. Current facts: product candidate **22ce03ba3871ea53e5253f2e3f060a1bab3226a3** (committed); QA branch qa/frontend-apbm-000; execution HEAD now 2f488e4 (Q1 QAM docs commit, candidate is ancestor). Q1 package Q1_attempt-001.zip sha256 aa7c3a5e…f0d5. Q1b: Lead approved plan v0.2 sha256 8ddb743f…0337 (Q1B_REVIEW.md ce02c5cb…fe2f), installed byte-exact, not yet committed. Director D4/D7/Q2 release: NONE. Q2 blockers: working-tree manifest roster swap + untracked agents.manifest_hermes.json (config drift); module-root QA_HANDOFF.md pointer still present. Open finding DIRECTOR-OBS-001 (+ Executor addendum 001). Gate Q NOT ISSUED.

## Current facts appended by QA Executor — 2026-10-11T18:12+06:00 (Q2 attempt-002)

Earlier rows and appendices are preserved as dated history. Current: product candidate **8eb5789d9021ad06c15db36db74419a2b5c68fc5** (parent 9c50884d…, branch qa/frontend-apbm-000; execution HEAD = candidate). Plan **QA-APBM000-PLAN v0.3** `6b3f5df3…` (v0.2 preserved in HANDOFFS). Director release `HANDOFFS/DIRECTOR_Q2_RELEASE_002_2026-10-11_174045_BDT.txt`. Environment: Node 24.15.0, npm 11.12.1, Next 16.2.6, Jest 30.0.5, TypeScript 5.5.4, Playwright 1.59.1, Chrome 150.0.7871.114. QA ports 43181 (QA harness), 43182 (workspace copy), 43183 (repair copy); all test bodies in `unshare -rn` via `AUTOMATION/a2_run.sh`. Gate `AUTOMATION/q2a2_gate.py` (post-build GATE_PASS 17/17). Results and evidence: `evidence/q2-attempt-002/` (EXECUTION_REPORT.md, AC_MATRIX.md, INSTRUMENT_RETRY_LEDGER.md). Gate Q PENDING; AC000-24 NOT RUN.

Q5 appended 2026-10-11T19:25+06:00: bounded Q5 complete for candidate 8eb5789d…; root `RECOVERY.md` restored to HEAD bytes, root session pointer removed, QA recovery pointer kept inside QAM (`QA_RECOVERY.md`); records `evidence/q5-attempt-002/`. Gate Q PENDING.


## Current Architect-authorized engineering closeout — 2026-10-12T13:10:40.681454+06:00

Earlier pending/status blocks above are preserved as dated history. Controlling independent record: [APBM000_GATE_Q_CERTIFICATE_2026-10-12.txt](HANDOFFS/APBM000_GATE_Q_CERTIFICATE_2026-10-12.txt), SHA-256 `6cfe664f5c10f2aa2ee810328db6e465869af9607af82b6a2ae5d921cac43a49`, for exact candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5` on `qa/frontend-apbm-000`. Gate Q **PASS** for the certified bounded scope; Q5 **ACCEPTED / COMPLETE**; process verdict **NONCOMPLIANT**. Engineering closeout **IN PROGRESS**, Git integration **PENDING TONY**, APBM_001 **NOT LAUNCHED**. Cody is the sole active writer; Claudy is paused under the explicit Architect transfer. D4 **ALLOW**, D7 **OMIT**.

Fixture-qualified workspace UI and source/build regression under independent plan v0.3 passed; F01–F04 are resolved within tested fixture scope. No live ADK/Supabase/GCS/GHL integration, durable-session/persistence, authenticated production-route, server logout, token-revocation, deployment or Gate D certification. DIRECTOR-OBS-001 remains UNTRIAGED-live; O-1 remains an observation. Earlier fallback rows are qualified by OS-installed Inter; use the accepted targeted fallback diagnostic. Q5's 51-minute inventory gap, filtered status excerpt and path-classified Executor-document entries remain disclosed; no contemporaneous inventory is reconstructed.

PD-002-01 (proceeded after GATE_STOP without ruling) and PD-Q5-01 (earlier private-file digest generation) remain process violations; no future override or retrospective permission. Preserve the two digest-bearing originals and derivative archives unchanged. Tony's retention/publication decision is required before committing/publishing those payloads; they are excluded from the new closeout ZIP. No redaction or credential rotation is ordered by the available evidence. Instruments, Engineer-suite copies, historical failures, failed-run/Engineer caches and Stage E output remain retained; Gate Q grants no deletion authority.

No suite/build/live probe or product/test/dependency/config/acceptance/roster change is part of this closeout. Stop at **READY FOR ARCHITECT REVIEW / DIRECTOR DISPOSITION**; final engineering closure, Git integration and APBM_001 launch await their owners.
