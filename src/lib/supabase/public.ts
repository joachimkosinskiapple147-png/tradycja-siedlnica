import { createClient as createSbClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/* eslint-disable @typescript-eslint/no-explicit-any */
let memo: any = null;

/**
 * Klient wyłącznie do PUBLICZNEGO odczytu (bez sesji użytkownika, bez ciasteczek).
 *
 * Powód: serwerowy klient z `@/lib/supabase/server` czyta sesję przez `cookies()`,
 * co działa tylko w kontekście żądania. Podczas budowania statycznych ścieżek
 * (`generateStaticParams`) oraz metadanych powoduje to wyjątek i cichy fallback
 * do danych przykładowych — na żywą stronę trafiały wtedy wymyślone treści.
 * Ten klient działa wszędzie (build + request) i podlega publicznym politykom RLS,
 * więc zwraca wyłącznie treści opublikowane — dokładnie to, co wolno pokazać gościom.
 * Listy panelu (szkice) i akcje zapisu nadal używają klienta sesyjnego.
 */
export function createPublicClient() {
  if (!memo) {
    memo = createSbClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return memo;
}
