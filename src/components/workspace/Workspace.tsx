'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, ChevronRight, Grid2X2, Menu, MessageCircle, MoreHorizontal, Moon, Plus, Search, Sparkles, Sun, FileText, LogOut } from 'lucide-react';
import { MessageBubble } from '@/app/(cyberize)/chat/MessageBubble';
import type { Catalogue, Conversation, Thread, WorkspaceAgent, WorkspaceServices } from './types';
import { parseWorkspaceView, workspaceQuery } from './navigation';
import { WorkspacePortals, WorkspaceModal } from './WorkspaceModal';
import { WorkspaceComposer } from './WorkspaceComposer';
import { DemoContext, initialDemo, WorkspaceContextDisclosure, type DemoState } from './DemoContext';
import { CopyControl } from './CopyControl';

export interface WorkspaceProps {
  agents: WorkspaceAgent[];
  rosterStatus?: 'ready' | 'loading' | 'unavailable';
  identityKey: string;
  canOperate?: boolean;
  services: WorkspaceServices;
  query: string;
  navigate(query: string): void;
  onSignOut?: () => void;
}
/** Remounting on context change prevents prior-user drafts/demo/history from resurfacing. */
export function Workspace(props: WorkspaceProps) {
  return <WorkspacePortals><WorkspaceSession key={props.identityKey} {...props}/></WorkspacePortals>;
}
function WorkspaceSession({ agents, rosterStatus = 'ready', canOperate = true, services, query, navigate, onSignOut }: WorkspaceProps) {
  const view = useMemo(() => parseWorkspaceView(query, agents), [query, agents]);
  const agentId = 'agentId' in view ? view.agentId : '';
  const agent = agents.find(a => a.id === agentId);
  const [draftNumber, setDraftNumber] = useState(0);
  const viewKey = agentId + ':' + (view.kind === 'conversation' ? view.sessionId : `${view.kind}-${draftNumber}`);
  const activeKey = useRef(viewKey); activeKey.current = viewKey;
  const alive = useRef(true); useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const [filter, setFilter] = useState('');
  const [catalogue, setCatalogue] = useState<{ agent: string; data: Catalogue }>({ agent: '', data: { status: 'loading', rows: [] } });
  const [listGeneration, setListGeneration] = useState(0);
  const [threads, setThreads] = useState<Record<string,Thread>>({});
  const threadCache = useRef<Record<string,Thread>>({});
  const setThread = (key: string, data: Thread) => { threadCache.current[key] = data; setThreads(old => ({ ...old, [key]: data })); };
  const [drafts, setDrafts] = useState<Record<string,string>>({});
  const [historyGeneration, setHistoryGeneration] = useState(0);
  const sending = useRef(new Set<string>());
  const [demos, setDemos] = useState<Record<string,DemoState>>({});
  const [drawer, setDrawer] = useState(false); const drawerOpen = useRef(false); drawerOpen.current = drawer;
  const [contextOpen, setContextOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null); const desktopNav = useRef<HTMLElement>(null); const main = useRef<HTMLElement>(null); const recentHeading = useRef<HTMLHeadingElement>(null);
  const [actionRow, setActionRow] = useState<Conversation | null>(null); const [rename, setRename] = useState(''); const [mutation, setMutation] = useState(false); const [mutationError, setMutationError] = useState(''); const rowOpener = useRef<HTMLElement | null>(null); const archived = useRef(false);
  const scroll = useRef<HTMLDivElement>(null); const followEnd = useRef(true);
  const { resolvedTheme, setTheme } = useTheme(); const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => { setDrawer(false); setContextOpen(false); setActionRow(null); }, [query]);
  useEffect(() => {
    const media = matchMedia('(min-width:1024px)');
    const update = () => { if (media.matches && drawerOpen.current) { setDrawer(false); setTimeout(() => (desktopNav.current?.querySelector('[aria-current]') as HTMLElement || desktopNav.current?.querySelector('a'))?.focus(), 0); } };
    media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!agentId || !canOperate || view.kind === 'invalid') return;
    let current = true; setCatalogue({ agent: agentId, data: { status: 'loading', rows: [] } });
    services.list(agentId).then(data => { if (current) setCatalogue({ agent: agentId, data }); }).catch(() => { if (current) setCatalogue({ agent: agentId, data: { status: 'unavailable', rows: [] } }); });
    return () => { current = false; };
  }, [agentId, canOperate, services, listGeneration, view.kind]);
  useEffect(() => {
    if (view.kind !== 'conversation' || !canOperate) return;
    let current = true;
    // A response just bound to its returned ID already provides this exact transcript.
    if (!historyGeneration && threadCache.current[viewKey]) return;
    const previous = threadCache.current[viewKey];
    setThread(viewKey, { status: 'loading', messages: previous?.messages ?? [] });
    services.history(view.agentId, view.sessionId).then(data => {
      if (!current) return;
      // An ambiguous send must not be declared resolved merely by a degraded empty read.
      if (previous?.status === 'uncertain' && data.status !== 'pending' && data.status !== 'not-sent') {
        setThread(viewKey, { ...previous, messages: data.messages.length ? data.messages : previous.messages });
      } else { setThread(viewKey, data); if (data.status === 'not-sent' && data.attemptedText) setDrafts(old => ({ ...old, [viewKey]: data.attemptedText! })); }
    }).catch(() => { if (current) setThread(viewKey, previous?.status === 'uncertain' ? previous : { status: 'unavailable', messages: previous?.messages ?? [] }); });
    return () => { current = false; };
    // Reads are keyed to explicit navigation/inspection, never to state writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey, canOperate, services, historyGeneration]);
  const rows = catalogue.agent === agentId ? catalogue.data : { status: 'loading' as const, rows: [] };
  const thread: Thread = !canOperate ? { status: 'access-unavailable', messages: [] } : threads[viewKey] ?? { status: view.kind === 'conversation' ? 'loading' : 'empty', messages: [] };
  const blocked = !['ready','empty','not-sent','metadata-warning'].includes(thread.status);
  const draft = drafts[viewKey] ?? '';
  useEffect(() => { if (followEnd.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; }, [thread.messages.length, thread.status, viewKey]);
  const go = (next: string) => { navigate(next); setDrawer(false); };
  const newChat = () => { if (!agent) { go(''); setTimeout(() => document.getElementById('ws-filter')?.focus(), 0); return; } setDraftNumber(n => n + 1); go(workspaceQuery(agent.id, undefined, true)); };
  const send = async () => {
    if (!agent || blocked || !draft.trim() || sending.current.has(viewKey)) return;
    const key = viewKey, id = agent.id, text = draft.trim(), session = view.kind === 'conversation' ? view.sessionId : null;
    const previous = thread.messages; sending.current.add(key); followEnd.current = true;
    setThread(key, { status: 'pending', messages: [...previous, { role: 'user', content: text }], attemptedText: text });
    setDrafts(old => ({ ...old, [key]: '' }));
    try {
      const result = await services.send(id, session, text);
      if (!alive.current) return;
      if (result.status === 'sent') {
        const next = { status: result.metadataWarning ? 'metadata-warning' as const : 'ready' as const, messages: [...previous, { role: 'user' as const, content: text }, { role: 'assistant' as const, content: result.reply }] };
        setThread(key, next); setThread(id + ':' + result.sessionId, next);
        if (activeKey.current === key) { setHistoryGeneration(0); go(workspaceQuery(id, result.sessionId)); }
        setListGeneration(n => n + 1);
      } else {
        setThread(key, { status: result.status, messages: result.status === 'not-sent' ? previous : [...previous, { role: 'user', content: text }], attemptedText: text });
        if (result.status === 'not-sent') setDrafts(old => ({ ...old, [key]: text }));
      }
    } catch { if (alive.current) setThread(key, { status: 'uncertain', messages: [...previous, { role: 'user', content: text }], attemptedText: text }); }
    finally { sending.current.delete(key); }
  };
  const themeButton = <button type="button" className="ws-theme" aria-label={mounted && resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>{mounted && resolvedTheme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}<span>{mounted && resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>;
  const navLink = (label: string, next: string, selected: boolean, icon = <MessageCircle size={20}/>) => <a href={'/chat' + (next ? '?' + next : '')} className="ws-nav-item" aria-current={selected ? 'page' : undefined} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); go(next); } }}>{icon}<span>{label}</span></a>;
  const navigation = <><div className="ws-brand"><span>S</span><div>STARK<small>Agent Workspace</small></div></div><button className="ws-primary ws-new" onClick={newChat}><Plus size={20}/>{agent ? 'New chat' : 'Choose an agent'}</button>
    {navLink('All agents', '', view.kind === 'directory', <Grid2X2 size={20}/>)}<div className="ws-nav-agents"><p className="ws-eyebrow">Your agents</p>{agents.map(a => <div key={a.id}>{navLink(a.name, workspaceQuery(a.id), a.id === agentId)}</div>)}</div>
    {view.kind === 'conversation' && <div><p className="ws-eyebrow">Conversations</p>{rows.rows.map(row => <div key={row.id}>{navLink(row.title || 'Untitled conversation', workspaceQuery(agentId, row.sessionId), row.sessionId === view.sessionId)}</div>)}</div>}
    <footer>{themeButton}{onSignOut && <button className="ws-theme" onClick={onSignOut}><LogOut size={18}/>Sign out</button>}</footer></>;
  const composer = (hero = false) => <WorkspaceComposer hero={hero} name={agent?.name ?? 'agent'} value={draft} onChange={value => setDrafts(old => ({ ...old, [viewKey]: value }))} onSend={() => void send()} disabled={blocked}/>;
  const context = agent && <DemoContext key={agent.id} state={demos[agent.id] ?? initialDemo()} onChange={data => setDemos(old => ({ ...old, [agent.id]: data }))}/>;
  const statusCopy: Partial<Record<Thread['status'], [string,string]>> = {
    loading: ['Loading conversation','Sending is paused while this conversation loads.'], unavailable: ['History unavailable','History has not been deleted. Try loading again or return to the workspace.'], missing: ['Conversation not found','This conversation has not been replaced or recreated.'], 'access-unavailable': ['Conversation access unavailable','Sending is unavailable. Use the existing sign-in flow.'], pending: ['Waiting for a reply','Awaiting reply. This is not a streaming response.'], uncertain: ['Send outcome unknown','Delivery unconfirmed. Sending is paused; checking history will not resend.'], 'not-sent': ['Message not sent','The request did not leave the app. Your draft is editable; send deliberately when ready.'], 'metadata-warning': ['Conversation started; title not saved','Your conversation ID and messages are preserved.']
  };
  const conversation = view.kind === 'conversation' || view.kind === 'draft';
  const filtered = agents.filter(a => `${a.name} ${a.description ?? ''}`.toLowerCase().includes(filter.toLowerCase()));
  const handleMutation = async (archive: boolean) => {
    if (!actionRow || mutation || (!archive && !rename.trim())) return;
    setMutation(true); setMutationError('');
    try {
      if (archive) await services.archive(actionRow); else await services.rename(actionRow, rename.trim());
      if (!alive.current) return;
      setCatalogue(old => ({ ...old, data: { ...old.data, rows: archive ? old.data.rows.filter(row => row.id !== actionRow.id) : old.data.rows.map(row => row.id === actionRow.id ? { ...row, title: rename.trim() } : row) } }));
      archived.current = archive; setActionRow(null);
    } catch { setMutationError('Could not save this change. The conversation and title have been kept.'); }
    finally { setMutation(false); }
  };
  return <div data-workspace-theme className={`ws-root ${conversation ? 'ws-conversation' : ''}`}>
    <a className="ws-skip" href="#ws-main">Skip to content</a>
    <nav ref={desktopNav} className="ws-sidebar ws-desktop" aria-label="Workspace navigation">{navigation}</nav>
    <div className="ws-mobile-top"><button ref={menuButton} className="ws-icon" aria-label="Open navigation menu" onClick={() => setDrawer(true)}><Menu size={20}/></button><strong>STARK WORKSPACE</strong>{themeButton}</div>
    <div className="ws-main-column"><header className="ws-topbar"><div className="ws-crumbs"><a href="/chat" onClick={e => { e.preventDefault(); go(''); }}>Agents</a>{agent && <><ChevronRight size={18}/><a href={'/chat?' + workspaceQuery(agent.id)} onClick={e => { e.preventDefault(); go(workspaceQuery(agent.id)); }}>{agent.name}</a></>}{conversation && <><ChevronRight size={18}/><span>{view.kind === 'draft' ? 'New conversation' : (view.kind === 'conversation' ? rows.rows.find(row => row.sessionId === view.sessionId)?.title : undefined) || 'Conversation'}</span></>}</div>{conversation && <button className="ws-context-action" aria-label="Open demo instructions and context" onClick={() => setContextOpen(true)}><FileText size={20}/><span>Context</span></button>}</header>
    <main id="ws-main" ref={main} tabIndex={-1} className={conversation ? 'ws-chat-main' : 'ws-content'}>
      {view.kind === 'invalid' ? <section className="ws-state"><h1>Workspace unavailable</h1><p>The agent or conversation selector is invalid.</p><button onClick={() => go('')}>Back to all agents</button></section> : view.kind === 'directory' ? <>
        <p className="ws-eyebrow">Your workspace</p><h1>Your agents</h1><p className="ws-intro">Choose an agent. Pick up a conversation or start something new.</p>
        <label className="ws-filter-label" htmlFor="ws-filter">Find an agent</label><div className="ws-filter"><Search size={20}/><input id="ws-filter" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search names or descriptions"/>{filter && <button onClick={() => setFilter('')}>Clear filter</button>}</div>
        {rosterStatus === 'loading' ? <div role="status">Loading agents…<div className="ws-skeleton" aria-hidden="true"/></div> : rosterStatus === 'unavailable' ? <section className="ws-state"><h2>Agent configuration unavailable</h2><p>No agent has been selected. Contact your administrator.</p></section> : !agents.length ? <section className="ws-state"><h2>No agents configured</h2><p>Ask your administrator to configure an agent.</p></section> : <><p className="ws-count" role="status">{filtered.length} agents available</p>{!filtered.length ? <section className="ws-state"><h2>No matching agents</h2><button onClick={() => setFilter('')}>Clear filter</button></section> : <div className="ws-agent-grid">{filtered.map(a => <a className="ws-agent-card" key={a.id} href={'/chat?' + workspaceQuery(a.id)} onClick={e => { e.preventDefault(); go(workspaceQuery(a.id)); }}><span className="ws-agent-symbol"><Sparkles size={24}/></span><h2>{a.name}</h2><p>{a.description || 'Configured agent workspace.'}</p><span>Open workspace <ArrowRight size={18}/></span></a>)}</div>}</>}
      </> : view.kind === 'workspace' && agent ? <>
        <div className="ws-hero"><span className="ws-agent-symbol"><Sparkles size={28}/></span><div><h1>{agent.name}</h1><p>{agent.description || 'Configured agent workspace.'}</p></div></div>{composer(true)}{statusCopy[thread.status] && <div className="ws-state" role="status"><h2>{statusCopy[thread.status]![0]}</h2><p>{statusCopy[thread.status]![1]}</p>{thread.attemptedText && <p>{thread.attemptedText}</p>}</div>}<p className="ws-small">One agent. Separate conversations.</p>
        <div className="ws-work-grid"><WorkspaceContextDisclosure>{context}</WorkspaceContextDisclosure><section className="ws-recents"><h2 ref={recentHeading} tabIndex={-1}>Recent conversations</h2>
          {!canOperate ? <p role="status">User context unavailable. Sign in to load conversations.</p> : rows.status === 'loading' ? <div role="status">Loading conversations…<div className="ws-skeleton" aria-hidden="true"/></div> : rows.status === 'unavailable' ? <div className="ws-state"><h3>Conversations unavailable</h3><p>History has not been deleted.</p><button onClick={() => setListGeneration(n => n + 1)}>Try again</button></div> : <>
          {(rows.status === 'partial' || rows.status === 'recovered') && <div role="status" className="ws-state"><h3>{rows.status === 'partial' ? 'Conversation details unavailable' : 'Recovery view'}</h3><p>{rows.status === 'partial' ? 'Title and archive status are unknown.' : 'Some listed conversations may have been archived.'}</p>{rows.status === 'partial' && <button onClick={() => setCatalogue(old => ({ ...old, data: { ...old.data, status: 'recovered' } }))}>View available conversations</button>}</div>}
          {!rows.rows.length && <div className="ws-state"><h3>A fresh start</h3><p>Your conversations with this agent will appear here.</p><button onClick={newChat}>Start a conversation</button></div>}
          {rows.rows.map(row => <div className="ws-recent-row" key={row.id}><a href={'/chat?' + workspaceQuery(agent.id, row.sessionId)} onClick={e => { e.preventDefault(); go(workspaceQuery(agent.id, row.sessionId)); }}><MessageCircle size={18}/><span><strong>{row.title || 'Untitled conversation'}</strong><small>{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : 'Date unavailable'}</small></span></a>{rows.status !== 'partial' && rows.status !== 'recovered' && <button className="ws-icon" aria-label={`Actions for ${row.title || 'Untitled conversation'}`} onClick={e => { rowOpener.current = e.currentTarget; archived.current = false; setActionRow(row); setRename(row.title); setMutationError(''); }}><MoreHorizontal size={20}/></button>}</div>)}
          </>}<p className="ws-small">Each conversation keeps its own history.</p>
        </section></div>
      </> : conversation && agent ? <>
        <div className="ws-thread-scroll" ref={scroll} onScroll={e => { const el = e.currentTarget; followEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}><div className="ws-thread">
          <div className="ws-thread-meta"><span>{agent.name}</span>{thread.messages.length > 0 && <CopyControl label="Copy conversation as Markdown" text={thread.messages.map(m => `## ${m.role === 'user' ? 'You' : agent.name}\n\n${m.content}`).join('\n\n')}/>}</div>
          {thread.status === 'empty' && !thread.messages.length && <div className="ws-empty-thread"><h1>Chat with {agent.name}</h1><p>Send a message to start a separate conversation.</p></div>}
          {thread.messages.map((message, i) => <div className="ws-turn" key={i}><MessageBubble message={message} agentName={agent.name} workbench/></div>)}
          {statusCopy[thread.status] && <section className="ws-state" role={['pending','loading'].includes(thread.status) ? 'status' : 'alert'}><h2>{statusCopy[thread.status]![0]}</h2><p>{statusCopy[thread.status]![1]}</p>{thread.attemptedText && ['uncertain','pending'].includes(thread.status) && !thread.messages.some(message => message.role === 'user' && message.content === thread.attemptedText) && <p>Attempted message: {thread.attemptedText}</p>}
            {thread.status === 'unavailable' && <button onClick={() => setHistoryGeneration(n => n + 1)}>Try loading again</button>}
            {thread.status === 'uncertain' && view.kind === 'conversation' && <button onClick={() => setHistoryGeneration(n => n + 1)}>Check history</button>}
            {thread.status === 'uncertain' && view.kind !== 'conversation' && <p>No confirmed conversation ID is available for a history read. No resend is offered.</p>}
            {thread.status === 'metadata-warning' && <button onClick={() => setListGeneration(n => n + 1)}>Check conversation list</button>}
            {thread.status === 'missing' && <button onClick={newChat}>New conversation</button>}
            {['unavailable','missing','access-unavailable'].includes(thread.status) && <button onClick={() => go(workspaceQuery(agent.id))}>Back to workspace</button>}
          </section>}
          <span className="sr-only" role="status">{thread.status === 'ready' && thread.messages.at(-1)?.role === 'assistant' ? 'Reply received' : ''}</span>
        </div></div><div className="ws-compose-wrap">{composer()}<p className="ws-small">Enter to send · Shift + Enter for a new line</p></div>
      </> : null}
    </main></div>
    <WorkspaceModal open={drawer} onOpenChange={setDrawer} title="Navigation" drawer returnFocus={() => matchMedia('(min-width:1024px)').matches ? desktopNav.current?.querySelector<HTMLElement>('[aria-current], a') ?? null : menuButton.current}><nav className="ws-drawer-nav" aria-label="Mobile workspace navigation">{navigation}</nav></WorkspaceModal>
    <WorkspaceModal open={contextOpen} onOpenChange={setContextOpen} title="Demo context">{context}</WorkspaceModal>
    <WorkspaceModal open={!!actionRow} onOpenChange={open => { if (!open && !mutation) setActionRow(null); }} title="Conversation actions" returnFocus={() => archived.current ? recentHeading.current : rowOpener.current}><label htmlFor="ws-rename">Conversation title</label><input id="ws-rename" className="ws-field" value={rename} onChange={e => setRename(e.target.value)}/>{mutationError && <p role="alert">{mutationError}</p>}<div className="ws-dialog-actions"><button className="ws-primary" disabled={mutation || !rename.trim()} onClick={() => void handleMutation(false)}>Save name</button><button disabled={mutation} onClick={() => void handleMutation(true)}>Archive conversation</button></div><p className="ws-small">Archive hides the conversation from the list. It does not delete its history.</p></WorkspaceModal>
  </div>;
}
