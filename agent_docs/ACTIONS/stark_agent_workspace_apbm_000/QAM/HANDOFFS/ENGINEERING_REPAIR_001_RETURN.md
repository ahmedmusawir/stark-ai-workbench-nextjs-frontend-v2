# APBM_000 — ENGINEERING REPAIR 001 RETURN

Cody, Engineer · 8 October 2026 · **Bounded repair complete, uncommitted. Gate Q pending.**

F01–F04 and the exact local-Inter source exception are implemented. Final maintained Jest **290/290**, focused **64/64**, typecheck **exit 0**, engineering offline browser **27/27**. These are Engineer self-checks. The normal production build, output identity and separation scan are **NOT RUN here** and belong to the next Lead-approved independent attempt. No Q2 attempt restart, Q5, certificate or closeout occurred.

## Checkout, ownership and uncommitted identity

- Actual repository: `/home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2`.
- Actual starting/current branch: `qa/frontend-apbm-000`.
- Actual starting/current full HEAD/parent: **`9c50884d4c4513b6969311d5be7c05828104ed3d`**. There is no repaired commit SHA.
- Reviewed product candidate: `f21564cacb563ecddbf78b1685086c9489bf1c26`.
- Reported execution HEAD: `c4ed7042fa05fa638bdc6d4327ecba3448d44cef`, present in Git.
- Successors after execution: `24ccf307ba04460f0d9663e4ce1c71984d58e369` (Q2 reports/evidence/instruments), then `9c50884d4c4513b6969311d5be7c05828104ed3d` (checkpoint/docs). Product/config/package files have no committed drift from reviewed candidate to entry HEAD.
- Starting working-tree status was exactly ` M package-lock.json`. Existing diff: 1912 additions/1069 deletions. Its entry hash and exact diff are recorded in [entry-state.json](../evidence/engineering-repair-001/entry-state.json) and [pre-existing-lock.diff](../evidence/engineering-repair-001/pre-existing-lock.diff). The file is preserved byte-for-byte and excluded from repair/staging.
- Tony confirmed **“Claudy is paused; Cody has the writer slot”** before edits. No concurrent changes were observed. No staging, commit, branch switch, merge, push or history rewrite was performed.

Repair identity is the parent above plus [product.patch](../evidence/engineering-repair-001/product.patch), SHA-256 **`fac3f21262dca396f5c7b7d71143bbfff1a0f21a809f0278315f1d4d7beebaaa`**. This includes the 18 product/test/font paths and exact binary additions. [repair-authored.patch](../evidence/engineering-repair-001/repair-authored.patch) also includes changelog/handoff/instruction text. [file-inventory.json](../evidence/engineering-repair-001/file-inventory.json) lists every authored evidence path/hash; [repair-identity.json](../evidence/engineering-repair-001/repair-identity.json) pins both patches, inventory, staging list and actual final status. Evidence is inventoried rather than embedded recursively; identity/inventory self-hashes are explicitly omitted to avoid circular hashes.

## Authority and precisely missing evidence

The verbatim instruction is installed at [ARCHITECT_ENGINEERING_REPAIR_001_2026-10-08.md](ARCHITECT_ENGINEERING_REPAIR_001_2026-10-08.md). Original F01–F04 and attempt-001 evidence are present and unchanged.

The **post-Q2 QA Lead 7 October disposition is missing**: no record adjudicating F01–F04, the font-build route and instrument gaps after attempt 001 was located. Existing `LEAD_REMOTE_ROSTER_APPROVAL_2026-10-07.md` and `LEAD_RETURN_START_HERE_2026-10-07.md` are pre-Q2 roster approvals. Their presence is not evidence of the later disposition. Its original filename/content was not supplied; no guessed file or approval was created. Search details and impact: [MISSING_EVIDENCE.md](../evidence/engineering-repair-001/MISSING_EVIDENCE.md). Current Architect authority allowed implementation; it supplies neither a new Lead approval nor certification.

## F01–F04 mechanisms, repairs and regressions

