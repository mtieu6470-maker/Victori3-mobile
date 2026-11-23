// REGIME-01a: Historical Mode regime changes and state formations 1836-1991 (CG-41 research; data
// historical_data/history/regime_changes.json). Owner 2026-11-23: Historical Mode must follow history
// (e.g. the October Revolution and the founding of the USSR), not keep 1836 regimes into the 20th century.
//
// On its date, an event concerns the state holding its historical capital region, provided that region is
// the state's own capital or part of its home (not colonial) territory; otherwise the simulated world has
// diverged and the event is skipped. Independence events concern the holder of the listed cultures' regions.
//
// REGIME-02 (owner 2026-11-23): AI and player follow the same rules. On its date an event opens a journal
// entry (V3-style mission, shown as a newspaper headline) for the country concerned:
//  - 'reform' entries (constitutions, reforms and welfare inside a regime): the regime's laws must be passed one
//    by one through ordinary reforms; when all are in force the change (name, form of government, head of
//    state) happens. The AI pursues them with a strong pull but still weighs its interest groups, so it can
//    fall short — circumstances decide.
//  - 'proclaim' entries (a new regime or state: revolutions, coups, unifications, new republics): the change is carried out in
//    one action that installs all the laws at once.
//  - 'independence' entries: carried out by recognising the new state.
// The AI takes the historical action at once; the player decides, or keeps the current regime. Entries
// expire after REGIME_JOURNAL.years. Laws a regime set keep an inertia for the AI afterwards, but it can
// still change them as circumstances require. A regime change installs a new head of state whose title
// follows the regime (e.g. a tsar becomes a general secretary) and updates the form of government.
import { data } from '../data/db';
import { dateStr, dateToTick, log, newId, rand } from '../core';
import { createNation } from '../world';
import { setLaw, govLabelFor, leaderTitle, generatedName } from './politics';
import { isColonialRegion } from './growth';
import { answerCallToArms, refuseCallToArms } from './diplomacy';
import { DECOL_PARAMS, decolRecord, playerDecolonisation, grantIndependence, refuseIndependence } from './decolonisation';
import type { LawGroup } from '../data/dbTypes';
import type { Country, GameState, JournalEntry } from '../types';

type RegimeEvent = NonNullable<ReturnType<typeof data>['db']['regime_changes']>[number];

/**
 * Design parameters. years: how long a journal entry stays open; legitimacy: gained when a regime is
 * enacted through reforms; pull: AI reform utility towards an entry's laws; inertia: AI reform utility
 * against leaving a law a regime set; holdYears: longest such inertia without a later event.
 */
export const REGIME_JOURNAL = { years: 10, legitimacy: 10, pull: 2.0, inertia: 0.6, holdYears: 60 } as const;
/** Events the player already meets as a historical decision window (no second entry). */
const COVERED_BY_WINDOW: Record<string, string> = { 'JAP-1868-01': 'dw_meiji_restoration' };
const REFORM_TYPES = /^(constitution($|_and_|al_reform|al_amendment)|reform_process|social_|welfare_|political_transition|referendum_)/;
export type RegimeEntryKind = 'reform' | 'proclaim' | 'independence';
/** A new regime or state (renamed) is proclaimed in one act; reforms inside a regime go through its laws. */
export const regimeEntryKind = (e: { type: string; independence: string[] | null; independenceRegions?: string[] | null; rename: boolean }): RegimeEntryKind => e.independence || e.independenceRegions ? 'independence' : !e.rename && REFORM_TYPES.test(e.type) ? 'reform' : 'proclaim';

export const regimeEvent = (id: string): RegimeEvent | undefined => (data().db.regime_changes ?? []).find((e) => e.id === id);

/** Records the event's laws for the AI's inertia until a later event for the same capital changes the group. */
function holdLaws(st: GameState, c: Country, e: RegimeEvent) {
  const later = (data().db.regime_changes ?? []).filter((x) => x.capitalRegion === e.capitalRegion && x.date > e.date);
  c.regimeLaws ??= {};
  for (const g of Object.keys(e.laws)) {
    const next = later.find((x) => g in x.laws);
    c.regimeLaws[g] = Math.min(next ? dateToTick(next.date) : Infinity, st.tick + REGIME_JOURNAL.holdYears * 12);
  }
}

