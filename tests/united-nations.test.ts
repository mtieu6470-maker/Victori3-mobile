// DIPLO-UN-01: UN founding (Historical Mode 1945), Security Council seats and the veto.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { unMonth, holdVote, councilSeats, UN_PARAMS } from '../src/engine/systems/un';
import { validateGameStateContract } from '../src/engine/save';

loadNodeData();
const at = (y: number, m: number) => { const st = createGame({ mode: 'historical', seed: 1, player: null }); st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; return st; };

describe('DIPLO-UN-01 United Nations', () => {
  it('is founded in October 1945 in Historical Mode with four permanent seats (owner) held by the strongest capital holders', () => {
    const early = at(1945, 9); unMonth(early); expect(early.un).toBeUndefined();
    const st = at(1945, 10); unMonth(st);
    expect(st.un).toBeTruthy();
    expect(st.un!.permanent.length).toBe(UN_PARAMS.permanentSeats);
    expect(UN_PARAMS.permanentSeats).toBe(4);
    for (const p of st.un!.permanent) expect(st.un!.members).toContain(p);
    expect(st.un!.elected.length).toBe(UN_PARAMS.electedBefore1966);
    expect(councilSeats(st).length).toBe(UN_PARAMS.permanentSeats + UN_PARAMS.electedBefore1966);
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null }); sb.date = { y: 1950, m: 1 }; unMonth(sb); expect(sb.un).toBeUndefined();
  });

  it('a permanent member voting against vetoes the resolution', () => {
    const st = at(1945, 10); unMonth(st);
    const p = st.un!.permanent[0];
    const victim = st.un!.members.find((m) => !st.un!.permanent.includes(m))!;
    const res = holdVote(st, 'w-test', p, victim);
    expect(res.votes[p]).toBe('against');
    expect(res.vetoedBy).toContain(p);
    expect(res.passed).toBe(false);
  });

  it('a passed resolution marks the attacker (infamy up); the state stays contract-valid', () => {
    const st = at(1945, 10); unMonth(st);
    const attacker = st.un!.members.find((m) => !st.un!.permanent.includes(m))!;
    const defender = st.un!.members.find((m) => m !== attacker && !st.un!.permanent.includes(m))!;
    for (const m of councilSeats(st)) if (m !== attacker) st.relations[[m, attacker].sort().join('|')] = -80;
    const inf = st.countries[attacker].infamy;
    const res = holdVote(st, 'w-test2', attacker, defender);
    if (res.passed) expect(st.countries[attacker].infamy).toBe(inf + UN_PARAMS.condemnInfamy);
    expect(res.vetoedBy.length === 0 || !res.passed).toBe(true);
    const fresh = createGame({ mode: 'historical', seed: 1, player: null });
    fresh.un = structuredClone(st.un);
    expect(() => validateGameStateContract(structuredClone(fresh))).not.toThrow();
  });
});
