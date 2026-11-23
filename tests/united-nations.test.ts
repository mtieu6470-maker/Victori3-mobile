// DIPLO-UN-01: UN founding (Historical Mode 1945), Security Council seats and the veto.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { unMonth, holdVote, councilSeats, UN_PARAMS } from '../src/engine/systems/un';
import { validateGameStateContract } from '../src/engine/save';

loadNodeData();
const at = (y: number, m: number) => { const st = createGame({ mode: 'historical', seed: 1, player: null }); st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; return st; };

describe('DIPLO-UN-01 United Nations', () => {
  it('is founded in October 1945 with four fixed seats (London, Paris, Washington, Moscow holders) plus a power seat (owner)', () => {
    const early = at(1945, 9); unMonth(early); expect(early.un).toBeUndefined();
    const st = at(1945, 10); unMonth(st);
    expect(st.un).toBeTruthy();
    expect(st.un!.permanent.length).toBe(UN_PARAMS.permanentSeats);
    expect(UN_PARAMS.permanentSeats).toBe(5);
    for (const rid of Object.values(UN_PARAMS.seatRegions)) { const o = st.regions.find((r) => r.id === rid)!.owner; if (st.un!.members.includes(o)) expect(st.un!.permanent).toContain(o); }
    expect(st.un!.powerSeat).toBeTruthy();
    expect(Object.values(UN_PARAMS.seatRegions).map((rid) => st.regions.find((r) => r.id === rid)!.owner)).not.toContain(st.un!.powerSeat);
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

describe('DIPLO-UN-01 power seat and succession (owner 2026-11-23)', () => {
  it('the fifth seat goes at founding to the strongest other member and does not rotate afterwards', () => {
    const st = at(1945, 9);
    const fixedOwners = Object.values(UN_PARAMS.seatRegions).map((rid) => st.regions.find((r) => r.id === rid)!.owner);
    const strong = Object.values(st.countries).find((c) => c.alive && !c.overlord && !c.decentralized && !fixedOwners.includes(c.id) && !fixedOwners.some((f) => st.rivalries.includes([f, c.id].sort().join('|'))))!.id;
    for (const f of fixedOwners) st.relations[[f, strong].sort().join('|')] = 50;
    st.countries[strong].gdp = 1e15;
    st.date = { y: 1945, m: 10 }; st.tick += 1; unMonth(st);
    expect(st.un!.powerSeat).toBe(strong);
    const other = st.un!.members.find((m) => !st.un!.permanent.includes(m))!;
    st.countries[other].gdp = 1e16; st.date = { y: 1946, m: 1 }; st.tick += 3; unMonth(st);
    expect(st.un!.powerSeat).toBe(strong);
  });

  it('a fixed permanent member can veto a nominee at founding', () => {
    const st = at(1945, 9);
    const fixedOwners = Object.values(UN_PARAMS.seatRegions).map((rid) => st.regions.find((r) => r.id === rid)!.owner);
    const strong = Object.values(st.countries).find((c) => c.alive && !c.overlord && !c.decentralized && !fixedOwners.includes(c.id))!.id;
    st.countries[strong].gdp = 1e15;
    st.relations[[fixedOwners[0], strong].sort().join('|')] = -90;
    st.date = { y: 1945, m: 10 }; st.tick += 1; unMonth(st);
    expect(st.un!.powerSeat).not.toBe(strong);
  });

  it('a successor inheriting the whole of a collapsed permanent member keeps its seat', () => {
    const st = at(1945, 10); unMonth(st);
    const old = st.un!.permanent[0];
    const heirId = 'N_HEIR';
    st.countries[heirId] = { ...structuredClone(st.countries[old]), id: heirId, name: 'Heir', nameVi: 'Nước kế thừa' };
    for (const r of st.regions) if (r.owner === old) { r.owner = heirId; r.controller = heirId; }
    st.countries[old].alive = false;
    st.un!.members.push(heirId);
    unMonth(st);
    expect(st.un!.permanent).toContain(heirId);
    expect(st.un!.permanent).not.toContain(old);
  });
});
