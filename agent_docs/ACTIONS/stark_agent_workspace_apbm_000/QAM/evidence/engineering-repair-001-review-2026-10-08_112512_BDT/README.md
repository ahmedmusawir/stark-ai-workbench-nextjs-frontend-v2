# APBM_000 repair 001 — Architect and QA Lead review

Export timestamp: 2026-10-08_112512_BDT (Asia/Dhaka). Cody, Engineer; Claudy paused. Repair is uncommitted; **Gate Q pending**.

Branch `qa/frontend-apbm-000`, full HEAD/repair parent `9c50884d4c4513b6969311d5be7c05828104ed3d`. No repaired commit SHA exists. Exact current product/test delta has SHA-256 `fac3f21262dca396f5c7b7d71143bbfff1a0f21a809f0278315f1d4d7beebaaa`. All 18 changed product/test files, including new tests and seven binary font assets, are included at their repository-relative paths. The inherited lockfile delta is separate.

1. Read [ENGINEERING_REPAIR_001_RETURN.md](../../HANDOFFS/ENGINEERING_REPAIR_001_RETURN.md) for F01–F04 mechanisms, full repair scope and remaining independent work. Canonical [QA_HANDOFF.md](../../HANDOFFS/QA_HANDOFF.md) is included unchanged.
2. Inspect [product.patch](../engineering-repair-001/product.patch) (exact new-file/binary patch), [repair-authored.patch](../engineering-repair-001/repair-authored.patch) (product plus original repair records), `product-test-paths.txt`, `checkout-state.json`, `git-status.txt` and the existing hash inventory. Metadata added by this packaging task is separately indexed; original hash-pinned records are preserved.
3. Read [VERIFICATION_SUMMARY.md](VERIFICATION_SUMMARY.md) and [EVIDENCE_INDEX.md](EVIDENCE_INDEX.md). No product edit or test execution occurred during packaging. All original failed iterations and final passing results remain available.
4. Read [INHERITED_LOCKFILE.md](INHERITED_LOCKFILE.md) and exact [pre-existing-lock.diff](../engineering-repair-001/pre-existing-lock.diff). The pre-repair local lockfile changes dependency versions; it was preserved and is excluded from repair/staging scope.
5. Read [MISSING_LEAD_DISPOSITION.md](MISSING_LEAD_DISPOSITION.md): **LEAD_Q2_DISPOSITION_2026-10-07.md is missing and was not reviewed**. No substitute approval was created.
6. Read [INTER_PROVENANCE_AND_HASHES.md](INTER_PROVENANCE_AND_HASHES.md) and the included product provenance/license. Verified production assets are intentional product files.
7. `staging-paths.txt` retains the original 111 proposed paths. It excludes package-lock.json, RESPONSES files, caches, disposable font copies and archives. Packaging-only review records are documented in this export index but are not silently appended to that original repair list. No paths were staged.

Independent QA still needs the Lead disposition/next-attempt approval, an actual committed candidate, its own instrument corrections and retests, and the normal installed production build with network denied and no font-mocking hook, output identity and separation scan. Preserve D4 ALLOW and D7 OMIT. No certification, Q5, closeout or restart of Q2 attempt 001.

Archive preserves repository-relative paths, with a convenience REVIEW_START_HERE.md at ZIP root. Explicit file selection excludes credentials, .env files, node_modules, cache directories and nested archives. SHA256SUMS.txt covers all other members. Archive receipt beside this review directory records ZIP SHA-256, CRC verification and eventual Downloads copy integrity without recursive ZIP inclusion.
