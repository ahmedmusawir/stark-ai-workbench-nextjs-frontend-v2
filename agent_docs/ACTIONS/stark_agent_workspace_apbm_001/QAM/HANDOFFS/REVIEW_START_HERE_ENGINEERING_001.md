# APBM001 engineering review 001 — start here

**Phase and state:** engineering pass 2, attempt 001. **ENGINEERING_BLOCKED, live walk only (STOP-AUTH).**
- Implementation is complete and self-verified on fixtures, build and runtime negatives.
- The one bounded real-app live walk did not run: no `.env.qa.local` and no interactive sign-in. **0 live requests.**

**Prepared by:** Claudy (Engineer, checkout owner), 14 October 2026, about 19:50 Asia/Dhaka. Tony retains Git. Cody's QA plan, approval, results and certification are untouched and pending.

## Decisions requested

1. **Tony, login path.** Either create the ignored `.env.qa.local` (exactly `APBM001_QA_EMAIL`, `APBM001_QA_PASSWORD`), or agree to an interactive sign-in. Claudy then runs the bounded engineering live walk once and returns review 002. The alternative is to commit without engineering live evidence; Q2 then carries AC011/AC012 alone.
2. **Tony, commit.** Commit the candidate on `frontend-apbm-0001` (inventory: `ENGINEERING_EVIDENCE/attempt-001/changed-paths.json`), then create `qa/frontend-apbm-0001` at that SHA. Claudy then records the release of checkout ownership.
3. **Architect, review.** Review the implementation and claim matrix (`ENGINEERING_REPORT.md` §4). There are two small rulings:
   - (a) deployment packaging boundary for `agent_docs/`: none exists today;
   - (b) whether to remove the now-unused `GetHistoryResponse` type. No deletion has been done.

## Identity

- Repo `stark-ai-workbench-nextjs-frontend-v2`, branch `frontend-apbm-0001`.
- Execution HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`, which equals the reviewed baseline.
- Candidate: pending commit, defined by `changed-paths.json` and `candidate.patch` (36 source diffs: 16 product, 20 test/instrument).
- Contract: the issued ACCEPTANCE_SPEC, DATA_CONTRACT and RULINGS_ADDENDUM bytes, unchanged.

## Verification summary (Engineer — not independent QA)

| Check | Result |
|---|---|
| Baseline before changes | Jest 40 suites / 290 tests passed; tsc 0 |
| `npx jest --ci` | 44 suites / 422 tests passed |
| `npx tsc --noEmit --incremental false` | exit 0 |
| `npm run build` (Next 16.2.6) | exit 0 |
| `npx playwright test --config tests/workspace/apbm001.config.ts` | 50/50 (existing workspace regression, updated for superseded semantics, plus APBM001 browser checks; synthetic fixture, real Chromium) |
| Real `next start` negatives | 401/403 before upstream on every agent route; `/chat` → 307; 0 ADK requests |
| Live walk | STOP-AUTH, 0 requests (budget 0/2 · 0/2 · 0/3 · 0/30 · 0/4) |

## Reading order

1. `ENGINEERING_REPORT.md`: what changed, AC claims, commands, contract migration, consumers, journal format, limits, rollback.
2. `QAM/QAM_MANIFEST.md`, `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`, `QAM/QAM_STATE.md`: factual QAM handoff.
3. `EXECUTION_LOG.md`, `RETROSPECTIVE.md`: timeline and lessons.
4. `ENGINEERING_EVIDENCE/`: `changed-paths.json`, `candidate.patch`, `verification/*`, `browser/*`, `live/*`, `tools/apbm001_live_walk.cjs`.
5. Frozen inputs for reference: `ACCEPTANCE_SPEC.md`, `DATA_CONTRACT.md`, `RULINGS_ADDENDUM.md`, `GOVERNANCE.md`, `ENVIRONMENT_AND_EFFECTS.md`, `KNOWN_LIMITS.md`, `FILE_SCOPE.md`, `BUILD_PLAN.md`, `EVIDENCE/PROVENANCE.json`, `QAM/GOVERNING/PROVENANCE.md`.

## Limits carried

- Restart durability is unproven.
- The ADK origin is unauthenticated; frontend fixes protect only the frontend path.
- One live target and agent.
- Recency is by creation order only.
- Recovery is same-browser only.
- Rename/archive are deferred.
- No deployment or Gate D.

FILE_INDEX.json lists every other member with its source path, purpose, bytes and SHA-256. The receipt beside the ZIP hashes the finished archive.
