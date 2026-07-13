'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { SiteSettings } from '@/lib/types';
import { saveSiteSettings } from '@/actions/content';
import { SubmitButton } from '@/components/site/FormBits';

const inputCls =
  'w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brass';
const labelCls = 'block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60';

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-navy/12 bg-ivory p-6">
      <h2 className="font-display text-xl text-navy">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useFormState(saveSiteSettings, { ok: false, message: '' });
  const [hours, setHours] = useState(settings.hours);

  return (
    <form action={action} className="space-y-6 pb-24">
      {hours.map((h, i) => (
        <span key={i}>
          <input type="hidden" name="hours_day" value={h.day} />
          <input type="hidden" name="hours_value" value={h.hours} />
        </span>
      ))}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <Section title="Dane kontaktowe">
        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Telefon (wyświetlany)"><input name="phone" defaultValue={settings.phone} className={inputCls} /></L>
          <L label="Telefon (link tel:, bez spacji)"><input name="phone_href" defaultValue={settings.phone_href} className={inputCls} /></L>
          <L label="E-mail"><input name="email" type="email" defaultValue={settings.email} className={inputCls} /></L>
          <L label="Adres (skrócony)"><input name="address_label" defaultValue={settings.address_label} className={inputCls} /></L>
        </div>
        <L label="Adres (pełny)"><input name="address_full" defaultValue={settings.address_full} className={inputCls} /></L>
        <L label="Zapytanie do Google Maps (miejscowość / adres)">
          <input name="map_query" defaultValue={settings.map_query} className={inputCls} />
          <span className="mt-1 block text-[0.72rem] text-charcoal/50">Używane do osadzenia mapy i wyznaczania trasy na stronie Kontakt.</span>
        </L>
      </Section>

      <Section title="Godziny otwarcia">
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={h.day} onChange={(e) => setHours(hours.map((r, k) => (k === i ? { ...r, day: e.target.value } : r)))} placeholder="np. Poniedziałek – Piątek" className={inputCls} />
              <input value={h.hours} onChange={(e) => setHours(hours.map((r, k) => (k === i ? { ...r, hours: e.target.value } : r)))} placeholder="np. 9:00 – 18:00" className={inputCls} />
              <button type="button" onClick={() => setHours(hours.filter((_, k) => k !== i))} className="shrink-0 rounded-sm border border-red-300 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setHours([...hours, { day: '', hours: '' }])} className="btn-ghost">+ Dodaj wiersz</button>
        <L label="Notatka pod godzinami"><input name="hours_note" defaultValue={settings.hours_note} className={inputCls} /></L>
      </Section>

      <Section title="Media społecznościowe">
        <div className="grid gap-4 sm:grid-cols-3">
          <L label="Facebook (pełny URL)"><input name="social_facebook" defaultValue={settings.social_facebook} placeholder="https://facebook.com/…" className={inputCls} /></L>
          <L label="Instagram (pełny URL)"><input name="social_instagram" defaultValue={settings.social_instagram} placeholder="https://instagram.com/…" className={inputCls} /></L>
          <L label="YouTube (pełny URL)"><input name="social_youtube" defaultValue={settings.social_youtube} placeholder="https://youtube.com/…" className={inputCls} /></L>
        </div>
      </Section>

      <Section title="SEO domyślne">
        <L label="Domyślny tytuł SEO"><input name="seo_title" defaultValue={settings.seo_title} className={inputCls} /></L>
        <L label="Domyślny opis SEO"><textarea name="seo_description" rows={3} defaultValue={settings.seo_description} className={inputCls} /></L>
      </Section>

      <Section title="Stopka">
        <L label="Tekst w stopce"><textarea name="footer_text" rows={3} defaultValue={settings.footer_text} className={inputCls} /></L>
      </Section>

      <SubmitButton label="Zapisz ustawienia" />
    </form>
  );
}
