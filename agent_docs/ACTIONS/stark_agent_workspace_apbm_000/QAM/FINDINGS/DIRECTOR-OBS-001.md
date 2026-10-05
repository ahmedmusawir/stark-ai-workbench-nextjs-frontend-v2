# DIRECTOR-OBS-001 — previous live conversation disappears from navigation

Recorded: 5 October 2026, Asia/Dhaka. Owner: independent QA Lead JARVIS. Source: Architect onboarding context section 9, relaying Tony's live-use report. This is not a direct observation by this Lead or the Executor.

**State:** UNTRIAGED / runtime cause unconfirmed. **Classification:** live-use navigation/persistence observation; potentially new frontend regression, inherited catalog/service limitation or environment/config issue. **Severity:** provisional Medium usability/availability impact; reassess if actual transcript loss or broader integrity failure is demonstrated. **Gate effect:** unresolved observation alone neither passes nor fails the fixture scope; evidenced impact on mandatory phase-000 behavior blocks its affected AC. No live reliability approval.

## Known versus unknown

Tony reports the app looks good and agents reply, but he cannot retain multiple chats: starting a new chat makes the previous one disappear and nothing appears saved. Runtime URL, mode, bundle/backend, user context, candidate served, returned session IDs, catalog-write/list outcomes and whether history remains accessible are unknown. Do not label confirmed backend deletion or an inherited defect.

Architect reports that the exported productionAdapter uses existing chatService.sendMessage, then sessionIndexService.createSession for a new catalog entry, listSessions for recents, and getHistory for transcript. Workspace rendered threads live in component memory. A failed/empty catalog path can make existing ADK history unreachable through navigation. This is an Architect-supported hypothesis, not this Lead's direct source inspection or Tony-runtime diagnosis. Protected service errors may collapse into empty/success-like values; mocks do not prove live API classification.

## Q2 offline assessment already approved in plan v0.2

Inspect actual source and compare changed call sites with baseline; inspect supported mock/live branches without network. Test sequential A/B successful mocked sends and A+B index, reopening A; record exact ledger operations and absence of hidden archive/delete/recreate. Test create false/throw and degraded list handling against AC000-04/07/10/21. Identify whether the newly introduced code loses, replaces or hides a successful entry, versus an existing catalog response that never supplied it. Include identity/timing negatives. Record source paths/line ranges and candidate identity; do not capture private message text.

If a new frontend defect is demonstrated, Lead classifies it, Architect supplies a bounded repair, Cody implements, Tony commits and Claudy retests. Do not repair while in the QA Executor seat.

## Minimum separate live diagnostic request, only if offline evidence is inconclusive

This is a proposed request, NOT authorization. Architect first defines diagnostic scope; Tony authorizes the named environment/account/operations and credentials mechanism. Use the current existing local app only with the verified expected mode/target and candidate; no deployment/config switch, schema change, cleanup, real patient/business data or auth bypass. Two explicitly approved synthetic sends may be required; these create ADK/catalog state and must be disclosed, not described as read-only. If existing safe evidence is sufficient, inspect it instead and make no new sends.

For synthetic sessions A/B record opaque evidence aliases plus necessary scoped identity equality (backend/user/agent/session), run/create result status and ID-presence, catalog-write result, list membership before/after New Chat, navigation URL shape, history existence/status/turn count and archive flag if already available through the permitted path. Use only approved service seams; no direct database/admin/ADK ownership bypass to prove a UI problem. Distinguish in-memory disappearance, index invisibility and verified transcript absence. Retain minimal sanitized metadata/operation counts only; no transcript bodies, auth cookies/tokens, .env values, full HAR or provider payloads. No automatic resend/recreate/retry. Report scope/access blockers once.

No live action is required to finish the currently approved offline Q2 body, and no unconditional deferral to APBM_001 is granted for newly introduced frontend failures. Until an authorized diagnostic exists, live cause and durable multi-session reliability remain unqualified.

## Browser fallback

No localStorage repair authorized. Diagnose catalog behavior first. Any future Architect/Director-approved fallback would use minimal session bookmarks partitioned by backend/user/agent, device-local labeling, explicit logout/reset lifecycle and ADK transcript authority; never quietly persist transcript text or call bookmarks backend durability.
