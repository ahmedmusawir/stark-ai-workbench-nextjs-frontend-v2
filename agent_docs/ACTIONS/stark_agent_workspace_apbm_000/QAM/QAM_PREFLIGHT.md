# Q1 readiness record
Status: NOT RUN. Executor fills actual findings with evidence paths, candidate and timestamp.

1. Confirm independent role, explicit entry file reading, correct repo/QA branch, complete handoff and committed product candidate. Identify dirty files and unrelated pre-existing deletions; no product drift.
2. Inventory controlling acceptance/rulings and Designer baseline. Grade only phase-000 scope; name deferred guarantees. Resolve contradictions before Q2.
3. Verify test commands point to scoped Playwright config/testDir, usable browser, port owned by this run, fixture bootstrap and teardown. Record actual Node/package/browser versions.
4. Confirm fixture traffic is local/fail-closed in browser and server, no inherited credentials loaded, no production auth bypass or hidden live call. Q1 does not authorize service login or model invocation.
5. Verify build/typecheck/Jest status against baseline and exact inherited failure list. Q1 readiness probes are not automatically Q2 acceptance evidence; say when results can safely be reused.
6. Identify all files allowed for disposable instrumentation and durable evidence. Declare before capture what is excluded (secrets/cookies/tokens/private chat/env/provider metadata) and sanitize logs/screenshots.
7. Prepare independent risk-based plan with AC mapping, commands, expected results, negative controls, stop/retry rules, limits and evidence names. Do not just paste engineering tests as proof.
8. Export one Q1 package and stop for QA Lead review. Readiness outcome READY_FOR_PLAN_REVIEW or BLOCKED; neither means Q2 APPROVED.

Tool/browser unavailable: one diagnostic retry if informative, then report exact environment blocker; no unapproved install, target switch, replica substitution or repeated permission loop. Other independent safe intake work may continue.
