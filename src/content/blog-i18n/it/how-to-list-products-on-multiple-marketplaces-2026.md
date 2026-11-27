---
title: "Come elencare i prodotti su più marketplace contemporaneamente (flusso di lavoro 2026)"
description: "Un flusso di lavoro multicanale passo dopo passo: un record del prodotto principale, un set di foto di origine, quindi ridimensionamento, titoli e controlli per marketplace per Amazon, eBay e Etsy."
pubDate: 2026-11-27
readingMinutes: 7
tags: [multichannel, marketplaces, product-photos, listing, workflow]
tldr:
  - "Crea un record principale (dati più un set di foto ad alta risoluzione) una volta, quindi ricava da esso la versione di ciascun marketplace invece di iniziare ogni inserzione da zero."
  - "Foto e titoli sono le parti che devono cambiare per canale; gli identificatori, le specifiche e la logica dei prezzi dovrebbero rimanere nel record anagrafico."
  - "Controlla le attuali linee guida ufficiali di ciascun canale prima del caricamento. eBay e Etsy pubblicano indicazioni chiare sulle dimensioni; per Amazon, leggi le regole Seller Central in tempo reale per la tua categoria."
faqs:
  - q: "Posso pubblicare lo stesso prodotto su Amazon, eBay e Etsy?"
    a: "Sì, purché il prodotto sia consentito dalle regole di ciascun marketplace e tu segua le politiche relative alle inserzioni e alle immagini di ciascun canale. Etsy in particolare limita ciò che può essere venduto in base ai suoi standard di creatività, quindi controlla prima l'idoneità."
  - q: "Ho bisogno di una foto diversa per ogni marketplace?"
    a: "Non una fotografia diversa, ma di solito un'esportazione diversa. Fotografa una volta ad alta risoluzione, quindi ritaglia, ridimensiona e imposta lo sfondo per canale e conserva almeno una foto non modificata dell'oggetto reale dove un mercato lo richiede (Etsy lo fa)."
  - q: "Che dimensioni dovrebbero avere le mie foto master?"
    a: "Più grande delle esigenze di qualsiasi canale. Etsy consiglia di elencare foto di almeno 2000 pixel in larghezza e altezza e eBay consiglia circa 1600 x 1600, quindi un master di 2000 pixel o più su ciascun lato consente di eseguire il downscaling in modo pulito."
  - q: "I titoli dovrebbero essere identici su ogni mercato?"
    a: "No. Mantieni i fatti identici, ma adatta la formulazione e la lunghezza alle regole del titolo di ciascun canale e al modo in cui gli acquirenti effettuano le ricerche lì. Leggi le attuali linee guida sui titoli di ciascuna piattaforma prima di copiare un titolo."
  - q: "È necessario uno strumento di elenco multicanale?"
    a: "No. Un foglio di calcolo e una struttura di cartelle disciplinata possono funzionare per un piccolo catalogo. Strumenti dedicati ti aiutano quando gestisci la sincronizzazione dell'inventario su molti SKU e canali."
---

Per elencare i prodotti su più marketplace contemporaneamente, crea un record principale per prodotto (identificatori, specifiche, dimensioni, una descrizione di base e un set di foto ad alta risoluzione), quindi genera da esso la versione di ciascun marketplace: ridimensiona e modifica lo sfondo delle foto in base alle regole di quel canale, riscrivi il titolo per quel canale, carica ed esegui un breve controllo pre-pubblicazione. Svolgere il lavoro in quest’ordine è ciò che impedisce alla vendita multicanale di trasformarsi in tre lavori separati a tempo pieno.

*Ultima verifica: novembre 2026. Le fonti sono citate in ogni sezione; le regole del marketplace cambiano, quindi conferma con le pagine attive prima di caricare.*

## Passaggio 1: crea un record del prodotto principale

Prima di aprire qualsiasi marketplace, mantieni una riga o un file per prodotto contenente i fatti che non cambiano mai in base al canale:

