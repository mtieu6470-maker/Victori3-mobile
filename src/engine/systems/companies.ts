// CO-1: companies as owners of building sites (spec docs/spec/CO01_COMPANIES_AND_MONOPOLIES_VI.md).
//
// A technology only opens the capability to form a kind of company (CG-32). A company is actually
// formed when, in addition, the country's law allows joint-stock enterprise (not 'traditionalism',
// and the joint-stock banking technology), and enough unowned sites of the kind's buildings exist.
// It owns concrete sites (`${regionId}|${building}`), its prosperity follows the real operating margin
// of those sites (IND-02a accounts), and it dissolves after sustained losses or when its sites vanish.
//
// CO-2 money (spec §8, research CG-33): operating profit = revenue − cost of its sites. A positive profit
// is split into dividends (PAYOUT_RATIO) and retained earnings. Site value added is already in GDP
// and the country's private savings (privatePool) already contain profits, so retained earnings are
// CARVED OUT of privatePool into the company's cash: no money is created or destroyed
// (invariant: privatePool + Σ company cash + funds paid into company projects is unchanged by this
// step). Dividends stay with households (no flow change; recorded for display). Losses are not paid
// from cash (they already reduce owners' income in the aggregate model); they count toward
// dissolution. Companies spend cash on their own construction (expanding or adding sites of their
// kind's buildings) and release cash they cannot use back to the private pool. All sites are in the
// home country, so GDP = GNI for companies until foreign ownership exists (CG-33 §3).
// Rights stay inactive until a legal basis exists (CG-30). No productivity or price bonus.
import { data } from '../data/db';
import { log } from '../core';
import type { Building, Company, Country, GameState } from '../types';
import { buildCost, buildingReturn, canBuild, enqueueConstruction } from './economy';
import { regionsOf } from '../cache';

/** Design parameters (project values, not historical data). */
export const COMPANY_PARAMS = {
  /** Unowned building levels a kind needs in one country before a company can form. */
  minLevels: 8,
  /** Sites a newly formed company takes over at most. */
  maxSitesAtFormation: 12,
  /** Companies per country (performance and readability guard). */
  maxPerCountry: 12,
  /** Months between formation checks for a country (staggered by country id). */
  formationPeriod: 12,
  /** Prosperity smoothing (share of the new month's margin). */
  prosperityAlpha: 0.1,
  /** Consecutive loss-making months before a company dissolves. */
  dissolveAfterLossMonths: 36,
  /**
   * CO-2: share of positive profit paid as dividends. Design value inside the historical range
   * collected in CG-33 (UK 1895–1905 ordinary 49% / all-share 73%; Germany 1870–1913 about 75–80%;
   * US 1940s–1980s 40–61%); there is no universal historical rate.
   */
  payoutRatio: 0.6,
  /** Minimum expected annual return (buildingReturn) before a company expands, as for private investors. */
  minReturn: 0.08,
  /** Cash kept beyond this many typical projects is released back to the private pool. */
  maxCashProjects: 3,
  /** Months between investment reviews of one company (staggered by id; performance). */
  investPeriod: 3,
} as const;

/** Laws under which joint-stock companies may be formed (economy law), plus the banking technology. */
export function companyLawAllows(c: Country): boolean {
  return c.laws.economy !== 'traditionalism' && c.techs.includes('joint_stock_banking');
}

/** Company kinds this country has unlocked that can own existing building types (not dormant). */
export function unlockedOperationalKinds(c: Country) {
  return data().db.company_kinds.filter((k) => k.buildings.length > 0 && k.unlocked_by.some((t) => c.techs.includes(t)));
}

function stagger(id: string, tick: number, period: number): boolean {
  let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (tick + h) % period === 0;
}

/**
 * CO-3b: economy laws under which the state may GRANT new monopoly charters. A change of law does not
 * cancel existing charters (CG-34: exclusive rights ended by an explicit statute, the end of a
 * concession term, a buy-out or a transfer of territory, not automatically by a free-trade reform).
 */
export const CHARTER_LAWS = new Set(['mercantilism', 'interventionism']);
/**
 * CO-3b design parameters: prosperity needed for a charter; one charter per this many company slots
 * (at least one); term in years. Historical concession terms varied widely (French railway concessions
 * after 1859: 99 years; Suez 1854: 99 years from opening); 30 years is a project design value.
 */
export const CHARTER_PARAMS = { minProsperity: 0.3, slotsPerCharter: 4, termYears: 30 } as const;

export function charterLimit(st: GameState, c: Country): number {
  return CHARTER_LAWS.has(c.laws.economy) ? Math.max(1, Math.floor(companySlots(st, c) / CHARTER_PARAMS.slotsPerCharter)) : 0;
}

