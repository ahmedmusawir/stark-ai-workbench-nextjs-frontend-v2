import type { WorkspaceAgent } from './types';
export type WorkspaceView = { kind: 'directory' } | { kind: 'invalid' } | { kind: 'workspace' | 'draft'; agentId: string } | { kind: 'conversation'; agentId: string; sessionId: string };
export function parseWorkspaceView(query: string, agents: WorkspaceAgent[]): WorkspaceView {
  const p = new URLSearchParams(query);
  // Unknown selectors (including preview/user/backend selectors) are never forwarded.
  if ([...p.keys()].some(k => !['agent', 'new', 'session'].includes(k)) || ['agent','new','session'].some(k => p.getAll(k).length > 1)) return { kind: 'invalid' };
  const agentId = p.get('agent');
  if (!agentId) return p.size ? { kind: 'invalid' } : { kind: 'directory' };
  if (!agents.some(a => a.id === agentId)) return { kind: 'invalid' };
  if (p.has('new') && p.has('session')) return { kind: 'invalid' };
  if (p.has('new')) return p.get('new') === '1' ? { kind: 'draft', agentId } : { kind: 'invalid' };
  if (p.has('session')) return p.get('session')?.trim() ? { kind: 'conversation', agentId, sessionId: p.get('session')! } : { kind: 'invalid' };
  return { kind: 'workspace', agentId };
}
export function workspaceQuery(agentId?: string, sessionId?: string, draft = false) {
  const p = new URLSearchParams();
  if (agentId) p.set('agent', agentId);
  if (sessionId) p.set('session', sessionId);
  else if (draft) p.set('new', '1');
  return p.toString();
}
