import { defineConfig } from "vite";
import { webocr } from "webocr/vite";

export default defineConfig({
  plugins: [webocr()],
  optimizeDeps: { exclude: ["onnxruntime-web"] },
});
