## APBM_000 Q1: independent QA intake complete (READY_FOR_PLAN_REVIEW)

Q1 is finished and waiting on the QA Lead. Q2 has not started, Gate Q is not issued, and I changed no product code and ran no Git write commands.

### Results
- **Candidate:** `22ce03ba…` on `qa/frontend-apbm-000`, parent baseline `20ef380`.
  - All 28 changed files the Engineer declared match, and all 191 protected files are unchanged.
  - No undeclared product, config, test or dependency change.
  - **Docs-only note (N1):** the commit includes 63 documentation paths that weren't on the Engineer's staging list, including the 27 historical RESPONSES deletions. Nothing to fix; just acknowledge it.
- **TypeScript:** passes.
- **Jest, re-run on both versions:** candidate 250 pass / 37 fail, baseline 225 / 38. No new failures. The 37 match the Engineer's list, but:
  - **1 of the 37 isn't roster-related.** It's a chatStore storage crash when storage is unavailable (server render). I found no impact on the new screens.
  - **The "resolved" manifest test was renamed and rewritten**, not fixed.
  - **24 failures are the mocked API tests.** They're red on both versions, so they can't count as evidence for AC000-21.
- **Playwright readiness:**
  - The harness and Chrome 154 work on QA port 43181.
  - The Engineer's browser config writes into their own evidence folder, so Q2 uses a QA-owned config.
  - The Node network guard misses DNS and UDP. OS-level isolation (`unshare -rn`) works here and is proposed for Q2.
- **Plan:** QA-APBM000-PLAN v0.1 covers all 24 acceptance criteria (ACs), each with its own negative check.

### Decisions the QA Lead must make (D1–D8)
1. **D1:** approve the plan.
2. **D2:** accept the inherited failures as classified above.
3. **D3:** use `unshare -rn` network isolation in Q2.
4. **D4:** let the Q2 production build reach Google Fonts and read the existing `.env.local`.
5. **D5:** confirm there will be no authenticated testing of the real `/chat` route.
6. **D6:** run the Engineer's browser tests only as a QA copy that writes to QA's own folders.
7. **D7:** your comfort check, either through a QA-run local fixture or recorded as skipped.
8. **D8:** Q2 run limits.

### Git (not run; your call)
```bash
git add agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM agent_docs/RESPONSES/response_2026-10-05_114929_apbm-000-q1-qa-intake.md
git commit -m "APBM-000 Q1: independent QA intake, readiness record and draft plan v0.1"
git push
```

### NEXT MOVE
1. **Send the QA Lead this one file:**
   `~/Downloads/APBM000_Q1_QA-Lead-Package_2026-10-05_114929.zip`
   It contains the Q1 package (`Q1_attempt-001.zip`), its verification receipt and a short README. The Lead opens `REVIEW_START_HERE.md` inside the Q1 package and decides D1–D8.
2. **Acknowledge note N1** (the extra documentation paths in your commit). This doesn't block anything.
3. **If you want the Q1 records in history,** commit the QAM changes with the Git block above.
4. **When the Lead's approval comes back,** commit that approval record and give your Q2 release. Then point me back at `QAM/CLAUDE.md` and I'll check the candidate is unchanged and run Q2.
5. **D7 is yours to answer:** do you want to try the screens through a local fixture I start and stop for you, or skip the comfort check?

Report saved: `agent_docs/RESPONSES/response_2026-10-05_114929_apbm-000-q1-qa-intake.md`