| Finding | Mechanism and bounded repair | Actual maintained regression |
|---|---|---|
| F01 / AC000-13 | Old detached `logout().finally(...)` could reject on persistence and skip `/auth`. Entry `finishSignOut` catches reset's post-update persistence failure and navigates; both logout promise outcomes are consumed. Real Zustand reset applies in-memory initial state before persistence. Real auth's successful mocked HTTP logout can similarly clear state before a persistence write rejects. No store/auth/persistence-key/hydration/session redesign or chatStore edit. | Three real **auth + chat** store tests: normal storage, throwing getter at initialization, failed writes in both stores. Seed prior-user identity, messages, pointers/list, selection, loading/errors, draft and edited demo. Assert cleared user/chat/draft/demo, retained hydration flag, navigation after mocked logout, no unhandled rejection, and normal persisted empty bookmarks without transcripts. Before repair, failed writes reproduced no navigation. Final all 3 pass. `focused-before-repair.*`, `focused.*`, `full.*`. |
| F02 / AC000-17 | Combined `[aria-current], a` selected the first link; media timer and modal close restoration could disagree. Remove the separate media focus timer. Modal close-autofocus searches rendered, CSS-visible current links first, then visible anchors, then main. Normal mobile close still returns to the menu trigger. | Five browser checks: Echo selected, drawer open at 800px → 1200px focuses Echo after delayed close callbacks settle; hidden current item falls back to All agents; Escape/Close/backdrop retain mobile trigger focus. Independent QA instruments untouched. |
| F03 / AC000-17 | The short mobile label was 40px wide despite 44px line height. Only add `min-width:44px` to the existing mobile breadcrumb rule. | Agents is **44×44 CSS px** in directory/workspace/conversation at 375px, both themes. All 18 view/theme/375–768–1280 checks have **0px page overflow**. `*-metrics.json`, `screens/`, `browser-results.json`. |
| F04 | JSON-to-itself equality did not independently prove bundle mappings. Replace it with literal v1 → ADK_BUNDLE_URL_V1 and v2-local → ADK_BUNDLE_URL_V2_LOCAL expected objects. | Maintained manifest tests pass. Structural validation, configurable-roster assertions, per-agent resolution and generic defaults retained. No obsolete Hermes IDs or real configuration changes. |

Mocked logout does **not** prove server logout, token revocation or live cross-user correctness. A denied durable write cannot prove previously saved browser storage was overwritten; this repair proves in-memory clearing and navigation. Durable hydration/session ownership remain outside scope. The previous storage-defect waiver was not reinstated.

## Exact changed product/test files

| Repository-relative path | Purpose |
|---|---|
| `src/components/workspace/WorkspaceEntry.tsx` | F01 entry boundary |
| `src/components/workspace/Workspace.tsx` | F02 focus ordering/visible fallback |
| `src/app/(cyberize)/chat/workspace.scss` | F03 mobile minimum width only |
| `src/__tests__/config/manifest.test.ts` | F04 independent mappings |
| `src/__tests__/workspace/signout.test.tsx` | Three real-store regressions |
| `tests/workspace/repair.spec.ts` | Maintained focus/target/overflow/font checks |
| `tests/workspace/repair.config.ts` | Separate engineering config, isolated port, QAM evidence output |
| `src/app/layout.tsx` | Font import/body class only |
| `src/app/fonts/inter.css` | Seven original faces/local URLs, established fallback/class |
| `src/app/fonts/inter/OFL.txt` | Original copyright and OFL license |
| `src/app/fonts/inter/PROVENANCE.json` | Source/hash/license/range/fallback provenance |

The seven additional WOFF2 paths are individually listed below. Record changes: existing root `CHANGELOG.md`, dated instruction, this return, canonical `QAM/HANDOFFS/QA_HANDOFF.md`, and every explicitly inventoried artifact under `QAM/evidence/engineering-repair-001/`. No new QA/repair records were written at the APBM root. Its pre-existing compatibility handoff pointer and historical engineering records were preserved. Full exact list: `file-inventory.json` and `staging-paths.txt`.

## Font provenance, hashes, license and differences

