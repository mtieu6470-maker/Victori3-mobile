// REGIME-01a: Historical Mode regime changes and state formations (CG-41 data).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { regimesMonth } from '../src/engine/systems/regimes';
import { data } from '../src/engine/data/db';
import { validateNestedState } from '../src/engine/stateContract';
import { startReform, leaderTitle } from '../src/engine/systems/politics';
import { journalGoals, journalGoalValues, regimeLawInertia, regimeEntryKind, regimeEvent } from '../src/engine/systems/regimes';
import { execute as executeCommand } from '../src/engine/commands';
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

  it('the player country is not forced (journal entries instead) and Sandbox Mode is untouched', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'RUS' });
    const before = st.countries.RUS.nameVi;
    at(st, 1923, 1); regimesMonth(st);
    expect(st.countries.RUS.nameVi).toBe(before);
    expect(holder(st, 'RUS_FIN')).toBe('RUS');
    expect(st.journal!.some((j) => j.event === 'RUS-1917-11' && j.status === 'active')).toBe(true);
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
    expect(st.countries[rus].laws.power).toBe('one_party_state'); // USSR 1922 (proclaimed)
    expect(st.countries[ger].laws.power).toBe('one_party_state'); // 1933 seizure of power (proclaimed)
    // the 1936 constitution is a reform entry: the command economy comes once the AI's reforms pass it
    const j = st.journal!.find((x) => x.event === 'USSR-1936-12')!;
    expect(j.status).toBe('active');
    for (const g of journalGoals(st, j)) st.countries[rus].laws[g.group] = g.value; // as if the reforms had passed
    at(st, 1937, 2); regimesMonth(st);
    expect(j.status).toBe('completed');
    expect(st.countries[rus].laws.economy).toBe('command_economy');
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

  it('20th-century laws need their ideas before they can be debated (socialist thought; feminism for universal suffrage)', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const c = st.countries.GBR;
    c.techs = c.techs.filter((t) => t !== 'socialist_thought' && t !== 'feminism');
    expect(startReform(st, c, 'power', 'universal_suffrage')).toBe(false);
    expect(startReform(st, c, 'economy', 'command_economy')).toBe(false);
    c.techs.push('socialist_thought');
    expect(startReform(st, c, 'power', 'universal_suffrage')).toBe(false);
    c.techs.push('feminism');
    expect(startReform(st, c, 'power', 'universal_suffrage')).toBe(true);
  });

});

describe('REGIME-01b historical law hold', () => {
  it('a regime law resists change (soft inertia, not a block) until the next event for that capital changes it', async () => {
    const { reformUtility } = await import('../src/engine/ai/ai');
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS');
    at(st, 1923, 1); regimesMonth(st);
    const c = st.countries[rus];
    expect(regimeLawInertia(st, c, 'economy')).toBeGreaterThan(0); // NEP set by the 1922 union
    const held = reformUtility(st, c, 'economy', 'laissez_faire');
    at(st, 1937, 1); expect(regimeLawInertia(st, c, 'economy')).toBe(0); // the 1936 constitution changes it
    expect(reformUtility(st, c, 'economy', 'laissez_faire')).toBeGreaterThan(held);
  });
});

describe('REGIME-02 journal entries and heads of state', () => {
  it('a player reform entry completes only when its laws are in force (US Social Security 1935); a new republic is proclaimed', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'USA' });
    at(st, 1935, 8); regimesMonth(st);
    const j = st.journal!.find((x) => x.event === 'USA-1935-08' && x.status === 'active')!;
    expect(regimeEntryKind(regimeEvent(j.event)!)).toBe('reform');
    st.countries.USA.laws.economy = 'laissez_faire';
    expect(executeCommand(st, { type: 'journal', entry: j.id, action: 'complete' }).ok).toBe(false);
    const legit = st.countries.USA.legitimacy;
    st.countries.USA.laws.economy = 'interventionism'; // as if the reform had passed
    at(st, 1935, 9); regimesMonth(st);
    expect(j.status).toBe('completed');
    expect(st.countries.USA.legitimacy).toBeGreaterThan(legit);
    expect(regimeEntryKind(regimeEvent('FRA-1946-10')!)).toBe('proclaim');
  });

  it('a player proclaim entry (revolution) is carried out in one action; the player may also keep the regime', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'RUS' });
    at(st, 1917, 11); regimesMonth(st);
    const feb = st.journal!.find((x) => x.event === 'RUS-1917-03')!;
    const oct = st.journal!.find((x) => x.event === 'RUS-1917-11')!;
    expect(executeCommand(st, { type: 'journal', entry: feb.id, action: 'abandon' }).ok).toBe(true);
    expect(feb.status).toBe('abandoned');
    expect(executeCommand(st, { type: 'journal', entry: oct.id, action: 'complete' }).ok).toBe(true);
    expect(st.countries.RUS.nameVi).toBe('Nước Nga Xô viết');
    expect(st.countries.RUS.govLabel).toBe('dictatorship');
    at(st, 1917, 12); regimesMonth(st);
    const fin = st.journal!.find((x) => x.event === 'FIN-1917-12')!;
    expect(executeCommand(st, { type: 'journal', entry: fin.id, action: 'complete' }).ok).toBe(true);
    expect(st.countries[holder(st, 'RUS_FIN')].nameVi).toBe('Cộng hòa Phần Lan');
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('AI and player use the same entries; the AI pursues reform entries through its reforms', async () => {
    const { reformUtility } = await import('../src/engine/ai/ai');
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS');
    at(st, 1918, 7); regimesMonth(st);
    const j = st.journal!.find((x) => x.event === 'RSFSR-1918-07')!;
    expect(j.country).toBe(rus);
    expect(j.status).toBe('active');
    const c = st.countries[rus];
    const goal = journalGoals(st, j).find((g) => !g.done)!;
    expect(journalGoalValues(st, c, goal.group)).toContain(goal.value);
    const pulled = reformUtility(st, c, goal.group, goal.value);
    j.status = 'abandoned';
    expect(pulled).toBeGreaterThan(reformUtility(st, c, goal.group, goal.value));
  });

  it('a tsar becomes a general secretary: titles and forms of government follow the regime', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const rus = holder(st, 'RUS_MOS');
    expect(leaderTitle(st.countries[rus])).toBe('emperor');
    at(st, 1937, 1); regimesMonth(st);
    expect(leaderTitle(st.countries[rus])).toBe('general_secretary');
    expect(st.countries[rus].govLabel).toBe('socialist_republic');
    expect(st.countries[rus].leader.name).toMatch(/general_secretary/);
    expect(leaderTitle(st.countries[holder(st, 'FRA_IDF')])).toBe('president');
  });
});
