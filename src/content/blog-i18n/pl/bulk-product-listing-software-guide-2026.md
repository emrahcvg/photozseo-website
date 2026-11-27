---
title: "Oprogramowanie do zbiorczych list produktów: jak działa przesyłanie plików CSV/XLSX na Amazon, eBay, Etsy, Shopify i Trendyol (2026)"
description: "Jak zbiorczo przesyłać produkty: szablon każdej platformy, wymagane pola i reguły adresu URL obrazu dla Amazon, eBay, Etsy, Shopify i Trendyol, a także lista kontrolna."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon i Trendyol akceptują przesyłanie arkuszy kalkulacyjnych. Etsy tego nie robi: w centrum pomocy jest napisane, że nie można zbiorczo przesyłać nowych wpisów, a jedynie zbiorczo edytować istniejące."
  - "Obrazy w arkuszu kalkulacyjnym prawie zawsze są adresami URL, a nie załączonymi plikami. Adres URL musi być publiczny, bezpośredni i (w modelach Shopify i eBay) zaczynać się od https://."
  - "Szablony różnią się w zależności od kategorii w Amazon, eBay i Trendyol, więc pobierz nowy szablon dla każdej kategorii i nigdy nie zmieniaj jego nagłówków."
faqs:
  - q: "Jak zbiorczo przesłać produkty do eBay?"
    a: "W Centrum sprzedawców przejdź do opcji Raporty, następnie Prześlij i wybierz opcję Pobierz szablon ze źródłem ofert. Wypełnij plik i prześlij go; eBay wyświetla listę elementów zgodnie ze specyfikacją. Użyj pliku CSV lub XLSX."
  - q: "Czy mogę zbiorczo przesyłać nowe wpisy do Etsy za pomocą pliku CSV?"
    a: "Centrum pomocy Etsy informuje, że nie można zbiorczo przesyłać nowych ofert, chociaż można je kopiować i zbiorczo edytować istniejące. Istnieją narzędzia innych firm, ale nie są one funkcją Etsy."
  - q: "Czy Shopify potrzebuje adresów URL obrazów w pliku CSV?"
    a: "Tak. Adresy URL obrazów w pliku CSV muszą być publicznie dostępne, zawierać https:// i nie być chronione hasłem. Shopify pobiera obrazy podczas importu."
  - q: "Jakiego kodowania plików powinien używać plik CSV produktu Shopify?"
    a: "Centrum pomocy Shopify prosi o kod UTF-8 z zakończeniami linii w stylu LF, oddzielonymi przecinkami, z nagłówkami w pierwszej linii. Sprawdź ustawienia eksportu aplikacji arkusza kalkulacyjnego."
  - q: "Gdzie mogę przesłać plik produktu Excel do Trendyol?"
    a: "W panelu sprzedawcy w zakładce Produkt, następnie Operacje zbiorcze produktów, korzystając z opcji wprowadzania produktów w Excelu i typu przesyłania Nowy produkt. Każda kategoria ma swój własny szablon."
  - q: "Dlaczego moje przesyłanie zbiorcze zostało odrzucone?"
    a: "Typowymi przyczynami są edytowane nagłówki kolumn, brak wymaganych pól, adresy URL obrazów prywatnych lub przekierowujących oraz szablon z niewłaściwej kategorii. Napraw plik i prześlij go ponownie."
---

Zbiorcze przesyłanie produktów oznacza przygotowanie arkusza kalkulacyjnego (CSV lub XLSX) zawierającego jeden wiersz na każdy produkt i przesłanie go raz, zamiast ręcznego tworzenia każdej oferty. eBay, Shopify, Amazon i Trendyol obsługują to; Etsy nie pozwala na masowe tworzenie nowych ofert. Dwie reguły powodujące większość niepowodzeń są wszędzie takie same: przechowuj nagłówki szablonu dokładnie takie, jakie zostały podane, i podawaj każdy obraz jako publiczny, bezpośredni adres URL.

*Ostatnia weryfikacja: listopad 2026 r. Sprawdzone źródła: Centrum pomocy Shopify, „Używanie plików CSV do importowania i eksportowania produktów”; Pomoc w Centrum sprzedawców eBay, „Tworzenie ofert zbiorczo” (Raporty Centrum sprzedawców > Prześlij); Centrum pomocy Etsy, „Czy mogę tworzyć lub edytować wiele aukcji jednocześnie?”; Pomoc Amazon Seller Central, „Szablony plików inwentarza” i „Problemy z obrazami” (czytaj we fragmentach wyszukiwania, patrz uwaga poniżej); Trendyol Akademi Satıcı Bilgi Merkezi, „Excel Ürün Girişi” i „Ürün Görseli Seçimi ve Yükleme” (czytaj fragmenty wyszukiwania).*

## Jak każda platforma radzi sobie z przesyłaniem zbiorczym?

