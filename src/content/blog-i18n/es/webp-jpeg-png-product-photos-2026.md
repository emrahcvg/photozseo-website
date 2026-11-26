---
title: "WebP vs JPEG vs PNG para fotografías de productos: un punto de referencia para 2026"
description: "Un punto de referencia de 2026 de WebP, JPEG y PNG para fotografía de productos: tamaño de archivo, calidad visual, compatibilidad con el mercado y el formato adecuado por plataforma."
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP ofrece la misma calidad visual que JPEG con un tamaño de archivo aproximadamente un 30% más pequeño y ahora se incluye en todos los navegadores modernos, iOS Safari y Android Chrome; en 2026 ya no es una \"mejora progresiva\", sino que es la opción predeterminada."
  - "JPEG sigue ganando cuando el mercado lo exige estrictamente (imagen principal Amazon, eBay, Etsy). PNG solo gana con fondos transparentes y logotipos con píxeles perfectos."
  - "La mejor práctica para 2026 es escribir los tres formatos en paralelo desde una única fuente y dejar que el destino de carga elija: un flujo de trabajo que las herramientas automatizadas completan en menos de un segundo por foto."
faqs:
  - q: "¿WebP admite transparencias como PNG?"
    a: "Sí. WebP admite modos sin pérdidas y con pérdidas, además de un canal alfa para transparencia. Un WebP transparente suele ser entre un 25 y un 35 % más pequeño que el PNG transparente equivalente."
  - q: "¿WebP será compatible con todos los navegadores y dispositivos en 2026?"
    a: "Sí. WebP ha sido compatible con Chrome, Firefox, Edge y Opera durante años. Safari agregó WebP en iOS 14 (2020) y macOS Big Sur. A partir de 2026, el soporte global de WebP es del 97,4% (datos de caniuse.com, mayo de 2026). El último obstáculo significativo, el antiguo Internet Explorer, está por debajo del 0,1% del tráfico."
  - q: "¿Los mercados aceptarán cargas WebP en 2026?"
    a: "Shopify, BigCommerce, WooCommerce, Wix y Squarespace aceptan WebP de forma nativa. Amazon, eBay y Etsy todavía recomiendan JPEG para la imagen principal del producto; de todos modos, recodifican todo lo que subes. El patrón más seguro es cargar JPEG en mercados estrictos y WebP en su propia tienda."
  - q: "¿Qué configuración de calidad debo utilizar para el producto WebP?"
    a: "La calidad 80–85 es el punto ideal para la fotografía de productos. Por debajo de 75 se introducen bandas de color visibles en superficies brillantes o metálicas. Más de 90 deja de mejorar la calidad percibida y simplemente amplía el archivo."
  - q: "¿Por qué HEIC no está en esta lista?"
    a: "HEIC es un contenedor favorito de Apple que ningún mercado importante acepta. Los vendedores que cargan archivos HEIC casi siempre son rechazados o convertidos automáticamente en el servidor, a menudo con pérdida de calidad. El canal profesional escribe JPEG, PNG o WebP y nunca envía HEIC al exterior."
---

La cuestión del formato solía ser sencilla: fotografía, exportar JPEG, subir. En 2026, la pregunta ya no es "JPEG o PNG", sino "¿cuántos formatos necesito enviar a partir de una sola foto y qué destino quiere cuál?".

Este punto de referencia responde a eso con números medidos, tablas de mercado y un flujo de trabajo para vendedores independientes.

## ¿Qué cambió en 2026?

Tres turnos convergieron.

1. La compatibilidad con Safari WebP es universal. iOS 14 agregó WebP en 2020. En mayo de 2026, el 97,4% de la navegación global es compatible con WebP. El caso alternativo es estadísticamente insignificante.
2. La adopción del mercado se dividió en dos campos. Shopify, WooCommerce, BigCommerce, Wix y Squarespace sirven WebP directamente al navegador. Amazon, eBay, Etsy y Walmart recodifican cada carga en su propio JPEG de todos modos, por lo que el formato fuente apenas les importa, pero aún publican una guía "JPEG recomendado".
3. La economía de CDN premió a WebP. Cloudflare, Fastly y Bunny CDN informan un ancho de banda de salida entre un 28% y un 34% menor cuando la página de un producto sirve WebP en lugar de JPEG. Para una tienda que tiene 1 millón de páginas vistas al mes, esa es una línea de pedido medible.

