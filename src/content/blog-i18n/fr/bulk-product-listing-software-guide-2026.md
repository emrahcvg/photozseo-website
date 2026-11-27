---
title: "Logiciel de référencement de produits en masse : comment fonctionnent les téléchargements CSV/XLSX sur Amazon, eBay, Etsy, Shopify et Trendyol (2026)"
description: "Comment télécharger des produits en masse : le modèle de chaque plateforme, les champs obligatoires et les règles d'URL des images pour Amazon, eBay, Etsy, Shopify et Trendyol, ainsi qu'une liste de contrôle."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon et Trendyol acceptent les téléchargements de feuilles de calcul. Ce n'est pas le cas de Etsy : son centre d'aide indique que vous ne pouvez pas télécharger de nouvelles annonces en masse, mais uniquement modifier en masse celles existantes."
  - "Les images dans une feuille de calcul sont presque toujours des URL et non des fichiers joints. L'URL doit être publique, directe et (sur Shopify et eBay) commencer par https://."
  - "Les modèles diffèrent selon la catégorie sur Amazon, eBay et Trendyol, alors téléchargez un nouveau modèle pour chaque catégorie et ne renommez jamais ses en-têtes."
faqs:
  - q: "Comment puis-je télécharger des produits en masse sur eBay ?"
    a: "Dans Seller Hub, accédez à Rapports, puis Télécharger et choisissez Obtenir un modèle avec la source des annonces. Remplissez le fichier et téléchargez-le ; eBay répertorie les éléments comme spécifié. Utilisez CSV ou XLSX."
  - q: "Puis-je télécharger en masse de nouvelles annonces sur Etsy avec un CSV ?"
    a: "Le centre d'aide de Etsy indique que vous ne pouvez pas télécharger de nouvelles annonces en masse, mais que vous pouvez copier des annonces et modifier en masse celles existantes. Des outils tiers existent, mais ils ne constituent pas une fonctionnalité de Etsy."
  - q: "Shopify a-t-il besoin d'URL d'image dans le CSV ?"
    a: "Oui. Les URL des images dans le CSV doivent être accessibles au public, utiliser https:// et ne pas être protégées par un mot de passe. Shopify télécharge les images lors de l'importation."
  - q: "Quel encodage de fichier un produit CSV Shopify doit-il utiliser ?"
    a: "Le centre d'aide de Shopify demande UTF-8 avec des fins de ligne de style LF, séparées par des virgules, avec les en-têtes sur la première ligne. Vérifiez les paramètres d'exportation de votre application de feuille de calcul."
  - q: "Où télécharger un fichier produit Excel sur Trendyol ?"
    a: "Dans le panneau du vendeur, sous Produit, puis Opérations de produits en vrac, en utilisant l'option de saisie de produit Excel et le type de téléchargement de nouveau produit. Chaque catégorie a son propre modèle."
  - q: "Pourquoi mon transfert groupé a-t-il été rejeté ?"
    a: "Les causes habituelles sont des en-têtes de colonnes modifiés, des champs obligatoires manquants, des URL d'images privées ou de redirection et un modèle de mauvaise catégorie. Corrigez le fichier et téléchargez à nouveau."
---

Le téléchargement de produits en masse consiste à préparer une feuille de calcul (CSV ou XLSX) avec une ligne par produit et à la télécharger une fois au lieu de créer chaque liste à la main. eBay, Shopify, Amazon et Trendyol le prennent en charge ; Etsy ne permet pas la création groupée de nouvelles annonces. Les deux règles qui provoquent la plupart des échecs sont les mêmes partout : conserver les en-têtes du modèle exactement comme indiqué et donner à chaque image une URL publique et directe.

*Dernière vérification : novembre 2026. Sources vérifiées : Centre d'aide Shopify, « Utilisation de fichiers CSV pour importer et exporter des produits » ; Aide de eBay Seller Hub, « Créer des annonces en masse » (Rapports Seller Hub > Télécharger) ; Centre d'aide Etsy, « Puis-je créer ou modifier plusieurs annonces à la fois ? » ; Aide Amazon Seller Central, « Modèles de fichiers d'inventaire » et « Problèmes d'image » (lire via des extraits de recherche, voir la note ci-dessous) ; Trendyol Akademi Satıcı Bilgi Merkezi, "Excel Ürün Girişi" et "Ürün Görseli Seçimi ve Yükleme" (lire via des extraits de recherche).*

