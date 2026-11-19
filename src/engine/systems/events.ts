// Event system: exogenous shocks, leader mortality and succession, structural rules, decision windows,
// customs-union accession windows. Mode differences are confined to what MODES allows.
import { data } from '../data/db';
import type { Country, GameState } from '../types';
import { MODES } from '../modes';
import { chance, clamp, dateToTick, log, pick, rand, dateStr } from '../core';
import { createConditionEvalContext, evalCondition } from '../historical';
import { setLaw, generatedName } from './politics';
import { transferRegion, createNation } from '../world';
import { joinCustomsUnion } from './diplomacy';
import { LAW_GROUPS, type LawGroup } from '../data/dbTypes';
import { IGS } from '../types';

export function eventsMonth(st: GameState, decide: (c: Country, windowId: string, options: { id: string; historical: boolean }[], historicalWeight: number) => string | null) {
  const d = data(); const mode = MODES[st.mode]; const iso = dateStr(st.date);
  // ---- exogenous shocks
  if (mode.datedExogenousEvents) {
    for (const x of d.db.exogenous) if (dateToTick(x.date) === st.tick) applyExogenous(st, x.id, x.type, x.regions, x.duration_months ?? 12, x.mortality, x.yield_loss, x.severity_by_region, x.resource);
  } else {
    // stochastic analogues with the same mechanics (annual probabilities spread monthly)
    if (chance(st, 0.12 / 12)) { const r = pick(st, st.regions); applyExogenous(st, `random_drought_${st.tick}`, 'drought', [r.id, ...d.landNeighbors[d.regionIndex.get(r.id)!].slice(0, 3)], 12, undefined, 0.35 + rand(st) * 0.2); }
    if (chance(st, 0.08 / 12)) { const r = pick(st, st.regions); applyExogenous(st, `random_epidemic_${st.tick}`, 'epidemic', [r.id, ...d.landNeighbors[d.regionIndex.get(r.id)!].slice(0, 4)], 18, 0.01); }
    if (chance(st, 0.03 / 12)) { const r = pick(st, st.regions.filter((x) => x.terrain === 'pl' || x.terrain === 'hi')); applyExogenous(st, `random_blight_${st.tick}`, 'crop_blight', [r.id, ...d.landNeighbors[d.regionIndex.get(r.id)!].slice(0, 2)], 36, undefined, undefined, { [r.id]: 0.4 }); }
    for (const r of st.regions) if (r.hiddenGold && r.pop / Math.max(50, r.area) > 0.5 && chance(st, 0.004)) applyExogenous(st, `discovery_${r.id}`, 'resource_discovery', [r.id], 0, undefined, undefined, undefined, 'gold');
  }
  // ---- leaders: mortality and succession
  for (const c of Object.values(st.countries)) if (c.alive && !c.decentralized) succession(st, c);
  // ---- republic elections at the end of a term (both modes; Historical Mode names the recorded office-holder while the regime matches)
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized || c.laws.governance !== 'republic') continue;
    const ends = c.leader.termEnds ?? `${c.leader.since + 4}-03-01`;
    if (iso.slice(0, 7) < ends.slice(0, 7)) continue;
    const rec = mode.historicalSuccession && !c.regimeChangedAt ? d.leadersOf(c.id).find((l) => l.governance === 'republic' && l.from.slice(0, 7) <= iso.slice(0, 7) && l.to.slice(0, 7) > iso.slice(0, 7)) : undefined;
    c.leader = rec ? { name: rec.name, born: rec.born ? Number(rec.born.slice(0, 4)) : null, since: st.date.y, historical: true, diesOn: rec.died ?? null, termEnds: rec.end === 'term' ? rec.to : null }
      : { name: generatedName(st, c, 'president'), born: st.date.y - 50, since: st.date.y, historical: false, termEnds: `${st.date.y + 4}-03-01` };
    if (c.leader.termEnds === null) c.leader.termEnds = `${st.date.y + 4}-03-01`;
  }
  // ---- decision windows (Historical Mode only)
  if (mode.decisionWindows) {
    const conditionContext = createConditionEvalContext(st);
    for (const w of d.db.decision_windows) {
      if (st.firedEvents.includes(w.id)) continue;
      const c = st.countries[w.entity]; if (!c?.alive) continue;
      if (iso < w.window[0] || iso > w.window[1]) continue;
      if (!w.conditions.every((cond) => evalCondition(st, cond, c, conditionContext))) continue;
      const opt = decide(c, w.id, w.options.map((o) => ({ id: o.id, historical: o.historical })), w.historical_weight);
      if (!opt) continue; // player has a pending decision
      if (!applyWindowOption(st, w.id, opt)) continue;
      if (!st.firedEvents.includes(w.id)) st.firedEvents.push(w.id);
      st.counters.decisionWindowsFired++;
    }
    // customs-union accession windows
    for (const acc of d.db.zollverein.historical_accessions) {
      const key = `zv_${acc.entity}`; if (st.firedEvents.includes(key)) continue;
      const c = st.countries[acc.entity]; if (!c?.alive || c.customsUnion) continue;
      if (dateToTick(acc.date) > st.tick || dateToTick(acc.date) + 24 < st.tick) continue;
      const opt = decide(c, key, [{ id: 'join', historical: true }, { id: 'stay_out', historical: false }], 0.7);
      if (!opt) continue;
      if (opt === 'join' && !joinCustomsUnion(st, c, 'zollverein')) continue;
      if (!st.firedEvents.includes(key)) st.firedEvents.push(key);
      st.counters.decisionWindowsFired++;
    }
  }
}

