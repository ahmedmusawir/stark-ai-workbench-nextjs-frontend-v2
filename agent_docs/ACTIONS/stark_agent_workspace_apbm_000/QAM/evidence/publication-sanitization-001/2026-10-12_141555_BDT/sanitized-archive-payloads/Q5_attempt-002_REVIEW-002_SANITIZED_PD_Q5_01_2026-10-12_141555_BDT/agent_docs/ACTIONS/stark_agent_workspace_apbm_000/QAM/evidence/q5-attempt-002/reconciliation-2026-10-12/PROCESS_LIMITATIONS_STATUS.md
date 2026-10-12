# Process verdict inputs, limitations and qualifications (as of 2026-10-12 reconciliation)

Candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5`. Gate Q **PENDING** for QA Lead review. APBM_000 is **not closed**. D4 ALLOW, D7 OMIT.

## Process deviations

**PD-002-01 (unchanged; Lead-classified):** in Q2 attempt-002, execution proceeded after a **GATE_STOP** (G10b, generated `next-env.d.ts`) **without the required ruling**. Stage E ran on the Executor's own disposition and the gate was re-run afterwards. The Lead accepted the next-env transition for this candidate only. **No future gate override is authorized.** Record: `../../q2-attempt-002-addendum-001/PROCESS_DEVIATION_AND_QUALIFICATIONS.md`.

**PD-Q5-01 (new disclosure, Executor-identified 2026-10-12):** the read-only Q5 proposal generator `AUTOMATION/a2_q5_proposal.py` computed a SHA-256 digest of the private `.env.local`: its generic row writer hashes every listed file. It did so in addendum-001 (2026-10-11 18:29–18:33) and again for the post-Q5 inventory (19:25). The file's bytes were read in-process only for hashing. No value was printed, logged, copied or transmitted. Only the 64-hex digest was recorded, in `Q5_PROPOSAL_PATHS.json` and `POST_Q5_INVENTORY.json`, and therefore in the addendum-001 and Q5 packages delivered via Downloads. This contradicts the "presence only / never read" statements in those records' receipts. The authoritative proposal is preserved unchanged as ordered; nothing was redacted. Today's reconciliation does not read or re-hash `.env.local` (presence only). The generator is not modified, and no new run is authorized. **For Lead/Director decision:** whether this disclosure needs any further handling (for example, how packages containing the digest are retained).

**Earlier gate-invocation and instrument events:** see `../../q2-attempt-002/INSTRUMENT_RETRY_LEDGER.md` and the addendum index (gate run 1 failed closed on unlisted own inputs; candidate unaffected).

## Retained qualifications and limitations

- **Font fallback (Q-002-01):** fallback evidence produced on this workstation without hiding the OS-installed Inter is qualified. This covers attempt-002 S-20 blocked rows in the main body, H2 repair-copy typography-fallback rows and earlier Engineer fallback evidence. The accepted targeted diagnostic (`q2-attempt-002/acceptance/G-diag-s20/`) is the fallback proof.
- **Live persistence:** the scope is fixture-qualified UI plus source/build regression. There is no live ADK, Supabase, GCS, GHL, Hermes, login, server-logout or token-revocation, deployed-route or durable-session/persistence certificate, and no authenticated production route was launched (R000-11; plan v0.3 §1). F01 is resolved within mocked-logout fixture scope only.
- **DIRECTOR-OBS-001:** remains **UNTRIAGED-live**. Offline scenarios pass (addendum 003); the live disappearing-conversation cause is not diagnosed.
- **Observation O-1** (recents date format vs design, attempt-001) remains an observation, not re-graded.
