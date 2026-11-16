// Political Engine (shared): interest groups, legitimacy, radicalism, law reforms, revolutions and secession.
import { data } from '../data/db';
import { LAW_GROUPS, type LawGroup } from '../data/dbTypes';
import { IGS, STRATA, S, type Country, type GameState, type IG } from '../types';
import { clamp, chance, log, rand } from '../core';
import { coreNationOf } from './population';
import { regionsOf, bordersOf } from '../cache';

/** Law preferences of interest groups (+ supports, - opposes). Same table in both modes. */
export const IG_PREFS: Record<IG, Partial<Record<string, number>>> = {
  landowners: { autocracy: 1, oligarchy: 2, census_suffrage: 0, universal_male_suffrage: -2, traditionalism: 2, mercantilism: 1, laissez_faire: -1, protectionism: 1, free_trade: -1, serfdom: 2, slavery: 1, traditional_tenancy: 1, free_labor: -2, state_religion: 1, censorship: 1, feudal_levies: 1, monarchy: 1, republic: -1 },
  industrialists: { census_suffrage: 2, autocracy: -1, laissez_faire: 2, interventionism: 1, traditionalism: -2, free_trade: 1, protectionism: 1, isolationism: -2, free_labor: 2, serfdom: -2, slavery: -1, public_schools: 1, limited_press: 1, professional_army: 1 },
  intelligentsia: { universal_male_suffrage: 2, census_suffrage: 1, autocracy: -2, theocracy: -2, free_press: 2, censorship: -2, secularism: 2, freedom_of_conscience: 1, state_religion: -1, public_schools: 2, free_labor: 1, slavery: -2, serfdom: -2, republic: 1 },
  petty_bourgeoisie: { census_suffrage: 1, protectionism: 2, mercantilism: 1, free_trade: -1, state_religion: 1, limited_press: 1, monarchy: 1, free_labor: 1, mass_conscription: 1 },
  clergy: { state_religion: 2, secularism: -2, freedom_of_conscience: -1, religious_schools: 2, public_schools: -1, censorship: 1, theocracy: 2, monarchy: 1, autocracy: 1 },
  armed_forces: { autocracy: 1, professional_army: 2, mass_conscription: 1, feudal_levies: -1, monarchy: 1, protectionism: 1 },
  rural_folk: { traditional_tenancy: 1, serfdom: -2, free_labor: 1, protectionism: 1, state_religion: 1, universal_male_suffrage: 1, mass_conscription: -1 },
  trade_unions: { universal_male_suffrage: 2, free_labor: 1, interventionism: 2, laissez_faire: -1, free_press: 1, public_schools: 1, secularism: 1 },
};

const POWER_WEIGHTS: Record<string, Record<IG, number>> = {
  autocracy: { landowners: 1.5, industrialists: 0.6, intelligentsia: 0.4, petty_bourgeoisie: 0.5, clergy: 1.2, armed_forces: 2.0, rural_folk: 0.15, trade_unions: 0.05 },
  oligarchy: { landowners: 2.0, industrialists: 1.0, intelligentsia: 0.5, petty_bourgeoisie: 0.6, clergy: 1.0, armed_forces: 1.2, rural_folk: 0.15, trade_unions: 0.05 },
  census_suffrage: { landowners: 1.3, industrialists: 1.6, intelligentsia: 1.0, petty_bourgeoisie: 1.0, clergy: 0.8, armed_forces: 0.8, rural_folk: 0.3, trade_unions: 0.2 },
  universal_male_suffrage: { landowners: 0.8, industrialists: 1.0, intelligentsia: 1.0, petty_bourgeoisie: 1.0, clergy: 0.7, armed_forces: 0.6, rural_folk: 1.0, trade_unions: 1.0 },
  theocracy: { landowners: 1.0, industrialists: 0.3, intelligentsia: 0.3, petty_bourgeoisie: 0.5, clergy: 3.0, armed_forces: 1.0, rural_folk: 0.3, trade_unions: 0.05 },
  tribal_council: { landowners: 1.5, industrialists: 0.1, intelligentsia: 0.2, petty_bourgeoisie: 0.3, clergy: 1.0, armed_forces: 1.5, rural_folk: 1.0, trade_unions: 0 },
};

