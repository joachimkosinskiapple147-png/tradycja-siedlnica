import Link from 'next/link';
import Image from 'next/image';
import { getLegends } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';

export const dynamic = 'force-dynamic';

export default async function AdminLegendsPage() {
  const list = await getLegends({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader title="Legendy" subtitle={list.length + ' profili hall of fame'} action={<Link href="/legendy" className="btn-brass">Podgląd →</Link>} />
      <div className="space-y-3 p-4 sm:p-6 lg:p-8">
        <div className="card-app !rounded-2xl border-brass/30 !bg-brass/8 p-4 text-[0.84rem] font-medium text-charcoal/75">
          Legendy edytujesz w <code>src/lib/data/legends.ts</code> albo w tabeli Supabase <code>legends</code>.
          Pola: imię, rasa, lata w stajni, gdzie dziś, osiągnięcia, historia. To konie, które już u nas nie stoją, ale stąd wyszły.
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((l) => (
            <div key={l.id} className="card-app !rounded-2xl flex gap-3 p-3">
              <Image src={l.image.url} alt="" width={88} height={88} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold text-navy">★ {l.name}</div>
                <div className="truncate text-[0.78rem] font-bold text-brass-deep">{l.where_now ?? ''}</div>
                <div className="mt-1 truncate text-[0.78rem] font-medium text-charcoal/60">/{l.slug} · {l.publish}</div>
                <Link href={'/legendy/' + l.slug} className="link-underline mt-1 text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Otwórz →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminChrome>
  );
}
