# APBM_000 — dependency reconciliation 001 return

Cody, Engineer · 8 October 2026 · **Dependencies reconciled; engineering reverification finished with one full-suite failure. Uncommitted. Gate Q pending.**

The committed dependency tree was installed successfully with offline `npm ci`. All completed F01–F04 repairs and local Inter assets remain byte-identical to reconciliation entry. Focused regressions **64/64**, typecheck **exit 0**, and the same offline engineering browser checks **27/27** passed. Full maintained Jest is **289 passed / 1 failed / 290**, exit **1**. No failing check was rerun, waived or repaired in this assignment.

## Checkout and authorized changes

- Branch: **`qa/frontend-apbm-000`**.
- Actual starting/current full HEAD and repair parent: **`9c50884d4c4513b6969311d5be7c05828104ed3d`**. No repaired commit SHA exists.
- Full entry status/index and preserved working-file hashes: [entry-state.json](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/entry-state.json). Entry was dirty with the prior repair, its records/review archive and the inherited lockfile change. No existing work was discarded.
- Only `package-lock.json` was restored from HEAD, by writing the exact `git show HEAD:package-lock.json` bytes. No other restore, branch switch, index mutation, commit, push or merge occurred. It now has **no diff from HEAD**. `package.json` is unchanged.
- New work consists of the supplied Lead records, reconciliation evidence/runners with redirected output, this return and the canonical handoff/changelog updates. Product source and maintained test assertions were not edited. Independent QA instruments, original findings, attempt-001 evidence, earlier newer-dependency evidence and review ZIPs are preserved.
- The current exact product/test patch remains SHA-256 **`fac3f21262dca396f5c7b7d71143bbfff1a0f21a809f0278315f1d4d7beebaaa`**, the same as repair 001. Final working-tree status/diffs/hashes are recorded in this attempt's identity and inventory; parent SHA plus working diff identifies the uncommitted repair.

All new evidence below is under `QAM/evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/`.

## Supplied Lead record installed and read

Source: `/home/moose/Downloads/APBM000_Q2_LEAD_DISPOSITION_2026-10-07.zip`.
ZIP SHA-256: **`cd5fe8635281fb0722e67a31a0977158d27885005072695b9b118b5bc5ffa72c`**.

Before extraction, all three member paths, types, sizes and archive CRC were inspected; the supplied index's two record sizes/hashes matched. Paths were mapped from `QAM/HANDOFFS/...` onto the module, creating no `QAM/QAM/`. Destinations had no content conflicts. Existing identical destinations would be left alone. Installation identities/actions: [lead-record-installation.json](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/lead-record-installation.json).

Installed:

- [LEAD_Q2_DISPOSITION_2026-10-07.md](LEAD_Q2_DISPOSITION_2026-10-07.md), SHA-256 **`d5b120e87fd56b214a7cf32b64433b7c6f8b0f608c2e16937e33052eccc6b94a`**.
- [ARCHITECT_Q2_REPAIR_REQUEST_2026-10-07.txt](ARCHITECT_Q2_REPAIR_REQUEST_2026-10-07.txt), SHA-256 `2c1ce0f718dd652f8144114397105892add3f03af791ee7cca539a9370e2b7c7`.
- [LEAD_Q2_DISPOSITION_INDEX_2026-10-07.json](LEAD_Q2_DISPOSITION_INDEX_2026-10-07.json); its own hash is recorded in the installation manifest. Its `source_zip_sha256` identifies the original reviewed Q2 export, not this Downloads delivery ZIP.

The installed disposition was read. It returns attempt 001 for bounded repair and QA evidence completion; Gate Q is not issued. It invalidates the prior F01 storage waiver, retains F01–F04 findings and places browser guard/harness/visible-focus corrections with Claudy/Lead. Attempt 001 is closed to more execution. It **does not approve a new independent QA attempt**. The record is now present; earlier missing-record audits and ZIPs remain accurate historical snapshots.

## Lockfile backup and exact committed install

Before replacement, saved and verified byte-for-byte:

- [INHERITED_PACKAGE_LOCK_BACKUP.json](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/INHERITED_PACKAGE_LOCK_BACKUP.json), SHA-256 **`c62a48123a50b5289a6179ebafb1a13960f1c3636992ddcc0df0b435ebf556eb`**. This is **evidence only**, not the active lockfile.
- [inherited-package-lock.diff](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/inherited-package-lock.diff), exact pre-restoration diff against HEAD; 1912 additions / 1069 deletions. The earlier review's full version-change analysis remains preserved.

Restored active `package-lock.json` SHA-256: **`f81ea7545863bf12dcb33912a8d43d042abe06aa7b95ff8831af647cdaaeae49`**, identical to current HEAD both before and after installation. See [lock-restoration.json](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/lock-restoration.json) and [npm-ci-command.json](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/npm-ci-command.json).

Install command: **`unshare -rn npm ci --offline --no-audit --no-fund`**, exit **0**, 782 packages installed from cache. It used the exact committed lockfile, a fresh namespace with no external network, sanitized environment and no audit/fund calls. No `npm install`, lock regeneration, package upgrade, `npm audit fix` or live service access occurred. Existing React peer-range/deprecation warnings are retained in `npm-ci.log`; installation succeeded without dependency changes. No installation/access blocker remains.

