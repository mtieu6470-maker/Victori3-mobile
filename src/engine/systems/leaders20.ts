// LEAD-01: 20th-century heads of state and effective leaders in Historical Mode (CG-43 research; data
// historical_data/leaders/leaders_20c.json). Owner 2026-11-23: when the regime changes, so does the person
// at the top (a tsar gives way to a party leader); history should name the real office-holders.
//
// A record belongs to the state holding its capital region (its own capital or home territory, as for regime
// changes), and only while that state follows the historical course: the latest regime proclamation
// (a new regime or state) for one of its regions must have been carried out by it. If the player declined
// the October Revolution, Lenin does not appear; the regime's generated leaders remain.
// One-party and dictatorial regimes show the effective leader (e.g. Stalin rather than Kalinin); monarchies
// and constitutional republics show the head of state, with the effective leader where no head of state is
// recorded. While a record holds, the leader neither dies at random nor is replaced by a generated election.
import { data } from '../data/db';
import { dateStr, log, tickToDate } from '../core';
import { isColonialRegion } from './growth';
import { regimeEntryKind } from './regimes';
import type { Country, GameState } from '../types';

type Rec = NonNullable<ReturnType<typeof data>['db']['leaders_20c']>[number];

const prefersEffective = (c: Country) => c.laws.power === 'one_party_state' || (c.laws.governance === 'republic' && c.laws.power === 'autocracy');

/** Whether the holder follows the historical course for regime proclamations on its own regions. */
export function onHistoricalCourse(st: GameState, c: Country, today = dateStr(st.date)): boolean {
  const d = data();
  const own = (id: string) => { const r = st.regions[d.regionIndex.get(id) ?? -1]; return r?.owner === c.id && (c.capital === r.id || !isColonialRegion(st, r)); };
  // a state formed later (independence, a partition) is not judged by regime events from before it existed
  const born = c.formedAt ? dateStr(tickToDate(c.formedAt)) : '';
  const latest = (d.db.regime_changes ?? []).filter((e) => e.date <= today && e.date >= born && regimeEntryKind(e) === 'proclaim' && own(e.capitalRegion))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return true;
  return (st.journal ?? []).some((j) => j.event === latest.id && j.country === c.id && j.status === 'completed');
}

/** The record that should lead `c` today, if any. */
export function historicalLeaderFor(st: GameState, c: Country): Rec | null {
  if (st.mode !== 'historical') return null;
  const d = data(); const today = dateStr(st.date);
  const recs = (d.db.leaders_20c ?? []).filter((l) => l.from.slice(0, 7) + '-01' <= today && (!l.to || l.to > today));
  if (!recs.length) return null;
  const mine = recs.filter((l) => {
    const r = st.regions[d.regionIndex.get(l.capitalRegion) ?? -1];
    return r?.owner === c.id && (c.capital === r.id || !isColonialRegion(st, r));
  });
  if (!mine.length || !onHistoricalCourse(st, c, today)) return null;
  const order = prefersEffective(c) ? ['effective_leader', 'head_of_state'] : ['head_of_state', 'effective_leader'];
  for (const role of order) { const r = mine.filter((l) => l.role === role).sort((a, b) => b.from.localeCompare(a.from))[0]; if (r) return r; }
  return null;
}

/** While a CG-43 record holds, natural succession and generated elections leave the leader alone. */
export function leaderHeldByRecord(st: GameState, c: Country): boolean {
  return st.mode === 'historical' && !!c.leader.recordUntil && dateStr(st.date) < c.leader.recordUntil;
}

export function leaders20Month(st: GameState): void {
  if (st.mode !== 'historical' || !(data().db.leaders_20c ?? []).length || st.date.y < 1900) return;
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized) continue;
    const rec = historicalLeaderFor(st, c);
    if (!rec) { if (c.leader.recordUntil) delete c.leader.recordUntil; continue; }
    if (c.leader.name === rec.name && c.leader.titleVi === rec.title_vi) continue;
    const old = c.leader.name;
    c.leader = { name: rec.name, born: rec.born ? Number(rec.born.slice(0, 4)) : null, since: Number(rec.from.slice(0, 4)), historical: true, diesOn: rec.died ?? null, titleVi: rec.title_vi, recordUntil: rec.to ?? '9999-12-31' };
    c.heir = null;
    if (old !== rec.name) log(st, { type: 'succession', text: `${rec.name} (${rec.title_en}) leads ${c.name}.`, textVi: `${rec.name} (${rec.title_vi}) lãnh đạo ${c.nameVi}.`, actors: [c.id], historical: true });
  }
}
