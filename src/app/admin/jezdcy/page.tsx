import Link from 'next/link';
import Image from 'next/image';
import { getRiders } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import TeamRowActions from '@/components/admin/TeamRowActions';
import { deleteRider } from '@/actions/team';

export const dynamic = 'force-dynamic';

export default async function AdminRidersPage({
  searchParams,
}: {
  searchParams: { zapisano?: string };
}) {
  const riders = await getRiders({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader
        title="Jeźdźcy"
        subtitle={riders.length + ' profili zespołu'}
        action={
          <div className="flex gap-2">
            <Link href="/admin/jezdcy/nowy" className="btn-primary">+ Jeździec</Link>
            <Link href="/jezdcy" className="btn-ghost">Podgląd →</Link>
          </div>
        }
      />
      <div className="space-y-3 p-4 sm:p-6 lg:p-8">
        {searchParams.zapisano && (
          <p className="border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">Zmiany zostały zapisane.</p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {riders.map((r) => (
            <div key={r.id} className="card-app !rounded-2xl flex gap-3 p-3">
              <Image src={r.image.url} alt="" width={88} height={88} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold text-navy">{r.name}</div>
                <div className="text-[0.72rem] font-bold uppercase tracking-wide2 text-brass-deep">{r.role}</div>
                <div className="mt-1 truncate text-[0.78rem] font-medium text-charcoal/60">/{r.slug} · {r.publish}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TeamRowActions id={r.id} name={r.name} editHref={'/admin/jezdcy/' + r.id} onDelete={deleteRider} />
                  <Link href={'/jezdcy/' + r.slug} className="link-underline text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Otwórz profil →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {riders.length === 0 && (
          <div className="card-app !rounded-2xl p-12 text-center">
            <p className="text-charcoal/60">Brak jeźdźców. Dodaj pierwszy profil zespołu.</p>
            <Link href="/admin/jezdcy/nowy" className="btn-primary mt-5">+ Jeździec</Link>
          </div>
        )}
      </div>
    </AdminChrome>
  );
}
