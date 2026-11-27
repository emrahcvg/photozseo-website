---
title: "Software per l'elenco di prodotti in blocco: come funzionano i caricamenti CSV/XLSX su Amazon, eBay, Etsy, Shopify e Trendyol (2026)"
description: "Come caricare in blocco i prodotti: modello di ciascuna piattaforma, campi obbligatori e regole URL immagine per Amazon, eBay, Etsy, Shopify e Trendyol, oltre a una lista di controllo."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon e Trendyol accettano caricamenti di fogli di calcolo. Etsy no: il suo centro assistenza dice che non è possibile caricare in blocco nuovi elenchi, ma solo modificare in blocco quelli esistenti."
  - "Le immagini in un foglio di calcolo sono quasi sempre URL, non file allegati. L'URL deve essere pubblico, diretto e (su Shopify e eBay) iniziare con https://."
  - "I modelli differiscono per categoria su Amazon, eBay e Trendyol, quindi scarica un nuovo modello per ogni categoria e non rinominarne mai le intestazioni."
faqs:
  - q: "Come posso caricare in blocco i prodotti su eBay?"
    a: "Nella Console venditori vai su Report, quindi su Carica e scegli Ottieni modello con la fonte delle inserzioni. Compila il file e caricalo; eBay elenca gli elementi come specificato. Utilizza CSV o XLSX."
  - q: "Posso caricare in blocco nuove inserzioni su Etsy con un CSV?"
    a: "Il centro assistenza di Etsy afferma che non è possibile caricare in blocco nuovi elenchi, sebbene sia possibile copiare elenchi e modificare in blocco quelli esistenti. Esistono strumenti di terze parti, ma non sono una funzionalità Etsy."
  - q: "Shopify ha bisogno degli URL delle immagini nel CSV?"
    a: "SÌ. Gli URL delle immagini nel CSV devono essere accessibili pubblicamente, utilizzare https:// e non essere protetti da password. Shopify scarica le immagini durante l'importazione."
  - q: "Quale codifica di file dovrebbe utilizzare un CSV del prodotto Shopify?"
    a: "Il centro assistenza di Shopify richiede UTF-8 con terminazioni di riga in stile LF, separate da virgole, con le intestazioni sulla prima riga. Controlla le impostazioni di esportazione dell'app per fogli di lavoro."
  - q: "Dove posso caricare un file di prodotto Excel su Trendyol?"
    a: "Nel pannello del venditore sotto Prodotto, quindi Operazioni prodotto in blocco, utilizzando l'opzione di immissione prodotto Excel e il tipo di caricamento Nuovo prodotto. Ogni categoria ha il proprio modello."
  - q: "Perché il mio caricamento collettivo è stato rifiutato?"
    a: "Le cause più comuni sono intestazioni di colonna modificate, campi obbligatori mancanti, URL di immagini private o di reindirizzamento e un modello della categoria sbagliata. Correggi il file e ricaricalo."
---

Caricare in blocco i prodotti significa preparare un foglio di calcolo (CSV o XLSX) con una riga per prodotto e caricarlo una volta invece di creare manualmente ciascuna inserzione. eBay, Shopify, Amazon e Trendyol lo supportano; Etsy non consente la creazione in blocco di nuovi elenchi. Le due regole che causano la maggior parte degli errori sono le stesse ovunque: mantenere le intestazioni del modello esattamente come fornite e fornire ogni immagine come un URL pubblico e diretto.

*Ultima verifica: novembre 2026. Fonti controllate: Centro assistenza Shopify, "Utilizzo di file CSV per importare ed esportare prodotti"; Guida dell'Hub venditori eBay, "Crea inserzioni in blocco" (Rapporti dell'Hub venditori > Carica); Centro assistenza Etsy, "Posso creare o modificare più elenchi contemporaneamente?"; Guida Amazon Seller Central, "Modelli di file di inventario" e "Problemi relativi alle immagini" (leggi tramite estratti di ricerca, vedere la nota di seguito); Trendyol Akademi Satıcı Bilgi Merkezi, "Excel Ürün Girişi" e "Ürün Görseli Seçimi ve Yükleme" (leggi tramite estratti di ricerca).*

## In che modo ciascuna piattaforma gestisce il caricamento collettivo?

