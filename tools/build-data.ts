/**
 * build-data: validates historical_data/ and compiles src/generated/db.json for the engine.
 * Validation errors abort the build; warnings are printed and recorded in the coverage section.
 */
import fs from 'node:fs';
import path from 'node:path';
import type {
  HistoricalDB, EntityRecord, RegionRecord, Fact, Quality, Laws, SectionStatus, Personality, StrategicPriority, SourceRef,
} from '../src/engine/data/dbTypes';
import { LAW_GROUPS, QUALITY_ORDER } from '../src/engine/data/dbTypes';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HD = path.join(ROOT, 'historical_data');
const OUT = path.join(ROOT, 'src', 'generated');
const START = '1836-01-01';

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);
const readJson = (rel: string): any => JSON.parse(fs.readFileSync(path.join(HD, rel), 'utf8'));

// ---------------------------------------------------------------- sources
const sourcesFile = readJson('sources/sources.json');
const sources: HistoricalDB['sources'] = sourcesFile.sources;
const sourceIds = new Set(sources.map((s) => s.id));
const usedSources = new Set<string>();
function normRefs(refs: unknown, where: string): SourceRef[] {
  if (!refs) return [];
  if (!Array.isArray(refs)) { err(`${where}: sources must be an array`); return []; }
  return refs.map((r) => {
    const ref: SourceRef = typeof r === 'string' ? { id: r } : (r as SourceRef);
    if (!sourceIds.has(ref.id)) err(`${where}: unknown source id '${ref.id}'`);
    usedSources.add(ref.id);
    return ref;
  });
}
const QUAL = new Set<Quality>(QUALITY_ORDER);
function checkQuality(q: unknown, where: string): Quality {
  if (!QUAL.has(q as Quality)) { err(`${where}: invalid quality '${String(q)}'`); return 'missing'; }
  return q as Quality;
}
const worst = (a: Quality | null, b: Quality): Quality => (a === null || QUALITY_ORDER.indexOf(b) > QUALITY_ORDER.indexOf(a) ? b : a);

// ---------------------------------------------------------------- cultures
const cultFile = readJson('population/cultures.json');
const cultureIds = new Set<string>(cultFile.cultures.map((c: any) => c.id));
const religionIds = new Set<string>(cultFile.religions.map((r: any) => r.id));

// ---------------------------------------------------------------- registry
const registry = readJson('political_entities/registry.json');
const regEntities: any[] = registry.entities;
const regById = new Map<string, any>();
for (const e of regEntities) {
  if (regById.has(e.id)) err(`registry: duplicate id ${e.id}`);
  regById.set(e.id, e);
}

