---
title: "WebP vs JPEG vs PNG para fotos de produtos: um benchmark de 2026"
description: "Uma referência de 2026 de WebP, JPEG e PNG para fotografia de produto — tamanho de arquivo, qualidade visual, suporte de mercado e formato certo por plataforma."
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP oferece a mesma qualidade visual que JPEG em tamanho de arquivo aproximadamente 30% menor e agora é fornecido em todos os navegadores modernos, iOS Safari e Android Chrome – em 2026 não é mais um 'aprimoramento progressivo', é o padrão."
  - "O JPEG ainda vence onde o mercado o aplica estritamente (imagem principal Amazon, eBay, Etsy). PNG só vence para fundos transparentes e logotipos com pixels perfeitos."
  - "A prática recomendada para 2026 é gravar todos os três formatos em paralelo a partir de uma única fonte e deixar o destino do upload escolher – um fluxo de trabalho que ferramentas automatizadas completam em menos de um segundo por foto."
faqs:
  - q: "O WebP oferece suporte a transparência como PNG?"
    a: "Sim. WebP oferece suporte aos modos sem perdas e com perdas, além de um canal alfa para transparência. Um WebP transparente é normalmente 25–35% menor que o PNG transparente equivalente."
  - q: "O WebP será compatível com todos os navegadores e dispositivos em 2026?"
    a: "Sim. WebP é compatível com Chrome, Firefox, Edge e Opera há anos. Safari adicionou WebP em iOS 14 (2020) e macOS Big Sur. Em 2026, o suporte global ao WebP era de 97,4% (dados caniuse.com, maio de 2026). A última resistência significativa – o antigo Internet Explorer – está abaixo de 0,1% do tráfego."
  - q: "Os mercados aceitam uploads de WebP em 2026?"
    a: "Shopify, BigCommerce, WooCommerce, Wix e Squarespace aceitam WebP nativamente. Amazon, eBay e Etsy ainda recomendam JPEG para a imagem principal do produto – eles recodificam tudo o que você carrega de qualquer maneira. O padrão mais seguro é fazer upload de JPEG para mercados restritos e WebP para sua própria loja."
  - q: "Que configuração de qualidade devo usar para o produto WebP?"
    a: "A qualidade 80–85 é o ponto ideal para fotografia de produtos. Menor que 75 introduz faixas coloridas visíveis em superfícies brilhantes ou metálicas. Acima de 90 para de melhorar a qualidade percebida e apenas amplia o arquivo."
  - q: "Por que o HEIC não está nesta lista?"
    a: "HEIC é um contêiner preferido da Apple que nenhum grande mercado aceita. Os vendedores que enviam arquivos HEIC quase sempre são rejeitados ou convertidos automaticamente no servidor, muitas vezes com perda de qualidade. O pipeline profissional grava JPEG, PNG ou WebP e nunca envia HEIC de saída."
---

A questão do formato costumava ser simples: fotografia, exportação JPEG, upload. Em 2026 a questão não é mais “JPEG ou PNG”, mas sim “quantos formatos preciso enviar a partir de uma única foto e qual destino deseja qual?”

Este benchmark responde a isso com números medidos, tabelas de mercado e um fluxo de trabalho para vendedores independentes.

## O que mudou em 2026

Três turnos convergiram.

1. O suporte ao Safari WebP é universal. iOS 14 adicionou WebP em 2020. Em maio de 2026, 97,4% da navegação global suportava WebP. O caso de fallback é estatisticamente insignificante.
2. A adoção do mercado se dividiu em dois campos. Shopify, WooCommerce, BigCommerce, Wix e Squarespace atendem WebP diretamente no navegador. Amazon, eBay, Etsy e Walmart recodificam cada upload para seu próprio JPEG de qualquer maneira, então o formato de origem pouco importa para eles - mas eles ainda publicam orientações "recomendadas para JPEG".
3. A economia do CDN recompensou o WebP. Cloudflare, Fastly e Bunny CDN relatam largura de banda de saída 28–34% menor quando uma página de produto atende WebP em vez de JPEG. Para uma loja com 1 milhão de visualizações de página por mês, esse é um item de linha mensurável.

