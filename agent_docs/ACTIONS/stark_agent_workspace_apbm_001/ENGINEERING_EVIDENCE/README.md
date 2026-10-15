# Engineering evidence (Engineer-owned)

> **Current status (2026-10-15, Asia/Dhaka) — read first.** Claudy, Engineer facts only.
> - **State:** ENGINEERING_COMPLETE with the Architect's AC025 origin correction applied (engineering attempt 003). Returned as `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt (SHA-256 in the receipt). Reviews 001–003 are kept unchanged.
> - **Candidate:** pending Tony's commit on `frontend-apbm-0001` (HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` = baseline). Identity: `attempt-003/changed-paths.json` and `candidate.patch`. Versus review 003, 1 product file and 3 test files changed (`correction.patch`).
> - **Next action:** the Architect reviews review 004. Then Tony commits the revised candidate and creates `qa/frontend-apbm-0001` at that SHA; Claudy records releasing checkout writes; Cody starts Q1. None of these has happened.
> - **Live evidence:** the attempt-002 live walk (16/16) belongs to the review-003 candidate only, and was not repeated (engineering budgets exhausted). Independent Q2 must validate the revised candidate.
> - **Release prerequisite (Architect):** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
> - **Pending, not Engineer-owned:** Q1 plan, QA Lead approval, Q2 release, Gate Q. Gate D is not in scope.
> - Everything below is dated history, kept as written, including the issued template text (e.g. "not started" / "pending"), the 2026-10-14 blocked state and both timestamp-correction disclosures.

Owner: Claudy. The QA lane is `QAM/`; nothing here is independent QA evidence.

- `attempt-001/verification/`: baseline and final command logs, plus `SUMMARY.txt` (cwd, versions, exit codes) and real-runtime negatives (0 ADK requests).
- `attempt-001/browser/`: Playwright JSON results and screenshots from `tests/workspace/apbm001.config.ts` (synthetic fixture only).
- `attempt-001/live/`: live-walk ledger. Attempt 001 = STOP-AUTH, zero requests.
- `attempt-001/changed-paths.json`: working-tree candidate inventory before Tony's commit (path, git status, role, bytes, SHA-256).
- `attempt-002/live/`: live walk attempt 002 (2026-10-15), 16/16 PASS. Ledger, A/B transcript-region screenshots, filtered server log tail.
- `attempt-002/changed-paths.json`: candidate inventory at review 003 (product+test identical to attempt-001).
- `tools/apbm001_live_walk.cjs`: bounded live-walk helper (engineering budget enforced fail-closed; credential values never written).

- `attempt-003/verification/`: Architect correction (AC025). `00` red run against the review-003 code, `01` Jest, `02` tsc, `03` `next dev` origin probes, `04` build, `05` `next start` origin probes, `06` Playwright, plus `SUMMARY.txt`.
- `attempt-003/browser/`: Playwright JSON and screenshots for the revised candidate (`APBM001_ATTEMPT=attempt-003`).
- `attempt-003/candidate.patch`, `correction.patch` (review 003 → 004) and `changed-paths.json`: identity of the revised candidate.

Later attempts go in new `attempt-NNN/` folders; earlier attempts are kept.
