// Political Engine (shared): interest groups, legitimacy, radicalism, law reforms, revolutions and secession.
import { data } from '../data/db';
import { LAW_GROUPS, type LawGroup } from '../data/dbTypes';
import { IGS, S, type Country, type GameState, type IG } from '../types';
import { clamp, chance, log, rand } from '../core';
import { coreNationOf } from './population';
import { regionsOf, bordersOf } from '../cache';
import { lawUnlocked } from '../laws';

/** Law preferences of interest groups (+ supports, - opposes). Same table in both modes. */
export const IG_PREFS: Record<IG, Partial<Record<string, number>>> = {
  landowners: { universal_suffrage: -2, one_party_state: -2, command_economy: -3, autocracy: 1, oligarchy: 2, census_suffrage: 0, universal_male_suffrage: -2, traditionalism: 2, mercantilism: 1, laissez_faire: -1, protectionism: 1, free_trade: -1, serfdom: 2, slavery: 1, traditional_tenancy: 1, free_labor: -2, state_religion: 1, censorship: 1, feudal_levies: 1, monarchy: 1, republic: -1 },
  industrialists: { one_party_state: -2, command_economy: -3, universal_suffrage: -1, census_suffrage: 2, autocracy: -1, laissez_faire: 2, interventionism: 1, traditionalism: -2, free_trade: 1, protectionism: 1, isolationism: -2, free_labor: 2, serfdom: -2, slavery: -1, public_schools: 1, limited_press: 1, professional_army: 1 },
  intelligentsia: { universal_suffrage: 2, one_party_state: -2, universal_male_suffrage: 1, census_suffrage: 1, autocracy: -2, theocracy: -2, free_press: 2, censorship: -2, secularism: 2, freedom_of_conscience: 1, state_religion: -1, public_schools: 2, free_labor: 1, slavery: -2, serfdom: -2, republic: 1 },
  petty_bourgeoisie: { one_party_state: -1, command_economy: -2, census_suffrage: 1, protectionism: 2, mercantilism: 1, free_trade: -1, state_religion: 1, limited_press: 1, monarchy: 1, free_labor: 1, mass_conscription: 1 },
  clergy: { one_party_state: -1, universal_suffrage: -1, state_religion: 2, secularism: -2, freedom_of_conscience: -1, religious_schools: 2, public_schools: -1, censorship: 1, theocracy: 2, monarchy: 1, autocracy: 1 },
  armed_forces: { one_party_state: 1, autocracy: 1, professional_army: 2, mass_conscription: 1, feudal_levies: -1, monarchy: 1, protectionism: 1 },
  rural_folk: { universal_suffrage: 1, command_economy: -1, traditional_tenancy: 1, serfdom: -2, free_labor: 1, protectionism: 1, state_religion: 1, universal_male_suffrage: 1, mass_conscription: -1 },
  trade_unions: { universal_suffrage: 2, command_economy: 2, one_party_state: 1, universal_male_suffrage: 1, free_labor: 1, interventionism: 2, laissez_faire: -1, free_press: 1, public_schools: 1, secularism: 1 },
};

