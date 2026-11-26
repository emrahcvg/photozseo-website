---
title: "White background product photos: the RGB 255 rule explained"
description: "Amazon and Walmart require a pure white main image (RGB 255, 255, 255). Why near-white fails, how to check your background, and how to get true white from an iPhone photo."
pubDate: 2026-11-26
readingMinutes: 4
tags: [amazon, walmart, product-photos, background]
tldr:
  - "Amazon and Walmart require the main product image on pure white: RGB 255, 255, 255 (#FFFFFF)."
  - "Near-white such as RGB 245, 245, 245 looks white to the eye but does not meet the rule."
  - "The reliable way to get true white is to remove the background and place the product on a #FFFFFF canvas."
faqs:
  - q: "What exactly is a pure white background?"
    a: "Every background pixel has the value RGB 255, 255, 255 (hex #FFFFFF). Light grey or slightly warm white does not count."
  - q: "Which marketplaces require a white background?"
    a: "Amazon and Walmart require it for the main image. Many other marketplaces recommend it because white main images look consistent in search results."
  - q: "Do secondary images need a white background?"
    a: "No. Additional images can show the product in use, with scale references or in a lifestyle setting."
---

"White background" sounds simple until a listing is suppressed for a background that looked white. Marketplaces mean something precise.

## The rule

- **Amazon:** the main image must be on a **pure white background, RGB 255, 255, 255** ([Seller Central](https://sellercentral.amazon.com/gp/help/external/G9FUUH87RBNXGKB7)).
- **Walmart Marketplace:** the main image needs a **seamless white background, RGB 255, 255, 255** ([Walmart Marketplace Learn](https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content%2C%20imagery%2C%20and%20media/Product-detail-page:-Image-guidelines-&-requirements)).

Secondary images are free to show context.

## Why "almost white" fails

A photo of a product on white paper usually has background pixels around **RGB 235–250**: shadows, vignetting and the camera's white balance pull it slightly grey or warm. To the eye it looks white; to an automated check it is not.

## How to check your background

1. Open the image in any editor with a color picker.
2. Sample the background in several places, especially the corners.
3. Every sample should read **255, 255, 255** (or **#FFFFFF**).

## How to get true white from an iPhone photo

1. **Shoot on a plain, light background with soft light** — it makes the next step cleaner.
2. **Remove the background** (see [3 ways to do it on iPhone](/blog/remove-background-product-photos-iphone)).
3. **Place the product on a #FFFFFF canvas**, centred, filling about 85% of the frame for Amazon.
4. **Export as JPEG** at the marketplace size — e.g. 2000 × 2000 px.

A soft shadow under the product is generally fine as long as the background itself stays pure white.

[photoZseo](/download) does steps 2–4 in one go: it removes the background on the device, places the product on pure white and exports the Amazon, Walmart and other marketplace versions with SEO file names.
