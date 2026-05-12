---
title: "Product photo SEO 2026: the 13 fields Google and ChatGPT actually read"
description: "A field-by-field breakdown of what search engines and LLMs extract from a product listing in 2026 — and the 13 inputs that move the needle for both."
pubDate: 2026-05-12
readingMinutes: 9
tags: [seo, product-photos, ai, llm, e-commerce]
tldr:
  - "Google's 2026 ranking signals merged image SEO with structured product data — alt text, filename and meta description now carry the same weight as the title."
  - "LLMs like ChatGPT and Perplexity extract products from listings by reading 13 specific fields. Miss one and your product disappears from the answer."
  - "Filling all 13 fields by hand takes 8–12 minutes per product. AI-driven auto-fill collapses that to under 30 seconds without changing the inputs the search engines look for."
faqs:
  - q: "Does Google still read image alt text in 2026?"
    a: "Yes. Alt text remains the single most important on-image signal for Google Image Search and now also feeds Google's Shopping Graph and AI Overviews. The 2025 leaked Content Warehouse documents confirmed `image.alt` is a top-tier indexing field."
  - q: "Do LLMs like ChatGPT read product pages directly?"
    a: "ChatGPT (via Bing), Perplexity (via Bing and Brave) and Claude (via web tools) all fetch product pages and parse the visible text plus the JSON-LD structured data block. They prioritize title, description, price, brand and image alt text — exactly the fields a sitemap-aware crawler indexes."
  - q: "What's the most underrated SEO field on a product page in 2026?"
    a: "The image filename. Sellers leave it as `IMG_0421.jpg` and lose a free keyword slot. Renaming the file to `walnut-cutting-board-large.jpg` gives Google Image Search and reverse-image queries a clean string to index."
  - q: "How long should a product meta description be?"
    a: "150–160 characters. Anything longer gets truncated in Google's SERP and in ChatGPT's source citations. Anything shorter signals thin content."
  - q: "Should I write different alt text for the same product on different marketplaces?"
    a: "Yes — but only the keyword density needs to shift. Amazon rewards descriptive alt text under 100 characters with the brand and material. Etsy prefers craft- and style-led phrasing. Google's index treats your own storefront's alt text as canonical."
---

The shift in 2026 is quiet but total. Google's AI Overviews now cite product listings the same way they cite Wikipedia paragraphs. ChatGPT's web search reads your storefront and recommends your product by name. Perplexity returns three competitors and a price band before a shopper has typed half a query.

If your product photo arrives as `IMG_0421.jpg` with no alt text and a 12-word description, you are invisible to all three.

This guide breaks down the **13 fields** that search engines and large language models actually read in 2026, ranked by impact, with the exact format each one expects.

## Why image SEO changed in 2026

Three things flipped this year.

1. **Google AI Overview rollout finished in March.** Overviews now appear above 64% of commercial queries, and they cite source pages. The citations favor structured product data — pages with full JSON-LD product schema get cited 3–4× more often than pages with only HTML.
2. **ChatGPT Search and Perplexity Shopping launched.** Both LLMs read the title, description, image alt text and price from a product page and surface them inside the chat answer. There is no "click to view" step — the buyer sees the product description verbatim inside the LLM response.
3. **Apple Foundation Models on iOS 26 + iPadOS 26 + macOS Sequoia.** On-device LLMs now generate product copy that matches what server-side LLMs read. Indie sellers can finally produce LLM-readable listings without paying a copywriter.

The net result: **the same 13 fields now serve both Google and the LLMs**. Filling them well is no longer two jobs.

## The 13 fields ranked by impact

| # | Field | What it does | Google impact | LLM impact |
|---|-------|-------------|---------------|------------|
| 1 | **Title** | The primary identifier of the product across every surface | Critical — H1 + page title + structured data | Critical — first field LLMs cite |
| 2 | **Slug** | URL path segment, ranks for the keyword in the URL | High — top-3 on-page signal | Medium — LLMs prefer clean URLs |
| 3 | **Filename** | Image file name, indexed by Google Image Search | High — feeds reverse image search | Medium — used as alt-text fallback |
| 4 | **Category** | Taxonomy node the product belongs to | High — feeds Shopping Graph | High — narrows LLM answer scope |
| 5 | **Meta description** | The 150–160 character pitch in SERPs | High — drives CTR | High — verbatim citation source |
| 6 | **Full product description** | Long-form copy on the product page | Critical — main ranking text | Critical — primary LLM context |
| 7 | **Alt text** | The text shown when the image fails to load | Critical for Image Search | High — LLMs use as image caption |
| 8 | **Tag 1 (style)** | Style or attribute descriptor | Medium — feeds faceted search | Medium — refines LLM filters |
| 9 | **Tag 2 (material)** | Composition or fabric | Medium | Medium |
| 10 | **Tag 3 (use case)** | What the product is for | Medium | High — matches buyer intent |
| 11 | **Tag 4 (audience)** | Who the product is for | Medium | High — refines LLM persona match |
| 12 | **Keywords** | Comma-separated index hints (meta keywords + internal) | Low for Google | Medium — boosts LLM recall |
| 13 | **Barcode (GTIN/UPC/EAN)** | Unique identifier | High — feeds Shopping Graph dedup | High — disambiguates LLM answer |

