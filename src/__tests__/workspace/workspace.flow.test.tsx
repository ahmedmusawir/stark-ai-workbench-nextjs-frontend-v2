/** @jest-environment jsdom */
/**
 * APBM001 workspace behaviour (AC008, AC013–AC021) against controllable
 * service doubles. Each double records call order so "before any network
 * write" and "no resend/no recreate" are asserted, not assumed.
 */
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useState } from 'react';
import { Workspace } from '@/components/workspace/Workspace';
import { JOURNAL_KEY } from '@/components/workspace/recoveryJournal';
import type { Catalogue, CreateResult, SendResult, Thread, WorkspaceAgent, WorkspaceServices } from '@/components/workspace/types';

jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'dark', setTheme: jest.fn() }) }));
jest.mock('@/app/(cyberize)/chat/MessageBubble', () => ({ MessageBubble: ({ message }: { message: { content: string } }) => <p>{message.content}</p> }));

const KEY = '0123456789abcdef';
const OTHER_KEY = 'fedcba9876543210';
const SCOPE = { user: 'server-user', mode: 'live' };
const agents: WorkspaceAgent[] = [
  { id: 'atlas', name: 'Atlas', backendId: 'v1', backendKey: KEY, availability: 'available' },
  { id: 'moose', name: 'Moose', backendId: 'v1', backendKey: KEY, availability: 'unavailable' },
];
const rows: Catalogue = { status: 'ready', rows: [
  { id: `${KEY}:s-a`, sessionId: 's-a', title: 'Conversation A', createdAt: '2026-10-14T10:00:00Z' },
  { id: `${KEY}:s-b`, sessionId: 's-b', title: 'Conversation B', createdAt: '2026-10-13T10:00:00Z' },
] };

interface Deferred<T> { promise: Promise<T>; resolve(value: T): void }
const deferred = <T,>(): Deferred<T> => { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; };

function makeServices(overrides: Partial<WorkspaceServices> = {}) {
  const log: string[] = [];
  const services: WorkspaceServices = {
    list: jest.fn(async (agent: string) => { log.push(`list:${agent}`); return rows; }),
    history: jest.fn(async (_agent: string, session: string) => { log.push(`history:${session}`); return { status: 'ready', messages: [{ role: 'user', content: `Question ${session}` }, { role: 'assistant', content: `Answer ${session}` }] } as Thread; }),
    create: jest.fn(async (_agent: string, session: string): Promise<CreateResult> => { log.push(`create:${session}`); return { status: 'created' }; }),
    send: jest.fn(async (_agent: string, session: string, message: string): Promise<SendResult> => { log.push(`send:${session}`); return { status: 'sent', reply: `Reply to ${message}` }; }),
    ...overrides,
  };
  return { services, log };
}

let navigations: Array<{ query: string; replace: boolean }> = [];
let setQueryFromTest: (q: string) => void = () => {};
function Harness({ services, initial, agentList = agents }: { services: WorkspaceServices; initial: string; agentList?: WorkspaceAgent[] }) {
  const [query, setQuery] = useState(initial);
  setQueryFromTest = setQuery;
  return <Workspace identityKey="server-user" scope={SCOPE} agents={agentList} services={services} query={query} navigate={(next, options) => { navigations.push({ query: next, replace: !!options?.replace }); setQuery(next); }}/>;
}
const desktopNav = () => screen.getByRole('navigation', { name: 'Workspace navigation' });
const journal = () => JSON.parse(localStorage.getItem(JOURNAL_KEY) ?? '[]');
const type = (text: string) => fireEvent.change(screen.getAllByLabelText(/Message|Start a new conversation/)[0], { target: { value: text } });
const clickSend = () => fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

beforeEach(() => {
  localStorage.clear(); navigations = []; jest.restoreAllMocks();
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }) });
});

