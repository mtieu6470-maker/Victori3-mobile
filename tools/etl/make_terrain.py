"""Builds public/map/terrain.jpg (2048 x 967, lat 85..-85, plate carree): Natural Earth I land cover colours with
shaded relief (NE1_50M_SR_W, public domain). Used by the Terrain map mode and to tint the political map with land
cover. The raster's own water (blue) pixels are in-painted from neighbouring land colours by normalised convolution,
so bilinear sampling never bleeds water colour into coasts; the region grid alone decides what is water.
Usage: python3 tools/etl/make_terrain.py   (after fetch_natural_earth.sh)"""
import os
import numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
C = os.path.join(ROOT, 'tools/etl/.cache')
OW, OH = 2048, 967
src = Image.open(os.path.join(C, 'NE1_50M_SR_W/NE1_50M_SR_W/NE1_50M_SR_W.tif')).convert('RGB')
w, h = src.size; top = round(h * 5 / 180)
col = np.asarray(src.crop((0, top, w, h - top)).resize((OW, OH), Image.LANCZOS), dtype=np.float64)
water = (col[..., 2] > col[..., 0] + 12) & (col[..., 2] > col[..., 1] - 2)
import array, zlib
raw = zlib.decompress(open(os.path.join(ROOT, 'assets/map/admin1_grid.bin.gz'), 'rb').read(), 47)
a = array.array('H'); a.frombytes(raw)
mask = bytearray(8192 * 3868); k = 0
for i in range(0, len(a), 2):
    v, n = a[i], a[i + 1]; mask[k:k + n] = (b'\xff' if v else b'\x00') * n; k += n
land = np.asarray(Image.frombytes('L', (8192, 3868), bytes(mask)).resize((OW, OH), Image.BOX)) > 160
have = (land & ~water).astype(np.float64)  # the region grid decides land; the raster's colour decides inland water

def blur(a, r):  # box blur, wraps east-west, clamps north-south
    a = np.concatenate([a[:, -r:], a, a[:, :r]], axis=1)
    c = np.cumsum(a, axis=1); c = np.concatenate([np.zeros_like(c[:, :1]), c], axis=1)
    a = (c[:, 2 * r + 1:] - c[:, :-2 * r - 1])
    p = np.concatenate([np.repeat(a[:1], r, 0), a, np.repeat(a[-1:], r, 0)], axis=0)
    c = np.cumsum(p, axis=0); c = np.concatenate([np.zeros_like(c[:1]), c], axis=0)
    return c[2 * r + 1:] - c[:-2 * r - 1]

out = col * have[..., None]
for r in (1, 2, 4, 8, 16, 32, 64, 128):
    den = blur(have, r); num = np.stack([blur(out[..., k], r) for k in range(3)], -1)
    fill = (have == 0) & (den > 1e-6)
    out[fill] = num[fill] / den[fill][:, None]; have[fill] = 1.0
out[have == 0] = (120, 130, 110)
os.makedirs(os.path.join(ROOT, 'public/map'), exist_ok=True)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(os.path.join(ROOT, 'public/map/terrain.jpg'), quality=86, optimize=True, progressive=True)
print('wrote public/map/terrain.jpg', os.path.getsize(os.path.join(ROOT, 'public/map/terrain.jpg')), 'water px', int(water.sum()))
