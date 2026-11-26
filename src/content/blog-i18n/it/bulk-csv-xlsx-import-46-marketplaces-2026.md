---
title: "Importazione in blocco di CSV/XLSX in 46 marketplace: rilevamento automatico di 41 piattaforme"
description: "Rilascia un'esportazione Shopify, Amazon o Etsy in photoZseo. Rileviamo 41 firme di piattaforme, estraiamo foto in parallelo e riesportiamo in 46 mercati."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo accetta cataloghi CSV, TSV, XLSX e JSON e rileva automaticamente 41 firme di piattaforma dalle intestazioni di colonna del file."
  - "Le foto dei prodotti vengono estratte in parallelo dagli URL nel file. Attiva il Wi-Fi solo se non desideri bruciare i dati della rete cellulare."
  - "Riesporta lo stesso catalogo in 46 marketplace, ciascuno con i propri nomi di file SEO, dimensioni delle immagini corrette per la piattaforma e ordine delle colonne."
faqs:
  - q: "Quali formati di file posso importare in photoZseo?"
    a: "CSV, TSV, XLSX e JSON. Ciascuno può contenere titoli di prodotti, descrizioni, prezzi, SKU, codici a barre e URL di foto. La maggior parte dei venditori elimina l'esportazione Shopify o Amazon esistente e salta completamente la mappatura."
  - q: "Cosa significa in pratica \"rilevamento automatico 41 firme della piattaforma\"?"
    a: "photoZseo controlla le intestazioni delle colonne del file e le confronta con 41 schemi di esportazione di piattaforme conosciute: Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce e altri 33. Se il tuo file proviene da una di queste piattaforme, la mappatura è automatica."
  - q: "L'importazione di foto dagli URL utilizza i miei dati mobili?"
    a: "Solo se lo permetti. C'è un interruttore solo Wi-Fi nelle impostazioni di importazione, attivo per impostazione predefinita. Quando è attivo, i download vengono messi in pausa e riprendono automaticamente quando si cambia rete. Spento, utilizzerà qualunque connessione sia attiva."
  - q: "Cosa succede se il mio catalogo contiene 5.000 prodotti?"
    a: "photoZseo importa in batch e mantiene reattiva l'interfaccia utente. I download degli URL delle foto vengono eseguiti in parallelo: il limite pratico è la larghezza di banda, non l'app. Un catalogo di 5.000 righe con URL di foto viene generalmente visualizzato in 10-20 minuti tramite Wi-Fi domestico standard."
  - q: "Posso riesportare in un marketplace diverso da quello di origine?"
    a: "Sì, questo è il punto. Importa un catalogo Shopify, premi Esporta, scegli Amazon (o Etsy o Trendyol). photoZseo ricostruisce il file nell'esatto ordine di colonne della piattaforma di destinazione, con le immagini ridimensionate in base alle specifiche di quella piattaforma."
---

La parte più difficile della vendita su un nuovo mercato non è il mercato. Permette di inserire gli 800 prodotti esistenti senza dover riscrivere ogni titolo, ricaricare ogni foto e rimappare ogni colonna.

L'importazione in blocco del catalogo di photoZseo gestisce il viaggio di andata e ritorno. Inserisci un file che hai già e sarai all'80% del percorso verso una nuova piattaforma.

## Perché esiste l'importazione di massa

Se sei un venditore FBA Amazon che aggiunge Trendyol, un negozio Etsy che si espande a TikTok Shop o un negozio Shopify che si sposta a Walmart, il tuo catalogo esiste già. L'hai esportato una volta. Il problema è che ogni piattaforma presenta uno schema leggermente diverso: nomi di colonne diversi, specifiche delle immagini diverse, tassonomie di prodotto diverse. La correzione manuale prevede ore di lavoro con fogli di calcolo per nuovo canale.

photoZseo lo riduce a minuti.

## Cosa viene importato

L'importatore legge quattro formati:

- CSV: esportazioni di prodotti Shopify, caricamenti di file flat Amazon, modelli collettivi Trendyol.
- TSV: varianti separate da tabulazioni di sistemi precedenti o interni.
- XLSX: file Excel con cataloghi multifoglio.
- JSON: esportazioni API o feed di prodotti interni.

