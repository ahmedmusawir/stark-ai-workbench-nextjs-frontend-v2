# Q2-F04: replaced maintained manifest test no longer pins the v1 + v2-local bundle declaration

Status: **OPEN, proposed Low (test coverage), for Architect disposition** per Q1b §6 / Lead L1.

- **Old assertion (baseline):** `expect(MANIFEST.bundles.map(b => b.id)).toEqual(expect.arrayContaining(['v1','v2-local']))`.
- **New assertion:** `expect(MANIFEST.bundles).toEqual(configured.bundles)`, where both sides come from the same JSON (tautological for this fact). The structural `validateManifest` check is retained.
- **Effect:** non-roster bundle-declaration coverage is lost in the maintained suite. QA independently pins it (`QAM/AUTOMATION/jest/qa_navigation_manifest.test.ts`: bundles = `[v1→ADK_BUNDLE_URL_V1, v2-local→ADK_BUNDLE_URL_V2_LOCAL]`, passing). No product impact observed.
- **Smallest suggested file:** `src/__tests__/config/manifest.test.ts` (Engineer, only if the Architect wants it restored).


---

## QA Lead disposition — 2026-10-11 (appended by Executor; text above unchanged)

**Q2-F04: RESOLVED within the tested fixture scope** for candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5` (QA Lead review of Q2 attempt-002). Retest evidence: `Q2-F04_RETEST-002.md`. Source: `HANDOFFS/LEAD_Q2_ATTEMPT_002_DISPOSITION_ADDENDUM_INSTRUCTION_2026-10-11_182616_BDT.txt` (SHA-256 `1617184f…32e6`). Gate Q remains pending.
