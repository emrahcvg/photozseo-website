/**
 * product-safety.ts — GPSR (AB 2023/988 md. 19) ürün güvenliği bloğu.
 * Mağaza ürün sayfası (render.ts) ve pazar yeri ürün sayfası (marketplace.ts) aynı bloğu kullanır.
 * Satıcı alan girmediyse blok hiç basılmaz (boş başlık yok).
 */
import { escapeHtml } from './render';
import { mt } from './marketplace-i18n';
import { resolveLocalized } from './manifest';
import type { Localized } from './types';

/** Dile çözülmüş, düz metin güvenlik bilgisi (D1 safety_json ile aynı şekil). */
export interface ResolvedSafety {
  manufacturerName?: string;
  manufacturerAddress?: string;
  manufacturerContact?: string;
  euResponsibleName?: string;
  euResponsibleAddress?: string;
  euResponsibleContact?: string;
  /** SKU / barkod (GTIN) gibi ürün kimlikleri. */
  identifiers?: string[];
  /** Düz metin ya da dil haritası ({ tr: '…', en: '…' }) — render ziyaretçi dilini seçer. */
  warnings?: string | Localized;
}

const MAX = 500;
const clean = (v: unknown): string => (typeof v === 'string' ? v.trim().slice(0, MAX) : '');

/** D1 safety_json'ı güvenle çöz; bozuk/boş → null. */
export function parseSafetyJson(raw: string | null | undefined): ResolvedSafety | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? (v as ResolvedSafety) : null;
  } catch {
    return null;
  }
}

function party(name: unknown, address: unknown, contact: unknown): string {
  const parts = [clean(name), clean(address), clean(contact)].filter(Boolean);
  return parts.map(escapeHtml).join('<br>');
}

export function renderSafetyBlock(s: ResolvedSafety | null | undefined, locale: string, cls = 'pz-safety'): string {
  if (!s) return '';
  const rows: [string, string][] = [];
  const manufacturer = party(s.manufacturerName, s.manufacturerAddress, s.manufacturerContact);
  if (manufacturer) rows.push([mt(locale, 'safetyManufacturer'), manufacturer]);
  const eu = party(s.euResponsibleName, s.euResponsibleAddress, s.euResponsibleContact);
  if (eu) rows.push([mt(locale, 'safetyEuResponsible'), eu]);
  const ids = (s.identifiers ?? []).map(clean).filter(Boolean);
  if (ids.length) rows.push([mt(locale, 'safetyProductId'), ids.map(escapeHtml).join(' · ')]);
  const warnings = clean(typeof s.warnings === 'string' ? s.warnings : s.warnings ? resolveLocalized(s.warnings, locale) : '');
  if (warnings) rows.push([mt(locale, 'safetyWarnings'), escapeHtml(warnings)]);
  if (rows.length === 0) return '';
  let html = `<section class="${cls}" aria-label="${escapeHtml(mt(locale, 'safetyHeading'))}">\n`;
  html += `  <h2 class="${cls}__heading">${escapeHtml(mt(locale, 'safetyHeading'))}</h2>\n`;
  html += `  <dl class="${cls}__list">\n`;
  for (const [k, v] of rows) html += `    <div><dt>${escapeHtml(k)}</dt><dd>${v}</dd></div>\n`;
  html += '  </dl>\n</section>\n';
  return html;
}