## Comment chaque plateforme gère-t-elle le téléchargement groupé ?

| Plate-forme | Créer en masse ? | Où | Type de fichier | Règle d'image |
|---|---|---|---|---|
| Shopify | Oui | Produits > Importation | CSV, UTF-8, séparés par des virgules | URL https:// publiques |
| eBay | Oui | Seller Hub > Rapports > Télécharger > Obtenir un modèle | CSV ou XLSX | https:// URL, jusqu'à 12 par annonce, séparées par \ |  |
| Amazon | Oui | Ajouter des produits via le téléchargement (Seller Central) | Modèle de fichier d'inventaire spécifique à une catégorie | URL directe ; les redirections et les pop-ups sont rejetés |
| Trendyol | Oui | Produit > Opérations de produits en vrac > Saisie de produits Excel | Excel, un modèle par catégorie | Lien dans la colonne Lien d'image |
| Etsy | Non (modification uniquement) | Gestionnaire de boutique > Annonces | Sans objet | Sans objet |

## Comment télécharger des produits en masse sur Shopify ?

Le centre d'aide de Shopify définit le format : la première ligne doit être constituée d'en-têtes de colonnes, les colonnes sont séparées par des virgules et le fichier doit être au format UTF-8 avec des fins de ligne LF. Pour les nouveaux produits, seul `Title` est requis ; si vous utilisez des variantes, `URL handle` est également requis. Les colonnes de variantes telles que SKU nécessitent également `Option1 name` et `Option1 value`, sinon Shopify crée une variante par défaut et supprime celles existantes lors de la mise à jour.

Les images doivent être des URL `https://` accessibles publiquement sans protection par mot de passe. Shopify les télécharge lors de l'importation, vous pouvez donc les supprimer par la suite. Les noms de fichiers image ne peuvent pas être modifiés après le téléchargement et ne peuvent pas inclure les suffixes `_thumb`, `_small` ou `_medium`. Les vidéos et les modèles 3D ne sont pas pris en charge en CSV.

