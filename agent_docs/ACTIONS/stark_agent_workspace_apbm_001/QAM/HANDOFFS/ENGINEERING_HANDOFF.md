# Engineering handoff to independent QA — pending Claudy

> **Current status (2026-10-15, Asia/Dhaka) — read first.** Claudy, Engineer facts only.
> - **State:** ENGINEERING_COMPLETE with the Architect's AC025 origin correction applied (engineering attempt 003). Returned as `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt (SHA-256 in the receipt). Reviews 001–003 are kept unchanged.
> - **Candidate:** pending Tony's commit on `frontend-apbm-0001` (HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` = baseline). Identity: `../../ENGINEERING_EVIDENCE/attempt-003/changed-paths.json` and `candidate.patch`. Versus review 003, 1 product file and 3 test files changed (`correction.patch`).
> - **Next action:** the Architect reviews review 004. Then Tony commits the revised candidate and creates `qa/frontend-apbm-0001` at that SHA; Claudy records releasing checkout writes; Cody starts Q1. None of these has happened.
> - **Live evidence:** the attempt-002 live walk (16/16) belongs to the review-003 candidate only, and was not repeated (engineering budgets exhausted). Independent Q2 must validate the revised candidate.
> - **Release prerequisite (Architect):** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
> - **Pending, not Engineer-owned:** Q1 plan, QA Lead approval, Q2 release, Gate Q. Gate D is not in scope.
> - Everything below is dated history, kept as written, including the issued template text (e.g. "not started" / "pending"), the 2026-10-14 blocked state and both timestamp-correction disclosures.

No implementation or test success is prefilled.

Provide: product candidate (or pending commit with baseline/diff identity); exact changed files; AC-by-AC claims and evidence; commands/cwd and results; setup/runtime/ports; login mechanism without values; actual effective target identity; live budget ledger; fixture/network guard details; browser privacy controls; new recovery data format; legacy consumer changes; regressions; unsupported/deferred behavior; known limits; reproduction steps; evidence package receipt.

Required owner handoff after Tony commits: Claudy releases active checkout writes; Tony creates qa/frontend-apbm-0001 at the committed candidate; Cody records acceptance of ownership and starts Q1. Record actual timestamps and full SHA. Do not invent this handoff now.

---

## Engineering handoff facts — Claudy, 14 October 2026 19:33 Asia/Dhaka (pre-commit)

- **Product candidate:** pending Tony's commit on `frontend-apbm-0001`. Baseline `f0fbf2282737ea3a63fc78d553cd31fc570821d5` plus the working tree in `../../ENGINEERING_EVIDENCE/attempt-001/changed-paths.json`.
- **Changed files, AC claims, commands, consumers, journal format, limits, rollback:** `../../ENGINEERING_REPORT.md` §2–§12.
- **Runtime and ports:**
  - fixture harness on 127.0.0.1:43181 (`tests/workspace/apbm001.config.ts`, synthetic services, fail-closed network guard, no production auth or services bundled);
  - runtime negatives used `next start` on 127.0.0.1:43190, now stopped;
  - no process of this seat remains running.
- **Login mechanism (no values):**
  - the live walk accepts either the ignored, untracked `.env.qa.local` (exactly `APBM001_QA_EMAIL`, `APBM001_QA_PASSWORD`, read to memory only) or interactive sign-in (`--interactive yes`);
  - neither was available, so it ran **0** times.
- **Effective target identity:** expected mode `live`, Supabase ref `rwosuvbufaqwbaukohkk`, greeting_agent `backend_key` `6b99771174a0f203`. **Not observed**, because it requires sign-in.
- **Live budget ledger:** 0 of every engineering budget used. The Q2 budget is untouched and separate.
- **Fixture/network guard:**
  - Jest route suites mock `fetch` and the Supabase server client, and assert zero upstream on every rejection;
  - Playwright routes abort any non-origin browser request, and `network-guard.cjs` denies non-loopback Node traffic in the harness;
  - the harness build refuses `services/`, `utils/supabase`, `useAuthStore`, `productionAdapter` and `WorkspaceEntry` imports.
- **Browser privacy:** fixture screenshots contain synthetic data only. The live helper screenshots only the A/B transcript region, records the account as a pseudonym, never records other conversations' titles, and stores no cookies or headers.
- **Recovery data format:** `../../ENGINEERING_REPORT.md` §7.
- **Legacy consumer changes:**
  - `ChatPageContent` was migrated to `HistoryResult`;
  - `chatService.sendMessage` is a documented legacy adapter (explicit create plus one run);
  - `SessionPanel` and `sessionIndexService` are unchanged (outside the workspace).
