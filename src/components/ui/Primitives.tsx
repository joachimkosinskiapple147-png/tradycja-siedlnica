import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { HORSE_STATUS, type HorseStatus } from '@/lib/constants';
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo';

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark',
  index,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  index?: string;
}) {
  const isLight = tone === 'light';
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
        {index && <span className="section-num">{index}</span>}
        {eyebrow && (
          <span className={cn('eyebrow', align === 'center' && 'eyebrow--center justify-center', isLight && 'text-brass-soft')}>
            {eyebrow}
          </span>
        )}
      </div>
      <h2
        className={cn(
          'mt-4 text-display-md font-semibold text-balance',
          isLight ? 'text-ivory' : 'text-navy'
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn('prose-lux mt-5', align === 'center' && 'mx-auto', isLight && 'text-ivory/75')}>
          {intro}
        </p>
      )}
      <span className={cn('mt-6 block h-px w-16', isLight ? 'bg-brass-soft/60' : 'bg-brass/60', align === 'center' && 'mx-auto')} aria-hidden="true" />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  crumbs?: { name: string; path: string }[];
}) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-navy pt-[76px] md:min-h-[58vh]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-photo-scrim" aria-hidden="true" />
      <div className="shell-wide relative z-10 pb-14 pt-10 text-ivory md:pb-20">
        {crumbs && <Breadcrumbs items={crumbs} tone="light" />}
        {eyebrow && <span className="eyebrow mt-6 text-brass-soft">{eyebrow}</span>}
        <h1 className="mt-4 max-w-3xl text-display-lg font-semibold text-shadow-hero">{title}</h1>
        {intro && <p className="prose-lux mt-5 max-w-2xl text-ivory/85">{intro}</p>}
      </div>
    </section>
  );
}

export function Breadcrumbs({
  items,
  tone = 'dark',
}: {
  items: { name: string; path: string }[];
  tone?: 'dark' | 'light';
}) {
  const isLight = tone === 'light';
  const full = [{ name: 'Strona główna', path: '/' }, ...items];
  return (
    <>
      <nav aria-label="Ścieżka nawigacji" className="text-[0.72rem] uppercase tracking-wide2">
        <ol className="flex flex-wrap items-center gap-2">
          {full.map((c, i) => {
            const last = i === full.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span className={isLight ? 'text-ivory/70' : 'text-navy/55'}>{c.name}</span>
                ) : (
                  <Link
                    href={c.path}
                    className={cn('transition-colors', isLight ? 'text-ivory/80 hover:text-ivory' : 'text-navy/70 hover:text-navy')}
                  >
                    {c.name}
                  </Link>
                )}
                {!last && <span className={isLight ? 'text-ivory/40' : 'text-navy/30'}>/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(full)} />
    </>
  );
}

export function StatusPill({ status }: { status: HorseStatus }) {
  const s = HORSE_STATUS[status];
  return (
    <span className={cn('status-pill bg-ivory/80', s.tone)}>
      <span className={cn('status-dot', s.dot)} />
      {s.label}
    </span>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="card-lift rounded-[22px] border border-navy/10 bg-cream px-8 py-16 text-center shadow-[0_24px_60px_-40px_rgba(16,26,36,0.35)]">
      <Image
        src="/images/brand/logo-badge-navy.png"
        alt=""
        width={60}
        height={60}
        className="mx-auto h-14 w-14 rounded-full opacity-80 ring-1 ring-brass/40 ring-offset-2 ring-offset-cream"
      />
      <h3 className="mt-6 font-display text-2xl font-semibold text-navy">{title}</h3>
      <Ornament className="mx-auto mt-4" />
      <p className="prose-lux mx-auto mt-3 text-charcoal/70">{message}</p>
      {action && (
        <Link href={action.href} className="btn-ghost mt-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Ornament({ className }: { className?: string }) {
  // Delikatny mosiężny liść — motyw z logo (laur), używany jako separator.
  return (
    <svg viewBox="0 0 120 24" className={cn('h-4 w-24 text-brass', className)} fill="none" aria-hidden="true">
      <path d="M2 12h38M82 12h38" stroke="currentColor" strokeWidth="1" />
      <path
        d="M60 4c-3 3-3 5 0 8 3-3 3-5 0-8ZM60 20c-3-3-3-5 0-8 3 3 3 5 0 8Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="60" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}
