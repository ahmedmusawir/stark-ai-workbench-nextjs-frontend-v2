# Root file accounting and placement correction proposal (not executed)

Neither root file has been deleted or restored. Exact content is exported here: `RECOVERY.md.diff.txt` (exact `git diff`), `RECOVERY.md.HEAD.txt` (committed bytes), `root-session_2026-10-11.md.txt` (full content), `ROOT_FILES_ACCOUNT.json` (hashes and prepend proof).

## What happened

| File | State | Written by / why | Content |
|---|---|---|---|
| `RECOVERY.md` (tracked) | Modified: a **pure 1,030-byte prepend**; the remainder is byte-identical to HEAD (`ROOT_FILES_ACCOUNT.json`) | Claudy, 17:58 then replaced in place at 18:16, to satisfy the root CLAUDE.md crash-recovery protocol | A pointer block: candidate, plan, release, results, package path, pending owner. The 17:58 in-progress text was overwritten by the 18:16 text; it is reproduced from the Executor's write command in `RECOVERY_1758_BLOCK_RECONSTRUCTED.txt` (not read back from disk) |
| `session_2026-10-11.md` (untracked, not ignored) | New, 5 lines | Claudy, 17:58, same protocol | Pointer only to `QAM/session_2026-10-11.md` |

Both are pointers; every substantive record is already inside QAM (`QAM/session_2026-10-11.md`, `QAM_STATE.json`, `evidence/q2-attempt-002/`). Neither file is product, test, config or dependency; the attempt-002 gates classified both as Executor documents.

**Conflict to rule on:** the root `CLAUDE.md` requires a root `RECOVERY.md` and root session file; the Director release requires all QA records inside QAM; `GOVERNANCE.md` says the module controls conflicting launch/phase rules. Precedent: attempt-001's QA block in root `RECOVERY.md` and root `session_2026-10-08.md` were committed in `9c50884`, so the committed HEAD already carries a stale QA block.

## Proposed correction (recommended: A)

**A. Move the content into QAM and return both root files to their pre-attempt state.** After Lead approval, as part of Q5:

1. Create `QAM/QA_RECOVERY.md` containing exactly the 18:16 prepend text (from `ROOT_FILES_ACCOUNT.json` `prepended_text`), so crash recovery stays available inside QAM.
2. Return `RECOVERY.md` to the HEAD blob (SHA-256 in `ROOT_FILES_ACCOUNT.json` `head_blob_sha256`) by removing exactly the first 1,030 bytes. Verify the result hashes to the HEAD blob before and after. This is a byte removal, not a Git command. If the Lead prefers a Git operation (`git restore -- RECOVERY.md`), Tony performs it.
3. Delete `session_2026-10-11.md` after verifying its SHA-256 still matches `ROOT_FILES_ACCOUNT.json`; the content is preserved in this addendum.
4. Re-run `AUTOMATION/q2a2_gate.py` with an approval list naming `QAM/QA_RECOVERY.md`; expect GATE_PASS with no root entries.

**B. Keep both root pointers** as root-protocol compliance, classified permanently as non-QA pointer documents; Tony commits or discards them at closeout. Downside: QA records outside QAM, contrary to the release wording.

**Standing ruling requested:** for future QA seats in this module, keep the root-protocol pointer in `QAM/QA_RECOVERY.md` (and no root session file)? Also decide whether the stale attempt-001 QA block already committed in root `RECOVERY.md` stays as history; that decision belongs to the Architect or Tony at closeout, not to QA.
