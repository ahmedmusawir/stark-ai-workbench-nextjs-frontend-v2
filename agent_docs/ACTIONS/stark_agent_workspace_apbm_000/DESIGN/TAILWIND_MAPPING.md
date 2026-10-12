# Tailwind 3 and scoped token integration

Design handoff only. JARVIS and Engineer reconcile this proposal against the application before authorized implementation. Installed extraction: Tailwind3.4.6, active `src/app/globals.scss`, existing `darkMode: ['class']` and shadcn-style HSL mappings. Keep the installed version/plugins; do not use Tailwind4 syntax or a new UI library.

## Why the preview uses :root/.dark

Each HTML file is a standalone document. `TOKENS.css` therefore uses `:root` light variables and `.dark` dark overrides for portability. This is not authorization to globally redefine tokens on unrelated app routes. Loading a stylesheet only from a route does not, by itself, make global selectors safe when CSS survives client navigation.

## Proposed production boundary

`WORKSPACE_TOKENS.scoped.css` contains the same core and conversation values with every `:root` selector replaced by `[data-workspace-theme]` and every `.dark` selector replaced by `.dark [data-workspace-theme]`. The theme class stays on the existing document root; the scope attribute lives on descendants, not on that same root.

1. Keep existing next-themes provider and its application key `theme`. No saved preference → dark. Preserve saved light/dark; do not overwrite a saved choice during mount. Preserve the provider’s existing legacy system preference until the user explicitly chooses light/dark. Preview-only key is `stark-design-theme`; query overrides only select screenshot theme.
2. Mount an explicit workbench route container carrying `data-workspace-theme`. Assign its background/text/font using the scoped semantic values. Descendant Tailwind utility classes then consume inherited variables.
3. Mount a dedicated `data-workspace-theme` portal host under body for workbench dialogs, dropdown menus, popovers and any workbench-specific toast rendered outside the route. Pass that actual host through the installed Radix Portal `container` prop (extend wrappers to forward it if absent). Create the host before opening a portal; avoid a first frame in the unscoped default body portal. Remove host/portals/listeners on workbench unmount.
4. Both route and portal host inherit the existing root dark class, so both resolve the same theme. If Architect chooses subtree themes later, the host must carry the same theme ancestor/scope; this package assumes one existing application theme.
5. Keep overlay, content, labels, buttons and focus styles inside the scoped subtree. For a wrapper that cannot accept a custom container, place the scope attribute directly on both the portaled content and overlay and ensure all token consumers descend from them; Engineer must verify inheritance rather than assuming React ownership scopes CSS.
6. Normalize explicit slate classes only in workbench variants. Imported primitive defaults may contain hardcoded slate classes that override variables; replace those within the variant. Do not globally recolor shared Dialog/DropdownMenu for unrelated routes.
7. Do not install preview `BASE.css`/`screens.css` as global app styles: their body/reset/dialog selectors exist for standalone rendering. Translate compositions into route-scoped selectors or scoped component classes. Scope local base rules such as border color, foreground and Inter as well as variable definitions.

Unrelated siblings outside the route and portal scopes keep existing variables. `INTERACTION_CHECKS.json` includes a small probe demonstrating that property for light and dark; it is not a test of the real application’s cascade. Global Tailwind class definitions do not assign variables globally, but changing shared utility mappings could change existing consumers. Reuse existing semantic mappings where compatible and audit all global mapping edits; prefix additional workbench utilities if a name already has another meaning.

## Tailwind mappings

`TAILWIND_MAPPING.ts` is additive `theme.extend` reference material. Existing background/foreground, card/popover, primary/secondary, muted/accent, border/input/ring/destructive mappings already reference CSS variables in the supplied config. Add sidebar/composer/bubble/link/overlay/status/code roles only where absent. Preserve font and plugin configuration. Use alpha-compatible `hsl(var(--token) / <alpha-value>)`.

| UI | Utility intent / token |
|---|---|
| Page | bg-background text-foreground inside workbench scope |
| Panels | bg-card text-card-foreground rounded-lg (12px) |
| Menus/dialogs | bg-popover text-popover-foreground rounded-lg; scoped portal |
| Buttons/inputs/links styled as controls | rounded-md (10px); border-input when boundary is essential |
| Composer | bg-composer rounded-composer (16px), border-input |
| User bubble | bg-bubble text-foreground, rounded-composer |
| Selected row | bg-accent text-accent-foreground plus visible leading indicator |
| Decorative separators | border-border, not sole essential field boundary |
| Focus | ring color from --ring with2px outline and2px offset |
| Status | semantic color + text/icon; not color-only meaning |
| Code | code surface/text/syntax roles from CHAT_TOKENS.css; radius8px |

`lg` is the approved1024px shell breakpoint. Existing Tailwind radius formulas remain `lg:var(--radius)`, `md:calc(var(--radius) - 2px)`, `sm:calc(var(--radius) - 4px)`; composer and code receive explicit role mappings. No chart/financial/tenant-management tokens are introduced.

## Portal illustration, not application implementation

```tsx
// Logical structure for reconciliation; not a patch against actual imports.
<div data-workspace-theme>{/* workbench shell */}</div>
// Body sibling, mounted/owned by this route:
<div data-workspace-theme ref={setWorkspacePortalHost} />
// Existing Radix wrapper forwards a stable mounted host:
<DialogPortal container={workspacePortalHost}>{/* overlay + content */}</DialogPortal>
```

Preserve the approved appearance. Token installation strategy, route ownership and wrapper signatures are engineering reconciliation choices, not a reason to reopen canonical visual approval.
