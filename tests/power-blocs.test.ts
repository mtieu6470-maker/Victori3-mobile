// PB-01a: power blocs (V3-style; owner: "the player founds their own bloc, as complete as Victoria 3").
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute } from '../src/engine/commands';
import { powerBlocsMonth, foundBloc, invite, leverage, leverageParts, principleSlots, setPrinciple, blocOf, leaveBloc, BLOC, canFound, blocModsFor, cohesionParts, monthsToMandate, subjugateMember, pushLaw, wouldJoin, joinBloc, PRINCIPLES } from '../src/engine/systems/powerBlocs';
import { greatPowers } from '../src/engine/systems/diplomacy';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();

describe('PB-01a power blocs', () => {
  it('only a great power founds a bloc; the founder leads it with an identity and a first principle', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'GBR' });
    expect(greatPowers(st)).toContain('GBR');
    expect(execute(st, { type: 'found_bloc', name: 'Khối Đại Tây Dương', identity: 'trade_league', principle: 'internal_trade' }).ok).toBe(true);
    const b = blocOf(st, 'GBR')!;
    expect(b.leader).toBe('GBR'); expect(b.identity).toBe('trade_league'); expect(b.principles.internal_trade).toBe(1);
    const small = Object.values(st.countries).find((c) => c.alive && !c.decentralized && !c.overlord && !greatPowers(st).includes(c.id))!;
    expect(foundBloc(st, small.id, 'x', 'trade_league', null)).toBeNull();
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('a country joins when the leader\'s leverage is strong enough; a rival refuses', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'sovereign_empire', 'exploit_members')!;
    expect(st.countries.ION.overlord).toBe('GBR');
    expect(leverage(st, 'GBR', 'ION')).toBeGreaterThan(BLOC.joinMargin);
    expect(invite(st, b, 'ION').ok).toBe(true);
    expect(b.members).toContain('ION');
    st.rivalries.push(['GBR', 'RUS'].sort().join('|'));
    expect(invite(st, b, 'RUS').ok).toBe(false);
  });

  it('principles need the identity, a free slot, cohesion for the level and a mandate; effects reach members', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    st.rivalries.push(['GBR', 'RUS'].sort().join('|'));
    const b = foundBloc(st, 'GBR', 'B', 'military_treaty', 'advanced_research')!;
    invite(st, b, 'ION');
    expect(setPrinciple(st, b, 'exploit_members', 1)).toMatch(/identity/);
    expect(setPrinciple(st, b, 'defensive_cooperation', 3)).toMatch(/core/);
    b.cohesion = 90;
    expect(principleSlots(b)).toBeGreaterThanOrEqual(3);
    expect(setPrinciple(st, b, 'internal_trade', 1)).toMatch(/mandate/);
    b.mandates = 1;
    expect(setPrinciple(st, b, 'internal_trade', 2)).toBeNull();
    expect(b.mandates).toBe(0);
    expect(setPrinciple(st, b, 'police_coordination', 1)).toMatch(/mandate/);
    powerBlocsMonth(st);
    // a military treaty is a mutual-defence alliance from the start; its core principle reaches L3 at cohesion ≥ 70
    expect(st.treaties.some((t) => t.source === `pbloc:${b.id}` && t.members.includes('ION'))).toBe(true);
    expect(st.countries.ION.blocMods?.army).toBeGreaterThan(0);
    expect(st.countries.ION.blocMods?.trade).toBeCloseTo(0.10);
  });

  it('the player is invited through the journal and decides', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'ION' });
    const b = foundBloc(st, 'GBR', 'B', 'trade_league', null)!;
    expect(invite(st, b, 'ION').ok).toBe(true);
    expect(b.members).not.toContain('ION');
    const j = st.journal!.find((x) => x.kind === 'bloc_invite')!;
    expect(execute(st, { type: 'journal', entry: j.id, action: 'complete' }).ok).toBe(true);
    expect(b.members).toContain('ION');
    expect(execute(st, { type: 'bloc_leave' }).ok).toBe(true);
    expect(b.members).not.toContain('ION');
  });

  it('market unification at level 3 puts the members in one customs union; the bloc dissolves with its leader leaving', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'trade_league', 'market_unification')!;
    invite(st, b, 'ION'); b.cohesion = 95; // a trade league's core principle: one market from the start
    powerBlocsMonth(st);
    expect(st.countries.ION.customsUnion).toBe(`cu_${b.id}`);
    leaveBloc(st, 'GBR');
    expect(st.powerBlocs?.[b.id]).toBeUndefined();
    expect(st.countries.ION.customsUnion).toBeNull();
  });
});

