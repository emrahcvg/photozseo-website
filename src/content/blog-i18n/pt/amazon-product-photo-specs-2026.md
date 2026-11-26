---
title: "Requisitos de foto do produto Amazon em 2026"
description: "Tamanhos exatos, tipos de arquivo e regras de plano de fundo que o Amazon aplica às imagens dos produtos - e como transmiti-los no primeiro upload."
pubDate: 2026-05-08
readingMinutes: 5
tags: [amazon, product-photos, seo]
tldr:
  - "A imagem principal do Amazon deve ter no mínimo 1000×1000 (2000×2000 recomendado), quadrado 1:1, fundo #FFFFFF branco puro, JPEG, sRGB, menos de 10 MB."
  - "As causas de rejeição mais rápidas são: quase branco em vez de branco verdadeiro, produto menor que 85% da moldura, marcas d'água ou texto na imagem principal."
  - "Fique abaixo de 600 KB por imagem após a compactação - o CDN do Amazon recodifica qualquer coisa maior e a velocidade da página pesa em sua classificação de conversão."
faqs:
  - q: "Qual é o tamanho mínimo de imagem para fotos de produtos Amazon?"
    a: "1000 pixels no lado mais longo é o mínimo absoluto. Abaixo disso, Amazon desativa o recurso de zoom em sua listagem – e listagens sem zoom são desclassificadas pelo algoritmo. Procure 2.000 × 2.000 para dar ao Amazon espaço para recomprimir sem amolecer."
  - q: "JPEG ou PNG são melhores para listagens Amazon?"
    a: "JPEG.webp. Amazon também aceita TIFF, PNG e GIF, mas JPEG compacta menos, processa mais rápido no CDN do Amazon e não há benefício de transparência em um plano de fundo #FFFFFF. Economize no espaço de cores sRGB, qualidade 80–85."
  - q: "O Amazon requer fundos brancos puros para todas as fotos?"
    a: "Apenas a imagem principal – essa é a regra que o Amazon impõe com verificações automatizadas. As imagens secundárias podem mostrar o produto no contexto, em uma maquete, com embalagem ou em cenas de estilo de vida. A primeira foto é do porteiro."
  - q: "Qual deve ser o tamanho do produto na moldura?"
    a: "A diretriz do Amazon é pelo menos 85% da imagem. Produtos menores que isso geralmente falham na revisão automatizada ou são sinalizados manualmente em auditorias de categoria. Centralize o produto e corte bem."
  - q: "Posso fazer upload de fotos HEIC do meu iPhone para o Amazon?"
    a: "Não. Amazon espera JPEG, TIFF, PNG ou GIF. Converta HEIC em JPEG antes do upload - a predefinição Amazon do photoZseo faz isso automaticamente e corta o arquivo para 200–600 KB sem perda visível de qualidade."
---

Amazon rejeita listagens antes que a maioria dos vendedores as veja. O culpado quase sempre é a foto – um arquivo muito pesado, um fundo que não é realmente branco ou uma proporção que a plataforma recusa silenciosamente.

Aqui está a folha de referências das especificações de 2026, extraída da documentação do vendedor do Amazon e testada em listagens ativas.

## Regras principais da imagem

- Dimensões: mínimo 1000×1000, recomendado 2000×2000. Abaixo de 1000 no lado mais longo, o Amazon não habilita o zoom – e o algoritmo trata as listagens sem zoom como de qualidade inferior.
- Proporção: Quadrado (1:1) para a imagem principal. As imagens secundárias podem ser 4:5 ou 16:9.
- Fundo: Branco puro, hexadecimal `#FFFFFF`. Os estúdios fotográficos "quase brancos" falham nas verificações automatizadas com mais frequência do que os vendedores esperam.
- Formato: JPEG (`.jpg`) é a escolha mais segura. TIFF, PNG e GIF são aceitos, mas JPEG é compactado melhor e processado mais rapidamente no CDN do Amazon.
- Espaço de cores: sRGB. As imagens salvas em Adobe RGB ou ProPhoto parecem opacas após a recodificação do Amazon.
- Tamanho do arquivo: Menos de 10 MB por imagem. Procure 200–600 KB após a compactação – arquivos grandes retardam o carregamento da página do produto e a velocidade da página pesa na conversão.

## O que faz com que uma listagem seja suprimida

1. Marcas d'água, sobreposições de texto ou logotipos na imagem do produto.
2. Adereços que não estão incluídos no que o cliente receberá.
3. Borda, moldura ou qualquer fundo que não seja branco puro para a imagem principal.
4. Produto ocupando menos de 85% do quadro da imagem.
5. Manequins (para vestuário) ou equipamentos de suporte visíveis.

## Como photoZseo aplica as especificações

A predefinição Amazon dentro do photoZseo faz quatro coisas ao mesmo tempo:

1. Corta em uma moldura quadrada com o produto centralizado em 85% da tela.
2. Redimensiona o lado mais longo para 2.000 pixels (aumenta de forma inteligente se a fonte for menor).
3. Grava um JPEG limpo em sRGB, qualidade 85 – geralmente 250–450 KB.
4. Se a remoção do fundo estiver ativada, substitua qualquer pano de fundo em que você fotografou por #FFFFFF puro e suaviza as bordas para que o produto não pareça recortado e colado.

Todo o pipeline é executado no telefone. Nada sai do seu dispositivo.

## Uma rápida lista de verificação de conformidade

Antes de fazer upload, confirme:

- [] O lado mais longo é ≥1000 px (preferencialmente 2000 px)
- [] O fundo passa em um teste de "seleção de branco" - os quatro cantos são lidos como `#FFFFFF`
- [] O arquivo tem menos de 10 MB e foi salvo como JPEG
- [] A proporção da imagem é 1:1 para a imagem principal
- [] Sem texto, marca d'água ou moldura

Se todos os cinco forem verificados, a listagem passará na validação automática do Amazon na primeira tentativa – e você pulará as idas e vindas que matam o tempo de lançamento.
