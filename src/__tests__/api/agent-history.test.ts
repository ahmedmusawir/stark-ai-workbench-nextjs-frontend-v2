/**
 * Unit tests for POST /api/agent/history (BIM-002 native connector, APBM001).
 * Intent (Rule K9): the route GETs the native session under the VERIFIED
 * server user and normalizes its events. APBM001 (R001-05) deliberately
 * SUPERSEDES the frozen A1 failure shape: there is no error-to-[] collapse —
 * valid zero events is `empty`, session 404 is `session-missing`, upstream
 * auth is `upstream-access`, and timeout/5xx/malformed are unavailable.
 * Shared pre-upstream negatives live in agent-boundary.test.ts.
 */

jest.mock('@/utils/supabase/server', () => ({ createClient: jest.fn() }));

import { POST } from '@/app/api/agent/history/route';
import { resetRosterCacheForTests } from '@/app/api/agent/_lib/context';

import {
  historyEmptySession,
  historySession,
  historySessionExpected,
  sessionNotFound404,
} from './fixtures/adk-events';
import { BUNDLE, USER_ID, errorCodeOf, jsonResponse, liveEnv, post, signIn } from './fixtures/route-harness';

const fetchMock = jest.fn();
const body = (sessionId = historySession.id) => ({ agent_name: 'jarvis_agent', session_id: sessionId });
const request = (sessionId?: string, headers?: Record<string, string>) =>
  POST(post('/api/agent/history', body(sessionId), headers));

describe('POST /api/agent/history', () => {
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

  it('GETs the native session path for the server user with a timeout signal', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(historySession));
    await request();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BUNDLE}/apps/jarvis_agent/users/${USER_ID}/sessions/${historySession.id}`);
    expect(init.method).toBe('GET');
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('normalizes session events to { status: ready, history } (roles mapped, non-text skipped)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(historySession));
    const res = await request();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: 'ready', history: historySessionExpected });
  });

  it('a valid session with zero events is empty — a success, distinct from every failure', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(historyEmptySession));
    const res = await request(historyEmptySession.id);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: 'empty', history: [] });
  });

  it('does not forward a browser Authorization header (R001-11 supersedes the R2 pass-through)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(historySession));
    await request(undefined, { Authorization: 'Bearer browser-token' });
    expect(fetchMock.mock.calls[0][1].headers?.Authorization).toBeUndefined();
  });

  it.each([
    ['session 404', () => jsonResponse(sessionNotFound404, 404), 404, 'session-missing'],
    ['agent-level 404', () => jsonResponse({ detail: 'Not Found' }, 404), 502, 'upstream-unavailable'],
    ['upstream 401', () => jsonResponse({ detail: 'no' }, 401), 502, 'upstream-access'],
    ['upstream 500', () => jsonResponse({ detail: 'boom' }, 500), 502, 'upstream-unavailable'],
    ['malformed 200', () => jsonResponse({ id: historySession.id, events: 'nope' }), 502, 'upstream-malformed'],
  ])('%s → %i %s, never an empty history', async (_label, response, status, code) => {
    fetchMock.mockResolvedValueOnce(response());
    const res = await request();
    expect(res.status).toBe(status);
    const payload = await res.clone().json();
    expect(payload.history).toBeUndefined();
    await expect(errorCodeOf(res)).resolves.toBe(code);
  });

  it('timeout → 504 upstream-timeout; unreachable bundle → 502 without the cause text', async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error('x'), { name: 'TimeoutError' }));
    const timedOut = await request();
    expect(timedOut.status).toBe(504);
    await expect(errorCodeOf(timedOut)).resolves.toBe('upstream-timeout');
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed: getaddrinfo ENOTFOUND'));
    const res = await request();
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toMatch(/ENOTFOUND|getaddrinfo/);
  });

  it('accepts wrapper-era session IDs for existing conversations', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...historyEmptySession, id: 'session-1759000000000' }));
    const res = await request('session-1759000000000');
    expect(res.status).toBe(200);
  });
});