const POWER_WEIGHTS: Record<string, Record<IG, number>> = {
  autocracy: { landowners: 1.5, industrialists: 0.6, intelligentsia: 0.4, petty_bourgeoisie: 0.5, clergy: 1.2, armed_forces: 2.0, rural_folk: 0.15, trade_unions: 0.05 },
  oligarchy: { landowners: 2.0, industrialists: 1.0, intelligentsia: 0.5, petty_bourgeoisie: 0.6, clergy: 1.0, armed_forces: 1.2, rural_folk: 0.15, trade_unions: 0.05 },
  census_suffrage: { landowners: 1.3, industrialists: 1.6, intelligentsia: 1.0, petty_bourgeoisie: 1.0, clergy: 0.8, armed_forces: 0.8, rural_folk: 0.3, trade_unions: 0.2 },
  universal_male_suffrage: { landowners: 0.8, industrialists: 1.0, intelligentsia: 1.0, petty_bourgeoisie: 1.0, clergy: 0.7, armed_forces: 0.6, rural_folk: 1.0, trade_unions: 1.0 },
  // REGIME-01b: universal suffrage widens the electorate further; in a one-party state the ruling party
  // draws on the army and organised labour, and the old propertied groups lose their voice.
  universal_suffrage: { landowners: 0.7, industrialists: 0.9, intelligentsia: 1.1, petty_bourgeoisie: 1.0, clergy: 0.7, armed_forces: 0.6, rural_folk: 1.2, trade_unions: 1.2 },
  one_party_state: { landowners: 0.2, industrialists: 0.3, intelligentsia: 0.6, petty_bourgeoisie: 0.4, clergy: 0.2, armed_forces: 1.8, rural_folk: 0.4, trade_unions: 1.5 },
  theocracy: { landowners: 1.0, industrialists: 0.3, intelligentsia: 0.3, petty_bourgeoisie: 0.5, clergy: 3.0, armed_forces: 1.0, rural_folk: 0.3, trade_unions: 0.05 },
  tribal_council: { landowners: 1.5, industrialists: 0.1, intelligentsia: 0.2, petty_bourgeoisie: 0.3, clergy: 1.0, armed_forces: 1.5, rural_folk: 1.0, trade_unions: 0 },
};

/**
 * REGIME-02 (owner 2026-11-23): the head of state's title follows the regime — a tsar or king under a
 * monarchy, a president in a republic, a general secretary where a communist party rules (one-party
 * state with a command economy or a socialist state name), a party leader in other one-party states,
 * a head of state in a military or personal dictatorship. A historical record's own title wins.
 */
export type LeaderTitle = 'emperor' | 'king' | 'president' | 'general_secretary' | 'party_leader' | 'head_of_state' | 'supreme_leader' | 'chief';
const IMPERIAL = /Empire|Reich|Qing|Mughal|Japan|Đế quốc|Đế chế|Đại Thanh|Đại Nam|Nhật Bản/;
const SOCIALIST = /Soviet|Socialist|People's|Xô viết|Xã hội chủ nghĩa|Nhân dân/;
export function leaderTitle(c: Pick<Country, 'laws' | 'name' | 'nameVi' | 'leader'>): string {
  if (c.leader.title) return c.leader.title.toLowerCase().replace(/ /g, '_');
  const { governance, power, economy } = c.laws;
  if (power === 'tribal_council' || governance === 'chiefdom') return 'chief';
  if (governance === 'theocracy' || power === 'theocracy') return 'supreme_leader';
  if (power === 'one_party_state') return economy === 'command_economy' || SOCIALIST.test(c.name) || SOCIALIST.test(c.nameVi) ? 'general_secretary' : 'party_leader';
  if (governance === 'monarchy') return IMPERIAL.test(c.name) || IMPERIAL.test(c.nameVi) ? 'emperor' : 'king';
  if (governance === 'republic' && power === 'autocracy') return 'head_of_state';
  return 'president';
}
/** REGIME-02: government label (form of state) derived from the laws after a regime change. */
export function govLabelFor(c: Pick<Country, 'laws' | 'name' | 'nameVi' | 'govLabel'>): string {
  const { governance, power, economy } = c.laws;
  if (governance === 'theocracy' || power === 'theocracy') return 'theocracy';
  if (power === 'one_party_state') return economy === 'command_economy' || SOCIALIST.test(c.name) || SOCIALIST.test(c.nameVi) ? 'socialist_republic' : 'single_party_state';
  if (governance === 'monarchy') return power === 'autocracy' ? 'absolute_monarchy' : 'constitutional_monarchy';
  if (governance === 'republic') return power === 'autocracy' ? 'dictatorship' : 'presidential_republic';
  return c.govLabel;
}

/**
 * REGIME-02 design parameter: monthly reform progress added while an active regime journal entry asks for
 * the law (the regime's programme carries it, like a V3 journal-entry modifier). Same for AI and player.
 */
