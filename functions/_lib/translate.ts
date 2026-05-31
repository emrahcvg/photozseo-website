/**
 * translate.ts — On-demand storefront çevirisi (Cloudflare Workers AI, m2m100).
 *
 * Akış: ziyaretçi /store/<slug>/<lang> isteyince, manifest o dilde değilse bu modül
 * çevrilmiş bir manifest kopyası üretir. İki kademeli cache:
 *   1) Tam manifest:  KV `i18n:<slug>:<lang>:v<version>`  → tekrar ziyaretlerde 1 KV okuma.
 *   2) Tek string:    KV `t:<lang>:<sha1(metin)>`         → diller/sürümler arası yeniden kullanım.
 *
 * App tek dilde yayınlar (basit kalır); çeviri tamamen edge'de olur, harici key yok.
 */

import type { Manifest, Localized } from '../../src/storefront/types';

// Workers AI binding (minimal tip).
export interface AiBinding {
  run(model: string, inputs: Record<string, unknown>): Promise<{ translated_text?: string }>;
}

const MODEL = '@cf/meta/m2m100-1.2b';
const STRING_TTL = 60 * 60 * 24 * 30; // 30 gün
const MANIFEST_TTL = 60 * 60 * 24 * 7; // 7 gün (sürüm anahtarı zaten değişince yenilenir)
const MAX_CONCURRENCY = 8;

function manifestKey(slug: string, lang: string, version: number): string {
  return `i18n:${slug}:${lang}:v${version}`;
}

