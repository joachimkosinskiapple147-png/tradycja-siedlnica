'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    params.get('blad') === 'brak_uprawnien' ? 'To konto nie ma uprawnień administratora.' : ''
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Nieprawidłowy e-mail lub hasło.');
        setLoading(false);
        return;
      }
      router.push(params.get('powrot') || '/admin');
      router.refresh();
    } catch {
      setError('Wystąpił błąd. Spróbuj ponownie.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/images/brand/logo-mark-cream.png" alt="Tradycja Siedlnica" width={72} height={72} className="h-18 w-18 rounded-full" />
          <h1 className="mt-5 font-display text-3xl text-ivory">Panel administracyjny</h1>
          <p className="mt-1 text-[0.7rem] uppercase tracking-eyebrow text-brass-soft">Tradycja Siedlnica</p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="border border-brass/40 bg-brass/10 p-5 text-sm text-ivory/85">
            Logowanie będzie aktywne po skonfigurowaniu Supabase. Zobacz instrukcję w <code className="text-brass-soft">README.md</code>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[0.7rem] uppercase tracking-wide2 text-ivory/60">E-mail</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-ivory/25 bg-ivory/5 px-4 py-3 text-ivory outline-none focus:border-brass"
              />
            </label>
            <label className="block">
              <span className="text-[0.7rem] uppercase tracking-wide2 text-ivory/60">Hasło</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-ivory/25 bg-ivory/5 px-4 py-3 text-ivory outline-none focus:border-brass"
              />
            </label>
            {error && <p className="border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">{error}</p>}
            <button type="submit" disabled={loading} className="btn-brass w-full disabled:opacity-60">
              {loading ? 'Logowanie…' : 'Zaloguj się'}
            </button>
          </form>
        )}

        <a href="/" className="mt-6 block text-center text-[0.72rem] uppercase tracking-wide2 text-ivory/50 hover:text-ivory/80">
          ← Wróć na stronę
        </a>
      </div>
    </div>
  );
}
