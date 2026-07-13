'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { NAV, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [open, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Zamknij menu"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-navy/60 transition-opacity duration-400',
          open ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-navy text-ivory transition-transform duration-500 ease-editorial',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-ivory/15 px-6 py-5">
          <span className="font-display text-xl">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="inline-flex h-10 w-10 items-center justify-center text-ivory/80 hover:text-ivory"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Menu mobilne" className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-baseline gap-4 border-b border-ivory/10 py-4 font-display text-2xl text-ivory/90 transition-colors hover:text-ivory"
                >
                  <span className="text-[0.7rem] font-sans tabular-nums text-brass-soft">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-ivory/15 px-6 py-6">
          <Link href="/konie" onClick={onClose} className="btn-brass w-full">
            Konie na sprzedaż
          </Link>
          <a href={`tel:${SITE.phoneHref}`} className="mt-3 block text-center text-ivory/80">
            <span className="text-[0.7rem] uppercase tracking-eyebrow text-brass-soft">Telefon</span>
            <span className="mt-1 block font-display text-2xl">{SITE.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
