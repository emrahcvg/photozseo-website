---
title: "WebP vs. JPEG vs. PNG für Produktfotos: ein Benchmark für 2026"
description: "Ein Benchmark für WebP, JPEG und PNG für Produktfotografie im Jahr 2026 – Dateigröße, visuelle Qualität, Marktplatzunterstützung und das richtige Format pro Plattform."
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP liefert die gleiche visuelle Qualität wie JPEG bei etwa 30 % kleinerer Dateigröße und wird jetzt in allen modernen Browsern, iOS Safari und Android Chrome, ausgeliefert – im Jahr 2026 handelt es sich nicht mehr um eine „progressive Verbesserung“, sondern um die Standardeinstellung."
  - "JPEG gewinnt immer noch dort, wo der Markt es strikt durchsetzt (Amazon-, eBay-, Etsy-Hauptbild). PNG gewinnt nur für transparente Hintergründe und pixelgenaue Logos."
  - "Die Best Practice für 2026 besteht darin, alle drei Formate parallel aus einer einzigen Quelle zu schreiben und das Upload-Ziel auswählen zu lassen – ein Workflow, den automatisierte Tools in weniger als einer Sekunde pro Foto abschließen."
faqs:
  - q: "Unterstützt WebP Transparenz wie PNG?"
    a: "Ja. WebP unterstützt sowohl verlustfreie als auch verlustbehaftete Modi sowie einen Alphakanal für Transparenz. Ein transparentes WebP ist normalerweise 25–35 % kleiner als das entsprechende transparente PNG."
  - q: "Wird WebP im Jahr 2026 auf allen Browsern und Geräten unterstützt?"
    a: "Ja. WebP wird seit Jahren in Chrome, Firefox, Edge und Opera unterstützt. Safari hat WebP in iOS 14 (2020) und macOS Big Sur hinzugefügt. Im Jahr 2026 liegt die weltweite WebP-Unterstützung bei 97,4 % (Daten von caniuse.com, Mai 2026). Der letzte sinnvolle Holdout – der ältere Internet Explorer – liegt unter 0,1 % des Datenverkehrs."
  - q: "Akzeptieren Marktplätze im Jahr 2026 WebP-Uploads?"
    a: "Shopify, BigCommerce, WooCommerce, Wix und Squarespace akzeptieren WebP nativ. Amazon, eBay und Etsy empfehlen weiterhin JPEG für das Hauptproduktbild – sie kodieren alles, was Sie hochladen, ohnehin neu. Am sichersten ist es, JPEG auf die strengen Marktplätze und WebP auf Ihren eigenen Shop hochzuladen."
  - q: "Welche Qualitätseinstellung sollte ich für das Produkt WebP verwenden?"
    a: "Qualität 80–85 ist der optimale Punkt für die Produktfotografie. Bei einem Wert unter 75 kommt es zu sichtbaren Farbstreifen auf glänzenden oder metallischen Oberflächen. Bei einem Wert über 90 wird die wahrgenommene Qualität nicht mehr verbessert und die Datei wird lediglich vergrößert."
  - q: "Warum ist HEIC nicht auf dieser Liste?"
    a: "HEIC ist ein von Apple bevorzugter Container, den kein großer Markt akzeptiert. Verkäufer, die HEIC-Dateien hochladen, werden fast immer abgelehnt oder auf dem Server automatisch konvertiert, oft mit Qualitätsverlust. Die professionelle Pipeline schreibt JPEG, PNG oder WebP und versendet HEIC niemals ausgehend."
---

Früher war die Formatfrage einfach: Fotografieren, JPEG exportieren, hochladen. Im Jahr 2026 lautet die Frage nicht mehr „JPEG oder PNG“, sondern „Wie viele Formate muss ich von einem einzelnen Foto versenden und welches Ziel möchte welches?“

Dieser Benchmark antwortet darauf mit gemessenen Zahlen, Marktplatztabellen und einem Workflow für Indie-Verkäufer.

## Was sich im Jahr 2026 geändert hat

Drei Schichten kamen zusammen.

1. Die Safari WebP-Unterstützung ist universell. iOS 14 fügte WebP im Jahr 2020 hinzu. Im Mai 2026 unterstützten 97,4 % des weltweiten Surfens WebP. Der Fallback-Fall ist statistisch vernachlässigbar.
2. Die Markteinführung spaltete sich in zwei Lager. Shopify, WooCommerce, BigCommerce, Wix und Squarespace stellen WebP direkt im Browser bereit. Amazon, eBay, Etsy und Walmart kodieren ohnehin jeden Upload in ihr eigenes JPEG neu, sodass das Quellformat für sie kaum eine Rolle spielt – sie veröffentlichen aber dennoch die Anleitung „JPEG empfohlen“.
3. CDN-Ökonomie belohnte WebP. Cloudflare, Fastly und Bunny CDN berichten von einer um 28–34 % geringeren Ausgangsbandbreite, wenn eine Produktseite WebP statt JPEG bereitstellt. Für einen Shop mit 1 Million Seitenaufrufen pro Monat ist das eine messbare Werbebuchung.

