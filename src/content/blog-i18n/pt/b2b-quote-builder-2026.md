---
title: "Construtor de cotações B2B para comércio eletrônico: IVA, IBAN, códigos HS e assinatura eletrônica em 2026"
description: "Uma referência de 2026 para vendedores independentes de comércio eletrônico que criam cotações B2B – modos de IVA, IBAN, códigos HS, Incoterms 2020, legalidade de assinatura eletrônica e um fluxo de trabalho prático."
pubDate: 2026-05-12
readingMinutes: 10
tags: [b2b, quote, vat, hs-codes, incoterms, e-signature]
tldr:
  - "Os vendedores independentes de comércio eletrônico em 2026 recebem solicitações de cotação B2B rotineiramente – atacadistas, redes de lojas de presentes, compradores de hotéis – e um documento do Word não é mais uma resposta confiável."
  - "Uma cotação B2B real precisa de 12 campos específicos: informações do comprador, itens de linha com IVA e unidade de medida, códigos HS, Incoterms, condições de pagamento, IBAN e uma assinatura com trilha de auditoria."
  - "Os criadores de cotações no dispositivo (incluindo o módulo de cotação do photoZseo) geram cotações compatíveis com pesquisa de código HS, predefinições Incoterms 2020, modos de IVA UE/Reino Unido/EUA/Turquia, validação de IBAN e assinatura eletrônica em um documento."
faqs:
  - q: "Qual é o status legal de uma assinatura eletrônica em uma cotação B2B em 2026?"
    a: "Na UE, o eIDAS (Regulamento 910/2014) confere à Assinatura Eletrónica Simples (SES) o mesmo peso jurídico que uma assinatura húmida para contratos comerciais em quase todos os estados membros. Nos EUA, a Lei ESIGN (2000) e a UETA conferem às assinaturas electrónicas o mesmo efeito jurídico de uma assinatura manuscrita. Na Turquia, a KVKK e a Lei de Assinatura Eletrónica 5070 reconhecem as assinaturas eletrónicas qualificadas (QES) como equivalentes às assinaturas húmidas."
  - q: "Preciso de um código HS em uma cotação B2B se o comprador estiver no mesmo país?"
    a: "Não legalmente, mas as equipes de compras em 2026 solicitam rotineiramente o código HS de qualquer maneira. Eles o utilizam para estimar taxas alfandegárias na reexportação, mapear o produto em seu ERP e filtrar a conformidade com listas de mercadorias restritas. Incluir o código HS em todas as cotações (nacionais e internacionais) é o padrão profissional."
  - q: "Qual é a diferença entre Incoterms FOB, EXW e DDP?"
    a: "EXW (Ex Works) – o comprador coleta em seu depósito, o comprador paga tudo. FOB (Free On Board) – você entrega no porto indicado, o comprador assume o controle na ferrovia. DDP (Delivered Duty Paid) – você entrega na porta do comprador com taxas pagas. Os Incoterms 2020 possuem 11 termos no total; FOB, EXW e DDP cobrem aproximadamente 80% das cotações independentes de B2B."
  - q: "Preciso escrever o valor total por extenso em uma cotação B2B?"
    a: "Na Turquia, Alemanha, França, Itália e na maioria dos países do Médio Oriente, o valor por extenso é legalmente exigido nas faturas e fortemente habitual nas cotações. Nos EUA e no Reino Unido é opcional. Incluí-lo em cada cotação é o padrão mais seguro – não custa nada e evita disputas se um dígito for copiado incorretamente."
  - q: "Que regime de IVA se aplica se eu vender da Alemanha a um comprador em França em 2026?"
    a: "Ao abrigo do regime OSS (balcão único) da UE, as vendas B2B entre empresas registadas para efeitos de IVA na UE utilizam o mecanismo de autoliquidação – fatura a 0% de IVA e o comprador contabiliza-o no seu próprio registo. Você deve registrar o ID de IVA do comprador e verificá-lo através do sistema VIES. Para B2C, você cobra a taxa de IVA do país do comprador por meio da declaração trimestral do OSS."
