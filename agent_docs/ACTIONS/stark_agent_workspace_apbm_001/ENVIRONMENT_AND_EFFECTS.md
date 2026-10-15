# Environment, access and bounded effects

Repository working directory is the actual root found by read-only git rev-parse --show-toplevel. Do not assume /home/stark vs /home/moose from a terminal label. Expected repo name and baseline are in START_HERE. Use loopback for local app and fixture servers; claim only free ports and stop only owned processes.

Actual local app routes must be exercised for live acceptance. Normal framework config loading is permitted. A safe runtime diagnostic may emit only mode, configured/not-configured flags, public Supabase project reference and opaque backendKey; never values from unrelated env keys, file contents or env-file digests. Expected frontend auth ref: rwosuvbufaqwbaukohkk; live bundle URL is in DATA_CONTRACT. An unexpected target is STOP-ENV; do not correct by guessing. No application restart or tool may terminate another owner's process.

Existing tools/dependencies first. Inspect package scripts, then use the repository lockfile for reproducible install when needed (npm ci if npm lockfile governs). Registry download, existing build's Inter font fetch and browser-binary installation are allowed as setup, subject to runtime policy. No dependency upgrades, npm audit fixes or lockfile regeneration. Build/network failure is a reported environment blocker; no font replacement or weakened build to conceal it.

## Credentials and login
One Director-authorized normal frontend test account, no admin/service-role credential. Tony may sign in interactively in the permitted browser, or supply ignored/untracked .env.qa.local with exactly APBM001_QA_EMAIL and APBM001_QA_PASSWORD for an authorized local QA helper. Verify ignore/untracked status before creating/reading it. No values in command arguments, output, report, traces or screenshots. Helper reads directly to memory, not the app build/server environment. No shell export or sourcing. This is narrowly permitted for this credential file, not .env.local. If tool policy requires manual login, use it and record the access checkpoint.

Record account identity only as a pseudonym and same-user equality checks; never collect existing real-user conversations into exports. UI-generated test sessions belong to that user's ADK namespace. All messages are synthetic. Do not read other people's namespaces or exercise destructive agent tools. Stop if unrelated private data would enter evidence; sanitize before export.

## Remote budgets per phase, not automatically renewable
| Phase | Login cycles maximum | New sessions maximum | Run messages maximum | Session/list/history GET maximum | Roster GET maximum |
|---|---|---|---|---|---|
| Engineering self-verification | 2 | 2 | 3 | 30 | 4 |
| Q1 readiness only | 2 | 0 | 0 | 2 | 2 |
| Q2 after Lead approval + Tony release | 3 | 2 | 3 | 40 | 6 |

All live calls go only to the confirmed bundle, greeting_agent, through the real frontend for acceptance. Each engineering/Q2 run uses fresh APBM001 synthetic A/B title markers; two initial messages and one continuation exhaust three run calls. Existing 10-04/10-14 probe namespaces are preserved and are not automatically re-probed. Authentication traffic is separate, bounded to the login cycles and normal session refresh; record counts. Roster fetches may inspect /list-apps but must not execute other agents. Account signup/password changes are not authorized.

Instrument the total across browser reloads and server calls, including attempts/timeouts; don't reset the ledger per test. No automatic remote mutation retries, session deletes, schema mutations, deployment, IAM changes, cloud restarts or artificial load. Do not inject failure into the live agent path: use local deterministic fixtures for abort/timeout/race/unknown-user tests. Read-only retries need explicit plan budget, never hidden loops. Stop before exceeding budget and return results already obtained; Q2 budget is not available to Engineering or Q1.

Live walk: sign in; create A with marker A, create B with marker B; switch A/B twice; reload B; close/reopen tab on A; continue A asking its marker; sign out/in and reopen; inspect list and separate transcripts. Use read-only missing-state checks only when required by plan and within budget. No new message after the three-call cap. A short final Tony comfort check is optional user acceptance, not a substitute for independent QA.

Fixture setup: auth identities A/B, upstream targets A/B with colliding session IDs, mock/live modes, delayed/out-of-order reads, confirmed/uncertain writes, 404/401/403/5xx/malformed payloads, storage exceptions. Fail-closed external-network guard on fixture suites; synthetic authentication helpers must be isolated from production. Exact scripts/ports/commands are factual Engineer handoff outputs, not invented commands in this package.

Routine exit authority: close owned browser contexts and servers, remove declared temporary authenticated profiles/storage immediately, retain sanitized evidence. Credential source deletion occurs at the QA Lead-approved cleanup point so privacy checks can run first; earlier deletion is allowed only by its owner and must be recorded. Never copy credentials or their hashes into Git/ZIPs. Preserve test sessions until Tony separately decides disposition.
