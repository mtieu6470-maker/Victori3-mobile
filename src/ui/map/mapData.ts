// Map grid (region raster built by tools/build-map.ts) and helpers shared by the renderer, picking and labels.
import { data } from '../../engine/data/db';

export interface MapGrid {
  W: number; H: number; cpd: number; lat0: number;
  /** 0 = sea, otherwise region index + 1 (index into data().map.regionIds). */
  idx: Uint16Array;
}

/** Decodes the RLE (value, run) Uint16 pairs written by tools/build-map.ts. 0xffff (unassigned land) becomes sea. */
export function decodeGrid(buf: ArrayBuffer): MapGrid {
  const m = data().map;
  const runs = new Uint16Array(buf);
  const idx = new Uint16Array(m.width * m.height);
  let k = 0;
  for (let i = 0; i < runs.length; i += 2) { const v = runs[i] === 0xffff ? 0 : runs[i]; idx.fill(v, k, k + runs[i + 1]); k += runs[i + 1]; }
  if (k !== idx.length) throw new Error(`map.bin: expected ${idx.length} cells, got ${k}`);
  return { W: m.width, H: m.height, cpd: m.cpd, lat0: m.lat0, idx };
}

export async function loadGrid(url: string): Promise<MapGrid> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Không tải được bản đồ (${res.status})`);
  return decodeGrid(await res.arrayBuffer());
}

/** Region index (+1) at a grid cell, wrapping horizontally. */
export function cellAt(g: MapGrid, x: number, y: number): number {
  const yy = Math.floor(y); if (yy < 0 || yy >= g.H) return 0;
  const xx = ((Math.floor(x) % g.W) + g.W) % g.W;
  return g.idx[yy * g.W + xx];
}
