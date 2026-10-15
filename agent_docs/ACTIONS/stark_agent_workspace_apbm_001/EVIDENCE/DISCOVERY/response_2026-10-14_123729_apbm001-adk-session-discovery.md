# APBM001 ADK session discovery — recommendation (APBM_001 NOT LAUNCHED)

**Date:** 2026-10-14, Asia/Dhaka (UTC+06:00). **Seat:** Claudy, Engineer and checkout owner. Tony retains Git.
**Authority:** Architect instruction of 2026-10-14 ("continue the APBM001 recon using the existing recon skill"). Method: `_SKILLS/stark-recon-skill-v1.1`. The report lives here, not in `agent_docs/RECON/`, because the instruction says so.
**Director's scope:**
- One signed-in user, multiple ADK conversations.
- Reliable switching, reload/reopen and continuation.
- Approved UI and basic server-side access protection preserved.
- Current login kept.

**Target:** `ADK_BUNDLE_URL_V1=https://adk-bundle-prod-v2-952978338090.us-east1.run.app` and `NEXT_PUBLIC_CHAT_MODE=live`. Both are **CLAIMs supplied by Tony**; `.env.local` was not read. The URL matches the 10-04 probe target exactly, which settles the ADK half of P0-1.
**Baseline:** HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` on `frontend-apbm-0001` (= `main` = `origin/main`). No product, config or test change (`…_evidence/baseline-git.txt`).
**Remote calls made:** exactly 2, both unauthenticated `GET` requests (`…_evidence/http-requests.json`):
- `/openapi.json`: 200, 195,000 B, 26.0 s;
- `/list-apps`: 200, 86 B, 0.47 s.

No session, message, database or login operation was made.
**Labels:** EVIDENCE / INFERENCE / CLAIM / GAP / QUESTION.

## 1. Recommendation

1. **Use ADK as both the conversation catalogue and the transcript source.**
   - The deployment advertises per-(app, user) **list**, **get**, **create** and **continue (`/run`)**. On 10-04, list, get and continue were demonstrated on this same service for two conversations (§2).
   - Discovery, switching, reload/reopen and continuation need **no** `chat_sessions` table.
2. **Make the server the only source of the user ID.**
   - `/api/agent/*` takes the user from the Supabase cookie session using the existing helper, and ignores `user_id` in the request body.
   - The ADK `user_id` stays equal to the Supabase auth UUID, so conversations the app already created stay addressable.
   - Login is unchanged.
3. **Keep extra metadata only for rename and archive.** They are the only approved-UI features this deployment cannot support (§5). Titles can come from ADK session state, if the live test shows that list rows carry state.
4. **Before implementation, run step 0 of the proposed test (§7): one read-only GET.**
   - It shows whether 10-day-old sessions survived. ADK-as-catalogue is only as reliable as ADK's session storage, which is still **unproven** (Q1).
   - If they are gone, stop. This approach needs a durable session store in the ADK bundle first.

## 2. What the deployment advertises vs what has been tested

EVIDENCE: `…_evidence/openapi-session-contracts.json` (an extract of `openapi.json`, OpenAPI 3.1, `info` = FastAPI 0.1.0) and `list-apps.json`. The "Tested" column draws on `records-anchors.txt` (the 10-04 probe evidence, read from disk).

| Contract | Advertised (EVIDENCE) | Tested on this service |
|---|---|---|
| Apps | `GET /list-apps` → `["calc_agent","ghl_mcp_agent","greeting_agent","jarvis_agent","product_agent","utils"]` | Today. **`moose_mcp_agent` is in the manifest but not deployed. `utils` is not an agent** (S2) |
| Create with ID | `POST /apps/{app}/users/{user}/sessions/{sid}`; body = initial **state** object or null → `Session` | The app uses it with `{}` (`adk.ts:142-147`). Live use on 10-05 is a CLAIM. Duplicate-ID behavior: **GAP** |
| Create, ADK-assigned ID | `POST /apps/{app}/users/{user}/sessions`; body `{state?, events?}` → `Session` | Never |
| List | `GET /apps/{app}/users/{user}/sessions` → `Session[]` (`id, appName, userId, state, events, lastUpdateTime`) | 10-04: both sessions listed, **ids only captured**. Whether list rows carry `state`, `events` or `lastUpdateTime`: **GAP** (decides titles, Q2) |
| Get | `GET …/sessions/{sid}` → `Session` with `events` | 10-04: full transcripts. Each event has `id`, `invocationId`, `timestamp`, `author`, `content` |
| Continue ("resume") | `POST /run` (or `/run_sse`) with an existing `sessionId`. `RunAgentRequest` = `appName, userId, sessionId, newMessage, streaming, stateDelta` (camelCase) | 10-04: two continuations with a **camelCase** body, each recalling only its own marker. The app sends **snake_case** (`adk.ts:165-168`). It is not advertised, and acceptance here rests on the 10-05 CLAIM (Q3) |
| Request-level invocation resume | **Not advertised** (`RunAgentRequest` has no `invocationId`) | — |
| Update session (rename/archive state) | **Not advertised** (no PATCH; state changes only through `/run` with a message) | — |
| Delete | `DELETE …/sessions/{sid}` | Never. It destroys history |
| Missing session | **No 404 declared on any session operation** (only 200/422). The connector relies on a 404 or the text "session not found" (`adk.ts:56-58`) | **GAP** (Q4) |
| Auth | **No security schemes**, and no operation declares security. Both GETs returned 200 without credentials | Today (2 paths only). INFERENCE: Cloud Run invoker IAM is not enforced for this service (Q5) |

## 3. Frontend today (re-anchored at HEAD; detail in the 10-12 report §4–§5)

EVIDENCE is in `…_evidence/source-anchors.txt`, with blob hashes.
- **User-ID mapping:**
  - The login response's `user` is persisted in the `auth-store` localStorage key (`useAuthStore.ts:33,63`).
  - `WorkspaceEntry.tsx:12` derives `userId = user.id`. The adapter puts it in the request body (`productionAdapter.ts:16,22`).
  - `run`/`history` copy `body.user_id` straight into the ADK path (`adk.ts:185`, `history/route.ts:45`).
  - **There are 0 server-side identity checks** under `src/app/api/agent`. A cookie helper and a route precedent exist (`utils/supabase/server.ts:5`, `superadmin-add-user/route.ts:8-12`).
- **History:**
  - The route returns 502 on any non-200 (`history/route.ts:52`), and the service turns that into `[]` (`chatService.ts:93`).
  - The adapter then reports `'empty'` (`productionAdapter.ts:18`). So a missing conversation, an outage and a new chat all look the same.
- **Discovery:** comes from Supabase `chat_sessions` only, through the browser client (`sessionIndexService.ts:50`); errors become `[]`, which shows as `'empty'`. **ADK list is never called.**
- **Send:** with no session, a new one is created with ID `session-${Date.now()}` (`adk.ts:53,190`). If an existing session returns 404, the same ID is recreated and the request retried (`adk.ts:198-202`).

## 4. Smallest change set (proposal only; nothing implemented)

| # | File | Change |
|---|---|---|
| 1 | `src/app/api/agent/_lib/identity.ts` (new, small) | `requireUser()` uses `createClient()` from `utils/supabase/server` and calls `auth.getUser()`. It returns 401 when there is no user |
| 2 | `run/route.ts`, `history/route.ts` | Use the server user ID. Ignore (or reject a mismatched) `body.user_id` |
| 3 | `src/app/api/agent/sessions/route.ts` (new) | `GET ?agent=` calls ADK list for the server user and returns `[{sessionId, updatedAt, title\|null}]`, newest first. ADK failure returns 502 |
| 4 | `_lib/adk.ts` | Add list normalization. Pass a history 404 through as 404 (`missing`). **No recreate** when the request carries a session ID; return 404 instead. Generate new IDs with `crypto.randomUUID()`. Write an initial `{title}` state on create only if Q2 passes |
| 5 | `src/services/chatService.ts` | Add `listConversations`. `getHistory` returns ok/missing/unavailable instead of `[]`. This **changes the FROZEN A1/A2 contract**, so it needs an Architect ruling (Q7) |
| 6 | `src/components/workspace/productionAdapter.ts` | `list()` calls ADK. `history()` maps to `missing`/`unavailable`. `send()` no longer needs `chat_sessions` to succeed. `rename`/`archive` follow Q6 |

- **Untouched:**
  - `Workspace.tsx` and `types.ts`. The approved UI already has the `missing`, `unavailable`, `partial` and `recovered` states and their copy (`types.ts:17,20`; `Workspace.tsx:120,149`).
  - Login (`proxy.ts`, auth store, `/api/auth/*`).
  - The manifest and the ADK bundle.
- **Tests that change:** `adk-lib`, `agent-history`, `agent-run`, `chatService.live`, `services.contract`, `productionAdapter`, plus a new sessions-route test. Legacy suites are unaffected.
- **Not covered here:** C-1 (cancellation) and C-2 (uncertain-send) remain separate APBM001 items.
- **INFERENCE:** if storage is durable, the switch also brings back every conversation the app already created under the user's UUID, including ones `chat_sessions` never recorded. Unless a title source exists, they show as "Untitled conversation".

## 5. Does any UI feature need extra metadata storage?

| Approved-UI feature | ADK alone? | Basis |
|---|---|---|
| Per-agent recent list, newest first; switching | **Yes** | List + `lastUpdateTime` (advertised); ids tested 10-04 |
| Open, reload, reopen | **Yes** | The session ID is in the URL (`navigation.ts`); get tested 10-04 |
| Continue a conversation | **Yes** | `/run` on an existing session (tested 10-04) |
| Row date | **Yes, if** list rows carry `lastUpdateTime` | GAP (Q2) |
| Auto-title (first message) | **Probably** | Initial state at create is advertised. It needs list rows to carry `state` (GAP, Q2). Otherwise it costs one full-transcript GET per row, or storage |
| Rename | **No** on this deployment | No update endpoint. State changes only by sending a message |
| Archive (hide, keep history) | **No** on this deployment | Same reason. `DELETE` erases history, contradicting the approved copy "It does not delete its history" (`Workspace.tsx:177`) |

**Conclusion:** `chat_sessions` is **not mandatory**. Only rename and archive truly need mutable metadata. Options (Q6):
- **(a)** A small overlay keyed by (user, agent, session). This could be `chat_sessions` if P0-2 shows it is deployed. When the overlay fails, the list shows the `partial` state, which already exists.
- **(b)** An ADK bundle upgrade to a release with a session-state update endpoint. That such releases exist is a CLAIM from upstream knowledge, not verified here, and it is a bundle-side change.
- **(c)** Descope rename and archive. That changes the approved UI, so it needs the Director.

## 6. Unresolved questions

- **Q1 (blocking) Durability.** The session storage engine is still unknown (P0-3/P0-4 not returned).
  - Timing hint (INFERENCE only): on 10-04, sessions created at 11:37 were still readable at 12:00, after a 25 s cold-start-like timeout at 11:58. Today's first GET also took 26 s.
  - Step 0 (§7) settles this with one read.
- **Q2** Do list rows carry `state` and `lastUpdateTime`? This decides how titles and dates are sourced.
- **Q3** Does this deployment accept the app's snake_case `/run` body? The 10-04 probe tested camelCase only.
- **Q4** What does an unknown session return? No 404 is advertised, yet the connector and the planned `missing` state depend on one.
- **Q5** The ADK service is publicly reachable, and its schema declares no auth.
  - It advertises session list, get, delete and run, plus builder (`POST /builder/save`, `GET /builder/app/{app}?file_path=`), debug and eval endpoints. None of these were exercised.
  - The server-identity change protects only the app's own path. Anyone with the URL and a user UUID could still call ADK directly.
  - Hardening means Cloud Run invoker IAM plus an ID token from the Next server, or an ingress restriction. That is a deployment decision for the Director and Tony.
- **Q6** Rename and archive: option (a), (b) or (c) from §5?
- **Q7** May the FROZEN A1/A2 history contract change from `[]`-on-error to a status result?
- **Q8** The roster drifts from the deployment: `moose_mcp_agent` is not served, and `utils` is advertised as an app. The manifest is Tony's; no change was made.
- **Q9** For C-2: `RunAgentRequest.stateDelta` is a candidate client-supplied operation marker that might attach to the stored user event. UNVERIFIED (optional test check).

## 7. Proposed two-conversation live test (NOT run; needs Tony's authorization)

**Setup:**
- Agent: `greeting_agent`, the safe-agent rule from 10-12 §7.3.
- Direct-API namespace user: `stark-apbm001-lt-<yyyymmdd>-<rand8>`. This keeps the test out of real users' lists.
- Each conversation gets a unique marker.

**Budget:** 2 sessions created, 3 agent messages, 7 reads (+1 if needed, +2 optional), 0 deletes. Cleanup (2 deletes) is Tony's call. No retries. Stop at the first anomaly.

| # | Call | Pass when |
|---|---|---|
| 0 | `GET /apps/greeting_agent/users/stark-apbm-probe-20261004-7c7e479f/sessions` (read-only). If rows lack events, add `GET …/session-a` | `session-a` and `session-b` are still present (with 4 events) 10 days on, which proves durability. **If absent: STOP; ADK-as-catalogue is blocked** |
| 1 | `GET` list for the new namespace | `[]` |
| 2 | `POST …/sessions/<uuid-A>` with body `{"title":"LT-A"}` | `Session` with state echoed |
| 3 | `POST /run` A, **snake_case, exactly as `adk.ts:164-169`**, with marker A | Replies `ACK <A>` (settles Q3) |
| 4 | `POST …/sessions` with body `{"state":{"title":"LT-B"}}` | ADK assigns an ID |
| 5 | `POST /run` B, camelCase plus `stateDelta {"apbm_op":"<uuid>"}`, with marker B | Replies `ACK <B>` |
| 6 | `GET` list | Exactly A and B. Record each row's fields (`state.title`, `events`, `lastUpdateTime`), which settles Q2 |
| 7 | `GET` A, then `GET` B | Separate transcripts. B's user event carries `actions.stateDelta.apbm_op` (Q9) |
| 8 | `POST /run` A: "which marker did I give you?" | Recalls marker A only |
| 9 | `GET` list | A's `lastUpdateTime` is later than B's |
| 10 | `GET …/sessions/<unused-uuid>` | Status recorded; 404 expected (settles Q4) |
| 11 (opt.) | After ≥ 20 min idle: `GET` list + `GET` A | Both conversations survive scale-to-zero |

**Post-implementation UI acceptance** (same script, real signed-in user):
1. New chat A, then new chat B.
2. Switch A↔B twice.
3. Reload on B; close the tab and reopen on A.
4. Continue A.
5. The list survives the reload.
6. A forged `user_id` in a route body never reaches another namespace.

## 8. Surprises

- **S1** The publicly advertised builder, debug and eval endpoints on an unauthenticated service (Q5) are the highest-risk item for owner review.
- **S2** `/list-apps` includes `utils`, so the UI must never use it as its roster. `moose_mcp_agent` exists in the UI roster but not on the server (Q8).
- **S3** INFERENCE: a cold first response (~26 s) sits close to the client's 30 s history cap (`chatService.ts:27`). A first list after an idle period could time out and show `unavailable`.
- **S4** DIRECTOR-OBS-001 stays **UNTRIAGED-live**. The ADK list removes `chat_sessions` from the critical path whatever P0-2 shows, and step 0 also bears on hypothesis H3.

## 9. Boundaries and package

- **Not done:**
  - no `.env*` read;
  - no session create/list/get or other ADK call beyond the 2 GETs;
  - no agent message;
  - no database, login, config, product or test change;
  - no build or test run.

  Git was read-only.
- **Preserved:** the 10-12 recon, the 10-14 P0 addendum, all APBM_000 records and `config/agents.manifest*.json` (`…_evidence/final-state.txt`).
- **Evidence:** `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/` (`FILE_INDEX.md`).
- **Package:** `/home/moose/Downloads/APBM001_ADK_SESSION_DISCOVERY_2026-10-14_123729_BDT.zip`, with its SHA-256 in `…_RECEIPT.txt` beside it.
