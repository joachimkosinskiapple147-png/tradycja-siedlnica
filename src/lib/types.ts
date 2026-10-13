import type { HorseStatus } from './constants';

export type PublishStatus = 'szkic' | 'opublikowany' | 'ukryty';

export interface HorseImage {
  id: string;
  url: string;
  thumb?: string;
  alt: string;
  caption?: string;
  position: number;
  is_cover?: boolean;
}

export type VideoCategory =
  | 'przejazd'
  | 'trening'
  | 'skoki'
  | 'ujezdzenie'
  | 'zawody'
  | 'prezentacja'
  | 'inne';

export interface HorseVideo {
  id: string;
  youtube_id: string;
  title: string;
  description?: string;
  category?: VideoCategory;
  publish: boolean;
  position: number;
}

export interface Pedigree {
  sire?: string; // ojciec
  dam?: string; // matka
  damsire?: string; // ojciec matki
  sire_line?: string; // opis linii ojca
  dam_line?: string; // opis linii matki
  notes?: string;
}

export interface Horse {
  id: string;
  slug: string;
  name: string;
  full_name?: string; // pełna nazwa rodowodowa
  status: HorseStatus;
  publish: PublishStatus;
  featured: boolean;
  position: number;
  birth_year?: number;
  birth_date?: string;
  sex: 'ogier' | 'klacz' | 'walach' | 'zrebak';
  breed?: string; // rasa
  color?: string; // maść
  height_cm?: number; // wzrost w kłębie
  origin?: string; // pochodzenie
  discipline?: string; // przeznaczenie
  training_level?: string; // poziom wyszkolenia
  temperament?: string; // charakter
  training_state?: string; // stan treningu
  achievements?: string; // osiągnięcia
  description?: string;
  price?: string; // tekst: kwota lub "Cena na zapytanie"
  pedigree?: Pedigree;
  images: HorseImage[];
  videos: HorseVideo[];
  seo_title?: string;
  seo_description?: string;
  updated_at?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string; // ISO
  location?: string;
  cover: HorseImage;
  excerpt: string;
  body?: string;
  results?: string;
  gallery: HorseImage[];
  videos: HorseVideo[];
  horse_slugs: string[];
  publish: PublishStatus;
  position: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  thumb?: string;
  alt: string;
  position: number;
}

export interface Album {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date?: string;
  cover: HorseImage;
  images: GalleryImage[];
  publish: PublishStatus;
  position: number;
}

export interface Offer {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  image: HorseImage;
  gallery?: HorseImage[];
  price?: string;
  benefits?: string[];
  active: boolean;
  position: number;
}

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  description: string;
  image?: HorseImage;
  position: number;
}

export interface HomeStat {
  number: string;
  label: string;
}

export interface HomeSection {
  key:
    | 'hero'
    | 'intro'
    | 'horses'
    | 'about'
    | 'offers'
    | 'events'
    | 'gallery'
    | 'video'
    | 'contact_cta';
  visible: boolean;
}

export interface HomeContent {
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
  hero_image_url: string;
  hero_image_alt: string;
  hero_button1_label: string;
  hero_button1_href: string;
  hero_button2_label: string;
  hero_button2_href: string;
  intro_eyebrow: string;
  intro_text: string;
  stats: HomeStat[];
  about_eyebrow: string;
  about_heading: string;
  about_text: string;
  about_image_url: string;
  about_image_alt: string;
  video_horse_slug: string | null;
  cta_heading: string;
  featured_horse_ids: string[];
  featured_event_ids: string[];
  featured_album_ids: string[];
  sections: HomeSection[];
}

export interface AboutContent {
  intro_text: string;
}

export interface OpeningHoursRow {
  day: string;
  hours: string;
}

export interface SiteSettings {
  phone: string;
  phone_href: string;
  email: string;
  address_label: string;
  address_full: string;
  map_query: string;
  hours: OpeningHoursRow[];
  hours_note: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  seo_title: string;
  seo_description: string;
  footer_text: string;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  subject?: string;
  message: string;
  horse_slug?: string;
  horse_name?: string;
  status: 'nowa' | 'przeczytana' | 'obsluzona';
  note?: string;
}

export interface Rider {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialty?: string;
  experience?: string;
  achievements?: string;
  description?: string;
  phone?: string;
  image: HorseImage;
  horse_slugs: string[];
  featured: boolean;
  position: number;
  publish: PublishStatus;
}

export interface Stallion {
  id: string;
  slug: string;
  name: string;
  full_name?: string;
  breed?: string;
  birth_year?: number;
  color?: string;
  height_cm?: number;
  pedigree?: Pedigree;
  description?: string;
  achievements?: string;
  covering_price?: string;
  semen?: string;
  season?: string;
  station?: string;
  contact?: string;
  image: HorseImage;
  gallery: HorseImage[];
  videos: HorseVideo[];
  featured: boolean;
  position: number;
  publish: PublishStatus;
}
