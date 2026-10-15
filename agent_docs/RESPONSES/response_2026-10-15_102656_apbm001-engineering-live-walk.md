# APBM001 engineering complete: live walk passed 16 of 16

The live walk ran once, in 43 seconds, against the real local app and the confirmed agent service. Every step passed, and the engineering budget held. Nothing is committed; Git is yours.

**Upload this:** `/home/moose/Downloads/APBM001_ENGINEERING_REVIEW_003.zip`
- 100 files, 3,209,141 bytes, SHA-256 `56cef7f843f01f778df368d79a9447ec3a56db78472d4f0b72598ade309c0f63`. The receipt sits beside it.
- Reviews 001 and 002 stay in place, unchanged. 003 supersedes them.

## Your login file

- `.env.qa.local` is ignored by Git (`.gitignore` line 28) and untracked. The helper read it into memory only.
- Its permissions are 644, so other local users can read it. I suggest `chmod 600 .env.qa.local`; I didn't change your file.
- **Credential leak check:** I searched the whole review package and 372 log, evidence and scratch files for the actual email and password. There were 0 matches. Screenshots show only the A/B transcript area.

## What the walk proved

| Step | Result |
|---|---|
| Right target: live mode, your login project, the confirmed agent service, Greeting Agent available, MOOSE unavailable | PASS |
| Created conversations A and B from new chats; each reply echoed its own marker | PASS |
| Switched A↔B twice, reloaded B, reopened A in a new tab; neither showed the other's content | PASS |
| Continued A; Greeting Agent recalled A's marker, earlier messages intact | PASS |
| Signed out (server then refused with 401), signed back in as the same user, reopened A with all 4 messages | PASS |
| List showed A and B under their first-message titles, newest first | PASS |

**Budget used:**

| Budget | Used |
|---|---|
| Sign-ins | 2 of 2 |
| New conversations | 2 of 2 |
| Messages | 3 of 3 |
| List/history reads | 10 of 30 |
| Roster reads | 2 of 4 |

No retries and no outside traffic. Replies took about 2–3 seconds. The 24–26-second slow first read didn't happen this time, which proves nothing either way.

The product code is byte-identical to review 002, so yesterday's tests still apply: 422/422 unit tests, typecheck, build and 50/50 browser tests. Before the run I only tightened the walk script, so a slow or oddly worded reply couldn't waste the one-shot budget.

## Small things noticed

- Two near-simultaneous page loads both fetched the agent roster, so it was read twice instead of once. That's harmless; a fix is the Architect's call.
- Signing out cut off two in-flight browser requests. Both were already answered or irrelevant, and the 401 that followed confirms sign-out worked.
- I pre-wrote finish times in the records again. I caught and corrected them before packaging; the package has the real times.

## What's next

1. **Commit.** Commit the candidate on `frontend-apbm-0001` and create `qa/frontend-apbm-0001` at that commit. I then record releasing the checkout, and Cody starts QA.
2. **Test conversations.** Two test conversations are left in your Greeting Agent history for you to keep or remove:
   - A `d22f9aff-4df6-4f3d-9a76-ea79000e7ac8`;
   - B `7adcba92-ff0a-4707-aae4-b15a81801d42`.
3. **Architect rulings.** Still waiting:
   - excluding `agent_docs/` from deployments;
   - removing the unused `GetHistoryResponse` type;
   - optionally, the roster double-read.

---
**Response file:** `response_2026-10-15_102656_apbm001-engineering-live-walk.md`
**Location:** `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/RESPONSES/`
