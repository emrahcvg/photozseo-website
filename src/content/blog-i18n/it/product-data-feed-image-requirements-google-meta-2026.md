---
title: "Requisiti dell'immagine del feed dati prodotto: Google Merchant Center e Meta Catalog (2026)"
description: "Specifiche delle immagini per Google Merchant Center e feed Meta Catalog: pixel minimi, dimensioni consigliate, formati, limiti di file e motivo per cui le immagini vengono contrassegnate."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center: JPEG, WebP, PNG, GIF, BMP o TIFF fino a 16 MB; minimo 500 x 500 px per tutti i prodotti dal 31 gennaio 2027; Consigliati 1500 x 1500 px o superiori."
  - "Meta Catalogo: JPEG o PNG, massimo 8 MB, almeno 500 x 500 px; Per i negozi su Facebook e Instagram sono consigliati 1024 x 1024 px quadrati."
  - "Un singolo JPEG quadrato da 1500 x 1500 px con uno sfondo pulito, senza sovrapposizioni di testo e senza filigrane soddisfa entrambi i feed."
faqs:
  - q: "Quali sono i requisiti per le immagini Google Merchant Center nel 2026?"
    a: "Utilizza un collegamento immagine http/https in JPEG, WebP, PNG, GIF, BMP o TIFF, fino a 16 MB e 64 megapixel. Google consiglia 1500 x 1500 px o superiore e un minimo di 500 x 500 px si applica a tutti i prodotti dal 31 gennaio 2027."
  - q: "Qual è la dimensione minima dell'immagine per un catalogo Meta?"
    a: "La specifica dei dati di prodotto di Meta richiede almeno 500 x 500 pixel per l'immagine principale, in JPEG o PNG inferiore a 8 MB. Per i negozi su Facebook e Instagram, Meta consiglia 1024 x 1024 pixel."
  - q: "Quante immagini aggiuntive posso aggiungere a un feed di prodotto?"
    a: "Il link_immagine_addizionale di Google accetta fino a 10 immagini aggiuntive. Il riferimento ai campi del catalogo di Meta consente fino a 50 URL di immagini aggiuntivi."
  - q: "Posso utilizzare lo stesso file immagine per Google Shopping e Meta?"
    a: "Di solito sì. Un JPEG quadrato di 1500 x 1500 px o più, che mostra il prodotto reale su uno sfondo pulito senza testo o filigrane, soddisfa le regole pubblicate di entrambe le piattaforme."
  - q: "Perché Meta o Google contrassegnano l'immagine del mio prodotto?"
    a: "Le cause più comuni sono testo sovrapposto, badge promozionali, filigrane, bordi, immagini segnaposto come \"immagine in arrivo\", immagini troppo piccole e URL di immagini che bloccano i crawler o non corrispondono al tipo di file."
---

La risposta breve: sia per Google Merchant Center che per Meta Catalog, invia un JPEG quadrato di almeno 1500 x 1500 pixel, mostrando il prodotto reale su uno sfondo pulito, senza testo, badge o filigrane. Il pavimento rigido di Google è 500 x 500 px (per tutti i prodotti dal 31 gennaio 2027) e anche quello di Meta è 500 x 500 px, ma entrambe le piattaforme consigliano file più grandi. Le tabelle seguenti forniscono i numeri esatti dalla documentazione di ciascuna piattaforma.

*Ultima verifica: novembre 2026. Fonti: Google Merchant Center Guida ("Link immagine [image_link]", "Link immagine aggiuntiva [additional_image_link]", "Come risolvere: Immagine troppo piccola"); Centro assistenza Meta Business ("Specifiche delle immagini dei prodotti per i cataloghi"); Meta per sviluppatori ("Campi del catalogo").*

## Google Merchant Center vs Meta Catalogo: fianco a fianco

