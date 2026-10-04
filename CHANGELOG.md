# Changelog

## 2026-10-04 09:32 UTC — [Codex] Cody, Engineer

- **Created:** `agent_docs/RESPONSES/response_2026-10-04_153205_designer-theme-source-report.md` — mirrored Designer theme-source report, artifact links and next move, saved before display.
- **Updated:** `session_2026-10-04.md` — Director-authorized logging follow-up and archive verification.
- **Updated:** `RECOVERY.md` — current Designer handoff and response-format convention.
- **Reason:** Director requested repository response logging after the read-only extraction. Existing ZIP and application source unchanged.

## 2026-10-04 06:03 UTC — [Codex] Cody, Engineer

- **Created:** `agent_docs/RECON/RECON_ADK_CONTINUATION_20261004-115739.md` — bounded direct ADK continuation, verified two-session stored history and resume.
- **Created:** `agent_docs/RESPONSES/response_2026-10-04_115739_adk-capability-continuation.md` — short return note saved before display.
- **Created:** `agent_docs/RESPONSES/response_2026-10-04_115739_adk-capability-continuation.zip` and `agent_docs/RESPONSES/response_2026-10-04_115739_adk-capability-continuation_evidence/` — indexed sanitized ledger, events, verification and repo state.
- **Created:** `session_2026-10-04.md` — authorization, access interruptions, request accounting and completion.
- **Updated:** `RECOVERY.md` — current handoff, preserving historical records.
- **Reason:** Director-authorized continuation only; no product/configuration/dependency/Git changes.

## 2026-10-03 17:48 UTC — [Codex] Claudy recon seat

- **Created:** `agent_docs/RECON/RECON_ADK_FRONTEND_20261003-234722.md` — evidence-labeled APBM pilot recon; live prerequisites blocked.
- **Created:** `agent_docs/RESPONSES/response_2026-10-03_234722_adk-frontend-recon.md` — short Architect return note saved before display.
- **Created:** `agent_docs/RESPONSES/response_2026-10-03_234722_adk-frontend-recon.zip` and `agent_docs/RESPONSES/response_2026-10-03_234722_adk-frontend-recon_evidence/` — indexed, sanitized supporting evidence and transfer package.
- **Updated:** `session_2026-10-03.md` — recon authorization, findings and completion ledger.
- **Updated:** `RECOVERY.md` — current recon handoff above preserved historical record.
- **Reason:** Director-authorized kickoff recon; no source/config/test/SQL/dependency or Git changes.

## 2026-10-03 17:36 UTC — [Codex] Codex

- **Created:** `session_2026-10-03.md` — initialize the missing daily session and record startup context.
- **Created:** `agent_docs/RESPONSES/response_2026-10-03_233630_session-and-response-logging.md` — save the response before screen output.
- **Reason:** User follow-up on CLAUDE.md session and response logging requirements.

## 2026-07-20 13:51 UTC — [CC] Claude Code

- **Updated:** `src/store/chatStore.ts` — FIX-003: persist key mode-namespaced (`adk-session-map-live`/`-mock`) with LIVE-only legacy adoption (F09); `_hasHydrated` flag + mismatch-safe `useHydrationReady()` gate (F06)
- **Updated:** `src/app/(cyberize)/chat/ChatPageContent.tsx` + `SessionPanel.tsx` — nothing agent-specific renders or fetches until hydration; loading idiom shown instead (no wrong-agent flash)
- **Tests:** new `chatStore.modeSplit.test.ts` (9) + `ChatPageContent.hydration.test.tsx` (2); key literal updated in 2 chatStore test files — board 36 suites / 263 green
- **Created:** `agent_docs/CURRENT_APP/FIX003/ACCEPTANCE_SPEC.md`
- **Reason:** FIX-003 (QA F06 + F09, Architect-adjudicated) — approved plan `agent_docs/RESPONSES/response_2026-07-20_193942_fix003-preflight-plan.md`

## 2026-07-19 18:25 UTC — [CC] Claude Code

