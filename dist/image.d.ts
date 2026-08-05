import type { Point } from "./types";
export declare function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement>;
/** @deprecated 使用 loadImageFromBlob */
export declare function loadImageFromFile(file: File): Promise<HTMLImageElement>;
export declare function getImageData(img: HTMLImageElement | ImageBitmap | CanvasImageSource, width?: number, height?: number): ImageData;
export declare function toImageData(input: File | Blob | HTMLImageElement | ImageBitmap | ImageData): Promise<ImageData>;
/** 长边不超过 limit，且宽高均为 32 的倍数 */
export declare function calcDetSize(width: number, height: number, limit?: number): {
    resizeW: number;
    resizeH: number;
    ratioW: number;
    ratioH: number;
};
/** BGR + ImageNet normalize + CHW，输出 Float32Array */
export declare function preprocessDet(imageData: ImageData, resizeW: number, resizeH: number): Float32Array;
/** 识别预处理：高 48，宽按比例，归一化到 [-1, 1]，BGR CHW */
export declare function preprocessRec(imageData: ImageData, box: Point[]): {
    tensor: Float32Array;
    width: number;
    height: number;
};
