## APBM_000: Q2 still not released; prep done, 2 new blockers found

Your paste is the Lead's continuation prompt; it isn't a Q2 release, and the repo hasn't changed since my last report. So I did only the permitted prep. **Q2 has not started. Gate Q is not issued.**

### Verified (again)
- The installed Q1b records match the Lead's index byte for byte. Plan v0.2 is `8ddb743f…0337`, acceptance `57f8d9f4…`, rulings `99d4c40f…`.
- **Product candidate** `22ce03b` ≠ **execution HEAD** `2f488e4` (your Q1 docs commit). The candidate is its ancestor. The only intervening commit touches QAM paths only.

### Prepared (permitted QAM-only instruments)
- `QAM/AUTOMATION/q2_identity.py` is the Q2-owned identity check required by plan §11.1. It takes explicit candidate, HEAD and output arguments, never overwrites Q1 evidence, compares Git blobs **and** working-tree bytes for 390 product/design/contract paths, checks untracked and staged files, and keeps every raw anomaly with a per-path classification.
- **Self-test passed: all 4 expected-red controls fired.** They cover a non-ancestor HEAD, an unauthorized `src/` file, a mutated product file and a mutated approved-record hash. They ran only on a disposable `git archive` copy with a temporary index; your real `.git/index` was never touched.
- `QAM/AUTOMATION/q2_approved_qam_records.json` lists the expected hash for each approved QAM record, taken from the Q1 index and the Lead's Q1b index. Executor-authored records are labelled as such. Nothing is waved through as a blanket exemption.
- QAM state, manifest and checkpoints are updated additively. Evidence is in `QAM/evidence/q2-prep-001/`.

### Real identity run: raw verdict PRODUCT_DRIFT_OR_IDENTITY_FAILURE
| Blocking item | Cause | Fix (yours) |
|---|---|---|
| `config/agents.manifest.json` ≠ candidate, plus untracked `agents.manifest_hermes.json` | Your roster swap for the live test | Restore (commands below) |
| **NEW:** `next-env.d.ts` ≠ pinned | **Your `next dev` is still running** (pid 1707292, port 3000, since 13:28). It rewrote the import to `./.next/dev/types/routes.d.ts`. Switching that line back reproduces the pinned sha `7b550dda…` exactly (checked in memory). | Stop the dev server, then restore the line |
| **NEW:** a live writer is active | The running dev server watches and rewrites files while Q2 would run, which breaks "one writer at a time". It's also connected to your real backend. | Stop it before Q2 |
| Q1b records not committed | n/a | Commit (Git block) |
| D4, D7 and the Q2 release missing | n/a | Your release reply |

Non-blocking: the module-root `QA_HANDOFF.md` pointer still needs removing by Architect/Cody (I don't edit outside QAM). N1 still needs your acknowledgement. Both RESPONSES logs are untracked docs, not product.

### Put the checkout back to candidate state (not run by me)
```bash
# 1. stop the dev server (Ctrl+C in its terminal, or:)
kill 1707292 1707273 1707272
# 2. manifest back to candidate bytes; keep your live roster outside the repo
cp config/agents.manifest.json ~/agents.manifest_old-roster_2026-10-05.json
cp config/agents.manifest_hermes.json config/agents.manifest.json
mv config/agents.manifest_hermes.json ~/agents.manifest_hermes.json
# 3. next-env.d.ts back to the pinned build variant (gitignored, generated)
sed -i 's#\./\.next/dev/types/routes\.d\.ts#./.next/types/routes.d.ts#' next-env.d.ts
sha256sum next-env.d.ts config/agents.manifest.json
#   expect 7b550dda9686c16f…  and  638e95a166e9e196…
git status --porcelain config/          # must print nothing
```

### Git (not run; your call)
```bash
git add agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM agent_docs/RESPONSES/response_2026-10-05_114929_apbm-000-q1-qa-intake.md agent_docs/RESPONSES/response_2026-10-05_182656_apbm-000-q2-pending-decisions.md agent_docs/RESPONSES/response_2026-10-05_183159_apbm-000-q2-prep-still-blocked.md
git commit -m "APBM-000 Q1b: Lead-approved plan v0.2 + review/finding; Q2 identity instrument and pre-release evidence"
git push
```
Run this only **after** the restore block, so `config/` stays out of the commit.

### NEXT MOVE
1. Run the **restore block** (stop `next dev`, manifest, `next-env.d.ts`), then the **Git block**.
2. Reply with your filled-in release:
   > Q2 RELEASE, Director Tony, 2026-10-05 [time]. I release the APBM_000 Q2 body for product candidate 22ce03ba3871ea53e5253f2e3f060a1bab3226a3 under Lead-approved QA-APBM000-PLAN v0.2 (SHA256 8ddb743f1be09d624bf79c8a602ad05fbd3cffbffbc2d8c6cfbaee16f8b80337). D4: [ALLOW font-only build per plan §11.2 / NO ACCESS, build BLOCKED]. D7: [controlled fixture comfort check / OMIT]. N1: acknowledged.
3. **Forward to the QA Lead (FYI) and Architect/Cody (root-pointer fix):**
   `~/Downloads/APBM000_Q2_Prep-Status_2026-10-05_183159.zip`
   It contains this report, the identity instrument with its self-test results, the pre-release identity evidence and adjudication, and the updated state.
4. Once the release arrives, I re-run the identity check. It must come back PRODUCT_EQUIVALENT, otherwise I stop. Then I run Q2.

Report saved: `agent_docs/RESPONSES/response_2026-10-05_183159_apbm-000-q2-prep-still-blocked.md`
