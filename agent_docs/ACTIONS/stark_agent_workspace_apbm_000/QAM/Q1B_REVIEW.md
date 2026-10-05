# APBM_000 — Q1b QA Lead decision record

Date: 5 October 2026, Asia/Dhaka. Seat: JARVIS, independent QA Lead for this review. Cody is Engineer; Claudy is independent QA Executor; JARVIS Master in the 10x Lab is Architect; Tony is Director. No seat substitution or product repair is performed here.

**Decision: APPROVE AMENDED PLAN v0.2 FOR THE SPECIFIED CANDIDATE.** This is plan approval, not Q2 release, acceptance PASS or Gate Q. D4 access and D7 comfort/omission are Director-pending. Tony must commit the approved records and explicitly release the intended Q2 body. Executor must not infer either event.

**Product candidate:** `22ce03ba3871ea53e5253f2e3f060a1bab3226a3`
**Engineering baseline:** `20ef380bdd6eed5e111d953d6404992add7a88a6`
**Branch:** `qa/frontend-apbm-000`
**Approved plan:** `QAM/QAM_TEST_PLAN.md`, QA-APBM000-PLAN v0.2
**Approved plan SHA256:** `8ddb743f1be09d624bf79c8a602ad05fbd3cffbffbc2d8c6cfbaee16f8b80337`
**Acceptance SHA256:** `57f8d9f4dec8ca826326067254b0916ef65ccd51b635a8ac6ead73e8ab469fcc`
**Rulings SHA256:** `99d4c40f7094106f4386d4d8ff5535228feb653dcbe0fd948a14a0ff1ec3b36f`
**Superseded v0.1 plan SHA256:** `61ed590afcef110fb8135f1e85b332cc48f5ba704d6d84e813f4cd09f40179bd`
**Gate Q:** NOT ISSUED
**Q2:** NOT STARTED
**Director release/access/comfort decisions:** NOT SUPPLIED IN THIS REVIEW

## D1–D8 decisions

| ID | Owner and decision | Binding qualification |
|---|---|---|
| D1 | Lead APPROVES actual finalized v0.2 bytes above | Replaces the draft execution rules. Read candidate/HEAD and build-exception corrections below and plan section 11. A changed plan needs a new hash and Lead validation. |
| D2 | Lead ACCEPTS exact A/B inherited failures; CONDITIONALLY DEFERS C; ACKNOWLEDGES manifest replacement | 24 API + 12 legacy UI/store names enumerated below. C is SSR/no-storage persist defect, not roster; Q2 must establish no phase-000 impact. Manifest change is not a fixed defect or reduced red-count success claim. No maintained-test edits authorized. |
| D3 | Lead APPROVES permitted loopback-only namespace plus Node guard and exact-origin browser policy | Includes process descendants/DNS/UDP; no credential exposure or existing service access. Use supported permissions only. Failure to establish confinement blocks affected tests. No bypass/escalation authorization. |
| D4 | Lead APPROVES restricted build policy; Director access remains PENDING | Separate font-only build exception under plan 11.2, entire-process enforcement, exact fonts.googleapis.com/fonts.gstatic.com paths, redirect constraints and no private-env capture. No unrestricted egress. If permission/enforcement absent, independent build proof is BLOCKED while other explicitly released safe checks proceed. |
| D5 | Architect clarification ACCEPTED by Lead | R000-11 requires no authenticated real-route runtime. AC000-03/14/15/21 use fixture + independently mocked entry/adapter + source/build proof with explicit qualifications. No live auth/RLS/deployment/endpoint/Hermes claims. |
| D6 | Lead APPROVES path/port-only QA copy | Record original/copy hashes and exact diff. Secondary evidence only. Preserve Engineer spec/config/evidence. Any semantic copy change returns to Lead. |
| D7 | Director decision PENDING | One short controlled fixture comfort check or explicit recorded omission. Tony's positive live appearance observation is not the controlled check and not blanket manual acceptance. |
| D8 | Lead APPROVES bounded execution | ≤3h active; one diagnostic retry per instrument failure; ≤2 full browser bodies, second only after logged instrument fix; preserve product failures; no product edits. Limits do not waive mandatory proof. |

