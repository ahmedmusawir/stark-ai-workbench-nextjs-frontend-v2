/**
 * Unit tests for POST /api/agent/run (BIM-002 native connector, APBM001).
 * Intent (Rule K9): continuation only — exactly one camelCase upstream /run
 * under the VERIFIED server user. APBM001 (R001-06) deliberately SUPERSEDES
 * the null-session bootstrap (N5) and the not-found→create→retry loop (N6):
 * a missing session is `session-missing` with no create and no resend, and
 * a request without a session ID is invalid. Shared pre-upstream negatives
 * live in agent-boundary.test.ts.
 */

jest.mock('@/utils/supabase/server', () => ({ createClient: jest.fn() }));

import { POST } from '@/app/api/agent/run/route';
import { resetRosterCacheForTests } from '@/app/api/agent/_lib/context';

import {
  emptyEvents,
  happyPathEvents,
  happyPathExpected,
  multiEventExpected,
  multiEventRun,
  sessionNotFound404,
} from './fixtures/adk-events';
import { BUNDLE, USER_ID, errorCodeOf, jsonResponse, liveEnv, post, signIn } from './fixtures/route-harness';

const fetchMock = jest.fn();
const RUN_BODY = { agent_name: 'jarvis_agent', message: 'hello', session_id: 'session-42' };
const run = (body: Record<string, unknown> = RUN_BODY, headers?: Record<string, string>) =>
  POST(post('/api/agent/run', body, headers));

describe('POST /api/agent/run', () => {
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

  it('existing session: single camelCase /run for the server user, with a timeout signal', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(happyPathEvents));
    const res = await run();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BUNDLE}/run`);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({
      appName: 'jarvis_agent',
      userId: USER_ID,
      sessionId: 'session-42',
      newMessage: { role: 'user', parts: [{ text: 'hello' }] },
    });
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      status: 'sent',
      response: happyPathExpected,
      session_id: 'session-42',
      event_ids: ['ev-1', 'ev-2'],
      invocation_id: null,
    });
  });

  it('selects the LAST model text of a multi-event run', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(multiEventRun));
    const res = await run();
    expect((await res.json()).response).toBe(multiEventExpected);
  });

  it('SUPERSEDED N5: a request without session_id is invalid — the run route never creates', async () => {
    const res = await run({ agent_name: 'jarvis_agent', message: 'hello', session_id: null });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('SUPERSEDED N6: session-not-found → 404 session-missing; no create, no retry, no resend', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(sessionNotFound404, 404));
    const res = await run();
    expect(res.status).toBe(404);
    await expect(errorCodeOf(res)).resolves.toBe('session-missing');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BUNDLE}/run`);
  });

  it('run succeeds with no model text → 502 upstream-malformed (the client treats it as uncertain)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(emptyEvents));
    const res = await run();
    expect(res.status).toBe(502);
    await expect(errorCodeOf(res)).resolves.toBe('upstream-malformed');
  });

  it('does not forward a browser Authorization header (R001-11 supersedes R2)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(happyPathEvents));
    await run(RUN_BODY, { Authorization: 'Bearer browser-token' });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('timeout → 504 upstream-timeout after exactly one attempt', async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error('x'), { name: 'TimeoutError' }));
    const res = await run();
    expect(res.status).toBe(504);
    await expect(errorCodeOf(res)).resolves.toBe('upstream-timeout');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('upstream validation rejection → upstream-rejected (definitively not sent)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: [{ msg: 'field required' }] }, 422));
    const res = await run();
    await expect(errorCodeOf(res)).resolves.toBe('upstream-rejected');
  });
});
