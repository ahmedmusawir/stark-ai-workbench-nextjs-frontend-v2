import { Suspense } from 'react';
import { WorkspaceEntry } from '@/components/workspace/WorkspaceEntry';
import './workspace.scss';
export default function ChatPage() {
  return <Suspense fallback={<p role="status">Loading workspace…</p>}><WorkspaceEntry/></Suspense>;
}
