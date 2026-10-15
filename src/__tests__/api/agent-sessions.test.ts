/**
 * /api/agent/sessions (APBM001, AC006–AC008): the ADK session list is the
 * conversation catalogue for the VERIFIED server user, and creation is an
 * explicit one-attempt create of a client-allocated UUID carrying its title
 * as initial ADK state. Successful zero rows is `empty`; failures are
 * structured and distinct. No chat_sessions access exists on this path.
 */

jest.mock('@/utils/supabase/server', () => ({ createClient: jest.fn() }));
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => {
    throw new Error('chat_sessions must not be touched by the ADK catalogue');
  },
}));

import { GET, POST } from '@/app/api/agent/sessions/route';
import { backendKeyFor, resetRosterCacheForTests } from '@/app/api/agent/_lib/context';

import { createdSession, sessionListRows } from './fixtures/adk-events';
import { BUNDLE, USER_ID, errorCodeOf, get, jsonResponse, liveEnv, post, signIn } from './fixtures/route-harness';

const fetchMock = jest.fn();
const NEW_ID = 'eeeeeeee-5555-4555-8555-555555555555';
const list = () => GET(get('/api/agent/sessions?agent_name=greeting_agent'));
const create = (body: Record<string, unknown> = {}) =>
  POST(post('/api/agent/sessions', { agent_name: 'greeting_agent', session_id: NEW_ID, title: '  First   message\ntitle ', ...body }));

describe('/api/agent/sessions', () => {
  const originalFetch = global.fetch;
  const env = { ...process.env };

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockReset();
    resetRosterCacheForTests();
    liveEnv();
    signIn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    process.env = env;
  });

  it('GET lists the server user\'s ADK sessions newest-created first with titles and fallbacks', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(sessionListRows));
    const res = await list();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BUNDLE}/apps/greeting_agent/users/${USER_ID}/sessions`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ready');
    expect(body.backend_key).toBe(backendKeyFor('live', 'v1', BUNDLE));
    expect(body.sessions.map((s: { session_id: string }) => s.session_id)).toEqual([
      'bbbbbbbb-2222-4222-8222-222222222222',
      'cccccccc-3333-4333-8333-333333333333',
      'aaaaaaaa-1111-4111-8111-111111111111',
    ]);
    expect(body.sessions[1]).toMatchObject({ title: 'Conversation cccccccc', title_source: 'fallback' });
  });

  it('GET: a successful zero-row list is empty, distinct from failures', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    await expect((await list()).json()).resolves.toMatchObject({ status: 'empty', sessions: [] });
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'boom' }, 500));
    const failed = await list();
    expect(failed.status).toBe(502);
    expect((await failed.clone().json()).sessions).toBeUndefined();
    await expect(errorCodeOf(failed)).resolves.toBe('upstream-unavailable');
    fetchMock.mockResolvedValueOnce(jsonResponse({ unexpected: true }));
    await expect(errorCodeOf(await list())).resolves.toBe('upstream-malformed');
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'no' }, 403));
    await expect(errorCodeOf(await list())).resolves.toBe('upstream-access');
  });

  it('POST creates once with the normalized title as initial state and never runs', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(createdSession(NEW_ID, 'First message title')));
    const res = await create();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      status: 'created',
      session_id: NEW_ID,
      title: 'First message title',
      created_at: new Date(1791961411947.805).toISOString(),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BUNDLE}/apps/greeting_agent/users/${USER_ID}/sessions/${NEW_ID}`);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ title: 'First message title' });
    expect(fetchMock.mock.calls.some(([u]) => String(u).endsWith('/run'))).toBe(false);
  });

  it('POST caps titles at 80 characters and preserves literal markup as text', async () => {
    const title = '<b>literal</b> ' + 'x'.repeat(120);
    fetchMock.mockImplementationOnce(async (_url, init) => jsonResponse(createdSession(NEW_ID, JSON.parse(init.body).title)));
    const body = await (await create({ title })).json();
    expect(body.title).toHaveLength(80);
    expect(body.title.startsWith('<b>literal</b>')).toBe(true);
  });

  it('POST: upstream timeout is upstream-timeout (create outcome unknown); no retry', async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error('x'), { name: 'TimeoutError' }));
    const res = await create();
    expect(res.status).toBe(504);
    await expect(errorCodeOf(res)).resolves.toBe('upstream-timeout');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('POST: a duplicate/rejected create is upstream-rejected; an ID-mismatched echo is malformed', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'Session already exists' }, 409));
    await expect(errorCodeOf(await create())).resolves.toBe('upstream-rejected');
    fetchMock.mockResolvedValueOnce(jsonResponse(createdSession('ffffffff-6666-4666-8666-666666666666', 'x')));
    await expect(errorCodeOf(await create())).resolves.toBe('upstream-malformed');
  });
});