/** The chartered company holding the monopoly on a building type in a country, if any. */
export function monopolyHolder(st: GameState, countryId: string, b: Building): Company | undefined {
  const d = data();
  for (const co of Object.values(st.companies ?? {})) {
    if (co.home !== countryId || !co.charter) continue;
    if (d.db.company_kinds.find((k) => k.id === co.kind)?.buildings.includes(b)) return co;
  }
  return undefined;
}

/** Why a charter cannot be granted to this company now (null when it can). */
export function charterBlocker(st: GameState, co: Company | undefined): string | null {
  if (!co) return 'Unknown company';
  const c = st.countries[co.home];
  if (!c?.alive) return 'Unknown company';
  if (co.charter) return 'The company already holds a charter';
  if (!CHARTER_LAWS.has(c.laws.economy)) return 'The economy law does not allow monopoly charters';
  if (co.prosperity < CHARTER_PARAMS.minProsperity) return 'The company is not prosperous enough for a charter';
  if (companiesOf(st, c.id).filter((x) => x.charter).length >= charterLimit(st, c)) return 'No free charter';
  const kind = data().db.company_kinds.find((k) => k.id === co.kind);
  for (const b of kind?.buildings ?? []) if (monopolyHolder(st, c.id, b as Building)) return 'Another company already holds this monopoly';
  return null;
}

export function grantCharter(st: GameState, co: Company): boolean {
  if (charterBlocker(st, co)) return false;
  co.charter = { since: st.tick, expires: st.tick + CHARTER_PARAMS.termYears * 12 };
  if (st.player === co.home) log(st, { type: 'economy', text: `${co.name} receives a monopoly charter.`, textVi: `${co.name} được cấp hiến chương độc quyền.`, actors: [co.home] });
  return true;
}

export function revokeCharter(st: GameState, co: Company, why = ''): boolean {
  if (!co.charter) return false;
  delete co.charter;
  if (st.player === co.home) log(st, { type: 'economy', text: `${co.name} loses its monopoly charter${why}.`, textVi: `${co.name} mất hiến chương độc quyền${why ? ' (hết hạn)' : ''}.`, actors: [co.home] });
  return true;
}

/** Funds still owed to a company's own unfinished projects. */
export function companyCommitted(st: GameState, coId: string): number {
  return (st.constructionProjects ?? []).reduce((s, p) => s + (p.company === coId ? Math.max(0, p.totalCost - p.invested) : 0), 0);
}

/** CO-2: operating profit split and retained-earnings carve-out from the home country's private savings. */
function companyFinance(co: Company, home: Country | undefined): void {
  const profit = co.lastRevenue - co.lastCost;
  co.lastProfit = profit;
  if (profit <= 0 || !home) { co.lastDividend = 0; co.lastRetained = 0; return; }
  const retainedWanted = profit * (1 - COMPANY_PARAMS.payoutRatio);
  const retained = Math.min(retainedWanted, Math.max(0, home.privatePool ?? 0));
  home.privatePool = Math.max(0, (home.privatePool ?? 0) - retained);
  co.cash += retained;
  co.lastRetained = retained;
  co.lastDividend = profit - retained;
}

/** CO-2: a company with enough uncommitted cash starts one project for its kind's buildings at home. */
function companyInvest(st: GameState, co: Company, home: Country, owners: Map<string, string>): void {
  const d = data();
  const kind = d.db.company_kinds.find((k) => k.id === co.kind);
  if (!kind || !kind.buildings.length) return;
  const busy = (st.constructionProjects ?? []).some((p) => p.company === co.id);
  const typical = buildCost(home, kind.buildings[0] as Building, st);
  const free = co.cash - companyCommitted(st, co.id);
  if (!busy && stagger(co.id, st.tick, COMPANY_PARAMS.investPeriod)) {
    let best: { r: (typeof st.regions)[number]; b: Building; v: number } | null = null;
    for (const r of regionsOf(st, home.id)) {
      if (r.controller !== home.id) continue;
      for (const b of kind.buildings as Building[]) {
        const key = `${r.id}|${b}`; const owner = owners.get(key);
        if (owner && owner !== co.id) continue;
        const holder = monopolyHolder(st, home.id, b); if (holder && holder.id !== co.id) continue;
        // A new level next to an unowned existing site would absorb other investors' plant: not allowed.
        if (!owner && (r.buildings[b] ?? 0) > 0) continue;
        if (!canBuild(st, home, r, b) || free < buildCost(home, b, st)) continue;
        const v = buildingReturn(st, home, r, b);
        // Own sites first at equal return (economies of an existing operation), then region order.
        const score = v + (owner === co.id ? 1e-6 : 0);
        if (v > COMPANY_PARAMS.minReturn && (!best || score > best.v)) best = { r, b, v: score };
      }
    }
    if (best) {
      const proj = enqueueConstruction(st, home, best.r, best.b, 'private');
      if (proj) { proj.company = co.id; return; }
    }
  }
  // Cash the company cannot use returns to its owners' savings.
  const cap = Number.isFinite(typical) && typical > 0 ? typical * COMPANY_PARAMS.maxCashProjects : 0;
  const excess = co.cash - companyCommitted(st, co.id) - cap;
  if (excess > 0) { co.cash -= excess; home.privatePool = (home.privatePool ?? 0) + excess; }
}

