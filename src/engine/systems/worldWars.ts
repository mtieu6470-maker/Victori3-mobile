// WW-01b: the two World Wars in Historical Mode (data: historical_data/wars/world_wars.json, CG-40).
//
// Owner 2026-11-23 chose to build World Wars 1 and 2 as in history. Each participant is the state that
// holds its historical capital region in the simulated world when its entry date comes (a holder that is
// not sovereign, dead, or already on the other side is skipped). Participants join on their entry date
// and leave on their exit date (separate peace, armistice, capitulation, side switch). The war is fought
// by the ordinary military system but has no AI peace: it ends on its historical date with the Allied
// side (sides[0]) victorious. Owner 2026-11-23: every listed participant takes part, including those that
// joined for territory and those that declared war and did nothing; the latter ('belligerent' status in
// CG-40) are nominal: in the war, but they neither fight nor are attacked. Treaties are WW-01c.
import { data } from '../data/db';
import { dateStr, log, newId } from '../core';
import { endWar } from './military';
import { isColonialRegion } from './growth';
import type { GameState, War } from '../types';

export function worldWarsMonth(st: GameState): void {
  if (st.mode !== 'historical') return;
  const wars = data().db.world_wars ?? [];
  if (!wars.length) return;
  st.worldWars ??= {};
  const today = dateStr(st.date);
  const d = data();
  for (const ww of wars) {
    const rec = (st.worldWars[ww.id] ??= { war: null, ended: false, joined: {} });
    if (rec.ended || today < ww.start.slice(0, 7) + '-01') continue;
    let war = rec.war ? st.wars.find((x) => x.id === rec.war) : undefined;
    // end on the historical date
    if (today > ww.end) {
      if (war) endWar(st, war, ww.winnerSide === 0 ? 'defenders' : 'attackers', 'historical armistice and surrender');
      rec.ended = true; continue;
    }
    // sides[0] (Allies) defend, sides[1] attack
    const sideOf = (i: number, w: War) => (i === 0 ? w.defenders : w.attackers);
    // Which engine state stands for a historical member: the holder of its capital region, if that region is
    // the holder's own capital; otherwise only for a principal combatant whose capital lies in the holder's
    // home (not colonial) territory. A state whose own capital stands for another member of this war joins
    // only as that member (e.g. the Moscow holder is the USSR, not Poland via Warsaw).
    // A holder of several members' capital regions stands for exactly one member: the one whose capital
    // is its own capital, else the one whose capital region is most populous (Moscow over Warsaw).
    const repOf = new Map<string, string>();
    {
      const held = new Map<string, { id: string; pop: number; own: boolean }[]>();
      for (const side of ww.sides) for (const m of side.members) {
        const r = st.regions[d.regionIndex.get(m.capitalRegion) ?? -1]; if (!r) continue;
        const list = held.get(r.owner) ?? []; list.push({ id: m.id, pop: r.pop, own: st.countries[r.owner]?.capital === m.capitalRegion }); held.set(r.owner, list);
      }
      for (const [h, list] of held) repOf.set(h, (list.find((x) => x.own) ?? [...list].sort((a, b) => b.pop - a.pop)[0]).id);
    }
    const stateFor = (m: (typeof ww.sides)[number]['members'][number]): string | null => {
      const r = st.regions[d.regionIndex.get(m.capitalRegion) ?? -1]; const c = r ? st.countries[r.owner] : undefined;
      if (!r || !c?.alive || c.decentralized || (c.overlord && st.countries[c.overlord]?.alive && c.subjectType !== 'tributary')) return null;
      if (repOf.get(c.id) !== m.id) return null;
      // the capital must be the holder's own capital, or (for a principal combatant) in its home territory
      return c.capital === m.capitalRegion || (m.status === 'principal_combatant' && !isColonialRegion(st, r)) || m.status !== 'principal_combatant' && c.capital === m.capitalRegion ? c.id : null;
    };
    const inWar = (w: War | undefined, id: string) => !!w && (w.attackers.members.includes(id) || w.defenders.members.includes(id));
    // entrants due now, per side
    const due: { si: number; m: (typeof ww.sides)[number]['members'][number]; id: string }[] = [];
    ww.sides.forEach((side, si) => {
      for (const m of side.members) {
        const joinedAs = rec.joined[m.id];
        if (joinedAs) {
          if (war && today > m.exit) { const s2 = sideOf(si, war); s2.members = s2.members.filter((x) => x !== joinedAs); if (s2.leader === joinedAs && s2.members.length) s2.leader = s2.members[0]; }
          continue;
        }
        if (today < m.entry.slice(0, 7) + '-01' || today > m.exit) continue;
        const id = stateFor(m); if (!id) continue;
        if (inWar(war, id) || Object.values(rec.joined).includes(id) || due.some((x) => x.id === id)) { rec.joined[m.id] = id; continue; }
        due.push({ si, m, id });
      }
    });
    // the war opens only when both sides have a participant
    if (!war && !(due.some((x) => x.si === 0) && due.some((x) => x.si === 1))) continue;
    if (!war) {
      war = { id: newId(st, 'war'), name: ww.id === 'WW1' ? 'World War I' : ww.id === 'WW2' ? 'World War II' : ww.id, kind: 'great', scripted: ww.id,
        attackers: { leader: '', members: [] }, defenders: { leader: '', members: [] }, goals: [], start: st.tick, score: 0, occupied: [], battles: 0, exhaustion: { a: 0, d: 0 } };
      st.wars.push(war); rec.war = war.id;
    }
    for (const { si, m, id } of due) {
      const c = st.countries[id]; const s2 = sideOf(si, war); s2.members.push(id); if (!s2.leader) s2.leader = id;
      // nominal belligerents (status 'belligerent' in CG-40: declared war, sent little or no force)
      if (m.status === 'belligerent') (war.nominal ??= []).push(id);
      rec.joined[m.id] = id;
      log(st, { type: 'war', text: `${c.name} enters ${war.name} (${ww.sides[si].name}).`, textVi: `${c.nameVi} tham gia ${ww.id === 'WW1' ? 'Thế chiến thứ nhất' : 'Thế chiến thứ hai'} (${si === 0 ? 'phe Đồng minh' : ww.id === 'WW1' ? 'phe Liên minh Trung tâm' : 'phe Trục'}).`, actors: [id], historical: true });
    }
  }
}
