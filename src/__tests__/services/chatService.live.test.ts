/**
 * chatService live-mode tests (BIM-001, APBM001). Routes mocked at the fetch
 * level — no real HTTP leaves these tests.
 *
 * Intent (Rule K9), mapped to gates:
 *   G3 — flag unset/garbage → mock path, ZERO fetch calls (fail-safe default)
 *   G7 — falsy session_id → empty history with ZERO fetch calls
 *   R001-05 — SUPERSEDES "getHistory failure → []": every failure is an
 *            explicit status, never an empty history
 *   R001-06/07 — writes are one attempt; definitive rejections are not-sent,
 *            anything after dispatch with an unknown result is uncertain
 *   G8 — the legacy sendMessage adapter keeps the D1(b) sentinel shape
 */

import { chatService, conversationTitle } from '@/services/chatService';
import type { GetHistoryRequest, RunAgentRequest } from '@/types';

const fetchMock = jest.fn();

const RUN_INPUT: RunAgentRequest = {
  agent_name: 'jarvis_agent',
  message: 'hello',
  user_id: 'u-1',
  session_id: 'sess-existing',
};

const HISTORY_INPUT: GetHistoryRequest = {
  agent_name: 'jarvis_agent',
  user_id: 'u-1',
  session_id: 'sess-existing',
};

const json = (payload: unknown, status = 200) =>
  ({ ok: status < 400, status, json: async () => payload }) as unknown as Response;
const failure = (code: string, status = 502) => json({ error: { code, message: 'sanitized' } }, status);

