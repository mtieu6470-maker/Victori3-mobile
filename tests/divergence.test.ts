// DIV-01 / DIV-02: conquest does not transfer productivity; colonies receive only part of their owner's
// growth; technology effects scale with local skills (intensity of use).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { transferRegion } from '../src/engine/world';
import { growthMonth, isColonialRegion, REGION_CONVERGENCE } from '../src/engine/systems/growth';
import { techEffect, techUseIntensity, INTENSITY } from '../src/engine/systems/economy';

loadNodeData();

describe('DIV-01 regional productivity', () => {
  it('a conquered region keeps its effective productivity at the moment of transfer', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const r = st.regions.find((x) => x.owner === 'SOK')!;
    const before = st.countries.SOK.productivity * (r.prodRel ?? 1);
    transferRegion(st, r.id, 'GBR', 'test');
    expect(st.countries.GBR.productivity * r.prodRel!).toBeCloseTo(before, 9);
    expect(isColonialRegion(st, r)).toBe(true);
  });

  it('multi-ethnic home countries are not colonies of themselves; metropolitan colonies are colonial', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    for (const id of ['QNG', 'EIC', 'BRA', 'RUS']) for (const r of st.regions.filter((x) => x.owner === id)) expect(isColonialRegion(st, r), `${id} ${r.id}`).toBe(false);
    expect(st.regions.filter((x) => x.owner === 'NED').some((r) => isColonialRegion(st, r))).toBe(true);
    expect(st.regions.filter((x) => x.owner === 'GBR' && x.id.startsWith('GBR_LON')).every((r) => !isColonialRegion(st, r))).toBe(true);
  });

  it("a colony receives only part of its owner's national productivity growth", () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const r = st.regions.find((x) => x.owner === 'SOK')!;
    transferRegion(st, r.id, 'GBR', 'test');
    const gb = st.countries.GBR; const p0 = gb.productivity; const eff0 = p0 * r.prodRel!;
    gb.growthBase = { productivity: p0 * 2, tfp: 0, literacy: gb.stats.literacy }; // pull national productivity up
    growthMonth(st);
    const g = gb.productivity / p0; const effG = (gb.productivity * r.prodRel!) / eff0;
    expect(g).toBeGreaterThan(1);
    expect(effG).toBeLessThan(g);
    expect(Math.log(effG) / Math.log(g)).toBeLessThan(REGION_CONVERGENCE.colonialTransmission + 0.05);
  });
});

describe('DIV-02 intensity of use', () => {
  it('production effects scale with local literacy; full at the threshold; floor for illiterate regions', () => {
    expect(techUseIntensity(INTENSITY.fullAt)).toBe(1);
    expect(techUseIntensity(0.9)).toBe(1);
    expect(techUseIntensity(0)).toBe(INTENSITY.floor);
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const gb = st.countries.GBR;
    const full = techEffect(gb, 'factory_efficiency', { literacy: 0.9 });
    const low = techEffect(gb, 'factory_efficiency', { literacy: 0.12 });
    expect(full).toBeGreaterThan(0);
    expect(low).toBeCloseTo(full * techUseIntensity(0.12), 9);
    // non-production effects are not scaled
    expect(techEffect(gb, 'army_quality', { literacy: 0.05 })).toBe(techEffect(gb, 'army_quality'));
  });
});
