# QA execution report: Q2 attempt 001
Status: **EXECUTED; returned to QA Lead for adjudication. Gate Q NOT ISSUED. Q5 not started.** Owner: independent QA Executor (Claudy).

## Identity and authority
| Item | Value |
|---|---|
| Product candidate | `f21564cacb563ecddbf78b1685086c9489bf1c26` (Lead approval 2026-10-07) |
| Execution HEAD | `c4ed7042fa05fa638bdc6d4327ecba3448d44cef` (QAM records + 2 RESPONSES docs; no product delta) |
| Effective plan | QA-APBM000-PLAN v0.2 `8ddb743f…` + LEAD_REMOTE_ROSTER_APPROVAL_2026-10-07 `c0380dfc…` + Architect amendment `57924e3f…`; acceptance `57f8d9f4…`, rulings `99d4c40f…`; all 9 binding pins verified |
| Director release | `HANDOFFS/DIRECTOR_Q2_RELEASE_REVISED_2026-10-07_190418.md` (verbatim; D4 ALLOW, D7 OMIT) |
| Active time | 19:04 → about 19:50 (under 1 h of the 3 h bound) |

## Commands and exits (all test bodies inside `unshare -rn`, lo only; `env -i`; Node guard)
| Step | Result |
|---|---|
| Q2-0 gate (`q2_gate.py` + `q2_identity_v2.py --candidate f21564c --head HEAD --amendment <pinned> --accept-next-env-dev-variant --approved q2_qam_records_2026-10-07.json`) | **Q2_0_PASS**: 22/22 checks, identity PRODUCT_EQUIVALENT, every anomaly classified. Controls: mutated records manifest → STOP; mutated binding → STOP. v2 self-test 7/7 red (raw per-control outputs kept). First gate attempt crashed on a relative path (instrument; output preserved, fixed once). |
| Q2-1 tsc | exit 0 (11s) |
| Q2-2 full Jest | exit 1; 287 tests, 286 pass, 1 fail = exact class C; 0 skipped; 0 new; vs baseline 37 resolved + 1 renamed manifest test |
| Q2-3 QA Jest (`jest.qa.config.js`) | 27/28. Fail = **Q2-F01** (class C impact on sign-out). Attempt 1's seam test was instrument-tainted (fixed once, kept). |
| Q2-4 build (D4 font lane) | **BLOCKED.** Enforcement established: the build namespace blocks non-font HTTPS, direct IP, UDP, DNS, child `curl` and has 0 loopback listeners. The mediator policy denied 10/10 off-policy URLs and fetched exactly 1 CSS + 7 woff2 (all 200, TLS verified, no redirects). Next 16/Turbopack rejected the `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` font files (2 attempts; the second after a diagnosed relocation). An open CONNECT tunnel would violate §11.2. Side effect: the prior gitignored `.next` production output was removed by the failed builds (`.next/dev` retained). |
| Q2-5 static audit | X-02/X-12/X-14/X-15/X-20(source) PASS (run 2 after a logged scoping fix); every seeded control flagged; build marker scan BLOCKED |
| Q2-6 QA browser | Startup attempt 0: 0 tests ran (config path defect). Run 1: 7/29 (instrument defects, classified). **Run 2 (final body): 24/29.** Fails: Q2-F02, Q2-F03 (product); S-06/S-12/S-18 (instrument) → targeted DIAG: S-06 PASS; S-18 PASS up to an over-strict status check; S-12 control not demonstrated. |
| Q2-7 Engineer spec copy (path/port only; patch + hashes) | 33/33 in both runs |
| Q2-8 teardown | No QA processes; ports 43170/43181/43182/43183/3000 free; 6 run TMPDIRs removed; 0 staged; real index untouched (19:03:17); manifest = approved `6c27f420…`; next-env unchanged (dev variant). Post-run gate PASS, identity PRODUCT_EQUIVALENT. |

## Findings (Lead classifies; no repair performed)
- **Q2-F01 (proposed Medium):** with storage unavailable, sign-out's `chatStore.reset()` throws (class C) and `/auth` navigation is skipped. Invalidates the C deferral (L4). AC000-13.
- **Q2-F02 (proposed Low):** the drawer → desktop breakpoint focuses "All agents" instead of the aria-current item. AC000-17.
- **Q2-F03 (proposed Low):** the "Agents" breadcrumb is 40×44 at 375px. AC000-17.
- **Q2-F04 (proposed Low, test coverage):** the replaced manifest test no longer pins the v1 + v2-local declaration (QA pins it independently).
- **DIRECTOR-OBS-001:** offline A+B/reopen/fresh-mount/metadata scenarios all PASS → the new frontend did not lose a successful entry offline. Live cause unresolved; recommend keeping it UNTRIAGED-live (addendum 002).
- **Observation O-1:** recents date format differs from the design.

## Instrument gaps (QA-side, disclosed)
1. The browser exact-origin route policy was a non-auto Playwright fixture, so it was active only in the 2 tests that requested it. Confinement for all others relied on the OS namespace (proven) plus the loopback-only harness. The Engineer copy applies its own route policy to all 33 tests. The S-12 browser abort control was not demonstrated.
2. The AC000-18 dynamic visible-focus check did not run (bound exhausted). Source evidence only.
3. Harness sibling block in normal flow affected the S-06 measurement and screenshots (resolved via DIAG; screenshots show the sibling).
4. Full instrument log with diffs: `evidence/q2-attempt-001/q2-0/INSTRUMENT_LOG.md`.

## Inherited failures
A/B waivers retired: all 36 now pass. Exactly one inherited failure remains, C, unchanged in cause. Its deferral is **invalidated** by Q2-F01 pending Lead classification.

## Recommendation to QA Lead
No Gate Q is possible from this attempt. AC000-20 and AC000-22 are BLOCKED on the production build, and AC000-13 and AC000-17 carry proposed FAILs (Q2-F01–F03). Suggested next decisions:
- classify F01–F04 (Architect repair scope, if any, goes to Cody, then Tony commits, then QA retests);
- choose a build route the policy can enforce (for example, Director/Architect acceptance of a pre-staged local font for Turbopack, or a supervised build environment);
- decide whether the instrument gaps need a bounded re-run.
