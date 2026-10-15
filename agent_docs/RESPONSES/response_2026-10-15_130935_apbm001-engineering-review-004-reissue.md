Got it. The details stay up top. The bottom now ends with the response file and its location, then the ZIP and the receipt.

# APBM001 review 004: origin check corrected and verified

The Architect's two origin-check findings are fixed. State-changing agent routes now trust only origins from server configuration, never from request headers. Every check passed. Nothing is committed; Git is yours.

**Upload this:** `/home/moose/Downloads/APBM001_ENGINEERING_REVIEW_004.zip`
- 161 files, 6,279,458 bytes, SHA-256 `4d02b2630596b9725d487a6b6b581e3acc262312723a8490b9e73680b4d8f90d`. The receipt sits beside it.
- Reviews 001–003 are unchanged. The Downloads copies of 001 and 002 are in `~/Downloads/ARCHIVE/`.

## 1. The origin fix (AC025)

**What was wrong:**
- the check compared host names without the scheme, so `http://` passed for an `https://` site;
- it trusted the request's own `Host`/`X-Forwarded-Host` headers, so a caller could make any origin "match" by sending one.

**What it does now** (`src/app/api/agent/_lib/context.ts`): `Origin` must exactly equal a trusted origin, meaning scheme, hostname and port. Trusted origins come only from server configuration:
- `NEXT_PUBLIC_SITE_URL`, your deployment address;
- `AGENT_TRUSTED_ORIGINS`, a new optional server-only list, for example for a local test server;
- under `next dev` only, `localhost` and `127.0.0.1` at the dev server's own port.

No proxy is trusted, and `Host` and forwarded headers are never read. The check still runs before the sign-in lookup, body parsing and any ADK call.

| Check | Result |
|---|---|
| New tests run against the old code first | 36 failed. The old code accepted both of the Architect's reproductions. |
| Full Jest | 44 suites / 479 tests passed (was 422) |
| Typecheck and production build | Both pass |
| Real `next dev` server, signed out | 10/10 probes as expected |
| Real `next start` server, signed out | 17/17 probes, plus 2 reads, as expected |
| Browser fixture tests | 50/50 |
| Outside traffic during the server probes | 0 |

Since review 003, 1 product file and 3 test files changed; the other 32 are byte-identical. Exact diff: `ENGINEERING_EVIDENCE/attempt-003/correction.patch`.

## 2. Configuration you need to know about

- **Deployment:** `NEXT_PUBLIC_SITE_URL` must equal the public address exactly, or every send gets a 403. Other legitimate addresses go in `AGENT_TRUSTED_ORIGINS`.
- **`npm run dev`:** works as before on localhost.
- **Local `next start`** (what QA's live run uses): start it with `AGENT_TRUSTED_ORIGINS=http://127.0.0.1:<port>`.
- I didn't read or edit any `.env` file.

## 3. Records

- Every engineering and QAM summary now opens with the current status and next action. The dated history below it is untouched, including the 14 October blocked state, the earlier packages and both timestamp-correction disclosures.
- **Architect dispositions recorded:**
  - `GetHistoryResponse` stays;
  - the roster double-read stays;
  - excluding `agent_docs/` and credential files from deployment is a release prerequisite.
- **No live walk:** no sign-in and no ADK requests. Review 003's live evidence stays tied to its own candidate; QA's Q2 has to check the revised one.
- **Packaging:** I didn't read `.env.qa.local` to package this. 91 files are byte-identical to review 003's credential-scanned copies. The 69 new or changed files came from runs that never loaded that file. The receipt says so.

## 4. Small things noticed

- My first stop of the dev server missed, because `setsid` detached it. I stopped it a few seconds later, and the log keeps the miss. Nothing is running now.
- One server probe sent a shortened `Forwarded` header. The unit tests cover the full form.

## What's next

1. **Architect:** review review 004.
2. **Tony:** after that, commit on `frontend-apbm-0001` and create `qa/frontend-apbm-0001`. I then record the checkout release, and Cody starts Q1.
3. **Before any deployment:**
   - verify that `agent_docs/` and credential files are excluded;
   - check that the deployed `NEXT_PUBLIC_SITE_URL` is exact.
4. **Still open from before:**
   - test sessions A and B in your Greeting Agent history;
   - optionally, `chmod 600 .env.qa.local`.


## Other files

- ZIP, repo copy (byte-identical): `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip`
- Receipt, repo copy (byte-identical): `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004_RECEIPT.txt`
- Review entry: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/QAM/HANDOFFS/REVIEW_START_HERE_ENGINEERING_004.md`
- Verification logs: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE/attempt-003/verification/`
- Diff since review 003: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE/attempt-003/correction.patch`
- Engineering report: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_REPORT.md`
- QAM state: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/ACTIONS/stark_agent_workspace_apbm_001/QAM/QAM_STATE.md`
- The fix: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/src/app/api/agent/_lib/context.ts`
- Session log: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/session_2026-10-15.md`
- Recovery: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/RECOVERY.md`

---
**Response file:** `response_2026-10-15_130935_apbm001-engineering-review-004-reissue.md`
**Location:** `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2/agent_docs/RESPONSES/`
**ZIP:** `/home/moose/Downloads/APBM001_ENGINEERING_REVIEW_004.zip`
**Receipt:** `/home/moose/Downloads/APBM001_ENGINEERING_REVIEW_004_RECEIPT.txt`
