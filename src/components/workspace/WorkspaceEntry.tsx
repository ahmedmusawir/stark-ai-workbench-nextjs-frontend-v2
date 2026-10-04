'use client';
import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/chatStore';
import { workspaceAgentsForUi } from '@/config/manifest';
import { createProductionWorkspaceServices } from './productionAdapter';
import { Workspace } from './Workspace';
const agents = workspaceAgentsForUi();
export function WorkspaceEntry() {
  const user = useAuthStore(s => s.user); const logout = useAuthStore(s => s.logout); const router = useRouter(); const query = useSearchParams();
  const userId = user && typeof user === 'object' && 'id' in user ? String(user.id ?? '') : '';
  const services = useMemo(() => createProductionWorkspaceServices(userId), [userId]);
  const identityKey = JSON.stringify([userId, process.env.NEXT_PUBLIC_CHAT_MODE === 'live' ? 'live' : 'mock', agents.map(a => [a.id,a.backendId])]);
  return <Workspace identityKey={identityKey} canOperate={!!userId} agents={agents} services={services} query={query.toString()} navigate={next => router.push('/chat' + (next ? '?' + next : ''))} onSignOut={() => { void logout().finally(() => { useChatStore.getState().reset(); router.push('/auth'); }); }}/>
}
