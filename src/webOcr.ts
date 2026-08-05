import * as ort from "onnxruntime-web";
import { ctcGreedyDecode } from "./ctcDecode";
import { dbPostprocess } from "./dbPostprocess";
import {
  calcDetSize,
  preprocessDet,
  preprocessRec,
  toImageData,
} from "./image";
import { DEFAULT_ASSETS_URL, DEFAULT_WASM_PATHS } from "./defaults";
import type {
  ExecutionProviderName,
  OcrInput,
  OcrLine,
  OcrProgress,
  OcrResult,
  WebOcrOptions,
} from "./types";

function joinUrl(base: string, rel: string): string {
  if (/^https?:\/\//i.test(rel) || rel.startsWith("/")) return rel;
  const b = base.endsWith("/") ? base : `${base}/`;
  return `${b}${rel.replace(/^\.\//, "")}`;
}

export class WebOcr {
  private detSession: ort.InferenceSession | null = null;
  private recSession: ort.InferenceSession | null = null;
  private charset: string[] = [];
  private ready = false;
  private provider = "wasm";
  private readonly options: Required<
    Pick<
      WebOcrOptions,
      | "assetsUrl"
      | "detModelUrl"
      | "recModelUrl"
      | "charsetUrl"
      | "wasmPaths"
      | "executionProviders"
      | "detLimitSideLen"
    >
  > & { onProgress?: WebOcrOptions["onProgress"] };

  constructor(options: WebOcrOptions = {}) {
    // 默认走包内资源（需配合 webocr/vite 插件挂载 /webocr/）
    const assetsUrl = options.assetsUrl ?? DEFAULT_ASSETS_URL;
    this.options = {
      assetsUrl,
      detModelUrl:
        options.detModelUrl ??
        joinUrl(assetsUrl, "models/PP-OCRv6_det_tiny.onnx"),
      recModelUrl:
        options.recModelUrl ??
        joinUrl(assetsUrl, "models/PP-OCRv6_rec_tiny.onnx"),
      charsetUrl:
        options.charsetUrl ?? joinUrl(assetsUrl, "ppocr_keys_v6_tiny.json"),
      wasmPaths: options.wasmPaths ?? DEFAULT_WASM_PATHS,
      executionProviders: options.executionProviders ?? ["webgpu", "wasm"],
      detLimitSideLen: options.detLimitSideLen ?? 960,
      onProgress: options.onProgress,
    };
  }

  get isReady(): boolean {
    return this.ready;
  }

  get executionProvider(): string {
    return this.provider;
  }

  set onProgress(cb: ((p: OcrProgress) => void) | undefined) {
    this.options.onProgress = cb;
  }

  async init(): Promise<this> {
    if (this.ready) return this;

    this.emit({ stage: "loading", message: "配置推理引擎…", percent: 5 });
    ort.env.wasm.wasmPaths = this.options.wasmPaths;
    ort.env.wasm.numThreads = 1;

    this.emit({ stage: "loading", message: "加载字符集…", percent: 15 });
    const charsetRes = await fetch(this.options.charsetUrl);
    if (!charsetRes.ok) {
      throw new Error(`字符集加载失败: ${this.options.charsetUrl}`);
    }
    this.charset = (await charsetRes.json()) as string[];

    const providers = this.options.executionProviders;

    this.emit({ stage: "loading", message: "加载检测模型…", percent: 35 });
    this.detSession = await this.createSession(
      this.options.detModelUrl,
      providers,
    );

    this.emit({ stage: "loading", message: "加载识别模型…", percent: 70 });
    this.recSession = await this.createSession(
      this.options.recModelUrl,
      providers,
    );

    this.ready = true;
    this.emit({
      stage: "done",
      message: `模型就绪 · ${this.provider} · 字典 ${this.charset.length} 字`,
      percent: 100,
    });
    return this;
  }

  /** 识别图片（File / Blob / HTMLImageElement / ImageBitmap / ImageData） */
  async recognize(input: OcrInput): Promise<OcrResult> {
    if (!this.detSession || !this.recSession) {
      throw new Error("请先调用 init() 或 createWebOcr()");
    }

    const t0 = performance.now();
    this.emit({ stage: "detect", message: "读取图片…", percent: 5 });

    const imageData = await toImageData(input);
    const { resizeW, resizeH, ratioW, ratioH } = calcDetSize(
      imageData.width,
      imageData.height,
      this.options.detLimitSideLen,
    );

    this.emit({
      stage: "detect",
      message: `文本检测 ${resizeW}×${resizeH}…`,
      percent: 15,
    });

    const detInput = preprocessDet(imageData, resizeW, resizeH);
    const detTensor = new ort.Tensor("float32", detInput, [
      1,
      3,
      resizeH,
      resizeW,
    ]);

    const detT0 = performance.now();
    const detIn = this.detSession.inputNames[0];
    const detOut = await this.detSession.run({ [detIn]: detTensor });
    const detectMs = performance.now() - detT0;

    const detName = this.detSession.outputNames[0];
    const detData = detOut[detName].data as Float32Array;
    const detDims = detOut[detName].dims;
    const outH = Number(detDims.length === 4 ? detDims[2] : detDims[1]);
    const outW = Number(detDims.length === 4 ? detDims[3] : detDims[2]);

    const boxes = dbPostprocess(detData, outH, outW, ratioW, ratioH);
    this.emit({
      stage: "recognize",
      message: `检测到 ${boxes.length} 个文本区域，开始识别…`,
      percent: 40,
    });

    const lines: OcrLine[] = [];
    const recT0 = performance.now();

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const { tensor, width, height } = preprocessRec(imageData, box.points);
      const recTensor = new ort.Tensor("float32", tensor, [
        1,
        3,
        height,
        width,
      ]);
      const recIn = this.recSession.inputNames[0];
      const recOut = await this.recSession.run({ [recIn]: recTensor });
      const recName = this.recSession.outputNames[0];
      const logits = recOut[recName].data as Float32Array;
      const dims = recOut[recName].dims;
      const time = Number(dims[1]);
      const classes = Number(dims[2]);
      const { text, confidence } = ctcGreedyDecode(
        logits,
        time,
        classes,
        this.charset,
      );

      if (text.trim()) {
        lines.push({ box, text, confidence });
      }

      const percent = 40 + Math.round(((i + 1) / Math.max(boxes.length, 1)) * 55);
      this.emit({
        stage: "recognize",
        message: `识别中 ${i + 1}/${boxes.length}`,
        percent,
      });
    }

    const recognizeMs = performance.now() - recT0;
    const elapsedMs = performance.now() - t0;

    this.emit({
      stage: "done",
      message: `完成：${lines.length} 行 · ${(elapsedMs / 1000).toFixed(2)}s`,
      percent: 100,
    });

    return { lines, elapsedMs, detectMs, recognizeMs };
  }

  /** @deprecated 使用 recognize() */
  recognizeFile(file: File): Promise<OcrResult> {
    return this.recognize(file);
  }

  dispose(): void {
    this.detSession = null;
    this.recSession = null;
    this.charset = [];
    this.ready = false;
  }

  private async createSession(
    model: string,
    providers: ExecutionProviderName[],
  ): Promise<ort.InferenceSession> {
    let lastError: unknown;
    for (const provider of providers) {
      try {
        const session = await ort.InferenceSession.create(model, {
          executionProviders: [provider],
        });
        this.provider = provider;
        return session;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error("无法创建推理会话");
  }

  private emit(p: OcrProgress): void {
    this.options.onProgress?.(p);
  }
}

/** 创建并初始化 WebOCR 引擎 */
export async function createWebOcr(options?: WebOcrOptions): Promise<WebOcr> {
  const ocr = new WebOcr(options);
  await ocr.init();
  return ocr;
}

/** @deprecated 使用 WebOcr */
export { WebOcr as OcrEngine };
