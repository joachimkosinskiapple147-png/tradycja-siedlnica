'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import type { Horse } from '@/lib/types';
import { HORSE_STATUS, SEX_LABEL } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { saveHorse } from '@/actions/admin';
import { SubmitButton } from '@/components/site/FormBits';

type ImgRow = { url: string; thumb: string; alt: string; caption: string };
type VidRow = { id: string; title: string };

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

export default function HorseForm({ horse }: { horse?: Horse }) {
  const [state, action] = useFormState(saveHorse, { ok: false, message: '' });
  const [slug, setSlug] = useState(horse?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(horse?.slug));

  const [images, setImages] = useState<ImgRow[]>(
    horse?.images.length
      ? horse.images.map((i) => ({ url: i.url, thumb: i.thumb ?? '', alt: i.alt ?? '', caption: i.caption ?? '' }))
      : [{ url: '', thumb: '', alt: '', caption: '' }]
  );
  const [videos, setVideos] = useState<VidRow[]>(
    horse?.videos.length ? horse.videos.map((v) => ({ id: v.youtube_id, title: v.title ?? '' })) : []
  );

  const moveImg = (i: number, dir: number) => {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  return (
    <form action={action} className="space-y-6 pb-24">
      {horse?.id && <input type="hidden" name="id" value={horse.id} />}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Podstawowe informacje">
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Imię *">
                <input
                  name="name"
                  required
                  defaultValue={horse?.name}
                  onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
                  className={inputCls}
                />
              </L>
              <L label="Nazwa rodowodowa">
                <input name="full_name" defaultValue={horse?.full_name ?? ''} className={inputCls} />
              </L>
            </div>
            <L label="Adres URL (slug)">
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="np. cyprian"
                className={inputCls}
              />
              <span className="mt-1 block text-[0.72rem] text-charcoal/50">/konie/{slug || 'adres-konia'}</span>
            </L>
            <L label="Opis">
              <textarea name="description" rows={6} defaultValue={horse?.description ?? ''} className={inputCls} />
            </L>
          </Section>

          <Section title="Cechy konia">
            <div className="grid gap-4 sm:grid-cols-3">
              <L label="Rok urodzenia">
                <input name="birth_year" type="number" defaultValue={horse?.birth_year ?? ''} className={inputCls} />
              </L>
              <L label="Data urodzenia">
                <input name="birth_date" type="date" defaultValue={horse?.birth_date ?? ''} className={inputCls} />
              </L>
              <L label="Płeć">
                <select name="sex" defaultValue={horse?.sex ?? 'walach'} className={inputCls}>
                  {Object.entries(SEX_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </L>
              <L label="Rasa">
                <input name="breed" defaultValue={horse?.breed ?? ''} className={inputCls} />
              </L>
              <L label="Maść">
                <input name="color" defaultValue={horse?.color ?? ''} className={inputCls} />
              </L>
              <L label="Wzrost (cm)">
                <input name="height_cm" type="number" defaultValue={horse?.height_cm ?? ''} className={inputCls} />
              </L>
              <L label="Pochodzenie">
                <input name="origin" defaultValue={horse?.origin ?? ''} className={inputCls} />
              </L>
              <L label="Przeznaczenie">
                <input name="discipline" defaultValue={horse?.discipline ?? ''} placeholder="np. Skoki" className={inputCls} />
              </L>
              <L label="Poziom wyszkolenia">
                <input name="training_level" defaultValue={horse?.training_level ?? ''} className={inputCls} />
              </L>
              <L label="Charakter">
                <input name="temperament" defaultValue={horse?.temperament ?? ''} className={inputCls} />
              </L>
              <L label="Stan treningu">
                <input name="training_state" defaultValue={horse?.training_state ?? ''} className={inputCls} />
              </L>
              <L label="Osiągnięcia">
                <input name="achievements" defaultValue={horse?.achievements ?? ''} className={inputCls} />
              </L>
            </div>
          </Section>

          <Section title="Zdjęcia">
            <p className="text-[0.8rem] text-charcoal/60">
              Pierwsze zdjęcie jest zdjęciem głównym (okładką). Wpisz adres URL zdjęcia lub ścieżkę w
              serwisie (np. <code>/images/full/cyprian-portret.webp</code>). Bezpośrednie wgrywanie plików do
              Supabase Storage dodamy w kolejnym etapie.
            </p>
            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="border border-navy/12 bg-cream p-3">
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-navy/10 bg-beige-soft">
                      {img.url ? <Image src={img.url} alt="" fill sizes="64px" className="object-cover" /> : null}
                    </div>
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <input
                        name="image_url"
                        value={img.url}
                        onChange={(e) => setImages(images.map((r, k) => (k === i ? { ...r, url: e.target.value } : r)))}
                        placeholder="URL zdjęcia *"
                        className={inputCls}
                      />
                      <input
                        name="image_thumb"
                        value={img.thumb}
                        onChange={(e) => setImages(images.map((r, k) => (k === i ? { ...r, thumb: e.target.value } : r)))}
                        placeholder="URL miniatury (opcjonalnie)"
                        className={inputCls}
                      />
                      <input
                        name="image_alt"
                        value={img.alt}
                        onChange={(e) => setImages(images.map((r, k) => (k === i ? { ...r, alt: e.target.value } : r)))}
                        placeholder="Opis alternatywny (alt)"
                        className={inputCls}
                      />
                      <input
                        name="image_caption"
                        value={img.caption}
                        onChange={(e) => setImages(images.map((r, k) => (k === i ? { ...r, caption: e.target.value } : r)))}
                        placeholder="Podpis (opcjonalnie)"
                        className={inputCls}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => moveImg(i, -1)} aria-label="W górę" className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↑</button>
                      <button type="button" onClick={() => moveImg(i, 1)} aria-label="W dół" className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↓</button>
                      <button type="button" onClick={() => setImages(images.filter((_, k) => k !== i))} aria-label="Usuń" className="rounded-sm border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50">×</button>
                    </div>
                  </div>
                  {i === 0 && <span className="mt-2 inline-block text-[0.68rem] uppercase tracking-wide2 text-brass-deep">Zdjęcie główne</span>}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setImages([...images, { url: '', thumb: '', alt: '', caption: '' }])} className="btn-ghost">
              + Dodaj zdjęcie
            </button>
          </Section>

          <Section title="Filmy (YouTube)">
            <div className="space-y-3">
              {videos.map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    name="video_id"
                    value={v.id}
                    onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, id: e.target.value } : r)))}
                    placeholder="Link lub ID filmu YouTube"
                    className={inputCls}
                  />
                  <input
                    name="video_title"
                    value={v.title}
                    onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, title: e.target.value } : r)))}
                    placeholder="Tytuł"
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setVideos(videos.filter((_, k) => k !== i))} aria-label="Usuń film" className="shrink-0 rounded-sm border border-red-300 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50">×</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setVideos([...videos, { id: '', title: '' }])} className="btn-ghost">
              + Dodaj film
            </button>
          </Section>

          <Section title="Rodowód">
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Ojciec"><input name="ped_sire" defaultValue={horse?.pedigree?.sire ?? ''} className={inputCls} /></L>
              <L label="Matka"><input name="ped_dam" defaultValue={horse?.pedigree?.dam ?? ''} className={inputCls} /></L>
              <L label="Ojciec matki"><input name="ped_damsire" defaultValue={horse?.pedigree?.damsire ?? ''} className={inputCls} /></L>
              <L label="Linia ojca"><input name="ped_sire_line" defaultValue={horse?.pedigree?.sire_line ?? ''} className={inputCls} /></L>
              <L label="Linia matki"><input name="ped_dam_line" defaultValue={horse?.pedigree?.dam_line ?? ''} className={inputCls} /></L>
              <L label="Uwagi"><input name="ped_notes" defaultValue={horse?.pedigree?.notes ?? ''} className={inputCls} /></L>
            </div>
          </Section>

          <Section title="SEO">
            <L label="Tytuł SEO"><input name="seo_title" defaultValue={horse?.seo_title ?? ''} className={inputCls} /></L>
            <L label="Opis SEO"><textarea name="seo_description" rows={2} defaultValue={horse?.seo_description ?? ''} className={inputCls} /></L>
          </Section>
        </div>

        {/* Panel boczny — publikacja */}
        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <Section title="Publikacja">
              <L label="Status publikacji">
                <select name="publish" defaultValue={horse?.publish ?? 'szkic'} className={inputCls}>
                  <option value="szkic">Szkic (ukryty)</option>
                  <option value="opublikowany">Opublikowany</option>
                  <option value="ukryty">Ukryty</option>
                </select>
              </L>
              <L label="Status konia">
                <select name="status" defaultValue={horse?.status ?? 'na_sprzedaz'} className={inputCls}>
                  {Object.entries(HORSE_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </L>
              <L label="Cena">
                <input name="price" defaultValue={horse?.price ?? 'Cena na zapytanie'} className={inputCls} />
              </L>
              <L label="Kolejność (pozycja)">
                <input name="position" type="number" defaultValue={horse?.position ?? 0} className={inputCls} />
              </L>
              <label className="flex items-center gap-2.5 pt-1 text-sm text-charcoal/80">
                <input type="checkbox" name="featured" defaultChecked={horse?.featured} className="h-4 w-4 accent-forest" />
                Wyróżnij na stronie głównej
              </label>
            </Section>

            <div className="flex flex-col gap-3">
              <SubmitButton label={horse ? 'Zapisz zmiany' : 'Utwórz konia'} />
              <Link href="/admin/konie" className="btn-ghost text-center">Anuluj</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
