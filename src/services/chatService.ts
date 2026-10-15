/**
 * chatService — mode-flagged (BIM-001), explicit outcomes (APBM001).
 *
 * `NEXT_PUBLIC_CHAT_MODE=live` routes chat through the internal /api/agent/*
 * handlers to the ADK bundle (native, BIM-002). Any other value (or unset) keeps the
 * Phase-3 mock path — the app must never accidentally ship live-wired.
 *
 * APBM001 (R001-05/R001-06): reads and writes return explicit outcomes —
 * a failure is never an empty list or empty history, and a dispatched write
 * whose result is unknown is `uncertain`, never retried or replayed here.
 * The ADK session list is the conversation catalogue (no chat_sessions).
 *
 * @see agent_docs/ACTIONS/stark_agent_workspace_apbm_001/DATA_CONTRACT.md
 * @see agent_docs/CURRENT_APP/BIM001/DATA_CONTRACT_AMENDMENT.md §A1.3–§A1.4
 */

import { mockMessagesBySession } from '@/mocks/data/messages';
import { mockSessionIndex, newMockRowId } from '@/mocks/data/sessionIndex';
import { generateMockResponse } from '@/mocks/responses';
import type {
  AgentErrorBody,
  AgentErrorCode,
  AgentName,
  CreateConversationResult,
  CreateSessionResponse,
  GetHistoryRequest,
  HistoryResponseWire,
  HistoryResult,
  ListConversationsResult,
  ListSessionsResponse,
  ReadFailureStatus,
  RunAgentRequest,
  RunAgentResponse,
  RunTurnResponse,
  RunTurnResult,
  WorkspaceDescriptor,
  WorkspaceDescriptorResult,
  WriteFailureStatus,
} from '@/types';

const SEND_DELAY_MS = 1000; // visibility for "Agent is thinking..." in Phase 5
const HISTORY_DELAY_MS = 200;

// Browser deadlines exceed the server's 60s read/create and 90s run budgets
// by a small margin so the server's structured outcome normally arrives first.
const READ_TIMEOUT_MS = 65_000;
const CREATE_TIMEOUT_MS = 65_000;
const RUN_TIMEOUT_MS = 95_000;

export const TITLE_MAX_CHARS = 80;

// Read at call time; Next.js inlines NEXT_PUBLIC_* statically in the client
// bundle either way, and Jest can flip the flag per-test.
const isLive = () => process.env.NEXT_PUBLIC_CHAT_MODE === 'live';

/** Initial ADK title from the first message: collapsed, trimmed, ≤80 chars. No model call. */
export function conversationTitle(message: string): string {
  return Array.from(message.replace(/\s+/g, ' ').trim())
    .slice(0, TITLE_MAX_CHARS)
    .join('')
    .trim();
}

/** Codes the server returns before contacting ADK — the write was not sent. */
const PRE_UPSTREAM_CODES = new Set<AgentErrorCode>([
  'invalid-request',
  'invalid-agent',
  'auth-unavailable',
  'origin-rejected',
  'config-unavailable',
]);

function readFailure(code: AgentErrorCode | null): ReadFailureStatus | 'missing' {
  if (code === 'session-missing') return 'missing';
  if (code === 'unauthenticated' || code === 'identity-mismatch' || code === 'upstream-access') {
    return 'access-unavailable';
  }
  if (code === 'backend-changed' || code === 'agent-unavailable') return code;
  return 'unavailable';
}

/** Only definitive answers are not-sent; anything after dispatch is uncertain. */
function writeFailure(code: AgentErrorCode | null): WriteFailureStatus {
  if (code === 'session-missing') return 'missing';
  if (code === 'unauthenticated' || code === 'identity-mismatch' || code === 'upstream-access') {
    return 'access-unavailable';
  }
  if (code === 'backend-changed' || code === 'agent-unavailable') return code;
  if (code === 'upstream-rejected' || (code && PRE_UPSTREAM_CODES.has(code))) return 'not-sent';
  return 'uncertain';
}

async function errorCode(res: Response): Promise<AgentErrorCode | null> {
  try {
    const body = (await res.json()) as Partial<AgentErrorBody>;
    return typeof body.error?.code === 'string' ? body.error.code : null;
  } catch {
    return null;
  }
}

function deadline(ms: number, signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(ms);
  if (!signal) return timeout;
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([timeout, signal]);
  const controller = new AbortController();
  for (const source of [timeout, signal]) {
    if (source.aborted) controller.abort(source.reason);
    else source.addEventListener('abort', () => controller.abort(source.reason), { once: true });
  }
  return controller.signal;
}

const postJson = (url: string, body: unknown, ms: number, signal?: AbortSignal) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: deadline(ms, signal),
  });

export interface WriteOptions {
  backendKey?: string;
  userId?: string;
}

