import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getUnreadMessagesCount } from '@/lib/data/queries';
import AdminSidebar from './AdminSidebar';

export default async function AdminChrome({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) redirect('/admin');

  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');

  const unread = await getUnreadMessagesCount();

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <AdminSidebar email={data.user.email} unread={unread} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-navy/10 bg-ivory px-6 py-6 lg:px-10">
      <div>
        <h1 className="font-display text-3xl text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-charcoal/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
