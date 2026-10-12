# Stark Agent Workspace APBM pilot — frontend/ADK recon

**Status:** Independent recon complete; live capability probe **BLOCKED/INCONCLUSIVE**. This is engineering evidence for authoring, not product acceptance, Gate Q, or deployment certification.

**Prepared:** 2026-10-03 23:47:22 +0600 — Asia/Dhaka (UTC+06:00). Filename uses that timezone.
**Specimen:** `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2`, branch `frontend-apbm`, HEAD `20ef380bdd6eed5e111d953d6404992add7a88a6`.
**Engineer:** Claudy seat, executed through Codex.
**Authority:** User launch + `agent_docs/PLANNING/STARK_AGENT_WORKSPACE_KICKOFF_v0_1.md`, especially §3. Installed skill: `_SKILLS/stark-recon-skill-v1.1/CLAUDE.md` → `SKILL.md` → `templates/RECON_MISSION.md`, report template and evidence discipline. The kickoff controls the eight-section format, uppercase `RECON`, packaging, read-only Git identity queries, and conditional live probe. Historical module launch/approval instructions were not activated.

**Labels:** **EVIDENCE (observed)** means a fresh command result; **EVIDENCE (source-derived)** means verified code/document content, not proof of live behavior; **INFERENCE** is a consequence inferred from that source; **CLAIM** is unverified historical/Director context; **GAP** is unresolved evidence; **QUESTION** is a decision for JARVIS/Tony.

## 1. Director summary

- **EVIDENCE (observed):** The selected root, sanitized origin, branch and full HEAD match the requested frontend specimen. Existing work was preserved; no sibling repository was inspected.
- **EVIDENCE (source-derived):** Multi-conversation code already exists: New Chat, per-agent index, select/resume, rename/archive, last-active pointers and ADK create/run/history operations. This is an inherited capability to validate and repair, not a missing greenfield feature (§3, §5).
- **GAP:** Live persistence is unproved. The configured ADK target is **loopback**, despite its `v1` alias; the intended deployed service/version, authorized test identity and safe general-chat agent are not established. Probe use: **0 sessions, 0 submissions, 0 reads** (§4).
- **EVIDENCE (source-derived) / INFERENCE:** A late reply or history response can update the wrong conversation under the same agent. State and completions are keyed by agent, without an active-session/request-generation check (§5.4).
- **EVIDENCE (source-derived):** Protected pages do not protect the agent APIs. Run/history trust client `user_id`; proxy refreshes auth but does not reject callers. The Supabase index has owner RLS in SQL; that is a separate boundary and its deployed state is unverified (§5.3).
- **EVIDENCE (observed):** TypeScript passes. Jest: **26 passing / 10 failing suites; 225 passing / 38 failing tests, 263 total**. Failures expose old-roster assumptions. The July green board is not this checkout's baseline (§2.3).
- **EVIDENCE (observed):** Build fails fetching Inter from Google Fonts; lint fails on the current `next lint` script; audit cannot reach the npm registry. No usable Playwright suite or browser executable was found, and the runtime disallows socket creation (§2.3).
- **EVIDENCE (source-derived):** Reuse the chat renderer, composer, shell and service boundary. Instruction saves already have a live GCS path sharing the chat mode flag, conflicting with the pilot's mock/display-only intent; isolate that behavior in an authorized phase (§5.5, §6).
- **QUESTION / next action:** JARVIS should establish target/roster/test identity/tool safety, settle ownership and index/history recovery rules, obtain the missing design references, then author the brief, contract and short two-phase package. This recon supports neither a backend rewrite nor a claim that backend changes are unnecessary (§7).

## 2. Repo/runtime identity and check results

### 2.1 Specimen and instructions

**EVIDENCE (observed):** `git --no-optional-locks rev-parse --show-toplevel`, `branch --show-current`, `rev-parse HEAD`, sanitized `remote get-url origin`, and `status --short --untracked-files=all` establish:

| Field | Result |
|---|---|
| Root | `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2` |
| Sanitized origin | `github.com/ahmedmusawir/stark-ai-workbench-nextjs-frontend-v2.git` |
| Branch | `frontend-apbm` |
| Full HEAD | `20ef380bdd6eed5e111d953d6404992add7a88a6` |
| Package identity | `adk-agent-harness-nextjs-frontend-v1`, version `0.1.0`, private; inherited name differs from new repo |
| Initial tracked change | `CHANGELOG.md`, from this conversation's earlier session initialization |
| Initial untracked files | Kickoff packet; `session_2026-10-03.md`; `agent_docs/RESPONSES/response_2026-10-03_233630_session-and-response-logging.md` |
| Preserved evidence | 345 tracked-file SHA-256 baseline; old `CURRENT_APP` modules and prior recon reports preserved |

**EVIDENCE (source-derived):** Root `CLAUDE.md` supplies logging/recovery/scope conventions. No root or ancestor `AGENTS.md` exists in the checked ancestry. The nested `CURRENT_APP/app-factory-frontend-first-module/AGENTS.md` points to its historical module instructions; the current launch explicitly limits those modules to evidence. `RECOVERY.md` still describes a parked July `bim-005` state and references an absent July 26 session file. Its old actions are not current authorization. A current recon notice is added above, preserving the historical text.

**EVIDENCE (observed):** The expected new checkout is identified by root + origin + branch. No claim is made about the original repository's state because it was deliberately not inspected.

### 2.2 Stack, scripts and configuration availability

**EVIDENCE (observed):** Installed package metadata matches the lockfile for all direct dependencies checked. `package-lock.json` is npm lockfile v3. No `packageManager`, `engines.node` or `.nvmrc` pin was found. Runtime: Node **26.7.0**, npm **11.19.0**. Full installed snapshot: supporting `inventory.json`.

