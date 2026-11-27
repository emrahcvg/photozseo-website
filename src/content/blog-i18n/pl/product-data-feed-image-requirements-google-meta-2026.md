---
title: "Wymagania dotyczące obrazu w pliku danych produktów: Google Merchant Center i Meta Catalog (2026)"
description: "Specyfikacje obrazów dla kanałów Google Merchant Center i Meta Catalog: minimalna liczba pikseli, zalecany rozmiar, formaty, limity plików i przyczyny oflagowania obrazów."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center: JPEG, WebP, PNG, GIF, BMP lub TIFF do 16 MB; Minimum 500 x 500 px dla wszystkich produktów od 31 stycznia 2027 r.; Zalecana rozdzielczość 1500 x 1500 pikseli lub większa."
  - "Metakatalog: JPEG lub PNG, maksymalnie 8 MB, co najmniej 500 x 500 px; Dla Sklepów na Facebooku i Instagram zalecany jest kwadrat 1024 x 1024 px."
  - "Pojedynczy kwadratowy plik JPEG o wymiarach 1500 x 1500 pikseli z czystym tłem, bez nakładek tekstowych i znaków wodnych obsługuje oba kanały."
faqs:
  - q: "Jakie są wymagania dotyczące obrazu Google Merchant Center w 2026 roku?"
    a: "Użyj http/https image_link w formacie JPEG, WebP, PNG, GIF, BMP lub TIFF, do 16 MB i 64 megapikseli. Google zaleca rozmiar 1500 x 1500 px lub większy, a minimum 500 x 500 px obowiązuje dla wszystkich produktów od 31 stycznia 2027 r."
  - q: "Jaki jest minimalny rozmiar obrazu w metakatalogu?"
    a: "Specyfikacja danych produktów Meta wymaga, aby obraz główny miał rozmiar co najmniej 500 x 500 pikseli, w formacie JPEG lub PNG i wielkości poniżej 8 MB. W przypadku sklepów na Facebooku i Instagram Meta zaleca rozdzielczość 1024 x 1024 pikseli."
  - q: "Ile dodatkowych zdjęć mogę dodać do pliku danych o produktach?"
    a: "Link do dodatkowego_obrazu Google akceptuje do 10 dodatkowych obrazów. Odniesienie do pól katalogu Meta pozwala na dodanie do 50 dodatkowych adresów URL obrazów."
  - q: "Czy mogę użyć tego samego pliku obrazu dla Google Shopping i Meta?"
    a: "Zwykle tak. Kwadratowy plik JPEG o wymiarach 1500 x 1500 pikseli lub więcej, przedstawiający prawdziwy produkt na czystym tle, bez tekstu i znaków wodnych, jest zgodny z opublikowanymi zasadami obu platform."
  - q: "Dlaczego Meta lub Google flaguje mój obraz produktu?"
    a: "Najczęstszymi przyczynami są nałożony tekst, plakietki promocyjne, znaki wodne, obramowania, obrazy zastępcze, takie jak „obraz wkrótce”, obrazy, które są za małe, oraz adresy URL obrazów, które blokują roboty indeksujące lub nie odpowiadają typowi pliku."
---

Krótka odpowiedź: zarówno w przypadku Google Merchant Center, jak i Meta Catalog, wyślij kwadratowy plik JPEG o wymiarach co najmniej 1500 x 1500 pikseli, przedstawiający prawdziwy produkt na czystym tle, bez tekstu, plakietek i znaków wodnych. Twarda podłoga Google ma wymiary 500 x 500 px (dla wszystkich produktów od 31 stycznia 2027 r.), a Meta również 500 x 500 px, ale obie platformy zalecają większe pliki. Poniższe tabele podają dokładne liczby z dokumentacji każdej platformy.

*Ostatnia weryfikacja: listopad 2026. Źródła: Pomoc Google Merchant Center („Link do obrazu [link_do_zdjęcia]”, „Link do dodatkowego obrazu [link do dodatkowego_obrazu]”, „Jak naprawić: Obraz jest za mały”); Centrum pomocy Meta Business („Specyfikacje zdjęć produktów w katalogach”); Meta dla programistów („Pola katalogu”).*

