# Q2-F01 — retest addendum, Q2 attempt-002 (2026-10-11)

Original finding `Q2-F01_signout_storage_unavailable.md` is unchanged. Candidate `8eb5789d…`; repair: WorkspaceEntry `finishSignOut` runs on both logout outcomes and tolerates a throwing reset; real stores unchanged.

**Retest (independent, real stores):** `AUTOMATION/jest/qa_f01_realstore.test.tsx` — normal, storage-getter-throws and storage-write-throws. Each: prior-user auth/chat/draft/demo seeded; one `POST /api/auth/logout` (mocked); no navigation before the explicit logout completion; then exactly one `/auth` navigation; auth user/role/isAuthenticated cleared; chat sessions/messages/index/error cleared; composer draft empty; demo text gone; 0 unhandled rejections; 0 store writes during render; roots/listeners/spies/fetch disposed in `finally`. Result 3/3 PASS. Attempt-001's class-C seam test (getter throws) now navigates to `/auth` (PASS). Maintained `signout.test.tsx` 3/3 PASS. Evidence: `evidence/q2-attempt-002/acceptance/D/`, `acceptance/C/`.

**Executor recommendation:** retest evidence supports closing F01 for AC000-13. Limit: mocked HTTP logout proves client clearing/navigation only — not real server logout or token revocation. Lead closes.
