# UI_SPEC — Stark Agent Workspace v1.0

Final design return · recorded 2026-10-04 · FRIDAY Designer → JARVIS Architect.
Fidelity: high-fidelity, interactive demo artifacts. Canonical visual direction approved; engineering launch and Gate Q are separate.

## 1. Purpose and authority

An authenticated workbench for Tony and authorized internal lab users. Configured agents act as workspaces; each contains multiple independent conversations. Directory and conversation derive from the approved canonical workspace. The supplied planning pack governs product/data boundaries. Tony’s latest approval overrides earlier Claude-first, coral/Saira, square-corner and light-default examples. No current app screenshot was required: conversation presentation is grounded in the supplied source extraction.

Verified extraction baseline: `frontend-apbm`, HEAD `20ef380bdd6eed5e111d953d6404992add7a88a6`; active `src/app/globals.scss`; Tailwind 3.4.6; Inter. This is not a claim of a fresh checkout or a live runtime audit.

## 2. Canonical lock

Tony/Architect approved the following wording:

- “Abacus-inspired workspace organization.”
- “Existing charcoal/zinc palette and Inter typography.”
- “Documented contrast and control-boundary adjustments.”
- “12px panels, 10px controls, 16px composer.”
- “Navigation drawer below 1024px.”
- “Collapsible context on narrow screens.”
- “Dark default with saved light/dark preference respected.”
- “Clearly labeled demo-only context and instructions.”

The final authorization also requires preserving familiar message presentation, bubbles, markdown/code and composer character. Context/instructions remain demo-only. There are no model selectors, live uploads, instruction publishing, transcript deletion, edit/regenerate, capacity meters, new agents, backend URL entry or additional backend features.

## 3. Screen and route map

Physical artifact links are explicit and work after the ZIP is extracted with files kept together. Production route syntax is an Architect/Engineer integration decision under the existing authenticated App Router `/chat` shell; these filenames and query strings are not proposed public API contracts.

| Artifact | View identity | Entry and exit |
|---|---|---|
| `agents-directory.html` | Configured roster | Card → selected agent workspace; local filter searches names/descriptions; Choose an agent focuses filter rather than silently choosing a default agent |
| `workspace.html?agent=jarvis` | Agent key | All agents/breadcrumb → directory; New chat → empty conversation; recent row → its conversation |
| `conversation.html?agent=jarvis&session=research-plan` | Full conversation key | Agents → directory; agent breadcrumb → workspace; conversation navigation switches session; New chat opens separate empty draft |
| `style-tile.html` | Design documentation only | Link back to workspace; never a product route |

Production preserves the existing auth gate and sign-in flow. Resolve identity from the verified server session; never treat a client user ID, a display name, or an endpoint URL as a namespace. Authorization failures remain distinct from missing history. There is no replica sign-in screen in this design scope.

## 4. Shared shell, visual tokens and layout

All four artifacts consume the same embedded `TOKENS.css`, Inter faces, `CHAT_TOKENS.css`, `BASE.css` and `screens.css`. Approved core color values are unchanged from the canonical lock. `TOKEN_MAPPING.md` distinguishes retained values, normalized source inconsistencies and new semantic definitions. `TAILWIND_MAPPING.md` describes production scoping, including portals.

| Rule | Desktop 1280px | Tablet 768px | Mobile 375px |
|---|---|---|---|
| Navigation | Persistent 256px sidebar | 64px top bar; modal navigation drawer | Same drawer pattern; icon theme action with accessible name |
| Main content | Flexible, min-width zero; canonical max content width 64rem | Full available width, 24px content gutters | 20px canonical gutters; chat thread 16px, composer 12px |
| Directory | Two card columns | Two card columns | One card column |
| Workspace context | 19rem secondary panel beside recents | Closed disclosure below composer, before recents | Same stacked disclosure |
| Conversation | 48rem max thread and composer; header identifies agent/session | Full-width thread within same maximum | Header title truncates visually; message prose wraps; full title remains in DOM/navigation |
| Chat scrolling | Header/composer are flex siblings of independently scrollable thread | Same | Same; `100dvh`, safe-area bottom padding; composer never overlays messages |
| Tables/code | Scroll inside their own labeled regions when wider than content | Same | Horizontal scroll stays inside component, not page |
| Controls | Minimum 44px action targets | Same | Same; message input 16px to avoid common mobile input zoom |

