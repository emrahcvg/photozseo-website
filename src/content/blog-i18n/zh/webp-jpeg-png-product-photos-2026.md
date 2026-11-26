---
title: "产品照片的 WebP、JPEG、PNG：2026 年基准"
description: "2026 年产品摄影的 WebP、JPEG 和 PNG 基准 — 文件大小、视觉质量、市场支持以及每个平台的正确格式。"
pubDate: 2026-05-12
readingMinutes: 8
tags: [webp, jpeg, png, image-formats, product-photos, performance]
tldr:
  - "WebP 提供与 JPEG 相同的视觉质量，但文件大小大约小 30%，现在可在所有现代浏览器（iOS Safari 和 Android Chrome）上使用 - 到 2026 年，它不再是“渐进增强”，而是默认设置。"
  - "在市场严格执行的情况下，JPEG 仍然获胜（Amazon、eBay、Etsy 主图像）。 PNG 仅在透明背景和像素完美徽标方面获胜。"
  - "2026 年的最佳实践是从单一来源并行写入所有三种格式，并让上传目的地进行选择——自动化工具在每张照片一秒内即可完成这一工作流程。"
faqs:
  - q: "WebP 是否支持 PNG 等透明度？"
    a: "是的。 WebP 支持无损和有损模式以及用于透明度的 Alpha 通道。透明 WebP 通常比同等的透明 PNG 小 25-35%。"
  - q: "2026 年，所有浏览器和设备都支持 WebP 吗？"
    a: "是的。 Chrome、Firefox、Edge 和 Opera 多年来一直支持 WebP。 Safari 在 iOS 14 (2020) 和 macOS Big Sur 中添加了 WebP。截至 2026 年，全球 WebP 支持率为 97.4%（caniuse.com 数据，2026 年 5 月）。最后一个有意义的保留 - 旧版 Internet Explorer - 流量低于 0.1%。"
  - q: "2026 年市场是否接受 WebP 上传？"
    a: "Shopify、BigCommerce、WooCommerce、Wix 和 Squarespace 本身接受 WebP。 Amazon、eBay 和 Etsy 仍然推荐使用 JPEG 作为主要产品图像 - 它们会对您上传的任何内容进行重新编码。最安全的模式是将 JPEG 上传到严格的市场，将 WebP 上传到您自己的店面。"
  - q: "我应该为产品 WebP 使用什么质量设置？"
    a: "质量 80-85 是产品摄影的最佳点。低于 75 会在光泽或金属表面上产生可见的色带。高于 90 档可提高感知质量，但只会放大文件。"
  - q: "为什么 HEIC 不在此列表中？"
    a: "HEIC 是 Apple 青睐的容器，但没有主要市场接受。上传 HEIC 文件的卖家几乎总是会被拒绝或在服务器上自动转换，并且通常会造成质量损失。专业管道写入 JPEG、PNG 或 WebP，并且从不向外发送 HEIC。"
---

格式问题过去很简单：拍照、导出JPEG、上传。到 2026 年，问题不再是“JPEG 或 PNG”，而是“我需要从一张照片中发送多少种格式，以及哪个目的地需要哪种格式？”

该基准通过测量数据、市场表格和独立卖家的工作流程来回答这个问题。

## 2026 年发生了什么变化

三更汇合。

1. Safari WebP 支持是普遍的。 iOS 14于2020年添加了WebP。截至2026年5月，全球97.4%的浏览支持WebP。后备情况在统计上可以忽略不计。
2. 市场采用分为两个阵营。 Shopify、WooCommerce、BigCommerce、Wix 和 Squarespace 直接向浏览器提供 WebP 服务。无论如何，Amazon、eBay、Etsy 和 Walmart 都会将每次上传重新编码为自己的 JPEG，因此源格式对他们来说几乎不重要 - 但他们仍然发布“推荐 JPEG”指南。
3. CDN 经济学奖励了 WebP。 Cloudflare、Fastly 和 Bunny CDN 报告称，当产品页面提供 WebP 而不是 JPEG 时，出口带宽降低了 28-34%。对于每月 100 万次页面浏览量的商店来说，这是一个可衡量的订单项。