export const JOURNAL_REFORM_MOMENTUM = 0.08;
export function journalMomentum(st: GameState, c: Country, group: string, value: string): number {
  for (const j of st.journal ?? []) {
    if (j.status !== 'active' || j.country !== c.id) continue;
    if (data().db.regime_changes?.find((e) => e.id === j.event)?.laws[group] === value) return JOURNAL_REFORM_MOMENTUM;
  }
  return 0;
}

/**
 * LAW-CAL-01: suffrage movements (V3-style political movements). People outside the electorate push for the
 * next step of the franchise once mass politics is known; the movement's strength grows with literacy
 * (population-weighted), so countries with low literacy keep lagging. A strong movement makes the AI take up
 * the reform and helps any reform of that step through (AI and player alike). One-party states suppress it.
 * LAW-CAL-02 (owner: make it closer to reality): a movement grows over decades after its idea arrives
 * (`matureYears`; e.g. the UK Reform League 1865 → universal male suffrage 1918), and mass mobilisation in a
 * great war strengthens both the male and the women's franchise (UK 1918, Netherlands 1917, Italy 1919),
 * growing with the months of mobilisation. Women's suffrage in peacetime needs a very literate society
 * (early adopters were small, literate societies: New Zealand 1893, Finland 1906, Norway 1913).
 * Ideas a country had before 1836 or never recorded count as mature.
 * Design parameters, calibrated against ChatGPT CG-42 adoption years (tools/law-adoption-report.ts).
 */
export const SUFFRAGE_MOVEMENT = { tech: 'mass_politics', litFloor: 0.35, litSpan: 0.45, utility: 4.5, progress: 0.35, matureYears: 45, warBoost: 0.4, warYears: 8, warFullMonths: 36 } as const;
/**
 * Women's suffrage needs a more literate society; mass mobilisation in a great war (within warYears) adds
 * warBoost — the wave after 1914-18 (UK 1918, Germany 1919, USA 1920; CG-42).
 */
export const WOMENS_SUFFRAGE_MOVEMENT = { tech: 'feminism', litFloor: 0.7, litSpan: 0.3, warBoost: 0.8, warYears: 8, matureYears: 40, warFullMonths: 36 } as const;
const SUFFRAGE_DEMAND: Record<string, string> = { autocracy: 'census_suffrage', oligarchy: 'census_suffrage', census_suffrage: 'universal_male_suffrage', universal_male_suffrage: 'universal_suffrage' };
export function suffrageMovement(st: GameState, c: Country, group: string, value: string): number {
  if (group !== 'power' || SUFFRAGE_DEMAND[c.laws.power] !== value || !c.techs.includes(SUFFRAGE_MOVEMENT.tech) || !lawUnlocked(c, value)) return 0;
  const regs = regionsOf(st, c.id); const pop = regs.reduce((s, r) => s + r.pop, 0);
  if (pop <= 0) return 0;
  const lit = regs.reduce((s, r) => s + r.literacy * r.pop, 0) / pop;
  const P = value === 'universal_suffrage' ? WOMENS_SUFFRAGE_MOVEMENT : SUFFRAGE_MOVEMENT;
  const since = c.ideasSince?.[P.tech];
  const maturity = since === undefined ? 1 : clamp((st.tick - since) / (P.matureYears * 12), 0, 1);
  // the effect of mobilisation builds over the years of war (full after warFullMonths)
  const war = c.lastGreatWar !== undefined && st.tick - c.lastGreatWar <= P.warYears * 12 ? P.warBoost * clamp((c.greatWarMonths ?? 0) / P.warFullMonths, 0, 1) : 0;
  return clamp(clamp((lit - P.litFloor) / P.litSpan, 0, 1) * maturity + war, 0, 1);
}

export function igApproval(c: Country, ig: IG, laws = c.laws): number {
  let a = 0; const pref = IG_PREFS[ig];
  for (const g of LAW_GROUPS) a += pref[laws[g]] ?? 0;
  return a;
}

