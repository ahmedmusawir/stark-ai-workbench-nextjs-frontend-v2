/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import * as mockReact from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockServices = {
  list: jest.fn(async () => ({ status: 'ready', rows: [] })),
  history: jest.fn(async () => ({ status: 'ready', messages: [] })),
  create: jest.fn(), send: jest.fn(),
};
// APBM001: the workspace identity is the server-verified descriptor user.
const mockDescriptor = { user: { id: 'server-user', email: null }, mode: 'mock', supabase_ref: null, roster_checked_at: null, agents: [] };
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams('agent=jarvis_agent'),
}));
jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'dark', setTheme: jest.fn() }) }));
jest.mock('@/components/workspace/productionAdapter', () => ({
  createProductionWorkspaceServices: () => mockServices,
  loadWorkspaceDescriptor: async () => ({ status: 'ready', descriptor: mockDescriptor }),
  workspaceAgentsFor: () => jest.requireActual('@/config/manifest').workspaceAgentsForUi(),
}));
jest.mock('@/app/(cyberize)/chat/MessageBubble', () => ({ MessageBubble: () => null }));

describe('WorkspaceEntry sign-out with the real auth and chat stores', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    // Module isolation must retain the renderer's React instance. Stores and
    // WorkspaceEntry themselves are real, freshly initialized modules.
    jest.doMock('react', () => mockReact);
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
      matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }) });
  });

  afterEach(() => { jest.restoreAllMocks(); });

  it.each(['normal', 'getter throws', 'write throws'] as const)(
    '%s: sign-out hides user/chat/draft/demo immediately, clears stores, keeps unresolved recovery records, and navigates without a rejection',
    async storageMode => {
      if (storageMode === 'getter throws') {
        jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
          throw new DOMException('Site storage blocked', 'SecurityError');
        });
        // The real store's existing in-memory fallback warns on every setter.
        jest.spyOn(console, 'warn').mockImplementation(() => {});
      }
      const { useChatStore } = require('@/store/chatStore');
      const { useAuthStore } = require('@/store/useAuthStore');
      const { WorkspaceEntry } = require('@/components/workspace/WorkspaceEntry');
      const { DEFAULT_AGENT } = require('@/config/manifest');
      const { JOURNAL_KEY } = require('@/components/workspace/recoveryJournal');
      const unresolved = JSON.stringify([{ v: 1, op: 'op-1', user: 'server-user', mode: 'mock', backend: 'k', agent: 'jarvis_agent', session: 's-1', stage: 'uncertain', at: 1 }]);
      if (storageMode === 'normal') localStorage.setItem(JOURNAL_KEY, unresolved);
      useAuthStore.setState({ user: { id: 'prior-user' }, role: 'member', isAuthenticated: true, isLoading: false });
      useChatStore.setState({
        selectedAgent: 'jarvis_agent', lastSelectedAgent: 'greeting_agent',
        messagesByAgent: { jarvis_agent: [{ role: 'user', content: 'Prior-user message' }] },
        agentSessions: { jarvis_agent: 'prior-session' },
        sessionListByAgent: { jarvis_agent: [{ id: 'prior-row', sessionId: 'prior-session' }] },
        isLoading: true, isHistoryLoading: true, error: 'Prior error',
      });
      const hydrated = useChatStore.getState()._hasHydrated;
      if (storageMode === 'write throws') {
        // Fail both stores' persistence AFTER prior-user state has been seeded.
        // The HTTP seam still succeeds; the real auth store clears before its
        // persistence write rejects, and the entry must handle that rejection.
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
        });
      }
      let finishLogout!: (value: { ok: boolean }) => void;
      const mockFetch = jest.fn(() => new Promise(resolve => { finishLogout = resolve; }));
      const originalFetch = globalThis.fetch;
      globalThis.fetch = mockFetch as unknown as typeof fetch;
      const unhandled: unknown[] = [];
      const onRejection = (event: PromiseRejectionEvent) => { unhandled.push(event.reason); };
      const onNodeRejection = (reason: unknown) => { unhandled.push(reason); };
      window.addEventListener('unhandledrejection', onRejection);
      process.on('unhandledRejection', onNodeRejection);
      try {
        await act(async () => { render(<WorkspaceEntry />); });
        fireEvent.change(screen.getByLabelText('Start a new conversation'), { target: { value: 'Prior-user draft' } });
        fireEvent.click(screen.getByRole('button', { name: 'Edit demo instructions' }));
        fireEvent.change(await screen.findByLabelText('Demo instructions'), { target: { value: 'Prior-user demo' } });
        fireEvent.click(screen.getByRole('button', { name: 'Apply to demo' }));
        expect(await screen.findByText('Prior-user demo')).toBeInTheDocument();

        // A stale browser auth label is relabelled to the server-verified user.
        expect(useAuthStore.getState().user).toMatchObject({ id: 'server-user' });
        fireEvent.click(screen.getAllByRole('button', { name: 'Sign out' })[0]);
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
        expect(mockPush).not.toHaveBeenCalled();
        // Visible data is gone before the logout request even settles.
        expect(screen.getByText('Signing out…')).toBeInTheDocument();
        expect(screen.queryByText('Prior-user demo')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Start a new conversation')).not.toBeInTheDocument();
        expect(useChatStore.getState().agentSessions).toEqual({ jarvis_agent: 'prior-session' });
        await act(async () => { finishLogout({ ok: true }); });
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/auth'));
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(useAuthStore.getState()).toMatchObject({ user: null, role: null, isAuthenticated: false });
        expect(useChatStore.getState()).toMatchObject({
          selectedAgent: DEFAULT_AGENT, lastSelectedAgent: null,
          messagesByAgent: {}, agentSessions: {}, sessionListByAgent: {},
          isLoading: false, isHistoryLoading: false, error: null,
          _hasHydrated: hydrated,
        });
        expect(screen.queryByLabelText('Start a new conversation')).not.toBeInTheDocument();
        expect(screen.queryByText('Prior-user demo')).not.toBeInTheDocument();
        if (storageMode === 'normal') {
          // Unresolved same-user warnings are not discarded to make a later login look clean.
          expect(localStorage.getItem(JOURNAL_KEY)).toBe(unresolved);
          expect(JSON.parse(localStorage.getItem('adk-session-map-mock')!).state)
            .toEqual({ selectedAgent: DEFAULT_AGENT, agentSessions: {} });
          expect(localStorage.getItem('adk-session-map-mock')).not.toContain('Prior-user');
        }
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
        expect(unhandled).toEqual([]);
      } finally {
        globalThis.fetch = originalFetch;
        window.removeEventListener('unhandledrejection', onRejection);
        process.off('unhandledRejection', onNodeRejection);
      }
    },
  );
});