## Google Merchant Center vs Meta Catalog: obok siebie

| Wymóg | Google Merchant Center | Metakatalog |
|---|---|---|
| Główne pole obrazu | `image_link` | `image_link` |
| Akceptowane formaty | JPEG, WebP, PNG, GIF, BMP, TIFF | JPG, PNG |
| Maksymalny rozmiar pliku | 16 MB (i 64 megapiksele) | 8 MB |
| Minimalny rozmiar | 500 x 500 px dla wszystkich produktów od 31.01.2027 (wcześniej: 100 x 100 px lub 250 x 250 px dla odzieży) | 500 x 500 pikseli |
| Zalecany rozmiar | 1500 x 1500 px lub większy | 1024 x 1024 px (Sklepy na Facebooku i Instagram) |
| Proporcje | Nie podano stałego współczynnika; Google może zastosować subtelne kadrowanie | Sklepy wyświetlają kwadrat 1:1; reklamy karuzelowe działają najlepiej, gdy wszystkie obrazy mają ten sam współczynnik (1:1 lub 4:5) |
| Dodatkowe obrazy | Do 10 (`additional_image_link`) | Do 50 (`additional_image_link`) |
| Oprawa produktu | Produkt powinien wypełniać około 75% do 90% obrazu | Zdjęcie główne powinno przedstawiać cały produkt |
| Reguły adresów URL | http/https, tylko ASCII, RFC 3986, od 1 do 2000 znaków | Użyj adresu URL bieżącego zdjęcia produktu |

Szczegółowe informacje na temat terminu realizacji Google można znaleźć w naszym wcześniejszym poście na temat [Zakupy Google Minimum 500 x 500 pikseli](/pl/blog/google-merchant-center-500px-image-requirement-2027).

## Co zmienia reguła Google 500 x 500 px?

Do 31 stycznia 2027 r. strona rozwiązywania problemów Google nadal zawiera listę niższych progów: 100 x 100 pikseli dla większości produktów i 250 x 250 pikseli dla odzieży. Po tym terminie dla każdej kategorii obowiązuje minimalna wielkość 500 x 500 px. Google stwierdza, że ​​obrazy poniżej minimum nie będą wyświetlane, chociaż sam produkt nie jest odrzucany. Google zauważa również, że reklamy produktowe w YouTube wymagają obrazów o wymiarach co najmniej 500 x 500 pikseli, aby wyświetlać się w telewizji.

Praktyczna konsekwencja: kanał zawierający miniatury o rozmiarze 300 pikseli nie spowoduje od razu zniszczenia Twoich ofert, ale produkty te stracą swój wizerunek tam, gdzie ma to znaczenie. Ponowny eksport z oryginałów zamiast zwiększania miniatury.

## Czego Meta wymaga od obrazów katalogowych?

Artykuł pomocy Meta zawiera następujące podstawowe informacje: co najmniej jeden obraz na produkt, w formacie JPEG lub PNG, maksymalnie 8 MB, a obraz musi dokładnie przedstawiać konkretny produkt na sprzedaż. W przypadku Sklepów na Facebooku i Instagram zdjęcia produktów są wyświetlane jako kwadrat (1:1), przy czym minimalna wielkość to 500 x 500 pikseli, a zalecana wielkość to 1024 x 1024 piksele.

Meta sugeruje również cztery lub więcej obrazów na produkt, wyraźny obraz główny przedstawiający cały produkt, połączenie kątów i zbliżeń, te same obrazy, co na Twojej stronie internetowej, białe tło i JPEG zamiast PNG w celu zapewnienia jakości obrazu.

### W jaki sposób Meta przycina obrazy z katalogu?

