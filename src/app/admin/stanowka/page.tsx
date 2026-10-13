import Link from 'next/link';
import Image from 'next/image';
import { getStallions } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import TeamRowActions from '@/components/admin/TeamRowActions';
import { deleteStallion } from '@/actions/team';

export const dynamic = 'force-dynamic';

export default async function AdminStallionsPage({
  searchParams,
}: {
  searchParams: { zapisano?: string };
}) {
  const list = await getStallions({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader
        title="Stanówka"
        subtitle={list.length + ' ogiery na stanówce'}
        action={
          <div className="flex gap-2">
            <Link href="/admin/stanowka/nowy" className="btn-primary">+ Ogier</Link>
            <Link href="/stanowka" className="btn-ghost">Podgląd →</Link>
          </div>
        }
      />
      <div className="space-y-3 p-4 sm:p-6 lg:p-8">
        {searchParams.zapisano && (
          <p className="border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">Zmiany zostały zapisane.</p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((s) => (
            <div key={s.id} className="card-app !rounded-2xl flex gap-3 p-3">
              <Image src={s.image.url} alt="" width={88} height={88} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold text-navy">{s.name}</div>
                <div className="text-[0.78rem] font-bold text-brass-deep">{s.covering_price ?? 'Cena na zapytanie'}</div>
                <div className="mt-1 truncate text-[0.78rem] font-medium text-charcoal/60">/{s.slug} · {s.publish}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TeamRowActions id={s.id} name={s.name} editHref={'/admin/stanowka/' + s.id} onDelete={deleteStallion} />
                  <Link href={'/stanowka/' + s.slug} className="link-underline text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Otwórz →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && (
          <div className="card-app !rounded-2xl p-12 text-center">
            <p className="text-charcoal/60">Brak ogierów. Dodaj pierwszego ogiera na stanówkę.</p>
            <Link href="/admin/stanowka/nowy" className="btn-primary mt-5">+ Ogier</Link>
          </div>
        )}
      </div>
    </AdminChrome>
  );
}
