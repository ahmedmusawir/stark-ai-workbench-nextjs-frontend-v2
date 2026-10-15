# Engineering factual manifest — pending implementation

> **Current status (2026-10-15, Asia/Dhaka) — read first.** Claudy, Engineer facts only.
> - **State:** ENGINEERING_COMPLETE with the Architect's AC025 origin correction applied (engineering attempt 003). Returned as `QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_004.zip` plus receipt (SHA-256 in the receipt). Reviews 001–003 are kept unchanged.
> - **Candidate:** pending Tony's commit on `frontend-apbm-0001` (HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` = baseline). Identity: `../ENGINEERING_EVIDENCE/attempt-003/changed-paths.json` and `candidate.patch`. Versus review 003, 1 product file and 3 test files changed (`correction.patch`).
> - **Next action:** the Architect reviews review 004. Then Tony commits the revised candidate and creates `qa/frontend-apbm-0001` at that SHA; Claudy records releasing checkout writes; Cody starts Q1. None of these has happened.
> - **Live evidence:** the attempt-002 live walk (16/16) belongs to the review-003 candidate only, and was not repeated (engineering budgets exhausted). Independent Q2 must validate the revised candidate.
> - **Release prerequisite (Architect):** before any deployment, verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact.
> - **Pending, not Engineer-owned:** Q1 plan, QA Lead approval, Q2 release, Gate Q. Gate D is not in scope.
> - Everything below is dated history, kept as written, including the issued template text (e.g. "not started" / "pending"), the 2026-10-14 blocked state and both timestamp-correction disclosures.

Owner: Engineer. Do not fill independent results.

| Item | Issued fact / required completion |
|---|---|
| Repo and baseline | stark-ai-workbench-nextjs-frontend-v2 at f0fbf2282737ea3a63fc78d553cd31fc570821d5; record actual root/HEAD on execution |
| Candidate | Pending Tony commit; record complete working-tree inventory/hash manifest first |
| Scope | ../ACCEPTANCE_SPEC.md AC001–AC030 with ../RULINGS_ADDENDUM.md |
| Environment | Existing frontend Supabase login; confirmed ADK v1 cloud bundle; exact safe runtime identity checks required |
| Migrations | None authorized or required for this implementation |
| Access | One Director-authorized normal account, interactive or narrow ignored credential helper |
| Changed paths | Engineer must supply all tracked/untracked changed paths with role and rationale |
| Reproduction | Engineer must provide actual install/build/serve/test commands, cwd, runtime versions, ports and prerequisites |
| Self-verification | Engineer must record command/result/count/evidence for every claimed check; no generic green claim |
| Consumers | Engineer must list shared-service callers and deliberate old-contract replacements |
| Live requests | Engineer must attach phase ledger and remaining budget |
| Limitations | Carry ../KNOWN_LIMITS.md plus any observed new issues |
| Rollback | Director may revert implementation commit(s); no cloud/schema rollback required; leave test sessions intact |
| QA entry | QAM_ENTRY.md; actual runtime discovery must be recorded by each seat |

Completion checklist: manifest filled; engineering report and claim matrix; authoritative AC/ruling identities; changed-file evidence; safe packaging validation; missing access honestly marked. Final candidate SHA is resolved from Director receipt/read-only Git during Q1, not guessed before commit.

---

## Engineer facts — Claudy, engineering pass 2, 14 October 2026 19:28–19:33 Asia/Dhaka

