---
title: "WebP, JPEG e PNG per le foto dei prodotti: un punto di riferimento per il 2026"
description: "Un punto di riferimento del 2026 di WebP, JPEG e PNG per la fotografia di prodotti: dimensione del file, qualità visiva, supporto del marketplace e formato corretto per piattaforma."
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP offre la stessa qualità visiva di JPEG con dimensioni di file inferiori di circa il 30% e ora viene fornito su tutti i browser moderni, iOS Safari e Android Chrome: nel 2026 non è più un \"miglioramento progressivo\", è l'impostazione predefinita."
  - "JPEG vince ancora laddove il mercato lo applica rigorosamente (immagine principale Amazon, eBay, Etsy). PNG vince solo per sfondi trasparenti e loghi pixel-perfect."
  - "La migliore pratica per il 2026 è scrivere tutti e tre i formati in parallelo da un'unica fonte e lasciare che sia la destinazione del caricamento a scegliere, un flusso di lavoro che gli strumenti automatizzati completano in meno di un secondo per foto."
faqs:
  - q: "WebP supporta la trasparenza come PNG?"
    a: "SÌ. WebP supporta sia la modalità lossless che quella lossy oltre a un canale alfa per la trasparenza. Un WebP trasparente è in genere più piccolo del 25-35% rispetto all'equivalente PNG trasparente."
  - q: "WebP è supportato su tutti i browser e dispositivi nel 2026?"
    a: "SÌ. WebP è supportato da anni in Chrome, Firefox, Edge e Opera. Safari ha aggiunto WebP in iOS 14 (2020) e macOS Big Sur. Nel 2026, il supporto WebP globale è pari al 97,4% (dati caniuse.com, maggio 2026). L'ultimo ostacolo significativo, il vecchio Internet Explorer, è inferiore allo 0,1% del traffico."
  - q: "I marketplace accettano caricamenti WebP nel 2026?"
    a: "Shopify, BigCommerce, WooCommerce, Wix e Squarespace accettano WebP in modo nativo. Amazon, eBay e Etsy consigliano comunque JPEG per l'immagine principale del prodotto: ricodificano comunque tutto ciò che carichi. Il modello più sicuro è caricare JPEG sui mercati rigorosi e WebP sul tuo negozio."
  - q: "Quale impostazione di qualità dovrei utilizzare per il prodotto WebP?"
    a: "La qualità 80–85 è il punto debole per la fotografia di prodotto. Inferiore a 75 introduce bande di colore visibili su superfici lucide o metalliche. Un valore superiore a 90 interrompe il miglioramento della qualità percepita e ingrandisce semplicemente il file."
  - q: "Perché HEIC non è presente in questo elenco?"
    a: "HEIC è un contenitore preferito da Apple che nessun grande mercato accetta. I venditori che caricano file HEIC vengono quasi sempre rifiutati o convertiti automaticamente sul server, spesso con perdita di qualità. La pipeline professionale scrive JPEG, PNG o WebP e non spedisce mai HEIC in uscita."
---

La domanda sul formato era semplice: fotografia, esportazione JPEG, caricamento. Nel 2026 la domanda non è più "JPEG o PNG", ma "quanti formati devo spedire da una singola foto e quale destinazione vuole quale?"

Questo benchmark risponde a questa domanda con numeri misurati, tabelle di mercato e un flusso di lavoro per venditori indipendenti.

## Cosa è cambiato nel 2026

Tre turni convergevano.

1. Il supporto di Safari WebP è universale. iOS 14 ha aggiunto WebP nel 2020. A partire da maggio 2026, il 97,4% della navigazione globale supporta WebP. Il caso di fallback è statisticamente trascurabile.
2. L'adozione del mercato è divisa in due campi. Shopify, WooCommerce, BigCommerce, Wix e Squarespace forniscono WebP direttamente al browser. Amazon, eBay, Etsy e Walmart ricodificano comunque ogni caricamento nel proprio JPEG, quindi il formato sorgente ha poca importanza per loro, ma pubblicano comunque la guida "JPEG consigliato".
3. L’economia della CDN ha premiato WebP. Cloudflare, Fastly e Bunny CDN segnalano una larghezza di banda in uscita inferiore del 28-34% quando la pagina di un prodotto offre WebP anziché JPEG. Per un negozio che registra 1 milione di pagine visualizzate al mese, si tratta di un elemento pubblicitario misurabile.

