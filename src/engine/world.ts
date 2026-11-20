// World mutations shared by all systems: territory transfers, new states, subjects, annexation.
import { data } from './data/db';
import type { Country, GameState } from './types';
import { IGS } from './types';
import { dateStr, log, relKey, setRel, newId } from './core';
import { updatePolitics } from './systems/politics';
import { makeHistoricalCountry } from './init';
import { invalidate } from './cache';
import { setCustomsUnionMembership } from './systems/customsUnion';

export function transferRegion(st: GameState, regionId: string, to: string, cause: string, historicalDate?: string): boolean {
  const d = data();
  const idx = d.regionIndex.get(regionId);
  if (idx === undefined) return false;
  const r = st.regions[idx];
  if (!r || r.owner === to) return false;
  let target: Country | undefined = st.countries[to];
  if (!target?.alive) {
    const created = makeHistoricalCountry(st, to, regionId);
    if (!created) return false;
    target = created;
    st.countries[to] = created;
  }
  const from = r.owner;
  r.owner = to; r.controller = to; invalidate();
  const histOwner = d.historicalOwner(regionId, historicalDate ?? dateStr(st.date));
  const match = d.equivalent(histOwner, to);
  st.territoryLog.push({ tick: st.tick, date: dateStr(st.date), region: regionId, from, to, cause, historicalMatch: match });
  const fc = st.countries[from];
  if (fc) {
    fc.claims = fc.claims.includes(regionId) ? fc.claims : [...fc.claims, regionId];
    if (fc.capital === regionId) { const next = st.regions.find((x) => x.owner === from); if (next) fc.capital = next.id; }
    if (!st.regions.some((x) => x.owner === from)) killCountry(st, from, `annexed by ${to}`);
  }
  const tc = st.countries[to];
  if (tc) {
    tc.claims = tc.claims.filter((x) => x !== regionId);
    updatePolitics(st, tc, true);
  }
  return true;
}

export function killCountry(st: GameState, id: string, why: string) {
  const c = st.countries[id]; if (!c || !c.alive) return;
  c.alive = false;
  // Remove the country from every customs union, clear its pointer and transfer
  // leadership before generic alliance/guarantee cleanup.
  setCustomsUnionMembership(st, id, null);
  for (const t of st.treaties) {
    if (t.type !== 'customs_union') t.members = t.members.filter((m) => m !== id);
  }
  st.treaties = st.treaties.filter(
    (t) => t.type === 'customs_union' ? t.members.length > 0 : t.members.length >= 2,
  );
  for (const o of Object.values(st.countries)) if (o.overlord === id) { o.overlord = null; o.subjectType = null; }
  for (const w of st.wars) { w.attackers.members = w.attackers.members.filter((m) => m !== id); w.defenders.members = w.defenders.members.filter((m) => m !== id); }
  if (!c.decentralized) log(st, { type: 'state', text: `${c.name} ceases to exist (${why}).`, textVi: `${c.nameVi} không còn tồn tại (${why}).`, actors: [id] });
}

const NATION_TAGS: Record<string, string> = { german: 'GER', italian: 'ITA', romanian: 'ROM', polish: 'POL', hungarian: 'HUN', bulgarian: 'BUL', canadian: 'CAN' };

/** Creates (or revives) a nation-state from regions. Used by secession, unification and releases in both modes. */
export function createNation(st: GameState, nation: string, regionIds: string[], from: string | null, cause: string, template?: Country): string {
  const d = data();
  const reg = d.db.entities.find((e) => e.id === NATION_TAGS[nation]);
  let id = NATION_TAGS[nation] ?? `N_${nation.toUpperCase().slice(0, 8)}`;
  if (st.countries[id]?.alive) id = newId(st, `N_${nation.slice(0, 4).toUpperCase()}`);
  const base = template ?? (from ? st.countries[from] : undefined);
  const name = reg?.en ?? `${nation[0].toUpperCase()}${nation.slice(1).replace(/_/g, ' ')} state`;
  const c: Country = {
    ...(JSON.parse(JSON.stringify(base ?? Object.values(st.countries)[0])) as Country),
    id, name, nameVi: reg?.vi ?? `Nhà nước ${nation}`, color: reg?.color ?? colorFor(id), kind: 'sovereign', tier: 'C', alive: true, formedAt: st.tick,
    decentralized: false, overlord: null, subjectType: null, capital: regionIds[0], reform: null, regimeChangedAt: st.tick, govLabel: 'new state',
    leader: { name: `Founding leader of ${name} (generated)`, born: st.date.y - 45, since: st.date.y, historical: false }, heir: null,
    legitimacy: 55, radicalism: 0.1, treasury: 0, debt: 0, igs: Object.fromEntries(IGS.map((g) => [g, { clout: 0, approval: 0 }])) as Country['igs'],
    army: { manpower: 1000, target: 1000, quality: 0.8, morale: 0.8, supply: 1 }, navy: { strength: 0, target: 0, quality: 0.5 },
    prestige: 5, infamy: 0, warExhaustion: 0, lastWarLost: null, claims: [], customsUnion: null, priorities: [], foreignPressure: 0, famine: 0,
    ai: { cooldowns: {}, lawHistory: [], recent: [], planTarget: null },
  };
  if (!template && base) c.laws = { ...base.laws, power: base.laws.power === 'autocracy' ? 'census_suffrage' : base.laws.power };
  st.countries[id] = c;
  for (const r of regionIds) transferRegion(st, r, id, cause);
  if (from && st.countries[from]) setRel(st, id, from, -40);
  updatePolitics(st, c, true);
  log(st, { type: 'state', text: `${name} is established (${cause}).`, textVi: `${c.nameVi} được thành lập (${cause}).`, actors: [id, ...(from ? [from] : [])] });
  return id;
}

export function makeSubject(st: GameState, subject: string, overlord: string, type: string) {
  const s = st.countries[subject]; if (!s || !st.countries[overlord]) return;
  s.overlord = overlord; s.subjectType = type;
  st.relations[relKey(subject, overlord)] = Math.max(st.relations[relKey(subject, overlord)] ?? 0, 20);
  log(st, { type: 'diplomacy', text: `${s.name} becomes a ${type} of ${st.countries[overlord].name}.`, textVi: `${s.nameVi} trở thành ${type} của ${st.countries[overlord].nameVi}.`, actors: [subject, overlord] });
}

export function annexCountry(st: GameState, target: string, by: string, cause: string) {
  for (const r of st.regions.filter((x) => x.owner === target)) transferRegion(st, r.id, by, cause);
}

function colorFor(id: string) { let h = 0; for (const ch of id) h = (h * 131 + ch.charCodeAt(0)) >>> 0; return `hsl(${h % 360} 45% 55%)`; }
