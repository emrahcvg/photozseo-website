---
title: "Foto del producto SEO 2026: los 13 campos que Google y ChatGPT realmente leen"
description: "Un desglose campo por campo de lo que los motores de búsqueda y los LLM extraen de una lista de productos en 2026, y las 13 entradas que mueven la aguja para ambos."
pubDate: 2026-05-12
readingMinutes: 9
tags: [seo, product-photos, ai, llm, e-commerce]
tldr:
  - "La clasificación de Google para 2026 indica SEO de imágenes fusionadas con datos estructurados del producto: el texto alternativo, el nombre de archivo y la meta descripción ahora tienen el mismo peso que el título."
  - "Los LLM como ChatGPT y Perplexity extraen productos de listados leyendo 13 campos específicos. Si te saltas uno, tu producto desaparecerá de la respuesta."
  - "Llenar los 13 campos a mano lleva entre 8 y 12 minutos por producto. El autocompletado impulsado por IA lo reduce a menos de 30 segundos sin cambiar las entradas que buscan los motores de búsqueda."
faqs:
  - q: "¿Google todavía lee texto alternativo de imágenes en 2026?"
    a: "Sí. El texto alternativo sigue siendo la señal en imagen más importante para la búsqueda de imágenes de Google y ahora también alimenta el gráfico de compras y las descripciones generales de IA de Google. Los documentos filtrados de Content Warehouse de 2025 confirmaron que `image.alt` es un campo de indexación de primer nivel."
  - q: "¿Los LLM como ChatGPT leen las páginas de productos directamente?"
    a: "ChatGPT (a través de Bing), Perplexity (a través de Bing y Brave) y Claude (a través de herramientas web) obtienen páginas de productos y analizan el texto visible más el bloque de datos estructurados JSON-LD. Priorizan el título, la descripción, el precio, la marca y el texto alternativo de la imagen, exactamente los campos que indexa un rastreador compatible con el mapa del sitio."
  - q: "¿Cuál es el campo de SEO más subestimado en la página de un producto en 2026?"
    a: "El nombre del archivo de la imagen. Los vendedores lo dejan como `IMG_0421.jpg` y pierden un espacio gratuito para palabras clave. Cambiar el nombre del archivo a `walnut-cutting-board-large.jpg` proporciona a la búsqueda de imágenes Google y a las consultas de imágenes inversas una cadena limpia para indexar."
  - q: "¿Cuánto tiempo debe tener la meta descripción de un producto?"
    a: "150–160 caracteres. Cualquier cosa más larga se trunca en el SERP de Google y en las citas de fuentes de ChatGPT. Cualquier cosa más corta indica contenido escaso."
  - q: "¿Debo escribir texto alternativo diferente para el mismo producto en diferentes mercados?"
    a: "Sí, pero sólo es necesario cambiar la densidad de palabras clave. Amazon recompensa el texto alternativo descriptivo de menos de 100 caracteres con la marca y el material. Etsy prefiere un fraseo basado en la artesanía y el estilo. El índice de Google trata el texto alternativo de su propio escaparate como canónico."
---

El cambio en 2026 será silencioso pero total. Las descripciones generales de IA de Google ahora citan listados de productos de la misma manera que citan párrafos de Wikipedia. La búsqueda web de ChatGPT lee el escaparate de su tienda y recomienda su producto por nombre. Perplexity devuelve tres competidores y una banda de precios antes de que un comprador haya escrito media consulta.

Si la foto de tu producto llega como `IMG_0421.jpg` sin texto alternativo y con una descripción de 12 palabras, eres invisible para los tres.

Esta guía desglosa los 13 campos que los motores de búsqueda y los grandes modelos de lenguaje leerán realmente en 2026, clasificados por impacto, con el formato exacto que cada uno espera.

## Por qué el SEO de imágenes cambió en 2026

Este año cambiaron tres cosas.

1. El lanzamiento de Google AI Overview finalizó en marzo. Las resúmenes ahora aparecen en más del 64% de las consultas comerciales y citan páginas fuente. Las citas favorecen los datos de productos estructurados: las páginas con un esquema de producto JSON-LD completo se citan entre 3 y 4 veces más a menudo que las páginas con solo HTML.
2. Se lanzaron ChatGPT Search y Perplexity Shopping. Ambos LLM leen el título, la descripción, el texto alternativo de la imagen y el precio de la página de un producto y los muestran dentro de la respuesta del chat. No hay ningún paso de "hacer clic para ver": el comprador ve la descripción del producto palabra por palabra dentro de la respuesta de LLM.
3. Apple Foundation Models en iOS 26 + iPadOS 26 + macOS Sequoia. Los LLM en el dispositivo ahora generan una copia del producto que coincide con lo que leen los LLM del lado del servidor. Los vendedores independientes finalmente pueden producir listados legibles para LLM sin pagarle a un redactor.

