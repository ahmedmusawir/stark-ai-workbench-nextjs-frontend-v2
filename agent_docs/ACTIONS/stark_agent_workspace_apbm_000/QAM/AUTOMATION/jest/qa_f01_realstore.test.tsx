/** @jest-environment jsdom */
// QA F01 / AC000-13 (attempt-002, plan v0.3 §3): sign-out through the production WorkspaceEntry with the REAL auth and chat stores,
// in normal / storage-getter-throws / storage-write-throws modes. Prior-user data is seeded, the mocked HTTP logout is completed
// explicitly, and the test asserts in-memory user/chat/draft/demo clearing, exactly one /auth navigation, no unhandled rejection and no
// store write during render. Roots, listeners, spies and fetch are disposed deterministically even on failure.
// Mocked HTTP logout success does NOT establish real server logout or token revocation.
const nav = { push: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: nav.push }), useSearchParams: () => new URLSearchParams('agent=greeting_agent') }));
jest.mock('@/services/chatService', () => ({ chatService: { sendMessage: jest.fn(), getHistory: jest.fn() } }));
jest.mock('@/services/sessionIndexService', () => ({ titleFromMessage: (m: string) => m, sessionIndexService: {
  listSessions: jest.fn(async () => []), createSession: jest.fn(), touchSession: jest.fn(), renameSession: jest.fn(), archiveSession: jest.fn() } }));
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import type { ComponentType } from 'react';

type Mode = 'normal' | 'getter-throws' | 'write-throws';
const flush = () => new Promise(r => setTimeout(r, 0));

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} }) });
});

test.each<Mode>(['normal', 'getter-throws', 'write-throws'])('F01 %s: real stores cleared, one /auth navigation, no rejection, no render-time setter', async mode => {
  const disposers: Array<() => void> = [];
  const unhandled: string[] = []; let fetchCalls: unknown[] = [];
  try {
    nav.push.mockReset(); window.localStorage.clear(); document.body.innerHTML = '';
    if (mode === 'getter-throws') {
      const g = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('QA: storage blocked', 'SecurityError'); });
      const w = jest.spyOn(console, 'warn').mockImplementation(() => {}); // the store's existing no-storage fallback warns per setter
      disposers.push(() => g.mockRestore(), () => w.mockRestore());
    }
    let finishLogout!: () => void;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = ((...args: unknown[]) => { fetchCalls.push(args); return new Promise(res => { finishLogout = () => res({ ok: true, json: async () => ({}) } as Response); }); }) as typeof fetch;
    disposers.push(() => { globalThis.fetch = originalFetch; });
    const onWin = (e: PromiseRejectionEvent) => unhandled.push('window:' + String(e.reason));
    const onNode = (r: unknown) => unhandled.push('node:' + String(r));
    window.addEventListener('unhandledrejection', onWin); process.on('unhandledRejection', onNode);
    disposers.push(() => window.removeEventListener('unhandledrejection', onWin), () => { process.off('unhandledRejection', onNode); });

    let mods!: { React: typeof import('react'); createRoot: typeof import('react-dom/client').createRoot; WorkspaceEntry: ComponentType;
      useChatStore: typeof import('@/store/chatStore').useChatStore; useAuthStore: typeof import('@/store/useAuthStore').useAuthStore };
    jest.isolateModules(() => {
      mods = { React: require('react'), createRoot: require('react-dom/client').createRoot, WorkspaceEntry: require('@/components/workspace/WorkspaceEntry').WorkspaceEntry,
        useChatStore: require('@/store/chatStore').useChatStore, useAuthStore: require('@/store/useAuthStore').useAuthStore };
    });
    const { React, createRoot, WorkspaceEntry, useChatStore, useAuthStore } = mods;
    // Seed prior-user data in both real stores.
    useAuthStore.setState({ user: { id: 'qa-prior-user' }, role: 'member', isAuthenticated: true, isLoading: false });
    useChatStore.setState({ agentSessions: { greeting_agent: 'qa-prior-session' }, messagesByAgent: { greeting_agent: [{ role: 'user', content: 'QA prior message' }] } as never,
      sessionListByAgent: { greeting_agent: [{ id: 'qa-prior-row', sessionId: 'qa-prior-session' }] } as never, error: 'QA prior error' });
    if (mode === 'write-throws') {
      const s = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('QA: quota', 'QuotaExceededError'); });
      disposers.push(() => s.mockRestore());
    }
    // No store write during render: count writes across the initial render.
    let renderWrites = 0; const u1 = useChatStore.subscribe(() => { renderWrites++; }), u2 = useAuthStore.subscribe(() => { renderWrites++; });
    const host = document.createElement('div'); document.body.appendChild(host); const root = createRoot(host);
    disposers.unshift(() => { React.act(() => root.unmount()); host.remove(); }); // unmount first during disposal
    await React.act(async () => { root.render(React.createElement(WorkspaceEntry)); });
    u1(); u2(); expect(renderWrites).toBe(0);

    await React.act(async () => { fireEvent.change(screen.getByLabelText('Start a new conversation'), { target: { value: 'QA prior draft' } }); });
    await React.act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Edit demo instructions' })); });
    await React.act(async () => { fireEvent.change(screen.getByLabelText('Demo instructions'), { target: { value: 'QA prior demo' } }); });
    await React.act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Apply to demo' })); });
    expect(screen.getByText('QA prior demo')).toBeTruthy(); expect((screen.getByLabelText('Start a new conversation') as HTMLTextAreaElement).value).toBe('QA prior draft');

    await React.act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Sign out' })[0]); });
    expect(fetchCalls).toEqual([['/api/auth/logout', { method: 'POST' }]]);
    expect(nav.push).not.toHaveBeenCalled(); // navigation waits for the logout outcome
    await React.act(async () => { finishLogout(); await flush(); });
    await waitFor(() => expect(nav.push).toHaveBeenCalledTimes(1));
    await React.act(async () => { await flush(); await flush(); });
    expect(nav.push.mock.calls).toEqual([['/auth']]);
    expect(useAuthStore.getState()).toMatchObject({ user: null, role: null, isAuthenticated: false });
    const chat = useChatStore.getState();
    expect([chat.agentSessions, chat.messagesByAgent, chat.sessionListByAgent, chat.error]).toEqual([{}, {}, {}, null]);
    expect(screen.queryByText('QA prior demo')).toBeNull();
    const composer = screen.queryByLabelText('Start a new conversation') as HTMLTextAreaElement | null; expect(composer?.value ?? '').toBe('');
    expect(unhandled).toEqual([]);
    if (mode === 'normal') expect(window.localStorage.getItem('adk-session-map-mock') ?? '').not.toContain('qa-prior');
    console.log('QA_F01_RESULT ' + JSON.stringify({ mode, pushes: nav.push.mock.calls, unhandled, renderWrites }));
  } finally {
    for (const d of disposers) { try { d(); } catch (e) { console.error('QA disposer failed', e); } }
    fetchCalls = [];
  }
});