- **Created:** `src/app/api/agent/instructions/{route.ts,_lib/gcsInstructions.ts}` — BIM-005: Mission Control LIVE. GET/PUT instructions against GCS with the backup-before-write law (versions/{ISO}.bak first; failed backup aborts the save); 400 unknown agent / 500 naming the env var / 502; ADC credentials (zero credential env vars)
- **Updated:** `src/services/instructionsService.ts` — live mode behind NEXT_PUBLIC_CHAT_MODE (chatService pattern, signatures frozen, mock path untouched); `.env.example` + `GCS_BUCKET`/`GCS_BASE_FOLDER`
- **Added dep (I2 sanctioned):** `@google-cloud/storage`
- **Fixed:** `src/__tests__/config/manifest.test.ts` — roster-agnostic repair re-applied on this lineage (entering baseline was red)
- **Created:** `agent_docs/CURRENT_APP/BIM005/ACCEPTANCE_SPEC.md`. Board: 31 suites / 232 green
- **Reason:** BIM-005 (Mission Control LIVE) — approved plan `agent_docs/RESPONSES/response_2026-07-20_001929_bim005-preflight-plan.md`

## 2026-07-19 13:19 UTC — [CC] Claude Code

- **Created:** `supabase/chat_sessions_setup.sql` — BIM-004 (A4): chat_sessions INDEX table (never transcripts) + RLS + listing index
- **Created:** `src/services/sessionIndexService.ts` (+ mock index, + `SessionIndexEntry` type) — mode-flagged session index CRUD, degrade-not-block
- **Updated:** `src/store/chatStore.ts` — D6 reshape: active-session pointer + in-memory session lists; persisted shape unchanged (pointers only)
- **Updated:** `src/app/(cyberize)/chat/ChatPageContent.tsx` — profileService out of the chat path; D4 adoption ("Restored chat"); D2 row birth with D3 auto-titles; session-switch refetch
- **Created:** `src/components/chat/SessionPanel.tsx` (+ CyberizeSidebar slot) — Conversations panel: New Chat, resume, rename, archive
- **Fixed:** `src/__tests__/config/manifest.test.ts` — roster-agnostic (BIM-003 defect: test contradicted M-G2's zero-code-change promise; surfaced by moose_mcp_agent addition)
- **Created:** `agent_docs/CURRENT_APP/BIM004/ACCEPTANCE_SPEC.md`. Board: 32 suites / 234 green
- **Reason:** BIM-004 (Projects UX) — approved plan `agent_docs/RESPONSES/response_2026-07-19_190517_bim004-preflight-plan.md`

## 2026-07-19 12:42 UTC — [CC] Claude Code

- **Created:** `config/agents.manifest.json` + `src/config/manifest.ts` — BIM-003: committed agent/bundle manifest (env-var names only, AM-2) with load-time validation; sidebar + routes now manifest-driven
- **Updated:** `src/types/index.ts` — `AgentName` union retired (string + manifest validation); both agent routes — unknown agent → 400, missing bundle env → 500 naming the var; `AgentSwitcher` renders manifest labels; `chatStore` default = first manifest agent; mock responses gained a generic default branch
- **Updated:** `.env.example` — `ADK_BUNDLE_URL` retired for per-bundle `ADK_BUNDLE_URL_V1` / `ADK_BUNDLE_URL_V2_LOCAL`
- **Created:** `agent_docs/CURRENT_APP/BIM003/ACCEPTANCE_SPEC.md` — M-G8 QA deliverable. Board: 29 suites / 213 green
- **Reason:** BIM-003 (Agent Manifest) — approved plan `agent_docs/RESPONSES/response_2026-07-19_183350_bim003-preflight-plan.md`

## 2026-07-19 11:29 UTC — [CC] Claude Code

- **Created:** `src/utils/speech.ts` — FEAT-001: speakable-prose preparation (markdown stripped, code blocks announced as skipped, URLs → domain) + single-owner speech engine (new speak cancels previous, owner notified); v2 premium-TTS swaps inside this file only
- **Updated:** `src/app/(cyberize)/chat/MessageActions.tsx` — ReadAloudButton wired through the utility: cleaned text, cross-message cancel, unmount cancel
- **Tests:** new `speech.test.ts` (13) + `MessageActions.readaloud.test.tsx` (4) — board 28 suites / 197 green; existing tests byte-unmodified
- **Reason:** FEAT-001 (accessibility: read-aloud + copy) — approved plan + rulings (ANNOUNCE / SKIP); drift recorded: copy scopes already existed on disk

## 2026-07-19 08:15 UTC — [CC] Claude Code

- **Updated:** `src/store/chatStore.ts` — FIX-002a: `selectedAgent` joins the persist partialize (restore selection on reload); FIX-002b: `isHistoryLoading` flag
- **Updated:** `src/app/(cyberize)/chat/ChatPageContent.tsx`, `MessageList.tsx` — FIX-002b: history fetches signal a "Loading conversation…" state; empty-state suppressed while in flight
- **Updated:** `src/services/chatService.ts` — FIX-002c: sentinel now "Agent Service" (wrapper retired); sanctioned comment wording refresh
- **Tests:** persist suite extended (shape pin + 3 cases), 2 sentinel pins updated, new `MessageList.loading.test.tsx` — board 26 suites / 180 green
- **Reason:** FIX-002 QA triple-fix (F01/F02/F03) — approved plan `agent_docs/RESPONSES/response_2026-07-19_140029_fix002-preflight-plan.md`

## 2026-07-18 13:52 UTC — [CC] Claude Code

- **Created:** `agent_docs/CURRENT_APP/BIM002/RETROSPECTIVE.md` — BIM-002 CLOSED (pending N11 ceremony): all gates green; N7 OUTCOME A convicts the wrapper's /get_history as the lifetime empty-history root cause; 4 lesson candidates proposed (not written); QA F01–F03 → future FIX-002, F04 deferred
- **Updated:** `session_2026-07-18.md`, `RECOVERY.md` — close-out state
- **Reason:** BIM-002 close directive (Coordinator + Stark QA gate confirmation)

## 2026-07-18 11:20 UTC — [CC] Claude Code

- **Created:** `src/app/api/agent/_lib/adk.ts` — BIM-002 native ADK connector (session bootstrap, not-found→create→retry-once, reversed-event response selection, history normalization)
- **Updated:** `src/app/api/agent/run/route.ts`, `.../history/route.ts` — internals ported from wrapper proxy to native ADK api_server; external contracts frozen
- **Created:** `src/__tests__/api/fixtures/adk-events.ts`, `src/__tests__/api/adk-lib.test.ts`; **rewritten:** both route test files to the native contract (FLAG-2 ruling)
- **Updated:** `.env.example` (`ADK_BUNDLE_URL` in, `ADK_WRAPPER_URL` retired — R1), `jest.config.js` (fixtures excluded from test collection — zone deviation, flagged)
- **Reason:** BIM-002 "Kill the Wrapper" — approved plan + rulings (`agent_docs/RESPONSES/response_2026-07-18_163153_bim002-preflight-plan.md`); board 25 suites / 174 tests green

## 2026-07-18 10:14 UTC — [CC] Claude Code

- **Updated:** `agent_docs/CURRENT_APP/FIX001/RETROSPECTIVE.md` — finalized: FIX-001 CLOSED, disposition PASS; reload-transcript display BLOCKED-UPSTREAM (wrapper /get_history latent v1 defect) → transfers to BIM-002 gate N7
- **Created:** `agent_docs/RESPONSES/response_2026-07-18_161419_fix001-final-disposition.md` — full ruling record
- **Updated:** `RECOVERY.md`, `session_2026-07-18.md` — FIX-001 CLOSED per Architect final disposition on Coordinator evidence
- **Reason:** FIX-001 final disposition directive (2026-07-18)

## 2026-07-18 07:13 UTC — [CC] Claude Code

- **Updated:** `src/store/chatStore.ts` — FIX-001: persist-wrapped (key `adk-session-map`, partialize → `agentSessions` only, SSR-safe); message content never persisted
- **Updated:** `src/app/(cyberize)/chat/ChatPageContent.tsx` — mount effect merges fetched ∪ persisted sessions (persisted wins per-key while profileService is mocked — Architect defect amendment 08:42 UTC; revisit when profileService goes real) instead of blind replace
- **Created:** `src/__tests__/chat/chatStore.persist.test.ts` — F4/F5 gates: round-trip, partialize fence, hydration, corrupt-degrade, SSR guard
- **Reason:** FIX-001 (Session Pointer Persistence) — kills the BIM-001 G6 reload bug; approved plan + Architect rulings (persist-wrap ACCEPTED, mount-merge ACCEPTED)

## 2026-07-17 09:08 UTC — [CC] Claude Code

- **Updated:** `agent_docs/CURRENT_APP/BIM001/RETROSPECTIVE.md` — finalized at module close: all gates green, field notes (Grammarly hydration false alarm, cold-backend 500 vs sentinel, session_id fallback), 4 candidate lessons proposed
- **Updated:** `session_2026-07-17.md`, `RECOVERY.md` — BIM-001 CLOSED per Coordinator confirmation
- **Reason:** Coordinator confirmed all manual gates (G3–G6, G8) green — BIM-001 close-out directive

## 2026-07-16 13:27 UTC — [CC] Claude Code

- **Created:** `src/app/api/agent/run/route.ts`, `src/app/api/agent/history/route.ts` — BIM-001 thin proxy routes to the ADK wrapper
- **Updated:** `src/services/chatService.ts` — live mode behind `NEXT_PUBLIC_CHAT_MODE` (mock default intact); BACKEND_SWAP_NOTES rewritten to the route-handler seam + D1(b) sentinel
- **Updated:** `.env.example` — added `ADK_WRAPPER_URL` (placeholder) and `NEXT_PUBLIC_CHAT_MODE=mock`
- **Reason:** BIM-001 "Prove the Wire" — approved implementation plan (`agent_docs/RESPONSES/response_2026-07-16_191653_bim001-implementation-plan.md`)

## 2026-10-04 16:03 UTC — [CC] Cody Engineer

- **Updated:** APBM_000 BASELINE_CHECK.md, EXECUTION_LOG.md, QA_HANDOFF.md and QAM/QAM_MANIFEST.md — bounded baseline, factual implementation/self-check return; independent QA authority unchanged.
- **Added:** module evidence/engineering-attempt-001 — per-AC claims, exact source/protected-input hashes, before/after failure comparison, safe logs/screenshots, patch, reproduction and selective staging guidance.
- **Added:** QAM/HANDOFFS/ENGINEERING_attempt-001.zip and receipt; identical validated Downloads copy, 186 indexed members.
- **Updated:** session_2026-10-04.md and RECOVERY.md; added `agent_docs/RESPONSES/response_2026-10-04_220306_apbm-000-engineering-return.md` before screen report.
- **Reason:** User-authorized APBM_000 Engineer build and return. Build/TypeScript, targeted 57/57, browser 33/33 passed; full Jest retains 37 baseline failures pending independent Lead adjudication. No live agents, protected-service/dependency/Git mutations.

## 2026-10-04 16:15 UTC — [CC] Cody Engineer

- **Moved:** APBM_000 canonical QA_HANDOFF.md body into QAM/HANDOFFS; root pointer retained for original instructions.
- **Updated:** QAM entry/manifest/HANDOFFS README and Engineer review/staging/log records; added location correction hash record.
- **Added:** corrected indexed ENGINEERING_attempt-002.zip, receipt and verified Downloads copy; 001 preserved.
- **Updated:** session/recovery and saved response `agent_docs/RESPONSES/response_2026-10-04_221511_qa-handoff-location-correction.md` before screen.
- **Reason:** Director requested the handoff in QAM/HANDOFFS. Product candidate and tests unchanged.