---

A solicitação B2B aparece assim. Um atacadista envia um e-mail: "Vimos sua loja no Etsy. Você pode enviar um orçamento para 100 unidades, entregues em nosso armazém em Bruxelas, até agosto?"

Em 2026, o vendedor que responder com um documento Word e um link do PayPal perde o contrato. A equipe de compras precisa de um orçamento com IVA, IBAN, códigos HS, Incoterms e uma assinatura – o mesmo pacote que recebe de um fornecedor $50M. A maioria dos vendedores independentes não percebe o quão perto esse bar está.

Este artigo é a referência: o que acontece em uma cotação B2B em 2026, o que é legalmente exigido e como produzi-la em menos de cinco minutos pelo seu telefone.

## Por que os vendedores independentes precisam de cotações reais, não de documentos do Word

Três forças convergiram. Aquisição digitalizada – os sistemas ERP (SAP S/4HANA, Dynamics 365, Odoo) esperam dados de cotação estruturados com IVA e código HS por linha. As alfândegas ficaram mais rigorosas – o EU CBAM e o ICS2 exigem códigos HS na fase de cotação para muitas categorias. Os compradores querem trilhas de auditoria – uma cotação assinada e com data e hora sobrevive a uma disputa futura; um documento do Word não.

O resultado: um vendedor independente que consegue produzir uma cotação B2B compatível em cinco minutos ganha contratos que costumavam ir para o fornecedor do nível seguinte.

## Anatomia de uma cotação B2B

A equipe de compras de um comprador verifica doze campos. Perca um e a cotação volta para revisão – o que retarda a venda em 2 a 5 dias úteis.

| # | Campo | O que é isso | Por que isso importa |
|---|------|------------|----------------|
| 1 | Número da cotação | Identificador exclusivo por cotação | Arquivamento de aquisições, rastreamento de disputas |
| 2 | Data da cotação + data válida até | Quando a cotação foi emitida e quando os preços expiram | Bloqueia o preço de uma janela |
| 3 | Bloqueio de vendedor | Razão social, morada, número de identificação fiscal, contacto, administração fiscal | Identificação legal da contraparte |
| 4 | Bloqueio de comprador | Nome legal do comprador, endereço, ID de IVA, contato | Contraparte + determinação de cobrança reversa de IVA |
| 5 | Itens de linha | Por linha: SKU, descrição, quantidade, unidade, preço unitário, taxa de IVA, código HS, total de linha | A entrega real |
| 6 | Subtotal, IVA, total | Resumo matemático | Aquisição reconcilia com PO |
| 7 | Moeda | Código ISO 4217 | Evita disputas cambiais |
| 8 | Quantidade em palavras | “Quarenta e dois mil e quinhentos euros” | Prevenção de fraudes; exigido em muitas jurisdições |
| 9 | Incoterm | Prazo de 2020 (por exemplo, FOB Hamburgo, DDP Bruxelas) | Define quem paga o quê pelo frete/alfândega |
| 10 | Condições de pagamento | Net-30, 50% adiantado, etc. | Contrato de fluxo de caixa |
| 11 | IBAN/banco | IBAN, SWIFT/BIC, nome do banco | Onde o comprador transfere o dinheiro |
| 12 | Assinatura | Molhado ou eletrônico, com carimbo de data e hora | Vinculação legal |

Doze campos. Cada cotação B2B em 2026 precisa de todos os doze.

## Modos de IVA em 2026

O IVA (imposto sobre vendas) é o campo que os vendedores independentes erram com mais frequência. O mapa de 2026.

