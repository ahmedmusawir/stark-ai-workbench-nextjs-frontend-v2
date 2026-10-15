/**
 * Unit tests for the native ADK connector lib (BIM-002, reworked APBM001).
 * Intent (Rule K9): response selection (reversed scan) and history
 * normalization still match the wrapper oracle in both author styles
 * (FLAG-1). APBM001 deliberately SUPERSEDES the wrapper-era session
 * bootstrap, `session-${Date.now()}` IDs and the not-found→create→retry loop
 * (R001-06): those tests are replaced by their opposites — one camelCase run
 * attempt, a 404 is `session-missing`, never a create.
 */

import {
  createSession,
  extractResponseText,
  fallbackTitle,
  getSessionHistory,
  isSessionNotFound,
  listSessions,
  normalizeHistory,
  normalizeSessionList,
  normalizeTitle,
  runRequestBody,
  runTurn,
  sessionUrl,
} from '@/app/api/agent/_lib/adk';
import type { AgentTarget } from '@/app/api/agent/_lib/context';

import {
  authorModelStyleEvents,
  authorModelStyleExpected,
  createdSession,
  emptyEvents,
  happyPathEvents,
  happyPathExpected,
  historyEmptySession,
  historySession,
  historySessionExpected,
  malformedEvents,
  multiEventExpected,
  multiEventRun,
  sessionListRows,
  sessionNotFound404,
  thoughtPartRun,
} from './fixtures/adk-events';

const BUNDLE = 'https://bundle.example.test';
const TARGET: AgentTarget = {
  agent: 'greeting_agent',
  bundleId: 'v1',
  baseUrl: BUNDLE,
  backendKey: '0123456789abcdef',
};
const USER = 'user-verified-1';
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe('extractResponseText (R5 response selection)', () => {
  it('selects the model text from a happy-path run (canonical author style)', () => {
    expect(extractResponseText(happyPathEvents)).toBe(happyPathExpected);
  });

  it('reversed scan selects the LAST model text in a multi-event run', () => {
    expect(extractResponseText(multiEventRun)).toBe(multiEventExpected);
  });

  it('parses the author:"model" style identically (FLAG-1 dual-style)', () => {
    expect(extractResponseText(authorModelStyleEvents)).toBe(
      authorModelStyleExpected,
    );
  });

  it('returns null for an empty event array', () => {
    expect(extractResponseText(emptyEvents)).toBeNull();
  });

  it('returns null for malformed events without crashing', () => {
    expect(extractResponseText(malformedEvents)).toBeNull();
  });

  it('returns null for non-array input', () => {
    expect(extractResponseText({ detail: 'oops' })).toBeNull();
    expect(extractResponseText(null)).toBeNull();
  });

  it('excludes thought parts and never surfaces thoughtSignature data', () => {
    expect(extractResponseText(thoughtPartRun)).toBe('Visible reply');
  });
});

describe('normalizeHistory (A2.3 §4, APBM001 explicit malformed)', () => {
  it('maps mixed turns to Message[], skipping non-text events, order preserved', () => {
    expect(normalizeHistory(historySession)).toEqual(historySessionExpected);
  });

  it('normalizes a valid empty-events session to [] (the N7 shape)', () => {
    expect(normalizeHistory(historyEmptySession)).toEqual([]);
  });

  it('SUPERSEDED degrade-to-[]: a session without an events array is malformed (null)', () => {
    expect(normalizeHistory(null)).toBeNull();
    expect(normalizeHistory({})).toBeNull();
    expect(normalizeHistory({ events: 'nope' })).toBeNull();
  });

  it('valid events with no visible text still normalize to []', () => {
    expect(normalizeHistory({ events: malformedEvents })).toEqual([]);
  });

  it('drops thought parts from transcript messages', () => {
    expect(normalizeHistory({ events: thoughtPartRun })).toEqual([
      { role: 'assistant', content: 'Visible reply' },
    ]);
  });
});

