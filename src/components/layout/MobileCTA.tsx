'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/constants';

export default function MobileCTA() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-ivory/95 backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-2">
        <a
          href={`tel:${SITE.phoneHref}`}
          className="flex items-center justify-center gap-2 border-r border-navy/10 py-3.5 text-[0.8rem] font-semibold uppercase tracking-wide2 text-navy"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.5 3.5 9 3.8l1.2 3.4-1.6 1.3a12 12 0 0 0 4.6 4.6l1.3-1.6 3.4 1.2.3 2.5a1.7 1.7 0 0 1-1.8 1.9A15 15 0 0 1 4.6 5.3 1.7 1.7 0 0 1 6.5 3.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Zadzwoń
        </a>
        <Link
          href="/konie"
          className="flex items-center justify-center gap-2 bg-navy py-3.5 text-[0.8rem] font-semibold uppercase tracking-wide2 text-ivory"
        >
          Zapytaj o konia
        </Link>
      </div>
    </div>
  );
}
