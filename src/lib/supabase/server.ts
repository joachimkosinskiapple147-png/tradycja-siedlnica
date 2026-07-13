import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Klient serwerowy powiązany z sesją użytkownika (przez ciasteczka).
 * Używany w Server Components, Server Actions i middleware.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Wywołanie z Server Component — ustawianie ciasteczek obsłuży middleware.
        }
      },
    },
  });
}
