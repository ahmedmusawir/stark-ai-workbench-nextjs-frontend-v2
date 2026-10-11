# Cody engineering repair 001 — execution log

Date: 2026-10-08. Engineer seat only. Authority: `../../HANDOFFS/ARCHITECT_ENGINEERING_REPAIR_001_2026-10-08.md`. Tony confirmed Claudy paused and Cody owns the writer slot before any edits. The current explicit repair instruction replaces obsolete launch/approval/baseline requirements for this bounded repair.

## Approved implementation plan

1. Record actual checkout, product equivalence, dependency drift, missing Lead disposition and original Q2 findings. Preserve inherited changes/evidence.
2. Add real-store entry regressions for sign-out under getter/write/normal storage; prefer an entry-boundary repair if clearing and navigation are proven. Limit any store change to necessary storage/reset semantics.
3. Use one ordered, visible current-navigation focus resolver for breakpoint closure and modal return focus; retain normal mobile close behavior. Add maintained regression coverage.
4. Add mobile breadcrumb minimum width 44px, independently assert both bundle URL mappings, and retain configurable rosters/validation.
5. Verify local cached seven WOFF2 hashes against Q2 mediator, preserve exact declarations and fallback metrics, license/provenance, then wire ordinary production CSS fonts. No network retrieval unless the existing enforced font-only route is needed; no QA font-mocking build.
6. Run focused and full maintained Jest, typecheck, and offline engineering UI/font checks. Retain commands/exits/results here. Independent production build/output scan remains for the next Lead-approved QA attempt.
7. Update changelog and canonical handoff, write return, exact patch/hash/inventory and explicit selective staging paths. No Git mutation, QA instrument edits, certification or closeout.

## Entry files read

Repository `CLAUDE.md`; module `AGENTS.md`, `ENGINEERING_ENTRY.md`, `START_HERE.md`, `GOVERNANCE.md`, `RULINGS_ADDENDUM.md`, `APP_BRIEF.md`, `DATA_CONTRACT.md`, `FILE_SCOPE.md`, `ACCEPTANCE_SPEC.md`, `BUILD_PLAN.md`, `KNOWN_LIMITS.md`, `DESIGN_RECONCILIATION.md`, design UI/spec/component/mapping files; QAM `AGENTS.md`, `CLAUDE.md`, `QAM_ENTRY.md`, manifest/preflight/test plan, execution report, original F01–F04, canonical handoff, 7 October roster return and mediator/evidence. Astra recovery/session notes were loaded at session start. All QA/repair records for this task stay inside QAM; root CHANGELOG update is explicitly requested.

## Initial observations

- Branch `qa/frontend-apbm-000`, HEAD `9c50884d4c4513b6969311d5be7c05828104ed3d`.
- Initial dirty tree: only ` M package-lock.json`. Preserve and exclude from proposed staging.
- No committed product drift from reviewed candidate `f21564cacb563ecddbf78b1685086c9489bf1c26` to starting HEAD. Successors after execution HEAD are documentation/evidence commits `24ccf307ba04460f0d9663e4ce1c71984d58e369` and `9c50884d4c4513b6969311d5be7c05828104ed3d`.
- Original findings and attempt-001 evidence are present. A post-Q2 7 October Lead disposition was not found in the checkout, handoff ZIPs, Downloads, or old checkout path (absent). The 7 October Lead roster approval is pre-Q2 authority, not that disposition. Do not invent a ruling or retest approval. This task's supplied Architect instruction authorizes implementation independently.
- Original mediator disposable output/raw CSS is absent in searched paths. All seven exact WOFF2 bytes survive in `.next/dev/static/media`; generated font CSS survives with seven ranges, normal variable 100–900, display swap and established Arial fallback metrics. Designer `assets/OFL.txt` is available. Further declaration/provenance validation follows before product copying.
- Actual installed Node v24.15.0, npm 11.12.1, Next 16.4.0, Zustand 4.5.4. Historical Q2 used Node v26.7.0/Next 16.2.6. Existing lockfile drift is not this repair's dependency work.
- Initial `unshare -rn true` probe returned 1 (`Operation not permitted`) inside the sandbox. No network/QA attempt was started.

## Exact authorized edits (before implementation)

- `src/components/workspace/WorkspaceEntry.tsx`: sign-out boundary.
- `src/components/workspace/Workspace.tsx`: drawer focus target/order only.
- `src/app/(cyberize)/chat/workspace.scss`: mobile breadcrumb target only.
- `src/__tests__/config/manifest.test.ts`: independent bundle assertions.
- Maintained new regressions under `src/__tests__/workspace/` and/or `tests/workspace/`.
- If needed: `src/store/chatStore.ts` storage/reset only; prefer avoiding this when entry proof suffices.
- `src/app/layout.tsx`: font import/class only; `src/app/fonts/inter.css`, `src/app/fonts/inter/`: exact verified fonts/license/provenance.
- `QAM/HANDOFFS/` repair instruction/return/canonical handoff; `QAM/evidence/engineering-repair-001/` evidence and logs; root `CHANGELOG.md`.

No changes to original findings, attempt-001 evidence, acceptance, independent QA assertions/instruments, manifest JSON/roster, auth/API/services/schema or dependencies are authorized by this plan.

## 2026-10-08T05:09:48.579424+00:00 — COMPLETE (engineering only)

- Verbatim authority and writer confirmation saved before edits. Interrupted permission request launched no test process; resumed under updated approval review.
- Seven cached WOFF2 hashes matched Q2; original CSS recovered with the existing enforced font-only mediator. Sandbox DNS exit 1, one supported approved retry exit 0; all eight source hashes identical. No QA font hook used for a build.
- Fresh baseline full Jest 286 pass/1 fail. Corrected pre-repair real-store regression reproduces write-failure/no-navigation. Entry repaired; chat/auth stores unchanged.
- F02 restoration now belongs to modal close-autofocus, visible current item first; F03 44px mobile minimum; F04 literal mappings.
- Final focused 64/64, full 290/290, tsc exit 0, browser 27/27. Browser repeated after isolating probe-only styles. Setup/typecheck iterations and baseline-only intermittent failure retained; no independent QA instrument edits.
- All 18 product/test paths, binary/text patch/hash, protected equality, missing-disposition audit, return and selective staging records under QAM. Existing lock diff/historical records preserved.
- Production build/output identity/separation scan NOT RUN; next Lead-approved independent attempt owns them. No repaired commit SHA, Gate Q, Q5 or closeout.
