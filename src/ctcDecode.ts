/**
 * CTC 贪心解码。
 * PP-OCRv6 tiny ONNX 输出已是 softmax 概率（每行和≈1），不要再做一次 softmax。
 * 解码表：0=blank，1..N=字符，末尾补空格 → 与模型 6906 维对齐。
 */
export function ctcGreedyDecode(
  logits: Float32Array,
  time: number,
  classes: number,
  charset: string[],
): { text: string; confidence: number } {
  const table = ["", ...charset];
  if (table.length < classes) table.push(" ");
  while (table.length < classes) table.push("");

  // 抽样判断是否已是概率分布
  let alreadyProb = false;
  if (time > 0) {
    let sum = 0;
    let finite = 0;
    for (let c = 0; c < classes; c++) {
      const v = logits[c];
      if (!Number.isFinite(v)) continue;
      sum += v;
      finite += 1;
    }
    alreadyProb = finite > 0 && sum > 0.8 && sum < 1.2;
  }

  const indexes: number[] = [];
  const probs: number[] = [];

  for (let t = 0; t < time; t++) {
    const offset = t * classes;
    let bestIdx = -1;
    let bestVal = -Infinity;

    for (let c = 0; c < classes; c++) {
      const v = logits[offset + c];
      if (!Number.isFinite(v)) continue;
      if (v > bestVal) {
        bestVal = v;
        bestIdx = c;
      }
    }
    if (bestIdx < 0) continue;

    let p: number;
    if (alreadyProb) {
      p = Math.max(0.001, Math.min(bestVal, 0.999));
    } else {
      let expSum = 0;
      let bestExp = 0;
      for (let c = 0; c < classes; c++) {
        const v = logits[offset + c];
        if (!Number.isFinite(v)) continue;
        const diff = v - bestVal;
        if (diff < -50) continue;
        const e = Math.exp(diff);
        if (!Number.isFinite(e)) continue;
        expSum += e;
        if (c === bestIdx) bestExp = e;
      }
      p =
        expSum > 0
          ? Math.max(0.001, Math.min(bestExp / expSum, 0.999))
          : 0.001;
    }

    indexes.push(bestIdx);
    probs.push(p);
  }

  const keptIdx: number[] = [];
  const keptProb: number[] = [];
  let prev = -1;
  for (let i = 0; i < indexes.length; i++) {
    const idx = indexes[i];
    if (idx === 0) {
      prev = -1;
      continue;
    }
    if (idx === prev) continue;
    keptIdx.push(idx);
    keptProb.push(probs[i]);
    prev = idx;
  }

  let text = "";
  for (const idx of keptIdx) {
    if (idx >= 0 && idx < table.length) text += table[idx];
  }

  const confidence =
    keptProb.length === 0
      ? 0
      : keptProb.reduce((a, b) => a + b, 0) / keptProb.length;

  return { text, confidence };
}
