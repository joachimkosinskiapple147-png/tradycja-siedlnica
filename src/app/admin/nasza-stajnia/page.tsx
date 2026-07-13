import { getAboutContent, getTimeline } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import AboutForm from '@/components/admin/AboutForm';
import TimelineEditor from '@/components/admin/TimelineEditor';

export const dynamic = 'force-dynamic';

export default async function AdminStablePage() {
  const [about, timeline] = await Promise.all([getAboutContent(), getTimeline()]);

  return (
    <AdminChrome>
      <AdminHeader title="Nasza stajnia" subtitle="Opis stajni i oś czasu (strona „Nasza stajnia”)" />
      <div className="space-y-8 p-6 lg:p-10">
        <section className="border border-navy/12 bg-ivory p-6">
          <h2 className="font-display text-xl text-navy">Opis stajni</h2>
          <div className="mt-5">
            <AboutForm about={about} />
          </div>
        </section>

        <section className="border border-navy/12 bg-ivory p-6">
          <h2 className="font-display text-xl text-navy">Oś czasu</h2>
          <p className="mt-2 text-sm text-charcoal/60">Historia stajni pokazywana chronologicznie na stronie „Nasza stajnia”.</p>
          <div className="mt-5">
            <TimelineEditor entries={timeline} />
          </div>
        </section>
      </div>
    </AdminChrome>
  );
}
