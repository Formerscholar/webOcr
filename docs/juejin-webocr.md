# 纯前端 OCR 也能 npm 一键用：webocr（PP-OCRv6 tiny）发布了

> 包地址：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)  
> 安装：`npm i webocr`  
> 仓库：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

给内部系统加「上传截图 → 自动识字」，以前多半是后端起 PaddleOCR + Flask。部署麻烦，还要扛并发。

这次把百度 **PP-OCRv6 tiny** 检测/识别模型，加上 `onnxruntime-web`，打成一个前端 npm 包：**模型、字典、wasm 都在包里**，Vue / React / 原生都能用。

---

## 它解决什么问题

- 不想单独养 Python OCR 服务
- 图片不想上传服务器（浏览器本地推理）
- 希望业务项目 `npm i` 就能接，少折腾资源路径

技术栈：

- 检测 + 识别：PP-OCRv6 tiny ONNX（约 6MB）
- 推理：`onnxruntime-web`（WebGPU / WASM）
- 资源：随包装好，Vite 插件自动挂载

---

## 安装与接入（Vite）

```bash
npm i webocr
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { webocr } from "webocr/vite";

export default defineConfig({
  plugins: [webocr()],
  optimizeDeps: { exclude: ["onnxruntime-web"] },
});
```

```ts
import { createWebOcr } from "webocr";

const ocr = await createWebOcr({
  onProgress: (p) => console.log(p.message, p.percent),
});

const result = await ocr.recognize(file);
console.log(result.lines.map((l) => l.text).join("\n"));
ocr.dispose();
```

不用自己往 `public/` 拷 onnx。

---

## Vue / React

核心 API 框架无关：

```ts
const ocr = await createWebOcr();
const result = await ocr.recognize(file);
```

仓库示例：`examples/vue`、`examples/react`。

---

## 默认资源路径

| 路径 | 内容 |
|------|------|
| `/webocr/assets/...` | 模型与字典 |
| `/webocr/ort/...` | onnxruntime wasm |

---

## 运行配置（大概）

- 推荐 Chrome / Edge 新版本（WebGPU 更快）
- 双核 + 4GB 内存可跑；低配会走 WASM，更慢一些
- 建议图片宽边 ≤ 2000px

---

## 当前限制（测试版）

- 文本框轴对齐外扩，无透视矫正 / 方向分类
- 复杂版面弱于官方完整流水线
- 首次加载要拉 wasm + 模型，可被浏览器缓存

---

## 链接

- npm：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)
- GitHub：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)
- 安装：`npm i webocr`

欢迎试用；有问题评论区扔日志一起看。
