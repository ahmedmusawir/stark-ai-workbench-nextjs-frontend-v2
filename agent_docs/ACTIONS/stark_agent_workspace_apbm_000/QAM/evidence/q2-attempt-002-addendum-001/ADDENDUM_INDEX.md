# Q2 attempt-002 — evidence addendum 001 (2026-10-11 18:26–18:35 BDT, bound 30 min)

Authority: `HANDOFFS/LEAD_Q2_ATTEMPT_002_DISPOSITION_ADDENDUM_INSTRUCTION_2026-10-11_182616_BDT.txt` (`1617184f…`). Candidate `8eb5789d…` = HEAD. No full-suite or build rerun; no deletion, restore, Git mutation or product change.

| Path | Contents |
|---|---|
| `forbidden-import-control/` | CONTROL_RESULT.json (PASS), source-hashes.sha256, NEG/POS commands (`*.cmd.json`) and full logs |
| `seeded-entry-vs-twin.diff` | Exact difference between the seed and its allowed twin |
| `root-files/` | Exact RECOVERY.md diff, HEAD bytes, root session pointer copy, prepend proof, reconstructed 17:58 block, placement proposal |
| `q5-proposal/` | Q5_PROPOSAL.md summary + Q5_PROPOSAL_PATHS.json (path-by-path; NOT EXECUTED) |
| `PROCESS_DEVIATION_AND_QUALIFICATIONS.md` | PD-002-01 (proceeding after GATE_STOP), Q-002-01 (OS-installed Inter), A-002-01 |
| `findings-pre-append.sha256` | Hashes of the four original findings before the Lead disposition was appended |
| `INSTRUMENT_FREEZE.r8.json`, `INSTRUMENT_FREEZE.r9.json` + receipts, `APPROVED_INVENTORY.addendum.json` | r8 = r7 + seeded twin, Q5 proposal tool, addendum exporter (no acceptance instrument changed). r9 = r8 with one Q5-proposal classifier correction: the misplaced attempt-001 files under `AUTOMATION/agent_docs/` were first proposed as duplicates, but byte comparison showed they are the unique startup-attempt-0 records, so the proposal is now RETAIN |
| `gate-post-addendum.json` | Final, under r9: GATE_PASS 17/17. Run 2 under r8 also passed (`…run2-r8.json`). Run 1 (`…run1-STOP-unlisted-own-inputs.json`) failed closed on G14 because the newly written approval/freeze files were not yet in its own document list; they were listed and the gate re-run. Instrument-invocation ordering only; candidate unaffected |

Run-owned temp for the two control runs (`/tmp/claude-1000/qa-a2-tmp`) was removed; no harness process or listener on 43184 remained.
