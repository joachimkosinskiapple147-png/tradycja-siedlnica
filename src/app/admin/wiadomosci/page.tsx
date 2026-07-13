import { getMessages } from '@/lib/data/queries';
import AdminChrome, { AdminHeader } from '@/components/admin/AdminChrome';
import MessagesInbox from '@/components/admin/MessagesInbox';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => m.status === 'nowa').length;

  return (
    <AdminChrome>
      <AdminHeader title="Wiadomości" subtitle={`${messages.length} wiadomości · ${unread} nowych`} />
      <div className="p-6 lg:p-10">
        <MessagesInbox messages={messages} />
      </div>
    </AdminChrome>
  );
}