El resultado neto: los mismos 13 campos ahora sirven tanto a Google como a los LLM. Cubrirlos bien ya no son dos trabajos.

## Los 13 campos clasificados por impacto

| # | Campo | que hace | Impacto Google | Impacto del LLM |
|---|-------|-------------|---------------|------------|
| 1 | Título | El identificador principal del producto en cada superficie. | Crítico: H1 + título de la página + datos estructurados | Crítico: primer campo que citan los LLM |
| 2 | Babosa | Segmento de ruta de URL, clasificación según la palabra clave en la URL | Alto: señal en la página entre los 3 principales | Medio: los LLM prefieren URL limpias |
| 3 | Nombre del archivo | Nombre del archivo de imagen, indexado por la búsqueda de imágenes Google | Alto: alimenta la búsqueda de imágenes inversa | Medio: utilizado como respaldo de texto alternativo |
| 4 | Categoría | Nodo de taxonomía al que pertenece el producto | Alto: alimenta el gráfico de compras | Alto: reduce el alcance de la respuesta LLM |
| 5 | Meta descripción | El tono de 150 a 160 caracteres en las SERP | Alto: impulsa el CTR | Alto: fuente de citas textuales |
| 6 | Descripción completa del producto | Copia de formato largo en la página del producto. | Crítico: texto de clasificación principal | Crítico: contexto primario de LLM |
| 7 | Texto alternativo | El texto que se muestra cuando la imagen no se carga. | Crítico para la búsqueda de imágenes | Alto: los LLM se utilizan como título de imagen |
| 8 | Etiqueta 1 (estilo) | Descriptor de estilo o atributo | Medio: búsqueda por facetas de feeds | Medio: refina los filtros LLM |
| 9 | Etiqueta 2 (material) | Composición o tejido | Medio | Medio |
| 10 | Etiqueta 3 (caso de uso) | Para que sirve el producto | Medio | Alto: coincide con la intención del comprador |
| 11 | Etiqueta 4 (audiencia) | ¿Para quién es el producto? | Medio | Alto: refina la coincidencia de personalidad de LLM |
| 12 | Palabras clave | Sugerencias de índice separadas por comas (meta palabras clave + internas) | Bajo para Google | Medio: aumenta la recuperación de LLM |
| 13 | Código de barras (GTIN/UPC/EAN) | Identificador único | Alto: alimenta la deduplicación del gráfico de compras | Alto: elimina la ambigüedad de la respuesta del LLM |

El orden importa. Los vendedores que optimizan solo los campos 1 y 6 dejan vacío el resto del embudo de descubrimiento.

## Cómo los LLM leen listados de productos

Esto es lo que sucede cuando un comprador escribe "la mejor tabla de cortar de nogal para un apartamento de 1 dormitorio" en Perplexity en mayo de 2026.

1. Perplexity emite una búsqueda web a través de Brave Search.
2. Los 8 primeros resultados se obtienen en paralelo.
3. Cada página se analiza para: esquema `<title>`, `<meta description>`, JSON-LD `Product`, todo el texto `<img alt="">` y los primeros 2000 caracteres visibles del cuerpo.
4. El LLM vuelve a clasificar los 8 resultados por coincidencia semántica: ¿la página describe una tabla de nogal del tamaño de cocinas pequeñas?
5. Los 3 primeros se resumen en una respuesta de 60 palabras con citas en línea.

Gana una página que tenga `<title>Walnut Cutting Board – 12" Compact</title>`, un texto alternativo como `walnut cutting board for small apartments, 12 inch` y una descripción que diga "diseñada para estudios y cocinas de 1 dormitorio". Una página con `<title>Cutting Board</title>` y texto alternativo `image1.jpg` pierde, incluso si la foto es mejor.

El comportamiento de ChatGPT es casi idéntico, con una diferencia: ChatGPT también lee el nombre del archivo y lo utiliza como título alternativo cuando falta el texto alternativo. Eso hace que el nombre del archivo sea un segundo espacio de texto alternativo; la mayoría de los vendedores lo desperdician.

## La canalización en el dispositivo

