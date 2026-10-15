/**
 * APBM001 server boundary (AC002, AC004, AC025): every owned agent route
 * rejects missing login (401), a mismatched supplied user_id (403),
 * cross-origin state changes (403), invalid input (400), stale backend keys
 * (409) and missing/invalid live configuration (503) — each with ZERO
 * upstream traffic. The verified server user, not the browser, selects the
 * ADK namespace. State changes need an Origin that exactly equals a
 * server-configured origin; request headers never extend that allowlist.
 */

jest.mock('@/utils/supabase/server', () => ({ createClient: jest.fn() }));

import { POST as historyPOST } from '@/app/api/agent/history/route';
import { POST as runPOST } from '@/app/api/agent/run/route';
import { GET as sessionsGET, POST as sessionsPOST } from '@/app/api/agent/sessions/route';
import { GET as workspaceGET } from '@/app/api/agent/workspace/route';
import { createClient } from '@/utils/supabase/server';
import {
  backendKeyFor,
  normalizeEndpoint,
  resetRosterCacheForTests,
  resolveAgentTarget,
  trustedOrigins,
} from '@/app/api/agent/_lib/context';

import {
  APP_ORIGIN,
  BUNDLE,
  USER_ID,
  authOutage,
  errorCodeOf,
  get,
  jsonResponse,
  liveEnv,
  post,
  signIn,
  signOut,
} from './fixtures/route-harness';

const SESSION = 'aaaaaaaa-1111-4111-8111-111111111111';
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const env = { ...process.env };

// NODE_ENV is typed read-only; the origin policy reads it per request.
const setNodeEnv = (value: string) => {
  (process.env as Record<string, string | undefined>).NODE_ENV = value;
};

beforeEach(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
  fetchMock.mockReset();
  resetRosterCacheForTests();
  liveEnv();
  signIn();
  process.env.NEXT_PUBLIC_SITE_URL = APP_ORIGIN;
  delete process.env.AGENT_TRUSTED_ORIGINS;
  delete process.env.PORT;
  setNodeEnv('test');
});

afterAll(() => {
  global.fetch = originalFetch;
  process.env = env;
});

const liveKey = () => backendKeyFor('live', 'v1', BUNDLE);

type Call = (extra?: Record<string, string>, headers?: Record<string, string>) => Promise<Response>;
const routes: Record<string, Call> = {
  'GET sessions': (extra = {}, headers) =>
    sessionsGET(get(`/api/agent/sessions?${new URLSearchParams({ agent_name: 'greeting_agent', ...extra })}`, headers)),
  'POST sessions': (extra = {}, headers) =>
    sessionsPOST(post('/api/agent/sessions', { agent_name: 'greeting_agent', session_id: SESSION, title: 'T', ...extra }, headers)),
  'POST history': (extra = {}, headers) =>
    historyPOST(post('/api/agent/history', { agent_name: 'greeting_agent', session_id: SESSION, ...extra }, headers)),
  'POST run': (extra = {}, headers) =>
    runPOST(post('/api/agent/run', { agent_name: 'greeting_agent', session_id: SESSION, message: 'hi', ...extra }, headers)),
};

