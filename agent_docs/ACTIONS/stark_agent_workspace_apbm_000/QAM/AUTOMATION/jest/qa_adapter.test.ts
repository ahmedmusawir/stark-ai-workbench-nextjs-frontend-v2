// QA J-09 / J-10 / J-11 / J-21 / DIRECTOR-OBS-001 (adapter seam). Independent of Engineer tests.
jest.mock('@/services/chatService', () => ({ chatService: { sendMessage: jest.fn(), getHistory: jest.fn() } }));
jest.mock('@/services/sessionIndexService', () => ({
  titleFromMessage: (m: string) => `T:${m.slice(0, 10)}`,
  sessionIndexService: { listSessions: jest.fn(), createSession: jest.fn(), touchSession: jest.fn(), renameSession: jest.fn(), archiveSession: jest.fn() },
}));
import { chatService } from '@/services/chatService';
import { sessionIndexService } from '@/services/sessionIndexService';
import { createProductionWorkspaceServices } from '@/components/workspace/productionAdapter';

const chat = jest.mocked(chatService), idx = jest.mocked(sessionIndexService);
const allCalls = () => ({ send: chat.sendMessage.mock.calls.length, hist: chat.getHistory.mock.calls.length, list: idx.listSessions.mock.calls.length,
  create: idx.createSession.mock.calls.length, touch: idx.touchSession.mock.calls.length, rename: idx.renameSession.mock.calls.length, archive: idx.archiveSession.mock.calls.length });
beforeEach(() => jest.resetAllMocks());

describe('J-09 send outcome classification', () => {
  test.each([
    ['legacy unreachable sentinel', { session_id: 's1', response: 'Error: Could not reach Agent Service. Details: x' }],
    ['legacy no-content sentinel', { session_id: 's1', response: 'Error: No response content.' }],
    ['missing session id', { session_id: '', response: 'looks fine' }],
  ])('%s -> uncertain, never sent/not-sent, no metadata write', async (_n, r) => {
    chat.sendMessage.mockResolvedValue(r as never);
    await expect(createProductionWorkspaceServices('u1').send('greeting_agent', null, 'hi')).resolves.toEqual({ status: 'uncertain' });
    expect(allCalls()).toMatchObject({ create: 0, touch: 0, list: 0 });
  });
  test('transport rejection propagates (Workspace maps rejection to uncertain; never not-sent)', async () => {
    chat.sendMessage.mockRejectedValue(new Error('timeout'));
    await expect(createProductionWorkspaceServices('u1').send('greeting_agent', null, 'hi')).rejects.toThrow('timeout');
    expect(allCalls()).toMatchObject({ create: 0, touch: 0 });
  });
});

describe('J-10 metadata outcomes keep the confirmed ID', () => {
  test('create returns false -> sent + metadataWarning, id preserved, exactly one create', async () => {
    chat.sendMessage.mockResolvedValue({ session_id: 'A', response: 'R' } as never); idx.createSession.mockResolvedValue(null as never);
    await expect(createProductionWorkspaceServices('u1').send('jarvis_agent', null, 'hello')).resolves.toEqual({ status: 'sent', sessionId: 'A', reply: 'R', metadataWarning: true });
    expect(idx.createSession).toHaveBeenCalledWith('jarvis_agent', 'A', 'T:hello');
    expect(allCalls()).toMatchObject({ send: 1, create: 1, list: 0, touch: 0 });
  });
  test('create throws -> sent + metadataWarning, id preserved', async () => {
    chat.sendMessage.mockResolvedValue({ session_id: 'A', response: 'R' } as never); idx.createSession.mockRejectedValue(new Error('db'));
    await expect(createProductionWorkspaceServices('u1').send('jarvis_agent', null, 'x')).resolves.toMatchObject({ status: 'sent', sessionId: 'A', metadataWarning: true });
  });
  test('existing session: list + touch matching row only, no create; unknown row -> no touch, no warning', async () => {
    chat.sendMessage.mockResolvedValue({ session_id: 'B', response: 'R' } as never);
    idx.listSessions.mockResolvedValue([{ id: 'row-a', adk_session_id: 'A' }, { id: 'row-b', adk_session_id: 'B' }] as never);
    await expect(createProductionWorkspaceServices('u1').send('calc_agent', 'B', 'x')).resolves.toMatchObject({ status: 'sent', sessionId: 'B', metadataWarning: false });
    expect(idx.touchSession).toHaveBeenCalledWith('row-b'); expect(allCalls()).toMatchObject({ create: 0, touch: 1, list: 1 });
    jest.resetAllMocks(); chat.sendMessage.mockResolvedValue({ session_id: 'Z', response: 'R' } as never); idx.listSessions.mockResolvedValue([] as never);
    await expect(createProductionWorkspaceServices('u1').send('calc_agent', 'Z', 'x')).resolves.toMatchObject({ metadataWarning: false });
    expect(allCalls()).toMatchObject({ create: 0, touch: 0 });
  });
});

