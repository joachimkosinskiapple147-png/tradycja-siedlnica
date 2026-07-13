'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Album } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { saveAlbum } from '@/actions/gallery';
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

export default function AlbumForm({ album }: { album?: Album }) {
  const [state, action] = useFormState(saveAlbum, { ok: false, message: '' });
  const [slug, setSlug] = useState(album?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(album?.slug));
  const [cover, setCover] = useState({ url: album?.cover.url ?? '', alt: album?.cover.alt ?? '' });
  const [images, setImages] = useState<ImageRow[]>(
    album?.images.map((i) => ({ url: i.url, alt: i.alt ?? '' })) ?? []
  );

  return (
    <form action={action} className="space-y-6 pb-24">
      {album?.id && <input type="hidden" name="id" value={album.id} />}
      <input type="hidden" name="cover_url" value={cover.url} />
      <input type="hidden" name="cover_alt" value={cover.alt} />
      {images.map((img, i) => (
        <span key={i}>
          <input type="hidden" name="image_url" value={img.url} />
          <input type="hidden" name="image_alt" value={img.alt} />
        </span>
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
                defaultValue={album?.title}
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
              <span className="mt-1 block text-[0.72rem] text-charcoal/50">/galeria/{slug || 'adres-albumu'}</span>
            </L>
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Data">
                <input name="date" type="date" defaultValue={album?.date ?? ''} className={inputCls} />
              </L>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={album?.position ?? 0} className={inputCls} />
              </L>
            </div>
            <L label="Opis">
              <textarea name="description" rows={3} defaultValue={album?.description ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Zdjęcie okładkowe">
            <SingleImageField
              label="Okładka albumu"
              url={cover.url}
              alt={cover.alt}
              onUrlChange={(url) => setCover((c) => ({ ...c, url }))}
              onAltChange={(alt) => setCover((c) => ({ ...c, alt }))}
              folder={`albums/${slug || 'nowy'}`}
            />
          </Section>

          <Section title="Zdjęcia w albumie">
            <ImageUploader images={images} onChange={setImages} folder={`albums/${slug || 'nowy'}/zdjecia`} coverHint={false} />
          </Section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <L label="Status publikacji">
                <select name="publish" defaultValue={album?.publish ?? 'szkic'} className={inputCls}>
                  <option value="szkic">Szkic (ukryty)</option>
                  <option value="opublikowany">Opublikowany</option>
                  <option value="ukryty">Ukryty</option>
                </select>
              </L>
            </Section>

            {album && (
              <Link href={`/galeria/${album.slug}`} target="_blank" className="btn-ghost block text-center">
                Podgląd na stronie
              </Link>
            )}

            <div className="flex flex-col gap-3">
              <SubmitButton label={album ? 'Zapisz zmiany' : 'Utwórz album'} />
              <Link href="/admin/galeria" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
