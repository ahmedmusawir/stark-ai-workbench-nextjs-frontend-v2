# APBM001 engineering review 003 — start here

**Phase and state:** engineering pass 2. **ENGINEERING_COMPLETE.**
- The live walk blocker from reviews 001/002 is resolved.
- Engineering live walk attempt 002 (15 October 2026, 10:22:13–10:22:56 Asia/Dhaka): **16/16 steps PASS**, inside the engineering budget.

**Prepared by:** Claudy (Engineer, checkout owner). Tony retains Git. Cody's QA plan, approval, results and certification are untouched and pending. Supersedes review 002 for the live addendum; 001 and 002 are kept.

## Decisions requested

1. **Tony, commit.** Commit the candidate on `frontend-apbm-0001`.
   - Product+test are byte-identical to review 002: `ENGINEERING_EVIDENCE/attempt-002/changed-paths.json`, `ENGINEERING_EVIDENCE/attempt-001/candidate.patch`.
   - Then create `qa/frontend-apbm-0001` at that SHA. Claudy records releasing checkout writes; Cody starts Q1.
2. **Tony, remote state.** Two engineering test sessions are left intact in your `greeting_agent` namespace for disposition:
   - A `d22f9aff-4df6-4f3d-9a76-ea79000e7ac8`;
   - B `7adcba92-ff0a-4707-aae4-b15a81801d42`.
3. **Tony, credential file.** `.env.qa.local` is mode 644. Consider `chmod 600`. Deletion timing belongs to the QA Lead's cleanup.
4. **Architect, open rulings carried from 002:**
   - (a) deployment packaging boundary for `agent_docs/`;
   - (b) removal of the unused `GetHistoryResponse` type;
   - (c) new, optional: de-duplicate concurrent cold roster reads (observation h).

## Live walk summary (Engineer — not independent QA)

| Step | Result |
|---|---|
| Target identity (live mode, Supabase ref, greeting key = confirmed bundle, greeting available, MOOSE unavailable) | PASS |
| Create A and B from new drafts (UUIDs, first-message titles, own markers in replies) | PASS |
| Switch A/B twice; reload B; reopen A in a new tab | PASS |
| Continue A (recalls its own marker; earlier turns intact) | PASS |
| Sign out → 401 → sign in (same user) → reopen A (4 turns) | PASS |
| List: A and B present, newest-created first | PASS |

Budget: logins 2/2 · creates 2/2 · runs 3/3 · reads 10/30 · roster 2/4. 0 external requests, 0 page errors.

## Reading order

1. `ENGINEERING_REPORT.md`, especially the **live walk addendum** at the end. Sections §1–§12 are pass 2 as of 2026-10-14.
2. `QAM/QAM_STATE.md`, `QAM/QAM_MANIFEST.md`, `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`.
3. `EXECUTION_LOG.md`, `RETROSPECTIVE.md`.
4. `ENGINEERING_EVIDENCE/`:
   - `attempt-002/live/*` (live ledger and screenshots);
   - `attempt-002/changed-paths.json`;
   - `attempt-001/*` (verification logs, browser fixtures, patch);
   - `tools/apbm001_live_walk.cjs`.
5. Frozen inputs: ACCEPTANCE_SPEC, DATA_CONTRACT, RULINGS_ADDENDUM, GOVERNANCE, ENVIRONMENT_AND_EFFECTS, KNOWN_LIMITS, FILE_SCOPE, BUILD_PLAN, provenance.

## Limits carried

- Restart durability is unproven.
- The ADK origin is unauthenticated; frontend fixes protect only the frontend path.
- One live target and agent.
- Recency is by creation order.
- Recovery is same-browser only.
- Rename/archive are deferred.
- The 24–26 s cold read was not reproduced this run.
- Engineering green is not Gate Q; no deployment or Gate D.
