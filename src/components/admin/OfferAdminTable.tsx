'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Offer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { deleteOffer, quickSetOffer } from '@/actions/offers';

export default function OfferAdminTable({ offers }: { offers: Offer[] }) {
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

  if (offers.length === 0) {
    return (
      <div className="border border-navy/12 bg-ivory p-12 text-center">
        <p className="text-charcoal/60">Brak ofert. Dodaj pierwszą pozycję oferty.</p>
        <Link href="/admin/oferta/nowa" className="btn-primary mt-5">Dodaj ofertę</Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-navy/12 bg-ivory">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/12 bg-cream text-left text-[0.68rem] uppercase tracking-wide2 text-charcoal/55">
            <th className="px-4 py-3 font-medium">Oferta</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Status</th>
            <th className="px-4 py-3 text-right font-medium">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o) => {
            const isBusy = pending && busyId === o.id;
            return (
              <tr key={o.id} className={cn('border-b border-navy/8 last:border-0', isBusy && 'opacity-50')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-beige-soft">
                      <Image src={o.image.url} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="font-medium text-navy">{o.title}</div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <button
                    type="button"
                    onClick={() => run(o.id, () => quickSetOffer(o.id, { active: !o.active }))}
                    className={cn(
                      'rounded-sm px-2.5 py-1 text-[0.72rem] font-medium',
                      o.active ? 'bg-forest/10 text-forest' : 'bg-charcoal/10 text-charcoal/70'
                    )}
                  >
                    {o.active ? 'Aktywna' : 'Nieaktywna'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/oferta/${o.id}`} className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">Edytuj</Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Usunąć ofertę „${o.title}”? Tej operacji nie można cofnąć.`)) run(o.id, () => deleteOffer(o.id));
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