## Contradiction 1 — candidate SHA and documentation successors

The product candidate stays 22ce03b; actual execution HEAD may advance for approved QAM documentation/tooling commits. Prove candidate ancestry AND all intervening paths AND candidate-equivalent committed/working-tree product inputs; ancestry alone is insufficient. Pin the new plan hash independently. New/untracked product files are checked. Per-path QAM changes are classified rather than accepting all docs indiscriminately. Retain raw identity verdicts and explain each exception; do not rename DRIFT_OR_GAP_FOUND to a pass without adjudication.

A Q2-specific identity helper is required because the Q1 script writes directly into Q1 evidence and fails strict checks on QAM changes/generated next-env.d.ts. Redirecting its stdout does not redirect its file write. Preserve Q1 and generate explicit Q2 records. Accept only the exact documented historical relocation hashes and generated-header exception with working-tree evidence, plus approved new QAM records/tooling. Current checkout is not available in this review. Verify Tony's latest no-root-handoff/no-pointer correction on disk before dispatch; archive copies preserve the earlier pointer claim as history. If not installed, route bounded documentation correction through Architect/Cody; Executor does not edit outside QAM.

## Contradiction 2 — loopback isolation and font-dependent build

Fixture/tests remain fully isolated. A separate build exception is conditional on Tony's access decision and fail-closed enforcement covering descendants, DNS/UDP, redirects and exact font request paths. The global external-request stop rule excludes only that specific approved build activity. If controls or permission cannot be supplied, do not widen egress or change fonts/config/dependencies: independent build proof and dependent ACs remain BLOCKED. No Gate Q based on an Engineer-only build. All detail is finalized in plan 11.2.

## DIRECTOR-OBS-001

Registered in `QAM/FINDINGS/DIRECTOR-OBS-001.md` as UNTRIAGED live navigation/persistence observation, provisional Medium usability impact. No diagnosis of backend data loss, inherited defect or confirmed frontend regression. Plan 11.3 adds source/fixture tests for two successful mocked sessions A+B and reopening A, plus metadata-warning/degraded-list behavior. Any evidenced new frontend failure in AC000-04/07/10/21 is in scope; naming APBM_001 does not waive it. Live-only cause remains unqualified and, if necessary, becomes the bounded Director/Architect diagnostic request in the finding. No live operations or localStorage implementation authorized here.

## Inherited Jest disposition and test meaning

I independently recomputed the failure-name comparison from the exported raw baseline/candidate Jest JSON, normalizing their different absolute file roots to repository-relative src paths. Result: baseline 225 pass / 38 fail; candidate 250 pass / 37 fail; 37 retained, 0 new; first diagnostic line identical for all 37; exactly one baseline test absent/renamed. Full Jest stays exit 1 and not all green. The evidence package is a prior independent Executor run, not a fresh run performed by this Lead on Tony's VM.

A/B accepted for this candidate within the explicit KNOWN_LIMITS rule. Q2 must establish the same exact set, unchanged protected mechanisms and alternate adapter/source proof for preserved integration. C remains conditional on real source/import/reset analysis, J-13 and independent production build. A build block prevents complete C non-impact closure as well as complete Gate Q. A mocked reset function alone does not prove the real store's unavailable-storage path. Actual current impact invalidates any deferral.

Manifest old test: `the committed manifest is valid, includes the original five agents, and declares v1 + v2-local`. New test: `the committed manifest validates the configured roster and preserves declared bundle identity` (passing). This is a meaning-changing roster assumption replacement, not a repaired baseline failure. Accept retirement of obsolete five-agent expectations only; mandatory preservation of actual baseline roster/bundle/urlEnv relationships remains enforced by independent source/equality tests. Full assertion bodies are absent from this export and must be inspected in the checkout; substantive missing non-roster coverage returns as a finding, not silent acceptance.

