import type { Point, TextBox } from "./types";

type Options = {
  thresh?: number;
  boxThresh?: number;
  unclipRatio?: number;
  minSize?: number;
};

/**
 * DBNet 后处理：二值化 → 连通域 → unclip 外扩 → 过滤 → 按阅读顺序排序
 */
export function dbPostprocess(
  prob: Float32Array,
  height: number,
  width: number,
  ratioW: number,
  ratioH: number,
  options: Options = {},
): TextBox[] {
  const thresh = options.thresh ?? 0.2;
  const boxThresh = options.boxThresh ?? 0.4;
  const unclipRatio = options.unclipRatio ?? 1.4;
  const minSize = options.minSize ?? 3;

  const binary = new Uint8Array(height * width);
  for (let i = 0; i < binary.length; i++) {
    binary[i] = prob[i] > thresh ? 1 : 0;
  }

  const labels = new Int32Array(height * width);
  const components: { pixels: number[]; sum: number }[] = [];
  let label = 0;

  const neighbors = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!binary[idx] || labels[idx]) continue;
      label += 1;
      const queue: number[] = [idx];
      labels[idx] = label;
      const pixels: number[] = [];
      let sum = 0;
      let qh = 0;

      while (qh < queue.length) {
        const cur = queue[qh++];
        pixels.push(cur);
        sum += prob[cur];
        const cy = (cur / width) | 0;
        const cx = cur % width;
        for (const [dy, dx] of neighbors) {
          const ny = cy + dy;
          const nx = cx + dx;
          if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;
          const nidx = ny * width + nx;
          if (!binary[nidx] || labels[nidx]) continue;
          labels[nidx] = label;
          queue.push(nidx);
        }
      }
      components.push({ pixels, sum });
    }
  }

  const boxes: TextBox[] = [];

  for (const comp of components) {
    if (comp.pixels.length < 4) continue;
    const score = comp.sum / comp.pixels.length;
    if (score < boxThresh) continue;

    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    for (const p of comp.pixels) {
      const y = (p / width) | 0;
      const x = p % width;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (Math.min(bw, bh) < minSize) continue;

    const rect: Point[] = [
      { x: minX, y: minY },
      { x: maxX + 1, y: minY },
      { x: maxX + 1, y: maxY + 1 },
      { x: minX, y: maxY + 1 },
    ];

    const expanded = unclipRect(rect, unclipRatio);
    const mapped = expanded.map((pt) => ({
      x: clamp(pt.x / ratioW, 0, Number.MAX_SAFE_INTEGER),
      y: clamp(pt.y / ratioH, 0, Number.MAX_SAFE_INTEGER),
    }));

    const side = Math.min(
      Math.hypot(mapped[1].x - mapped[0].x, mapped[1].y - mapped[0].y),
      Math.hypot(mapped[3].x - mapped[0].x, mapped[3].y - mapped[0].y),
    );
    if (side < minSize) continue;

    boxes.push({ points: mapped, score });
  }

  boxes.sort((a, b) => {
    const ay = Math.min(...a.points.map((p) => p.y));
    const by = Math.min(...b.points.map((p) => p.y));
    if (Math.abs(ay - by) > 10) return ay - by;
    const ax = Math.min(...a.points.map((p) => p.x));
    const bx = Math.min(...b.points.map((p) => p.x));
    return ax - bx;
  });

  return boxes;
}

/**
 * 按面积 × 系数 / 周长 得到外扩距离，再对各边做平行外扩。
 * 注意：不能用「从中心径向放大」——扁长文本框几乎不会变高。
 */
function unclipRect(points: Point[], ratio: number): Point[] {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  const w = Math.max(maxX - minX, 1);
  const h = Math.max(maxY - minY, 1);
  const distance = (w * h * ratio) / (2 * (w + h));

  minX -= distance;
  maxX += distance;
  minY -= distance;
  maxY += distance;

  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ];
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
