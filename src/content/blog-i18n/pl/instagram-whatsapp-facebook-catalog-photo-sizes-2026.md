---
title: "Rozmiary zdjęć w katalogach Instagram, WhatsApp i Facebook (przewodnik 2026)"
description: "Sklepy Instagram, rozmiary zdjęć katalogowych Facebook Shops i WhatsApp: proporcja kwadratowa, minimum 500 px, limit 8 MB, zasady przycinania i jaka proporcja jest bezpieczna."
pubDate: 2026-11-27
readingMinutes: 5
tags: [instagram-shop, facebook-shop, whatsapp-catalog, product-photos]
tldr:
  - "W sklepach Instagram i Facebook Shops obrazy katalogowe są wyświetlane jako kwadraty 1:1: co najmniej 500 x 500 px, zalecane 1024 x 1024 px, JPEG lub PNG, maksymalnie 8 MB."
  - "Katalogi WhatsApp wymagają co najmniej jednego obrazu na każdy przedmiot (do 10 w aplikacji Business), a Meta nie publikuje rozmiaru w pikselach specyficznego dla WhatsApp; kwadratowy obraz spełniający specyfikację Meta jest bezpiecznym wyborem."
  - "Użyj katalogu 1:1, a dla reklam zachowaj wersje 4:5 lub 9:16, ponieważ Meta może przycinać lub uzupełniać obrazy w każdym miejscu docelowym."
faqs:
  - q: "Jaki rozmiar powinny mieć zdjęcia produktów w sklepie Instagram?"
    a: "Meta twierdzi, że sklepy na Instagram wyświetlają zdjęcia produktów w formacie kwadratowym 1:1, przy czym zalecane są co najmniej 500 x 500 pikseli i 1024 x 1024 pikseli. Pliki muszą być w formacie JPEG lub PNG i nie większe niż 8 MB."
  - q: "Jaki jest rozmiar obrazu katalogu WhatsApp?"
    a: "Centrum pomocy WhatsApp wymaga co najmniej jednego obrazu na każdy element katalogu i umożliwia dodanie do 10 zdjęć podczas dodawania produktu w aplikacji Business, ale nie określa wymiarów w pikselach. Użyj kwadratowego obrazu zgodnego ze specyfikacją katalogu Meta (minimum 500 x 500 pikseli, JPEG lub PNG, poniżej 8 MB)."
  - q: "Jaki jest najlepszy rozmiar zdjęcia produktu w sklepie na Facebooku?"
    a: "Użyj kwadratu 1:1 o wymiarach 1024 x 1024 pikseli lub większych. Meta twierdzi, że Sklepy na Facebooku wyświetlają obrazy w postaci kwadratów i nie przycinają ich."
  - q: "Czy Instagram przycina obrazy produktów z mojego katalogu?"
    a: "Tylko na stronie produktu. Meta twierdzi, że ustawienie przycinania dotyczy reklam i strony produktu Instagram, a obrazy nie są przycinane w innych miejscach w sklepach na Instagram."
  - q: "Czy mogę użyć jednego obrazu dla Instagram, Facebooka i WhatsApp?"
    a: "Tak, do katalogu. Instagram i Facebook Shops czerpią z katalogu Meta, a kwadratowy plik JPEG o wymiarach 1024 x 1024 pikseli lub większy na czystym tle jest zgodny z opublikowaną specyfikacją Meta."
---

Krótka odpowiedź: użyj kwadratowego (1:1) JPEG o wymiarach co najmniej 1024 x 1024 pikseli, poniżej 8 MB, przedstawiającego cały produkt na czystym tle. Artykuł pomocy Meta mówi, że sklepy na Facebooku i Instagram wyświetlają zdjęcia produktów jako kwadraty o minimalnych wymiarach 500 x 500 pikseli. Katalogi WhatsApp nie publikują oddzielnych specyfikacji pikseli, więc ten sam kwadratowy obraz również w tym przypadku jest bezpiecznym wyborem.

*Ostatnia weryfikacja: listopad 2026 r. Źródła: Centrum pomocy Meta Business („Specyfikacje obrazów produktów w katalogach”); Meta dla programistów („Pola katalogu” i „Obrazki reklam katalogowych Advantage+ w wielu proporcjach”); Centrum pomocy WhatsApp („O katalogu”, „Jak stworzyć i zarządzać katalogiem”).*

## Specyfikacje zdjęć katalogowych w skrócie

| Spec | Sklepy Instagram | Facebook Shops | Katalog WhatsApp |
|---|---|---|---|
| Współczynnik wyświetlania | Kwadrat 1:1 | Kwadrat 1:1 | Nie opublikowano żadnego współczynnika |
| Minimalny rozmiar | 500 x 500 pikseli | 500 x 500 pikseli | Nie opublikowano rozmiaru pikseli |
| Zalecany rozmiar | 1024 x 1024 pikseli | 1024 x 1024 pikseli | Postępuj zgodnie ze specyfikacją katalogu Meta |
| Formaty | JPG, PNG | JPG, PNG | Niepublikowane; użyj formatu JPEG lub PNG |
| Maksymalny rozmiar pliku | 8 MB | 8 MB | Niepublikowane; Limit katalogu Meta wynosi 8 MB |
| Zdjęcia każdego produktu | Co najmniej 1; Meta zaleca 4+ | Co najmniej 1; Meta zaleca 4+ | Co najmniej 1; do 10 w aplikacji Business |
| Uprawa | Tylko na stronie produktu (ustawienie); w przeciwnym razie nie przycięte | Nie przycięty | Nieopublikowane |

