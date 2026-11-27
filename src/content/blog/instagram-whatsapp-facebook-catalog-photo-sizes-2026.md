---
title: "Instagram, WhatsApp and Facebook catalog photo sizes (2026 guide)"
description: "Instagram Shops, Facebook Shops and WhatsApp catalog photo sizes: square ratio, 500 px minimum, 8 MB limit, cropping rules and which ratio is safe."
pubDate: 2026-11-27
readingMinutes: 5
tags: [instagram-shop, facebook-shop, whatsapp-catalog, product-photos]
tldr:
  - "Instagram Shops and Facebook Shops show catalog images as 1:1 squares: at least 500 x 500 px, 1024 x 1024 px recommended, JPEG or PNG, 8 MB maximum."
  - "WhatsApp catalogs need at least one image per item (up to 10 in the Business app), and Meta does not publish a WhatsApp-specific pixel size; a square image that meets the Meta spec is the safe choice."
  - "Use 1:1 for the catalog and keep any 4:5 or 9:16 versions for ads, because Meta may crop or pad images per placement."
faqs:
  - q: "What size should Instagram Shop product images be?"
    a: "Meta says Shops on Instagram display product images in a 1:1 square format, with a minimum of 500 x 500 pixels and 1024 x 1024 pixels recommended. Files must be JPEG or PNG and no larger than 8 MB."
  - q: "What is the WhatsApp catalog image size?"
    a: "WhatsApp's Help Center requires at least one image per catalog item and allows up to 10 images when adding a product in the Business app, but it does not state pixel dimensions. Use a square image that meets Meta's catalog spec (500 x 500 px minimum, JPEG or PNG, under 8 MB)."
  - q: "What is the best product photo size for a Facebook Shop?"
    a: "Use a 1:1 square of 1024 x 1024 pixels or larger. Meta states that Shops on Facebook display images as squares and do not crop them."
  - q: "Does Instagram crop my catalog product images?"
    a: "Only on the product page. Meta says the crop setting applies to ads and to the Instagram product page, and that images are not cropped elsewhere in Shops on Instagram."
  - q: "Can I use one image for Instagram, Facebook and WhatsApp?"
    a: "Yes, for the catalog. Instagram and Facebook Shops draw from your Meta catalog, and a square JPEG of 1024 x 1024 px or larger on a clean background meets Meta's published specification."
---

**The short answer:** use a square (1:1) JPEG of at least 1024 x 1024 pixels, under 8 MB, showing the whole product on a clean background. Meta's own help article says Shops on Facebook and Instagram display product images as squares, with 500 x 500 pixels as the minimum. WhatsApp catalogs publish no separate pixel spec, so the same square image is the safe choice there too.

*Last verified: November 2026. Sources: Meta Business Help Center ("Product image specifications for catalogues"); Meta for Developers ("Catalog fields" and "Advantage+ catalog ads multi-ratio images"); WhatsApp Help Center ("About catalog", "How to create and maintain a catalog").*

## Catalog photo specs at a glance

| Spec | Instagram Shops | Facebook Shops | WhatsApp catalog |
|---|---|---|---|
| Display ratio | 1:1 square | 1:1 square | No ratio published |
| Minimum size | 500 x 500 px | 500 x 500 px | No pixel size published |
| Recommended size | 1024 x 1024 px | 1024 x 1024 px | Follow Meta's catalog spec |
| Formats | JPEG, PNG | JPEG, PNG | Not published; use JPEG or PNG |
| Maximum file size | 8 MB | 8 MB | Not published; Meta's catalog limit is 8 MB |
| Images per product | At least 1; Meta recommends 4+ | At least 1; Meta recommends 4+ | At least 1; up to 10 in the Business app |
| Cropping | Only on the product page (setting); otherwise not cropped | Not cropped | Not published |

Instagram and Facebook Shops draw from the same Meta catalog, which is why their numbers match. For the full feed-level comparison with Google, see our guide to [product data feed image requirements](/blog/product-data-feed-image-requirements-google-meta-2026).

## Which aspect ratio is safe on each platform?

**1:1 is the safe default.** It is what Shops display, it is the ratio Meta names for carousel consistency, and it is the one that never needs padding. Meta's advice for carousel ads is to supply all images in the same ratio, either 1:1 or 4:5, to prevent automatic adjustments.

**4:5 and 9:16 are for ads, not the catalog.** Meta's developer documentation describes 9:16 images shown full screen on Stories and Reels and 4:5 images used where a placement supports them. If a 9:16 image is shorter than the placement, the rest is filled with the image background color. For 9:16 images, keep the product away from the edges because the profile icon or call-to-action button can cover part of the frame.

## How does Meta crop catalog images?

In Commerce Manager under Settings and Catalogue you choose one of three modes:

- **Fill frame with image** (default): zooms in to fill the frame.
- **Show entire image in frame:** nothing is cut off, but white space may be added.
- **Crop and resize image to fit frame:** fits the whole product in the frame; works best on white or transparent backgrounds.

Meta states these apply to carousel and collection ads, single image ads, and the Instagram product page. Shops on Facebook are not cropped at all. Practical rule: leave a margin around the product so the default zoom-in does not clip it.

## What about WhatsApp catalogs?

WhatsApp's Help Center says every catalog item needs a unique title, at least one image showing the product, and a country of origin. You can add up to 10 images when creating a product in the Business app. Every uploaded image is reviewed against the WhatsApp Business Messaging Policy, and pending or rejected items are hidden from customers. If a save fails, the Help Center suggests reducing file sizes.

We could not find an official WhatsApp page that lists pixel dimensions or aspect ratio, so this guide does not give one. Many third-party blogs quote figures that disagree with each other. Use a square image that meets Meta's catalog spec and check WhatsApp's current guidelines if you need more.

## What does Meta say to avoid?

- Text that overlays the product, calls to action, promo codes, watermarks, or time-sensitive information such as temporary price drops.
- Placeholder images such as "image coming soon".
- Images that do not accurately represent the exact product for sale.
- Reusing a file name when replacing an image via a data feed: the new image needs a different URL or Meta will not refresh it.

Meta recommends a white backdrop, JPEG over PNG for image quality, and the same images that appear on your website. If you also sell through short video, the [TikTok Shop photo sizes guide](/blog/tiktok-shop-photo-sizes) covers its separate vertical-image rules.

## A simple workflow for all three

1. Shoot or export one square master at 1024 x 1024 px or larger (1500 x 1500 px also works for Google feeds).
2. Keep the whole product visible with a margin, on a clean background.
3. Save as JPEG under 8 MB.
4. Add 3 or more angle and detail shots; Meta recommends four or more per product.
5. Make separate 4:5 or 9:16 versions for ads only.

## Where photoZseo fits

[photoZseo](/download) for iPhone and iPad can resize, compress and rename one photo set for 46 marketplaces, and the [Chrome extension](/chrome-extension) collects product-page photos and exports platform-sized versions in bulk. Per-marketplace sizes are listed in our [marketplace image size guide](/marketplace-image-sizes).

*photoZseo is not affiliated with or endorsed by any marketplace, Meta, Instagram, Facebook or WhatsApp. Check each platform's current guidelines before uploading.*
