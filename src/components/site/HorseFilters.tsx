'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { HORSE_STATUS, SEX_LABEL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function HorseFilters({
  breeds,
  disciplines,
  total,
}: {
  breeds: string[];
  disciplines: string[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const current = (k: string) => params.get(k) ?? '';
  const activeCount = ['status', 'sex', 'breed', 'discipline', 'search'].filter((k) => current(k)).length;

  const selectCls =
    'w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brass';

  return (
    <div className="border-y border-navy/12 bg-cream">
      <div className="shell-wide flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-charcoal/70">
            <span className="font-semibold text-navy">{total}</span>{' '}
            {total === 1 ? 'koń' : total >= 2 && total <= 4 ? 'konie' : 'koni'}
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="link-underline text-[0.72rem] uppercase tracking-wide2 text-brass-deep"
            >
              Wyczyść filtry ({activeCount})
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="btn-ghost px-4 py-2 text-[0.72rem]"
        >
          Filtry
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={cn('overflow-hidden transition-all duration-500 ease-editorial', open ? 'max-h-[600px]' : 'max-h-0')}>
        <div className="shell-wide grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Szukaj</span>
            <input
              type="search"
              defaultValue={current('search')}
              onChange={(e) => setParam('search', e.target.value)}
              placeholder="Imię, rasa…"
              className={selectCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Status</span>
            <select value={current('status')} onChange={(e) => setParam('status', e.target.value)} className={selectCls}>
              <option value="">Wszystkie</option>
              {Object.entries(HORSE_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Płeć</span>
            <select value={current('sex')} onChange={(e) => setParam('sex', e.target.value)} className={selectCls}>
              <option value="">Wszystkie</option>
              {Object.entries(SEX_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Sortuj</span>
            <select value={current('sort')} onChange={(e) => setParam('sort', e.target.value)} className={selectCls}>
              <option value="">Wyróżnione</option>
              <option value="new">Najmłodsze</option>
              <option value="old">Najstarsze</option>
              <option value="name">Alfabetycznie</option>
            </select>
          </label>
          {breeds.length > 0 && (
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Rasa</span>
              <select value={current('breed')} onChange={(e) => setParam('breed', e.target.value)} className={selectCls}>
                <option value="">Wszystkie</option>
                {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
          )}
          {disciplines.length > 0 && (
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] uppercase tracking-wide2 text-charcoal/60">Przeznaczenie</span>
              <select value={current('discipline')} onChange={(e) => setParam('discipline', e.target.value)} className={selectCls}>
                <option value="">Wszystkie</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