- SKU interno e, dove disponibili, codici a barre (GTIN/UPC/EAN)
- Marca, modello, materiale, colore, dimensioni, peso
- Una descrizione neutra e fattuale e un elenco di caratteristiche
- Paese di origine, note di conformità ed eventuali avvertenze richieste
- Il percorso della cartella del set di foto principale

Ogni mercato prende quindi in prestito da questo record. Quando una specifica cambia, la correggi una volta. Questo ti protegge anche da una delle cause più comuni di rifiuto: attributi che non sono d'accordo tra i canali o tra titolo e foto.

## Passaggio 2: fotografa un set fotografico principale

Fotografa una volta, alla massima risoluzione pratica, e mantieni intatti gli originali. Un insieme utile è:

1. Una vista frontale pulita su uno sfondo semplice
2. Due o tre angolazioni e una foto di dettaglio
3. Una foto in scala o in uso
4. Una foto della confezione o dell'etichetta, se pertinente

Fotografare grandi cose perché i mercati consigliano dimensioni diverse. I "Requisiti e le migliori pratiche per le immagini nel tuo negozio Etsy" di Etsy consigliano di elencare foto di almeno 2000 pixel in larghezza e altezza e la guida per l'elenco di eBay consiglia circa 1600 x 1600. Un master di 2000 pixel o più per lato ti consente di ridimensionare per ogni canale senza eseguire l'upscaling di nulla.

## Passaggio 3: adatta le foto al marketplace

È qui che va la maggior parte dello sforzo per canale. La tabella seguente elenca solo i dati confermati nelle pagine di aiuto dei marketplace nel novembre 2026.

| Mercato | Guida confermata | Fonte |
|---|---|---|
| eBay | Minimo 500 x 500 px; consigliata circa 1600 x 1600; fino a 24 foto per annuncio; massimo 12 MB per foto; lo sfondo bianco semplice è suggerito come scelta sicura | eBay Centro venditori "Scatta splendide foto"; eBay guida "Aggiungere immagini alle tue inserzioni" |
| eBay (vietato) | Nessun bordo aggiunto, nessun testo/grafica/materiale di marketing aggiunto, nessuna filigrana di alcun tipo | eBay Politica sulle immagini |
| Etsy | Consigliato almeno 2000 px di larghezza e altezza; prima foto almeno 635 px; i file superiori a 1 MB potrebbero non terminare il caricamento in caso di connessioni lente; sRGB; .jpg, .gif, .png, .svg o .heic; nessuna GIF animata o PNG trasparente | Guida Etsy, "Requisiti e best practice per le immagini nel tuo negozio Etsy" |
| Etsy (autenticità) | Almeno una foto non modificata dell'oggetto reale su uno sfondo reale | Guida Etsy, stesso articolo |
| Amazon | Nelle immagini principali viene automaticamente controllata la presenza di sfondi non bianchi e testo, loghi, grafica o filigrane; le immagini che falliscono possono portare alla soppressione. Le regole relative ai pixel e alla percentuale di riempimento variano in base alla categoria, quindi leggi le linee guida per le immagini live per la tua | Amazon Seller Central annuncio sui controlli dell'immagine principale |

Nota cosa non c'è nella tabella: un'unica "dimensione universale". Amazon, eBay e Etsy non sono d'accordo, motivo per cui l'esportazione di una taglia unica fallisce da qualche parte. Il nostro [Riferimento alle dimensioni delle immagini del marketplace](/it/marketplace-image-sizes) raccoglie i numeri per canale e lo [guida al ridimensionamento multi-marketplace](/it/blog/resize-product-photos-multiple-marketplaces) copre i meccanismi di esportazione batch.

Una regola pratica: creare una versione con sfondo bianco per i canali che la favoriscono e mantenere una versione lifestyle o contestuale per i canali in cui gli acquirenti se lo aspettano. Non inserire filigrane, bordi o testo promozionale su nessuna versione. Sia eBay che Amazon li contrassegnano.

