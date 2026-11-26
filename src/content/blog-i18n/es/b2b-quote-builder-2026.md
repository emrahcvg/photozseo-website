---
title: "Generador de cotizaciones B2B para comercio electrónico: IVA, IBAN, códigos HS y firma electrónica en 2026"
description: "Una referencia de 2026 para vendedores independientes de comercio electrónico que crean cotizaciones B2B: modos de IVA, IBAN, códigos HS, Incoterms 2020, legalidad de la firma electrónica y un flujo de trabajo práctico."
pubDate: 2026-05-12
readingMinutes: 10
tags: [b2b, quote, vat, hs-codes, incoterms, e-signature]
tldr:
  - "Los vendedores independientes de comercio electrónico en 2026 recibirán solicitudes de cotización B2B de forma rutinaria (mayoristas, cadenas de tiendas de regalos, compradores de hoteles) y un documento de Word ya no es una respuesta creíble."
  - "Una cotización B2B real necesita 12 campos específicos: información del comprador, partidas individuales con IVA y unidad de medida, códigos HS, Incoterms, condiciones de pago, IBAN y una firma con un registro de auditoría."
  - "Los creadores de cotizaciones en el dispositivo (incluido el módulo de cotizaciones de photoZseo) generan cotizaciones compatibles con búsqueda de códigos HS, ajustes preestablecidos de Incoterms 2020, modos de IVA para UE, Reino Unido, EE. UU. y Turquía, validación de IBAN y firma electrónica en un solo documento."
faqs:
  - q: "¿Cuál será el estatus legal de una firma electrónica en una cotización B2B en 2026?"
    a: "En la UE, eIDAS (Reglamento 910/2014) otorga a una firma electrónica simple (SES) el mismo peso legal que una firma húmeda para contratos comerciales en casi todos los estados miembros. En Estados Unidos, la Ley ESIGN (2000) y la UETA otorgan a las firmas electrónicas el mismo efecto legal que a una firma manuscrita. En Turquía, la KVKK y la Ley de Firma Electrónica 5070 reconocen las firmas electrónicas cualificadas (QES) como equivalentes a las firmas húmedas."
  - q: "¿Necesito un código HS en una cotización B2B si el comprador se encuentra en el mismo país?"
    a: "No legalmente, pero los equipos de adquisiciones en 2026 solicitarán habitualmente el código HS de todos modos. Lo utilizan para estimar los derechos de aduana en la reexportación, mapear el producto en su ERP y filtrar el cumplimiento de listas de productos restringidos. Incluir el código HS en cada cotización (nacional e internacional) es la opción profesional predeterminada."
  - q: "¿Cuál es la diferencia entre Incoterms FOB, EXW y DDP?"
    a: "EXW (Ex Works): el comprador recoge en su almacén, el comprador paga todo. FOB (Free On Board): usted realiza la entrega en el puerto designado, el comprador se hace cargo en el ferrocarril. DDP (Delivered Duty Paid): entrega en la puerta del comprador con los derechos pagados. Los Incoterms 2020 tienen 11 términos en total; FOB, EXW y DDP cubren aproximadamente el 80% de las cotizaciones B2B independientes."
  - q: "¿Necesito escribir el monto total en palabras en una cotización B2B?"
    a: "En Turquía, Alemania, Francia, Italia y la mayoría de los países de Oriente Medio, el importe en palabras es un requisito legal en las facturas y es muy habitual en las cotizaciones. En EE. UU. y Reino Unido es opcional. Incluirlo en cada cotización es la opción predeterminada más segura: no cuesta nada y evita disputas si se copia mal un dígito."
  - q: "¿Qué modalidad de IVA se aplica si vendo desde Alemania a un comprador en Francia en 2026?"
    a: "Según el régimen OSS (ventanilla única) de la UE, las ventas B2B entre empresas registradas con IVA en la UE utilizan el mecanismo de inversión del sujeto pasivo: usted factura con 0% de IVA y el comprador lo contabiliza en su propia declaración. Debe registrar el NIF del comprador y verificarlo a través del sistema VIES. Para B2C, se cobra el tipo de IVA del país del comprador a través de la declaración trimestral de OSS."
