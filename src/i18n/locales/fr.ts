import type { HomeContent } from '../home';

const fr: HomeContent = {
  nav: {
    features: 'Fonctionnalités', pricing: 'Tarifs', faq: 'FAQ',
    blog: 'Blog', support: 'Support', getApp: 'Télécharger l\'app',
  },
  hero: {
    eyebrow: 'Maintenant sur iPhone · iPad · Mac',
    h1Line1Words: ['Publie', 'une', 'fois.'],
    h1Line2Words: ['Vends', 'sur', '46+', 'marketplaces.'],
    h1A11y: 'Publie une fois. Vends sur 46+ marketplaces.',
    sub: 'Photos produit de qualité studio, SEO rédigé par IA, devis B2B et exports parfaits pour chaque plateforme — tout depuis ton iPhone. Pas d\'ordinateur. Pas de tableur. Pas de cloud.',
    btnAppSmall: 'Télécharger dans l\'',
    btnAppBig: 'App Store',
    ctaTrial: '3 jours d\'essai gratuit',
    ctaCard: 'Sans carte · Annule à tout moment',
    bullets: [
      'Choisis ton ratio — JPEG, PNG et WebP exportés ensemble',
      'L\'IA remplit 13 champs SEO depuis une seule photo',
      '46+ marketplaces, en un toucher · 100 % sur l\'appareil · fonctionne hors ligne',
    ],
  },
  pain: {
    kicker: 'Pourquoi cette app existe',
    title: 'Vendre sur chaque marketplace est cassé.',
    sub: 'Tu es un vendeur, pas un technicien Photoshop. photoZseo te rend ces heures.',
    cards: [
      {
        bad: '« Retoucher les photos pour chaque plateforme prend toute ma soirée. »',
        goodTitle: 'L\'IA le fait en 2 secondes.',
        goodDesc: 'Détection d\'arrière-plan, cadrage, balance des blancs, formats d\'export — chaque plateforme, automatiquement.',
      },
      {
        bad: '« Je retape le titre, les tags et la description pour chaque marketplace. »',
        goodTitle: 'Une photo. 13 champs SEO. Remplis.',
        goodDesc: 'Titre, slug, méta, texte alt, mots-clés — rédigés par l\'IA embarquée en 12 langues.',
      },
      {
        bad: '« Mes devis B2B sont un document Word gênant. »',
        goodTitle: 'Des PDF brandés en 3 étapes.',
        goodDesc: 'VAT, IBAN, codes HS, signature électronique, montant en lettres — on dirait une facture du Fortune 500.',
      },
    ],
  },
  features: {
    sectionKicker: 'Chaque fonctionnalité, en un seul scroll',
    sectionTitle: 'Dix fonctionnalités. Un balayage.',
    sectionSub: 'Défile horizontalement. Mode vertical sur mobile.',
    seeInAction: 'Voir en action →',
    items: [
      {
        eyebrow: '46+ Marketplaces',
        h: 'Publie une fois. Vends partout.',
        sub: 'Une photo devient 46+ annonces prêtes pour les marketplaces — dimensionnées, nommées et taguées SEO pour chaque plateforme.',
        bullets: [
          'Amazon · Shopify · Etsy · Walmart · eBay · Trendyol',
          'Transfrontalier : Temu · SHEIN · DHgate · Tmall · 1688',
          'CSV / XLSX / JSON — séparé par produit ou combiné',
        ],
      },
      {
        eyebrow: 'Caméra IA · Une prise, tous les formats',
        h: 'Un appui sur le déclencheur. Tous les formats, en même temps.',
        sub: 'Choisis ton ratio (1:1, 4:5, 9:16 ou 3:4). Appuie une fois sur le déclencheur — photoZseo écrit JPEG, PNG et WebP en parallèle et redimensionne pour chaque marketplace. Pas de nouvelle prise, pas d\'export par lot.',
        bullets: [
          'Une capture → JPEG + PNG + WebP, enregistrés ensemble',
          'Redimensionnement par plateforme à l\'export : Amazon, Shopify, Etsy, Instagram…',
          'AE Lock · WB Auto · Détection d\'arrière-plan · Centrage automatique du sujet',
          'Rafale, déclencheur via bouton volume, grille + niveau · 100 % hors ligne',
        ],
      },
      {
        eyebrow: 'Remplissage SEO automatique par IA',
        h: 'Remplis 13 champs en quelques secondes.',
        sub: 'Dépose une photo. photoZseo rédige titre, slug, méta description, texte alt, tags et mots-clés — optimisés pour la recherche, instantanément.',
        bullets: [
          'OCR + Vision sur l\'appareil : code-barres, marque, matériau, couleur',
          'Titre, slug, méta, texte alt et mots-clés longue traîne de qualité SEO',
          '12 langues — sorties correctes selon la locale',
        ],
      },
      {
        eyebrow: 'Générateur de devis B2B',
        h: 'Devis PDF brandés en 3 étapes.',
        sub: 'Choisis les produits, ajoute l\'acheteur, partage. VAT, IBAN, Incoterms, codes HS et une signature électronique — tout sur un PDF magnifiquement brandé.',
        bullets: [
          'VAT par ligne · unité · code HS · pays d\'origine',
          'Profil expéditeur avec logo, IBAN, Incoterms — enregistré une seule fois',
          'Montant en lettres, signature électronique, IDs de devis séquentiels',
        ],
      },
      {
        eyebrow: 'Des stories qui vendent',
        h: 'WhatsApp, Telegram et Instagram — en un toucher.',
        sub: 'Construis une file de statuts / stories pour chaque contact. 9:16 pour Instagram, 1:1 pour WeChat, 3:4 pour RED — formatés automatiquement.',
        bullets: [
          'Stickers intelligents : prix, badge, remise, nouveauté',
          'File round-robin avec un délai de 7 jours par contact',
          'Partage en Stories, Catalogue, ou enregistrement local',
        ],
      },
      {
        eyebrow: 'Détail produit',
        h: 'Gère comme un pro.',
        sub: 'Un produit, tous les canaux. Photos, prix, SEO, EXIF et stories vivent dans une fiche unique, magnifiquement organisée.',
        bullets: [
          'Carrousel photo, inspecteur média, éditeur EXIF inline',
          'Marge par produit, MSRP, prix B2B, mode VAT',
          'Partage rapide vers Devis, Story, Catalogue ou Marketplace',
        ],
      },
      {
        eyebrow: 'Métadonnées Pro',
        h: 'EXIF de qualité appareil photo, à chaque prise.',
        sub: 'EXIF, dimensions et format écrits pour chaque plateforme. GPS retiré automatiquement. Tags IPTC et Artist préservés.',
        bullets: [
          '9 champs EXIF modifiables inline (Artist, Copyright, Software…)',
          'Données GPS supprimées à l\'export par défaut — la vie privée d\'abord',
          'Chaque prise enregistrée en JPEG + PNG + WebP d\'un coup — aucun ré-export, aucune perte de qualité',
        ],
      },
      {
        eyebrow: 'App universelle',
        h: 'iPhone. iPad. Mac.',
        sub: 'iOS 17+, iPadOS et Mac Catalyst. Glisser, déposer, multi-sélection, barre latérale, inspecteur — synchronisés via iCloud Drive.',
        bullets: [
          'Glisser-déposer sur iPad et Mac · export multi-sélection',
          'Raccourcis clavier, menus clic droit, navigation par barre latérale',
          'Synchro iCloud Drive — chaque appareil, jamais perdu',
        ],
      },
      {
        eyebrow: 'La vie privée d\'abord',
        h: 'Aucun pistage. Aucune pub. Aucun cloud.',
        sub: 'Conçu pour les vendeurs qui ne font pas confiance au cloud. Conforme GDPR, KVKK et CCPA. 12 langues dont 4 scripts RTL.',
        bullets: [
          'GDPR · KVKK · CCPA — pas d\'analytics, pas de SDK tiers',
          'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
          'L\'IA tourne sur l\'appareil — tes photos ne partent jamais',
        ],
      },
      {
        eyebrow: 'Tarifs',
        h: 'Gratuit pour commencer. Pro quand tu es prêt.',
        sub: 'Commence gratuitement. Passe à Pro uniquement quand tu es prêt à exporter vers chaque marketplace. Annule à tout moment, sans carte pour l\'essai.',
        bullets: [
          'Gratuit à vie pour capture, organisation et export basique',
          'Pro ajoute 46+ formats de marketplaces, SEO IA, devis B2B',
          '3 jours d\'essai gratuit · $39.99/an · seulement $3.33/mois',
        ],
      },
    ],
  },
  bento: {
    headKicker: 'Plus que des captures d\'écran',
    headTitle: 'Conçu comme un outil de pro, au prix d\'une app.',
    headSub: 'Chaque section ci-dessous est une fonctionnalité disponible aujourd\'hui — pas de roadmap, pas de liste d\'attente.',
    csv: {
      label: 'CSV · XLSX · JSON',
      sub: 'formats marketplace — tape le titre une fois, chaque colonne se remplit.',
    },
    exif: {
      label: 'EXIF de qualité appareil photo',
      gpsStripped: '— SUPPRIMÉ —',
    },
    langs: {
      label: '12 langues · 3 RTL',
      sublabel: 'EN · TR · DE · ES · FR · PT · JA · KO · ZH · AR · HI · FA',
    },
    stats: {
      label: 'Conçu pour les vendeurs indépendants',
      marketplaces: 'marketplaces',
      seoFields: 'champs SEO par photo',
      devices: 'appareils · une app',
      noTrackers: 'trackers · pubs · clouds',
    },
  },
  seoDemo: {
    kicker: 'Interactif · En direct',
    title: 'Regarde l\'IA remplir 13 champs SEO.',
    sub: 'Choisis un produit. Regarde photoZseo écrire chaque champ dont ta marketplace a besoin — titre, slug, catégorie, méta, description complète, alt, tags, mots-clés et code-barres. Touche un champ pour copier.',
    inputLabel: 'Nom du produit',
    inputPlaceholder: 'Tape un nom de produit…',
    btnIdle: '✨ Remplir automatiquement 13 champs SEO',
    btnBusy: 'Génération…',
    note: 'Sur l\'appareil · 100 % privé · 12 langues',
    fieldLabels: {
      title: 'Titre SEO',
      slug: 'Slug',
      filename: 'Nom de fichier (URL)',
      category: 'Catégorie',
      meta: 'Méta Desc',
      description: 'Description',
      alt: 'Texte alt',
      tag1: 'Tag 1',
      tag2: 'Tag 2',
      tag3: 'Tag 3',
      tag4: 'Tag 4',
      keywords: 'Mots-clés',
      barcode: 'Code-barres',
    },
  },
  stats: {
    kicker: 'Des chiffres qui font vendre',
    title: 'Conçu par un vendeur indépendant.\nTesté par des acheteurs dans 12 pays.',
    labels: {
      marketplaces: 'Marketplaces et canaux',
      seoFields: 'champs SEO par photo',
      languages: 'Langues — RTL incluses',
      zero: 'Pubs. Trackers. Données collectées.',
    },
    pills: {
      gdpr: 'GDPR', kvkk: 'KVKK', ccpa: 'CCPA',
      wcag: 'WCAG 2.1 AA', noTracking: 'Aucun pistage, jamais',
    },
  },
  pricing: {
    kicker: 'Tarifs',
    title: 'Vends plus vite — sans filigrane, sans limite.',
    sub: 'Trois plans, une seule expérience Pro. Essaie l\'abonnement annuel gratuitement pendant 3 jours, puis $3.33/mois — annule à tout moment dans Réglages.',
    badge: 'Meilleure valeur · Économise 52 %',
    plans: [
      {
        name: 'Hebdomadaire',
        pricePer: '$2.99/semaine',
        features: [
          'Accès Pro complet',
          'Essaie pendant une semaine',
          'Annule à tout moment dans Réglages',
          '— Aucun engagement à long terme',
        ],
        cta: 'Démarrer Hebdomadaire',
      },
      {
        name: 'Mensuel',
        pricePer: '$6.99/mois',
        features: [
          'Accès Pro complet',
          'Facturé mensuellement, annule à tout moment',
          'Mêmes fonctionnalités que l\'annuel',
          '— Économise 52 % avec l\'annuel',
        ],
        cta: 'Choisir Mensuel',
      },
      {
        name: 'Annuel',
        pricePer: '$39.99/an',
        trial: '3 jours d\'essai gratuit · seulement $3.33/mois · économise 52 %',
        featured: true,
        features: [
          '**Supprime le filigrane** sur tous les exports',
          '**Export en lot** de toutes les photos d\'un coup',
          '**CSV + XLSX** pour 46+ marketplaces',
          '**Vidéo + Pro Tools** (studio caméra, suppression d\'arrière-plan)',
          'Remplissage SEO IA (13 champs, 12 langues)',
          'Générateur de devis B2B (VAT, IBAN, HS, e-signature)',
          'Stories et stickers intelligents',
          'Éditeur EXIF et pipeline de métadonnées',
          'iPhone, iPad et Mac universels',
          'Synchro iCloud Drive',
        ],
        cta: 'Démarrer l\'essai gratuit de 3 jours',
      },
    ],
    note: 'Prix en USD. Tarification locale dans l\'App Store (par ex. ₺39.99/an en Turquie). Partage Familial pris en charge. Les abonnements se renouvellent automatiquement sauf annulation au moins 24 h avant la fin de la période — gère dans Réglages → Apple ID → Abonnements.',
  },
  faq: {
    kicker: 'Questions',
    title: 'Tout ce que tu voulais demander.',
    items: [
      {
        q: 'photoZseo fonctionne-t-il sans internet ?',
        a: 'Oui. La capture de photos, l\'édition, le remplissage SEO par IA, l\'EXIF et les exports tournent à 100 % sur l\'appareil grâce à Apple Foundation Models et Vision. Internet n\'est nécessaire que lorsque tu pousses activement vers une marketplace distante.',
      },
      {
        q: 'Puis-je exporter vers Amazon, Shopify et Etsy en même temps ?',
        a: 'Oui. Choisis les produits, choisis les plateformes, appuie sur Exporter. photoZseo écrit CSV/XLSX/JSON dans l\'ordre exact des colonnes de chaque plateforme, plus les tailles d\'images par plateforme — séparé par produit ou en un seul fichier combiné.',
      },
      {
        q: 'Mes photos ou données produit sont-elles téléchargées quelque part ?',
        a: 'Non. Zéro analytics tiers, zéro SDK de tracking et aucun compte cloud. La seule sortie réseau est App Store / RevenueCat pour l\'abonnement, et la synchro iCloud Drive optionnelle qui reste dans ton propre iCloud.',
      },
      {
        q: 'Ça marche sur iPad et Mac, ou seulement iPhone ?',
        a: 'Les trois. photoZseo est une app universelle — un seul achat couvre iPhone, iPad et Mac (Catalyst). Glisser-déposer, multi-sélection, raccourcis clavier et panneau inspecteur sont de première classe sur iPad et Mac.',
      },
      {
        q: 'Qu\'y a-t-il exactement dans les 3 jours d\'essai gratuit ?',
        a: 'Tout Pro. Tous les 46+ formats de marketplaces, remplissage SEO IA, générateur de devis B2B, Stories, outils EXIF — accès complet pendant 3 jours sur le plan annuel. Si tu annules pendant l\'essai dans Réglages → Apple ID → Abonnements, tu n\'es pas facturé.',
      },
      {
        q: 'Combien de plateformes représente « 46+ » exactement ?',
        a: 'Au lancement : 46 préréglages de marketplaces (Amazon, Shopify, Etsy, eBay, Walmart, WooCommerce, Trendyol, AliExpress, Mercado Libre, Allegro, Temu, SHEIN, DHgate, Tmall, 1688, Made-in-China, Global Sources…) plus des formats sociaux/messagerie (Instagram Shopping, TikTok Shop, Pinterest, WhatsApp, Telegram, WeChat, RED, Stories). De nouveaux préréglages arrivent dans les mises à jour.',
      },
      {
        q: 'Ma position GPS sera-t-elle dans les photos exportées ?',
        a: 'Non. photoZseo retire les données GPS à l\'export par défaut. Les autres EXIF — Artist, Copyright, Software, dimensions, appareil — sont préservés et modifiables inline. Tu restes aux commandes.',
      },
      {
        q: 'Est-ce conforme GDPR / KVKK / CCPA ?',
        a: 'Oui — et l\'app parle ta langue : anglais, turc, allemand, espagnol, français, portugais, japonais, coréen, chinois, arabe, hindi et persan. Les mises en page RTL pour l\'arabe, l\'ourdou et le persan sont de première classe.',
      },
      {
        q: 'Puis-je importer ma liste de produits existante ?',
        a: 'Oui. CSV, TSV, XLSX, JSON, URL de photo et dossiers de photos en masse sont tous pris en charge. 41+ modèles d\'import de plateformes inclus.',
      },
    ],
  },
  finalCta: {
    h2: 'Ta prochaine vente commence par une photo.',
    p: 'Gratuit pour commencer. Aucun pistage. Aucune pub. Annule à tout moment. Conçu pour les vendeurs indépendants.',
    note: 'Bientôt sur l\'App Store.',
    notify: 'Me prévenir au lancement',
  },
  footer: {
    tag: 'Vends sur 46+ marketplaces depuis une seule photo.',
    privacy: 'Confidentialité', terms: 'Conditions', support: 'Support',
    accessibility: 'Accessibilité', deleteAccount: 'Supprimer le compte',
    rights: 'Tous droits réservés. Conçu pour les vendeurs indépendants.',
  },
};

export default fr;
