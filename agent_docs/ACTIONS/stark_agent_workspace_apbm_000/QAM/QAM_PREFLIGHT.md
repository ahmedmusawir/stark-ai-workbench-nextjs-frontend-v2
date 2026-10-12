# Q1 readiness record
Status: **COMPLETE — READY_FOR_PLAN_REVIEW** (this does not mean Q2 is approved). Recorded 2026-10-04T23:15+06:00 by the independent QA Executor.

Seat: independent QA Executor (Claudy; Claude Opus 5.5 in Claude Code), entered via `QAM/CLAUDE.md` → `QAM_ENTRY.md`. The Engineer seat was not reused. No self-certification. Evidence: `evidence/q1-attempt-001/` (index: `evidence/q1-attempt-001/INDEX.md`).

Files loaded, in QAM_ENTRY order: ../GOVERNANCE.md, ../ACCEPTANCE_SPEC.md, ../RULINGS_ADDENDUM.md, HANDOFFS/QA_HANDOFF.md (+ the ../QA_HANDOFF.md pointer), ../KNOWN_LIMITS.md, QAM_STATE.json, QAM_MANIFEST.md, QAM_PREFLIGHT.md, QAM_RISK_REQUIREMENTS.md, QAM_TEST_PLAN.md, QAM_CHECKPOINTS.md, QAM_PROMPTS.md. Also: ../DATA_CONTRACT.md, ../FILE_SCOPE.md, AC_EVIDENCE_MATRIX.md, EXPORT_RULES.md, DIRECTOR_MANUAL_CHECK.md, PILOT_RESULTS.md, QA_CERTIFICATION.md, QA_CLEANUP_REPORT.md, QA_EXECUTION_REPORT.md, REPAIR_PROPOSAL.md, AUTOMATION/evidence/HANDOFFS READMEs, both ENGINEERING receipts, and Engineer evidence (REPRODUCTION, SELECTIVE_STAGING, INHERITED_FAILURES, candidate-scope, changed-source-inventory, protected/frozen equality, relocation, safety, jest-comparison, playwright-results). Product source read: all `src/components/workspace/*`, chat page/layout/AppShellPage/MessageBubble/MessageActions diffs, manifest.ts diff, `tests/workspace/*`, `playwright.workspace.config.ts`, `jest.config.js`, root ThemeProvider props.

## 1. Role, branch, handoff, candidate — PASS with docs-only notes

- Repo `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2`, branch **`qa/frontend-apbm-000`** (the intended name). HEAD **`22ce03ba3871ea53e5253f2e3f060a1bab3226a3`**, single parent = baseline `20ef380…`. The same commit is on `frontend-apbm-000`, `origin/frontend-apbm`, `origin/frontend-apbm-000` and `origin/qa/frontend-apbm-000`. Committer: Ahmed Musawir, 2026-10-04 22:55:39 +06:00.
- Working tree is clean except QA's own untracked QAM additions.
- Handoff is complete and factual (`HANDOFFS/QA_HANDOFF.md`, SHA256 `65928d72…`). ENGINEERING_attempt-002 supersedes 001 for document location only.
- Instrument `AUTOMATION/q1_candidate_identity.py` → `candidate-identity-check.json`:
  - **28/28** declared changed product/test/script files match the Engineer's candidate hashes at HEAD.
  - **191/191** protected files are identical across baseline = HEAD = recorded.
  - **217/218** pinned scope inputs match at HEAD. The exception is `next-env.d.ts`, which is gitignored and Next-generated. Its working-tree hash matches, but it is not part of the committed candidate. No impact.
  - **169/171** frozen-packet files match. The 2 differences (`QAM_ENTRY.md`, `HANDOFFS/README.md`) equal the documented Director relocation hashes, and all 8 relocation documents match.
  - **Zero product/config/test/dependency paths changed outside the 28 declared.** package.json adds only `test:workspace`. The lockfile is unchanged.
- **Docs-only note N1 (Director Git decision):** the commit holds 404 paths. All 341 staging-allowlist paths are present, plus 63 paths outside the allowlist, all documentation/logs: the 27 historical `agent_docs/RESPONSES/response_2026-07-*` deletions (R000-10 said these are not swept in unless Tony chooses, and this commit includes them), recon/response/session files, CHANGELOG/RECOVERY, and both ENGINEERING ZIPs with receipts. This is not product drift and does not block QA. Recorded for Lead/Tony acknowledgement.
- Sensitive-name scan of the commit diff (`.env`, secret, cred, pem, auth state, HAR, trace): no hits. `.env.local` exists locally and is untracked. QA did not read it.

## 2. Contract inventory — PASS

ACCEPTANCE_SPEC v1.0 SHA256 `57f8d9f4dec8ca826326067254b0916ef65ccd51b635a8ac6ead73e8ab469fcc`. RULINGS_ADDENDUM v1.0 `99d4c40f7094106f4386d4d8ff5535228feb653dcbe0fd948a14a0ff1ec3b36f` (R000-01…11, no later amendments). GOVERNANCE `8a14a898…`. KNOWN_LIMITS `5644192d…`. DATA_CONTRACT `3a2e5bec…`. FILE_SCOPE `4db42a19…`. Design baseline: `DESIGN/` files are byte-identical to the frozen record (within the 169/171 above). Supplied pack SHA256 `77d1b426…95c1` (referenced, not re-hashed as a ZIP; the ZIP is not in this checkout).

Grading scope is phase-000 fixture UI + source/build regression only. Deferred, not graded: live ADK sessions, server-bound identity/authorization, Supabase/RLS, endpoint switching, Hermes isolation, durable metadata recovery, shared deployment, OS speech, real soft keyboard. No contradiction found that blocks plan drafting. Scope questions for the Lead are listed in the plan (D4–D6).

