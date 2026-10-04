# TOKEN_MAPPING — approved canonical appearance v1.0

Status: canonical workspace and style tile APPROVED by Tony; accepted as visual lock by JARVIS Architect. Recorded 2026-10-04. Provenance labels below retain the distinction between source values and design additions.

Source snapshot: frontend-apbm, full HEAD `20ef380bdd6eed5e111d953d6404992add7a88a6`. This is an inspected extraction, not a fresh live-repo audit. `src/app/globals.scss` is active; Inter; Tailwind 3.4.6 recorded by extraction.

No semantic color definitions or shared `--radius` existed in the inspected source. Every variable definition in TOKENS.css is therefore new formalization. “Retained” below means its numeric color and use come from explicit source utilities.

| Token | Light | Dark | Provenance / approved design treatment |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#3F3F46` | Retained page colors: root layout / AppShellPage. |
| `--foreground` | `#18181B` | `#F4F4F5` | Retained normal text colors: root layout / AppShellPage. |
| `--card` | `#FAFAFA` | `#27272A` | New semantic assignment using existing zinc palette, chosen for panels/secondary controls and paired text. |
| `--card-foreground` | `#18181B` | `#F4F4F5` | New semantic assignment using existing zinc palette, chosen for panels/secondary controls and paired text. |
| `--popover` | `#FFFFFF` | `#27272A` | Normalized workspace menus/dialogs from slate to zinc. White/zinc-800 surface; normal foreground. Scoped variants only. |
| `--popover-foreground` | `#18181B` | `#F4F4F5` | Normalized workspace menus/dialogs from slate to zinc. White/zinc-800 surface; normal foreground. Scoped variants only. |
| `--primary` | `#18181B` | `#F4F4F5` | Retained enabled send-control colors, ChatInput. |
| `--primary-foreground` | `#FFFFFF` | `#18181B` | Retained enabled send-control text colors, ChatInput. |
| `--secondary` | `#F4F4F5` | `#52525B` | New semantic assignment using existing zinc palette, chosen for panels/secondary controls and paired text. |
| `--secondary-foreground` | `#18181B` | `#F4F4F5` | New semantic assignment using existing zinc palette, chosen for panels/secondary controls and paired text. |
| `--muted` | `#F4F4F5` | `#52525B` | New semantic assignment using existing zinc palette, chosen for panels/secondary controls and paired text. |
| `--muted-foreground` | `#62626B` | `#C6C6CD` | Normalized for small text across all workbench surfaces: source #71717A / #A1A1AA → #62626B / #C6C6CD. |
| `--accent` | `#E4E4E7` | `#3F3F46` | Retained selected AgentSwitcher/SessionPanel surfaces. |
| `--accent-foreground` | `#18181B` | `#F4F4F5` | Retained selected-row text colors. |
| `--border` | `#E4E4E7` | `#52525B` | Retained decorative sidebar/composer separators; no longer the sole field boundary. |
| `--input` | `#71717A` | `#A1A1AA` | Proposed stronger field/control boundary: source zinc-200 / zinc-600 → zinc-500 / zinc-400. Decorative --border stays unchanged. |
| `--ring` | `#18181B` | `#F4F4F5` | Retained composer focus colors; extended to all workspace focus indicators. |
| `--sidebar` | `#FAFAFA` | `#27272A` | Retained CyberizeSidebar surfaces. |
| `--composer` | `#FAFAFA` | `#27272A` | Retained ChatInput surfaces. |
| `--bubble` | `#F4F4F5` | `#52525B` | Retained MessageBubble surfaces. |
| `--link` | `#2563EB` | `#93C5FD` | Retain light blue-600; dark blue-400 → blue-300 for readability on page. Used in the conversation renderer, not a new feature. |
| `--destructive` | `#B91C1C` | `#FCA5A5` | Retained MessageList error text; formalized semantic use. |
| `--destructive-foreground` | `#FFFFFF` | `#18181B` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--success` | `#166534` | `#86EFAC` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--success-foreground` | `#FFFFFF` | `#18181B` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--warning` | `#92400E` | `#FCD34D` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--warning-foreground` | `#FFFFFF` | `#18181B` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--info` | `#2563EB` | `#93C5FD` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--info-foreground` | `#FFFFFF` | `#18181B` | Proposed missing status role/pairing. Labels/icons accompany color; no brand recoloring. |
| `--overlay` | `#000000` | `#000000` | Retained black hue; proposed 65% alpha consolidates existing 50% drawer / 80% dialog. |

