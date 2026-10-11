# Architect authorization — AddMember maintained-test repair 001

Recorded 2026-10-11T13:40:25.268802+06:00. Tony supplied this explicit bounded authorization; no additional approval requested. Engineer writer ownership retains Tony’s prior confirmation.

## Instruction (verbatim)

Cody — Architect authorizes a bounded maintained-test lifecycle repair.

Read:
QAM/HANDOFFS/ADDMEMBERFORM_FAILURE_DIAGNOSTIC_001_2026-10-08.md

Authorized source edit ONLY:
src/__tests__/admin/AddMemberForm.test.tsx

1. Replace the loading test’s 100ms success timer with a controlled
   deferred promise.
   - Assert the disabled/loading state while unresolved.
   - Explicitly resolve it.
   - Await the completed successful submission before the test ends.

2. Ensure each submission test awaits its own terminal outcome.
   - Preserve correct-data assertions.
   - Preserve successful navigation assertions.
   - Use a stable toast mock to observe the error outcome before
     asserting that navigation never occurred.
   - Reset local mock implementations/history appropriately.
   - Ensure no pending submission survives teardown.

Do not weaken, skip or remove assertions. Do not add arbitrary sleeps,
increase timeouts, reorder tests to hide the failure, or suppress errors.

Do not edit the production form, global Jest setup/config, dependencies,
independent QA instruments or the completed workspace repairs.

Verification on the restored committed dependencies:
- Run the complete AddMemberForm test file once.
- If it passes, run the full maintained Jest suite once and typecheck.
- Preserve every result. If a check fails, report it without further
  retries or scope expansion.
- No browser rerun is needed for this test-only change.

Record this authorization and the return under QAM/HANDOFFS/.
Save new evidence under QAM/evidence/addmember-test-repair-001/.
Include exact diff, commands/results, source hashes and updated staging
list. Preserve the original failures and diagnostic evidence.

Describe the pending-submission defect as source-confirmed; do not claim
the historical unexpected callback was conclusively traced.

Finish with a short report and the return document’s absolute path.
No commit, independent QA attempt, waiver, certification or closeout.
