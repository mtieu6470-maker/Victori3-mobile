// BLOC-01: Cold War blocs in Historical Mode.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { blocsMonth, blocTreatyId } from '../src/engine/systems/blocs';
import { allied } from '../src/engine/systems/diplomacy';
import { breakAlliance } from '../src/engine/systems/diplomacy';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
const at = (st: ReturnType<typeof createGame>, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };

describe('BLOC-01 Cold War blocs', () => {
  it('NATO forms in 1949 and grows; the Warsaw Pact forms in 1955 and dissolves in 1991; no country is in both', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1950, 1); blocsMonth(st);
    const nato = st.treaties.find((t) => t.id === blocTreatyId('NATO'))!;
    expect(nato.members).toEqual(expect.arrayContaining(['USA', 'GBR', 'FRA']));
    expect(allied(st, 'USA', 'FRA')).toBe(true);
    expect(nato.members).not.toContain('TUR');
    at(st, 1953, 1); blocsMonth(st);
    expect(nato.members).toContain('TUR');
    at(st, 1960, 1); blocsMonth(st);
    const wp = st.treaties.find((t) => t.id === blocTreatyId('WARSAW_PACT'))!;
    expect(wp.members).toContain('RUS');
    for (const m of wp.members) expect(nato.members).not.toContain(m);
    expect(st.treaties.some((t) => t.id === blocTreatyId('SEATO') && t.members.includes('USA'))).toBe(true); // same camp: several blocs
    breakAlliance(st, 'USA', 'GBR'); // two-member rule: the bloc survives
    expect(allied(st, 'USA', 'GBR')).toBe(true);
    expect(() => validateNestedState(st)).not.toThrow();
    at(st, 1992, 1); blocsMonth(st);
    expect(st.treaties.some((t) => t.id === blocTreatyId('WARSAW_PACT'))).toBe(false);
  });

  it('the player is never enrolled automatically; Sandbox has no blocs', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'GBR' });
    at(st, 1950, 1); blocsMonth(st);
    expect(st.treaties.find((t) => t.id === blocTreatyId('NATO'))!.members).not.toContain('GBR');
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null });
    at(sb, 1950, 1); blocsMonth(sb);
    expect(sb.treaties.some((t) => t.id === blocTreatyId('NATO'))).toBe(false);
  });
});
