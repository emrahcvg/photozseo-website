---
title: "Exigences relatives aux images de flux de données produit : Google Merchant Center et Meta Catalog (2026)"
description: "Spécifications d'image pour les flux Google Merchant Center et Meta Catalog : pixels minimum, taille recommandée, formats, limites de fichiers et raison pour laquelle les images sont signalées."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center : JPEG, WebP, PNG, GIF, BMP ou TIFF jusqu'à 16 Mo ; 500 x 500 px minimum pour tous les produits à partir du 31 janvier 2027 ; 1 500 x 1 500 px ou plus recommandés."
  - "Méta-catalogue : JPEG ou PNG, 8 Mo maximum, au moins 500 x 500 px ; Un carré de 1 024 x 1 024 px est recommandé pour les boutiques sur Facebook et Instagram."
  - "Un seul JPEG carré de 1 500 x 1 500 px avec un arrière-plan propre, sans superposition de texte ni filigrane satisfait les deux flux."
faqs:
  - q: "Quelles sont les exigences relatives aux images Google Merchant Center en 2026 ?"
    a: "Utilisez un lien image_http/https au format JPEG, WebP, PNG, GIF, BMP ou TIFF, jusqu'à 16 Mo et 64 mégapixels. Google recommande une taille de 1 500 x 1 500 px ou plus, et un minimum de 500 x 500 px s'applique à tous les produits à partir du 31 janvier 2027."
  - q: "Quelle est la taille minimale de l’image pour un méta-catalogue ?"
    a: "La spécification des données produit de Meta nécessite au moins 500 x 500 pixels pour l'image principale, au format JPEG ou PNG de moins de 8 Mo. Pour les boutiques sur Facebook et Instagram, Meta recommande 1 024 x 1 024 pixels."
  - q: "Combien d’images supplémentaires puis-je ajouter à un flux de produits ?"
    a: "Le lien_image_additionnel de Google accepte jusqu'à 10 images supplémentaires. La référence des champs de catalogue de Meta autorise jusqu'à 50 URL d'image supplémentaires."
  - q: "Puis-je utiliser le même fichier image pour Google Shopping et Meta ?"
    a: "Généralement oui. Un JPEG carré de 1 500 x 1 500 px ou plus, montrant le produit réel sur un fond propre, sans texte ni filigrane, répond aux règles publiées des deux plateformes."
  - q: "Pourquoi Meta ou Google signale-t-il l'image de mon produit ?"
    a: "Les causes courantes sont le texte superposé, les badges promotionnels, les filigranes, les bordures, les images d'espace réservé telles que \"image à venir\", les images trop petites et les URL d'images qui bloquent les robots d'exploration ou ne correspondent pas au type de fichier."
---

La réponse courte : pour Google Merchant Center et Meta Catalog, envoyez un JPEG carré d'au moins 1 500 x 1 500 pixels, montrant le produit réel sur un fond propre, sans texte, badges ou filigranes. Le fond dur de Google est de 500 x 500 px (pour tous les produits à partir du 31 janvier 2027) et celui de Meta est également de 500 x 500 px, mais les deux plates-formes recommandent des fichiers plus gros. Les tableaux ci-dessous donnent les chiffres exacts issus de la documentation de chaque plateforme.

*Dernière vérification : novembre 2026. Sources : Aide Google Merchant Center ("Lien image [image_link]", "Lien image supplémentaire [additional_image_link]", "Comment réparer : Image trop petite"); Centre d'aide Meta Business (« Spécifications des images de produits pour les catalogues » ); Méta pour les développeurs (« Champs du catalogue »).*

## Google Merchant Center vs Meta Catalog : côte à côte

| Exigence | Google Merchant Center | Méta-catalogue |
|---|---|---|
| Champ d'image principal | `image_link` | `image_link` |
| Formats acceptés | JPEG, WebP, PNG, GIF, BMP, TIFF | JPEG, PNG |
| Taille maximale du fichier | 16 Mo (et 64 mégapixels) | 8 Mo |
| Taille minimale | 500 x 500 px pour tous les produits à partir du 31 janvier 2027 (avant : 100 x 100 px, ou 250 x 250 px pour les vêtements) | 500 x 500 pixels |
| Taille recommandée | 1 500 x 1 500 px ou plus | 1024 x 1024 px (Boutiques sur Facebook et Instagram) |
| Rapport hauteur/largeur | Aucun ratio fixe indiqué ; Google peut appliquer un recadrage subtil | Les magasins affichent un carré 1:1 ; Les publicités carrousel fonctionnent mieux lorsque toutes les images partagent le même rapport (1:1 ou 4:5). |
| Images supplémentaires | Jusqu'à 10 (`additional_image_link`) | Jusqu'à 50 (`additional_image_link`) |
| Cadrage du produit | Le produit doit remplir environ 75 % à 90 % de l'image | L'image principale doit montrer l'intégralité du produit |
| Règles d'URL | http/https, ASCII uniquement, RFC 3986, 1 à 2 000 caractères | Utiliser l'URL de l'image actuelle du produit |

Pour connaître en détail la date limite du Google, consultez notre article précédent sur le [Google Shopping 500 x 500 px minimum](/fr/blog/google-merchant-center-500px-image-requirement-2027).

## Que change la règle Google 500 x 500 px ?