// ---------------------------------------------------------------- regions (CSV)
const TERRAIN = new Set(['pl', 'hi', 'mo', 'fo', 'de', 'st', 'ju', 'tu', 'ma', 'sa']);
const RES = new Set(['grain', 'live', 'cott', 'cash', 'opium', 'timb', 'coal', 'iron', 'gold', 'silv', 'fish', 'lux']);
const csv = fs.readFileSync(path.join(HD, 'borders/regions_1836.csv'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
const header = csv[0].split(';');
const regions: RegionRecord[] = [];
const regionById = new Map<string, RegionRecord>();
const dzGroupOf = new Map<string, string>();
for (const line of csv.slice(1)) {
  const cols = line.split(';');
  if (cols.length < header.length - 1) { err(`regions: malformed line '${line.slice(0, 60)}'`); continue; }
  const o: Record<string, string> = {};
  header.forEach((h, i) => (o[h] = (cols[i] ?? '').trim()));
  const where = `region ${o.id}`;
  if (regionById.has(o.id)) err(`${where}: duplicate`);
  let owner = o.owner;
  if (owner.startsWith('DZ:')) {
    const group = owner.slice(3);
    if (!regById.has(group)) err(`${where}: unknown DZ group ${group}`);
    dzGroupOf.set(o.id, group);
    owner = o.id; // each decentralized region is its own polity
  } else if (!regById.has(owner)) err(`${where}: unknown owner ${owner}`);
  if (o.controller && !regById.has(o.controller)) err(`${where}: unknown controller ${o.controller}`);
  if (!cultureIds.has(o.culture)) err(`${where}: unknown culture ${o.culture}`);
  if (o.culture2 && !cultureIds.has(o.culture2)) err(`${where}: unknown culture2 ${o.culture2}`);
  if (!religionIds.has(o.religion)) err(`${where}: unknown religion ${o.religion}`);
  if (o.religion2 && !religionIds.has(o.religion2)) err(`${where}: unknown religion2 ${o.religion2}`);
  if (!TERRAIN.has(o.terrain)) err(`${where}: unknown terrain ${o.terrain}`);
  const res = o.res ? o.res.split('|').filter(Boolean) : [];
  for (const r of res) if (!RES.has(r)) err(`${where}: unknown resource ${r}`);
  const lat = Number(o.lat), lon = Number(o.lon);
  if (!(lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180)) err(`${where}: bad coordinates`);
  const rec: RegionRecord = {
    id: o.id, name: o.name, lat, lon, owner, controller: o.controller || null,
    culture: o.culture, culture2: o.culture2 || null, c2: Number(o.c2) || 0,
    religion: o.religion, religion2: o.religion2 || null, r2: Number(o.r2) || 0,
    terrain: o.terrain, pop: Number(o.pop_k) * 1000, pop_quality: 'missing', pop_group: null, res, note: o.note || undefined,
  };
  regions.push(rec);
  regionById.set(rec.id, rec);
}

// ---------------------------------------------------------------- population normalisation
const popTotals = readJson('population/population_totals_1836.json');
const covered = new Map<string, string>();
const groupFacts: Record<string, Fact<number>> = {};
for (const g of popTotals.groups) {
  const sel = g.select ?? {};
  const owners: string[] = sel.owners ?? [];
  const set = new Set<string>(regions.filter((r) => owners.includes(r.owner)).map((r) => r.id));
  for (const id of sel.regions ?? []) { if (!regionById.has(id)) err(`pop group ${g.id}: unknown region ${id}`); set.add(id); }
  for (const id of sel.exclude ?? []) { if (!regionById.has(id)) err(`pop group ${g.id}: unknown excluded region ${id}`); set.delete(id); }
  if (set.size === 0) err(`pop group ${g.id}: selects no regions`);
  const q = checkQuality(g.quality, `pop group ${g.id}`);
  const refs = normRefs(g.sources, `pop group ${g.id}`);
  const weights = [...set].reduce((s, id) => s + regionById.get(id)!.pop, 0);
  for (const id of set) {
    if (covered.has(id)) err(`region ${id} covered by two population groups (${covered.get(id)}, ${g.id})`);
    covered.set(id, g.id);
    const r = regionById.get(id)!;
    r.pop = Math.round((r.pop / weights) * g.value);
    r.pop_quality = q;
    r.pop_group = g.id;
  }
  groupFacts[g.id] = { value: g.value, quality: q, sources: refs, range: g.range, method: g.method, note: g.note, alternatives: g.alternatives };
}
for (const r of regions) if (!covered.has(r.id)) r.pop_quality = 'missing'; // keeps provisional weight as gameplay fallback

// ---------------------------------------------------------------- profiles
const presets = readJson('countries/_law_presets.json');
const lawValues: Record<string, string[]> = presets.law_groups;
function checkLaws(laws: any, where: string) {
  for (const g of LAW_GROUPS) {
    if (!laws || !laws[g]) err(`${where}: missing law group ${g}`);
    else if (!lawValues[g].includes(laws[g])) err(`${where}: invalid ${g}='${laws[g]}'`);
  }
}
const detailed = new Map<string, any>();
const core = new Map<string, any>();
for (const f of fs.readdirSync(path.join(HD, 'countries'))) {
  if (!f.endsWith('.json') || f === '_law_presets.json') continue;
  const j = readJson(`countries/${f}`);
  if (f.startsWith('_core_profiles')) for (const p of j.profiles) { if (core.has(p.id)) err(`core profile duplicate ${p.id}`); core.set(p.id, p); }
  else { if (!regById.has(j.id)) err(`profile ${f}: unknown entity`); detailed.set(j.id, j); }
}

// ---------------------------------------------------------------- CoW extracts
const cowPop = readJson('population/cow_nmc_population.json').records;
const cowMil = readJson('military/cow_nmc_military.json').records;
const cowInd = readJson('economy/cow_nmc_industry.json').records;
const benchmarks: HistoricalDB['benchmarks'] = [];
for (const r of [...cowPop, ...cowMil, ...cowInd]) {
  if (!r.entity) continue;
  if (['population.total', 'military.personnel', 'economy.iron_steel_kt', 'economy.primary_energy_kt_coal_eq'].includes(r.field))
    benchmarks.push({ entity: r.entity, field: r.field, date: r.date, value: r.value, quality: r.quality });
}
const cowMil1836 = new Map<string, any>(cowMil.filter((r: any) => r.date === '1836' && r.field === 'military.personnel').map((r: any) => [r.entity, r]));

// GDP per capita 1836 from Maddison (present-day units mapped to 1836 polities).
const madGdp = readJson('economy/maddison_2010_gdp.json').records as any[];
const madPop = readJson('population/maddison_2010.json').records as any[];
const gdpUnits: Record<string, Record<string, number>> = {};
for (const r of madGdp) (gdpUnits[r.unit_name] ??= {})[r.date] = r.value;
const popUnits: Record<string, Record<string, number>> = {};
for (const r of madPop) (popUnits[r.unit_name] ??= {})[r.date] = r.value;
function gdpPc1836(unit: string): number | null {
  const u = gdpUnits[unit];
  if (!u) return null;
  if (u['1836']) return u['1836'];
  const a = u['1820'], b = u['1850'] ?? null, c = u['1870'] ?? null;
  if (a && b) return a * Math.pow(b / a, 16 / 30);
  if (a && c) return a * Math.pow(c / a, 16 / 50);
  return a ?? null;
}
const GDP_MAP: Record<string, string[]> = {
  GBR: ['United Kingdom'], FRA: ['France'], SPA: ['Spain'], CAR: ['Spain'], POR: ['Portugal'], NED: ['Netherlands'], BEL: ['Belgium'],
  SWI: ['Switzerland'], DEN: ['Denmark'], SWE: ['Sweden'], NOR: ['Norway'], RUS: ['Finland', 'Czechoslovakia'],
  AUS: ['Austria', 'Czechoslovakia', 'Italy'], GRE: ['Greece'], TUR: ['Turkey', 'Syria', 'Iraq'], EGY: ['Egypt', 'Syria'],
  QNG: ['China'], TIB: ['China'], JAP: ['Japan'], RYU: ['Japan'], KOR: ['South Korea', 'North Korea'], VNM: ['Vietnam'], SIA: ['Thailand'],
  LUA: ['Thailand'], BUR: ['Burma'], EIC: ['India'], HYD: ['India'], NAG: ['India'], AWA: ['India'], GWA: ['India'], HOL: ['India'],
  BRD: ['India'], TRV: ['India'], PRI: ['India'], SIK: ['India'], SND: ['India'], NEP: ['Nepal'], BHU: ['Nepal'], SKM: ['Nepal'],
  PRS: ['Iran'], AFG: ['Iran'], HER: ['Iran'], KAN: ['Iran'], MOR: ['Morocco'], TUN: ['Tunisia'], CON: ['Algeria'], ABD: ['Algeria'],
  USA: ['United States'], TEX: ['United States'], MEX: ['Mexico'], BRA: ['Brazil'], RGS: ['Brazil'], CHL: ['Chile'], VEN: ['Venezuela'],
  MLY: ['Malaysia'], BRN: ['Malaysia'], ACE: ['Indonesia (including Timor until 1999)'], SUL: ['Philippines'],
};
for (const g of ['BAV', 'SAX', 'WUR', 'BAD', 'HKA', 'HDA', 'MSC', 'MST', 'OLD', 'BRU', 'NAS', 'SWM', 'SCG', 'SMN', 'SAA', 'ADE', 'AKO', 'ABE', 'SSO', 'SRU', 'RGR', 'RSC', 'RLE', 'LIP', 'SLI', 'WLD', 'HHO', 'HHE', 'HSI', 'LIE', 'HAM', 'BRE', 'LUB', 'FRK', 'PRU', 'HAN', 'KRA']) GDP_MAP[g] = ['Germany'];
for (const i of ['SAR', 'SIC', 'PAP', 'TUS', 'MOD', 'PMA', 'LUC', 'SMR', 'MCO', 'ION']) GDP_MAP[i] = ['Italy'];
for (const b of ['SER', 'MNT', 'WAL', 'MOL']) GDP_MAP[b] = ['Greece'];
const gdp_pc_1836: Record<string, Fact<number>> = {};
function gdpFact(id: string, kind: string): Fact<number> {
  const units = GDP_MAP[id];
  if (units) {
    let num = 0, den = 0;
    for (const u of units) { const v = gdpPc1836(u); const w = popUnits[u]?.['1820'] ?? 1; if (v) { num += v * w; den += w; } }
    if (den > 0) return {
      value: Math.round(num / den), quality: 'estimated', sources: [{ id: 'maddison_2010', locator: `PerCapita GDP: ${units.join(', ')}` }],
      method: 'Maddison 1990 GK$ for present-day unit(s), geometric interpolation 1820-1850/1870, population-weighted when several units; applied as a proxy for the 1836 polity.',
    };
  }
  const fallback = kind === 'decentralized' ? 400 : 480;
  return { value: fallback, quality: 'missing', sources: [], fallback: true, method: 'No benchmark; gameplay fallback near Maddison minimum subsistence levels (~400-500 GK$).' };
}

// ---------------------------------------------------------------- derived personality (used when a profile has none)
function derivePersonality(laws: Laws | undefined, kind: string): Personality {
  const p: Personality = { aggression: 0.35, expansionism: 0.3, reformism: 0.3, commerce: 0.4, naval: 0.2, isolationism: 0.3, risk: 0.35 };
  if (!laws) return p;
  if (laws.trade === 'isolationism') p.isolationism = 0.85;
  if (laws.trade === 'free_trade') p.commerce = 0.65;
  if (laws.power === 'census_suffrage' || laws.power === 'universal_male_suffrage') p.reformism = 0.5;
  if (laws.power === 'theocracy') { p.reformism = 0.1; p.aggression = 0.45; }
  if (kind === 'decentralized') { p.expansionism = 0.15; p.isolationism = 0.6; p.aggression = 0.3; }
  p.rationale = 'Derived from 1836 institutions (no authored personality).';
  return p;
}

// ---------------------------------------------------------------- entities
const techFile = readJson('technologies/technologies.json');
const tiers = techFile.start_tiers;
const COLORS = ['#8e6c8a', '#6c8e7a', '#8a7a5c', '#5c7a8a', '#9a6a5a', '#6a7a9a', '#7a9a6a', '#9a8a4a', '#4a8a9a', '#a07a8a', '#7aa08a', '#8a8aa0'];
function hashColor(id: string) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; }

const entities: EntityRecord[] = [];
const factsByQuality: Record<Quality, number> = { verified: 0, supported: 0, estimated: 0, uncertain: 0, missing: 0 };
const needsSource: string[] = [];
const gaps: HistoricalDB['coverage']['gaps'] = [];
const countFact = (q: Quality) => (factsByQuality[q] += 1);

function sectionStatus(name: string, obj: any): SectionStatus {
  if (!obj || (typeof obj === 'object' && Object.keys(obj).length === 0)) return { section: name, status: 'missing', facts: 0, worst_quality: null };
  let facts = 0; let wq: Quality | null = null;
  const walk = (o: any) => {
    if (!o || typeof o !== 'object') return;
    if ('quality' in o && 'value' in o) { facts++; const q = o.quality as Quality; if (QUAL.has(q)) { wq = worst(wq, q); countFact(q); } if (o.needs_source) needsSource.push(name); return; }
    for (const v of Object.values(o)) walk(v);
  };
  walk(obj);
  return { section: name, status: facts >= 2 ? 'complete' : facts === 1 ? 'partial' : 'missing', facts, worst_quality: wq };
}

const playableOrPlaceholder = (e: any) => e.model === 'playable';
const decentralizedRegions = regions.filter((r) => dzGroupOf.has(r.id));
const allEntityIds = new Set<string>();

function buildEntity(reg: any, isDZ: boolean, dzRegion?: RegionRecord): EntityRecord {
  const id = isDZ ? dzRegion!.id : reg.id;
  const det = detailed.get(id);
  const cp = core.get(id);
  let laws: Laws | undefined; let lawsQ: Quality = 'missing'; let lawsSrc: SourceRef[] = []; let lawsNote: string | undefined;
  let hos: Fact<any> | undefined; let personality: Personality | undefined; let priorities: StrategicPriority[] = [];
  let relations: { with: string; value: number }[] = []; let claims: string[] = []; let government: string | undefined; let heir: any = null;
  let army: Fact<number> | undefined; let literacy: Fact<number> | undefined; let industrialization: string | undefined; let techLevel = 'pre_industrial';
  let profileSections: SectionStatus[] = [];
  const where = `entity ${id}`;
  if (det) {
    const pol = det.political ?? {};
    laws = pol.laws?.value; lawsQ = checkQuality(pol.laws?.quality, `${where} laws`); lawsSrc = normRefs(pol.laws?.sources, `${where} laws`); lawsNote = pol.laws?.note;
    if (pol.head_of_state) hos = { ...pol.head_of_state, quality: checkQuality(pol.head_of_state.quality, `${where} hos`), sources: normRefs(pol.head_of_state.sources, `${where} hos`) };
    government = pol.government?.value; heir = pol.heir?.value ?? null;
    personality = det.personality; priorities = det.historical_ai?.strategic_priorities ?? [];
    relations = det.diplomacy?.relations ?? []; claims = (det.territory?.claims ?? []).map((c: any) => c.region);
    if (det.military?.army_personnel) army = { ...det.military.army_personnel, sources: normRefs(det.military.army_personnel.sources, `${where} army`) };
    if (det.society?.literacy) literacy = { ...det.society.literacy, sources: normRefs(det.society.literacy.sources, `${where} literacy`) };
    industrialization = det.economy?.industrialization_stage?.value;
    techLevel = det.technology?.level?.value ?? 'behind_frontier';
    for (const sec of ['political', 'territory', 'economy', 'society', 'diplomacy', 'military', 'technology', 'historical_ai']) profileSections.push(sectionStatus(sec, det[sec]));
    // walk all nested facts for source validation
    const walkSrc = (o: any, p: string) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o.sources)) normRefs(o.sources, p); for (const [k, v] of Object.entries(o)) if (k !== 'sources') walkSrc(v, `${p}.${k}`); };
    walkSrc(det, where);
  } else if (cp) {
    government = cp.government;
    if (cp.laws) { laws = cp.laws; lawsQ = checkQuality(cp.laws_q ?? 'estimated', `${where} laws`); }
    else if (cp.preset) {
      const base = presets.presets[cp.preset];
      if (!base) err(`${where}: unknown preset ${cp.preset}`);
      laws = { ...base, ...(cp.law_overrides ?? {}) }; lawsQ = 'estimated'; lawsNote = `Preset '${cp.preset}' with overrides (interpretive mapping).`;
    }
    lawsSrc = normRefs(cp.sources, `${where} sources`);
    hos = { value: cp.hos ?? null, quality: checkQuality(cp.hos_q ?? (cp.hos ? 'supported' : 'missing'), `${where} hos`), sources: lawsSrc };
    personality = cp.personality; priorities = cp.priorities ?? []; relations = cp.relations ?? [];
    if (cp.army) army = { ...cp.army, sources: normRefs(cp.army.sources, `${where} army`) };
    const sec = (n: string, has: boolean): SectionStatus => ({ section: n, status: has ? 'partial' : 'missing', facts: has ? 1 : 0, worst_quality: has ? lawsQ : null });
    profileSections = [sec('political', true), sec('territory', true), sec('economy', false), sec('society', false), sec('diplomacy', relations.length > 0), sec('military', !!army), sec('technology', false), sec('historical_ai', priorities.length > 0)];
    countFact(lawsQ); countFact(hos.quality);
  } else {
    const base = presets.presets['decentralized'];
    laws = { ...base }; lawsQ = 'estimated'; lawsNote = 'Decentralized polity: generic preset (not individually researched).';
    hos = { value: null, quality: 'missing', sources: [] };
    profileSections = ['political', 'territory', 'economy', 'society', 'diplomacy', 'military', 'technology', 'historical_ai'].map((s) => ({ section: s, status: 'missing' as const, facts: 0, worst_quality: null }));
    gaps.push({ entity: id, section: 'all', note: isDZ ? `Placeholder polity in group ${dzGroupOf.get(id)}: not individually researched.` : 'No profile.' });
  }
  if (laws) checkLaws(laws, where);
  for (const pr of priorities) { normRefs(pr.sources, `${where} priority ${pr.id}`); if (!pr.window || pr.window.length !== 2) err(`${where} priority ${pr.id}: window`); }
  for (const r of relations) if (!regById.has(r.with)) err(`${where}: relation with unknown ${r.with}`);
  for (const c of claims) if (!regionById.has(c)) err(`${where}: claim on unknown region ${c}`);
  // army fallback from CoW
  const cm = cowMil1836.get(id);
  if (cm && !army) army = { value: cm.value, quality: cm.quality, sources: cm.sources };
  // population fact
  const myRegions = regions.filter((r) => r.owner === id);
  const pop = myRegions.reduce((s, r) => s + r.pop, 0);
  // Quality of an entity total = worst quality among sources covering >= 5% of its population.
  let popQ: Quality | null = null; const popSrc: SourceRef[] = []; const groupsUsed = new Set<string>();
  const byQ = new Map<Quality, number>();
  for (const r of myRegions) { byQ.set(r.pop_quality, (byQ.get(r.pop_quality) ?? 0) + r.pop); if (r.pop_group) groupsUsed.add(r.pop_group); }
  for (const [q, v] of byQ) if (pop > 0 && v / pop >= 0.05) popQ = worst(popQ, q);
  const uncoveredShare = pop > 0 ? (byQ.get('missing') ?? 0) / pop : 1;
  for (const g of groupsUsed) popSrc.push(...groupFacts[g].sources);
  const popFact: Fact<number> = { value: pop, quality: popQ ?? 'missing', sources: popSrc, fallback: popQ === 'missing' || undefined,
    method: groupsUsed.size ? `Sum of regions normalised to benchmark group(s): ${[...groupsUsed].join(', ')}; ${(uncoveredShare * 100).toFixed(1)}% of the population has no benchmark (provisional weights).` : 'Provisional allocation weights only (no benchmark): gameplay fallback.' };
  countFact(popFact.quality);
  if (popFact.quality === 'missing' && myRegions.length) gaps.push({ entity: id, section: 'society', note: 'Population has no benchmark (fallback weights).' });
  if (!literacy) gaps.push({ entity: id, section: 'society', note: 'Literacy not researched (derived default used in simulation).' });
  // tech level from tier/industrialization
  if (!det) techLevel = reg?.tier === 'B' ? 'behind_frontier' : 'pre_industrial';
  if (['NED', 'SWI', 'SAX', 'BEL'].includes(id)) techLevel = 'advanced';
  const completeness = profileSections.reduce((s, x) => s + (x.status === 'complete' ? 1 : x.status === 'partial' ? 0.5 : 0), 0) / profileSections.length;
  const kind = isDZ ? 'decentralized' : reg.kind;
  return {
    id, en: isDZ ? dzRegion!.name : reg.en, vi: isDZ ? dzRegion!.name : reg.vi, kind, tier: isDZ ? 'D' : reg.tier, model: isDZ ? 'placeholder' : reg.model,
    overlord: isDZ ? undefined : reg.overlord, subject_type: isDZ ? undefined : reg.subject_type, cow: reg?.cow, capital: isDZ ? id : reg.capital,
    color: isDZ ? '#9c9483' : reg.color ?? hashColor(id), hist_from: reg?.hist_from, hist_to: reg?.hist_to, note: isDZ ? dzRegion!.note : reg.note,
    group: isDZ ? dzGroupOf.get(id) : undefined, government,
    head_of_state: hos, heir, laws: laws ? { value: laws, quality: lawsQ, sources: lawsSrc, note: lawsNote } : undefined,
    personality: personality ?? derivePersonality(laws, kind), personality_source: personality ? 'profile' : 'derived',
    priorities, relations, claims, population: popFact, army, literacy, industrialization, tech_level: techLevel,
    profile_sections: profileSections, research_completeness: Math.round(completeness * 100) / 100,
    profile: det ?? cp ?? null,
  };
}

