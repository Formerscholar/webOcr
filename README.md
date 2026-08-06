# webocr

浏览器端 OCR（PP-OCRv6 tiny + `onnxruntime-web`）。  
**模型、字符集、ORT wasm 已打进包内**，一套 API 覆盖：

| 场景 | 说明 |
|------|------|
| 纯 JS 页面 | `dist/browser.js`，无框架 |
| 浏览器扩展 | 外网构建 → 内网分发 |
| Vue 2 / Vue 3 | Options / Composition |
| React | Hook / Class |

- npm：[https://www.npmjs.com/package/webocr](https://www.npmjs.com/package/webocr)
- GitHub：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

```bash
npm i webocr
```

核心调用（所有框架相同）：

```js
import { createWebOcr } from "webocr";

const ocr = await createWebOcr({
  onProgress: (p) => console.log(p.message, p.percent),
});
const result = await ocr.recognize(file); // File / Blob / HTMLImageElement …
console.log(result.lines.map((l) => l.text).join("\n"));
ocr.dispose();
```

---

## Vite 项目（Vue / React 推荐）

```js
// vite.config.js
import { defineConfig } from "vite";
import { webocr } from "webocr/vite";

export default defineConfig({
  plugins: [webocr()], // 挂载 /webocr/assets 与 /webocr/ort
  optimizeDeps: { exclude: ["onnxruntime-web"] },
});
```

然后 `import { createWebOcr } from "webocr"` 即可。

非 Vite（Webpack / Vue CLI 等）：把 `node_modules/webocr/dist/` 拷到 `public/webocr/`，改用：

```js
import { createWebOcr } from "/webocr/browser.js";
```

---

## 1. 纯 JS 页面

```html
<script type="module">
  import { createWebOcr } from "/webocr/browser.js";

  const ocr = await createWebOcr();
  const result = await ocr.recognize(file);
</script>
```

将完整 `dist/`（`browser.js` + `assets/` + `ort/`）挂到静态路径。  
示例：`examples/static`、`examples/cdn`、`examples/js`。

---

## 2. 浏览器扩展（外网开发 → 内网发布）

1. 外网：`npm i webocr` 或 `npm run build`，把 `dist/` 拷到扩展 `vendor/webocr/`
2. 本地调试后打 zip
3. 内网分发；**运行期不访问外网**

```js
const base = chrome.runtime.getURL("vendor/webocr/");
const { createWebOcr } = await import(
  chrome.runtime.getURL("vendor/webocr/browser.js")
);
const ocr = await createWebOcr({ baseUrl: base });
```

扩展页 CSP 需包含 `'wasm-unsafe-eval'`。详见 `examples/extension`。

---

## 3. Vue 3

### Composition API（script setup）

```vue
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { createWebOcr } from "webocr";

const status = ref("初始化中…");
const text = ref("");
let ocr = null;

onMounted(async () => {
  ocr = await createWebOcr({
    onProgress: (p) => {
      status.value = `${p.message} (${p.percent}%)`;
    },
  });
  status.value = `就绪 · ${ocr.executionProvider}`;
});

onUnmounted(() => {
  ocr?.dispose();
});

async function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file || !ocr) return;
  const result = await ocr.recognize(file);
  text.value = result.lines.map((l) => l.text).join("\n");
}
</script>

<template>
  <div>
    <p>{{ status }}</p>
    <input type="file" accept="image/*" @change="onFileChange" />
    <pre>{{ text }}</pre>
  </div>
</template>
```

完整示例：`examples/vue/UseWebOcr.vue`

### Options API

```js
import { createWebOcr } from "webocr";

export default {
  data: () => ({ status: "初始化中…", text: "" }),
  async mounted() {
    this._ocr = await createWebOcr({
      onProgress: (p) => {
        this.status = `${p.message} (${p.percent}%)`;
      },
    });
    this.status = `就绪 · ${this._ocr.executionProvider}`;
  },
  beforeUnmount() {
    this._ocr?.dispose();
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files?.[0];
      if (!file || !this._ocr) return;
      const result = await this._ocr.recognize(file);
      this.text = result.lines.map((l) => l.text).join("\n");
    },
  },
};
```

完整示例：`examples/vue/UseWebOcrOptions.vue`

---

## 4. Vue 2

Options API（销毁钩子用 `beforeDestroy`）：

```js
import { createWebOcr } from "webocr";

export default {
  data: () => ({ status: "初始化中…", text: "" }),
  async mounted() {
    this._ocr = await createWebOcr({
      onProgress: (p) => {
        this.status = `${p.message} (${p.percent}%)`;
      },
    });
    this.status = `就绪 · ${this._ocr.executionProvider}`;
  },
  beforeDestroy() {
    this._ocr?.dispose();
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file || !this._ocr) return;
      const result = await this._ocr.recognize(file);
      this.text = result.lines.map((l) => l.text).join("\n");
    },
  },
};
```

完整示例：`examples/vue2/UseWebOcr.vue`  
Vue CLI / Webpack：将 `dist/` 拷到 `public/webocr/`，改为 `import { createWebOcr } from "/webocr/browser.js"`。

---

## 5. React Hook

```js
import { useEffect, useRef, useState } from "react";
import { createWebOcr } from "webocr";

export function useWebOcr() {
  const ocrRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    createWebOcr().then((ocr) => {
      if (cancelled) {
        ocr.dispose();
        return;
      }
      ocrRef.current = ocr;
      setReady(true);
    });
    return () => {
      cancelled = true;
      ocrRef.current?.dispose();
    };
  }, []);

  return {
    ready,
    recognize: (input) => {
      if (!ocrRef.current) throw new Error("OCR 未就绪");
      return ocrRef.current.recognize(input);
    },
  };
}
```

完整示例：`examples/react/useWebOcr.js`、`examples/react/OcrDemo.jsx`

---

## 6. React Class

```js
import { Component } from "react";
import { createWebOcr } from "webocr";

export class OcrDemoClass extends Component {
  state = { status: "初始化中…", text: "" };
  _ocr = null;

  async componentDidMount() {
    this._ocr = await createWebOcr({
      onProgress: (p) => {
        this.setState({ status: `${p.message} (${p.percent}%)` });
      },
    });
    this.setState({ status: `就绪 · ${this._ocr.executionProvider}` });
  }

  componentWillUnmount() {
    this._ocr?.dispose();
  }

  onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !this._ocr) return;
    const result = await this._ocr.recognize(file);
    this.setState({
      text: result.lines.map((l) => l.text).join("\n"),
    });
  };

  render() {
    return (
      <div>
        <p>{this.state.status}</p>
        <input type="file" accept="image/*" onChange={this.onFileChange} />
        <pre>{this.state.text}</pre>
      </div>
    );
  }
}
```

完整示例：`examples/react/OcrDemoClass.jsx`

---

## API 摘要

| 方法 / 字段 | 说明 |
|-------------|------|
| `createWebOcr(options?)` | 创建并初始化，返回 `WebOcr` |
| `ocr.recognize(input)` | 识别：`File` / `Blob` / `HTMLImageElement` / `ImageBitmap` / `ImageData` |
| `ocr.dispose()` | 释放会话 |
| `ocr.executionProvider` | 实际后端，如 `webgpu` / `wasm` |
| `options.onProgress` | `{ stage, message, percent }` |
| `options.baseUrl` | 仅 `browser.js`：资源根目录（扩展常用） |
| `options.assetsUrl` / `wasmPaths` | 自定义模型与 wasm 路径 |

返回值 `result.lines`：`{ text, confidence, box }[]`。

## 包内资源

| 路径 | 内容 |
|------|------|
| `/webocr/assets/models/*.onnx` | 检测 + 识别（约 6MB） |
| `/webocr/assets/ppocr_keys_v6_tiny.json` | 字符集 |
| `/webocr/ort/*` | onnxruntime wasm |
| `dist/browser.js` | 纯 JS / 扩展入口（内联 ORT JS） |

## 本地构建

```bash
npm install
npm run build
```

## License

Apache-2.0