test('AC013: draft and conversation views keep the selected agent\'s conversations in the sidebar', async () => {
  const { services } = makeServices();
  render(<Harness services={services} initial="agent=atlas&new=d00000001"/>);
  expect(await within(desktopNav()).findByRole('link', { name: 'Conversation A' })).toBeInTheDocument();
  expect(within(desktopNav()).getByRole('link', { name: 'Conversation B' })).toHaveAttribute('href', `/chat?agent=atlas&session=s-b&bk=${KEY}`);
  fireEvent.click(within(desktopNav()).getByRole('button', { name: 'New chat' }));
  expect(navigations.at(-1)!.query).toMatch(/^agent=atlas&new=d[0-9a-f]{8}$/);
  expect(navigations.at(-1)!.query).not.toBe('agent=atlas&new=d00000001');
  expect(within(desktopNav()).getByRole('link', { name: 'Conversation A' })).toBeInTheDocument();
  fireEvent.click(within(desktopNav()).getByRole('link', { name: 'Conversation B' }));
  expect(await screen.findByText('Answer s-b')).toBeInTheDocument();
  expect(within(desktopNav()).getByRole('link', { name: 'Conversation B' })).toHaveAttribute('aria-current', 'page');
});

test('AC021: rename/archive/delete controls and the archive promise are gone; dates are creation dates', async () => {
  const { services } = makeServices();
  render(<Harness services={services} initial="agent=atlas"/>);
  expect(await screen.findAllByText('Conversation A')).not.toHaveLength(0);
  expect(screen.queryByRole('button', { name: /Actions for/ })).toBeNull();
  expect(document.body.textContent).not.toMatch(/archive|rename|delete/i);
  expect(screen.getAllByText(/^Started /)).toHaveLength(2);
});

test('AC008: first send allocates a UUID, records it and navigates before any network write; create once, then one run', async () => {
  const createGate = deferred<CreateResult>();
  let journalAtCreate: unknown[] = []; let navigationAtCreate = 0;
  const { services, log } = makeServices({
    create: jest.fn(async (_agent: string, session: string) => { journalAtCreate = journal(); navigationAtCreate = navigations.length; log.push(`create:${session}`); return createGate.promise; }),
  });
  render(<Harness services={services} initial="agent=atlas&new=d00000001"/>);
  await screen.findAllByText('Conversation A');
  type('Hello   there\nfriend');
  clickSend(); clickSend();
  await waitFor(() => expect(services.create).toHaveBeenCalledTimes(1));
  const sessionId = (services.create as jest.Mock).mock.calls[0][1];
  expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  expect((services.create as jest.Mock).mock.calls[0][2]).toBe('Hello   there\nfriend');
  expect(navigationAtCreate).toBe(1);
  expect(navigations[0]).toEqual({ query: `agent=atlas&session=${sessionId}&bk=${KEY}`, replace: true });
  expect(journalAtCreate).toEqual([expect.objectContaining({ session: sessionId, stage: 'create', draft: 'd00000001', user: 'server-user', backend: KEY })]);
  expect(JSON.stringify(journalAtCreate)).not.toContain('Hello');
  expect(services.send).not.toHaveBeenCalled();
  await act(async () => createGate.resolve({ status: 'created' }));
  expect(await screen.findByText(/^Reply to Hello\s+there\s+friend$/)).toBeInTheDocument();
  expect(services.send).toHaveBeenCalledTimes(1);
  expect(log.filter(entry => !entry.startsWith('list'))).toEqual([`create:${sessionId}`, `send:${sessionId}`]);
  expect(journal()).toEqual([]);
  expect(services.history).not.toHaveBeenCalled();
});

test('AC014: back to a consumed draft resolves to its conversation, never a blank or previous transcript', async () => {
  const { services } = makeServices();
  render(<Harness services={services} initial="agent=atlas&new=d00000001"/>);
  await screen.findAllByText('Conversation A');
  type('Draft message'); clickSend();
  const target = await waitFor(() => { const q = navigations[0]?.query; expect(q).toBeDefined(); return q!; });
  await screen.findByText('Reply to Draft message');
  act(() => setQueryFromTest('agent=atlas&new=d00000001'));
  await waitFor(() => expect(navigations.at(-1)).toEqual({ query: target, replace: true }));
  expect(screen.getByText('Reply to Draft message')).toBeInTheDocument();
  expect(services.create).toHaveBeenCalledTimes(1);
});

