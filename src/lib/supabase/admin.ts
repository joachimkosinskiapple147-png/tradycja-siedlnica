import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Twarda bramka panelu: wołać NA POCZĄTKU każdej strony edycji / akcji,
 * ZANIM zapytamy o wiersz z bazy. Dzięki temu wygasła lub niepełna sesja
 * kończy się przekierowaniem do logowania — a nie mylącym 404 z notFound().
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect('/admin');
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');
  const { data: admin, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();
  // Tolerancja jak w middleware: brak tabeli `admins` (stara baza przed
  // migracją 0001) nie blokuje dotychczasowych administratorów.
  if (!error && !admin) redirect('/admin/login?blad=brak_uprawnien');
  return supabase;
}

/**
 * Czy bieżące żądanie pochodzi od administratora? Bez redirectów —
 * do użytku na stronach publicznych (podgląd szkiców w panelu).
 */
export async function isAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return false;
    const { data: admin, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (error) return true; // patrz tolerancja w requireAdmin()
    return Boolean(admin);
  } catch {
    return false;
  }
}