| Limite | Valeur (Centre d'aide Shopify) |
|---|---|
| Options par produit | 3 |
| Images par produit | 250 |
| Tags par produit | 250 |
| Texte alternatif | 512 caractères maximum, 125 ou moins recommandés |
| Titre SEO | 70 caractères |
| Descriptif SEO | 320 caractères |

Known failure causes from the same page: a file with both `Barcode` and `Barcodes` columns fails; un ensemble partiel de colonnes à dimensions compressées échoue ; with overwrite on, blank cells erase existing values. For a deeper comparison with the API route, see [Shopify CSV et API](/fr/blog/shopify-csv-vs-api-2026).

## Comment télécharger en masse des annonces sur eBay ?

L'outil actuel de eBay est Seller Hub Reports. Go to Upload, click Get template, choose the Listings source and a file type. XLSX is the default and CSV is recommended for advanced sellers; an XLSX download can include up to 10 categories, each on its own sheet. Upload the completed file and eBay lists the items as specified.

Les champs obligatoires pour l'ajout d'une annonce incluent l'action, l'ID de catégorie, le titre (80 caractères maximum), le format, la durée, le prix de départ, la quantité, l'ID de condition, la description et l'URL de la photo de l'article. The US site also requires a UPC (or equivalent) in the matching item-specific column, and book categories need an ISBN.

Les URL des images doivent commencer par `https://`, se termine par une extension de fichier telle que `.jpg` ou `.png`, restez sous 2048 caractères et remplacez les espaces par `%20`. Vous pouvez lister jusqu'à 12 images par listing, séparées par une barre verticale (`|`) personnage. Les images peuvent être auto-hébergées ou sur eBay Services d'images. Pour les variantes, la ligne parent laisse la quantité et le prix vides et chaque ligne enfant a la sienne.

## Comment télécharger des produits en masse sur Amazon ?

Amazon utilise des modèles de fichiers d'inventaire spécifiques à une catégorie, générés à partir de la page Ajouter des produits via le téléchargement dans Seller Central. Pour les articles qui ne figurent pas encore dans le catalogue, vous utilisez le modèle de produit, qui marque les attributs comme obligatoires, requis sous condition ou recommandés. Pour les articles déjà présents dans le catalogue, vous pouvez effectuer une recherche par ID produit et utiliser un fichier pré-rempli. Après le téléchargement, sélectionnez le type de fichier correspondant et examinez le rapport de traitement pour chaque SKU.

Pour les images, la page d'aide « Problèmes d'image » de Amazon indique qu'une URL contextuelle ou de redirection ne sera pas acceptée et que le téléchargement ne sera pas traité, l'URL doit donc pointer directement vers le fichier image. Menu paths and accepted file types vary by marketplace region, so follow the instructions on the template you download. Pour les dimensions de l'image, voir [Spécifications des photos du produit Amazon](/fr/blog/amazon-product-photo-specs-2026).

## Pouvez-vous effectuer un téléchargement groupé vers Etsy ?

Pas pour les nouvelles annonces. Etsy's help center states that you cannot bulk upload new listings, and suggests creating one listing and copying it. Vous pouvez modifier en masse les annonces existantes à partir de Shop Manager, y compris les titres, les balises, les descriptions, les prix, les options personnalisées, le profil de traitement et les profils de livraison. Tools that claim to bulk-create Etsy listings are third-party products and not an Etsy feature, so verify their terms and API access yourself.

## Comment télécharger des produits en masse sur Trendyol ?

In the seller panel, open Product, then Bulk Product Operations, and use the Excel product entry option. Le centre d'informations sur les vendeurs de Trendyol décrit un modèle par catégorie, identifié par un code de catégorie et le type de téléchargement « Yeni Ürün Ekle » (ajouter un nouveau produit). Images are given in the Image Link (Görsel Linki) column. Trendyol documente également une méthode de galerie : téléchargez d'abord des images dans la galerie d'images, avec des noms de fichiers égaux au code-barres du produit (pour plusieurs images, code-barres_1, code-barres_2), puis copiez ces noms dans la colonne. Do not change the template's format before upload.

Panel wording can change, so confirm the steps against the template inside your own seller account. Pour les règles d'image sur Trendyol et Hepsiburada, voir [Photos des produits Trendyol et Hepsiburada](/fr/blog/trendyol-hepsiburada-product-photos).

## Quelles sont les erreurs de transfert groupé les plus courantes ?

1. En-têtes modifiés ou renommés. Les modèles correspondent au texte d'en-tête. Ne les traduisez pas et ne les réorganisez pas.
2. Mauvais modèle de catégorie. Amazon, eBay and Trendyol templates differ per category.
3. URL d'images qui ne sont pas directes. A link to a web page, a redirect, or a login-protected folder fails.
4. Espaces et caractères spéciaux dans les URL. Encodez les espaces (eBay demande `%20`).
5. Mauvais codage ou délimiteur. Excel peut exporter des points-virgules ou du texte non UTF-8.
6. 
7. Écrasez les surprises. Sur Shopify, les cellules vides peuvent effacer les données existantes.

## Liste de contrôle préalable au téléchargement

- 
- Testez avec 5 lignes avant le catalogue complet.
- Open every image URL in a private browser window; il devrait montrer l'image elle-même.
- 
- 

## Où s'adapte photoZseo

Les fichiers de téléchargement groupé ne fonctionnent qu'avec les images et le texte qu'ils contiennent. photoZseo prépare des photos de produits pour 46 places de marché (redimensionnement, compression, noms de fichiers SEO, suppression de l'arrière-plan sur l'appareil) et exporte CSV, XLSX ou JSON depuis l'application iPhone et iPad. Il n'héberge pas d'images ni ne les télécharge sur les marchés pour vous, mis à part l'envoi de produits à Shopify. Téléchargez l'application sur le [page de téléchargement](/fr/download). Le [Extension Chrome](/fr/chrome-extension) fait de même pour les pages produits que vous parcourez sur un ordinateur.

*photoZseo n’est affilié ni approuvé par aucun marché. Les noms de Marketplace sont utilisés uniquement pour décrire la compatibilité.*

*Remarque : les pages Amazon Seller Central et Trendyol Akademi n'ont pas pu être ouvertes dans leur intégralité lors de la vérification. Les détails de ces deux plates-formes proviennent donc d'extraits de recherche des pages officielles. Vérifiez toujours les instructions du modèle dans votre propre compte.*
