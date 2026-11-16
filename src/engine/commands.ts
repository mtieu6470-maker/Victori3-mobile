// Player command API. Every command calls the SAME functions the AI uses, so the player plays by the AI's rules.
// The UI layer must only issue these commands (no rule logic in the UI).
import type { LawGroup } from './data/dbTypes';
import type { Building, GameState, WarGoal } from './types';
import { build, canBuild, buildCost, setProductionMethod, queueConstruction, cancelConstruction } from './systems/economy';
import { startReform, reformSupport } from './systems/politics';
import { availableTechs } from './systems/technology';
import { declareWar, formAlliance, breakAlliance, declareRivalry, guarantee, improveRelations, joinCustomsUnion, allianceAcceptance, boundSubject } from './systems/diplomacy';
import { applyWindowOption } from './systems/events';
import { endWar } from './systems/military';
import { clamp, log } from './core';
import { data } from './data/db';

export type Command =
  | { type: 'set_tax'; rate: number }
  | { type: 'set_budget'; key: 'military' | 'navy' | 'admin' | 'education' | 'health' | 'construction'; value: number }
  | { type: 'set_army_target'; manpower: number }
  | { type: 'set_navy_target'; ships: number }
  | { type: 'start_reform'; group: LawGroup; value: string }
  | { type: 'build'; region: string; building: Building }
  | { type: 'queue_build'; region: string; building: Building }
  | { type: 'cancel_construction'; projectId: string }
  | { type: 'set_production_method'; region: string; building: Building; method: string }
  | { type: 'set_research'; tech: string }
  | { type: 'improve_relations'; target: string }
  | { type: 'propose_alliance'; target: string }
  | { type: 'break_alliance'; target: string }
  | { type: 'declare_rival'; target: string }
  | { type: 'guarantee'; target: string }
  | { type: 'join_customs_union'; union: string }
  | { type: 'declare_war'; target: string; goals: WarGoal[] }
  | { type: 'offer_white_peace'; war: string }
  | { type: 'decide'; pendingId: string; option: string };

export interface CommandResult { ok: boolean; reason?: string }

export function execute(st: GameState, cmd: Command): CommandResult {
  const me = st.player ? st.countries[st.player] : null;
  if (!me || !me.alive) return { ok: false, reason: 'Observer Mode: no country under player control' };
  switch (cmd.type) {
    case 'set_tax': me.taxRate = clamp(cmd.rate, 0.01, 0.3); return { ok: true };
    case 'set_budget': me.budget[cmd.key] = clamp(cmd.value, 0, 0.8); return { ok: true };
    case 'set_army_target': me.army.target = Math.max(0, cmd.manpower); return { ok: true };
    case 'set_navy_target': me.navy.target = Math.max(0, cmd.ships); return { ok: true };
    case 'start_reform': return startReform(st, me, cmd.group, cmd.value) ? { ok: true } : { ok: false, reason: 'A reform is already in progress or the law is unchanged' };
    case 'build': {
      const r = st.regions[data().regionIndex.get(cmd.region) ?? -1];
      if (!r || !canBuild(st, me, r, cmd.building)) return { ok: false, reason: 'Not buildable here' };
      return build(st, me, r, cmd.building, 'statePool') ? { ok: true } : { ok: false, reason: `Insufficient construction funds (cost ${Math.round(buildCost(me, cmd.building, st))})` };
    }
    case 'queue_build': {
      const r = st.regions[data().regionIndex.get(cmd.region) ?? -1];
      return r && queueConstruction(st, me, r, cmd.building)
        ? { ok: true }
        : { ok: false, reason: 'Construction queue is full or this building is not available here' };
    }
    case 'cancel_construction': return cancelConstruction(me, cmd.projectId)
      ? { ok: true }
      : { ok: false, reason: 'No such construction project' };
    case 'set_production_method': {
      const r = st.regions[data().regionIndex.get(cmd.region) ?? -1];
      if (!r || r.owner !== me.id || r.buildings[cmd.building] <= 0) return { ok: false, reason: 'Production method requires an owned building' };
      return setProductionMethod(me, r, cmd.building, cmd.method) ? { ok: true } : { ok: false, reason: 'Production method technology is locked or invalid' };
    }
    case 'set_research': if (!availableTechs(me).includes(cmd.tech)) return { ok: false, reason: 'Prerequisites missing or already known' }; me.research = { current: cmd.tech, progress: 0 }; return { ok: true };
    case 'improve_relations': improveRelations(st, me.id, cmd.target); return { ok: true };
    case 'propose_alliance': if (boundSubject(me) || boundSubject(st.countries[cmd.target])) return { ok: false, reason: 'Subjects (other than tributaries) cannot form alliances' };
      return formAlliance(st, me.id, cmd.target) ? { ok: true } : { ok: false, reason: `Refused (acceptance ${allianceAcceptance(st, me.id, cmd.target).toFixed(1)} < 0)` };
    case 'break_alliance': breakAlliance(st, me.id, cmd.target); return { ok: true };
    case 'declare_rival': declareRivalry(st, me.id, cmd.target); return { ok: true };
    case 'guarantee': guarantee(st, me.id, cmd.target); return { ok: true };
    case 'join_customs_union': return joinCustomsUnion(st, me, cmd.union) ? { ok: true } : { ok: false, reason: 'Cannot join' };
    case 'declare_war': return declareWar(st, me.id, cmd.target, cmd.goals) ? { ok: true } : { ok: false, reason: 'Invalid war declaration' };
    case 'offer_white_peace': {
      const w = st.wars.find((x) => x.id === cmd.war); if (!w) return { ok: false, reason: 'No such war' };
      const mine = w.attackers.members.includes(me.id) ? 'a' : 'd';
      const enemyEx = mine === 'a' ? w.exhaustion.d : w.exhaustion.a;
      const accept = Math.abs(w.score) < 25 || enemyEx > 50 || (mine === 'a' ? w.score > 0 : w.score < 0);
      if (!accept) return { ok: false, reason: 'The enemy expects to win' };
      endWar(st, w, 'white', 'negotiated'); return { ok: true };
    }
    case 'decide': {
      const p = st.pendingPlayerDecisions.find((x) => x.id === cmd.pendingId); if (!p) return { ok: false, reason: 'No such decision' };
      st.pendingPlayerDecisions = st.pendingPlayerDecisions.filter((x) => x !== p);
      st.firedEvents.push(p.windowId);
      if (p.windowId.startsWith('zv_')) { if (cmd.option === 'join') joinCustomsUnion(st, me, 'zollverein'); }
      else applyWindowOption(st, p.windowId, cmd.option);
      return { ok: true };
    }
  }
}

/** Preview of a reform for UI confirmation sheets: support and the IGs that gain/lose. */
export function previewReform(st: GameState, group: LawGroup, value: string) {
  const me = st.player ? st.countries[st.player] : null; if (!me) return null;
  return { support: reformSupport(me, group, value) };
}
export { log };
