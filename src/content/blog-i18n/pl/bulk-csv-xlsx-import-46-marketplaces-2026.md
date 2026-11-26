---
title: "Zbiorczy import plików CSV/XLSX do 46 rynków — automatyczne wykrywanie 41 platform"
description: "Upuść eksport Shopify, Amazon lub Etsy do photoZseo. Wykrywamy 41 sygnatur platform, pobieramy zdjęcia równolegle i reeksportujemy do 46 rynków."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo akceptuje katalogi CSV, TSV, XLSX i JSON – i automatycznie wykrywa 41 sygnatur platform na podstawie nagłówków kolumn pliku."
  - "Zdjęcia produktów są pobierane równolegle z adresów URL w pliku. Przełącz opcję Wi-Fi tylko wtedy, gdy nie chcesz nagrywać danych komórkowych."
  - "Wyeksportuj ponownie ten sam katalog do 46 rynków, każdy z własnymi nazwami plików SEO, rozmiarami obrazów dostosowanymi do platformy i kolejnością kolumn."
faqs:
  - q: "Jakie formaty plików mogę importować do photoZseo?"
    a: "CSV, TSV, XLSX i JSON. Każda z nich może zawierać tytuły produktów, opisy, ceny, kody SKU, kody kreskowe i adresy URL zdjęć. Większość sprzedawców rezygnuje z istniejącego eksportu Shopify lub Amazon i całkowicie pomija mapowanie."
  - q: "Co w praktyce oznacza „automatyczne wykrywanie 41 sygnatur platform”?"
    a: "photoZseo sprawdza nagłówki kolumn pliku i dopasowuje je do 41 znanych schematów eksportu platformy — Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce i 33 innych. Jeśli Twój plik pochodzi z jednej z tych platform, mapowanie odbywa się automatycznie."
  - q: "Czy importowanie zdjęć z adresów URL powoduje wykorzystanie mojej mobilnej transmisji danych?"
    a: "Tylko jeśli na to pozwolisz. W ustawieniach importowania dostępna jest opcja przełącznika Tylko Wi-Fi, która jest domyślnie włączona. Po włączeniu pobieranie jest wstrzymywane i wznawiane automatycznie po zmianie sieci. Wyłączone, użyje aktywnego połączenia."
  - q: "Co się stanie, jeśli mój katalog będzie zawierał 5000 produktów?"
    a: "photoZseo importuje partiami i zapewnia responsywność interfejsu użytkownika. Pobieranie zdjęć z adresów URL odbywa się równolegle — praktycznym ograniczeniem jest przepustowość, a nie aplikacja. Katalog zawierający 5000 wierszy z adresami URL zdjęć zwykle trafia do standardowej domowej sieci Wi-Fi w ciągu 10–20 minut."
  - q: "Czy mogę ponownie wyeksportować na inny rynek niż źródło?"
    a: "Tak – o to właśnie chodzi. Zaimportuj katalog Shopify, kliknij eksport, wybierz Amazon (lub Etsy, lub Trendyol). photoZseo odbudowuje plik w dokładnej kolejności kolumn platformy docelowej, z obrazami o rozmiarze dostosowanym do specyfikacji tej platformy."
---

Najtrudniejszą częścią sprzedaży na nowym rynku nie jest rynek. Umożliwia umieszczenie w nim 800 istniejących produktów bez konieczności ponownego wpisywania każdego tytułu, ponownego przesyłania każdego zdjęcia i ponownego mapowania każdej kolumny.

Zbiorczy import katalogu photoZseo obsługuje podróż w obie strony. Wrzuć plik, który już posiadasz, i jesteś w 80% na drodze do nowej platformy.

## Dlaczego istnieje import zbiorczy

Jeśli jesteś sprzedawcą Amazon FBA i dodałeś Trendyol, sklepem Etsy rozwijającym się do TikTok Shop lub sklepem Shopify przechodzącym do Walmart, Twój katalog już istnieje. Wyeksportowałeś to raz. Problem polega na tym, że każda platforma używa nieco innego schematu — różne nazwy kolumn, różne specyfikacje obrazów, różne taksonomie produktów. Ręczna poprawka to godziny pracy w arkuszach kalkulacyjnych na nowy kanał.

photoZseo skraca czas do minut.

## Co zostaje zaimportowane

Importer odczytuje cztery formaty:

