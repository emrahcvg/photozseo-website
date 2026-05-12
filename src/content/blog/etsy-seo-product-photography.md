---
title: "Etsy SEO: how product photography actually moves rankings"
description: "Why the right photo gets found on Etsy — filename structure, alt text, and the specs that map to Etsy's image crawler."
pubDate: 2026-05-09
readingMinutes: 4
tags: [etsy, seo, product-photos]
tldr:
  - "Etsy reads your image filename and alt text as ranking signals — `handmade-ceramic-mug-blue-front.jpg` beats `IMG_4829.jpg` for the same product."
  - "Start at 2000×2000 pixels at 1:1 for the main image — Etsy re-compresses on upload, so feeding the max size keeps the final result sharp."
  - "Fill all 10 photo slots. The three that move the needle: clean main shot, scale shot with a recognizable object, detail/texture shot that justifies the price."
faqs:
  - q: "What image filename format does Etsy reward?"
    a: "Lowercase, hyphens (no underscores or spaces), product keyword first, direction or angle last, 3–6 words total. Example: `linen-bedding-set-queen-folded.jpg`. Etsy displays the filename in page source and Google Images crawls it, so the filename doubles as a search ranking signal."
  - q: "Does alt text really affect Etsy search?"
    a: "Yes — Etsy's own help center recommends descriptive alt text for every image. Alt text is indexed by Etsy search, exposed to screen readers (accessibility ranking signal), and parsed by Google Images. Write it like a sentence: 'Blue handmade ceramic mug with matte finish, front view on white background.'"
  - q: "Does Etsy support WebP for product photos?"
    a: "Etsy accepts JPEG and PNG on upload. They convert internally to optimized formats for delivery. PNG only if you need transparency (rare for product photos). JPEG at 2000×2000, sRGB, quality 85 is the safe default."
  - q: "How many photos should each Etsy listing have?"
    a: "Etsy allows 10 photo slots and empty slots correlate with lower conversion. Aim for at least 5: main on white, scale with a hand or known object, texture/detail close-up, in-use lifestyle, and packaging or scale variant. Fill the rest with angle and color variants."
  - q: "Can I reuse Amazon photos on Etsy?"
    a: "The main shot translates — both platforms reward a clean main image with the product at 85% of frame. But Etsy buyers expect more lifestyle context: handmade, story-driven photos consistently outperform sterile catalog photos on Etsy specifically. photoZseo's Etsy preset auto-applies the Etsy size (2000×2000, 1:1) so you can swap photos in seconds."
---

Etsy's search algorithm isn't Google. It leans heavily on title, tags, and listing quality — but **image SEO** is the quiet multiplier. When two listings are equally relevant, Etsy surfaces the one shoppers actually click, and click-through depends on the first photo.

Here's what moves the needle in 2026.

## The filename trick

Etsy displays a listing's image filename in the page source. Google Images then crawls it. A file called `IMG_4829.jpg` tells search nothing; `handmade-ceramic-mug-blue-front.jpg` tells both Etsy *and* Google exactly what's in the photo.

The format that wins:

- Lowercase only
- Hyphens, no underscores or spaces
- Product keyword first, direction tag last
- 3–6 words maximum

photoZseo's SEO filename engine generates these from your product name plus the direction tag you picked during shooting.

## Image specs Etsy prefers

- **Dimensions:** 2000×2000 pixels. Etsy re-compresses on upload, so starting at the platform's maximum means the final listing image doesn't get softened twice.
- **Aspect ratio:** 1:1 for the thumbnail. Secondary images can be 4:3 or 3:4 — these get full attention on the listing page.
- **Format:** JPEG or PNG. PNG only if you need transparency (you almost never do on Etsy).
- **Background:** Etsy allows lifestyle shots for the main image, unlike Amazon. But a clean white or neutral backdrop still outperforms cluttered scenes for most categories — handmade jewelry, pottery, and leather goods especially.

## Alt text is a ranking signal

Alt text isn't visible to shoppers, but it is to the accessibility tree and to search crawlers. Etsy's own help center recommends a descriptive alt attribute for every listing image.

What works:

> *"Blue handmade ceramic mug with matte finish, front view on white background"*

What doesn't:

> *"mug"*

photoZseo writes alt text from the same product name + direction pairing that drives the filename. Every exported image carries its alt text in the XMP metadata, and photoZseo's Shopify CSV export copies it into the alt field automatically. For Etsy, paste the suggested alt text into the "Photo description" box when you add the image.

## The 3-photo formula that converts

Etsy allows up to 10 images per listing. Data from Etsy's seller handbook and third-party A/B tests converges on the same top three:

1. **Main shot** — product centered, clean background, 85% of frame.
2. **Scale shot** — product next to a hand, a book, or another object the shopper recognizes in size.
3. **Detail shot** — texture, hardware, stitching — the thing that justifies the price tag.

Everything after the third image is diminishing returns, but fill them anyway. Empty photo slots correlate with lower conversion.

## The 60-second test

Before you publish, ask:

- Would this photo show up in a Google Image search for *"blue ceramic mug"*?
- Does the filename read like a product title?
- Does the alt text describe what a visually impaired shopper would want to know?

If yes to all three, the listing is doing what Etsy's algorithm and Google's crawler both reward.
