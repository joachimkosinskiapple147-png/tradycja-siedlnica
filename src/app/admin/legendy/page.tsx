import Link from 'next/link';
import Image from 'next/image';
import { getLegends } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import TeamRowActions from '@/components/admin/TeamRowActions';
import { deleteLegend } from '@/actions/team';

export const dynamic = 'force-dynamic';

export default async function AdminLegendsPage({
  searchParams,
}: {
  searchParams: { zapisano?: string };
}) {
  const list = await getLegends({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader
        title="Legendy"
        subtitle={list.length + ' profili hall of fame'}
        action={
          <div className="flex gap-2">
            <Link href="/admin/legendy/nowa" className="btn-primary">★ Legenda</Link>
            <Link href="/legendy" className="btn-ghost">Podgląd →</Link>
          </div>
        }
      />
      <div className="space-y-3 p-4 sm:p-6 lg:p-8">
        {searchParams.zapisano && (
          <p className="border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">Zmiany zostały zapisane.</p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((l) => (
            <div key={l.id} className="card-app !rounded-2xl flex gap-3 p-3">
              <Image src={l.image.url} alt="" width={88} height={88} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold text-navy">★ {l.name}</div>
                <div className="truncate text-[0.78rem] font-bold text-brass-deep">{l.where_now ?? ''}</div>
                <div className="mt-1 truncate text-[0.78rem] font-medium text-charcoal/60">/{l.slug} · {l.publish}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TeamRowActions id={l.id} name={l.name} editHref={'/admin/legendy/' + l.id} onDelete={deleteLegend} />
                  <Link href={'/legendy/' + l.slug} className="link-underline text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Otwórz →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && (
          <div className="card-app !rounded-2xl p-12 text-center">
            <p className="text-charcoal/60">Brak legend. Dodaj pierwszą legendę stajni.</p>
            <Link href="/admin/legendy/nowa" className="btn-primary mt-5">★ Legenda</Link>
          </div>
        )}
      </div>
    </AdminChrome>
  );
}
