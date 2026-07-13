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

export interface HorseVideo {
  id: string;
  youtube_id: string;
  title: string;
  description?: string;
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
