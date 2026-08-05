"""生成一张中文测试图。"""
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    import subprocess
    import sys

    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])
    from PIL import Image, ImageDraw, ImageFont

out = Path(__file__).resolve().parents[1] / "public" / "sample.png"
img = Image.new("RGB", (640, 280), (245, 248, 252))
draw = ImageDraw.Draw(img)

font_paths = [
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\simhei.ttf",
    r"C:\Windows\Fonts\simsun.ttc",
]
font = None
for p in font_paths:
    try:
        font = ImageFont.truetype(p, 36)
        break
    except OSError:
        continue
if font is None:
    font = ImageFont.load_default()

lines = [
    "网页端 OCR 测试",
    "PP-OCRv6 tiny · 又快又准",
    "Hello WebOCR 2026",
]
y = 48
for line in lines:
    draw.text((40, y), line, fill=(20, 30, 45), font=font)
    y += 60

img.save(out)
print("wrote", out, out.stat().st_size)