| Platforma | Utworzyć zbiorczo? | Gdzie | Typ pliku | Reguła obrazu |
|---|---|---|---|---|
| Shopify | Tak | Produkty > Importuj | CSV, UTF-8, rozdzielone przecinkami | Publiczne adresy URL https:// |
| eBay | Tak | Centrum sprzedawcy > Raporty > Prześlij > Pobierz szablon | CSV lub XLSX | https:// adresy URL, maksymalnie 12 na wpis, oddzielone znakiem \ |  |
| Amazon | Tak | Dodaj produkty poprzez przesyłanie (Seller Central) | Szablon pliku inwentarza specyficznego dla kategorii | Bezpośredni adres URL; przekierowania i wyskakujące okienka są odrzucane |
| Trendyol | Tak | Produkt > Zbiorcze operacje na produktach > Wpis produktu w Excelu | Excel, jeden szablon na kategorię | Link w kolumnie Link do obrazu |
| Etsy | Nie (tylko edycja) | Menedżer sklepu > Oferty | Nie dotyczy | Nie dotyczy |

## Jak zbiorczo przesyłać produkty do Shopify?

Centrum pomocy Shopify ustala format: pierwsza linia musi zawierać nagłówki kolumn, kolumny są oddzielone przecinkami, a plik powinien mieć format UTF-8 z końcówkami linii LF. W przypadku nowych produktów wymagany jest tylko `Title`; jeśli używasz wariantów, wymagany jest również `URL handle`. Kolumny wariantów, takie jak SKU, również wymagają `Option1 name` i `Option1 value`, w przeciwnym razie Shopify tworzy domyślny wariant i usuwa istniejące podczas aktualizacji.

Obrazy muszą mieć publicznie dostępne adresy URL `https://` i nie być chronione hasłem. Shopify pobiera je podczas importu, dzięki czemu można je później usunąć. Nazwy plików obrazów nie mogą być edytowane po przesłaniu i nie mogą zawierać przyrostków `_thumb`, `_small` ani `_medium`. Filmy i modele 3D nie są obsługiwane w formacie CSV.

| Limit | Wartość (Centrum pomocy Shopify) |
|---|---|
| Opcje na produkt | 3 |
| Zdjęcia każdego produktu | 250 |
| Tagi na produkt | 250 |
| Tekst alternatywny | Maksymalnie 512 znaków, zalecane 125 lub mniej |
| Tytuł SEO | 70 znaków |
| Opis SEO | 320 znaków |

Znane przyczyny błędów z tej samej strony: plik zawierający kolumny `Barcode` i `Barcodes` kończy się niepowodzeniem; częściowy zestaw kolumn o wymiarach upakowanych kończy się niepowodzeniem; przy włączonym nadpisywaniu puste komórki usuwają istniejące wartości. Aby uzyskać głębsze porównanie z trasą API, zobacz [Shopify CSV vs API](/pl/blog/shopify-csv-vs-api-2026).

## Jak zbiorczo przesyłać oferty do eBay?

Obecnym narzędziem eBay są raporty z centrum sprzedawców. Przejdź do Prześlij, kliknij Pobierz szablon, wybierz źródło aukcji i typ pliku. XLSX jest ustawieniem domyślnym, a zaawansowanym sprzedawcom zaleca się CSV; plik do pobrania w formacie XLSX może zawierać do 10 kategorii, każda na osobnym arkuszu. Prześlij wypełniony plik, a eBay wyświetli listę elementów zgodnie ze specyfikacją.

Pola wymagane do dodania aukcji obejmują działanie, identyfikator kategorii, tytuł (maksymalnie 80 znaków), format, czas trwania, cenę wywoławczą, ilość, identyfikator stanu, opis i adres URL zdjęcia przedmiotu. Witryna amerykańska wymaga również kodu UPC (lub jego odpowiednika) w kolumnie odpowiadającej konkretnej pozycji, a kategorie książek wymagają numeru ISBN.

Adresy URL zdjęć muszą zaczynać się od `https://`, kończyć rozszerzeniem pliku, takim jak `.jpg` lub `.png`, mieć mniej niż 2048 znaków i zastępować spacje znakiem `%20`. W jednej aukcji możesz umieścić maksymalnie 12 obrazów oddzielonych kreską (`|`). Obrazy mogą być hostowane samodzielnie lub w usługach zdjęciowych eBay. W przypadku odmian wiersz nadrzędny pozostawia ilość i cenę puste, a każdy wiersz podrzędny ma swoje własne.

## Jak zbiorczo przesyłać produkty do Amazon?

Amazon wykorzystuje szablony plików zapasów specyficzne dla kategorii, wygenerowane na stronie Dodaj produkty poprzez przesłanie w Seller Central. W przypadku pozycji, których jeszcze nie ma w katalogu, korzystasz z szablonu produktu, który oznacza atrybuty jako wymagane, warunkowo wymagane lub zalecane. W przypadku artykułów znajdujących się już w katalogu możesz wyszukiwać według identyfikatora produktu i skorzystać z wstępnie wypełnionego pliku. Po przesłaniu wybierz pasujący typ pliku i przejrzyj raport przetwarzania dla każdego SKU.

