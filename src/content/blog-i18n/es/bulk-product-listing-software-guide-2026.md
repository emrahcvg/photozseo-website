---
title: "Software de listado masivo de productos: cómo funcionan las cargas CSV/XLSX en Amazon, eBay, Etsy, Shopify y Trendyol (2026)"
description: "Cómo cargar productos de forma masiva: la plantilla de cada plataforma, los campos obligatorios y las reglas de URL de imágenes para Amazon, eBay, Etsy, Shopify y Trendyol, además de una lista de verificación."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon y Trendyol aceptan cargas de hojas de cálculo. Etsy no lo hace: su centro de ayuda dice que no se pueden cargar nuevos listados de forma masiva, solo editar de forma masiva los existentes."
  - "Las imágenes de una hoja de cálculo casi siempre son URL, no archivos adjuntos. La URL debe ser pública, directa y (en Shopify y eBay) comenzar con https://."
  - "Las plantillas difieren según la categoría en Amazon, eBay y Trendyol, así que descargue una plantilla nueva para cada categoría y nunca cambie el nombre de sus encabezados."
faqs:
  - q: "¿Cómo subo productos de forma masiva a eBay?"
    a: "En Seller Hub, vaya a Informes, luego Cargar y elija Obtener plantilla con la fuente de Listados. Complete el archivo y cárguelo; eBay enumera los elementos según lo especificado. Utilice CSV o XLSX."
  - q: "¿Puedo cargar nuevos listados de forma masiva a Etsy con un CSV?"
    a: "El centro de ayuda de Etsy dice que no puede cargar listados nuevos de forma masiva, aunque puede copiar listados y editar de forma masiva los existentes. Existen herramientas de terceros, pero no son una característica de Etsy."
  - q: "¿Shopify necesita URL de imágenes en el CSV?"
    a: "Sí. Las URL de las imágenes en el CSV deben ser de acceso público, usar https:// y no tener protección con contraseña. Shopify descarga las imágenes durante la importación."
  - q: "¿Qué codificación de archivo debe utilizar un CSV del producto Shopify?"
    a: "El centro de ayuda de Shopify solicita UTF-8 con finales de línea estilo LF, separados por comas, con los encabezados en la primera línea. Verifique la configuración de exportación de su aplicación de hoja de cálculo."
  - q: "¿Dónde subo un archivo de producto de Excel en Trendyol?"
    a: "En el panel del vendedor, en Producto, luego Operaciones de productos a granel, utilizando la opción de entrada de productos de Excel y el tipo de carga de Nuevo producto. Cada categoría tiene su propia plantilla."
  - q: "¿Por qué se rechazó mi carga masiva?"
    a: "Las causas habituales son encabezados de columna editados, campos obligatorios faltantes, URL de imágenes privadas o de redireccionamiento y una plantilla de la categoría incorrecta. Arregla el archivo y vuelve a subirlo."
---

La carga masiva de productos significa preparar una hoja de cálculo (CSV o XLSX) con una fila por producto y cargarla una vez en lugar de crear cada listado a mano. eBay, Shopify, Amazon y Trendyol lo admiten; Etsy no permite la creación masiva de nuevos listados. Las dos reglas que causan la mayoría de las fallas son las mismas en todas partes: mantener los encabezados de la plantilla exactamente como se indican y proporcionar cada imagen como una URL directa y pública.

*Última verificación: noviembre de 2026. Fuentes verificadas: Centro de ayuda Shopify, "Uso de archivos CSV para importar y exportar productos"; Ayuda de eBay Seller Hub, "Crear listados de forma masiva" (Informes de Seller Hub > Cargar); Centro de ayuda Etsy, "¿Puedo crear o editar varios listados a la vez?"; Ayuda de Amazon Seller Central, "Plantillas de archivos de inventario" y "Problemas de imagen" (leer a través de extractos de búsqueda, ver la nota a continuación); Trendyol Akademi Satıcı Bilgi Merkezi, "Excel Ürün Girişi" y "Ürün Görseli Seçimi ve Yükleme" (leer mediante extractos de búsqueda).*

## ¿Cómo maneja cada plataforma la carga masiva?