export const chatService = {
  /**
   * Non-secret identity/config descriptor from the server (both modes): the
   * verified user, mode and per-agent backend key/availability.
   */
  getWorkspace: async (signal?: AbortSignal): Promise<WorkspaceDescriptorResult> => {
    try {
      const res = await fetch('/api/agent/workspace', {
        method: 'GET',
        cache: 'no-store',
        signal: deadline(READ_TIMEOUT_MS, signal),
      });
      if (res.status === 401) return { status: 'unauthenticated' };
      if (!res.ok) return { status: 'unavailable' };
      const descriptor = (await res.json()) as WorkspaceDescriptor;
      if (typeof descriptor?.user?.id !== 'string' || !descriptor.user.id || !Array.isArray(descriptor.agents)) {
        return { status: 'unavailable' };
      }
      return { status: 'ready', descriptor };
    } catch {
      return { status: 'unavailable' };
    }
  },

  /** ADK session catalogue for one agent, newest-created first. */
  listConversations: async (
    agent: AgentName,
    options: WriteOptions = {},
    signal?: AbortSignal,
  ): Promise<ListConversationsResult> => {
    if (isLive()) {
      try {
        const params = new URLSearchParams({ agent_name: agent });
        if (options.backendKey) params.set('backend_key', options.backendKey);
        if (options.userId) params.set('user_id', options.userId);
        const res = await fetch(`/api/agent/sessions?${params}`, {
          method: 'GET',
          cache: 'no-store',
          signal: deadline(READ_TIMEOUT_MS, signal),
        });
        if (!res.ok) {
          const status = readFailure(await errorCode(res));
          return { status: status === 'missing' ? 'unavailable' : status, conversations: [] };
        }
        const data = (await res.json()) as ListSessionsResponse;
        if (!Array.isArray(data?.sessions) || (data.status !== 'ready' && data.status !== 'empty')) {
          return { status: 'unavailable', conversations: [] };
        }
        return {
          status: data.sessions.length ? 'ready' : 'empty',
          conversations: data.sessions.map((row) => ({
            sessionId: row.session_id,
            title: row.title,
            titleSource: row.title_source,
            createdAt: row.created_at,
          })),
        };
      } catch {
        return { status: 'unavailable', conversations: [] };
      }
    }

    await new Promise((r) => setTimeout(r, HISTORY_DELAY_MS));
    const conversations = mockSessionIndex
      .filter((row) => row.agent_name === agent && !row.archived)
      .sort(
        (a, b) =>
          b.created_at.localeCompare(a.created_at) ||
          a.adk_session_id.localeCompare(b.adk_session_id),
      )
      .map((row) => ({
        sessionId: row.adk_session_id,
        title: row.title,
        titleSource: 'stored' as const,
        createdAt: row.created_at,
      }));
    return { status: conversations.length ? 'ready' : 'empty', conversations };
  },

  /** Explicit create of a caller-allocated UUID with its initial title. One attempt. */
  createConversation: async (
    agent: AgentName,
    sessionId: string,
    title: string,
    options: WriteOptions = {},
  ): Promise<CreateConversationResult> => {
    if (isLive()) {
      let res: Response;
      try {
        res = await postJson(
          '/api/agent/sessions',
          {
            agent_name: agent,
            session_id: sessionId,
            title,
            backend_key: options.backendKey,
            user_id: options.userId,
          },
          CREATE_TIMEOUT_MS,
        );
      } catch {
        // The request may have reached the server; existence is unknown.
        return { status: 'uncertain', code: null };
      }
      if (!res.ok) {
        const code = await errorCode(res);
        return { status: writeFailure(code), code };
      }
      try {
        const data = (await res.json()) as CreateSessionResponse;
        if (data?.status !== 'created' || data.session_id !== sessionId) {
          return { status: 'uncertain', code: null };
        }
        return { status: 'created', sessionId, title: data.title, createdAt: data.created_at };
      } catch {
        return { status: 'uncertain', code: null };
      }
    }

    await new Promise((r) => setTimeout(r, HISTORY_DELAY_MS));
    const now = new Date().toISOString();
    mockSessionIndex.push({
      id: newMockRowId(),
      agent_name: agent,
      adk_session_id: sessionId,
      title,
      created_at: now,
      updated_at: now,
      archived: false,
    });
    return { status: 'created', sessionId, title, createdAt: now };
  },

  /** One continuation run on an existing session. Never creates, retries or resends. */
  runTurn: async (
    agent: AgentName,
    sessionId: string,
    message: string,
    options: WriteOptions = {},
  ): Promise<RunTurnResult> => {
    if (isLive()) {
      let res: Response;
      try {
        res = await postJson(
          '/api/agent/run',
          {
            agent_name: agent,
            session_id: sessionId,
            message,
            backend_key: options.backendKey,
            user_id: options.userId,
          },
          RUN_TIMEOUT_MS,
        );
      } catch {
        return { status: 'uncertain', code: null };
      }
      if (!res.ok) {
        const code = await errorCode(res);
        return { status: writeFailure(code), code };
      }
      try {
        const data = (await res.json()) as RunTurnResponse;
        if (data?.status !== 'sent' || typeof data.response !== 'string' || data.session_id !== sessionId) {
          return { status: 'uncertain', code: null };
        }
        return {
          status: 'sent',
          sessionId,
          reply: data.response,
          eventIds: Array.isArray(data.event_ids) ? data.event_ids : [],
          invocationId: data.invocation_id ?? null,
        };
      } catch {
        return { status: 'uncertain', code: null };
      }
    }

    await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
    const mock = generateMockResponse(agent, message, sessionId);
    return { status: 'sent', sessionId, reply: mock.response, eventIds: [], invocationId: null };
  },

  /**
   * Conversation history with an explicit outcome (R001-05). Live: falsy
   * session_id → empty with zero HTTP. Successful zero events is `empty`;
   * 404 session is `missing`; every other failure is a distinct status.
   * Mock: the seeded conversation for known session_ids; empty otherwise.
   */
  getHistory: async (input: GetHistoryRequest, signal?: AbortSignal): Promise<HistoryResult> => {
    if (isLive()) {
      if (!input.session_id) return { status: 'empty', messages: [] };
      try {
        const res = await postJson('/api/agent/history', input, READ_TIMEOUT_MS, signal);
        if (!res.ok) return { status: readFailure(await errorCode(res)), messages: [] };
        const data = (await res.json()) as HistoryResponseWire;
        if (!Array.isArray(data?.history) || (data.status !== 'ready' && data.status !== 'empty')) {
          return { status: 'unavailable', messages: [] };
        }
        return { status: data.history.length ? 'ready' : 'empty', messages: data.history };
      } catch (e) {
        console.error('chatService.getHistory failed:', e);
        return { status: 'unavailable', messages: [] };
      }
    }

    await new Promise((r) => setTimeout(r, HISTORY_DELAY_MS));
    const messages = mockMessagesBySession[input.session_id] ?? [];
    return { status: messages.length ? 'ready' : 'empty', messages };
  },

  /**
   * LEGACY compatibility adapter (D1(b) sentinel) for the pre-workspace chat
   * consumer. Live: a null session_id now means explicit UUID create, then one
   * run — the server no longer bootstraps or recreates sessions. Any failure
   * resolves with the sentinel error string; it never retries.
   * Mock: deterministic agent-voiced response via generateMockResponse.
   */
  sendMessage: async (input: RunAgentRequest): Promise<RunAgentResponse> => {
    if (isLive()) {
      const options = { userId: input.user_id };
      let sessionId = input.session_id;
      const sentinel = (status: string): RunAgentResponse => ({
        response: `Error: Could not reach Agent Service. Details: ${status}`,
        session_id: sessionId ?? '',
      });
      if (!sessionId) {
        const allocated = crypto.randomUUID();
        const created = await chatService.createConversation(
          input.agent_name,
          allocated,
          conversationTitle(input.message) || 'New conversation',
          options,
        );
        if (created.status !== 'created') return { ...sentinel(created.status), session_id: '' };
        sessionId = allocated;
      }
      const result = await chatService.runTurn(input.agent_name, sessionId, input.message, options);
      if (result.status !== 'sent') return sentinel(result.status);
      return { response: result.reply, session_id: result.sessionId };
    }

    await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
    return generateMockResponse(
      input.agent_name,
      input.message,
      input.session_id,
    );
  },
};

/**
 * BACKEND_SWAP_NOTES (amended by BIM-001 §A1.1; APBM001 explicit outcomes)
 *
 * The seam: service methods call internal Next.js route handlers, which talk
 * server-side to the ADK bundle's api_server directly. This service and every
 * component above it stay put across backend swaps.
 *
 * Method             | Endpoint                     | Timeout | Notes
 * -------------------|------------------------------|---------|----------------------------------------
 * getWorkspace       | GET  /api/agent/workspace    | 65s     | Verified user + backend keys + availability
 * listConversations  | GET  /api/agent/sessions     | 65s     | ready/empty vs distinct failures
 * createConversation | POST /api/agent/sessions     | 65s     | Caller-allocated UUID + initial title
 * runTurn            | POST /api/agent/run          | 95s     | Continuation only; uncertain after dispatch
 * getHistory         | POST /api/agent/history      | 65s     | ready/empty/missing/unavailable/access
 * sendMessage        | create (if new) + run        | —       | Legacy sentinel adapter, no retries
 *
 * Error bodies are `{ error: { code, message } }`; codes are classified, never
 * shown raw. App wire format stays snake_case; ADK upstream is camelCase.
 */
