# QA execution report — Q2 attempt-002

**Status: EXECUTED; returned to QA Lead for findings disposition. Gate Q PENDING. Q5 not started.** Executor: Claudy (independent QA Executor; sole writer — Cody paused per the Director release; Codex processes present on the workstation held no repository files open and no repository file changed outside this attempt's own records during the run).

## Identity and authority

| Item | Value |
|---|---|
| Product candidate / execution HEAD | `8eb5789d9021ad06c15db36db74419a2b5c68fc5` on `qa/frontend-apbm-000` (HEAD = candidate; index empty; product tree = candidate bytes). Parent `9c50884d4c4513b6969311d5be7c05828104ed3d` |
| Plan | QA-APBM000-PLAN v0.3 `6b3f5df3e89c6a873684248b4ce790173726218c6379161c100564f785199c04` (v0.2 preserved byte-exact at `HANDOFFS/QAM_TEST_PLAN_v0.2_PRESERVED_2026-10-11.md`) |
| Lead approval / binding / intake verification | `72e1970d…` / `06aed917a0b22d804ad7d0c0cb5f2421821b28f75fc95ff40ba43bc66d551939` / `c188b637…` |
| Lead delivery | `~/Downloads/APBM000_RETEST_002_LEAD_PACKAGE_2026-10-11.zip` SHA-256 `2772d6d2…1cda` = Director-supplied digest; 8/8 members = index; index `de25fa28…` bound through the ZIP digest. Install record `preparation/INSTALL_RECORD.json` (8 new, plan v0.2→v0.3, 0 conflicts) |
| Director release | `HANDOFFS/DIRECTOR_Q2_RELEASE_002_2026-10-11_174045_BDT.txt` SHA-256 `adb0a64257d2e0566552889e94133333166fa9235111934abc94daa204d56674` (verbatim; bound in `HANDOFFS/DIRECTOR_Q2_RELEASE_002_BINDING_2026-10-11.json`). D4 ALLOW, D7 OMIT |
| Acceptance / rulings | `57f8d9f4…` / `99d4c40f…` (gate-verified) |
| Instrument freeze | acceptance under r4 `3c134849…` (A-controls, E, F, B, C, D, G) and r5 `f668a286…` (G-diag-s20, H); revisions and receipts in `preparation/` (see `INSTRUMENT_RETRY_LEDGER.md`) |
| Active time | 17:40:45 → 18:08 execution complete (≈28 min of the 3 h bound), records/export after |

## Commands and exits (from repo root; `AUTOMATION/a2_run.sh`: `unshare -rn` loopback-only namespace, `env -i`, run-owned TMPDIR; exact command/start/duration/exit in each `<stage>.cmd.json`)

| Stage | Command | Result |
|---|---|---|
| A gate | `python3 -I AUTOMATION/q2a2_gate.py --candidate 8eb5789d… --parent 9c50884d… --binding … --approved … --freeze … --supplied-patch …` | preflight run 1 STOP (G6 instrument serialization + G10b), run 2 STOP (G10b only, next-env), **post-build GATE_PASS 17/17** |
| A gate controls | `AUTOMATION/a2_gate_controls.sh` (scratch copies + `git clone --shared` mirror) | 6/6 detected: tampered binding hash (G5), unauthorized source addition (G9), changed source (G9), non-ancestor HEAD (G2), unapproved instrument hash (G15), unfrozen executable (G14/G15); mirror baseline = real checkout |
| A namespace controls | `node AUTOMATION/netns_escape_controls.cjs` | HTTPS, font host, direct IP TCP, UDP, DNS, child curl all blocked; 0 listeners |
| A policy controls | Playwright `s00_policy_controls` (QA config, Node guard preloaded) | run 1 3/1 (instrument oracle); **run 2 4/4 expected** |
| E build controls | `node AUTOMATION/netns_escape_controls.cjs` in a fresh build namespace (no guard) | all_blocked true |
| E | `node node_modules/next/dist/bin/next build` | **exit 0**, 9.4 s, Next 16.2.6 Turbopack incl. its TypeScript pass; `- Environments: .env.local` (D4; values never read by QA); BUILD_ID `QWT8ECmIa187SCzTCHuq2`; 25 routes incl. `ƒ /chat` |
| F | `python3 -I AUTOMATION/a2_output_audit.py` + `node AUTOMATION/static_audit.cjs` | all verdicts true (fresh output, `/chat`, 0 markers / forbidden imports in 464 fresh files, seeded control flagged, 7/7 fonts byte-equal, CSS resolves 7/7 subsets, 7 Inter faces + fallback face; 0 font preload links in 52 HTML/RSC outputs). X-02/12/14/15/20 PASS, build markers RUN, 0 hits |
| B | `node node_modules/typescript/bin/tsc --noEmit --incremental false` | exit 0 |
| C | `node node_modules/jest/bin/jest.js --runInBand --ci --json --outputFile=<C>/maintained.json` | **290/290, 40/40 suites**, 0 skipped/todo; inventory identical to Engineer's latest 290 |
| D | same Jest `--config QAM/AUTOMATION/jest.qa.config.js` | **31/31, 6 suites** (attempt-001 inventory 28 + 3 real-store F01) |
| G | Playwright QA config, workers 1, retries 0 | **34/34 expected** (incl. C-04 designed failure), 102.9 s; 34 per-test ledgers |
| G-diag | S-20 only with `FONTCONFIG_FILE=AUTOMATION/fontconfig-hide-system-inter.conf` | 1/1 (targeted environment diagnostic) |
| H1 | maintained workspace spec copy (port 43182, output rewired, outer policy wrapper) | **33/33** |
| H2 | repair spec copy (port 43183, QAM-owned harness copy, output rewired, outer policy wrapper) | **27/27** |
| I | post-run gate + teardown | see `teardown/` |

**Stage order deviation (disclosed):** E ran before B/C/D, solely because the pre-existing generated `next-env.d.ts` was not a pinned variant and B consumes it (`preparation/NEXT_ENV_DISPOSITION.md`). The build regenerated the pinned production variant `7b550dda…`.

## v0.3 instrument corrections implemented (exact bytes frozen; diffs vs `preparation/instrument-baseline/`)

1. **New candidate gate** `q2a2_gate.py`: explicit candidate/parent/binding/approval/freeze/output arguments; fail-closed; 17 checks; old `q2_identity*.py`/`q2_gate.py` preserved and unused.
2. **Mandatory policy/error capture** `specs/_qa.ts`: auto worker fixture guards every `browser.newContext()`/`newPage()`; auto test fixture guards the default context, blocks service workers and WebSockets, observes every request, logs/aborts exact-parsed-origin violations, captures page errors/crashes on every page incl. popups, writes per-test ledgers and fails the test on any unconsumed event. Controls in `s00_policy_controls.spec.ts`.
3. **Clean pages / isolation variant** `qa-harness.cjs`: no sibling furniture on normal pages; `/iso` and `/iso-nows` carry it for S-15 only; synthetic `/collateral` page for root-font checks.
4. **Product font wiring**: committed seven WOFF2 subsets + exact `src/app/fonts/inter.css` (only rewrite `./inter/` → `/fonts/inter/`), root layout body classes `inter-font …`; Designer TTFs no longer served (retained in DESIGN as references).
5. **S-18 corrected**: breakpoint-aware disclosure oracle, collapsed tab-order check, resize rescue, keyboard skip link from a clean page, explicitly driven pending status, real theme control, measured focus indicator/adjacent background/contrast with removed and low-contrast controls.
6. **Deterministic real-store F01** `jest/qa_f01_realstore.test.tsx`; class-C seam test now disposes its root in `finally`.
7. **F02** lifecycle settle + visible fallback probe; **F03** unrounded geometry in all three views at 375; **F04** independent exact-list assertion retained.
8. **Secondary suites** copied under `AUTOMATION/secondary-a2/` and `AUTOMATION/repair-harness/` with only import (outer policy wrapper), port and output rewiring; Engineer evidence untouched.

## Findings (Lead classifies; no product repair by QA)

- **Q2-F01, F02, F03, F04:** retest PASS; addenda `FINDINGS/Q2-F0x_RETEST-002.md` recommend closure. Originals unchanged.
- **DIRECTOR-OBS-001:** offline A+B/reopen/fresh-mount PASS again (addendum 003); live cause remains **UNTRIAGED-live**.
- **No new product finding.**

## Environment notes and limitations (not product findings)

- **E-1 OS-installed Inter on the QA workstation** (`/usr/share/fonts/truetype/inter-zorin-os`, 18 files). It can mask the product's blocked-font fallback in any browser evidence that does not hide it — including the main G S-20 run, H2's typography-fallback test and earlier Engineer typography evidence. With it hidden (G-diag-s20) loaded mode still loads all 7 product faces and blocked mode renders `Inter Fallback` (text advance: h1 −16.86 px, Latin line +5.64 px, label −33.28 px, button +2.39 px; 0 overflow).
- **E-2 `next-env.d.ts`** pre-run unpinned generated variant; dispositioned, not edited; the build regenerated pinned `7b550dda…`.
- **E-3 Build log** warnings only: no build cache; Browserslist data 14 months old (no update attempted; no network). No font fetch.
- **Font preload:** 0 `rel=preload as=font` in production HTML/RSC — consistent with removing next/font's automatic Latin preload. No loading-performance or layout-timing benchmark claimed.
- Fixture-qualified UI plus source/build regression only: no live ADK/Supabase/GCS/GHL/login, no server logout or token revocation claim, no authenticated production route launched (R000-11).
- AC000-18 focus evidence covers the measured controls (15 keyboard stops per theme), not a whole-site accessibility certificate.
- AC000-20's harness forbidden-import plugin is unchanged since attempt-001; its seeded build-failure control was not re-run here.

## Build-generated changes (explained)

`.next/` production output written by Stage E (BUILD_ID, manifests, `server/`, `static/`, `types/`); the pre-existing `.next/dev` (2026-10-08) retained; no prior production output existed (pre-build: only `dev`). `next-env.d.ts` `0f706298…` → `7b550dda…` by the build. `tsconfig.json` unchanged (`03bb7219…`); `tsconfig.tsbuildinfo` untouched (B used `--incremental false`). No tracked file changed by any stage. The build output is left in place (generated, ignored); Q5 retention cleanup is not authorized.

## Recommendation to QA Lead

All 23 executable mandatory rows have independent new-candidate PASS evidence; AC000-24 stays NOT RUN. Next decisions: findings disposition for F01–F04 (closure recommended), acceptance of the E-before-B ordering and the next-env disposition, and then Q5 cleanup authorization and Gate Q. DIRECTOR-OBS-001 live cause stays outside this phase.

## Appended 2026-10-11 per QA Lead disposition (text above unchanged)

- F01–F04 accepted as resolved within the tested fixture scope (dispositions appended to the original findings).
- Normal offline build, regression evidence and the targeted font-fallback diagnostic accepted; the OS-Inter qualification on earlier fallback results is retained (Q-002-01).
- The "stage order deviation" above is re-classified as process deviation **PD-002-01, proceeding after GATE_STOP**. The next-env transition is accepted for this candidate only, with no future gate overrides.
- AC000-20's omitted harness forbidden-import control was completed in addendum 001 (PASS).
- Records: `../q2-attempt-002-addendum-001/`.
