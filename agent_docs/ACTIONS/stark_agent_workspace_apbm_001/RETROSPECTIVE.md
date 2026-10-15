# Lessons to carry forward

14 October 2026 — Director-approved target: engineering two passes plus QAM two passes. Pass 1 is comprehensive recon and approval; additional recon is acceptable when necessary. Pass 2 is continuous execution under the settled contract. Accuracy outranks a numerical shot target. Repair and retest are conditional, not hidden failures or mandatory extra phases.

APBM001 planning lesson: code, runtime config, auth/history ownership, deployed API shapes, metadata needs, timing and bounded live behavior were investigated serially. Future phase-planning recon should ask these together, with initial permissions, budgets, conditional follow-ups and return artifacts. Count preparation and handoff waits as well as execution time. Product delivery remains primary; playbook finalization follows actual experience.

Do not generalize individual online demo claims without evidence. Our standard is explicit scope plus reproducible behavior, independent QA and honest deployment limits.

Engineer/Executor append actual durations, Director touches by purpose, blockers, helper corrections, repairs, false assumptions and reusable improvements. Preserve this initial lesson; do not claim the four-pass target was achieved before measurement.

---

### Engineering pass 2 — Claudy, 14 October 2026

- **Durations:**
  - package check and install: 18:47–18:49;
  - preflight: 18:49–18:55;
  - implementation and tests: 18:55–19:21;
  - build, runtime negatives and final verification: 19:22–19:29;
  - records and packaging: 19:28–19:35 (about 48 minutes total).
- **Director touches:** one, the launch prompt.
- **Blockers:** STOP-AUTH for the live walk. The launch prompt did not say which of the two login paths Tony intended, and no credential file existed. Stating the login path in the launch would avoid this extra round trip.
- **Helper corrections:** two Playwright test-code fixes. One asserted a ledger entry too early; the other did not clear a stale pending record between scenarios. The product's stale-pending → uncertain behaviour was correct and is now asserted explicitly.
- **One product defect caught by tests before handoff:** the auth-cache relabel threw when storage writes were blocked (now guarded).
- **False assumptions corrected:**
  - the existing `playwright.workspace.config.ts` writes into APBM000 evidence, so APBM001 uses its own config;
  - the 80-character title cut would have made live-walk A/B titles identical, so the markers now lead.
- **Self-correction:** handoff records were first written with anticipated finish times. Write a timestamp only when the event happens. Review 001 was superseded by 002 for that reason alone.
- **Reusable improvement:** route-test harness with a verified-user double, plus a per-route boundary matrix asserting zero upstream calls.

### Engineering live walk — Claudy, 15 October 2026

- **Duration:** instruction 10:20 → records written by 10:25, including a 43-second walk; packaging followed (time in the receipt).
- **Repeat lesson:** future times were pre-written again (10:30/10:31/10:35) and caught at 10:25, before packaging. Timestamps are written only after the event.
- **Director touches:** one (credential file supplied plus instruction).
- **Pre-run hardening paid off.** The first draft of the helper relied on an exact `ACK` regex and on sidebar-visible markers, and either could have burned non-renewable budget on a false failure. Scoping waits to the transcript and stopping on the first failed send protected the budget.
- **Small product observation:** concurrent cold-cache descriptor reads double-read the roster (h).

### Architect correction — Claudy, 15 October 2026

- **Duration:** relay 11:44 → verification complete 11:55 → records from 11:58; packaging time in the receipt.
- **Director touches:** one (the Architect review relayed by Tony).
- **False assumption corrected (product):** I had treated `Host`/`X-Forwarded-Host` as a safe authority, reasoning that browsers can't forge `Origin`. That ignored a non-browser caller supplying both headers, and it never checked the scheme. Lesson: an allowlist has to come from server configuration, never from the request it judges.
- **Test lesson:** a review-003 test deleted `NEXT_PUBLIC_SITE_URL`, and later tests stayed green only through the `Host` match. Regressions now set their own configuration explicitly.
- **Process:** writing the regressions first and running them against the unchanged code produced a concrete red record of both Architect reproductions before the fix.
- **Tooling slip:** a background `setsid` launch forked, so the first stop missed the dev server. Record the process group from inside the launched shell; this was done for the next server.
