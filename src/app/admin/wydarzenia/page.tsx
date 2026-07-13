import Link from 'next/link';
import { getEvents } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import EventAdminTable from '@/components/admin/EventAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: { zapisano?: string };
}) {
  const events = await getEvents({ includeUnpublished: true });

  return (
    <AdminChrome>
      <AdminHeader
        title="Wydarzenia"
        subtitle={`${events.length} ${events.length === 1 ? 'wydarzenie' : 'pozycji'} w bazie`}
        action={<Link href="/admin/wydarzenia/nowe" className="btn-primary">Dodaj wydarzenie</Link>}
      />
      <div className="p-6 lg:p-10">
        {searchParams.zapisano && (
          <p className="mb-6 border border-forest/40 bg-forest/5 px-4 py-3 text-sm text-forest">Zmiany zostały zapisane.</p>
        )}
        <EventAdminTable events={events} />
      </div>
    </AdminChrome>
  );
}
