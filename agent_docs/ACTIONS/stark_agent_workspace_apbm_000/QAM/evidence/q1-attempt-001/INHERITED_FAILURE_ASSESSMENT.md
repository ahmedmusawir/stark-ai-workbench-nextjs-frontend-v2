# Independent assessment — 37 retained Jest failures (Q1, not an adjudication)

Executor: independent QA (Claudy). QA Lead decides. Candidate `22ce03ba3871ea53e5253f2e3f060a1bab3226a3`; baseline `20ef380bdd6eed5e111d953d6404992add7a88a6`.

## What I reproduced

| Run | Suites pass/fail | Tests pass/fail/total | Source |
|---|---|---|---|
| Baseline 20ef380 (read-only `git archive` extract) | 26 / 10 | 225 / 38 / 263 | jest-baseline-20ef380.log |
| Candidate 22ce03b (committed tree) | 30 / 9 | 250 / 37 / 287 | jest-candidate-22ce03b.log |

Both runs used `env -i`, the Node network guard preload, `--runInBand --ci`, and zero guard blocks. Names were compared exactly (`jest-independent-comparison.json`):

- **New failures: 0.**
- **Retained: 37.** The same set as the Engineer's `jest-comparison.json`, with zero differences either way. The first diagnostic line is identical between baseline and candidate for all 37.
- **"Resolved": 1. It was replaced, not repaired.** The baseline test `the committed manifest is valid, includes the original five agents, and declares v1 + v2-local` is absent from the candidate. It was renamed and rewritten as `validates the configured roster and preserves declared bundle identity`. The new test checks structural validity, KNOWN_AGENTS = configured names, unique names and bundles = configured bundles. It no longer checks for the five historical agents. This sits within FILE_SCOPE's "roster-independent fixture repair for touched tests", but the test's meaning changed. It should be acknowledged as a replacement, not counted as an inherited failure that was fixed.
- **No other baseline test was removed or renamed.**

## Root-cause classes (independent; source + diagnostics)

| Class | Count | Tests | Mechanism (evidence) | Touched-scope relation | Phase-000 AC impact |
|---|---|---|---|---|---|
| A. API route rejects obsolete agent ID | 24 | agent-run ×9, agent-history ×7, instructions-route ×8 | Tests post `jarvis_agent`. Each route returns 400 at its unknown-agent check before the mocked upstream is reached (route.ts lines 33/36/50/86). The active roster `config/agents.manifest.json` (architect/hermes/designer/devops/ghl_mcp) last changed in 71b75c6, before the baseline. | Route files are protected and byte-identical (191-file equality re-verified). They import `src/config/manifest.ts`, which the candidate changed **additively only**: two optional interface fields and the new `workspaceAgentsForUi()`. Existing exports are unchanged in the diff. | None to behavior. **Evidence caveat:** these are the mocked regression tests for run/history/instructions, and they are red on both trees. So AC000-21's "mocked service regression" cannot cite them. It must rest on byte-equality of the protected files plus adapter-level mocked tests. |
| B. Legacy UI/store expect old default/roster | 12 | ChatPageContent 1, MessageList.loading 1, SessionPanel 6, AgentSwitcher 1, chatStore.persist partialize + hydration 2, chatStore.modeSplit 1 | Diagnostics show `greeting_agent`/`Jarvis` expected while DEFAULT_AGENT resolves to `architect_agent` (e.g. MessageList renders "Chat with architect_agent"; persist expects selectedAgent `greeting_agent`). | Test files and chatStore.ts are unchanged. ChatPageContent, MessageList, SessionPanel and AgentSwitcher no longer drive `/chat` (handoff limitation 4; WorkspaceEntry does not import them). | None found. These legacy components are outside the new /chat composition. |
| C. **Not roster: SSR storage guard defect** | 1 | `chatStore persistence (FIX-001) SSR guard: storage getter throws … (F5)` | `TypeError: Cannot read properties of undefined (reading 'setItem')` from `zustand/middleware.js` persist `setItem`, raised by `setSession` (chatStore.ts:152) when the storage getter throws. zustand 4.5.4, unchanged lockfile. The agent name is incidental. | chatStore.ts is protected and unchanged, and the baseline fails identically. The candidate's new `WorkspaceEntry` **now imports** `useChatStore`, but only calls `useChatStore.getState().reset()` inside the client sign-out handler, after logout. No setter runs during render. | No impact found by source inspection. Q2 should confirm with the production build and a QA Jest sign-out test. The Engineer's blanket label "roster-dependent" is **inaccurate for this one test**. The defect is a latent SSR/no-storage weakness in a protected store, owned by APBM_001. |

Total: 24 + 12 + 1 = 37.

## KNOWN_LIMITS rule check (per test)

| Condition | A (24) | B (12) | C (1) |
|---|---|---|---|
| Exact test name | ✔ | ✔ | ✔ |
| Baseline reproduction | ✔ independent | ✔ independent | ✔ independent |
| Unchanged mechanism/dependency scope | ✔ route files byte-identical; manifest.ts change is additive | ✔ | ✔ store and lockfile unchanged |
| No impact on a phase-000 AC | ✔ behavior. Evidence caveat on AC000-21 (above). | ✔ | ✔ pending Q2 confirmation |
| Lead acceptance | PENDING | PENDING | PENDING |

## QA recommendation to Lead (decision D2)

1. Accept A and B as inherited, non-impacting baseline failures under KNOWN_LIMITS. Record that AC000-21's mocked-regression proof will not use the 24 API tests.
2. Accept C as inherited **with reclassification** to "SSR/no-storage store defect (not roster)", owned by APBM_001, and subject to the Q2 confirmation in plan row AC000-13/21.
3. Acknowledge the manifest test as a **meaning-changing replacement**. Optionally ask the Architect whether the historical "five originals present" assertion should be retired formally.
4. Optional, non-blocking: a separately scoped roster-independent repair of A/B fixtures (Engineer, later phase) would restore real API-layer regression signal.
