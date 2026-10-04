import type { Message } from '@/types';

export interface WorkspaceAgent {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  backendId: string;
}
export interface Conversation {
  id: string;
  sessionId: string;
  title: string;
  updatedAt?: string;
}
export type Catalogue = {
  status: 'ready' | 'empty' | 'loading' | 'unavailable' | 'partial' | 'recovered';
  rows: Conversation[];
};
export type ThreadStatus = 'ready' | 'empty' | 'loading' | 'unavailable' | 'missing' | 'access-unavailable' | 'pending' | 'uncertain' | 'not-sent' | 'metadata-warning';
export interface Thread {
  status: ThreadStatus;
  messages: Message[];
  attemptedText?: string;
}
export type SendResult =
  | { status: 'sent'; sessionId: string; reply: string; metadataWarning?: boolean }
  | { status: 'uncertain' | 'not-sent' };
export interface WorkspaceServices {
  list(agentId: string): Promise<Catalogue>;
  history(agentId: string, sessionId: string): Promise<Thread>;
  send(agentId: string, sessionId: string | null, message: string): Promise<SendResult>;
  rename(row: Conversation, title: string): Promise<void>;
  archive(row: Conversation): Promise<void>;
}
