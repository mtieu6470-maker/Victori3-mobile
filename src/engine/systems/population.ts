// Population Engine (shared): births/deaths, famine and epidemics, strata change following jobs and laws,
// literacy, migration (internal and international) and nationalism.
import { data } from '../data/db';
import { S, STRATA, type Country, type GameState, type Region } from '../types';
import { clamp } from '../core';
import { techEffect, LEVEL_WORKERS } from './economy';
import { regionsOf } from '../cache';

/**
 * Distributes natural increase across population strata using their current cohort SoL.
 * Better SoL lowers both fertility and mortality; mortality responds more strongly, so
 * higher-SoL cohorts have a modestly higher net growth rate. Weighted mean multipliers
 * are exactly 1, preserving the region's already-calibrated aggregate birth/death rates.
 *
 * The coefficients are intentionally conservative because this project has no age-structured
 * population data. This is a cohort-level approximation, not an individual-pop simulation.
 */
export interface StratifiedNaturalChange {
  population: number;
  strata: number[];
  births: number;
  deaths: number;
}

export function stratifiedNaturalChange(
  population: number,
  strata: number[],
  cohortSol: number[] | undefined,
  annualBirthRate: number,
  annualDeathRate: number,
): StratifiedNaturalChange {
  const pop = Number.isFinite(population) ? Math.max(0, population) : 0;
  const rawShares = STRATA.map((_, i) => {
    const value = Number(strata[i] ?? 0);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  });
  const shareTotal = rawShares.reduce((sum, value) => sum + value, 0);
  if (pop <= 0 || shareTotal <= 0) {
    return { population: pop, strata: rawShares, births: 0, deaths: 0 };
  }
  const shares = rawShares.map((value) => value / shareTotal);
  const sol = STRATA.map((_, i) => {
    const value = Number(cohortSol?.[i]);
    return Number.isFinite(value) ? clamp(value, 0, 1) : 0.5;
  });
  const meanSol = sol.reduce((sum, value, i) => sum + shares[i] * value, 0);
  const birthRate = Number.isFinite(annualBirthRate) ? Math.max(0, annualBirthRate) : 0;
  const deathRate = Number.isFinite(annualDeathRate) ? Math.max(0, annualDeathRate) : 0;
  const birthWeight = sol.map((value) => clamp(1 - 0.04 * (value - meanSol), 0.9, 1.1));
  const deathWeight = sol.map((value) => clamp(1 - 0.08 * (value - meanSol), 0.8, 1.2));
  const birthNorm = birthWeight.reduce((sum, value, i) => sum + shares[i] * value, 0);
  const deathNorm = deathWeight.reduce((sum, value, i) => sum + shares[i] * value, 0);

  let births = 0;
  let deaths = 0;
  const nextCounts = shares.map((share, i) => {
    const cohort = pop * share;
    const b = cohort * birthRate * (birthWeight[i] / birthNorm) / 12;
    const d = cohort * deathRate * (deathWeight[i] / deathNorm) / 12;
    births += b;
    deaths += d;
    return Math.max(0, cohort + b - d);
  });
  const nextPopulation = nextCounts.reduce((sum, value) => sum + value, 0);
  const nextStrata = nextPopulation > 0
    ? nextCounts.map((value) => value / nextPopulation)
    : shares;
  return { population: nextPopulation, strata: nextStrata, births, deaths };
}

/** Combines resident and incoming population without discarding the migrants' class mix. */
export function mixPopulationStrata(
  residentPopulation: number,
  residentStrata: number[],
  incomingPopulation: number,
  incomingStrata: number[],
): number[] {
  const resident = Number.isFinite(residentPopulation) ? Math.max(0, residentPopulation) : 0;
  const incoming = Number.isFinite(incomingPopulation) ? Math.max(0, incomingPopulation) : 0;
  const total = resident + incoming;
  const normalize = (values: number[]) => {
    const safe = STRATA.map((_, i) => {
      const value = Number(values[i] ?? 0);
      return Number.isFinite(value) ? Math.max(0, value) : 0;
    });
    const sum = safe.reduce((acc, value) => acc + value, 0);
    return sum > 0 ? safe.map((value) => value / sum) : new Array(STRATA.length).fill(0);
  };
  const current = normalize(residentStrata);
  const arrivals = normalize(incomingStrata);
  if (total <= 0) return current;
  if (incoming <= 0) return current;
  if (resident <= 0) return arrivals;
  return STRATA.map((_, i) => (
    resident * current[i] + incoming * arrivals[i]
  ) / total);
}

