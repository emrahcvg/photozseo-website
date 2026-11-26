---
title: "Importation CSV/XLSX en masse vers 46 places de marché – détection automatique de 41 plateformes"
description: "Déposez une exportation Shopify, Amazon ou Etsy dans photoZseo. Nous détectons 41 signatures de plateformes, extrayons des photos en parallèle et réexportons vers 46 places de marché."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo accepte les catalogues CSV, TSV, XLSX et JSON et détecte automatiquement 41 signatures de plate-forme à partir des en-têtes de colonnes du fichier."
  - "Les photos de produits sont extraites en parallèle des URL du fichier. Activez le Wi-Fi uniquement si vous ne souhaitez pas graver de données cellulaires."
  - "Réexportez le même catalogue vers 46 places de marché, chacune avec ses propres noms de fichiers SEO, des tailles d'image et un ordre de colonnes adaptés à la plate-forme."
faqs:
  - q: "Quels formats de fichiers puis-je importer dans photoZseo ?"
    a: "CSV, TSV, XLSX et JSON. Chacun peut contenir des titres de produits, des descriptions, des prix, des SKU, des codes-barres et des URL de photos. La plupart des vendeurs abandonnent leur exportation Shopify ou Amazon existante et ignorent complètement le mappage."
  - q: "Que signifie « détection automatique de 41 signatures de plateforme » en pratique ?"
    a: "photoZseo inspecte les en-têtes de colonnes du fichier et les compare à 41 schémas d'exportation de plate-forme connus : Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce et 33 autres. Si votre fichier provient de l'une de ces plateformes, le mappage est automatique."
  - q: "L'importation de photos à partir d'URL utilise-t-elle mes données mobiles ?"
    a: "Seulement si vous le permettez. Il existe une option Wi-Fi uniquement dans les paramètres d'importation, activée par défaut. Lorsqu'il est activé, les téléchargements s'interrompent et reprennent automatiquement lorsque vous changez de réseau. Désactivé, il utilisera n'importe quelle connexion active."
  - q: "Que se passe-t-il si mon catalogue contient 5 000 produits ?"
    a: "photoZseo importe par lots et maintient l'interface utilisateur réactive. Les téléchargements d'URL de photos s'exécutent en parallèle : la limite pratique est votre bande passante, pas l'application. Un catalogue de 5 000 lignes contenant des URL de photos arrive généralement en 10 à 20 minutes sur le Wi-Fi domestique standard."
  - q: "Puis-je réexporter vers un marché différent de celui d’origine ?"
    a: "Oui, c'est le point. Importez un catalogue Shopify, cliquez sur Exporter, choisissez Amazon (ou Etsy ou Trendyol). photoZseo reconstruit le fichier dans l'ordre exact des colonnes de la plate-forme de destination, avec des images redimensionnées selon les spécifications de cette plate-forme."
---

La partie la plus difficile de la vente sur une nouvelle place de marché n'est pas la place de marché. Il s'agit d'intégrer vos 800 produits existants sans retaper chaque titre, sans télécharger à nouveau chaque photo et sans remapper chaque colonne.

L'importation groupée du catalogue de photoZseo gère l'aller-retour. Déposez un fichier que vous possédez déjà et vous êtes à 80 % du chemin vers une nouvelle plate-forme.

## Pourquoi l'importation groupée existe

Si vous êtes un vendeur Expédié par Amazon Amazon ajoutant Trendyol, une boutique Etsy évoluant vers TikTok Shop ou une boutique Shopify migrant vers Walmart, votre catalogue existe déjà. Vous l'avez exporté une fois. Le problème est que chaque plate-forme utilise un schéma légèrement différent : des noms de colonnes différents, des spécifications d'image différentes, des taxonomies de produits différentes. La solution manuelle consiste en des heures de travail sur une feuille de calcul par nouveau canal.

photoZseo le réduit à quelques minutes.

## Ce qui est importé

L'importateur lit quatre formats :

