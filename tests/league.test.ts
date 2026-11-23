// WW-01d: the League of Nations (Historical Mode).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { leagueMonth, leagueVote, leagueCouncil } from '../src/engine/systems/league';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
const at = (st: ReturnType<typeof createGame>, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };

describe('WW-01d League of Nations', () => {
  it('founded in 1920 without the US; great powers enter and leave on their dates; dissolved in 1946', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1920, 2); leagueMonth(st);
    const lg = st.league!;
    expect(lg.members).toContain('GBR');
    expect(lg.members).not.toContain('USA');
    expect(lg.members).not.toContain('PRU'); // Germany joins in 1926
    expect(lg.permanent).toEqual(expect.arrayContaining(['GBR', 'FRA', 'JAP']));
    at(st, 1926, 10); leagueMonth(st);
    expect(lg.permanent).toContain('PRU');
    at(st, 1935, 11); leagueMonth(st);
    expect(lg.members).not.toContain('JAP');
    expect(lg.members).not.toContain('PRU');
    expect(lg.left).toEqual(expect.arrayContaining(['JAP', 'PRU']));
    expect(() => validateNestedState(st)).not.toThrow();
    at(st, 1946, 5); leagueMonth(st);
    expect(lg.dissolved).toBeDefined();
  });

  it('the Council condemns only unanimously, the parties not voting; a condemned permanent member leaves', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1921, 2); leagueMonth(st);
    const council = leagueCouncil(st).filter((m) => m !== 'JAP' && m !== 'QNG');
    for (const m of council) { st.relations[[m, 'QNG'].sort().join('|')] = 50; st.relations[[m, 'JAP'].sort().join('|')] = -50; }
    for (const t of st.treaties) t.members = t.members.filter((m) => m !== 'JAP');
    const infamy = st.countries.JAP.infamy;
    const res = leagueVote(st, 'war_test', 'JAP', 'QNG');
    expect(res.votes.JAP).toBeUndefined();
    expect(res.passed).toBe(true);
    expect(st.countries.JAP.infamy).toBeGreaterThan(infamy);
    expect(st.league!.members).not.toContain('JAP');
    // one dissenting Council member blocks it
    const st2 = createGame({ mode: 'historical', seed: 1, player: null });
    at(st2, 1921, 2); leagueMonth(st2);
    const c2 = leagueCouncil(st2).filter((m) => m !== 'JAP' && m !== 'QNG');
    for (const m of c2) { st2.relations[[m, 'QNG'].sort().join('|')] = 50; st2.relations[[m, 'JAP'].sort().join('|')] = -50; }
    st2.relations[[c2[0], 'JAP'].sort().join('|')] = 90; st2.relations[[c2[0], 'QNG'].sort().join('|')] = -90;
    expect(leagueVote(st2, 'war_t2', 'JAP', 'QNG').passed).toBe(false);
  });

  it('Sandbox has no League', () => {
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null });
    at(sb, 1925, 1); leagueMonth(sb);
    expect(sb.league).toBeUndefined();
  });
});
