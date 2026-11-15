// Headless runner: npm run sim -- --mode historical --years 30 --seed 1 [--player PRU]
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { rankings } from '../src/engine/metrics';
import type { GameMode } from '../src/engine/types';

const args = process.argv.slice(2);
const arg = (k: string, def: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : def; };
const mode = arg('mode', 'historical') as GameMode;
const years = Number(arg('years', '20'));
const seed = Number(arg('seed', '1'));
const player = arg('player', '') || null;

loadNodeData();
const t0 = Date.now();
const st = createGame({ mode, seed, player });
for (let i = 0; i < years * 12; i++) stepMonth(st);
const ms = Date.now() - t0;
console.log(`mode=${mode} seed=${seed} years=${years} -> ${st.date.y}-${st.date.m} in ${ms} ms (${(ms / (years * 12)).toFixed(1)} ms/month)`);
console.log('Top powers:', rankings(st).slice(0, 10).map((r) => `${r.id}(${r.power.toFixed(0)})`).join(' '));
const sim = st.divergence.similarity.at(-1);
console.log('Similarity:', sim);
console.log('Wars active:', st.wars.map((w) => w.name).slice(0, 8));
console.log('Territory changes:', st.territoryLog.length, 'historical matches:', st.territoryLog.filter((t) => t.historicalMatch).length);
console.log('Countries alive:', Object.values(st.countries).filter((c) => c.alive).length, 'formed:', Object.values(st.countries).filter((c) => c.formedAt !== undefined).map((c) => c.name));
console.log('AI actions:', st.counters.aiActions, 'decision windows:', st.counters.decisionWindowsFired, 'bias applied:', st.counters.historicalBiasApplied);
for (const id of ['GBR', 'FRA', 'PRU', 'RUS', 'USA', 'QNG', 'JAP', 'VNM']) { const c = st.countries[id]; if (c) console.log(id, c.alive, Math.round(c.stats.pop / 1e6 * 10) / 10 + 'M', 'gdp/cap', Math.round(c.gdp / Math.max(1, c.stats.pop)), 'leg', Math.round(c.legitimacy), c.leader.name, JSON.stringify(c.laws)); }
console.log('Recent log:', st.log.slice(-12).map((l) => `${l.date} ${l.text}`).join('\n'));
