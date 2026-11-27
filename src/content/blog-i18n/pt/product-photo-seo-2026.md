---
title: "Foto do produto SEO 2026: os 13 campos Google e ChatGPT realmente lidos"
description: "Uma análise campo por campo do que os mecanismos de pesquisa e LLMs extraem de uma lista de produtos em 2026 – e as 13 entradas que movem a agulha para ambos."
pubDate: 2026-05-12
readingMinutes: 9
tags: [seo, product-photos, ai, llm, e-commerce]
tldr:
  - "A classificação de 2026 do Google sinaliza a fusão de SEO de imagem com dados estruturados de produto - texto alternativo, nome de arquivo e meta descrição agora têm o mesmo peso que o título."
  - "LLMs como ChatGPT e Perplexity extraem produtos de listagens lendo 13 campos específicos. Perca um e seu produto desaparecerá da resposta."
  - "O preenchimento manual de todos os 13 campos leva de 8 a 12 minutos por produto. O preenchimento automático controlado por IA reduz esse valor para menos de 30 segundos sem alterar as entradas que os mecanismos de pesquisa procuram."
faqs:
  - q: "O Google ainda lê o texto alternativo da imagem em 2026?"
    a: "Sim. O texto alternativo continua sendo o sinal de imagem mais importante para a pesquisa de imagens Google e agora também alimenta o gráfico de compras e as visões gerais de IA do Google. Os documentos vazados do Content Warehouse de 2025 confirmaram que `image.alt` é um campo de indexação de primeira linha."
  - q: "LLMs como ChatGPT leem páginas de produtos diretamente?"
    a: "ChatGPT (via Bing), Perplexity (via Bing e Brave) e Claude (via ferramentas da web) buscam páginas de produtos e analisam o texto visível mais o bloco de dados estruturados JSON-LD. Eles priorizam título, descrição, preço, marca e texto alternativo de imagem – exatamente os campos que um rastreador com reconhecimento de mapa de site indexa."
  - q: "Qual é o campo de SEO mais subestimado na página de um produto em 2026?"
    a: "O nome do arquivo da imagem. Os vendedores deixam como `IMG_0421.jpg` e perdem um espaço de palavra-chave grátis. Renomear o arquivo para `walnut-cutting-board-large.jpg` fornece à pesquisa de imagem Google e às consultas de imagem reversa uma string limpa para indexar."
  - q: "Qual deve ser o tamanho de uma meta descrição de produto?"
    a: "150–160 caracteres. Qualquer coisa a mais fica truncada no SERP do Google e nas citações da fonte do ChatGPT. Qualquer coisa mais curta sinaliza conteúdo superficial."
  - q: "Devo escrever textos alternativos diferentes para o mesmo produto em mercados diferentes?"
    a: "Sim – mas apenas a densidade das palavras-chave precisa mudar. Amazon recompensa texto alternativo descritivo com menos de 100 caracteres com a marca e o material. Etsy prefere frases baseadas em artesanato e estilo. O índice Google trata o texto alternativo da sua própria loja como canônico."
---

A mudança em 2026 é silenciosa, mas total. As visões gerais de IA do Google agora citam listas de produtos da mesma forma que citam parágrafos da Wikipedia. A pesquisa na web do ChatGPT lê sua vitrine e recomenda seu produto pelo nome. Perplexity retorna três concorrentes e uma faixa de preço antes que o comprador digite meia consulta.

Se a foto do seu produto chegar como `IMG_0421.jpg` sem texto alternativo e com uma descrição de 12 palavras, você ficará invisível para todos os três.

Este guia detalha os 13 campos que os motores de busca e os grandes modelos de linguagem realmente leem em 2026, classificados por impacto, com o formato exato que cada um espera.

## Por que o SEO de imagens mudou em 2026

Três coisas mudaram este ano.

1. O lançamento da visão geral do Google AI foi concluído em março. As visões gerais agora aparecem acima de 64% das consultas comerciais e citam as páginas de origem. As citações favorecem dados estruturados de produtos – páginas com esquema de produto JSON-LD completo são citadas de 3 a 4 vezes mais frequentemente do que páginas apenas com HTML.
2. Lançamento do ChatGPT Search e Perplexity Shopping. Ambos os LLMs leem o título, a descrição, o texto alternativo da imagem e o preço da página de um produto e os apresentam na resposta do chat. Não há etapa de “clique para visualizar” – o comprador vê a descrição do produto literalmente dentro da resposta do LLM.
3. Apple Foundation Models em iOS 26 + iPadOS 26 + macOS Sequoia. Os LLMs no dispositivo agora geram cópias do produto que correspondem ao que os LLMs do lado do servidor leem. Os vendedores independentes podem finalmente produzir listagens legíveis para LLM sem pagar um redator.