Instagram i Facebook Shops czerpią z tego samego katalogu Meta, dlatego ich numery są zgodne. Pełne porównanie poziomu posuwu z Google można znaleźć w naszym przewodniku po [wymagania dotyczące obrazu w pliku danych o produktach](/pl/blog/product-data-feed-image-requirements-google-meta-2026).

## Który współczynnik proporcji jest bezpieczny na każdej platformie?

1:1 to bezpieczna wartość domyślna. To jest to, co wyświetlają sklepy, to stosunek nazw Meta do spójności karuzeli i to ten, który nigdy nie wymaga dopełniania. Rada Meta dotycząca reklam karuzelowych zaleca wyświetlanie wszystkich obrazów w tym samym stosunku, 1:1 lub 4:5, aby zapobiec automatycznym dostosowaniom.

4:5 i 9:16 dotyczą reklam, a nie katalogu. Dokumentacja dla programistów Meta opisuje obrazy w formacie 9:16 wyświetlane na pełnym ekranie w relacjach i rolkach oraz obrazy w formacie 4:5 używane tam, gdzie obsługuje je miejsce docelowe. Jeśli obraz o proporcjach 9:16 jest krótszy niż miejsce docelowe, pozostała część jest wypełniana kolorem tła obrazu. W przypadku obrazów w formacie 9:16 trzymaj produkt z dala od krawędzi, ponieważ ikona profilu lub przycisk wezwania do działania mogą zasłonić część kadru.

## W jaki sposób Meta przycina obrazy z katalogu?

W Menedżerze sprzedaży w obszarze Ustawienia i Katalog wybierasz jeden z trzech trybów:

- Wypełnij ramkę obrazem (domyślne): powiększa, aby wypełnić ramkę.
- Pokaż cały obraz w ramce: nic nie jest obcięte, ale mogą zostać dodane białe znaki.
- Przytnij i zmień rozmiar obrazu, aby dopasować go do ramki: mieści cały produkt w ramce; działa najlepiej na białym lub przezroczystym tle.

Meta twierdzi, że dotyczą one reklam karuzelowych i kolekcji, reklam z jednym obrazem i strony produktu Instagram. Sklepy na Facebooku nie są w ogóle przycinane. Praktyczna zasada: zostaw margines wokół produktu, aby domyślne powiększenie go nie przycięło.

## A co z katalogami WhatsApp?

Centrum pomocy WhatsApp mówi, że każdy element katalogu wymaga unikalnego tytułu, co najmniej jednego zdjęcia przedstawiającego produkt i kraju pochodzenia. Podczas tworzenia produktu w aplikacji Business możesz dodać maksymalnie 10 zdjęć. Każdy przesłany obraz jest sprawdzany pod kątem zgodności z Zasadami przesyłania wiadomości WhatsApp Business, a elementy oczekujące lub odrzucone są ukryte przed klientami. Jeśli zapisanie się nie powiedzie, Centrum pomocy sugeruje zmniejszenie rozmiaru pliku.

Nie znaleźliśmy oficjalnej strony WhatsApp zawierającej listę wymiarów w pikselach lub proporcji, więc ten przewodnik ich nie podaje. Wiele zewnętrznych blogów podaje dane, które się ze sobą nie zgadzają. Użyj kwadratowego obrazu zgodnego ze specyfikacją katalogu Meta i sprawdź aktualne wytyczne WhatsApp, jeśli potrzebujesz więcej.

## Czego według Meta należy unikać?

- Tekst nakładający się na produkt, wezwania do działania, kody promocyjne, znaki wodne lub informacje wrażliwe na upływ czasu, takie jak tymczasowe obniżki cen.
- Obrazy zastępcze, takie jak „obraz wkrótce”.
- Zdjęcia, które nie przedstawiają dokładnie sprzedawanego produktu.
- Ponowne użycie nazwy pliku podczas zastępowania obrazu poprzez źródło danych: nowy obraz wymaga innego adresu URL, w przeciwnym razie Meta go nie odświeży.

Meta zaleca białe tło, JPEG zamiast PNG, aby zapewnić jakość obrazu, oraz te same obrazy, które pojawiają się w Twojej witrynie. Jeśli sprzedajesz również za pośrednictwem krótkich filmów, [Przewodnik po rozmiarach zdjęć w sklepie TikTok](/pl/blog/tiktok-shop-photo-sizes) spełnia swoje odrębne zasady dotyczące obrazu pionowego.

## Prosty przepływ pracy dla wszystkich trzech

1. Zrób zdjęcie lub wyeksportuj jeden kwadratowy wzorzec w rozdzielczości 1024 x 1024 pikseli lub większej (1500 x 1500 pikseli działa również w przypadku kanałów Google).
2. Całość powinna być widoczna z marginesem, na czystym tle.
3. Zapisz jako JPEG poniżej 8 MB.
4. Dodaj 3 lub więcej zdjęć kątowych i szczegółowych; Meta zaleca cztery lub więcej na produkt.
5. Utwórz osobne wersje 4:5 lub 9:16 tylko dla reklam.

## Gdzie pasuje photoZseo

[zdjęcieZseo](/pl/download) dla iPhone i iPad może zmieniać rozmiar, kompresować i zmieniać nazwę jednego zestawu zdjęć dla 46 rynków, a [Rozszerzenie Chrome](/pl/chrome-extension) zbiera zdjęcia stron produktów i masowo eksportuje wersje w rozmiarze platformy. Rozmiary dla poszczególnych rynków są wymienione w naszym [przewodnik po rozmiarach obrazów na rynku](/pl/marketplace-image-sizes).

*photoZseo nie jest powiązany ani wspierany przez żaden rynek, Meta, Instagram, Facebook ani WhatsApp. Przed przesłaniem sprawdź aktualne wytyczne każdej platformy.*
