# Engineering completion report — awaiting Claudy

> **Current status (2026-10-15, Asia/Dhaka) — read first.** Claudy, Engineer facts only.
> - **State:** ENGINEERING_COMPLETE with the Architect's AC025 correction applied (engineering attempt 003). Returned as `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt (SHA-256 in the receipt).
> - **Candidate:** pending Tony's commit on `frontend-apbm-0001` (HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` = baseline). Identity: `ENGINEERING_EVIDENCE/attempt-003/changed-paths.json` and `attempt-003/candidate.patch`. Versus review 003, 1 product file and 3 test files changed (`attempt-003/correction.patch`).
> - **Next action:** the Architect reviews review 004. Then Tony commits the revised candidate and creates `qa/frontend-apbm-0001` at that SHA; Claudy records releasing checkout writes; Cody starts Q1.
> - **Live evidence:** the attempt-002 live walk (16/16) belongs to the review-003 candidate only. It was not repeated (engineering login/create/run budgets exhausted). Independent Q2 must validate the revised candidate.
> - **Release prerequisite:** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
> - **Where to read:** the *Architect correction addendum* at the end of this file. Everything between here and there is dated history, kept as written: the issued template, the pass-2 report (state then: ENGINEERING_BLOCKED), and the live walk addendum.


No implementation is claimed by this issued template.

Fill: actual repo/branch/baseline/HEAD; pending or committed candidate identity; changed files and reasons; AC-by-AC claims/evidence; exact install/typecheck/Jest/build/Playwright/serve commands and working directory; self-verification results; API/live request budget; new journal format; affected callers/old contract migrations; preserved paths; limitations/stops; rollback; QAM handoff and ZIP receipt. Identify product, docs, tests and evidence separately.

---

# Engineering pass 2 report — Claudy, 14 October 2026 (Asia/Dhaka)

**State: ENGINEERING_BLOCKED, live walk only (STOP-AUTH).** Implementation and fixture self-verification are complete. The bounded real-app live walk (AC011/AC012 live evidence) did not run: no `.env.qa.local` exists and no interactive sign-in happened in this run. The helper exited with zero requests. Engineering green is not Gate Q. Nothing was committed: Tony owns Git.

## 1. Identity

| Item | Value |
|---|---|
| Repository root | `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2` (read-only `git rev-parse --show-toplevel`) |
| Branch | `frontend-apbm-0001` |
| HEAD at execution | `f0fbf2282737ea3a63fc78d553cd31fc570821d5` (= reviewed baseline; no commits by this seat) |
| Candidate | **Pending Tony's commit.** Identity = baseline + the working-tree changes in `ENGINEERING_EVIDENCE/attempt-001/changed-paths.json` (path, git status, role, bytes, SHA-256). QA pins the committed SHA. |
| Toolchain | node v24.15.0 · npm 11.12.1 · next 16.2.6 (Turbopack build) · react 19.2.4 · typescript 5.5.4 · jest 30 / ts-jest · @playwright/test 1.59.1 · Chrome at `/opt/google/chrome/chrome` |
| Dependencies | Unchanged. `package.json` and `package-lock.json` have no diff; no install was run. |

## 2. What was built (against BUILD_PLAN 2–4)

- **Server boundary** (`src/app/api/agent/_lib/context.ts`). Every owned agent route runs a fixed sequence before any upstream contact:
  - same-origin check (writes);
  - verified Supabase user (`createClient().auth.getUser()` server-side);
  - a supplied `user_id` must equal the server user (403 otherwise);
  - manifest agent (400);
  - configured live endpoint (503 `config-unavailable`, never a mock fallback; userinfo, query and fragment rejected);
  - opaque `backendKey` = first 16 hex of SHA-256 over `['apbm001-backend-v1', mode, bundleId, scheme://host[:port]/basepath]`; a stale key gets 409;
  - a cached roster marks undeployed agents 503 `agent-unavailable`.

  Every error is `{error:{code,message}}` with sanitized text. Browser `Authorization` is no longer forwarded upstream.
- **ADK connector** (`_lib/adk.ts`):
  - list, get, create-with-ID (title as initial state) and camelCase `/run`, each a single attempt with deadlines of 60 s (reads/create) and 90 s (run), following browser cancellation;
  - a 404 is `session-missing` only for `detail: Session not found`, never a recreate;
  - malformed successes count as failures;
  - thought parts are excluded from transcripts;
  - lists are sorted newest-created first (`lastUpdateTime`, which equals creation on this target), with a session-ID tie-break and a `Conversation <8-char id>` fallback title.
- **Routes:**
  - new `GET/POST /api/agent/sessions` (catalogue and explicit create);
  - new `GET /api/agent/workspace` (verified user, mode, public Supabase ref, per-agent `backend_key` and availability from cached `/list-apps`);
  - reworked `POST /api/agent/history` and `POST /api/agent/run`;
  - `/api/agent/instructions` now requires a signed-in user (both methods) and same-origin on PUT.