export function updatePolitics(st: GameState, c: Country, init = false) {
  const regs = regionsOf(st, c.id);
  const pop = regs.reduce((s, r) => s + r.pop, 0);
  if (pop <= 0) return;
  const st_ = (i: number) => regs.reduce((s, r) => s + r.pop * r.strata[i] * (0.3 + r.literacy), 0) / pop;
  const sol = regs.reduce((s, r) => s + r.sol * r.pop, 0) / pop;
  const raw: Record<IG, number> = {
    landowners: st_(S.aristocrats) * 40 + st_(S.peasants) * 0.2,
    industrialists: st_(S.capitalists) * 50,
    intelligentsia: st_(S.middle) * 3 * (0.5 + regs.reduce((s, r) => s + r.literacy * r.pop, 0) / pop),
    petty_bourgeoisie: st_(S.middle) * 2 + st_(S.artisans) * 1.2,
    clergy: st_(S.clergy) * 30 + st_(S.peasants) * 0.15,
    armed_forces: (c.army.manpower / pop) * 60,
    rural_folk: st_(S.peasants) * 0.6,
    trade_unions: c.techs.includes('socialist_thought') ? st_(S.workers) * 1.2 + st_(S.laborers) * 0.3 : 0,
  };
  const w = POWER_WEIGHTS[c.laws.power] ?? POWER_WEIGHTS.autocracy;
  let tot = 0; for (const g of IGS) { raw[g] *= w[g]; tot += raw[g]; }
  let legitTarget = 0;
  for (const g of IGS) {
    const clout = tot > 0 ? raw[g] / tot : 0;
    const appr = clamp(igApproval(c, g) + (sol - 0.5) * 6 + (c.warExhaustion > 50 ? -2 : 0), -10, 10);
    c.igs[g] = { clout, approval: init ? appr : c.igs[g].approval * 0.8 + appr * 0.2 };
    legitTarget += clout * c.igs[g].approval;
  }
  // legitimacy: approval of the powerful, tradition of the governance form, prestige and recent defeats
  const tradition = c.laws.governance === 'monarchy' || c.laws.governance === 'theocracy' ? 8 : 4;
  const target = clamp(30 + legitTarget * 2.4 + tradition + clamp(c.prestige, -50, 100) * 0.08 - (c.lastWarLost !== null && st.tick - c.lastWarLost < 60 ? 15 : 0) - c.famine * 30, 5, 100);
  const crisis = c.crisis && st.tick < c.crisis.until ? c.crisis.delta : 0;
  if (c.crisis && st.tick >= c.crisis.until) delete c.crisis;
  const crisisTarget = clamp(target + crisis, 0, 100);
  c.legitimacy = init ? crisisTarget : c.legitimacy + (crisisTarget - c.legitimacy) * 0.05;
  // radicalism per region
  let radPop = 0;
  for (const r of regs) {
    const famine = (r as any).famine ?? 0;
    const ideas = (r.literacy * 0.5) * (c.laws.power === 'autocracy' || c.laws.power === 'theocracy' ? 1 : 0.4) * (c.laws.press === 'censorship' ? 0.6 : 1);
    const serf = c.laws.labor === 'serfdom' ? 0.08 : 0;
    const t = clamp(0.02 + Math.max(0, 0.5 - r.sol) * 0.6 + famine * 0.5 + ideas * 0.25 + serf + r.nationalism * 0.2 + (c.legitimacy < 40 ? 0.05 : 0), 0, 0.9);
    r.radical = init ? t : r.radical + (t - r.radical) * 0.04;
    radPop += r.radical * r.pop;
  }
  c.radicalism = radPop / pop;
  c.stats.pop = pop; c.stats.sol = sol; c.stats.literacy = regs.reduce((s, r) => s + r.literacy * r.pop, 0) / pop;
  // industry: share of the population employed in manufacturing buildings (2,000 workers per level, as LEVEL_WORKERS in economy)
  c.stats.industry = regs.reduce((s, r) => s + (r.buildings.textile_mill + r.buildings.ironworks + r.buildings.tool_works + r.buildings.arms_works + r.buildings.luxury_workshop) * 2000, 0) / pop;
}

