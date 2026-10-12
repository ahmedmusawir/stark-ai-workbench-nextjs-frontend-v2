/** @jest-environment jsdom */
// QA J-07 / J-08 with the REAL Workspace rendered through the production WorkspaceEntry + mocked existing services.
const nav = { push: jest.fn(), query: '' };
const auth: { user: unknown; logout: jest.Mock } = { user: { id: 'u1' }, logout: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: nav.push }), useSearchParams: () => new URLSearchParams(nav.query) }));
jest.mock('@/store/useAuthStore', () => ({ useAuthStore: (sel: (s: unknown) => unknown) => sel(auth) }));
jest.mock('@/services/chatService', () => ({ chatService: { sendMessage: jest.fn(), getHistory: jest.fn() } }));
jest.mock('@/services/sessionIndexService', () => ({ titleFromMessage: (m: string) => m, sessionIndexService: { listSessions: jest.fn(), createSession: jest.fn(), touchSession: jest.fn(), renameSession: jest.fn(), archiveSession: jest.fn() } }));
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { WorkspaceEntry } from '@/components/workspace/WorkspaceEntry';
import { chatService } from '@/services/chatService';
import { sessionIndexService } from '@/services/sessionIndexService';
const chat = jest.mocked(chatService), idx = jest.mocked(sessionIndexService);
const writes = () => chat.sendMessage.mock.calls.length + idx.createSession.mock.calls.length + idx.touchSession.mock.calls.length + idx.renameSession.mock.calls.length + idx.archiveSession.mock.calls.length;
beforeAll(() => { window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as never; });
beforeEach(() => { jest.resetAllMocks(); auth.user = { id: 'u1' }; idx.listSessions.mockResolvedValue([] as never); });

test('J-07 draft view mounts without create/run; only a catalogue read', async () => {
  nav.query = 'agent=greeting_agent&new=1'; render(<WorkspaceEntry />);
  await waitFor(() => expect(idx.listSessions).toHaveBeenCalledWith('greeting_agent'));
  expect(writes()).toBe(0); expect(chat.getHistory).not.toHaveBeenCalled();
  expect(screen.getByText('Chat with Greeting Agent')).toBeInTheDocument();
});
test('J-08 no user: zero service calls; workspace shows user-context copy; conversation shows access-unavailable and disables sending', async () => {
  auth.user = null; nav.query = 'agent=jarvis_agent'; const { unmount } = render(<WorkspaceEntry />);
  expect(await screen.findByText('User context unavailable. Sign in to load conversations.')).toBeInTheDocument(); unmount();
  nav.query = 'agent=jarvis_agent&session=S1'; render(<WorkspaceEntry />);
  expect(await screen.findByText('Conversation access unavailable')).toBeInTheDocument();
  expect(screen.getByLabelText('Message')).toBeDisabled();
  await new Promise(r => setTimeout(r, 20));
  expect(writes() + chat.getHistory.mock.calls.length + idx.listSessions.mock.calls.length).toBe(0);
});
test('J-03 invalid selector through the real entry: unavailable state, zero service calls', async () => {
  nav.query = 'agent=jarvis_agent&new=1&session=x'; render(<WorkspaceEntry />);
  expect(await screen.findByText('Workspace unavailable')).toBeInTheDocument();
  await new Promise(r => setTimeout(r, 20)); expect(idx.listSessions).not.toHaveBeenCalled(); expect(writes()).toBe(0);
});
