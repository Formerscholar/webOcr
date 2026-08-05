export type Point = { x: number; y: number };

export type TextBox = {
  points: Point[];
  score: number;
};

export type OcrLine = {
  box: TextBox;
  text: string;
  confidence: number;
};

export type OcrProgress = {
  stage: "idle" | "loading" | "detect" | "recognize" | "done" | "error";
  message: string;
  percent: number;
};

export type OcrResult = {
  lines: OcrLine[];
  elapsedMs: number;
  detectMs: number;
  recognizeMs: number;
};

export type ExecutionProviderName = "webgpu" | "webgl" | "wasm";

export type WebOcrOptions = {
  /**
   * 静态资源根路径（模型 + 字典）。
   * 默认 `/webocr/assets/`（包内资源，需 `webocr/vite` 插件）。
   */
  assetsUrl?: string;
  /** 检测模型 URL，默认 `{assetsUrl}models/PP-OCRv6_det_tiny.onnx` */
  detModelUrl?: string;
  /** 识别模型 URL，默认 `{assetsUrl}models/PP-OCRv6_rec_tiny.onnx` */
  recModelUrl?: string;
  /** 字符集 JSON URL，默认 `{assetsUrl}ppocr_keys_v6_tiny.json` */
  charsetUrl?: string;
  /**
   * onnxruntime-web wasm 目录。
   * 默认 `/webocr/ort/`（包内资源，需 `webocr/vite` 插件）。
   */
  wasmPaths?: string;
  /** 推理后端优先级，默认 `['webgpu','wasm']` */
  executionProviders?: ExecutionProviderName[];
  /** 检测长边上限，默认 960 */
  detLimitSideLen?: number;
  onProgress?: (p: OcrProgress) => void;
};

export type OcrInput = File | Blob | HTMLImageElement | ImageBitmap | ImageData;
