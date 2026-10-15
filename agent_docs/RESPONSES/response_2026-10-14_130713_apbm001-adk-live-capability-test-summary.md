# APBM001 ADK capability test: done, within budget (APBM_001 not launched)

**Package:** `/home/moose/Downloads/APBM001_ADK_LIVE_CAPABILITY_TEST_2026-10-14_130354_BDT.zip`
- 20 files, SHA-256 `ca913448…59578`; verification PASS with 0 secret hits. The receipt sits beside the ZIP.
- **Report:** `agent_docs/RESPONSES/response_2026-10-14_130354_apbm001-adk-live-capability-test.md`, with its `_evidence/` folder.

**What ran:** one pass, 13:03:06 to 13:03:41, against Greeting Agent in a new test namespace (`stark-apbm001-lt-20261014-5b317222`). Budget used:

| Request type | Used / allowed |
|---|---|
| GET | 10 / 10 |
| Session creates | 2 / 2 |
| `/run` (camelCase) | 3 / 3 |

No retries, errors, deletes or messages to any existing namespace. The first request took 23.9 s and the rest under about 2 s.

## What we learned

- **The core approach works on this server.** Both conversations were listed, opened separately and kept apart. Continuing A recalled its own marker, and the earlier events stayed intact. An unknown conversation returns a clear 404, "Session not found".
- **Titles work.** A title saved when the conversation is created comes back in the list.
- **"Most recently active first" doesn't come from the list.** ADK's `lastUpdateTime` stays at the creation time even after new messages, and the list doesn't include messages. Sorting by creation time works.
- **The operation marker idea doesn't work here.** ADK accepted the `stateDelta` marker on B but stored it nowhere. It can't support uncertain-send reconciliation on this deployment.
- **The 10-04 test conversations are still there after 10 days,** each with all 4 messages. That's retention, not proof that sessions survive a restart.

## Decisions the Architect still needs to make

- **B1** How the sidebar orders conversations:
  - by creation time;
  - by reading each conversation's last message, one extra request per row;
  - or by storing last activity.
- **B2** How unconfirmed sends get resolved, now that the marker route is closed.
- **B3** Rename/archive: storage or deferral. This could share storage with B1's third option.

## Carried forward

- Restart durability is unproven.
- The ADK service accepts unauthenticated calls.
- The app should switch to the tested camelCase request format.
- The 24–26 s first response is close to the 30 s history timeout.
- MOOSE CRM Agent is unavailable on this deployment.

## Left in place

Conversations A (4 events) and B (2 events) remain in the test namespace for your call.

Your three earlier ZIPs are now in `~/Downloads/ARCHIVE/` with unchanged hashes. I didn't move them.
