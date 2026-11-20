// Core utilities: seeded RNG (xoshiro128**), calendar, relation keys, logging helpers.
import type { GameDate, GameState, LogEntry } from './types';

export function seedRng(seed: number): [number, number, number, number] {
  let s = seed >>> 0 || 1;
  const next = () => { s = (s + 0x9e3779b9) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b); z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35); return (z ^ (z >>> 16)) >>> 0; };
  return [next(), next(), next(), next()];
}

function nextRandom(rng: GameState['rng']): number {
  const result = Math.imul(rotl(Math.imul(rng[1], 5), 7), 9) >>> 0;
  const t = rng[1] << 9;
  rng[2] ^= rng[0]; rng[3] ^= rng[1]; rng[1] ^= rng[2]; rng[0] ^= rng[3]; rng[2] ^= t; rng[3] = rotl(rng[3], 11);
  rng[0] >>>= 0; rng[1] >>>= 0; rng[2] >>>= 0; rng[3] >>>= 0;
  return result / 4294967296;
}

/** Uniform [0,1) from the state's RNG (mutates state.rng). */
export function rand(st: GameState): number {
  return nextRandom(st.rng);
}

/**
 * Returns a deterministic RNG stream cloned from the current state.
 * Advancing this stream never mutates the campaign RNG; use for previews only.
 */
export function createRandomPreview(st: GameState): () => number {
  const rng: GameState['rng'] = [st.rng[0], st.rng[1], st.rng[2], st.rng[3]];
  return () => nextRandom(rng);
}
function rotl(x: number, k: number) { return ((x << k) | (x >>> (32 - k))) >>> 0; }
export const chance = (st: GameState, p: number) => rand(st) < p;
export function pick<T>(st: GameState, arr: T[]): T { return arr[Math.floor(rand(st) * arr.length)]; }
export function gauss(st: GameState): number { const u = Math.max(1e-9, rand(st)); const v = rand(st); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

export const clamp = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function dateStr(d: GameDate): string { return `${d.y}-${String(d.m).padStart(2, '0')}-01`; }
export function parseDate(s: string): GameDate { const [y, m] = s.split('-').map(Number); return { y, m: m || 1 }; }
export function dateToTick(s: string, start = 1836): number { const d = parseDate(s); return (d.y - start) * 12 + (d.m - 1); }
export function tickToDate(t: number, start = 1836): GameDate { return { y: start + Math.floor(t / 12), m: (t % 12) + 1 }; }
export const yearFrac = (st: GameState) => st.date.y + (st.date.m - 1) / 12;

export const relKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
export function getRel(st: GameState, a: string, b: string): number { return st.relations[relKey(a, b)] ?? 0; }
export function addRel(st: GameState, a: string, b: string, d: number) { const k = relKey(a, b); st.relations[k] = clamp((st.relations[k] ?? 0) + d, -100, 100); }
export function setRel(st: GameState, a: string, b: string, v: number) { st.relations[relKey(a, b)] = clamp(v, -100, 100); }

export const LOG_CAP = 4000;
export function log(st: GameState, e: Omit<LogEntry, 'tick' | 'date'>) {
  st.log.push({ ...e, tick: st.tick, date: dateStr(st.date) });
  if (st.log.length > LOG_CAP) st.log.splice(0, st.log.length - LOG_CAP);
}
export function newId(st: GameState, prefix: string) { st.nextId += 1; return `${prefix}_${st.nextId}`; }
export function count(st: GameState, key: string, country?: string) {
  st.counters.aiActions[key] = (st.counters.aiActions[key] ?? 0) + 1;
  if (country) st.counters.aiActionsByCountry[country] = (st.counters.aiActionsByCountry[country] ?? 0) + 1;
}
