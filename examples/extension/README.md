# 浏览器扩展示例（Manifest V3）

典型场景：**外网开发 / 构建，内网打包分发**。  
运行时不访问 npm、CDN 或任何外网——OCR 模型与 wasm 都在扩展包内。

## 流程

```
外网开发机                     内网
─────────                     ────
npm i / npm run build
把 dist/ → vendor/webocr/
本地 chrome://extensions 调试
打包 zip ──────────────────►  扩展商店 / 静默安装 / 内网分发
                               用户离线可用
```

## 外网开发步骤

```bash
# 1. 仓库根目录（可联网）
npm install
npm run build

# 2. 进入本示例，拷入产物
cd examples/extension
# PowerShell:
Copy-Item -Recurse -Force ..\..\dist .\vendor\webocr
```

目录应类似：

```
examples/extension/
  manifest.json
  popup.html
  popup.js
  vendor/webocr/          ← 即构建出的 dist/
    browser.js
    assets/...
    ort/...
```

Chrome → `chrome://extensions` → 开发者模式 → **加载已解压的扩展程序** → 选本目录。

## 发布到内网

1. 确认 `vendor/webocr/` 已是完整 `dist/`（含 `browser.js`、`assets`、`ort`）
2. 打成 zip（或贵司扩展发布流水线产物），**不要**依赖安装后再拉外网资源
3. 内网分发 / 强制安装；终端即便断网也能识别

可选：在 CI 外网构建，只把最终 zip 丢进内网制品库。

## 要点

1. **CSP**：必须允许 `'wasm-unsafe-eval'`，否则 ORT wasm 无法编译。
2. **路径**：用 `chrome.runtime.getURL("vendor/webocr/")` 作 `baseUrl`。
3. **内容脚本**：重推理放在 **扩展页 / side panel / offscreen document**，不要塞进普通 content script。
4. **无运行时外网依赖**：代码里不要写 jsDelivr / unpkg；只用包内 `vendor/webocr`。
