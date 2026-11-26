---
title: "Générateur de devis B2B pour le e-commerce : TVA, IBAN, codes HS et signature électronique en 2026"
description: "Une référence 2026 pour les vendeurs de commerce électronique indépendants qui établissent des devis B2B : modes TVA, IBAN, codes HS, Incoterms 2020, légalité de la signature électronique et flux de travail pratique."
pubDate: 2026-05-12
readingMinutes: 10
tags: [b2b, quote, vat, hs-codes, incoterms, e-signature]
tldr:
  - "En 2026, les vendeurs de commerce électronique indépendants reçoivent régulièrement des demandes de devis B2B (grossistes, chaînes de boutiques de cadeaux, acheteurs d'hôtels) et un document Word n'est plus une réponse crédible."
  - "Un véritable devis B2B nécessite 12 champs spécifiques : informations sur l'acheteur, éléments de ligne avec TVA et unité de mesure, codes SH, Incoterms, conditions de paiement, IBAN et une signature avec une piste d'audit."
  - "Les générateurs de devis sur appareil (y compris le module Devis de photoZseo) génèrent des devis conformes avec recherche de code HS, préréglages Incoterms 2020, modes TVA UE/Royaume-Uni/États-Unis/Turquie, validation IBAN et signature électronique dans un seul document."
faqs:
  - q: "Quel est le statut juridique d'une signature e sur un devis B2B en 2026 ?"
    a: "Dans l'UE, l'eIDAS (Règlement 910/2014) donne à une signature électronique simple (SES) le même poids juridique qu'une signature électronique pour les contrats commerciaux dans presque tous les États membres. Aux États-Unis, la loi ESIGN (2000) et l'UETA confèrent aux signatures électroniques le même effet juridique qu'une signature manuscrite. En Turquie, le KVKK et la loi sur les signatures électroniques 5070 reconnaissent les signatures électroniques qualifiées (QES) comme équivalentes aux signatures humides."
  - q: "Ai-je besoin d’un code HS sur un devis B2B si l’acheteur se trouve dans le même pays ?"
    a: "Pas légalement, mais les équipes d’approvisionnement en 2026 demandent de toute façon régulièrement le code SH. Ils l'utilisent pour estimer les droits de douane lors de la réexportation, pour mapper le produit dans leur ERP et pour filtrer la conformité aux listes de marchandises restreintes. Inclure le code HS sur chaque devis (national et international) est la norme professionnelle par défaut."
  - q: "Quelle est la différence entre les Incoterms FOB, EXW et DDP ?"
    a: "EXW (Ex Works) — l'acheteur récupère dans votre entrepôt, l'acheteur paie tout. FOB (Free On Board) — vous livrez au port désigné, l'acheteur prend le relais au rail. DDP (Delivered Duty Paid) — vous livrez à la porte de l'acheteur droits acquittés. Les Incoterms 2020 comptent 11 termes au total ; FOB, EXW et DDP couvrent environ 80 % des cotations B2B indépendantes."
  - q: "Dois-je écrire le montant total en toutes lettres sur un devis B2B ?"
    a: "En Turquie, en Allemagne, en France, en Italie et dans la plupart des pays du Moyen-Orient, le montant en lettres est légalement requis sur les factures et fortement habituel sur les devis. Aux États-Unis et au Royaume-Uni, c'est facultatif. L’inclure sur chaque devis est la solution par défaut la plus sûre : cela ne coûte rien et évite les litiges si un chiffre est mal copié."
  - q: "Quel mode de TVA s'applique si je vends depuis l'Allemagne à un acheteur en France en 2026 ?"
    a: "Dans le cadre du régime EU OSS (One Stop Shop), les ventes B2B entre entreprises assujetties à la TVA dans l'UE utilisent le mécanisme d'autoliquidation : vous facturez à 0 % de TVA et l'acheteur en tient compte dans son propre dépôt. Vous devez enregistrer le numéro de TVA de l'acheteur et le vérifier via le système VIES. Pour le B2C, vous facturez le taux de TVA du pays de l'acheteur via la déclaration trimestrielle OSS."
---

