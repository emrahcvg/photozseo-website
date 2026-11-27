---
title: "How to list products on multiple marketplaces at once (2026 workflow)"
description: "A step-by-step multichannel workflow: one master product record, one source photo set, then per-marketplace resizing, titles and checks for Amazon, eBay and Etsy."
pubDate: 2026-11-27
readingMinutes: 7
tags: [multichannel, marketplaces, product-photos, listing, workflow]
tldr:
  - "Build one master record (data plus a high-resolution photo set) once, then derive each marketplace's version from it instead of starting every listing from scratch."
  - "Photos and titles are the parts that must change per channel; identifiers, specs and pricing logic should stay in the master record."
  - "Check each channel's current official guidelines before upload. eBay and Etsy publish clear size guidance; for Amazon, read the live Seller Central rules for your category."
faqs:
  - q: "Can I list the same product on Amazon, eBay and Etsy?"
    a: "Yes, as long as the product is allowed in each marketplace's rules and you follow each channel's own listing and image policies. Etsy in particular limits what can be sold under its Creativity Standards, so check eligibility first."
  - q: "Do I need a different photo for every marketplace?"
    a: "Not a different shoot, but usually a different export. Shoot once at high resolution, then crop, resize and set the background per channel, and keep at least one unedited photo of the real item where a marketplace asks for it (Etsy does)."
  - q: "What size should my master photos be?"
    a: "Larger than any channel needs. Etsy recommends listing photos of at least 2000 pixels in width and height and eBay recommends about 1600 x 1600, so a master of 2000 pixels or more on each side lets you downscale cleanly."
  - q: "Should titles be identical on every marketplace?"
    a: "No. Keep the facts identical, but adapt wording and length to each channel's title rules and how shoppers search there. Read each platform's current title guidelines before you copy a title across."
  - q: "Is a multichannel listing tool required?"
    a: "No. A spreadsheet and a disciplined folder structure can work for a small catalog. Dedicated tools help once you are managing inventory sync across many SKUs and channels."
---

To list products on multiple marketplaces at once, create one master record per product (identifiers, specs, dimensions, a base description and a high-resolution photo set), then generate each marketplace's version from it: resize and re-background the photos to that channel's rules, rewrite the title for that channel, upload, and run a short pre-publish check. Doing the work in that order is what keeps multichannel selling from turning into three separate full-time jobs.

*Last verified: November 2026. Sources are named in each section; marketplace rules change, so confirm against the live pages before you upload.*

## Step 1: Build a master product record

Before you open any marketplace, keep one row or file per product holding the facts that never change by channel:

- Internal SKU and, where you have them, barcodes (GTIN/UPC/EAN)
- Brand, model, material, color, dimensions, weight
- A neutral, factual description and a feature list
- Country of origin, compliance notes and any required warnings
- The folder path of the master photo set

Each marketplace then borrows from this record. When a spec changes, you fix it once. This also protects you from one of the common causes of rejection: attributes that disagree between channels or between title and photo.

## Step 2: Shoot one master photo set

Shoot once, at the highest practical resolution, and keep the originals untouched. A useful set is:

1. A clean front view on a plain background
2. Two or three angles and a detail shot
3. A scale or in-use shot
4. A packaging or label shot where relevant

Shooting large matters because marketplaces recommend different sizes. Etsy's "Requirements and Best Practices for Images in Your Etsy Shop" recommends listing photos at least 2000 pixels in width and height, and eBay's listing help recommends about 1600 x 1600. A master of 2000 pixels or more per side lets you scale down for every channel without upscaling anything.

## Step 3: Adapt photos per marketplace

This is where most of the per-channel effort goes. The table below lists only figures confirmed on the marketplaces' own help pages in November 2026.

