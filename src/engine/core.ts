// Core utilities: seeded RNG (xoshiro128**), calendar, relation keys, logging helpers.
import type { GameDate, GameState, LogEntry } from './types';

export function seedRng(seed: number): [number, number, number, number] {
  let s = seed >>> 0 || 1;
  const next = () => { s = (s + 0x9e3779b9) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b); z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35); return (z ^ (z >>> 16)) >>> 0; };
  return [next(), next(), next(), next()];
}

/** Uniform [0,1) from the state's RNG (mutates state.rng). */
export function rand(st: GameState): number {
  const s = st.rng;
  const result = Math.imul(rotl(Math.imul(s[1], 5), 7), 9) >>> 0;
  const t = s[1] << 9;
  s[2] ^= s[0]; s[3] ^= s[1]; s[1] ^= s[2]; s[0] ^= s[3]; s[2] ^= t; s[3] = rotl(s[3], 11);
  s[0] >>>= 0; s[1] >>>= 0; s[2] >>>= 0; s[3] >>>= 0;
  return result / 4294967296;
}
function rotl(x: number, k: number) { return ((x << k) | (x >>> (32 - k))) >>> 0; }
export const chance = (st: GameState, p: number) => rand(st) < p;
export function pick<T>(st: GameState, arr: T[]): T { return arr[Math.floor(rand(st) * arr.length)]; }
export function gauss(st: GameState): number { const u = Math.max(1e-9, rand(st)); const v = rand(st); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

export const clamp = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const CAMPAIGN_START_YEAR = 1836;
export const CAMPAIGN_END_YEAR = 2026;
export const CAMPAIGN_END_MONTH = 12;
/** Tick 0 is January 1836; the final playable state is December 2026. */
export const CAMPAIGN_END_TICK = (CAMPAIGN_END_YEAR - CAMPAIGN_START_YEAR) * 12 + (CAMPAIGN_END_MONTH - 1);

export function isCampaignComplete(tick: number): boolean {
  return Number.isSafeInteger(tick) && tick >= CAMPAIGN_END_TICK;
}

/** Number of monthly simulation steps remaining before the inclusive campaign end. */
export function campaignMonthsRemaining(tick: number): number {
  if (!Number.isSafeInteger(tick) || tick < 0) return 0;
  return Math.max(0, CAMPAIGN_END_TICK - tick);
}

export function dateStr(d: GameDate): string { return `${d.y}-${String(d.m).padStart(2, '0')}-01`; }
export function parseDate(s: string): GameDate { const [y, m] = s.split('-').map(Number); return { y, m: m || 1 }; }
export function dateToTick(s: string, start = CAMPAIGN_START_YEAR): number { const d = parseDate(s); return (d.y - start) * 12 + (d.m - 1); }
export function tickToDate(t: number, start = CAMPAIGN_START_YEAR): GameDate { return { y: start + Math.floor(t / 12), m: (t % 12) + 1 }; }
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
