'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import MobileNav from './MobileNav';

export default function Header({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Aplikacyjne chowanie przy zjeździe, pokazywanie przy podjeździe
      setHidden(y > 300 && y > lastY + 4);
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
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
          hidden ? '-translate-y-full' : 'translate-y-0',
          solid
            ? 'border-b border-navy/10 bg-ivory/90 backdrop-blur-md shadow-[0_12px_32px_-20px_rgba(16,26,36,0.4)]'
            : 'border-b border-transparent bg-gradient-to-b from-navy/45 to-transparent'
        )}
      >
        <div className="shell-wide flex h-[76px] items-center justify-between gap-6">
          <Link href="/" aria-label="Strona główna — Tradycja Siedlnica" className="shrink-0">
            <Logo variant={solid ? 'light' : 'dark'} />
          </Link>

          <nav aria-label="Główne" className="hidden items-center gap-1.5 lg:flex">
            {NAV.slice(1).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-[0.8rem] font-medium uppercase tracking-wide2 transition-all duration-300',
                    solid ? 'text-navy/75 hover:bg-navy/5 hover:text-navy' : 'text-ivory/85 hover:bg-ivory/10 hover:text-ivory',
                    active && (solid ? 'bg-navy text-ivory hover:bg-navy hover:text-ivory' : 'bg-ivory/15 text-ivory')
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${phoneHref}`}
              className={cn(
                'hidden xl:inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.8rem] font-semibold tracking-wide transition-colors',
                solid ? 'border-navy/15 text-navy hover:border-navy' : 'border-ivory/30 text-ivory hover:bg-ivory/10'
              )}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
              {phone}
            </a>
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
        <span className="scroll-progress" style={{ width: `${Math.round(progress * 100)}%` }} aria-hidden="true" />
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} phone={phone} phoneHref={phoneHref} />
    </>
  );
}