async function sha1(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** m2m100 dil kodu eşlemesi (çoğu birebir). */
function m2mLang(locale: string): string {
  return locale; // en, tr, de, es, pt, ja, ko, zh, ar, fa, ur, hi — m2m100 ile uyumlu
}

/**
 * Bir grup benzersiz kaynak metni hedef dile çevirir (per-string KV cache + sınırlı eşzamanlılık).
 * Dönen Map: kaynakMetin → çeviri.
 */
async function translateStrings(
  ai: AiBinding,
  kv: KVNamespace,
  texts: string[],
  sourceLang: string,
  targetLang: string,
): Promise<Map<string, string>> {
  const unique = [...new Set(texts.filter((t) => t && t.trim() !== ''))];
  const out = new Map<string, string>();

  let i = 0;
  async function worker() {
    while (i < unique.length) {
      const text = unique[i++];
      try {
        const key = `t:${targetLang}:${await sha1(text)}`;
        const cached = await kv.get(key);
        if (cached !== null) {
          out.set(text, cached);
          continue;
        }
        const res = await ai.run(MODEL, {
          text,
          source_lang: m2mLang(sourceLang),
          target_lang: m2mLang(targetLang),
        });
        const translated = (res.translated_text ?? '').trim() || text;
        out.set(text, translated);
        // Hata olsa bile orijinali cache'leme; sadece gerçek çeviriyi sakla.
        if (res.translated_text) {
          await kv.put(key, translated, { expirationTtl: STRING_TTL });
        }
      } catch {
        out.set(text, text); // başarısızlıkta kaynağı koru (graceful)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENCY, unique.length) }, worker));
  return out;
}

/** Bir Localized alanın hedef dildeki kaynak metnini toplar (zaten çeviri varsa atlar). */
function collect(field: Localized | undefined, sourceLang: string, targetLang: string, bag: string[]): void {
  if (!field) return;
  if (field[targetLang] && field[targetLang].trim() !== '') return; // zaten çevrili
  const src = field[sourceLang] ?? Object.values(field)[0];
  if (src && src.trim() !== '') bag.push(src);
}

/** Bir Localized alana hedef dili map'ten doldurur (kaynak + map). */
function fill(field: Localized | undefined, sourceLang: string, targetLang: string, map: Map<string, string>): Localized | undefined {
  if (!field) return field;
  if (field[targetLang] && field[targetLang].trim() !== '') return field;
  const src = field[sourceLang] ?? Object.values(field)[0];
  if (!src || src.trim() === '') return field;
  const t = map.get(src);
  if (!t) return field;
  return { ...field, [targetLang]: t };
}

/**
 * Manifest'i hedef dile çevirir. Çevrilen alanlar: tagline, kategori adları, ürün
 * başlık + açıklama, açıklayıcı attribute'lar (renk/beden/malzeme/cinsiyet/yaş grubu).
 * displayName (marka) ve SKU/barkod/menşei/tag çevrilmez.
 */
export async function translateManifest(
  ai: AiBinding,
  kv: KVNamespace,
  manifest: Manifest,
  sourceLang: string,
  targetLang: string,
): Promise<Manifest> {
  if (sourceLang === targetLang) return manifest;

  // 1) Tüm kaynak metinleri topla
  const bag: string[] = [];
  collect(manifest.store.tagline, sourceLang, targetLang, bag);
  for (const c of manifest.categories) collect(c.name, sourceLang, targetLang, bag);
  for (const p of manifest.products) {
    collect(p.title, sourceLang, targetLang, bag);
    collect(p.description, sourceLang, targetLang, bag);
    const a = p.attributes;
    if (a) {
      collect(a.color, sourceLang, targetLang, bag);
      collect(a.size, sourceLang, targetLang, bag);
      collect(a.material, sourceLang, targetLang, bag);
      collect(a.gender, sourceLang, targetLang, bag);
      collect(a.ageGroup, sourceLang, targetLang, bag);
    }
  }

  if (bag.length === 0) return manifest; // çevrilecek bir şey yok

  // 2) Çevir
  const map = await translateStrings(ai, kv, bag, sourceLang, targetLang);

  // 3) Yeni manifest kopyasına doldur
  return {
    ...manifest,
    store: {
      ...manifest.store,
      tagline: fill(manifest.store.tagline, sourceLang, targetLang, map),
    },
    categories: manifest.categories.map((c) => ({ ...c, name: fill(c.name, sourceLang, targetLang, map) ?? c.name })),
    products: manifest.products.map((p) => ({
      ...p,
      title: fill(p.title, sourceLang, targetLang, map) ?? p.title,
      description: fill(p.description, sourceLang, targetLang, map),
      attributes: p.attributes
        ? {
            ...p.attributes,
            color: fill(p.attributes.color, sourceLang, targetLang, map),
            size: fill(p.attributes.size, sourceLang, targetLang, map),
            material: fill(p.attributes.material, sourceLang, targetLang, map),
            gender: fill(p.attributes.gender, sourceLang, targetLang, map),
            ageGroup: fill(p.attributes.ageGroup, sourceLang, targetLang, map),
          }
        : p.attributes,
    })),
  };
}

/**
 * Hedef dildeki manifest'i döndürür. Önce tam-manifest KV cache'ine bakar; yoksa çevirir,
 * cache'ler ve döndürür. AI binding yoksa veya hata olursa kaynak manifest'e düşer (graceful).
 */
export async function getTranslatedManifest(
  ai: AiBinding | undefined,
  kv: KVNamespace,
  slug: string,
  manifest: Manifest,
  sourceLang: string,
  targetLang: string,
): Promise<Manifest> {
  if (sourceLang === targetLang) return manifest;

  const key = manifestKey(slug, targetLang, manifest.meta.version);
  const cached = await kv.get(key);
  if (cached) {
    try {
      return JSON.parse(cached) as Manifest;
    } catch {
      /* bozuk cache → yeniden çevir */
    }
  }

  if (!ai) return manifest; // AI binding yok (örn. lokal dev) → kaynak dil

  try {
    const translated = await translateManifest(ai, kv, manifest, sourceLang, targetLang);
    await kv.put(key, JSON.stringify(translated), { expirationTtl: MANIFEST_TTL });
    return translated;
  } catch {
    return manifest;
  }
}
