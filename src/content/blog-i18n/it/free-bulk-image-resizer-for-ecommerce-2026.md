---
title: "Ridimensionatore di immagini in blocco gratuito per l'e-commerce: cosa cercare e come farlo (2026)"
description: "Come ridimensionare gratuitamente in batch le foto dei prodotti per Amazon, Etsy e Shopify: strumenti del sistema operativo integrati, strumenti del browser e trappole della qualità che rovinano le inserzioni."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-resize, product-photos, image-size, e-commerce, free-tools]
tldr:
  - "Puoi ridimensionare in blocco le foto dei prodotti gratuitamente con gli strumenti già presenti sul tuo computer, ma il ridimensionamento è la parte più semplice. Mantenere sotto controllo il ritaglio, il colore e la dimensione del file è il punto in cui le inserzioni vanno storte."
  - "I marketplace pubblicano regole diverse: Shopify dice che 2048 x 2048 px di solito vengono visualizzati meglio, Etsy richiede almeno 2000 px, Amazon preferisce più di 1.000 px sul lato più lungo."
  - "Scegli uno strumento in base a ciò che preserva (proporzioni, colore sRGB, file originali) piuttosto che al numero di immagini che può gestire."
faqs:
  - q: "Qual è il miglior modo gratuito per ridimensionare in blocco le immagini dei prodotti?"
    a: "Per un batch una tantum, sono sufficienti gli strumenti integrati nel tuo sistema operativo o un ridimensionatore basato su browser. Per lavori ripetuti su diversi marketplace, cerca uno strumento che salvi le dimensioni predefinite per marketplace, in modo da non reinserire le dimensioni ogni volta."
  - q: "Che dimensioni dovrebbero avere le immagini del prodotto per Shopify?"
    a: "Il centro assistenza di Shopify afferma che un quadrato di 2048 x 2048 px viene solitamente visualizzato meglio, con immagini accettate fino a 5000 x 5000 px (25 megapixel) e inferiori a 20 MB."
  - q: "Che dimensioni dovrebbero avere le foto dell'elenco Etsy?"
    a: "L'articolo della guida di Etsy consiglia almeno 2000 px in larghezza e altezza e afferma che la prima foto dovrebbe essere almeno 635 px in modo che non venga posizionata più in basso nella ricerca."
  - q: "Ridimensionare una foto ne riduce la qualità?"
    a: "La riduzione di un'immagine la mantiene nitida quando viene eseguita una volta dall'originale. L'ingrandimento di un'immagine piccola provoca la pixelizzazione e il salvataggio ripetuto di un JPEG aggiunge artefatti di compressione, quindi ridimensiona sempre dai file originali."
  - q: "Dovrei utilizzare WebP o JPEG per i caricamenti sul marketplace?"
    a: "Utilizza JPEG per i marketplace a meno che le loro linee guida non dicano diversamente, perché è il formato universalmente accettato. WebP è utile nel tuo negozio, dove Shopify lo elenca come accettato, ma controlla prima le linee guida attuali di ciascun marketplace."
  - q: "Un ridimensionatore gratuito è sicuro per le foto dei prodotti?"
    a: "Dipende da dove avviene l'elaborazione. Preferisci gli strumenti eseguiti sul tuo dispositivo o nel tuo browser e leggi l'informativa sulla privacy prima di caricare foto di prodotti inediti su un servizio web."
---

Sì, puoi ridimensionare in blocco le foto dei prodotti gratuitamente. Gli strumenti integrati del tuo computer, i ridimensionatori gratuiti basati su browser e i livelli gratuiti di alcune app gestiscono tutti un batch in pochi minuti. La parte difficile non è il ridimensionamento. Sceglie le dimensioni target che corrispondono a ciascun mercato, mantenendo intatte le proporzioni e senza danneggiare il colore o le dimensioni del file lungo il percorso. Questa guida copre onestamente le opzioni gratuite, cosa controllare in qualsiasi strumento e una tabella delle impostazioni che puoi copiare.

*Ultima verifica: novembre 2026. Fonti: Centro assistenza Shopify ("Supporti del prodotto"), Centro assistenza Etsy ("Come aggiungere foto alle inserzioni"), Amazon Seller Central ("Requisiti tecnici file immagine"), Supporto Apple ("Modifica formati fotocamera"). I marketplace cambiano spesso le regole, quindi controlla la pagina corrente prima di un grosso caricamento.*

