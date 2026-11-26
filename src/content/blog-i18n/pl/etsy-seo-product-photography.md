---
title: "Etsy SEO: jak fotografia produktowa faktycznie podnosi rankingi"
description: "Dlaczego w Etsy zostaje znalezione właściwe zdjęcie — struktura nazw plików, tekst alternatywny i specyfikacje powiązane z robotem graficznym Etsy."
pubDate: 2026-05-09
readingMinutes: 4
tags: [etsy, seo, product-photos]
tldr:
  - "Etsy odczytuje nazwę pliku obrazu i tekst alternatywny jako sygnały rankingowe — `handmade-ceramic-mug-blue-front.jpg` pokonuje `IMG_4829.jpg` w przypadku tego samego produktu."
  - "Zacznij od rozdzielczości 2000×2000 pikseli w proporcjach 1:1 dla głównego obrazu — Etsy ponownie kompresuje przy przesyłaniu, więc podanie maksymalnego rozmiaru gwarantuje ostry wynik końcowy."
  - "Wypełnij wszystkie 10 miejsc na zdjęcia. Trzy, które poruszają igłą: czyste zdjęcie główne, zdjęcie w skali z rozpoznawalnym obiektem, zdjęcie detalu/tekstury uzasadniające cenę."
faqs:
  - q: "Jaki format nazwy pliku obrazu nagradza Etsy?"
    a: "Małe litery, łączniki (bez podkreśleń i spacji), słowo kluczowe produktu na początku, kierunek lub kąt na końcu, łącznie 3–6 słów. Przykład: `linen-bedding-set-queen-folded.jpg`. Etsy wyświetla nazwę pliku w źródle strony, a Google Images ją indeksuje, więc nazwa pliku służy również jako sygnał rankingowy wyszukiwania."
  - q: "Czy tekst alternatywny naprawdę wpływa na wyszukiwanie Etsy?"
    a: "Tak — własne centrum pomocy Etsy zaleca opisowy tekst alternatywny dla każdego obrazu. Tekst alternatywny jest indeksowany przez wyszukiwanie Etsy, udostępniany czytnikom ekranu (sygnał rankingu dostępności) i analizowany przez Google Images. Napisz to jak zdanie: „Niebieski, ręcznie wykonany kubek ceramiczny z matowym wykończeniem, widok z przodu na białym tle”."
  - q: "Czy Etsy obsługuje WebP dla zdjęć produktów?"
    a: "Etsy akceptuje przesyłanie plików JPEG i PNG. Konwertują wewnętrznie do formatów zoptymalizowanych pod kątem dostawy. PNG tylko, jeśli potrzebujesz przezroczystości (rzadko w przypadku zdjęć produktów). Bezpiecznym ustawieniem domyślnym jest JPEG w rozdzielczości 2000×2000, sRGB i jakości 85."
  - q: "Ile zdjęć powinna zawierać każda oferta Etsy?"
    a: "Etsy pozwala na 10 miejsc na zdjęcia, a puste miejsca korelują z niższą konwersją. Celuj w co najmniej 5: główny element na białym tle, skala z dłonią lub znanym przedmiotem, zbliżenie tekstury/szczegółów, styl życia w użyciu oraz wariant opakowania lub skali. Resztę uzupełnij wariantami kąta i koloru."
  - q: "Czy mogę ponownie wykorzystać zdjęcia Amazon na Etsy?"
    a: "Zdjęcie główne tłumaczy — obie platformy nagradzają czysty obraz główny z produktem w 85% klatki. Jednak nabywcy Etsy oczekują więcej kontekstu związanego ze stylem życia: ręcznie robione, oparte na historii zdjęcia konsekwentnie przewyższają sterylne zdjęcia katalogowe, szczególnie na Etsy. Predefiniowane ustawienie Etsy w photoZseo automatycznie stosuje rozmiar Etsy (2000×2000, 1:1), dzięki czemu możesz wymieniać zdjęcia w ciągu kilku sekund."
---

Algorytm wyszukiwania Etsy nie jest Google. Opiera się w dużej mierze na tytule, tagach i jakości wpisu – ale SEO obrazu to cichy mnożnik. Kiedy dwie oferty są równie trafne, Etsy wyświetla tę, którą kupujący faktycznie klikną, a kliknięcie zależy od pierwszego zdjęcia.

