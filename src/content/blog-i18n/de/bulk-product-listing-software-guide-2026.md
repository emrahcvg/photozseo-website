---
title: "Software zur Massenproduktauflistung: So funktionieren CSV/XLSX-Uploads auf Amazon, eBay, Etsy, Shopify und Trendyol (2026)"
description: "So laden Sie Produkte in großen Mengen hoch: Vorlage jeder Plattform, erforderliche Felder und Bild-URL-Regeln für Amazon, eBay, Etsy, Shopify und Trendyol sowie eine Checkliste."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon und Trendyol akzeptieren Tabellen-Uploads. Bei Etsy ist dies nicht der Fall: In der Hilfe heißt es, dass Sie keine neuen Einträge in großen Mengen hochladen, sondern nur bestehende Einträge in großen Mengen bearbeiten können."
  - "Bei Bildern in einer Tabelle handelt es sich fast immer um URLs, nicht um angehängte Dateien. Die URL muss öffentlich und direkt sein und (auf Shopify und eBay) mit https:// beginnen."
  - "Die Vorlagen unterscheiden sich je nach Kategorie auf Amazon, eBay und Trendyol. Laden Sie daher für jede Kategorie eine neue Vorlage herunter und benennen Sie deren Überschriften niemals um."
faqs:
  - q: "Wie lade ich Produkte in großen Mengen auf eBay hoch?"
    a: "Gehen Sie im Seller Hub zu „Berichte“, dann „Hochladen“ und wählen Sie „Vorlage abrufen“ mit der Quelle „Angebote“. Füllen Sie die Datei aus und laden Sie sie hoch; eBay listet die Elemente wie angegeben auf. Verwenden Sie CSV oder XLSX."
  - q: "Kann ich neue Einträge mit einer CSV-Datei in großen Mengen auf Etsy hochladen?"
    a: "Im Hilfecenter von Etsy heißt es, dass Sie keine neuen Einträge in großen Mengen hochladen können, Sie können jedoch Einträge kopieren und bestehende in großen Mengen bearbeiten. Es gibt Tools von Drittanbietern, diese sind jedoch keine Etsy-Funktion."
  - q: "Benötigt Shopify Bild-URLs in der CSV?"
    a: "Ja. Bild-URLs in der CSV müssen öffentlich zugänglich sein, https:// verwenden und keinen Passwortschutz haben. Shopify lädt die Bilder während des Imports herunter."
  - q: "Welche Dateikodierung sollte eine Shopify-Produkt-CSV verwenden?"
    a: "Das Hilfecenter von Shopify fragt nach UTF-8 mit Zeilenenden im LF-Stil, durch Kommas getrennt, mit den Kopfzeilen in der ersten Zeile. Überprüfen Sie die Exporteinstellungen Ihrer Tabellenkalkulations-App."
  - q: "Wo lade ich eine Excel-Produktdatei auf Trendyol hoch?"
    a: "Im Verkäuferbereich unter „Produkt“, dann „Massenproduktvorgänge“, mit der Excel-Produkteingabeoption und dem Upload-Typ „Neues Produkt“. Jede Kategorie hat ihre eigene Vorlage."
  - q: "Warum wurde mein Bulk-Upload abgelehnt?"
    a: "Die häufigsten Ursachen sind bearbeitete Spaltenüberschriften, fehlende Pflichtfelder, private oder umleitende Bild-URLs und eine Vorlage aus der falschen Kategorie. Korrigieren Sie die Datei und laden Sie sie erneut hoch."
---

Das Hochladen von Massenprodukten bedeutet, eine Tabelle (CSV oder XLSX) mit einer Zeile pro Produkt zu erstellen und diese einmal hochzuladen, anstatt jeden Eintrag manuell zu erstellen. eBay, Shopify, Amazon und Trendyol unterstützen dies; Etsy erlaubt keine Massenerstellung neuer Einträge. Die beiden Regeln, die die meisten Fehler verursachen, sind überall gleich: Behalten Sie die Header der Vorlage genau so bei, wie sie angegeben sind, und geben Sie jedes Bild als öffentliche, direkte URL an.

