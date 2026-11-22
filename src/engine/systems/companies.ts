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
    if (!co.sites.length || co.lossMonths >= COMPANY_PARAMS.dissolveAfterLossMonths || !home?.alive) {
      // Remaining cash returns to the owners' savings; unfinished projects pass to the private pool.
      if (home?.alive) home.privatePool = (home.privatePool ?? 0) + co.cash;
      co.cash = 0;
      for (const p of st.constructionProjects ?? []) if (p.company === co.id) delete p.company;
      delete st.companies[co.id];
      if (st.player === co.home) log(st, { type: 'economy', text: `${co.name} is dissolved.`, textVi: `${co.name} giải thể.`, actors: [co.home] });
    }
  }
  // ---- 2. formation (yearly, staggered per country)
  const owners = siteOwners(st);
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized || !stagger(c.id, st.tick, COMPANY_PARAMS.formationPeriod) || !companyLawAllows(c)) continue;
    const mine = Object.values(st.companies).filter((co) => co.home === c.id);
    if (mine.length >= COMPANY_PARAMS.maxPerCountry) continue;
    const present = new Set(mine.map((co) => co.kind));
    let best: { kind: string; year: number; sites: { key: string; region: string; levels: number }[]; total: number } | null = null;
    for (const k of unlockedOperationalKinds(c)) {
      if (present.has(k.id)) continue;
      const sites: { key: string; region: string; levels: number }[] = [];
      for (const r of st.regions) {
        if (r.owner !== c.id || r.controller !== c.id) continue;
        for (const b of k.buildings) {
          const levels = r.buildings[b as Building] ?? 0; const key = `${r.id}|${b}`;
          if (levels > 0 && !owners.has(key)) sites.push({ key, region: r.id, levels });
        }
      }
      const total = sites.reduce((s, x) => s + x.levels, 0);
      if (total < COMPANY_PARAMS.minLevels) continue;
      // Prefer the most recently unlocked kind (the newest form of enterprise), then id order.
      const year = Math.max(...k.unlocked_by.map((t) => d.tech.get(t)?.historical_year ?? 0));
      if (!best || year > best.year || (year === best.year && k.id < best.kind)) best = { kind: k.id, year, sites, total };
    }
    if (!best) continue;
    const chosen = best.sites.sort((a, b) => b.levels - a.levels || a.key.localeCompare(b.key)).slice(0, COMPANY_PARAMS.maxSitesAtFormation);
    const id = `co_${c.id}_${best.kind}_${st.tick}`;
    const co: Company = {
      id, kind: best.kind, name: `${humanize(best.kind)} (${chosen[0].region})`, home: c.id, hq: chosen[0].region,
      founded: st.tick, sites: chosen.map((x) => x.key), prosperity: 0, lastRevenue: 0, lastCost: 0, lossMonths: 0,
      cash: 0, lastProfit: 0, lastDividend: 0, lastRetained: 0, invested: 0,
    };
    st.companies[id] = co;
    for (const x of chosen) owners.set(x.key, id);
    if (st.player === c.id) log(st, { type: 'economy', text: `${co.name} is founded.`, textVi: `${co.name} được thành lập.`, actors: [c.id] });
  }
  // ---- 3. CO-2: investment of retained earnings (id order: deterministic)
  for (const co of Object.values(st.companies).sort((a, b) => a.id.localeCompare(b.id))) {
    const home = st.countries[co.home];
    if (home?.alive) companyInvest(st, co, home, owners);
  }
}
