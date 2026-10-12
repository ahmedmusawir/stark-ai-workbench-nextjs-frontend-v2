# Architect-authorized engineering repair 001 — 8 October 2026

Authority: Tony's instruction in this session, attributed to JARVIS (Architect). Cody is Engineer; Claudy is independent QA Engineer. Recorded verbatim below. This is repair authority, not a reconstructed QA Lead disposition, retest approval, or certificate. Tony subsequently confirmed: “Claudy is paused; Cody has the writer slot”.

## Verbatim instruction

Cody — you are the ENGINEER for Stark Agent Workspace APBM_000.
Claudy is the independent QA Engineer. JARVIS is the Architect.

Implement the following Architect-authorized bounded repair.
You handle placing this instruction and your records in the repo;
Tony should not need to create or move documentation manually.

START HERE

Read the applicable repository instructions and:
agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/

Locate the QA Lead’s 7 October disposition and original Q2 findings.
If required evidence is missing from this new checkout, identify it
precisely. Do not invent missing approvals or reconstruct test results.

Record this prompt as a dated Architect repair instruction inside:
QAM/HANDOFFS/

All paths below are relative to the module unless otherwise stated.
ALL QA-related records belong inside QAM/. Nothing QA-related belongs
at the APBM root.

CHECKOUT AND OWNERSHIP

- Verify the current branch, full HEAD SHA and working-tree status.
- Expected branch: qa/frontend-apbm-000.
- Reviewed product candidate:
  f21564cacb563ecddbf78b1685086c9489bf1c26
- Reported Q2 execution HEAD:
  c4ed7042fa05fa638bdc6d4327ecba3448d44cef
- Account for subsequent commits and local changes.
- If additional product changes affect this scope, report their exact
  diff before proceeding with conflicting edits.
- Preserve Tony’s work and intentional deletions.
- Do not switch branches, commit, merge, push or rewrite history.
- One writer at a time: do not edit while Claudy is working.

AUTHORIZED REPAIRS

F01 — Sign-out with unavailable browser storage
AC000-13

Inspect:
src/components/workspace/WorkspaceEntry.tsx
src/store/chatStore.ts

A storage exception during reset currently prevents navigation to /auth.

Prefer an entry-boundary fix if it proves BOTH state clearing and
navigation. A narrowly scoped chatStore change is explicitly authorized
only for the storage handling/reset semantics needed for this defect.

Do not simply swallow the exception while retaining prior-user state.
Do not redesign authentication, store structure, persistence keys,
hydration or session ownership.

Add maintained regression coverage using the REAL store:
- Throwing localStorage getter.
- Storage write failure.
- Normal storage.
- Cleared in-memory user/chat/demo state.
- Navigation after mocked successful logout.
- No unexpected unhandled rejection.

Offline mocked logout does not prove server logout or token revocation.

F02 — Drawer-to-desktop focus
AC000-17

Inspect:
src/components/workspace/Workspace.tsx

Confirm the selector and modal-close ordering.
After resizing an open drawer to desktop, focus the visible CURRENT
navigation item. Use a sensible visible fallback only if none exists.

A selector such as '[aria-current], a' does not prioritize aria-current;
it returns the first matching element in document order.

Verify that later modal-close logic does not override the correct focus.
Preserve normal drawer-close behavior.

F03 — Mobile breadcrumb target
AC000-17

Inspect:
src/app/(cyberize)/chat/workspace.scss

Make the Agents breadcrumb at least 44×44 CSS pixels at 375px in
directory, workspace and conversation views.

Verify no horizontal overflow or unrelated layout/style changes.

F04 — Independent maintained manifest assertions

Inspect:
src/__tests__/config/manifest.test.ts

Restore independent assertions for:
- v1 → ADK_BUNDLE_URL_V1
- v2-local → ADK_BUNDLE_URL_V2_LOCAL

Retain structural validation and configurable agent rosters.
Do not restore obsolete hardcoded Hermes agent IDs.
Comparing two imports of the same JSON is not independent proof.

BUILD ROUTE — EXPLICIT PRODUCT-SOURCE EXCEPTION

The two failed QA builds used mocked Google-font inputs.
Do not repeat that arrangement or claim the product cannot build.

Prepare the normal production build to use committed local copies
of the SAME Inter assets through ordinary CSS @font-face declarations.

Permitted product paths:
- src/app/layout.tsx — font loader/class wiring only.
- src/app/fonts/inter.css — local font-face declarations.
- src/app/fonts/inter/ — verified WOFF2 files, license and provenance.

Preserve providers, metadata and all unrelated root-layout behavior.

First check whether the original seven Inter subset files and CSS from
the Q2 font mediator remain available on this new system. Do not assume
Git transferred disposable or ignored assets.

Verify their recorded hashes, source provenance and applicable license.
Preserve unicode ranges, variable weights, normal style and display
behavior. Preserve current fallback metrics where established.

Do not substitute a different Inter revision, drop non-Latin coverage,
add a font dependency, or import production assets from QAM.

If the exact assets/declarations/license are unavailable, finish the
other independent repairs and report the precise font blocker.
Any retrieval must use the existing approved, enforced font-only route.
No unrestricted egress, open proxy or new live-service access.

The root font change affects other routes too. Record any font/fallback
difference and verify typography/layout through offline checks.
No redesign is authorized.

The eventual independent production build must use the normal installed
toolchain with network denied and no QA font-mocking hook. Its successful
build, output identity and separation scan belong to the NEXT QA
Lead-approved attempt. Do not restart Q2 attempt 001.

ENGINEERING VERIFICATION

Run focused maintained regression tests, the full maintained Jest suite
and typecheck using the repository’s established commands.

Update the existing changelog.
Retain commands, exit codes and relevant output under:
QAM/evidence/engineering-repair-001/

Report failures accurately. Do not reinstate the previous storage-defect
waiver automatically.

Do not change independent QA assertions to make your fixes pass.
Claudy and the QA Lead own the browser guard, screenshot-harness,
visible-focus and QA-instrument corrections.

BOUNDARIES

Preserve:
- Tony’s current remote ADK roster.
- Both bundle/urlEnv mappings.
- Original findings and attempt-001 evidence.
- D4 font-build permission: ALLOW.
- D7 optional Director visual check: OMIT.

No backend/API/schema/auth redesign, dependency changes, configuration
reversal, live diagnostics or persistent multi-session implementation.

Tony’s disappearing-conversation observation remains untriaged for its
live cause. Do not introduce localStorage transcripts as a shortcut.

RETURN PACKAGE

Write:
QAM/HANDOFFS/ENGINEERING_REPAIR_001_RETURN.md

Update the canonical:
QAM/HANDOFFS/QA_HANDOFF.md

Include:
1. Actual starting full SHA, branch and working-tree status.
2. Exact changed-file list and diff.
3. F01–F04 mechanisms, repairs and regression results.
4. Font provenance, hashes, differences and any blocker.
5. Verification commands, exit codes and evidence paths.
6. An explicit proposed staging list for Tony.
7. Remaining work for independent QA.

Exclude RESPONSES files, caches, disposable font copies and recursive
archives from proposed staging. Verified production font assets are
intentional product files, not disposable QA copies.

Until Tony commits, identify the repair by its parent SHA and recorded
working-tree diff/hash. Do not invent a repaired commit SHA.

Finish with a short plain-English report for Tony.
Gate Q remains pending. No certification, Q5 or closeout.

Proceed with the authorized engineering work now.