W Menedżerze sprzedaży (Ustawienia, następnie Katalog) możesz wybrać jeden z trzech trybów przycinania: wypełnij ramkę obrazem (domyślnie, który powiększa), pokaż cały obraz w ramce (może zostać dodany odstęp) lub przytnij i zmień rozmiar, aby dopasować go do ramki. Meta twierdzi, że obrazy nie są przycinane nigdzie indziej w sklepach na Instagram i wcale nie są przycinane w sklepach na Facebooku, z wyjątkiem ustawienia strony produktu Instagram. Jeśli Twój katalog łączy współczynniki proporcji, reklamy karuzelowe mogą je automatycznie dostosowywać; dostarczanie każdego obrazu w tym samym stosunku (1:1 lub 4:5) pozwala tego uniknąć.

## Dlaczego zdjęcia produktów są oznaczane lub odrzucane?

Obie platformy zgłaszają niemal identyczne problemy. Najpierw sprawdź swój kanał pod kątem tych:

| Problem | Google | Meta |
|---|---|---|
| Nakładki tekstowe, kody promocyjne, wezwania do działania | Niedozwolone (cena, wysyłka, tekst promocyjny) | Niezalecane (tekst nakładki, wezwania do działania, kody promocyjne) |
| Znaki wodne, dodane logo | Niedozwolone, chyba że stanowi fizycznie część produktu | Niezalecane |
| Obrazy zastępcze („obraz wkrótce”) | Niedozwolony | Unikać; nowe obrazy wymagają nowego adresu URL do odświeżenia |
| Granice | Niedozwolony | Nie wymienione w specyfikacji |
| Ogólna grafika zamiast produktu | Niedozwolone (wyjątki dla niektórych kategorii sprzętu, pojazdów i oprogramowania) | Obraz musi przedstawiać dokładny produkt |
| Za mały | Obraz nie pokazany (po 31 stycznia 2027 r.) | Poniżej 500 x 500 pikseli nie spełnia specyfikacji |
| Dostęp robota | Zezwalaj na Googlebota i obraz Googlebota w pliku robots.txt; zmiany zajmują od 24 do 48 godzin | Nie określono w specyfikacji |
| Niezgodność typu pliku | Rozszerzenie musi odpowiadać rzeczywistemu formatowi | Tylko JPEG lub PNG |

Dwie pułapki specyficzne dla paszy są łatwe do przeoczenia. Po pierwsze, Google potrzebuje stabilnych adresów URL bez parametrów dynamicznych, takich jak znaczniki czasu lub identyfikatory sesji. Po drugie, Meta odświeża zastąpiony obraz tylko wtedy, gdy nowy plik ma inny adres URL, więc nadpisanie `shoe.jpg` w miejscu nie spowoduje aktualizacji katalogu.

## Jeden eksport, który obsługuje oba pliki danych

1. Zacznij od oryginalnego, nieskompresowanego zdjęcia.
2. Eksportuj kwadrat 1:1 w rozdzielczości 1500 x 1500 pikseli lub większej jako JPEG (poniżej 8 MB, wygodnie poniżej obu limitów).
3. Trzymaj produkt w odległości około 75% do 90% klatki na czystym tle.
4. Usuń nakładki, plakietki, znaki wodne i obramowania z obrazu kanału; zachowaj promocyjne wersje reklam.
5. Użyj opisowej nazwy pliku i stabilnego, możliwego do przeszukania adresu URL.
6. Umieść dodatkowe kąty w `additional_image_link` (Google: do 10).

## Gdzie pasuje photoZseo

Jeśli przygotowujesz obrazy dla wielu rynków i kanałów, [zdjęcieZseo](/pl/download) na iPhone i iPad zmienia rozmiar, kompresuje i zmienia nazwy zdjęć produktów dla 46 rynków z jednego zdjęcia, a [Rozszerzenie Chrome](/pl/chrome-extension) robi to samo ze stron produktów z nazwami plików SEO i masowym eksportem. Nasz [przewodnik po rozmiarach obrazów na rynku](/pl/marketplace-image-sizes) wyświetla numery poszczególnych rynków.

*photoZseo nie jest powiązany ani wspierany przez żaden rynek, Google ani Meta. Przed przesłaniem dużego pliku zawsze sprawdź aktualne wytyczne platform.*