interface DecisionResult { ok: boolean; reason?: string }

function exactOptionsMatch(
  offered: { id: string; historical: boolean }[],
  canonical: { id: string; historical: boolean }[],
): boolean {
  return Array.isArray(offered)
    && offered.length === canonical.length
    && offered.every((item, index) =>
      !!item
      && item.id === canonical[index].id
      && item.historical === canonical[index].historical,
    );
}

function countryById(st: GameState, id: unknown): Country | null {
  return typeof id === 'string' && id.length > 0 ? st.countries[id] ?? null : null;
}

/**
 * Preflight the full effect list before the first mutation. This prevents a bad
 * late effect from leaving earlier effects applied. Unknown/incomplete payloads
 * are rejected; the full rollback-capable transaction layer remains a separate
 * SA-04 task.
 */
function canApplyEffects(st: GameState, effects: unknown): boolean {
  if (!Array.isArray(effects)) return false;
  const d = data();

  for (const raw of effects) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
    const e = raw as Record<string, any>;

    switch (e.type) {
      case 'set_law': {
        const target = countryById(st, e.entity);
        if (!target?.alive || !LAW_GROUPS.includes(e.group as LawGroup) || typeof e.value !== 'string' || !e.value) return false;
        break;
      }
      case 'legitimacy': {
        const target = countryById(st, e.entity);
        if (!target?.alive || typeof e.delta !== 'number' || !Number.isFinite(e.delta)) return false;
        break;
      }
      case 'relation': {
        if (!countryById(st, e.a)?.alive || !countryById(st, e.b)?.alive || e.a === e.b
          || typeof e.delta !== 'number' || !Number.isFinite(e.delta)) return false;
        break;
      }
      case 'drop_claims': {
        const target = countryById(st, e.entity);
        if (!target?.alive || typeof e.against !== 'string' || !e.against
          || target.claims.some((regionId) => !d.regionIndex.has(regionId))) return false;
        break;
      }
      case 'transfer_region': {
        if (typeof e.region !== 'string' || !d.regionIndex.has(e.region) || typeof e.to !== 'string' || !e.to) return false;
        const region = st.regions[d.regionIndex.get(e.region)!];
        if (!region) return false;
        if (!st.countries[e.to]?.alive) {
          // The current source-backed create-target contract is specifically Luxembourg.
          // The runtime mapping below guarantees that the created stable ID is LUX.
          if (e.to !== 'LUX' || !e.create || e.create.id !== e.to
            || !countryById(st, e.create.subject_of)?.alive
            || e.create.subject_type !== 'personal_union') return false;
        }
        break;
      }
      case 'regime_change': {
        const target = countryById(st, e.entity);
        if (!target?.alive || !e.laws || typeof e.laws !== 'object' || Array.isArray(e.laws)) return false;
        const entries = Object.entries(e.laws);
        if (!entries.length || entries.some(([group, value]) =>
          !LAW_GROUPS.includes(group as LawGroup) || typeof value !== 'string' || value.length === 0,
        )) return false;
        break;
      }
      case 'merge': {
        if (!Array.isArray(e.entities) || e.entities.length !== 2
          || typeof e.entities[0] !== 'string' || typeof e.entities[1] !== 'string'
          || e.entities[0] === e.entities[1] || e.into !== 'ROM'
          || !countryById(st, e.entities[0])?.alive || !countryById(st, e.entities[1])?.alive
          || st.countries.ROM?.alive) return false;
        if (!st.regions.some((region) => region.owner === e.entities[0] || region.owner === e.entities[1])) return false;
        break;
      }
      case 'ig_approval': {
        const target = countryById(st, e.entity);
        if (!target?.alive || typeof e.ig !== 'string' || !IGS.includes(e.ig as (typeof IGS)[number])
          || typeof e.delta !== 'number' || !Number.isFinite(e.delta)) return false;
        break;
      }
      case 'relation_all_naval_powers': {
        if (!countryById(st, e.entity)?.alive || typeof e.delta !== 'number' || !Number.isFinite(e.delta)) return false;
        break;
      }
      default:
        return false;
    }
  }
  return true;
}

