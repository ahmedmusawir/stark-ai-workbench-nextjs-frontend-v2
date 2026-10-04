# Engineer procedure — one continuous authorized build interval

Read repository root instructions, then this module's START_HERE, GOVERNANCE, RULINGS_ADDENDUM, APP_BRIEF, DATA_CONTRACT, FILE_SCOPE, ACCEPTANCE_SPEC, BUILD_PLAN, KNOWN_LIMITS, DESIGN_RECONCILIATION, and DESIGN/UI_SPEC + COMPONENT_MANIFEST + TAILWIND_MAPPING. Read QAM_ENTRY/manifest/preflight to understand required factual outputs, without adopting the QA role. Declare Engineer seat and actual entry files read.

## Entry preflight (bounded, not another full recon)

Record path, sanitized origin, branch, full HEAD and short status. Expected repo is stark-ai-workbench-nextjs-frontend-v2 and branch frontend-apbm; evidence HEAD is 20ef380bdd6eed5e111d953d6404992add7a88a6. Compare relevant product/config/package files against that baseline. Existing documentation/log changes and intentional response deletions are allowed to remain; inventory them separately. Do not pretend a dirty tree is clean. If product changed, summarize exact drift and stop before adopting an obsolete build contract.

Read the actually affected files and their consumers/imports. Confirm active globals.scss, manifest projection and existing service callbacks. Resolve new file ownership and test commands. This is implementation planning within the frozen scope, not permission to redo data architecture.

Confirm Node/npm and existing dependency availability, typecheck/Jest baseline, production build prerequisites (including Inter font access), browser executable and a free loopback port owned by this run. Do not kill someone else's process. Bound a failed environment attempt to one diagnostic retry; no prolonged permission/network loops. Record command, result and smallest remedy. Continue independent safe work when a blocker affects only one verification, but do not claim completion or QA readiness until mandatory checks have evidence.

No live service requests are authorized for these checks. Inspect scripts first; use test-only fixture configuration/seams and a fail-closed external-request policy. Never dump environment values. If the app cannot boot without live calls, use the isolated test harness described in BUILD_PLAN and report the real-app integration limit.

## Execute

Follow BUILD_PLAN, use installed dependencies and preserve protected files. There is no planned per-screen Director approval; the visual lock is already supplied. Maintain EXECUTION_LOG with actual timestamps, decisions, allowed changed-file list, self-check commands and deviations. Produce implementation and tests together. No arbitrary parallel writes to the shared checkout.

Compare scoped screens with DESIGN previews, test functionality and mocked service bindings, then run typecheck, relevant regression suites and a full Jest comparison. Run build when prerequisites permit. A build/environment failure is explicit BLOCKED, not automatically inherited PASS. The known obsolete lint command is separately documented, not repaired by a toolchain upgrade in this module.

## Finish in the same assignment

Fill QA_HANDOFF, QAM_MANIFEST facts, BASELINE_CHECK, changed-file/source inventory, self-check matrix and safe evidence. Leave independent plan/approval/certification pending. Export one indexed engineering return per QA_HANDOFF. Update repository reporting/session/recovery/changelog per applicable logging instructions. Give Tony exact selective staging guidance and the future QA entry path. Do not commit, open QA branch, start QA or fill Gate Q yourself.

Stop for wrong repo/branch, material product drift, contradiction affecting acceptance, necessary protected edits, missing access that prevents required proof, accidental external traffic or sensitive capture, candidate contamination/concurrent writes. Give one report containing finding, affected ACs, evidence, owner and smallest decision. Routine implementation choices inside the contract do not require another prompt.
