// IND-01 PM-1: production methods (historical_data/production/production_methods.json).
//
// A factory building's method sets its input mix per unit of output (charcoal -> coke -> Bessemer ->
// open hearth iron; water/hand -> steam -> electric textile mills; ...). Output per worker comes from
// RECIPES x technology efficiency effects, i.e. the productivity of the newer method is already carried
// by the technology that unlocks it. Owners therefore use the NEWEST unlocked method (best practice);
// choosing by input cost alone would keep the whole world on charcoal iron, because charcoal won on
// input cost but lost on scale and labour productivity (historically the reason coke displaced it). A
// player may fix any unlocked method (pmManual), like any other owner decision.
import { data } from '../data/db';
import type { Building, Country, GameState, Good } from '../types';

export interface ProductionMethod { id: string; name_vi: string; requires: string[]; inputs: Partial<Record<Good, number>> }

export function methodsFor(b: Building): ProductionMethod[] {
  return (data().db.production_methods?.[b] ?? []) as ProductionMethod[];
}
export function unlockedMethods(c: Pick<Country, 'techs'>, b: Building): ProductionMethod[] {
  return methodsFor(b).filter((m) => m.requires.every((t) => c.techs.includes(t)));
}
const unitCost = (m: ProductionMethod, prices: Record<string, number> | undefined) =>
  Object.entries(m.inputs).reduce((s, [g, q]) => s + (q ?? 0) * (prices?.[g] ?? 1), 0);

/** The active method of a country's building (falls back to the cheapest unlocked at base prices). */
export function activeMethod(c: Pick<Country, 'techs' | 'pm'>, b: Building): ProductionMethod | null {
  const list = unlockedMethods(c, b);
  if (!list.length) return null;
  const chosen = c.pm?.[b] ? list.find((m) => m.id === c.pm![b]) : undefined;
  return chosen ?? [...list].sort((x, y) => methodYear(y) - methodYear(x) || x.id.localeCompare(y.id))[0];
}

/** Year of a method = latest historical year among the technologies it requires (0 when none). */
export function methodYear(m: ProductionMethod): number {
  return Math.max(0, ...m.requires.map((t) => data().tech.get(t)?.historical_year ?? 0));
}
/** The newest unlocked method (owners' best practice). */
export function newestMethod(c: Pick<Country, 'techs'>, b: Building): ProductionMethod | null {
  const list = unlockedMethods(c, b);
  return list.length ? [...list].sort((x, y) => methodYear(y) - methodYear(x) || x.id.localeCompare(y.id))[0] : null;
}

/** Monthly: owners move to the newest unlocked method unless the player fixed one. */
export function choosePM(c: Country, _prices?: Record<string, number>): void {
  c.pm ??= {};
  for (const b of Object.keys(data().db.production_methods ?? {}) as Building[]) {
    if (c.pmManual?.[b] && unlockedMethods(c, b).some((m) => m.id === c.pm![b])) continue;
    const m = newestMethod(c, b); if (m) c.pm[b] = m.id;
  }
}

/** Input cost per unit of output at given prices (for the UI comparison). */
export function methodUnitCost(m: ProductionMethod, prices: Record<string, number> | undefined): number { return unitCost(m, prices); }

export function productionMethodsMonth(st: GameState, marketOfC: (c: Country) => string): void {
  for (const c of Object.values(st.countries)) if (c.alive) choosePM(c, st.marketPrices[marketOfC(c)] ?? st.worldPrices);
}

/** Player or AI command: fix a method (must be unlocked) or return to automatic choice (method null). */
export function setProductionMethod(c: Country, b: Building, method: string | null): boolean {
  c.pm ??= {}; c.pmManual ??= {};
  if (method === null) { delete c.pmManual[b]; return true; }
  if (!unlockedMethods(c, b).some((m) => m.id === method)) return false;
  c.pm[b] = method; c.pmManual[b] = true; return true;
}