const humanize = (id: string) => id.replace(/_/g, ' ').replace(/^./, (x) => x.toUpperCase());

/** Map of site key → owning company id. */
export function siteOwners(st: GameState): Map<string, string> {
  const m = new Map<string, string>();
  for (const co of Object.values(st.companies ?? {})) for (const s of co.sites) m.set(s, co.id);
  return m;
}

/** CO-3 design parameter: company slots granted by the economy law (no slots under traditionalism). */
export const SLOTS_BY_ECONOMY_LAW: Record<string, number> = { traditionalism: 0, mercantilism: 1, interventionism: 2, laissez_faire: 3 };
/** CO-3 design parameter: one more slot per this many industrial, mining and railway building levels. */
export const LEVELS_PER_SLOT = 150;
const SLOT_BUILDINGS: Building[] = ['textile_mill', 'ironworks', 'tool_works', 'arms_works', 'luxury_workshop', 'railway', 'mine'];

export const companiesOf = (st: GameState, countryId: string) => Object.values(st.companies ?? {}).filter((co) => co.home === countryId);

/**
 * CO-3: how many companies a country can sustain. Slots come from the economy law (a legal basis for
 * joint-stock enterprise) and from the size of its industrial base; nothing is granted for free.
 */
export function companySlots(st: GameState, c: Country): number {
  if (!companyLawAllows(c)) return 0;
  let levels = 0;
  for (const r of regionsOf(st, c.id)) for (const b of SLOT_BUILDINGS) levels += r.buildings[b] ?? 0;
  return Math.min(COMPANY_PARAMS.maxPerCountry, (SLOTS_BY_ECONOMY_LAW[c.laws.economy] ?? 0) + Math.floor(levels / LEVELS_PER_SLOT));
}

/** Unowned sites of a kind's buildings in a country's controlled regions. */
function formationSites(st: GameState, c: Country, kindBuildings: string[], owners: Map<string, string>) {
  const sites: { key: string; region: string; levels: number }[] = [];
  for (const r of regionsOf(st, c.id)) {
    if (r.controller !== c.id) continue;
    for (const b of kindBuildings) {
      const levels = r.buildings[b as Building] ?? 0; const key = `${r.id}|${b}`;
      if (levels > 0 && !owners.has(key)) sites.push({ key, region: r.id, levels });
    }
  }
  return sites;
}

/** Kinds this country could found now (unlocked, not yet present, enough unowned plant). */
export function foundableKinds(st: GameState, c: Country, owners = siteOwners(st)) {
  const present = new Set(companiesOf(st, c.id).map((co) => co.kind));
  return unlockedOperationalKinds(c).filter((k) => !present.has(k.id)
    && formationSites(st, c, k.buildings, owners).reduce((s, x) => s + x.levels, 0) >= COMPANY_PARAMS.minLevels);
}

/** Why a country cannot found a company of this kind now (null when it can). */
export function foundCompanyBlocker(st: GameState, c: Country, kindId: string): string | null {
  const kind = data().db.company_kinds.find((k) => k.id === kindId);
  if (!kind || !kind.buildings.length) return 'Unknown or dormant company kind';
  if (!companyLawAllows(c)) return 'The economy law does not allow joint-stock companies';
  if (!kind.unlocked_by.some((t) => c.techs.includes(t))) return 'Technology not researched';
  if (companiesOf(st, c.id).some((co) => co.kind === kindId)) return 'A company of this kind already exists';
  if (companiesOf(st, c.id).length >= companySlots(st, c)) return 'No free company slot';
  const total = formationSites(st, c, kind.buildings, siteOwners(st)).reduce((s, x) => s + x.levels, 0);
  if (total < COMPANY_PARAMS.minLevels) return `Needs ${COMPANY_PARAMS.minLevels} unowned building levels (has ${total})`;
  return null;
}

