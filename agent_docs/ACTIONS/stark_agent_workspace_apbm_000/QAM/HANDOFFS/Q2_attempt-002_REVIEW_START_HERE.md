# QA Lead — review Q2 attempt-002 for APBM_000

**Next decision owner: QA Lead (JARVIS).** Disposition the attempt-002 findings and evidence for candidate **`8eb5789d9021ad06c15db36db74419a2b5c68fc5`**, then decide Q5 cleanup authorization and Gate Q. **Gate Q PENDING. D4 ALLOW and D7 OMIT retained.** This package performs no certification, Q5, merge or closeout. No product repair was made by QA. Attempt-001 records are unchanged.

## Outcome (Executor-proposed)

- Real-checkout gate **GATE_PASS 17/17** (post-build); 6/6 gate negative controls detected; HEAD = candidate, 269 reviewed paths with blob/patch hashes reproduced exactly from Git.
- **Normal offline production build: exit 0** (Next 16.2.6, no font mock/mediator/egress; build namespace escape controls all blocked). Output audit: fresh, `/chat` present, 0 fixture markers/forbidden imports in 464 files (seeded control flagged), all 7 Inter WOFF2 byte-equal and CSS-resolved.
- tsc 0 · maintained Jest **290/290** (40 suites, no drift vs Engineer's latest) · QA Jest **31/31** · independent browser **34/34** · secondary **33/33** + **27/27**.
- **F01–F04 retest PASS**; closure recommended (`FINDINGS/Q2-F0x_RETEST-002.md`). DIRECTOR-OBS-001 offline PASS; live cause **UNTRIAGED-live**.
- Proposed grades: **23 PASS, AC000-24 NOT RUN**.

## Items needing your explicit disposition

1. **Stage ordering:** E (build) ran before B/C/D because the pre-existing generated `next-env.d.ts` (`0f706298…`, Next dev form + a `root-params` import line) was not one of your two pinned variants; QA did not edit it; the build regenerated pinned `7b550dda…` (`evidence/q2-attempt-002/preparation/NEXT_ENV_DISPOSITION.md`).
2. **Workstation OS-installed Inter** can mask fallback rendering; the targeted S-20 diagnostic with it hidden shows the product fallback renders (report note E-1). This also affects any earlier fallback evidence produced on this workstation.
3. Three diagnosed instrument corrections during preparation/controls (gate patch serialization, C-01 error-string oracle, S-20 metric) — none touched a product assertion (`INSTRUMENT_RETRY_LEDGER.md`).

## Read in this order (paths relative to this HANDOFFS folder)

1. [Execution report](../evidence/q2-attempt-002/EXECUTION_REPORT.md)
2. [24-row AC matrix](../evidence/q2-attempt-002/AC_MATRIX.md)
3. [Instrument/retry/freeze ledger](../evidence/q2-attempt-002/INSTRUMENT_RETRY_LEDGER.md)
4. Findings addenda: [F01](../FINDINGS/Q2-F01_RETEST-002.md), [F02](../FINDINGS/Q2-F02_RETEST-002.md), [F03](../FINDINGS/Q2-F03_RETEST-002.md), [F04](../FINDINGS/Q2-F04_RETEST-002.md), [OBS-001 addendum 003](../FINDINGS/DIRECTOR-OBS-001_EXECUTOR-ADDENDUM-003.md)
5. Identity: [post-build gate](../evidence/q2-attempt-002/preparation/gate-postbuild.json), [gate controls](../evidence/q2-attempt-002/preparation/gate-controls/CONTROLS_SUMMARY.json), [release binding](DIRECTOR_Q2_RELEASE_002_BINDING_2026-10-11.json), [install record](../evidence/q2-attempt-002/preparation/INSTALL_RECORD.json)
6. [Evidence index](../evidence/q2-attempt-002/INDEX.md) and post-run [teardown](../evidence/q2-attempt-002/teardown/)

The ZIP is a review package, not a runnable checkout; execute only from the repository candidate SHA. FILE_INDEX.json lists every member (path, source, purpose, bytes, SHA-256) and excludes itself; the external receipt carries the archive SHA/CRC/membership checks.
