// Yearly statistics (used by charts, rankings, tests and reports).
import type { GameState } from './types';
import { powerScore } from './systems/diplomacy';

export function sampleYear(st: GameState) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized) continue;
    const regions = st.regions.filter((r) => r.owner === c.id);
    const arr = (st.history[c.id] ??= []);
    if (arr.length && arr[arr.length - 1].y === st.date.y) continue;
    arr.push({ y: st.date.y, pop: Math.round(c.stats.pop), gdp: Math.round(c.gdp), army: Math.round(c.army.manpower), navy: Math.round(c.navy.strength * 10) / 10, literacy: Math.round(c.stats.literacy * 1000) / 1000, power: Math.round(powerScore(st, c) * 10) / 10, regions: regions.length, legitimacy: Math.round(c.legitimacy) });
  }
}

export function rankings(st: GameState) {
  return Object.values(st.countries).filter((c) => c.alive && !c.decentralized).map((c) => ({ id: c.id, name: c.name, power: powerScore(st, c), gdp: c.gdp, pop: c.stats.pop })).sort((a, b) => b.power - a.power);
}
