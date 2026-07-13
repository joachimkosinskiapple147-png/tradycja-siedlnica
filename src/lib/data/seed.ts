// ─────────────────────────────────────────────────────────────────────────────
//  DANE DEMONSTRACYJNE
//  Ten plik zawiera przykładową zawartość, aby strona działała i wyglądała
//  kompletnie zanim podłączysz bazę danych (Supabase). Wszystkie profile koni,
//  wydarzenia, albumy i teksty są PRZYKŁADOWE i przeznaczone do usunięcia /
//  zastąpienia z poziomu panelu administratora po podłączeniu bazy.
//
//  Zdjęcia pochodzą z Twojej stajni (folder /public/images). Podpisy i przypisania
//  koni do zdjęć są orientacyjne — do weryfikacji przez właściciela.
// ─────────────────────────────────────────────────────────────────────────────

import type { Album, EventItem, Horse, Offer, TimelineEntry } from '@/lib/types';

const YEAR_NOW = 2026;

function img(slug: string, alt: string, caption?: string, position = 0) {
  return {
    id: slug,
    url: `/images/full/${slug}.webp`,
    thumb: `/images/thumbs/${slug}.webp`,
    alt,
    caption,
    position,
  };
}

export const HERO_IMAGE = {
  url: '/images/full/hero.webp',
  alt: 'Konie nad wodą o zmierzchu na pastwisku stajni Tradycja Siedlnica',
};

