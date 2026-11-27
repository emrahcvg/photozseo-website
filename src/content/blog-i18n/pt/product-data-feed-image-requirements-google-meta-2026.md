---
title: "Requisitos de imagem do feed de dados do produto: Google Merchant Center e Meta Catálogo (2026)"
description: "Especificações de imagem para feeds Google Merchant Center e Meta Catálogo: pixels mínimos, tamanho recomendado, formatos, limites de arquivo e por que as imagens são sinalizadas."
pubDate: 2026-11-27
readingMinutes: 6
tags: [google-shopping, meta-catalog, product-feed, product-photos]
tldr:
  - "Google Merchant Center: JPEG, WebP, PNG, GIF, BMP ou TIFF até 16 MB; Mínimo de 500 x 500 px para todos os produtos a partir de 31 de janeiro de 2027; Recomenda-se 1500 x 1500 px ou maior."
  - "Meta Catálogo: JPEG ou PNG, máximo de 8 MB, mínimo de 500 x 500 px; Quadrado de 1024 x 1024 px é recomendado para Lojas no Facebook e Instagram."
  - "Um único JPEG quadrado de 1.500 x 1.500 px com fundo limpo, sem sobreposições de texto e sem marcas d’água satisfaz ambos os feeds."
faqs:
  - q: "Quais são os requisitos de imagem Google Merchant Center em 2026?"
    a: "Use um link de imagem http/https em JPEG, WebP, PNG, GIF, BMP ou TIFF, de até 16 MB e 64 megapixels. Google recomenda 1.500 x 1.500 px ou maior, e um mínimo de 500 x 500 px se aplica a todos os produtos a partir de 31 de janeiro de 2027."
  - q: "Qual é o tamanho mínimo de imagem para um catálogo Meta?"
    a: "A especificação de dados do produto Meta requer pelo menos 500 x 500 pixels para a imagem principal, em JPEG ou PNG com menos de 8 MB. Para Lojas no Facebook e Instagram, Meta recomenda 1024 x 1024 pixels."
  - q: "Quantas imagens adicionais posso adicionar a um feed de produtos?"
    a: "O link_image_adicional do Google aceita até 10 imagens adicionais. A referência de campos de catálogo do Meta permite até 50 URLs de imagem adicionais."
  - q: "Posso usar o mesmo arquivo de imagem para Google Shopping e Meta?"
    a: "Geralmente sim. Um JPEG quadrado de 1.500 x 1.500 px ou mais, mostrando o produto real em um fundo limpo, sem texto ou marcas d'água, atende às regras publicadas em ambas as plataformas."
  - q: "Por que Meta ou Google sinalizam a imagem do meu produto?"
    a: "As causas comuns são texto sobreposto, emblemas promocionais, marcas d'água, bordas, imagens de espaço reservado, como \"imagem em breve\", imagens muito pequenas e URLs de imagem que bloqueiam rastreadores ou não correspondem ao tipo de arquivo."
---

A resposta curta: tanto para Google Merchant Center quanto para Meta Catalog, envie um JPEG quadrado de pelo menos 1500 x 1500 pixels, mostrando o produto real em um fundo limpo, sem texto, emblemas ou marcas d'água. O piso rígido do Google tem 500 x 500 px (para todos os produtos a partir de 31 de janeiro de 2027) e o do Meta também tem 500 x 500 px, mas ambas as plataformas recomendam arquivos maiores. As tabelas abaixo fornecem os números exatos da documentação de cada plataforma.

*Última verificação: novembro de 2026. Fontes: Google Merchant Center Help ("Link da imagem [image_link]", "Link da imagem adicional [additional_image_link]", "Como corrigir: imagem muito pequena"); Central de Ajuda Meta Business ("Especificações de imagens de produtos para catálogos"); Meta para desenvolvedores ("Campos de catálogo").*

## Google Merchant Center vs Meta Catálogo: lado a lado

| Exigência | Google Merchant Center | Metacatálogo |
|---|---|---|
| Campo de imagem principal | `image_link` | `image_link` |
| Formatos aceitos | JPEG, WebP, PNG, GIF, BMP, TIFF | JPEG, PNG |
| Tamanho máximo do arquivo | 16 MB (e 64 megapixels) | 8MB |
| Tamanho mínimo | 500 x 500 px para todos os produtos a partir de 31 de janeiro de 2027 (antes disso: 100 x 100 px ou 250 x 250 px para roupas) | 500 x 500 pixels |
| Tamanho recomendado | 1500 x 1500 px ou maior | 1024 x 1024 px (lojas no Facebook e Instagram) |
| Proporção de aspecto | Nenhuma proporção fixa declarada; Google pode aplicar cortes sutis | As lojas exibem quadrados 1:1; os anúncios carrossel funcionam melhor quando todas as imagens compartilham uma proporção (1:1 ou 4:5) |
| Imagens adicionais | Até 10 (`additional_image_link`) | Até 50 (`additional_image_link`) |
| Enquadramento do produto | O produto deve preencher cerca de 75% a 90% da imagem | A imagem principal deve mostrar todo o produto |
| Regras de URL | http/https, somente ASCII, RFC 3986, 1 a 2.000 caracteres | Use o URL da imagem do produto atual |

