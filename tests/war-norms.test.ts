// DIPLO-NORM-01: post-1945 aggression norm (Historical Mode), infamy decay only in peace, and reduced
// infamy for containing an aggressor (owner 2026-11-23).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { warInfamy, POST_1945_NORM, CONTAIN_AGGRESSOR, postwarNorm, diplomacyMonth, INFAMY_DECAY_PER_MONTH } from '../src/engine/systems/diplomacy';

loadNodeData();
const goal = (by: string, target: string) => [{ by, type: 'conquest', target, regions: ['X'] } as any];

describe('DIPLO-NORM-01', () => {
  it('conquest after 1945 costs more infamy in Historical Mode only', () => {
    const h = createGame({ mode: 'historical', seed: 1, player: null });
    const base = warInfamy(h, goal('GBR', 'FRA'));
    h.date.y = 1950;
    expect(postwarNorm(h)).toBe(true);
    expect(warInfamy(h, goal('GBR', 'FRA'))).toBeCloseTo(base * POST_1945_NORM.infamy, 9);
    const s = createGame({ mode: 'sandbox', seed: 1, player: null }); s.date.y = 1950;
    expect(warInfamy(s, goal('GBR', 'FRA'))).toBeCloseTo(base, 9);
  });

  it('fighting an aggressor costs a fraction of the usual infamy', () => {
    const h = createGame({ mode: 'historical', seed: 1, player: null });
    // a peaceful target with no infamy
    const t = Object.values(h.countries).find((c) => c.alive && c.infamy === 0 && c.id !== 'GBR' && !h.wars.some((w) => w.attackers.members.includes(c.id)))!.id;
    const base = warInfamy(h, goal('GBR', t), t);
    expect(base).toBeCloseTo(3, 9);
    h.countries[t].infamy = CONTAIN_AGGRESSOR.infamy;
    expect(warInfamy(h, goal('GBR', t), t)).toBeCloseTo(base * CONTAIN_AGGRESSOR.factor, 9);
  });

  it('infamy decays in peace but not while waging a war of conquest', () => {
    const h = createGame({ mode: 'historical', seed: 1, player: null });
    h.countries.PRU.infamy = 10; h.countries.AUS.infamy = 10;
    h.wars.push({ id: 'w', name: 'test', kind: 'conquest', attackers: { leader: 'PRU', members: ['PRU'] }, defenders: { leader: 'DEN', members: ['DEN'] }, goals: [], start: h.tick, score: 0, occupied: [], battles: 0, exhaustion: { a: 0, d: 0 } } as any);
    diplomacyMonth(h);
    expect(h.countries.PRU.infamy).toBe(10);
    expect(h.countries.AUS.infamy).toBeCloseTo(10 - INFAMY_DECAY_PER_MONTH, 9);
  });
});

import { infamyTier, INFAMY_TIERS, allianceAcceptance, joinCustomsUnion } from '../src/engine/systems/diplomacy';
describe('INFAMY-01 tiers', () => {
  it('names tiers at the thresholds', () => {
    expect(infamyTier({ infamy: INFAMY_TIERS.infamous - 1 })).toBe('none');
    expect(infamyTier({ infamy: INFAMY_TIERS.infamous })).toBe('infamous');
    expect(infamyTier({ infamy: INFAMY_TIERS.notorious })).toBe('notorious');
    expect(infamyTier({ infamy: INFAMY_TIERS.pariah })).toBe('pariah');
  });
  it('notoriety lowers alliance acceptance; a pariah gets no allies and no customs union', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const base = allianceAcceptance(st, 'BAV', 'AUS');
    st.countries.BAV.infamy = INFAMY_TIERS.notorious;
    expect(allianceAcceptance(st, 'BAV', 'AUS')).toBeLessThan(base - 5);
    st.countries.BAV.infamy = INFAMY_TIERS.pariah;
    expect(allianceAcceptance(st, 'BAV', 'AUS')).toBeLessThan(-50);
    const cu = st.treaties.find((t) => t.type === 'customs_union' && !t.members.includes('BAV'));
    if (cu) expect(joinCustomsUnion(st, st.countries.BAV, cu.id)).toBe(false);
  });
});