The order matters. Sellers who optimize only fields 1 and 6 leave the rest of the discovery funnel empty.

## How LLMs read product listings

Here is what happens when a shopper types **"best walnut cutting board for a 1-bedroom apartment"** into Perplexity in May 2026.

1. Perplexity issues a web search via Brave Search.
2. The top 8 results are fetched in parallel.
3. Each page is parsed for: `<title>`, `<meta description>`, JSON-LD `Product` schema, all `<img alt="">` text, and the first 2,000 visible characters of the body.
4. The LLM re-ranks the 8 results by **semantic match** — does the page describe a walnut board sized for small kitchens?
5. The top 3 are summarized into a 60-word answer with inline citations.

A page that has `<title>Walnut Cutting Board – 12" Compact</title>`, an alt text like `walnut cutting board for small apartments, 12 inch`, and a description that says "designed for studio and 1-bedroom kitchens" wins. A page with `<title>Cutting Board</title>` and alt text `image1.jpg` loses, even if the photo is better.

**ChatGPT's behavior is nearly identical**, with one difference: ChatGPT also reads the **filename** and uses it as a fallback caption when alt text is missing. That makes the filename a second alt-text slot — most sellers waste it.

## The on-device pipeline

Generating all 13 fields manually takes 8–12 minutes per product. Across 200 SKUs that's 30+ hours of typing.

The 2026 alternative is an **on-device LLM** that reads the photo and writes all 13 fields in one pass. Apple's Foundation Models framework (iOS 26+, iPadOS 26+, macOS Sequoia) runs a 3-billion-parameter LLM locally with no server round-trip and no analytics.

photoZseo uses the Apple Foundation Models framework together with the Vision framework to:

1. Detect the object in the photo (Vision's `VNClassifyImageRequest`).
2. Extract any visible text — labels, packaging, model numbers (Vision's `VNRecognizeTextRequest`).
3. Pull EXIF and computed color data.
4. Hand the structured signals to Foundation Models, which writes the 13 fields in your chosen language across 12 supported locales.

Output time per photo: **under 30 seconds**, 100% offline, zero data leaves the device.

The fields it produces map directly to the table above:

- **Title** (60–80 chars, keyword-front-loaded)
- **Slug** (lowercase, hyphenated, ASCII-safe)
- **Filename** (URL-safe, descriptive, JPEG/PNG/WebP suffix)
- **Category** (mapped to the closest marketplace taxonomy node)
- **Meta description** (150–160 chars)
- **Full product description** (180–400 words)
- **Alt text** (under 100 chars, keyword-natural)
- **4 tags** (style, material, use case, audience)
- **Keywords** (8–12 comma-separated)
- **Barcode** placeholder if the photo shows one

Every field is editable — the AI is a draft, not a verdict.

## A tactical checklist before you publish

Run this on the next product you upload to any marketplace.

- [ ] Title contains the **primary keyword** in the first 40 characters.
- [ ] Slug is **hyphenated**, lowercase, no underscores, under 60 characters.
- [ ] Filename describes the product — never `IMG_*`, `DSC_*` or a UUID.
- [ ] Category matches the marketplace's existing taxonomy (Amazon Browse Node, Etsy category, Shopify Smart Collection).
- [ ] Meta description is **150–160 characters**, ends without a period if you need every character.
- [ ] Body description includes **material**, **dimensions**, **intended use**, **audience** in the first paragraph.
- [ ] Alt text describes the photo, not the product abstract — `"walnut cutting board on white background"` not `"walnut cutting board for sale"`.
- [ ] At least **one tag per attribute axis**: style, material, use case, audience.
- [ ] Keywords are unique to this SKU, not copy-pasted across the catalog.
- [ ] Barcode (GTIN/UPC/EAN) is filled if you have one — empty barcodes hurt Shopping Graph eligibility.

A listing that passes all ten boxes gets crawled, indexed and cited. A listing that fails three or more drops out of the Overview entirely.

## Why "thin product pages" lose in 2026

Google's 2024 Helpful Content Update merged into the core algorithm in late 2025. Pages with 50-word descriptions and no structured data are now classified as **thin commerce** and demoted in the SERP regardless of backlinks.

LLMs penalize them even harder. A product page with no description cannot be cited because there is nothing to quote. Perplexity will skip it and quote the page below it.

This is the single biggest behavior change of 2026: **the LLM citation is the new featured snippet**, and a featured snippet needs text to quote.

## The takeaway

The 13 fields are not optional. They are the index. Whether a shopper arrives via Google Image Search, an AI Overview, a ChatGPT recommendation or a Perplexity comparison, the same 13 fields decide whether your product is in the answer.

The good news: filling them well is no longer a 10-minute-per-SKU task. On-device AI now drafts the full set in under a minute. The seller's job in 2026 is to **review and refine**, not to type.

---

photoZseo is on the App Store. iPhone, iPad and Mac.