/** Support for changing a law: clout-weighted change in approval. Positive = more support than opposition. */
export function reformSupport(c: Country, group: LawGroup, value: string): number {
  const next = { ...c.laws, [group]: value };
  let s = 0; for (const g of IGS) s += c.igs[g].clout * (igApproval(c, g, next) - igApproval(c, g));
  return s;
}

export function startReform(st: GameState, c: Country, group: LawGroup, value: string): boolean {
  if (c.reform || c.laws[group] === value || !lawUnlocked(c, value)) return false;
  c.reform = { group, value, progress: 0, startedTick: st.tick };
  log(st, { type: 'politics', text: `${c.name} begins debating ${group}: ${value}.`, textVi: `${c.nameVi} bắt đầu tranh luận luật ${group}: ${value}.`, actors: [c.id] });
  return true;
}

export function setLaw(st: GameState, c: Country, group: LawGroup, value: string, cause: string) {
  const old = c.laws[group];
  if (old === value) return;
  c.laws[group] = value;
  c.ai.lawHistory.push({ group, value, tick: st.tick, cause: cause.split(/[\s:(]/)[0], from: old });
  log(st, { type: 'law', text: `${c.name}: ${group} changed from ${old} to ${value} (${cause}).`, textVi: `${c.nameVi}: luật ${group} đổi từ ${old} sang ${value} (${cause}).`, actors: [c.id] });
}

export function politicsMonth(st: GameState) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    updatePolitics(st, c);
    // reforms progress monthly with support; strong opposition can stall them
    if (c.reform) {
      const sup = reformSupport(c, c.reform.group, c.reform.value);
      c.reform.progress += clamp(0.06 + sup * 0.25 + journalMomentum(st, c, c.reform.group, c.reform.value) + SUFFRAGE_MOVEMENT.progress * suffrageMovement(st, c, c.reform.group, c.reform.value), -0.05, 0.25);
      if (c.reform.progress >= 1) { setLaw(st, c, c.reform.group, c.reform.value, 'reform'); c.reform = null; c.legitimacy = clamp(c.legitimacy + 2, 0, 100); }
      else if (c.reform.progress < -0.3 || st.tick - c.reform.startedTick > 48) {
        log(st, { type: 'politics', text: `${c.name}'s reform of ${c.reform.group} failed.`, textVi: `Cải cách ${c.reform.group} của ${c.nameVi} thất bại.`, actors: [c.id] });
        c.ai.cooldowns[`reform:${c.reform.group}`] = st.tick + 60; c.reform = null; c.legitimacy = clamp(c.legitimacy - 3, 0, 100);
      }
    }
    revolutionCheck(st, c);
  }
}

