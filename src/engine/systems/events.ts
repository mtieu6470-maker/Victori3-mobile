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
import type { LawGroup } from '../data/dbTypes';

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
      st.firedEvents.push(w.id); st.counters.decisionWindowsFired++;
      applyWindowOption(st, w.id, opt);
    }
    // customs-union accession windows
    for (const acc of d.db.zollverein.historical_accessions) {
      const key = `zv_${acc.entity}`; if (st.firedEvents.includes(key)) continue;
      const c = st.countries[acc.entity]; if (!c?.alive || c.customsUnion) continue;
      if (dateToTick(acc.date) > st.tick || dateToTick(acc.date) + 24 < st.tick) continue;
      const opt = decide(c, key, [{ id: 'join', historical: true }, { id: 'stay_out', historical: false }], 0.7);
      if (!opt) continue;
      st.firedEvents.push(key); st.counters.decisionWindowsFired++;
      if (opt === 'join') joinCustomsUnion(st, c, 'zollverein');
    }
  }
}

export function applyWindowOption(st: GameState, windowId: string, optionId: string) {
  const d = data(); const w = d.db.decision_windows.find((x) => x.id === windowId); if (!w) return;
  const c = st.countries[w.entity]; const o = w.options.find((x) => x.id === optionId); if (!o || !c) return;
  for (const e of o.effects as Record<string, any>[]) {
    switch (e.type) {
      case 'set_law': setLaw(st, st.countries[e.entity], e.group as LawGroup, e.value, `decision: ${windowId}`); break;
      case 'legitimacy': st.countries[e.entity].legitimacy = clamp(st.countries[e.entity].legitimacy + e.delta, 0, 100); break;
      case 'relation': { const k = [e.a, e.b].sort().join('|'); st.relations[k] = clamp((st.relations[k] ?? 0) + e.delta, -100, 100); break; }
      case 'drop_claims': st.countries[e.entity].claims = st.countries[e.entity].claims.filter((r) => st.regions[d.regionIndex.get(r)!].owner !== e.against); break;
      case 'transfer_region': if (st.regions[d.regionIndex.get(e.region)!].owner !== e.to) { if (e.create && !st.countries[e.to]?.alive) { const id = createNation(st, 'luxembourg', [e.region], st.regions[d.regionIndex.get(e.region)!].owner, windowId); const n = st.countries[id]; n.overlord = e.create.subject_of; n.subjectType = e.create.subject_type; n.name = 'Grand Duchy of Luxembourg'; n.nameVi = 'Đại công quốc Luxembourg'; } else transferRegion(st, e.region, e.to, windowId); } break;
      case 'regime_change': for (const [g, v] of Object.entries(e.laws)) setLaw(st, st.countries[e.entity], g as LawGroup, v as string, `regime change (${windowId})`); st.countries[e.entity].regimeChangedAt = st.tick; break;
      case 'merge': { const [a, b] = e.entities; const into = createNation(st, 'romanian', st.regions.filter((r) => r.owner === a || r.owner === b).map((r) => r.id), null, windowId, st.countries[a]); st.countries[into].overlord = st.countries[a].overlord; st.countries[into].subjectType = st.countries[a].subjectType; break; }
      case 'ig_approval': break;
      case 'relation_all_naval_powers': for (const x of Object.values(st.countries)) if (x.alive && x.navy.strength > 20) { const k = [e.entity, x.id].sort().join('|'); st.relations[k] = clamp((st.relations[k] ?? 0) + e.delta, -100, 100); } break;
    }
  }
  log(st, { type: 'decision', text: `${c.name} decides: ${windowId} → ${optionId}.`, textVi: `${c.nameVi} quyết định: ${windowId} → ${optionId}.`, actors: [c.id], historical: o.historical, divergence: !o.historical });
  if (!o.historical) st.divergence.entries.push({ tick: st.tick, date: dateStr(st.date), kind: 'decision', text: `${c.name} chose the non-historical option '${optionId}' in ${windowId}`, actors: [c.id] });
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
