# Q2-F03: "Agents" breadcrumb link is 40×44 at 375px (below the 44×44 target)

Status: **OPEN, proposed Low, for Lead classification.** No new exception is authorized (Lead L2/plan S-17).

- **AC:** AC000-17 ("controls have accessible names and 44px targets").
- **Actual:** in directory/workspace/conversation views at 375px, the breadcrumb `<a>` "Agents" measures 40×44. It's the only violation among all visible controls measured at 375 and 1280. Evidence: `evidence/q2-attempt-001/q2-6/run2/records/s17-names-targets.json`.
- **Mechanism:** the mobile rule `.ws-crumbs a { max-width:90px; display:block; line-height:44px; … }` has no `min-width`, so the short label renders 40px wide.
- **Smallest suggested file:** `src/app/(cyberize)/chat/workspace.scss` (mobile crumbs).
