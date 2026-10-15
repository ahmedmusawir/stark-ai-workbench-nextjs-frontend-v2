/**
 * Shared server boundary for the owned /api/agent/* routes (APBM001).
 *
 * Order on every route: same-origin check (state changes) → verified Supabase
 * user → supplied user_id must match (R001-11) → manifest agent → configured
 * bundle endpoint → opaque backendKey → stale-key check. Every step runs
 * before any upstream contact, so each rejection here guarantees zero ADK
 * traffic. Errors are `{ error: { code, message } }` with sanitized text only.
 *
 * @see agent_docs/ACTIONS/stark_agent_workspace_apbm_001/DATA_CONTRACT.md
 */

import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

import { MANIFEST } from '@/config/manifest';
import type { AgentAvailability, AgentErrorCode } from '@/types';
import { createClient } from '@/utils/supabase/server';

/** A rejection with its HTTP status and structured code. */
export class RouteError extends Error {
  readonly status: number;
  readonly code: AgentErrorCode;

  constructor(status: number, code: AgentErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** Unknown throwables never leak their text to the browser. */
export function errorResponse(e: unknown): NextResponse {
  const err =
    e instanceof RouteError
      ? e
      : new RouteError(502, 'upstream-unavailable', 'Agent service unavailable');
  return NextResponse.json(
    { error: { code: err.code, message: err.message } },
    { status: err.status },
  );
}

export type ChatMode = 'live' | 'mock';

export const chatMode = (): ChatMode =>
  process.env.NEXT_PUBLIC_CHAT_MODE === 'live' ? 'live' : 'mock';

/** A configured value's full origin; anything but plain http(s) grants nothing. */
function originOf(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Server-owned allowlist of full origins (scheme, hostname, port) for
 * state-changing browser routes (AC025). Nothing comes from the request:
 * Host, X-Forwarded-* and Forwarded are never read, so no proxy is trusted.
 * A proxied deployment names its public origin in NEXT_PUBLIC_SITE_URL.
 * - NEXT_PUBLIC_SITE_URL: the configured deployment origin;
 * - AGENT_TRUSTED_ORIGINS: optional comma-separated extra origins, read at
 *   runtime (e.g. a local `next start` test server on its own port);
 * - `next dev` only: http://localhost and http://127.0.0.1 at PORT, the port
 *   Next itself is listening on.
 */
export function trustedOrigins(): Set<string> {
  const origins = new Set<string>();
  const add = (value: string | undefined) => {
    const origin = originOf(value);
    if (origin) origins.add(origin);
  };
  add(process.env.NEXT_PUBLIC_SITE_URL);
  for (const entry of (process.env.AGENT_TRUSTED_ORIGINS ?? '').split(',')) add(entry);
  const port = process.env.PORT;
  if (process.env.NODE_ENV === 'development' && port && /^\d+$/.test(port)) {
    add(`http://localhost:${port}`);
    add(`http://127.0.0.1:${port}`);
  }
  return origins;
}

/**
 * Same-origin policy for state-changing browser routes (AC025). The Origin
 * header must exactly equal a trusted origin's serialized form, which is the
 * form browsers send; anything else (missing, "null", malformed, a path,
 * other case) is refused. Runs before auth, body parsing and upstream contact.
 */
export function assertSameOrigin(req: Request): void {
  const origin = req.headers.get('origin');
  if (
    req.headers.get('sec-fetch-site') === 'cross-site' ||
    !origin ||
    !trustedOrigins().has(origin)
  ) {
    throw new RouteError(403, 'origin-rejected', 'Cross-origin request rejected');
  }
}

export interface VerifiedUser {
  id: string;
  email: string | null;
}

/** The verified Supabase user — never the browser's auth cache. */
export async function requireUser(): Promise<VerifiedUser> {
  let result;
  try {
    const supabase = await createClient();
    result = await supabase.auth.getUser();
  } catch {
    throw new RouteError(503, 'auth-unavailable', 'Sign-in service unavailable');
  }
  const { data, error } = result;
  if (error?.name === 'AuthRetryableFetchError') {
    throw new RouteError(503, 'auth-unavailable', 'Sign-in service unavailable');
  }
  if (error || !data?.user?.id) {
    throw new RouteError(401, 'unauthenticated', 'Sign in to continue');
  }
  return { id: data.user.id, email: data.user.email ?? null };
}

/** A supplied user_id is an assertion only; a mismatch is refused (403). */
export function assertUserMatch(supplied: unknown, user: VerifiedUser): void {
  if (supplied === undefined || supplied === null || supplied === '') return;
  if (supplied !== user.id) {
    throw new RouteError(
      403,
      'identity-mismatch',
      'The request does not match the signed-in user',
    );
  }
}

/**
 * Normalized non-secret endpoint identity: scheme, host, port and base path.
 * Userinfo, query and fragment are refused outright (null = not configured).
 */
export function normalizeEndpoint(raw: string | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  const trimmed = raw.trim();
  if (/[?#]/.test(trimmed)) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password) return null;
  return `${url.protocol}//${url.host}${url.pathname.replace(/\/+$/, '')}`;
}

/** Stable opaque namespace discriminator — not a credential (AC004). */
export function backendKeyFor(
  mode: ChatMode,
  bundleId: string,
  endpoint: string,
): string {
  return createHash('sha256')
    .update(JSON.stringify(['apbm001-backend-v1', mode, bundleId, endpoint]))
    .digest('hex')
    .slice(0, 16);
}

export interface AgentTarget {
  agent: string;
  bundleId: string;
  baseUrl: string;
  backendKey: string;
}

/** Manifest agent → configured live target. Mock mode never reaches ADK. */
export function resolveAgentTarget(agent: unknown): AgentTarget {
  const entry =
    typeof agent === 'string'
      ? MANIFEST.agents.find((a) => a.name === agent)
      : undefined;
  if (!entry) throw new RouteError(400, 'invalid-agent', 'Unknown agent');
  const bundle = MANIFEST.bundles.find((b) => b.id === entry.bundle);
  const endpoint = bundle ? normalizeEndpoint(process.env[bundle.urlEnv]) : null;
  if (chatMode() !== 'live' || !bundle || !endpoint) {
    throw new RouteError(
      503,
      'config-unavailable',
      'Agent service is not configured',
    );
  }
  return {
    agent: entry.name,
    bundleId: bundle.id,
    baseUrl: endpoint,
    backendKey: backendKeyFor('live', bundle.id, endpoint),
  };
}

/** A supplied backend key must name the current target (409, zero upstream). */
export function assertBackendKey(supplied: unknown, target: AgentTarget): void {
  if (supplied === undefined || supplied === null || supplied === '') return;
  if (supplied !== target.backendKey) {
    throw new RouteError(
      409,
      'backend-changed',
      'The workspace configuration changed. Reload the conversation list.',
    );
  }
}

// --- Input validation (400, zero upstream) --------------------------------

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Existing sessions include wrapper-era IDs such as `session-1759…`.
const SESSION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
export const MESSAGE_MAX_CHARS = 32_000;

const invalid = (message: string) =>
  new RouteError(400, 'invalid-request', message);

export async function readJsonObject(req: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw invalid('Request body must be JSON');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw invalid('Request body must be a JSON object');
  }
  return body as Record<string, unknown>;
}

/** New sessions must be client-allocated UUIDs; existing IDs keep a safe charset. */
export function requireSessionId(value: unknown, options: { uuid: boolean }): string {
  const pattern = options.uuid ? UUID_PATTERN : SESSION_ID_PATTERN;
  if (typeof value !== 'string' || !pattern.test(value)) {
    throw invalid('Invalid conversation ID');
  }
  return value;
}

export function requireMessage(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > MESSAGE_MAX_CHARS) {
    throw invalid('Message must be non-empty text within the size limit');
  }
  return value;
}

/**
 * The pre-upstream gate shared by every session operation. State-changing
 * routes call assertSameOrigin first, before reading the body.
 */
export async function authorizeAgentRequest(input: {
  agent: unknown;
  userId?: unknown;
  backendKey?: unknown;
}): Promise<{ user: VerifiedUser; target: AgentTarget }> {
  const user = await requireUser();
  assertUserMatch(input.userId, user);
  const target = resolveAgentTarget(input.agent);
  assertBackendKey(input.backendKey, target);
  if (cachedAvailability(target) === 'unavailable') {
    throw new RouteError(
      503,
      'agent-unavailable',
      'This agent is not available on the current agent service',
    );
  }
  return { user, target };
}

// --- Agent roster (/list-apps) -------------------------------------------

const ROSTER_TTL_MS = 10 * 60_000;
const ROSTER_FAILURE_TTL_MS = 30_000;
export const ROSTER_TIMEOUT_MS = 60_000;

interface RosterEntry {
  checkedAt: number;
  apps: string[] | null; // null = lookup failed (availability unknown)
}

// globalThis survives per-route bundling in one server process, so every
// route shares one bounded cache instead of re-reading the roster.
const rosterGlobal = globalThis as typeof globalThis & {
  __apbm001Roster?: Map<string, RosterEntry>;
};
const rosterCache = (rosterGlobal.__apbm001Roster ??= new Map());

export function resetRosterCacheForTests(): void {
  rosterCache.clear();
}

function freshRoster(backendKey: string): RosterEntry | undefined {
  const entry = rosterCache.get(backendKey);
  if (!entry) return undefined;
  const ttl = entry.apps ? ROSTER_TTL_MS : ROSTER_FAILURE_TTL_MS;
  return Date.now() - entry.checkedAt < ttl ? entry : undefined;
}

/** Cache-only view used by session routes; never fetches. */
export function cachedAvailability(target: AgentTarget): AgentAvailability {
  const entry = freshRoster(target.backendKey);
  if (!entry?.apps) return 'unknown';
  return entry.apps.includes(target.agent) ? 'available' : 'unavailable';
}

/** Bounded roster read; failure is recorded as unknown, never as absence. */
export async function loadRoster(
  target: AgentTarget,
  signal?: AbortSignal,
): Promise<RosterEntry> {
  const cached = freshRoster(target.backendKey);
  if (cached) return cached;
  let apps: string[] | null = null;
  try {
    const res = await fetch(`${target.baseUrl}/list-apps`, {
      method: 'GET',
      signal: withDeadline(ROSTER_TIMEOUT_MS, signal),
    });
    if (res.ok) {
      const body: unknown = await res.json();
      if (Array.isArray(body) && body.every((x) => typeof x === 'string')) {
        apps = body;
      }
    }
  } catch {
    apps = null;
  }
  const entry = { checkedAt: Date.now(), apps };
  rosterCache.set(target.backendKey, entry);
  return entry;
}

/** Upstream deadline that also follows the browser's cancellation. */
export function withDeadline(ms: number, signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(ms);
  return signal ? AbortSignal.any([timeout, signal]) : timeout;
}

/** Public project reference only (the browser bundle already carries it). */
export function supabaseProjectRef(): string | null {
  try {
    const host = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname;
    const match = /^([a-z0-9]+)\.supabase\.co$/.exec(host);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
