---
title: "Pakiet obrazów produktów dostawców dla sprzedawców detalicznych: jak je zbudować w 2026 r"
description: "Jak dostawcy tworzą pakiet obrazów produktów dla sprzedawców: struktura folderów, nazewnictwo plików, poziomy rozmiarów, informacja o prawach do użytkowania i plik CSV z mapowaniem SKU."
pubDate: 2026-11-27
readingMinutes: 7
tags: [supplier, image-pack, wholesale, product-data, retailers]
tldr:
  - "Dobry pakiet obrazów dostawcy to trzy rzeczy do pobrania w jednym pliku: zdjęcia, plik CSV łączący każdy plik z jednostką SKU i krótka informacja o prawach użytkowania. Bez pliku CSV sprzedawcy zgadują, które zdjęcie należy do którego produktu."
  - "Wysyłaj zdjęcia w dwóch lub trzech rozmiarach na zdjęcie (wzorzec, wersja gotowa do publikacji w internecie i miniatura) z jedną regułą nazewnictwa, dzięki czemu sprzedawca detaliczny może umieścić pliki bezpośrednio na rynku lub w sklepie bez konieczności edytowania."
  - "Określ prostymi słowami, co sprzedawcy mogą zrobić z obrazami. Pisemna zgoda eliminuje najważniejszy powód, dla którego sprzedawcy detaliczni wahają się przed wykorzystaniem zdjęć dostawców."
faqs:
  - q: "Co dostawca powinien uwzględnić w pakiecie zdjęć produktu?"
    a: "Umieść zdjęcia w przewidywalnej strukturze folderów, pliku CSV lub arkuszu kalkulacyjnym, który mapuje każdy plik na jednostkę SKU i kod kreskowy, krótką notatkę dotyczącą praw do użytkowania oraz plik Readme z regułą nazewnictwa. Dodaj datę wersji, aby sprzedawcy wiedzieli, który pakiet jest aktualny."
  - q: "Jak nazwać pliki obrazów produktów dla sprzedawców?"
    a: "Użyj jednej reguły dla każdego pliku, zbudowanej z jednostki SKU i kodu widoku, na przykład SKU-12345_front.jpg i SKU-12345_side.jpg. Małe litery, cyfry, łączniki i podkreślenia to najbezpieczniejsze znaki, a kod SKU umożliwia powiązanie pliku z cennikiem."
  - q: "Czy sprzedawca może przesłać mój pakiet obrazów bezpośrednio do Amazon, Trendyol lub Shopify?"
    a: "Często tak w przypadku obrazów, ale każda platforma ma własne zasady dotyczące rozmiaru i tła, które zmieniają się z czasem. Sprawdź aktualne wytyczne na każdej platformie lub daj sprzedawcom pakiet dostosowany już do kanałów, z których korzystają."
  - q: "Czy muszę udzielać resellerom pozwolenia na wykorzystywanie zdjęć moich produktów?"
    a: "Jest to zdecydowanie wskazane. Jak wyjaśnia amerykański Urząd ds. Praw Autorskich, zdjęcia są chronione prawem autorskim od razu po ich utworzeniu, dlatego sprzedawcy detaliczni nie mogą zakładać, że korzystanie ze zdjęcia jest bezpłatne. Krótka pisemna zgoda pozwala uniknąć nieporozumień. Poproś prawnika o sprawdzenie brzmienia obowiązującego w Twoim kraju."
  - q: "Jak często powinienem aktualizować rozproszony pakiet obrazów?"
    a: "Aktualizuj go za każdym razem, gdy zmieni się opakowanie, kolor lub sam produkt, a także za każdym razem, gdy dodasz SKU. Umieść datę lub numer wersji w nazwie pakietu i powiedz sprzedawcom, co się zmieniło, aby stare zdjęcia nie pozostawały w aktywnych ofertach."
---

Pakiet obrazów dostawcy to zestaw zdjęć produktów do pobrania, uporządkowany według SKU, zawierający plik danych informujący, które zdjęcie należy do jakiego produktu, oraz krótką informację o tym, jak sprzedawcy mogą z nich korzystać. Sprzedawcy detaliczni, którzy mogą załadować Twoją paczkę bezpośrednio do sklepu lub na rynek, szybciej wystawiają Twoje produkty na sprzedaż, popełniają mniej błędów i są bardziej skłonni do ponownego zamówienia. W tym przewodniku omówiono praktyczną strukturę pakietu, zasadę nazewnictwa, poziomy rozmiarów, uwagi dotyczące użytkowania i plik CSV, który je łączy.

