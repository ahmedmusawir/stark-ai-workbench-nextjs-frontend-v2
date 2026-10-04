# APBM_000 — factual engineering handoff, engineering attempt 001 / corrected return 002

Tony: review this uncommitted candidate and its 37 individually documented inherited test failures. Selectively commit the reviewed candidate, then hand independent QA the committed identity on intended `qa/frontend-apbm-000` for Q1 intake via `../AGENTS.md`. QA Lead must adjudicate retained failures; Q2 needs its own approved plan and Director release. **No Gate Q certificate is issued.**

Engineering implementation/self-checks complete at 2026-10-04T21:59:35.844675+06:00. Candidate is **UNCOMMITTED**, actual branch `frontend-apbm`, source baseline/current HEAD `20ef380bdd6eed5e111d953d6404992add7a88a6`, repository `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2`. A HEAD SHA alone does not identify this dirty candidate. Full relevant-input inventory: `../../evidence/engineering-attempt-001/candidate-scope.json`, SHA256 `338dbdf4ee6a93590ce3114b34b49e66ec8c90df1020205ff6ec38e5d63c87cf`. 218 product/test/config/lock/build/font inputs are pinned. Exact initial and candidate status records separate pre-existing work from these edits.

## Delivered behavior

Authenticated `/chat` now renders configured directory, selected-agent workspace, local new draft and session-qualified conversation through strict encoded query identity. The workbench uses approved scoped zinc/Inter styling, dark/light preference, desktop sidebar/mobile drawer, responsive composer/recents, retained Markdown/code/copy/speech and isolated demo context. Live operation bindings remain the existing chat/history/metadata services. No real account, agent, backend configuration or authorization boundary was changed or exercised.

28 product/test/script files are listed individually with purpose and hashes in `../../evidence/engineering-attempt-001/changed-source-inventory.json`; complete review patch including new files is `../../evidence/engineering-attempt-001/product.patch`. `src/app/(cyberize)/layout.tsx` retains `protectPage`; AppShellPage has an explicit /chat-only opt-in and releases a legacy drawer lock on that transition. Other routes retain the original shell. Root styles/font/theme provider, active manifest JSON, API/native ADK/auth/services/stores/schema/lockfile/dependencies are unchanged. Protected equality: `../../evidence/engineering-attempt-001/protected-file-equality.json` (191 files); immutable authority equality: `../../evidence/engineering-attempt-001/frozen-packet-equality.json` (171 files). Existing intentional response deletions and unrelated logs are preserved.

## Actual verification

| Check | Actual result | Primary receipt/log |
|---|---|---|
| TypeScript noEmit | PASS; final build also completed TypeScript after last shared-shell edit | engineering-tsc-final.log/json; engineering-build-final.log/json |
| Production Next build | PASS, 49.417s; existing font access through supported approval | engineering-build-final.log/json |
| Targeted regression | 7 suites / 57 tests PASS | engineering-targeted-verified.log/json |
| Isolated browser | 33 tests PASS, 94.062s; includes 18 required render combinations | engineering-browser-verified.log/json; playwright-results.json |
| Full Jest | 30 passing/9 failing suites; 250 passing/37 failing tests | engineering-jest-complete.log/json; jest-comparison.json |
| Baseline comparison | 225 pass/38 fail initially; zero new failures; 37 same named failures with same initial diagnostic class and unchanged test files | INHERITED_FAILURES.md plus paired diagnostics |

All receipts are under `evidence/engineering-attempt-001`. The one resolved inherited expectation was the obsolete roster assertion in the touched manifest projection test; validation now checks the actual configured manifest without changing its identities. No unrelated legacy tests were rewritten. Full Jest is **not all green**. Lead adjudication is pending per KNOWN_LIMITS. Lint/audit/live integration/OS audio were not certified.

Browser attempts 1–3 failed during implementation (radius assertion units/selector, fixture charset, table cell compression). Logs, result JSON and synthetic screenshots are retained alongside the passing result. These are implementation iterations within attempt 001, not independent QA attempts. The final table min-width preserves readable cells/internal scrolling; mobile breadcrumbs truncate; metadata callback rejection preserves confirmed ADK ID/transcript. No product changes followed the final browser run except the unrelated shared-shell lock correction, which has a passing unit regression and was included in final build/full Jest.

Exact prerequisites/boot/teardown/commands/fixture provenance/network policy: `../../evidence/engineering-attempt-001/REPRODUCTION.md`. Renderer screenshot names explicitly identify view/theme/width. Screens show fictional fixture messages only. Callback proof is in browser assertions/results and mocked adapter tests, not real service requests. Guards report zero unexpected Node service attempts; no live agent requests were made. The real Next authenticated runtime was not booted because the approved harness isolates auth/data. Production source/build and mocked existing-service bindings are the integration evidence.