## 3. Test commands, browser, port, bootstrap, teardown — READY with one instrument constraint

- Versions: Node v26.7.0, npm 11.19.0, Next 16.2.6, @playwright/test 1.59.1, Jest 30.0.5, TypeScript 5.5.4, React 19.2.4, zustand 4.5.4, Chrome 154.0.8037.92 (`/opt/google/chrome/chrome`). These match the manifest.
- Harness `tests/workspace/harness.cjs` boots on the QA port 43181 through `APBM_WORKSPACE_PORT` in 7s, serves only `/`, bundle, CSS and four font paths, returns 404 for traversal attempts, and on SIGTERM removes its temp dir and releases the port. Residue: a `node-jiti` cache in TMPDIR, which Q2 handles with a run-owned TMPDIR.
- Chrome smoke: attempt 1 failed because of a **QA instrument error** (QA's long TMPDIR gave Chrome a "Socket path too long" error). One diagnostic retry with a short TMPDIR passed, and only the loopback origin was requested.
- **Constraint C1:** `playwright.workspace.config.ts` (outputDir and JSON reporter) and `tests/workspace/workspace.spec.ts` (screenshot path, origin 43170) are hardcoded to write into `evidence/engineering-attempt-001/`. Running `npm run test:workspace` in Q2 would overwrite Engineer evidence. Q2 therefore uses a QA-owned config under `QAM/AUTOMATION` and runs the Engineer spec only as a path/port-substituted QA copy (decision D6). Recommended later Engineer hygiene: parameterize those paths. Non-blocking.

## 4. Fixture traffic confinement — READY with one guard gap and a proposed fix

- The browser fixture loads only loopback (smoke). The harness webpack plugin rejects imports matching `services/|utils/supabase|store/useAuthStore|productionAdapter|WorkspaceEntry`. The harness strips the process env down to PATH/HOME/LANG/TMPDIR/port/NODE_OPTIONS and loads no dotenv.
- Node guard negative controls (`guard-controls.cjs`): fetch, net.connect (object and args), http.request and https.get to external hosts are **BLOCKED**. Loopback is allowed. **Gap G1:** UDP (`dgram`), DNS lookups and child processes are **not** intercepted by the in-process guard. Probes used non-routable/reserved targets only.
- **OS-level isolation is available:** `unshare -rn` with `lo` up gave DNS EAI_AGAIN, and the harness plus Chrome smoke both passed inside it. Proposed as the primary Q2 network control (decision D3).
- No credentials were loaded or needed. No login, model invocation or live service call happened in Q1. Production auth is untouched (layout `protectPage` retained; AppShellPage bypass applies only to the shell on `/chat`).
- **Coverage boundary B1:** the fixture harness deliberately excludes `WorkspaceEntry`/`productionAdapter` and does not run Next. Browser evidence therefore never exercises the real `/chat` route composition (auth guard, AppShellPage opt-in, Suspense/useSearchParams, router.push, root ThemeProvider/next/font). The plan covers these with QA Jest tests plus build/source inspection, qualified per R000-11 (decision D5).

## 5. Build / typecheck / Jest vs baseline — VERIFIED (except build)

- TypeScript noEmit (guarded, `env -i`): exit 0, 11s.
- Full Jest reproduced independently on both trees: candidate 250/37/287, baseline 225/38/263. **0 new failures.** The 37 retained exactly match the Engineer list. The one "resolved" test was rewritten under a new name. One retained failure (chatStore SSR guard) is **not** roster-caused. Details: `evidence/q1-attempt-001/INHERITED_FAILURE_ASSESSMENT.md`.
- **Production build NOT RUN in Q1.** It needs Google Fonts egress (root `next/font` Inter) and Next reads the existing private `.env.local`. This is a Lead environment decision (D4). The existing `.next/` (Engineer build at 21:55, before commit) is not candidate-bound evidence.
- Reuse: the Q1 Jest/tsc runs are bound to 22ce03b. They may be cited in Q2 only if the Q2 identity re-check shows zero source/config/test/dependency change. Q2 reruns them anyway as its own record.

## 6. Instrumentation and evidence boundaries — DECLARED

- Disposable QA tooling only under `QAM/AUTOMATION/`. Durable evidence only under `QAM/evidence/q<N>-attempt-<NNN>/`. Packages go in `QAM/HANDOFFS/` (+ ~/Downloads copy per EXPORT_RULES).
- Run-owned temp: a short TMPDIR under `/tmp/claude-1000/` plus the QA scratchpad (outside the repo). Q2's `next build` would overwrite the gitignored `.next/`.
- Never modified: product code, maintained Engineer tests, `tests/workspace/*`, configs, package/lock, acceptance/rulings/design, Engineer evidence.
- Excluded from capture: `.env*` values, cookies/tokens/auth state, browser profiles, traces/HAR, private histories, provider metadata. Logs are rewritten to replace home/scratch paths. Pattern scan before export. Screenshots show synthetic fixtures only.

## 7. Independent plan — DRAFTED

`QAM_TEST_PLAN.md`, plan **QA-APBM000-PLAN v0.1**. It is risk-based, maps all 24 ACs, uses QA-authored rosters/scenarios/negative controls, and treats Engineer tests as a secondary input only.

## 8. Outcome

**READY_FOR_PLAN_REVIEW.** Q1 package `HANDOFFS/Q1_attempt-001.zip`. Lead decisions D1–D8 are listed first in the package REVIEW_START_HERE. Q2 has not started and Gate Q has not been issued.
