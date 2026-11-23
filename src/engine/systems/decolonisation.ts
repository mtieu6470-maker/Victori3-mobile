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
    const regs = rec.regions.map((id) => st.regions[d.regionIndex.get(id) ?? -1]).filter(Boolean);
    // A subject state holding most of the territory becomes sovereign.
    const owners = new Map<string, number>();
    for (const r of regs) owners.set(r.owner, (owners.get(r.owner) ?? 0) + r.pop);
    const [mainOwner] = [...owners].sort((a, b) => b[1] - a[1])[0] ?? [];
    const sub = mainOwner ? st.countries[mainOwner] : undefined;
    if (sub?.alive && sub.overlord && sub.subjectType !== 'personal_union') {
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