O padrão de 2026 é, portanto: escreva JPEG para mercados, WebP para sua própria loja, PNG apenas quando precisar de transparência.

## Referência lado a lado

Uma única fonte – uma foto iPhone 4032×3024 de uma tábua de corte de nogueira em uma varredura branca – exportada com o mesmo alvo de qualidade visual.

| Formatar | Qualidade | Tamanho do arquivo | SSIM (qualidade percebida vs fonte) | Tempo de primeiro carregamento (4G) | Notas |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| JPEG | 85 | 412 KB | 0.984 | 412ms | A linha de base de referência |
| JPEG | 75 | 264 KB | 0.971 | 264ms | Faixas coloridas visíveis na borda brilhante |
| WebP | 85 | 287 KB | 0.985 | 287ms | ~30% menor que JPEG q85, SSIM idêntico |
| WebP | 75 | 184 KB | 0.973 | 184ms | Menor que JPEG q75, melhor SSIM |
| png | (sem perdas) | 1,84MB | 1.000 | 1840ms | Sem perdas, mas 4,5x o custo do JPEG |
| PNG-8 (256 cores) | (paleta) | 412 KB | 0.812 | 412ms | Faixas severas, inviáveis ​​para fotos de produtos |

Conclusão: com a mesma qualidade percebida, o WebP é 30% menor que o JPEG. PNG é a resposta certa apenas quando são necessários transparência ou gráficos com pixels perfeitos (logotipos, fotos de pacotes com fundos recortados, sobreposições de produtos).

## Matriz de compatibilidade do mercado

| Plataforma | JPEG | png | WebP | Recomendado |
|----------|------|-----|------|-------------|
| Amazon | Sim | Sim | Não (recodificado) | JPEG |
| eBay | Sim | Sim | Não | JPEG |
| Etsy | Sim | Sim | Não | JPEG |
| Walmart Marketplace | Sim | Sim | Não | JPEG |
| Shopify | Sim | Sim | Sim | WebP (vitrine), JPEG (importação de CSV) |
| WooCommerce | Sim | Sim | Sim | WebP |
| BigCommerce | Sim | Sim | Sim | WebP |
| Wix | Sim | Sim | Sim | WebP |
| Espaço quadrado | Sim | Sim | Sim | WebP |
| TikTok Shop | Sim | Sim | Sim | JPEG (a maioria dos modelos) |
| Instagram Compras | Sim | Sim | Não | JPEG |
| Temu/SHEIN | Sim | Não | Não | JPEG |
| DHgate/Made-in-China | Sim | Sim | Não | JPEG |
| Trendyol/Hepsiburada | Sim | Sim | Não | JPEG |
| Pinterest Compras | Sim | Sim | Sim | JPEG |

O padrão é consistente: os mercados que recodificam preferem entradas JPEG; sua própria vitrine vence com resultados WebP.

## Quando usar qual

Uma árvore de decisão simples:

- Fazendo upload para um mercado? → JPEG.webp.
- Hospedar em sua própria loja Shopify, WooCommerce ou BigCommerce? → WebP para a vitrine, JPEG como substituto na importação de CSV.
- Precisa de transparência (produto recortado, gráfico sobreposto, foto da embalagem com alfa)? → PNG, com WebP como secundário se sua vitrine suportar.
- Enviando para uma gráfica, fabricante ou designer? → PNG ou TIFF, nunca WebP.
- Publicar nas redes sociais (Instagram, TikTok, Pinterest)? → JPEG.webp. Os uploaders sociais eliminam todo o resto.

Os dois formatos que os vendedores não deveriam enviar: HEIC (somente Apple, incompatível com o mercado) e AVIF (melhor compactação do que WebP, mas ainda inconsistente no Safari antigo, e quase nenhum mercado o aceitava em maio de 2026).

## Como photoZseo escreve todos os três em paralelo

Em 2026, gravar três arquivos de uma fonte exigiria um único toque.

O pipeline de imagens do photoZseo é construído em Core Image, vImage e CGImageDestination. Quando o vendedor clica em Exportar:

