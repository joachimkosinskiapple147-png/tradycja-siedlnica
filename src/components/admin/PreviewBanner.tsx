import Link from 'next/link';

/**
 * Banner podglądu roboczego: widoczny TYLKO dla zalogowanego administratora
 * na publicznej stronie elementu, który nie jest jeszcze opublikowany.
 * Gość nigdy go nie zobaczy (dla gościa taka strona to nadal 404).
 */
export default function PreviewBanner({ editHref, label }: { editHref: string; label: string }) {
  return (
    <div className="border-b border-brass/50 bg-navy px-4 py-3 text-center text-sm text-ivory">
      <span className="mr-2 inline-block rounded-sm bg-brass px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide2 text-navy">
        Podgląd roboczy
      </span>
      {label} — widoczne tylko dla administratora.
      <Link href={editHref} className="ml-3 underline underline-offset-2 hover:text-brass-soft">
        Wróć do edycji →
      </Link>
    </div>
  );
}
