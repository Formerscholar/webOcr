/*!
 * ONNX Runtime Web v1.27.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var ur = Object.defineProperty, tp = Object.getOwnPropertyDescriptor, ip = Object.getOwnPropertyNames, rp = Object.prototype.hasOwnProperty, ap = ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (t, i) => (typeof require < "u" ? require : t)[i] }) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
}), z = (e, t) => () => (e && (t = e(e = 0)), t), bt = (e, t) => {
  for (var i in t) ur(e, i, { get: t[i], enumerable: !0 });
}, np = (e, t, i, r) => {
  if (t && typeof t == "object" || typeof t == "function") for (let a of ip(t)) !rp.call(e, a) && a !== i && ur(e, a, { get: () => t[a], enumerable: !(r = tp(t, a)) || r.enumerable });
  return e;
}, Ft = (e) => np(ur({}, "__esModule", { value: !0 }), e), nt, Ae, tt, Pr, $o, wo = z(() => {
  nt = /* @__PURE__ */ new Map(), Ae = [], tt = (e, t, i) => {
    if (t && typeof t.init == "function" && typeof t.createInferenceSessionHandler == "function") {
      let r = nt.get(e);
      if (r === void 0) nt.set(e, { backend: t, priority: i });
      else {
        if (r.priority > i) return;
        if (r.priority === i && r.backend !== t) throw new Error(`cannot register backend "${e}" using priority ${i}`);
      }
      if (i >= 0) {
        let a = Ae.indexOf(e);
        a !== -1 && Ae.splice(a, 1);
        for (let n = 0; n < Ae.length; n++) if (nt.get(Ae[n]).priority <= i) {
          Ae.splice(n, 0, e);
          return;
        }
        Ae.push(e);
      }
      return;
    }
    throw new TypeError("not a valid backend");
  }, Pr = async (e) => {
    let t = nt.get(e);
    if (!t) return "backend not found.";
    if (t.initialized) return t.backend;
    if (t.aborted) return t.error;
    {
      let i = !!t.initPromise;
      try {
        return i || (t.initPromise = t.backend.init(e)), await t.initPromise, t.initialized = !0, t.backend;
      } catch (r) {
        return i || (t.error = `${r}`, t.aborted = !0), t.error;
      } finally {
        delete t.initPromise;
      }
    }
  }, $o = async (e) => {
    let t = e.executionProviders || [], i = t.map((u) => typeof u == "string" ? u : u.name), r = i.length === 0 ? Ae : i, a, n = [], s = /* @__PURE__ */ new Set();
    for (let u of r) {
      let l = await Pr(u);
      typeof l == "string" ? n.push({ name: u, err: l }) : (a || (a = l), a === l && s.add(u));
    }
    if (!a) throw new Error(`no available backend found. ERR: ${n.map((u) => `[${u.name}] ${u.err}`).join(", ")}`);
    for (let { name: u, err: l } of n) i.includes(u) && console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);
    let o = t.filter((u) => s.has(typeof u == "string" ? u : u.name));
    return [a, new Proxy(e, { get: (u, l) => l === "executionProviders" ? o : Reflect.get(u, l) })];
  };
}), sp = z(() => {
  wo();
}), bo, op = z(() => {
  bo = "1.27.0";
}), Kt, ue, vo = z(() => {
  op(), Kt = "warning", ue = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: bo }, set logLevel(e) {
    if (e !== void 0) {
      if (typeof e != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(e) === -1) throw new Error(`Unsupported logging level: ${e}`);
      Kt = e;
    }
  }, get logLevel() {
    return Kt;
  } }, Object.defineProperty(ue, "logLevel", { enumerable: !0 });
}), te, up = z(() => {
  vo(), te = ue;
}), xo, ko, lp = z(() => {
  xo = (e, t) => {
    let i = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
    i.width = e.dims[3], i.height = e.dims[2];
    let r = i.getContext("2d");
    if (r != null) {
      let a, n;
      t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (a = e.dims[2], n = e.dims[3]) : (a = e.dims[3], n = e.dims[2]);
      let s = t?.format !== void 0 ? t.format : "RGB", o = t?.norm, u, l;
      o === void 0 || o.mean === void 0 ? u = [255, 255, 255, 255] : typeof o.mean == "number" ? u = [o.mean, o.mean, o.mean, o.mean] : (u = [o.mean[0], o.mean[1], o.mean[2], 0], o.mean[3] !== void 0 && (u[3] = o.mean[3])), o === void 0 || o.bias === void 0 ? l = [0, 0, 0, 0] : typeof o.bias == "number" ? l = [o.bias, o.bias, o.bias, o.bias] : (l = [o.bias[0], o.bias[1], o.bias[2], 0], o.bias[3] !== void 0 && (l[3] = o.bias[3]));
      let p = n * a, d = 0, c = p, h = p * 2, f = -1;
      s === "RGBA" ? (d = 0, c = p, h = p * 2, f = p * 3) : s === "RGB" ? (d = 0, c = p, h = p * 2) : s === "RBG" && (d = 0, h = p, c = p * 2);
      for (let g = 0; g < n; g++) for (let y = 0; y < a; y++) {
        let _ = (e.data[d++] - l[0]) * u[0], m = (e.data[c++] - l[1]) * u[1], w = (e.data[h++] - l[2]) * u[2], $ = f === -1 ? 255 : (e.data[f++] - l[3]) * u[3];
        r.fillStyle = "rgba(" + _ + "," + m + "," + w + "," + $ + ")", r.fillRect(y, g, 1, 1);
      }
      if ("toDataURL" in i) return i.toDataURL();
      throw new Error("toDataURL is not supported");
    } else throw new Error("Can not access image data");
  }, ko = (e, t) => {
    let i = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), r;
    if (i != null) {
      let a, n, s;
      t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (a = e.dims[2], n = e.dims[1], s = e.dims[3]) : (a = e.dims[3], n = e.dims[2], s = e.dims[1]);
      let o = t !== void 0 && t.format !== void 0 ? t.format : "RGB", u = t?.norm, l, p;
      u === void 0 || u.mean === void 0 ? l = [255, 255, 255, 255] : typeof u.mean == "number" ? l = [u.mean, u.mean, u.mean, u.mean] : (l = [u.mean[0], u.mean[1], u.mean[2], 255], u.mean[3] !== void 0 && (l[3] = u.mean[3])), u === void 0 || u.bias === void 0 ? p = [0, 0, 0, 0] : typeof u.bias == "number" ? p = [u.bias, u.bias, u.bias, u.bias] : (p = [u.bias[0], u.bias[1], u.bias[2], 0], u.bias[3] !== void 0 && (p[3] = u.bias[3]));
      let d = n * a;
      if (t !== void 0 && (t.format !== void 0 && s === 4 && t.format !== "RGBA" || s === 3 && t.format !== "RGB" && t.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
      let c = 4, h = 0, f = 1, g = 2, y = 3, _ = 0, m = d, w = d * 2, $ = -1;
      o === "RGBA" ? (_ = 0, m = d, w = d * 2, $ = d * 3) : o === "RGB" ? (_ = 0, m = d, w = d * 2) : o === "RBG" && (_ = 0, w = d, m = d * 2), r = i.createImageData(a, n);
      for (let b = 0; b < n * a; h += c, f += c, g += c, y += c, b++) r.data[h] = (e.data[_++] - p[0]) * l[0], r.data[f] = (e.data[m++] - p[1]) * l[1], r.data[g] = (e.data[w++] - p[2]) * l[2], r.data[y] = $ === -1 ? 255 : (e.data[$++] - p[3]) * l[3];
    } else throw new Error("Can not access image data");
    return r;
  };
}), vt, So, Io, To, Eo, zo, dp = z(() => {
  lr(), vt = (e, t) => {
    if (e === void 0) throw new Error("Image buffer must be defined");
    if (t.height === void 0 || t.width === void 0) throw new Error("Image height and width must be defined");
    if (t.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
    let { height: i, width: r } = t, a = t.norm ?? { mean: 255, bias: 0 }, n, s;
    typeof a.mean == "number" ? n = [a.mean, a.mean, a.mean, a.mean] : n = [a.mean[0], a.mean[1], a.mean[2], a.mean[3] ?? 255], typeof a.bias == "number" ? s = [a.bias, a.bias, a.bias, a.bias] : s = [a.bias[0], a.bias[1], a.bias[2], a.bias[3] ?? 0];
    let o = t.format !== void 0 ? t.format : "RGBA", u = t.tensorFormat !== void 0 && t.tensorFormat !== void 0 ? t.tensorFormat : "RGB", l = i * r, p = u === "RGBA" ? new Float32Array(l * 4) : new Float32Array(l * 3), d = 4, c = 0, h = 1, f = 2, g = 3, y = 0, _ = l, m = l * 2, w = -1;
    o === "RGB" && (d = 3, c = 0, h = 1, f = 2, g = -1), u === "RGBA" ? w = l * 3 : u === "RBG" ? (y = 0, m = l, _ = l * 2) : u === "BGR" && (m = 0, _ = l, y = l * 2);
    for (let $ = 0; $ < l; $++, c += d, f += d, h += d, g += d) p[y++] = (e[c] + s[0]) / n[0], p[_++] = (e[h] + s[1]) / n[1], p[m++] = (e[f] + s[2]) / n[2], w !== -1 && g !== -1 && (p[w++] = (e[g] + s[3]) / n[3]);
    return u === "RGBA" ? new ge("float32", p, [1, 4, i, r]) : new ge("float32", p, [1, 3, i, r]);
  }, So = async (e, t) => {
    let i = typeof HTMLImageElement < "u" && e instanceof HTMLImageElement, r = typeof ImageData < "u" && e instanceof ImageData, a = typeof ImageBitmap < "u" && e instanceof ImageBitmap, n = typeof e == "string", s, o = t ?? {}, u = () => {
      if (typeof document < "u") return document.createElement("canvas");
      if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
      throw new Error("Canvas is not supported");
    }, l = (p) => typeof HTMLCanvasElement < "u" && p instanceof HTMLCanvasElement || p instanceof OffscreenCanvas ? p.getContext("2d") : null;
    if (i) {
      let p = u();
      p.width = e.width, p.height = e.height;
      let d = l(p);
      if (d != null) {
        let c = e.height, h = e.width;
        if (t !== void 0 && t.resizedHeight !== void 0 && t.resizedWidth !== void 0 && (c = t.resizedHeight, h = t.resizedWidth), t !== void 0) {
          if (o = t, t.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
          o.tensorFormat = "RGBA", o.height = c, o.width = h;
        } else o.tensorFormat = "RGBA", o.height = c, o.width = h;
        d.drawImage(e, 0, 0), s = d.getImageData(0, 0, h, c).data;
      } else throw new Error("Can not access image data");
    } else if (r) {
      let p, d;
      if (t !== void 0 && t.resizedWidth !== void 0 && t.resizedHeight !== void 0 ? (p = t.resizedHeight, d = t.resizedWidth) : (p = e.height, d = e.width), t !== void 0 && (o = t), o.format = "RGBA", o.height = p, o.width = d, t !== void 0) {
        let c = u();
        c.width = d, c.height = p;
        let h = l(c);
        if (h != null) h.putImageData(e, 0, 0), s = h.getImageData(0, 0, d, p).data;
        else throw new Error("Can not access image data");
      } else s = e.data;
    } else if (a) {
      if (t === void 0) throw new Error("Please provide image config with format for Imagebitmap");
      let p = u();
      p.width = e.width, p.height = e.height;
      let d = l(p);
      if (d != null) {
        let c = e.height, h = e.width;
        return d.drawImage(e, 0, 0, h, c), s = d.getImageData(0, 0, h, c).data, o.height = c, o.width = h, vt(s, o);
      } else throw new Error("Can not access image data");
    } else {
      if (n) return new Promise((p, d) => {
        let c = u(), h = l(c);
        if (!e || !h) return d();
        let f = new Image();
        f.crossOrigin = "Anonymous", f.src = e, f.onload = () => {
          c.width = f.width, c.height = f.height, h.drawImage(f, 0, 0, c.width, c.height);
          let g = h.getImageData(0, 0, c.width, c.height);
          o.height = c.height, o.width = c.width, p(vt(g.data, o));
        };
      });
      throw new Error("Input data provided is not supported - aborted tensor creation");
    }
    if (s !== void 0) return vt(s, o);
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }, Io = (e, t) => {
    let { width: i, height: r, download: a, dispose: n } = t, s = [1, r, i, 4];
    return new ge({ location: "texture", type: "float32", texture: e, dims: s, download: a, dispose: n });
  }, To = (e, t) => {
    let { dataType: i, dims: r, download: a, dispose: n } = t;
    return new ge({ location: "gpu-buffer", type: i ?? "float32", gpuBuffer: e, dims: r, download: a, dispose: n });
  }, Eo = (e, t) => {
    let { dataType: i, dims: r, download: a, dispose: n } = t;
    return new ge({ location: "ml-tensor", type: i ?? "float32", mlTensor: e, dims: r, download: a, dispose: n });
  }, zo = (e, t, i) => new ge({ location: "cpu-pinned", type: e, data: t, dims: i ?? [t.length] });
}), Ge, mt, jt, Co, pp = z(() => {
  Ge = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array], ["int4", Uint8Array], ["uint4", Uint8Array]]), mt = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), jt = !1, Co = () => {
    if (!jt) {
      jt = !0;
      let e = typeof BigInt64Array < "u" && BigInt64Array.from, t = typeof BigUint64Array < "u" && BigUint64Array.from, i = globalThis.Float16Array, r = typeof i < "u" && i.from;
      e && (Ge.set("int64", BigInt64Array), mt.set(BigInt64Array, "int64")), t && (Ge.set("uint64", BigUint64Array), mt.set(BigUint64Array, "uint64")), r ? (Ge.set("float16", i), mt.set(i, "float16")) : Ge.set("float16", Uint16Array);
    }
  };
}), Oo, Bo, cp = z(() => {
  lr(), Oo = (e) => {
    let t = 1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      if (typeof r != "number" || !Number.isSafeInteger(r)) throw new TypeError(`dims[${i}] must be an integer, got: ${r}`);
      if (r < 0) throw new RangeError(`dims[${i}] must be a non-negative integer, got: ${r}`);
      t *= r;
    }
    return t;
  }, Bo = (e, t) => {
    switch (e.location) {
      case "cpu":
        return new ge(e.type, e.data, t);
      case "cpu-pinned":
        return new ge({ location: "cpu-pinned", data: e.data, type: e.type, dims: t });
      case "texture":
        return new ge({ location: "texture", texture: e.texture, type: e.type, dims: t });
      case "gpu-buffer":
        return new ge({ location: "gpu-buffer", gpuBuffer: e.gpuBuffer, type: e.type, dims: t });
      case "ml-tensor":
        return new ge({ location: "ml-tensor", mlTensor: e.mlTensor, type: e.type, dims: t });
      default:
        throw new Error(`tensorReshape: tensor location ${e.location} is not supported`);
    }
  };
}), ge, lr = z(() => {
  lp(), dp(), pp(), cp(), ge = class {
    constructor(e, t, i) {
      Co();
      let r, a;
      if (typeof e == "object" && "location" in e) switch (this.dataLocation = e.location, r = e.type, a = e.dims, e.location) {
        case "cpu-pinned": {
          let s = Ge.get(r);
          if (!s) throw new TypeError(`unsupported type "${r}" to create tensor from pinned buffer`);
          if (!(e.data instanceof s)) throw new TypeError(`buffer should be of type ${s.name}`);
          this.cpuData = e.data;
          break;
        }
        case "texture": {
          if (r !== "float32") throw new TypeError(`unsupported type "${r}" to create tensor from texture`);
          this.gpuTextureData = e.texture, this.downloader = e.download, this.disposer = e.dispose;
          break;
        }
        case "gpu-buffer": {
          if (r !== "float32" && r !== "float16" && r !== "int32" && r !== "int64" && r !== "uint32" && r !== "uint8" && r !== "bool" && r !== "uint4" && r !== "int4") throw new TypeError(`unsupported type "${r}" to create tensor from gpu buffer`);
          this.gpuBufferData = e.gpuBuffer, this.downloader = e.download, this.disposer = e.dispose;
          break;
        }
        case "ml-tensor": {
          if (r !== "float32" && r !== "float16" && r !== "int32" && r !== "int64" && r !== "uint32" && r !== "uint64" && r !== "int8" && r !== "uint8" && r !== "bool" && r !== "uint4" && r !== "int4") throw new TypeError(`unsupported type "${r}" to create tensor from MLTensor`);
          this.mlTensorData = e.mlTensor, this.downloader = e.download, this.disposer = e.dispose;
          break;
        }
        default:
          throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
      }
      else {
        let s, o;
        if (typeof e == "string") if (r = e, o = i, e === "string") {
          if (!Array.isArray(t)) throw new TypeError("A string tensor's data must be a string array.");
          s = t;
        } else {
          let u = Ge.get(e);
          if (u === void 0) throw new TypeError(`Unsupported tensor type: ${e}.`);
          if (Array.isArray(t)) {
            if (e === "float16" && u === Uint16Array || e === "uint4" || e === "int4") throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);
            e === "uint64" || e === "int64" ? s = u.from(t, BigInt) : s = u.from(t);
          } else if (t instanceof u) s = t;
          else if (t instanceof Uint8ClampedArray) if (e === "uint8") s = Uint8Array.from(t);
          else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
          else if (e === "float16" && t instanceof Uint16Array && u !== Uint16Array) s = new globalThis.Float16Array(t.buffer, t.byteOffset, t.length);
          else throw new TypeError(`A ${r} tensor's data must be type of ${u}`);
        }
        else if (o = t, Array.isArray(e)) {
          if (e.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
          let u = typeof e[0];
          if (u === "string") r = "string", s = e;
          else if (u === "boolean") r = "bool", s = Uint8Array.from(e);
          else throw new TypeError(`Invalid element type of data array: ${u}.`);
        } else if (e instanceof Uint8ClampedArray) r = "uint8", s = Uint8Array.from(e);
        else {
          let u = mt.get(e.constructor);
          if (u === void 0) throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);
          r = u, s = e;
        }
        if (o === void 0) o = [s.length];
        else if (!Array.isArray(o)) throw new TypeError("A tensor's dims must be a number array");
        a = o, this.cpuData = s, this.dataLocation = "cpu";
      }
      let n = Oo(a);
      if (this.cpuData && n !== this.cpuData.length && !((r === "uint4" || r === "int4") && Math.ceil(n / 2) === this.cpuData.length)) throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);
      this.type = r, this.dims = a, this.size = n;
    }
    static async fromImage(e, t) {
      return So(e, t);
    }
    static fromTexture(e, t) {
      return Io(e, t);
    }
    static fromGpuBuffer(e, t) {
      return To(e, t);
    }
    static fromMLTensor(e, t) {
      return Eo(e, t);
    }
    static fromPinnedBuffer(e, t, i) {
      return zo(e, t, i);
    }
    toDataURL(e) {
      return xo(this, e);
    }
    toImageData(e) {
      return ko(this, e);
    }
    get data() {
      if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
      return this.cpuData;
    }
    get location() {
      return this.dataLocation;
    }
    get texture() {
      if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
      return this.gpuTextureData;
    }
    get gpuBuffer() {
      if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
      return this.gpuBufferData;
    }
    get mlTensor() {
      if (this.ensureValid(), !this.mlTensorData) throw new Error("The data is not stored as a WebNN MLTensor.");
      return this.mlTensorData;
    }
    async getData(e) {
      switch (this.ensureValid(), this.dataLocation) {
        case "cpu":
        case "cpu-pinned":
          return this.data;
        case "texture":
        case "gpu-buffer":
        case "ml-tensor": {
          if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          try {
            this.isDownloading = !0;
            let t = await this.downloader();
            return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = t, e && this.disposer && (this.disposer(), this.disposer = void 0), t;
          } finally {
            this.isDownloading = !1;
          }
        }
        default:
          throw new Error(`cannot get data from location: ${this.dataLocation}`);
      }
    }
    dispose() {
      if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
      this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
    }
    ensureValid() {
      if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
    }
    reshape(e) {
      if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
      return Bo(this, e);
    }
  };
}), $e, Ro = z(() => {
  lr(), $e = ge;
}), Ut, Xt, ze, Te, Ke, je, Ao = z(() => {
  vo(), Ut = (e, t) => {
    (typeof ue.trace > "u" ? !ue.wasm.trace : !ue.trace) || console.timeStamp(`${e}::ORT::${t}`);
  }, Xt = (e, t) => {
    let i = new Error().stack?.split(/\r\n|\r|\n/g) || [], r = !1;
    for (let a = 0; a < i.length; a++) {
      if (r && !i[a].includes("TRACE_FUNC")) {
        let n = `FUNC_${e}::${i[a].trim().split(" ")[1]}`;
        t && (n += `::${t}`), Ut("CPU", n);
        return;
      }
      i[a].includes("TRACE_FUNC") && (r = !0);
    }
  }, ze = (e) => {
    (typeof ue.trace > "u" ? !ue.wasm.trace : !ue.trace) || Xt("BEGIN", e);
  }, Te = (e) => {
    (typeof ue.trace > "u" ? !ue.wasm.trace : !ue.trace) || Xt("END", e);
  }, Ke = (e) => {
    (typeof ue.trace > "u" ? !ue.wasm.trace : !ue.trace) || console.time(`ORT::${e}`);
  }, je = (e) => {
    (typeof ue.trace > "u" ? !ue.wasm.trace : !ue.trace) || console.timeEnd(`ORT::${e}`);
  };
}), Mo, hp = z(() => {
  wo(), Ro(), Ao(), Mo = class Do {
    constructor(t) {
      this.handler = t;
    }
    async run(t, i, r) {
      ze(), Ke("InferenceSession.run");
      let a = {}, n = {};
      if (typeof t != "object" || t === null || t instanceof $e || Array.isArray(t)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
      let s = !0;
      if (typeof i == "object") {
        if (i === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
        if (i instanceof $e) throw new TypeError("'fetches' cannot be a Tensor");
        if (Array.isArray(i)) {
          if (i.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
          s = !1;
          for (let l of i) {
            if (typeof l != "string") throw new TypeError("'fetches' must be a string array or an object.");
            if (this.outputNames.indexOf(l) === -1) throw new RangeError(`'fetches' contains invalid output name: ${l}.`);
            a[l] = null;
          }
          if (typeof r == "object" && r !== null) n = r;
          else if (typeof r < "u") throw new TypeError("'options' must be an object.");
        } else {
          let l = !1, p = Object.getOwnPropertyNames(i);
          for (let d of this.outputNames) if (p.indexOf(d) !== -1) {
            let c = i[d];
            (c === null || c instanceof $e) && (l = !0, s = !1, a[d] = c);
          }
          if (l) {
            if (typeof r == "object" && r !== null) n = r;
            else if (typeof r < "u") throw new TypeError("'options' must be an object.");
          } else n = i;
        }
      } else if (typeof i < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
      for (let l of this.inputNames) if (typeof t[l] > "u") throw new Error(`input '${l}' is missing in 'feeds'.`);
      if (s) for (let l of this.outputNames) a[l] = null;
      let o = await this.handler.run(t, a, n), u = {};
      for (let l in o) if (Object.hasOwnProperty.call(o, l)) {
        let p = o[l];
        p instanceof $e ? u[l] = p : u[l] = new $e(p.type, p.data, p.dims);
      }
      return je("InferenceSession.run"), Te(), u;
    }
    async release() {
      return this.handler.dispose();
    }
    static async create(t, i, r, a) {
      ze(), Ke("InferenceSession.create");
      let n, s = {};
      if (typeof t == "string") {
        if (n = t, typeof i == "object" && i !== null) s = i;
        else if (typeof i < "u") throw new TypeError("'options' must be an object.");
      } else if (t instanceof Uint8Array) {
        if (n = t, typeof i == "object" && i !== null) s = i;
        else if (typeof i < "u") throw new TypeError("'options' must be an object.");
      } else if (t instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && t instanceof SharedArrayBuffer) {
        let p = t, d = 0, c = t.byteLength;
        if (typeof i == "object" && i !== null) s = i;
        else if (typeof i == "number") {
          if (d = i, !Number.isSafeInteger(d)) throw new RangeError("'byteOffset' must be an integer.");
          if (d < 0 || d >= p.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${p.byteLength}).`);
          if (c = t.byteLength - d, typeof r == "number") {
            if (c = r, !Number.isSafeInteger(c)) throw new RangeError("'byteLength' must be an integer.");
            if (c <= 0 || d + c > p.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${p.byteLength - d}].`);
            if (typeof a == "object" && a !== null) s = a;
            else if (typeof a < "u") throw new TypeError("'options' must be an object.");
          } else if (typeof r < "u") throw new TypeError("'byteLength' must be a number.");
        } else if (typeof i < "u") throw new TypeError("'options' must be an object.");
        n = new Uint8Array(p, d, c);
      } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
      let [o, u] = await $o(s), l = await o.createInferenceSessionHandler(n, u);
      return je("InferenceSession.create"), Te(), new Do(l);
    }
    startProfiling() {
      this.handler.startProfiling();
    }
    endProfiling() {
      this.handler.endProfiling();
    }
    get inputNames() {
      return this.handler.inputNames;
    }
    get outputNames() {
      return this.handler.outputNames;
    }
    get inputMetadata() {
      return this.handler.inputMetadata;
    }
    get outputMetadata() {
      return this.handler.outputMetadata;
    }
  };
}), dr, fp = z(() => {
  hp(), dr = Mo;
}), mp = z(() => {
}), gp = z(() => {
}), _p = z(() => {
}), yp = z(() => {
}), $p = {};
bt($p, { InferenceSession: () => dr, TRACE: () => Ut, TRACE_EVENT_BEGIN: () => Ke, TRACE_EVENT_END: () => je, TRACE_FUNC_BEGIN: () => ze, TRACE_FUNC_END: () => Te, Tensor: () => $e, env: () => te, registerBackend: () => tt });
var we = z(() => {
  sp(), up(), fp(), Ro(), mp(), gp(), Ao(), _p(), yp();
}), pr = z(() => {
}), Uo = {};
bt(Uo, { default: () => Po });
var Zt, Qt, Po, wp = z(() => {
  qd(), Ye(), hr(), Zt = "ort-wasm-proxy-worker", Qt = globalThis.self?.name === Zt, Qt && (self.onmessage = (e) => {
    let { type: t, in: i } = e.data;
    try {
      switch (t) {
        case "init-wasm":
          fr(i.wasm).then(() => {
            Or(i).then(() => {
              postMessage({ type: t });
            }, (r) => {
              postMessage({ type: t, err: r });
            });
          }, (r) => {
            postMessage({ type: t, err: r });
          });
          break;
        case "init-ep": {
          let { epName: r, env: a } = i;
          Br(a, r).then(() => {
            postMessage({ type: t });
          }, (n) => {
            postMessage({ type: t, err: n });
          });
          break;
        }
        case "copy-from": {
          let { buffer: r } = i, a = Gt(r);
          postMessage({ type: t, out: a });
          break;
        }
        case "create": {
          let { model: r, options: a } = i;
          Rr(r, a).then((n) => {
            postMessage({ type: t, out: n });
          }, (n) => {
            postMessage({ type: t, err: n });
          });
          break;
        }
        case "release":
          Ar(i), postMessage({ type: t });
          break;
        case "run": {
          let { sessionId: r, inputIndices: a, inputs: n, outputIndices: s, options: o } = i;
          Mr(r, a, n, s, new Array(s.length).fill(null), o).then((u) => {
            u.some((l) => l[3] !== "cpu") ? postMessage({ type: t, err: "Proxy does not support non-cpu tensor location." }) : postMessage({ type: t, out: u }, Ur([...n, ...u]));
          }, (u) => {
            postMessage({ type: t, err: u });
          });
          break;
        }
        case "end-profiling":
          Dr(i), postMessage({ type: t });
          break;
        default:
      }
    } catch (r) {
      postMessage({ type: t, err: r });
    }
  }), Po = Qt ? null : (e) => new Worker(e ?? me, { type: "module", name: Zt });
}), Yt, Nr, qr, me, cr, xt, Vr, Lr, Jt, Wr, ei, No, ti, qo, hr = z(() => {
  pr(), Yt = typeof location > "u" ? void 0 : location.origin, Nr = import.meta.url > "file:" && import.meta.url < "file;", qr = () => {
    {
      if (Nr) {
        let e = URL;
        return new URL(new e("ort.min.mjs", import.meta.url).href, Yt).href;
      }
      return import.meta.url;
    }
  }, me = qr(), cr = () => {
    if (me && !me.startsWith("blob:")) return me.substring(0, me.lastIndexOf("/") + 1);
  }, xt = (e, t) => {
    try {
      let i = t ?? me;
      return (i ? new URL(e, i) : new URL(e)).origin === Yt;
    } catch {
      return !1;
    }
  }, Vr = (e, t) => {
    let i = t ?? me;
    try {
      return (i ? new URL(e, i) : new URL(e)).href;
    } catch {
      return;
    }
  }, Lr = (e, t) => `${t ?? "./"}${e}`, Jt = async (e) => {
    let t = await (await fetch(e, { credentials: "same-origin" })).blob();
    return URL.createObjectURL(t);
  }, Wr = async (e) => (await import(
    /*webpackIgnore:true*/
    /*@vite-ignore*/
    e
  )).default, ei = (wp(), Ft(Uo)).default, No = async () => {
    if (!me) throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
    if (xt(me)) return [void 0, ei()];
    let e = await Jt(me);
    return [e, ei(e)];
  }, ti = void 0, qo = async (e, t, i, r) => {
    let a = ti && !(e || t);
    if (a) if (me) a = xt(me) || r && !i;
    else if (r && !i) a = !0;
    else throw new Error("cannot determine the script source URL.");
    if (a) return [void 0, ti];
    {
      let n = "ort-wasm-simd-threaded.jsep.mjs", s = e ?? Vr(n, t), o = i && s && !xt(s, t), u = o ? await Jt(s) : s ?? Lr(n, t);
      return [o ? u : void 0, await Wr(u)];
    }
  };
}), ii, kt, st, ri, Gr, Fr, Hr, fr, ie, Ye = z(() => {
  hr(), kt = !1, st = !1, ri = !1, Gr = () => {
    if (typeof SharedArrayBuffer > "u") return !1;
    try {
      return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
    } catch {
      return !1;
    }
  }, Fr = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
    } catch {
      return !1;
    }
  }, Hr = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 19, 1, 17, 0, 65, 1, 253, 15, 65, 2, 253, 15, 65, 3, 253, 15, 253, 147, 2, 11]));
    } catch {
      return !1;
    }
  }, fr = async (e) => {
    if (kt) return Promise.resolve();
    if (st) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
    if (ri) throw new Error("previous call to 'initializeWebAssembly()' failed.");
    st = !0;
    let t = e.initTimeout, i = e.numThreads;
    if (e.simd !== !1) {
      if (e.simd === "relaxed") {
        if (!Hr()) throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
      } else if (!Fr()) throw new Error("WebAssembly SIMD is not supported in the current environment.");
    }
    let r = Gr();
    i > 1 && !r && (typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + i + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."), e.numThreads = i = 1);
    let a = e.wasmPaths, n = typeof a == "string" ? a : void 0, s = a?.mjs, o = s?.href ?? s, u = a?.wasm, l = u?.href ?? u, p = e.wasmBinary, [d, c] = await qo(o, n, i > 1, !!p || !!l), h = !1, f = [];
    if (t > 0 && f.push(new Promise((g) => {
      setTimeout(() => {
        h = !0, g();
      }, t);
    })), f.push(new Promise((g, y) => {
      let _ = { numThreads: i };
      if (p) _.wasmBinary = p, _.locateFile = (m) => m;
      else if (l || n) _.locateFile = (m) => l ?? n + m;
      else if (o && o.indexOf("blob:") !== 0) _.locateFile = (m) => new URL(m, o).href;
      else if (d) {
        let m = cr();
        m && (_.locateFile = (w) => m + w);
      }
      c(_).then((m) => {
        st = !1, kt = !0, ii = m, g(), d && URL.revokeObjectURL(d);
      }, (m) => {
        st = !1, ri = !0, y(m);
      });
    })), await Promise.race(f), h) throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`);
  }, ie = () => {
    if (kt && ii) return ii;
    throw new Error("WebAssembly is not initialized yet.");
  };
}), Ie, Pt, J, mr = z(() => {
  Ye(), Ie = (e, t) => {
    let i = ie(), r = i.lengthBytesUTF8(e) + 1, a = i._malloc(r);
    return i.stringToUTF8(e, a, r), t.push(a), a;
  }, Pt = (e, t, i, r) => {
    if (typeof e == "object" && e !== null) {
      if (i.has(e)) throw new Error("Circular reference in options");
      i.add(e);
    }
    Object.entries(e).forEach(([a, n]) => {
      let s = t ? t + a : a;
      if (typeof n == "object") Pt(n, s + ".", i, r);
      else if (typeof n == "string" || typeof n == "number") r(s, n.toString());
      else if (typeof n == "boolean") r(s, n ? "1" : "0");
      else throw new Error(`Can't handle extra config type: ${typeof n}`);
    });
  }, J = (e) => {
    let t = ie(), i = t.stackSave();
    try {
      let r = t.PTR_SIZE, a = t.stackAlloc(2 * r);
      t._OrtGetLastError(a, a + r);
      let n = Number(t.getValue(a, r === 4 ? "i32" : "i64")), s = t.getValue(a + r, "*"), o = s ? t.UTF8ToString(s) : "";
      throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${o}`);
    } finally {
      t.stackRestore(i);
    }
  };
}), Vo, bp = z(() => {
  Ye(), mr(), Vo = (e) => {
    let t = ie(), i = 0, r = [], a = e || {};
    try {
      if (e?.logSeverityLevel === void 0) a.logSeverityLevel = 2;
      else if (typeof e.logSeverityLevel != "number" || !Number.isInteger(e.logSeverityLevel) || e.logSeverityLevel < 0 || e.logSeverityLevel > 4) throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);
      if (e?.logVerbosityLevel === void 0) a.logVerbosityLevel = 0;
      else if (typeof e.logVerbosityLevel != "number" || !Number.isInteger(e.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);
      e?.terminate === void 0 && (a.terminate = !1);
      let n = 0;
      return e?.tag !== void 0 && (n = Ie(e.tag, r)), i = t._OrtCreateRunOptions(a.logSeverityLevel, a.logVerbosityLevel, !!a.terminate, n), i === 0 && J("Can't create run options."), e?.extra !== void 0 && Pt(e.extra, "", /* @__PURE__ */ new WeakSet(), (s, o) => {
        let u = Ie(s, r), l = Ie(o, r);
        t._OrtAddRunConfigEntry(i, u, l) !== 0 && J(`Can't set a run config entry: ${s} - ${o}.`);
      }), [i, r];
    } catch (n) {
      throw i !== 0 && t._OrtReleaseRunOptions(i), r.forEach((s) => t._free(s)), n;
    }
  };
}), Kr, jr, Xr, Ne, Zr, Lo, vp = z(() => {
  Ye(), mr(), Kr = (e) => {
    switch (e) {
      case "disabled":
        return 0;
      case "basic":
        return 1;
      case "extended":
        return 2;
      case "layout":
        return 3;
      case "all":
        return 99;
      default:
        throw new Error(`unsupported graph optimization level: ${e}`);
    }
  }, jr = (e) => {
    switch (e) {
      case "sequential":
        return 0;
      case "parallel":
        return 1;
      default:
        throw new Error(`unsupported execution mode: ${e}`);
    }
  }, Xr = (e) => {
    e.extra || (e.extra = {}), e.extra.session || (e.extra.session = {});
    let t = e.extra.session;
    t.use_ort_model_bytes_directly || (t.use_ort_model_bytes_directly = "1"), e.executionProviders && e.executionProviders.some((i) => (typeof i == "string" ? i : i.name) === "webgpu") && (e.enableMemPattern = !1);
  }, Ne = (e, t, i, r) => {
    let a = Ie(t, r), n = Ie(i, r);
    ie()._OrtAddSessionConfigEntry(e, a, n) !== 0 && J(`Can't set a session config entry: ${t} - ${i}.`);
  }, Zr = async (e, t, i) => {
    let r = t.executionProviders;
    for (let a of r) {
      let n = typeof a == "string" ? a : a.name, s = [];
      switch (n) {
        case "webnn":
          if (n = "WEBNN", Ne(e, "session.disable_quant_qdq", "1", i), Ne(e, "session.disable_qdq_constant_folding", "1", i), typeof a != "string") {
            let d = a?.deviceType;
            d && Ne(e, "deviceType", d, i);
          }
          break;
        case "webgpu":
          if (n = "JS", typeof a != "string") {
            let d = a;
            if (d?.preferredLayout) {
              if (d.preferredLayout !== "NCHW" && d.preferredLayout !== "NHWC") throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${d.preferredLayout}`);
              Ne(e, "preferredLayout", d.preferredLayout, i);
            }
          }
          break;
        case "wasm":
        case "cpu":
          continue;
        default:
          throw new Error(`not supported execution provider: ${n}`);
      }
      let o = Ie(n, i), u = s.length, l = 0, p = 0;
      if (u > 0) {
        l = ie()._malloc(u * ie().PTR_SIZE), i.push(l), p = ie()._malloc(u * ie().PTR_SIZE), i.push(p);
        for (let d = 0; d < u; d++) ie().setValue(l + d * ie().PTR_SIZE, s[d][0], "*"), ie().setValue(p + d * ie().PTR_SIZE, s[d][1], "*");
      }
      await ie()._OrtAppendExecutionProvider(e, o, l, p, u) !== 0 && J(`Can't append execution provider: ${n}.`);
    }
  }, Lo = async (e) => {
    let t = ie(), i = 0, r = [], a = e || {};
    Xr(a);
    try {
      let n = Kr(a.graphOptimizationLevel ?? "all"), s = jr(a.executionMode ?? "sequential"), o = typeof a.logId == "string" ? Ie(a.logId, r) : 0, u = a.logSeverityLevel ?? 2;
      if (!Number.isInteger(u) || u < 0 || u > 4) throw new Error(`log severity level is not valid: ${u}`);
      let l = a.logVerbosityLevel ?? 0;
      if (!Number.isInteger(l) || l < 0 || l > 4) throw new Error(`log verbosity level is not valid: ${l}`);
      let p = typeof a.optimizedModelFilePath == "string" ? Ie(a.optimizedModelFilePath, r) : 0;
      if (i = t._OrtCreateSessionOptions(n, !!a.enableCpuMemArena, !!a.enableMemPattern, s, !!a.enableProfiling, 0, o, u, l, p), i === 0 && J("Can't create session options."), a.executionProviders && await Zr(i, a, r), a.enableGraphCapture !== void 0) {
        if (typeof a.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);
        Ne(i, "enableGraphCapture", a.enableGraphCapture.toString(), r);
      }
      if (a.freeDimensionOverrides) for (let [d, c] of Object.entries(a.freeDimensionOverrides)) {
        if (typeof d != "string") throw new Error(`free dimension override name must be a string: ${d}`);
        if (typeof c != "number" || !Number.isInteger(c) || c < 0) throw new Error(`free dimension override value must be a non-negative integer: ${c}`);
        let h = Ie(d, r);
        t._OrtAddFreeDimensionOverride(i, h, c) !== 0 && J(`Can't set a free dimension override: ${d} - ${c}.`);
      }
      return a.extra !== void 0 && Pt(a.extra, "", /* @__PURE__ */ new WeakSet(), (d, c) => {
        Ne(i, d, c, r);
      }), [i, r];
    } catch (n) {
      throw i !== 0 && t._OrtReleaseSessionOptions(i) !== 0 && J("Can't release session options."), r.forEach((s) => t._free(s)), n;
    }
  };
}), Fe, Be, He, Ht, Nt, gr, _r, Ki, V = z(() => {
  Fe = (e) => {
    switch (e) {
      case "int8":
        return 3;
      case "uint8":
        return 2;
      case "bool":
        return 9;
      case "int16":
        return 5;
      case "uint16":
        return 4;
      case "int32":
        return 6;
      case "uint32":
        return 12;
      case "float16":
        return 10;
      case "float32":
        return 1;
      case "float64":
        return 11;
      case "string":
        return 8;
      case "int64":
        return 7;
      case "uint64":
        return 13;
      case "int4":
        return 22;
      case "uint4":
        return 21;
      default:
        throw new Error(`unsupported data type: ${e}`);
    }
  }, Be = (e) => {
    switch (e) {
      case 3:
        return "int8";
      case 2:
        return "uint8";
      case 9:
        return "bool";
      case 5:
        return "int16";
      case 4:
        return "uint16";
      case 6:
        return "int32";
      case 12:
        return "uint32";
      case 10:
        return "float16";
      case 1:
        return "float32";
      case 11:
        return "float64";
      case 8:
        return "string";
      case 7:
        return "int64";
      case 13:
        return "uint64";
      case 22:
        return "int4";
      case 21:
        return "uint4";
      default:
        throw new Error(`unsupported data type: ${e}`);
    }
  }, He = (e, t) => {
    let i = [-1, 4, 1, 1, 2, 2, 4, 8, -1, 1, 2, 8, 4, 8, -1, -1, -1, -1, -1, -1, -1, 0.5, 0.5][e], r = typeof t == "number" ? t : t.reduce((a, n) => a * n, 1);
    return i > 0 ? Math.ceil(r * i) : void 0;
  }, Ht = (e) => {
    switch (e) {
      case "float16":
        return typeof Float16Array < "u" ? Float16Array : Uint16Array;
      case "float32":
        return Float32Array;
      case "uint8":
        return Uint8Array;
      case "int8":
        return Int8Array;
      case "uint16":
        return Uint16Array;
      case "int16":
        return Int16Array;
      case "int32":
        return Int32Array;
      case "bool":
        return Uint8Array;
      case "float64":
        return Float64Array;
      case "uint32":
        return Uint32Array;
      case "int64":
        return BigInt64Array;
      case "uint64":
        return BigUint64Array;
      default:
        throw new Error(`unsupported type: ${e}`);
    }
  }, Nt = (e) => {
    switch (e) {
      case "verbose":
        return 0;
      case "info":
        return 1;
      case "warning":
        return 2;
      case "error":
        return 3;
      case "fatal":
        return 4;
      default:
        throw new Error(`unsupported logging level: ${e}`);
    }
  }, gr = (e) => e === "float32" || e === "float16" || e === "int32" || e === "int64" || e === "uint32" || e === "uint8" || e === "bool" || e === "uint4" || e === "int4", _r = (e) => e === "float32" || e === "float16" || e === "int32" || e === "int64" || e === "uint32" || e === "uint64" || e === "int8" || e === "uint8" || e === "bool" || e === "uint4" || e === "int4", Ki = (e) => {
    switch (e) {
      case "none":
        return 0;
      case "cpu":
        return 1;
      case "cpu-pinned":
        return 2;
      case "texture":
        return 3;
      case "gpu-buffer":
        return 4;
      case "ml-tensor":
        return 5;
      default:
        throw new Error(`unsupported data location: ${e}`);
    }
  };
}), yr, Wo = z(() => {
  pr(), yr = async (e) => {
    if (typeof e == "string") {
      let t = await fetch(e);
      if (!t.ok) throw new Error(`failed to load external data file: ${e}`);
      let i = t.headers.get("Content-Length"), r = i ? parseInt(i, 10) : 0;
      if (r < 1073741824) return new Uint8Array(await t.arrayBuffer());
      {
        if (!t.body) throw new Error(`failed to load external data file: ${e}, no response body.`);
        let a = t.body.getReader(), n;
        try {
          n = new ArrayBuffer(r);
        } catch (o) {
          if (o instanceof RangeError) {
            let u = Math.ceil(r / 65536);
            n = new WebAssembly.Memory({ initial: u, maximum: u }).buffer;
          } else throw o;
        }
        let s = 0;
        for (; ; ) {
          let { done: o, value: u } = await a.read();
          if (o) break;
          let l = u.byteLength;
          new Uint8Array(n, s, l).set(u), s += l;
        }
        return new Uint8Array(n, 0, r);
      }
    } else return e instanceof Blob ? new Uint8Array(await e.arrayBuffer()) : e instanceof Uint8Array ? e : new Uint8Array(e);
  };
}), Qr, Yr, Jr, ea, $r, ta, Z, Re = z(() => {
  V(), Qr = ["V", "I", "W", "E", "F"], Yr = (e, t) => {
    console.log(`[${Qr[e]},${(/* @__PURE__ */ new Date()).toISOString()}]${t}`);
  }, $r = (e, t) => {
    Jr = e, ea = t;
  }, ta = (e, t) => {
    let i = Nt(e), r = Nt(Jr);
    i >= r && Yr(i, typeof t == "function" ? t() : t);
  }, Z = (...e) => {
    ea && ta(...e);
  };
}), ia, rt, k, qt, Go, Fo, Ho, H = z(() => {
  ia = class {
    static calcMatMulShape(e, t) {
      return e[1] !== t[0] ? void 0 : [e[0], t[1]];
    }
  }, rt = class {
    static calcShape(e, t, i = !1) {
      let r = e.length, a = t.length;
      if (r === 0) return t;
      if (a === 0) return e;
      let n = Math.max(e.length, t.length), s = new Array(n);
      if (i) {
        if (r < 2 || a < 2) return;
        let o = ia.calcMatMulShape([e[r - 2], e[r - 1]], [t[a - 2], t[a - 1]]);
        if (o === void 0) return;
        [s[n - 2], s[n - 1]] = o;
      }
      for (let o = i ? 3 : 1; o <= n; o++) {
        let u = r - o < 0 ? 1 : e[r - o], l = a - o < 0 ? 1 : t[a - o];
        if (u !== l && u > 1 && l > 1) return;
        let p = Math.max(u, l);
        if (u && l) s[n - o] = Math.max(u, l);
        else {
          if (p > 1) return;
          s[n - o] = 0;
        }
      }
      return s;
    }
    static isValidBroadcast(e, t) {
      let i = e.length, r = t.length;
      if (i > r) return !1;
      for (let a = 1; a <= i; a++) if (e[i - a] !== 1 && e[i - a] !== t[r - a]) return !1;
      return !0;
    }
  }, k = class Mt {
    static size(t) {
      return Mt.getSizeFromDimensionRange(t, 0, t.length);
    }
    static convertShape(t, i = 4) {
      let r = t.length;
      if (r === 0) return [];
      let a = new Array(r), n = r - 1;
      for (; n >= 0; ) {
        if (t[n] % i === 0) {
          a[n] = t[n] / i;
          break;
        }
        if (i % t[n] !== 0) throw new Error("cannot convert shape");
        a[n] = 1, i /= t[n], n--;
      }
      for (n--; n >= 0; n--) a[n] = t[n];
      return a;
    }
    static sizeFromDimension(t, i) {
      if (i < 0 || i > t.length) throw new Error(`invalid dimension of ${i} for sizeFromDimension as Tensor has ${t.length} dimensions.`);
      return Mt.getSizeFromDimensionRange(t, i, t.length);
    }
    static sizeToDimension(t, i) {
      if (i < 0 || i > t.length) throw new Error(`invalid dimension of ${i} for sizeToDimension as Tensor has ${t.length} dimensions.`);
      return Mt.getSizeFromDimensionRange(t, 0, i);
    }
    static getSizeFromDimensionRange(t, i, r) {
      let a = 1;
      for (let n = i; n < r; n++) {
        if (t[n] < 0) throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");
        a *= Number(t[n]);
      }
      return a;
    }
    static computeStrides(t) {
      let i = t.length;
      if (i === 0) return [];
      if (i === 1) return [1];
      let r = new Array(i);
      r[i - 1] = 1, r[i - 2] = t[i - 1];
      for (let a = i - 3; a >= 0; --a) r[a] = r[a + 1] * t[a + 1];
      return r;
    }
    static normalizeAxis(t, i) {
      if (t < -i && t >= i) throw new Error("unsupported axis for this operation.");
      return t < 0 ? t + i : t;
    }
    static normalizeAxes(t, i) {
      return t.map((r) => this.normalizeAxis(r, i ?? t.length));
    }
    static sortBasedOnPerm(t, i) {
      return i ? i.map((r) => t[r]) : t.slice().reverse();
    }
    static padShape(t, i) {
      let r = t.length;
      return t.map((a, n) => a + i[n] + i[n + r]);
    }
    static areEqual(t, i) {
      return t.length !== i.length ? !1 : t.every((r, a) => r === i[a]);
    }
  }, qt = class gt {
    static adjustPoolAttributes(t, i, r, a, n, s) {
      if (!t && r.length !== i.length - 2) throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");
      if (t) for (let o = 0; o < i.length - 2; o++) o >= r.length ? r.push(i[o + 2]) : r[o] = i[o + 2];
      for (let o = 0; o < r.length; o++) if (o < a.length) {
        if (a[o] < 0) throw new Error("strides should be greater than or equal to 1");
      } else a.push(1);
      for (let o = 0; o < r.length; o++) if (o < n.length) {
        if (n[o] < 0) throw new Error("dilations should be greater than or equal to 1");
      } else n.push(1);
      for (let o = 0; o < r.length * 2; o++) if (o < s.length) {
        if (s[o] < 0) throw new Error("pad should be greater than or equal to 1");
      } else s.push(0);
      for (let o = 0; o < r.length; o++) {
        if (r[o] <= 0) throw new Error("kernel shapes need to be greater than 0");
        if (s[o] >= r[o] || s[o + r.length] >= r[o]) throw new Error("pads should be smaller than kernel");
      }
    }
    static adjustPadsBasedOnAutoPad(t, i, r, a, n, s, o) {
      if (o) {
        if (n.length !== 2 * (t.length - 2)) throw new Error("length of pads should be twice the length of data dimensions");
        if (i.length !== t.length - 2) throw new Error("length of strides should be the length of data dimensions");
        if (a.length !== t.length - 2) throw new Error("length of kernel shapes should be the length of data dimensions");
        for (let u = 0; u < t.length - 2; u++) gt.adjustPadAndReturnShape(t[u + (s ? 1 : 2)], i[u], r[u], a[u], n, u, u + t.length - 2, o);
      }
    }
    static computePoolOutputShape(t, i, r, a, n, s, o) {
      if (i.length <= 0) throw new Error("input shape must be of size greater than 0");
      let u = [i[0], i[1]];
      return gt.computeShapeHelper(t, i, u, r, a, n, s, o), u;
    }
    static computeConvOutputShape(t, i, r, a, n, s, o) {
      if (t.length <= 0 || i.length <= 0) throw new Error("invalid input tensor dims or invalid filter tensor dims");
      let u = [t[0], i[0]];
      return gt.computeShapeHelper(!1, t, u, r, a, n, s, o), u;
    }
    static computeShapeHelper(t, i, r, a, n, s, o, u) {
      if (t) for (let l = 0; l < i.length - 2; l++) r.push(1);
      else for (let l = 0; l < i.length - 2; l++) r.push(gt.adjustPadAndReturnShape(i[l + 2], a[l], n[l], s[l], o, l, l + i.length - 2, u));
    }
    static adjustPadAndReturnShape(t, i, r, a, n, s, o, u) {
      let l = r * (a - 1) + 1;
      if (u && u !== "NOTSET") switch (u) {
        case "VALID":
          return n[s] = 0, n[o] = 0, Math.floor((t - l) / i + 1);
        case "SAME_LOWER":
        case "SAME_UPPER":
          if (r !== 1) throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");
          {
            let p = ((t + i - 1) / i - 1) * i + a - t;
            return n[s] = Math.floor(u === "SAME_LOWER" ? (p + 1) / 2 : p / 2), n[o] = p - n[s], Math.floor((t + p - a) / i + 1);
          }
        default:
          throw new Error("Unsupported AutoPad type");
      }
      else return Math.floor((t + n[s] + n[o] - l) / i + 1);
    }
  }, Go = class {
    static getShapeOfGemmResult(e, t, i, r, a) {
      if (e.length !== 2 || i.length !== 2) throw new Error("shape need to be of size 2");
      let n, s, o;
      t ? (n = e[1], s = e[0]) : (n = e[0], s = e[1]);
      let u = -1;
      if (r ? (o = i[0], u = 1) : (o = i[1], u = 0), i[u] !== s) throw new Error("dimension mismatch");
      if (n <= 0 || o <= 0 || s <= 0) throw new Error("invalid shape specified");
      if (a && !rt.isValidBroadcast(a, [n, o])) throw new Error("gemm: invalid bias shape for broadcast");
      return [n, o, s];
    }
  }, Fo = -34028234663852886e22, Ho = 34028234663852886e22;
}), wr, Ko = z(() => {
  V(), wr = (e, t) => new (Ht(t))(e);
}), ai, ji, ni, ra, si, aa, oi, ui, li, na, jo, xp = z(() => {
  V(), Re(), ai = /* @__PURE__ */ new Map([["float32", 32], ["float16", 16], ["int32", 32], ["uint32", 32], ["int64", 64], ["uint64", 64], ["int8", 8], ["uint8", 8], ["int4", 4], ["uint4", 4]]), ji = (e, t) => {
    if (t === "int32") return e;
    let i = ai.get(t);
    if (!i) throw new Error(`WebNN backend does not support data type: ${t}`);
    let r = i / 8;
    if (e.byteLength % r !== 0) throw new Error(`Invalid Uint8Array length - must be a multiple of ${r}.`);
    let a = e.byteLength / r, n = new (Ht(t))(e.buffer, e.byteOffset, a);
    switch (t) {
      case "int64":
      case "uint64": {
        let s = new Int32Array(a);
        for (let o = 0; o < a; o++) {
          let u = n[o];
          if (u > 2147483647n || u < -2147483648n) throw new Error("Can not convert int64 data to int32 - value out of range.");
          s[o] = Number(u);
        }
        return new Uint8Array(s.buffer);
      }
      case "int8":
      case "uint8":
      case "uint32": {
        if (t === "uint32" && n.some((o) => o > 2147483647)) throw new Error("Can not convert uint32 data to int32 - value out of range.");
        let s = Int32Array.from(n, Number);
        return new Uint8Array(s.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from ${t} to 'int32'`);
    }
  }, ni = (e, t) => {
    if (t === "int32") return e;
    if (e.byteLength % 4 !== 0) throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
    let i = e.byteLength / 4, r = new Int32Array(e.buffer, e.byteOffset, i);
    switch (t) {
      case "int64": {
        let a = BigInt64Array.from(r, BigInt);
        return new Uint8Array(a.buffer);
      }
      case "uint64": {
        if (r.some((n) => n < 0)) throw new Error("Can not convert int32 data to uin64 - negative value found.");
        let a = BigUint64Array.from(r, BigInt);
        return new Uint8Array(a.buffer);
      }
      case "int8": {
        if (r.some((n) => n < -128 || n > 127)) throw new Error("Can not convert int32 data to int8 - value out of range.");
        let a = Int8Array.from(r, Number);
        return new Uint8Array(a.buffer);
      }
      case "uint8": {
        if (r.some((a) => a < 0 || a > 255)) throw new Error("Can not convert int32 data to uint8 - value out of range.");
        return Uint8Array.from(r, Number);
      }
      case "uint32": {
        if (r.some((n) => n < 0)) throw new Error("Can not convert int32 data to uint32 - negative value found.");
        let a = Uint32Array.from(r, Number);
        return new Uint8Array(a.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from 'int32' to ${t}`);
    }
  }, ra = 1, si = () => ra++, aa = /* @__PURE__ */ new Map([["int8", "int32"], ["uint8", "int32"], ["uint32", "int32"], ["int64", "int32"]]), oi = (e, t) => {
    let i = ai.get(e);
    if (!i) throw new Error(`WebNN backend does not support data type: ${e}`);
    return t.length > 0 ? Math.ceil(t.reduce((r, a) => r * a) * i / 8) : 0;
  }, ui = class {
    constructor(e) {
      this.isDataConverted = !1;
      let { sessionId: t, context: i, tensor: r, dataType: a, shape: n, fallbackDataType: s } = e;
      this.sessionId = t, this.mlContext = i, this.mlTensor = r, this.dataType = a, this.tensorShape = n, this.fallbackDataType = s;
    }
    get tensor() {
      return this.mlTensor;
    }
    get type() {
      return this.dataType;
    }
    get fallbackType() {
      return this.fallbackDataType;
    }
    get shape() {
      return this.tensorShape;
    }
    get byteLength() {
      return oi(this.dataType, this.tensorShape);
    }
    destroy() {
      Z("verbose", () => "[WebNN] TensorWrapper.destroy"), this.mlTensor.destroy();
    }
    write(e) {
      this.mlContext.writeTensor(this.mlTensor, e);
    }
    async read(e) {
      if (this.fallbackDataType) {
        let t = await this.mlContext.readTensor(this.mlTensor), i = ni(new Uint8Array(t), this.dataType);
        if (e) {
          (e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength)).set(i);
          return;
        } else return new Uint8Array(i).buffer;
      } else return e ? this.mlContext.readTensor(this.mlTensor, e) : this.mlContext.readTensor(this.mlTensor);
    }
    canReuseTensor(e, t, i) {
      return this.mlContext === e && this.dataType === t && this.tensorShape.length === i.length && this.tensorShape.every((r, a) => r === i[a]);
    }
    setIsDataConverted(e) {
      this.isDataConverted = e;
    }
  }, li = class {
    constructor(e, t) {
      this.tensorManager = e, this.wrapper = t;
    }
    get tensorWrapper() {
      return this.wrapper;
    }
    releaseTensor() {
      this.tensorWrapper && (this.tensorManager.releaseTensor(this.tensorWrapper), this.wrapper = void 0);
    }
    async ensureTensor(e, t, i, r) {
      let a = this.tensorManager.getMLContext(e), n = this.tensorManager.getMLOpSupportLimits(e), s;
      if (!n?.input.dataTypes.includes(t)) {
        if (s = aa.get(t), !s || n?.input.dataTypes.includes(s)) throw new Error(`WebNN backend does not support data type: ${t}`);
        Z("verbose", () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`);
      }
      if (this.wrapper) {
        if (this.wrapper.canReuseTensor(a, t, i)) return this.wrapper.tensor;
        if (r) {
          if (this.wrapper.byteLength !== oi(t, i)) throw new Error("Unable to copy data to tensor with different size.");
          this.activeUpload = new Uint8Array(await this.wrapper.read());
        }
        this.tensorManager.releaseTensor(this.wrapper);
      }
      let o = typeof MLTensorUsage > "u" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
      return this.wrapper = await this.tensorManager.getCachedTensor(e, t, i, o, !0, !0, s), r && this.activeUpload && (this.wrapper.write(this.activeUpload), this.activeUpload = void 0), this.wrapper.tensor;
    }
    upload(e) {
      let t = e;
      if (this.wrapper) {
        if (this.wrapper.fallbackType) if (this.wrapper.fallbackType === "int32") t = ji(e, this.wrapper.type), this.wrapper.setIsDataConverted(!0);
        else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
        if (e.byteLength === this.wrapper.byteLength) {
          this.wrapper.write(t);
          return;
        } else Z("verbose", () => "Data size does not match tensor size. Releasing tensor."), this.releaseTensor();
      }
      this.activeUpload ? this.activeUpload.set(t) : this.activeUpload = new Uint8Array(t);
    }
    async download(e) {
      if (this.activeUpload) {
        let t = this.wrapper?.isDataConverted ? ni(this.activeUpload, this.wrapper?.type) : this.activeUpload;
        if (e) {
          e instanceof ArrayBuffer ? new Uint8Array(e).set(t) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength).set(t);
          return;
        } else return t.buffer;
      }
      if (!this.wrapper) throw new Error("Tensor has not been created.");
      return e ? this.wrapper.read(e) : this.wrapper.read();
    }
  }, na = class {
    constructor(e) {
      this.backend = e, this.tensorTrackersById = /* @__PURE__ */ new Map(), this.freeTensors = [], this.externalTensors = /* @__PURE__ */ new Set();
    }
    getMLContext(e) {
      let t = this.backend.getMLContext(e);
      if (!t) throw new Error("MLContext not found for session.");
      return t;
    }
    getMLOpSupportLimits(e) {
      return this.backend.getMLOpSupportLimits(e);
    }
    reserveTensorId() {
      let e = si();
      return this.tensorTrackersById.set(e, new li(this)), e;
    }
    releaseTensorId(e) {
      let t = this.tensorTrackersById.get(e);
      t && (this.tensorTrackersById.delete(e), t.tensorWrapper && this.releaseTensor(t.tensorWrapper));
    }
    async ensureTensor(e, t, i, r, a) {
      Z("verbose", () => `[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${i}, shape: ${r}, copyOld: ${a}}`);
      let n = this.tensorTrackersById.get(t);
      if (!n) throw new Error("Tensor not found.");
      return n.ensureTensor(e, i, r, a);
    }
    upload(e, t) {
      let i = this.tensorTrackersById.get(e);
      if (!i) throw new Error("Tensor not found.");
      i.upload(t);
    }
    async download(e, t) {
      Z("verbose", () => `[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);
      let i = this.tensorTrackersById.get(e);
      if (!i) throw new Error("Tensor not found.");
      return i.download(t);
    }
    releaseTensorsForSession(e) {
      for (let t of this.freeTensors) t.sessionId === e && t.destroy();
      this.freeTensors = this.freeTensors.filter((t) => t.sessionId !== e);
    }
    registerTensor(e, t, i, r) {
      let a = this.getMLContext(e), n = si(), s = new ui({ sessionId: e, context: a, tensor: t, dataType: i, shape: r });
      return this.tensorTrackersById.set(n, new li(this, s)), this.externalTensors.add(s), n;
    }
    async getCachedTensor(e, t, i, r, a, n, s) {
      let o = this.getMLContext(e);
      for (let [l, p] of this.freeTensors.entries()) if (p.canReuseTensor(o, t, i)) {
        Z("verbose", () => `[WebNN] Reusing tensor {dataType: ${t}, ${s ? `fallbackDataType: ${s},` : ""} shape: ${i}`);
        let d = this.freeTensors.splice(l, 1)[0];
        return d.sessionId = e, d;
      }
      Z("verbose", () => `[WebNN] MLContext.createTensor {dataType: ${t}, ${s ? `fallbackDataType: ${s},` : ""} shape: ${i}}`);
      let u = await o.createTensor({ dataType: s ?? t, shape: i, dimensions: i, usage: r, writable: a, readable: n });
      return new ui({ sessionId: e, context: o, tensor: u, dataType: t, shape: i, fallbackDataType: s });
    }
    releaseTensor(e) {
      this.externalTensors.has(e) && this.externalTensors.delete(e), this.freeTensors.push(e);
    }
  }, jo = (...e) => new na(...e);
}), ot, sa, Xo, kp = z(() => {
  V(), Ye(), Ko(), xp(), Re(), ot = /* @__PURE__ */ new Map([[1, "float32"], [10, "float16"], [6, "int32"], [12, "uint32"], [7, "int64"], [13, "uint64"], [22, "int4"], [21, "uint4"], [3, "int8"], [2, "uint8"], [9, "uint8"]]), sa = (e, t) => {
    if (e === t) return !0;
    if (e === void 0 || t === void 0) return !1;
    let i = Object.keys(e).sort(), r = Object.keys(t).sort();
    return i.length === r.length && i.every((a, n) => a === r[n] && e[a] === t[a]);
  }, Xo = class {
    constructor(e) {
      this.tensorManager = jo(this), this.mlContextBySessionId = /* @__PURE__ */ new Map(), this.sessionIdsByMLContext = /* @__PURE__ */ new Map(), this.mlContextCache = [], this.sessionGraphInputs = /* @__PURE__ */ new Map(), this.sessionGraphOutputs = /* @__PURE__ */ new Map(), this.temporaryGraphInputs = [], this.temporaryGraphOutputs = [], this.temporarySessionTensorIds = /* @__PURE__ */ new Map(), this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map(), $r(e.logLevel, !!e.debug);
    }
    get currentSessionId() {
      if (this.activeSessionId === void 0) throw new Error("No active session");
      return this.activeSessionId;
    }
    onRunStart(e) {
      Z("verbose", () => `[WebNN] onRunStart {sessionId: ${e}}`), this.activeSessionId = e;
    }
    onRunEnd(e) {
      Z("verbose", () => `[WebNN] onRunEnd {sessionId: ${e}}`);
      let t = this.temporarySessionTensorIds.get(e);
      if (t) {
        for (let i of t) Z("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${i}}`), this.tensorManager.releaseTensorId(i);
        this.temporarySessionTensorIds.delete(e), this.activeSessionId = void 0;
      }
    }
    async createMLContext(e) {
      if (e instanceof GPUDevice) {
        let i = this.mlContextCache.findIndex((r) => r.gpuDevice === e);
        if (i !== -1) return this.mlContextCache[i].mlContext;
        {
          let r = await navigator.ml.createContext(e);
          return this.mlContextCache.push({ gpuDevice: e, mlContext: r }), r;
        }
      } else if (e === void 0) {
        let i = this.mlContextCache.findIndex((r) => r.options === void 0 && r.gpuDevice === void 0);
        if (i !== -1) return this.mlContextCache[i].mlContext;
        {
          let r = await navigator.ml.createContext();
          return this.mlContextCache.push({ mlContext: r }), r;
        }
      }
      let t = this.mlContextCache.findIndex((i) => sa(i.options, e));
      if (t !== -1) return this.mlContextCache[t].mlContext;
      {
        let i = await navigator.ml.createContext(e);
        return this.mlContextCache.push({ options: e, mlContext: i }), i;
      }
    }
    registerMLContext(e, t) {
      this.mlContextBySessionId.set(e, t);
      let i = this.sessionIdsByMLContext.get(t);
      i || (i = /* @__PURE__ */ new Set(), this.sessionIdsByMLContext.set(t, i)), i.add(e), this.mlOpSupportLimitsBySessionId.has(e) || this.mlOpSupportLimitsBySessionId.set(e, t.opSupportLimits()), this.temporaryGraphInputs.length > 0 && (this.sessionGraphInputs.set(e, this.temporaryGraphInputs), this.temporaryGraphInputs = []), this.temporaryGraphOutputs.length > 0 && (this.sessionGraphOutputs.set(e, this.temporaryGraphOutputs), this.temporaryGraphOutputs = []);
    }
    onReleaseSession(e) {
      this.sessionGraphInputs.delete(e), this.sessionGraphOutputs.delete(e);
      let t = this.mlContextBySessionId.get(e);
      if (!t) return;
      this.tensorManager.releaseTensorsForSession(e), this.mlContextBySessionId.delete(e), this.mlOpSupportLimitsBySessionId.delete(e);
      let i = this.sessionIdsByMLContext.get(t);
      if (i.delete(e), i.size === 0) {
        this.sessionIdsByMLContext.delete(t);
        let r = this.mlContextCache.findIndex((a) => a.mlContext === t);
        r !== -1 && this.mlContextCache.splice(r, 1);
      }
    }
    getMLContext(e) {
      return this.mlContextBySessionId.get(e);
    }
    getMLOpSupportLimits(e) {
      return this.mlOpSupportLimitsBySessionId.get(e);
    }
    reserveTensorId() {
      return this.tensorManager.reserveTensorId();
    }
    releaseTensorId(e) {
      Z("verbose", () => `[WebNN] releaseTensorId {tensorId: ${e}}`), this.tensorManager.releaseTensorId(e);
    }
    async ensureTensor(e, t, i, r, a) {
      let n = ot.get(i);
      if (!n) throw new Error(`Unsupported ONNX data type: ${i}`);
      return this.tensorManager.ensureTensor(e ?? this.currentSessionId, t, n, r, a);
    }
    async createTemporaryTensor(e, t, i) {
      Z("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${i}}`);
      let r = ot.get(t);
      if (!r) throw new Error(`Unsupported ONNX data type: ${t}`);
      let a = this.tensorManager.reserveTensorId();
      await this.tensorManager.ensureTensor(e, a, r, i, !1);
      let n = this.temporarySessionTensorIds.get(e);
      return n ? n.push(a) : this.temporarySessionTensorIds.set(e, [a]), a;
    }
    uploadTensor(e, t) {
      if (!ie().shouldTransferToMLTensor) throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
      Z("verbose", () => `[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`), this.tensorManager.upload(e, t);
    }
    async downloadTensor(e, t) {
      return this.tensorManager.download(e, t);
    }
    createMLTensorDownloader(e, t) {
      return async () => {
        let i = await this.tensorManager.download(e);
        return wr(i, t);
      };
    }
    registerMLTensor(e, t, i, r) {
      let a = ot.get(i);
      if (!a) throw new Error(`Unsupported ONNX data type: ${i}`);
      let n = this.tensorManager.registerTensor(e, t, a, r);
      return Z("verbose", () => `[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${r}} -> {tensorId: ${n}}`), n;
    }
    registerMLConstant(e, t, i, r, a, n, s = !1) {
      if (!n) throw new Error("External mounted files are not available.");
      let o = e;
      e.startsWith("./") && (o = e.substring(2));
      let u = n.get(o);
      if (!u) throw new Error(`File with name ${o} not found in preloaded files.`);
      if (t + i > u.byteLength) throw new Error("Out of bounds: data offset and length exceed the external file data size.");
      let l = u.slice(t, t + i).buffer, p;
      switch (a.dataType) {
        case "float32":
          p = new Float32Array(l);
          break;
        case "float16":
          p = typeof Float16Array < "u" ? new Float16Array(l) : new Uint16Array(l);
          break;
        case "int32":
          p = new Int32Array(l);
          break;
        case "uint32":
          p = new Uint32Array(l);
          break;
        case "int64":
          if (s) {
            let d = ji(new Uint8Array(l), "int64");
            p = new Int32Array(d.buffer), a.dataType = "int32";
          } else p = new BigInt64Array(l);
          break;
        case "uint64":
          p = new BigUint64Array(l);
          break;
        case "int8":
          p = new Int8Array(l);
          break;
        case "int4":
        case "uint4":
        case "uint8":
          p = new Uint8Array(l);
          break;
        default:
          throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`);
      }
      return Z("verbose", () => `[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}} ${s ? "(Note: it was int64 data type and registered to int32 as workaround)" : ""}`), r.constant(a, p);
    }
    registerGraphInput(e) {
      this.temporaryGraphInputs.push(e);
    }
    registerGraphOutput(e) {
      this.temporaryGraphOutputs.push(e);
    }
    isGraphInput(e, t) {
      let i = this.sessionGraphInputs.get(e);
      return i ? i.includes(t) : !1;
    }
    isGraphOutput(e, t) {
      let i = this.sessionGraphOutputs.get(e);
      return i ? i.includes(t) : !1;
    }
    isGraphInputOutputTypeSupported(e, t, i = !0) {
      let r = ot.get(Fe(t)), a = this.mlOpSupportLimitsBySessionId.get(e);
      return typeof r > "u" ? !1 : i ? !!a?.input.dataTypes.includes(r) : !!a?.output.dataTypes.includes(r);
    }
    flush() {
    }
  };
}), br = z(() => {
}), di, St, It, oa, ua, pi, Xi, la, Zo, Sp = z(() => {
  Re(), br(), di = /* @__PURE__ */ new Map([[64, 250], [128, 200], [256, 200], [512, 200], [2048, 230], [4096, 200], [8192, 50], [16384, 50], [32768, 50], [65536, 50], [131072, 50], [262144, 50], [524288, 50], [1048576, 50], [2097152, 30], [4194304, 20], [8388608, 10], [12582912, 10], [16777216, 10], [26214400, 15], [33554432, 22], [44236800, 2], [58982400, 6], [67108864, 6], [134217728, 6], [167772160, 6]]), St = [], It = (e) => Math.ceil(Number(e) / 16) * 16, oa = (e) => {
    for (let t = 0; t < St.length; t++) {
      let i = St[t];
      if (e <= i) return i;
    }
    return Math.ceil(e / 16) * 16;
  }, ua = 1, pi = () => ua++, Xi = async (e, t, i, r) => {
    let a = It(i), n = e.device.createBuffer({ size: a, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    try {
      let s = e.getCommandEncoder();
      e.endComputePass(), s.copyBufferToBuffer(t, 0, n, 0, a), e.flush(), await n.mapAsync(GPUMapMode.READ);
      let o = n.getMappedRange();
      if (r) {
        let u = r();
        return u.set(new Uint8Array(o, 0, i)), u;
      } else return new Uint8Array(o.slice(0, i));
    } finally {
      n.destroy();
    }
  }, la = class {
    constructor(e) {
      this.backend = e, this.storageCache = /* @__PURE__ */ new Map(), this.freeBuffers = /* @__PURE__ */ new Map(), this.freeUniformBuffers = /* @__PURE__ */ new Map(), this.buffersPending = [], this.capturedPendingBuffers = /* @__PURE__ */ new Map();
      for (let [t] of di) St.push(t), this.freeBuffers.set(t, []), this.freeUniformBuffers.set(t, []);
      this.sessionCount = 0;
    }
    upload(e, t) {
      let i = t.buffer, r = t.byteOffset, a = t.byteLength, n = It(a), s = this.storageCache.get(e);
      if (!s) throw new Error("gpu data for uploading does not exist");
      if (Number(s.originalSize) !== a) throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);
      let o = this.backend.device.createBuffer({ mappedAtCreation: !0, size: n, usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC }), u = o.getMappedRange();
      new Uint8Array(u).set(new Uint8Array(i, r, a)), o.unmap();
      let l = this.backend.device.createCommandEncoder();
      l.copyBufferToBuffer(o, 0, s.gpuData.buffer, 0, n), this.backend.device.queue.submit([l.finish()]), o.destroy(), Z("verbose", () => `[WebGPU] GpuDataManager.upload(id=${e})`);
    }
    memcpy(e, t) {
      let i = this.storageCache.get(e);
      if (!i) throw new Error("source gpu data for memcpy does not exist");
      let r = this.storageCache.get(t);
      if (!r) throw new Error("destination gpu data for memcpy does not exist");
      if (i.originalSize !== r.originalSize) throw new Error("inconsistent source and destination gpu data size");
      let a = It(i.originalSize), n = this.backend.getCommandEncoder();
      this.backend.endComputePass(), n.copyBufferToBuffer(i.gpuData.buffer, 0, r.gpuData.buffer, 0, a);
    }
    registerExternalBuffer(e, t, i) {
      let r;
      if (i) {
        if (r = i[0], e === i[1]) return Z("verbose", () => `[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, buffer is the same, skip.`), r;
        if (this.backend.capturedCommandList.has(this.backend.currentSessionId)) throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`);
      } else r = pi();
      return this.storageCache.set(r, { gpuData: { id: r, type: 0, buffer: e }, originalSize: t }), Z("verbose", () => `[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, registered.`), r;
    }
    unregisterExternalBuffer(e) {
      e !== void 0 && (this.storageCache.delete(e), Z("verbose", () => `[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`));
    }
    create(e, t = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST) {
      let i = oa(e), r, a = (t & GPUBufferUsage.STORAGE) === GPUBufferUsage.STORAGE, n = (t & GPUBufferUsage.UNIFORM) === GPUBufferUsage.UNIFORM;
      if (a || n) {
        let o = (a ? this.freeBuffers : this.freeUniformBuffers).get(i);
        o ? o.length > 0 ? r = o.pop() : r = this.backend.device.createBuffer({ size: i, usage: t }) : r = this.backend.device.createBuffer({ size: i, usage: t });
      } else r = this.backend.device.createBuffer({ size: i, usage: t });
      let s = { id: pi(), type: 0, buffer: r };
      return this.storageCache.set(s.id, { gpuData: s, originalSize: Number(e) }), Z("verbose", () => `[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`), s;
    }
    get(e) {
      return this.storageCache.get(e)?.gpuData;
    }
    release(e) {
      let t = typeof e == "bigint" ? Number(e) : e, i = this.storageCache.get(t);
      if (!i) {
        if (this.storageCache.size === 0) return 0;
        throw new Error("releasing data does not exist");
      }
      return Z("verbose", () => `[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${i.gpuData.id}`), this.storageCache.delete(t), this.buffersPending.push(i.gpuData.buffer), i.originalSize;
    }
    async download(e, t) {
      let i = this.storageCache.get(Number(e));
      if (!i) throw new Error("data does not exist");
      await Xi(this.backend, i.gpuData.buffer, i.originalSize, t);
    }
    refreshPendingBuffers() {
      if (this.buffersPending.length !== 0) if (this.backend.sessionStatus === "default") {
        for (let e of this.buffersPending) {
          let t = di.get(e.size);
          if ((e.usage & GPUBufferUsage.STORAGE) === GPUBufferUsage.STORAGE) {
            let i = this.freeBuffers.get(e.size) || [];
            t === void 0 || i.length >= t ? e.destroy() : i.push(e);
          } else if ((e.usage & GPUBufferUsage.UNIFORM) === GPUBufferUsage.UNIFORM) {
            let i = this.freeUniformBuffers.get(e.size) || [];
            t === void 0 || i.length >= t ? e.destroy() : i.push(e);
          } else e.destroy();
        }
        this.buffersPending = [];
      } else {
        let e = this.capturedPendingBuffers.get(this.backend.currentSessionId);
        e || (e = [], this.capturedPendingBuffers.set(this.backend.currentSessionId, e));
        for (let t of this.buffersPending) e.push(t);
        this.buffersPending = [];
      }
    }
    dispose() {
      this.freeBuffers.forEach((e) => {
        e.forEach((t) => {
          t.destroy();
        });
      }), this.freeUniformBuffers.forEach((e) => {
        e.forEach((t) => {
          t.destroy();
        });
      }), this.storageCache.forEach((e) => {
        e.gpuData.buffer.destroy();
      }), this.capturedPendingBuffers.forEach((e) => {
        e.forEach((t) => {
          t.destroy();
        });
      }), this.storageCache = /* @__PURE__ */ new Map(), this.freeBuffers = /* @__PURE__ */ new Map(), this.freeUniformBuffers = /* @__PURE__ */ new Map(), this.capturedPendingBuffers = /* @__PURE__ */ new Map();
    }
    onCreateSession() {
      this.sessionCount += 1;
    }
    onReleaseSession(e) {
      let t = this.capturedPendingBuffers.get(e);
      t && (t.forEach((i) => {
        i.destroy();
      }), this.capturedPendingBuffers.delete(e)), this.sessionCount -= 1, this.sessionCount === 0 && (Z("warning", () => "[WebGPU] Clearing webgpu buffer cache"), this.storageCache.forEach((i) => {
        i.gpuData.buffer.destroy();
      }), this.storageCache = /* @__PURE__ */ new Map());
    }
  }, Zo = (...e) => new la(...e);
}), da, Y, ae = z(() => {
  da = class {
    constructor(e) {
      Object.assign(this, e);
    }
    get cacheKey() {
      return this.key || (this.key = Object.getOwnPropertyNames(this).sort().map((e) => `${this[e]}`).join(";")), this.key;
    }
  }, Y = (e) => new da(e);
}), at, Tt, oe, pe, P, re, Zi, it, Ue, U, ut, I, A, Qo, vr, pa, Yo, j = z(() => {
  V(), H(), at = 64, Tt = (e, t) => {
    if (t === 3) throw new Error("vec3 has same alignment as vec4, use vec4 instead");
    switch (Number(e)) {
      case 10:
        return t > 1 ? `vec${t}<f16>` : "f16";
      case 1:
        return t > 1 ? `vec${t}<f32>` : "f32";
      case 6:
        return t > 1 ? `vec${t}<i32>` : "i32";
      case 12:
        return t > 1 ? `vec${t}<u32>` : "u32";
      case 7:
        if (t > 1) throw new Error("currently not supported vecX of uint64 yet");
        return ["vec2<u32>", "i32"];
      case 13:
        if (t > 1) throw new Error("currently not supported vecX of uint64 yet");
        return ["vec2<u32>", "u32"];
      case 9:
        if (t !== 4) throw new Error("bool must be vec4");
        return ["u32", "vec4<bool>"];
      case 22:
        return "i32";
      case 21:
        return "u32";
      default:
        throw new Error(`Unknown data type: ${e}`);
    }
  }, oe = (e, t = 1) => {
    let i = Tt(e, t);
    return typeof i == "string" ? i : i[0];
  }, pe = (e, t = 1) => {
    let i = Tt(e, t);
    return typeof i == "string" ? i : i[1];
  }, P = (...e) => {
    let t = [];
    return e.forEach((i) => {
      i.length !== 0 && t.push({ type: 12, data: i }, { type: 12, data: k.computeStrides(i) });
    }), t;
  }, re = (e) => e % 4 === 0 ? 4 : e % 2 === 0 ? 2 : 1, Zi = (e = "f32", t, i = "0") => !t || t === 1 ? `${e}(${i})` : `vec${t}<${e}>(${i})`, it = (e, t, i) => e === "f32" ? i : t === 1 ? `f32(${i})` : `vec${t}<f32>(${i})`, Ue = (e, t) => t === 4 ? `(${e}.x + ${e}.y + ${e}.z + ${e}.w)` : t === 2 ? `(${e}.x + ${e}.y)` : t === 3 ? `(${e}.x + ${e}.y + ${e}.z)` : e, U = (e, t, i, r) => e.startsWith("uniforms.") && i > 4 ? typeof t == "string" ? r === "f16" ? `${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]` : `${e}[(${t}) / 4][(${t}) % 4]` : r === "f16" ? `${e}[${Math.floor(t / 8)}][${Math.floor(t % 8 / 4)}][${t % 8 % 4}]` : `${e}[${Math.floor(t / 4)}][${t % 4}]` : i > 1 ? `${e}[${t}]` : e, ut = (e, t, i, r, a) => {
    let n = typeof i == "number", s = n ? i : i.length, o = [...new Array(s).keys()], u = s < 2 ? "u32" : s <= 4 ? `vec${s}<u32>` : `array<u32, ${s}>`, l = Tt(t, a), p = typeof l == "string" ? l : l[1], d = typeof l == "string" ? l : l[0], c = { indices: u, value: p, storage: d, tensor: t }, h = (E) => typeof E == "string" ? E : `${E}u`, f = { offsetToIndices: !1, indicesToOffset: !1, broadcastedIndicesToOffset: !1, set: !1, setByIndices: !1, get: !1, getByIndices: !1 }, g = n ? "uniforms." : "", y = `${g}${e}_shape`, _ = `${g}${e}_strides`, m = "";
    for (let E = 0; E < s - 1; E++) m += `
    let dim${E} = current / ${U(_, E, s)};
    let rest${E} = current % ${U(_, E, s)};
    indices[${E}] = dim${E};
    current = rest${E};
    `;
    m += `indices[${s - 1}] = current;`;
    let w = s < 2 ? "" : `
  fn o2i_${e}(offset: u32) -> ${c.indices} {
    var indices: ${c.indices};
    var current = offset;
    ${m}
    return indices;
  }`, $ = (E) => (f.offsetToIndices = !0, s < 2 ? E : `o2i_${e}(${E})`), b = [];
    if (s >= 2) for (let E = s - 1; E >= 0; E--) b.push(`${U(_, E, s)} * (indices[${E}])`);
    let x = s < 2 ? "" : `
  fn i2o_${e}(indices: ${c.indices}) -> u32 {
    return ${b.join("+")};
  }`, v = (E) => (f.indicesToOffset = !0, s < 2 ? E : `i2o_${e}(${E})`), S = (...E) => s === 0 ? "0u" : `${c.indices}(${E.map(h).join(",")})`, T = (E, q) => s < 2 ? `${E}` : `${U(E, q, s)}`, C = (E, q, N) => s < 2 ? `${E}=${N};` : `${U(E, q, s)}=${N};`, W = {}, B = (E, q) => {
      f.broadcastedIndicesToOffset = !0;
      let N = `${q.name}broadcastedIndicesTo${e}Offset`;
      if (N in W) return `${N}(${E})`;
      let D = [];
      for (let de = s - 1; de >= 0; de--) {
        let he = q.indicesGet("outputIndices", de + q.rank - s);
        D.push(`${T(_, de)} * (${he} % ${T(y, de)})`);
      }
      return W[N] = `fn ${N}(outputIndices: ${q.type.indices}) -> u32 {
             return ${D.length > 0 ? D.join("+") : "0u"};
           }`, `${N}(${E})`;
    }, R = (E, q) => (() => {
      if (c.storage === c.value) return `${e}[${E}]=${q};`;
      if (c.storage === "vec2<u32>" && c.value === "i32") return `${e}[${E}]=vec2<u32>(u32(${q}), select(0u, 0xFFFFFFFFu, ${q} < 0));`;
      if (c.storage === "vec2<u32>" && c.value === "u32") return `${e}[${E}]=vec2<u32>(u32(${q}), 0u);`;
      if (c.storage === "u32" && c.value === "vec4<bool>") return `${e}[${E}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${q}));`;
      throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`);
    })(), F = (E) => (() => {
      if (c.storage === c.value) return `${e}[${E}]`;
      if (c.storage === "vec2<u32>" && c.value === "i32") return `i32(${e}[${E}].x)`;
      if (c.storage === "vec2<u32>" && c.value === "u32") return `u32(${e}[${E}].x)`;
      if (c.storage === "u32" && c.value === "vec4<bool>") return `vec4<bool>(bool(${e}[${E}] & 0xFFu), bool(${e}[${E}] & 0xFF00u), bool(${e}[${E}] & 0xFF0000u), bool(${e}[${E}] & 0xFF000000u))`;
      throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`);
    })(), O = s < 2 ? "" : `
  fn get_${e}ByIndices(indices: ${c.indices}) -> ${p} {
    return ${F(`i2o_${e}(indices)`)};
  }`, M = s < 2 ? "" : (() => {
      let E = o.map((N) => `d${N}: u32`).join(", "), q = o.map((N) => `d${N}`).join(", ");
      return `
  fn get_${e}(${E}) -> ${p} {
    return get_${e}ByIndices(${S(q)});
  }`;
    })(), G = (...E) => {
      if (E.length !== s) throw new Error(`indices length must be ${s}`);
      let q = E.map(h).join(",");
      return s === 0 ? F("0u") : s === 1 ? F(q[0]) : (f.get = !0, f.getByIndices = !0, f.indicesToOffset = !0, `get_${e}(${q})`);
    }, K = (E) => s < 2 ? F(E) : (f.getByIndices = !0, f.indicesToOffset = !0, `get_${e}ByIndices(${E})`), L = s < 2 ? "" : `
  fn set_${e}ByIndices(indices: ${c.indices}, value: ${p}) {
    ${R(`i2o_${e}(indices)`, "value")}
  }`, X = s < 2 ? "" : (() => {
      let E = o.map((N) => `d${N}: u32`).join(", "), q = o.map((N) => `d${N}`).join(", ");
      return `
  fn set_${e}(${E}, value: ${p}) {
    set_${e}ByIndices(${S(q)}, value);
  }`;
    })();
    return { impl: () => {
      let E = [], q = !1;
      return f.offsetToIndices && (E.push(w), q = !0), f.indicesToOffset && (E.push(x), q = !0), f.broadcastedIndicesToOffset && (Object.values(W).forEach((N) => E.push(N)), q = !0), f.set && (E.push(X), q = !0), f.setByIndices && (E.push(L), q = !0), f.get && (E.push(M), q = !0), f.getByIndices && (E.push(O), q = !0), !n && q && E.unshift(`const ${y} = ${c.indices}(${i.join(",")});`, `const ${_} = ${c.indices}(${k.computeStrides(i).join(",")});`), E.join(`
`);
    }, type: c, offsetToIndices: $, indicesToOffset: v, broadcastedIndicesToOffset: B, indices: S, indicesGet: T, indicesSet: C, set: (...E) => {
      if (E.length !== s + 1) throw new Error(`indices length must be ${s}`);
      let q = E[s];
      if (typeof q != "string") throw new Error("value must be string");
      let N = E.slice(0, s).map(h).join(",");
      return s === 0 ? R("0u", q) : s === 1 ? R(N[0], q) : (f.set = !0, f.setByIndices = !0, f.indicesToOffset = !0, `set_${e}(${N}, ${q})`);
    }, setByOffset: R, setByIndices: (E, q) => s < 2 ? R(E, q) : (f.setByIndices = !0, f.indicesToOffset = !0, `set_${e}ByIndices(${E}, ${q});`), get: G, getByOffset: F, getByIndices: K, usage: r, name: e, strides: _, shape: y, rank: s };
  }, I = (e, t, i, r = 1) => ut(e, t, i, "input", r), A = (e, t, i, r = 1) => ut(e, t, i, "output", r), Qo = (e, t, i) => ut(e, t, i, "atomicOutput", 1), vr = (e, t, i, r = 1) => ut(e, t, i, "internal", r), pa = class {
    constructor(e, t) {
      this.normalizedDispatchGroup = e, this.limits = t, this.internalVariables = [], this.variables = [], this.uniforms = [], this.variableIndex = 0;
    }
    guardAgainstOutOfBoundsWorkgroupSizes(e) {
      return `if (global_idx >= ${typeof e == "number" ? `${e}u` : e}) { return; }`;
    }
    mainStart(e = at) {
      let t = typeof e == "number" ? e : e[0], i = typeof e == "number" ? 1 : e[1], r = typeof e == "number" ? 1 : e[2];
      if (t > this.limits.maxComputeWorkgroupSizeX || i > this.limits.maxComputeWorkgroupSizeY || r > this.limits.maxComputeWorkgroupSizeZ) throw new Error(`workgroup size [${t}, ${i}, ${r}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);
      if (t * i * r > this.limits.maxComputeInvocationsPerWorkgroup) throw new Error(`workgroup size [${t}, ${i}, ${r}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);
      let a = this.normalizedDispatchGroup[1] === 1 && this.normalizedDispatchGroup[2] === 1, n = a ? `@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>` : `@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`, s = a ? `let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;` : `let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t * i * r}u + local_idx;`;
      return `@compute @workgroup_size(${t}, ${i}, ${r})
  fn main(${n}) {
    ${s}
  `;
    }
    appendVariableUniforms(e) {
      e.rank !== 0 && (e.shape.startsWith("uniforms.") && this.uniforms.push({ name: e.shape.replace("uniforms.", ""), type: "u32", length: e.rank }), e.strides.startsWith("uniforms.") && this.uniforms.push({ name: e.strides.replace("uniforms.", ""), type: "u32", length: e.rank }));
    }
    declareVariable(e, t) {
      if (e.usage === "internal") throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");
      this.variables.push(e), this.appendVariableUniforms(e);
      let i = e.usage === "input" ? "read" : "read_write", r = e.usage === "atomicOutput" ? "atomic<i32>" : e.type.storage;
      return `@group(0) @binding(${t}) var<storage, ${i}> ${e.name}: array<${r}>;`;
    }
    declareVariables(...e) {
      return e.map((t) => this.declareVariable(t, this.variableIndex++)).join(`
`);
    }
    registerInternalVariable(e) {
      if (e.usage !== "internal") throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");
      this.internalVariables.push(e), this.appendVariableUniforms(e);
    }
    registerInternalVariables(...e) {
      return e.forEach((t) => this.registerInternalVariable(t)), this;
    }
    registerUniform(e, t, i = 1) {
      return this.uniforms.push({ name: e, type: t, length: i }), this;
    }
    registerUniforms(e) {
      return this.uniforms = this.uniforms.concat(e), this;
    }
    uniformDeclaration() {
      if (this.uniforms.length === 0) return "";
      let e = [];
      for (let { name: t, type: i, length: r } of this.uniforms) if (r && r > 4) i === "f16" ? e.push(`@align(16) ${t}:array<mat2x4<${i}>, ${Math.ceil(r / 8)}>`) : e.push(`${t}:array<vec4<${i}>, ${Math.ceil(r / 4)}>`);
      else {
        let a = r == null || r === 1 ? i : `vec${r}<${i}>`;
        e.push(`${t}:${a}`);
      }
      return `
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`;
    }
    get additionalImplementations() {
      return this.uniformDeclaration() + this.variables.map((e) => e.impl()).join(`
`) + this.internalVariables.map((e) => e.impl()).join(`
`);
    }
    get variablesInfo() {
      if (this.uniforms.length === 0) return;
      let e = (t) => [12, 10, 1, 6][["u32", "f16", "f32", "i32"].indexOf(t)];
      return this.uniforms.map((t) => [e(t.type), t.length ?? 1]);
    }
  }, Yo = (e, t) => new pa(e, t);
}), ca, ci, ha, fa, ma, ga, _e, Jo, eu, Pe = z(() => {
  V(), H(), ae(), j(), ca = (e, t) => {
    if (!e || e.length !== 1) throw new Error("Transpose requires 1 input.");
    if (t.length !== 0 && t.length !== e[0].dims.length) throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`);
  }, ci = (e, t) => t.length !== 0 ? t : [...new Array(e).keys()].reverse(), ha = (e, t) => k.sortBasedOnPerm(e, ci(e.length, t)), fa = (e, t, i, r) => {
    let a = `fn perm(i: ${r.type.indices}) -> ${i.type.indices} {
    var a: ${i.type.indices};`;
    for (let n = 0; n < t; ++n) a += `a[${e[n]}]=i[${n}];`;
    return a += "return a;}";
  }, ma = (e, t) => {
    let i = [], r = [];
    for (let a = 0; a < e.length; ++a) e[a] !== 1 && i.push(e[a]), e[t[a]] !== 1 && r.push(t[a]);
    return { newShape: i, newPerm: r };
  }, ga = (e, t) => {
    let i = 0;
    for (let r = 0; r < e.length; ++r) if (t[e[r]] !== 1) {
      if (e[r] < i) return !1;
      i = e[r];
    }
    return !0;
  }, _e = (e, t) => {
    let i = e.dataType, r = e.dims.length, a = ci(r, t), n = ha(e.dims, a), s = e.dims, o = n, u = r < 2 || ga(a, e.dims), l;
    if (u) return l = (f) => {
      let g = I("input", i, s, 4), y = A("output", i, o, 4);
      return `
  ${f.registerUniform("output_size", "u32").declareVariables(g, y)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`;
    }, { name: "TransposeCopy", shaderCache: { inputDependencies: ["type"] }, getRunData: () => {
      let f = k.size(n);
      return { outputs: [{ dims: n, dataType: e.dataType }], dispatchGroup: { x: Math.ceil(f / 64 / 4) }, programUniforms: [{ type: 12, data: Math.ceil(f / 4) }] };
    }, getShaderSource: l };
    let { newShape: p, newPerm: d } = ma(e.dims, a), c = k.areEqual(d, [2, 3, 1]), h = k.areEqual(d, [3, 1, 2]);
    if (p.length === 2 || c || h) {
      s = c ? [p[0], p[1] * p[2]] : h ? [p[0] * p[1], p[2]] : p, o = [s[1], s[0]];
      let f = 16;
      return l = (g) => {
        let y = I("a", i, s.length), _ = A("output", i, o.length);
        return `
  ${g.registerUniform("output_size", "u32").declareVariables(y, _)}
  var<workgroup> tile : array<array<${_.type.value}, ${f + 1}>, ${f}>;
  ${g.mainStart([f, f, 1])}
    let stride = (uniforms.output_shape[1] - 1) / ${f} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${f}u + local_id.x;
    let input_row = workgroup_id_x * ${f}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${y.getByIndices(`${y.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${f}u + local_id.x;
    let output_row = workgroup_id_y * ${f}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${_.setByIndices(`${_.type.indices}(output_row, output_col)`, "tile[local_id.x][local_id.y]")}
    }
  }`;
      }, { name: "TransposeShared", shaderCache: { inputDependencies: ["type"] }, getRunData: () => {
        let g = k.size(n);
        return { outputs: [{ dims: n, dataType: e.dataType }], dispatchGroup: { x: Math.ceil(o[1] / f), y: Math.ceil(o[0] / f) }, programUniforms: [{ type: 12, data: g }, ...P(s, o)] };
      }, getShaderSource: l };
    }
    return l = (f) => {
      let g = I("a", i, s.length), y = A("output", i, o.length);
      return `
  ${f.registerUniform("output_size", "u32").declareVariables(g, y)}

  ${fa(a, r, g, y)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${y.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${y.setByOffset("global_idx", g.getByIndices("aIndices"))}
  }`;
    }, { name: "Transpose", shaderCache: { hint: `${t}`, inputDependencies: ["rank"] }, getRunData: () => {
      let f = k.size(n);
      return { outputs: [{ dims: n, dataType: e.dataType }], dispatchGroup: { x: Math.ceil(f / 64) }, programUniforms: [{ type: 12, data: f }, ...P(s, o)] };
    }, getShaderSource: l };
  }, Jo = (e, t) => {
    ca(e.inputs, t.perm), e.compute(_e(e.inputs[0], t.perm));
  }, eu = (e) => Y({ perm: e.perm });
}), _a, ya, $a, wa, ba, va, xa, ka, Sa, Ia, be, tu, iu, ru, au, nu, su, ou, uu, lu, du, Ip = z(() => {
  V(), H(), j(), xr(), Pe(), _a = { max: "select(bestValue, candidate, candidate > bestValue)", min: "select(bestValue, candidate, candidate < bestValue)", mean: "bestValue + candidate", sum: "bestValue + candidate", prod: "bestValue * candidate", sumSquare: "bestValue + candidate * candidate", logSumExp: "bestValue + exp(candidate)", l1: "bestValue + abs(candidate)", l2: "bestValue + candidate * candidate", logSum: "bestValue + candidate" }, ya = { max: "select(bestValue, candidate, candidate > bestValue)", min: "select(bestValue, candidate, candidate < bestValue)", mean: "bestValue + candidate", sum: "bestValue + candidate", prod: "bestValue * candidate", sumSquare: "bestValue + candidate", logSumExp: "bestValue + candidate", l1: "bestValue + candidate", l2: "bestValue + candidate", logSum: "bestValue + candidate" }, $a = { max: "_A[offset]", min: "_A[offset]", mean: "0", sum: "0", prod: "1", sumSquare: "0", logSumExp: "0", l1: "0", l2: "0", logSum: "0" }, wa = { max: "bestValue", min: "bestValue", sum: "bestValue", prod: "bestValue", sumSquare: "bestValue", logSumExp: "log(bestValue)", l1: "bestValue", l2: "sqrt(bestValue)", logSum: "log(bestValue)" }, ba = (e, t) => {
    let i = [];
    for (let r = t - e; r < t; ++r) i.push(r);
    return i;
  }, va = (e, t) => {
    let i = [], r = e.length;
    for (let n = 0; n < r; n++) t.indexOf(n) === -1 && i.push(e[n]);
    let a = t.map((n) => e[n]);
    return [i, a];
  }, xa = (e, t) => {
    let i = e.length + t.length, r = [], a = 0;
    for (let n = 0; n < i; n++) t.indexOf(n) === -1 ? r.push(e[a++]) : r.push(1);
    return r;
  }, ka = (e, t) => {
    for (let i = 0; i < e.length; ++i) if (e[e.length - i - 1] !== t - 1 - i) return !1;
    return !0;
  }, Sa = (e, t) => {
    let i = [];
    if (!ka(e, t)) {
      for (let r = 0; r < t; ++r) e.indexOf(r) === -1 && i.push(r);
      e.forEach((r) => i.push(r));
    }
    return i;
  }, Ia = (e, t, i, r, a, n, s) => {
    let o = i[0].dims, u = k.size(n), l = k.size(s), p = I("_A", i[0].dataType, o), d = A("output", a, n), c = 64;
    u === 1 && (c = 256);
    let h = `
          var<workgroup> aBestValues : array<f32, ${c}>;
       `, f = (g) => `
        ${g.registerUniform("reduceSize", "u32").declareVariables(p, d)}
        ${h}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${g.mainStart(c)}

          let outputIndex = global_idx / ${c};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${$a[r]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${c}) {
           let candidate = f32(${p.getByOffset("offset + k")});
           bestValue = ${_a[r]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${c}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${ya[r]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${d.setByOffset("outputIndex", `${r === "mean" ? `${d.type.storage}(bestValue / f32(uniforms.reduceSize))` : `${d.type.storage}(${wa[r]})`}`)};
         }
        }`;
    return { name: e, shaderCache: { hint: `${t};${c}`, inputDependencies: ["type"] }, getShaderSource: f, getRunData: () => ({ outputs: [{ dims: n, dataType: a }], dispatchGroup: { x: u }, programUniforms: [{ type: 12, data: l }] }) };
  }, be = (e, t, i, r) => {
    let a = e.inputs.length === 1 ? i : Qi(e.inputs, i), n = a.axes;
    n.length === 0 && !a.noopWithEmptyAxes && (n = e.inputs[0].dims.map((h, f) => f));
    let s = k.normalizeAxes(n, e.inputs[0].dims.length), o = s, u = e.inputs[0], l = Sa(o, e.inputs[0].dims.length);
    l.length > 0 && (u = e.compute(_e(e.inputs[0], l), { inputs: [0], outputs: [-1] })[0], o = ba(o.length, u.dims.length));
    let [p, d] = va(u.dims, o), c = p;
    a.keepDims && (c = xa(p, s)), e.compute(Ia(t, a.cacheKey, [u], r, e.inputs[0].dataType, c, d), { inputs: [u] });
  }, tu = (e, t) => {
    be(e, "ReduceMeanShared", t, "mean");
  }, iu = (e, t) => {
    be(e, "ReduceL1Shared", t, "l1");
  }, ru = (e, t) => {
    be(e, "ReduceL2Shared", t, "l2");
  }, au = (e, t) => {
    be(e, "ReduceLogSumExpShared", t, "logSumExp");
  }, nu = (e, t) => {
    be(e, "ReduceMaxShared", t, "max");
  }, su = (e, t) => {
    be(e, "ReduceMinShared", t, "min");
  }, ou = (e, t) => {
    be(e, "ReduceProdShared", t, "prod");
  }, uu = (e, t) => {
    be(e, "ReduceSumShared", t, "sum");
  }, lu = (e, t) => {
    be(e, "ReduceSumSquareShared", t, "sumSquare");
  }, du = (e, t) => {
    be(e, "ReduceLogSumShared", t, "logSum");
  };
}), ve, Ta, Vt, Qi, xe, Ea, za, Ca, Oa, Ba, Ra, Aa, Ma, Da, Ua, ke, pu, cu, hu, fu, mu, gu, _u, yu, $u, wu, xr = z(() => {
  V(), H(), ae(), j(), Ip(), ve = (e) => {
    if (!e || e.length === 0 || e.length > 2) throw new Error("Reduce op requires 1 or 2 inputs.");
    if (e.length === 2 && e[1].dims.length !== 1) throw new Error("Invalid axes input dims.");
  }, Ta = (e) => ["", "", `var value = ${e.getByIndices("input_indices")};`, ""], Vt = (e, t, i, r, a, n, s = !1, o = !1) => {
    let u = [], l = i[0].dims, p = l.length, d = k.normalizeAxes(a, p), c = !o && d.length === 0;
    l.forEach((g, y) => {
      c || d.indexOf(y) >= 0 ? s && u.push(1) : u.push(g);
    });
    let h = u.length, f = k.size(u);
    return { name: e, shaderCache: t, getShaderSource: (g) => {
      let y = [], _ = I("_A", i[0].dataType, p), m = A("output", n, h), w = r(_, m, d), $ = w[2];
      for (let b = 0, x = 0; b < p; b++) c || d.indexOf(b) >= 0 ? (s && x++, $ = `for(var j${b}: u32 = 0; j${b} < ${l[b]}; j${b}++) {
                  ${w[2].includes("last_index") ? `let last_index = j${b};` : ""}
                  ${_.indicesSet("input_indices", b, `j${b}`)}
                  ${$}
                }`) : (y.push(`${_.indicesSet("input_indices", b, m.indicesGet("output_indices", x))};`), x++);
      return `

        ${g.registerUniform("output_size", "u32").declareVariables(_, m)}

        ${g.mainStart()}
          ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${_.type.indices};
          let output_indices = ${m.offsetToIndices("global_idx")};

          ${y.join(`
`)}
          ${w[0]}       // init ops for reduce max/min
          ${w[1]}
          ${$}
          ${w[3]}
          ${w.length === 4 ? m.setByOffset("global_idx", "value") : w.slice(4).join(`
`)}
        }`;
    }, getRunData: () => ({ outputs: [{ dims: u, dataType: n }], dispatchGroup: { x: Math.ceil(f / 64) }, programUniforms: [{ type: 12, data: f }, ...P(l, u)] }) };
  }, Qi = (e, t) => {
    let i = [];
    return e[1].dims[0] > 0 && e[1].getBigInt64Array().forEach((r) => i.push(Number(r))), Y({ axes: i, keepDims: t.keepDims, noopWithEmptyAxes: t.noopWithEmptyAxes });
  }, xe = (e, t, i, r) => {
    let a = e.inputs, n = a.length === 1 ? i : Qi(a, i);
    e.compute(Vt(t, { hint: n.cacheKey, inputDependencies: ["rank"] }, [a[0]], n.noopWithEmptyAxes && n.axes.length === 0 ? Ta : r, n.axes, a[0].dataType, n.keepDims, n.noopWithEmptyAxes), { inputs: [0] });
  }, Ea = (e, t) => {
    ve(e.inputs), xe(e, "ReduceLogSum", t, (i, r) => [`var value = ${r.type.storage}(0);`, "", `value += ${i.getByIndices("input_indices")};`, "value = log(value);"]);
  }, za = (e, t) => {
    ve(e.inputs), xe(e, "ReduceL1", t, (i, r) => [`var value = ${r.type.storage}(0);`, "", `value += abs(${i.getByIndices("input_indices")});`, ""]);
  }, Ca = (e, t) => {
    ve(e.inputs), xe(e, "ReduceL2", t, (i, r) => [`var t = ${r.type.value}(0); var value = ${r.type.value}(0);`, "", `t = ${i.getByIndices("input_indices")}; value += (t * t);`, "value = sqrt(value);"]);
  }, Oa = (e, t) => {
    ve(e.inputs), xe(e, "ReduceLogSumExp", t, (i, r) => [`var value = ${r.type.storage}(0);`, "", `value += exp(${i.getByIndices("input_indices")});`, "value = log(value);"]);
  }, Ba = (e, t) => {
    ve(e.inputs), xe(e, "ReduceMax", t, (i, r, a) => {
      let n = [];
      for (let s = 0; s < i.rank; s++) (a.indexOf(s) >= 0 || a.length === 0) && n.push(i.indicesSet("input_indices", s, 0));
      return [`${n.join(`
`)}`, `var value = ${i.getByIndices("input_indices")};`, `value = max(value, ${i.getByIndices("input_indices")});`, ""];
    });
  }, Ra = (e, t) => {
    ve(e.inputs), xe(e, "ReduceMean", t, (i, r, a) => {
      let n = 1;
      for (let s = 0; s < i.rank; s++) (a.indexOf(s) >= 0 || a.length === 0) && (n *= e.inputs[0].dims[s]);
      return ["var sum = f32(0);", "", `sum += f32(${i.getByIndices("input_indices")});`, `let value = ${r.type.value}(sum / ${n});`];
    });
  }, Aa = (e, t) => {
    ve(e.inputs), xe(e, "ReduceMin", t, (i, r, a) => {
      let n = [];
      for (let s = 0; s < i.rank; s++) (a.indexOf(s) >= 0 || a.length === 0) && n.push(`input_indices[${s}] = 0;`);
      return [`${n.join(`
`)}`, `var value = ${i.getByIndices("input_indices")};`, `value = min(value, ${i.getByIndices("input_indices")});`, ""];
    });
  }, Ma = (e, t) => {
    ve(e.inputs), xe(e, "ReduceProd", t, (i, r) => [`var value = ${r.type.storage}(1);`, "", `value *= ${i.getByIndices("input_indices")};`, ""]);
  }, Da = (e, t) => {
    ve(e.inputs), xe(e, "ReduceSum", t, (i, r) => [`var value = ${r.type.storage}(0);`, "", `value += ${i.getByIndices("input_indices")};`, ""]);
  }, Ua = (e, t) => {
    ve(e.inputs), xe(e, "ReduceSumSquare", t, (i, r) => [`var t = ${r.type.value}(0); var value = ${r.type.value}(0);`, "", `t = ${i.getByIndices("input_indices")}; value += t * t;`, ""]);
  }, ke = (e, t, i) => {
    if (t.length === 0) return i;
    let r = 1, a = 1;
    for (let n = 0; n < t.length; n++) t.indexOf(n) === -1 ? r *= e[n] : a *= e[n];
    return a < 32 && r > 1024;
  }, pu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Ra(e, t) : tu(e, t);
  }, cu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? za(e, t) : iu(e, t);
  }, hu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Ca(e, t) : ru(e, t);
  }, fu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Oa(e, t) : au(e, t);
  }, mu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Ba(e, t) : nu(e, t);
  }, gu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Aa(e, t) : su(e, t);
  }, _u = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Ma(e, t) : ou(e, t);
  }, yu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Da(e, t) : uu(e, t);
  }, $u = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Ua(e, t) : lu(e, t);
  }, wu = (e, t) => {
    ke(e.inputs[0].dims, t.axes, t.noopWithEmptyAxes) ? Ea(e, t) : du(e, t);
  };
}), hi, bu, vu, Yi, Tp = z(() => {
  V(), ae(), xr(), hi = (e) => {
    if (!e || e.length === 0 || e.length > 2) throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");
    if (e[0].dataType !== 1) throw new Error("Invalid input type.");
  }, bu = (e, t) => {
    hi(e.inputs);
    let i = (r, a, n) => {
      let s = [];
      for (let o = 0; o < r.rank; o++) (n.indexOf(o) >= 0 || n.length === 0) && s.push(`input_indices[${o}] = 0;`);
      return [`${s.join(`
`)}`, `var value = ${r.getByIndices("input_indices")};
var best_index : i32 = 0;`, `if (${r.getByIndices("input_indices")} ${t.selectLastIndex > 0 ? "<=" : "<"} value) {
         value = ${r.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`, "", a.setByOffset("global_idx", "best_index")];
    };
    e.compute(Vt("ArgMin", { hint: t.cacheKey, inputDependencies: ["rank"] }, [e.inputs[0]], i, [t.axis], 7, t.keepDims), { inputs: [0] });
  }, vu = (e, t) => {
    hi(e.inputs);
    let i = (r, a, n) => {
      let s = [];
      for (let o = 0; o < r.rank; o++) (n.indexOf(o) >= 0 || n.length === 0) && s.push(`input_indices[${o}] = 0;`);
      return [`${s.join(`
`)}`, `var value = ${r.getByIndices("input_indices")};
var best_index : i32 = 0;`, `if (${r.getByIndices("input_indices")} ${t.selectLastIndex > 0 ? ">=" : ">"} value) {
         value = ${r.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`, "", a.setByOffset("global_idx", "best_index")];
    };
    e.compute(Vt("argMax", { hint: t.cacheKey, inputDependencies: ["rank"] }, [e.inputs[0]], i, [t.axis], 7, t.keepDims), { inputs: [0] });
  }, Yi = (e) => Y(e);
}), Pa, Et, Na, qa, Va, wt, La, xu, kr = z(() => {
  V(), H(), br(), j(), Pa = (e, t) => {
    let i = e[0], r = e[1], a = e[2], n = e[3], s = e[4], o = e[5];
    if (s && o) throw new Error("Attention cannot have both past and attention_bias");
    if (i.dims.length !== 3) throw new Error('Input "input" must have 3 dimensions');
    let u = i.dims[0], l = i.dims[1], p = i.dims[2];
    if (a.dims.length !== 1) throw new Error('Input "bias" is expected to have 1 dimensions');
    if (r.dims.length !== 2) throw new Error('Input "weights" is expected to have 2 dimensions');
    if (r.dims[0] !== p) throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");
    if (a.dims[0] !== r.dims[1]) throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');
    let d = a.dims[0] / 3, c = d, h = c;
    if (t.qkvHiddenSizes.length > 0) {
      if (t.qkvHiddenSizes.length !== 3) throw new Error("qkv_hidden_sizes attribute should have 3 elements");
      for (let w of t.qkvHiddenSizes) if (w % t.numHeads !== 0) throw new Error("qkv_hidden_sizes should be divisible by num_heads");
      d = t.qkvHiddenSizes[0], c = t.qkvHiddenSizes[1], h = t.qkvHiddenSizes[2];
    }
    let f = l;
    if (d !== c) throw new Error("qkv_hidden_sizes first element should be same as the second");
    if (a.dims[0] !== d + c + h) throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');
    let g = 0;
    if (s) {
      if (c !== h) throw new Error('Input "past" expect k_hidden_size == v_hidden_size');
      if (s.dims.length !== 5) throw new Error('Input "past" must have 5 dimensions');
      if (s.dims[0] !== 2) throw new Error('Input "past" first dimension must be 2');
      if (s.dims[1] !== u) throw new Error('Input "past" second dimension must be batch_size');
      if (s.dims[2] !== t.numHeads) throw new Error('Input "past" third dimension must be num_heads');
      if (s.dims[4] !== c / t.numHeads) throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');
      t.pastPresentShareBuffer || (g = s.dims[3]);
    }
    let y = f + g, _ = -1, m = 0;
    if (n) throw new Error("Mask not supported");
    if (s) throw new Error("past is not supported");
    if (o) {
      if (o.dims.length !== 4) throw new Error('Input "attention_bias" must have 4 dimensions');
      if (o.dims[0] !== u || o.dims[1] !== t.numHeads || o.dims[2] !== l || o.dims[3] !== y) throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)');
    }
    return { batchSize: u, sequenceLength: l, pastSequenceLength: g, kvSequenceLength: f, totalSequenceLength: y, maxSequenceLength: _, inputHiddenSize: p, hiddenSize: d, vHiddenSize: h, headSize: Math.floor(d / t.numHeads), vHeadSize: Math.floor(h / t.numHeads), numHeads: t.numHeads, isUnidirectional: !1, pastPresentShareBuffer: !1, maskFilterValue: t.maskFilterValue, maskType: m, scale: t.scale, broadcastResPosBias: !1, passPastInKv: !1, qkvFormat: 1 };
  }, Et = (e, t, i) => t && e ? `
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       ` : `
    ${i ? "let past_sequence_length = uniforms.past_sequence_length" : ""};
    let present_sequence_length = total_sequence_length;
    `, Na = (e, t, i, r, a, n, s, o) => {
    let u = re(s ? 1 : n), l = 64, p = n / u;
    p < l && (l = 32);
    let d = Math.ceil(n / u / l), c = [{ type: 12, data: t }, { type: 12, data: i }, { type: 12, data: r }, { type: 12, data: a }, { type: 12, data: p }, { type: 12, data: d }], h = oe(e.dataType, u), f = pe(1, u), g = ["type"];
    s && g.push("type"), o && g.push("type");
    let y = (_) => {
      let m = A("x", e.dataType, e.dims, u), w = [m], $ = s ? I("seq_lens", s.dataType, s.dims) : void 0;
      $ && w.push($);
      let b = o ? I("total_sequence_length_input", o.dataType, o.dims) : void 0;
      b && w.push(b);
      let x = pe(e.dataType), v = [{ name: "batch_size", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "past_sequence_length", type: "u32" }, { name: "sequence_length", type: "u32" }, { name: "total_sequence_length", type: "u32" }, { name: "elements_per_thread", type: "u32" }];
      return `
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${_.registerUniforms(v).declareVariables(...w)}
  ${_.mainStart([l, 1, 1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Et($, b, !1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s ? "u32(past_sequence_length + workgroup_id.y + 1)" : "total_sequence_length"};
    var thread_max_vector = ${f}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${f}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(() => {
        switch (u) {
          case 1:
            return "thread_max_vector";
          case 2:
            return "max(thread_max_vector.x, thread_max_vector.y)";
          case 4:
            return "max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";
          default:
            throw new Error(`Unsupported components: ${u}`);
        }
      })()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${f}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${f}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(() => {
        switch (u) {
          case 1:
            return "sum_vector";
          case 2:
            return "sum_vector.x + sum_vector.y";
          case 4:
            return "sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";
          default:
            throw new Error(`Unsupported components: ${u}`);
        }
      })()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${m.type.value}(${x}(1.0) / ${x}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${f}(x[offset + i]);
        x[offset + i] = ${m.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s ? `
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${m.type.value}(${x}(0));
        }` : ""};
  }`;
    };
    return { name: "AttentionProbsSoftmax", shaderCache: { hint: `${l};${h};${u}`, inputDependencies: g }, getShaderSource: y, getRunData: () => ({ outputs: [], dispatchGroup: { x: 1, y: a, z: t * i }, programUniforms: c }) };
  }, qa = (e, t, i, r, a, n, s, o, u) => {
    let l = s + n.kvSequenceLength, p = [n.batchSize, n.numHeads, n.sequenceLength, l], d = e > 1 && r, c = n.kvNumHeads ? n.kvNumHeads : n.numHeads, h = d ? [n.batchSize, c, l, n.headSize] : void 0, f = n.nReps ? n.nReps : 1, g = n.scale === 0 ? 1 / Math.sqrt(n.headSize) : n.scale, y = re(n.headSize), _ = n.headSize / y, m = 12, w = { x: Math.ceil(l / m), y: Math.ceil(n.sequenceLength / m), z: n.batchSize * n.numHeads }, $ = [{ type: 12, data: n.sequenceLength }, { type: 12, data: _ }, { type: 12, data: l }, { type: 12, data: n.numHeads }, { type: 12, data: n.headSize }, { type: 1, data: g }, { type: 12, data: s }, { type: 12, data: n.kvSequenceLength }, { type: 12, data: f }], b = d && r && k.size(r.dims) > 0, x = ["type", "type"];
    b && x.push("type"), a && x.push("type"), o && x.push("type"), u && x.push("type");
    let v = [{ dims: p, dataType: t.dataType, gpuDataType: 0 }];
    d && v.push({ dims: h, dataType: t.dataType, gpuDataType: 0 });
    let S = (T) => {
      let C = I("q", t.dataType, t.dims, y), W = I("key", i.dataType, i.dims, y), B = [C, W];
      if (b) {
        let L = I("past_key", r.dataType, r.dims, y);
        B.push(L);
      }
      a && B.push(I("attention_bias", a.dataType, a.dims));
      let R = o ? I("seq_lens", o.dataType, o.dims) : void 0;
      R && B.push(R);
      let F = u ? I("total_sequence_length_input", u.dataType, u.dims) : void 0;
      F && B.push(F);
      let O = A("output", t.dataType, p), M = [O];
      d && M.push(A("present_key", t.dataType, h, y));
      let G = pe(1, y), K = [{ name: "M", type: "u32" }, { name: "K", type: "u32" }, { name: "N", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "head_size", type: "u32" }, { name: "alpha", type: "f32" }, { name: "past_sequence_length", type: "u32" }, { name: "kv_sequence_length", type: "u32" }, { name: "n_reps", type: "u32" }];
      return `
  const TILE_SIZE = ${m}u;

  var<workgroup> tileQ: array<${C.type.storage}, ${m * m}>;
  var<workgroup> tileK: array<${C.type.storage}, ${m * m}>;
  ${T.registerUniforms(K).declareVariables(...B, ...M)}
  ${T.mainStart([m, m, 1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${f === 1 ? "headIdx" : "headIdx / uniforms.n_reps"};
    let kv_num_heads = ${f === 1 ? "uniforms.num_heads" : "uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Et(R, F, !0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${b && d ? "let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;" : ""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${d ? "let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;" : ""}
    var value = ${G}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${b && d ? `
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }` : `
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${d ? `if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }` : ""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${G}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(() => {
        switch (y) {
          case 1:
            return "value";
          case 2:
            return "value.x + value.y";
          case 4:
            return "value.x + value.y + value.z + value.w";
          default:
            throw new Error(`Unsupported components: ${y}`);
        }
      })()};
        output[outputIdx] = ${O.type.value} (sum * uniforms.alpha) + ${a ? "attention_bias[outputIdx]" : "0.0"};
    }
  }`;
    };
    return { name: "AttentionProbs", shaderCache: { hint: `${y};${a !== void 0};${r !== void 0};${e}`, inputDependencies: x }, getRunData: () => ({ outputs: v, dispatchGroup: w, programUniforms: $ }), getShaderSource: S };
  }, Va = (e, t, i, r, a, n, s = void 0, o = void 0) => {
    let u = n + a.kvSequenceLength, l = a.nReps ? a.nReps : 1, p = a.vHiddenSize * l, d = e > 1 && r, c = a.kvNumHeads ? a.kvNumHeads : a.numHeads, h = d ? [a.batchSize, c, u, a.headSize] : void 0, f = [a.batchSize, a.sequenceLength, p], g = 12, y = { x: Math.ceil(a.vHeadSize / g), y: Math.ceil(a.sequenceLength / g), z: a.batchSize * a.numHeads }, _ = [{ type: 12, data: a.sequenceLength }, { type: 12, data: u }, { type: 12, data: a.vHeadSize }, { type: 12, data: a.numHeads }, { type: 12, data: a.headSize }, { type: 12, data: p }, { type: 12, data: n }, { type: 12, data: a.kvSequenceLength }, { type: 12, data: l }], m = d && r && k.size(r.dims) > 0, w = ["type", "type"];
    m && w.push("type"), s && w.push("type"), o && w.push("type");
    let $ = [{ dims: f, dataType: t.dataType, gpuDataType: 0 }];
    d && $.push({ dims: h, dataType: t.dataType, gpuDataType: 0 });
    let b = (x) => {
      let v = I("probs", t.dataType, t.dims), S = I("v", i.dataType, i.dims), T = [v, S];
      m && T.push(I("past_value", r.dataType, r.dims));
      let C = s ? I("seq_lens", s.dataType, s.dims) : void 0;
      s && T.push(C);
      let W = o ? I("total_sequence_length_input", o.dataType, o.dims) : void 0;
      o && T.push(W);
      let B = [A("output", t.dataType, f)];
      d && B.push(A("present_value", t.dataType, h));
      let R = [{ name: "M", type: "u32" }, { name: "K", type: "u32" }, { name: "N", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "head_size", type: "u32" }, { name: "v_hidden_size", type: "u32" }, { name: "past_sequence_length", type: "u32" }, { name: "kv_sequence_length", type: "u32" }, { name: "n_reps", type: "u32" }];
      return `
  const TILE_SIZE = ${g}u;
  var<workgroup> tileQ: array<${v.type.value}, ${g * g}>;
  var<workgroup> tileV: array<${v.type.value}, ${g * g}>;
  ${x.registerUniforms(R).declareVariables(...T, ...B)}
  ${x.mainStart([g, g, 1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l === 1 ? "headIdx" : "headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l === 1 ? "uniforms.num_heads" : "uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Et(C, W, !0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${m && d ? "let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;" : ""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${d ? "let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;" : ""}
   var value = ${v.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${m && d ? `
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      ` : `
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${d ? `
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }` : ""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`;
    };
    return { name: "AttentionScore", shaderCache: { hint: `${r !== void 0};${e}`, inputDependencies: w }, getRunData: () => ({ outputs: $, dispatchGroup: y, programUniforms: _ }), getShaderSource: b };
  }, wt = (e, t, i, r, a, n, s, o, u, l, p = void 0, d = void 0) => {
    let c = Math.min(e.outputCount, 1 + (s ? 1 : 0) + (o ? 1 : 0)), h = c > 1 ? s : void 0, f = c > 1 ? o : void 0, g = c > 1 ? l.pastSequenceLength : 0, y = g + l.kvSequenceLength, _ = u && k.size(u.dims) > 0 ? u : void 0, m = [t, i];
    h && k.size(h.dims) > 0 && m.push(h), _ && m.push(_), p && m.push(p), d && m.push(d);
    let w = e.compute(qa(c, t, i, h, _, l, g, p, d), { inputs: m, outputs: c > 1 ? [-1, 1] : [-1] })[0];
    e.compute(Na(w, l.batchSize, l.numHeads, g, l.sequenceLength, y, p, d), { inputs: p && d ? [w, p, d] : [w], outputs: [] });
    let $ = [w, r];
    f && k.size(f.dims) > 0 && $.push(f), p && $.push(p), d && $.push(d), e.compute(Va(c, w, r, f, l, g, p, d), { inputs: $, outputs: c > 1 ? [0, 2] : [0] });
  }, La = (e, t) => {
    let i = [t.batchSize, t.numHeads, t.sequenceLength, t.headSize], r = t.sequenceLength, a = t.inputHiddenSize, n = t.headSize, s = 12, o = { x: Math.ceil(t.headSize / s), y: Math.ceil(t.sequenceLength / s), z: t.batchSize * t.numHeads }, u = [e.inputs[0], e.inputs[1], e.inputs[2]], l = [{ type: 12, data: r }, { type: 12, data: a }, { type: 12, data: n }, { type: 12, data: t.numHeads }, { type: 12, data: t.headSize }, { type: 12, data: t.hiddenSize }, { type: 12, data: t.hiddenSize + t.hiddenSize + t.vHiddenSize }], p = (d) => {
      let c = A("output_q", u[0].dataType, i), h = A("output_k", u[0].dataType, i), f = A("output_v", u[0].dataType, i), g = I("input", u[0].dataType, u[0].dims), y = I("weight", u[1].dataType, u[1].dims), _ = I("bias", u[2].dataType, u[2].dims), m = g.type.storage, w = [{ name: "M", type: "u32" }, { name: "K", type: "u32" }, { name: "N", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "head_size", type: "u32" }, { name: "hidden_size", type: "u32" }, { name: "ldb", type: "u32" }];
      return `
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${m}, ${s * s}>;
  var<workgroup> tileWeightQ: array<${m}, ${s * s}>;
  var<workgroup> tileWeightK: array<${m}, ${s * s}>;
  var<workgroup> tileWeightV: array<${m}, ${s * s}>;
  ${d.registerUniforms(w).declareVariables(g, y, _, c, h, f)}
  ${d.mainStart([s, s, 1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${m}(0);
    var valueK = ${m}(0);
    var valueV = ${m}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`;
    };
    return e.compute({ name: "AttentionPrepare", shaderCache: { inputDependencies: ["type", "type", "type"] }, getRunData: () => ({ outputs: [{ dims: i, dataType: e.inputs[0].dataType, gpuDataType: 0 }, { dims: i, dataType: e.inputs[0].dataType, gpuDataType: 0 }, { dims: i, dataType: e.inputs[0].dataType, gpuDataType: 0 }], dispatchGroup: o, programUniforms: l }), getShaderSource: p }, { inputs: u, outputs: [-1, -1, -1] });
  }, xu = (e, t) => {
    let i = Pa(e.inputs, t), [r, a, n] = La(e, i);
    return wt(e, r, a, n, e.inputs[4], void 0, void 0, void 0, e.inputs[5], i);
  };
}), Wa, Ga, Fa, ku, Ep = z(() => {
  we(), V(), H(), ae(), j(), Wa = (e, t) => {
    if (!e || e.length !== 5) throw new Error("BatchNormalization requires 5 inputs");
    let i = (r, a, n) => {
      let s = a.length;
      if (s !== r.length) throw new Error(`${n}: num dimensions != ${s}`);
      a.forEach((o, u) => {
        if (o !== r[u]) throw new Error(`${n}: dim[${u}] do not match`);
      });
    };
    if (e[0].dims.length > 1) {
      let r = t.format === "NHWC" ? t.spatial ? e[0].dims.slice(-1) : e[0].dims.slice(-1).concat(e[0].dims.slice(1, e[0].dims.length - 1)) : e[0].dims.slice(1, t.spatial ? 2 : void 0);
      i(e[1].dims, r, "Invalid input scale"), i(e[2].dims, r, "Invalid input B"), i(e[3].dims, r, "Invalid input mean"), i(e[4].dims, r, "Invalid input var");
    } else i(e[1].dims, [1], "Invalid input scale"), i(e[2].dims, [1], "Invalid input B"), i(e[3].dims, [1], "Invalid input mean"), i(e[4].dims, [1], "Invalid input var");
  }, Ga = (e, t) => {
    let { epsilon: i, spatial: r, format: a } = t, n = e[0].dims, s = r ? re(n[n.length - 1]) : 1, o = a === "NHWC" && n.length > 1 ? s : 1, u = k.size(n) / s, l = r, p = l ? n.length : n, d = I("x", e[0].dataType, e[0].dims, s), c = I("scale", e[1].dataType, e[1].dims, o), h = I("bias", e[2].dataType, e[2].dims, o), f = I("inputMean", e[3].dataType, e[3].dims, o), g = I("inputVar", e[4].dataType, e[4].dims, o), y = A("y", e[0].dataType, p, s), _ = () => {
      let w = "";
      if (r) w = `let cOffset = ${n.length === 1 ? "0u" : a === "NHWC" ? `outputIndices[${n.length - 1}] / ${s}` : "outputIndices[1]"};`;
      else if (a === "NCHW") w = `
            ${y.indicesSet("outputIndices", "0", "0")}
            let cOffset = ${y.indicesToOffset("outputIndices")};`;
      else {
        w = `var cIndices = ${c.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length - 1}];`;
        for (let $ = 1; $ < c.rank; $++) w += `cIndices[${$}] = outputIndices[${$}];`;
        w += `let cOffset = ${c.indicesToOffset("cIndices")};`;
      }
      return w;
    }, m = (w) => `
  const epsilon = ${i};
  ${w.registerUniform("outputSize", "u32").declareVariables(d, c, h, f, g, y)}
  ${w.mainStart()}
  ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${y.offsetToIndices(`global_idx * ${s}`)};
    ${_()}
    let scale = ${c.getByOffset("cOffset")};
    let bias = ${h.getByOffset("cOffset")};
    let inputMean = ${f.getByOffset("cOffset")};
    let inputVar = ${g.getByOffset("cOffset")};
    let x = ${d.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${y.setByOffset("global_idx", "value")}
  }`;
    return { name: "BatchNormalization", shaderCache: { hint: `${t.epsilon}_${t.format}_${r}_${s}`, inputDependencies: l ? ["rank", "type", "type", "type", "type"] : void 0 }, getShaderSource: m, getRunData: () => ({ outputs: [{ dims: e[0].dims, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(u / 64) }, programUniforms: l ? [{ type: 12, data: u }, ...P(n)] : [{ type: 12, data: u }] }) };
  }, Fa = (e) => Y(e), ku = (e, t) => {
    let { inputs: i, outputCount: r } = e, a = Fa({ ...t, outputCount: r });
    if (te.webgpu.validateInputContent && Wa(i, a), t.trainingMode) throw new Error("BatchNormalization trainingMode is not supported yet.");
    e.compute(Ga(i, a));
  };
}), Ha, Ka, Su, zp = z(() => {
  H(), j(), Ha = (e) => {
    if (e[0].dims.length !== 3) throw new Error("input should have 3 dimensions");
    if (![320, 640, 1280].includes(e[0].dims[2])) throw new Error("number of channels should be 320, 640 or 1280");
    if (e[1].dims.length !== 1) throw new Error("bias is expected to have 1 dimensions");
    if (e[0].dims[2] !== e[1].dims[0]) throw new Error("last dimension of input and bias are not the same");
  }, Ka = (e) => {
    let t = e[0].dims, i = e[0].dims[2], r = k.size(t) / 4, a = e[0].dataType, n = I("input", a, t, 4), s = I("bias", a, [i], 4), o = I("residual", a, t, 4), u = A("output", a, t, 4);
    return { name: "BiasAdd", getRunData: () => ({ outputs: [{ dims: t, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(r / 64) } }), getShaderSource: (l) => `
  const channels = ${i}u / 4;
  ${l.declareVariables(n, s, o, u)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(r)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx", "value")}
  }` };
  }, Su = (e) => {
    Ha(e.inputs), e.compute(Ka(e.inputs));
  };
}), ja, Q, Iu, Tu, Eu, zu, Cu, Ou, Bu, Ru, Au, Xa, Mu, Du, Uu, Pu, _t, Nu, Dt, qu, Vu, Lu, Wu, Gu, Fu, Hu, Ku, ju, Xu, Zu, Qu, Yu, Ju, el, tl, fi, il, Ji, er, rl, al, nl, Za, Qa, sl, Sr = z(() => {
  V(), H(), ae(), j(), ja = (e, t, i, r, a, n, s) => {
    let o = Math.ceil(t / 4), u = "";
    typeof a == "string" ? u = `${a}(a)` : u = a("a");
    let l = I("inputData", i, [o], 4), p = A("outputData", r, [o], 4), d = [{ name: "vec_size", type: "u32" }];
    return s && d.push(...s), `
      ${e.registerUniforms(d).declareVariables(l, p)}

  ${n ?? ""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${p.setByOffset("global_idx", u)}
  }`;
  }, Q = (e, t, i, r, a, n = e.dataType, s, o) => {
    let u = [{ type: 12, data: Math.ceil(k.size(e.dims) / 4) }];
    return s && u.push(...s), { name: t, shaderCache: { hint: a, inputDependencies: ["type"] }, getShaderSource: (l) => ja(l, k.size(e.dims), e.dataType, n, i, r, o), getRunData: (l) => ({ outputs: [{ dims: e.dims, dataType: n }], dispatchGroup: { x: Math.ceil(k.size(l[0].dims) / 64 / 4) }, programUniforms: u }) };
  }, Iu = (e) => {
    e.compute(Q(e.inputs[0], "Abs", "abs"));
  }, Tu = (e) => {
    e.compute(Q(e.inputs[0], "Acos", "acos"));
  }, Eu = (e) => {
    e.compute(Q(e.inputs[0], "Acosh", "acosh"));
  }, zu = (e) => {
    e.compute(Q(e.inputs[0], "Asin", "asin"));
  }, Cu = (e) => {
    e.compute(Q(e.inputs[0], "Asinh", "asinh"));
  }, Ou = (e) => {
    e.compute(Q(e.inputs[0], "Atan", "atan"));
  }, Bu = (e) => {
    e.compute(Q(e.inputs[0], "Atanh", "atanh"));
  }, Ru = (e) => Y(e), Au = (e, t) => {
    let i;
    switch (t.to) {
      case 10:
        i = "vec4<f16>";
        break;
      case 1:
        i = "vec4<f32>";
        break;
      case 12:
        i = "vec4<u32>";
        break;
      case 6:
        i = "vec4<i32>";
        break;
      case 9:
        i = "vec4<bool>";
        break;
      default:
        throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`);
    }
    e.compute(Q(e.inputs[0], "Cast", i, void 0, t.cacheKey, t.to));
  }, Xa = (e) => {
    let t, i, r = e.length >= 2 && e[1].data !== 0, a = e.length >= 3 && e[2].data !== 0;
    switch (e[0].dataType) {
      case 1:
        t = r ? e[1].getFloat32Array()[0] : -34028234663852886e22, i = a ? e[2].getFloat32Array()[0] : 34028234663852886e22;
        break;
      case 10:
        t = r ? e[1].getUint16Array()[0] : 64511, i = a ? e[2].getUint16Array()[0] : 31743;
        break;
      default:
        throw new Error("Unsupport data type");
    }
    return Y({ min: t, max: i });
  }, Mu = (e, t) => {
    let i = t || Xa(e.inputs), r = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "Clip", (a) => `clamp(${a}, vec4<${r}>(uniforms.min), vec4<${r}>(uniforms.max))`, void 0, i.cacheKey, void 0, [{ type: e.inputs[0].dataType, data: i.min }, { type: e.inputs[0].dataType, data: i.max }], [{ name: "min", type: r }, { name: "max", type: r }]), { inputs: [0] });
  }, Du = (e) => {
    e.compute(Q(e.inputs[0], "Ceil", "ceil"));
  }, Uu = (e) => {
    e.compute(Q(e.inputs[0], "Cos", "cos"));
  }, Pu = (e) => {
    e.compute(Q(e.inputs[0], "Cosh", "cosh"));
  }, _t = (e) => Y(e), Nu = (e, t) => {
    let i = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "Elu", (r) => `elu_vf32(${r})`, `
  const elu_alpha_ = ${i}(${t.alpha});

  fn elu_f32(a: ${i}) -> ${i} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${i}>) -> vec4<${i}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`, t.cacheKey));
  }, Dt = (e = "f32") => `
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`, qu = (e) => {
    let t = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "Erf", (i) => `erf_vf32(${i})`, Dt(t)));
  }, Vu = (e) => {
    e.compute(Q(e.inputs[0], "Exp", "exp"));
  }, Lu = (e) => {
    e.compute(Q(e.inputs[0], "Floor", "floor"));
  }, Wu = (e) => {
    let t = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "Gelu", (i) => `0.5 * ${i} * (1.0 + erf_vf32(${i} * 0.7071067811865475))`, Dt(t)));
  }, Gu = (e, t) => {
    let i = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "LeakyRelu", (r) => `select(leaky_relu_alpha_ * ${r}, ${r}, ${r} >= vec4<${i}>(0.0))`, `const leaky_relu_alpha_ = ${i}(${t.alpha});`, t.cacheKey));
  }, Fu = (e) => {
    e.compute(Q(e.inputs[0], "Not", (t) => `!${t}`));
  }, Hu = (e) => {
    e.compute(Q(e.inputs[0], "Neg", (t) => `-${t}`));
  }, Ku = (e) => {
    e.compute(Q(e.inputs[0], "Reciprocal", (t) => `1.0/${t}`));
  }, ju = (e) => {
    let t = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "Relu", (i) => `select(vec4<${t}>(0.0), ${i}, ${i} > vec4<${t}>(0.0))`));
  }, Xu = (e) => {
    e.compute(Q(e.inputs[0], "Sigmoid", (t) => `(1.0 / (1.0 + exp(-${t})))`));
  }, Zu = (e) => Y(e), Qu = (e, t) => {
    let i = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "HardSigmoid", (r) => `max(vec4<${i}>(0.0), min(vec4<${i}>(1.0), ${t.alpha} * ${r} + vec4<${i}>(${t.beta})))`, void 0, t.cacheKey));
  }, Yu = (e) => {
    e.compute(Q(e.inputs[0], "Sin", "sin"));
  }, Ju = (e) => {
    e.compute(Q(e.inputs[0], "Sinh", "sinh"));
  }, el = (e) => {
    e.compute(Q(e.inputs[0], "Sqrt", "sqrt"));
  }, tl = (e) => {
    e.compute(Q(e.inputs[0], "Tan", "tan"));
  }, fi = (e) => `sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`, il = (e) => {
    e.compute(Q(e.inputs[0], "Tanh", fi));
  }, Ji = (e = "f32") => `
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${fi("v")};
}
`, er = (e) => `(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`, rl = (e) => {
    let t = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "FastGelu", er, Ji(t), void 0, e.inputs[0].dataType));
  }, al = (e, t) => {
    let i = pe(e.inputs[0].dataType);
    return e.compute(Q(e.inputs[0], "ThresholdedRelu", (r) => `select(vec4<${i}>(0.0), ${r}, ${r} > thresholded_relu_alpha_)`, `const thresholded_relu_alpha_ = vec4<${i}>(${t.alpha});`, t.cacheKey)), 0;
  }, nl = (e) => {
    e.compute(Q(e.inputs[0], "Log", "log"));
  }, Za = (e, t) => `
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`, Qa = (e) => `quick_gelu_impl(${e})`, sl = (e, t) => {
    let i = pe(e.inputs[0].dataType);
    e.compute(Q(e.inputs[0], "QuickGelu", Qa, Za(i, t.alpha), t.cacheKey, e.inputs[0].dataType));
  };
}), Ya, Ja, ol, Cp = z(() => {
  H(), j(), Sr(), Ya = (e) => {
    if (e[0].dims.length !== 3) throw new Error("input should have 3 dimensions");
    if (![2560, 5120, 10240].includes(e[0].dims[2])) throw new Error("hidden state should be 2560, 5120 or 10240");
    if (e[1].dims.length !== 1) throw new Error("bias is expected to have 1 dimensions");
    if (e[0].dims[2] !== e[1].dims[0]) throw new Error("last dimension of input and bias are not the same");
  }, Ja = (e) => {
    let t = e[0].dims.slice();
    t[2] = t[2] / 2;
    let i = I("input", e[0].dataType, e[0].dims, 4), r = I("bias", e[0].dataType, [e[0].dims[2]], 4), a = A("output", e[0].dataType, t, 4), n = k.size(t) / 4, s = oe(e[0].dataType);
    return { name: "BiasSplitGelu", getRunData: () => ({ outputs: [{ dims: t, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(n / 64) } }), getShaderSource: (o) => `
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2] / 4 / 2}u;

  ${o.declareVariables(i, r, a)}

  ${Dt(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx", "valueLeft * geluRight")}
  }` };
  }, ol = (e) => {
    Ya(e.inputs), e.compute(Ja(e.inputs));
  };
}), en, tn, Se, ul, ll, dl, pl, cl, hl, fl, ml, gl, _l, Op = z(() => {
  V(), H(), j(), en = (e, t, i, r, a, n, s, o, u, l, p, d) => {
    let c, h;
    typeof o == "string" ? c = h = (m, w) => `${o}((${m}),(${w}))` : typeof o == "function" ? c = h = o : (c = o.scalar, h = o.vector);
    let f = A("outputData", p, r.length, 4), g = I("aData", u, t.length, 4), y = I("bData", l, i.length, 4), _;
    if (a) if (n) {
      let m = k.size(t) === 1, w = k.size(i) === 1, $ = t.length > 0 && t[t.length - 1] % 4 === 0, b = i.length > 0 && i[i.length - 1] % 4 === 0;
      m || w ? _ = f.setByOffset("global_idx", h(m ? `${g.type.value}(${g.getByOffset("0")}.x)` : g.getByOffset("global_idx"), w ? `${y.type.value}(${y.getByOffset("0")}.x)` : y.getByOffset("global_idx"))) : _ = `
            let outputIndices = ${f.offsetToIndices("global_idx * 4u")};
            let offsetA = ${g.broadcastedIndicesToOffset("outputIndices", f)};
            let offsetB = ${y.broadcastedIndicesToOffset("outputIndices", f)};
            ${f.setByOffset("global_idx", h(s || $ ? g.getByOffset("offsetA / 4u") : `${g.type.value}(${g.getByOffset("offsetA / 4u")}[offsetA % 4u])`, s || b ? y.getByOffset("offsetB / 4u") : `${y.type.value}(${y.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `;
    } else _ = f.setByOffset("global_idx", h(g.getByOffset("global_idx"), y.getByOffset("global_idx")));
    else {
      if (!n) throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");
      let m = (w, $, b = "") => {
        let x = `aData[indexA${$}][componentA${$}]`, v = `bData[indexB${$}][componentB${$}]`;
        return `
            let outputIndices${$} = ${f.offsetToIndices(`global_idx * 4u + ${$}u`)};
            let offsetA${$} = ${g.broadcastedIndicesToOffset(`outputIndices${$}`, f)};
            let offsetB${$} = ${y.broadcastedIndicesToOffset(`outputIndices${$}`, f)};
            let indexA${$} = offsetA${$} / 4u;
            let indexB${$} = offsetB${$} / 4u;
            let componentA${$} = offsetA${$} % 4u;
            let componentB${$} = offsetB${$} % 4u;
            ${w}[${$}] = ${b}(${c(x, v)});
          `;
      };
      p === 9 ? _ = `
            var data = vec4<u32>(0);
            ${m("data", 0, "u32")}
            ${m("data", 1, "u32")}
            ${m("data", 2, "u32")}
            ${m("data", 3, "u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));` : _ = `
            ${m("outputData[global_idx]", 0)}
            ${m("outputData[global_idx]", 1)}
            ${m("outputData[global_idx]", 2)}
            ${m("outputData[global_idx]", 3)}
          `;
    }
    return `
        ${e.registerUniform("vec_size", "u32").declareVariables(g, y, f)}

        ${d ?? ""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${_}
      }`;
  }, tn = (e, t, i, r, a, n, s = i.dataType) => {
    let o = i.dims.map(Number), u = r.dims.map(Number), l = !k.areEqual(o, u), p = o, d = k.size(o), c = !1, h = !1, f = [l];
    if (l) {
      let g = rt.calcShape(o, u, !1);
      if (!g) throw new Error("Can't perform binary op on the given tensors");
      p = g.slice(), d = k.size(p);
      let y = k.size(o) === 1, _ = k.size(u) === 1, m = o.length > 0 && o[o.length - 1] % 4 === 0, w = u.length > 0 && u[u.length - 1] % 4 === 0;
      f.push(y), f.push(_), f.push(m), f.push(w);
      let $ = 1;
      for (let b = 1; b < p.length; b++) {
        let x = o[o.length - b], v = u[u.length - b];
        if (x === v) $ *= x;
        else break;
      }
      $ % 4 === 0 ? (h = !0, c = !0) : (y || _ || m || w) && (c = !0);
    } else c = !0;
    return f.push(c), { name: e, shaderCache: { hint: t + f.map((g) => g.toString()).join("_"), inputDependencies: ["rank", "rank"] }, getShaderSource: (g) => en(g, o, u, p, c, l, h, a, i.dataType, r.dataType, s, n), getRunData: () => ({ outputs: [{ dims: p, dataType: s }], dispatchGroup: { x: Math.ceil(d / 64 / 4) }, programUniforms: [{ type: 12, data: Math.ceil(k.size(p) / 4) }, ...P(o, u, p)] }) };
  }, Se = (e, t, i, r, a, n) => {
    e.compute(tn(t, a ?? "", e.inputs[0], e.inputs[1], i, r, n));
  }, ul = (e) => {
    Se(e, "Add", (t, i) => `${t}+${i}`);
  }, ll = (e) => {
    Se(e, "Div", (t, i) => `${t}/${i}`);
  }, dl = (e) => {
    Se(e, "Equal", { scalar: (t, i) => `u32(${t}==${i})`, vector: (t, i) => `vec4<u32>(${t}==${i})` }, void 0, void 0, 9);
  }, pl = (e) => {
    Se(e, "Mul", (t, i) => `${t}*${i}`);
  }, cl = (e) => {
    let t = I("input", e.inputs[0].dataType, e.inputs[0].dims).type.value;
    Se(e, "Pow", { scalar: (i, r) => `pow_custom(${i},${r})`, vector: (i, r) => `pow_vector_custom(${i},${r})` }, `
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t === "i32" ? "round" : ""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `);
  }, hl = (e) => {
    Se(e, "Sub", (t, i) => `${t}-${i}`);
  }, fl = (e) => {
    Se(e, "Greater", { scalar: (t, i) => `u32(${t}>${i})`, vector: (t, i) => `vec4<u32>(${t}>${i})` }, void 0, void 0, 9);
  }, ml = (e) => {
    Se(e, "Less", { scalar: (t, i) => `u32(${t}<${i})`, vector: (t, i) => `vec4<u32>(${t}<${i})` }, void 0, void 0, 9);
  }, gl = (e) => {
    Se(e, "GreaterOrEqual", { scalar: (t, i) => `u32(${t}>=${i})`, vector: (t, i) => `vec4<u32>(${t}>=${i})` }, void 0, void 0, 9);
  }, _l = (e) => {
    Se(e, "LessOrEqual", { scalar: (t, i) => `u32(${t}<=${i})`, vector: (t, i) => `vec4<u32>(${t}<=${i})` }, void 0, void 0, 9);
  };
}), rn, an, nn, sn, yl, $l, Bp = z(() => {
  V(), H(), ae(), j(), rn = (e, t) => {
    if (!e || e.length < 1) throw new Error("too few inputs");
    let i = 0, r = e[i], a = r.dataType, n = r.dims.length;
    e.forEach((s, o) => {
      if (o !== i) {
        if (s.dataType !== a) throw new Error("input tensors should be one type");
        if (s.dims.length !== n) throw new Error("input tensors should have the same shape");
        s.dims.forEach((u, l) => {
          if (l !== t && u !== r.dims[l]) throw new Error("non concat dimensions must match");
        });
      }
    });
  }, an = (e, t) => `
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`, nn = (e, t) => {
    let i = e.length, r = [];
    for (let a = 0; a < i; ++a) {
      let n = t.setByOffset("global_idx", e[a].getByIndices("indices"));
      i === 1 ? r.push(n) : a === 0 ? r.push(`if (inputIndex == ${a}u) { ${n} }`) : a === i - 1 ? r.push(`else { ${n} }`) : r.push(`else if (inputIndex == ${a}) { ${n} }`);
    }
    return r.join(`
`);
  }, sn = (e, t, i, r) => {
    let a = k.size(i), n = new Array(e.length), s = new Array(e.length), o = 0, u = [], l = [], p = [{ type: 12, data: a }];
    for (let g = 0; g < e.length; ++g) o += e[g].dims[t], n[g] = o, l.push(e[g].dims.length), s[g] = I(`input${g}`, r, l[g]), u.push("rank"), p.push({ type: 12, data: n[g] });
    for (let g = 0; g < e.length; ++g) p.push(...P(e[g].dims));
    p.push(...P(i));
    let d = A("output", r, i.length), c = d.indicesGet("indices", t), h = Array.from(Array(n.length).keys()).map((g) => `uniforms.sizeInConcatAxis${g}`).join(","), f = (g) => `

  ${(() => {
      g.registerUniform("outputSize", "u32");
      for (let y = 0; y < e.length; y++) g.registerUniform(`sizeInConcatAxis${y}`, "u32");
      return g.declareVariables(...s, d);
    })()}

  ${an(n.length, h)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${d.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${c});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${h});
      ${c} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${nn(s, d)}
  }`;
    return { name: "Concat", shaderCache: { hint: `${t}`, inputDependencies: u }, getRunData: () => ({ outputs: [{ dims: i, dataType: r }], dispatchGroup: { x: Math.ceil(a / 64) }, programUniforms: p }), getShaderSource: f };
  }, yl = (e, t) => {
    let i = e.inputs, r = i[0].dims, a = k.normalizeAxis(t.axis, r.length);
    rn(i, a);
    let n = r.slice();
    n[a] = i.reduce((o, u) => o + (u.dims.length > a ? u.dims[a] : 0), 0);
    let s = i.filter((o) => k.size(o.dims) > 0);
    e.compute(sn(s, a, n, i[0].dataType), { inputs: s });
  }, $l = (e) => Y({ axis: e.axis });
}), Xe, Ze, Qe, Ir, Je = z(() => {
  V(), H(), Xe = (e, t, i = "f32") => {
    switch (e.activation) {
      case "Relu":
        return `value = max(value, ${t}(0.0));`;
      case "Sigmoid":
        return `value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;
      case "Clip":
        return `value = clamp(value, ${t}(${i}(uniforms.clip_min)), ${t}(${i}(uniforms.clip_max)));`;
      case "HardSigmoid":
        return `value = max(${t}(0.0), min(${t}(1.0), ${i}(uniforms.alpha) * value + ${i}(uniforms.beta)));`;
      case "LeakyRelu":
        return `value = select(${i}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;
      case "Tanh":
        return `let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;
      case "":
        return "";
      default:
        throw new Error(`Unsupported activation ${e.activation}`);
    }
  }, Ze = (e, t) => {
    e.activation === "Clip" ? t.push({ type: 1, data: e.clipMax }, { type: 1, data: e.clipMin }) : e.activation === "HardSigmoid" ? t.push({ type: 1, data: e.alpha }, { type: 1, data: e.beta }) : e.activation === "LeakyRelu" && t.push({ type: 1, data: e.alpha });
  }, Qe = (e, t) => {
    e.activation === "Clip" ? t.push({ name: "clip_max", type: "f32" }, { name: "clip_min", type: "f32" }) : e.activation === "HardSigmoid" ? t.push({ name: "alpha", type: "f32" }, { name: "beta", type: "f32" }) : e.activation === "LeakyRelu" && t.push({ name: "alpha", type: "f32" });
  }, Ir = (e) => {
    let t = e?.activation || "";
    if (t === "HardSigmoid") {
      let [i, r] = e?.activation_params || [0.2, 0.5];
      return { activation: t, alpha: i, beta: r };
    } else if (t === "Clip") {
      let [i, r] = e?.activation_params || [Fo, Ho];
      return { activation: t, clipMax: r, clipMin: i };
    } else if (t === "LeakyRelu") {
      let [i] = e?.activation_params || [0.01];
      return { activation: t, alpha: i };
    }
    return { activation: t };
  };
}), le, wl, Tr = z(() => {
  le = (e, t) => {
    switch (e) {
      case 1:
        return t;
      case 2:
        return `vec2<${t}>`;
      case 3:
        return `vec3<${t}>`;
      case 4:
        return `vec4<${t}>`;
      default:
        throw new Error(`${e}-component is not supported.`);
    }
  }, wl = (e) => `
      ${e ? "value = value + getBiasByOutputCoords(coords);" : ""}
      `;
}), bl, Rp = z(() => {
  bl = (e) => `
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`;
}), $t, Er, zr = z(() => {
  V(), H(), j(), Je(), $t = (e, t, i, r, a) => {
    let n = r - i;
    return `
      ${Array.from({ length: i }).map((s, o) => `
      if (${U(t.shape, o, t.rank)} != 1) {
        ${t.indicesSet(e, o, U(a, o + n, r))}
      } else {
        ${t.indicesSet(e, o, 0)}
      }`).join("")}
`;
  }, Er = (e, t, i, r, a = !1, n) => {
    let s = e[0].dims, o = e[1].dims, u = s[s.length - 2], l = o[o.length - 1], p = s[s.length - 1], d = re(l), c = re(p), h = re(u), f = k.size(i) / d / h, g = e.length > 2, y = r ? r.slice(0, -2) : i.slice(0, -2), _ = [k.size(y), u, l], m = [{ type: 12, data: f }, { type: 12, data: u }, { type: 12, data: l }, { type: 12, data: p }];
    Ze(t, m), m.push(...P(y, s, o)), g && m.push(...P(e[2].dims)), m.push(...P(_));
    let w = ($) => {
      let b = vr("batch_dims", e[0].dataType, y.length), x = I("a", e[0].dataType, s.length, c), v = I("b", e[1].dataType, o.length, d), S = A("output", e[0].dataType, _.length, d), T = oe(S.type.tensor), C = Xe(t, S.type.value, T), W = [x, v], B = "";
      if (g) {
        let O = a ? d : 1;
        W.push(I("bias", e[2].dataType, e[2].dims.length, O)), B = `${a ? `value += bias[col / ${O}];` : `value += ${S.type.value}(bias[row + i]);`}`;
      }
      let R = [{ name: "output_size", type: "u32" }, { name: "M", type: "u32" }, { name: "N", type: "u32" }, { name: "K", type: "u32" }];
      Qe(t, R);
      let F = () => {
        let O = `var a_data: ${x.type.value};`;
        for (let M = 0; M < c; M++) O += `
              let b_data${M} = b[(b_offset + (k + ${M}) * uniforms.N + col) / ${d}];`;
        for (let M = 0; M < h; M++) {
          O += `a_data = a[(a_offset + (row + ${M}) * uniforms.K + k) / ${c}];`;
          for (let G = 0; G < c; G++) O += `
            values[${M}] = fma(${v.type.value}(a_data${c === 1 ? "" : `[${G}]`}), b_data${G}, values[${M}]);
`;
        }
        return O;
      };
      return `
  ${$.registerUniforms(R).registerInternalVariables(b).declareVariables(...W, S)}
  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${d})) * ${d};
    var index1 = global_idx / (uniforms.N / ${d});
    let stride1 = uniforms.M / ${h};
    let row = (index1 % stride1) * ${h};
    let batch = index1 / stride1;

    ${i.length === 2 ? "" : `let batch_indices = ${b.offsetToIndices("batch")};`}

    var a_indices: ${x.type.indices};
    ${$t("a_indices", x, x.rank - 2, b.rank, "batch_indices")}
    ${x.indicesSet("a_indices", x.rank - 2, 0)}
    ${x.indicesSet("a_indices", x.rank - 1, 0)}
    let a_offset = ${x.indicesToOffset("a_indices")};

    var b_indices: ${v.type.indices};
    ${$t("b_indices", v, v.rank - 2, b.rank, "batch_indices")}
    ${v.indicesSet("b_indices", v.rank - 2, 0)}
    ${v.indicesSet("b_indices", v.rank - 1, 0)}
    let b_offset = ${v.indicesToOffset("b_indices")};
    var values: array<${S.type.value}, ${h}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${c}) {
      ${F()}
    }
    for (var i = 0u; i < ${h}u; i++) {
      var value = values[i];
      ${B}
      ${C}
      let cur_indices = ${S.type.indices}(batch, row + i, col);
      let offset = ${S.indicesToOffset("cur_indices")};
      ${S.setByOffset(`offset / ${d}`, "value")};
    }
  }
  `;
    };
    return { name: "MatMulNaive", shaderCache: { hint: `${t.activation};${d};${c};${h};${a}`, inputDependencies: g ? ["rank", "rank", "rank"] : ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: n ? n(i) : i, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(f / 64) }, programUniforms: m }), getShaderSource: w };
  };
}), on, un, tr, mi, ln, ir, dn, Lt, Cr = z(() => {
  V(), H(), j(), Je(), zr(), Tr(), on = (e, t) => e ? `
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t ? ", batchIndices" : ""});
        ` : `
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t ? ", batchIndices" : ""});
        `, un = (e, t) => e ? `
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t === 3 ? "" : "let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t === 3 ? "" : "acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }` : `
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t === 3 ? "" : "acc[i] = BCached3 * ACached.w + acc[i];"}
        }`, tr = (e, t, i = "f32", r, a = !1, n = 32, s = !1, o = 32) => {
    let u = t[1] * e[1], l = t[0] * e[0], p = a ? u : n, d = a ? n : u, c = p / t[0], h = n / t[1];
    if (!((a && c === 4 && e[1] === 4 || !a && (c === 3 || c === 4)) && p % t[0] === 0 && n % t[1] === 0 && e[0] === 4)) throw new Error(`If transposeA ${a} is true, innerElementSize ${c} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${c} must be 3 or 4.
  tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);
    return `
var<workgroup> mm_Asub: array<array<vec${c}<${i}>, ${p / c}>, ${d}>;
var<workgroup> mm_Bsub: array<array<vec4<${i}>, ${l / e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${c};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s ? "0" : "i32(globalId.z)"};
  ${r ? `let batchIndices = ${r.offsetToIndices("u32(batch)")};` : ""}
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${s ? `${Math.ceil(o / n)}` : "(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s ? `i32(globalId.z) * ${o}` : "0"};

  var acc: array<vec4<${i}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${h};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${on(a, r)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${r ? ", batchIndices" : ""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${c === 3 ? "" : "let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${un(a, c)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`;
  }, mi = (e, t) => e ? `
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t ? ", batchIndices" : ""});
            ` : `
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t ? ", batchIndices" : ""});
            `, ln = (e) => e ? "let ACached = mm_Asub[k][tileRow + innerRow];" : "let ACached = mm_Asub[tileRow + innerRow][k];", ir = (e, t, i = "f32", r, a = !1, n = 32, s = !1, o = 32, u = !1) => {
    let l = e[1] * t[1], p = e[0] * t[0], d = a ? l : n, c = a ? n : l;
    if (!(c % t[1] === 0 && d % t[0] === 0 && n % t[1] === 0)) throw new Error(`tileAHight ${c} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);
    let h = c / t[1], f = d / t[0], g = n / t[1], y = u ? `
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${p};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${c}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
          ${mi(a, r)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${r ? ", batchIndices" : ""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${i}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a ? `mm_Asub[k][localRow + innerRow * ${t[1]}];` : `mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    ` : `
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${h};
let tileColA = i32(localId.x) * ${f};
let tileRowB = i32(localId.y) * ${g};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${f}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${mi(a, r)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${r ? ", batchIndices" : ""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${i}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${ln(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;
    return `
  var<workgroup> mm_Asub : array<array<${i}, ${d}>, ${c}>;
  var<workgroup> mm_Bsub : array<array<${i}, ${p}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s ? "0" : "i32(globalId.z)"};
    ${r ? `let batchIndices = ${r.offsetToIndices("u32(batch)")};` : ""}
    let num_tiles = ${s ? `${Math.ceil(o / n)}` : "(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s ? `i32(globalId.z) * ${o}` : "0"};

    var acc : array<array<${i}, colPerThread>, rowPerThread>;
    ${y}
  }
`;
  }, dn = (e, t, i, r, a = !1) => {
    let [n, s, o, u] = r, l = oe(r[0].type.tensor);
    return `
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${le(e, l)} {
      var value = ${le(e, l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${$t("aIndices", s, s.rank - 2, n.rank, "batchIndices")}
        ${s.indicesSet("aIndices", s.rank - 2, "u32(row)")}
        ${s.indicesSet("aIndices", s.rank - 1, "u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${le(e, l)} {
      var value = ${le(e, l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${$t("bIndices", o, o.rank - 2, n.rank, "batchIndices")}
        ${o.indicesSet("bIndices", o.rank - 2, "u32(row)")}
        ${o.indicesSet("bIndices", o.rank - 1, "u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${le(e, l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t ? `value = value + ${a ? "bias[colIn]" : `${le(e, l)}(bias[row])`};` : ""}
        ${i}
        ${u.setByIndices("vec3<u32>(coords)", "value")}
      }
    }
    `;
  }, Lt = (e, t, i, r, a = !1, n) => {
    let s = e[0].dims, o = e[1].dims, u = s.slice(0, -2), l = o.slice(0, -2), p = r ? r.slice(0, -2) : i.slice(0, -2), d = k.size(p), c = s[s.length - 2], h = s[s.length - 1], f = o[o.length - 1], g = h % 4 === 0 && f % 4 === 0, y = c <= 8 ? [4, 1, 1] : [4, 4, 1], _ = [8, 8, 1], m = [Math.ceil(f / _[0] / y[0]), Math.ceil(c / _[1] / y[1]), Math.ceil(d / _[2] / y[2])], w = g ? 4 : 1, $ = [...u, c, h / w], b = $.length, x = [...l, h, f / w], v = x.length, S = [d, c, f / w], T = [{ type: 6, data: c }, { type: 6, data: f }, { type: 6, data: h }];
    Ze(t, T), T.push(...P(p, $, x));
    let C = ["rank", "rank"], W = e.length > 2;
    W && (T.push(...P(e[2].dims)), C.push("rank")), T.push(...P(S));
    let B = (R) => {
      let F = p.length, O = vr("batchDims", e[0].dataType, F, 1), M = oe(e[0].dataType), G = I("a", e[0].dataType, b, w), K = I("b", e[1].dataType, v, w), L = A("result", e[0].dataType, S.length, w), X = [G, K];
      if (W) {
        let de = a ? w : 1;
        X.push(I("bias", e[2].dataType, e[2].dims.length, de));
      }
      let E = [{ name: "dim_a_outer", type: "i32" }, { name: "dim_b_outer", type: "i32" }, { name: "dim_inner", type: "i32" }];
      Qe(t, E);
      let q = oe(L.type.tensor), N = Xe(t, L.type.value, q), D = dn(w, W, N, [O, G, K, L], a);
      return `
  ${R.registerUniforms(E).registerInternalVariables(O).declareVariables(...X, L)}
  ${D}
  ${g ? tr(y, _, M, O) : ir(y, _, M, O)}
                   `;
    };
    return { name: "MatMul", shaderCache: { hint: `${y};${t.activation};${g};${a}`, inputDependencies: C }, getRunData: () => ({ outputs: [{ dims: n ? n(i) : i, dataType: e[0].dataType }], dispatchGroup: { x: m[0], y: m[1], z: m[2] }, programUniforms: T }), getShaderSource: B };
  };
}), pn, vl, Ap = z(() => {
  V(), Re(), j(), Je(), Tr(), Rp(), Cr(), pn = (e, t, i, r, a = !1, n, s = 4, o = 4, u = 4, l = "f32") => {
    let p = (T) => {
      switch (T) {
        case 1:
          return "resData = x[xIndex];";
        case 3:
          return `resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;
        case 4:
          return "resData = x[xIndex / 4];";
        default:
          throw new Error(`innerElementSize ${T} is not supported.`);
      }
    }, d = (T) => {
      switch (T) {
        case 1:
          return "return w[row * i32(uniforms.w_shape[3]) + colIn];";
        case 4:
          return "return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";
        default:
          throw new Error(`innerElementSize ${T} is not supported.`);
      }
    }, c = e ? `
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    ` : `
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `, h = e ? `
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    ` : `
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `, f = e ? "i32(uniforms.x_shape[1])" : "i32(uniforms.x_shape[2])", g = e ? "i32(uniforms.x_shape[2])" : "i32(uniforms.x_shape[3])", y = e ? "row" : "col", _ = e ? "col" : "row", m = `
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e ? "i32(uniforms.result_shape[2])" : "i32(uniforms.result_shape[3])"};
    let outRow = ${y} / outWidth;
    let outCol = ${y} % outWidth;

    let WRow = ${_} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${_} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${_} % inChannels;
    var resData = ${le(s, l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${f} && xCol >= 0 && xCol < ${g}) {
      ${c}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${p(s)}
    }
    return resData;`, w = e ? t && r ? `
    let col = colIn * ${s};
    ${m}` : `
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${m}
    }
    return ${le(s, l)}(0.0);` : r && i ? `
    let col = colIn * ${s};
    ${m}` : `
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m}
    }
    return ${le(s, l)}(0.0);`, $ = e ? r && i ? d(o) : `
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${d(o)}
    }
    return ${le(o, l)}(0.0);` : `
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${d(o)}
    }
    return ${le(o, l)}(0.0);`, b = le(u, l), x = le(e ? s : o, l), v = le(e ? o : s, l), S = Xe(n, b, l);
    return `
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${x} {
      ${e ? w : $}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${v} {
      ${e ? $ : w}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${b}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e ? "i32(uniforms.result_shape[2])" : "i32(uniforms.result_shape[3])"};
      ${h}
      ${wl(a)}
      ${S}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`;
  }, vl = (e, t, i, r, a, n, s, o, u) => {
    let l = t.format === "NHWC", p = l ? e[0].dims[3] : e[0].dims[1], d = i[0], c = l ? i[2] : i[3], h = l ? i[1] : i[2], f = l ? i[3] : i[1], g = l && (p % 4 === 0 || p % 3 === 0) && f % 4 === 0, y = l ? f : c * h, _ = l ? c * h : f, m = [8, 8, 1], w = r <= 8 ? [4, 1, 1] : [4, 4, 1], $ = [Math.ceil(y / m[0] / w[0]), Math.ceil(_ / m[1] / w[1]), Math.ceil(d / m[2] / w[2])];
    Z("verbose", () => `[conv2d_mm_webgpu] dispatch = ${$}`);
    let b = g ? l && p % 4 !== 0 ? 3 : 4 : 1, x = m[1] * w[1], v = m[0] * w[0], S = Math.max(m[0] * b, m[1]), T = r % x === 0, C = a % v === 0, W = n % S === 0, B = g ? [b, 4, 4] : [1, 1, 1], R = [{ type: 6, data: r }, { type: 6, data: a }, { type: 6, data: n }, { type: 6, data: [t.pads[0], t.pads[1]] }, { type: 6, data: t.strides }, { type: 6, data: t.dilations }];
    Ze(t, R), R.push(...P(e[0].dims, e[1].dims));
    let F = ["rank", "rank"];
    s && (R.push(...P(e[2].dims)), F.push("rank")), R.push(...P(i));
    let O = (M) => {
      let G = [{ name: "dim_a_outer", type: "i32" }, { name: "dim_b_outer", type: "i32" }, { name: "dim_inner", type: "i32" }, { name: "pad", type: "i32", length: 2 }, { name: "stride", type: "i32", length: 2 }, { name: "dilation", type: "i32", length: 2 }];
      Qe(t, G);
      let K = g ? 4 : 1, L = oe(e[0].dataType), X = `
      fn setOutputAtIndex(flatIndex : i32, value : ${g ? `vec4<${L}>` : L}) {
        result[flatIndex] = ${g ? `vec4<${L}>` : L}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${g ? `vec4<${L}>` : L}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${g ? "/ 4" : ""}, value);
      }`, E = I("x", e[0].dataType, e[0].dims.length, b === 3 ? 1 : b), q = I("w", e[1].dataType, e[1].dims.length, K), N = [E, q], D = A("result", e[0].dataType, i.length, K);
      if (s) {
        let de = I("bias", e[2].dataType, e[2].dims.length, K);
        N.push(de), X += `
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${g ? `vec4<${L}>` : L} {
          return bias[coords.${l ? "w" : "y"}${g ? "/ 4" : ""}];
        }`;
      }
      return `
        ${bl("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${M.registerUniforms(G).declareVariables(...N, D)}
        ${X}
        ${pn(l, T, C, W, s, t, B[0], B[1], B[2], L)}
        ${g ? tr(w, m, L, void 0, !l, S) : ir(w, m, L, void 0, !l, S, !1, void 0, o)}`;
    };
    return { name: "Conv2DMatMul", shaderCache: { hint: `${t.cacheKey};${b};${g};${T};${C};${W};${x};${v};${S}`, inputDependencies: F }, getRunData: () => ({ outputs: [{ dims: u ? u(i) : i, dataType: e[0].dataType }], dispatchGroup: { x: $[0], y: $[1], z: $[2] }, programUniforms: R }), getShaderSource: O };
  };
}), cn, gi, lt, hn, _i, fn, xl, kl, Mp = z(() => {
  V(), Re(), H(), j(), Je(), Tr(), cn = (e) => {
    let t = 1;
    for (let i = 0; i < e.length; i++) t *= e[i];
    return t;
  }, gi = (e) => typeof e == "number" ? [e, e, e] : e, lt = (e, t) => t <= 1 ? e : e + (e - 1) * (t - 1), hn = (e, t, i, r = 1) => {
    let a = lt(t, r);
    return Math.floor((e[0] * (i - 1) - i + a) / 2);
  }, _i = (e, t, i, r, a) => {
    a == null && (a = hn(e, t[0], r[0]));
    let n = [0, 0, 0, i];
    for (let s = 0; s < 3; s++) e[s] + 2 * a >= t[s] && (n[s] = Math.trunc((e[s] - t[s] + 2 * a) / r[s] + 1));
    return n;
  }, fn = (e, t, i, r, a, n, s, o, u, l) => {
    let p, d, c, h;
    if (e === "VALID" && (e = 0), typeof e == "number") {
      p = { top: e, bottom: e, left: e, right: e, front: e, back: e };
      let f = _i([t, i, r, 1], [o, u, l], 1, [a, n, s], e);
      d = f[0], c = f[1], h = f[2];
    } else if (Array.isArray(e)) {
      if (!e.every((g, y, _) => g === _[0])) throw Error(`Unsupported padding parameter: ${e}`);
      p = { top: e[0], bottom: e[1], left: e[2], right: e[3], front: e[4], back: e[5] };
      let f = _i([t, i, r, 1], [o, u, l], 1, [a, n, s], e[0]);
      d = f[0], c = f[1], h = f[2];
    } else if (e === "SAME_UPPER") {
      d = Math.ceil(t / a), c = Math.ceil(i / n), h = Math.ceil(r / s);
      let f = (d - 1) * a + o - t, g = (c - 1) * n + u - i, y = (h - 1) * s + l - r, _ = Math.floor(f / 2), m = f - _, w = Math.floor(g / 2), $ = g - w, b = Math.floor(y / 2), x = y - b;
      p = { top: w, bottom: $, left: b, right: x, front: _, back: m };
    } else throw Error(`Unknown padding parameter: ${e}`);
    return { padInfo: p, outDepth: d, outHeight: c, outWidth: h };
  }, xl = (e, t, i, r, a, n = !1, s = "channelsLast") => {
    let o, u, l, p, d;
    if (s === "channelsLast") [o, u, l, p, d] = e;
    else if (s === "channelsFirst") [o, d, u, l, p] = e;
    else throw new Error(`Unknown dataFormat ${s}`);
    let [c, , h, f, g] = t, [y, _, m] = gi(i), [w, $, b] = gi(r), x = lt(h, w), v = lt(f, $), S = lt(g, b), { padInfo: T, outDepth: C, outHeight: W, outWidth: B } = fn(a, u, l, p, y, _, m, x, v, S), R = n ? c * d : c, F = [0, 0, 0, 0, 0];
    return s === "channelsFirst" ? F = [o, R, C, W, B] : s === "channelsLast" && (F = [o, C, W, B, R]), { batchSize: o, dataFormat: s, inDepth: u, inHeight: l, inWidth: p, inChannels: d, outDepth: C, outHeight: W, outWidth: B, outChannels: R, padInfo: T, strideDepth: y, strideHeight: _, strideWidth: m, filterDepth: h, filterHeight: f, filterWidth: g, effectiveFilterDepth: x, effectiveFilterHeight: v, effectiveFilterWidth: S, dilationDepth: w, dilationHeight: $, dilationWidth: b, inShape: e, outShape: F, filterShape: t };
  }, kl = (e, t, i, r, a, n) => {
    let s = n === "channelsLast";
    s ? e[0].dims[3] : e[0].dims[1];
    let o = [64, 1, 1], u = { x: i.map((y, _) => _) }, l = [Math.ceil(cn(u.x.map((y) => i[y])) / o[0]), 1, 1];
    Z("verbose", () => `[conv3d_naive_webgpu] dispatch = ${l}`);
    let p = 1, d = k.size(i), c = [{ type: 12, data: d }, { type: 12, data: r }, { type: 12, data: a }, { type: 12, data: t.strides }, { type: 12, data: t.dilations }];
    Ze(t, c), c.push(...P(e[0].dims, e[1].dims));
    let h = ["rank", "rank"], f = e.length === 3;
    f && (c.push(...P(e[2].dims)), h.push("rank")), c.push(...P(i));
    let g = (y) => {
      let _ = [{ name: "output_size", type: "u32" }, { name: "filter_dims", type: "u32", length: r.length }, { name: "pads", type: "u32", length: a.length }, { name: "strides", type: "u32", length: t.strides.length }, { name: "dilations", type: "u32", length: t.dilations.length }];
      Qe(t, _);
      let m = 1, w = oe(e[0].dataType), $ = I("x", e[0].dataType, e[0].dims.length, p), b = I("W", e[1].dataType, e[1].dims.length, m), x = [$, b], v = A("result", e[0].dataType, i.length, m), S = "";
      if (f) {
        let W = I("bias", e[2].dataType, e[2].dims.length, m);
        x.push(W), S += `
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${w} {
          return bias[${s ? U("coords", 4, 5) : U("coords", 1, 5)}];
        }`;
      }
      let T = le(p, w), C = Xe(t, T, w);
      return `
            ${S}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${$.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${b.getByIndices("aIndices")};
            }
          ${y.registerUniforms(_).declareVariables(...x, v)}
          ${y.mainStart()}
          ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${v.offsetToIndices("global_idx")};
              let batch = ${U("coords", 0, $.rank)};
              let d2 = ${s ? U("coords", $.rank - 1, $.rank) : U("coords", 1, $.rank)};
              let xFRCCorner = vec3<u32>(${s ? U("coords", 1, $.rank) : U("coords", 2, $.rank)},
              ${s ? U("coords", 2, $.rank) : U("coords", 3, $.rank)},
              ${s ? U("coords", 3, $.rank) : U("coords", 4, $.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s ? U("uniforms.x_shape", 1, $.rank) : U("uniforms.x_shape", 2, $.rank)};
              let xShapeZ = ${s ? U("uniforms.x_shape", 2, $.rank) : U("uniforms.x_shape", 3, $.rank)};
              let xShapeW = ${s ? U("uniforms.x_shape", 3, $.rank) : U("uniforms.x_shape", 4, $.rank)};
              let xShapeU = ${s ? U("uniforms.x_shape", 4, $.rank) : U("uniforms.x_shape", 1, $.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s ? `let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            ` : `let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s ? `value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);` : `value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s ? `let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      ` : `let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s ? `let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      ` : `let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${f ? "value = value + getBiasByOutputCoords(coords)" : ""};
              ${C}
              result[global_idx] = f32(value);
          }`;
    };
    return { name: "Conv3DNaive", shaderCache: { hint: `${t.cacheKey};${s};${p};${f}`, inputDependencies: h }, getRunData: () => ({ outputs: [{ dims: i, dataType: e[0].dataType }], dispatchGroup: { x: l[0], y: l[1], z: l[2] }, programUniforms: c }), getShaderSource: g };
  };
}), Sl, Il, Dp = z(() => {
  V(), H(), j(), Je(), Sl = (e, t, i, r) => {
    let a = e.length > 2, n = a ? "value += b[output_channel];" : "", s = e[0].dims, o = e[1].dims, u = t.format === "NHWC", l = u ? i[3] : i[1], p = l / t.group, d = u && p >= 4 ? re(l) : 1, c = k.size(i) / d, h = [{ type: 12, data: c }, { type: 12, data: t.dilations }, { type: 12, data: [t.strides[0], t.strides[1]] }, { type: 12, data: [t.pads[0], t.pads[1]] }, { type: 12, data: p }];
    Ze(t, h), h.push(...P(s, [o[0], o[1], o[2], o[3] / d]));
    let f = a ? ["rank", "rank", "rank"] : ["rank", "rank"];
    h.push(...P([i[0], i[1], i[2], i[3] / d]));
    let g = (y) => {
      let _ = A("output", e[0].dataType, i.length, d), m = oe(_.type.tensor), w = Xe(t, _.type.value, m), $ = I("x", e[0].dataType, s.length), b = I("w", e[1].dataType, o.length, d), x = [$, b];
      a && x.push(I("b", e[2].dataType, e[2].dims, d));
      let v = [{ name: "output_size", type: "u32" }, { name: "dilations", type: "u32", length: t.dilations.length }, { name: "strides", type: "u32", length: 2 }, { name: "pads", type: "u32", length: 2 }, { name: "output_channels_per_group", type: "u32" }];
      Qe(t, v);
      let S = u ? `
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${$.get("batch", "xHeight", "xWidth", "input_channel")};
            let wVal = ${b.get("wHeight", "wWidth", "wInChannel", "output_channel")};
            value += xVal * wVal;
          }
        }
      }
      ` : `
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${$.get("batch", "input_channel", "xHeight", "xWidth")};
            let wVal = ${b.get("output_channel", "wInChannel", "wHeight", "wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;
      return `
  ${y.registerUniforms(v).declareVariables(...x, _)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${_.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u ? 3 : 1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u ? 1 : 2}], outputIndices[${u ? 2 : 3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${d} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u ? 2 : 1}];

    var value: ${_.type.value} = ${_.type.value}(0);
    ${S}
    ${n}
    ${w}
    ${_.setByOffset("global_idx", "value")}
  }`;
    };
    return { name: "GroupedConv", shaderCache: { hint: `${t.cacheKey}_${d}`, inputDependencies: f }, getRunData: () => ({ outputs: [{ dims: r ? r(i) : i, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: h }), getShaderSource: g };
  }, Il = (e, t, i, r) => {
    let a = e.length > 2, n = re(i[3]), s = re(i[2]), o = k.size(i) / n / s, u = [e[0].dims[0], e[0].dims[1], e[0].dims[2], e[0].dims[3] / n], l = [e[1].dims[0], e[1].dims[1], e[1].dims[2], e[1].dims[3] / n], p = [i[0], i[1], i[2], i[3] / n], d = [{ type: 12, data: o }, { type: 6, data: [t.strides[0], t.strides[1]] }, { type: 6, data: [t.pads[0], t.pads[1]] }];
    Ze(t, d), d.push(...P(u, l, p));
    let c = (s - 1) * t.strides[1] + l[1], h = (f) => {
      let g = A("output", e[0].dataType, p.length, n), y = oe(g.type.tensor), _ = Xe(t, g.type.value, y), m = I("x", e[0].dataType, u.length, n), w = I("w", e[1].dataType, l.length, n), $ = [m, w];
      a && $.push(I("b", e[2].dataType, e[2].dims, n));
      let b = a ? "value += b[output_channel];" : "", x = [{ name: "output_size", type: "u32" }, { name: "strides", type: "i32", length: 2 }, { name: "pads", type: "i32", length: 2 }];
      return Qe(t, x), `
  ${f.registerUniforms(x).declareVariables(...$, g)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${m.type.value}, ${c}>;
    var values: array<${g.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${c}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${m.get("batch", "u32(x_height)", "u32(x_width)", "input_channel")};
          } else {
            x_vals[i] = ${m.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${w.get("w_height", "w_width", "0", "output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${b}
      ${_}
      ${g.set("batch", "row", "col + i", "output_channel", "value")};
    }
  }`;
    };
    return { name: "GroupedConv-Vectorize", shaderCache: { hint: `${t.cacheKey};${n};${s};${c};${l[0]};${l[1]}`, inputDependencies: a ? ["rank", "rank", "type"] : ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: r ? r(i) : i, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(o / 64) }, programUniforms: d }), getShaderSource: h };
  };
}), mn, zt, gn, Ct, rr, yi, _n, yn, ar, Up = z(() => {
  H(), Ap(), Mp(), Cr(), Dp(), Je(), zr(), Pe(), mn = (e, t, i, r, a, n) => {
    let s = e[0], o = e.slice(n ? 1 : 2, n ? 3 : 4), u = o.length, l = t[0], p = t.slice(2).map((c, h) => c + (c - 1) * (i[h] - 1)), d = o.map((c, h) => c + r[h] + r[h + u]).map((c, h) => Math.floor((c - p[h] + a[h]) / a[h]));
    return d.splice(0, 0, s), d.splice(n ? 3 : 1, 0, l), d;
  }, zt = [2, 3, 1, 0], gn = (e, t) => {
    if (!e || e.length !== 2 && e.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
    if (e[0].dims.length > 5) throw new Error("greater than 5D is not supported");
    if (e[0].dims.length !== e[1].dims.length) throw new Error("filter does not have same dimension as input");
    let i = e[0].dims[t.format === "NHWC" ? e[0].dims.length - 1 : 1], r = e[1].dims[1] * t.group;
    if (i !== r) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
    if (e.length === 3 && (e[2].dims.length !== 1 || e[1].dims[0] !== e[2].dims[0])) throw new Error("invalid bias");
    let a = e[0].dims.length - 2;
    if (t.dilations.length !== a) throw new Error(`dilations should be ${a}D`);
    if (t.strides.length !== a) throw new Error(`strides should be ${a}D`);
    if (t.pads.length !== a * 2) throw new Error(`pads should be ${a * 2}D`);
    if (t.kernelShape.length !== 0 && t.kernelShape.length !== e[1].dims.length - 2) throw new Error("invalid kernel shape");
  }, Ct = (e, t) => {
    let i = e.kernelShape.slice();
    i.length < t[1].dims.length - 2 && i.push(...Array(t[1].dims.length - 2 - i.length).fill(0));
    for (let n = 2; n < t[1].dims.length; ++n) i[n - 2] === 0 && (i[n - 2] = t[1].dims[n]);
    let r = e.pads.slice();
    qt.adjustPadsBasedOnAutoPad(t[0].dims, e.strides, e.dilations, i, r, e.format === "NHWC", e.autoPad);
    let a = Object.assign({}, e);
    return Object.assign(a, { kernelShape: i, pads: r }), a;
  }, rr = (e) => {
    let t = Ir(e), i = e.format, r = ["NOTSET", "VALID", "SAME_UPPER", "SAME_LOWER"][e.auto_pad], a = e.dilations, n = e.group, s = e.kernel_shape, o = e.pads, u = e.strides, l = e.w_is_const();
    return { autoPad: r, format: i, dilations: a, group: n, kernelShape: s, pads: o, strides: u, wIsConst: l, ...t, cacheKey: `${e.format};${t.activation};` };
  }, yi = (e, t, i, r) => {
    let a = i.format === "NHWC", n = mn(t[0].dims, t[1].dims, i.dilations, i.pads, i.strides, a);
    if (i.group !== 1) {
      let x = [t[0]];
      if (a) {
        let v = e.kernelCustomData.wT ?? e.compute(_e(t[1], zt), { inputs: [1], outputs: [i.wIsConst ? -2 : -1] })[0];
        i.wIsConst && !e.kernelCustomData.wT && (e.kernelCustomData.wT = v), x.push(v);
      } else x.push(t[1]);
      t.length === 3 && x.push(t[2]), !e.adapterInfo.isArchitecture("ampere") && a && t[1].dims[0] === i.group && t[1].dims[1] === 1 && i.dilations[0] === 1 && i.dilations[1] === 1 ? e.compute(Il(x, i, n, r), { inputs: x }) : e.compute(Sl(x, i, n, r), { inputs: x });
      return;
    }
    let s = t.length === 3, o = t[0].dims[a ? 1 : 2], u = t[0].dims[a ? 2 : 3], l = t[0].dims[a ? 3 : 1], p = t[1].dims[2], d = t[1].dims[3], c = n[a ? 1 : 2], h = n[a ? 2 : 3], f = n[a ? 3 : 1], g = a && p === o && d === u && i.pads[0] === 0 && i.pads[1] === 0;
    if (g || p === 1 && d === 1 && i.dilations[0] === 1 && i.dilations[1] === 1 && i.strides[0] === 1 && i.strides[1] === 1 && i.pads[0] === 0 && i.pads[1] === 0) {
      let x = n[0], v, S, T, C = [];
      if (a) {
        let R = e.kernelCustomData.wT ?? e.compute(_e(t[1], zt), { inputs: [1], outputs: [i.wIsConst ? -2 : -1] })[0];
        if (i.wIsConst && !e.kernelCustomData.wT && (e.kernelCustomData.wT = R), g) {
          let F = o * u * l;
          v = t[0].reshape([1, x, F]), S = R.reshape([1, F, f]), T = [1, x, f];
        } else v = t[0].reshape([x, o * u, l]), S = R.reshape([1, l, f]), T = [x, c * h, f];
        C.push(v), C.push(S);
      } else v = t[0].reshape([x, l, o * u]), S = t[1].reshape([1, f, l]), T = [x, f, c * h], C.push(S), C.push(v);
      s && C.push(t[2]);
      let W = T[2], B = C[0].dims[C[0].dims.length - 1];
      W < 8 && B < 8 ? e.compute(Er(C, i, n, T, a, r), { inputs: C }) : e.compute(Lt(C, i, n, T, a, r), { inputs: C });
      return;
    }
    let y = !0, _ = e.kernelCustomData.wT ?? e.compute(_e(t[1], zt), { inputs: [1], outputs: [i.wIsConst ? -2 : -1] })[0];
    i.wIsConst && !e.kernelCustomData.wT && (e.kernelCustomData.wT = _);
    let m = [t[0], _];
    s && m.push(t[2]);
    let w = a ? c * h : f, $ = a ? f : c * h, b = p * d * l;
    e.compute(vl(m, i, n, w, $, b, s, y, r), { inputs: m });
  }, _n = (e, t) => {
    let i = t.format === "NHWC", r = [e.inputs[0].reshape(i ? [e.inputs[0].dims[0], 1, e.inputs[0].dims[1], e.inputs[0].dims[2]] : [e.inputs[0].dims[0], e.inputs[0].dims[1], 1, e.inputs[0].dims[2]]), e.inputs[1].reshape([e.inputs[1].dims[0], e.inputs[1].dims[1], 1, e.inputs[1].dims[2]])];
    e.inputs.length === 3 && r.push(e.inputs[2]);
    let a = [0, t.pads[0], 0, t.pads[1]], n = [1].concat(t.strides), s = [1].concat(t.dilations), o = [1].concat(t.kernelShape), u = Ct({ ...t, pads: a, strides: n, dilations: s, kernelShape: o }, r);
    yi(e, r, u, (l) => i ? [l[0], l[2], l[3]] : [l[0], l[1], l[3]]);
  }, yn = (e, t, i) => {
    let r = i.format === "NHWC" ? "channelsLast" : "channelsFirst", a = Ct(i, t), n = i.autoPad === "NOTSET" ? i.pads : i.autoPad, s = xl(t[0].dims, t[1].dims, i.strides, i.dilations, n, !1, r);
    e.compute(kl(t, a, s.outShape, [s.filterDepth, s.filterHeight, s.filterWidth], [s.padInfo.front, s.padInfo.top, s.padInfo.left], r));
  }, ar = (e, t) => {
    if (gn(e.inputs, t), e.inputs[0].dims.length === 3) _n(e, t);
    else if (e.inputs[0].dims.length === 5) yn(e, e.inputs, t);
    else {
      let i = Ct(t, e.inputs);
      yi(e, e.inputs, i);
    }
  };
}), Tl, Pp = z(() => {
  V(), Re(), H(), j(), Tl = (e, t, i) => {
    let r = e.length > 2, a = t.outputShape, n = t.format === "NHWC", s = t.group, o = e[1].dims, u = o[2] / s, l = o[3], p = n ? re(u) : 1, d = n && l === 1 && u >= 4, c = d ? Math.floor(u / 4) * 4 : Math.floor(u / p) * p, h = u - c, f = n ? re(l) : 1, g = n ? l === 1 ? p : f : 1, y = k.size(a) / f, _ = [Math.ceil(y / 64), 1, 1];
    Z("verbose", () => `[conv2d_backprop_webgpu] dispatch = ${_}`);
    let m = ["rank", "rank"], w = [t.strides[0], t.strides[1]], $ = [t.kernelShape[n ? 1 : 2], t.kernelShape[n ? 2 : 3]], b = [t.dilations[0], t.dilations[1]], x = [$[0] + (t.dilations[0] <= 1 ? 0 : (t.kernelShape[n ? 1 : 2] - 1) * (t.dilations[0] - 1)), $[1] + (t.dilations[1] <= 1 ? 0 : (t.kernelShape[n ? 2 : 3] - 1) * (t.dilations[1] - 1))], v = [x[0] - 1 - Math.floor((t.pads[0] + t.pads[2]) / 2), x[1] - 1 - Math.floor((t.pads[1] + t.pads[3]) / 2)], S = [{ type: 12, data: y }, { type: 12, data: w }, { type: 12, data: $ }, { type: 12, data: b }, { type: 12, data: x }, { type: 6, data: v }, { type: 12, data: c }, { type: 12, data: u }, { type: 12, data: l }, ...P(e[0].dims, e[1].dims)];
    r && (S.push(...P(e[2].dims)), m.push("rank")), S.push(...P(a));
    let T = (C) => {
      let W = [{ name: "output_size", type: "u32" }, { name: "strides", type: "u32", length: w.length }, { name: "filter_dims", type: "u32", length: $.length }, { name: "dilations", type: "u32", length: $.length }, { name: "effective_filter_dims", type: "u32", length: x.length }, { name: "pads", type: "i32", length: v.length }, { name: "input_channels_per_group_int", type: "u32" }, { name: "input_channels_per_group", type: "u32" }, { name: "output_channels_per_group", type: "u32" }], B = oe(e[0].dataType), R = n ? 1 : 2, F = n ? 2 : 3, O = n ? 3 : 1, M = I("W", e[1].dataType, e[1].dims.length, g), G = I("Dy", e[0].dataType, e[0].dims.length, p), K = [G, M];
      r && K.push(I("bias", e[2].dataType, [a[O]].length, f));
      let L = A("result", e[0].dataType, a.length, f), X = () => {
        let N = "";
        if (d) p === 4 ? N += `
        let xValue = ${G.getByOffset("x_offset")};
        let wValue = ${M.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;` : p === 2 ? N += `
          dotProd = dotProd + dot(vec4<${B}>(${G.getByOffset("x_offset")}, ${G.getByOffset("x_offset + 1u")}), vec4<${B}>(${M.getByOffset("w_offset")}, ${M.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;` : p === 1 && (N += `
          dotProd = dotProd + dot(vec4<${B}>(${G.getByOffset("x_offset")}, ${G.getByOffset("x_offset + 1u")}, ${G.getByOffset("x_offset + 2u")}, ${G.getByOffset("x_offset + 3u")}), vec4<${B}>(${M.getByOffset("w_offset")}, ${M.getByOffset("w_offset + 1u")}, ${M.getByOffset("w_offset + 2u")}, ${M.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);
        else if (N += `
                  let xValue = ${n ? G.getByOffset(`${G.indicesToOffset(`${G.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p}`) : G.get("batch", "inputChannel", "idyR", "idyC")};
        `, p === 1) N += `
          let w_offset = ${M.indicesToOffset(`${M.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${M.getByOffset(`w_offset / ${g}`)};
          dotProd = dotProd + xValue * wValue;`;
        else for (let D = 0; D < p; D++) N += `
            let wValue${D} = ${M.getByOffset(`${M.indicesToOffset(`${M.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${D}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${D}] * wValue${D};`;
        return N;
      }, E = () => {
        if (h === 0) return "";
        if (!d) throw new Error(`packInputAs4 ${d} is not true.`);
        let N = "";
        if (p === 1) {
          N += "dotProd = dotProd";
          for (let D = 0; D < h; D++) N += `
            + ${G.getByOffset(`x_offset + ${D}`)} * ${M.getByOffset(`w_offset + ${D}`)}`;
          N += ";";
        } else if (p === 2) {
          if (h !== 2) throw new Error(`Invalid inputChannelsRemainder ${h}.`);
          N += `
          let xValue = ${G.getByOffset("x_offset")};
          let wValue = ${M.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`;
        }
        return N;
      }, q = `
            let outputIndices = ${L.offsetToIndices(`global_idx * ${f}`)};
            let batch = ${L.indicesGet("outputIndices", 0)};
            let d1 = ${L.indicesGet("outputIndices", O)};
            let r = ${L.indicesGet("outputIndices", R)};
            let c = ${L.indicesGet("outputIndices", F)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${L.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${B}(dyRCorner) + ${B}(wR)) / ${B}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${B}(uniforms.Dy_shape[${R}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${B}(dyCCorner) + ${B}(wC)) / ${B}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${B}(uniforms.Dy_shape[${F}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${d ? `
                var x_offset = ${G.indicesToOffset(`${G.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p};
                var w_offset = ${M.indicesToOffset(`${M.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${g};
                  ` : ""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${d ? 4 : p}) {
                  ${X()}
                  inputChannel = inputChannel + ${d ? 4 : p};
                }
                ${E()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${r ? ` + bias[d1 / ${f}]` : ""};
            ${L.setByOffset("global_idx", "value")};
          `;
      return `
    ${C.registerUniforms(W).declareVariables(...K, L)}
      ${C.mainStart()}
      ${C.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${q}}`;
    };
    return { name: "ConvTranspose2D", shaderCache: { hint: `${t.cacheKey};${p}${g}${f}${d}${h}`, inputDependencies: m }, getRunData: () => ({ dispatchGroup: { x: _[0], y: _[1], z: _[2] }, outputs: [{ dims: i ? i(a) : a, dataType: e[0].dataType }], programUniforms: S }), getShaderSource: T };
  };
}), $n, wn, bn, $i, El, vn, wi, xn, zl, Np = z(() => {
  Pp(), Je(), Pe(), $n = (e, t, i, r, a, n) => (e - 1) * t + i + (r - 1) * a + 1 - n, wn = (e, t, i, r, a) => {
    let n = Math.floor(e / 2);
    t === "SAME_UPPER" ? (i[r] = n, i[a] = e - n) : t === "SAME_LOWER" && (i[r] = e - n, i[a] = n);
  }, bn = (e, t, i, r, a, n, s, o, u, l) => {
    let p = e.length - 2, d = l.length === 0;
    u.length < p && u.push(...Array(p - u.length).fill(0));
    let c = e[0], h = t[o ? 3 : 1] * a;
    for (let f = 0, g = e.length - p - (o ? 1 : 0); f < p; ++f, ++g) {
      let y = e[g], _ = d ? y * s[f] : l[f], m = $n(y, s[f], n[f], t[g], i[f], _);
      wn(m, r, n, f, f + p), d && l.push(s[f] * (y - 1) + u[f] + (t[g] - 1) * i[f] + 1 - n[f] - n[f + p]);
    }
    l.splice(0, 0, c), l.splice(o ? 3 : 1, 0, h);
  }, $i = (e, t) => {
    let i = e.kernelShape.slice();
    if (e.kernelShape.length === 0 || e.kernelShape.reduce((d, c) => d * c, 1) === 0) {
      i.length = 0;
      for (let d = 2; d < t[1].dims.length; ++d) i.push(t[1].dims[d]);
    }
    let r = e.format === "NHWC";
    i.splice(0, 0, t[1].dims[0]), i.splice(r ? 3 : 1, 0, t[1].dims[1]);
    let a = e.pads.slice(), n = e.outputShape.slice(), s = e.outputPadding.slice(), o = t[0].dims, u = e.dilations.slice();
    if (u.reduce((d, c) => d + c, 0) === 0) {
      let d = t[0].dims.length - 2;
      u = new Array(d).fill(1);
    }
    let l = e.strides.slice();
    if (l.reduce((d, c) => d + c, 0) === 0) {
      let d = t[0].dims.length - 2;
      l = new Array(d).fill(1);
    }
    bn(o, i, u, e.autoPad, e.group, a, l, r, s, n);
    let p = Object.assign({}, e);
    return Object.assign(p, { kernelShape: i, pads: a, outputPadding: s, outputShape: n, dilations: u, strides: l }), p;
  }, El = (e) => {
    let t = Ir(e), i = e.format, r = ["NOTSET", "VALID", "SAME_UPPER", "SAME_LOWER"][typeof e.autoPad > "u" ? 0 : e.autoPad], a = e.dilations, n = e.group ?? 1, s = e.kernelShape, o = e.pads, u = e.strides, l = e.wIsConst(), p = e.outputPadding, d = e.outputShape;
    return { autoPad: r, format: i, dilations: a, group: n, kernelShape: s, outputPadding: p, outputShape: d, pads: o, strides: u, wIsConst: l, ...t, cacheKey: `${e.format};${t.activation};` };
  }, vn = (e, t) => {
    if (!e || e.length !== 2 && e.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
    if (e[0].dims.length !== 4 && e[0].dims.length !== 3) throw new Error("currently only support 2-dimensional conv");
    if (e[0].dims.length !== e[1].dims.length) throw new Error("filter does not have same dimension as input");
    let i = e[0].dims[t.format === "NHWC" ? e[0].dims.length - 1 : 1], r = e[1].dims[0];
    if (i !== r) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
    let a = e[1].dims[1] * t.group;
    if (e.length === 3 && (e[2].dims.length !== 1 || e[2].dims[0] !== a)) throw new Error("invalid bias");
    let n = e[0].dims.length - 2;
    if (t.dilations.reduce((s, o) => s + o, 0) > 0 && t.dilations.length !== n) throw new Error(`dilations should be ${n}D`);
    if (t.strides.reduce((s, o) => s + o, 0) > 0 && t.strides.length !== n) throw new Error(`strides should be ${n}D`);
    if (t.pads.reduce((s, o) => s + o, 0) > 0 && t.pads.length !== n * 2) throw new Error(`pads should be ${n * 2}D`);
    if (t.outputPadding.length !== n && t.outputPadding.length !== 0) throw new Error(`output_padding should be ${n}D`);
    if (t.kernelShape.reduce((s, o) => s + o, 0) > 0 && t.kernelShape.length !== 0 && t.kernelShape.length !== e[1].dims.length - 2) throw new Error("invalid kernel shape");
    if (t.outputShape.length !== 0 && t.outputShape.length !== e[0].dims.length - 2) throw new Error("invalid output shape");
  }, wi = (e, t, i, r) => {
    let a = e.kernelCustomData.wT ?? e.compute(_e(t[1], [2, 3, 0, 1]), { inputs: [1], outputs: [i.wIsConst ? -2 : -1] })[0];
    i.wIsConst && !e.kernelCustomData.wT && (e.kernelCustomData.wT = a);
    let n = [t[0], a];
    t.length === 3 && n.push(t[2]), e.compute(Tl(n, i, r), { inputs: n });
  }, xn = (e, t) => {
    let i = t.format === "NHWC", r = [e.inputs[0].reshape(i ? [e.inputs[0].dims[0], 1, e.inputs[0].dims[1], e.inputs[0].dims[2]] : [e.inputs[0].dims[0], e.inputs[0].dims[1], 1, e.inputs[0].dims[2]]), e.inputs[1].reshape([e.inputs[1].dims[0], e.inputs[1].dims[1], 1, e.inputs[1].dims[2]])];
    e.inputs.length === 3 && r.push(e.inputs[2]);
    let a = t.kernelShape;
    (a.length === 0 || a[0] === 0) && (a = [e.inputs[1].dims[2]]);
    let n = t.dilations;
    (n.length === 0 || n[0] === 0) && (n = [1]);
    let s = t.strides;
    (s.length === 0 || s[0] === 0) && (s = [1]);
    let o = t.pads;
    o.length === 0 && (o = [0, 0]), o = [0, o[0], 0, o[1]], s = [1].concat(s), n = [1].concat(n), a = [1].concat(a);
    let u = t.outputPadding;
    u = [0].concat(u);
    let l = $i({ ...t, pads: o, strides: s, dilations: n, kernelShape: a, outputPadding: u }, r);
    wi(e, r, l, (p) => i ? [p[0], p[2], p[3]] : [p[0], p[1], p[3]]);
  }, zl = (e, t) => {
    if (vn(e.inputs, t), e.inputs[0].dims.length === 3) xn(e, t);
    else {
      let i = $i(t, e.inputs);
      wi(e, e.inputs, i);
    }
  };
}), kn, Cl, Ol, qp = z(() => {
  V(), H(), ae(), j(), kn = (e, t, i, r) => {
    let a = k.size(t), n = t.length, s = I("input", e, n), o = A("output", e, n), u = i.dataType === 6 ? i.getInt32Array()[0] : Number(i.getBigInt64Array()[0]), l = k.normalizeAxis(u, n), p = (d) => {
      let c = ` i32(${s.indicesGet("inputIndices", "uniforms.axis")}) `, h = U("uniforms.input_shape", "uniforms.axis", n), f = r.reverse ? c + (r.exclusive ? " + 1" : "") : "0", g = r.reverse ? h : c + (r.exclusive ? "" : " + 1");
      return `
                ${d.registerUniform("outputSize", "u32").registerUniform("axis", "u32").declareVariables(s, o)}
                ${d.mainStart()}
                  ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${f};
                  let last : i32 = ${g};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices", "uniforms.axis", "u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx", "sum")};
                }`;
    };
    return { name: "CumSum", shaderCache: { hint: r.cacheKey, inputDependencies: ["rank"] }, getRunData: () => ({ outputs: [{ dims: t, dataType: e }], dispatchGroup: { x: Math.ceil(a / 64) }, programUniforms: [{ type: 12, data: a }, { type: 12, data: l }, ...P(t, t)] }), getShaderSource: p };
  }, Cl = (e, t) => {
    let i = e.inputs[0].dims, r = e.inputs[0].dataType, a = e.inputs[1];
    e.compute(kn(r, i, a, t), { inputs: [0] });
  }, Ol = (e) => {
    let t = e.exclusive === 1, i = e.reverse === 1;
    return Y({ exclusive: t, reverse: i });
  };
}), Sn, In, Tn, Bl, Rl, Vp = z(() => {
  V(), H(), ae(), j(), Sn = (e) => {
    if (!e || e.length !== 1) throw new Error("DepthToSpace requires 1 input.");
    if (e[0].dims.length !== 4) throw new Error("DepthToSpace requires 4D input.");
  }, In = (e, t, i, r) => {
    let a = [];
    a.push(`fn perm(i: ${r.type.indices}) -> ${i.type.indices} {
    var a: ${i.type.indices};`);
    for (let n = 0; n < t; ++n) a.push(i.indicesSet("a", e[n], `i[${n}]`));
    return a.push("return a;}"), a.join(`
`);
  }, Tn = (e, t) => {
    let i, r, a, n, s, o, u = t.format === "NHWC", l = t.blocksize, p = t.mode === "DCR";
    u ? ([i, r, a, n] = e.dims, s = p ? [i, r, a, l, l, n / l ** 2] : [i, r, a, n / l ** 2, l, l], o = p ? [0, 1, 3, 2, 4, 5] : [0, 1, 4, 2, 5, 3]) : ([i, r, a, n] = [e.dims[0], e.dims[2], e.dims[3], e.dims[1]], s = p ? [i, l, l, n / l ** 2, r, a] : [i, n / l ** 2, l, l, r, a], o = p ? [0, 3, 4, 1, 5, 2] : [0, 1, 4, 2, 5, 3]);
    let d = e.reshape(s), c = d.dims.length, h = e.dataType, f = I("a", h, c), g = A("output", h, c), y = (_) => `
  ${_.registerUniform("output_size", "u32").declareVariables(f, g)}

  ${In(o, c, f, g)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${g.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${g.setByOffset("global_idx", f.getByIndices("aIndices"))}
  }`;
    return { name: "DepthToSpace", shaderCache: { hint: `${e.dims};${t.blocksize};${t.mode}`, inputDependencies: ["rank"] }, getRunData: (_) => {
      let m = u ? [i, r * l, a * l, n / l ** 2] : [i, n / l ** 2, r * l, a * l], w = k.size(m), $ = d.dims, b = k.sortBasedOnPerm($, o);
      return { outputs: [{ dims: m, dataType: _[0].dataType }], dispatchGroup: { x: Math.ceil(w / 64) }, programUniforms: [{ type: 12, data: w }, ...P($, b)] };
    }, getShaderSource: y };
  }, Bl = (e, t) => {
    Sn(e.inputs), e.compute(Tn(e.inputs[0], t));
  }, Rl = (e) => Y({ blocksize: e.blocksize, mode: e.mode, format: e.format });
}), Ot, dt, bi, En, zn, Cn, On, vi, Bn, Al, Ml, Lp = z(() => {
  V(), H(), ae(), j(), Ot = "[a-zA-Z]|\\.\\.\\.", dt = "(" + Ot + ")+", bi = "^" + dt + "$", En = "(" + dt + ",)*" + dt, zn = "^" + En + "$", Cn = class {
    constructor(e = -1) {
      this.symbolToIndices = /* @__PURE__ */ new Map(), this.inputIndex = e;
    }
    addSymbol(e, t) {
      let i = this.symbolToIndices.get(e);
      i === void 0 ? i = [t] : i.push(t), this.symbolToIndices.set(e, i);
    }
  }, On = class {
    constructor(e, t) {
      this.equation = t, this.hasEllipsis = !1, this.symbolToInfo = /* @__PURE__ */ new Map(), this.lhs = new Array(), this.outputDims = [];
      let [i, r] = t.includes("->") ? t.split("->", 2) : [t, ""];
      if (!i.match(RegExp(zn))) throw new Error("Invalid LHS term");
      if (i.split(",").forEach((a, n) => {
        let s = e[n].dims.slice();
        if (!a.match(RegExp(bi))) throw new Error("Invalid LHS term");
        let o = this.processTerm(a, !0, s, n);
        this.lhs.push(o);
      }), r === "") r += [...this.symbolToInfo.entries()].filter(([a, n]) => n.count === 1 || a === "...").map(([a]) => a).join("");
      else if (!r.match(RegExp(dt))) throw new Error("Invalid RHS");
      r.match(RegExp(Ot, "g"))?.forEach((a) => {
        if (a === "...") this.outputDims = this.outputDims.concat(this.ellipsisDims);
        else {
          let n = this.symbolToInfo.get(a);
          if (n === void 0) throw new Error("Invalid RHS symbol");
          this.outputDims.push(n.dimValue);
        }
      }), this.rhs = this.processTerm(r, !1, this.outputDims);
    }
    addSymbol(e, t, i) {
      let r = this.symbolToInfo.get(e);
      if (r !== void 0) {
        if (r.dimValue !== t && r.count !== 1) throw new Error("Dimension mismatch");
        r.count++, r.inputIndices.push(i);
      } else r = { count: 1, dimValue: t, inputIndices: [i] };
      this.symbolToInfo.set(e, r);
    }
    processTerm(e, t, i, r = -1) {
      let a = i.length, n = !1, s = [], o = 0;
      if (!e.match(RegExp(bi)) && !t && e !== "") throw new Error("Invalid LHS term");
      let u = e.match(RegExp(Ot, "g")), l = new Cn(r);
      return u?.forEach((p, d) => {
        if (p === "...") {
          if (n) throw new Error("Only one ellipsis is allowed per input term");
          n = !0;
          let c = a - u.length + 1;
          if (c < 0) throw new Error("Ellipsis out of bounds");
          if (s = i.slice(o, o + c), this.hasEllipsis) {
            if (this.ellipsisDims.length !== s.length || this.ellipsisDims.toString() !== s.toString()) throw new Error("Ellipsis dimensions mismatch");
          } else if (t) this.hasEllipsis = !0, this.ellipsisDims = s;
          else throw new Error("Ellipsis must be specified in the LHS");
          for (let h = 0; h < s.length; h++) {
            let f = String.fromCharCode(48 + h);
            l.addSymbol(f, d + h), this.addSymbol(f, i[o++], r);
          }
        } else l.addSymbol(p, d + (this.hasEllipsis ? this.ellipsisDims.length - 1 : 0)), this.addSymbol(p, i[o++], r);
      }), l;
    }
  }, vi = (e) => e + "_max", Bn = (e, t, i, r) => {
    let a = e.map((l) => l.length).map((l, p) => I(`input${p}`, t, l)), n = k.size(r), s = A("output", t, r.length), o = [...i.symbolToInfo.keys()].filter((l) => !i.rhs.symbolToIndices.has(l)), u = (l) => {
      let p = [], d = "var prod = 1.0;", c = "var sum = 0.0;", h = "sum += prod;", f = [], g = [], y = [], _ = [], m = i.symbolToInfo.size === i.rhs.symbolToIndices.size;
      i.symbolToInfo.forEach(($, b) => {
        if (i.rhs.symbolToIndices.has(b)) {
          let x = i.rhs.symbolToIndices.get(b)?.[0];
          x !== void 0 && i.lhs.forEach((v, S) => {
            if ($.inputIndices.includes(S)) {
              let T = v.symbolToIndices.get(b);
              if (T === void 0) throw new Error("Invalid symbol error");
              T.forEach((C) => {
                p.push(`${a[S].indicesSet(`input${S}Indices`, C, s.indicesGet("outputIndices", x))}`);
              });
            }
          });
        } else i.lhs.forEach((x, v) => {
          if ($.inputIndices.includes(v)) {
            let S = x.symbolToIndices.get(b);
            if (S === void 0) throw new Error("Invalid symbol error");
            S.forEach((T) => {
              f.push(`${a[v].indicesSet(`input${v}Indices`, T, `${b}`)}`);
            }), _.push(`prod *= ${a[v].getByIndices(`input${v}Indices`)};`);
          }
        }), g.push(`for(var ${b}: u32 = 0; ${b} < uniforms.${vi(b)}; ${b}++) {`), y.push("}");
      });
      let w = m ? [...p, `let sum = ${a.map(($, b) => $.getByIndices(`input${b}Indices`)).join(" * ")};`] : [...p, c, ...g, ...f, d, ..._, h, ...y];
      return `
            ${l.registerUniforms(o.map(($) => ({ name: `${vi($)}`, type: "u32" }))).registerUniform("outputSize", "u32").declareVariables(...a, s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map(($, b) => `var input${b}Indices: ${a[b].type.indices};`).join(`
`)}
            ${w.join(`
`)};
            ${s.setByOffset("global_idx", "sum")};
          }`;
    };
    return { name: "Einsum", shaderCache: { hint: i.equation, inputDependencies: e.map(() => "rank") }, getRunData: () => {
      let l = o.filter((d) => i.symbolToInfo.has(d)).map((d) => ({ type: 12, data: i.symbolToInfo.get(d)?.dimValue || 0 }));
      l.push({ type: 12, data: n });
      let p = e.map((d, c) => [...P(d)]).reduce((d, c) => d.concat(c), l);
      return p.push(...P(r)), { outputs: [{ dims: r, dataType: t }], dispatchGroup: { x: Math.ceil(n / 64) }, programUniforms: p };
    }, getShaderSource: u };
  }, Al = (e, t) => {
    let i = new On(e.inputs, t.equation), r = i.outputDims, a = e.inputs.map((n, s) => n.dims);
    e.compute(Bn(a, e.inputs[0].dataType, i, r));
  }, Ml = (e) => {
    let t = e.equation.replace(/\s+/g, "");
    return Y({ equation: t });
  };
}), Rn, xi, An, Mn, Dl, Wp = z(() => {
  V(), H(), j(), Rn = (e) => {
    if (!e || e.length !== 2) throw new Error("Expand requires 2 input.");
    let t = e[0].dims, i = Array.from(e[1].getBigInt64Array(), Number), r = i.length < t.length ? 0 : i.length - t.length, a = t.length < i.length ? 0 : t.length - i.length;
    for (; r < i.length && a < t.length; ++r, ++a) if (i[r] !== t[a] && i[r] !== 1 && t[a] !== 1) throw new Error("Expand requires shape to be broadcastable to input");
  }, xi = (e, t) => {
    let i = e.length - t.length, r = [];
    for (let a = 0; a < i; ++a) r.push(e[a]);
    for (let a = 0; a < t.length; ++a) r.push(t[a] === 1 ? e[a + i] : t[a]);
    return r;
  }, An = (e, t) => e.length > t.length ? xi(e, t) : xi(t, e), Mn = (e) => {
    let t = e[0].dims, i = Array.from(e[1].getBigInt64Array(), Number), r = An(t, i), a = e[0].dataType, n = a === 9 || k.size(t) === 1, s = a === 9 || t.length > 0 && t[t.length - 1] % 4 === 0 ? 4 : 1, o = n || r.length > 0 && r[r.length - 1] % 4 === 0 ? 4 : 1, u = Math.ceil(k.size(r) / o), l = (d) => {
      let c = I("input", a, t.length, s), h = A("output", a, r.length, o), f;
      if (a === 9) {
        let g = (y, _, m = "") => `
          let outputIndices${_} = ${h.offsetToIndices(`outputOffset + ${_}u`)};
          let offset${_} = ${c.broadcastedIndicesToOffset(`outputIndices${_}`, h)};
          let index${_} = offset${_} / 4u;
          let component${_} = offset${_} % 4u;
          ${y}[${_}] = ${m}(${c.getByOffset(`index${_}`)}[component${_}]);
        `;
        f = `
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${g("data", 0, "u32")}
        ${g("data", 1, "u32")}
        ${g("data", 2, "u32")}
        ${g("data", 3, "u32")}
        ${h.setByOffset("global_idx", "data")}
      }`;
      } else f = `
        let outputIndices = ${h.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${c.broadcastedIndicesToOffset("outputIndices", h)};
        let data = ${h.type.value}(${c.getByOffset(`inputOffset / ${s}`)});
        ${h.setByOffset("global_idx", "data")}
      }`;
      return `
    ${d.registerUniform("vec_size", "u32").declareVariables(c, h)}
    ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${f}`;
    }, p = [{ type: 12, data: u }, ...P(t, r)];
    return { name: "Expand", shaderCache: { hint: `${r.length};${s}${o}`, inputDependencies: ["rank"] }, getShaderSource: l, getRunData: () => ({ outputs: [{ dims: r, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(u / 64) }, programUniforms: p }) };
  }, Dl = (e) => {
    Rn(e.inputs), e.compute(Mn(e.inputs), { inputs: [0] });
  };
}), Dn, Ul, Gp = z(() => {
  V(), H(), j(), Sr(), Dn = (e) => {
    let t = e[0].dataType, i = k.size(e[0].dims), r = k.size(e[1].dims), a = r % 4 === 0, n = (s) => {
      let o = I("x", t, [1], 4), u = I("bias", t, [1], 4), l = A("y", t, [1], 4), p = [{ name: "output_vec_size", type: "u32" }, { name: "bias_size", type: "u32" }], d = (h) => `
      let bias${h}_offset: u32 = (global_idx * 4 + ${h}) % uniforms.bias_size;
      let bias${h} = ${u.getByOffset(`bias${h}_offset / 4`)}[bias${h}_offset % 4];`, c = a ? `
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};` : `${d(0)}${d(1)}${d(2)}${d(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;
      return `${s.registerUniforms(p).declareVariables(o, u, l)}

    ${Ji(pe(t))}

    ${s.mainStart(at)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${c}
      let x_in = x + bias;
      ${l.setByOffset("global_idx", er("x_in"))}
    }`;
    };
    return { name: "FastGeluWithBias", shaderCache: { hint: `${a}`, inputDependencies: ["type", "type"] }, getShaderSource: n, getRunData: (s) => ({ outputs: [{ dims: s[0].dims, dataType: s[0].dataType }], programUniforms: [{ type: 12, data: Math.ceil(i / 4) }, { type: 12, data: r }], dispatchGroup: { x: Math.ceil(i / at / 4) } }) };
  }, Ul = (e) => {
    e.inputs.length < 2 || k.size(e.inputs[1].dims) === 0 ? rl(e) : e.compute(Dn(e.inputs));
  };
}), Un, Pn, Pl, Nl, Fp = z(() => {
  V(), H(), ae(), j(), Un = (e) => {
    if (!e || e.length !== 2) throw new Error("Gather requires 2 inputs.");
  }, Pn = (e, t) => {
    let i = e[0].dims, r = e[1].dims, a = i.length, n = k.normalizeAxis(t.axis, a), s = i.slice(0);
    s.splice(n, 1, ...r);
    let o = i[n], u = e[0].dataType === 9 ? 4 : 1, l = Math.ceil(k.size(s) / u), p = [{ type: 12, data: l }, { type: 6, data: o }, { type: 12, data: n }, ...P(e[0].dims, e[1].dims, s)], d = (c) => {
      let h = I("data", e[0].dataType, e[0].dims.length, u), f = I("inputIndices", e[1].dataType, e[1].dims.length), g = A("output", e[0].dataType, s.length, u), y = (m) => {
        let w = r.length, $ = `var indicesIndices${m}  = ${f.type.indices}(0);`;
        for (let b = 0; b < w; b++) $ += `${w > 1 ? `indicesIndices${m}[${b}]` : `indicesIndices${m}`} = ${s.length > 1 ? `outputIndices${m}[uniforms.axis + ${b}]` : `outputIndices${m}`};`;
        $ += `
          var idx${m} = ${f.getByIndices(`indicesIndices${m}`)};
          if (idx${m} < 0) {
            idx${m} = idx${m} + uniforms.axisDimLimit;
          }
          var dataIndices${m} : ${h.type.indices};
        `;
        for (let b = 0, x = 0; b < a; b++) b === n ? ($ += `${a > 1 ? `dataIndices${m}[${b}]` : `dataIndices${m}`} = u32(idx${m});`, x += w) : ($ += `${a > 1 ? `dataIndices${m}[${b}]` : `dataIndices${m}`} = ${s.length > 1 ? `outputIndices${m}[${x}]` : `outputIndices${m}`};`, x++);
        return $;
      }, _;
      if (e[0].dataType === 9) {
        let m = (w, $, b = "") => `
          let outputIndices${$} = ${g.offsetToIndices(`outputOffset + ${$}u`)};
          ${y($)};
          let offset${$} = ${h.indicesToOffset(`dataIndices${$}`)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${w}[${$}] = ${b}(${h.getByOffset(`index${$}`)}[component${$}]);
        `;
        _ = `
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${m("value", 0, "u32")}
        ${m("value", 1, "u32")}
        ${m("value", 2, "u32")}
        ${m("value", 3, "u32")}
        ${g.setByOffset("global_idx", "value")}
      `;
      } else _ = `
      let outputIndices = ${g.offsetToIndices("global_idx")};
      ${y("")};
      let value = ${h.getByIndices("dataIndices")};
      ${g.setByOffset("global_idx", "value")};
      `;
      return `
      ${c.registerUniform("outputSize", "u32").registerUniform("axisDimLimit", "i32").registerUniform("axis", "u32").declareVariables(h, f, g)}
      ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${_}
      }`;
    };
    return { name: "Gather", shaderCache: { hint: t.cacheKey, inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: s, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(l / 64) }, programUniforms: p }), getShaderSource: d };
  }, Pl = (e) => Y({ axis: e.axis }), Nl = (e, t) => {
    let i = e.inputs;
    Un(i), e.compute(Pn(e.inputs, t));
  };
}), Nn, ql, Vl, Hp = z(() => {
  V(), H(), j(), Nn = (e, t, i, r, a, n, s, o, u) => {
    let l = [{ type: 12, data: n }, { type: 12, data: r }, { type: 12, data: a }, { type: 12, data: i }, { type: 12, data: s }, { type: 12, data: o }, { type: 12, data: u }], p = [n];
    l.push(...P(t.dims, p));
    let d = (c) => {
      let h = I("indices_data", t.dataType, t.dims.length), f = A("input_slice_offsets_data", 12, 1, 1), g = [h, f], y = [{ name: "output_size", type: "u32" }, { name: "batch_dims", type: "u32" }, { name: "input_dims", type: "u32", length: a.length }, { name: "sizes_from_slice_dims_data", type: "u32", length: i.length }, { name: "num_slices_per_batch", type: "u32" }, { name: "input_batch_stride", type: "u32" }, { name: "num_slice_dims", type: "u32" }];
      return `
  ${c.registerUniforms(y).declareVariables(...g)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length === 1 ? "index += i32(uniforms.input_dims);" : "index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${i.length === 1 ? "relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);" : "relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`;
    };
    return e.compute({ name: "computeSliceOffsets", shaderCache: { hint: `${a.length}_${i.length}`, inputDependencies: ["rank"] }, getRunData: () => ({ outputs: [{ dims: p, dataType: e.inputs[1].dataType }], dispatchGroup: { x: Math.ceil(n / 64) }, programUniforms: l }), getShaderSource: d }, { inputs: [t], outputs: [-1] })[0];
  }, ql = (e, t) => {
    let i = e.inputs, r = i[0].dims, a = i[0].dataType, n = i[1].dims, s = n[n.length - 1], o = k.sizeToDimension(n, n.length - 1), u = k.sizeFromDimension(r, t.batchDims + s), l = k.sizeToDimension(r, t.batchDims), p = k.sizeFromDimension(r, t.batchDims), d = o / l, c = new Array(s), h = u;
    for (let $ = 0; $ < s; ++$) c[s - 1 - $] = h, h *= r[t.batchDims + s - 1 - $];
    let f = Nn(e, i[1], c, t.batchDims, r, o, d, p, s), g = t.batchDims + s;
    if (g > r.length) throw new Error("last dimension of indices must not be larger than rank of input tensor");
    let y = n.slice(0, -1).concat(r.slice(g)), _ = k.size(y), m = [{ type: 12, data: _ }, { type: 12, data: u }, ...P(i[0].dims, f.dims, y)], w = ($) => {
      let b = I("data", i[0].dataType, i[0].dims.length), x = I("slice_offsets", 12, f.dims.length), v = A("output", i[0].dataType, y.length);
      return `
          ${$.registerUniform("output_size", "u32").registerUniform("slice_size", "u32").declareVariables(b, x, v)}
            ${$.mainStart()}
            ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`;
    };
    e.compute({ name: "GatherND", shaderCache: { hint: t.cacheKey, inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: y, dataType: a }], dispatchGroup: { x: Math.ceil(_ / 64) }, programUniforms: m }), getShaderSource: w }, { inputs: [i[0], f] });
  }, Vl = (e) => ({ batchDims: e.batch_dims, cacheKey: "" });
}), qn, Vn, Ll, Wl, Kp = z(() => {
  V(), H(), ae(), j(), qn = (e, t) => {
    if (e.length < 3 || e.length > 4) throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");
    let i = k.normalizeAxis(t.quantizeAxis, e[0].dims.length), r = t.blockSize, a = e[0], n = e[2], s = e.length === 4 ? e[3] : void 0;
    if (n.dims.length !== a.dims.length || !a.dims.map((o, u) => u === i ? Math.ceil(o / r) === n.dims[u] : o === n.dims[u]).reduce((o, u) => o && u, !0)) throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");
    if (s) {
      if (s.dataType !== a.dataType) throw new Error("Zero point must have the same data type as the input tensor.");
      if (s.dims.length !== n.dims.length || !s.dims.map((o, u) => o === n.dims[u]).reduce((o, u) => o && u, !0)) throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.");
    }
  }, Vn = (e, t) => {
    let i = e[0].dims, r = e[1].dims, a = i.length, n = k.normalizeAxis(t.gatherAxis, a), s = k.normalizeAxis(t.quantizeAxis, a), o = i.slice(0);
    o.splice(n, 1, ...r);
    let u = k.size(o), l = e[2].dataType, p = e[0].dataType === 22, d = [{ type: 12, data: u }, { type: 12, data: s }, { type: 12, data: n }, { type: 12, data: t.blockSize }, ...P(...e.map((h, f) => h.dims), o)], c = (h) => {
      let f = I("data", e[0].dataType, e[0].dims.length), g = I("inputIndices", e[1].dataType, e[1].dims.length), y = I("scales", e[2].dataType, e[2].dims.length), _ = e.length > 3 ? I("zeroPoint", e[3].dataType, e[3].dims.length) : void 0, m = A("output", l, o.length), w = [f, g, y];
      _ && w.push(_);
      let $ = [{ name: "output_size", type: "u32" }, { name: "quantize_axis", type: "u32" }, { name: "gather_axis", type: "u32" }, { name: "block_size", type: "u32" }];
      return `
        ${h.registerUniforms($).declareVariables(...w, m)}
        ${h.mainStart()}
        let output_indices = ${m.offsetToIndices("global_idx")};
        var indices_indices = ${g.type.indices}(0);
        ${r.length > 1 ? `
          for (var i: u32 = 0; i < ${r.length}; i++) {
            let index = ${m.indicesGet("output_indices", "uniforms.gather_axis + i")};
            ${g.indicesSet("indices_indices", "i", "index")};
          }` : `indices_indices = ${m.indicesGet("output_indices", "uniforms.gather_axis")};`};
        var data_indices = ${f.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${m.indicesGet("output_indices", "i")};
          ${f.indicesSet("data_indices", "i", "index")};
        }
        var index_from_indices = ${g.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${i[n]};
        }
        ${f.indicesSet("data_indices", "uniforms.gather_axis", "u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${m.indicesGet("output_indices", `i + ${r.length} - 1`)};
          ${f.indicesSet("data_indices", "i", "index")};
        }
        let data_offset = ${f.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${f.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${p ? "unpack4xI8" : "unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${y.indicesGet("data_indices", "uniforms.quantize_axis")} / uniforms.block_size;
        ${y.indicesSet("scale_indices", "uniforms.quantize_axis", "quantize_axis_index")};
        var scale = ${y.getByIndices("scale_indices")};
        ${_ ? `
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${_.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${_.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${p ? "unpack4xI8" : "unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];` : "var zero_point = 0"};
        let dequantized_data = ${pe(l)}(quantized_data - zero_point) * scale;
        ${m.setByOffset("global_idx", "dequantized_data")};
    }`;
    };
    return { name: "GatherBlockQuantized", shaderCache: { hint: `${t.cacheKey};${e.filter((h, f) => f !== 1).map((h) => h.dims.join("_")).join(";")}`, inputDependencies: Array.from({ length: e.length }, (h, f) => "rank") }, getRunData: () => ({ outputs: [{ dims: o, dataType: l }], dispatchGroup: { x: Math.ceil(u / 64) }, programUniforms: d }), getShaderSource: c };
  }, Ll = (e, t) => {
    let i = e.inputs;
    qn(i, t), e.compute(Vn(e.inputs, t));
  }, Wl = (e) => Y({ blockSize: e.blockSize, gatherAxis: e.gatherAxis, quantizeAxis: e.quantizeAxis });
}), Ln, Wn, Gl, Fl, jp = z(() => {
  V(), H(), ae(), j(), Ln = (e) => {
    if (!e || e.length !== 2) throw new Error("GatherElements requires 2 inputs.");
    if (e[0].dims.length < 1) throw new Error("GatherElements requires that the data input be rank >= 1.");
    if (e[0].dims.length !== e[1].dims.length) throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`);
  }, Wn = (e, t) => {
    let i = e[0].dims, r = e[0].dataType, a = i.length, n = e[1].dims, s = e[1].dataType, o = k.normalizeAxis(t.axis, a), u = i[o], l = n.slice(0), p = k.size(l), d = I("input", r, a), c = I("indicesInput", s, n.length), h = A("output", r, l.length), f = [{ type: 12, data: p }, { type: 6, data: u }, { type: 12, data: o }];
    return f.push(...P(i, n, l)), { name: "GatherElements", shaderCache: { inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: l, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(p / 64) }, programUniforms: f }), getShaderSource: (g) => `
      ${g.registerUniform("outputSize", "u32").registerUniform("axisDimLimit", "i32").registerUniform("axis", "u32").declareVariables(d, c, h)}
      ${g.mainStart()}
      ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${h.offsetToIndices("global_idx")};

      var idx = ${c.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${d.type.indices}(outputIndices);
      ${d.indicesSet("inputIndices", "uniforms.axis", "u32(idx)")};
      let value = ${d.getByIndices("inputIndices")};

      ${h.setByOffset("global_idx", "value")};
  }` };
  }, Gl = (e) => Y({ axis: e.axis }), Fl = (e, t) => {
    let i = e.inputs;
    Ln(i), e.compute(Wn(e.inputs, t));
  };
}), Gn, Fn, Hl, Kl, Xp = z(() => {
  V(), H(), j(), Gn = (e) => {
    if (!e) throw new Error("Input is missing");
    if (e.length < 2 || e.length > 3) throw new Error("Invaid input number.");
    if (e.length === 3 && e[2].dims.length > 2) throw new Error("Invalid input shape of C");
    if (e[0].dataType !== e[1].dataType || e.length === 3 && e[0].dataType !== e[2].dataType) throw new Error("Input types are mismatched");
  }, Fn = (e, t) => {
    let i = e[0].dims.slice(), r = e[1].dims.slice(), [a, n, s] = Go.getShapeOfGemmResult(i, t.transA, r, t.transB, e.length === 3 ? e[2].dims : void 0), o = [a, n];
    if (!o) throw new Error("Can't use gemm on the given tensors");
    let u = 16, l = Math.ceil(n / u), p = Math.ceil(a / u), d = !0, c = k.size(o), h = [{ type: 12, data: d ? l : c }, { type: 12, data: a }, { type: 12, data: n }, { type: 12, data: s }, { type: 1, data: t.alpha }, { type: 1, data: t.beta }], f = ["type", "type"];
    e.length === 3 && (h.push(...P(e[2].dims)), f.push("rank")), h.push(...P(o));
    let g = (_) => {
      let m = "";
      t.transA && t.transB ? m = "value += a[k * uniforms.M + m] * b[n * uniforms.K + k];" : t.transA && !t.transB ? m = "value += a[k * uniforms.M + m] * b[k * uniforms.N + n];" : !t.transA && t.transB ? m = "value += a[m * uniforms.K + k] * b[n * uniforms.K + k];" : !t.transA && !t.transB && (m = "value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");
      let w = t.alpha === 1 ? "" : "value *= uniforms.alpha;", $ = I("a", e[0].dataType, e[0].dims), b = I("b", e[1].dataType, e[1].dims), x = $.type.value, v = null, S = [$, b];
      e.length === 3 && (v = I("c", e[2].dataType, e[2].dims.length), S.push(v));
      let T = A("output", e[0].dataType, o.length);
      S.push(T);
      let C = [{ name: "output_size", type: "u32" }, { name: "M", type: "u32" }, { name: "N", type: "u32" }, { name: "K", type: "u32" }, { name: "alpha", type: "f32" }, { name: "beta", type: "f32" }];
      return `
  ${_.registerUniforms(C).declareVariables(...S)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${x}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${m}
    }

    ${w}
    ${v != null ? `let cOffset = ${v.broadcastedIndicesToOffset("vec2(m, n)", T)}; value += ${x}(uniforms.beta) * ${v.getByOffset("cOffset")};` : ""}
    output[global_idx] = value;
  }`;
    }, y = (_) => {
      let m = I("a", e[0].dataType, e[0].dims), w = I("b", e[1].dataType, e[1].dims), $ = null, b = [m, w];
      e.length === 3 && ($ = I("c", e[2].dataType, e[2].dims.length), b.push($));
      let x = A("output", e[0].dataType, o.length);
      b.push(x);
      let v = [{ name: "num_tile_n", type: "u32" }, { name: "M", type: "u32" }, { name: "N", type: "u32" }, { name: "K", type: "u32" }, { name: "alpha", type: "f32" }, { name: "beta", type: "f32" }], S = "", T = "";
      t.transA && t.transB ? (T = `
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${m.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${w.type.value}(0);
      }
      `, S = "value += tile_a[k][local_id.y] * tile_b[local_id.x][k];") : t.transA && !t.transB ? (T = `
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${m.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${w.type.value}(0);
      }
      `, S = "value += tile_a[k][local_id.y] * tile_b[k][local_id.x];") : !t.transA && t.transB ? (T = `
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${m.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${w.type.value}(0);
      }
      `, S = "value += tile_a[local_id.y][k] * tile_b[local_id.x][k];") : !t.transA && !t.transB && (T = `
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${m.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${w.type.value}(0);
      }
      `, S = "value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");
      let C = t.alpha === 1 ? "" : "value *= uniforms.alpha;";
      return `
  ${_.registerUniforms(v).declareVariables(...b)}
  var<workgroup> tile_a: array<array<${m.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${w.type.storage}, ${u}>, ${u}>;
  ${_.mainStart([u, u, 1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${x.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${T}
      k_start = k_start + ${u};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${u}; k++) {
        ${S}
      }
      workgroupBarrier();
    }

    ${C}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${$ != null ? `let cOffset = ${$.broadcastedIndicesToOffset("vec2(m, n)", x)}; value += ${x.type.value}(uniforms.beta) * ${$.getByOffset("cOffset")};` : ""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`;
    };
    return d ? { name: "GemmShared", shaderCache: { hint: `${t.cacheKey}`, inputDependencies: f }, getRunData: () => ({ outputs: [{ dims: o, dataType: e[0].dataType }], dispatchGroup: { x: l * p }, programUniforms: h }), getShaderSource: y } : { name: "Gemm", shaderCache: { hint: `${t.cacheKey}`, inputDependencies: f }, getRunData: () => ({ outputs: [{ dims: o, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: h }), getShaderSource: g };
  }, Hl = (e) => {
    let t = e.transA, i = e.transB, r = e.alpha, a = e.beta;
    return { transA: t, transB: i, alpha: r, beta: a, cacheKey: `${e.transA};${e.transB};${e.alpha === 1}` };
  }, Kl = (e, t) => {
    Gn(e.inputs), e.compute(Fn(e.inputs, t));
  };
}), Ee, Oe, qe, Ve, Hn, Kn, jn, Xn, Zn, Qn, Yn, Jn, jl, Xl, Zp = z(() => {
  V(), H(), ae(), j(), [Ee, Oe, qe, Ve] = [0, 1, 2, 3], Hn = (e) => {
    if (e[0].dims.length !== 4) throw new Error("only 4-D tensor is supported.");
    if (e[0].dims.length !== e[1].dims.length) throw new Error("input dimensions must be equal to grid dimensions");
    if (e[0].dims.length - 2 !== e[1].dims[e[1].dims.length - 1]) throw new Error(`last dimension of grid must be equal to ${e[0].dims.length - 2}`);
    if (e[0].dims[0] !== e[1].dims[0]) throw new Error("grid batch size must match input batch size");
  }, Kn = `
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`, jn = (e) => `
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`, Xn = (e) => `
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners === 0 ? `
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    ` : `
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`, Zn = (e) => `
  ${e.paddingMode === "reflection" ? `
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }` : ""}
`, Qn = (e, t, i) => `
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Ee}] = batch;
     indices[${Oe}] = channel;` + (() => {
    switch (i.paddingMode) {
      case "zeros":
        return `
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${qe}] = u32(r);
            indices[${Ve}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;
      case "border":
        return `
          indices[${qe}] = u32(clamp(r, 0, H - 1));
          indices[${Ve}] = u32(clamp(c, 0, W - 1));
        `;
      case "reflection":
        return `
          indices[${qe}] = gs_reflect(r, border[1], border[3]);
          indices[${Ve}] = gs_reflect(c, border[0], border[2]);
        `;
      default:
        throw new Error(`padding mode ${i.paddingMode} is not supported`);
    }
  })() + `
    return ${e.getByIndices("indices")};
  }
`, Yn = (e, t, i) => (() => {
    switch (i.mode) {
      case "nearest":
        return `
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Ee}], indices[${Oe}], border);
        `;
      case "bilinear":
        return `
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Ee}], indices[${Oe}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Ee}], indices[${Oe}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Ee}], indices[${Oe}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Ee}], indices[${Oe}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;
      case "bicubic":
        return `
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Ee}], indices[${Oe}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;
      default:
        throw new Error(`mode ${i.mode} is not supported`);
    }
  })() + `${e.setByOffset("global_idx", "result")}`, Jn = (e, t) => {
    let i = I("x", e[0].dataType, e[0].dims.length), r = [e[1].dims[0], e[1].dims[1], e[1].dims[2]], a = I("grid", e[1].dataType, r.length, 2), n = [e[0].dims[0], e[0].dims[1], e[1].dims[1], e[1].dims[2]];
    t.format === "NHWC" && (n = [e[0].dims[0], e[1].dims[1], e[1].dims[2], e[0].dims[3]], [Ee, Oe, qe, Ve] = [0, 3, 1, 2]);
    let s = A("output", e[0].dataType, n.length), o = i.type.value, u = k.size(n), l = [{ type: 12, data: u }, ...P(e[0].dims, r, n)], p = (d) => `
  ${d.registerUniform("output_size", "u32").declareVariables(i, a, s)}
  ${Kn}
  ${jn(o)}
  ${Xn(t)}
  ${Zn(t)}
  ${Qn(i, o, t)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${qe}]);
      let W_in = i32(uniforms.x_shape[${Ve}]);

      ${t.alignCorners === 0 ? `
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      ` : `
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Ee}], indices[${qe}], indices[${Ve}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Yn(s, o, t)}
  }`;
    return { name: "GridSample", shaderCache: { hint: `${t.cacheKey}`, inputDependencies: ["type", "type"] }, getRunData: (d) => {
      let c = k.size(n);
      return { outputs: [{ dims: n, dataType: d[0].dataType }], dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: l };
    }, getShaderSource: p };
  }, jl = (e, t) => {
    Hn(e.inputs), e.compute(Jn(e.inputs, t));
  }, Xl = (e) => Y({ alignCorners: e.align_corners, mode: e.mode, paddingMode: e.padding_mode, format: e.format });
}), ce, es, Zl, ki, ts, yt, Ql, Yl = z(() => {
  V(), H(), ae(), br(), kr(), j(), Pe(), ce = (e, t) => e.length > t && e[t].dims.length > 0 ? e[t] : void 0, es = (e, t) => {
    let i = e[0], r = ce(e, 1), a = ce(e, 2), n = ce(e, 3), s = ce(e, 4), o = ce(e, 5), u = ce(e, 6), l = ce(e, 7);
    if (i.dims.length !== 3 && i.dims.length !== 5) throw new Error("Input query is expected to have 3 or 5 dimensions");
    let p = i.dims[0], d = i.dims[1], c = i.dims.length === 3 ? i.dims[2] : t.numHeads * i.dims[4], h = d, f = 0, g = 0, y = Math.floor(c / t.numHeads);
    if (u && l && k.size(u.dims) && k.size(l.dims)) {
      if (u.dims.length !== 4) throw new Error('Input "past_key" is expected to have 4 dimensions');
      if (u.dims[0] !== p || u.dims[1] !== t.numHeads || u.dims[3] !== y) throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');
      if (l.dims[0] !== p || l.dims[1] !== t.numHeads || l.dims[3] !== y) throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');
      if (u.dims[2] !== l.dims[2]) throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');
      if (l.dims.length !== 4) throw new Error('Input "past_value" is expected to have 4 dimensions');
      f = u.dims[2], g = u.dims[2];
    } else if (u && k.size(u.dims) || l && k.size(l.dims)) throw new Error('Input "past_key" and "past_value" shall be both present or both absent');
    let _;
    if (r && k.size(r.dims) > 0) {
      if (i.dims.length !== 3) throw new Error('Input "query" is expected to have 3 dimensions when key is given');
      if (r.dims.length < 3 || r.dims.length > 5) throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');
      if (i.dims[0] !== r.dims[0]) throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');
      if (r.dims.length === 3) {
        if (r.dims[2] !== i.dims[2]) throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');
        _ = 2, h = r.dims[1];
      } else if (r.dims.length === 5) {
        if (r.dims[2] !== t.numHeads || r.dims[3] !== 2 || r.dims[4] !== y) throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');
        if (a) throw new Error('Expect "value" be none when "key" has packed kv format.');
        _ = 5, h = r.dims[1];
      } else {
        if (r.dims[1] !== t.numHeads || r.dims[3] !== y) throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');
        _ = 0, h = r.dims[2];
      }
    } else {
      if (i.dims.length !== 5) throw new Error('Input "query" is expected to have 5 dimensions when key is empty');
      if (i.dims[2] !== t.numHeads || i.dims[3] !== 3) throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');
      _ = 3;
    }
    if (n && k.size(n.dims) > 0) {
      if (n.dims.length !== 1) throw new Error('Input "bias" is expected to have 1 dimension');
      if (r && r.dims.length === 5 && r.dims[3] === 2) throw new Error("bias is not allowed for packed kv.");
    }
    let m = f + h, w = 0;
    if (s && k.size(s.dims) > 0) {
      w = 8;
      let v = s.dims;
      throw v.length === 1 ? v[0] === p ? w = 1 : v[0] === 3 * p + 2 && (w = 3) : v.length === 2 && v[0] === p && v[1] === m && (w = 5), w === 8 ? new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)') : new Error("Mask not supported");
    }
    let $ = !1, b = c;
    if (a && k.size(a.dims) > 0) {
      if (a.dims.length !== 3 && a.dims.length !== 4) throw new Error('Input "value" is expected to have 3 or 4 dimensions');
      if (i.dims[0] !== a.dims[0]) throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');
      if (a.dims.length === 3) {
        if (h !== a.dims[1]) throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');
        b = a.dims[2];
      } else {
        if (h !== a.dims[2]) throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');
        b = a.dims[1] * a.dims[3], $ = !0;
      }
    }
    let x = !1;
    if (s && k.size(s.dims) > 0) throw new Error("Key padding mask is not supported");
    if (o && k.size(o.dims) > 0) {
      if (o.dims.length !== 4) throw new Error('Input "attention_bias" is expected to have 4 dimensions');
      if (o.dims[0] !== p || o.dims[1] !== t.numHeads || o.dims[2] !== d || o.dims[3] !== m) throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)');
    }
    return { batchSize: p, sequenceLength: d, pastSequenceLength: f, kvSequenceLength: h, totalSequenceLength: m, maxSequenceLength: g, inputHiddenSize: 0, hiddenSize: c, vHiddenSize: b, headSize: y, vHeadSize: Math.floor(b / t.numHeads), numHeads: t.numHeads, isUnidirectional: !1, pastPresentShareBuffer: !1, maskFilterValue: t.maskFilterValue, maskType: w, scale: t.scale, broadcastResPosBias: x, passPastInKv: $, qkvFormat: _ };
  }, Zl = (e) => Y({ ...e }), ki = Y({ perm: [0, 2, 1, 3] }), ts = (e, t, i, r, a, n, s) => {
    let o = [r, a, n], u = k.size(o), l = [{ type: 12, data: u }, { type: 12, data: s }, { type: 12, data: n }], p = (d) => {
      let c = A("qkv_with_bias", t.dataType, o), h = I("qkv", t.dataType, o), f = I("bias", i.dataType, o), g = [{ name: "output_size", type: "u32" }, { name: "bias_offset", type: "u32" }, { name: "hidden_size", type: "u32" }];
      return `
  ${d.registerUniforms(g).declareVariables(h, f, c)}
  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`;
    };
    return e.compute({ name: "MultiHeadAttentionAddBias", shaderCache: { inputDependencies: ["type", "type"] }, getRunData: () => ({ outputs: [{ dims: o, dataType: t.dataType, gpuDataType: 0 }], dispatchGroup: { x: Math.ceil(u / 64) }, programUniforms: l }), getShaderSource: p }, { inputs: [t, i], outputs: [-1] })[0];
  }, yt = (e, t, i, r, a, n, s, o) => {
    let u = n;
    if (s && k.size(s.dims) > 0) {
      if (r === 1) throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");
      return u = ts(e, n, s, t, r, i * a, o), u = u.reshape([t, r, i, a]), i === 1 || r === 1 ? u : e.compute(_e(u, ki.perm), { inputs: [u], outputs: [-1] })[0];
    } else return n.dims.length === 3 && (u = n.reshape([t, r, i, a])), i === 1 || r === 1 ? u : e.compute(_e(u, ki.perm), { inputs: [u], outputs: [-1] })[0];
  }, Ql = (e, t) => {
    let i = es(e.inputs, t), r = e.inputs[0], a = ce(e.inputs, 1), n = ce(e.inputs, 2), s = ce(e.inputs, 3), o = ce(e.inputs, 4), u = ce(e.inputs, 5), l = ce(e.inputs, 6), p = ce(e.inputs, 7);
    if (r.dims.length === 5) throw new Error("Packed QKV is not implemented");
    if (a?.dims.length === 5) throw new Error("Packed KV is not implemented");
    let d = a && n && a.dims.length === 4 && n.dims.length === 4, c = yt(e, i.batchSize, i.numHeads, i.sequenceLength, i.headSize, r, s, 0);
    if (d) return wt(e, c, a, n, o, void 0, l, p, u, i);
    if (!a || !n) throw new Error("key and value must be provided");
    let h = yt(e, i.batchSize, i.numHeads, i.kvSequenceLength, i.headSize, a, s, i.hiddenSize), f = yt(e, i.batchSize, i.numHeads, i.kvSequenceLength, i.vHeadSize, n, s, 2 * i.hiddenSize);
    wt(e, c, h, f, o, void 0, l, p, u, i);
  };
}), is, rs, as, ns, nr, Jl, ed, td = z(() => {
  V(), H(), ae(), j(), is = (e) => {
    if (!e || e.length < 1) throw new Error("too few inputs");
  }, rs = (e, t) => {
    let i = [], r = t.numOutputs;
    return e[1].dims[0] > 0 && (e[1].getBigInt64Array().forEach((a) => i.push(Number(a))), r = i.length), Y({ numOutputs: r, axis: t.axis, splitSizes: i });
  }, as = (e) => `
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${U("uniforms.size_in_split_axis", "i", e)}) {
        return i;
    }
    }
    return ${e}u;
}`, ns = (e) => {
    let t = e.length, i = [];
    for (let r = 0; r < t; ++r) {
      let a = e[r].setByIndices("indices", "input[global_idx]");
      t === 1 ? i.push(a) : r === 0 ? i.push(`if (output_number == ${r}u) { ${a} }`) : r === t - 1 ? i.push(`else { ${a} }`) : i.push(`else if (output_number == ${r}) { ${a} }`);
    }
    return `
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${i.join(`
`)}
      }`;
  }, nr = (e, t) => {
    let i = e[0].dims, r = k.size(i), a = e[0].dataType, n = k.normalizeAxis(t.axis, i.length), s = new Array(t.numOutputs), o = I("input", a, i.length), u = new Array(t.numOutputs), l = [], p = [], d = 0, c = [{ type: 12, data: r }];
    for (let f = 0; f < t.numOutputs; f++) {
      d += t.splitSizes[f], u[f] = d;
      let g = i.slice();
      g[n] = t.splitSizes[f], p.push(g), s[f] = A(`output${f}`, a, g.length), l.push({ dims: p[f], dataType: e[0].dataType });
    }
    c.push({ type: 12, data: u }, ...P(i, ...p));
    let h = (f) => `
  ${f.registerUniform("input_size", "u32").registerUniform("size_in_split_axis", "u32", u.length).declareVariables(o, ...s)}
  ${as(u.length)}
  ${ns(s)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices", n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${U("uniforms.size_in_split_axis", "output_number - 1u", u.length)};
      ${o.indicesSet("indices", n, "index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;
    return { name: "Split", shaderCache: { hint: t.cacheKey, inputDependencies: ["rank"] }, getShaderSource: h, getRunData: () => ({ outputs: l, dispatchGroup: { x: Math.ceil(r / 64) }, programUniforms: c }) };
  }, Jl = (e, t) => {
    is(e.inputs);
    let i = e.inputs.length === 1 ? t : rs(e.inputs, t);
    e.compute(nr(e.inputs, i), { inputs: [0] });
  }, ed = (e) => {
    let t = e.axis, i = e.splitSizes, r = e.numOutputs < 0 ? i.length : e.numOutputs;
    if (r !== i.length) throw new Error("numOutputs and splitSizes length must be equal");
    return Y({ axis: t, numOutputs: r, splitSizes: i });
  };
}), ss, Wt, id, rd = z(() => {
  V(), H(), ae(), j(), ss = (e, t) => {
    let [i, r, a, n] = e, { numHeads: s, rotaryEmbeddingDim: o } = t;
    if (i.dims.length !== 3 && i.dims.length !== 4) throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${i.dims.length}`);
    if (!k.areEqual(r.dims, []) && !k.areEqual(r.dims, [1]) && r.dims.length !== 2) throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${r.dims.length}`);
    if (a.dims.length !== 2) throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);
    if (n.dims.length !== 2) throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);
    if (!k.areEqual(a.dims, n.dims)) throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");
    if (o > 0 && s === 0) throw new Error("num_heads must be provided if rotary_embedding_dim is specified");
    let u = i.dims[0], l = i.dims[i.dims.length - 2], p = a.dims[0], d = k.sizeFromDimension(i.dims, 1) / l, c = o === 0 ? a.dims[1] * 2 : d / s;
    if (o > c) throw new Error("rotary_embedding_dim must be less than or equal to head_size");
    if (r.dims.length === 2) {
      if (u !== r.dims[0]) throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${r.dims[0]}`);
      if (l !== r.dims[1]) throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${r.dims[1]}`);
    }
    if (l > p) throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");
    if (c / 2 !== a.dims[1] && o / 2 !== a.dims[1]) throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);
  }, Wt = (e, t) => {
    let { interleaved: i, numHeads: r, rotaryEmbeddingDim: a, scale: n } = t, s = e[0].dims[0], o = k.sizeFromDimension(e[0].dims, 1), u = e[0].dims[e[0].dims.length - 2], l = o / u, p = e[2].dims[1], d = a === 0 ? p * 2 : l / r, c = new Array(s, u, l / d, d - p), h = k.computeStrides(c), f = [{ type: 1, data: n }, { type: 12, data: c }, { type: 12, data: h }, ...e[0].dims.length === 3 ? new Array({ type: 12, data: [o, l, d, 1] }) : [], ...e[0].dims.length === 4 ? new Array({ type: 12, data: [o, d, u * d, 1] }) : [], ...P(e[0].dims, e[1].dims, e[2].dims, e[3].dims, e[0].dims)], g = (y) => {
      let _ = I("input", e[0].dataType, e[0].dims.length), m = I("position_ids", e[1].dataType, e[1].dims.length), w = I("cos_cache", e[2].dataType, e[2].dims.length), $ = I("sin_cache", e[3].dataType, e[3].dims.length), b = A("output", e[0].dataType, e[0].dims.length);
      return y.registerUniforms([{ name: "scale", type: "f32" }, { name: "global_shape", type: "u32", length: c.length }, { name: "global_strides", type: "u32", length: h.length }, { name: "input_output_strides", type: "u32", length: h.length }]), `
        ${y.declareVariables(_, m, w, $, b)}

        ${y.mainStart(at)}
          let half_rotary_emb_dim = uniforms.${w.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${y.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${m.broadcastedIndicesToOffset("bsnh.xy", A("", m.type.tensor, 2))};
            let position_id =
                u32(${m.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${i});
            let j = i + select(half_rotary_emb_dim, 1, ${i});
            let re = ${_.getByOffset("i")} * ${w.get("position_id", "bsnh[3]")} -
                ${_.getByOffset("j")} * ${$.get("position_id", "bsnh[3]")};
            ${b.setByOffset("i", "re")}
            let im = ${_.getByOffset("i")} * ${$.get("position_id", "bsnh[3]")} +
                ${_.getByOffset("j")} * ${w.get("position_id", "bsnh[3]")};
            ${b.setByOffset("j", "im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${b.setByOffset("k", _.getByOffset("k"))}
          }
        }`;
    };
    return { name: "RotaryEmbedding", shaderCache: { hint: Y({ interleaved: i }).cacheKey, inputDependencies: ["rank", "rank", "rank", "rank"] }, getShaderSource: g, getRunData: () => ({ outputs: [{ dims: e[0].dims, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(k.size(c) / at) }, programUniforms: f }) };
  }, id = (e, t) => {
    ss(e.inputs, t), e.compute(Wt(e.inputs, t));
  };
}), os, us, Si, ls, ad, Qp = z(() => {
  ae(), V(), kr(), Yl(), td(), Pe(), rd(), j(), os = (e, t) => {
    if (t.doRotary && e.length <= 7) throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");
    let i = e[0], r = e[1], a = e[2], n = e[3], s = e[4];
    if (t.doRotary !== 0 && e.length <= 7) throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");
    if (t.localWindowSize !== -1) throw new Error("Local attention is not supported");
    if (t.softcap !== 0) throw new Error("Softcap is not supported");
    if (t.rotaryInterleaved !== 0) throw new Error("Rotary interleaved is not supported");
    if (t.smoothSoftmax) throw new Error("Smooth softmax is not supported");
    if (i.dims.length !== 3 && i.dims.length !== 5) throw new Error("Input query is expected to have 3 or 5 dimensions");
    let o = !1, u = i.dims[0], l = i.dims[1], p = i.dims.length === 3 ? o ? i.dims[2] / 3 : i.dims[2] : t.numHeads * i.dims[4], d = l, c = 0, h = !r || r.dims.length === 0, f = Math.floor(h ? p / (t.numHeads + 2 * t.kvNumHeads) : p / t.numHeads);
    h && (p = f * t.numHeads);
    let g = n && n.dims.length !== 0, y = s && s.dims.length !== 0;
    if (g && n.dims.length === 4 && n.dims[0] === u && n.dims[1] !== t.kvNumHeads && n.dims[2] === t.kvNumHeads && n.dims[3] === f) throw new Error("BSNH pastKey/pastValue is not supported");
    if (g && y) {
      if (n.dims.length !== 4) throw new Error('Input "past_key" is expected to have 4 dimensions');
      if (s.dims.length !== 4) throw new Error('Input "past_value" is expected to have 4 dimensions');
      c = n.dims[2];
    } else if (g || y) throw new Error('Input "past_key" and "past_value" shall be both present or both absent');
    let _ = 1;
    if (r && r.dims.length > 0) {
      if (i.dims.length !== 3) throw new Error('Input "query" is expected to have 3 dimensions when key is given');
      if (r.dims.length < 3 || r.dims.length > 5) throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');
      if (i.dims[0] !== r.dims[0]) throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');
      if (r.dims.length === 3) {
        if (i.dims[2] % r.dims[2] !== 0) throw new Error('Dimension 2 of "query" should be a multiple of "key"');
        d = r.dims[1];
      } else if (r.dims.length === 5) {
        if (r.dims[2] !== t.numHeads || r.dims[3] !== 2 || r.dims[4] !== f) throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');
        if (a) throw new Error('Expect "value" be none when "key" has packed kv format.');
        d = r.dims[1];
      } else {
        if (r.dims[1] !== t.numHeads || r.dims[3] !== f) throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');
        d = r.dims[2];
      }
    } else {
      if (i.dims.length !== 3 && i.dims.length !== 5) throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');
      if (i.dims.length === 5 && (i.dims[2] !== t.numHeads || i.dims[3] !== 3)) throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');
      _ = 3;
    }
    let m = 0, w = !1, $ = t.kvNumHeads ? f * t.kvNumHeads : p;
    if (a && a.dims.length > 0) {
      if (a.dims.length !== 3 && a.dims.length !== 4) throw new Error('Input "value" is expected to have 3 or 4 dimensions');
      if (i.dims[0] !== a.dims[0]) throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');
      if (a.dims.length === 3) {
        if (d !== a.dims[1]) throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');
        $ = a.dims[2];
      } else {
        if (d !== a.dims[2]) throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');
        $ = a.dims[1] * a.dims[3], w = !0;
      }
    }
    let b = e.length > 4 ? e[5] : void 0;
    if (b) {
      if (b.dims.length === 0) throw new Error("seqlens_k must be at least 1D, got scalar.");
      let x = b.dims.reduce((v, S) => v * S, 1);
      if (x !== u) throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${x}.`);
      for (let v = 0; v < b.dims.length; v++) if (b.dims[v] !== 1 && b.dims[v] !== u) throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${v}] = ${b.dims[v]}.`);
    }
    return { batchSize: u, sequenceLength: l, pastSequenceLength: c, kvSequenceLength: d, totalSequenceLength: -1, maxSequenceLength: -1, inputHiddenSize: 0, hiddenSize: p, vHiddenSize: $, headSize: f, vHeadSize: Math.floor($ / t.kvNumHeads), numHeads: t.numHeads, kvNumHeads: t.kvNumHeads, nReps: t.numHeads / t.kvNumHeads, pastPresentShareBuffer: !1, maskType: m, scale: t.scale, broadcastResPosBias: !1, passPastInKv: w, qkvFormat: _ };
  }, us = Y({ perm: [0, 2, 1, 3] }), Si = (e, t, i) => {
    let r = t, a = i.kvNumHeads;
    return t.dims.length === 3 && i.kvSequenceLength !== 0 && (r = t.reshape([i.batchSize, i.kvSequenceLength, a, i.headSize]), r = e.compute(_e(r, us.perm), { inputs: [r], outputs: [-1] })[0]), r;
  }, ls = (e, t, i, r) => {
    let a = 7, n = ["type", "type"], s = [e * t], o = e * t, u = [{ type: 12, data: o }, { type: 12, data: t }, { type: 12, data: e }], l = (p) => {
      let d = I("seq_lens", i.dataType, i.dims), c = I("total_seq_lens", r.dataType, r.dims), h = A("pos_ids", a, s), f = [{ name: "output_size", type: "u32" }, { name: "sequence_length", type: "u32" }, { name: "batch_size", type: "u32" }];
      return `
  ${p.registerUniforms(f).declareVariables(d, c, h)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${c.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${d.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx", "pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx", "pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${h.setByOffset("global_idx", "seqlen")}
    };
  }
  `;
    };
    return { name: "GeneratePositionIds", shaderCache: { hint: `${e};${t}`, inputDependencies: n }, getRunData: () => ({ outputs: [{ dims: s, dataType: a }], dispatchGroup: { x: Math.ceil(o / 64) }, programUniforms: u }), getShaderSource: l };
  }, ad = (e, t) => {
    let i = os(e.inputs, t);
    if (e.inputs[0].dims.length === 5) throw new Error("Packed QKV is not implemented");
    if (e.inputs[1]?.dims.length === 5) throw new Error("Packed KV is not implemented");
    let r = e.inputs[0], a = e.inputs[1] && e.inputs[1].dims.length > 0 ? e.inputs[1] : void 0, n = e.inputs[2] && e.inputs[2].dims.length > 0 ? e.inputs[2] : void 0, s = e.inputs[3] && e.inputs[3].dims.length !== 0 ? e.inputs[3] : void 0, o = e.inputs[4] && e.inputs[4].dims.length !== 0 ? e.inputs[4] : void 0, u = e.inputs.length > 4 ? e.inputs[5] : void 0, l = e.inputs.length > 5 ? e.inputs[6] : void 0, p = i.kvNumHeads ? i.kvNumHeads : i.numHeads, d = Y({ axis: 2, numOutputs: 3, splitSizes: [i.numHeads * i.headSize, p * i.headSize, p * i.headSize] }), [c, h, f] = !a && !n ? e.compute(nr([r], d), { inputs: [r], outputs: [-1, -1, -1] }) : [r, a, n], g, y;
    if (t.doRotary) {
      let $ = e.compute(ls(i.batchSize, i.sequenceLength, u, l), { inputs: [u, l], outputs: [-1] })[0], b = e.inputs[7], x = e.inputs[8], v = Y({ interleaved: t.rotaryInterleaved !== 0, numHeads: i.numHeads, rotaryEmbeddingDim: 0, scale: t.scale }), S = [c, $, b, x], T = [-1];
      g = e.compute(Wt(S, v), { inputs: S, outputs: T })[0], S.splice(0, 1, h);
      let C = Y({ interleaved: t.rotaryInterleaved !== 0, numHeads: i.kvNumHeads, rotaryEmbeddingDim: 0, scale: t.scale });
      y = e.compute(Wt(S, C), { inputs: S, outputs: T })[0];
    }
    let _ = yt(e, i.batchSize, i.numHeads, i.sequenceLength, i.headSize, t.doRotary ? g : c, void 0, 0), m = Si(e, t.doRotary ? y : h, i), w = Si(e, f, i);
    wt(e, _, m, w, void 0, void 0, s, o, void 0, i, u, l);
  };
}), Ii, ds, ps, nd, Yp = z(() => {
  V(), H(), Pe(), j(), Ii = (e, t, i, r, a, n, s, o) => {
    let u = re(n), l = u === 1 ? "f32" : `vec${u}f`, p = u === 1 ? "vec2f" : `mat2x${u}f`, d = a * s, c = 64;
    d === 1 && (c = 256);
    let h = [a, s, n / u], f = [a, s, 2], g = ["rank", "type", "type"], y = [];
    y.push(...P(h, f));
    let _ = (m) => {
      let w = I("x", t.dataType, 3, u), $ = I("scale", i.dataType, i.dims), b = I("bias", r.dataType, r.dims), x = A("output", 1, 3, 2), v = [w, $, b, x];
      return `
  var<workgroup> workgroup_shared : array<${p}, ${c}>;
  const workgroup_size = ${c}u;
  ${m.declareVariables(...v)}
  ${m.mainStart(c)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${w.get("batch", "channel", "h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${p}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Ue("workgroup_shared[0][0]", u)} / f32(hight * ${u});
      let squared_sum_final = ${Ue("workgroup_shared[0][1]", u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`;
    };
    return e.compute({ name: "InstanceNormComputeChannelScaleShift", shaderCache: { hint: `${u};${o};${c}`, inputDependencies: g }, getRunData: () => ({ outputs: [{ dims: f, dataType: 1 }], dispatchGroup: { x: d }, programUniforms: y }), getShaderSource: _ }, { inputs: [t, i, r], outputs: [-1] })[0];
  }, ds = (e, t, i) => {
    let r = t[0].dims, a = r, n = 2, s = r[0], o = r[1], u = k.sizeFromDimension(r, n), l = re(u), p = k.size(a) / l, d = Ii(e, t[0], t[1], t[2], s, u, o, i.epsilon), c = [s, o, u / l], h = [s, o], f = ["type", "none"], g = (y) => {
      let _ = I("x", t[0].dataType, c.length, l), m = I("scale_shift", 1, h.length, 2), w = A("output", t[0].dataType, c.length, l), $ = [_, m, w];
      return `
  ${y.registerUniform("output_size", "u32").declareVariables(...$)}
  ${y.mainStart()}
  ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${w.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${m.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${_.getByOffset("global_idx")} * ${w.type.value}(scale_shift.x) + ${w.type.value}(scale_shift.y);
      ${w.setByOffset("global_idx", "value")};
  }`;
    };
    e.compute({ name: "InstanceNormalization", shaderCache: { hint: `${l}`, inputDependencies: f }, getRunData: () => ({ outputs: [{ dims: a, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(p / 64) }, programUniforms: [{ type: 12, data: p }, ...P(c, h, c)] }), getShaderSource: g }, { inputs: [t[0], d] });
  }, ps = (e, t, i) => {
    let r = t[0].dims, a = r, n = r[0], s = r[r.length - 1], o = k.sizeFromDimension(r, 1) / s, u = re(s), l = k.size(a) / u, p = [{ type: 12, data: o }, { type: 12, data: Math.floor(s / u) }], d = ["type", "type"], c = !1, h = [0, r.length - 1];
    for (let _ = 0; _ < r.length - 2; _++) c = c || r[_ + 1] !== 1, h.push(_ + 1);
    c = c && r[r.length - 1] !== 1;
    let f = c ? e.compute(_e(e.inputs[0], h), { inputs: [e.inputs[0]], outputs: [-1] })[0] : e.inputs[0].reshape(Array.from({ length: r.length }, (_, m) => r[h[m]])), g = Ii(e, f, t[1], t[2], n, o, s, i.epsilon), y = (_) => {
      let m = oe(t[0].dataType), w = u === 1 ? "vec2f" : `mat${u}x2f`, $ = (v) => {
        let S = v === 0 ? "x" : "y", T = u === 1 ? "f32" : `vec${u}f`;
        switch (u) {
          case 1:
            return `${m}(${T}(scale.${S}))`;
          case 2:
            return `vec2<${m}>(${T}(scale[0].${S}, scale[1].${S}))`;
          case 4:
            return `vec4<${m}>(${T}(scale[0].${S}, scale[1].${S}, scale[2].${S}, scale[3].${S}))`;
          default:
            throw new Error(`Not supported compoents ${u}`);
        }
      }, b = I("input", t[0].dataType, t[0].dims, u), x = A("output", t[0].dataType, a, u);
      return `
  @group(0) @binding(0) var<storage, read> input : array<${b.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${w}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${x.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${_.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${$(0)}, ${$(1)});
  }`;
    };
    e.compute({ name: "InstanceNormalizationNHWC", shaderCache: { hint: `${u}`, inputDependencies: d }, getRunData: () => ({ outputs: [{ dims: a, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(l / 64) }, programUniforms: p }), getShaderSource: y }, { inputs: [t[0], g] });
  }, nd = (e, t) => {
    t.format === "NHWC" ? ps(e, e.inputs, t) : ds(e, e.inputs, t);
  };
}), cs, hs, sd, Jp = z(() => {
  V(), H(), j(), cs = (e) => {
    if (!e || e.length < 2) throw new Error("layerNorm requires at least 2 inputs.");
  }, hs = (e, t, i) => {
    let r = t.simplified, a = e[0].dims, n = e[1], s = !r && e[2], o = a, u = k.normalizeAxis(t.axis, a.length), l = k.sizeToDimension(a, u), p = k.sizeFromDimension(a, u), d = k.size(n.dims), c = s ? k.size(s.dims) : 0;
    if (d !== p || s && c !== p) throw new Error(`Size of X.shape()[axis:] == ${p}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${d} and bias size of ${c}`);
    let h = [];
    for (let b = 0; b < a.length; ++b) b < u ? h.push(a[b]) : h.push(1);
    let f = re(p), g = ["type", "type"], y = [{ type: 12, data: l }, { type: 1, data: p }, { type: 12, data: Math.floor(p / f) }, { type: 1, data: t.epsilon }];
    s && g.push("type");
    let _ = i > 1, m = i > 2, w = (b) => {
      let x = oe(e[0].dataType), v = [I("x", e[0].dataType, e[0].dims, f), I("scale", n.dataType, n.dims, f)];
      s && v.push(I("bias", s.dataType, s.dims, f)), v.push(A("output", e[0].dataType, o, f)), _ && v.push(A("mean_data_output", 1, h)), m && v.push(A("inv_std_output", 1, h));
      let S = [{ name: "norm_count", type: "u32" }, { name: "norm_size", type: "f32" }, { name: "norm_size_vectorized", type: "u32" }, { name: "epsilon", type: "f32" }];
      return `
  ${b.registerUniforms(S).declareVariables(...v)}
  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Zi("f32", f)};
    var mean_square_vector = ${Zi("f32", f)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${it(x, f, "x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Ue("mean_vector", f)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Ue("mean_square_vector", f)} / uniforms.norm_size ${r ? "" : "- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${it(x, f, "x[j + offset]")};
      let f32scale = ${it(x, f, "scale[j]")};
      output[j + offset] = ${v[0].type.value}((f32input ${r ? "" : "- mean"}) * inv_std_dev * f32scale
        ${s ? `+ ${it(x, f, "bias[j]")}` : ""}
      );
    }

    ${_ ? "mean_data_output[global_idx] = mean" : ""};
    ${m ? "inv_std_output[global_idx] = inv_std_dev" : ""};
  }`;
    }, $ = [{ dims: o, dataType: e[0].dataType }];
    return _ && $.push({ dims: h, dataType: 1 }), m && $.push({ dims: h, dataType: 1 }), { name: "LayerNormalization", shaderCache: { hint: `${f};${i};${r}`, inputDependencies: g }, getRunData: () => ({ outputs: $, dispatchGroup: { x: Math.ceil(l / 64) }, programUniforms: y }), getShaderSource: w };
  }, sd = (e, t) => {
    cs(e.inputs), e.compute(hs(e.inputs, t, e.outputCount));
  };
}), fs, od, ec = z(() => {
  H(), zr(), Cr(), fs = (e) => {
    if (!e || e.length !== 2) throw new Error("MatMul requires 2 inputs.");
    if (e[0].dims[e[0].dims.length - 1] !== e[1].dims[e[1].dims.length - 2]) throw new Error("shared dimension does not match.");
  }, od = (e) => {
    fs(e.inputs);
    let t = rt.calcShape(e.inputs[0].dims, e.inputs[1].dims, !0);
    if (!t) throw new Error("Can't use matmul on the given tensors");
    let i = t[t.length - 1], r = e.inputs[0].dims[e.inputs[0].dims.length - 1];
    if (i < 8 && r < 8) e.compute(Er(e.inputs, { activation: "" }, t));
    else {
      let a = t[t.length - 2], n = k.size(e.inputs[0].dims.slice(0, -2)), s = k.size(e.inputs[1].dims.slice(0, -2));
      if (n !== 1 && a === 1 && s === 1) {
        let o = e.inputs[0].reshape([1, n, r]), u = e.inputs[1].reshape([1, r, i]), l = [1, n, i], p = [o, u];
        e.compute(Lt(p, { activation: "" }, t, l), { inputs: p });
      } else e.compute(Lt(e.inputs, { activation: "" }, t));
    }
  };
}), ms, gs, _s, ud, ld, tc = z(() => {
  V(), H(), ae(), j(), ms = (e, t) => {
    if (e.length < 3 || e.length > 4) throw new Error("MatMulNBits requires 3 or 4 inputs");
    let i = e[0], r = i.dims.length;
    if (i.dims[r - 1] !== t.k) throw new Error("The last dim of input shape does not match the k value");
    let a = Math.floor((t.k + t.blockSize - 1) / t.blockSize), n = t.blockSize / 8 * t.bits, s = e[1];
    if (!k.areEqual(s.dims, [t.n, a, n])) throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");
    let o = e[2].dims;
    if (k.size(o) !== t.n * a) throw new Error("scales input size error.");
    if (e.length === 4) {
      let u = e[3].dims, l = t.n * (t.bits === 8 ? a : Math.floor((a * t.bits + 7) / 8));
      if (k.size(u) !== l) throw new Error("zeroPoints input size error.");
    }
  }, gs = (e, t) => {
    let i = e[0].dims, r = i.length, a = i[r - 2], n = t.k, s = t.n, o = i.slice(0, r - 2), u = k.size(o), l = e[1].dims[2] / 4, p = e[0].dataType, d = re(t.k), c = re(l), h = re(s), f = o.concat([a, s]), g = a > 1 && s / h % 2 === 0 ? 2 : 1, y = k.size(f) / h / g, _ = 64, m = [], w = [u, a, n / d], $ = k.convertShape(e[1].dims).slice();
    $.splice(-1, 1, l / c), m.push(...P(w)), m.push(...P($)), m.push(...P(e[2].dims)), e.length === 4 && m.push(...P(k.convertShape(e[3].dims)));
    let b = [u, a, s / h];
    m.push(...P(b));
    let x = (v) => {
      let S = w.length, T = I("a", e[0].dataType, S, d), C = I("b", 12, $.length, c), W = I("scales", e[2].dataType, e[2].dims.length), B = [T, C, W], R = e.length === 4 ? I("zero_points", 12, e[3].dims.length) : void 0;
      R && B.push(R);
      let F = b.length, O = A("output", e[0].dataType, F, h), M = oe(e[0].dataType), G = (() => {
        switch (d) {
          case 1:
            return `array<${M}, 8>`;
          case 2:
            return `mat4x2<${M}>`;
          case 4:
            return `mat2x4<${M}>`;
          default:
            throw new Error(`${d}-component is not supported.`);
        }
      })(), K = Math.floor(32 / t.bits), L = Math.floor(K / 8), X = () => {
        let N = "";
        for (let D = 0; D < L; D++) {
          let de = D * t.bits * 4, he = de + t.bits;
          N += `
          // reuse a data (pass ${D})
            var input_offset${D > 0 ? D : ""} = ${D === 0 ? T.indicesToOffset(`${T.type.indices}(batch, row, word_offset)`) : "input_offset"};
            var a_data${D > 0 ? D : ""}: ${G};
            for (var j${D > 0 ? D : ""}: u32 = 0; j${D > 0 ? D : ""} < ${8 / d}; j${D > 0 ? D : ""}++) {
              a_data${D > 0 ? D : ""}[j${D > 0 ? D : ""}] = ${T.getByOffset(`input_offset${D > 0 ? D : ""}`)};
              input_offset${D > 0 ? D : ""}++;
            }
          `;
          for (let ne = 0; ne < h * g; ne++) N += `
            b_value = ${c === 1 ? `b${ne}_data` : `b${ne}_data[i]`};
            ${t.bits === 2 ? `{
              let half_word = b_value >> ${D * 16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }` : `b_value_lower = unpack4xU8((b_value >> ${de}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${he}u) & b_mask);`}
            b_quantized_values = ${G}(${Array.from({ length: 4 }, (fe, ee) => `${M}(b_value_lower[${ee}]), ${M}(b_value_upper[${ee}])`).join(", ")});
            b_dequantized_values = ${d === 1 ? `${G}(${Array.from({ length: 8 }, (fe, ee) => `(b_quantized_values[${ee}] - ${R ? `zero_point${ne}` : "zero_point"}) * scale${ne}`).join(", ")});` : `(b_quantized_values - ${G}(${Array(8).fill(`${R ? `zero_point${ne}` : "zero_point"}`).join(",")})) * scale${ne};`};
            workgroup_shared[local_id.x * ${g} + ${Math.floor(ne / h)}]${h > 1 ? `[${ne % h}]` : ""} += ${Array.from({ length: 8 / d }, (fe, ee) => `${d === 1 ? `a_data${D > 0 ? D : ""}[${ee}] * b_dequantized_values[${ee}]` : `dot(a_data${D > 0 ? D : ""}[${ee}], b_dequantized_values[${ee}])`}`).join(" + ")};
          `;
        }
        return N;
      }, E = () => {
        let N = `
            var col_index = col * ${h};
            ${R ? `
            let zero_point_values_per_byte: u32 = ${Math.floor(8 / t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;` : `
            // The default zero point is ${Math.pow(2, t.bits - 1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${M}(${Math.pow(2, t.bits - 1).toFixed(1)});`}
            `;
        for (let D = 0; D < h * g; D++) N += `
            let scale${D} = ${W.getByOffset("col_index * nBlocksPerCol + block")};
            ${R ? `
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${R.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${D} = ${M}((zero_point_word) & ${t.bits === 2 ? "0x3u" : "0xFu"});` : ""}
            col_index += 1;`;
        return N;
      }, q = () => {
        let N = `col_index = col * ${h};`;
        for (let D = 0; D < h * g; D++) N += `
            let b${D}_data = ${C.getByIndices(`${C.type.indices}(col_index, block, word)`)};
            col_index += 1;`;
        return N += `
            var b_value: u32;
            let b_mask: u32 = ${t.bits === 2 ? "0x03030303u" : "0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${G};
            var b_dequantized_values: ${G};`, N;
      };
      return `
        var<workgroup> workgroup_shared: array<${O.type.value}, ${g * _}>;
        ${v.declareVariables(...B, O)}
        ${v.mainStart([_, 1, 1])}
          let output_indices = ${O.offsetToIndices(`(global_idx / ${_}) * ${g}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${_}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize / d};
            ${E()}
            for (var word: u32 = 0; word < ${l}; word += ${c}) {
              ${q()}
              for (var i: u32 = 0; i < ${c}; i++) {
                ${X()}
                word_offset += ${K / d};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${g}) {
            var output_value: ${O.type.value} = ${O.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${_}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${g};
            }
            ${O.setByIndices(`${O.type.indices}(batch, row, col + local_id.x)`, "output_value")};
          }
        }`;
    };
    return { name: "MatMulNBits", shaderCache: { hint: `${t.blockSize};${t.bits};${d};${c};${h};${g};${_}`, inputDependencies: Array(e.length).fill("rank") }, getRunData: () => ({ outputs: [{ dims: f, dataType: p }], dispatchGroup: { x: y }, programUniforms: m }), getShaderSource: x };
  }, _s = (e, t) => {
    let i = e[0].dims, r = i.length, a = i[r - 2], n = t.k, s = t.n, o = i.slice(0, r - 2), u = k.size(o), l = e[1].dims[2] / 4, p = e[0].dataType, d = re(t.k), c = re(l), h = o.concat([a, s]), f = 128, g = s % 8 === 0 ? 8 : s % 4 === 0 ? 4 : 1, y = f / g, _ = Math.floor(32 / t.bits), m = y * c * _, w = m / d, $ = m / t.blockSize, b = k.size(h) / g, x = [], v = [u, a, n / d], S = k.convertShape(e[1].dims).slice();
    S.splice(-1, 1, l / c), x.push(...P(v)), x.push(...P(S)), x.push(...P(e[2].dims)), e.length === 4 && x.push(...P(k.convertShape(e[3].dims)));
    let T = [u, a, s];
    x.push(...P(T));
    let C = (W) => {
      let B = v.length, R = I("a", e[0].dataType, B, d), F = I("b", 12, S.length, c), O = I("scales", e[2].dataType, e[2].dims.length), M = [R, F, O], G = e.length === 4 ? I("zero_points", 12, e[3].dims.length) : void 0;
      G && M.push(G);
      let K = T.length, L = A("output", e[0].dataType, K), X = oe(e[0].dataType), E = () => {
        switch (d) {
          case 1:
            return `
          let a_data0 = vec4<${X}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${X}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;
          case 2:
            return `
          let a_data0 = vec4<${X}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${X}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;
          case 4:
            return `
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;
          default:
            throw new Error(`${d}-component is not supported.`);
        }
      };
      return `
        var<workgroup> sub_a: array<${R.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${L.type.value}, ${y}>, ${g}>;
        ${W.declareVariables(...M, L)}
        ${W.mainStart([y, g, 1])}
          let output_indices = ${L.offsetToIndices(`workgroup_index * ${g}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${$} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${f})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${R.getByIndices(`${R.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${R.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${$} + local_id.x;
            ${G ? `
            let zero_point_values_per_byte: u32 = ${Math.floor(8 / t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${G.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${X}((zero_point_word) & ${t.bits === 2 ? "0x3u" : "0xFu"});` : `
            // The default zero point is ${Math.pow(2, t.bits - 1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${X}(${Math.pow(2, t.bits - 1).toFixed(1)});`}
            let scale = ${O.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${F.getByIndices(`${F.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize / d};
            for (var i: u32 = 0; i < ${c}; i++) {
              let b_value = ${c === 1 ? "b_data" : "b_data[i]"};
              ${(() => {
        let q = Math.floor(_ / 8), N = "";
        for (let D = 0; D < q; D++) {
          let de = D * t.bits * 4, he = de + t.bits;
          N += `
              ${E()}
              {${t.bits === 2 ? `
                let half_word = b_value >> ${D * 16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);` : `
                let b_value_lower = unpack4xU8((b_value >> ${de}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${he}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${X}>(${Array.from({ length: 4 }, (ne, fe) => `${X}(b_value_lower[${fe}]), ${X}(b_value_upper[${fe}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${X}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({ length: 2 }, (ne, fe) => `${`dot(a_data${fe}, b_dequantized_values[${fe}])`}`).join(" + ")};
              }
              word_offset += ${8 / d};`;
        }
        return N;
      })()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${g}) {
            var output_value: ${L.type.value} = ${L.type.value}(0);
            for (var b = 0u; b < ${y}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${L.setByIndices(`${L.type.indices}(batch, row, col + local_idx)`, "output_value")}
            }
          }
        }`;
    };
    return { name: "BlockwiseMatMulNBits32", shaderCache: { hint: `${t.blockSize};${d};${c};${y};${g}`, inputDependencies: Array(e.length).fill("rank") }, getRunData: () => ({ outputs: [{ dims: h, dataType: p }], dispatchGroup: { x: b }, programUniforms: x }), getShaderSource: C };
  }, ud = (e, t) => {
    ms(e.inputs, t), t.blockSize === 32 && e.adapterInfo.isVendor("intel") && e.adapterInfo.isArchitecture("gen-12lp") ? e.compute(_s(e.inputs, t)) : e.compute(gs(e.inputs, t));
  }, ld = (e) => Y(e);
}), ys, $s, ws, bs, vs, xs, ks, Ss, dd, ic = z(() => {
  V(), H(), j(), ys = (e) => {
    if (!e || e.length < 1) throw new Error("Too few inputs");
    if (e[0].dataType !== 1 && e[0].dataType !== 10) throw new Error("Input type must be float or float16.");
    if (e.length >= 2) {
      let t = e[0].dims.length * 2 === e[1].dims[0];
      if (e.length === 4 && (t = e[3].dims[0] * 2 === e[1].dims[0]), !t) throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].");
    }
  }, $s = (e, t, i) => {
    let r = "";
    for (let a = t - 1; a >= 0; --a) r += `
            k = i32(${e.indicesGet("indices", a)}) - ${U("uniforms.pads", a, i)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${U("uniforms.x_shape", a, t)})) {
              break;
            }
            offset += k * i32(${U("uniforms.x_strides", a, t)});
        `;
    return `
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${r}
            value = x[offset];
          }
      `;
  }, ws = (e, t, i) => {
    let r = "";
    for (let a = t - 1; a >= 0; --a) r += `
                k = i32(${e.indicesGet("indices", a)}) - ${U("uniforms.pads", a, i)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${U("uniforms.x_shape", a, t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${U("uniforms.x_shape", a, t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${U("uniforms.x_strides", a, t)});
            `;
    return `
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `;
  }, bs = (e, t, i) => {
    let r = "";
    for (let a = t - 1; a >= 0; --a) r += `
                k = i32(${e.indicesGet("indices", a)}) - ${U("uniforms.pads", a, i)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${U("uniforms.x_shape", a, t)})) {
                  k = i32(${U("uniforms.x_shape", a, t)}) - 1;
                }
                offset += k * i32(${U("uniforms.x_strides", a, t)});
            `;
    return `
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `;
  }, vs = (e, t, i) => {
    let r = "";
    for (let a = t - 1; a >= 0; --a) r += `
                k = i32(${e.indicesGet("indices", a)}) - ${U("uniforms.pads", a, i)};
                if (k < 0)  {
                  k += i32(${U("uniforms.x_shape", a, t)}]);
                }
                if (k >= i32(${U("uniforms.x_shape", a, t)})) {
                  k -= i32(${U("uniforms.x_shape", a, t)});
                }
                offset += k * i32(${U("uniforms.x_strides", a, t)});
            `;
    return `
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `;
  }, xs = (e, t, i) => {
    switch (i.mode) {
      case 0:
        return $s(e, t, i.pads.length);
      case 1:
        return ws(e, t, i.pads.length);
      case 2:
        return bs(e, t, i.pads.length);
      case 3:
        return vs(e, t, i.pads.length);
      default:
        throw new Error("Invalid mode");
    }
  }, ks = (e, t) => {
    let i = k.padShape(e[0].dims.slice(), t.pads), r = e[0].dims, a = k.size(i), n = [{ type: 12, data: a }, { type: 6, data: t.pads }], s = e.length >= 3 && e[2].data;
    t.mode === 0 && n.push({ type: s ? e[2].dataType : 1, data: t.value }), n.push(...P(e[0].dims, i));
    let o = ["rank"], u = (l) => {
      let p = A("output", e[0].dataType, i.length), d = I("x", e[0].dataType, r.length), c = d.type.value, h = xs(p, r.length, t), f = [{ name: "output_size", type: "u32" }, { name: "pads", type: "i32", length: t.pads.length }];
      return t.mode === 0 && f.push({ name: "constant_value", type: s ? c : "f32" }), `
            ${l.registerUniforms(f).declareVariables(d, p)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${p.offsetToIndices("global_idx")};

            var value = ${c}(0);
            ${h}
            output[global_idx] = value;
        }`;
    };
    return { name: "Pad", shaderCache: { hint: `${t.mode}${s}`, inputDependencies: o }, getRunData: () => ({ outputs: [{ dims: i, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(k.size(i) / 64) }, programUniforms: n }), getShaderSource: u };
  }, Ss = (e, t) => {
    if (e.length > 1) {
      let i = e[1].getBigInt64Array(), r = e.length >= 3 && e[2].data ? e[2].dataType === 10 ? e[2].getUint16Array()[0] : e[2].getFloat32Array()[0] : 0, a = e[0].dims.length, n = new Int32Array(2 * a).fill(0);
      if (e.length >= 4) {
        let o = e[3].getBigInt64Array();
        for (let u = 0; u < o.length; u++) n[Number(o[u])] = Number(i[u]), n[Number(o[u]) + a] = Number(i[u + o.length]);
      } else i.forEach((o, u) => n[Number(u)] = Number(o));
      let s = [];
      return n.forEach((o) => s.push(o)), { mode: t.mode, value: r, pads: s };
    } else return t;
  }, dd = (e, t) => {
    ys(e.inputs);
    let i = Ss(e.inputs, t);
    e.compute(ks(e.inputs, i), { inputs: [0] });
  };
}), pt, Ti, Ei, zi, Ci, Is, Ts, Oi, Bi, pd, cd, Ri, hd, fd, Ai, md, gd, _d, yd, rc = z(() => {
  we(), V(), H(), j(), pt = (e) => {
    if (te.webgpu.validateInputContent && (!e || e.length !== 1)) throw new Error("Pool ops requires 1 input.");
  }, Ti = (e, t, i) => {
    let r = t.format === "NHWC", a = e.dims.slice();
    r && a.splice(1, 0, a.pop());
    let n = Object.hasOwnProperty.call(t, "dilations"), s = t.kernelShape.slice(), o = t.strides.slice(), u = n ? t.dilations.slice() : [], l = t.pads.slice();
    qt.adjustPoolAttributes(i, a, s, o, u, l);
    let p = qt.computePoolOutputShape(i, a, o, u, s, l, t.autoPad), d = Object.assign({}, t);
    n ? Object.assign(d, { kernelShape: s, strides: o, pads: l, dilations: u, cacheKey: t.cacheKey }) : Object.assign(d, { kernelShape: s, strides: o, pads: l, cacheKey: t.cacheKey });
    let c = p.slice();
    return c.push(c.splice(1, 1)[0]), [d, r ? c : p];
  }, Ei = (e, t) => {
    let i = t.format === "NHWC", r = k.size(e), a = k.size(t.kernelShape), n = [{ type: 12, data: r }, { type: 12, data: a }], s = [{ name: "outputSize", type: "u32" }, { name: "kernelSize", type: "u32" }];
    if (t.kernelShape.length <= 2) {
      let o = t.kernelShape[t.kernelShape.length - 1], u = t.strides[t.strides.length - 1], l = t.pads[t.pads.length / 2 - 1], p = t.pads[t.pads.length - 1], d = !!(l + p);
      n.push({ type: 12, data: o }, { type: 12, data: u }, { type: 12, data: l }, { type: 12, data: p }), s.push({ name: "kw", type: "u32" }, { name: "sw", type: "u32" }, { name: "pwStart", type: "u32" }, { name: "pwEnd", type: "u32" });
      let c = !1;
      if (t.kernelShape.length === 2) {
        let h = t.kernelShape[t.kernelShape.length - 2], f = t.strides[t.strides.length - 2], g = t.pads[t.pads.length / 2 - 2], y = t.pads[t.pads.length - 2];
        c = !!(g + y), n.push({ type: 12, data: h }, { type: 12, data: f }, { type: 12, data: g }, { type: 12, data: y }), s.push({ name: "kh", type: "u32" }, { name: "sh", type: "u32" }, { name: "phStart", type: "u32" }, { name: "phEnd", type: "u32" });
      }
      return [n, s, !0, d, c];
    } else {
      if (i) throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");
      let o = k.computeStrides(t.kernelShape);
      n.push({ type: 12, data: o }, { type: 12, data: t.pads }, { type: 12, data: t.strides }), s.push({ name: "kernelStrides", type: "u32", length: o.length }, { name: "pads", type: "u32", length: t.pads.length }, { name: "strides", type: "u32", length: t.strides.length });
      let u = t.pads.reduce((l, p) => l + p);
      return [n, s, !!u, !1, !1];
    }
  }, zi = (e, t, i, r, a, n, s, o, u, l, p, d) => {
    let c = a.format === "NHWC", h = t.type.value, f = A("output", t.type.tensor, r);
    if (a.kernelShape.length <= 2) {
      let g = "", y = "", _ = "", m = i - (c ? 2 : 1);
      if (p ? g = `
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${m}] = indices[${m}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${m}] < 0 || xIndices[${m}]
                      >= uniforms.x_shape[${m}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }` : g = `
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${m}] = indices[${m}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`, a.kernelShape.length === 2) {
        let w = i - (c ? 3 : 2);
        d ? y = `
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${w}] < 0 || xIndices[${w}] >= uniforms.x_shape[${w}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              ` : y = `
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sh - uniforms.phStart + j;
                `, _ = `
              }
            `;
      }
      return `
            ${e.registerUniforms(u).declareVariables(t, f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var value = ${h}(${o});
              var pad = 0;
              ${y}
              ${g}
              ${_}
              ${s}

              output[global_idx] = value;
            }`;
    } else {
      if (c) throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");
      let g = a.kernelShape.length, y = a.pads.length, _ = "";
      return l ? _ = `
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }` : _ = `
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `, `
            ${e.registerUniforms(u).declareVariables(t, f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var offsets: array<u32, ${g}>;

              var value = ${h}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${g - 1}u; j++) {
                  offsets[j] = offset / ${U("uniforms.kernelStrides", "j", g)};
                  offset -= offsets[j] * ${U("uniforms.kernelStrides", "j", g)};
                }
                offsets[${g - 1}] = offset;

                isPad = false;
                for (var j = ${i - g}u; j < ${i}u; j++) {
                  xIndices[j] = indices[j] * ${U("uniforms.strides", `j - ${i - g}u`, g)}
                    + offsets[j - ${i - g}u] - ${U("uniforms.pads", "j - 2u", y)};
                  ${_}
              }
              ${s}

              output[global_idx] = value;
            }`;
    }
  }, Ci = (e) => `${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`, Is = (e) => `${Ci(e)};${e.countIncludePad}`, Ts = (e) => `${Ci(e)};${e.storageOrder};${e.dilations}`, Oi = (e) => ({ format: e.format, autoPad: ["NOTSET", "VALID", "SAME_UPPER", "SAME_LOWER"][e.auto_pad], ceilMode: e.ceil_mode, kernelShape: e.kernel_shape, strides: e.strides, pads: e.pads }), Bi = (e, t, i, r) => {
    let [a, n] = Ti(t, r, i), s = I("x", t.dataType, t.dims.length), o = s.type.value, u = "value += x_val;", l = "";
    a.countIncludePad ? l += `value /= ${o}(uniforms.kernelSize);` : l += `value /= ${o}(i32(uniforms.kernelSize) - pad);`;
    let [p, d, c, h, f] = Ei(n, a);
    p.push(...P(t.dims, n));
    let g = ["rank"];
    return { name: e, shaderCache: { hint: `${r.cacheKey};${c};${h};${f}`, inputDependencies: g }, getRunData: () => ({ outputs: [{ dims: n, dataType: t.dataType }], dispatchGroup: { x: Math.ceil(k.size(n) / 64) }, programUniforms: p }), getShaderSource: (y) => zi(y, s, t.dims.length, n.length, a, u, l, 0, d, c, h, f) };
  }, pd = (e) => {
    let t = e.count_include_pad !== 0, i = Oi(e);
    if (i.ceilMode !== 0) throw new Error("using ceil() in shape computation is not yet supported for AveragePool");
    let r = { countIncludePad: t, ...i, cacheKey: "" };
    return { ...r, cacheKey: Is(r) };
  }, cd = (e, t) => {
    pt(e.inputs), e.compute(Bi("AveragePool", e.inputs[0], !1, t));
  }, Ri = { autoPad: "", ceilMode: 0, countIncludePad: !1, kernelShape: [], strides: [], pads: [], storageOrder: 0, dilations: [] }, hd = (e) => {
    let t = e.format;
    return { format: t, ...Ri, cacheKey: t };
  }, fd = (e, t) => {
    pt(e.inputs), e.compute(Bi("GlobalAveragePool", e.inputs[0], !0, t));
  }, Ai = (e, t, i, r) => {
    let [a, n] = Ti(t, r, i), s = `
      value = max(x_val, value);
    `, o = "", u = I("x", t.dataType, t.dims.length), l = ["rank"], [p, d, c, h, f] = Ei(n, a);
    return p.push(...P(t.dims, n)), { name: e, shaderCache: { hint: `${r.cacheKey};${c};${h};${f}`, inputDependencies: l }, getRunData: () => ({ outputs: [{ dims: n, dataType: t.dataType }], dispatchGroup: { x: Math.ceil(k.size(n) / 64) }, programUniforms: p }), getShaderSource: (g) => zi(g, u, t.dims.length, n.length, a, s, o, t.dataType === 10 ? -65504 : -1e5, d, c, h, f) };
  }, md = (e, t) => {
    pt(e.inputs), e.compute(Ai("MaxPool", e.inputs[0], !1, t));
  }, gd = (e) => {
    let t = e.storage_order, i = e.dilations, r = Oi(e);
    if (t !== 0) throw new Error("column major storage order is not yet supported for MaxPool");
    if (r.ceilMode !== 0) throw new Error("using ceil() in shape computation is not yet supported for MaxPool");
    let a = { storageOrder: t, dilations: i, ...r, cacheKey: "" };
    return { ...a, cacheKey: Ts(a) };
  }, _d = (e) => {
    let t = e.format;
    return { format: t, ...Ri, cacheKey: t };
  }, yd = (e, t) => {
    pt(e.inputs), e.compute(Ai("GlobalMaxPool", e.inputs[0], !0, t));
  };
}), Es, zs, $d, wd, ac = z(() => {
  V(), H(), ae(), j(), Es = (e, t) => {
    if (e.length < 2 || e.length > 3) throw new Error("DequantizeLinear requires 2 or 3 inputs.");
    if (e.length === 3 && e[1].dims === e[2].dims) throw new Error("x-scale and x-zero-point must have the same shape.");
    if (e.length === 3 && e[0].dataType !== e[2].dataType) throw new Error("x and x-zero-point must have the same data type.");
    if (e[1].dims.length !== 0 && e[1].dims.length !== 1 && e[1].dims.length !== e[0].dims.length) throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");
    if (e.length > 2) {
      if (e[0].dataType !== e[2].dataType) throw new Error("x and x-zero-point must have the same data type.");
      if (e[1].dims.length !== e[2].dims.length) throw new Error("scale and zero-point inputs must have the same rank.");
      if (!e[1].dims.map((i, r) => i === e[2].dims[r]).reduce((i, r) => i && r, !0)) throw new Error("scale and zero-point inputs must have the same shape.");
    }
    if (t.blockSize > 0) {
      if (e[1].dims.length === 0 || e[1].dims.length === 1 && e[1].dims[0] === 1) throw new Error("blockSize must be set only for block quantization.");
      if (!e[1].dims.map((a, n) => n === t.axis || a === e[0].dims[n]).reduce((a, n) => a && n, !0)) throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");
      if (e[1].dims.length !== e[0].dims.length) throw new Error("For block qunatization the scale input rank must be the same as the x rank.");
      let i = e[0].dims[t.axis], r = e[1].dims[t.axis];
      if (t.blockSize < Math.ceil(i / r) || t.blockSize > Math.ceil(i / (r - 1) - 1)) throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].");
    }
  }, zs = (e, t) => {
    let i = k.normalizeAxis(t.axis, e[0].dims.length), r = e[0].dataType, a = r === 3, n = e[0].dims, s = e[1].dataType, o = k.size(n), u = r === 3 || r === 2, l = u ? [Math.ceil(k.size(e[0].dims) / 4)] : e[0].dims, p = e[1].dims, d = e.length > 2 ? e[2] : void 0, c = d ? u ? [Math.ceil(k.size(d.dims) / 4)] : d.dims : void 0, h = p.length === 0 || p.length === 1 && p[0] === 1, f = h === !1 && p.length === 1, g = re(o), y = h && (!u || g === 4), _ = y ? g : 1, m = y && !u ? g : 1, w = I("input", u ? 12 : r, l.length, m), $ = I("scale", s, p.length), b = d ? I("zero_point", u ? 12 : r, c.length) : void 0, x = A("output", s, n.length, _), v = [w, $];
    b && v.push(b);
    let S = [l, p];
    d && S.push(c);
    let T = [{ type: 12, data: o / _ }, { type: 12, data: i }, { type: 12, data: t.blockSize }, ...P(...S, n)], C = (W) => {
      let B = [{ name: "output_size", type: "u32" }, { name: "axis", type: "u32" }, { name: "block_size", type: "u32" }];
      return `
      ${W.registerUniforms(B).declareVariables(...v, x)}
      ${W.mainStart()}
          ${W.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${x.offsetToIndices("global_idx")};

          // Set input x
          ${u ? `
            let input = ${w.getByOffset("global_idx / 4")};
            let x_vec = ${a ? "unpack4xI8(input)" : "unpack4xU8(input)"};
            let x_value = ${_ === 1 ? "x_vec[global_idx % 4]" : "x_vec"};` : `let x_value = ${w.getByOffset("global_idx")};`};

          // Set scale input
          ${h ? `let scale_value= ${$.getByOffset("0")}` : f ? `
            let scale_index = ${x.indicesGet("output_indices", "uniforms.axis")};
            let scale_value= ${$.getByOffset("scale_index")};` : `
            var scale_indices: ${$.type.indices} = output_indices;
            let index = ${$.indicesGet("scale_indices", "uniforms.axis")} / uniforms.block_size;
            ${$.indicesSet("scale_indices", "uniforms.axis", "index")};
            let scale_value= ${$.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${b ? h ? u ? `
                let zero_point_input = ${b.getByOffset("0")};
                let zero_point_vec =  ${a ? "unpack4xI8(zero_point_input)" : "unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]` : `let zero_point_value = ${b.getByOffset("0")}` : f ? u ? `
                let zero_point_index = ${x.indicesGet("output_indices", "uniforms.axis")};
                let zero_point_input = ${b.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a ? "unpack4xI8(zero_point_input)" : "unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]` : `
                let zero_point_index = ${x.indicesGet("output_indices", "uniforms.axis")};
                let zero_point_value = ${b.getByOffset("zero_point_index")};` : u ? `
                let zero_point_offset = ${$.indicesToOffset("scale_indices")};
                let zero_point_input = ${b.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a ? "unpack4xI8(zero_point_input)" : "unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];` : `let zero_point_value = ${b.getByIndices("scale_indices")};` : `let zero_point_value = ${u ? a ? "i32" : "u32" : w.type.value}(0);`};
      // Compute and write output
      ${x.setByOffset("global_idx", `${x.type.value}(x_value - zero_point_value) * scale_value`)};
      }`;
    };
    return { name: "DequantizeLinear", shaderCache: { hint: t.cacheKey, inputDependencies: b ? ["rank", "rank", "rank"] : ["rank", "rank"] }, getShaderSource: C, getRunData: () => ({ outputs: [{ dims: n, dataType: s }], dispatchGroup: { x: Math.ceil(o / _ / 64), y: 1, z: 1 }, programUniforms: T }) };
  }, $d = (e, t) => {
    Es(e.inputs, t), e.compute(zs(e.inputs, t));
  }, wd = (e) => Y({ axis: e.axis, blockSize: e.blockSize });
}), Cs, Os, bd, nc = z(() => {
  we(), V(), j(), Cs = (e, t, i) => {
    let r = e === t, a = e < t && i < 0, n = e > t && i > 0;
    if (r || a || n) throw new Error("Range these inputs' contents are invalid.");
  }, Os = (e, t, i, r) => {
    let a = Math.abs(Math.ceil((t - e) / i)), n = [a], s = a, o = [{ type: 12, data: s }, { type: r, data: e }, { type: r, data: i }, ...P(n)], u = (l) => {
      let p = A("output", r, n.length), d = p.type.value, c = [{ name: "outputSize", type: "u32" }, { name: "start", type: d }, { name: "delta", type: d }];
      return `
        ${l.registerUniforms(c).declareVariables(p)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${d}(global_idx) * uniforms.delta;
      }`;
    };
    return { name: "Range", shaderCache: { hint: `${r}` }, getShaderSource: u, getRunData: () => ({ outputs: [{ dims: n, dataType: r }], dispatchGroup: { x: Math.ceil(s / 64) }, programUniforms: o }) };
  }, bd = (e) => {
    let t = 0, i = 0, r = 0;
    e.inputs[0].dataType === 6 ? (t = e.inputs[0].getInt32Array()[0], i = e.inputs[1].getInt32Array()[0], r = e.inputs[2].getInt32Array()[0]) : e.inputs[0].dataType === 1 && (t = e.inputs[0].getFloat32Array()[0], i = e.inputs[1].getFloat32Array()[0], r = e.inputs[2].getFloat32Array()[0]), te.webgpu.validateInputContent && Cs(t, i, r), e.compute(Os(t, i, r, e.inputs[0].dataType), { inputs: [] });
  };
}), Bs, Rs, vd, xd, sc = z(() => {
  V(), H(), ae(), j(), Bs = (e, t, i, r) => {
    if (e !== "none" && r !== "i32" && r !== "u32" && r !== "f32") throw new Error(`Input ${r} is not supported with reduction ${e}.`);
    let a = `{
                var oldValue = 0;
                loop {
                  let newValueF32 =`, n = `;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;
    switch (e) {
      case "none":
        return `${t}=${i};`;
      case "add":
        return r === "i32" || r === "u32" ? `atomicAdd(&${t}, bitcast<${r}>(${i}));` : `
              ${a}bitcast<${r}>(oldValue) + (${i})${n}`;
      case "max":
        return r === "i32" || r === "u32" ? `atomicMax(&${t}, bitcast<${r}>(${i}));` : `
                ${a}max(bitcast<f32>(oldValue), (${i}))${n}`;
      case "min":
        return r === "i32" || r === "u32" ? `atomicMin(&${t}, bitcast<${r}>(${i}));` : `${a}min(bitcast<${r}>(oldValue), (${i}))${n}`;
      case "mul":
        return `${a}(bitcast<${r}>(oldValue) * (${i}))${n}`;
      default:
        throw new Error(`Reduction ${e} is not supported.`);
    }
  }, Rs = (e, t) => {
    let i = e[0].dims, r = e[1].dims, a = i, n = 1, s = Math.ceil(k.sizeToDimension(r, r.length - 1) / n), o = r[r.length - 1], u = k.sizeFromDimension(i, o), l = [{ type: 12, data: s }, { type: 12, data: o }, { type: 12, data: u }, ...P(e[1].dims, e[2].dims, a)], p = (d) => {
      let c = I("indices", e[1].dataType, e[1].dims.length), h = I("updates", e[2].dataType, e[2].dims.length, n), f = t.reduction !== "none" && t.reduction !== "" ? Qo("output", e[0].dataType, a.length) : A("output", e[0].dataType, a.length, n);
      return `
      ${d.registerUniform("output_size", "u32").registerUniform("last_index_dimension", "u32").registerUniform("num_updates_elements", "u32").declareVariables(c, h, f)}
      ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length === 1 ? `
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;` : `
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${Bs(t.reduction, "output[data_offset + i]", "value", f.type.value)}
  }

      }`;
    };
    return { name: "ScatterND", shaderCache: { hint: `${t.cacheKey}_${t.reduction}`, inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: a, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(s / 64) }, programUniforms: l }), getShaderSource: p };
  }, vd = (e) => Y({ reduction: e.reduction }), xd = (e, t) => {
    e.compute(Rs(e.inputs, t), { inputs: [e.inputs[1], e.inputs[2]], outputs: [] });
  };
}), As, Ms, Ds, Mi, Us, Ps, Ns, qs, Vs, Ls, Ws, Gs, Di, Fs, Hs, Ks, js, Xs, kd, Sd, oc = z(() => {
  V(), H(), ae(), j(), As = (e, t) => {
    if (e.every((i) => i > 0 || (() => {
      throw new Error("Resize requires scales input values to be positive");
    })), e.length > 0) {
      if (t.mode === "linear") {
        if (!(e.length === 2 || e.length === 3 || e.length === 4 && e[0] === 1 && e[1] === 1 || e.length === 4 && e[0] === 1 && e[3] === 1 || e.length === 5 && e[0] === 1 && e[1] === 1)) throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`);
      } else if (t.mode === "cubic" && !(e.length === 2 || e.length === 4 && e[0] === 1 && e[1] === 1 || e.length === 4 && e[0] === 1 && e[3] === 1)) throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode");
    }
  }, Ms = (e, t, i) => {
    t.every((a) => a >= 0 && a < i || (() => {
      throw new Error("Resize requires axes input values to be positive and less than rank");
    }));
    let r = new Array(i).fill(1);
    return t.forEach((a, n) => r[a] = e[n]), r;
  }, Ds = (e, t, i, r, a, n) => {
    let [s, o, u] = i > 10 ? [1, 2, 3] : [-1, e.length > 1 ? 1 : -1, -1], l = e[0].dims.length;
    if (s > 0 && e.length > s && e[s].dims.length > 0) e[s].getFloat32Array().forEach((p) => n.push(p));
    else if (t.coordinateTransformMode === "tf_crop_and_resize") throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");
    if (o > 0 && e.length > o && e[o].dims.length === 1 && e[o].dims[0] > 0) {
      if (e[o].getFloat32Array().forEach((p) => r.push(p)), r.length !== 0 && r.length !== l && i >= 18 && r.length !== t.axes.length) throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");
      As(r, t), t.axes.length > 0 && Ms(r, t.axes, l).forEach((p, d) => r[d] = p);
    }
    if (u > 0 && e.length > u && e[u].dims.length === 1 && e[u].dims[0] > 0 && (e[u].getBigInt64Array().forEach((p) => a.push(Number(p))), a.length !== 0 && a.length !== l && i >= 18 && a.length !== t.axes.length)) throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");
    if (t.axes.length > 0) {
      if (r.length !== 0 && r.length !== t.axes.length) throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');
      if (a.length !== 0 && a.length !== t.axes.length) throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified');
    }
    if (typeof r < "u" && typeof a < "u" && r.length > 0 && a.length > l) throw new Error("Resize requires only of scales or sizes to be specified");
  }, Mi = (e, t, i, r) => `
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${r}(big / (${i}));
  let fract = ${r}(big % (${i})) / ${r}(${i});
  return whole + fract;
`, Us = (e, t) => `fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { ` + (() => {
    switch (e) {
      case "asymmetric":
        return `
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Mi("xResized", "lengthOriginal", "lengthResized", t)}
          }
        `;
      case "pytorch_half_pixel":
        return `if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;
      case "tf_half_pixel_for_nn":
        return `return (${t}(xResized) + 0.5) / ${t}(xScale);`;
      case "align_corners":
        return `if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Mi("xResized", "lengthOriginal - 1", "lengthResized - 1", t)}
                  }`;
      case "tf_crop_and_resize":
        return `if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;
      case "half_pixel_symmetric":
        return `const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;
      case "half_pixel":
        return `return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;
      default:
        throw new Error(`Coordinate transform mode ${e} is not supported`);
    }
  })() + "}", Ps = (e, t, i) => `fn getNearestPixelFromOriginal(xOriginal: ${i}, isDownSample: bool) -> ${i} {` + (() => {
    switch (e) {
      case "round_prefer_ceil":
        return "if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";
      case "floor":
        return "return floor(xOriginal);";
      case "ceil":
        return "return ceil(xOriginal);";
      case "round_prefer_floor":
        return "if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";
      case "simple":
      default:
        if (t < 11) return "if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";
        throw new Error(`Nearest mode ${e} is not supported`);
    }
  })() + "}", Ns = (e, t, i) => {
    let r = new Array(i).fill(0).concat(new Array(i).fill(1)), a = e.length === 0 ? r : e.slice();
    return t.length > 0 ? (t.forEach((n, s) => {
      r[n] = a[s], r[s + i] = a[t.length + s];
    }), r) : a;
  }, qs = (e, t, i, r) => {
    let a = [];
    if (i.length > 0) if (r.length > 0) {
      if (e.forEach((n) => a.push(n)), Math.max(...r) > e.length) throw new Error("axes is out of bound");
      r.forEach((n, s) => a[n] = i[s]);
    } else i.forEach((n) => a.push(n));
    else {
      if (t.length === 0) throw new Error("Resize requires either scales or sizes.");
      a = e.map((n, s) => Math.round(n * t[s]));
    }
    return a;
  }, Vs = (e, t, i) => {
    let r = (() => {
      switch (i.keepAspectRatioPolicy) {
        case "not_larger":
          return i.axes.length > 0 ? Math.min(...i.axes.map((n) => t[n]), Number.MAX_VALUE) : Math.min(...t, Number.MAX_VALUE);
        case "not_smaller":
          return i.axes.length > 0 ? Math.max(...i.axes.map((n) => t[n]), Number.MIN_VALUE) : Math.max(...t, Number.MIN_VALUE);
        default:
          throw new Error(`Keep aspect ratio policy ${i.keepAspectRatioPolicy} is not supported`);
      }
    })();
    t.fill(1, 0, t.length);
    let a = e.slice();
    return i.axes.length > 0 ? (i.axes.forEach((n) => t[n] = r), i.axes.forEach((n) => a[n] = Math.round(e[n] * t[n]))) : (t.fill(r, 0, t.length), a.forEach((n, s) => a[s] = Math.round(n * t[s]))), a;
  }, Ls = (e, t, i, r, a) => `
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${i.length}> {
      var original_indices: array<${e.type.value}, ${i.length}>;
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${e.indicesGet("output_indices", "i")};
        var scale = ${U("uniforms.scales", "i", r)};
        var roi_low = ${U("uniforms.roi", "i", a)};
        var roi_hi = ${U("uniforms.roi", `i + ${t.length}`, a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${U("uniforms.input_shape", "i", t.length)};
          var output_shape_i = ${U("uniforms.output_shape", "i", i.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`, Ws = (e, t, i, r, a, n, s) => `
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${t.indicesGet("output_indices", "i")};
        var input_index: u32;
        var scale = ${U("uniforms.scales", "i", a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${U("uniforms.roi", "i", n)};
          var roi_hi = ${U("uniforms.roi", `i + ${i.length}`, n)};
          var input_shape_i = ${U("uniforms.input_shape", "i", i.length)};
          var output_shape_i = ${U("uniforms.output_shape", "i", r.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices", "i", "input_index")}
      }
      return input_indices;
    }`, Gs = (e, t) => `
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices", "i")};
        if (input_index < 0 || input_index >= ${U("uniforms.input_shape", "i", t.length)}) {
          return false;
        }
      }
      return true;
    }`, Di = (e, t, i, r) => e.rank > r ? `
    ${e.indicesSet("input_indices", t, "channel")};
    ${e.indicesSet("input_indices", i, "batch")};
` : "", Fs = (e, t, i, r, a) => {
    let [n, s, o, u] = i.length === 2 ? [-1, 0, 1, -1] : [0, 2, 3, 1], l = e.type.value;
    return `
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices", s, `max(0, min(row, ${i[s]} - 1))`)};
      ${e.indicesSet("input_indices", o, `max(0, min(col, ${i[o]} - 1))`)};
      ${Di(e, u, n, 2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${s}];
      var col:${l} = originalIndices[${o}];
      ${r ? `if (row < 0 || row > (${i[s]} - 1) || col < 0 || col > (${i[o]} - 1)) {
        return ${a};
      }` : ""};
      row = max(0, min(row, ${i[s]} - 1));
      col = max(0, min(col, ${i[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${i.length > 2 ? `u32(originalIndices[${u}])` : "0"};
      var batch: u32 =  ${i.length > 2 ? `u32(originalIndices[${n}])` : "0"};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`;
  }, Hs = (e, t, i, r, a, n, s, o, u, l) => {
    let p = i.length === 2, [d, c] = p ? [0, 1] : [2, 3], h = e.type.value, f = (g) => {
      let y = g === d ? "row" : "col";
      return `
      fn ${y}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${h} {
        var output_index = ${t.indicesGet("output_indices", g)};
        var originalIdx: ${h} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[g]},
        ${r[g]}, ${i[g]}, ${n[g]}, ${n[g]} + ${i.length});
        var fractOriginalIdx: ${h} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${i[g]} - 1))) {
          return ${u};
        }
        var data: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${y}: ${h} = originalIdx + ${h}(i);
          if (${y} < 0 || ${y} >= ${i[g]}) {
            ${l ? `coefs[i + 1] = 0.0;
                        continue;` : o ? `return ${u};` : `${y} = max(0, min(${y}, ${i[g]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy", g, `u32(${y})`)};
          data[i + 1] = ${g === d ? e.getByIndices("input_indices_copy") : "rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`;
    };
    return `
    ${f(d)};
    ${f(c)};
  fn getCubicInterpolationCoefs(s: ${h}) -> array<${h}, 4> {
    var absS = abs(s);
    var coeffs: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${h} = 1.0 - absS;
    var twoMinusAbsS: ${h} = 2.0 - absS;
    var onePlusAbsS: ${h} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${h}, 4>, coefs: array<${h}, 4>) -> ${h} {
    var coefsSum: ${h} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${h} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `;
  }, Ks = (e, t, i, r, a) => {
    let [n, s, o, u, l] = i.length === 3 ? [-1, 0, 1, 2, -1] : [0, 2, 3, 4, 1], p = e.type.value;
    return `
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices", s, `max(0, min(depth, ${i[s]} - 1))`)};
      ${e.indicesSet("input_indices", o, `max(0, min(height, ${i[o]} - 1))`)};
      ${e.indicesSet("input_indices", u, `max(0, min(width, ${i[u]} - 1))`)};
      ${Di(e, l, n, 3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${p} = originalIndices[${s}];
      var height:${p} = originalIndices[${o}];
      var width:${p} = originalIndices[${u}];
      ${r ? `if (depth < 0 || depth > (${i[s]} - 1) || height < 0 || height > (${i[o]} - 1) || width < 0 || (width > ${i[u]} - 1)) {
      return ${a};
        }` : ""};

    depth = max(0, min(depth, ${i[s]} - 1));
      height = max(0, min(height, ${i[o]} - 1));
      width = max(0, min(width, ${i[u]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${i.length > 3 ? `u32(originalIndices[${l}])` : "0"};
      var batch: u32 =  ${i.length > 3 ? `u32(originalIndices[${n}])` : "0"};

      var x111: ${p} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${p} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${p} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${p} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${p} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${p} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${p} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${p} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${p} = abs(depth - ${p}(depth1));
      var dx2: ${p} = abs(${p}(depth2) - depth);
      var dy1: ${p} = abs(height - ${p}(height1));
      var dy2: ${p} = abs(${p}(height2) - height);
      var dz1: ${p} = abs(width - ${p}(width1));
      var dz2: ${p} = abs(${p}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`;
  }, js = (e, t, i, r, a, n) => {
    let s = e.dims, o = Ns(n, t.axes, s.length), u = qs(s, r, a, t.axes), l = r.slice();
    r.length === 0 && (l = s.map((m, w) => m === 0 ? 1 : u[w] / m), t.keepAspectRatioPolicy !== "stretch" && (u = Vs(s, l, t)));
    let p = A("output", e.dataType, u.length), d = I("input", e.dataType, s.length), c = k.size(u), h = s.length === u.length && s.every((m, w) => m === u[w]), f = t.coordinateTransformMode === "tf_crop_and_resize", g = t.extrapolationValue, y = d.type.value, _ = (m) => `
      ${h ? "" : `
      ${Us(t.coordinateTransformMode, y)};
      ${(() => {
      switch (t.mode) {
        case "nearest":
          return `
              ${Gs(d, s)};
              ${Ps(t.nearestMode, i, y)};
              ${Ws(d, p, s, u, l.length, o.length, f)};
              `;
        case "linear":
          return `
              ${Ls(p, s, u, l.length, o.length)};
              ${(() => {
            if (s.length === 2 || s.length === 4) return `${Fs(d, p, s, f, g)}`;
            if (s.length === 3 || s.length === 5) return `${Ks(d, p, s, f, g)}`;
            throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.");
          })()};
            `;
        case "cubic":
          return `
            ${(() => {
            if (s.length === 2 || s.length === 4) return `${Hs(d, p, s, u, l, o, t.cubicCoeffA, f, t.extrapolationValue, t.excludeOutside)}`;
            throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.");
          })()};
            `;
        default:
          throw Error("Invalid resize mode");
      }
    })()};
      `}
      ${m.registerUniform("output_size", "u32").registerUniform("scales", "f32", l.length).registerUniform("roi", "f32", o.length).declareVariables(d, p)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${h ? "output[global_idx] = input[global_idx];" : `
        let output_indices = ${p.offsetToIndices("global_idx")};
        var input_indices: ${d.type.indices};
        ${(() => {
      switch (t.mode) {
        case "nearest":
          return `input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${d.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;
        case "linear":
          return `output[global_idx] = ${s.length === 2 || s.length === 4 ? "bilinearInterpolation" : "trilinearInterpolation"}(output_indices);`;
        case "cubic":
          return "output[global_idx] = bicubicInterpolation(output_indices);";
        default:
          throw Error(`Unsupported resize mode: ${t.mode}`);
      }
    })()};
`}
      }`;
    return { name: "Resize", shaderCache: { hint: `${t.cacheKey}|${i}|${l.length > 0 ? t.mode === "cubic" ? l : l.length : ""}|${a.length > 0 ? a : ""}|${o.length > 0 ? o : ""}|${h}|${t.mode === "nearest" ? s.length : s}`, inputDependencies: ["rank"] }, getShaderSource: _, getRunData: () => ({ outputs: [{ dims: u, dataType: e.dataType }], dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: [{ type: 12, data: c }, { type: 1, data: l }, { type: 1, data: o }, ...P(s, u)] }) };
  }, Xs = (e) => {
    let t = e.customDataBuffer;
    return new Uint32Array(t.buffer, t.byteOffset, 1)[0];
  }, kd = (e, t) => {
    let i = [], r = [], a = [], n = Xs(e);
    if (t.antialias !== 0) throw Error("Only default value (0) for Antialias attribute is supported");
    Ds(e.inputs, t, n, i, r, a), e.compute(js(e.inputs[0], t, n, i, r, a), { inputs: [0] });
  }, Sd = (e) => {
    let t = e.antialias, i = e.axes, r = e.coordinateTransformMode, a = e.cubicCoeffA, n = e.excludeOutside !== 0, s = e.extrapolationValue, o = e.keepAspectRatioPolicy, u = e.mode, l = e.nearestMode === "" ? "simple" : e.nearestMode;
    return Y({ antialias: t, axes: i, coordinateTransformMode: r, cubicCoeffA: a, excludeOutside: n, extrapolationValue: s, keepAspectRatioPolicy: o, mode: u, nearestMode: l });
  };
}), Zs, Qs, Id, uc = z(() => {
  V(), H(), j(), Zs = (e) => {
    if (!e || e.length < 3) throw new Error("layerNorm requires at least 3 inputs.");
    let t = e[0], i = e[1], r = e[2];
    if (t.dataType !== i.dataType || t.dataType !== r.dataType) throw new Error("All inputs must have the same data type");
    if (t.dims.length !== 3 && t.dims.length !== 2) throw new Error("Input must be 2D or 3D");
    if (i.dims.length !== 3 && i.dims.length !== 2) throw new Error("Skip must be 2D or 3D");
    let a = t.dims[t.dims.length - 1], n = t.dims[t.dims.length - 2];
    if (i.dims[i.dims.length - 1] !== a) throw new Error("Skip must have the same hidden size as input");
    if (i.dims[i.dims.length - 2] !== n) throw new Error("Skip must have the same sequence length as input");
    if (r.dims.length !== 1) throw new Error("Gamma must be 1D");
    if (r.dims[r.dims.length - 1] !== a) throw new Error("Gamma must have the same hidden size as input");
    if (e.length > 3) {
      let s = e[3];
      if (s.dims.length !== 1) throw new Error("Beta must be 1D");
      if (s.dims[s.dims.length - 1] !== a) throw new Error("Beta must have the same hidden size as input");
    }
    if (e.length > 4) {
      let s = e[4];
      if (s.dims.length !== 1) throw new Error("Bias must be 1D");
      if (s.dims[s.dims.length - 1] !== a) throw new Error("Bias must have the same hidden size as input");
    }
  }, Qs = (e, t, i, r) => {
    let a = t.simplified, n = e[0].dims, s = k.size(n), o = n, u = s, l = n.slice(-1)[0], p = r ? n.slice(0, -1).concat(1) : [], d = !a && e.length > 3, c = e.length > 4, h = r && i > 1, f = r && i > 2, g = i > 3, y = 64, _ = re(l), m = [{ type: 12, data: u }, { type: 12, data: _ }, { type: 12, data: l }, { type: 1, data: t.epsilon }], w = (b) => {
      let x = [{ name: "output_size", type: "u32" }, { name: "components", type: "u32" }, { name: "hidden_size", type: "u32" }, { name: "epsilon", type: "f32" }], v = [I("x", e[0].dataType, e[0].dims, _), I("skip", e[1].dataType, e[1].dims, _), I("gamma", e[2].dataType, e[2].dims, _)];
      d && v.push(I("beta", e[3].dataType, e[3].dims, _)), c && v.push(I("bias", e[4].dataType, e[4].dims, _)), v.push(A("output", e[0].dataType, o, _)), h && v.push(A("mean_output", 1, p)), f && v.push(A("inv_std_output", 1, p)), g && v.push(A("input_skip_bias_sum", e[0].dataType, o, _));
      let S = oe(e[0].dataType), T = oe(1, _);
      return `

      ${b.registerUniforms(x).declareVariables(...v)}
      var<workgroup> sum_shared : array<${T}, ${y}>;
      var<workgroup> sum_squared_shared : array<${T}, ${y}>;

      ${b.mainStart([y, 1, 1])}
        let ix = local_id.x;
        let iy = global_id.x / ${y};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${y};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${y - 1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${c ? "bias[offset1d + i]" : S + "(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${g ? "input_skip_bias_sum[offset + i] = value;" : ""}
          output[offset + i] = value;
          let f32_value = ${it(S, _, "value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${y};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Ue("sum", _)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Ue("square_sum", _)} / f32(uniforms.hidden_size) ${a ? "" : "- mean * mean"} + uniforms.epsilon);
        ${h ? "mean_output[global_idx] = mean;" : ""}
        ${f ? "inv_std_output[global_idx] = inv_std_dev;" : ""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a ? "" : `- ${S}(mean)`}) *
            ${S}(inv_std_dev) * gamma[offset1d + i]
            ${d ? "+ beta[offset1d + i]" : ""};
        }
      }`;
    }, $ = [{ dims: o, dataType: e[0].dataType }];
    return i > 1 && $.push({ dims: p, dataType: 1 }), i > 2 && $.push({ dims: p, dataType: 1 }), i > 3 && $.push({ dims: n, dataType: e[0].dataType }), { name: "SkipLayerNormalization", shaderCache: { hint: `${_};${h};${f};${g}`, inputDependencies: e.map((b, x) => "type") }, getShaderSource: w, getRunData: () => ({ outputs: $, dispatchGroup: { x: Math.ceil(u / l) }, programUniforms: m }) };
  }, Id = (e, t) => {
    Zs(e.inputs);
    let i = [0];
    e.outputCount > 1 && i.push(-3), e.outputCount > 2 && i.push(-3), e.outputCount > 3 && i.push(3), e.compute(Qs(e.inputs, t, e.outputCount, !1), { outputs: i });
  };
}), Ys, ct, Js, Ui, eo, to, Td, Ed, lc = z(() => {
  V(), H(), ae(), j(), Ys = (e, t) => {
    if (!e || e.length < 1) throw new Error("too few inputs");
    if (t.axes.length !== 0) {
      if (t.axes.length !== t.starts.length || t.axes.length !== t.ends.length) throw new Error("axes, starts and ends must have the same length");
    } else if (t.starts.length !== t.ends.length) throw new Error("starts and ends must have the same length");
    e.slice(1).forEach((i, r) => {
      if (e[r + 1].dataType !== 6 && e[r + 1].dataType !== 7) throw new Error(`Input ${r} must be an array of int32 or int64`);
    });
  }, ct = (e, t) => {
    let i = [];
    if (e.length > t) if (e[t].dataType === 7) e[t].getBigInt64Array().forEach((r) => i.push(Number(r)));
    else if (e[t].dataType === 6) e[t].getInt32Array().forEach((r) => i.push(Number(r)));
    else throw new Error(`Input ${t} must be an array of int32 or int64`);
    return i;
  }, Js = (e, t) => {
    if (e.length > 1) {
      let i = ct(e, 1), r = ct(e, 2), a = ct(e, 3);
      return a.length === 0 && (a = [...Array(e[0].dims.length).keys()]), Y({ starts: i, ends: r, axes: a });
    } else return t;
  }, Ui = (e, t, i, r, a) => {
    let n = e;
    return e < 0 && (n += i[r[t]]), a[t] < 0 ? Math.max(0, Math.min(n, i[r[t]] - 1)) : Math.max(0, Math.min(n, i[r[t]]));
  }, eo = (e, t, i) => `fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${i.length - 1}; i >= 0; i--) {
            let input_shape_i = ${U("uniforms.input_shape", "i", i.length)};
            let steps_i = ${U("uniforms.steps", "i", i.length)};
            let signs_i = ${U("uniforms.signs", "i", i.length)};
            let starts_i = ${U("uniforms.starts", "i", i.length)};
            var output_index = ${t.indicesGet("output_indices", "i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices", "i", "input_index")};
          }
          return input_indices;
      }`, to = (e, t) => {
    let i = e[0].dims, r = k.size(i), a = t.axes.length > 0 ? k.normalizeAxes(t.axes, i.length) : [...Array(i.length).keys()], n = ct(e, 4);
    n.forEach((_) => _ !== 0 || (() => {
      throw new Error("step cannot be 0");
    })), n.length === 0 && (n = Array(a.length).fill(1));
    let s = t.starts.map((_, m) => Ui(_, m, i, a, n)), o = t.ends.map((_, m) => Ui(_, m, i, a, n));
    if (a.length !== s.length || a.length !== o.length) throw new Error("start, ends and axes should have the same number of elements");
    if (a.length !== i.length) for (let _ = 0; _ < i.length; ++_) a.includes(_) || (s.splice(_, 0, 0), o.splice(_, 0, i[_]), n.splice(_, 0, 1));
    let u = n.map((_) => Math.sign(_));
    n.forEach((_, m, w) => {
      if (_ < 0) {
        let $ = (o[m] - s[m]) / _, b = s[m], x = b + $ * n[m];
        s[m] = x, o[m] = b, w[m] = -_;
      }
    });
    let l = i.slice(0);
    a.forEach((_, m) => {
      l[_] = Math.ceil((o[_] - s[_]) / n[_]);
    });
    let p = { dims: l, dataType: e[0].dataType }, d = A("output", e[0].dataType, l.length), c = I("input", e[0].dataType, e[0].dims.length), h = k.size(l), f = [{ name: "outputSize", type: "u32" }, { name: "starts", type: "u32", length: s.length }, { name: "signs", type: "i32", length: u.length }, { name: "steps", type: "u32", length: n.length }], g = [{ type: 12, data: h }, { type: 12, data: s }, { type: 6, data: u }, { type: 12, data: n }, ...P(e[0].dims, l)], y = (_) => `
      ${_.registerUniforms(f).declareVariables(c, d)}
        ${eo(c, d, i)}
        ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${d.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${d.setByOffset("global_idx", c.getByIndices("input_indices"))}
      }`;
    return { name: "Slice", shaderCache: { hint: `${u.length}_${s.length}_${n.length}`, inputDependencies: ["rank"] }, getShaderSource: y, getRunData: () => ({ outputs: [p], dispatchGroup: { x: Math.ceil(r / 64) }, programUniforms: g }) };
  }, Td = (e, t) => {
    Ys(e.inputs, t);
    let i = Js(e.inputs, t);
    e.compute(to(e.inputs, i), { inputs: [0] });
  }, Ed = (e) => {
    let t = e.starts, i = e.ends, r = e.axes;
    return Y({ starts: t, ends: i, axes: r });
  };
}), io, ro, zd, Cd, dc = z(() => {
  V(), H(), ae(), Pe(), j(), io = (e) => {
    if (!e || e.length !== 1) throw new Error("Softmax op requires 1 input.");
  }, ro = (e, t) => {
    let i = e.inputs[0], r = i.dims, a = k.size(r), n = r.length, s = k.normalizeAxis(t.axis, n), o = s < r.length - 1, u, l = [];
    o ? (l = Array.from({ length: n }, (v, S) => S), l[s] = n - 1, l[n - 1] = s, u = e.compute(_e(i, l), { inputs: [i], outputs: [-1] })[0]) : u = i;
    let p = u.dims, d = p[n - 1], c = a / d, h = re(d), f = d / h, g = 64;
    c === 1 && (g = 256);
    let y = (v, S) => S === 4 ? `max(max(${v}.x, ${v}.y), max(${v}.z, ${v}.w))` : S === 2 ? `max(${v}.x, ${v}.y)` : S === 3 ? `max(max(${v}.x, ${v}.y), ${v}.z)` : v, _ = I("x", u.dataType, u.dims, h), m = A("result", u.dataType, u.dims, h), w = _.type.value, $ = oe(u.dataType) === "f32" ? `var threadMax = ${w}(-3.4028234663852886e+38f);` : `var threadMax = ${w}(-65504.0h);`, b = (v) => `
      var<workgroup> rowMaxShared : ${w};
      var<workgroup> rowSumShared : ${w};
      var<workgroup> threadShared : array<${w}, ${g}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${w} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${w}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${v.registerUniform("packedCols", "i32").declareVariables(_, m)}
      ${v.mainStart(g)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${g};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${$}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${w}(${y("threadShared[0]", h)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${w}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${w}(${Ue("threadShared[0]", h)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${w}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`, x = e.compute({ name: "Softmax", shaderCache: { hint: `${h};${g}`, inputDependencies: ["type"] }, getRunData: () => ({ outputs: [{ dims: p, dataType: u.dataType }], dispatchGroup: { x: c }, programUniforms: [{ type: 6, data: f }] }), getShaderSource: b }, { inputs: [u], outputs: [o ? -1 : 0] })[0];
    o && e.compute(_e(x, l), { inputs: [x] });
  }, zd = (e, t) => {
    io(e.inputs), ro(e, t);
  }, Cd = (e) => Y({ axis: e.axis });
}), Pi, ao, no, so, Od, pc = z(() => {
  V(), H(), j(), Pi = (e) => Array.from(e.getBigInt64Array(), Number), ao = (e) => {
    if (!e || e.length !== 2) throw new Error("Tile requires 2 inputs.");
    if (e[0].dataType !== 1 && e[0].dataType !== 10 && e[0].dataType !== 6 && e[0].dataType !== 12) throw new Error("Tile only support float, float16, int32, and uint32 data types");
    if (e[1].dataType !== 7) throw new Error("Tile `repeats` input should be of int64 data type");
    if (e[1].dims.length !== 1) throw new Error("Tile `repeats` input should be 1-D");
    if (Pi(e[1]).length !== e[0].dims.length) throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor");
  }, no = (e, t) => {
    let i = [];
    for (let r = 0; r < e.length; ++r) i.push(e[r] * t[r]);
    return i;
  }, so = (e, t) => {
    let i = e[0].dims, r = t ?? Pi(e[1]), a = no(i, r), n = k.size(a), s = e[0].dataType, o = I("input", s, i.length), u = A("output", s, a.length), l = (p) => `
      const inputShape = ${o.indices(...i)};
      ${p.registerUniform("output_size", "u32").declareVariables(o, u)}
      ${p.mainStart()}
      ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${i.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape", "i")};
        let input_dim_value = ${u.indicesGet("output_indices", "i")}  % input_dim_i;

        ${o.indicesSet("input_indices", "i", "input_dim_value")}
      }
      ${u.setByOffset("global_idx", o.getByIndices("input_indices"))}
    }`;
    return { name: "Tile", shaderCache: { hint: `${r}`, inputDependencies: ["rank"] }, getRunData: () => ({ outputs: [{ dims: a, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(n / 64) }, programUniforms: [{ type: 12, data: n }, ...P(e[0].dims, a)] }), getShaderSource: l };
  }, Od = (e) => {
    ao(e.inputs), e.compute(so(e.inputs), { inputs: [0] });
  };
}), oo, uo, Bd, cc = z(() => {
  V(), H(), j(), oo = (e, t, i, r, a) => {
    let n = A("output_data", a, i.length, 4), s = I("a_data", t[1].dataType, t[1].dims.length, 4), o = I("b_data", t[2].dataType, t[2].dims.length, 4), u = I("c_data", t[0].dataType, t[0].dims.length, 4), l, p = (d, c, h) => `select(${c}, ${d}, ${h})`;
    if (!r) l = n.setByOffset("global_idx", p(s.getByOffset("global_idx"), o.getByOffset("global_idx"), u.getByOffset("global_idx")));
    else {
      let d = (c, h, f = "") => {
        let g = `a_data[index_a${h}][component_a${h}]`, y = `b_data[index_b${h}][component_b${h}]`, _ = `bool(c_data[index_c${h}] & (0xffu << (component_c${h} * 8)))`;
        return `
            let output_indices${h} = ${n.offsetToIndices(`global_idx * 4u + ${h}u`)};
            let offset_a${h} = ${s.broadcastedIndicesToOffset(`output_indices${h}`, n)};
            let offset_b${h} = ${o.broadcastedIndicesToOffset(`output_indices${h}`, n)};
            let offset_c${h} = ${u.broadcastedIndicesToOffset(`output_indices${h}`, n)};
            let index_a${h} = offset_a${h} / 4u;
            let index_b${h} = offset_b${h} / 4u;
            let index_c${h} = offset_c${h} / 4u;
            let component_a${h} = offset_a${h} % 4u;
            let component_b${h} = offset_b${h} % 4u;
            let component_c${h} = offset_c${h} % 4u;
            ${c}[${h}] = ${f}(${p(g, y, _)});
          `;
      };
      a === 9 ? l = `
            var data = vec4<u32>(0);
            ${d("data", 0, "u32")}
            ${d("data", 1, "u32")}
            ${d("data", 2, "u32")}
            ${d("data", 3, "u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));` : l = `
            ${d("output_data[global_idx]", 0)}
            ${d("output_data[global_idx]", 1)}
            ${d("output_data[global_idx]", 2)}
            ${d("output_data[global_idx]", 3)}
          `;
    }
    return `
        ${e.registerUniform("vec_size", "u32").declareVariables(u, s, o, n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`;
  }, uo = (e) => {
    let t = e[1].dims, i = e[2].dims, r = e[0].dims, a = e[1].dataType, n = !(k.areEqual(t, i) && k.areEqual(i, r)), s = t, o = k.size(t);
    if (n) {
      let l = rt.calcShape(rt.calcShape(t, i, !1), r, !1);
      if (!l) throw new Error("Can't perform where op on the given tensors");
      s = l, o = k.size(s);
    }
    let u = Math.ceil(o / 4);
    return { name: "Where", shaderCache: { inputDependencies: ["rank", "rank", "rank"] }, getShaderSource: (l) => oo(l, e, s, n, a), getRunData: () => ({ outputs: [{ dims: s, dataType: a }], dispatchGroup: { x: Math.ceil(o / 64 / 4) }, programUniforms: [{ type: 12, data: u }, ...P(r, t, i, s)] }) };
  }, Bd = (e) => {
    e.compute(uo(e.inputs));
  };
}), Rd, hc = z(() => {
  Tp(), kr(), Ep(), zp(), Cp(), Op(), Bp(), Up(), Np(), qp(), Vp(), Lp(), Wp(), Gp(), Fp(), Hp(), Kp(), jp(), Xp(), Zp(), Qp(), Yp(), Jp(), ec(), tc(), Yl(), ic(), rc(), ac(), nc(), sc(), xr(), oc(), rd(), uc(), lc(), dc(), td(), pc(), Pe(), Sr(), cc(), Rd = /* @__PURE__ */ new Map([["Abs", [Iu]], ["Acos", [Tu]], ["Acosh", [Eu]], ["Add", [ul]], ["ArgMax", [vu, Yi]], ["ArgMin", [bu, Yi]], ["Asin", [zu]], ["Asinh", [Cu]], ["Atan", [Ou]], ["Atanh", [Bu]], ["Attention", [xu]], ["AveragePool", [cd, pd]], ["BatchNormalization", [ku]], ["BiasAdd", [Su]], ["BiasSplitGelu", [ol]], ["Cast", [Au, Ru]], ["Ceil", [Du]], ["Clip", [Mu]], ["Concat", [yl, $l]], ["Conv", [ar, rr]], ["ConvTranspose", [zl, El]], ["Cos", [Uu]], ["Cosh", [Pu]], ["CumSum", [Cl, Ol]], ["DepthToSpace", [Bl, Rl]], ["DequantizeLinear", [$d, wd]], ["Div", [ll]], ["Einsum", [Al, Ml]], ["Elu", [Nu, _t]], ["Equal", [dl]], ["Erf", [qu]], ["Exp", [Vu]], ["Expand", [Dl]], ["FastGelu", [Ul]], ["Floor", [Lu]], ["FusedConv", [ar, rr]], ["Gather", [Nl, Pl]], ["GatherElements", [Fl, Gl]], ["GatherBlockQuantized", [Ll, Wl]], ["GatherND", [ql, Vl]], ["Gelu", [Wu]], ["Gemm", [Kl, Hl]], ["GlobalAveragePool", [fd, hd]], ["GlobalMaxPool", [yd, _d]], ["Greater", [fl]], ["GreaterOrEqual", [gl]], ["GridSample", [jl, Xl]], ["GroupQueryAttention", [ad]], ["HardSigmoid", [Qu, Zu]], ["InstanceNormalization", [nd]], ["LayerNormalization", [sd]], ["LeakyRelu", [Gu, _t]], ["Less", [ml]], ["LessOrEqual", [_l]], ["Log", [nl]], ["MatMul", [od]], ["MatMulNBits", [ud, ld]], ["MaxPool", [md, gd]], ["Mul", [pl]], ["MultiHeadAttention", [Ql, Zl]], ["Neg", [Hu]], ["Not", [Fu]], ["Pad", [dd]], ["Pow", [cl]], ["QuickGelu", [sl, _t]], ["Range", [bd]], ["Reciprocal", [Ku]], ["ReduceMin", [gu]], ["ReduceMean", [pu]], ["ReduceMax", [mu]], ["ReduceSum", [yu]], ["ReduceProd", [_u]], ["ReduceL1", [cu]], ["ReduceL2", [hu]], ["ReduceLogSum", [wu]], ["ReduceLogSumExp", [fu]], ["ReduceSumSquare", [$u]], ["Relu", [ju]], ["Resize", [kd, Sd]], ["RotaryEmbedding", [id]], ["ScatterND", [xd, vd]], ["Sigmoid", [Xu]], ["Sin", [Yu]], ["Sinh", [Ju]], ["Slice", [Td, Ed]], ["SkipLayerNormalization", [Id]], ["Split", [Jl, ed]], ["Sqrt", [el]], ["Softmax", [zd, Cd]], ["Sub", [hl]], ["Tan", [tl]], ["Tanh", [il]], ["ThresholdedRelu", [al, _t]], ["Tile", [Od]], ["Transpose", [Jo, eu]], ["Where", [Bd]]]);
}), Ad, fc = z(() => {
  we(), Re(), j(), Ad = class {
    constructor(e) {
      this.backend = e, this.repo = /* @__PURE__ */ new Map(), this.attributesBound = !1;
    }
    getArtifact(e) {
      return this.repo.get(e);
    }
    setArtifact(e, t) {
      this.repo.set(e, t);
    }
    run(e, t, i, r, a) {
      ze(e.programInfo.name);
      let n = this.backend.device, s = this.backend.getComputePassEncoder();
      this.backend.writeTimestamp(this.backend.pendingDispatchNumber * 2);
      let o = [];
      for (let l of t) o.push({ binding: o.length, resource: { buffer: l.buffer } });
      for (let l of i) o.push({ binding: o.length, resource: { buffer: l.buffer } });
      a && o.push({ binding: o.length, resource: a });
      let u = n.createBindGroup({ layout: e.computePipeline.getBindGroupLayout(0), entries: o, label: e.programInfo.name });
      if (this.backend.sessionStatus === "capturing") {
        let l = { kernelId: this.backend.currentKernelId, computePipeline: e.computePipeline, bindGroup: u, dispatchGroup: r };
        this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l);
      }
      s.setPipeline(e.computePipeline), s.setBindGroup(0, u), s.dispatchWorkgroups(...r), this.backend.writeTimestamp(this.backend.pendingDispatchNumber * 2 + 1), this.backend.pendingDispatchNumber++, (this.backend.pendingDispatchNumber >= this.backend.maxDispatchNumber || this.backend.queryType === "at-passes") && this.backend.endComputePass(), this.backend.pendingDispatchNumber >= this.backend.maxDispatchNumber && this.backend.flush(), Te(e.programInfo.name);
    }
    dispose() {
    }
    build(e, t) {
      ze(e.name);
      let i = this.backend.device, r = [];
      [{ feature: "shader-f16", extension: "f16" }, { feature: "subgroups", extension: "subgroups" }].forEach((l) => {
        i.features.has(l.feature) && r.push(`enable ${l.extension};`);
      });
      let a = Yo(t, this.backend.device.limits), n = e.getShaderSource(a), s = `${r.join(`
`)}
${a.additionalImplementations}
${n}`, o = i.createShaderModule({ code: s, label: e.name });
      Z("verbose", () => `[WebGPU] ${e.name} shader code: ${s}`);
      let u = i.createComputePipeline({ compute: { module: o, entryPoint: "main" }, layout: "auto", label: e.name });
      return Te(e.name), { programInfo: e, computePipeline: u, uniformVariablesInfo: a.variablesInfo };
    }
    normalizeDispatchGroupSize(e) {
      let t = typeof e == "number" ? e : e.x, i = typeof e == "number" ? 1 : e.y || 1, r = typeof e == "number" ? 1 : e.z || 1, a = this.backend.device.limits.maxComputeWorkgroupsPerDimension;
      if (t <= a && i <= a && r <= a) return [t, i, r];
      let n = t * i * r, s = Math.ceil(Math.sqrt(n));
      if (s > a) {
        if (s = Math.ceil(Math.cbrt(n)), s > a) throw new Error("Total dispatch size exceeds WebGPU maximum.");
        return [s, s, s];
      } else return [s, s, 1];
    }
  };
}), Md = {};
bt(Md, { WebGpuBackend: () => Dd });
var lo, po, co, Dd, mc = z(() => {
  we(), V(), Re(), Ko(), Sp(), hc(), fc(), lo = (e, t) => {
    if (t.length !== e.length) throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);
    let i = [];
    for (let r = 0; r < e.length; ++r) {
      let a = e[r].dataType;
      switch (t[r]) {
        case "none": {
          i.push("");
          break;
        }
        case "type": {
          i.push(`${a}`);
          break;
        }
        case "rank": {
          let n = e[r].dims.length;
          i.push(`${a};${n}`);
          break;
        }
        case "dims": {
          let n = e[r].dims.join(",");
          i.push(`${a};${n}`);
          break;
        }
        default:
          throw new Error(`unsupported input dependency: ${t[r]}`);
      }
    }
    return i.join("|");
  }, po = (e, t, i) => {
    let r = e.name;
    return e.shaderCache?.hint && (r += "[" + e.shaderCache.hint + "]"), r += ":" + i + `:${lo(t, e.shaderCache?.inputDependencies ?? new Array(t.length).fill("dims"))}`, r;
  }, co = class {
    constructor(e) {
      e && (this.architecture = e.architecture, this.vendor = e.vendor);
    }
    isArchitecture(e) {
      return this.architecture === e;
    }
    isVendor(e) {
      return this.vendor === e;
    }
  }, Dd = class {
    constructor() {
      this.currentSessionId = null, this.currentKernelId = null, this.commandEncoder = null, this.computePassEncoder = null, this.maxDispatchNumber = 16, this.pendingDispatchNumber = 0, this.pendingKernels = [], this.pendingQueries = /* @__PURE__ */ new Map(), this.sessionStatus = "default", this.capturedCommandList = /* @__PURE__ */ new Map(), this.capturedPendingKernels = /* @__PURE__ */ new Map(), this.sessionExternalDataMapping = /* @__PURE__ */ new Map();
    }
    get currentKernelCustomData() {
      if (this.currentKernelId === null) throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");
      let e = this.kernelCustomData.get(this.currentKernelId);
      return e || (e = {}, this.kernelCustomData.set(this.currentKernelId, e)), e;
    }
    async initialize(e, t) {
      this.env = e;
      let i = [], r = { requiredLimits: { maxComputeWorkgroupStorageSize: t.limits.maxComputeWorkgroupStorageSize, maxComputeWorkgroupsPerDimension: t.limits.maxComputeWorkgroupsPerDimension, maxStorageBufferBindingSize: t.limits.maxStorageBufferBindingSize, maxBufferSize: t.limits.maxBufferSize, maxComputeInvocationsPerWorkgroup: t.limits.maxComputeInvocationsPerWorkgroup, maxComputeWorkgroupSizeX: t.limits.maxComputeWorkgroupSizeX, maxComputeWorkgroupSizeY: t.limits.maxComputeWorkgroupSizeY, maxComputeWorkgroupSizeZ: t.limits.maxComputeWorkgroupSizeZ }, requiredFeatures: i }, a = (o) => t.features.has(o) && i.push(o) && !0;
      a("chromium-experimental-timestamp-query-inside-passes") || a("timestamp-query"), a("shader-f16"), a("subgroups"), this.device = await t.requestDevice(r);
      let n = t, s = t.info ?? (typeof n.requestAdapterInfo == "function" ? await n.requestAdapterInfo() : void 0);
      this.adapterInfo = new co(s), this.gpuDataManager = Zo(this), this.programManager = new Ad(this), this.kernels = /* @__PURE__ */ new Map(), this.kernelPersistentData = /* @__PURE__ */ new Map(), this.kernelCustomData = /* @__PURE__ */ new Map(), $r(e.logLevel, !!e.debug), this.device.onuncapturederror = (o) => {
        o.error instanceof GPUValidationError && console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`);
      }, Object.defineProperty(this.env.webgpu, "device", { value: this.device, writable: !1, enumerable: !0, configurable: !0 }), Object.defineProperty(this.env.webgpu, "adapter", { value: t, writable: !1, enumerable: !0, configurable: !1 }), this.setQueryType();
    }
    dispose() {
      typeof this.querySet < "u" && this.querySet.destroy(), this.gpuDataManager.dispose(), this.device && this.env?.webgpu && this.device.lost.then(() => {
        delete this.env.webgpu.device;
      });
    }
    getCommandEncoder() {
      return this.commandEncoder || (this.commandEncoder = this.device.createCommandEncoder()), this.commandEncoder;
    }
    getComputePassEncoder() {
      if (!this.computePassEncoder) {
        let e = this.getCommandEncoder(), t = {};
        this.queryType === "at-passes" && (t.timestampWrites = { querySet: this.querySet, beginningOfPassWriteIndex: this.pendingDispatchNumber * 2, endOfPassWriteIndex: this.pendingDispatchNumber * 2 + 1 }), this.computePassEncoder = e.beginComputePass(t);
      }
      return this.computePassEncoder;
    }
    endComputePass() {
      this.computePassEncoder && (this.computePassEncoder.end(), this.computePassEncoder = null);
    }
    flush() {
      if (!this.commandEncoder) return;
      ze(), this.endComputePass();
      let e;
      this.queryType !== "none" && (this.commandEncoder.resolveQuerySet(this.querySet, 0, this.pendingDispatchNumber * 2, this.queryResolveBuffer, 0), e = this.device.createBuffer({ size: this.pendingDispatchNumber * 2 * 8, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }), this.pendingQueries.set(e, this.pendingKernels), this.pendingKernels = [], this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer, 0, e, 0, this.pendingDispatchNumber * 2 * 8)), this.device.queue.submit([this.commandEncoder.finish()]), this.gpuDataManager.refreshPendingBuffers(), this.commandEncoder = null, this.pendingDispatchNumber = 0, this.queryType !== "none" && e.mapAsync(GPUMapMode.READ).then(() => {
        let t = new BigUint64Array(e.getMappedRange()), i = this.pendingQueries.get(e);
        for (let r = 0; r < t.length / 2; r++) {
          let a = i[r], n = a.kernelId, s = this.kernels.get(n), o = s.kernelType, u = s.kernelName, l = a.programName, p = a.inputTensorViews, d = a.outputTensorViews, c = t[r * 2], h = t[r * 2 + 1];
          typeof this.queryTimeBase > "u" && (this.queryTimeBase = c);
          let f = Number(c - this.queryTimeBase), g = Number(h - this.queryTimeBase);
          if (!Number.isSafeInteger(f) || !Number.isSafeInteger(g)) throw new RangeError("incorrect timestamp range");
          if (this.env.webgpu.profiling?.ondata) this.env.webgpu.profiling.ondata({ version: 1, inputsMetadata: p.map((y) => ({ dims: y.dims, dataType: Be(y.dataType) })), outputsMetadata: d.map((y) => ({ dims: y.dims, dataType: Be(y.dataType) })), kernelId: n, kernelType: o, kernelName: u, programName: l, startTime: f, endTime: g });
          else {
            let y = "";
            p.forEach((m, w) => {
              y += `input[${w}]: [${m.dims}] | ${Be(m.dataType)}, `;
            });
            let _ = "";
            d.forEach((m, w) => {
              _ += `output[${w}]: [${m.dims}] | ${Be(m.dataType)}, `;
            }), console.log(`[profiling] kernel "${n}|${o}|${u}|${l}" ${y}${_}start time: ${f} ns, execution time: ${g - f} ns`);
          }
          Ut("GPU", `${l}::${c}::${h}`);
        }
        e.unmap(), this.pendingQueries.delete(e);
      }), Te();
    }
    run(e, t, i, r, a, n) {
      ze(e.name);
      let s = [];
      for (let m = 0; m < t.length; ++m) {
        let w = t[m].data;
        if (w === 0) continue;
        let $ = this.gpuDataManager.get(w);
        if (!$) throw new Error(`no GPU data for input: ${w}`);
        s.push($);
      }
      let { outputs: o, dispatchGroup: u, programUniforms: l } = e.getRunData(t), p = i.length === 0 ? o.map((m, w) => w) : i;
      if (p.length !== o.length) throw new Error(`Output size ${p.length} must be equal to ${o.length}.`);
      let d = [], c = [];
      for (let m = 0; m < o.length; ++m) {
        if (!Number.isInteger(p[m]) || p[m] < -3 || p[m] >= n) throw new Error(`Invalid output index: ${p[m]}`);
        if (p[m] === -3) continue;
        let w = p[m] === -1, $ = p[m] === -2, b = w || $ ? a(o[m].dataType, o[m].dims) : r(p[m], o[m].dataType, o[m].dims);
        if (d.push(b), b.data === 0) continue;
        let x = this.gpuDataManager.get(b.data);
        if (!x) throw new Error(`no GPU data for output: ${b.data}`);
        if (w && this.temporaryData.push(x), $) {
          let v = this.kernelPersistentData.get(this.currentKernelId);
          v || (v = [], this.kernelPersistentData.set(this.currentKernelId, v)), v.push(x);
        }
        c.push(x);
      }
      if (s.length !== t.length || c.length !== d.length) {
        if (c.length === 0) return Te(e.name), d;
        throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`);
      }
      let h;
      if (l) {
        let m = 0, w = [];
        l.forEach((v) => {
          let S = typeof v.data == "number" ? [v.data] : v.data;
          if (S.length === 0) return;
          let T = v.type === 10 ? 2 : 4, C, W;
          v.type === 10 ? (W = S.length > 4 ? 16 : S.length > 2 ? 8 : S.length * T, C = S.length > 4 ? 16 : T * S.length) : (W = S.length <= 2 ? S.length * T : 16, C = 16), m = Math.ceil(m / W) * W, w.push(m);
          let B = v.type === 10 ? 8 : 4;
          m += S.length > 4 ? Math.ceil(S.length / B) * C : S.length * T;
        });
        let $ = 16;
        m = Math.ceil(m / $) * $;
        let b = new ArrayBuffer(m);
        l.forEach((v, S) => {
          let T = w[S], C = typeof v.data == "number" ? [v.data] : v.data;
          if (v.type === 6) new Int32Array(b, T, C.length).set(C);
          else if (v.type === 12) new Uint32Array(b, T, C.length).set(C);
          else if (v.type === 10) new Uint16Array(b, T, C.length).set(C);
          else if (v.type === 1) new Float32Array(b, T, C.length).set(C);
          else throw new Error(`Unsupported uniform type: ${Be(v.type)}`);
        });
        let x = this.gpuDataManager.create(m, GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM);
        this.device.queue.writeBuffer(x.buffer, 0, b, 0, m), this.gpuDataManager.release(x.id), h = { offset: 0, size: m, buffer: x.buffer };
      }
      let f = this.programManager.normalizeDispatchGroupSize(u), g = f[1] === 1 && f[2] === 1, y = po(e, t, g), _ = this.programManager.getArtifact(y);
      if (_ || (_ = this.programManager.build(e, f), this.programManager.setArtifact(y, _), Z("info", () => `[artifact] key: ${y}, programName: ${e.name}`)), l && _.uniformVariablesInfo) {
        if (l.length !== _.uniformVariablesInfo.length) throw new Error(`Uniform variables count mismatch: expect ${_.uniformVariablesInfo.length}, got ${l.length} in program "${_.programInfo.name}".`);
        for (let m = 0; m < l.length; m++) {
          let w = l[m], $ = w.type, b = typeof w.data == "number" ? 1 : w.data.length, [x, v] = _.uniformVariablesInfo[m];
          if ($ !== x || b !== v) throw new Error(`Uniform variable ${m} mismatch: expect type ${x} with size ${v}, got type ${$} with size ${b} in program "${_.programInfo.name}".`);
        }
      }
      if (Z("info", () => `[ProgramManager] run "${e.name}" (key=${y}) with ${f[0]}x${f[1]}x${f[2]}`), this.queryType !== "none" || this.sessionStatus === "capturing") {
        let m = { kernelId: this.currentKernelId, programName: _.programInfo.name, inputTensorViews: t, outputTensorViews: d };
        this.pendingKernels.push(m), this.sessionStatus === "capturing" && this.capturedPendingKernels.get(this.currentSessionId).push(m);
      }
      return this.programManager.run(_, s, c, f, h), Te(e.name), d;
    }
    upload(e, t) {
      this.gpuDataManager.upload(e, t);
    }
    memcpy(e, t) {
      this.gpuDataManager.memcpy(e, t);
    }
    async download(e, t) {
      await this.gpuDataManager.download(e, t);
    }
    alloc(e) {
      return this.gpuDataManager.create(e).id;
    }
    free(e) {
      return this.gpuDataManager.release(e);
    }
    createKernel(e, t, i, r) {
      let a = Rd.get(e);
      if (!a) throw new Error(`kernel not implemented: ${e}`);
      let n = { kernelType: e, kernelName: r, kernelEntry: a[0], attributes: [a[1], i] };
      this.kernels.set(t, n);
    }
    releaseKernel(e) {
      let t = this.kernelPersistentData.get(e);
      if (t) {
        for (let i of t) this.gpuDataManager.release(i.id);
        this.kernelPersistentData.delete(e);
      }
      this.kernelCustomData.delete(e), this.kernels.delete(e);
    }
    computeKernel(e, t, i) {
      let r = this.kernels.get(e);
      if (!r) throw new Error(`kernel not created: ${e}`);
      let a = r.kernelType, n = r.kernelName, s = r.kernelEntry, o = r.attributes;
      if (this.currentKernelId !== null) throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);
      this.currentKernelId = e, o[0] && (o[1] = o[0](o[1]), o[0] = void 0), Z("info", () => `[WebGPU] Start to run kernel "[${a}] ${n}"...`);
      let u = this.env.debug;
      this.temporaryData = [];
      try {
        return u && this.device.pushErrorScope("validation"), s(t, o[1]), 0;
      } catch (l) {
        return i.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${l}`)), 1;
      } finally {
        u && i.push(this.device.popErrorScope().then((l) => l ? `GPU validation error for kernel "[${a}] ${n}": ${l.message}` : null));
        for (let l of this.temporaryData) this.gpuDataManager.release(l.id);
        this.temporaryData = [], this.currentKernelId = null;
      }
    }
    registerBuffer(e, t, i, r) {
      let a = this.sessionExternalDataMapping.get(e);
      a || (a = /* @__PURE__ */ new Map(), this.sessionExternalDataMapping.set(e, a));
      let n = a.get(t), s = this.gpuDataManager.registerExternalBuffer(i, r, n);
      return a.set(t, [s, i]), s;
    }
    unregisterBuffers(e) {
      let t = this.sessionExternalDataMapping.get(e);
      t && (t.forEach((i) => this.gpuDataManager.unregisterExternalBuffer(i[0])), this.sessionExternalDataMapping.delete(e));
    }
    getBuffer(e) {
      let t = this.gpuDataManager.get(e);
      if (!t) throw new Error(`no GPU data for buffer: ${e}`);
      return t.buffer;
    }
    createDownloader(e, t, i) {
      return async () => {
        let r = await Xi(this, e, t);
        return wr(r.buffer, i);
      };
    }
    writeTimestamp(e) {
      this.queryType === "inside-passes" && this.computePassEncoder.writeTimestamp(this.querySet, e);
    }
    setQueryType() {
      this.queryType = "none", (this.env.webgpu.profiling?.mode === "default" || (typeof this.env.trace > "u" ? this.env.wasm.trace : this.env.trace)) && (this.device.features.has("chromium-experimental-timestamp-query-inside-passes") ? this.queryType = "inside-passes" : this.device.features.has("timestamp-query") && (this.queryType = "at-passes"), this.queryType !== "none" && typeof this.querySet > "u" && (this.querySet = this.device.createQuerySet({ type: "timestamp", count: this.maxDispatchNumber * 2 }), this.queryResolveBuffer = this.device.createBuffer({ size: this.maxDispatchNumber * 2 * 8, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE })));
    }
    captureBegin() {
      Z("info", "captureBegin"), this.capturedCommandList.get(this.currentSessionId) || this.capturedCommandList.set(this.currentSessionId, []), this.capturedPendingKernels.get(this.currentSessionId) || this.capturedPendingKernels.set(this.currentSessionId, []), this.flush(), this.sessionStatus = "capturing";
    }
    captureEnd() {
      Z("info", "captureEnd"), this.flush(), this.sessionStatus = "default";
    }
    replay() {
      Z("info", "replay"), this.sessionStatus = "replaying";
      let e = this.capturedCommandList.get(this.currentSessionId), t = this.capturedPendingKernels.get(this.currentSessionId), i = e.length;
      this.pendingKernels = [];
      for (let r = 0; r < i; r++) {
        let a = this.getComputePassEncoder(), n = e[r];
        this.writeTimestamp(this.pendingDispatchNumber * 2), a.setPipeline(n.computePipeline), a.setBindGroup(0, n.bindGroup), a.dispatchWorkgroups(...n.dispatchGroup), this.writeTimestamp(this.pendingDispatchNumber * 2 + 1), this.pendingDispatchNumber++, this.queryType !== "none" && this.pendingKernels.push(t[r]), (this.pendingDispatchNumber >= this.maxDispatchNumber || this.queryType === "at-passes") && this.endComputePass(), this.pendingDispatchNumber >= this.maxDispatchNumber && this.flush();
      }
      this.flush(), this.sessionStatus = "default";
    }
    onCreateSession() {
      this.gpuDataManager.onCreateSession();
    }
    onReleaseSession(e) {
      this.unregisterBuffers(e), this.capturedCommandList.has(e) && this.capturedCommandList.delete(e), this.capturedPendingKernels.has(e) && this.capturedPendingKernels.delete(e), this.gpuDataManager.onReleaseSession(e);
    }
    onRunStart(e) {
      this.currentSessionId = e, this.setQueryType();
    }
  };
}), Ud = {};
bt(Ud, { init: () => Pd });
var Bt, ho, Pd, gc = z(() => {
  V(), Re(), H(), kp(), Bt = class Nd {
    constructor(t, i, r, a) {
      this.module = t, this.dataType = i, this.data = r, this.dims = a;
    }
    getFloat32Array() {
      if (this.dataType !== 1) throw new Error("Invalid data type");
      let t = k.size(this.dims);
      return t === 0 ? new Float32Array() : new Float32Array(this.module.HEAP8.buffer, this.data, t);
    }
    getBigInt64Array() {
      if (this.dataType !== 7) throw new Error("Invalid data type");
      let t = k.size(this.dims);
      return t === 0 ? new BigInt64Array() : new BigInt64Array(this.module.HEAP8.buffer, this.data, t);
    }
    getInt32Array() {
      if (this.dataType !== 6) throw new Error("Invalid data type");
      let t = k.size(this.dims);
      return t === 0 ? new Int32Array() : new Int32Array(this.module.HEAP8.buffer, this.data, t);
    }
    getUint16Array() {
      if (this.dataType !== 10 && this.dataType !== 4) throw new Error("Invalid data type");
      let t = k.size(this.dims);
      return t === 0 ? new Uint16Array() : new Uint16Array(this.module.HEAP8.buffer, this.data, t);
    }
    reshape(t) {
      if (k.size(t) !== k.size(this.dims)) throw new Error("Invalid new shape");
      return new Nd(this.module, this.dataType, this.data, t);
    }
  }, ho = class {
    constructor(e, t, i) {
      this.module = e, this.backend = t, this.customDataOffset = 0, this.customDataSize = 0, this.adapterInfo = t.adapterInfo;
      let r = e.PTR_SIZE, a = i / e.PTR_SIZE, n = r === 4 ? "i32" : "i64";
      this.opKernelContext = Number(e.getValue(r * a++, n));
      let s = Number(e.getValue(r * a++, n));
      this.outputCount = Number(e.getValue(r * a++, n)), this.customDataOffset = Number(e.getValue(r * a++, "*")), this.customDataSize = Number(e.getValue(r * a++, n));
      let o = [];
      for (let u = 0; u < s; u++) {
        let l = Number(e.getValue(r * a++, n)), p = Number(e.getValue(r * a++, "*")), d = Number(e.getValue(r * a++, n)), c = [];
        for (let h = 0; h < d; h++) c.push(Number(e.getValue(r * a++, n)));
        o.push(new Bt(e, l, p, c));
      }
      this.inputs = o;
    }
    get kernelCustomData() {
      return this.backend.currentKernelCustomData;
    }
    get customDataBuffer() {
      return this.module.HEAPU8.subarray(this.customDataOffset, this.customDataOffset + this.customDataSize);
    }
    compute(e, t) {
      let i = t?.inputs?.map((s) => typeof s == "number" ? this.inputs[s] : s) ?? this.inputs, r = t?.outputs ?? [], a = (s, o, u) => new Bt(this.module, o, this.output(s, u), u), n = (s, o) => {
        let u = He(s, o);
        if (!u) throw new Error(`Unsupported data type: ${s}`);
        let l = u > 0 ? this.backend.gpuDataManager.create(u).id : 0;
        return new Bt(this.module, s, l, o);
      };
      return this.backend.run(e, i, r, a, n, this.outputCount);
    }
    output(e, t) {
      let i = this.module.stackSave();
      try {
        let r = this.module.PTR_SIZE, a = r === 4 ? "i32" : "i64", n = this.module.stackAlloc((1 + t.length) * r);
        this.module.setValue(n, t.length, a);
        for (let s = 0; s < t.length; s++) this.module.setValue(n + r * (s + 1), t[s], a);
        return this.module._JsepOutput(this.opKernelContext, e, n);
      } catch (r) {
        throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${r}`);
      } finally {
        this.module.stackRestore(i);
      }
    }
  }, Pd = async (e, t, i, r) => {
    let a = t.jsepInit;
    if (!a) throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");
    if (e === "webgpu") {
      let n = (mc(), Ft(Md)).WebGpuBackend, s = new n();
      await s.initialize(i, r), a("webgpu", [s, (o) => s.alloc(Number(o)), (o) => s.free(o), (o, u, l, p = !1) => {
        if (p) Z("verbose", () => `[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(l)}`), s.memcpy(Number(o), Number(u));
        else {
          Z("verbose", () => `[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(l)}`);
          let d = t.HEAPU8.subarray(Number(o >>> 0), Number(o >>> 0) + Number(l));
          s.upload(Number(u), d);
        }
      }, async (o, u, l) => {
        Z("verbose", () => `[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${l}`), await s.download(Number(o), () => t.HEAPU8.subarray(Number(u) >>> 0, Number(u + l) >>> 0));
      }, (o, u, l) => s.createKernel(o, Number(u), l, t.UTF8ToString(t._JsepGetNodeName(Number(u)))), (o) => s.releaseKernel(o), (o, u, l, p) => {
        Z("verbose", () => `[WebGPU] jsepRun: sessionHandle=${l}, kernel=${o}, contextDataOffset=${u}`);
        let d = new ho(t, s, Number(u));
        return s.computeKernel(Number(o), d, p);
      }, () => s.captureBegin(), () => s.captureEnd(), () => s.replay()]);
    } else {
      let n = new Xo(i);
      a("webnn", [n, () => n.reserveTensorId(), (s) => n.releaseTensorId(s), async (s, o, u, l, p) => n.ensureTensor(s, o, u, l, p), (s, o) => {
        n.uploadTensor(s, o);
      }, async (s, o) => n.downloadTensor(s, o), (s, o) => n.registerMLContext(s, o), !!i.trace]);
    }
  };
}), fo, Or, Br, Me, mo, Ni, Gt, Rr, Ar, qi, Mr, Dr, Ur, qd = z(() => {
  we(), bp(), vp(), V(), Ye(), mr(), Wo(), fo = (e, t) => {
    ie()._OrtInit(e, t) !== 0 && J("Can't initialize onnxruntime.");
  }, Or = async (e) => {
    fo(e.wasm.numThreads, Nt(e.logLevel));
  }, Br = async (e, t) => {
    ie().asyncInit?.();
    let i = e.webgpu.adapter;
    if (t === "webgpu") {
      if (typeof navigator > "u" || !navigator.gpu) throw new Error("WebGPU is not supported in current environment");
      if (i) {
        if (typeof i.limits != "object" || typeof i.features != "object" || typeof i.requestDevice != "function") throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
      } else {
        let r = e.webgpu.powerPreference;
        if (r !== void 0 && r !== "low-power" && r !== "high-performance") throw new Error(`Invalid powerPreference setting: "${r}"`);
        let a = e.webgpu.forceFallbackAdapter;
        if (a !== void 0 && typeof a != "boolean") throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);
        if (i = await navigator.gpu.requestAdapter({ powerPreference: r, forceFallbackAdapter: a }), !i) throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.');
      }
    }
    if (t === "webnn" && (typeof navigator > "u" || !navigator.ml)) throw new Error("WebNN is not supported in current environment");
    {
      let r = (gc(), Ft(Ud)).init;
      t === "webgpu" && await r("webgpu", ie(), e, i), t === "webnn" && await r("webnn", ie(), e);
    }
  }, Me = /* @__PURE__ */ new Map(), mo = (e) => {
    let t = ie(), i = t.stackSave();
    try {
      let r = t.PTR_SIZE, a = t.stackAlloc(2 * r);
      t._OrtGetInputOutputCount(e, a, a + r) !== 0 && J("Can't get session input/output count.");
      let n = r === 4 ? "i32" : "i64";
      return [Number(t.getValue(a, n)), Number(t.getValue(a + r, n))];
    } finally {
      t.stackRestore(i);
    }
  }, Ni = (e, t) => {
    let i = ie(), r = i.stackSave(), a = 0;
    try {
      let n = i.PTR_SIZE, s = i.stackAlloc(2 * n);
      i._OrtGetInputOutputMetadata(e, t, s, s + n) !== 0 && J("Can't get session input/output metadata.");
      let o = Number(i.getValue(s, "*"));
      a = Number(i.getValue(s + n, "*"));
      let u = i.HEAP32[a / 4];
      if (u === 0) return [o, 0];
      let l = i.HEAPU32[a / 4 + 1], p = [];
      for (let d = 0; d < l; d++) {
        let c = Number(i.getValue(a + 8 + d * n, "*"));
        p.push(c !== 0 ? i.UTF8ToString(c) : Number(i.getValue(a + 8 + (d + l) * n, "*")));
      }
      return [o, u, p];
    } finally {
      i.stackRestore(r), a !== 0 && i._OrtFree(a);
    }
  }, Gt = (e) => {
    let t = ie(), i = t._malloc(e.byteLength);
    if (i === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);
    return t.HEAPU8.set(e, i), [i, e.byteLength];
  }, Rr = async (e, t) => {
    let i, r, a = ie();
    Array.isArray(e) ? [i, r] = e : e.buffer === a.HEAPU8.buffer ? [i, r] = [e.byteOffset, e.byteLength] : [i, r] = Gt(e);
    let n = 0, s = 0, o = 0, u = [], l = [], p = [];
    try {
      if ([s, u] = await Lo(t), t?.externalData && a.mountExternalData) {
        let $ = [];
        for (let b of t.externalData) {
          let x = typeof b == "string" ? b : b.path;
          $.push(yr(typeof b == "string" ? b : b.data).then((v) => {
            a.mountExternalData(x, v);
          }));
        }
        await Promise.all($);
      }
      for (let $ of t?.executionProviders ?? []) if ((typeof $ == "string" ? $ : $.name) === "webnn") {
        if (a.shouldTransferToMLTensor = !1, typeof $ != "string") {
          let b = $, x = b?.context, v = b?.gpuDevice, S = b?.deviceType, T = b?.powerPreference;
          x ? a.currentContext = x : v ? a.currentContext = await a.webnnCreateMLContext(v) : a.currentContext = await a.webnnCreateMLContext({ deviceType: S, powerPreference: T });
        } else a.currentContext = await a.webnnCreateMLContext();
        break;
      }
      n = await a._OrtCreateSession(i, r, s), a.webgpuOnCreateSession?.(n), n === 0 && J("Can't create a session."), a.jsepOnCreateSession?.(), a.currentContext && (a.webnnRegisterMLContext(n, a.currentContext), a.currentContext = void 0, a.shouldTransferToMLTensor = !0);
      let [d, c] = mo(n), h = !!t?.enableGraphCapture, f = [], g = [], y = [], _ = [], m = [];
      for (let $ = 0; $ < d; $++) {
        let [b, x, v] = Ni(n, $);
        b === 0 && J("Can't get an input name."), l.push(b);
        let S = a.UTF8ToString(b);
        f.push(S), y.push(x === 0 ? { name: S, isTensor: !1 } : { name: S, isTensor: !0, type: Be(x), shape: v });
      }
      for (let $ = 0; $ < c; $++) {
        let [b, x, v] = Ni(n, $ + d);
        b === 0 && J("Can't get an output name."), p.push(b);
        let S = a.UTF8ToString(b);
        g.push(S), _.push(x === 0 ? { name: S, isTensor: !1 } : { name: S, isTensor: !0, type: Be(x), shape: v });
        {
          if (h && t?.preferredOutputLocation === void 0) {
            m.push("gpu-buffer");
            continue;
          }
          let T = typeof t?.preferredOutputLocation == "string" ? t.preferredOutputLocation : t?.preferredOutputLocation?.[S] ?? "cpu", C = a.webnnIsGraphOutput;
          if (T === "cpu" && C && C(n, S)) {
            m.push("ml-tensor-cpu-output");
            continue;
          }
          if (T !== "cpu" && T !== "cpu-pinned" && T !== "gpu-buffer" && T !== "ml-tensor") throw new Error(`Not supported preferred output location: ${T}.`);
          if (h && T !== "gpu-buffer") throw new Error(`Not supported preferred output location: ${T}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
          m.push(T);
        }
      }
      let w = null;
      return m.some(($) => $ === "gpu-buffer" || $ === "ml-tensor" || $ === "ml-tensor-cpu-output") && (o = a._OrtCreateBinding(n), o === 0 && J("Can't create IO binding."), w = { handle: o, outputPreferredLocations: m, outputPreferredLocationsEncoded: m.map(($) => $ === "ml-tensor-cpu-output" ? "ml-tensor" : $).map(($) => Ki($)) }), Me.set(n, [n, l, p, w, h, !1]), [n, f, g, y, _];
    } catch (d) {
      throw l.forEach((c) => a._OrtFree(c)), p.forEach((c) => a._OrtFree(c)), o !== 0 && a._OrtReleaseBinding(o) !== 0 && J("Can't release IO binding."), n !== 0 && a._OrtReleaseSession(n) !== 0 && J("Can't release session."), d;
    } finally {
      a._free(i), s !== 0 && a._OrtReleaseSessionOptions(s) !== 0 && J("Can't release session options."), u.forEach((d) => a._free(d)), a.unmountExternalData?.();
    }
  }, Ar = (e) => {
    let t = ie(), i = Me.get(e);
    if (!i) throw new Error(`cannot release session. invalid session id: ${e}`);
    let [r, a, n, s, o] = i;
    s && (o && t._OrtClearBoundOutputs(s.handle) !== 0 && J("Can't clear bound outputs."), t._OrtReleaseBinding(s.handle) !== 0 && J("Can't release IO binding.")), t.jsepOnReleaseSession?.(e), t.webnnOnReleaseSession?.(e), t.webgpuOnReleaseSession?.(e), a.forEach((u) => t._OrtFree(u)), n.forEach((u) => t._OrtFree(u)), t._OrtReleaseSession(r) !== 0 && J("Can't release session."), Me.delete(e);
  }, qi = async (e, t, i, r, a, n, s = !1) => {
    if (!e) {
      t.push(0);
      return;
    }
    let o = ie(), u = o.PTR_SIZE, l = e[0], p = e[1], d = e[3], c = d, h, f;
    if (l === "string" && (d === "gpu-buffer" || d === "ml-tensor")) throw new Error("String tensor is not supported on GPU.");
    if (s && d !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);
    if (d === "gpu-buffer") {
      let _ = e[2].gpuBuffer;
      f = He(Fe(l), p);
      {
        let m = o.jsepRegisterBuffer;
        if (!m) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
        h = m(r, n, _, f);
      }
    } else if (d === "ml-tensor") {
      let _ = e[2].mlTensor;
      f = He(Fe(l), p);
      let m = o.webnnRegisterMLTensor;
      if (!m) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
      h = m(r, _, Fe(l), p);
    } else {
      let _ = e[2];
      if (Array.isArray(_)) {
        f = u * _.length, h = o._malloc(f), i.push(h);
        for (let m = 0; m < _.length; m++) {
          if (typeof _[m] != "string") throw new TypeError(`tensor data at index ${m} is not a string`);
          o.setValue(h + m * u, Ie(_[m], i), "*");
        }
      } else {
        let m = o.webnnIsGraphInput, w = o.webnnIsGraphOutput;
        if (l !== "string" && m && w) {
          let $ = o.UTF8ToString(a);
          if (m(r, $) || w(r, $)) {
            let b = Fe(l);
            f = He(b, p), c = "ml-tensor";
            let x = o.webnnCreateTemporaryTensor, v = o.webnnUploadTensor;
            if (!x || !v) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
            let S = await x(r, b, p);
            v(S, new Uint8Array(_.buffer, _.byteOffset, _.byteLength)), h = S;
          } else f = _.byteLength, h = o._malloc(f), i.push(h), o.HEAPU8.set(new Uint8Array(_.buffer, _.byteOffset, f), h);
        } else f = _.byteLength, h = o._malloc(f), i.push(h), o.HEAPU8.set(new Uint8Array(_.buffer, _.byteOffset, f), h);
      }
    }
    let g = o.stackSave(), y = o.stackAlloc(4 * p.length);
    try {
      p.forEach((m, w) => o.setValue(y + w * u, m, u === 4 ? "i32" : "i64"));
      let _ = o._OrtCreateTensor(Fe(l), h, f, y, p.length, Ki(c));
      _ === 0 && J(`Can't create tensor for input/output. session=${r}, index=${n}.`), t.push(_);
    } finally {
      o.stackRestore(g);
    }
  }, Mr = async (e, t, i, r, a, n) => {
    let s = ie(), o = s.PTR_SIZE, u = Me.get(e);
    if (!u) throw new Error(`cannot run inference. invalid session id: ${e}`);
    let l = u[0], p = u[1], d = u[2], c = u[3], h = u[4], f = u[5], g = t.length, y = r.length, _ = 0, m = [], w = [], $ = [], b = [], x = [], v = s.stackSave(), S = s.stackAlloc(g * o), T = s.stackAlloc(g * o), C = s.stackAlloc(y * o), W = s.stackAlloc(y * o);
    try {
      [_, m] = Vo(n), Ke("wasm prepareInputOutputTensor");
      for (let O = 0; O < g; O++) await qi(i[O], w, b, e, p[t[O]], t[O], h);
      for (let O = 0; O < y; O++) await qi(a[O], $, b, e, d[r[O]], g + r[O], h);
      je("wasm prepareInputOutputTensor");
      for (let O = 0; O < g; O++) s.setValue(S + O * o, w[O], "*"), s.setValue(T + O * o, p[t[O]], "*");
      for (let O = 0; O < y; O++) s.setValue(C + O * o, $[O], "*"), s.setValue(W + O * o, d[r[O]], "*");
      if (c && !f) {
        let { handle: O, outputPreferredLocations: M, outputPreferredLocationsEncoded: G } = c;
        if (p.length !== g) throw new Error(`input count from feeds (${g}) is expected to be always equal to model's input count (${p.length}).`);
        Ke("wasm bindInputsOutputs");
        for (let K = 0; K < g; K++) {
          let L = t[K];
          await s._OrtBindInput(O, p[L], w[K]) !== 0 && J(`Can't bind input[${K}] for session=${e}.`);
        }
        for (let K = 0; K < y; K++) {
          let L = r[K];
          a[K]?.[3] ? (x.push($[K]), s._OrtBindOutput(O, d[L], $[K], 0) !== 0 && J(`Can't bind pre-allocated output[${K}] for session=${e}.`)) : s._OrtBindOutput(O, d[L], 0, G[L]) !== 0 && J(`Can't bind output[${K}] to ${M[K]} for session=${e}.`);
        }
        je("wasm bindInputsOutputs"), Me.set(e, [l, p, d, c, h, !0]);
      }
      s.jsepOnRunStart?.(l), s.webnnOnRunStart?.(l);
      let B;
      c ? B = await s._OrtRunWithBinding(l, c.handle, y, C, _) : B = await s._OrtRun(l, T, S, g, W, y, C, _), B !== 0 && J("failed to call OrtRun().");
      let R = [], F = [];
      Ke("wasm ProcessOutputTensor");
      for (let O = 0; O < y; O++) {
        let M = Number(s.getValue(C + O * o, "*"));
        if (M === $[O] || x.includes($[O])) {
          R.push(a[O]), M !== $[O] && s._OrtReleaseTensor(M) !== 0 && J("Can't release tensor.");
          continue;
        }
        let G = s.stackSave(), K = s.stackAlloc(4 * o), L = !1, X, E = 0;
        try {
          s._OrtGetTensorData(M, K, K + o, K + 2 * o, K + 3 * o) !== 0 && J(`Can't access output tensor data on index ${O}.`);
          let q = o === 4 ? "i32" : "i64", N = Number(s.getValue(K, q));
          E = s.getValue(K + o, "*");
          let D = s.getValue(K + o * 2, "*"), de = Number(s.getValue(K + o * 3, q)), he = [];
          for (let ee = 0; ee < de; ee++) he.push(Number(s.getValue(D + ee * o, q)));
          s._OrtFree(D) !== 0 && J("Can't free memory for tensor dims.");
          let ne = he.reduce((ee, se) => ee * se, 1);
          X = Be(N);
          let fe = c?.outputPreferredLocations[r[O]];
          if (X === "string") {
            if (fe === "gpu-buffer" || fe === "ml-tensor") throw new Error("String tensor is not supported on GPU.");
            let ee = [];
            for (let se = 0; se < ne; se++) {
              let Ce = s.getValue(E + se * o, "*"), Jd = s.getValue(E + (se + 1) * o, "*"), ep = se === ne - 1 ? void 0 : Jd - Ce;
              ee.push(s.UTF8ToString(Ce, ep));
            }
            R.push([X, he, ee, "cpu"]);
          } else if (fe === "gpu-buffer" && ne > 0) {
            let ee = s.jsepGetBuffer;
            if (!ee) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
            let se = ee(E), Ce = He(N, ne);
            if (Ce === void 0 || !gr(X)) throw new Error(`Unsupported data type: ${X}`);
            L = !0, R.push([X, he, { gpuBuffer: se, download: s.jsepCreateDownloader(se, Ce, X), dispose: () => {
              s._OrtReleaseTensor(M) !== 0 && J("Can't release tensor.");
            } }, "gpu-buffer"]);
          } else if (fe === "ml-tensor" && ne > 0) {
            let ee = s.webnnEnsureTensor, se = s.webnnIsGraphInputOutputTypeSupported;
            if (!ee || !se) throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
            if (He(N, ne) === void 0 || !_r(X)) throw new Error(`Unsupported data type: ${X}`);
            if (!se(e, X, !1)) throw new Error(`preferredLocation "ml-tensor" for ${X} output is not supported by current WebNN Context.`);
            let Ce = await ee(e, E, N, he, !1);
            L = !0, R.push([X, he, { mlTensor: Ce, download: s.webnnCreateMLTensorDownloader(E, X), dispose: () => {
              s.webnnReleaseTensorId(E), s._OrtReleaseTensor(M);
            } }, "ml-tensor"]);
          } else if (fe === "ml-tensor-cpu-output" && ne > 0) {
            let ee = s.webnnCreateMLTensorDownloader(E, X)(), se = R.length;
            L = !0, F.push((async () => {
              let Ce = [se, await ee];
              return s.webnnReleaseTensorId(E), s._OrtReleaseTensor(M), Ce;
            })()), R.push([X, he, [], "cpu"]);
          } else {
            let ee = Ht(X), se = new ee(ne);
            new Uint8Array(se.buffer, se.byteOffset, se.byteLength).set(s.HEAPU8.subarray(E, E + se.byteLength)), R.push([X, he, se, "cpu"]);
          }
        } finally {
          s.stackRestore(G), X === "string" && E && s._free(E), L || s._OrtReleaseTensor(M);
        }
      }
      c && !h && (s._OrtClearBoundOutputs(c.handle) !== 0 && J("Can't clear bound outputs."), Me.set(e, [l, p, d, c, h, !1]));
      for (let [O, M] of await Promise.all(F)) R[O][2] = M;
      return je("wasm ProcessOutputTensor"), R;
    } finally {
      s.webnnOnRunEnd?.(l), s.stackRestore(v), w.forEach((B) => s._OrtReleaseTensor(B)), $.forEach((B) => s._OrtReleaseTensor(B)), b.forEach((B) => s._free(B)), _ !== 0 && s._OrtReleaseRunOptions(_), m.forEach((B) => s._free(B));
    }
  }, Dr = (e) => {
    let t = ie(), i = Me.get(e);
    if (!i) throw new Error("invalid session id");
    let r = i[0], a = t._OrtEndProfiling(r);
    a === 0 && J("Can't get an profile file name."), t._OrtFree(a);
  }, Ur = (e) => {
    let t = [];
    for (let i of e) {
      let r = i[2];
      !Array.isArray(r) && "buffer" in r && t.push(r.buffer);
    }
    return t;
  };
}), De, ye, et, ht, ft, Rt, Vi, At, Le, We, go, Vd, Ld, Wd, Gd, Fd, Hd, Kd, jd = z(() => {
  we(), qd(), Ye(), hr(), De = () => !!te.wasm.proxy && typeof document < "u", et = !1, ht = !1, ft = !1, At = /* @__PURE__ */ new Map(), Le = (e, t) => {
    let i = At.get(e);
    i ? i.push(t) : At.set(e, [t]);
  }, We = () => {
    if (et || !ht || ft || !ye) throw new Error("worker not ready");
  }, go = (e) => {
    switch (e.data.type) {
      case "init-wasm":
        et = !1, e.data.err ? (ft = !0, Vi[1](e.data.err)) : (ht = !0, Vi[0]()), Rt && (URL.revokeObjectURL(Rt), Rt = void 0);
        break;
      case "init-ep":
      case "copy-from":
      case "create":
      case "release":
      case "run":
      case "end-profiling": {
        let t = At.get(e.data.type);
        e.data.err ? t.shift()[1](e.data.err) : t.shift()[0](e.data.out);
        break;
      }
    }
  }, Vd = async () => {
    if (!ht) {
      if (et) throw new Error("multiple calls to 'initWasm()' detected.");
      if (ft) throw new Error("previous call to 'initWasm()' failed.");
      if (et = !0, De()) return new Promise((e, t) => {
        ye?.terminate(), No().then(([i, r]) => {
          try {
            ye = r, ye.onerror = (n) => t(n), ye.onmessage = go, Vi = [e, t];
            let a = { type: "init-wasm", in: te };
            if (!a.in.wasm.wasmPaths && i) {
              let n = cr();
              n && (a.in.wasm.wasmPaths = n);
            }
            ye.postMessage(a), Rt = i;
          } catch (a) {
            t(a);
          }
        }, t);
      });
      try {
        await fr(te.wasm), await Or(te), ht = !0;
      } catch (e) {
        throw ft = !0, e;
      } finally {
        et = !1;
      }
    }
  }, Ld = async (e) => {
    if (De()) return We(), new Promise((t, i) => {
      Le("init-ep", [t, i]);
      let r = { type: "init-ep", in: { epName: e, env: te } };
      ye.postMessage(r);
    });
    await Br(te, e);
  }, Wd = async (e) => De() ? (We(), new Promise((t, i) => {
    Le("copy-from", [t, i]);
    let r = { type: "copy-from", in: { buffer: e } };
    ye.postMessage(r, [e.buffer]);
  })) : Gt(e), Gd = async (e, t) => {
    if (De()) {
      if (t?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
      return We(), new Promise((i, r) => {
        Le("create", [i, r]);
        let a = { type: "create", in: { model: e, options: { ...t } } }, n = [];
        e instanceof Uint8Array && n.push(e.buffer), ye.postMessage(a, n);
      });
    } else return Rr(e, t);
  }, Fd = async (e) => {
    if (De()) return We(), new Promise((t, i) => {
      Le("release", [t, i]);
      let r = { type: "release", in: e };
      ye.postMessage(r);
    });
    Ar(e);
  }, Hd = async (e, t, i, r, a, n) => {
    if (De()) {
      if (i.some((s) => s[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
      if (a.some((s) => s)) throw new Error("pre-allocated output tensor is not supported for proxy.");
      return We(), new Promise((s, o) => {
        Le("run", [s, o]);
        let u = i, l = { type: "run", in: { sessionId: e, inputIndices: t, inputs: u, outputIndices: r, options: n } };
        ye.postMessage(l, Ur(u));
      });
    } else return Mr(e, t, i, r, a, n);
  }, Kd = async (e) => {
    if (De()) return We(), new Promise((t, i) => {
      Le("end-profiling", [t, i]);
      let r = { type: "end-profiling", in: e };
      ye.postMessage(r);
    });
    Dr(e);
  };
}), Li, _o, Xd, _c = z(() => {
  we(), jd(), V(), pr(), Wo(), Li = (e, t) => {
    switch (e.location) {
      case "cpu":
        return [e.type, e.dims, e.data, "cpu"];
      case "gpu-buffer":
        return [e.type, e.dims, { gpuBuffer: e.gpuBuffer }, "gpu-buffer"];
      case "ml-tensor":
        return [e.type, e.dims, { mlTensor: e.mlTensor }, "ml-tensor"];
      default:
        throw new Error(`invalid data location: ${e.location} for ${t()}`);
    }
  }, _o = (e) => {
    switch (e[3]) {
      case "cpu":
        return new $e(e[0], e[2], e[1]);
      case "gpu-buffer": {
        let t = e[0];
        if (!gr(t)) throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);
        let { gpuBuffer: i, download: r, dispose: a } = e[2];
        return $e.fromGpuBuffer(i, { dataType: t, dims: e[1], download: r, dispose: a });
      }
      case "ml-tensor": {
        let t = e[0];
        if (!_r(t)) throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);
        let { mlTensor: i, download: r, dispose: a } = e[2];
        return $e.fromMLTensor(i, { dataType: t, dims: e[1], download: r, dispose: a });
      }
      default:
        throw new Error(`invalid data location: ${e[3]}`);
    }
  }, Xd = class {
    async fetchModelAndCopyToWasmMemory(e) {
      return Wd(await yr(e));
    }
    async loadModel(e, t) {
      ze();
      let i;
      typeof e == "string" ? i = await this.fetchModelAndCopyToWasmMemory(e) : i = e, [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await Gd(i, t), Te();
    }
    async dispose() {
      return Fd(this.sessionId);
    }
    async run(e, t, i) {
      ze();
      let r = [], a = [];
      Object.entries(e).forEach((d) => {
        let c = d[0], h = d[1], f = this.inputNames.indexOf(c);
        if (f === -1) throw new Error(`invalid input '${c}'`);
        r.push(h), a.push(f);
      });
      let n = [], s = [];
      Object.entries(t).forEach((d) => {
        let c = d[0], h = d[1], f = this.outputNames.indexOf(c);
        if (f === -1) throw new Error(`invalid output '${c}'`);
        n.push(h), s.push(f);
      });
      let o = r.map((d, c) => Li(d, () => `input "${this.inputNames[a[c]]}"`)), u = n.map((d, c) => d ? Li(d, () => `output "${this.outputNames[s[c]]}"`) : null), l = await Hd(this.sessionId, a, o, s, u, i), p = {};
      for (let d = 0; d < l.length; d++) p[this.outputNames[s[d]]] = n[d] ?? _o(l[d]);
      return Te(), p;
    }
    startProfiling() {
    }
    endProfiling() {
      Kd(this.sessionId);
    }
  };
}), Zd = {};
bt(Zd, { OnnxruntimeWebAssemblyBackend: () => or, initializeFlags: () => sr, wasmBackend: () => Qd });
var sr, or, Qd, yc = z(() => {
  we(), jd(), _c(), sr = () => {
    (typeof te.wasm.initTimeout != "number" || te.wasm.initTimeout < 0) && (te.wasm.initTimeout = 0);
    let e = te.wasm.simd;
    if (typeof e != "boolean" && e !== void 0 && e !== "fixed" && e !== "relaxed" && (console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`), te.wasm.simd = !1), typeof te.wasm.proxy != "boolean" && (te.wasm.proxy = !1), typeof te.wasm.trace != "boolean" && (te.wasm.trace = !1), typeof te.wasm.numThreads != "number" || !Number.isInteger(te.wasm.numThreads) || te.wasm.numThreads <= 0) if (typeof self < "u" && !self.crossOriginIsolated) te.wasm.numThreads = 1;
    else {
      let t = typeof navigator > "u" ? ap("node:os").cpus().length : navigator.hardwareConcurrency;
      te.wasm.numThreads = Math.min(4, Math.ceil((t || 1) / 2));
    }
  }, or = class {
    async init(e) {
      sr(), await Vd(), await Ld(e);
    }
    async createInferenceSessionHandler(e, t) {
      let i = new Xd();
      return await i.loadModel(e, t), i;
    }
  }, Qd = new or();
});
we();
we();
we();
var $c = "1.27.0";
{
  let e = (yc(), Ft(Zd)).wasmBackend;
  tt("webgpu", e, 5), tt("webnn", e, 5), tt("cpu", e, 10), tt("wasm", e, 10);
}
Object.defineProperty(te.versions, "web", { value: $c, enumerable: !0 });
/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function wc(e, t, i, r) {
  const a = ["", ...r];
  for (a.length < i && a.push(" "); a.length < i; ) a.push("");
  let n = !1;
  if (t > 0) {
    let h = 0, f = 0;
    for (let g = 0; g < i; g++) {
      const y = e[g];
      Number.isFinite(y) && (h += y, f += 1);
    }
    n = f > 0 && h > 0.8 && h < 1.2;
  }
  const s = [], o = [];
  for (let h = 0; h < t; h++) {
    const f = h * i;
    let g = -1, y = -1 / 0;
    for (let m = 0; m < i; m++) {
      const w = e[f + m];
      Number.isFinite(w) && w > y && (y = w, g = m);
    }
    if (g < 0) continue;
    let _;
    if (n)
      _ = Math.max(1e-3, Math.min(y, 0.999));
    else {
      let m = 0, w = 0;
      for (let $ = 0; $ < i; $++) {
        const b = e[f + $];
        if (!Number.isFinite(b)) continue;
        const x = b - y;
        if (x < -50) continue;
        const v = Math.exp(x);
        Number.isFinite(v) && (m += v, $ === g && (w = v));
      }
      _ = m > 0 ? Math.max(1e-3, Math.min(w / m, 0.999)) : 1e-3;
    }
    s.push(g), o.push(_);
  }
  const u = [], l = [];
  let p = -1;
  for (let h = 0; h < s.length; h++) {
    const f = s[h];
    if (f === 0) {
      p = -1;
      continue;
    }
    f !== p && (u.push(f), l.push(o[h]), p = f);
  }
  let d = "";
  for (const h of u)
    h >= 0 && h < a.length && (d += a[h]);
  const c = l.length === 0 ? 0 : l.reduce((h, f) => h + f, 0) / l.length;
  return { text: d, confidence: c };
}
function bc(e, t, i, r, a, n = {}) {
  const s = n.thresh ?? 0.2, o = n.boxThresh ?? 0.4, u = n.unclipRatio ?? 1.4, l = n.minSize ?? 3, p = new Uint8Array(t * i);
  for (let y = 0; y < p.length; y++)
    p[y] = e[y] > s ? 1 : 0;
  const d = new Int32Array(t * i), c = [];
  let h = 0;
  const f = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  for (let y = 0; y < t; y++)
    for (let _ = 0; _ < i; _++) {
      const m = y * i + _;
      if (!p[m] || d[m]) continue;
      h += 1;
      const w = [m];
      d[m] = h;
      const $ = [];
      let b = 0, x = 0;
      for (; x < w.length; ) {
        const v = w[x++];
        $.push(v), b += e[v];
        const S = v / i | 0, T = v % i;
        for (const [C, W] of f) {
          const B = S + C, R = T + W;
          if (B < 0 || B >= t || R < 0 || R >= i) continue;
          const F = B * i + R;
          !p[F] || d[F] || (d[F] = h, w.push(F));
        }
      }
      c.push({ pixels: $, sum: b });
    }
  const g = [];
  for (const y of c) {
    if (y.pixels.length < 4) continue;
    const _ = y.sum / y.pixels.length;
    if (_ < o) continue;
    let m = i, w = t, $ = 0, b = 0;
    for (const B of y.pixels) {
      const R = B / i | 0, F = B % i;
      F < m && (m = F), F > $ && ($ = F), R < w && (w = R), R > b && (b = R);
    }
    const x = $ - m + 1, v = b - w + 1;
    if (Math.min(x, v) < l) continue;
    const S = [
      { x: m, y: w },
      { x: $ + 1, y: w },
      { x: $ + 1, y: b + 1 },
      { x: m, y: b + 1 }
    ], C = vc(S, u).map((B) => ({
      x: yo(B.x / r, 0, Number.MAX_SAFE_INTEGER),
      y: yo(B.y / a, 0, Number.MAX_SAFE_INTEGER)
    }));
    Math.min(
      Math.hypot(C[1].x - C[0].x, C[1].y - C[0].y),
      Math.hypot(C[3].x - C[0].x, C[3].y - C[0].y)
    ) < l || g.push({ points: C, score: _ });
  }
  return g.sort((y, _) => {
    const m = Math.min(...y.points.map((x) => x.y)), w = Math.min(..._.points.map((x) => x.y));
    if (Math.abs(m - w) > 10) return m - w;
    const $ = Math.min(...y.points.map((x) => x.x)), b = Math.min(..._.points.map((x) => x.x));
    return $ - b;
  }), g;
}
function vc(e, t) {
  const i = e.map((d) => d.x), r = e.map((d) => d.y);
  let a = Math.min(...i), n = Math.max(...i), s = Math.min(...r), o = Math.max(...r);
  const u = Math.max(n - a, 1), l = Math.max(o - s, 1), p = u * l * t / (2 * (u + l));
  return a -= p, n += p, s -= p, o += p, [
    { x: a, y: s },
    { x: n, y: s },
    { x: n, y: o },
    { x: a, y: o }
  ];
}
function yo(e, t, i) {
  return Math.max(t, Math.min(i, e));
}
const Wi = [0.485, 0.456, 0.406], Gi = [0.229, 0.224, 0.225];
function xc(e) {
  return new Promise((t, i) => {
    const r = URL.createObjectURL(e), a = new Image();
    a.onload = () => {
      URL.revokeObjectURL(r), t(a);
    }, a.onerror = () => {
      URL.revokeObjectURL(r), i(new Error("图片加载失败"));
    }, a.src = r;
  });
}
function Fi(e, t, i) {
  const r = t ?? ("naturalWidth" in e && e.naturalWidth ? e.naturalWidth : "width" in e ? Number(e.width) : 0), a = i ?? ("naturalHeight" in e && e.naturalHeight ? e.naturalHeight : "height" in e ? Number(e.height) : 0);
  if (!r || !a) throw new Error("无法读取图片尺寸");
  const n = document.createElement("canvas");
  n.width = r, n.height = a;
  const s = n.getContext("2d", { willReadFrequently: !0 });
  if (!s) throw new Error("Canvas 不可用");
  return s.drawImage(e, 0, 0), s.getImageData(0, 0, r, a);
}
async function kc(e) {
  if (typeof ImageData < "u" && e instanceof ImageData)
    return e;
  if (typeof ImageBitmap < "u" && e instanceof ImageBitmap)
    return Fi(e, e.width, e.height);
  if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement)
    return e.complete || await e.decode(), Fi(e);
  if (typeof Blob < "u" && e instanceof Blob) {
    const t = await xc(e);
    return Fi(t);
  }
  throw new Error("不支持的输入类型");
}
function Sc(e, t, i = 960) {
  let r = 1;
  const a = Math.max(e, t);
  a > i && (r = i / a);
  let n = Math.round(e * r), s = Math.round(t * r);
  return n = Math.max(32, Math.round(n / 32) * 32), s = Math.max(32, Math.round(s / 32) * 32), {
    resizeW: n,
    resizeH: s,
    ratioW: n / e,
    ratioH: s / t
  };
}
function Ic(e, t, i) {
  const r = e, a = document.createElement("canvas");
  a.width = t, a.height = i;
  const n = a.getContext("2d", { willReadFrequently: !0 });
  if (!n) throw new Error("Canvas 不可用");
  const s = document.createElement("canvas");
  s.width = r.width, s.height = r.height;
  const o = s.getContext("2d");
  if (!o) throw new Error("Canvas 不可用");
  o.putImageData(r, 0, 0), n.drawImage(s, 0, 0, t, i);
  const { data: u } = n.getImageData(0, 0, t, i), l = new Float32Array(3 * t * i), p = t * i;
  for (let d = 0; d < p; d++) {
    const c = u[d * 4] / 255, h = u[d * 4 + 1] / 255, f = u[d * 4 + 2] / 255;
    l[d] = (f - Wi[0]) / Gi[0], l[p + d] = (h - Wi[1]) / Gi[1], l[p * 2 + d] = (c - Wi[2]) / Gi[2];
  }
  return l;
}
function Tc(e, t) {
  const i = Ec(e, t), r = 48, a = i.width / Math.max(i.height, 1);
  let n = Math.max(8, Math.ceil(r * a));
  n = Math.min(n, 3200);
  const s = document.createElement("canvas");
  s.width = n, s.height = r;
  const o = s.getContext("2d", { willReadFrequently: !0 });
  if (!o) throw new Error("Canvas 不可用");
  o.drawImage(i.canvas, 0, 0, n, r);
  const { data: u } = o.getImageData(0, 0, n, r), l = new Float32Array(3 * r * n), p = r * n;
  for (let d = 0; d < p; d++) {
    const c = u[d * 4] / 255, h = u[d * 4 + 1] / 255, f = u[d * 4 + 2] / 255;
    l[d] = (f - 0.5) / 0.5, l[p + d] = (h - 0.5) / 0.5, l[p * 2 + d] = (c - 0.5) / 0.5;
  }
  return { tensor: l, width: n, height: r };
}
function Ec(e, t) {
  const i = t.map((f) => f.x), r = t.map((f) => f.y), a = Math.max(0, Math.floor(Math.min(...i))), n = Math.min(e.width, Math.ceil(Math.max(...i))), s = Math.max(0, Math.floor(Math.min(...r))), o = Math.min(e.height, Math.ceil(Math.max(...r))), u = Math.max(1, n - a), l = Math.max(1, o - s), p = document.createElement("canvas");
  p.width = e.width, p.height = e.height;
  const d = p.getContext("2d");
  if (!d) throw new Error("Canvas 不可用");
  d.putImageData(e, 0, 0);
  const c = document.createElement("canvas");
  c.width = u, c.height = l;
  const h = c.getContext("2d");
  if (!h) throw new Error("Canvas 不可用");
  return h.drawImage(p, a, s, u, l, 0, 0, u, l), { canvas: c, width: u, height: l };
}
const Yd = "/webocr/", zc = `${Yd}assets/`, Cc = `${Yd}ort/`;
function Hi(e, t) {
  return /^https?:\/\//i.test(t) || t.startsWith("/") ? t : `${e.endsWith("/") ? e : `${e}/`}${t.replace(/^\.\//, "")}`;
}
class Oc {
  detSession = null;
  recSession = null;
  charset = [];
  ready = !1;
  provider = "wasm";
  options;
  constructor(t = {}) {
    const i = t.assetsUrl ?? zc;
    this.options = {
      assetsUrl: i,
      detModelUrl: t.detModelUrl ?? Hi(i, "models/PP-OCRv6_det_tiny.onnx"),
      recModelUrl: t.recModelUrl ?? Hi(i, "models/PP-OCRv6_rec_tiny.onnx"),
      charsetUrl: t.charsetUrl ?? Hi(i, "ppocr_keys_v6_tiny.json"),
      wasmPaths: t.wasmPaths ?? Cc,
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
    this.emit({ stage: "loading", message: "配置推理引擎…", percent: 5 }), te.wasm.wasmPaths = this.options.wasmPaths, te.wasm.numThreads = 1, this.emit({ stage: "loading", message: "加载字符集…", percent: 15 });
    const t = await fetch(this.options.charsetUrl);
    if (!t.ok)
      throw new Error(`字符集加载失败: ${this.options.charsetUrl}`);
    this.charset = await t.json();
    const i = this.options.executionProviders;
    return this.emit({ stage: "loading", message: "加载检测模型…", percent: 35 }), this.detSession = await this.createSession(
      this.options.detModelUrl,
      i
    ), this.emit({ stage: "loading", message: "加载识别模型…", percent: 70 }), this.recSession = await this.createSession(
      this.options.recModelUrl,
      i
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
    const i = performance.now();
    this.emit({ stage: "detect", message: "读取图片…", percent: 5 });
    const r = await kc(t), { resizeW: a, resizeH: n, ratioW: s, ratioH: o } = Sc(
      r.width,
      r.height,
      this.options.detLimitSideLen
    );
    this.emit({
      stage: "detect",
      message: `文本检测 ${a}×${n}…`,
      percent: 15
    });
    const u = Ic(r, a, n), l = new $e("float32", u, [
      1,
      3,
      n,
      a
    ]), p = performance.now(), d = this.detSession.inputNames[0], c = await this.detSession.run({ [d]: l }), h = performance.now() - p, f = this.detSession.outputNames[0], g = c[f].data, y = c[f].dims, _ = Number(y.length === 4 ? y[2] : y[1]), m = Number(y.length === 4 ? y[3] : y[2]), w = bc(g, _, m, s, o);
    this.emit({
      stage: "recognize",
      message: `检测到 ${w.length} 个文本区域，开始识别…`,
      percent: 40
    });
    const $ = [], b = performance.now();
    for (let S = 0; S < w.length; S++) {
      const T = w[S], { tensor: C, width: W, height: B } = Tc(r, T.points), R = new $e("float32", C, [
        1,
        3,
        B,
        W
      ]), F = this.recSession.inputNames[0], O = await this.recSession.run({ [F]: R }), M = this.recSession.outputNames[0], G = O[M].data, K = O[M].dims, L = Number(K[1]), X = Number(K[2]), { text: E, confidence: q } = wc(
        G,
        L,
        X,
        this.charset
      );
      E.trim() && $.push({ box: T, text: E, confidence: q });
      const N = 40 + Math.round((S + 1) / Math.max(w.length, 1) * 55);
      this.emit({
        stage: "recognize",
        message: `识别中 ${S + 1}/${w.length}`,
        percent: N
      });
    }
    const x = performance.now() - b, v = performance.now() - i;
    return this.emit({
      stage: "done",
      message: `完成：${$.length} 行 · ${(v / 1e3).toFixed(2)}s`,
      percent: 100
    }), { lines: $, elapsedMs: v, detectMs: h, recognizeMs: x };
  }
  /** @deprecated 使用 recognize() */
  recognizeFile(t) {
    return this.recognize(t);
  }
  dispose() {
    this.detSession = null, this.recSession = null, this.charset = [], this.ready = !1;
  }
  async createSession(t, i) {
    let r;
    for (const a of i)
      try {
        const n = await dr.create(t, {
          executionProviders: [a]
        });
        return this.provider = a, n;
      } catch (n) {
        r = n;
      }
    throw r instanceof Error ? r : new Error("无法创建推理会话");
  }
  emit(t) {
    this.options.onProgress?.(t);
  }
}
async function Bc(e) {
  const t = new Oc(e);
  return await t.init(), t;
}
function Rc() {
  return new URL("data:video/mp2t;base64,ZXhwb3J0IHsgY3JlYXRlV2ViT2NyLCBXZWJPY3IsIE9jckVuZ2luZSB9IGZyb20gIi4vd2ViT2NyIjsKZXhwb3J0IHsKICBERUZBVUxUX0FTU0VUU19VUkwsCiAgREVGQVVMVF9NT1VOVF9QUkVGSVgsCiAgREVGQVVMVF9XQVNNX1BBVEhTLAp9IGZyb20gIi4vZGVmYXVsdHMiOwpleHBvcnQgdHlwZSB7CiAgRXhlY3V0aW9uUHJvdmlkZXJOYW1lLAogIE9jcklucHV0LAogIE9jckxpbmUsCiAgT2NyUHJvZ3Jlc3MsCiAgT2NyUmVzdWx0LAogIFBvaW50LAogIFRleHRCb3gsCiAgV2ViT2NyT3B0aW9ucywKfSBmcm9tICIuL3R5cGVzIjsK", import.meta.url).href;
}
function Ac(e) {
  return e.endsWith("/") ? e : `${e}/`;
}
function Mc(e) {
  const t = Ac(e ?? Rc());
  return {
    assetsUrl: new URL("assets/", t).href,
    wasmPaths: new URL("ort/", t).href
  };
}
async function Dc(e = {}) {
  const { baseUrl: t, ...i } = e, r = Mc(t);
  return Bc({
    ...i,
    assetsUrl: i.assetsUrl ?? r.assetsUrl,
    wasmPaths: i.wasmPaths ?? r.wasmPaths
  });
}
export {
  Oc as OcrEngine,
  Oc as WebOcr,
  Dc as createWebOcr,
  Rc as getDistBaseUrl,
  Ac as normalizeBaseUrl,
  Mc as resolveAssetUrls
};
//# sourceMappingURL=browser.js.map