| Component | Declared | Installed |
|---|---|---|
| Next.js | `^16.2.1` | `16.2.6` |
| React / React DOM | `^19.2.4` | `19.2.4` |
| TypeScript | `^5` | `5.5.4` |
| Tailwind | `^3.4.1` | `3.4.6` |
| Zustand | `^4.5.4` | `4.5.4` |
| Supabase SSR / JS | `^0.6.1` / `^2.44.0` | `0.6.1` / `2.106.1` |
| Jest / ts-jest | `^30.0.5` / `^29.4.1` | `30.0.5` / `29.4.1` |
| Playwright test | `^1.59.1` | `1.59.1` |
| Sass | `^1.77.6` | `1.77.8` |
| GCS storage | `^7.21.0` | `7.21.0` |

**EVIDENCE (source-derived):** `package.json:5` exposes `dev`, `build`, `start`, `lint`, `test`, `test:integration`, `test:e2e`, `test:e2e:ui`. Scripts and setup were inspected before checks: Jest is rooted in `src`, uses ts-jest and per-file jsdom, with fake auth fixture defaults and mocked external seams. `test:integration` is a subset of the full Jest run, so it was not repeated. Playwright scripts exist, but no Playwright config/imports/usable tests were found; indiscriminately invoking it could collect Jest files. No dependencies or browser binaries were installed.

**EVIDENCE (observed, privately parsed):** Configuration values were inspected programmatically and suppressed. Report only names, availability, and derived routing classification:

