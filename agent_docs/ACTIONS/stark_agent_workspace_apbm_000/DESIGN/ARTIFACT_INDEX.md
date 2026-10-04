# ARTIFACT_INDEX — final design return v1.0

Open `index.html` for clickable review. All image content is fictional design data.

## Main files

| File | Purpose |
|---|---|
| [agents-directory.html](agents-directory.html) | Configured agents, local filter and explicit workspace links |
| [workspace.html](workspace.html) | Approved canonical workspace with recents/context |
| [conversation.html](conversation.html) | Explicit single-chat screen, inherited message presentation and send states |
| [style-tile.html](style-tile.html) | Approved core visual system and chat specimen |
| [UI_SPEC.md](UI_SPEC.md) | Complete screen/state/responsive/focus/data contract |
| [COMPONENT_MANIFEST.md](COMPONENT_MANIFEST.md) | Reuse mapping and required drawer/disclosure additions |
| [TOKENS.css](TOKENS.css) | Portable approved core values, standalone selectors |
| [CHAT_TOKENS.css](CHAT_TOKENS.css) | Inherited code appearance semantic roles |
| [WORKSPACE_TOKENS.scoped.css](WORKSPACE_TOKENS.scoped.css) | Proposed route/portal scope, same visual values |
| [TAILWIND_MAPPING.ts](TAILWIND_MAPPING.ts) | Additive Tailwind3 mapping reference |
| [TAILWIND_MAPPING.md](TAILWIND_MAPPING.md) | Production integration, selector/portal boundary and utility notes |
| [TOKEN_MAPPING.md](TOKEN_MAPPING.md) | Existing/normalized/new provenance |
| [DESIGN_RETURN.md](DESIGN_RETURN.md) | Canonical approval record, outcome and reconciliation decisions |
| [ARCHITECT_HANDOFF.md](ARCHITECT_HANDOFF.md) | JARVIS assembly brief |
| [ENGINEER_BRIEF.md](ENGINEER_BRIEF.md) | Contract for separately authorized implementation |
| [SOURCE_INVENTORY.md](SOURCE_INVENTORY.md) | Planning/factory/source consultation inventory |
| [EVIDENCE.md](EVIDENCE.md) | Rendering procedure, checks and limitations |
| [RENDER_CHECKS.json](RENDER_CHECKS.json) | 70 measured renders and12 additional screenshot filenames |
| [INTERACTION_CHECKS.json](INTERACTION_CHECKS.json) | 63 local assertions including scoped portal probe |
| [CONTRAST_CHECKS.json](CONTRAST_CHECKS.json) | 66 pair-level contrast calculations |
| [ARTIFACT_CHECKS.json](ARTIFACT_CHECKS.json) | Package artifact checks |
| [SHA256SUMS.txt](SHA256SUMS.txt) | SHA256 per shipped file except checksum manifest itself |

## Rebuild/reference files

`build_final.py`, `BASE.css`, `screens.css`, `interactions.js`, `fixtures.json`, `icons.json`, `token-values.json`, `render_final.cjs`, `check_final.cjs`, `verify_artifacts.py`; offline Inter weights/license in `assets/`. `reference/` contains original canonical HTML/CSS/JS used as build inputs. These are historical inputs, not final screen entry points.

## Measured PNGs

375×900 mobile,768×1000 tablet,1280×1000 desktop CSS viewports; device scale2. Conversation uses viewport capture; others full-page.

