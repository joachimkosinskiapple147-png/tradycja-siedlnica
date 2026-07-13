'use client';

import { useState, useTransition } from 'react';
import type { AdminMessage } from '@/lib/data/queries';
import { formatDatePl, cn } from '@/lib/utils';
import { setMessageStatus, saveMessageNote, deleteMessage } from '@/actions/admin';

const STATUSES: { value: string; label: string; cls: string }[] = [
  { value: 'nowa', label: 'Nowa', cls: 'bg-brass/15 text-brass-deep' },
  { value: 'w_toku', label: 'W toku', cls: 'bg-navy/10 text-navy' },
  { value: 'zamknieta', label: 'Zamknięta', cls: 'bg-forest/10 text-forest' },
];

export default function MessagesInbox({ messages }: { messages: AdminMessage[] }) {
  const [openId, setOpenId] = useState<string | null>(messages[0]?.id ?? null);
  const [, start] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(messages.map((m) => [m.id, m.note ?? '']))
  );

  if (messages.length === 0) {
    return (
      <div className="border border-navy/12 bg-ivory p-12 text-center text-charcoal/60">
        Brak wiadomości. Zgłoszenia z formularzy pojawią się tutaj.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const open = openId === m.id;
        const st = STATUSES.find((s) => s.value === m.status) ?? STATUSES[0];
        return (
          <div key={m.id} className={cn('border bg-ivory', m.status === 'nowa' ? 'border-brass/40' : 'border-navy/12')}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : m.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-navy">{m.name}</span>
                  <span className={cn('rounded-sm px-2 py-0.5 text-[0.68rem] font-medium', st.cls)}>{st.label}</span>
                </div>
                <p className="mt-1 truncate text-sm text-charcoal/60">
                  {m.subject || 'Zapytanie'}{m.horse_name ? ` · ${m.horse_name}` : ''}
                </p>
              </div>
              <span className="shrink-0 text-[0.72rem] text-charcoal/45">{formatDatePl(m.created_at)}</span>
            </button>

            {open && (
              <div className="border-t border-navy/10 px-5 py-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-sm">
                    <span className="text-[0.68rem] uppercase tracking-wide2 text-charcoal/50">E-mail</span>
                    <p><a href={`mailto:${m.email}`} className="link-underline text-navy">{m.email}</a></p>
                  </div>
                  {m.phone && (
                    <div className="text-sm">
                      <span className="text-[0.68rem] uppercase tracking-wide2 text-charcoal/50">Telefon</span>
                      <p><a href={`tel:${m.phone}`} className="link-underline text-navy">{m.phone}</a></p>
                    </div>
                  )}
                  {m.country && (
                    <div className="text-sm">
                      <span className="text-[0.68rem] uppercase tracking-wide2 text-charcoal/50">Kraj</span>
                      <p className="text-navy">{m.country}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 border-l-2 border-brass/50 bg-cream px-4 py-3 text-sm text-charcoal/85">
                  {m.message}
                </div>

                <div className="mt-4">
                  <label className="text-[0.68rem] uppercase tracking-wide2 text-charcoal/50">Notatka wewnętrzna</label>
                  <textarea
                    rows={2}
                    value={notes[m.id]}
                    onChange={(e) => setNotes({ ...notes, [m.id]: e.target.value })}
                    onBlur={() => start(() => saveMessageNote(m.id, notes[m.id]))}
                    className="mt-1.5 w-full border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-brass"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => start(() => setMessageStatus(m.id, s.value))}
                      className={cn(
                        'rounded-sm border px-3 py-1.5 text-[0.72rem]',
                        m.status === s.value ? 'border-navy bg-navy text-ivory' : 'border-navy/20 text-navy hover:bg-cream'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                  <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Zapytanie')}`} className="ml-auto rounded-sm border border-navy/20 px-3 py-1.5 text-[0.72rem] text-navy hover:bg-cream">
                    Odpowiedz
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Usunąć tę wiadomość?')) start(() => deleteMessage(m.id));
                    }}
                    className="rounded-sm border border-red-300 px-3 py-1.5 text-[0.72rem] text-red-600 hover:bg-red-50"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
