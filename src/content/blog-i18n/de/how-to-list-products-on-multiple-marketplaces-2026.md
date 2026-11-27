---
title: "So listen Sie Produkte gleichzeitig auf mehreren Marktplätzen auf (Workflow 2026)"
description: "Ein schrittweiser Multichannel-Workflow: ein Master-Produktdatensatz, ein Quellfotosatz, dann Größenanpassung pro Marktplatz, Titel und Prüfungen für Amazon, eBay und Etsy."
pubDate: 2026-11-27
readingMinutes: 7
tags: [multichannel, marketplaces, product-photos, listing, workflow]
tldr:
  - "Erstellen Sie einmal einen Stammdatensatz (Daten plus hochauflösendes Fotoset) und leiten Sie dann die Version jedes Marktplatzes daraus ab, anstatt jeden Eintrag von Grund auf neu zu beginnen."
  - "Fotos und Titel sind die Teile, die pro Kanal geändert werden müssen; Identifikatoren, Spezifikationen und Preislogik sollten im Stammdatensatz verbleiben."
  - "Überprüfen Sie vor dem Hochladen die aktuellen offiziellen Richtlinien jedes Kanals. eBay und Etsy veröffentlichen klare Größenrichtlinien; Für Amazon lesen Sie die Live-Seller Central-Regeln für Ihre Kategorie."
faqs:
  - q: "Kann ich dasselbe Produkt auf Amazon, eBay und Etsy anbieten?"
    a: "Ja, solange das Produkt in den Regeln jedes Marktplatzes zulässig ist und Sie die eigenen Auflistungs- und Bildrichtlinien jedes Kanals befolgen. Etsy schränkt insbesondere ein, was im Rahmen seiner Kreativitätsstandards verkauft werden darf. Überprüfen Sie daher zunächst die Berechtigung."
  - q: "Benötige ich für jeden Marktplatz ein anderes Foto?"
    a: "Kein anderes Foto, aber normalerweise ein anderer Export. Fotografieren Sie einmal mit hoher Auflösung, schneiden Sie dann zu, ändern Sie die Größe und legen Sie den Hintergrund für jeden Kanal fest. Behalten Sie mindestens ein unbearbeitetes Foto des echten Artikels dort, wo ein Marktplatz danach fragt (Etsy tut dies)."
  - q: "Welche Größe sollten meine Masterfotos haben?"
    a: "Größer als jeder Kanal braucht. Etsy empfiehlt, Fotos mit einer Breite und Höhe von mindestens 2000 Pixeln aufzulisten, und eBay empfiehlt etwa 1600 x 1600, sodass Sie mit einem Master mit 2000 Pixeln oder mehr auf jeder Seite eine saubere Verkleinerung durchführen können."
  - q: "Sollten Titel auf jedem Marktplatz identisch sein?"
    a: "Nein. Halten Sie die Fakten identisch, aber passen Sie Wortlaut und Länge an die Titelregeln des jeweiligen Kanals und die Art und Weise an, wie Käufer dort suchen. Lesen Sie die aktuellen Titelrichtlinien jeder Plattform, bevor Sie einen Titel kopieren."
  - q: "Ist ein Multichannel-Listing-Tool erforderlich?"
    a: "Nein. Eine Tabellenkalkulation und eine disziplinierte Ordnerstruktur können für einen kleinen Katalog funktionieren. Spezielle Tools helfen Ihnen, wenn Sie die Inventarsynchronisierung über viele SKUs und Kanäle hinweg verwalten."
---

Um Produkte auf mehreren Marktplätzen gleichzeitig aufzulisten, erstellen Sie einen Stammdatensatz pro Produkt (Kennzeichnungen, Spezifikationen, Abmessungen, eine Basisbeschreibung und einen hochauflösenden Fotoset) und generieren Sie dann die Version jedes Marktplatzes daraus: Ändern Sie die Größe und stellen Sie die Fotos entsprechend den Regeln dieses Kanals in den Hintergrund, schreiben Sie den Titel für diesen Kanal neu, laden Sie ihn hoch und führen Sie eine kurze Prüfung vor der Veröffentlichung durch. Nur wenn die Arbeit in dieser Reihenfolge erledigt wird, wird der Multichannel-Vertrieb nicht zu drei separaten Vollzeitjobs.

*Zuletzt überprüft: November 2026. Quellen werden in jedem Abschnitt genannt; Die Marktplatzregeln ändern sich. Überprüfen Sie dies daher vor dem Hochladen anhand der Live-Seiten.*

## Schritt 1: Erstellen Sie einen Master-Produktdatensatz

Bevor Sie einen Marktplatz eröffnen, bewahren Sie pro Produkt eine Zeile oder Datei mit den Fakten auf, die sich je nach Kanal nie ändern:

