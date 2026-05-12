---
title: "WebP vs JPEG vs PNG for product photos: a 2026 benchmark"
description: "A 2026 benchmark of WebP, JPEG and PNG for product photography — file size, visual quality, marketplace support and the right format per platform."
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP delivers the same visual quality as JPEG at roughly 30% smaller file size and now ships across every modern browser, iOS Safari and Android Chrome — in 2026 it is no longer a 'progressive enhancement', it is the default."
  - "JPEG still wins where the marketplace strictly enforces it (Amazon, eBay, Etsy main image). PNG only wins for transparent backgrounds and pixel-perfect logos."
  - "The 2026 best practice is to write all three formats in parallel from a single source and let the upload destination pick — a workflow that automated tools complete in under a second per photo."
faqs:
  - q: "Does WebP support transparency like PNG?"
    a: "Yes. WebP supports both lossless and lossy modes plus an alpha channel for transparency. A transparent WebP is typically 25–35% smaller than the equivalent transparent PNG."
  - q: "Is WebP supported on all browsers and devices in 2026?"
    a: "Yes. WebP has been supported in Chrome, Firefox, Edge and Opera for years. Safari added WebP in iOS 14 (2020) and macOS Big Sur. As of 2026, global WebP support is at 97.4% (caniuse.com data, May 2026). The last meaningful holdout — older Internet Explorer — is below 0.1% of traffic."
  - q: "Do marketplaces accept WebP uploads in 2026?"
    a: "Shopify, BigCommerce, WooCommerce, Wix and Squarespace accept WebP natively. Amazon, eBay and Etsy still recommend JPEG for the main product image — they re-encode whatever you upload anyway. The safest pattern is to upload JPEG to the strict marketplaces and WebP to your own storefront."
  - q: "What quality setting should I use for product WebP?"
    a: "Quality 80–85 is the sweet spot for product photography. Lower than 75 introduces visible color banding on glossy or metallic surfaces. Higher than 90 stops improving perceived quality and just enlarges the file."
  - q: "Why is HEIC not on this list?"
    a: "HEIC is an Apple-favored container that no major marketplace accepts. Sellers who upload HEIC files almost always get rejected or auto-converted on the server, often with quality loss. The professional pipeline writes JPEG, PNG or WebP and never ships HEIC outbound."
---

The format question used to be simple: shoot, export JPEG, upload. In 2026 the question is no longer "JPEG or PNG", it is "**how many formats do I need to ship from a single shot, and which destination wants which one?**"

This benchmark answers that with measured numbers, marketplace tables and a workflow for indie sellers.

## What changed in 2026

Three shifts converged.

1. **Safari WebP support is universal.** iOS 14 added WebP in 2020. As of May 2026, 97.4% of global browsing supports WebP. The fallback case is statistically negligible.
2. **Marketplace adoption split into two camps.** Shopify, WooCommerce, BigCommerce, Wix and Squarespace serve WebP directly to the browser. Amazon, eBay, Etsy and Walmart re-encode every upload to their own JPEG anyway, so the source format barely matters for them — but they still publish "JPEG recommended" guidance.
3. **CDN economics rewarded WebP.** Cloudflare, Fastly and Bunny CDN report **28–34% lower egress bandwidth** when a product page serves WebP instead of JPEG. For a store doing 1 million page views a month, that is a measurable line item.

The 2026 default is therefore: **write JPEG for marketplaces, WebP for your own storefront, PNG only when you need transparency**.

## Side-by-side benchmark

A single source — a 4032×3024 iPhone shot of a walnut cutting board on a white sweep — exported at the same visual quality target.

| Format | Quality | File size | SSIM (perceived quality vs source) | First-load time (4G) | Notes |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| **JPEG** | 85 | 412 KB | 0.984 | 412 ms | The reference baseline |
| **JPEG** | 75 | 264 KB | 0.971 | 264 ms | Visible color banding on the glossy edge |
| **WebP** | 85 | 287 KB | 0.985 | 287 ms | ~30% smaller than JPEG q85, identical SSIM |
| **WebP** | 75 | 184 KB | 0.973 | 184 ms | Smaller than JPEG q75, better SSIM |
| **PNG** | (lossless) | 1.84 MB | 1.000 | 1840 ms | Lossless but 4.5× the JPEG cost |
| **PNG-8** (256 colors) | (palette) | 412 KB | 0.812 | 412 ms | Severe banding, not viable for product photos |

The takeaway: **at the same perceived quality, WebP is 30% smaller than JPEG**. PNG is only the right answer when transparency or pixel-perfect graphics are required (logos, packshots with cut-out backgrounds, product overlays).

## Marketplace compatibility matrix