---

La solicitud B2B se muestra así. Un mayorista envía un correo electrónico: "Vimos su tienda en Etsy. ¿Puede enviarnos un presupuesto por 100 unidades, entregadas en nuestro almacén de Bruselas, antes de agosto?"

En 2026, el vendedor que responda con un documento de Word y un enlace de PayPal perderá el contrato. El equipo de adquisiciones necesita una cotización con IVA, IBAN, códigos HS, Incoterms y una firma: el mismo paquete que reciben de un proveedor de $50M. La mayoría de los vendedores independientes no se dan cuenta de lo cerca que está ese listón.

Este artículo es la referencia: qué incluye una cotización B2B en 2026, qué se requiere legalmente y cómo producir una en menos de cinco minutos desde su teléfono.

## Por qué los vendedores independientes necesitan cotizaciones reales, no documentos de Word

Tres fuerzas convergieron. Adquisiciones digitalizadas: los sistemas ERP (SAP S/4HANA, Dynamics 365, Odoo) esperan datos de cotización estructurados con IVA y código HS por línea. Las aduanas se volvieron más estrictas: EU CBAM e ICS2 requieren códigos HS en la etapa de cotización para muchas categorías. Los compradores quieren pistas de auditoría: una cotización firmada y con marca de tiempo sobrevive a una disputa futura; un documento de Word no.

El resultado: un vendedor independiente que puede producir una cotización B2B que cumpla con las normas en cinco minutos gana contratos que solían ir al proveedor del siguiente nivel.

## Anatomía de una cotización B2B

El equipo de adquisiciones de un comprador verifica doce campos. Si se omite uno, la cotización volverá a ser revisada, lo que ralentiza la venta entre 2 y 5 días hábiles.

| # | Campo | que es | Por qué es importante |
|---|------|------------|----------------|
| 1 | Número de cotización | Identificador único por cotización | Presentación de adquisiciones, seguimiento de disputas |
| 2 | Fecha de cotización + fecha válida hasta | Cuándo se emitió la cotización y cuándo vencen los precios | Bloquea el precio de una ventana. |
| 3 | Bloqueo de vendedor | Nombre legal, dirección, NIF de IVA, contacto, oficina de impuestos | Identificación de contraparte legal |
| 4 | Bloque de comprador | Nombre legal, dirección, número de IVA y contacto del comprador | Contraparte + determinación del IVA revertido |
| 5 | Líneas de pedido | Por fila: SKU, descripción, cantidad, unidad, precio unitario, tasa de IVA, código HS, total de línea | El entregable real |
| 6 | Subtotal, IVA, total | Resumen de matemáticas | La adquisición se concilia con la orden de compra |
| 7 | Divisa | código ISO 4217 | Evita disputas cambiarias |
| 8 | cantidad en palabras | "Cuarenta y dos mil quinientos euros" | Prevención del fraude; requerido en muchas jurisdicciones |
| 9 | Incoterm | Plazo 2020 (p. ej., FOB Hamburgo, DDP Bruselas) | Define quién paga qué por el envío/aduana |
| 10 | Condiciones de pago | Net-30, 50% por adelantado, etc. | Contrato de flujo de caja |
| 11 | IBAN / bancario | IBAN, SWIFT/BIC, nombre del banco | Dónde el comprador transfiere el dinero |
| 12 | Firma | Húmedo o electrónico, con marca de tiempo | Vinculación legal |

Doce campos. Cada cotización B2B en 2026 necesita los doce.

## Modos de IVA en 2026

El IVA (impuesto sobre las ventas) es el campo en el que los vendedores independientes se equivocan con mayor frecuencia. El mapa de 2026.