Drawer changes at 1024px, card grid at 640px. These intentional adaptations retain the canonical shell. Chat header is slightly taller to accommodate agent/session identity and 44px breadcrumb targets. Conversation assistant prose/user bubbles retain the source’s 14px scale; code retains 0.85rem (0.8rem narrow); canonical workspace headings remain 32px desktop/26px mobile. Small metadata is 12px. Inter, not the monospace code font, is the product font.

## 5. Agents directory

Hierarchy: shell → page heading/description → labeled local filter → live count → agent-card grid → preview-only fixture toolbar. Each card is one link with configured icon, display name, description and Open workspace affordance. There are no nested card buttons and no operational tool invocation from a card.

| State query | Visible treatment | Allowed action |
|---|---|---|
| `populated` | Primary fictional presentation of five configured agents | Filter or open workspace |
| `no-results` | “No matching agents”; entered filter preserved | Clear filter |
| `empty` | “No agents configured”; administrator guidance | No fabricated agent creation |
| `loading` | Skeleton cards, spoken loading count | Wait; do not show a fabricated empty roster |
| `unavailable` | “Agent configuration unavailable”; no fallback selected | Try again via configuration read |

`roster=alternate` demonstrates a different two-agent presentation. Generic components depend on fixture/configuration fields, not hardcoded Jarvis behavior. Unknown agent IDs show Agent unavailable and return to directory; never silently substitute another agent. Fixture query controls are explicitly design-only.

## 6. Agent workspace — canonical

Hierarchy: shell → Agents/agent breadcrumb → configured identity/description → new-chat composer → recents and context. Sidebar agent selection and recent conversation links are now real local navigation links; this completes the approved screen rather than changing its visual direction.

New Chat creates a local empty draft in the selected agent scope. A production session is not durable until the service confirms its ID. Workspace composer submits a new conversation in production; the HTML opens a clearly labeled preview dialog because it cannot send messages.

| State query | Visible treatment / behavior |
|---|---|
| `populated` | Four fictional recent conversations; open, rename or archive |
| `empty` | “A fresh start”; Start a conversation action |
| `loading` | Conversation-row skeletons and loading status |
| `unavailable` | “Conversations unavailable”; history not deleted; Try again reads list |
| `partial` | “Conversation details unavailable”; title/archive status unknown; explicit View available conversations |
| `recovered` | “Recovery view”; warns that some listed conversations may have been archived; explicit fallback titles; rename/archive hidden while metadata is unknown |

Row actions use a zinc dialog in this artifact. Rename rejects whitespace-only titles, preserves punctuation safely and returns focus to the row action. Archive hides metadata only; never deletes ADK history. After the focused row disappears, focus moves to Recent conversations. Production must show pending/success/error feedback for metadata operations and keep the row/draft on failure; HTML mutations are local fixture demonstrations.

## 7. Conversation — current chat visual baseline

Reuse the source’s right-aligned zinc user bubbles with 16px radius; assistant responses sit on the page surface with uppercase 12px author label. Retain ReactMarkdown + remarkGfm, tables, inline code, oneDark/oneLight syntax highlighting and native multiline composition. Do not replace the existing renderer with the factory manual’s generic rich-text parser example.

Code retains its 8px radius and original oneDark/oneLight surface character. Copy is persistently visible with a 44px target instead of the source’s small hover-reliant overlay. Assistant copy and conversation copy preserve Markdown; code copy preserves plain code. Clipboard fallback presents selectable text if clipboard permission is unavailable. Read-aloud remains a production reuse candidate with a disabled, explained fallback when browser support is absent. The artifact previews the action and exposes `speech=unavailable`; it does not play audio or qualify browser speech support.

Composer: labeled textarea, empty/whitespace send disabled; Enter sends once, Shift+Enter inserts newline; composing IME events do not submit. Textarea grows to 144px then scrolls internally. Production complete-response behavior remains; the waiting treatment is not a streaming claim. No upload/microphone/edit/regenerate controls.