La requête B2B s'affiche ainsi. Un grossiste envoie un email : "Nous avons vu votre boutique sur Etsy. Pouvez-vous envoyer un devis pour 100 unités, livrées dans notre entrepôt de Bruxelles, d'ici août ?"

En 2026, le vendeur qui répond par une doc Word et un lien PayPal perd le contrat. L'équipe d'approvisionnement a besoin d'un devis avec TVA, IBAN, codes HS, Incoterms et une signature – le même package qu'elle obtient d'un fournisseur $50M. La plupart des vendeurs indépendants ne réalisent pas à quel point ce bar est proche.

Cet article est la référence : ce qui se passe sur un devis B2B en 2026, ce qui est légalement requis et comment en produire un en moins de cinq minutes depuis votre téléphone.

## Pourquoi les vendeurs indépendants ont besoin de vrais devis, pas de documents Word

Trois forces ont convergé. Achats numérisés — Les systèmes ERP (SAP S/4HANA, Dynamics 365, Odoo) attendent des données de devis structurées avec TVA et code SH par ligne. Les douanes sont devenues plus strictes : les codes EU CBAM et ICS2 exigent des codes SH au stade du devis pour de nombreuses catégories. Les acheteurs veulent des pistes d'audit : un devis signé et horodaté survit à un futur litige ; ce n'est pas le cas d'un document Word.

Résultat : un vendeur indépendant capable de produire un devis B2B conforme en cinq minutes remporte des contrats qui étaient auparavant attribués au fournisseur de niveau supérieur.

## Anatomie d'un devis B2B

L'équipe d'approvisionnement d'un acheteur vérifie douze champs. Si vous en manquez un, le devis revient pour révision, ce qui ralentit la vente de 2 à 5 jours ouvrables.

| # | Champ | Qu'est-ce que c'est | Pourquoi c'est important |
|---|------|------------|----------------|
| 1 | Numéro de devis | Identifiant unique par devis | Dépôt de marchés, suivi des litiges |
| 2 | Date du devis + date de validité jusqu'à | Quand le devis a été émis et quand les prix expirent | Fixe le prix d'une fenêtre |
| 3 | Blocage du vendeur | Raison sociale, adresse, numéro de TVA, contact, bureau des impôts | Identification légale de la contrepartie |
| 4 | Blocage de l'acheteur | Nom légal de l'acheteur, adresse, numéro de TVA, contact | Détermination de la contrepartie + autoliquidation TVA |
| 5 | Éléments de campagne | Par ligne : SKU, description, quantité, unité, prix unitaire, taux de TVA, code SH, total de la ligne | Le livrable réel |
| 6 | Sous-total, TVA, total | Résumé mathématique | L'approvisionnement est rapproché du bon de commande |
| 7 | Devise | Code ISO 4217 | Évite les conflits de change |
| 8 | Montant en mots | "Quarante-deux mille cinq cents euros" | Prévention de la fraude ; requis dans de nombreuses juridictions |
| 9 | Incoterm | Mandat 2020 (par ex. FOB Hambourg, DDP Bruxelles) | Définit qui paie quoi pour l'expédition/les douanes |
| 10 | Conditions de paiement | Net-30, 50 % d'avance, etc. | Contrat de trésorerie |
| 11 | IBAN / bancaire | IBAN, SWIFT/BIC, nom de la banque | Où l’acheteur transfère l’argent |
| 12 | Signature | Humide ou électronique, horodaté | Obligation juridique |

Douze champs. Chaque devis B2B en 2026 nécessite les douze.

## Modes de TVA en 2026

La TVA (taxe de vente) est le domaine dans lequel les vendeurs indépendants se trompent le plus souvent. La carte 2026.

