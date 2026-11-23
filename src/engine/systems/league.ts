// WW-01d: the League of Nations 1920–1946 in Historical Mode (data: db.league_of_nations from ChatGPT CG-40,
// historical_data/wars/world_wars.json; seat schedule and the US non-membership from the same research).
//
// Rules from the Covenant (1919):
// - founded 10 January 1920, dissolved 20 April 1946 (its assets passed to the UN);
// - members: the sovereign states of 1920, except the United States, which never joined; states join a year
//   after they form; the great powers enter and leave on their historical dates (Germany 1926–1935, the USSR
//   1934–1939 when it was expelled, Japan until 1935, Italy until 1939);
// - the Council: permanent members (the holders of the listed capitals while they are members) and
//   non-permanent members elected by the Assembly for three-year terms (4 seats in 1920, 6 from 1922, 9 from
//   1926, 10 from 1933, 11 from 1936);
// - decisions need UNANIMITY of the Council (Art. 5), the parties to a dispute not voting (Art. 15).
// When a member starts a war of conquest against another member, the Council votes on condemning it. A condemnation costs the
// aggressor some infamy and the goodwill of members — weaker than the UN — and a condemned permanent member
// leaves the League (as Japan did after the Lytton Report in 1933).
import { data } from '../data/db';
import { dateStr, getRel, log, rand, relKey } from '../core';
import { allied } from './diplomacy';
import { holderOfCapital } from './settlements';
import type { Country, GameState } from '../types';

export const LEAGUE = {
  nonMembers: ['USA_MAR'], admissionDelayMonths: 12, termYears: 3,
  seats: [['1920-01', 4], ['1922-09', 6], ['1926-09', 9], ['1933-10', 10], ['1936-10', 11]] as [string, number][],
  condemnInfamy: 5, condemnRelations: 10,
} as const;

export interface LeagueResolution { tick: number; war: string; attacker: string; defender: string; votes: Record<string, 'for' | 'against' | 'abstain'>; passed: boolean }
export interface LeagueOfNations { founded: number; members: string[]; left: string[]; permanent: string[]; elected: { id: string; until: number }[]; resolutions: LeagueResolution[]; dissolved?: number }

const sovereign = (c: Country | undefined) => !!c && c.alive && !c.decentralized && !c.overlord && c.kind !== 'rebel';

/** Permanent-member records active today, with the state holding each capital. */
function permanentNow(st: GameState, today: string) {
  const lon = data().db.league_of_nations;
  const ym = today.slice(0, 7); // monthly steps: a record counts from the month it starts
  return (lon?.permanent ?? []).filter((p) => p.start.slice(0, 7) <= ym && ym < p.end.slice(0, 7)).map((p) => holderOfCapital(st, p.capitalRegion)?.id).filter((x): x is string => !!x);
}
/** States outside the League by history on this date (the US; great powers before they joined). */
function outsideByHistory(st: GameState, today: string): Set<string> {
  const lon = data().db.league_of_nations; const out = new Set<string>();
  for (const cap of LEAGUE.nonMembers) { const h = holderOfCapital(st, cap); if (h) out.add(h.id); }
  const ym = today.slice(0, 7);
  for (const p of lon?.permanent ?? []) if (ym < p.start.slice(0, 7) || ym >= p.end.slice(0, 7)) { const h = holderOfCapital(st, p.capitalRegion); if (h) out.add(h.id); }
  return out;
}

export const leagueCouncil = (st: GameState) => st.league ? [...st.league.permanent, ...st.league.elected.map((e) => e.id)].filter((id) => st.countries[id]?.alive) : [];

function seatsFor(today: string): number { let n = 0; for (const [d, s] of LEAGUE.seats) if (today.slice(0, 7) >= d) n = s; return n; }

function elect(st: GameState, today: string) {
  const lg = st.league!;
  lg.elected = lg.elected.filter((e) => e.until > st.tick && lg.members.includes(e.id));
  const taken = new Set([...lg.permanent, ...lg.elected.map((e) => e.id)]);
  const pool = lg.members.filter((m) => !taken.has(m) && st.countries[m]?.alive);
  while (lg.elected.length < seatsFor(today) && pool.length) {
    const w = pool.map((id) => Math.sqrt(Math.max(1, st.countries[id].stats.pop) / 1e6) + st.countries[id].prestige / 50);
    let x = rand(st) * w.reduce((s, v) => s + v, 0); let i = 0;
    while (i < pool.length - 1 && x > w[i]) { x -= w[i]; i++; }
    lg.elected.push({ id: pool.splice(i, 1)[0], until: st.tick + LEAGUE.termYears * 12 });
  }
}

function vote(st: GameState, m: string, attacker: string, defender: string): 'for' | 'against' | 'abstain' {
  const a = st.countries[attacker];
  if (allied(st, m, attacker) || a.overlord === m || st.countries[m].overlord === attacker) return 'against';
  const lean = getRel(st, m, defender) - getRel(st, m, attacker) + a.infamy;
  return lean > 10 ? 'for' : lean < -25 ? 'against' : 'abstain';
}

