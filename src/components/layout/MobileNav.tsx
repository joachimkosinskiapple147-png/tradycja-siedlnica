'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function MobileNav({ open, onClose, phone, phoneHref }: { open: boolean; onClose: () => void; phone: string; phoneHref: string }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
    }
  }, [open, onClose]);

  return (
    <div className={cn('fixed inset-0 z-[60] lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <button type="button" aria-label="Zamknij menu" onClick={onClose}
        className={cn('absolute inset-0 bg-navy/60 backdrop-blur-[2px] transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')} />
      <div role="dialog" aria-modal="true" aria-label="Menu"
        className={cn('absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col rounded-l-3xl bg-navy text-ivory shadow-2xl transition-transform duration-400 ease-editorial', open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between border-b border-ivory/15 px-5 py-4">
          <span className="font-display text-xl font-medium">Menu</span>
          <button type="button" onClick={onClose} aria-label="Zamknij"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 text-ivory/80 hover:text-ivory">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu mobilne" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onClose}
                  className={cn('flex items-center gap-3 rounded-2xl px-3 py-3 font-display text-[1.35rem] font-medium transition-colors',
                    item.label === 'Stanówka' ? 'bg-brass/15 text-brass-soft' : 'text-ivory/90 hover:bg-ivory/10 hover:text-ivory')}>
                  <span className="text-[0.65rem] font-sans tabular-nums text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2.5 border-t border-ivory/15 px-5 py-5">
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/konie" onClick={onClose} className="btn-primary w-full !px-3 text-center">Konie</Link>
            <Link href="/stanowka" onClick={onClose} className="btn-brass w-full !px-3 text-center">Stanówka</Link>
          </div>
          <a href={`tel:${phoneHref}`} className="block rounded-2xl bg-ivory/8 px-4 py-3 text-center">
            <span className="text-[0.65rem] uppercase tracking-eyebrow text-brass-soft">Telefon</span>
            <span className="mt-0.5 block font-display text-xl font-medium">{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
