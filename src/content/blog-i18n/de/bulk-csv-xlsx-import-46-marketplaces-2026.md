---
title: "Massenimport von CSV/XLSX in 46 Marktplätze – automatische Erkennung von 41 Plattformen"
description: "Legen Sie einen Shopify-, Amazon- oder Etsy-Export in photoZseo ab. Wir erkennen 41 Plattformsignaturen, ziehen Fotos parallel und exportieren sie erneut auf 46 Marktplätze."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo akzeptiert CSV-, TSV-, XLSX- und JSON-Kataloge – und erkennt automatisch 41 Plattformsignaturen aus den Spaltenüberschriften der Datei."
  - "Produktfotos werden parallel von URLs in der Datei abgerufen. Schalten Sie WLAN nur um, wenn Sie keine Mobilfunkdaten brennen möchten."
  - "Exportieren Sie denselben Katalog erneut auf 46 Marktplätze, jeder mit eigenen SEO-Dateinamen, plattformrichtigen Bildgrößen und Spaltenreihenfolge."
faqs:
  - q: "Welche Dateiformate kann ich in photoZseo importieren?"
    a: "CSV, TSV, XLSX und JSON. Jeder kann Produkttitel, Beschreibungen, Preise, SKUs, Barcodes und Foto-URLs enthalten. Die meisten Verkäufer fügen ihren vorhandenen Shopify- oder Amazon-Export hinzu und überspringen die Zuordnung vollständig."
  - q: "Was bedeutet „Automatische Erkennung von 41 Plattformsignaturen“ in der Praxis?"
    a: "photoZseo prüft die Spaltenüberschriften der Datei und gleicht sie mit 41 bekannten Plattform-Exportschemata ab – Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce und 33 anderen. Wenn Ihre Datei von einer dieser Plattformen stammt, erfolgt die Zuordnung automatisch."
  - q: "Werden beim Importieren von Fotos von URLs meine mobilen Daten verwendet?"
    a: "Nur wenn Sie es zulassen. In den Importeinstellungen ist die Option „Nur WLAN“ standardmäßig aktiviert. Wenn diese Option aktiviert ist, werden Downloads automatisch angehalten und fortgesetzt, wenn Sie das Netzwerk wechseln. Wenn die Option deaktiviert ist, wird die aktive Verbindung verwendet."
  - q: "Was passiert, wenn mein Katalog 5.000 Produkte enthält?"
    a: "photoZseo importiert stapelweise und sorgt dafür, dass die Benutzeroberfläche reagiert. Foto-URL-Downloads laufen parallel – die praktische Grenze ist Ihre Bandbreite, nicht die App. Ein Katalog mit 5.000 Zeilen und Foto-URLs landet in der Regel innerhalb von 10 bis 20 Minuten über ein normales Heim-WLAN."
  - q: "Kann ich auf einen anderen Marktplatz als den der Quelle erneut exportieren?"
    a: "Ja – das ist der Punkt. Importieren Sie einen Shopify-Katalog, klicken Sie auf „Exportieren“ und wählen Sie Amazon (oder Etsy oder Trendyol) aus. photoZseo erstellt die Datei in der genauen Spaltenreihenfolge der Zielplattform neu, wobei die Größe der Bilder an die Spezifikationen dieser Plattform angepasst wird."
---

Das Schwierigste beim Verkaufen auf einem neuen Marktplatz ist nicht der Marktplatz. Es geht darum, Ihre vorhandenen 800 Produkte einzufügen, ohne jeden Titel neu eingeben, jedes Foto neu hochladen und jede Spalte neu zuordnen zu müssen.

Der Massenkatalogimport von photoZseo übernimmt den Roundtrip. Geben Sie eine Datei ein, die Sie bereits haben, und Sie sind zu 80 % auf dem Weg zu einer neuen Plattform.

## Warum es einen Massenimport gibt

Wenn Sie ein Amazon FBA-Verkäufer sind, der Trendyol hinzufügt, ein Etsy-Shop, der zu TikTok Shop erweitert wird, oder ein Shopify-Shop, der zu Walmart wechselt, ist Ihr Katalog bereits vorhanden. Sie haben es einmal exportiert. Das Problem besteht darin, dass jede Plattform ein etwas anderes Schema verwendet – unterschiedliche Spaltennamen, unterschiedliche Bildspezifikationen, unterschiedliche Produkttaxonomien. Die manuelle Korrektur erfordert stundenlange Tabellenkalkulationsarbeit pro neuem Kanal.

photoZseo kürzt es auf Minuten.

## Was wird importiert?

Der Importer liest vier Formate:

