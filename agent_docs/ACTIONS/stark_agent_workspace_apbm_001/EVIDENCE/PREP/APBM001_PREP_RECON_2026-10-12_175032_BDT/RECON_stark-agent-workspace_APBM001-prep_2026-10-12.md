# RECON REPORT — Stark Agent Workspace · APBM_001 preparation (affected-area)

**Prepared:** 2026-10-12, Asia/Dhaka (UTC+06:00). Work started 17:37:45; the report was written about 17:50. Final state is recorded in the evidence `final-state.txt`.
**Seat:** Claudy (Claude Code, Opus 5.5), Engineer. **Reader:** Architect (JARVIS), who assembles and releases APBM_001.
**Authority:** The Architect assignment Tony pasted on 2026-10-12, which covers focused recon and documentation only, plus the `_SKILLS/stark-recon-skill-v1.1` doctrine, method, mission, template, evidence discipline and anti-patterns.
**Status:** Source-only recon is complete. **APBM_001 is NOT LAUNCHED.** This report is evidence for authoring, not acceptance, Gate Q, or a live certificate. **DIRECTOR-OBS-001 stays UNTRIAGED-live.**

**Labels** (per `references/EVIDENCE_DISCIPLINE.md`):
- **EVIDENCE**: verified on disk or by a command, with a citation.
- **INFERENCE**: a consequence reasoned from that evidence.
- **CLAIM**: a doc or person says so; I did not verify it.
- **GAP**: expected but not found.
- **QUESTION**: a decision for the Architect or Tony.

---

## 0. Ownership, baseline and skill conformance

### 0.1 Ownership acceptance

**I, Claudy, accept checkout ownership of this repository as Engineer**, effective about 17:37 BDT on 2026-10-12. The handoff came from Tony after he stopped Cody's engineering session (that stop is a CLAIM, from the assignment). Cody becomes **QA Executor** under the existing QA Lead. **Tony keeps all Git mutations.** One writer at a time: I saw no concurrent changes during this recon; the working tree changed only through this recon's own deliverables (see `final-state.txt`). This acceptance covers recon and documentation only. Implementation waits for the Architect's APBM_001 release.

### 0.2 Baseline

All of the following are EVIDENCE from read-only Git; see `…_evidence/baseline-git.txt`.

| Field | Value |
|---|---|
| Repo root | `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2` |
| Origin (sanitized) | `github.com/ahmedmusawir/stark-ai-workbench-nextjs-frontend-v2.git` |
| Branch | `frontend-apbm-0001` (local only, no upstream) |
| Full HEAD | `f0fbf2282737ea3a63fc78d553cd31fc570821d5`, the merge "Merge APBM-000: certified workspace and engineering closeout"; parents `20ef380…`, `50fd9df…` |
| `main` / `origin/main` | Both `f0fbf22…`, equal to HEAD |
| Staged / tracked-modified / stash | 0 / 0 / 0 |
| Untracked at capture | Only this session's records: `session_2026-10-12.md`, `agent_docs/RESPONSES/response_2026-10-12_173300_session-start.md`, plus this recon's evidence files |

**No unexpected baseline difference.** The branch and the integrated main match the assignment (`frontend-apbm-0001`, `f0fbf22`). The certified candidate `8eb5789…` is an ancestor (merged through `50fd9df`). Per the carried-forward issues file, the baseline is the actual integrated HEAD, not `8eb5789`.

### 0.3 Skill conformance and conflicts

I followed the assignment's boundaries wherever they conflicted with the skill, and completed all unaffected work.