for (const reg of regEntities) {
  if (reg.model === 'placeholder') continue; // DZ groups are expanded per region below
  const e = buildEntity(reg, false);
  if (reg.model === 'playable' && !regions.some((r) => r.owner === reg.id || r.controller === reg.id)) err(`entity ${reg.id}: playable but owns/controls no region`);
  if (reg.capital && !regionById.has(reg.capital)) err(`entity ${reg.id}: capital ${reg.capital} unknown`);
  else if (reg.capital && reg.model === 'playable' && regionById.get(reg.capital)!.owner !== reg.id && regionById.get(reg.capital)!.controller !== reg.id) err(`entity ${reg.id}: capital not owned`);
  if (reg.overlord && !regById.has(reg.overlord)) err(`entity ${reg.id}: unknown overlord`);
  entities.push(e); allEntityIds.add(e.id);
  if (reg.model === 'playable' && !detailed.has(reg.id) && !core.has(reg.id)) warn(`entity ${reg.id}: playable without profile`);
}
for (const r of decentralizedRegions) { const reg = regById.get(dzGroupOf.get(r.id)!); const e = buildEntity(reg, true, r); entities.push(e); allEntityIds.add(e.id); }
for (const e of entities) gdp_pc_1836[e.id] = gdpFact(e.id, e.kind);

