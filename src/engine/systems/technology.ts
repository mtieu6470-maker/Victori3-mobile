// Technology (shared): research points from literacy, middle classes and universities; diffusion from the
// share of countries that already know a technology; the same era-cost rule in both modes.
import { data } from '../data/db';
import type { Country, GameState } from '../types';
import { S } from '../types';
import { log } from '../core';
import { regionsOf } from '../cache';
const OPEN: Record<string, number> = { isolationism: 0.03, protectionism: 0.3, free_trade: 0.7 };

export function availableTechs(c: Country): string[] {
  const d = data();
  return d.db.technologies.filter((t) => !c.techs.includes(t.id) && t.prereqs.every((p) => c.techs.includes(p))).map((t) => t.id);
}

export function techCost(st: GameState, c: Country, id: string): number {
  const t = data().tech.get(id)!;
  const year = st.date.y;
  // TECH-01: researching ahead of a technology's time gets steeply harder (quadratic): a pioneer can
  // lead history by a few years, but not by decades (was linear, so frontier countries exhausted the
  // whole 1836-2026 tree by ~1985).
  const era = Math.pow(1 + Math.max(0, t.historical_year - year) / 12, 2);
  if (!CATCHUP_FLAGS.enabled) {
    // Ablation baseline (MSG-054 R5): the pre-CATCHUP rule, equal-weighted share × 0.55, no conditions.
    return t.cost * era * (1 - 0.55 * Math.sqrt(equalWeightKnownShare(st, id))) * 1000;
  }
  const known = knownShare(st, id);
  return t.cost * era * (1 - imitationDiscount(c, known, year - t.historical_year)) * 1000;
}

/**
 * CATCHUP-01 (revised after ChatGPT review CG_REVIEW_CATCHUP01, owner 2026-11-22: no latecomer buff).
 * Followers may adopt more cheaply only what other countries already use, only to the extent they can
 * absorb it, and never by more than IMITATION_DISCOUNT_MAX:
 *   discount = MAX × sqrt(knownShare) × absorptiveCapacity × codified(age)
 * - knownShare = 0 → no discount, whatever the technology's age (no time-based global decay);
 * - codified(age) = min(1, years since commercial diffusion / 20): know-how becomes transferable as
 *   the technology matures, but age alone never lowers cost;
 * - absorptiveCapacity = the country's own trade openness × literacy (conditions it builds itself).
 * Nothing here touches GDP, output, TFP, population or research points.
 */
/**
 * Ablation switch for attribution runs (tools/growth-report.ts --no-catchup). On by default; off restores
 * the pre-CATCHUP technology cost rule and removes law emulation, nothing else.
 */
export const CATCHUP_FLAGS = { enabled: true };

export const IMITATION_DISCOUNT_MAX = 0.4;
export const TECH_CODIFICATION_YEARS = 20;
export function imitationDiscount(c: Country, knownShare: number, yearsSinceDiffusion: number): number {
  if (!(knownShare > 0)) return 0;
  const codified = Math.min(1, Math.max(0, yearsSinceDiffusion) / TECH_CODIFICATION_YEARS);
  return IMITATION_DISCOUNT_MAX * Math.sqrt(Math.min(1, knownShare)) * absorptiveCapacity(c) * codified;
}

/**
 * CATCHUP-01: ability to adopt foreign technology (0.1..1): exposure through trade times a literate
 * workforce able to use it. Both are conditions a country builds itself (trade law, schooling).
 */
export function absorptiveCapacity(c: Country): number {
  const exposure = Math.min(1, (OPEN[c.laws.trade] ?? 0.3) / 0.7);
  const skills = Math.min(1, Math.max(0, c.stats?.literacy ?? 0) / 0.5);
  return Math.max(0.1, exposure * skills);
}

export function researchPoints(st: GameState, c: Country): number {
  const regs = regionsOf(st, c.id);
  let p = 0;
  for (const r of regs) p += (r.pop / 1e6) * (r.literacy * r.literacy * 3 + r.strata[S.middle] * 10 * r.literacy) * (1 + 0.2 * r.buildings.university);
  const inst = c.laws.education === 'public_schools' ? 1.5 : c.laws.education === 'religious_schools' ? 0.8 : 0.3;
  const exposure = 0.3 + 0.7 * Math.min(1, (OPEN[c.laws.trade] ?? 0.3) / 0.7);
  p *= inst * exposure * (1 + c.budget.education * 5 + 0.3 * (c.laws.press === 'free_press' ? 1 : 0));
  return p * 40; // per month
}

/**
 * TECH-02: technology IMPORT. Most 19th-century adopters did not invent railways, telegraphs or steam
 * engines; they bought them, with foreign engineers, machines and capital (Russia's Moscow-St Petersburg
 * line of 1851 was built with American engineers; Austrian, Spanish and Ottoman lines with foreign
 * concessionaires). Research points from literate population alone left Russia, Spain and the Ottoman
 * Empire without railways until after 1910 (historically 1837/1851, 1848 and 1856/1866).
 *
 * Import points per month = TECH_IMPORT.rate x GDP per capita (engine units ≈ Maddison 2011 int-$)
 *   x knownShare(tech) x codified(age/20) x access, access = trade openness / free-trade openness; isolationism = 0.
 * Only technologies other countries already use can be imported (knownShare > 0), so imports never let
 * a country lead; every country gets the same rule (owner: catch-up without latecomer buffs). The rate
 * is a project design parameter calibrated on first-railway years (tools/tech-adoption-report.ts).
 */