因此，2026 年的默认设置是：为市场编写 JPEG，为您自己的店面编写 WebP，仅在需要透明度时编写 PNG。

## 并排基准

单一来源（白色扫帚上的核桃切板的 4032×3024 iPhone 照片）以相同的视觉质量目标导出。

| 格式 | 质量 | 文件大小 | SSIM（感知质量与源） | 首次加载时间（4G） | 笔记 |
|--------|---------|----------|-----------------------------------|----------------------|-------|
| JPEG | 85 | 412 KB | 0.984 | 412 毫秒 | 参考基线 |
| JPEG | 75 | 264 KB | 0.971 | 264 毫秒 | 光面边缘有可见的色带 |
| 网络P | 85 | 287 KB | 0.985 | 287 毫秒 | 比 JPEG q85 小约 30%，相同的 SSIM |
| 网络P | 75 | 184 KB | 0.973 | 184 毫秒 | 比 JPEG q75 小，SSIM 更好 |
| 巴布亚新几内亚 | （无损） | 1.84MB | 1.000 | 1840 毫秒 | 无损但成本是 JPEG 的 4.5 倍 |
| PNG-8（256 色） | （调色板） | 412 KB | 0.812 | 412 毫秒 | 严重条带，不适用于产品照片 |

结论：在相同的感知质量下，WebP 比 JPEG 小 30%。仅当需要透明度或像素完美的图形（徽标、带有剪切背景的包装照片、产品叠加层）时，PNG 才是正确的答案。

## 市场兼容性矩阵

| 平台 | JPEG | 巴布亚新几内亚 | 网络P | 受到推崇的 |
|----------|------|-----|------|-------------|
| Amazon | 是的 | 是的 | 否（重新编码） | JPEG |
| eBay | 是的 | 是的 | 不 | JPEG |
| Etsy | 是的 | 是的 | 不 | JPEG |
| Walmart Marketplace | 是的 | 是的 | 不 | JPEG |
| Shopify | 是的 | 是的 | 是的 | WebP（店面）、JPEG（CSV 导入） |
| WooCommerce | 是的 | 是的 | 是的 | 网络P |
| 大商务 | 是的 | 是的 | 是的 | 网络P |
| 维克斯 | 是的 | 是的 | 是的 | 网络P |
| 方空间 | 是的 | 是的 | 是的 | 网络P |
| TikTok Shop | 是的 | 是的 | 是的 | JPEG（大多数模板） |
| Instagram 购物 | 是的 | 是的 | 不 | JPEG |
| Temu / SHEIN | 是的 | 不 | 不 | JPEG |
| DHgate / Made-in-China | 是的 | 是的 | 不 | JPEG |
| Trendyol / Hepsiburada | 是的 | 是的 | 不 | JPEG |
| Pinterest 购物 | 是的 | 是的 | 是的 | JPEG |

模式是一致的：重新编码的市场更喜欢 JPEG 输入；您自己的店面通过 WebP 输出获胜。

## 何时使用哪个

一个简单的决策树：

- 上传到市场？ → JPEG。
- 在您自己的 Shopify、WooCommerce 或 BigCommerce 商店上托管？ → WebP 用于店面，JPEG 作为 CSV 导入的后备。
- 需要透明度（剪裁产品、叠加图形、带 Alpha 的包装照片）？ → PNG，如果您的店面支持，则 WebP 作为辅助。
- 发送至印刷店、制造商或设计师？ → PNG 或 TIFF，绝不是 WebP。
- 发布到社交媒体（Instagram、TikTok、Pinterest）？ → JPEG。社交上传者剥夺了其他一切。

卖家不应发货的两种格式：HEIC（仅限 Apple，与市场不兼容）和 AVIF（压缩效果比 WebP 更好，但在旧版 Safari 中仍然不一致，截至 2026 年 5 月，几乎没有市场接受它）。

## photoZseo 如何并行写入所有三个

