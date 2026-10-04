# Q5 cleanup report
Status: NOT RUN.

Default fixture run has no live credentials. Before export inspect screenshots, logs, diffs, traces, fixture files and metadata for secrets/private information; reject unexpected captures. Keep raw browser profiles/auth state/traces outside durable evidence unless explicitly sanitized and justified. Record scan method, coverage and limits. Preserve failed test evidence after safe redaction.

Delete only run-owned temporary fixture data, browser profiles/processes and declared disposable tooling artifacts after authorized disposition; never use blanket git clean or remove retained prior evidence/design/contract. Stop only processes started by this run. Confirm product/config/test candidate identity after cleanup and inventory retained evidence.

If separately authorized credentials were introduced, follow that ruling's exact lifecycle, value-scan before deletion, removal and post-deletion pattern scan/Director rotation attestation. Do not claim value scanning after source credentials no longer exist. Unexpected live credentials/access are a stop condition under the default pack.

Record removed paths, retained paths/hashes, no-source-change proof, exceptions and next Lead decision. Cleanup never reclassifies failed results or independently issues certification.