| Região | Modo | Quando se aplica | Exemplos de avaliações |
|--------|------|-----------------|---------------|
| Estado membro da UE | IVA interno | Mesmo país, B2B ou B2C | 19% (DE), 20% (FR, IT), 21% (NL, ES, BE) |
| B2B transfronteiriço da UE | Cobrança reversa (0% na fatura) | Vendedor da UE → Comprador da UE, ambos registrados para IVA | 0% (verificado via VIES) |
| B2C transfronteiriço da UE | OSS (balcão único) | Vendedor da UE → consumidor em outro estado da UE | Taxa do país comprador, declarada via OSS |
| Importação da UE | IOSS (balcão único de importação) | Vendedor fora da UE → consumidor da UE, ≤€ 150 | Taxa do país comprador, declarada via IOSS |
| Reino Unido | IVA do Reino Unido | Fornecimento do Reino Unido (pós-Brexit) | 20% padrão, 5% reduzido, 0% com classificação zero |
| NÓS | Imposto sobre vendas | Em nível estadual, varia de acordo com o nexo | 0%–11% dependendo do estado |
| Peru | KDV | Exportações nacionais + selecionadas | 1%, 10%, 20% |
| Canadá | GST/HST/QST | Federal + provincial | 5% GST + sobreposição provincial |
| Austrália | ICMS | Padrão | 10% |
| Emirados Árabes Unidos / Arábia Saudita | CUBA | Padrão | 5% (Emirados Árabes Unidos), 15% (KSA) |

Uma cotação B2B em 2026 deve declarar o modo de IVA no nível do cabeçalho (por exemplo, "Autoliquidação — Fornecimento intracomunitário da UE, Art. 138 da Diretiva IVA da UE") e a taxa por item de linha se a taxa variar.

## Códigos HS – por que a alfândega bloqueia remessas sem eles

O código do Sistema Harmonizado é um número de 6 a 10 dígitos que classifica todos os produtos comercializados. Os primeiros 6 dígitos são padronizados mundialmente (WCO); os dígitos 7 a 10 são específicos do país (EU TARIC, US HTSUS).

Exemplos: 9603.10 (pincéis artesanais), 6109.10 (camisetas de algodão), 4202.32 (carteiras), 9405.41 (lâmpadas LED).

A Alfândega utiliza o código HS para calcular impostos, aplicar acordos comerciais (EPA UE-Japão, USMCA, RCEP) e rastrear mercadorias restritas. Uma remessa com o código HS errado pode ser retida por 5 a 30 dias. Uma remessa sem código HS é retida até que um seja fornecido.

A melhor prática para 2026: procure o código HS por SKU durante a integração do produto, armazene-o no banco de dados do produto e imprima-o em cada cotação. O módulo de cotação do photoZseo integra a pesquisa HS no nível do produto, de modo que o código é definido uma vez e se propaga para cada cotação.

## Referência rápida dos Incoterms 2020

Os Incoterms 2020 definem 11 termos. Três cobrem cerca de 80% das cotações independentes de B2B:

| Prazo | Significado | Quem paga o frete | Quem paga a alfândega |
|------|---------|-------------------|------------------|
| EXW | Ex Works – o comprador retira no seu estúdio | Comprador | Comprador |
| FOB | Gratuito a bordo (porto nomeado) | Vendedor para porto, depois comprador | Comprador (após porto) |
| DDP | Entregue com taxas pagas – porta a porta, tudo incluído | Vendedor | Vendedor |

Os outros oito (CIF, CIP, DAP, DPU, FCA, CPT, CFR, FAS) são comuns no comércio industrial, mas raramente aparecem em uma cotação independente. Em caso de dúvida, EXW para retirada local, FOB para exportação, DDP para ofertas com entrega premium.

## Situação legal da assinatura eletrônica

O mapa jurídico de 2026 para assinaturas eletrônicas em documentos comerciais:

| Região | Lei aplicável | Status |
|--------|---------------|--------|
| UE | Regulamento eIDAS 910/2014 | SES, AES, QES todos válidos; QES = assinatura molhada |
| Reino Unido | Lei das Comunicações Eletrônicas de 2000 | Válido para a maioria dos contratos comerciais |
| NÓS | Lei ESIGN + UETA | Equivalente à assinatura molhada |
| Peru | Lei de Assinatura Eletrônica 5070 | QES = assinatura molhada |
| Canadá / Austrália / Emirados Árabes Unidos / Índia | Estatutos locais | Assinaturas eletrônicas reconhecidas |

