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

export function growthMonth(st: GameState): void {
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    // Older baselines (a tech count, before TECH-01) are replaced without a productivity jump.
    if (!c.growthBase || typeof c.growthBase.tfp !== 'number') { setGrowthBase(c); continue; }
    const target = targetProductivity(c);
    if (Number.isFinite(target) && target > 0) c.productivity += (target - c.productivity) * GROWTH_PARAMS.adjust;
  }
}
