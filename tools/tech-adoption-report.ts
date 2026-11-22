// TECH-02 check: adoption year of selected technologies by country in the engine (historical mode)
// against first-use years. Benchmark years are approximate first public railway / telegraph lines
// (to be replaced by a sourced CHAT-style dataset, board CG-36).
//
//   npx tsx tools/tech-adoption-report.ts [endYear=1900] [seed=1] [--no-import]
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { TECH_IMPORT } from '../src/engine/systems/technology';

export const FIRST_RAILWAY: Record<string, number> = {
  GBR: 1825, USA: 1830, FRA: 1832, BEL: 1835, PRU: 1838, RUS: 1837, AUS: 1837, NED: 1839, SPA: 1848,
  BRA: 1854, EGY: 1854, TUR: 1856, EIC: 1853, JAP: 1872, QNG: 1876, MEX: 1850, SWE: 1856, DEN: 1847, POR: 1856, PER: 1851, ARG: 1857, CHL: 1851,
};

export function runAdoption(endYear = 1900, seed = 1) {
  loadNodeData();
  const st = createGame({ mode: 'historical', seed, player: null });
  const got: Record<string, Record<string, number>> = {};
  const techs = ['railways', 'telegraph'];
  while (st.date.y < endYear) {
    stepMonth(st);
    for (const id of Object.keys(FIRST_RAILWAY)) {
      const c = st.countries[id]; if (!c) continue;
      for (const t of techs) if (c.techs.includes(t)) ((got[id] ??= {})[t] ??= st.date.y);
    }
  }
  const rows = Object.entries(FIRST_RAILWAY).filter(([id]) => st.countries[id]).map(([id, hist]) => {
    const eng = got[id]?.railways ?? null;
    return { id, hist, engine: eng, error: eng === null ? null : eng - hist, telegraph: got[id]?.telegraph ?? null };
  });
  const errs = rows.map((r) => (r.error === null ? Math.max(0, endYear - r.hist) : Math.abs(r.error)));
  return { rows, meanAbsYears: +(errs.reduce((s, x) => s + x, 0) / errs.length).toFixed(1), missing: rows.filter((r) => r.engine === null).map((r) => r.id) };
}

if (process.argv[1]?.endsWith('tech-adoption-report.ts')) {
  const args = process.argv.slice(2); const nums = args.filter((a) => /^\d+$/.test(a)).map(Number);
  if (args.includes('--no-import')) TECH_IMPORT.enabled = false;
  const rateArg = args.find((a) => a.startsWith('--rate=')); if (rateArg) TECH_IMPORT.rate = Number(rateArg.slice(7));
  const out = runAdoption(nums[0] ?? 1900, nums[1] ?? 1);
  for (const r of out.rows) console.log(`${r.id.padEnd(4)} hist ${r.hist}  engine ${r.engine ?? '—'}  err ${r.error ?? 'never'}  telegraph ${r.telegraph ?? '—'}`);
  console.log(JSON.stringify({ meanAbsYears: out.meanAbsYears, missing: out.missing }));
}
