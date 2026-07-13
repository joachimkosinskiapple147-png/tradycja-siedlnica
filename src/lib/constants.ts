// Domyślne dane strony. W produkcji nadpisywane przez tabelę `site_settings`
// (edytowalne w panelu administratora → Ustawienia).

export const SITE = {
  name: 'Tradycja Siedlnica',
  ownerName: 'Sylwester Kosiński',
  legalName: 'Tradycja Siedlnica – Sylwester Kosiński',
  foundedYear: 1989,
  tagline: 'Tradycja, doświadczenie i pasja do koni od 1989 roku',
  description:
    'Hodowla, trening i sprzedaż koni sportowych w stajni tworzonej z doświadczeniem i szacunkiem do każdego konia.',
  phone: '881 293 333',
  phoneHref: '+48881293333',
  email: 'tradycja.siedlnica@gmail.com',
  address: {
    label: 'Siedlnica, woj. wielkopolskie',
    full: 'Siedlnica, 64-234 Siedlnica',
  },
  // URL mapy — do podmiany na dokładny w panelu (Ustawienia → Mapa).
  mapEmbedQuery: 'Siedlnica, Polska',
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tradycja-siedlnica.pl',
  locale: 'pl_PL',
} as const;

export const NAV = [
  { label: 'Strona główna', href: '/' },
  { label: 'Nasza stajnia', href: '/nasza-stajnia' },
  { label: 'Konie', href: '/konie' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Wydarzenia', href: '/wydarzenia' },
  { label: 'Oferta', href: '/oferta' },
  { label: 'Kontakt', href: '/kontakt' },
] as const;

export const HORSE_STATUS = {
  na_sprzedaz: { label: 'Na sprzedaż', dot: 'bg-forest', tone: 'border-forest/40 text-forest' },
  zarezerwowany: { label: 'Zarezerwowany', dot: 'bg-brass', tone: 'border-brass/50 text-brass-deep' },
  sprzedany: { label: 'Sprzedany', dot: 'bg-navy/40', tone: 'border-navy/25 text-navy/55' },
  niedostepny: { label: 'Niedostępny', dot: 'bg-charcoal/40', tone: 'border-charcoal/25 text-charcoal/55' },
} as const;

export type HorseStatus = keyof typeof HORSE_STATUS;

export const SEX_LABEL: Record<string, string> = {
  ogier: 'Ogier',
  klacz: 'Klacz',
  walach: 'Wałach',
  zrebak: 'Źrebak',
};
