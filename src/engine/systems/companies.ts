// CO-1: companies as owners of building sites (spec docs/spec/CO01_COMPANIES_AND_MONOPOLIES_VI.md).
//
// A technology only opens the capability to form a kind of company (CG-32). A company is actually
// formed when, in addition, the country's law allows joint-stock enterprise (not 'traditionalism',
// and the joint-stock banking technology), and enough unowned sites of the kind's buildings exist.
// It owns concrete sites (`${regionId}|${building}`), its prosperity follows the real operating margin
// of those sites (IND-02a accounts), and it dissolves after sustained losses or when its sites vanish.
//
// CO-1 is an ownership and accounting layer only: it moves no money. Site revenue and costs are
// already part of regional output and wages; company dividends, cash and investment (with a closed
// GDP/GNI ledger, CG-32 §5) arrive in CO-2. Rights stay inactive until a legal basis exists (CG-30).
// No company is given any productivity or price bonus (owner: no unconditional buffs).
import { data } from '../data/db';
import { log } from '../core';
import type { Building, Company, Country, GameState } from '../types';

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
    if (!co.sites.length || co.lossMonths >= COMPANY_PARAMS.dissolveAfterLossMonths || !home?.alive) {
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
    };
    st.companies[id] = co;
    for (const x of chosen) owners.set(x.key, id);
    if (st.player === c.id) log(st, { type: 'economy', text: `${co.name} is founded.`, textVi: `${co.name} được thành lập.`, actors: [c.id] });
  }
}