- CSV – Shopify-Produktexporte, Amazon-Flatfile-Uploads, Trendyol-Massenvorlagen.
- TSV – tabulatorgetrennte Varianten aus älteren oder hauseigenen Systemen.
- XLSX – Excel-Dateien mit Mehrblattkatalogen.
- JSON – API-Exporte oder interne Produkt-Feeds.

Jedes kann Titel, Beschreibungen, Preise, SKUs, Barcodes, Variantenachsen (Größe, Farbe), Inventar und – ganz wichtig – Foto-URLs enthalten. Sobald sie in photoZseo gespeichert sind, steuern dieselben Daten Angebote, Exporte und SEO-Autofill.

## Automatische Erkennung auf 41 Plattformen

Das Killerfeature ist nicht die Formatunterstützung. Es ist die automatische Erkennung.

photoZseo prüft die Spaltenüberschriften der Datei und gleicht sie mit 41 bekannten Plattform-Exportschemata ab:

- Westliche Marktplätze: Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- Türkisch: Trendyol, Hepsiburada, N11
- Grenzüberschreitendes Asien: AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- Lateinamerika: Mercado Libre, Coupang
- Europa: Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...und 17 weitere.

Wenn Ihre Datei von einer dieser Dateien stammt, erkennt photoZseo sie beim Ablegen. Kein Spaltenzuordnungsassistent. Keine Aufforderung „Was bedeutet dieser Header?“ Es funktioniert einfach.

## Foto-URLs werden parallel gezogen

Die meisten Katalogexporte enthalten Foto-URLs, keine eingebetteten Bilder. photoZseo lädt sie parallel herunter – mehrere Verbindungen, intelligente Wiederholung, Perceptual-Hash-Deduplizierung, damit das gleiche Produktfoto nicht zweimal importiert wird.

Standardmäßig ist die Option „Nur WLAN“ aktiviert. Damit eingeschaltet:

- Downloads werden angehalten, wenn Sie das WLAN verlassen, und fortgesetzt, wenn Sie zurückkommen.
- Keine Mobilfunküberraschung auf Ihrer Telefonrechnung.
- Ein Import von 2.000 Produkten belastet Ihren Datentarif nicht.

Wenn es ausgeschaltet ist, nutzt photoZseo die jeweils aktive Verbindung – nützlich am Schreibtisch über WLAN im Büro.

## Ein praktischer Workflow

Hier ist die Hin- und Rückfahrt, die die meisten Verkäufer durchführen:

Schritt 1 – Export von der Quellplattform. Mit Shopify, Amazon oder Etsy können Sie Ihren Katalog als CSV/XLSX herunterladen. Schnapp es dir.

Schritt 2 – Legen Sie die Datei in photoZseo ab. Klicken Sie auf iPhone in einem beliebigen Projekt auf „Importieren“. Ziehen Sie es auf iPad aus Dateien hinein. Die automatische Erkennung identifiziert die Plattform und beginnt im Hintergrund mit dem Abrufen von Foto-URLs.

Schritt 3 – Lassen Sie [KI füllt die SEO-Felder](/features/seo-filenames). photoZseo schreibt Titel, Slug, Meta-Beschreibung, Alternativtext, Tags und Schlüsselwörter für jedes Produkt, in 12 Sprachen, wenn Sie international verkaufen.

Schritt 4 – Export auf einen neuen Marktplatz. Wählen Sie das Ziel – Amazon, Trendyol, Walmart, was auch immer. photoZseo schreibt die Datei in der genauen Spaltenreihenfolge dieser Plattform neu, passt die Größe der Bilder an die Plattformspezifikationen an und verpackt das Ergebnis als einzelne ZIP-Datei.

Schritt 5 – Auf den neuen Kanal hochladen. Die Ausgabedatei ist bereit für jedes Massen-Upload-Tool, das das Ziel verwendet.

Was früher eine Woche Tabellenkalkulation war, ist eine 30-minütige Mittagspause.

## Warum dies für grenzüberschreitende Verkäufer wichtig ist

Das größte Hindernis für die Expansion über Ihren Heimatmarkt hinaus sind die Kosten für die Katalogkonvertierung. Die meisten Verkäufer bleiben bei Amazon US, nicht weil Amazon US am besten ist, sondern weil der Wechsel zu Mercado Libre oder Trendyol bedeutet, dass der Katalog von Grund auf neu erstellt werden muss.

Der Massenimport + 46 Marktplatz-Voreinstellungen beseitigt diesen Blocker. In jeden Kanal fließen die gleichen Produktdaten. Neue Marktplätze sind ein Funktionswechsel, kein Projekt.

Für unabhängige Verkäufer, die weltweit versenden möchten, ohne einen Katalogmanager engagieren zu müssen, ist dies die Lösung.
