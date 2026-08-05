import "./style.css";
import { createWebOcr, type OcrLine, type OcrResult, type WebOcr } from "../src";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <header class="header">
    <h1>WebOCR 测试版</h1>
    <p>npm 包 demo · PP-OCRv6 tiny · 可在 Vue / React 中同样调用</p>
  </header>
  <div class="layout">
    <section class="panel">
      <div class="dropzone" id="dropzone">
        <div class="hint">
          <strong>拖拽图片到这里，或点击选择</strong>
          支持 PNG / JPG / WebP · 本地推理，图片不上传服务器
        </div>
        <canvas id="preview"></canvas>
      </div>
      <div class="toolbar">
        <label class="file-btn">
          选择图片
          <input id="file" type="file" accept="image/*" />
        </label>
        <button class="primary" id="runBtn" disabled>开始识别</button>
        <button id="clearBtn" disabled>清空</button>
      </div>
      <div class="status">
        <div class="status-row">
          <span id="statusText">正在初始化…</span>
          <span id="statusPct">0%</span>
        </div>
        <div class="bar"><i id="barFill"></i></div>
        <div class="meta" id="meta"></div>
      </div>
    </section>
    <section class="panel">
      <div class="results">
        <h2>识别结果</h2>
        <div id="lines" class="empty">模型加载完成后，上传图片即可识别。</div>
        <textarea class="fulltext" id="fulltext" placeholder="合并文本会显示在这里" readonly></textarea>
      </div>
    </section>
  </div>
`;

const dropzone = $("#dropzone");
const fileInput = $("#file") as HTMLInputElement;
const runBtn = $("#runBtn") as HTMLButtonElement;
const clearBtn = $("#clearBtn") as HTMLButtonElement;
const preview = $("#preview") as HTMLCanvasElement;
const statusText = $("#statusText");
const statusPct = $("#statusPct");
const barFill = $("#barFill");
const meta = $("#meta");
const linesEl = $("#lines");
const fulltext = $("#fulltext") as HTMLTextAreaElement;

let ocr: WebOcr | null = null;
let currentFile: File | null = null;
let currentImage: HTMLImageElement | null = null;
let lastResult: OcrResult | null = null;

function $(sel: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) throw new Error(`missing ${sel}`);
  return el;
}

async function boot() {
  try {
    ocr = await createWebOcr({
      onProgress: (p) => {
        statusText.textContent = p.message;
        statusPct.textContent = `${p.percent}%`;
        barFill.style.width = `${p.percent}%`;
      },
    });
    meta.textContent = `执行后端：${ocr.executionProvider} · 资源 /webocr/（包内）`;
    runBtn.disabled = !currentFile;
  } catch (err) {
    statusText.textContent = `初始化失败：${err instanceof Error ? err.message : String(err)}`;
    meta.textContent =
      "请确认 vite 已启用 webocr() 插件（默认挂载 /webocr/assets 与 /webocr/ort）。";
  }
}

function setImage(file: File) {
  currentFile = file;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    currentImage = img;
    drawPreview([]);
    dropzone.classList.add("has-image");
    runBtn.disabled = !ocr?.isReady;
    clearBtn.disabled = false;
    linesEl.className = "empty";
    linesEl.textContent = "图片已就绪，点击「开始识别」。";
    fulltext.value = "";
  };
  img.src = url;
}

function drawPreview(lines: OcrLine[]) {
  if (!currentImage) return;
  const maxW = dropzone.clientWidth - 4;
  const maxH = 560;
  const scale = Math.min(
    1,
    maxW / currentImage.naturalWidth,
    maxH / currentImage.naturalHeight,
  );
  const w = Math.max(1, Math.round(currentImage.naturalWidth * scale));
  const h = Math.max(1, Math.round(currentImage.naturalHeight * scale));
  preview.width = w;
  preview.height = h;
  const ctx = preview.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(currentImage, 0, 0, w, h);

  lines.forEach((line, i) => {
    const color = confColor(line.confidence);
    const pts = line.box.points.map((p) => ({
      x: p.x * scale,
      y: p.y * scale,
    }));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.closePath();
    ctx.stroke();

    const label = `${i + 1} ${(line.confidence * 100).toFixed(0)}%`;
    ctx.font = "12px sans-serif";
    ctx.fillStyle = color;
    const lx = Math.min(...pts.map((p) => p.x));
    const ly = Math.max(12, Math.min(...pts.map((p) => p.y)) - 4);
    ctx.fillText(label, lx, ly);
  });
}

function confColor(c: number): string {
  if (c >= 0.7) return "#34d399";
  if (c >= 0.4) return "#fbbf24";
  return "#f87171";
}

function renderResult(result: OcrResult) {
  lastResult = result;
  if (!ocr) return;
  if (result.lines.length === 0) {
    linesEl.className = "empty";
    linesEl.textContent = "⚠ 未检测到文本";
    fulltext.value = "";
    drawPreview([]);
    return;
  }

  linesEl.className = "";
  linesEl.innerHTML = result.lines
    .map((line, i) => {
      const conf = line.confidence * 100;
      const level = conf >= 70 ? "high" : conf >= 40 ? "mid" : "low";
      return `<div class="line">
        <span class="idx">#${i + 1}</span>
        <span class="conf ${level}">${conf.toFixed(0)}%</span>
        <span class="text"></span>
      </div>`;
    })
    .join("");

  const textNodes = linesEl.querySelectorAll(".text");
  result.lines.forEach((line, i) => {
    textNodes[i].textContent = line.text;
  });

  fulltext.value = result.lines.map((l) => l.text).join("\n");
  drawPreview(result.lines);

  meta.textContent = [
    `执行后端：${ocr.executionProvider}`,
    `总耗时 ${(result.elapsedMs / 1000).toFixed(2)}s`,
    `检测 ${result.detectMs.toFixed(0)}ms`,
    `识别 ${result.recognizeMs.toFixed(0)}ms`,
    `${result.lines.length} 行`,
  ].join(" · ");
}

dropzone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  const f = fileInput.files?.[0];
  if (f) setImage(f);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  const f = e.dataTransfer?.files?.[0];
  if (f && f.type.startsWith("image/")) setImage(f);
});

runBtn.addEventListener("click", async () => {
  if (!currentFile || !ocr?.isReady) return;
  runBtn.disabled = true;
  clearBtn.disabled = true;
  try {
    const result = await ocr.recognize(currentFile);
    renderResult(result);
  } catch (err) {
    statusText.textContent = `识别失败：${err instanceof Error ? err.message : String(err)}`;
    linesEl.className = "empty";
    linesEl.textContent = "识别出错，请换一张图或查看控制台。";
  } finally {
    runBtn.disabled = !currentFile || !ocr?.isReady;
    clearBtn.disabled = !currentFile;
  }
});

clearBtn.addEventListener("click", () => {
  currentFile = null;
  currentImage = null;
  lastResult = null;
  fileInput.value = "";
  dropzone.classList.remove("has-image");
  const ctx = preview.getContext("2d");
  ctx?.clearRect(0, 0, preview.width, preview.height);
  runBtn.disabled = true;
  clearBtn.disabled = true;
  linesEl.className = "empty";
  linesEl.textContent = "已清空，请重新选择图片。";
  fulltext.value = "";
});

void boot();

Object.assign(window, {
  __webocr: {
    get ocr() {
      return ocr;
    },
    get lastResult() {
      return lastResult;
    },
  },
});
