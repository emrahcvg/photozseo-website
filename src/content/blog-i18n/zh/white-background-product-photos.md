---
title: "白色背景产品照片：RGB 255 规则解释"
description: "Amazon 和 Walmart 需要纯白色主图像（RGB 255、255、255）。为什么近白色会失败，如何检查背景，以及如何从 iPhone 照片中获得纯白色。"
pubDate: 2026-11-26
readingMinutes: 4
tags: [amazon, walmart, product-photos, background]
tldr:
  - "Amazon 和 Walmart 要求主产品图像为纯白色：RGB 255、255、255 (#FFFFFF)。"
  - "RGB 245、245、245 等近白色看起来是白色的，但不符合规则。"
  - "获得纯白色的可靠方法是去除背景并将产品放置在 #FFFFFF 画布上。"
faqs:
  - q: "纯白色背景到底是什么？"
    a: "每个背景像素的值为 RGB 255、255、255（十六进制 #FFFFFF）。浅灰色或微暖白色不算在内。"
  - q: "哪些市场需要白色背景？"
    a: "Amazon 和 Walmart 需要它作为主图像。许多其他市场推荐它，因为白色主图像在搜索结果中看起来一致。"
  - q: "辅助图像需要白色背景吗？"
    a: "不需要。附加图像可以显示正在使用的产品、比例参考或生活方式设置。"
---

“白色背景”听起来很简单，直到列表被抑制为看起来白色的背景。市场意味着一些精确的东西。

## 规则

- Amazon：主图像必须为纯白色背景，RGB 255、255、255 ([卖家中心](https://sellercentral.amazon.com/gp/help/external/G9FUUH87RBNXGKB7))。
- Walmart Marketplace：主图像需要无缝白色背景，RGB 255、255、255（[沃尔玛市场学习](https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content%2C%20imagery%2C%20and%20media/Product-detail-page:-Image-guidelines-&-requirements)）。

辅助图像可以自由地显示上下文。

## 为什么“几乎是白色”失败了

白纸上的产品照片通常具有 RGB 235-250 左右的背景像素：阴影、渐晕和相机的白平衡使其略带灰色或暖色。肉眼看上去是白色的；到自动检查它不是。

## 如何检查你的背景

1. 使用颜色选择器在任何编辑器中打开图像。
2. 在几个地方对背景进行采样，尤其是角落。
3. 每个样本应读取 255、255、255（或 #FFFFFF）。

## 如何从 iPhone 照片中获得纯白色

1. 在柔和的光线下在朴素、浅色的背景上拍照——这会让下一步更清晰。
2. 删除背景（参见 [在 iPhone 上实现此操作的 3 种方法](/zh/blog/remove-background-product-photos-iphone)）。
3. 将产品放在 #FFFFFF 画布上，居中，填充 Amazon 框架的约 85%。
4. 以市场尺寸导出为 JPEG — 例如2000 × 2000 像素。

只要背景本身保持纯白色，产品下方的柔和阴影通常就可以。

[照片搜索引擎优化](/zh/download) 一次性执行步骤 2-4：删除设备上的背景，将产品置于纯白色，并导出带有 SEO 文件名的 Amazon、Walmart 和其他市场版本。
