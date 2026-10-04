# QA risk inputs — Architect-authored; QA Lead review pending

These are mandatory contract concerns and Architect risk inputs, NOT a QA Lead-approved test plan. The independent Executor decides instruments/expected results at Q1; QA Lead reviews coverage and approves before Q2.

Prioritize: accidental live instructions/GCS traffic; test harness escape to real services; production auth bypass introduced for convenience; config roster/endpoint changed to fit screenshots; preview scripts shipped as production; missing token inheritance in portals or CSS leakage into unrelated routes; stale fixture identity in UI; pending/unknown sends issuing extra callback invocations; archive deleting transcript; hidden focusable mobile/sidebar copies; unsafe literal title/content rendering; inherited failures hidden by test deletion; fixture evidence promoted into live claims.

Expected independent checks:
- Compare actual source changes/protected hashes to scope, not just Engineer's list.
- Trace new context imports and intercept both browser and server test traffic; prove offline service fixture confinement.
- Supply an alternate roster unknown to Engineer's screenshot happy path and invalid selectors.
- Inject pending/unknown/missing/unavailable and delayed fixture results; assert displayed identity, action type and zero unintended send/create calls. This tests the UI boundary, not protected legacy connector behavior.
- Check theme on first visit and saved preference, scoped sibling/portal inheritance and teardown, at/around 1024px as well as required widths.
- Exercise keyboard controls, nested context dialogs, resize focus, narrow long content and clipboard-denied/speech-unavailable cases.
- Challenge tests with negative controls in disposable harness fixtures/oracle inputs; never corrupt candidate source. Keep expected-red and expected-green outcomes with exact cause. A detector that never fails is not proof.
- Distinguish baseline failures, environment failures, test-instrument failures and actual implementation defects. No release certificate with ungraded mandatory criteria.

Render matrix is risk-based: all three screens, two themes, three widths for base appearance; expensive behavior need not repeat every combination. QA Lead approves representative pairwise behavioral coverage with both themes and mobile/desktop modal paths. No needless multiplication of identical happy-path runs.
