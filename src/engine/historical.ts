// Historical layer (Historical Mode only): evaluates Historical Strategic Priorities and decision windows against
// the CURRENT simulated world. It only returns biases; it never executes actions.
import { data } from './data/db';
import type { Condition, StrategicPriority } from './data/dbTypes';
import type { Country, GameState } from './types';
import { MODES } from './modes';
import { dateStr, parseDate } from './core';
import { coreNationOf } from './systems/population';

export function evalCondition(st: GameState, c: Condition, self?: Country): boolean {
  const d = data(); const C = (id: unknown) => st.countries[String(id)];
  const own = (region: unknown) => st.regions[d.regionIndex.get(String(region)) ?? -1]?.owner;
  switch (c.type) {
    case 'exists': return !!C(c.entity)?.alive;
    case 'exists_independent': return !!C(c.entity)?.alive && !C(c.entity)!.overlord;
    case 'owns': return own(c.region) === c.entity;
    case 'owner_in': return (c.entities as string[]).some((e) => d.equivalent(own(c.region) ?? '', e));
    case 'owner_not': return !(c.entities as string[]).some((e) => d.equivalent(own(c.region) ?? '', e));
    case 'same_owner': { const os = (c.regions as string[]).map(own); return os.every((o) => o && o === os[0]); }
    case 'law': return C(c.entity)?.laws[c.group as keyof Country['laws']] === c.value;
    case 'law_not': return !!C(c.entity) && C(c.entity)!.laws[c.group as keyof Country['laws']] !== c.value;
    case 'not_at_war': return !st.wars.some((w) => (w.attackers.members.includes(String(c.a)) && w.defenders.members.includes(String(c.b))) || (w.attackers.members.includes(String(c.b)) && w.defenders.members.includes(String(c.a))));
    case 'not_subject_of': return C(c.a)?.overlord !== c.b;
    case 'regime_changed': case 'regime_changed_since_start': return C(c.entity)?.regimeChangedAt !== null && C(c.entity)?.regimeChangedAt !== undefined;
    case 'lost_war_recently': { const x = C(c.entity); return !!x && x.lastWarLost !== null && st.tick - x.lastWarLost <= Number(c.years) * 12; }
    case 'legitimacy_below': return (C(c.entity)?.legitimacy ?? 100) < Number(c.value);
    case 'radicalism_above': return (C(c.entity)?.radicalism ?? 0) > Number(c.value);
    case 'food_shortage': return (C(c.entity)?.famine ?? 0) > 0.03;
    case 'ig_clout_above': return (C(c.entity)?.igs[c.ig as keyof Country['igs']]?.clout ?? 0) > Number(c.value);
    case 'foreign_naval_pressure': return (C(c.entity)?.foreignPressure ?? 0) >= Number(c.value);
    case 'at_war_with_rebels': return st.wars.some((w) => w.kind === 'civil' && w.defenders.members.includes(String(c.entity)));
    case 'leader_changed_since_start': { const x = C(c.entity); return !!x && x.leader.since > 1836; }
    case 'rank_at_most': return true; // evaluated by the caller with power rankings when needed
    case 'gov_power': return C(c.entity)?.laws.power === c.value;
    case 'foreign_pressure': return (C(c.entity)?.foreignPressure ?? 0) > 0.8;
    case 'any': return (c.of as Condition[]).some((x) => evalCondition(st, x, self));
    case 'all': return (c.of as Condition[]).every((x) => evalCondition(st, x, self));
    case 'count_owner_european': { const eu = new Set(d.db.european_powers); return (c.regions as string[]).filter((r) => eu.has(own(r) ?? '')).length >= Number(c.min); }
    default: return false;
  }
}

/** Active priorities of a country at the current date whose conditions hold. Empty in Sandbox Mode. */
export function activePriorities(st: GameState, c: Country): StrategicPriority[] {
  if (!MODES[st.mode].historicalPriorities) return [];
  const e = data().entity.get(c.id); if (!e) return [];
  const y = st.date.y;
  return e.priorities.filter((p) => {
    const [a, b] = p.window.map((x) => parseDate(x).y);
    if (y < a || y > b) return false;
    return (p.conditions ?? []).every((cond) => evalCondition(st, cond, c));
  });
}

/** Utility bias for an AI option. kind/target are matched against priority goals. */
export function historicalBias(st: GameState, c: Country, kind: string, target?: string): number {
  const pr = activePriorities(st, c); if (!pr.length) return 0;
  const scale = MODES[st.mode].priorityBiasScale;
  let b = 0;
  for (const p of pr) {
    const t = p.target as unknown;
    const hitsRegionList = Array.isArray(t) && target ? (t as string[]).includes(target) : false;
    const hitsEntity = typeof t === 'string' && target ? t === target || (t === 'STRONGEST_CONTINENTAL' && target === strongestContinental(st, c)) : false;
    const lawT = t && typeof t === 'object' && !Array.isArray(t) ? (t as { group: string; value: string }) : null;
    switch (kind) {
      case 'war_region': if ((p.goal === 'conquer_region' || p.goal === 'annex_region' || p.goal === 'colonize') && hitsRegionList) b += p.weight; break;
      case 'war_subjugate': if (p.goal === 'subjugate' && hitsEntity) b += p.weight; break;
      case 'war_open_market': if (p.goal === 'force_open_market' && hitsEntity) b += p.weight; break;
      case 'war_unify': if (p.goal === 'unify_nation' && t === target) b += p.weight; break;
      case 'war_independence': if (p.goal === 'independence' && hitsEntity) b += p.weight; break;
      case 'avoid_war': if (p.goal === 'avoid_war_with' && hitsEntity) b += p.weight; break;
      case 'contain': if (p.goal === 'contain_power' && hitsEntity) b += p.weight; break;
      case 'support': if (p.goal === 'support_power' && hitsEntity) b += p.weight; break;
      case 'ally': if ((p.goal === 'alliance_with' || p.goal === 'support_power') && hitsEntity) b += p.weight; break;
      case 'law_to': if (p.goal === 'reform_law' && lawT && target === `${lawT.group}:${lawT.value}`) b += p.weight; break;
      case 'law_keep': if (p.goal === 'keep_law' && lawT && target?.startsWith(`${lawT.group}:`)) b += p.weight; break;
      case 'industrialize': if (p.goal === 'industrialize') b += p.weight; break;
      case 'naval': if (p.goal === 'naval_power') b += p.weight; break;
      case 'customs_union': if (p.goal === 'customs_union') b += p.weight; break;
      case 'keep_region': if (p.goal === 'keep_region' && hitsRegionList) b += p.weight; break;
    }
  }
  if (b) st.counters.historicalBiasApplied++;
  return b * scale;
}

export function strongestContinental(st: GameState, self: Country): string | undefined {
  let best: Country | undefined; let bp = -1;
  for (const c of Object.values(st.countries)) if (c.alive && c.id !== self.id && ['FRA', 'RUS', 'PRU', 'AUS', 'GER'].includes(c.id)) { const p = c.gdp + c.army.manpower * 2e4; if (p > bp) { bp = p; best = c; } }
  return best?.id;
}

export function nationOf(st: GameState, c: Country) { return coreNationOf(st, c); }
export const isoNow = (st: GameState) => dateStr(st.date);