/** The country an event concerns now, or null when the simulated world no longer matches it. */
export function regimeActor(st: GameState, e: RegimeEvent): Country | null {
  const region = st.regions[data().regionIndex.get(e.capitalRegion) ?? -1];
  const c = region ? st.countries[region.owner] : undefined;
  if (!region || !c?.alive || c.decentralized) return null;
  if (e.independence) return st.regions.some((r) => r.owner === c.id && e.independence!.includes(r.culture)) ? c : null;
  if (e.independenceRegions) return e.independenceRegions.some((id) => st.regions[data().regionIndex.get(id) ?? -1]?.owner === c.id) ? c : null;
  if (c.capital !== e.capitalRegion && isColonialRegion(st, region)) return null;
  return c;
}

/** New head of state after a regime change: the recorded office-holder if the data has one, else generated. */
function newLeader(st: GameState, c: Country, e: RegimeEvent): Country['leader'] {
  const y = Number(e.date.slice(0, 4));
  const rec = data().leadersOf(c.id).find((l) => l.governance === c.laws.governance && Math.abs(Number(l.from.slice(0, 4)) - y) <= 1 && l.to > e.date);
  if (rec) return { name: rec.name, born: rec.born ? Number(rec.born.slice(0, 4)) : null, since: st.date.y, historical: true, diesOn: rec.died ?? null, ...(rec.title ? { title: rec.title } : {}) };
  const title = leaderTitle({ ...c, leader: { ...c.leader, title: undefined } });
  const elected = c.laws.governance === 'republic' && c.laws.power !== 'one_party_state' && c.laws.power !== 'autocracy';
  return { name: generatedName(st, c, title), born: st.date.y - 45 - Math.floor(rand(st) * 15), since: st.date.y, historical: false, ...(elected ? { termEnds: `${st.date.y + 4}-03-01` } : {}) };
}

/** CG-44: defence treaties concluded with the (new) state, e.g. the US with the ROC and the ROK. */
function treatyAllies(st: GameState, e: RegimeEvent, id: string) {
  for (const cap of e.allies ?? []) {
    const r = st.regions[data().regionIndex.get(cap) ?? -1]; const a = r ? st.countries[r.owner] : undefined;
    if (!a?.alive || a.id === id || st.treaties.some((t) => t.type === 'alliance' && t.members.includes(a.id) && t.members.includes(id))) continue;
    st.treaties.push({ id: newId(st, 'ally'), type: 'alliance', members: [a.id, id], start: st.tick });
    log(st, { type: 'diplomacy', text: `${a.name} and ${st.countries[id].name} sign a defence treaty.`, textVi: `${a.nameVi} và ${st.countries[id].nameVi} ký hiệp ước phòng thủ.`, actors: [a.id, id], historical: true });
  }
}

/** Carries out one regime event for its country (laws, name, form of government, head of state). */
export function applyRegimeEvent(st: GameState, e: RegimeEvent, c: Country): void {
  const d = data();
  // CG-44 partition lines (Korea, Vietnam, Taiwan): a state formed from explicit regions. If the holder's own
  // capital lies inside them, the holder itself is that state and is renamed instead (e.g. the Nguyễn state
  // becoming the State of Vietnam in 1949).
  const splitRegions = e.independenceRegions && !e.independenceRegions.includes(c.capital) ? e.independenceRegions : null;
  if (e.independence || splitRegions) {
    const regs = st.regions.filter((r) => r.owner === c.id && (splitRegions ? splitRegions.includes(r.id) : e.independence!.includes(r.culture))).sort((a, b) => (a.id === e.capitalRegion ? -1 : b.id === e.capitalRegion ? 1 : b.pop - a.pop)).map((r) => r.id);
    if (!regs.length) return;
    const id = createNation(st, e.id.toLowerCase(), regs, c.id, 'independence', undefined, { en: e.name_en, vi: e.name_vi });
    const n = st.countries[id];
    // The new state was recognised by treaty (Tartu, Riga, Moscow 1920-21): the former owner renounces its
    // claims on the ceded regions, a truce of at most 2 years applies (owner rule), and the new state raises
    // an army in proportion to its population, as decolonised states do.
    c.claims = c.claims.filter((r) => !regs.includes(r));
    n.truce = { with: c.id, until: st.tick + DECOL_PARAMS.truceYears * 12 };
    n.army.manpower = n.army.target = Math.max(1000, Math.round(regs.reduce((s, r) => s + st.regions[d.regionIndex.get(r)!].pop, 0) * DECOL_PARAMS.armyShare));
    for (const [g, v] of Object.entries(e.laws)) setLaw(st, n, g as LawGroup, v, `founding (${e.id})`);
    if (n.id !== st.player) holdLaws(st, n, e);
    n.govLabel = govLabelFor(n);
    n.leader = newLeader(st, n, e);
    treatyAllies(st, e, n.id);
    return;
  }
  for (const [g, v] of Object.entries(e.laws)) if ((c.laws as Record<string, string>)[g] !== v) setLaw(st, c, g as LawGroup, v, `regime change (${e.id})`);
  if (c.id !== st.player) holdLaws(st, c, e);
  const oldVi = c.nameVi;
  if (e.rename) {
    c.name = e.name_en; c.nameVi = e.name_vi;
    c.leader = newLeader(st, c, e); c.heir = null;
  }
  c.govLabel = govLabelFor(c);
  treatyAllies(st, e, c.id);
  delete c.crisis;
  log(st, { type: 'state', text: e.rename ? `${e.name_en} is proclaimed (${e.type.replace(/_/g, ' ')}).` : `${c.name}: ${e.type.replace(/_/g, ' ')}.`, textVi: e.rename ? `${oldVi} → ${e.name_vi}.` : `${c.nameVi}: ${e.name_vi}.`, actors: [c.id], historical: true });
}

