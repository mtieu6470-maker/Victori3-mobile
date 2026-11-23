// DECOL-01: Historical Mode decolonisation (CG-37 register, historical_data/decolonisation/independence.json).
//
// On an independence date, the record's regions that are still held as COLONIAL regions by any owner
// (isColonialRegion: outside the owner's 1836 home, or of another culture family) form a new state; a
// subject country holding most of them (e.g. a chartered-company state) is released instead. The new
// state starts with its own regions' productivity (rebaseProductivity), not its former metropole's.
// Sandbox Mode does not use the dates (nationalism-driven independence is a later slice).
import { data } from '../data/db';
import { dateStr, log } from '../core';
import { createNation } from '../world';
import { isColonialRegion } from './growth';
import type { GameState } from '../types';

/**
 * Design parameters. truceYears: the independence settlement is a treaty between the former owner and the
 * new state with a truce of at most 2 years (owner decision 2026-11-23); other countries are not bound,
 * and afterwards reconquest is possible. armyShare: initial army as a share of population.
 */
export const DECOL_PARAMS = { truceYears: 2, armyShare: 0.003 } as const;

/** DECOL-02 design parameters: years the player has to decide; unrest added in the regions if the player refuses. */
export const DECOL_PLAYER = { years: 10, refusalRadicalism: 0.15 } as const;

type DecolRecord = NonNullable<ReturnType<typeof data>['db']['decolonisation']>[number];
export const decolRecord = (id: string): DecolRecord | undefined => (data().db.decolonisation ?? []).find((r) => r.id === id);

/** The player's share of a record: its colonial regions held by the player, or a subject of the player holding them. */
export function playerDecolonisation(st: GameState, rec: DecolRecord): { regions: string[]; subject: string | null } {
  const d = data(); const p = st.player;
  if (!p) return { regions: [], subject: null };
  const regs = rec.regions.map((id) => st.regions[d.regionIndex.get(id) ?? -1]).filter(Boolean);
  const subject = regs.map((r) => st.countries[r.owner]).find((c) => c?.alive && c.overlord === p && c.subjectType !== 'personal_union');
  return { regions: regs.filter((r) => r.owner === p && isColonialRegion(st, r)).map((r) => r.id), subject: subject?.id ?? null };
}

/** Carries out the player's decision to grant independence (journal command). */
export function grantIndependence(st: GameState, rec: DecolRecord): boolean {
  const mine = playerDecolonisation(st, rec);
  if (mine.subject) { const s = st.countries[mine.subject]; s.overlord = null; s.subjectType = null; log(st, { type: 'state', text: `${s.name} is granted independence.`, textVi: `${s.nameVi} được trao độc lập.`, actors: [s.id, st.player!] }); return true; }
  if (!mine.regions.length) return false;
  const id = createNation(st, rec.iso.toLowerCase(), mine.regions, st.player!, 'independence', undefined, { en: rec.name, vi: rec.name_vi });
  const nc = st.countries[id];
  nc.truce = { with: st.player!, until: st.tick + DECOL_PARAMS.truceYears * 12 };
  nc.army.manpower = nc.army.target = Math.max(1000, Math.round(st.regions.filter((r) => r.owner === id).reduce((s, r) => s + r.pop, 0) * DECOL_PARAMS.armyShare));
  st.countries[st.player!].claims = st.countries[st.player!].claims.filter((x) => !mine.regions.includes(x));
  return true;
}

/** The player keeps the colony: independence sentiment turns into unrest (radicals) in those regions. */
export function refuseIndependence(st: GameState, rec: DecolRecord): void {
  const d = data();
  for (const id of rec.regions) { const r = st.regions[d.regionIndex.get(id) ?? -1]; if (r) r.radical = Math.min(0.9, r.radical + DECOL_PLAYER.refusalRadicalism); }
}

export function decolonisationMonth(st: GameState): void {
  if (st.mode !== 'historical') return;
  const d = data();
  const recs = d.db.decolonisation ?? [];
  if (!recs.length) return;
  st.decolonised ??= [];
  const today = dateStr(st.date);
  for (const rec of recs) {
    if (rec.date > today || st.decolonised.includes(rec.id)) continue;
    st.decolonised.push(rec.id);
    // DECOL-02 (owner 2026-11-23: the player decides): the player's colonies and subjects in this record are not
    // freed by date; a journal entry asks the player to grant independence or keep the colony (with unrest).
    const mine = playerDecolonisation(st, rec);
    if (mine.subject || mine.regions.length) {
      (st.journal ??= []).push({ id: `jd_${rec.id}`, kind: 'decolonisation', event: rec.id, country: st.player!, started: st.tick, expires: st.tick + DECOL_PLAYER.years * 12, status: 'active' });
      log(st, { type: 'decision', text: `An independence movement in ${rec.name} asks for statehood. Your decision.`, textVi: `Phong trào độc lập ở ${rec.name_vi} đòi lập quốc. Quyền quyết định thuộc về bạn.`, actors: [st.player!] });
    }
    const regs = rec.regions.map((id) => st.regions[d.regionIndex.get(id) ?? -1]).filter((r) => r && r.owner !== st.player && st.countries[r.owner]?.id !== mine.subject);
    // A subject state holding most of the territory becomes sovereign.
    const owners = new Map<string, number>();
    for (const r of regs) owners.set(r.owner, (owners.get(r.owner) ?? 0) + r.pop);
    const [mainOwner] = [...owners].sort((a, b) => b[1] - a[1])[0] ?? [];
    const sub = mainOwner ? st.countries[mainOwner] : undefined;
    if (sub?.alive && sub.overlord && sub.overlord !== st.player && sub.subjectType !== 'personal_union') {
      const lord = sub.overlord; sub.overlord = null; sub.subjectType = null;
      log(st, { type: 'state', text: `${sub.name} gains independence from ${st.countries[lord]?.name ?? lord}.`, textVi: `${sub.nameVi} giành độc lập từ ${st.countries[lord]?.nameVi ?? lord}.`, actors: [sub.id, lord] });
      continue;
    }
    const colonial = regs.filter((r) => isColonialRegion(st, r));
    if (!colonial.length) continue;
    const from = colonial[0].owner;
    const ids = colonial.sort((a, b) => b.pop - a.pop).map((r) => r.id);
    const id = createNation(st, rec.iso.toLowerCase(), ids, from, 'independence', undefined, { en: rec.name, vi: rec.name_vi });
    const nc = st.countries[id];
    nc.truce = { with: from, until: st.tick + DECOL_PARAMS.truceYears * 12 };
    // A defence force proportional to population (instead of a token garrison).
    const pop = st.regions.filter((r) => r.owner === id).reduce((s, r) => s + r.pop, 0);
    nc.army.manpower = nc.army.target = Math.max(1000, Math.round(pop * DECOL_PARAMS.armyShare));
  }
}
