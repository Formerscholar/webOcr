/**
 * GitHub / npm 安装时：若已有 dist 则跳过；否则尝试构建。
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexJs = join(root, "dist", "index.js");
const det = join(root, "dist", "assets", "models", "PP-OCRv6_det_tiny.onnx");

if (existsSync(indexJs) && existsSync(det)) {
  console.log("[webocr] dist ready, skip build");
  process.exit(0);
}

console.log("[webocr] dist missing, running build…");
const r = spawnSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
process.exit(r.status ?? 1);
