## APBM_000: Lead approval verified and installed, one commit, then your one confirmation

The QA Lead approved **candidate `f21564c`** (your cloud roster) with a binding addendum. I verified the ZIP, installed it into QAM without overwriting anything, updated routing, and prepared **one** exact commit list. Your roster is untouched. **No tests have run yet.**

### Verified
- `APBM000_REMOTE_ROSTER_LEAD_APPROVAL_2026-10-07.zip` (sha `314dd264…`): CRC passes, and **6/6 indexed files** match by size and hash. The index excludes itself by design.
- **9/9 binding pins match on disk:** plan v0.2 `8ddb743f…`, Q1B review, acceptance `57f8d9f4…`, rulings `99d4c40f…`, the Architect amendment `57924e3f…`, identity tools v1 `70319605…` and v2 `cf0968a2…`, the amendment JSON `8da8cb0b…`, and the Lead approval `c0380dfc…`.
- What the Lead decided:
  - **The A/B waivers are retired.** Expected Jest is 286/1, with only the exact class-C test.
  - `next-env.d.ts` is accepted only as the pinned build variant or the exact dev variant.
  - **The old missing prep file is superseded.**

### Prepared (all inside QAM)
- 7 Lead files are installed. `QAM_STATE.json` routing is updated, with the diff kept as evidence.
- New **frozen records manifest** `AUTOMATION/q2_qam_records_2026-10-07.json` (72 entries). It doesn't contain its own hash; that hash is pinned in the staging record. The historical records list is left unchanged.
- Start-prep evidence is in `evidence/q2-start-prep-2026-10-07/` (install verification, routing diff, staging list).
- **One commit list of 38 paths**, all inside QAM. It includes the 18:30 attempt-002 records and the 18:44 hold note, so there's no separate hold-note commit. Excluded: RESPONSES, config, src, caches. The list file is `evidence/q2-start-prep-2026-10-07/staging-paths.txt`, and I've checked it equals exactly the pending QAM set.

### Git (not run; your call)
```bash
cd ~/NEXTJS/stark-ai-workbench-nextjs-frontend-v2
git add --pathspec-from-file=agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-start-prep-2026-10-07/staging-paths.txt
git diff --cached --name-only | wc -l      # must print 38
git diff --cached --name-only | grep -v "^agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/" || echo "OK: only QAM staged"
git commit -m "APBM-000: Lead remote-roster approval installed (candidate f21564c), QAM routing + records manifest, attempt-002 records"
git push
```
If the count isn't 38, stop and paste me the output. The RESPONSES reports stay untracked.

### NEXT MOVE
1. Run the Git block.
2. **Reply with this one confirmation.** D4 = ALLOW and D7 = OMIT stay as recorded:
   > Extend my Q2 release to candidate f21564cacb563ecddbf78b1685086c9489bf1c26 under the QA Lead's revised approval incorporating the 5 October remote-roster amendment. Keep my font-build permission and skip the optional visual check. Begin after candidate verification.
3. **Don't run `next dev` while Q2 runs.** Any other Executor or Cody session should stay idle (one writer at a time).
4. Then I record your words, verify the commit and candidate (Q2-0), and run the full Q2 autonomously. The results package goes to the QA Lead, and you get a Downloads ZIP and a RESPONSES report.

Report saved: `agent_docs/RESPONSES/response_2026-10-07_185841_apbm-000-lead-approval-installed-commit-list.md`
