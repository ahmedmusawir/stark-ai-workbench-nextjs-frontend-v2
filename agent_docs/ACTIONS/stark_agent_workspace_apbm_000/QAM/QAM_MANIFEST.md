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
