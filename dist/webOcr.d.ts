import type { OcrInput, OcrProgress, OcrResult, WebOcrOptions } from "./types";
export declare class WebOcr {
    private detSession;
    private recSession;
    private charset;
    private ready;
    private provider;
    private readonly options;
    constructor(options?: WebOcrOptions);
    get isReady(): boolean;
    get executionProvider(): string;
    set onProgress(cb: ((p: OcrProgress) => void) | undefined);
    init(): Promise<this>;
    /** 识别图片（File / Blob / HTMLImageElement / ImageBitmap / ImageData） */
    recognize(input: OcrInput): Promise<OcrResult>;
    /** @deprecated 使用 recognize() */
    recognizeFile(file: File): Promise<OcrResult>;
    dispose(): void;
    private createSession;
    private emit;
}
/** 创建并初始化 WebOCR 引擎 */
export declare function createWebOcr(options?: WebOcrOptions): Promise<WebOcr>;
/** @deprecated 使用 WebOcr */
export { WebOcr as OcrEngine };
