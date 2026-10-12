import { chatService } from '@/services/chatService';
import { sessionIndexService, titleFromMessage } from '@/services/sessionIndexService';
import type { WorkspaceServices } from './types';

/** Boundary adapter only. Existing empty-on-error/void-on-error service limits remain. */
export function createProductionWorkspaceServices(userId: string): WorkspaceServices {
  const requireUser = () => { if (!userId) throw new Error('User context unavailable'); };
  return {
    async list(agentId) {
      requireUser();
      const rows = await sessionIndexService.listSessions(agentId);
      return { status: rows.length ? 'ready' : 'empty', rows: rows.map(row => ({ id: row.id, sessionId: row.adk_session_id, title: row.title, updatedAt: row.updated_at })) };
    },
    async history(agentId, sessionId) {
      requireUser();
      const messages = await chatService.getHistory({ agent_name: agentId, user_id: userId, session_id: sessionId });
      // [] is ambiguous in the inherited service. No missing/access classification invented.
      return { status: messages.length ? 'ready' : 'empty', messages };
    },
    async send(agentId, sessionId, message) {
      requireUser();
      const result = await chatService.sendMessage({ agent_name: agentId, user_id: userId, session_id: sessionId, message });
      // Known legacy sentinel is conservatively uncertain, never "not sent" or an assistant success.
      if (!result.session_id || result.response.startsWith('Error: Could not reach Agent Service.') || result.response === 'Error: No response content.') return { status: 'uncertain' };
      let metadataWarning = false;
      try {
      if (!sessionId) metadataWarning = !(await sessionIndexService.createSession(agentId, result.session_id, titleFromMessage(message)));
      else {
        const rows = await sessionIndexService.listSessions(agentId);
        const row = rows.find(row => row.adk_session_id === result.session_id);
        if (row) await sessionIndexService.touchSession(row.id);
      }
      } catch { metadataWarning = true; } // The confirmed ADK result survives a metadata failure.
      return { status: 'sent', sessionId: result.session_id, reply: result.response, metadataWarning };
    },
    async rename(row, title) { requireUser(); await sessionIndexService.renameSession(row.id, title); },
    async archive(row) { requireUser(); await sessionIndexService.archiveSession(row.id); },
  };
}
