import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/supabase/config';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  // Bez konfiguracji Supabase panel działa w trybie „tylko podgląd/konfiguracja”
  // — nie przekierowujemy, aby strona z instrukcją była dostępna.
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';

  if (pathname.startsWith('/admin') && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('powrot', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && !isLogin && user) {
    const { data: admin, error } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    // Jeśli tabela `admins` jeszcze nie istnieje (migracja 0001 nie została uruchomiona),
    // nie blokujemy dostępu — dotychczasowe zasady (każdy zalogowany) obowiązują do czasu migracji.
    if (!error && !admin) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      url.searchParams.set('blad', 'brak_uprawnien');
      return NextResponse.redirect(url);
    }
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
