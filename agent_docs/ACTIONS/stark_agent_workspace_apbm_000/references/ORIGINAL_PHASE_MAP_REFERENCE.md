# Two-phase map and QAM operating proposal

Version 0.1 · 4 October 2026 · Architect: JARVIS Master  
Status: Planning map; module-specific acceptance, permissions and launch instructions are authored after design reconciliation.

## Seats and working boundaries

Tony is Director and owns scope decisions, credentials, Git and release. JARVIS Master in this lab is Architect and owns the brief, contracts, module assembly, acceptance and bounded repair scope. Cody currently occupies Engineer. Claudy is the intended independent QA Executor; these two seats may swap. The separate QA Lead seat approves the independent plan, adjudicates findings and issues Gate Q. An Engineer does not certify the same work by changing its role label.

Engine 1 contains the build and independent QA for both APBMs. After the product phases are complete, the agreed Engine 2 whole-app review uses Astra/Fable and then the designated security reviewer. That later review is not another build phase or a replacement for QAM. Deployed verification, Gate D, applies when a deployment is actually authorized. Do not silently import older per-phase review diagrams over Tony's current pilot instructions.

## Preparation — current stage

Completed: clone/branch, source recon, cloud roster/schema discovery and direct-cloud A/B history/list/resume probe. Current: Architect planning pack. Next: Designer candidate and visual lock, design return, Architect assembly.

This is not an extra APBM. Preparation must have measured elapsed/active time and handoff count so the pilot cannot claim speed by excluding all its authoring work.

## APBM_000 — FFM workspace refresh

Target module: `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/`.

Outcome: the designed agent directory, agent workspace and conversation UI, composed from existing shell, auth, renderer and service boundaries. Configuration drives roster presentation. Context/instructions panels have explicit demo behavior isolated from live GCS operations. Maintain existing useful message rendering and navigation.

Acceptance seeds: WS-01 through WS-06 plus phase-appropriate WS-14. Full ACs freeze before build using returned design artifacts. Define the exact touched product paths after comparing the design component map with current source. No blanket source-tree rewrite allowance.

Engineering work includes useful Jest/component tests and a small working Playwright setup for the scoped UI. Do not create an independent automation product. Network, browser executable and font/build readiness are checked at entry; the earlier source recon had concrete failures here. Use normal supported environment approvals; do not repeatedly ask Tony to run individual test commands.

Deterministic fixtures test visual and race-related states where needed. Fixtures must not replace or delete the inherited production connector. Preserve the live path and existing configuration until an explicitly scoped configuration change. APBM_000 alone makes no live-session, access-control or deployment certification claim. Live automation is not enabled against consequential agents merely to exercise a button.

Engineer returns implementation, self-check results, known limits, factual QA handoff, manifest inputs and evidence map in the same assignment. Independent QA checks the visual/behavioral contract, config-driven roster, mock boundary, responsive layout, keyboard use and regressions. Tony's manual work is a focused design/comfort review, not a repetitive browser matrix.

## APBM_001 — dependable live sessions and backend switching

Target module: `agent_docs/ACTIONS/stark_agent_workspace_apbm_001/`.

Outcome: real create/list/open/refresh/resume through Next.js and the selected ADK service; verified application identity; scoped asynchronous updates; explicit missing/unavailable/unknown-outcome behavior; catalogue recovery; backend separation; regression of APBM_000.

Acceptance seeds: WS-07 through WS-14. Refresh the affected recon after APBM_000 closes and pin the new actual baseline before authoring this phase's executable scope. Verify current catalogue schema/RLS before freezing any migration work. Do not copy the original baseline SHA into a future certificate.

Required tests combine unit/component protection, deterministic Playwright delayed/out-of-order/error cases, and a bounded authenticated live flow against Greeting Agent. The phase pack defines actual identities, request budgets, approved side effects and cleanup. The completed direct API probe does not authorize unlimited new model calls.

Configuration-switch coverage is two-layered:

- Required frontend mechanism test: two controlled ADK-contract endpoints with different profiles/rosters, deliberately colliding session names, and A → B → A switching. Assert routing, cache/pointer/index separation and state invalidation. This is labeled fixture evidence.
- Named live-target qualification: run the corresponding smoke against a designated second compatible live ADK service when available. The local ADK/A2A/Hermes bundle is the intended next specimen. Record it UNVERIFIED until actual bridge tests pass. The pilot may certify the frontend mechanism with one live cloud target; it may not claim every ADK bundle or the Hermes context path is certified.

If bridge session mapping or direct-upstream access needs a backend/cloud change, JARVIS returns a bounded dependency proposal. Frontend phase launch does not authorize editing other repos, cloud IAM, backend code or deployment configuration.

## QAM inside each module

The module root owns `ACCEPTANCE_SPEC.md`, `RULINGS_ADDENDUM.md`, `QA_HANDOFF.md` and `EXECUTION_LOG.md`. QAM references those canonical bodies; it does not maintain competing editable copies.

