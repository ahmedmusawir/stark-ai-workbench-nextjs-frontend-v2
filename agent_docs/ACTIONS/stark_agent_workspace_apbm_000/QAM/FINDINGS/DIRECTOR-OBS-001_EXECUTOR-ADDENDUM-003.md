# DIRECTOR-OBS-001 — Executor addendum 003 (Q2 attempt-002, 2026-10-11)

Offline retest on candidate `8eb5789d…` (G: DIRECTOR-OBS-001 §11.3): two successful new chats A then B both stay in recents in order; reopening A shows only A; ledger shows two first sends with no session (`[null, null]`) and no archive/rename; a fresh mount with an index holding A+B lists both and reads only A's history. PASS (`acceptance/G/records/obs001-*.json`).

Status unchanged: the live disappearing-conversation cause remains **UNTRIAGED-live**. No live login, service or diagnosis was performed (outside this release).
