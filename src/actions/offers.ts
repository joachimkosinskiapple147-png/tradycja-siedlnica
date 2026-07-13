'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { slugify } from '@/lib/utils';

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
function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function saveOffer(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Skonfiguruj Supabase, aby zapisywać dane.' };
  const supabase = await requireUser();

  const id = str(fd, 'id') || null;
  const title = str(fd, 'title');
  if (title.length < 2) return { ok: false, message: 'Podaj tytuł oferty.' };
  const slug = str(fd, 'slug') || slugify(title);
  const benefits = fd.getAll('benefit').map(String).map((s) => s.trim()).filter(Boolean);

  const offerRow = {
    title,
    slug,
    excerpt: str(fd, 'excerpt') || null,
    body: str(fd, 'body') || null,
    image_url: str(fd, 'image_url') || null,
    image_alt: str(fd, 'image_alt') || null,
    price: str(fd, 'price') || null,
    benefits: benefits.length ? benefits : null,
    active: fd.get('active') === 'on',
    position: numOrNull(fd, 'position') ?? 0,
  };

  try {
    if (id) {
      const { error } = await supabase.from('offers').update(offerRow).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('offers').insert(offerRow);
      if (error) throw error;
    }
  } catch (e) {
    console.error('[saveOffer]', e);
    return { ok: false, message: 'Nie udało się zapisać oferty. Sprawdź dane (np. unikalny adres URL).' };
  }

  revalidatePath('/admin/oferta');
  revalidatePath('/oferta');
  revalidatePath('/');
  redirect('/admin/oferta?zapisano=1');
}

export async function deleteOffer(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('offers').delete().eq('id', id);
  revalidatePath('/admin/oferta');
  revalidatePath('/oferta');
  revalidatePath('/');
}

export async function quickSetOffer(id: string, patch: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireUser();
  await supabase.from('offers').update(patch).eq('id', id);
  revalidatePath('/admin/oferta');
  revalidatePath('/oferta');
  revalidatePath('/');
}
