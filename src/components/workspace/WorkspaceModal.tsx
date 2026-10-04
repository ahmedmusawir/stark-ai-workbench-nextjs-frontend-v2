'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
const inertOwners = new WeakMap<HTMLElement, { count: number; previous: boolean }>();
const PortalContext = createContext<HTMLElement | null>(null);
export function WorkspacePortals({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { const el = document.createElement('div'); el.dataset.workspaceTheme = ''; el.dataset.workspacePortal = ''; document.body.appendChild(el); setHost(el); return () => el.remove(); }, []);
  return <PortalContext.Provider value={host}>{children}</PortalContext.Provider>;
}
export function WorkspaceModal({ open, onOpenChange, title, children, drawer = false, returnFocus }: { open: boolean; onOpenChange(open: boolean): void; title: string; children: ReactNode; drawer?: boolean; returnFocus?: () => HTMLElement | null }) {
  const host = useContext(PortalContext); const close = useRef<HTMLButtonElement>(null); const opener = useRef<HTMLElement | null>(null);
  useEffect(() => { if (open) opener.current = document.activeElement as HTMLElement; }, [open]);
  useEffect(() => {
    if (!open || !host) return;
    const root = document.querySelector<HTMLElement>('.ws-root[data-workspace-theme]');
    if (!root) return;
    const owner = inertOwners.get(root) ?? { count: 0, previous: root.inert };
    owner.count++; inertOwners.set(root, owner); root.inert = true;
    return () => { owner.count--; if (!owner.count) { root.inert = owner.previous; inertOwners.delete(root); } };
  }, [open, host]);
  // No body fallback portal: tokens/host exist before content can be visible.
  return <Dialog.Root open={open && !!host} onOpenChange={onOpenChange}>
    {host && <Dialog.Portal container={host}><Dialog.Overlay className="ws-overlay"/><Dialog.Content className={`ws-modal ${drawer ? 'ws-drawer' : ''}`} aria-describedby={undefined} onOpenAutoFocus={e => { e.preventDefault(); close.current?.focus(); }} onCloseAutoFocus={e => { e.preventDefault(); const preferred = returnFocus?.(); const target = preferred || opener.current; if (target?.isConnected && target.getClientRects().length) target.focus(); }}>
      <header><Dialog.Title>{title}</Dialog.Title><Dialog.Close asChild><button ref={close} type="button" className="ws-icon" aria-label={`Close ${title}`}><X size={20}/></button></Dialog.Close></header>{children}
    </Dialog.Content></Dialog.Portal>}
  </Dialog.Root>;
}