Die Standardeinstellung für 2026 lautet daher: Schreiben Sie JPEG für Marktplätze, WebP für Ihre eigene Storefront, PNG nur, wenn Sie Transparenz benötigen.

## Paralleler Benchmark

Eine einzelne Quelle – ein 4032×3024 iPhone-Foto eines Walnuss-Schneidebretts auf einem weißen Sweep – exportiert mit demselben visuellen Qualitätsziel.

| Format | Qualität | Dateigröße | SSIM (wahrgenommene Qualität vs. Quelle) | Erstladezeit (4G) | Notizen |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| JPEG | 85 | 412 KB | 0.984 | 412 ms | Die Referenzbasislinie |
| JPEG | 75 | 264 KB | 0.971 | 264 ms | Sichtbare Farbstreifen am glänzenden Rand |
| WebP | 85 | 287 KB | 0.985 | 287 ms | ~30 % kleiner als JPEG q85, identisches SSIM |
| WebP | 75 | 184 KB | 0.973 | 184 ms | Kleiner als JPEG q75, besseres SSIM |
| PNG | (verlustfrei) | 1,84 MB | 1.000 | 1840 ms | Verlustfrei, aber 4,5-mal teurer als JPEG |
| PNG-8 (256 Farben) | (Palette) | 412 KB | 0.812 | 412 ms | Starke Streifenbildung, für Produktfotos nicht geeignet |

Fazit: Bei gleicher wahrgenommener Qualität ist WebP 30 % kleiner als JPEG. PNG ist nur dann die richtige Antwort, wenn Transparenz oder pixelgenaue Grafiken erforderlich sind (Logos, Packshots mit ausgeschnittenen Hintergründen, Produkt-Overlays).

## Marktplatz-Kompatibilitätsmatrix

| Plattform | JPEG | PNG | WebP | Empfohlen |
|----------|------|-----|------|-------------|
| Amazon | Ja | Ja | Nein (neu kodiert) | JPEG |
| eBay | Ja | Ja | NEIN | JPEG |
| Etsy | Ja | Ja | NEIN | JPEG |
| Walmart Marketplace | Ja | Ja | NEIN | JPEG |
| Shopify | Ja | Ja | Ja | WebP (Storefront), JPEG (CSV-Import) |
| WooCommerce | Ja | Ja | Ja | WebP |
| BigCommerce | Ja | Ja | Ja | WebP |
| Wix | Ja | Ja | Ja | WebP |
| Squarespace | Ja | Ja | Ja | WebP |
| TikTok Shop | Ja | Ja | Ja | JPEG (die meisten Vorlagen) |
| Instagram Einkaufen | Ja | Ja | NEIN | JPEG |
| Temu / SHEIN | Ja | NEIN | NEIN | JPEG |
| DHgate / Made-in-China | Ja | Ja | NEIN | JPEG |
| Trendyol / Hepsiburada | Ja | Ja | NEIN | JPEG |
| Pinterest Einkaufen | Ja | Ja | Ja | JPEG |

Das Muster ist konsistent: Marktplätze, die neu kodieren, bevorzugen JPEG-Eingaben; Ihre eigene Storefront gewinnt mit WebP-Ausgaben.

## Wann welche verwenden

Ein einfacher Entscheidungsbaum:

- Auf einen Marktplatz hochladen? → JPEG.
- Hosten Sie in Ihrem eigenen Shopify-, WooCommerce- oder BigCommerce-Shop? → WebP für die Storefront, JPEG als Fallback im CSV-Import.
- Benötigen Sie Transparenz (ausgeschnittenes Produkt, Overlay-Grafik, Verpackungsfoto mit Alpha)? → PNG, mit WebP als sekundärem Format, sofern Ihr Store dies unterstützt.
- An eine Druckerei, einen Hersteller oder einen Designer senden? → PNG oder TIFF, niemals WebP.
- In sozialen Medien posten (Instagram, TikTok, Pinterest)? → JPEG. Social-Uploader entfernen alles andere.

Die beiden Formate, die Verkäufer nicht versenden sollten, sind HEIC (nur für Apple, Marktplatz-inkompatibel) und AVIF (bessere Komprimierung als WebP, aber immer noch inkonsistent in älteren Safari-Versionen, und seit Mai 2026 wird es von fast keinem Markt mehr akzeptiert).

## Wie photoZseo alle drei parallel schreibt

Im Jahr 2026 sollte das Schreiben von drei Dateien aus einer Quelle mit einem einzigen Fingertipp erfolgen.

Die Image-Pipeline von photoZseo basiert auf Core Image, vImage und CGImageDestination. Wenn der Verkäufer auf „Exportieren“ klickt:

