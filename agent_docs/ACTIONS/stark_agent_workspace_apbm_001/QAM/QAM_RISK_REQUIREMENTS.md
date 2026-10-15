# Risk inputs for the independent plan

These are Architect requirements, not a pre-approved QA Lead plan. Apply the standing QAM/QA playbooks and propose exact independent tests in Q1.

Highest-priority seams: server authorization before upstream; stale browser identity; backend/mode collisions; first-create/run interruption; no automatic replay/recreation; hidden sidebar during draft; stale response after navigation/logout; journal storage failure and refresh; counterfeit recovery from equal message text; error-to-empty collapse; test auth leaked into production.

Use independent fixtures to verify both success and negative controls. Captured ADK responses inform fixtures but do not replace real frontend A/B tests. Use deterministic failures for concurrency/timeout/abort and a guarded local upstream for exact call counts. A fake backend PASS cannot be a live-connectivity PASS.

Browser matrix inputs: Chromium as baseline; desktop 1440px, mobile 390px, tablet 768px, drawer boundary 1023/1024px; dark/light and saved preference; keyboard/focus; draft/list/thread/loading/empty/missing/unavailable/uncertain. Reduce redundant combinations with explicit rationale, not silent omissions. Safari/Firefox and exhaustive assistive-technology certification are not promised in this demo. One real browser with vision is required; screenshot-only and jsdom-only evidence are insufficient.

Regression: relevant existing route/service/workspace and legacy callers; full required Jest, typecheck, production build; existing Playwright workspace regression with approved semantic updates. Preserve APBM000 historical omission D7; it does not waive APBM001's new visual checks. Prior D4 font-build history does not turn a failed current build into PASS; current setup permission is in ENVIRONMENT_AND_EFFECTS.

Do not use unsupported ADK lastUpdateTime/stateDelta assumptions. Do not claim restart durability from age or idle time. Keep public-origin risk and multi-user/live-secondary/Hermes limits visible to the Lead. Single-user focus does not authorize trusting browser-supplied identity.
