import json
import re
from pathlib import Path

src = Path(
    r"C:\Users\Administrator\.cursor\projects\d-code-Chad-webocr\agent-tools\72bb61ff-3263-41d7-a710-d2e229fb477f.txt"
)
text = src.read_text(encoding="utf-8")
match = re.search(r"character_dict:\n((?:  - .+\n)+)", text)
if not match:
    raise SystemExit("character_dict not found")

chars: list[str] = []
for line in match.group(1).splitlines():
    line = line.strip()
    if not line.startswith("-"):
        continue
    val = line[1:].strip()
    if len(val) >= 2 and val[0] == "'" and val[-1] == "'":
        val = val[1:-1].replace("''", "'")
    elif len(val) >= 2 and val[0] == '"' and val[-1] == '"':
        val = val[1:-1]
    chars.append(val)

out = Path(r"d:\code\Chad\webocr\public\ppocr_keys_v6_tiny.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(chars, ensure_ascii=False), encoding="utf-8")
print(f"chars={len(chars)} first10={chars[:10]} last5={chars[-5:]}")
