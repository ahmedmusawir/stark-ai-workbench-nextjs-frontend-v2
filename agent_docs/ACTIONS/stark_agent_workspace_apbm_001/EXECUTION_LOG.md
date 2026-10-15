# Engineering execution log

> **Current status (2026-10-15, Asia/Dhaka) — read first.** Claudy, Engineer facts only.
> - **State:** ENGINEERING_COMPLETE with the Architect's AC025 origin correction applied (engineering attempt 003). Returned as `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt (SHA-256 in the receipt). Reviews 001–003 are kept unchanged.
> - **Candidate:** pending Tony's commit on `frontend-apbm-0001` (HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` = baseline). Identity: `ENGINEERING_EVIDENCE/attempt-003/changed-paths.json` and `candidate.patch`. Versus review 003, 1 product file and 3 test files changed (`correction.patch`).
> - **Next action:** the Architect reviews review 004. Then Tony commits the revised candidate and creates `qa/frontend-apbm-0001` at that SHA; Claudy records releasing checkout writes; Cody starts Q1. None of these has happened.
> - **Live evidence:** the attempt-002 live walk (16/16) belongs to the review-003 candidate only, and was not repeated (engineering budgets exhausted). Independent Q2 must validate the revised candidate.
> - **Release prerequisite (Architect):** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
> - **Pending, not Engineer-owned:** Q1 plan, QA Lead approval, Q2 release, Gate Q. Gate D is not in scope.
> - Everything below is dated history, kept as written, including the issued template text (e.g. "not started" / "pending"), the 2026-10-14 blocked state and both timestamp-correction disclosures.

Status: NOT STARTED. Owner: Claudy after launch/preflight. Record actual timestamps in Asia/Dhaka and full identities.

Append: phase, action, reason, permitted effects, commands/results, paths changed, tests attempted, failure/retry/stop, next safe action. Distinguish authoring date from execution time. Baseline is the reviewed f0fbf2282737ea3a63fc78d553cd31fc570821d5, not an implemented candidate.

---

## Engineering pass 2 — Claudy (Engineer, checkout owner), 14 October 2026, Asia/Dhaka

