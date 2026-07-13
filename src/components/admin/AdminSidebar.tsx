'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { signOut } from '@/actions/admin';

const LINKS = [
  { href: '/admin', label: 'Pulpit', exact: true },
  { href: '/admin/konie', label: 'Konie' },
  { href: '/admin/wiadomosci', label: 'Wiadomości' },
];

const PHASE2 = ['Wydarzenia', 'Galerie', 'Oferta', 'Strona główna', 'Ustawienia'];

export default function AdminSidebar({ email, unread }: { email?: string; unread?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Górny pasek mobilny */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-navy/10 bg-navy px-4 py-3 text-ivory lg:hidden">
        <span className="font-display text-lg">Panel</span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu panelu" className="p-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>

      <aside
        className={cn(
          'z-40 w-full shrink-0 border-r border-navy/10 bg-navy text-ivory lg:block lg:w-64',
          open ? 'block' : 'hidden lg:block'
        )}
      >
        <div className="flex h-full flex-col lg:sticky lg:top-0 lg:h-screen">
          <div className="hidden items-center gap-3 border-b border-ivory/12 px-6 py-5 lg:flex">
            <Image src="/images/brand/logo-mark-cream.png" alt="" width={38} height={38} className="h-9 w-9 rounded-full" />
            <div className="leading-tight">
              <div className="font-display text-lg">Tradycja</div>
              <div className="text-[0.6rem] uppercase tracking-eyebrow text-brass-soft">Panel</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-sm px-3 py-2.5 text-sm transition-colors',
                      isActive(l.href, l.exact) ? 'bg-ivory/12 text-ivory' : 'text-ivory/70 hover:bg-ivory/8 hover:text-ivory'
                    )}
                  >
                    {l.label}
                    {l.href === '/admin/wiadomosci' && unread ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1.5 text-[0.7rem] font-semibold text-navy">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 px-3">
              <div className="text-[0.62rem] uppercase tracking-eyebrow text-ivory/40">Wkrótce</div>
              <ul className="mt-3 space-y-1.5">
                {PHASE2.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-ivory/35">
                    <span className="h-1 w-1 rounded-full bg-ivory/25" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="border-t border-ivory/12 px-4 py-4">
            {email && <p className="mb-3 truncate text-[0.72rem] text-ivory/50">{email}</p>}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex-1 rounded-sm border border-ivory/20 px-3 py-2 text-center text-[0.72rem] uppercase tracking-wide2 text-ivory/80 hover:bg-ivory/10">
                Podgląd
              </Link>
              <form action={signOut} className="flex-1">
                <button type="submit" className="w-full rounded-sm border border-ivory/20 px-3 py-2 text-[0.72rem] uppercase tracking-wide2 text-ivory/80 hover:bg-ivory/10">
                  Wyloguj
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
