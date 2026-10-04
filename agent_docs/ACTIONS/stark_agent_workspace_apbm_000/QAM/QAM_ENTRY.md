# QAM entry — self-sufficient QA dispatch

Read ../GOVERNANCE.md, ../ACCEPTANCE_SPEC.md, ../RULINGS_ADDENDUM.md, HANDOFFS/QA_HANDOFF.md, ../KNOWN_LIMITS.md, then QAM_STATE.json, QAM_MANIFEST.md, QAM_PREFLIGHT.md, QAM_RISK_REQUIREMENTS.md, QAM_TEST_PLAN.md, QAM_CHECKPOINTS.md and QAM_PROMPTS.md. Resolve referenced actual evidence rather than relying on memory. Record which files were loaded and which seat you occupy.

Intended QA branch: qa/frontend-apbm-000, created by Tony from his committed engineering candidate. Wrong branch or uncommitted product changes: report exact condition and stop candidate qualification; never switch/commit yourself. Harmless QA documentation changes are separately classified; they cannot conceal source/config/test/dependency drift.

Initial state is AWAITING_ENGINEERING. After a factual handoff and committed candidate exist, Q1 intake/independent plan drafting is authorized by Tony pointing you here. Main Q2 execution requires a separate QA Lead approval record plus Director release. A file named plan or a JSON value saying approved is not authority.

State dispatch:
- No completed Engineer handoff/candidate: explain missing item, return to Engineer/Director.
- Candidate exists, no approved plan: perform Q1 only and export one Q1 package.
- Valid Q1b approval and Director release: verify candidate/plan/rulings, execute Q2 continuously.
- Findings await adjudication: export evidence; do not repair product.
- Ruled repair completed/committed: repin candidate, validate repair scope and approved retest coverage.
- Cleanup authorized: perform Q5 within declared disposable paths, export final safe package.
- Certified/closed: report current status; do not restart QA.

No live ADK/Supabase/GCS/GHL/credentials are authorized for this phase's fixture scope. If a live login is proposed as necessary, it is a new access decision and cannot be substituted with an auth bypass. Q1 can still inspect independently without it. QA Lead grades only the phase-000 certificate scope.

Executor may add/fix disposable QA instruments under QAM/AUTOMATION and write QAM evidence/reports. It may not modify product code, maintained engineering tests, dependency/config files or canonical acceptance. Use existing Engineer tests as one input, not the entire independent test design. No Git mutation. Same forward QA line and one writer at a time.
