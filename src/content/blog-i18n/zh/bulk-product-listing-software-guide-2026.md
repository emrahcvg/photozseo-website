---
title: "批量产品列表软件：CSV/XLSX 上传如何在 Amazon、eBay、Etsy、Shopify 和 Trendyol 上工作 (2026)"
description: "如何批量上传产品：Amazon、eBay、Etsy、Shopify 和 Trendyol 的每个平台的模板、必填字段和图片 URL 规则，以及清单。"
pubDate: 2026-11-27
readingMinutes: 7
tags: [bulk-upload, csv, xlsx, marketplaces, product-listing]
tldr:
  - "eBay、Shopify、Amazon 和 Trendyol 接受电子表格上传。 Etsy 没有：它的帮助中心说您不能批量上传新列表，只能批量编辑现有列表。"
  - "电子表格中的图像几乎都是 URL，而不是附加文件。 URL 必须是公开的、直接的并且（在 Shopify 和 eBay 上）以 https:// 开头。"
  - "Amazon、eBay 和 Trendyol 上的每个类别模板都不同，因此请为每个类别下载一个新模板，并且不要重命名其标题。"
faqs:
  - q: "如何批量上传产品到eBay？"
    a: "在卖家中心，转到报告，然后上传，然后选择获取带有列表源的模板。填写文件并上传； eBay 列出指定的项目。使用 CSV 或 XLSX。"
  - q: "我可以使用 CSV 将新列表批量上传到 Etsy 吗？"
    a: "Etsy的帮助中心表示，您无法批量上传新列表，但您可以复制列表并批量编辑现有列表。第三方工具存在，但它们不是 Etsy 的功能。"
  - q: "Shopify 是否需要 CSV 中的图像 URL？"
    a: "是的。 CSV 中的图像 URL 必须可公开访问，使用 https:// 并且没有密码保护。 Shopify 在导入过程中下载图像。"
  - q: "Shopify 产品 CSV 应使用什么文件编码？"
    a: "Shopify 的帮助中心要求使用带有 LF 样式行结尾的 UTF-8，以逗号分隔，标题位于第一行。检查电子表格应用程序的导出设置。"
  - q: "在 Trendyol 上哪里可以上传 Excel 产品文件？"
    a: "在卖家面板中的“产品”下，然后选择“批量产品操作”，使用 Excel 产品输入选项和新产品上传类型。每个类别都有自己的模板。"
  - q: "为什么我的批量上传被拒绝？"
    a: "通常的原因是编辑了列标题、缺少必填字段、私有或重定向图像 URL 以及来自错误类别的模板。修复文件并重新上传。"
---

批量产品上传意味着准备一个电子表格（CSV 或 XLSX），每个产品一行并上传一次，而不是手动创建每个列表。 eBay、Shopify、Amazon 和 Trendyol 支持此功能； Etsy 不允许批量创建新列表。导致大多数失败的两个规则在任何地方都是相同的：保持模板的标头与给定的完全相同，并将每个图像作为公共的直接 URL。

*最后验证时间：2026 年 11 月。检查来源：Shopify 帮助中心，《使用 CSV 文件导入导出产品》； eBay 卖家中心帮助，“批量创建列表”（卖家中心报告 > 上传）； Etsy帮助中心，“我可以一次创建或编辑多个列表吗？”； Amazon Seller Central 帮助，“库存文件模板”和“图像问题”（通过搜索摘录阅读，请参阅下面的注释）； Trendyol Akademi Satıcı Bilgi Merkezi，“Excel Ürün Girişi”和“Ürün Görseli Seçimi ve Yukleme”（通过搜索摘录阅读）。*

## 各个平台如何处理批量上传？

| 平台 | 批量创建？ | 在哪里 | 文件类型 | 图像规则 |
|---|---|---|---|---|
| Shopify | 是的 | 产品展示 > 进口 | CSV、UTF-8、逗号分隔 | 公共 https:// URL |
| eBay | 是的 | 卖家中心 > 报告 > 上传 > 获取模板 | CSV 或 XLSX | https:// URL，每个列表最多 12 个，以 \ 分隔 |  |
| Amazon | 是的 | 通过上传添加产品 (Seller Central) | 特定类别的库存文件模板 | 直接网址；重定向和弹出窗口被拒绝 |
| Trendyol | 是的 | 产品 > 批量产品操作 > Excel产品录入 | Excel，每个类别一个模板 | 图片链接栏中的链接 |
| Etsy | 否（仅编辑） | 店铺经理 > 列表 | 不适用 | 不适用 |

## 如何批量上传产品到Shopify？

Shopify的帮助中心设置了格式：第一行必须是列标题，列以逗号分隔，文件应为UTF-8，行结尾为LF。对于新产品只需`Title`；如果您使用变体，则还需要 `URL handle`。 SKU等变体列也需要`Option1 name`和`Option1 value`，否则Shopify会创建默认变体并在更新时删除现有的变体。

图像必须是可公开访问的 `https://` URL，无需密码保护。 Shopify 在导入期间下载它们，因此您可以在之后删除它们。图片文件名上传后无法编辑，且不能包含`_thumb`、`_small`、`_medium`后缀。 CSV 不支持视频和 3D 模型。

| 限制 | 值（Shopify帮助中心） |
|---|---|
| 每个产品的选项 | 3 |
| 每个产品的图片 | 250 |
| 每个产品的标签 | 250 |
| 替代文本 | 最多 512 个字符，建议 125 个或更少 |
| 搜索引擎优化标题 | 70 个字符 |
| 搜索引擎优化描述 | 320 个字符 |

