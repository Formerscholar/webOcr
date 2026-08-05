<script setup lang="ts">
/**
 * Vue 3 调用示例
 *
 * npm i webocr
 * vite.config.ts → plugins: [webocr()]
 * 模型 / 字典 / wasm 已打在包内，默认走 /webocr/
 */
import { onMounted, onUnmounted, ref } from "vue";
import { createWebOcr, type OcrResult, type WebOcr } from "webocr";

const status = ref("初始化中…");
const text = ref("");
const busy = ref(false);
let ocr: WebOcr | null = null;

onMounted(async () => {
  ocr = await createWebOcr({
    onProgress: (p) => {
      status.value = `${p.message} (${p.percent}%)`;
    },
  });
  status.value = `就绪 · ${ocr.executionProvider}`;
});

onUnmounted(() => {
  ocr?.dispose();
  ocr = null;
});

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !ocr) return;
  busy.value = true;
  try {
    const result: OcrResult = await ocr.recognize(file);
    text.value = result.lines.map((l) => l.text).join("\n");
  } catch (err) {
    status.value = err instanceof Error ? err.message : String(err);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div>
    <p>{{ status }}</p>
    <input type="file" accept="image/*" :disabled="busy || !ocr" @change="onFileChange" />
    <pre>{{ text }}</pre>
  </div>
</template>
