# Dependency reconciliation / AddMemberForm diagnostic review

Start with [ADDMEMBERFORM_FAILURE_DIAGNOSTIC_001_2026-10-08.md](../../../HANDOFFS/ADDMEMBERFORM_FAILURE_DIAGNOSTIC_001_2026-10-08.md) and [DEPENDENCY_RECONCILIATION_001_RETURN.md](../../../HANDOFFS/DEPENDENCY_RECONCILIATION_001_RETURN.md).

Branch qa/frontend-apbm-000; full HEAD/repair parent 9c50884d4c4513b6969311d5be7c05828104ed3d. New diagnostic executed only the selected error-path test ONCE: 1 passed, six filtered out, exit0. Full maintained Jest's earlier 289pass/1fail result remains FAIL; no waiver or full-suite rerun. No product/test edits. Gate Q pending.

This is a small selected-evidence review export, not a new acceptance run. It includes the diagnostic, reconciliation return, current and baseline full failure logs/raw JSON/commands, earlier passing-run JSON for comparison, source hashes/timing, installed versions/install receipt, restored/backup lock identities, and unchanged form/test/Jest setup/config files. Other reconciliation screenshots/results and the backup's complete bytes remain under their recorded repository evidence paths; they are not duplicated in this focused ZIP. It includes the already-installed Lead disposition for context; that disposition does not authorize a next QA attempt.

Archive paths are repository-relative. REVIEW_START_HERE.md supplies the starting links; SHA256SUMS.txt hashes every other member. Secrets, .env, dependencies/caches, RESPONSES and nested ZIPs are excluded. The original ZIP remains under QAM and an identical copy is requested in Downloads. No Git mutation, independent QA, production build, certification or closeout. Delivery receipt is beside the source evidence directory, outside the ZIP to avoid recursion.
