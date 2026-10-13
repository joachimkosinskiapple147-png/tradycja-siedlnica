'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import MobileNav from './MobileNav';

export default function Header({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 320 && y > lastY + 5);
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-navy/10 bg-ivory/95 shadow-[0_10px_30px_-18px_rgba(16,26,36,0.45)] backdrop-blur-md transition-transform duration-400 ease-editorial',
          hidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div className="shell-wide flex h-[64px] items-center justify-between gap-3 md:h-[68px]">
          <Link href="/" aria-label="Strona główna — Tradycja Siedlnica" className="shrink-0">
            <Logo variant="light" />
          </Link>

          <nav aria-label="Główne" className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            {NAV.slice(1).map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              const hot = item.label === 'Stanówka';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'whitespace-nowrap rounded-full px-2.5 py-2 text-[0.74rem] font-semibold uppercase tracking-wide2 transition-all duration-300 xl:px-3',
                    hot
                      ? 'bg-brass/15 text-brass-deep ring-1 ring-brass/40 hover:bg-brass hover:text-ivory'
                      : active
                        ? 'bg-navy text-ivory'
                        : 'text-navy/70 hover:bg-navy/5 hover:text-navy'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`tel:${phoneHref}`}
              className="hidden items-center gap-2 rounded-full border border-navy/15 px-3.5 py-2 text-[0.78rem] font-semibold text-navy transition-colors hover:border-navy xl:inline-flex"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden="true" />
              {phone}
            </a>
            <Link href="/konie" className="btn-primary hidden !px-4 !py-2.5 text-[0.74rem] md:inline-flex">
              Konie
            </Link>
            <Link href="/stanowka" className="btn-brass hidden !px-4 !py-2.5 text-[0.74rem] lg:inline-flex">
              Stanówka
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Otwórz menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-navy hover:bg-navy/5 lg:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <span className="scroll-progress" style={{ width: `${Math.round(progress * 100)}%` }} aria-hidden="true" />
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} phone={phone} phoneHref={phoneHref} />
    </>
  );
}
