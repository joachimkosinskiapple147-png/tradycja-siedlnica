import type { Rider } from '@/lib/types';

function img(slug: string, alt: string, position = 0) {
  return { id: slug, url: `/images/full/${slug}.webp`, thumb: `/images/thumbs/${slug}.webp`, alt, position };
}

export const seedRiders: Rider[] = [
  {
    id: 'r-sylwester',
    slug: 'sylwester-kosinski',
    name: 'Sylwester Kosiński',
    role: 'Trener główny · skoki',
    specialty: 'Skoki przez przeszkody, przygotowanie młodych koni',
    experience: '35+ lat w siodle, hodowca od 1989',
    achievements: 'Wychowawca dziesiątek koni sportowych, zawodnik i trener skoków',
    description:
      'Założyciel stajni. Odpowiada za hodowlę, trening skokowy i dobór koni do jeźdźców. Spokojna, konsekwentna praca — konie mu ufają, a wyniki przychodzą z czasem.',
    image: img('cyprian-portret', 'Sylwester Kosiński — trener główny'),
    horse_slugs: ['nokaut', 'cyprian'],
    featured: true, position: 1, publish: 'opublikowany',
  },
  {
    id: 'r-natalia',
    slug: 'natalia-zielinska',
    name: 'Natalia Zielińska',
    role: 'Ujeżdżenie · młode konie',
    specialty: 'Ujeżdżenie, praca z młodzieżą hodowlaną',
    experience: '12 lat treningu, licencja PZJ',
    achievements: 'Medalistka zawodów regionalnych w ujeżdżeniu',
    description:
      'Prowadzi młode konie od lonży po pierwsze starty. Cierpliwa, dokładna, świetna z końmi wrażliwymi. Przygotowuje klacze hodowlane do prób dzielności.',
    image: img('wega-padok', 'Natalia Zielińska — ujeżdżenie'),
    horse_slugs: ['wega'],
    featured: true, position: 2, publish: 'opublikowany',
  },
  {
    id: 'r-kacper',
    slug: 'kacper-nowak',
    name: 'Kacper Nowak',
    role: 'Skoki · sprzedaż',
    specialty: 'Prezentacje koni sprzedażowych, parkury treningowe',
    experience: '8 lat w sporcie, luzak i jeździec testowy',
    achievements: 'Prezenter koni na pokazach i dniach otwartych',
    description:
      'Objeżdża konie sprzedażowe i pokazuje je kupującym — uczciwie, bez ukrywania. Doradzi, który koń pasuje do Twojego poziomu.',
    image: img('skok-przez-przeszkode', 'Kacper Nowak — skoki'),
    horse_slugs: ['cyprian', 'nokaut'],
    featured: true, position: 3, publish: 'opublikowany',
  },
  {
    id: 'r-zuzanna',
    slug: 'zuzanna-krawczyk',
    name: 'Zuzanna Krawczyk',
    role: 'Juniorzy · rekreacja',
    specialty: 'Nauka jazdy, konie szkolne, dzieci',
    experience: 'Instruktor rekreacji, 6 lat z dziećmi',
    achievements: 'Opiekunka sekcji juniorskiej stajni',
    description:
      'Uczy od zera — bezpiecznie i z humorem. Prowadzi jazdy dla dzieci i początkujących na najspokojniejszych koniach w stajni.',
    image: img('lord-pastwisko', 'Zuzanna Krawczyk — juniorzy'),
    horse_slugs: ['lord'],
    featured: true, position: 4, publish: 'opublikowany',
  },
];