| PNG | Screen | Theme | CSS width | State / roster |
|---|---|---|---:|---|
| [agents-directory-dark-375.png](previews/agents-directory-dark-375.png) | agents-directory | dark | 375 | populated / primary |
| [agents-directory-dark-768.png](previews/agents-directory-dark-768.png) | agents-directory | dark | 768 | populated / primary |
| [agents-directory-dark-1280.png](previews/agents-directory-dark-1280.png) | agents-directory | dark | 1280 | populated / primary |
| [agents-directory-light-375.png](previews/agents-directory-light-375.png) | agents-directory | light | 375 | populated / primary |
| [agents-directory-light-768.png](previews/agents-directory-light-768.png) | agents-directory | light | 768 | populated / primary |
| [agents-directory-light-1280.png](previews/agents-directory-light-1280.png) | agents-directory | light | 1280 | populated / primary |
| [workspace-dark-375.png](previews/workspace-dark-375.png) | workspace | dark | 375 | populated / primary |
| [workspace-dark-768.png](previews/workspace-dark-768.png) | workspace | dark | 768 | populated / primary |
| [workspace-dark-1280.png](previews/workspace-dark-1280.png) | workspace | dark | 1280 | populated / primary |
| [workspace-light-375.png](previews/workspace-light-375.png) | workspace | light | 375 | populated / primary |
| [workspace-light-768.png](previews/workspace-light-768.png) | workspace | light | 768 | populated / primary |
| [workspace-light-1280.png](previews/workspace-light-1280.png) | workspace | light | 1280 | populated / primary |
| [conversation-dark-375.png](previews/conversation-dark-375.png) | conversation | dark | 375 | populated / primary |
| [conversation-dark-768.png](previews/conversation-dark-768.png) | conversation | dark | 768 | populated / primary |
| [conversation-dark-1280.png](previews/conversation-dark-1280.png) | conversation | dark | 1280 | populated / primary |
| [conversation-light-375.png](previews/conversation-light-375.png) | conversation | light | 375 | populated / primary |
| [conversation-light-768.png](previews/conversation-light-768.png) | conversation | light | 768 | populated / primary |
| [conversation-light-1280.png](previews/conversation-light-1280.png) | conversation | light | 1280 | populated / primary |
| [style-tile-dark-375.png](previews/style-tile-dark-375.png) | style-tile | dark | 375 | populated / primary |
| [style-tile-dark-768.png](previews/style-tile-dark-768.png) | style-tile | dark | 768 | populated / primary |
| [style-tile-dark-1280.png](previews/style-tile-dark-1280.png) | style-tile | dark | 1280 | populated / primary |
| [style-tile-light-375.png](previews/style-tile-light-375.png) | style-tile | light | 375 | populated / primary |
| [style-tile-light-768.png](previews/style-tile-light-768.png) | style-tile | light | 768 | populated / primary |
| [style-tile-light-1280.png](previews/style-tile-light-1280.png) | style-tile | light | 1280 | populated / primary |
| [agents-directory-dark-1280-empty.png](previews/agents-directory-dark-1280-empty.png) | agents-directory | dark | 1280 | empty / primary |
| [agents-directory-dark-1280-no-results.png](previews/agents-directory-dark-1280-no-results.png) | agents-directory | dark | 1280 | no-results / primary |
| [agents-directory-dark-1280-loading.png](previews/agents-directory-dark-1280-loading.png) | agents-directory | dark | 1280 | loading / primary |
| [agents-directory-dark-1280-unavailable.png](previews/agents-directory-dark-1280-unavailable.png) | agents-directory | dark | 1280 | unavailable / primary |
| [workspace-dark-1280-empty.png](previews/workspace-dark-1280-empty.png) | workspace | dark | 1280 | empty / primary |
| [workspace-dark-1280-loading.png](previews/workspace-dark-1280-loading.png) | workspace | dark | 1280 | loading / primary |
| [workspace-dark-1280-unavailable.png](previews/workspace-dark-1280-unavailable.png) | workspace | dark | 1280 | unavailable / primary |
| [workspace-dark-1280-partial.png](previews/workspace-dark-1280-partial.png) | workspace | dark | 1280 | partial / primary |
| [workspace-dark-1280-recovered.png](previews/workspace-dark-1280-recovered.png) | workspace | dark | 1280 | recovered / primary |
| [conversation-dark-1280-empty.png](previews/conversation-dark-1280-empty.png) | conversation | dark | 1280 | empty / primary |
| [conversation-dark-1280-loading.png](previews/conversation-dark-1280-loading.png) | conversation | dark | 1280 | loading / primary |
| [conversation-dark-1280-unavailable.png](previews/conversation-dark-1280-unavailable.png) | conversation | dark | 1280 | unavailable / primary |
| [conversation-dark-1280-missing.png](previews/conversation-dark-1280-missing.png) | conversation | dark | 1280 | missing / primary |
| [conversation-dark-1280-pending.png](previews/conversation-dark-1280-pending.png) | conversation | dark | 1280 | pending / primary |
| [conversation-dark-1280-uncertain.png](previews/conversation-dark-1280-uncertain.png) | conversation | dark | 1280 | uncertain / primary |
| [conversation-dark-1280-failed.png](previews/conversation-dark-1280-failed.png) | conversation | dark | 1280 | failed / primary |
| [conversation-dark-1280-metadata.png](previews/conversation-dark-1280-metadata.png) | conversation | dark | 1280 | metadata / primary |
| [conversation-dark-1280-unauthorized.png](previews/conversation-dark-1280-unauthorized.png) | conversation | dark | 1280 | unauthorized / primary |
| [conversation-dark-375-missing.png](previews/conversation-dark-375-missing.png) | conversation | dark | 375 | missing / primary |
| [conversation-dark-375-pending.png](previews/conversation-dark-375-pending.png) | conversation | dark | 375 | pending / primary |
| [conversation-dark-375-uncertain.png](previews/conversation-dark-375-uncertain.png) | conversation | dark | 375 | uncertain / primary |
| [conversation-dark-375-failed.png](previews/conversation-dark-375-failed.png) | conversation | dark | 375 | failed / primary |
| [agents-directory-dark-1280-alternate.png](previews/agents-directory-dark-1280-alternate.png) | agents-directory | dark | 1280 | populated / alternate |
| [agents-directory-light-1280-empty.png](previews/agents-directory-light-1280-empty.png) | agents-directory | light | 1280 | empty / primary |
| [agents-directory-light-1280-no-results.png](previews/agents-directory-light-1280-no-results.png) | agents-directory | light | 1280 | no-results / primary |
| [agents-directory-light-1280-loading.png](previews/agents-directory-light-1280-loading.png) | agents-directory | light | 1280 | loading / primary |
| [agents-directory-light-1280-unavailable.png](previews/agents-directory-light-1280-unavailable.png) | agents-directory | light | 1280 | unavailable / primary |
| [workspace-light-1280-empty.png](previews/workspace-light-1280-empty.png) | workspace | light | 1280 | empty / primary |
| [workspace-light-1280-loading.png](previews/workspace-light-1280-loading.png) | workspace | light | 1280 | loading / primary |
| [workspace-light-1280-unavailable.png](previews/workspace-light-1280-unavailable.png) | workspace | light | 1280 | unavailable / primary |
| [workspace-light-1280-partial.png](previews/workspace-light-1280-partial.png) | workspace | light | 1280 | partial / primary |
| [workspace-light-1280-recovered.png](previews/workspace-light-1280-recovered.png) | workspace | light | 1280 | recovered / primary |
| [conversation-light-1280-empty.png](previews/conversation-light-1280-empty.png) | conversation | light | 1280 | empty / primary |
| [conversation-light-1280-loading.png](previews/conversation-light-1280-loading.png) | conversation | light | 1280 | loading / primary |
| [conversation-light-1280-unavailable.png](previews/conversation-light-1280-unavailable.png) | conversation | light | 1280 | unavailable / primary |
| [conversation-light-1280-missing.png](previews/conversation-light-1280-missing.png) | conversation | light | 1280 | missing / primary |
| [conversation-light-1280-pending.png](previews/conversation-light-1280-pending.png) | conversation | light | 1280 | pending / primary |
| [conversation-light-1280-uncertain.png](previews/conversation-light-1280-uncertain.png) | conversation | light | 1280 | uncertain / primary |
| [conversation-light-1280-failed.png](previews/conversation-light-1280-failed.png) | conversation | light | 1280 | failed / primary |
| [conversation-light-1280-metadata.png](previews/conversation-light-1280-metadata.png) | conversation | light | 1280 | metadata / primary |
| [conversation-light-1280-unauthorized.png](previews/conversation-light-1280-unauthorized.png) | conversation | light | 1280 | unauthorized / primary |
| [conversation-light-375-missing.png](previews/conversation-light-375-missing.png) | conversation | light | 375 | missing / primary |
| [conversation-light-375-pending.png](previews/conversation-light-375-pending.png) | conversation | light | 375 | pending / primary |
| [conversation-light-375-uncertain.png](previews/conversation-light-375-uncertain.png) | conversation | light | 375 | uncertain / primary |
| [conversation-light-375-failed.png](previews/conversation-light-375-failed.png) | conversation | light | 375 | failed / primary |
| [agents-directory-light-1280-alternate.png](previews/agents-directory-light-1280-alternate.png) | agents-directory | light | 1280 | populated / alternate |

## Supplementary PNGs

| PNG | Purpose |
|---|---|
| [agents-directory-dark-1280-focus.png](previews/agents-directory-dark-1280-focus.png) | focus |
| [agents-directory-light-1280-focus.png](previews/agents-directory-light-1280-focus.png) | focus |
| [workspace-dark-375-context.png](previews/workspace-dark-375-context.png) | context |
| [workspace-light-375-context.png](previews/workspace-light-375-context.png) | context |
| [conversation-dark-375-context.png](previews/conversation-dark-375-context.png) | context |
| [conversation-dark-375-navigation.png](previews/conversation-dark-375-navigation.png) | navigation |
| [conversation-dark-375-code.png](previews/conversation-dark-375-code.png) | code |
| [conversation-dark-375-focus.png](previews/conversation-dark-375-focus.png) | focus |
| [conversation-light-375-context.png](previews/conversation-light-375-context.png) | context |
| [conversation-light-375-navigation.png](previews/conversation-light-375-navigation.png) | navigation |
| [conversation-light-375-code.png](previews/conversation-light-375-code.png) | code |
| [conversation-light-375-focus.png](previews/conversation-light-375-focus.png) | focus |
