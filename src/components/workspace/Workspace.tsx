'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, ChevronRight, Grid2X2, Menu, MessageCircle, Moon, Plus, Search, Sparkles, Sun, FileText, LogOut } from 'lucide-react';
import { MessageBubble } from '@/app/(cyberize)/chat/MessageBubble';
import type { Catalogue, Conversation, Thread, WorkspaceAgent, WorkspaceServices, WriteFailure } from './types';
import { parseWorkspaceView, workspaceQuery } from './navigation';
import { WorkspacePortals, WorkspaceModal } from './WorkspaceModal';
import { WorkspaceComposer } from './WorkspaceComposer';
import { DemoContext, initialDemo, WorkspaceContextDisclosure, type DemoState } from './DemoContext';
import { CopyControl } from './CopyControl';
import { newDraftId, newId, readJournal, removeRecord, saveRecord, type JournalRecord } from './recoveryJournal';

export interface WorkspaceProps {
  agents: WorkspaceAgent[];
  rosterStatus?: 'ready' | 'loading' | 'unavailable';
  identityKey: string;
  /** Server-verified user and mode scoping the recovery journal; fixtures default to identityKey. */
  scope?: { user: string; mode: string };
  canOperate?: boolean;
  services: WorkspaceServices;
  query: string;
  navigate(query: string, options?: { replace?: boolean }): void;
  onSignOut?: () => void;
}
/** Remounting on context change prevents prior-user drafts/demo/history from resurfacing. */
export function Workspace(props: WorkspaceProps) {
  return <WorkspacePortals><WorkspaceSession key={props.identityKey} {...props}/></WorkspacePortals>;
}
/** Threads are scoped by agent, backend namespace and session so colliding IDs never share state. */
const threadKey = (agentId: string, backend: string, session: string) => [agentId, backend, session].join('\n');
const UNBLOCKED = ['ready', 'empty', 'not-sent', 'storage-unavailable'];
function WorkspaceSession({ agents, rosterStatus = 'ready', identityKey, scope: givenScope, canOperate = true, services, query, navigate, onSignOut }: WorkspaceProps) {
  const scope = useMemo(() => givenScope ?? { user: identityKey, mode: 'fixture' }, [givenScope, identityKey]);
  const view = useMemo(() => parseWorkspaceView(query, agents), [query, agents]);
  const agentId = 'agentId' in view ? view.agentId : '';
  const agent = agents.find(a => a.id === agentId);
  const backend = agent?.backendKey ?? '';
  // Honest availability: an undeployed or unconfigured agent never reaches list/history/send.
  const agentBlock = agent?.availability === 'unavailable' ? 'agent-unavailable' : agent?.availability === 'config-unavailable' ? 'config-unavailable' : null;
  // A deep link without (or with another) backend key must not open the same ID against this target.
  const linkState = view.kind === 'conversation' && agent?.backendKey && view.backendKey !== agent.backendKey ? (view.backendKey ? 'stale' : 'unbound') : null;
  const viewKey = threadKey(agentId, backend, view.kind === 'conversation' ? view.sessionId : view.kind === 'draft' ? 'draft:' + view.draftId : view.kind);
  const alive = useRef(true); useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const [filter, setFilter] = useState('');
  const [catalogue, setCatalogue] = useState<{ agent: string; data: Catalogue }>({ agent: '', data: { status: 'loading', rows: [] } });
  const [listGeneration, setListGeneration] = useState(0);
  const [threads, setThreads] = useState<Record<string,Thread>>({});
  const threadCache = useRef<Record<string,Thread>>({});
  const setThread = (key: string, data: Thread) => { threadCache.current[key] = data; setThreads(old => ({ ...old, [key]: data })); };
  const [drafts, setDrafts] = useState<Record<string,string>>({});
  const [reloads, setReloads] = useState<Record<string,number>>({});
  const sending = useRef(new Set<string>()); const inflight = useRef(new Set<string>()); const uncreated = useRef(new Set<string>());
  const consumedDrafts = useRef(new Map<string,string>()); const acknowledged = useRef(new Set<string>());
  const [journal, setJournal] = useState<JournalRecord[]>(() => readJournal(scope));
  const journalRef = useRef(journal); journalRef.current = journal;
  const syncJournal = () => { if (alive.current) setJournal(readJournal(scope)); };
  /** An unresolved record not owned by a live request in this page: a stale pending is uncertain. */
  const unresolved = (agentKey: string, backendKey: string, session: string) => journalRef.current.filter(r => r.agent === agentKey && r.backend === backendKey && r.session === session && !inflight.current.has(r.op) && !acknowledged.current.has(r.op));
  const [demos, setDemos] = useState<Record<string,DemoState>>({});
  const [drawer, setDrawer] = useState(false); const drawerOpen = useRef(false); drawerOpen.current = drawer;
  const [contextOpen, setContextOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null); const desktopNav = useRef<HTMLElement>(null); const main = useRef<HTMLElement>(null);
  const scroll = useRef<HTMLDivElement>(null); const followEnd = useRef(true);
  const { resolvedTheme, setTheme } = useTheme(); const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => { setDrawer(false); setContextOpen(false); }, [query]);
  useEffect(() => {
    const media = matchMedia('(min-width:1024px)');
    // The modal's close-autofocus callback owns restoration after teardown.
    const update = () => { if (media.matches && drawerOpen.current) setDrawer(false); };
    media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    // Back/forward to a consumed draft resolves to the conversation it became.
    if (view.kind !== 'draft' || !agent) return;
    const session = consumedDrafts.current.get(view.draftId) ?? journalRef.current.find(r => r.draft === view.draftId && r.agent === agent.id && r.backend === backend)?.session;
    if (session) navigate(workspaceQuery(agent.id, { session, backendKey: agent.backendKey }), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  const listable = !!agent && canOperate && !agentBlock;
  useEffect(() => {
    if (!listable) return;
    const controller = new AbortController(); let current = true;
    setCatalogue(old => old.agent === agentId && ['ready','empty'].includes(old.data.status) ? old : { agent: agentId, data: { status: 'loading', rows: [] } });
    services.list(agentId, controller.signal).then(data => { if (current) setCatalogue({ agent: agentId, data }); }).catch(() => { if (current) setCatalogue({ agent: agentId, data: { status: 'unavailable', rows: [] } }); });
    return () => { current = false; controller.abort(); };
  }, [agentId, listable, services, listGeneration]);
  const reload = reloads[viewKey] ?? 0;
  useEffect(() => {
    if (view.kind !== 'conversation' || !canOperate || !agent || agentBlock || linkState) return;
    const key = viewKey, session = view.sessionId, agentKey = agent.id, backendKey = backend;
    const cached = threadCache.current[key];
    // An in-flight send owns this thread; a settled thread reloads only on explicit request.
    if (cached?.status === 'pending' || sending.current.has(key)) return;
    if (!reload && cached && !['loading','unavailable'].includes(cached.status)) return;
    const controller = new AbortController(); let current = true;
    setThread(key, cached?.status === 'uncertain' ? { ...cached, reviewed: false } : { status: 'loading', messages: cached?.messages ?? [] });
    const settle = (data: Thread | null) => {
      if (!current) return;
      if (unresolved(agentKey, backendKey, session).length) {
        // History is evidence only: it never resolves or replays an unconfirmed send.
        const ok = !!data && (data.status === 'ready' || data.status === 'empty' || data.status === 'missing');
        setThread(key, { status: 'uncertain', messages: ok ? data!.messages : cached?.messages ?? [], attemptedText: cached?.attemptedText, reviewed: ok, historyStatus: ok ? data!.status as 'ready' | 'empty' | 'missing' : undefined });
      } else setThread(key, data ?? { status: 'unavailable', messages: cached?.messages ?? [] });
    };
    services.history(agentKey, session, controller.signal).then(settle).catch(() => settle(null));
    return () => { current = false; controller.abort(); };
    // Reads are keyed to explicit navigation/inspection, never to state writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey, canOperate, services, reload, agentBlock, linkState]);
  const rows = catalogue.agent === agentId ? catalogue.data : { status: 'loading' as const, rows: [] };
  const openRecords = journal.filter(r => r.agent === agentId && r.backend === backend && !acknowledged.current.has(r.op));
  const openSessions = new Set(openRecords.map(r => r.session));
  // Journal-only sessions stay locatable when the list is late, failed or the create was lost.
  const pendingRows: Conversation[] = [...new Set(openRecords.filter(r => !rows.rows.some(row => row.sessionId === r.session)).map(r => r.session))].map(session => ({ id: 'journal:' + session, sessionId: session, title: openRecords.some(r => r.session === session && inflight.current.has(r.op)) ? 'New conversation' : `Unconfirmed conversation ${session.slice(0, 8)}` }));
  const displayRows = [...pendingRows, ...rows.rows];
  const rowQuery = (row: Conversation) => workspaceQuery(agentId, { session: row.sessionId, backendKey: agent?.backendKey });
  const thread: Thread = !canOperate ? { status: 'access-unavailable', messages: [] } : threads[viewKey] ?? { status: view.kind === 'conversation' ? 'loading' : 'empty', messages: [] };
  const blocked = !!agentBlock || !!linkState || !UNBLOCKED.includes(thread.status);
  const draft = drafts[viewKey] ?? '';
  useEffect(() => { if (followEnd.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; }, [thread.messages.length, thread.status, viewKey]);
  const go = (next: string) => { navigate(next); setDrawer(false); };
  const newChat = () => { if (!agent) { go(''); setTimeout(() => document.getElementById('ws-filter')?.focus(), 0); return; } go(workspaceQuery(agent.id, { draft: newDraftId() })); };
  const reloadHistory = () => setReloads(old => ({ ...old, [viewKey]: (old[viewKey] ?? 0) + 1 }));
  const acknowledge = () => {
    if (view.kind !== 'conversation' || !agent || thread.status !== 'uncertain' || !thread.reviewed) return;
    for (const record of unresolved(agent.id, backend, view.sessionId)) { acknowledged.current.add(record.op); removeRecord(record.op); }
    syncJournal();
    // Acknowledgement permits a new deliberate send; it never labels the prior one delivered.
    setThread(viewKey, { status: thread.historyStatus ?? 'empty', messages: thread.messages });
  };
  const send = async () => {
    if (!agent || blocked || !draft.trim() || sending.current.has(viewKey)) return;
    const text = draft.trim(), agentKey = agent.id, backendKey = backend, sourceKey = viewKey, previous = thread.messages;
    const existing = view.kind === 'conversation' ? view.sessionId : null;
    const sessionId = existing ?? newId(), key = threadKey(agentKey, backendKey, sessionId);
    const isNew = !existing || uncreated.current.has(key);
    const record: JournalRecord = { v: 1, op: newId(), user: scope.user, mode: scope.mode, backend: backendKey, agent: agentKey, session: sessionId, ...(view.kind === 'draft' ? { draft: view.draftId } : {}), stage: isNew ? 'create' : 'run', at: Date.now() };
    // No durable pending marker, no network write.
    try { saveRecord(record); } catch { setThread(sourceKey, { status: 'storage-unavailable', messages: previous, attemptedText: text }); return; }
    inflight.current.add(record.op); sending.current.add(sourceKey); sending.current.add(key); followEnd.current = true;
    setThread(key, { status: 'pending', messages: [...previous, { role: 'user', content: text }], attemptedText: text });
    setDrafts(old => ({ ...old, [sourceKey]: '' }));
    syncJournal();
    if (!existing) {
      // The allocated ID is in navigation before any network write.
      if (view.kind === 'draft') consumedDrafts.current.set(view.draftId, sessionId);
      navigate(workspaceQuery(agentKey, { session: sessionId, backendKey: agent.backendKey }), { replace: view.kind === 'draft' }); setDrawer(false);
    }
    const finish = (status: 'sent' | WriteFailure, reply = '') => {
      if (status !== 'uncertain') removeRecord(record.op);
      else { try { saveRecord({ ...record, stage: 'uncertain', at: Date.now() }); } catch { /* the earlier durable record still marks it unresolved */ } }
      if (!alive.current) return;
      const userTurn = [...previous, { role: 'user' as const, content: text }];
      if (status === 'sent') setThread(key, { status: 'ready', messages: [...userTurn, { role: 'assistant', content: reply }] });
      else if (status === 'uncertain') setThread(key, { status: 'uncertain', messages: userTurn, attemptedText: text });
      else { setThread(key, { status, messages: previous, attemptedText: text }); setDrafts(old => ({ ...old, [key]: old[key] || text })); }
    };
    try {
      if (isNew) {
        const created = await services.create(agentKey, sessionId, text);
        if (created.status !== 'created') { if (created.status === 'not-sent') uncreated.current.add(key); return finish(created.status); }
        uncreated.current.delete(key);
        try { saveRecord({ ...record, stage: 'run' }); } catch { /* the create-stage record remains durable */ }
        if (alive.current) setListGeneration(n => n + 1); // a created session is discoverable even if its run fails
      }
      const result = await services.send(agentKey, sessionId, text);
      finish(result.status, result.status === 'sent' ? result.reply : '');
    } catch { finish('uncertain'); }
    finally { inflight.current.delete(record.op); sending.current.delete(sourceKey); sending.current.delete(key); syncJournal(); }
  };
  const themeButton = <button type="button" className="ws-theme" aria-label={mounted && resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>{mounted && resolvedTheme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}<span>{mounted && resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>;
  const navLink = (label: string, next: string, selected: boolean, icon = <MessageCircle size={20}/>) => <a href={'/chat' + (next ? '?' + next : '')} className="ws-nav-item" aria-current={selected ? 'page' : undefined} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); go(next); } }}>{icon}<span>{label}</span></a>;
  const unavailableLabel = (a: WorkspaceAgent) => a.availability === 'unavailable' ? 'Not available on this agent service' : a.availability === 'config-unavailable' ? 'Agent service not configured' : null;
  const sidebarConversations = !canOperate ? null : !displayRows.length ? <p className="ws-small" role="status">{rows.status === 'loading' ? 'Loading conversations…' : rows.status === 'empty' ? 'No conversations yet' : 'Conversations unavailable'}</p> : displayRows.map(row => <div key={row.id}>{navLink(row.title || 'Untitled conversation', rowQuery(row), view.kind === 'conversation' && row.sessionId === view.sessionId)}</div>);
  const navigation = <><div className="ws-brand"><span>S</span><div>STARK<small>Agent Workspace</small></div></div><button className="ws-primary ws-new" onClick={newChat}><Plus size={20}/>{agent ? 'New chat' : 'Choose an agent'}</button>
    {navLink('All agents', '', view.kind === 'directory', <Grid2X2 size={20}/>)}<div className="ws-nav-agents"><p className="ws-eyebrow">Your agents</p>{agents.map(a => <div key={a.id}>{navLink(unavailableLabel(a) ? `${a.name} (unavailable)` : a.name, workspaceQuery(a.id), a.id === agentId)}</div>)}</div>
    {agent && !agentBlock && (view.kind === 'conversation' || view.kind === 'draft') && <div><p className="ws-eyebrow">Conversations</p>{sidebarConversations}</div>}
    <footer>{themeButton}{onSignOut && <button className="ws-theme" onClick={onSignOut}><LogOut size={18}/>Sign out</button>}</footer></>;
  const composer = (hero = false) => <WorkspaceComposer hero={hero} name={agent?.name ?? 'agent'} value={draft} onChange={value => setDrafts(old => ({ ...old, [viewKey]: value }))} onSend={() => void send()} disabled={blocked}/>;
  const context = agent && <DemoContext key={agent.id} state={demos[agent.id] ?? initialDemo()} onChange={data => setDemos(old => ({ ...old, [agent.id]: data }))}/>;
  const statusCopy: Partial<Record<Thread['status'], [string,string]>> = {
    loading: ['Loading conversation','Sending is paused while this conversation loads.'], unavailable: ['History unavailable','History has not been deleted. Try loading again or return to the workspace.'], missing: ['Conversation not found','This conversation has not been replaced or recreated.'], 'access-unavailable': ['Conversation access unavailable','Sending is unavailable. Use the existing sign-in flow.'], 'agent-unavailable': ['Agent unavailable','This agent is not available on the current agent service. Nothing was sent.'], 'backend-changed': ['Workspace configuration changed','The agent service changed. Reload the workspace before continuing; nothing was sent.'], pending: ['Waiting for a reply','Awaiting reply. This is not a streaming response.'], uncertain: ['Send outcome unknown','We could not confirm the last send. Check the conversation before sending again.'], 'not-sent': ['Message not sent','The message was not delivered. Your draft is editable; send deliberately when ready.'], 'storage-unavailable': ['Message not sent','This browser could not save the recovery marker required before sending, so nothing was sent. Your draft is kept and history can still be read.']
  };
  const agentNotice = agentBlock && <section className="ws-state" role="alert"><h2>{agentBlock === 'agent-unavailable' ? 'Agent unavailable' : 'Agent service not configured'}</h2><p>{agentBlock === 'agent-unavailable' ? 'This agent is not available on the current agent service. Nothing was sent and no conversation was changed.' : 'This agent cannot be reached with the current configuration. Nothing was sent.'}</p><button onClick={() => go('')}>Back to all agents</button></section>;
  const conversation = view.kind === 'conversation' || view.kind === 'draft';
  const filtered = agents.filter(a => `${a.name} ${a.description ?? ''}`.toLowerCase().includes(filter.toLowerCase()));
  const listNotice = rows.status === 'unavailable' ? <div className="ws-state"><h3>Conversations unavailable</h3><p>History has not been deleted.</p><button onClick={() => setListGeneration(n => n + 1)}>Try again</button></div> : rows.status === 'access-unavailable' ? <div className="ws-state"><h3>Conversation access unavailable</h3><p>Use the existing sign-in flow to load conversations.</p></div> : rows.status === 'agent-unavailable' ? <div className="ws-state"><h3>Agent unavailable</h3><p>This agent is not available on the current agent service.</p></div> : rows.status === 'backend-changed' ? <div className="ws-state"><h3>Workspace configuration changed</h3><p>Reload the workspace to use the current agent service.</p></div> : null;
  return <div data-workspace-theme className={`ws-root ${conversation ? 'ws-conversation' : ''}`}>
    <a className="ws-skip" href="#ws-main">Skip to content</a>
    <nav ref={desktopNav} className="ws-sidebar ws-desktop" aria-label="Workspace navigation">{navigation}</nav>
    <div className="ws-mobile-top"><button ref={menuButton} className="ws-icon" aria-label="Open navigation menu" onClick={() => setDrawer(true)}><Menu size={20}/></button><strong>STARK WORKSPACE</strong>{themeButton}</div>
    <div className="ws-main-column"><header className="ws-topbar"><div className="ws-crumbs"><a href="/chat" onClick={e => { e.preventDefault(); go(''); }}>Agents</a>{agent && <><ChevronRight size={18}/><a href={'/chat?' + workspaceQuery(agent.id)} onClick={e => { e.preventDefault(); go(workspaceQuery(agent.id)); }}>{agent.name}</a></>}{conversation && <><ChevronRight size={18}/><span>{view.kind === 'draft' ? 'New conversation' : (view.kind === 'conversation' ? rows.rows.find(row => row.sessionId === view.sessionId)?.title : undefined) || 'Conversation'}</span></>}</div>{conversation && <button className="ws-context-action" aria-label="Open demo instructions and context" onClick={() => setContextOpen(true)}><FileText size={20}/><span>Context</span></button>}</header>
    <main id="ws-main" ref={main} tabIndex={-1} className={conversation ? 'ws-chat-main' : 'ws-content'}>
      {view.kind === 'invalid' ? <section className="ws-state"><h1>Workspace unavailable</h1><p>The agent or conversation selector is invalid.</p><button onClick={() => go('')}>Back to all agents</button></section> : view.kind === 'directory' ? <>
        <p className="ws-eyebrow">Your workspace</p><h1>Your agents</h1><p className="ws-intro">Choose an agent. Pick up a conversation or start something new.</p>
        <label className="ws-filter-label" htmlFor="ws-filter">Find an agent</label><div className="ws-filter"><Search size={20}/><input id="ws-filter" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search names or descriptions"/>{filter && <button onClick={() => setFilter('')}>Clear filter</button>}</div>
        {rosterStatus === 'loading' ? <div role="status">Loading agents…<div className="ws-skeleton" aria-hidden="true"/></div> : rosterStatus === 'unavailable' ? <section className="ws-state"><h2>Agent configuration unavailable</h2><p>No agent has been selected. Contact your administrator.</p></section> : !agents.length ? <section className="ws-state"><h2>No agents configured</h2><p>Ask your administrator to configure an agent.</p></section> : <><p className="ws-count" role="status">{filtered.length} agents available</p>{!filtered.length ? <section className="ws-state"><h2>No matching agents</h2><button onClick={() => setFilter('')}>Clear filter</button></section> : <div className="ws-agent-grid">{filtered.map(a => <a className="ws-agent-card" key={a.id} href={'/chat?' + workspaceQuery(a.id)} onClick={e => { e.preventDefault(); go(workspaceQuery(a.id)); }}><span className="ws-agent-symbol"><Sparkles size={24}/></span><h2>{a.name}</h2><p>{a.description || 'Configured agent workspace.'}</p>{unavailableLabel(a) ? <span className="ws-badge">{unavailableLabel(a)}</span> : <span>Open workspace <ArrowRight size={18}/></span>}</a>)}</div>}</>}
      </> : view.kind === 'workspace' && agent ? <>
        <div className="ws-hero"><span className="ws-agent-symbol"><Sparkles size={28}/></span><div><h1>{agent.name}</h1><p>{agent.description || 'Configured agent workspace.'}</p></div></div>{agentNotice || <>{composer(true)}{statusCopy[thread.status] && <div className="ws-state" role="status"><h2>{statusCopy[thread.status]![0]}</h2><p>{statusCopy[thread.status]![1]}</p>{thread.attemptedText && <p>{thread.attemptedText}</p>}</div>}</>}<p className="ws-small">One agent. Separate conversations.</p>
        <div className="ws-work-grid"><WorkspaceContextDisclosure>{context}</WorkspaceContextDisclosure><section className="ws-recents"><h2 tabIndex={-1}>Recent conversations</h2>
          {!canOperate ? <p role="status">User context unavailable. Sign in to load conversations.</p> : agentBlock ? null : rows.status === 'loading' && !displayRows.length ? <div role="status">Loading conversations…<div className="ws-skeleton" aria-hidden="true"/></div> : <>
          {listNotice}
          {rows.status === 'empty' && !displayRows.length && <div className="ws-state"><h3>A fresh start</h3><p>Your conversations with this agent will appear here.</p><button onClick={newChat}>Start a conversation</button></div>}
          {displayRows.map(row => <div className="ws-recent-row" key={row.id}><a href={'/chat?' + rowQuery(row)} onClick={e => { e.preventDefault(); go(rowQuery(row)); }}><MessageCircle size={18}/><span><strong>{row.title || 'Untitled conversation'}</strong><small>{openSessions.has(row.sessionId) ? 'Send not confirmed' : row.createdAt ? `Started ${new Date(row.createdAt).toLocaleDateString()}` : 'Date unavailable'}</small></span></a></div>)}
          </>}<p className="ws-small">Each conversation keeps its own history.</p>
        </section></div>
      </> : conversation && agent ? <>
        <div className="ws-thread-scroll" ref={scroll} onScroll={e => { const el = e.currentTarget; followEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}><div className="ws-thread">
          <div className="ws-thread-meta"><span>{agent.name}</span>{thread.messages.length > 0 && <CopyControl label="Copy conversation as Markdown" text={thread.messages.map(m => `## ${m.role === 'user' ? 'You' : agent.name}\n\n${m.content}`).join('\n\n')}/>}</div>
          {agentNotice || (linkState ? <section className="ws-state" role="alert"><h2>{linkState === 'unbound' ? 'Confirm this conversation link' : 'Conversation link from another configuration'}</h2><p>{linkState === 'unbound' ? 'This older link does not record which agent service it belongs to. Open it with the current service, or choose from your conversations.' : 'This link belongs to a different agent service configuration, so it was not opened here.'}</p>
            {linkState === 'unbound' && view.kind === 'conversation' && <button onClick={() => navigate(workspaceQuery(agent.id, { session: view.sessionId, backendKey: agent.backendKey }), { replace: true })}>Open with the current service</button>}<button onClick={() => go(workspaceQuery(agent.id))}>Choose from conversations</button></section> : <>
          {thread.status === 'empty' && !thread.messages.length && <div className="ws-empty-thread"><h1>Chat with {agent.name}</h1><p>Send a message to start a separate conversation.</p></div>}
          {thread.messages.map((message, i) => <div className="ws-turn" key={i}><MessageBubble message={message} agentName={agent.name} workbench/></div>)}
          {statusCopy[thread.status] && <section className="ws-state" role={['pending','loading'].includes(thread.status) ? 'status' : 'alert'}><h2>{statusCopy[thread.status]![0]}</h2><p>{statusCopy[thread.status]![1]}</p>{thread.attemptedText && ['uncertain','pending'].includes(thread.status) && !thread.messages.some(message => message.role === 'user' && message.content === thread.attemptedText) && <p>Attempted message: {thread.attemptedText}</p>}
            {thread.status === 'uncertain' && thread.reviewed && thread.historyStatus === 'missing' && <p>This conversation was not found. Nothing will be resent.</p>}
            {thread.status === 'unavailable' && <button onClick={reloadHistory}>Try loading again</button>}
            {thread.status === 'uncertain' && view.kind === 'conversation' && <button onClick={reloadHistory}>Check history</button>}
            {thread.status === 'uncertain' && thread.reviewed && <button onClick={acknowledge}>I reviewed the history — continue</button>}
            {thread.status === 'missing' && <button onClick={newChat}>New conversation</button>}
            {['unavailable','missing','access-unavailable','agent-unavailable','backend-changed'].includes(thread.status) && <button onClick={() => go(workspaceQuery(agent.id))}>Back to workspace</button>}
          </section>}</>)}
          <span className="sr-only" role="status">{thread.status === 'ready' && thread.messages.at(-1)?.role === 'assistant' ? 'Reply received' : ''}</span>
        </div></div><div className="ws-compose-wrap">{composer()}<p className="ws-small">Enter to send · Shift + Enter for a new line</p></div>
      </> : null}
    </main></div>
    <WorkspaceModal open={drawer} onOpenChange={setDrawer} title="Navigation" drawer returnFocus={() => {
      if (!matchMedia('(min-width:1024px)').matches) return menuButton.current;
      const visible = (selector: string) => Array.from(desktopNav.current?.querySelectorAll<HTMLElement>(selector) ?? []).find(el => el.getClientRects().length > 0 && getComputedStyle(el).visibility === 'visible');
      return visible('[aria-current="page"]') ?? visible('a') ?? main.current;
    }}><nav className="ws-drawer-nav" aria-label="Mobile workspace navigation">{navigation}</nav></WorkspaceModal>
    <WorkspaceModal open={contextOpen} onOpenChange={setContextOpen} title="Demo context">{context}</WorkspaceModal>
  </div>;
}
