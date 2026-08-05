import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import type { Plugin, ResolvedConfig } from "vite";
import { DEFAULT_MOUNT_PREFIX } from "./defaults";

export type WebOcrVitePluginOptions = {
  /**
   * 浏览器访问前缀，默认 `/webocr/`
   * - `/webocr/assets/` → 模型与字典
   * - `/webocr/ort/` → onnxruntime wasm
   */
  baseUrl?: string;
  /** 构建时是否拷贝到 outDir，默认 true */
  copyOnBuild?: boolean;
};

type AssetRoots = {
  assetsDir: string;
  ortDir: string;
  pkgRoot: string;
};

function resolveOrtDist(require: NodeRequire): string {
  try {
    const main = require.resolve("onnxruntime-web");
    let dir = path.dirname(main);
    if (path.basename(dir) !== "dist") {
      const candidate = path.join(dir, "dist");
      if (fs.existsSync(candidate)) dir = candidate;
    }
    return dir;
  } catch {
    return "";
  }
}

function resolveRoots(): AssetRoots {
  const require = createRequire(import.meta.url);
  // dist/vite.js → 包根；src/vite.ts → 仓库根
  let pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const pkgJson = path.join(pkgRoot, "package.json");
  if (!fs.existsSync(pkgJson)) {
    pkgRoot = path.resolve(pkgRoot, "..");
  }

  const assetsCandidates = [
    path.join(pkgRoot, "dist", "assets"),
    path.join(pkgRoot, "assets"),
  ];
  const ortCandidates = [
    path.join(pkgRoot, "dist", "ort"),
    resolveOrtDist(require),
  ];

  const assetsDir = assetsCandidates.find((p) => p && fs.existsSync(p)) ?? "";
  const ortDir = ortCandidates.find((p) => p && fs.existsSync(p)) ?? "";
  return { assetsDir, ortDir, pkgRoot };
}

function mimeOf(file: string): string {
  const ext = path.extname(file).toLowerCase();
  const types: Record<string, string> = {
    ".wasm": "application/wasm",
    ".mjs": "text/javascript",
    ".js": "text/javascript",
    ".map": "application/json",
    ".json": "application/json",
    ".onnx": "application/octet-stream",
  };
  return types[ext] || "application/octet-stream";
}

function serveDir(
  urlPrefix: string,
  diskRoot: string,
): (req: { url?: string }, res: import("http").ServerResponse, next: () => void) => void {
  const prefix = urlPrefix.endsWith("/") ? urlPrefix : `${urlPrefix}/`;
  return (req, res, next) => {
    if (!diskRoot || !req.url?.startsWith(prefix)) return next();
    const rel = decodeURIComponent(req.url.slice(prefix.length).split("?")[0]);
    if (!rel || rel.includes("..")) return next();
    const file = path.resolve(diskRoot, rel);
    if (!file.startsWith(path.resolve(diskRoot)) || !fs.existsSync(file)) {
      return next();
    }
    if (fs.statSync(file).isDirectory()) return next();
    res.setHeader("Content-Type", mimeOf(file));
    res.setHeader("Cache-Control", "no-cache");
    fs.createReadStream(file).pipe(res);
  };
}

function copyDirFiltered(src: string, dest: string, filter?: (name: string) => boolean) {
  if (!src || !fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) {
      copyDirFiltered(from, to, filter);
    } else if (!filter || filter(name)) {
      fs.copyFileSync(from, to);
    }
  }
}

/**
 * Vite 插件：把 npm 包内的模型 / 字典 / wasm 挂到 `/webocr/`。
 *
 * @example
 * ```ts
 * import { webocr } from 'webocr/vite'
 * export default defineConfig({ plugins: [webocr()] })
 * ```
 */
export function webocr(options: WebOcrVitePluginOptions = {}): Plugin {
  const baseUrl = options.baseUrl ?? DEFAULT_MOUNT_PREFIX;
  const copyOnBuild = options.copyOnBuild ?? true;
  const mount = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  let outDir = "dist";
  let roots = resolveRoots();

  return {
    name: "webocr-bundled-assets",
    configResolved(config: ResolvedConfig) {
      outDir = path.resolve(config.root, config.build.outDir);
      roots = resolveRoots();
    },
    configureServer(server) {
      roots = resolveRoots();
      server.middlewares.use(serveDir(`${mount}assets/`, roots.assetsDir));
      server.middlewares.use(serveDir(`${mount}ort/`, roots.ortDir));
    },
    closeBundle() {
      if (!copyOnBuild) return;
      roots = resolveRoots();
      const destRoot = path.join(outDir, mount.replace(/^\/+|\/+$/g, "") || "webocr");
      copyDirFiltered(roots.assetsDir, path.join(destRoot, "assets"));
      const ortAllow = new Set([
        "ort-wasm-simd-threaded.wasm",
        "ort-wasm-simd-threaded.mjs",
        "ort-wasm-simd-threaded.jsep.wasm",
        "ort-wasm-simd-threaded.jsep.mjs",
      ]);
      copyDirFiltered(roots.ortDir, path.join(destRoot, "ort"), (name) =>
        ortAllow.has(name),
      );
      console.log(`[webocr] copied assets + ort → ${destRoot}`);
    },
  };
}

export default webocr;