| Skill step | Conflict | Handling |
|---|---|---|
| "No git" (CLAUDE.md, AP-5) | The assignment requires the baseline and allows read-only Git | Used read-only `git --no-optional-locks` (`rev-parse`, `status`, `log`, `diff`, `ls-tree`) only |
| S0.7 / Q8.6 `npm run build` | Assignment: "Do not run builds or broad test suites" | Not run. Routes inventoried from the filesystem. Reused the accepted Gate Q build evidence (CLAIM from the certificate) |
| Q6.2 `npm audit` | Network access; outside affected-area scope | Not run |
| S0.6 `cat .env.example` | Assignment: do not read `.env` files | Env **names** taken from code and the manifest only. No `.env*` file opened |
| Output path `agent_docs/recon/` | The repo already uses `agent_docs/RECON/` (the kickoff says don't create both casings) | Written to `agent_docs/RECON/` |
| Sections 4 (design), 8 (demo), 11 (nav) | Assignment: "do not repeat the completed broad audit" | Marked N/A. See `RECON_ADK_FRONTEND_20261003-234722.md` §2.4 |
| "Architect–Engineer synchronization workflow" | No section with that name exists in the skill (GAP; `grep -ri synchron` found nothing) | Interpreted as the skill's handoff gate: write one report, hand the Architect the path, STOP |

---

## 1. Architect summary (10 bullets)

1. **EVIDENCE:** HEAD `f0fbf22` is the integrated APBM_000 merge. The live conversation path is `Workspace` → `productionAdapter` → `chatService` / `sessionIndexService` → `/api/agent/{run,history}` → native ADK. The legacy `ChatPageContent`/`chatStore` path no longer serves `/chat` (§4).
2. **EVIDENCE:** Ownership is split. **ADK owns transcripts.** **Supabase `chat_sessions` is the *only* navigation catalogue.** The workspace keeps transcripts in component memory only and writes **no** local pointers. If the catalogue is unavailable, earlier conversations can't be found after a reload (§4.2).
3. **EVIDENCE:** The agent APIs have no server-side identity. `/api/agent/run` and `/history` trust the `user_id` in the request body (from the persisted browser `auth-store`). `proxy.ts` refreshes the session cookie but never rejects a request. Index RLS (declared) is a separate boundary and does not protect ADK reads (§5.3).
4. **EVIDENCE:** Production cannot tell "empty" apart from "failed". History 404s and transport errors become `[]` → `empty`; list errors become `[]` → "A fresh start". A history 404 then allows a send that triggers the connector's **create-and-retry under the same ID**, which silently recreates the session (§5.5).
5. **EVIDENCE:** No request is ever cancelled (no `AbortController` / `req.signal`); late results are discarded by guards instead. The guards are sound for list, history and agent switches. Newly found: **a draft key reused via browser Back** can show an old transcript while the next send creates a **new** ADK session (§5.4).
6. **EVIDENCE:** Session identity survives a metadata failure only in the URL and in memory. Nothing re-inserts the row or reconciles it from the ADK session list. After navigation plus reload, that session is lost from the UI (§5.6).
7. **EVIDENCE:** Backend identity is missing from the catalogue (no column), from `viewKey`, and partly from `identityKey` (bundle *ID*, not endpoint). After A → B → A, rows from A show on B, open as "empty", and a send recreates A's ID on B. The system itself produces the colliding IDs (§5.7).
8. **DIRECTOR-OBS-001 (UNTRIAGED-live):** One confirmed source behaviour reproduces the visual symptom: in the new-draft view the sidebar shows **no** conversation list (`Workspace.tsx:115`). The leading *hypothesis* for "nothing is saved" is that the `chat_sessions` table is missing or mis-provisioned in the Supabase project the app uses. The table-creation SQL was a pending manual step in July, and BIM-004's spec predicts exactly this symptom (§6).
9. **GAP:** The deployed state of `chat_sessions` schema/RLS, the ADK target behind `ADK_BUNDLE_URL_V1`, ADK session durability, and the ADK service's direct-access policy are all unverified. I propose a bounded, owner-run probe budget: 2 SQL metadata reads, ≤3 sessions, ≤5 model submissions (§7).
10. **QUESTION / next:** The Architect freezes the identity, history-error, catalogue-recovery and backend-namespace contracts (§10.3), obtains P0 metadata evidence, then releases APBM_001. No source-level blocker prevents APBM_001 from being the final frontend build phase. Three external dependencies could: ADK durability, ADK direct-access authorization, and Supabase migration authority (§10.6).

---

## 2. Day-0 sweep (affected area)

All EVIDENCE; see `day0-sweep.txt` and `source-anchors.txt`.

- **S0.1 Named files:** Every starting point named in the assignment exists at its stated path, at the blob identities listed in `source-anchors.txt`. `sessionIndexService.ts` is at `src/services/`. Its only non-test callers are `productionAdapter.ts`, legacy `ChatPageContent.tsx` (unrouted) and legacy `SessionPanel.tsx` (mounted on `/mission-control`). There is **no** `supabase/migrations/`; only two hand-run SQL files exist.
- **S0.2 Claimed shapes vs disk:**
  - The manifest loader imports only `config/agents.manifest.json` (`src/config/manifest.ts:14`).
  - The active roster at HEAD is Tony's cloud roster: greeting, jarvis, calc, product, ghl_mcp, moose_mcp, all on bundle `v1` (`config/agents.manifest.json:7-12`).
  - The Hermes roster is a tracked, unused backup (`config/agents.manifest-hermes.json`).
  - **DRIFT:** `KNOWN_LIMITS.md` ("configured roster Hermes-oriented") and `APP_BRIEF.md` ("current Hermes-oriented roster") no longer describe HEAD.
- **S0.3 Forbidden zones:** `dangerouslySetInnerHTML` 0; `user_metadata.(is_|role)` 0. Four non-test `any` sites remain, unchanged from the 10-03 recon (`useAuthStore.ts:6`, `utils/supabase/server.ts:6`, `MessageBubble.tsx:91`, `ui/command.tsx:35`).
- **S0.4 Routes:** The agent APIs are `src/app/api/agent/{run,history,instructions}/route.ts`. `/chat` is `src/app/(cyberize)/chat/page.tsx` → `WorkspaceEntry`.
- **S0.5 Runner:** Jest (`"test": "jest"`, `jest ^30.0.5`), plus the scoped `test:workspace` Playwright config with a fixture harness.
- **S0.6 Env names (code only):**
  - Agent backends: `ADK_BUNDLE_URL_V1`, resolved dynamically through the manifest's `urlEnv` (`run/route.ts:39`, `history/route.ts:36`).
  - Mode and Supabase: `NEXT_PUBLIC_CHAT_MODE`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`.
  - GCS: `GCS_BUCKET`, `GCS_BASE_FOLDER`.
  - `ADK_BUNDLE_URL_V2_LOCAL` is declared in the manifest, but no agent uses bundle `v2-local`.
  - Values were never read.
- **S0.7 Build route table:** NOT RUN, per the assignment. Filesystem routes are in `day0-sweep.txt`. Accepted build proof is the Gate Q certificate's (a CLAIM for `8eb5789`, not re-verified at `f0fbf22`).

---

## 3. Template sections 1–9 (condensed)

| Section | Result |
|---|---|
| 1 Stack | Unchanged in the affected area since `RECON_ADK_FRONTEND_20261003` §2.2: Next 16.2.x, React 19.2, TS 5.5, Tailwind 3.4, Zustand 4.5, Supabase SSR 0.6.1 / JS 2.x, Jest 30, Playwright 1.59. Not re-inventoried (dependency changes are out of scope; CLAIM from prior evidence). |
| 2 Structure | EVIDENCE: the new `src/components/workspace/` layer is about 380 lines (`Workspace.tsx` 179, `productionAdapter.ts` 39, `navigation.ts` 21, `types.ts` 35, `WorkspaceEntry.tsx` 25 …). There is no `workspaceUiStore.ts` (FILE_SCOPE allowed one; it wasn't needed). State lives in component memory. |
| 3 Auth | EVIDENCE: pages are guarded by `protectPage` in `(cyberize)/layout.tsx:15`. APIs are not guarded (§5.3). The client identity is the persisted `auth-store` (`useAuthStore.ts:14-65`, `user: any` at :6). |
| 4 Design | N/A this run (assignment scope). APBM_000 design is certified and **must be preserved**. |
| 5 Database | See §7.1. One hand-run file per table group, RLS declared, deployed state unverified. |
| 6 Skills/Security/Env | The skill resolves from root `_SKILLS/`. No audit run. Env names in §2. |
| 8 Demo/residue | N/A, except the legacy chat surfaces in Surprises S2/S3. |
| 9 Packaging | EVIDENCE: `tsconfig.json:39-42` excludes `agent_docs/**`; Jest roots are `<rootDir>/src` (`jest.config.js:19`). The QA instruments under `QAM/AUTOMATION` stay outside compile scope. |

---

## 4. Flow map and ownership

### 4.1 Current live path at HEAD

```text
/chat (page.tsx) ── protectPage via (cyberize)/layout.tsx:15 (page guard only)
  └─ AppShellPage workbenchRoute: on /chat renders children only (AppShellPage.tsx:159,183);
     legacy CyberizeSidebar is NOT mounted on /chat (it still mounts on /mission-control)
  └─ WorkspaceEntry.tsx
       userId  = persisted useAuthStore.user.id            (:12)  ← browser-asserted
       services = createProductionWorkspaceServices(userId) (:13)
       identityKey = [userId, live|mock, [agentId, bundleId]] (:14) → <WorkspaceSession key=identityKey> remount (Workspace.tsx:25)
  └─ Workspace.tsx  view = parseWorkspaceView(?agent&session|new)  (navigation.ts:3-14)
       viewKey = agentId:sessionId | agentId:draft-N (:32); transcripts in memory (:38-40)
       list effect  → services.list(agent)            (:59-64)
       history eff. → services.history(agent, session) (:65-82)
       send         → services.send(agent, session|null, text) (:90-110)
  └─ productionAdapter.ts
       list    → sessionIndexService.listSessions(agent)   → [] ⇒ 'empty'   (:9-13)
       history → chatService.getHistory({agent,user_id,session}) → [] ⇒ 'empty' (:14-19)
       send    → chatService.sendMessage(...)               (:22)
                 sentinel / no session_id ⇒ 'uncertain'      (:24)
                 new chat ⇒ sessionIndexService.createSession(...) ; null/throw ⇒ metadataWarning (:27,33)
                 existing ⇒ listSessions + touchSession(row)  (:28-32)
  ├─ chatService.ts (live iff NEXT_PUBLIC_CHAT_MODE==='live', :31)
  │    POST /api/agent/run     {agent_name,message,user_id,session_id} 90s client timeout (:43-48)
  │    POST /api/agent/history {agent_name,user_id,session_id}         30s; any failure ⇒ [] (:82-94)
  │      └─ route: body cast, manifest agent→bundle→urlEnv→process.env (run/route.ts:29-45; history/route.ts:26-42)
  │         NO auth.getUser(); Authorization header forwarded if present (run:26, history:23,48)
  │      └─ adk.ts: create  POST {base}/apps/{agent}/users/{user}/sessions/session-<ms> (:53,:135-154)
  │                 run     POST {base}/run {app_name,user_id,session_id,new_message} (:156-172)
  │                 404|"session not found" ⇒ create SAME id + run once more   (:196-210)
  │                 history GET same session path; non-OK (incl. 404) ⇒ 502   (history/route.ts:44-57)
  └─ sessionIndexService.ts (browser Supabase client; same mode flag, :23)
       list   select … eq(agent_name) eq(archived,false) order(updated_at desc); error ⇒ [] (:46-62)
       create auth.getUser() in browser at insert time; insert; error ⇒ null           (:74-100)
       touch/rename/archive: errors swallowed (console.error), resolve void             (:117-173)
```

### 4.2 Who owns what

| State | Owner / location | Scope and persistence | Label |
|---|---|---|---|
| Transcript / events | ADK session service, through the connector | Namespace is app = agent name, user = client-supplied `user_id`, session = `session-<ms>`. Backing store, durability and retention unknown | EVIDENCE (path), GAP (durability) |
| Navigation catalogue (recents, sidebar, titles, archive flag) | Supabase `public.chat_sessions`, via the **browser** client | Rows carry owner, agent, ADK ID, title, timestamps, archived. **No backend column.** Declared owner RLS. Deployed state unknown | EVIDENCE (declared), GAP (deployed) |
| Loaded transcripts, drafts, pending/uncertain statuses | `Workspace` component memory (`threads`, `threadCache`, `drafts`) | Per `viewKey`. Lost on reload or remount | EVIDENCE |
| Last-active pointers / selected agent | Legacy `chatStore` (localStorage `adk-session-map-live|mock`) | **Not written by the workspace**; only `reset()` is called on sign-out (`WorkspaceEntry.tsx:17`). FIX-001/003 pointer recovery is retired on `/chat` | EVIDENCE |
| Client identity | Persisted `auth-store` plus Supabase cookies | The `auth-store` user can be stale relative to the cookie user; they are never reconciled | EVIDENCE / INFERENCE |
| Next.js server | Stateless; reads env and manifest per request | No transcript or catalogue | EVIDENCE |

**INFERENCE:** The UI can find a conversation after reload **only** through `chat_sessions`. There is no fallback to the ADK session list, even though the 10-04 probe showed one works on the tested service.

---

## 5. Findings by focus item

### 5.1 Create, list, open, reload, resume (Focus 1)

| Operation | Mechanism (EVIDENCE) | Risk |
|---|---|---|
| Create | **New chat** only increments `draftNumber` and navigates to `?agent=X&new=1` (`Workspace.tsx:89`). No service call happens before the first send. The first send passes `session=null` (:92). The server generates `session-${Date.now()}` and creates it (`adk.ts:53,188-191`). The adapter then inserts the catalogue row (`productionAdapter.ts:27`). | The ID is time-based, not a UUID. **INFERENCE:** two same-millisecond creates under one app and user collide; there is no idempotency. |
| List | `listSessions(agent)` runs on every agent or view-kind change (`Workspace.tsx:59-64`). | Failure becomes `[]` → "A fresh start" (:150). |
| Open | Selecting a row navigates to `?agent&session`; the history effect reads the transcript unless it is cached in memory (:65-82; cache short-circuit :69). | A 404 or any failure becomes `[]` → empty thread (§5.5). |
| Reload | Remount: memory is lost, so the list is re-read and the URL's session is re-read. | Depends entirely on the catalogue and on ADK durability. |
| Resume | A send in conversation view passes `view.sessionId` (:92) → `/run` with that ID. On success, `listSessions` + `touchSession` run (`productionAdapter.ts:28-32`). | If the session is missing, ADK recreates it silently (§5.5). A failed touch is silent. |

### 5.2 Browser → routes → ADK → Supabase (Focus 2)

The full path is mapped in §4.1. Ownership: **ADK = transcripts, Supabase = navigation metadata only.** This matches the APBM_000 DATA_CONTRACT and is EVIDENCE. Wire format is snake_case to native ADK `/run` (`adk.ts:165-168`). The 10-04 probe observed camelCase being accepted by `adk-bundle-prod-v2-…`. Tony's 10-05 report that "agents reply" through the app implies snake_case works on his target; that is a CLAIM, consistent with the code.

### 5.3 Isolation: user, backend, agent, session/draft (Focus 3)

| Dimension | Server-side | Client-side | Finding |
|---|---|---|---|
| User | **None** in agent routes. The body `user_id` is trusted (`run/route.ts:29`, `history/route.ts:26`, no `getUser`). `middleware.ts:36-37` refreshes without enforcing. The index uses the browser `auth.getUser()` at insert time (`sessionIndexService.ts:81`) and RLS (declared). | `identityKey` includes the `auth-store` user ID, so a user change remounts the workspace (`WorkspaceEntry.tsx:14`, `Workspace.tsx:25`) | **EVIDENCE:** a direct API caller can name any `user_id`. **INFERENCE:** the ADK namespace can diverge from the index owner if the `auth-store` user is stale compared with the cookie user. |
| Backend | None (env URL resolved per request) | `identityKey` holds the bundle **ID** (`manifest.ts:135`), not the endpoint. `viewKey` has no backend | §5.7 |
| Agent | The manifest rejects unknown agents with 400 (`run/route.ts:32-37`) | `viewKey` and list filters include the agent; send writes to the originating key (`Workspace.tsx:92,101`) | Sound for agent switches (EVIDENCE + QA S-10 fixture). |
| Session / draft | ADK path scoping only | `viewKey` per session; drafts per `draftNumber` | **Draft-key reuse** (§5.4 R3) |

**EVIDENCE:** ADK direct-access policy is not in this repo. **GAP:** whether the Cloud Run ADK service accepts unauthenticated direct calls. If it does, frontend identity fixes do not protect it (KNOWN_LIMITS "direct ADK access boundary before shared release").

### 5.4 Cancellation and stale-response protection (Focus 4)

**EVIDENCE:** No production code uses `AbortController`, `req.signal` or `request.signal` (`test-inventory.txt`). The only limits are timeouts: client run 90 s and history 30 s (`chatService.ts:26-27`); server run deadline 90 s with per-call caps 75 s / 10 s, and history 30 s (`adk.ts:20-22`, `history/route.ts:20`).

| Race | Guard | Result |
|---|---|---|
| Agent or view change during list | `current` flag plus `catalogue.agent === agentId` (`Workspace.tsx:61-62,83`) | Protected (EVIDENCE) |
| Session change during history | `current` flag keyed on `viewKey` (:67,72-79) | Protected (EVIDENCE; QA S-10 "late history cannot paint another session", fixture) |
| Navigate away during send | Result written to the originating `key` and the returned-session key; navigation happens only if still active (:101-102) | Protected for display. **R1 INFERENCE:** the server request is never cancelled; the ADK turn and catalogue insert still complete. |
| Unmount or identity change during send (sign-out, user switch) | `alive` guard drops the UI write (:98) | **R2 INFERENCE:** the adapter keeps running `createSession`, which calls the *browser* `auth.getUser()` at that moment (`sessionIndexService.ts:81`). Signed out → null → session orphaned. **Different user signed in** → the row is inserted under the **new** user for an ADK session in the old user's namespace. |
| **Draft key reuse** | `draftNumber` changes only on New Chat (:89). Browser Back to `?agent=X&new=1` reproduces the same `viewKey` | **R3 EVIDENCE (mechanics) / INFERENCE (consequence):** after a draft's first send succeeded (thread stored under the draft key at :101), Back shows the old transcript in "draft" view with the composer enabled. The next send passes `session=null` (:92) and creates a **new** ADK session, so the visible context and the backend context diverge. |
| Client timeout vs server budget | Both are 90 s, and the route doesn't observe client abort | **R4 INFERENCE:** slow turns become `uncertain` in the UI while the server and ADK may still finish. For a new chat the ID is never returned (§5.6). |
| Backend change | Requires restart; mode is inlined at build | Remount drops in-flight UI. Rows are not backend-scoped (§5.7). |

### 5.5 Empty, unavailable, missing, pending and uncertain states (Focus 5)

**What production can actually emit** (EVIDENCE: adapter plus services). Every other `ThreadStatus` or `Catalogue` status is reachable only through fixtures, as AC000 intended:

| UI state | Produced in production when | Not produced when it should be |
|---|---|---|
| `empty` thread | History is genuinely empty, **or** upstream 404 / 5xx / network error / timeout (`history/route.ts:52-57` → `chatService.ts:88-94` → `productionAdapter.ts:18`) | `missing`, `unavailable` and `access-unavailable` are never emitted for reads |
| `access-unavailable` | Only when the `auth-store` user ID is empty (`Workspace.tsx:84`) | A server 401/403 (none exists) |
| `pending` | While a send is in flight (:94) | — |
| `uncertain` | Error sentinel, missing `session_id`, or a thrown error (`productionAdapter.ts:24`; `Workspace.tsx:108`) | — |
| `not-sent` | **Never** (the adapter has no pre-flight classification) | A 400 / 500 config rejection before the upstream call is reported as `uncertain` |
| `metadata-warning` | `createSession` returned null or threw (`productionAdapter.ts:27,33`) | Touch failure (silent) |
| Recents `empty` ("A fresh start") | Genuine empty, **or any list error** (`sessionIndexService.ts:59-61`) | `unavailable`, `partial` and `recovered` are fixture-only |

**Blind resend / duplicate-create risks:**
- **B1 Silent recreate.** EVIDENCE chain plus INFERENCE. A missing session reads as `empty`, so the composer stays enabled (`Workspace.tsx:85`). The next send gets a 404, and the connector **creates the same ID and resubmits** (`adk.ts:196-203`). The result is a new, empty session under the old ID, presented as a continuation. Any unrelated 404, such as a wrong path, also matches (`adk.ts:56-58`).
- **B2 Draft-key reuse** (R3 above): a duplicate session is created behind an old transcript.
- **B3 Uncertain is sticky.** EVIDENCE: once a send is `uncertain`, a later successful history read keeps `uncertain` and only merges messages (`Workspace.tsx:75-76`). Sending stays blocked until a remount. The production adapter never returns `pending`/`not-sent` for reads, so the only exit is a reload. This isn't a resend risk, but it is a dead end. In a draft there is no ID to inspect (:162), so a user who retypes the message in a New Chat may duplicate a turn that actually succeeded (user-driven duplicate; INFERENCE).
- **B4 Retry-once after 404** resubmits the user message within one request. This is safe only if the first `/run` did no work (it returned 404).
- **B5 Rename/archive failures look like success.** EVIDENCE: the live service swallows errors and resolves void (`sessionIndexService.ts:142-145,165-167`), so `Workspace` applies the change locally and closes the dialog (:128-131). The AC000-11 failure UI is fixture-only.

### 5.6 ADK create succeeds but metadata fails (Focus 6)

**EVIDENCE:**
- The adapter keeps the returned ID and reply and sets `metadataWarning` (`productionAdapter.ts:27,33`).
- The UI navigates to `?agent&session=<id>` (`Workspace.tsx:102`) and shows "Conversation started; title not saved" (:120).
- "Check conversation list" only re-reads the list (:163). There is **no re-insert, no retry, no persisted bookmark, and no ADK-list reconciliation**. The legacy "Restored chat" adoption existed only in the now-unrouted `ChatPageContent.tsx:53-60`.

**INFERENCE:** The session identity survives only in the current URL, browser history and memory. Navigating away and reloading makes it undiscoverable. A related case also loses identity: if the ADK **create** succeeds but `/run` then fails or times out for a new chat, the server-generated ID never reaches the client (`chatService.ts:58` echoes `''`), leaving an orphaned ADK session.

### 5.7 Configurable backend switching, A → B → A (Focus 7)

**EVIDENCE (model to preserve):** `agents.manifest.json` maps agent → bundle ID → `urlEnv` name; the server resolves `process.env[urlEnv]` per request (`manifest.ts:112-128`, `run/route.ts:32-45`). Bundle URLs never reach the browser (`workspaceAgentsForUi` exports `backendId` = bundle ID only, `manifest.ts:131-139`).

| Switch type | What changes | Consequence (INFERENCE from source) |
|---|---|---|
| (a) Same bundle ID, endpoint value changed (`ADK_BUNDLE_URL_V1` local → cloud) | Nothing visible to the client; `identityKey` is unchanged | Catalogue rows from A list under B. Opening one reads B → 404 → `empty`. A send gets a 404 → **recreates A's ID on B** (B1). Back on A, the original transcript reappears and B's turns are invisible. **One catalogue row now points at two different transcripts.** |
| (b) Agent remapped `v1` → `v2-local` in the manifest | `identityKey` changes, so the workspace remounts | The same row leakage, because rows have no backend column and the unique key is `(user_id, agent_name, adk_session_id)` (`chat_sessions_setup.sql:22`). The same ID on two backends can't be represented. |
| (c) Mode live ↔ mock | `identityKey` changes; the mock index is in memory (`sessionIndexService.ts:65-67,103-113`) | Isolated (EVIDENCE) |

**Colliding session IDs** come from two sources: `session-<ms>` generation, and above all the B1 silent recreate, which *manufactures* the A/B collision. Qualifying A → B → A needs a backend dimension in the catalogue, the view and the URL, plus removal of the silent recreate. A second live target is not designated (GAP). A two-contract fixture swap is feasible offline.

### 5.8 Existing regression coverage and missing acceptance cases (Focus 8)

**Existing coverage** (EVIDENCE: titles in `test-inventory.txt`; last accepted results are a CLAIM from the Gate Q certificate at `8eb5789`, not re-run):
- **Connector and routes, with mocked fetch.** `adk-lib.test.ts` and `agent-run.test.ts` *assert the current create + retry-once behaviour* (N6). `agent-history.test.ts` asserts non-OK → 502.
- **`chatService.live.test.ts`** asserts the sentinel and `[]` collapse.
- **`sessionIndexService.test.ts`** covers **mock mode only**. GAP: there is no live-mode test of error swallowing, RLS assumptions or insert identity.
- **`workspace/productionAdapter.test.ts`** asserts "history/list retain inherited empty outcome", uncertain on sentinel, and metadata rejection keeping the ID.
- **Playwright fixture harness** (`tests/workspace/*.spec.ts`) plus QA instruments (`QAM/AUTOMATION`: QA Jest J-09/J-10/J-21, the OBS-001 adapter seam, S-08…S-11, the OBS-001 browser A+B scenario). These cover typed presentation states, late-history races and the A+B offline catalogue.
- **Legacy suites** (`chatStore.*`, `ChatPageContent*`, `SessionPanel`, `AgentSwitcher`, `MessageList.loading`, `ChatInput`) test code that `/chat` no longer routes to.

**Missing acceptance cases** (no test exists at any level): server identity rejection (401/403, no upstream call); body `user_id` mismatch; history 404 → `missing`; continuation-404 → no create / no resubmit; pre-flight failure → `not-sent`; uncertain → resolved after a history read; list failure → `unavailable`; metadata failure → identity recoverable after reload; draft-key Back reuse; sign-out or user switch mid-send → no cross-user row; A → B → A with colliding IDs; rename/archive live failure surfaced; cross-user live isolation (T1/T2); live A/B create-list-reload-resume with stored-event proof; ADK durability across restart; legacy `/mission-control` SessionPanel interaction with the workspace. The proposed ACs are in §10.3.

---

## 6. DIRECTOR-OBS-001: previous chat disappears when a second chat starts

**Formal status: UNTRIAGED-live (unchanged).** Fixture success does not resolve it. No live action was taken.

**Report provenance (CLAIM):** On 2026-10-05, Tony said: "all looks good … but nothing is remembered … multi session options are there but doesn't work" (Executor addendum 001). He was running candidate `22ce03b` with the locally swapped cloud roster that is now committed. URL, mode, IDs, banner text and console output weren't captured.

### 6.1 Confirmed source behaviour

All EVIDENCE.
- **C1:** The sidebar's **Conversations** list renders only for `view.kind === 'conversation'` (`Workspace.tsx:115`). After **New chat**, the view becomes `draft`, and *all* previous conversations disappear from the side navigation until the new draft's first reply navigates to the new conversation. The workspace landing page lists recents in the main pane (:147-152). Existing offline A+B tests check landing recents, not the draft-view sidebar (`test-inventory.txt`).
- **C2:** Recents and the sidebar come **only** from `listSessions`. Any list error becomes `[]` → "A fresh start" (`sessionIndexService.ts:59-61`, `productionAdapter.ts:12`, `Workspace.tsx:150`).
- **C3:** Transcripts are memory-only. The workspace writes no pointers (§4.2), so after a reload only the catalogue can rediscover a chat.
- **C4:** Insert failures surface as the "title not saved" banner (`productionAdapter.ts:27,33`).
- **C5:** History failures, including 404, render as an empty conversation, and continuing it silently recreates the session (§5.5 B1).
- **C6:** The data-flow code Tony ran (`22ce03b`) equals HEAD; only the drawer and focus code changed (`git diff --stat 22ce03b HEAD` in `source-anchors.txt`).
- **C7:** Mock/live split-brain is excluded by source. Chat and index read the same flag (`chatService.ts:31`, `sessionIndexService.ts:23`), and mock replies would contradict Tony's live replies.

### 6.2 Hypotheses (ranked; none confirmed)

| # | Hypothesis | Support | Against / discriminator |
|---|---|---|---|
| H1 (high) | `public.chat_sessions` is absent or unusable in the Supabase project the app uses. Every insert fails and every list returns `[]`. | Running the SQL was a *pending* manual step (`RECOVERY.md:110-111`, July) with no later execution record in any root or session log I searched. BIM-004's spec predicts: "live mode still chats fine but the Conversations panel stays empty" (`agent_docs/CURRENT_APP/BIM004/ACCEPTANCE_SPEC.md:26-28`). The clone shares the original project (kickoff §2, CLAIM). | Tony didn't mention the "title not saved" banner (not conclusive). **Discriminator:** P0 owner-run catalogue/policy query; browser console showing `sessionIndexService.* failed`. |
| H2 (medium) | The table exists but its deployed schema or RLS differs from the checked-in file (e.g. `archived` nullable without default, missing SELECT policy, column drift). Inserts succeed but the list excludes or hides rows. | No migration history exists; the deployed DDL is unknown | P0 `information_schema` + `pg_policies` read |
| H3 (medium) | ADK session durability or routing: the deployed session service is non-durable, or requests reach a different backend or app. History 404 → empty; continuation 404 → silent recreate, so the model "remembers nothing". | C5 / B1 mechanics; the deployed session service type is unknown. The 10-04 probe proved persistence over minutes on `adk-bundle-prod-v2-…`, not necessarily Tony's `ADK_BUNDLE_URL_V1` target | P0 deployment attestation; P1/P2 stored-event reads |
| H4 (low-medium) | Perception from C1: the previous chat disappears from the *sidebar* in the draft view, compounded by H1 or H3 | C1 is certain in source | P1 observes the sidebar and the landing recents separately |
| H5 (low) | Stale `auth-store` user ≠ cookie user, so the ADK namespace ≠ index owner | §5.3 | P1 compares the store user ID with the server user (opaque equality only) |

**Not supported:** a frontend regression that drops successful catalogue rows. The adapter and Workspace never remove rows except on an explicit archive (EVIDENCE). The QA offline A+B scenarios passed (CLAIM from QA records, addenda 002/003).

### 6.3 Live evidence needed

Run P0 and then P1 (§7.3). Record opaque aliases only: insert result, list membership before and after New Chat (sidebar *and* landing recents), history status and turn count after reload, and banner presence. Tony keeps OBS-001's disposition; the QA Lead keeps its classification.

---

## 7. Live evidence: declared vs verified, gaps, and a proposed bounded probe

### 7.1 Declared vs verified

| Item | Checked-in declaration | Verified deployed state |
|---|---|---|
| `chat_sessions` table | `supabase/chat_sessions_setup.sql:13-23`: 8 columns, `archived NOT NULL DEFAULT false`, `UNIQUE(user_id, agent_name, adk_session_id)`, list index :51-52. Non-idempotent `CREATE TABLE`; no migrations dir | **UNVERIFIED** (no execution record; H1) |
| `chat_sessions` RLS | Enabled :25; SELECT/INSERT/UPDATE own-row for `authenticated` :28-44 (UPDATE has USING only; Postgres reuses it as the check); no DELETE :46 | **UNVERIFIED**; cross-user effectiveness untested |
| `user_roles` / `profiles` / `handle_new_user` | `supabase/setup.sql` | **CLAIM** only: logins work, which implies roles exist |
| ADK endpoint behind `ADK_BUNDLE_URL_V1` | Name only; value not read | **UNVERIFIED** (loopback on 10-03; Tony said remote cloud on 10-05) |
| ADK session service durability and backing store | — | **UNVERIFIED** |
| ADK list/detail/resume | — | **OBSERVED 10-04** on `adk-bundle-prod-v2-…`, `greeting_agent`, one probe user, two sessions |
| ADK direct-access authorization (Cloud Run ingress/IAM) | — | **UNVERIFIED** |
| Snake_case `/run` acceptance on Tony's target | `adk.ts:165-168` | **CLAIM** (agents replied, 10-05) |

### 7.2 Missing evidence

E1 Supabase project identity (project ref only). E2 Actual `chat_sessions` DDL, defaults, constraints, policies and row-count-by-current-user. E3 The ADK target and revision for `ADK_BUNDLE_URL_V1`, plus its session-service type. E4 The ADK ingress/auth policy. E5 Dedicated test identities T1/T2 and a tool-safe agent attestation. E6 A named second ADK target, if one is to be qualified.

### 7.3 Proposed probes

These are proposals only. **None was run.** All require Architect scope plus Tony's authorization.

| Probe | Purpose | Operations and budget | Access / identity |
|---|---|---|---|
| **P0** (no model calls) | E1–E4; discriminates H1/H2/H3 | Owner-run, **read-only** SQL ×2: (1) `information_schema.columns` / constraints for `public.chat_sessions`; (2) `pg_policies` for that table. Plus Tony's attestation of the ADK host and revision, session-service type and ingress setting. **0 sessions, 0 submissions** | Supabase owner (Tony) runs the SQL and shares metadata only. No row contents, keys or env values |
| **P1** OBS-001 diagnostic through the app | Reproduce or refute the symptom with an opaque ledger | Local app at the authorized HEAD, live mode, T1, `greeting_agent`: New chat A → 1 send; observe; New chat B → 1 send; observe sidebar + landing recents; reload; open A, open B. **2 sessions, 2 submissions, ≤6 list reads, ≤4 history reads.** Capture HTTP status and counts, the banner, and console error *names*. No bodies, cookies or HAR | T1 dedicated member account (Tony enters credentials). Browser with network access. Tool-safe agent attested |
| **P2** Resume and durability | Stored-event append and isolation; restart durability | Resume A ×1, B ×1; history reads ×2. Optional re-read ×2 after a Tony-initiated ADK restart or idle period (no redeploy by us). **0 new sessions, 2 submissions, ≤4 reads** | Same as P1 |
| **P3** Missing-session read | Confirm 404 → route 502 → `[]` live | 1 history read for a nonexistent synthetic ID under T1. **Never send to it** (that triggers B1) | T1 |
| **P4** Cross-user (post-fix acceptance, not pre-recon) | Show T2 can't list or read T1's data | 2 list reads + 2 history reads as T2; 0 submissions | T2 dedicated account |
| **P5** A → B → A | Backend namespace qualification | Only after a second target is named: 1 session + 1 submission on B; ≤4 reads | Named second target |

**Total cap:** ≤3 sessions, ≤5 model submissions, ≤12 history reads, ≤10 list reads, and 2 owner-run read-only SQL metadata queries.

**Stop rules:** No automatic retries, no deletes, no redeploys or migrations. Stop on refusal, rate limiting or the first anomaly. Leave test sessions identifiable for Tony's disposition. Use the forbidden-agents list: `ghl_mcp_agent`, `moose_mcp_agent`, `product_agent` and `calc_agent` stay unused unless attested safe.

---

## 8. Surprises (the gold)

All EVIDENCE unless noted.

- **S1:** Live rename and archive failures are swallowed (`sessionIndexService.ts:142-145,165-167`), so the UI reports success. The AC000-11 failure path can't happen in production.
- **S2:** The legacy `CyberizeSidebar` → `AgentSwitcher` + `SessionPanel` still mounts on `/mission-control` (`(cyberize)/layout.tsx:18-22`; `AppShellPage.tsx:159,183`). Clicking a session there sets the legacy `chatStore` pointer and pushes `/chat` (`SessionPanel.tsx:45,54`). The workspace ignores that pointer and lands on the directory. Rename and archive there mutate live catalogue rows.
- **S3:** Legacy `ChatPageContent.tsx`, `MessageList.tsx` and `ChatInput.tsx` have no route consumer (orphaned), but their tests remain. FIX-001/003 pointer recovery (`chatStore.ts:39,198`) no longer protects `/chat`.
- **S4:** Draft-key reuse through browser Back (§5.4 R3).
- **S5:** `uncertain` is sticky until remount (§5.5 B3).
- **S6:** `identityKey` uses the bundle ID, not endpoint identity (`WorkspaceEntry.tsx:14`, `manifest.ts:135`). Env URL swaps are invisible to the client.
- **S7:** Every send in an existing conversation does a full `listSessions` just to touch one row (`productionAdapter.ts:29-31`). If that list fails, the touch is silently skipped.
- **S8:** The client and server run budgets are both 90 s, and the server ignores client abort (§5.4 R4).
- **S9 (drift):** Root `RECOVERY.md`'s CURRENT block (2026-10-08) predates the merge. `KNOWN_LIMITS.md`/`APP_BRIEF.md` still say "Hermes-oriented roster". `PUBLICATION_HOLD_PATHS`/carried-forward headers say "QA Executor separate/unassigned"; this assignment now names Cody.
- **S10:** `ADK_BUNDLE_URL_V2_LOCAL` / bundle `v2-local` are declared but unused, so the existing "second bundle" is not a live alternate target.

---

## 9. Boundaries honoured

- **Inspected-code changes:** none. No product code, tests, dependencies, configuration, manifest, SQL or `.env` was changed.
- **Not run:** no build, no test suite, no audit.
- **No remote activity:** no live probes, agent invocations, remote sessions, Supabase queries or deployments.
- **Git:** read-only only.
- **Never accessed:** `.env*`, credentials, private retention originals, every module ZIP, `Q5_PROPOSAL_PATHS.json`, `POST_Q5_INVENTORY.json`.
- **APBM_000 records preserved:** Gate Q PASS (bounded scope), the NONCOMPLIANT verdict, PD-002-01, PD-Q5-01, Q5 cleanup and sanitization are all unchanged. No file under `agent_docs/ACTIONS/` was modified.

---

## 10. Recommendation to Architect

### 10.1 Facts to write against without re-verifying

All EVIDENCE at `f0fbf22`:
- The §4.1 call graph and its line anchors.
- ADK is the transcript authority; Supabase `chat_sessions` is the only navigation catalogue.
- The manifest/bundle/`urlEnv` model, and the current cloud roster in `config/agents.manifest.json` (do not touch).
- Agent routes have no server identity.
- No cancellation exists anywhere.
- The production state-emission table in §5.5.
- The A → B → A failure mechanics in §5.7.
- Jest + Playwright fixture harness + QA instruments as the regression substrate.

### 10.2 Recommended APBM_001 scope

This is a proposal, not authorization. It aims at **dependable live conversations without changing the approved UI**.

1. **Server-bound identity.** Derive the user in `run`/`history` from the Supabase server session (`utils/supabase/server`). Reject unauthenticated callers before any upstream call, and ignore or require-match the body `user_id`. Bind index inserts to the identity captured at send start, not a later browser `getUser()`.
2. **Typed read and send contracts.**
   - History: return distinct `missing` (404), `unavailable` (5xx/transport) and `access` (401/403) results through route → `chatService` → adapter, so the existing UI states become reachable.
   - Send: `not-sent` for pre-upstream rejection, `uncertain` after upstream contact.
   - Use discriminated results instead of sentinel strings.
3. **No silent recreate or resend.** Allow create+run only for brand-new conversations. A continuation 404 returns `missing` and is never resubmitted. Consider collision-resistant IDs (UUID); this needs a ruling because R4 preserved `session-<ms>`.
4. **Identity before run.** Create the ADK session and return its ID *before* `/run`, either with a separate create step or with the ID echoed on failure. That way a timed-out first turn and a metadata failure both keep a discoverable ID.
5. **Catalogue reliability and recovery.**
   - List failures surface as `unavailable`.
   - Rename and archive propagate errors.
   - Recover metadata by reconciling against ADK's list endpoint (`GET /apps/{app}/users/{user}/sessions`, observed working 10-04), or by retrying the insert.
   - No transcript localStorage. Any device-local bookmark only by explicit ruling (OBS-001 browser-fallback rule).
6. **Backend namespace.** Add a backend dimension to catalogue rows (migration, separately authorized), to `viewKey`/`identityKey`, and to the unique key. Expose a non-secret backend key from the server (e.g. bundle ID plus an opaque endpoint fingerprint) so A → B → A never cross-reads.
7. **Async hygiene.** Abort list and history reads on navigation. Fix draft-key reuse after completion (replace the history entry, or retire the draft key). Make `uncertain` resolvable by a history read that shows the attempted turn.
8. **Navigation continuity (DIRECTOR-OBS-001 C1).** QUESTION: should the sidebar keep the agent's conversation list in draft and workspace views? This is a visible UI change that needs a ruling against the approved design.
9. **Legacy surfaces.** QUESTION: retire or isolate `SessionPanel`/`AgentSwitcher` on `/mission-control`, and the orphaned `ChatPageContent` chain and their tests (Dead Code Hygiene: list them, then ask).

### 10.3 Proposed acceptance criteria (draft, for the Architect to freeze)

| ID | Criterion | Proof class |
|---|---|---|
| AC001-01 | `run`/`history` derive identity server-side. Unauthenticated → 401 and mismatched `user_id` → 403, both with **zero** upstream calls | Route tests + live P4 |
| AC001-02 | T1 creates A and B under one agent. Both persist in recents after reload; each opens its own stored history; resume appends to the correct session. Proven by stored events, not model recall | Live P1/P2 + browser |
| AC001-03 | History 404 → `missing` (no send path that creates). 5xx/transport → `unavailable` with read-only retry. 401/403 → `access-unavailable`. A real empty session → `empty` | Route + adapter + browser fixtures + P3 |
| AC001-04 | A continuation against a missing session never creates or resubmits. Upstream submissions equal deliberate user sends | Connector tests with call ledger |
| AC001-05 | Pre-upstream rejection → `not-sent` with the draft kept. A post-contact failure → `uncertain`, which resolves to `ready` once a history read shows the turn. No automatic resend | Adapter + browser |
| AC001-06 | Once ADK creates a session, its ID is discoverable after reload even if metadata insert or `/run` fails (reconciliation or recovery visible) | Fault-injected fixtures + one live negative if authorized |
| AC001-07 | Catalogue list failure → "Conversations unavailable" with retry, never "A fresh start". Rename/archive failures surface and the row and title are kept | Service + browser |
| AC001-08 | Late list/history/send results never paint another user, backend, agent, session or draft view. Reads are aborted on navigation. Back to a completed draft never sends into a new session behind an old transcript | Deterministic race fixtures |
| AC001-09 | Rows, views and URLs carry backend identity. A → B → A with colliding session IDs shows only the active backend's rows and never creates A's ID on B | Two-contract fixture swap; P5 if a target is named |
| AC001-10 | The manifest agent → bundle → `urlEnv` model and the current cloud roster stay unchanged. Endpoint values never reach the browser | Source / equality checks |
| AC001-11 | Sign-out or user switch mid-request leaves no cross-user row, no prior-user content, and state cleared | Fixture + synthetic identities |
| AC001-12 | T2 can't list or read T1's catalogue or ADK history through app APIs | Live P4 (after AC001-01) |
| AC001-13 | Deployed `chat_sessions` schema/RLS verified before any change. Any migration is owner-applied, reversible, and covered by a cross-user negative | P0 + migration review |
| AC001-14 | APBM_000 regression: AC000-01…21 behaviours and the approved visuals hold. Maintained Jest, scoped Playwright and QA instruments pass, or each test-meaning change is individually ruled (KNOWN_LIMITS rule) | Full regression |

### 10.4 Files likely to change (implementation not authorized here)

- **Routes, connector, services:** `src/app/api/agent/run/route.ts`, `src/app/api/agent/history/route.ts`, `src/app/api/agent/_lib/adk.ts`; possibly a new `_lib` identity helper or a session-create route; `src/services/chatService.ts`, `src/services/sessionIndexService.ts`; `src/types/index.ts`.
- **Workspace:** `src/components/workspace/{productionAdapter.ts,types.ts,Workspace.tsx,WorkspaceEntry.tsx}`, plus the `navigation.ts` signature if the backend key enters the URL.
- **Config loader:** `src/config/manifest.ts` (projection of the non-secret backend key only). **Never** `config/agents.manifest*.json`.
- **Database:** a new reviewed SQL migration file, applied by its owner only.
- **Tests:** `src/__tests__/{api,services,workspace}/*`, `tests/workspace/*.spec.ts`, mocks.
- **Optional, by ruling:** `CyberizeSidebar.tsx`/`SessionPanel.tsx`/legacy chat files.

### 10.5 Regression risks

- Intentionally changing the N6 create+retry, sentinel and `[]` contracts **breaks currently passing maintained tests** (`adk-lib`, `agent-run`, `chatService.live`, `productionAdapter`, QA J-09/J-10/J-21). Each test-meaning change needs an explicit ruling.
- The adapter output drives every approved UI state, so a contract change can shift what users see. Keep fixture parity.
- The repair harness depends on `QAM/evidence/engineering-repair-001/` paths, which must be preserved.
- Build relies on the APBM_000 offline font route.
- **A Supabase migration hits a project the original frontend clone also uses** (kickoff §2: the clone shares the database, CLAIM).
- Live probes create real ADK and catalogue data.

### 10.6 Unresolved dependencies, and whether APBM_001 can be the final frontend build phase

| ID | Dependency | Owner |
|---|---|---|
| D1 | E3: ADK target, revision and **session-service durability**. If non-durable, frontend work cannot deliver durable resume | Tony / backend |
| D2 | E1/E2: Supabase project, plus actual `chat_sessions` DDL and RLS | Tony (owner-run P0) |
| D3 | E5: test identities T1/T2 and a tool-safe agent attestation | Tony |
| D4 | Identity, history-error, catalogue-recovery and backend-namespace contracts (§10.2 items 1–6) | Architect |
| D5 | Migration authority for the backend dimension on a **shared** project | Tony / Architect |
| D6 | E4: ADK direct-access policy. If the service is publicly invokable, frontend identity does not secure it | Tony / backend |
| D7 | A named second live target for A → B → A, or an explicit ruling that fixture-only switching qualification is enough | Tony / Architect |
| D8 | Rulings on navigation continuity (C1) and the legacy surfaces (S2/S3) | Architect / Tony |
| D9 | An execution environment with browser and network access for P1–P5 | Tony |

**Final-phase assessment (INFERENCE):** No source-level blocker found. Every frontend gap listed is addressable inside the existing App Router / service / adapter seams without UI redesign. APBM_001 can be the final planned frontend build phase **unless** any of the following holds:
- D1 shows a non-durable ADK session service. That needs a backend change outside this repo.
- D6 requires ADK-side authentication before a shared release.
- D5 migration authority is withheld, leaving the backend namespace fixture-only.
- D7 leaves config switching partially qualified.

Deployment and Gate D remain separate either way, as do Mission Control's live GCS path (KNOWN_LIMITS: "not 001 by default") and Engine 2 reviews.

### 10.7 Doctrine drift to correct

- Root `RECOVERY.md` CURRENT block.
- `KNOWN_LIMITS.md`/`APP_BRIEF.md` roster wording.
- The PUBLICATION_HOLD and carried-forward headers' QA-seat wording.
- 10-03 recon §3/§5 anchors that point into the now-unrouted `ChatPageContent` path (superseded by this report's §4).

### 10.8 Open questions

1. Q1: Server identity contract. Recommended: server-derived Supabase user as the ADK `user_id`.
2. Q2: Catalogue policy. Keep Supabase plus ADK-list reconciliation (recommended), or make ADK list primary?
3. Q3: UUID session IDs, replacing the R4 `session-<ms>` convention?
4. Q4: Navigation continuity in the draft view (C1). Is it a UI change within the approved design?
5. Q5: Legacy `/mission-control` session panel and the orphaned chat chain: keep, isolate or remove?
6. Q6: Which live probes (P0–P5) and budget does Tony authorize, with which identities?

---

🛑 Recon complete. Read-only of the inspected codebase; the only writes are the deliverables listed in the summary response. STOP. Handing to the Architect.
