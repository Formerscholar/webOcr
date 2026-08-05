import type { TextBox } from "./types";
type Options = {
    thresh?: number;
    boxThresh?: number;
    unclipRatio?: number;
    minSize?: number;
};
/**
 * DBNet 后处理：二值化 → 连通域 → unclip 外扩 → 过滤 → 按阅读顺序排序
 */
export declare function dbPostprocess(prob: Float32Array, height: number, width: number, ratioW: number, ratioH: number, options?: Options): TextBox[];
export {};
