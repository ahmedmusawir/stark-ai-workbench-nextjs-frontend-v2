# DESIGN_RETURN — Stark Agent Workspace v1.0

**Status: final design artifacts complete; ready for JARVIS Architect reconciliation and APBM_000 assembly.**
Recorded 2026-10-04 · FRIDAY Designer · high-fidelity interactive demo artifacts.

## Canonical approval record

Tony’s latest instruction states: **“canonical workspace and style tile APPROVED.”** JARVIS Architect reviewed the supplied artifacts and accepted the direction as the canonical visual lock. Tony authorized completing the directory/conversation and final package **without another canonical approval round**.

The lock includes Abacus-inspired workspace organization; existing charcoal/zinc and Inter; documented contrast/control-boundary adjustments;12px panels,10px controls,16px composer; navigation drawer below1024px; collapsible narrow-screen context; dark initial default honoring saved choice; explicit demo-only context/instructions.

This record supersedes the first-return “awaiting approval” status. It does not assert that final derived screens have separately passed independent QA. Engineering launch and Gate Q remain separate; completion of this package is design-artifact work only.

## Open in this order

1. `index.html` — clickable screen and PNG index after extraction.
2. `agents-directory.html` → `workspace.html` → `conversation.html` — linked flow. The single-chat screen is an actual HTML artifact with actual rendered PNGs.
3. `style-tile.html` — approved core style system plus inherited chat specimen.
4. `UI_SPEC.md`, `COMPONENT_MANIFEST.md` — screen/state/focus/data boundaries and reuse/addition contract.
5. `TOKEN_MAPPING.md`, `TAILWIND_MAPPING.md` — retained/normalized/new values and route/portal scoping proposal.
6. `EVIDENCE.md`, machine-readable check files, `ARTIFACT_INDEX.md`, `SHA256SUMS.txt`.

All four HTML screens are self-contained with embedded Inter, CSS, inline SVG and fictional fixtures; navigation needs the neighboring HTML files. PNG filenames identify screen, theme, viewport and state. Default HTML opens dark if no saved preference exists. State and roster toolbar is review-only; `?review=0` hides it. PNGs use that product-appearance mode; the demo-context disclosure stays visible.

## Completed deliverables

- Directory, canonical workspace, conversation and style tile: both themes at375/768/1280 CSS pixels.
- 82 PNG files:24 base screen renders,46 additional state/roster renders,12 context/drawer/code/focus views.
- Empty/loading/unavailable, partial metadata recovery, missing-session, access-unavailable, pending-reply, uncertain-send and confirmed-not-sent treatments; no automatic resend.
- Configurable primary/alternate rosters and explicit screen/conversation navigation.
- Approved core `TOKENS.css`, source-aligned `CHAT_TOKENS.css`, proposed `WORKSPACE_TOKENS.scoped.css`, Tailwind3 mapping and notes.
- Full UI/component specs, approval record, architect/engineer briefs, source inventory, rendering/check evidence and fresh file checksums.

## Conversation baseline retained

Source MessageBubble/MessageList/ChatInput informs right-aligned rounded user bubbles, open assistant prose, uppercase author label, Markdown/table rendering, oneDark/oneLight code surfaces and bottom composer. The approved shell adds agent/session identity, explicit navigation and responsive context access. Larger copy targets, visible keyboard focus and the approved limited contrast adjustments improve controls without replacing the familiar chat character. No reference screenshot introduces extra product features.

## Token integration clarified

`TOKENS.css` keeps portable :root/.dark blocks solely for standalone previews. Production proposal scopes identical values to a workbench route container **and a dedicated body portal host**, retaining the existing next-themes provider. Workbench-only dialog/menu variants normalize slate overrides to zinc. Unrelated routes must retain their existing values and shared styles. See `TAILWIND_MAPPING.md`; actual integration is reconciled by Architect/Engineer.

## Evidence and limits

Chromium153.0.8010.0, deviceScaleFactor2, fonts awaited;70 measured render cases plus12 supplemental screenshots. No page-level horizontal overflow, no composer beyond viewport, no rendering script errors or external HTTP requests.63 interaction/scoping checks and66 recorded contrast pairs pass. Representative renders visually inspected for both themes, desktop/tablet/mobile, context/drawer, focus, inherited code and uncertain-send.

This is offline design self-QA. It does not qualify live ADK, Supabase schema/RLS, actual speech playback, OS soft keyboard, all browser/screen-reader combinations, production routing/cascade, persistence, late response isolation, backend swapping, engineering launch or Gate Q. Those retain their planned owners and gates.

## Departures and decisions

Intentional approved departures from source/reference: Abacus organization with existing zinc palette; shared semantic tokens/radii; accessible muted text/control boundaries; scoped zinc menus/dialogs;1024px drawer breakpoint; sample picker instead of uploads. Directory’s Choose an agent action avoids assigning an arbitrary agent before the user selects one. Chat retains source renderer character and enlarges copy/navigation targets. Historical input files in `reference/` support rebuilding and are not the final approved screen entry points.

**Material scope conflicts: none identified. No additional visual approval is requested.**

JARVIS/Engineer assembly items: reconcile production route syntax under existing `/chat`, map logical state/type/service names to actual modules, install scoped portal variants, and retain the planning pack’s backend/user/agent/session boundaries. Actual schema/RLS/backend namespace changes belong to separately authorized engineering, not this design return. No unresolved Tony design decision blocks this package.
