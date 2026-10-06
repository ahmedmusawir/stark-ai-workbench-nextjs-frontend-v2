# remote-roster-rebind-001: evidence completion for the Architect's bounded remote-roster amendment

Read-only and commit-bound. **Not Q2 acceptance evidence.** Old candidate 22ce03ba…. Proposed new candidate f21564cacb563ecddbf78b1685086c9489bf1c26 (parent 9a65cdd8…, pushed; current HEAD). Authority: `QAM/HANDOFFS/ARCHITECT_REMOTE_ROSTER_AMENDMENT_2026-10-05.md` (sha256 57924e3f…c7d9; Architect package index verified, 9/9). The Lead instruction file named by the Director (`LEAD_REMOTE_ROSTER_PREP_2026-10-05.md`) was **not found on disk**. This work follows the Architect's evidence list.

| File | Content |
|---|---|
| config-delta.patch | `git diff --no-ext-diff --no-textconv --no-renames --binary 22ce03b f21564c -- <3 paths>`: complete three-file diff |
| blobs/old-*, blobs/new-* | Exact bytes of each present file at 22ce03b / f21564c (`git show <full-SHA>:<path>`). Absent = no file. |
| rebind-evidence.json | Output of `AUTOMATION/rebind_evidence.py`: resolved SHAs and ancestry; per-path old/new SHA256 vs the Architect table; bundle and agent→bundle assignment from the actual JSON; full classified changed-path list 22ce03b→f21564c; commit-bound `git grep` of manifest references; worktree hashes; next-env provenance; root pointer. **Verdict AMENDMENT_EVIDENCE_CONSISTENT.** |
| q2_identity_v1_to_v2.diff | Exact diff of the committed identity tool v1 (sha 70319605…, unchanged) to the proposed v2 (sha cf0968a2…) |
| identity-v2-selftest-controls.json | v2 expected-red controls, **7/7 red as expected**: non-ancestor HEAD; unauthorized src addition; mutated product file (disposable git-archive worktree + temp index); mutated copied record; **amendment with wrong target hash stays blocking; roster change without amendment stays blocking; arbitrary next-env.d.ts content stays blocking even with the dev-variant flag**. Real `.git/index` mtime unchanged (19:31:01, Tony's commit). |
| identity-v2-f21564c-accept.json | Live checkout, candidate f21564c, amendment, `--accept-next-env-dev-variant`: **PRODUCT_EQUIVALENT, 0 blocking**, 390 paths blob + worktree |
| identity-v2-f21564c-strict.json | Same without the flag: **1 blocking: next-env.d.ts dev variant**. Kept so the Lead can choose the disposition. |

## Facts established

| Check | Result |
|---|---|
| Three-file delta = Architect table | ✅ manifest.json M 638e95a1→6c27f420; manifest-hermes.json A →638e95a1; "manifest copy.json" D 6c27f420→absent. The new active bytes are the old "copy"; the "-hermes" file is the old active. Git blob IDs: 3e65883 (remote roster), aa1f157 (Hermes). |
| Product changes 22ce03b→f21564c | **Exactly these 3 paths.** Other changes: 40 QAM, 3 RESPONSES docs (committed in 9a65cdd). |
| Bundles / urlEnv | Identical: `v1 → ADK_BUNDLE_URL_V1`, `v2-local → ADK_BUNDLE_URL_V2_LOCAL`. All 6 agents → `v1` (greeting, jarvis, calc, product, ghl_mcp, moose_mcp). Names unique. Only the env variable **names** are recorded; no values were read. |
| Importers | At f21564c, only `src/config/manifest.ts` imports and `src/__tests__/config/manifest.test.ts` requires `config/agents.manifest.json`. No reference anywhere to `agents.manifest-hermes.json` or "manifest copy.json" (`git grep` across all tracked files outside agent_docs/ and config/). |
| next-env.d.ts | Gitignored, Next-generated. Worktree 7ad303e4… is **byte-exact the pinned build variant 7b550dda… with the single dev import substitution** (`./.next/dev/types/routes.d.ts`). It is produced by Tony's `next dev` runs. `next build` regenerates the build variant. |
| Root QA_HANDOFF.md pointer | Still present. The Architect authorized Cody to remove it. Not an Executor edit. |
| Inherited Jest (diagnostic, q2-prep-003) | f21564c: 286 pass / 1 fail. Only class C (`chatStore … SSR guard …`) remains. 36 A/B resolved, 0 new. |
| Acceptance / rulings / plan v0.2 | Unchanged: 57f8d9f4… / 99d4c40f… / 8ddb743f… |
