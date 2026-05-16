import type { HomeContent } from '../home';

const zh: HomeContent = {
  nav: {
    features: '功能', pricing: '价格', faq: '常见问题',
    blog: '博客', support: '支持', getApp: '获取应用',
  },
  hero: {
    eyebrow: '现已支持 iPhone · iPad · Mac',
    h1Line1Words: ['拍一次。'],
    h1Line2Words: ['在', '46', '个市场销售。'],
    h1A11y: '拍一次。在46个市场销售。',
    sub: '7角度AI相机、12种语言的设备端SEO、最高4K的31个尺寸预设和完美适配各平台的导出 — 全部直接来自您的iPhone、iPad或Mac。',
    btnAppSmall: '抢先',
    btnAppBig: '体验',
    ctaTrial: '获取抢先体验',
    ctaCard: '抢先体验 · 无需信用卡',
    bullets: [
      '7角度模板相机 — 正面、背面、侧面、细节、顶部、标签、生活方式',
      'AI从一张照片中以12种语言填写13个SEO字段',
      '46个市场，一键完成 · 100%设备端 · 离线工作',
    ],
  },
  pain: {
    kicker: '为何存在',
    title: '在每个市场销售是混乱的。',
    sub: '您是销售者，不是Photoshop技术员。photoZseo帮您找回那些时间。',
    cards: [
      {
        bad: '"为每个平台编辑照片占用我整个晚上。"',
        goodTitle: 'AI 2秒钟搞定。',
        goodDesc: '显著性裁剪、白平衡、31种导出尺寸 — 每个平台，自动完成。',
      },
      {
        bad: '"我为每个市场重新输入标题、标签和描述。"',
        goodTitle: '一张照片。13个SEO字段。已填充。',
        goodDesc: '标题、slug、meta、alt文本、关键字 — 由设备端AI以12种语言编写。',
      },
      {
        bad: '"我的B2B报价是一份尴尬的Word文档。"',
        goodTitle: '3步完成品牌化PDF。',
        goodDesc: '增值税、IBAN、HS代码、电子签名、金额大写 — 看起来像财富500强发票。',
      },
    ],
  },
  features: {
    sectionKicker: '所有功能，一处汇集',
    sectionTitle: '切换的十个理由。',
    sectionSub: '市场、7角度AI相机、SEO自动填充、批量导入、B2B报价、iCloud同步等 — 为每天发货的独立卖家而建。',
    seeInAction: '实际查看 →',
    items: [
      {
        eyebrow: '46个市场',
        h: '一次上架。处处销售。',
        sub: '一张照片变成46个市场就绪的列表 — 为每个平台调整尺寸、命名和SEO标记。',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          '跨境: Temu · SHEIN · DHgate · Made-in-China · Global Sources',
          'CSV / XLSX / JSON — 每个产品单独或组合',
        ],
      },
      {
        eyebrow: 'AI相机 · 7角度，一键快门',
        h: '正面、背面、侧面、细节、顶部、标签、生活方式。',
        sub: '一款模板驱动的相机，引导您完成每个市场所需的7个角度。基于显著性的自动缩放（4×）、HDR、防闪烁和12种语言的实时OCR — 每次拍摄同时导出为JPEG、PNG和WebP。',
        bullets: [
          '7角度模板与方向自动推进',
          '智能自动缩放（25%主体填充，最大4×）· AE锁定 · WB自动',
          '设备端Vision: 显著性、分类、条形码、实时OCR',
          '音量键快门 · 4K拍摄 · 100%离线',
        ],
      },
      {
        eyebrow: 'AI SEO自动填充',
        h: '几秒钟内自动填充13个字段。',
        sub: '放入一张照片。photoZseo以12种语言即时编写标题、slug、类别、meta、完整描述、alt文本、标签、关键字和条形码 — 全部为搜索优化。',
        bullets: [
          '设备端OCR + Vision: 条形码、品牌、材料、颜色',
          'SEO标题、slug、类别、meta、长描述、alt和长尾关键字',
          '12种语言 — 区域正确的输出，RTL感知',
        ],
      },
      {
        eyebrow: 'B2B报价生成器',
        h: '3步完成品牌化PDF报价。',
        sub: '选择产品，添加买家，分享。12种语言的A4 PDF，包含增值税、IBAN、Incoterms、HS代码和电子签名 — 精美品牌化。',
        bullets: [
          '每行: 增值税 · 单位 · HS代码 · 原产国',
          '带有徽标、IBAN、Incoterms的发件人资料 — 一次保存',
          '名片扫描（Vision OCR）自动填充买家详情',
        ],
      },
      {
        eyebrow: 'iCloud同步与回收站恢复',
        h: '处处同步。万物可恢复。',
        sub: '每个项目通过您自己的iCloud Drive同步。删除的项目在永久清除前等待30天，跨iPhone、iPad和Mac安全恢复。',
        bullets: [
          'iCloud Drive同步 — 可选，最后写入获胜',
          '最近删除文件夹与安全恢复',
          '30天自动清除并保留预设（7 / 14 / 30 / 60天）',
          '跨设备硬删除传播',
        ],
      },
      {
        eyebrow: '产品详情',
        h: '像专业人士一样管理。',
        sub: '一个产品，每个渠道。照片、价格、SEO、EXIF和故事生活在一个精心组织的记录中 — B2B配备13色联系人调色板。',
        bullets: [
          '照片轮播、媒体检查器、EXIF内联编辑器',
          '每个产品的加价、MSRP、B2B价格、增值税模式',
          '快速分享至报价、目录或市场',
        ],
      },
      {
        eyebrow: '批量CSV / XLSX导入',
        h: '放入目录。匹配41个平台。',
        sub: '放入目录文件 — photoZseo自动检测41个平台签名并并行拉取产品照片。现有的Shopify或Amazon目录几分钟内即可上线。',
        bullets: [
          'CSV · TSV · XLSX · JSON目录导入',
          '从标题自动检测41个平台签名',
          '照片URL并行下载 · 仅Wi-Fi切换',
          '每个平台批量ZIP导出',
        ],
      },
      {
        eyebrow: 'Mac + iPhone + iPad',
        h: '原生Mac应用。通用二进制。',
        sub: 'iOS 17+、iPadOS和通过Mac Catalyst的macOS 14+。键盘快捷键、Finder拖放、3面板检查器和跨所有设备的iCloud同步项目。',
        bullets: [
          '⌘N / ⌘E / ⌘F / ⌘A 键盘快捷键',
          '从Finder拖放 · 右键上下文菜单',
          '3面板检查器: 侧边栏 · 网格 · 详情',
          '跨iPhone、iPad和Mac的iCloud Drive同步',
        ],
      },
      {
        eyebrow: '隐私优先',
        h: '无跟踪。无广告。无云端。',
        sub: '为不信任云端的卖家而建。GDPR、KVKK和CCPA合规。包含3种RTL文字的12种语言。导出时默认剥离GPS。',
        bullets: [
          'GDPR · KVKK · CCPA — 无分析、无第三方SDK',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'AI在设备端运行 — 您的照片永不离开',
          '导出时剥离GPS数据 · 保留软件标签',
        ],
      },
      {
        eyebrow: '价格',
        h: '免费开始。准备好时升级Pro。',
        sub: '免费开始。仅在您准备好导出到每个市场时升级。随时取消，抢先体验无需信用卡。',
        bullets: [
          '永久免费的拍摄、整理和基本导出',
          'Pro增加46个市场格式、AI SEO、B2B报价、批量导入',
          '每周$2.99 · 每月$6.99 · 每年$39.99（最佳价值）',
        ],
      },
    ],
  },
  bento: {
    headKicker: '不仅仅是截图',
    headTitle: '像强力工具一样构建，像应用一样定价。',
    headSub: '下面的每个部分都是今天交付的功能 — 没有路线图，没有等待列表。',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: '46个市场格式 — 输入一次标题，每列自动填充。',
    },
    exif: {
      label: '相机级EXIF',
      gpsStripped: '— 已剥离 —',
    },
    langs: {
      label: '12种语言 · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: '为独立卖家而建',
      marketplaces: '市场',
      seoFields: '每张照片的SEO字段',
      devices: '设备 · 一个应用',
      noTrackers: '跟踪器 · 广告 · 云端',
    },
  },
  seoDemo: {
    kicker: '互动 · 直播',
    title: '观看AI填充13个SEO字段。',
    sub: '选择一个产品。观看photoZseo编写您市场所需的每个字段 — 标题、slug、文件名、类别、meta、完整描述、alt文本、标签、关键字和条形码。点击任何字段复制。',
    inputLabel: '产品名称',
    inputPlaceholder: '输入产品名称…',
    btnIdle: '✨ 自动填充13个SEO字段',
    btnBusy: '生成中…',
    note: '设备端 · 100%私密 · 12种语言',
    fieldLabels: {
      title: 'SEO标题',
      slug: 'Slug',
      filename: '文件名（URL）',
      category: '类别',
      meta: 'Meta描述',
      description: '描述',
      alt: 'Alt文本',
      tag1: '标签 1',
      tag2: '标签 2',
      tag3: '标签 3',
      tag4: '标签 4',
      keywords: '关键字',
      barcode: '条形码',
    },
  },
  stats: {
    kicker: '推动产品的数字',
    title: '由独立卖家设计。\n经12个国家买家测试。',
    labels: {
      marketplaces: '市场和渠道',
      seoFields: '每张照片的SEO字段',
      languages: '语言 — 3 RTL',
      zero: '广告。跟踪器。收集的数据。',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: '永不跟踪',
    },
  },
  pricing: {
    kicker: '价格',
    title: '更快销售 — 无水印，无限制。',
    sub: '三个计划，一个Pro体验。年度计划最佳价值$3.33/月 — 随时在设置中取消。',
    badge: '最佳价值 · 节省52%',
    plans: [
      {
        name: '每周',
        pricePer: '$2.99/周',
        features: [
          '完整Pro访问',
          '试用一周',
          '随时在设置中取消',
          '— 无长期承诺',
        ],
        cta: '开始每周',
      },
      {
        name: '每月',
        pricePer: '$6.99/月',
        features: [
          '完整Pro访问',
          '按月计费，随时取消',
          '与年度计划相同的功能',
          '— 年度计划节省52%',
        ],
        cta: '选择每月',
      },
      {
        name: '年度',
        pricePer: '$39.99/年',
        trial: '仅$3.33/月 · 节省52%',
        featured: true,
        features: [
          '**移除水印** 所有导出',
          '**批量导出** 每张照片同时',
          '**CSV + XLSX** 用于46个市场',
          '**7角度模板相机** + Pro Tools',
          'AI SEO自动填充（13个字段，12种语言）',
          'B2B报价生成器（增值税、IBAN、HS、电子签名）',
          '批量CSV / XLSX / JSON目录导入',
          'EXIF编辑器和元数据管道（GPS剥离）',
          'iPhone、iPad和Mac通用',
          'iCloud Drive同步 + 回收站恢复',
        ],
        cta: '获取年度',
      },
    ],
    note: '价格以美元计。App Store本地价格（例如土耳其₺39.99/年）。支持家人共享。订阅在周期结束前至少24小时未取消时自动续订 — 在设置 → Apple ID → 订阅中管理。',
  },
  faq: {
    kicker: '问题',
    title: '您想问的一切。',
    items: [
      {
        q: 'photoZseo在没有互联网的情况下工作吗？',
        a: '是的。照片拍摄、编辑、AI SEO自动填充、EXIF和导出全部使用Apple Foundation Models和Vision在100%设备端运行。仅在您主动推送到远程市场时才需要互联网。',
      },
      {
        q: '我可以同时导出到Amazon、Shopify和Etsy吗？',
        a: '是的。选择产品，选择平台，按导出。photoZseo以每个平台的确切列顺序编写CSV/XLSX/JSON，加上每个平台的图像尺寸 — 每个产品单独或一个组合文件。',
      },
      {
        q: '我的照片或产品数据会上传到任何地方吗？',
        a: '不会。零第三方分析、零跟踪SDK，无云账户。唯一的外部网络是用于订阅的App Store / RevenueCat和可选的iCloud Drive同步，后者保留在您自己的iCloud内。',
      },
      {
        q: '它在iPad和Mac上工作还是仅iPhone？',
        a: '三者都有。photoZseo是一款通用应用 — 相同的购买涵盖iPhone、iPad和Mac（Catalyst，macOS 14+）。从Finder拖放、⌘N/E/F/A键盘快捷键、右键菜单和3面板检查器在iPad和Mac上是一流的。',
      },
      {
        q: 'Pro中究竟有什么？',
        a: '一切：所有46个市场格式、AI SEO自动填充（13个字段，12种语言）、B2B报价生成器、7角度模板相机、批量CSV/XLSX导入、水印移除和带有回收站恢复的iCloud同步。',
      },
      {
        q: '46个平台具体是哪些？',
        a: '推出时：46个市场预设（Amazon、Shopify、Etsy、eBay、Walmart、WooCommerce、Trendyol、AliExpress、Mercado Libre、Coupang、Lazada、Shopee、Temu、SHEIN、DHgate、Made-in-China、Global Sources…）加上社交/消息格式（Instagram Shopping、TikTok Shop、Pinterest、WeChat、RED、Stories）。新预设在更新中发布。',
      },
      {
        q: '我的GPS位置会在导出的照片中吗？',
        a: '不会。photoZseo默认在导出时剥离GPS数据。其他EXIF — Artist、Copyright、Software、尺寸、相机 — 保留并可内联编辑。您保持控制。',
      },
      {
        q: '它符合GDPR / KVKK / CCPA吗？',
        a: '是的 — 应用说您的语言：英语、土耳其语、德语、西班牙语、法语、葡萄牙语、日语、韩语、中文、阿拉伯语、印地语和波斯语。阿拉伯语、波斯语和乌尔都语的RTL布局是一流的。',
      },
      {
        q: '我可以导入现有产品列表吗？',
        a: '是的。支持CSV、TSV、XLSX、JSON和照片URL。包含41个平台导入模板，可从文件标题自动检测 — 放入现有的Shopify或Amazon导出，photoZseo会处理其余部分。',
      },
    ],
  },
  finalCta: {
    h2: '您的下一笔销售从一张照片开始。',
    p: '免费开始。无跟踪。无广告。随时取消。为独立卖家而建。',
    note: '即将登陆App Store。',
    notify: '在推出时通知我',
  },
  footer: {
    tag: '从一张照片在46个市场销售。',
    privacy: '隐私', terms: '条款', support: '支持',
    accessibility: '无障碍', deleteAccount: '删除账户',
    rights: '保留所有权利。为独立卖家而建。',
  },
};

export default zh;