*Ostatnia weryfikacja: listopad 2026 r. Sprawdzone źródła: U.S. Copyright Office (Najczęstsze pytania dotyczące praw autorskich), Centrum pomocy Shopify (Korzystanie z plików CSV do importowania i eksportowania produktów), ICC (strona z zasadami Incoterms 2020).*

## Dlaczego sprzedawcy detaliczni proszą o pakiet obrazów

Wyobraź sobie dostawcę oferującego na przykład 300 jednostek SKU przyborów kuchennych. W każdym sezonie dwudziestu sprzedawców detalicznych wysyła te same e-maile: „Czy możesz przesłać zdjęcia nowych kolorów?” „Który plik to patelnia 24 cm?” „Czy pokrywa widoczna na zdjęciu jest w zestawie?” Dostawca odpowiada linkiem do dysku współdzielonego, nazwami plików typu IMG_4821.jpg i cennikiem w innej kolejności niż foldery.

Następnie sprzedawca spędza godziny na ręcznym dopasowywaniu zdjęć do rzędów. Błędy są prawie gwarantowane: niewłaściwy kolor na niewłaściwej aukcji, zestaw sfotografowany z akcesoriami, których nie zawiera SKU, i to samo zdjęcie przesłane pod dwoma produktami. Pakiet usuwa tę pracę i przenosi ją do strony, która najlepiej zna produkt, czyli do dostawcy.

## Co znajduje się w pakiecie

| Przedmiot | Co to jest? | Dlaczego sprzedawcy detaliczni tego potrzebują |
|---|---|---|
| Zdjęcia autorstwa SKU | Jeden folder na jednostkę SKU lub jeden płaski folder z jednostką SKU w każdej nazwie pliku | Szybki import i brak zgadywania |
| Dane produktu CSV | Jeden wiersz na każdą jednostkę SKU: nazwa, kod kreskowy, kolor, rozmiar i nazwy plików obrazów | Przyporządkowuje zdjęcia do produktów i cennika |
| Uwaga dotycząca praw do użytkowania | Jedna strona: co sprzedawcy mogą, a czego nie mogą robić | Usuwa pytanie o pozwolenie |
| Przeczytaj | Zasada nazewnictwa, poziomy rozmiarów, data pakowania | Umożliwia nowemu pracownikowi korzystanie z pakietu samodzielnie |
| Zmień dziennik | Co zostało dodane lub zastąpione od ostatniego opakowania | Sprzedawcy aktualizują tylko to, co się zmieniło |

Zachowaj małą wersję pierwszej wersji. Pakiet, który obejmuje 50 najlepszych SKU i jest dokładny, jest bardziej przydatny niż pełne archiwum, które jest w połowie nieaktualne.

## Reguła nazewnictwa, w której sprzedawcy detaliczni mogą sortować i wyszukiwać

Użyj jednego wzorca dla każdego pliku i zapisz go w pliku Readme. Prostą, czytelną formą jest SKU, następnie kod widoku, a następnie opcjonalny kod koloru:

- SKU-12345_front.jpg
- SKU-12345_side.jpg
- SKU-12345_back-red.jpg
- SKU-12345_detail-handle.jpg

Zasady, których warto przestrzegać: tylko małe litery, cyfry, łączniki i podkreślenia; bez spacji i znaków akcentowanych, ponieważ niektóre systemy przesyłania i systemy operacyjne źle je obsługują; brak słów „ostateczny”, „nowy” i „kopia” w nazwach. Ponieważ nazwa SKU jest na czele, pliki są sortowane obok siebie i można je łatwo dopasować do cennika za pomocą prostego wyszukiwania.

W przypadku wyszukiwarek pomocne są opisowe nazwy plików, ale pakiet dostawcy jest plikiem źródłowym. Wielu sprzedawców detalicznych po opublikowaniu zmieni nazwę na własną nazwę słowa kluczowego. Nasz przewodnik po [jak nazwać zdjęcia produktów pod kątem SEO](/pl/blog/how-to-name-product-photos-for-seo) pokazuje, jak wygląda ten drugi krok, dzięki czemu wiesz, dlaczego czysty oryginał oparty na SKU jest najlepszym punktem wyjścia.