/** Council vote on condemning `attacker` (unanimity of members not party to the dispute). */
export function leagueVote(st: GameState, warId: string, attacker: string, defender: string): LeagueResolution {
  const lg = st.league!;
  const votes: LeagueResolution['votes'] = {};
  for (const m of leagueCouncil(st)) if (m !== attacker && m !== defender) votes[m] = vote(st, m, attacker, defender);
  const vals = Object.values(votes);
  const passed = vals.includes('for') && !vals.includes('against');
  const res: LeagueResolution = { tick: st.tick, war: warId, attacker, defender, votes, passed };
  lg.resolutions.push(res); if (lg.resolutions.length > 100) lg.resolutions.splice(0, lg.resolutions.length - 100);
  const a = st.countries[attacker], dC = st.countries[defender];
  log(st, { type: 'diplomacy', text: `League of Nations Council on ${a.name}'s attack on ${dC.name}: ${passed ? 'condemned (unanimous)' : 'no unanimity'}.`, textVi: `Hội đồng Hội Quốc Liên về việc ${a.nameVi} tấn công ${dC.nameVi}: ${passed ? 'lên án (nhất trí)' : 'không đạt nhất trí'}.`, actors: [attacker, defender] });
  if (passed) {
    a.infamy += LEAGUE.condemnInfamy;
    for (const m of lg.members) if (m !== attacker) st.relations[relKey(m, attacker)] = (st.relations[relKey(m, attacker)] ?? 0) - LEAGUE.condemnRelations;
    if (lg.permanent.includes(attacker)) leave(st, attacker, 'withdraws after being condemned', 'rút khỏi Hội Quốc Liên sau khi bị lên án');
  }
  return res;
}

function leave(st: GameState, id: string, en: string, vi: string) {
  const lg = st.league!;
  if (!lg.members.includes(id)) return;
  lg.members = lg.members.filter((m) => m !== id); lg.permanent = lg.permanent.filter((m) => m !== id); lg.elected = lg.elected.filter((e) => e.id !== id);
  if (!lg.left.includes(id)) lg.left.push(id);
  log(st, { type: 'diplomacy', text: `${st.countries[id].name} ${en}.`, textVi: `${st.countries[id].nameVi} ${vi}.`, actors: [id], historical: true });
}

export function leagueMonth(st: GameState): void {
  if (st.mode !== 'historical') return;
  const lon = data().db.league_of_nations; if (!lon) return;
  const today = dateStr(st.date);
  if (!st.league) {
    if (today < lon.founded.slice(0, 7) + '-01' || today >= lon.dissolved) return;
    const out = outsideByHistory(st, today);
    const members = Object.values(st.countries).filter((c) => sovereign(c) && !out.has(c.id)).map((c) => c.id).sort();
    st.league = { founded: st.tick, members, left: [], permanent: [], elected: [], resolutions: [] };
    st.league.permanent = permanentNow(st, today).filter((p) => members.includes(p));
    elect(st, today);
    log(st, { type: 'diplomacy', text: `The League of Nations is founded (${members.length} members).`, textVi: `Hội Quốc Liên được thành lập (${members.length} thành viên).`, actors: st.league.permanent, historical: true });
    return;
  }
  const lg = st.league;
  if (lg.dissolved !== undefined) return;
  if (today >= lon.dissolved) {
    lg.dissolved = st.tick;
    log(st, { type: 'diplomacy', text: 'The League of Nations is dissolved; the United Nations takes over its work.', textVi: 'Hội Quốc Liên giải thể; Liên Hợp Quốc tiếp nhận công việc của tổ chức này.', actors: [], historical: true });
    return;
  }
  lg.members = lg.members.filter((m) => st.countries[m]?.alive);
  // great powers enter and leave on their historical dates; permanent seats follow. A state that left
  // (on its date, or after being condemned) does not come back.
  const out = outsideByHistory(st, today); const permNow = permanentNow(st, today);
  for (const id of [...lg.members]) if (out.has(id) && !permNow.includes(id)) leave(st, id, 'leaves the League of Nations', 'rời Hội Quốc Liên');
  for (const p of permNow) {
    if (lg.left.includes(p)) continue;
    if (!lg.members.includes(p)) { lg.members.push(p); log(st, { type: 'diplomacy', text: `${st.countries[p].name} joins the League of Nations with a permanent Council seat.`, textVi: `${st.countries[p].nameVi} gia nhập Hội Quốc Liên với ghế thường trực Hội đồng.`, actors: [p], historical: true }); }
    if (!lg.permanent.includes(p)) lg.permanent.push(p);
  }
  lg.permanent = lg.permanent.filter((p) => lg.members.includes(p));
  // new states join a year after they form (not those that left, nor those outside by history)
  for (const c of Object.values(st.countries)) if (sovereign(c) && !lg.members.includes(c.id) && !lg.left.includes(c.id) && !out.has(c.id) && st.tick - (c.formedAt ?? 0) >= LEAGUE.admissionDelayMonths) lg.members.push(c.id);
  if (st.date.m === 9) elect(st, today); // the Assembly met in September
  // the Council considers every new war of conquest by a member
  const voted = new Set(lg.resolutions.map((r) => r.war));
  for (const w of st.wars) {
    // disputes between members (Art. 12–16); colonial wars against non-members did not come before the Council
    if (voted.has(w.id) || w.kind !== 'conquest' || w.start < lg.founded || w.scripted) continue;
    if (lg.members.includes(w.attackers.leader) && lg.members.includes(w.defenders.leader)) leagueVote(st, w.id, w.attackers.leader, w.defenders.leader);
  }
}