## Cosa chiedono effettivamente i marketplace?

Solo pochi numeri sono sicuri e diverse "regole" che vedi online sono in realtà raccomandazioni.

| Piattaforma | Cosa dice la pagina ufficiale | Fonte |
|---|---|---|
| Shopify | Il quadrato di 2048 x 2048 px viene solitamente visualizzato meglio; fino a 5000 x 5000 px o 25 megapixel; meno di 20MB; Preferibili PNG e JPEG, accettati anche WebP e HEIC | Shopify Centro assistenza, "Supporti del prodotto" |
| Etsy | Obiettivo per almeno 2000 px in larghezza e altezza; prima foto almeno 635 px; JPG, GIF, PNG, SVG, HEIC accettati; i file superiori a 1 MB potrebbero non essere caricati in caso di connessioni lente; utilizzare sRGB | Etsy Centro assistenza, "Come aggiungere foto alle tue inserzioni" |
| Amazon | Preferisce immagini più grandi di 1.000 px sul lato più lungo per lo zoom; Consigliato JPEG, TIFF, PNG e GIF non animati accettati | Amazon Seller Central, "Requisiti file immagine tecnica" |

Per qualsiasi altra cosa (minimi, massimi, regole di base), controlla le attuali linee guida della piattaforma. I blog di terze parti spesso indicano una raccomandazione come limite rigido. Se hai bisogno di uno sguardo più approfondito su una singola piattaforma, consulta le nostre guide su [Specifiche foto Amazon](/it/blog/amazon-product-photo-specs-2026) e [Dimensioni delle immagini Shopify](/it/blog/shopify-product-image-size-2026).

## Quali sono i modi gratuiti per ridimensionare in batch le foto?

| Opzione | Buono per | Attenzione |
|---|---|---|
| Strumenti del sistema operativo integrati (ad esempio Anteprima su macOS o PowerToys Image Resizer gratuito di Microsoft su Windows) | Ridimensionamento rapido di una cartella a una dimensione impostata, senza caricamento | Di solito una dimensione target alla volta; controllo limitato su formato e compressione |
| Ridimensionatori gratuiti basati su browser | Nessuna installazione, qualsiasi dispositivo | Controlla se i file vengono elaborati localmente o caricati; i livelli gratuiti spesso limitano le dimensioni del batch o aggiungono filigrane |
| Livelli gratuiti di app ed estensioni | Preimpostazioni del Marketplace, ridenominazione, esportazione in un solo passaggio | I limiti gratuiti variano in base al prodotto; leggili prima di progettare un catalogo attorno ad essi |
| Riga di comando o script | Migliaia di immagini, ripetibili | Ha bisogno di comfort tecnico; facile sovrascrivere gli originali |

Nessuno di questi è universalmente migliore. La scelta giusta dipende da quanto spesso lo fai e per quanti mercati.

## Cosa dovresti cercare in un ridimensionatore di massa?

Utilizza questa lista di controllo quando confronti qualsiasi strumento, gratuito o a pagamento.

1. Mantiene i tuoi originali. L'output va in una nuova cartella. Il ridimensionamento sul posto è il modo in cui le persone perdono il loro unico file a piena risoluzione.
2. Mantiene le proporzioni o ti consente di scegliere come adattarle. Un raccolto forzato può tagliare un bordo del prodotto. Decidi tra l'imbottitura su una tela quadrata e il ritaglio e controlla alcuni risultati.
3. Si converte in sRGB. Etsy dice specificamente di utilizzare sRGB per le immagini web. Una foto in un profilo ad ampia gamma può apparire opaca o troppo saturata per alcuni spettatori.
4. Controlla il formato e la qualità. Vuoi scegliere tu stesso la qualità JPEG piuttosto che accettare un'impostazione predefinita che gonfia o schiaccia il file.
5. Gestisce HEIC. Gli iPhone potrebbero salvare HEIC per impostazione predefinita. L'impostazione di Apple ti consente di passare a "Più compatibile" per salvare JPEG, ma le vecchie foto sono già HEIC, quindi il tuo strumento dovrebbe convertirle.
6. Non migliora silenziosamente. La guida di Etsy rileva che l'ingrandimento può causare pixelizzazione. Uno strumento dovrebbe avvisare o saltare i file di piccole dimensioni.
7. Gestisce la privacy. Scopri se le foto lasciano il tuo dispositivo.

