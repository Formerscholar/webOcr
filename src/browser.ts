/**
 * 无 npm / 内网静态 / 浏览器扩展入口。
 *
 * - 把整个 `dist/` 拷到内网静态目录、扩展包或任意可访问路径
 * - `browser.js` 已内联 onnxruntime-web 的 JS；模型与 wasm 仍读同目录 `assets/`、`ort/`
 * - 默认用 `import.meta.url` 解析资源路径，扩展里只要从 `chrome-extension://…/browser.js` 导入即可自动对齐
 *
 * @example 内网静态
 * ```html
 * <script type="module">
 *   import { createWebOcr } from "/webocr/browser.js";
 *   const ocr = await createWebOcr();
 * </script>
 * ```
 *
 * @example 浏览器扩展（外网构建，内网分发；运行无外网）
 * ```js
 * const base = chrome.runtime.getURL("vendor/webocr/");
 * const { createWebOcr } = await import(chrome.runtime.getURL("vendor/webocr/browser.js"));
 * const ocr = await createWebOcr({ baseUrl: base });
 * ```
 */
import { createWebOcr as createWebOcrCore, WebOcr, OcrEngine } from "./webOcr";
import type { WebOcrOptions } from "./types";

export type BrowserWebOcrOptions = WebOcrOptions & {
  /**
   * 资源根目录（`browser.js` / `assets` / `ort` 所在目录）。
   * 默认取本文件所在目录；扩展建议显式传 `chrome.runtime.getURL("…/webocr/")`。
   */
  baseUrl?: string;
};

/** 当前 `browser.js` 所在目录 */
export function getDistBaseUrl(): string {
  return new URL("./", import.meta.url).href;
}

/** 规范化目录 URL（保证末尾 `/`） */
export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

/** 根据根目录生成 assets / ort 默认地址 */
export function resolveAssetUrls(baseUrl?: string): {
  assetsUrl: string;
  wasmPaths: string;
} {
  const base = normalizeBaseUrl(baseUrl ?? getDistBaseUrl());
  return {
    assetsUrl: new URL("assets/", base).href,
    wasmPaths: new URL("ort/", base).href,
  };
}

/**
 * 创建并初始化 OCR。
 * 未传 `assetsUrl` / `wasmPaths` 时，自动指向 `baseUrl`（或本文件目录）下的 assets、ort。
 */
export async function createWebOcr(
  options: BrowserWebOcrOptions = {},
): Promise<WebOcr> {
  const { baseUrl, ...rest } = options;
  const defaults = resolveAssetUrls(baseUrl);
  return createWebOcrCore({
    ...rest,
    assetsUrl: rest.assetsUrl ?? defaults.assetsUrl,
    wasmPaths: rest.wasmPaths ?? defaults.wasmPaths,
  });
}

export { WebOcr, OcrEngine };
export type {
  ExecutionProviderName,
  OcrInput,
  OcrLine,
  OcrProgress,
  OcrResult,
  Point,
  TextBox,
  WebOcrOptions,
} from "./types";
