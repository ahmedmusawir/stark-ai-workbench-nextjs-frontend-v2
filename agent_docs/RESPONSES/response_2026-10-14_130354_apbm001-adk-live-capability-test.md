# APBM001 bounded ADK capability test: result (APBM_001 NOT LAUNCHED)

**Date:** 2026-10-14, Asia/Dhaka (UTC+06:00). **Seat:** Claudy, Engineer and checkout owner. Tony retains Git.
**Authority:** The Architect's review of the ADK discovery package (2026-10-14). It accepts the core direction and authorizes only this direct-API test.
**Target:** `https://adk-bundle-prod-v2-952978338090.us-east1.run.app`, app `greeting_agent`.
**New namespace:** `stark-apbm001-lt-20261014-5b317222`.
- A = `bcfb8bb9-8da3-4176-aff5-db6727303ad0`
- B = `ff40bf3a-cf0d-45fa-8298-df618135878a`

**Window:** 13:03:06.057 to 13:03:41.975 (15 requests, 35.9 s of request time).
**Budget used:**

| Request type | Used / allowed |
|---|---|
| GET | 10 / 10 |
| Create | 2 / 2 |
| `/run` (camelCase) | 3 / 3 |

There were 0 retries, 0 transport errors, 0 redirects, 0 deletes and 0 stops. No credentials were sent.
**Labels:** EVIDENCE / INFERENCE / CLAIM / GAP / QUESTION. All citations are in `…_evidence/` (`request-ledger.json`, `analysis.json`, `responses-summary.json`, `raw/`).

## 1. Result in brief

- **The discovery and history contracts hold for one user with two conversations.** EVIDENCE: list, get, create-with-ID with title state, continuation, transcript separation and an explicit 404 all behaved consistently.
- **Titles: supported.** The `state.title` written at create comes back in every list row.
- **Newest-first by activity: not supported by the list.**
  - `lastUpdateTime` stays at the **creation time** and does not advance when events are added.
  - List rows carry `events: []`.
  - The rows came back in creation order. That is 2 rows, and the order is undocumented.
- **Operation marker: does not support reconciliation here.** The `stateDelta` on B was accepted (200) but stored **nowhere**.
- **The 10-04 sessions were retained:** `session-a` and `session-b` each still had 4 events and their original markers 10 days later. **Retention does not prove restart durability.**

## 2. Requests (exact)

| # | Step | Call | Status | Time (s) |
|---|---|---|---|---|
| 1 | 1 | GET old list (`stark-apbm-probe-20261004-7c7e479f`) | 200 | 23.908 |
| 2 | 1 | GET old `session-a` | 200 | 0.637 |
| 3 | 1 | GET old `session-b` | 200 | 0.522 |
| 4 | 2 | GET new list | 200 `[]` | 0.498 |
| 5 | 3 | POST create A, body `{"title":"APBM001 LT conversation A"}` | 200 | 0.660 |
| 6 | 3 | POST create B, body `{"title":"APBM001 LT conversation B"}` | 200 | 0.606 |
| 7 | 4 | POST `/run` A, marker `cobalt-heron-5b31` | 200 | 2.032 |
| 8 | 4 | POST `/run` B, marker `maple-quartz-7222` + `stateDelta {"apbm001_op_id":"6121cb56-…be11"}` | 200 | 1.880 |
| 9 | 5 | GET list | 200 | 0.518 |
| 10 | 5 | GET A | 200 | 0.491 |
| 11 | 5 | GET B | 200 | 0.491 |
| 12 | 6 | POST `/run` A: "which marker did I give you?" | 200 | 2.075 |
| 13 | 7 | GET list | 200 | 0.493 |
| 14 | 7 | GET A | 200 | 0.533 |
| 15 | 8 | GET a fresh nonexistent UUID | **404** `{"detail":"Session not found"}` | 0.554 |

Socket timeouts were 90 s for the first GET, 60 s for later GETs and creates, and 90 s for runs. The first request took 23.9 s and the rest about 0.5–2.1 s. This is **not** a claim of scale-to-zero or a restart.

## 3. Observed contracts vs still unproven

