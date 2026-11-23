// CG18-03: nested domain validators of the canonical GameState contract. Called by
// validateGameStateContract (save.ts), which guards every save written, every save loaded (after
// migration) and every simulation-worker snapshot. Only required fields of each interface in
// types.ts are checked; optional/legacy fields are checked only when present. Numeric domains follow
// each field's meaning (finite, non-negative, 0..1, safe integer for ticks). Never repairs.
import { STRATA, type GameState } from './types';

type Obj = Record<string, unknown>;
export class StateContractError extends Error {}
const fail = (path: string, what: string): never => { throw new StateContractError(`Invalid game state: ${path} ${what}`); };

const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const fin = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const tickInt = (v: unknown) => Number.isSafeInteger(v) && (v as number) >= 0;

function obj(v: unknown, path: string): Obj { if (!isObj(v)) fail(path, 'must be an object'); return v as Obj; }
function arr(v: unknown, path: string): unknown[] { if (!Array.isArray(v)) fail(path, 'must be an array'); return v as unknown[]; }
function numOrNull(v: unknown, path: string) { if (v !== null && !fin(v)) fail(path, 'must be a finite number or null'); }
function count(v: unknown, path: string) { if (!tickInt(v)) fail(path, 'must be a non-negative integer count'); }
function str(v: unknown, path: string) { if (typeof v !== 'string') fail(path, 'must be a string'); }
function strOrNull(v: unknown, path: string) { if (v !== null && typeof v !== 'string') fail(path, 'must be a string or null'); }
function bool(v: unknown, path: string) { if (typeof v !== 'boolean') fail(path, 'must be a boolean'); }
function num(v: unknown, path: string) { if (!fin(v)) fail(path, 'must be a finite number'); }
function nonNeg(v: unknown, path: string) { if (!fin(v) || v < 0) fail(path, 'must be a finite non-negative number'); }
function unit(v: unknown, path: string) { if (!fin(v) || v < 0 || v > 1) fail(path, 'must be within 0..1'); }
function tick(v: unknown, path: string) { if (!tickInt(v)) fail(path, 'must be a non-negative safe integer'); }
function strings(v: unknown, path: string) { arr(v, path).forEach((x, i) => str(x, `${path}[${i}]`)); }
function numRecord(v: unknown, path: string, check: (x: unknown, p: string) => void = num) { for (const [k, x] of Object.entries(obj(v, path))) check(x, `${path}.${k}`); }
function oneOf(v: unknown, values: readonly string[], path: string) { if (typeof v !== 'string' || !values.includes(v)) fail(path, `must be one of ${values.join('|')}`); }
/** Ledger figures may carry float round-off just below zero (marketLedgerAudit tolerance). */
function ledger(v: unknown, path: string) { if (!fin(v) || v < -1e-6) fail(path, 'must be a finite non-negative number'); }

export function validateRegionRecord(v: unknown, path: string): void {
  const r = obj(v, path);
  for (const k of ['id', 'owner', 'controller', 'culture', 'religion', 'terrain'] as const) str(r[k], `${path}.${k}`);
  strOrNull(r.culture2, `${path}.culture2`);
  nonNeg(r.pop, `${path}.pop`); num(r.c2, `${path}.c2`); nonNeg(r.area, `${path}.area`); nonNeg(r.output, `${path}.output`); if (r.outputReal !== undefined) nonNeg(r.outputReal, `${path}.outputReal`); if (r.prodRel !== undefined && (!fin(r.prodRel) || (r.prodRel as number) <= 0)) fail(`${path}.prodRel`, 'must be a finite positive number');
  const strata = arr(r.strata, `${path}.strata`);
  if (strata.length !== STRATA.length) fail(`${path}.strata`, `must have ${STRATA.length} entries`);
  strata.forEach((x, i) => nonNeg(x, `${path}.strata[${i}]`));
  for (const k of ['literacy', 'sol', 'devastation'] as const) unit(r[k], `${path}.${k}`);
  for (const k of ['unrest', 'radical', 'nationalism'] as const) nonNeg(r[k], `${path}.${k}`);
  numRecord(r.buildings, `${path}.buildings`, nonNeg);
  strings(r.res, `${path}.res`);
  bool(r.coastal, `${path}.coastal`);
  if (r.blight !== null) { const b = obj(r.blight, `${path}.blight`); num(b.until, `${path}.blight.until`); unit(b.severity, `${path}.blight.severity`); }
  if (r.epidemic !== null) { const e = obj(r.epidemic, `${path}.epidemic`); num(e.until, `${path}.epidemic.until`); nonNeg(e.rate, `${path}.epidemic.rate`); }
  for (const k of ['employment', 'wages'] as const) {
    if (r[k] === undefined) continue;
    const a = arr(r[k], `${path}.${k}`);
    if (a.length !== STRATA.length) fail(`${path}.${k}`, `must have ${STRATA.length} entries`);
    a.forEach((x, i) => nonNeg(x, `${path}.${k}[${i}]`));
  }
  if (r.hiddenGold !== undefined) bool(r.hiddenGold, `${path}.hiddenGold`);
}

