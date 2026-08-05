import type { Point } from "./types";

const DET_MEAN = [0.485, 0.456, 0.406];
const DET_STD = [0.229, 0.224, 0.225];

export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片加载失败"));
    };
    img.src = url;
  });
}

/** @deprecated 使用 loadImageFromBlob */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return loadImageFromBlob(file);
}

export function getImageData(
  img: HTMLImageElement | ImageBitmap | CanvasImageSource,
  width?: number,
  height?: number,
): ImageData {
  const w =
    width ??
    ("naturalWidth" in img && img.naturalWidth
      ? img.naturalWidth
      : "width" in img
        ? Number(img.width)
        : 0);
  const h =
    height ??
    ("naturalHeight" in img && img.naturalHeight
      ? img.naturalHeight
      : "height" in img
        ? Number(img.height)
        : 0);
  if (!w || !h) throw new Error("无法读取图片尺寸");

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 不可用");
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, w, h);
}

export async function toImageData(
  input: File | Blob | HTMLImageElement | ImageBitmap | ImageData,
): Promise<ImageData> {
  if (typeof ImageData !== "undefined" && input instanceof ImageData) {
    return input;
  }
  if (typeof ImageBitmap !== "undefined" && input instanceof ImageBitmap) {
    return getImageData(input, input.width, input.height);
  }
  if (typeof HTMLImageElement !== "undefined" && input instanceof HTMLImageElement) {
    if (!input.complete) {
      await input.decode();
    }
    return getImageData(input);
  }
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    const img = await loadImageFromBlob(input);
    return getImageData(img);
  }
  throw new Error("不支持的输入类型");
}

/** 长边不超过 limit，且宽高均为 32 的倍数 */
export function calcDetSize(
  width: number,
  height: number,
  limit = 960,
): { resizeW: number; resizeH: number; ratioW: number; ratioH: number } {
  let ratio = 1;
  const maxSide = Math.max(width, height);
  if (maxSide > limit) ratio = limit / maxSide;

  let resizeW = Math.round(width * ratio);
  let resizeH = Math.round(height * ratio);
  resizeW = Math.max(32, Math.round(resizeW / 32) * 32);
  resizeH = Math.max(32, Math.round(resizeH / 32) * 32);

  return {
    resizeW,
    resizeH,
    ratioW: resizeW / width,
    ratioH: resizeH / height,
  };
}

/** BGR + ImageNet normalize + CHW，输出 Float32Array */
export function preprocessDet(
  imageData: ImageData,
  resizeW: number,
  resizeH: number,
): Float32Array {
  const src = imageData;
  const tmp = document.createElement("canvas");
  tmp.width = resizeW;
  tmp.height = resizeH;
  const ctx = tmp.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 不可用");

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = src.width;
  srcCanvas.height = src.height;
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) throw new Error("Canvas 不可用");
  srcCtx.putImageData(src, 0, 0);
  ctx.drawImage(srcCanvas, 0, 0, resizeW, resizeH);

  const { data } = ctx.getImageData(0, 0, resizeW, resizeH);
  const out = new Float32Array(3 * resizeW * resizeH);
  const hw = resizeW * resizeH;

  for (let i = 0; i < hw; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    // Paddle DecodeImage(BGR) + NormalizeImage(mean/std)
    out[i] = (b - DET_MEAN[0]) / DET_STD[0];
    out[hw + i] = (g - DET_MEAN[1]) / DET_STD[1];
    out[hw * 2 + i] = (r - DET_MEAN[2]) / DET_STD[2];
  }
  return out;
}

/** 识别预处理：高 48，宽按比例，归一化到 [-1, 1]，BGR CHW */
export function preprocessRec(
  imageData: ImageData,
  box: Point[],
): { tensor: Float32Array; width: number; height: number } {
  const crop = cropQuad(imageData, box);
  const imgH = 48;
  const ratio = crop.width / Math.max(crop.height, 1);
  let imgW = Math.max(8, Math.ceil(imgH * ratio));
  // 限制过宽，避免极端长文本占满内存
  imgW = Math.min(imgW, 3200);

  const canvas = document.createElement("canvas");
  canvas.width = imgW;
  canvas.height = imgH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 不可用");
  ctx.drawImage(crop.canvas, 0, 0, imgW, imgH);

  const { data } = ctx.getImageData(0, 0, imgW, imgH);
  const out = new Float32Array(3 * imgH * imgW);
  const hw = imgH * imgW;

  for (let i = 0; i < hw; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    out[i] = (b - 0.5) / 0.5;
    out[hw + i] = (g - 0.5) / 0.5;
    out[hw * 2 + i] = (r - 0.5) / 0.5;
  }

  return { tensor: out, width: imgW, height: imgH };
}

function cropQuad(
  imageData: ImageData,
  box: Point[],
): { canvas: HTMLCanvasElement; width: number; height: number } {
  const xs = box.map((p) => p.x);
  const ys = box.map((p) => p.y);
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const maxX = Math.min(imageData.width, Math.ceil(Math.max(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(imageData.height, Math.ceil(Math.max(...ys)));

  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);

  const src = document.createElement("canvas");
  src.width = imageData.width;
  src.height = imageData.height;
  const srcCtx = src.getContext("2d");
  if (!srcCtx) throw new Error("Canvas 不可用");
  srcCtx.putImageData(imageData, 0, 0);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 不可用");
  ctx.drawImage(src, minX, minY, w, h, 0, 0, w, h);

  return { canvas: out, width: w, height: h };
}
