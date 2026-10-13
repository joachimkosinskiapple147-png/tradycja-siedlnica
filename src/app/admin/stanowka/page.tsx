import Link from 'next/link';
import Image from 'next/image';
import { getStallions } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';

export const dynamic = 'force-dynamic';

export default async function AdminStallionsPage() {
  const list = await getStallions({ includeUnpublished: true });
  return (
    <AdminChrome>
      <AdminHeader title="Stanówka" subtitle={list.length + ' ogiery na stanówce'} action={<Link href="/stanowka" className="btn-brass">Podgląd →</Link>} />
      <div className="space-y-3 p-4 sm:p-6 lg:p-8">
        <div className="card-app !rounded-2xl border-brass/30 !bg-brass/8 p-4 text-[0.84rem] font-medium text-charcoal/75">
          Ogiery edytujesz w <code>src/lib/data/stallions.ts</code> albo w tabeli Supabase <code>stallions</code>.
          Pola: imię, rasa, rodowód, cena krycia, nasienie (świeże/mrożone), sezon, opis. Prawidłowa nazwa działu to <b>Stanówka</b> — tak nazywa się miejsce krycia w hodowli koni.
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((s) => (
            <div key={s.id} className="card-app !rounded-2xl flex gap-3 p-3">
              <Image src={s.image.url} alt="" width={88} height={88} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold text-navy">{s.name}</div>
                <div className="text-[0.78rem] font-bold text-brass-deep">{s.covering_price ?? 'Cena na zapytanie'}</div>
                <div className="mt-1 truncate text-[0.78rem] font-medium text-charcoal/60">/{s.slug} · {s.semen ?? ''}</div>
                <Link href={'/stanowka/' + s.slug} className="link-underline mt-1 text-[0.72rem] font-bold uppercase tracking-wide2 text-navy">Otwórz →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminChrome>
  );
}
