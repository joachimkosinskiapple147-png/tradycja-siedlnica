'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { EventItem, Horse } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { saveEvent } from '@/actions/events';
import { SubmitButton } from '@/components/site/FormBits';
import ImageUploader, { type ImageRow } from '@/components/admin/ImageUploader';
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

export default function EventForm({ event, horses }: { event?: EventItem; horses: Horse[] }) {
  const [state, action] = useFormState(saveEvent, { ok: false, message: '' });
  const [slug, setSlug] = useState(event?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(event?.slug));
  const [cover, setCover] = useState({ url: event?.cover.url ?? '', alt: event?.cover.alt ?? '' });
  const [gallery, setGallery] = useState<ImageRow[]>(
    event?.gallery.map((g) => ({ url: g.url, alt: g.alt ?? '' })) ?? []
  );
  const [videos, setVideos] = useState(
    event?.videos.map((v) => ({ id: v.youtube_id, title: v.title ?? '' })) ?? []
  );
  const [horseIds, setHorseIds] = useState<string[]>(
    horses.filter((h) => event?.horse_slugs.includes(h.slug)).map((h) => h.id)
  );

  return (
    <form action={action} className="space-y-6 pb-24">
      {event?.id && <input type="hidden" name="id" value={event.id} />}
      <input type="hidden" name="cover_url" value={cover.url} />
      <input type="hidden" name="cover_alt" value={cover.alt} />
      {gallery.map((g, i) => (
        <span key={i}>
          <input type="hidden" name="image_url" value={g.url} />
          <input type="hidden" name="image_alt" value={g.alt} />
        </span>
      ))}
      {videos.map((v, i) => (
        <span key={i}>
          <input type="hidden" name="video_id" value={v.id} />
          <input type="hidden" name="video_title" value={v.title} />
        </span>
      ))}
      {horseIds.map((id) => (
        <input key={id} type="hidden" name="horse_id" value={id} />
      ))}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Podstawowe informacje">
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Tytuł *">
                <input
                  name="title"
                  required
                  defaultValue={event?.title}
                  onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
                  className={inputCls}
                />
              </L>
              <L label="Kategoria">
                <input name="category" defaultValue={event?.category ?? ''} placeholder="np. Dzień otwarty" className={inputCls} />
              </L>
            </div>
            <L label="Adres URL (slug)">
              <input
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
                className={inputCls}
              />
              <span className="mt-1 block text-[0.72rem] text-charcoal/50">/wydarzenia/{slug || 'adres-wydarzenia'}</span>
            </L>
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Data *">
                <input name="date" type="date" required defaultValue={event?.date} className={inputCls} />
              </L>
              <L label="Miejsce">
                <input name="location" defaultValue={event?.location ?? ''} className={inputCls} />
              </L>
            </div>
            <L label="Zapowiedź (krótki opis)">
              <textarea name="excerpt" rows={2} defaultValue={event?.excerpt ?? ''} className={inputCls} />
            </L>
            <L label="Opis pełny">
              <textarea name="body" rows={6} defaultValue={event?.body ?? ''} className={inputCls} />
            </L>
            <L label="Wyniki (opcjonalnie)">
              <textarea name="results" rows={3} defaultValue={event?.results ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Zdjęcie główne">
            <SingleImageField
              label="Okładka wydarzenia"
              url={cover.url}
              alt={cover.alt}
              onUrlChange={(url) => setCover((c) => ({ ...c, url }))}
              onAltChange={(alt) => setCover((c) => ({ ...c, alt }))}
              folder={`events/${slug || 'nowe'}`}
            />
          </Section>

          <Section title="Galeria zdjęć">
            <ImageUploader images={gallery} onChange={setGallery} folder={`events/${slug || 'nowe'}/galeria`} coverHint={false} />
          </Section>

          <Section title="Filmy (YouTube)">
            <div className="space-y-3">
              {videos.map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={v.id}
                    onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, id: e.target.value } : r)))}
                    placeholder="Link lub ID filmu YouTube"
                    className={inputCls}
                  />
                  <input
                    value={v.title}
                    onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, title: e.target.value } : r)))}
                    placeholder="Tytuł"
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setVideos(videos.filter((_, k) => k !== i))} className="shrink-0 rounded-sm border border-red-300 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50">×</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setVideos([...videos, { id: '', title: '' }])} className="btn-ghost">+ Dodaj film</button>
          </Section>

          <Section title="Konie biorące udział">
            <div className="grid gap-2 sm:grid-cols-2">
              {horses.map((h) => (
                <label key={h.id} className="flex items-center gap-2 text-sm text-charcoal/80">
                  <input
                    type="checkbox"
                    checked={horseIds.includes(h.id)}
                    onChange={(e) =>
                      setHorseIds(e.target.checked ? [...horseIds, h.id] : horseIds.filter((x) => x !== h.id))
                    }
                    className="h-4 w-4 accent-forest"
                  />
                  {h.name}
                </label>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <L label="Status publikacji">
                <select name="publish" defaultValue={event?.publish ?? 'szkic'} className={inputCls}>
                  <option value="szkic">Szkic (ukryty)</option>
                  <option value="opublikowany">Opublikowany</option>
                  <option value="ukryty">Ukryty</option>
                </select>
              </L>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={event?.position ?? 0} className={inputCls} />
              </L>
            </Section>

            {event && (
              <Link href={`/wydarzenia/${event.slug}`} target="_blank" className="btn-ghost block text-center">
                Podgląd na stronie
              </Link>
            )}

            <div className="flex flex-col gap-3">
              <SubmitButton label={event ? 'Zapisz zmiany' : 'Utwórz wydarzenie'} />
              <Link href="/admin/wydarzenia" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
