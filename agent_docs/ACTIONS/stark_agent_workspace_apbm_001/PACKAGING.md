# Automatic handoff packaging

Engineering return: QAM/HANDOFFS/APBM001_ENGINEERING_REVIEW_001.zip. Q1: APBM001_Q1_REVIEW_001.zip. Q2: APBM001_Q2_REVIEW_001.zip. Increment attempt rather than overwrite; keep older attempts. A byte-identical Downloads copy is required for Tony. Report absolute path, file count, byte count and SHA-256. No Git mutation needed to package.

Each return contains REVIEW_START_HERE.md with exact requested decision, phase/state and identity, complete relevant reports, frozen acceptance/data contract/rulings, governing provenance, findings/AC matrix, changed-path inventory, commands and sanitized evidence. Q1 includes the actual recon report and proposed test plan. Q2 includes exact Lead approval and Director release receipt. Engineer return includes factual QAM handoff and claim matrix. Do not substitute a chat summary for a missing approval letter.

Use an explicit inclusion list. FILE_INDEX.json lists every other member with archive path, source path, purpose, bytes and SHA-256. Verify exact membership, safe paths, no symlinks or duplicate names, hashes, ZIP CRC and privacy. External receipt hashes the finished ZIP. Never recursively nest previous ZIPs. Source SHA digests are allowed for non-secret product/docs/evidence; environment/credential file hashes are not evidence.

Exclude .env*, credentials, authenticated browser storage/profiles, cookie/authorization headers, private originals, dependencies, build output, Git internals, unreviewed raw logs and opaque thoughtSignature blobs. Validate privacy scanner with synthetic-leak and clean fixtures. Scan selected expanded members. Do not falsely claim value-based scanning if credential source was never available. Preserve sanitized failure evidence and record scan method/limits. A missing required file is a GAP; never invent it. A privacy failure stops export, not investigation of safe independent work.

No compulsory new ZIP is needed solely because Tony made a docs-only commit: record receipt and complete diff proving unchanged product identity. Packaging never requires rerunning green tests without a changed claim.
