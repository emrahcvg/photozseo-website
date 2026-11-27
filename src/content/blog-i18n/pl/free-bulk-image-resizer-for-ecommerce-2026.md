---
title: "Bezpłatny zbiorczy moduł zmiany rozmiaru obrazu dla e-commerce: na co zwrócić uwagę i jak to zrobić (2026)"
description: "Jak bezpłatnie grupowo zmieniać rozmiar zdjęć produktów dla Amazon, Etsy i Shopify: wbudowane narzędzia systemu operacyjnego, narzędzia przeglądarki i pułapki jakości, które psują oferty."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-resize, product-photos, image-size, e-commerce, free-tools]
tldr:
  - "Możesz bezpłatnie zmieniać rozmiar zdjęć produktów za pomocą narzędzi znajdujących się już na komputerze, ale zmiana rozmiaru jest najłatwiejsza. Brak kontroli nad przycięciem, kolorem i rozmiarem pliku powoduje nieprawidłowe wyświetlanie ofert."
  - "Rynki publikują różne zasady: Shopify mówi, że 2048 x 2048 pikseli zwykle wyświetla się najlepiej, Etsy prosi o co najmniej 2000 pikseli, Amazon woli więcej niż 1000 pikseli na najdłuższym boku."
  - "Wybierz narzędzie na podstawie tego, co zachowuje (proporcje obrazu, kolor sRGB, oryginalne pliki), a nie na podstawie liczby obrazów, które może obsłużyć."
faqs:
  - q: "Jaki jest najlepszy darmowy sposób zbiorczej zmiany rozmiaru zdjęć produktów?"
    a: "W przypadku jednorazowej partii wystarczą narzędzia wbudowane w system operacyjny lub narzędzie do zmiany rozmiaru oparte na przeglądarce. W przypadku powtarzającej się pracy na kilku rynkach poszukaj narzędzia, które zapisuje wstępne ustawienia rozmiarów dla poszczególnych rynków, dzięki czemu nie będziesz musiał za każdym razem ponownie wprowadzać wymiarów."
  - q: "Jaki rozmiar powinny mieć zdjęcia produktów dla Shopify?"
    a: "Centrum pomocy Shopify twierdzi, że kwadrat o wymiarach 2048 x 2048 pikseli zwykle wyświetla się najlepiej, akceptowane są obrazy o wymiarach do 5000 x 5000 pikseli (25 megapikseli) i rozmiarze poniżej 20 MB."
  - q: "Jaki rozmiar powinny mieć zdjęcia ofertowe Etsy?"
    a: "Artykuł pomocy Etsy zaleca co najmniej 2000 pikseli szerokości i wysokości oraz mówi, że pierwsze zdjęcie powinno mieć co najmniej 635 pikseli, aby nie zajmowało niższej pozycji w wyszukiwaniu."
  - q: "Czy zmiana rozmiaru zdjęcia obniża jego jakość?"
    a: "Zmniejszenie obrazu pozwala zachować jego ostrość, jeśli zostanie wykonane raz w stosunku do oryginału. Powiększanie małego obrazu powoduje pikselizację, a wielokrotne ponowne zapisywanie pliku JPEG dodaje artefakty kompresji, dlatego zawsze zmieniaj rozmiar oryginalnych plików."
  - q: "Czy do przesyłania plików z witryny Marketplace powinienem używać protokołu WebP czy JPEG?"
    a: "W przypadku platform handlowych używaj formatu JPEG, chyba że wytyczne mówią inaczej, ponieważ jest to powszechnie akceptowany format. WebP jest przydatny w Twoim własnym sklepie, gdzie Shopify wyświetla go jako zaakceptowany, ale najpierw sprawdź aktualne wytyczne każdego rynku."
  - q: "Czy bezpłatna zmiana rozmiaru zdjęć produktów jest bezpieczna?"
    a: "To zależy od tego, gdzie odbywa się przetwarzanie. Preferuj narzędzia działające na Twoim urządzeniu lub w przeglądarce i przeczytaj oświadczenie o ochronie prywatności przed przesłaniem niepublikowanych zdjęć produktów do serwisu internetowego."
---

Tak, możesz bezpłatnie zmieniać rozmiar zdjęć produktów. Wbudowane narzędzia komputera, bezpłatne narzędzia do zmiany rozmiaru oparte na przeglądarce i bezpłatne poziomy niektórych aplikacji obsługują całą partię w ciągu kilku minut. Najtrudniejszą częścią nie jest zmiana rozmiaru. Polega na wybraniu rozmiarów docelowych pasujących do każdego rynku, przy zachowaniu nienaruszonych proporcji i nie uszkadzaniu przy tym koloru ani rozmiaru pliku. W tym przewodniku szczegółowo opisano bezpłatne opcje, co sprawdzić w dowolnym narzędziu oraz tabelę ustawień, którą można skopiować.