Para uma cotação B2B entre duas empresas privadas, uma simples assinatura eletrônica com carimbo de data/hora e uma trilha de auditoria do dispositivo é suficiente em quase todas as jurisdições. As indústrias regulamentadas (farmacêutica, defesa, serviços financeiros) exigem frequentemente uma Assinatura Eletrónica Qualificada (QES) de um fornecedor de lista de confiança da UE – fora do âmbito do vendedor independente.

O módulo de cotação do photoZseo incorpora uma assinatura desenhada a dedo no PDF com carimbo de data e hora e identificador de dispositivo. Para artesanato, moda, acessórios e bens de consumo no atacado, isso é contratualmente vinculativo na UE, Reino Unido, EUA, Turquia, Canadá, Austrália e na maior parte do MENA.

## Fluxo de trabalho prático com photoZseo

Geração de cotação ponta a ponta em 2026:

1. O comprador bloqueia preenchimentos automáticos no seletor de contato (nome, endereço, ID de IVA, e-mail).
2. Pré-preenchimentos do perfil do remetente: seu nome legal, endereço, ID de IVA, IBAN, repartição de finanças. Configurado uma vez.
3. Adicione itens de linha: SKU, quantidade, unidade (unidades/kg/m/resma — lista completa de códigos ONU), preço unitário, taxa de IVA, código HS por linha.
4. Escolha Incoterm no menu de 11 termos e nomeie o porto/local (por exemplo, "FOB Hamburgo").
5. Condições de pagamento, moeda, período de validade — Net-30, USD/EUR, padrão de 14 dias.
6. Subtotal, IVA, cálculo automático total. A quantidade em palavras é gerada automaticamente no idioma ativo do aplicativo.
7. Assine com o dedo ou Lápis Apple; campo opcional de assinatura do comprador para negócios presenciais.
8. Exporte PDF – e-mail, AirDrop, WhatsApp Business ou iCloud Drive.

Tempo total para uma cotação de 10 linhas: 3–5 minutos, todos os 12 campos preenchidos, trilha de auditoria nos metadados do PDF.

## Uma lista de verificação prática

Antes de enviar uma cotação B2B, confirme:

- [] O número da cotação é único e sequencial.
- [] Válido até a data ser definida (padrão 14 dias ou o que o comprador solicitou).
- [ ] O ID de IVA do comprador foi verificado (VIES para a UE, HMRC para o Reino Unido).
- [ ] Cada linha possui um código HS se o pedido puder cruzar uma fronteira.
- [ ] O modo de IVA está correto – doméstico, autoliquidação, OSS ou exportação com taxa zero.
- [ ] O Incoterm nomeia a cidade/porto - não apenas "FOB", mas "FOB Hamburgo".
- [] As condições de pagamento especificam a porcentagem inicial, se houver.
- [ ] IBAN e SWIFT estão corretos (um dígito errado = uma transferência que não leva a lugar nenhum).
- [ ] O valor em palavras corresponde ao total numérico.
- [] A assinatura está presente com um carimbo de data/hora.

Se todos os dez forem confirmados, a cotação estará pronta para aquisição.

## A conclusão

A oportunidade B2B para vendedores independentes de comércio eletrônico em 2026 é real e crescente. Atacadistas, hotéis, lojas de presentes, compradores de presentes corporativos e compradores comerciais encontram marcas independentes por meio de Etsy, Instagram, TikTok Shop e Shopify e desejam comprar em grande escala. A barreira é produzir uma cotação que se pareça com o fornecedor de quem já compram.

Um PDF de 12 campos, com IVA correto, código HS e assinado eletronicamente não é mais algo que apenas as empresas produzem. Em 2026, é algo que um vendedor independente escreve em seu telefone, em seu segundo idioma, em menos de cinco minutos.

Os vendedores que internalizam isso operam em um nível diferente daqueles que ainda colam números em um documento do Word.

---

photoZseo está no App Store para iPhone e iPad.