- Interne SKU und, sofern vorhanden, Barcodes (GTIN/UPC/EAN)
- Marke, Modell, Material, Farbe, Abmessungen, Gewicht
- Eine neutrale, sachliche Beschreibung und eine Feature-Liste
- Herkunftsland, Compliance-Hinweise und alle erforderlichen Warnhinweise
- Der Ordnerpfad des Masterfotosatzes

Jeder Marktplatz leiht sich dann von diesem Datensatz. Wenn sich eine Spezifikation ändert, korrigieren Sie sie einmal. Dies schützt Sie auch vor einer der häufigsten Ablehnungsursachen: Attribute, die zwischen Kanälen oder zwischen Titel und Foto nicht übereinstimmen.

## Schritt 2: Fotografieren Sie ein Masterfotoset

Fotografieren Sie einmal mit der höchstmöglichen Auflösung und lassen Sie die Originale unberührt. Ein nützliches Set ist:

1. Eine saubere Vorderansicht auf einem schlichten Hintergrund
2. Zwei oder drei Blickwinkel und ein Detailfoto
3. Ein Maßstabs- oder Nutzungsfoto
4. Gegebenenfalls ein Foto der Verpackung oder des Etiketts

Große Dinge fotografieren, weil auf Marktplätzen unterschiedliche Größen empfohlen werden. In den „Anforderungen und Best Practices für Bilder in Ihrem Etsy-Shop“ von Etsy wird empfohlen, Fotos mit einer Breite und Höhe von mindestens 2000 Pixeln aufzulisten, und in der Listungshilfe von eBay werden etwa 1600 x 1600 empfohlen. Mit einem Master von 2000 Pixeln oder mehr pro Seite können Sie für jeden Kanal verkleinern, ohne etwas hochskalieren zu müssen.

## Schritt 3: Fotos pro Marktplatz anpassen

Hierauf entfällt der größte Teil des Aufwands pro Kanal. In der folgenden Tabelle sind nur Zahlen aufgeführt, die im November 2026 auf den eigenen Hilfeseiten der Marktplätze bestätigt wurden.

| Marktplatz | Bestätigte Anleitung | Quelle |
|---|---|---|
| eBay | Mindestens 500 x 500 Pixel; empfohlen ca. 1600 x 1600; bis zu 24 Fotos pro Eintrag; max. 12 MB pro Foto; Als sichere Wahl wird ein einfacher weißer Hintergrund empfohlen | eBay Seller Center „Machen Sie tolle Fotos“; eBay-Hilfe „Hinzufügen von Bildern zu Ihren Einträgen“ |
| eBay (verboten) | Keine hinzugefügten Ränder, kein hinzugefügter Text/Grafik/Marketingmaterial, keine Wasserzeichen jeglicher Art | eBay Bildrichtlinie |
| Etsy | Mindestens 2000 px breit und hoch empfohlen; erstes Foto mindestens 635 px; Dateien über 1 MB werden bei langsamen Verbindungen möglicherweise nicht vollständig hochgeladen. sRGB; .jpg, .gif, .png, .svg oder .heic; kein animiertes GIF oder transparentes PNG | Etsy-Hilfe, „Anforderungen und Best Practices für Bilder in Ihrem Etsy-Shop“ |
| Etsy (Authentizität) | Mindestens ein unbearbeitetes Foto des tatsächlichen Artikels vor einem echten Hintergrund | Etsy Hilfe, gleicher Artikel |
| Amazon | Hauptbilder werden automatisch auf nicht-weiße Hintergründe sowie auf Text, Logos, Grafiken oder Wasserzeichen überprüft; Bilder, die scheitern, können zur Unterdrückung führen. Die Regeln für Pixel und Füllprozent variieren je nach Kategorie. Lesen Sie daher die Richtlinien für Livebilder für Ihre Kategorie | Amazon Seller Central Ankündigung zu Hauptbildprüfungen |

Beachten Sie, was nicht in der Tabelle enthalten ist: eine einzelne „Universalgröße“. Amazon, eBay und Etsy stimmen nicht überein, weshalb ein One-Size-Export irgendwo scheitert. Unser [Referenz zu Marktplatz-Bildgrößen](/de/marketplace-image-sizes) erfasst die Zahlen pro Kanal, und der [Leitfaden zur Größenänderung für mehrere Marktplätze](/de/blog/resize-product-photos-multiple-marketplaces) deckt die Batch-Export-Mechanik ab.

Eine praktische Regel: Erstellen Sie eine Version mit weißem Hintergrund für Kanäle, die sie bevorzugen, und behalten Sie eine Lifestyle- oder kontextbezogene Version für Kanäle bei, auf denen Käufer sie erwarten. Fügen Sie auf keiner Version Wasserzeichen, Ränder oder Werbetexte ein. Sowohl eBay als auch Amazon kennzeichnen sie.

