---
title: "Requisitos de imágenes del feed de datos del producto: Google Merchant Center y Meta Catalog (2026)"
description: "Especificaciones de imágenes para feeds Google Merchant Center y Meta Catalog: píxeles mínimos, tamaño recomendado, formatos, límites de archivos y por qué se marcan las imágenes."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center: JPEG, WebP, PNG, GIF, BMP o TIFF hasta 16 MB; 500 x 500 px mínimo para todos los productos a partir del 31 de enero de 2027; Se recomienda 1500 x 1500 px o más."
  - "Metacatálogo: JPEG o PNG, 8 MB máximo, al menos 500 x 500 px; Se recomienda un cuadrado de 1024 x 1024 px para Tiendas en Facebook y Instagram."
  - "Un único JPEG cuadrado de 1500 x 1500 px con un fondo limpio, sin superposiciones de texto ni marcas de agua satisface ambos feeds."
faqs:
  - q: "¿Cuáles son los requisitos de imagen Google Merchant Center en 2026?"
    a: "Utilice un enlace de imagen http/https en JPEG, WebP, PNG, GIF, BMP o TIFF, hasta 16 MB y 64 megapíxeles. Google recomienda 1500 x 1500 px o más, y se aplica un mínimo de 500 x 500 px a todos los productos a partir del 31 de enero de 2027."
  - q: "¿Cuál es el tamaño mínimo de imagen para un metacatálogo?"
    a: "La especificación de datos del producto de Meta requiere al menos 500 x 500 píxeles para la imagen principal, en JPEG o PNG de menos de 8 MB. Para Tiendas en Facebook y Instagram, Meta recomienda 1024 x 1024 píxeles."
  - q: "¿Cuántas imágenes adicionales puedo agregar al feed de un producto?"
    a: "El enlace_imagen_adicional de Google acepta hasta 10 imágenes adicionales. La referencia de campos del catálogo de Meta permite hasta 50 URL de imágenes adicionales."
  - q: "¿Puedo usar el mismo archivo de imagen para Google Shopping y Meta?"
    a: "Generalmente sí. Un JPEG cuadrado de 1500 x 1500 px o más, que muestra el producto real sobre un fondo limpio sin texto ni marcas de agua, cumple con las reglas publicadas por ambas plataformas."
  - q: "¿Por qué Meta o Google marcan la imagen de mi producto?"
    a: "Las causas comunes son texto superpuesto, insignias promocionales, marcas de agua, bordes, imágenes de marcador de posición como \"imagen próximamente\", imágenes que son demasiado pequeñas y URL de imágenes que bloquean a los rastreadores o no coinciden con el tipo de archivo."
---

La respuesta corta: tanto para Google Merchant Center como para Meta Catalog, envíe un JPEG cuadrado de al menos 1500 x 1500 píxeles, que muestre el producto real sobre un fondo limpio, sin texto, insignias ni marcas de agua. El piso duro de Google es de 500 x 500 px (para todos los productos a partir del 31 de enero de 2027) y el de Meta también es de 500 x 500 px, pero ambas plataformas recomiendan archivos más grandes. Las tablas siguientes proporcionan los números exactos de la documentación propia de cada plataforma.

*Última verificación: noviembre de 2026. Fuentes: Ayuda de Google Merchant Center ("Enlace de imagen [enlace_imagen]", "Enlace de imagen adicional [enlace_imagen_adicional]", "Cómo solucionarlo: Imagen demasiado pequeña"); Centro de ayuda Meta Business ("Especificaciones de imágenes de productos para catálogos"); Meta para desarrolladores ("campos del catálogo").*

## Google Merchant Center vs Meta Catálogo: lado a lado

| Requisito | Google Merchant Center | Metacatálogo |
|---|---|---|
| Campo de imagen principal | `image_link` | `image_link` |
| Formatos aceptados | JPEG, WebP, PNG, GIF, BMP, TIFF | JPEG, PNG |
| Tamaño máximo de archivo | 16 MB (y 64 megapíxeles) | 8 megas |
| Tamaño mínimo | 500 x 500 px para todos los productos a partir del 31 de enero de 2027 (antes de eso: 100 x 100 px o 250 x 250 px para ropa) | 500 x 500 píxeles |
| Tamaño recomendado | 1500 x 1500 píxeles o más | 1024 x 1024 px (Tiendas en Facebook y Instagram) |
| relación de aspecto | No se indica ningún ratio fijo; Google puede aplicar un recorte sutil | Las tiendas muestran un cuadrado 1:1; Los anuncios en carrusel funcionan mejor cuando todas las imágenes comparten una misma proporción (1:1 o 4:5). |
| Imágenes adicionales | Hasta 10 (`additional_image_link`) | Hasta 50 (`additional_image_link`) |
| Encuadre del producto | El producto debe ocupar entre el 75% y el 90% de la imagen. | La imagen principal debe mostrar el producto completo. |
| reglas de URL | http/https, solo ASCII, RFC 3986, de 1 a 2000 caracteres | Utilice la URL de la imagen del producto actual |

Para conocer en detalle la fecha límite del Google, consulte nuestra publicación anterior sobre el [Google Shopping 500 x 500 px mínimo](/es/blog/google-merchant-center-500px-image-requirement-2027).

## ¿Qué cambia la regla Google 500 x 500 px?