| Names | Availability / implication |
|---|---|
| `NEXT_PUBLIC_CHAT_MODE` | Present; selects the live service branches in this checkout |
| `ADK_BUNDLE_URL_V1` | Present; valid **loopback HTTP** target; not an established Google Cloud deployment |
| `ADK_BUNDLE_URL_V2_LOCAL` | Absent; no current agent references its declared bundle |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SECRET_KEY` | Present; no login, user lookup, database read or credential validity test performed |
| `GCS_BUCKET`, `GCS_BASE_FOLDER` | Absent; current instruction route would reject known agents for missing configuration |
| `GOOGLE_APPLICATION_CREDENTIALS` | Not configured in inspected environment; ADC availability not inspected or inferred |
| `ADK_WRAPPER_URL`, `NEXT_PUBLIC_API_BASE_URL`, Stripe-related variables | Present legacy/unrelated entries; current chat connector does not consume them |

**GAP:** A configured value does not establish service availability, deployment revision, database schema or a designated test account. No secret-bearing argument, environment dump, private history or configured endpoint value appears in the package.

### 2.3 Fresh checks — run once, failures preserved

**EVIDENCE (observed):** Exact commands, exit statuses and measured durations are in `check-results.json`. Builds used telemetry suppression and normal project configuration; TypeScript disabled incremental output for this check. No automatic fix command ran.

| Check | Exit | Outcome and limit |
|---|---:|---|
| `npm test -- --runInBand --watch=false` | 1 | 36 suites: 26 pass / 10 fail. 263 tests: 225 pass / 38 fail. Wrapper elapsed 31.75s; Jest reported 30.249s. Mocked/component evidence only. |
| `./node_modules/.bin/tsc --noEmit --incremental false` | 0 | No diagnostics; 11.64s. Type correctness does not prove current manifest behavior or live integration. |
| `npm run build` | 1 | 19.94s; Next 16.2.6 Turbopack cannot fetch Inter from Google Fonts. Compilation/route-table completion not obtained. No product build defect inferred beyond this observed blocker. |
| `npm run lint` | 1 | 0.82s; `next lint` interpreted as an invalid project directory ending `/lint`. Existing script issue; unchanged. |
| `npm audit --json --fetch-retries=0 --fetch-timeout=20000 --cache <recon scratch>/npm-cache` | 1 | 1.52s; registry DNS `EAI_AGAIN`. Vulnerability status **unknown**, not zero. No audit fix or install. |
| Anonymous local boot prerequisite | 1 | `socket.socket()` raises `PermissionError: [Errno 1] Operation not permitted` before starting a dev server. Zero local HTTP requests, no server to clean up. |
| Browser availability | Inspection | Playwright installed; Chromium/Firefox/WebKit executables absent; no system browser or browser connector available. No screenshot or interactive verification claimed. |

**EVIDENCE (observed) / EVIDENCE (source-derived):** The failed suites line up with the replacement manifest roster while tests still name greeting/Jarvis/other removed agents. Route/instruction tests using retired agents are rejected before their mocked upstream expectations. Breakdown:

| Failing suite under `src/__tests__/` | Failed tests |
|---|---:|
| `api/agent-run.test.ts` | 9 |
| `api/agent-history.test.ts` | 7 |
| `api/instructions-route.test.ts` | 8 |
| `chat/chatStore.persist.test.ts` | 3 |
| `chat/chatStore.modeSplit.test.ts` | 1 |
| `config/manifest.test.ts` | 1 |
| `chat/SessionPanel.test.tsx` | 6 |
| `chat/ChatPageContent.test.tsx` | 1 |
| `chat/MessageList.loading.test.tsx` | 1 |
| `chat/AgentSwitcher.test.tsx` | 1 |

Examples: `SessionPanel.test.tsx:34` assumes greeting is the reset default, while `src/config/manifest.ts:99` uses the first current manifest agent; `ChatPageContent.test.tsx:77` searches for an old-agent placeholder; `config/manifest.test.ts:118` requires the original five names. API failures expecting 200/502 instead receive 400 for the removed agent. Passing connector, renderer, speech, hydration, service and store tests are useful, but do not erase these failures or exercise live persistence. Full failure titles are retained in `test-results.json`; no test edits or reruns were made.

### 2.4 Day-0 sweep and skill questionnaire coverage

**EVIDENCE (source-derived/observed):** The skill's actual questionnaire is `templates/RECON_MISSION.md`; no separate `RECON_QUESTIONNAIRE.md` or standalone canonical Architect questionnaire/playbook was found in the selected checkout. The installed questionnaire was executed, with unavailable runtime steps recorded as gaps. Its numbering omits §7; its open-ended section covers the report template's Surprises requirement.

| Skill section | Fresh result / evidence |
|---|---|
| 0 — day-0 | Manifest/store/service/route paths and actual exports inspected before interpretation. Concrete source paths extracted from historical module instructions exist. Env names checked against example + source + private availability. Build attempted; compiled route table blocked. `inspection-evidence.json` preserves path/grep inventory. |
| 1 — stack | Installed versions and lock agreement above; Jest, not the historical Vitest claim. Next 16, not historical project-spine Next 15. |
| 2 — structure | `src/services`, `store`, `types`, `utils`, `config` exist; six app groups: public, auth, cyberize, members, admin, superadmin. `src/proxy.ts` is active; no root `src/middleware.ts`. Services include chat, index, instructions, and old mock profile service. |
| 3 — auth | Direct Supabase primitives + Zustand auth store; no `authService`. `AppRole` is in `src/utils/app-role.ts:16`, re-exported by `get-user-role.ts`. Auth store has user/role/isAuthenticated/isLoading/login/logout, not derived isAdmin/isMember/isSuperadmin flags. API boundary findings in §5.3. |
| 4 — design | Tailwind v3 HSL-variable mappings in `tailwind.config.ts`, but no `:root`/`.dark` semantic variable definitions found in scanned source. Active stylesheet `src/app/globals.scss`; duplicate `src/styles/global.scss` has no found import. Sass nesting/comments prevent assuming a CSS rename. Inter uses next/font; class-based next-themes defaults dark. **257 numbered-color matching lines across 47 app/component files** (265/49 including the remaining source styles). Designer must reconcile tokens; dark readability unverified without browser. |
| 5 — database | No migrations directory. Two setup SQL files declare `profiles`, `user_roles`, `chat_sessions`, enum `app_role`, and `handle_new_user`/`on_auth_user_created`; own-row RLS is present in source. Trigger defaults role to member. Actual deployed schema/policies and ADK tables were not inspected. |
| 6 — skills/security/env | Root CWD resolves `_SKILLS/stark-recon-skill-v1.1` and `.claude/skills/{stark-frontend-first,frontend-design,skill-creator}`. Only recon activated. No central env-validation instrumentation found. Security audit unavailable. Root CLAUDE/WINDSURF documents exist; root AGENTS/GEMINI/PROJECT_POINTER absent. |
| 8 — demo/residue | `/demo` = `src/app/(public)/demo/{page,DemoPageContent}.tsx`; `/template` = `src/app/template/{page,TemplatePageContent}.tsx`, using kit primitives, no dedicated demo service/store cascade found. `api/auth/login/route.ts:11` retains a GET probe querying `posts` (not called). No third-party dummy-data API match. Legacy wrapper comments and unused `profileService` remain; cleanup is optional. |
| 9 — packaging | `tsconfig.json:39` excludes `agent_docs/**`; Jest roots are `src` (`jest.config.js:19`). Three historical TypeScript templates under agent_docs stay outside scope. `.claude` templates also exist; current tsc passes. No new test scaffolding created. |
| 10/13 — surprises | Multiple-session UI already landed; target alias points locally; tests track retired roster; GCS and chat share a live flag; race/identity gaps; historical recovery and doc links drift (§6). `cn()` in `src/lib/utils.ts:4` is standard `twMerge(clsx(...))`. Two-level source tree is in supporting evidence. |
| 11 — nav/auth states | Four Navbar variants include ThemeToggler; Cyberize sidebar and mobile top bar include ThemeToggle. Public home is auth-aware (`src/app/(public)/page.tsx:6`; NavbarHome). Public nav links are commented out, with Login/theme/account controls outside hidden nav; role destinations live in home tiles. Other kit navs hide links below `sm` without a shown hamburger; scope any changes explicitly. Current home is a centered hero, so split-hero breakpoint check is N/A. App shell uses persistent sidebar at `md`, drawer below. |
| 12 — verification | Fresh whole-source scans: 0 `dangerouslySetInnerHTML`, 0 `user_metadata.(is_|role)` direct reads, 0 `getStaticProps/getServerSideProps`, 0 ts-ignore/ts-nocheck; 4 non-test explicit-any sites plus 53 test lines. No browser seam walk, dark-mode acceptance or boot-success claim. No deletion/cache-clearing ritual needed because nothing was deleted. |

**EVIDENCE (source-derived):** The four non-test any sites are `src/store/useAuthStore.ts:6`, `src/utils/supabase/server.ts:6`, `src/components/ui/command.tsx:35`, `src/app/(cyberize)/chat/MessageBubble.tsx:85`. Grep absence of direct metadata role reads is not a full security audit.

**GAP / drift:** `agent_docs/README.md` is an inherited CyberBugs index: all 16 relative document links checked are missing. The old `_project` contains APP_BRIEF, DATA_CONTRACT and UI_SPEC, but no FILE_TREE. `reference/`, the central APP_FACTORY directory, `ARCHITECT_PLAYBOOK.md`, `FFM_PLAYBOOK.md`, and fresh ABM/QAM result packages were not found. `agent_docs/ACTIONS/` exists and is empty; the kickoff's proposed QAM paths do not conflict with an existing populated structure.

## 3. Session capability matrix

All runtime results below distinguish tests from deployed behavior.

| Capability | Source present / reachable UI | Exercised result | Evidence | Remaining gap |
|---|---|---|---|---|
| Agent selection and mapping | Manifest → sidebar → `/chat`; all five current agents use bundle `v1` | Structural resolution tests pass; legacy roster assertions fail | `config/agents.manifest.json:1`; `src/config/manifest.ts:93`; `AgentSwitcher.tsx:19` | Deployment roster/version not verified |
| New conversation | New Chat clears active pointer/messages; first successful run creates ADK session | Store session tests pass; panel tests fail old-default assumptions | `SessionPanel.tsx:48`; `chatStore.ts:183`; `adk.ts:187` | Live creation not exercised; empty never-sent chats have no durable identity |
| ADK create/run | Native REST connector; no Python wrapper in current path | `api/adk-lib.test.ts` passes with mocked fetch | `adk.ts:135`, `:156`, `:180` | Supported deployed contract unknown |
| Conversation list | Browser Supabase `chat_sessions` query per agent; RLS expected to scope owner | Mock index tests pass | `sessionIndexService.ts:46`; `chat_sessions_setup.sql:13` | Table installation, RLS and live access unverified; no backend list fallback |
| Reopen/switch same agent | Row activates its ADK ID, clears agent message slot and refetches | Store behavior tested; no live/browser multi-thread proof | `SessionPanel.tsx:53`; `chatStore.ts:173`; `ChatPageContent.tsx:101` | Stale completion races; index/history consistency |
| Reload active thread | Selected agent + per-agent active IDs persisted; index/history fetched after hydration | Hydration tests pass; some persistence tests fail stale defaults | `chatStore.ts:198`; `ChatPageContent.tsx:70` | User/backend scope and live durability unverified |
| Continue an existing thread | Existing session ID sent to `/run` | Connector flow tests pass with fixtures | `ChatPageContent.tsx:143`; `adk.ts:193` | No A/B append/isolation experiment performed |
| History normalization | Native GET session → user/model text → UI messages | Connector normalization tests pass | `adk.ts:79`; `history/route.ts:44` | Only first text part retained; no deployed event-shape verification |
| Ownership | Layout validates Supabase user/role; index SQL owner RLS | Auth guard tests pass against mocks | `actions.ts:7`; `chat_sessions_setup.sql:25` | Run/history do not bind client ID to authenticated server user |
| Missing/error recovery | Missing run session creates + retries once; history/index failures degrade empty | Fixture/service tests cover parts of this policy | `adk.ts:196`; `chatService.ts:78`; `sessionIndexService.ts:59` | Missing vs unavailable conflated; recovery can lose discoverability |
| Rename/archive | Existing panel + optimistic index mutations; archive hides, no transcript deletion | Mock service tests pass; UI tests stale | `SessionPanel.tsx:63`; `sessionIndexService.ts:135` | Retention in pilot is JARVIS's scope decision, not automatic added acceptance |
| Streaming/partial delivery | No streaming UI or `/run_sse` client; complete event-array response only | No streaming exercise | `adk.ts:161`, `:212` | Partial-response recovery unsupported; no requirement to add streaming inferred |
| Mock conversations | In-memory index and seeded histories; generic response for new agent names | Mock contracts/store tested | `mocks/responses.ts:21`; `chatService.ts:97` | Generated exchanges are not added to mock history; switching/reload cannot demonstrate new-thread persistence |

Abbreviated filenames in this table refer to `src/components/chat/`, `src/store/`, `src/app/(cyberize)/chat/`, `src/app/api/agent/_lib/`, `src/app/api/agent/`, `src/services/`, `src/utils/supabase/`, or `supabase/` as expanded in §5 and the evidence index.

## 4. Live probe result, budget and limitations

**Verdict: BLOCKED/INCONCLUSIVE.** This is a prerequisite/configuration gap, not an observed backend failure.

| Required prerequisite | Evidence / blocker |
|---|---|
| Intended deployed endpoint | Current manifest routes every agent via `ADK_BUNDLE_URL_V1`; private parsing classifies that configured URL as loopback HTTP. The packet prefers deployed Google Cloud ADK v1. No authorized alternative deployed target or deployed revision is established. No switch was made. |
| Authorized test identity | No designated test identity supplied in launch/kickoff or current operational evidence. Project keys and fake Jest user IDs are not an authorized live test account. No personal login/browser state was reused or searched. |
| Existing harmless general-chat agent | Current roster: `architect_agent`, `hermes_agent`, `designer_agent`, `devops_agent`, `ghl_mcp_agent`. Names provide no tool-safety guarantee; local source has no definitions of their deployed tools. The old greeting agent is absent from the active manifest. |
| Runtime access | Socket creation denied in this execution environment; no usable browser. These are additional access limitations, not evidence about ADK capability. |

**EVIDENCE (observed action ledger):** **0/2 new sessions; 0/4 message submissions; 0/12 read requests.** No schema discovery, ADK call, Supabase query, sign-in, private-history access, tool action, instruction operation, deletion or cloud operation was performed. There are **no new test sessions** for Tony to dispose of. Supporting `live-probe.json` records the complete outcome.

**EVIDENCE (source-derived):** Automatic retry review completed before deciding: `adk.ts:55` treats any HTTP 404 or matching “session not found” body as missing; `:196` creates and submits `/run` once more. A later authorized probe must count actual upstream message submissions, not merely four frontend clicks. Ordinary timeout/rate-limit responses are not retried by `chatService`, but the broad missing-session predicate deserves attention. After an ambiguous timeout, inspect only that new test history within the read budget; do not blindly resend.

**GAP:** No claim of A/B storage isolation, model recall, deployed Supabase history, across-restart durability, authenticated UI reload or frontend-to-backend success is possible from this run. A direct future ADK success would establish only backend behavior for the tested case, not the frontend/index flow. The UI operations exist in source; authenticated browser exercise is unavailable.

## 5. Reusable UI and integration code; shapes and identity rules

### 5.1 Connection and lifecycle

**EVIDENCE (source-derived):** Current path is:

```text
AgentSwitcher / SessionPanel
  → Zustand selectedAgent + active session pointer
  → ChatPageContent → chatService
  → Next POST /api/agent/run or /api/agent/history
  → manifest agent → bundle.urlEnv → server-side configured base URL
  → native ADK api_server session path /run

Conversation catalogue:
  ChatPageContent / SessionPanel → sessionIndexService
  → browser Supabase client → public.chat_sessions (owner RLS expected)
```

There is no current wrapper HTTP hop or A2A/Hermes client protocol. A manifest agent named Hermes does not establish a Hermes deployment. `src/config/manifest.ts:14` imports only the active manifest, not `config/agents.manifest copy.json`.

**EVIDENCE (source-derived):** On load, hydration restores selection/pointers; `ChatPageContent.tsx:70` waits for a client-store user ID, fetches the selected agent's index, optionally inserts “Restored chat” for a pointer absent from the list, then fetches history. On selection, `activateSession` clears the agent's messages to undefined to trigger refetch. New Chat clears the pointer and renders a loaded-empty thread. First reply sets the returned ID, then asynchronously creates an index row titled from the first message, truncated to roughly 50 characters. Later sends touch `updated_at`. See `ChatPageContent.tsx:50`, `:137`, `:166`; `sessionIndexService.ts:25`.

### 5.2 Actual source contracts

**EVIDENCE (source-derived):** These are the implemented frontend and upstream shapes, not a newly invented API. `src/types/index.ts:82`; `run/route.ts:25`; `history/route.ts:22`; `adk.ts:124`.

| Operation | Implemented request | Implemented response / effect |
|---|---|---|
| Browser send | `POST /api/agent/run` JSON `{agent_name, message, user_id, session_id: string|null}` | `{response: string, session_id: string}` |
| Browser history | `POST /api/agent/history` JSON `{agent_name, user_id, session_id}` | `{history: [{role: "user"|"assistant", content: string}]}` |
| Native create | `POST <base>/apps/<encoded-agent>/users/<encoded-user>/sessions/<encoded-id>` with `{}` | Connector requires success, ignores body |
| Native run | `POST <base>/run` with `{app_name, user_id, session_id, new_message: {role: "user", parts: [{text: message}]}}` | Event array; reverse scan for last model-role event with text; first nonempty text part only |
| Native history | GET same scoped session path | Session object with `events`; user/model roles mapped; other/non-text events dropped |
| Index list | Supabase select `id,agent_name,adk_session_id,title,created_at,updated_at,archived`; filter agent + unarchived; descending updated time | `SessionIndexEntry[]`; failure becomes `[]` |
| Index insert | Authenticated Supabase user ID + agent, ADK ID, auto-title | Index row or `null`; unique `(user_id, agent_name, adk_session_id)` in SQL |

**EVIDENCE (source-derived):** Native create uses `session-${Date.now()}` (`adk.ts:53`), not a UUID. Native scope contains app/agent + user + session; frontend namespace lacks backend identity. **INFERENCE:** Same-millisecond creation under the same app/user can collide; no collision handling or idempotency key is supplied. The connector's nominal run deadline is 90 seconds with 75-second run and 10-second create caps; history 30 seconds. `remainingMs` floors at 1ms, so this is request timeout budgeting, not a strict cancellation of all future work at deadline. No session-list route exists in this frontend; lists come from the Supabase index.

### 5.3 Ownership and state residency

**EVIDENCE (source-derived):** Login calls Supabase password auth and queries `user_roles` (`src/app/api/auth/login/route.ts:29`). Page layouts call server `protectPage` → `auth.getUser` → role lookup (`src/utils/supabase/actions.ts:7`; `(cyberize)/layout.tsx:15`). The chat user ID itself comes from persisted `useAuthStore.user` in the browser (`ChatPageContent.tsx:36`), not a server-returned identity bound to each agent API request.

Run/history handlers accept the body with a TypeScript cast, validate agent membership, and trust `user_id`/`session_id`. They do not call server `auth.getUser` or verify ownership; optional inbound Authorization is forwarded verbatim. Browser `chatService` sends no Authorization header. `src/proxy.ts:4` invokes cookie refresh; `src/utils/supabase/middleware.ts:36` explicitly does not redirect or enforce access. **INFERENCE:** Calling the APIs directly bypasses the page gate; arbitrary client identities can reach the configured upstream subject to its unknown auth policy. This does not prove access to another person's deployed history, and no such test was attempted.

Index insert separately obtains `auth.getUser()` in the browser (`sessionIndexService.ts:35`); list/update rely on Supabase RLS, not an explicit user filter. `supabase/chat_sessions_setup.sql:25` defines own-row select/insert/update and no delete policy. Index authorization does not secure ADK run/history. Deployed policies remain a **GAP**.

| State | Owner and location | Scope / persistence |
|---|---|---|
| Transcript/events | ADK session service, reached by connector | Intended upstream truth; actual backing database/version/retention not established here |
| Conversation catalogue | Supabase `chat_sessions` via browser service | Source schema stores owner/agent/ADK ID/title/timestamps/archive, no transcript column; live existence unverified |
| Last active conversation + selected agent | Zustand persisted localStorage | Keys split live/mock, but not user or backend; only pointers + selection persist |
| Loaded messages + conversation lists | Zustand memory | One active message array per agent, lost on reload; index cache also not persisted |
| Reply/history loading and errors | Zustand memory | Global flags/error, not per conversation |
| Auth display/session snapshot | Supabase cookies plus persisted `auth-store` | Page auth verified separately; browser store may be stale relative to server identity |
| Next.js connector | Stateless per request | No transcript database or durable catalogue in this server |

**EVIDENCE (source-derived):** Cyberize sidebar logout resets chat state (`CyberizeSidebar.tsx:30`); common `components/auth/Logout.tsx:10` calls auth logout without resetting chat. **INFERENCE:** Other logout/login paths and account changes can retain user-unspecific pointers/caches. Switching a bundle behind the same agent name also retains pointers/index entries because neither carries backend identity. In-flight completions can repopulate state after a reset. These are lifecycle gaps to test, not proof of a live data leak.

### 5.4 Conversation races and recovery

**EVIDENCE (source-derived), with consequences marked INFERENCE:** No cancellation/generation/session ownership check appears in chat effects or send completions.

| Trigger | Code mechanism and consequence |
|---|---|
| A history starts; switch to B under same agent; A finishes last | `ChatPageContent.tsx:118` writes with `setMessagesForAgent(selectedAgent, history)` at `:124`; `chatStore.ts:130` overwrites the sole agent slot. **INFERENCE:** B can display A's fetched history; reverse completion can overwrite newer B messages. |
| Send in A; switch to B or New Chat under same agent | Send completion at `ChatPageContent.tsx:160` appends to that agent's current array. If the send began without a session, `:169` sets its newly returned ID unconditionally. **INFERENCE:** Reply can appear in B; first reply can also replace B's active pointer. |
| Switch agents during request | Captured `selectedAgent` keeps message writes associated with the originating agent; this is useful. Global `isLoading`/`isHistoryLoading` and errors remain shared, so the visible agent can show another agent's pending/finished state. No evidence supports claiming every late reply changes agent identity. |
| Send while history loads | Composer checks `isLoading`, not `isHistoryLoading` (`ChatInput.tsx:31`, `:44`). **INFERENCE:** A later history replacement can erase a newly appended local user/reply display. |
| Switch during initial index/history load | `hasMountedRef` suppresses switching until initial async load finishes (`ChatPageContent.tsx:70`, `:101`); changing the ref alone does not trigger an effect. **INFERENCE:** Rapid initial selection can leave the new agent without its intended load until another relevant render/selection. |
| History missing/offline/unauthorized/malformed | Route normalizes successful missing-events payload to `[]`; non-OK route responses become `[]` in service. UI cannot distinguish empty from unavailable. No explicit retry/error state for history. |
| Index fails or new-row insert fails | List becomes `[]`; insertion becomes `null`. Chat proceeds. Only current local pointer may recover a lost row later. **INFERENCE:** Starting another chat before recovery can leave an ADK session undiscoverable from UI. No ADK list reconciliation exists. |
| Archived/index mismatch | Adoption checks only the unarchived list and attempts insert for missing pointer. **INFERENCE:** An existing archived row can cause unique-conflict fallback; pointer may still fetch history while catalogue hides it. Row-level backend/session existence is not verified before adoption. |
| Missing ADK session on continuation | Any 404/matching text triggers create + one repeat submission (`adk.ts:196`). **INFERENCE:** It can recreate an empty session under a stale ID instead of visibly reporting lost history; an unrelated 404 is also treated as missing session. |
| Timeout after accepted run | Client returns an error sentinel; no idempotency/event cursor or follow-up recovery. **INFERENCE:** Backend may have appended despite UI error; a newly generated ID can be lost before index creation. Blind retry risks duplicate/new conversations. |
| Error sentinel | `chatService.ts:55` resolves with error text as response. UI appends it as assistant text; existing sessions can still have updated timestamps. No discriminated success/error result. |
| Edit/regenerate | UI truncates only memory and resends into the same ADK session (`ChatPageContent.tsx:196`, `:221`). **INFERENCE:** Upstream history is not edited/truncated; reload can show original and repeated turns. Scope/meaning requires a ruling if retained. |

**EVIDENCE (source-derived):** No streaming path exists. The parser ignores event partial/final/tool semantics and retains only first text parts. **GAP:** Deployed multi-part/partial events and cancellation behavior were not exercised. Do not certify interrupted responses or infer a new streaming feature requirement.

### 5.5 Reuse inventory

| Area | Reuse candidate and limit |
|---|---|
| Shell | `AppShellPage.tsx:148`, Cyberize layout/sidebar: desktop sidebar, mobile drawer, theme slot, Escape/backdrop close. Source notes no focus trap; drawer and desktop sidebar each instantiate stateful children. Browser accessibility/responsive behavior unverified. |
| Agent navigation | Manifest loader + `AgentSwitcher`: names/labels and bundles exist; agent cards, descriptions and per-agent landing/workspace routes do not. Global `/chat` handles every selection. |
| Conversation UI | `SessionPanel`: New Chat, titles, active selection, rename/archive. Reuse after concurrency/identity/error decisions. Buttons remain usable during pending sends. |
| Composer | `ChatInput`: autogrow, trimmed submit, Enter/Shift+Enter, loading disable, edit affordance. Draft/edit state not explicitly scoped to a session. |
| Renderer/accessibility | `MessageBubble`: react-markdown + GFM tables, syntax highlight, copy; MessageActions + speech utility provide read-aloud and copy. Existing unit suites pass. Preserve useful functionality. |
| Service boundary | `chatService`, connector parsers, `sessionIndexService`, types. Keep transcript retrieval in ADK; do not add a duplicate transcript store by assumption. |
| Auth | Reuse existing Supabase clients, page guards, role resolution and login; agent APIs need a separate explicit identity contract. |
| Documents | `AttachmentMenu.tsx:48` only logs/calls optional callbacks; ChatPageContent wires no upload handlers. No ingestion or attachment transport. Pilot needs an interactive mock clearly declaring nothing is sent to the agent. |
| Instructions | Existing Mission Control is **not reliably mock-only**: `instructionsService.ts:20` shares the live chat mode, GET/PUT route can read/write GCS. UI hardcodes four retired agents (`MissionControlPageContent.tsx:12`), all rejected by current manifest, and falsely says saves are mock. Missing GCS settings are not an intentional mock boundary. Preserve source during recon; scope a display/mock-only pilot boundary explicitly. |
| Design tokens | Tailwind v3/SCSS and working theme components are reusable foundations; widespread numbered colors and absent semantic variable definitions require a deliberate design contract. No locked pilot tokens exist. |

**GAP (Designer handoff):** The two Claude Projects screens and current frontend screenshot named in the kickoff are not in the clone. Six historical `adk-streamlit-*.png` files are present under the old module's `_design/`; filenames are not proof they are the new references. Their images/private screen contents were not exported. No fresh screenshot was possible. The available `_extraction` is the old Streamlit conversion extraction, not proof of the separately mentioned ADK v2 brain-drain or current deployed v1. No sibling extraction was opened.

## 6. Necessary pilot work, blocking unknowns and optional cleanup

### Necessary outcomes to scope — proposals, not repair authorization

1. **INFERENCE from §3–5:** Reconcile chosen live roster, manifest consumers, mock fixtures and test assumptions. Preserve inherited multi-conversation code; make agent directory/workspace/conversation views concrete through design rather than rewriting the connector by default.
2. **INFERENCE:** Bind API identity to a verified server session and define ownership at the upstream seam. Scope pointers/index/request state by authenticated user, agent and backend where needed; decide invalidation on identity/target changes.
3. **INFERENCE:** Ensure stale history/reply completions cannot modify another active conversation; define per-thread pending/error behavior, rapid switching, first reply after New Chat, and logout during requests.
4. **INFERENCE:** Make unavailable history/index distinguishable from empty data, define recoverable index failures, missing/archived sessions and ambiguous send outcomes. Preserve ADK as transcript authority unless evidence forces a ruled change.
5. **EVIDENCE of existing conflict:** Decouple the pilot's mock/display-only instructions/context panels from live GCS operations while preserving an approved real chat connection. Explicitly label document mocks; do not call tools or ingest documents as part of this pilot.
6. **INFERENCE:** Restore a meaningful regression baseline and add focused browser coverage in the authorized build phases; do not equate 225 passing unit tests with a certified app.

### Blocking unknowns / decisions

| ID | Specific unresolved item | What resolves it; unaffected work |
|---|---|---|
| B1 | Intended deployed backend and revision versus configured local target | JARVIS/Tony designate and attest endpoint/revision and active roster. Source/UI authoring can continue, but do not freeze a claimed live contract from the `v1` name. |
| B2 | No authorized test identity or verified tool-safe general-chat agent | Designate an existing test account and safe agent/disabled consequential tools with evidence. Do not infer safety from agent name or reuse personal history. |
| B3 | ADK session service durability and actual index schema/RLS | Authorized new-session A/B probe and owner-scoped schema/access evidence. No direct queries of ADK-owned tables. Source SQL alone cannot prove installation. |
| B4 | API identity, backend namespace and index/history consistency rules | JARVIS settles ownership boundary, account/target switching, failure recovery, missing-session behavior. Engineer informs initial data contract from actual source. |
| B5 | Missing visual references and pilot design contract | Supply the lab references through the planning handoff; agree cards, descriptions, routes, context panels, tokens and responsive states. Does not block technical recon. |
| B6 | Execution environment and browser baseline | A runtime with socket/browser access and font/registry access for relevant checks; browser binaries only installed in a separately authorized phase/environment. Current build/audit/browser limitations do not prove backend failure. |
| B7 | Retain or omit existing rename/archive/edit/regenerate/live Mission Control | Explicit scope ruling. These are present or inherited quirks; discovery does not make them mandatory pilot additions. |

### Historical drift and optional cleanup kept separate

**EVIDENCE (source-derived):** Old modules explain the current layers: BIM000 baseline, BIM001 mode-flagged wrapper seam, BIM002 native connector, BIM003 manifest, BIM004 multi-session index/UI, BIM005 GCS editor, FIX001 pointer persistence, FIX002 selection/loading/error wording, FIX003 hydration/mode split, FEAT001 copy/read-aloud. Their files were inspected as historical provenance only; their old “next step”, “approved”, scope freezes and cloud/manual gates were not resumed.

**EVIDENCE (observed) / CLAIM comparison:** The August 29 recon reported the same failing suite/test totals and roster drift; today's fresh run independently reproduces those totals. Its `bim-005`/uncommitted state and successful build claims do not describe this new branch/current check. `RECOVERY.md`'s old 263-green board conflicts with fresh results. `BACKEND_SWAP_NOTES.md` still calls for a wrapper/mock swap, but source already speaks native ADK and indexes multiple conversations. Original `_project/CLAUDE.md` names Next 15/Vitest/sonner while this repo uses Next 16/Jest/Radix toast.

**Optional, not a pilot blocker unless touched:** Retired wrapper/AppConfig comments; unused mock profile service/types; unused `DashboardCard`; manifest backup JSON; duplicate stylesheet; starter `/demo` and `/template`; obsolete `api/auth/logout/route-1.ts`; inherited branding/metadata; old doc index links; existing lint tool setup; type-any sites. `SuperadminSidebar` and `ui/command` have real consumers here and must not be blindly deleted based on another recon example. No cleanup was performed.

**QUESTION:** Which of these belong in a small explicit cleanup allowance, and which remain outside pilot acceptance? The recommended default is to scope only what blocks the approved outcome.

## 7. Recommended phase split and browser-testing approach

**INFERENCE / recommendation:** Keep the packet's **two product phases**. Recon and design remain preparation, not an added phase. Existing multi-session code changes APBM_001 into verification and targeted hardening rather than a wholly new session implementation.

| Phase | Proposed outcome | Evidence required |
|---|---|---|
| APBM_000 — FFM refresh | Approved agent directory, workspace and conversation experience; reuse shell/renderer/composer/auth/service seam; context/instructions explicitly mock/display-only; preserve verified working chat capability | Designer contract + UI behavior, keyboard/mobile/dark checks; deterministic fixtures labeled as mocks; regression against scoped baseline. No mock result is evidence of durable ADK history. |
| APBM_001 — Live sessions | Against the designated backend, create/list/open/switch/reload/continue two conversations safely; resolve identity/races/index errors required for that outcome; regress APBM_000 | Authorized A/B event append/isolation proof via frontend/index/ADK; owner isolation; refresh/reopen without further model calls; controlled race/error tests; no deployment claim from local tests. |

**Recommendation:** Resolve B1–B4 before freezing live-session contracts. If an API ownership fix must precede any shared live use, make it an explicit dependency within these phases, not silent extra acceptance. Lack of current live proof is not a reason to replace a working connection with mocks or to rewrite the backend.

**EVIDENCE (source-derived) / recommendation:** Keep Jest/Testing Library for parser/state/component tests. Playwright is already installed but not established as a suite. In authorized phase scope, add a small reusable browser configuration and tests; do not launch a separate automation project. Minimum risk cases:

- Two newly created conversations under one agent; distinct IDs/history, switching, hard refresh, reopening and continuation. Assert stored events and thread identity, not model recall alone.
- Delayed A history/reply after selecting B or New Chat, switching agents during initial load, logout/user change while requests are pending; deterministic route fixtures can force order without extra model calls.
- Index unavailable/insert failure, missing ADK session, auth refusal, timeout after acceptance, empty versus failed history; assert no duplicate sends or silent overwrite.
- Preserve copy, markdown/code/tables, read-aloud controls, composer keyboard use and login/navigation behavior. Verify mocked documents/instructions never reach live services.
- Small proposed viewport set around actual shell boundary: 375px, 768px, 1280px; include one real dark-mode screen pass. QA Lead settles final coverage; screenshots support visual review, assertions prove behavior.

**QUESTION / JARVIS's next decisions:** (1) designated deployment + roster + safe test identity/agent; (2) server identity and session/index recovery contract; (3) approved design inputs/branding and existing-feature retention; (4) phase boundaries and inherited-failure disposition. Then author the App Brief, initial Data Contract with Engineer input, Designer handoff and executable first phase.

**EVIDENCE (packet intent):** `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/` and corresponding `apbm_001` remain viable proposed paths. JARVIS creates the module/QAM skeleton; independent QA Lead approves Cody's plan and adjudicates certification. Tony handles candidate commits/branches. No QAM module or acceptance certificate was created here. Pending parallel ABM results do not block this recon and were not assumed.

## 8. Time, interventions, unexpected stops and final repo status

**EVIDENCE (observed):** Measurement starts at 2026-10-03T23:38:10.562786+06:00 after initial instruction intake; report timestamp above is 2026-10-03T23:47:22.006369+06:00. Final package audit time and elapsed seconds are recorded in `final-state.json`. Initial intake was not timed, so no fabricated full-task estimate is supplied. Check wall times are in §2.3; concurrent checks overlap and must not be summed as elapsed task time.

**EVIDENCE (action ledger):** Zero follow-up Director interventions, zero approval stops, zero repair rounds. The launch supplied authorization for independent recon and the conditional probe. No repeated permission question was asked. Blocked live prerequisites, network-dependent build/audit, missing browser and denied sockets were recorded; unaffected source/test/report work continued. First-package sufficiency remains for JARVIS to judge, not self-certified here.

**EVIDENCE (observed):** No product source, configuration, manifest, tests, SQL, lockfile or historical module was changed. No dependency installation, Git mutation, cloud operation or live test session occurred. Final hash comparison checks the original 345 tracked files; only allowed root recovery/changelog bookkeeping may differ. Existing user work and prior response/recon files remain.

Intentional additions are this report, the short response note, its same-stem ZIP and the bounded sanitized evidence directory. Existing session, RECOVERY and CHANGELOG records are updated as required by root instructions. `.next/` was created incidentally by the attempted build and left in place; `next-env.d.ts` and `tsconfig.tsbuildinfo` already existed and retained pre-run modification times. Jest/npm scratch/cache output is under `/tmp`, outside the ZIP. No running dev server was created. Exact final Git status, preservation check and archive membership audit are in supporting evidence.

**Package:** `agent_docs/RESPONSES/response_2026-10-03_234722_adk-frontend-recon.md` ; `agent_docs/RESPONSES/response_2026-10-03_234722_adk-frontend-recon.zip` . See its evidence directory's `FILE_INDEX.md` for archive-relative paths and the deliberately small supporting set. Environment files/values, credentials, browser state, dependencies, raw personal histories, prior archives and historical screenshots are excluded. This report is the handoff; no old assignment or build phase resumes automatically.

Supporting evidence directory: `agent_docs/RESPONSES/response_2026-10-03_234722_adk-frontend-recon_evidence`.
