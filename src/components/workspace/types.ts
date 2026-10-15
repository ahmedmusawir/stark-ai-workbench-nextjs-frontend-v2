import type { AgentAvailability, Message } from '@/types';

export interface WorkspaceAgent {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  backendId: string;
  /** Opaque namespace key from the server descriptor; links and caches are scoped by it. */
  backendKey?: string;
  availability?: AgentAvailability;
}
export interface Conversation {
  /** Stable scoped row key. */
  id: string;
  sessionId: string;
  title: string;
  /** Creation order on this target, never last activity. */
  createdAt?: string;
}
export type Catalogue = {
  status: 'ready' | 'empty' | 'loading' | 'unavailable' | 'access-unavailable' | 'agent-unavailable' | 'backend-changed';
  rows: Conversation[];
};
export type ThreadStatus = 'ready' | 'empty' | 'loading' | 'unavailable' | 'missing' | 'access-unavailable' | 'agent-unavailable' | 'backend-changed' | 'pending' | 'uncertain' | 'not-sent' | 'storage-unavailable';
export interface Thread {
  status: ThreadStatus;
  messages: Message[];
  attemptedText?: string;
  /** Uncertain only: the latest read-only history check succeeded. */
  reviewed?: boolean;
  /** Uncertain only: what that successful check found. */
  historyStatus?: 'ready' | 'empty' | 'missing';
}
export type WriteFailure = 'not-sent' | 'uncertain' | 'missing' | 'access-unavailable' | 'agent-unavailable' | 'backend-changed';
export type CreateResult = { status: 'created' } | { status: WriteFailure };
export type SendResult = { status: 'sent'; reply: string } | { status: WriteFailure };
/** Rename/archive are deferred for APBM001 (R001-03); no metadata writes exist. */
export interface WorkspaceServices {
  list(agentId: string, signal?: AbortSignal): Promise<Catalogue>;
  history(agentId: string, sessionId: string, signal?: AbortSignal): Promise<Thread>;
  /** Explicit create of a caller-allocated ID; the title derives from the first message. */
  create(agentId: string, sessionId: string, firstMessage: string): Promise<CreateResult>;
  /** One continuation run on an existing session. */
  send(agentId: string, sessionId: string, message: string): Promise<SendResult>;
}