export function validateCountryRecord(id: string, v: unknown, path: string): void {
  const c = obj(v, path);
  if (c.id !== id) fail(`${path}.id`, `must equal its key ${id}`);
  for (const k of ['name', 'nameVi', 'color', 'kind', 'tier', 'capital', 'govLabel'] as const) str(c[k], `${path}.${k}`);
  bool(c.alive, `${path}.alive`); bool(c.decentralized, `${path}.decentralized`);
  for (const k of ['overlord', 'subjectType', 'customsUnion'] as const) strOrNull(c[k], `${path}.${k}`);
  for (const [k, x] of Object.entries(obj(c.laws, `${path}.laws`))) str(x, `${path}.laws.${k}`);
  if (c.reform !== null) {
    const r = obj(c.reform, `${path}.reform`);
    str(r.group, `${path}.reform.group`); str(r.value, `${path}.reform.value`); num(r.progress, `${path}.reform.progress`); tick(r.startedTick, `${path}.reform.startedTick`);
  }
  if (c.regimeChangedAt !== null) num(c.regimeChangedAt, `${path}.regimeChangedAt`);
  if (c.regimeLaws !== undefined) numRecord(c.regimeLaws, `${path}.regimeLaws`);
  // CG18-04: every required Leader / heir field.
  const leader = obj(c.leader, `${path}.leader`);
  str(leader.name, `${path}.leader.name`); numOrNull(leader.born, `${path}.leader.born`); num(leader.since, `${path}.leader.since`); bool(leader.historical, `${path}.leader.historical`);
  if (leader.female !== undefined) bool(leader.female, `${path}.leader.female`);
  if (leader.title !== undefined) str(leader.title, `${path}.leader.title`);
  for (const k of ['titleVi', 'recordUntil'] as const) if (leader[k] !== undefined) str(leader[k], `${path}.leader.${k}`);
  for (const k of ['diesOn', 'termEnds'] as const) if (leader[k] !== undefined) strOrNull(leader[k], `${path}.leader.${k}`);
  if (c.heir !== null) {
    const heir = obj(c.heir, `${path}.heir`);
    str(heir.name, `${path}.heir.name`); numOrNull(heir.born, `${path}.heir.born`); bool(heir.female, `${path}.heir.female`);
  }
  // CG18-04: legitimacy is a 0..100 score (clamped wherever it changes); radicalism a 0..1 share.
  if (!fin(c.legitimacy) || c.legitimacy < 0 || c.legitimacy > 100) fail(`${path}.legitimacy`, 'must be within 0..100');
  unit(c.radicalism, `${path}.radicalism`);
  if (c.crisis !== undefined) { const k = obj(c.crisis, `${path}.crisis`); num(k.until, `${path}.crisis.until`); if (!fin(k.delta) || k.delta > 0 || k.delta < -60) fail(`${path}.crisis.delta`, 'must be within -60..0'); str(k.source, `${path}.crisis.source`); }
  for (const k of ['treasury', 'taxRate', 'statePool', 'privatePool', 'gdp', 'income', 'expense', 'tariffIncome', 'prestige', 'infamy', 'warExhaustion', 'foreignPressure'] as const) num(c[k], `${path}.${k}`);
  nonNeg(c.debt, `${path}.debt`);
  if (!fin(c.productivity) || c.productivity <= 0) fail(`${path}.productivity`, 'must be a finite positive number');
  if (c.pm !== undefined) for (const [b, m] of Object.entries(obj(c.pm, `${path}.pm`))) str(m, `${path}.pm.${b}`);
  if (c.pmManual !== undefined) for (const [b, m] of Object.entries(obj(c.pmManual, `${path}.pmManual`))) bool(m, `${path}.pmManual.${b}`);
  if (c.truce !== undefined) { const t = obj(c.truce, `${path}.truce`); str(t.with, `${path}.truce.with`); tick(t.until, `${path}.truce.until`); }
  unit(c.famine, `${path}.famine`);
  for (const [g, x] of Object.entries(obj(c.igs, `${path}.igs`))) { const ig = obj(x, `${path}.igs.${g}`); num(ig.clout, `${path}.igs.${g}.clout`); num(ig.approval, `${path}.igs.${g}.approval`); }
  numRecord(c.budget, `${path}.budget`, nonNeg);
  if (c.finance !== undefined) numRecord(c.finance, `${path}.finance`);
  strings(c.techs, `${path}.techs`);
  const research = obj(c.research, `${path}.research`); strOrNull(research.current, `${path}.research.current`); num(research.progress, `${path}.research.progress`);
  numRecord(c.army, `${path}.army`, nonNeg);
  numRecord(c.navy, `${path}.navy`, nonNeg);
  if (c.lastWarLost !== null) num(c.lastWarLost, `${path}.lastWarLost`);
  if (c.lastGreatWar !== undefined) num(c.lastGreatWar, `${path}.lastGreatWar`);
  if (c.greatWarMonths !== undefined) num(c.greatWarMonths, `${path}.greatWarMonths`);
  if (c.ideasSince !== undefined) numRecord(c.ideasSince, `${path}.ideasSince`);
  const pers = obj(c.personality, `${path}.personality`);
  for (const k of ['aggression', 'expansionism', 'reformism', 'commerce', 'naval', 'isolationism', 'risk'] as const) num(pers[k], `${path}.personality.${k}`);
  if (pers.rationale !== undefined) str(pers.rationale, `${path}.personality.rationale`);
  const ai = obj(c.ai, `${path}.ai`);
  numRecord(ai.cooldowns, `${path}.ai.cooldowns`);
  arr(ai.lawHistory, `${path}.ai.lawHistory`).forEach((h, i) => { const e = obj(h, `${path}.ai.lawHistory[${i}]`); str(e.group, `${path}.ai.lawHistory[${i}].group`); str(e.value, `${path}.ai.lawHistory[${i}].value`); tick(e.tick, `${path}.ai.lawHistory[${i}].tick`); if (e.from !== undefined) str(e.from, `${path}.ai.lawHistory[${i}].from`); });
  strings(ai.recent, `${path}.ai.recent`);
  strings(c.claims, `${path}.claims`);
  strings(c.priorities, `${path}.priorities`);
  numRecord(c.stats, `${path}.stats`);
  if (c.growthBase !== undefined) { const g = obj(c.growthBase, `${path}.growthBase`); if (!fin(g.productivity) || g.productivity <= 0) fail(`${path}.growthBase.productivity`, 'must be a finite positive number'); if (g.tfp !== undefined) nonNeg(g.tfp, `${path}.growthBase.tfp`); unit(g.literacy, `${path}.growthBase.literacy`); }
}

