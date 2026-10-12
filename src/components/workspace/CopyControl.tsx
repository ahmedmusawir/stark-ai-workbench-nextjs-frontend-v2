'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
export function CopyControl({ text, label = 'Copy message' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  return <div className="ws-copy">
    <button type="button" aria-label={copied ? 'Copied' : label} title={label} onClick={async () => {
      try { await navigator.clipboard.writeText(text); setCopied(true); setFallback(false); }
      catch { setFallback(true); }
    }}>{copied ? <Check size={16}/> : <Copy size={16}/>}<span className="sr-only">{label}</span></button>
    {fallback && <div className="ws-copy-fallback"><p role="status">Clipboard unavailable. Select and copy the text below.</p><textarea aria-label="Text to copy manually" readOnly value={text} onFocus={e => e.currentTarget.select()}/><button type="button" onClick={() => setFallback(false)}>Close copy fallback</button></div>}
  </div>;
}