describe('isSessionNotFound (APBM001: explicit 404 detail only)', () => {
  it('matches the observed 404 Session not found body', () => {
    expect(isSessionNotFound(404, JSON.stringify(sessionNotFound404))).toBe(true);
  });

  it('an agent-level or bare 404 is NOT a missing conversation', () => {
    expect(isSessionNotFound(404, '')).toBe(false);
    expect(isSessionNotFound(404, '{"detail":"App not found"}')).toBe(false);
  });

  it('SUPERSEDED detail-regardless-of-status: a 500 mentioning the text is not missing', () => {
    expect(isSessionNotFound(500, JSON.stringify(sessionNotFound404))).toBe(false);
  });
});

describe('titles and session list normalization', () => {
  it('collapses whitespace, trims and caps titles at 80 characters', () => {
    expect(normalizeTitle('  hello \n\t world  ')).toBe('hello world');
    expect(normalizeTitle('x'.repeat(200))).toHaveLength(80);
    expect(normalizeTitle(42)).toBe('');
  });

  it('sorts newest-created first with a deterministic ID tie-break and stable fallback titles', () => {
    expect(normalizeSessionList(sessionListRows, USER)).toEqual([
      {
        session_id: 'bbbbbbbb-2222-4222-8222-222222222222',
        title: 'Newest created title',
        title_source: 'stored',
        created_at: new Date(1791961412250).toISOString(),
      },
      {
        session_id: 'cccccccc-3333-4333-8333-333333333333',
        title: fallbackTitle('cccccccc-3333-4333-8333-333333333333'),
        title_source: 'fallback',
        created_at: new Date(1791961412250).toISOString(),
      },
      {
        session_id: 'aaaaaaaa-1111-4111-8111-111111111111',
        title: 'Older titled conversation',
        title_source: 'stored',
        created_at: new Date(1791961400500).toISOString(),
      },
    ]);
    expect(fallbackTitle('cccccccc-3333')).toBe('Conversation cccccccc');
  });

  it('treats non-arrays, rows without IDs and rows for another user as malformed', () => {
    expect(normalizeSessionList({ sessions: [] }, USER)).toBeNull();
    expect(normalizeSessionList([{ state: {} }], USER)).toBeNull();
    expect(normalizeSessionList([{ id: 'x', userId: 'someone-else' }], USER)).toBeNull();
    expect(normalizeSessionList([], USER)).toEqual([]);
  });
});

describe('URLs and wire body', () => {
  it('builds the native path with encoded segments', () => {
    expect(sessionUrl(BUNDLE, 'jarvis_agent', 'u/1', 'session-1')).toBe(
      `${BUNDLE}/apps/jarvis_agent/users/u%2F1/sessions/session-1`,
    );
  });

  it('uses the tested camelCase RunAgentRequest, never snake_case', () => {
    const body = runRequestBody('greeting_agent', USER, 's-1', 'hi');
    expect(body).toEqual({
      appName: 'greeting_agent',
      userId: USER,
      sessionId: 's-1',
      newMessage: { role: 'user', parts: [{ text: 'hi' }] },
    });
    expect(JSON.stringify(body)).not.toMatch(/app_name|user_id|session_id|new_message/);
  });
});

