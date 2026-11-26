---
title: "Importação em massa de CSV/XLSX para 46 mercados – detecção automática de 41 plataformas"
description: "Solte uma exportação Shopify, Amazon ou Etsy em photoZseo. Detectamos 41 assinaturas de plataforma, extraímos fotos em paralelo e reexportamos para 46 mercados."
pubDate: 2026-05-16
readingMinutes: 7
tags: [csv, xlsx, import, bulk-workflow, marketplaces]
tldr:
  - "photoZseo aceita catálogos CSV, TSV, XLSX e JSON — e detecta automaticamente 41 assinaturas de plataforma nos cabeçalhos das colunas do arquivo."
  - "As fotos dos produtos são extraídas paralelamente dos URLs do arquivo. Alterne o Wi-Fi apenas se não quiser queimar dados do celular."
  - "Exporte novamente o mesmo catálogo para 46 mercados, cada um com seus próprios nomes de arquivo SEO, tamanhos de imagem corretos para a plataforma e ordem de colunas."
faqs:
  - q: "Quais formatos de arquivo posso importar para o photoZseo?"
    a: "CSV, TSV, XLSX e JSON. Cada um pode conter títulos de produtos, descrições, preços, SKUs, códigos de barras e URLs de fotos. A maioria dos vendedores abandona a exportação Shopify ou Amazon existente e ignora totalmente o mapeamento."
  - q: "O que significa “detectar automaticamente 41 assinaturas de plataforma” na prática?"
    a: "photoZseo inspeciona os cabeçalhos das colunas do arquivo e os compara com 41 esquemas de exportação de plataforma conhecidos — Shopify, Amazon, Etsy, eBay, Walmart, Trendyol, AliExpress, WooCommerce e 33 outros. Se o seu arquivo veio de uma dessas plataformas, o mapeamento é automático."
  - q: "A importação de fotos de URLs utiliza meus dados móveis?"
    a: "Só se você permitir. Há uma alternância apenas de Wi-Fi nas configurações de importação, ativada por padrão. Com ele ativado, os downloads são pausados ​​e retomados automaticamente quando você troca de rede. Desligado, usará qualquer conexão ativa."
  - q: "E se meu catálogo tiver 5.000 produtos?"
    a: "photoZseo importa em lotes e mantém a IU responsiva. Os downloads de URLs de fotos são executados em paralelo – o limite prático é sua largura de banda, não o aplicativo. Um catálogo de 5.000 linhas com URLs de fotos normalmente chega em 10 a 20 minutos em uma rede Wi-Fi doméstica padrão."
  - q: "Posso reexportar para um mercado diferente do de origem?"
    a: "Sim - esse é o ponto. Importe um catálogo Shopify, clique em exportar, escolha Amazon (ou Etsy ou Trendyol). photoZseo reconstrói o arquivo na ordem exata das colunas da plataforma de destino, com imagens redimensionadas de acordo com as especificações dessa plataforma."
---

A parte mais difícil de vender em um novo mercado não é o mercado. É incluir seus 800 produtos existentes sem redigitar todos os títulos, reenviar todas as fotos e remapear todas as colunas.

A importação de catálogo em massa do photoZseo cuida do processo de ida e volta. Insira um arquivo que você já possui e você estará 80% do caminho para uma nova plataforma.

## Por que existe a importação em massa

Se você é um vendedor Amazon FBA adicionando Trendyol, uma loja Etsy expandindo para TikTok Shop ou uma loja Shopify mudando para Walmart, seu catálogo já existe. Você exportou uma vez. O problema é que cada plataforma fala um esquema ligeiramente diferente – nomes de colunas diferentes, especificações de imagem diferentes, taxonomias de produtos diferentes. A correção manual são horas de trabalho em planilhas por novo canal.

photoZseo reduz para minutos.

## O que é importado

O importador lê quatro formatos:

- CSV — exportações de produtos Shopify, uploads de arquivos simples Amazon, modelos em massa Trendyol.
- TSV — variantes separadas por guias de sistemas mais antigos ou internos.
- XLSX — Arquivos Excel com catálogos de várias folhas.
- JSON – exportações de API ou feeds de produtos internos.