| Piattaforma | Creare in blocco? | Dove | Tipo di file | Regola dell'immagine |
|---|---|---|---|---|
| Shopify | SÌ | Prodotti > Importa | CSV, UTF-8, separati da virgole | URL https:// pubblici |
| eBay | SÌ | Console venditore > Report > Carica > Ottieni modello | CSV o XLSX | https:// URL, fino a 12 per elenco, separati da \ |  |
| Amazon | SÌ | Aggiungi prodotti tramite caricamento (Seller Central) | Modello di file di inventario specifico per categoria | URL diretto; reindirizzamenti e popup vengono rifiutati |
| Trendyol | SÌ | Prodotto > Operazioni prodotto in blocco > Inserimento prodotto Excel | Excel, un modello per categoria | Collegamento nella colonna Collegamento immagine |
| Etsy | No (solo modifica) | Gestione negozio > Inserzioni | Non applicabile | Non applicabile |

## Come si caricano in blocco i prodotti su Shopify?

Il centro assistenza di Shopify imposta il formato: la prima riga deve essere costituita da intestazioni di colonna, le colonne sono separate da virgole e il file deve essere UTF-8 con terminazioni di riga LF. Per i nuovi prodotti è richiesto solo `Title`; se usi le varianti, è richiesto anche `URL handle`. Anche le colonne delle varianti come SKU necessitano di `Option1 name` e `Option1 value`, altrimenti Shopify crea una variante predefinita ed elimina quelle esistenti durante l'aggiornamento.

Le immagini devono essere URL `https://` accessibili pubblicamente senza protezione tramite password. Shopify li scarica durante l'importazione, quindi puoi rimuoverli in seguito. I nomi dei file immagine non possono essere modificati dopo il caricamento e non possono includere i suffissi `_thumb`, `_small` o `_medium`. Video e modelli 3D non sono supportati in CSV.

| Limite | Valore (Centro assistenza Shopify) |
|---|---|
| Opzioni per prodotto | 3 |
| Immagini per prodotto | 250 |
| Tag per prodotto | 250 |
| Testo alternativo | Massimo 512 caratteri, consigliati 125 o meno |
| Titolo SEO | 70 caratteri |
| Descrizione SEO | 320 caratteri |

Cause di errore note dalla stessa pagina: un file con entrambe le colonne `Barcode` e `Barcodes` ha esito negativo; un set parziale di colonne con dimensioni compresse ha esito negativo; con la sovrascrittura attivata, le celle vuote cancellano i valori esistenti. Per un confronto più approfondito con il percorso API, vedere [Shopify CSV e API](/it/blog/shopify-csv-vs-api-2026).

## Come si caricano in massa le inserzioni su eBay?

Lo strumento attuale di eBay è Report Hub venditori. Vai su Carica, fai clic su Ottieni modello, scegli la fonte delle inserzioni e un tipo di file. XLSX è l'impostazione predefinita e CSV è consigliato per i venditori avanzati; un download XLSX può includere fino a 10 categorie, ciascuna sul proprio foglio. Carica il file completato e eBay elenca gli elementi come specificato.

I campi obbligatori per aggiungere un'inserzione includono Azione, ID categoria, Titolo (massimo 80 caratteri), Formato, Durata, Prezzo iniziale, Quantità, ID condizione, Descrizione e URL foto articolo. Il sito statunitense richiede inoltre un UPC (o equivalente) nella colonna specifica dell'articolo corrispondente e le categorie di libri necessitano di un ISBN.

Gli URL delle immagini devono iniziare con `https://`, terminare con un'estensione di file come `.jpg` o `.png`, contenere meno di 2048 caratteri e sostituire gli spazi con `%20`. Puoi elencare fino a 12 immagini per inserzione, separate dal carattere pipe (`|`). Le immagini possono essere ospitate autonomamente o su eBay Picture Services. Per le varianti, la riga madre lascia la quantità e il prezzo vuoti e ogni riga figlia ha la propria.

## Come si caricano in blocco i prodotti su Amazon?

Amazon utilizza modelli di file di inventario specifici per categoria, generati dalla pagina Aggiungi prodotti tramite caricamento in Seller Central. Per gli articoli non ancora presenti nel catalogo, utilizzi il modello di prodotto, che contrassegna gli attributi come obbligatori, condizionalmente richiesti o consigliati. Per gli articoli già presenti nel catalogo, puoi cercare per ID prodotto e utilizzare un file precompilato. Dopo il caricamento, seleziona il tipo di file corrispondente ed esamina il report di elaborazione per ogni SKU.

