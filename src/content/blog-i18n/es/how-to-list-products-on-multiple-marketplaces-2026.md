---
title: "Cómo publicar productos en varios mercados a la vez (flujo de trabajo 2026)"
description: "Un flujo de trabajo multicanal paso a paso: un registro maestro de producto, un conjunto de fotografías de origen, luego cambio de tamaño por mercado, títulos y comprobaciones para Amazon, eBay y Etsy."
pubDate: 2026-11-27
readingMinutes: 7
tags: [multichannel, marketplaces, product-photos, listing, workflow]
tldr:
  - "Cree un registro maestro (datos más un conjunto de fotografías de alta resolución) una vez y luego derive la versión de cada mercado a partir de él en lugar de comenzar cada listado desde cero."
  - "Fotos y títulos son las partes que deben cambiar por canal; Los identificadores, las especificaciones y la lógica de precios deben permanecer en el registro maestro."
  - "Consulte las pautas oficiales actuales de cada canal antes de cargarlo. eBay y Etsy publican una guía de tamaño clara; para Amazon, lea las reglas en vivo de Seller Central para su categoría."
faqs:
  - q: "¿Puedo publicar el mismo producto en Amazon, eBay y Etsy?"
    a: "Sí, siempre y cuando el producto esté permitido en las reglas de cada mercado y usted siga las políticas de imagen y listado de cada canal. Etsy en particular limita lo que se puede vender según sus Estándares de creatividad, así que primero verifique la elegibilidad."
  - q: "¿Necesito una foto diferente para cada mercado?"
    a: "No es una fotografía diferente, sino normalmente una exportación diferente. Fotografíe una vez en alta resolución, luego recorte, cambie el tamaño y establezca el fondo por canal, y conserve al menos una foto sin editar del artículo real cuando un mercado la solicite (Etsy lo hace)."
  - q: "¿Qué tamaño deben tener mis fotografías maestras?"
    a: "Más grande de lo que cualquier canal necesita. Etsy recomienda enumerar fotografías de al menos 2000 píxeles de ancho y alto y eBay recomienda aproximadamente 1600 x 1600, por lo que un patrón de 2000 píxeles o más en cada lado le permite reducir la escala limpiamente."
  - q: "¿Deberían los títulos ser idénticos en todos los mercados?"
    a: "No. Mantenga los datos idénticos, pero adapte la redacción y la extensión a las reglas de título de cada canal y a cómo los compradores buscan allí. Lea las pautas de títulos actuales de cada plataforma antes de copiar un título."
  - q: "¿Se requiere una herramienta de listado multicanal?"
    a: "No. Una hoja de cálculo y una estructura de carpetas disciplinada pueden funcionar para un catálogo pequeño. Las herramientas dedicadas le ayudan una vez que gestiona la sincronización del inventario en muchos SKU y canales."
---

Para enumerar productos en varios mercados a la vez, cree un registro maestro por producto (identificadores, especificaciones, dimensiones, una descripción base y un conjunto de fotografías de alta resolución), luego genere la versión de cada mercado a partir de él: cambie el tamaño y el fondo de las fotos según las reglas de ese canal, reescriba el título de ese canal, cárguelo y ejecute una breve verificación previa a la publicación. Hacer el trabajo en ese orden es lo que evita que las ventas multicanal se conviertan en tres trabajos separados de tiempo completo.

*Última verificación: noviembre de 2026. Las fuentes se mencionan en cada sección; Las reglas del mercado cambian, así que confirme con las páginas activas antes de cargar.*

## Paso 1: crear un registro maestro de producto

Antes de abrir cualquier mercado, mantenga una fila o archivo por producto que contenga los datos que nunca cambian por canal:

- SKU internos y, donde los tengas, códigos de barras (GTIN/UPC/EAN)
- Marca, modelo, material, color, dimensiones, peso.
- Una descripción objetiva y neutral y una lista de características.
- País de origen, notas de cumplimiento y advertencias requeridas
- La ruta de la carpeta del conjunto de fotografías maestras.

Luego, cada mercado toma prestado de este registro. Cuando una especificación cambia, la arreglas una vez. Esto también te protege de una de las causas comunes de rechazo: atributos que no coinciden entre canales o entre título y foto.

## Paso 2: fotografía un conjunto de fotografías maestras

Fotografíe una vez, con la resolución práctica más alta, y mantenga los originales intactos. Un conjunto útil es:

1. Una vista frontal limpia sobre un fondo liso.
2. Dos o tres ángulos y una foto de detalle.
3. Una foto a escala o en uso.
4. Una fotografía del embalaje o de la etiqueta, cuando corresponda.

Fotografiar grandes cosas es importante porque los mercados recomiendan diferentes tamaños. Los "Requisitos y mejores prácticas para imágenes en su tienda Etsy" de Etsy recomiendan incluir fotografías de al menos 2000 píxeles de ancho y alto, y la ayuda de listado de eBay recomienda aproximadamente 1600 x 1600. Un patrón de 2000 píxeles o más por lado le permite reducir la escala de cada canal sin aumentar la escala de nada.

## Paso 3: Adapta las fotos por mercado

Aquí es donde va la mayor parte del esfuerzo por canal. La siguiente tabla enumera solo las cifras confirmadas en las páginas de ayuda de los propios mercados en noviembre de 2026.

