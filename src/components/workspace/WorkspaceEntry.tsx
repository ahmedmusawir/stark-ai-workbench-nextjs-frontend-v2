'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/chatStore';
import type { WorkspaceDescriptorResult } from '@/types';
import { createProductionWorkspaceServices, loadWorkspaceDescriptor, workspaceAgentsFor } from './productionAdapter';
import { Workspace } from './Workspace';
import type { WorkspaceServices } from './types';
/** Without a verified server identity nothing may reach the agent routes. */
const noIdentity = (): never => { throw new Error('User context unavailable'); };
const unavailableServices: WorkspaceServices = { list: noIdentity, history: noIdentity, create: noIdentity, send: noIdentity };
export function WorkspaceEntry() {
  const logout = useAuthStore(s => s.logout); const router = useRouter(); const query = useSearchParams();
  const [identity, setIdentity] = useState<WorkspaceDescriptorResult | { status: 'loading' }>({ status: 'loading' });
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void loadWorkspaceDescriptor(controller.signal).then(result => { if (!controller.signal.aborted) setIdentity(result); });
    return () => controller.abort();
  }, []);
  const descriptor = identity.status === 'ready' ? identity.descriptor : null;
  useEffect(() => {
    // The server user is authoritative; a stale browser auth cache is relabelled, never trusted.
    if (!descriptor) return;
    const cached = useAuthStore.getState().user;
    const cachedId = cached && typeof cached === 'object' && 'id' in cached ? String(cached.id ?? '') : '';
    if (cachedId === descriptor.user.id) return;
    try {
      useAuthStore.setState({ user: { id: descriptor.user.id, email: descriptor.user.email }, isAuthenticated: true });
    } catch {
      // The in-memory label is applied before persistence; blocked storage must not break the workspace.
    }
  }, [descriptor]);
  const agents = useMemo(() => workspaceAgentsFor(descriptor), [descriptor]);
  const services = useMemo(() => descriptor ? createProductionWorkspaceServices(descriptor) : unavailableServices, [descriptor]);
  const scope = useMemo(() => descriptor ? { user: descriptor.user.id, mode: descriptor.mode } : undefined, [descriptor]);
  const identityKey = JSON.stringify([descriptor?.user.id ?? '', descriptor?.mode ?? 'none', agents.map(a => [a.id, a.backendId, a.backendKey ?? null])]);
  const finishSignOut = () => {
    try {
      useChatStore.getState().reset();
    } catch {
      // Zustand applies reset's in-memory state before persisting it. A blocked
      // storage write must not prevent navigation after that state is cleared.
    }
    router.push('/auth');
  };
  // Visible transcripts/drafts are cleared at once; the recovery journal is deliberately kept.
  if (signingOut) return <p role="status">Signing out…</p>;
  if (identity.status === 'loading') return <p role="status">Loading workspace…</p>;
  return <Workspace identityKey={identityKey} scope={scope} canOperate={!!descriptor} agents={agents} rosterStatus={identity.status === 'unavailable' ? 'unavailable' : 'ready'} services={services} query={query.toString()} navigate={(next, options) => { const url = '/chat' + (next ? '?' + next : ''); if (options?.replace) router.replace(url); else router.push(url); }} onSignOut={() => { setSigningOut(true); void logout().then(finishSignOut, finishSignOut); }}/>
}