O resultado líquido: os mesmos 13 campos agora atendem tanto ao Google quanto aos LLMs. Preenchê-los bem não é mais dois trabalhos.

## Os 13 campos classificados por impacto

| # | Campo | O que isso faz | Impacto Google | Impacto do LLM |
|---|-------|-------------|---------------|------------|
| 1 | Título | O identificador principal do produto em cada superfície | Crítico – H1 + título da página + dados estruturados | Crítico – primeiro campo citado pelos LLMs |
| 2 | Lesma | Segmento do caminho do URL, classificação da palavra-chave no URL | Alto – sinal dos três primeiros na página | Médio – LLMs preferem URLs limpos |
| 3 | Nome do arquivo | Nome do arquivo de imagem, indexado pelo Google Image Search | Alto – alimenta a pesquisa reversa de imagens | Médio – usado como substituto de texto alternativo |
| 4 | Categoria | Nó de taxonomia ao qual o produto pertence | Alto – alimenta o Shopping Graph | Alto – restringe o escopo da resposta do LLM |
| 5 | Meta descrição | O pitch de 150-160 caracteres em SERPs | Alto – aumenta a CTR | Alto - fonte de citação literal |
| 6 | Descrição completa do produto | Cópia longa na página do produto | Crítico – texto de classificação principal | Crítico - contexto LLM primário |
| 7 | Texto alternativo | O texto mostrado quando a imagem não carrega | Crítico para pesquisa de imagens | Alto – LLMs usados ​​como legenda de imagem |
| 8 | Etiqueta 1 (estilo) | Descritor de estilo ou atributo | Médio – alimenta pesquisa facetada | Médio – refina os filtros LLM |
| 9 | Etiqueta 2 (material) | Composição ou tecido | Médio | Médio |
| 10 | Etiqueta 3 (caso de uso) | Para que serve o produto | Médio | Alto – corresponde à intenção do comprador |
| 11 | Etiqueta 4 (público) | Para quem é o produto | Médio | Alto – refina a correspondência de personalidade LLM |
| 12 | Palavras-chave | Dicas de índice separadas por vírgula (meta palavras-chave + internas) | Baixo para Google | Médio – aumenta o recall do LLM |
| 13 | Código de barras (GTIN/UPC/EAN) | Identificador exclusivo | Alto – alimenta a desduplicação do Shopping Graph | Alto - desambigua a resposta do LLM |

A ordem é importante. Os vendedores que otimizam apenas os campos 1 e 6 deixam o restante do funil de descoberta vazio.

## Como os LLMs leem as listas de produtos

Aqui está o que acontece quando um cliente digita “a melhor tábua de corte de nogueira para um apartamento de 1 quarto” no Perplexity em maio de 2026.

1. Perplexity emite uma pesquisa na web por meio do Brave Search.
2. Os 8 principais resultados são obtidos em paralelo.
3. Cada página é analisada para: esquema `<title>`, `<meta description>`, JSON-LD `Product`, todo o texto `<img alt="">` e os primeiros 2.000 caracteres visíveis do corpo.
4. O LLM reclassifica os 8 resultados por correspondência semântica – a página descreve uma placa de nogueira dimensionada para cozinhas pequenas?
5. Os 3 primeiros estão resumidos em uma resposta de 60 palavras com citações embutidas.

Uma página que tenha `<title>Walnut Cutting Board – 12" Compact</title>`, um texto alternativo como `walnut cutting board for small apartments, 12 inch` e uma descrição que diz “projetado para cozinhas de estúdio e 1 quarto” vence. Uma página com `<title>Cutting Board</title>` e texto alternativo `image1.jpg` perde, mesmo que a foto seja melhor.

O comportamento do ChatGPT é quase idêntico, com uma diferença: o ChatGPT também lê o nome do arquivo e o usa como legenda substituta quando falta texto alternativo. Isso torna o nome do arquivo um segundo espaço de texto alternativo – a maioria dos vendedores o desperdiça.

## O pipeline no dispositivo

A geração manual de todos os 13 campos leva de 8 a 12 minutos por produto. Em 200 SKUs, são mais de 30 horas de digitação.

