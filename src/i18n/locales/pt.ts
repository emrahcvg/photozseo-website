import type { HomeContent } from '../home';

const pt: HomeContent = {
  nav: {
    features: 'Recursos', pricing: 'Preços', faq: 'FAQ',
    blog: 'Blog', support: 'Suporte', getApp: 'Baixar o app',
  },
  hero: {
    eyebrow: 'Agora no iPhone · iPad · Mac',
    h1Line1Words: ['Cadastre', 'uma', 'vez.'],
    h1Line2Words: ['Venda', 'em', '46+', 'marketplaces.'],
    h1A11y: 'Cadastre uma vez. Venda em 46+ marketplaces.',
    sub: 'Fotos de produto com qualidade de estúdio, SEO escrito por IA, orçamentos B2B e exportações perfeitas para cada plataforma — tudo do seu iPhone. Sem computador. Sem planilha. Sem nuvem.',
    btnAppSmall: 'Baixar na',
    btnAppBig: 'App Store',
    ctaTrial: '3 dias de teste grátis',
    ctaCard: 'Sem cartão · Cancele a qualquer momento',
    bullets: [
      'Escolha sua proporção — JPEG, PNG e WebP exportados juntos',
      'A IA preenche 13 campos de SEO a partir de uma única foto',
      '46+ marketplaces, um toque · 100% no dispositivo · funciona offline',
    ],
  },
  pain: {
    kicker: 'Por que isso existe',
    title: 'Vender em cada marketplace está quebrado.',
    sub: 'Você é vendedor, não técnico de Photoshop. O photoZseo devolve essas horas.',
    cards: [
      {
        bad: '"Editar fotos para cada plataforma consome a minha noite inteira."',
        goodTitle: 'A IA faz isso em 2 segundos.',
        goodDesc: 'Detecção de fundo, recorte, balanço de branco, tamanhos de exportação — cada plataforma, automaticamente.',
      },
      {
        bad: '"Eu redigito título, tags e descrição para cada marketplace."',
        goodTitle: 'Uma foto. 13 campos de SEO. Preenchidos.',
        goodDesc: 'Título, slug, meta, texto alt, palavras-chave — escritos por IA no dispositivo em 12 idiomas.',
      },
      {
        bad: '"Meus orçamentos B2B são um documento Word vergonhoso."',
        goodTitle: 'PDFs com identidade em 3 passos.',
        goodDesc: 'VAT, IBAN, códigos HS, assinatura eletrônica, valor por extenso — parece uma fatura da Fortune 500.',
      },
    ],
  },
  features: {
    sectionKicker: 'Cada recurso, em um único rolar',
    sectionTitle: 'Dez recursos. Um deslizar.',
    sectionSub: 'Role horizontalmente. Estilo vertical no celular.',
    seeInAction: 'Veja em ação →',
    items: [
      {
        eyebrow: '46+ Marketplaces',
        h: 'Cadastre uma vez. Venda em todo lugar.',
        sub: 'Uma foto vira 46+ anúncios prontos para marketplaces — dimensionados, nomeados e com tags de SEO para cada plataforma.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Cross-border: Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — separado por produto ou combinado',
        ],
      },
      {
        eyebrow: 'Câmera com IA · Um clique, todos os formatos',
        h: 'Um toque no obturador. Todo formato, ao mesmo tempo.',
        sub: 'Escolha sua proporção (1:1, 4:5, 9:16 ou 3:4). Aperte o obturador uma vez — o photoZseo grava JPEG, PNG e WebP em paralelo e redimensiona para cada marketplace. Sem refazer fotos, sem exportação em lote.',
        bullets: [
          'Uma captura → JPEG + PNG + WebP, salvos juntos',
          'Redimensionamento por plataforma na exportação: Amazon, Shopify, Etsy, Instagram…',
          'AE Lock · WB Auto · Detecção de fundo · Centralização automática do objeto',
          'Rajada, obturador pelo botão de volume, grade + nível · 100% offline',
        ],
      },
      {
        eyebrow: 'Preenchimento automático de SEO por IA',
        h: 'Preencha 13 campos em segundos.',
        sub: 'Solte uma foto. O photoZseo escreve título, slug, meta descrição, texto alt, tags e palavras-chave — otimizados para busca, instantaneamente.',
        bullets: [
          'OCR + Vision no dispositivo: código de barras, marca, material, cor',
          'Título, slug, meta, texto alt e palavras-chave long-tail de qualidade SEO',
          '12 idiomas — saídas corretas para a locale',
        ],
      },
      {
        eyebrow: 'Gerador de orçamento B2B',
        h: 'Orçamentos PDF com identidade em 3 passos.',
        sub: 'Escolha produtos, adicione o comprador, compartilhe. VAT, IBAN, Incoterms, códigos HS e uma assinatura eletrônica — tudo em um PDF lindamente identificado.',
        bullets: [
          'VAT por linha · unidade · código HS · país de origem',
          'Perfil de remetente com logo, IBAN, Incoterms — salvo uma única vez',
          'Valor por extenso, assinatura eletrônica, IDs sequenciais de orçamento',
        ],
      },
      {
        eyebrow: 'Stories que vendem',
        h: 'WhatsApp, Telegram e Instagram — um toque.',
        sub: 'Monte uma fila de status / story para cada contato. 9:16 para Instagram, 1:1 para WeChat, 3:4 para RED — formatados automaticamente.',
        bullets: [
          'Stickers inteligentes: preço, badge, desconto, lançamento',
          'Fila round-robin com intervalo de 7 dias por contato',
          'Compartilhe em Stories, Catálogo ou salve localmente',
        ],
      },
      {
        eyebrow: 'Detalhe do produto',
        h: 'Gerencie como um profissional.',
        sub: 'Um produto, todos os canais. Fotos, preços, SEO, EXIF e stories vivem dentro de um único registro lindamente organizado.',
        bullets: [
          'Carrossel de fotos, inspetor de mídia, editor EXIF inline',
          'Markup por produto, MSRP, preço B2B, modo VAT',
          'Compartilhamento rápido para Orçamento, Story, Catálogo ou Marketplace',
        ],
      },
      {
        eyebrow: 'Metadados Pro',
        h: 'EXIF nível câmera profissional, em cada foto.',
        sub: 'EXIF, dimensões e formato escritos para cada plataforma. GPS removido automaticamente. Tags IPTC e Artist preservados.',
        bullets: [
          '9 campos EXIF editáveis inline (Artist, Copyright, Software…)',
          'Dados GPS removidos na exportação por padrão — privacidade em primeiro lugar',
          'Cada foto salva em JPEG + PNG + WebP de uma vez — sem reexportação, sem perda de qualidade',
        ],
      },
      {
        eyebrow: 'App universal',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS e Mac Catalyst. Arrastar, soltar, multiseleção, sidebar, inspetor — sincronizados via iCloud Drive.',
        bullets: [
          'Arrastar e soltar no iPad e Mac · exportação com multiseleção',
          'Atalhos de teclado, menus de clique direito, navegação por sidebar',
          'Sincronia iCloud Drive — cada dispositivo, nunca perdido',
        ],
      },
      {
        eyebrow: 'Privacidade em primeiro lugar',
        h: 'Sem rastreio. Sem anúncios. Sem nuvem.',
        sub: 'Feito para vendedores que não confiam na nuvem. Em conformidade com GDPR, KVKK e CCPA. 12 idiomas, incluindo 4 scripts RTL.',
        bullets: [
          'GDPR · KVKK · CCPA — sem analytics, sem SDKs de terceiros',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'A IA roda no dispositivo — suas fotos nunca saem',
        ],
      },
      {
        eyebrow: 'Preços',
        h: 'Grátis para começar. Pro quando estiver pronto.',
        sub: 'Comece grátis. Faça upgrade só quando estiver pronto para exportar para cada marketplace. Cancele a qualquer momento, sem cartão para o teste.',
        bullets: [
          'Grátis para sempre para capturar, organizar e exportar básico',
          'Pro adiciona 46+ formatos de marketplace, SEO por IA, orçamento B2B',
          '3 dias de teste grátis · $39.99/ano · só $3.33/mês',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'Mais que capturas de tela',
    headTitle: 'Construído como ferramenta profissional, com preço de app.',
    headSub: 'Cada seção abaixo é um recurso que já está disponível — sem roadmap, sem lista de espera.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: 'formatos de marketplace — digite o título uma vez, cada coluna se preenche.',
    },
    exif: {
      label: 'EXIF nível câmera profissional',
      gpsStripped: '— REMOVIDO —',
    },
    langs: {
      label: '12 idiomas · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: 'Feito para vendedores independentes',
      marketplaces: 'marketplaces',
      seoFields: 'campos de SEO por foto',
      devices: 'dispositivos · um app',
      noTrackers: 'rastreadores · anúncios · nuvens',
    },
  },
  seoDemo: {
    kicker: 'Interativo · Ao vivo',
    title: 'Veja a IA preencher 13 campos de SEO.',
    sub: 'Escolha um produto. Veja o photoZseo escrever cada campo que sua marketplace precisa — título, slug, categoria, meta, descrição completa, alt, tags, palavras-chave e código de barras. Toque em qualquer campo para copiar.',
    inputLabel: 'Nome do produto',
    inputPlaceholder: 'Digite um nome de produto…',
    btnIdle: '✨ Preencher automaticamente 13 campos de SEO',
    btnBusy: 'Gerando…',
    note: 'No dispositivo · 100% privado · 12 idiomas',
    fieldLabels: {
      title: 'Título SEO',
      slug: 'Slug',
      filename: 'Nome do arquivo (URL)',
      category: 'Categoria',
      meta: 'Meta Desc',
      description: 'Descrição',
      alt: 'Texto Alt',
      tag1: 'Tag 1',
      tag2: 'Tag 2',
      tag3: 'Tag 3',
      tag4: 'Tag 4',
      keywords: 'Palavras-chave',
      barcode: 'Código de barras',
    },
  },
  stats: {
    kicker: 'Números que movem produto',
    title: 'Projetado por um vendedor independente.\nTestado por compradores em 12 países.',
    labels: {
      marketplaces: 'Marketplaces e canais',
      seoFields: 'campos de SEO por foto',
      languages: 'Idiomas — incl. RTL',
      zero: 'Anúncios. Rastreadores. Dados coletados.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'Sem rastreio, nunca',
    },
  },
  pricing: {
    kicker: 'Preços',
    title: 'Venda mais rápido — sem marca d\'água, sem limites.',
    sub: 'Três planos, uma experiência Pro. Teste o plano anual grátis por 3 dias, depois $3.33/mês — cancele a qualquer momento em Ajustes.',
    badge: 'Melhor valor · Economize 52%',
    plans: [
      {
        name: 'Semanal',
        pricePer: '$2.99/semana',
        features: [
          'Acesso Pro completo',
          'Teste por uma semana',
          'Cancele a qualquer momento em Ajustes',
          '— Sem compromisso de longo prazo',
        ],
        cta: 'Começar Semanal',
      },
      {
        name: 'Mensal',
        pricePer: '$6.99/mês',
        features: [
          'Acesso Pro completo',
          'Cobrança mensal, cancele a qualquer momento',
          'Mesmos recursos do anual',
          '— Economize 52% com o anual',
        ],
        cta: 'Escolher Mensal',
      },
      {
        name: 'Anual',
        pricePer: '$39.99/ano',
        trial: '3 dias de teste grátis · só $3.33/mês · economize 52%',
        featured: true,
        features: [
          '**Remova a marca d\'água** em todas as exportações',
          '**Exportação em lote** de todas as fotos de uma vez',
          '**CSV + XLSX** para 46+ marketplaces',
          '**Vídeo + Pro Tools** (estúdio de câmera, remoção de fundo)',
          'Preenchimento automático de SEO por IA (13 campos, 12 idiomas)',
          'Gerador de orçamento B2B (VAT, IBAN, HS, e-sign)',
          'Stories e Stickers Inteligentes',
          'Editor EXIF e pipeline de metadados',
          'iPhone, iPad e Mac universal',
          'Sincronia iCloud Drive',
        ],
        cta: 'Iniciar teste grátis de 3 dias',
      },
    ],
    note: 'Preços em USD. Preço local na App Store (ex.: ₺39.99/ano na Turquia). Compartilhamento Familiar suportado. As assinaturas renovam automaticamente, a menos que sejam canceladas com pelo menos 24h de antecedência do fim do período — gerencie em Ajustes → ID Apple → Assinaturas.',
  },
  faq: {
    kicker: 'Perguntas',
    title: 'Tudo que você queria perguntar.',
    items: [
      {
        q: 'O photoZseo funciona sem internet?',
        a: 'Sim. Captura de foto, edição, preenchimento automático de SEO por IA, EXIF e exportações rodam 100% no dispositivo usando Apple Foundation Models e Vision. Internet só é necessária quando você envia ativamente para uma marketplace remota.',
      },
      {
        q: 'Posso exportar para Amazon, Shopify e Etsy ao mesmo tempo?',
        a: 'Sim. Escolha os produtos, escolha as plataformas, aperte Exportar. O photoZseo grava CSV/XLSX/JSON na ordem exata de colunas de cada plataforma, além de tamanhos de imagem por plataforma — separado por produto ou em um único arquivo combinado.',
      },
      {
        q: 'Minhas fotos ou dados de produto são enviados para algum lugar?',
        a: 'Não. Zero analytics de terceiros, zero SDKs de rastreio e sem conta na nuvem. A única rede de saída é App Store / RevenueCat para a assinatura, e a sincronia opcional do iCloud Drive que fica dentro do seu próprio iCloud.',
      },
      {
        q: 'Funciona no iPad e Mac, ou só no iPhone?',
        a: 'Os três. O photoZseo é um app universal — a mesma compra cobre iPhone, iPad e Mac (Catalyst). Arrastar e soltar, multiseleção, atalhos de teclado e um painel inspetor são de primeira classe no iPad e Mac.',
      },
      {
        q: 'O que tem exatamente nos 3 dias de teste grátis?',
        a: 'Tudo do Pro. Todos os 46+ formatos de marketplace, preenchimento automático de SEO por IA, gerador de orçamento B2B, Stories, ferramentas EXIF — acesso completo por 3 dias no plano anual. Se cancelar durante o teste em Ajustes → ID Apple → Assinaturas, você não é cobrado.',
      },
      {
        q: 'Quantas plataformas exatamente são "46+"?',
        a: 'No lançamento: 46 presets de marketplace (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…) mais formatos sociais/mensagens (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). Novos presets chegam nas atualizações.',
      },
      {
        q: 'Minha localização GPS estará nas fotos exportadas?',
        a: 'Não. O photoZseo remove os dados GPS na exportação por padrão. Outros EXIF — Artist, Copyright, Software, dimensões, câmera — são preservados e editáveis inline. Você fica no controle.',
      },
      {
        q: 'É compatível com GDPR / KVKK / CCPA?',
        a: 'Sim — e o app fala seu idioma: inglês, turco, alemão, espanhol, francês, português, japonês, coreano, chinês, árabe, hindi e persa. Layouts RTL para árabe, urdu e persa são de primeira classe.',
      },
      {
        q: 'Posso importar minha lista de produtos existente?',
        a: 'Sim. CSV, TSV, XLSX, JSON, URL de foto e pastas de fotos em massa são todos suportados. 41+ modelos de importação de plataformas inclusos.',
      },
    ],
  },
  finalCta: {
    h2: 'Sua próxima venda começa com uma foto.',
    p: 'Grátis para começar. Sem rastreio. Sem anúncios. Cancele a qualquer momento. Feito para vendedores independentes.',
    note: 'Em breve na App Store.',
    notify: 'Me avise no lançamento',
  },
  footer: {
    tag: 'Venda em 46+ marketplaces a partir de uma única foto.',
    privacy: 'Privacidade', terms: 'Termos', support: 'Suporte',
    accessibility: 'Acessibilidade', deleteAccount: 'Excluir conta',
    rights: 'Todos os direitos reservados. Feito para vendedores independentes.',
  },
};

export default pt;