| Marketplace | Confirmed guidance | Source |
|---|---|---|
| eBay | Minimum 500 x 500 px; recommended about 1600 x 1600; up to 24 photos per listing; max 12 MB per photo; plain white background suggested as a safe choice | eBay Seller Center "Take great photos"; eBay help "Adding pictures to your listings" |
| eBay (prohibited) | No added borders, no added text/artwork/marketing material, no watermarks of any type | eBay Picture policy |
| Etsy | Recommended at least 2000 px wide and tall; first photo at least 635 px; files over 1 MB may not finish uploading on slow connections; sRGB; .jpg, .gif, .png, .svg or .heic; no animated GIF or transparent PNG | Etsy Help, "Requirements and Best Practices for Images in Your Etsy Shop" |
| Etsy (authenticity) | At least one unedited photo of the actual item against a real background | Etsy Help, same article |
| Amazon | Main images are automatically checked for non-white backgrounds and for text, logos, graphics or watermarks; images that fail can lead to suppression. Pixel and fill-percentage rules vary by category, so read the live image guidelines for yours | Amazon Seller Central announcement on main image checks |

Notice what is not in the table: a single "universal size." Amazon, eBay and Etsy do not agree, which is why a one-size export fails somewhere. Our [marketplace image sizes reference](/marketplace-image-sizes) collects the per-channel numbers, and the [multi-marketplace resizing guide](/blog/resize-product-photos-multiple-marketplaces) covers the batch-export mechanics.

A practical rule: make a white-background version for channels that favor it, and keep a lifestyle or in-context version for channels where shoppers expect it. Do not put watermarks, borders or promotional text on any version. Both eBay and Amazon flag them.

## Step 4: Rewrite titles per channel

Keep the facts constant and change the wording. Each platform has its own title rules, character limits and conventions, and they differ. Do not assume a title that is accepted on one channel is valid on another. Read the current title guidelines for each category you list in.

Reasonable defaults that hold across channels:

- Lead with the product type and the distinguishing attribute shoppers search for
- Put brand and model where the platform expects them
- Avoid promotional phrases and excess symbols; sellers commonly report them as triggers for rejection, so check each platform's title policy
- Use consistent attribute values (size, color) in the title, photo and structured fields

For file names and alt text, see [how to name product photos for SEO](/blog/how-to-name-product-photos-for-seo).

## Step 5: Upload, then run a pre-publish check

Upload one marketplace at a time, starting with the strictest for your category. Then check:

| Check | Why it matters |
|---|---|
| Photo meets that channel's minimum size and format | Prevents upload errors and soft thumbnails |
| No watermark, border or promo text added | Prohibited or flagged on eBay and Amazon |
| Background matches the channel's expectation | Non-white main images are auto-checked on Amazon |
| Title, photo and attributes agree (color, size, quantity) | Mismatch is a common cause of rejection |
| Identifiers and category correct | Wrong category leaves required attributes unmatched |
| At least one unedited real-item photo (Etsy) | Required by Etsy's image guidance |

If a listing is suppressed afterward, our companion post on [listing mistakes that get products suppressed](/blog/listing-mistakes-that-get-products-suppressed-2026) walks through the usual causes.

## Common mistakes in multichannel listing

- **Reusing one export everywhere.** A 1 MB-friendly Etsy file and a 1600 px eBay file are different exports of the same master.
- **Editing the original.** Always export copies; never overwrite the master.
- **Copying titles verbatim.** Rules and search behavior differ per platform.
- **Letting data drift.** If price, stock or specs live in three places, they will diverge. Keep them in the master record.
- **Ignoring eligibility.** Some channels restrict what can be sold; Etsy's Creativity Standards, for example, remove listings that don't qualify.

## Where photoZseo fits

If your source photos come from a phone, photoZseo for iOS and iPadOS 17+ can resize, compress and rename a photo set for 46 marketplaces, remove backgrounds on-device and export CSV, XLSX or JSON. If you gather photos and details from existing product pages on a computer, the [Chrome extension](/chrome-extension) works from the browser side panel. See [pricing](/pricing) for plans. Either way, the workflow above is the same: one master, many exports.

photoZseo is not affiliated with or endorsed by any marketplace. Marketplace names are used only to describe compatibility.