*Zuletzt überprüft: November 2026. Überprüfte Quellen: Shopify Help Center, „Verwenden von CSV-Dateien zum Importieren und Exportieren von Produkten“; eBay Seller Hub-Hilfe, „Angebote in großen Mengen erstellen“ (Seller Hub-Berichte > Hochladen); Etsy-Hilfecenter, „Kann ich mehrere Einträge gleichzeitig erstellen oder bearbeiten?“; Amazon Seller Central-Hilfe, „Inventardateivorlagen“ und „Bildprobleme“ (über Suchauszüge lesen, siehe Hinweis unten); Trendyol Akademi Satıcı Bilgi Merkezi, „Excel Ürün Girişi“ und „Ürün Görseli Seçimi ve Yükleme“ (über Suchauszüge gelesen).*

## Wie gehen die einzelnen Plattformen mit Massen-Uploads um?

| Plattform | Massenerstellung? | Wo | Dateityp | Bildregel |
|---|---|---|---|---|
| Shopify | Ja | Produkte > Import | CSV, UTF-8, durch Kommas getrennt | Öffentliche https://-URLs |
| eBay | Ja | Verkäufer-Hub > Berichte > Hochladen > Vorlage abrufen | CSV oder XLSX | https:// URLs, bis zu 12 pro Eintrag, getrennt durch \ |  |
| Amazon | Ja | Produkte per Upload hinzufügen (Seller Central) | Kategoriespezifische Inventardateivorlage | Direkte URL; Weiterleitungen und Pop-ups werden abgelehnt |
| Trendyol | Ja | Produkt > Massenproduktvorgänge > Excel-Produkteintrag | Excel, eine Vorlage pro Kategorie | Link in der Spalte „Bildlink“. |
| Etsy | Nein (nur Bearbeiten) | Shop-Manager > Angebote | Nicht zutreffend | Nicht zutreffend |

## Wie können Sie Produkte in großen Mengen auf Shopify hochladen?

Das Hilfecenter von Shopify legt das Format fest: Die erste Zeile muss aus Spaltenüberschriften bestehen, die Spalten sind durch Kommas getrennt und die Datei sollte UTF-8 mit LF-Zeilenenden sein. Für neue Produkte ist nur `Title` erforderlich; Wenn Sie Varianten verwenden, ist auch `URL handle` erforderlich. Variantenspalten wie SKU benötigen ebenfalls `Option1 name` und `Option1 value`, andernfalls erstellt Shopify eine Standardvariante und löscht vorhandene beim Aktualisieren.

Bilder müssen öffentlich erreichbare `https://`-URLs ohne Passwortschutz sein. Shopify lädt sie beim Import herunter, sodass Sie sie anschließend entfernen können. Bilddateinamen können nach dem Hochladen nicht bearbeitet werden und dürfen keine `_thumb`-, `_small`- oder `_medium`-Suffixe enthalten. Videos und 3D-Modelle werden in CSV nicht unterstützt.

| Limit | Wert (Shopify-Hilfecenter) |
|---|---|
| Optionen pro Produkt | 3 |
| Bilder pro Produkt | 250 |
| Tags pro Produkt | 250 |
| Alt-Text | Maximal 512 Zeichen, 125 oder weniger empfohlen |
| SEO-Titel | 70 Zeichen |
| SEO-Beschreibung | 320 Zeichen |

Bekannte Fehlerursachen auf derselben Seite: Eine Datei mit den Spalten `Barcode` und `Barcodes` schlägt fehl; ein Teilsatz von Spalten mit gepackten Dimensionen schlägt fehl; Wenn „Überschreiben“ aktiviert ist, löschen leere Zellen vorhandene Werte. Für einen tieferen Vergleich mit der API-Route siehe [Shopify CSV vs. API](/de/blog/shopify-csv-vs-api-2026).

