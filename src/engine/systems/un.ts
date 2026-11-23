// DIPLO-UN-01: the United Nations and its Security Council (owner 2026-11-23: "as in history").
//
// Rules taken from the UN Charter (1945, as amended 1963/1965):
// - founded 24 October 1945 (Historical Mode);
// - Security Council: the Charter (Art. 23) names five permanent members (China, France, the USSR, the
//   United Kingdom, the United States). OWNER DECISION 2026-11-23: four FIXED permanent seats for the
//   states holding London, Paris, Washington and Moscow, plus one POWER seat for the highest-ranked
//   other member (any country, including the player's), nominated by power and accepted by the fixed
//   permanent members (any of them can veto a nominee, then the next is nominated). A seat is held by
//   STANDING, not forever (owner 2026-11-23): every January a permanent member that has fallen out of the
//   top STANDING_RANK members by power loses its seat; if a permanent member collapses, the state holding
//   most of its former population is its successor and keeps the seat only if it ranks in that top band.
//   A vacant seat goes to the strongest other member accepted by the remaining permanent members. The
//   band (top 8 for 5 seats) keeps a seat from changing hands over small swings.
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
  foundingDate: '1945-10', permanentSeats: 5, standingRank: 8, seatRegions: { USA: 'USA_MAR', GBR: 'GBR_LON', FRA: 'FRA_IDF', SOV: 'RUS_MOS' } as Record<string, string>,
  electedBefore1966: 6, electedFrom1966: 10, votesNeededBefore1966: 7, votesNeededFrom1966: 9, admissionDelayMonths: 12,
  condemnInfamy: 10, condemnExhaustion: 10, condemnRelations: 20,
} as const;

const sovereign = (c: Country | undefined) => !!c && c.alive && !c.decentralized && !c.overlord && c.kind !== 'rebel';

export function councilSeats(st: GameState): string[] {
  const un = st.un; if (!un) return [];
  return [...un.permanent, ...un.elected.map((e) => e.id)].filter((id) => st.countries[id]?.alive);
}

/** Would a fixed permanent member veto this nominee for the power seat? (rival, or relations below -30) */
function vetoesNominee(st: GameState, member: string, nominee: string): boolean {
  return member !== nominee && (getRel(st, member, nominee) < -30 || st.rivalries.includes([member, nominee].sort().join('|')));
}

/** Highest-ranked member outside `exclude` that no fixed permanent member vetoes. */
function nominatePowerSeat(st: GameState, members: string[], fixed: string[], exclude: Set<string>): string | null {
  const ranked = members.filter((m) => !exclude.has(m) && sovereign(st.countries[m])).sort((a, b) => powerScore(st, st.countries[b]) - powerScore(st, st.countries[a]) || a.localeCompare(b));
  for (const n of ranked) if (!fixed.some((f) => vetoesNominee(st, f, n))) return n;
  return null;
}

/** Founding: fixed seats (capital holders) plus power-ranked seats up to UN_PARAMS.permanentSeats. */
function assignPermanentAtFounding(st: GameState): void {
  const un = st.un!;
  const fixed: string[] = [];
  for (const rid of Object.values(UN_PARAMS.seatRegions)) {
    const owner = st.regions.find((r) => r.id === rid)?.owner;
    if (owner && sovereign(st.countries[owner]) && un.members.includes(owner) && !fixed.includes(owner)) fixed.push(owner);
  }
  const perm = [...fixed];
  const power = nominatePowerSeat(st, un.members, fixed, new Set(fixed));
  if (power) perm.push(power);
  while (perm.length < UN_PARAMS.permanentSeats) { const n = nominatePowerSeat(st, un.members, perm, new Set(perm)); if (!n) break; perm.push(n); }
  un.permanent = perm; un.powerSeat = power;
  snapshotSeats(st);
}

function snapshotSeats(st: GameState): void {
  const un = st.un!; un.seatTerritory = {};
  for (const p of un.permanent) if (st.countries[p]?.alive) un.seatTerritory[p] = st.regions.filter((r) => r.owner === p).map((r) => r.id);
}

/** Power rank (1 = strongest) of a member among UN members. */
export function unPowerRank(st: GameState, id: string): number {
  const un = st.un; if (!un) return Infinity;
  const ranked = un.members.filter((m) => st.countries[m]?.alive).sort((a, b) => powerScore(st, st.countries[b]) - powerScore(st, st.countries[a]) || a.localeCompare(b));
  const i = ranked.indexOf(id); return i < 0 ? Infinity : i + 1;
}
const hasStanding = (st: GameState, id: string) => unPowerRank(st, id) <= UN_PARAMS.standingRank;