| Contract | Observed (EVIDENCE) | Still unproven |
|---|---|---|
| Create with ID + initial state | 200. Returns `{id, appName, userId, state:{title}, events:[], lastUpdateTime}`; the ID matches and the title is echoed | Duplicate-ID behavior (not tested) |
| `/run`, camelCase | 200. Returns an array with **1 model event** (`content`, `finishReason`, `usageMetadata`, `invocationId`, `id`, `timestamp`, `actions`). Replies: `ACK cobalt-heron-5b31`, `ACK maple-quartz-7222`. No function calls | The app's current **snake_case** body (not tested; the documented form is camelCase). `/run_sse`. Error-body shapes |
| List | 200. Rows `{id, appName, userId, state, events, lastUpdateTime}`. `state` **includes the title**; `events` **always `[]`** | Ordering is not a contract. Paging and large-row behavior |
| Get | 200. Full events: one user and one model event per turn, sharing an `invocationId`; plus `state` | — |
| Continuation | A recalled `cobalt-heron-5b31`. A has 4 events and its first 2 event IDs are unchanged (prefix preserved). B's marker is absent from A, and A's from B | — |
| `lastUpdateTime` | Stayed at **creation time**. A: 13:03:31.947 before and after both runs; its last event is at 13:03:39.002. The 10-04 sessions show the same pattern (`lastUpdateTime` 11:34:46 is earlier than the first event at 11:37:26) | Whether any operation advances it. No update endpoint is advertised |
| `stateDelta` on `/run` | Request accepted. The marker is in **0 of 15** response bodies: stored user event `actions.stateDelta = {}`, session `state` has only the title, and the run response doesn't carry it either | — |
| Unknown session | 404 `{"detail":"Session not found"}`. Not advertised in the OpenAPI document, but matches the connector's check (`adk.ts:56-58`) | — |
| Storage | Sessions retained for 10 days | **Restart durability and the storage engine** (owner P0-3/P0-4) |
| Authorization | The 7 session/run endpoints exercised accepted unauthenticated calls in this namespace | Authorization of other advertised endpoints (delete, builder, eval, debug). **The unauthenticated-origin deployment limitation stands** |

## 4. Answers to the Architect's questions

- **Can the list supply titles?** Yes, when the title is written as the initial state at create. Rename still needs an update capability, and none is advertised, so rename/archive storage remains an open decision.
- **Can the list sort newest-first?** By **creation time**, yes: sort client- or server-side on `lastUpdateTime`, and never rely on the returned order. **By last activity, no.** The options are:
  - (a) accept creation-time ordering;
  - (b) one GET per row to read the last event time, which means N full transcripts;
  - (c) record last activity in a metadata store. That is the same decision as rename/archive.
- **Does the operation marker support reconciliation work?** **No, not on this deployment.** The marker is not persisted anywhere. The run response does return event `id` and `invocationId`, which binds a *confirmed* send to stored events but not a lost response. Mechanisms that remain:
  - a pre-send event cursor (count plus last event ID), then a post-check that still needs a rule for attribution;
  - a bundle-side marker, for example a callback copying a client operation ID into the event's `customMetadata` (a bundle change);
  - leaving `uncertain` terminal behind the existing "Check history" action, which never resends.

  QUESTION for the Architect: which one?

## 5. Remaining blockers to the single-user frontend implementation

**Decisions needed:**
- **B1. Recency rule for the sidebar and recent list:** creation time, a per-row last-event read, or a stored last-activity field.
- **B2. Uncertain-send mechanism:** the `stateDelta` route is closed (§4).
- **B3. Rename/archive:** storage or deferral (stated as undecided). B1 option (c) would share that storage.

**Carried, non-blocking:**
- **R1.** Restart durability is unproven; retention is observed. Owner P0-3/P0-4 shows the configured store. A controlled restart would be a deployment action outside this authority.
- **R2.** The ADK origin is unauthenticated. Server-resolved identity protects only the app's own path.
- **R3.** Use the tested camelCase `/run` body in the implementation; snake_case was not exercised.
- **R4.** The first response took 23.9–26 s, against the client's 30 s history cap (`chatService.ts:27`). Budget the list and history timeouts accordingly.
- **R5.** `moose_mcp_agent` is absent from `/list-apps` (earlier package). Report it as unavailable from server-side data; the manifest stays preserved.

**Rulings acknowledged for implementation:**
- explicit history outcomes, with every `[]` consumer and contract reviewed (the 404 detail above supports `missing`);
- sidebar continuity, navigation races and uncertain sends are in scope;
- manifest preserved, with unavailable agents reported honestly;
- rename/archive undecided.

## 6. State left in place

- A has 4 events and B has 2 events in `stark-apbm001-lt-20261014-5b317222`. Both are intact and identifiable, for Tony's disposition.
- The 10-04 namespace was **read only** (3 GETs). No message went to any existing namespace.

## 7. Boundaries and package

- **Not done:**
  - no deletes, retries, database or deployment changes;
  - no `.env*` reads;
  - no login, product, test or config edits;
  - no Git mutations (Git was read-only).
- **Evidence handling:** Opaque Gemini `thoughtSignature` blobs are redacted in the evidence copies of `raw/08` and `raw/11`; the ledger hashes refer to the originals. The old namespace has summaries only (`responses-summary.json` #1–3).
- **Preserved:**
  - APBM_000 verdicts, deviations, PD-002-01/PD-Q5-01 and the Q5 records;
  - DIRECTOR-OBS-001, which stays **UNTRIAGED-live**;
  - the 10-12, 10-14 P0 and 10-14 discovery deliverables (`…_evidence/final-state.txt`): 7/7, 11/11 and 9/9 unchanged.
- **Earlier packages:** all three ZIPs and receipts are now in `~/Downloads/ARCHIVE/`, hashes unchanged. This seat did not move them.
- **Package:** `/home/moose/Downloads/APBM001_ADK_LIVE_CAPABILITY_TEST_2026-10-14_130354_BDT.zip`, with its SHA-256 in `…_RECEIPT.txt` beside it.