The original disposable mediator folder/raw CSS was absent. All seven local `.next/dev/static/media` assets matched Q2 hashes (`font-cache-matches.json`); cached generated CSS established current fallback metrics. The **existing enforced font-only mediator** recovered the original CSS and binaries: sandbox DNS failed once (exit 1); one supported approved retry succeeded (exit 0). All eight source hashes/byte lengths exactly match original `q2-attempt-001/q2-4/mediator-log.json`. No other retrieval route, open proxy, new live-service access or different revision was used.

Original CSS: `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap`, 2535 bytes, SHA-256 **`9b6ad588c451f646d506bc6badb76ecc384691fba35615f0f7d2e175150d6580`**. Binaries retain Google Fonts Inter `/s/inter/v20/`. Production CSS uses relative product assets; no runtime import comes from QAM. The retrieval utility's mock module remains disposable in `/tmp` and was **never used for a build**.

Paths below have prefix `src/app/fonts/inter/`:

| File | Subset | Bytes | SHA-256 |
|---|---|---:|---|
| `inter-cyrillic-ext.woff2` | cyrillic-ext | 25844 | `fccca918fea40089dacadc7045861314d1a6bc91f1f323cc1eeb22ebcdb321b5` |
| `inter-cyrillic.woff2` | cyrillic | 18744 | `aebf2ab4a4ce6810d73c1ac7be7cafb4e5ec4cee2d6db5fb3e09691747ec4bd6` |
| `inter-greek-ext.woff2` | greek-ext | 11272 | `a2e2c783ca6f9c20486e81e72a279203e86730bbf8f01ff6a5ee9dbd09e1c271` |
| `inter-greek.woff2` | greek | 19044 | `46dd4cdca58c26ae87cc6927657bf83b2e8abfc39ffd0ab176e301a8d28d22bf` |
| `inter-vietnamese.woff2` | vietnamese | 10280 | `8db00ff46c67b22cda8bed865acf7077651cac8d2841d5b40980556b48961931` |
| `inter-latin-ext.woff2` | latin-ext | 85272 | `a28eb6d3ccb534ae0c94ca999371df024aab60b08c3c8a5720ee9e32fa0faaa2` |
| `inter-latin.woff2` | latin | 48432 | `c940764593d0fe5d596be327ca7558855e018039fb78509aa21921fd3644c3e4` |

`OFL.txt` is copied unchanged from `DESIGN/assets/OFL.txt`: copyright 2020 The Inter Project Authors; SIL Open Font License 1.1; SHA-256 **`5b9321a4298cfeb6b34354164a1c3afc3db114569984c502b9b35d988fd58c57`**. Unmodified fonts are bundled with copyright/license; no font dependency was added. Product `PROVENANCE.json` retains exact URLs, ranges, hashes and license source.

Preserved: seven Unicode ranges/order, normal style, variable **100–900**, **display:swap**. Arial fallback stays **90.44% ascent, 22.52% descent, 0.0% line gap, 107.12% size adjust**. Body has the same `Inter, Inter Fallback` family/style via `inter-font`; providers, metadata, theme options and other classes are unchanged. Next's automatic Latin preload is no longer emitted by `next/font`; ordinary CSS loading with swap replaces it. Initial loading timing was not benchmarked.

Four offline root comparisons (375/1280, fonts loaded/blocked) show exact equality of measured text/control boxes, family, size, weight and line height between prior and local declarations. All seven faces load in the multilingual probe. These probes represent non-workbench root text/form/table surfaces; actual authenticated routes/live login were not exercised. Eighteen Workspace renders use product workspace/global/font styles. Representative synthetic screenshots were inspected. **No font-asset/declaration/license blocker remains.** Independent build/output proof is still pending.

## Commands, exit codes and evidence

Actual complete commands, timestamps, durations, sanitized environment policy and namespace enforcement are in `*-command.json`. Installed environment: Node **24.15.0**, npm **11.12.1**, Next **16.4.0**, Zustand **4.5.4**, Jest **30.5.2**, TypeScript **5.5.4**, Playwright **1.59.1**. Historical Q2 Node 26.7.0/Next 16.2.6 results are not today's results. No install/dependency edits were made.

Evidence prefix: `QAM/evidence/engineering-repair-001/`.