describe('J-21 exact existing-service bindings', () => {
  test('history/list/rename/archive call existing operations with exact args only', async () => {
    const api = createProductionWorkspaceServices('user-7');
    chat.getHistory.mockResolvedValue([{ role: 'user', content: 'q' }] as never);
    await expect(api.history('product_agent', 'S')).resolves.toEqual({ status: 'ready', messages: [{ role: 'user', content: 'q' }] });
    expect(chat.getHistory).toHaveBeenCalledWith({ agent_name: 'product_agent', user_id: 'user-7', session_id: 'S' });
    idx.listSessions.mockResolvedValue([{ id: 'r', adk_session_id: 'S', title: 't', updated_at: 'd', extra: 'ignored' }] as never);
    await expect(api.list('product_agent')).resolves.toEqual({ status: 'ready', rows: [{ id: 'r', sessionId: 'S', title: 't', updatedAt: 'd' }] });
    await api.rename({ id: 'r', sessionId: 'S', title: 't' }, '<b>&amp;"\'</b> 🚀'); await api.archive({ id: 'r', sessionId: 'S', title: 't' });
    expect(idx.renameSession).toHaveBeenCalledWith('r', '<b>&amp;"\'</b> 🚀'); expect(idx.archiveSession).toHaveBeenCalledWith('r');
    expect(allCalls()).toEqual({ send: 0, hist: 1, list: 1, create: 0, touch: 0, rename: 1, archive: 1 });
  });
  test('no user -> every operation rejects before any service call', async () => {
    const api = createProductionWorkspaceServices('');
    for (const p of [api.list('a'), api.history('a', 's'), api.send('a', null, 'x'), api.rename({ id: 'r', sessionId: 's', title: '' }, 'x'), api.archive({ id: 'r', sessionId: 's', title: '' })])
      await expect(p).rejects.toThrow('User context unavailable');
    expect(Object.values(allCalls()).every(n => n === 0)).toBe(true);
  });
});

describe('DIRECTOR-OBS-001 §11.3 adapter seam: sequential A then B with an authoritative mocked index', () => {
  test('two new-chat sends create A and B; list returns both; reopening A reads A only; no archive/delete/recreate', async () => {
    const rows: Array<{ id: string; adk_session_id: string; title: string; updated_at: string; agent: string }> = [];
    idx.createSession.mockImplementation(async (agent: string, sid: string, title: string) => { rows.push({ id: `row-${sid}`, adk_session_id: sid, title, updated_at: 'now', agent }); return { id: `row-${sid}` } as never; });
    idx.listSessions.mockImplementation(async (agent: string) => rows.filter(r => r.agent === agent) as never);
    let n = 0; chat.sendMessage.mockImplementation(async () => ({ session_id: ['A', 'B'][n++], response: 'ok' }) as never);
    chat.getHistory.mockImplementation(async ({ session_id }: { session_id: string }) => [{ role: 'user', content: `only ${session_id}` }] as never);
    const api = createProductionWorkspaceServices('u1');
    expect(await api.send('jarvis_agent', null, 'first')).toMatchObject({ status: 'sent', sessionId: 'A', metadataWarning: false });
    expect(await api.send('jarvis_agent', null, 'second')).toMatchObject({ status: 'sent', sessionId: 'B', metadataWarning: false });
    expect((await api.list('jarvis_agent')).rows.map(r => r.sessionId)).toEqual(['A', 'B']);
    expect(await api.history('jarvis_agent', 'A')).toEqual({ status: 'ready', messages: [{ role: 'user', content: 'only A' }] });
    expect(chat.sendMessage.mock.calls.map(c => (c[0] as { session_id: string | null }).session_id)).toEqual([null, null]);
    expect(allCalls()).toMatchObject({ create: 2, archive: 0, rename: 0, touch: 0 });
  });
});
