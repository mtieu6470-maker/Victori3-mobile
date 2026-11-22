// ECON-CAL-01b: per-good import openness from 1836 tariff evidence (CG-21) and price-responsive
// cottage industry. Values are project design mappings; evidence citations live in tradePolicy1836.ts.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { cottageOutput, COTTAGE_BASE_MIX, goodOpenness, openness, OPENNESS } from '../src/engine/systems/economy';
import { opennessFromTariff, TARIFF_EVIDENCE_1836 } from '../src/engine/data/tradePolicy1836';
import { GOODS } from '../src/engine/types';

loadNodeData();

describe('ECON-CAL-01b tariff → openness mapping', () => {
  it('is consistent with the engine trade-law table and clamps', () => {
    expect(opennessFromTariff(0.04)).toBeCloseTo(OPENNESS.free_trade, 1);
    expect(opennessFromTariff(0.2)).toBeCloseTo(OPENNESS.protectionism, 1);
    expect(opennessFromTariff(0.35)).toBeLessThanOrEqual(0.03 + 1e-9);
    expect(opennessFromTariff('prohibited')).toBe(0.03);
    expect(opennessFromTariff(-1)).toBe(0.9);
  });

  it('every evidence entry cites a basis', () => {
    for (const goods of Object.values(TARIFF_EVIDENCE_1836)) for (const ev of Object.values(goods)) expect(ev!.basis.length).toBeGreaterThan(20);
  });

  it('applies evidence only where it exists and only while the 1836 trade law is in force', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const gbr = st.countries.GBR; const fra = st.countries.FRA;
    const coastal = true;
    expect(goodOpenness(st, 'GBR', gbr, coastal, 'cotton')).toBeGreaterThan(goodOpenness(st, 'GBR', gbr, coastal, 'luxury'));
    expect(goodOpenness(st, 'FRA', fra, coastal, 'textiles')).toBeLessThan(0.05);
    // Goods without evidence keep exactly the law-based openness.
    for (const g of GOODS) if (!TARIFF_EVIDENCE_1836.GBR?.[g]) expect(goodOpenness(st, 'GBR', gbr, coastal, g)).toBe(openness(gbr, coastal));
    // A trade-law change replaces the 1836 tariff evidence with the new law.
    const before = fra.laws.trade;
    fra.laws.trade = before === 'free_trade' ? 'protectionism' : 'free_trade';
    expect(goodOpenness(st, 'FRA', fra, coastal, 'textiles')).toBe(openness(fra, coastal));
  });
});

describe('ECON-CAL-01b cottage industry', () => {
  it('reproduces the former fixed mix at base prices (and for missing/invalid prices)', () => {
    const at1 = cottageOutput(Object.fromEntries(GOODS.map((g) => [g, 1])) as never);
    expect(at1.textiles).toBeCloseTo(COTTAGE_BASE_MIX.textiles, 12);
    expect(at1.tools).toBeCloseTo(COTTAGE_BASE_MIX.tools, 12);
    expect(at1.luxury).toBeCloseTo(COTTAGE_BASE_MIX.luxury, 12);
    expect(cottageOutput(undefined)).toEqual(at1);
    expect(cottageOutput({ textiles: Number.NaN, tools: -2, luxury: 1 } as never)).toEqual(at1);
  });

  it('shifts away from cheap goods and markets less when its goods are cheap', () => {
    const prices = Object.fromEntries(GOODS.map((g) => [g, 1])) as Record<string, number>;
    prices.tools = 0.5;
    const out = cottageOutput(prices as never);
    expect(out.tools).toBeLessThan(COTTAGE_BASE_MIX.tools);
    expect(out.textiles + out.tools + out.luxury).toBeLessThan(1);
    expect(out.textiles + out.tools + out.luxury).toBeGreaterThanOrEqual(0.5);
    const glut = cottageOutput({ ...prices, textiles: 0.3, tools: 0.3, luxury: 0.3 } as never);
    expect(glut.textiles + glut.tools + glut.luxury).toBeCloseTo(0.5, 12);
  });
});

describe('ECON-03a saturating trade share', () => {
  it('maps openness to a tradable share of a deficit/surplus that saturates at full access', async () => {
    const { tradeShare, TRADE_FULL_ACCESS } = await import('../src/engine/systems/economy');
    expect(tradeShare(0)).toBe(0);
    expect(tradeShare(TRADE_FULL_ACCESS)).toBe(1);
    expect(tradeShare(0.9)).toBe(1);
    expect(tradeShare(0.31)).toBeCloseTo(0.62, 2);
    expect(tradeShare(Number.NaN)).toBe(0);
  });

  it('CG-22 constraint: Britain imports raw cotton and the United States is a major cotton exporter', async () => {
    const { stepMonth } = await import('../src/engine/simulation');
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    stepMonth(st); stepMonth(st);
    const cotton = Object.entries(st.marketStats).map(([id, m]) => ({ id, ...m.cotton }));
    const gbr = cotton.find((r) => r.id === 'GBR')!;
    expect(gbr.imports).toBeGreaterThan(gbr.supply * 0.5); // most British cotton is imported
    const exporters = [...cotton].sort((a, b) => (b.exports ?? 0) - (a.exports ?? 0)).slice(0, 3).map((r) => r.id);
    expect(exporters).toContain('USA');
  });
});