export function igApproval(c: Country, ig: IG, laws = c.laws): number {
  let a = 0; const pref = IG_PREFS[ig];
  for (const g of LAW_GROUPS) a += pref[laws[g]] ?? 0;
  return a;
}

export function updatePolitics(st: GameState, c: Country, init = false) {
  const regs = regionsOf(st, c.id);
  const pop = regs.reduce((s, r) => s + r.pop, 0);
  if (pop <= 0) return;
  // Political strength starts with cohort size, then scales with income/wealth. This
  // allows an aristocracy or capitalist class to exert more clout than an equally large
  // but poor class. The square-root curve keeps population size primary and softens
  // extreme income gaps. Legacy saves without a cohort ledger retain neutral weight.
  const meanIncome = regs.reduce((sum, r) => {
    const regionalIncome = STRATA.reduce((total, _, i) => {
      const income = r.popEconomy?.incomePerCapita[i];
      return total + r.pop * Math.max(0, Number(r.strata[i] ?? 0)) * (Number.isFinite(income) ? Math.max(0, income ?? 0) : 0);
    }, 0);
    return sum + regionalIncome;
  }, 0) / Math.max(1, pop);
  const st_ = (i: number) => regs.reduce((sum, r) => {
    const income = r.popEconomy?.incomePerCapita[i];
    const relative = meanIncome > 0 && Number.isFinite(income) && (income ?? 0) >= 0
      ? Math.sqrt(Math.max(0, income ?? 0) / meanIncome)
      : 1;
    // Wealth is a secondary clout modifier, not a substitute for cohort size or law.
    // A soft ±15% band preserves seed-driven AI variation and prevents one income
    // estimate from overwhelming institutional representation.
    const wealthPower = clamp(1 + (relative - 1) * 0.15, 0.85, 1.15);
    return sum + r.pop * r.strata[i] * (0.3 + r.literacy) * wealthPower;
  }, 0) / pop;
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
  c.legitimacy = init ? target : c.legitimacy + (target - c.legitimacy) * 0.05;
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
  if (c.reform || c.laws[group] === value) return false;
  c.reform = { group, value, progress: 0, startedTick: st.tick };
  log(st, { type: 'politics', text: `${c.name} begins debating ${group}: ${value}.`, textVi: `${c.nameVi} bắt đầu tranh luận luật ${group}: ${value}.`, actors: [c.id] });
  return true;
}

export function setLaw(st: GameState, c: Country, group: LawGroup, value: string, cause: string) {
  const old = c.laws[group];
  if (old === value) return;
  c.laws[group] = value;
  c.ai.lawHistory.push({ group, value, tick: st.tick });
  log(st, { type: 'law', text: `${c.name}: ${group} changed from ${old} to ${value} (${cause}).`, textVi: `${c.nameVi}: luật ${group} đổi từ ${old} sang ${value} (${cause}).`, actors: [c.id] });
}

export function politicsMonth(st: GameState) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive) continue;
    updatePolitics(st, c);
    // reforms progress monthly with support; strong opposition can stall them
    if (c.reform) {
      const sup = reformSupport(c, c.reform.group, c.reform.value);
      c.reform.progress += clamp(0.06 + sup * 0.25, -0.05, 0.25);
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
  if (c.laws.power === 'autocracy' || c.laws.power === 'oligarchy' || c.laws.power === 'theocracy') changes.push(['power', liberal > 0.45 && rand(st) < 0.4 ? 'universal_male_suffrage' : 'census_suffrage']);
  else if (c.laws.power === 'census_suffrage' && rand(st) < 0.5) changes.push(['power', 'universal_male_suffrage']);
  if (c.laws.press === 'censorship') changes.push(['press', 'limited_press']);
  if (c.laws.labor === 'serfdom') changes.push(['labor', 'traditional_tenancy']);
  if (c.laws.governance === 'monarchy' && rand(st) < 0.35 + liberal * 0.3) changes.push(['governance', 'republic']);
  for (const [g, v] of changes) setLaw(st, c, g, v, 'revolution');
  c.regimeChangedAt = st.tick;
  c.leader = { name: generatedName(st, c, before.governance !== c.laws.governance ? 'president' : 'ruler'), born: st.date.y - 45 - Math.floor(rand(st) * 15), since: st.date.y, historical: false };
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