export function populationMonth(st: GameState) {
  const d = data();
  const emig: { from: Region; n: number; strata: number[] }[] = [];
  for (const r of st.regions) {
    const c = st.countries[r.owner]; if (!c || r.pop <= 0) continue;
    const famine = (r as Region & { famine?: number }).famine ?? 0;
    const urban = r.strata[S.workers] + r.strata[S.middle] + r.strata[S.capitalists] * 0.5;
    const density = r.pop / Math.max(50, r.area);
    const frontier = clamp(1 - density / 30, 0, 1);
    const birth = 0.037 - 0.008 * r.literacy - 0.006 * urban + 0.012 * frontier + ((c as any).fertilityAdj ?? 0);
    const epi = r.epidemic && r.epidemic.until > st.tick ? r.epidemic.rate * 12 : 0;
    let death = 0.033 - 0.02 * (r.sol - 0.5) + techEffect(c, 'mortality') * 0.1 - c.budget.health * 0.02 + famine * 0.16 + epi + r.devastation * 0.02;
    if (r.terrain === 'ju' || r.terrain === 'ma') death += 0.002;
    death = Math.max(0.011, death);
    const natural = stratifiedNaturalChange(r.pop, r.strata, r.popEconomy?.sol, birth, death);
    r.pop = Math.max(100, natural.population);
    r.strata = natural.strata;
    // emigration from distress (coastal regions can reach overseas destinations)
    if ((r.sol < 0.42 || famine > 0.1) && r.coastal && c.laws.labor !== 'serfdom' && c.laws.trade !== 'isolationism') {
      const n = r.pop * ((Math.max(0, 0.42 - r.sol) * 0.004 + famine * 0.012) / 12);
      if (n > 50) { r.pop -= n; emig.push({ from: r, n, strata: [...r.strata] }); }
    }
    // literacy
    const edu = c.laws.education === 'public_schools' ? 0.012 : c.laws.education === 'religious_schools' ? 0.004 : 0.0005;
    const target = clamp(0.03 + c.budget.education * 3 + (c.laws.education === 'public_schools' ? 0.45 : c.laws.education === 'religious_schools' ? 0.15 : 0), 0, 0.98);
    r.literacy = clamp(r.literacy + ((target - r.literacy) * (edu + 0.01 * techEffect(c, 'literacy_growth')) * (1 + c.budget.education * 4)) / 12, 0, 0.99);
    shiftStrata(st, c, r);
    r.devastation = Math.max(0, r.devastation - 0.01);
    // nationalism: non-core nations under foreign rule, raised by literacy and the press
    const core = coreNationOf(st, c);
    const foreign = d.cultureNation.get(r.culture) !== core;
    const press = c.laws.press === 'free_press' ? 1 : c.laws.press === 'limited_press' ? 0.7 : 0.4;
    const nTarget = foreign ? clamp(0.1 + r.literacy * 0.6 * press + (1 - r.sol) * 0.2, 0, 1) : 0.02;
    r.nationalism = clamp(r.nationalism + (nTarget - r.nationalism) * 0.01, 0, 1);
  }
  // international migration: to open, attractive, low-density destinations
  if (emig.length) {
    const dests: { c: Country; w: number; regions: Region[] }[] = [];
    for (const c of Object.values(st.countries)) {
      if (!c.alive || c.decentralized || c.laws.trade === 'isolationism') continue;
      const regs = regionsOf(st, c.id).filter((r) => r.controller === c.id);
      if (!regs.length) continue;
      const sol = regs.reduce((s, r) => s + r.sol * r.pop, 0) / Math.max(1, regs.reduce((s, r) => s + r.pop, 0));
      const space = regs.reduce((s, r) => s + Math.max(0, 1 - r.pop / Math.max(50, r.area) / 25) * r.area, 0);
      const w = Math.max(0, sol - 0.55) * Math.sqrt(space);
      if (w > 0) dests.push({ c, w, regions: regs.filter((r) => r.pop / Math.max(50, r.area) < 25) });
    }
    dests.sort((a, b) => b.w - a.w);
    const top = dests.slice(0, 4).filter((x) => x.regions.length);
    const tw = top.reduce((s, x) => s + x.w, 0);
    if (tw > 0) for (const e of emig) for (const t of top) {
      const share = (e.n * t.w) / tw; const rs = t.regions;
      const tgt = rs[(st.tick + rs.length) % rs.length];
      const residentPop = tgt.pop;
      tgt.strata = mixPopulationStrata(residentPop, tgt.strata, share, e.strata);
      tgt.pop = residentPop + share;
      if (tgt.culture !== e.from.culture && tgt.c2 < 0.5) { tgt.culture2 = tgt.culture2 ?? e.from.culture; tgt.c2 = clamp(tgt.c2 + share / tgt.pop * 0.5, 0, 0.5); }
    }
  }
}

