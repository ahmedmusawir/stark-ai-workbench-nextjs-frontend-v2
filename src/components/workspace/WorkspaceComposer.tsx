'use client';
import { useId, useLayoutEffect, useRef } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
export function WorkspaceComposer({ value, onChange, onSend, disabled, name, hero = false }: { value: string; onChange(value: string): void; onSend(): void; disabled: boolean; name: string; hero?: boolean }) {
  const id = useId(); const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => { const el = ref.current; if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(144, Math.max(hero ? 96 : 44, el.scrollHeight))}px`; } }, [value, hero]);
  return <form className={`ws-composer ${hero ? 'ws-composer-hero' : ''}`} onSubmit={e => { e.preventDefault(); if (!disabled && value.trim()) onSend(); }}>
    <label htmlFor={id} className={hero ? '' : 'sr-only'}>{hero ? 'Start a new conversation' : 'Message'}</label>
    <textarea id={id} ref={ref} value={value} disabled={disabled} rows={hero ? 3 : 1} placeholder={hero ? 'What would you like to work on?' : `Message ${name}…`} onChange={e => onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); if (!disabled && value.trim()) onSend(); } }}/>
    <div className="ws-composer-foot">{hero && <><span><MessageCircle size={16}/>{name}</span><small>Enter to send · Shift + Enter for a new line</small></>}
      <button type="submit" className="ws-primary ws-icon" aria-label="Send message" disabled={disabled || !value.trim()}><ArrowUp size={22}/></button>
    </div>
  </form>;
}