/** Revolutions emerge from radicalism and low legitimacy (same rule in both modes). */
function revolutionCheck(st: GameState, c: Country) {
  if (c.decentralized || c.radicalism < 0.16 || c.legitimacy > 50) return;
  const p = (c.radicalism - 0.14) * (55 - c.legitimacy) * 0.003;
  if (!chance(st, p)) return;
  const armyLoyalty = c.igs.armed_forces.approval;
  const crushChance = clamp(0.45 + armyLoyalty * 0.05 + (c.army.quality - 1) * 0.3 - c.radicalism, 0.1, 0.9);
  if (rand(st) < crushChance) {
    log(st, { type: 'revolution', text: `A revolution in ${c.name} is crushed.`, textVi: `Cách mạng ở ${c.nameVi} bị dập tắt.`, actors: [c.id] });
    for (const r of regionsOf(st, c.id)) { r.radical *= 0.6; r.pop *= 0.998; }
    c.legitimacy = clamp(c.legitimacy - 5, 0, 100);
    return;
  }
  // regime change towards the demands of the strongest liberal/radical groups
  const before = { ...c.laws };
  const liberal = c.igs.intelligentsia.clout + c.igs.petty_bourgeoisie.clout + c.igs.industrialists.clout;
  const changes: [LawGroup, string][] = [];
  // REGIME-01b: where organised labour dominates the revolution and socialist ideas are known, it installs a
  // one-party state with a command economy (V3-style); otherwise the liberal path below applies.
  const socialist = lawUnlocked(c, 'one_party_state') && c.igs.trade_unions.clout > Math.max(0.2, liberal * 0.6) && rand(st) < 0.6;
  if (socialist) changes.push(['power', 'one_party_state'], ['economy', 'command_economy'], ['press', 'censorship'], ['governance', 'republic']);
  else if (c.laws.power === 'autocracy' || c.laws.power === 'oligarchy' || c.laws.power === 'theocracy') changes.push(['power', liberal > 0.45 && rand(st) < 0.4 ? 'universal_male_suffrage' : 'census_suffrage']);
  else if (c.laws.power === 'census_suffrage' && rand(st) < 0.5) changes.push(['power', 'universal_male_suffrage']);
  if (!socialist && c.laws.press === 'censorship') changes.push(['press', 'limited_press']);
  if (c.laws.labor === 'serfdom') changes.push(['labor', 'traditional_tenancy']);
  if (!socialist && c.laws.governance === 'monarchy' && rand(st) < 0.35 + liberal * 0.3) changes.push(['governance', 'republic']);
  for (const [g, v] of changes) setLaw(st, c, g, v, 'revolution');
  c.regimeChangedAt = st.tick;
  c.govLabel = govLabelFor(c);
  c.leader = { name: generatedName(st, c, leaderTitle({ ...c, leader: { ...c.leader, title: undefined } })), born: st.date.y - 45 - Math.floor(rand(st) * 15), since: st.date.y, historical: false };
  c.heir = null;
  c.legitimacy = 55; c.reform = null;
  for (const r of regionsOf(st, c.id)) r.radical *= 0.4;
  log(st, { type: 'revolution', text: `Revolution in ${c.name}: the old regime falls.`, textVi: `Cách mạng ở ${c.nameVi}: chế độ cũ sụp đổ.`, actors: [c.id] });
  // contagion: neighbours with radical populations become more restless
  for (const oid of bordersOf(st, c.id)) for (const r of regionsOf(st, oid)) r.radical = clamp(r.radical + 0.04, 0, 0.9);
}

export function sharesBorder(st: GameState, a: string, b: string): boolean { return bordersOf(st, a).has(b); }

/**
 * Name pools for generated (non-historical) leaders, chosen by the religion and language family of the capital region.
 * These are generic given names, not research data: every generated leader is labelled "(…, generated)" in the UI and logs.
 */
