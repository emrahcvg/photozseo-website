---
title: "Generatore di preventivi B2B per e-commerce: IVA, IBAN, codici HS e firma elettronica nel 2026"
description: "Un riferimento per il 2026 per i venditori di e-commerce indipendenti che creano preventivi B2B: modalità IVA, IBAN, codici HS, Incoterms 2020, legalità della firma elettronica e un flusso di lavoro pratico."
pubDate: 2026-05-12
readingMinutes: 10
tags: [b2b, quote, vat, hs-codes, incoterms, e-signature]
tldr:
  - "I venditori di e-commerce indipendenti nel 2026 ricevono regolarmente richieste di preventivo B2B (grossisti, catene di negozi di articoli da regalo, acquirenti di hotel) e un documento Word non è più una risposta credibile."
  - "Un vero preventivo B2B necessita di 12 campi specifici: informazioni sull'acquirente, voci con IVA e unità di misura, codici HS, Incoterms, termini di pagamento, IBAN e una firma con una traccia di controllo."
  - "I generatori di preventivi sul dispositivo (incluso il modulo Preventivi di photoZseo) generano preventivi conformi con ricerca del codice HS, preimpostazioni Incoterms 2020, modalità IVA UE/Regno Unito/USA/Turchia, convalida IBAN e firma elettronica in un unico documento."
faqs:
  - q: "Qual è lo status giuridico della firma elettronica su un preventivo B2B nel 2026?"
    a: "Nell’UE, l’eIDAS (Regolamento 910/2014) attribuisce alla Firma Elettronica Semplice (SES) lo stesso peso legale di una firma elettronica per i contratti commerciali in quasi tutti gli Stati membri. Negli Stati Uniti, l'ESIGN Act (2000) e l'UETA attribuiscono alle firme elettroniche lo stesso effetto legale di una firma autografa. In Turchia, KVKK e la Legge sulla firma elettronica 5070 riconoscono le firme elettroniche qualificate (QES) come equivalenti alle firme elettroniche."
  - q: "Ho bisogno di un codice HS su un preventivo B2B se l'acquirente si trova nello stesso Paese?"
    a: "Non legalmente, ma i team di procurement nel 2026 richiedono comunque regolarmente il codice HS. Lo usano per stimare i dazi doganali sulla riesportazione, per mappare il prodotto nel loro ERP e per filtrare la conformità con gli elenchi di merci soggette a restrizioni. Includere il codice HS su ogni preventivo (nazionale e internazionale) è l'impostazione predefinita professionale."
  - q: "Qual è la differenza tra Incoterms FOB, EXW e DDP?"
    a: "EXW (franco fabbrica): l'acquirente ritira dal tuo magazzino, l'acquirente paga tutto. FOB (Franco a bordo) - consegni al porto convenuto, l'acquirente prende il carico alla ferrovia. DDP (Delivered Duty Paid): consegni alla porta dell'acquirente con dazi pagati. Gli Incoterms 2020 hanno 11 termini in totale; FOB, EXW e DDP coprono circa l'80% dei preventivi B2B indipendenti."
  - q: "È necessario scrivere l'importo totale in lettere su un preventivo B2B?"
    a: "In Turchia, Germania, Francia, Italia e nella maggior parte dei paesi del Medio Oriente, l'importo in lettere è obbligatorio per legge sulle fatture e fortemente consueto sui preventivi. Negli Stati Uniti e nel Regno Unito è facoltativo. Includerlo in ogni preventivo è l'impostazione predefinita più sicura: non costa nulla e previene controversie se una cifra viene copiata erroneamente."
  - q: "Quale modalità IVA si applica se vendo dalla Germania a un acquirente in Francia nel 2026?"
    a: "Nell'ambito del regime OSS (sportello unico) dell'UE, le vendite B2B tra imprese con partita IVA nell'UE utilizzano il meccanismo dell'inversione contabile: fatturi con IVA allo 0% e l'acquirente ne tiene conto nella propria dichiarazione. È necessario registrare la partita IVA dell'acquirente e verificarla tramite il sistema VIES. Per il B2C, addebiti l'aliquota IVA del paese dell'acquirente tramite la dichiarazione trimestrale OSS."
