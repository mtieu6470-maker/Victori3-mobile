// Per-tick derived indices (dirty-flag invalidated on territorial change). Pure caches: never authoritative state.
import { data } from './data/db';
import type { GameState, Region } from './types';

interface TickCache { tick: number; version: number; byOwner: Map<string, Region[]>; borders: Map<string, Set<string>> }
let cache: TickCache | null = null;
let cacheState: GameState | null = null;
let version = 0;

export function invalidate() { version++; }

export function tickCache(st: GameState): TickCache {
  if (cache && cacheState === st && cache.tick === st.tick && cache.version === version) return cache;
  const d = data();
  const byOwner = new Map<string, Region[]>();
  for (const r of st.regions) { const a = byOwner.get(r.owner); if (a) a.push(r); else byOwner.set(r.owner, [r]); }
  const borders = new Map<string, Set<string>>();
  for (const [a, b] of d.map.adjacency) {
    const oa = st.regions[d.regionIndex.get(a)!].owner, ob = st.regions[d.regionIndex.get(b)!].owner;
    if (oa === ob) continue;
    (borders.get(oa) ?? borders.set(oa, new Set()).get(oa)!).add(ob);
    (borders.get(ob) ?? borders.set(ob, new Set()).get(ob)!).add(oa);
  }
  cache = { tick: st.tick, version, byOwner, borders }; cacheState = st;
  return cache;
}
export const regionsOf = (st: GameState, id: string): Region[] => tickCache(st).byOwner.get(id) ?? [];
export const bordersOf = (st: GameState, id: string): Set<string> => tickCache(st).borders.get(id) ?? new Set();
