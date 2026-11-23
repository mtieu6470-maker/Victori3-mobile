// LAW-CAL-01: compares the AI's suffrage reforms with history (ChatGPT CG-42,
// historical_data/research_staging/CG42_SUFFRAGE_WELFARE_ADOPTION.json). For each CG-42 country the governing
// state is the one holding most of the population of its present territory (admin-1 map grid); the year that
// state first has universal male suffrage (or wider) and universal suffrage is compared with the recorded year.
//   npx tsx tools/law-adoption-report.ts [endYear=1960] [seed=1] [historical|sandbox]
import { readFileSync } from 'node:fs';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { regionCountryShares } from './divergence-report';

const MALE = new Set(['universal_male_suffrage', 'universal_suffrage']);
export function runLawAdoption(endYear = 1960, seed = 1, mode: 'historical' | 'sandbox' = 'historical') {
  loadNodeData();
  const rows = JSON.parse(readFileSync(new URL('../historical_data/research_staging/CG42_SUFFRAGE_WELFARE_ADOPTION.json', import.meta.url), 'utf8')).rows as { iso3: string; male_suffrage_year: number | null; female_suffrage_year: number | null }[];
  const st = createGame({ mode, seed, player: null });
  const shares = regionCountryShares(st);
  const iso2 = (iso3: string) => iso3; // admin-1 meta uses ISO3 adm0 codes
  const firstMale = new Map<string, number>(); const firstFull = new Map<string, number>();
  const governing = (iso: string) => {
    const pop = new Map<string, number>();
    for (const r of st.regions) { const s = shares.get(r.id)?.get(iso2(iso)); if (s) pop.set(r.owner, (pop.get(r.owner) ?? 0) + r.pop * s); }
    return [...pop].sort((a, b) => b[1] - a[1])[0]?.[0];
  };
  while (st.date.y <= endYear) {
    stepMonth(st);
    if (st.date.m !== 1) continue;
    for (const r of rows) {
      const c = st.countries[governing(r.iso3) ?? '']; if (!c || c.decentralized) continue;
      if (!firstMale.has(r.iso3) && MALE.has(c.laws.power)) firstMale.set(r.iso3, st.date.y);
      if (!firstFull.has(r.iso3) && c.laws.power === 'universal_suffrage') firstFull.set(r.iso3, st.date.y);
    }
  }
  const cmp = (hist: (r: typeof rows[number]) => number | null, sim: Map<string, number>) => {
    const inScope = rows.filter((r) => hist(r) !== null && hist(r)! <= endYear);
    const both = inScope.filter((r) => sim.has(r.iso3));
    const err = both.map((r) => sim.get(r.iso3)! - hist(r)!).sort((a, b) => a - b);
    return { historical: inScope.length, simulated: both.length, simulatedAll: sim.size, medianError: err.length ? err[Math.floor(err.length / 2)] : null, meanAbsError: err.length ? Math.round(err.reduce((s, e) => s + Math.abs(e), 0) / err.length) : null,
      rows: inScope.map((r) => `${r.iso3} ${hist(r)}→${sim.get(r.iso3) ?? '—'}`) };
  };
  return { endYear, seed, mode, male: cmp((r) => r.male_suffrage_year, firstMale), universal: cmp((r) => r.female_suffrage_year, firstFull) };
}

if (process.argv[1]?.endsWith('law-adoption-report.ts')) {
  const a = process.argv.slice(2); const n = a.filter((x) => /^\d+$/.test(x)).map(Number);
  const out = runLawAdoption(n[0] ?? 1960, n[1] ?? 1, a.includes('sandbox') ? 'sandbox' : 'historical');
  for (const k of ['male', 'universal'] as const) {
    const m = out[k];
    console.log(`${k}: adopted by ${out.endYear} — history ${m.historical}, engine ${m.simulated} of them (${m.simulatedAll} total); median error ${m.medianError} y, mean |error| ${m.meanAbsError} y`);
    console.log('  ' + m.rows.join(', '));
  }
}
