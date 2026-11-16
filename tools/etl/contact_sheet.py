"""Contact sheet of shipped identity images for human review (output goes to a path given on the command line).

    python3 tools/etl/contact_sheet.py identity|portrait <out.png> [page] [per_page]
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
kind, out = sys.argv[1], sys.argv[2]
page = int(sys.argv[3]) if len(sys.argv) > 3 else 0
per = int(sys.argv[4]) if len(sys.argv) > 4 else 60
src = 'identity_assets.json' if kind == 'identity' else 'portrait_assets.json'
assets = json.load(open(os.path.join(ROOT, 'historical_data/assets', src), encoding='utf-8'))['assets'][page * per:(page + 1) * per]
cw, ch = (170, 150) if kind == 'identity' else (130, 190)
cols = 10
rows = (len(assets) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, max(1, rows) * ch), (17, 26, 31))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 10)
except OSError:
    font = ImageFont.load_default()
for i, a in enumerate(assets):
    x, y = (i % cols) * cw, (i // cols) * ch
    im = Image.open(os.path.join(ROOT, 'public', a['path'])).convert('RGBA')
    im.thumbnail((cw - 10, ch - 42))
    sheet.paste(im, (x + (cw - im.size[0]) // 2, y + 4), im)
    label = a['id'].split('.', 1)[1] if kind == 'identity' else a['character'].split(':', 1)[1][:22]
    per_ = f"{a['period']['from'] or '…'}-{a['period']['to'] or '…'} {a['quality'][0]}" if kind == 'identity' else a['entity']
    d.text((x + 4, y + ch - 36), label[:26], fill=(236, 214, 162), font=font)
    d.text((x + 4, y + ch - 24), per_[:26], fill=(170, 165, 150), font=font)
    d.text((x + 4, y + ch - 12), a['source']['file'][:28], fill=(120, 118, 110), font=font)
sheet.save(out)
print(len(assets), 'items ->', out)
