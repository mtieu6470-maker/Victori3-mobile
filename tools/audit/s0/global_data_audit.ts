// S0-B3 audit tool (not product code; read-only). Global data audit of an audited checkout (G0.5): for each of the
// 12 macro-regions of the project specification, how much of the entity and map-region data is sourced, estimated,
// default (no researched value; the engine derives one) or missing (explicit 'missing' label; a fallback value is used).
// Macro-region assignment reuses the checkout's own tools/audit/regions.ts (capital, else mean of owned regions, else
// a fixed location). Usage: npx tsx tools/audit/s0/global_data_audit.ts <checkout> <out.json>
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const [base, out] = process.argv.slice(2);
if (!base || !out) throw new Error('usage: global_data_audit.ts <checkout> <out.json>');
const db = JSON.parse(readFileSync(join(base, 'src/generated/db.json'), 'utf8'));
const { MACRO_REGIONS, macroRegion, classify } = await import(pathToFileURL(join(base, 'tools/audit/regions.ts')).href);

type Cat = 'sourced' | 'estimated' | 'default' | 'missing' | 'labelled_without_source';
const CATS: Cat[] = ['sourced', 'estimated', 'default', 'missing', 'labelled_without_source'];
/** Classify one field. `f` absent → default; quality verified/supported needs ≥1 source to count as sourced. */
function cat(f: any): Cat {
  if (f == null || typeof f !== 'object' || !('quality' in f)) return 'default';
  const q = f.quality;
  if (q === 'missing') return 'missing';
  if (q === 'estimated' || q === 'uncertain') return 'estimated';
  if (q === 'verified' || q === 'supported') return Array.isArray(f.sources) && f.sources.length > 0 ? 'sourced' : 'labelled_without_source';
  return 'default';
}
const zero = () => Object.fromEntries(CATS.map((c) => [c, 0])) as Record<Cat, number>;

const FIELDS: Record<string, (e: any) => any> = {
  population: (e) => e.population,
  head_of_state: (e) => e.head_of_state,
  army: (e) => e.army,
  literacy: (e) => e.literacy,
  laws: (e) => e.laws,
  gdp_pc_1836: (e) => db.gdp_pc_1836[e.id],
};

const regions: Record<string, any> = {};
for (const m of MACRO_REGIONS) regions[m.id] = {
  name_vi: m.vi, entities: 0, by_kind: {}, by_model: {}, fields: Object.fromEntries(Object.keys(FIELDS).map((k) => [k, zero()])),
  industrialization_researched: 0, research_completeness_sum: 0,
  map_regions: 0, map_region_pop_quality: { verified: 0, supported: 0, estimated: 0, uncertain: 0, missing: 0 },
  map_population_total: 0, map_population_by_quality: { verified: 0, supported: 0, estimated: 0, uncertain: 0, missing: 0 },
};
const unassigned: string[] = [];
const labelledWithoutSource: string[] = [];

for (const e of db.entities) {
  let mr: string;
  try { mr = macroRegion(db, e); } catch { unassigned.push(e.id); continue; }
  const R = regions[mr];
  R.entities++;
  R.by_kind[e.kind] = (R.by_kind[e.kind] ?? 0) + 1;
  const model = String(e.model).startsWith('part_of:') ? 'part_of' : e.model;
  R.by_model[model] = (R.by_model[model] ?? 0) + 1;
  for (const [k, get] of Object.entries(FIELDS)) {
    const c = cat(get(e));
    R.fields[k][c]++;
    if (c === 'labelled_without_source') labelledWithoutSource.push(`${e.id}.${k}`);
  }
  if (e.industrialization) R.industrialization_researched++;
  R.research_completeness_sum += typeof e.research_completeness === 'number' ? e.research_completeness : 0;
}
for (const r of db.regions) {
  const R = regions[classify(r.lat, r.lon)];
  R.map_regions++;
  R.map_region_pop_quality[r.pop_quality]++;
  R.map_population_total += r.pop;
  R.map_population_by_quality[r.pop_quality] += r.pop;
}
for (const R of Object.values<any>(regions)) {
  R.research_completeness_mean = R.entities ? +(R.research_completeness_sum / R.entities).toFixed(3) : null;
  delete R.research_completeness_sum;
}

const totals = { entities: db.entities.length, assigned: db.entities.length - unassigned.length, map_regions: db.regions.length };
writeFileSync(out, JSON.stringify({
  schema: 's0-global-data-audit-v1',
  db_meta: { built_at_excluded: true, version: db.meta.version, start_date: db.meta.start_date, counts: db.meta.counts },
  categories: {
    sourced: "quality 'verified' or 'supported' with at least one source",
    estimated: "quality 'estimated' or 'uncertain' (method recorded; not counted as sourced)",
    default: 'no researched value for the field; the engine derives a default',
    missing: "explicit quality 'missing'; a fallback value is used",
    labelled_without_source: "quality 'verified'/'supported' but no source listed (inconsistent label)",
  },
  totals, unassigned_entities: unassigned, labelled_without_source: labelledWithoutSource,
  not_classifiable: ['region culture/religion/terrain/resources (no quality labels in db.json)', 'entity tech_level and government (no quality labels)'],
  regions,
}, null, 2) + '\n');
console.log(`entities ${totals.entities} (assigned ${totals.assigned}, unassigned ${unassigned.length}); map regions ${totals.map_regions}; labelled-without-source ${labelledWithoutSource.length}`);