export const seedHorses: Horse[] = [
  {
    id: 'h-cyprian',
    slug: 'cyprian',
    name: 'Cyprian',
    full_name: 'Cyprian (nazwa rodowodowa — do uzupełnienia)',
    status: 'na_sprzedaz',
    publish: 'opublikowany',
    featured: true,
    position: 1,
    birth_year: 2018,
    sex: 'walach',
    breed: 'koń wielkopolski',
    color: 'gniada',
    height_cm: 168,
    origin: 'hodowla własna',
    discipline: 'rekreacja, skoki',
    training_level: 'ujeżdżony, pracuje pod siodłem',
    temperament: 'ułożony, chętny do współpracy, pewny w kontakcie z człowiekiem',
    training_state: 'regularny trening; spokojny w terenie i na czworoboku',
    achievements: '',
    description:
      'Cyprian to zrównoważony wałach o dobrym ruchu i łagodnym charakterze. Sprawdza się w rekreacji i pracy na czworoboku, jest pewny w terenie. Dobry wybór dla jeźdźca szukającego uczciwego, ułożonego konia. (Opis przykładowy — do edycji w panelu.)',
    price: 'Cena na zapytanie',
    pedigree: {
      sire: 'ojciec — do uzupełnienia',
      dam: 'matka — do uzupełnienia',
      damsire: 'ojciec matki — do uzupełnienia',
      notes: 'Dane rodowodowe przykładowe — uzupełnij w panelu administratora.',
    },
    images: [
      img('cyprian-sylwetka', 'Gniady wałach Cyprian — sylwetka z profilu', 'Cyprian, sylwetka', 0),
      img('cyprian-portret', 'Portret gniadego konia Cyprian przy ogrodzeniu', undefined, 1),
      img('cyprian-stado', 'Cyprian wśród koni na pastwisku', undefined, 2),
      img('stajnia-pielegnacja', 'Pielęgnacja konia w stajni', undefined, 3),
    ],
    videos: [
      {
        id: 'v-cyprian-1',
        youtube_id: 'ScMzIvxBSi4',
        title: 'Prezentacja pod siodłem (film demonstracyjny — do podmiany)',
        description: 'Wklej własny link do filmu z YouTube w panelu administratora.',
        category: 'prezentacja',
        publish: true,
        position: 0,
      },
    ],
    seo_title: 'Cyprian — gniady wałach na sprzedaż | Tradycja Siedlnica',
    seo_description:
      'Cyprian — ułożony gniady wałach z hodowli Tradycja Siedlnica. Rekreacja i skoki. Cena na zapytanie.',
    updated_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 'h-wega',
    slug: 'wega',
    name: 'Wega',
    full_name: 'Wega (nazwa rodowodowa — do uzupełnienia)',
    status: 'na_sprzedaz',
    publish: 'opublikowany',
    featured: true,
    position: 2,
    birth_year: 2019,
    sex: 'klacz',
    breed: 'polski koń szlachetny półkrwi',
    color: 'siwa',
    height_cm: 165,
    origin: 'hodowla własna',
    discipline: 'ujeżdżenie, hodowla',
    training_level: 'w treningu podstawowym',
    temperament: 'wrażliwa, uważna, ułożona w codziennej obsłudze',
    training_state: 'praca na lonży i pod siodłem',
    description:
      'Wega to elegancka siwa klacz o dobrym pochodzeniu i szlachetnej sylwetce. Interesująca zarówno jako koń sportowy w typie ujeżdżeniowym, jak i materiał hodowlany. (Opis przykładowy — do edycji.)',
    price: 'Cena na zapytanie',
    pedigree: {
      sire: 'ojciec — do uzupełnienia',
      dam: 'matka — do uzupełnienia',
      notes: 'Dane rodowodowe przykładowe — uzupełnij w panelu administratora.',
    },
    images: [
      img('wega-padok', 'Siwa klacz Wega na padoku wśród młodych koni', 'Wega na padoku', 0),
      img('wega-okragla-ujezdzalnia', 'Konie przy okrągłej ujeżdżalni', undefined, 1),
      img('babel-zrebaki', 'Młode konie na pastwisku', undefined, 2),
    ],
    videos: [],
    updated_at: '2026-06-20T10:00:00Z',
  },
  {
    id: 'h-nokaut',
    slug: 'nokaut',
    name: 'Nokaut',
    full_name: 'Nokaut (nazwa rodowodowa — do uzupełnienia)',
    status: 'na_sprzedaz',
    publish: 'opublikowany',
    featured: true,
    position: 3,
    birth_year: 2016,
    sex: 'walach',
    breed: 'koń sportowy (SP)',
    color: 'kasztanowata',
    height_cm: 170,
    origin: 'hodowla własna',
    discipline: 'skoki przez przeszkody',
    training_level: 'regularny trening skokowy',
    temperament: 'odważny, skoncentrowany w pracy',
    training_state: 'skacze małe parkury treningowe, chętny do pracy',
    description:
      'Nokaut to ramowy kasztanowaty wałach z zadatkami do sportu skokowego. Odważny przed przeszkodą, uczciwy i pracowity. Kierowany do jeźdźca chcącego rozwijać konia w skokach. (Opis przykładowy — do edycji.)',
    price: 'Cena na zapytanie',
    pedigree: {
      sire: 'ojciec — do uzupełnienia',
      dam: 'matka — do uzupełnienia',
      notes: 'Dane rodowodowe przykładowe — uzupełnij w panelu administratora.',
    },
    images: [
      img('skok-przez-przeszkode', 'Kasztanowaty koń Nokaut w skoku przez przeszkodę', 'Nokaut w treningu skokowym', 0),
      img('nokaut-klus', 'Koń w kłusie na ujeżdżalni', undefined, 1),
    ],
    videos: [],
    updated_at: '2026-06-28T10:00:00Z',
  },
  {
    id: 'h-lord',
    slug: 'lord',
    name: 'Lord',
    status: 'na_sprzedaz',
    publish: 'opublikowany',
    featured: false,
    position: 4,
    birth_year: 2014,
    sex: 'walach',
    breed: 'kuc / koń rekreacyjny',
    color: 'gniada',
    height_cm: 148,
    origin: 'hodowla własna',
    discipline: 'rekreacja, nauka jazdy',
    training_level: 'spokojny koń szkolny',
    temperament: 'wyjątkowo łagodny, cierpliwy przy dzieciach',
    training_state: 'pracuje w rekreacji i nauce jazdy',
    description:
      'Lord to łagodny, cierpliwy koń idealny do nauki jazdy i spokojnej rekreacji. Pewny i opanowany, dobrze sprawdza się z mniej doświadczonymi jeźdźcami. (Opis przykładowy — do edycji.)',
    price: 'Cena na zapytanie',
    images: [
      img('lord-pastwisko', 'Gniady kuc Lord pasący się na pastwisku', 'Lord na pastwisku', 0),
      img('stajnia-korytarz', 'Korytarz stajni Tradycja Siedlnica', undefined, 1),
    ],
    videos: [],
    updated_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 'h-iskra',
    slug: 'iskra',
    name: 'Iskra',
    status: 'na_sprzedaz',
    publish: 'opublikowany',
    featured: false,
    position: 5,
    birth_year: YEAR_NOW,
    sex: 'zrebak',
    breed: 'hodowla własna',
    color: 'kasztanowata',
    origin: 'hodowla własna',
    discipline: 'materiał hodowlany / sportowy',
    temperament: 'ciekawska, ufna',
    description:
      'Iskra to tegoroczna klaczka o wyrazistej odmianie i dobrym ruchu. Wychowana w stadzie na dużych pastwiskach. Interesujący materiał na przyszłość. (Opis przykładowy — do edycji.)',
    price: 'Cena na zapytanie',
    images: [
      img('iskra-portret', 'Kasztanowata klaczka Iskra z odmianą na łące', 'Iskra', 0),
      img('iskra-profil', 'Profil źrebięcia na pastwisku', undefined, 1),
    ],
    videos: [],
    updated_at: '2026-07-05T10:00:00Z',
  },
  {
    id: 'h-babel',
    slug: 'babel',
    name: 'Bąbel',
    status: 'zarezerwowany',
    publish: 'opublikowany',
    featured: false,
    position: 6,
    birth_year: YEAR_NOW,
    sex: 'zrebak',
    breed: 'hodowla własna',
    color: 'gniada',
    origin: 'hodowla własna',
    discipline: 'materiał hodowlany / sportowy',
    temperament: 'żywy, towarzyski',
    description:
      'Bąbel to tegoroczny źrebak dorastający w stadzie. Aktualnie zarezerwowany. (Opis przykładowy — do edycji.)',
    price: 'Cena na zapytanie',
    images: [
      img('babel-zrebaki', 'Dwa źrebaki na pastwisku — Bąbel', 'Bąbel z rówieśnikiem', 0),
    ],
    videos: [],
    updated_at: '2026-07-04T10:00:00Z',
  },
  {
    id: 'h-aria',
    slug: 'aria',
    name: 'Aria',
    status: 'sprzedany',
    publish: 'opublikowany',
    featured: false,
    position: 7,
    birth_year: 2017,
    sex: 'klacz',
    breed: 'koń sportowy',
    color: 'gniada',
    discipline: 'skoki, rekreacja',
    description:
      'Aria znalazła już nowy dom. Dziękujemy za zaufanie. (Przykład konia sprzedanego — pokazuje działanie filtra „sprzedane”.)',
    price: 'Sprzedany',
    images: [
      img('nokaut-klus', 'Gniada klacz Aria w kłusie', 'Aria', 0),
    ],
    videos: [],
    updated_at: '2026-04-01T10:00:00Z',
  },
];

