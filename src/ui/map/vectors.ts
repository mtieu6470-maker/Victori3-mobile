// Vector map layers drawn on the overlay canvas: coasts, region and country boundaries (derived from the region grid
// by tools/build-map.ts), rivers and smaller lakes (Natural Earth, simplified by tools/etl/prepare_map_sources.ts).
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';

export interface VectorData { pairs: [number, number][]; lines: number[][]; rivers: { r: number; n: string; p: number[] }[]; lakes: number[][] }
export async function loadVectors(base: string): Promise<VectorData | null> {
  try {
    const [b, r, l] = await Promise.all(['generated/borders.json', 'map/rivers.json', 'map/lakes.json'].map((f) => fetch(new URL(f, base).href).then((x) => (x.ok ? x.json() : null))));
    if (!b) return null;
    return { pairs: b.pairs, lines: b.lines, rivers: r ?? [], lakes: l ?? [] };
  } catch { return null; }
}
const path = (pts: number[], P: Path2D, close = false) => { P.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) P.lineTo(pts[i], pts[i + 1]); if (close) P.closePath(); };

export interface VectorPaths { coast: Path2D; country: Path2D; state: Path2D; riversMajor: Path2D; riversMinor: Path2D; lakes: Path2D; key: string }
/** Classifies every boundary line by the current owners (country border vs. internal state border vs. coast). */
export function buildPaths(v: VectorData, st: GameState, prev: VectorPaths | null): VectorPaths {
  const ids = data().map.regionIds; const byId = new Map(st.regions.map((r) => [r.id, r.owner]));
  const owner = ids.map((id) => byId.get(id) ?? '');
  const key = owner.join('|');
  if (prev && prev.key === key) return prev;
  const coast = new Path2D(), country = new Path2D(), state = new Path2D();
  for (const line of v.lines) {
    const [a, b] = v.pairs[line[0]]; const pts = line.slice(1);
    if (a === -1 || b === -1) path(pts, coast);
    else if (a < 0 || b < 0 || owner[a] !== owner[b]) path(pts, country);
    else path(pts, state);
  }
  const riversMajor = new Path2D(), riversMinor = new Path2D();
  for (const r of v.rivers) path(r.p, r.r <= 4 ? riversMajor : riversMinor);
  const lakes = new Path2D(); for (const l of v.lakes) path(l, lakes, true);
  return { coast, country, state, riversMajor, riversMinor, lakes, key };
}
