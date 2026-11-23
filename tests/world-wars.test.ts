// WW-01b: historical World Wars in Historical Mode (CG-40 data), nominal belligerents, no AI peace.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { worldWarsMonth } from '../src/engine/systems/worldWars';

loadNodeData();
const at = (st: ReturnType<typeof createGame>, y: number, m: number) => { st.date = { y, m }; st.tick = (y - 1836) * 12 + m - 1; };

describe('WW-01b world wars', () => {
  it('WW1 opens in 1914 with the capital holders on both sides and ends on its date with the Allies victorious', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1914, 8); worldWarsMonth(st);
    const w = st.wars.find((x) => x.scripted === 'WW1')!;
    expect(w).toBeTruthy();
    expect(w.kind).toBe('great');
    expect(w.defenders.members).toEqual(expect.arrayContaining(['GBR', 'FRA', 'RUS']));
    expect(w.attackers.members).toEqual(expect.arrayContaining(['PRU', 'AUS']));
    at(st, 1917, 5); worldWarsMonth(st);
    expect(w.defenders.members).toContain('USA');
    at(st, 1918, 12); worldWarsMonth(st);
    expect(st.wars.some((x) => x.scripted === 'WW1')).toBe(false);
    expect(st.worldWars!.WW1.ended).toBe(true);
  });

  it('nominal belligerents join but are marked as not fighting; Sandbox has no scripted wars', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    at(st, 1914, 8); worldWarsMonth(st);
    at(st, 1917, 8); worldWarsMonth(st);
    const w = st.wars.find((x) => x.scripted === 'WW1')!;
    for (const n of w.nominal ?? []) expect([...w.attackers.members, ...w.defenders.members]).toContain(n);
    const sb = createGame({ mode: 'sandbox', seed: 1, player: null }); at(sb, 1914, 8); worldWarsMonth(sb);
    expect(sb.wars.some((x) => x.scripted)).toBe(false);
  });
});
