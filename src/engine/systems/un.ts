// DIPLO-UN-01: the United Nations and its Security Council (owner 2026-11-23: "as in history").
//
// Rules taken from the UN Charter (1945, as amended 1963/1965):
// - founded 24 October 1945 (Historical Mode);
// - Security Council: the Charter (Art. 23) names five permanent members (China, France, the USSR, the
//   United Kingdom, the United States). OWNER DECISION 2026-11-23: the game has FOUR permanent seats,
//   given to the four strongest of the five states holding those historical capitals at founding.
//   Non-permanent members are elected for two-year terms, six until 1965 and ten from 1 January 1966
//   (1963 amendment in force 1965);
// - a substantive decision needs nine votes (seven before 1966) with no negative vote of a permanent
//   member (Art. 27(3): the veto).
// Engine mapping: a permanent seat goes to the state holding that member's historical capital region
// at founding (Washington, London, Paris, Moscow, Beijing), so it follows the simulated world.
// Membership: sovereign states at founding; later states join a year after they form (admission
// politics are a later refinement, research CG-39). Elected seats rotate yearly in staggered halves.
// When a member starts a war of conquest against another member, the Council votes on condemning it.
// A passed resolution marks the attacker as an aggressor (+infamy, war exhaustion, relations with
// members fall), so collective action against it costs little infamy (CONTAIN_AGGRESSOR).
import { dateStr, getRel, log, rand, relKey } from '../core';
import { allied, powerScore } from './diplomacy';
import type { Country, GameState, UnResolution } from '../types';

export const UN_PARAMS = {
  foundingDate: '1945-10', permanentSeats: 4, seatRegions: { USA: 'USA_MAR', GBR: 'GBR_LON', FRA: 'FRA_IDF', SOV: 'RUS_MOS', CHN: 'QNG_ZHI' } as Record<string, string>,
  electedBefore1966: 6, electedFrom1966: 10, votesNeededBefore1966: 7, votesNeededFrom1966: 9, admissionDelayMonths: 12,
  condemnInfamy: 10, condemnExhaustion: 10, condemnRelations: 20,
} as const;

const sovereign = (c: Country | undefined) => !!c && c.alive && !c.decentralized && !c.overlord && c.kind !== 'rebel';

export function councilSeats(st: GameState): string[] {
  const un = st.un; if (!un) return [];
  return [...un.permanent, ...un.elected.map((e) => e.id)].filter((id) => st.countries[id]?.alive);
}

function foundUn(st: GameState): void {
  const d = st.regions;
  const candidates: string[] = [];
  for (const rid of Object.values(UN_PARAMS.seatRegions)) {
    const owner = d.find((r) => r.id === rid)?.owner;
    if (owner && sovereign(st.countries[owner]) && !candidates.includes(owner)) candidates.push(owner);
  }
  // Four permanent seats (owner decision): the strongest candidates by national power.
  const permanent = candidates.sort((a, b) => powerScore(st, st.countries[b]) - powerScore(st, st.countries[a]) || a.localeCompare(b)).slice(0, UN_PARAMS.permanentSeats);
  const members = Object.values(st.countries).filter(sovereign).map((c) => c.id).sort();
  st.un = { founded: st.tick, members, permanent, elected: [], resolutions: [] };
  electSeats(st);
  log(st, { type: 'diplomacy', text: `The United Nations is founded (${members.length} members; permanent members: ${permanent.map((p) => st.countries[p].name).join(', ')}).`, textVi: `Liên Hợp Quốc được thành lập (${members.length} thành viên; thường trực Hội đồng Bảo an: ${permanent.map((p) => st.countries[p].nameVi).join(', ')}).`, actors: permanent, historical: true });
}

/** Fills free non-permanent seats for two-year terms (larger, more prestigious states more often). */
function electSeats(st: GameState): void {
  const un = st.un!;
  un.elected = un.elected.filter((e) => e.until > st.tick && st.countries[e.id]?.alive && un.members.includes(e.id));
  const target = st.date.y >= 1966 ? UN_PARAMS.electedFrom1966 : UN_PARAMS.electedBefore1966;
  const taken = new Set([...un.permanent, ...un.elected.map((e) => e.id)]);
  const pool = un.members.filter((m) => !taken.has(m) && st.countries[m]?.alive);
  // Staggered terms: at founding half the seats get a one-year first term (as in 1946).
  const firstRound = un.elected.length === 0;
  while (un.elected.length < target && pool.length) {
    const w = pool.map((id) => Math.sqrt(Math.max(1, st.countries[id].stats.pop) / 1e6) + st.countries[id].prestige / 50);
    let x = rand(st) * w.reduce((s, v) => s + v, 0); let i = 0;
    while (i < pool.length - 1 && x > w[i]) { x -= w[i]; i++; }
    const id = pool.splice(i, 1)[0];
    const years = firstRound && un.elected.length < Math.ceil(target / 2) ? 1 : 2;
    un.elected.push({ id, until: st.tick + years * 12 });
  }
}

