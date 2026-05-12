---
title: "B2B quote builder for e-commerce: VAT, IBAN, HS codes and e-signature in 2026"
description: "A 2026 reference for indie e-commerce sellers building B2B quotes — VAT modes, IBAN, HS codes, Incoterms 2020, e-signature legality and a practical workflow."
pubDate: 2026-05-12
readingMinutes: 10
tags: [b2b, quote, vat, hs-codes, incoterms, e-signature]
tldr:
  - "Indie e-commerce sellers in 2026 receive B2B quote requests routinely — wholesalers, gift-shop chains, hotel buyers — and a Word doc is no longer a credible response."
  - "A real B2B quote needs 12 specific fields: buyer info, line items with VAT and unit of measure, HS codes, Incoterms, payment terms, IBAN, and a signature with an audit trail."
  - "On-device quote builders (including photoZseo's Quote module) generate compliant quotes with HS code lookup, Incoterms 2020 presets, EU/UK/US/Turkey VAT modes, IBAN validation and e-signature in one document."
faqs:
  - q: "What's the legal status of an e-signature on a B2B quote in 2026?"
    a: "In the EU, eIDAS (Regulation 910/2014) gives a Simple Electronic Signature (SES) the same legal weight as a wet signature for commercial contracts in nearly all member states. In the US, the ESIGN Act (2000) and UETA give electronic signatures the same legal effect as a handwritten signature. In Turkey, KVKK and the Electronic Signature Law 5070 recognize qualified electronic signatures (QES) as equivalent to wet signatures."
  - q: "Do I need an HS code on a B2B quote if the buyer is in the same country?"
    a: "Not legally, but procurement teams in 2026 routinely ask for the HS code anyway. They use it to estimate customs duty on re-export, to map the product into their ERP, and to filter for compliance with restricted-goods lists. Including the HS code on every quote (domestic and international) is the professional default."
  - q: "What's the difference between Incoterms FOB, EXW and DDP?"
    a: "EXW (Ex Works) — buyer collects from your warehouse, buyer pays everything. FOB (Free On Board) — you deliver to the named port, buyer takes over at the rail. DDP (Delivered Duty Paid) — you deliver to the buyer's door with duties paid. Incoterms 2020 has 11 terms in total; FOB, EXW and DDP cover ~80% of indie B2B quotes."
  - q: "Do I need to write the total amount in words on a B2B quote?"
    a: "In Turkey, Germany, France, Italy and most Middle Eastern countries, the amount-in-words is legally required on invoices and strongly customary on quotes. In the US and UK it is optional. Including it on every quote is the safer default — it costs nothing and prevents disputes if a digit gets miscopied."
  - q: "What VAT mode applies if I sell from Germany to a buyer in France in 2026?"
    a: "Under the EU OSS (One Stop Shop) regime, B2B sales between VAT-registered businesses in the EU use the reverse charge mechanism — you invoice at 0% VAT and the buyer accounts for it in their own filing. You must record the buyer's VAT ID and verify it via the VIES system. For B2C, you charge the buyer's country VAT rate via the OSS quarterly return."
---

The B2B request shows up like this. A wholesaler emails: "We saw your shop on Etsy. Can you send a quote for 100 units, delivered to our Brussels warehouse, by August?"

In 2026, the seller who replies with a Word doc and a PayPal link loses the contract. The procurement team needs a quote with **VAT, IBAN, HS codes, Incoterms and a signature** — the same package they get from a $50M supplier. Most indie sellers don't realize how close that bar is.

This piece is the reference: what goes on a B2B quote in 2026, what's legally required, and how to produce one in under five minutes from your phone.

## Why indie sellers need real quotes, not Word docs

Three forces converged. **Procurement digitized** — ERP systems (SAP S/4HANA, Dynamics 365, Odoo) expect structured quote data with VAT and HS code per line. **Customs got stricter** — EU CBAM and ICS2 require HS codes at the quote stage for many categories. **Buyers want audit trails** — a signed, timestamped quote survives a future dispute; a Word doc does not.

The result: an indie seller who **can produce a compliant B2B quote in five minutes** wins contracts that used to go to the next-tier-up supplier.

