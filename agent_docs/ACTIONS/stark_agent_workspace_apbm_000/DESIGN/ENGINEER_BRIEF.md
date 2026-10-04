# Engineer brief — design contract for later authorized implementation

This file describes the eventual implementation target; it does not launch engineering.

Scope: existing workbench shell/navigation and agent directory/workspace/conversation content; workbench semantic token scope and portal variants; existing chat presentation; two small missing drawer/disclosure compositions; accessible local demo context. Reconcile actual route/store/service file names with JARVIS; use the existing App Router, Tailwind3, Zustand and installed UI primitives.

Preserve MessageBubble/MessageList/ChatInput character, ReactMarkdown/remarkGfm and oneDark/oneLight. Keep multiple resumable conversation identities, separate pending states and backend/user/agent/session boundaries. Distinguish history unavailable, missing, pending, unknown send outcome and confirmed not sent. Unknown never automatically resends. Missing never silently recreates. Metadata failure never discards a successfully established session ID.

Match root HTML screens and their corresponding theme/viewport PNGs. Follow UI_SPEC for layout, copy, state semantics and keyboard behavior; COMPONENT_MANIFEST for candidate reuse and additions; TOKEN_MAPPING/TAILWIND_MAPPING for source provenance and scoped integration. Honor saved theme; default dark when absent. Workbench dialogs/menus rendered through portals must inherit its tokens while unrelated routes keep existing appearance.

Do not copy standalone global CSS resets or embedded fixture scripts directly into application globals. Do not ship review toolbar/fixture query controls, preview-only notices, static account data or scripted service outcomes. Keep the permanent demo-context disclosure. No live uploads, instruction publishing, backend picker, model selector, transcript deletion, edit/regenerate, streaming rewrite or additional backend feature is introduced.

Do not change unrelated routes/shared primitive appearance, auth ownership, backend deployment, schema/RLS, services, dependencies or hosting outside a separately authorized plan. Existing wrappers are not evidence of accessibility completeness. Actual service/state correctness and production validation remain engineering work and independent QA.

Acceptance targets for APBM_000 reconciliation: configured roster/filter/navigation; approved canonical shell; actual conversation with retained rendering; all required states; explicitly local context samples; both themes at375/768/1280 without page overflow; composer and keyboard focus remain reachable; scoped token installation does not leak. Design evidence is supplied for comparison, not as pre-earned production passes.
