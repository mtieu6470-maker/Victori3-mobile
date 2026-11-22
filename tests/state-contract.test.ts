// CG18-03: table-driven malformed nested fixtures. Every mutation must be rejected by the canonical
// validateGameStateContract (the guard used by save, load and worker snapshots) before any consumer.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { validateGameStateContract, serialize, deserialize } from '../src/engine/save';
import { isValidReply } from '../src/ui/game/simHost';

loadNodeData();
const base = createGame({ mode: 'historical', seed: 9, player: null });
for (let i = 0; i < 3; i++) stepMonth(base); // populated markets, log, history
const gbr = 'GBR';
const war = () => ({ id: 'W1', name: 'Test War', kind: 'conquest', attackers: { leader: 'FRA', members: ['FRA'] }, defenders: { leader: 'GBR', members: ['GBR'] }, goals: [], start: 1, score: 0, occupied: [], battles: 0, exhaustion: { a: 0, d: 0 } });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type M = [string, (s: any) => void];
const cases: Record<string, M[]> = {
  region: [
    ['negative building level', (s) => { s.regions[0].buildings.textile_mill = -1; }],
    ['NaN building level', (s) => { s.regions[0].buildings.mine = Number.NaN; }],
    ['literacy above 1', (s) => { s.regions[0].literacy = 1.5; }],
    ['res not strings', (s) => { s.regions[0].res = [1]; }],
    ['coastal not boolean', (s) => { s.regions[0].coastal = 'yes'; }],
    ['wages wrong length', (s) => { s.regions[0].wages = [1, 2]; }],
    ['negative employment', (s) => { s.regions[0].employment[0] = -3; }],
    ['blight malformed', (s) => { s.regions[0].blight = { until: 'x', severity: 0.5 }; }],
  ],
  country: [
    ['budget is a string', (s) => { s.countries[gbr].budget = 'broken'; }],
    ['army is null', (s) => { s.countries[gbr].army = null; }],
    ['negative manpower', (s) => { s.countries[gbr].army.manpower = -1; }],
    ['navy NaN', (s) => { s.countries[gbr].navy.strength = Number.NaN; }],
    ['leader missing name', (s) => { delete s.countries[gbr].leader.name; }],
    ['research progress Infinity', (s) => { s.countries[gbr].research.progress = Number.POSITIVE_INFINITY; }],
    ['IG approval string', (s) => { const ig = Object.keys(s.countries[gbr].igs)[0]; s.countries[gbr].igs[ig].approval = 'high'; }],
    ['AI cooldown string', (s) => { s.countries[gbr].ai.cooldowns.war = 'soon'; }],
    ['lawHistory entry broken', (s) => { s.countries[gbr].ai.lawHistory.push({ group: 'power', value: 'x', tick: -1 }); }],
    ['techs not strings', (s) => { s.countries[gbr].techs = [null]; }],
    ['zero productivity', (s) => { s.countries[gbr].productivity = 0; }],
    ['famine above 1', (s) => { s.countries[gbr].famine = 2; }],
    ['negative debt', (s) => { s.countries[gbr].debt = -5; }],
    // CG18-04
    ['leader born is a string', (s) => { s.countries[gbr].leader.born = '1765'; }],
    ['leader historical missing', (s) => { delete s.countries[gbr].leader.historical; }],
    ['heir without female flag', (s) => { s.countries[gbr].heir = { name: 'X', born: 1819 }; }],
    ['heir born NaN', (s) => { s.countries[gbr].heir = { name: 'X', born: Number.NaN, female: true }; }],
    ['legitimacy above 100', (s) => { s.countries[gbr].legitimacy = 400; }],
    ['radicalism above 1', (s) => { s.countries[gbr].radicalism = 2; }],
  ],
  market: [
    ['market price string', (s) => { s.marketPrices[gbr].cotton = 'broken'; }],
    ['market stats entry null', (s) => { s.marketStats[gbr].grain = null; }],
    ['shortage above 1', (s) => { s.marketStats[gbr].grain.short = 1.2; }],
    ['negative unsold', (s) => { s.marketStats[gbr].grain.unsold = -10; }],
    ['relation not a number', (s) => { s.relations['FRA|GBR'] = 'NaN'; }],
    ['negative world price', (s) => { s.worldPrices.grain = -1; }],
    ['rivalry not a string', (s) => { s.rivalries.push(7); }],
  ],
  warsTreaties: [
    ['null war', (s) => { s.wars.push(null); }],
    ['war with unknown kind', (s) => { s.wars.push({ ...war(), kind: 'crusade' }); }],
    ['war score out of range', (s) => { s.wars.push({ ...war(), score: 400 }); }],
    ['war side without members', (s) => { const w = war(); delete (w.attackers as { members?: unknown }).members; s.wars.push(w); }],
    ['empty treaty', (s) => { s.treaties.push({}); }],
    ['treaty unknown type', (s) => { s.treaties.push({ id: 'T', type: 'marriage', members: [], start: 0 }); }],
    ['project negative cost', (s) => { s.constructionProjects.push({ id: 'p', countryId: gbr, regionId: 'GBR_LON', building: 'mine', funding: 'state', totalCost: -1, invested: 0, createdTick: 0 }); }],
    ['project bad funding', (s) => { s.constructionProjects.push({ id: 'p', countryId: gbr, regionId: 'GBR_LON', building: 'mine', funding: 'gift', totalCost: 1, invested: 0, createdTick: 0 }); }],
    ['territory change malformed', (s) => { s.territoryLog.push({ tick: 0, date: '1836-01', region: 'X', from: 'A', to: 3, cause: 'x', historicalMatch: null }); }],
  ],
  historyCounters: [
    ['history row NaN', (s) => { s.history[gbr] = [{ y: 1836, pop: Number.NaN }]; }],
    // CG18-04
    ['history row empty', (s) => { s.history[gbr] = [{}]; }],
    ['history row missing gdp', (s) => { const row = { ...s.history[gbr][0] }; delete row.gdp; s.history[gbr] = [row]; }],
    ['history year fractional', (s) => { s.history[gbr] = [{ ...s.history[gbr][0], y: 1836.5 }]; }],
    ['divergence entry without kind', (s) => { s.divergence.entries.push({ tick: 0, date: '1836-01', text: 'x', actors: [] }); }],
    ['divergence entry without actors', (s) => { s.divergence.entries.push({ tick: 0, date: '1836-01', kind: 'k', text: 'x' }); }],
    ['milestone credit string', (s) => { s.divergence.milestones.x = { status: 'achieved', credit: 'lots' }; }],
    ['fractional counter', (s) => { s.counters.decisionWindowsFired = 1.5; }],
    ['fractional system run count', (s) => { s.counters.systemRuns.economy = 0.5; }],
    ['milestone unknown status', (s) => { s.divergence.milestones.x = { status: 'maybe' }; }],
    ['similarity string', (s) => { s.divergence.similarity.push({ date: 'x', territorial: 'a', milestones: 0, combined: 0 }); }],
    ['negative counter', (s) => { s.counters.aiActions.research = -1; }],
    ['firedEvents not strings', (s) => { s.firedEvents.push({}); }],
    ['decision option malformed', (s) => { s.pendingPlayerDecisions.push({ id: 'd', windowId: 'w', options: [{ id: 'o', historical: 'yes' }] }); }],
    ['log entry without actors', (s) => { s.log.push({ tick: 0, date: '1836-01', type: 'x', text: 'y' }); }],
  ],
};

describe('CG18-03 nested GameState contract', () => {
  it('accepts a real state, and a save/load round trip of it', () => {
    expect(() => validateGameStateContract(structuredClone(base))).not.toThrow();
    expect(() => validateGameStateContract(deserialize(serialize(base)))).not.toThrow();
  });

  for (const [domain, list] of Object.entries(cases)) {
    it.each(list)(`${domain}: rejects %s`, (_name, mutate) => {
      const bad = structuredClone(base);
      mutate(bad);
      expect(() => validateGameStateContract(bad)).toThrow(/Invalid game state/);
      // The worker boundary uses the same guard.
      expect(isValidReply({ kind: 'snapshot', gen: 1 }, { ok: true, gen: 1, kind: 'state', snapshot: bad })).toBe(false);
    });
  }

  it('a malformed save is rejected on load before any system can consume it', () => {
    const text = serialize(base);
    const env = JSON.parse(text);
    env.state.countries.GBR.army = null;
    expect(() => deserialize(JSON.stringify(env))).toThrow(/Invalid game state: countries.GBR.army/);
  });
});