Exact retained failures (path + full test name; each name is an individual entry, not a count-only waiver):

| Class | Test file | Exact test name |
|---|---|---|
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history GETs the native session path with a timeout signal |
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history normalizes session events to { history: Message[] } (roles mapped, non-text skipped) |
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history passes through the Authorization header when present (R2) |
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history returns 500 { error } and makes zero HTTP calls when ADK_BUNDLE_URL_V1 is unset |
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history returns 502 { error } when the bundle is unreachable |
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history returns 502 { error } when the upstream responds non-OK |
| A | `src/__tests__/api/agent-history.test.ts` | POST /api/agent/history returns { history: [] } for a valid session with empty events (the N7 shape) |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run existing session: single native /run call with the ADK payload and a timeout signal |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run null session (N5): creates session-${Date.now()} then runs; returns the generated id |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run omits the Authorization header when absent |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run passes through the Authorization header when present (R2) |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run retry failure (N6): second run failure → 502 { error } |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run returns 500 { error } and makes zero HTTP calls when ADK_BUNDLE_URL_V1 is unset |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run returns 502 { error } when the bundle is unreachable |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run run succeeds with no model text → 502 "No model response in events" |
| A | `src/__tests__/api/agent-run.test.ts` | POST /api/agent/run session-not-found (N6): create + retry exactly once, then success |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions GET 500 naming GCS_BASE_FOLDER when unset |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions GET 500 naming GCS_BUCKET when unset |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions GET 502 on GCS failure |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions GET returns the instructions text from the derived path |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions PUT — the backup law (C-G3) 500 naming the env var when unset |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions PUT — the backup law (C-G3) a failed backup ABORTS the save — zero writes |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions PUT — the backup law (C-G3) backs up BEFORE writing, to a timestamped versions/ path |
| A | `src/__tests__/api/instructions-route.test.ts` | /api/agent/instructions PUT — the backup law (C-G3) clean not-found (fresh agent) skips backup and writes, backup: null |
| B | `src/__tests__/chat/AgentSwitcher.test.tsx` | AgentSwitcher calls setSelectedAgent with the agent NAME when its label is clicked |
| B | `src/__tests__/chat/ChatPageContent.test.tsx` | ChatPageContent integration send flow: user message appears → assistant response appears |
| B | `src/__tests__/chat/MessageList.loading.test.tsx` | MessageList history loading state (FIX-002b) renders fetched messages once loading clears |
| B | `src/__tests__/chat/SessionPanel.test.tsx` | SessionPanel (BIM-004) New Chat clears the pointer and shows a loaded-empty thread |
| B | `src/__tests__/chat/SessionPanel.test.tsx` | SessionPanel (BIM-004) archive removes the row from the visible list (P-G3) |
| B | `src/__tests__/chat/SessionPanel.test.tsx` | SessionPanel (BIM-004) archiving the ACTIVE session starts a new chat |
| B | `src/__tests__/chat/SessionPanel.test.tsx` | SessionPanel (BIM-004) clicking a session activates it (pointer set, thread cleared) |
| B | `src/__tests__/chat/SessionPanel.test.tsx` | SessionPanel (BIM-004) inline rename commits to the service and the store list |
| B | `src/__tests__/chat/SessionPanel.test.tsx` | SessionPanel (BIM-004) lists the selected agent's sessions with a New Chat button on top |
| B | `src/__tests__/chat/chatStore.modeSplit.test.ts` | chatStore mode-split persistence (FIX-003 F09) live never reads the mock world (no cross-contamination — H1) |
| B | `src/__tests__/chat/chatStore.persist.test.ts` | chatStore persistence (FIX-001) hydration: stored value without selectedAgent keeps the default (back-compat) |
| B | `src/__tests__/chat/chatStore.persist.test.ts` | chatStore persistence (FIX-001) partialize: message content never reaches localStorage (F4) |
| C | `src/__tests__/chat/chatStore.persist.test.ts` | chatStore persistence (FIX-001) SSR guard: storage getter throws (server: no window) → store still creates and works in-memory (F5) |