Para saber mais detalhes sobre o prazo do Google, consulte nossa postagem anterior sobre o [Google Shopping, mínimo de 500 x 500 px](/pt/blog/google-merchant-center-500px-image-requirement-2027).

## O que a regra Google 500 x 500 px muda?

Até 31 de janeiro de 2027, a página de solução de problemas do Google ainda lista limites mais baixos: 100 x 100 px para a maioria dos produtos e 250 x 250 px para roupas. Após essa data, o mínimo de 500 x 500 px se aplica a todas as categorias. Google afirma que imagens abaixo do mínimo não serão exibidas, embora o produto em si não seja reprovado. Google também observa que os anúncios do YouTube Shopping precisam de imagens de pelo menos 500 x 500 px para aparecer na TV.

Consequência prática: um feed cheio de miniaturas de 300 px não quebrará suas listagens de uma vez, mas esses produtos perderão sua imagem onde for importante. Exporte novamente a partir dos originais em vez de aumentar a escala de uma miniatura.

## O que o Meta exige para imagens de catálogo?

O artigo de ajuda da Meta lista estes princípios básicos: pelo menos uma imagem por produto, JPEG ou PNG, máximo de 8 MB, e a imagem deve representar com precisão o produto específico à venda. Para Lojas no Facebook e Instagram, as imagens dos produtos são mostradas como um quadrado (1:1), com mínimo de 500 x 500 px e recomendado 1024 x 1024 px.

Meta também sugere quatro ou mais imagens por produto, uma imagem principal nítida mostrando todo o produto, uma mistura de ângulos e close-ups, as mesmas imagens do seu site, um fundo branco e JPEG sobre PNG para qualidade de imagem.

### Como o Meta crop cataloga imagens?

No Commerce Manager (Configurações e depois Catálogo), você escolhe um dos três modos de corte: preencher o quadro com imagem (o padrão, que aumenta o zoom), mostrar a imagem inteira no quadro (pode ser adicionado espaço em branco) ou cortar e redimensionar para caber no quadro. Meta diz que as imagens não são cortadas em nenhum outro lugar nas Lojas do Instagram e nem nas Lojas do Facebook, exceto na configuração da página do produto Instagram. Se o seu catálogo misturar proporções, os anúncios carrossel poderão ajustá-las automaticamente; fornecer todas as imagens na mesma proporção (1:1 ou 4:5) evita isso.

## Por que as imagens dos produtos são sinalizadas ou reprovadas?

Ambas as plataformas listam problemas quase idênticos. Verifique seu feed primeiro:

| Problema | Google | meta |
|---|---|---|
| Sobreposições de texto, códigos promocionais, frases de chamariz | Não permitido (preço, frete, texto promocional) | Não recomendado (texto sobreposto, frases de chamariz, códigos promocionais) |
| Marcas d'água, logotipos adicionados | Não permitido, a menos que seja fisicamente parte do produto | Não recomendado |
| Imagens de espaço reservado ("imagem em breve") | Não permitido | Evitar; novas imagens precisam de um novo URL para serem atualizadas |
| Fronteiras | Não permitido | Não mencionado nas especificações |
| Gráficos genéricos em vez do produto | Não permitido (exceções para algumas categorias de hardware, veículos e software) | A imagem deve representar o produto exato |
| Muito pequeno | Imagem não mostrada (após 31 de janeiro de 2027) | Abaixo de 500 x 500 px não atende às especificações |
| Acesso ao rastreador | Permitir Googlebot e imagem do Googlebot em robots.txt; as alterações levam de 24 a 48 horas | Não especificado na especificação |
| Incompatibilidade de tipo de arquivo | A extensão deve corresponder ao formato real | Apenas JPEG ou PNG |

Duas armadilhas específicas para alimentos são fáceis de perder. Primeiro, Google deseja URLs estáveis ​​sem parâmetros dinâmicos, como carimbos de data/hora ou IDs de sessão. Em segundo lugar, o Meta só atualiza uma imagem substituída se o novo arquivo tiver uma URL diferente, portanto, substituir `shoe.jpg` no local não atualizará seu catálogo.

## Uma exportação que satisfaça ambos os feeds

1. Comece pela foto original não compactada.
2. Exporte um quadrado 1:1 de 1.500 x 1.500 px ou mais como JPEG (menos de 8 MB, confortavelmente abaixo de ambos os limites).
3. Mantenha o produto em cerca de 75% a 90% da moldura sobre um fundo limpo.
4. Remova sobreposições, emblemas, marcas d'água e bordas da imagem do feed; mantenha versões promocionais para anúncios.
5. Use um nome de arquivo descritivo e um URL estável e rastreável.
6. Coloque ângulos extras em `additional_image_link` (Google: até 10).

## Onde photoZseo se encaixa

Se você preparar imagens para muitos mercados e feeds, o [fotoZseo](/pt/download) no iPhone e iPad redimensiona, compacta e renomeia fotos de produtos para 46 mercados a partir de uma foto, e o [Extensão do Chrome](/pt/chrome-extension) faz o mesmo nas páginas de produtos com nomes de arquivos SEO e exportação em massa. Nosso [guia de tamanho de imagem do marketplace](/pt/marketplace-image-sizes) lista os números por mercado.

*photoZseo não é afiliado ou endossado por nenhum mercado, Google ou Meta. Sempre verifique as diretrizes atuais das plataformas antes de fazer uploads grandes.*