const NAME_POOLS: Record<string, string[]> = {
  islamic: ['Ahmad', 'Ali', 'Hasan', 'Ibrahim', 'Ismail', 'Mehmed', 'Mustafa', 'Rashid', 'Yusuf', 'Umar', 'Abbas', 'Karim'],
  germanic: ['Albrecht', 'Friedrich', 'Heinrich', 'Karl', 'Otto', 'Wilhelm', 'Gustav', 'Johan', 'Willem', 'Edmund', 'Henry', 'Erik'],
  romance: ['Carlos', 'Fernando', 'Luis', 'Pedro', 'Jorge', 'Tomás', 'Henri', 'Louis', 'Giuseppe', 'Vittorio', 'João', 'Miguel'],
  slavic: ['Dmitri', 'Nikolai', 'Stefan', 'Viktor', 'Jan', 'Miloš', 'Aleksandar', 'Bogdan', 'Ivan', 'Kazimierz'],
  uralic: ['Pál', 'László', 'Gábor', 'Antti', 'Juhan', 'Mihály'],
  hellenic: ['Alexandros', 'Dimitrios', 'Georgios', 'Konstantinos', 'Nikolaos'],
  caucasus: ['Davit', 'Giorgi', 'Levon', 'Tigran', 'Vakhtang'],
  indic: ['Gopal', 'Pratap', 'Ram', 'Venkata', 'Krishna', 'Madhav', 'Shankar', 'Hari'],
  sikh: ['Gurdit Singh', 'Hari Singh', 'Jaswant Singh', 'Kharak Singh'],
  chinese: ['Wei', 'Ming', 'Zhao', 'Jun', 'Hong', 'Rui'],
  japanese: ['Hiroshi', 'Tadashi', 'Yoshinori', 'Masahiro', 'Nobuhiro'],
  korean: ['Hwan', 'Seong', 'Jin', 'Yeong'],
  vietnamese: ['Phúc', 'Thành', 'Minh', 'Đức', 'Bảo'],
  sea: ['Ang', 'Chakri', 'Thado', 'Sri', 'Mangku'],
  inner_asia: ['Batu', 'Temur', 'Dorji', 'Galdan'],
  african: ['Kwame', 'Kofi', 'Ade', 'Osei', 'Mensah', 'Chuma', 'Tafari', 'Lerato'],
  generic: ['Arno', 'Tomas', 'Kaito', 'Lior', 'Malu', 'Toa', 'Inti', 'Nayra'],
};
const FAMILY_POOL: Record<string, string> = {
  germanic: 'germanic', celtic: 'germanic', romance: 'romance', slavic: 'slavic', baltic: 'slavic', uralic: 'uralic', hellenic: 'hellenic', albanian: 'hellenic',
  armenian: 'caucasus', kartvelian: 'caucasus', caucasian: 'caucasus', turkic: 'islamic', iranian: 'islamic', semitic: 'islamic', berber: 'islamic', afroasiatic: 'islamic', cushitic: 'african',
  indo_aryan: 'indic', dravidian: 'indic', sino_tibetan: 'chinese', japonic: 'japanese', koreanic: 'korean', austroasiatic: 'sea', tai: 'sea', austronesian: 'sea',
  mongolic: 'inner_asia', tungusic: 'inner_asia', niger_congo: 'african', nilo_saharan: 'african', khoe: 'african',
};
function namePool(st: GameState, c: Country): string[] {
  const d = data();
  const cap = st.regions.find((r) => r.id === c.capital) ?? regionsOf(st, c.id)[0];
  if (!cap) return NAME_POOLS.generic;
  if (['sunni', 'shia', 'ibadi'].includes(cap.religion)) return NAME_POOLS.islamic;
  if (cap.religion === 'sikh') return NAME_POOLS.sikh;
  if (cap.culture === 'vietnamese') return NAME_POOLS.vietnamese;
  const fam = d.db.cultures.find((x) => x.id === cap.culture)?.family ?? '';
  return NAME_POOLS[FAMILY_POOL[fam] ?? 'generic'];
}
export function generatedName(st: GameState, c: Country, role: string): string {
  const pool = namePool(st, c);
  const base = pool[Math.floor(rand(st) * pool.length)];
  return `${base} (${role}, generated)`;
}

/** Secession: regions with strong nationalism under foreign rule can break away as a nation-state (both modes). */
export function secessionCheck(st: GameState, createNation: (nation: string, regionIds: string[], from: string) => string | null) {
  if (st.tick % 6 !== 0) return;
  const d = data();
  const byKey = new Map<string, { nation: string; owner: string; regs: string[]; strength: number }>();
  for (const r of st.regions) {
    const c = st.countries[r.owner]; if (!c || c.decentralized) continue;
    const nation = d.cultureNation.get(r.culture)!;
    if (nation === coreNationOf(st, c) || r.nationalism < 0.45 || r.radical < 0.25) continue;
    const k = `${nation}|${r.owner}`; const e = byKey.get(k) ?? { nation, owner: r.owner, regs: [], strength: 0 };
    e.regs.push(r.id); e.strength += r.pop * r.nationalism * r.radical; byKey.set(k, e);
  }
  for (const e of byKey.values()) {
    const owner = st.countries[e.owner];
    if (st.wars.some((w) => w.kind === 'independence' && (w.attackers.members.includes(e.owner) || w.defenders.members.includes(e.owner)))) continue;
    const p = clamp(e.strength / Math.max(1, owner.stats.pop) * 0.4 - owner.legitimacy / 400, 0, 0.08);
    if (chance(st, p)) createNation(e.nation, e.regs, e.owner);
  }
}