// start techs
const start_techs: Record<string, string[]> = {};
for (const e of entities) {
  const lvl = e.tech_level in tiers ? e.tech_level : 'pre_industrial';
  start_techs[e.id] = [...new Set([...(tiers[lvl] as string[]), ...((tiers.overrides[e.id] as string[]) ?? [])])];
}
const techIds = new Set(techFile.technologies.map((t: any) => t.id));
// CO-1b: company kinds (generated from CG-32 by tools/data/build_company_kinds.py)
const companyKindsFile = readJson('companies/company_kinds.json');
const BUILDING_IDS = new Set(['plantation', 'mine', 'logging', 'textile_mill', 'ironworks', 'tool_works', 'arms_works', 'luxury_workshop', 'railway', 'university']);
for (const k of companyKindsFile.kinds) {
  if (!Array.isArray(k.unlocked_by) || !k.unlocked_by.length) err(`company kind ${k.id}: no unlocking technology`);
  for (const t of k.unlocked_by ?? []) if (!techIds.has(t)) err(`company kind ${k.id}: unknown technology ${t}`);
  for (const b of k.buildings ?? []) if (!BUILDING_IDS.has(b)) err(`company kind ${k.id}: unknown building ${b}`);
  for (const r of k.rights ?? []) if (r.active) err(`company kind ${k.id}: right ${r.id} active without a legal basis (CG-30)`);
}
for (const [id, list] of Object.entries(start_techs)) for (const t of list) if (!techIds.has(t)) err(`start tech ${t} for ${id} unknown`);
// IND-01 PM-1: production methods
const pmFile = readJson('production/production_methods.json');
const GOOD_IDS = new Set(['grain', 'cash_crops', 'cotton', 'timber', 'coal', 'iron', 'steel', 'textiles', 'tools', 'arms', 'luxury', 'opium']);
for (const [b, list] of Object.entries<any[]>(pmFile.methods)) {
  if (!BUILDING_IDS.has(b)) err(`production method building ${b} unknown`);
  if (!list.some((m) => !m.requires.length)) err(`production methods for ${b}: no method without requirements`);
  for (const m of list) {
    for (const t of m.requires) if (!techIds.has(t)) err(`production method ${b}/${m.id}: unknown technology ${t}`);
    for (const [g, q] of Object.entries(m.inputs)) if (!GOOD_IDS.has(g) || !(typeof q === 'number' && q >= 0)) err(`production method ${b}/${m.id}: bad input ${g}`);
  }
}
// WW-01b: historical world wars (generated from CG-40 by tools/data/build-world-wars.ts)
const wwFile = readJson('wars/world_wars.json');
for (const w of wwFile.wars) for (const side of w.sides) for (const m of side.members) {
  if (!regions.some((r: any) => r.id === m.capitalRegion)) err(`world war ${w.id}: unknown capital region ${m.capitalRegion}`);
  if (!(m.entry <= m.exit)) err(`world war ${w.id}: ${m.id} exits before it enters`);
}
// BLOC-01: Cold War blocs (curated; CG-46 extends)
const blocsFile = readJson('diplomacy/blocs.json');
for (const b of blocsFile.blocs) for (const m of b.members) {
  if (!regions.some((r: any) => r.id === m.capital)) err(`bloc ${b.id}: unknown capital region ${m.capital}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.from) || (m.to && !/^\d{4}-\d{2}-\d{2}$/.test(m.to))) err(`bloc ${b.id}: bad date for ${m.name}`);
}
// WW-01c: unifications and peace settlements (curated; treaty facts from CG-40/CG-41)
const settlementsFile = readJson('wars/settlements.json');
const STEP_TYPES = new Set(['cede', 'annex_states', 'new_state', 'rename', 'move_capital', 'restore_snapshot', 'make_subject', 'release']);
for (const s of settlementsFile.settlements) {
  const regionIds = [s.actor, ...(s.losers ?? []), ...(s.winners ?? []), ...s.steps.flatMap((x: any) => [...(x.regions ?? []), ...(x.capitals ?? []), x.from, x.to, x.target].filter(Boolean))].filter(Boolean);
  for (const id of regionIds) if (!regions.some((r: any) => r.id === id)) err(`settlement ${s.id}: unknown region ${id}`);
  for (const x of s.steps) if (!STEP_TYPES.has(x.type)) err(`settlement ${s.id}: unknown step ${x.type}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date)) err(`settlement ${s.id}: bad date`);
}
// LEAD-01: 20th-century leaders (generated from CG-43 by tools/data/build-leaders20.ts)
const leaders20File = readJson('leaders/leaders_20c.json');
for (const l of leaders20File.leaders) {
  if (!regions.some((r: any) => r.id === l.capitalRegion)) err(`leaders_20c ${l.name}: unknown capital region ${l.capitalRegion}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(l.from) || (l.to && !/^\d{4}-\d{2}-\d{2}$/.test(l.to))) err(`leaders_20c ${l.name}: bad date`);
  if (l.role !== 'head_of_state' && l.role !== 'effective_leader') err(`leaders_20c ${l.name}: bad role`);
}
// REGIME-01a: Historical Mode regime changes (generated from CG-41 by tools/data/build-regimes.ts)
const regimeFile = readJson('history/regime_changes.json');
for (const e of regimeFile.events) {
  if (!regions.some((r: any) => r.id === e.capitalRegion)) err(`regime change ${e.id}: unknown capital region ${e.capitalRegion}`);
  for (const id of [...(e.independenceRegions ?? []), ...(e.allies ?? [])]) if (!regions.some((r: any) => r.id === id)) err(`regime change ${e.id}: unknown region ${id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) err(`regime change ${e.id}: bad date`);
}
// DECOL-01: Historical Mode independence events (generated from CG-37 by tools/data/build-decolonisation.ts)
const decolFile = readJson('decolonisation/independence.json');
const regionIdSet = new Set(regions.map((r: any) => r.id));
for (const rec of decolFile.records) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rec.date)) err(`independence ${rec.id}: bad date ${rec.date}`);
  for (const r of rec.regions) if (!regionIdSet.has(r)) err(`independence ${rec.id}: unknown region ${r}`);
  if (!rec.source) err(`independence ${rec.id}: no source`);
}
// TECH-02: Historical Mode technology adoption windows (documented political blocks only)
const adoptionWindows = readJson('technologies/adoption_windows.json').windows as { country: string; tech: string; earliest: number; block: string }[];
for (const w of adoptionWindows) {
  if (!techIds.has(w.tech)) err(`adoption window: unknown technology ${w.tech}`);
  if (!Number.isInteger(w.earliest) || w.earliest < 1836 || w.earliest > 2026) err(`adoption window ${w.country}/${w.tech}: bad year`);
  if (!w.block) err(`adoption window ${w.country}/${w.tech}: no documented block`);
}
for (const t of techFile.technologies) for (const p of t.prereqs) if (!techIds.has(p)) err(`tech ${t.id}: unknown prereq ${p}`);