## Passaggio 4: riscrivi i titoli per canale

Mantieni i fatti costanti e cambia la formulazione. Ogni piattaforma ha le proprie regole per i titoli, limiti di caratteri e convenzioni, che differiscono tra loro. Non dare per scontato che un titolo accettato su un canale sia valido su un altro. Leggi le attuali linee guida sui titoli per ciascuna categoria in cui elenchi.

Impostazioni predefinite ragionevoli che valgono per tutti i canali:

- Guida con il tipo di prodotto e l'attributo distintivo che gli acquirenti cercano
- Metti brand e modello dove la piattaforma li aspetta
- Evitare frasi promozionali e simboli in eccesso; i venditori comunemente li segnalano come fattori scatenanti del rifiuto, quindi controlla la politica sui titoli di ciascuna piattaforma
- Utilizza valori di attributo coerenti (dimensione, colore) nel titolo, nella foto e nei campi strutturati

Per i nomi dei file e il testo alternativo, vedere [come nominare le foto dei prodotti per la SEO](/it/blog/how-to-name-product-photos-for-seo).

## Passaggio 5: carica, quindi esegui un controllo pre-pubblicazione

Carica un marketplace alla volta, iniziando dal più rigoroso per la tua categoria. Quindi controlla:

| Controllo | Perché è importante |
|---|---|
| La foto soddisfa le dimensioni e il formato minimi del canale | Previene errori di caricamento e miniature soft |
| Nessuna filigrana, bordo o testo promozionale aggiunto | Vietato o contrassegnato su eBay e Amazon |
| Lo sfondo corrisponde alle aspettative del canale | Le immagini principali non bianche vengono controllate automaticamente su Amazon |
| Titolo, foto e attributi concordano (colore, dimensione, quantità) | La mancata corrispondenza è una causa comune di rifiuto |
| Identificatori e categoria corretti | La categoria errata lascia gli attributi richiesti senza corrispondenza |
| Almeno una foto di un oggetto reale non modificata (Etsy) | Richiesto dalla guida immagine di Etsy |

Se un'inserzione viene successivamente soppressa, il nostro post associato su [elencare gli errori che portano alla soppressione dei prodotti](/it/blog/listing-mistakes-that-get-products-suppressed-2026) illustra le cause più comuni.

## Errori comuni nell'elenco multicanale

- Riutilizzare un'esportazione ovunque. Un file Etsy da 1 MB e un file eBay da 1600 px sono esportazioni diverse dello stesso master.
- Modifica dell'originale. Esporta sempre le copie; non sovrascrivere mai il master.
- Copiare i titoli alla lettera. Le regole e il comportamento di ricerca differiscono in base alla piattaforma.
- Lasciare che i dati vadano alla deriva. Se prezzo, azioni o specifiche si trovano in tre posti, divergeranno. Conservarli nel record principale.
- Ignorare l'idoneità. Alcuni canali limitano ciò che può essere venduto; Gli standard di creatività di Etsy, ad esempio, rimuovono le inserzioni che non sono idonee.

## Dove si adatta photoZseo

Se le tue foto originali provengono da un telefono, photoZseo per iOS e iPadOS 17+ può ridimensionare, comprimere e rinominare un set di foto per 46 marketplace, rimuovere sfondi sul dispositivo ed esportare CSV, XLSX o JSON. Se raccogli foto e dettagli dalle pagine dei prodotti esistenti su un computer, [Estensione di Chrome](/it/chrome-extension) funziona dal pannello laterale del browser. Vedi [prezzi](/it/pricing) per i piani. In ogni caso, il flusso di lavoro sopra è lo stesso: un master, molte esportazioni.

photoZseo non è affiliato o approvato da alcun mercato. I nomi dei marketplace vengono utilizzati solo per descrivere la compatibilità.
