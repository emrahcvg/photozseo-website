---
title: "Bildanforderungen für Produktdaten-Feeds: Google Merchant Center und Metakatalog (2026)"
description: "Bildspezifikationen für Google Merchant Center- und Metakatalog-Feeds: Mindestpixel, empfohlene Größe, Formate, Dateibeschränkungen und warum Bilder gekennzeichnet werden."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center: JPEG, WebP, PNG, GIF, BMP oder TIFF bis zu 16 MB; Mindestens 500 x 500 Pixel für alle Produkte ab dem 31. Januar 2027; 1500 x 1500 Pixel oder größer empfohlen."
  - "Metakatalog: JPEG oder PNG, maximal 8 MB, mindestens 500 x 500 Pixel; 1024 x 1024 px im Quadrat werden für Shops auf Facebook und Instagram empfohlen."
  - "Ein einzelnes quadratisches JPEG mit 1500 x 1500 Pixeln und einem sauberen Hintergrund, ohne Textüberlagerungen und ohne Wasserzeichen genügt beiden Feeds."
faqs:
  - q: "Was sind die Bildanforderungen Google Merchant Center im Jahr 2026?"
    a: "Verwenden Sie einen http/https-Bildlink in JPEG, WebP, PNG, GIF, BMP oder TIFF, bis zu 16 MB und 64 Megapixel. Google empfiehlt 1500 x 1500 Pixel oder mehr und ab dem 31. Januar 2027 gilt für alle Produkte ein Minimum von 500 x 500 Pixel."
  - q: "Was ist die Mindestbildgröße für einen Metakatalog?"
    a: "Die Produktdatenspezifikation von Meta erfordert mindestens 500 x 500 Pixel für das Hauptbild, in JPEG oder PNG unter 8 MB. Für Shops auf Facebook und Instagram empfiehlt Meta 1024 x 1024 Pixel."
  - q: "Wie viele zusätzliche Bilder kann ich zu einem Produkt-Feed hinzufügen?"
    a: "Googles „additional_image_link“ akzeptiert bis zu 10 zusätzliche Bilder. Die Meta-Katalogfeldreferenz ermöglicht bis zu 50 zusätzliche Bild-URLs."
  - q: "Kann ich dieselbe Bilddatei für Google Shopping und Meta verwenden?"
    a: "Normalerweise ja. Ein quadratisches JPEG mit einer Größe von 1500 x 1500 Pixeln oder mehr, das das echte Produkt auf einem sauberen Hintergrund ohne Text oder Wasserzeichen zeigt, entspricht den veröffentlichten Regeln beider Plattformen."
  - q: "Warum kennzeichnet Meta oder Google mein Produktbild?"
    a: "Häufige Ursachen sind Overlay-Text, Werbeabzeichen, Wasserzeichen, Rahmen, Platzhalterbilder wie „Bild kommt bald“, zu kleine Bilder und Bild-URLs, die Crawler blockieren oder nicht zum Dateityp passen."
---

Die kurze Antwort: Senden Sie sowohl für Google Merchant Center als auch für Meta Catalog ein quadratisches JPEG mit mindestens 1500 x 1500 Pixeln, das das echte Produkt auf einem sauberen Hintergrund zeigt, ohne Text, Abzeichen oder Wasserzeichen. Der harte Boden von Google ist 500 x 500 Pixel groß (für alle Produkte ab dem 31. Januar 2027) und der von Meta ist ebenfalls 500 x 500 Pixel groß, aber beide Plattformen empfehlen größere Dateien. Die folgenden Tabellen enthalten die genauen Zahlen aus der Dokumentation jeder Plattform.

*Zuletzt überprüft: November 2026. Quellen: Google Merchant Center-Hilfe („Bildlink [image_link]“, „Zusätzlicher Bildlink [additional_image_link]“, „So beheben Sie: Bild zu klein“); Meta Business Help Center („Produktbildspezifikationen für Kataloge“); Meta für Entwickler („Katalogfelder“).*

## Google Merchant Center vs. Metakatalog: nebeneinander

