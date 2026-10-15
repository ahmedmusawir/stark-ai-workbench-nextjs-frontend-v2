# Data and behavior contract

## Identity and configuration
Existing login remains the frontend Supabase project rwosuvbufaqwbaukohkk. Tony identifies a separate QR Project (zldxzlbkoayhyhzxpjrq) as ADK history storage; this is owner-reported, not verified deployment configuration. No direct database access is part of this module.

Live mode is NEXT_PUBLIC_CHAT_MODE=live. ADK_BUNDLE_URL_V1 is the confirmed server endpoint https://adk-bundle-prod-v2-952978338090.us-east1.run.app. v2-local remains the existing manifest-supported alternative. No endpoint hardcoding in product code. Configuration resolution is server-side and validated; a missing/invalid live target yields configuration-unavailable, never automatic mock mode.

Derive a stable opaque backendKey from mode + configured bundle binding + normalized non-secret endpoint identity (scheme, host, port and base path). This is a namespace discriminator, not a credential or authorization mechanism. Never hash a whole environment file; do not expose raw endpoints, credentials or secret values. Reject URL userinfo/query/fragment in this target configuration. Distinct fixture A/B endpoints sharing a manifest bundle name must produce different keys. A restored A configuration must restore the same key.

Resolve auth using the existing server helper and a verified Supabase user on every agent route before upstream contact. Supplied mismatched user_id returns 403, absent authenticated user returns 401; no upstream call. Invalid input returns 400. Reject unsupported manifest agents. Frontend auth cache is display state, never authorization. Keep server and UI identity synchronized so stale localStorage cannot label server-user B data as user A.

All session/list/history/cache/navigation/recovery identities are scoped by authenticated user, mode, backendKey, agent and session ID as applicable. Return a non-secret workspace identity/config descriptor from an authenticated server route or server component. Check the supplied backendKey against current config before session operations (409 on stale key, zero upstream). Backend endpoints remain off browser payloads.

## ADK wire contract, observed 14 October
GET /apps/{agent}/users/{serverUser}/sessions returns Session[]. Each row has id, state.title when set, lastUpdateTime and events:[] in this deployment. Sort descending on lastUpdateTime with stable session-ID tie-break; describe it as creation order for this target. Do not infer event absence from a list row.

GET /apps/{agent}/users/{serverUser}/sessions/{id} returns full session events. Missing session was observed as 404 with detail Session not found. Treat an unavailable agent separately so an agent-level 404 is not falsely a missing conversation. Upstream auth errors become access-unavailable; transport/timeouts/server errors become unavailable. Malformed successful responses are unavailable, not empty.

POST /apps/{agent}/users/{serverUser}/sessions/{uuid} with initial state {title: ...} creates a new session. UUID allocated before dispatch. POST /run uses appName, userId, sessionId, newMessage:{role:'user',parts:[{text:...}]}. Do not send snake_case upstream. Return event IDs/invocation IDs where available, and display only appropriate content; exclude thoughtSignature and internal thought/tool/auth metadata from ordinary transcript rendering and exports.

The test's stateDelta marker did not appear in session state or events; it is not an accepted recovery mechanism. Missing PATCH in the captured schema supports deferral of rename/archive; DELETE is not archive and is forbidden here.

## Frontend server/API contract
Implement authenticated list and explicit creation using /api/agent/sessions (GET/POST), preserving /api/agent/history and /api/agent/run as the owned surface where practical. A small shared identity/config helper is appropriate. All error paths use structured, sanitized codes. HTTP success alone is insufficient: validate expected response shapes.

List result: ready(rows) or empty only for successful zero-row response; unavailable/access-unavailable are distinct failures. Rows carry sessionId, stable scoped row key, title and creation-order timestamp. Older sessions without title receive a stable readable fallback including a short ID; no per-row transcript scan. Derive initial title from the first submitted message, trim/collapse whitespace and limit to 80 characters; render as text, never HTML. No model call for titles.

History result: ready(messages), empty(successful zero events), missing, unavailable, access-unavailable. Preserve content presentation and meaningful ordering. Caller migration is explicit; tests that asserted [] for failures must be replaced with the new contract. Do not break unrelated legacy consumers by changing a shared return type without updating them.

## First-send transaction and recovery
New Chat creates only a local draft. The draft's first send allocates one UUID, records a minimal pending operation record, and places/retains that identity in navigation before any network write. Use explicit create followed by run only after confirmed creation. Keep the same known session ID if create or run fails. A successful create remains discoverable even if its first run fails. A server route must never interpret a continuation failure as permission to create.

Recovery journal: a small versioned local record containing only scoped identity, operation ID, stage, pending/uncertain flag and time. No message text, transcript, password, token, endpoint or thought data. It is not a second conversation catalogue or delivery authority. It must survive refresh/tab reopen on the same browser while unresolved. Keep it scoped and hidden until the same server-verified user returns. Clear visible transcripts/drafts on logout; do not discard unresolved same-user warnings merely to make a later login look successful. Bound malformed/oversize records defensively. Cross-device recovery warnings are not certified.

Before send, if journal storage is unavailable, prevent the network write and show a useful not-sent/storage-unavailable message; reading existing history must still work. This is preferable to a lost uncertain state after reload. A stale pending record on reload is uncertain. Validate any remembered identity against the current server namespace before reading it.

Confirmed pre-dispatch failures are not-sent. After dispatch, transport loss, timeout, abort or ambiguous upstream failure is uncertain. Validation/auth rejection before upstream is not-sent. An explicit known missing session is missing; do not recreate. Never infer non-delivery from an empty or unchanged subsequent history read.

Check history is read-only and may refresh transcript; it never replays the message or silently clears uncertainty. Display: 'We could not confirm the last send. Check the conversation before sending again.' Allow an explicit 'I reviewed the history — continue' action after a successful history load. That acknowledges uncertainty, permits a new deliberate send, and does not label the prior operation delivered or resend its text. New chat remains available. Failed history loads cannot unlock by pretending recovery succeeded. Retain the warning until this explicit acknowledgement or a confirmed correlated response from that same live request. No heuristic text/cursor correlation.

## Navigation and cancellation
Keep sidebar conversation navigation visible for the selected agent in draft and conversation views. New Chat must create a fresh draft identity. Back/forward to a consumed draft must resolve to its resulting session or an explicitly fresh draft, never show a previous transcript while sending with session=null.

Abort obsolete list/history work on navigation and identity changes; gate all late results by complete request identity. User navigation must not cause a late response to overwrite another conversation. In-flight send cancellation is not backend rollback: retain pending/uncertain status for its original conversation, even if UI leaves it. Prevent double-submit in the active view. Cross-tab concurrency is not a general distributed-lock guarantee; never use it to infer which event belongs to a lost request.

URLs carry agent/session/backend identity. A missing/stale backend key in an old deep link must not silently open the same ID against a different target. Offer selection from the current conversation list or explicit confirmation to bind the legacy link. A/B/A and mock/live fixtures must demonstrate collision safety. No generic product copy exposing backend implementation details.

## Request bounds
Default server upstream deadlines: 60s list/history/roster/create and 90s run, with browser route deadlines exceeding server budgets by a small documented margin. Separate create and run avoid one stacked first-send deadline. Propagate cancellation where supported; release timers/resources. One upstream attempt per mutation, no automatic retries. No arbitrary widening beyond deployment/platform limits: report incompatibility for deployment review. An initial 24–26s response must display loading, not an empty list.
