// DECOL-01: Historical Mode independence (CG-37) with a 2-year treaty truce (owner decision 2026-11-23).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { decolonisationMonth, DECOL_PARAMS } from '../src/engine/systems/decolonisation';
import { declareWar } from '../src/engine/systems/diplomacy';
import { validateGameStateContract } from '../src/engine/save';

loadNodeData();

describe('DECOL-01 Historical Mode independence', () => {
  const st = createGame({ mode: 'historical', seed: 1, player: null });
  st.date = { y: 1948, m: 3 }; st.tick = (1948 - 1836) * 12 + 2;
  decolonisationMonth(st);
  const lka = Object.values(st.countries).find((c) => c.name === 'Sri Lanka')!;

  it('creates the new state from colonial regions on its date, with its own productivity', () => {
    expect(lka?.alive).toBe(true);
    expect(st.regions.filter((r) => r.owner === lka.id).map((r) => r.id).sort()).toEqual(['GBR_CEY', 'GBR_JAF']);
    expect(lka.nameVi).toBe('Sri Lanka');
    expect(lka.productivity).toBeLessThanOrEqual(st.countries.GBR.productivity);
    expect(st.decolonised).toContain('indep_lka');
  });

  it('the save contract accepts a truce and rejects a malformed one', () => {
    const fresh = createGame({ mode: 'historical', seed: 1, player: null });
    fresh.countries.GBR.truce = { with: 'FRA', until: 24 };
    expect(() => validateGameStateContract(structuredClone(fresh))).not.toThrow();
    (fresh.countries.GBR as any).truce = { with: 'FRA', until: -1 };
    expect(() => validateGameStateContract(structuredClone(fresh))).toThrow(/truce/);
  });

  it('the independence treaty gives a truce of at most 2 years with the former owner only', () => {
    expect(DECOL_PARAMS.truceYears).toBeLessThanOrEqual(2);
    expect(lka.truce).toEqual({ with: 'GBR', until: st.tick + DECOL_PARAMS.truceYears * 12 });
    const s2 = structuredClone(st);
    expect(declareWar(s2, 'GBR', lka.id, [{ by: 'GBR', type: 'conquest', target: lka.id, regions: ['GBR_CEY'] } as any])).toBeNull();
    const s3 = structuredClone(st); s3.tick = lka.truce!.until;
    expect(declareWar(s3, 'GBR', lka.id, [{ by: 'GBR', type: 'conquest', target: lka.id, regions: ['GBR_CEY'] } as any])).not.toBeNull();
  });

  it('is not applied twice and does nothing in Sandbox Mode', () => {
    const n = Object.keys(st.countries).length;
    decolonisationMonth(st);
    expect(Object.keys(st.countries).length).toBe(n);
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null });
    sb.date = { y: 1948, m: 3 };
    const m = Object.keys(sb.countries).length; decolonisationMonth(sb);
    expect(Object.keys(sb.countries).length).toBe(m);
  });
});
