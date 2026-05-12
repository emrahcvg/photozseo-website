import type { HomeContent } from '../home';

const zh: HomeContent = {
  nav: {
    features: '功能', pricing: '价格', faq: '常见问题',
    blog: '博客', support: '支持', getApp: '获取应用',
  },
  hero: {
    eyebrow: '现已登陆 iPhone · iPad · Mac',
    h1Line1Words: ['一次', '上架。'],
    h1Line2Words: ['46+', '电商平台', '同时销售。'],
    h1A11y: '一次上架。在 46+ 电商平台同时销售。',
    sub: '工作室级商品照片、AI 撰写的 SEO、B2B 报价单，以及为各平台量身打造的导出——全部在你的 iPhone 上完成。无需电脑。无需电子表格。无需云端。',
    btnAppSmall: '下载',
    btnAppBig: 'App Store',
    ctaTrial: '3 天免费试用',
    ctaCard: '无需信用卡 · 随时取消',
    bullets: [
      '选择你的比例 — JPEG、PNG 和 WebP 同时导出',
      'AI 从一张照片自动填写 13 个 SEO 字段',
      '46+ 电商平台，一键直达 · 100% 设备端处理 · 离线可用',
    ],
  },
  pain: {
    kicker: '为何打造',
    title: '在每个电商平台上销售，太折腾了。',
    sub: '你是卖家，不是 Photoshop 技术员。photoZseo 把时间还给你。',
    cards: [
      {
        bad: '"为每个平台修图占用了我整个晚上。"',
        goodTitle: 'AI 在 2 秒内完成。',
        goodDesc: '背景识别、裁剪、白平衡、导出尺寸——为每个平台自动处理。',
      },
      {
        bad: '"我要为每个电商平台重新输入标题、标签和描述。"',
        goodTitle: '一张照片。13 个 SEO 字段。一键填好。',
        goodDesc: '标题、Slug、Meta、Alt 文本、关键词——设备端 AI 用 12 种语言撰写。',
      },
      {
        bad: '"我的 B2B 报价单是一份难堪的 Word 文档。"',
        goodTitle: '3 步生成品牌 PDF。',
        goodDesc: 'VAT、IBAN、HS 编码、电子签名、金额大写——像财富 500 强的发票。',
      },
    ],
  },
  features: {
    sectionKicker: '所有功能，一次滚动看完',
    sectionTitle: '十项功能。一次滑动。',
    sectionSub: '横向滚动。移动端为竖向布局。',
    seeInAction: '查看实际效果 →',
    items: [
      {
        eyebrow: '46+ 电商平台',
        h: '一次上架。处处销售。',
        sub: '一张照片，变成 46+ 平台就绪的商品列表——为每个平台调整尺寸、命名、SEO 标签。',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          '跨境：Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON——按商品分开或合并',
        ],
      },
      {
        eyebrow: 'AI 相机 · 一次拍摄，全部格式',
        h: '一次快门。所有格式，同时完成。',
        sub: '选择你的宽高比（1:1、4:5、9:16 或 3:4）。按一次快门——photoZseo 并行输出 JPEG、PNG 和 WebP，并为每个电商平台自动调整尺寸。无需重拍，无需批量导出。',
        bullets: [
          '一次拍摄 → JPEG + PNG + WebP，一并保存',
          '导出时按平台调整尺寸：Amazon、Shopify、Etsy、Instagram…',
          'AE 锁定 · WB 自动 · 背景识别 · 自动居中主体',
          '连拍、音量键快门、网格 + 水平线 · 100% 离线',
        ],
      },
      {
        eyebrow: 'AI SEO 自动填充',
        h: '几秒钟自动填写 13 个字段。',
        sub: '放入一张照片。photoZseo 即时撰写标题、Slug、Meta 描述、Alt 文本、标签和关键词——搜索优化。',
        bullets: [
          '设备端 OCR + Vision：条码、品牌、材质、颜色',
          'SEO 级别的标题、Slug、Meta、Alt 文本和长尾关键词',
          '12 种语言——本地化精准输出',
        ],
      },
      {
        eyebrow: 'B2B 报价生成器',
        h: '3 步生成品牌 PDF 报价单。',
        sub: '选择商品、添加买家、分享。VAT、IBAN、Incoterms、HS 编码与电子签名——全部呈现在精美的品牌 PDF 上。',
        bullets: [
          '逐行 VAT · 单位 · HS 编码 · 原产国',
          '发件人资料含 Logo、IBAN、Incoterms——只需保存一次',
          '金额大写、电子签名、连续报价编号',
        ],
      },
      {
        eyebrow: '会带货的故事',
        h: 'WhatsApp、Telegram 与 Instagram——一键搞定。',
        sub: '为每位联系人构建状态 / 故事队列。Instagram 用 9:16，WeChat 用 1:1，RED 用 3:4——自动格式化。',
        bullets: [
          '智能贴纸：价格、徽章、折扣、新品',
          '轮询队列，每位联系人 7 天冷却',
          '分享到 Stories、Catalog 或本地保存',
        ],
      },
      {
        eyebrow: '商品详情',
        h: '专业级管理。',
        sub: '一件商品，全渠道通用。照片、价格、SEO、EXIF 与故事——全部置于一份精美的记录中。',
        bullets: [
          '照片轮播、媒体检查器、EXIF 内联编辑器',
          '逐商品加价、MSRP、B2B 价、VAT 模式',
          '快速分享到 Quote、Story、Catalog 或 Marketplace',
        ],
      },
      {
        eyebrow: '专业元数据',
        h: '相机级 EXIF，每一张。',
        sub: '为每个平台写入 EXIF、尺寸和格式。GPS 自动剥离。保留 IPTC 与 Artist 标签。',
        bullets: [
          '9 个 EXIF 字段可内联编辑（Artist、Copyright、Software…）',
          '导出时默认剥离 GPS 数据——隐私优先',
          '每张照片同时保存为 JPEG + PNG + WebP——无需重新导出，无质量损失',
        ],
      },
      {
        eyebrow: '通用应用',
        h: 'iPhone。iPad。Mac。',
        sub: 'iOS 17+、iPadOS 与 Mac Catalyst。拖放、多选、侧边栏、检查器——通过 iCloud Drive 同步。',
        bullets: [
          'iPad 和 Mac 上拖放 · 多选导出',
          '键盘快捷键、右键菜单、侧边栏导航',
          'iCloud Drive 同步——所有设备，永不丢失',
        ],
      },
      {
        eyebrow: '隐私优先',
        h: '无追踪。无广告。无云端。',
        sub: '为不信任云端的卖家而生。符合 GDPR、KVKK 与 CCPA。12 种语言，包括 4 种 RTL 文字。',
        bullets: [
          'GDPR · KVKK · CCPA——无分析，无第三方 SDK',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'AI 在设备端运行——你的照片绝不外传',
        ],
      },
      {
        eyebrow: '价格',
        h: '免费起步。准备好再升级 Pro。',
        sub: '免费开始。仅当你准备好向所有电商平台导出时再升级。随时取消，试用无需信用卡。',
        bullets: [
          '永久免费用于拍摄、整理和基础导出',
          'Pro 解锁 46+ 电商平台格式、AI SEO、B2B 报价',
          '3 天免费试用 · $39.99/年 · 月均仅 $3.33',
        ],
      },
    ],
  },
  bento: {
    headKicker: '不止是截图',
    headTitle: '按专业工具打造，按应用定价。',
    headSub: '下方每一节都是今天就能用的功能——无路线图，无候补名单。',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: '电商平台格式——只需输入一次标题，所有列自动填充。',
    },
    exif: {
      label: '相机级 EXIF',
      gpsStripped: '— 已剥离 —',
    },
    langs: {
      label: '12 种语言 · 3 种 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: '为独立卖家打造',
      marketplaces: '电商平台',
      seoFields: '每张照片的 SEO 字段',
      devices: '设备 · 一个应用',
      noTrackers: '追踪器 · 广告 · 云端',
    },
  },
  seoDemo: {
    kicker: '互动 · 实时',
    title: '看 AI 填写 13 个 SEO 字段。',
    sub: '选一件商品。看 photoZseo 撰写电商平台所需的每一个字段——标题、Slug、类目、Meta、完整描述、Alt、标签、关键词与条形码。点击任意字段复制。',
    inputLabel: '商品名称',
    inputPlaceholder: '输入商品名称…',
    btnIdle: '✨ 自动填写 13 个 SEO 字段',
    btnBusy: '生成中…',
    note: '设备端 · 100% 私密 · 12 种语言',
    fieldLabels: {
      title: 'SEO 标题',
      slug: 'Slug',
      filename: '文件名 (URL)',
      category: '类目',
      meta: 'Meta 描述',
      description: '描述',
      alt: 'Alt 文本',
      tag1: '标签 1',
      tag2: '标签 2',
      tag3: '标签 3',
      tag4: '标签 4',
      keywords: '关键词',
      barcode: '条形码',
    },
  },
  stats: {
    kicker: '推动销量的数字',
    title: '由独立卖家设计。\n经 12 国买家验证。',
    labels: {
      marketplaces: '电商平台与渠道',
      seoFields: '每张照片的 SEO 字段',
      languages: '语言——含 RTL',
      zero: '广告。追踪器。采集的数据。',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: '永不追踪',
    },
  },
  pricing: {
    kicker: '价格',
    title: '更快卖货——无水印，无限制。',
    sub: '三档套餐，同一份 Pro 体验。年付订阅前 3 天免费，之后月均仅 $3.33——可随时在「设置」中取消。',
    badge: '最超值 · 节省 52%',
    plans: [
      {
        name: '周付',
        pricePer: '$2.99/周',
        features: [
          'Pro 完整权限',
          '试用一周',
          '可随时在「设置」中取消',
          '— 无长期承诺',
        ],
        cta: '开始周付',
      },
      {
        name: '月付',
        pricePer: '$6.99/月',
        features: [
          'Pro 完整权限',
          '按月计费，随时取消',
          '与年付功能完全一致',
          '— 选年付节省 52%',
        ],
        cta: '选择月付',
      },
      {
        name: '年付',
        pricePer: '$39.99/年',
        trial: '3 天免费试用 · 月均仅 $3.33 · 节省 52%',
        featured: true,
        features: [
          '所有导出 **去除水印**',
          '一次性 **批量导出** 所有照片',
          '46+ 电商平台 **CSV + XLSX**',
          '**视频 + Pro 工具**（相机工作室、抠背景）',
          'AI SEO 自动填充（13 个字段，12 种语言）',
          'B2B 报价生成器（VAT、IBAN、HS、电子签名）',
          'Stories 与智能贴纸',
          'EXIF 编辑器与元数据管线',
          'iPhone、iPad 与 Mac 通用',
          'iCloud Drive 同步',
        ],
        cta: '开始 3 天免费试用',
      },
    ],
    note: '价格以美元计。App Store 显示本地货币（例如土耳其为 ₺39.99/年）。支持家人共享。订阅将自动续订，除非在订阅周期结束前至少 24 小时取消——可在「设置 → Apple ID → 订阅」中管理。',
  },
  faq: {
    kicker: '问题',
    title: '你想问的一切。',
    items: [
      {
        q: 'photoZseo 没有网络也能用吗？',
        a: '可以。照片拍摄、编辑、AI SEO 自动填充、EXIF 与导出全部基于 Apple Foundation Models 和 Vision 在设备端运行，100% 本地。仅当你主动推送到远程电商平台时才需要联网。',
      },
      {
        q: '可以同时导出到 Amazon、Shopify 和 Etsy 吗？',
        a: '可以。选商品、选平台、点击导出。photoZseo 按每个平台的精确列顺序写入 CSV/XLSX/JSON，并附带各平台图片尺寸——按商品分开或合并为一个文件。',
      },
      {
        q: '我的照片或商品数据会上传到任何地方吗？',
        a: '不会。我们没有任何第三方分析、追踪 SDK 或云账号。唯一对外的网络连接是用于订阅的 App Store / RevenueCat，以及可选的 iCloud Drive 同步——它始终在你自己的 iCloud 内。',
      },
      {
        q: 'iPad 和 Mac 上能用吗，还是只有 iPhone？',
        a: '三者皆可。photoZseo 是通用应用——一次购买涵盖 iPhone、iPad 与 Mac（Catalyst）。iPad 与 Mac 上的拖放、多选、键盘快捷键与检查器面板都是一等公民。',
      },
      {
        q: '3 天免费试用到底包含什么？',
        a: '全部 Pro 功能。所有 46+ 电商平台格式、AI SEO 自动填充、B2B 报价生成器、Stories、EXIF 工具——年付套餐上享 3 天完全访问。如果你在试用期间通过「设置 → Apple ID → 订阅」取消，不会扣款。',
      },
      {
        q: '"46+" 到底是多少个平台？',
        a: '发布时：46 个电商平台预设（Amazon、Shopify、Etsy、eBay、Walmart、WooCommerce、Trendyol、AliExpress、Mercado Libre、Allegro、Temu、SHEIN、DHgate、Tmall、1688、Made-in-China、Global Sources…），外加社交/即时通讯格式（Instagram Shopping、TikTok Shop、Pinterest、WhatsApp、Telegram、WeChat、RED、Stories）。新预设将在更新中加入。',
      },
      {
        q: '导出的照片会包含我的 GPS 位置吗？',
        a: '不会。photoZseo 默认在导出时剥离 GPS 数据。其他 EXIF——Artist、Copyright、Software、尺寸、相机——会被保留并可内联编辑。控制权在你手中。',
      },
      {
        q: '是否符合 GDPR / KVKK / CCPA？',
        a: '符合——而且应用会说你的语言：英语、土耳其语、德语、西班牙语、法语、葡萄牙语、日语、韩语、中文、阿拉伯语、印地语和波斯语。阿拉伯语、乌尔都语和波斯语的 RTL 布局是一等公民。',
      },
      {
        q: '可以导入现有的商品列表吗？',
        a: '可以。支持 CSV、TSV、XLSX、JSON、照片 URL 与批量照片文件夹。内置 41+ 平台导入模板。',
      },
    ],
  },
  finalCta: {
    h2: '你的下一单，从一张照片开始。',
    p: '免费起步。无追踪。无广告。随时取消。为独立卖家打造。',
    note: '即将登陆 App Store。',
    notify: '上线时通知我',
  },
  footer: {
    tag: '一张照片，畅销 46+ 电商平台。',
    privacy: '隐私', terms: '条款', support: '支持',
    accessibility: '无障碍', deleteAccount: '删除账号',
    rights: '保留所有权利。为独立卖家打造。',
  },
};

export default zh;
