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
  nonNeg(r.pop, `${path}.pop`); num(r.c2, `${path}.c2`); nonNeg(r.area, `${path}.area`); nonNeg(r.output, `${path}.output`);
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
  const leader = obj(c.leader, `${path}.leader`); str(leader.name, `${path}.leader.name`); num(leader.since, `${path}.leader.since`);
  if (c.heir !== null) str(obj(c.heir, `${path}.heir`).name, `${path}.heir.name`);
  for (const k of ['legitimacy', 'radicalism', 'treasury', 'taxRate', 'statePool', 'privatePool', 'gdp', 'income', 'expense', 'tariffIncome', 'prestige', 'infamy', 'warExhaustion', 'foreignPressure'] as const) num(c[k], `${path}.${k}`);
  nonNeg(c.debt, `${path}.debt`);
  if (!fin(c.productivity) || c.productivity <= 0) fail(`${path}.productivity`, 'must be a finite positive number');
  unit(c.famine, `${path}.famine`);
  for (const [g, x] of Object.entries(obj(c.igs, `${path}.igs`))) { const ig = obj(x, `${path}.igs.${g}`); num(ig.clout, `${path}.igs.${g}.clout`); num(ig.approval, `${path}.igs.${g}.approval`); }
  numRecord(c.budget, `${path}.budget`, nonNeg);
  if (c.finance !== undefined) numRecord(c.finance, `${path}.finance`);
  strings(c.techs, `${path}.techs`);
  const research = obj(c.research, `${path}.research`); strOrNull(research.current, `${path}.research.current`); num(research.progress, `${path}.research.progress`);
  numRecord(c.army, `${path}.army`, nonNeg);
  numRecord(c.navy, `${path}.navy`, nonNeg);
  if (c.lastWarLost !== null) num(c.lastWarLost, `${path}.lastWarLost`);
  const pers = obj(c.personality, `${path}.personality`);
  for (const k of ['aggression', 'expansionism', 'reformism', 'commerce', 'naval', 'isolationism', 'risk'] as const) num(pers[k], `${path}.personality.${k}`);
  if (pers.rationale !== undefined) str(pers.rationale, `${path}.personality.rationale`);
  const ai = obj(c.ai, `${path}.ai`);
  numRecord(ai.cooldowns, `${path}.ai.cooldowns`);
  arr(ai.lawHistory, `${path}.ai.lawHistory`).forEach((h, i) => { const e = obj(h, `${path}.ai.lawHistory[${i}]`); str(e.group, `${path}.ai.lawHistory[${i}].group`); str(e.value, `${path}.ai.lawHistory[${i}].value`); tick(e.tick, `${path}.ai.lawHistory[${i}].tick`); });
  strings(ai.recent, `${path}.ai.recent`);
  strings(c.claims, `${path}.claims`);
  strings(c.priorities, `${path}.priorities`);
  numRecord(c.stats, `${path}.stats`);
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
    str(w.id, `${p}.id`); str(w.name, `${p}.name`); oneOf(w.kind, WAR_KINDS, `${p}.kind`);
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
  });
  arr(st.territoryLog, 'territoryLog').forEach((x, i) => {
    const p = `territoryLog[${i}]`; const t = obj(x, p);
    tick(t.tick, `${p}.tick`);
    for (const k of ['date', 'region', 'from', 'to', 'cause'] as const) str(t[k], `${p}.${k}`);
    if (t.historicalMatch !== null) bool(t.historicalMatch, `${p}.historicalMatch`);
  });
}

export function validateHistoryAndCounters(st: Obj): void {
  for (const [id, rows] of Object.entries(obj(st.history, 'history'))) {
    arr(rows, `history.${id}`).forEach((x, i) => { const row = obj(x, `history.${id}[${i}]`); for (const [k, v] of Object.entries(row)) num(v, `history.${id}[${i}].${k}`); });
  }
  const dv = obj(st.divergence, 'divergence');
  for (const [k, x] of Object.entries(obj(dv.milestones, 'divergence.milestones'))) oneOf(obj(x, `divergence.milestones.${k}`).status, ['pending', 'achieved', 'missed'], `divergence.milestones.${k}.status`);
  arr(dv.entries, 'divergence.entries').forEach((x, i) => { const e = obj(x, `divergence.entries[${i}]`); str(e.text, `divergence.entries[${i}].text`); tick(e.tick, `divergence.entries[${i}].tick`); });
  arr(dv.similarity, 'divergence.similarity').forEach((x, i) => { const s = obj(x, `divergence.similarity[${i}]`); for (const k of ['territorial', 'milestones', 'combined'] as const) num(s[k], `divergence.similarity[${i}].${k}`); });
  const c = obj(st.counters, 'counters');
  for (const k of ['systemRuns', 'aiActions', 'aiActionsByCountry'] as const) numRecord(c[k], `counters.${k}`, nonNeg);
  nonNeg(c.decisionWindowsFired, 'counters.decisionWindowsFired'); nonNeg(c.historicalBiasApplied, 'counters.historicalBiasApplied');
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
}
