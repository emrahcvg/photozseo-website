---
title: "Software de lista de produtos em massa: como os uploads de CSV/XLSX funcionam em Amazon, eBay, Etsy, Shopify e Trendyol (2026)"
description: "Como fazer upload em massa de produtos: modelo de cada plataforma, campos obrigatórios e regras de URL de imagem para Amazon, eBay, Etsy, Shopify e Trendyol, além de uma lista de verificação."
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay, Shopify, Amazon e Trendyol aceitam uploads de planilhas. Etsy não: sua central de ajuda diz que você não pode fazer upload em massa de novas listagens, apenas editar em massa as existentes."
  - "As imagens em uma planilha quase sempre são URLs, e não arquivos anexados. A URL deve ser pública, direta e (em Shopify e eBay) começar com https://."
  - "Os modelos diferem por categoria em Amazon, eBay e Trendyol, portanto, baixe um novo modelo para cada categoria e nunca renomeie seus cabeçalhos."
faqs:
  - q: "Como faço upload em massa de produtos para eBay?"
    a: "No Seller Hub, vá para Relatórios, depois Carregar e escolha Obter modelo com a fonte de listagens. Preencha o arquivo e faça upload; eBay lista os itens conforme especificado. Use CSV ou XLSX."
  - q: "Posso fazer upload em massa de novas listagens para Etsy com um CSV?"
    a: "A central de ajuda do Etsy diz que você não pode fazer upload em massa de novas listagens, mas pode copiar listagens e editar em massa as existentes. Existem ferramentas de terceiros, mas não são um recurso do Etsy."
  - q: "O Shopify precisa de URLs de imagem no CSV?"
    a: "Sim. Os URLs de imagem no CSV devem ser acessíveis publicamente, usar https:// e não ter proteção por senha. Shopify baixa as imagens durante a importação."
  - q: "Que codificação de arquivo um CSV de produto Shopify deve usar?"
    a: "A central de ajuda do Shopify solicita UTF-8 com finais de linha no estilo LF, separados por vírgula, com os cabeçalhos na primeira linha. Verifique as configurações de exportação do seu aplicativo de planilha."
  - q: "Onde faço upload de um arquivo de produto Excel no Trendyol?"
    a: "No painel do vendedor em Produto, depois em Operações de Produto em Massa, usando a opção de entrada de produto Excel e o tipo de upload Novo Produto. Cada categoria tem seu próprio modelo."
  - q: "Por que meu upload em massa foi rejeitado?"
    a: "As causas comuns são cabeçalhos de colunas editados, campos obrigatórios ausentes, URLs de imagens privadas ou de redirecionamento e um modelo da categoria errada. Corrija o arquivo e faça upload novamente."
---

Upload de produtos em massa significa preparar uma planilha (CSV ou XLSX) com uma linha por produto e carregá-la uma vez, em vez de criar cada listagem manualmente. eBay, Shopify, Amazon e Trendyol suportam isso; Etsy não permite a criação em massa de novas listagens. As duas regras que causam a maioria das falhas são as mesmas em todos os lugares: manter os cabeçalhos do modelo exatamente como fornecidos e fornecer cada imagem como uma URL pública e direta.

*Última verificação: novembro de 2026. Fontes verificadas: Central de Ajuda Shopify, "Usando arquivos CSV para importar e exportar produtos"; Ajuda do eBay Seller Hub, "Criar listagens em massa" (Relatórios do Seller Hub > Upload); Central de Ajuda Etsy, "Posso criar ou editar várias listagens de uma vez?"; Ajuda do Amazon Seller Central, "Modelos de arquivo de inventário" e "Problemas de imagem" (leia por meio de trechos de pesquisa, veja a nota abaixo); Trendyol Akademi Satıcı Bilgi Merkezi, "Excel Ürün Girişi" e "Ürün Görseli Seçimi ve Yükleme" (ler por meio de trechos de pesquisa).*

## Como cada plataforma lida com o upload em massa?

