# APBM_000 — Q2 attempt 001 Lead disposition

Issued: 7 October 2026, Asia/Dhaka. Owner: JARVIS, independent QA Lead.

**Decision: RETURN FOR BOUNDED REPAIR AND QA EVIDENCE COMPLETION. Gate Q NOT ISSUED. No Q5, merge or closeout yet.**

Product candidate: `f21564cacb563ecddbf78b1685086c9489bf1c26`.
Reported execution HEAD: `c4ed7042fa05fa638bdc6d4327ecba3448d44cef`.
Effective approval: unchanged plan v0.2 plus Lead roster approval dated 7 October and Architect amendment dated 5 October.

## Evidence reviewed

The Q2 ZIP contains 268 indexed members plus its index. All 268 sizes and SHA256 hashes match. Reviewed the entry/report, AC matrix, Director release, findings, identity gate results, raw test results, relevant QA source and instrument changes, build logs, diagnostic results, teardown, and a mobile conversation screenshot. This is an exported-evidence review, not a new run or live repository inspection. The archive does not provide the complete product/design tree; Engineer must verify proposed mechanisms against source before repair.

Raw results confirm full Jest 286 passed / 1 failed / 287; QA Jest 27/28; final QA browser body 24/29; secondary Engineer copy 33/33. The targeted browser diagnostic is **1 passed / 2 failed**, not two completed passing tests. S-18 reached some useful assertions but failed before the visible-focus checks. Typecheck reports exit 0. Pre/post identity gates report Q2_0_PASS and unchanged product bytes. The revised Director release is recorded; D4 ALLOW and D7 OMIT remain in force.

These results establish useful progress and concrete defects. The secondary suite's 33/33 does not replace failed or missing independent coverage.

## Product findings — Lead classification

| Finding | Decision | Required outcome / owner |
|---|---|---|
| F01: no-storage sign-out stalls | Confirmed Medium, acceptance blocker, AC000-13. Class-C deferral is invalidated for this candidate. | Architect scopes, Cody repairs. Successful logout must not leave navigation stranded because local reset throws; preserve clearing/isolation of user and demo state. Cover the real store when storage is unavailable and normal-storage behavior. |
| F02: focus after drawer-to-desktop transition | Confirmed Low, acceptance blocker, AC000-17. Raw results show All agents rather than the current agent. | Restore focus to the visible current navigation item with a sensible fallback when none exists. Verify actual selector/close-order mechanism in source. |
| F03: Agents breadcrumb target | Confirmed Low, acceptance blocker, AC000-17. Measurements show 40×44 at 375px in three views. | Meet the agreed ≥44×44 target without layout overflow or unrelated style changes. |
| F04: maintained bundle assertion lost | Substantiated Low, test-coverage regression; return to Architect under the existing manifest-test coverage condition. | Recommend restoring explicit maintained assertions for v1/v2-local and their env-variable names, while keeping roster flexibility. QA's disposable assertion is useful evidence but does not restore maintained coverage. Do not reinstate the obsolete Hermes agent list. |

F01 is evidenced by the production entry callback with the real chat store and a mocked successful logout. It does **not** prove server logout or token revocation failed. The report's claim about real server logout succeeding exceeds this offline test's scope. The absent `/auth` push and storage exception are the demonstrated failure.

Prefer a small phase-000 repair at the new entry boundary if it can satisfy navigation AND state clearing. Do not silently catch errors while retaining prior-user state. A protected chatStore modification needs explicit Architect scope; it is not authorized merely by this review. After repair, any retained underlying class-C failure requires a fresh non-impact disposition, never automatic restoration of the waiver.

Potential repair paths for Architect confirmation: WorkspaceEntry.tsx, Workspace.tsx, the scoped chat workspace.scss, and src/__tests__/config/manifest.test.ts, plus focused Engineer regression tests. No configuration reversal, backend/API/auth/schema redesign, dependencies or unrelated cleanup.

## Build — environment/instrument blocker, not an established product defect

Two build attempts failed in Turbopack's font-resolution path using the QA mocked-font input, first with files outside the project and then after relocation. The raw error is inability to resolve the internal Google-font module. This establishes that the attempted QA build arrangement failed; it does not establish that Next/Turbopack has no compliant build route or that the product cannot build normally.

The exported controls support namespace confinement and bounded font retrieval. No successful forbidden service call is demonstrated. Do not broaden egress or use an open proxy to obtain a green build. Font permission already exists; do not ask Tony to grant it again.

Architect should choose one concrete, supported build route, preferably preserving product source, font identity and normal build semantics. If a local-font production change is proposed, explicitly identify the product paths and wider theme impact; a QA-only font substitution is not automatically equivalent production proof. If the route needs a changed QA access policy, present its exact enforcement and required permission to the Lead before execution. A supervised environment alone is not an enforcement specification.

No third build attempt under attempt 001. Return the selected route, diagnosis and bounded next-attempt plan for Lead approval. A successful production build and build-output separation scan remain mandatory. Existing Engineer build claims cannot replace them.

## QA instrument defects and AC corrections

