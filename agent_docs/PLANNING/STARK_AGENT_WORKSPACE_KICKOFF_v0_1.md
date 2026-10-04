# Stark Agent Workspace — Pilot Kickoff and Recon

**Version:** 0.1 · **Date:** 3 October 2026, Asia/Dhaka  
**Director:** Tony Stark · **Architect:** JARVIS Master, this APBM lab  
**Working name:** Stark Agent Workspace; final branding remains open.  
**Status:** Ready to hand to Claudy for recon in Tony's new frontend clone. Product build has not started. This is the planning entry packet, not a frozen App Brief, executable APBM, or QA certificate.

## 1. What we are starting

Evolve Tony's existing Next.js chat frontend into an agent workspace inspired by the supplied Claude Projects screens. Agents occupy the place of projects. Each agent has a landing page and several independently resumable conversations.

Tony will clone the working code into a new repository so the original is preserved. The preferred first environment is local Next.js connected to the existing Google Cloud ADK v1 deployment, with its existing Supabase-backed history. Those capabilities are Director-reported starting context; the new checkout and deployed behavior require fresh verification.

The application is small enough for an ABM. We are deliberately using a short APBM sequence to test phase delivery, handoffs, QAM, and phase-to-phase integration while delivering the app. We do not add phases merely to produce more process evidence.

The separate ABM currently running is another evidence source. Its pending results do not block this recon. No result from that run is assumed in this packet.

## 2. Product intent already settled

| Area | Initial intent |
|---|---|
| Starting code | The existing working frontend, in Tony's newly selected clone |
| Agent directory | Agent cards, names and descriptions; reuse the actual available agent roster |
| Agent workspace | Agent identity, new-chat entry, recent conversations, and context/instructions panels |
| Conversations | Create, list, open, switch, reload, and continue separate conversations with the same agent |
| Existing behavior | Preserve useful working chat, authentication, agent selection, and message rendering |
| Document context | Interactive mock only; clearly show that documents are not sent to the agent |
| Instructions/personality | Display/mock experience initially; no live prompt or GCS instruction changes |
| Preferred backend | Keep the deployed ADK v1 bundle if verified capabilities support the outcome |
| Future direction | Compatibility with the ADK/A2A/Hermes Cyberlorean workbench; no new Hermes integration in this pilot |

Agent creation, session renaming/deletion, document ingestion, retrieval, shared memory, collaboration, model selection, and deployment migration are not automatic additions. Recon may discover existing features worth retaining; it must not turn discovery into new acceptance scope.

Cloning the frontend isolates code work. It does not create a separate ADK service, database, or set of credentials. Resolve the intended backend and test identity explicitly.

## 3. First assignment: recon

Tony places this file at `agent_docs/PLANNING/STARK_AGENT_WORKSPACE_KICKOFF_v0_1.md` in the new clone and opens Claudy there. All paths below are relative to that selected clone unless stated otherwise.

Claudy reads applicable repository instructions and the installed `stark-recon` skill and questionnaire. Discover their actual location rather than assuming a historical path. Use the existing `RECON` or `recon` folder casing; do not create both. If the required skill is missing, collect the useful intake facts and report that prerequisite once. Do not claim a completed standard recon or install a substitute.

### A. Establish the specimen

- Record repo root, sanitized remote identity, branch, full HEAD, and tracked/untracked state. Confirm this is Tony's intended new frontend checkout. Do not operate on the original or inspect sibling repos automatically.
- Record current stack, package manager, lockfile, installed dependencies, available scripts, and relevant instructions. Preserve existing work. A dirty tree needs accurate identification; it is not permission to reset it.
- Identify which backend the app actually resolves to: deployed ADK v1, local ADK, or the Hermes-facing bundle. An environment variable or alias named `v1` is not proof of the deployed version. Record how the intended target was established and any remaining version uncertainty.
- Read needed configuration privately; report variable names and availability, never values. Do not put credentials in command arguments, logs, screenshots, archives, or public frontend configuration.

### B. Trace the real conversation flow

Follow the UI through state, services, Next.js routes, and ADK. Establish:

1. How an agent maps to an ADK application and backend.
2. How the authenticated user is resolved, how ownership is checked, and how session IDs are generated and scoped.
3. Which create/list/history/resume operations already exist and which are reachable from the UI.
4. What ADK owns as history and what any frontend/Supabase index owns. Do not assume there is a second database index; establish it from source and authorized observations.
5. What the frontend persists across refresh and where a single-session assumption may exist.
6. Whether a pending reply or history load can update the wrong conversation after switching agents or sessions.
7. How missing sessions, failed history requests, partial streams, retries, and mismatched index/history state are handled.
8. Whether identity comes from a verified server session or is trusted from client input. A protected page alone does not establish API protection.

Inspect only authorized test identities and newly created test histories. Do not browse personal conversations or query ADK-owned tables directly as a shortcut.

### C. Identify what we can reuse

Inventory the shell, agent list, conversation list, composer, message renderer, service boundary, auth, tokens, responsive behavior, and existing tests. Inspect what available checks actually run before executing them. Run relevant installed, non-destructive checks once; record command, exit status, counts, and limitations. No dependency installs, upgrades, automatic fixes, or test edits during recon.

Establish whether Playwright is configured with usable tests or merely present as a dependency. If a browser is available, capture a small sanitized view of current behavior. Missing browser access is a reported gap, not a reason to stop independent source inspection. Do not create a browser framework during this assignment.

Find relevant Factory references, the canonical Architect questionnaire, and the design references if already supplied. The two Claude screenshots and current frontend screenshot were shared in the lab; do not pretend they are present in the clone. Record missing design assets for the Designer handoff without blocking technical recon.

Historical frontend recon and the ADK v2 brain-drain extraction are leads. Their claims are not observations of the new clone or deployed v1.

### D. Bounded live capability probe

This is a limited test-session operation, not read-only recon. Proceed only after establishing the intended deployed endpoint, an authorized test identity, and an existing general-chat agent whose use will not trigger consequential tools. If those prerequisites cannot be established, mark the live probe BLOCKED and finish the independent recon work.

Use the contract found in the actual code or accessible deployment schema. Prefer the current frontend/Next.js path where possible. A direct ADK test can establish backend capability but cannot prove the frontend flow works.

- Create two new sessions, A and B, using the supported operation. Preserve their distinct identities.
- Send one harmless marker to each, such as `amber-lantern` in A and `blue-orbit` in B, asking only for acknowledgment.
- Retrieve each history and check that stored events belong to the intended session. Retain minimal sanitized evidence.
- Resume each session once, asking for its earlier marker. Confirm new events append under the correct identity. Model recall alone is not proof of storage isolation.
- If the existing UI supports these operations, reopen the threads after browser refresh without further model calls. Otherwise report exactly which UI step is unavailable.

**Budget:** two new sessions, four message submissions total, and twelve read requests. Inspect automatic retry behavior before running. Do not blindly resend after a timeout; check history within the read budget. Stop the live sequence on refusal or rate limiting. Do not switch services or providers to continue it. If the budget is insufficient, return partial evidence and the specific unresolved question.

No cloud restart, redeployment, prompt edit, schema change, external message, consequential tool action, or deletion of existing chats. Leave the new test sessions identifiable for Tony's later disposition; report their existence without exporting private history.

Conclude one of: **SUPPORTED FOR THE TESTED CASE**, **BLOCKED/INCONCLUSIVE**, or **OBSERVED FAILURE**. Distinguish frontend defects, configuration/access problems, and backend limitations. Do not promise all backend changes are unnecessary from one successful probe, or demand a backend rewrite from one failed request.

### E. Return one usable package

Write the full report in the established recon folder as `RECON_ADK_FRONTEND_<YYYYMMDD-HHMMSS>.md`, with the timestamp's timezone stated inside. Use these sections:

1. Director summary: at most ten bullets, including the next action.
2. Repo/runtime identity and check results.
3. Session capability matrix: source present, exercised result, evidence, remaining gap.
4. Live probe result, budget used, and limitations.
5. Reusable UI and integration code; actual request/response shapes and identity rules.
6. Necessary pilot work, blocking unknowns, and optional cleanup kept separate.
7. Recommended phase split and browser-testing approach.
8. Time, Director interventions, unexpected stops, and final repo status.

Label claims as observed evidence, source-derived findings, inference, or unresolved gaps. Include relevant source locations. Preserve failures and previous reports.