/** Goals of a regime journal entry: each law of the historical regime and whether it is in force. */
export function journalGoals(st: GameState, j: JournalEntry): { group: LawGroup; value: string; done: boolean }[] {
  const e = regimeEvent(j.event); const c = st.countries[j.country];
  if (!e || !c) return [];
  return Object.entries(e.laws).map(([g, v]) => ({ group: g as LawGroup, value: v, done: (c.laws as Record<string, string>)[g] === v }));
}

function closeEntry(st: GameState, j: JournalEntry, status: JournalEntry['status']) {
  j.status = status; j.ended = st.tick;
  const e = regimeEvent(j.event); const c = st.countries[j.country];
  if (status === 'expired' && e && c) log(st, { type: 'decision', text: `${c.name}: the moment for "${e.name_en}" has passed.`, textVi: `${c.nameVi}: thời cơ cho "${e.name_vi}" đã qua.`, actors: [c.id] });
}

function completeEntry(st: GameState, j: JournalEntry, e: RegimeEvent, c: Country, byReform = true) {
  applyRegimeEvent(st, e, c);
  if (byReform) c.legitimacy = Math.min(100, c.legitimacy + REGIME_JOURNAL.legitimacy);
  closeEntry(st, j, 'completed');
}

/** Monthly: completes reform entries whose laws are in force; expires entries whose moment has passed. */
function journalMonth(st: GameState) {
  for (const j of st.journal ?? []) {
    if (j.status !== 'active') continue;
    if (j.kind === 'call_to_arms') {
      // CTA-01: unanswered by the deadline, or the war is over or already joined → it lapses as a refusal
      const w = st.wars.find((x) => x.id === j.event);
      if (!w || w.defenders.members.includes(j.country)) { closeEntry(st, j, 'expired'); continue; }
      if (st.tick > j.expires) { refuseCallToArms(st, j.country, j.event); closeEntry(st, j, 'expired'); }
      continue;
    }
    if (j.kind === 'decolonisation') {
      // DECOL-02: closes when the player no longer holds the colony, or the decision window ends
      const rec = decolRecord(j.event); const mine = rec ? playerDecolonisation(st, rec) : null;
      if (!mine || (!mine.subject && !mine.regions.length) || st.tick > j.expires || j.country !== st.player) closeEntry(st, j, 'expired');
      continue;
    }
    const e = regimeEvent(j.event); const c = st.countries[j.country];
    if (!e || !c?.alive || regimeActor(st, e)?.id !== c.id || st.tick > j.expires) { closeEntry(st, j, 'expired'); continue; }
    if (regimeEntryKind(e) !== 'independence' && journalGoals(st, j).every((g) => g.done)) completeEntry(st, j, e, c);
  }
}

/** AI reform pull: an active reform entry of `c` asks for `group: value`. */
export function journalPull(st: GameState, c: Country, group: string, value: string): number {
  for (const j of st.journal ?? []) {
    if (j.status !== 'active' || j.country !== c.id) continue;
    const e = regimeEvent(j.event);
    if (e && regimeEntryKind(e) === 'reform' && e.laws[group] === value) return REGIME_JOURNAL.pull;
  }
  return 0;
}
/** Law values the country's active entries ask for (added to the AI's reform candidates). */
export function journalGoalValues(st: GameState, c: Country, group: string): string[] {
  const out: string[] = [];
  for (const j of st.journal ?? []) if (j.status === 'active' && j.country === c.id) { const v = regimeEvent(j.event)?.laws[group]; if (v) out.push(v); }
  return out;
}
/** Inertia against leaving a law a historical regime set, while it holds (AI only; soft, not a block). */
export function regimeLawInertia(st: GameState, c: Country, group: string): number {
  return (c.regimeLaws?.[group] ?? -1) > st.tick ? REGIME_JOURNAL.inertia : 0;
}

