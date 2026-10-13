'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileCTA({ phoneHref }: { phoneHref: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 rounded-2xl border border-navy/10 bg-ivory/95 p-2 shadow-[0_16px_40px_-16px_rgba(16,26,36,0.5)] backdrop-blur-md">
        <a href={`tel:${phoneHref}`} className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-[0.72rem] font-bold uppercase tracking-wide2 text-navy active:scale-[0.97]">
          Zadzwoń
        </a>
        <Link href="/konie" className="flex items-center justify-center rounded-xl bg-navy py-3 text-[0.72rem] font-bold uppercase tracking-wide2 text-ivory active:scale-[0.97]">
          Konie
        </Link>
        <Link href="/stanowka" className="flex items-center justify-center rounded-xl bg-brass py-3 text-[0.72rem] font-bold uppercase tracking-wide2 text-navy active:scale-[0.97]">
          Stanówka
        </Link>
      </div>
    </div>
  );
}
