// CG-44: post-war regimes, partitions and dissolutions in Historical Mode.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { regimesMonth } from '../src/engine/systems/regimes';
import { blocsMonth } from '../src/engine/systems/blocs';
import { data } from '../src/engine/data/db';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
type St = ReturnType<typeof createGame>;
const at = (st: St, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };
const holder = (st: St, r: string) => st.countries[st.regions[data().regionIndex.get(r)!].owner];
const allied = (st: St, a: string, b: string) => st.treaties.some((t) => t.type === 'alliance' && t.members.includes(a) && t.members.includes(b));

describe('CG-44 post-war regimes and partitions', () => {
  it('Korea is divided in 1948; the ROK and Taiwan get US defence treaties on their CG-46 dates', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1950, 1); regimesMonth(st);
    const rok = holder(st, 'KOR_GYE'); const prk = holder(st, 'KOR_PYO');
    expect(rok.nameVi).toBe('Đại Hàn Dân Quốc');
    expect(prk.nameVi).toBe('Cộng hòa Dân chủ Nhân dân Triều Tiên');
    expect(prk.laws.power).toBe('one_party_state');
    const roc = holder(st, 'QNG_TAI');
    expect(roc.nameVi).toBe('Trung Hoa Dân Quốc (Đài Loan)');
    // CG-46: the US–ROK (1953) and US–ROC (1955–1980) mutual defence treaties on their dates
    const usa = holder(st, 'USA_MAR');
    expect(allied(st, usa.id, rok.id)).toBe(false);
    at(st, 1956, 1); blocsMonth(st);
    expect(allied(st, usa.id, rok.id)).toBe(true);
    expect(allied(st, usa.id, roc.id)).toBe(true);
    at(st, 1981, 1); blocsMonth(st);
    expect(allied(st, usa.id, roc.id)).toBe(false);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('the Soviet Union dissolves in 1991 into its republics and the Russian Federation', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1993, 2); regimesMonth(st);
    expect(holder(st, 'RUS_MOS').nameVi).toBe('Liên bang Nga');
    expect(holder(st, 'RUS_KIE').nameVi).toBe('Cộng hòa Ukraine');
    expect(holder(st, 'RUS_GEO').nameVi).toBe('Cộng hòa Georgia');
    expect(holder(st, 'RUS_KIE').id).not.toBe(holder(st, 'RUS_MOS').id);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('Vietnam: the north becomes the Democratic Republic in 1945 and the Nguyễn state becomes the State of Vietnam in 1949', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1950, 1); regimesMonth(st);
    expect(holder(st, 'VNM_HAN').nameVi).toBe('Việt Nam Dân chủ Cộng hòa');
    expect(holder(st, 'VNM_GDI').nameVi).toBe('Quốc gia Việt Nam');
    expect(holder(st, 'VNM_HAN').id).not.toBe(holder(st, 'VNM_GDI').id);
  });
});
