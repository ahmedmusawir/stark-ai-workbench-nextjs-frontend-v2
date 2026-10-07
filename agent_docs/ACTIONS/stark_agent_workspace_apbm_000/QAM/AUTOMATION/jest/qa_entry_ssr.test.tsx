/** @jest-environment node */
// QA class-C non-impact: server render (no window -> chatStore storage unavailable) of the production entry with the REAL store.
const nav = { query: '' };
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }), useSearchParams: () => new URLSearchParams(nav.query) }));
jest.mock('@/store/useAuthStore', () => ({ useAuthStore: (sel: (s: unknown) => unknown) => sel({ user: { id: 'u1' }, logout: jest.fn() }) }));
jest.mock('@/services/chatService', () => ({ chatService: { sendMessage: jest.fn(), getHistory: jest.fn() } }));
jest.mock('@/services/sessionIndexService', () => ({ titleFromMessage: (m: string) => m, sessionIndexService: { listSessions: jest.fn(), createSession: jest.fn(), touchSession: jest.fn(), renameSession: jest.fn(), archiveSession: jest.fn() } }));
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { WorkspaceEntry } from '@/components/workspace/WorkspaceEntry';
import { useChatStore } from '@/store/chatStore';
import { chatService } from '@/services/chatService';
import { sessionIndexService } from '@/services/sessionIndexService';

test.each(['', 'agent=greeting_agent', 'agent=greeting_agent&new=1', 'agent=greeting_agent&session=S1', 'agent=bad'])(
  'SSR of /chat?%s: no window, no store write, no service call, no throw', (q) => {
    expect(typeof window).toBe('undefined');
    nav.query = q; let writes = 0; const un = useChatStore.subscribe(() => { writes++; });
    const html = renderToString(createElement(WorkspaceEntry)); un();
    expect(html.length).toBeGreaterThan(100); expect(writes).toBe(0);
    for (const f of [chatService.sendMessage, chatService.getHistory, ...Object.values(sessionIndexService)]) expect(f).not.toHaveBeenCalled();
  });
