import type { Lang } from './ui';

// Üst menü "Rehberler" etiketi ve alt menü sütun başlıkları.
export interface FooterUi { guides: string; product: string; resources: string; company: string; legal: string }

export const FOOTER_UI: Record<Lang, FooterUi> = {
  en: { guides: 'Guides', product: 'Product', resources: 'Resources', company: 'Company', legal: 'Legal' },
  tr: { guides: 'Rehberler', product: 'Ürün', resources: 'Kaynaklar', company: 'Şirket', legal: 'Yasal' },
  de: { guides: 'Ratgeber', product: 'Produkt', resources: 'Ressourcen', company: 'Unternehmen', legal: 'Rechtliches' },
  es: { guides: 'Guías', product: 'Producto', resources: 'Recursos', company: 'Empresa', legal: 'Legal' },
  fr: { guides: 'Guides', product: 'Produit', resources: 'Ressources', company: 'Entreprise', legal: 'Mentions légales' },
  it: { guides: 'Guide', product: 'Prodotto', resources: 'Risorse', company: 'Azienda', legal: 'Note legali' },
  pt: { guides: 'Guias', product: 'Produto', resources: 'Recursos', company: 'Empresa', legal: 'Legal' },
  pl: { guides: 'Poradniki', product: 'Produkt', resources: 'Zasoby', company: 'Firma', legal: 'Informacje prawne' },
  ja: { guides: 'ガイド', product: '製品', resources: 'リソース', company: '会社情報', legal: '法的情報' },
  ko: { guides: '가이드', product: '제품', resources: '자료', company: '회사', legal: '법적 고지' },
  zh: { guides: '指南', product: '产品', resources: '资源', company: '公司', legal: '法律信息' },
  ar: { guides: 'الأدلة', product: 'المنتج', resources: 'الموارد', company: 'الشركة', legal: 'قانوني' },
  hi: { guides: 'गाइड', product: 'प्रोडक्ट', resources: 'संसाधन', company: 'कंपनी', legal: 'कानूनी' },
  fa: { guides: 'راهنماها', product: 'محصول', resources: 'منابع', company: 'شرکت', legal: 'حقوقی' },
  ur: { guides: 'رہنما', product: 'پروڈکٹ', resources: 'وسائل', company: 'کمپنی', legal: 'قانونی' },
};