| Región | Modo | cuando se aplica | Ejemplos de tarifas |
|--------|------|-----------------|---------------|
| Estado miembro de la UE | IVA nacional | Mismo país, B2B o B2C | 19 % (DE), 20 % (FR, IT), 21 % (NL, ES, BE) |
| B2B transfronterizo de la UE | Cargo revertido (0% en factura) | Vendedor de la UE → Comprador de la UE, ambos registrados con IVA | 0% (verificado vía VIES) |
| B2C transfronterizo de la UE | OSS (ventanilla única) | Vendedor de la UE → consumidor en otro estado de la UE | Tasa del país comprador, declarada vía OSS |
| Importación de la UE | IOSS (ventanilla única de importación) | Vendedor fuera de la UE → Consumidor de la UE, ≤ 150 € | Tasa del país comprador, declarada a través de IOSS |
| Reino Unido | IVA del Reino Unido | Oferta del Reino Unido (post-Brexit) | 20 % estándar, 5 % reducido, 0 % tarifa cero |
| A NOSOTROS | impuesto sobre las ventas | A nivel estatal, varía según el nexo | 0%–11% dependiendo del estado |
| Pavo | kdv | Exportaciones nacionales + seleccionadas | 1%, 10%, 20% |
| Canadá | GST/HST/QST | federal + provincial | 5% GST + superposición provincial |
| Australia | IVA | Estándar | 10% |
| Emiratos Árabes Unidos / Arabia Saudita | TINA | Estándar | 5% (EAU), 15% (KSA) |

Una cotización B2B en 2026 debe declarar el modo de IVA a nivel de encabezado (por ejemplo, "Cobro revertido: suministro intracomunitario de la UE, artículo 138 de la Directiva sobre el IVA de la UE") y la tasa por partida si la tasa varía.

## Códigos HS: por qué la aduana bloquea los envíos sin ellos

El código del Sistema Armonizado es un número de 6 a 10 dígitos que clasifica cada producto comercializado. Los primeros 6 dígitos están estandarizados a nivel mundial (OMA); los dígitos 7 a 10 son específicos de cada país (TARIC de la UE, HTSUS de EE. UU.).

Ejemplos: 9603.10 (pinceles para manualidades), 6109.10 (camisetas de algodón), 4202.32 (billeteras), 9405.41 (lámparas LED).

La Aduana utiliza el código HS para calcular los derechos, aplicar acuerdos comerciales (EPA UE-Japón, USMCA, RCEP) y detectar mercancías restringidas. Un envío con un código HS incorrecto puede retenerse durante 5 a 30 días. Un envío sin código HS se retiene hasta que se suministre uno.

La mejor práctica para 2026: busque el código HS por SKU durante la incorporación del producto, guárdelo en la base de datos del producto e imprímalo en cada cotización. El módulo Cotización de photoZseo integra la búsqueda HS a nivel de producto, por lo que el código se establece una vez y se propaga a cada cotización.

## Referencia rápida de los Incoterms 2020

Los Incoterms 2020 definen 11 términos. Tres cubren aproximadamente el 80% de las cotizaciones B2B independientes:

| Término | Significado | quien paga el envio | quien paga la aduana |
|------|---------|-------------------|------------------|
| EXW | Ex Works: el comprador recoge en su estudio | Comprador | Comprador |
| ENGAÑAR | Libre a bordo (puerto convenido) | Vendedor al puerto, luego comprador | Comprador (después del puerto) |
| DDP | Entregado con derechos pagados: puerta a puerta, todo incluido | Vendedor | Vendedor |

Los otros ocho (CIF, CIP, DAP, DPU, FCA, CPT, CFR, FAS) son comunes en el comercio industrial pero rara vez aparecen en una cotización independiente. En caso de duda, EXW para recogida local, FOB para exportación, DDP para ofertas de entrega premium.

## Estado legal de la firma electrónica

El mapa legal 2026 para la firma electrónica en documentos comerciales:

| Región | Ley aplicable | Estado |
|--------|---------------|--------|
| UE | Reglamento eIDAS 910/2014 | SES, AES, QES todos válidos; QES = firma húmeda |
| Reino Unido | Ley de comunicaciones electrónicas de 2000 | Válido para la mayoría de contratos comerciales. |
| A NOSOTROS | Ley ESIGN + UETA | Equivalente a firma húmeda |
| Pavo | Firma Electrónica Ley 5070 | QES = firma húmeda |
| Canadá / Australia / Emiratos Árabes Unidos / India | Estatutos locales | Firmas electrónicas reconocidas |

