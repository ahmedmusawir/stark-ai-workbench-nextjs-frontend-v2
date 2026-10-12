# Q2-F02 — retest addendum, Q2 attempt-002 (2026-10-11)

Original finding `Q2-F02_drawer_breakpoint_focus_target.md` is unchanged. Repair: the drawer's close-focus callback selects the visible `[aria-current="page"]` desktop item, then the first visible desktop link, then main; the timeout race was removed.

**Retest (G: S-17 drawer):** 375 dark drawer — containment, inert background, Escape/Close/backdrop restore the menu button. Resize 800→1200 with the drawer open → drawer closed; focus polled to the visible `aria-current="page"` desktop item ("Kestrel Ops") and still there after a 300 ms settle with 0 open dialogs and `inert` false. Visible fallback probe (QA DOM probe removing `aria-current`, not product code) → focus on the first visible desktop link ("All agents"). Evidence: `acceptance/G/records/f02-breakpoint-focus.json`. PASS.

**Executor recommendation:** supports closing F02 (AC000-17). Lead closes.