| Plataforma | ¿Creación masiva? | Dónde | tipo de archivo | Regla de imagen |
|---|---|---|---|---|
| Shopify | Sí | Productos > Importar | CSV, UTF-8, separados por comas | URL https:// públicas |
| eBay | Sí | Centro de vendedores > Informes > Cargar > Obtener plantilla | CSV o XLSX | URL https://, hasta 12 por listado, separadas por \ |  |
| Amazon | Sí | Agregar productos mediante carga (Seller Central) | Plantilla de archivo de inventario específico de categoría | URL directa; Se rechazan los redireccionamientos y las ventanas emergentes. |
| Trendyol | Sí | Producto > Operaciones de productos a granel > Entrada de producto en Excel | Excel, una plantilla por categoría | Enlace en la columna Enlace de imagen |
| Etsy | No (solo editar) | Administrador de tienda > Listados | No aplicable | No aplicable |

## ¿Cómo se cargan productos de forma masiva a Shopify?

El centro de ayuda de Shopify establece el formato: la primera línea debe ser encabezados de columna, las columnas están separadas por comas y el archivo debe ser UTF-8 con finales de línea LF. Para productos nuevos solo se requiere `Title`; si utiliza variantes, también se requiere `URL handle`. Las columnas de variantes, como SKU, también necesitan `Option1 name` y `Option1 value`; de lo contrario, Shopify crea una variante predeterminada y elimina las existentes al actualizar.

Las imágenes deben ser URL `https://` accesibles públicamente sin protección con contraseña. Shopify los descarga durante la importación, para que puedas eliminarlos después. Los nombres de los archivos de imagen no se pueden editar después de la carga y no pueden incluir los sufijos `_thumb`, `_small` o `_medium`. Los vídeos y modelos 3D no son compatibles con CSV.

| Límite | Valor (Centro de ayuda Shopify) |
|---|---|
| Opciones por producto | 3 |
| Imágenes por producto | 250 |
| Etiquetas por producto | 250 |
| Texto alternativo | 512 caracteres como máximo, se recomiendan 125 o menos |
| Título SEO | 70 caracteres |
| Descripción SEO | 320 caracteres |

Causas de falla conocidas en la misma página: falla un archivo con las columnas `Barcode` y `Barcodes`; falla un conjunto parcial de columnas de dimensiones empaquetadas; con la sobrescritura activada, las celdas en blanco borran los valores existentes. Para una comparación más profunda con la ruta API, consulte [Shopify CSV frente a API](/es/blog/shopify-csv-vs-api-2026).

## ¿Cómo se cargan listados de forma masiva a eBay?

La herramienta actual de eBay son los informes de Seller Hub. Vaya a Cargar, haga clic en Obtener plantilla, elija la fuente de Listados y un tipo de archivo. XLSX es el valor predeterminado y se recomienda CSV para vendedores avanzados; una descarga XLSX puede incluir hasta 10 categorías, cada una en su propia hoja. Cargue el archivo completo y eBay enumerará los elementos según lo especificado.

Los campos obligatorios para agregar un listado incluyen Acción, ID de categoría, Título (80 caracteres como máximo), Formato, Duración, Precio inicial, Cantidad, ID de condición, Descripción y URL de la foto del artículo. El sitio de EE. UU. también requiere un UPC (o equivalente) en la columna correspondiente del artículo específico, y las categorías de libros necesitan un ISBN.

Las URL de imágenes deben comenzar con `https://`, terminar en una extensión de archivo como `.jpg` o `.png`, tener menos de 2048 caracteres y reemplazar los espacios con `%20`. Puede enumerar hasta 12 imágenes por listado, separadas por el carácter de barra vertical (`|`). Las imágenes pueden alojarse en ellas mismas o en eBay Picture Services. Para variaciones, la fila principal deja la cantidad y el precio vacíos y cada fila secundaria tiene la suya propia.

## ¿Cómo se cargan productos de forma masiva a Amazon?

Amazon utiliza plantillas de archivos de inventario específicas de categorías, generadas desde la página Agregar productos mediante carga en Seller Central. Para los artículos que aún no están en el catálogo, utilice la plantilla de producto, que marca los atributos como requeridos, requeridos condicionalmente o recomendados. Para los artículos que ya están en el catálogo, puede buscar por ID de producto y utilizar un archivo precargado. Después de cargarlo, seleccione el tipo de archivo coincidente y revise el informe de procesamiento de cada SKU.

