'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Horse } from '@/lib/types';
import { HORSE_STATUS, SEX_LABEL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { deleteHorse, quickSetHorse } from '@/actions/admin';

export default function HorseAdminTable({ horses }: { horses: Horse[] }) {
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const run = (id: string, fn: () => Promise<void>) => {
    setBusyId(id);
    start(async () => {
      await fn();
      setBusyId(null);
      router.refresh();
    });
  };

  if (horses.length === 0) {
    return (
      <div className="border border-navy/12 bg-ivory p-12 text-center">
        <p className="text-charcoal/60">Brak koni. Dodaj pierwszego konia, aby pojawił się na stronie.</p>
        <Link href="/admin/konie/nowy" className="btn-primary mt-5">Dodaj konia</Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-navy/12 bg-ivory">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/12 bg-cream text-left text-[0.68rem] uppercase tracking-wide2 text-charcoal/55">
            <th className="px-4 py-3 font-medium">Koń</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Status</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Publikacja</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Wyróżniony</th>
            <th className="px-4 py-3 text-right font-medium">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {horses.map((h) => {
            const cover = h.images.find((i) => i.is_cover) ?? h.images[0];
            const s = HORSE_STATUS[h.status];
            const isBusy = pending && busyId === h.id;
            return (
              <tr key={h.id} className={cn('border-b border-navy/8 last:border-0', isBusy && 'opacity-50')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-beige-soft">
                      {cover && <Image src={cover.thumb || cover.url} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-navy">{h.name}</div>
                      <div className="truncate text-[0.75rem] text-charcoal/55">
                        {[SEX_LABEL[h.sex], h.breed, h.birth_year].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className={cn('status-pill bg-cream', s.tone)}>
                    <span className={cn('status-dot', s.dot)} />
                    {s.label}
                  </span>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <button
                    type="button"
                    onClick={() =>
                      run(h.id, () =>
                        quickSetHorse(h.id, { publish: h.publish === 'opublikowany' ? 'szkic' : 'opublikowany' })
                      )
                    }
                    className={cn(
                      'rounded-sm px-2.5 py-1 text-[0.72rem] font-medium',
                      h.publish === 'opublikowany' ? 'bg-forest/10 text-forest' : 'bg-charcoal/10 text-charcoal/70'
                    )}
                  >
                    {h.publish === 'opublikowany' ? 'Opublikowany' : 'Szkic'}
                  </button>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <button
                    type="button"
                    onClick={() => run(h.id, () => quickSetHorse(h.id, { featured: !h.featured }))}
                    aria-label={h.featured ? 'Usuń z wyróżnionych' : 'Wyróżnij'}
                    className={h.featured ? 'text-brass' : 'text-navy/25 hover:text-brass'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={h.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4">
                      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" strokeLinejoin="round" />
                    </svg>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/konie/${h.slug}`} target="_blank" className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">
                      Podgląd
                    </Link>
                    <Link href={`/admin/konie/${h.id}`} className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">
                      Edytuj
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Usunąć konia „${h.name}”? Tej operacji nie można cofnąć.`)) {
                          run(h.id, () => deleteHorse(h.id));
                        }
                      }}
                      className="rounded-sm border border-red-300 px-2.5 py-1.5 text-[0.72rem] text-red-600 hover:bg-red-50"
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
