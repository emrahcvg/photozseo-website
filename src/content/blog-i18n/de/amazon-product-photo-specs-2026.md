---
title: "Amazon-Produktfotoanforderungen im Jahr 2026"
description: "Genaue Größen, Dateitypen und Hintergrundregeln, die Amazon bei Produktbildern durchsetzt – und wie diese beim ersten Upload weitergegeben werden."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "Das Hauptbild von Amazon muss mindestens 1000×1000 groß sein (2000×2000 empfohlen), 1:1 quadratisch, reinweißer #FFFFFF-Hintergrund, JPEG, sRGB, unter 10 MB."
  - "Die schnellste Ablehnung verursacht: nahezu weißes statt echtes Weiß, Produkt kleiner als 85 % des Rahmens, Wasserzeichen oder Text auf dem Hauptbild."
  - "Bleiben Sie nach der Komprimierung unter 600 KB pro Bild – das CDN von Amazon kodiert alles, was größer ist und die Seitengeschwindigkeit erhöht, neu in Ihren Conversion-Rang."
faqs:
  - q: "Was ist die Mindestbildgröße für Amazon-Produktfotos?"
    a: "1000 Pixel auf der längsten Seite sind das absolute Minimum. Darunter deaktiviert Amazon die Zoomfunktion für Ihren Eintrag – und Einträge ohne Zoom werden durch den Algorithmus herabgestuft. Streben Sie 2000×2000 an, um Amazon Raum zum erneuten Komprimieren ohne Erweichung zu geben."
  - q: "Ist JPEG oder PNG besser für Amazon-Einträge?"
    a: "JPEG. Amazon akzeptiert auch TIFF, PNG und GIF, aber JPEG wird kleiner komprimiert, verarbeitet schneller auf dem CDN von Amazon und es gibt keinen Transparenzvorteil auf einem #FFFFFF-Hintergrund. Sparen Sie im sRGB-Farbraum, Qualität 80–85."
  - q: "Benötigt Amazon für jedes Foto einen reinweißen Hintergrund?"
    a: "Nur das Hauptbild – das ist die Regel, die Amazon mit automatisierten Prüfungen durchsetzt. Sekundärbilder können das Produkt im Kontext, an einem Modell, mit Verpackung oder in Lifestyle-Szenen zeigen. Das erste Foto zeigt den Pförtner."
  - q: "Wie groß soll das Produkt im Rahmen sein?"
    a: "Die Richtlinie von Amazon beträgt mindestens 85 % des Bildes. Kleinere Produkte bestehen häufig die automatische Überprüfung nicht oder werden bei Kategorieprüfungen manuell gekennzeichnet. Zentrieren Sie das Produkt und schneiden Sie es fest zu."
  - q: "Kann ich HEIC-Fotos von meinem iPhone auf Amazon hochladen?"
    a: "Nein. Amazon erwartet JPEG, TIFF, PNG oder GIF. Konvertieren Sie HEIC vor dem Hochladen in JPEG – die Amazon-Voreinstellung von photoZseo führt dies automatisch durch und schneidet die Datei ohne sichtbaren Qualitätsverlust auf 200–600 KB zu."
---

Amazon lehnt Angebote ab, bevor die meisten Verkäufer sie jemals sehen. Der Schuldige ist fast immer das Foto – eine zu große Datei, ein Hintergrund, der nicht wirklich weiß ist, oder ein Seitenverhältnis, das die Plattform stillschweigend ablehnt.

Hier ist der Spickzettel zu den Spezifikationen für 2026, der der Verkäuferdokumentation von Amazon entnommen und anhand von Live-Angeboten getestet wurde.

## Hauptbildregeln

- Abmessungen: mindestens 1000×1000, 2000×2000 empfohlen. Unter 1000 auf der längsten Seite aktiviert Amazon den Zoom nicht – und der Algorithmus behandelt Auflistungen ohne Zoom als schlechtere Qualität.
- Seitenverhältnis: Quadratisch (1:1) für das Hauptbild. Sekundärbilder können 4:5 oder 16:9 sein.
- Hintergrund: Reinweiß, Hex `#FFFFFF`. „Nahezu weiß“ fotografierte Studios fallen bei automatischen Kontrollen häufiger durch als Verkäufer erwarten.
- Format: JPEG (`.jpg`) ist die sicherste Wahl. TIFF, PNG und GIF werden akzeptiert, aber JPEG lässt sich besser komprimieren und verarbeitet schneller auf dem CDN von Amazon.
- Farbraum: sRGB. In Adobe RGB oder ProPhoto gespeicherte Bilder erscheinen nach der Neukodierung von Amazon langweilig.
- Dateigröße: Unter 10 MB pro Bild. Streben Sie nach der Komprimierung eine Größe von 200–600 KB an – große Dateien verlangsamen das Laden der Produktseite und beeinflussen die Seitengeschwindigkeit bei der Konvertierung.

## Wodurch wird eine Auflistung unterdrückt?

1. Wasserzeichen, Texteinblendungen oder Logos auf dem Produktbild.
2. Requisiten, die nicht im Lieferumfang des Kunden enthalten sind.
3. Rahmen, Rahmen oder ein anderer Hintergrund als reines Weiß für das Hauptbild.
4. Das Produkt nimmt weniger als 85 % des Bildrahmens ein.
5. Schaufensterpuppen (für Bekleidung) oder sichtbare Stützvorrichtungen.

## Wie photoZseo die Spezifikation anwendet

Die Amazon-Voreinstellung in photoZseo erledigt vier Dinge gleichzeitig:

1. Schneidet es auf einen quadratischen Rahmen zu, wobei das Produkt auf 85 % der Leinwand zentriert ist.
2. Ändert die Größe der längsten Seite auf 2000 Pixel (wird intelligent hochskaliert, wenn die Quelle kleiner ist).
3. Schreibt ein sauberes JPEG mit sRGB, Qualität 85 – normalerweise 250–450 KB.
4. Wenn die Hintergrundentfernung aktiviert ist, wird der Hintergrund, auf dem Sie fotografieren, durch reines #FFFFFF ersetzt und die Kanten werden weichgezeichnet, damit das Produkt nicht wie ausgeschnitten aussieht.

Die gesamte Pipeline läuft auf dem Telefon. Nichts verlässt Ihr Gerät.

## Eine kurze Compliance-Checkliste

Bestätigen Sie vor dem Hochladen Folgendes:

- [ ] Längste Seite ist ≥1000 px (2000 px bevorzugt)
- [ ] Hintergrund besteht einen „White-Picker“-Test – die vier Ecken werden als `#FFFFFF` angezeigt
- [ ] Die Datei ist weniger als 10 MB groß und wird als JPEG gespeichert
- [ ] Das Seitenverhältnis beträgt 1:1 für das Hauptbild
- [ ] Kein Text, Wasserzeichen oder Rahmen

Wenn alle fünf ausgecheckt sind, besteht die Auflistung die automatische Validierung von Amazon beim ersten Versuch – und Sie überspringen das Hin und Her, das die Startzeit verkürzt.
