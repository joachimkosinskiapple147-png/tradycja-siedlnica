import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById, getHorses } from '@/lib/data/queries';
import { requireAdmin } from '@/lib/supabase/admin';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import EventForm from '@/components/admin/EventForm';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [event, horses] = await Promise.all([getEventById(params.id), getHorses({ includeUnpublished: true })]);
  if (!event) notFound();

  return (
    <AdminChrome>
      <AdminHeader
        title={`Edytuj: ${event.title}`}
        subtitle="Zmień dane wydarzenia"
        action={
          <div className="flex gap-2">
            <Link href={`/wydarzenia/${event.slug}`} target="_blank" className="btn-ghost">Podgląd</Link>
            <Link href="/admin/wydarzenia" className="btn-ghost">← Lista</Link>
          </div>
        }
      />
      <div className="p-6 lg:p-10">
        <EventForm event={event} horses={horses} />
      </div>
    </AdminChrome>
  );
}