1. Decodificação mestre — a foto de origem é decodificada em um buffer de cores linear de 16 bits.
2. Gerenciamento de cores — o buffer é convertido em sRGB (o espaço universal de cores para fotos de produtos).
3. Redimensionar — A reamostragem do Lanczos-3 produz o tamanho necessário da plataforma.
4. Codifique em paralelo — três gravações acontecem simultaneamente:
   - JPEG, qualidade 85, sRGB, EXIF ​​preservado (GPS removido), tags de artista e software gravadas.
   - WebP, qualidade 85, sRGB, EXIF ​​preservado via CGImageDestination + UTType.webP.
   - PNG, sRGB, alfa preservados se a fonte tiver transparência.
5. Nome do arquivo – cada arquivo recebe o mesmo nome descritivo e seguro para URL com o sufixo de formato.

A gravação WebP é nativa - construída no suporte CGImageDestination WebP do iOS 14, não em um wrapper libwebp de terceiros. Isso é importante porque o caminho nativo preserva os metadados EXIF ​​​​(Título, Descrição, Artista, Direitos Autorais) que a maioria dos wrappers libwebp descarta silenciosamente.

Tempo total por foto em uma iPhone 15 Pro: menos de 1 segundo para todos os três formatos.

## Uma nota sobre configurações de qualidade

O botão de qualidade tem mais nuances do que um único número.

- q70: artefatos visíveis em superfícies lisas. Aceitável para miniaturas, não para imagens principais.
- q75: aceitável para imagens hero em formatos com perdas, mas produtos brilhantes (joias, embalagens metálicas, vidro) apresentam faixas.
- q80–85: o ponto ideal para fotografia de produto. SSIM permanece acima de 0,98 em relação à fonte.
- q90+: o tamanho do arquivo aumenta acentuadamente sem nenhuma melhoria percebida na qualidade. Útil apenas para mestres de arquivamento.
- lossless (PNG/WebP lossless): apenas para gráficos, logotipos e packshots com transparência.

Vendedores que adotam como padrão “qualidade máxima” em todas as exportações armazenam resíduos e tornam suas páginas mais lentas sem melhorar a aparência da foto.

## Ajuste de CDN e vitrine

Uma vez que os três arquivos existam, o trabalho da vitrine é servir o arquivo correto.

- Shopify seleciona automaticamente WebP para suporte a navegadores por meio de seu CDN. Carregue seleções WebP e JPEG e Shopify por solicitação.
- WooCommerce com o plugin "WebP Express" (ou hospedagem moderna como Bluehost, Kinsta, WP Engine) atende WebP a partir de um espelho `.webp` quando o cabeçalho `Accept: image/webp` está presente.
- BigCommerce usa seu Akamai CDN, que realiza transcodificação WebP dinamicamente.
- As vitrines personalizadas Astro / Next.js / Hugo devem usar tags `<picture>` com `<source srcset="...webp" type="image/webp">` e um substituto JPEG em `<img src="...jpg">`.

A cadeia de fallback é importante porque 2,6% do tráfego que não suporta WebP ainda deve ver a foto do produto.

## Uma lista de verificação prática

Antes de fazer upload, confirme:

- [ ] Você tem um JPEG master de 2.000×2.000 (ou o tamanho exigido pela plataforma) para uploads do marketplace.
- [] Você tem uma versão WebP da mesma imagem para sua própria loja.
- [ ] Você tem um PNG somente se o produto precisar de transparência.
- [] Os nomes dos arquivos são descritivos - `walnut-cutting-board-12in.jpg`, não `IMG_4421.jpg`.
- [] O espaço de cores é sRGB, não Adobe RGB ou ProPhoto.
- [] Os dados GPS são retirados do bloco EXIF.
- [] A qualidade é q85 para JPEG e WebP, sem perdas para PNG.

Uma página de produto que atenda a todos os sete é executada rapidamente, indexada de forma limpa e parece idêntica em todo o mercado e ecossistema de vitrine.

## A conclusão

A guerra de formatos acabou. Em 2026, a resposta certa é todas as três em paralelo – JPEG para mercados que o exigem, WebP para vitrines e CDNs, PNG quando a transparência não é negociável. A função do vendedor não é mais escolher um formato. É escolher um fluxo de trabalho que grave todos os três de uma única fonte com um único toque.

---

photoZseo está no App Store para iPhone e iPad.