Jusqu'au 31 janvier 2027, la page de dépannage de Google répertorie toujours des seuils inférieurs : 100 x 100 px pour la plupart des produits et 250 x 250 px pour les vêtements. Après cette date, le minimum de 500 x 500 px s'applique à chaque catégorie. Google indique que les images inférieures au minimum ne seront pas affichées, bien que le produit lui-même ne soit pas refusé. Google note également que les publicités YouTube Shopping nécessitent des images d'au moins 500 x 500 px pour apparaître à la télévision.

Conséquence pratique : un flux rempli de vignettes de 300 px ne brisera pas complètement vos annonces, mais ces produits perdront leur image là où cela compte. Réexportez à partir des originaux au lieu de mettre à l'échelle une vignette.

## Que nécessite Meta pour les images du catalogue ?

L'article d'aide de Meta répertorie ces bases : au moins une image par produit, JPEG ou PNG, 8 Mo maximum, et l'image doit représenter avec précision le produit spécifique à vendre. Pour les boutiques sur Facebook et Instagram, les images de produits sont affichées sous forme de carré (1:1), avec un minimum de 500 x 500 px et 1 024 x 1 024 px recommandés.

Meta suggère également quatre images ou plus par produit, une image principale claire montrant l'ensemble du produit, un mélange d'angles et de gros plans, les mêmes images que sur votre site Web, un fond blanc et JPEG sur PNG pour la qualité de l'image.

### Comment Meta recadre-t-il les images ?

Dans Commerce Manager (Paramètres, puis Catalogue), vous choisissez l'un des trois modes de recadrage : remplir le cadre avec l'image (la valeur par défaut, qui effectue un zoom avant), afficher l'image entière dans le cadre (un espace blanc peut être ajouté) ou recadrer et redimensionner pour l'adapter au cadre. Meta indique que les images ne sont recadrées nulle part ailleurs dans les magasins sur Instagram et pas du tout dans les magasins sur Facebook, à l'exception des paramètres de la page produit Instagram. Si votre catalogue mélange les proportions, les publicités carrousel peuvent les ajuster automatiquement ; fournir chaque image dans le même rapport (1:1 ou 4:5) évite cela.

## Pourquoi les images de produits sont-elles signalées ou refusées ?

Les deux plates-formes répertorient des problèmes presque identiques. Vérifiez d'abord votre flux pour ces éléments :

| Problème | Google | Méta |
|---|---|---|
| Superpositions de texte, codes promotionnels, appels à l'action | Non autorisé (prix, frais de port, texte promotionnel) | Non recommandé (texte superposé, appels à l'action, codes promotionnels) |
| Filigranes, logos ajoutés | Non autorisé à moins qu'il ne fasse physiquement partie du produit | Non recommandé |
| Images d'espace réservé ("image à venir") | Non autorisé | Éviter; les nouvelles images ont besoin d'une nouvelle URL pour être actualisées |
| Frontières | Non autorisé | Non mentionné dans les spécifications |
| Graphiques génériques à la place du produit | Non autorisé (exceptions pour certaines catégories de matériel, de véhicules et de logiciels) | L'image doit représenter le produit exact |
| Trop petit | Image non affichée (après le 31 janvier 2027) | En dessous de 500 x 500 px, cela ne répond pas aux spécifications |
| Accès du robot | Autoriser Googlebot et Googlebot-image dans robots.txt ; les modifications prennent 24 à 48 heures | Non spécifié dans la spécification |
| Incompatibilité de type de fichier | L'extension doit correspondre au format réel | JPEG ou PNG uniquement |

Deux pièges spécifiques aux aliments sont faciles à manquer. Premièrement, Google souhaite des URL stables sans paramètres dynamiques tels que des horodatages ou des identifiants de session. Deuxièmement, Meta actualise une image remplacée uniquement si le nouveau fichier a une URL différente, donc l'écrasement de `shoe.jpg` en place ne mettra pas à jour votre catalogue.

## Une exportation qui satisfait les deux flux

1. Commencez par la photo originale non compressée.
2. Exportez un carré 1:1 à 1 500 x 1 500 px ou plus au format JPEG (moins de 8 Mo, confortablement sous les deux limites).
3. Conservez le produit à environ 75 à 90 % du cadre sur un fond propre.
4. Supprimez les superpositions, les badges, les filigranes et les bordures de l'image du flux ; conserver les versions promotionnelles pour les annonces.
5. Utilisez un nom de fichier descriptif et une URL stable et explorable.
6. Mettez des angles supplémentaires dans `additional_image_link` (Google : jusqu'à 10).

## Où s'adapte photoZseo

Si vous préparez des images pour de nombreux marchés et flux, le [photoZseo](/fr/download) sur iPhone et iPad redimensionne, compresse et renomme les photos de produits pour 46 marchés à partir d'une seule photo, et le [Extension Chrome](/fr/chrome-extension) fait de même à partir des pages de produits avec des noms de fichiers SEO et une exportation groupée. Notre [guide des tailles d'image du marché](/fr/marketplace-image-sizes) répertorie les numéros par marché.

*photoZseo n'est affilié ni approuvé par aucun marché, Google ou Meta. Vérifiez toujours les directives actuelles des plateformes avant un téléchargement volumineux.*