Cada um pode conter títulos, descrições, preços, SKUs, códigos de barras, eixos de variantes (tamanho, cor), inventário e – principalmente – URLs de fotos. Uma vez no photoZseo, os mesmos dados geram cotações, exportações e preenchimento automático de SEO.

## Detecção automática em 41 plataformas

O recurso matador não é o suporte ao formato. É a detecção automática.

photoZseo inspeciona os cabeçalhos das colunas do arquivo e os compara com 41 esquemas de exportação de plataforma conhecidos:

- Mercados ocidentais: Amazon, Shopify, eBay, Etsy, Walmart, WooCommerce
- Turco: Trendyol, Hepsiburada, N11
- Ásia transfronteiriça: AliExpress, Lazada, Shopee, Temu, SHEIN, DHgate, Made-in-China, Global Sources
- América Latina: Mercado Libre, Coupang
- Europa: Cdiscount, Bol.com, Kaufland, Allegro, Zalando, Fruugo, Jumia
- ...e mais 17.

Se o seu arquivo veio de algum desses, o photoZseo o reconhece imediatamente. Nenhum assistente de mapeamento de coluna. Nenhum prompt "o que este cabeçalho significa". Simplesmente funciona.

## URLs de fotos são extraídos em paralelo

A maioria das exportações de catálogo inclui URLs de fotos, não imagens incorporadas. O photoZseo baixa-os em paralelo – múltiplas conexões, nova tentativa inteligente, desduplicação de hash perceptivo para que a mesma foto do produto não seja importada duas vezes.

Há um botão de alternância apenas de Wi-Fi ativado por padrão. Com ele ligado:

- Os downloads são pausados ​​quando você sai do Wi-Fi e retomados quando você volta.
- Nenhuma surpresa de celular na sua conta telefônica.
- Uma importação de 2.000 produtos não esgotará seu plano de dados.

Com ele desligado, o photoZseo usa qualquer conexão ativa – útil em uma mesa no Wi-Fi do escritório.

## Um fluxo de trabalho prático

Esta é a viagem de ida e volta que a maioria dos vendedores faz:

Passo 1 — Exporte da plataforma de origem. Shopify, Amazon ou Etsy permitem que você baixe seu catálogo como CSV/XLSX. Agarre-o.

Passo 2 — Solte o arquivo em photoZseo. No iPhone, clique em Importar em qualquer projeto. No iPad, arraste-o de Arquivos. A detecção automática identifica a plataforma e começa a extrair URLs de fotos em segundo plano.

Etapa 3 — Deixe [AI preenche os campos de SEO](/features/seo-filenames). photoZseo escreve título, slug, meta descrição, texto alternativo, tags e palavras-chave para cada produto, em 12 idiomas, se você vende internacionalmente.

Passo 4 — Exporte para um novo mercado. Escolha o destino – Amazon, Trendyol, Walmart, qualquer que seja. photoZseo reescreve o arquivo na ordem exata das colunas da plataforma, redimensiona as imagens de acordo com as especificações da plataforma e empacota o resultado como um único ZIP.

Passo 5 — Faça upload para o novo canal. O arquivo de saída está pronto para qualquer ferramenta de upload em massa usada pelo destino.

O que costumava ser uma semana de trabalho em planilhas é uma pausa de 30 minutos para o almoço.

## Por que isso é importante para vendedores internacionais

O maior obstáculo à expansão além do seu mercado doméstico é o custo de conversão do catálogo. A maioria dos vendedores permanece no Amazon US não porque o Amazon US seja o melhor, mas porque mudar para Mercado Libre ou Trendyol significa reconstruir o catálogo do zero.

A importação em massa + 46 predefinições do mercado remove esse bloqueador. Os mesmos dados do produto fluem para todos os canais. Novos mercados são uma alternância de recursos, não um projeto.

Para vendedores independentes que desejam enviar globalmente sem contratar um gerente de catálogo, este é o desbloqueio.