describe('chatService live mode', () => {
  const originalFetch = global.fetch;
  const originalMode = process.env.NEXT_PUBLIC_CHAT_MODE;

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockReset();
    process.env.NEXT_PUBLIC_CHAT_MODE = 'live';
  });

  afterAll(() => {
    global.fetch = originalFetch;
    if (originalMode === undefined) delete process.env.NEXT_PUBLIC_CHAT_MODE;
    else process.env.NEXT_PUBLIC_CHAT_MODE = originalMode;
  });

  describe('mode flag (G3 — fail-safe default)', () => {
    it('unset flag → mock path, zero fetch calls', async () => {
      delete process.env.NEXT_PUBLIC_CHAT_MODE;
      const result = await chatService.sendMessage(RUN_INPUT);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(typeof result.response).toBe('string');
      expect(typeof result.session_id).toBe('string');
    });

    it('unrecognized flag value → mock path, zero fetch calls', async () => {
      process.env.NEXT_PUBLIC_CHAT_MODE = 'banana';
      const result = await chatService.getHistory(HISTORY_INPUT);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(['ready', 'empty']).toContain(result.status);
      expect(Array.isArray(result.messages)).toBe(true);
    });
  });

  describe('getHistory (explicit outcomes)', () => {
    it('falsy session_id → empty with zero fetch calls (G7)', async () => {
      await expect(chatService.getHistory({ ...HISTORY_INPUT, session_id: '' })).resolves.toEqual({ status: 'empty', messages: [] });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('POSTs to /api/agent/history and returns ready messages', async () => {
      const history = [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'hello' }];
      fetchMock.mockResolvedValueOnce(json({ status: 'ready', history }));
      await expect(chatService.getHistory(HISTORY_INPUT)).resolves.toEqual({ status: 'ready', messages: history });
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/agent/history');
      expect(JSON.parse(init.body)).toEqual(HISTORY_INPUT);
      expect(init.signal).toBeInstanceOf(AbortSignal);
    });

    it('successful zero events is empty — distinct from failure', async () => {
      fetchMock.mockResolvedValueOnce(json({ status: 'empty', history: [] }));
      await expect(chatService.getHistory(HISTORY_INPUT)).resolves.toEqual({ status: 'empty', messages: [] });
    });

    it.each([
      ['session-missing', 404, 'missing'],
      ['upstream-access', 502, 'access-unavailable'],
      ['unauthenticated', 401, 'access-unavailable'],
      ['identity-mismatch', 403, 'access-unavailable'],
      ['backend-changed', 409, 'backend-changed'],
      ['agent-unavailable', 503, 'agent-unavailable'],
      ['upstream-timeout', 504, 'unavailable'],
      ['upstream-malformed', 502, 'unavailable'],
    ])('SUPERSEDED error-to-[]: %s → %s', async (code, status, expected) => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      fetchMock.mockResolvedValueOnce(failure(code, status));
      await expect(chatService.getHistory(HISTORY_INPUT)).resolves.toEqual({ status: expected, messages: [] });
    });

    it('network rejection and malformed success are unavailable, never empty, and never throw', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
      await expect(chatService.getHistory(HISTORY_INPUT)).resolves.toEqual({ status: 'unavailable', messages: [] });
      fetchMock.mockResolvedValueOnce(json({ history: 'nope' }));
      await expect(chatService.getHistory(HISTORY_INPUT)).resolves.toEqual({ status: 'unavailable', messages: [] });
    });
  });

  describe('listConversations', () => {
    it('maps rows and forwards agent/backend/user assertion as query parameters', async () => {
      fetchMock.mockResolvedValueOnce(json({ status: 'ready', backend_key: 'k', sessions: [{ session_id: 's1', title: 'T', title_source: 'stored', created_at: '2026-10-14T00:00:00.000Z' }] }));
      await expect(chatService.listConversations('greeting_agent', { backendKey: '0123456789abcdef', userId: 'u-1' })).resolves.toEqual({
        status: 'ready',
        conversations: [{ sessionId: 's1', title: 'T', titleSource: 'stored', createdAt: '2026-10-14T00:00:00.000Z' }],
      });
      const url = new URL(fetchMock.mock.calls[0][0], 'http://x');
      expect(url.pathname).toBe('/api/agent/sessions');
      expect(Object.fromEntries(url.searchParams)).toEqual({ agent_name: 'greeting_agent', backend_key: '0123456789abcdef', user_id: 'u-1' });
    });

    it('empty is only a successful zero-row list; failures stay distinct', async () => {
      fetchMock.mockResolvedValueOnce(json({ status: 'empty', backend_key: 'k', sessions: [] }));
      await expect(chatService.listConversations('a')).resolves.toEqual({ status: 'empty', conversations: [] });
      fetchMock.mockResolvedValueOnce(failure('upstream-unavailable'));
      await expect(chatService.listConversations('a')).resolves.toEqual({ status: 'unavailable', conversations: [] });
      fetchMock.mockResolvedValueOnce(failure('upstream-access'));
      await expect(chatService.listConversations('a')).resolves.toEqual({ status: 'access-unavailable', conversations: [] });
      fetchMock.mockRejectedValueOnce(new TypeError('offline'));
      await expect(chatService.listConversations('a')).resolves.toEqual({ status: 'unavailable', conversations: [] });
    });
  });

  describe('createConversation / runTurn (one attempt, honest uncertainty)', () => {
    it('create sends the caller UUID and title once; created echo confirms', async () => {
      fetchMock.mockResolvedValueOnce(json({ status: 'created', session_id: 'uuid-1', title: 'T', created_at: null }));
      await expect(chatService.createConversation('a', 'uuid-1', 'T', { backendKey: 'k', userId: 'u' })).resolves.toEqual({ status: 'created', sessionId: 'uuid-1', title: 'T', createdAt: null });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ agent_name: 'a', session_id: 'uuid-1', title: 'T', backend_key: 'k', user_id: 'u' });
    });

    it('run returns the reply with event/invocation IDs', async () => {
      fetchMock.mockResolvedValueOnce(json({ status: 'sent', response: 'R', session_id: 's', event_ids: ['e1'], invocation_id: 'i1' }));
      await expect(chatService.runTurn('a', 's', 'm')).resolves.toEqual({ status: 'sent', sessionId: 's', reply: 'R', eventIds: ['e1'], invocationId: 'i1' });
    });

    it.each([
      ['invalid-request', 'not-sent'],
      ['origin-rejected', 'not-sent'],
      ['config-unavailable', 'not-sent'],
      ['auth-unavailable', 'not-sent'],
      ['upstream-rejected', 'not-sent'],
      ['unauthenticated', 'access-unavailable'],
      ['upstream-access', 'access-unavailable'],
      ['session-missing', 'missing'],
      ['backend-changed', 'backend-changed'],
      ['agent-unavailable', 'agent-unavailable'],
      ['upstream-timeout', 'uncertain'],
      ['upstream-unavailable', 'uncertain'],
      ['upstream-malformed', 'uncertain'],
    ])('run failure %s → %s, with no retry', async (code, expected) => {
      fetchMock.mockResolvedValueOnce(failure(code));
      await expect(chatService.runTurn('a', 's', 'm')).resolves.toEqual({ status: expected, code });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('post-dispatch transport loss, browser timeout, unknown error bodies and odd successes are uncertain', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('network'));
      await expect(chatService.runTurn('a', 's', 'm')).resolves.toMatchObject({ status: 'uncertain' });
      fetchMock.mockRejectedValueOnce(new DOMException('timed out', 'TimeoutError'));
      await expect(chatService.createConversation('a', 'u1', 'T')).resolves.toMatchObject({ status: 'uncertain' });
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => { throw new Error('html'); } });
      await expect(chatService.runTurn('a', 's', 'm')).resolves.toMatchObject({ status: 'uncertain' });
      fetchMock.mockResolvedValueOnce(json({ status: 'sent', response: 'R', session_id: 'another' }));
      await expect(chatService.runTurn('a', 's', 'm')).resolves.toMatchObject({ status: 'uncertain' });
    });
  });

  describe('legacy sendMessage adapter (D1(b) sentinel, no hidden retry)', () => {
    it('existing session: one run, legacy shape', async () => {
      fetchMock.mockResolvedValueOnce(json({ status: 'sent', response: 'Hi', session_id: 'sess-existing', event_ids: [], invocation_id: null }));
      await expect(chatService.sendMessage(RUN_INPUT)).resolves.toEqual({ response: 'Hi', session_id: 'sess-existing' });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('/api/agent/run');
    });

    it('null session: explicit UUID create then one run (the route never bootstraps)', async () => {
      fetchMock.mockImplementationOnce(async (_url: string, init: RequestInit) => {
        const body = JSON.parse(String(init.body));
        return json({ status: 'created', session_id: body.session_id, title: body.title, created_at: null });
      });
      fetchMock.mockImplementationOnce(async (_url: string, init: RequestInit) =>
        json({ status: 'sent', response: 'Hi', session_id: JSON.parse(String(init.body)).session_id, event_ids: [], invocation_id: null }));
      const result = await chatService.sendMessage({ ...RUN_INPUT, session_id: null });
      expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(['/api/agent/sessions', '/api/agent/run']);
      expect(result.session_id).toMatch(/^[0-9a-f-]{36}$/);
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).title).toBe('hello');
    });

    it('failure resolves with the sentinel string and never retries', async () => {
      fetchMock.mockResolvedValueOnce(failure('upstream-timeout', 504));
      const result = await chatService.sendMessage(RUN_INPUT);
      expect(result.response).toMatch(/^Error: Could not reach Agent Service\. Details: uncertain$/);
      expect(result.session_id).toBe('sess-existing');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  it('conversationTitle collapses whitespace and caps at 80 characters', () => {
    expect(conversationTitle('  a \n b  ')).toBe('a b');
    expect(conversationTitle('y'.repeat(100))).toHaveLength(80);
  });

  it('getWorkspace: 401 is unauthenticated; a descriptor without a user is unavailable', async () => {
    fetchMock.mockResolvedValueOnce(json({}, 401));
    await expect(chatService.getWorkspace()).resolves.toEqual({ status: 'unauthenticated' });
    fetchMock.mockResolvedValueOnce(json({ agents: [] }));
    await expect(chatService.getWorkspace()).resolves.toEqual({ status: 'unavailable' });
  });
});
