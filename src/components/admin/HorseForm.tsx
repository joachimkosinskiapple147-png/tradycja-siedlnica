'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Horse, VideoCategory } from '@/lib/types';
import { HORSE_STATUS, SEX_LABEL, VIDEO_CATEGORY_LABEL, VIDEO_CATEGORIES } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { saveHorse } from '@/actions/admin';
import { SubmitButton } from '@/components/site/FormBits';
import ImageUploader, { type ImageRow } from '@/components/admin/ImageUploader';
import VideoEmbed from '@/components/site/VideoEmbed';
import { extractYouTubeId } from '@/lib/youtube';

type VidRow = {
  youtube_id: string;
  input: string;
  title: string;
  description: string;
  category: VideoCategory | '';
  publish: boolean;
};

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

  const [images, setImages] = useState<ImageRow[]>(
    horse?.images.map((i) => ({ url: i.url, alt: i.alt ?? '', caption: i.caption ?? '' })) ?? []
  );
  const [videos, setVideos] = useState<VidRow[]>(
    horse?.videos.map((v) => ({
      youtube_id: v.youtube_id,
      input: v.youtube_id,
      title: v.title ?? '',
      description: v.description ?? '',
      category: v.category ?? '',
      publish: v.publish,
    })) ?? []
  );

  const moveVideo = (i: number, dir: number) => {
    const next = [...videos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setVideos(next);
  };

  const updateVideoInput = (i: number, input: string) => {
    const id = extractYouTubeId(input) ?? '';
    setVideos(videos.map((r, k) => (k === i ? { ...r, input, youtube_id: id } : r)));
  };

  return (
    <form action={action} className="space-y-6 pb-24">
      {horse?.id && <input type="hidden" name="id" value={horse.id} />}

      {/* Zdjęcia — wysyłane jako ukryte pola zgodne z akcją zapisu */}
      {images.map((img, i) => (
        <span key={i}>
          <input type="hidden" name="image_url" value={img.url} />
          <input type="hidden" name="image_alt" value={img.alt} />
          <input type="hidden" name="image_caption" value={img.caption ?? ''} />
        </span>
      ))}
      {/* Filmy — ukryte pola */}
      {videos.map((v, i) => (
        <span key={i}>
          <input type="hidden" name="video_id" value={v.youtube_id} />
          <input type="hidden" name="video_title" value={v.title} />
          <input type="hidden" name="video_description" value={v.description} />
          <input type="hidden" name="video_category" value={v.category} />
          <input type="hidden" name="video_publish" value={v.publish ? 'true' : 'false'} />
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
              Wgraj jedno lub wiele zdjęć bezpośrednio z komputera. Pierwsze zdjęcie na liście jest
              zdjęciem głównym (okładką) — użyj strzałek lub „Ustaw jako główne”, aby zmienić kolejność.
            </p>
            <ImageUploader images={images} onChange={setImages} folder={`horses/${slug || 'nowy'}`} />
          </Section>

          <Section title="Filmy z YouTube">
            <p className="text-[0.8rem] text-charcoal/60">
              Wklej dowolny link YouTube (youtube.com, youtu.be lub Shorts) — ID filmu zostanie
              rozpoznane automatycznie. Filmy oznaczone jako „Ukryty” nie pojawią się na stronie publicznej.
            </p>
            <div className="space-y-4">
              {videos.map((v, i) => {
                const preview = v.youtube_id;
                return (
                  <div key={i} className="border border-navy/12 bg-cream p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <L label="Link lub ID filmu *">
                        <input
                          value={v.input}
                          onChange={(e) => updateVideoInput(i, e.target.value)}
                          placeholder="https://youtu.be/..."
                          className={inputCls}
                        />
                        {v.input && !v.youtube_id && (
                          <span className="mt-1 block text-[0.72rem] text-red-600">Nie rozpoznano ID filmu — sprawdź link.</span>
                        )}
                      </L>
                      <L label="Kategoria">
                        <select
                          value={v.category}
                          onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, category: e.target.value as VideoCategory } : r)))}
                          className={inputCls}
                        >
                          <option value="">Bez kategorii</option>
                          {VIDEO_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{VIDEO_CATEGORY_LABEL[c]}</option>
                          ))}
                        </select>
                      </L>
                      <L label="Tytuł (opcjonalnie)">
                        <input
                          value={v.title}
                          onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, title: e.target.value } : r)))}
                          className={inputCls}
                        />
                      </L>
                      <L label="Opis (opcjonalnie)">
                        <input
                          value={v.description}
                          onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, description: e.target.value } : r)))}
                          className={inputCls}
                        />
                      </L>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-charcoal/80">
                        <input
                          type="checkbox"
                          checked={v.publish}
                          onChange={(e) => setVideos(videos.map((r, k) => (k === i ? { ...r, publish: e.target.checked } : r)))}
                          className="h-4 w-4 accent-forest"
                        />
                        Widoczny publicznie
                      </label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => moveVideo(i, -1)} className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↑</button>
                        <button type="button" onClick={() => moveVideo(i, 1)} className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↓</button>
                        <button type="button" onClick={() => setVideos(videos.filter((_, k) => k !== i))} className="rounded-sm border border-red-300 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50">Usuń</button>
                      </div>
                    </div>

                    {preview && (
                      <div className="mt-4 max-w-sm">
                        <VideoEmbed video={{ id: preview, youtube_id: preview, title: v.title || 'Podgląd', description: v.description, publish: true, position: i }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setVideos([...videos, { youtube_id: '', input: '', title: '', description: '', category: '', publish: true }])}
              className="btn-ghost"
            >
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

            {horse && (
              <Link href={`/konie/${horse.slug}`} target="_blank" className="btn-ghost block text-center">
                Podgląd na stronie
              </Link>
            )}

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
