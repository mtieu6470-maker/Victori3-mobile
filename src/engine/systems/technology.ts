// Technology (shared): research points from literacy, middle classes and universities; diffusion from the
// share of countries that already know a technology; the same era-cost rule in both modes.
import { data } from '../data/db';
import type { Country, GameState } from '../types';
import { S } from '../types';
import { log } from '../core';

export function availableTechs(c: Country): string[] {
  const d = data();
  return d.db.technologies.filter((t) => !c.techs.includes(t.id) && t.prereqs.every((p) => c.techs.includes(p))).map((t) => t.id);
}

export function techCost(st: GameState, c: Country, id: string): number {
  const t = data().tech.get(id)!;
  const year = st.date.y;
  const era = 1 + Math.max(0, t.historical_year - year) / 12;
  const alive = Object.values(st.countries).filter((x) => x.alive && !x.decentralized);
  const known = alive.filter((x) => x.techs.includes(id)).length / Math.max(1, alive.length);
  const diffusion = 1 - 0.55 * Math.sqrt(known);
  return t.cost * era * diffusion * 1000;
}

export function researchPoints(st: GameState, c: Country): number {
  const regs = st.regions.filter((r) => r.owner === c.id);
  let p = 0;
  for (const r of regs) p += (r.pop / 1e6) * (r.literacy * 2 + r.strata[S.middle] * 20) * (1 + 0.2 * r.buildings.university);
  p *= 1 + c.budget.education * 5 + 0.3 * (c.laws.press === 'free_press' ? 1 : 0);
  return p * 28; // per month
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
