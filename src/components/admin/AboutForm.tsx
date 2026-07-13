'use client';

import { useFormState } from 'react-dom';
import type { AboutContent } from '@/lib/types';
import { saveAboutContent } from '@/actions/content';
import { SubmitButton } from '@/components/site/FormBits';

const inputCls =
  'w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brass';

export default function AboutForm({ about }: { about: AboutContent }) {
  const [state, action] = useFormState(saveAboutContent, { ok: false, message: '' });

  return (
    <form action={action} className="space-y-4">
      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}
      <label className="block space-y-1.5">
        <span className="text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Opis stajni (sekcja „Kim jesteśmy”)</span>
        <textarea name="intro_text" rows={8} defaultValue={about.intro_text} className={inputCls} />
        <span className="block text-[0.72rem] text-charcoal/50">Wskazówka: pusty wiersz rozdziela akapity.</span>
      </label>
      <SubmitButton label="Zapisz opis stajni" />
    </form>
  );
}