| Mercado | Orientación confirmada | Fuente |
|---|---|---|
| eBay | Mínimo 500 x 500 píxeles; recomendado alrededor de 1600 x 1600; hasta 24 fotos por listado; máximo 12 MB por foto; fondo blanco liso sugerido como una opción segura | Centro de vendedores eBay "Toma excelentes fotografías"; Ayuda eBay "Agregar imágenes a tus listados" |
| eBay (prohibido) | Sin bordes agregados, sin texto/ilustraciones/material de marketing agregado, sin marcas de agua de ningún tipo | Política de imagen eBay |
| Etsy | Se recomienda al menos 2000 px de ancho y alto; primera foto de al menos 635 px; Es posible que los archivos de más de 1 MB no terminen de cargarse en conexiones lentas; sRGB; .jpg, .gif, .png, .svg o .heic; sin GIF animado ni PNG transparente | Ayuda de Etsy, "Requisitos y mejores prácticas para imágenes en su tienda Etsy" |
| Etsy (autenticidad) | Al menos una foto sin editar del artículo real con un fondo real. | Ayuda Etsy, mismo artículo |
| Amazon | Las imágenes principales se comprueban automáticamente en busca de fondos que no sean blancos y de texto, logotipos, gráficos o marcas de agua; Las imágenes que fallan pueden conducir a la supresión. Las reglas de píxeles y porcentaje de relleno varían según la categoría, así que lea las pautas de imágenes en vivo para la suya. | Anuncio Amazon Seller Central sobre comprobaciones de imágenes principales |

Observe lo que no está en la tabla: un único "tamaño universal". Amazon, eBay y Etsy no coinciden, por lo que una exportación de tamaño único falla en alguna parte. Nuestro [referencia de tamaños de imágenes del mercado](/es/marketplace-image-sizes) recopila los números por canal y el [guía de cambio de tamaño de múltiples mercados](/es/blog/resize-product-photos-multiple-marketplaces) cubre la mecánica de exportación por lotes.

Una regla práctica: cree una versión con fondo blanco para los canales que la favorezcan y mantenga una versión de estilo de vida o en contexto para los canales donde los compradores la esperan. No coloque marcas de agua, bordes ni texto promocional en ninguna versión. Tanto eBay como Amazon los marcan.

## Paso 4: Reescribe títulos por canal

Mantenga los hechos constantes y cambie la redacción. Cada plataforma tiene sus propias reglas de títulos, límites de personajes y convenciones, y son diferentes. No asuma que un título aceptado en un canal es válido en otro. Lea las pautas de títulos actuales para cada categoría en la que figure.

Valores predeterminados razonables que se mantienen en todos los canales:

- Liderar con el tipo de producto y el atributo distintivo que buscan los compradores.
- Poner marca y modelo donde la plataforma los espera
- Evite frases promocionales y símbolos excesivos; Los vendedores suelen informarlos como desencadenantes de rechazo, así que consulte la política de títulos de cada plataforma.
- Utilice valores de atributos consistentes (tamaño, color) en el título, la foto y los campos estructurados.

Para nombres de archivos y texto alternativo, consulte [cómo nombrar fotos de productos para SEO](/es/blog/how-to-name-product-photos-for-seo).

## Paso 5: Cargue y luego ejecute una verificación previa a la publicación

Cargue un mercado a la vez, comenzando con el más estricto para su categoría. Luego revisa:

| Controlar | Por qué es importante |
|---|---|
| La foto cumple con el tamaño y formato mínimos de ese canal. | Previene errores de carga y miniaturas suaves |
| No se agregó ninguna marca de agua, borde o texto promocional | Prohibido o marcado en eBay y Amazon |
| El fondo coincide con las expectativas del canal. | Las imágenes principales que no son blancas se verifican automáticamente en Amazon |
| Título, foto y atributos coinciden (color, tamaño, cantidad) | La falta de coincidencia es una causa común de rechazo |
| Identificadores y categoría correctos | La categoría incorrecta deja los atributos requeridos sin igual |
| Al menos una foto real sin editar (Etsy) | Requerido por la guía de imágenes de Etsy |

Si posteriormente se suprime un listado, nuestra publicación complementaria sobre [errores en la lista que hacen que los productos se supriman](/es/blog/listing-mistakes-that-get-products-suppressed-2026) explica las causas habituales.

## Errores comunes en el listado multicanal

- Reutilizar una exportación en todas partes. Un archivo Etsy compatible con 1 MB y un archivo eBay de 1600 px son exportaciones diferentes del mismo maestro.
- Editando el original. Exporte siempre copias; nunca sobrescriba el maestro.
- Copiar títulos textualmente. Las reglas y el comportamiento de búsqueda difieren según la plataforma.
- Dejar que los datos fluyan. Si el precio, las acciones o las especificaciones están en tres lugares, divergirán. Guárdelos en el registro maestro.
- Ignorando la elegibilidad. Algunos canales restringen lo que se puede vender; Los Estándares de creatividad de Etsy, por ejemplo, eliminan los listados que no califican.

## Donde encaja photoZseo

Si sus fotos de origen provienen de un teléfono, photoZseo para iOS y iPadOS 17+ pueden cambiar el tamaño, comprimir y cambiar el nombre de un conjunto de fotos para 46 mercados, eliminar fondos en el dispositivo y exportar CSV, XLSX o JSON. Si recopila fotografías y detalles de páginas de productos existentes en una computadora, el [Extensión de Chrome](/es/chrome-extension) funciona desde el panel lateral del navegador. Consulte [precios](/es/pricing) para conocer los planes. De cualquier manera, el flujo de trabajo anterior es el mismo: un maestro, muchas exportaciones.

photoZseo no está afiliado ni respaldado por ningún mercado. Los nombres del mercado se utilizan únicamente para describir la compatibilidad.
