'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Stallion } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { saveStallion } from '@/actions/team';
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

export default function StallionForm({ stallion }: { stallion?: Stallion }) {
  const [state, action] = useFormState(saveStallion, { ok: false, message: '' });
  const [slug, setSlug] = useState(stallion?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(stallion?.slug));
  const [image, setImage] = useState({ url: stallion?.image.url ?? '', alt: stallion?.image.alt ?? '' });

  return (
    <form action={action} className="space-y-6 pb-24">
      {stallion?.id && <input type="hidden" name="id" value={stallion.id} />}
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
            <L label="Imię ogiera *">
              <input
                name="name"
                required
                defaultValue={stallion?.name}
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
            <L label="Pełna nazwa (np. Wicher (SP))">
              <input name="full_name" defaultValue={stallion?.full_name ?? ''} className={inputCls} />
            </L>
            <div className="grid gap-4 sm:grid-cols-3">
              <L label="Rasa">
                <input name="breed" defaultValue={stallion?.breed ?? ''} className={inputCls} />
              </L>
              <L label="Rok urodzenia">
                <input name="birth_year" type="number" defaultValue={stallion?.birth_year ?? ''} className={inputCls} />
              </L>
              <L label="Maść">
                <input name="color" defaultValue={stallion?.color ?? ''} className={inputCls} />
              </L>
            </div>
            <L label="Wzrost w kłębie (cm)">
              <input name="height_cm" type="number" defaultValue={stallion?.height_cm ?? ''} className={inputCls} />
            </L>
            <L label="Opis">
              <textarea name="description" rows={5} defaultValue={stallion?.description ?? ''} className={inputCls} />
            </L>
            <L label="Osiągnięcia">
              <textarea name="achievements" rows={2} defaultValue={stallion?.achievements ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Rodowód">
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Ojciec">
                <input name="sire" defaultValue={stallion?.pedigree?.sire ?? ''} className={inputCls} />
              </L>
              <L label="Matka">
                <input name="dam" defaultValue={stallion?.pedigree?.dam ?? ''} className={inputCls} />
              </L>
            </div>
            <L label="Uwagi hodowlane">
              <textarea name="pedigree_notes" rows={2} defaultValue={stallion?.pedigree?.notes ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Stanówka — oferta krycia">
            <L label="Cena krycia (tekst)">
              <input name="covering_price" defaultValue={stallion?.covering_price ?? ''} placeholder="np. 1 800 zł + VAT" className={inputCls} />
            </L>
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Nasienie">
                <input name="semen" defaultValue={stallion?.semen ?? ''} placeholder="np. świeże i mrożone" className={inputCls} />
              </L>
              <L label="Sezon">
                <input name="season" defaultValue={stallion?.season ?? ''} placeholder="np. luty – lipiec" className={inputCls} />
              </L>
            </div>
            <L label="Stanowisko (stajnia)">
              <input name="station" defaultValue={stallion?.station ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Zdjęcie">
            <SingleImageField
              label="Zdjęcie ogiera"
              url={image.url}
              alt={image.alt}
              onUrlChange={(url) => setImage((c) => ({ ...c, url }))}
              onAltChange={(alt) => setImage((c) => ({ ...c, alt }))}
              folder={`stallions/${slug || 'nowy'}`}
            />
          </Section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <L label="Status publikacji">
                <select name="publish" defaultValue={stallion?.publish ?? 'szkic'} className={inputCls}>
                  <option value="szkic">Szkic (ukryty)</option>
                  <option value="opublikowany">Opublikowany</option>
                  <option value="ukryty">Ukryty</option>
                </select>
              </L>
              <label className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <input type="checkbox" name="featured" defaultChecked={stallion?.featured ?? false} className="h-4 w-4 accent-forest" />
                Wyróżniony na stronie
              </label>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={stallion?.position ?? 0} className={inputCls} />
              </L>
            </Section>

            <div className="flex flex-col gap-3">
              <SubmitButton label={stallion ? 'Zapisz zmiany' : 'Dodaj ogiera'} />
              <Link href="/admin/stanowka" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
