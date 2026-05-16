---
title: "Bulk CSV/XLSX import to 46 marketplaces — auto-detect 41 platforms"
description: "Drop a Shopify, Amazon or Etsy export into photoZseo. We detect 41 platform signatures, pull photos in parallel and re-export to 46 marketplaces."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo accepts CSV, TSV, XLSX and JSON catalogs — and auto-detects 41 platform signatures from the file's column headers."
  - "Product photos are pulled in parallel from URLs in the file. Toggle Wi-Fi only if you don't want to burn cellular data."
  - "Re-export the same catalog to 46 marketplaces, each with its own SEO filenames, platform-correct image sizes and column order."
faqs:
  - q: "Which file formats can I import into photoZseo?"
    a: "CSV, TSV, XLSX and JSON. Each can carry product titles, descriptions, prices, SKUs, barcodes and photo URLs. Most sellers drop in their existing Shopify or Amazon export and skip mapping entirely."
  - q: "What does 'auto-detect 41 platform signatures' mean in practice?"
    a: "photoZseo inspects the file's column headers and matches them against 41 known platform export schemas — Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce and 33 others. If your file came from one of those platforms, mapping is automatic."
  - q: "Does importing photos from URLs use my mobile data?"
    a: "Only if you allow it. There's a Wi-Fi only toggle in import settings, on by default. With it on, downloads pause and resume automatically when you switch networks. Off, it'll use whatever connection is active."
  - q: "What if my catalog has 5,000 products?"
    a: "photoZseo imports in batches and keeps the UI responsive. Photo URL downloads run in parallel — the practical limit is your bandwidth, not the app. A 5,000-row catalog with photo URLs typically lands in 10–20 minutes on standard home Wi-Fi."
  - q: "Can I re-export to a different marketplace than the source?"
    a: "Yes — that's the point. Import a Shopify catalog, hit export, pick Amazon (or Etsy, or Trendyol). photoZseo rebuilds the file in the destination platform's exact column order, with images resized to that platform's spec."
---

The hardest part of selling on a new marketplace isn't the marketplace. It's getting your existing 800 products into it without re-typing every title, re-uploading every photo and re-mapping every column.

photoZseo's bulk catalog import handles the round-trip. Drop in a file you already have, and you're 80% of the way to a new platform.

## Why bulk import exists

If you're an Amazon FBA seller adding Trendyol, an Etsy shop expanding to TikTok Shop, or a Shopify store moving to Walmart, your catalog already exists. You exported it once. The problem is that every platform speaks a slightly different schema — different column names, different image specs, different product taxonomies. The manual fix is hours of spreadsheet work per new channel.

photoZseo cuts it to minutes.

## What gets imported

The importer reads four formats:

- **CSV** — Shopify product exports, Amazon flat-file uploads, Trendyol bulk templates.
- **TSV** — tab-separated variants from older or in-house systems.
- **XLSX** — Excel files with multi-sheet catalogs.
- **JSON** — API exports or in-house product feeds.

Each can carry titles, descriptions, prices, SKUs, barcodes, variant axes (size, color), inventory and — crucially — photo URLs. Once it's in photoZseo, the same data drives quotes, exports and SEO auto-fill.

## Auto-detect across 41 platforms

The killer feature isn't the format support. It's the auto-detect.

photoZseo inspects the file's column headers and matches them against 41 known platform export schemas:

- **Western marketplaces:** Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- **Turkish:** Trendyol, Hepsiburada, N11
- **Cross-border Asia:** AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- **Latin America:** Mercado Libre, Coupang
- **Europe:** Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...and 17 more.

If your file came from any of these, photoZseo recognizes it on drop. No column mapping wizard. No "what does this header mean" prompts. It just works.

## Photo URLs are pulled in parallel

Most catalog exports include photo URLs, not embedded images. photoZseo downloads them in parallel — multiple connections, smart retry, perceptual-hash deduplication so the same product photo doesn't import twice.

There's a **Wi-Fi only toggle** that's on by default. With it on:

- Downloads pause when you leave Wi-Fi and resume when you're back.
- No cellular surprise on your phone bill.
- A 2,000-product import won't drain your data plan.

With it off, photoZseo uses whatever connection is active — useful on a desk with wired internet or a Mac on Ethernet.

## A practical workflow

Here's the round-trip most sellers run:

**Step 1 — Export from the source platform.** Shopify, Amazon or Etsy all let you download your catalog as CSV/XLSX. Grab it.

**Step 2 — Drop the file into photoZseo.** On iPhone, hit Import in any project. On Mac, drag from Finder. Auto-detect identifies the platform and starts pulling photo URLs in the background.

**Step 3 — Let [AI fill the SEO fields](/features/seo-filenames).** photoZseo writes title, slug, meta description, alt text, tags and keywords for each product, in 12 languages if you sell internationally.

**Step 4 — Export to a new marketplace.** Pick the destination — Amazon, Trendyol, Walmart, whatever. photoZseo rewrites the file in that platform's exact column order, resizes images to the platform's spec, and packages the result as a single ZIP.

**Step 5 — Upload to the new channel.** The output file is ready for whatever bulk-upload tool the destination uses.

What used to be a week of spreadsheet work is a 30-minute lunch break.

## Why this matters for cross-border sellers

The single biggest blocker to expanding beyond your home marketplace is the catalog conversion cost. Most sellers stay on Amazon US not because Amazon US is best, but because moving to Mercado Libre or Trendyol means rebuilding the catalog from scratch.

Bulk import + 46 marketplace presets removes that blocker. The same product data flows to every channel. New marketplaces are a feature toggle, not a project.

For indie sellers who want to ship globally without hiring a catalog manager, this is the unlock.