export function validateMarketState(st: Obj): void {
  numRecord(st.worldPrices, 'worldPrices', nonNeg);
  for (const [m, prices] of Object.entries(obj(st.marketPrices, 'marketPrices'))) numRecord(prices, `marketPrices.${m}`, nonNeg);
  for (const [m, goods] of Object.entries(obj(st.marketStats, 'marketStats'))) {
    for (const [g, x] of Object.entries(obj(goods, `marketStats.${m}`))) {
      const p = `marketStats.${m}.${g}`; const s = obj(x, p);
      for (const k of ['supply', 'demand', 'imports'] as const) ledger(s[k], `${p}.${k}`);
      unit(s.short, `${p}.short`);
      for (const k of ['exports', 'used', 'unsold'] as const) if (s[k] !== undefined) ledger(s[k], `${p}.${k}`);
    }
  }
  numRecord(st.relations, 'relations');
  strings(st.rivalries, 'rivalries');
}

const WAR_KINDS = ['conquest', 'civil', 'colonial', 'independence', 'great'] as const;
const TREATY_TYPES = ['alliance', 'guarantee', 'customs_union'] as const;

export function validateWarsAndTreaties(st: Obj): void {
  arr(st.wars, 'wars').forEach((x, i) => {
    const p = `wars[${i}]`; const w = obj(x, p);
    str(w.id, `${p}.id`); str(w.name, `${p}.name`); oneOf(w.kind, WAR_KINDS, `${p}.kind`); if (w.scripted !== undefined) str(w.scripted, `${p}.scripted`); if (w.nominal !== undefined) arr(w.nominal, `${p}.nominal`).forEach((x, i) => str(x, `${p}.nominal[${i}]`));
    for (const side of ['attackers', 'defenders'] as const) { const s = obj(w[side], `${p}.${side}`); str(s.leader, `${p}.${side}.leader`); strings(s.members, `${p}.${side}.members`); }
    arr(w.goals, `${p}.goals`).forEach((gx, j) => {
      const gp = `${p}.goals[${j}]`; const g = obj(gx, gp);
      str(g.by, `${gp}.by`); str(g.type, `${gp}.type`); str(g.target, `${gp}.target`);
      if (g.regions !== undefined) strings(g.regions, `${gp}.regions`);
    });
    num(w.start, `${p}.start`); // wars seeded from history may start before 1836 (negative tick)
    if (!fin(w.score) || Math.abs(w.score) > 100) fail(`${p}.score`, 'must be within -100..100');
    strings(w.occupied, `${p}.occupied`); tick(w.battles, `${p}.battles`);
    const ex = obj(w.exhaustion, `${p}.exhaustion`); num(ex.a, `${p}.exhaustion.a`); num(ex.d, `${p}.exhaustion.d`);
  });
  arr(st.treaties, 'treaties').forEach((x, i) => {
    const p = `treaties[${i}]`; const t = obj(x, p);
    str(t.id, `${p}.id`); oneOf(t.type, TREATY_TYPES, `${p}.type`); strings(t.members, `${p}.members`); num(t.start, `${p}.start`);
    if (t.leader !== undefined) str(t.leader, `${p}.leader`);
  });
  arr(st.constructionProjects, 'constructionProjects').forEach((x, i) => {
    const p = `constructionProjects[${i}]`; const c = obj(x, p);
    for (const k of ['id', 'countryId', 'regionId', 'building'] as const) str(c[k], `${p}.${k}`);
    oneOf(c.funding, ['state', 'private'], `${p}.funding`);
    nonNeg(c.totalCost, `${p}.totalCost`); nonNeg(c.invested, `${p}.invested`); tick(c.createdTick, `${p}.createdTick`);
    if (c.company !== undefined) { str(c.company, `${p}.company`); if (c.funding !== 'private') fail(`${p}.company`, 'company projects are privately funded'); }
  });
  arr(st.territoryLog, 'territoryLog').forEach((x, i) => {
    const p = `territoryLog[${i}]`; const t = obj(x, p);
    tick(t.tick, `${p}.tick`);
    for (const k of ['date', 'region', 'from', 'to', 'cause'] as const) str(t[k], `${p}.${k}`);
    if (t.historicalMatch !== null) bool(t.historicalMatch, `${p}.historicalMatch`);
  });
}

