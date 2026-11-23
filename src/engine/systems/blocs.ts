// BLOC-01: Cold War military blocs in Historical Mode (data historical_data/diplomacy/blocs.json). Owner 2026-11-23:
// "the two Cold War alliance camps". Each bloc is one multilateral alliance treaty (`source: 'bloc:<id>'`) whose
// members are the holders of the listed capital regions during their membership (own capital or home
// territory). Allies defend each other through the ordinary alliance rules (war joining, AI war estimates);
// the AI does not break a bloc (breakAlliance only dissolves two-member alliances). The player's country is
// never enrolled automatically; a bloc dissolves on its date.
import { data } from '../data/db';
import { dateStr, log } from '../core';
import { holderOfCapital } from './settlements';
import type { GameState } from '../types';

export const blocTreatyId = (id: string) => `bloc_${id}`;
const campOf = (id: string) => data().db.blocs?.find((b) => b.id === id)?.camp ?? 'west';

export function blocsMonth(st: GameState): void {
  if (st.mode !== 'historical') return;
  const blocs = data().db.blocs ?? [];
  if (!blocs.length) return;
  const today = dateStr(st.date);
  for (const b of blocs) {
    const tid = blocTreatyId(b.id);
    let t = st.treaties.find((x) => x.id === tid);
    const active = b.founded <= today && (!b.dissolved || today < b.dissolved);
    if (!active) {
      if (t) { st.treaties = st.treaties.filter((x) => x.id !== tid); log(st, { type: 'diplomacy', text: `${b.name_en} is dissolved.`, textVi: `${b.name_vi} giải thể.`, actors: t.members.slice(0, 6), historical: true }); }
      continue;
    }
    const want: string[] = [];
    for (const m of b.members) {
      if (m.from > today || (m.to && today >= m.to)) continue;
      const c = holderOfCapital(st, m.capital);
      if (!c || c.id === st.player || want.includes(c.id)) continue;
      // never in blocs of both camps at once (e.g. an undivided Germany holding both Bonn and Berlin)
      if (st.treaties.some((x) => x.id !== tid && x.source?.startsWith('bloc:') && x.members.includes(c.id) && campOf(x.source.slice(5)) !== (b.camp ?? 'west'))) continue;
      want.push(c.id);
    }
    if (!t) {
      if (want.length < 2) continue;
      t = { id: tid, type: 'alliance', members: [], leader: want[0], start: st.tick, source: `bloc:${b.id}` };
      st.treaties.push(t);
      log(st, { type: 'diplomacy', text: `${b.name_en} is founded.`, textVi: `${b.name_vi} được thành lập.`, actors: want.slice(0, 6), historical: true });
    }
    for (const id of want) if (!t.members.includes(id)) { t.members.push(id); if (t.members.length > 1) log(st, { type: 'diplomacy', text: `${st.countries[id].name} joins ${b.name_en}.`, textVi: `${st.countries[id].nameVi} gia nhập ${b.name_vi}.`, actors: [id], historical: true }); }
    for (const id of [...t.members]) if (!want.includes(id)) { t.members = t.members.filter((x) => x !== id); log(st, { type: 'diplomacy', text: `${st.countries[id]?.name ?? id} leaves ${b.name_en}.`, textVi: `${st.countries[id]?.nameVi ?? id} rời ${b.name_vi}.`, actors: [id], historical: true }); }
    if (t.leader && !t.members.includes(t.leader)) t.leader = t.members[0];
  }
}