| Location | Required purpose |
|---|---|
| Module `CLAUDE.md` and `AGENTS.md` | Engineer seat entry; both point to one common instruction body |
| `QAM/CLAUDE.md` and `QAM/AGENTS.md` | Independent QA seat entry; both point to `QAM_ENTRY.md` |
| `QAM/QAM_MANIFEST.md` | Factual baseline/candidate, changed files, runtime, reproduction and evidence pointers |
| `QAM/QAM_RISK_REQUIREMENTS.md` | QA Lead requirements and clearly attributed Architect risk input |
| `QAM/QAM_PREFLIGHT.md` | Actual target, accounts, browser, ports, evidence and permissions checks |
| `QAM/QAM_TEST_PLAN.md` | Executor-drafted independent plan with QA Lead approval record |
| `QAM/QAM_STATE.json` | Proposed resumable checkpoint/candidate/approval pointers; validate the mechanism in this pilot |
| `QAM/evidence/attempt-001/` | Immutable attempt evidence; later attempts receive increasing IDs |
| `QAM/HANDOFFS/` | Indexed checkpoint ZIPs for the separate QA Lead/Architect chats |
| `QAM/AC_EVIDENCE_MATRIX.md` and execution report | Criterion-to-evidence mapping, failures and limitations |
| `QAM/REPAIR_PROPOSAL.md` | Proposed repair only; never self-authorized product changes |
| Cleanup, certification and pilot-results files | Separate retention result, QA Lead product verdict and process verdict |

Actual entry discovery must be checked in both supported runtimes. Filenames alone are not proof an agent loaded instructions. Each checkpoint explains the next action, candidate and approval state without depending on conversational memory.

## Continuous execution with declared checkpoints

1. **Engineering:** preflight, build, self-check and factual handoff in one authorized interval. Stop for a real scope/access/contract issue, not routine progress confirmation. Acceptance exists before implementation.
2. **Director Git handoff:** Tony commits the candidate and opens the agreed QA branch. The actual branch name and full SHA are recorded; agents do not switch branches themselves.
3. **Q1:** independent QA pins the candidate, checks readiness and drafts a risk-based plan. One indexed package goes to QA Lead.
4. **Q1b:** QA Lead approves or amends the plan; Architect/Director resolve material contract questions. Record approval against candidate, plan and rulings. This is a deliberate checkpoint, not hidden “zero-touch” work.
5. **Q2:** QA executes the authorized test body and exports results. Continue safe independent checks after ordinary findings. Do not repair product source from the QA seat.
6. **Repair if needed:** QA Lead classifies the finding. Architect scopes a bounded product repair. Engineer repairs, Tony commits, QA re-pins and performs affected tests plus required regression on the same forward QA line. Preserve earlier failed evidence.
7. **Q5 and Gate Q:** perform authorized evidence/credential cleanup, then QA Lead issues final certification and a separate pilot-process verdict.
8. **Closeout:** Architect issues closeout instruction; Engineer records it; Tony commits, merges and pushes. Later deployment has its own verified revision and Gate D.

This adopts the reviewed QAM draft for the internal pilot. It supersedes, for these modules, the older extra prompt solely to write a QA handoff, automatic disposable-QA-branch assumption, fixed vendor-to-role assignment, and acceptance authored only after build. It does not remove independent QA plan approval or Tony's Git authority.

## Browser coverage and Tony's manual check

Engineer writes engineering regressions; QA Executor can run them and add independent probes from QA Lead requirements. QA does not simply trust the Engineer's chosen happy path. Reusable maintained Playwright tests belong to authorized engineering scope; disposable QA helpers remain evidence tooling until deliberately promoted.

Automate: navigation, config roster, empty/error/loading states, composer behavior, conversation switching and refresh, delayed requests, logout invalidation, metadata failure, keyboard paths, responsive overflow and mock-context network boundaries. Screenshots support appearance; event/state assertions establish behavior. Test instruments must include safe negative controls in disposable tooling, never source corruption of the candidate.

Tony's suggested check: inspect the canonical workspace, read a realistic long conversation, judge density/type/composer comfort, and try one narrow-screen layout. Note concrete visual friction. The agent owns repeated matrix execution. Credentials and consequential real tool actions remain explicitly controlled.

## Pilot measures

Record preparation, design, engineering, Q1/Q1b, Q2, repairs and closeout separately. Capture active duration where measurable, wall time, agent/tool count, Director interventions by cause, access escalations, repeated checks, evidence defects, first-package sufficiency and repair rounds. Do not equate no human intervention with no approval mechanism.

The current cloud continuation is one sample: 396.8 seconds through package validation, zero additional Director interventions, eight supported escalation invocations, one DNS failure and one ambiguous read timeout. It does not forecast full-app build time.

The future playbook should promote only lessons supported by this pilot and supplied production evidence. Keep untested automation proposals and an unexercised repair loop visibly distinct from proven behavior.
