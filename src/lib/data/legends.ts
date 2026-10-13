import type { Legend } from '@/lib/types';

function img(slug: string, alt: string, position = 0) {
  return { id: slug, url: `/images/full/${slug}.webp`, thumb: `/images/thumbs/${slug}.webp`, alt, position };
}

// Hall of fame: konie wyhodowane / wyszkolone u nas, dziś już w innych rękach.
// Profile startowe do edycji w panelu (tabela legends po migracji).
export const seedLegends: Legend[] = [
  {
    id: 'l-hetman', slug: 'hetman', name: 'Hetman',
    breed: 'polski koń szlachetny półkrwi', birth_year: 2008, color: 'gniada',
    years_at_stable: '2008 – 2015', where_now: 'Sport międzynarodowy (Niemcy)',
    achievements: 'Parkury 140 cm, starty międzynarodowe, zwycięzca Grand Prix regionów',
    story:
      'Urodzony na naszym pastwisku, zajeżdżony i wprowadzony do sportu w Siedlnicy. Odważny, uczciwy koń, który nauczył nas, że cierpliwa praca z młodym koniem wraca z nawiązką. Sprzedany do sportu, gdzie skacze do dziś.',
    image: img('skok-przez-przeszkode', 'Hetman w skoku — legenda stajni'),
    gallery: [img('skok-przez-przeszkode', 'Hetman w skoku'), img('nokaut-klus', 'Hetman w ruchu')],
    featured: true, position: 1, publish: 'opublikowany',
  },
  {
    id: 'l-saga', slug: 'saga', name: 'Saga',
    breed: 'koń wielkopolski', birth_year: 2005, color: 'siwa',
    years_at_stable: '2005 – 2020', where_now: 'Klacz-madka w hodowli partnerskiej',
    achievements: 'Matka trzech ogierów z licencją, babka medalistów czempionatów',
    story:
      'Królowa naszej hodowli. Dała nam pokolenia zdrowych, jezdnych koni — jej córki pracują dziś w sporcie i hodowli w całej Polsce. Wszystko, co najlepsze w naszej stadninie, ma w sobie krew Sagi.',
    image: img('wega-padok', 'Saga na padoku — matka stada'),
    gallery: [img('wega-padok', 'Saga'), img('babel-zrebaki', 'Potomstwo Sagi')],
    featured: true, position: 2, publish: 'opublikowany',
  },
  {
    id: 'l-orkan', slug: 'orkan', name: 'Orkan',
    breed: 'polski koń szlachetny półkrwi', birth_year: 2010, color: 'kara',
    years_at_stable: '2010 – 2018', where_now: 'Szkolenie młodych jeźdźców (ośrodek partnerski)',
    achievements: 'Medalista mistrzostw Polski w ujeżdżeniu, klasa C',
    story:
      'Kary elegant, który udowodnił, że konie z naszej hodowli tańczą, nie tylko skaczą. Po karierze sportowej został profesorem — uczy dzieci i juniorów, cierpliwy jak mało kto.',
    image: img('nokaut-klus', 'Orkan w kłusie — legenda ujeżdżenia'),
    gallery: [img('nokaut-klus', 'Orkan'), img('lonzowanie-lekcja', 'Orkan w pracy')],
    featured: true, position: 3, publish: 'opublikowany',
  },
];
