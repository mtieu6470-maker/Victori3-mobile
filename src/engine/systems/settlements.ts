// WW-01c: Historical Mode unifications and peace settlements (data historical_data/wars/settlements.json;
// treaty facts from ChatGPT CG-40/CG-41). Owner 2026-11-23: build World Wars 1 and 2 and their outcomes as in
// history (e.g. Austria-Hungary dissolves, Germany is divided after 1945 and reunified in 1990).
//
// A settlement concerns its actor, the holder of the actor's capital region (own capital or home territory).
// A war settlement applies only if that world war ended and the listed losers (winners) fought on the
// losing (winning) side; otherwise the world has diverged and it is skipped. Steps act on whoever holds the
// land at the time: cede regions, annex whole states, form new states, rename, move the capital, and restore
// a recorded pre-war snapshot of borders (the Allies' 31 December 1937 frontier). Unifications marked
// `noPlayerActor` are not imposed on the player's own country, and peacetime steps never take land from the
// player; world-war settlements bind the player like any belligerent (it fought and lost or won).
import { data } from '../data/db';
import { dateStr, log } from '../core';
import { createNation, transferRegion, annexCountry, makeSubject } from '../world';
import { setLaw, govLabelFor } from './politics';
import { isColonialRegion } from './growth';
import type { LawGroup } from '../data/dbTypes';
import type { Country, GameState } from '../types';

type Settlement = NonNullable<ReturnType<typeof data>['db']['settlements']>[number];
type Step = Settlement['steps'][number];

const regionOf = (st: GameState, id: string) => st.regions[data().regionIndex.get(id) ?? -1];

/** The state a capital region stands for now: its holder, if the region is its capital or home territory. */
export function holderOfCapital(st: GameState, regionId: string): Country | null {
  const r = regionOf(st, regionId);
  const c = r ? st.countries[r.owner] : undefined;
  if (!r || !c?.alive || c.decentralized) return null;
  return c.capital === r.id || !isColonialRegion(st, r) ? c : null;
}

function warSide(st: GameState, war: string, countryId: string): number | null {
  const rec = st.worldWars?.[war];
  const ww = (data().db.world_wars ?? []).find((w) => w.id === war);
  if (!rec?.ended || !ww) return null;
  for (let s = 0; s < ww.sides.length; s++) for (const m of ww.sides[s].members) if (rec.joined[m.id] === countryId) return s;
  return null;
}

function applyLaws(st: GameState, c: Country, laws: Record<string, string> | undefined, cause: string) {
  for (const [g, v] of Object.entries(laws ?? {})) {
    if ((c.laws as Record<string, string>)[g] !== v) setLaw(st, c, g as LawGroup, v, cause);
    if (c.regimeLaws) delete c.regimeLaws[g]; // a settlement ends the old regime's hold on this law
  }
}