// ---------------------------------------------------------------- alliances active on start date (CoW)
const allianceFile = readJson('diplomacy/cow_alliances_1816_1914.json');
const alliances: HistoricalDB['alliances'] = [];
for (const a of allianceFile.records) {
  if ((a.start ?? '9999') > START || (a.end ?? '9999') < START) continue;
  const members = [...new Set<string>(a.members.filter((m: any) => (m.from ?? '0') <= START && (m.to ?? '9999') >= START && m.entity && allEntityIds.has(m.entity)).map((m: any) => m.entity))];
  if (members.length >= 2) alliances.push({ id: a.id, type: a.type, members, start: a.start, end: a.end, defense: a.defense, entente: a.entente });
}

// ---------------------------------------------------------------- events
const ev = readJson('events/historical_events.json');
const checkEnt = (id: string, where: string) => { if (!allEntityIds.has(id) && !regById.has(id)) err(`${where}: unknown entity ${id}`); };
for (const w of ev.initial_wars) { normRefs(w.sources, `war ${w.id}`); [...w.attackers, ...w.defenders].forEach((x: string) => checkEnt(x, `war ${w.id}`)); for (const g of w.war_goals) for (const r of g.regions ?? []) if (!regionById.has(r)) err(`war ${w.id}: region ${r}`); }
for (const x of ev.exogenous) { normRefs(x.sources, `exo ${x.id}`); for (const r of x.regions) if (!regionById.has(r)) err(`exo ${x.id}: unknown region ${r}`); }
for (const d of ev.decision_windows) { normRefs(d.sources, `dw ${d.id}`); checkEnt(d.entity, `dw ${d.id}`); if (!(d.window[0] < d.window[1])) err(`dw ${d.id}: window order`); if (!d.options.some((o: any) => o.historical)) err(`dw ${d.id}: no historical option`); }
for (const r of ev.structural_rules) normRefs(r.sources, `rule ${r.id}`);
normRefs(ev.zollverein_accessions.sources, 'zollverein');