---

La richiesta B2B si presenta così. Un grossista invia un'e-mail: "Abbiamo visto il vostro negozio su Etsy. Potete inviare un preventivo per 100 unità, consegnate al nostro magazzino di Bruxelles, entro agosto?"

Nel 2026 il venditore che risponde con un documento Word e un link PayPal perde il contratto. Il team di approvvigionamento ha bisogno di un preventivo con IVA, IBAN, codici HS, Incoterms e una firma: lo stesso pacchetto che ricevono da un fornitore $50M. La maggior parte dei venditori indipendenti non si rende conto di quanto sia vicino quel bar.

Questo pezzo è il riferimento: cosa succede in un preventivo B2B nel 2026, cosa è richiesto dalla legge e come produrne uno in meno di cinque minuti dal tuo telefono.

## Perché i venditori indipendenti hanno bisogno di preventivi reali, non di documenti Word

Tre forze convergevano. Approvvigionamento digitalizzato: i sistemi ERP (SAP S/4HANA, Dynamics 365, Odoo) prevedono dati di preventivo strutturati con codice IVA e HS per riga. Le dogane sono diventate più severe: EU CBAM e ICS2 richiedono codici HS in fase di preventivo per molte categorie. Gli acquirenti vogliono tracce di controllo: un preventivo firmato e con timestamp sopravvive a una controversia futura; un documento Word no.

Il risultato: un venditore indipendente in grado di produrre un preventivo B2B conforme in cinque minuti si aggiudica contratti che prima andavano al fornitore di livello superiore.

## Anatomia di un preventivo B2B

Il team di procurement di un acquirente controlla dodici campi. Se ne perdi uno, il preventivo tornerà per essere revisionato, il che rallenterà la vendita di 2-5 giorni lavorativi.

| # | Campo | Di cosa si tratta | Perché è importante |
|---|------|------------|----------------|
| 1 | Numero preventivo | Identificatore univoco per preventivo | Archiviazione appalti, tracciamento controversie |
| 2 | Data del preventivo + data valida fino al | Quando è stato emesso il preventivo e quando scadono i prezzi | Blocca il prezzo di una finestra |
| 3 | Blocco del venditore | Denominazione legale, indirizzo, partita IVA, contatto, ufficio delle imposte | Identificazione della controparte legale |
| 4 | Blocco dell'acquirente | Ragione sociale, indirizzo, partita IVA, contatto dell'acquirente | Determinazione IVA controparte + reverse charge |
| 5 | Elementi pubblicitari | Per riga: SKU, descrizione, quantità, unità, prezzo unitario, aliquota IVA, codice HS, totale riga | Il risultato effettivo |
| 6 | Subtotale, IVA, totale | Riassunto di matematica | L'approvvigionamento si riconcilia con il PO |
| 7 | Valuta | Codice ISO 4217 | Evita le controversie sui tassi di cambio |
| 8 | Importo in parole | "Quarantaduemilacinquecento euro" | Prevenzione delle frodi; richiesto in molte giurisdizioni |
| 9 | Incoterm | Termine 2020 (ad esempio, FOB Amburgo, DDP Bruxelles) | Definisce chi paga cosa per la spedizione/dogana |
| 10 | Termini di pagamento | Net-30, 50% in anticipo, ecc. | Contratto di flusso di cassa |
| 11 | IBAN/bancario | IBAN, SWIFT/BIC, nome della banca | Dove l'acquirente trasferisce i soldi |
| 12 | Firma | Bagnato o elettronico, con timestamp | Vincolante legale |

Dodici campi. Ogni preventivo B2B nel 2026 ha bisogno di tutti e dodici.

## Modalità IVA nel 2026

L'IVA (imposta sulle vendite) è il campo in cui i venditori indipendenti sbagliano più spesso. La mappa del 2026.

