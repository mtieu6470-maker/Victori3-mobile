// REGIME-01a: Historical Mode regime changes and state formations 1836-1991 (CG-41 research; data
// historical_data/history/regime_changes.json). Owner 2026-11-23: Historical Mode must follow history
// (e.g. the October Revolution and the founding of the USSR), not keep 1836 regimes into the 20th century.
//
// On its date, an event applies to the state holding its historical capital region, provided that region
// is the state's own capital or part of its home (not colonial) territory; otherwise the simulated world
// has diverged and the event is skipped (recorded as applied). The state's laws change (existing law values;
// the 20th-century law set is REGIME-01b) and, for a new regime or state, its name. Independence events
// form a new state from the holder's regions of the listed cultures. The player's country is exempt.
import { data } from '../data/db';
import { dateStr, log } from '../core';
import { createNation } from '../world';
import { setLaw } from './politics';
import { isColonialRegion } from './growth';
import { DECOL_PARAMS } from './decolonisation';
import type { LawGroup } from '../data/dbTypes';
import type { GameState } from '../types';

export function regimesMonth(st: GameState): void {
  if (st.mode !== 'historical') return;
  const events = data().db.regime_changes ?? [];
  if (!events.length) return;
  st.regimesApplied ??= [];
  const today = dateStr(st.date);
  const d = data();
  for (const e of events) {
    if (e.date.slice(0, 7) + '-01' > today || st.regimesApplied.includes(e.id)) continue;
    st.regimesApplied.push(e.id);
    const region = st.regions[d.regionIndex.get(e.capitalRegion) ?? -1];
    const c = region ? st.countries[region.owner] : undefined;
    // The player's own country keeps its laws and name: history is not forced on the player.
    if (!region || !c?.alive || c.decentralized || c.id === st.player) continue;
    if (e.independence) {
      const regs = st.regions.filter((r) => r.owner === c.id && e.independence!.includes(r.culture)).sort((a, b) => (a.id === e.capitalRegion ? -1 : b.id === e.capitalRegion ? 1 : b.pop - a.pop)).map((r) => r.id);
      if (!regs.length) continue;
      const id = createNation(st, e.id.toLowerCase(), regs, c.id, 'independence', undefined, { en: e.name_en, vi: e.name_vi });
      const n = st.countries[id];
      // The new state was recognised by treaty (Tartu, Riga, Moscow 1920-21): the former owner renounces its
      // claims on the ceded regions, a truce of at most 2 years applies (owner rule), and the new state raises
      // an army in proportion to its population, as decolonised states do.
      c.claims = c.claims.filter((r) => !regs.includes(r));
      n.truce = { with: c.id, until: st.tick + DECOL_PARAMS.truceYears * 12 };
      n.army.manpower = n.army.target = Math.max(1000, Math.round(regs.reduce((s, r) => s + st.regions[d.regionIndex.get(r)!].pop, 0) * DECOL_PARAMS.armyShare));
      for (const [g, v] of Object.entries(e.laws)) setLaw(st, n, g as LawGroup, v, `founding (${e.id})`);
      continue;
    }
    if (c.capital !== e.capitalRegion && isColonialRegion(st, region)) continue;
    for (const [g, v] of Object.entries(e.laws)) if ((c.laws as Record<string, string>)[g] !== v) setLaw(st, c, g as LawGroup, v, `regime change (${e.id})`);
    const oldVi = c.nameVi;
    if (e.rename) { c.name = e.name_en; c.nameVi = e.name_vi; }
    c.regimeChangedAt = st.tick;
    delete c.crisis;
    log(st, { type: 'state', text: e.rename ? `${e.name_en} is proclaimed (${e.type.replace(/_/g, ' ')}).` : `${c.name}: ${e.type.replace(/_/g, ' ')}.`, textVi: e.rename ? `${oldVi} → ${e.name_vi}.` : `${c.nameVi}: ${e.name_vi}.`, actors: [c.id], historical: true });
  }
}
