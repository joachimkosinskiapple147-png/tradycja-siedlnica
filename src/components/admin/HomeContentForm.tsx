'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { Album, EventItem, HomeContent, HomeSection, Horse } from '@/lib/types';
import { saveHomeContent } from '@/actions/content';
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

const SECTION_LABEL: Record<HomeSection['key'], string> = {
  hero: 'Hero (nagłówek startowy)',
  intro: 'Wstęp + statystyki',
  horses: 'Konie na sprzedaż',
  about: 'O stajni',
  offers: 'Oferta',
  events: 'Wydarzenia',
  gallery: 'Galeria',
  video: 'Film',
  contact_cta: 'Kontakt (wezwanie do działania)',
};

export default function HomeContentForm({
  content,
  horses,
  events,
  albums,
}: {
  content: HomeContent;
  horses: Horse[];
  events: EventItem[];
  albums: Album[];
}) {
  const [state, action] = useFormState(saveHomeContent, { ok: false, message: '' });
  const [heroImage, setHeroImage] = useState({ url: content.hero_image_url, alt: content.hero_image_alt });
  const [aboutImage, setAboutImage] = useState({ url: content.about_image_url, alt: content.about_image_alt });
  const [stats, setStats] = useState(content.stats);
  const [sections, setSections] = useState<HomeSection[]>(content.sections);
  const [featuredHorses, setFeaturedHorses] = useState<string[]>(content.featured_horse_ids);
  const [featuredEvents, setFeaturedEvents] = useState<string[]>(content.featured_event_ids);
  const [featuredAlbums, setFeaturedAlbums] = useState<string[]>(content.featured_album_ids);

  const moveSection = (i: number, dir: number) => {
    const next = [...sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next);
  };

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  return (
    <form action={action} className="space-y-6 pb-24">
      <input type="hidden" name="hero_image_url" value={heroImage.url} />
      <input type="hidden" name="hero_image_alt" value={heroImage.alt} />
      <input type="hidden" name="about_image_url" value={aboutImage.url} />
      <input type="hidden" name="about_image_alt" value={aboutImage.alt} />
      {stats.map((s, i) => (
        <span key={i}>
          <input type="hidden" name="stat_number" value={s.number} />
          <input type="hidden" name="stat_label" value={s.label} />
        </span>
      ))}
      {sections.map((s) => (
        <span key={s.key}>
          <input type="hidden" name="section_key" value={s.key} />
          <input type="hidden" name="section_visible" value={s.visible ? 'true' : 'false'} />
        </span>
      ))}
      {featuredHorses.map((id) => <input key={id} type="hidden" name="featured_horse_id" value={id} />)}
      {featuredEvents.map((id) => <input key={id} type="hidden" name="featured_event_id" value={id} />)}
      {featuredAlbums.map((id) => <input key={id} type="hidden" name="featured_album_id" value={id} />)}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <Section title="Hero (nagłówek startowy)">
        <L label="Nadtytuł (eyebrow)"><input name="hero_eyebrow" defaultValue={content.hero_eyebrow} className={inputCls} /></L>
        <L label="Nagłówek"><input name="hero_heading" defaultValue={content.hero_heading} className={inputCls} /></L>
        <L label="Opis"><textarea name="hero_description" rows={3} defaultValue={content.hero_description} className={inputCls} /></L>
        <SingleImageField
          label="Zdjęcie hero"
          url={heroImage.url}
          alt={heroImage.alt}
          onUrlChange={(url) => setHeroImage((h) => ({ ...h, url }))}
          onAltChange={(alt) => setHeroImage((h) => ({ ...h, alt }))}
          folder="strona-glowna/hero"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Przycisk 1 — tekst"><input name="hero_button1_label" defaultValue={content.hero_button1_label} className={inputCls} /></L>
          <L label="Przycisk 1 — link"><input name="hero_button1_href" defaultValue={content.hero_button1_href} className={inputCls} /></L>
          <L label="Przycisk 2 — tekst"><input name="hero_button2_label" defaultValue={content.hero_button2_label} className={inputCls} /></L>
          <L label="Przycisk 2 — link"><input name="hero_button2_href" defaultValue={content.hero_button2_href} className={inputCls} /></L>
        </div>
      </Section>

      <Section title="Wstęp i statystyki">
        <L label="Nadtytuł"><input name="intro_eyebrow" defaultValue={content.intro_eyebrow} className={inputCls} /></L>
        <L label="Tekst wstępu"><textarea name="intro_text" rows={3} defaultValue={content.intro_text} className={inputCls} /></L>
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={s.number} onChange={(e) => setStats(stats.map((r, k) => (k === i ? { ...r, number: e.target.value } : r)))} placeholder="np. 1989" className={inputCls} />
              <input value={s.label} onChange={(e) => setStats(stats.map((r, k) => (k === i ? { ...r, label: e.target.value } : r)))} placeholder="np. Rok założenia" className={inputCls} />
              <button type="button" onClick={() => setStats(stats.filter((_, k) => k !== i))} className="shrink-0 rounded-sm border border-red-300 px-2.5 py-2 text-xs text-red-600 hover:bg-red-50">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setStats([...stats, { number: '', label: '' }])} className="btn-ghost">+ Dodaj statystykę</button>
      </Section>

      <Section title="O stajni">
        <L label="Nadtytuł"><input name="about_eyebrow" defaultValue={content.about_eyebrow} className={inputCls} /></L>
        <L label="Nagłówek"><input name="about_heading" defaultValue={content.about_heading} className={inputCls} /></L>
        <L label="Tekst"><textarea name="about_text" rows={5} defaultValue={content.about_text} className={inputCls} /></L>
        <SingleImageField
          label="Zdjęcie sekcji"
          url={aboutImage.url}
          alt={aboutImage.alt}
          onUrlChange={(url) => setAboutImage((h) => ({ ...h, url }))}
          onAltChange={(alt) => setAboutImage((h) => ({ ...h, alt }))}
          folder="strona-glowna/o-stajni"
        />
      </Section>

      <Section title="Wyróżnione konie">
        <p className="text-[0.8rem] text-charcoal/60">Jeśli nie zaznaczysz żadnego konia, wyświetlą się automatycznie konie oznaczone jako „wyróżnione”.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {horses.map((h) => (
            <label key={h.id} className="flex items-center gap-2 text-sm text-charcoal/80">
              <input type="checkbox" checked={featuredHorses.includes(h.id)} onChange={() => toggle(featuredHorses, setFeaturedHorses, h.id)} className="h-4 w-4 accent-forest" />
              {h.name}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Wyróżnione wydarzenia">
        <p className="text-[0.8rem] text-charcoal/60">Jeśli nie zaznaczysz żadnego, wyświetlą się automatycznie najnowsze wydarzenia.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {events.map((e) => (
            <label key={e.id} className="flex items-center gap-2 text-sm text-charcoal/80">
              <input type="checkbox" checked={featuredEvents.includes(e.id)} onChange={() => toggle(featuredEvents, setFeaturedEvents, e.id)} className="h-4 w-4 accent-forest" />
              {e.title}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Wyróżnione albumy galerii">
        <p className="text-[0.8rem] text-charcoal/60">Jeśli nie zaznaczysz żadnego, wyświetlą się automatycznie pierwsze albumy.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {albums.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm text-charcoal/80">
              <input type="checkbox" checked={featuredAlbums.includes(a.id)} onChange={() => toggle(featuredAlbums, setFeaturedAlbums, a.id)} className="h-4 w-4 accent-forest" />
              {a.title}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Sekcja filmu">
        <L label="Film którego konia pokazać (opcjonalnie)">
          <select name="video_horse_slug" defaultValue={content.video_horse_slug ?? ''} className={inputCls}>
            <option value="">Automatycznie (pierwszy koń z filmem)</option>
            {horses.filter((h) => h.videos.some((v) => v.publish)).map((h) => (
              <option key={h.id} value={h.slug}>{h.name}</option>
            ))}
          </select>
        </L>
      </Section>

      <Section title="Kontakt (CTA)">
        <L label="Nagłówek sekcji kontaktowej"><input name="cta_heading" defaultValue={content.cta_heading} className={inputCls} /></L>
      </Section>

      <Section title="Kolejność i widoczność sekcji">
        <div className="space-y-2">
          {sections.map((s, i) => (
            <div key={s.key} className="flex items-center justify-between gap-3 border border-navy/10 bg-cream px-3 py-2">
              <label className="flex items-center gap-2 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={s.visible}
                  onChange={() => setSections(sections.map((r, k) => (k === i ? { ...r, visible: !r.visible } : r)))}
                  className="h-4 w-4 accent-forest"
                />
                {SECTION_LABEL[s.key]}
              </label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveSection(i, -1)} className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↑</button>
                <button type="button" onClick={() => moveSection(i, 1)} className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↓</button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[0.72rem] text-charcoal/50">Sekcja Hero pozostaje zawsze pierwsza.</p>
      </Section>

      <SubmitButton label="Zapisz stronę główną" />
    </form>
  );
}
