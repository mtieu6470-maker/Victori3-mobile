// Technology (shared): research points from literacy, middle classes and universities; diffusion from the
// share of countries that already know a technology; the same era-cost rule in both modes.
import { data } from '../data/db';
import type { Country, GameState } from '../types';
import { S } from '../types';
import { log } from '../core';
import { regionsOf } from '../cache';
/** CATCHUP-01 design parameters (calibrated on the MPD2023 scorecard). */
export const TECH_DIFFUSION_DISCOUNT = 0.85;
export const TECH_MATURITY_YEARS = 15;
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
  const known = knownShare(st, id);
  // CATCHUP-01: followers imitate rather than invent. Adoption gets cheaper the more countries already
  // use a technology (was 0.55) and the longer it has existed (maturity), so laggards can converge
  // instead of facing pioneer costs a century later (Brazil had 6 technologies in 2000).
  const diffusion = 1 - TECH_DIFFUSION_DISCOUNT * Math.sqrt(known);
  const maturity = 1 / (1 + Math.max(0, year - t.historical_year) / TECH_MATURITY_YEARS);
  return t.cost * era * diffusion * maturity * 1000;
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

export function technologyMonth(st: GameState, chooser: (c: Country, options: string[]) => string | null) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized) continue;
    if (!c.research.current || c.techs.includes(c.research.current)) {
      const opts = availableTechs(c);
      c.research.current = opts.length ? chooser(c, opts) : null;
      c.research.progress = 0;
    }
    const cur = c.research.current; if (!cur) continue;
    c.research.progress += researchPoints(st, c);
    if (c.research.progress >= techCost(st, c, cur)) {
      c.techs.push(cur);
      c.research = { current: null, progress: 0 };
      const t = data().tech.get(cur)!;
      if (!c.decentralized && (c.tier === 'A' || st.player === c.id)) log(st, { type: 'tech', text: `${c.name} adopts ${cur}.`, textVi: `${c.nameVi} áp dụng ${cur}.`, actors: [c.id] });
      if (t.effects.unlock_railway) { /* railways become buildable */ }
    }
  }
}

let shareCache: { tick: number; st: GameState; map: Map<string, number> } | null = null;
function knownShare(st: GameState, id: string): number {
  if (!shareCache || shareCache.tick !== st.tick || shareCache.st !== st) {
    const alive = Object.values(st.countries).filter((x) => x.alive && !x.decentralized);
    const map = new Map<string, number>();
    for (const c of alive) for (const t of c.techs) map.set(t, (map.get(t) ?? 0) + 1);
    for (const [k, v] of map) map.set(k, v / Math.max(1, alive.length));
    shareCache = { tick: st.tick, st, map };
  }
  return shareCache.map.get(id) ?? 0;
}