## Evidence actually read and independently checked

Read onboarding APBM000_QA_LEAD_CONTEXT_v1_0.md; outer README_DELIVERY and receipt; inner REVIEW_START_HERE; QAM plan/preflight/state/manifest/entry/risk/checkpoints/AC matrix; canonical QAM/HANDOFFS engineering QA_HANDOFF; contract ACCEPTANCE_SPEC, RULINGS_ADDENDUM, GOVERNANCE, KNOWN_LIMITS, DATA_CONTRACT and FILE_SCOPE; Engineer changed-source inventory; Q1 evidence INDEX, inherited-failure assessment, candidate identity, readiness and raw baseline/candidate Jest JSON; Q1 identity-helper source; FILE_INDEX mappings. Background: QA_PLAYBOOK v1.1, core TESTING_PLAYBOOK v2.1 and relevant BUG_FIX/HANDOFF rules.

Local checks performed here: outer/inner ZIP CRC valid; inner archive SHA matches receipt/context `aa7c3a5e7c2f071123fe56323b33b560c9ddf04ac022415c6f178f69b85ef0d5`; all 38 indexed payload files match byte lengths/SHA256; draft plan, acceptance and rulings hashes match supplied identities. Recomputed raw Jest names/diagnostic first lines rather than relying on totals alone. No VM tests, production build/browser, protected source equality or live service operations were newly performed by this Lead. Q1 identity's 28 changed/191 protected/217 of 218 inputs/169 of 171 frozen comparisons are reviewed prior Executor evidence, not a fresh disk inspection. The full product checkout, Engineer patch/complete instruments and Designer pack are not in this Q1 export; Executor must inspect those already-existing dependencies locally. Read transport aliases only as exports mapped by FILE_INDEX, never as repository folder instructions.

The Engineer handoff and manifest contain historical 'UNCOMMITTED'/pointer wording, while Q1 state and identity identify a committed candidate. Keep historical reports, append current facts under QAM, and check current path placement; do not call that stale wording evidence of product drift. The raw identity verdict is DRIFT_OR_GAP_FOUND: observed QAM/generated/relocation/doc-path anomalies require explicit interpretation. N1 is separately classified below.

## Consolidated remaining Director decisions — no inferred approvals

Under this module's GOVERNANCE and QAM_ENTRY, Tony must provide:
1. D4: allow the narrowly controlled font-only build and internal read of existing .env.local, or retain no-access policy with independent build proof recorded BLOCKED. If allowing, Executor still must prove permitted enforcement; permission alone is insufficient.
2. D7: choose the short isolated fixture comfort check, or explicitly record omission.
3. After records/instructions are installed and committed: explicit Q2 release, identifying this product candidate, v0.2 plan hash and permitted access choice. Release can expressly cover safe checks with build BLOCKED; it cannot be inferred from receiving this handoff.

N1 nonblocking acknowledgement requested separately: 63 documentation/log paths outside Engineer staging allowlist, including 27 historical response deletions and Engineer return ZIPs. Previously intentional cleanup does not prove acknowledgement of every path. No restore/rewrite/staging action authorized. N1 does not block Q2.

These missing decisions come from project governance/Architect instructions, not a new skill-imposed approval flow. No access rejection occurred in this review.

## Installation and continuation

This is a review artifact prepared in the chat workspace; it has NOT been installed in `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2`. Package members use canonical `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/` paths. Install only the supplied QAM records/plan/finding/prompt; preserve existing unrelated content and original Q1 archives. Verify finalized plan bytes against this hash. Tony performs commits. Claudy may prepare permitted QA instruments/records after reading this decision; no Q2 acceptance execution before valid release. One writer at a time.

Use the single copyable continuation in `QAM/HANDOFFS/CLAUDY_Q1B_CONTINUATION.txt`. Return one indexed safe attempt package under QAM/HANDOFFS; gates and release remain pending their owners. After evidence cleanup, later Lead product certification and APBM/QAM process verdict are separate decisions. This record issues neither.