## Readability adjustments

Original dark muted text #A1A1AA on #3F3F46: 4.07:1. Proposed #C6C6CD: 6.15:1. The shared muted token also reaches 4.55:1 on the brighter message/secondary surface.
#71717A works on white but has insufficient contrast on selected light zinc-200. Proposed #62626B maintains a single secondary-text token across the surfaces. Dark link text is similarly lifted one existing blue step.

66 foreground/background, status-fill, boundary, focus and code pairs calculated; all meet the recorded minimums. See CONTRAST_CHECKS.json. Focus and theme screenshots supplement these calculations. This does not certify the real app or all future component combinations.

## Shape and type definitions

- Inter is retained. The previews embed real Inter 400/500/600/700 fonts for offline fidelity; assets/OFL.txt contains the license. Production retains next/font, not embedded preview fonts.
- `--radius: .75rem` (12px) is proposed for panels/dialogs. Existing Tailwind formulas yield 10px controls and 8px small elements. `--radius-composer: 1rem` retains the existing rounded-2xl composer shape. These are workspace-only definitions, not a house-style change.
- 32px desktop / 26px mobile heading; 16px body and textarea; 14px UI; 12px metadata. These are proposed layout scales.
- 4px-based spacing and 44px minimum action targets; sizes are defined in TOKENS.css.
- Decorative dividers retain existing low-contrast borders. Inputs, composer and outlined controls use stronger --input; selected navigation also has a high-contrast leading edge.
- No chart tokens: this scope contains no chart. No financial/role tokens or additional modes are imported from Cyber Pharma.

## Conversation renderer additions

The familiar chat appearance is retained from MessageBubble/MessageList/ChatInput rather than copied from Abacus. `CHAT_TOKENS.css` exposes the code theme roles separately; core `TOKENS.css` values remain identical to the canonical approval. Explicit source renderer styling is not evidence these semantic variable names previously existed.

| Role | Light HSL | Dark HSL | Treatment |
|---|---|---|---|
| code-background | 230 1% 98% | 220 13% 18% | Source-aligned oneLight/oneDark surface |
| code-foreground | 230 8% 24% | 220 14% 71% | Source-aligned code text |
| code-keyword | 301 63% 40% | 286 60% 67% | oneLight/oneDark keyword specimen |
| code-string | 119 34% 32% | 95 38% 62% | oneLight/oneDark string specimen |
| code-radius | 8px | 8px | Retains explicit source syntax-block radius |
| thread-width | 48rem | 48rem | Retains the source max-w-3xl thread/composer character |

The six code text/keyword/string pairs range from4.77:1 to10.85:1. These validate the displayed specimen, not every syntax class/language in the production highlighter. Production should retain oneDark/oneLight and check any additional token pairs it uses. No new code palette replaces the inherited renderer.

## Existing values, normalized inconsistencies, new definitions

- **Retained numerical source values:** page/sidebar/composer, normal text, primary send, selected surfaces, user bubbles, decorative borders, light links, existing error text, code theme surfaces and typography.
- **Normalized source inconsistencies:** workbench slate dialog/menu overrides → zinc; secondary text/dark link/essential control contrast adjustments; composer focus extended consistently to controls; overlay alpha consolidated. Approval covers these limited visual adjustments.
- **New semantic definitions:** variable names and shared radius values were absent; panels/status pairings, spacing/type scale, input boundary role and code-role names are formalized design additions. Approved12/10/16 geometry does not change unrelated factory themes.

## Integration boundary (supersedes first-return root installation guidance)

Do not merge the standalone :root/.dark preview blocks globally into application base styles. Use a workbench descendant scope and equivalent portal host. See `TAILWIND_MAPPING.md` and `WORKSPACE_TOKENS.scoped.css` for the exact proposed boundary, dark inheritance and menu/dialog treatment. Reconcile with the existing cascade before implementation; preserve approved colors and radii.

The real app retains next-themes and key `theme`. The preview uses separate key `stark-design-theme`; `?theme=light` or `?theme=dark` pins a screenshot without overwriting a saved choice. Remove that query to test persistence. The native HTML preview introduces no UI library and is not application source.
