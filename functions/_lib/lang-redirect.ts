/** /de/pl/features/x → /pl/features/x/ (eski hatalı çift dil önekli adresler; Ekim 2026'da 404 olarak dizinlendi). */
const LANGS = 'tr|de|es|fr|it|pt|pl|ja|ko|zh|ar|hi|fa|ur';
const RE = new RegExp(`^/(?:en|${LANGS})/(en|${LANGS})(/.*)?$`);

export function doubleLangRedirect(pathname: string): string | null {
  const m = pathname.match(RE);
  if (!m) return null;
  const lang = m[1];
  let rest = m[2] ?? '/';
  if (!rest.endsWith('/') && !/\.[a-z0-9]+$/i.test(rest)) rest += '/';
  return lang === 'en' ? rest : `/${lang}${rest}`;
}
