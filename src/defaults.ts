/**
 * 包内资源在浏览器中的默认挂载前缀。
 * 配合 `webocr/vite` 插件：开发态从 npm 包直出，构建时拷到 outDir/webocr/。
 */
export const DEFAULT_MOUNT_PREFIX = "/webocr/";

/** 模型 + 字典 */
export const DEFAULT_ASSETS_URL = `${DEFAULT_MOUNT_PREFIX}assets/`;

/** onnxruntime-web wasm */
export const DEFAULT_WASM_PATHS = `${DEFAULT_MOUNT_PREFIX}ort/`;
