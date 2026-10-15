# APBM001 engineering review 004 — start here

**Phase and state:** engineering pass 2, Architect correction (engineering attempt 003). **ENGINEERING_COMPLETE, correction applied.**

**Prepared by:** Claudy (Engineer, checkout owner) on 15 October 2026, Asia/Dhaka. Tony retains Git; nothing is committed. Cody's QA plan, approval, results and certification are untouched and pending. Supersedes review 003 for the corrected candidate. Reviews 001–003 are kept unchanged; their receipts are included.

## Decisions requested

1. **Architect: review the AC025 correction.** State-changing agent routes now accept only an `Origin` exactly equal to a server-configured full origin (scheme, hostname, port). The sources are:
   - `NEXT_PUBLIC_SITE_URL`;
   - the optional runtime `AGENT_TRUSTED_ORIGINS`;
   - loopback at Next's own port under `next dev` only.

   `Host`, `X-Forwarded-*` and `Forwarded` are never read, and no proxy is trusted.
2. **Tony, after the Architect's review: commit.** Commit the revised candidate on `frontend-apbm-0001` and create `qa/frontend-apbm-0001` at that SHA. Claudy then records releasing checkout writes; Cody starts Q1.
3. **Before any deployment (Architect's release prerequisite):** verify that `agent_docs/` and credential files are excluded from the actual deployment input/artifact. Also confirm that the deployed `NEXT_PUBLIC_SITE_URL` equals the public origin exactly; otherwise state changes fail closed with 403.

## What changed since review 003

| File | Role | Change |
|---|---|---|
| `src/app/api/agent/_lib/context.ts` | product | `trustedOrigins()` plus an exact-match `assertSameOrigin()`; no header-derived authority |
| `src/__tests__/api/agent-boundary.test.ts` | test | Unit cases plus, per POST route, 3 legitimate origins and 18 rejections, all with zero upstream and no auth lookup |
| `src/__tests__/api/instructions-route.test.ts` | test | Default origin is now the configured site; 3 new PUT rejections before auth and GCS |
| `tests/workspace/apbm001.config.ts` | instrument | `APBM001_ATTEMPT` picks the evidence folder (default `attempt-001`) |

The other 32 product and test files are byte-identical to review 003. Exact diff: `ENGINEERING_EVIDENCE/attempt-003/correction.patch`. Full candidate: `attempt-003/candidate.patch` and `attempt-003/changed-paths.json`.

## Verification (Engineer, not independent QA)

| Check | Result |
|---|---|
| New regressions against the **unchanged** review-003 code | 36 fail / 95 pass. Both Architect reproductions were accepted by the old code (expected red). |
| Jest, full | 44 suites / 479 tests passed |
| Typecheck | exit 0 |
| Production build | exit 0 |
| `next dev` (port 43192), signed out | 10/10 origin probes as expected; 0 non-loopback traffic |
| `next start` (port 43190, `AGENT_TRUSTED_ORIGINS=http://127.0.0.1:43190`), signed out | 17/17 origin probes plus 2 reads as expected; 0 non-loopback traffic |
| Fixture browser checks | 50/50 (`attempt-003/browser/`) |
| Live walk | **Not repeated.** Engineering login/create/run budgets are exhausted. The attempt-002 live evidence (16/16) is tied to the review-003 candidate; independent Q2 must validate this revised candidate. |

## Architect dispositions recorded

- `GetHistoryResponse`: unchanged; cleanup deferred.
- Roster double-read: unchanged; optimization deferred.
- Deployment exclusion: release prerequisite. No deployment or packaging change was made.

## Reading order

1. `ENGINEERING_REPORT.md`: the current-status block at the top, then the **Architect correction addendum** at the end.
2. `QAM/QAM_STATE.md`, `QAM/QAM_MANIFEST.md`, `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`: current status at the top, then dated history.
3. `EXECUTION_LOG.md`, `RETROSPECTIVE.md`.
4. `ENGINEERING_EVIDENCE/attempt-003/`:
   - `verification/` (`00`–`06` plus `SUMMARY.txt`);
   - `browser/`;
   - the patches and `changed-paths.json`.
5. Earlier evidence, unchanged:
   - `attempt-002/` (live walk, review-003 candidate);
   - `attempt-001/` (pass 2);
   - `tools/`.
6. Frozen inputs: ACCEPTANCE_SPEC, DATA_CONTRACT, RULINGS_ADDENDUM, GOVERNANCE, ENVIRONMENT_AND_EFFECTS, KNOWN_LIMITS, FILE_SCOPE, BUILD_PLAN, provenance.

## Limits carried

- Restart durability is unproven.
- The ADK origin is unauthenticated; frontend fixes protect only the frontend path.
- One live target and agent.
- Recency is by creation order.
- Recovery is same-browser only.
- Rename/archive are deferred.
- Engineering green is not Gate Q; no deployment or Gate D.