test('AC016/AC017/AC018: create confirmed + run uncertain survives reload; Check history never resends; explicit acknowledgement only after a successful read', async () => {
  const first = makeServices({ send: jest.fn(async () => ({ status: 'uncertain' }) as SendResult) });
  const view = render(<Harness services={first.services} initial="agent=atlas&new=d00000001"/>);
  await screen.findAllByText('Conversation A');
  type('Marker cobalt'); clickSend();
  expect(await screen.findByRole('heading', { name: 'Send outcome unknown' })).toBeInTheDocument();
  expect(screen.getByText('We could not confirm the last send. Check the conversation before sending again.')).toBeInTheDocument();
  expect(screen.getByLabelText('Message')).toBeDisabled();
  const sessionId = (first.services.create as jest.Mock).mock.calls[0][1];
  expect(journal()).toEqual([expect.objectContaining({ session: sessionId, stage: 'uncertain' })]);
  expect(localStorage.getItem(JOURNAL_KEY)).not.toContain('cobalt');
  expect(first.services.list).toHaveBeenCalledTimes(2); // the created session is re-listed
  view.unmount();

  // Reload: history read is evidence only.
  const historyGate = deferred<Thread>();
  const second = makeServices({ list: jest.fn(async () => ({ status: 'empty', rows: [] }) as Catalogue), history: jest.fn(() => historyGate.promise) });
  render(<Harness services={second.services} initial={`agent=atlas&session=${sessionId}&bk=${KEY}`}/>);
  expect(await within(desktopNav()).findByRole('link', { name: `Unconfirmed conversation ${sessionId.slice(0, 8)}` })).toBeInTheDocument();
  await act(async () => historyGate.resolve({ status: 'unavailable', messages: [] }));
  expect(await screen.findByRole('heading', { name: 'Send outcome unknown' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'I reviewed the history — continue' })).toBeNull();
  (second.services.history as jest.Mock).mockResolvedValueOnce({ status: 'ready', messages: [{ role: 'user', content: 'Marker cobalt' }, { role: 'assistant', content: 'ACK cobalt' }] });
  fireEvent.click(screen.getByRole('button', { name: 'Check history' }));
  expect(await screen.findByText('ACK cobalt')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Send outcome unknown' })).toBeInTheDocument();
  expect(screen.getByLabelText('Message')).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'I reviewed the history — continue' }));
  expect(screen.queryByRole('heading', { name: 'Send outcome unknown' })).toBeNull();
  expect(screen.getByLabelText('Message')).not.toBeDisabled();
  expect(journal()).toEqual([]);
  expect(second.services.send).not.toHaveBeenCalled();
  expect(second.services.create).not.toHaveBeenCalled();
});