const YEAR_STAT_KEYS = ['y', 'pop', 'gdp', 'army', 'navy', 'literacy', 'power', 'regions', 'legitimacy'] as const;

export function validateCompanies(st: Obj): void {
  const seen = new Set<string>();
  for (const [id, x] of Object.entries(obj(st.companies, 'companies'))) {
    const p = `companies.${id}`; const c = obj(x, p);
    if (c.id !== id) fail(`${p}.id`, `must equal its key ${id}`);
    for (const k of ['kind', 'name', 'home', 'hq'] as const) str(c[k], `${p}.${k}`);
    tick(c.founded, `${p}.founded`);
    arr(c.sites, `${p}.sites`).forEach((s, i) => {
      str(s, `${p}.sites[${i}]`);
      if (!/^[^|]+\|[a-z_]+$/.test(s as string)) fail(`${p}.sites[${i}]`, 'must be regionId|building');
      if (seen.has(s as string)) fail(`${p}.sites[${i}]`, 'is owned by more than one company');
      seen.add(s as string);
    });
    if (!fin(c.prosperity) || c.prosperity < -1 || c.prosperity > 1) fail(`${p}.prosperity`, 'must be within -1..1');
    nonNeg(c.lastRevenue, `${p}.lastRevenue`); nonNeg(c.lastCost, `${p}.lastCost`); tick(c.lossMonths, `${p}.lossMonths`);
    nonNeg(c.cash, `${p}.cash`); num(c.lastProfit, `${p}.lastProfit`); nonNeg(c.lastDividend, `${p}.lastDividend`);
    nonNeg(c.lastRetained, `${p}.lastRetained`); nonNeg(c.invested, `${p}.invested`);
    if (c.charter !== undefined) {
      const ch = obj(c.charter, `${p}.charter`); tick(ch.since, `${p}.charter.since`); tick(ch.expires, `${p}.charter.expires`);
      if ((ch.expires as number) <= (ch.since as number)) fail(`${p}.charter.expires`, 'must be after since');
    }
    if (c.historicalId !== undefined) str(c.historicalId, `${p}.historicalId`);
  }
}

