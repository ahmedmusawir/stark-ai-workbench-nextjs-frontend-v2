/**
 * Type contract for the Cyberize Agentic Automation frontend.
 *
 * All shapes here mirror `_project/DATA_CONTRACT.md` §1 exactly. Both the
 * mocked service layer (Phase 1) and the real backend (Phase 2 of the broader
 * lifecycle) must satisfy these types.
 *
 * Naming convention:
 *   - Wire shapes (request/response to/from the FastAPI wrapper): snake_case fields
 *   - UI-internal types: camelCase
 */

// =============================================================================
// Aliases and unions
// =============================================================================

/**
 * @see DATA_CONTRACT.md §1.1 as amended by BIM-003 (Amendment A3).
 * The compile-time union is retired: agent names are declared in
 * `config/agents.manifest.json` and validated at load by
 * `src/config/manifest.ts` (KNOWN_AGENTS). Unknown names are rejected
 * server-side with 400 — safety moved from the compiler to the manifest.
 */
export type AgentName = string;

/** @see DATA_CONTRACT.md §1.3 — only `'user'` and `'assistant'` appear in this codebase */
export type MessageRole = 'user' | 'assistant';

/** @see DATA_CONTRACT.md §1.11 — plain UTF-8 instruction text, one blob per agent */
export type InstructionBlob = string;

/** @see DATA_CONTRACT.md §1.8 — agent → session_id map, jsonb in Supabase */
export type AgentSessionMap = Record<AgentName | string, string>;

// =============================================================================
// Entities
// =============================================================================

/** @see DATA_CONTRACT.md §1.1 — frontend-only model; name is both ID and label */
export interface Agent {
  name: AgentName;
}

/** @see DATA_CONTRACT.md §1.2 — frontend reads only these two fields from Supabase */
export interface User {
  id: string;
  email: string;
}

/** @see DATA_CONTRACT.md §1.3 — single chat message; no id, no timestamp in wire format */
export interface Message {
  role: MessageRole;
  content: string;
}

/** @see DATA_CONTRACT.md §1.8 — user's row in `adk_n8n_hybrid_profiles` */
export interface ProfileRow {
  id: string;
  agent_sessions: AgentSessionMap;
}

/**
 * BIM-004 (Amendment A4) — one row of the chat_sessions INDEX.
 * Index fields ONLY: which sessions exist, never message content. The
 * transcript lives in ADK's store and arrives via chatService.getHistory.
 * (`user_id` stays server-side — RLS scopes rows; the client never needs it.)
 */
