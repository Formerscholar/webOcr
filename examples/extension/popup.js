/**
 * 浏览器扩展 popup（Manifest V3）
 *
 * 外网开发 → 内网发布：
 * 1. 外网：仓库根目录 npm run build
 * 2. 复制 dist/ → 本目录 vendor/webocr/
 * 3. 本地加载扩展调试
 * 4. 将整个 examples/extension（含 vendor）打 zip 发到内网安装
 *
 * 运行时只读扩展包内资源，不访问外网。
 *
 * CSP 需含 'wasm-unsafe-eval'（见 manifest.json）
 */
const statusEl = document.querySelector("#status");
const textEl = document.querySelector("#text");
const fileEl = document.querySelector("#file");

const base = chrome.runtime.getURL("vendor/webocr/");
const { createWebOcr } = await import(
  chrome.runtime.getURL("vendor/webocr/browser.js")
);

let ocr = null;

try {
  ocr = await createWebOcr({
    baseUrl: base,
    onProgress: (p) => {
      statusEl.textContent = `${p.message} (${p.percent}%)`;
    },
  });
  statusEl.textContent = `就绪 · ${ocr.executionProvider}`;
  fileEl.disabled = false;
} catch (err) {
  statusEl.textContent =
    (err instanceof Error ? err.message : String(err)) +
    " — 请确认已复制 dist/ → vendor/webocr/，且 CSP 含 wasm-unsafe-eval";
}

fileEl.addEventListener("change", async () => {
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