export function applyWindowOption(st: GameState, windowId: string, optionId: string): boolean {
  const d = data();
  const window = d.db.decision_windows.find((item) => item.id === windowId);
  if (!window) return false;
  const actor = st.countries[window.entity];
  const option = window.options.find((item) => item.id === optionId);
  if (!actor?.alive || !option || !canApplyEffects(st, option.effects)) return false;

  // All payloads and targets are checked above before the first state mutation.
  for (const raw of option.effects) {
    const e = raw as Record<string, any>;
    switch (e.type) {
      case 'set_law':
        setLaw(st, st.countries[e.entity], e.group as LawGroup, e.value, `decision: ${windowId}`);
        break;
      case 'legitimacy':
        st.countries[e.entity].legitimacy = clamp(st.countries[e.entity].legitimacy + e.delta, 0, 100);
        break;
      case 'relation': {
        const key = [e.a, e.b].sort().join('|');
        st.relations[key] = clamp((st.relations[key] ?? 0) + e.delta, -100, 100);
        break;
      }
      case 'drop_claims':
        st.countries[e.entity].claims = st.countries[e.entity].claims.filter((regionId) =>
          st.regions[d.regionIndex.get(regionId)!].owner !== e.against,
        );
        break;
      case 'transfer_region':
        if (st.regions[d.regionIndex.get(e.region)!].owner !== e.to) {
          if (e.create && !st.countries[e.to]?.alive) {
            const id = createNation(st, 'luxembourg', [e.region], st.regions[d.regionIndex.get(e.region)!].owner, windowId);
            const nation = st.countries[id];
            nation.overlord = e.create.subject_of;
            nation.subjectType = e.create.subject_type;
            nation.name = 'Grand Duchy of Luxembourg';
            nation.nameVi = 'Đại công quốc Luxembourg';
          } else {
            transferRegion(st, e.region, e.to, windowId);
          }
        }
        break;
      case 'regime_change':
        for (const [group, value] of Object.entries(e.laws)) {
          setLaw(st, st.countries[e.entity], group as LawGroup, value as string, `regime change (${windowId})`);
        }
        st.countries[e.entity].regimeChangedAt = st.tick;
        break;
      case 'merge': {
        const [sourceA, sourceB] = e.entities as [string, string];
        const into = createNation(st, 'romanian', st.regions.filter((region) =>
          region.owner === sourceA || region.owner === sourceB,
        ).map((region) => region.id), null, windowId, st.countries[sourceA]);
        if (into !== e.into) return false;
        st.countries[into].overlord = st.countries[sourceA].overlord;
        st.countries[into].subjectType = st.countries[sourceA].subjectType;
        break;
      }
      case 'ig_approval': {
        const ig = e.ig as (typeof IGS)[number];
        const target = st.countries[e.entity];
        target.igs[ig].approval = clamp(target.igs[ig].approval + e.delta, -10, 10);
        break;
      }
      case 'relation_all_naval_powers':
        for (const target of Object.values(st.countries)) {
          if (target.alive && target.navy.strength > 20) {
            const key = [e.entity, target.id].sort().join('|');
            st.relations[key] = clamp((st.relations[key] ?? 0) + e.delta, -100, 100);
          }
        }
        break;
    }
  }

  log(st, {
    type: 'decision',
    text: `${actor.name} decides: ${windowId} → ${optionId}.`,
    textVi: `${actor.nameVi} quyết định: ${windowId} → ${optionId}.`,
    actors: [actor.id],
    historical: option.historical,
    divergence: !option.historical,
  });
  if (!option.historical) {
    st.divergence.entries.push({
      tick: st.tick, date: dateStr(st.date), kind: 'decision',
      text: `${actor.name} chose the non-historical option '${optionId}' in ${windowId}`,
      actors: [actor.id],
    });
  }
  return true;
}

