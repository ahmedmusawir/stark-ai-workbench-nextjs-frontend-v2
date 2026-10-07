/** @jest-environment jsdom */
// QA J-13 (identity partition, sign-out lifecycle) + class-C seam with the REAL chatStore. Workspace is captured, not rendered.
const nav = { push: jest.fn(), query: 'agent=greeting_agent' };
const auth: { user: unknown; logout: jest.Mock } = { user: { id: 'u1' }, logout: jest.fn() };
const seen: Array<Record<string, unknown>> = [];
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: nav.push }), useSearchParams: () => new URLSearchParams(nav.query) }));
jest.mock('@/store/useAuthStore', () => ({ useAuthStore: (sel: (s: unknown) => unknown) => sel(auth) }));
jest.mock('@/services/chatService', () => ({ chatService: { sendMessage: jest.fn(), getHistory: jest.fn() } }));
jest.mock('@/services/sessionIndexService', () => ({ titleFromMessage: (m: string) => m, sessionIndexService: { listSessions: jest.fn(), createSession: jest.fn(), touchSession: jest.fn(), renameSession: jest.fn(), archiveSession: jest.fn() } }));
jest.mock('@/components/workspace/Workspace', () => ({ Workspace: (p: Record<string, unknown>) => { seen.push(p); return null; } }));

import { render } from '@testing-library/react';
import { WorkspaceEntry } from '@/components/workspace/WorkspaceEntry';
import { useChatStore } from '@/store/chatStore';

const last = () => seen[seen.length - 1];
beforeEach(() => { seen.length = 0; nav.push.mockReset(); auth.logout.mockReset(); auth.user = { id: 'u1' }; delete process.env.NEXT_PUBLIC_CHAT_MODE; });

test('J-13 identityKey partitions by user and chat mode; canOperate follows user context', () => {
  render(<WorkspaceEntry />); const a = last();
  auth.user = { id: 'u2' }; render(<WorkspaceEntry />); const b = last();
  auth.user = { id: 'u1' }; render(<WorkspaceEntry />); const a2 = last();
  process.env.NEXT_PUBLIC_CHAT_MODE = 'live'; render(<WorkspaceEntry />); const live = last();
  auth.user = null; render(<WorkspaceEntry />); const none = last();
  expect(a.identityKey).not.toEqual(b.identityKey); expect(a.identityKey).toEqual(a2.identityKey); expect(live.identityKey).not.toEqual(a.identityKey);
  expect(none.identityKey).not.toEqual(a.identityKey); expect([a.canOperate, none.canOperate]).toEqual([true, false]);
  expect(String(a.identityKey)).toContain('"v1"'); // roster backend dimension is part of the key (source: agents.map([id, backendId]))
  expect(a.query).toBe('agent=greeting_agent');
});

test('J-13 sign-out: logout -> real store reset -> /auth, in that order; no store write during render', async () => {
  const order: string[] = [];
  useChatStore.getState().setSession('greeting_agent', 'S-before');
  auth.logout.mockImplementation(async () => { order.push('logout'); });
  nav.push.mockImplementation((u: string) => order.push(`push:${u}`));
  let writesDuringRender = 0; const unsub = useChatStore.subscribe(() => { writesDuringRender++; });
  render(<WorkspaceEntry />); const renderWrites = writesDuringRender; unsub();
  const un2 = useChatStore.subscribe(s => { if (!Object.keys(s.agentSessions).length) order.push('reset'); });
  (last().onSignOut as () => void)(); await new Promise(r => setTimeout(r, 0)); un2();
  expect(renderWrites).toBe(0); expect(order).toEqual(['logout', 'reset', 'push:/auth']);
});

test('CLASS C seam (real store, storage getter throws): sign-out must still navigate to /auth', async () => {
  const spy = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new ReferenceError('storage unavailable'); });
  const result: { renderThrew?: string; resetThrew?: string; pushed: string[]; rendered: boolean } = { pushed: [], rendered: false };
  let isolatedOnSignOut: (() => void) | undefined;
  try {
    jest.isolateModules(() => {
      const React = require('react'); const { createRoot } = require('react-dom/client');
      const { WorkspaceEntry: E } = require('@/components/workspace/WorkspaceEntry');
      const { useChatStore: store } = require('@/store/chatStore');
      const before = seen.length;
      nav.push.mockImplementation((u: string) => result.pushed.push(u)); auth.logout.mockResolvedValue(undefined);
      try { React.act(() => { createRoot(document.createElement('div')).render(React.createElement(E)); }); } catch (e) { result.renderThrew = String(e); }
      result.rendered = seen.length > before; isolatedOnSignOut = seen[seen.length - 1].onSignOut as () => void;
      try { store.getState().reset(); } catch (e) { result.resetThrew = String(e); } // direct real-store probe, no-storage case
    });
    const rejections: string[] = []; const h = (e: unknown) => rejections.push(String(e)); process.on('unhandledRejection', h);
    isolatedOnSignOut!(); await new Promise(r => setTimeout(r, 50)); process.off('unhandledRejection', h);
    console.log('CLASS_C_SEAM_RESULT ' + JSON.stringify({ ...result, unhandledRejections: rejections }));
  } finally { spy.mockRestore(); }
  expect(result.rendered).toBe(true); expect(result.renderThrew).toBeUndefined();
  expect(result.pushed).toEqual(['/auth']);
});
