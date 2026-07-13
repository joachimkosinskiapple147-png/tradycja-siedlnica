export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Czy baza Supabase jest skonfigurowana? Jeśli nie — strona działa na danych
 * przykładowych z /lib/data/seed.ts, a panel administratora wyświetla instrukcję
 * konfiguracji. Dzięki temu projekt uruchamia się bez żadnej konfiguracji.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
