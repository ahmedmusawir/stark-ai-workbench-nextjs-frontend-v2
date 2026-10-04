# COMPONENT_MANIFEST — Stark Agent Workspace v1.0

Canonical appearance approved; mappings are reuse candidates from the supplied source, not proof of production accessibility or complete styling. All screen markup in the package is design-reference code. No new UI library.

| Component / composition | Screens | Existing candidate | Variants, state and work required |
|---|---|---|---|
| Workbench shell | Directory, workspace, conversation | `AppShellPage`, `CyberizeSidebar` | Preserve auth integration; 256px desktop nav, drawer below 1024px; selected leading edge; scoped semantic styles |
| Agent navigation/card | All app screens | `AgentSwitcher`, Card, Button | Configured icon/name/description; active/hover/focus; card is one link; generic roster |
| Directory filter | Directory | Input, Label, native search form | Local only; count status; clear button; no-result/loading/empty/unavailable |
| Breadcrumb/identity | Workspace, conversation | Native links + configured presentation | Agent/session identity; no backend IDs in ordinary chrome; 44px targets |
| Recents and session navigation | Workspace, conversation | `SessionPanel`, Button | Default/empty/loading/unavailable/partial/recovered; selected session; safe fallback title |
| Conversation actions | Workspace | Dialog, Input, Label; DropdownMenu as production alternative | Zinc treatment; rename validation; archive metadata only; restore focus when row changes |
| Composer | Workspace, conversation | Existing `ChatInput`, Textarea/Button | Empty/valid/disabled/pending/unknown; IME-safe Enter; 16px radius; 44px send; omit upload/edit controls |
| Transcript | Conversation | `MessageList`, `MessageBubble` | User bubbles; open assistant prose; real renderer remains ReactMarkdown + remarkGfm; author name from configured presentation |
| Code/table/link | Conversation, tile | Existing Markdown component overrides and SyntaxHighlighter oneDark/oneLight | In-component overflow, keyboard-scrollable region, underlined link; code copy44px; no alternate renderer/library |
| Message actions | Conversation | `MessageActions`, existing copy/read-aloud | Copy Markdown/plain code; fallback selectable text; read-aloud stop/unsupported; no edit/regenerate |
| Status/feedback | All | Existing toast; simple labeled region composition | Polite pending/loading; alert error; explicit unknown vs confirmed not sent; disabled sending where necessary |
| Skeletons | Directory, workspace | CSS composition using existing semantic surfaces | Static, decorative skeletons aria-hidden; one spoken loading status; no separate library |
| Context panel | Workspace, conversation | Card + Button + Dialog + Textarea/Label | Permanent Demo disclosure; sample documents only; local edit/add/remove/preview |
| Theme toggle | All | `ThemeToggle`, next-themes | Dark initial default; preserves stored choice; 44px target and accessible action name |
| Dialog and menu variants | All where needed | Existing Radix Dialog/DropdownMenu wrappers | Normalize slate overrides to approved zinc only for workbench; scoped portal host; verify focus and contrast |
| Navigation drawer | Narrow app screens | **KIP-WS-01**, composition of installed Dialog | Sheet wrapper absent; compose existing package rather than add another |
| Context disclosure | Narrow workspace | **KIP-WS-02**, native button/region | Accordion wrapper absent; simple disclosure meets need |
| Style specimens | Tile only | Same tokens and primitive shapes | Documentation/test controls; exclude from product route |
| Review fixture toolbar | Artifacts only | Native select/button/link | State, roster, hide controls; exclude from product UI |

## KIP-WS-01 — WorkspaceDrawer

Required small composition of the already installed Radix Dialog. Suggested API: `open`, `onOpenChange`, `triggerRef`, `title`, `children`, `side='left'`, `portalContainer`. Width `min(320px, viewport - 32px)`; max viewport height and internal scroll; 65% black backdrop; zinc surface; named dialog; Close button first. Background inert, body scroll locked; Tab/Shift+Tab containment; Escape/backdrop dismiss; opener restoration. At >=1024px close and focus visible equivalent navigation item. Production portal container must carry the workspace token scope. Native HTML `<dialog>` only demonstrates the contract here.

## KIP-WS-02 — WorkspaceContextDisclosure

Required button/region composition, not a general Accordion dependency. API: `title`, `expanded`, `onExpandedChange`, `controlsId`, `children`. Enter/Space toggle; correct aria-expanded/controls; hidden region descendants leave tab sequence. Default closed below1024, always visible at desktop. Preserve user expansion during the mounted view. If resize hides a focused descendant, focus the visible trigger. Do not duplicate IDs or focusable copies.

## Stateful domains and client boundaries

Server: existing verified auth and config resolution. Client islands: filter, selected agent/session, transcript actions, composer, dialogs/drawer/disclosure, demo state, theme. Reconcile with current Zustand/service/type modules; do not assume names missing from the extraction. Thread state is keyed by backend + verified user + agent + session. Demo state is backend/user/agent scoped; only theme is persisted by these standalone previews.

## Known source discrepancies intentionally resolved

- Current drawer switches at768; approved workbench switches at1024.
- Source shell/menu/dialog use inconsistent zinc/slate utilities; workbench variants use semantic zinc.
- Source stylesheet lacks the semantic variable/radius definitions referenced by Tailwind; formalized values are additions, not recovered source definitions.
- Source theme action and code copy are smaller than44px; final design provides larger targets.
- Source code copy silently fails; final contract provides visible/manual-copy feedback.
- Source small muted text/dark link/control borders need the approved limited contrast adjustments.
- Factory default parser/style examples do not override the current ReactMarkdown renderer or Tony’s approved charcoal/Inter lock.

## Implementation checks still required

React/Radix composition, portal ownership, route unmount cleanup, theme initialization, actual screen-reader announcements, browser speech support, real mobile soft keyboard and all API/state race handling. Existing wrappers alone do not establish these properties. Design self-check results are in EVIDENCE.md; Gate Q is separate.