function vote(st: GameState, member: string, attacker: string, defender: string): 'for' | 'against' | 'abstain' {
  if (member === attacker) return 'against';
  if (member === defender) return 'for';
  const a = st.countries[attacker];
  if (allied(st, member, attacker) || a.overlord === member || st.countries[member].overlord === attacker) return 'against';
  const lean = getRel(st, member, defender) - getRel(st, member, attacker) + a.infamy;
  return lean > 10 ? 'for' : lean < -25 ? 'against' : 'abstain';
}

export function holdVote(st: GameState, warId: string, attacker: string, defender: string): UnResolution {
  const seats = councilSeats(st);
  const votes: UnResolution['votes'] = {};
  for (const m of seats) votes[m] = vote(st, m, attacker, defender);
  const vetoedBy = st.un!.permanent.filter((p) => votes[p] === 'against');
  const yes = Object.values(votes).filter((v) => v === 'for').length;
  const needed = st.date.y >= 1966 ? UN_PARAMS.votesNeededFrom1966 : UN_PARAMS.votesNeededBefore1966;
  const res: UnResolution = { tick: st.tick, war: warId, attacker, defender, votes, vetoedBy, passed: yes >= needed && vetoedBy.length === 0 };
  st.un!.resolutions.push(res);
  if (st.un!.resolutions.length > 200) st.un!.resolutions.splice(0, st.un!.resolutions.length - 200);
  const a = st.countries[attacker], dC = st.countries[defender];
  if (res.passed) {
    a.infamy += UN_PARAMS.condemnInfamy;
    a.warExhaustion = Math.min(100, a.warExhaustion + UN_PARAMS.condemnExhaustion);
    for (const m of st.un!.members) if (m !== attacker) st.relations[relKey(m, attacker)] = (st.relations[relKey(m, attacker)] ?? 0) - UN_PARAMS.condemnRelations;
  }
  const outcome = res.passed ? 'adopted' : vetoedBy.length ? `vetoed by ${vetoedBy.map((v) => st.countries[v].name).join(', ')}` : 'not adopted';
  const outcomeVi = res.passed ? 'được thông qua' : vetoedBy.length ? `bị phủ quyết bởi ${vetoedBy.map((v) => st.countries[v].nameVi).join(', ')}` : 'không đủ phiếu';
  log(st, { type: 'diplomacy', text: `UN Security Council resolution condemning ${a.name}'s attack on ${dC.name}: ${yes} for, ${outcome}.`, textVi: `Nghị quyết Hội đồng Bảo an lên án ${a.nameVi} tấn công ${dC.nameVi}: ${yes} phiếu thuận, ${outcomeVi}.`, actors: [attacker, defender, ...vetoedBy] });
  return res;
}

export function unMonth(st: GameState): void {
  if (!st.un) {
    if (st.mode === 'historical' && dateStr(st.date).slice(0, 7) >= UN_PARAMS.foundingDate) foundUn(st);
    return;
  }
  const un = st.un;
  // membership: drop dead members, admit sovereign states a year after they form
  un.members = un.members.filter((m) => st.countries[m]?.alive);
  un.permanent = un.permanent.filter((m) => st.countries[m]?.alive);
  for (const c of Object.values(st.countries)) if (sovereign(c) && !un.members.includes(c.id) && st.tick - (c.formedAt ?? 0) >= UN_PARAMS.admissionDelayMonths) un.members.push(c.id);
  if (st.date.m === 1) electSeats(st);
  // the Council votes on every new war of conquest between members
  const voted = new Set(un.resolutions.map((r) => r.war));
  for (const w of st.wars) {
    if (voted.has(w.id) || (w.kind !== 'conquest' && w.kind !== 'colonial') || w.start < un.founded) continue;
    const a = w.attackers.leader, dfd = w.defenders.leader;
    if (un.members.includes(a) && un.members.includes(dfd)) holdVote(st, w.id, a, dfd);
  }
}