Para las imágenes, la página de ayuda "Problemas de imagen" de Amazon dice que no se aceptará una ventana emergente o una URL de redireccionamiento y que la carga no se procesará, por lo que la URL debe apuntar directamente al archivo de imagen. Las rutas de menú y los tipos de archivos aceptados varían según la región del mercado, así que siga las instrucciones de la plantilla que descargue. Para conocer las dimensiones de la imagen, consulte [Especificaciones de la foto del producto de Amazon](/es/blog/amazon-product-photo-specs-2026).

## ¿Puedes realizar cargas masivas a Etsy?

No para nuevos listados. El centro de ayuda de Etsy indica que no se pueden cargar nuevos listados de forma masiva y sugiere crear un listado y copiarlo. Puede editar en masa listados existentes desde Shop Manager, incluidos títulos, etiquetas, descripciones, precios, opciones personalizadas, perfiles de procesamiento y perfiles de entrega. Las herramientas que afirman crear listados Etsy de forma masiva son productos de terceros y no una característica de Etsy, así que verifique sus términos y acceda a la API usted mismo.

## ¿Cómo se cargan productos de forma masiva a Trendyol?

En el panel del vendedor, abra Producto, luego Operaciones de productos a granel y use la opción de entrada de productos de Excel. El Centro de información del vendedor de Trendyol describe una plantilla por categoría, identificada por un código de categoría y el tipo de carga "Yeni Ürün Ekle" (agregar nuevo producto). Las imágenes se encuentran en la columna Enlace de imagen (Görsel Linki). Trendyol también documenta un método de galería: primero cargue imágenes en la Galería de imágenes, con nombres de archivo iguales al código de barras del producto (para varias imágenes, código de barras_1, código de barras_2), luego copie esos nombres en la columna. No cambie el formato de la plantilla antes de cargarla.

El texto del panel puede cambiar, así que confirme los pasos con la plantilla dentro de su propia cuenta de vendedor. Para conocer las reglas de imagen en Trendyol y Hepsiburada, consulte [Fotos de productos Trendyol y Hepsiburada](/es/blog/trendyol-hepsiburada-product-photos).

## ¿Cuáles son los errores de carga masiva más comunes?

1. Encabezados editados o renombrados. Las plantillas coinciden con el texto del encabezado. No los traduzcas ni los reordenes.
2. Plantilla de categoría incorrecta. Las plantillas Amazon, eBay y Trendyol difieren según la categoría.
3. URL de imágenes que no son directas. Un enlace a una página web, una redirección o una carpeta protegida por inicio de sesión falla.
4. Espacios y caracteres especiales en URL. Codifica espacios (eBay solicita `%20`).
5. Codificación o delimitador incorrecto. Excel puede exportar punto y coma o texto que no sea UTF-8.
6. Identificadores duplicados o faltantes (SKU, código de barras, identificador de URL).
7. Sobrescribe sorpresas. En Shopify, las celdas en blanco pueden borrar los datos existentes.

## Lista de verificación previa a la carga

- Descargue una plantilla nueva para cada categoría y plataforma.
- Prueba con 5 filas antes del catálogo completo.
- Abra la URL de cada imagen en una ventana privada del navegador; debería mostrar la imagen en sí.
- Verifique los límites de título, descripción y etiquetas con las pautas actuales de la plataforma.
- Mantenga una copia de seguridad del archivo fuente y del informe de errores de la plataforma.

## Donde encaja photoZseo

La carga masiva de archivos solo funciona tan bien como las imágenes y el texto que contienen. photoZseo prepara fotografías de productos para 46 mercados (cambio de tamaño, compresión, nombres de archivos SEO, eliminación de fondo en el dispositivo) y exporta CSV, XLSX o JSON desde las aplicaciones iPhone y iPad. No aloja imágenes ni las carga en mercados por usted, aparte de enviar productos a Shopify. Obtén la aplicación en el [pagina de descarga](/es/download). El [Extensión de Chrome](/es/chrome-extension) hace lo mismo con las páginas de productos que navega en una computadora.

*photoZseo no está afiliado ni respaldado por ningún mercado. Los nombres del mercado se utilizan únicamente para describir la compatibilidad.*

*Nota: Las páginas Amazon Seller Central y Trendyol Akademi no se pudieron abrir en su totalidad durante la verificación, por lo que los detalles de esas dos plataformas provienen de extractos de búsqueda de las páginas oficiales. Consulte siempre las instrucciones de la plantilla dentro de su propia cuenta.*