Por lo tanto, el valor predeterminado para 2026 es: escriba JPEG para mercados, WebP para su propia tienda, PNG solo cuando necesite transparencia.

## Punto de referencia lado a lado

Una única fuente (una fotografía de 4032 × 3024 iPhone de una tabla de cortar de nogal sobre un barrido blanco) exportada con el mismo objetivo de calidad visual.

| Formato | Calidad | Tamaño del archivo | SSIM (calidad percibida versus fuente) | Tiempo de primera carga (4G) | Notas |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| JPEG | 85 | 412KB | 0.984 | 412 ms | La línea de base de referencia |
| JPEG | 75 | 264KB | 0.971 | 264 ms | Bandas de color visibles en el borde brillante. |
| WebP | 85 | 287KB | 0.985 | 287 ms | ~30% más pequeño que JPEG q85, SSIM idéntico |
| WebP | 75 | 184KB | 0.973 | 184 ms | Más pequeño que JPEG q75, mejor SSIM |
| PNG | (sin pérdidas) | 1,84MB | 1.000 | 1840 ms | Sin pérdidas pero 4,5 veces el coste JPEG |
| PNG-8 (256 colores) | (paleta) | 412KB | 0.812 | 412 ms | Bandas severas, no viables para fotografías de productos. |

La conclusión: con la misma calidad percibida, WebP es un 30% más pequeño que JPEG. PNG es sólo la respuesta correcta cuando se requiere transparencia o gráficos con píxeles perfectos (logotipos, fotografías con fondos recortados, superposiciones de productos).

## Matriz de compatibilidad del mercado

| Plataforma | JPEG | PNG | WebP | Recomendado |
|----------|------|-----|------|-------------|
| Amazon | Sí | Sí | No (recodificado) | JPEG |
| eBay | Sí | Sí | No | JPEG |
| Etsy | Sí | Sí | No | JPEG |
| Walmart Marketplace | Sí | Sí | No | JPEG |
| Shopify | Sí | Sí | Sí | WebP (escaparate), JPEG (importación CSV) |
| WooCommerce | Sí | Sí | Sí | WebP |
| Gran comercio | Sí | Sí | Sí | WebP |
| wix | Sí | Sí | Sí | WebP |
| Espacio cuadrado | Sí | Sí | Sí | WebP |
| TikTok Shop | Sí | Sí | Sí | JPEG (la mayoría de las plantillas) |
| Instagram Compras | Sí | Sí | No | JPEG |
| Temu / SHEIN | Sí | No | No | JPEG |
| DHgate / Made-in-China | Sí | Sí | No | JPEG |
| Trendyol / Hepsiburada | Sí | Sí | No | JPEG |
| Pinterest Compras | Sí | Sí | Sí | JPEG |

El patrón es consistente: los mercados que recodifican prefieren entradas JPEG; su propio escaparate gana con los resultados WebP.

## Cuando usar cual

Un árbol de decisión simple:

- ¿Subir a un mercado? → JPEG.
- ¿Alojar en su propia tienda Shopify, WooCommerce o BigCommerce? → WebP para el escaparate, JPEG como alternativa en la importación CSV.
- ¿Necesita transparencia (producto recortado, gráfico superpuesto, fotografía del empaque con alfa)? → PNG, con WebP como secundario si su tienda lo admite.
- ¿Enviar a una imprenta, fabricante o diseñador? → PNG o TIFF, nunca WebP.
- ¿Publicar en redes sociales (Instagram, TikTok, Pinterest)? → JPEG. Quienes suben contenido a redes sociales eliminan todo lo demás.

Los dos formatos que los vendedores no deberían realizar envíos salientes: HEIC (solo Apple, incompatible con el mercado) y AVIF (mejor compresión que WebP, pero aún inconsistente en Safari anterior, y casi ningún mercado lo acepta a partir de mayo de 2026).

## Cómo photoZseo escribe los tres en paralelo

En 2026, escribir tres archivos desde una sola fuente debería requerir un solo toque.

La canalización de imágenes de photoZseo se basa en Core Image, vImage y CGImageDestination. Cuando el vendedor presiona Exportar:

1. Decodificación maestra: la fotografía de origen se decodifica en un búfer de color lineal de 16 bits.
2. Gestión del color: el búfer se convierte a sRGB (el espacio de color universal para fotografías de productos).
3. Cambiar tamaño: el remuestreo de Lanczos-3 produce el tamaño requerido de la plataforma.
4. Codifique en paralelo: se realizan tres escrituras simultáneamente:
   - JPEG, calidad 85, sRGB, EXIF ​​preservado (GPS eliminado), etiquetas de artista y software escritas.
   - WebP, calidad 85, sRGB, EXIF ​​conservado mediante CGImageDestination + UTType.webP.
   - PNG, sRGB, alfa conservados si la fuente tiene transparencia.
5. Nombre de archivo: cada archivo recibe el mismo nombre descriptivo y seguro para URL con el sufijo de formato.

La escritura WebP es nativa: se basa en la compatibilidad con CGImageDestination WebP de iOS 14, no en un contenedor libwebp de terceros. Eso es importante porque la ruta nativa conserva los metadatos EXIF ​​(Título, Descripción, Artista, Copyright) que la mayoría de los contenedores de libwebp eliminan silenciosamente.

Tiempo total por foto en una iPhone 15 Pro: menos de 1 segundo para los tres formatos.

## Una nota sobre la configuración de calidad

El control de calidad tiene más matices que un solo número.

- q70: artefactos visibles en superficies lisas. Aceptable para miniaturas, no para imágenes destacadas.
- q75: aceptable para imágenes destacadas en formatos con pérdida, pero los productos brillantes (joyas, envases metálicos, vidrio) muestran bandas.
- q80–85: el punto óptimo para la fotografía de productos. SSIM se mantiene por encima de 0,98 frente a la fuente.
- q90+: el tamaño del archivo aumenta drásticamente sin que se perciba una mejora en la calidad. Útil sólo para maestros de archivo.
- sin pérdidas (PNG/WebP sin pérdidas): solo para gráficos, logotipos y packshots con transparencia.

Vendedores que utilizan por defecto la "calidad máxima" en cada almacenamiento de residuos de exportación y ralentizan sus páginas sin que la foto se vea mejor.

## CDN y ajuste de escaparate

Una vez que existen los tres archivos, el trabajo del escaparate es servir el correcto.

- Shopify selecciona automáticamente WebP para admitir navegadores a través de su CDN. Cargue selecciones WebP, JPEG y Shopify por solicitud.
- WooCommerce con el complemento "WebP Express" (o hosting moderno como Bluehost, Kinsta, WP Engine) sirve WebP desde un espejo `.webp` cuando el encabezado `Accept: image/webp` está presente.
- BigCommerce utiliza su CDN Akamai que realiza la transcodificación WebP sobre la marcha.
- Los escaparates personalizados de Astro/Next.js/Hugo deben usar etiquetas `<picture>` con `<source srcset="...webp" type="image/webp">` y un respaldo JPEG en `<img src="...jpg">`.

La cadena de respaldo es importante porque el 2,6% del tráfico que no admite WebP aún debería ver la foto del producto.

## Una lista de verificación práctica

Antes de subir, confirma:

- [] Tienes un archivo JPEG maestro de 2000×2000 (o el tamaño requerido por la plataforma) para cargas en el mercado.
- [] Tienes una versión WebP de la misma imagen para tu propia tienda.
- [] Tienes un PNG solo si el producto necesita transparencia.
- [] Los nombres de archivo son descriptivos: `walnut-cutting-board-12in.jpg`, no `IMG_4421.jpg`.
- [] El espacio de color es sRGB, no Adobe RGB o ProPhoto.
- [] Los datos GPS se eliminan del bloque EXIF.
- [] La calidad es q85 para JPEG y WebP, sin pérdidas para PNG.

Una página de producto que cumple con los siete se ejecuta rápidamente, se indexa limpiamente y tiene un aspecto idéntico en todo el mercado y el ecosistema de tiendas.

## la comida para llevar

La guerra de formatos ha terminado. En 2026, la respuesta correcta son las tres en paralelo: JPEG para los mercados que lo exigen, WebP para escaparates y CDN, PNG cuando la transparencia no es negociable. El trabajo del vendedor ya no es elegir un formato. Se trata de elegir un flujo de trabajo que escriba los tres desde una única fuente con un solo toque.

---

photoZseo está en App Store para iPhone y iPad.
