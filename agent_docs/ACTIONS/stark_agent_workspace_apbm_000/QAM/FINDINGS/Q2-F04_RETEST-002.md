# Q2-F04 — retest addendum, Q2 attempt-002 (2026-10-11)

Original finding `Q2-F04_manifest_test_bundle_coverage.md` is unchanged. Repair: maintained `src/__tests__/config/manifest.test.ts` again asserts literal `{ id: 'v1', urlEnv: 'ADK_BUNDLE_URL_V1' }` and `{ id: 'v2-local', urlEnv: 'ADK_BUNDLE_URL_V2_LOCAL' }` (arrayContaining).

**Retest:** the assertion is present in the candidate and its test ("the committed manifest validates the configured roster and preserves declared bundle identity") executed and passed in the full maintained run (C: `F04-maintained-assertions.txt`). Independent QA test pins the exact list `[['v1','ADK_BUNDLE_URL_V1'],['v2-local','ADK_BUNDLE_URL_V2_LOCAL']]` (D: PASS). Gate G11 confirms the committed roster carries both mappings with six agents all on v1. PASS.

**Executor recommendation:** supports closing F04. Note: the maintained assertion uses arrayContaining (extra bundles would pass it); the exact list is pinned by the QA test. Lead closes.