*Ostatnia weryfikacja: listopad 2026. Źródła: Centrum pomocy Shopify („Nośniki produktu”), Centrum pomocy Etsy („Jak dodać zdjęcia do swoich ofert”), Amazon Seller Central („Wymagania techniczne dotyczące pliku obrazu”), Wsparcie Apple („Zmień formaty aparatu”). Rynki często zmieniają zasady, dlatego przed przesłaniem dużego pliku sprawdź bieżącą stronę.*

## O co właściwie proszą rynki?

Tylko kilka liczb jest niezmiennych, a kilka „zasad”, które widzisz w Internecie, to naprawdę rekomendacje.

| Platforma | Co mówi oficjalna strona | Źródło |
|---|---|---|
| Shopify | Kwadrat o wymiarach 2048 x 2048 pikseli zwykle wyświetla się najlepiej; do 5000 x 5000 px lub 25 megapikseli; poniżej 20 MB; Preferowane formaty PNG i JPEG, akceptowane są także WebP i HEIC | Centrum pomocy Shopify, „Nośniki produktu” |
| Etsy | Celuj w szerokość i wysokość co najmniej 2000 pikseli; pierwsze zdjęcie co najmniej 635 px; Akceptowane JPG, GIF, PNG, SVG, HEIC; pliki powyżej 1 MB mogą nie zostać przesłane przy wolnych połączeniach; użyj sRGB | Centrum pomocy Etsy, „Jak dodawać zdjęcia do swoich ofert” |
| Amazon | Preferuje obrazy większe niż 1000 pikseli na dłuższym boku w celu powiększenia; Zalecany format JPEG, akceptowane są formaty TIFF, PNG i GIF bez animacji | Amazon Seller Central, „Wymagania techniczne dotyczące pliku obrazu” |

W przypadku jakichkolwiek innych kwestii (minimów, maksimów, zasad obowiązujących w tle) sprawdź aktualne wytyczne platformy. Blogi stron trzecich często podają rekomendację jako sztywny limit. Jeśli potrzebujesz głębszego spojrzenia na pojedynczą platformę, zapoznaj się z naszymi przewodnikami na temat [Specyfikacje zdjęć Amazona](/pl/blog/amazon-product-photo-specs-2026) i [Shopify rozmiary obrazów](/pl/blog/shopify-product-image-size-2026).

## Jakie są bezpłatne sposoby zbiorczego zmieniania rozmiaru zdjęć?

| Opcja | Dobre dla | Uważaj na |
|---|---|---|
| Wbudowane narzędzia systemu operacyjnego (na przykład Preview w systemie macOS lub bezpłatny program PowerToys Image Resizer firmy Microsoft w systemie Windows) | Szybka zmiana rozmiaru folderu do jednego ustawionego rozmiaru, bez przesyłania | Zwykle jeden rozmiar docelowy na raz; ograniczona kontrola nad formatem i kompresją |
| Bezpłatne narzędzia do zmiany rozmiaru oparte na przeglądarce | Bez instalacji, na dowolnym urządzeniu | Sprawdź, czy pliki są przetwarzane lokalnie lub przesyłane; bezpłatne poziomy często ograniczają rozmiar partii lub dodają znaki wodne |
| Bezpłatne poziomy aplikacji i rozszerzeń | Presety Marketplace, zmiana nazwy, eksport w jednym kroku | Bezpłatne limity różnią się w zależności od produktu; przeczytaj je, zanim zaplanujesz wokół nich katalog |
| Wiersz poleceń lub skrypty | Tysiące obrazów, powtarzalne | Potrzebuje komfortu technicznego; łatwe nadpisywanie oryginałów |

Żaden z nich nie jest uniwersalnie najlepszy. Właściwy wybór zależy od tego, jak często to robisz i dla ilu rynków.

## Czego powinieneś szukać w zbiorczym narzędziu do zmiany rozmiaru?

Skorzystaj z tej listy kontrolnej, porównując dowolne narzędzie, bezpłatne lub płatne.

1. Przechowuje oryginały. Dane wyjściowe trafiają do nowego folderu. Zmiana rozmiaru w miejscu powoduje utratę jedynego pliku w pełnej rozdzielczości.
2. Zachowuje proporcje lub pozwala wybrać sposób dopasowania. Wymuszone przycinanie może odciąć krawędź produktu. Zdecyduj się między dopełnieniem kwadratowego płótna a przycięciem i sprawdź kilka wyników.
3. Konwertuje do sRGB. Etsy wyraźnie mówi, aby używać sRGB do obrazów internetowych. Zdjęcie w profilu szerokogamutowym może u niektórych widzów wyglądać na matowe lub przesycone.
4. Kontroluje format i jakość. Chcesz samodzielnie wybrać jakość JPEG, zamiast akceptować domyślną jakość, która powoduje rozdęcie lub zmiażdżenie pliku.
5. Obsługuje HEIC. iPhone'y mogą domyślnie zapisywać HEIC. Ustawienie Apple pozwala przełączyć się na „Najbardziej zgodne”, aby zapisać JPEG, ale stare zdjęcia są już w formacie HEIC, więc Twoje narzędzie powinno je przekonwertować.
6. Nie skaluje się po cichu. Wytyczne Etsy wskazują, że powiększanie może powodować pikselację. Narzędzie powinno ostrzegać lub pomijać małe pliki.
7. Zajmuje się prywatnością. Dowiedz się, czy zdjęcia opuszczają Twoje urządzenie.

