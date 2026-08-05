# webocr

浏览器端 OCR（PP-OCRv6 tiny + `onnxruntime-web`）。  
**模型、字符集、ORT wasm 已打进包内**，Vue / React / 原生都可调用。

仓库：[https://github.com/Formerscholar/webOcr](https://github.com/Formerscholar/webOcr)

## 安装（GitHub，当前推荐）

npm 官方包因账号 2FA 限制暂未发布，请直接从 GitHub 安装：

```bash
npm i github:Formerscholar/webOcr
```

或：

```bash
npm i git+https://github.com/Formerscholar/webOcr.git
```

## Vite 配置

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { webocr } from "webocr/vite";

export default defineConfig({
  plugins: [webocr()], // 挂载 /webocr/assets 与 /webocr/ort
  optimizeDeps: { exclude: ["onnxruntime-web"] },
});
```

## 用法

```ts
import { createWebOcr } from "webocr";

const ocr = await createWebOcr({
  onProgress: (p) => console.log(p.message, p.percent),
});

const result = await ocr.recognize(file);
console.log(result.lines.map((l) => l.text).join("\n"));
ocr.dispose();
```

## Vue / React

见 `examples/vue`、`examples/react`。

## 包内资源

| 路径 | 内容 |
|------|------|
| `/webocr/assets/models/*.onnx` | 检测 + 识别模型（约 6MB） |
| `/webocr/assets/ppocr_keys_v6_tiny.json` | 字符集 |
| `/webocr/ort/*` | onnxruntime wasm（精简必需文件） |

## 本地开发

```bash
npm install
npm run build
npm run dev
```

## License

Apache-2.0