| State query | Visible copy / treatment | Composer and recovery contract |
|---|---|---|
| `empty` | Chat with configured agent; new separate conversation | Editable local draft; no old session silently reused |
| `populated` | Fictional user/assistant exchange with table/code | Editable; standard copy/read-aloud controls |
| `loading` | Loading conversation | Sending disabled until selected history resolves |
| `unavailable` | History unavailable; history has not been deleted | Sending paused; Try loading again reads this history; Back to workspace |
| `missing` | Conversation not found; not replaced or recreated | Disabled for old session; explicit separate New conversation or Back |
| `unauthorized` | Conversation access unavailable | Disabled; existing app sign-in flow remains authoritative |
| `pending` | User turn Awaiting reply + Waiting for a reply | Same-thread send disabled; other conversations remain available; no resend |
| `uncertain` | Delivery unconfirmed + Send outcome unknown | Paused; Check history is read-only; remain unknown until evidence resolves outcome; no automatic retry or duplicate submit |
| `failed` | Message not sent; request did not leave app | Draft retained and editable; sending requires deliberate user action; use only with positive evidence of non-submission |
| `metadata` | Conversation started; title not saved | Keep durable session and current transcript; allow continuation; Check conversation list must not create a replacement |

Unknown outcome is neither confirmed failure nor a guaranteed pending reply. A transport timeout/cancellation alone does not establish non-submission. Production may move from unknown to confirmed/pending/failed only from contract-supported evidence for this exact conversation. The fixture Check history deliberately remains unconfirmed and makes no network request. The failed fixture is deliberately narrower than “all network errors.”

## 8. Context/instructions: permanent product disclosure

Keep this disclosure in the product: **“Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.”**

Workspace exposes the panel inline at desktop and in a disclosure below 1024px. Conversation has a labeled Context action opening a modal context panel. On mobile its visible action is an icon with the full accessible name “Open demo instructions and context”; the modal visibly displays the disclosure.

Edit instructions opens a labeled textarea and Apply to demo action. Add sample opens a fixed fictional-document picker; Preview displays fictional text; Remove changes only local demo state. No file input, upload status, ingestion indicator, prompt publishing, GCS write, or agent API is present. Production demo state is keyed by backend/user/agent, resets on reload/reset and never crosses users; preview state resets on page navigation/reload. Real backend context may independently affect replies and is not managed here.

## 9. Keyboard, focus and assistive behavior

- Skip to content, semantic navigation/main landmarks, labeled search/input, descriptive icon-action labels. Active agent/session uses `aria-current`; statuses combine icons and text with semantic color.
- Order: shell navigation → breadcrumbs/context → thread links/copy/scroll regions → composer. DOM order matches visual reading order. User text is treated as text, never injected as markup.
- Focus ring: 2px `--ring`, 2px offset; stronger `--input` boundaries for essential controls. Contrast evidence covers both themes. Decorative separators intentionally retain the source border values.
- Modal navigation: initial focus on Close; Tab/Shift+Tab contained, background inert, body scroll locked, Escape/backdrop/Close dismiss and restore opener. Switching to desktop while open closes the drawer and focuses the visible equivalent desktop navigation item.
- Context/edit/sample dialogs follow the same modal contract. Nested edit closes back to its context trigger; closing context restores its header action. If an opener has been removed, focus the nearest surviving logical heading/action.
- Disclosure: native button, Enter/Space, correct `aria-expanded`/`aria-controls`; hidden content removed from tab order. At desktop context is visible without duplicate controls. If resize hides a focused descendant, focus disclosure trigger.
- Loading/pending use polite status announcements; an error region announces the transition without replaying the whole transcript. Production should announce newly completed replies without forcibly moving focus or scrolling a user who is reading earlier content; only follow the end when already there or immediately after own send.
- No animation is required; skeletons are static. Respect reduced-motion if animation is added during implementation. Read-aloud should expose Stop while playing and gracefully disable unavailable support.
- Actual OS keyboard, screen-reader announcement timing, browser zoom and production Radix behavior require implementation QA; preview checks are not certification.

## 10. State ownership and data contracts

Logical names below are design-facing proposals, not a claim these exact types/functions/stores exist. Retain/reconcile existing Zustand and `/services` modules; do not invent a second source of transcript truth.

