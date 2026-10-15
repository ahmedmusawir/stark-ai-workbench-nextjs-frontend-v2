/**
 * Route-test harness (APBM001): verified-user doubles for the Supabase server
 * helper and same-origin request builders. Each suite must declare
 * `jest.mock('@/utils/supabase/server', () => ({ createClient: jest.fn() }))`.
 */

import { createClient } from '@/utils/supabase/server';

export const USER_ID = 'user-verified-1';
export const BUNDLE = 'https://bundle.example.test';
export const APP_ORIGIN = 'http://localhost:3000';

function authResult(result: { data: { user: unknown }; error: unknown }) {
  jest.mocked(createClient).mockResolvedValue({
    auth: { getUser: jest.fn().mockResolvedValue(result) },
  } as never);
}

export const signIn = (id = USER_ID) =>
  authResult({ data: { user: { id, email: 'tester@example.test' } }, error: null });
export const signOut = () =>
  authResult({ data: { user: null }, error: { name: 'AuthSessionMissingError' } });
export const authOutage = () =>
  authResult({ data: { user: null }, error: { name: 'AuthRetryableFetchError' } });

export function liveEnv(bundle = BUNDLE) {
  process.env.NEXT_PUBLIC_CHAT_MODE = 'live';
  process.env.ADK_BUNDLE_URL_V1 = bundle;
}

const SAME_ORIGIN = { origin: APP_ORIGIN, host: 'localhost:3000' };

export function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${APP_ORIGIN}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...SAME_ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

export function get(path: string, headers: Record<string, string> = {}) {
  return new Request(`${APP_ORIGIN}${path}`, { method: 'GET', headers: { host: 'localhost:3000', ...headers } });
}

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

export const errorCodeOf = async (res: Response) =>
  ((await res.json()) as { error: { code: string } }).error.code;
