# q2-prep-002: post-restore preparation (Tony-authorized reversible prep; not Q2 acceptance evidence)

Product candidate 22ce03ba3871ea53e5253f2e3f060a1bab3226a3 · execution HEAD 2f488e40816eaa39ee8dcf7b340de75fcb9790cf · branch qa/frontend-apbm-000 · plan v0.2 8ddb743f…0337 · Director Q2 release: NONE. q2-prep-001 is preserved unchanged.

## Actions (2026-10-05, Asia/Dhaka)

| Step | Actual result |
|---|---|
| Manifest restore (by Tony, 18:40:01) | Verified: `config/agents.manifest.json` sha256 638e95a1…7ae8 = candidate blob |
| 1. Dev server | **Already stopped before the Executor acted.** PIDs 1707272/1707273/1707292 not running. No process with this repo as cwd runs next/next-server. No listener on 3000/3001/43170/43181. **Nothing was killed by the Executor.** |
| 2. `agents.manifest_hermes.json` | Backed up no-clobber (`open('xb')`) to `~/APBM000_backups/agents.manifest_hermes_2026-10-05_184317.json`. sha256 638e95a1…7ae8, 593 bytes, verified. Then removed from the checkout. `config/` status clean. |
| 3. `next-env.d.ts` | Line 3 `./.next/dev/types/routes.d.ts` → `./.next/types/routes.d.ts`. sha256 7ad303e4… → **7b550dda…651 = candidate-scope record**. Gitignored; no tracked change. |
| 4. Identity re-run | `identity-post-restore.json`: **raw_verdict PRODUCT_EQUIVALENT**, 0 blocking. 390 product/design/contract paths compared blob + worktree. 28 changed / 191 protected / 218 pinned all consistent. |
| Disclosure | Executor's first plain `git status --porcelain -- config/` (18:42:59) refreshed the real `.git/index` stat cache at 18:43:00 (permitted read-only command; Git's optional stat-cache write). 0 staged changes; no content change. All later Git reads use `--no-optional-locks`. |

## Non-blocking anomalies in identity-post-restore.json

| Raw anomaly | Path | Adjudication |
|---|---|---|
| QAM_UNTRACKED_UNLISTED_OR_HASH | QAM/AUTOMATION/q2_approved_qam_records.json | Self-referential record list; its own hash cannot be listed inside it |
| UNTRACKED_DOCS_OUTSIDE_QAM ×3 | agent_docs/RESPONSES/response_2026-10-05_{114929,182656,183159}_*.md | Tony-requested report logs. Left untouched and excluded from the proposed commit at Tony's direction. Not product. |
| ROOT_HANDOFF_POINTER_PRESENT | stark_agent_workspace_apbm_000/QA_HANDOFF.md | Architect/Cody placement item. Does not block. |

Residue noted, not QA-owned: `.next/dev/` from Tony's dev session (gitignored). Not removed.