## Poziomy rozmiaru: główny, internetowy i miniaturowy

Marketplace zmienia swoje zasady dotyczące obrazów, więc nie próbuj wstępnie dopasowywać jednego pliku do każdej platformy. Zamiast tego nadaj każdemu zdjęciu kilka poziomów i powiedz sprzedawcom, skąd pochodzi. Poniższe liczby stanowią sugerowany zestaw początkowy, a nie wymagania dotyczące platformy.

| Szczebel | Sugerowane zastosowanie | Sugerowana specyfikacja (wybór dostawcy) |
|---|---|---|
| Gospodarz | Archiwizuj i ponownie kadruj | Oryginalny lub wysokiej rozdzielczości plik JPEG lub PNG, bez dużej kompresji |
| Sieć | Sklep i większość rynków | Płótno kwadratowe, długa krawędź około 2000 px, JPEG |
| Zwięzły | Listy, cytaty, katalogi | Około 600 px na dłuższej krawędzi |

Jeśli wiesz, że Twoi sprzedawcy sprzedają na określonej platformie, dodaj folder dostosowany do niej. Najpierw sprawdź aktualne wytyczne dla sprzedawców na każdej platformie. Aby zapoznać się z oczekiwaniami kilku rynków, zobacz [rozmiary obrazów na rynku](/pl/marketplace-image-sizes). Wartości pikseli zmieniają się, więc strona zawiera linki do miejsca, z którego pochodzą, zamiast obiecywać, że są trwałe.

## Spójność zdjęć jest ważniejsza niż rozdzielczość

Paczka sfotografowana w różne dni przy różnym świetle wygląda źle na stronie sprzedawcy, nawet jeśli każdy plik jest ostry. Przed fotografowaniem popraw trzy rzeczy: tło (białe lub jasnoszare, takie same dla całej gamy), ustawiony kąt aparatu (np. przód, bok, tył, detal, skala) i kadrowanie, aby produkt zajmował podobną część kadru. Użyj statywu lub stałej odległości. Stały zestaw kątów powstrzymuje również sprzedawców od proszenia Cię o „jeszcze jedno zdjęcie”.

W przypadku wariantów sfotografuj każdy kolor w tej samej pozycji i nazwij go kodem koloru. Nie fotografuj jednego koloru i poproś sprzedawców, aby zmienili go w edytorze.

## Uwaga dotycząca praw użytkowania

Zdjęcia są chronione prawem autorskim od chwili ich powstania. Często zadawane pytania Urzędu ds. Praw Autorskich Stanów Zjednoczonych mówią, że utwór podlega ochronie od chwili jego stworzenia i utrwalenia w formie materialnej, a rejestracja jest dobrowolna. Oznacza to, że sprzedawca nie może bezpiecznie założyć, że Twoje pliki są dla niego bezpłatne, a dobry sprzedawca o to zapyta. Krótka notatka odpowiada na to z góry.

Co zazwyczaj obejmuje notatka, napisana własnymi słowami i sprawdzona przez prawnika w Twoim kraju:

1. Kto jest właścicielem zdjęć (ty lub fotograf posiadający licencję).
2. Kto może z nich korzystać (autoryzowani sprzedawcy, o ile posiadają w magazynie Twoje produkty).
3. Gdzie (własny sklep, targowiska, posty społecznościowe, drukowane katalogi).
4. Co mogą zmienić (zmiana rozmiaru, przycięcie i zmiana nazwy, ale nie dodawanie wprowadzającego w błąd tekstu lub logo innych marek).
5. Co się stanie, gdy związek się zakończy (usuń zdjęcia w rozsądnym terminie).

To jest narzędzie komunikacji, a nie porada prawna. Jeśli Twoje zdjęcia przedstawiają prace fotografa, modelki lub cudzą markę, najpierw potwierdź swoje prawa.

## CSV, który łączy wszystko

CSV to część, którą sprzedawcy detaliczni cenią najbardziej. Jeden wiersz na jednostkę SKU, z kolumnami w ustalonej kolejności. Praktyczne minimum:

| Kolumna | Przykład |
|---|---|
| sk | SKU-12345 |
| kod kreskowy | EAN lub UPC produktu, jeśli taki posiada |
| nazwa_produktu | nazwę, której chcesz używać |
| kolor, rozmiar | pola wariantowe |
| obraz_główny | SKU-12345_front.jpg |
| obraz_2 do obrazu_6 | inne pliki widoku |
| wersja_pakietu | 2026-11 |

Jeśli Twoi sprzedawcy korzystają z Shopify, jest to naturalnie mapowane na plik CSV produktu. Według Centrum pomocy Shopify plik CSV produktu zawiera kolumny zawierające adres URL obrazu produktu, pozycję obrazu, tekst alternatywny obrazu i oddzielny adres URL obrazu wariantu, a Shopify pobiera obrazy z publicznych adresów URL podczas importu i ponownie przesyła je do sklepu. Pole tekstu alternatywnego może pomieścić do 512 znaków, a Shopify zaleca pozostawienie go na poziomie 125 lub mniej. Prześlij swój poziom internetowy na adres publiczny, dodaj adresy URL do pliku CSV, a sprzedawca będzie mógł zaimportować cały asortyment za jednym razem. Przeczytaj bieżącą stronę Shopify, zanim obiecasz partnerowi jakąkolwiek nazwę kolumny. Porównanie metod importu w [Shopify CSV vs API](/pl/blog/shopify-csv-vs-api-2026) pomaga Ci zdecydować, którą trasę należy dla nich udokumentować.

Jeśli podajesz również warunki hurtowe, podaj kod HS i kraj pochodzenia w osobnej zakładce z danymi handlowymi. Twój sprzedawca detaliczny lub agent celny używa ich do zamówień transgranicznych i powinieneś potwierdzić prawidłową klasyfikację u wykwalifikowanego specjalisty.

## Sprawdzony przykładowy przepływ pracy

Powyższy przykładowy tygodniowy program dla dostawcy o wartości 300 SKU:

1. Fotografuj nowe lub zmienione produkty w stałym ustawieniu.
2. Zmień nazwę oryginałów za pomocą reguły SKU.
3. Wyeksportuj trzy warstwy do folderów paczki.
4. Zaktualizuj wiersze CSV i wersję pakietu.
5. Test: otwórz plik CSV, weź pięć losowych wierszy i sprawdź, czy każda nazwa pliku istnieje w folderach.
6. Opublikuj pakiet w jednym udostępnionym łączu, a sprzedawcom e-mailem wyślij dwuwierszowy dziennik zmian.

Krok piąty jest tym, który większość dostawców pomija i wychwytuje prawie wszystkie błędy.

## Lista kontrolna przed wysłaniem paczki

- [ ] Każdy SKU w cenniku posiada przynajmniej jedno zdjęcie w pakiecie.
- [ ] Każda nazwa pliku jest zgodna z regułą i nie zawiera spacji.
- [ ] Każda nazwa pliku w formacie CSV istnieje i odwrotnie.
- [ ] Tło i ustawione kąty są spójne w całym zakresie.
- [ ] Nie są widoczne żadne logo innych firm, znaki wodne ani modele nielicencjonowane.
- [ ] Informacje o prawach użytkowania i data wersji znajdują się w pakiecie.
- [ ] Dostępna jest jednoliniowa funkcja kontaktu dla sprzedawców detalicznych, którzy potrzebują brakującego zdjęcia.

## Gdzie pasuje photoZseo

Jeśli fotografujesz własne produkty, aplikacja photoZseo iPhone i iPad ma aparat szablonowy z siedmioma kątami, aby zachować spójność widoków, zmieniać rozmiar i kompresować zdjęcia dla 46 rynków, zmieniać nazwy plików i eksportować CSV, XLSX lub JSON. Może także przygotować wycenę w formacie B2B w formacie PDF, jeśli sprzedawca detaliczny o nią poprosi. Aby zapoznać się z aplikacją, zobacz [stronę pobierania](/pl/download). Rozszerzenie Chrome zbiera zdjęcia i dane produktów ze strony produktu i eksportuje je w formacie ZIP, CSV lub Excel, co jest pomocne, jeśli strony produktów zawierają już te dane. Sprawdź aktualne plany [wycena](/pl/pricing).

Używaj photoZseo tylko na obrazach, do których masz prawo używać. Nazwy rynkowe opisują jedynie zgodność; photoZseo nie jest powiązany ani wspierany przez żaden rynek.