- **Regressions:** none observed. The full Jest suite, the existing Playwright workspace regression (semantics updated where superseded, §6) and the build all pass.
- **Unsupported/deferred:**
  - rename/archive/delete;
  - cross-device recovery;
  - restart durability;
  - second live target and Hermes;
  - deployment/Gate D.
- **Open blocker:** STOP-AUTH for the engineering live walk (AC011/AC012 engineering evidence). Owner: Tony (supply the login path). Smallest resolution: create `.env.qa.local`, or allow interactive sign-in, then Claudy runs the helper once and exports `APBM001_ENGINEERING_REVIEW_002.zip`.
- **Evidence package:** `APBM001_ENGINEERING_REVIEW_002.zip` (this folder) plus receipt; Downloads copy. Review 001 is kept; it differs only in pre-written timestamps.

**Owner handoff:** not yet. After Tony commits, Claudy records the release of checkout writes with the time and full SHA; Tony creates `qa/frontend-apbm-0001` at that SHA; Cody records acceptance. None of these steps has happened.

### Live walk update — Claudy, 2026-10-15 10:24 Asia/Dhaka (pre-commit)

- **Open blocker STOP-AUTH: resolved.** Engineering live walk attempt 002: 16/16 PASS (`../../ENGINEERING_REPORT.md`, live walk addendum; ledger `../../ENGINEERING_EVIDENCE/attempt-002/live/live-walk-ledger.json`).
- **Effective target identity observed:** mode `live`, Supabase ref `rwosuvbufaqwbaukohkk`, greeting_agent `backend_key` `6b99771174a0f203` (= the confirmed bundle derivation).
- **Login mechanism:** ignored, untracked `.env.qa.local` read to memory by the helper. The helper revision used is in `../../ENGINEERING_EVIDENCE/tools/`; v1 is preserved in reviews 001/002.
- **Budget:** the engineering phase is exhausted for logins, creates and runs (2/2, 2/2, 3/3); reads 10/30, roster 2/4. The Q2 budget is untouched.
- **Privacy:**
  - screenshots of the A/B transcript region only;
  - account recorded as a pseudonym; other conversations counted, not recorded;
  - no cookies, headers or traces;
  - review 003 was value-scanned in memory against the credential values (receipt).
- **Test sessions left for Tony:** A `d22f9aff-4df6-4f3d-9a76-ea79000e7ac8`, B `7adcba92-ff0a-4707-aae4-b15a81801d42`.
- **Evidence package:** `APBM001_ENGINEERING_REVIEW_003.zip` (this folder) plus receipt; Downloads copy.
- **Owner handoff:** still not performed. Tony commits; Claudy releases checkout writes with time and SHA; Tony creates `qa/frontend-apbm-0001`; Cody accepts.

### Architect correction update — Claudy, 2026-10-15 (pre-commit)

- **Product change:** `src/app/api/agent/_lib/context.ts`. State-changing agent routes accept only an `Origin` exactly equal to a server-configured full origin:
  - `NEXT_PUBLIC_SITE_URL`;
  - optional `AGENT_TRUSTED_ORIGINS`;
  - loopback at Next's own port under `next dev` only.

  No request header extends the list, and no proxy is trusted. Detail: `../../ENGINEERING_REPORT.md`, Architect correction addendum.
- **Runtime setup for QA (no values):**
  - a production-mode local server (`next start`) needs `AGENT_TRUSTED_ORIGINS=http://127.0.0.1:<port>` in its process environment, unless `NEXT_PUBLIC_SITE_URL` already equals the browser origin;
  - the engineering live-walk helper passes its caller's environment to its server; it was not rerun or changed.
- **Live evidence:** attempt-002 results apply to the review-003 candidate only. Q2 validates the revised candidate.
- **Release prerequisite:** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
- **Deferred by the Architect:** `GetHistoryResponse` cleanup; roster in-flight de-duplication.
- **Evidence package:** `APBM001_ENGINEERING_REVIEW_004.zip` (this folder) plus receipt; Downloads copy.
- **Owner handoff:** still not performed. After the Architect's review of 004: Tony commits; Claudy releases checkout writes with time and SHA; Tony creates `qa/frontend-apbm-0001`; Cody accepts.
