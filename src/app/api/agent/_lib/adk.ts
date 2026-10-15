/**
 * Native ADK connector (BIM-002, reworked APBM001).
 *
 * Talks directly to the ADK bundle's `api_server` using the contract observed
 * on 14 October 2026: list/get/create-with-ID sessions and camelCase `/run`.
 * APBM001 supersedes the wrapper-era session bootstrap and the
 * not-found→create→retry loop (R001-06): a continuation never creates, and
 * every mutation is exactly one upstream attempt. Pure parsing functions are
 * fixture-testable without HTTP; malformed successful payloads are failures,
 * never empty results.
 *
 * Model-authored predicate (Architect FLAG-1 ruling): an event is a model
 * response iff `content.role === "model"` with a text part — real ADK events
 * carry `author: "<agent_name>"`, so author is never used for detection.
 *
 * @see agent_docs/ACTIONS/stark_agent_workspace_apbm_001/DATA_CONTRACT.md
 */

import type { ConversationRowWire, Message } from '@/types';

import { RouteError, withDeadline, type AgentTarget } from './context';

export const READ_TIMEOUT_MS = 60_000;
export const CREATE_TIMEOUT_MS = 60_000;
export const RUN_TIMEOUT_MS = 90_000;
export const TITLE_MAX_CHARS = 80;

interface AdkPart {
  text?: unknown;
  thought?: unknown;
}

interface AdkContent {
  role?: unknown;
  parts?: unknown;
}

interface AdkEvent {
  id?: unknown;
  invocationId?: unknown;
  content?: AdkContent;
}

/** Only an explicit 404 whose detail names the session is a missing conversation. */
export function isSessionNotFound(status: number, bodyText: string): boolean {
  return status === 404 && /session not found/i.test(bodyText);
}

/** Visible text of an event: non-thought text parts only (no thought/tool data). */
function eventText(event: AdkEvent, role: 'user' | 'model'): string | null {
  if (event?.content?.role !== role) return null;
  const parts = event.content.parts;
  if (!Array.isArray(parts)) return null;
  const texts = parts
    .filter((part: AdkPart) => part?.thought !== true)
    .map((part: AdkPart) => part?.text)
    .filter((text): text is string => typeof text === 'string' && text.length > 0);
  return texts.length ? texts.join('') : null;
}

/**
 * Reversed scan of a run's event array for the LAST model-authored text.
 * Returns null when no event qualifies.
 */
export function extractResponseText(events: unknown): string | null {
  if (!Array.isArray(events)) return null;
  for (let i = events.length - 1; i >= 0; i--) {
    const text = eventText(events[i] as AdkEvent, 'model');
    if (text !== null) return text;
  }
  return null;
}

/**
 * Session events → `Message[]`: role "model" → assistant, "user" → user;
 * visible text only, order preserved. A session without an events array is
 * malformed (null), which callers report as unavailable — never as empty.
 */
export function normalizeHistory(session: unknown): Message[] | null {
  const events = (session as { events?: unknown } | null)?.events;
  if (!Array.isArray(events)) return null;
  const history: Message[] = [];
  for (const raw of events) {
    const event = raw as AdkEvent;
    const role = event?.content?.role;
    if (role !== 'user' && role !== 'model') continue;
    const text = eventText(event, role);
    if (text === null) continue;
    history.push({ role: role === 'model' ? 'assistant' : 'user', content: text });
  }
  return history;
}

/** Initial title: whitespace collapsed, trimmed, at most 80 characters. */
export function normalizeTitle(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return Array.from(raw.replace(/\s+/g, ' ').trim())
    .slice(0, TITLE_MAX_CHARS)
    .join('')
    .trim();
}

/** Stable readable fallback for older untitled sessions. */
export const fallbackTitle = (sessionId: string): string =>
  `Conversation ${sessionId.slice(0, 8)}`;

