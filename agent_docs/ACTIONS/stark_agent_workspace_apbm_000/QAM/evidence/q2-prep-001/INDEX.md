# q2-prep-001: pre-release preparation (not Q2 acceptance evidence)

Product candidate 22ce03ba3871ea53e5253f2e3f060a1bab3226a3 · execution HEAD 2f488e40816eaa39ee8dcf7b340de75fcb9790cf · plan v0.2 8ddb743f…0337 (Lead-approved, uncommitted) · Director release: NONE.

| File | What it is |
|---|---|
| identity-selftest-controls.json | Expected-red controls for `AUTOMATION/q2_identity.py`, all red as expected: non-ancestor HEAD (candidate vs baseline HEAD); unauthorized `src/` addition + mutated `src/config/manifest.ts` in a **disposable `git archive` worktree with a temporary index copy** (real index mtime unchanged); a mutated copied approved-record hash |
| identity-pre-release.json | Real run against the checkout, 2026-10-05. 390 product/design/contract paths compared blob + worktree. Raw verdict PRODUCT_DRIFT_OR_IDENTITY_FAILURE (5 blocking, 5 non-blocking). Per-path adjudication below. |

## Per-path adjudication of identity-pre-release.json

| Raw anomaly | Path | Adjudication |
|---|---|---|
| WORKTREE_DIFF / PROTECTED_MISMATCH / PINNED_INPUT_WORKTREE_MISMATCH | config/agents.manifest.json | **BLOCKING config drift.** Director's local roster swap for live try-out (sha 6c27f420…; candidate 638e95a1…). Tony restores. |
| UNTRACKED_PRODUCT_CONFIG_TEST_DEP | config/agents.manifest_hermes.json | **BLOCKING** untracked config file (byte-equal to the candidate manifest). Tony moves it out of the repo. |
| PINNED_INPUT_WORKTREE_MISMATCH | next-env.d.ts | **BLOCKING generated drift.** Tony's running `next dev` (pid 1707292, since 13:28, port 3000) rewrote the import line to `./.next/dev/types/routes.d.ts`. Replacing that one line in memory reproduces the pinned sha 7b550dda… exactly, so this is deterministic generator output. The dev server must be stopped and the line restored before Q2. |
| QAM_UNTRACKED_UNLISTED_OR_HASH | QAM/AUTOMATION/q2_approved_qam_records.json | Non-blocking. Self-referential manifest (its own hash cannot be listed inside it). Executor tooling. |
| QAM_UNTRACKED_UNLISTED_OR_HASH | QAM/evidence/q2-prep-001/identity-selftest-controls.json | Non-blocking. New Executor evidence written after the manifest was generated. |
| UNTRACKED_DOCS_OUTSIDE_QAM | agent_docs/RESPONSES/response_2026-10-05_{114929,182656}_*.md | Non-blocking. Tony-requested report logs under the project CLAUDE.md protocol. Not product. |
| ROOT_HANDOFF_POINTER_PRESENT | stark_agent_workspace_apbm_000/QA_HANDOFF.md | Placement. Route to Architect/Cody. Executor does not edit outside QAM. Does not block Q2. |