test('AC016: a lost create response keeps the UUID locatable; a missing read is not recreated', async () => {
  const first = makeServices({ create: jest.fn(async () => ({ status: 'uncertain' }) as CreateResult) });
  const view = render(<Harness services={first.services} initial="agent=atlas"/>);
  await screen.findAllByText('Conversation A');
  type('Lost create'); clickSend();
  expect(await screen.findByRole('heading', { name: 'Send outcome unknown' })).toBeInTheDocument();
  expect(navigations[0].replace).toBe(false);
  const sessionId = (first.services.create as jest.Mock).mock.calls[0][1];
  expect(first.services.send).not.toHaveBeenCalled();
  view.unmount();
  const second = makeServices({ list: jest.fn(async () => ({ status: 'empty', rows: [] }) as Catalogue), history: jest.fn(async () => ({ status: 'missing', messages: [] }) as Thread) });
  render(<Harness services={second.services} initial="agent=atlas"/>);
  const row = await screen.findByRole('link', { name: new RegExp(`Unconfirmed conversation ${sessionId.slice(0, 8)}`) });
  expect(within(row).getByText('Send not confirmed')).toBeInTheDocument();
  fireEvent.click(row);
  expect(await screen.findByText('This conversation was not found. Nothing will be resent.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'I reviewed the history — continue' }));
  expect(screen.getByRole('heading', { name: 'Conversation not found' })).toBeInTheDocument();
  expect(screen.getByLabelText('Message')).toBeDisabled();
  expect(second.services.create).not.toHaveBeenCalled();
  expect(second.services.send).not.toHaveBeenCalled();
});

test('known UUID survives a definitive create failure: the next deliberate send re-creates the SAME ID', async () => {
  const create = jest.fn().mockResolvedValueOnce({ status: 'not-sent' }).mockResolvedValueOnce({ status: 'created' });
  const { services } = makeServices({ create });
  render(<Harness services={services} initial="agent=atlas&new=d00000001"/>);
  await screen.findAllByText('Conversation A');
  type('Try once'); clickSend();
  expect(await screen.findByRole('heading', { name: 'Message not sent' })).toBeInTheDocument();
  expect(screen.getByLabelText('Message')).toHaveValue('Try once');
  expect(journal()).toEqual([]);
  clickSend();
  expect(await screen.findByText('Reply to Try once')).toBeInTheDocument();
  expect(create.mock.calls[1][1]).toBe(create.mock.calls[0][1]);
});

test('AC009: a missing session on continuation is surfaced with no create and no resend', async () => {
  const { services } = makeServices({ send: jest.fn(async () => ({ status: 'missing' }) as SendResult) });
  render(<Harness services={services} initial={`agent=atlas&session=s-a&bk=${KEY}`}/>);
  await screen.findByText('Answer s-a');
  type('Continue'); clickSend();
  expect(await screen.findByRole('heading', { name: 'Conversation not found' })).toBeInTheDocument();
  expect(services.create).not.toHaveBeenCalled();
  expect(services.send).toHaveBeenCalledTimes(1);
});

test('AC019: unavailable journal storage blocks the send before any network write; reading still works', async () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('quota', 'QuotaExceededError'); });
  const { services } = makeServices();
  render(<Harness services={services} initial={`agent=atlas&session=s-a&bk=${KEY}`}/>);
  expect(await screen.findByText('Answer s-a')).toBeInTheDocument();
  type('Not without a marker'); clickSend();
  expect(await screen.findByText(/could not save the recovery marker/)).toBeInTheDocument();
  expect(services.send).not.toHaveBeenCalled();
  expect(services.create).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Message')).toHaveValue('Not without a marker');
  fireEvent.click(within(desktopNav()).getByRole('link', { name: 'Conversation B' }));
  expect(await screen.findByText('Answer s-b')).toBeInTheDocument();
});

test('AC015: an obsolete history read is aborted and cannot paint the newly selected conversation', async () => {
  const gates: Record<string, Deferred<Thread>> = { 's-a': deferred(), 's-b': deferred() };
  const signals: Record<string, AbortSignal | undefined> = {};
  const { services } = makeServices({ history: jest.fn((_agent: string, session: string, signal?: AbortSignal) => { signals[session] = signal; return gates[session].promise; }) });
  render(<Harness services={services} initial={`agent=atlas&session=s-a&bk=${KEY}`}/>);
  await screen.findAllByText('Conversation A');
  fireEvent.click(within(desktopNav()).getByRole('link', { name: 'Conversation B' }));
  await waitFor(() => expect(signals['s-a']?.aborted).toBe(true));
  await act(async () => gates['s-b'].resolve({ status: 'ready', messages: [{ role: 'assistant', content: 'Only B' }] }));
  await act(async () => gates['s-a'].resolve({ status: 'ready', messages: [{ role: 'assistant', content: 'Late A' }] }));
  expect(screen.getByText('Only B')).toBeInTheDocument();
  expect(screen.queryByText('Late A')).toBeNull();
});

