import type { WorkspaceAgent } from './types';
export type WorkspaceView = { kind: 'directory' } | { kind: 'invalid' } | { kind: 'workspace'; agentId: string } | { kind: 'draft'; agentId: string; draftId: string } | { kind: 'conversation'; agentId: string; sessionId: string; backendKey: string | null };
// `1` is the pre-APBM001 draft selector; fresh drafts carry a unique `d…` identity.
const DRAFT_ID = /^(1|d[0-9a-f]{8})$/;
const KEYS = ['agent', 'new', 'session', 'bk'];
export function parseWorkspaceView(query: string, agents: WorkspaceAgent[]): WorkspaceView {
  const p = new URLSearchParams(query);
  // Unknown selectors (including preview/user/backend URL selectors) are never forwarded.
  if ([...p.keys()].some(k => !KEYS.includes(k)) || KEYS.some(k => p.getAll(k).length > 1)) return { kind: 'invalid' };
  const agentId = p.get('agent');
  if (!agentId) return p.size ? { kind: 'invalid' } : { kind: 'directory' };
  if (!agents.some(a => a.id === agentId)) return { kind: 'invalid' };
  if (p.has('new') && p.has('session')) return { kind: 'invalid' };
  if (p.has('bk') && (!p.has('session') || !/^[0-9a-f]{16}$/.test(p.get('bk')!))) return { kind: 'invalid' };
  if (p.has('new')) return DRAFT_ID.test(p.get('new')!) ? { kind: 'draft', agentId, draftId: p.get('new')! } : { kind: 'invalid' };
  if (p.has('session')) return p.get('session')?.trim() ? { kind: 'conversation', agentId, sessionId: p.get('session')!, backendKey: p.get('bk') } : { kind: 'invalid' };
  return { kind: 'workspace', agentId };
}
export type WorkspaceTarget = { session: string; backendKey?: string } | { draft: string };
export function workspaceQuery(agentId?: string, target?: WorkspaceTarget) {
  const p = new URLSearchParams();
  if (agentId) p.set('agent', agentId);
  if (target && 'session' in target) { p.set('session', target.session); if (target.backendKey) p.set('bk', target.backendKey); }
  else if (target) p.set('new', target.draft);
  return p.toString();
}
