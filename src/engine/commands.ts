// Player command API. Every command calls the SAME functions the AI uses, so the player plays by the AI's rules.
// The UI layer must only issue these commands (no rule logic in the UI).
import { BLOC_IDENTITIES, PRINCIPLES, canFound, foundBloc, blocOf, invite, leaveBloc, setPrinciple, type BlocIdentity } from './systems/powerBlocs';
import { journalAction } from './systems/regimes';
import type { LawGroup } from './data/dbTypes';
import type { Building, GameState, WarGoal } from './types';
import { enqueueConstruction, cancelConstruction } from './systems/economy';
import { setProductionMethod } from './systems/productionMethods';
import { foundCompany, foundCompanyBlocker, charterBlocker, grantCharter, revokeCharter } from './systems/companies';
import { startReform, reformSupport } from './systems/politics';
import { availableTechs } from './systems/technology';
import { declareWar, formAlliance, breakAlliance, declareRivalry, guarantee, improveRelations, joinCustomsUnion, allianceAcceptance, boundSubject } from './systems/diplomacy';
import { resolvePlayerDecision } from './systems/events';
import { endWar } from './systems/military';
import { clamp, log } from './core';
import { data } from './data/db';
import { isReformableLaw } from './laws';

export type Command =
  | { type: 'set_tax'; rate: number }
  | { type: 'set_budget'; key: 'military' | 'navy' | 'admin' | 'education' | 'health' | 'construction'; value: number }
  | { type: 'set_army_target'; manpower: number }
  | { type: 'set_navy_target'; ships: number }
  | { type: 'start_reform'; group: LawGroup; value: string }
  | { type: 'build'; region: string; building: Building }
  | { type: 'cancel_construction'; projectId: string }
  | { type: 'found_company'; kind: string }
  | { type: 'set_production_method'; building: Building; method: string | null }
  | { type: 'grant_charter'; company: string }
  | { type: 'revoke_charter'; company: string }
  | { type: 'set_research'; tech: string }
  | { type: 'improve_relations'; target: string }
  | { type: 'propose_alliance'; target: string }
  | { type: 'break_alliance'; target: string }
  | { type: 'declare_rival'; target: string }
  | { type: 'guarantee'; target: string }
  | { type: 'join_customs_union'; union: string }
  | { type: 'declare_war'; target: string; goals: WarGoal[] }
  | { type: 'offer_white_peace'; war: string }
  | { type: 'decide'; pendingId: string; option: string }
  | { type: 'journal'; entry: string; action: 'complete' | 'abandon' }
  | { type: 'found_bloc'; name: string; identity: string; principle: string | null }
  | { type: 'bloc_invite'; target: string }
  | { type: 'bloc_expel'; target: string }
  | { type: 'bloc_leave' }
  | { type: 'bloc_principle'; group: string; level: number };

export interface CommandResult { ok: boolean; reason?: string }

const BUDGET_KEYS = ['military', 'navy', 'admin', 'education', 'health', 'construction'] as const;
const TARGETED = new Set(['improve_relations', 'propose_alliance', 'break_alliance', 'declare_rival', 'guarantee', 'declare_war']);
const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/**
 * Validates untrusted command input before any mutation (BUG-CMD-01: fail closed). Returns a reason
 * string when the command is malformed or refers to something that does not exist.
 */
export function validateCommand(st: GameState, me: { id: string }, cmd: Command): string | null {
  if (!cmd || typeof cmd !== 'object' || typeof (cmd as { type?: unknown }).type !== 'string') return 'Malformed command';
  switch (cmd.type) {
    case 'set_tax': return fin(cmd.rate) ? null : 'Invalid tax rate';
    case 'set_budget': return (BUDGET_KEYS as readonly string[]).includes(cmd.key) && fin(cmd.value) ? null : 'Invalid budget item';
    case 'set_army_target': return fin(cmd.manpower) ? null : 'Invalid army target';
    case 'set_navy_target': return fin(cmd.ships) ? null : 'Invalid navy target';
    case 'start_reform': return isReformableLaw(cmd.group, cmd.value) ? null : 'Unknown law group or law value';
    case 'found_bloc': return typeof cmd.name === 'string' && (BLOC_IDENTITIES as string[]).includes(cmd.identity) && (cmd.principle === null || (typeof cmd.principle === 'string' && cmd.principle in PRINCIPLES)) ? null : 'Invalid bloc';
    case 'bloc_invite': case 'bloc_expel': return typeof cmd.target === 'string' && st.countries[cmd.target] ? null : 'Unknown target country';
    case 'bloc_leave': return null;
    case 'bloc_principle': return typeof cmd.group === 'string' && cmd.group in PRINCIPLES && Number.isInteger(cmd.level) ? null : 'Invalid principle';
    case 'journal': return typeof cmd.entry === 'string' && (cmd.action === 'complete' || cmd.action === 'abandon') ? null : 'Invalid journal action';
    case 'found_company': return typeof cmd.kind === 'string' && data().db.company_kinds.some((k) => k.id === cmd.kind) ? null : 'Unknown company kind';
    default: break;
  }
  if (TARGETED.has(cmd.type)) {
    const target = (cmd as { target?: unknown }).target;
    if (typeof target !== 'string' || !st.countries[target]) return 'Unknown target country';
    if (target === me.id) return 'A country cannot target itself';
    if (!st.countries[target].alive) return 'Target country no longer exists';
  }
  if (cmd.type === 'break_alliance' && !st.treaties.some((t) => t.type === 'alliance' && t.members.length === 2 && t.members.includes(me.id) && t.members.includes(cmd.target))) {
    return 'No alliance with this country';
  }
  return null;
}

