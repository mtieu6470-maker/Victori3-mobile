"""Builds public/map/relief.jpg (4096 x 1934, lat 85..-85, plate carrée) from Natural Earth rasters (public domain):
land = SR_50M shaded relief, water = OB_50M ocean-bottom relief (luminance). The land/water mask comes from
assets/map/admin1_grid.bin.gz so the texture lines up with the region grid.
Usage: python3 tools/etl/make_relief.py   (after fetch_natural_earth.sh and prepare_map_sources.ts)"""
import array, os, sys, zlib
from PIL import Image, ImageFilter
Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
C = os.path.join(ROOT, 'tools/etl/.cache')
OW, OH = 4096, 1934
def crop85(im):  # source rasters span lat 90..-90
    w, h = im.size; top = round(h * 5 / 180); return im.crop((0, top, w, h - top)).resize((OW, OH), Image.LANCZOS)
sr = crop85(Image.open(os.path.join(C, 'SR_50M/SR_50M.tif')).convert('L'))
ob = crop85(Image.open(os.path.join(C, 'OB_50M/OB_50M/OB_50M.tif')).convert('L'))
raw = zlib.decompress(open(os.path.join(ROOT, 'assets/map/admin1_grid.bin.gz'), 'rb').read(), 47)
a = array.array('H'); a.frombytes(raw)
W, H = 8192, 3868
mask = bytearray(W * H); k = 0
for i in range(0, len(a), 2):
    v, n = a[i], a[i + 1]; mask[k:k + n] = (b'\xff' if (v and v != 65534) else b'\x00') * n; k += n
m = Image.frombytes('L', (W, H), bytes(mask)).resize((OW, OH), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.6))
out = Image.composite(sr, ob, m)
print('relief stats sr', sr.getextrema(), 'ob', ob.getextrema())
os.makedirs(os.path.join(ROOT, 'public/map'), exist_ok=True)
out.save(os.path.join(ROOT, 'public/map/relief.jpg'), quality=82, optimize=True, progressive=True)
print('wrote public/map/relief.jpg', os.path.getsize(os.path.join(ROOT, 'public/map/relief.jpg')))
