// S0-B3 audit probe (not product code; read-only). Explains, on the audited checkout, why some tests executed zero or
// almost zero assertions in the assertion-count run. It replays the exact scenarios the tests use and records the
// facts those tests depend on. Usage: npx tsx tools/audit/s0/probe_empty_pass.ts <audited checkout> > out.json
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const base = process.argv[2];
if (!base) throw new Error('usage: probe_empty_pass.ts <audited checkout>');
const imp = (p: string) => import(pathToFileURL(join(base, p)).href);

const { loadNodeData } = await imp('src/engine/node.ts');
loadNodeData(base);
const { createGame } = await imp('src/engine/init.ts');
const { stepMonth } = await imp('src/engine/simulation.ts');

// Same scenario as tests/simulation.test.ts "AI does not get stuck…": run('sandbox', 1, 40) without player.
const st = createGame({ mode: 'sandbox', seed: 1, player: null });
const warStart = new Map<string, number>();
const ended: { id: string; months: number }[] = [];
let maxActiveWars = 0;
for (let i = 0; i < 40 * 12; i++) {
  const before = new Set<string>(st.wars.map((w: { id: string }) => w.id));
  for (const w of st.wars) if (!warStart.has(w.id)) warStart.set(w.id, w.start);
  stepMonth(st);
  const after = new Set<string>(st.wars.map((w: { id: string }) => w.id));
  for (const w of st.wars) if (!warStart.has(w.id)) warStart.set(w.id, w.start);
  for (const id of before) if (!after.has(id)) ended.push({ id, months: st.tick - (warStart.get(id) ?? st.tick) });
  maxActiveWars = Math.max(maxActiveWars, st.wars.length);
}

// Law history: pairs in the same group within 180 ticks (the only pairs the law-flip test inspects).
let lawEntries = 0, closePairs = 0, flipBacks = 0;
for (const c of Object.values<any>(st.countries)) {
  const h = c.ai.lawHistory as { group: string; value: string; tick: number }[];
  lawEntries += h.length;
  for (let i = 0; i < h.length; i++) for (let j = i + 1; j < h.length; j++) if (h[i].group === h[j].group && h[j].tick - h[i].tick < 180) {
    closePairs++;
    const before = h.slice(0, i).filter((x) => x.group === h[i].group).at(-1)?.value;
    if (h[j].value === before && !!before) flipBacks++;
  }
}

// Identity pack: non-portrait assets shipped for linked entities of kind people/region/period.
const pack = JSON.parse(readFileSync(join(base, 'public/content/registry.json'), 'utf8'));
const links = JSON.parse(readFileSync(join(base, 'historical_data/identity/wikidata_links.json'), 'utf8'));
const kinds = ['people', 'region', 'period'];
const targeted = Object.entries<any>(links.links).filter(([, l]) => l.linked && kinds.includes(l.kind)).map(([id]) => id);
const targetedAssets = pack.assets.filter((a: any) => targeted.includes(a.entity) && a.type !== 'portrait');

console.log(JSON.stringify({
  scenario: "run('sandbox', 1, 40) as in tests/simulation.test.ts",
  final_tick: st.tick,
  wars_active_at_end: st.wars.length,
  wars_ended_during_run: ended.length,
  longest_ended_war_months: ended.reduce((m, w) => Math.max(m, w.months), 0),
  wars_ended_after_more_than_144_months: ended.filter((w) => w.months > 144).length,
  max_simultaneous_wars: maxActiveWars,
  law_history_entries: lawEntries,
  law_pairs_same_group_within_180_ticks: closePairs,
  law_flip_backs_within_180_ticks: flipBacks,
  identity_linked_entities_people_region_period: targeted.length,
  identity_non_portrait_assets_for_them: targetedAssets.length,
}, null, 2));