describe('upstream calls: exactly one attempt each, sanitized classification', () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const codeOf = async (promise: Promise<unknown>) => {
    try {
      await promise;
    } catch (e) {
      return { status: (e as { status: number }).status, code: (e as { code: string }).code, message: (e as Error).message };
    }
    throw new Error('expected rejection');
  };

  it('runTurn: one camelCase /run, returns reply, event IDs and invocation ID, no Authorization', async () => {
    fetchMock.mockResolvedValueOnce(
      json([{ ...happyPathEvents[1], invocationId: 'e-1' }]),
    );
    await expect(runTurn(TARGET, USER, 's-1', 'hello')).resolves.toEqual({
      reply: happyPathExpected,
      eventIds: ['ev-2'],
      invocationId: 'e-1',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BUNDLE}/run`);
    expect(JSON.parse(init.body)).toEqual(runRequestBody('greeting_agent', USER, 's-1', 'hello'));
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('SUPERSEDED retry-once: a 404 Session not found is session-missing with NO create and NO second run', async () => {
    fetchMock.mockResolvedValueOnce(json(sessionNotFound404, 404));
    await expect(codeOf(runTurn(TARGET, USER, 's-gone', 'x'))).resolves.toMatchObject({ status: 404, code: 'session-missing' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('a 200 run without model text is malformed (uncertain to the client), never a crash', async () => {
    fetchMock.mockResolvedValueOnce(json(emptyEvents));
    await expect(codeOf(runTurn(TARGET, USER, 's-1', 'x'))).resolves.toMatchObject({ code: 'upstream-malformed' });
  });

  it.each([
    [401, 'upstream-access'],
    [403, 'upstream-access'],
    [422, 'upstream-rejected'],
    [500, 'upstream-unavailable'],
    [503, 'upstream-unavailable'],
  ])('upstream %i → %s, with the upstream body never echoed', async (status, code) => {
    fetchMock.mockResolvedValueOnce(json({ detail: 'SECRET internal stack' }, status));
    const result = await codeOf(runTurn(TARGET, USER, 's-1', 'x'));
    expect(result.code).toBe(code);
    expect(result.message).not.toMatch(/SECRET|stack/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('timeouts and transport failures are classified without leaking the cause', async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error('t'), { name: 'TimeoutError' }));
    await expect(codeOf(runTurn(TARGET, USER, 's-1', 'x'))).resolves.toMatchObject({ status: 504, code: 'upstream-timeout' });
    fetchMock.mockRejectedValueOnce(new TypeError('connect ECONNREFUSED 10.0.0.1'));
    const transport = await codeOf(listSessions(TARGET, USER));
    expect(transport).toMatchObject({ code: 'upstream-unavailable' });
    expect(transport.message).not.toMatch(/ECONNREFUSED|10\.0/);
  });

  it('createSession: POST to the UUID path with the title as initial state; echo must match', async () => {
    const id = 'dddddddd-4444-4444-8444-444444444444';
    fetchMock.mockResolvedValueOnce(json(createdSession(id, 'My title')));
    await expect(createSession(TARGET, USER, id, 'My title')).resolves.toEqual({
      createdAt: new Date(1791961411947.805).toISOString(),
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(sessionUrl(BUNDLE, 'greeting_agent', USER, id));
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ title: 'My title' });
    fetchMock.mockResolvedValueOnce(json(createdSession('other-id', 'My title')));
    await expect(codeOf(createSession(TARGET, USER, id, 'My title'))).resolves.toMatchObject({ code: 'upstream-malformed' });
  });

  it('getSessionHistory: empty events is [], 404 is missing, malformed/ID mismatch is unavailable', async () => {
    fetchMock.mockResolvedValueOnce(json(historyEmptySession));
    await expect(getSessionHistory(TARGET, USER, historyEmptySession.id)).resolves.toEqual([]);
    fetchMock.mockResolvedValueOnce(json(sessionNotFound404, 404));
    await expect(codeOf(getSessionHistory(TARGET, USER, 'gone'))).resolves.toMatchObject({ code: 'session-missing' });
    fetchMock.mockResolvedValueOnce(json({ id: 'x' }));
    await expect(codeOf(getSessionHistory(TARGET, USER, 'x'))).resolves.toMatchObject({ code: 'upstream-malformed' });
    fetchMock.mockResolvedValueOnce(json(historySession));
    await expect(codeOf(getSessionHistory(TARGET, USER, 'another-id'))).resolves.toMatchObject({ code: 'upstream-malformed' });
    fetchMock.mockResolvedValueOnce(new Response('<html>not json</html>', { status: 200 }));
    await expect(codeOf(getSessionHistory(TARGET, USER, 'x'))).resolves.toMatchObject({ code: 'upstream-malformed' });
  });

  it('listSessions: a non-session 404 (agent level) is unavailable, not empty', async () => {
    fetchMock.mockResolvedValueOnce(json({ detail: 'Not Found' }, 404));
    await expect(codeOf(listSessions(TARGET, USER))).resolves.toMatchObject({ code: 'upstream-unavailable' });
  });
});
