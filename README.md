# webocr

浏览器端 OCR（PP-OCRv6 tiny + `onnxruntime-web`）。  
**模型、字符集、ORT wasm 已打进包内**，面向 **纯 JS**：页面脚本或浏览器扩展，无需 Vue / React。

- npm：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)
- GitHub：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

## 怎么用

拿到完整 `dist/`（含 `browser.js`、`assets/`、`ort/`）：

- `npm i webocr` → 用 `node_modules/webocr/dist/`
- 或本仓 `npm run build` 后复制 `dist/`

### 页面（纯 JS）

把 `dist/` 挂到静态路径（如 `/webocr/`）：

```html
<script type="module">
  import { createWebOcr } from "/webocr/browser.js";

  const ocr = await createWebOcr({
    onProgress: (p) => console.log(p.message, p.percent),
  });

  const result = await ocr.recognize(file);
  console.log(result.lines.map((l) => l.text).join("\n"));
  ocr.dispose();
</script>
```

示例：`examples/static`、`examples/cdn`。

### 浏览器扩展（外网开发 → 内网发布）

1. 外网：构建并把 `dist/` 拷到扩展 `vendor/webocr/`
2. 本地调试后打 zip
3. 内网分发；运行期不访问外网

```js
const base = chrome.runtime.getURL("vendor/webocr/");
const { createWebOcr } = await import(
  chrome.runtime.getURL("vendor/webocr/browser.js")
);
const ocr = await createWebOcr({ baseUrl: base });
```

扩展页 CSP 需包含 `'wasm-unsafe-eval'`。详见 `examples/extension`。

## 资源目录

| 路径 | 内容 |
|------|------|
| `…/browser.js` | 入口（已内联推理 JS） |
| `…/assets/models/*.onnx` | 检测 + 识别模型（约 6MB） |
| `…/assets/ppocr_keys_v6_tiny.json` | 字符集 |
| `…/ort/*` | onnxruntime wasm |

## 本地构建

```bash
npm install
npm run build
```

## License

Apache-2.0
