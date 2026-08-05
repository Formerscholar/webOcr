import d from "node:fs";
import e from "node:path";
import { createRequire as f } from "node:module";
import { fileURLToPath as j } from "node:url";
import { b as y } from "./defaults-v_KLTY1M.js";
function w(s) {
  try {
    const t = s.resolve("onnxruntime-web");
    let r = e.dirname(t);
    if (e.basename(r) !== "dist") {
      const i = e.join(r, "dist");
      d.existsSync(i) && (r = i);
    }
    return r;
  } catch {
    return "";
  }
}
function l() {
  const s = f(import.meta.url);
  let t = e.resolve(e.dirname(j(import.meta.url)), "..");
  const r = e.join(t, "package.json");
  d.existsSync(r) || (t = e.resolve(t, ".."));
  const i = [
    e.join(t, "dist", "assets"),
    e.join(t, "assets")
  ], c = [
    e.join(t, "dist", "ort"),
    w(s)
  ], o = i.find((a) => a && d.existsSync(a)) ?? "", n = c.find((a) => a && d.existsSync(a)) ?? "";
  return { assetsDir: o, ortDir: n, pkgRoot: t };
}
function h(s) {
  const t = e.extname(s).toLowerCase();
  return {
    ".wasm": "application/wasm",
    ".mjs": "text/javascript",
    ".js": "text/javascript",
    ".map": "application/json",
    ".json": "application/json",
    ".onnx": "application/octet-stream"
  }[t] || "application/octet-stream";
}
function p(s, t) {
  const r = s.endsWith("/") ? s : `${s}/`;
  return (i, c, o) => {
    var m;
    if (!t || !((m = i.url) != null && m.startsWith(r))) return o();
    const n = decodeURIComponent(i.url.slice(r.length).split("?")[0]);
    if (!n || n.includes("..")) return o();
    const a = e.resolve(t, n);
    if (!a.startsWith(e.resolve(t)) || !d.existsSync(a) || d.statSync(a).isDirectory()) return o();
    c.setHeader("Content-Type", h(a)), c.setHeader("Cache-Control", "no-cache"), d.createReadStream(a).pipe(c);
  };
}
function u(s, t, r) {
  if (!(!s || !d.existsSync(s))) {
    d.mkdirSync(t, { recursive: !0 });
    for (const i of d.readdirSync(s)) {
      const c = e.join(s, i), o = e.join(t, i);
      d.statSync(c).isDirectory() ? u(c, o, r) : (!r || r(i)) && d.copyFileSync(c, o);
    }
  }
}
function g(s = {}) {
  const t = s.baseUrl ?? y, r = s.copyOnBuild ?? !0, i = t.endsWith("/") ? t : `${t}/`;
  let c = "dist", o = l();
  return {
    name: "webocr-bundled-assets",
    configResolved(n) {
      c = e.resolve(n.root, n.build.outDir), o = l();
    },
    configureServer(n) {
      o = l(), n.middlewares.use(p(`${i}assets/`, o.assetsDir)), n.middlewares.use(p(`${i}ort/`, o.ortDir));
    },
    closeBundle() {
      if (!r) return;
      o = l();
      const n = e.join(c, i.replace(/^\/+|\/+$/g, "") || "webocr");
      u(o.assetsDir, e.join(n, "assets"));
      const a = /* @__PURE__ */ new Set([
        "ort-wasm-simd-threaded.wasm",
        "ort-wasm-simd-threaded.mjs",
        "ort-wasm-simd-threaded.jsep.wasm",
        "ort-wasm-simd-threaded.jsep.mjs"
      ]);
      u(
        o.ortDir,
        e.join(n, "ort"),
        (m) => a.has(m)
      ), console.log(`[webocr] copied assets + ort → ${n}`);
    }
  };
}
export {
  g as default,
  g as webocr
};
//# sourceMappingURL=vite.js.map
