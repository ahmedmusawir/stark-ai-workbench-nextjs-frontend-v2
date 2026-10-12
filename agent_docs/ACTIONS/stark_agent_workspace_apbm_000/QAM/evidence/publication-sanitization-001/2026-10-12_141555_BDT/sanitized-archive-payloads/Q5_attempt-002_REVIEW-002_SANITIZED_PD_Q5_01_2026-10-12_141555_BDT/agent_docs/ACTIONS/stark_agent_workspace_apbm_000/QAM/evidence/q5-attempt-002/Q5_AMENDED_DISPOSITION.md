# Q5 amended disposition (Lead authorization 2026-10-11 19:23, `HANDOFFS/LEAD_Q5_AUTHORIZATION_2026-10-11_192313_BDT.txt`, SHA-256 `307e9d86…0663`)

The authoritative proposal `evidence/q2-attempt-002-addendum-001/q5-proposal/Q5_PROPOSAL_PATHS.json` (SHA-256 `242f95eb508e55e5a81f3e660197857fded1d730e97494d92ebd181590d6e7ed`) is **preserved unchanged** (re-hashed after Q5). This file records the Lead's amendments separately.

| Proposal item | Proposed | Lead disposition (applied) |
|---|---|---|
| Root `RECOVERY.md` / `session_2026-10-11.md` | Option A | **Approved and executed:** exact prepend → `QAM/QA_RECOVERY.md`; `RECOVERY.md` = `edfffe35…` (HEAD blob); root session pointer removed after hash and QAM-copy confirmation. Committed historical root records left unchanged |
| 5 rows `category == "cache"`, `proposed_action == "DELETE"` | DELETE | **Approved and executed:** exactly these 5, each untracked and hash-matched before removal |
| Failed-run cache (`policy-controls.run1/…/.last-run.json`) | RETAIN | RETAIN (preserved) |
| 8 Engineer-suite copies | RETAIN through Gate Q; delete-eligible after | **Amended: RETAIN.** No post-Gate-Q deletion is granted |
| All other instruments | RETAIN | RETAIN |
| Stage E `.next` production output | RETAIN until Director comfort check, then DELETE | **Amended: RETAIN, with no comfort-check dependency** (D7 remains OMIT) |
| Every other RETAIN / NO QA ACTION row | as proposed | Stands |

The refreshed `POST_Q5_INVENTORY.json` is a snapshot only and grants no deletion authority. Root-protocol conflict: resolved for this QA execution by keeping all QA recovery and session records inside QAM. Broader repository policy belongs to the Architect and Director.