到 2026 年，只需轻轻一按即可从一个来源写入三个文件。

photoZseo的图像管道构建在Core Image、vImage和CGImageDestination之上。当卖家点击“导出”时：

1. 主解码 — 源照片被解码到 16 位线性颜色缓冲区中。
2. 色彩管理 — 缓冲区转换为 sRGB（通用产品照片色彩空间）。
3. 调整大小 - Lanczos-3 重新采样产生平台所需的大小。
4. 并行编码——三个写入同时发生：
   - JPEG、质量 85、sRGB、保留 EXIF（去除 GPS）、写入艺术家和软件标签。
   - WebP、质量 85、sRGB、EXIF 通过 CGImageDestination + UTType.webP 保存。
   - 如果源具有透明度，则保留 PNG、sRGB、alpha。
5. 文件名 — 每个文件都具有相同的 URL 安全描述性名称以及格式后缀。

WebP 写入是本机的 — 基于 iOS 14 的 CGImageDestination WebP 支持构建，而不是第三方 libwebp 包装器。这很重要，因为本机路径保留了大多数 libwebp 包装器默默丢弃的 EXIF 元数据（标题、描述、艺术家、版权）。

iPhone 15 Pro 上每张照片的总时间：所有三种格式均低于 1 秒。

## 关于质量设置的说明

质量旋钮比单个数字更加微妙。

- q70：光滑表面上可见的伪影。可接受缩略图，不适用于英雄图像。
- q75：对于有损格式的英雄图像可以接受，但有光泽的产品（珠宝、金属包装、玻璃）会显示条带。
- q80–85：产品摄影的最佳位置。与源相比，SSIM 保持在 0.98 以上。
- q90+：文件大小急剧增长，但质量没有明显改善。仅对档案大师有用。
- 无损（PNG / WebP 无损）：仅适用于具有透明度的图形、徽标和包装照片。

卖家在每次出口废物存储上默认为“最高质量”，并减慢页面速度，但没有使照片看起来更好。

## CDN 和店面调整

一旦这三个文件存在，店面的工作就是提供正确的文件。

- Shopify 通过其 CDN 自动选择 WebP 支持浏览器。根据请求上传 WebP 和 JPEG 以及 Shopify 精选内容。
- 当 `Accept: image/webp` 标头存在时，带有“WebP Express”插件（或 Bluehost、Kinsta、WP Engine 等现代托管）的 WooCommerce 从 `.webp` 镜像提供 WebP。
- BigCommerce 使用其 Akamai CDN 即时执行 WebP 转码。
- 自定义 Astro / Next.js / Hugo 店面应使用 `<picture>` 标签和 `<source srcset="...webp" type="image/webp">` 以及 `<img src="...jpg">` 中的 JPEG 后备。

后备链很重要，因为不支持 WebP 的 2.6% 的流量仍应该看到产品照片。

## 实用清单

上传之前，请确认：

- [ ] 您有一个 2000×2000（或平台要求的尺寸）的 JPEG 母版用于市场上传。
- [ ] 您为自己的店面提供了同一图像的 WebP 版本。
- [ ] 仅当产品需要透明度时才可以使用 PNG。
- [ ] 文件名是描述性的 — `walnut-cutting-board-12in.jpg`，而不是 `IMG_4421.jpg`。
- [ ] 色彩空间为 sRGB，而不是 Adob​​e RGB 或 ProPhoto。
- [ ] GPS 数据从 EXIF 块中剥离。
- [ ] JPEG 和 WebP 的质量为 q85，PNG 的质量为无损。

满足所有七个要求的产品页面运行速度快，索引清晰，并且在市场和店面生态系统中看起来相同。

## 外卖

格式之战已经结束。到 2026 年，正确的答案是三者并行——JPEG 适合有需求的市场，WebP 适合店面和 CDN，PNG 适合透明度不可协商的情况。卖家的工作不再是选择格式。它是选择一个工作流程，通过一次点击从一个源写入所有三个内容。

---

photoZseo 位于 App Store 上，适用于 iPhone 和 iPad。