/** ADK lastUpdateTime (epoch seconds) → ISO, or null when absent/invalid. */
function isoFromEpochSeconds(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Session[] → rows sorted newest-created first with a session-ID tie-break.
 * On this target lastUpdateTime stays at creation, so it is creation order,
 * never last activity. Any malformed row makes the whole list malformed.
 */
export function normalizeSessionList(
  payload: unknown,
  userId: string,
): ConversationRowWire[] | null {
  if (!Array.isArray(payload)) return null;
  const rows: Array<ConversationRowWire & { sortKey: number }> = [];
  for (const raw of payload) {
    const row = raw as {
      id?: unknown;
      userId?: unknown;
      state?: { title?: unknown } | null;
      lastUpdateTime?: unknown;
    } | null;
    if (!row || typeof row.id !== 'string' || !row.id) return null;
    if (typeof row.userId === 'string' && row.userId !== userId) return null;
    const stored = normalizeTitle(row.state?.title);
    const createdAt = isoFromEpochSeconds(row.lastUpdateTime);
    rows.push({
      session_id: row.id,
      title: stored || fallbackTitle(row.id),
      title_source: stored ? 'stored' : 'fallback',
      created_at: createdAt,
      sortKey: createdAt ? (row.lastUpdateTime as number) : -Infinity,
    });
  }
  rows.sort(
    (a, b) =>
      b.sortKey - a.sortKey ||
      (a.session_id < b.session_id ? -1 : a.session_id > b.session_id ? 1 : 0),
  );
  return rows.map(({ sortKey: _sortKey, ...row }) => row);
}

const enc = encodeURIComponent;

export function sessionsUrl(baseUrl: string, agentName: string, userId: string): string {
  return `${baseUrl}/apps/${enc(agentName)}/users/${enc(userId)}/sessions`;
}

export function sessionUrl(
  baseUrl: string,
  agentName: string,
  userId: string,
  sessionId: string,
): string {
  return `${sessionsUrl(baseUrl, agentName, userId)}/${enc(sessionId)}`;
}

/** The tested camelCase RunAgentRequest — never snake_case upstream. */
export function runRequestBody(
  agentName: string,
  userId: string,
  sessionId: string,
  message: string,
) {
  return {
    appName: agentName,
    userId,
    sessionId,
    newMessage: { role: 'user', parts: [{ text: message }] },
  };
}

// --- Upstream calls (one attempt each) -----------------------------------

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** Transport/timeout failure → sanitized code; the cause text never leaves the server. */
function transportFailure(e: unknown): RouteError {
  if (e instanceof Error && e.name === 'TimeoutError') {
    return new RouteError(504, 'upstream-timeout', 'Agent service timed out');
  }
  return new RouteError(502, 'upstream-unavailable', 'Agent service unavailable');
}

/** Non-2xx upstream status → sanitized code (body inspected, never echoed). */
async function statusFailure(
  res: Response,
  options: { sessionScoped: boolean },
): Promise<RouteError> {
  const bodyText = await res.text().catch(() => '');
  if (options.sessionScoped && isSessionNotFound(res.status, bodyText)) {
    return new RouteError(404, 'session-missing', 'Conversation not found');
  }
  if (res.status === 401 || res.status === 403) {
    return new RouteError(502, 'upstream-access', 'Agent service refused access');
  }
  if (res.status === 400 || res.status === 409 || res.status === 422) {
    return new RouteError(502, 'upstream-rejected', 'Agent service rejected the request');
  }
  return new RouteError(502, 'upstream-unavailable', 'Agent service unavailable');
}

const malformed = () =>
  new RouteError(502, 'upstream-malformed', 'Agent service returned an unexpected response');

async function call(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  signal: AbortSignal | undefined,
  options: { sessionScoped: boolean },
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: withDeadline(timeoutMs, signal) });
  } catch (e) {
    throw transportFailure(e);
  }
  if (!res.ok) throw await statusFailure(res, options);
  try {
    return await res.json();
  } catch (e) {
    if (e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
      throw transportFailure(e);
    }
    throw malformed();
  }
}

export async function listSessions(
  target: AgentTarget,
  userId: string,
  signal?: AbortSignal,
): Promise<ConversationRowWire[]> {
  const payload = await call(
    sessionsUrl(target.baseUrl, target.agent, userId),
    { method: 'GET' },
    READ_TIMEOUT_MS,
    signal,
    { sessionScoped: false },
  );
  const rows = normalizeSessionList(payload, userId);
  if (!rows) throw malformed();
  return rows;
}

export async function getSessionHistory(
  target: AgentTarget,
  userId: string,
  sessionId: string,
  signal?: AbortSignal,
): Promise<Message[]> {
  const payload = await call(
    sessionUrl(target.baseUrl, target.agent, userId, sessionId),
    { method: 'GET' },
    READ_TIMEOUT_MS,
    signal,
    { sessionScoped: true },
  );
  const history = normalizeHistory(payload);
  if (!history || (payload as { id?: unknown }).id !== sessionId) throw malformed();
  return history;
}

/** Create-with-ID: the request body is the initial session state. */
export async function createSession(
  target: AgentTarget,
  userId: string,
  sessionId: string,
  title: string,
  signal?: AbortSignal,
): Promise<{ createdAt: string | null }> {
  const payload = await call(
    sessionUrl(target.baseUrl, target.agent, userId, sessionId),
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ title }) },
    CREATE_TIMEOUT_MS,
    signal,
    { sessionScoped: false },
  );
  const session = payload as { id?: unknown; lastUpdateTime?: unknown } | null;
  if (!session || session.id !== sessionId) throw malformed();
  return { createdAt: isoFromEpochSeconds(session.lastUpdateTime) };
}

/** One camelCase /run on an existing session. 404 is missing — never recreated. */
export async function runTurn(
  target: AgentTarget,
  userId: string,
  sessionId: string,
  message: string,
  signal?: AbortSignal,
): Promise<{ reply: string; eventIds: string[]; invocationId: string | null }> {
  const events = await call(
    `${target.baseUrl}/run`,
    {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(runRequestBody(target.agent, userId, sessionId, message)),
    },
    RUN_TIMEOUT_MS,
    signal,
    { sessionScoped: true },
  );
  const reply = extractResponseText(events);
  if (reply === null) throw malformed();
  const list = events as AdkEvent[];
  const eventIds = list
    .map((event) => event?.id)
    .filter((id): id is string => typeof id === 'string');
  const invocation = list.find((event) => typeof event?.invocationId === 'string');
  return {
    reply,
    eventIds,
    invocationId: (invocation?.invocationId as string | undefined) ?? null,
  };
}
