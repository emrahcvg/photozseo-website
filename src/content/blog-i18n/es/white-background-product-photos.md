---
title: "Fotografías de productos con fondo blanco: explicación de la regla RGB 255"
description: "Amazon y Walmart requieren una imagen principal en blanco puro (RGB 255, 255, 255). Por qué falla el casi blanco, cómo verificar el fondo y cómo obtener un blanco verdadero a partir de una foto iPhone."
pubDate: 2026-11-26
readingMinutes: 4
tags: [amazon, walmart, product-photos, background]
tldr:
  - "Amazon y Walmart requieren la imagen principal del producto en blanco puro: RGB 255, 255, 255 (#FFFFFF)."
  - "Los colores casi blancos, como RGB 245, 245, 245, parecen blancos a la vista, pero no cumplen la regla."
  - "La forma confiable de obtener un blanco verdadero es eliminar el fondo y colocar el producto sobre un lienzo #FFFFFF."
faqs:
  - q: "¿Qué es exactamente un fondo blanco puro?"
    a: "Cada píxel de fondo tiene el valor RGB 255, 255, 255 (hexadecimal #FFFFFF). El gris claro o el blanco ligeramente cálido no cuentan."
  - q: "¿Qué mercados requieren un fondo blanco?"
    a: "Amazon y Walmart lo requieren para la imagen principal. Muchos otros mercados lo recomiendan porque las imágenes principales blancas parecen consistentes en los resultados de búsqueda."
  - q: "¿Las imágenes secundarias necesitan un fondo blanco?"
    a: "No. Las imágenes adicionales pueden mostrar el producto en uso, con referencias de escala o en un entorno de estilo de vida."
---

"Fondo blanco" suena simple hasta que se suprime una lista de un fondo que parecía blanco. Los mercados significan algo preciso.

## la regla

- Amazon: la imagen principal debe estar sobre un fondo blanco puro, RGB 255, 255, 255 ([Centro del vendedor](https://sellercentral.amazon.com/gp/help/external/G9FUUH87RBNXGKB7)).
- Walmart Marketplace: la imagen principal necesita un fondo blanco continuo, RGB 255, 255, 255 ([Mercado Walmart Aprende](https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content%2C%20imagery%2C%20and%20media/Product-detail-page:-Image-guidelines-&-requirements)).

Las imágenes secundarias son gratuitas para mostrar contexto.

## Por qué falla "casi blanco"

Una fotografía de un producto en papel blanco suele tener píxeles de fondo alrededor de RGB 235–250: las sombras, el viñeteado y el balance de blancos de la cámara la hacen ligeramente gris o cálida. A la vista parece blanco; para un control automatizado no lo es.

## Cómo comprobar tus antecedentes

1. Abra la imagen en cualquier editor con un selector de color.
2. Pruebe el fondo en varios lugares, especialmente en las esquinas.
3. Cada muestra debe leer 255, 255, 255 (o #FFFFFF).

## Cómo obtener un blanco verdadero a partir de una foto iPhone

1. Fotografía sobre un fondo liso y claro con luz suave: hace que el siguiente paso sea más limpio.
2. Elimina el fondo (ver [3 formas de hacerlo en iPhone](/es/blog/remove-background-product-photos-iphone)).
3. Coloque el producto sobre un lienzo #FFFFFF, centrado, llenando aproximadamente el 85% del marco para Amazon.
4. Exporte como JPEG al tamaño del mercado, p. 2000 × 2000 píxeles.

Una sombra suave debajo del producto generalmente está bien, siempre y cuando el fondo permanezca de un blanco puro.

[fotoZseo](/es/download) realiza los pasos 2 a 4 de una sola vez: elimina el fondo del dispositivo, coloca el producto en blanco puro y exporta Amazon, Walmart y otras versiones del mercado con nombres de archivos SEO.