- **Service** (`src/services/chatService.ts`):
  - explicit outcomes: `getWorkspace`, `listConversations`, `createConversation`, `runTurn`, and `getHistory` (now a `HistoryResult`);
  - browser deadlines of 65 s and 95 s;
  - write classification: definitive rejections are `not-sent`; anything dispatched with an unknown result is `uncertain`;
  - `sendMessage` is kept as a documented legacy sentinel adapter (null session → explicit UUID create, then one run).
- **Workspace** (`src/components/workspace/*`):
  - server descriptor identity, with the auth cache relabelled and never trusted;
  - sidebar conversations in draft and conversation views;
  - per-draft URL identity (`new=d########`);
  - UUID allocated and journal written before any network write;
  - the draft URL is replaced by the session URL;
  - create runs once, and the run only after confirmed creation;
  - continuations never create;
  - an `uncertain` state with read-only **Check history** and an explicit **I reviewed the history — continue** after a successful read;
  - the storage-unavailable guard blocks sends;
  - obsolete list/history reads are aborted and gated;
  - late sends settle into their own conversation;
  - links without (or with another) `bk` are not opened against this target;
  - unavailable or unconfigured agents are honest;
  - rename/archive controls and the archive promise are removed (R001-03);
  - visible data clears immediately on sign-out, while the journal is retained.

## 3. Changed-path inventory (role → rationale)

Complete list with hashes: `ENGINEERING_EVIDENCE/attempt-001/changed-paths.json`.

**Product, modified:**
- `src/app/api/agent/_lib/adk.ts`: connector rework (R001-05/06, AC009/AC010).
- `src/app/api/agent/history/route.ts`: explicit history outcomes, server identity (AC002, AC010).
- `src/app/api/agent/run/route.ts`: continuation only, camelCase, no recreate (AC009).
- `src/app/api/agent/instructions/route.ts`: auth required on GET/PUT, same-origin PUT (AC002/AC025, "every owned agent route").
- `src/services/chatService.ts`: explicit outcomes plus legacy adapter (R001-05, AC017, AC024).
- `src/types/index.ts`: wire and outcome types; `GetHistoryRequest.backend_key?`.
- `src/components/workspace/Workspace.tsx`: AC008, AC013–AC021.
- `src/components/workspace/WorkspaceEntry.tsx`: server identity, sign-out clearing (AC003).
- `src/components/workspace/navigation.ts`: draft and backend identity in the URL (AC004, AC014).
- `src/components/workspace/productionAdapter.ts`: ADK catalogue, no `chat_sessions` (AC006).
- `src/components/workspace/types.ts`: new services and status contract.
- `src/app/(cyberize)/chat/ChatPageContent.tsx`: legacy consumer migrated to `HistoryResult` (AC024).

**Product, new:**
- `src/app/api/agent/_lib/context.ts`;
- `src/app/api/agent/sessions/route.ts`;
- `src/app/api/agent/workspace/route.ts`;
- `src/components/workspace/recoveryJournal.ts`.

**Tests, modified:**
- `src/__tests__/api/adk-lib.test.ts`;
- `src/__tests__/api/agent-history.test.ts`;
- `src/__tests__/api/agent-run.test.ts`;
- `src/__tests__/api/fixtures/adk-events.ts`;
- `src/__tests__/api/instructions-route.test.ts`;
- `src/__tests__/chat/ChatPageContent.hydration.test.tsx`;
- `src/__tests__/services/chatService.live.test.ts`;
- `src/__tests__/services/services.contract.test.ts`;
- `src/__tests__/workspace/navigation.test.ts`;
- `src/__tests__/workspace/productionAdapter.test.ts`;
- `src/__tests__/workspace/signout.test.tsx`;
- `tests/workspace/fixture-entry.tsx`;
- `tests/workspace/workspace.spec.ts`. Its evidence and base paths are now env-overridable; the defaults keep the APBM000 run reproducible.

**Tests, new:**
- `src/__tests__/api/agent-boundary.test.ts`;
- `src/__tests__/api/agent-sessions.test.ts`;
- `src/__tests__/api/fixtures/route-harness.ts`;
- `src/__tests__/workspace/recoveryJournal.test.ts`;
- `src/__tests__/workspace/workspace.flow.test.tsx`;
- `tests/workspace/apbm001.config.ts` (output confined to this module);
- `tests/workspace/apbm001.spec.ts`.

**Docs and evidence:** this module (installed issued pack plus Engineer-owned records and `ENGINEERING_EVIDENCE/`), root `session_2026-10-14.md`, `RECOVERY.md`, `CHANGELOG.md`, and `agent_docs/RESPONSES/response_2026-10-14_*_apbm001-engineering-pass2*.md`. Pre-existing uncommitted recon/session/log docs from 12–14 October are preserved unchanged and inventoried.