## Schritt 4: Titel pro Kanal neu schreiben

Halten Sie die Fakten konstant und ändern Sie die Formulierung. Jede Plattform hat ihre eigenen Titelregeln, Zeichenbeschränkungen und Konventionen, die sich unterscheiden. Gehen Sie nicht davon aus, dass ein Titel, der auf einem Kanal akzeptiert wird, auch auf einem anderen gültig ist. Lesen Sie die aktuellen Titelrichtlinien für jede Kategorie, in der Sie auflisten.

Angemessene Standardeinstellungen, die kanalübergreifend gelten:

- Führen Sie mit dem Produkttyp und dem Unterscheidungsmerkmal, nach dem Käufer suchen
- Platzieren Sie Marke und Modell dort, wo die Plattform sie erwartet
- Vermeiden Sie Werbephrasen und übermäßige Symbole; Verkäufer melden sie häufig als Auslöser für eine Ablehnung. Überprüfen Sie daher die Titelrichtlinien jeder Plattform
- Verwenden Sie konsistente Attributwerte (Größe, Farbe) in den Feldern Titel, Foto und Struktur

Dateinamen und Alternativtext finden Sie unter [So benennen Sie Produktfotos für SEO](/de/blog/how-to-name-product-photos-for-seo).

## Schritt 5: Hochladen und dann eine Prüfung vor der Veröffentlichung durchführen

Laden Sie jeweils einen Marktplatz hoch, beginnend mit dem strengsten für Ihre Kategorie. Dann prüfen Sie:

| Überprüfen | Warum es wichtig ist |
|---|---|
| Das Foto entspricht der Mindestgröße und dem Mindestformat dieses Kanals | Verhindert Upload-Fehler und Soft-Thumbnails |
| Kein Wasserzeichen, Rahmen oder Werbetext hinzugefügt | Auf eBay und Amazon verboten oder gekennzeichnet |
| Der Hintergrund entspricht den Erwartungen des Kanals | Nicht-weiße Hauptbilder werden bei Amazon automatisch überprüft |
| Titel, Foto und Attribute stimmen überein (Farbe, Größe, Menge) | Nichtübereinstimmung ist eine häufige Ursache für Ablehnung |
| Bezeichner und Kategorie korrekt | Falsche Kategorie lässt erforderliche Attribute nicht übereinstimmen |
| Mindestens ein unbearbeitetes Originalfoto (Etsy) | Erforderlich für die Bildführung von Etsy |

Wenn eine Auflistung später unterdrückt wird, gehen wir in unserem Begleitbeitrag zu [Auflisten von Fehlern, die dazu führen, dass Produkte unterdrückt werden](/de/blog/listing-mistakes-that-get-products-suppressed-2026) auf die üblichen Ursachen ein.

## Häufige Fehler beim Multichannel-Listing

- Einen Export überall wiederverwenden. Eine 1 MB große Etsy-Datei und eine 1600 Pixel große eBay-Datei sind unterschiedliche Exporte desselben Masters.
- Bearbeiten des Originals. Exportieren Sie immer Kopien. Überschreiben Sie niemals den Master.
- Titel wörtlich kopieren. Regeln und Suchverhalten unterscheiden sich je nach Plattform.
- Daten treiben lassen. Wenn Preis, Lagerbestand oder Spezifikationen an drei Stellen vorhanden sind, weichen sie voneinander ab. Bewahren Sie sie im Stammsatz auf.
- Ignorieren der Berechtigung. Einige Kanäle schränken den Verkauf ein; Die Kreativitätsstandards von Etsy entfernen beispielsweise Einträge, die nicht qualifiziert sind.

## Wo photoZseo passt

Wenn Ihre Quellfotos von einem Telefon stammen, kann photoZseo für iOS und iPadOS 17+ die Größe eines Fotosets für 46 Marktplätze ändern, komprimieren und umbenennen, Hintergründe auf dem Gerät entfernen und CSV, XLSX oder JSON exportieren. Wenn Sie Fotos und Details von vorhandenen Produktseiten auf einem Computer sammeln, funktioniert der [Chrome-Erweiterung](/de/chrome-extension) über das Browser-Seitenfeld. Pläne finden Sie unter [Preisgestaltung](/de/pricing). In beiden Fällen ist der oben beschriebene Arbeitsablauf derselbe: ein Master, viele Exporte.

photoZseo ist mit keinem Marktplatz verbunden oder wird von diesem unterstützt. Marktplatznamen werden nur zur Beschreibung der Kompatibilität verwendet.