export const TECH_IMPORT = { enabled: true, rate: 160 };

export function importPoints(st: GameState, c: Country, techId: string): number {
  if (!TECH_IMPORT.enabled) return 0;
  const share = knownShare(st, techId);
  if (share <= 0) return 0;
  // Imports need trade: isolationism (Qing's Canton system, sakoku Japan) closes the channel entirely;
  // without this a very large closed economy (Qing) bought railways in the 1830s on GDP alone.
  if (c.laws.trade === 'isolationism') return 0;
  const access = Math.min(1, (OPEN[c.laws.trade] ?? 0.3) / 0.7);
  // Per head, not total: adopting a technology economy-wide costs a large country proportionally more, so
  // size alone must not speed adoption (Qing's total GDP let it buy Western industry in the 1840s).
  const pc = Math.max(0, c.gdp) / Math.max(1, c.stats?.pop ?? 0);
  // A technology is sold abroad only once it has matured (same codification rule as CATCHUP-01):
  // nobody imported reapers or Bessemer plant the year they were invented.
  const age = st.date.y - (data().tech.get(techId)?.historical_year ?? st.date.y);
  const codified = Math.min(1, Math.max(0, age) / TECH_CODIFICATION_YEARS);
  return Number.isFinite(pc) ? TECH_IMPORT.rate * pc * share * access * codified * (1 + (c.blocMods?.research ?? 0)) : 0;
}

/**
 * TECH-02 Historical Mode: a country cannot adopt a technology before a documented political or
 * institutional block ended (historical_data/technologies/adoption_windows.json; e.g. the Qing court
 * resisted railways until the late 1870s). Sandbox Mode ignores the windows.
 */
export function techReservedByHistory(st: GameState, c: Country, techId: string): boolean {
  if (st.mode !== 'historical') return false;
  const w = data().db.tech_adoption_windows?.find((x) => x.country === c.id && x.tech === techId);
  return !!w && st.date.y < w.earliest;
}

export function technologyMonth(st: GameState, chooser: (c: Country, options: string[]) => string | null) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized) continue;
    if (!c.research.current || c.techs.includes(c.research.current)) {
      const opts = availableTechs(c).filter((t) => !techReservedByHistory(st, c, t));
      c.research.current = opts.length ? chooser(c, opts) : null;
      c.research.progress = 0;
    }
    const cur = c.research.current; if (!cur) continue;
    c.research.progress += researchPoints(st, c) + importPoints(st, c, cur);
    if (c.research.progress >= techCost(st, c, cur)) {
      c.techs.push(cur);
      if (cur === 'mass_politics' || cur === 'feminism') (c.ideasSince ??= {})[cur] = st.tick; // LAW-CAL-02
      c.research = { current: null, progress: 0 };
      const t = data().tech.get(cur)!;
      if (!c.decentralized && (c.tier === 'A' || st.player === c.id)) log(st, { type: 'tech', text: `${c.name} adopts ${cur}.`, textVi: `${c.nameVi} áp dụng ${cur}.`, actors: [c.id] });
      if (t.effects.unlock_railway) { /* railways become buildable */ }
    }
  }
}

let shareCache: { tick: number; st: GameState; map: Map<string, number> } | null = null;
let equalCache: { tick: number; st: GameState; map: Map<string, number> } | null = null;
/** The pre-CATCHUP equal-weight share (ablation baseline only). */
function equalWeightKnownShare(st: GameState, id: string): number {
  if (!equalCache || equalCache.tick !== st.tick || equalCache.st !== st) {
    const alive = Object.values(st.countries).filter((x) => x.alive && !x.decentralized);
    const map = new Map<string, number>();
    for (const c of alive) for (const t of c.techs) map.set(t, (map.get(t) ?? 0) + 1);
    for (const [k, v] of map) map.set(k, v / Math.max(1, alive.length));
    equalCache = { tick: st.tick, st, map };
  }
  return equalCache.map.get(id) ?? 0;
}

/**
 * Share of the world economy (GDP-weighted, CATCHUP-01 review round 2) that already uses a technology.
 * Equal country weights let a dozen micro-states count like the great powers; knowledge available to
 * imitate scales with the economic weight of its users. Cached per month.
 */
export function knownShare(st: GameState, id: string): number {
  if (!shareCache || shareCache.tick !== st.tick || shareCache.st !== st) {
    const alive = Object.values(st.countries).filter((x) => x.alive && !x.decentralized);
    const weight = (x: Country) => Math.max(0, Number.isFinite(x.gdp) ? x.gdp : 0);
    const total = alive.reduce((s, x) => s + weight(x), 0);
    const map = new Map<string, number>();
    for (const c of alive) for (const t of c.techs) map.set(t, (map.get(t) ?? 0) + weight(c));
    for (const [k, v] of map) map.set(k, total > 0 ? v / total : 0);
    shareCache = { tick: st.tick, st, map };
  }
  return shareCache.map.get(id) ?? 0;
}
