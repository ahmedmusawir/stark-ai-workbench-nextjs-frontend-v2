# APBM001 ADK session discovery: recommendation ready for Architect review (APBM_001 not launched)

**Package:** `/home/moose/Downloads/APBM001_ADK_SESSION_DISCOVERY_2026-10-14_123729_BDT.zip`
- 10 files, SHA-256 `3005e68f…79666`; verification PASS. The receipt sits beside the ZIP.
- **Report:** `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery.md`, with its `_evidence/` folder.

**What I did:**
- Made the two permitted read-only requests to the ADK service, `/openapi.json` and `/list-apps`. Both returned 200 without any login.
- Traced the frontend code at `f0fbf22`.
- Reused the 10-04 test evidence already on disk.

Nothing else touched the server, the database or the login setup, and I didn't read `.env.local`.

## Recommendation

- **ADK can provide both the conversation list and the history.** The deployment advertises list, open, create and continue for each agent and user. The 10-04 test already showed list, open and continue working for two conversations on this same service. Listing, switching, reload, reopen and continuing don't need `chat_sessions`.
- **The server should take the user from the login cookie** instead of trusting the `user_id` the browser sends. Today nothing checks it. The login setup stays as it is.
- **Only rename and archive need extra storage.** This ADK version can't change a conversation without sending it a message. Titles may come from ADK itself, if the test shows the list includes them.
- **About six files change (two new); the screens don't.** The approved UI already has the "not found", "unavailable" and "details unavailable" states.

## Check before building

One read-only request would show whether the two 10-04 test conversations still exist 10 days later. If they do, ADK keeps sessions across restarts. If they're gone, this approach is blocked until the ADK bundle gets durable storage.

## Worth knowing

- **The ADK service needs no authentication.** It also advertises delete, agent-builder and debug endpoints. Making it private is a separate deployment decision.
- **The roster doesn't match the deployment.** MOOSE CRM Agent is in the roster but not deployed, and a `utils` folder shows up as an app. I didn't touch the manifest.
- **Cold starts are slow.** The first request after idle took 26 seconds, close to the app's 30-second history timeout.

## Proposed two-conversation test (not run)

- **Setup:** on Greeting Agent, in a separate test namespace.
- **Budget:** 2 conversations, 3 messages, 7 reads, no deletes.
- **It checks:**
  - separate transcripts;
  - the list;
  - continuing a conversation;
  - newest-first order;
  - the not-found response;
  - the app's own request format.

Step 0 is the durability read above.

**Open questions (report §6):**
- Q1 durability, which is blocking;
- Q2 what the list returns;
- Q3 the request format;
- Q4 the not-found response;
- Q5 the open ADK service;
- Q6 rename/archive;
- Q7 the frozen history contract;
- Q8 roster drift;
- Q9 an operation marker for unconfirmed sends.