describe('PB-02 distinct identities', () => {
  it('each identity has its own founding requirement', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    expect(canFound(st, 'GBR', 'sovereign_empire')).toBeNull(); // Britain has subjects in 1836
    const noSubjects = greatPowers(st).slice(0, BLOC.foundRank).find((id) => !Object.values(st.countries).some((c) => c.alive && c.overlord === id))!;
    expect(canFound(st, noSubjects, 'sovereign_empire')).toMatch(/subject/);
    st.countries.GBR.laws.church = 'freedom_of_conscience' as never; st.countries.GBR.laws.power = 'oligarchy' as never; st.countries.GBR.laws.governance = 'monarchy' as never;
    expect(canFound(st, 'GBR', 'religious_convocation')).toMatch(/religion/);
    st.countries.GBR.laws.trade = 'isolationism' as never;
    expect(canFound(st, 'GBR', 'trade_league')).toMatch(/isolationism/);
    expect(canFound(st, 'GBR', 'ideological_union')).toBeNull();
  });

  it('every principle level lists concrete effects; the preview shows what a country would get', () => {
    for (const [g, p] of Object.entries(PRINCIPLES)) for (const lvl of p.levels) expect(lvl.length, g).toBeGreaterThan(0);
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'sovereign_empire', 'internal_trade')!;
    const asMember = blocModsFor(st, b, 'ION'), asLeader = blocModsFor(st, b, 'GBR');
    expect(asMember.tribute).toBeCloseTo(0.04); // core principle at cohesion 50 → L2
    expect(asLeader.tribute).toBeUndefined();
    expect(asLeader.subjugate).toBe(1);
    expect(asMember.trade).toBeCloseTo(0.05);
  });

  it('a sovereign empire takes in the leader\'s subjects and collects tribute; it can make a weak member a protectorate', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'sovereign_empire', null)!;
    powerBlocsMonth(st);
    expect(b.members).toContain('ION');
    const weak = Object.values(st.countries).find((c) => c.alive && !c.decentralized && !c.overlord && !c.bloc && c.id !== 'GBR' && leverage(st, 'GBR', c.id) >= BLOC.subjugateLeverage)!;
    expect(weak).toBeTruthy();
    joinBloc(st, b, weak.id);
    b.cohesion = 50; expect(subjugateMember(st, b, weak.id)).toMatch(/Cohesion/);
    b.cohesion = 80; powerBlocsMonth(st); b.cohesion = 80;
    expect(subjugateMember(st, b, weak.id)).toBeNull();
    expect(st.countries[weak.id].overlord).toBe('GBR');
  });

  it('a religious convocation admits only its own faith; a military treaty holds by the leader\'s share of power', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    st.countries.RUS.laws.church = 'state_religion' as never;
    const b = foundBloc(st, 'RUS', 'B', 'religious_convocation', null)!;
    const capRel = (id: string) => st.regions.find((r) => r.id === st.countries[id].capital)!.religion;
    const other = Object.values(st.countries).find((c) => c.alive && !c.decentralized && c.capital && capRel(c.id) !== capRel('RUS'))!;
    expect(wouldJoin(st, b, other.id)).toBe(false);
    expect(blocModsFor(st, b, 'RUS').legitimacy).toBeGreaterThan(0);
    st.rivalries.push(['FRA', 'PRU'].sort().join('|'));
    const m = foundBloc(st, 'FRA', 'M', 'military_treaty', null)!;
    joinBloc(st, m, 'BAV' in st.countries ? 'BAV' : Object.keys(st.countries).find((id) => st.countries[id].alive && !st.countries[id].bloc && id !== 'FRA')!);
    expect(cohesionParts(st, m).identity).toBeGreaterThan(0); // France dwarfs its partner
  });

  it('mandates accrue with cohesion and members; leverage and cohesion are explained by their parts', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'trade_league', null)!;
    invite(st, b, 'ION');
    b.cohesion = 80;
    const n = monthsToMandate(b);
    expect(n).toBeGreaterThan(6); expect(n).toBeLessThan(40);
    for (let i = 0; i < n; i++) { b.cohesion = 80; powerBlocsMonth(st); }
    // the AI leader spends the mandate at once on a principle
    expect((b.mandates ?? 0) + Object.keys(b.principles).length).toBeGreaterThanOrEqual(1);
    const parts = leverageParts(st, 'GBR', 'ION')!;
    expect(Object.values(parts).reduce((a, x) => a + x, 0)).toBeCloseTo(leverage(st, 'GBR', 'ION'));
    expect(parts.subject).toBe(30);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('an ideological union presses its laws on an AI member', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'ideological_union', null)!;
    const t = Object.values(st.countries).find((c) => c.alive && !c.decentralized && c.id !== 'GBR' && !c.reform && (c.laws.power !== st.countries.GBR.laws.power || c.laws.economy !== st.countries.GBR.laws.economy))!;
    joinBloc(st, b, t.id);
    b.cohesion = 50; powerBlocsMonth(st);
    expect(pushLaw(st, b, t.id)).toMatch(/level 3/);
    b.cohesion = 90; powerBlocsMonth(st); b.cohesion = 90;
    expect(pushLaw(st, b, t.id)).toBeNull();
    expect(st.countries[t.id].reform).not.toBeNull();
  });
});