W przypadku obrazów strona pomocy „Problemy z obrazami” Amazon informuje, że wyskakujące okienko lub adres URL przekierowujący nie zostaną zaakceptowane, a przesyłanie nie zostanie przetworzone, więc adres URL musi wskazywać bezpośrednio do pliku obrazu. Ścieżki menu i akceptowane typy plików różnią się w zależności od regionu rynku, dlatego postępuj zgodnie z instrukcjami zawartymi w pobranym szablonie. Aby zapoznać się z wymiarami obrazu, zobacz [Specyfikacje zdjęć produktów Amazon](/pl/blog/amazon-product-photo-specs-2026).

## Czy możesz przesłać zbiorczo do Etsy?

Nie dla nowych ogłoszeń. Centrum pomocy Etsy stwierdza, że ​​nie można zbiorczo przesyłać nowych wpisów i sugeruje utworzenie jednego wpisu i jego skopiowanie. Możesz zbiorczo edytować istniejące oferty w Menedżerze sklepu, w tym tytuły, tagi, opisy, ceny, opcje niestandardowe, profile przetwarzania i profile dostaw. Narzędzia, które rzekomo umożliwiają masowe tworzenie list Etsy, są produktami innych firm, a nie funkcją Etsy, więc samodzielnie sprawdź ich warunki i dostęp do API.

## Jak zbiorczo przesyłać produkty do Trendyol?

W panelu sprzedawcy otwórz Produkt, następnie Operacje zbiorcze produktów i skorzystaj z opcji wprowadzania produktów w Excelu. Centrum informacyjne sprzedawcy Trendyol opisuje jeden szablon na kategorię, oznaczony kodem kategorii i typem przesyłania „Yeni Ürün Ekle” (dodaj nowy produkt). Zdjęcia znajdują się w kolumnie Image Link (Görsel Linki). Trendyol dokumentuje również metodę galerii: najpierw prześlij obrazy do Galerii obrazów z nazwami plików równymi kodowi kreskowemu produktu (w przypadku kilku zdjęć, kod kreskowy_1, kod kreskowy_2), a następnie skopiuj te nazwy do kolumny. Nie zmieniaj formatu szablonu przed przesłaniem.

Treść panelu może ulec zmianie, więc potwierdź kroki względem szablonu na swoim własnym koncie sprzedawcy. Aby zapoznać się z zasadami dotyczącymi obrazów dla Trendyol i Hepsiburada, zobacz [Zdjęcia produktów Trendyol i Hepsiburada](/pl/blog/trendyol-hepsiburada-product-photos).

## Jakie są najczęstsze błędy podczas przesyłania zbiorczego?

1. Edytowano lub zmieniono nazwy nagłówków. Szablony są dopasowywane według tekstu nagłówka. Nie tłumacz ich ani nie zmieniaj ich kolejności.
2. Zły szablon kategorii. Szablony Amazon, eBay i Trendyol różnią się w zależności od kategorii.
3. Adresy URL obrazów, które nie są bezpośrednie. Nie udaje się utworzyć łącza do strony internetowej, przekierowania lub folderu chronionego loginem.
4. Spacje i znaki specjalne w adresach URL. Zakoduj spacje (eBay pyta o `%20`).
5. Nieprawidłowe kodowanie lub ogranicznik. Excel może eksportować średniki lub tekst inny niż UTF-8.
6. Zduplikowane lub brakujące identyfikatory (SKU, kod kreskowy, uchwyt URL).
7. Nadpisz niespodzianki. W Shopify puste komórki mogą usunąć istniejące dane.

## Lista kontrolna przed przesłaniem

- Pobierz nowy szablon dla każdej kategorii i platformy.
- Przetestuj z 5 rzędami przed pełnym katalogiem.
- Otwórz adres URL każdego obrazu w prywatnym oknie przeglądarki; powinien pokazać sam obraz.
- Sprawdź limity tytułów, opisów i tagów pod kątem aktualnych wytycznych platformy.
- Zachowaj kopię zapasową pliku źródłowego i raportu o błędach platformy.

## Gdzie pasuje photoZseo

Pliki przesyłane zbiorczo działają tylko tak samo, jak zawarte w nich obrazy i tekst. photoZseo przygotowuje zdjęcia produktów dla 46 rynków (zmiana rozmiaru, kompresja, nazwy plików SEO, usuwanie tła na urządzeniu) i eksportuje pliki CSV, XLSX lub JSON z aplikacji iPhone i iPad. Nie przechowuje obrazów ani nie przesyła ich do rynków, z wyjątkiem wysyłania produktów do Shopify. Pobierz aplikację na [strona pobierania](/pl/download). [Rozszerzenie Chrome](/pl/chrome-extension) robi to samo w przypadku stron produktów przeglądanych na komputerze.

*photoZseo nie jest powiązany ani wspierany przez żaden rynek. Nazwy rynkowe służą wyłącznie do opisania zgodności.*

*Uwaga: podczas weryfikacji nie można było otworzyć w całości stron Amazon Seller Central i Trendyol Akademi, więc szczegóły dotyczące tych dwóch platform pochodzą z fragmentów wyszukiwania na oficjalnych stronach. Zawsze sprawdzaj instrukcje dotyczące szablonu na swoim koncie.*