function formCompany(st: GameState, c: Country, kindId: string, owners: Map<string, string>): Company | null {
  const d = data();
  const kind = d.db.company_kinds.find((k) => k.id === kindId);
  if (!kind) return null;
  const sites = formationSites(st, c, kind.buildings, owners);
  if (!sites.length) return null;
  // Largest sites first; equal sites go to the more populous region (the headquarters is the first).
  const popOf = (regionId: string) => st.regions[d.regionIndex.get(regionId) ?? -1]?.pop ?? 0;
  const chosen = sites.sort((a, b) => b.levels - a.levels || popOf(b.region) - popOf(a.region) || a.key.localeCompare(b.key)).slice(0, COMPANY_PARAMS.maxSitesAtFormation);
  const id = `co_${c.id}_${kindId}_${st.tick}`;
  const co: Company = {
    id, kind: kindId, name: `${humanize(kindId)} (${chosen[0].region})`, home: c.id, hq: chosen[0].region,
    founded: st.tick, sites: chosen.map((x) => x.key), prosperity: 0, lastRevenue: 0, lastCost: 0, lossMonths: 0,
    cash: 0, lastProfit: 0, lastDividend: 0, lastRetained: 0, invested: 0,
  };
  st.companies[id] = co;
  for (const x of chosen) owners.set(x.key, id);
  if (st.player === c.id) log(st, { type: 'economy', text: `${co.name} is founded.`, textVi: `${co.name} được thành lập.`, actors: [c.id] });
  return co;
}

/** CO-3: the player (or any caller) founds a company of a kind, under the same rules as the AI. */
export function foundCompany(st: GameState, c: Country, kindId: string): Company | null {
  st.companies ??= {};
  if (foundCompanyBlocker(st, c, kindId)) return null;
  return formCompany(st, c, kindId, siteOwners(st));
}

export function companiesMonth(st: GameState): void {
  st.companies ??= {};
  const d = data();
  // ---- 1. existing companies: drop lost sites, update prosperity, dissolve failures
  for (const co of Object.values(st.companies).sort((a, b) => a.id.localeCompare(b.id))) {
    co.sites = co.sites.filter((key) => {
      const [regionId, building] = key.split('|');
      const r = st.regions[d.regionIndex.get(regionId) ?? -1];
      return !!r && r.owner === co.home && (r.buildings[building as Building] ?? 0) > 0;
    });
    let revenue = 0, cost = 0;
    for (const key of co.sites) { const ops = st.industry?.[key]; if (ops) { revenue += ops.revenue; cost += ops.cost; } }
    co.lastRevenue = revenue; co.lastCost = cost;
    const margin = cost > 0 ? Math.max(-1, Math.min(1, (revenue - cost) / cost)) : 0;
    co.prosperity = Math.max(-1, Math.min(1, co.prosperity * (1 - COMPANY_PARAMS.prosperityAlpha) + margin * COMPANY_PARAMS.prosperityAlpha));
    co.lossMonths = cost > 0 && revenue < cost ? co.lossMonths + 1 : 0;
    const home = st.countries[co.home];
    companyFinance(co, home?.alive ? home : undefined);
    if (co.charter && st.tick >= co.charter.expires) revokeCharter(st, co, ' (term ended)');
    if (!co.sites.length || co.lossMonths >= COMPANY_PARAMS.dissolveAfterLossMonths || !home?.alive) {
      // Remaining cash returns to the owners' savings; unfinished projects pass to the private pool.
      if (home?.alive) home.privatePool = (home.privatePool ?? 0) + co.cash;
      co.cash = 0;
      for (const p of st.constructionProjects ?? []) if (p.company === co.id) delete p.company;
      delete st.companies[co.id];
      if (st.player === co.home) log(st, { type: 'economy', text: `${co.name} is dissolved.`, textVi: `${co.name} giải thể.`, actors: [co.home] });
    }
  }
  // ---- 2. formation (yearly, staggered per country). The player's country never forms companies by
  // itself: the player founds them (foundCompany), like every other economic decision.
  const owners = siteOwners(st);
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized || c.id === st.player || !stagger(c.id, st.tick, COMPANY_PARAMS.formationPeriod) || !companyLawAllows(c)) continue;
    const room = companiesOf(st, c.id).length < companySlots(st, c);
    let best: { kind: string; year: number } | null = null;
    for (const k of room ? foundableKinds(st, c, owners) : []) {
      // Prefer the most recently unlocked kind (the newest form of enterprise), then id order.
      const year = Math.max(...k.unlocked_by.map((t) => d.tech.get(t)?.historical_year ?? 0));
      if (!best || year > best.year || (year === best.year && k.id < best.kind)) best = { kind: k.id, year };
    }
    if (best) formCompany(st, c, best.kind, owners);
    // AI: grant a charter to its most prosperous eligible company (the player decides for themselves).
    const cand = companiesOf(st, c.id).filter((co) => !charterBlocker(st, co)).sort((a, b) => b.prosperity - a.prosperity || a.id.localeCompare(b.id))[0];
    if (cand) grantCharter(st, cand);
  }
  // ---- 3. CO-2: investment of retained earnings (id order: deterministic)
  for (const co of Object.values(st.companies).sort((a, b) => a.id.localeCompare(b.id))) {
    const home = st.countries[co.home];
    if (home?.alive) companyInvest(st, co, home, owners);
  }
}