Per le immagini, la pagina della guida "Problemi relativi alle immagini" di Amazon indica che un URL popup o di reindirizzamento non sarà accettato e il caricamento non verrà elaborato, quindi l'URL deve puntare direttamente al file immagine. I percorsi dei menu e i tipi di file accettati variano in base alla regione del marketplace, quindi segui le istruzioni sul modello scaricato. Per le dimensioni dell'immagine, vedere [Specifiche foto prodotto Amazon](/it/blog/amazon-product-photo-specs-2026).

## Puoi eseguire il caricamento collettivo su Etsy?

Non per le nuove inserzioni. Il centro assistenza di Etsy afferma che non è possibile caricare in blocco nuovi elenchi e suggerisce di creare un elenco e di copiarlo. Puoi modificare in blocco le inserzioni esistenti da Gestione negozio, inclusi titoli, tag, descrizioni, prezzi, opzioni personalizzate, profilo di elaborazione e profili di consegna. Gli strumenti che affermano di creare in blocco elenchi Etsy sono prodotti di terze parti e non una funzionalità Etsy, quindi verifica tu stesso i loro termini e l'accesso all'API.

## Come si caricano in blocco i prodotti su Trendyol?

Nel pannello del venditore, apri Prodotto, quindi Operazioni prodotto in blocco e utilizza l'opzione di immissione del prodotto Excel. Il Centro informazioni sul venditore di Trendyol descrive un modello per categoria, identificato da un codice di categoria e il tipo di caricamento "Yeni Ürün Ekle" (aggiungi nuovo prodotto). Le immagini sono fornite nella colonna Link immagine (Görsel Linki). Trendyol documenta anche un metodo di raccolta: caricare prima le immagini nella Galleria di immagini, con nomi di file uguali al codice a barre del prodotto (per diverse immagini, barcode_1, barcode_2), quindi copiare tali nomi nella colonna. Non modificare il formato del modello prima del caricamento.

Il testo del pannello può cambiare, quindi conferma i passaggi rispetto al modello all'interno del tuo Account venditore. Per le regole immagine su Trendyol e Hepsiburada, vedere [Foto dei prodotti Trendyol e Hepsiburada](/it/blog/trendyol-hepsiburada-product-photos).

## Quali sono gli errori di caricamento collettivo più comuni?

1. Intestazioni modificate o rinominate. I modelli corrispondono al testo dell'intestazione. Non tradurli o riordinarli.
2. Modello di categoria sbagliato. I modelli Amazon, eBay e Trendyol differiscono in base alla categoria.
3. URL di immagini non diretti. Un collegamento a una pagina Web, un reindirizzamento o una cartella protetta dall'accesso non riesce.
4. Spazi e caratteri speciali negli URL. Codifica gli spazi (eBay richiede `%20`).
5. Codifica o delimitatore errato. Excel può esportare punto e virgola o testo non UTF-8.
6. Identificatori duplicati o mancanti (SKU, codice a barre, handle URL).
7. Sovrascrivi le sorprese. Su Shopify, le celle vuote possono cancellare i dati esistenti.

## Elenco di controllo pre-caricamento

- Scarica un nuovo modello per ogni categoria e piattaforma.
- Prova con 5 righe prima del catalogo completo.
- Apri ogni URL di immagine in una finestra del browser privata; dovrebbe mostrare l'immagine stessa.
- Controlla i limiti di titolo, descrizione e tag rispetto alle attuali linee guida della piattaforma.
- Conserva un backup del file sorgente e del rapporto sugli errori della piattaforma.

## Dove si adatta photoZseo

I file caricati in blocco funzionano bene solo come le immagini e il testo al loro interno. photoZseo prepara le foto dei prodotti per 46 marketplace (ridimensionamento, compressione, nomi di file SEO, rimozione dello sfondo sul dispositivo) ed esporta CSV, XLSX o JSON dalle app iPhone e iPad. Non ospita immagini né viene caricato sui mercati per te, a parte l'invio di prodotti a Shopify. Ottieni l'app su [pagina di download](/it/download). Lo [Estensione di Chrome](/it/chrome-extension) fa lo stesso per le pagine dei prodotti che navighi su un computer.

*photoZseo non è affiliato o approvato da alcun mercato. I nomi dei marketplace vengono utilizzati solo per descrivere la compatibilità.*

*Nota: le pagine Akademi Amazon Seller Central e Trendyol non possono essere aperte completamente durante la verifica, quindi i dettagli per queste due piattaforme provengono da estratti di ricerca delle pagine ufficiali. Controlla sempre le istruzioni del modello all'interno del tuo account.*