// leaders
const leadersFile = readJson('leaders/heads_of_state.json');
const leaders = leadersFile.entities as HistoricalDB['leaders'];
for (const [id, list] of Object.entries(leaders)) {
  checkEnt(id, `leaders`);
  for (const l of list) { if (!(l.from <= l.to)) err(`leader ${id} ${l.name}: from > to`); if (l.born && l.died && l.born > l.died) err(`leader ${id} ${l.name}: born after death`); normRefs((l as any).sources, `leader ${id}`); }
}
normRefs(leadersFile.sources_default, 'leaders default');

// historical changes and milestones
const hc = readJson('borders/historical_ownership_changes.json');
for (const c of hc.changes) {
  normRefs(c.sources, `change ${c.date}`);
  for (const r of c.regions) if (!r.startsWith('*') && !regionById.has(r)) err(`change ${c.date} ${c.event}: unknown region ${r}`);
  if (!regById.has(c.to)) err(`change ${c.date}: unknown target ${c.to}`);
}
const ms = readJson('events/milestones.json');
const walkTest = (t: any, where: string) => {
  if (!t) return;
  for (const k of ['region']) if (t[k] && !regionById.has(t[k])) err(`${where}: unknown region ${t[k]}`);
  for (const r of t.regions ?? []) if (!regionById.has(r)) err(`${where}: unknown region ${r}`);
  for (const x of t.of ?? []) walkTest(x, where);
};
for (const m of ms.milestones) walkTest(m.test, `milestone ${m.id}`);

