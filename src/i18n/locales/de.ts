import type { HomeContent } from '../home';

const de: HomeContent = {
  nav: {
    features: 'Funktionen', pricing: 'Preise', faq: 'FAQ',
    blog: 'Blog', support: 'Support', getApp: 'App holen',
  },
  hero: {
    eyebrow: 'Jetzt auf iPhone · iPad · Mac',
    h1Line1Words: ['Einmal', 'listen.'],
    h1Line2Words: ['Auf', '46+', 'Marktplätzen', 'verkaufen.'],
    h1A11y: 'Einmal listen. Auf 46+ Marktplätzen verkaufen.',
    sub: 'Produktfotos in Studio-Qualität, KI-geschriebenes SEO, B2B-Angebote und plattformperfekte Exporte — alles direkt aus deinem iPhone. Kein Computer. Keine Tabelle. Keine Cloud.',
    btnAppSmall: 'Laden im',
    btnAppBig: 'App Store',
    ctaTrial: '3 Tage kostenlos testen',
    ctaCard: 'Keine Karte · Jederzeit kündbar',
    bullets: [
      'Wähle dein Format — JPEG, PNG und WebP werden gemeinsam exportiert',
      'KI füllt 13 SEO-Felder aus einem einzigen Foto',
      '46+ Marktplätze, ein Tipp · 100 % auf dem Gerät · funktioniert offline',
    ],
  },
  pain: {
    kicker: 'Darum gibt es photoZseo',
    title: 'Verkaufen auf jedem Marktplatz ist kaputt.',
    sub: 'Du bist Verkäufer, kein Photoshop-Techniker. photoZseo gibt dir die Stunden zurück.',
    cards: [
      {
        bad: '"Fotos für jede Plattform zu bearbeiten frisst meinen ganzen Abend."',
        goodTitle: 'Die KI macht das in 2 Sekunden.',
        goodDesc: 'Hintergrunderkennung, Zuschnitt, Weißabgleich, Exportgrößen — für jede Plattform, automatisch.',
      },
      {
        bad: '"Ich tippe Titel, Tags und Beschreibung für jeden Marktplatz neu."',
        goodTitle: 'Ein Foto. 13 SEO-Felder. Ausgefüllt.',
        goodDesc: 'Titel, Slug, Meta, Alt-Text, Keywords — geschrieben von KI auf dem Gerät, in 12 Sprachen.',
      },
      {
        bad: '"Meine B2B-Angebote sind peinliche Word-Dokumente."',
        goodTitle: 'Markenstarke PDFs in 3 Schritten.',
        goodDesc: 'USt., IBAN, HS-Codes, E-Signatur, Betrag in Worten — sieht aus wie eine Fortune-500-Rechnung.',
      },
    ],
  },
  features: {
    sectionKicker: 'Alle Funktionen in einem Scroll',
    sectionTitle: 'Zehn Funktionen. Ein Swipe.',
    sectionSub: 'Horizontal scrollen. Vertikal auf dem Smartphone.',
    seeInAction: 'Live ansehen →',
    items: [
      {
        eyebrow: '46+ Marktplätze',
        h: 'Einmal listen. Überall verkaufen.',
        sub: 'Ein Foto wird zu 46+ marktplatzfertigen Listings — passend skaliert, benannt und SEO-getaggt für jede Plattform.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Grenzüberschreitend: Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — pro Produkt einzeln oder kombiniert',
        ],
      },
      {
        eyebrow: 'KI-Kamera · Eine Aufnahme, jedes Format',
        h: 'Ein Auslöser. Jedes Format, gleichzeitig.',
        sub: 'Wähle dein Seitenverhältnis (1:1, 4:5, 9:16 oder 3:4). Einmal auslösen — photoZseo schreibt JPEG, PNG und WebP parallel und passt die Größe für jeden Marktplatz an. Keine zweite Aufnahme, kein Batch-Export.',
        bullets: [
          'Eine Aufnahme → JPEG + PNG + WebP, gemeinsam gespeichert',
          'Größenanpassung pro Plattform beim Export: Amazon, Shopify, Etsy, Instagram…',
          'AE Lock · WB Auto · Hintergrunderkennung · Motiv automatisch zentrieren',
          'Serienaufnahme, Lautstärketasten-Auslöser, Raster + Wasserwaage · 100 % offline',
        ],
      },
      {
        eyebrow: 'KI-SEO Auto-Fill',
        h: '13 Felder in Sekunden ausfüllen.',
        sub: 'Foto reinziehen. photoZseo schreibt Titel, Slug, Meta-Beschreibung, Alt-Text, Tags und Keywords — sofort suchoptimiert.',
        bullets: [
          'OCR + Vision auf dem Gerät: Barcode, Marke, Material, Farbe',
          'SEO-tauglicher Titel, Slug, Meta, Alt-Text und Long-Tail-Keywords',
          '12 Sprachen — lokal korrekte Ausgaben',
        ],
      },
      {
        eyebrow: 'B2B-Angebotsersteller',
        h: 'Markenstarke PDF-Angebote in 3 Schritten.',
        sub: 'Produkte wählen, Kunden hinzufügen, teilen. USt., IBAN, Incoterms, HS-Codes und E-Signatur — alles auf einem stilvoll gebrandeten PDF.',
        bullets: [
          'Pro Position: USt. · Einheit · HS-Code · Herkunftsland',
          'Absenderprofil mit Logo, IBAN, Incoterms — einmal speichern',
          'Betrag in Worten, E-Signatur, fortlaufende Angebotsnummern',
        ],
      },
      {
        eyebrow: 'Stories, die verkaufen',
        h: 'WhatsApp, Telegram & Instagram — ein Tipp.',
        sub: 'Erstelle eine Status-/Story-Warteschlange für jeden Kontakt. 9:16 für Instagram, 1:1 für WeChat, 3:4 für RED — automatisch formatiert.',
        bullets: [
          'Smarte Sticker: Preis, Badge, Rabatt, Neuheit',
          'Round-Robin-Warteschlange mit 7-Tage-Cooldown pro Kontakt',
          'In Stories, Katalog teilen oder lokal speichern',
        ],
      },
      {
        eyebrow: 'Produktdetail',
        h: 'Verwalte wie ein Profi.',
        sub: 'Ein Produkt, jeder Kanal. Fotos, Preise, SEO, EXIF und Stories leben in einem einzigen, sauber organisierten Datensatz.',
        bullets: [
          'Foto-Karussell, Medien-Inspector, EXIF-Inline-Editor',
          'Pro Produkt: Aufschlag, MSRP, B2B-Preis, USt.-Modus',
          'Schnell teilen: Angebot, Story, Katalog oder Marktplatz',
        ],
      },
      {
        eyebrow: 'Profi-Metadaten',
        h: 'EXIF in Kameraqualität, bei jeder Aufnahme.',
        sub: 'EXIF, Maße und Format werden für jede Plattform geschrieben. GPS wird automatisch entfernt. IPTC- und Artist-Tags bleiben erhalten.',
        bullets: [
          '9 EXIF-Felder inline bearbeitbar (Artist, Copyright, Software…)',
          'GPS-Daten werden beim Export standardmäßig entfernt — Privatsphäre zuerst',
          'Jede Aufnahme wird gleichzeitig in JPEG + PNG + WebP gespeichert — kein Re-Export, kein Qualitätsverlust',
        ],
      },
      {
        eyebrow: 'Universelle App',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS und Mac Catalyst. Drag-and-Drop, Mehrfachauswahl, Seitenleiste, Inspector — synchron über iCloud Drive.',
        bullets: [
          'Drag-and-Drop auf iPad und Mac · Mehrfachauswahl-Export',
          'Tastaturkürzel, Rechtsklick-Menüs, Sidebar-Navigation',
          'iCloud Drive-Sync — auf jedem Gerät, nichts geht verloren',
        ],
      },
      {
        eyebrow: 'Privatsphäre zuerst',
        h: 'Kein Tracking. Keine Werbung. Keine Clouds.',
        sub: 'Gebaut für Verkäufer, die der Cloud nicht trauen. DSGVO-, KVKK- und CCPA-konform. 12 Sprachen, darunter 4 RTL-Schriften.',
        bullets: [
          'GDPR · KVKK · CCPA — keine Analytics, keine Drittanbieter-SDKs',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'KI läuft auf dem Gerät — deine Fotos verlassen es nie',
        ],
      },
      {
        eyebrow: 'Preise',
        h: 'Kostenlos starten. Pro, wenn du bereit bist.',
        sub: 'Starte kostenlos. Upgrade erst, wenn du auf jeden Marktplatz exportieren willst. Jederzeit kündbar, keine Karte für die Testphase.',
        bullets: [
          'Für immer kostenlos für Aufnahme, Organisation und Basis-Export',
          'Pro fügt 46+ Marktplatzformate, KI-SEO, B2B-Angebot hinzu',
          '3 Tage kostenlos testen · $39.99/Jahr · nur $3.33/Monat',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'Mehr als Screenshots',
    headTitle: 'Wie ein Profi-Tool gebaut, wie eine App bepreist.',
    headSub: 'Jeder Abschnitt unten ist eine Funktion, die heute live ist — keine Roadmap, keine Warteliste.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: 'Marktplatzformate — Titel einmal eintippen, jede Spalte füllt sich.',
    },
    exif: {
      label: 'EXIF in Kameraqualität',
      gpsStripped: '— ENTFERNT —',
    },
    langs: {
      label: '12 Sprachen · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: 'Gebaut für Indie-Verkäufer',
      marketplaces: 'Marktplätze',
      seoFields: 'SEO-Felder pro Foto',
      devices: 'Geräte · eine App',
      noTrackers: 'Tracker · Werbung · Clouds',
    },
  },
  seoDemo: {
    kicker: 'Interaktiv · Live',
    title: 'Sieh zu, wie die KI 13 SEO-Felder ausfüllt.',
    sub: 'Wähle ein Produkt. Beobachte, wie photoZseo jedes Feld schreibt, das dein Marktplatz braucht — Titel, Slug, Kategorie, Meta, vollständige Beschreibung, Alt-Text, Tags, Keywords und Barcode. Tippe auf ein Feld, um zu kopieren.',
    inputLabel: 'Produktname',
    inputPlaceholder: 'Produktnamen eingeben…',
    btnIdle: '✨ 13 SEO-Felder automatisch ausfüllen',
    btnBusy: 'Wird erstellt…',
    note: 'Auf dem Gerät · 100 % privat · 12 Sprachen',
    fieldLabels: {
      title: 'SEO-Titel',
      slug: 'Slug',
      filename: 'Dateiname (URL)',
      category: 'Kategorie',
      meta: 'Meta-Beschreibung',
      description: 'Beschreibung',
      alt: 'Alt-Text',
      tag1: 'Tag 1',
      tag2: 'Tag 2',
      tag3: 'Tag 3',
      tag4: 'Tag 4',
      keywords: 'Keywords',
      barcode: 'Barcode',
    },
  },
  stats: {
    kicker: 'Zahlen, die Produkte bewegen',
    title: 'Entwickelt von einem Indie-Verkäufer.\nGetestet von Käufern in 12 Ländern.',
    labels: {
      marketplaces: 'Marktplätze & Kanäle',
      seoFields: 'SEO-Felder pro Foto',
      languages: 'Sprachen — inkl. RTL',
      zero: 'Werbung. Tracker. Gesammelte Daten.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'Niemals Tracking',
    },
  },
  pricing: {
    kicker: 'Preise',
    title: 'Schneller verkaufen — keine Wasserzeichen, keine Limits.',
    sub: 'Drei Pläne, ein Pro-Erlebnis. Teste das Jahresabo 3 Tage kostenlos, dann nur $3.33/Monat — jederzeit in den Einstellungen kündbar.',
    badge: 'Bestes Angebot · 52 % sparen',
    plans: [
      {
        name: 'Wöchentlich',
        pricePer: '$2.99/Woche',
        features: [
          'Voller Pro-Zugriff',
          'Eine Woche zum Testen',
          'Jederzeit in den Einstellungen kündbar',
          '— Keine langfristige Bindung',
        ],
        cta: 'Wöchentlich starten',
      },
      {
        name: 'Monatlich',
        pricePer: '$6.99/Monat',
        features: [
          'Voller Pro-Zugriff',
          'Monatliche Abrechnung, jederzeit kündbar',
          'Gleiche Funktionen wie Jahresabo',
          '— Mit Jahresabo 52 % sparen',
        ],
        cta: 'Monatlich wählen',
      },
      {
        name: 'Jährlich',
        pricePer: '$39.99/Jahr',
        trial: '3 Tage kostenlos testen · nur $3.33/Monat · 52 % sparen',
        featured: true,
        features: [
          '**Wasserzeichen entfernen** in allen Exporten',
          '**Batch-Export** für alle Fotos auf einmal',
          '**CSV + XLSX** für 46+ Marktplätze',
          '**Video + Pro Tools** (Kamerastudio, Hintergrundentfernung)',
          'KI-SEO Auto-Fill (13 Felder, 12 Sprachen)',
          'B2B-Angebotsersteller (USt., IBAN, HS, E-Sign)',
          'Stories & smarte Sticker',
          'EXIF-Editor und Metadaten-Pipeline',
          'iPhone, iPad und Mac universell',
          'iCloud Drive-Sync',
        ],
        cta: '3 Tage kostenlos testen',
      },
    ],
    note: 'Preise in USD. Lokale Preise im App Store (z. B. ₺39.99/Jahr in der Türkei). Familienfreigabe unterstützt. Abos verlängern sich automatisch, wenn sie nicht mindestens 24 Std. vor Periodenende gekündigt werden — verwalten unter Einstellungen → Apple ID → Abonnements.',
  },
  faq: {
    kicker: 'Fragen',
    title: 'Alles, was du wissen wolltest.',
    items: [
      {
        q: 'Funktioniert photoZseo ohne Internet?',
        a: 'Ja. Fotoaufnahme, Bearbeitung, KI-SEO-Auto-Fill, EXIF und Exporte laufen alle zu 100 % auf dem Gerät mit Apple Foundation Models und Vision. Internet wird nur benötigt, wenn du aktiv an einen externen Marktplatz pushst.',
      },
      {
        q: 'Kann ich gleichzeitig zu Amazon, Shopify und Etsy exportieren?',
        a: 'Ja. Produkte wählen, Plattformen wählen, Export drücken. photoZseo schreibt CSV/XLSX/JSON in der exakten Spaltenreihenfolge jeder Plattform, plus plattformspezifische Bildgrößen — pro Produkt einzeln oder als eine kombinierte Datei.',
      },
      {
        q: 'Werden meine Fotos oder Produktdaten irgendwohin hochgeladen?',
        a: 'Nein. Null Drittanbieter-Analytics, null Tracking-SDKs und kein Cloud-Konto. Die einzige Netzwerkverbindung nach außen ist App Store / RevenueCat für das Abo und optional iCloud Drive-Sync, der innerhalb deines eigenen iCloud bleibt.',
      },
      {
        q: 'Funktioniert es auf iPad und Mac oder nur auf dem iPhone?',
        a: 'Auf allen dreien. photoZseo ist eine universelle App — derselbe Kauf deckt iPhone, iPad und Mac (Catalyst) ab. Drag-and-Drop, Mehrfachauswahl, Tastaturkürzel und ein Inspector-Panel sind erstklassig auf iPad und Mac.',
      },
      {
        q: 'Was ist tatsächlich in den 3 Tagen kostenloser Testphase enthalten?',
        a: 'Alles aus Pro. Alle 46+ Marktplatzformate, KI-SEO-Auto-Fill, B2B-Angebotsersteller, Stories, EXIF-Tools — voller Zugriff für 3 Tage im Jahresabo. Wenn du während der Testphase unter Einstellungen → Apple ID → Abonnements kündigst, wirst du nicht belastet.',
      },
      {
        q: 'Wie viele Plattformen sind "46+" genau?',
        a: 'Zum Launch: 46 Marktplatz-Presets (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…) plus Social-/Messaging-Formate (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). Neue Presets kommen mit Updates.',
      },
      {
        q: 'Bleibt mein GPS-Standort in den exportierten Fotos?',
        a: 'Nein. photoZseo entfernt GPS-Daten beim Export standardmäßig. Andere EXIF-Daten — Artist, Copyright, Software, Maße, Kamera — bleiben erhalten und sind inline bearbeitbar. Du behältst die Kontrolle.',
      },
      {
        q: 'Ist es DSGVO- / KVKK- / CCPA-konform?',
        a: 'Ja — und die App spricht deine Sprache: Englisch, Türkisch, Deutsch, Spanisch, Französisch, Portugiesisch, Japanisch, Koreanisch, Chinesisch, Arabisch, Hindi und Persisch. RTL-Layouts für Arabisch, Urdu und Persisch sind erstklassig.',
      },
      {
        q: 'Kann ich meine bestehende Produktliste importieren?',
        a: 'Ja. CSV, TSV, XLSX, JSON, Foto-URLs und Bulk-Fotoordner werden alle unterstützt. 41+ Plattform-Importvorlagen sind enthalten.',
      },
    ],
  },
  finalCta: {
    h2: 'Dein nächster Verkauf beginnt mit einem Foto.',
    p: 'Kostenlos starten. Kein Tracking. Keine Werbung. Jederzeit kündbar. Gebaut für Indie-Verkäufer.',
    note: 'Bald im App Store.',
    notify: 'Beim Launch benachrichtigen',
  },
  footer: {
    tag: 'Verkaufe auf 46+ Marktplätzen aus einem Foto.',
    privacy: 'Datenschutz', terms: 'AGB', support: 'Support',
    accessibility: 'Barrierefreiheit', deleteAccount: 'Konto löschen',
    rights: 'Alle Rechte vorbehalten. Gebaut für unabhängige Verkäufer.',
  },
};

export default de;