Ciascuno può contenere titoli, descrizioni, prezzi, SKU, codici a barre, assi delle varianti (dimensioni, colore), inventario e, soprattutto, URL di foto. Una volta archiviati in photoZseo, gli stessi dati determinano preventivi, esportazioni e compilazione automatica SEO.

## Rilevamento automatico su 41 piattaforme

La caratteristica killer non è il supporto del formato. È il rilevamento automatico.

photoZseo controlla le intestazioni delle colonne del file e le confronta con 41 schemi di esportazione di piattaforme conosciute:

- Mercati occidentali: Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- Turco: Trendyol, Hepsiburada, N11
- Asia transfrontaliera: AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- America Latina: Mercado Libre, Coupang
- Europa: Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...e altri 17.

Se il tuo file proviene da uno di questi, photoZseo lo riconosce al momento del rilascio. Nessuna procedura guidata di mappatura delle colonne. Non viene richiesto "cosa significa questa intestazione". Funziona e basta.

## Gli URL delle foto vengono estratti in parallelo

La maggior parte delle esportazioni di cataloghi includono URL di foto, non immagini incorporate. photoZseo li scarica in parallelo: connessioni multiple, tentativi intelligenti, deduplicazione dell'hash percettivo in modo che la stessa foto del prodotto non venga importata due volte.

C'è un interruttore solo Wi-Fi attivo per impostazione predefinita. Con esso acceso:

- I download vengono messi in pausa quando esci dal Wi-Fi e riprendono quando torni.
- Nessuna sorpresa cellulare sulla bolletta telefonica.
- Un'importazione di 2.000 prodotti non esaurirà il tuo piano dati.

Quando è disattivato, photoZseo utilizza qualsiasi connessione attiva, utile alla scrivania tramite Wi-Fi in ufficio.

## Un flusso di lavoro pratico

Ecco il viaggio di andata e ritorno eseguito dalla maggior parte dei venditori:

Passaggio 1: esporta dalla piattaforma di origine. Shopify, Amazon o Etsy ti consentono tutti di scaricare il tuo catalogo come CSV/XLSX. Prendilo.

Passaggio 2: trascina il file in photoZseo. Su iPhone, premi Importa in qualsiasi progetto. Su iPad, trascinalo da File. Il rilevamento automatico identifica la piattaforma e inizia a estrarre gli URL delle foto in background.

Passaggio 3: lascia [L'intelligenza artificiale riempie i campi SEO](/features/seo-filenames). photoZseo scrive titolo, slug, meta description, testo alternativo, tag e parole chiave per ogni prodotto, in 12 lingue se vendi a livello internazionale.

Passaggio 4: esporta in un nuovo mercato. Scegli la destinazione: Amazon, Trendyol, Walmart, qualunque cosa. photoZseo riscrive il file nell'esatto ordine di colonne di quella piattaforma, ridimensiona le immagini in base alle specifiche della piattaforma e impacchetta il risultato come un singolo ZIP.

Passaggio 5: carica sul nuovo canale. Il file di output è pronto per qualsiasi strumento di caricamento collettivo utilizzato dalla destinazione.

Quella che una volta era una settimana di lavoro con i fogli di calcolo ora è una pausa pranzo di 30 minuti.

## Perché questo è importante per i venditori transfrontalieri

Il principale ostacolo all’espansione oltre il mercato domestico è il costo di conversione del catalogo. La maggior parte dei venditori rimane su Amazon US non perché Amazon US sia il migliore, ma perché passare a Mercado Libre o Trendyol significa ricostruire il catalogo da zero.

L'importazione in blocco + 46 preimpostazioni del marketplace rimuove il blocco. Gli stessi dati di prodotto fluiscono verso ogni canale. I nuovi mercati sono un'attivazione/disattivazione di funzionalità, non un progetto.

Per i venditori indipendenti che desiderano spedire in tutto il mondo senza assumere un gestore del catalogo, questa è la soluzione.
