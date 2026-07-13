import type { Pedigree } from '@/lib/types';

function Cell({ label, value, muted }: { label: string; value?: string; muted?: boolean }) {
  return (
    <div className="border border-navy/12 bg-cream px-4 py-3">
      <div className="text-[0.62rem] uppercase tracking-eyebrow text-brass-deep">{label}</div>
      <div className={`mt-1 font-display text-lg ${muted ? 'text-navy/40' : 'text-navy'}`}>
        {value || '—'}
      </div>
    </div>
  );
}

export default function PedigreeDisplay({ pedigree }: { pedigree?: Pedigree }) {
  if (!pedigree || (!pedigree.sire && !pedigree.dam)) return null;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-3">
          <Cell label="Ojciec" value={pedigree.sire} />
          {pedigree.sire_line && (
            <p className="px-1 text-sm leading-relaxed text-charcoal/70">{pedigree.sire_line}</p>
          )}
        </div>
        <div className="space-y-3">
          <Cell label="Matka" value={pedigree.dam} />
          {pedigree.damsire && <Cell label="Ojciec matki" value={pedigree.damsire} />}
          {pedigree.dam_line && (
            <p className="px-1 text-sm leading-relaxed text-charcoal/70">{pedigree.dam_line}</p>
          )}
        </div>
      </div>
      {pedigree.notes && (
        <p className="mt-4 border-l-2 border-brass/50 pl-4 text-sm italic leading-relaxed text-charcoal/60">
          {pedigree.notes}
        </p>
      )}
    </div>
  );
}
