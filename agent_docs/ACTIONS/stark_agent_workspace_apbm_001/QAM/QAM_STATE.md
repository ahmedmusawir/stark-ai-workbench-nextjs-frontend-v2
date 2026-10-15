# Current workflow state

> **Current status (2026-10-15, Asia/Dhaka) — read first.** Claudy, Engineer facts only.
> - **State:** ENGINEERING_COMPLETE with the Architect's AC025 origin correction applied (engineering attempt 003). Returned as `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt (SHA-256 in the receipt). Reviews 001–003 are kept unchanged.
> - **Candidate:** pending Tony's commit on `frontend-apbm-0001` (HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` = baseline). Identity: `../ENGINEERING_EVIDENCE/attempt-003/changed-paths.json` and `candidate.patch`. Versus review 003, 1 product file and 3 test files changed (`correction.patch`).
> - **Next action:** the Architect reviews review 004. Then Tony commits the revised candidate and creates `qa/frontend-apbm-0001` at that SHA; Claudy records releasing checkout writes; Cody starts Q1. None of these has happened.
> - **Live evidence:** the attempt-002 live walk (16/16) belongs to the review-003 candidate only, and was not repeated (engineering budgets exhausted). Independent Q2 must validate the revised candidate.
> - **Release prerequisite (Architect):** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
> - **Pending, not Engineer-owned:** Q1 plan, QA Lead approval, Q2 release, Gate Q. Gate D is not in scope.
> - Everything below is dated history, kept as written, including the issued template text (e.g. "not started" / "pending"), the 2026-10-14 blocked state and both timestamp-correction disclosures.

Module: APBM001 v1.0. State: ISSUED_FOR_ENGINEERING; NOT_INSTALLED_OR_EXECUTED_BY_ARCHITECT.
Reviewed baseline: f0fbf2282737ea3a63fc78d553cd31fc570821d5.
Engineering owner: Claudy. Candidate: PENDING_ENGINEERING_AND_DIRECTOR_COMMIT.
Expected engineering branch: frontend-apbm-0001. Future QA branch: qa/frontend-apbm-0001.
QA Executor: Cody, not yet released. Q1 plan: NOT_AUTHORED. Lead approval: NOT_ISSUED. Q2 release: NOT_ISSUED. Gate Q: NOT_ISSUED. Gate D: NOT_IN_SCOPE.
Next permitted action: Claudy installs pack safely, runs bounded preflight and engineering assignment. Tony owns all Git operations.

Append dated transitions with candidate and execution HEAD (distinct), authority source, contract/plan hashes, attempt, package/receipt, stop and next owner. A state file indexes authority; it does not grant it. Engineer may update engineering facts only. QA owns later phase facts; exact Lead decisions are transcribed with provenance.

---

### 2026-10-14 19:33 Asia/Dhaka — ENGINEERING_BLOCKED (live walk only) — recorded by Claudy (Engineer facts only)

- **Authority:** Tony's 18:16 approval of APBM001 and the launch prompt relayed at 18:47.
- **Pack:** `APBM001_IMPLEMENTATION_PACK_v1_0_2026-10-14.zip`, SHA-256 `0807343250664d936ebadc505c361133b7afca91981da2737f496486b3136f6c`. Installed 18:48:49; 75/75 module files verified.
- **Identity:** execution HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` (= baseline). Candidate = **pending Tony commit**, identified by `ENGINEERING_EVIDENCE/attempt-001/changed-paths.json`.
- **Contract:** ACCEPTANCE_SPEC, DATA_CONTRACT and RULINGS_ADDENDUM as issued (installed bytes match the pack index).
- **Attempt:** engineering pass 2, attempt 001.
  - Implementation complete. Self-verification: Jest 44/422, tsc 0, build 0, Playwright fixtures 50/50, runtime negatives OK.
  - Live walk: **STOP-AUTH** (no credential file or interactive login). 0 live requests.
- **Package:** `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_002.zip` plus receipt; Downloads copy. This supersedes review 001 (19:33), which is kept unchanged. The only content change is that it corrects pre-written handoff timestamps to the actual times.
- **Next owner:** Tony. Either supply the login path for the one engineering live walk (→ review 002), or decide to commit without it. Then the Git/QA-branch handoff.
- **Pending:** Cody's Q1 plan, QA Lead approval, Q2 release, Gate Q. Gate D is not in scope.

---

### 2026-10-15 10:24 Asia/Dhaka — ENGINEERING_COMPLETE — recorded by Claudy (Engineer facts only)

- **Authority:** Tony's 15 October instruction to complete the blocked live walk with the supplied `.env.qa.local` (verified ignored and untracked).
- **Identity:** execution HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`. The candidate is still pending Tony's commit; product+test are byte-identical to review 002 (`ENGINEERING_EVIDENCE/attempt-002/changed-paths.json`).
- **Attempt:** engineering live walk attempt 002. 16/16 steps PASS. Budget: login 2/2, creates 2/2, runs 3/3, reads 10/30, roster 2/4.
- **Package:** `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_003.zip` plus receipt; Downloads copy.
- **Next owner:** Tony. Commit the candidate on `frontend-apbm-0001` and create `qa/frontend-apbm-0001` at that SHA. Claudy then records releasing checkout writes; Cody records acceptance and starts Q1.
- **Pending:** Q1 plan, Lead approval, Q2 release, Gate Q. Gate D is not in scope.

---

### 2026-10-15 11:44 Asia/Dhaka — Architect review of review 003 (transcribed by Claudy; relayed by Tony)

- **Verdict, as relayed:** core implementation and live evidence accepted for continued engineering handoff preparation, **not Gate Q**. A bounded correction is required before Tony commits:
  - AC025 origin enforcement;
  - summary reconciliation;
  - dispositions;
  - review 004.
- **Dispositions:**
  - `GetHistoryResponse` unchanged, cleanup deferred;
  - roster double-read unchanged, optimization deferred;
  - deployment exclusion of `agent_docs/` and credential files is a release prerequisite (no deployment or packaging change now).
- **Ownership:** Claudy remains checkout owner on `frontend-apbm-0001`. Tony retains Git. No commit, branch switch or QA ownership handoff yet.

### 2026-10-15 11:58 Asia/Dhaka — ENGINEERING_COMPLETE, correction applied (attempt 003) — recorded by Claudy (Engineer facts only)

- **Identity:** execution HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`. Candidate pending Tony's commit: `ENGINEERING_EVIDENCE/attempt-003/changed-paths.json`. Versus review 003: `src/app/api/agent/_lib/context.ts` (product) and 3 test files.
- **Attempt:** engineering attempt 003:
  - red run 36 fail on the review-003 code;
  - Jest 44/479, tsc 0, build 0, Playwright 50/50;
  - `next dev` and `next start` origin probes as expected, with 0 non-loopback traffic;
  - no live requests.
- **Live evidence:** the attempt-002 walk is tied to the review-003 candidate. Q2 must validate the revised candidate.
- **Package:** `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt; Downloads copy.
- **Next owner:** the Architect (review 004), then Tony (commit and `qa/frontend-apbm-0001`). Claudy then records the release of checkout writes; Cody accepts and starts Q1.
- **Pending:** Q1 plan, Lead approval, Q2 release, Gate Q. Gate D is not in scope.
