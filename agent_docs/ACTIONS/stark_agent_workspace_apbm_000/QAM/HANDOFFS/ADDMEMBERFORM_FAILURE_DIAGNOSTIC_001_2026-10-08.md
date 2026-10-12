# AddMemberForm failure diagnostic 001 — 8 October 2026

Cody, Engineer. Branch `qa/frontend-apbm-000`, full HEAD/repair parent `9c50884d4c4513b6969311d5be7c05828104ed3d`. **No product/test edits or full-suite rerun. The existing full-suite failure remains unresolved; Gate Q pending.**

## Confirmed facts

- The earlier newer-dependency baseline and restored-dependency full run have **byte-identical failure messages and stacks**: `expect(mockPush).not.toHaveBeenCalled()`, expected **0** calls, received **1** with `'/admin-portal'`, at `src/__tests__/admin/AddMemberForm.test.tsx:152:26`. Their full-suite totals are respectively **286 passed / 1 failed** and **289 passed / 1 failed**. The earlier final newer-dependency run passed this test. Comparison, raw assertions and timing: [failure-comparison.json](../evidence/addmember-diagnostic-001/2026-10-08_131602_BDT/failure-comparison.json).
- Both implicated files match HEAD and their recorded baseline hashes: test SHA-256 `3b0b12f283c31dc28de3025b6e1ea20b0d6994693a1087d2f0e4aacdbf132761`; form SHA-256 `b89690cdb0f50937d6b51a6a902448cc851ffc29bb3552efe8072560b5f19e0a`. Jest config/setup also match HEAD.
- The loading test creates a **100ms success promise** but ends after checking the disabled button. `mockPush` is shared across tests. `clearMocks: true` and local `jest.clearAllMocks()` clear call history; they do not cancel pending submissions. No local `afterEach` or timer control drains that work. Testing Library automatically unmounts each form, but the form's async submission has no cancellation and can still call its captured router after awaiting the action. Other submission tests sometimes wait only for action invocation, rather than terminal completion.
- Existing evidence does not attribute the unexpected router call. The authorized target-only diagnostic therefore ran **once**, offline on restored dependencies (Node24.15.0/npm11.12.1, Next16.2.6/Jest30.0.5). **1 passed, 0 failed; six other file tests filtered out; exit 0**. Exact command/log/result: [isolated-command.json](../evidence/addmember-diagnostic-001/2026-10-08_131602_BDT/isolated-command.json), `isolated.log`, `isolated.json`. No other check ran.

## Assessment and limits

The **observed failure signature matches the earlier baseline exactly**. A shared mechanism is plausible, not confirmed. The isolated pass supports dependence on surrounding execution/timing; it does not identify the responsible callback, prove interference conclusively or rule out intermittent isolated behavior. Pending successful submissions in this same test file are the leading source-based hypothesis. There is no evidence here establishing a new dependency regression or product error-path defect.

The isolated pass **does not erase or waive** full Jest's 289/290 result. No further execution, assertion weakening or source change occurred.

## Smallest proposed repair and required decision

Propose a **maintained-test lifecycle correction only** in **`src/__tests__/admin/AddMemberForm.test.tsx`**: use a controlled deferred action in the loading test, retain the disabled/loading assertion, then explicitly resolve and await that submission's completion before teardown. Make successful/error submissions await their own terminal observable outcome; capture the error toast for completion before retaining the zero-router-call assertion. Keep success routing and error no-routing expectations intact. This proposal has not been implemented or tested.

No change is proposed to the product form, global Jest setup/config or independent QA instruments. Architect must authorize the exact test-only scope and bounded verification; QA Lead must disposition the retained full-suite failure and bind any subsequent candidate/retest. If the lifecycle correction does not explain the failure, return the evidence before broadening scope. No commit, new independent QA attempt, production build, certification or closeout.