| Actual check inside namespace | Exit | Result / evidence |
|---|---:|---|
| `npm test -- --runInBand --json --outputFile=<baseline-full.json>` | 1 | Fresh baseline: 286 pass/1 fail, 39 suites. `baseline-full.log/json`, `baseline-full-command.json`. |
| `npm test -- --runInBand --runTestsByPath <eight maintained paths> --json --outputFile=<focused.json>` | 0 | 64/64, 8 suites. Exact paths in `focused-command.json`; `focused.log/json`. |
| `npm test -- --runInBand --json --outputFile=<full.json>` | 0 | 290/290, 40 suites. `full.log/json`, `full-command.json`, `jest-comparison.json`. Zero new failures or removed tests. |
| `npx --no-install tsc --noEmit` | 0 | `typecheck.log`, `typecheck-command.json`. |
| `node node_modules/@playwright/test/cli.js test --config tests/workspace/repair.config.ts` | 0 | 27/27. `browser.log`, `browser-command.json`, `browser-results.json`, metrics/screens. Browser and fixture share a fresh network namespace with only loopback enabled; exact-origin browser guard/synthetic services. |
| `python3 .../verify_inputs.py` | 0 | Seven hashes, exact original CSS/declarations, license/protected source/evidence equality. `font-and-protected-verification.json`. |
| `git diff --check` | 0 | Final whitespace check; no Git index changes. |

Reproduce via the full repository-relative prefix `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/engineering-repair-001/`: `python3 <prefix>/run_verification.py baseline-full|focused|full|typecheck`; browser: `python3 <prefix>/run_browser.py`. These use installed commands in `unshare -rn`, no inherited credentials/service variables/NODE_OPTIONS; browser loopback is enabled only inside its new namespace. Supported runner execution permissions may be required; verification requires no unrestricted egress.

Preserved iterations: initial test scaffold used the wrong composer label (3 setup failures, `focused-setup.log`); corrected pre-repair regression reproduced write-failure/no-navigation (`focused-before-repair.*`); initial typecheck found unsupported Testing Library `exact` option, corrected (`typecheck-initial.*`). Initial browser passed; probe styling was then limited to its typography surface and final 27 checks passed again (`browser-initial.*` retained). Original attempt-001 evidence was never overwritten.

The baseline-only failure was **`AddMemberForm does not redirect when addMember returns an error`**; it passed in the final run. Source/test hashes are unchanged (`baseline-only-failure-source.json`). An outstanding 100ms loading-test promise suggests timing contamination; this is an inference, not a confirmed diagnosis or repaired product bug. No waiver is claimed. Storage's existing F5 test passed both fresh baseline and final on this installed toolchain.

## Proposed staging and remaining independent work

Review [staging-paths.txt](../evidence/engineering-repair-001/staging-paths.txt) and `repair-authored.patch`. Every proposed path is explicit. Tony may stage the reviewed list with:

```bash
git add --pathspec-from-file=agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/engineering-repair-001/staging-paths.txt
```

**This command was not executed.** Excluded: pre-existing `package-lock.json`, RESPONSES files, caches/browser `.last-run.json`, `.next`, `/tmp` mediator copies and recursive archives. Seven verified product WOFF2 files are intentional source assets. Declaration snapshots are retained textual provenance evidence, not duplicate disposable font binaries. Tony separately owns the existing lockfile change; independent QA must account for it rather than conceal it or claim a clean candidate.

1. QA Lead supplies/confirms the missing post-Q2 disposition and approves next-attempt candidate-bound coverage. Tony reviews/commits selected repairs. QA pins the **actual** new commit and environment; no repaired SHA is invented and attempt 001 is not restarted.
2. Claudy/Lead own browser guard, screenshot-harness, visible-focus and QA-instrument corrections. Their independent assertions/instruments are unchanged. Independently retest F01–F04 and root-font route effects; Engineer fixture success is not certification.
3. Run the **normal installed production build**, **network denied**, **no `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` or other QA font hook**. Successful build, output identity and separation scan belong to that next approved attempt. No build result was inferred here.
4. Preserve **D4 ALLOW**, **D7 OMIT**, Tony's six remote agents/all v1, and both bundle/urlEnv mappings. Gate Q pending; no Q5/closeout. The disappearing-conversation live cause remains untriaged; no localStorage transcripts were introduced.
