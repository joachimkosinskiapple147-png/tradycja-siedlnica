// ─────────────────────────────────────────────────────────────────────────────
//  Wartości domyślne treści edytowalnych w panelu (Strona główna, Ustawienia).
//  Używane, dopóki administrator nie zapisze własnej wersji w bazie — dzięki
//  temu strona wygląda identycznie zanim ktokolwiek cokolwiek zmieni.
// ─────────────────────────────────────────────────────────────────────────────

import type { AboutContent, HomeContent, SiteSettings } from '@/lib/types';
import { SITE } from '@/lib/constants';

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero_eyebrow: `Hodowla koni sportowych · od ${SITE.foundedYear}`,
  hero_heading: 'Tradycja, doświadczenie i pasja do koni',
  hero_description: SITE.description,
  hero_image_url: '/images/full/hero.webp',
  hero_image_alt: 'Konie nad wodą o zmierzchu na pastwisku stajni Tradycja Siedlnica',
  hero_button1_label: 'Zobacz konie na sprzedaż',
  hero_button1_href: '/konie',
  hero_button2_label: 'Poznaj naszą stajnię',
  hero_button2_href: '/nasza-stajnia',
  intro_eyebrow: 'Nasza stajnia',
  intro_text:
    'Od 1989 roku prowadzimy hodowlę, trening i sprzedaż koni sportowych — z doświadczeniem przekazywanym przez lata i szacunkiem do każdego konia.',
  stats: [
    { number: '1989', label: 'Rok założenia' },
    { number: '35+', label: 'Lat doświadczenia' },
    { number: '~100', label: 'Koni w stajni' },
    { number: '3', label: 'Filary: hodowla · trening · sprzedaż' },
  ],
  about_eyebrow: 'Rodzinny charakter',
  about_heading: 'Miejsce tworzone przez pokolenia',
  about_text:
    'Tradycja Siedlnica to stajnia budowana konsekwentnie od 1989 roku. Przez ponad trzy dekady zdobywaliśmy wiedzę, którą dziś wykorzystujemy w hodowli, treningu i przygotowaniu koni do sprzedaży.\n\nDo każdego konia podchodzimy indywidualnie — z cierpliwością i szacunkiem. Wierzymy, że spokojna, uczciwa praca daje konie zrównoważone, zdrowe i chętne do współpracy.',
  about_image_url: '/images/full/stajnia-korytarz.webp',
  about_image_alt: 'Korytarz stajni Tradycja Siedlnica',
  video_horse_slug: null,
  cta_heading: 'Szukasz odpowiedniego konia? Porozmawiajmy.',
  featured_horse_ids: [],
  featured_event_ids: [],
  featured_album_ids: [],
  sections: [
    { key: 'hero', visible: true },
    { key: 'intro', visible: true },
    { key: 'horses', visible: true },
    { key: 'about', visible: true },
    { key: 'offers', visible: true },
    { key: 'events', visible: true },
    { key: 'gallery', visible: true },
    { key: 'video', visible: true },
    { key: 'contact_cta', visible: true },
  ],
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  intro_text:
    'Tradycja Siedlnica to stajnia prowadzona przez Sylwestra Kosińskiego, działająca nieprzerwanie od 1989 roku. Dziś opiekujemy się stadem liczącym około stu koni — od źrebiąt, przez młodzież hodowlaną, po konie pracujące pod siodłem.\n\nZajmujemy się hodowlą, treningiem oraz sprzedażą koni sportowych. Łączymy wieloletnie doświadczenie z codzienną, spokojną pracą przy koniach.',
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: SITE.phone,
  phone_href: SITE.phoneHref,
  email: SITE.email,
  address_label: SITE.address.label,
  address_full: SITE.address.full,
  map_query: SITE.mapEmbedQuery,
  hours: [
    { day: 'Poniedziałek – Piątek', hours: '9:00 – 18:00' },
    { day: 'Sobota', hours: '9:00 – 16:00' },
    { day: 'Niedziela', hours: 'po wcześniejszym umówieniu' },
  ],
  hours_note: 'Wizyty najlepiej umawiać telefonicznie z wyprzedzeniem.',
  social_facebook: SITE.social.facebook,
  social_instagram: SITE.social.instagram,
  social_youtube: SITE.social.youtube,
  seo_title: SITE.name,
  seo_description: SITE.description,
  footer_text:
    'Hodowla, trening i sprzedaż koni sportowych. Ponad 35 lat doświadczenia i szacunku do każdego konia.',
};

export function mergeHomeContent(partial: Partial<HomeContent> | null | undefined): HomeContent {
  if (!partial) return DEFAULT_HOME_CONTENT;
  return {
    ...DEFAULT_HOME_CONTENT,
    ...partial,
    stats: partial.stats?.length ? partial.stats : DEFAULT_HOME_CONTENT.stats,
    sections: partial.sections?.length ? partial.sections : DEFAULT_HOME_CONTENT.sections,
    featured_horse_ids: partial.featured_horse_ids ?? [],
    featured_event_ids: partial.featured_event_ids ?? [],
    featured_album_ids: partial.featured_album_ids ?? [],
  };
}

export function mergeSiteSettings(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!partial) return DEFAULT_SITE_SETTINGS;
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...partial,
    hours: partial.hours?.length ? partial.hours : DEFAULT_SITE_SETTINGS.hours,
  };
}

export function mergeAboutContent(partial: Partial<AboutContent> | null | undefined): AboutContent {
  if (!partial) return DEFAULT_ABOUT_CONTENT;
  return { ...DEFAULT_ABOUT_CONTENT, ...partial };
}
