# Existing before/after inventories and exact gaps (no inventory reconstructed)

Only records written at the time are used as historical proof. Hashes computed today are labelled **fresh** in `RECONCILIATION.json` and are never presented as contemporaneous.

| Record (contemporaneous) | Written | Covers |
|---|---|---|
| `q2-attempt-002-addendum-001/q5-proposal/Q5_PROPOSAL_PATHS.json` (authoritative, `242f95eb…`) | 2026-10-11 18:33:04 | Pre-cleanup path/category/hash for 570 file rows (every modified/untracked path, every AUTOMATION file, `.next` entries, root generated files) |
| `HANDOFFS/Q2_attempt-002_ADDENDUM-001.zip` FILE_INDEX | 18:33:15 | Hashes of addendum records after the final addendum edits |
| `q5-attempt-002/APPROVED_INVENTORY.q5-pre.json` + `INSTRUMENT_FREEZE.r10.json` | 19:24 | Hashes of pre-existing records, the installed delivery, baseline copies and all 29 instruments (Executor documents path-only) |
| `q5-attempt-002/gate-pre-q5.json` | 19:24 | Every git-status path with its gate class (no hashes) |
| `q5-attempt-002/state-before.txt` | 19:24:48 | Git status (untracked `QAM/evidence/` paths filtered out) + root-file and cache hashes |
| `q5-attempt-002/Q5_ACTIONS.json` | 19:24:55 | Pre-action hashes of all 7 targets, action receipt, post-checks |
| `q5-attempt-002/state-after.txt`, `POST_Q5_INVENTORY.json`, `gate-post-q5.json` | 19:25:16–19:25:17 | Post-cleanup status, root/cache hashes, 580 hashed rows, gate classes |
| `HANDOFFS/Q5_attempt-002.zip` FILE_INDEX + receipt; `gate-post-export.json` | 19:26 | Hashes of Q5 records; post-export gate |

**Gaps (exact):**
1. **No full path/hash inventory was taken at the moment of mutation (19:24:55).** The latest full pre-cleanup hash inventory is the 18:33:04 proposal, 51 minutes earlier. Files created or changed between 18:33:04 and 19:24:55 have hash coverage only where listed above: the addendum index, the approved inventory for pre-existing/installed/baseline/instruments, and target pre-checks. Executor documents created in that interval (the Q5 instruction/binding and the session/state appends) have no contemporaneous pre-cleanup hash. Their pre-Q5 versions are not separately preserved, except as byte-prefixes checked against later package copies where append-only.
2. `state-before.txt` filtered out untracked `QAM/evidence/` paths, so the status list it records is incomplete for evidence folders. Hashes for those come from the proposal and package indexes instead.
3. Gate inventories record classes, not hashes, for path-approved Executor documents.
4. `POST_Q5_INVENTORY.json` has no internal generation timestamp; its time comes from the file mtime (2026-10-11 19:25:17).
5. The five deleted caches cannot be re-hashed; their proof is the pre-removal hashes in `Q5_ACTIONS.json` and the proposal, plus their absence today.
