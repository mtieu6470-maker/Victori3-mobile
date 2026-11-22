// ECON-GROWTH: endogenous productivity growth.
//
// Country productivity is fitted once to 1836 Maddison GDP per capita (computeEconomy calibration).
// Before ECON-GROWTH it never changed afterwards, so GDP per capita of industrialising countries
// grew only through physical output (UK x1.22 by 1913 against MPD2023 x2.09; CG-26). Here
// productivity rises with economic technology the country has adopted since its baseline, weighted
// by its absorptive capacity (literacy), and with literacy itself. Countries that adopt technology
// without schooling or capital gain little: knowledge needs people who can use it.
//
//   ln(productivity / base) = TECH * Σ(new economic techs) * literacy² + LITERACY * (literacy − base literacy)
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

/** Tech effect keys that count as economic (production, infrastructure, commerce, knowledge). */
export const ECONOMIC_TECH_EFFECTS: ReadonlySet<string> = new Set([
  'textile_efficiency', 'factory_efficiency', 'mine_efficiency', 'iron_efficiency', 'unlock_railway', 'market_access',
  'trade_capacity', 'farm_efficiency', 'admin_efficiency', 'research', 'energy_efficiency', 'steel_efficiency',
  'unlock_steel', 'investment', 'literacy_growth', 'idea_spread',
]);

export const GROWTH_PARAMS = {
  /** Log-productivity gain per newly adopted economic technology at full literacy (scaled by literacy²). */
  tech: 0.035,
  /** Log-productivity gain per unit of literacy gained since the baseline. */
  literacy: 0.4,
  /** Share of the gap to the target closed each month (diffusion lag, ~1 year half-life). */
  adjust: 0.06,
} as const;

export function economicTechCount(c: Pick<Country, 'techs'>): number {
  const d = data();
  let n = 0;
  for (const t of c.techs) if (Object.keys(d.tech.get(t)?.effects ?? {}).some((k) => ECONOMIC_TECH_EFFECTS.has(k))) n++;
  return n;
}

const literacyOf = (c: Country) => (Number.isFinite(c.stats?.literacy) ? Math.max(0, Math.min(1, c.stats.literacy)) : 0);

/** Records the growth baseline (after the 1836 calibration, or lazily for new or legacy countries). */
export function setGrowthBase(c: Country): void {
  c.growthBase = { productivity: c.productivity, techs: economicTechCount(c), literacy: literacyOf(c) };
}

export function targetProductivity(c: Country): number {
  const b = c.growthBase!;
  const lit = literacyOf(c);
  const newTechs = Math.max(0, economicTechCount(c) - b.techs);
  return b.productivity * Math.exp(GROWTH_PARAMS.tech * newTechs * lit * lit + GROWTH_PARAMS.literacy * (lit - b.literacy));
}

export function growthMonth(st: GameState): void {
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    if (!c.growthBase) { setGrowthBase(c); continue; }
    const target = targetProductivity(c);
    if (Number.isFinite(target) && target > 0) c.productivity += (target - c.productivity) * GROWTH_PARAMS.adjust;
  }
}
