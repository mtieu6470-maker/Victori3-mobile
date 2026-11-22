// TECH-02: technology import channel and Historical Mode adoption windows.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { importPoints, knownShare, techReservedByHistory, TECH_IMPORT } from '../src/engine/systems/technology';

loadNodeData();

describe('TECH-02 technology import', () => {
  const st = createGame({ mode: 'historical', seed: 1, player: null });
  for (let i = 0; i < 24; i++) stepMonth(st);
  const ru = st.countries.RUS;

  it('imports only what other countries already use, and only once it has matured', () => {
    expect(knownShare(st, 'railways')).toBeGreaterThan(0);
    const fresh = Object.values(st.countries).find((c) => c.alive)!;
    // a technology nobody uses cannot be imported
    const unknown = ['microprocessors', 'jet_engines', 'nuclear_power'].find((t) => knownShare(st, t) === 0);
    if (unknown) expect(importPoints(st, fresh, unknown)).toBe(0);
    // railways (1830) is old enough to be traded by 1838
    ru.laws.trade = 'protectionism';
    expect(importPoints(st, ru, 'railways')).toBeGreaterThan(0);
  });

  it('isolationism closes the channel', () => {
    const s2 = structuredClone(st); s2.countries.RUS.laws.trade = 'isolationism';
    expect(importPoints(s2, s2.countries.RUS, 'railways')).toBe(0);
  });

  it('depends on income per head, not on population size (no size advantage)', () => {
    const s2 = structuredClone(st); const c = s2.countries.RUS;
    c.laws.trade = 'protectionism';
    const a = importPoints(s2, c, 'railways');
    c.gdp *= 2; c.stats.pop *= 2;
    expect(importPoints(s2, c, 'railways')).toBeCloseTo(a, 6);
  });

  it('can be disabled for ablation', () => {
    TECH_IMPORT.enabled = false;
    try { expect(importPoints(st, ru, 'railways')).toBe(0); } finally { TECH_IMPORT.enabled = true; }
  });
});

describe('TECH-02 Historical Mode adoption windows', () => {
  it('Qing cannot adopt railways before 1876 in Historical Mode; Sandbox ignores the window', () => {
    const h = createGame({ mode: 'historical', seed: 1, player: null });
    const s = createGame({ mode: 'sandbox', seed: 1, player: null });
    expect(techReservedByHistory(h, h.countries.QNG, 'railways')).toBe(true);
    expect(techReservedByHistory(s, s.countries.QNG, 'railways')).toBe(false);
    expect(techReservedByHistory(h, h.countries.RUS, 'railways')).toBe(false);
    h.date.y = 1876;
    expect(techReservedByHistory(h, h.countries.QNG, 'railways')).toBe(false);
  });
});
