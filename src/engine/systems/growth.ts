// ECON-GROWTH: endogenous productivity growth.
//
// Country productivity is fitted once to 1836 Maddison GDP per capita (computeEconomy calibration).
// Before ECON-GROWTH it never changed afterwards, so GDP per capita of industrialising countries
// grew only through physical output (UK x1.22 by 1913 against MPD2023 x2.09; CG-26). Here
// productivity rises with economic technology the country has adopted since its baseline, weighted
// by its absorptive capacity (literacy), and with literacy itself. Countries that adopt technology
// without schooling or capital gain little: knowledge needs people who can use it.
//
//   ln(productivity / base) = TFP_SCALE * Σ(tfp of techs adopted since base) * literacy² + LITERACY * (literacy − base literacy)
//
// Absorptive capacity is convex in literacy (literacy²): a mostly illiterate economy that acquires a
// technology gains much less from it than a literate one, which reproduces the 19th-century
// divergence between industrialising and agrarian economies.
//
// The coefficients are PROJECT DESIGN PARAMETERS calibrated against MPD2023 growth ratios
// (tools/growth-report.ts); they are not historical data and not Victoria 3 values. No historical
// curve is imposed: growth follows what each country researches and how literate it becomes.
import { data } from '../data/db';
import type { Country, GameState } from '../types';

/**
 * TECH-01: each technology carries a `tfp` effect (a project design weight, larger for
 * general-purpose technologies such as electrification or microprocessors). A country's knowledge
 * stock is the sum over the technologies it has adopted.
 */
export function tfpStock(c: Pick<Country, 'techs'>): number {
  const d = data();
  let s = 0;
  for (const t of c.techs) { const v = d.tech.get(t)?.effects.tfp; if (typeof v === 'number' && Number.isFinite(v)) s += v; }
  return s;
}

export const GROWTH_PARAMS = {
  /** Multiplier on new knowledge stock (Σ tfp since the baseline) at full literacy (scaled by literacy²). */
  tfpScale: 1.0,
  /** Log-productivity gain per unit of literacy gained since the baseline. */
  literacy: 0.4,
  /**
   * Share of the gap to the target closed each month: adoption lags availability (CG-27 §5.2), a
   * half-life of about three years.
   */
  adjust: 0.02,
} as const;

const literacyOf = (c: Country) => (Number.isFinite(c.stats?.literacy) ? Math.max(0, Math.min(1, c.stats.literacy)) : 0);

/** Records the growth baseline (after the 1836 calibration, or lazily for new or legacy countries). */
export function setGrowthBase(c: Country): void {
  c.growthBase = { productivity: c.productivity, tfp: tfpStock(c), literacy: literacyOf(c) };
}

export function targetProductivity(c: Country): number {
  const b = c.growthBase!;
  const lit = literacyOf(c);
  const knowledge = Math.max(0, tfpStock(c) - (b.tfp ?? 0));
  return b.productivity * Math.exp(GROWTH_PARAMS.tfpScale * knowledge * lit * lit + GROWTH_PARAMS.literacy * (lit - b.literacy));
}

/**
 * DIV-01: a region whose productivity differs from its owner's (after conquest or cession) converges
 * toward it at a rate rising with its literacy (absorptive capacity): monthly share of the log gap closed
 * = base + literacy x literacy x lit; half-lives ~90 years at literacy 0.1, ~45 at 0.5, ~20 at 0.9.
 * Design parameters; colonial productivity gaps persisted for generations (MPD2023 regional series).
 */
export const REGION_CONVERGENCE = { base: 0.0006, lit: 0.003, colonial: 0.2, colonialTransmission: 0.3 } as const;

let homeCache: Map<string, Set<string>> | null = null;
/**
 * DIV-01: a region is COLONIAL for its owner when it lies outside the owner's 1836 home: the metropolitan
 * population group (pop_group ending in _home/_core: Britain, France, Spain, Portugal, the Netherlands,
 * Belgium, Denmark) when the data defines one, else every region the country owned at the start; regions
 * acquired later count as home only when they share the culture family of the owner's capital (German or
 * Italian unification). Multi-ethnic home countries (Brazil, Qing, the Indian territories) are not
 * colonies of themselves.
 */
export function isColonialRegion(st: GameState, r: GameState['regions'][number]): boolean {
  const d = data();
  if (!homeCache) {
    homeCache = new Map();
    const groups = new Map<string, Set<string>>();
    for (const x of d.db.regions) if (x.owner && x.pop_group && /_(home|core)$/.test(x.pop_group)) (groups.get(x.owner) ?? groups.set(x.owner, new Set()).get(x.owner)!).add(x.pop_group);
    for (const x of d.db.regions) {
      if (!x.owner) continue;
      const g = groups.get(x.owner);
      const home = g ? !!x.pop_group && g.has(x.pop_group) : true;
      if (home) (homeCache.get(x.owner) ?? homeCache.set(x.owner, new Set()).get(x.owner)!).add(x.id);
    }
  }
  if (homeCache.get(r.owner)?.has(r.id)) return false;
  const c = st.countries[r.owner];
  const cap = c ? st.regions[d.regionIndex.get(c.capital) ?? -1] : undefined;
  return !cap || familyOf(cap.culture) !== familyOf(r.culture);
}

/** Culture family of a culture id (falls back to the id). */
function familyOf(culture: string | null | undefined): string {
  if (!culture) return '';
  return data().db.cultures.find((x) => x.id === culture)?.family ?? culture;
}

export function growthMonth(st: GameState): void {
  for (const r of st.regions) {
    const rel = r.prodRel; if (rel === undefined || rel === 1) continue;
    const lit = Number.isFinite(r.literacy) ? Math.max(0, Math.min(1, r.literacy)) : 0;
    // Colonial regions (culture family unlike the owner's capital) converge far more slowly: colonial
    // productivity gaps persisted until and beyond independence (MPD2023 regional series).
    const colonial = isColonialRegion(st, r);
    const k = (REGION_CONVERGENCE.base + REGION_CONVERGENCE.lit * lit * lit) * (colonial ? REGION_CONVERGENCE.colonial : 1);
    const next = Math.exp(Math.log(rel) * (1 - k));
    r.prodRel = Math.abs(next - 1) < 1e-4 ? 1 : next;
  }
  // Colonial regions receive only part of their owner's national productivity growth (owners' growth
  // in this step is offset in prodRel by (p0/p1)^(1 - colonialTransmission)): metropolitan growth did not
  // carry colonies with it. Design value 0.3.
  const before = new Map<string, number>();
  for (const c of Object.values(st.countries)) if (c.alive) before.set(c.id, c.productivity);
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    // Older baselines (a tech count, before TECH-01) are replaced without a productivity jump.
    if (!c.growthBase || typeof c.growthBase.tfp !== 'number') { setGrowthBase(c); continue; }
    const target = targetProductivity(c);
    if (Number.isFinite(target) && target > 0) c.productivity += (target - c.productivity) * GROWTH_PARAMS.adjust;
  }
  for (const r of st.regions) {
    const c = st.countries[r.owner]; const p0 = before.get(r.owner);
    if (!c || !p0 || !(c.productivity > 0) || c.productivity === p0) continue;
    if (!isColonialRegion(st, r)) continue;
    const rel = (r.prodRel ?? 1) * Math.pow(p0 / c.productivity, 1 - REGION_CONVERGENCE.colonialTransmission);
    r.prodRel = Math.min(20, Math.max(0.02, rel));
  }
}
