<script setup>
/**
 * Vue 3 Composition API（script setup）
 *
 * npm i webocr
 * vite.config → plugins: [webocr()]
 */
import { onMounted, onUnmounted, ref } from "vue";
import { createWebOcr } from "webocr";

const status = ref("初始化中…");
const text = ref("");
const busy = ref(false);
const ready = ref(false);
let ocr = null;

onMounted(async () => {
  try {
    ocr = await createWebOcr({
      onProgress: (p) => {
        status.value = `${p.message} (${p.percent}%)`;
      },
    });
    ready.value = true;
    status.value = `就绪 · ${ocr.executionProvider}`;
  } catch (err) {
    status.value = err instanceof Error ? err.message : String(err);
  }
});

onUnmounted(() => {
  ocr?.dispose();
  ocr = null;
});

async function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file || !ocr) return;
  busy.value = true;
  try {
    const result = await ocr.recognize(file);
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
    <input
      type="file"
      accept="image/*"
      :disabled="busy || !ready"
      @change="onFileChange"
    />
    <pre>{{ text }}</pre>
  </div>
</template>
