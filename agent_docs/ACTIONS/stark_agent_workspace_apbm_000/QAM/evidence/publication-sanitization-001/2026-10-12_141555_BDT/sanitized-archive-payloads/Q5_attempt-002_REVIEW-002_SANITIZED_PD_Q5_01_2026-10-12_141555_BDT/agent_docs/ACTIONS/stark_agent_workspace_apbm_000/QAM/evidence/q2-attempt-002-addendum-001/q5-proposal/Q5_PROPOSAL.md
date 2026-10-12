# Q5 retention/deletion proposal — NOT EXECUTED

Candidate `8eb5789d…`. Generated read-only by `AUTOMATION/a2_q5_proposal.py`. `Q5_PROPOSAL_PATHS.json` lists every path with its category, proposed action, reason, owner, tracked flag, size and SHA-256: 592 rows covering every modified/untracked path, every AUTOMATION file, every `.next` entry and the root generated files. Committed historical evidence is listed one row per directory. Nothing has been deleted, moved or restored. Q5 runs only on the Lead's authorization, and the path list should be regenerated and hash-checked at that time.

| Category | Paths | Proposed action | Reason |
|---|---|---|---|
| Durable QA records: QAM state/manifest/checkpoints, session log, HANDOFFS records, FINDINGS (originals + addenda), `evidence/q2-attempt-002/**`, this addendum | 397 + 40 inert pre-correction instrument copies + 1 failed-run cache | **RETAIN** | Referenced by the report, matrix, ledgers and packages; append-only history. The control run-1 `.last-run.json` is the only machine record of that run's failed test IDs |
| Historical committed evidence (`evidence/<15 dirs>`) | 15 directories | **RETAIN (immutable)** | Never rewritten |
| QA package `HANDOFFS/Q2_attempt-002.zip` (+ receipt) | 1 (+ receipt in durable) | **RETAIN**; Tony decides commit | Package of record; byte-identical Downloads copy exists; the attempt-001 package was committed |
| QA-owned instrument source (`AUTOMATION/*`, specs, jest, gate/run/export/proposal tools, negative seeds incl. the new twin) | 19 untracked/modified + 34 committed | **RETAIN** | Frozen by hash in evidence; needed to audit or reproduce; small |
| Engineer-suite copies (`AUTOMATION/secondary-a2/*`, `AUTOMATION/repair-harness/*`) | 8 | **RETAIN through Gate Q; delete-eligible after** | Duplicates of Engineer sources; exact diffs and hashes are in `COPY_RECORD.json`, and the copies are inside `Q2_attempt-002.zip` |
| QA run caches (`.last-run.json` under attempt-002 artifacts) | 5 | **DELETE** | 45-byte "passed" caches; results JSON and logs hold the same outcome |
| Misplaced attempt-001 output committed under `AUTOMATION/agent_docs/…` | 4 (tracked) | **RETAIN**; optional byte-exact relocation to `evidence/q2-attempt-001/q2-6|q2-7/startup-attempt-0/` by commit (Tony) | Unique record of attempt-001's browser startup attempt 0 (webServer failed to start, 0 tests), written there by the config path defect. Verified **not** a duplicate of the `evidence/q2-attempt-001` run records (all 4 differ). Relocation needs a Git change, so QA cannot do it |
| Stage E production output (`.next/*` except `dev`; about 36 MB) | 22 entries | **RETAIN until the Director comfort check, then DELETE** | Accepted build (BUILD_ID `QWT8ECmIa187SCzTCHuq2`); its evidence is already recorded; Tony's comfort check is defined on a completed build |
| `.next/dev` (about 232 MB, 2026-10-08) | 1 | **NO QA ACTION** | Not created by QA |
| `next-env.d.ts` | 1 | **RETAIN** | Pinned build form `7b550dda…`; owned by Next |
| `tsconfig.tsbuildinfo`, `.env.local`, `node_modules/` | — | **NO QA ACTION** | Not QA-owned. `.env.local` is never read (D4: presence only) |
| Pre-existing untracked Cody records (34) and review archives (4) | 38 | **NO QA ACTION**; Tony decides | Present at session start, hash-matched by the gates, not QA-owned |
| Engineer-folder caches (`.last-run.json` in `dependency-reconciliation-001`, `engineering-repair-001`) | 2 | **NO QA ACTION** (owner may delete) | Not QA-owned |
| Root pointers `RECOVERY.md` and `session_2026-10-11.md` | 2 | **CORRECT per `../root-files/PLACEMENT_CORRECTION_PROPOSAL.md` option A** | QA records outside QAM |
| Outside the repository: `/tmp/claude-1000/qa-a2-tmp`, scratch extraction | — | Already removed at teardown and after the addendum control | Run-owned temporary files |
| Downloads packages and receipts | — | **RETAIN** | Handoff copies |

Q5 should finish with a fresh `q2a2_gate.py` run (expect GATE_PASS) and a short cleanup inventory listing every path removed, with its hash taken before removal.
