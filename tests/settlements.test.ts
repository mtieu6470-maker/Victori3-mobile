// WW-01c: Historical Mode unifications and peace settlements.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { settlementsMonth } from '../src/engine/systems/settlements';
import { data } from '../src/engine/data/db';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
type St = ReturnType<typeof createGame>;
const at = (st: St, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };
const owner = (st: St, r: string) => st.regions[data().regionIndex.get(r)!].owner;
const ended = (st: St, war: string, joined: Record<string, string>) => { (st.worldWars ??= {})[war] = { war: null, ended: true, joined }; };

describe('WW-01c unifications and settlements', () => {
  it('Italy and Germany unify on their historical dates; a player state is not absorbed', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'BAV' });
    at(st, 1871, 2); settlementsMonth(st);
    expect(owner(st, 'SAX_DRE')).toBe(owner(st, 'PRU_BRA'));
    expect(owner(st, 'HAN_HAN')).toBe(owner(st, 'PRU_BRA'));
    expect(owner(st, 'BAV_MUN')).toBe('BAV'); // the player keeps its independence
    expect(owner(st, 'SIC_NAP')).toBe(owner(st, 'SAR_PIE'));
    expect(owner(st, 'AUS_VEN')).toBe(owner(st, 'SAR_PIE'));
    expect(owner(st, 'PAP_ROM')).toBe(owner(st, 'SAR_PIE'));
    expect(st.countries[owner(st, 'AUS_VIE')].nameVi).toBe('Đế quốc Áo-Hung');
  });

  it('Austria-Hungary dissolves only if it lost the First World War', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1918, 12); settlementsMonth(st);
    expect(owner(st, 'AUS_BOH')).toBe(owner(st, 'AUS_VIE')); // the war has not ended: nothing yet
    const lost = createGame({ mode: 'historical', seed: 1, player: null });
    at(lost, 1872, 1); settlementsMonth(lost);
    ended(lost, 'WW1', { GMY: owner(lost, 'PRU_BRA'), AUH: owner(lost, 'AUS_VIE'), SER: owner(lost, 'SER_BEL'), FRA: owner(lost, 'FRA_IDF') });
    at(lost, 1919, 7); settlementsMonth(lost);
    expect(lost.countries[owner(lost, 'AUS_BOH')].nameVi).toBe('Cộng hòa Tiệp Khắc');
    expect(lost.countries[owner(lost, 'AUS_VIE')].nameVi).toBe('Cộng hòa Áo');
    expect(owner(lost, 'AUS_CRO')).toBe(owner(lost, 'SER_BEL'));
    expect(() => validateNestedState(lost)).not.toThrow();
  });

  it('Germany is divided in 1949 and reunified in 1990', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1872, 1); settlementsMonth(st);
    at(st, 1938, 1); settlementsMonth(st); // records the 1937 frontier
    ended(st, 'WW2', { GMY: owner(st, 'PRU_BRA') });
    at(st, 1950, 1); settlementsMonth(st);
    const gdr = st.countries[owner(st, 'PRU_BRA')]; const frg = st.countries[owner(st, 'PRU_RHI')];
    expect(gdr.nameVi).toBe('Cộng hòa Dân chủ Đức');
    expect(gdr.laws.power).toBe('one_party_state');
    expect(frg.nameVi).toBe('Cộng hòa Liên bang Đức');
    expect(frg.capital).toBe('PRU_RHI');
    expect(owner(st, 'PRU_SIL')).not.toBe(frg.id); // Silesia passed to Poland
    at(st, 1990, 11); settlementsMonth(st);
    expect(owner(st, 'PRU_BRA')).toBe(frg.id);
    expect(frg.capital).toBe('PRU_BRA');
    expect(() => validateNestedState(st)).not.toThrow();
  });
});
