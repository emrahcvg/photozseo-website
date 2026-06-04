/**
 * image-proxy.ts — SEO-friendly image URLs for store product images.
 *
 * Problem: product photos live on Google Drive, served as opaque file-ID URLs
 * (lh3.googleusercontent.com/d/<id>) that carry NO descriptive filename — so the
 * app's SEO renaming is invisible to Google Image Search.
 *
 * Fix: rewrite each image to a descriptive same-origin path
 *   /store/<slug>/img/<pslug>-<n>        (n is 1-based)
 * A Pages Function resolves that path back to the original Drive URL (via the
 * manifest) and proxies the bytes with long edge caching.
 *
 * These are pure helpers (no I/O) so they're unit-testable on both sides:
 * the renderer builds the paths; the image route parses them.
 */

/** True when a URL points off-site (Drive/CDN) and is worth proxying. */
export function isExternalImage(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Build the SEO image path for product image `index` (0-based) → 1-based in URL. */
export function seoImagePath(storeSlug: string, pslug: string, index: number): string {
  return `/store/${encodeURIComponent(storeSlug)}/img/${encodeURIComponent(pslug)}-${index + 1}`;
}

/**
 * Parse an image filename `<pslug>-<n>` back into the product slug and 0-based
 * index. Returns null when the shape doesn't match (n must be a positive int).
 */
export function parseImageFilename(filename: string): { pslug: string; index: number } | null {
  const m = /^(.+)-(\d+)$/.exec(decodeURIComponent(filename));
  if (!m) return null;
  const n = parseInt(m[2], 10);
  if (!Number.isInteger(n) || n < 1) return null;
  return { pslug: m[1], index: n - 1 };
}

/**
 * Rewrite a product's image list to absolute SEO proxy URLs. External (Drive)
 * URLs are proxied; anything already same-origin/relative is left untouched.
 * Absolute output (origin + path) so it's valid in <img>, JSON-LD and og:image.
 */
export function toProxyImages(
  origin: string,
  storeSlug: string,
  pslug: string,
  images: string[],
): string[] {
  return images.map((url, i) =>
    isExternalImage(url) ? origin + seoImagePath(storeSlug, pslug, i) : url,
  );
}