describe.each(Object.entries(routes))('%s pre-upstream gate', (_name, call) => {
  it('401 unauthenticated without a verified user, zero upstream', async () => {
    signOut();
    const res = await call();
    expect(res.status).toBe(401);
    await expect(errorCodeOf(res)).resolves.toBe('unauthenticated');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('503 auth-unavailable when the sign-in service cannot answer, zero upstream', async () => {
    authOutage();
    const res = await call();
    expect(res.status).toBe(503);
    await expect(errorCodeOf(res)).resolves.toBe('auth-unavailable');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('403 identity-mismatch for a supplied user_id that is not the server user, zero upstream', async () => {
    const res = await call({ user_id: 'someone-else' });
    expect(res.status).toBe(403);
    await expect(errorCodeOf(res)).resolves.toBe('identity-mismatch');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('400 invalid-agent for an agent outside the manifest, zero upstream', async () => {
    const res = await call({ agent_name: 'utils' });
    expect(res.status).toBe(400);
    await expect(errorCodeOf(res)).resolves.toBe('invalid-agent');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('409 backend-changed for a stale backend key, zero upstream', async () => {
    const res = await call({ backend_key: backendKeyFor('live', 'v1', 'https://other.example.test') });
    expect(res.status).toBe(409);
    await expect(errorCodeOf(res)).resolves.toBe('backend-changed');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('503 config-unavailable when the bundle URL is unset, never mock fallback', async () => {
    delete process.env.ADK_BUNDLE_URL_V1;
    const res = await call();
    expect(res.status).toBe(503);
    await expect(errorCodeOf(res)).resolves.toBe('config-unavailable');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('503 config-unavailable in mock mode: live/mock never share sessions', async () => {
    process.env.NEXT_PUBLIC_CHAT_MODE = 'mock';
    const res = await call();
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('the matching user_id and current backend key are accepted and the SERVER user selects the ADK path', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Session not found' }, 404));
    await call({ user_id: USER_ID, backend_key: liveKey() });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    const target = String(url) + (init?.body ?? '');
    expect(target).toContain(USER_ID);
    expect(init?.headers?.Authorization).toBeUndefined();
  });
});

const SITE = 'https://app.example.test';
const none = () => undefined;
const devServerOn4300 = () => {
  setNodeEnv('development');
  process.env.PORT = '4300';
};

describe('trusted origins come from server configuration only (AC025)', () => {
  it('normalizes the configured site and AGENT_TRUSTED_ORIGINS; malformed entries grant nothing', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://App.Example.test/workspace/';
    process.env.AGENT_TRUSTED_ORIGINS =
      ' http://127.0.0.1:43190 , https://user:pw@creds.example.test, ftp://files.example.test, not a url,,';
    expect([...trustedOrigins()]).toEqual([SITE, 'http://127.0.0.1:43190']);
  });

  it('trusts loopback at the port Next listens on under next dev only', () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE;
    devServerOn4300();
    expect(trustedOrigins()).toEqual(new Set([SITE, 'http://localhost:4300', 'http://127.0.0.1:4300']));
    setNodeEnv('production');
    expect(trustedOrigins()).toEqual(new Set([SITE]));
    setNodeEnv('test');
    expect(trustedOrigins()).toEqual(new Set([SITE]));
  });

  it('an unset or malformed site URL grants nothing', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(trustedOrigins().size).toBe(0);
    process.env.NEXT_PUBLIC_SITE_URL = 'app.example.test';
    expect(trustedOrigins().size).toBe(0);
    process.env.NEXT_PUBLIC_SITE_URL = 'localhost:3000';
    expect(trustedOrigins().size).toBe(0);
  });
});

describe.each(Object.entries(routes).filter(([name]) => name.startsWith('POST')))('%s same-origin policy (AC025)', (_name, call) => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE;
  });

  it.each<[string, () => void, Record<string, string>]>([
    ['the configured site origin behind an internal Host', none, { origin: SITE, host: 'internal:3000' }],
    [
      'an explicitly configured test-server origin',
      () => {
        process.env.AGENT_TRUSTED_ORIGINS = 'http://127.0.0.1:43190';
      },
      { origin: 'http://127.0.0.1:43190', host: '127.0.0.1:43190' },
    ],
    ['next dev loopback at its own port', devServerOn4300, { origin: 'http://localhost:4300', host: 'localhost:4300' }],
  ])('accepts %s and reaches upstream', async (_label, configure, headers) => {
    configure();
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Session not found' }, 404));
    const res = await call({}, headers);
    expect(res.status).not.toBe(403);
    expect(createClient).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each<[string, () => void, Record<string, string>]>([
    ['wrong scheme with a matching Host', none, { origin: 'http://app.example.test', host: 'app.example.test' }],
    ['wrong port with a matching Host', none, { origin: 'https://app.example.test:8443', host: 'app.example.test:8443' }],
    ['a foreign Origin', none, { origin: 'https://evil.example' }],
    [
      'a foreign Origin matched by a spoofed X-Forwarded-Host',
      none,
      { origin: 'https://evil.example', 'x-forwarded-host': 'evil.example', 'x-forwarded-proto': 'https' },
    ],
    ['a foreign Origin matched by a spoofed Host', none, { origin: 'https://evil.example', host: 'evil.example' }],
    ['a foreign Origin matched by a spoofed Forwarded header', none, { origin: 'https://evil.example', forwarded: 'host=evil.example;proto=https' }],
    ['a sibling subdomain', none, { origin: 'https://evil.app.example.test' }],
    ['a look-alike suffix', none, { origin: 'https://app.example.test.evil.example' }],
    ['a missing Origin', none, { origin: '' }],
    ['an opaque "null" Origin', none, { origin: 'null' }],
    ['a malformed Origin', none, { origin: 'not a url' }],
    ['an Origin carrying a path', none, { origin: 'https://app.example.test/chat' }],
    ['an Origin carrying userinfo', none, { origin: 'https://user@app.example.test' }],
    ['a non-canonical Origin', none, { origin: 'HTTPS://APP.EXAMPLE.TEST' }],
    ['cross-site fetch metadata, even with the trusted Origin', none, { origin: SITE, 'sec-fetch-site': 'cross-site' }],
    ['loopback on another port under next dev', devServerOn4300, { origin: 'http://localhost:4301', host: 'localhost:4301' }],
    [
      'loopback under a production server',
      () => {
        setNodeEnv('production');
        process.env.PORT = '4300';
      },
      { origin: 'http://localhost:4300', host: 'localhost:4300' },
    ],
    [
      'any Origin when no trusted origin is configured',
      () => {
        delete process.env.NEXT_PUBLIC_SITE_URL;
      },
      { origin: APP_ORIGIN, host: 'localhost:3000' },
    ],
  ])('403 origin-rejected for %s — zero upstream and no auth lookup', async (_label, configure, headers) => {
    configure();
    const res = await call({}, headers);
    expect(res.status).toBe(403);
    await expect(errorCodeOf(res)).resolves.toBe('origin-rejected');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(createClient).not.toHaveBeenCalled();
  });
});

describe('input validation (400, zero upstream)', () => {
  it.each([
    ['non-JSON body', () => runPOST(post('/api/agent/run', 'not json'))],
    ['array body', () => runPOST(post('/api/agent/run', '[]'))],
    ['empty message', () => routes['POST run']({ message: '   ' })],
    ['oversize message', () => routes['POST run']({ message: 'x'.repeat(32_001) })],
    ['path-like session ID', () => routes['POST history']({ session_id: '../../list-apps' })],
    ['non-UUID create ID', () => routes['POST sessions']({ session_id: 'session-123' })],
    ['blank title', () => routes['POST sessions']({ title: '  ' })],
  ])('%s', async (_label, call) => {
    const res = await call();
    expect(res.status).toBe(400);
    await expect(errorCodeOf(res)).resolves.toBe('invalid-request');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('backend namespace key (AC004)', () => {
  it('normalizes endpoint identity and rejects userinfo, query and fragment', () => {
    expect(normalizeEndpoint('https://Bundle.Example.test:443/base/')).toBe('https://bundle.example.test/base');
    expect(normalizeEndpoint('https://user:pw@bundle.example.test')).toBeNull();
    expect(normalizeEndpoint('https://bundle.example.test/?a=1')).toBeNull();
    expect(normalizeEndpoint('https://bundle.example.test/?')).toBeNull();
    expect(normalizeEndpoint('https://bundle.example.test/#x')).toBeNull();
    expect(normalizeEndpoint('ftp://bundle.example.test')).toBeNull();
    expect(normalizeEndpoint(undefined)).toBeNull();
  });

  it('A/B/A: distinct endpoints on the same manifest bundle differ; restoring A restores its key', () => {
    liveEnv('http://127.0.0.1:41001');
    const a = resolveAgentTarget('greeting_agent').backendKey;
    liveEnv('http://127.0.0.1:41002');
    const b = resolveAgentTarget('greeting_agent').backendKey;
    liveEnv('http://127.0.0.1:41001');
    expect(resolveAgentTarget('greeting_agent').backendKey).toBe(a);
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[0-9a-f]{16}$/);
    expect(backendKeyFor('mock', 'v1', 'http://127.0.0.1:41001')).not.toBe(a);
  });

  it('rejects a configured endpoint carrying credentials as config-unavailable', async () => {
    liveEnv('https://user:secret@bundle.example.test');
    const res = await routes['POST run']();
    expect(res.status).toBe(503);
    expect(JSON.stringify(await res.json())).not.toMatch(/secret|bundle\.example/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('GET /api/agent/workspace descriptor (AC003–AC005)', () => {
  it('returns the verified user, opaque keys and roster availability without endpoints', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(['calc_agent', 'ghl_mcp_agent', 'greeting_agent', 'jarvis_agent', 'product_agent', 'utils']));
    const res = await workspaceGET(get('/api/agent/workspace'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toEqual({ id: USER_ID, email: 'tester@example.test' });
    expect(body.mode).toBe('live');
    expect(body.agents.map((a: { agent_name: string }) => a.agent_name)).not.toContain('utils');
    expect(body.agents.find((a: { agent_name: string }) => a.agent_name === 'moose_mcp_agent')).toEqual({
      agent_name: 'moose_mcp_agent',
      backend_key: liveKey(),
      availability: 'unavailable',
    });
    expect(body.agents.find((a: { agent_name: string }) => a.agent_name === 'greeting_agent').availability).toBe('available');
    expect(JSON.stringify(body)).not.toMatch(/bundle\.example|ADK_BUNDLE|https?:\/\//);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BUNDLE}/list-apps`);
  });

  it('caches the roster: a second descriptor and session routes add no roster reads', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(['greeting_agent']));
    await workspaceGET(get('/api/agent/workspace'));
    const second = await (await workspaceGET(get('/api/agent/workspace'))).json();
    expect(second.roster_checked_at).toEqual(expect.any(String));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('an unavailable agent is rejected by session routes from the cached roster, zero session upstream', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(['greeting_agent']));
    await workspaceGET(get('/api/agent/workspace'));
    const res = await routes['POST run']({ agent_name: 'moose_mcp_agent' });
    expect(res.status).toBe(503);
    await expect(errorCodeOf(res)).resolves.toBe('agent-unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('roster lookup failure is unknown — never fabricated absence', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('network down'));
    const body = await (await workspaceGET(get('/api/agent/workspace'))).json();
    expect(new Set(body.agents.map((a: { availability: string }) => a.availability))).toEqual(new Set(['unknown']));
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'Session not found' }, 404));
    expect((await routes['POST history']()).status).toBe(404);
  });

  it('401 without a verified user; unset bundle → config-unavailable agents', async () => {
    signOut();
    expect((await workspaceGET(get('/api/agent/workspace'))).status).toBe(401);
    signIn();
    delete process.env.ADK_BUNDLE_URL_V1;
    const body = await (await workspaceGET(get('/api/agent/workspace'))).json();
    expect(body.agents.every((a: { availability: string; backend_key: null }) => a.availability === 'config-unavailable' && a.backend_key === null)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mock mode issues mock keys and makes no upstream roster call', async () => {
    process.env.NEXT_PUBLIC_CHAT_MODE = 'mock';
    const body = await (await workspaceGET(get('/api/agent/workspace'))).json();
    expect(body.mode).toBe('mock');
    expect(body.agents[0].backend_key).toBe(backendKeyFor('mock', 'v1', 'mock'));
    expect(body.agents[0].backend_key).not.toBe(liveKey());
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