Hasta el 31 de enero de 2027, la página de solución de problemas de Google todavía enumera umbrales más bajos: 100 x 100 px para la mayoría de los productos y 250 x 250 px para la ropa. Después de esa fecha, se aplica el mínimo de 500 x 500 px a todas las categorías. Google afirma que no se mostrarán imágenes por debajo del mínimo, aunque el producto en sí no está desaprobado. Google también señala que los anuncios de YouTube Shopping necesitan imágenes de al menos 500 x 500 px para aparecer en la televisión.

Consecuencia práctica: un feed lleno de miniaturas de 300 px no arruinará tus listados por completo, pero esos productos perderán su imagen donde más importa. Vuelva a exportar desde los originales en lugar de ampliar una miniatura.

## ¿Qué requiere Meta para las imágenes de catálogo?

El artículo de ayuda de Meta enumera estos conceptos básicos: al menos una imagen por producto, JPEG o PNG, 8 MB como máximo, y la imagen debe representar con precisión el producto específico a la venta. Para Tiendas en Facebook y Instagram, las imágenes de productos se muestran como un cuadrado (1:1), con un mínimo de 500 x 500 px y se recomienda 1024 x 1024 px.

Meta también sugiere cuatro o más imágenes por producto, una imagen principal clara que muestre el producto completo, una combinación de ángulos y primeros planos, las mismas imágenes que en su sitio web, un fondo blanco y JPEG sobre PNG para calidad de imagen.

### ¿Cómo recorta Meta las imágenes del catálogo?

En Commerce Manager (Configuración, luego Catálogo), puede elegir uno de los tres modos de recorte: llenar el marco con una imagen (el valor predeterminado, que amplía), mostrar la imagen completa en el marco (se pueden agregar espacios en blanco) o recortar y cambiar el tamaño para ajustarse al marco. Meta dice que las imágenes no se recortan en ningún otro lugar de Tiendas en Instagram y en absoluto en Tiendas de Facebook, aparte de la configuración de la página del producto Instagram. Si su catálogo mezcla proporciones de aspecto, los anuncios en carrusel pueden ajustarlas automáticamente; suministrar cada imagen en la misma proporción (1:1 o 4:5) evita eso.

## ¿Por qué las imágenes de productos se marcan o rechazan?

Ambas plataformas enumeran problemas casi idénticos. Primero revisa tu feed para ver estos:

| Problema | Google | Meta |
|---|---|---|
| Superposiciones de texto, códigos promocionales, llamadas a la acción | No permitido (precio, envío, texto promocional) | No recomendado (texto superpuesto, llamadas a la acción, códigos promocionales) |
| Marcas de agua, logotipos añadidos. | No permitido a menos que sea físicamente parte del producto. | No recomendado |
| Imágenes de marcador de posición ("imagen próximamente") | No permitido | Evitar; Las nuevas imágenes necesitan una nueva URL para actualizarse. |
| Fronteras | No permitido | No mencionado en las especificaciones. |
| Gráficos genéricos en lugar del producto. | No permitido (excepciones para algunas categorías de hardware, vehículos y software) | La imagen debe representar el producto exacto. |
| demasiado pequeño | Imagen no mostrada (después del 31 de enero de 2027) | Por debajo de 500 x 500 px no cumple con las especificaciones |
| Acceso sobre orugas | Permitir Googlebot y Googlebot-image en robots.txt; los cambios tardan de 24 a 48 horas | No especificado en las especificaciones. |
| El tipo de archivo no coincide | La extensión debe coincidir con el formato real. | Sólo JPEG o PNG |

Es fácil pasar por alto dos trampas específicas para alimentos. Primero, Google quiere URL estables sin parámetros dinámicos como marcas de tiempo o ID de sesión. En segundo lugar, Meta solo actualiza una imagen reemplazada si el nuevo archivo tiene una URL diferente, por lo que sobrescribir `shoe.jpg` en su lugar no actualizará su catálogo.

## Una exportación que satisface ambos feeds

1. Comience desde la foto original sin comprimir.
2. Exporte un cuadrado 1:1 a 1500 x 1500 px o más como JPEG (menos de 8 MB, cómodamente por debajo de ambos límites).
3. Mantenga el producto aproximadamente entre el 75% y el 90% del marco sobre un fondo limpio.
4. Elimine superposiciones, insignias, marcas de agua y bordes de la imagen del feed; Mantenga versiones promocionales para anuncios.
5. Utilice un nombre de archivo descriptivo y una URL estable y rastreable.
6. Pon ángulos adicionales en `additional_image_link` (Google: hasta 10).

## Donde encaja photoZseo

Si prepara imágenes para muchos mercados y feeds, [fotoZseo](/es/download) en iPhone y iPad cambia el tamaño, comprime y cambia el nombre de las fotos de productos para 46 mercados a partir de una sola foto, y el [Extensión de Chrome](/es/chrome-extension) hace lo mismo desde páginas de productos con nombres de archivos SEO y exportación masiva. Nuestro [guía de tamaño de imagen del mercado](/es/marketplace-image-sizes) enumera los números por mercado.

*photoZseo no está afiliado ni respaldado por ningún mercado, Google o Meta. Siempre consulte las pautas actuales de las plataformas antes de realizar una carga grande.*