1. **Exact-origin browser guard and page-error capture were opt-in.** In `_qa.ts` both are inside the non-auto `errors` fixture. Fix both to activate for every applicable test before page navigation; keep the OS namespace and Node guard. Make request/error ledgers per-test. Demonstrate a deliberate off-origin request is caught by the browser policy, rather than treating a namespace/DNS failure as proof of browser interception. Retain actual unexpected errors and traffic as findings. This is a process/coverage defect; it is not evidence that live services were reached.
2. **Harness sibling contaminated viewport and screenshots.** The inspected 375px conversation image includes the unrelated Sibling heading/input above the workbench and a composer clipped at the lower edge. S-06's diagnostic without the sibling supports an instrument cause. Keep the sibling for the dedicated scope-isolation test, but remove it from normal viewport/render tests without changing product layout. Recreate the required clean render matrix and composer-reachability measurements. Do not fix this by changing product CSS to accommodate QA furniture.
3. **S-18 remains incomplete.** Correct the desktop hidden-trigger oracle and test status in a state that actually presents status. Execute keyboard-visible focus and measured contrast in both themes, including the declared detector checks. Source CSS and a partial diagnostic are insufficient.
4. **Repair QA tests without erasing findings.** Preserve original failures and exact tool diffs/hashes. Keep F01/F02/F03 assertions. Isolate and clean up the real-store test's React root and rejection listeners; use deterministic completion checks where possible. Do not replace the real store with a passing reset spy.

Lead grades controlling this return:

| AC | Disposition |
|---|---|
| AC000-13 | FAIL — F01. |
| AC000-17 | FAIL — F02/F03. |
| AC000-22 | FAIL on QA regression, with production-build proof also BLOCKED. A build-only BLOCKED label must not obscure failed mandatory tests. |
| AC000-12 | BLOCKED for complete qualification — required browser-policy control missing; keep successful action/source evidence. |
| AC000-16 | BLOCKED for clean visual/viewport proof — retain metrics but replace contaminated render evidence. |
| AC000-18 | BLOCKED — required dynamic visible-focus proof not executed. |
| AC000-20 | BLOCKED — production build/output scan missing. |
| AC000-24 | NOT RUN — Lead certification pending. |

Other successful evidence is retained for risk-based reuse, not erased or promoted into a final certificate. S-06's clean diagnostic is useful supporting evidence; repeat its reachability check in the corrected normal harness. F04 remains open until Architect disposition. The date-format observation O-1 needs comparison to the actual current visual/text requirement; do not declare a product defect from a screenshot sample alone or add an unsolicited redesign.

## DIRECTOR-OBS-001

Keep **UNTRIAGED for the live cause**. Mocked A+B catalog, reopen-A, fresh-mount and metadata-warning checks passed. This narrows the investigation but does not identify the existing catalog service as the most likely culprit: mocks cannot rank live write/list, identity, timing, API or environment causes. Not seeing a reported warning is not evidence that no warning occurred. No live diagnostic is authorized or needed to complete the existing phase-000 repair scope. A separate bounded diagnostic can be scoped later if Tony requests it.

## Process disposition and next steps

- Attempt 001 is closed to further execution. Preserve its complete history. The startup failure executed zero tests and is not a third full browser body. The two executed full bodies remain counted. Targeted diagnostics are supplemental partial evidence, not a reset of retry limits or a clean process pass. Before the next attempt, reconcile the retry ledger by instrument, including the repeated escape-control crash and follow-on browser corrections; do not retroactively label every rerun compliant.
- Reported runtime teardown is accepted as evidence; it is not Q5 cleanup. The prior .next production output was removed by failed builds and BUILD_ID is absent. No restored build or clean runnable production state is claimed.
- Two RESPONSES docs were included in the instruction commit despite selective-staging guidance. Preserve Git history; record the placement/staging deviation without treating it as product drift. All new QA records remain in QAM. Root-pointer housekeeping stays with the Architect/Cody authorization.
- Architect returns one bounded repair scope and build route. Cody implements only that authorized product/test scope with regression evidence and changelog. Tony controls commits. Claudy may prepare only the listed QA instrument corrections and records while holding execution; coordinate one writer at a time.
- Lead then binds the actual repaired full SHA and effective retest plan. Do not extend the existing f21564c release silently to product changes. Preserve D4/D7; any necessary revised-candidate confirmation should be consolidated after the concrete repaired candidate is ready.
- Next retest must cover repaired findings, complete browser guard/error capture, clean required renders, focus proof, typecheck, full Jest, independent QA suite, affected secondary suite, successful production build/separation scan, protected equality and teardown. Determine reuse and exact retry budget from the final repair diff. No unbounded reruns.
- Retain durable evidence before any later cleanup. The ZIP's suggested staging-paths file is not included in this export, so the Lead cannot approve its exact current membership. Claudy must provide an explicit status/hash staging list, excluding RESPONSES, caches, disposable font copies and recursive/duplicate archives. Do not blindly commit the entire QAM tree. Do not delete evidence before disposition/retention is complete.

This record authorizes the bounded QA preparation above, not product implementation, live access, new acceptance execution, Q5, Gate Q, merge or deployment. Next decision owner: Architect for repair/build scope; QA Lead for subsequent candidate/retest binding.
