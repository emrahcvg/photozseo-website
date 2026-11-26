---
title: "Wymagania dotyczące zdjęć produktów Amazon w 2026 r"
description: "Dokładne rozmiary, typy plików i zasady tła, które Amazon narzuca na zdjęciach produktów — oraz sposób ich przekazania przy pierwszym przesyłaniu."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "Główny obraz Amazon musi mieć wymiary minimum 1000×1000 (zalecane 2000×2000), kwadrat 1:1, czyste białe tło #FFFFFF, JPEG, sRGB, mniej niż 10 MB."
  - "Najszybsze odrzucenie powoduje: prawie biały zamiast prawdziwej bieli, produkt mniejszy niż 85% ramki, znaki wodne lub tekst na obrazie głównym."
  - "Po kompresji pozostań poniżej 600 KB na obraz — CDN Amazon ponownie koduje wszystko, co jest większe i ma wagę szybkości strony, do Twojego rankingu konwersji."
faqs:
  - q: "Jaki jest minimalny rozmiar zdjęć produktów Amazon?"
    a: "1000 pikseli na najdłuższym boku to absolutne minimum. Poniżej Amazon wyłącza funkcję powiększania Twojego wpisu — a ranking bez powiększenia jest obniżany przez algorytm. Celuj w rozdzielczość 2000×2000, aby zapewnić Amazon miejsce na ponowną kompresję bez zmiękczania."
  - q: "Czy w przypadku aukcji Amazon lepszy jest JPEG czy PNG?"
    a: "JPG. Amazon akceptuje także formaty TIFF, PNG i GIF, ale JPEG kompresuje się w mniejszym stopniu, przetwarza szybciej w CDN Amazon i nie zapewnia korzyści w zakresie przezroczystości na tle #FFFFFF. Zaoszczędź w przestrzeni barw sRGB, jakości 80–85."
  - q: "Czy Amazon wymaga czystego białego tła dla każdego zdjęcia?"
    a: "Tylko główny obraz — to zasada, którą Amazon egzekwuje za pomocą automatycznych kontroli. Obrazy wtórne mogą przedstawiać produkt w kontekście, na modelu, z opakowaniem lub w scenach lifestylowych. Pierwsze zdjęcie to portier."
  - q: "Jak duży powinien być produkt w ramce?"
    a: "Wytyczne Amazon obejmują co najmniej 85% obrazu. Produkty mniejsze niż te często nie przechodzą automatycznej oceny lub są ręcznie oznaczane podczas audytów kategorii. Wyśrodkuj produkt i przytnij mocno."
  - q: "Czy mogę przesyłać zdjęcia HEIC z mojego iPhone do Amazon?"
    a: "Nie. Amazon obsługuje formaty JPEG, TIFF, PNG lub GIF. Konwertuj HEIC na JPEG przed przesłaniem — ustawienie wstępne Amazon photoZseo robi to automatycznie i przycina plik do 200–600 KB bez widocznej utraty jakości."
---

Amazon odrzuca oferty, zanim większość sprzedawców je zobaczy. Winowajcą jest prawie zawsze zdjęcie — plik, który jest zbyt ciężki, tło, które nie jest naprawdę białe lub proporcje, których platforma po cichu odmawia.

Oto ściągawka ze specyfikacją na rok 2026, pobrana z dokumentacji sprzedawcy Amazon i przetestowana z listami na żywo.

## Główne zasady dotyczące wizerunku

- Wymiary: minimum 1000×1000, zalecane 2000×2000. Poniżej 1000 na najdłuższym boku Amazon nie umożliwi powiększania — a algorytm traktuje listy bez powiększenia jako o niższej jakości.
- Współczynnik proporcji: Kwadrat (1:1) dla głównego obrazu. Obrazy wtórne mogą mieć format 4:5 lub 16:9.
- Tło: Czysta biel, sześciokąt `#FFFFFF`. Studia fotograficzne „prawie białe” nie przechodzą automatycznych kontroli częściej, niż oczekują sprzedawcy.
- Format: JPEG (`.jpg`) to najbezpieczniejszy wybór. Akceptowane są formaty TIFF, PNG i GIF, ale JPEG kompresuje się lepiej i szybciej przetwarza w sieci CDN Amazon.
- Przestrzeń barw: sRGB. Obrazy zapisane w Adobe RGB lub ProPhoto wydają się matowe po ponownym kodowaniu Amazon.
- Rozmiar pliku: poniżej 10 MB na obraz. Staraj się uzyskać rozmiar 200–600 KB po kompresji — duże pliki spowalniają ładowanie strony produktu i wpływają na szybkość konwersji.

## Co powoduje zablokowanie wpisu

1. Znaki wodne, nakładki tekstowe lub logo na obrazie produktu.
2. Rekwizyty, które nie są zawarte w tym, co otrzyma klient.
3. Obramowanie, ramka lub dowolne tło inne niż czysto białe dla głównego obrazu.
4. Produkt zajmujący mniej niż 85% kadru obrazu.
5. Manekiny (na odzież) lub widoczne platformy wspierające.

## Jak photoZseo stosuje specyfikację

Preset Amazon w photoZseo robi cztery rzeczy jednocześnie:

1. Przycina do kwadratowej ramki z produktem wyśrodkowanym na 85% płótna.
2. Zmienia rozmiar najdłuższego boku na 2000 pikseli (inteligentnie zwiększa rozmiar, jeśli źródło jest mniejsze).
3. Zapisuje czysty plik JPEG w formacie sRGB, jakość 85 — zwykle 250–450 KB.
4. Jeśli włączone jest usuwanie tła, zastępuje tło, na którym znajduje się zdjęcie, czystym #FFFFFF i wtapia krawędzie, aby produkt nie wyglądał na wycięty i wklejony.

Cały potok działa na telefonie. Nic nie opuszcza Twojego urządzenia.

## Szybka lista kontrolna zgodności

Przed przesłaniem potwierdź:

- [ ] Najdłuższy bok to ≥1000 px (preferowane 2000 px)
- [ ] Tło przechodzi test „wyboru białych” — cztery rogi są odczytywane jako `#FFFFFF`
- [ ] Plik ma mniej niż 10 MB i jest zapisany w formacie JPEG
- [ ] Współczynnik proporcji głównego obrazu wynosi 1:1
- [ ] Brak tekstu, znaku wodnego i ramki

Jeśli wszystkie pięć się sprawdzi, lista przejdzie automatyczną weryfikację Amazon przy pierwszej próbie — a Ty pominiesz powtarzanie, które zakłóca moment uruchomienia.
