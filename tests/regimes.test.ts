// REGIME-01a: Historical Mode regime changes and state formations (CG-41 data).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { regimesMonth } from '../src/engine/systems/regimes';
import { data } from '../src/engine/data/db';
import { validateNestedState } from '../src/engine/stateContract';
import { startReform } from '../src/engine/systems/politics';
import { computeEconomy } from '../src/engine/systems/economy';
import { companySlots } from '../src/engine/systems/companies';

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

describe('REGIME-01b 20th-century laws', () => {
  it('the USSR becomes a one-party state with a command economy; Weimar Germany has universal suffrage', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS'); const ger = holder(st, 'PRU_BRA');
    at(st, 1937, 1); regimesMonth(st);
    expect(st.countries[rus].laws.power).toBe('one_party_state');
    expect(st.countries[rus].laws.economy).toBe('command_economy');
    expect(st.countries[ger].laws.power).toBe('one_party_state');
    const st2 = createGame({ mode: 'historical', seed: 1, player: null });
    at(st2, 1919, 1); regimesMonth(st2);
    expect(st2.countries[holder(st2, 'PRU_BRA')].laws.power).toBe('universal_suffrage');
    expect(st2.countries[holder(st2, 'RUS_FIN')].laws.power).toBe('universal_suffrage');
  });

  it('a command economy has no private savings or company slots and funds state construction instead', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const c = st.countries.RUS;
    c.laws.economy = 'command_economy'; c.techs.push('joint_stock_banking');
    const pool0 = c.statePool, priv0 = c.privatePool;
    computeEconomy(st);
    expect(c.privatePool).toBeCloseTo(priv0, 6);
    expect(c.statePool).toBeGreaterThan(pool0);
    expect(companySlots(st, c)).toBe(0);
  });

  it('20th-century laws need socialist thought before they can be debated', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const c = st.countries.GBR;
    c.techs = c.techs.filter((t) => t !== 'socialist_thought');
    expect(startReform(st, c, 'power', 'universal_suffrage')).toBe(false);
    expect(startReform(st, c, 'economy', 'command_economy')).toBe(false);
    c.techs.push('socialist_thought');
    expect(startReform(st, c, 'power', 'universal_suffrage')).toBe(true);
  });
});

describe('REGIME-01b historical law hold', () => {
  it('Historical AI keeps a regime law until the next event for that capital changes it', async () => {
    const { lawReservedByHistory } = await import('../src/engine/ai/ai');
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS');
    at(st, 1937, 1); regimesMonth(st);
    const c = st.countries[rus];
    expect(lawReservedByHistory(st, c, 'economy')).toBe(true);
    at(st, 1984, 12); expect(lawReservedByHistory(st, c, 'economy')).toBe(true);
    at(st, 1985, 4); expect(lawReservedByHistory(st, c, 'economy')).toBe(false);
  });
});