L'impostazione predefinita del 2026 è quindi: scrivi JPEG per i marketplace, WebP per la tua vetrina, PNG solo quando hai bisogno di trasparenza.

## Punto di riferimento affiancato

Una singola fonte, una foto iPhone 4032×3024 di un tagliere di noce su uno sfondo bianco, è stata esportata con lo stesso target di qualità visiva.

| Formato | Qualità | Dimensioni del file | SSIM (qualità percepita rispetto alla fonte) | Tempo di primo caricamento (4G) | Note |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| JPEG | 85 | 412KB | 0.984 | 412 ms | Il riferimento di riferimento |
| JPEG | 75 | 264KB | 0.971 | 264 ms | Bande di colore visibili sul bordo lucido |
| WebP | 85 | 287KB | 0.985 | 287 ms | ~30% più piccolo di JPEG q85, SSIM identico |
| WebP | 75 | 184KB | 0.973 | 184 ms | Più piccolo di JPEG q75, migliore SSIM |
| PNG | (senza perdite) | 1,84MB | 1.000 | 1840 ms | Senza perdite ma 4,5 volte il costo JPEG |
| PNG-8 (256 colori) | (tavolozza) | 412KB | 0.812 | 412 ms | Bande evidenti, non utilizzabili per le foto dei prodotti |

Il punto è che, a parità di qualità percepita, WebP è più piccolo del 30% rispetto a JPEG. PNG è la risposta giusta solo quando sono necessarie trasparenza o grafica pixel-perfect (loghi, packshot con sfondi ritagliati, sovrapposizioni di prodotti).

## Matrice di compatibilità del mercato

| Piattaforma | JPEG | PNG | WebP | Raccomandato |
|----------|------|-----|------|-------------|
| Amazon | SÌ | SÌ | No (ricodificato) | JPEG |
| eBay | SÌ | SÌ | NO | JPEG |
| Etsy | SÌ | SÌ | NO | JPEG |
| Walmart Marketplace | SÌ | SÌ | NO | JPEG |
| Shopify | SÌ | SÌ | SÌ | WebP (vetrina), JPEG (importazione CSV) |
| WooCommerce | SÌ | SÌ | SÌ | WebP |
| BigCommerce | SÌ | SÌ | SÌ | WebP |
| Wix | SÌ | SÌ | SÌ | WebP |
| Spazio quadrato | SÌ | SÌ | SÌ | WebP |
| TikTok Shop | SÌ | SÌ | SÌ | JPEG (la maggior parte dei modelli) |
| Instagram Acquisti | SÌ | SÌ | NO | JPEG |
| Temu/SHEIN | SÌ | NO | NO | JPEG |
| DHgate/Made-in-China | SÌ | SÌ | NO | JPEG |
| Trendyol/Hepsiburada | SÌ | SÌ | NO | JPEG |
| Pinterest Acquisti | SÌ | SÌ | SÌ | JPEG |

Lo schema è coerente: i mercati che ricodificano preferiscono gli input JPEG; la tua vetrina vince con gli output WebP.

## Quando usare quale

Un semplice albero decisionale:

- Caricamento su un marketplace? →JPEG.
- Hosting sul tuo negozio Shopify, WooCommerce o BigCommerce? → WebP per la vetrina, JPEG come fallback nell'importazione CSV.
- Hai bisogno di trasparenza (prodotto ritagliato, grafica sovrapposta, foto della confezione con alfa)? → PNG, con WebP come secondario se il tuo negozio lo supporta.
- Invio a una tipografia, a un produttore o a un designer? → PNG o TIFF, mai WebP.
- Pubblicare sui social media (Instagram, TikTok, Pinterest)? →JPEG. Gli uploader social eliminano tutto il resto.

I venditori di due formati non dovrebbero spedire in uscita: HEIC (solo Apple, incompatibile con il marketplace) e AVIF (compressione migliore rispetto a WebP ma ancora incoerente nei vecchi Safari e quasi nessun marketplace lo accetta a partire da maggio 2026).

## Come photoZseo scrive tutti e tre in parallelo

Nel 2026, scrivere tre file da un’unica fonte dovrebbe richiedere un solo tocco.

La pipeline di immagini di photoZseo è basata su Core Image, vImage e CGImageDestination. Quando il venditore seleziona Esporta:

1. Decodifica principale: la foto sorgente viene decodificata in un buffer di colore lineare a 16 bit.
2. Gestione del colore: il buffer viene convertito in sRGB (lo spazio colore universale delle foto dei prodotti).
3. Ridimensiona: il ricampionamento Lanczos-3 produce la dimensione richiesta dalla piattaforma.
4. Codifica in parallelo: tre scritture avvengono contemporaneamente:
   - JPEG, qualità 85, sRGB, EXIF ​​conservato (GPS rimosso), tag Artista e Software scritti.
   - WebP, qualità 85, sRGB, EXIF ​​conservato tramite CGImageDestination + UTType.webP.
   - PNG, sRGB, alfa preservato se la fonte ha trasparenza.
5. Nome file: a ogni file viene assegnato lo stesso nome descrittivo sicuro per l'URL con il suffisso del formato.

La scrittura WebP è nativa: basata sul supporto CGImageDestination WebP di iOS 14, non su un wrapper libwebp di terze parti. Ciò è importante perché il percorso nativo preserva i metadati EXIF ​​(titolo, descrizione, artista, copyright) che la maggior parte dei wrapper libwebp elimina silenziosamente.

Tempo totale per foto su uno iPhone 15 Pro: meno di 1 secondo per tutti e tre i formati.

## Una nota sulle impostazioni di qualità

La manopola della qualità è più sfumata di un singolo numero.

- q70: artefatti visibili su superfici lisce. Accettabile per le miniature, non per le immagini hero.
- q75: accettabile per immagini hero su formati con perdita di dati, ma i prodotti lucidi (gioielli, imballaggi metallici, vetro) mostrano strisce.
- q80–85: il punto debole per la fotografia di prodotti. SSIM rimane sopra 0,98 rispetto alla fonte.
- q90+: la dimensione del file aumenta notevolmente senza alcun miglioramento della qualità percepita. Utile solo per i maestri d'archivio.
- lossless (PNG / WebP lossless): solo per grafica, loghi e packshot con trasparenza.

Venditori che impostano per impostazione predefinita la "massima qualità" su ogni deposito di rifiuti di esportazione e rallentano le loro pagine senza migliorare l'aspetto della foto.

## CDN e sintonizzazione del negozio

Una volta che i tre file esistono, il compito del negozio è servire quello giusto.

- Shopify seleziona automaticamente WebP per supportare i browser tramite il suo CDN. Carica scelte WebP e JPEG e Shopify per richiesta.
- WooCommerce con il plugin "WebP Express" (o hosting moderno come Bluehost, Kinsta, WP Engine) serve WebP da un mirror `.webp` quando è presente l'intestazione `Accept: image/webp`.
- BigCommerce utilizza il suo CDN Akamai che esegue la transcodifica WebP al volo.
- Le vetrine personalizzate Astro/Next.js/Hugo devono utilizzare i tag `<picture>` con `<source srcset="...webp" type="image/webp">` e un fallback JPEG in `<img src="...jpg">`.

La catena di fallback è importante perché il 2,6% del traffico che non supporta WebP dovrebbe comunque vedere la foto del prodotto.

## Una pratica lista di controllo

Prima di caricare, conferma:

- [] Hai un master JPEG a 2000×2000 (o la dimensione richiesta dalla piattaforma) per i caricamenti sul marketplace.
- [ ] Hai una versione WebP della stessa immagine per la tua vetrina.
- [ ] Hai un PNG solo se il prodotto necessita di trasparenza.
- [ ] I nomi dei file sono descrittivi: `walnut-cutting-board-12in.jpg`, non `IMG_4421.jpg`.
- [ ] Lo spazio colore è sRGB, non Adobe RGB o ProPhoto.
- [ ] I dati GPS vengono rimossi dal blocco EXIF.
- [ ] La qualità è q85 per JPEG e WebP, senza perdita per PNG.

Una pagina di prodotto che soddisfa tutti e sette i criteri è veloce, viene indicizzata in modo pulito e appare identica nel mercato e nell'ecosistema del negozio.

## L'asporto

La guerra dei formati è finita. Nel 2026 la risposta giusta è tutte e tre in parallelo: JPEG per i marketplace che lo richiedono, WebP per vetrine e CDN, PNG quando la trasparenza non è negoziabile. Il compito del venditore non è più quello di scegliere un formato. Si tratta di scegliere un flusso di lavoro che li scriva tutti e tre da un'unica fonte con un solo tocco.

---

photoZseo è su App Store per iPhone e iPad.
