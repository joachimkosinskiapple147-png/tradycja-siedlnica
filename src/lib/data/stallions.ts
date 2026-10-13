import type { Stallion } from '@/lib/types';

function img(slug: string, alt: string, position = 0) {
  return { id: slug, url: `/images/full/${slug}.webp`, thumb: `/images/thumbs/${slug}.webp`, alt, position };
}

export const STANOWKA_INFO = {
  title: 'Stanówka ogierów',
  intro:
    'Nasze ogiery kryją na miejscu w Siedlnicy. Oferujemy krycie naturalne oraz nasienie świeże i mrożone — z pełną dokumentacją i opieką weterynaryjną.',
  season: 'Sezon: luty – lipiec',
  contact: 'Kontakt w sprawie krycia: 881 293 333',
};

// Prawidłowa nazwa w hodowli koni: STANÓWKA — miejsce, gdzie ogiery stacjonują
// i oferowane jest krycie / nasienie. Stąd zakładka "Stanówka".
export const seedStallions: Stallion[] = [
  {
    id: 's-wicher',
    slug: 'wicher',
    name: 'Wicher',
    full_name: 'Wicher (SP)',
    breed: 'polski koń szlachetny półkrwi',
    birth_year: 2015, color: 'gniada', height_cm: 171,
    pedigree: { sire: 'Contenderos', dam: 'Wizja po Lansjer', notes: 'Linia skokowa, potomstwo skacze parkury 120+.' },
    description:
      'Ogier skokowy o świetnej technice i odwadze. Daje potomstwo odważne, jezdne, z dobrym galopem. Kryje od 2021, źrebięta rosną w naszej stajni.',
    achievements: 'Starty 120 cm, licencja hodowlana PZHK, uznany reproduktor',
    covering_price: '1 800 zł + VAT (kycie naturalne) · nasienie świeże 900 zł',
    semen: 'świeże i mrożone',
    season: 'luty – lipiec',
    station: 'Stanówka Siedlnica — boksy kryciowe, pastwiska, wet. na miejscu',
    image: img('skok-przez-przeszkode', 'Ogier Wicher w skoku'),
    gallery: [img('skok-przez-przeszkode', 'Wicher w skoku'), img('nokaut-klus', 'Wicher w ruchu')],
    videos: [], featured: true, position: 1, publish: 'opublikowany',
  },
  {
    id: 's-cygan',
    slug: 'cygan',
    name: 'Cygan',
    full_name: 'Cygan (wlkp)',
    breed: 'koń wielkopolski',
    birth_year: 2013, color: 'kara', height_cm: 169,
    pedigree: { sire: 'Czador', dam: 'Cyganka po Ogar', notes: 'Równe, jezdne potomstwo — idealne do rekreacji i sportu amatorskiego.' },
    description:
      'Kary ogier o złotym charakterze. Daje spokojne, zdrowe źrebięta o dobrym ruchu. Polecany do klaczy rekreacyjnych i sportowych.',
    achievements: 'Próba dzielności zaliczona, potomstwo w treningu ujeżdżeniowym',
    covering_price: '1 200 zł + VAT · nasienie świeże 600 zł',
    semen: 'świeże',
    season: 'marzec – lipiec',
    station: 'Stanówka Siedlnica',
    image: img('cyprian-sylwetka', 'Ogier Cygan — sylwetka'),
    gallery: [img('cyprian-sylwetka', 'Cygan'), img('cyprian-stado', 'Cygan w stadzie')],
    videos: [], featured: true, position: 2, publish: 'opublikowany',
  },
  {
    id: 's-bursztyn',
    slug: 'bursztyn',
    name: 'Bursztyn',
    full_name: 'Bursztyn (SP)',
    breed: 'polski koń szlachetny półkrwi',
    birth_year: 2017, color: 'kasztanowata', height_cm: 168,
    pedigree: { sire: 'Biskwit', dam: 'Bara po Avondale', notes: 'Młody ogier, pierwsze roczniki bardzo obiecujące.' },
    description:
      'Młody, nowoczesny ogier w typie sportowym. Elastyczny ruch, świetny kłus — dobry wybór do klaczy ujeżdżeniowych.',
    achievements: 'Czempionat Młodych Koni — finał, licencja 2022',
    covering_price: '1 000 zł + VAT (promocja młodego ogiera)',
    semen: 'świeże i mrożone',
    season: 'luty – lipiec',
    station: 'Stanówka Siedlnica',
    image: img('nokaut-klus', 'Ogier Bursztyn w kłusie'),
    gallery: [img('nokaut-klus', 'Bursztyn'), img('lonzowanie-lekcja', 'Bursztyn w pracy')],
    videos: [], featured: true, position: 3, publish: 'opublikowany',
  },
];
