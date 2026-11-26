---
title: "Etsy SEO: come la fotografia del prodotto sposta effettivamente le classifiche"
description: "Perché la foto giusta viene trovata su Etsy: struttura del nome file, testo alternativo e specifiche che vengono mappate al crawler di immagini di Etsy."
pubDate: 2026-05-09
readingMinutes: 4
tags: [etsy, seo, product-photos]
tldr:
  - "Etsy legge il nome del file immagine e il testo alternativo come segnali di classificazione: `handmade-ceramic-mug-blue-front.jpg` batte `IMG_4829.jpg` per lo stesso prodotto."
  - "Inizia da 2000×2000 pixel a 1:1 per l'immagine principale: Etsy si ricomprime durante il caricamento, quindi l'alimentazione della dimensione massima mantiene nitido il risultato finale."
  - "Riempi tutti e 10 gli slot per le foto. I tre che muovono l'ago: foto principale pulita, foto in scala con un oggetto riconoscibile, foto dettaglio/texture che giustifichi il prezzo."
faqs:
  - q: "Quale formato del nome file immagine premia Etsy?"
    a: "Lettere minuscole, trattini (senza trattini bassi o spazi), prima la parola chiave del prodotto, per ultima la direzione o l'angolo, 3-6 parole in totale. Esempio: `linen-bedding-set-queen-folded.jpg`. Etsy visualizza il nome del file nell'origine della pagina e Google Images ne esegue la scansione, quindi il nome del file funge anche da segnale di classificazione della ricerca."
  - q: "Il testo alternativo influisce davvero sulla ricerca Etsy?"
    a: "Sì: il centro assistenza di Etsy consiglia un testo alternativo descrittivo per ogni immagine. Il testo alternativo viene indicizzato dalla ricerca Etsy, esposto agli screen reader (segnale di classificazione dell'accessibilità) e analizzato da Google Images. Scrivilo come una frase: \"Tazza in ceramica blu fatta a mano con finitura opaca, vista frontale su sfondo bianco\"."
  - q: "Etsy supporta WebP per le foto dei prodotti?"
    a: "Etsy accetta JPEG e PNG al momento del caricamento. Si convertono internamente in formati ottimizzati per la consegna. PNG solo se hai bisogno di trasparenza (raro per le foto dei prodotti). JPEG a 2000×2000, sRGB, qualità 85 è l'impostazione predefinita sicura."
  - q: "Quante foto dovrebbe avere ogni inserzione Etsy?"
    a: "Etsy consente 10 slot per foto e gli slot vuoti sono correlati a una conversione inferiore. Punta ad almeno 5: principale su bianco, scala con una mano o un oggetto conosciuto, primo piano di texture/dettagli, stile di vita in uso e confezione o variante in scala. Riempi il resto con varianti di angolazione e colore."
  - q: "Posso riutilizzare le foto Amazon su Etsy?"
    a: "La foto principale si traduce: entrambe le piattaforme premiano un'immagine principale pulita con il prodotto all'85% dell'inquadratura. Ma gli acquirenti di Etsy si aspettano un contesto di stile di vita più ampio: le foto fatte a mano e basate sulla trama superano costantemente le foto sterili del catalogo in particolare su Etsy. La preimpostazione Etsy di photoZseo applica automaticamente la dimensione Etsy (2000×2000, 1:1) in modo da poter scambiare foto in pochi secondi."
---

L'algoritmo di ricerca di Etsy non è Google. Si basa fortemente sul titolo, sui tag e sulla qualità dell'elenco, ma il SEO delle immagini è il moltiplicatore silenzioso. Quando due inserzioni sono ugualmente pertinenti, Etsy mostra quella su cui gli acquirenti effettivamente fanno clic e il clic dipende dalla prima foto.

Ecco cosa muove l’ago nel 2026.

## Il trucco del nome file

Etsy visualizza il nome del file immagine di un annuncio nell'origine della pagina. Google Images quindi lo esegue la scansione. Un file chiamato `IMG_4829.jpg` non dice nulla alla ricerca; `handmade-ceramic-mug-blue-front.jpg` dice sia a Etsy *che* Google esattamente cosa c'è nella foto.

Il formato che vince:

- Solo minuscolo
- Trattini, niente trattini bassi o spazi
- Prima la parola chiave del prodotto, per ultimo il tag di direzione
- 3–6 parole al massimo

Il motore dei nomi file SEO di photoZseo li genera dal nome del tuo prodotto più il tag di direzione che hai scelto durante la fotografia.

## Specifiche dell'immagine preferite da Etsy

- Dimensioni: 2000×2000 pixel. Etsy si ricomprime durante il caricamento, quindi iniziare dal massimo della piattaforma significa che l'immagine dell'elenco finale non viene ammorbidita due volte.
- Proporzioni: 1:1 per la miniatura. Le immagini secondarie possono essere 4:3 o 3:4: ricevono la massima attenzione nella pagina dell'elenco.
- Formato: JPEG o PNG. PNG solo se hai bisogno di trasparenza (non lo fai quasi mai su Etsy).
- Sfondo: Etsy consente foto lifestyle per l'immagine principale, a differenza di Amazon. Ma uno sfondo bianco pulito o neutro supera comunque le scene disordinate per la maggior parte delle categorie, in particolare gioielli fatti a mano, ceramiche e pelletteria.

## Il testo alternativo è un segnale di classificazione

Il testo alternativo non è visibile agli acquirenti, ma lo è nell'albero dell'accessibilità e nei crawler di ricerca. Il centro assistenza di Etsy consiglia un attributo alt descrittivo per ogni immagine dell'inserzione.

Cosa funziona:

> *"Tazza in ceramica blu fatta a mano con finitura opaca, vista frontale su sfondo bianco"*

Cosa non funziona:

> *"tazza"*

photoZseo scrive il testo alternativo dallo stesso nome del prodotto + abbinamento della direzione che guida il nome del file. Ogni immagine esportata porta il suo testo alternativo nei metadati XMP e l'esportazione CSV Shopify di photoZseo lo copia automaticamente nel campo alt. Per Etsy, incolla il testo alternativo suggerito nella casella "Descrizione foto" quando aggiungi l'immagine.

## La formula a 3 foto che converte

Etsy consente fino a 10 immagini per inserzione. I dati del manuale del venditore di Etsy e dei test A/B di terze parti convergono sugli stessi primi tre:

1. Foto principale: prodotto centrato, sfondo pulito, 85% dell'inquadratura.
2. Foto in scala: prodotto accanto a una mano, un libro o un altro oggetto che l'acquirente riconosce per le sue dimensioni.
3. Foto di dettaglio: trama, hardware, cuciture: la cosa che giustifica il prezzo.

Tutto dopo la terza immagine ha rendimenti decrescenti, ma riempili comunque. Gli slot per foto vuoti sono correlati a una conversione inferiore.

## Il test dei 60 secondi

Prima di pubblicare chiedi:

- Questa foto verrebbe visualizzata in una ricerca di immagini Google per *"tazza in ceramica blu"*?
- Il nome del file assomiglia al titolo di un prodotto?
- Il testo alternativo descrive ciò che un acquirente non vedente vorrebbe sapere?

Se sì a tutti e tre, l'elenco sta facendo ciò che l'algoritmo di Etsy e il crawler di Google premiano entrambi.