export const seedEvents: EventItem[] = [
  {
    id: 'e-dzien-otwarty',
    slug: 'trening-skokowy-dzien-otwarty',
    title: 'Trening skokowy — dzień otwarty',
    category: 'Dzień otwarty',
    date: '2026-09-12',
    location: 'Tradycja Siedlnica',
    cover: img('skok-przez-przeszkode', 'Koń w skoku podczas dnia otwartego'),
    excerpt:
      'Zapraszamy na otwarty trening skokowy — okazja, by zobaczyć nasze konie w pracy i porozmawiać o sprzedaży. (Wydarzenie przykładowe.)',
    body:
      'To przykładowy opis wydarzenia. W panelu administratora możesz wpisać program dnia, godziny, informacje dla odwiedzających oraz dodać zdjęcia i filmy. Wydarzenie może być powiązane z konkretnymi końmi, które biorą w nim udział.',
    results: '',
    gallery: [
      img('skok-przez-przeszkode', 'Skok przez przeszkodę', undefined, 0),
      img('nokaut-klus', 'Koń w kłusie', undefined, 1),
      img('lonzowanie-lekcja', 'Praca z koniem na lonży', undefined, 2),
    ],
    videos: [],
    horse_slugs: ['nokaut', 'cyprian'],
    publish: 'opublikowany',
    position: 0,
  },
  {
    id: 'e-prezentacja',
    slug: 'prezentacja-mlodych-koni',
    title: 'Prezentacja młodych koni',
    category: 'Prezentacja',
    date: '2026-06-05',
    location: 'Tradycja Siedlnica',
    cover: img('wega-padok', 'Młode konie na padoku'),
    excerpt:
      'Wiosenna prezentacja tegorocznych źrebiąt i młodzieży hodowlanej. (Wydarzenie przykładowe.)',
    body:
      'Przykładowy opis zakończonego wydarzenia. Dodaj tu relację, zdjęcia i — jeśli dotyczy — wyniki. Ten wpis pokazuje, jak wygląda archiwum wydarzeń.',
    results: '',
    gallery: [
      img('wega-padok', 'Konie na padoku', undefined, 0),
      img('babel-zrebaki', 'Źrebaki', undefined, 1),
      img('iskra-portret', 'Klaczka Iskra', undefined, 2),
    ],
    videos: [],
    horse_slugs: ['wega', 'iskra'],
    publish: 'opublikowany',
    position: 1,
  },
];

