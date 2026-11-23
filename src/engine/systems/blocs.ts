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

/** DECOL-03: the Cold War camp a country belongs to through its military bloc (null = none). */
export function campOfCountry(st: GameState, id: string): string | null {
  const t = st.treaties.find((x) => x.source?.startsWith('bloc:') && x.members.includes(id));
  return t ? campOf(t.source!.slice(5)) : null;
}
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
  organisationsMonth(st, today);
}

/**
 * BLOC-03: economic blocs and political organisations (CG-46b). Membership is recorded for the holders of the
 * member capitals (shown in the UI). The EEC's customs union is a real common market (V3-style customs union):
 * the founders join on 1 July 1968, later members on their accession. The player is never enrolled.
 */
export const EEC_UNION = 'cu_EEC_EU';
function organisationsMonth(st: GameState, today: string): void {
  const orgs = data().db.organisations ?? [];
  if (!orgs.length) return;
  st.organisations ??= {};
  for (const o of orgs) {
    const active = o.founded <= today && (!o.dissolved || today < o.dissolved);
    const members: string[] = []; const union: string[] = [];
    if (active) for (const m of o.members) {
      if (m.from > today || (m.to && today >= m.to)) continue;
      const c = holderOfCapital(st, m.capital);
      if (!c || c.id === st.player || members.includes(c.id)) continue;
      members.push(c.id);
      if (m.customsUnionFrom && m.customsUnionFrom <= today) union.push(c.id);
    }
    if (members.length) st.organisations[o.id] = members; else delete st.organisations[o.id];
    if (o.id === 'EEC_EU') eecUnion(st, union);
  }
}

function leaveUnion(st: GameState, id: string) {
  const c = st.countries[id]; if (!c?.customsUnion) return;
  const u = st.treaties.find((t) => t.id === c.customsUnion);
  c.customsUnion = null;
  if (!u) return;
  u.members = u.members.filter((m) => m !== id);
  if (u.leader === id) u.leader = u.members[0];
  if (u.members.length < 2) { for (const m of u.members) if (st.countries[m]) st.countries[m].customsUnion = null; st.treaties = st.treaties.filter((t) => t.id !== u.id); }
}

function eecUnion(st: GameState, want: string[]) {
  let u = st.treaties.find((t) => t.id === EEC_UNION);
  if (!u && want.length >= 2) {
    u = { id: EEC_UNION, type: 'customs_union', members: [], leader: want[0], start: st.tick, source: 'bloc:EEC_EU' };
    st.treaties.push(u);
    log(st, { type: 'economy', text: 'The EEC customs union is completed.', textVi: 'Liên minh thuế quan của Cộng đồng Kinh tế châu Âu hoàn thành.', actors: want.slice(0, 6), historical: true });
  }
  if (!u) return;
  for (const id of want) if (!u.members.includes(id)) { if (st.countries[id].customsUnion !== EEC_UNION) leaveUnion(st, id); u.members.push(id); st.countries[id].customsUnion = EEC_UNION; }
  for (const id of [...u.members]) if (!want.includes(id)) { st.countries[id] && (st.countries[id].customsUnion = null); u.members = u.members.filter((m) => m !== id); }
  if (u.leader && !u.members.includes(u.leader)) u.leader = u.members[0];
  if (u.members.length < 2) { for (const m of u.members) if (st.countries[m]) st.countries[m].customsUnion = null; st.treaties = st.treaties.filter((t) => t.id !== EEC_UNION); }
}
