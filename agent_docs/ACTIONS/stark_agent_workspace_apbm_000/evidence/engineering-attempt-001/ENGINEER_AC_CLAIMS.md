# Engineer self-check claims — not independent QA

Recorded 2026-10-04T21:59:35.844675+06:00. Expected values are the frozen ACCEPTANCE_SPEC rows; the actual evidence/limits below are Engineer observations. PASS means ENGINEER CLAIM only. No row is waived or N/A.

| AC | Requirement | Engineer grade | Actual / evidence and qualification |
|---|---|---|---|
| AC000-01 | Configured directory | PASS | Real directory/filter/empty/unavailable fixtures; configured projection preserves active IDs and excludes urlEnv. Browser directory test, adapter projection test. |
| AC000-02 | Alternate roster | PASS | Orbit/β and Moss Review use identical components, neutral descriptions/icons. Browser filter/UTF-8 navigation test; source has no agent-specific branches. |
| AC000-03 | View identity | PASS | Unit negative query/encoding tests and browser Back/Forward/contradictory-query callback negatives. No preview query handling in production entry. |
| AC000-04 | Workspace states | PASS | Workspace real view supplies all six catalogue states; populated/partial/recovered browser actions checked. Empty/loading/unavailable branches are source-reviewed and available as fixtures; independent QA should exercise each. |
| AC000-05 | Chat renderer | PASS | Existing Markdown/GFM/Prism preserved with opt-in workbench actions; six conversation renders check internal table/code scrolling, raw-HTML nonexecution and composer separation; renderer regression passes. |
| AC000-06 | Composer | PASS | Component/browser checks cover whitespace, IME Enter, Shift+Enter, deliberate send, disabled pending and duplicate-submit guard. |
| AC000-07 | Fresh draft and bind | PASS | Repeated New chat clears local draft; no send before explicit submission; mocked durable ID binds once; adapter creates metadata once after confirmed send. |
| AC000-08 | History failure UI | PASS | Typed missing/unavailable/access fixtures render distinct copy; send disabled; retry invokes history only. Production [] ambiguity explicitly retained. |
| AC000-09 | Uncertain/not-sent | PASS | Browser fixtures and send callbacks retain attempted text/draft and prohibit automatic resend. Unknown transport results are conservative uncertain. |
| AC000-10 | Pending/metadata/separation | PASS | Typed pending status, confirmed ID plus metadata-warning list inspection, repeated deliberate send same ID, delayed A history cannot overwrite B. Adapter metadata rejection retains confirmed ADK result. |
| AC000-11 | Rename/archive | PASS | Literal titles, whitespace rejection, successful row update/removal, failure retention and logical focus tested; mocked existing service bindings. Production swallowed-error limitation remains. |
| AC000-12 | Demo isolation | PASS | Required disclosure; fictional in-memory edit/add/preview/remove; no file input or instructions service import. Harness dependency guard and callback negatives; static dependency review. |
| AC000-13 | Demo identity/reset | PASS | Browser separate agents, synthetic user identity remount and reload clear prior values; explicit reset code; production identity key includes user/mode/backend mapping and logout changes auth context. Backend configuration remount is source evidence, not live switching proof. |
| AC000-14 | Theme | PASS | Copied approved scoped tokens byte-identical; computed palette/radii in 18 renders; dark fallback/saved light/legacy system browser tests; original production Inter and ThemeProvider unchanged. |
| AC000-15 | Scope/portals | PASS | Unscoped sibling token/background negatives, first visible portal light/dark colors and unmount cleanup; shared-shell route-transition regression releases legacy body scroll lock. No global CSS/token replacement. |
| AC000-16 | Responsive | PASS | 18 required renders pass at 375/768/1280 both themes, document overflow <=1px and scroll/composer geometry; targeted 1024 drawer transition. |
| AC000-17 | Modal keyboard | PASS | Browser focus containment, Escape/backdrop, inert root, opener restoration and breakpoint destination. Button/nav target sizing defined >=44px in scoped CSS; QA independently verifies full control inventory. |
| AC000-18 | Disclosure/status | PASS | Expanded/controls/hidden states and resize focus tested; source includes skip/main, aria-current, named status/alert and focus styles. |
| AC000-19 | Copy/speech | PASS | Exact code/Markdown copies, denied clipboard selectable fallback, speech start/Stop doubles and existing speech unit regression. No actual OS audio output claimed. |
| AC000-20 | Fixture boundary | PASS | Production build route list has no fixture route; fixture graph excludes auth/services; source inventory and parent/server/browser guards. Production adapter binds existing callbacks rather than fixture service. |
| AC000-21 | Preserved seams | PASS | 191 protected source/config inputs equal entry, dependencies equal excluding scripts, frozen packet equal; active manifest unchanged; production adapter mocked regression and preserved page guard. |
| AC000-22 | Engineering regression | PASS — comparison claim only | Production build/TypeScript pass; targeted 57/57, browser 33/33. Full Jest 250 pass/37 inherited fail vs 225/38 baseline, zero new exact-name failures. Each retained failure listed separately. Independent QA Lead acceptance REQUIRED; this is not a green full suite. |
| AC000-23 | Engineering handoff | PASS | Indexed allowlisted archive, product patch/new source, 218-input candidate inventory, command/evidence/limitations/staging documentation. Receipt validates SHA/CRC; uncommitted candidate explicitly recorded. |
| AC000-24 | Independent certification | NOT RUN | Q1 plan/approval, Director Q2 release, independent execution and Lead certificate/process verdict pending. Engineer cannot issue Gate Q. |

Evidence directory: `evidence/engineering-attempt-001`. See REPRODUCTION.md for exact test configuration and screenshots; logs/results and source tests resolve every named claim. AC000-22 inherited-failure adjudication and AC000-24 certification remain independent QA responsibilities. All data is synthetic; no real authenticated /chat session was exercised.