Para una cotización B2B entre dos empresas privadas, una simple firma electrónica con una marca de tiempo y un registro de auditoría del dispositivo es suficiente en casi todas las jurisdicciones. Las industrias reguladas (farmacéutica, de defensa, servicios financieros) a menudo requieren una firma electrónica calificada (QES) de un proveedor de la lista de confianza de la UE, fuera del alcance del vendedor independiente.

El módulo Quote de photoZseo incorpora una firma dibujada con el dedo en el PDF con una marca de tiempo y un identificador de dispositivo. Para artesanía, moda, accesorios y bienes de consumo al por mayor, esto es contractualmente vinculante en la UE, Reino Unido, EE. UU., Turquía, Canadá, Australia y la mayor parte de MENA.

## Flujo de trabajo práctico con photoZseo

Generación de cotizaciones de extremo a extremo en 2026:

1. El comprador bloquea los autocompletados desde el selector de contactos (nombre, dirección, número de IVA, correo electrónico).
2. Rellenos previos del perfil del remitente: su nombre legal, dirección, número de identificación fiscal, IBAN, oficina de impuestos. Configurado una vez.
3. Agregue artículos de línea: SKU, cantidad, unidad (piezas/kg/m/resma: lista completa de códigos ONU), precio unitario, tasa de IVA, código HS por línea.
4. Elija Incoterm en el menú de 11 términos y nombre el puerto/lugar (por ejemplo, "FOB Hamburgo").
5. Condiciones de pago, moneda, período de validez: Net-30, USD/EUR, 14 días por defecto.
6. Subtotal, IVA, cálculo automático total. La cantidad en palabras se genera automáticamente en el idioma activo de la aplicación.
7. Firme con el dedo o con el lápiz Apple; Campo de firma del comprador opcional para acuerdos en persona.
8. Exportar PDF: correo electrónico, AirDrop, WhatsApp Business o iCloud Drive.

Tiempo total para una cotización de 10 líneas: de 3 a 5 minutos, los 12 campos completados, registro de auditoría en los metadatos del PDF.

## Una lista de verificación práctica

Antes de enviar una cotización B2B, confirme:

- [] El número de cotización es único y secuencial.
- [] Válido hasta que se establezca la fecha (por defecto 14 días, o lo que pidió el comprador).
- [ ] Se verifica el número de identificación fiscal del comprador (VIES para la UE, HMRC para el Reino Unido).
- [ ] Cada línea tiene un código HS si la orden puede cruzar una frontera.
- [ ] El modo de IVA es correcto: nacional, inversión de cargo, OSS o exportación con tasa cero.
- [ ] Incoterm nombra la ciudad/puerto, no sólo "FOB" sino "FOB Hamburgo".
- [] Las condiciones de pago especifican el porcentaje por adelantado, si corresponde.
- [] IBAN y SWIFT son correctos (un dígito incorrecto = un cable que no lleva a ninguna parte).
- [ ] La cantidad en palabras coincide con el total numérico.
- [] La firma está presente con una marca de tiempo.

Si los diez verifican, la cotización estará lista para la adquisición.

## la comida para llevar

La oportunidad B2B para los vendedores independientes de comercio electrónico en 2026 es real y está creciendo. Mayoristas, hoteles, tiendas de regalos, compradores de regalos corporativos y compradores comerciales encuentran marcas independientes a través de Etsy, Instagram, TikTok Shop y Shopify, y quieren comprar a escala. La barrera es producir una cotización que se parece al proveedor al que ya le compran.

Un PDF de 12 campos, con IVA correcto, código HS y firmado electrónicamente ya no es algo que sólo produzcan las empresas. En 2026, es algo que un vendedor independiente escribe desde su teléfono, en su segundo idioma, en menos de cinco minutos.

Los vendedores que internalizan eso operan a un nivel diferente al de los que todavía pegan números en un documento de Word.

---

photoZseo está en App Store para iPhone y iPad.