function stepApply(st: GameState, s: Settlement, step: Step, actor: Country): void {
  const cause = s.id.toLowerCase().replace(/_/g, ' ');
  const peacetime = !s.war;
  const spare = (owner: string) => peacetime && owner === st.player && owner !== actor.id; // never take the player's land in peacetime
  switch (step.type) {
    case 'cede': {
      const to = step.to ? holderOfCapital(st, step.to) : actor;
      const from = step.from ? holderOfCapital(st, step.from) : null;
      if (!to || (step.from && !from)) return;
      for (const id of step.regions ?? []) {
        const r = regionOf(st, id); if (!r || r.owner === to.id) continue;
        if (from ? r.owner !== from.id : step.to ? r.owner !== actor.id : false) continue;
        if (spare(r.owner)) continue;
        const prev = st.countries[r.owner];
        transferRegion(st, id, to.id, cause);
        // a settlement is a recognised treaty: the former owner renounces the ceded land (no claim to reconquer)
        if (prev) prev.claims = prev.claims.filter((x) => x !== id);
      }
      return;
    }
    case 'annex_states': {
      for (const cap of step.capitals ?? []) {
        const t = holderOfCapital(st, cap);
        if (!t || t.id === actor.id || t.id === st.player) continue;
        if (step.onlyIfFormedBySettlement && st.settlements?.formed[step.onlyIfFormedBySettlement] !== t.id) continue;
        log(st, { type: 'state', text: `${t.name} joins ${actor.name} (${cause}).`, textVi: `${t.nameVi} sáp nhập vào ${actor.nameVi} (${cause}).`, actors: [actor.id, t.id], historical: true });
        annexCountry(st, t.id, actor.id, cause);
      }
      return;
    }
    case 'new_state': {
      const regs = (step.regions ?? []).filter((id) => regionOf(st, id)?.owner === actor.id);
      if (!regs.length) return;
      const id = createNation(st, step.key ?? s.id.toLowerCase(), regs, actor.id, cause, undefined, { en: step.name_en!, vi: step.name_vi! });
      actor.claims = actor.claims.filter((x) => !regs.includes(x)); // recognised by treaty
      const n = st.countries[id];
      n.army.manpower = n.army.target = Math.max(1000, Math.round(regs.reduce((t, r) => t + regionOf(st, r)!.pop, 0) * 0.003));
      applyLaws(st, n, step.laws, `founding (${s.id})`);
      n.govLabel = govLabelFor(n);
      (st.settlements!.formed ??= {})[s.id] = id;
      return;
    }
    case 'rename': {
      const t = step.target ? holderOfCapital(st, step.target) : actor;
      if (!t) return;
      const old = t.nameVi;
      t.name = step.name_en!; t.nameVi = step.name_vi!;
      applyLaws(st, t, step.laws, `settlement (${s.id})`);
      t.govLabel = govLabelFor(t);
      log(st, { type: 'state', text: `${step.name_en} (${cause}).`, textVi: `${old} → ${step.name_vi}.`, actors: [t.id], historical: true });
      return;
    }
    case 'make_subject': {
      // CG-45: protectorates (e.g. Vietnam under France 1884, Tunisia 1881, Egypt 1882, Bukhara 1868)
      const t = step.target ? holderOfCapital(st, step.target) : null;
      if (!t || t.id === actor.id || spare(t.id)) return;
      makeSubject(st, t.id, actor.id, step.subjectType ?? 'protectorate');
      return;
    }
    case 'release': {
      // a subject of the actor becomes fully independent (e.g. Serbia and Romania at Berlin 1878, Bulgaria 1908)
      const t = step.target ? holderOfCapital(st, step.target) : null;
      if (!t || t.overlord !== actor.id) return;
      t.overlord = null; t.subjectType = null;
      log(st, { type: 'diplomacy', text: `${t.name} becomes fully independent of ${actor.name} (${cause}).`, textVi: `${t.nameVi} hoàn toàn độc lập khỏi ${actor.nameVi} (${cause}).`, actors: [t.id, actor.id], historical: true });
      return;
    }
    case 'move_capital': {
      if (step.to && regionOf(st, step.to)?.owner === actor.id) actor.capital = step.to;
      return;
    }
    case 'restore_snapshot': {
      const snap = st.settlements?.snapshots[step.snapshot!];
      if (!snap) return;
      for (const r of st.regions) {
        if (r.owner !== actor.id) continue;
        const prev = snap[r.id];
        if (!prev || prev === actor.id) continue;
        const p = st.countries[prev];
        if (!p) continue;
        if (p.alive) { transferRegion(st, r.id, prev, cause); continue; }
        // a state annexed before or during the war is re-established on its pre-war land
        const back = st.regions.filter((x) => x.owner === actor.id && snap[x.id] === prev).map((x) => x.id);
        const id = createNation(st, p.id.toLowerCase(), back, actor.id, 'liberation', p, { en: p.name, vi: p.nameVi });
        snap[r.id] = id; for (const x of back) snap[x] = id;
      }
      return;
    }
  }
}

export function settlementsMonth(st: GameState): void {
  if (st.mode !== 'historical') return;
  const list = data().db.settlements ?? [];
  if (!list.length) return;
  st.settlements ??= { applied: [], snapshots: {}, formed: {} };
  const today = dateStr(st.date);
  for (const s of list) {
    if (s.date.slice(0, 7) + '-01' > today || st.settlements.applied.includes(s.id)) continue;
    if (s.war && !st.worldWars?.[s.war]?.ended) continue; // wait for the war to end (it may end later than the treaty date)
    st.settlements.applied.push(s.id);
    if (s.snapshot) { st.settlements.snapshots[s.snapshot] = Object.fromEntries(st.regions.map((r) => [r.id, r.owner])); continue; }
    const actor = s.actor ? holderOfCapital(st, s.actor) : null;
    if (!actor) continue;
    if (s.noPlayerActor && actor.id === st.player) {
      log(st, { type: 'decision', text: `${s.id.replace(/_/g, ' ')}: your country decides its own course.`, textVi: `${s.id.replace(/_/g, ' ')}: quốc gia của bạn tự quyết con đường riêng.`, actors: [actor.id] });
      continue;
    }
    if (s.war) {
      const ww = (data().db.world_wars ?? []).find((w) => w.id === s.war);
      const losing = ww ? 1 - ww.winnerSide : -1;
      if ((s.losers ?? []).some((cap) => { const h = holderOfCapital(st, cap); return !h || warSide(st, s.war!, h.id) !== losing; })) continue;
      if ((s.winners ?? []).some((cap) => { const h = holderOfCapital(st, cap); return !h || warSide(st, s.war!, h.id) !== 1 - losing; })) continue;
    }
    for (const step of s.steps) {
      if (!actor.alive) break;
      stepApply(st, s, step, actor);
    }
  }
}
