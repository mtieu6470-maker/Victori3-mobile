// CATCHUP-01 (revised after CG_REVIEW_CATCHUP01_NO_LATECOMER_BUFF): convergence is earned, bounded and
// conditional — never a latecomer bonus (owner directive 2026-11-22).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { absorptiveCapacity, IMITATION_DISCOUNT_MAX, imitationDiscount, techCost } from '../src/engine/systems/technology';
import { EMULATION_STEPS, LAW_EMULATION, lawEmulation } from '../src/engine/ai/ai';

loadNodeData();
const fresh = () => createGame({ mode: 'sandbox', seed: 3, player: null });

describe('CATCHUP-01 imitation discount', () => {
  it('no country knows the technology → no discount, however old it is', () => {
    const c = fresh().countries.BRA; c.laws.trade = 'free_trade'; c.stats.literacy = 0.9;
    expect(imitationDiscount(c, 0, 0)).toBe(0);
    expect(imitationDiscount(c, 0, 180)).toBe(0);
  });

  it('is capped: never more than IMITATION_DISCOUNT_MAX, even for an ideal adopter', () => {
    const c = fresh().countries.BRA; c.laws.trade = 'free_trade'; c.stats.literacy = 0.99;
    expect(IMITATION_DISCOUNT_MAX).toBeLessThanOrEqual(0.4);
    expect(imitationDiscount(c, 1, 500)).toBeCloseTo(IMITATION_DISCOUNT_MAX, 12);
    for (const k of [0.1, 0.5, 1]) for (const a of [0, 5, 30, 200]) expect(imitationDiscount(c, k, a)).toBeLessThanOrEqual(IMITATION_DISCOUNT_MAX + 1e-12);
  });

  it('isolated or illiterate states gain almost nothing', () => {
    const c = fresh().countries.QNG;
    c.laws.trade = 'isolationism'; c.stats.literacy = 0.6;
    expect(imitationDiscount(c, 1, 100)).toBeLessThan(0.05);
    c.laws.trade = 'free_trade'; c.stats.literacy = 0.05;
    expect(imitationDiscount(c, 1, 100)).toBeLessThan(0.05);
  });

  it('size does not matter: a small and a large adopter with the same conditions get the same discount', () => {
    const st = fresh(); const small = st.countries.SMR ?? st.countries.LIE; const large = st.countries.QNG;
    for (const c of [small, large]) { c.laws.trade = 'protectionism'; c.stats.literacy = 0.4; }
    expect(absorptiveCapacity(small)).toBeCloseTo(absorptiveCapacity(large), 12);
    expect(imitationDiscount(small, 0.7, 40)).toBeCloseTo(imitationDiscount(large, 0.7, 40), 12);
  });

  it('a brand-new technology is not yet codified: no discount at its diffusion year', () => {
    const c = fresh().countries.FRA; c.laws.trade = 'free_trade'; c.stats.literacy = 0.9;
    expect(imitationDiscount(c, 0.9, 0)).toBe(0);
    expect(imitationDiscount(c, 0.9, 10)).toBeGreaterThan(0);
  });

  it('techCost is pure: computing it changes no state (no GDP/TFP/research side effects)', () => {
    const st = fresh(); const before = JSON.stringify(st);
    techCost(st, st.countries.BRA, 'railways');
    expect(JSON.stringify(st)).toBe(before);
  });
});

describe('CATCHUP-01 law emulation', () => {
  it('applies only to explicit single modernisation steps', () => {
    const st = fresh(); const c = st.countries.BRA; c.laws.trade = 'free_trade';
    c.laws.education = 'religious_schools';
    expect(EMULATION_STEPS.education!.religious_schools).toBe('public_schools');
    expect(lawEmulation(st, c, 'army', 'mass_conscription')).toBe(0);
    c.laws.education = 'no_schools';
    expect(lawEmulation(st, c, 'education', 'public_schools')).toBe(0); // skipping a step is not emulated
  });

  it('is a small bounded influence that shrinks without trade exposure', () => {
    const st = fresh(); const c = st.countries.BRA; c.laws.education = 'religious_schools';
    for (const x of Object.values(st.countries)) if (x !== c) x.laws.education = 'public_schools';
    c.laws.trade = 'free_trade';
    const open = lawEmulation(st, c, 'education', 'public_schools');
    c.laws.trade = 'isolationism';
    const closed = lawEmulation(st, c, 'education', 'public_schools');
    expect(open).toBeGreaterThan(0);
    expect(open).toBeLessThanOrEqual(LAW_EMULATION + 1e-12);
    expect(closed).toBeLessThan(open * 0.1);
  });
});

describe('CATCHUP-01 domestic feasibility (review round 2)', () => {
  it('international emulation cannot carry a reform that domestic interest groups oppose', async () => {
    const { reformUtility, LAW_EMULATION: MAX } = await import('../src/engine/ai/ai');
    const { reformSupport } = await import('../src/engine/systems/politics');
    const st = fresh(); const c = st.countries.QNG;
    c.laws.education = 'religious_schools'; c.laws.trade = 'free_trade'; c.radicalism = 0;
    const others = Object.values(st.countries).filter((x) => x !== c);
    for (const x of others) x.laws.education = 'religious_schools';
    st.tick += 1;
    const isolated = reformUtility(st, c, 'education', 'public_schools');
    for (const x of others) x.laws.education = 'public_schools';
    st.tick += 1; // the world now overwhelmingly has public schools
    const emulated = reformUtility(st, c, 'education', 'public_schools');
    expect(reformSupport(c, 'education', 'public_schools')).toBeLessThan(-0.5); // Qing 1836 elites oppose
    expect(emulated - isolated).toBeGreaterThan(0);
    expect(emulated - isolated).toBeLessThanOrEqual(MAX + 1e-12);
    expect(emulated).toBeLessThan(0.15); // still below the AI's reform threshold
  });

  it('the reformism preference uses the explicit modernisation rank, not array order', async () => {
    const { isProgressiveStep } = await import('../src/engine/ai/ai');
    expect(isProgressiveStep('education', 'religious_schools', 'public_schools')).toBe(true);
    expect(isProgressiveStep('labor', 'free_labor', 'serfdom')).toBe(false);
    expect(isProgressiveStep('economy', 'interventionism', 'laissez_faire')).toBe(true);
  });

  it('known share is GDP-weighted: micro-states cannot inflate it', async () => {
    const { knownShare } = await import('../src/engine/systems/technology');
    const st = fresh();
    const tech = 'assembly_line';
    for (const x of Object.values(st.countries)) x.techs = x.techs.filter((t) => t !== tech);
    // Give the technology to every country except the ten largest economies.
    const ranked = Object.values(st.countries).filter((x) => x.alive && !x.decentralized).sort((a, b) => b.gdp - a.gdp);
    for (const x of ranked.slice(10)) x.techs.push(tech);
    st.tick += 1; // invalidate the monthly cache
    expect(ranked.length).toBeGreaterThan(50);
    expect(knownShare(st, tech)).toBeLessThan(0.5);
  });
});
