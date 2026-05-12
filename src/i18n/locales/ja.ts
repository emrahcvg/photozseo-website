import type { HomeContent } from '../home';

const ja: HomeContent = {
  nav: {
    features: '機能', pricing: '料金', faq: 'よくある質問',
    blog: 'ブログ', support: 'サポート', getApp: 'アプリを入手',
  },
  hero: {
    eyebrow: 'iPhone · iPad · Mac に対応',
    h1Line1Words: ['一度', '登録。'],
    h1Line2Words: ['46+', 'のマーケットで', '販売。'],
    h1A11y: '一度登録。46+ のマーケットで販売。',
    sub: 'スタジオ品質の商品写真、AI が書く SEO、B2B 見積もり、プラットフォーム最適化されたエクスポート — すべて iPhone から。パソコン不要。スプレッドシート不要。クラウド不要。',
    btnAppSmall: 'ダウンロード',
    btnAppBig: 'App Store',
    ctaTrial: '3 日間の無料トライアル',
    ctaCard: 'カード登録不要 · いつでも解約可',
    bullets: [
      'アスペクト比を選ぶだけ — JPEG、PNG、WebP を同時に書き出し',
      'AI が一枚の写真から 9 つの SEO 項目を自動入力',
      '46+ のマーケットへワンタップ · 100% オンデバイス · オフライン対応',
    ],
  },
  pain: {
    kicker: 'なぜ存在するのか',
    title: '各マーケットでの販売は壊れている。',
    sub: 'あなたはセラーであって、Photoshop の技術者ではありません。photoZseo はその時間を取り戻します。',
    cards: [
      {
        bad: '「各プラットフォーム向けに写真を編集するだけで夜が終わる。」',
        goodTitle: 'AI が 2 秒で完了。',
        goodDesc: '背景検出、トリミング、ホワイトバランス、エクスポートサイズ — 各プラットフォームへ自動対応。',
      },
      {
        bad: '「マーケットごとにタイトル、タグ、説明文を打ち直している。」',
        goodTitle: '一枚の写真。13 の SEO 項目。自動入力。',
        goodDesc: 'タイトル、スラッグ、メタ、alt テキスト、キーワード — オンデバイス AI が 12 言語で生成。',
      },
      {
        bad: '「B2B 見積もりが恥ずかしい Word ファイル。」',
        goodTitle: 'ブランド入り PDF を 3 ステップで。',
        goodDesc: 'VAT、IBAN、HS コード、電子署名、金額の漢数字表記 — Fortune 500 のインボイスのような仕上がり。',
      },
    ],
  },
  features: {
    sectionKicker: 'すべての機能を、一度のスクロールで',
    sectionTitle: '10 の機能。1 回のスワイプ。',
    sectionSub: '横スクロール。モバイルでは縦スタイル。',
    seeInAction: '動作を見る →',
    items: [
      {
        eyebrow: '46+ マーケットプレイス',
        h: '一度登録。どこでも販売。',
        sub: '一枚の写真が 46+ のマーケット用リスティングに — 各プラットフォーム向けにサイズ調整、命名、SEO タグ付け。',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'クロスボーダー：Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — 商品ごと別ファイルまたは結合ファイル',
        ],
      },
      {
        eyebrow: 'AI カメラ · ワンショットで全フォーマット',
        h: 'シャッター一押し。すべてのフォーマットを同時に。',
        sub: 'アスペクト比を選択 (1:1、4:5、9:16、3:4)。シャッターを 1 回押すだけで、photoZseo が JPEG、PNG、WebP を並行して書き出し、各マーケットプレイス用にリサイズします。撮り直し不要、一括書き出し不要。',
        bullets: [
          '1 回の撮影 → JPEG + PNG + WebP を同時保存',
          '書き出し時にプラットフォーム別リサイズ：Amazon、Shopify、Etsy、Instagram…',
          'AE ロック · WB オート · 背景検出 · 被写体自動センタリング',
          '連写、音量ボタンシャッター、グリッド + 水準器 · 100% オフライン',
        ],
      },
      {
        eyebrow: 'AI SEO 自動入力',
        h: '13 項目を数秒で自動入力。',
        sub: '写真を 1 枚ドロップ。photoZseo がタイトル、スラッグ、メタディスクリプション、alt テキスト、タグ、キーワードを瞬時に SEO 最適化して書き出します。',
        bullets: [
          'オンデバイス OCR + Vision：バーコード、ブランド、素材、色',
          'SEO 品質のタイトル、スラッグ、メタ、alt テキスト、ロングテールキーワード',
          '12 言語 — ロケールに合った出力',
        ],
      },
      {
        eyebrow: 'B2B 見積もりビルダー',
        h: 'ブランド入り PDF 見積もりを 3 ステップで。',
        sub: '商品を選び、購入者を追加し、共有。VAT、IBAN、Incoterms、HS コード、電子署名 — すべてが美しくブランディングされた PDF に。',
        bullets: [
          '行ごとの VAT · 単位 · HS コード · 原産国',
          'ロゴ、IBAN、Incoterms 付きの送信者プロフィール — 一度保存すれば再利用',
          '金額の文字表記、電子署名、連番の見積もり ID',
        ],
      },
      {
        eyebrow: '売れるストーリーズ',
        h: 'WhatsApp、Telegram、Instagram — ワンタップ。',
        sub: '連絡先ごとにステータス／ストーリーズのキューを構築。Instagram は 9:16、WeChat は 1:1、RED は 3:4 — 自動フォーマット。',
        bullets: [
          'スマートステッカー：価格、バッジ、割引、新着',
          '連絡先ごとに 7 日間のクールダウン付きラウンドロビンキュー',
          'ストーリーズ、カタログへの共有、またはローカル保存',
        ],
      },
      {
        eyebrow: '商品詳細',
        h: 'プロのように管理。',
        sub: '一つの商品、すべてのチャネル。写真、価格、SEO、EXIF、ストーリーズが美しく整理された 1 つのレコードに。',
        bullets: [
          '写真カルーセル、メディアインスペクター、EXIF インラインエディター',
          '商品ごとのマークアップ、MSRP、B2B 価格、VAT モード',
          '見積もり、ストーリー、カタログ、マーケットプレイスへのクイック共有',
        ],
      },
      {
        eyebrow: 'プロ仕様のメタデータ',
        h: '全ショットがカメラ品質の EXIF。',
        sub: 'EXIF、寸法、フォーマットを各プラットフォーム用に書き出し。GPS は自動で削除。IPTC と Artist タグは保持。',
        bullets: [
          '9 つの EXIF 項目をインライン編集可能 (Artist、Copyright、Software…)',
          'エクスポート時に GPS データをデフォルトで削除 — プライバシーを最優先',
          '各ショットを JPEG + PNG + WebP へ一括保存 — 再エクスポート不要、画質劣化なし',
        ],
      },
      {
        eyebrow: 'ユニバーサルアプリ',
        h: 'iPhone。iPad。Mac。',
        sub: 'iOS 17+、iPadOS、Mac Catalyst 対応。ドラッグ、ドロップ、マルチセレクト、サイドバー、インスペクター — iCloud Drive で同期。',
        bullets: [
          'iPad と Mac でドラッグ＆ドロップ · マルチセレクトでエクスポート',
          'キーボードショートカット、右クリックメニュー、サイドバーナビゲーション',
          'iCloud Drive 同期 — すべてのデバイスで、決して失わない',
        ],
      },
      {
        eyebrow: 'プライバシーファースト',
        h: 'トラッキングなし。広告なし。クラウドなし。',
        sub: 'クラウドを信用しないセラーのために作られました。GDPR、KVKK、CCPA に準拠。4 つの RTL を含む 12 言語対応。',
        bullets: [
          'GDPR · KVKK · CCPA — アナリティクスなし、サードパーティ SDK なし',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'AI はオンデバイスで動作 — 写真は決して外に出ません',
        ],
      },
      {
        eyebrow: '料金',
        h: '無料で開始。準備ができたら Pro へ。',
        sub: '無料で始められます。すべてのマーケットへエクスポートする準備ができたら Pro へ。いつでも解約可、トライアルにカード不要。',
        bullets: [
          'キャプチャ、整理、基本エクスポートは永久無料',
          'Pro なら 46+ マーケットフォーマット、AI SEO、B2B 見積もり',
          '3 日間無料トライアル · $39.99/年 · 月額 $3.33 相当',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'スクリーンショット以上のもの',
    headTitle: 'パワーツールのように作り、アプリの価格で。',
    headSub: '以下のセクションはすべて、今日リリース済みの機能です — ロードマップなし、ウェイトリストなし。',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: 'マーケットフォーマット — タイトルを 1 回入力するだけで、全カラムが埋まります。',
    },
    exif: {
      label: 'カメラ品質の EXIF',
      gpsStripped: '— 削除済み —',
    },
    langs: {
      label: '12 言語 · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: 'インディーセラーのために設計',
      marketplaces: 'マーケットプレイス',
      seoFields: '写真 1 枚あたりの SEO 項目',
      devices: 'デバイス · 1 つのアプリ',
      noTrackers: 'トラッカー · 広告 · クラウド',
    },
  },
  seoDemo: {
    kicker: 'インタラクティブ · ライブ',
    title: 'AI が 13 の SEO 項目を埋める様子を見てください。',
    sub: '商品を選ぶと、photoZseo がマーケットに必要な各項目を書き出します — タイトル、スラッグ、カテゴリー、メタ、フル説明、alt、タグ、キーワード、バーコード。タップしてコピー。',
    inputLabel: '商品名',
    inputPlaceholder: '商品名を入力…',
    btnIdle: '✨ 13 の SEO 項目を自動入力',
    btnBusy: '生成中…',
    note: 'オンデバイス · 100% プライベート · 12 言語',
    fieldLabels: {
      title: 'SEO タイトル',
      slug: 'スラッグ',
      filename: 'ファイル名 (URL)',
      category: 'カテゴリー',
      meta: 'メタディスクリプション',
      description: '説明',
      alt: 'alt テキスト',
      tag1: 'タグ 1',
      tag2: 'タグ 2',
      tag3: 'タグ 3',
      tag4: 'タグ 4',
      keywords: 'キーワード',
      barcode: 'バーコード',
    },
  },
  stats: {
    kicker: '売上を動かす数字',
    title: 'インディーセラーが設計。\n12 か国の購入者がテスト。',
    labels: {
      marketplaces: 'マーケットプレイスとチャネル',
      seoFields: '写真 1 枚あたりの SEO 項目',
      languages: '言語 — RTL を含む',
      zero: '広告。トラッカー。収集データ。',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'トラッキングは一切なし',
    },
  },
  pricing: {
    kicker: '料金',
    title: 'もっと早く売る — ウォーターマークなし、制限なし。',
    sub: '3 つのプラン、1 つの Pro 体験。年間プランを 3 日間無料で試して、その後は月額 $3.33 相当 — いつでも設定からキャンセル可能。',
    badge: 'ベストバリュー · 52% お得',
    plans: [
      {
        name: 'ウィークリー',
        pricePer: '$2.99/週',
        features: [
          'Pro フルアクセス',
          '1 週間お試し',
          '設定からいつでもキャンセル',
          '— 長期契約なし',
        ],
        cta: 'ウィークリーを開始',
      },
      {
        name: '月額',
        pricePer: '$6.99/月',
        features: [
          'Pro フルアクセス',
          '月額請求、いつでもキャンセル可',
          '年間プランと同じ機能',
          '— 年間プランで 52% お得',
        ],
        cta: '月額を選択',
      },
      {
        name: '年間',
        pricePer: '$39.99/年',
        trial: '3 日間無料トライアル · 月額 $3.33 相当 · 52% お得',
        featured: true,
        features: [
          'すべてのエクスポートで **ウォーターマーク削除**',
          'すべての写真を一括 **バッチエクスポート**',
          '46+ マーケットプレイス向け **CSV + XLSX**',
          '**動画 + Pro ツール** (カメラスタジオ、背景除去)',
          'AI SEO 自動入力 (13 項目、12 言語)',
          'B2B 見積もりビルダー (VAT、IBAN、HS、電子署名)',
          'ストーリーズとスマートステッカー',
          'EXIF エディターとメタデータパイプライン',
          'iPhone、iPad、Mac ユニバーサル',
          'iCloud Drive 同期',
        ],
        cta: '3 日間無料トライアルを開始',
      },
    ],
    note: '価格は USD 表示。App Store ではローカル価格 (例: トルコでは ₺39.99/年)。ファミリー共有対応。サブスクリプションは期間終了の 24 時間以上前にキャンセルしない限り自動更新されます — 設定 → Apple ID → サブスクリプションで管理してください。',
  },
  faq: {
    kicker: '質問',
    title: '聞きたかったことのすべて。',
    items: [
      {
        q: 'photoZseo はインターネットなしで動作しますか？',
        a: 'はい。写真撮影、編集、AI SEO 自動入力、EXIF、エクスポートはすべて Apple Foundation Models と Vision を使って 100% オンデバイスで動作します。インターネットはリモートのマーケットへ能動的にプッシュするときだけ必要です。',
      },
      {
        q: 'Amazon、Shopify、Etsy へ同時にエクスポートできますか？',
        a: 'はい。商品を選び、プラットフォームを選び、エクスポートを押すだけ。photoZseo は各プラットフォームの正確なカラム順で CSV/XLSX/JSON を書き出し、プラットフォームごとの画像サイズも生成します — 商品ごと別ファイルまたは結合ファイルで。',
      },
      {
        q: '写真や商品データはどこかにアップロードされますか？',
        a: 'いいえ。サードパーティのアナリティクスもトラッキング SDK もクラウドアカウントもゼロです。外向きのネットワークはサブスクリプション用の App Store / RevenueCat と、オプションの iCloud Drive 同期 (自分の iCloud 内に留まる) のみです。',
      },
      {
        q: 'iPad と Mac でも動作しますか、それとも iPhone だけですか？',
        a: '3 つすべて対応です。photoZseo はユニバーサルアプリ — 同じ購入で iPhone、iPad、Mac (Catalyst) をカバー。ドラッグ＆ドロップ、マルチセレクト、キーボードショートカット、インスペクターパネルは iPad と Mac でファーストクラスです。',
      },
      {
        q: '3 日間無料トライアルには実際に何が含まれますか？',
        a: 'Pro のすべてです。46+ マーケットフォーマット、AI SEO 自動入力、B2B 見積もりビルダー、ストーリーズ、EXIF ツール — 年間プランで 3 日間フルアクセス。トライアル中に設定 → Apple ID → サブスクリプションでキャンセルすれば、課金されません。',
      },
      {
        q: '「46+」とは正確に何プラットフォームですか？',
        a: 'ローンチ時：46 のマーケットプリセット (Amazon、Shopify、Etsy、eBay、Walmart、WooCommerce、Trendyol、AliExpress、Mercado Libre、Allegro、Temu、SHEIN、DHgate、Tmall、1688、Made-in-China、Global Sources…)、加えてソーシャル／メッセージングフォーマット (Instagram Shopping、TikTok Shop、Pinterest、WhatsApp、Telegram、WeChat、RED、Stories)。新しいプリセットはアップデートで追加されます。',
      },
      {
        q: 'エクスポートした写真に GPS 位置情報は含まれますか？',
        a: 'いいえ。photoZseo はエクスポート時に GPS データをデフォルトで削除します。Artist、Copyright、Software、寸法、カメラなど他の EXIF は保持され、インラインで編集可能です。コントロールはあなたの手に。',
      },
      {
        q: 'GDPR / KVKK / CCPA に準拠していますか？',
        a: 'はい — そしてアプリはあなたの言語を話します：英語、トルコ語、ドイツ語、スペイン語、フランス語、ポルトガル語、日本語、韓国語、中国語、アラビア語、ヒンディー語、ペルシャ語。アラビア語、ウルドゥー語、ペルシャ語の RTL レイアウトはファーストクラスです。',
      },
      {
        q: '既存の商品リストをインポートできますか？',
        a: 'はい。CSV、TSV、XLSX、JSON、写真 URL、写真フォルダの一括インポートすべてに対応。41+ のプラットフォーム用インポートテンプレートを内蔵。',
      },
    ],
  },
  finalCta: {
    h2: '次の販売は、1 枚の写真から始まります。',
    p: '無料で開始。トラッキングなし。広告なし。いつでも解約可。インディーセラーのために作られました。',
    note: 'App Store に近日公開。',
    notify: 'リリース時に通知',
  },
  footer: {
    tag: '1 枚の写真から 46+ のマーケットで販売。',
    privacy: 'プライバシー', terms: '利用規約', support: 'サポート',
    accessibility: 'アクセシビリティ', deleteAccount: 'アカウント削除',
    rights: 'All rights reserved. インディーセラーのために作られました。',
  },
};

export default ja;