同一页面的已知失败原因：同时包含 `Barcode` 和 `Barcodes` 列的文件失败；部分填充维度列失败；启用覆盖后，空白单元格将删除现有值。要与 API 路线进行更深入的比较，请参阅 [Shopify CSV 与 API](/zh/blog/shopify-csv-vs-api-2026)。

## 如何批量上传列表到eBay？

eBay当前的工具是Seller Hub Reports。转到上传，单击获取模板，选择列表源和文件类型。默认为 XLSX，高级卖家建议使用 CSV； XLSX 下载最多可以包含 10 个类别，每个类别都有自己的工作表。上传完成的文件，eBay 会列出指定的项目。

添加列表的必填字段包括操作、类别 ID、标题（最多 80 个字符）、格式、持续时间、起始价格、数量、条件 ID、描述和商品照片 URL。美国网站还要求在匹配的特定项目列中提供 UPC（或同等内容），并且图书类别需要 ISBN。

图片 URL 必须以 `https://` 开头，以文件扩展名（例如 `.jpg` 或 `.png`）结尾，长度不得超过 2048 个字符，并将空格替换为 `%20`。每个列表最多可以列出 12 个图像，用竖线 (`|`) 字符分隔。图像可以自行托管或在 eBay 图片服务上。对于变化，父行将数量和价格留空，每个子行都有自己的。

## 如何批量上传产品到Amazon？

Amazon 使用特定于类别的库存文件模板，该模板是从 Seller Central 中的“通过上传添加产品”页面生成的。对于目录中尚未包含的项目，您可以使用产品模板，该模板将属性标记为必需、有条件必需或推荐。对于目录中已有的商品，您可以按产品 ID 进行搜索并使用预填充的文件。上传后，选择匹配的文件类型并查看每个SKU的处理报告。

对于图像，Amazon 的“图像问题”帮助页面表示不会接受弹出或重定向 URL，并且不会处理上传，因此 URL 必须直接指向图像文件。菜单路径和接受的文件类型因市场区域而异，因此请按照您下载的模板上的说明进行操作。有关图像尺寸，请参阅 [亚马逊产品照片规格](/zh/blog/amazon-product-photo-specs-2026)。

## 可以批量上传到Etsy吗？

不适用于新列表。 Etsy的帮助中心指出您无法批量上传新列表，并建议创建一个列表并复制它。您可以从 Shop Manager 批量编辑现有列表，包括标题、标签、描述、价格、自定义选项、处理配置文件和交付配置文件。声称可以批量创建 Etsy 列表的工具是第三方产品，而不是 Etsy 功能，因此请自行验证其条款和 API 访问权限。

## 如何批量上传产品到Trendyol？

在卖家面板中，打开“产品”，然后打开“批量产品操作”，然后使用 Excel 产品输入选项。 Trendyol 的卖家信息中心为每个类别描述一个模板，由类别代码和上传类型“Yeni Ürün Ekle”（添加新产品）标识。图像在图像链接 (Görsel Linki) 列中给出。 Trendyol还记录了图库方法：首先将图像上传到图片库，文件名等于产品条形码（对于多个图像，条形码_1，条形码_2），然后将这些名称复制到列中。上传前请勿更改模板的格式。

面板措辞可能会发生变化，因此请根据您自己的卖家帐户内的模板确认步骤。 Trendyol和Hepsiburada上的图像规则，请参见[Trendyol 和 Hepsiburada 产品照片](/zh/blog/trendyol-hepsiburada-product-photos)。

## 最常见的批量上传错误有哪些？

1. 编辑或重命名标题。模板与标题文本匹配。不要翻译或重新排序它们。
2. 类别模板错误。 Amazon、eBay 和 Trendyol 模板因类别而异。
3. 不直接的图像 URL。网页链接、重定向或受登录保护的文件夹失败。
4. URL 中的空格和特殊字符。对空格进行编码（eBay 要求 `%20`）。
5. 编码或分隔符错误。 Excel 可以导出分号或非 UTF-8 文本。
6. 标识符重复或缺失（SKU、条形码、URL 句柄）。
7. 覆盖惊喜。在Shopify上，空白单元格可以擦除现有数据。

## 预上传清单

- 为每个类别和平台下载一个新的模板。
- 使用完整目录之前的 5 行进行测试。
- 在私人浏览器窗口中打开每个图像 URL；它应该显示图像本身。
- 根据平台的当前指南检查标题、描述和标签限制。
- 保留源文件和平台错误报告的备份。

## photoZseo 适合的地方

批量上传文件仅适用于其中的图像和文本。 photoZseo prepares product photos for 46 marketplaces (resizing, compression, SEO file names, on-device background removal) and exports CSV, XLSX or JSON from the iPhone and iPad app.除了将产品发送到 Shopify 之外，它不会为您托管图像或上传到市场。 Get the app on the [下载页面](/zh/download). [Chrome 扩展程序](/zh/chrome-extension) 对您在计算机上浏览的产品页面执行相同的操作。

*photoZseo 不隶属于任何市场，也不受任何市场认可。市场名称仅用于描述兼容性。*

*Note: Amazon Seller Central and Trendyol Akademi pages could not be opened in full during verification, so details for those two platforms come from search excerpts of the official pages.请务必检查您自己帐户内的模板说明。*