## Limitations and findings, with smallest next action

1. **37 inherited roster-dependent test failures.** Reproduce with the full guarded Jest command. Exact test names, source hashes and paired expected/actual diagnostics: INHERITED_FAILURES.md / jest-comparison.json. Current workaround: use focused fixture/adapter evidence only within APBM_000 scope. Owner: independent QA Lead; adjudicate individually or request separately scoped fixture repairs. Engineer has not waived them.
2. **Legacy error ambiguity and auto-recovery.** getHistory/list may collapse errors to empty; rename/archive may swallow errors; native run retains its broad 404 recreate/retry and error sentinel. New UI emits no automatic retry/recreate, but cannot override protected behavior. Reproduction here is source inspection and mocked adapter tests only. Owner: APBM_001 Architect/Engineer, design structured error/ownership/recovery contracts before live qualification. Typed UI states are not proof production distinguishes them.
3. **Authorization, backend activation, durable ownership/index/races remain unqualified.** Client user context partitions UI state only. Existing server user_id handling, lack of backend dimension in metadata, RLS/deployment and legacy cache lifecycle remain phase-001/release work. No live workaround/config switch was applied. Owner: JARVIS to scope APBM_001; authorized real integration tests only after identity/target decisions.
4. **Historical chat implementation retained.** Old ChatPageContent/ChatInput/MessageList and associated legacy controls no longer drive the /chat page, but remain for existing consumers/tests; shared MessageBubble/MessageActions remain active. No dead-code cleanup is included. Owner: Architect decides any later removal scope; no removal decision blocks this return.
5. **Environment.** Initial font/socket restrictions resolved through supported approvals and already-installed Chrome; no install/config change. Browser/font access may require the same mechanism on another runner. Smallest setup if absent there: environment owner supplies allowed loopback/installed browser/font access; do not switch backend or add auth bypass. Known obsolete lint remains separate toolchain work.

## QA intake and selective staging

Per-AC Engineer claims: `../../evidence/engineering-attempt-001/ENGINEER_AC_CLAIMS.md`. QA derives its own plan; this matrix is not the QAM test plan. `../QAM_MANIFEST.md` supplies facts only; independent plan/approval/checkpoints/state/certification files remain frozen/unfilled.

`../../evidence/engineering-attempt-001/SELECTIVE_STAGING.md` and `staging-paths.txt` enumerate exact candidate paths and separate packet/evidence from prior cleanup/log history. Tony reviews and stages only those paths; no blanket add, historical deletion sweep or unrelated prior reports. Engineer performed no staging/commit/checkout/branch creation. After Tony's reviewed commit, independent QA must pin real candidate SHA and full relevant input equivalence; do not call the current HEAD a tested committed candidate.

## Engineering return

`ENGINEERING_attempt-002.zip` plus identical `/home/moose/Downloads/ENGINEERING_attempt-002.zip`. REVIEW_START_HERE and FILE_INDEX describe every member, source path, purpose, byte size and SHA256 (index omits its own hash). A separate receipt records ZIP SHA/CRC and membership verification. Export is explicit allowlist: contract/governance/rulings, these facts/claims, reviewed source patch/files and safe evidence. No credentials, env files, auth state, private histories, build output, dependencies, recursive handoff archives or independent verdict fabrication.

Design is a separate already-supplied dependency: `STARK_AGENT_WORKSPACE_DESIGN_RETURN_v1_0.zip`, SHA256 `77d1b42698219470fc4e3a0c0427927683bdb34e5888cd9abd60a430812895c1`. Final DESIGN directory exists in this checkout; its authority files are byte-identical to entry. This return references that pack rather than rebundling it. QA needs the existing DESIGN assets for fixture fonts and the canonical previews for its own comparison.

## Director-requested documentation relocation

Corrected 2026-10-04T22:14:42.603752+06:00: canonical factual handoff moved to `QAM/HANDOFFS/QA_HANDOFF.md`. The module-root file is only a compatibility pointer for original entry references. QAM entry, manifest and handoff-folder README now point here. Return 002 supersedes return 001 for document placement; source candidate, tests, results and acceptance criteria are unchanged. Original return/evidence remain historical records. The original frozen-file equality observation predates this authorized QAM_ENTRY documentation-path correction; see `../../evidence/engineering-attempt-001/handoff-location-correction.json`.
