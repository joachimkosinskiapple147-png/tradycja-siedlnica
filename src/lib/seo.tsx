import type { Metadata } from 'next';
import { SITE } from './constants';

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const title = opts.title ? `${opts.title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const description = opts.description ?? SITE.description;
  const url = `${SITE.url}${opts.path ?? ''}`;
  const image = opts.image ?? '/images/full/hero.webp';

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 800, alt: SITE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.legalName,
    description: SITE.description,
    foundingDate: String(SITE.foundedYear),
    telephone: SITE.phoneHref,
    email: SITE.email,
    url: SITE.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Siedlnica',
      addressCountry: 'PL',
    },
    image: `${SITE.url}/images/full/hero.webp`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function eventJsonLd(e: {
  title: string;
  date: string;
  location?: string;
  description: string;
  image?: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.date,
    eventStatus: 'https://schema.org/EventScheduled',
    description: e.description,
    ...(e.image ? { image: [`${SITE.url}${e.image}`] } : {}),
    location: {
      '@type': 'Place',
      name: e.location ?? SITE.name,
      address: { '@type': 'PostalAddress', addressLocality: 'Siedlnica', addressCountry: 'PL' },
    },
    url: `${SITE.url}${e.path}`,
    organizer: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