export interface SessionIndexEntry {
  id: string;
  agent_name: string;
  adk_session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

// =============================================================================
// Wrapper API — wire shapes (snake_case preserved)
// =============================================================================

/** @see DATA_CONTRACT.md §1.4 — outgoing payload for /run_agent */
export interface RunAgentRequest {
  agent_name: AgentName;
  message: string;
  user_id: string;
  session_id: string | null;
}

/** @see DATA_CONTRACT.md §1.5 — incoming response from /run_agent */
export interface RunAgentResponse {
  response: string;
  session_id: string;
}

/** @see DATA_CONTRACT.md §1.6 — outgoing payload for /get_history (APBM001 adds backend_key) */
export interface GetHistoryRequest {
  agent_name: AgentName;
  user_id: string;
  session_id: string;
  backend_key?: string;
}

/** @see DATA_CONTRACT.md §1.7 — incoming response from /get_history */
export interface GetHistoryResponse {
  history: Message[];
}

// =============================================================================
// APBM001 — ADK-backed workspace wire shapes (snake_case preserved)
// =============================================================================

/**
 * Structured, sanitized error codes for /api/agent/* (APBM001 DATA_CONTRACT).
 * Pre-upstream codes guarantee zero upstream contact; upstream codes describe
 * what the ADK bundle answered without echoing its body.
 */
export type AgentErrorCode =
  | 'invalid-request'
  | 'invalid-agent'
  | 'unauthenticated'
  | 'auth-unavailable'
  | 'identity-mismatch'
  | 'origin-rejected'
  | 'backend-changed'
  | 'config-unavailable'
  | 'agent-unavailable'
  | 'session-missing'
  | 'upstream-access'
  | 'upstream-rejected'
  | 'upstream-unavailable'
  | 'upstream-timeout'
  | 'upstream-malformed';

/** Every non-2xx /api/agent/* body. */
export interface AgentErrorBody {
  error: { code: AgentErrorCode; message: string };
}

/** One ADK session row. created_at is ADK lastUpdateTime, which this target keeps at creation. */
export interface ConversationRowWire {
  session_id: string;
  title: string;
  title_source: 'stored' | 'fallback';
  created_at: string | null;
}

/** GET /api/agent/sessions → 200 */
export interface ListSessionsResponse {
  status: 'ready' | 'empty';
  sessions: ConversationRowWire[];
  backend_key: string;
}

/** POST /api/agent/sessions → explicit create of a client-allocated UUID */
export interface CreateSessionRequest {
  agent_name: AgentName;
  session_id: string;
  title: string;
  backend_key?: string;
  user_id?: string;
}

/** POST /api/agent/sessions → 200 */
export interface CreateSessionResponse {
  status: 'created';
  session_id: string;
  title: string;
  created_at: string | null;
}

/** POST /api/agent/history → 200 (successful zero events is `empty`, never a failure) */
export interface HistoryResponseWire {
  status: 'ready' | 'empty';
  history: Message[];
}

/** POST /api/agent/run → continuation only; never creates or recreates a session */
export interface RunTurnRequest {
  agent_name: AgentName;
  session_id: string;
  message: string;
  backend_key?: string;
  user_id?: string;
}

/** POST /api/agent/run → 200 */
export interface RunTurnResponse {
  status: 'sent';
  response: string;
  session_id: string;
  event_ids: string[];
  invocation_id: string | null;
}

export type AgentAvailability =
  | 'available'
  | 'unavailable'
  | 'unknown'
  | 'config-unavailable';

/** GET /api/agent/workspace → non-secret identity/config descriptor */
export interface WorkspaceDescriptor {
  user: { id: string; email: string | null };
  mode: 'live' | 'mock';
  supabase_ref: string | null;
  agents: Array<{
    agent_name: AgentName;
    backend_key: string | null;
    availability: AgentAvailability;
  }>;
  roster_checked_at: string | null;
}

// =============================================================================
// APBM001 — chatService explicit outcomes (UI-internal camelCase)
// =============================================================================

export interface ConversationSummary {
  sessionId: string;
  title: string;
  titleSource: 'stored' | 'fallback';
  /** Creation order on this target — never presented as last activity. */
  createdAt: string | null;
}

/** Failures a read can report; none of them is an empty result. */
export type ReadFailureStatus =
  | 'unavailable'
  | 'access-unavailable'
  | 'agent-unavailable'
  | 'backend-changed';

export type ListConversationsResult =
  | { status: 'ready' | 'empty'; conversations: ConversationSummary[] }
  | { status: ReadFailureStatus; conversations: [] };

/** R001-05: replaces the old error-to-[] history contract. */
export interface HistoryResult {
  status: 'ready' | 'empty' | 'missing' | ReadFailureStatus;
  messages: Message[];
}

/**
 * Write failures. `not-sent` = definitively not delivered (rejected before or
 * by upstream validation); `uncertain` = dispatched with unknown outcome.
 */
export type WriteFailureStatus =
  | 'not-sent'
  | 'uncertain'
  | 'missing'
  | 'access-unavailable'
  | 'agent-unavailable'
  | 'backend-changed';

export type CreateConversationResult =
  | { status: 'created'; sessionId: string; title: string; createdAt: string | null }
  | { status: WriteFailureStatus; code: AgentErrorCode | null };

export type RunTurnResult =
  | {
      status: 'sent';
      sessionId: string;
      reply: string;
      eventIds: string[];
      invocationId: string | null;
    }
  | { status: WriteFailureStatus; code: AgentErrorCode | null };

export type WorkspaceDescriptorResult =
  | { status: 'ready'; descriptor: WorkspaceDescriptor }
  | { status: 'unauthenticated' | 'unavailable' };

// =============================================================================
// Auth — Supabase shapes
// =============================================================================

/** @see DATA_CONTRACT.md §1.9 — outgoing payload for Supabase auth */
export interface LoginRequest {
  email: string;
  password: string;
}

/** @see DATA_CONTRACT.md §1.10 — subset of Supabase auth response the frontend reads */
export interface LoginResponse {
  session: {
    user: {
      id: string;
      email: string;
    };
  };
}

// =============================================================================
// Runtime configuration
// =============================================================================

/** @see DATA_CONTRACT.md §1.12 — runtime configuration loaded at boot */
export interface AppConfig {
  appEnv: 'local' | 'cloud';
  wrapperUrl: string;
  agentOptions: AgentName[];
}
