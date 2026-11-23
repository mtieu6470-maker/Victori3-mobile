// LEAD-01: 20th-century leaders (CG-43) follow the historical course in Historical Mode.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { regimesMonth } from '../src/engine/systems/regimes';
import { leaders20Month, leaderHeldByRecord } from '../src/engine/systems/leaders20';
import { execute } from '../src/engine/commands';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
const at = (st: ReturnType<typeof createGame>, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };

describe('LEAD-01 historical leaders 1900-2026', () => {
  it('Lenin then Stalin lead the Soviet state; the records hold against random succession', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1918, 1); regimesMonth(st); leaders20Month(st);
    expect(st.countries.RUS.leader.name).toMatch(/Lenin/);
    at(st, 1930, 1); regimesMonth(st); leaders20Month(st);
    expect(st.countries.RUS.leader.name).toMatch(/Stalin/);
    expect(st.countries.RUS.leader.titleVi).toMatch(/Tổng Bí thư/);
    expect(leaderHeldByRecord(st, st.countries.RUS)).toBe(true);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('a player who keeps the old regime does not get the revolution leaders; Sandbox has none', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'RUS' });
    at(st, 1917, 11); regimesMonth(st);
    for (const j of st.journal!.filter((x) => x.status === 'active')) execute(st, { type: 'journal', entry: j.id, action: 'abandon' });
    at(st, 1918, 1); leaders20Month(st);
    expect(st.countries.RUS.leader.name).not.toMatch(/Lenin/);
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null });
    at(sb, 1930, 1); leaders20Month(sb);
    expect(sb.countries.RUS.leader.name).not.toMatch(/Stalin/);
  });
});
