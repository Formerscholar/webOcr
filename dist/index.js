var B = Object.defineProperty;
var G = (e, t, n) => t in e ? B(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var T = (e, t, n) => G(e, typeof t != "symbol" ? t + "" : t, n);
import * as _ from "onnxruntime-web";
import { D as Q, a as V } from "./defaults-v_KLTY1M.js";
import { b as dt } from "./defaults-v_KLTY1M.js";
function J(e, t, n, s) {
  const r = ["", ...s];
  for (r.length < n && r.push(" "); r.length < n; ) r.push("");
  let o = !1;
  if (t > 0) {
    let c = 0, d = 0;
    for (let v = 0; v < n; v++) {
      const h = e[v];
      Number.isFinite(h) && (c += h, d += 1);
    }
    o = d > 0 && c > 0.8 && c < 1.2;
  }
  const i = [], g = [];
  for (let c = 0; c < t; c++) {
    const d = c * n;
    let v = -1, h = -1 / 0;
    for (let f = 0; f < n; f++) {
      const u = e[d + f];
      Number.isFinite(u) && u > h && (h = u, v = f);
    }
    if (v < 0) continue;
    let y;
    if (o)
      y = Math.max(1e-3, Math.min(h, 0.999));
    else {
      let f = 0, u = 0;
      for (let p = 0; p < n; p++) {
        const b = e[d + p];
        if (!Number.isFinite(b)) continue;
        const w = b - h;
        if (w < -50) continue;
        const E = Math.exp(w);
        Number.isFinite(E) && (f += E, p === v && (u = E));
      }
      y = f > 0 ? Math.max(1e-3, Math.min(u / f, 0.999)) : 1e-3;
    }
    i.push(v), g.push(y);
  }
  const x = [], l = [];
  let m = -1;
  for (let c = 0; c < i.length; c++) {
    const d = i[c];
    if (d === 0) {
      m = -1;
      continue;
    }
    d !== m && (x.push(d), l.push(g[c]), m = d);
  }
  let a = "";
  for (const c of x)
    c >= 0 && c < r.length && (a += r[c]);
  const M = l.length === 0 ? 0 : l.reduce((c, d) => c + d, 0) / l.length;
  return { text: a, confidence: M };
}
function K(e, t, n, s, r, o = {}) {
  const i = o.thresh ?? 0.2, g = o.boxThresh ?? 0.4, x = o.unclipRatio ?? 1.4, l = o.minSize ?? 3, m = new Uint8Array(t * n);
  for (let h = 0; h < m.length; h++)
    m[h] = e[h] > i ? 1 : 0;
  const a = new Int32Array(t * n), M = [];
  let c = 0;
  const d = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  for (let h = 0; h < t; h++)
    for (let y = 0; y < n; y++) {
      const f = h * n + y;
      if (!m[f] || a[f]) continue;
      c += 1;
      const u = [f];
      a[f] = c;
      const p = [];
      let b = 0, w = 0;
      for (; w < u.length; ) {
        const E = u[w++];
        p.push(E), b += e[E];
        const N = E / n | 0, R = E % n;
        for (const [S, D] of d) {
          const I = N + S, P = R + D;
          if (I < 0 || I >= t || P < 0 || P >= n) continue;
          const U = I * n + P;
          !m[U] || a[U] || (a[U] = c, u.push(U));
        }
      }
      M.push({ pixels: p, sum: b });
    }
  const v = [];
  for (const h of M) {
    if (h.pixels.length < 4) continue;
    const y = h.sum / h.pixels.length;
    if (y < g) continue;
    let f = n, u = t, p = 0, b = 0;
    for (const I of h.pixels) {
      const P = I / n | 0, U = I % n;
      U < f && (f = U), U > p && (p = U), P < u && (u = P), P > b && (b = P);
    }
    const w = p - f + 1, E = b - u + 1;
    if (Math.min(w, E) < l) continue;
    const N = [
      { x: f, y: u },
      { x: p + 1, y: u },
      { x: p + 1, y: b + 1 },
      { x: f, y: b + 1 }
    ], S = Z(N, x).map((I) => ({
      x: H(I.x / s, 0, Number.MAX_SAFE_INTEGER),
      y: H(I.y / r, 0, Number.MAX_SAFE_INTEGER)
    }));
    Math.min(
      Math.hypot(S[1].x - S[0].x, S[1].y - S[0].y),
      Math.hypot(S[3].x - S[0].x, S[3].y - S[0].y)
    ) < l || v.push({ points: S, score: y });
  }
  return v.sort((h, y) => {
    const f = Math.min(...h.points.map((w) => w.y)), u = Math.min(...y.points.map((w) => w.y));
    if (Math.abs(f - u) > 10) return f - u;
    const p = Math.min(...h.points.map((w) => w.x)), b = Math.min(...y.points.map((w) => w.x));
    return p - b;
  }), v;
}
function Z(e, t) {
  const n = e.map((a) => a.x), s = e.map((a) => a.y);
  let r = Math.min(...n), o = Math.max(...n), i = Math.min(...s), g = Math.max(...s);
  const x = Math.max(o - r, 1), l = Math.max(g - i, 1), m = x * l * t / (2 * (x + l));
  return r -= m, o += m, i -= m, g += m, [
    { x: r, y: i },
    { x: o, y: i },
    { x: o, y: g },
    { x: r, y: g }
  ];
}
function H(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
const F = [0.485, 0.456, 0.406], L = [0.229, 0.224, 0.225];
function tt(e) {
  return new Promise((t, n) => {
    const s = URL.createObjectURL(e), r = new Image();
    r.onload = () => {
      URL.revokeObjectURL(s), t(r);
    }, r.onerror = () => {
      URL.revokeObjectURL(s), n(new Error("图片加载失败"));
    }, r.src = s;
  });
}
function C(e, t, n) {
  const s = t ?? ("naturalWidth" in e && e.naturalWidth ? e.naturalWidth : "width" in e ? Number(e.width) : 0), r = n ?? ("naturalHeight" in e && e.naturalHeight ? e.naturalHeight : "height" in e ? Number(e.height) : 0);
  if (!s || !r) throw new Error("无法读取图片尺寸");
  const o = document.createElement("canvas");
  o.width = s, o.height = r;
  const i = o.getContext("2d", { willReadFrequently: !0 });
  if (!i) throw new Error("Canvas 不可用");
  return i.drawImage(e, 0, 0), i.getImageData(0, 0, s, r);
}
async function et(e) {
  if (typeof ImageData < "u" && e instanceof ImageData)
    return e;
  if (typeof ImageBitmap < "u" && e instanceof ImageBitmap)
    return C(e, e.width, e.height);
  if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement)
    return e.complete || await e.decode(), C(e);
  if (typeof Blob < "u" && e instanceof Blob) {
    const t = await tt(e);
    return C(t);
  }
  throw new Error("不支持的输入类型");
}
function nt(e, t, n = 960) {
  let s = 1;
  const r = Math.max(e, t);
  r > n && (s = n / r);
  let o = Math.round(e * s), i = Math.round(t * s);
  return o = Math.max(32, Math.round(o / 32) * 32), i = Math.max(32, Math.round(i / 32) * 32), {
    resizeW: o,
    resizeH: i,
    ratioW: o / e,
    ratioH: i / t
  };
}
function st(e, t, n) {
  const s = e, r = document.createElement("canvas");
  r.width = t, r.height = n;
  const o = r.getContext("2d", { willReadFrequently: !0 });
  if (!o) throw new Error("Canvas 不可用");
  const i = document.createElement("canvas");
  i.width = s.width, i.height = s.height;
  const g = i.getContext("2d");
  if (!g) throw new Error("Canvas 不可用");
  g.putImageData(s, 0, 0), o.drawImage(i, 0, 0, t, n);
  const { data: x } = o.getImageData(0, 0, t, n), l = new Float32Array(3 * t * n), m = t * n;
  for (let a = 0; a < m; a++) {
    const M = x[a * 4] / 255, c = x[a * 4 + 1] / 255, d = x[a * 4 + 2] / 255;
    l[a] = (d - F[0]) / L[0], l[m + a] = (c - F[1]) / L[1], l[m * 2 + a] = (M - F[2]) / L[2];
  }
  return l;
}
function ot(e, t) {
  const n = rt(e, t), s = 48, r = n.width / Math.max(n.height, 1);
  let o = Math.max(8, Math.ceil(s * r));
  o = Math.min(o, 3200);
  const i = document.createElement("canvas");
  i.width = o, i.height = s;
  const g = i.getContext("2d", { willReadFrequently: !0 });
  if (!g) throw new Error("Canvas 不可用");
  g.drawImage(n.canvas, 0, 0, o, s);
  const { data: x } = g.getImageData(0, 0, o, s), l = new Float32Array(3 * s * o), m = s * o;
  for (let a = 0; a < m; a++) {
    const M = x[a * 4] / 255, c = x[a * 4 + 1] / 255, d = x[a * 4 + 2] / 255;
    l[a] = (d - 0.5) / 0.5, l[m + a] = (c - 0.5) / 0.5, l[m * 2 + a] = (M - 0.5) / 0.5;
  }
  return { tensor: l, width: o, height: s };
}
function rt(e, t) {
  const n = t.map((d) => d.x), s = t.map((d) => d.y), r = Math.max(0, Math.floor(Math.min(...n))), o = Math.min(e.width, Math.ceil(Math.max(...n))), i = Math.max(0, Math.floor(Math.min(...s))), g = Math.min(e.height, Math.ceil(Math.max(...s))), x = Math.max(1, o - r), l = Math.max(1, g - i), m = document.createElement("canvas");
  m.width = e.width, m.height = e.height;
  const a = m.getContext("2d");
  if (!a) throw new Error("Canvas 不可用");
  a.putImageData(e, 0, 0);
  const M = document.createElement("canvas");
  M.width = x, M.height = l;
  const c = M.getContext("2d");
  if (!c) throw new Error("Canvas 不可用");
  return c.drawImage(m, r, i, x, l, 0, 0, x, l), { canvas: M, width: x, height: l };
}
function A(e, t) {
  return /^https?:\/\//i.test(t) || t.startsWith("/") ? t : `${e.endsWith("/") ? e : `${e}/`}${t.replace(/^\.\//, "")}`;
}
class at {
  constructor(t = {}) {
    T(this, "detSession", null);
    T(this, "recSession", null);
    T(this, "charset", []);
    T(this, "ready", !1);
    T(this, "provider", "wasm");
    T(this, "options");
    const n = t.assetsUrl ?? Q;
    this.options = {
      assetsUrl: n,
      detModelUrl: t.detModelUrl ?? A(n, "models/PP-OCRv6_det_tiny.onnx"),
      recModelUrl: t.recModelUrl ?? A(n, "models/PP-OCRv6_rec_tiny.onnx"),
      charsetUrl: t.charsetUrl ?? A(n, "ppocr_keys_v6_tiny.json"),
      wasmPaths: t.wasmPaths ?? V,
      executionProviders: t.executionProviders ?? ["webgpu", "wasm"],
      detLimitSideLen: t.detLimitSideLen ?? 960,
      onProgress: t.onProgress
    };
  }
  get isReady() {
    return this.ready;
  }
  get executionProvider() {
    return this.provider;
  }
  set onProgress(t) {
    this.options.onProgress = t;
  }
  async init() {
    if (this.ready) return this;
    this.emit({ stage: "loading", message: "配置推理引擎…", percent: 5 }), _.env.wasm.wasmPaths = this.options.wasmPaths, _.env.wasm.numThreads = 1, this.emit({ stage: "loading", message: "加载字符集…", percent: 15 });
    const t = await fetch(this.options.charsetUrl);
    if (!t.ok)
      throw new Error(`字符集加载失败: ${this.options.charsetUrl}`);
    this.charset = await t.json();
    const n = this.options.executionProviders;
    return this.emit({ stage: "loading", message: "加载检测模型…", percent: 35 }), this.detSession = await this.createSession(
      this.options.detModelUrl,
      n
    ), this.emit({ stage: "loading", message: "加载识别模型…", percent: 70 }), this.recSession = await this.createSession(
      this.options.recModelUrl,
      n
    ), this.ready = !0, this.emit({
      stage: "done",
      message: `模型就绪 · ${this.provider} · 字典 ${this.charset.length} 字`,
      percent: 100
    }), this;
  }
  /** 识别图片（File / Blob / HTMLImageElement / ImageBitmap / ImageData） */
  async recognize(t) {
    if (!this.detSession || !this.recSession)
      throw new Error("请先调用 init() 或 createWebOcr()");
    const n = performance.now();
    this.emit({ stage: "detect", message: "读取图片…", percent: 5 });
    const s = await et(t), { resizeW: r, resizeH: o, ratioW: i, ratioH: g } = nt(
      s.width,
      s.height,
      this.options.detLimitSideLen
    );
    this.emit({
      stage: "detect",
      message: `文本检测 ${r}×${o}…`,
      percent: 15
    });
    const x = st(s, r, o), l = new _.Tensor("float32", x, [
      1,
      3,
      o,
      r
    ]), m = performance.now(), a = this.detSession.inputNames[0], M = await this.detSession.run({ [a]: l }), c = performance.now() - m, d = this.detSession.outputNames[0], v = M[d].data, h = M[d].dims, y = Number(h.length === 4 ? h[2] : h[1]), f = Number(h.length === 4 ? h[3] : h[2]), u = K(v, y, f, i, g);
    this.emit({
      stage: "recognize",
      message: `检测到 ${u.length} 个文本区域，开始识别…`,
      percent: 40
    });
    const p = [], b = performance.now();
    for (let N = 0; N < u.length; N++) {
      const R = u[N], { tensor: S, width: D, height: I } = ot(s, R.points), P = new _.Tensor("float32", S, [
        1,
        3,
        I,
        D
      ]), U = this.recSession.inputNames[0], $ = await this.recSession.run({ [U]: P }), O = this.recSession.outputNames[0], j = $[O].data, W = $[O].dims, k = Number(W[1]), Y = Number(W[2]), { text: X, confidence: q } = J(
        j,
        k,
        Y,
        this.charset
      );
      X.trim() && p.push({ box: R, text: X, confidence: q });
      const z = 40 + Math.round((N + 1) / Math.max(u.length, 1) * 55);
      this.emit({
        stage: "recognize",
        message: `识别中 ${N + 1}/${u.length}`,
        percent: z
      });
    }
    const w = performance.now() - b, E = performance.now() - n;
    return this.emit({
      stage: "done",
      message: `完成：${p.length} 行 · ${(E / 1e3).toFixed(2)}s`,
      percent: 100
    }), { lines: p, elapsedMs: E, detectMs: c, recognizeMs: w };
  }
  /** @deprecated 使用 recognize() */
  recognizeFile(t) {
    return this.recognize(t);
  }
  dispose() {
    this.detSession = null, this.recSession = null, this.charset = [], this.ready = !1;
  }
  async createSession(t, n) {
    let s;
    for (const r of n)
      try {
        const o = await _.InferenceSession.create(t, {
          executionProviders: [r]
        });
        return this.provider = r, o;
      } catch (o) {
        s = o;
      }
    throw s instanceof Error ? s : new Error("无法创建推理会话");
  }
  emit(t) {
    var n, s;
    (s = (n = this.options).onProgress) == null || s.call(n, t);
  }
}
async function ht(e) {
  const t = new at(e);
  return await t.init(), t;
}
export {
  Q as DEFAULT_ASSETS_URL,
  dt as DEFAULT_MOUNT_PREFIX,
  V as DEFAULT_WASM_PATHS,
  at as OcrEngine,
  at as WebOcr,
  ht as createWebOcr
};
//# sourceMappingURL=index.js.map