| Plataforma | Criar em massa? | Onde | Tipo de arquivo | Regra de imagem |
|---|---|---|---|---|
| Shopify | Sim | Produtos > Importar | CSV, UTF-8, separados por vírgula | URLs https:// públicos |
| eBay | Sim | Seller Hub > Relatórios > Upload > Obter modelo | CSV ou XLSX | URLs https://, até 12 por listagem, separados por \ |  |
| Amazon | Sim | Adicionar produtos por upload (Seller Central) | Modelo de arquivo de inventário específico da categoria | URL direto; redirecionamentos e pop-ups são rejeitados |
| Trendyol | Sim | Produto > Operações de produtos em massa > Entrada de produto no Excel | Excel, um modelo por categoria | Link na coluna Link da imagem |
| Etsy | Não (apenas editar) | Gerente de loja > Listagens | Não aplicável | Não aplicável |

## Como você faz upload em massa de produtos para Shopify?

A central de ajuda do Shopify define o formato: a primeira linha deve ser cabeçalho de coluna, as colunas são separadas por vírgula e o arquivo deve ser UTF-8 com finais de linha LF. Para novos produtos é necessário apenas o `Title`; se você usar variantes, o `URL handle` também será necessário. Colunas variantes como SKU também precisam de `Option1 name` e `Option1 value`, caso contrário, Shopify cria uma variante padrão e exclui as existentes durante a atualização.

As imagens devem ser URLs `https://` publicamente acessíveis sem proteção por senha. Shopify os baixa durante a importação, para que você possa removê-los posteriormente. Os nomes dos arquivos de imagem não podem ser editados após o upload e não podem incluir os sufixos `_thumb`, `_small` ou `_medium`. Vídeos e modelos 3D não são suportados em CSV.

| Limite | Valor (Centro de Ajuda Shopify) |
|---|---|
| Opções por produto | 3 |
| Imagens por produto | 250 |
| Tags por produto | 250 |
| Texto alternativo | Máximo de 512 caracteres, recomendado 125 ou menos |
| Título SEO | 70 caracteres |
| Descrição SEO | 320 caracteres |

Causas de falha conhecidas na mesma página: um arquivo com colunas `Barcode` e `Barcodes` falha; um conjunto parcial de colunas de dimensão compactada falha; com a substituição ativada, as células em branco apagam os valores existentes. Para uma comparação mais profunda com a rota da API, consulte [Shopify CSV x API](/pt/blog/shopify-csv-vs-api-2026).

## Como você carrega listagens em massa para eBay?

A ferramenta atual do eBay é o Seller Hub Reports. Vá para Upload, clique em Obter modelo, escolha a origem das listagens e um tipo de arquivo. XLSX é o padrão e CSV é recomendado para vendedores avançados; um download XLSX pode incluir até 10 categorias, cada uma em sua própria planilha. Carregue o arquivo concluído e eBay listará os itens conforme especificado.

Os campos obrigatórios para adicionar uma listagem incluem Ação, ID da categoria, Título (máximo de 80 caracteres), Formato, Duração, Preço inicial, Quantidade, ID da condição, Descrição e URL da foto do item. O site dos EUA também exige um UPC (ou equivalente) na coluna específica do item correspondente, e as categorias de livros precisam de um ISBN.

Os URLs de imagem devem começar com `https://`, terminar em uma extensão de arquivo como `.jpg` ou `.png`, ter menos de 2.048 caracteres e substituir os espaços por `%20`. Você pode listar até 12 imagens por listagem, separadas pelo caractere de barra vertical (`|`). As imagens podem ser auto-hospedadas ou no eBay Picture Services. Para variações, a linha pai deixa a quantidade e o preço vazios e cada linha filha tem a sua própria.

## Como você faz upload em massa de produtos para Amazon?

Amazon usa modelos de arquivo de inventário específicos de categoria, gerados na página Adicionar produtos por meio de upload em Seller Central. Para itens que ainda não estão no catálogo, você usa o modelo de produto, que marca os atributos como obrigatórios, condicionalmente obrigatórios ou recomendados. Para itens já existentes no catálogo, você pode pesquisar por ID do produto e usar um arquivo pré-preenchido. Após o upload, selecione o tipo de arquivo correspondente e revise o relatório de processamento de cada SKU.

