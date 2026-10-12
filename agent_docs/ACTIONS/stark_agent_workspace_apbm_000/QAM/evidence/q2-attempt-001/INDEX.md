# q2-attempt-001 evidence index

Candidate f21564cacb563ecddbf78b1685086c9489bf1c26 · execution HEAD c4ed7042… · plan v0.2 8ddb743f… + Lead approval c0380dfc… + Architect amendment 57924e3f… · release HANDOFFS/DIRECTOR_Q2_RELEASE_REVISED_2026-10-07_190418.md · all bodies inside `unshare -rn`.

| Folder | Contents |
|---|---|
| q2-0/ | Combined gate output + identity v2 (Q2_0_PASS); attempt-1 crash output; gate/escape/QA-Jest/static/specs fix diffs; mutated records/binding controls (STOP); v2 self-test summary + raw per-control outputs; **INSTRUMENT_LOG.md** (every instrument failure, retry and diff) |
| q2-1/ | tsc log + exits (0) |
| q2-2/ | Full Jest JSON/log (286/1/287); comparisons vs baseline 20ef380 and vs the f21564c diagnostic |
| q2-3/ | QA Jest attempt 1 (instrument-tainted) and attempt 2 (27/28; Q2-F01 evidence incl. CLASS_C_SEAM_RESULT) |
| q2-4/ | Build lane: mediator policy controls (10/10 denied), mediator request logs (8×200), namespace escape controls (noguard all blocked; guard-mode raw), build attempt logs 1–2 (Turbopack font resolution failure), pre/post generated-file record, font file hashes (files removed) |
| q2-5/ | Static audit run 1 (scoping defects) and final (all rules PASS; build markers BLOCKED) |
| q2-6/ | Browser: startup attempt 0 logs (0 tests), run1 (7/29, classified), run2 final (24/29) with results JSON, records/*.json metrics and screens/*.png (41), diag (targeted retries), harness forbidden-import control, specs fix diffs |
| q2-7/ | Engineer-spec copy: patch (path+port only) + source/copy SHA256, results 33/33 |
| q2-8/ | Teardown record; post-run gate (PASS, PRODUCT_EQUIVALENT) |
