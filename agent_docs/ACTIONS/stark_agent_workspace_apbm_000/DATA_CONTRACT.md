# Phase 000 data and navigation contract

ADK remains transcript authority. Existing Supabase chat_sessions remains the metadata index. Browser calls stay through existing Next.js/service seams. Do not add a transcript database, direct A2A/Hermes client or expose server endpoint environment values.

## Current interfaces to preserve

| Interface | Existing source observation |
|---|---|
| config/agents.manifest.json → src/config/manifest.ts | Active roster, agent-to-bundle and bundle urlEnv mapping |
| POST /api/agent/run | agent_name, message, user_id, nullable session_id → response and session_id |
| POST /api/agent/history | agent_name, user_id, session_id → normalized history |
| src/services/sessionIndexService.ts | Existing metadata list/title/archive operations |
| src/app/api/agent/_lib/adk.ts | Native ADK session/create/run/history connection, currently snake_case run fields |

These descriptions are not endorsements of current API identity handling. Do not edit those production APIs or schema in this module. The cloud probe used camelCase successfully; it did not disprove snake_case. No speculative payload conversion now.

## Production view identity — same authenticated /chat route

| URL shape | View |
|---|---|
| /chat | Configured agent directory |
| /chat?agent=<encoded stable configured agent ID> | Agent workspace |
| /chat?agent=<ID>&new=1 | New local conversation draft for that agent |
| /chat?agent=<ID>&session=<encoded ADK session ID> | Existing conversation |

Treat query values as untrusted. Validate agent membership against configured presentation; invalid or conflicting selectors show a safe unavailable state, not an arbitrary default or a request. Missing agent with session/new is invalid. Both new and session is invalid. Normal navigation retains neither preview fixture selectors nor user/backend credentials. Encode identifiers with URL utilities, never concatenated raw HTML. Back/forward restores the selected view. Repeated New Chat deliberately starts a fresh draft using a local draft key even if the URL is unchanged. Opening a new-draft view performs no create/run request until explicit send.

ADK session IDs in URLs select a view, not authority. Existing page auth must remain; server operation authorization is a known APBM_001 gap. Never accept a user ID or backend endpoint from these new URLs.

## Presentation seam

Implement typed view data/callbacks using existing types where compatible. Logical states from DESIGN/UI_SPEC.md are binding presentation requirements; do not assume the Designer's type names exist in the repo. New code should use a discriminated status instead of magic error strings. Minimum inputs: safe agent presentation, chosen agent/session or local-draft key, recents, transcript, draft, read/send statuses, demo state, and existing-service action callbacks.

For UI fixtures, supply ready/empty/loading/unavailable, missing/access-unavailable, pending, uncertain, confirmed-not-sent, metadata-warning, partial/recovered states explicitly. The fixture service is isolated test tooling. Its responses prove the view reacts correctly; they do not prove a real backend would emit the same state.

For the production adapter, preserve service calls and outcomes; use only evidenced information. Do not guess empty vs unavailable from an inherited service that returns [] for both, or promise not-sent from a generic transport failure. Do not add auto-retry, missing-session recreation or recovery writes in new UI code. Record inherited source deficiencies as APBM_001 limitations. If meeting an AC requires changing the protected connector/service contract, stop the affected item for Architect scope instead of quietly implementing phase 001.

New presentation state must not cross contexts: demo data scoped to available current user/backend/agent context, and draft/UI state to agent/session or new-draft identity. Use existing user context only as a UI partition, never as new authorization. Clear newly introduced user-specific state on logout/identity change. Do not persist demo data. Broad legacy cache/request lifecycle repair remains phase 001; new code must not introduce additional stale-result writes.

## Explicit context boundary

Always show: “Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.” Sample picker/preview/remove and instruction editing operate on fictional in-memory values. No file input, file bytes, upload, instructionsService call, ADK context mutation, GCS request or network autosave. State survives normal same-agent navigation while mounted if practical; reload/reset clears it. Separate agents never share edits. If user identity is unavailable, do not restore prior-user demo state.

## Configuration compatibility

Use safe configured fields (ID, display name, description, optional icon key) without hardcoded agent-specific branches. Preserve existing active IDs/names/bundle/urlEnv mappings; optional presentation fields may be added. Missing descriptions/icons use neutral fallbacks, not fabricated tool/model claims. Do not pass the entire server config to the browser. Render a second deterministic fixture roster with different names/count through identical UI components.

Full backend/user/agent/session ownership, durable history and metadata recovery remain required product outcomes in phase 001. Schema/RLS and real endpoint switching are not authorized here.
