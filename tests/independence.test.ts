// DECOL-03: independence movements, the owner's calculus, embargoes and foreign support.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute } from '../src/engine/commands';
import { INDEP, eraWave, inRegister, independenceMonth, movementAction, ownerCalculus, setEmbargo, supportMovement } from '../src/engine/systems/independence';
import { openness } from '../src/engine/systems/economy';
import { validateNestedState } from '../src/engine/stateContract';
import type { GameState } from '../src/engine/types';

loadNodeData();
const at1955 = (st: GameState) => { st.date = { ...st.date, y: 1955, m: 3 }; };
/** The largest movement in the player's (or a given owner's) colonies after one month. */
function movementOf(st: GameState, owner: string) {
  independenceMonth(st);
  const [k, m] = Object.entries(st.movements ?? {}).filter(([, x]) => x.owner === owner).sort((a, b) => b[1].pop - a[1].pop)[0];
  return { k, m };
}
const heat = (st: GameState, regions: string[], nat = 0.8, rad = 0.6) => { for (const id of regions) { const r = st.regions.find((x) => x.id === id)!; r.nationalism = nat; r.radical = rad; } };

describe('DECOL-03 independence movements', () => {
  it('the anti-colonial wave rises after 1885, 1919 and peaks around 1955–65', () => {
    expect(eraWave(1850)).toBe(0);
    expect(eraWave(1900)).toBeGreaterThan(0);
    expect(eraWave(1930)).toBeGreaterThan(eraWave(1900));
    expect(eraWave(1960)).toBe(1);
    expect(eraWave(1990)).toBeLessThan(eraWave(1960));
  });

  it('a strong movement in the player\'s colony demands statehood through the journal; granting with ties keeps the new state close', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'NED' });
    at1955(st);
    const { k, m } = movementOf(st, 'NED');
    heat(st, m.regions); m.strength = 70;
    independenceMonth(st);
    const j = st.journal!.find((x) => x.kind === 'independence_movement' && x.event === k)!;
    expect(j).toBeTruthy();
    expect(execute(st, { type: 'movement', key: k, action: 'grant_ties' }).ok).toBe(true);
    const nc = Object.values(st.countries).find((c) => c.alive && c.id !== 'NED' && st.regions.some((r) => r.owner === c.id && m.regions.includes(r.id)))!;
    expect(nc).toBeTruthy();
    expect(st.treaties.some((t) => t.source === 'ties' && t.members.includes(nc.id) && t.members.includes('NED'))).toBe(true);
    expect(st.movements?.[k]).toBeUndefined();
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('keeping a colony costs more under embargoes, foreign support and pressure; the AI weighs value against cost', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    at1955(st);
    const { k, m } = movementOf(st, 'NED');
    m.strength = 60;
    const base = ownerCalculus(st, m).cost;
    supportMovement(st, 'RUS', k); setEmbargo(st, 'RUS', 'NED', true); setEmbargo(st, 'USA', 'NED', true);
    const calc = ownerCalculus(st, m);
    expect(calc.cost).toBeGreaterThan(base);
    expect(calc.parts.supporters).toBe(INDEP.costSupporter);
    expect(st.relations[['NED', 'RUS'].sort().join('|')]).toBeLessThan(0);
  });

  it('embargoes cut the target\'s trade openness', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'RUS' });
    const before = openness(st.countries.GBR, true);
    expect(execute(st, { type: 'embargo', target: 'GBR', on: true }).ok).toBe(true);
    independenceMonth(st);
    expect(st.countries.GBR.embargoed).toBeGreaterThan(0);
    expect(openness(st.countries.GBR, true)).toBeLessThan(before);
    expect(execute(st, { type: 'embargo', target: 'GBR', on: false }).ok).toBe(true);
    independenceMonth(st);
    expect(st.countries.GBR.embargoed).toBeUndefined();
  });

  it('repression buys time at a price; an unanswered movement rises and its supporters may fight with it', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    at1955(st);
    const { k, m } = movementOf(st, 'NED');
    const t0 = st.countries.NED.treasury;
    expect(movementAction(st, k, 'repress')).toBeNull();
    expect(st.countries.NED.treasury).toBeLessThan(t0);
    expect(m.repressedUntil).toBeGreaterThan(st.tick);
    m.repressedUntil = 0; heat(st, m.regions, 0.95, 0.9); m.strength = 100; m.highMonths = INDEP.risingMonths; m.decidedAt = st.tick;
    independenceMonth(st);
    expect(st.wars.some((w) => w.kind === 'independence' && w.defenders.members.includes('NED'))).toBe(true);
  });

  it('Historical Mode: an AI owner\'s colonies in the decolonisation register follow their dates, not these rules', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at1955(st);
    independenceMonth(st);
    for (const m of Object.values(st.movements ?? {})) { m.strength = 100; m.highMonths = 99; }
    const wars = st.wars.length;
    independenceMonth(st);
    const risen = st.wars.slice(wars).filter((w) => w.kind === 'independence');
    // every rising that happened is outside the register; registered colonies stayed put
    expect(risen.every((w) => !(w.goals[0].regions ?? []).some(inRegister))).toBe(true);
    expect(Object.values(st.movements ?? {}).some((m) => m.regions.some(inRegister))).toBe(true);
  });
});