test('AC015: a send keeps its own conversation identity when the user navigates away mid-flight', async () => {
  const gate = deferred<SendResult>();
  const { services } = makeServices({ send: jest.fn(() => gate.promise) });
  render(<Harness services={services} initial={`agent=atlas&session=s-a&bk=${KEY}`}/>);
  await screen.findByText('Answer s-a');
  type('Slow message'); clickSend();
  fireEvent.click(within(desktopNav()).getByRole('link', { name: 'Conversation B' }));
  await screen.findByText('Answer s-b');
  await act(async () => gate.resolve({ status: 'uncertain' }));
  expect(screen.queryByRole('heading', { name: 'Send outcome unknown' })).toBeNull();
  expect(journal()).toEqual([expect.objectContaining({ session: 's-a', stage: 'uncertain' })]);
  fireEvent.click(within(desktopNav()).getByRole('link', { name: 'Conversation A' }));
  expect(await screen.findByRole('heading', { name: 'Send outcome unknown' })).toBeInTheDocument();
});

test('AC004: links without or with another backend key never open the session against this target', async () => {
  const { services } = makeServices();
  const view = render(<Harness services={services} initial="agent=atlas&session=s-a"/>);
  expect(await screen.findByRole('heading', { name: 'Confirm this conversation link' })).toBeInTheDocument();
  expect(services.history).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Open with the current service' }));
  expect(navigations.at(-1)).toEqual({ query: `agent=atlas&session=s-a&bk=${KEY}`, replace: true });
  expect(await screen.findByText('Answer s-a')).toBeInTheDocument();
  view.unmount();
  render(<Harness services={services} initial={`agent=atlas&session=s-a&bk=${OTHER_KEY}`}/>);
  expect(await screen.findByRole('heading', { name: 'Conversation link from another configuration' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Open with the current service' })).toBeNull();
  expect(services.history).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('Message')).toBeDisabled();
});

test('AC005: an unavailable agent is listed honestly and never reaches list/history/send', async () => {
  const { services } = makeServices();
  const view = render(<Harness services={services} initial=""/>);
  const card = within(screen.getByRole('main')).getByRole('link', { name: /Moose/ });
  expect(within(card).getByText('Not available on this agent service')).toBeInTheDocument();
  view.unmount();
  render(<Harness services={services} initial="agent=moose"/>);
  expect(screen.getByRole('heading', { name: 'Agent unavailable' })).toBeInTheDocument();
  expect(services.list).not.toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
});

test('AC020: a 26s initial list read stays loading, then renders; no retry loop', async () => {
  jest.useFakeTimers();
  try {
    const list = jest.fn(() => new Promise<Catalogue>(resolve => setTimeout(() => resolve(rows), 26_000)));
    const { services } = makeServices({ list });
    render(<Harness services={services} initial="agent=atlas"/>);
    await act(async () => { jest.advanceTimersByTime(25_000); });
    expect(screen.getByText('Loading conversations…')).toBeInTheDocument();
    await act(async () => { jest.advanceTimersByTime(1_000); });
    expect(screen.getAllByText('Conversation A').length).toBeGreaterThan(0);
    expect(list).toHaveBeenCalledTimes(1);
  } finally { jest.useRealTimers(); }
});

test('empty list is a fresh start; a failed list is unavailable with retry and never "fresh start"', async () => {
  const list = jest.fn().mockResolvedValueOnce({ status: 'unavailable', rows: [] }).mockResolvedValueOnce({ status: 'empty', rows: [] });
  const { services } = makeServices({ list });
  render(<Harness services={services} initial="agent=atlas"/>);
  expect(await screen.findByText('Conversations unavailable')).toBeInTheDocument();
  expect(screen.queryByText('A fresh start')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByText('A fresh start')).toBeInTheDocument();
});
