# APBM_000 engineering return — corrected attempt 002

**Next owner: Tony.** Review the candidate and inherited-failure evidence, selectively commit the approved scope, then give independent QA the committed identity for Q1 via `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AGENTS.md` on intended `qa/frontend-apbm-000`. QA Lead must independently adjudicate 37 retained baseline test failures. Q2/plan approval and Gate Q are not issued.

Outcome: Engineering build and self-checks complete; **uncommitted QA candidate**, not certification. Actual branch `frontend-apbm`; baseline/current HEAD `20ef380bdd6eed5e111d953d6404992add7a88a6`. The dirty source is identified by evidence/engineering-attempt-001/candidate-scope.json, not by HEAD alone. Product source is included at repository-relative paths for review, together with a complete product patch. This is a return package, not a standalone runnable checkout.

Read in order:
1. QAM/HANDOFFS/QA_HANDOFF.md — changes, actual evidence, limitations and next decisions.
2. ACCEPTANCE_SPEC.md, DATA_CONTRACT.md, RULINGS_ADDENDUM.md, GOVERNANCE.md, FILE_SCOPE.md, KNOWN_LIMITS.md — frozen scope and authority.
3. evidence/engineering-attempt-001/ENGINEER_AC_CLAIMS.md — Engineer claims only; AC000-24 not run.
4. evidence/engineering-attempt-001/INHERITED_FAILURES.md and jest-comparison.json — exact 37 retained failures, before/after diagnostics, zero new failures. Full Jest: 250 pass / 37 fail; baseline 225 / 38.
5. evidence/engineering-attempt-001/REPRODUCTION.md — commands, installed Chrome, isolated fixture/network policy, screenshots and bounds.
6. evidence/engineering-attempt-001/changed-source-inventory.json, product.patch, candidate-scope.json and protected-file-equality.json — 28 changed source/test/script files; 191 preserved inputs unchanged.
7. BASELINE_CHECK.md, EXECUTION_LOG.md, QAM/QAM_MANIFEST.md, evidence/engineering-attempt-001/SELECTIVE_STAGING.md — factual intake; QA writes its own plan.

Build and TypeScript passed; targeted Jest 57/57; Playwright 33/33 including all 18 required viewport/theme renders. Failures from earlier implementation iterations are retained, not hidden. No live model/service/account/history request was made. Real page authorization, multi-user ownership, ADK durability, metadata error semantics, endpoint switching and legacy recovery remain APBM_001/release work. Demo context is fictional, in-memory and disconnected from agent context.

Design dependency: existing `DESIGN/` in the supplied module, sourced from `STARK_AGENT_WORKSPACE_DESIGN_RETURN_v1_0.zip`, SHA256 `77d1b42698219470fc4e3a0c0427927683bdb34e5888cd9abd60a430812895c1`. This package references that separate Designer return rather than recursively copying it. The fixture uses its local Inter assets; QA needs the supplied design alongside the reviewed checkout. No credential or environment file is included.

FILE_INDEX.json is the explicit membership list with purpose, original source path, bytes and SHA256; it omits its own hash. The separate receipt validates archive SHA/CRC. No archive is nested. Screenshots contain synthetic fixture data only. Build/log captures remove real environment values; obsolete test-only bearer literals were redacted from exported diagnostics and ANSI escapes removed. Source copies are unchanged; no source secret was found requiring redaction.

Recorded 2026-10-04T22:02:02.890699+06:00. No Git mutation, dependency change, live backend call or independent QA verdict was performed by Engineer.

Director requested the handoff body under QAM/HANDOFFS. Return 002 reflects that documentation correction; original source/test evidence and return 001 are retained. The root QA_HANDOFF.md is only a compatibility pointer.