function invalidatePendingDecision(
  st: GameState,
  pendingIndex: number,
  pending: GameState['pendingPlayerDecisions'][number],
  actorId: string | undefined,
  reason: string,
): DecisionResult {
  st.pendingPlayerDecisions.splice(pendingIndex, 1);
  log(st, {
    type: 'decision',
    text: `Pending decision ${pending.windowId} was invalidated: ${reason}.`,
    textVi: `Quyết định đang chờ ${pending.windowId} đã bị vô hiệu hóa: ${reason}.`,
    actors: actorId ? [actorId] : [],
  });
  return { ok: false, reason };
}

/** Revalidates a player choice at the command boundary; failed choices are never consumed. */
export function resolvePlayerDecision(
  st: GameState,
  playerId: string,
  pendingId: string,
  optionId: string,
): DecisionResult {
  const pendingIndex = st.pendingPlayerDecisions.findIndex((item) => item.id === pendingId);
  if (pendingIndex < 0) return { ok: false, reason: 'No such pending decision' };
  const pending = st.pendingPlayerDecisions[pendingIndex];

  if (!MODES[st.mode].decisionWindows && !MODES[st.mode].historicalCustomsAccessions) {
    return { ok: false, reason: 'Historical decision windows are disabled in this mode' };
  }
  if (st.firedEvents.includes(pending.windowId)) {
    return invalidatePendingDecision(st, pendingIndex, pending, undefined, 'the event was already resolved');
  }

  if (pending.windowId.startsWith('zv_')) {
    const entityId = pending.windowId.slice(3);
    const accession = data().db.zollverein.historical_accessions.find((item) => item.entity === entityId);
    const canonicalOptions = [
      { id: 'join', historical: true },
      { id: 'stay_out', historical: false },
    ];
    if (!MODES[st.mode].historicalCustomsAccessions || !accession) {
      return invalidatePendingDecision(st, pendingIndex, pending, entityId, 'the accession definition no longer exists');
    }
    if (entityId !== playerId) return { ok: false, reason: 'This decision belongs to a different country' };
    if (!exactOptionsMatch(pending.options, canonicalOptions)) {
      return invalidatePendingDecision(st, pendingIndex, pending, entityId, 'the offered options no longer match the canonical definition');
    }
    if (!canonicalOptions.some((item) => item.id === optionId)) {
      return { ok: false, reason: 'The selected option was not offered; the pending decision is still available' };
    }
    const actor = st.countries[entityId];
    if (!actor?.alive || actor.customsUnion) {
      return invalidatePendingDecision(st, pendingIndex, pending, entityId, 'the actor no longer qualifies for accession');
    }
    const effectiveTick = dateToTick(accession.date);
    if (st.tick < effectiveTick || st.tick > effectiveTick + 24) {
      return invalidatePendingDecision(st, pendingIndex, pending, entityId, 'the accession window has expired or is not yet active');
    }
    if (optionId === 'join' && !joinCustomsUnion(st, actor, 'zollverein')) {
      return { ok: false, reason: 'Customs-union accession failed; the pending decision remains available' };
    }
    if (optionId === 'stay_out') {
      log(st, {
        type: 'decision',
        text: `${actor.name} decides to stay outside the Zollverein.`,
        textVi: `${actor.nameVi} quyết định đứng ngoài Zollverein.`,
        actors: [entityId],
        historical: false,
        divergence: true,
      });
      st.divergence.entries.push({
        tick: st.tick, date: dateStr(st.date), kind: 'decision',
        text: `${actor.name} chose to stay outside the Zollverein`,
        actors: [entityId],
      });
    }
  } else {
    const window = data().db.decision_windows.find((item) => item.id === pending.windowId);
    if (!window) {
      return invalidatePendingDecision(st, pendingIndex, pending, undefined, 'the canonical decision definition no longer exists');
    }
    if (window.entity !== playerId) return { ok: false, reason: 'This decision belongs to a different country' };
    const actor = st.countries[window.entity];
    if (!actor?.alive) {
      return invalidatePendingDecision(st, pendingIndex, pending, window.entity, 'the decision actor is no longer alive');
    }
    const canonicalOptions = window.options.map((item) => ({ id: item.id, historical: item.historical }));
    if (!exactOptionsMatch(pending.options, canonicalOptions)) {
      return invalidatePendingDecision(st, pendingIndex, pending, window.entity, 'the offered options no longer match the canonical definition');
    }
    if (!canonicalOptions.some((item) => item.id === optionId)) {
      return { ok: false, reason: 'The selected option was not offered; the pending decision is still available' };
    }
    const iso = dateStr(st.date);
    if (iso < window.window[0] || iso > window.window[1]) {
      return invalidatePendingDecision(st, pendingIndex, pending, window.entity, 'the decision window is no longer active');
    }
    const conditionContext = createConditionEvalContext(st);
    const conditionsHold = window.conditions.every((condition) => evalCondition(st, condition, actor, conditionContext));
    if (!conditionsHold) {
      return invalidatePendingDecision(st, pendingIndex, pending, window.entity, 'one or more causal preconditions no longer hold');
    }
    if (!applyWindowOption(st, pending.windowId, optionId)) {
      return { ok: false, reason: 'The selected option has an unsupported or invalid effect; the pending decision remains available' };
    }
  }

  // Consume and mark fired only after a validated, successfully applied option.
  st.pendingPlayerDecisions.splice(pendingIndex, 1);
  st.firedEvents.push(pending.windowId);
  st.counters.decisionWindowsFired++;
  return { ok: true };
}

