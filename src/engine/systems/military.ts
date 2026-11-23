// Military Engine (shared): army/navy strength, recruitment, fronts, battles, occupation, war score, peace.
import { postwarNorm, POST_1945_NORM } from './diplomacy';
import { data } from '../data/db';
import type { Country, GameState, War, WarGoal } from '../types';
import { clamp, log, rand, addRel, setRel, dateStr } from '../core';
import { techEffect } from './economy';
import { setLaw } from './politics';
import { transferRegion, createNation, makeSubject, killCountry } from '../world';

const ARMY_LAW: Record<string, number> = { feudal_levies: 0.75, professional_army: 1.15, mass_conscription: 1.05 };
const MOBILIZATION: Record<string, number> = { feudal_levies: 0.02, professional_army: 0.012, mass_conscription: 0.035 };

export const atWar = (st: GameState, id: string) => st.wars.some((w) => w.attackers.members.includes(id) || w.defenders.members.includes(id));
export function enemiesOf(st: GameState, id: string): string[] {
  const out = new Set<string>();
  for (const w of st.wars) { if (w.attackers.members.includes(id)) w.defenders.members.forEach((x) => out.add(x)); else if (w.defenders.members.includes(id)) w.attackers.members.forEach((x) => out.add(x)); }
  return [...out];
}

export function armyStrength(st: GameState, c: Country): number {
  return c.army.manpower * c.army.quality * c.army.supply * c.army.morale;
}
export function navalStrength(c: Country) { return c.navy.strength * c.navy.quality * (1 + techEffect(c, 'navy_quality')); }

export function militaryMonth(st: GameState) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    const war = atWar(st, c.id);
    c.army.quality = (ARMY_LAW[c.laws.army] ?? 1) * (1 + techEffect(c, 'army_quality')) * (c.decentralized ? 0.55 : 1);
    const p = st.marketPrices[c.customsUnion ?? c.id] ?? st.worldPrices;
    c.army.supply = clamp(1.4 - p.arms * 0.35, 0.35, 1);
    c.army.morale = clamp(0.45 + c.legitimacy / 200 - c.warExhaustion / 250, 0.2, 1);
    const cap = c.stats.pop * (MOBILIZATION[c.laws.army] ?? 0.015) * (war ? 2 : 1);
    const target = Math.min(c.army.target, cap);
    c.army.manpower += clamp(target - c.army.manpower, -c.army.manpower * 0.04, Math.max(500, c.stats.pop * 0.002 * (war ? 2 : 1)));
    c.army.manpower = Math.max(0, c.army.manpower);
    c.navy.strength += clamp(c.navy.target - c.navy.strength, -c.navy.strength * 0.03, 0.5 + c.navy.strength * 0.02);
    c.navy.quality = clamp(0.4 + techEffect(c, 'navy_quality') * 0.5 + (c.techs.includes('steamships') ? 0.3 : 0), 0.3, 2.5);
    if (!war) c.warExhaustion = Math.max(0, c.warExhaustion - 1.5);
  }
  for (const w of [...st.wars]) warMonth(st, w);
}

function sideStrength(st: GameState, members: string[], enemyCount: (id: string) => number): number {
  let s = 0;
  for (const id of members) { const c = st.countries[id]; if (c?.alive) s += armyStrength(st, c) / Math.max(1, enemyCount(id)); }
  return s;
}

/** Regions controlled by `side` that touch regions controlled by the other side (land or reachable sea). */
function frontTargets(st: GameState, attackers: string[], defenders: string[], navalOk: boolean): number[] {
  const d = data(); const out: number[] = [];
  const att = new Set(attackers), def = new Set(defenders);
  for (let i = 0; i < st.regions.length; i++) {
    const r = st.regions[i]; if (!def.has(r.controller)) continue;
    const touch = d.landNeighbors[i].some((n) => att.has(st.regions[d.regionIndex.get(n)!].controller)) ||
      (navalOk && r.coastal && d.seaNeighbors[i].some((s) => att.has(st.regions[d.regionIndex.get(s.r)!].controller)));
    if (touch) out.push(i);
  }
  return out;
}