| Regione | Modalità | Quando si applica | Valuta gli esempi |
|--------|------|-----------------|---------------|
| Stato membro dell'UE | IVA nazionale | Stesso paese, B2B o B2C | 19% (DE), 20% (FR, IT), 21% (NL, ES, BE) |
| B2B transfrontaliero dell’UE | Reverse charge (0% in fattura) | Venditore UE → Acquirente UE, entrambi titolari di partita IVA | 0% (verificato tramite VIES) |
| B2C transfrontaliero dell’UE | OSS (Sportello Unico) | Venditore UE → consumatore in un altro Stato UE | Tasso del paese acquirente, dichiarato tramite OSS |
| Importazione UE | IOSS (Sportello unico per l'importazione) | Venditore extra UE → Consumatore UE, ≤€150 | Tasso del paese acquirente, dichiarato tramite IOSS |
| Regno Unito | IVA nel Regno Unito | Offerta nel Regno Unito (post-Brexit) | 20% standard, 5% ridotto, 0% a tasso zero |
| NOI | Imposta sulle vendite | A livello statale, varia in base al nesso | 0% –11% a seconda dello stato |
| Tacchino | KDV | Esportazioni nazionali + selezionate | 1%, 10%, 20% |
| Canada | GST/HST/QST | Federale + provinciale | 5% GST + copertura provinciale |
| Australia | GST | Standard | 10% |
| Emirati Arabi Uniti/Arabia Saudita | I.V.A. | Standard | 5% (EAU), 15% (KSA) |

Un preventivo B2B nel 2026 dovrebbe dichiarare la modalità IVA a livello di intestazione (ad esempio, "Reverse charge - fornitura intracomunitaria UE, articolo 138 Direttiva IVA UE") e l'aliquota per voce se l'aliquota varia.

## Codici HS: perché la dogana blocca le spedizioni senza di essi

Il codice del sistema armonizzato è un numero da 6 a 10 cifre che classifica ogni prodotto commercializzato. Le prime 6 cifre sono standardizzate a livello mondiale (WCO); le cifre 7–10 sono specifiche del paese (EU TARIC, US HTSUS).

Esempi: 9603.10 (spazzole artigianali), 6109.10 (magliette in cotone), 4202.32 (portafogli), 9405.41 (lampade a LED).

La dogana utilizza il codice HS per calcolare i dazi, applicare gli accordi commerciali (EPA UE-Giappone, USMCA, RCEP) e verificare le merci soggette a restrizioni. Una spedizione con il codice HS errato può essere trattenuta per 5-30 giorni. Una spedizione senza codice HS viene trattenuta finché non ne viene fornito uno.

La migliore pratica per il 2026: cercare il codice HS per SKU durante l'onboarding del prodotto, archiviarlo nel database dei prodotti e stamparlo su ogni preventivo. Il modulo Preventivo di photoZseo integra la ricerca HS a livello di prodotto, quindi il codice viene impostato una volta e si propaga a ogni preventivo.

## Guida rapida agli Incoterms 2020

Gli Incoterms 2020 definiscono 11 termini. Tre coprono circa l'80% delle citazioni B2B indipendenti:

| Termine | Senso | Chi paga la spedizione | Chi paga la dogana |
|------|---------|-------------------|------------------|
| EXW | Franco fabbrica: l'acquirente ritira presso il tuo studio | Acquirente | Acquirente |
| FOB | Gratis a bordo (porto convenuto) | Venditore in porto, poi acquirente | Acquirente (dopo il porto) |
| DDP | Consegna sdoganata: porta a porta, tutto compreso | Venditore | Venditore |

Gli altri otto (CIF, CIP, DAP, DPU, FCA, CPT, CFR, FAS) sono comuni nel commercio industriale ma raramente compaiono in una quotazione indipendente. In caso di dubbio, EXW per ritiro locale, FOB per esportazione, DDP per offerte con consegna premium.

## Status giuridico della firma elettronica

La mappa giuridica 2026 per le firme elettroniche sui documenti commerciali:

| Regione | Legge applicabile | Stato |
|--------|---------------|--------|
| Unione Europea | Regolamento eIDAS 910/2014 | SES, AES, QES tutti validi; QES = firma bagnata |
| Regno Unito | Legge sulle comunicazioni elettroniche del 2000 | Valido per la maggior parte dei contratti commerciali |
| NOI | Atto ESIGN + UETA | Equivalente alla firma bagnata |
| Tacchino | Legge sulla firma elettronica 5070 | QES = firma bagnata |
| Canada/Australia/EAU/India | Statuti locali | Firme elettroniche riconosciute |

Per un preventivo B2B tra due aziende private, in quasi tutte le giurisdizioni è sufficiente una semplice firma elettronica con timestamp e un audit trail del dispositivo. Le industrie regolamentate (farmaceutica, difesa, servizi finanziari) spesso richiedono una firma elettronica qualificata (QES) da un fornitore presente nell'elenco di fiducia dell'UE, al di fuori dell'ambito dei venditori indipendenti.

Il modulo Preventivo di photoZseo incorpora una firma disegnata con il dito nel PDF con un timestamp e un identificatore del dispositivo. Per artigianato, moda, accessori e beni di consumo all'ingrosso, questo è contrattualmente vincolante in UE, Regno Unito, Stati Uniti, Turchia, Canada, Australia e nella maggior parte dei paesi MENA.

## Flusso di lavoro pratico con photoZseo

Generazione del preventivo end-to-end nel 2026:

1. L'acquirente blocca i riempimenti automatici dal selettore di contatti (nome, indirizzo, partita IVA, email).
2. Precompilazione del profilo mittente: ragione sociale, indirizzo, partita IVA, IBAN, ufficio delle imposte. Configurato una volta.
3. Aggiungi voci di riga: SKU, quantità, unità (pz/kg/m/risma - elenco completo di codici ONU), prezzo unitario, aliquota IVA, codice HS per riga.
4. Scegli Incoterm dal menu di 11 termini e dai un nome al porto/luogo (ad esempio, "FOB Amburgo").
5. Termini di pagamento, valuta, finestra di validità: Net-30, USD/EUR, 14 giorni predefiniti.
6. Totale parziale, IVA, calcolo automatico totale. L'importo in parole viene generato automaticamente nella lingua attiva dell'app.
7. Firma con il dito o con la matita Apple; campo opzionale per la firma dell'acquirente per le trattative di persona.
8. Esporta PDF: e-mail, AirDrop, WhatsApp Business o iCloud Drive.

Tempo totale per un preventivo di 10 righe: 3–5 minuti, tutti i 12 campi compilati, traccia di controllo nei metadati PDF.

## Una pratica lista di controllo

Prima di inviare un preventivo B2B, conferma:

- [ ] Il numero del preventivo è univoco e sequenziale.
- [ ] Valido fino alla data impostata (predefinito 14 giorni o quanto richiesto dall'acquirente).
- [ ] La partita IVA dell'acquirente è verificata (VIES per l'UE, HMRC per il Regno Unito).
- [ ] Ogni riga ha un codice HS se l'ordine può oltrepassare il confine.
- [ ] La modalità IVA è corretta: nazionale, inversione contabile, OSS o esportazione ad aliquota zero.
- [] Incoterm nomina la città/porto - non solo "FOB" ma "FOB Amburgo".
- [] I termini di pagamento specificano la percentuale anticipata, se presente.
- [ ] IBAN e SWIFT sono corretti (una cifra sbagliata = un filo che non va da nessuna parte).
- [ ] L'importo in parole corrisponde al totale numerico.
- [ ] La firma è presente con un timestamp.

Se vengono eseguiti tutti e dieci, il preventivo è pronto per l'approvvigionamento.

## L'asporto

L’opportunità B2B per i venditori di e-commerce indipendenti nel 2026 è reale e in crescita. Grossisti, hotel, negozi di articoli da regalo, acquirenti di regali aziendali e acquirenti commerciali trovano marchi indipendenti tramite Etsy, Instagram, TikTok Shop e Shopify e desiderano acquistare su larga scala. La barriera sta producendo un preventivo che assomiglia al fornitore da cui già acquistano.

Un PDF a 12 campi, con IVA corretta, codificato HS e firmato elettronicamente non è più qualcosa che producono solo le aziende. Nel 2026 è qualcosa che un venditore indipendente scrive dal proprio telefono, nella sua seconda lingua, in meno di cinque minuti.

I venditori che lo interiorizzano operano a un livello diverso rispetto a quelli che ancora incollano i numeri in un documento Word.

---

photoZseo è su App Store per iPhone e iPad.