| Région | Mode | Quand cela s'applique | Exemples de tarifs |
|--------|------|-----------------|---------------|
| État membre de l'UE | TVA intérieure | Même pays, B2B ou B2C | 19% (DE), 20% (FR, IT), 21% (NL, ES, BE) |
| B2B transfrontalier de l’UE | Autoliquidation (0% sur facture) | Vendeur UE → acheteur UE, tous deux immatriculés à la TVA | 0% (vérifié via VIES) |
| B2C transfrontalier de l’UE | OSS (guichet unique) | Vendeur dans l’UE → consommateur dans un autre État de l’UE | Tarif pays acheteur, déclaré via OSS |
| Importation UE | IOSS (guichet unique d'importation) | Vendeur hors UE → Consommateur UE, ≤150€ | Tarif du pays acheteur, déclaré via IOSS |
| ROYAUME-UNI | TVA britannique | Approvisionnement au Royaume-Uni (post-Brexit) | 20 % standard, 5 % réduit, 0 % détaxé |
| NOUS | Taxe de vente | Au niveau de l’État, varie selon le lien | 0 % à 11 % selon l'état |
| Turquie | KDV | Exportations nationales + sélectionnées | 1%, 10%, 20% |
| Canada | TPS/TVH/TVQ | Fédéral + provincial | 5 % de TPS + recouvrement provincial |
| Australie | TPS | Standard | 10% |
| EAU / Arabie Saoudite | T.V.A. | Standard | 5 % (EAU), 15 % (Arabie Saoudite) |

Un devis B2B en 2026 doit déclarer le mode de TVA au niveau de l'en-tête (par exemple, « Autoliquidation – Livraison intracommunautaire de l'UE, art. 138 de la directive TVA de l'UE ») et le taux par article de ligne si le taux varie.

## Codes SH : pourquoi les douanes bloquent les expéditions sans ces codes

Le code du Système harmonisé est un numéro de 6 à 10 chiffres qui classe chaque produit échangé. Les 6 premiers chiffres sont normalisés au niveau mondial (OMD) ; les chiffres 7 à 10 sont spécifiques au pays (EU TARIC, US HTSUS).

Exemples : 9603.10 (pinceaux artisanaux), 6109.10 (T-shirts en coton), 4202.32 (portefeuilles), 9405.41 (lampes LED).

Les douanes utilisent le code SH pour calculer les droits de douane, appliquer les accords commerciaux (EPA UE-Japon, USMCA, RCEP) et filtrer les marchandises soumises à restrictions. Un envoi avec un mauvais code HS peut être retenu pendant 5 à 30 jours. Un envoi sans code SH est retenu jusqu'à ce qu'un envoi soit fourni.

La meilleure pratique 2026 : recherchez le code HS par SKU lors de l'intégration du produit, stockez-le dans la base de données produit et imprimez-le sur chaque devis. Le module Quote de photoZseo intègre la recherche HS au niveau du produit, de sorte que le code est défini une fois et se propage à chaque devis.

## Référence rapide des Incoterms 2020

Les Incoterms 2020 définissent 11 termes. Trois couvrent environ 80 % des cotations B2B indépendantes :

| Terme | Signification | Qui paie les frais d'expédition | Qui paie les douanes |
|------|---------|-------------------|------------------|
| EXW | Ex Works - l'acheteur vient chercher votre studio | Acheteur | Acheteur |
| GOUSSET | Gratuit à bord (port nommé) | Vendeur au port, puis acheteur | Acheteur (après port) |
| DDP | Rendu droits acquittés – porte-à-porte, tout compris | Vendeur | Vendeur |

Les huit autres (CIF, CIP, DAP, DPU, FCA, CPT, CFR, FAS) sont courants dans le commerce industriel mais apparaissent rarement dans une cotation indépendante. En cas de doute, EXW pour le ramassage local, FOB pour l'export, DDP pour les offres de livraison premium.

## Statut juridique de la signature électronique

La carte juridique 2026 de la signature électronique sur les documents commerciaux :

| Région | Loi applicable | Statut |
|--------|---------------|--------|
| UE | Règlement eIDAS 910/2014 | SES, AES, QES tous valides ; QES = signature humide |
| ROYAUME-UNI | Loi sur les communications électroniques de 2000 | Valable pour la plupart des contrats commerciaux |
| NOUS | Loi ESIGN + UETA | Équivalent à la signature humide |
| Turquie | Loi sur la signature électronique 5070 | QES = signature humide |
| Canada / Australie / Émirats arabes unis / Inde | Statuts locaux | Signatures électroniques reconnues |

Pour un devis B2B entre deux entreprises privées, une simple signature électronique avec un horodatage et une piste d'audit de l'appareil suffit dans presque toutes les juridictions. Les secteurs réglementés (pharmaceutique, défense, services financiers) exigent souvent une signature électronique qualifiée (QES) d'un fournisseur figurant sur une liste de confiance de l'UE, en dehors du champ d'application des vendeurs indépendants.

Le module Devis de photoZseo intègre une signature dessinée au doigt dans le PDF avec un horodatage et un identifiant de périphérique. Pour l'artisanat, la mode, les accessoires et les biens de consommation en gros, cela est contractuellement contraignant dans l'UE, au Royaume-Uni, aux États-Unis, en Turquie, au Canada, en Australie et dans la plupart des pays MENA.

## Flux de travail pratique avec photoZseo

Génération de devis de bout en bout en 2026 :

1. L'acheteur bloque les remplissages automatiques à partir du sélecteur de contacts (nom, adresse, numéro de TVA, e-mail).
2. Profil d'expéditeur pré-rempli : votre dénomination sociale, adresse, numéro de TVA, IBAN, bureau des impôts. Configuré une fois.
3. Ajoutez des articles de campagne : SKU, quantité, unité (pcs/kg/m/rame — liste complète des codes ONU), prix unitaire, taux de TVA, code SH par ligne.
4. Choisissez Incoterm dans le menu de 11 termes et nommez le port/lieu (par exemple « FOB Hambourg »).
5. Conditions de paiement, devise, fenêtre de validité — Net-30, USD/EUR, 14 jours par défaut.
6. Sous-total, TVA, calcul automatique du total. Le montant en mots est généré automatiquement dans la langue active de l'application.
7. Signez avec le doigt ou le crayon Apple ; champ de signature facultatif de l’acheteur pour les transactions en personne.
8. Exporter un PDF : e-mail, AirDrop, WhatsApp Business ou iCloud Drive.

Temps total pour un devis de 10 lignes : 3 à 5 minutes, les 12 champs renseignés, piste d'audit dans les métadonnées PDF.

## Une liste de contrôle pratique

Avant d'envoyer un devis B2B, confirmez :

- [ ] Le numéro de devis est unique et séquentiel.
- [ ] Valable jusqu'à ce que la date soit définie (14 jours par défaut, ou ce que l'acheteur a demandé).
- [ ] Le numéro de TVA de l'acheteur est vérifié (VIES pour l'UE, HMRC pour le Royaume-Uni).
- [ ] Chaque ligne possède un code HS si la commande peut franchir une frontière.
- [ ] Le mode TVA est correct : national, autoliquidation, OSS ou exportation détaxée.
- [ ] L'Incoterm nomme la ville/le port — pas seulement « FOB » mais « FOB Hambourg ».
- [ ] Les conditions de paiement précisent le pourcentage initial, le cas échéant.
- [ ] IBAN et SWIFT sont corrects (un chiffre erroné = un virement qui ne mène nulle part).
- [ ] Le montant en lettres correspond au total numérique.
- [ ] La signature est présente avec un horodatage.

Si les dix critères sont satisfaisants, le devis est prêt à être acheté.

## Les plats à emporter

L’opportunité B2B pour les vendeurs de commerce électronique indépendants en 2026 est réelle et croissante. Les grossistes, les hôtels, les boutiques de cadeaux, les acheteurs de cadeaux d'entreprise et les acheteurs commerciaux trouvent des marques indépendantes via Etsy, Instagram, TikTok Shop et Shopify, et souhaitent acheter à grande échelle. La barrière est de produire un devis qui ressemble à celui du fournisseur auprès duquel ils achètent déjà.

Un PDF à 12 champs, conforme à la TVA, codé HS et signé électroniquement n'est plus quelque chose que seules les entreprises produisent. En 2026, c’est quelque chose qu’un vendeur indépendant écrit depuis son téléphone, dans sa deuxième langue, en moins de cinq minutes.

Les vendeurs qui internalisent cela opèrent à un niveau différent de ceux qui collent encore des chiffres dans un document Word.

---

photoZseo est sur le App Store pour iPhone et iPad.
