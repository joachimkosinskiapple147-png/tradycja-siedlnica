import Link from 'next/link';
import { getHorses } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import HorseAdminTable from '@/components/admin/HorseAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminHorsesPage({
  searchParams,
}: {
  searchParams: { status?: string; zapisano?: string };
}) {
  const horses = await getHorses({ includeUnpublished: true, status: searchParams.status });

  return (
    <AdminChrome>
      <AdminHeader
        title="Konie"
        subtitle={`${horses.length} ${horses.length === 1 ? 'koń' : 'pozycji'} w bazie`}
        action={<Link href="/admin/konie/nowy" className="btn-primary">Dodaj konia</Link>}
      />
      <div className="p-6 lg:p-10">
        {searchParams.zapisano && (
          <p className="mb-6 border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">
            Zmiany zostały zapisane.
          </p>
        )}
        <HorseAdminTable horses={horses} />
      </div>
    </AdminChrome>
  );
}
