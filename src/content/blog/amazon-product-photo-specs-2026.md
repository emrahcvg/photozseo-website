---
title: "Amazon product photo requirements in 2026"
description: "Exact sizes, file types and background rules Amazon enforces on product images — and how to pass them on the first upload."
pubDate: 2026-04-18
readingMinutes: 5
tags: [amazon, product-photos, seo]
---

Amazon rejects listings before most sellers ever see them. The culprit is almost always the photo — a file that's too heavy, a background that isn't truly white, or an aspect ratio the platform quietly refuses.

Here's the 2026 spec cheat sheet, pulled from Amazon's seller documentation and tested against live listings.

## Main image rules

- **Dimensions:** 1000×1000 minimum, 2000×2000 recommended. Below 1000 on the longest side, Amazon won't enable zoom — and the algorithm treats zoom-less listings as lower quality.
- **Aspect ratio:** Square (1:1) for the main image. Secondary images can be 4:5 or 16:9.
- **Background:** Pure white, hex `#FFFFFF`. "Near-white" photographed studios fail automated checks more often than sellers expect.
- **Format:** JPEG (`.jpg`) is the safest pick. TIFF, PNG and GIF are accepted but JPEG compresses better and processes faster on Amazon's CDN.
- **Color space:** sRGB. Images saved in Adobe RGB or ProPhoto appear dull after Amazon's re-encoding.
- **File size:** Under 10 MB per image. Aim for 200–600 KB after compression — large files slow down product page load, and page speed weights into conversion.

## What gets a listing suppressed

1. Watermarks, text overlays or logos on the product image.
2. Props that aren't included in what the customer will receive.
3. Border, frame or any background other than pure white for the main image.
4. Product occupying less than 85% of the image frame.
5. Mannequins (for apparel) or visible support rigs.

## How photoZseo applies the spec

The Amazon preset inside photoZseo does four things at once:

1. Crops to a square frame with the product centered at 85% of the canvas.
2. Resizes the longest side to 2000 pixels (upscales intelligently if the source is smaller).
3. Writes out a clean JPEG at sRGB, quality 85 — usually 250–450 KB.
4. If background removal is enabled, replaces whatever backdrop you shot on with pure #FFFFFF and feathers the edges so the product doesn't look cut-and-pasted.

The whole pipeline runs on the phone. Nothing leaves your device.

## A quick compliance checklist

Before you upload, confirm:

- [ ] Longest side is ≥1000 px (2000 px preferred)
- [ ] Background passes a "white-picker" test — the four corners read as `#FFFFFF`
- [ ] File is under 10 MB and saved as JPEG
- [ ] Aspect ratio is 1:1 for the main image
- [ ] No text, watermark, or frame

If all five check out, the listing will pass Amazon's automated validation on the first try — and you skip the back-and-forth that kills launch timing.
