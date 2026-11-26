---
title: "Requisitos de la fotografía del producto Amazon en 2026"
description: "Tamaños exactos, tipos de archivos y reglas de fondo que Amazon aplica a las imágenes de productos y cómo transmitirlas en la primera carga."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "La imagen principal de Amazon debe tener un tamaño mínimo de 1000×1000 (se recomienda 2000×2000), cuadrado 1:1, fondo #FFFFFF blanco puro, JPEG, sRGB, menos de 10 MB."
  - "Las causas de rechazo más rápidas son: casi blanco en lugar de blanco verdadero, producto más pequeño que el 85% del marco, marcas de agua o texto en la imagen principal."
  - "Manténgase por debajo de 600 KB por imagen después de la compresión: la CDN de Amazon vuelve a codificar cualquier cosa más grande y con pesos de velocidad de página en su rango de conversión."
faqs:
  - q: "¿Cuál es el tamaño mínimo de imagen para las fotos de productos Amazon?"
    a: "1000 píxeles en el lado más largo es el mínimo absoluto. Debajo de eso, Amazon desactiva la función de zoom en su listado, y el algoritmo desclasifica los listados sin zoom. Apunte a 2000×2000 para que Amazon tenga espacio para volver a comprimirse sin ablandarse."
  - q: "¿JPEG o PNG son mejores para los listados Amazon?"
    a: "JPEG. Amazon también acepta TIFF, PNG y GIF, pero JPEG se comprime más pequeño, se procesa más rápido en el CDN de Amazon y no hay ningún beneficio de transparencia en un fondo #FFFFFF. Guarde en el espacio de color sRGB, calidad 80–85."
  - q: "¿Amazon requiere fondos blancos puros para cada foto?"
    a: "Solo la imagen principal: esa es la regla que Amazon aplica con comprobaciones automáticas. Las imágenes secundarias pueden mostrar el producto en contexto, en un modelo, con embalaje o en escenas de estilo de vida. La primera foto es el portero."
  - q: "¿Qué tamaño debe tener el producto en el marco?"
    a: "La pauta de Amazon es al menos el 85% de la imagen. Los productos más pequeños a menudo no pasan la revisión automática o se marcan manualmente en las auditorías de categorías. Centre el producto y recorte bien."
  - q: "¿Puedo cargar fotos HEIC desde mi iPhone a Amazon?"
    a: "No. Amazon espera JPEG, TIFF, PNG o GIF. Convierta HEIC a JPEG antes de cargarlo: el ajuste preestablecido Amazon de photoZseo hace esto automáticamente y recorta el archivo a 200–600 KB sin pérdida de calidad visible."
---

Amazon rechaza anuncios antes de que la mayoría de los vendedores los vean. El culpable casi siempre es la foto: un archivo demasiado pesado, un fondo que no es realmente blanco o una relación de aspecto que la plataforma rechaza silenciosamente.

Aquí está la hoja de referencia de especificaciones de 2026, extraída de la documentación del vendedor de Amazon y probada con listados activos.

## Reglas de la imagen principal

- Dimensiones: 1000×1000 mínimo, recomendado 2000×2000. Por debajo de 1000 en el lado más largo, Amazon no habilitará el zoom y el algoritmo trata los listados sin zoom como de menor calidad.
- Relación de aspecto: Cuadrado (1:1) para la imagen principal. Las imágenes secundarias pueden ser 4:5 o 16:9.
- Fondo: blanco puro, hexagonal `#FFFFFF`. Los estudios fotografiados "casi blancos" no pasan los controles automáticos con más frecuencia de lo que esperan los vendedores.
- Formato: JPEG (`.jpg`) es la elección más segura. Se aceptan TIFF, PNG y GIF, pero JPEG se comprime mejor y se procesa más rápido en el CDN de Amazon.
- Espacio de color: sRGB. Las imágenes guardadas en Adobe RGB o ProPhoto aparecen apagadas después de la recodificación de Amazon.
- Tamaño de archivo: Menos de 10 MB por imagen. Apunte a 200-600 KB después de la compresión: los archivos grandes ralentizan la carga de la página del producto y aceleran el peso de la página en la conversión.

## ¿Qué hace que se suprima un listado?

1. Marcas de agua, superposiciones de texto o logotipos en la imagen del producto.
2. Accesorios que no están incluidos en lo que recibirá el cliente.
3. Borde, marco o cualquier fondo que no sea blanco puro para la imagen principal.
4. Producto que ocupa menos del 85% del marco de la imagen.
5. Maniquíes (para prendas de vestir) o plataformas de soporte visibles.

## Cómo aplica photoZseo la especificación

El ajuste preestablecido Amazon dentro de photoZseo hace cuatro cosas a la vez:

1. Recorta en un marco cuadrado con el producto centrado en el 85% del lienzo.
2. Cambia el tamaño del lado más largo a 2000 píxeles (aumenta de forma inteligente si la fuente es más pequeña).
3. Escribe un JPEG limpio en sRGB, calidad 85, normalmente entre 250 y 450 KB.
4. Si la eliminación del fondo está habilitada, reemplaza el fondo en el que fotografíes con #FFFFFF puro y difumina los bordes para que el producto no parezca cortado y pegado.

Todo el proceso se realiza por teléfono. Nada sale de tu dispositivo.

## Una lista de verificación de cumplimiento rápida

Antes de subir, confirma:

- [] El lado más largo es ≥1000 px (preferiblemente 2000 px)
- [] El fondo pasa una prueba de "selector blanco": las cuatro esquinas se leen como `#FFFFFF`
- [] El archivo tiene menos de 10 MB y está guardado como JPEG.
- [] La relación de aspecto es 1:1 para la imagen principal
- [] Sin texto, marca de agua o marco

Si los cinco verifican, el listado pasará la validación automática de Amazon en el primer intento y usted se saltará el ir y venir que mata el tiempo de lanzamiento.