Para imagens, a página de ajuda "Problemas de imagem" do Amazon diz que um pop-up ou URL de redirecionamento não será aceito e o upload não será processado, portanto, o URL deve apontar diretamente para o arquivo de imagem. Os caminhos de menu e os tipos de arquivos aceitos variam de acordo com a região do marketplace, portanto siga as instruções no modelo que você baixou. Para dimensões da imagem, consulte [Especificações de fotos de produtos Amazon](/pt/blog/amazon-product-photo-specs-2026).

## Você pode fazer upload em massa para Etsy?

Não para novas listagens. A central de ajuda do Etsy afirma que você não pode fazer upload em massa de novas listagens e sugere criar uma listagem e copiá-la. Você pode editar listagens existentes em massa no Shop Manager, incluindo títulos, tags, descrições, preços, opções personalizadas, perfil de processamento e perfis de entrega. As ferramentas que afirmam criar listagens Etsy em massa são produtos de terceiros e não um recurso Etsy, portanto, verifique você mesmo seus termos e acesso à API.

## Como você faz upload em massa de produtos para Trendyol?

No painel do vendedor, abra Produto, depois Operações de produtos em massa e use a opção de entrada de produto do Excel. O Centro de Informações do Vendedor do Trendyol descreve um modelo por categoria, identificado por um código de categoria e o tipo de upload "Yeni Ürün Ekle" (adicionar novo produto). As imagens são fornecidas na coluna Image Link (Görsel Linki). Trendyol também documenta um método de galeria: primeiro carregue imagens para a Galeria de imagens, com nomes de arquivo iguais ao código de barras do produto (para várias imagens, código de barras_1, código de barras_2) e, em seguida, copie esses nomes na coluna. Não altere o formato do modelo antes do upload.

O texto do painel pode mudar, portanto, confirme as etapas no modelo em sua própria conta de vendedor. Para regras de imagem em Trendyol e Hepsiburada, consulte [Fotos dos produtos Trendyol e Hepsiburada](/pt/blog/trendyol-hepsiburada-product-photos).

## Quais são os erros mais comuns de upload em massa?

1. Cabeçalhos editados ou renomeados. Os modelos são correspondidos pelo texto do cabeçalho. Não os traduza ou reordene.
2. Modelo de categoria incorreto. Os modelos Amazon, eBay e Trendyol diferem por categoria.
3. URLs de imagem que não são diretos. Um link para uma página da Web, um redirecionamento ou uma pasta protegida por login falha.
4. Espaços e caracteres especiais em URLs. Codifique espaços (eBay pede `%20`).
5. Codificação ou delimitador incorreto. O Excel pode exportar ponto e vírgula ou texto não UTF-8.
6. Identificadores duplicados ou ausentes (SKU, código de barras, identificador de URL).
7. Substitua surpresas. No Shopify, as células em branco podem apagar os dados existentes.

## Lista de verificação pré-upload

- Baixe um novo modelo para cada categoria e plataforma.
- Teste com 5 linhas antes do catálogo completo.
- Abra cada URL de imagem em uma janela privada do navegador; deve mostrar a própria imagem.
- Verifique o título, a descrição e os limites de tags em relação às diretrizes atuais da plataforma.
- Mantenha um backup do arquivo fonte e do relatório de erros da plataforma.

## Onde photoZseo se encaixa

O upload em massa de arquivos só funciona tão bem quanto as imagens e o texto dentro deles. photoZseo prepara fotos de produtos para 46 mercados (redimensionamento, compactação, nomes de arquivos SEO, remoção de fundo no dispositivo) e exporta CSV, XLSX ou JSON dos aplicativos iPhone e iPad. Ele não hospeda imagens nem faz upload para marketplaces para você, além de enviar produtos para Shopify. Obtenha o aplicativo no [página de download](/pt/download). O [Extensão do Chrome](/pt/chrome-extension) faz o mesmo com as páginas de produtos que você navega em um computador.

*photoZseo não é afiliado ou endossado por nenhum mercado. Os nomes do Marketplace são usados ​​apenas para descrever a compatibilidade.*

*Observação: as páginas Amazon Seller Central e Trendyol Akademi não puderam ser abertas por completo durante a verificação, portanto, os detalhes para essas duas plataformas vêm de trechos de pesquisa das páginas oficiais. Sempre verifique as instruções do modelo em sua própria conta.*