export const seedAlbums: Album[] = [
  {
    id: 'a-lato',
    slug: 'lato-na-pastwiskach',
    title: 'Lato na pastwiskach',
    description: 'Konie na rozległych pastwiskach stajni. (Album przykładowy.)',
    date: '2026-07-01',
    cover: img('konie-nad-woda', 'Konie nad wodą o zmierzchu'),
    images: [
      { id: 'g1', url: '/images/full/konie-nad-woda.webp', thumb: '/images/thumbs/konie-nad-woda.webp', alt: 'Konie nad wodą', position: 0 },
      { id: 'g2', url: '/images/full/lord-pastwisko.webp', thumb: '/images/thumbs/lord-pastwisko.webp', alt: 'Kuc na pastwisku', position: 1 },
      { id: 'g3', url: '/images/full/iskra-profil.webp', thumb: '/images/thumbs/iskra-profil.webp', alt: 'Źrebię na łące', position: 2 },
      { id: 'g4', url: '/images/full/wega-padok.webp', thumb: '/images/thumbs/wega-padok.webp', alt: 'Konie na padoku', position: 3 },
      { id: 'g5', url: '/images/full/cyprian-stado.webp', thumb: '/images/thumbs/cyprian-stado.webp', alt: 'Stado przy ogrodzeniu', position: 4 },
    ],
    publish: 'opublikowany',
    position: 1,
  },
  {
    id: 'a-stajnia',
    slug: 'codziennosc-w-stajni',
    title: 'Codzienność w stajni',
    description: 'Praca i pielęgnacja koni na co dzień. (Album przykładowy.)',
    date: '2026-06-15',
    cover: img('stajnia-korytarz', 'Korytarz stajni'),
    images: [
      { id: 'g6', url: '/images/full/stajnia-korytarz.webp', thumb: '/images/thumbs/stajnia-korytarz.webp', alt: 'Korytarz stajni', position: 0 },
      { id: 'g7', url: '/images/full/stajnia-pielegnacja.webp', thumb: '/images/thumbs/stajnia-pielegnacja.webp', alt: 'Pielęgnacja konia', position: 1 },
      { id: 'g8', url: '/images/full/lonzowanie-lekcja.webp', thumb: '/images/thumbs/lonzowanie-lekcja.webp', alt: 'Praca na lonży', position: 2 },
      { id: 'g9', url: '/images/full/nokaut-klus.webp', thumb: '/images/thumbs/nokaut-klus.webp', alt: 'Koń w kłusie', position: 3 },
    ],
    publish: 'opublikowany',
    position: 2,
  },
  {
    id: 'a-zrebaki',
    slug: 'zrebaki',
    title: 'Źrebaki',
    description: 'Tegoroczne źrebięta w stadzie. (Album przykładowy.)',
    date: '2026-06-20',
    cover: img('iskra-portret', 'Klaczka Iskra'),
    images: [
      { id: 'g10', url: '/images/full/iskra-portret.webp', thumb: '/images/thumbs/iskra-portret.webp', alt: 'Klaczka Iskra', position: 0 },
      { id: 'g11', url: '/images/full/iskra-profil.webp', thumb: '/images/thumbs/iskra-profil.webp', alt: 'Profil źrebięcia', position: 1 },
      { id: 'g12', url: '/images/full/babel-zrebaki.webp', thumb: '/images/thumbs/babel-zrebaki.webp', alt: 'Dwa źrebaki', position: 2 },
    ],
    publish: 'opublikowany',
    position: 3,
  },
];

