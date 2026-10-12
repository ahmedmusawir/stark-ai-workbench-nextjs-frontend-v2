# Process deviation and retained qualifications — recorded per QA Lead disposition (2026-10-11)

## PD-002-01 — Proceeding after GATE_STOP (process deviation)

**What happened:** preflight gate run 2 (17:59) returned **GATE_STOP** (failed check G10b: generated `next-env.d.ts` `0f706298…` not a binding-pinned variant). The Executor did not stop the attempt: it recorded its own disposition (`q2-attempt-002/preparation/NEXT_ENV_DISPOSITION.md`), ran the authorized build (Stage E, 18:01) while the gate verdict was still STOP, and re-gated afterwards (post-build GATE_PASS 17/17 at 18:02). The attempt-002 records called this a "stage ordering deviation"; the correct classification is a **process deviation: execution continued after a fail-closed gate STOP on the Executor's own judgment**, without a Lead ruling at that moment.

**Lead disposition:** the generated next-env transition is accepted for candidate `8eb5789d…` only. **This does not authorize future gate overrides.** Going forward a GATE_STOP stops dependent work and returns a ruling question unless the plan pre-authorizes the specific disposition.

**Impact:** none on candidate identity. The file is gitignored, untracked and not candidate source; every other check passed; no product file was touched. Stages B, C and D ran only after the pinned variant was restored by Next itself.

## Q-002-01 — OS-installed Inter masks font-fallback evidence (retained qualification)

The QA workstation has Inter installed at OS level (`/usr/share/fonts/truetype/inter-zorin-os`, 18 files). Any browser fallback ("fonts blocked") evidence produced on this workstation **without** hiding that OS font is qualified. It may show the OS Inter rather than the product `Inter Fallback`. This applies to:
- attempt-002 Stage G S-20 blocked-font rows (superseded for fallback purposes by the accepted targeted diagnostic `q2-attempt-002/acceptance/G-diag-s20/`);
- attempt-002 Stage H2 repair-copy typography-fallback rows (`acceptance/H/repair-copy-out/typography-*-fallback.json`);
- earlier Engineer typography/fallback evidence (`evidence/engineering-repair-001/typography-*-fallback.json` and related).

Loaded-font, byte-equality and production-output font evidence is not affected: the web faces load independently of the OS font, as the diagnostic showed.

## A-002-01 — AC000-20 harness forbidden-import control (completed in this addendum)

The control omitted in attempt-002 was run under the same isolation. The seeded `@/services/chatService` import is rejected by the harness plugin (exit 1, exact message), and a twin entry that differs only in an allowed import builds to `QA_FIXTURE_READY`. Evidence: `forbidden-import-control/CONTROL_RESULT.json`.