export function execute(st: GameState, cmd: Command): CommandResult {
  const me = st.player ? st.countries[st.player] : null;
  if (!me || !me.alive) return { ok: false, reason: 'Observer Mode: no country under player control' };
  const invalid = validateCommand(st, me, cmd);
  if (invalid) return { ok: false, reason: invalid };
  switch (cmd.type) {
    case 'set_tax': me.taxRate = clamp(cmd.rate, 0.01, 0.3); return { ok: true };
    case 'set_budget': me.budget[cmd.key] = clamp(cmd.value, 0, 0.8); return { ok: true };
    case 'set_army_target': me.army.target = Math.max(0, cmd.manpower); return { ok: true };
    case 'set_navy_target': me.navy.target = Math.max(0, cmd.ships); return { ok: true };
    case 'start_reform': return startReform(st, me, cmd.group, cmd.value) ? { ok: true } : { ok: false, reason: 'A reform is already in progress or the law is unchanged' };
    case 'build': {
      const r = st.regions[data().regionIndex.get(cmd.region) ?? -1];
      if (!r) return { ok: false, reason: 'Unknown construction site' };
      return enqueueConstruction(st, me, r, cmd.building, 'state')
        ? { ok: true }
        : { ok: false, reason: 'Build requirements failed or the state construction queue is full' };
    }
    case 'cancel_construction':
      return cancelConstruction(st, me, cmd.projectId)
        ? { ok: true }
        : { ok: false, reason: 'No cancellable state-funded construction project' };
    case 'found_company': {
      const blocker = foundCompanyBlocker(st, me, cmd.kind);
      if (blocker) return { ok: false, reason: blocker };
      return foundCompany(st, me, cmd.kind) ? { ok: true } : { ok: false, reason: 'The company could not be founded' };
    }
    case 'set_production_method':
      return setProductionMethod(me, cmd.building, cmd.method) ? { ok: true } : { ok: false, reason: 'Production method not unlocked' };
    case 'grant_charter': case 'revoke_charter': {
      const co = st.companies?.[cmd.company];
      if (!co || co.home !== me.id) return { ok: false, reason: 'Unknown company' };
      if (cmd.type === 'revoke_charter') return revokeCharter(st, co) ? { ok: true } : { ok: false, reason: 'The company holds no charter' };
      const blocker = charterBlocker(st, co);
      return blocker ? { ok: false, reason: blocker } : grantCharter(st, co) ? { ok: true } : { ok: false, reason: 'The charter could not be granted' };
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
    case 'decide':
      return resolvePlayerDecision(st, me.id, cmd.pendingId, cmd.option);
    case 'journal':
      return journalAction(st, me.id, cmd.entry, cmd.action);
    case 'found_bloc': {
      const why = canFound(st, me.id); if (why) return { ok: false, reason: why };
      return foundBloc(st, me.id, cmd.name, cmd.identity as BlocIdentity, cmd.principle) ? { ok: true } : { ok: false, reason: 'Could not found the bloc' };
    }
    case 'bloc_invite': { const b = blocOf(st, me.id); if (!b || b.leader !== me.id) return { ok: false, reason: 'Only a bloc leader can invite' }; return invite(st, b, cmd.target); }
    case 'bloc_expel': { const b = blocOf(st, me.id); if (!b || b.leader !== me.id || !b.members.includes(cmd.target) || cmd.target === me.id) return { ok: false, reason: 'Not a member you can expel' }; leaveBloc(st, cmd.target); return { ok: true }; }
    case 'bloc_leave': { if (!blocOf(st, me.id)) return { ok: false, reason: 'Not in a bloc' }; leaveBloc(st, me.id); return { ok: true }; }
    case 'bloc_principle': { const b = blocOf(st, me.id); if (!b || b.leader !== me.id) return { ok: false, reason: 'Only a bloc leader sets principles' }; const why = setPrinciple(st, b, cmd.group, cmd.level); return why ? { ok: false, reason: why } : { ok: true }; }
    default:
      return { ok: false, reason: 'Unknown command' };
  }
}

/** Preview of a reform for UI confirmation sheets: support and the IGs that gain/lose. */
export function previewReform(st: GameState, group: LawGroup, value: string) {
  const me = st.player ? st.countries[st.player] : null; if (!me) return null;
  return { support: reformSupport(me, group, value) };
}
export { log };