export function validateHistoryAndCounters(st: Obj): void {
  for (const [id, rows] of Object.entries(obj(st.history, 'history'))) {
    // CG18-04: every required YearStat key must be present and finite.
    arr(rows, `history.${id}`).forEach((x, i) => {
      const row = obj(x, `history.${id}[${i}]`);
      for (const k of YEAR_STAT_KEYS) num(row[k], `history.${id}[${i}].${k}`);
      if (!Number.isSafeInteger(row.y)) fail(`history.${id}[${i}].y`, 'must be an integer year');
    });
  }
  const dv = obj(st.divergence, 'divergence');
  for (const [k, x] of Object.entries(obj(dv.milestones, 'divergence.milestones'))) oneOf(obj(x, `divergence.milestones.${k}`).status, ['pending', 'achieved', 'missed'], `divergence.milestones.${k}.status`);
  arr(dv.entries, 'divergence.entries').forEach((x, i) => {
    const p = `divergence.entries[${i}]`; const e = obj(x, p);
    tick(e.tick, `${p}.tick`); str(e.date, `${p}.date`); str(e.kind, `${p}.kind`); str(e.text, `${p}.text`); strings(e.actors, `${p}.actors`);
  });
  for (const [k, x] of Object.entries(obj(dv.milestones, 'divergence.milestones'))) {
    const m = obj(x, `divergence.milestones.${k}`);
    if (m.date !== undefined) str(m.date, `divergence.milestones.${k}.date`);
    if (m.credit !== undefined) num(m.credit, `divergence.milestones.${k}.credit`);
  }
  arr(dv.similarity, 'divergence.similarity').forEach((x, i) => { const s = obj(x, `divergence.similarity[${i}]`); for (const k of ['territorial', 'milestones', 'combined'] as const) num(s[k], `divergence.similarity[${i}].${k}`); });
  const c = obj(st.counters, 'counters');
  // CG18-04 (P3): counters are integer counts.
  for (const k of ['systemRuns', 'aiActions', 'aiActionsByCountry'] as const) numRecord(c[k], `counters.${k}`, count);
  count(c.decisionWindowsFired, 'counters.decisionWindowsFired'); count(c.historicalBiasApplied, 'counters.historicalBiasApplied');
  strings(st.firedEvents, 'firedEvents');
  arr(st.pendingPlayerDecisions, 'pendingPlayerDecisions').forEach((x, i) => {
    const p = `pendingPlayerDecisions[${i}]`; const d = obj(x, p);
    str(d.id, `${p}.id`); str(d.windowId, `${p}.windowId`);
    arr(d.options, `${p}.options`).forEach((ox, j) => { const o = obj(ox, `${p}.options[${j}]`); str(o.id, `${p}.options[${j}].id`); bool(o.historical, `${p}.options[${j}].historical`); });
  });
  arr(st.log, 'log').forEach((x, i) => {
    const p = `log[${i}]`; const e = obj(x, p);
    str(e.text, `${p}.text`); str(e.type, `${p}.type`); str(e.date, `${p}.date`); tick(e.tick, `${p}.tick`); strings(e.actors, `${p}.actors`);
  });
}