**Not touched:**
- `config/agents.manifest.json` (sha256 `6c27f420…26b6d9`) and `config/agents.manifest-hermes.json` (`638e95a1…7ae8`), with no diff;
- `package.json`, `package-lock.json`;
- Supabase SQL and auth settings;
- `src/services/sessionIndexService.ts`;
- `src/components/chat/SessionPanel.tsx`;
- APBM000 records and evidence, and the APBM000 Playwright configs;
- `BACKEND_SWAP_NOTES.md`, which is outside FILE_SCOPE; its wire notes are now stale (see §11).

## 4. AC claim matrix (Engineer claims only — independent results belong to QA)

| AC | Engineer claim | Evidence |
|---|---|---|
| AC001 | CLAIMED | Baseline pinned. Inventory in `changed-paths.json`; manifests, package files and APBM000 records unchanged; Git read-only; no cloud/DB mutation; 0 live requests. |
| AC002 | CLAIMED (fixture + runtime) | `agent-boundary.test.ts`: 401/403 with **zero upstream** on all 4 session routes. `instructions-route.test.ts`: 401/403 before GCS. Real `next start` negatives in `verification/05-…` (401/403, 0 ADK). Server user selects the ADK path. Browser live: BLOCKED. |
| AC003 | PARTIAL | Descriptor identity, auth-cache relabel, immediate clearing on sign-out including under getter/write storage failures (`signout.test.tsx`), invalidated requests → 401 (runtime). Real login/logout: BLOCKED (STOP-AUTH). |
| AC004 | CLAIMED (fixtures) | Key derivation and A/B/A; stale key 409 with zero upstream; mock and live keys differ; links unbound/stale (`agent-boundary`, `workspace.flow`, `apbm001.spec`). |
| AC005 | CLAIMED (fixtures) | Manifest-driven roster, `utils` excluded, undeployed agent `unavailable` from `/list-apps`, lookup failure `unknown`, cached-roster 503 (`agent-boundary`, `workspace.flow`, `apbm001.spec`). Live roster read: BLOCKED. |
| AC006 | CLAIMED (fixtures) | ADK list route; the adapter cannot import `sessionIndexService` (test throws on import); empty vs unavailable vs access distinct. Live: BLOCKED. |
| AC007 | CLAIMED (fixtures) | Title written at create (≤80 chars, collapsed), fallback `Conversation <8>`, newest-created sort with ID tie-break, no per-row transcript reads. Live reload: BLOCKED. |
| AC008 | CLAIMED (fixtures) | UUID v4 plus journal and navigation before any network write, create once, run after confirmed create, double-submit guarded (`workspace.flow` AC008, `workspace.spec` fresh drafts). Live: BLOCKED. |
| AC009 | CLAIMED | camelCase body asserted; 404 → missing, no create/no retry/no resend; `null` session 400. The old N5/N6 tests are deliberately replaced. |
| AC010 | CLAIMED (fixtures) | ready, empty, missing, access-unavailable, unavailable (timeout/5xx/malformed/agent-level 404) across route, service and UI. Live: BLOCKED. |
| AC011 | **BLOCKED** | STOP-AUTH. Live walk helper ready (`ENGINEERING_EVIDENCE/tools/apbm001_live_walk.cjs`); 0 requests made. |
| AC012 | **BLOCKED** | As AC011. |
| AC013 | CLAIMED (fixtures, desktop + 390 px drawer) | `apbm001.spec` AC013 and `workspace.flow` AC013. Linked DIRECTOR-OBS-001 evidence: `ENGINEERING_EVIDENCE/attempt-001/browser/screenshots/ac013-*.png`. The historical status remains **UNTRIAGED-live**; no APBM000 record was edited. |
| AC014 | CLAIMED (fixtures) | Fresh draft IDs; the consumed draft is replaced and resolves to its session; back/forward agree (`apbm001.spec` AC014, `workspace.flow` AC014); invalid URLs `Workspace unavailable`. |
| AC015 | CLAIMED (fixtures) | Abort plus identity gating of history; a late send settles in its original conversation (`workspace.flow` ×2, `apbm001.spec` AC015, legacy `late-history`). |
| AC016 | CLAIMED (fixtures) | Create-confirmed/run-uncertain and create-response-lost keep the UUID across reload; journal-only "Unconfirmed conversation" rows; definitive create failure reuses the same UUID on the next deliberate send. |
| AC017 | CLAIMED | Classification table in `chatService.live.test` (13 codes plus transport/odd success); no heuristic (no text, cursor, timestamp or stateDelta) is used anywhere. |
| AC018 | CLAIMED (fixtures, real Chromium) | Check history is read-only (no create/run), survives reload, ack only after a successful read, keyboard-operable (`apbm001.spec` AC016–AC018). |
| AC019 | CLAIMED (fixtures) | Throwing, non-persisting, malformed or oversize storage: no crash, no send without a durable marker, history still readable, no text/token stored (`recoveryJournal.test`, `workspace.flow`, `apbm001.spec`). |
| AC020 | CLAIMED (fixture time) | A simulated 26 s list stays loading then renders, with one call (fake timers); server 60/90 s and browser 65/95 s deadlines; no retry loops. Live 24–26 s first read: BLOCKED. |
| AC021 | CLAIMED | No rename/archive/delete controls or copy (`workspace.flow`, `workspace.spec`, adapter keys); no table, migration, ADK change or DELETE. |
| AC022 | CLAIMED (fixtures) | 390/768/1023/1024/1440 × dark/light × directory/draft/conversation: no horizontal scroll, drawer boundary correct, tokens kept (30 screenshots); existing 18-view render matrix also passes. |
| AC023 | CLAIMED (fixtures) | Existing markdown/code/copy/read-aloud regression passes unchanged; demo context labelled and local. |
| AC024 | CLAIMED | Callsite inventory §6; legacy `ChatPageContent` migrated; `SessionPanel` and `sessionIndexService` retained (Mission Control) and unable to steer workspace identity. |
| AC025 | CLAIMED | Agent, session-ID, message, title and JSON-shape validation; encoded path segments; browser cannot set upstream; same-origin writes (configured site or served host); sanitized errors (fixture and runtime). |
| AC026 | CLAIMED | Mock mode uses mock keys and mock data, and session routes refuse in mock mode (503). The fixture harness forbids production modules and external network; no test auth seam exists in product code (`resetRosterCacheForTests` only clears a cache). |
| AC027 | CLAIMED (engineering) | Jest 44/422, tsc 0, `next build` 0, Playwright 50/50. There were no inherited failures at baseline (40/290 passed). QA re-runs independently. |
| AC028 | CLAIMED | This report, `QAM/QAM_MANIFEST.md`, `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`, `QAM_STATE` transition, indexed ZIP plus receipt. QA plan, approval and certificate remain unfilled. |
| AC029 | NOT ENGINEER-OWNED | Pending Cody and the QA Lead. |
| AC030 | CARRIED | Limits in §11; no Gate D, Hermes or multi-user claim. |

