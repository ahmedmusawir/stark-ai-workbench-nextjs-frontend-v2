# Q2-F01: sign-out never navigates to /auth when browser storage is unavailable (class C impact)

Status: **OPEN, proposed Medium, for Lead classification.** Candidate f21564c. Executor: Claudy (Q2 attempt 001). No repair performed.

- **AC / rule:** AC000-13 (logout/new-state lifecycle). Lead L4: "Demonstrated phase-000 impact invalidates the [C] deferral."
- **Reproduction (offline, QA Jest, real store):** `QAM/AUTOMATION/jest/qa_entry_props.test.tsx` › "CLASS C seam". jsdom, `window.localStorage` getter throws (browser with site data blocked). Render the production `WorkspaceEntry` with the real `chatStore`, then invoke `onSignOut`.
- **Expected:** logout → reset → `router.push('/auth')`.
- **Actual:** `pushed: []`, `resetThrew: "TypeError: Cannot read properties of undefined (reading 'setItem')"`. Stack: `WorkspaceEntry.tsx:15` → `chatStore.reset` (chatStore.ts:195) → zustand persist `setItem`. Evidence: `evidence/q2-attempt-001/q2-3/attempt2-qa-jest.log` / `.json`.
- **Mechanism:** the new handler `void logout().finally(() => { useChatStore.getState().reset(); router.push('/auth'); })` calls the inherited no-storage persist defect (class C) **before** navigation, so the throw skips `push`. Server logout already succeeded; the user stays on the workspace (now with no identity). Demo/new state is still cleared by the identity remount.
- **Not affected:** server render (no setter during SSR; 5/5 queries pass, `qa_entry_ssr.test.tsx`). The normal-storage sign-out order is verified (logout → reset → /auth).
- **Smallest suggested scope (Architect decides):** `src/components/workspace/WorkspaceEntry.tsx` sign-out ordering/guard (phase-000 new code), and/or the protected `src/store/chatStore.ts` storage guard (APBM_001).
- **Uncertainty:** how often real browsers expose a throwing storage getter on this site; the jsdom simulation matches the maintained F5 test's condition.
