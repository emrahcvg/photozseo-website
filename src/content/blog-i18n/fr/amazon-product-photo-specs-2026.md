---
title: "Exigences relatives aux photos de produits Amazon en 2026"
description: "Tailles exactes, types de fichiers et règles d'arrière-plan que Amazon applique aux images de produits — et comment les transmettre lors du premier téléchargement."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "L'image principale de Amazon doit être au minimum de 1 000 × 1 000 (2 000 × 2 000 recommandé), carré 1:1, fond #FFFFFF blanc pur, JPEG, sRGB, inférieur à 10 Mo."
  - "Le rejet le plus rapide provoque : un quasi-blanc au lieu du vrai blanc, un produit inférieur à 85 % du cadre, des filigranes ou du texte sur l'image principale."
  - "Restez en dessous de 600 Ko par image après compression : le CDN de Amazon réencode tout ce qui est plus gros et avec des poids de vitesse de page dans votre classement de conversion."
faqs:
  - q: "Quelle est la taille minimale de l'image pour les photos des produits Amazon ?"
    a: "1 000 pixels sur le côté le plus long est le minimum absolu. En dessous, Amazon désactive la fonction de zoom sur votre annonce – et les annonces sans zoom sont déclassées par l'algorithme. Visez 2000 × 2000 pour donner à Amazon de la place pour se recompresser sans ramollir."
  - q: "Le JPEG ou le PNG sont-ils meilleurs pour les listes Amazon ?"
    a: "JPEG. Amazon accepte également TIFF, PNG et GIF, mais JPEG se compresse plus petit, se traite plus rapidement sur le CDN de Amazon et il n'y a aucun avantage en matière de transparence sur un arrière-plan #FFFFFF. Enregistrez dans l’espace colorimétrique sRGB, qualité 80-85."
  - q: "Le Amazon nécessite-t-il un arrière-plan blanc pur pour chaque photo ?"
    a: "Uniquement l'image principale – c'est la règle que Amazon applique avec les contrôles automatisés. Les images secondaires peuvent montrer le produit dans son contexte, sur un modèle, avec un emballage ou dans des scènes de style de vie. La première photo est le gardien."
  - q: "Quelle doit être la taille du produit dans le cadre ?"
    a: "La ligne directrice de Amazon est d'au moins 85 % de l'image. Les produits plus petits que cela échouent souvent à l’examen automatisé ou sont signalés manuellement lors des audits de catégorie. Centrez le produit et recadrez bien."
  - q: "Puis-je télécharger des photos HEIC de mon iPhone vers Amazon ?"
    a: "Non. Amazon attend les formats JPEG, TIFF, PNG ou GIF. Convertissez HEIC en JPEG avant le téléchargement — Le préréglage Amazon de photoZseo le fait automatiquement et réduit le fichier à 200-600 Ko sans perte de qualité visible."
---

Amazon rejette les annonces avant que la plupart des vendeurs ne les voient. Le coupable est presque toujours la photo : un fichier trop lourd, un arrière-plan qui n'est pas vraiment blanc ou un rapport hauteur/largeur que la plateforme refuse discrètement.

Voici l'aide-mémoire des spécifications 2026, extrait de la documentation du vendeur de Amazon et testé par rapport aux annonces en direct.

## Règles principales de l'image

- Dimensions : 1000×1000 minimum, 2000×2000 recommandé. En dessous de 1 000 sur le côté le plus long, Amazon n’activera pas le zoom – et l’algorithme traite les listes sans zoom comme étant de qualité inférieure.
- Rapport hauteur/largeur : Carré (1:1) pour l'image principale. Les images secondaires peuvent être au format 4:5 ou 16:9.
- Fond : Blanc pur, hexadécimal `#FFFFFF`. Les studios photographiés en « presque blanc » échouent aux contrôles automatisés plus souvent que ne le pensent les vendeurs.
- Format : JPEG (`.jpg`) est le choix le plus sûr. TIFF, PNG et GIF sont acceptés mais JPEG se compresse mieux et se traite plus rapidement sur le CDN de Amazon.
- Espace colorimétrique : sRVB. Les images enregistrées dans Adobe RVB ou ProPhoto semblent ternes après le réencodage de Amazon.
- Taille du fichier : moins de 10 Mo par image. Visez 200 à 600 Ko après compression : les fichiers volumineux ralentissent le chargement des pages de produits et la vitesse des pages pèse sur la conversion.

## Qu'est-ce qui fait qu'une annonce est supprimée

1. Filigranes, superpositions de texte ou logos sur l'image du produit.
2. Accessoires qui ne sont pas inclus dans ce que le client recevra.
3. Bordure, cadre ou tout arrière-plan autre que le blanc pur pour l'image principale.
4. Produit occupant moins de 85 % du cadre de l’image.
5. Mannequins (pour vêtements) ou plates-formes de support visibles.

## Comment photoZseo applique la spécification

Le préréglage Amazon dans photoZseo fait quatre choses à la fois :

1. Recadrage sur un cadre carré avec le produit centré à 85 % de la toile.
2. Redimensionne le côté le plus long à 2 000 pixels (mise à l'échelle intelligemment si la source est plus petite).
3. Écrit un fichier JPEG propre en sRGB, qualité 85 – généralement 250 à 450 Ko.
4. Si la suppression de l'arrière-plan est activée, remplacez la toile de fond sur laquelle vous photographiez par du #FFFFFF pur et adoucissez les bords afin que le produit n'ait pas l'air coupé-collé.

L'ensemble du pipeline fonctionne sur le téléphone. Rien ne quitte votre appareil.

## Une liste de contrôle de conformité rapide

Avant de télécharger, confirmez :

- [ ] Le côté le plus long est ≥1 000 px (2 000 px de préférence)
- [ ] L'arrière-plan réussit un test de « sélecteur blanc » – les quatre coins se lisent comme `#FFFFFF`
- [ ] Le fichier fait moins de 10 Mo et est enregistré au format JPEG
- [ ] Le rapport hauteur/largeur est de 1:1 pour l'image principale
- [ ] Aucun texte, filigrane ou cadre

Si les cinq sont vérifiés, la liste passera la validation automatique de Amazon du premier coup – et vous éviterez les allers-retours qui tuent le timing de lancement.
