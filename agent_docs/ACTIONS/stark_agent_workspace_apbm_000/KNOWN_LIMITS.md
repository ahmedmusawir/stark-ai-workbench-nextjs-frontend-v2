# Known baseline limits and phase ownership

This is a narrow UI phase, not a declaration that the current app is secure or production-ready. Never mark the following fixed based solely on designed error states.

| Evidence | Phase-000 disposition | Required later owner/gate |
|---|---|---|
| Multi-session code already present; messages keyed per agent and global request flags | Preserve integration; test new presentation state separation with fixtures; do not certify real race isolation | APBM_001: full conversation-key/request-generation hardening |
| Run/history accept client user_id without server-bound ownership in source | Preserve page guard; add no auth bypass; no public/shared release certificate | APBM_001 server identity; direct ADK access boundary before shared release |
| Catalogue index lacks backend dimension; deployed RLS/schema unknown | No schema change or live metadata test in 000 | APBM_001 schema/RLS verification and scoped migration if authorized |
| History/index errors collapse to empty; run error sentinel; broad 404 recreate/retry | New typed views support intended states, legacy adapter limitations explicit; no live calls in 000 | APBM_001 error contract, no blind resend/recreate, metadata recovery |
| Native run source snake_case; cloud probe camelCase succeeded | Do not infer incompatibility; preserve connector | APBM_001 integration tests decide actual needed change |
| Active env alias resolved loopback; configured roster Hermes-oriented | Preserve target and IDs; mock different rosters for UI | APBM_001 explicit cloud config activation and named second-target qualification |
| Instructions service shares live chat flag and can use GCS | New mock context detached; no live instructions service import/call | Actual ingestion/personality work separately scoped, not 001 by default |
| Legacy pointer/logout/reset weaknesses | Newly introduced demo/draft state has clear/reset boundaries; legacy durable state still unqualified | APBM_001 lifecycle tests |
| Edit/regenerate only truncate local history | Remove those controls from refreshed UI | No edit/regenerate backend feature in this pilot |
| 26 pass / 10 fail Jest suites; 225 pass / 38 fail tests in original recon | Compare fresh baseline; repair relevant touched fixture assumptions, not all unrelated legacy tests | QA Lead individually adjudicates retained baseline failures |
| Old npm lint uses unavailable next lint; no usable Playwright suite/browser at initial recon | Add explicit workspace Playwright setup using existing dependency; record lint as known unqualified, not green | Toolchain fix separate scope if needed |
| Original build blocked Inter download; audit blocked DNS | Recheck real readiness; do not change fonts/deps silently or mark blocked checks PASS | Environment owner resolves build access; no audit assurance inferred |

A retained inherited test failure requires exact test name, baseline reproduction or trustworthy immutable baseline result, unchanged mechanism/dependency scope, no impact on a phase-000 AC, and Lead acceptance. Failures in touched behavior must be resolved or become explicit blockers. A vague label “old tests” is not enough.

No live agent requests, database reads/writes, logins, account creation, GCS actions or cloud mutations are authorized in 000. Existing production path is preserved for later authorized use, not exercised blindly during QA. No secure shared deployment or all-ADK compatibility claim at closeout.