/**
 * Seats follow standing: a collapsed member's largest successor keeps its seat only if it ranks in the
 * top band; a member that has fallen out of the band loses its seat (reviewed in January); vacant seats go
 * to the strongest member accepted by the other permanent members.
 */
function reviewSeats(st: GameState, yearly: boolean): void {
  const un = st.un!;
  const next: string[] = [];
  for (const p of un.permanent) {
    const alive = st.countries[p]?.alive && un.members.includes(p);
    if (alive) {
      if (!yearly || hasStanding(st, p)) { next.push(p); continue; }
      log(st, { type: 'diplomacy', text: `${st.countries[p].name} no longer has the standing to keep its permanent Security Council seat.`, textVi: `${st.countries[p].nameVi} không còn đủ vị thế để giữ ghế thường trực Hội đồng Bảo an.`, actors: [p] });
    } else {
      const regs = (un.seatTerritory?.[p] ?? []).map((id) => st.regions.find((r) => r.id === id)).filter(Boolean) as GameState['regions'];
      const by = new Map<string, number>(); for (const r of regs) by.set(r.owner, (by.get(r.owner) ?? 0) + r.pop);
      const [heir] = [...by].sort((a, b) => b[1] - a[1])[0] ?? [];
      if (heir && sovereign(st.countries[heir]) && un.members.includes(heir) && !next.includes(heir) && !un.permanent.includes(heir) && hasStanding(st, heir)) {
        next.push(heir); if (p === un.powerSeat) un.powerSeat = heir;
        log(st, { type: 'diplomacy', text: `${st.countries[heir].name} succeeds to the permanent Security Council seat of ${st.countries[p]?.name ?? p}.`, textVi: `${st.countries[heir].nameVi} kế thừa ghế thường trực Hội đồng Bảo an của ${st.countries[p]?.nameVi ?? p}.`, actors: [heir] });
        continue;
      }
    }
    // vacant: the strongest acceptable member without a seat
    const others = un.permanent.filter((x) => x !== p && st.countries[x]?.alive);
    const n = nominatePowerSeat(st, un.members, others, new Set([...next, ...un.permanent]));
    if (n) {
      next.push(n); if (p === un.powerSeat) un.powerSeat = n;
      log(st, { type: 'diplomacy', text: `${st.countries[n].name} takes a permanent seat on the UN Security Council.`, textVi: `${st.countries[n].nameVi} giành ghế thường trực Hội đồng Bảo an.`, actors: [n] });
    }
  }
  un.permanent = next;
  un.elected = un.elected.filter((e) => !next.includes(e.id));
}

function foundUn(st: GameState): void {
  const members = Object.values(st.countries).filter(sovereign).map((c) => c.id).sort();
  st.un = { founded: st.tick, members, permanent: [], powerSeat: null, elected: [], resolutions: [] };
  assignPermanentAtFounding(st);
  electSeats(st);
  const permanent = st.un.permanent;
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
    // WW-01 (owner): the UN is founded after World War II. In Historical Mode it follows the end of the
    // simulated WW2 (the month after it ends); if WW2 never formed in this world, the dated fallback
    // (October 1945) applies. Sandbox founding after an emergent world war is WW-01a.
    const ww2 = st.worldWars?.WW2;
    const afterWar = !!ww2?.ended && (ww2.war !== null || dateStr(st.date).slice(0, 7) >= UN_PARAMS.foundingDate);
    if (st.mode === 'historical' && (afterWar || (!ww2?.war && dateStr(st.date).slice(0, 7) >= UN_PARAMS.foundingDate))) foundUn(st);
    return;
  }
  const un = st.un;
  // membership: drop dead members, admit sovereign states a year after they form
  un.members = un.members.filter((m) => st.countries[m]?.alive);
  if (un.permanent.some((m) => !st.countries[m]?.alive || !un.members.includes(m))) { reviewSeats(st, false); snapshotSeats(st); }
  for (const c of Object.values(st.countries)) if (sovereign(c) && !un.members.includes(c.id) && st.tick - (c.formedAt ?? 0) >= UN_PARAMS.admissionDelayMonths) un.members.push(c.id);
  if (st.date.m === 1) { reviewSeats(st, true); snapshotSeats(st); electSeats(st); }
  // the Council votes on every new war of conquest between members
  const voted = new Set(un.resolutions.map((r) => r.war));
  for (const w of st.wars) {
    if (voted.has(w.id) || (w.kind !== 'conquest' && w.kind !== 'colonial') || w.start < un.founded) continue;
    const a = w.attackers.leader, dfd = w.defenders.leader;
    if (un.members.includes(a) && un.members.includes(dfd)) holdVote(st, w.id, a, dfd);
  }
}
