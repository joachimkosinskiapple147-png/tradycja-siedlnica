-- ============================================================================
--  Tradycja Siedlnica — dane przykładowe (opcjonalne)
--  Uruchom PO schema.sql. Wypełnia moduł KONI przykładowymi końmi, aby panel
--  i strona miały treść. Zdjęcia wskazują na pliki z katalogu /public/images.
--
--  UWAGA: to treści DEMONSTRACYJNE — podmień je na prawdziwe w panelu /admin.
--  Ceny ustawiono na „Cena na zapytanie”, rodowody/osiągnięcia pozostają puste
--  (do uzupełnienia), aby nie tworzyć nieprawdziwych informacji.
-- ============================================================================

-- Czyszczenie wcześniejszych danych demo (po slugach)
delete from public.horses where slug in
  ('cyprian','wega','nokaut','lord','iskra','babel','aria');

with ins as (
  insert into public.horses
    (slug, name, full_name, status, publish, featured, position, birth_year, sex,
     breed, color, height_cm, origin, discipline, training_level, temperament,
     description, price)
  values
    ('cyprian','Cyprian', null, 'na_sprzedaz','opublikowany', true, 1, 2018,'walach',
     'Polski koń szlachetny półkrwi','gniada',168,'Hodowla własna','Skoki / rekreacja','Podstawy pod siodłem','Spokojny, chętny do pracy',
     'Zrównoważony wałach o dobrym ruchu, odpowiedni dla jeźdźców rozwijających umiejętności. (Opis przykładowy — do uzupełnienia.)','Cena na zapytanie'),
    ('wega','Wega', null, 'na_sprzedaz','opublikowany', true, 2, 2019,'klacz',
     'Polski koń szlachetny półkrwi','siwa',165,'Hodowla własna','Ujeżdżenie / rekreacja','Zajeżdżona','Łagodna, ułożona',
     'Klacz o eleganckim ruchu i przyjaznym charakterze. (Opis przykładowy — do uzupełnienia.)','Cena na zapytanie'),
    ('nokaut','Nokaut', null, 'na_sprzedaz','opublikowany', true, 3, 2016,'walach',
     'Koń sportowy','kasztanowata',170,'Hodowla własna','Skoki','Sportowy','Energiczny, uważny',
     'Wałach z predyspozycjami skokowymi. (Opis przykładowy — do uzupełnienia.)','Cena na zapytanie'),
    ('lord','Lord', null, 'niedostepny','opublikowany', false, 4, 2014,'walach',
     'Kuc','gniada',148,'Hodowla własna','Rekreacja / nauka jazdy','Ułożony','Bardzo spokojny',
     'Idealny do nauki jazdy dla dzieci i młodzieży. (Opis przykładowy — do uzupełnienia.)','Cena na zapytanie'),
    ('iskra','Iskra', null, 'na_sprzedaz','opublikowany', false, 5, 2026,'zrebak',
     'Polski koń szlachetny półkrwi','gniada',null,'Hodowla własna',null,null,'Ciekawska, żywa',
     'Źrebię z tegorocznego sezonu. (Opis przykładowy — do uzupełnienia.)','Cena na zapytanie'),
    ('babel','Bąbel', null, 'zarezerwowany','opublikowany', false, 6, 2026,'zrebak',
     'Polski koń szlachetny półkrwi','kara',null,'Hodowla własna',null,null,'Śmiały',
     'Źrebię o obiecującym ruchu. (Opis przykładowy — do uzupełnienia.)','Cena na zapytanie'),
    ('aria','Aria', null, 'sprzedany','opublikowany', false, 7, 2017,'klacz',
     'Koń sportowy','gniada',166,'Hodowla własna','Ujeżdżenie',null,'Wrażliwa',
     'Klacz sprzedana — pozostawiona jako przykład statusu „sprzedany”.','—')
  returning id, slug
)
insert into public.horse_images (horse_id, url, thumb, alt, position, is_cover)
select ins.id, i.url, i.thumb, i.alt, i.position, i.position = 0
from ins
join (values
  ('cyprian','/images/full/cyprian-portret.webp','/images/thumbs/cyprian-portret.webp','Cyprian — portret',0),
  ('cyprian','/images/full/cyprian-sylwetka.webp','/images/thumbs/cyprian-sylwetka.webp','Cyprian — sylwetka',1),
  ('cyprian','/images/full/cyprian-stado.webp','/images/thumbs/cyprian-stado.webp','Cyprian w stadzie',2),
  ('wega','/images/full/wega-padok.webp','/images/thumbs/wega-padok.webp','Wega na padoku',0),
  ('wega','/images/full/wega-okragla-ujezdzalnia.webp','/images/thumbs/wega-okragla-ujezdzalnia.webp','Wega na ujeżdżalni',1),
  ('nokaut','/images/full/nokaut-klus.webp','/images/thumbs/nokaut-klus.webp','Nokaut w kłusie',0),
  ('nokaut','/images/full/skok-przez-przeszkode.webp','/images/thumbs/skok-przez-przeszkode.webp','Nokaut w skoku',1),
  ('lord','/images/full/lord-pastwisko.webp','/images/thumbs/lord-pastwisko.webp','Lord na pastwisku',0),
  ('iskra','/images/full/iskra-portret.webp','/images/thumbs/iskra-portret.webp','Iskra — portret',0),
  ('iskra','/images/full/iskra-profil.webp','/images/thumbs/iskra-profil.webp','Iskra — profil',1),
  ('babel','/images/full/babel-zrebaki.webp','/images/thumbs/babel-zrebaki.webp','Bąbel — źrebię',0),
  ('aria','/images/full/wega-okragla-ujezdzalnia.webp','/images/thumbs/wega-okragla-ujezdzalnia.webp','Aria',0)
) as i(slug,url,thumb,alt,position) on i.slug = ins.slug;

-- Przykładowy film dla Cypriana
insert into public.horse_videos (horse_id, youtube_id, title, position)
select id, 'ScMzIvxBSi4', 'Cyprian — prezentacja (film przykładowy)', 0
from public.horses where slug = 'cyprian';

-- Rodowody — puste szkielety do uzupełnienia
insert into public.horse_pedigree (horse_id, notes)
select id, 'Rodowód do uzupełnienia.' from public.horses
where slug in ('cyprian','wega','nokaut')
on conflict (horse_id) do nothing;

-- Przykładowa wiadomość kontaktowa
insert into public.contact_messages (name, email, phone, subject, message, horse_slug, horse_name, status)
values
  ('Jan Przykładowy','jan@example.com','600100200','Zapytanie o konia: Cyprian',
   'Dzień dobry, jestem zainteresowany koniem Cyprian. Proszę o kontakt.','cyprian','Cyprian','nowa');
