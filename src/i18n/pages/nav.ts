import type { Lang } from '../ui';

// Yeni bilgi sayfalarının alt bilgi bağlantıları. Bir dil burada yoksa İngilizce bağlantılar kullanılır.
interface NavExtra {
  has: { pricing: boolean };
  links: { label: string; href: string }[];
}

const BASE: Partial<Record<Lang, NavExtra>> & { en: NavExtra } = {
  en: {
    has: { pricing: true },
    links: [
      { label: 'iPhone & iPad app', href: '/download' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Marketplace image sizes', href: '/marketplace-image-sizes' },
      { label: 'Alternatives', href: '/alternatives' },
      { label: 'About', href: '/about' },
    ],
  },
  tr: {
    has: { pricing: true },
    links: [
      { label: 'iPhone ve iPad uygulaması', href: '/tr/download' },
      { label: 'Fiyatlar', href: '/tr/pricing' },
      { label: 'Pazaryeri görsel ölçüleri', href: '/tr/marketplace-image-sizes' },
      { label: 'Alternatifler', href: '/tr/alternatives' },
      { label: 'Hakkında', href: '/tr/about' },
    ],
  },
};

const generated = import.meta.glob<{ default: NavExtra }>('./gen/nav.*.json', { eager: true });
export const NAV_EXTRA: Partial<Record<Lang, NavExtra>> & { en: NavExtra } = { ...BASE };
for (const path in generated) {
  const m = path.match(/nav\.([a-z]{2})\.json$/);
  if (m && !NAV_EXTRA[m[1] as Lang]) NAV_EXTRA[m[1] as Lang] = generated[path].default;
}
