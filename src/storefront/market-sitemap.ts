/**
 * market-sitemap.ts — Ürün-barındıran L1 kategori URL'leri (saf, svc inject).
 * Kilitli karar D4=B: yalnız ürünlü üst-seviye (L1) kategoriler sitemap'e girer.
 * Çözülemeyen id'ler atlanır (thin-content/crawl israfı önlenir).
 */
import type { TaxonomyService } from './taxonomy/service';

/** distinct category_id listesini → benzersiz L1 /market/c/<id> URL dizisine indir. */
export function productBearingL1Urls(
  categoryIds: string[],
  svc: TaxonomyService,
  origin: string,
): string[] {
  const l1 = new Set<string>();
  for (const id of categoryIds) {
    if (!id) continue;
    if (!svc.node(id)) continue; // çözülemeyen → atla
    const ancestors = svc.ancestors(id);
    const rootId = ancestors.length ? ancestors[0].id : id; // depth-0 ata, yoksa kendisi
    l1.add(rootId);
  }
  return [...l1].map((id) => `${origin}/market/c/${encodeURIComponent(id)}`);
}
