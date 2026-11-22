// ECON-GROWTH: endogenous productivity growth (techs × literacy², literacy) and parallel,
// money-bounded construction. Coefficients are design parameters calibrated against MPD2023
// growth ratios (CG-26) with tools/growth-report.ts; these tests guard the mechanism.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { economicTechCount, GROWTH_PARAMS, growthMonth, setGrowthBase, targetProductivity } from '../src/engine/systems/growth';
import { constructionMonth, constructionQueueCap, enqueueConstruction } from '../src/engine/systems/economy';
import { validateGameStateContract } from '../src/engine/save';
import { data } from '../src/engine/data/db';

loadNodeData();
const fresh = () => createGame({ mode: 'historical', seed: 4, player: null });

describe('ECON-GROWTH productivity', () => {
  it('records a baseline after the 1836 calibration, with computed literacy', () => {
    const st = fresh();
    for (const c of Object.values(st.countries)) {
      expect(c.growthBase).toBeDefined();
      expect(c.growthBase!.productivity).toBe(c.productivity);
      expect(c.growthBase!.techs).toBe(economicTechCount(c));
    }
    expect(st.countries.GBR.growthBase!.literacy).toBeGreaterThan(0.3);
    expect(targetProductivity(st.countries.GBR)).toBeCloseTo(st.countries.GBR.productivity, 9);
  });

  it('target rises with new economic technology, more for literate economies, and with literacy', () => {
    const st = fresh(); const c = st.countries.GBR;
    const econTech = data().db.technologies.find((t) => !c.techs.includes(t.id) && Object.keys(t.effects).some((k) => k.endsWith('_efficiency') && !k.startsWith('army') && !k.startsWith('navy')))!;
    const before = targetProductivity(c);
    c.techs.push(econTech.id);
    const withTech = targetProductivity(c);
    expect(withTech).toBeGreaterThan(before);
    c.stats.literacy = 0.1;
    const illiterate = targetProductivity(c);
    expect(illiterate).toBeLessThan(withTech);
    c.stats.literacy = 0.95;
    expect(targetProductivity(c)).toBeGreaterThan(withTech);
    expect(GROWTH_PARAMS.adjust).toBeGreaterThan(0);
  });

  it('moves productivity gradually toward the target, deterministically', () => {
    const a = fresh(); const b = fresh();
    for (const st of [a, b]) { st.countries.FRA.stats.literacy = 0.9; growthMonth(st); }
    const ca = a.countries.FRA;
    expect(ca.productivity).toBeGreaterThan(ca.growthBase!.productivity);
    expect(ca.productivity).toBeLessThan(targetProductivity(ca));
    expect(ca.productivity).toBe(b.countries.FRA.productivity);
  });

  it('a country without a baseline (new nation or older save) gets one without a jump', () => {
    const st = fresh(); const c = st.countries.USA;
    delete c.growthBase; const p = c.productivity;
    growthMonth(st);
    expect(c.productivity).toBe(p);
    expect(c.growthBase).toBeDefined();
    setGrowthBase(c);
    expect(() => validateGameStateContract(st)).not.toThrow();
  });

  it('industrialising Britain outgrows Qing China over the first decade (home territory)', () => {
    const st = fresh();
    const home = (id: string) => new Set(st.regions.filter((r) => r.owner === id).map((r) => r.id));
    const h = { GBR: home('GBR'), QNG: home('QNG') };
    const pc = (id: 'GBR' | 'QNG') => { const rs = st.regions.filter((r) => h[id].has(r.id) && r.owner === id); return rs.reduce((s, r) => s + r.output, 0) / rs.reduce((s, r) => s + r.pop, 0); };
    for (let i = 0; i < 12; i++) stepMonth(st);
    const g0 = pc('GBR'), q0 = pc('QNG');
    for (let i = 0; i < 120; i++) stepMonth(st);
    const gbr = pc('GBR') / g0, qng = pc('QNG') / q0;
    expect(gbr).toBeGreaterThan(1.08);
    expect(gbr).toBeGreaterThan(qng + 0.05);
    expect(st.countries.GBR.productivity).toBeGreaterThan(st.countries.GBR.growthBase!.productivity);
  });
});

describe('ECON-GROWTH parallel construction', () => {
  it('runs several projects of one stream in parallel while money lasts', () => {
    const st = fresh(); const c = st.countries.GBR;
    st.constructionProjects = [];
    c.privatePool = 1e12;
    const sites = st.regions.filter((r) => r.owner === 'GBR').slice(0, 4);
    for (const r of sites) expect(enqueueConstruction(st, c, r, 'textile_mill', 'private')).not.toBeNull();
    constructionMonth(st);
    const invested = st.constructionProjects.filter((p) => p.countryId === 'GBR');
    expect(invested.length).toBe(4);
    for (const p of invested) expect(p.invested).toBeCloseTo(p.totalCost / 12, 6);
  });

  it('spends no more than the pool: later projects wait when money runs out', () => {
    const st = fresh(); const c = st.countries.GBR;
    st.constructionProjects = [];
    const sites = st.regions.filter((r) => r.owner === 'GBR').slice(0, 3);
    for (const r of sites) enqueueConstruction(st, c, r, 'textile_mill', 'private');
    const first = st.constructionProjects[0];
    c.privatePool = first.totalCost / 12 * 1.5;
    constructionMonth(st);
    const inv = st.constructionProjects.map((p) => p.invested);
    expect(inv[0]).toBeCloseTo(first.totalCost / 12, 6);
    expect(inv[1]).toBeCloseTo(first.totalCost / 24, 3);
    expect(inv[2]).toBe(0);
    expect(c.privatePool).toBeCloseTo(0, 6);
  });

  it('the parallel cap grows with the savings a country can actually fund', () => {
    const st = fresh();
    expect(constructionQueueCap(st, st.countries.GBR, 'private')).toBeGreaterThan(constructionQueueCap(st, st.countries.SMR ?? st.countries.LIE, 'private'));
    expect(constructionQueueCap(st, st.countries.GBR, 'private')).toBeLessThanOrEqual(60);
  });
});
