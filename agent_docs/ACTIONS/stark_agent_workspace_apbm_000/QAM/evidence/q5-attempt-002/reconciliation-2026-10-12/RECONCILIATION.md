# Q5 attempt-002 evidence reconciliation — 2026-10-12 (read-only; no cleanup repeated)

Machine record: `RECONCILIATION.json` (per path: fresh hash, latest historical source and hash, pre-cleanup hash, class), produced by `AUTOMATION/a2_q5_reconcile.py` (final run under freeze r12; first run under r11 kept as `RECONCILIATION.r11.json`, same verdict) against `AUTHORIZED_DIFFERENCES.json`. **Verdict: RECONCILED. 0 unexplained.**

**Fresh vs historical:** a *fresh* hash was computed on 2026-10-12. *Historical preservation proof* is the hash written at the time in the authoritative proposal (2026-10-11 18:33:04, pre-cleanup), the Q5 action log (19:24:55), the post-Q5 inventory (19:25), freeze r10, or a package FILE_INDEX (Q2 attempt-002 18:15, addendum-001 18:33:15, Q5 19:26:14). A path is PRESERVED only when its fresh hash equals the latest historical record. Gaps: `INVENTORY_GAPS.md`.

## Postconditions (fresh, 16/16 pass)

- Root `RECOVERY.md` = HEAD bytes = `edfffe35…`; `QAM/QA_RECOVERY.md` = the reviewed 1,030-byte prepend (`44a81597…`).
- Root `session_2026-10-11.md` is absent and untracked; its preserved QAM copy still equals the reviewed `4ce2ae02…`.
- The five authorized caches are absent and untracked; their historical pre-removal hashes are `91d1c430…` (45 B each) in `Q5_ACTIONS.json`.
- Failed-run cache and both Engineer-owned caches are present and equal their pre-cleanup hashes.
- Q5 action log: COMPLETE, 15/15 pre-checks, 7/7 post-checks.
- HEAD = candidate, index empty, tracked QAM evidence unchanged vs HEAD, no product/test/dependency changes.

## Path classes (626 paths, final run)

| Class | Count | Meaning |
|---|---|---|
| PRESERVED | 592 | Fresh = latest historical record. 554 of these are also byte-unchanged since the pre-cleanup inventory |
| — changed between 18:33 and the Q5 package, then preserved | 5 | `QAM_MANIFEST.md` (Q5 append, 19:25); addendum `ADDENDUM_INDEX.md`, `APPROVED_INVENTORY.addendum.json`, `gate-post-addendum.json` (addendum finalization after the 18:33:04 regeneration; in the addendum package index); `Q5_PROPOSAL_PATHS.json` (its own row records the hash of its previous generation; current = authoritative `242f95eb…`) |
| AUTHORIZED CLEANUP TARGET | 7 | Root `RECOVERY.md` (now HEAD bytes), root session pointer, 5 caches (all absent) |
| AUTHORIZED RECORD UPDATE, append-only | 3 | `QAM_CHECKPOINTS.md`, `Q5_STATUS.md`, `session_2026-10-11.md`; each verified to start byte-for-byte with its copy in the Q5 package |
| AUTHORIZED RECORD UPDATE, structured rewrite | 1 | `QAM_STATE.json`; every prior key/value is kept, either in place or in a `history_*` block |
| NEW RECORD after the Q5 package | 26 | 2026-10-11 post-export records (Q5 ZIP, receipt, post-export inventory/gate) and 2026-10-12 instruction, stop, ruling, reconciliation records and tools, and session log |
| PRIVATE | 1 | `.env.local`: presence only, not read or re-hashed (see PD-Q5-01) |

Instruments: all 29 r10 instruments equal their frozen hashes. r11 adds only `a2_q5_reconcile.py` and `q5_reconcile_export.py`. r12 changes only the exporter: the first export attempt stopped, writing nothing, because its secret scan matched the pattern list inside the earlier exporter `q5_export.py`; both exporter sources are now exempt by exact path. The fresh gate was re-run under r12, and the r11 gate run is kept. Earlier packages: `Q2_attempt-002.zip`, `Q2_attempt-002_ADDENDUM-001.zip` and `Q5_attempt-002.zip` each equal their receipt SHA-256, have byte-identical Downloads copies, and pass the ZIP CRC test. They are unchanged.