## 5. Commands (cwd = repository root)

```
npx jest --ci                                                  # 44 suites / 422 tests passed
npx tsc --noEmit --incremental false                           # exit 0
npm run build                                                  # next build, exit 0
npx playwright test --config tests/workspace/apbm001.config.ts # 50/50; fixture on 127.0.0.1:43181
npx next start -H 127.0.0.1 -p 43190                           # runtime negatives (curl), then stopped
node agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE/tools/apbm001_live_walk.cjs [--interactive yes]
```

Logs: `ENGINEERING_EVIDENCE/attempt-001/verification/` (`00` baseline … `05` runtime negatives, `SUMMARY.txt`). Browser JSON and screenshots: `ENGINEERING_EVIDENCE/attempt-001/browser/`. The APBM000 Playwright configs were **not** run, because they write into APBM000 evidence.

## 6. Contract migration and consumers (AC024)

| Old contract (frozen A1/A2, BIM-002/004) | New contract (APBM001) | Old tests superseded |
|---|---|---|
| `getHistory` failure → `[]` | `HistoryResult{status,messages}`: ready/empty/missing/unavailable/access-unavailable/agent-unavailable/backend-changed | `chatService.live` "failure → []", `services.contract` "Message[]", `adk-lib` "degrades to []" |
| history route `{history}` / `502 {error}` | `{status,history}` / structured codes (404 missing, 502/504 upstream) | `agent-history` 502/500 cases |
| run route bootstraps `session-${Date.now()}`; 404 → create + retry once | continuation only; `session_id` required; 404 → `session-missing`; one attempt; camelCase | `adk-lib` N5/N6, `agent-run` N5/N6, `newSessionId` |
| snake_case upstream `/run` | camelCase `appName/userId/sessionId/newMessage` | `agent-run` payload assertion |
| browser `Authorization` forwarded (R2) | not forwarded (R001-11) | `agent-*` pass-through tests |
| workspace catalogue = `chat_sessions` (+ metadata write, metadata-warning) | ADK list; title as ADK initial state; no metadata write | `productionAdapter` create/touch/rename/archive tests; Playwright metadata/partial/recovered/rename tests |
| `isSessionNotFound`: 404 OR detail text | 404 AND `Session not found` detail | `adk-lib` isSessionNotFound cases |
| `new=1` single draft key | `new=d########` per draft (legacy `1` still parses) | `navigation` cases |
| `/api/agent/instructions` unauthenticated | signed-in user required; same-origin PUT | — (new negatives added) |

**Callers of changed shared surfaces (non-test):**
- `/api/agent/{history,run,sessions,workspace}` are called only from `chatService`.
- `chatService.getHistory` and `sendMessage` callers:
  - `productionAdapter` (migrated);
  - `ChatPageContent` (legacy and imported by no route; migrated, and its sentinel path is kept through the adapter).
- `sessionIndexService` callers:
  - `ChatPageContent`;
  - `SessionPanel` (Mission Control sidebar). It still writes `chat_sessions`, but outside the workspace. Its "select" only routes to `/chat` without a session, so it cannot direct the workspace to another identity.
- `/api/agent/instructions` callers: `instructionsService` (same-origin browser fetch with cookies, unaffected).

## 7. Recovery journal format (new)

