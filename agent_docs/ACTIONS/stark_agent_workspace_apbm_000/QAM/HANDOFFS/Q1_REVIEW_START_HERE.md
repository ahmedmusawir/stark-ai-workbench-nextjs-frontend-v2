# Q1_attempt-001 — REVIEW START HERE (for the QA Lead)

**Next decision owner: QA Lead. Decide D1–D8 below.** Then Tony commits the approved instructions and records the Director Q2 release. The Executor will not start Q2 until both records exist. **Gate Q is not issued, and this package claims no QA pass.**

Outcome: **READY_FOR_PLAN_REVIEW.** Candidate `22ce03ba3871ea53e5253f2e3f060a1bab3226a3` on `qa/frontend-apbm-000` (parent baseline `20ef380…`). Independent Executor: Claudy (Claude Opus 5.5 / Claude Code), a separate seat from Cody the Engineer.

## Decisions requested

| ID | Decision | Executor recommendation |
|---|---|---|
| D1 | Approve/amend plan **QA-APBM000-PLAN v0.1** (`QAM/QAM_TEST_PLAN.md`, SHA256 in FILE_INDEX) bound to 22ce03b, ACCEPTANCE `57f8d9f4…`, RULINGS `99d4c40f…` | Approve |
| D2 | Inherited Jest failures: A = 24 API tests rejecting obsolete `jarvis_agent`. B = 12 legacy UI/store tests expecting the old default agent. C = 1 chatStore SSR-guard failure, which is **not roster-caused** (zustand persist `setItem` on undefined storage). Plus the manifest "resolved" test, which was actually **renamed and rewritten**. | Accept A/B. Accept C reclassified (APBM_001 owner, Q2 J-13 confirms non-impact). Acknowledge the manifest test as a meaning-changing replacement. |
| D3 | Use `unshare -rn` (loopback-only namespace) as the primary Q2 network isolation. The in-process guard misses UDP, DNS and child processes. | Authorize. Verified working with harness + Chrome. |
| D4 | Allow the Q2 `next build` to reach Google Fonts and let Next read the existing `.env.local` (values never captured) | Allow. Otherwise the AC000-20/22 build proof is not independent. |
| D5 | Confirm R000-11: no authenticated real-route runtime. AC000-03/14/15/21 are graded via fixture + QA Jest + build/source, with qualification. | Confirm |
| D6 | Run the Engineer browser spec only as a QA copy with the evidence path and port substituted. The original writes into Engineer evidence. | Yes |
| D7 | Director comfort check through a QA-run loopback fixture, or record the omission | Tony's choice |
| D8 | Run bounds: ≤3h active, 1 diagnostic retry per instrument failure, ≤2 full browser runs, no product edits | Approve |

Docs-only note **N1** for Tony: commit 22ce03b holds 63 paths outside the Engineer staging allowlist. All are documentation/logs, including 27 historical `RESPONSES/response_2026-07-*` deletions and both ENGINEERING ZIPs. No product drift. Acknowledgement only.

## What Q1 verified (independently)

- Identity: 28/28 declared changed files and 191/191 protected files match. 217/218 pinned inputs match (the exception is gitignored `next-env.d.ts`). 169/171 frozen files match (2 documented relocation edits). Zero undeclared product/config/test/dependency changes. Clean tree.
- tsc noEmit: exit 0. Full Jest reproduced on **both** trees: candidate 250 pass / 37 fail, baseline 225 / 38. **0 new failures.** The 37 retained exactly match the Engineer list.
- Harness boot/teardown on QA port 43181 and Chrome 154 smoke: pass. The first Chrome attempt failed because of a QA TMPDIR length error; it is preserved.
- Network guard expected-red controls: TCP, TLS, fetch, http and https are blocked. UDP and DNS are **not** (gap G1, hence D3).

## Coverage boundaries the Lead should see

- **B1:** the Engineer browser fixture excludes WorkspaceEntry/productionAdapter and the real Next route. QA adds Jest tests for the entry/adapter and build/source inspection.
- **C1:** the Engineer Playwright config and spec hardcode writes into `engineering-attempt-001`. QA uses its own config.
- The new risk probes are not run by the Engineer suite: send **rejection/timeout** → uncertain; history rejection; stale late results across sessions and users; QA roster with reserved-character IDs and an HTML-like name; CSS selector scope audit; build-output fixture marker scan; demo-text storage scan.

## Reading order

1. `QAM/QAM_TEST_PLAN.md`, the independent plan (§10 holds the decisions)
2. `QAM/QAM_PREFLIGHT.md`, the readiness record items 1–8
3. `QAM/evidence/q1-attempt-001/INHERITED_FAILURE_ASSESSMENT.md`
4. `QAM/evidence/q1-attempt-001/INDEX.md` and the evidence files
5. Contract/governance copies, the Engineer handoff and Engineer scope files, for reference

Design baseline is referenced by hash, not included: `STARK_AGENT_WORKSPACE_DESIGN_RETURN_v1_0.zip` SHA256 `77d1b42698219470fc4e3a0c0427927683bdb34e5888cd9abd60a430812895c1`. The DESIGN files in the checkout are byte-identical to the frozen record. Completeness: all Q1 outputs are included. Nothing required is unavailable.
