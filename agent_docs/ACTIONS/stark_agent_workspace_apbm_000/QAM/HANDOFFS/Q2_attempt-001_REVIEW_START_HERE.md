## APBM_000 Q2 attempt 001: executed. 3 product findings, build BLOCKED, ready for QA Lead

Q2 ran on **candidate `f21564c`** (your cloud roster) under the Lead-approved plan. It took under 1 hour of the 3-hour bound and stayed fully network-isolated: no live calls, no product edits, no Git writes, and your config is untouched. **Gate Q is NOT issued.** It can't be from this attempt, because the production build is BLOCKED and three acceptance criteria carry proposed FAILs.

**Next decision owner: QA Lead.** Classify findings F01–F04, decide on the build route, and decide whether the disclosed instrument gaps need a bounded re-run.

### Results at a glance
| Area | Result |
|---|---|
| Q2-0 candidate gate | **PASS** (22/22 checks; product equivalent; all anomalies classified; tamper controls STOP; tool self-test 7/7) |
| TypeScript | PASS (exit 0) |
| Full Jest | **286 / 1 / 287.** The only failure is the exact class-C test; 0 new; all 36 old A/B failures now pass |
| QA Jest (independent) | 27/28 → **Q2-F01** |
| Production build | **BLOCKED.** Confinement proven, but Next 16's Turbopack rejects the only no-network font mechanism; an open proxy would break policy §11.2 |
| Static audit | PASS (scope, imports, hardcoded agents, theme props, product/fixture separation) |
| QA browser (final run) | 24/29 → **Q2-F02, Q2-F03**, plus 3 instrument issues (2 resolved by targeted diagnostics) |
| Engineer-spec copy | 33/33 |
| Teardown + post-run identity | Clean; still PRODUCT_EQUIVALENT |

**AC grades (proposed):** 18 PASS (3 of them qualified), **AC000-13 FAIL, AC000-17 FAIL, AC000-20 BLOCKED, AC000-22 BLOCKED**, AC000-24 NOT RUN. Full literal evidence is in `QAM/AC_EVIDENCE_MATRIX.md`.

### Findings (no repairs made)
- **Q2-F01 (Medium):** if the browser blocks site storage, **Sign out never sends the user to `/auth`**. The old chatStore defect (class C) throws inside the new sign-out handler. This **invalidates the C deferral**.
- **Q2-F02 (Low):** with the mobile drawer open, widening to desktop focuses "All agents" instead of the current agent.
- **Q2-F03 (Low):** the "Agents" breadcrumb is 40×44px on phones, below the 44×44 touch target.
- **Q2-F04 (Low, test coverage):** the rewritten manifest test no longer checks that the v1 and v2-local bundles are declared. QA covers it independently.
- **DIRECTOR-OBS-001 ("nothing is remembered"):** every offline A+B test passed. Two new chats stay in recents, reopening A shows only A, and a fresh mount lists both. **The new UI doesn't lose saved chats offline**, so the live cause is most likely the existing catalogue save/list path. It needs the bounded live diagnostic, if you want it.
- Observation: recent-chat dates show `10/4/2026` where the design shows `Today · 10:42 AM`.

### Disclosed instrument gaps (mine, not the product's)
- The browser's same-origin abort guard was active in only 2 QA tests. Isolation still held through the OS network namespace, which was proven for every run.
- The visible-focus style check is evidenced from CSS only; it wasn't run in the browser.
- Every instrument retry and fix is logged with diffs in `INSTRUMENT_LOG.md`.

### Git (not run; your call)
```bash
cd ~/NEXTJS/stark-ai-workbench-nextjs-frontend-v2
git add --pathspec-from-file=agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-001/staging-paths.txt
git diff --cached --name-only | grep -v "^agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/" || echo "OK: only QAM staged"
git commit -m "APBM-000 Q2 attempt 001: executed on f21564c; findings F01-F04; build BLOCKED; evidence + instruments"
git push
```
The list covers QAM only and excludes RESPONSES, config, src and caches. It includes the Q2 package ZIP, as with earlier handoffs.

### NEXT MOVE
1. **Send the QA Lead this one file:** `~/Downloads/APBM000_Q2_attempt-001_QA-Lead-Package_2026-10-07_194132.zip`. It contains this report first, then the AC matrix, findings, all evidence and the instruments.
2. Run the Git block to commit the QA records.
3. **Decisions coming back to you after the Lead:**
   - the repair scope for F01–F03 (Architect → Cody → your commit → QA retest);
   - how to unblock the build. Options: accept a pre-staged local copy of the Inter font for the build, or approve a supervised build environment;
   - whether you want the bounded live diagnostic for "nothing is remembered".
4. Keep `next dev` and other sessions idle while any QA retest runs.

Report saved: `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/HANDOFFS/Q2_attempt-001_REVIEW_START_HERE.md`
