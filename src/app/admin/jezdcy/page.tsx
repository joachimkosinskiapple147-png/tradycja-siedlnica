import Link from 'next/link';
import Image from 'next/image';
import { getRiders } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';

export const dynamic = 'force-dynamic';

export default async function AdminRidersPage() {
  const riders = await getRiders({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader title="Jeźdźcy" subtitle={riders.length + ' profili zespołu'} action={<Link href="/jezdcy" className="btn-ghost">Podgląd →</Link>} />
      <div className="space-y-3 p-4 sm:p-6 lg:p-8">
        <div className="card-app !rounded-2xl border-brass/30 !bg-brass/8 p-4 text-[0.84rem] font-medium text-charcoal/75">
          Profile edytujesz w pliku <code>src/lib/data/riders.ts</code> albo — po migracji — w tabeli Supabase <code>riders</code>
          (migracja: supabase/migrations/20261013_riders_stallions.sql). Zdjęcie = URL z /public/images/full. Po zapisie profil od razu widać pod /jezdcy.
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {riders.map((r) => (
            <div key={r.id} className="card-app !rounded-2xl flex gap-3 p-3">
              <Image src={r.image.url} alt="" width={88} height={88} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold text-navy">{r.name}</div>
                <div className="text-[0.72rem] font-bold uppercase tracking-wide2 text-brass-deep">{r.role}</div>
                <div className="mt-1 truncate text-[0.78rem] font-medium text-charcoal/60">/{r.slug} · {r.publish}</div>
                <Link href={'/jezdcy/' + r.slug} className="link-underline mt-1 text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Otwórz profil →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminChrome>
  );
}
