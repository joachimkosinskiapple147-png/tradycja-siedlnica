'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Rider } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { saveRider } from '@/actions/team';
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

export default function RiderForm({ rider, horseOptions }: { rider?: Rider; horseOptions: { slug: string; name: string }[] }) {
  const [state, action] = useFormState(saveRider, { ok: false, message: '' });
  const [slug, setSlug] = useState(rider?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(rider?.slug));
  const [image, setImage] = useState({ url: rider?.image.url ?? '', alt: rider?.image.alt ?? '' });
  const [horses, setHorses] = useState<string[]>(rider?.horse_slugs?.length ? rider.horse_slugs : []);

  return (
    <form action={action} className="space-y-6 pb-24">
      {rider?.id && <input type="hidden" name="id" value={rider.id} />}
      <input type="hidden" name="image_url" value={image.url} />
      <input type="hidden" name="image_alt" value={image.alt} />
      {horses.map((s) => (
        <input key={s} type="hidden" name="horse_slug" value={s} />
      ))}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Podstawowe informacje">
            <L label="Imię i nazwisko *">
              <input
                name="name"
                required
                defaultValue={rider?.name}
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
            <L label="Rola *">
              <input name="role" required defaultValue={rider?.role} placeholder="np. Trener główny · skoki" className={inputCls} />
            </L>
            <L label="Specjalizacja">
              <input name="specialty" defaultValue={rider?.specialty ?? ''} className={inputCls} />
            </L>
            <L label="Doświadczenie">
              <input name="experience" defaultValue={rider?.experience ?? ''} className={inputCls} />
            </L>
            <L label="Telefon (opcjonalnie)">
              <input name="phone" defaultValue={rider?.phone ?? ''} className={inputCls} />
            </L>
            <L label="Osiągnięcia">
              <textarea name="achievements" rows={2} defaultValue={rider?.achievements ?? ''} className={inputCls} />
            </L>
            <L label="Opis pełny">
              <textarea name="description" rows={5} defaultValue={rider?.description ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Zdjęcie">
            <SingleImageField
              label="Zdjęcie jeźdźca"
              url={image.url}
              alt={image.alt}
              onUrlChange={(url) => setImage((c) => ({ ...c, url }))}
              onAltChange={(alt) => setImage((c) => ({ ...c, alt }))}
              folder={`riders/${slug || 'nowy'}`}
            />
          </Section>

          <Section title="Konie jeźdźca">
            <div className="grid gap-2 sm:grid-cols-2">
              {horseOptions.map((h) => (
                <label key={h.slug} className="flex items-center gap-2.5 border border-navy/10 bg-white px-3 py-2 text-sm text-navy">
                  <input
                    type="checkbox"
                    checked={horses.includes(h.slug)}
                    onChange={(e) =>
                      setHorses(e.target.checked ? [...horses, h.slug] : horses.filter((s) => s !== h.slug))
                    }
                    className="h-4 w-4 accent-forest"
                  />
                  {h.name}
                </label>
              ))}
            </div>
            {horseOptions.length === 0 && (
              <p className="text-sm text-charcoal/60">Brak koni w bazie — najpierw dodaj konie.</p>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <L label="Status publikacji">
                <select name="publish" defaultValue={rider?.publish ?? 'szkic'} className={inputCls}>
                  <option value="szkic">Szkic (ukryty)</option>
                  <option value="opublikowany">Opublikowany</option>
                  <option value="ukryty">Ukryty</option>
                </select>
              </L>
              <label className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <input type="checkbox" name="featured" defaultChecked={rider?.featured ?? false} className="h-4 w-4 accent-forest" />
                Wyróżniony na stronie
              </label>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={rider?.position ?? 0} className={inputCls} />
              </L>
            </Section>

            <div className="flex flex-col gap-3">
              <SubmitButton label={rider ? 'Zapisz zmiany' : 'Dodaj jeźdźca'} />
              <Link href="/admin/jezdcy" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
