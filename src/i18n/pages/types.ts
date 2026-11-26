import type { Lang } from '../ui';

// Bilgi sayfaları (download, pricing, about, rehberler, özellikler) için ortak içerik şeması.
// Metinlerde **kalın** ve [bağlantı](url) desteklenir; HTML kaçışlanır.

export interface PageTable {
  caption?: string;
  head: string[];
  rows: string[][];
}

export interface PageSection {
  id: string;
  h2: string;
  body?: string[];
  bullets?: string[];
  steps?: { t: string; d: string }[];
  table?: PageTable;
  note?: string;
}

export interface PageDoc {
  title: string;
  desc: string;
  crumb: string;
  kicker: string;
  h1: string;
  answer: string;
  facts?: { k: string; v: string }[];
  sections: PageSection[];
  faq?: { q: string; a: string }[];
  faqTitle?: string;
  sources?: { label: string; url: string }[];
  sourcesTitle?: string;
  related?: { label: string; href: string }[];
  relatedTitle?: string;
  cta?: { h: string; p: string; btn: string };
  updatedLabel: string;
}

export type PageSet = Partial<Record<Lang, PageDoc>> & { en: PageDoc };

export const pageLangs = (set: PageSet): Lang[] => Object.keys(set) as Lang[];
