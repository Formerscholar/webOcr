import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * 纯浏览器包：只打进 ORT JS（外置 wasm），模型/wasm 仍读同目录 assets、ort。
 * 注意：onnxruntime-web 默认 import 是 ort.bundle（内联 wasm，会到几十 MB），
 * 必须 alias 到 ort.min.mjs，并配合运行时 wasmPaths。
 */
export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      "onnxruntime-web": resolve(
        __dirname,
        "node_modules/onnxruntime-web/dist/ort.min.mjs",
      ),
    },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/browser.ts"),
      formats: ["es"],
      fileName: () => "browser.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
      // 禁止把 .wasm 打进 JS
      external: [/\.wasm$/],
    },
    assetsInlineLimit: 0,
    sourcemap: true,
    target: "esnext",
  },
});
