# webocr

浏览器端 OCR（PP-OCRv6 tiny + `onnxruntime-web`）。  
**模型、字符集、ORT wasm 已打进包内**，支持 npm / 内网纯静态 / 浏览器扩展。

- npm：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)
- GitHub：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

## 三种接入方式

| 场景 | 入口 | 说明 |
|------|------|------|
| Vite / npm 项目 | `webocr` + `webocr/vite` | 插件自动挂 `/webocr/` |
| 内网纯 JS / 无 npm | `dist/browser.js` | 拷贝整个 `dist/`，不访问外网 |
| 浏览器扩展 MV3 | `dist/` → `vendor/webocr/` | 外网构建，内网分发包；CSP 需 `'wasm-unsafe-eval'` |

---

## 1. npm + Vite

```bash
npm i webocr
```

```js
// vite.config.js
import { defineConfig } from "vite";
import { webocr } from "webocr/vite";

export default defineConfig({
  plugins: [webocr()],
  optimizeDeps: { exclude: ["onnxruntime-web"] },
});
```

```js
import { createWebOcr } from "webocr";

const ocr = await createWebOcr({
  onProgress: (p) => console.log(p.message, p.percent),
});
const result = await ocr.recognize(file);
ocr.dispose();
```

---

## 2. 内网纯 JS（无 npm）

1. 从 [GitHub Releases / 仓库 `dist/`](https://github.com/Formerscholar/webOcr) 或 `npm pack` 解压，拿到完整 `dist/`
2. 挂到内网静态目录，例如 `/webocr/`（需包含 `browser.js`、`assets/`、`ort/`）
3. 页面里：

```html
<script type="module">
  import { createWebOcr } from "/webocr/browser.js";

  const ocr = await createWebOcr({
    onProgress: (p) => console.log(p.message, p.percent),
  });
  const result = await ocr.recognize(file);
</script>
```

`browser.js` 已内联推理 JS；模型与 wasm 默认按 **该文件所在目录** 解析，无需 CDN。  
示例见 `examples/static`。

---

## 3. 浏览器扩展（外网开发 → 内网发布）

适合：外网用 npm 开发调试，发布物打进扩展包后发到内网；**运行期零外网依赖**。

```bash
# 外网开发机
npm i webocr          # 或 clone 本仓 npm run build
# 将包内 dist/（或 node_modules/webocr/dist/）拷到扩展 vendor/webocr/
```

```js
const base = chrome.runtime.getURL("vendor/webocr/");
const { createWebOcr } = await import(
  chrome.runtime.getURL("vendor/webocr/browser.js")
);

const ocr = await createWebOcr({ baseUrl: base });
```

`manifest.json` 扩展页 CSP 必须包含：

```json
"content_security_policy": {
  "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
}
```

内网只分发含 `vendor/webocr/` 的扩展包即可。完整示例与打包说明：`examples/extension`。

---

## Vue / React / JS

见 `examples/vue`、`examples/react`、`examples/js`。

## 包内资源（browser / 插件挂载后）

| 路径 | 内容 |
|------|------|
| `…/assets/models/*.onnx` | 检测 + 识别模型（约 6MB） |
| `…/assets/ppocr_keys_v6_tiny.json` | 字符集 |
| `…/ort/*` | onnxruntime wasm |

## 本地开发

```bash
npm install
npm run build
npm run dev
```

## License

Apache-2.0
