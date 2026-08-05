/**
 * CTC 贪心解码。
 * PP-OCRv6 tiny ONNX 输出已是 softmax 概率（每行和≈1），不要再做一次 softmax。
 * 解码表：0=blank，1..N=字符，末尾补空格 → 与模型 6906 维对齐。
 */
export declare function ctcGreedyDecode(logits: Float32Array, time: number, classes: number, charset: string[]): {
    text: string;
    confidence: number;
};
