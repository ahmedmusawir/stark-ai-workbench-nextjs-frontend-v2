import { chatService, conversationTitle } from '@/services/chatService';
import { workspaceAgentsForUi } from '@/config/manifest';
import type { WorkspaceDescriptor } from '@/types';
import type { WorkspaceAgent, WorkspaceServices } from './types';

/** Server-verified identity/config for the workspace (never the browser auth cache). */
export const loadWorkspaceDescriptor = (signal?: AbortSignal) => chatService.getWorkspace(signal);

/** Manifest roster stays authoritative for listing; the descriptor only adds key/availability. */
export function workspaceAgentsFor(descriptor: WorkspaceDescriptor | null): WorkspaceAgent[] {
  return workspaceAgentsForUi().map(agent => {
    const entry = descriptor?.agents.find(a => a.agent_name === agent.id);
    return entry ? { ...agent, backendKey: entry.backend_key ?? undefined, availability: entry.availability } : agent;
  });
}

/** Boundary adapter: explicit service outcomes → workspace states. ADK is the only catalogue. */
export function createProductionWorkspaceServices(descriptor: WorkspaceDescriptor): WorkspaceServices {
  const backendKey = (agentId: string) => descriptor.agents.find(a => a.agent_name === agentId)?.backend_key ?? undefined;
  const options = (agentId: string) => ({ backendKey: backendKey(agentId), userId: descriptor.user.id });
  return {
    async list(agentId, signal) {
      const result = await chatService.listConversations(agentId, options(agentId), signal);
      if (result.status !== 'ready' && result.status !== 'empty') return { status: result.status, rows: [] };
      const scope = backendKey(agentId) ?? descriptor.mode;
      return { status: result.status, rows: result.conversations.map(row => ({ id: `${scope}:${row.sessionId}`, sessionId: row.sessionId, title: row.title, createdAt: row.createdAt ?? undefined })) };
    },
    async history(agentId, sessionId, signal) {
      const result = await chatService.getHistory({ agent_name: agentId, user_id: descriptor.user.id, session_id: sessionId, backend_key: backendKey(agentId) }, signal);
      return { status: result.status, messages: result.messages };
    },
    async create(agentId, sessionId, firstMessage) {
      const result = await chatService.createConversation(agentId, sessionId, conversationTitle(firstMessage) || 'New conversation', options(agentId));
      return { status: result.status };
    },
    async send(agentId, sessionId, message) {
      const result = await chatService.runTurn(agentId, sessionId, message, options(agentId));
      return result.status === 'sent' ? { status: 'sent', reply: result.reply } : { status: result.status };
    },
  };
}
