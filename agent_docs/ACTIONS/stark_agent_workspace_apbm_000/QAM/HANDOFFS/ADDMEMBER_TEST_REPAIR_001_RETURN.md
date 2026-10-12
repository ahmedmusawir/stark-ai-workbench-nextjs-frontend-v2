# APBM_000 — AddMember maintained-test repair 001 return

Cody, Engineer · 11 October 2026 · **Authorized test repair complete, uncommitted. File 7/7, full Jest 290/290, typecheck exit 0. Gate Q pending.**

## Authority, scope and checkout

[Architect authorization](ARCHITECT_ADDMEMBER_TEST_REPAIR_001_2026-10-11.md) records Tony's instruction verbatim. The only edited source file is **`src/__tests__/admin/AddMemberForm.test.tsx`**. The production form, global Jest setup/config, dependencies, independent QA instruments and completed F01–F04/local Inter repair are unchanged.

Starting/current branch: **`qa/frontend-apbm-000`**. Actual starting/current full HEAD and repair parent: **`9c50884d4c4513b6969311d5be7c05828104ed3d`**. The prior repairs and evidence were already dirty/untracked; full entry status and their hashes are in `entry-state.json`. No index change, branch switch, commit, push or merge occurred. There is no repaired commit SHA. Final working status, cumulative product/test diff and inventory hash identify this uncommitted candidate.

Evidence prefix: `QAM/evidence/addmember-test-repair-001/2026-10-11_134025_BDT/`.

## Source-confirmed defect and repair

The original loading test started a 100ms success promise, asserted the disabled button and ended without awaiting the submission. Its pending action could survive unmount and later use the captured shared router mock. Clearing mock history did not complete or cancel that action. This **incomplete test-submission lifecycle is source-confirmed**. The historical unexpected `/admin-portal` callback was **not conclusively traced**; matching failure signatures and the isolated diagnostic pass did not establish its origin.

The bounded repair:

- Replaces the loading timer with a controlled deferred action. It asserts disabled/loading text and no toast/navigation while unresolved, then explicitly resolves the action inside awaited `act`. A `finally` block settles it even if a loading assertion fails; the test awaits successful navigation and the re-enabled button before finishing.
- Keeps the correct-data assertion and adds that submission's completed navigation/enabled-state checks. The successful-navigation test likewise waits for its completed enabled state.
- Uses a stable toast mock, waits for the exact error toast and re-enabled button, then retains the zero-navigation assertion. Each test resets the local action/router/toast mock implementation and history before installing its router mock.
- Retains all **seven test names, order and original behavior assertions**. Validation tests still await their validation errors and assert no action call. No test was removed, filtered or skipped; no sleeps, increased timeouts, error suppression or assertion weakening were added.

Exact source diff: [test-only.patch](../evidence/addmember-test-repair-001/2026-10-11_134025_BDT/test-only.patch).
Source hashes:

| Input | SHA-256 |
| --- | --- |
| Test before repair | `3b0b12f283c31dc28de3025b6e1ea20b0d6994693a1087d2f0e4aacdbf132761` |
| Test after repair | `7464084c92123346d6b123347f3951952ee6585e85119b5391e257718f3629c3` |
| Exact test-only diff | `891ea17411a49f152d73a53ff3bf4d472045359ff85c42c6a9b2f6173cdd300d` |
| Unchanged production form | `b89690cdb0f50937d6b51a6a902448cc851ffc29bb3552efe8072560b5f19e0a` |
| Restored active lockfile, matching HEAD | `f81ea7545863bf12dcb33912a8d43d042abe06aa7b95ff8831af647cdaaeae49` |

`source-change.json`, before/after test snapshots and `protected-source-hashes.json` record exact identities. The original workspace repair patch remains `fac3f21262dca396f5c7b7d71143bbfff1a0f21a809f0278315f1d4d7beebaaa`; the new cumulative patch adds this maintained-test delta without altering those 18 prior product/test files.

## Verification — each check once

Actual restored toolchain: **Node v24.15.0, npm 11.12.1, Next 16.2.6, Jest 30.0.5, jest-environment-jsdom 30.3.0, TypeScript 5.5.4, React 19.2.4, Testing Library React 16.3.2**. Installed key versions were verified against the committed lock at entry; no installation or dependency change occurred in this repair. Actual versions are in `entry-state.json`.

| Command inside networkless namespace | Exit | Result / new evidence |
| --- | ---: | --- |
| `npm test -- --runInBand --runTestsByPath src/__tests__/admin/AddMemberForm.test.tsx --json --outputFile=<new>/addmember.json` | 0 | **7 passed / 0 failed / 0 skipped**, one complete file run; `addmember-command.json`, `addmember.log`, `addmember.json`. |
| `npm test -- --runInBand --json --outputFile=<new>/full.json` | 0 | After file pass: **40 suites, 290 passed / 0 failed / 0 skipped**, one full run; `full-command.json`, `full.log`, `full.json`. |
| `npx --no-install tsc --noEmit` | 0 | After file pass: `typecheck-command.json`, `typecheck.log`, one invocation. |

All commands used the established **`unshare -rn` network denial**, sanitized environment, installed tools and no QA font hook/live service access. Complete argument arrays, timestamps, durations/exits and one-run ledgers are in `*-command.json` and `*-invocation.json`. The runner gates full/typecheck on the file's seven passing tests and prevents repeating an invocation in this evidence folder. No retries, browser rerun, production build or independent QA execution occurred.

Every new result is preserved here. The earlier baseline and restored full-suite failures, diagnostic, isolated-pass evidence and review ZIPs retain their original bytes/results. This passing maintained suite follows an authorized test repair; it does not waive or overwrite the historical failures, certify the product or prove callback attribution.

## Staging and next decision

Updated explicit list: [staging-paths.txt](../evidence/addmember-test-repair-001/2026-10-11_134025_BDT/staging-paths.txt). It carries forward the prior repaired product/safe records, includes the diagnostic and this source change, authorization, return and new evidence, and updates the canonical handoff/changelog. Active `package-lock.json` is excluded because it matches HEAD. Archives, caches, credentials, `.env`, node_modules, RESPONSES and disposable font copies are excluded. All retained backups are labeled evidence under QAM; verified product fonts remain intentional assets. No stage command was executed.

The evidence inventory/identity pins the current source/record diff and staging list without recursive self-hashes. Any generated review ZIP/delivery receipt is an export artifact and is excluded from this proposal; earlier records remain historical snapshots.

Tony reviews and commits selected paths. Architect/QA Lead then bind the actual committed candidate and next retest plan, including the maintained-test delta. Claudy retains independent instrument corrections, acceptance execution and normal installed offline production build/output identity/separation scan after approval. **D4 ALLOW and D7 OMIT remain. Gate Q pending; no waiver, independent attempt, certification, Q5 or closeout.**
