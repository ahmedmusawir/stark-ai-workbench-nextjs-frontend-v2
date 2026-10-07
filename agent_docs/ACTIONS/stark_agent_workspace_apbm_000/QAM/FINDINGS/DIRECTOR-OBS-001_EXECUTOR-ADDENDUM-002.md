# DIRECTOR-OBS-001: Executor addendum 002 (Q2 offline assessment per plan §11.3)

Recorded 2026-10-07 by the QA Executor (Claudy). Candidate f21564c (approved remote roster). Original finding and addendum 001 are unchanged. **No live calls, no repair.**

| §11.3 check | Result | Evidence |
|---|---|---|
| 1. Adapter seam: new chat A then B with an authoritative mocked index | PASS: both created (2 creates, session_id null both times); list returns A+B; history(A) reads only A; 0 archive/rename/touch | `q2-3` QA Jest › DIRECTOR-OBS-001 adapter seam |
| 1. Browser: two new chats, back to workspace, reopen A | PASS: recents show "first chat" + "second chat"; reopening A shows only A's reply; sends `[null, null]`; no archive/rename | `q2-6/run2/records/obs001-in-session-ledger.json`, screen `obs001-reopen-A.png` |
| 1. Fresh mount (reload-equivalent) with index holding A+B | PASS: both listed; opening A makes exactly one history read for A and shows only A | `obs001-fresh-mount-ledger.json` |
| 2. Metadata create false/throw | PASS: confirmed ID and transcript kept, metadata-warning copy shown, "Check conversation list" = +1 list, 0 send/create | J-10, S-10 |
| 2. Empty/degraded legacy list | Recorded as an inherited service limitation (KNOWN_LIMITS): adapter maps `[]` to `empty`; no frontend invention | J-21, source `productionAdapter.ts` |
| 3. Identity/timing negatives | PASS: late history cannot paint another session; identity switch mid-flight cannot surface prior-user content | S-10 race tests |

**Source seam (read-only):** `productionAdapter.send` creates the catalogue row via `sessionIndexService.createSession` only for new chats (`!sessionId`) and returns `metadataWarning` on false/throw. Recents come only from `sessionIndexService.listSessions`, and threads read `chatService.getHistory`. Workspace keeps transcripts in component memory per session key.

**Disposition proposal:** the new frontend did **not** lose, replace or hide a successful catalogue entry in any offline scenario. "Nothing is remembered" live is therefore most consistent with the catalogue write/list path returning nothing (inherited empty-on-error collapse, RLS/auth, or environment), which offline evidence can't decide. Recommend keeping OBS-001 **UNTRIAGED-live** and, if the Director wants the cause, the bounded live diagnostic already specified in DIRECTOR-OBS-001.md (Architect scope plus Director authorization). Note: the metadata-warning copy would appear on screen if `createSession` returned false. Tony did not report seeing it, which points toward list/read rather than write; this is not conclusive.
