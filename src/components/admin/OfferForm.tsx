'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Offer } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { saveOffer } from '@/actions/offers';
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

export default function OfferForm({ offer }: { offer?: Offer }) {
  const [state, action] = useFormState(saveOffer, { ok: false, message: '' });
  const [slug, setSlug] = useState(offer?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(offer?.slug));
  const [image, setImage] = useState({ url: offer?.image.url ?? '', alt: offer?.image.alt ?? '' });
  const [benefits, setBenefits] = useState<string[]>(offer?.benefits?.length ? offer.benefits : ['']);

  return (
    <form action={action} className="space-y-6 pb-24">
      {offer?.id && <input type="hidden" name="id" value={offer.id} />}
      <input type="hidden" name="image_url" value={image.url} />
      <input type="hidden" name="image_alt" value={image.alt} />
      {benefits.filter((b) => b.trim()).map((b, i) => (
        <input key={i} type="hidden" name="benefit" value={b} />
      ))}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Podstawowe informacje">
            <L label="Tytuł *">
              <input
                name="title"
                required
                defaultValue={offer?.title}
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
            <L label="Zapowiedź (krótki opis)">
              <textarea name="excerpt" rows={2} defaultValue={offer?.excerpt ?? ''} className={inputCls} />
            </L>
            <L label="Opis pełny">
              <textarea name="body" rows={5} defaultValue={offer?.body ?? ''} className={inputCls} />
            </L>
            <L label="Cena (tekst)">
              <input name="price" defaultValue={offer?.price ?? ''} placeholder="np. Cena na zapytanie" className={inputCls} />
            </L>
          </Section>

          <Section title="Zdjęcie">
            <SingleImageField
              label="Zdjęcie oferty"
              url={image.url}
              alt={image.alt}
              onUrlChange={(url) => setImage((c) => ({ ...c, url }))}
              onAltChange={(alt) => setImage((c) => ({ ...c, alt }))}
              folder={`offers/${slug || 'nowa'}`}
            />
          </Section>

          <Section title="Zalety / punkty">
            <div className="space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={b}
                    onChange={(e) => setBenefits(benefits.map((r, k) => (k === i ? e.target.value : r)))}
                    placeholder="np. Indywidualny dobór konia"
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setBenefits(benefits.filter((_, k) => k !== i))} className="shrink-0 rounded-sm border border-red-300 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50">×</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBenefits([...benefits, ''])} className="btn-ghost">+ Dodaj punkt</button>
          </Section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <label className="flex items-center gap-2.5 text-sm text-charcoal/80">
                <input type="checkbox" name="active" defaultChecked={offer?.active ?? true} className="h-4 w-4 accent-forest" />
                Aktywna (widoczna publicznie)
              </label>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={offer?.position ?? 0} className={inputCls} />
              </L>
            </Section>

            <div className="flex flex-col gap-3">
              <SubmitButton label={offer ? 'Zapisz zmiany' : 'Utwórz ofertę'} />
              <Link href="/admin/oferta" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