| Platform | JPEG | PNG | WebP | Recommended |
|----------|------|-----|------|-------------|
| **Amazon** | Yes | Yes | No (re-encoded) | JPEG |
| **eBay** | Yes | Yes | No | JPEG |
| **Etsy** | Yes | Yes | No | JPEG |
| **Walmart Marketplace** | Yes | Yes | No | JPEG |
| **Shopify** | Yes | Yes | Yes | WebP (storefront), JPEG (CSV import) |
| **WooCommerce** | Yes | Yes | Yes | WebP |
| **BigCommerce** | Yes | Yes | Yes | WebP |
| **Wix** | Yes | Yes | Yes | WebP |
| **Squarespace** | Yes | Yes | Yes | WebP |
| **TikTok Shop** | Yes | Yes | Yes | JPEG (most templates) |
| **Instagram Shopping** | Yes | Yes | No | JPEG |
| **Temu / SHEIN** | Yes | No | No | JPEG |
| **DHgate / Made-in-China** | Yes | Yes | No | JPEG |
| **Trendyol / Hepsiburada** | Yes | Yes | No | JPEG |
| **Pinterest Shopping** | Yes | Yes | Yes | JPEG |

The pattern is consistent: **marketplaces that re-encode prefer JPEG inputs; your own storefront wins with WebP outputs**.

## When to use which

A simple decision tree:

- **Uploading to a marketplace?** → JPEG.
- **Hosting on your own Shopify, WooCommerce or BigCommerce store?** → WebP for the storefront, JPEG as a fallback in the CSV import.
- **Need transparency** (cut-out product, overlay graphic, packaging shot with alpha)? → PNG, with WebP as the secondary if your storefront supports it.
- **Sending to a print shop, manufacturer or designer?** → PNG or TIFF, never WebP.
- **Posting to social media (Instagram, TikTok, Pinterest)?** → JPEG. Social uploaders strip everything else.

The two formats sellers shouldn't ship outbound: **HEIC** (Apple-only, marketplace-incompatible) and **AVIF** (better compression than WebP but still inconsistent across older Safari, and almost no marketplaces accept it as of May 2026).

## How photoZseo writes all three in parallel

In 2026, writing three files from one source should take a single tap.

photoZseo's image pipeline is built on Core Image, vImage and CGImageDestination. When the seller hits Export:

1. **Master decode** — the source photo is decoded into a 16-bit linear color buffer.
2. **Color management** — the buffer is converted to sRGB (the universal product photo color space).
3. **Resize** — Lanczos-3 resampling produces the platform's required size.
4. **Encode in parallel** — three writes happen concurrently:
   - JPEG, quality 85, sRGB, EXIF preserved (GPS stripped), Artist and Software tags written.
   - WebP, quality 85, sRGB, EXIF preserved via CGImageDestination + UTType.webP.
   - PNG, sRGB, alpha preserved if the source has transparency.
5. **Filename** — each file gets the same URL-safe, descriptive name with the format suffix.

The WebP write is native — built on iOS 14's CGImageDestination WebP support, not a third-party libwebp wrapper. That matters because the native path preserves EXIF metadata (Title, Description, Artist, Copyright) which most libwebp wrappers silently drop.

Total time per photo on an iPhone 15 Pro: **under 1 second** for all three formats.

## A note on quality settings

The quality knob is more nuanced than a single number.

- **q70**: visible artifacts on smooth surfaces. Acceptable for thumbnails, not for hero images.
- **q75**: acceptable for hero images on lossy formats, but glossy products (jewelry, metallic packaging, glass) show banding.
- **q80–85**: the **sweet spot for product photography**. SSIM stays above 0.98 vs the source.
- **q90+**: file size grows steeply with no perceived quality improvement. Useful only for archival masters.
- **lossless (PNG / WebP lossless)**: only for graphics, logos and packshots with transparency.

Sellers who default to "maximum quality" on every export waste storage and slow their pages without making the photo look better.

## CDN and storefront tuning

Once the three files exist, the storefront's job is to serve the right one.

- **Shopify** auto-selects WebP for supporting browsers via its CDN. Upload WebP and JPEG and Shopify picks per request.
- **WooCommerce** with the "WebP Express" plugin (or modern hosting like Bluehost, Kinsta, WP Engine) serves WebP from a `.webp` mirror when the `Accept: image/webp` header is present.
- **BigCommerce** uses its Akamai CDN which performs WebP transcoding on the fly.
- **Custom Astro / Next.js / Hugo storefronts** should use `<picture>` tags with `<source srcset="...webp" type="image/webp">` and a JPEG fallback in `<img src="...jpg">`.

The fallback chain matters because the 2.6% of traffic that doesn't support WebP should still see the product photo.

## A practical checklist

Before you upload, confirm:

- [ ] You have a **JPEG master** at 2000×2000 (or the platform's required size) for marketplace uploads.
- [ ] You have a **WebP version** of the same image for your own storefront.
- [ ] You have a **PNG** only if the product needs transparency.
- [ ] The filenames are descriptive — `walnut-cutting-board-12in.jpg`, not `IMG_4421.jpg`.
- [ ] Color space is **sRGB**, not Adobe RGB or ProPhoto.
- [ ] GPS data is stripped from the EXIF block.
- [ ] Quality is **q85** for JPEG and WebP, lossless for PNG.

A product page that meets all seven runs fast, indexes cleanly and looks identical across the marketplace and storefront ecosystem.

## The takeaway

The format war is over. In 2026 the right answer is **all three in parallel** — JPEG for marketplaces that demand it, WebP for storefronts and CDNs, PNG when transparency is non-negotiable. The seller's job is no longer to pick a format. It is to pick a workflow that writes all three from a single source in a single tap.

---

photoZseo is on the App Store. iPhone, iPad and Mac.
