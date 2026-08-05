import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  // 模型/wasm 由 scripts/pack-assets.mjs 写入 dist，勿用 publicDir
  publicDir: false,
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        vite: resolve(__dirname, "src/vite.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "onnxruntime-web",
        "vite",
        "node:fs",
        "node:path",
        "node:module",
        /^node:/,
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
