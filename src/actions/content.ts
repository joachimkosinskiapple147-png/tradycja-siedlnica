'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { HomeContent, HomeSection, OpeningHoursRow, SiteSettings } from '@/lib/types';

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');
  return supabase;
}

type ActionResult = { ok: boolean; message: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

// ── Oś czasu (Nasza stajnia) ──────────────────────────────────────────────────
export async function saveTimeline(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const years = fd.getAll('year').map(String);
  const titles = fd.getAll('title').map(String);
  const descriptions = fd.getAll('description').map(String);
  const imageUrls = fd.getAll('image_url').map(String);
  const imageAlts = fd.getAll('image_alt').map(String);

  try {
    await supabase.from('timeline_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const rows = years
      .map((year, i) => ({
        year: year.trim(),
        title: titles[i]?.trim() ?? '',
        description: descriptions[i]?.trim() || null,
        image_url: imageUrls[i]?.trim() || null,
        image_alt: imageAlts[i]?.trim() || null,
        position: i,
      }))
      .filter((r) => r.year && r.title);
    if (rows.length) {
      const { error } = await supabase.from('timeline_entries').insert(rows);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveTimeline]', e);
    return { ok: false, message: 'Nie udało się zapisać osi czasu.' };
  }

  revalidatePath('/admin/nasza-stajnia');
  revalidatePath('/nasza-stajnia');
  return { ok: true, message: 'Oś czasu została zapisana.' };
}

// ── Opis stajni ────────────────────────────────────────────────────────────────
export async function saveAboutContent(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const value = { intro_text: str(fd, 'intro_text') };
  try {
    const { error } = await supabase
      .from('page_content')
      .upsert({ key: 'about', value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  } catch (e) {
    console.error('[saveAboutContent]', e);
    return { ok: false, message: 'Nie udało się zapisać opisu stajni.' };
  }

  revalidatePath('/admin/nasza-stajnia');
  revalidatePath('/nasza-stajnia');
  return { ok: true, message: 'Opis stajni został zapisany.' };
}

// ── Strona główna ──────────────────────────────────────────────────────────────
export async function saveHomeContent(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const statNumbers = fd.getAll('stat_number').map(String);
  const statLabels = fd.getAll('stat_label').map(String);
  const stats = statNumbers
    .map((number, i) => ({ number: number.trim(), label: statLabels[i]?.trim() ?? '' }))
    .filter((s) => s.number && s.label);

  const sectionKeys = fd.getAll('section_key').map(String);
  const sectionVisible = fd.getAll('section_visible').map(String);
  const sections: HomeSection[] = sectionKeys.map((key, i) => ({
    key: key as HomeSection['key'],
    visible: sectionVisible[i] === 'true',
  }));

  const value: HomeContent = {
    hero_eyebrow: str(fd, 'hero_eyebrow'),
    hero_heading: str(fd, 'hero_heading'),
    hero_description: str(fd, 'hero_description'),
    hero_image_url: str(fd, 'hero_image_url'),
    hero_image_alt: str(fd, 'hero_image_alt'),
    hero_button1_label: str(fd, 'hero_button1_label'),
    hero_button1_href: str(fd, 'hero_button1_href'),
    hero_button2_label: str(fd, 'hero_button2_label'),
    hero_button2_href: str(fd, 'hero_button2_href'),
    intro_eyebrow: str(fd, 'intro_eyebrow'),
    intro_text: str(fd, 'intro_text'),
    stats,
    about_eyebrow: str(fd, 'about_eyebrow'),
    about_heading: str(fd, 'about_heading'),
    about_text: str(fd, 'about_text'),
    about_image_url: str(fd, 'about_image_url'),
    about_image_alt: str(fd, 'about_image_alt'),
    video_horse_slug: str(fd, 'video_horse_slug') || null,
    cta_heading: str(fd, 'cta_heading'),
    featured_horse_ids: fd.getAll('featured_horse_id').map(String).filter(Boolean),
    featured_event_ids: fd.getAll('featured_event_id').map(String).filter(Boolean),
    featured_album_ids: fd.getAll('featured_album_id').map(String).filter(Boolean),
    sections,
  };

  try {
    const { error } = await supabase
      .from('page_content')
      .upsert({ key: 'home', value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  } catch (e) {
    console.error('[saveHomeContent]', e);
    return { ok: false, message: 'Nie udało się zapisać treści strony głównej.' };
  }

  revalidatePath('/admin/strona-glowna');
  revalidatePath('/');
  return { ok: true, message: 'Treści strony głównej zostały zapisane.' };
}

// ── Ustawienia ogólne ────────────────────────────────────────────────────────
export async function saveSiteSettings(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const days = fd.getAll('hours_day').map(String);
  const hoursVals = fd.getAll('hours_value').map(String);
  const hours: OpeningHoursRow[] = days
    .map((day, i) => ({ day: day.trim(), hours: hoursVals[i]?.trim() ?? '' }))
    .filter((h) => h.day && h.hours);

  const value: SiteSettings = {
    phone: str(fd, 'phone'),
    phone_href: str(fd, 'phone_href'),
    email: str(fd, 'email'),
    address_label: str(fd, 'address_label'),
    address_full: str(fd, 'address_full'),
    map_query: str(fd, 'map_query'),
    hours,
    hours_note: str(fd, 'hours_note'),
    social_facebook: str(fd, 'social_facebook'),
    social_instagram: str(fd, 'social_instagram'),
    social_youtube: str(fd, 'social_youtube'),
    seo_title: str(fd, 'seo_title'),
    seo_description: str(fd, 'seo_description'),
    footer_text: str(fd, 'footer_text'),
  };

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'general', value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  } catch (e) {
    console.error('[saveSiteSettings]', e);
    return { ok: false, message: 'Nie udało się zapisać ustawień.' };
  }

  revalidatePath('/admin/ustawienia');
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Ustawienia zostały zapisane.' };
}
