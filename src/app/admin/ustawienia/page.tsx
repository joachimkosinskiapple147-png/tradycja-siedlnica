import { getSiteSettings } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminChrome>
      <AdminHeader title="Ustawienia" subtitle="Dane kontaktowe, godziny, social media i SEO" />
      <div className="p-6 lg:p-10">
        <SiteSettingsForm settings={settings} />
      </div>
    </AdminChrome>
  );
}