## Wie können Sie Einträge in großen Mengen auf eBay hochladen?

Das aktuelle Tool von eBay sind Seller Hub Reports. Gehen Sie zu Hochladen, klicken Sie auf Vorlage abrufen, wählen Sie die Listings-Quelle und einen Dateityp aus. XLSX ist die Standardeinstellung und CSV wird für erfahrene Verkäufer empfohlen; Ein XLSX-Download kann bis zu 10 Kategorien enthalten, jede auf einem eigenen Blatt. Laden Sie die fertige Datei hoch und eBay listet die Elemente wie angegeben auf.

Zu den erforderlichen Feldern zum Hinzufügen eines Eintrags gehören Aktion, Kategorie-ID, Titel (maximal 80 Zeichen), Format, Dauer, Startpreis, Menge, Zustands-ID, Beschreibung und URL des Artikelfotos. Auf der US-Website ist außerdem ein UPC (oder ein Äquivalent) in der entsprechenden artikelspezifischen Spalte erforderlich, und für Buchkategorien ist eine ISBN erforderlich.

Bild-URLs müssen mit `https://` beginnen, mit einer Dateierweiterung wie `.jpg` oder `.png` enden, maximal 2048 Zeichen lang sein und Leerzeichen durch `%20` ersetzen. Sie können bis zu 12 Bilder pro Eintrag auflisten, getrennt durch das Pipe-Zeichen (`|`). Bilder können selbst gehostet oder auf eBay Picture Services bereitgestellt werden. Bei Variationen bleiben Menge und Preis in der übergeordneten Zeile leer und jede untergeordnete Zeile verfügt über eine eigene.

## Wie können Sie Produkte in großen Mengen auf Amazon hochladen?

Amazon verwendet kategoriespezifische Inventardateivorlagen, die auf der Seite „Produkte per Upload hinzufügen“ in Seller Central generiert werden. Für Artikel, die noch nicht im Katalog enthalten sind, verwenden Sie die Produktvorlage, die Attribute als erforderlich, bedingt erforderlich oder empfohlen markiert. Für Artikel, die sich bereits im Katalog befinden, können Sie nach Produkt-ID suchen und eine vorab ausgefüllte Datei verwenden. Wählen Sie nach dem Hochladen den passenden Dateityp aus und überprüfen Sie den Verarbeitungsbericht für jede SKU.

Bei Bildern heißt es auf der Hilfeseite „Bildprobleme“ von Amazon, dass eine Popup- oder Weiterleitungs-URL nicht akzeptiert wird und der Upload nicht verarbeitet wird, sodass die URL direkt auf die Bilddatei verweisen muss. Menüpfade und akzeptierte Dateitypen variieren je nach Marktplatzregion. Befolgen Sie daher die Anweisungen in der Vorlage, die Sie herunterladen. Bildabmessungen finden Sie unter [Amazon-Produktfotospezifikationen](/de/blog/amazon-product-photo-specs-2026).

## Können Sie einen Massenupload auf Etsy durchführen?

Nicht für neue Angebote. In der Hilfe von Etsy heißt es, dass Sie keine neuen Einträge in großen Mengen hochladen können, und empfiehlt, einen Eintrag zu erstellen und ihn zu kopieren. Sie können bestehende Angebote im Shop-Manager in großen Mengen bearbeiten, einschließlich Titel, Tags, Beschreibungen, Preise, benutzerdefinierte Optionen, Verarbeitungsprofil und Lieferprofile. Tools, die angeblich Etsy-Einträge in großen Mengen erstellen, sind Produkte von Drittanbietern und keine Etsy-Funktion. Überprüfen Sie daher deren Bedingungen und API-Zugriff selbst.

## Wie können Sie Produkte in großen Mengen auf Trendyol hochladen?