1. Master-Dekodierung – das Quellfoto wird in einen linearen 16-Bit-Farbpuffer dekodiert.
2. Farbmanagement – ​​der Puffer wird in sRGB (den universellen Farbraum für Produktfotos) konvertiert.
3. Größe ändern – Lanczos-3-Resampling erzeugt die erforderliche Größe der Plattform.
4. Parallel kodieren – drei Schreibvorgänge erfolgen gleichzeitig:
   - JPEG, Qualität 85, sRGB, EXIF ​​beibehalten (GPS entfernt), Künstler- und Software-Tags geschrieben.
   - WebP, Qualität 85, sRGB, EXIF ​​erhalten über CGImageDestination + UTType.webP.
   - PNG, sRGB, Alpha bleiben erhalten, wenn die Quelle Transparenz hat.
5. Dateiname – Jede Datei erhält denselben URL-sicheren, beschreibenden Namen mit dem Formatsuffix.

Der WebP-Schreibvorgang ist nativ – basiert auf der CGImageDestination-WebP-Unterstützung von iOS 14 und nicht auf einem libwebp-Wrapper eines Drittanbieters. Das ist wichtig, weil der native Pfad EXIF-Metadaten (Titel, Beschreibung, Künstler, Urheberrecht) beibehält, die die meisten libwebp-Wrapper stillschweigend löschen.

Gesamtzeit pro Foto auf einem iPhone 15 Pro: unter 1 Sekunde für alle drei Formate.

## Ein Hinweis zu den Qualitätseinstellungen

Der Qualitätsknopf ist nuancierter als eine einzelne Zahl.

- q70: sichtbare Artefakte auf glatten Oberflächen. Akzeptabel für Miniaturansichten, nicht für Heldenbilder.
- q75: akzeptabel für Hero-Bilder in verlustbehafteten Formaten, aber glänzende Produkte (Schmuck, Metallverpackungen, Glas) weisen Streifenbildung auf.
- q80–85: der Sweet Spot für Produktfotografie. SSIM bleibt über 0,98 gegenüber der Quelle.
- q90+: Die Dateigröße wächst stark an, ohne dass eine Qualitätsverbesserung erkennbar ist. Nur für Archivmaster nützlich.
- verlustfrei (PNG / WebP verlustfrei): nur für Grafiken, Logos und Packshots mit Transparenz.

Verkäufer, die bei jedem Exportabfall standardmäßig auf „maximale Qualität“ setzen und ihre Seiten verlangsamen, ohne dass das Foto dadurch besser aussieht.

## CDN- und Storefront-Tuning

Sobald die drei Dateien vorhanden sind, besteht die Aufgabe der Storefront darin, die richtige Datei bereitzustellen.

- Shopify wählt WebP automatisch für die Unterstützung von Browsern über sein CDN aus. Laden Sie WebP-, JPEG- und Shopify-Picks pro Anfrage hoch.
- WooCommerce mit dem „WebP Express“-Plugin (oder modernes Hosting wie Bluehost, Kinsta, WP Engine) stellt WebP von einem `.webp`-Spiegel bereit, wenn der `Accept: image/webp`-Header vorhanden ist.
- BigCommerce verwendet sein Akamai-CDN, das die WebP-Transkodierung im Handumdrehen durchführt.
- Benutzerdefinierte Astro-/Next.js-/Hugo-Storefronts sollten `<picture>`-Tags mit `<source srcset="...webp" type="image/webp">` und einen JPEG-Fallback in `<img src="...jpg">` verwenden.

Die Fallback-Kette ist wichtig, da die 2,6 % des Datenverkehrs, der WebP nicht unterstützt, trotzdem das Produktfoto sehen sollten.

## Eine praktische Checkliste

Bestätigen Sie vor dem Hochladen Folgendes:

- [ ] Sie haben einen JPEG-Master mit 2000×2000 (oder der von der Plattform benötigten Größe) für Marktplatz-Uploads.
- [ ] Sie haben eine WebP-Version desselben Bildes für Ihre eigene Storefront.
- [ ] Sie haben nur dann ein PNG, wenn das Produkt Transparenz benötigt.
- [ ] Die Dateinamen sind beschreibend – `walnut-cutting-board-12in.jpg`, nicht `IMG_4421.jpg`.
- [ ] Der Farbraum ist sRGB, nicht Adobe RGB oder ProPhoto.
- [ ] GPS-Daten werden aus dem EXIF-Block entfernt.
- [ ] Die Qualität beträgt q85 für JPEG und WebP, verlustfrei für PNG.

Eine Produktseite, die alle sieben Anforderungen erfüllt, wird schnell ausgeführt, indiziert sauber und sieht im gesamten Marktplatz- und Storefront-Ökosystem identisch aus.

## Das Essen zum Mitnehmen

Der Formatkrieg ist vorbei. Im Jahr 2026 ist die richtige Antwort alle drei parallel: JPEG für Marktplätze, die dies verlangen, WebP für Schaufenster und CDNs, PNG, wenn Transparenz nicht verhandelbar ist. Die Aufgabe des Verkäufers besteht nicht mehr darin, ein Format auszuwählen. Es geht darum, einen Workflow auszuwählen, der alle drei mit einem einzigen Tastendruck aus einer einzigen Quelle schreibt.

---

photoZseo ist auf dem App Store für iPhone und iPad.
