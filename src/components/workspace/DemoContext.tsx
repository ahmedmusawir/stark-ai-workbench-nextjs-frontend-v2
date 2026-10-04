'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { FileText, Pencil, Plus, X, ChevronDown } from 'lucide-react';
import { WorkspaceModal } from './WorkspaceModal';
export const DEMO_DISCLOSURE = 'Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.';
export interface DemoState { instructions: string; samples: string[] }
export const initialDemo = (): DemoState => ({ instructions: 'Be clear and practical. Explain the reasoning, then suggest a useful next step.', samples: ['Workspace overview.md', 'Response preferences.md'] });
const samples: Record<string,string> = { 'Workspace overview.md': 'Fictional sample: a workspace for exploring ideas. This text is not agent context.', 'Response preferences.md': 'Fictional sample: prefer clear, concise answers and practical next steps.', 'Research checklist.md': 'Fictional sample: define the question, compare sources, summarize findings.' };
export function DemoContext({ state, onChange }: { state: DemoState; onChange(state: DemoState): void }) {
  const [dialog, setDialog] = useState<'edit' | 'add' | string | null>(null); const [edit, setEdit] = useState('');
  return <section className="ws-context"><header><FileText size={20}/><h2>Agent context</h2><span className="ws-badge">Demo</span></header>
    <p className="ws-notice">{DEMO_DISCLOSURE}</p>
    <div className="ws-context-section"><div className="ws-section-head"><h3>Instructions</h3><button className="ws-icon" aria-label="Edit demo instructions" onClick={() => { setEdit(state.instructions); setDialog('edit'); }}><Pencil size={18}/></button></div><p>{state.instructions || 'No demo instructions.'}</p></div>
    <div className="ws-context-section"><div className="ws-section-head"><h3>Sample documents</h3><button className="ws-icon" aria-label="Add sample document" onClick={() => setDialog('add')}><Plus size={20}/></button></div>
      {state.samples.map(name => <div className="ws-document" key={name}><button aria-label={`Preview ${name}`} onClick={() => setDialog(name)}><FileText size={16}/><span>{name}</span></button><button className="ws-icon" aria-label={`Remove ${name}`} onClick={e => { const section = e.currentTarget.closest('section'); onChange({ ...state, samples: state.samples.filter(s => s !== name) }); (section?.querySelector('[aria-label="Add sample document"]') as HTMLElement)?.focus(); }}><X size={18}/></button></div>)}
      <p className="ws-small">Sample content only. No uploads.</p><button className="ws-small" onClick={() => onChange(initialDemo())}>Reset demo context</button>
    </div>
    <WorkspaceModal open={dialog !== null} onOpenChange={open => { if (!open) setDialog(null); }} title={dialog === 'edit' ? 'Edit demo instructions' : dialog === 'add' ? 'Add sample document' : 'Sample preview'}>
      <p className="ws-notice">{DEMO_DISCLOSURE}</p>
      {dialog === 'edit' ? <><label htmlFor="ws-demo-instructions">Demo instructions</label><textarea className="ws-field" id="ws-demo-instructions" value={edit} onChange={e => setEdit(e.target.value)}/><button className="ws-primary" onClick={() => { onChange({ ...state, instructions: edit }); setDialog(null); }}>Apply to demo</button></> : dialog === 'add' ? Object.keys(samples).map(name => <button className="ws-sample" disabled={state.samples.includes(name)} key={name} onClick={() => { onChange({ ...state, samples: [...state.samples, name] }); setDialog(null); }}>{name}{state.samples.includes(name) ? ' — Added' : ''}</button>) : <p>{dialog && samples[dialog]}</p>}
    </WorkspaceModal>
  </section>;
}
export function WorkspaceContextDisclosure({ children }: { children: React.ReactNode }) {
  const [desktop, setDesktop] = useState(false); const [expanded, setExpanded] = useState(false); const id = useId(); const trigger = useRef<HTMLButtonElement>(null); const content = useRef<HTMLDivElement>(null);
  useEffect(() => { const media = matchMedia('(min-width:1024px)'); const update = () => { if (!media.matches && !expanded && content.current?.contains(document.activeElement)) setTimeout(() => trigger.current?.focus(), 0); setDesktop(media.matches); }; update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, [expanded]);
  return <div className="ws-context-disclosure"><button ref={trigger} className="ws-disclosure-trigger" aria-expanded={desktop || expanded} aria-controls={id} onClick={() => setExpanded(v => !v)}>Demo context <ChevronDown size={18}/></button><div ref={content} id={id} hidden={!desktop && !expanded}>{children}</div></div>;
}
