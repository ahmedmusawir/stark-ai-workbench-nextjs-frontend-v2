# APBM_000 — Stark Agent Workspace: FFM build + QAM
Version 1.0 · 4 October 2026 · Architect: JARVIS Master · Director: Tony Stark

**Status: Architect-assembled assignment ready for Engineer entry on `frontend-apbm`, subject to the bounded baseline/environment preflight. No implementation or QA pass has occurred.**

## Tony's next move

Extract this folder under `agent_docs/ACTIONS/` in `stark-ai-workbench-nextjs-frontend-v2`. The resulting path must be `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/START_HERE.md` (one module folder, not doubled). Keep the existing branch. Give Cody the prompt in `ENGINEER_LAUNCH.md`. No new full recon, backend probe, or Designer round is needed unless the entry check finds material product drift.

The complete final Designer return is included under `DESIGN/`. Open `DESIGN/index.html` if needed. Do not separately install its CSS or copy its HTML into the app.

## What this assignment delivers

The configured-agent directory, agent workspace, and existing-style conversation screen; dark/light responsive UI; demo-only context; preserved existing service connection; useful automated UI tests; a completed factual engineering-to-QA handoff. This is a real Next.js implementation, not another static mockup.

Existing live capabilities remain connected. APBM_000 certifies UI behavior using controlled fixtures plus source/service regression evidence. APBM_001 separately qualifies dependable live multi-session operation, identity, failure recovery, metadata and backend switching. APBM_000 cannot certify those by showing a green screenshot. See `PHASE_MAP.md` and `KNOWN_LIMITS.md`.

## Continuous work and checkpoints

1. Cody: bounded preflight → implement → self-check → factual handoff and one indexed return ZIP. No extra prompt just to write the QA handoff.
2. Tony: review engineering return, commit selected candidate files and open `qa/frontend-apbm-000` from that candidate. Engineer provides exact selective staging guidance; no blanket `git add .`.
3. Independent QA Executor (intended Claudy): read `QAM/AGENTS.md` or `QAM/CLAUDE.md`; execute Q1 intake and independent plan drafting; return one package to QA Lead.
4. QA Lead approves the candidate-bound plan at Q1b. Tony commits the approved instructions and releases Q2. This checkpoint is deliberate; it is not a hidden claim of zero-touch QA.
5. Executor runs approved Q2 continuously. Lead adjudicates. Any product repair goes through Architect scope and Engineer implementation on the same forward QA line, then independent retest.
6. Q5 cleanup → QA Lead Gate Q and separate process verdict → Architect closeout → Engineer documentation → Tony commit/merge/push.

Cody and Claudy are interchangeable providers, but Engineer and independent QA Executor must be separate execution seats for this candidate. JARVIS in this lab remains Architect; the separate QA Lead approves tests and certifies. Nobody silently fills another seat's approval.

## Package authority

Read `GOVERNANCE.md`, `RULINGS_ADDENDUM.md`, `ACCEPTANCE_SPEC.md`, and `ENGINEERING_ENTRY.md`. Module root owns the only acceptance and factual handoff. QAM references those files instead of duplicating editable contracts. `DESIGN/` and `references/` are immutable evidence; this module's explicit phase boundary governs the Designer's eventual-product requirements.

A null candidate SHA or NOT RUN evidence field is an honest pre-execution state. The Engineer completes facts; QA pins the committed candidate. No one may turn templates into PASS records without execution.
