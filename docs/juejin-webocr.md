# 纯前端 OCR：webocr（PP-OCRv6 tiny）

> 包地址：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)  
> 仓库：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

给内部系统加「上传截图 → 自动识字」，以前多半是后端起 PaddleOCR。这次把 **PP-OCRv6 tiny** + `onnxruntime-web` 打成前端资源包：**模型、字典、wasm 都在包里**，用 **纯 JS** 就能调（页面或浏览器扩展），不绑 Vue / React。

---

## 它解决什么问题

- 不想单独养 Python OCR 服务
- 图片留在浏览器本地推理
- 内网可离线：外网构建，内网只发静态目录或扩展包

技术栈：PP-OCRv6 tiny ONNX（约 6MB）+ `onnxruntime-web`（WebGPU / WASM）

---

## 纯 JS 接入

拿到 `dist/`（`npm i webocr` 后在 `node_modules/webocr/dist/`，或仓库 `npm run build`）：

```html
<script type="module">
  import { createWebOcr } from "/webocr/browser.js";

  const ocr = await createWebOcr({
    onProgress: (p) => console.log(p.message, p.percent),
  });

  const result = await ocr.recognize(file);
  console.log(result.lines.map((l) => l.text).join("\n"));
</script>
```

浏览器扩展（外网开发、内网发布）：

```js
const base = chrome.runtime.getURL("vendor/webocr/");
const { createWebOcr } = await import(
  chrome.runtime.getURL("vendor/webocr/browser.js")
);
const ocr = await createWebOcr({ baseUrl: base });
```

CSP 需 `'wasm-unsafe-eval'`。示例：`examples/static`、`examples/extension`。

---

## 包内资源

| 路径 | 内容 |
|------|------|
| `…/browser.js` | 入口 |
| `…/assets/...` | 模型与字典 |
| `…/ort/...` | onnxruntime wasm |

---

## 运行配置（大概）

- 推荐 Chrome / Edge 新版本（WebGPU 更快）
- 双核 + 4GB 内存可跑；低配走 WASM 更慢
- 建议图片宽边 ≤ 2000px

---

## 当前限制（测试版）

- 文本框轴对齐外扩，无透视矫正 / 方向分类
- 复杂版面弱于官方完整流水线
- 首次加载要读 wasm + 模型，可被缓存

---

## 链接

- npm：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)
- GitHub：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)
