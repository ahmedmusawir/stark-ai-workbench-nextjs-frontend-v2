# Q2-F02: crossing to desktop with the drawer open focuses "All agents", not the current nav item

Status: **OPEN, proposed Low, for Lead classification.** Candidate f21564c. Reproduced in both browser runs (not retried).

- **AC:** AC000-17 ("crossing desktop breakpoint closes navigation and focuses visible equivalent"); plan S-17 oracle: focus the `aria-current` desktop item.
- **Reproduction:** `specs/s17_19_a11y_copy_obs.spec.ts` › "S-17 drawer". At 800px, workspace `agent=kestrel`, open the drawer, resize to 1200.
- **Expected:** focus on "Kestrel Ops" (`aria-current="page"`).
- **Actual:** focus on "All agents". Evidence: `evidence/q2-attempt-001/q2-6/run1|run2/playwright-results.json`.
- **Suspected mechanism:** `Workspace.tsx` drawer `returnFocus` uses `querySelector('[aria-current], a')`, which returns the first element in document order matching either selector, and runs on modal close after the media-change handler's own `[aria-current]` focus.
- **Smallest suggested file:** `src/components/workspace/Workspace.tsx` (returnFocus selector).
