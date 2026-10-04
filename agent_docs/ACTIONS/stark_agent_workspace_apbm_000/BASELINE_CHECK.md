# Bounded engineering baseline — APBM_000

Outcome: **MATCH — product baseline matches; pre-existing documentation work retained.** Engineer entry 2026-10-04T21:34:00.468323+06:00. This is a bounded baseline check, not recon or QA certification.

- Repository: `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2`
- Sanitized origin: `https://github.com/ahmedmusawir/stark-ai-workbench-nextjs-frontend-v2.git`
- Actual/expected branch: `frontend-apbm`
- Actual full HEAD and evidence baseline: `20ef380bdd6eed5e111d953d6404992add7a88a6`
- Initial product/config/package diff against baseline: empty. Dirty documents, historical response deletions and untracked planning/recon/module/session artifacts already existed. Exact initial status: `evidence/engineering-attempt-001/entry-identity.json`. They were neither restored nor staged.
- Active stylesheet: `src/app/globals.scss` through root layout; root theme provider/Inter unchanged. `src/styles/global.scss` is not adopted. Scoped workspace Sass is imported only by `/chat/page.tsx`.
- Consumers inspected: authenticated cyberize layout → AppShellPage; chat page/legacy ChatPageContent, MessageBubble → MessageActions; configured manifest projection; chatService, sessionIndexService, chatStore, useAuthStore. Existing services/auth/API/config identities remain protected.
- Node `v26.7.0`, npm `11.19.0`, Next `16.2.6`, installed Playwright `1.59.1`, TypeScript/Jest/Sass/Tailwind already available. No dependency install/change.

| Baseline check | Actual result | Evidence |
|---|---|---|
| TypeScript noEmit | PASS, 22.189 seconds | baseline-tsc.log/json |
| Full Jest | 26 passing / 10 failing suites; 225 passing / 38 failing tests | baseline-jest.log/json; inherited-jest-failures.json |
| Initial production build | Failed Inter download in default restricted environment | baseline-build.log/json |
| One supported build diagnostic | PASS, 27.011 seconds; Google font access available | baseline-build-diagnostic.log/json |
| Initial browser/loopback check | Expected cached Chromium absent; socket creation denied | baseline-browser.log/json |
| One supported browser diagnostic | PASS using `/opt/google/chrome/chrome`, Chrome 154.0.8037.92; own ephemeral 43541 listener closed | baseline-browser-diagnostic.log/json |

All listed evidence is under `evidence/engineering-attempt-001`. Product work started only after build and installed-browser readiness were established. Fixture server subsequently owned loopback port 43170 and Playwright used `reuseExistingServer:false`; no other process was killed. No agent/account/database/GCS operation was authorized or invoked. Build allowed only existing font hosts; test harness rejects external traffic. No unresolved environment blocker. Obsolete `next lint` remains a known, unqualified command; no toolchain upgrade or audit was attempted.