Oto, co porusza igłą w 2026 roku.

## Sztuczka z nazwą pliku

Etsy wyświetla nazwę pliku obrazu aukcji w źródle strony. Następnie Google Images przeszukuje go. Plik o nazwie `IMG_4829.jpg` nic nie mówi o wyszukiwaniu; `handmade-ceramic-mug-blue-front.jpg` przekazuje Etsy *i* Google dokładnie to, co jest na zdjęciu.

Wygrywa format:

- Tylko małe litery
- Łączniki, bez podkreśleń i spacji
- Najpierw słowo kluczowe dotyczące produktu, na końcu znacznik kierunku
- Maksymalnie 3–6 słów

Silnik nazw plików SEO photoZseo generuje je na podstawie nazwy produktu oraz znacznika kierunku wybranego podczas fotografowania.

## Specyfikacje obrazu preferuje Etsy

- Wymiary: 2000×2000 pikseli. Etsy ponownie kompresuje podczas przesyłania, więc rozpoczęcie od maksimum platformy oznacza, że ​​ostateczny obraz na liście nie zostanie dwukrotnie zmiękczony.
- Współczynnik proporcji: 1:1 dla miniatury. Obrazy wtórne mogą mieć format 4:3 lub 3:4 — przykuwają one całą uwagę na stronie aukcji.
- Format: JPEG lub PNG. PNG tylko jeśli potrzebujesz przezroczystości (prawie nigdy tego nie robisz na Etsy).
- Tło: W przeciwieństwie do Amazon, Etsy umożliwia wyświetlanie zdjęć lifestylowych jako głównego obrazu. Jednak czyste, białe lub neutralne tło nadal radzi sobie lepiej z zagraconymi scenami w większości kategorii — zwłaszcza ręcznie robionej biżuterii, ceramiki i wyrobów skórzanych.

## Tekst alternatywny jest sygnałem rankingowym

Tekst alternatywny nie jest widoczny dla kupujących, ale jest widoczny dla drzewa dostępności i robotów wyszukiwarek. Własne centrum pomocy Etsy zaleca opisowy atrybut alt dla każdego obrazu aukcji.

Co działa:

> *"Niebieski, ręcznie wykonany kubek ceramiczny z matowym wykończeniem, widok z przodu na białym tle"*

Co nie:

> *"kubek"*

photoZseo zapisuje tekst alternatywny z tej samej pary nazwa produktu + kierunek, który steruje nazwą pliku. Każdy eksportowany obraz zawiera tekst alternatywny w metadanych XMP, a eksport Shopify CSV photoZseo automatycznie kopiuje go do pola alt. W przypadku Etsy wklej sugerowany tekst alternatywny w polu „Opis zdjęcia” podczas dodawania obrazu.

## Formuła 3 zdjęć, która konwertuje

Etsy pozwala na umieszczenie do 10 zdjęć na aukcji. Dane z podręcznika sprzedawcy Etsy i zewnętrznych testów A/B są zbieżne w tej samej trójce:

1. Zdjęcie główne — skupione na produkcie, czyste tło, 85% kadru.
2. Zdjęcie w skali — produkt obok dłoni, książki lub innego przedmiotu, który kupujący rozpoznaje po wielkości.
3. Zdjęcie szczegółowe — tekstura, okucia, szwy — to, co uzasadnia cenę.

Wszystko po trzecim obrazie maleje, ale i tak je wypełnia. Puste miejsca na zdjęcia korelują z niższą konwersją.

## Test trwający 60 sekund

Zanim opublikujesz, zapytaj:

- Czy to zdjęcie wyświetliłoby się w wyszukiwaniu obrazów Google dla hasła *„niebieski kubek ceramiczny”*?
- Czy nazwa pliku brzmi jak tytuł produktu?
- Czy tekst alternatywny opisuje, co chciałby wiedzieć niedowidzący kupujący?

Jeśli tak dla wszystkich trzech, lista robi to, co nagradza algorytm Etsy i robot Google.