| Erfordernis | Google Merchant Center | Metakatalog |
|---|---|---|
| Hauptbildfeld | `image_link` | `image_link` |
| Akzeptierte Formate | JPEG, WebP, PNG, GIF, BMP, TIFF | JPEG, PNG |
| Maximale Dateigröße | 16 MB (und 64 Megapixel) | 8 MB |
| Mindestgröße | 500 x 500 px für alle Produkte ab 31.01.2027 (davor: 100 x 100 px bzw. 250 x 250 px für Kleidung) | 500 x 500 Pixel |
| Empfohlene Größe | 1500 x 1500 Pixel oder größer | 1024 x 1024 px (Shops auf Facebook und Instagram) |
| Seitenverhältnis | Kein festes Verhältnis angegeben; Google kann einen subtilen Zuschnitt anwenden | Shops zeigen 1:1 im Quadrat an; Karussellanzeigen funktionieren am besten, wenn alle Bilder das gleiche Seitenverhältnis haben (1:1 oder 4:5). |
| Zusätzliche Bilder | Bis zu 10 (`additional_image_link`) | Bis zu 50 (`additional_image_link`) |
| Produktrahmen | Das Produkt sollte etwa 75 % bis 90 % des Bildes ausfüllen | Das Hauptbild sollte das gesamte Produkt zeigen |
| URL-Regeln | http/https, nur ASCII, RFC 3986, 1 bis 2.000 Zeichen | Verwenden Sie die URL des aktuellen Produktbildes |

Die Google-Frist im Detail finden Sie in unserem früheren Beitrag zum [Google Shopping: mindestens 500 x 500 Pixel](/de/blog/google-merchant-center-500px-image-requirement-2027).

## Was ändert sich durch die Google 500 x 500 Pixel-Regel?

Bis zum 31. Januar 2027 werden auf der Fehlerbehebungsseite von Google noch niedrigere Schwellenwerte aufgeführt: 100 x 100 Pixel für die meisten Produkte und 250 x 250 Pixel für Kleidung. Nach diesem Datum gilt für jede Kategorie die Mindestgröße von 500 x 500 Pixel. Google gibt an, dass Bilder, die unter dem Mindestwert liegen, nicht angezeigt werden, das Produkt selbst jedoch nicht abgelehnt wird. Google weist außerdem darauf hin, dass YouTube-Shopping-Anzeigen Bilder mit einer Größe von mindestens 500 x 500 Pixeln benötigen, um im Fernsehen zu erscheinen.

Praktische Konsequenz: Ein Feed voller 300-Pixel-Thumbnails führt nicht dazu, dass Ihre Einträge völlig kaputt gehen, aber diese Produkte verlieren ihr Image dort, wo es darauf ankommt. Exportieren Sie die Originale erneut, anstatt ein Miniaturbild hochzuskalieren.

## Was benötigt Meta für Katalogbilder?

Der Hilfeartikel von Meta listet diese Grundlagen auf: Mindestens ein Bild pro Produkt, JPEG oder PNG, maximal 8 MB, und das Bild muss das spezifische zum Verkauf stehende Produkt genau darstellen. Für Shops auf Facebook und Instagram werden Produktbilder als Quadrat (1:1) angezeigt, wobei mindestens 500 x 500 Pixel und 1024 x 1024 Pixel empfohlen werden.

Meta empfiehlt außerdem vier oder mehr Bilder pro Produkt, ein klares Hauptbild, das das gesamte Produkt zeigt, eine Mischung aus Winkeln und Nahaufnahmen, dieselben Bilder wie auf Ihrer Website, einen weißen Hintergrund und JPEG über PNG für die Bildqualität.

### Wie schneidet Meta Katalogbilder zu?

Im Commerce Manager (Einstellungen, dann Katalog) wählen Sie einen von drei Zuschneidemodi: Rahmen mit Bild füllen (Standardeinstellung, bei der vergrößert wird), gesamtes Bild im Rahmen anzeigen (möglicherweise werden Leerräume hinzugefügt) oder Zuschneiden und Größe anpassen, um es an den Rahmen anzupassen. Meta sagt, dass Bilder nirgendwo anders in Shops auf Instagram und überhaupt nicht in Shops auf Facebook zugeschnitten werden, abgesehen von der Instagram-Produktseiteneinstellung. Wenn in Ihrem Katalog Seitenverhältnisse gemischt sind, werden diese möglicherweise von Karussellanzeigen automatisch angepasst. Indem Sie jedes Bild im gleichen Verhältnis (1:1 oder 4:5) bereitstellen, wird dies vermieden.