function warMonth(st: GameState, w: War) {
  const d = data();
  w.attackers.members = w.attackers.members.filter((m) => st.countries[m]?.alive);
  w.defenders.members = w.defenders.members.filter((m) => st.countries[m]?.alive);
  if (!w.attackers.members.length || !w.defenders.members.length) return endWar(st, w, w.attackers.members.length ? 'attackers' : 'defenders', 'collapse');
  const enemyCount = (id: string) => st.wars.filter((x) => x.attackers.members.includes(id) || x.defenders.members.includes(id)).length;
  // WW-01b: nominal belligerents (declared war, did not fight) neither fight nor are attacked.
  const active = (ms: string[]) => (w.nominal?.length ? ms.filter((m) => !w.nominal!.includes(m)) : ms);
  const actA = active(w.attackers.members), actD = active(w.defenders.members);
  const A = sideStrength(st, actA, enemyCount), D = sideStrength(st, actD, enemyCount);
  const navA = actA.reduce((s, m) => s + navalStrength(st.countries[m]), 0);
  const navD = actD.reduce((s, m) => s + navalStrength(st.countries[m]), 0);
  const battles = 1 + Math.min(2, Math.floor(Math.min(A, D) / 150000));
  for (let b = 0; b < battles; b++) {
    const attackerTurn = rand(st) < A / Math.max(1, A + D);
    const off = attackerTurn ? actA : actD, dfn = attackerTurn ? actD : actA;
    if (!off.length || !dfn.length) continue;
    const so = attackerTurn ? A : D, sd = attackerTurn ? D : A;
    const navalOk = (attackerTurn ? navA : navD) >= 0.6 * (attackerTurn ? navD : navA) && (attackerTurn ? navA : navD) > 0.5;
    let targets = frontTargets(st, off, dfn, navalOk);
    // long-range expedition by a dominant navy (e.g. against distant coasts)
    if (!targets.length && navalOk && (attackerTurn ? navA : navD) > 3 * ((attackerTurn ? navD : navA) + 1) && (attackerTurn ? navA : navD) > 8) {
      targets = st.regions.map((r, i) => (dfn.includes(r.controller) && r.coastal ? i : -1)).filter((i) => i >= 0);
    }
    if (!targets.length) continue;
    const goalRegions = new Set(w.goals.flatMap((g) => g.regions ?? []));
    targets.sort((a, b) => (goalRegions.has(st.regions[b].id) ? 1 : 0) - (goalRegions.has(st.regions[a].id) ? 1 : 0));
    const ti = targets[Math.floor(rand(st) * Math.min(3, targets.length))];
    const reg = st.regions[ti];
    const terrainDef = { mo: 1.5, hi: 1.25, fo: 1.2, ju: 1.3, ma: 1.2, de: 1.1, tu: 1.2, pl: 1, st: 1, sa: 1.05 }[reg.terrain] ?? 1;
    const offC = st.countries[off[0]];
    const tropical = (reg.terrain === 'ju' || reg.terrain === 'sa') && !offC.techs.includes('quinine_prophylaxis') && !st.countries[reg.controller].decentralized ? 1 : (reg.terrain === 'ju' || reg.terrain === 'sa') && !offC.techs.includes('quinine_prophylaxis') ? 0.6 : 1;
    const effO = Math.pow(so * tropical * (1 + techEffect(offC, 'colonial_advantage') * (st.countries[reg.controller].decentralized ? 1 : 0)), 1.4);
    const effD = Math.pow(sd * terrainDef, 1.4);
    const win = rand(st) < effO / Math.max(1, effO + effD);
    // casualties
    const engaged = Math.min(so, sd) * 0.08;
    const cas = (ids: string[], f: number) => { for (const id of ids) { const c = st.countries[id]; const loss = (c.army.manpower / Math.max(1, ids.reduce((s, x) => s + st.countries[x].army.manpower, 0))) * engaged * f; c.army.manpower = Math.max(0, c.army.manpower - loss); const normX = postwarNorm(st) && (w.kind === 'conquest' || w.kind === 'colonial') && w.attackers.members.includes(id) ? POST_1945_NORM.exhaustion : 1; c.warExhaustion = clamp(c.warExhaustion + ((loss / Math.max(1, c.stats.pop)) * 4000 + 0.3) * normX, 0, 100); } };
    cas(off, win ? 0.6 : 1.2); cas(dfn, win ? 1.2 : 0.6);
    w.battles++;
    if (win) {
      reg.controller = off[0];
      reg.devastation = clamp(reg.devastation + 0.08, 0, 0.6);
      if (!w.occupied.includes(reg.id)) w.occupied.push(reg.id);
    }
  }
  // liberation of own regions occupied by the enemy happens through the same battles (controller flips back)
  for (const r of st.regions) if (r.controller !== r.owner && !st.countries[r.controller]?.alive) r.controller = r.owner;
  // war score: share of each side's population under enemy control, goal regions and capitals
  const popOf = (ids: string[]) => st.regions.filter((r) => ids.includes(r.owner)).reduce((s, r) => s + r.pop, 0);
  const occBy = (occupier: string[], ownerSide: string[]) => st.regions.filter((r) => ownerSide.includes(r.owner) && occupier.includes(r.controller)).reduce((s, r) => s + r.pop, 0);
  const aOcc = occBy(w.attackers.members, w.defenders.members) / Math.max(1, popOf(w.defenders.members));
  const dOcc = occBy(w.defenders.members, w.attackers.members) / Math.max(1, popOf(w.attackers.members));
  const goalHeld = w.goals.flatMap((g) => g.regions ?? []).filter((id) => w.attackers.members.includes(st.regions[d.regionIndex.get(id)!].controller) || w.attackers.members.includes(st.regions[d.regionIndex.get(id)!].owner)).length;
  const goalTot = Math.max(1, w.goals.flatMap((g) => g.regions ?? []).length);
  const capDef = st.countries[w.defenders.leader]; const capAtt = st.countries[w.attackers.leader];
  const capFallen = capDef && w.attackers.members.includes(st.regions[d.regionIndex.get(capDef.capital)!]?.controller) ? 25 : 0;
  const capLost = capAtt && w.defenders.members.includes(st.regions[d.regionIndex.get(capAtt.capital)!]?.controller) ? 25 : 0;
  const ratio = A / Math.max(1, A + D);
  const target = clamp(aOcc * 120 + (goalHeld / goalTot) * 35 + capFallen - dOcc * 120 - capLost + (ratio - 0.5) * 30, -100, 100);
  w.score = w.score * 0.85 + target * 0.15;
  const exA = Math.max(...w.attackers.members.map((m) => st.countries[m].warExhaustion));
  const exD = Math.max(...w.defenders.members.map((m) => st.countries[m].warExhaustion));
  w.exhaustion = { a: exA, d: exD };
  const months = st.tick - w.start;
  // WW-01b: a historical world war has no AI peace; it ends on its historical date (systems/worldWars.ts)
  if (w.scripted) return;
  // peace logic (AI acceptance thresholds; player wars resolve the same way unless the player negotiates)
  if (w.score > 55 || (w.score > 25 && exD > 60) || (w.score > 10 && exD > 85)) return endWar(st, w, 'attackers', 'capitulation');
  // exhaustion alone never forces capitulation: an exhausted side gives up only while it is also losing
  if (w.score < -45 || (w.score < -10 && exA > 60) || (w.score < 0 && exA > 92)) return endWar(st, w, 'defenders', 'defeat of the attackers');
  if (months > 72 && Math.abs(w.score) < 20) return endWar(st, w, 'white', 'stalemate');
  if (months > 144) return endWar(st, w, w.score > 0 ? 'attackers' : w.score < 0 ? 'defenders' : 'white', 'exhaustion after twelve years');
}