Authoring of these entries: 19:28–19:35 (timestamps corrected 19:34; see the last row). Execution times below are actual. Repo root `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2`; branch `frontend-apbm-0001`; HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` (= reviewed baseline; no new commits). Git use was read-only (`--no-optional-locks`).

| Time | Phase | Action and result |
|---|---|---|
| 18:47 | Entry | Launch prompt received, relayed by Tony. Read root `CLAUDE.md`, `RECOVERY.md` and `session_2026-10-14.md`. Pinned branch, HEAD, `git status`: only the known recon/session/log changes (2 modified, 13 untracked, all docs). |
| 18:47–18:48 | Package check | Receipt matched: SHA-256 `0807343250664d936ebadc505c361133b7afca91981da2737f496486b3136f6c`, 184,573 bytes, 79 members. `unzip -t` OK. Outer `FILE_INDEX.json`: 78/78 indexed, 0 hash or byte mismatches, 0 unsafe or duplicate paths, 0 symlinks. Unpacked to a fresh scratch folder outside the checkout. |
| 18:48:49 | Install | The destination module was absent, so there was nothing to reconcile. Copied only `agent_docs/ACTIONS/stark_agent_workspace_apbm_001/` (75 files); all 75 re-verified against the index. No other root file was written by the install. |
| 18:48–18:55 | Preflight | Read START_HERE → GOVERNANCE → RULINGS_ADDENDUM → APP_BRIEF → DATA_CONTRACT → ACCEPTANCE_SPEC → FILE_SCOPE → BUILD_PLAN → ENVIRONMENT_AND_EFFECTS → KNOWN_LIMITS → ENGINEERING_ENTRY → QAM entry/forms. Runtime: node v24.15.0, npm 11.12.1, next 16.2.6, react 19.2.4, typescript 5.5.4, @playwright/test 1.59.1, Chrome `/opt/google/chrome/chrome`. Mapped consumers and existing tests. No product drift from the reviewed baseline. |
| 18:53–18:54 | Baseline | `npx jest --ci`: 40 suites / 290 tests passed. `npx tsc --noEmit --incremental false`: exit 0 (`verification/00-…`). |
| 18:55–19:20 | Build/Integrate | Server boundary, ADK connector, sessions/workspace routes, explicit service outcomes, workspace integration and recovery journal (changed-path inventory in ENGINEERING_REPORT §3). |
| 19:00–19:21 | Unit/Block tests | Route, service, adapter, journal and workspace-flow suites written or updated. One real defect was found and fixed during testing: the auth-cache relabel threw under blocked storage (now guarded). |
| 19:19–19:21 | Browser fixtures | First run: 48/50 passed. Two failures were in test code, not the product: an early ledger assertion, and a test that did not clear a stale pending record (the product correctly reopened it as uncertain). Tests corrected; 50/50 passed. |
| 19:22:40–19:22:51 | Build | `npm run build`: exit 0. |
| 19:23 | Runtime negatives | `next start` on 127.0.0.1:43190 (owned). 9 unauthenticated/cross-origin probes; every agent route was rejected before upstream (401/403), and `/chat` → 307. **Zero ADK requests.** Server stopped; port freed. |
| 19:25 | Live walk | `.env.qa.local` absent and no interactive login in this run. Helper `ENGINEERING_EVIDENCE/tools/apbm001_live_walk.cjs` exited **STOP-AUTH with zero requests**. Live budget used: 0 logins, 0 creates, 0 runs, 0 reads, 0 roster. |
| 19:27:27–19:28:36 | Final verification | Final candidate (all product edits done): `npx jest --ci` 44 suites / 422 tests passed; `npx tsc --noEmit --incremental false` exit 0; `npm run build` exit 0; `npx playwright test --config tests/workspace/apbm001.config.ts` 50/50 passed (`ENGINEERING_EVIDENCE/attempt-001/verification/`). |

| 19:33:25 | Export 001 | `APBM001_ENGINEERING_REVIEW_001.zip`: 93 members, 3,114,738 bytes, SHA-256 `cb6e34e3076f30136ec67e26c455f32c3ded4b7e950672299e5116f0a0fc086b`. Privacy scan: the clean control first caught an over-broad credential pattern (tightened); then 1 hit, a synthetic `Bearer browser-token` test literal, adjudicated as a reviewed literal; 0 unreviewed hits. |
| 19:34 | Correction → 002 | Review 001 carried pre-written future handoff times (19:45/19:50) in `QAM_STATE`, `QAM_MANIFEST`, `ENGINEERING_HANDOFF`, this log, `RETROSPECTIVE` and `REVIEW_START_HERE`. They were corrected to the actual times and re-exported as review 002. Review 001 and its Downloads copy are kept unchanged (no overwrite). |

Retries and reruns: Playwright fixtures run twice. The first run's two test-code failures are recorded above, and the cause changed between runs. No setup command was retried. No remote mutation of any kind.
Stop: STOP-AUTH for the live walk only (AC011/AC012 live evidence). All other safe work was completed.
Next safe action: Tony supplies either the ignored `.env.qa.local` or an interactive sign-in. Claudy then runs the one bounded live walk within the engineering budget and exports `APBM001_ENGINEERING_REVIEW_002.zip`.

---

## Engineering pass 2, live walk — Claudy, 15 October 2026, Asia/Dhaka

| Time | Phase | Action and result |
|---|---|---|
| 10:20 | Entry | Tony reported that he had supplied `.env.qa.local` and instructed the blocked live walk. Created root `session_2026-10-15.md`; HEAD still `f0fbf2282737ea3a63fc78d553cd31fc570821d5`. |
| 10:21 | Credential checks (metadata only) | `git check-ignore -v`: ignored by `.gitignore:28 .env*.local`. `git ls-files --error-unmatch`: exit 1 (untracked). `git status --ignored`: `!!`. File mode 644 (reported, not changed). Contents not printed or hashed. |
| 10:21 | Readiness | `.next/BUILD_ID` from 2026-10-14 19:27:42; no `src/` file newer, so the build is from the verified candidate. Port 43191 free. |
| 10:21 | Helper hardening (before any live use) | `tools/apbm001_live_walk.cjs` revised. The v1 that produced attempt-001 STOP-AUTH is preserved in reviews 001/002. Changes: (1) the budget guard counts then `route.continue()`s; statuses come from context events, with no request proxying; (2) waits are scoped to `.ws-thread`, so sidebar titles can't satisfy them; (3) `settle()` waits for turns or a terminal state; a failed send stops the walk to protect the budget; (4) reply checks read the last turn instead of an exact `ACK` regex; (5) error notes are scrubbed of credential values. |
| 10:22:13–10:22:56 | Live walk (attempt 002) | One run, `ENGINEERING_EVIDENCE/attempt-002/live/`. **16/16 steps PASS.** Budget used: login 2/2, new sessions 2/2, runs 3/3, session/list/history reads 10/30, roster GETs 2/4 (two concurrent cold-cache descriptor reads 4 ms apart). 0 refused, 0 external, 0 page errors. Two benign navigation aborts at sign-out (logout had already returned 200; then an unread body and an 18 ms descriptor read were aborted by the `/auth` navigation). Owned server stopped; port freed. |
| 10:23–10:24 | Candidate identity | `attempt-002/changed-paths.json`: product+test 36/36 SHA-256 identical to review 002. The 2026-10-14 Jest/tsc/build/Playwright results apply to this exact candidate. |

Test sessions created in Tony's namespace on `greeting_agent` and left intact for Tony's disposition:
- A `d22f9aff-4df6-4f3d-9a76-ea79000e7ac8`, 4 events;
- B `7adcba92-ff0a-4707-aae4-b15a81801d42`, 2 events.

Markers `apbm001-eng-a-6ee1f8` / `apbm001-eng-b-6ee1f8`.

---

## Architect correction (AC025 origin policy) — Claudy, 15 October 2026, Asia/Dhaka

| Time | Phase | Action and result |
|---|---|---|
| 11:44 | Entry | The Architect's review of review 003 was relayed by Tony. Core implementation and live evidence are accepted for continued engineering handoff preparation, not Gate Q, and one bounded correction is due before the commit. HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`; `git status` matched review 003 plus the expected records. |
| 11:48 | Session | Root `session_2026-10-15.md`: APPROVED → IN PROGRESS entry. `context.ts` SHA-256 `2757c485…` = review 003. |
| 11:48–11:50 | Regressions first | New AC025 regressions added to `agent-boundary.test.ts` and `instructions-route.test.ts`. |
| 11:50:15 | Red run | Run against the **unchanged** product code (ts-jest diagnostics off in a scratch config, because `trustedOrigins` did not exist yet): 36 failed / 95 passed. Both Architect reproductions were accepted by the review-003 code (`attempt-003/verification/00-…`). |
| 11:50–11:51 | Fix | `context.ts`: server-owned `trustedOrigins()` plus an exact `Origin` match. `Host`/`X-Forwarded-*`/`Forwarded` are no longer read. The two suites pass: 131/131. |
| 11:51 | Instrument | `tests/workspace/apbm001.config.ts`: `APBM001_ATTEMPT` selects the evidence folder, so earlier browser evidence is never cleared. |
| 11:51:45 | Jest + tsc | 44 suites / 479 tests passed; tsc exit 0. |
| 11:52:50–11:53:04 | `next dev` probes | Port 43192, isolated process env, network guard. 10/10 as expected; 0 guard blocks. **The first stop missed** (`setsid` forked); the owned process group was stopped at 11:53:04 and the port freed. The miss is kept in log 03. |
| 11:53:28–11:53:35 | Build | `npm run build` exit 0. |
| 11:54:03–11:54:05 | `next start` probes | Port 43190, `AGENT_TRUSTED_ORIGINS=http://127.0.0.1:43190`, network guard. 17/17 plus 2 reads as expected; 0 guard blocks; stopped, port freed. |
| 11:54:23–11:55:18 | Browser fixtures | `APBM001_ATTEMPT=attempt-003`: 50/50. 66 earlier evidence files byte-identical before and after. |
| 11:55–11:57 | Identity | Review-003 product+test rebuilt from HEAD + `attempt-001/candidate.patch` and hash-verified against `attempt-002/changed-paths.json` (36/36). Changed since review 003: 4 files (1 product, 3 test). `correction.patch` applies to the rebuilt tree; `candidate.patch` on HEAD reproduces 36/36. |
| 11:58 onward | Records | Current-status blocks; correction addendum; dispositions; review 004 packaging. Packaging time and SHA-256 are in the receipt. |

- **No live walk:** no sign-in, no ADK request, no remote write, and no credential file read.
- **Retries and reruns:** none of setup or remote. The red run is a deliberate pre-fix run, not a retry.
- **Records disclosure carried here:** on 2026-10-15, future times (10:30/10:31/10:35) were pre-written in the review-003 records and corrected to actual times before that package was built (first recorded in `RETROSPECTIVE.md`). The 2026-10-14 disclosure is the 19:34 row above.
