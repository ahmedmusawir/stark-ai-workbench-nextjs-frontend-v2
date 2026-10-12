# Q5 status — APBM_000 candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5`

**Q5 (bounded) COMPLETE, 2026-10-11 19:24 BDT. Gate Q PENDING (QA Lead certification review). D4 ALLOW, D7 OMIT.**

| Item | Result | Evidence |
|---|---|---|
| Preconditions | HEAD = candidate; index empty; proposal hash `242f95eb…`; root files = reviewed hashes; remainder = `edfffe35…` = HEAD blob; `QA_RECOVERY.md` absent; 5 caches untracked and hash-matched (15/15 checks) | `Q5_ACTIONS.json` checks, `state-before.txt`, `gate-pre-q5.json` (GATE_PASS 17/17) |
| Root placement | `QAM/QA_RECOVERY.md` created = exact 1,030-byte prepend (`44a81597…`); root `RECOVERY.md` → `edfffe35…`, clean vs HEAD; root `session_2026-10-11.md` removed (`4ce2ae02…`, copy preserved in addendum `root-files/`) | `Q5_ACTIONS.json` actions/post, `state-after.txt` |
| Cache deletion | 5 × `.last-run.json` (each 45 B, `91d1c430…`) under `evidence/q2-attempt-002/` removed; failed-run cache preserved | `Q5_ACTIONS.json` |
| Retained | All instruments incl. the 8 Engineer-suite copies; Stage E output; all evidence and records; every NO QA ACTION path untouched | `Q5_AMENDED_DISPOSITION.md`, `POST_Q5_INVENTORY.json` (602 rows) |
| Identity after cleanup | HEAD = candidate; no product/test/dependency changes; gate run after cleanup (see `gate-post-q5.json`) | gate JSON |
| Instruments | Freeze r10 = r9 + `a2_q5_execute.py`, `q5_export.py` (no acceptance instrument changed); earlier freezes and inventories preserved | `INSTRUMENT_FREEZE.r10.json` + receipt |

Current QA recovery state lives in QAM only: `QAM_STATE.json`, `QAM/session_2026-10-11.md`. `QA_RECOVERY.md` holds the byte-exact preserved prepend, which is the 18:16 snapshot.
