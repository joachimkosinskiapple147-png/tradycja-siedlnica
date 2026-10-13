'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Legend } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { saveLegend } from '@/actions/team';
import { SubmitButton } from '@/components/site/FormBits';
import SingleImageField from '@/components/admin/SingleImageField';

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

export default function LegendForm({ legend }: { legend?: Legend }) {
  const [state, action] = useFormState(saveLegend, { ok: false, message: '' });
  const [slug, setSlug] = useState(legend?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(legend?.slug));
  const [image, setImage] = useState({ url: legend?.image.url ?? '', alt: legend?.image.alt ?? '' });

  return (
    <form action={action} className="space-y-6 pb-24">
      {legend?.id && <input type="hidden" name="id" value={legend.id} />}
      <input type="hidden" name="image_url" value={image.url} />
      <input type="hidden" name="image_alt" value={image.alt} />

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Podstawowe informacje">
            <L label="Imię konia *">
              <input
                name="name"
                required
                defaultValue={legend?.name}
                onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
                className={inputCls}
              />
            </L>
            <L label="Adres URL (slug)">
              <input
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
                className={inputCls}
              />
            </L>
            <div className="grid gap-4 sm:grid-cols-3">
              <L label="Rasa">
                <input name="breed" defaultValue={legend?.breed ?? ''} className={inputCls} />
              </L>
              <L label="Rok urodzenia">
                <input name="birth_year" type="number" defaultValue={legend?.birth_year ?? ''} className={inputCls} />
              </L>
              <L label="Maść">
                <input name="color" defaultValue={legend?.color ?? ''} className={inputCls} />
              </L>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Lata w stajni">
                <input name="years_at_stable" defaultValue={legend?.years_at_stable ?? ''} className={inputCls} />
              </L>
              <L label="Gdzie dziś">
                <input name="where_now" defaultValue={legend?.where_now ?? ''} className={inputCls} />
              </L>
            </div>
            <L label="Osiągnięcia">
              <textarea name="achievements" rows={2} defaultValue={legend?.achievements ?? ''} className={inputCls} />
            </L>
            <L label="Historia (story)">
              <textarea name="story" rows={6} defaultValue={legend?.story ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Zdjęcie">
            <SingleImageField
              label="Zdjęcie legendy"
              url={image.url}
              alt={image.alt}
              onUrlChange={(url) => setImage((c) => ({ ...c, url }))}
              onAltChange={(alt) => setImage((c) => ({ ...c, alt }))}
              folder={`legends/${slug || 'nowa'}`}
            />
          </Section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <L label="Status publikacji">
                <select name="publish" defaultValue={legend?.publish ?? 'opublikowany'} className={inputCls}>
                  <option value="szkic">Szkic (ukryty)</option>
                  <option value="opublikowany">Opublikowany</option>
                  <option value="ukryty">Ukryty</option>
                </select>
              </L>
              <label className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <input type="checkbox" name="featured" defaultChecked={legend?.featured ?? false} className="h-4 w-4 accent-forest" />
                Wyróżniona na stronie
              </label>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={legend?.position ?? 0} className={inputCls} />
              </L>
            </Section>

            <div className="flex flex-col gap-3">
              <SubmitButton label={legend ? 'Zapisz zmiany' : 'Dodaj legendę'} />
              <Link href="/admin/legendy" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
