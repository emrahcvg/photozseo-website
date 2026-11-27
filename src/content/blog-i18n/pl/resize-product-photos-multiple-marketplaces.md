---
title: "Jak zmienić rozmiar zdjęć produktów dla wielu rynków jednocześnie"
description: "Amazon, eBay, Etsy, Shopify i Trendyol wymagają różnych rozmiarów obrazu. Procedura krok po kroku umożliwiająca jednorazowe sfotografowanie i wyeksportowanie każdej wersji dostępnej na rynku — rozmiary, tła, kompresja i nazwy plików."
pubDate: 2026-11-26
readingMinutes: 5
tags: [workflow, marketplaces, product-photos]
tldr:
  - "Zrób jedno zdjęcie wzorcowe o rozdzielczości 2000 pikseli lub większej po najkrótszym boku; każda wersja rynkowa jest wówczas obniżoną skalą."
  - "Zachowaj jeden wzorzec z białym tłem dla obrazów głównych i osobne zdjęcia lifestylowe dla obrazów wtórnych."
  - "Eksportuj według rynku: rozmiar, proporcje, format, kompresja i opisowa nazwa pliku."
faqs:
  - q: "Czy mogę użyć tego samego zdjęcia w przypadku Amazon, eBay i Etsy?"
    a: "Tak, jeśli jest wystarczająco duży i na czystym białym tle. Kwadratowy plik JPEG o wymiarach 2000 × 2000 pikseli spełnia zalecenia Amazon i Etsy i przekracza minimum 500 pikseli eBay."
  - q: "Dlaczego nie przesłać wszędzie jednego wielkiego zdjęcia?"
    a: "Rynki ponownie kompresują duże pliki, rozmiary i proporcje są różne (niektóre sklepy z modą preferują portret 3:4), a opisowe nazwy plików powinny pasować do języka każdego sklepu."
  - q: "Jaki jest najszybszy sposób zmiany rozmiaru zdjęć dla wielu rynków?"
    a: "Użyj narzędzia z gotowymi ustawieniami z Marketplace, które eksportuje każdą wersję z jednego zdjęcia wzorcowego w jednym kroku, np. photoZseo na iPhone i iPad."
---

Sprzedaż na kilku rynkach zwykle oznacza wielokrotną edycję tego samego zdjęcia. Prosty przepływ pracy rozwiązuje ten problem: jedno zdjęcie wzorcowe, wiele eksportów.

## Krok 1: Sfotografuj jednego dobrego mistrza

- Co najmniej 2000 px na najkrótszym boku. Każda wersja rynkowa jest zatem wersją downscale, nigdy ekskluzywną.
- Kwadratowe kadrowanie z marginesem, dzięki czemu można później przyciąć do proporcji 1:1 lub 3:4.
- Zwykłe tło i równomierne światło — dzięki temu biały obraz główny jest łatwy.

## Krok 2: Zrób dwa rodzaje obrazów

1. Zdjęcie główne: sam produkt, czyste białe tło (RGB 255, 255, 255), produkt wypełniający większą część kadru. Wymagane przez Amazon i Walmart; działa wszędzie.
2. Obrazy wtórne: inne kąty, szczegóły, skala i zdjęcia stylu życia.

## Krok 3: Poznaj cele

| Rynek | Rozmiar do eksportu |
|---|---|
| Amazon | 2000 × 2000 pikseli, białe tło |
| eBay | ≈ 1600 × 1600 pikseli (min. 500 pikseli) |
| Etsy | 2000 pikseli lub większy |
| Shopify | 2048 × 2048 pikseli |
| Trendyol / Hepsiburada | Sprawdź panel sprzedawcy; kwadrat lub 3:4 |

Oficjalne źródła każdego z nich znajdują się w naszym [przewodnik po rozmiarach obrazów na rynku](/pl/marketplace-image-sizes).

## Krok 4: Wyeksportuj poprawnie każdą wersję

Dla każdego rynku:

- Zmień rozmiar na docelowy rozmiar i proporcje.
- Konwertuj na JPEG (sRGB); używaj formatu PNG tylko tam, gdzie wymagana jest przezroczystość.
- Skompresuj do około 200–600 KB.
- Zmień nazwę opisowo: `acme-walnut-board-large-front.jpg` ([jak nazwać zdjęcia produktów](/pl/blog/how-to-name-product-photos-for-seo)).
- Usuń GPS i inne prywatne metadane.

## Krok 5: Zautomatyzuj to

Ręczne wykonanie kroku 4 dla 5 rynków × 6 zdjęć × 20 produktów to 600 plików. [zdjęcieZseo](/pl/download) robi to w jednym eksporcie na iPhone i iPad: przechowuje zdjęcia wzorcowe i zapisuje kopię o odpowiednim rozmiarze, skompresowaną i nazwaną dla każdego z maksymalnie 46 rynków, a także plik z listą CSV/XLSX. Bezpłatny plan obejmuje do 5 platform handlowych — patrz [wycena](/pl/pricing).
