import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';

export async function blogEntries() {
  const en = await getCollection('blog');
  const i18n = await getCollection('blogI18n');
  const items = [
    ...en.map((p) => ({ lang: 'en' as Lang, slug: p.id, entry: p })),
    ...i18n.map((p) => {
      const [lang, ...rest] = p.id.split('/');
      return { lang: lang as Lang, slug: rest.join('/'), entry: p };
    }),
  ];
  const langsBySlug = new Map<string, Lang[]>();
  for (const it of items) langsBySlug.set(it.slug, [...(langsBySlug.get(it.slug) ?? []), it.lang]);
  return { items, langsBySlug };
}
