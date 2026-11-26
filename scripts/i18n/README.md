# Otomatik çeviri (ücretsiz Google ucu)

İngilizce kaynak → 13 dil (ana sayfa, bilgi sayfaları) ve 14 dil (blog).

1. `cp scripts/i18n/dump.ts ./_dump.ts && npx tsx ./_dump.ts scripts/i18n/en.json; rm ./_dump.ts`
2. `python3 -I scripts/i18n/site.py . [dil ...]` → `src/i18n/locales/<dil>.ts`, `src/i18n/pages/gen/*.json`
3. `python3 -I scripts/i18n/blog.py . [dil ...]` → `src/content/blog-i18n/<dil>/*.md`

Türkçe ana sayfa ve bilgi sayfaları elle yazılır (site.py `tr` üretmez). Önbellek `cache.json` tekrar çalıştırmayı hızlandırır.
