/**
 * 纯 JS（无 TypeScript）调用示例
 *
 * npm i webocr
 * vite.config.js → import { webocr } from 'webocr/vite'; plugins: [webocr()]
 * 模型 / 字典 / wasm 已打在包内，默认走 /webocr/
 */
import { createWebOcr } from "webocr";

const statusEl = document.querySelector("#status");
const textEl = document.querySelector("#text");
const fileEl = document.querySelector("#file");

let ocr = null;

async function boot() {
  statusEl.textContent = "初始化中…";
  ocr = await createWebOcr({
    onProgress: (p) => {
      statusEl.textContent = `${p.message} (${p.percent}%)`;
    },
  });
  statusEl.textContent = `就绪 · ${ocr.executionProvider}`;
  fileEl.disabled = false;
}

fileEl?.addEventListener("change", async () => {
  const file = fileEl.files?.[0];
  if (!file || !ocr) return;
  statusEl.textContent = "识别中…";
  try {
    const result = await ocr.recognize(file);
    textEl.value = result.lines.map((l) => l.text).join("\n");
    statusEl.textContent = `完成 · ${result.lines.length} 行`;
  } catch (err) {
    statusEl.textContent = err instanceof Error ? err.message : String(err);
  }
});

boot().catch((err) => {
  statusEl.textContent = err instanceof Error ? err.message : String(err);
});

// 页面卸载时释放
window.addEventListener("beforeunload", () => {
  ocr?.dispose();
  ocr = null;
});