export function endWar(st: GameState, w: War, winner: 'attackers' | 'defenders' | 'white', how: string) {
  st.wars = st.wars.filter((x) => x !== w);
  const d = data();
  for (const r of st.regions) if (r.controller !== r.owner && (w.attackers.members.includes(r.controller) || w.defenders.members.includes(r.controller))) r.controller = r.owner;
  const lead = st.countries[w.attackers.leader]; const tgt = st.countries[w.defenders.leader];
  const name = `${w.name}`;
  if (winner === 'attackers') {
    for (const g of w.goals) applyGoal(st, w, g, true);
    for (const m of w.defenders.members) { const c = st.countries[m]; if (c) { c.lastWarLost = st.tick; c.prestige -= 10; } }
    for (const m of w.attackers.members) { const c = st.countries[m]; if (c) c.prestige += 8; }
  } else if (winner === 'defenders') {
    for (const g of w.goals) applyGoal(st, w, g, false);
    for (const m of w.attackers.members) { const c = st.countries[m]; if (c) { c.lastWarLost = st.tick; c.prestige -= 8; } }
    for (const m of w.defenders.members) { const c = st.countries[m]; if (c) c.prestige += 5; }
  }
  for (const a of w.attackers.members) for (const b of w.defenders.members) setRel(st, a, b, -40);
  log(st, { type: 'war', text: `${name} ends (${winner === 'white' ? 'white peace' : winner + ' victorious'}, ${how}).`, textVi: `${name} kết thúc (${winner === 'white' ? 'hòa' : winner === 'attackers' ? 'bên tấn công thắng' : 'bên phòng thủ thắng'}, ${how}).`, actors: [...w.attackers.members, ...w.defenders.members].slice(0, 6) });
  void d; void lead; void tgt; void dateStr;
}

