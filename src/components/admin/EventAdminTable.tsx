'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDatePl } from '@/lib/utils';
import { deleteEvent, quickSetEvent } from '@/actions/events';

export default function EventAdminTable({ events }: { events: EventItem[] }) {
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = (id: string, fn: () => Promise<void>) => {
    setBusyId(id);
    start(async () => {
      await fn();
      setBusyId(null);
    });
  };

  if (events.length === 0) {
    return (
      <div className="border border-navy/12 bg-ivory p-12 text-center">
        <p className="text-charcoal/60">Brak wydarzeń. Dodaj pierwsze wydarzenie.</p>
        <Link href="/admin/wydarzenia/nowe" className="btn-primary mt-5">Dodaj wydarzenie</Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-navy/12 bg-ivory">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/12 bg-cream text-left text-[0.68rem] uppercase tracking-wide2 text-charcoal/55">
            <th className="px-4 py-3 font-medium">Wydarzenie</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Data</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Publikacja</th>
            <th className="px-4 py-3 text-right font-medium">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const isBusy = pending && busyId === e.id;
            return (
              <tr key={e.id} className={cn('border-b border-navy/8 last:border-0', isBusy && 'opacity-50')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-beige-soft">
                      <Image src={e.cover.url} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-navy">{e.title}</div>
                      <div className="truncate text-[0.75rem] text-charcoal/55">{e.category}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{formatDatePl(e.date)}</td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <button
                    type="button"
                    onClick={() => run(e.id, () => quickSetEvent(e.id, { publish: e.publish === 'opublikowany' ? 'szkic' : 'opublikowany' }))}
                    className={cn(
                      'rounded-sm px-2.5 py-1 text-[0.72rem] font-medium',
                      e.publish === 'opublikowany' ? 'bg-forest/10 text-forest' : 'bg-charcoal/10 text-charcoal/70'
                    )}
                  >
                    {e.publish === 'opublikowany' ? 'Opublikowany' : 'Szkic'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/wydarzenia/${e.slug}`} target="_blank" className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">Podgląd</Link>
                    <Link href={`/admin/wydarzenia/${e.id}`} className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">Edytuj</Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Usunąć wydarzenie „${e.title}”? Tej operacji nie można cofnąć.`)) run(e.id, () => deleteEvent(e.id));
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