// sources used by ETL datasets
['cow_nmc_v7', 'cow_states_2024', 'cow_majors_2024', 'cow_alliances_v41', 'cow_interstate_v40', 'cow_extrastate_v40', 'cow_intrastate_v41', 'cow_terrchange_v6', 'maddison_2010'].forEach((s) => usedSources.add(s));
for (const s of sources) if (!usedSources.has(s.id) && s.id !== 'otherfacts_none') warn(`source ${s.id} is never cited`);

// ---------------------------------------------------------------- coverage
const by_tier: Record<string, number> = {}; const by_model: Record<string, number> = {};
for (const e of regEntities) { by_tier[e.tier] = (by_tier[e.tier] ?? 0) + 1; by_model[e.model.split(':')[0]] = (by_model[e.model.split(':')[0]] ?? 0) + 1; }
by_model['placeholder_polities'] = decentralizedRegions.length;

if (errors.length) {
  console.error(`build-data: ${errors.length} validation error(s):\n  - ` + errors.slice(0, 80).join('\n  - '));
  process.exit(1);
}

const db: HistoricalDB = {
  meta: { start_date: START, built_at: new Date().toISOString(), version: '0.1.0', counts: { entities: entities.length, regions: regions.length, sources: sources.length, alliances: alliances.length } },
  sources, cultures: cultFile.cultures, religions: cultFile.religions, entities, regions, alliances,
  wars: ev.initial_wars, exogenous: ev.exogenous, decision_windows: ev.decision_windows, structural_rules: ev.structural_rules,
  zollverein: ev.zollverein_accessions, leaders, technologies: techFile.technologies, company_kinds: companyKindsFile.kinds, production_methods: pmFile.methods, settlements: settlementsFile.settlements, blocs: blocsFile.blocs.map(({ id, name_en, name_vi, founded, dissolved, members }: any) => ({ id, name_en, name_vi, founded, ...(dissolved ? { dissolved } : {}), members: members.map(({ capital, from, to, name }: any) => ({ capital, from, ...(to ? { to } : {}), name })) })), leaders_20c: leaders20File.leaders.map(({ capitalRegion, name, born, died, from, to, role, title_vi, title_en }: any) => ({ capitalRegion, name, born, died, from, to, role, title_vi, title_en })), regime_changes: regimeFile.events.map(({ id, date, capitalRegion, rename, name_en, name_vi, type, laws, independence, independenceRegions, allies }: any) => ({ id, date, capitalRegion, rename, name_en, name_vi, type, laws, independence, ...(independenceRegions ? { independenceRegions } : {}), ...(allies ? { allies } : {}) })), world_wars: wwFile.wars, league_of_nations: wwFile.league, decolonisation: decolFile.records.filter((r: any) => r.regions.length).map(({ id, iso, name, name_vi, power, date, regions }: any) => ({ id, iso, name, name_vi, power, date, regions })), tech_adoption_windows: adoptionWindows.map(({ country, tech, earliest }) => ({ country, tech, earliest })), start_techs,
  historical_changes: hc.changes, equivalence: hc.equivalence.classes, milestones: ms.milestones, territorial_checkpoints: ms.territorial_checkpoints,
  european_powers: ms.european_powers, benchmarks, gdp_pc_1836,
  coverage: { entities_total: regEntities.length, by_tier, by_model, facts_by_quality: factsByQuality, needs_source: [...new Set(needsSource)], gaps },
};
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'db.json'), JSON.stringify(db));
console.log(`build-data: OK — ${entities.length} entities (${decentralizedRegions.length} placeholder polities), ${regions.length} regions, ${alliances.length} active alliances, ${warnings.length} warnings`);
if (process.env.VERBOSE) for (const w of warnings) console.log('  warn:', w);