/** Player command: carry out (proclaim/independence at once; reform entries once their laws are in force) or abandon. */
export function journalAction(st: GameState, playerId: string, entryId: string, action: 'complete' | 'abandon'): { ok: boolean; reason?: string } {
  const j = st.journal?.find((x) => x.id === entryId);
  if (!j || j.status !== 'active') return { ok: false, reason: 'No such active journal entry' };
  if (j.country !== playerId) return { ok: false, reason: 'This journal entry belongs to a different country' };
  if (j.kind === 'call_to_arms') {
    if (action === 'abandon') { refuseCallToArms(st, playerId, j.event); closeEntry(st, j, 'abandoned'); return { ok: true }; }
    if (!answerCallToArms(st, playerId, j.event)) return { ok: false, reason: 'The war is over or you are already part of it' };
    closeEntry(st, j, 'completed');
    return { ok: true };
  }
  if (j.kind === 'decolonisation') {
    const rec = decolRecord(j.event);
    if (!rec) return { ok: false, reason: 'Unknown independence record' };
    if (action === 'abandon') { refuseIndependence(st, rec); closeEntry(st, j, 'abandoned'); log(st, { type: 'decision', text: `${st.countries[playerId].name} keeps ${rec.name} as a colony; unrest grows.`, textVi: `${st.countries[playerId].nameVi} giữ ${rec.name_vi} làm thuộc địa; bất ổn gia tăng.`, actors: [playerId], historical: false, divergence: true }); return { ok: true }; }
    if (!grantIndependence(st, rec)) return { ok: false, reason: 'The colony is no longer yours' };
    closeEntry(st, j, 'completed');
    return { ok: true };
  }
  const e = regimeEvent(j.event); const c = st.countries[j.country];
  if (action === 'abandon') {
    closeEntry(st, j, 'abandoned');
    if (c && e) log(st, { type: 'decision', text: `${c.name} keeps its regime instead of "${e.name_en}".`, textVi: `${c.nameVi} giữ chế độ hiện tại thay vì "${e.name_vi}".`, actors: [c.id], historical: false, divergence: true });
    return { ok: true };
  }
  if (!e || !c || regimeActor(st, e)?.id !== c.id) return { ok: false, reason: 'The historical moment no longer applies' };
  const kind = regimeEntryKind(e);
  if (kind === 'reform' && !journalGoals(st, j).every((g) => g.done)) return { ok: false, reason: 'Not all laws of the regime are in force yet' };
  completeEntry(st, j, e, c, kind === 'reform');
  return { ok: true };
}

export function regimesMonth(st: GameState): void {
  journalMonth(st); // journal entries (e.g. calls to arms) exist in both modes
  if (st.mode !== 'historical') return;
  const events = data().db.regime_changes ?? [];
  if (!events.length) return;
  st.regimesApplied ??= [];
  const today = dateStr(st.date);
  for (const e of events) {
    if (e.date.slice(0, 7) + '-01' > today || st.regimesApplied.includes(e.id)) continue;
    st.regimesApplied.push(e.id);
    const c = regimeActor(st, e);
    if (!c) continue;
    const player = c.id === st.player;
    const w = COVERED_BY_WINDOW[e.id];
    if (player && w && (st.firedEvents.includes(w) || st.pendingPlayerDecisions.some((p) => p.windowId === w))) continue;
    const j: JournalEntry = { id: `jr_${e.id}`, kind: 'regime', event: e.id, country: c.id, started: st.tick, expires: st.tick + REGIME_JOURNAL.years * 12, status: 'active' };
    (st.journal ??= []).push(j);
    if (player) { log(st, { type: 'decision', text: `Historical turning point for ${c.name}: ${e.name_en}. A journal entry is open.`, textVi: `Bước ngoặt lịch sử của ${c.nameVi}: ${e.name_vi}. Nhiệm vụ mới trong Nhật ký.`, actors: [c.id] }); continue; }
    // AI: takes the historical action now; reform entries are pursued through its reforms (ai.ts).
    if (regimeEntryKind(e) !== 'reform') completeEntry(st, j, e, c, false);
    else if (journalGoals(st, j).every((g) => g.done)) completeEntry(st, j, e, c);
  }
}