- **Storage:** `localStorage["stark-workspace-recovery-v1"]` holds a JSON array of at most 50 records, under 32 KiB.
- **Record:** `{ v:1, op:<uuid>, user:<server user id>, mode:'live'|'mock', backend:<16-hex key>, agent, session:<uuid>, draft?:'d########', stage:'create'|'run'|'uncertain', at:<epoch ms> }`. Unknown fields are stripped on write.
- **Never stored:** message text, transcripts, tokens, endpoints or thought data.
- **Write rule:** the record is written and read back before any network write; a failure blocks the send (`storage-unavailable`).
- **Removal:** on confirmed `sent`, definitive failure, or explicit acknowledgement.
- **Reload:** any record not owned by an in-flight request in this page is shown as uncertain.
- **Scoping and sign-out:** records are scoped to the same server user and mode, and filtered by backend key. Sign-out keeps them.
- **Bounded corruption:** malformed or oversize content is ignored, never fatal.

## 8. API surface (browser ↔ app, snake_case; app ↔ ADK, camelCase)

- **Endpoints:**
  - `GET /api/agent/workspace`;
  - `GET /api/agent/sessions?agent_name&backend_key[&user_id]`;
  - `POST /api/agent/sessions {agent_name, session_id(uuid), title, backend_key?, user_id?}`;
  - `POST /api/agent/history {agent_name, session_id, backend_key?, user_id?}`;
  - `POST /api/agent/run {agent_name, session_id, message, backend_key?, user_id?}`.
- **Codes:** see `AgentErrorCode` in `src/types/index.ts`.
- **maxDuration:** 65 s, and 95 s for run. A host with a shorter limit is a deployment incompatibility to report (not widened).

## 9. Live request ledger (engineering phase)

| Budget | Max | Used |
|---|---|---|
| Login cycles | 2 | 0 |
| New sessions | 2 | 0 |
| Run messages | 3 | 0 |
| Session/list/history GET | 30 | 0 |
| Roster GET | 4 | 0 |

The engineering budget is not renewable and is not transferable to QA. The 10-04 and 10-14 probe namespaces were not touched.

## 10. Operator setup for the remaining live walk (Tony)

1. Either create the ignored file `.env.qa.local` at the repo root containing exactly `APBM001_QA_EMAIL=` and `APBM001_QA_PASSWORD=` for the authorized normal test account, or choose interactive sign-in.
2. Ask Claudy to resume the live walk. Claudy runs `npm run build` if stale, then `node agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE/tools/apbm001_live_walk.cjs` (add `--interactive yes` to sign in by hand twice in a visible Chrome window).
3. The helper:
   - verifies the target first (mode live, Supabase ref `rwosuvbufaqwbaukohkk`, greeting_agent `backend_key` = `6b99771174a0f203`, the key derived from the confirmed bundle URL) and stops with STOP-ENV before any create if anything differs;
   - enforces the budget in the browser;
   - records only pseudonymous, sanitized evidence;
   - stops its own server.

## 11. Limitations and observations

- **Carried:** LIM01–LIM08 unchanged:
  - restart durability unproven;
  - unauthenticated ADK origin (frontend fixes protect only the frontend path);
  - one live target and agent;
  - creation-order recency;
  - 24–26 s first read;
  - rename/archive deferred;
  - same-browser recovery only;
  - separate auth and chat projects.
- **New observations:**
  - (a) **No deployment packaging boundary exists** (no `.vercelignore`/`.dockerignore`). `agent_docs/` is not bundled by `next build`, but a source-upload deploy would include it. Reported for a separate bounded packaging decision, per FILE_SCOPE.
  - (b) The auth-cache relabel syncs `id`/`email` only. The cached `role` stays display-only, and server layouts still enforce roles.
  - (c) `BACKEND_SWAP_NOTES.md` (root) describes the retired wire and bootstrap behaviour. Outside FILE_SCOPE, so not edited.
  - (d) `npm run lint` (`next lint`) was not run. The installed Next 16.2.6 CLI lists no `lint` command, and ESLint is not installed. The pre-existing script is stale; TypeScript and build checks passed.
  - (e) Build warning: browserslist data is 14 months old (no update; the lockfile is frozen).
  - (f) The Mission Control instructions route now returns 401 to signed-out callers (intended, AC002).
  - (g) Live first-read latency versus the 60 s server budget is unmeasured in the frontend (blocked).
- **Dead code (no deletion without approval):**
  - `GetHistoryResponse` (`src/types/index.ts`) is now unused;
  - `titleFromMessage`/`sessionIndexService` are unused by the workspace but still used by legacy `ChatPageContent`/`SessionPanel`.
  - **Question for Tony:** should the unused `GetHistoryResponse` type be removed?

## 12. Rollback

Revert the implementation commit(s) once Tony has made them. No cloud, schema or IAM rollback is needed: there were zero live writes, so no test sessions were created in this pass. Leave earlier probe sessions intact.

## 13. Package

`QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_002.zip` plus receipt, with a byte-identical copy in `~/Downloads/`. Path, size and SHA-256 are in the receipt and the session log. Review 001 (same content apart from pre-written timestamps) is kept unchanged.

---

# Live walk addendum — engineering attempt 002, 15 October 2026 (Asia/Dhaka)

**State: ENGINEERING_COMPLETE.** The STOP-AUTH blocker is resolved: Tony supplied the ignored, untracked `.env.qa.local`. The candidate is unchanged from review 002: product+test 36/36 SHA-256 identical (`ENGINEERING_EVIDENCE/attempt-002/changed-paths.json`).

## Live walk result (real local frontend `next start` → confirmed bundle, greeting_agent)

| Step | Result | Observed |
|---|---|---|
| Target identity | PASS | mode `live`; Supabase ref `rwosuvbufaqwbaukohkk`; greeting `backend_key` equals the key derived from the confirmed bundle URL; greeting `available`; `moose_mcp_agent` `unavailable` |
| AC005 unavailable agent | PASS | MOOSE CRM Agent card reads "Not available on this agent service"; manifest unchanged |
| Send A / Send B | PASS / PASS | Each new draft was created with a fresh UUID and titled from its first message; each reply carried its own marker |
| AC008 UUID IDs | PASS | Two distinct v4 UUIDs |
| AC011 switch twice | PASS | A↔B twice through sidebar links; neither transcript showed the other's marker |
| AC012 reload B | PASS | 2 turns from ADK history; no A marker |
| AC012 reopen tab on A | PASS | New tab: 2 turns; no B marker |
| AC012 continue A | PASS | The continuation reply recalled marker A; earlier turns intact; no B marker |
| AC003 logout invalidates | PASS | Descriptor after sign-out → 401 |
| AC003 same user after re-login | PASS | Pseudonymous equality only |
| AC012 reopen after re-login | PASS | 4 turns from ADK history |
| AC006/AC007 list | PASS | A and B listed with first-message titles, B (newer-created) before A; 4 rows in total (other titles not recorded) |

Timing:
- reads 1.1–2.1 s;
- creates 1.2–1.4 s;
- runs 2.3–2.9 s;
- descriptor (cold roster) 1.26 s.

The 24–26 s cold first read was **not** reproduced, which proves nothing about cold starts (LIM05 carried).

## Live budget ledger (engineering phase, final)

| Budget | Max | Used |
|---|---|---|
| Login cycles | 2 | 2 |
| New sessions | 2 | 2 |
| Run messages | 3 | 3 |
| Session/list/history GET | 30 | 10 |
| Roster GET | 4 | 2 |

Other counts:
- descriptor calls: 10 (not a budget item; roster reads cached);
- external requests: 0;
- Supabase browser auth requests: 0.

The engineering budget is now exhausted for creates, runs and logins, and is not renewable. The Q2 budget is separate and untouched.

## AC claim updates (supersede §4 rows where stated; §4 remains the history)

| AC | Updated Engineer claim | Live evidence |
|---|---|---|
| AC002 | CLAIMED (fixture + runtime + live) | Live agent routes served only the signed-in user; signed-out descriptor 401 |
| AC003 | CLAIMED | Real login → logout (401 afterwards) → login; same user; immediate clearing covered by fixtures |
| AC005 | CLAIMED (fixture + live) | Live roster: greeting available, MOOSE unavailable, `utils` absent from the directory |
| AC006 | CLAIMED (fixture + live) | List from ADK via `/api/agent/sessions`; no `chat_sessions` in the workspace path |
| AC007 | CLAIMED (fixture + live) | First-message titles reappear after re-login; newest-created order |
| AC008 | CLAIMED (fixture + live) | Two creates, three runs, no duplicates |
| AC010 | PARTIAL live | Live `ready` history observed; missing/unavailable/access remain fixture-evidenced (not injected live, per ENVIRONMENT_AND_EFFECTS) |
| AC011 | CLAIMED (engineering live) | Walk steps above; independent Q2 still required |
| AC012 | CLAIMED (engineering live) | Walk steps above; independent Q2 still required |
| AC020 | Fixture-evidenced | The live cold-start latency did not occur this run |

## New observations

