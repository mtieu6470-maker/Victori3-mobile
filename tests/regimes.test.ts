// REGIME-01a: Historical Mode regime changes and state formations (CG-41 data).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { regimesMonth } from '../src/engine/systems/regimes';
import { data } from '../src/engine/data/db';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
const at = (st: ReturnType<typeof createGame>, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };
const holder = (st: ReturnType<typeof createGame>, reg: string) => st.regions[data().regionIndex.get(reg)!].owner;

describe('REGIME-01a regime changes', () => {
  it('the October Revolution and the founding of the USSR rename and re-law the holder of Petrograd/Moscow', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS');
    at(st, 1917, 11); regimesMonth(st);
    expect(st.countries[rus].nameVi).toBe('Nước Nga Xô viết');
    expect(st.countries[rus].laws.governance).toBe('republic');
    expect(st.countries[rus].laws.press).toBe('censorship');
    at(st, 1923, 1); regimesMonth(st);
    expect(st.countries[rus].nameVi).toBe('Liên bang Cộng hòa Xã hội chủ nghĩa Xô viết');
    expect(st.countries[rus].name).toBe('Union of Soviet Socialist Republics');
    expect(st.regimesApplied).toContain('RUS-1922-12');
    expect(st.log.some((l) => l.historical && l.textVi?.includes('Liên bang Cộng hòa'))).toBe(true);
  });

  it('Finland, Poland and the Baltic states form from regions of their culture', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS');
    at(st, 1918, 12); regimesMonth(st);
    for (const [reg, vi] of [['RUS_FIN', 'Cộng hòa Phần Lan'], ['RUS_WAR', 'Cộng hòa Ba Lan']] as const) {
      const c = st.countries[holder(st, reg)];
      expect(c.id).not.toBe(rus);
      expect(c.nameVi).toBe(vi);
      expect(c.laws.governance).toBe('republic');
    }
    // each event applies once
    const n = Object.keys(st.countries).length; regimesMonth(st); expect(Object.keys(st.countries).length).toBe(n);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('the player country and Sandbox Mode are untouched', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'RUS' });
    const before = st.countries.RUS.nameVi;
    at(st, 1923, 1); regimesMonth(st);
    expect(st.countries.RUS.nameVi).toBe(before);
    expect(holder(st, 'RUS_FIN')).toBe('RUS');
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null }); const name = sb.countries[holder(sb, 'RUS_MOS')].nameVi;
    at(sb, 1923, 1); regimesMonth(sb);
    expect(sb.countries[holder(sb, 'RUS_MOS')].nameVi).toBe(name);
    expect(sb.regimesApplied).toBeUndefined();
  });
});
