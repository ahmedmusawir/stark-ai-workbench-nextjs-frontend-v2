# Implementation plan and engineering verification

## B1 — Preserve seams and establish the workbench view

Use the existing authenticated /chat page and new query view contract. Compose directory/workspace/conversation around existing service-facing chat logic; do not embed backend logic into presentational components. Keep one production source of transcript truth. Preserve current sign-in/layout calls. Do not place a test identity shortcut in production routes or root auth.

Add safe configured agent presentation and neutral fallbacks. Actual runtime roster follows current config, not screenshots. Add directory filter and navigation/back-forward behavior. Keep existing metadata rename/archive callbacks. Use view models/callback injection for deterministic tests; production adapter still invokes existing services.

## B2 — Theme and small component additions

Integrate DESIGN/WORKSPACE_TOKENS.scoped.css under a workbench scope. Keep Next theme provider, Inter wiring and global defaults. Add a scoped portal host for workbench dialogs/menus; ensure container forwarded to Radix, host exists before open, and host/listeners clean up on unmount. Optional wrapper props preserve all existing consumers. Do not copy preview BASE.css globally or bundled Inter data URIs into Next.

Build KIP-WS-01 drawer from installed Dialog; KIP-WS-02 disclosure from a button/region. Keep approved breakpoints/geometry, target sizes, focus, narrow-screen internal scrolling and safe-area composer layout.

## B3 — Three screens and honest state presentation

Implement approved screens, generic configured identity, recents, fresh draft, same-thread composer binding and existing transcript renderer. Keep copy and read-aloud with appropriate fallback; remove edit/regenerate and upload/microphone controls from refreshed surface. Specified uncertain/missing/failed/metadata states are real UI components driven by typed inputs. Fixtures cover all states. New UI code must not turn a generic service failure into a false confirmed-not-sent claim. Record unavailable legacy distinctions for phase 001.

Demo context is an independent local store/composition. Never reuse the existing live instructions service or its chat-mode flag. Test sample add/preview/remove/edit, cross-agent isolation and reset on reload. Remove old live instructions controls from the refreshed entry path; do not remove API routes or backend capabilities in this module.

## B4 — Engineering tests and browser coverage

Use Jest/Testing Library for meaningful component and adapter behavior: configuration projection, route parsing, new-draft/no-create-before-send, callbacks, demo isolation, disable states, literal rename text and unknown/missing action semantics. Existing mocked run/history/index integration tests protect production bindings. Fix touched old-roster test fixtures through controlled configuration, not by switching the real roster or deleting assertions.

Create a dedicated Playwright config with explicit testDir so Jest files are not collected. Reuse installed @playwright/test; no new dependency or lockfile changes. A test-owned local harness under tests/workspace may mount the same production presentation components with fake services/identity, isolated from normal build/route deployment. It must be visibly identified in test records, unable to call remote services, and cannot act as an authentication certificate. If using an existing authenticated app test route instead, it must not introduce any production auth bypass; no live account is authorized here. Document harness boot command and boundaries exactly.

Fixture send/list/history/metadata implementations must be deterministic and isolated from production. Guard browser AND Node/server traffic; a browser route block alone cannot prevent server-side Supabase/ADK calls. No reuse of .env or personal browser state in the harness. Record unexpected outbound attempts without secret values and fail closed. Maintain tests outside deployment inputs; no ?state/roster/speech review selectors enabled in the product.

Required browser scope: actual production UI components, three screens × two themes × 375/768/1280, navigation/filter/config roster, drawer/disclosure/dialog keyboard behavior, long markdown/code/table content, composer behavior, demo non-network boundary and the designed blocked-send states. Detailed independent challenge/coverage belongs to Q1 QA plan, not the Engineer's self-check selection alone.

Visual evidence uses synthetic content. Whole-page overflow <=1 CSS pixel tolerance; internal code/table scroll is permitted and must be keyboard usable. Structural geometry and behavioral assertions accompany screenshots; avoid brittle pixel equality across font/browser platforms. Check light/dark screenshots against the approved design and label render environment/DPR. A real phone keyboard is a Director optional observation, not something headless Chromium is claimed to certify.

## B5 — Regression, scope proof and factual return

Run npx tsc --noEmit and actual Jest scripts after inspecting them. Capture a before/after full-suite comparison; pre-existing failures need exact names/mechanisms, not a blanket waiver. Run the scoped Playwright command and production build; build red due environment remains BLOCKED until resolved or explicitly ruled. No invented lint/audit PASS when old script/network fails. Preserve useful tests and no new failures in unaffected previously passing coverage.

Record unchanged protected files, current config identity, all modified product/test/config/docs paths and source hashes. Report every mandatory AC as ENGINEER CLAIM with evidence or explicit BLOCKED/NOT RUN, never independent PASS. Produce the handoff without waiting for a separate Architect request. Do not refactor unrelated auth, services, dependencies or legacy docs to make the board look cleaner.