export const seedOffers: Offer[] = [
  {
    id: 'o-sprzedaz',
    slug: 'sprzedaz-koni',
    title: 'Sprzedaż koni sportowych',
    excerpt: 'Konie z własnej hodowli — rekreacyjne, sportowe i materiał hodowlany.',
    body:
      'Oferujemy konie z własnej hodowli, przygotowane uczciwie i indywidualnie. Pomagamy dobrać konia do umiejętności i celów jeźdźca. Zapraszamy na prezentację na miejscu.',
    image: img('cyprian-sylwetka', 'Koń na sprzedaż'),
    benefits: ['Konie z własnej hodowli', 'Indywidualny dobór konia', 'Prezentacja na miejscu', 'Uczciwy opis i historia konia'],
    price: 'Cena na zapytanie',
    active: true,
    position: 1,
  },
  {
    id: 'o-hodowla',
    slug: 'hodowla',
    title: 'Hodowla',
    excerpt: 'Ponad 35 lat doświadczenia i około 100 koni.',
    body:
      'Hodowlę prowadzimy nieprzerwanie od 1989 roku. Stawiamy na zdrowie, charakter i użytkowość koni. Wiedza przekazywana przez lata pozwala nam odpowiedzialnie planować kolejne pokolenia.',
    image: img('wega-padok', 'Konie hodowlane na padoku'),
    benefits: ['Doświadczenie od 1989 roku', 'Około 100 koni', 'Odpowiedzialne kojarzenia'],
    active: true,
    position: 2,
  },
  {
    id: 'o-trening',
    slug: 'trening-koni',
    title: 'Trening koni',
    excerpt: 'Przygotowanie młodych koni i praca z końmi sportowymi.',
    body:
      'Prowadzimy trening koni — od zajeżdżania i pracy z młodzieżą po doskonalenie koni sportowych. Pracujemy spokojnie, z poszanowaniem tempa każdego konia.',
    image: img('nokaut-klus', 'Trening konia'),
    benefits: ['Zajeżdżanie młodych koni', 'Trening skokowy i ujeżdżeniowy', 'Przygotowanie do sprzedaży'],
    price: 'Cena ustalana indywidualnie',
    active: true,
    position: 3,
  },
  {
    id: 'o-jazdy',
    slug: 'jazdy-konne',
    title: 'Jazdy konne i nauka jazdy',
    excerpt: 'Jazdy dla początkujących i zaawansowanych.',
    body:
      'Zapraszamy na jazdy konne i naukę jazdy pod okiem instruktora. Spokojne, ułożone konie sprawiają, że nauka jest bezpieczna i przyjemna.',
    image: img('lonzowanie-lekcja', 'Lekcja jazdy konnej'),
    benefits: ['Zajęcia indywidualne', 'Spokojne konie szkolne', 'Nauka od podstaw'],
    price: 'Cena na zapytanie',
    active: true,
    position: 4,
  },
  {
    id: 'o-rekreacja',
    slug: 'rekreacja',
    title: 'Rekreacja',
    excerpt: 'Kontakt z końmi i wypoczynek na wsi.',
    body:
      'Oferujemy rekreacyjny kontakt z końmi w spokojnym, wiejskim otoczeniu. To dobra propozycja dla osób, które chcą odpocząć i spędzić czas blisko natury.',
    image: img('lord-pastwisko', 'Koń na pastwisku'),
    benefits: ['Spokojne otoczenie', 'Kontakt z końmi', 'Wypoczynek na wsi'],
    active: true,
    position: 5,
  },
  {
    id: 'o-pensjonat',
    slug: 'pensjonat',
    title: 'Pensjonat dla koni',
    excerpt: 'Opieka nad Twoim koniem w sprawdzonych warunkach.',
    body:
      'Przyjmujemy konie na pensjonat. Zapewniamy pastwiska, opiekę i codzienną obsługę. Szczegóły i dostępność miejsc — na zapytanie.',
    image: img('wega-okragla-ujezdzalnia', 'Ujeżdżalnia i padoki'),
    benefits: ['Duże pastwiska', 'Codzienna opieka', 'Dostęp do ujeżdżalni'],
    price: 'Cena na zapytanie',
    active: true,
    position: 6,
  },
];

export const seedTimeline: TimelineEntry[] = [
  {
    id: 't-1989',
    year: '1989',
    title: 'Początek',
    description:
      'Powstaje stajnia Tradycja Siedlnica. (Treść przykładowa — uzupełnij prawdziwą historię w panelu administratora.)',
    image: img('lord-pastwisko', 'Pastwiska stajni'),
    position: 0,
  },
  {
    id: 't-rozwoj',
    year: 'Lata późniejsze',
    title: 'Rozwój hodowli',
    description:
      'Hodowla rośnie, a doświadczenie przekazywane jest z pokolenia na pokolenie. (Treść przykładowa — do edycji.)',
    image: img('wega-padok', 'Konie na padoku'),
    position: 1,
  },
  {
    id: 't-dzis',
    year: 'Dziś',
    title: 'Około 100 koni',
    description:
      'Prowadzimy hodowlę, trening i sprzedaż koni sportowych, dbając o indywidualne podejście do każdego konia. (Treść przykładowa — do edycji.)',
    image: img('konie-nad-woda', 'Konie nad wodą'),
    position: 2,
  },
];
