# Allowed changes and protected areas

Engineer records exact paths before editing in EXECUTION_LOG.md. These bounded families allow normal composition without returning for each small new component. Check each file's actual consumers; a shared file is allowed only for a backward-compatible workbench opt-in or direct scoped fix, never a global redesign.

| Path / family | Permitted purpose |
|---|---|
| src/app/(cyberize)/chat/** | Page/view controller, components, scoped styles; preserve existing service callbacks; remove out-of-scope controls from refreshed surface |
| src/components/workspace/** (new) | Directory/workspace, context demo, presentational state adapter, drawer/disclosure and workbench-only variants |
| src/components/chat/{AgentSwitcher,SessionPanel}.tsx | Generic configured presentation and existing callback reuse |
| src/components/layout/CyberizeSidebar.tsx; src/components/common/AppShellPage.tsx; src/app/(cyberize)/layout.tsx | Workbench-only shell variant/integration preserving auth calls and non-chat defaults |
| src/components/global/ThemeToggle.tsx | Accessible 44px target through optional variant or compatible improvement |
| src/components/ui/{dialog,dropdown-menu}.tsx | Optional portal-container/variant forwarding with unchanged default behavior; prefer scoped composition if no base edit needed |
| src/store/workspaceUiStore.ts (new) | Transient draft/demo/shell presentation state; do not replace legacy chat persistence |
| src/config/manifest.ts; config/agents.manifest.json; src/types/index.ts | Safe optional presentation fields/projection and compatible types only; no endpoint, mode, agent ID/app name or bundle mapping changes |
| src/app/globals.scss; tailwind.config.ts | Namespaced workbench styles/additive noncolliding mapping only, no global palette/reset replacement |
| src/__tests__/** | Relevant component/config/composition regressions; roster-independent fixture repair for touched tests; preserve test meaning and report changes |
| tests/workspace/** (new); playwright.workspace.config.ts (new) | Isolated controlled-fixture browser harness/specs; never an auth bypass served by normal app |
| package.json | Add scoped test script(s) only, keeping dependency declarations unchanged |
| This module / agent_docs/RESPONSES / agent_docs/SESSIONS | Implementation records, factual returns, QAM facts/evidence as seat permits |
| CHANGELOG.md; RECOVERY.md; existing root session log convention | Append concise actual work/status under repository logging rules; preserve unrelated content |

The exact source module exists in recon for common files; new paths are explicitly marked. If a required import/type lives outside these paths, name the smallest additional file and reason before editing it. Do not use a wildcard as an excuse to rewrite unrelated content under an allowed directory.

Protected: src/app/api/**, existing src/services/**, src/store/chatStore.ts and useAuthStore.ts, src/utils/supabase/**, auth/role logic, src/proxy.ts, Supabase schema/RLS/migrations/data, .env files, next.config.js, package-lock.json/dependency versions, inactive stylesheet src/styles/global.scss, backend repos, cloud/GCS/GHL/Hermes/A2A state. Do not delete or modify archived modules, existing evidence, or frozen acceptance/design/reference bodies.

No commits, staging, checkout, reset, stash, clean, branch creation, merge, push, deployment, destructive operation, dependency upgrade or live business operation. Normal file edits, local builds and fixture tests within scope are authorized. A pre-existing browser can be used; a missing executable/install permission is an environment gap, not permission to weaken tests or fetch arbitrary binaries.

Metadata-only source drift from the recorded baseline can be recorded and continued if product/config/dependencies are identical. Product drift, protected-path necessity or unexpected concurrent edits require one bounded stop report. Do not restore Tony's intentional deletions or stage them with this module unless he explicitly chooses to.