Öffnen Sie im Verkäuferbereich „Produkt“, dann „Massenproduktvorgänge“ und verwenden Sie die Excel-Produkteingabeoption. Das Verkäuferinformationszentrum von Trendyol beschreibt eine Vorlage pro Kategorie, die durch einen Kategoriecode und den Upload-Typ „Yeni Ürün Ekle“ (Neues Produkt hinzufügen) identifiziert wird. Bilder finden Sie in der Spalte „Bildlink“ (Görsel Linki). Trendyol dokumentiert auch eine Galeriemethode: Laden Sie zuerst Bilder in die Bildergalerie hoch, mit Dateinamen, die dem Produktbarcode entsprechen (bei mehreren Bildern barcode_1, barcode_2), und kopieren Sie diese Namen dann in die Spalte. Ändern Sie das Format der Vorlage vor dem Hochladen nicht.

Der Wortlaut des Panels kann sich ändern. Überprüfen Sie daher die Schritte anhand der Vorlage in Ihrem eigenen Verkäuferkonto. Bildregeln für Trendyol und Hepsiburada finden Sie unter [Produktfotos von Trendyol und Hepsiburada](/de/blog/trendyol-hepsiburada-product-photos).

## Was sind die häufigsten Fehler beim Bulk-Upload?

1. Überschriften bearbeitet oder umbenannt. Vorlagen werden nach Kopfzeilentext abgeglichen. Übersetzen Sie sie nicht und ordnen Sie sie nicht neu an.
2. Falsche Kategorievorlage. Die Vorlagen Amazon, eBay und Trendyol unterscheiden sich je nach Kategorie.
3. Bild-URLs, die nicht direkt sind. Ein Link zu einer Webseite, einer Weiterleitung oder einem durch Anmeldung geschützten Ordner schlägt fehl.
4. Leerzeichen und Sonderzeichen in URLs. Leerzeichen kodieren (eBay fragt nach `%20`).
5. Falsche Kodierung oder falsches Trennzeichen. Excel kann Semikolons oder Nicht-UTF-8-Text exportieren.
6. Doppelte oder fehlende Identifikatoren (SKU, Barcode, URL-Handle).
7. Überschreiben Sie Überraschungen. Bei Shopify können leere Zellen vorhandene Daten löschen.

## Checkliste vor dem Hochladen

- Laden Sie für jede Kategorie und Plattform eine neue Vorlage herunter.
- Testen Sie mit 5 Zeilen vor dem vollständigen Katalog.
- Öffnen Sie jede Bild-URL in einem privaten Browserfenster. es sollte das Bild selbst zeigen.
- Überprüfen Sie Titel, Beschreibung und Tag-Limits anhand der aktuellen Richtlinien der Plattform.
- Bewahren Sie eine Sicherungskopie der Quelldatei und des Fehlerberichts der Plattform auf.

## Wo photoZseo passt

Massen-Upload-Dateien funktionieren nur mit den darin enthaltenen Bildern und Texten. photoZseo bereitet Produktfotos für 46 Marktplätze vor (Größenänderung, Komprimierung, SEO-Dateinamen, Entfernung des Hintergrunds auf dem Gerät) und exportiert CSV, XLSX oder JSON aus der iPhone- und iPad-App. Es werden für Sie keine Bilder gehostet oder auf Marktplätze hochgeladen, abgesehen vom Senden von Produkten an Shopify. Holen Sie sich die App auf den [Download-Seite](/de/download). Der [Chrome-Erweiterung](/de/chrome-extension) macht dasselbe für Produktseiten, die Sie auf einem Computer durchsuchen.

*photoZseo ist mit keinem Marktplatz verbunden oder wird von diesem unterstützt. Marktplatznamen werden nur zur Beschreibung der Kompatibilität verwendet.*

*Hinweis: Die Seiten Amazon, Seller Central und Trendyol Akademi konnten während der Überprüfung nicht vollständig geöffnet werden, daher stammen die Details für diese beiden Plattformen aus Suchauszügen der offiziellen Seiten. Überprüfen Sie immer die Vorlagenanweisungen in Ihrem eigenen Konto.*
