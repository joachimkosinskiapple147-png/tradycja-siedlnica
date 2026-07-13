'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import MobileNav from './MobileNav';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Panel administratora ma własny layout — nie pokazujemy publicznego nagłówka.
  if (pathname?.startsWith('/admin')) return null;

  const solid = scrolled;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial',
          solid
            ? 'border-b border-navy/10 bg-ivory/95 backdrop-blur-sm'
            : 'border-b border-transparent bg-gradient-to-b from-navy/45 to-transparent'
        )}
      >
        <div className="shell-wide flex h-[76px] items-center justify-between gap-6">
          <Link href="/" aria-label="Strona główna — Tradycja Siedlnica" className="shrink-0">
            <Logo variant={solid ? 'light' : 'dark'} />
          </Link>

          <nav aria-label="Główne" className="hidden items-center gap-7 lg:flex">
            {NAV.slice(1).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'link-underline text-[0.82rem] font-medium uppercase tracking-wide2 transition-colors',
                    solid ? 'text-navy/80 hover:text-navy' : 'text-ivory/90 hover:text-ivory',
                    active && (solid ? 'text-navy' : 'text-ivory')
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/konie"
              className={cn(
                'hidden md:inline-flex',
                solid ? 'btn-primary' : 'btn-brass'
              )}
            >
              Konie na sprzedaż
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Otwórz menu"
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center lg:hidden',
                solid ? 'text-navy' : 'text-ivory'
              )}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
