<script>
/**
 * Vue 2 Options API
 *
 * npm i webocr
 * Vite：vite.config 里 plugins: [webocr()]，然后 import from 'webocr'
 * 非 Vite：把 dist/ 拷到 public/webocr/，改用 browser 入口（见下方注释）
 */
import { createWebOcr } from "webocr";
// 无 Vite 时改为：
// import { createWebOcr } from "/webocr/browser.js";

export default {
  name: "UseWebOcr",
  data() {
    return {
      status: "初始化中…",
      text: "",
      busy: false,
      ready: false,
    };
  },
  async mounted() {
    try {
      this._ocr = await createWebOcr({
        onProgress: (p) => {
          this.status = `${p.message} (${p.percent}%)`;
        },
      });
      this.ready = true;
      this.status = `就绪 · ${this._ocr.executionProvider}`;
    } catch (err) {
      this.status = err instanceof Error ? err.message : String(err);
    }
  },
  beforeDestroy() {
    this._ocr?.dispose();
    this._ocr = null;
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file || !this._ocr) return;
      this.busy = true;
      try {
        const result = await this._ocr.recognize(file);
        this.text = result.lines.map((l) => l.text).join("\n");
      } catch (err) {
        this.status = err instanceof Error ? err.message : String(err);
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<template>
  <div>
    <p>{{ status }}</p>
    <input
      type="file"
      accept="image/*"
      :disabled="busy || !ready"
      @change="onFileChange"
    />
    <pre>{{ text }}</pre>
  </div>
</template>