## Warum werden Produktbilder markiert oder abgelehnt?

Beide Plattformen listen nahezu identische Probleme auf. Überprüfen Sie zunächst Ihren Feed auf Folgendes:

| Problem | Google | Meta |
|---|---|---|
| Texteinblendungen, Aktionscodes, Handlungsaufforderungen | Nicht zulässig (Preis, Versand, Werbetext) | Nicht empfohlen (Overlay-Text, Handlungsaufforderungen, Aktionscodes) |
| Wasserzeichen, hinzugefügte Logos | Nicht zulässig, es sei denn, es ist physisch Teil des Produkts | Nicht empfohlen |
| Platzhalterbilder („Bild kommt bald“) | Nicht erlaubt | Vermeiden; Neue Bilder benötigen zum Aktualisieren eine neue URL |
| Grenzen | Nicht erlaubt | In der Spezifikation nicht erwähnt |
| Generische Grafiken anstelle des Produkts | Nicht erlaubt (Ausnahmen für einige Hardware-, Fahrzeug- und Softwarekategorien) | Das Bild muss das genaue Produkt darstellen |
| Zu klein | Bild nicht angezeigt (nach dem 31. Januar 2027) | Unter 500 x 500 Pixel entspricht die Spezifikation nicht |
| Crawler-Zugriff | Googlebot und Googlebot-image in robots.txt zulassen; Änderungen dauern 24 bis 48 Stunden | Nicht in der Spezifikation angegeben |
| Nicht übereinstimmender Dateityp | Die Erweiterung muss mit dem tatsächlichen Format übereinstimmen | Nur JPEG oder PNG |

Zwei futterspezifische Fallen sind leicht zu übersehen. Erstens möchte Google stabile URLs ohne dynamische Parameter wie Zeitstempel oder Sitzungs-IDs. Zweitens aktualisiert Meta ein ersetztes Bild nur dann, wenn die neue Datei eine andere URL hat, sodass das Überschreiben von `shoe.jpg` an Ort und Stelle Ihren Katalog nicht aktualisiert.

## Ein Export, der beide Feeds erfüllt

1. Beginnen Sie mit dem unkomprimierten Originalfoto.
2. Exportieren Sie ein 1:1-Quadrat mit 1500 x 1500 Pixel oder mehr als JPEG (unter 8 MB, bequem unter beiden Grenzwerten).
3. Platzieren Sie das Produkt auf etwa 75 bis 90 % des Rahmens auf einem sauberen Hintergrund.
4. Entfernen Sie Überlagerungen, Abzeichen, Wasserzeichen und Ränder aus dem Feedbild. Behalten Sie Werbeversionen für Anzeigen.
5. Verwenden Sie einen aussagekräftigen Dateinamen und eine stabile, crawlbare URL.
6. Fügen Sie zusätzliche Winkel in `additional_image_link` ein (Google: bis zu 10).

## Wo photoZseo passt

Wenn Sie Bilder für viele Marktplätze und Feeds vorbereiten, ändert [photoZseo](/de/download) auf iPhone und iPad die Größe, komprimiert und benennt Produktfotos für 46 Marktplätze von einem Foto aus, und der [Chrome-Erweiterung](/de/chrome-extension) macht dasselbe von Produktseiten mit SEO-Dateinamen und Massenexport. Unser [Leitfaden zur Bildgröße auf dem Marktplatz](/de/marketplace-image-sizes) listet die Zahlen pro Marktplatz auf.

*photoZseo ist mit keinem Marktplatz, Google oder Meta verbunden oder wird von diesen unterstützt. Überprüfen Sie vor einem großen Upload immer die aktuellen Richtlinien der Plattformen.*