There is no repository `.nvmrc`, `.node-version`, `packageManager` or Node/npm `engines` pin; the historical Node 26.7.0/npm 11.19.0 entries are previous execution facts. This run used **Node v24.15.0 / npm 11.12.1**, satisfying committed Next's Node `>=20.9.0` requirement. Installed Chrome: **150.0.7871.114**. These are actual current versions, not historical Q2 claims.

| Dependency | Actual installed, matching committed lock |
| --- | --- |
| Next | 16.2.6 |
| Jest | 30.0.5 |
| jest-environment-jsdom | 30.3.0 |
| TypeScript | 5.5.4 |
| Playwright | 1.59.1 |
| Zustand | 4.5.4 |
| React / React DOM | 19.2.4 / 19.2.4 |
| Sass | 1.77.8 |
| Tailwind CSS | 3.4.6 |
| PostCSS | 8.5.15 |
| @google-cloud/storage | 7.21.0 |
| @tailwindcss/typography | 0.5.13 |

[installed-versions.json](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/installed-versions.json) verifies all **782 present locked entries**, with zero version mismatches and zero missing required entries. Platform-inapplicable optional packages are omitted normally. This supersedes the newer installed tree for current verification; its earlier results are not overwritten.

## New engineering verification

Each requested check ran **once**, with the existing offline isolation and no assertion changes. Exact commands, times, durations and exits are in `*-command.json`; logs and result JSON are adjacent.

| Check / actual installed command | Exit | New result / evidence |
| --- | ---: | --- |
| Focused `npm test -- --runInBand --runTestsByPath <same eight paths> --json --outputFile=<new>/focused.json` | 0 | 8 suites, **64 passed**; `focused-command.json`, `focused.log`, `focused.json`. |
| Full `npm test -- --runInBand --json --outputFile=<new>/full.json` | **1** | 39 passing / 1 failing suites; **289 passed / 1 failed / 290**; `full-command.json`, `full.log`, `full.json`. |
| `npx --no-install tsc --noEmit` | 0 | `typecheck-command.json`, `typecheck.log`. |
| `node node_modules/@playwright/test/cli.js test --config <new>/repair.config.ts` | 0 | Same **27 passed**, no skipped/unexpected/flaky tests; `browser-command.json`, `browser.log`, `browser-results.json`, 18 screenshots/metrics and four typography records. |

Jest/typecheck ran under `unshare -rn` with no network. Browser and the unchanged Engineer fixture shared a fresh `unshare -rn` namespace with only loopback enabled, the same exact-origin page guard and Node guard. No production auth/service runtime or QA font hook was used. Browser results include current-item/fallback/normal-close focus, 44×44 mobile breadcrumb/overflow and unchanged Inter/fallback metrics.

Only output destinations were adjusted: runner root resolution for this dated evidence location, a browser spec copy with its single evidence-path declaration changed, and a config copy pointing to the copied spec/new output while reusing the original fixture. Every assertion/test body is unchanged; see `output-destination-adjustments.json`. Original maintained tests and independent QA instruments are unchanged. No evidence went into the earlier results directory.

### Exact retained failure and likely mechanism

**`AddMemberForm does not redirect when addMember returns an error`**, `src/__tests__/admin/AddMemberForm.test.tsx:152`, expected no router calls but received one `mockPush('/admin-portal')`.

The test and form source are byte-identical to HEAD. The same named failure occurred in the earlier newer-dependency baseline. Likely mechanism, **inference only**: the loading-state test leaves a 100ms success promise pending after it confirms the disabled button. The unmounted form retains the shared router mock and can push after a later `beforeEach` clears it; the error test waits for action invocation rather than completed submission. No diagnostic rerun established causality. This does not prove a new dependency regression or a failed F01 repair.

Details, exact diagnostic and source hashes: [FULL_SUITE_FAILURE.md](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/FULL_SUITE_FAILURE.md), `full-suite-failure.json` and raw results. **Full suite remains FAIL, with no waiver.** No unrelated form/test fix, assertion weakening or retry was made. Architect/Lead must disposition this retained failure or authorize separate work. No storage-defect waiver was reinstated; the real-store F01 regressions and maintained storage tests passed.

## Staging and remaining independent work

Updated explicit proposal: [staging-paths.txt](../evidence/dependency-reconciliation-001/2026-10-08_124256_BDT/staging-paths.txt). It carries forward the completed repair and safe review records and adds supplied Lead records, this return and new reconciliation evidence. Backup JSON/diff are labeled evidence and stay under QAM. **Active `package-lock.json` is excluded because it matches HEAD**. Archives, caches/browser `.last-run.json`, credentials, `.env` files, node_modules, disposable font copies and RESPONSES are excluded. Verified product fonts remain intentional source assets. No staging command was executed.

Final source/record diff, status, inventory, staging-list hash and product-preservation checks are recorded under this evidence folder. Older inventory/return snapshots retain their original dates and results; only the canonical handoff/changelog were updated with the current state.

Remaining: Architect/QA Lead review of the full-suite failure, Tony's selective review/commit, and Lead binding of the **actual committed candidate** and next retest plan. Claudy owns independent instrument corrections, acceptance execution and the **normal installed production build with network denied and no QA font mock**, output identity and separation scan after approval. None was run by Cody here. Preserve **D4 ALLOW / D7 OMIT**, remote ADK roster and both bundle/urlEnv mappings. Gate Q pending; no Q5, certification or closeout. The disappearing-conversation live cause remains untriaged.
