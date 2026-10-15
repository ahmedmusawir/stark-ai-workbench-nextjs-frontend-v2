# APBM001 QAM — self-contained QA assignment

Module: Stark Agent Workspace APBM001. Product branch frontend-apbm-0001; QA branch qa/frontend-apbm-0001. Engineer Claudy; intended independent QA Executor Cody; separate QA Lead; Director Tony. Current phase is in QAM_STATE.md, not inferred from a chat greeting.

Read QAM_STATE, ../GOVERNANCE, ../RULINGS_ADDENDUM, ../ACCEPTANCE_SPEC, ../DATA_CONTRACT, ../ENVIRONMENT_AND_EFFECTS, ../KNOWN_LIMITS, QAM_MANIFEST, HANDOFFS/ENGINEERING_HANDOFF, QAM_PREFLIGHT, QAM_RISK_REQUIREMENTS, GOVERNING/QAM_PLAYBOOK_v1_0 and relevant QA_PLAYBOOK_v1_1 sections. ../EVIDENCE/PROVENANCE identifies source evidence. No duplicate acceptance contract.

If engineering incomplete, report missing readiness and do not claim Q1 complete. Once Tony has committed and created the QA branch, pointing Cody here to start authorizes Q1. Q1 independently verifies baseline/candidate, working tree, readiness, instruments, secrets controls, data/effects and all AC coverage; writes QAM_RECON_REPORT and QAM_TEST_PLAN and exports one Q1 ZIP automatically. Stop for the Lead. Readiness-only live caps are in ENVIRONMENT_AND_EFFECTS. No Q2 tests, agent messages or product edits during Q1.

If Q1 already awaits review, return its existing receipt rather than rerun. If Lead approval exists but Director release is absent, identify that one missing prerequisite. If both exist, verify exact plan/candidate/contract/target binding and execute Q2 continuously under that plan. If stopped, report preserved stop and required owner resolution. If completed/certified, return current result and next owner; don't rerun testing/cleanup.

Q2 produces AC_EVIDENCE_MATRIX, execution report, findings, current state and indexed return with sanitized evidence. Failures are observations for Lead adjudication. Continue unrelated safe tests unless a stop condition compromises them. No product repair; QA instruments may be fixed in the QA lane with earlier failure evidence retained and control validation.

Matching CLAUDE/AGENTS entries support both runtimes. During Q1 record actual entry files loaded. If autodiscovery does not work, the stable fallback is an explicit instruction to read this file; do not invent a claim that either runtime discovered it automatically. Engineer may check routing by static comparison, but actual executor entry is its own evidence.

QA write lane: this module's QAM/** plus authorized transient local build/browser artifacts. Read product/test/config/other-module history. Do not modify them, root recovery logs or other seat's active files implicitly. Use QAM-local checkpoints and QA_RECOVERY.md. For repair, Lead disposition → Architect bounded instruction → explicit handoff to Claudy → Tony commit → explicit handoff back to Cody → re-pin/retest. No simultaneous writers.