| Item | Fact |
|---|---|
| Repo and baseline | Root `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2`; branch `frontend-apbm-0001`; HEAD at execution `f0fbf2282737ea3a63fc78d553cd31fc570821d5` (= baseline) |
| Candidate | **PENDING Tony commit.** Working-tree inventory with SHA-256 per path: `../ENGINEERING_EVIDENCE/attempt-001/changed-paths.json` |
| Scope | AC001–AC030 + R001-01…R001-12, unchanged. No interpretation change requested. |
| Environment | Existing Supabase login (expected ref `rwosuvbufaqwbaukohkk`); live target `ADK_BUNDLE_URL_V1`, greeting_agent; expected greeting `backend_key` `6b99771174a0f203`, derived from the confirmed URL. Not yet observed at runtime because the descriptor requires sign-in. |
| Migrations | None |
| Access | Credential helper file **absent**; no interactive login performed. STOP-AUTH, live walk only. |
| Changed paths | 16 product (12 modified, 4 new); 20 test/instrument (13 modified, 7 new); module docs and evidence; root logs. Detail: `../ENGINEERING_REPORT.md` §3 |
| Reproduction | `../ENGINEERING_REPORT.md` §5. Fixture port 43181; runtime negative port 43190 (stopped); live helper default port 43191 |
| Self-verification | Jest 44 suites / 422 tests passed; `tsc --noEmit` 0; `npm run build` 0; Playwright (apbm001 config) 50/50; 9 runtime negatives OK (0 ADK). Baseline before changes: 40/290 passed, tsc 0. |
| Consumers | `../ENGINEERING_REPORT.md` §6 (old → new mapping, superseded tests, callers) |
| Live requests | Engineering ledger 0/2 logins, 0/2 creates, 0/3 runs, 0/30 reads, 0/4 roster |
| Limitations | KNOWN_LIMITS LIM01–LIM08, plus §11 observations (no deployment packaging boundary, stale `BACKEND_SWAP_NOTES.md`, no lint tooling, role not synced) |
| Rollback | Revert the implementation commit(s); no cloud/schema rollback; no test sessions created in this pass |
| QA entry | `QAM_ENTRY.md`. Engineer static check: module `CLAUDE.md` and `AGENTS.md` are byte-identical (as are the QAM pair). Root `CLAUDE.md` was **not** modified to point at the module, so actual runtime discovery is for each seat to record; the explicit-entry fallback applies. |

Completion checklist:
- manifest filled ✔;
- engineering report and claim matrix ✔;
- AC/ruling identities unchanged ✔;
- changed-file evidence ✔;
- packaging validation in the ZIP receipt ✔;
- missing access honestly marked (STOP-AUTH) ✔.

### Engineer facts update — 2026-10-15 10:24 Asia/Dhaka

| Item | Fact |
|---|---|
| Access | `.env.qa.local` ignored (`.gitignore:28`) and untracked; read to memory by the helper only; values never logged, hashed or packaged. Mode 644 (reported). |
| Environment observed | mode `live`; Supabase ref `rwosuvbufaqwbaukohkk`; greeting `backend_key` matches the confirmed bundle derivation; greeting available, MOOSE unavailable |
| Live requests | Engineering ledger final: logins 2/2, creates 2/2, runs 3/3, reads 10/30, roster 2/4 (`../ENGINEERING_EVIDENCE/attempt-002/live/live-walk-ledger.json`) |
| Self-verification | Live walk 16/16 PASS, in addition to the 2026-10-14 Jest 44/422, tsc 0, build 0 and Playwright 50/50 on the identical candidate |
| Remote state | Test sessions A `d22f9aff-…7ac8` (4 events) and B `7adcba92-…1d42` (2 events) in Tony's greeting_agent namespace, left intact |
| State | ENGINEERING_COMPLETE; candidate pending Tony commit |

### Engineer facts update — 2026-10-15, Architect correction (attempt 003)

| Item | Fact |
|---|---|
| Candidate | Pending Tony's commit. `../ENGINEERING_EVIDENCE/attempt-003/changed-paths.json`; versus review 003, 1 product file (`src/app/api/agent/_lib/context.ts`) and 3 test files (`correction.patch`) |
| Changed paths | 16 product (12 modified, 4 new) and 20 test/instrument (13 modified, 7 new), unchanged in number; contents changed in 4 |
| Environment | New optional server-only `AGENT_TRUSTED_ORIGINS` (comma-separated full origins, runtime). `NEXT_PUBLIC_SITE_URL` must equal the deployed public origin exactly. No `.env*` file was read or edited. |
| Reproduction | `../ENGINEERING_REPORT.md`, Architect correction addendum. A production-mode local run sets `AGENT_TRUSTED_ORIGINS=http://127.0.0.1:<port>` on the server process. |
| Self-verification | Red run 36 fail (expected); Jest 44/479; tsc 0; build 0; Playwright 50/50; `next dev` 10/10 and `next start` 17/17 + 2 origin probes, 0 non-loopback traffic |
| Live requests | None in attempt 003. The engineering ledger is unchanged from attempt 002 (logins 2/2, creates 2/2, runs 3/3, reads 10/30, roster 2/4). |
| Limitations | Carried. Release prerequisite: deployment exclusion of `agent_docs/` and credential files. Deferred: `GetHistoryResponse` cleanup and the roster optimization (Architect). |
| State | ENGINEERING_COMPLETE, correction applied; awaiting Architect review of review 004 |