Create `agent_docs/RESPONSES/response_<YYYY-MM-DD_HHMMSS>_adk-frontend-recon.md` as a short return note pointing to the full report. Also create a same-stem ZIP containing that note, the report, and only the sanitized supporting evidence it needs. Include a small file index. Exclude credentials, environment files, browser profiles/auth state, unrelated histories, dependencies, and previous archives. Reports and their bounded evidence are the only intentional file additions; list incidental build/cache output separately.

Finish by naming the return note and ZIP and stating what the Architect needs to decide. No Git mutations: Tony handles branches, commits, pushes, and merges. No product fixes during recon.

## 4. What JARVIS does with the report

The next planning pass produces the App Brief, evidence-grounded initial Data Contract with Engineer input, Designer handoff, and final short phase map. No invented endpoints or database schema fill gaps in the report.

The Designer receives the approved brief, available reference images, and identified components to reuse. The design package should make the agent directory, agent workspace, and conversation view concrete, with tokens and responsive behavior. JARVIS reconciles the returned design before authoring an executable phase.

| Provisional phase | Product outcome | Certification scope |
|---|---|---|
| APBM_000 — FFM refresh | Agent directory/workspace/conversation experience, with clearly declared mocks and reuse of existing working integration where feasible | UI behavior and approved visual contract; mocked flows cannot prove ADK persistence |
| APBM_001 — Live sessions | Real session creation, listing, reopening, switching, and continuation against the verified backend | Real integration and persistence, plus regression of the prior phase |

Recon and design preparation precede these build modules; they are not a third product phase. The split remains provisional. If recon shows a concrete reason to change it, explain the outcome gained. Do not replace an existing working connection with mocks simply to satisfy a phase label.

The executable pack will explicitly reconcile this pilot's continuous execution intervals with older per-step Factory checkpoints. Missing rules are resolved before launch, rather than leaving Engineer or QA to guess whether an old stop still applies.

## 5. QAM belongs inside each phase

Use `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/` and the corresponding `apbm_001` path unless recon reveals a repository convention that needs an explicit mapping.

The module root owns canonical scope, acceptance, rulings, and engineering handoff. QAM points to those files. It contains role entry instructions, manifest, independent QA plan, evidence, reports, cleanup, and certification. A frozen review export may carry clearly identified snapshots; it must not create competing editable authority files.

The intended workflow is:

1. JARVIS authors the phase and QAM skeleton before engineering, using QA Lead requirements.
2. Claudy challenges material ambiguities, builds the approved phase, and completes its execution report and factual QA handoff in the same assignment.
3. Tony commits the candidate and opens the QA branch. The actual full candidate SHA is resolved from Git.
4. Cody performs Q1 readiness/recon and drafts the independent plan. QA Lead reviews and approves it at Q1b, with Architect/Director rulings where needed.
5. Cody executes the approved Q2 body continuously and returns an indexed review package. Ordinary findings do not prevent other safe independent checks; declared trust, access, and scope failures do.
6. QA Lead adjudicates findings. Architect scopes product repairs; Claudy implements them; Tony commits; Cody re-pins and retests affected behavior plus required regression on the same QA line.
7. Authorized evidence cleanup finishes before QA Lead issues final Gate Q. JARVIS closes the module; Claudy completes closeout records; Tony commits, merges, and pushes.

Role entry files assign the seat, regardless of model or harness. Cody does not self-certify. Claudy's engineering tests are useful inputs, but do not define QA's entire exam. A `REPAIR_PROPOSAL.md` proposes work; it does not authorize it.

Each checkpoint returns the material its reviewer needs. A folder alone cannot transfer a package between separate chats. Until an actual integration exists, Tony still carries the indexed package, with no file hunting or repeated prompt composition as the intended benefit.

After the planned phases are certified and integrated, the separately agreed Engine 2 whole-app reviews remain distinct. Gate D verifies the deployed revision when deployment is included; a local Gate Q does not certify the cloud deployment.

## 6. Frontend QA without a separate automation project

These are proposed risk areas for the phase authors and QA Lead, not frozen acceptance criteria:

- Agent directory navigation and workspace identity.
- Two conversations under one agent: distinct histories, correct reopening, and continued messages after refresh.
- Switching during pending history/reply operations without cross-thread updates.
- Loading, empty, unavailable-backend, and retry behavior without silent data loss or duplicate sends.
- User/agent/backend session scoping where applicable to the actual app.
- Mock document/instruction panels clearly separated from live agent behavior.
- Keyboard access and agreed responsive layouts, using a small justified viewport matrix.

Claudy writes appropriate engineering tests using the repo's existing tools, including reusable browser tests where included in build scope. Cody independently validates the outcomes, may reuse sound tests, and can add bounded disposable probes under the approved plan. Neither seat needs to rebuild the testing stack by default.

Browser assertions prove behavior; screenshots support visual assessment. Deterministic mocks are appropriate for controlled UI race/failure cases, but must be labeled. Persistence claims require live evidence. No candidate product edits to make a QA helper fail deliberately.

Tony's proposed manual review is a short experience check: does the chosen design feel right, is navigation understandable, and is the conversation workflow comfortable? Credential/MFA participation is declared if needed. Automated QA handles the repetitive cases. The QA Lead settles final coverage after recon; no guessed three-hour manual matrix.

## 7. Learning from the parallel ABM

When the fresh ABM package arrives, record the demonstrated issue, its evidence, applicability to this pilot, and the smallest useful adjustment. Adopt relevant findings before freezing the affected phase. After freeze, changes need a recorded ruling and an explicit retest impact; do not silently revise the exam mid-run.

Keep the pilot journal short: preparation time, engineering time, QA time, waiting, Director touches and causes, unexpected stops, repair rounds, and whether the first review package was sufficient. Separate measured durations from estimates. Product certification and process success are separate conclusions.

The RRM-derived QAM materials support trying this workflow. They do not prove this frontend, its backend contract, the entire repair loop, or a finished universal APBM playbook. The new ABM findings are pending. We will not delay useful product work to wait for every experiment, nor claim outcomes we have not received.

## 8. Source and readiness record

- Tony's original discussion and supplied reference screens in this lab: product intent, existing frontend reuse, deployed-v1 preference, mocked context, and future Cyberlorean direction.
- Tony's 3 October instruction: new repo clone to preserve the original, start this pilot, and expect fresh parallel ABM evidence.
- `APBM_PILOT_RECON_MISSION_v0_1.md`, 21 September: earlier detailed recon mission. This kickoff is the refreshed self-contained entry for the new clone, carrying its bounded probe forward and adding the current QAM workflow and response packaging.
- `ARCHITECT_PLAYBOOK.md`, sections 1–2: current repo recon before formal App Brief/Data Contract/FFM authoring.
- `FFM_PLAYBOOK.md`, sections 1–2: design artifacts, role inputs, and explicit verification.
- `STARK_QAM_10X_LAB_MASTER_DRAFT_v0_1.md`, 2 October: latest supplied experimental QAM synthesis, independent plan approval, continuous execution, cleanup, and evidence handling.
- `STARK_ABM_ARCHITECT_QAM_BRIEF_v0_1.md`: advisory translation of those lessons for the parallel ABM.

**Ready now:** product intent, first recon assignment, provisional phase shape, and proposed QAM workflow.  
**Still required:** the selected new clone and its fresh evidence before formal build authoring.  
**Not performed here:** repository recon, backend probe, product changes, browser QA, or certification.

## 9. Copy-ready Claudy launch prompt

You are Claudy, the Engineer performing the first recon for Tony Stark and JARVIS Master's Stark Agent Workspace APBM pilot.

Read applicable repository instructions, then `agent_docs/PLANNING/STARK_AGENT_WORKSPACE_KICKOFF_v0_1.md`. Execute its recon assignment in this selected clone, using the installed stark-recon skill and questionnaire. This is recon, not the product build.

Establish the actual repo and backend identity, trace session handling, inspect existing tests and reusable UI, and run the bounded live probe only when its stated prerequisites are met. Preserve the original repo, current work, credentials, and existing conversations. Make no Git mutations or product fixes.

Do all independent authorized work in one run. Record specific blockers instead of repeatedly asking for known decisions. Return the required full recon report, short response note, and sanitized ZIP under agent_docs. Finish with the exact paths and a plain-English answer to: what already works, what prevents multiple resumable chats per agent, and what JARVIS needs to decide next.