## Jakie są najczęstsze pułapki jakości?

- Przycinanie produktu. Kwadratowe ustawienia wstępne odcinają długie produkty, takie jak dywaniki, plakaty i narzędzia. Pad zamiast przycinania, gdy obiekt dotyka ramki.
- Dane EXIF. Zdjęcia wykonane telefonem mogą zawierać dane o lokalizacji i urządzeniu. Usuwanie go przed publikacją jest rozsądnym nawykiem, chociaż niektóre narzędzia domyślnie go zachowują. Pamiętaj, że orientacja EXIF ​​​​również ma znaczenie: zdjęcie, które na telefonie wygląda pionowo, może wyglądać na obrócone po złej zmianie rozmiaru.
- Profil kolorów. Konwertuj na sRGB, jak powyżej. CMYK przeznaczony jest do druku, zgodnie z Etsy.
- Podwójna kompresja. Każde ponowne zapisanie JPEG traci trochę na jakości. Zmień rozmiar raz z oryginału, a nie z wcześniej wyeksportowanej kopii.
- Rozmiar pliku a błędy przesyłania. Etsy zauważa, że ​​pliki powyżej 1 MB mogą nie działać przy wolniejszych połączeniach, dlatego staraj się zachować równowagę pomiędzy ostrością i wagą.
- Przezroczyste pliki PNG. Etsy mówi, że przezroczyste obszary wydają się czarne. Przed przesłaniem spłaszcz na jednolitym tle.
- WebP kontra JPEG. WebP jest mniejszy przy podobnej jakości i Shopify to akceptuje, ale JPEG jest bezpiecznym, uniwersalnym wyborem dla rynków. Nasz [Porównanie WebP, JPEG i PNG](/pl/blog/webp-jpeg-png-product-photos-2026) sięga głębiej.

## Jakich ustawień należy użyć? (praktyczny stół)

Użyj ich jako punktu wyjścia, a następnie porównaj z aktualnymi wytycznymi platformy.

| Bramka | Najdłuższy bok | Format | Notatki |
|---|---|---|---|
| Twój własny sklep Shopify | 2048 pikseli (kwadrat 2048 x 2048) | JPEG lub WebP, jeśli chcesz mniejsze pliki | Nie przekraczaj limitów 5000 x 5000 px / 20 MB |
| Listy Etsy | 2000 pikseli lub więcej | JPG, sRGB | Zrób pierwsze zdjęcie krajobrazowe lub kwadratowe; zachowaj rozsądną wagę pliku |
| Główne obrazy Amazon | Znacznie powyżej 1000 pikseli | JPG | Sprawdź aktualne wytyczne dotyczące obrazów Amazon dotyczące reguł tła |
| Mistrz archiwum | Rozmiar oryginalny | Oryginalny | Nigdy nie zastępuj; zmienić rozmiar kopii |

## Prosty, bezpłatny przepływ pracy

1. Kopiuj oryginały do ​​folderu o nazwie „oryginały” i nigdy ich nie edytuj.
2. Wybierz docelowe rozmiary z powyższej tabeli.
3. Zbiorowa zmiana rozmiaru kopii do osobnego folderu na każdym portalu handlowym.
4. Sprawdź pięć obrazów: kadrowanie, orientacja, ostrość i kolor.
5. Przed przesłaniem zmień nazwę plików na opisową. Zobacz [jak nazwać zdjęcia produktów pod kątem SEO](/pl/blog/how-to-name-product-photos-for-seo).

## Gdzie pasuje photoZseo

Jeśli regularnie zmieniasz rozmiar dla kilku rynków, robienie tego ręcznie staje się powtarzalne. Aplikacja iOS i iPadOS firmy photoZseo (iOS 17+) zmienia rozmiar, kompresuje i zmienia nazwy zdjęć dla 46 rynków i ma bezpłatny plan; zobacz [wycena](/pl/pricing), aby zapoznać się z bieżącymi limitami planu. [Rozszerzenie Chrome](/pl/chrome-extension) działa na stronach produktów w Chrome 116+, z 82 profilami rozmiarów. Bezpłatna warstwa obejmuje 5 produktów i 10 zdjęć dziennie, a Twoje dane pozostają w przeglądarce. Żadne narzędzie nie zastępuje sprawdzania aktualnych zasad każdego rynku.

photoZseo nie jest powiązany ani wspierany przez żaden rynek. Nazwy rynkowe służą wyłącznie do opisu zgodności.