export function coreNationOf(st: GameState, c: Country): string | undefined {
  const idx = data().regionIndex.get(c.capital);
  const cap = idx === undefined ? undefined : st.regions[idx];
  return cap ? data().cultureNation.get(cap.culture) : undefined;
}

function shiftStrata(st: GameState, c: Country, r: Region) {
  const s = r.strata; const LF = r.pop * 0.45;
  const factoryCap = (r.buildings.textile_mill + r.buildings.ironworks + r.buildings.tool_works + r.buildings.arms_works + r.buildings.luxury_workshop) * LEVEL_WORKERS;
  const extractCap = (r.buildings.mine + r.buildings.logging + r.buildings.plantation) * LEVEL_WORKERS;
  const wTarget = clamp(factoryCap / Math.max(1, LF), 0, 0.6);
  const lTarget = clamp(extractCap / Math.max(1, LF) * 0.7 + 0.04, 0.02, 0.5);
  const gdpPc = (r.output * 12) / Math.max(1, r.pop);
  const mTarget = clamp(0.02 + 0.22 * r.literacy * Math.sqrt(Math.max(0.1, gdpPc / 2000)), 0.01, 0.3);
  const rate = 0.03 / 12;
  const move = (from: number, to: number, amt: number) => { const a = Math.min(s[from], Math.max(0, amt)); s[from] -= a; s[to] += a; };
  // slaves only change through law
  if (c.laws.labor !== 'slavery' && s[S.slaves] > 0) { const a = s[S.slaves] * 0.05; s[S.slaves] -= a; s[S.peasants] += a * 0.6; s[S.laborers] += a * 0.4; }
  if (s[S.workers] < wTarget) move(S.peasants, S.workers, (wTarget - s[S.workers]) * rate * (c.laws.labor === 'serfdom' ? 0.3 : 1));
  else move(S.workers, S.laborers, (s[S.workers] - wTarget) * rate * 2);
  if (s[S.laborers] < lTarget) move(S.peasants, S.laborers, (lTarget - s[S.laborers]) * rate * (c.laws.labor === 'serfdom' ? 0.4 : 1));
  if (s[S.middle] < mTarget) move(S.peasants, S.middle, (mTarget - s[S.middle]) * rate * 0.5);
  // artisans lose ground where factories make cheap textiles
  const p = st.marketPrices[c.customsUnion ?? c.id] ?? st.worldPrices;
  if (p.textiles < 0.85) move(S.artisans, S.laborers, s[S.artisans] * (0.85 - p.textiles) * rate);
  const capTarget = clamp(0.004 + factoryCap / Math.max(1, LF) * 0.04, 0.003, 0.04);
  if (s[S.capitalists] < capTarget) move(S.peasants, S.capitalists, (capTarget - s[S.capitalists]) * rate);
  const sum = s.reduce((a, b) => a + b, 0); for (let i = 0; i < s.length; i++) s[i] /= sum;
}
