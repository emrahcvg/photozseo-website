// Website dili → denenecek Google taksonomi locale'i (null = doğrudan çeviri).
// fetch 404 verirse orchestrator o dili çeviriye düşürür (belirsiz locale'ler için).
export const GOOGLE_LOCALE: Record<string, string | null> = {
  en: 'en-US',
  tr: 'tr-TR',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ar: null,
  fa: null,
  hi: null,
  ur: null,
};

// Website dili → translation-swarm/translator.py LANG kodu (çeviri gerektiğinde).
export const TRANSLATOR_CODE: Record<string, string> = {
  tr: 'tr',
  de: 'de',
  es: 'es',
  pt: 'pt-BR',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-Hans',
  ar: 'ar',
  fa: 'fa',
  hi: 'hi',
  ur: 'ur',
};

export const ALL_LANGS = Object.keys(GOOGLE_LOCALE);
export const TAXONOMY_URL = (locale: string) =>
  `https://www.google.com/basepages/producttype/taxonomy-with-ids.${locale}.txt`;
