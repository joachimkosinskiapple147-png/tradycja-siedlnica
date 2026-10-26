import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHorseById } from '@/lib/data/queries';
import { requireAdmin } from '@/lib/supabase/admin';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import HorseForm from '@/components/admin/HorseForm';

export const dynamic = 'force-dynamic';

export default async function EditHorsePage({ params }: { params: { id: string } }) {
  // Najpierw bramka logowania (przekierowanie), dopiero potem odczyt —
  // inaczej wygasła sesja kończyłaby się mylącym 404 zamiast loginem.
  await requireAdmin();
  const horse = await getHorseById(params.id);
  if (!horse) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${horse.name}`}
        subtitle="Zmień dane konia"
        action={
          <div className="flex gap-2">
            <Link href={`/konie/${horse.slug}`} target="_blank" className="btn-ghost">Podgląd</Link>
            <Link href="/admin/konie" className="btn-ghost">← Lista</Link>
          </div>
        }
      />
      <div className="p-6 lg:p-10">
        <HorseForm horse={horse} />
      </div>
    </AdminChrome>
  );
}