- **(h) Roster cold-cache race.** Two descriptor requests issued 4 ms apart both missed the empty roster cache, so `/list-apps` was read twice. The cost is bounded by the 10-minute TTL and stays within budget. An in-flight de-duplication would remove it. Not changed (outside the verified candidate; Architect's call).
- **(i) Benign sign-out aborts.** The logout response returned 200 first; the `/auth` navigation then aborted the unread body and a just-started descriptor read. No ADK traffic was involved.
- **(j) Credential file permissions.** `.env.qa.local` mode is 644. Recommend `chmod 600`, which is Tony's action. The QA Lead's cleanup decides deletion timing.

## Remote state left

Two engineering test sessions remain in Tony's ADK namespace (`greeting_agent`), intact for his disposition:
- A `d22f9aff-4df6-4f3d-9a76-ea79000e7ac8`, 4 events;
- B `7adcba92-ff0a-4707-aae4-b15a81801d42`, 2 events.

No deletes were made.

## Package

`QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_003.zip` plus receipt, with a byte-identical Downloads copy. It supersedes 002 for the live-walk addendum; 001 and 002 are kept.

---

# Architect correction addendum — engineering attempt 003, 15 October 2026 (Asia/Dhaka)

**State: ENGINEERING_COMPLETE, correction applied.** The Architect reviewed review 003. The relay reached Claudy at 11:44. The verdict: core implementation and live evidence are accepted for continued engineering handoff preparation, **not Gate Q**. One bounded correction was required before Tony commits.

## Finding and reproduction

`assertSameOrigin` (review 003) had two defects:
- it compared `Origin` host to the request's host without checking the scheme;
- it accepted `X-Forwarded-Host` or `Host` as an independent authority.

The new regressions were run first against the **unchanged** review-003 code (`ENGINEERING_EVIDENCE/attempt-003/verification/00-red-regressions-against-review003.txt`, 11:50): 36 failed, 95 passed. Accepted by the old code, on all three state-changing agent POST routes (sessions, history, run) and the instructions PUT:
- **Architect repro 1:** `Origin: http://app.example.test` with `Host: app.example.test` while the site is `https://app.example.test`;
- **Architect repro 2:** a foreign `Origin` matched by a caller-supplied `X-Forwarded-Host`.

The same run also showed the old code accepting:
- the wrong port with a matching `Host`;
- a foreign `Origin` with a matching `Host`;
- an `Origin` carrying a path or userinfo, or in non-canonical case;
- any `Origin` when no site was configured;
- loopback on another port.

## Change (product: 1 file)

`src/app/api/agent/_lib/context.ts`:
- **`trustedOrigins()`** builds a server-owned set of full origins (scheme, hostname, port). Its sources:
  - `NEXT_PUBLIC_SITE_URL`: the configured deployment origin. It is inlined at build, and already sets the cookie `secure` flag;
  - `AGENT_TRUSTED_ORIGINS` (new, optional, server-only, read at runtime): comma-separated extra origins;
  - under `next dev` only (`NODE_ENV=development`): `http://localhost:<PORT>` and `http://127.0.0.1:<PORT>`, where `PORT` is the port Next itself listens on (`start-server` sets it).

  Values that are not plain http(s), carry userinfo, or don't parse grant nothing.
- **`assertSameOrigin()`** requires `Origin` to equal one trusted origin exactly, in the serialized form browsers send. It still refuses `Sec-Fetch-Site: cross-site`. It never reads `Host`, `X-Forwarded-*` or `Forwarded`.
- **Proxy trust: none.** The public origin is configuration, so forwarded headers are never needed to recognize it. A proxied deployment lists its public origin in `NEXT_PUBLIC_SITE_URL`.
- **Order unchanged.** The origin check is still the first step on every state-changing route, before body parsing, the auth lookup and any upstream contact.

## Configuration impact (no `.env*` file read, hashed or edited)

- **Deployment:**
  - `NEXT_PUBLIC_SITE_URL` must equal the public origin exactly. Otherwise every state change returns 403 (fail closed).
  - Any other legitimate origin, such as a preview host, needs `AGENT_TRUSTED_ORIGINS`.
- **Local `next dev`:**
  - loopback at the dev port works without configuration;
  - a LAN address or HTTPS dev needs `AGENT_TRUSTED_ORIGINS`.
- **Local `next start`** (production mode, as in engineering negatives and live runs):
  - set `AGENT_TRUSTED_ORIGINS=http://127.0.0.1:<port>` on the server process, unless `NEXT_PUBLIC_SITE_URL` already equals the browser origin;
  - the unchanged live-walk helper (`ENGINEERING_EVIDENCE/tools/`) spawns its server with the caller's environment, so a rerun would pass the variable on the command line. It was not rerun.

## Tests and instruments (3 files)

- `src/__tests__/api/agent-boundary.test.ts`:
  - `trustedOrigins` unit cases: normalization, malformed entries, dev-only loopback, unset site;
  - per POST route, 3 legitimate origins (accepted, upstream reached) and 18 rejections (403 `origin-rejected`, zero upstream, no auth lookup). The rejections cover:
    - wrong scheme or wrong port, each with a matching `Host`;
    - a foreign `Origin`, alone and with a spoofed `Host`, `X-Forwarded-Host`/`-Proto` or `Forwarded`;
    - a sibling subdomain and a look-alike suffix;
    - a missing, `null` or malformed `Origin`, or one with a path, userinfo or non-canonical case;
    - cross-site fetch metadata;
    - dev loopback on the wrong port, and loopback under production;
    - no configured origin;
  - every test now starts from an explicit site origin. Review 003's test deleted `NEXT_PUBLIC_SITE_URL` after use, and later tests had been passing only through the `Host` match.
- `src/__tests__/api/instructions-route.test.ts`:
  - the default PUT origin is now the configured site (`http://localhost:3000`). It was `http://localhost`, which had passed only through the `Host` match;
  - 3 new PUT rejections (wrong scheme, wrong port, spoofed `X-Forwarded-Host`) before auth and GCS.
- `tests/workspace/apbm001.config.ts`: `APBM001_ATTEMPT` selects the evidence folder (default `attempt-001`), so a rerun can't clear earlier browser evidence. The fixture harness never serves Next routes, so it does not exercise the origin policy.

## Verification (attempt 003, cwd = repository root)

| # | Time | Check | Result |
|---|---|---|---|
| 00 | 11:50 | New regressions against the unchanged review-003 code | 36 fail / 95 pass (expected red) |
| 01 | 11:51 | `npx jest --ci` | 44 suites / **479** tests passed (review 003: 422; +57) |
| 02 | 11:51–11:52 | `npx tsc --noEmit --incremental false` | exit 0 |
| 03 | 11:52 | `next dev` on 127.0.0.1:43192, signed out, network guard | 10/10 as expected (dev loopback and configured site → 401; wrong port, wrong scheme and spoofed headers → 403); 0 guard blocks |
| 04 | 11:53 | `npm run build` | exit 0 |
| 05 | 11:54 | `next start` on 127.0.0.1:43190 (`AGENT_TRUSTED_ORIGINS=http://127.0.0.1:43190`), signed out, network guard | 17/17 origin probes plus 2 reads as expected; 0 guard blocks |
| 06 | 11:54–11:55 | `APBM001_ATTEMPT=attempt-003 npx playwright test --config tests/workspace/apbm001.config.ts` | 50/50 |

Logs: `ENGINEERING_EVIDENCE/attempt-003/verification/`. Browser evidence: `attempt-003/browser/`. Earlier attempt-001/002 and tools evidence (66 files) is byte-identical before and after the run.

**Candidate identity:**
- `attempt-003/candidate.patch` (HEAD plus patch reproduces all 36 product and test files);
- `attempt-003/correction.patch` (review 003 → 004; it applies to a review-003 tree rebuilt and hash-verified from `attempt-001/candidate.patch`);
- `attempt-003/changed-paths.json`.

Manifests, `package.json`, the lockfile and the APBM000 records are unchanged.

## AC claim updates (supersede earlier rows where stated)

| AC | Updated Engineer claim | Evidence |
|---|---|---|
| AC025 | CLAIMED (corrected) | State changes require `Origin` to exactly equal a server-configured full origin. No request header extends the allowlist, and every rejection precedes auth and upstream contact. Attempt-003 logs 00, 01, 03 and 05. |
| AC002 | CLAIMED (unchanged) | Signed-out runtime reads and writes → 401 after a trusted origin; 0 non-loopback traffic (logs 03, 05). |
| AC027 | CLAIMED (revised candidate) | Jest 44/479, tsc 0, build 0, Playwright 50/50 |
| AC011, AC012 | Engineering live evidence tied to the **review-003 candidate** | Not repeated (budget exhausted). Independent Q2 must validate the revised candidate. |

## Architect dispositions (recorded 15 October 2026)

1. **`GetHistoryResponse`:** leave unchanged; cleanup deferred. It was not deleted.
2. **Roster double-read (observation h):** leave unchanged; optimization deferred.
3. **Deployment exclusion is a release prerequisite.** Before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact. This correction makes no deployment and no packaging change.

## Records reconciliation

- Current-status blocks now head this report, `EXECUTION_LOG.md`, `QAM/QAM_STATE.md`, `QAM/QAM_MANIFEST.md`, `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` and `ENGINEERING_EVIDENCE/README.md`. All dated history below them is unchanged.
- Both timestamp-correction disclosures are preserved:
  1. **2026-10-14:** pre-written 19:45/19:50 handoff times; review 001 superseded by 002 (`EXECUTION_LOG.md` 19:34 row, `QAM_STATE` 19:33 entry);
  2. **2026-10-15:** pre-written 10:30/10:31/10:35, caught and corrected before review 003 was packaged (`RETROSPECTIVE.md`, root `session_2026-10-15.md`). This one is now also stated in `EXECUTION_LOG.md`.
- Independent QA plans, approvals, results and certification are untouched.

## New observations

- **(k) Stop step missed once.** In the dev probe, `setsid` forked, so the first process-group stop missed. The owned server was stopped by its group at 11:53:04, and the miss is kept in log 03.
- **(l) Probe header split.** The probe script splits headers on `;`, so the runtime `Forwarded` probe sent `host=evil.example` without its `proto` part. Jest covers the full value.
- **(m) Origin configuration now matters.** A deployment or production-mode local run whose browser origin is not configured gets 403 on every state change. This is intended, and listed under configuration impact.

## Remote state and package

- **Remote state:** unchanged. No sign-in, ADK request or remote write in attempt 003. Test sessions A `d22f9aff-4df6-4f3d-9a76-ea79000e7ac8` and B `7adcba92-ff0a-4707-aae4-b15a81801d42` remain for Tony.
- **Package:** `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt, with a byte-identical Downloads copy. Reviews 001–003 are kept unchanged.