function applyExogenous(st: GameState, id: string, type: string, regions: string[], months: number, mortality?: number, yieldLoss?: number, sev?: Record<string, number>, resource?: string) {
  const d = data();
  for (const rid of regions) {
    const r = st.regions[d.regionIndex.get(rid)!]; if (!r) continue;
    if (type === 'epidemic') r.epidemic = { until: st.tick + months, rate: (mortality ?? 0.01) / 12 };
    else if (type === 'drought') r.blight = { until: st.tick + months, severity: yieldLoss ?? 0.4 };
    else if (type === 'crop_blight') r.blight = { until: st.tick + months, severity: sev?.[rid] ?? 0.3 };
    else if (type === 'resource_discovery' && resource && !r.res.includes(resource)) { r.res.push(resource); r.hiddenGold = false; }
  }
  const owners = [...new Set(regions.map((x) => st.regions[d.regionIndex.get(x)!]?.owner).filter(Boolean))] as string[];
  log(st, { type: 'disaster', text: `${type.replace('_', ' ')} (${id}) strikes ${regions.slice(0, 3).join(', ')}${regions.length > 3 ? '…' : ''}.`, textVi: `${type} (${id}) xảy ra tại ${regions.slice(0, 3).join(', ')}.`, actors: owners });
}

function succession(st: GameState, c: Country) {
  const d = data(); const mode = MODES[st.mode]; const iso = dateStr(st.date);
  const L = c.leader;
  let dies = false;
  if (L.historical && L.diesOn !== undefined && L.diesOn !== null && mode.historicalSuccession) dies = L.diesOn.slice(0, 7) <= iso.slice(0, 7);
  else if (L.born) { const age = st.date.y - L.born; const q = age < 40 ? 0.008 : age < 60 ? 0.02 : age < 70 ? 0.045 : age < 80 ? 0.1 : 0.2; dies = chance(st, q / 12); }
  if (L.historical && mode.historicalSuccession && L.diesOn === undefined) {
    const rec = d.leadersOf(c.id).find((l) => l.name.startsWith(L.name.split(' (')[0]) || L.name.startsWith(l.name.split(' (')[0]));
    L.diesOn = rec?.died ?? null;
  }
  if (!dies) return;
  // structural rule: Salic law separates Hanover from Britain when a woman inherits the British crown
  const heir = c.heir;
  let next: Country['leader'] | null = null;
  if (mode.historicalSuccession && !c.regimeChangedAt) {
    const recs = d.leadersOf(c.id);
    const base = (n: string) => n.split(' (')[0];
    const rec = recs.filter((l) => l.governance === c.laws.governance && !l.after_regime_change && base(l.name) !== base(L.name) && l.to.slice(0, 7) > iso.slice(0, 7) && Number(l.from.slice(0, 4)) - st.date.y <= 2).sort((a, b) => a.from.localeCompare(b.from))[0];
    if (rec) next = { name: rec.name, born: rec.born ? Number(rec.born.slice(0, 4)) : null, since: st.date.y, historical: true, diesOn: rec.died ?? null, female: /Victoria|Isabella|Maria|Wilhelmina/.test(rec.name) };
  }
  if (!next && heir && (heir.born === null || heir.born <= st.date.y - 10)) next = { name: heir.name, born: heir.born, since: st.date.y, historical: true, female: heir.female, diesOn: null };
  if (!next) next = { name: generatedName(st, c, c.laws.governance === 'republic' ? 'president' : 'ruler'), born: st.date.y - 25 - Math.floor(rand(st) * 30), since: st.date.y, historical: false };
  log(st, { type: 'succession', text: `${L.name} of ${c.name} dies; succeeded by ${next.name}.`, textVi: `${L.name} (${c.nameVi}) qua đời; người kế vị: ${next.name}.`, actors: [c.id] });
  c.leader = next; c.heir = null;
  if (c.id === 'GBR' && next.female) for (const o of Object.values(st.countries)) if (o.overlord === 'GBR' && o.subjectType === 'personal_union') { o.overlord = null; o.subjectType = null; log(st, { type: 'diplomacy', text: `Salic law: ${o.name} separates from the British crown.`, textVi: `Luật Salic: ${o.nameVi} tách khỏi vương miện Anh.`, actors: [o.id, 'GBR'] }); }
  for (const s of Object.values(st.countries)) if (s.overlord === c.id && s.subjectType === 'personal_union' && s.leader.name === L.name) s.leader = { ...next };
}
