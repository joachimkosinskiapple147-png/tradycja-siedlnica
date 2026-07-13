'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { TimelineEntry } from '@/lib/types';
import { saveTimeline } from '@/actions/content';
import { SubmitButton } from '@/components/site/FormBits';
import SingleImageField from '@/components/admin/SingleImageField';

const inputCls =
  'w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brass';

type Row = { year: string; title: string; description: string; image_url: string; image_alt: string };

export default function TimelineEditor({ entries }: { entries: TimelineEntry[] }) {
  const [state, action] = useFormState(saveTimeline, { ok: false, message: '' });
  const [rows, setRows] = useState<Row[]>(
    entries
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((e) => ({
        year: e.year,
        title: e.title,
        description: e.description,
        image_url: e.image?.url ?? '',
        image_alt: e.image?.alt ?? '',
      }))
  );

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const move = (i: number, dir: number) => {
    const next = [...rows];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  };

  return (
    <form action={action} className="space-y-4">
      {rows.map((r, i) => (
        <span key={i} className="hidden">
          <input type="hidden" name="year" value={r.year} />
          <input type="hidden" name="title" value={r.title} />
          <input type="hidden" name="description" value={r.description} />
          <input type="hidden" name="image_url" value={r.image_url} />
          <input type="hidden" name="image_alt" value={r.image_alt} />
        </span>
      ))}

      {state.message && (
        <p className={`border px-4 py-3 text-sm ${state.ok ? 'border-forest/40 bg-forest/5 text-forest' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={i} className="border border-navy/12 bg-cream p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Rok / etykieta *</span>
                <input value={r.year} onChange={(e) => update(i, { year: e.target.value })} placeholder="np. 1989" className={inputCls} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Tytuł *</span>
                <input value={r.title} onChange={(e) => update(i, { title: e.target.value })} className={inputCls} />
              </label>
            </div>
            <label className="mt-3 block space-y-1.5">
              <span className="text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Opis</span>
              <textarea value={r.description} onChange={(e) => update(i, { description: e.target.value })} rows={3} className={inputCls} />
            </label>
            <div className="mt-3">
              <SingleImageField
                label="Zdjęcie (opcjonalnie)"
                url={r.image_url}
                alt={r.image_alt}
                onUrlChange={(url) => update(i, { image_url: url })}
                onAltChange={(alt) => update(i, { image_alt: alt })}
                folder="oś-czasu"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={() => move(i, -1)} className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded-sm border border-navy/15 px-2 py-1 text-xs hover:bg-ivory">↓</button>
              <button type="button" onClick={() => setRows(rows.filter((_, k) => k !== i))} className="rounded-sm border border-red-300 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50">Usuń wpis</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRows([...rows, { year: '', title: '', description: '', image_url: '', image_alt: '' }])}
          className="btn-ghost"
        >
          + Dodaj wpis osi czasu
        </button>
        <SubmitButton label="Zapisz oś czasu" />
      </div>
    </form>
  );
}