## Anatomy of a B2B quote

A buyer's procurement team checks twelve fields. Miss one and the quote goes back for revision — which slows the sale by 2–5 business days.

| # | Field | What it is | Why it matters |
|---|------|------------|----------------|
| 1 | **Quote number** | Unique identifier per quote | Procurement filing, dispute trace |
| 2 | **Quote date + valid-until date** | When the quote was issued and when prices expire | Locks in the price for a window |
| 3 | **Seller block** | Legal name, address, VAT ID, contact, tax office | Legal counterparty identification |
| 4 | **Buyer block** | Buyer's legal name, address, VAT ID, contact | Counterparty + reverse-charge VAT determination |
| 5 | **Line items** | Per row: SKU, description, quantity, unit, unit price, VAT rate, HS code, line total | The actual deliverable |
| 6 | **Subtotal, VAT, total** | Math summary | Procurement reconciles to PO |
| 7 | **Currency** | ISO 4217 code | Avoids exchange-rate disputes |
| 8 | **Amount in words** | "Forty-two thousand five hundred euros" | Fraud prevention; required in many jurisdictions |
| 9 | **Incoterm** | 2020 term (e.g., FOB Hamburg, DDP Brussels) | Defines who pays what for shipping/customs |
| 10 | **Payment terms** | Net-30, 50% upfront, etc. | Cashflow contract |
| 11 | **IBAN / banking** | IBAN, SWIFT/BIC, bank name | Where the buyer wires the money |
| 12 | **Signature** | Wet or electronic, timestamped | Legal binding |

Twelve fields. Every B2B quote in 2026 needs all twelve.

## VAT modes in 2026

VAT (sales tax) is the field indie sellers get wrong most often. The 2026 map.

| Region | Mode | When it applies | Rate examples |
|--------|------|-----------------|---------------|
| **EU member state** | Domestic VAT | Same country, B2B or B2C | 19% (DE), 20% (FR, IT), 21% (NL, ES, BE) |
| **EU cross-border B2B** | Reverse charge (0% on invoice) | EU seller → EU buyer, both VAT-registered | 0% (verified via VIES) |
| **EU cross-border B2C** | OSS (One Stop Shop) | EU seller → consumer in another EU state | Buyer-country rate, declared via OSS |
| **EU import** | IOSS (Import One Stop Shop) | Non-EU seller → EU consumer, ≤€150 | Buyer-country rate, declared via IOSS |
| **UK** | UK VAT | UK supply (post-Brexit) | 20% standard, 5% reduced, 0% zero-rated |
| **US** | Sales tax | State-level, varies by nexus | 0%–11% depending on state |
| **Turkey** | KDV | Domestic + selected exports | 1%, 10%, 20% |
| **Canada** | GST/HST/QST | Federal + provincial | 5% GST + provincial overlay |
| **Australia** | GST | Standard | 10% |
| **UAE / Saudi** | VAT | Standard | 5% (UAE), 15% (KSA) |

A B2B quote in 2026 should declare the VAT mode at the header level (e.g., "Reverse charge — EU intra-community supply, Art. 138 EU VAT Directive") and the rate per line item if the rate varies.

## HS codes — why customs blocks shipments without them

The **Harmonized System code** is a 6 to 10 digit number that classifies every traded product. The first 6 digits are standardized worldwide (WCO); digits 7–10 are country-specific (EU TARIC, US HTSUS).

Examples: **9603.10** (handicraft brushes), **6109.10** (cotton T-shirts), **4202.32** (wallets), **9405.41** (LED lamps).

Customs uses the HS code to compute duty, apply trade agreements (EU-Japan EPA, USMCA, RCEP) and screen for restricted goods. A shipment with the **wrong HS code** can be held for 5–30 days. A shipment with **no HS code** is held until one is supplied.

The 2026 best practice: **look up the HS code per SKU during product onboarding**, store it in the product database, and print it on every quote. photoZseo's Quote module integrates HS lookup at the product level, so the code is set once and propagates to every quote.

## Incoterms 2020 quick reference

Incoterms 2020 defines 11 terms. Three cover ~80% of indie B2B quotes:

| Term | Meaning | Who pays shipping | Who pays customs |
|------|---------|-------------------|------------------|
| **EXW** | Ex Works — buyer picks up from your studio | Buyer | Buyer |
| **FOB** | Free On Board (named port) | Seller to port, then buyer | Buyer (after port) |
| **DDP** | Delivered Duty Paid — door-to-door, all-in | Seller | Seller |

The other eight (CIF, CIP, DAP, DPU, FCA, CPT, CFR, FAS) are common in industrial trade but rarely appear in an indie quote. When in doubt, **EXW for local pickup, FOB for export, DDP for premium delivered offers**.

## E-signature legal status

The 2026 legal map for electronic signatures on commercial documents:

| Region | Governing law | Status |
|--------|---------------|--------|
| **EU** | eIDAS Regulation 910/2014 | SES, AES, QES all valid; QES = wet signature |
| **UK** | Electronic Communications Act 2000 | Valid for most commercial contracts |
| **US** | ESIGN Act + UETA | Equivalent to wet signature |
| **Turkey** | Electronic Signature Law 5070 | QES = wet signature |
| **Canada / Australia / UAE / India** | Local statutes | Electronic signatures recognized |

For a B2B quote between two private companies, a **simple electronic signature with a timestamp and a device audit trail** is sufficient under nearly every jurisdiction. Regulated industries (pharma, defense, financial services) often require a Qualified Electronic Signature (QES) from an EU-trust-list provider — outside the indie seller scope.

photoZseo's Quote module embeds a **finger-drawn signature** in the PDF with a timestamp and device identifier. For craft, fashion, accessories and wholesale consumer goods, that is contractually binding in the EU, UK, US, Turkey, Canada, Australia and most of MENA.

## Practical workflow with photoZseo

End-to-end quote generation in 2026:

1. **Buyer block auto-fills** from the contact picker (name, address, VAT ID, email).
2. **Sender profile pre-fills**: your legal name, address, VAT ID, IBAN, tax office. Configured once.
3. **Add line items**: SKU, quantity, unit (pcs/kg/m/ream — full UN code list), unit price, VAT rate, HS code per line.
4. **Choose Incoterm** from the 11-term menu and name the port/place (e.g., "FOB Hamburg").
5. **Payment terms, currency, validity window** — Net-30, USD/EUR, 14 days default.
6. **Subtotal, VAT, total** auto-compute. **Amount in words** auto-generates in the active app language.
7. **Sign** with finger or Apple Pencil; optional buyer signature field for in-person deals.
8. **Export PDF** — email, AirDrop, WhatsApp Business or iCloud Drive.

Total time for a 10-line quote: **3–5 minutes**, all 12 fields populated, audit trail in the PDF metadata.

## A practical checklist

Before you send a B2B quote, confirm:

- [ ] Quote number is unique and sequential.
- [ ] Valid-until date is set (default 14 days, or what the buyer asked).
- [ ] Buyer's VAT ID is **verified** (VIES for EU, HMRC for UK).
- [ ] Each line has an HS code if the order may cross a border.
- [ ] VAT mode is correct — domestic, reverse charge, OSS, or zero-rated export.
- [ ] Incoterm names the city/port — not just "FOB" but "FOB Hamburg".
- [ ] Payment terms specify upfront percentage if any.
- [ ] IBAN and SWIFT are correct (one digit wrong = a wire that goes nowhere).
- [ ] Amount in words matches the numeric total.
- [ ] Signature is present with a timestamp.

If all ten check out, the quote is procurement-ready.

## The takeaway

The B2B opportunity for indie e-commerce sellers in 2026 is real and growing. Wholesalers, hotels, gift shops, corporate gifting buyers and trade buyers find indie brands through Etsy, Instagram, TikTok Shop and Shopify, and they want to buy at scale. The barrier is **producing a quote that looks like the supplier they already buy from**.

A 12-field, VAT-correct, HS-coded, e-signed PDF is no longer something only enterprises produce. In 2026 it is something an indie seller writes from their phone, in their second language, in under five minutes.

The sellers who internalize that operate at a different level than the ones still pasting numbers into a Word doc.

---

photoZseo is on the App Store. iPhone, iPad and Mac.
