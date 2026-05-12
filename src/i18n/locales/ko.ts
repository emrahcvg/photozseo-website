import type { HomeContent } from '../home';

const ko: HomeContent = {
  nav: {
    features: '기능', pricing: '요금', faq: 'FAQ',
    blog: '블로그', support: '지원', getApp: '앱 받기',
  },
  hero: {
    eyebrow: '이제 iPhone · iPad · Mac에서 사용 가능',
    h1Line1Words: ['한 번', '등록.'],
    h1Line2Words: ['46+', '마켓플레이스에서', '판매.'],
    h1A11y: '한 번 등록. 46+ 마켓플레이스에서 판매.',
    sub: '스튜디오급 상품 사진, AI가 작성한 SEO, B2B 견적서, 플랫폼별 완벽한 내보내기 — 모두 iPhone에서. 컴퓨터 불필요. 스프레드시트 불필요. 클라우드 불필요.',
    btnAppSmall: '다운로드',
    btnAppBig: 'App Store',
    ctaTrial: '3일 무료 체험',
    ctaCard: '카드 불필요 · 언제든 취소',
    bullets: [
      '비율을 선택하세요 — JPEG, PNG, WebP가 함께 내보내집니다',
      'AI가 사진 한 장에서 13개 SEO 필드를 자동 작성',
      '46+ 마켓플레이스, 한 번의 탭 · 100% 기기 내 처리 · 오프라인 작동',
    ],
  },
  pain: {
    kicker: '왜 만들었나',
    title: '모든 마켓플레이스에서의 판매는 망가져 있습니다.',
    sub: '당신은 판매자이지, Photoshop 기술자가 아닙니다. photoZseo가 그 시간을 돌려드립니다.',
    cards: [
      {
        bad: '"플랫폼마다 사진 편집하느라 저녁 시간이 다 사라져요."',
        goodTitle: 'AI가 2초 만에 처리합니다.',
        goodDesc: '배경 감지, 크롭, 화이트 밸런스, 내보내기 크기 — 모든 플랫폼에 자동으로.',
      },
      {
        bad: '"마켓플레이스마다 제목, 태그, 설명을 다시 입력해요."',
        goodTitle: '사진 한 장. SEO 13개 필드. 자동 입력.',
        goodDesc: '제목, 슬러그, 메타, 대체 텍스트, 키워드 — 기기 내 AI가 12개 언어로 작성합니다.',
      },
      {
        bad: '"제 B2B 견적서는 부끄러운 Word 문서예요."',
        goodTitle: '3단계로 브랜드 PDF.',
        goodDesc: 'VAT, IBAN, HS 코드, 전자 서명, 금액 한글 표기 — Fortune 500급 인보이스처럼 보입니다.',
      },
    ],
  },
  features: {
    sectionKicker: '모든 기능, 한 번의 스크롤로',
    sectionTitle: '10가지 기능. 한 번의 스와이프.',
    sectionSub: '가로로 스크롤하세요. 모바일에서는 세로 스타일.',
    seeInAction: '실제 작동 보기 →',
    items: [
      {
        eyebrow: '46+ 마켓플레이스',
        h: '한 번 등록. 어디서나 판매.',
        sub: '사진 한 장이 46+ 마켓플레이스 준비 리스팅이 됩니다 — 모든 플랫폼에 맞춰 크기 조정, 명명, SEO 태깅.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          '크로스보더: Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — 제품별 분리 또는 통합',
        ],
      },
      {
        eyebrow: 'AI 카메라 · 한 번의 촬영, 모든 포맷',
        h: '셔터 한 번. 모든 포맷을 동시에.',
        sub: '비율을 선택하세요 (1:1, 4:5, 9:16 또는 3:4). 셔터를 한 번만 누르면 photoZseo가 JPEG, PNG, WebP를 병렬로 작성하고 각 마켓플레이스에 맞게 크기를 조정합니다. 재촬영 불필요, 일괄 내보내기 불필요.',
        bullets: [
          '한 번 촬영 → JPEG + PNG + WebP, 함께 저장',
          '내보내기 시 플랫폼별 리사이즈: Amazon, Shopify, Etsy, Instagram…',
          'AE 잠금 · WB 자동 · 배경 감지 · 피사체 자동 중앙 정렬',
          '연사, 볼륨 버튼 셔터, 그리드 + 수평 오버레이 · 100% 오프라인',
        ],
      },
      {
        eyebrow: 'AI SEO 자동 입력',
        h: '몇 초 만에 13개 필드 자동 입력.',
        sub: '사진 한 장을 넣으세요. photoZseo가 제목, 슬러그, 메타 설명, 대체 텍스트, 태그와 키워드를 검색 최적화하여 즉시 작성합니다.',
        bullets: [
          '기기 내 OCR + Vision: 바코드, 브랜드, 소재, 색상',
          'SEO급 제목, 슬러그, 메타, 대체 텍스트와 롱테일 키워드',
          '12개 언어 — 로케일 정확한 결과물',
        ],
      },
      {
        eyebrow: 'B2B 견적 빌더',
        h: '3단계로 브랜드 PDF 견적.',
        sub: '제품 선택, 구매자 추가, 공유. VAT, IBAN, Incoterms, HS 코드와 전자 서명 — 모두 아름답게 브랜드화된 PDF에.',
        bullets: [
          '라인별 VAT · 단위 · HS 코드 · 원산지',
          '로고, IBAN, Incoterms가 포함된 발신자 프로필 — 한 번만 저장',
          '금액 한글 표기, 전자 서명, 순차 견적 ID',
        ],
      },
      {
        eyebrow: '판매를 만드는 스토리',
        h: 'WhatsApp, Telegram, Instagram — 한 번의 탭.',
        sub: '모든 연락처에 대한 스테이터스 / 스토리 큐를 구축하세요. Instagram용 9:16, WeChat용 1:1, RED용 3:4 — 자동 포맷.',
        bullets: [
          '스마트 스티커: 가격, 배지, 할인, 신상',
          '연락처별 7일 쿨다운이 적용된 라운드 로빈 큐',
          '스토리, 카탈로그로 공유 또는 로컬 저장',
        ],
      },
      {
        eyebrow: '상품 상세',
        h: '프로처럼 관리하세요.',
        sub: '하나의 제품, 모든 채널. 사진, 가격, SEO, EXIF와 스토리가 아름답게 정리된 단일 레코드 안에 존재합니다.',
        bullets: [
          '사진 캐러셀, 미디어 인스펙터, EXIF 인라인 에디터',
          '제품별 마크업, MSRP, B2B 가격, VAT 모드',
          'Quote, Story, Catalog 또는 Marketplace로 빠른 공유',
        ],
      },
      {
        eyebrow: '프로 메타데이터',
        h: '카메라급 EXIF, 모든 사진.',
        sub: '모든 플랫폼에 맞게 EXIF, 크기와 포맷이 작성됩니다. GPS는 자동으로 제거. IPTC와 Artist 태그는 보존.',
        bullets: [
          'EXIF 9개 필드 인라인 편집 가능 (Artist, Copyright, Software…)',
          '기본적으로 내보내기 시 GPS 데이터 제거 — 프라이버시 최우선',
          '모든 사진을 JPEG + PNG + WebP로 한 번에 저장 — 재내보내기 불필요, 품질 손실 없음',
        ],
      },
      {
        eyebrow: '유니버설 앱',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS, Mac Catalyst. 드래그, 드롭, 다중 선택, 사이드바, 인스펙터 — iCloud Drive를 통해 동기화.',
        bullets: [
          'iPad와 Mac에서 드래그 앤 드롭 · 다중 선택 내보내기',
          '키보드 단축키, 우클릭 메뉴, 사이드바 내비게이션',
          'iCloud Drive 동기화 — 모든 기기, 절대 잃지 않음',
        ],
      },
      {
        eyebrow: '프라이버시 최우선',
        h: '추적 없음. 광고 없음. 클라우드 없음.',
        sub: '클라우드를 신뢰하지 않는 판매자를 위해 만들어졌습니다. GDPR, KVKK, CCPA 준수. 4개 RTL 스크립트를 포함한 12개 언어.',
        bullets: [
          'GDPR · KVKK · CCPA — 분석 없음, 서드파티 SDK 없음',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'AI는 기기 내에서 실행 — 당신의 사진은 절대 떠나지 않습니다',
        ],
      },
      {
        eyebrow: '요금',
        h: '무료로 시작. 준비되면 Pro로.',
        sub: '무료로 시작하세요. 모든 마켓플레이스로 내보낼 준비가 되었을 때만 업그레이드. 언제든 취소, 체험에는 카드 불필요.',
        bullets: [
          '캡처, 정리, 기본 내보내기는 영원히 무료',
          'Pro는 46+ 마켓플레이스 포맷, AI SEO, B2B 견적 추가',
          '3일 무료 체험 · $39.99/년 · 월 $3.33 상당',
        ],
      },
    ],
  },
  bento: {
    headKicker: '스크린샷 그 이상',
    headTitle: '파워 툴처럼 만들고, 앱처럼 가격을 매겼습니다.',
    headSub: '아래의 모든 섹션은 오늘 출시되는 기능입니다 — 로드맵 없음, 대기 명단 없음.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: '마켓플레이스 포맷 — 제목을 한 번만 입력하면 모든 열이 채워집니다.',
    },
    exif: {
      label: '카메라급 EXIF',
      gpsStripped: '— 제거됨 —',
    },
    langs: {
      label: '12개 언어 · 3개 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: '인디 판매자를 위해 제작',
      marketplaces: '마켓플레이스',
      seoFields: '사진당 SEO 필드',
      devices: '기기 · 하나의 앱',
      noTrackers: '추적기 · 광고 · 클라우드',
    },
  },
  seoDemo: {
    kicker: '인터랙티브 · 라이브',
    title: 'AI가 13개 SEO 필드를 채우는 것을 보세요.',
    sub: '제품을 선택하세요. photoZseo가 마켓플레이스에 필요한 모든 필드를 작성하는 것을 보세요 — 제목, 슬러그, 카테고리, 메타, 전체 설명, 대체 텍스트, 태그, 키워드와 바코드. 탭하여 복사.',
    inputLabel: '제품명',
    inputPlaceholder: '제품명을 입력하세요…',
    btnIdle: '✨ 13개 SEO 필드 자동 입력',
    btnBusy: '생성 중…',
    note: '기기 내 처리 · 100% 비공개 · 12개 언어',
    fieldLabels: {
      title: 'SEO 제목',
      slug: '슬러그',
      filename: '파일명 (URL)',
      category: '카테고리',
      meta: '메타 설명',
      description: '설명',
      alt: '대체 텍스트',
      tag1: '태그 1',
      tag2: '태그 2',
      tag3: '태그 3',
      tag4: '태그 4',
      keywords: '키워드',
      barcode: '바코드',
    },
  },
  stats: {
    kicker: '제품을 움직이는 숫자',
    title: '인디 판매자가 설계.\n12개국의 구매자가 테스트.',
    labels: {
      marketplaces: '마켓플레이스 & 채널',
      seoFields: '사진당 SEO 필드',
      languages: '언어 — RTL 포함',
      zero: '광고. 추적기. 수집된 데이터.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: '추적 절대 없음',
    },
  },
  pricing: {
    kicker: '요금',
    title: '더 빠르게 판매 — 워터마크 없음, 한도 없음.',
    sub: '세 가지 플랜, 하나의 Pro 경험. 연간 플랜을 3일 동안 무료로 체험하고, 그 이후엔 월 $3.33 상당 — 설정에서 언제든 취소할 수 있습니다.',
    badge: '최고의 가치 · 52% 절약',
    plans: [
      {
        name: '주간',
        pricePer: '$2.99/주',
        features: [
          'Pro 전체 액세스',
          '일주일 동안 체험',
          '설정에서 언제든 취소',
          '— 장기 약정 없음',
        ],
        cta: '주간 시작',
      },
      {
        name: '월간',
        pricePer: '$6.99/월',
        features: [
          'Pro 전체 액세스',
          '월간 결제, 언제든 취소',
          '연간과 동일한 기능',
          '— 연간 결제로 52% 절약',
        ],
        cta: '월간 선택',
      },
      {
        name: '연간',
        pricePer: '$39.99/년',
        trial: '3일 무료 체험 · 월 $3.33 상당 · 52% 절약',
        featured: true,
        features: [
          '모든 내보내기에서 **워터마크 제거**',
          '모든 사진을 한 번에 **일괄 내보내기**',
          '46+ 마켓플레이스용 **CSV + XLSX**',
          '**비디오 + Pro 도구** (카메라 스튜디오, 배경 제거)',
          'AI SEO 자동 입력 (13개 필드, 12개 언어)',
          'B2B 견적 빌더 (VAT, IBAN, HS, 전자 서명)',
          '스토리 & 스마트 스티커',
          'EXIF 에디터 & 메타데이터 파이프라인',
          'iPhone, iPad & Mac 유니버설',
          'iCloud Drive 동기화',
        ],
        cta: '3일 무료 체험 시작',
      },
    ],
    note: 'USD 기준 가격. App Store의 현지 가격 적용 (예: 튀르키예에서 ₺39.99/년). 가족 공유 지원. 구독은 기간 종료 최소 24시간 전에 취소하지 않으면 자동 갱신됩니다 — 설정 → Apple ID → 구독에서 관리.',
  },
  faq: {
    kicker: '질문',
    title: '궁금하셨던 모든 것.',
    items: [
      {
        q: 'photoZseo는 인터넷 없이 작동하나요?',
        a: '네. 사진 캡처, 편집, AI SEO 자동 입력, EXIF와 내보내기 모두 Apple Foundation Models과 Vision을 사용해 100% 기기 내에서 실행됩니다. 인터넷은 원격 마켓플레이스로 적극적으로 푸시할 때만 필요합니다.',
      },
      {
        q: 'Amazon, Shopify와 Etsy로 동시에 내보낼 수 있나요?',
        a: '네. 제품 선택, 플랫폼 선택, 내보내기. photoZseo는 각 플랫폼의 정확한 열 순서로 CSV/XLSX/JSON을 작성하고, 플랫폼별 이미지 크기 — 제품별 분리 또는 통합 파일로 제공합니다.',
      },
      {
        q: '제 사진이나 제품 데이터가 어딘가에 업로드되나요?',
        a: '아니요. 서드파티 분석이 전혀 없고, 추적 SDK가 전혀 없으며, 클라우드 계정이 없습니다. 유일한 외부 네트워크는 구독을 위한 App Store / RevenueCat과, 본인의 iCloud 안에 머무는 선택적 iCloud Drive 동기화뿐입니다.',
      },
      {
        q: 'iPad와 Mac에서 작동하나요, 아니면 iPhone 전용인가요?',
        a: '세 가지 모두. photoZseo는 유니버설 앱입니다 — 동일한 구매로 iPhone, iPad와 Mac (Catalyst)을 모두 커버합니다. 드래그 앤 드롭, 다중 선택, 키보드 단축키와 인스펙터 패널은 iPad와 Mac에서 일급 기능입니다.',
      },
      {
        q: '3일 무료 체험에는 실제로 무엇이 포함되나요?',
        a: '모든 Pro 기능. 46+ 마켓플레이스 포맷, AI SEO 자동 입력, B2B 견적 빌더, 스토리, EXIF 도구 — 연간 플랜에서 3일간 완전 액세스. 체험 중에 설정 → Apple ID → 구독에서 취소하면 청구되지 않습니다.',
      },
      {
        q: '"46+"는 정확히 몇 개의 플랫폼인가요?',
        a: '출시 시점: 46개 마켓플레이스 프리셋 (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…)과 소셜/메시징 포맷 (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). 새로운 프리셋은 업데이트로 추가됩니다.',
      },
      {
        q: '내 GPS 위치가 내보낸 사진에 포함되나요?',
        a: '아니요. photoZseo는 기본적으로 내보내기 시 GPS 데이터를 제거합니다. 기타 EXIF — Artist, Copyright, Software, 크기, 카메라 — 는 보존되며 인라인 편집 가능합니다. 당신이 제어합니다.',
      },
      {
        q: 'GDPR / KVKK / CCPA를 준수하나요?',
        a: '네 — 그리고 앱은 당신의 언어를 사용합니다: 영어, 터키어, 독일어, 스페인어, 프랑스어, 포르투갈어, 일본어, 한국어, 중국어, 아랍어, 힌디어, 페르시아어. 아랍어, 우르두어, 페르시아어용 RTL 레이아웃이 일급 기능입니다.',
      },
      {
        q: '기존 제품 목록을 가져올 수 있나요?',
        a: '네. CSV, TSV, XLSX, JSON, 사진 URL과 대량 사진 폴더 모두 지원됩니다. 41+ 플랫폼 가져오기 템플릿이 포함되어 있습니다.',
      },
    ],
  },
  finalCta: {
    h2: '당신의 다음 판매는 한 장의 사진으로 시작됩니다.',
    p: '무료로 시작. 추적 없음. 광고 없음. 언제든 취소. 인디 판매자를 위해 제작.',
    note: 'App Store에 곧 출시됩니다.',
    notify: '출시 시 알려주세요',
  },
  footer: {
    tag: '사진 한 장으로 46+ 마켓플레이스에서 판매.',
    privacy: '개인정보', terms: '약관', support: '지원',
    accessibility: '접근성', deleteAccount: '계정 삭제',
    rights: '모든 권리 보유. 독립 판매자를 위해 제작.',
  },
};

export default ko;
