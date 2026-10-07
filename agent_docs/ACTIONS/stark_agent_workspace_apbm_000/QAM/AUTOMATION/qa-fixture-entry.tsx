// QA-owned isolated fixture entry (disposable). Real product Workspace + QA rosters + deferred QA services with a call ledger.
// Config via location.hash: #roster=QR1|QR2|QR0|R6&status=ready|loading|unavailable. App query lives in location.search.
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { Workspace } from '@/components/workspace/Workspace';
import { workspaceAgentsForUi } from '@/config/manifest';
import type { WorkspaceAgent, WorkspaceServices } from '@/components/workspace/types';

// matchMedia listener accounting (S-15 teardown)
const mm = { added: 0, removed: 0 };
const realMM = window.matchMedia.bind(window);
window.matchMedia = (q: string) => { const m = realMM(q); const a = m.addEventListener.bind(m), r = m.removeEventListener.bind(m);
  m.addEventListener = ((t: string, l: EventListener) => { if (t === 'change') mm.added++; a(t, l); }) as typeof m.addEventListener;
  m.removeEventListener = ((t: string, l: EventListener) => { if (t === 'change') mm.removed++; r(t, l); }) as typeof m.removeEventListener; return m; };

const LONG_NAME = 'Very long agent name '.repeat(6).slice(0, 120);
const ROSTERS: Record<string, WorkspaceAgent[]> = {
  QR1: [
    { id: 'kestrel', name: 'Kestrel Ops', description: 'Operations planning with kestrel precision.', backendId: 'qa-b1' },
    { id: 'a&b=c', name: LONG_NAME, description: 'Reserved characters in the identifier.', backendId: 'qa-b1' },
    { id: '100%-sure', name: '<img src=x onerror="window.__qaXss=1">', description: 'Literal markup in a name must render as text.', backendId: 'qa-b2' },
    { id: 'spaced id', name: 'ATLAS mixed Case', backendId: 'qa-b3' },
    { id: 'ünï-ŝ', name: 'Unicode Agent', description: 'Ünïcode description text.', icon: 'unknown-icon', backendId: 'qa-b4' },
    { id: 'x/../y', name: 'Path Agent', description: 'Slash and dot segments.', backendId: 'qa-b5' },
  ],
  QR2: [{ id: 'solo', name: 'Solo', backendId: 'qa-solo' }],
  QR0: [],
  R6: workspaceAgentsForUi(),
};
type Call = { seq: number; action: string; agent?: string; session?: string | null; message?: string; title?: string; row?: string };
type Pending = { call: Call; resolve: (v: unknown) => void; reject: (e: Error) => void };
const qa = {
  ledger: [] as Call[], rejections: [] as Array<{ seq: number; message: string }>, pending: new Map<number, Pending>(), seq: 0, mm,
  auto: {} as Record<string, ((c: Call) => unknown) | undefined>,
  pendingOf(action: string) { return [...qa.pending.values()].filter(p => p.call.action === action).map(p => p.call.seq); },
  resolve(seq: number, value: unknown) { const p = qa.pending.get(seq); if (!p) throw Error('no pending ' + seq); qa.pending.delete(seq); p.resolve(value); },
  reject(seq: number, message: string) { const p = qa.pending.get(seq); if (!p) throw Error('no pending ' + seq); qa.pending.delete(seq); qa.rejections.push({ seq, message }); p.reject(new Error(message)); },
  identity: 'qa-user-a', setIdentity: (_: string) => {}, mount: () => {}, unmount: () => {},
};
function call(c: Omit<Call, 'seq'>): Promise<any> {
  const full = { ...c, seq: ++qa.seq }; qa.ledger.push(full);
  const auto = qa.auto[c.action];
  return new Promise((resolve, reject) => {
    const r = auto ? auto(full) : 'defer';
    if (r === 'defer') qa.pending.set(full.seq, { call: full, resolve, reject });
    else if (r instanceof Error) { qa.rejections.push({ seq: full.seq, message: r.message }); reject(r); }
    else resolve(r);
  });
}
const services: WorkspaceServices = {
  list: agent => call({ action: 'list', agent }),
  history: (agent, session) => call({ action: 'history', agent, session }),
  send: (agent, session, message) => call({ action: 'send', agent, session, message }),
  rename: (row, title) => call({ action: 'rename', row: row.id, title }),
  archive: row => call({ action: 'archive', row: row.id }),
};
Object.assign(window, { qa });
const cfg = new URLSearchParams(location.hash.slice(1));
const agents = ROSTERS[cfg.get('roster') || 'QR1'] ?? ROSTERS.QR1;
const rosterStatus = (cfg.get('status') as 'ready' | 'loading' | 'unavailable') || 'ready';

function Fixture() {
  const [query, setQuery] = useState(location.search.slice(1));
  const [identity, setIdentity] = useState(qa.identity);
  qa.setIdentity = (k: string) => { qa.identity = k; setIdentity(k); };
  useEffect(() => { const f = () => setQuery(location.search.slice(1)); addEventListener('popstate', f); return () => removeEventListener('popstate', f); }, []);
  const navigate = useMemo(() => (q: string) => { history.pushState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); setQuery(q); }, []);
  return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <Workspace identityKey={identity} agents={agents} services={services} query={query} navigate={navigate} rosterStatus={rosterStatus} />
  </ThemeProvider>;
}
let root: Root | null = null;
qa.mount = () => { if (!root) { root = createRoot(document.getElementById('fixture-root')!); root.render(<Fixture />); } };
qa.unmount = () => { root?.unmount(); root = null; };
(window as unknown as { __qaPreset?: (q: typeof qa) => void }).__qaPreset?.(qa);
qa.mount();