/** Runs every nested domain validator on an object already known to have the top-level shape. */
export function validateNestedState(st: GameState): void {
  const s = st as unknown as Obj;
  st.regions.forEach((r, i) => validateRegionRecord(r, `regions[${i}]`));
  for (const [id, c] of Object.entries(st.countries)) validateCountryRecord(id, c, `countries.${id}`);
  validateMarketState(s);
  validateWarsAndTreaties(s);
  validateHistoryAndCounters(s);
  validateCompanies(s);
  if (s.decolonised !== undefined) arr(s.decolonised, 'decolonised').forEach((x, i) => str(x, `decolonised[${i}]`));
  if (s.settlements !== undefined) {
    const v = obj(s.settlements, 'settlements');
    arr(v.applied, 'settlements.applied').forEach((x, i) => str(x, `settlements.applied[${i}]`));
    for (const [k, snap] of Object.entries(obj(v.snapshots, 'settlements.snapshots'))) for (const [r, o] of Object.entries(obj(snap, `settlements.snapshots.${k}`))) str(o, `settlements.snapshots.${k}.${r}`);
    for (const [k, x] of Object.entries(obj(v.formed, 'settlements.formed'))) str(x, `settlements.formed.${k}`);
  }
  if (s.journal !== undefined) arr(s.journal, 'journal').forEach((x, i) => {
    const p = `journal[${i}]`; const j = obj(x, p);
    for (const k of ['id', 'kind', 'event', 'country', 'status'] as const) str(j[k], `${p}.${k}`);
    num(j.started, `${p}.started`); num(j.expires, `${p}.expires`); if (j.ended !== undefined) num(j.ended, `${p}.ended`);
    if (!['active', 'completed', 'expired', 'abandoned'].includes(j.status as string)) fail(`${p}.status`, 'unknown journal status');
    if (!['regime', 'decolonisation'].includes(j.kind as string)) fail(`${p}.kind`, 'unknown journal kind');
  });
  if (s.regimesApplied !== undefined) arr(s.regimesApplied, 'regimesApplied').forEach((x, i) => str(x, `regimesApplied[${i}]`));
  if (s.worldWars !== undefined) for (const [k, v] of Object.entries(obj(s.worldWars, 'worldWars'))) { const r = obj(v, `worldWars.${k}`); if (r.war !== null) str(r.war, `worldWars.${k}.war`); bool(r.ended, `worldWars.${k}.ended`); for (const [m, c] of Object.entries(obj(r.joined, `worldWars.${k}.joined`))) str(c, `worldWars.${k}.joined.${m}`); }
  if (s.un !== undefined) {
    const un = obj(s.un, 'un'); tick(un.founded, 'un.founded'); if (un.powerSeat !== undefined && un.powerSeat !== null) str(un.powerSeat, 'un.powerSeat'); if (un.seatTerritory !== undefined) for (const [k, v] of Object.entries(obj(un.seatTerritory, 'un.seatTerritory'))) arr(v, `un.seatTerritory.${k}`).forEach((x, i) => str(x, `un.seatTerritory.${k}[${i}]`));
    for (const k of ['members', 'permanent'] as const) arr(un[k], `un.${k}`).forEach((x, i) => str(x, `un.${k}[${i}]`));
    arr(un.elected, 'un.elected').forEach((x, i) => { const e = obj(x, `un.elected[${i}]`); str(e.id, `un.elected[${i}].id`); tick(e.until, `un.elected[${i}].until`); });
    arr(un.resolutions, 'un.resolutions').forEach((x, i) => { const r = obj(x, `un.resolutions[${i}]`); tick(r.tick, `un.resolutions[${i}].tick`); for (const k of ['war', 'attacker', 'defender'] as const) str(r[k], `un.resolutions[${i}].${k}`); bool(r.passed, `un.resolutions[${i}].passed`); arr(r.vetoedBy, `un.resolutions[${i}].vetoedBy`); for (const [m, v] of Object.entries(obj(r.votes, `un.resolutions[${i}].votes`))) oneOf(v, ['for', 'against', 'abstain'], `un.resolutions[${i}].votes.${m}`); });
  }
}