| Owner / suggested type | Minimum scope/data | Responsibility |
|---|---|---|
| Server config / `WorkspaceAgent` | backendId, agentId, appName, displayName, description, optional icon | Authorized roster/config resolution; URLs remain server-only |
| Session state / `WorkspaceConversation` | backendId + verified userId + agentId + sessionId, title, updatedAt, archived | Active selection, list metadata and scoped pointers |
| Message state / `WorkspaceMessage` | Stable event ID, full conversation key, role, text, delivery state | Correct-thread presentation; ADK is transcript authority |
| History state / `HistoryResult` | Conversation key, request generation, status, messages, safe error | Ignore/segregate stale completions; preserve newer submitted messages |
| Catalogue state / `CatalogueResult` | Backend/user/agent scope, entries, status, reconciliation state | Supabase metadata index + explicit ADK recovery; unknown archive state stays unknown |
| Draft state / `ComposerDraft` | Full conversation key or new-draft key | Draft and pending state remain thread-specific; guard double send |
| Demo state / `InstructionsDemo`, `ContextDemoItem` | Backend/user/agent key; mode mock | Local text/sample interactions only |
| Shell state | theme, drawer, disclosure, dialog opener | next-themes preference; local transient presentation state |

Existing service candidates are agent run/history routes and `src/services/sessionIndexService.ts`; no new API is specified here. Server user resolution is mandatory for protected operations. A late reply cannot replace another selected thread; closing a panel or browser cancellation does not prove an upstream invocation stopped. Logout/user/backend changes invalidate scoped requests/pointers and clear user-specific UI. Reconfiguration to a different session store requires distinct backend identity. Native ADK remains the service boundary; no frontend A2A/Hermes client.

## 11. Client boundaries and implementation mapping

Server responsibilities: existing auth shell, verified identity and server config resolution. Client islands: theme toggle, roster filter, navigation selection, drawer/disclosure, recents actions, composer, transcript actions, dialog/menu focus and demo context. Presentation-only headings/cards may remain server-rendered where existing application composition permits. Production state uses existing Zustand stores or smallest reconciled extensions; actual file names are resolved by Architect/Engineer, not assumed from a partial extraction.

See `COMPONENT_MANIFEST.md` for primitive mapping and two required compositions. No new UI library is needed. Use route-scoped tokens and a scoped portal host; never install preview-global base resets across unrelated routes.

## 12. Preview versus product

| Preview-only | Product behavior retained |
|---|---|
| Footer State/Roster selectors; Design review labels; Style tile link; theme query override | Normal theme toggle and saved preference |
| Fictional names of sessions, static dates/account sample, scripted retry results, local rename/archive | Configured agent identity, server-backed conversation identity and verified operations after engineering |
| Open conversation preview dialog, no-send toast, read-aloud preview notice | Actual authorized complete-response chat and browser speech fallback |
| `?review=0` screenshot switch, `state`, `roster`, `speech` fixture queries | User-readable empty/loading/error/pending/unknown states |
| Local fixtures and in-memory demo reset | **Permanent demo-context disclosure** and local demo-only editing/sample behavior |

PNG renders use `review=0` to show intended product appearance without fixture controls. Their content is still fictional. Never ship the review controls, test URLs, sample account identity or preview notices as live product behavior. Do not remove the demo-context disclosure when removing review labels.

## 13. Acceptance traceability and handoff limits

| Planning seed | Design evidence |
|---|---|
| WS-01, WS-06 | Directory and alternate roster HTML/PNGs; configuration/filter/navigation checks |
| WS-02 | Canonical workspace and six list treatments, linked recents, demo context |
| WS-03 | Actual conversation HTML and both-theme state PNGs, retained table/code/composer |
| WS-04 | Permanent disclosure, sample picker/text editing tests, no file input or external HTTP |
| WS-05 | Both themes at 375/768/1280 for all screens; keyboard/focus and overflow evidence |
| WS-07–WS-13 | Behavior specified only; live persistence, identity, late responses, backend swap and recovery remain APBM_001 validation |
| WS-14 | Indexed design self-checks supplied; independent QA/product/process verdicts remain separate |

Material scope conflicts discovered: none. Assembly decisions (not blockers or a new visual approval round): production route syntax, existing store/API binding, portal host wiring, and schema/RLS/backend namespace reconciliation remain with JARVIS/Engineer. No implementation or Gate Q authorization is implied.
