// S0-B3 audit probe (not product code; read-only). Measures how long wars last in the audited engine and why, to
// settle whether the 145-month maximum seen by probe_empty_pass.ts is a logic error or a counting convention.
// It runs the unmodified engine (createGame + stepMonth) and, after every tick, records which wars exist. For each war:
//   start            = w.start as stored by the engine (declareWar: st.tick at declaration; initial wars: 0 or -1)
//   firstSeen        = first tick at whose end the war exists (declaration tick for wars declared during the run)
//   endTick          = tick during which the war disappeared (endWar ran inside that tick's systems)
//   monthsAtEnd      = endTick - start, i.e. the engine's own `months` value on the call that ended the war
//   activeMonthEnds  = endTick - firstSeen, the number of month-end states in which the war existed
//   cause            = the `how` text of the engine's own log entry "<name> ends (…, <how>)." written in endTick
// Usage: npx tsx tools/audit/s0/probe_war_duration.ts <audited checkout> <mode> <seed> <years> > out.json
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const [base, mode, seedS, yearsS] = process.argv.slice(2);
if (!base || !mode || !seedS || !yearsS) throw new Error('usage: probe_war_duration.ts <checkout> <mode> <seed> <years>');
const imp = (p: string) => import(pathToFileURL(join(base, p)).href);
const { loadNodeData } = await imp('src/engine/node.ts');
loadNodeData(base);
const { createGame } = await imp('src/engine/init.ts');
const sim = await imp('src/engine/simulation.ts');

interface W { id: string; name: string; start: number; historicalSeed: boolean }
const st = createGame({ mode, seed: Number(seedS), player: null });
const order = sim.SYSTEMS.map((s: { name: string }) => s.name);
const seen = new Map<string, { w: W; firstSeen: number }>();
for (const w of st.wars as (W & { historicalSeed?: boolean })[]) seen.set(w.id, { w: { id: w.id, name: w.name, start: w.start, historicalSeed: !!w.historicalSeed }, firstSeen: 0 });
const ended: Record<string, unknown>[] = [];
const ticks = Number(yearsS) * 12;
for (let i = 0; i < ticks; i++) {
  const before = new Set<string>((st.wars as W[]).map((w) => w.id));
  sim.stepMonth(st);
  const now = new Map<string, W & { historicalSeed?: boolean }>((st.wars as (W & { historicalSeed?: boolean })[]).map((w) => [w.id, w]));
  for (const [id, w] of now) if (!seen.has(id)) seen.set(id, { w: { id, name: w.name, start: w.start, historicalSeed: !!w.historicalSeed }, firstSeen: st.tick });
  for (const id of before) if (!now.has(id)) {
    const s = seen.get(id)!;
    const entry = (st.log as { tick: number; type: string; text: string }[]).filter((l) => l.tick === st.tick && l.type === 'war' && l.text.startsWith(`${s.w.name} ends (`)).at(-1);
    const cause = entry ? entry.text.slice(entry.text.lastIndexOf(', ') + 2).replace(/\)\.$/, '') : 'no matching log entry';
    ended.push({ ...s.w, firstSeen: s.firstSeen, endTick: st.tick, monthsAtEnd: st.tick - s.w.start, activeMonthEnds: st.tick - s.firstSeen, cause });
  }
}
const declared = ended.filter((e) => !e.historicalSeed);
const byCause: Record<string, number> = {};
for (const e of ended) byCause[e.cause as string] = (byCause[e.cause as string] ?? 0) + 1;
const exhaustion = ended.filter((e) => e.cause === 'exhaustion after twelve years');
const still = (st.wars as (W & { historicalSeed?: boolean })[]).map((w) => ({ id: w.id, name: w.name, start: w.start, historicalSeed: !!w.historicalSeed, monthsAtLastTick: st.tick - w.start }));
console.log(JSON.stringify({
  schema: 's0-probe-war-duration-v1',
  scenario: { mode, seed: Number(seedS), years: Number(yearsS), final_tick: st.tick },
  system_order: order,
  facts: {
    wars_seen: seen.size, wars_ended: ended.length, wars_active_at_final_tick: still.length,
    declared_wars_with_firstSeen_equal_start: declared.filter((e) => e.firstSeen === e.start).length, declared_wars_ended: declared.length,
    initial_wars: [...seen.values()].filter((s) => s.w.historicalSeed).map((s) => ({ id: s.w.id, name: s.w.name, start: s.w.start })),
    ended_by_cause: byCause,
    max_monthsAtEnd: ended.reduce((m, e) => Math.max(m, e.monthsAtEnd as number), 0),
    max_activeMonthEnds: ended.reduce((m, e) => Math.max(m, e.activeMonthEnds as number), 0),
    exhaustion_rule_wars: exhaustion.map((e) => ({ name: e.name, start: e.start, endTick: e.endTick, monthsAtEnd: e.monthsAtEnd, activeMonthEnds: e.activeMonthEnds })),
    wars_over_144_monthsAtEnd: ended.filter((e) => (e.monthsAtEnd as number) > 144).length,
    wars_over_145_monthsAtEnd: ended.filter((e) => (e.monthsAtEnd as number) > 145).length,
  },
  ended,
  active_at_final_tick: still,
}, null, 2));