Generar los 13 campos manualmente lleva entre 8 y 12 minutos por producto. En 200 SKU, son más de 30 horas de escritura.

La alternativa 2026 es un LLM en el dispositivo que lee la foto y escribe los 13 campos de una sola vez. El marco Foundation Models de Apple (iOS 26+, iPadOS 26+, macOS Sequoia) ejecuta un LLM de 3 mil millones de parámetros localmente sin ida y vuelta del servidor ni análisis.

photoZseo utiliza el marco Apple Foundation Models junto con el marco Vision para:

1. Detecta el objeto en la foto (`VNClassifyImageRequest` de Vision).
2. Extraiga cualquier texto visible: etiquetas, embalaje, números de modelo (`VNRecognizeTextRequest` de Vision).
3. Extraiga EXIF ​​y datos de color calculados.
4. Entregue las señales estructuradas a Foundation Models, que escribe los 13 campos en el idioma elegido en 12 configuraciones regionales admitidas.

Tiempo de salida por foto: menos de 30 segundos, 100% sin conexión, cero datos salen del dispositivo.

Los campos que produce se asignan directamente a la tabla anterior:

- Título (60 a 80 caracteres, palabras clave cargadas al principio)
- Slug (minúsculas, con guiones, seguro para ASCII)
- Nombre de archivo (seguro para URL, descriptivo, sufijo JPEG/PNG/WebP)
- Categoría (asignada al nodo de taxonomía del mercado más cercano)
- Meta descripción (150–160 caracteres)
- Descripción completa del producto (180 a 400 palabras)
- Texto alternativo (menos de 100 caracteres, palabra clave natural)
- 4 etiquetas (estilo, material, caso de uso, audiencia)
- Palabras clave (8 a 12 separadas por comas)
- Marcador de posición de código de barras si la foto muestra uno

Cada campo es editable: la IA es un borrador, no un veredicto.

## Una lista de verificación táctica antes de publicar

Ejecute esto en el próximo producto que cargue en cualquier mercado.

- [] El título contiene la palabra clave principal en los primeros 40 caracteres.
- [] Slug está dividido con guiones, en minúsculas, sin guiones bajos y con menos de 60 caracteres.
- [] El nombre del archivo describe el producto, nunca `IMG_*`, `DSC_*` o un UUID.
- [] La categoría coincide con la taxonomía existente del mercado (Amazon Browse Node, categoría Etsy, Shopify Smart Collection).
- [] La meta descripción tiene entre 150 y 160 caracteres y termina sin punto si necesita todos los caracteres.
- [ ] La descripción del cuerpo incluye material, dimensiones, uso previsto y audiencia en el primer párrafo.
- [] El texto alternativo describe la foto, no el resumen del producto: `"walnut cutting board on white background"`, no `"walnut cutting board for sale"`.
- [ ] Al menos una etiqueta por eje de atributo: estilo, material, caso de uso, audiencia.
- [] Las palabras clave son exclusivas de este SKU y no se copian y pegan en todo el catálogo.
- [] El código de barras (GTIN/UPC/EAN) se completa si tiene uno; los códigos de barras vacíos perjudican la elegibilidad de Shopping Graph.

Un listado que pasa los diez cuadros se rastrea, indexa y cita. Un listado que falla tres o más sale completamente de la descripción general.

## Por qué las "páginas de productos delgadas" perderán en 2026

La actualización de contenido útil de 2024 de Google se fusionó con el algoritmo central a finales de 2025. Las páginas con descripciones de 50 palabras y sin datos estructurados ahora se clasifican como comercio reducido y se degradan en el SERP independientemente de los vínculos de retroceso.

Los LLM los penalizan aún más. No se puede citar una página de producto sin descripción porque no hay nada que citar. Perplexity lo omitirá y citará la página debajo.

Este es el mayor cambio de comportamiento de 2026: la cita de LLM es el nuevo fragmento destacado, y un fragmento destacado necesita texto para citar.

## la comida para llevar

Los 13 campos no son opcionales. Ellos son el índice. Ya sea que un comprador llegue a través de la búsqueda de imágenes Google, una descripción general de IA, una recomendación de ChatGPT o una comparación de Perplexity, los mismos 13 campos deciden si su producto está en la respuesta.

La buena noticia: llenarlos bien ya no es una tarea de 10 minutos por SKU. La IA en el dispositivo ahora redacta el conjunto completo en menos de un minuto. El trabajo del vendedor en 2026 es revisar y perfeccionar, no escribir.

---

photoZseo está en App Store para iPhone y iPad.
