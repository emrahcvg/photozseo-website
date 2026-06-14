/**
 * moderation.ts — Sunucu-tarafı içerik moderasyonu (server-side gate).
 *
 * iOS `StoreModerationKeywords.swift`'in birebir TS portu. İstemci moderasyonu
 * ATLANAMASIN diye yayın PUT'unda sunucuda da çalışır. 10 kategori, çok dilli
 * (TR + EN) yasak-ürün keyword listesi; word-boundary'li (tek kelimeler için)
 * veya substring (boşluklu ifadeler için) tarama yapar.
 *
 * Bu YENİ bir engeldir: yalnızca zaten engellenmesi gereken yasak ürünleri
 * yakalar; meşru mağaza içeriğini etkilemez. Geriye uyumlu.
 */

export type ModerationCategory =
  | 'weapons'
  | 'drugs'
  | 'counterfeit'
  | 'stolen'
  | 'hate'
  | 'wildlife'
  | 'regulated'
  | 'fraud'
  | 'bodyParts'
  | 'adult';

/** StoreModerationKeywords.swift `terms` ile birebir aynı (TR+EN). */
const TERMS: Record<ModerationCategory, string[]> = {
  weapons: ['gun', 'handgun', 'firearm', 'rifle', 'pistol', 'ammunition', 'explosive', 'silah', 'tabanca', 'tüfek', 'mühimmat', 'patlayıcı', 'kurusıkı'],
  drugs: ['cocaine', 'heroin', 'cannabis', 'marijuana', 'mdma', 'lsd', 'kokain', 'eroin', 'esrar', 'uyuşturucu', 'reçeteli ilaç'],
  counterfeit: ['replica', 'counterfeit', 'fake rolex', '1:1', 'taklit', 'sahte marka', 'çakma'],
  stolen: ['stolen', 'çalıntı'],
  hate: ['nazi', 'white power', 'kkk'],
  wildlife: ['elephant ivory', 'ivory tusk', 'rhino horn', 'rhino horns', 'fil dişi', 'gergedan boynuzu'],
  regulated: ['cigarette', 'e-cigarette', 'vape nicotine', 'sigara', 'elektronik sigara', 'nikotin'],
  fraud: ['fake passport', 'forged document', 'stolen credit card', 'sahte pasaport', 'sahte kimlik', 'çalıntı kart'],
  bodyParts: ['human organ', 'kidney for sale', 'insan organı', 'böbrek satılık'],
  adult: ['porn', 'escort', 'sex toy', 'porno', 'yetişkin içerik'],
};

/** Kategori sayısı — testler/raporlama için dışa açık. */
export const MODERATION_CATEGORY_COUNT = Object.keys(TERMS).length;

function isWordChar(ch: string): boolean {
  // Unicode harf veya rakam (TR diakritikleri dahil: \p{L} kapsar).
  return /[\p{L}\p{N}]/u.test(ch);
}

/**
 * `word`'ün `haystack` içinde word-boundary'li geçişi var mı?
 * Swift `hasBoundedOccurrence` ile aynı: önceki/sonraki karakter harf-rakam
 * DEĞİLSE eşleşme geçerli. Diakritikler (ç, ü, ş...) word char sayılır.
 */
function hasBoundedOccurrence(word: string, haystack: string): boolean {
  if (word.length === 0) return false;
  let from = 0;
  for (;;) {
    const idx = haystack.indexOf(word, from);
    if (idx === -1) return false;

    const beforeOk = idx === 0 || !isWordChar(haystack[idx - 1]);
    const afterIdx = idx + word.length;
    const afterOk = afterIdx >= haystack.length || !isWordChar(haystack[afterIdx]);

    if (beforeOk && afterOk) return true;
    from = idx + 1;
  }
}

/** Swift `containsWord`: boşluklu ifade → substring; tek kelime → word-boundary. */
function containsWord(word: string, haystack: string): boolean {
  if (word.includes(' ')) return haystack.includes(word);
  return hasBoundedOccurrence(word, haystack);
}

/** İlk ihlal kategorisi + eşleşen keyword; yoksa null. */
function firstViolation(text: string): { category: ModerationCategory; matched: string } | null {
  const haystack = text.toLowerCase();
  for (const category of Object.keys(TERMS) as ModerationCategory[]) {
    for (const w of TERMS[category]) {
      if (containsWord(w, haystack)) return { category, matched: w };
    }
  }
  return null;
}

export interface ModerationResult {
  ok: boolean;
  category?: ModerationCategory;
  matched?: string;
}

/**
 * Mağaza başlık/açıklama/etiketlerini birleştirip yasak-ürün taraması yapar.
 * Çok dilli alanlar (Localized) çağıran tarafça düzleştirilip string[] olarak
 * geçilebilir; burada hepsi tek bir haystack'te birleştirilir.
 *
 * @returns ok=false ise category + matched dolu.
 */
export function moderateText(
  title: string | string[] | undefined,
  description: string | string[] | undefined,
  tags: string | string[] | undefined,
): ModerationResult {
  const flatten = (v: string | string[] | undefined): string =>
    v == null ? '' : Array.isArray(v) ? v.join(' ') : v;

  const combined = [flatten(title), flatten(description), flatten(tags)]
    .filter((s) => s.length > 0)
    .join(' ');

  if (combined.length === 0) return { ok: true };

  const v = firstViolation(combined);
  if (v) return { ok: false, category: v.category, matched: v.matched };
  return { ok: true };
}