A alternativa 2026 é um LLM no dispositivo que lê a foto e escreve todos os 13 campos de uma só vez. A estrutura Foundation Models do Apple (iOS 26+, iPadOS 26+, macOS Sequoia) executa um LLM de 3 bilhões de parâmetros localmente, sem ida e volta do servidor e sem análises.

photoZseo usa a estrutura Apple Foundation Models junto com a estrutura Vision para:

1. Detecte o objeto na foto (`VNClassifyImageRequest` da Vision).
2. Extraia qualquer texto visível — rótulos, embalagens, números de modelo (`VNRecognizeTextRequest` da Vision).
3. Extraia dados EXIF ​​e de cores computadas.
4. Entregue os sinais estruturados ao Foundation Models, que grava os 13 campos no idioma escolhido em 12 localidades suportadas.

Tempo de saída por foto: menos de 30 segundos, 100% offline, nenhum dado sai do dispositivo.

Os campos que ele produz são mapeados diretamente para a tabela acima:

- Título (60–80 caracteres, carregado com palavras-chave)
- Slug (minúsculas, hifenizadas, seguras para ASCII)
- Nome do arquivo (URL seguro, descritivo, sufixo JPEG/PNG/WebP)
- Categoria (mapeada para o nó de taxonomia do mercado mais próximo)
- Meta descrição (150–160 caracteres)
- Descrição completa do produto (180–400 palavras)
- Texto alternativo (menos de 100 caracteres, palavra-chave natural)
- 4 tags (estilo, material, caso de uso, público)
- Palavras-chave (8–12 separadas por vírgula)
- Espaço reservado para código de barras se a foto mostrar um

Cada campo é editável – a IA é um rascunho, não um veredicto.

## Uma lista de verificação tática antes de publicar

Execute isso no próximo produto que você enviar para qualquer mercado.

- [] O título contém a palavra-chave primária nos primeiros 40 caracteres.
- [] Slug é hifenizado, minúsculo, sem sublinhados, com menos de 60 caracteres.
- [] O nome do arquivo descreve o produto - nunca `IMG_*`, `DSC_*` ou um UUID.
- [ ] A categoria corresponde à taxonomia existente do mercado (Amazon Browse Node, categoria Etsy, Shopify Smart Collection).
- [] A meta descrição tem de 150 a 160 caracteres e termina sem ponto final se você precisar de todos os caracteres.
- [] A descrição do corpo inclui material, dimensões, uso pretendido, público no primeiro parágrafo.
- [] O texto alternativo descreve a foto, não o resumo do produto - `"walnut cutting board on white background"` e não `"walnut cutting board for sale"`.
- [ ] Pelo menos uma tag por eixo de atributo: estilo, material, caso de uso, público.
- [] As palavras-chave são exclusivas deste SKU e não são copiadas e coladas no catálogo.
- [ ] O código de barras (GTIN/UPC/EAN) é preenchido se você tiver um – códigos de barras vazios prejudicam a elegibilidade do Shopping Graph.

Uma listagem que passa em todas as dez caixas é rastreada, indexada e citada. Uma listagem que falhar três ou mais sai completamente da Visão Geral.

## Por que as “páginas finas de produtos” perdem em 2026

A atualização de conteúdo útil de 2024 do Google foi incorporada ao algoritmo principal no final de 2025. Páginas com descrições de 50 palavras e sem dados estruturados agora são classificadas como thin commerce e rebaixadas no SERP, independentemente dos backlinks.

Os LLMs os penalizam ainda mais. Uma página de produto sem descrição não pode ser citada porque não há nada para citar. A perplexidade irá ignorá-lo e citar a página abaixo dele.

Esta é a maior mudança de comportamento de 2026: a citação do LLM é o novo trecho em destaque, e um trecho em destaque precisa de texto para ser citado.

## A conclusão

Os 13 campos não são opcionais. Eles são o índice. Quer um comprador chegue por meio da pesquisa de imagens Google, uma visão geral de IA, uma recomendação ChatGPT ou uma comparação Perplexity, os mesmos 13 campos decidem se o seu produto está na resposta.

A boa notícia: preenchê-los bem não é mais uma tarefa de 10 minutos por SKU. A IA no dispositivo agora elabora o conjunto completo em menos de um minuto. O trabalho do vendedor em 2026 é revisar e refinar, não digitar.

---

photoZseo está no App Store para iPhone e iPad.
