// PB-01a: power blocs (V3-style; owner: "the player founds their own bloc, as complete as Victoria 3").
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute } from '../src/engine/commands';
import { powerBlocsMonth, foundBloc, invite, leverage, principleSlots, setPrinciple, blocOf, leaveBloc, BLOC } from '../src/engine/systems/powerBlocs';
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

  it('principles need the identity, a free slot, cohesion for the level, and respect a cooldown; effects reach members', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const b = foundBloc(st, 'GBR', 'B', 'military_treaty', 'defensive_cooperation')!;
    invite(st, b, 'ION');
    expect(setPrinciple(st, b, 'exploit_members', 1)).toMatch(/identity/);
    b.lastPrincipleChange = -999; b.cohesion = 90;
    expect(principleSlots(b)).toBeGreaterThanOrEqual(3);
    expect(setPrinciple(st, b, 'defensive_cooperation', 3)).toBeNull();
    expect(setPrinciple(st, b, 'advanced_research', 1)).toMatch(/recently/);
    powerBlocsMonth(st);
    expect(st.treaties.some((t) => t.source === `pbloc:${b.id}` && t.members.includes('ION'))).toBe(true);
    expect(st.countries.ION.blocMods?.army).toBeGreaterThan(0);
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
    invite(st, b, 'ION'); b.cohesion = 95; b.lastPrincipleChange = -999; setPrinciple(st, b, 'market_unification', 3);
    powerBlocsMonth(st);
    expect(st.countries.ION.customsUnion).toBe(`cu_${b.id}`);
    leaveBloc(st, 'GBR');
    expect(st.powerBlocs?.[b.id]).toBeUndefined();
    expect(st.countries.ION.customsUnion).toBeNull();
  });
});