## Quali sono le trappole di qualità comuni?

- Ritaglio del prodotto. Le preimpostazioni quadrate tagliano prodotti lunghi come tappeti, poster e strumenti. Riempi invece di ritagliare quando l'oggetto tocca la cornice.
- Dati EXIF. Le foto del telefono possono contenere dati sulla posizione e sul dispositivo. Eliminarlo prima della pubblicazione è un'abitudine sensata, anche se alcuni strumenti lo mantengono per impostazione predefinita. Tieni presente che anche l'orientamento EXIF ​​è importante: una foto che appare in posizione verticale sul tuo telefono può apparire ruotata dopo un ridimensionamento inadeguato.
- Profilo colore. Converti in sRGB, come sopra. CMYK è per la stampa, secondo Etsy.
- Doppia compressione. Ogni nuovo salvataggio JPEG perde un po' di qualità. Ridimensiona una volta dall'originale, non da una copia precedentemente esportata.
- Dimensioni del file e errori di caricamento. Etsy nota che i file superiori a 1 MB potrebbero non funzionare con connessioni più lente, quindi cerca un equilibrio tra nitidezza e peso.
- PNG trasparenti. Etsy dice che le aree trasparenti appaiono nere. Appiattisci su uno sfondo solido prima del caricamento.
- WebP e JPEG. WebP è più piccolo con una qualità simile e Shopify lo accetta, ma JPEG è la scelta universale sicura per i marketplace. Il nostro [Confronto WebP, JPEG e PNG](/it/blog/webp-jpeg-png-product-photos-2026) va più in profondità.

## Quali impostazioni dovresti usare? (tabella pratica)

Usali come punto di partenza e poi confrontali con le attuali linee guida della piattaforma.

| Obiettivo | Lato più lungo | Formato | Note |
|---|---|---|---|
| Il tuo negozio Shopify | 2048 px (quadrato 2048 x 2048) | JPEG o WebP se desideri file più piccoli | Rimani sotto i limiti di 5000 x 5000 px/20 MB |
| Elenchi Etsy | 2000 px o più | JPEG, sRGB | Realizza la prima foto orizzontale o quadrata; mantenere il peso del file ragionevole |
| Immagini principali Amazon | Ben al di sopra dei 1.000 px | JPEG | Controlla le attuali linee guida sulle immagini di Amazon per le regole di sfondo |
| Maestro dell'archivio | Dimensione originale | Originale | Non sovrascrivere mai; ridimensionare le copie |

## Un semplice flusso di lavoro gratuito

1. Copia gli originali in una cartella denominata "originals" e non modificarli mai.
2. Decidi le dimensioni target dalla tabella sopra.
3. Ridimensiona in batch le copie in una cartella separata per marketplace.
4. Controlla cinque immagini: ritaglio, orientamento, nitidezza, colore.
5. Rinominare i file in qualcosa di descrittivo prima del caricamento. Vedi [come nominare le foto dei prodotti per la SEO](/it/blog/how-to-name-product-photos-for-seo).

## Dove si adatta photoZseo

Se ridimensioni regolarmente per diversi mercati, farlo manualmente diventa ripetitivo. L'app iOS e iPadOS di photoZseo (iOS 17+) ridimensiona, comprime e rinomina le foto per 46 marketplace e dispone di un piano gratuito; vedere [prezzi](/it/pricing) per i limiti del piano attuale. [Estensione di Chrome](/it/chrome-extension) funziona dalle pagine dei prodotti in Chrome 116+, con 82 profili di dimensioni. Il suo livello gratuito copre 5 prodotti e 10 immagini al giorno e i tuoi dati rimangono nel browser. Nessuno dei due strumenti sostituisce il controllo delle regole attuali di ciascun mercato.

photoZseo non è affiliato o approvato da alcun mercato. I nomi dei marketplace vengono utilizzati solo per descrivere la compatibilità.
