#!/usr/bin/env python3
"""Convert project-original illustration SVG masters into large and small WebP assets."""
from io import BytesIO
import json
from pathlib import Path
import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "historical_data/assets/illustration_assets.json"
PUBLIC = ROOT / "public"

data = json.loads(MANIFEST.read_text(encoding="utf-8"))
converted = 0
for asset in data.get("assets", []):
    source_rel = asset.get("path", "")
    if not source_rel.lower().endswith(".svg"):
        continue
    source = PUBLIC / source_rel
    if not source.is_file():
        raise FileNotFoundError(source)
    large_rel = source_rel[:-4] + ".webp"
    small_rel = source_rel[:-4] + "_480.webp"
    png = cairosvg.svg2png(url=str(source), output_width=1280, output_height=720)
    with Image.open(BytesIO(png)) as image:
        image = image.convert("RGB")
        large = PUBLIC / large_rel
        small = PUBLIC / small_rel
        large.parent.mkdir(parents=True, exist_ok=True)
        image.save(large, "WEBP", quality=80, method=6)
        image.resize((480, 270), Image.Resampling.LANCZOS).save(small, "WEBP", quality=80, method=6)
    asset["source"] = asset.get("source", {})
    asset["source"]["file"] = f"public/{source_rel}"
    asset["path"] = large_rel
    asset["thumbnail_path"] = small_rel
    asset["width"] = 1280
    asset["height"] = 720
    converted += 1

MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"converted": converted, "large_size": "1280x720", "thumbnail_size": "480x270", "format": "webp"}))