- CSV — eksport produktów Shopify, przesyłanie plików płaskich Amazon, szablony zbiorcze Trendyol.
- TSV — warianty z oddzielnymi zakładkami od starszych lub systemów wewnętrznych.
- XLSX — pliki Excel z katalogami wieloarkuszowymi.
- JSON — eksport API lub wewnętrzne kanały produktowe.

Każdy może zawierać tytuły, opisy, ceny, kody SKU, kody kreskowe, osie wariantów (rozmiar, kolor), zapasy i – co najważniejsze – adresy URL zdjęć. Kiedy już znajdziesz się w photoZseo, te same dane będą wykorzystywane do wyceny, eksportu i automatycznego uzupełniania SEO.

## Automatyczne wykrywanie na 41 platformach

Zabójczą funkcją nie jest obsługa formatu. To automatyczne wykrywanie.

photoZseo sprawdza nagłówki kolumn pliku i dopasowuje je do 41 znanych schematów eksportu platformy:

- Rynki zachodnie: Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- Turecki: Trendyol, Hepsiburada, N11
- Azja transgraniczna: AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- Ameryka Łacińska: Mercado Libre, Coupang
- Europa: Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...i 17 innych.

Jeśli Twój plik pochodzi z któregokolwiek z nich, photoZseo rozpoznaje go po upuszczeniu. Brak kreatora mapowania kolumn. Brak monitów „Co oznacza ten nagłówek”. To po prostu działa.

## Adresy URL zdjęć są pobierane równolegle

Większość eksportów katalogów obejmuje adresy URL zdjęć, a nie osadzone obrazy. photoZseo pobiera je równolegle — wiele połączeń, inteligentne ponawianie prób, deduplikacja skrótu percepcyjnego, dzięki czemu to samo zdjęcie produktu nie jest importowane dwukrotnie.

Domyślnie włączony jest przełącznik Tylko Wi-Fi. Z włączonym:

- Pobieranie jest wstrzymywane po opuszczeniu Wi-Fi i wznawiane po powrocie.
- Żadnych niespodzianek na rachunku za telefon komórkowy.
- Import 2000 produktów nie wyczerpie Twojego planu transmisji danych.

Po wyłączeniu photoZseo korzysta z aktywnego połączenia — przydatne przy biurku dzięki biurowej sieci Wi-Fi.

## Praktyczny przepływ pracy

Oto trasa w obie strony, którą obsługuje większość sprzedawców:

Krok 1 — Eksportuj z platformy źródłowej. Shopify, Amazon lub Etsy umożliwiają pobranie katalogu w formacie CSV/XLSX. Chwyć to.

Krok 2 — Upuść plik do photoZseo. Na iPhone naciśnij Importuj w dowolnym projekcie. W iPad przeciągnij go z Pliki. Funkcja automatycznego wykrywania identyfikuje platformę i rozpoczyna pobieranie adresów URL zdjęć w tle.

Krok 3 — Niech [AI wypełnia pola SEO](/features/seo-filenames). photoZseo zapisuje tytuł, informację, metaopis, tekst alternatywny, tagi i słowa kluczowe dla każdego produktu w 12 językach, jeśli prowadzisz sprzedaż międzynarodową.

Krok 4 — Eksportuj na nowy rynek. Wybierz miejsce docelowe — Amazon, Trendyol, Walmart, cokolwiek. photoZseo przepisuje plik w dokładnej kolejności kolumn na platformie, zmienia rozmiar obrazów zgodnie ze specyfikacją platformy i pakuje wynik w pojedynczy plik ZIP.

Krok 5 — Prześlij na nowy kanał. Plik wyjściowy jest gotowy dla dowolnego narzędzia do przesyłania zbiorczego używanego w miejscu docelowym.

To, co kiedyś było tygodniem pracy z arkuszem kalkulacyjnym, teraz stanowi 30-minutową przerwę na lunch.

## Dlaczego ma to znaczenie dla sprzedawców transgranicznych

Największą przeszkodą w ekspansji poza rynek krajowy jest koszt konwersji katalogu. Większość sprzedawców pozostaje przy Amazon US nie dlatego, że Amazon US jest najlepszy, ale dlatego, że przejście na Mercado Libre lub Trendyol oznacza przebudowanie katalogu od zera.

Import zbiorczy + 46 gotowych ustawień rynkowych usuwa tę blokadę. Do każdego kanału przepływają te same dane produktowe. Nowe rynki to przełącznik funkcji, a nie projekt.

Jest to odblokowanie dla niezależnych sprzedawców, którzy chcą wysyłać przesyłki na cały świat bez zatrudniania menedżera katalogu.
