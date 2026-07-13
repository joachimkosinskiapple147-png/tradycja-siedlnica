'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Album } from '@/lib/types';
import { cn } from '@/lib/utils';
import { deleteAlbum, quickSetAlbum } from '@/actions/gallery';

export default function AlbumAdminTable({ albums }: { albums: Album[] }) {
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = (id: string, fn: () => Promise<void>) => {
    setBusyId(id);
    start(async () => {
      await fn();
      setBusyId(null);
    });
  };

  if (albums.length === 0) {
    return (
      <div className="border border-navy/12 bg-ivory p-12 text-center">
        <p className="text-charcoal/60">Brak albumów. Dodaj pierwszy album.</p>
        <Link href="/admin/galeria/nowy" className="btn-primary mt-5">Dodaj album</Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-navy/12 bg-ivory">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/12 bg-cream text-left text-[0.68rem] uppercase tracking-wide2 text-charcoal/55">
            <th className="px-4 py-3 font-medium">Album</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Zdjęć</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Publikacja</th>
            <th className="px-4 py-3 text-right font-medium">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((a) => {
            const isBusy = pending && busyId === a.id;
            return (
              <tr key={a.id} className={cn('border-b border-navy/8 last:border-0', isBusy && 'opacity-50')}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-beige-soft">
                      <Image src={a.cover.url} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="font-medium text-navy">{a.title}</div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{a.images.length}</td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <button
                    type="button"
                    onClick={() => run(a.id, () => quickSetAlbum(a.id, { publish: a.publish === 'opublikowany' ? 'szkic' : 'opublikowany' }))}
                    className={cn(
                      'rounded-sm px-2.5 py-1 text-[0.72rem] font-medium',
                      a.publish === 'opublikowany' ? 'bg-forest/10 text-forest' : 'bg-charcoal/10 text-charcoal/70'
                    )}
                  >
                    {a.publish === 'opublikowany' ? 'Opublikowany' : 'Szkic'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/galeria/${a.slug}`} target="_blank" className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">Podgląd</Link>
                    <Link href={`/admin/galeria/${a.id}`} className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">Edytuj</Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Usunąć album „${a.title}”? Tej operacji nie można cofnąć.`)) run(a.id, () => deleteAlbum(a.id));
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
