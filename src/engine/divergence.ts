// Divergence tracking & Historical Similarity Score. Measurement only — never feeds back into AI or rules.
// Computed in both modes so that Historical and Sandbox runs can be compared with the same yardstick.
import { data } from './data/db';
import type { GameState } from './types';
import { dateStr, dateToTick, clamp } from './core';
import { evalCondition } from './historical';

export function territorialSimilarity(st: GameState): number {
  const d = data(); const iso = dateStr(st.date);
  let match = 0, tot = 0;
  for (const r of st.regions) {
    const h = d.historicalOwner(r.id, iso);
    const w = Math.sqrt(r.pop);
    tot += w; if (d.equivalent(h, r.owner)) match += w;
  }
  return tot ? match / tot : 0;
}

export function milestoneScore(st: GameState): number {
  let got = 0, tot = 0;
  for (const m of data().db.milestones) {
    if (dateToTick(m.check_date) > st.tick) continue;
    const s = st.divergence.milestones[m.id]; tot += m.weight;
    if (s?.status === 'achieved') got += m.weight * (s.credit ?? 1);
  }
  return tot ? got / tot : 1;
}

export function divergenceMonth(st: GameState) {
  const d = data(); const iso = dateStr(st.date);
  for (const m of d.db.milestones) {
    const due = dateToTick(m.check_date); const lastChance = due + m.tolerance_years * 12;
    const cur = st.divergence.milestones[m.id] ?? { status: 'pending' as const };
    if (cur.status !== 'pending' || st.tick < due) { st.divergence.milestones[m.id] = cur; continue; }
    if (evalCondition(st, m.test)) {
      const late = Math.max(0, st.tick - due) / 12;
      st.divergence.milestones[m.id] = { status: 'achieved', date: iso, credit: clamp(1 - late / Math.max(1, m.tolerance_years + 1), 0.2, 1) };
    } else if (st.tick >= lastChance) {
      st.divergence.milestones[m.id] = { status: 'missed', date: iso };
      st.divergence.entries.push({ tick: st.tick, date: iso, kind: 'milestone_missed', text: `Historical milestone not reached: ${m.label}`, actors: [] });
    } else st.divergence.milestones[m.id] = cur;
  }
  // non-historical territorial changes this month
  for (const t of st.territoryLog) if (t.tick === st.tick && t.historicalMatch === false) {
    st.divergence.entries.push({ tick: st.tick, date: iso, kind: 'territory', text: `${t.region}: ${t.from} → ${t.to} (${t.cause}) differs from the historical owner`, actors: [t.from, t.to] });
  }
  if (st.date.m === 1) {
    const terr = territorialSimilarity(st), ms = milestoneScore(st);
    st.divergence.similarity.push({ date: iso, territorial: terr, milestones: ms, combined: 0.6 * terr + 0.4 * ms });
  }
  if (st.divergence.entries.length > 3000) st.divergence.entries.splice(0, st.divergence.entries.length - 3000);
}
