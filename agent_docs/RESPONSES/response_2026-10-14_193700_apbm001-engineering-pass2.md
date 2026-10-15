# APBM001 engineering pass 2: built and verified; live walk blocked on login

The APBM001 workspace is implemented and passes all tests, the production build, and signed-out checks against the real server. One step is left: the real-app live walk. It needs a sign-in, and there was none: no credential file exists and nobody signed in interactively. The walk stopped before sending anything (0 live requests). Nothing is committed; Git is yours.

**Upload this:** `/home/moose/Downloads/APBM001_ENGINEERING_REVIEW_002.zip`
- 94 files, 3,116,704 bytes, SHA-256 `b49a30ff5bfdc19d671aa14deb286c4717a1fab42e559a9e1b6fd08bfc624311`. The receipt sits beside it.
- Inside the module at `agent_docs/ACTIONS/stark_agent_workspace_apbm_001/QAM/HANDOFFS/`.
- Review 001 is still in Downloads. I replaced it minutes later because its handoff records carried finish times I wrote ahead of time. 002 has the actual times; nothing else changed. Use 002.

## What changed for the user

- **One signed-in user, real ADK conversations.** The conversation list and every transcript come from ADK. The workspace no longer uses `chat_sessions`.
- **The server decides who you are.** The agent routes refuse requests without a login (401), with a mismatched user (403), from another site (403), with a stale configuration (409) or with a missing configuration (503). All of these are refused before anything reaches ADK.
- **New chats get their ID before anything is sent.** The first message:
  - allocates the conversation ID;
  - saves a small recovery marker;
  - puts the ID in the URL;
  - creates the conversation once, titled from the message;
  - then sends.

  If ADK says a conversation doesn't exist, it's reported as missing; it's never recreated or resent.
- **Unconfirmed sends are explicit.** The screen says "We could not confirm the last send. Check the conversation before sending again." **Check history** only reads. **I reviewed the history — continue** appears after a successful read, and the warning survives a reload.
- **The sidebar keeps your conversations during a new draft**, on desktop and in the mobile drawer. Back/forward around a sent draft stays consistent.
- **Rename and archive are hidden.** MOOSE CRM Agent shows as unavailable on this deployment, and the manifest is untouched. The approved design is kept.

## Verification (mine, not independent QA)

| Check | Result |
|---|---|
| Before changes | 40 suites / 290 tests passed; typecheck clean |
| Full Jest, final | 44 suites / 422 tests passed |
| Typecheck | clean |
| Production build | passed |
| Browser tests (Chromium, synthetic fixture) | 50/50 |
| Real server, signed out | every agent route refused (401/403); 0 ADK calls |
| Live walk | blocked by login; budget untouched (0 logins, 0 sessions, 0 runs, 0 reads) |

Tests caught one real bug, now fixed: the workspace crashed if the browser refused to store the signed-in user's label.

## The one blocker: how should the live walk sign in?

Owner: Tony. Pick one:
1. **Credential file.** Create `.env.qa.local` in the repo root with `APBM001_QA_EMAIL` and `APBM001_QA_PASSWORD` for the authorized test account. It's already git-ignored, and I read it into memory only.
2. **Interactive.** I open a visible Chrome window and you sign in by hand twice: at the start and after the sign-out step.

Then I run the walk once:
- conversations A and B;
- switching between them;
- a reload;
- a new tab;
- continuing A;
- sign out and back in.

It stays inside the engineering budget, and I return review 003. Otherwise you can commit without it, and QA's live run covers the two live acceptance checks (AC011/AC012).

## Decisions for the Architect

- **Deployment packaging.** Nothing excludes `agent_docs/` from a source-upload deployment.
- **Unused type.** May I remove the `GetHistoryResponse` type, which is now unused? I haven't deleted it.

## Before Cody starts

You commit the candidate on `frontend-apbm-0001` and create `qa/frontend-apbm-0001` at that commit. I then record releasing the checkout.

Kept as required:
- manifests, package files and lockfile;
- every APBM000 record;
- DIRECTOR-OBS-001 still untriaged.

I made no cloud or database changes, no deployment, and read no `.env.local`. Cody's plan, approval and certificate are untouched.
