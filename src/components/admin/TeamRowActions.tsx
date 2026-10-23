'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TeamRowActions({
  id,
  name,
  editHref,
  onDelete,
}: {
  id: string;
  name: string;
  editHref: string;
  onDelete: (id: string) => Promise<void>;
}) {
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  return (
    <div className={cn('flex items-center gap-2', (pending || busy) && 'opacity-50')}>
      <Link href={editHref} className="rounded-sm border border-navy/15 px-2.5 py-1.5 text-[0.72rem] text-navy hover:bg-cream">
        Edytuj
      </Link>
      <button
        type="button"
        disabled={pending || busy}
        onClick={() => {
          if (confirm(`Usunąć „${name}”? Tej operacji nie można cofnąć.`)) {
            setBusy(true);
            start(async () => {
              await onDelete(id);
              setBusy(false);
              router.refresh();
            });
          }
        }}
        className="rounded-sm border border-red-300 px-2.5 py-1.5 text-[0.72rem] text-red-600 hover:bg-red-50"
      >
        Usuń
      </button>
    </div>
  );
}
