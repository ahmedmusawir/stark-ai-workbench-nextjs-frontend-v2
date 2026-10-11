# Architect/Tony instruction — dependency reconciliation 001, 8 October 2026

Tony accepted the Architect's recommended return to committed dependency versions and authorized Cody, Engineer, to proceed. Claudy remains independent QA; keep the current QA branch and preserve all completed repairs.

Install the supplied APBM000_Q2_LEAD_DISPOSITION_2026-10-07.zip from Downloads after inspection. Map its QAM paths under module QAM/HANDOFFS without QAM/QAM. Leave byte-identical destinations; report conflicts rather than overwrite. Read/install/hash the Lead disposition without treating it as new QA approval.

Record actual branch/full HEAD/status. Before replacement, preserve package-lock.json, its exact HEAD diff and SHA256 as dated dependency-reconciliation-001 evidence and verify the backup. Restore only package-lock.json from current committed HEAD, without index changes. Preserve F01–F04/local Inter and package.json. Install with npm ci, use required runtime pins if present, record actual installed versions and confirm lock equality. No npm install, upgrades or npm audit fix.

Run focused maintained regressions, full Jest, typecheck and the same 27 Engineer offline browser checks with existing isolation; all new output must be separate. Adjust output destinations only; do not weaken assertions or alter independent QA instruments. Report exact failures and likely mechanisms; do not expand product repair scope or rerun until green. Normal independent production build/Q2 acceptance stay with Claudy after next candidate/plan approval.

Return DEPENDENCY_RECONCILIATION_001_RETURN.md and update canonical QA_HANDOFF with branch/HEAD, backup identity, restored lock/installed versions, new results/evidence/blockers and an explicit staging list. Backup is evidence, not active lockfile. Exclude archives/caches/credentials/RESPONSES from staging. No commit/push/merge/certification/closeout/independent QA start.
