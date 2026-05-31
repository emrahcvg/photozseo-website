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
  run(model: string, inputs: Record<string, unknown>): Promise<{ response?: string; translated_text?: string }>;
}

// Instruct LLM — m2m100-1.2b'den çok daha iyi/tam çeviri (özellikle uzun teknik metin).
const MODEL = '@cf/meta/llama-3.1-8b-instruct';
const STRING_TTL = 60 * 60 * 24 * 30; // 30 gün
const MANIFEST_TTL = 60 * 60 * 24 * 7; // 7 gün (sürüm anahtarı zaten değişince yenilenir)
const MAX_CONCURRENCY = 6;
const CACHE_VERSION = 'v2'; // model değişti → eski m2m100 cache'ini geçersiz kıl

/** Prompt için dil adları (LLM İngilizce dil adıyla daha iyi sonuç verir). */
const LANG_NAMES: Record<string, string> = {
  en: 'English', tr: 'Turkish', de: 'German', es: 'Spanish', pt: 'Portuguese',
  ja: 'Japanese', ko: 'Korean', zh: 'Chinese (Simplified)', ar: 'Arabic',
  fa: 'Persian', ur: 'Urdu', hi: 'Hindi',
};

/** LLM çıktısını temizle: çevreleyen tırnak/etiket/kod-bloğu kalıntılarını at. */
function cleanLLM(raw: string): string {
  let s = raw.trim();
  s = s.replace(/^```[a-z]*\n?|\n?```$/gi, '').trim();
  // "Translation:" gibi önekleri at
  s = s.replace(/^(translation|çeviri|übersetzung)\s*[:：]\s*/i, '').trim();
  // Çevreleyen tek/çift tırnakları at
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith('“') && s.endsWith('”'))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function manifestKey(slug: string, lang: string, version: number): string {
  return `i18n:${CACHE_VERSION}:${slug}:${lang}:v${version}`;
}

async function sha1(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
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
): Promise<{ map: Map<string, string>; failed: number }> {
  const unique = [...new Set(texts.filter((t) => t && t.trim() !== ''))];
  const out = new Map<string, string>();
  let failed = 0;
  const srcName = LANG_NAMES[sourceLang] ?? sourceLang;
  const tgtName = LANG_NAMES[targetLang] ?? targetLang;
  const system = `You are a professional e-commerce translator. Translate the user's text from ${srcName} to ${tgtName}. Output ONLY the translation — no quotes, no notes, no explanations. Preserve product names/brands, model codes, numbers, units and emojis as-is. Keep it natural and concise for an online store.`;

  async function callOnce(text: string): Promise<string> {
    const res = await ai.run(MODEL, {
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: text },
      ],
      max_tokens: 1024,
      temperature: 0.2,
    });
    return (res.response ?? res.translated_text ?? '').trim();
  }

  let i = 0;
  async function worker() {
    while (i < unique.length) {
      const text = unique[i++];
      const key = `t:${CACHE_VERSION}:${targetLang}:${await sha1(text)}`;
      const cached = await kv.get(key);
      if (cached !== null) {
        out.set(text, cached);
        continue;
      }
      // 1 retry — Workers AI burst rate-limit'leri için.
      let raw = '';
      for (let attempt = 0; attempt < 2 && raw === ''; attempt++) {
        try {
          raw = await callOnce(text);
        } catch {
          raw = '';
        }
      }
      if (raw === '') {
        out.set(text, text); // başarısız → kaynağı koru, CACHE'LEME (sonraki istek tekrar dener)
        failed++;
        continue;
      }
      const translated = cleanLLM(raw) || text;
      out.set(text, translated);
      await kv.put(key, translated, { expirationTtl: STRING_TTL });
    }
  }

  await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENCY, unique.length) }, worker));
  return { map: out, failed };
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
): Promise<{ manifest: Manifest; complete: boolean }> {
  if (sourceLang === targetLang) return { manifest, complete: true };

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

  if (bag.length === 0) return { manifest, complete: true }; // çevrilecek bir şey yok

  // 2) Çevir
  const { map, failed } = await translateStrings(ai, kv, bag, sourceLang, targetLang);

  // 3) Yeni manifest kopyasına doldur
  const out: Manifest = {
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
  return { manifest: out, complete: failed === 0 };
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
    const { manifest: translated, complete } = await translateManifest(ai, kv, manifest, sourceLang, targetLang);
    // Yalnızca EKSİKSİZ çeviriyi cache'le; kısmi sonuç servis edilir ama cache'lenmez
    // → sonraki istek başarısız string'leri (per-string cache'te olmayanları) tekrar dener.
    if (complete) {
      await kv.put(key, JSON.stringify(translated), { expirationTtl: MANIFEST_TTL });
    }
    return translated;
  } catch {
    return manifest;
  }
}