- CSV — Exportations de produits Shopify, téléchargements de fichiers plats Amazon, modèles groupés Trendyol.
- TSV — variantes séparées par des tabulations provenant de systèmes plus anciens ou internes.
- XLSX — Fichiers Excel avec catalogues multi-feuilles.
- JSON — Exportations API ou flux de produits internes.

Chacun peut contenir des titres, des descriptions, des prix, des SKU, des codes-barres, des axes de variantes (taille, couleur), un inventaire et, surtout, des URL de photos. Une fois dans photoZseo, les mêmes données génèrent des devis, des exportations et un remplissage automatique SEO.

## Détection automatique sur 41 plates-formes

La fonctionnalité qui tue n'est pas la prise en charge du format. C'est la détection automatique.

photoZseo inspecte les en-têtes de colonnes du fichier et les compare à 41 schémas d'exportation de plateforme connus :

- Marchés occidentaux : Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- Turc : Trendyol, Hepsiburada, N11
- Asie transfrontalière : AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- Amérique latine : Mercado Libre, Coupang
- Europe : Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...et 17 autres.

Si votre fichier provient de l'un de ces éléments, photoZseo le reconnaît lors de son dépôt. Aucun assistant de mappage de colonnes. Aucune invite « Que signifie cet en-tête ». Cela fonctionne.

## Les URL des photos sont extraites en parallèle

La plupart des exportations de catalogue incluent des URL de photos, et non des images intégrées. photoZseo les télécharge en parallèle : connexions multiples, nouvelle tentative intelligente, déduplication par hachage perceptuel afin que la même photo de produit ne soit pas importée deux fois.

Il y a une bascule Wi-Fi uniquement activée par défaut. Avec ça dessus :

- Les téléchargements s'interrompent lorsque vous quittez le Wi-Fi et reprennent à votre retour.
- Aucune surprise cellulaire sur votre facture de téléphone.
- Une importation de 2 000 produits ne videra pas votre forfait de données.

Lorsqu'il est désactivé, le photoZseo utilise n'importe quelle connexion active, ce qui est utile sur un bureau avec le Wi-Fi du bureau.

## Un flux de travail pratique

Voici l’aller-retour que la plupart des vendeurs effectuent :

Étape 1 — Exporter depuis la plateforme source. Shopify, Amazon ou Etsy vous permettent tous de télécharger votre catalogue au format CSV/XLSX. Saisissez-le.

Étape 2 — Déposez le fichier dans photoZseo. Sur iPhone, appuyez sur Importer dans n'importe quel projet. Sur iPad, faites-le glisser depuis les fichiers. La détection automatique identifie la plate-forme et commence à extraire les URL des photos en arrière-plan.

Étape 3 — Laissez [L'IA remplit les champs SEO](/features/seo-filenames). photoZseo écrit le titre, le slug, la méta description, le texte alternatif, les balises et les mots-clés pour chaque produit, en 12 langues si vous vendez à l'international.

Étape 4 — Exportez vers un nouveau marché. Choisissez la destination – Amazon, Trendyol, Walmart, peu importe. photoZseo réécrit le fichier dans l'ordre exact des colonnes de cette plate-forme, redimensionne les images selon les spécifications de la plate-forme et regroupe le résultat dans un seul ZIP.

Étape 5 — Téléchargez sur la nouvelle chaîne. Le fichier de sortie est prêt pour n’importe quel outil de téléchargement groupé utilisé par la destination.

Ce qui était autrefois une semaine de travail sur un tableur est une pause déjeuner de 30 minutes.

## Pourquoi c'est important pour les vendeurs transfrontaliers

Le principal obstacle à l’expansion au-delà de votre marché domestique est le coût de conversion du catalogue. La plupart des vendeurs restent sur Amazon US non pas parce que Amazon US est le meilleur, mais parce que passer à Mercado Libre ou Trendyol signifie reconstruire le catalogue à partir de zéro.

L'importation en masse + 46 préréglages du marché supprime ce bloqueur. Les mêmes données produit circulent vers tous les canaux. Les nouveaux marchés sont une fonctionnalité, pas un projet.

Pour les vendeurs indépendants qui souhaitent expédier dans le monde entier sans embaucher de gestionnaire de catalogue, c'est la solution.
