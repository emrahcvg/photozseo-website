import type { HomeContent } from '../home';

const es: HomeContent = {
  nav: {
    features: 'Funciones', pricing: 'Precios', faq: 'Preguntas',
    blog: 'Blog', support: 'Soporte', getApp: 'Obtener la app',
  },
  hero: {
    eyebrow: 'Ya disponible en iPhone · iPad · Mac',
    h1Line1Words: ['Publica', 'una', 'vez.'],
    h1Line2Words: ['Vende', 'en', '46+', 'marketplaces.'],
    h1A11y: 'Publica una vez. Vende en 46+ marketplaces.',
    sub: 'Fotos de producto con calidad de estudio, SEO escrito por IA, presupuestos B2B y exportaciones perfectas para cada plataforma — todo desde tu iPhone. Sin ordenador. Sin hojas de cálculo. Sin nube.',
    btnAppSmall: 'Descargar en',
    btnAppBig: 'App Store',
    ctaTrial: '3 días gratis',
    ctaCard: 'Sin tarjeta · Cancela cuando quieras',
    bullets: [
      'Elige tu formato — JPEG, PNG y WebP se exportan a la vez',
      'La IA rellena 13 campos SEO con una sola foto',
      '46+ marketplaces, un toque · 100 % en el dispositivo · funciona sin conexión',
    ],
  },
  pain: {
    kicker: 'Por qué existe',
    title: 'Vender en cada marketplace está roto.',
    sub: 'Eres vendedor, no técnico de Photoshop. photoZseo te devuelve las horas.',
    cards: [
      {
        bad: '"Editar fotos para cada plataforma me lleva toda la tarde."',
        goodTitle: 'La IA lo hace en 2 segundos.',
        goodDesc: 'Detección de fondo, recorte, balance de blancos, tamaños de exportación — cada plataforma, automáticamente.',
      },
      {
        bad: '"Vuelvo a escribir título, etiquetas y descripción para cada marketplace."',
        goodTitle: 'Una foto. 13 campos SEO. Rellenados.',
        goodDesc: 'Título, slug, meta, alt, palabras clave — escritos por IA en el dispositivo, en 12 idiomas.',
      },
      {
        bad: '"Mis presupuestos B2B son un documento de Word vergonzoso."',
        goodTitle: 'PDFs con tu marca en 3 pasos.',
        goodDesc: 'IVA, IBAN, códigos HS, firma electrónica, importe en letras — luce como una factura de Fortune 500.',
      },
    ],
  },
  features: {
    sectionKicker: 'Todas las funciones en un solo scroll',
    sectionTitle: 'Diez funciones. Un deslizamiento.',
    sectionSub: 'Desplázate en horizontal. Vertical en móvil.',
    seeInAction: 'Verlo en acción →',
    items: [
      {
        eyebrow: '46+ marketplaces',
        h: 'Publica una vez. Vende en todas partes.',
        sub: 'Una foto se convierte en 46+ listings listos para cada marketplace — dimensionados, nombrados y etiquetados con SEO para cada plataforma.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Cross-border: Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — separado por producto o combinado',
        ],
      },
      {
        eyebrow: 'Cámara IA · Una toma, cada formato',
        h: 'Un disparo. Cada formato, a la vez.',
        sub: 'Elige tu relación de aspecto (1:1, 4:5, 9:16 o 3:4). Pulsa el obturador una vez — photoZseo escribe JPEG, PNG y WebP en paralelo y redimensiona para cada marketplace. Sin volver a disparar, sin exportación por lotes.',
        bullets: [
          'Una captura → JPEG + PNG + WebP, guardados juntos',
          'Redimensionado por plataforma al exportar: Amazon, Shopify, Etsy, Instagram…',
          'AE Lock · WB Auto · Detección de fondo · Centrado automático del sujeto',
          'Ráfaga, obturador con botón de volumen, cuadrícula + nivel · 100 % sin conexión',
        ],
      },
      {
        eyebrow: 'Auto-relleno SEO con IA',
        h: 'Rellena 13 campos en segundos.',
        sub: 'Suelta una foto. photoZseo escribe título, slug, meta descripción, alt, etiquetas y palabras clave — optimizado para búsqueda, al instante.',
        bullets: [
          'OCR + Vision en el dispositivo: código de barras, marca, material, color',
          'Título, slug, meta, alt y palabras clave long-tail con calidad SEO',
          '12 idiomas — resultados correctos por configuración regional',
        ],
      },
      {
        eyebrow: 'Generador de presupuestos B2B',
        h: 'Presupuestos en PDF con tu marca, en 3 pasos.',
        sub: 'Elige productos, añade al comprador, comparte. IVA, IBAN, Incoterms, códigos HS y firma electrónica — todo en un PDF con tu marca cuidada.',
        bullets: [
          'Por línea: IVA · unidad · código HS · país de origen',
          'Perfil de remitente con logo, IBAN, Incoterms — guardado una vez',
          'Importe en letras, firma electrónica, numeración secuencial de presupuestos',
        ],
      },
      {
        eyebrow: 'Stories que venden',
        h: 'WhatsApp, Telegram e Instagram — un toque.',
        sub: 'Crea una cola de estados/stories para cada contacto. 9:16 para Instagram, 1:1 para WeChat, 3:4 para RED — formato automático.',
        bullets: [
          'Stickers inteligentes: precio, badge, descuento, novedad',
          'Cola round-robin con enfriamiento de 7 días por contacto',
          'Compartir en Stories, catálogo o guardar localmente',
        ],
      },
      {
        eyebrow: 'Detalle de producto',
        h: 'Gestiona como un profesional.',
        sub: 'Un producto, cada canal. Fotos, precios, SEO, EXIF y stories conviven en un único registro bellamente organizado.',
        bullets: [
          'Carrusel de fotos, inspector de medios, editor inline de EXIF',
          'Por producto: margen, MSRP, precio B2B, modo de IVA',
          'Compartir rápido a Presupuesto, Story, Catálogo o Marketplace',
        ],
      },
      {
        eyebrow: 'Metadatos profesionales',
        h: 'EXIF con calidad de cámara, en cada toma.',
        sub: 'EXIF, dimensiones y formato escritos para cada plataforma. GPS eliminado automáticamente. IPTC y etiquetas Artist preservadas.',
        bullets: [
          '9 campos EXIF editables inline (Artist, Copyright, Software…)',
          'Los datos GPS se eliminan al exportar por defecto — privacidad primero',
          'Cada toma se guarda en JPEG + PNG + WebP a la vez — sin re-exportar, sin pérdida de calidad',
        ],
      },
      {
        eyebrow: 'App universal',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS y Mac Catalyst. Arrastrar, soltar, selección múltiple, sidebar, inspector — sincronizado por iCloud Drive.',
        bullets: [
          'Arrastrar y soltar en iPad y Mac · exportación con selección múltiple',
          'Atajos de teclado, menús con clic derecho, navegación en sidebar',
          'Sincronización con iCloud Drive — en cada dispositivo, nunca se pierde',
        ],
      },
      {
        eyebrow: 'Privacidad primero',
        h: 'Sin tracking. Sin anuncios. Sin nubes.',
        sub: 'Creado para vendedores que no confían en la nube. Cumple GDPR, KVKK y CCPA. 12 idiomas incluyendo 4 alfabetos RTL.',
        bullets: [
          'GDPR · KVKK · CCPA — sin analítica, sin SDKs de terceros',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'La IA corre en el dispositivo — tus fotos nunca salen',
        ],
      },
      {
        eyebrow: 'Precios',
        h: 'Gratis para empezar. Pro cuando estés listo.',
        sub: 'Empieza gratis. Actualiza solo cuando estés listo para exportar a cada marketplace. Cancela cuando quieras, sin tarjeta para la prueba.',
        bullets: [
          'Gratis para siempre para capturar, organizar y exportar básico',
          'Pro añade 46+ formatos de marketplace, SEO con IA, presupuestos B2B',
          '3 días gratis · $39.99/año · solo $3.33/mes',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'Más que capturas de pantalla',
    headTitle: 'Construido como una herramienta pro, con precio de app.',
    headSub: 'Cada sección de abajo es una función que ya está disponible — sin roadmap, sin lista de espera.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: 'formatos de marketplace — escribe el título una vez, cada columna se rellena.',
    },
    exif: {
      label: 'EXIF con calidad de cámara',
      gpsStripped: '— ELIMINADO —',
    },
    langs: {
      label: '12 idiomas · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: 'Creado para vendedores indie',
      marketplaces: 'marketplaces',
      seoFields: 'campos SEO por foto',
      devices: 'dispositivos · una app',
      noTrackers: 'trackers · anuncios · nubes',
    },
  },
  seoDemo: {
    kicker: 'Interactivo · En vivo',
    title: 'Mira cómo la IA rellena 13 campos SEO.',
    sub: 'Elige un producto. Mira cómo photoZseo escribe cada campo que tu marketplace necesita — título, slug, categoría, meta, descripción completa, alt, etiquetas, palabras clave y código de barras. Toca cualquier campo para copiar.',
    inputLabel: 'Nombre del producto',
    inputPlaceholder: 'Escribe un nombre de producto…',
    btnIdle: '✨ Auto-rellenar 13 campos SEO',
    btnBusy: 'Generando…',
    note: 'En el dispositivo · 100 % privado · 12 idiomas',
    fieldLabels: {
      title: 'Título SEO',
      slug: 'Slug',
      filename: 'Nombre de archivo (URL)',
      category: 'Categoría',
      meta: 'Meta descripción',
      description: 'Descripción',
      alt: 'Texto alt',
      tag1: 'Etiqueta 1',
      tag2: 'Etiqueta 2',
      tag3: 'Etiqueta 3',
      tag4: 'Etiqueta 4',
      keywords: 'Palabras clave',
      barcode: 'Código de barras',
    },
  },
  stats: {
    kicker: 'Cifras que mueven producto',
    title: 'Diseñado por un vendedor indie.\nProbado por compradores en 12 países.',
    labels: {
      marketplaces: 'Marketplaces y canales',
      seoFields: 'Campos SEO por foto',
      languages: 'Idiomas — incl. RTL',
      zero: 'Anuncios. Trackers. Datos recolectados.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'Sin tracking, nunca',
    },
  },
  pricing: {
    kicker: 'Precios',
    title: 'Vende más rápido — sin marcas de agua, sin límites.',
    sub: 'Tres planes, una experiencia Pro. Prueba el plan anual gratis durante 3 días, después $3.33/mes — cancela cuando quieras en Ajustes.',
    badge: 'Mejor valor · Ahorra 52 %',
    plans: [
      {
        name: 'Semanal',
        pricePer: '$2.99/semana',
        features: [
          'Acceso Pro completo',
          'Pruébalo durante una semana',
          'Cancela cuando quieras en Ajustes',
          '— Sin compromiso a largo plazo',
        ],
        cta: 'Empezar Semanal',
      },
      {
        name: 'Mensual',
        pricePer: '$6.99/mes',
        features: [
          'Acceso Pro completo',
          'Facturación mensual, cancela cuando quieras',
          'Mismas funciones que el anual',
          '— Ahorra 52 % con el anual',
        ],
        cta: 'Elegir Mensual',
      },
      {
        name: 'Anual',
        pricePer: '$39.99/año',
        trial: '3 días gratis · solo $3.33/mes · ahorra 52 %',
        featured: true,
        features: [
          '**Quita la marca de agua** en todas las exportaciones',
          '**Exportación por lotes** de todas las fotos a la vez',
          '**CSV + XLSX** para 46+ marketplaces',
          '**Vídeo + Pro Tools** (estudio de cámara, eliminar fondo)',
          'Auto-relleno SEO con IA (13 campos, 12 idiomas)',
          'Generador de presupuestos B2B (IVA, IBAN, HS, e-firma)',
          'Stories y stickers inteligentes',
          'Editor EXIF y pipeline de metadatos',
          'iPhone, iPad y Mac universal',
          'Sincronización con iCloud Drive',
        ],
        cta: 'Empezar prueba gratis de 3 días',
      },
    ],
    note: 'Precios en USD. Precio local en la App Store (p. ej. ₺39.99/año en Turquía). Compatible con Compartir en Familia. Las suscripciones se renuevan automáticamente salvo cancelación al menos 24 h antes del fin del periodo — gestiona en Ajustes → Apple ID → Suscripciones.',
  },
  faq: {
    kicker: 'Preguntas',
    title: 'Todo lo que querías preguntar.',
    items: [
      {
        q: '¿photoZseo funciona sin internet?',
        a: 'Sí. La captura de fotos, edición, auto-relleno SEO con IA, EXIF y exportaciones funcionan al 100 % en el dispositivo usando Apple Foundation Models y Vision. Solo necesitas internet cuando empujas activamente a un marketplace remoto.',
      },
      {
        q: '¿Puedo exportar a Amazon, Shopify y Etsy al mismo tiempo?',
        a: 'Sí. Elige los productos, elige las plataformas, pulsa Exportar. photoZseo escribe CSV/XLSX/JSON en el orden exacto de columnas de cada plataforma, además de los tamaños de imagen por plataforma — separados por producto o en un único archivo combinado.',
      },
      {
        q: '¿Mis fotos o datos de producto se suben a algún sitio?',
        a: 'No. Cero analítica de terceros, cero SDKs de tracking y sin cuenta en la nube. La única red saliente es App Store / RevenueCat para la suscripción, y la sincronización opcional con iCloud Drive que permanece dentro de tu propio iCloud.',
      },
      {
        q: '¿Funciona en iPad y Mac, o solo en iPhone?',
        a: 'En los tres. photoZseo es una app universal — la misma compra cubre iPhone, iPad y Mac (Catalyst). Arrastrar y soltar, selección múltiple, atajos de teclado y un panel inspector son de primera clase en iPad y Mac.',
      },
      {
        q: '¿Qué incluye realmente la prueba gratuita de 3 días?',
        a: 'Todo Pro. Los 46+ formatos de marketplace, auto-relleno SEO con IA, generador de presupuestos B2B, Stories, herramientas EXIF — acceso completo durante 3 días en el plan anual. Si cancelas durante la prueba en Ajustes → Apple ID → Suscripciones, no se te cobra.',
      },
      {
        q: '¿Cuántas plataformas son exactamente "46+"?',
        a: 'En el lanzamiento: 46 presets de marketplace (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…) más formatos sociales/mensajería (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). Los nuevos presets llegan en actualizaciones.',
      },
      {
        q: '¿Mi ubicación GPS estará en las fotos exportadas?',
        a: 'No. photoZseo elimina los datos GPS al exportar por defecto. Otros EXIF — Artist, Copyright, Software, dimensiones, cámara — se conservan y se pueden editar inline. Tú mantienes el control.',
      },
      {
        q: '¿Cumple con GDPR / KVKK / CCPA?',
        a: 'Sí — y la app habla tu idioma: inglés, turco, alemán, español, francés, portugués, japonés, coreano, chino, árabe, hindi y persa. Los layouts RTL para árabe, urdu y persa son de primera clase.',
      },
      {
        q: '¿Puedo importar mi lista de productos existente?',
        a: 'Sí. CSV, TSV, XLSX, JSON, URL de fotos y carpetas masivas de fotos están soportadas. Incluye más de 41 plantillas de importación de plataformas.',
      },
    ],
  },
  finalCta: {
    h2: 'Tu próxima venta empieza con una foto.',
    p: 'Gratis para empezar. Sin tracking. Sin anuncios. Cancela cuando quieras. Creado para vendedores indie.',
    note: 'Próximamente en la App Store.',
    notify: 'Avísame en el lanzamiento',
  },
  footer: {
    tag: 'Vende en 46+ marketplaces desde una foto.',
    privacy: 'Privacidad', terms: 'Términos', support: 'Soporte',
    accessibility: 'Accesibilidad', deleteAccount: 'Eliminar cuenta',
    rights: 'Todos los derechos reservados. Creado para vendedores independientes.',
  },
};

export default es;
