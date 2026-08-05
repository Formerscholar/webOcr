import { defineConfig } from "vite";
import { webocr } from "./src/vite";

export default defineConfig({
  server: {
    port: 3001,
    strictPort: false,
    open: false,
  },
  optimizeDeps: {
    exclude: ["onnxruntime-web"],
  },
  plugins: [webocr()],
});
