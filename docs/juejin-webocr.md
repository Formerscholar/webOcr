# 纯前端 OCR：webocr（PP-OCRv6 tiny）

> 包地址：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)  
> 安装：`npm i webocr`  
> 仓库：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

把百度 **PP-OCRv6 tiny** + `onnxruntime-web` 打成前端包：**模型、字典、wasm 都在包里**。  
同一套 `createWebOcr` API，支持：

- 纯 JS 页面 / 浏览器扩展（外网构建、内网分发）
- Vue 2 / Vue 3（Options + Composition）
- React Hook / Class

---

## 安装（Vite）

```bash
npm i webocr
```

```js
// vite.config.js
import { webocr } from "webocr/vite";
export default defineConfig({
  plugins: [webocr()],
  optimizeDeps: { exclude: ["onnxruntime-web"] },
});
```

```js
import { createWebOcr } from "webocr";
const ocr = await createWebOcr();
const result = await ocr.recognize(file);
```

---

## 其它场景一句话

| 场景 | 做法 |
|------|------|
| 纯 JS / 无打包 | 拷贝 `dist/`，`import "/webocr/browser.js"` |
| 浏览器扩展 | `dist/` → `vendor/webocr/`，CSP 加 `'wasm-unsafe-eval'` |
| Vue 2 | Options + `beforeDestroy`，见 `examples/vue2` |
| Vue 3 | Composition / Options，见 `examples/vue` |
| React | Hook 见 `useWebOcr.js`，Class 见 `OcrDemoClass.jsx` |

完整说明与代码：仓库 [README](https://github.com/Formerscholar/webOcr#readme)。

---

## 链接

- npm：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)
- GitHub：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)
