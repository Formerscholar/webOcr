import type { Plugin } from "vite";
export type WebOcrVitePluginOptions = {
    /**
     * 浏览器访问前缀，默认 `/webocr/`
     * - `/webocr/assets/` → 模型与字典
     * - `/webocr/ort/` → onnxruntime wasm
     */
    baseUrl?: string;
    /** 构建时是否拷贝到 outDir，默认 true */
    copyOnBuild?: boolean;
};
/**
 * Vite 插件：把 npm 包内的模型 / 字典 / wasm 挂到 `/webocr/`。
 *
 * @example
 * ```ts
 * import { webocr } from 'webocr/vite'
 * export default defineConfig({ plugins: [webocr()] })
 * ```
 */
export declare function webocr(options?: WebOcrVitePluginOptions): Plugin;
export default webocr;
