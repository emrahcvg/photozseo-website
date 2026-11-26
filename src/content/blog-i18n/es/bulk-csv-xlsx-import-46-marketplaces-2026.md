---
title: "Importación masiva de CSV/XLSX a 46 mercados: detección automática de 41 plataformas"
description: "Coloque una exportación Shopify, Amazon o Etsy en photoZseo. Detectamos 41 firmas de plataformas, extraemos fotografías en paralelo y las reexportamos a 46 mercados."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo acepta catálogos CSV, TSV, XLSX y JSON y detecta automáticamente 41 firmas de plataforma en los encabezados de las columnas del archivo."
  - "Las fotos de los productos se extraen en paralelo de las URL del archivo. Alterna Wi-Fi solo si no deseas quemar datos móviles."
  - "Vuelva a exportar el mismo catálogo a 46 mercados, cada uno con sus propios nombres de archivo SEO, tamaños de imagen correctos para la plataforma y orden de columnas."
faqs:
  - q: "¿Qué formatos de archivo puedo importar a photoZseo?"
    a: "CSV, TSV, XLSX y JSON. Cada uno puede contener títulos de productos, descripciones, precios, SKU, códigos de barras y URL de fotografías. La mayoría de los vendedores incluyen su exportación Shopify o Amazon existente y omiten el mapeo por completo."
  - q: "¿Qué significa en la práctica \"detectar automáticamente 41 firmas de plataforma\"?"
    a: "photoZseo inspecciona los encabezados de las columnas del archivo y los compara con 41 esquemas de exportación de plataformas conocidas: Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce y 33 más. Si su archivo proviene de una de esas plataformas, el mapeo es automático."
  - q: "¿La importación de fotos desde URL utiliza mis datos móviles?"
    a: "Sólo si lo permites. Hay una opción de solo Wi-Fi en la configuración de importación, activada de forma predeterminada. Cuando está activado, las descargas se pausan y se reanudan automáticamente cuando cambias de red. Apagado, utilizará cualquier conexión que esté activa."
  - q: "¿Qué pasa si mi catálogo tiene 5.000 productos?"
    a: "photoZseo importa en lotes y mantiene la interfaz de usuario receptiva. Las descargas de URL de fotos se ejecutan en paralelo: el límite práctico es su ancho de banda, no la aplicación. Un catálogo de 5000 filas con URL de fotografías suele llegar en 10 a 20 minutos a una red Wi-Fi doméstica estándar."
  - q: "¿Puedo reexportar a un mercado diferente al de origen?"
    a: "Sí, ese es el punto. Importe un catálogo Shopify, presione exportar, elija Amazon (o Etsy o Trendyol). photoZseo reconstruye el archivo en el orden exacto de las columnas de la plataforma de destino, con imágenes redimensionadas según las especificaciones de esa plataforma."
---

La parte más difícil de vender en un nuevo mercado no es el mercado. Se trata de incorporar sus 800 productos existentes sin tener que volver a escribir cada título, volver a cargar cada foto y reasignar cada columna.

La importación masiva del catálogo de photoZseo se encarga del viaje de ida y vuelta. Introduzca un archivo que ya tenga y estará en el 80% del camino hacia una nueva plataforma.

## Por qué existe la importación masiva

Si eres un vendedor de Logística de Amazon Amazon que agrega Trendyol, una tienda Etsy que se expande a TikTok Shop o una tienda Shopify que se muda a Walmart, tu catálogo ya existe. Lo exportaste una vez. El problema es que cada plataforma utiliza un esquema ligeramente diferente: diferentes nombres de columnas, diferentes especificaciones de imagen, diferentes taxonomías de productos. La solución manual son horas de trabajo en hojas de cálculo por canal nuevo.

photoZseo lo reduce a minutos.

## lo que se importa

El importador lee cuatro formatos:

- CSV: exportaciones de productos Shopify, cargas de archivos planos Amazon, plantillas masivas Trendyol.
- TSV: variantes separadas por pestañas de sistemas más antiguos o internos.
- XLSX: archivos de Excel con catálogos de varias hojas.
- JSON: exportaciones de API o feeds de productos internos.

Cada uno puede contener títulos, descripciones, precios, SKU, códigos de barras, ejes variantes (tamaño, color), inventario y, fundamentalmente, URL de fotografías. Una vez que están en photoZseo, los mismos datos generan cotizaciones, exportaciones y autocompletar SEO.

## Detección automática en 41 plataformas

La característica principal no es la compatibilidad con el formato. Es la detección automática.

photoZseo inspecciona los encabezados de las columnas del archivo y los compara con 41 esquemas de exportación de plataformas conocidos:

- Mercados occidentales: Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- Turco: Trendyol, Hepsiburada, N11
- Asia transfronteriza: AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- América Latina: Mercado Libre, Coupang
- Europa: Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...y 17 más.

Si su archivo proviene de alguno de estos, photoZseo lo reconoce al soltarlo. Sin asistente de mapeo de columnas. No aparece el mensaje "¿Qué significa este encabezado?". Simplemente funciona.

## Las URL de las fotos se extraen en paralelo

La mayoría de las exportaciones de catálogos incluyen URL de fotografías, no imágenes incrustadas. photoZseo los descarga en paralelo: múltiples conexiones, reintentos inteligentes, deduplicación de hash perceptual para que la misma foto del producto no se importe dos veces.

Hay una opción de solo Wi-Fi que está activada de forma predeterminada. Con él encendido:

- Las descargas se detienen cuando sales de Wi-Fi y se reanudan cuando regresas.
- No hay sorpresas celulares en tu factura telefónica.
- Una importación de 2000 productos no agotará su plan de datos.

Cuando está apagado, photoZseo usa cualquier conexión que esté activa, lo que resulta útil en un escritorio con Wi-Fi de oficina.

## Un flujo de trabajo práctico

Este es el viaje de ida y vuelta que realizan la mayoría de los vendedores:

Paso 1: exportar desde la plataforma de origen. Shopify, Amazon o Etsy le permiten descargar su catálogo como CSV/XLSX. Cógelo.

Paso 2: suelte el archivo en photoZseo. En iPhone, presione Importar en cualquier proyecto. En iPad, arrástrelo desde Archivos. La detección automática identifica la plataforma y comienza a extraer las URL de las fotos en segundo plano.

Paso 3: Deje que [La IA llena los campos de SEO](/features/seo-filenames). photoZseo escribe título, slug, meta descripción, texto alternativo, etiquetas y palabras clave para cada producto, en 12 idiomas si vende internacionalmente.

Paso 4: Exportar a un nuevo mercado. Elija el destino: Amazon, Trendyol, Walmart, lo que sea. photoZseo reescribe el archivo en el orden exacto de las columnas de esa plataforma, cambia el tamaño de las imágenes según las especificaciones de la plataforma y empaqueta el resultado como un único ZIP.

Paso 5: sube al nuevo canal. El archivo de salida está listo para cualquier herramienta de carga masiva que utilice el destino.

Lo que solía ser una semana de trabajo con hojas de cálculo es una pausa para el almuerzo de 30 minutos.

## Por qué esto es importante para los vendedores transfronterizos

El mayor obstáculo para expandirse más allá de su mercado local es el costo de conversión del catálogo. La mayoría de los vendedores permanecen en Amazon US no porque Amazon US sea el mejor, sino porque pasar a Mercado Libre o Trendyol significa reconstruir el catálogo desde cero.

La importación masiva + 46 ajustes preestablecidos del mercado elimina ese bloqueador. Los mismos datos de producto fluyen a todos los canales. Los nuevos mercados son una función de alternancia, no un proyecto.

Para los vendedores independientes que desean realizar envíos a todo el mundo sin contratar a un administrador de catálogo, este es el desbloqueo.
