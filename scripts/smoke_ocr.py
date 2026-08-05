"""用 Python ORT 对 sample.png 做检测+识别，核对预处理与词表。"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

try:
    import onnxruntime as ort
except ImportError:
    import subprocess
    import sys

    subprocess.check_call([sys.executable, "-m", "pip", "install", "onnxruntime", "pillow", "-q"])
    import onnxruntime as ort

ROOT = Path(__file__).resolve().parents[1]
DET = ROOT / "public" / "models" / "PP-OCRv6_det_tiny.onnx"
REC = ROOT / "public" / "models" / "PP-OCRv6_rec_tiny.onnx"
KEYS = ROOT / "public" / "ppocr_keys_v6_tiny.json"
IMG = ROOT / "public" / "sample.png"


def det_resize(w, h, limit=960):
    ratio = 1.0
    if max(w, h) > limit:
        ratio = limit / max(w, h)
    rw = max(32, int(round(w * ratio / 32) * 32))
    rh = max(32, int(round(h * ratio / 32) * 32))
    return rw, rh


def preprocess_det(img: Image.Image):
    w, h = img.size
    rw, rh = det_resize(w, h)
    resized = img.resize((rw, rh), Image.BILINEAR)
    arr = np.asarray(resized).astype(np.float32)  # RGB
    # BGR + normalize
    bgr = arr[:, :, ::-1]
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    x = (bgr / 255.0 - mean) / std
    x = x.transpose(2, 0, 1)[None]  # NCHW
    return x, rw, rh, w, h


def db_boxes(prob, ratio_w, ratio_h, thresh=0.2, box_thresh=0.4):
    binary = prob > thresh
    h, w = binary.shape
    visited = np.zeros_like(binary, dtype=bool)
    boxes = []
    for y in range(h):
        for x in range(w):
            if not binary[y, x] or visited[y, x]:
                continue
            stack = [(y, x)]
            visited[y, x] = True
            pixels = []
            score_sum = 0.0
            while stack:
                cy, cx = stack.pop()
                pixels.append((cy, cx))
                score_sum += float(prob[cy, cx])
                for dy, dx in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < h and 0 <= nx < w and binary[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        stack.append((ny, nx))
            if len(pixels) < 4:
                continue
            score = score_sum / len(pixels)
            if score < box_thresh:
                continue
            ys = [p[0] for p in pixels]
            xs = [p[1] for p in pixels]
            minx, maxx = min(xs), max(xs)
            miny, maxy = min(ys), max(ys)
            # unclip-ish padding
            bw, bh = maxx - minx + 1, maxy - miny + 1
            pad = int(round(max(bw, bh) * 0.1))
            minx = max(0, minx - pad)
            miny = max(0, miny - pad)
            maxx = min(w - 1, maxx + pad)
            maxy = min(h - 1, maxy + pad)
            boxes.append(
                (
                    [
                        (minx / ratio_w, miny / ratio_h),
                        ((maxx + 1) / ratio_w, miny / ratio_h),
                        ((maxx + 1) / ratio_w, (maxy + 1) / ratio_h),
                        (minx / ratio_w, (maxy + 1) / ratio_h),
                    ],
                    score,
                )
            )
    boxes.sort(key=lambda b: (b[0][0][1], b[0][0][0]))
    return boxes


def preprocess_rec(img: Image.Image, box):
    xs = [p[0] for p in box]
    ys = [p[1] for p in box]
    minx, maxx = int(max(0, min(xs))), int(min(img.width, max(xs)))
    miny, maxy = int(max(0, min(ys))), int(min(img.height, max(ys)))
    crop = img.crop((minx, miny, max(minx + 1, maxx), max(miny + 1, maxy)))
    img_h = 48
    ratio = crop.width / max(crop.height, 1)
    img_w = max(8, min(3200, int(np.ceil(img_h * ratio))))
    crop = crop.resize((img_w, img_h), Image.BILINEAR)
    arr = np.asarray(crop).astype(np.float32)  # RGB
    bgr = arr[:, :, ::-1]
    x = bgr.transpose(2, 0, 1) / 255.0
    x = (x - 0.5) / 0.5
    return x[None].astype(np.float32), crop


def ctc_decode(logits, charset):
    # logits: [T, C]
    table = [""] + list(charset)
    if table[-1] != " ":
        table.append(" ")
    indexes = logits.argmax(axis=1)
    # confidence approx
    exp = np.exp(logits - logits.max(axis=1, keepdims=True))
    probs = exp / exp.sum(axis=1, keepdims=True)
    maxp = probs.max(axis=1)

    out = []
    confs = []
    prev = -1
    for i, idx in enumerate(indexes):
        idx = int(idx)
        if idx == 0:
            prev = -1
            continue
        if idx == prev:
            continue
        out.append(table[idx] if idx < len(table) else "?")
        confs.append(float(maxp[i]))
        prev = idx
    conf = float(np.mean(confs)) if confs else 0.0
    return "".join(out), conf


def main():
    charset = json.loads(KEYS.read_text(encoding="utf-8"))
    print("charset", len(charset), "table", len(charset) + 2)
    img = Image.open(IMG).convert("RGB")
    x, rw, rh, ow, oh = preprocess_det(img)
    print("det input", x.shape, "orig", ow, oh)

    det = ort.InferenceSession(str(DET), providers=["CPUExecutionProvider"])
    det_out = det.run(None, {det.get_inputs()[0].name: x})[0]
    print("det out", det_out.shape, "minmax", float(det_out.min()), float(det_out.max()))
    prob = det_out[0, 0]
    boxes = db_boxes(prob, rw / ow, rh / oh)
    print("boxes", len(boxes))

    rec = ort.InferenceSession(str(REC), providers=["CPUExecutionProvider"])
    vis = img.copy()
    draw = ImageDraw.Draw(vis)

    for i, (box, score) in enumerate(boxes):
        xin, crop = preprocess_rec(img, box)
        y = rec.run(None, {rec.get_inputs()[0].name: xin})[0]
        print("rec out", y.shape, "minmax", float(y.min()), float(y.max()))
        logits = y[0]
        text, conf = ctc_decode(logits, charset)
        print(f"#{i+1} det={score:.3f} conf={conf:.3f} text={text!r}")
        draw.rectangle([box[0], box[2]], outline=(0, 200, 0), width=2)

        # also try RGB instead of BGR
        arr = np.asarray(crop).astype(np.float32)
        xrgb = arr.transpose(2, 0, 1) / 255.0
        xrgb = ((xrgb - 0.5) / 0.5)[None].astype(np.float32)
        y2 = rec.run(None, {rec.get_inputs()[0].name: xrgb})[0]
        text2, conf2 = ctc_decode(y2[0], charset)
        print(f"   RGB-alt conf={conf2:.3f} text={text2!r}")

    out = ROOT / "public" / "sample_boxes.png"
    vis.save(out)
    print("saved", out)


if __name__ == "__main__":
    main()