| Requisito | Google Merchant Center | Metacatalogo |
|---|---|---|
| Campo dell'immagine principale | `image_link` | `image_link` |
| Formati accettati | JPEG, WebP, PNG, GIF, BMP, TIFF | JPEG, PNG |
| Dimensione massima del file | 16 MB (e 64 megapixel) | 8 MB |
| Dimensione minima | 500 x 500 px per tutti i prodotti dal 31 gennaio 2027 (prima: 100 x 100 px o 250 x 250 px per l'abbigliamento) | 500x500px |
| Taglia consigliata | 1500 x 1500 px o superiore | 1024 x 1024 px (Negozi su Facebook e Instagram) |
| Proporzioni | Nessun rapporto fisso dichiarato; Google può applicare un ritaglio sottile | I negozi espongono un quadrato 1:1; Gli annunci carosello funzionano meglio quando tutte le immagini condividono lo stesso rapporto (1:1 o 4:5) |
| Immagini aggiuntive | Fino a 10 (`additional_image_link`) | Fino a 50 (`additional_image_link`) |
| Inquadratura del prodotto | Il prodotto dovrebbe riempire circa il 75%-90% dell'immagine | L'immagine principale dovrebbe mostrare l'intero prodotto |
| Regole dell'URL | http/https, solo ASCII, RFC 3986, da 1 a 2.000 caratteri | Utilizza l'URL dell'immagine del prodotto corrente |

Per la scadenza Google in dettaglio, vedere il nostro post precedente su [Google Shopping minimo 500 x 500 px](/it/blog/google-merchant-center-500px-image-requirement-2027).

## Cosa cambia la regola Google 500 x 500 px?

Fino al 31 gennaio 2027, la pagina di risoluzione dei problemi di Google elenca ancora le soglie inferiori: 100 x 100 px per la maggior parte dei prodotti e 250 x 250 px per l'abbigliamento. Dopo tale data per ogni categoria si applica il minimo di 500 x 500 px. Google afferma che le immagini inferiori al minimo non verranno mostrate, sebbene il prodotto stesso non sia disapprovato. Google rileva inoltre che gli annunci Shopping di YouTube necessitano di immagini di almeno 500 x 500 px per apparire in TV.

Conseguenza pratica: un feed pieno di miniature da 300 px non interromperà completamente le tue inserzioni, ma quei prodotti perderanno la loro immagine dove conta. Riesporta dagli originali invece di ingrandire una miniatura.

## Cosa richiede Meta per le immagini del catalogo?

L'articolo della guida di Meta elenca queste nozioni di base: almeno un'immagine per prodotto, JPEG o PNG, massimo 8 MB, e l'immagine deve rappresentare accuratamente il prodotto specifico in vendita. Per i negozi su Facebook e Instagram, le immagini dei prodotti vengono visualizzate come un quadrato (1:1), con una dimensione minima di 500 x 500 px e una dimensione consigliata di 1024 x 1024 px.

Meta suggerisce anche quattro o più immagini per prodotto, un'immagine principale chiara che mostra l'intero prodotto, un mix di angolazioni e primi piani, le stesse immagini del tuo sito web, uno sfondo bianco e JPEG su PNG per la qualità dell'immagine.

### In che modo Meta ritaglia le immagini del catalogo?

In Gestione delle vendite (Impostazioni, quindi Catalogo) scegli una delle tre modalità di ritaglio: riempi la cornice con l'immagine (l'impostazione predefinita, che ingrandisce), mostra l'intera immagine nella cornice (è possibile aggiungere spazi bianchi) o ritaglia e ridimensiona per adattarla alla cornice. Meta afferma che le immagini non vengono ritagliate da nessun'altra parte in Shops su Instagram e per niente in Shops su Facebook, a parte l'impostazione della pagina del prodotto Instagram. Se il tuo catalogo mescola proporzioni, gli annunci carosello potrebbero modificarle automaticamente; fornire ogni immagine nello stesso rapporto (1:1 o 4:5) lo evita.

## Perché le immagini dei prodotti vengono contrassegnate o disapprovate?

Entrambe le piattaforme elencano problemi quasi identici. Controlla prima questi nel tuo feed:

| Problema | Google | Meta |
|---|---|---|
| Sovrapposizioni di testo, codici promozionali, inviti all'azione | Non consentito (prezzo, spedizione, testo promozionale) | Non consigliato (testo in sovrapposizione, inviti all'azione, codici promozionali) |
| Filigrane, loghi aggiunti | Non consentito a meno che non sia fisicamente parte del prodotto | Non raccomandato |
| Immagini segnaposto ("immagine in arrivo") | Non consentito | Evitare; le nuove immagini necessitano di un nuovo URL per essere aggiornate |
| Confini | Non consentito | Non menzionato nelle specifiche |
| Grafica generica al posto del prodotto | Non consentito (eccezioni per alcune categorie di hardware, veicoli e software) | L'immagine deve rappresentare il prodotto esatto |
| Troppo piccolo | Immagine non mostrata (dopo il 31 gennaio 2027) | Al di sotto di 500 x 500 px non soddisfa le specifiche |
| Accesso crawler | Consenti Googlebot e l'immagine Googlebot nel file robots.txt; le modifiche richiedono dalle 24 alle 48 ore | Non specificato nelle specifiche |
| Tipo di file non corrispondente | L'estensione deve corrispondere al formato reale | Solo JPEG o PNG |

Due trappole specifiche per il mangime sono facili da perdere. Innanzitutto, Google desidera URL stabili senza parametri dinamici come timestamp o ID di sessione. In secondo luogo, Meta aggiorna un'immagine sostituita solo se il nuovo file ha un URL diverso, quindi sovrascrivere `shoe.jpg` sul posto non aggiornerà il tuo catalogo.

## Un'esportazione che soddisfa entrambi i feed

1. Inizia dalla foto originale, non compressa.
2. Esporta un quadrato 1:1 a 1500 x 1500 px o più come JPEG (sotto gli 8 MB, comodamente sotto entrambi i limiti).
3. Mantieni il prodotto a circa il 75%-90% dell'inquadratura su uno sfondo pulito.
4. Rimuovi sovrapposizioni, badge, filigrane e bordi dall'immagine del feed; mantenere le versioni promozionali per gli annunci.
5. Utilizza un nome file descrittivo e un URL stabile e scansionabile.
6. Inserisci angoli extra in `additional_image_link` (Google: fino a 10).

## Dove si adatta photoZseo

Se prepari immagini per molti marketplace e feed, [fotoZseo](/it/download) su iPhone e iPad ridimensiona, comprime e rinomina le foto dei prodotti per 46 marketplace da una foto e [Estensione di Chrome](/it/chrome-extension) fa lo stesso dalle pagine dei prodotti con nomi di file SEO ed esportazione in blocco. Il nostro [guida alle dimensioni delle immagini del marketplace](/it/marketplace-image-sizes) elenca i numeri per mercato.

*photoZseo non è affiliato o approvato da alcun marketplace, Google o Meta. Controlla sempre le linee guida attuali delle piattaforme prima di effettuare un caricamento di grandi dimensioni.*
