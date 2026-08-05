/**
 * 把模型 / 字典 / onnxruntime-web wasm 打进 dist，随 npm 包发布。
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const dist = join(root, "dist");
const assetsSrc = join(root, "assets");
const assetsDest = join(dist, "assets");
const ortDest = join(dist, "ort");

function dirSize(dir) {
  let total = 0;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) total += dirSize(p);
    else total += statSync(p).size;
  }
  return total;
}

if (!existsSync(dist)) {
  console.error("[pack-assets] dist/ missing — run vite lib build first");
  process.exit(1);
}

for (const f of [
  join(assetsSrc, "models", "PP-OCRv6_det_tiny.onnx"),
  join(assetsSrc, "models", "PP-OCRv6_rec_tiny.onnx"),
  join(assetsSrc, "ppocr_keys_v6_tiny.json"),
]) {
  if (!existsSync(f)) {
    console.error("[pack-assets] missing", f);
    process.exit(1);
  }
}

rmSync(assetsDest, { recursive: true, force: true });
mkdirSync(join(assetsDest, "models"), { recursive: true });
cpSync(assetsSrc, assetsDest, { recursive: true });

const ortMain = require.resolve("onnxruntime-web");
let ortSrc = dirname(ortMain);
if (!ortSrc.endsWith(`${sep}dist`) && !ortSrc.endsWith("/dist") && !ortSrc.endsWith("\\dist")) {
  const candidate = join(ortSrc, "dist");
  if (existsSync(candidate)) ortSrc = candidate;
}
// require.resolve 通常指向 dist/ort.*.js
if (!existsSync(join(ortSrc, "ort-wasm-simd-threaded.wasm")) && existsSync(join(dirname(ortSrc), "dist"))) {
  ortSrc = join(dirname(ortSrc), "dist");
}
if (!existsSync(ortSrc)) {
  console.error("[pack-assets] onnxruntime-web/dist not found from", ortMain);
  process.exit(1);
}

rmSync(ortDest, { recursive: true, force: true });
mkdirSync(ortDest, { recursive: true });

// 仅打包浏览器推理必需文件（wasm + webgpu/jsep），避免把 jspi/asyncify 等变体全打进包
const allow = new Set([
  "ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
  "ort-wasm-simd-threaded.jsep.mjs",
]);

let copied = 0;
for (const name of readdirSync(ortSrc)) {
  const src = join(ortSrc, name);
  if (statSync(src).isDirectory()) continue;
  if (!allow.has(name)) continue;
  cpSync(src, join(ortDest, name));
  copied += 1;
}

console.log(
  `[pack-assets] assets ${(dirSize(assetsDest) / 1024 / 1024).toFixed(1)} MB → dist/assets`,
);
console.log(
  `[pack-assets] ort ${copied} files, ${(dirSize(ortDest) / 1024 / 1024).toFixed(1)} MB → dist/ort`,
);