function applyGoal(st: GameState, w: War, g: WarGoal, attackersWon: boolean) {
  const by = st.countries[g.by]; const target = st.countries[g.target];
  if (!by) return;
  const byIsAttacker = w.attackers.members.includes(g.by) || w.attackers.leader === g.by;
  const success = byIsAttacker === attackersWon;
  switch (g.type) {
    case 'conquer': case 'annex_region': case 'colonize':
      if (success) for (const r of g.regions ?? []) { const reg = st.regions[data().regionIndex.get(r)!]; if (reg && target && reg.owner === target.id) transferRegion(st, r, g.by, w.name); }
      break;
    case 'independence':
      if (success) {
        const regs = (g.regions ?? []).filter((r) => st.regions[data().regionIndex.get(r)!].owner === g.target);
        if (by.kind === 'rebel' || st.regions.every((r) => r.owner !== by.id)) {
          for (const r of regs) transferRegion(st, r, by.id, w.name);
          by.kind = 'sovereign';
          log(st, { type: 'state', text: `${by.name} wins independence.`, textVi: `${by.nameVi} giành độc lập.`, actors: [by.id] });
        } else if (by.overlord === g.target) { by.overlord = null; by.subjectType = null; }
      } else if (by.kind === 'rebel' || st.regions.every((r) => r.owner !== by.id)) killCountry(st, by.id, 'rebellion defeated');
      break;
    case 'overthrow':
      if (success && target) {
        for (const grp of Object.keys(by.laws) as (keyof typeof by.laws)[]) if (target.laws[grp] !== by.laws[grp]) setLaw(st, target, grp, by.laws[grp], 'civil war');
        target.leader = { ...by.leader }; target.regimeChangedAt = st.tick;
      }
      if (by.kind === 'rebel' || st.regions.every((r) => r.owner !== by.id)) killCountry(st, by.id, success ? 'took power' : 'defeated');
      break;
    case 'subjugate':
      if (success && target) makeSubject(st, target.id, g.by, 'vassal');
      break;
    case 'force_open_market':
      if (success && target) { if (target.laws.trade === 'isolationism') setLaw(st, target, 'trade', 'protectionism', `treaty imposed by ${by.name}`); target.prestige -= 10; target.treasury *= 0.7; addRel(st, target.id, by.id, -20); }
      break;
    case 'unify': case 'liberate':
      if (success && target) for (const r of g.regions ?? []) transferRegion(st, r, g.by, w.name);
      break;
    case 'humiliate':
      if (success && target) { target.prestige -= 15; by.prestige += 10; }
      break;
  }
  void createNation;
}
