import { getAlbums, getEvents, getHomeContent, getHorses } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import HomeContentForm from '@/components/admin/HomeContentForm';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const [content, horses, events, albums] = await Promise.all([
    getHomeContent(),
    getHorses({ includeUnpublished: true }),
    getEvents({ includeUnpublished: true }),
    getAlbums({ includeUnpublished: true }),
  ]);

  return (
    <AdminChrome>
      <AdminHeader title="Strona główna" subtitle="Treści, sekcje i wyróżnione elementy strony startowej" />
      <div className="p-6 lg:p-10">
        <HomeContentForm content={content} horses={horses} events={events} albums={albums} />
      </div>
    </AdminChrome>
  );
}
