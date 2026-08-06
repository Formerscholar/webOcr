<script>
/**
 * Vue 3 Options API
 *
 * npm i webocr
 * vite.config → plugins: [webocr()]
 */
import { createWebOcr } from "webocr";

export default {
  name: "UseWebOcrOptions",
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
  beforeUnmount() {
    this._ocr?.dispose();
    this._ocr = null;
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files?.[0];
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
