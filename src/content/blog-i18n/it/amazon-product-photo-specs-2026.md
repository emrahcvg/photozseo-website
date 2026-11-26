---
title: "Requisiti per le foto dei prodotti Amazon nel 2026"
description: "Dimensioni esatte, tipi di file e regole di base che Amazon applica alle immagini dei prodotti e come trasmetterle al primo caricamento."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "L'immagine principale di Amazon deve avere dimensioni minime 1000×1000 (consigliato 2000×2000), quadrato 1:1, sfondo #FFFFFF bianco puro, JPEG, sRGB, inferiore a 10 MB."
  - "Le cause di rifiuto più rapide: quasi bianco anziché bianco reale, prodotto più piccolo dell'85% della cornice, filigrane o testo sull'immagine principale."
  - "Rimani sotto i 600 KB per immagine dopo la compressione: la CDN di Amazon ricodifica qualsiasi cosa più grande e pesa la velocità della pagina nel tuo ranking di conversione."
faqs:
  - q: "Qual è la dimensione minima dell'immagine per le foto dei prodotti Amazon?"
    a: "1000 pixel sul lato più lungo sono il minimo assoluto. Al di sotto, Amazon disabilita la funzione di zoom sulla tua inserzione e le inserzioni senza zoom vengono declassate dall'algoritmo. Punta a 2000×2000 per dare a Amazon spazio per ricomprimersi senza ammorbidirsi."
  - q: "È meglio JPEG o PNG per le inserzioni Amazon?"
    a: "JPEG. Amazon accetta anche TIFF, PNG e GIF, ma JPEG si comprime più piccolo, viene elaborato più velocemente sul CDN di Amazon e non ci sono vantaggi in termini di trasparenza su uno sfondo #FFFFFF. Risparmia nello spazio colore sRGB, qualità 80–85."
  - q: "Amazon richiede sfondi bianchi puri per ogni foto?"
    a: "Solo l'immagine principale: questa è la regola che Amazon applica con i controlli automatizzati. Le immagini secondarie possono mostrare il prodotto nel contesto, su un modello, con la confezione o in scene di stile di vita. La prima foto è il portiere."
  - q: "Quanto dovrebbe essere grande il prodotto nella cornice?"
    a: "La linea guida di Amazon rappresenta almeno l'85% dell'immagine. I prodotti più piccoli spesso non superano la revisione automatizzata o vengono contrassegnati manualmente nei controlli di categoria. Centrare il prodotto e ritagliarlo stretto."
  - q: "Posso caricare foto HEIC dal mio iPhone a Amazon?"
    a: "No. Amazon prevede JPEG, TIFF, PNG o GIF. Converti HEIC in JPEG prima del caricamento: la preimpostazione Amazon di photoZseo lo fa automaticamente e taglia il file a 200-600 KB senza perdita di qualità visibile."
---

Amazon rifiuta le inserzioni prima che la maggior parte dei venditori le veda. Il colpevole è quasi sempre la foto: un file troppo pesante, uno sfondo che non è veramente bianco o un formato che la piattaforma rifiuta silenziosamente.

Ecco il cheat sheet delle specifiche del 2026, estratto dalla documentazione del venditore di Amazon e testato rispetto agli elenchi in tempo reale.

## Principali regole dell'immagine

- Dimensioni: minimo 1000×1000, consigliato 2000×2000. Al di sotto di 1000 sul lato più lungo, Amazon non abiliterà lo zoom e l'algoritmo tratta gli elenchi senza zoom come di qualità inferiore.
- Proporzioni: quadrato (1:1) per l'immagine principale. Le immagini secondarie possono essere 4:5 o 16:9.
- Sfondo: bianco puro, esagonale `#FFFFFF`. Gli studi fotografici "quasi bianchi" non superano i controlli automatizzati più spesso di quanto i venditori si aspettino.
- Formato: JPEG (`.jpg`) è la scelta più sicura. TIFF, PNG e GIF sono accettati, ma JPEG si comprime meglio ed è elaborato più velocemente sul CDN di Amazon.
- Spazio colore: sRGB. Le immagini salvate in Adobe RGB o ProPhoto appaiono opache dopo la ricodifica di Amazon.
- Dimensioni del file: meno di 10 MB per immagine. Punta a 200-600 KB dopo la compressione: i file di grandi dimensioni rallentano il caricamento della pagina del prodotto e la velocità della pagina incide sulla conversione.

## Cosa fa sopprimere un elenco

1. Filigrane, sovrapposizioni di testo o loghi sull'immagine del prodotto.
2. Oggetti di scena non inclusi in ciò che riceverà il cliente.
3. Bordo, cornice o qualsiasi sfondo diverso dal bianco puro per l'immagine principale.
4. Prodotto che occupa meno dell'85% della cornice dell'immagine.
5. Manichini (per abbigliamento) o piattaforme di supporto visibili.

## Come photoZseo applica le specifiche

Il preset Amazon all'interno di photoZseo fa quattro cose contemporaneamente:

1. Ritaglia su una cornice quadrata con il prodotto centrato all'85% della tela.
2. Ridimensiona il lato più lungo a 2000 pixel (esegue l'upscaling in modo intelligente se la sorgente è più piccola).
3. Scrive un JPEG pulito a sRGB, qualità 85, solitamente 250–450 KB.
4. Se la rimozione dello sfondo è abilitata, sostituisce lo sfondo su cui foto con puro #FFFFFF e sfuma i bordi in modo che il prodotto non sembri tagliato e incollato.

L'intera pipeline funziona tramite telefono. Niente lascia il tuo dispositivo.

## Una rapida lista di controllo della conformità

Prima di caricare, conferma:

- [] Il lato più lungo è ≥1000 px (preferibilmente 2000 px)
- [] Lo sfondo supera un test di "selezione del bianco": i quattro angoli si leggono come `#FFFFFF`
- [ ] Il file ha dimensioni inferiori a 10 MB ed è stato salvato come JPEG
- [ ] Il rapporto aspetto è 1:1 per l'immagine principale
- [ ] Nessun testo, filigrana o cornice

Se tutti e cinque vengono controllati, l'elenco supererà la convalida automatizzata di Amazon al primo tentativo e salterai il avanti e indietro che uccide i tempi di lancio.
