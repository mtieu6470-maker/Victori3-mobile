## 2026-11-22 — CO-1 companies (technology-unlocked kinds, site ownership, prosperity)

- **CO-1b:**
  - `tools/data/build_company_kinds.py` turns the CG-32 map into `historical_data/companies/company_kinds.json`: 97 kinds, each unlocked by a real technology.
  - 24 kinds are operational on existing buildings (textile, iron/steel, machinery, railways); 73 are dormant until ECON-GOODS-01.
  - Each kind's rights are classified CHARTER / LICENSE / CONTRACT and are all inactive (no legal basis yet, CG-30).
  - build-data validates kinds.
- **CO-1 (`src/engine/systems/companies.ts`):**
  - A company forms only with an unlocking technology, joint-stock law (not traditionalism, plus the joint-stock banking technology) and ≥ 8 unowned building levels.
  - It owns concrete sites; prosperity follows the real IND-02a margin; it dissolves after 36 loss months or when its sites vanish.
  - No money flows and no bonuses yet (CO-2 adds them).
  - Save/contract support: `GameState.companies`, older saves load with none, a site cannot have two owners.
  - Historical seed 1: 12 companies by 1840 (GBR 4, FRA 3, USA 2, PRU, NED, BEL); 19 by 1880 (Japan's first after the Meiji Restoration).
- `tests/companies.test.ts` (8). Local: tsc 0; `npm test` **33/33 files, 361/361 tests**.

---

## 2026-11-22 — CATCHUP-01 A/B ablation; review round 3 closed; integrated (Director decision)

- Same-seed A/B with and without CATCHUP (`--no-catchup`), seeds 1 and 2, to 2022: mean |log err| is 1.328/1.341 and 1.342/1.348.
  - Japan gains ×1.19–1.25 (open and literate); Russia, Turkey and Brazil get no discount.
  - Not a buff, and not the calibration lever. Summary: `docs/audit/econ/CATCHUP_ABLATION_SUMMARY_2026-11-22.md`.
- Review round 3:
  - fail-closed law ranks, with every data value ranked;
  - `reformAI` integration tests (blocked and feasible);
  - `knownShare` monthly-snapshot contract test.
  - `tests/catchup.test.ts`: 15 tests.
- Owner reaffirmed roles: Claude leads and decides; ChatGPT may object. Director decision: integrate into the designated branch.
- Local: tsc 0; `npm test` **32/32 files, 353/353 tests**.

---

## 2026-11-22 — CATCHUP-01 review round 2 fixed; CO-01 spec hardened; true 1836-2022 sandbox run

- **CATCHUP-01 round 2:**
  - GDP-weighted `knownShare`.
  - Explicit `LAW_MODERNISATION_RANK` / `isProgressiveStep` (no array order).
  - `reformUtility()` exported, with a domestic-feasibility test: Qing 1836 elites oppose and the world has public schools, yet utility stays below the reform threshold.
  - `tests/catchup.test.ts` now has 11 tests.
- `tools/longrun-report.ts` always samples the final year. Sandbox 1836–2022: 8.42 bn population in 2022, 87 ms/month.
- Historical scorecard 2022: mean |log err| 1.328 (industrialisers 0.712). Not macro-calibrated; post-1950 needs the structural work.
- `docs/spec/CO01_COMPANIES_AND_MONOPOLIES_VI.md` §6 (ChatGPT review):
  - separate entity types; separate legal form / charter / market power / state fiscal monopoly;
  - closed GDP-vs-GNI ledger; charters scoped by legal instrument;
  - welfare costs for forced cultivation; verified-scale-only historical companies.
- CG-30 (monopolies) and CG-31 (60 candidate companies) Phase 1 received.
- Local: tsc 0; `npm test` **32/32 files, 349/349 tests**.

---

## 2026-11-22 — CATCHUP-01 revised per ChatGPT review; CG-29 data in repo; 2022 scorecards; ECON-MONO-01 spec

- **CG-29 data:** `tools/data/extract_benchmarks.py` and `docs/research/data/` hold MPD2023 (publisher SHA-1 verified), OWID long-run population and UN WPP2024 extracts, with a manifest (URLs, licences, SHA-256). The 41 CG-26 values match exactly. `tests/benchmark-data.test.ts`.
- **CATCHUP-01 revised** (CG_REVIEW_CATCHUP01; owner: no latecomer buff):
  - Imitation discount = 0.4 × √knownShare × absorptiveCapacity (openness × literacy) × codified(age).
  - Zero when no country knows the technology; capped at 40%; touches no GDP/TFP/research points.
  - Law emulation applies only to the explicit `EMULATION_STEPS`, is ≤ 0.3 utility and is scaled by trade exposure.
  - `tests/catchup.test.ts` (8).
- **Scorecard to 2022** (`docs/audit/econ/ECON_GROWTH_SCORECARD_2022_CATCHUP01R_2026-11-22.json`):
  - Mean |log err| at 2022 is 1.37 (no catch-up: 1.65). Industrialisers fit to ~1950, then miss post-war growth.
  - RUS/TUR are flagged as territory mismatches and excluded from the summary (MSG-047).
- **Sandbox long run to 2022** (`docs/audit/econ/LONGRUN_SANDBOX_1836_2022_CATCHUP01R_2026-11-22.txt`): stable, population 6.4 bn in 2010, 75–100 ms/month.
- **Next structural work** (honest finding: a bounded imitation discount cannot produce historical catch-up):
  - IND-01 / ECON-GOODS-01 — modern goods and production methods (`docs/spec/IND01_PRODUCTION_METHODS_AND_MODERN_GOODS_VI.md`);
  - ECON-MONO-01 — chartered trade monopolies, per the owner (`docs/spec/ECON_MONO01_CHARTERED_TRADE_MONOPOLIES_VI.md`), with CG-30 requested;
  - schooling diffusion and decolonisation.
- Local: tsc 0; `npm test` **32/32 files, 346/346 tests**. Kept on the working branch only until ChatGPT re-reviews CATCHUP-01.

---

## 2026-11-22 — TECH-01 tree 1836-2026, DEMO-01, rail density, Meiji path; scorecard 0.224

- **TECH-01** (CG-28): the tree grows from 38 to 130 technologies covering 1836–2026.
  - Each new tech has its commercial-diffusion year, a CG-28 source and a `tfp` design weight; all have Vietnamese UI names.
  - The ahead-of-time research cost is now quadratic (frontier countries hold ~128/130 by 2010, instead of exhausting the tree by ~1985).
  - Growth now follows the knowledge stock Σtfp × literacy², with an adoption half-life of ~3 years.
  - Telephone dated 1880 → 1885 (it predated its prerequisite).
  - `tests/tech-catalogue.test.ts`: ids, prerequisite years, acyclic tree, sources, names.
- **DEMO-01:**
  - Medical-tech mortality scale 0.1 → 0.04; death floor 0.008; fertility transition (literacy × fallen mortality).
  - World population: 1985 4.83 bn (UN 4.85), 2010 7.3 bn (6.95); before the fix, 16.4 bn.
  - Evidence: `docs/audit/econ/LONGRUN_1836_2026_DEMO01_2026-11-22.txt`.
- **ECON-RAIL-01:** railway effect by network density per area; Qing no longer builds 155 levels in the 1860s.
- **HIST-JAP-01:**
  - New `legitimacy_crisis` effect: a sustained shift that a regime change clears; the Kanagawa option applies it (CG-28 Bakumatsu).
  - In Historical Mode, laws governed by a pending decision window are reserved for it.
  - Japan now opens, then the Meiji Restoration fires in 1863.
- **ECON-CAL-04 (part):** cash-crop demand is income-inelastic (Engel, 0.5) and base-year balanced.
- **Scorecard** (`docs/audit/econ/ECON_GROWTH_SCORECARD_TECH01_2026-11-22.json`): mean |log err| at 1913 is 0.224. Japan +0.13 (was −0.48).
  - Remaining: India +0.34; FRA/PRU/USA run fast before 1870 and slow after, which needs production methods and modern goods (**IND-01 / ECON-GOODS-01**, owner directive: Victoria 3 + modern-era mods as structural reference); Russia/Brazil/Turkey too slow.
  - Global parameter retuning was tried and made no difference, so it was reverted.
- Ledger test now uses a relative tolerance (an absolute 5e-7 on 1.76e9 is float noise).
- Owner directives recorded in `docs/coordination/OWNER_DIRECTIVE_MODERN_ERA_REFERENCE_2026-11-22.md`.
- Local: tsc 0; `npm test` **30/30 files, 335/335 tests**; build 0.

---

## 2026-11-22 — CG18-04 closed; MSG-041 growth scorecard normalised on real GDP; TECH-01 identified

- **CG18-04 (ChatGPT round 6):** the contract now covers:
  - leader born/historical, heir born/female;
  - legitimacy 0..100 (not 0..1; the comment in types.ts was ambiguous and has been split) and radicalism 0..1;
  - all required YearStat keys; divergence entry date/kind/actors; integer counters.
  - 14 new mutations; real 40-year states in both modes still pass with 0 failures.
- **MSG-041 accepted:** the India "1.71" figure used an 1837 denominator.
  - `tools/growth-report.ts` is now a scorecard: identical base and end years for engine and MPD2023 (1836 where MPD has it; 1850 for China/India/Japan/Brazil; 1870 for Russia/Turkey). No interpolation. Annualised rates and log errors are reported, with the territory definitions stated.
  - New finding: the engine measured **nominal** GDP. Added `Region.outputReal` (value added at constant 1836 prices); the scorecard uses real GDP.
  - Real scorecard (`docs/audit/econ/ECON_GROWTH_SCORECARD_REAL_2026-11-22.json`), 1913 log errors: UK −0.20, France −0.26, Prussia −0.28, USA −0.39, India +0.38, China +0.25, Japan −0.48. Mean 0.295.
- **Root causes, coefficients deliberately not tuned yet:**
  - The tech tree has 38 techs (21 economic, the latest dated 1913), and Britain has adopted all of them by 1913 → **TECH-01**.
  - The Meiji window never fires because shogunate legitimacy recovers to ~55 → **HIST-JAP-01**.
  - Indian growth comes from a near tripling of plantations, not TFP.
  - CG-28 requested (MSG-042).
- Local: tsc 0; `npm test` **29/29 files, 328 tests** (see commit); build 0.

---

## 2026-11-22 — ECON-GROWTH slice 1 (MPD2023 targets) + CG18-03 nested state contract

- **CG18-03 (commit `d05da24`):** `src/engine/stateContract.ts` holds domain validators for regions, countries, markets, wars/treaties/projects/territory log, and history/divergence/counters/decisions/log.
  - Used by saves, loads and worker snapshots. 44 table-driven mutation tests. Real 40-year states (both modes) pass: 0 failures.
- **ECON-GROWTH slice 1** (evidence CG-26 MPD2023; report `docs/audit/econ/ECON_GROWTH_REPORT_2026-11-22.json`; tool `tools/growth-report.ts` measures GDP per capita on 1836 home territory).
  - Root causes found:
    1. Construction ran one project per funding stream at a time (≈ 2 levels a year per country), so factory employment fell behind population all century.
    2. Productivity was frozen at its 1836 calibration.
    3. The household wealth index was capped at 3, which Britain had already reached in 1836.
  - Fixes:
    - Parallel construction bounded by actual money (`constructionQueueCap`).
    - Investors score options once a month and start up to 3 projects.
    - Endogenous productivity (`src/engine/systems/growth.ts`): economic techs × literacy² + literacy.
    - Wealth cap raised to 12.
    - AI construction news is no longer logged: the capped log was evicting wars.
  - GDP per capita, 1913 vs 1836 (MPD2023 in brackets): UK 1.95 (2.09), France 1.94 (2.66), Prussia 2.18 (Germany 2.68), USA 2.05 (2.91). Mean absolute log error for industrialisers 0.61 → 0.24.
  - Known gaps: 1870–1913 growth too slow (the tree lacks late-century techs); India too fast; Meiji Japan too slow.
  - Performance: monthly boundary p50 ≈ 99 ms vs ≈ 75 ms before (AI 227 → 54 ms after memoising the queued-project ledger and single-pass scoring). Runs in the worker.
- Local: tsc 0; `npm test` **29/29 files, 312/312 tests**; build 0.

---

## 2026-11-22 — ECON-CAL-03 done, IND-02a ON by default; CG18-02 closed; sandbox wars vary by seed

- **ECON-CAL-03** (evidence CG-25; report `docs/audit/econ/ECON_CAL_03_REPORT_2026-11-22.json`):
  - Ironworks recipe from Kane / French Commission (Staffordshire 1828–37): iron ore 0.21 + coal 0.37 per unit (was 0.5 + 0.4, i.e. 90% inputs).
  - Textile mill coal 0.08 → 0.01 (Baines 1833: coal 1.08% of value). At month-12 British prices raw cotton is 30% of mill output value (Baines 26.3%).
  - Household coal demand now depends on access (`householdCoalAccess`: coalfield, railway, coast of a coal-mining country). Before, Qing households alone out-demanded every mine on earth. Project assumption.
  - Cottage mix 0.55/0.25/0.20 → 0.70/0.10/0.20 (textiles/tools/luxury). Project assumption.
  - Coal shortage (demand-weighted) 19%; British coal price ≈ 0.9–1.0.
- **IND-02a profit-responsive site operations is now ON by default.**
  - 12-year historical run: all 112 textile mills operate throughout; ironworks average 0.5–0.97 utilisation; factory tool works shrink (cottage hardware covers tool demand, matching CG-25's small-workshop tool trades).
  - GDP and famine match the flag-off run within 1%. `ECONOMY_FLAGS.siteOperations = false` restores the old behaviour.
  - Desktop bench, monthly boundary p50: 74.9 ms off vs 75.8 ms on (noisy single samples; runs in the worker).
- **CG18-02 (ChatGPT round 4) fixed:** worker snapshots must satisfy `validateGameStateContract`.
  - This is one canonical GameState contract, also used for every save written and loaded: all top-level fields, date, regions, countries, log, population, clock, RNG and industry.
  - Generations must be safe integers, and advance replies must have a matching hour and month tick. 2 new tests (11 malformed-snapshot cases). Validation costs ≈ 3 ms vs ≈ 11 ms for the clone.
- **Sandbox seeds now diverge:** war decisions had no randomness, so every sandbox seed fought the same wars (the old test passed on 4 incidental regions).
  - Added seeded misjudgement noise (`SANDBOX_WAR_JUDGEMENT_NOISE`), sandbox mode only. Historical mode is unchanged.
- **Found, not fixed:**
  - World GDP is flat over 12 years (832 → 841 B) whether the flag is on or off → **ECON-GROWTH**.
  - Iron ore and timber gluts; arms shortage → **ECON-CAL-04**. CG-26 requested (MSG-032).
- Local: tsc 0; `npm test` **27/27 files, 258/258 tests**; build 0.

---

## 2026-11-22 — ECON-CAL-02 done: 1836 cotton/textile scale matches CG-23/CG-24

- **Productivity decoupled from physical output** (`src/engine/systems/economy.ts`, `PRODUCTIVITY_ELASTICITY`).
  - Physical output now scales with productivity^0.15 and value added with ^0.85; services carry all of it at ^1.0. GDP sensitivity stays ≈ 1, and the Maddison calibration still fits (test: GBR/FRA/USA/QNG/RUS within ±10%).
  - Investment appraisal stays productivity-neutral (√productivity, as before), so the private-investment threshold means the same in every country.
- **1836 factory employment** (`src/engine/init.ts`, `FACTORY_SHARE_OF_WORKERS_1836 = 0.21`): only 21% of the workers stratum works in factories; the rest become artisans (outwork and handicraft).
  - Britain now starts with **360k** textile-mill hands (CG-24: 355,373; before: 1.71M).
  - ASSUMPTION: the same ratio is applied to other countries until per-country evidence exists.
- **Plantations** (`plantationLabourShare1836`): slave regions stay at 0.9; free-labour cotton-only regions drop to 0.05, mixed cash-crop regions stay at 0.4.
  - Start-of-game cotton crop: world **884m lb** (Woodbury 1834: 900), USA **421m lb ≈ 48%** (460m, 51%). Qing was the largest grower before; now the USA is.
- **Textile recipe:** cotton input 0.45 → 0.21 per unit. The old coefficient was the cost share of yarn (Kennedy 1830); the textiles good is cloth and clothing. British mills now use **300m lb** a year (England 1834: 297–320m lb).
  - GBR cotton demand / world crop: 1.97 → **0.365** at month 12 (target 0.33–0.36).
- **IND-02a trial with the flag ON:** all 112 textile mills run profitably at full utilisation for 24 months. Tool works and ironworks still idle, so the flag **stays OFF**. The iron/steel/coal/tools chain becomes **ECON-CAL-03**, with research request CG-25 in MSG-027.
- **AI anti-oscillation test fixed:** `lawHistory` entries now record the cause of the change (`reform`, `revolution`, `civil`, …). The test judges only the government's own reforms; a revolution undoing a reform is not an AI flip-flop.
- **Tooling and evidence:** new `tools/calib-report.ts`; before/after numbers in `docs/audit/econ/ECON_CAL_02_REPORT_2026-11-22.json`; new tests in `tests/econ-calibration-cg23-cg24.test.ts` (7).
- Local: tsc 0; `npm test` **27/27 files, 256/256 tests**; build 0.

---

## 2026-11-22 — CG18-01 follow-up fixed; CG-24 accepted; ECON-CAL-02 plan

- **Worker reply validation deepened** after ChatGPT's third review (MSG-023): snapshot structure, non-negative integers, valid campaign hours, `stop` enum, command result shape and optional flag types.
  - Recovery wording corrected to "last acknowledged checkpoint" (addendum in `docs/coordination/reviews/CLAUDE_RESPONSE_CG16_CLOCK02_2026-11-22.md`).
  - Real-worker smoke still passes. Local: tsc 0; `npm test` exit 0, **26/26 files, 249/249 tests**; build 0.
- **CG-24 accepted** (corrected version, MSG-024): 1835 GB factory hands were cotton 220,134 / wool 71,274 / flax 33,283 / silk 30,682; mill counts are disputed and not used. The engine starts Britain with ≈ 1.71M textile-mill workers (7.8× the cotton figure).
  - Starting levels come from the `init.ts` rule "all workers-stratum labour → factories, 70% textile mills".
  - GDP-calibrated productivity multiplies **physical** output in both agriculture and industry.
- **ECON-CAL-02 plan** (MSG-026), next slice:
  1. productivity affects value added, not physical quantities;
  2. initial factory employment calibrated to CG-24 for Britain (same structural ratio elsewhere, flagged as an assumption);
  3. CG-23 constraint tests (Britain ≈ 33–36% of world cotton use; the USA the largest grower).

---

## 2026-11-22 — ECON-03a + root cause of the textile/cotton misalignment (ECON-CAL-02)

- **ECON-03a** (commit `a6fd093`): openness now sets the tradable *share* of a deficit or surplus, `tradeShare = min(1, open/0.5)` (NaN-safe), instead of trading exactly `open × deficit`.
  - Unsold share at month 12 (before → after): cash crops 25% → 10%, iron 32% → 23%, arms 41% → 24%. GDP unchanged.
  - Tests cover `tradeShare` and the CG-22 constraint (Britain imports most of its cotton; the USA is a top-3 exporter).
  - Local: 26/26 files, 248/248 tests; build 0.
- **ChatGPT CG-23** (Woodbury 1836, public domain) accepted: world crop 1834 ≈ 900m lb (USA ≈ 51%); England used 297m lb (≈ 33–36% of the world crop). The engine has Britain demanding ≈ 203% of world supply, about 6× too high.
- **Root cause found** (engine at start, seed 1):
  - Britain has 855 textile-mill levels × 2,000 workers ≈ 1.71M mill workers (historically ≈ 0.22–0.24M, to confirm via CG-24).
  - The GDP-calibrated productivity (6.5) multiplies physical mill output by a further ≈ 2.55.
  - On the supply side, Qing has 1,190 plantation levels against the USA's 491.
  - Recorded as **ECON-CAL-02** (starting building levels + productivity/physical-output decoupling). CG-24 (1830s industry scale, public domain) requested in MSG-021. IND-02a stays off.

---

## 2026-11-22 — ECON-CAL-01b: per-good trade openness from 1836 tariff evidence + price-responsive cottage industry

- **Per-good openness** (`src/engine/data/tradePolicy1836.ts`, `goodOpenness()` in `economy.ts`):
  - Market import openness is now per good. The trade-law base is replaced by CG-21 tariff evidence where it exists: GBR cotton/textiles/iron/steel/grain, Zollverein/PRU raw cotton, FRA cotton cloth prohibition, USA cotton manufactures.
  - Evidence applies only while the market leader keeps its 1836 trade law. It is part of the shared 1836 starting world, so it applies in both modes.
  - Tariff → openness mapping `0.75 − 2.2·t` reproduces the engine's law table.
- **Cottage industry:** artisan mix tilts toward better-priced goods and marketed volume falls when their goods are cheap (floor 0.5). At base prices the former fixed mix is reproduced exactly.
- **Measured** (historical, seed 1, month 12):
  - Unsold textiles 47% → 34%, tools 94% → 87%; GBR cotton 2.50 → 2.21; world GDP essentially unchanged (831B).
  - With IND-02a switched on, textile mills still idle. IND-02a stays OFF.
- **Remaining causes** (moved to ECON-03, with CG-22 requested in MSG-017):
  - imports are capped at deficit × openness, so a fully import-dependent industry cannot be supplied;
  - British textiles have no export outlets;
  - subsistence grain surplus.
- **Tests:** `tests/trade-calibration.test.ts` (5). Local: tsc 0; `npm test` exit 0, **26/26 files, 246/246 tests**; build 0.

---

## 2026-11-22 — ChatGPT CG-21 reviewed: per-category trade openness decided

- CG-21 (public-domain tariff evidence c.1836) is accepted:
  - Britain: raw cotton duty 5/16d/lb (under 3% of a ~10d price); wheat under the Corn Law sliding scale.
  - Prussia/Zollverein: raw cotton duty-free.
  - France: cotton yarn and cloth prohibited, with narrow exceptions.
  - USA (1836): cotton manufactures at 24% nominal.
- **Design decision:** replace the single per-country openness with per-category openness (`raw_material`, `intermediate`, `manufacture`, `food_grain`) derived from trade law, plus country overrides wherever CG-21 has evidence. Unknown entries keep the law default.
- This will be implemented together with market-responsive cottage/subsistence output (ECON-CAL-01b). Recorded in MSG-013; documentation only.

---

## 2026-11-22 — ChatGPT CG-20 reviewed: recipe consistent with 1830 anchor; misalignment is market-side

- CG-20 (public-domain 1830s sources: Baines 1835, Porter 1836, Tooke 1838, Babbage 1832, Kennedy's 1839 Hansard testimony) is accepted as calibration constraints only; no 1836 prices are hardcoded.
- **Check:** raw cotton ≈ 44% of 1830 yarn cost (10d of 22.5d/lb, Kennedy). The textile-mill recipe at base price 1 is ≈ 45% cotton, so the recipe is not the fault. ECON-CAL-01 is narrowed to:
  1. a single trade-openness factor per country that throttles raw-material imports the same as finished goods (London cotton 2.50);
  2. fixed-mix cottage output gluts textiles (0.67).
- MSG-011 assigns ChatGPT CG-21: 1836 raw-material vs finished-goods tariffs (Britain, then France, Prussia/Zollverein, USA) from public-domain sources, as the basis for per-category openness.
- Documentation-only update.

---

## 2026-11-22 — IND-02a profit-responsive site operations (implemented, OFF by default) + calibration finding ECON-CAL-01

- **Mechanism** (`src/engine/systems/industry.ts`, wired in `economy.ts`):
  - Every plantation, mine, logging camp and factory site keeps utilization, cash reserves, loss/gain streaks and an idle state.
  - Monthly profit = output × market price (already depressed under oversupply, per CG-17) − input cost − wages.
  - Sustained losses that the reserve buffer cannot carry cut utilization (15%/step, idle below 10%). Sustained profit with full sell-through rehires (+10%/step). Idle sites reopen only after 3 months and a shortage signal.
  - State lives in `GameState.industry` (normalized for old saves, validated on save/load).
- **Measured with it ON** (historical, seed 1): it idles ~98% of textile mills and tool works within a year.
  - Root cause: price/recipe calibration, not the mechanism. All goods have base price 1; the London cotton price is 2.50 vs textiles 0.67 (cottage glut, scarce raw-cotton imports); the London textile mill had revenue 22.5M vs cost 51.8M per month.
  - A first revenue variant (pro-rata sell-through) was worse and was replaced by price-based revenue.
- **Decision:** ship it behind `ECONOMY_FLAGS.siteOperations = false` so simulation results are unchanged. Prerequisite **ECON-CAL-01**: per-good base prices/recipe ratios, raw-material import access, market-responsive cottage/subsistence production.
- **Tests:** `tests/site-operations.test.ts` (11) — CG-19 scenarios 02/03/04/06/07/09 on the pure decision, plus integration with the flag on (ledger closed, population valid, determinism, save round trip, corrupt record rejected) and flag-off default.
- **Local:** tsc 0; `npm test` exit 0, **25/25 files, 241/241 tests**; build 0.
- **MSG-009:** asks ChatGPT for CG-20 (1830s relative prices and input ratios from public-domain 19th-century statistical works: Baines, Porter, Tooke, McCulloch).

---

## 2026-11-22 — CG18-01 fixed: worker reply schema validation

- ChatGPT CG-18 re-review: 4/5 CG-16 fix groups verified statically. One P2 remained: worker replies were checked only shallowly.
- Fix: `isValidReply()` checks `ok`, a generation matching the pending request, the expected success `kind` per request kind, and the fields each kind requires. Invalid replies fail the host.
- Test: `tests/sim-host-worker.test.ts` (5 malformed reply shapes).
- Real-worker browser smoke (desktop Chromium, 12h/s, 20 s): worker host, +240 h, save/load hour match, 0 page errors.
- Local: tsc 0; `npm test` exit 0, **24/24 files, 230/230 tests**; build 0.
- MSG-007: assigns ChatGPT CG-19 (ECON-02 acceptance scenarios and calibration data); HY-01 v2 is at 12/40 verified sovereigns.

---

## 2026-11-22 — CG-16 fixes: worker failure handling and recovery

- All five findings from ChatGPT's CLOCK-02 critique are fixed; see `docs/coordination/reviews/CLAUDE_RESPONSE_CG16_CLOCK02_2026-11-22.md`.
  - Terminal host failure settles all pending requests.
  - Per-request watchdog (30 s, provisional).
  - `postMessage` errors resolve as failures.
  - `inflight` is cleared on any outcome.
  - Inline dispose parity.
  - Malformed replies fail the host.
- Controller recovery policy: recover onto an inline host only from a validated UI checkpoint, and only while `subMonthlyPhasesEmpty()` holds; otherwise set `hostError` and block play until a load or new game.
- New `tests/sim-host-worker.test.ts` (fake worker running a real SimCore).
- Local: tsc 0; `npm test` exit 0, **24/24 files, 229/229 tests**; build 0.
- ChatGPT CG-17 (oversupply/profitability) accepted. MSG-005 assigns CG-18 (re-review) and continues HY-01 v2.

---

## 2026-11-22 — ECON-01a material-flow ledger + stale market stats fix

- **Before:** monthly clearing let deficit markets import from a "world surplus" but never booked the matching exports, so the material ledger was open.
- **Now:** `clearMarkets()` allocates world imports pro rata to surplus markets as exports. `MarketGoodStats` gains `exports`, `used` and `unsold` (optional fields, old saves still load).
  - Invariants: `supply + imports = used + exports + unsold` per market and good, and `Σ imports = Σ exports` per good worldwide.
  - `marketLedgerAudit()` checks both.
- **Bug found by the ledger and fixed:** `marketStats` kept last month's entries for markets that no longer exist (annexation, customs union). It is now rebuilt every month from live markets. AI and UI read only current markets, so their behaviour is unchanged; the full suite passes.
- **UI:** the good detail panel shows exports, used and unsold.
- **Economic finding (R-ECON-1):** at month 12 (historical, seed 1) the unsold share of supply is grain 53%, cotton 52%, timber 93%, tools 94%, textiles 47%, opium 76%, arms 41%. Root cause: output does not respond to demand or profit. Next fix is profitability-driven production (ECON-02/IND-02). ChatGPT is asked for CG-17 (Victoria 3 oversupply handling) via MSG-002.
- **Tests:** `tests/market-ledger.test.ts` (5 tests). Local: tsc 0; `npm test` exit 0, **23/23 files, 220/220 tests**; build 0.

---

## 2026-11-22 — CLOCK-02b (web part): background pause + autosave

- `src/ui/game/lifecycle.ts`: listens for `visibilitychange` (hidden), `pagehide`, `freeze` (Chromium Page Lifecycle) and the Capacitor/Cordova `pause` event. Each one calls `game.onBackground()`, which is idempotent and also cancels fast-forward.
- Each background transition triggers one best-effort autosave (throttled to 15 s) into the slot "Tự động lưu khi rời ứng dụng", using the safe slot writer with backup.
- The game never auto-resumes.
- Wired in `src/ui/main.tsx`.
- **Evidence:**
  - `tests/lifecycle.test.ts` (5 tests).
  - Browser smoke (desktop Chromium): dispatching `freeze` → paused + `pausedByLifecycle`, autosave slot present in IndexedDB, clock stopped; 0 page errors.
  - Local `npm test`: see the commit below; build 0.
- **Blocked by environment permission:**
  - Adding the `@capacitor/app` dependency (native pause/resume hook, needed for thermal later) was refused by the session's permission classifier.
  - Creating a recurring scheduled check of the AI message board was also refused.
  - Neither was worked around; both need the owner to allow them in Claude Code settings if wanted.
- Real Android behaviour (which events the WebView fires on pause/process death) is not device-verified.

---

## 2026-11-22 — AI message board

- Owner request: Claude and ChatGPT coordinate directly on GitHub.
- `docs/coordination/AI_MESSAGE_BOARD.md`: append-only message thread (format, status, `Cần owner` flag, file-scope rules), plus the fixed one-line prompt the owner sends to ChatGPT.
- Linked from AI_START_HERE.md and AGENTS.md.
- MSG-001 assigns ChatGPT: CG-16 (independent critique of CLOCK-02), then HY-01 v2 (first batch at ≥40 verified sovereigns), then HY-04.

---

## 2026-11-22 — BUG-CMD-01 fixed: player commands fail closed

- **Root cause:** `execute()` passed unvalidated input straight to systems. `start_reform` accepted any group/value (`ok: true`). Diplomatic and war commands did not check that the target exists, is alive and is not the player. `break_alliance` without an alliance still cost relations and returned `ok: true`. Non-finite numbers and unknown budget keys were not rejected.
- **Fix:**
  - `validateCommand()` in `src/engine/commands.ts` runs before any mutation.
  - The reformable-law catalogue moved into the engine (`src/engine/laws.ts`); the UI `LAW_OPTIONS` re-exports it as the single source of truth.
  - Unknown command types are rejected.
  - Vietnamese UI messages added for the new reasons.
- **AI is unaffected:** AI calls system functions directly, not `execute`, so simulation determinism is unchanged; all `modes.test` scenarios still pass.
- **Tests:** `tests/commands-validation.test.ts` (6 tests). Local: tsc 0; `npm test` exit 0, **21/21 files, 210/210 tests**; build 0.

---

## 2026-11-22 — Owner: 12h/s is the maximum speed

- Owner directive `docs/coordination/OWNER_DIRECTIVE_MAX_SPEED_12HPS_2026-11-22.md`: 12 game-hours per real second is the maximum.
- Fixed presets are now **1/2/3/6/12 h/s** (24/12/8/4/2 real seconds per game day); 24 and 48 h/s are removed, and saved 24/48 preferences clamp to 12.
- AUTO is unchanged (12 → 6 under sustained load).
- HUD shows AUTO or CỐ ĐỊNH plus the effective rate.
- Local: tsc 0; `npm test` exit 0, 20/20 files, 204/204 tests; build 0.

---

## 2026-11-22 — CLOCK-02 simulation Web Worker — IMPLEMENTED (desktop-measured)

- **Kiến trúc:**
  - `SimCore` (`src/engine/runtime/simCore.ts`) sở hữu state thật, giao thức có thế hệ `gen`.
  - `sim.worker.ts` + `WorkerSimHost` chạy trong app; `InlineSimHost` dùng cho test/dự phòng.
  - Controller chuyển sang async: `newGame/load/save/command/stepOnce/stepDay/fastForward` đều async; tối đa một `advance` chạy cùng lúc; UI giữ bản sao read-only.
  - Các chỗ gọi trong UI (send/act, autosave, World save/load/export/import, Setup, boot) đã cập nhật.
- **Kênh đồng hồ nhẹ:** smoke test phát hiện mỗi lần cập nhật giờ (4/s) re-render toàn bộ UI, gây ~65–90 ms long task — do CLOCK-01 đưa vào. Đã sửa: chỉ `DateBox` re-render theo giờ.
- **Bằng chứng (desktop, không phải Android):**
  - Chromium headless, host=`worker`, chơi 48 h/s trong 20 s qua mốc tháng: long task **80 → 2** (tổng ~5,8 s → ~0,13 s); save→load giữ nguyên giờ; 0 lỗi trang.
  - Clone snapshot 4,2 MB ~22 ms (UI ~11 ms), so với ~64 ms mô phỏng trước đây chạy trên UI thread.
  - Local: tsc 0; `npm test` exit 0, **20/20 file, 204/204 test**; build 0 (có chunk `sim.worker-*.js`).
- **Test mới/viết lại:** `tests/sim-core-protocol.test.ts`, `tests/controller-clock.test.ts`, `tests/controller-fast-forward.test.ts` (engine thật + host có kịch bản xen ngang load/new game/background/lỗi).
- **Lỗi phát hiện (chưa sửa):** BUG-CMD-01 — `start_reform` với nhóm luật không tồn tại trả `ok: true`.
- **Hydrogen HY-01 v1:** đã review — chỉ dùng làm tham chiếu niên đại, giao v2 có URL/license từng file theo danh sách 186 chính thể còn thiếu.
- **Tiếp theo:** BUG-CMD-01 (validation lệnh) → CLOCK-02b (lifecycle native + autosave nền) → POP-01/ECON-01 (gameplay spine).

---

## 2026-11-22 — SAVE-01 implemented + CG-12 fixes + ChatGPT CG-13..15 integrated

- **SAVE-01:**
  - The save envelope now records `engineVersion`, a world-data fingerprint and `savedAtHour`. A different world layout or a mismatched hour is rejected.
  - RNG fail-closed: missing, invalid or all-zero RNG is rejected, which closes B4-R1. The old B4 characterization test is updated to the fixed contract.
  - Slot writes are validated first and keep the previous good save as a backup in the same IndexedDB transaction. Load falls back to the backup and shows a toast.
  - Pure logic: `src/ui/game/slots.ts`; tests: `tests/save-envelope-slots.test.ts`.
- **CG-12 (ChatGPT re-review of CLOCK-01 fixes):**
  - 4/5 fixes verified by ChatGPT.
  - New CG12-01 accepted and fixed: `dispose()` is terminal (no-op policy) and toast timers are cleared.
  - Added a real-engine fake-clock test proving the 12 ms fast-forward yield.
  - Response: `docs/coordination/reviews/CLAUDE_RESPONSE_CG12_2026-11-22.md`.
- **ChatGPT CG-13** (1836 price/wage/basket source register), **CG-14** (original 1836–2026 goods taxonomy) and **CG-15** (Hydrogen dispatch brief) were merged and accepted.
- **Hydrogen** has not received its tasks: the owner must forward `docs/research/media/CG15_HYDROGEN_DISPATCH_2026-11-22.md`.
- **Local evidence:** tsc exit 0; `npm test` exit 0, 19/19 files, **197/197 tests**; build exit 0.
- **Branch policy (owner 2026-11-22):** Claude works on `ccr-…` and fast-forwards the designated branch after each tested slice. This commit is pushed to both branches.
- **Next:** CLOCK-02 (simulation in a Web Worker).

---

## 2026-11-22 — Branch sync (owner-approved)

- Owner explicitly approved bringing the designated branch level with `ccr-b27f3fb8-epfpd6`.
- Before the sync, the designated branch had two extra commits:
  - `95781b4`: ChatGPT visual reference board;
  - `6b2ac92`: a merge made from the owner account that included `ccr` @ `e252daa`.
- Claude merged the designated branch into `ccr` (merge `03dc149`, docs only: the visual board file). Then it fast-forwarded `claude/game-historical-sandbox-modes-kg7rj7` to `03dc149`, with no force-push and no history rewrite.
- After the sync, both branches pointed to the same HEAD; this handoff commit is pushed to both.
- CI: the Android run for `e795608` (CG-11 fixes) was IN_PROGRESS at sync time: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44932978529

---

## 2026-11-22 — CG-11 fixes for CLOCK-01 + ChatGPT round 2 integrated

- ChatGPT pushed to `ccr-b27f3fb8-epfpd6`: CG-11 critique `61155ee`, 1.15 source digest `b65e9f6`, SteamDB link replacements, CG-01b `36d597c`, CG-06 DLC leaves `c8ca448` (88 leaves), CG-10 2D revision `7b743e8`, handoff `3107ed4`.
- Claude accepted all five CG-11 findings and fixed them; see `docs/coordination/reviews/CLAUDE_RESPONSE_CG11_CLOCK01_2026-11-22.md`:
  - background cancels fast-forward;
  - owed hours are never truncated on rate change;
  - `dispose()`;
  - hour-granular fast-forward chunks of 12 ms with a yield per chunk;
  - strict calendar input validation.
- Local evidence: tsc exit 0; `npm test` exit 0, **18/18 files, 185/185 tests**; build exit 0. CI is pending on the push (Android workflow on all branches).
- Previous CI: [run 44930374082](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44930374082) SUCCESS on CLOCK-01 commit `6bbb11e52ad3bb4cec506adeb9f5b88943b7a641`.
- New ChatGPT tasks CG-12..15 are in `AI_TASK_ASSIGNMENTS.md`. Real 1.15.x tooltip screenshots are deferred: they need a licensed install, and the zip package held only link manifests.
- Branch: the designated branch still lacks CLOCK-01; owner permission to fast-forward it is pending.

---

## 2026-11-22 — Claude tích hợp gói nghiên cứu ChatGPT — ACCEPTED_FOR_PLANNING

- ChatGPT nộp CG-01..05, CG-07..10 và visual catalogue lên `claude/game-historical-sandbox-modes-kg7rj7` @ `b3643b35091e0b6b4d9cbf727311c6c5427089b4` (chỉ tài liệu). Claude merge vào `ccr-b27f3fb8-epfpd6` (merge `1f8896a`, không xung đột) để code CLOCK-01 và nghiên cứu nằm trên cùng một lịch sử.
- Review: `docs/coordination/reviews/CLAUDE_REVIEW_CHATGPT_RESEARCH_2026-11-22.md`. Thay đổi kế hoạch:
  - ECON-03 chuyển sang World Market/Trade Center.
  - V-Dem chỉ dùng tham chiếu (CC BY-SA).
  - Thêm thermal status vào CLOCK-02b.
  - Ngân sách media theo kiến trúc 2D.
- Kiểm tra nguồn độc lập:
  - Chỉ xác nhận được tiêu đề "Hotfix 1.15.2"; nội dung trang không trích được.
  - SteamDB trả 403 → các claim 1.15/1.9 giữ nhãn NOT_VERIFIED_BY_CLAUDE.
- CG-11 bị BLOCKED vì ChatGPT đọc branch chỉ định, nơi chưa có CLOCK-01; nay đã mở lại trên `ccr-…`. CG-06 chưa nộp.
- **Branch:** hai branch vẫn tách nhau. `ccr-…` chứa mọi thứ (CLOCK-01 + nghiên cứu); branch chỉ định thiếu CLOCK-01. Claude cần owner cho phép push/fast-forward branch chỉ định lên `ccr-…`.
- Không đổi code/test trong lát cắt này.

---

## 2026-11-21 — CLOCK-01 ADAPTIVE HOURLY CLOCK (AUTO 12h/s → 6h/s) + CLAUDE EXECUTION PLAN — IMPLEMENTED / SELF-REVIEWED

- **Tác giả:** Claude Code (Project Director). Branch phiên: `ccr-b27f3fb8-epfpd6` (tạo từ cùng HEAD `94d0d28` với branch chỉ định `claude/game-historical-sandbox-modes-kg7rj7`; phiên này không đổi branch và không push lên branch chỉ định — xem "Branch" bên dưới).
- **Base:** `94d0d28d78cf8184b41df6b70ae4e7c55a85d38c`. **Plan commit:** `a14454367bee44fa0f02f481f2d9e167320c436a`. **Code/test commit:** `6bbb11e52ad3bb4cec506adeb9f5b88943b7a641`. **Handoff commit:** commit chứa mục này.
- **Deliverables bắt buộc đã tạo:** `docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md` (audit, kiến trúc, critical path, M0–M9, task register, kế hoạch clock/save/lịch sử/media/Android, risk register); `docs/coordination/AI_TASK_ASSIGNMENTS.md` (CG-01..11 cho ChatGPT, HY-01..05 cho Hydrogen); ma trận parity thêm cột `status_2026_11_21/code_paths/tests/next_task` + dòng cho clock, các gói DLC đã phát hành, Century of Strife (NOT_APPLICABLE/chưa phát hành); ghi nhận cơ chế phối hợp mới của owner (`OWNER_DIRECTIVE_COORDINATION_MODEL_2026-11-21.md`).
- **CLOCK-01 đã làm:**
  - Thời gian canonical `GameState.clock.hour` (giờ kể từ 1836-01-01T00:00), lịch Gregorian nguyên số (`src/engine/clock/calendar.ts`): 69.762 ngày = 1.674.288 giờ; giờ chơi cuối 2026-12-31T23:00; tháng 1/2027 không bao giờ chạy.
  - Scheduler `advanceHour/advanceHours` (`src/engine/simulation.ts`) với thứ tự hourly → daily → weekly → monthly → yearly; hệ thống tháng giữ nguyên thứ tự/RNG ⇒ **byte-identical** với runtime tháng cũ (14 tháng, cả 2 mode). Phase hourly/daily/weekly đăng ký nhưng rỗng (chưa subsystem nào được chuyển cadence — CLOCK-03).
  - Pacing nguyên số (`src/engine/clock/pace.ts`): preset 3/6/12/24/48 h/s + AUTO; gap ≤ 250 ms/callback; backlog chặn 1 s; lag hiển thị; không bỏ giờ.
  - AUTO governor (`src/engine/clock/governor.ts`): 12 → 6 sau ~6 s quá tải đo được; 6 → 12 sau ~30 s headroom; trạng thái `overloaded` nếu 6h/s vẫn không theo kịp; fixed preset không bị đổi. Ngưỡng **PROVISIONAL** (chưa hiệu chỉnh trên Android).
  - Controller: RAF `tickFrame` với ngân sách 8 ms/frame, emit UI throttle 250 ms; pause khi `visibilitychange` hidden; `stepDay`; HUD hiển thị ngày/giờ, AUTO/fixed, tốc độ hiệu lực, cảnh báo quá tải; phím 1–5 = 3/6/12/24/48, 0/A = AUTO.
  - Save schema **v3**: `clock.hour`; migration thuần v1→v2→v3; từ chối clock thiếu/sai/lệch; lưu giữa tháng; `clockPreference` trong envelope (không thuộc GameState).
- **Tests:** thêm `tests/clock-calendar.test.ts`, `tests/clock-hourly-equivalence.test.ts`, `tests/clock-pace.test.ts`, `tests/controller-clock.test.ts`; cập nhật `tests/campaign-calendar.test.ts` (định vị bằng `positionAtMonthStart`, biên theo giờ), `tests/controller-fast-forward.test.ts` (mock `advanceHours`/`deserializeWithMeta`; tháng 12/2026 vẫn còn giờ chơi, chỉ khóa ở 23:00 31/12/2026). **Xóa** `tests/monthly-clock.test.ts` vì `consumeClockElapsed/SPEED_MS` (đồng hồ tháng cũ) đã bị thay thế; hành vi tương ứng (không burst catch-up, clamp input) được kiểm bởi `clock-pace.test.ts`.
- **Kết quả local (container Linux, Node v22.23.5):** `npx tsc --noEmit` exit 0; `npm test` exit 0 — **18/18 file, 179/179 test, 0 fail**; `npm run build` exit 0. Lần chạy đầu có 1 fail ở test migration do so sánh chuỗi JSON khác thứ tự key (giá trị giống nhau) → đổi sang so sánh cấu trúc; đã ghi nhận minh bạch.
- **Browser smoke (headless Chromium, desktop, 915×412):** AUTO 12h/s chạy 4 s thực → 47 giờ game, HUD "AUTO 12h/s", không page error. Không phải QA thiết bị Android.
- **Benchmark desktop:** `docs/audit/clock/CLOCK01_DESKTOP_BENCH_2026-11-21.json` (`tools/clock-bench.ts`): ranh giới tháng p50 ~54–63 ms, max ~110–125 ms; giờ thường ~0,25 µs; tỷ lệ CPU dự phóng ~0,1% ở 12h/s. Rủi ro thật: giật frame tại ranh giới tháng khi mô phỏng còn ở UI thread ⇒ CLOCK-02 (Web Worker) là bước kế tiếp. **Không có benchmark Android.**
- **CI:** push nhánh `ccr-b27f3fb8-epfpd6` kích hoạt workflow Android APK (chạy mọi branch); workflow tests-only chỉ chạy trên branch chỉ định. Kết quả CI phải đọc lại trên GitHub cho exact SHA `6bbb11e52ad3bb4cec506adeb9f5b88943b7a641`; chưa được claim ở đây.
- **Branch:** owner/phiên sau cần fast-forward `claude/game-historical-sandbox-modes-kg7rj7` lên `ccr-b27f3fb8-epfpd6` (lịch sử tuyến tính, cùng base) hoặc tiếp tục trên `ccr-…`. Claude không tự push lên branch chỉ định trong phiên này.
- **Chưa làm / rủi ro:** CLOCK-02 worker; CLOCK-02b lifecycle native + autosave nền; CLOCK-03 cadence mịn; CLOCK-04 event queue theo giờ; CLOCK-BENCH-ANDROID (cần owner cho phép cài APK lên thiết bị); SAVE-01/02 (engineVersion/dataBuildHash, RNG theo domain, B4-R1). `tools/audit/s0/perf_desktop.ts` là harness lịch sử S0 dùng API `setSpeed` cũ — không còn chạy được với controller mới, giữ nguyên làm bằng chứng lịch sử. Không thay đổi package/signing/release/workflow.
- **Self-review (implementer self-review, không phải review độc lập):** kiểm tra tất định (equivalence + chunking + save giữa tháng), biên chiến dịch theo giờ, fail-closed khi lệch clock, không giờ nào bị bỏ, governor không dùng lịch. Verdict: SELF_REVIEWED — sẵn sàng cho phản biện ChatGPT (CG-11).
- **Task tiếp theo:** SAVE-01 → CLOCK-02 (theo execution plan §6).

- **Tham khảo thiết kế từ owner (21/11/2026):** gói `Victoria3_Reference_Pack.zip` (6 ảnh Dev Diary #49) đã được phân tích tại `docs/ui/V3_DEV_DIARY_49_DESIGN_REFERENCE_ANALYSIS_VI.md` (quan sát vs suy luận, gap, thích ứng mobile, ánh xạ task). Ảnh của Paradox **không** được commit vào repo và không dùng trong sản phẩm.

---

## 2026-11-21 — OWNER CLOCK REFINEMENT: ADAPTIVE 12h/s → 6h/s

- Owner accepts reducing simulation pace to 6 in-game hours per real second when the late game produces sustained lag. The default mode is AUTO: 12h/s nominal when healthy; visible 6h/s fallback when measured workload requires it.
- 6h/s means one game day takes 4 real seconds, a 28–31 day month takes 112–124 seconds, and the uninterrupted 1836–2026 campaign takes 77h30m48s (versus 38h45m24s at 12h/s).
- Rate changes affect wall-clock progression only. They must not remove Pops, countries, buildings, goods, markets, AI, events or other simulation detail, and must not skip hourly boundaries. Use measured overload thresholds, hysteresis, clear effective-rate UI, deterministic saves and bounded catch-up.
- If 6h/s remains overloaded, surface the condition and preserve work; allow pause or a manually selected slower preset rather than silently claiming the target is met.
- Updated owner directive, master brief, AI_START_HERE.md and CLAUDE.md. Documentation-only change; no runtime code, tests, build, CI or device benchmark was run.
- Commits: owner directive 36319ffcd70f799fd077576b2459226df3a17fb9; master brief f00baaf8145ff78150422514e2ca2d17e5480cfa; AI_START_HERE.md 34b666cacb935a0f1edc39932b8da8410c5c8a29; CLAUDE.md 4ad469edbeaa543c96169004dcb795751c325662.

---

## 2026-11-21 — Earlier role allocation and master brief (superseded by current execution directive)

- Owner requested a full Victoria 3-class product/implementation brief and explicitly assigned Claude Code as the primary code-authoring agent for future authorized tasks.
- Added master brief at docs/coordination/CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md; expanded to 1,113 lines. It covers the whole gameplay domain inventory, 1836–2026 campaign target, released DLC mechanics, detailed system-by-system feature breakdown, seven causal loops, engine invariants, Android architecture, landscape-first UI, 12h/s clock target, 4–5 GB offline content, execution authority, AI task allocation and acceptance criteria.
- Master brief creation: 95b518ec7fc457673c575eccc22f1c4291dacda5. Released-content parity addendum: e1611f60784ecd7e6e718f50b830d4d5a8f00aa5.
- Role/entrypoint synchronization commits: protocol 1fdb527a6999da3c0b11126149355ed310f01a03; CLAUDE.md 12db2304529197f718e94a15f1d7917904704a94; AGENTS.md 637aacc45a52ddde6a117943d1e8f0a07d95e4d0; AI_START_HERE.md 2a82c9beb2a455c4dd34786a02f346a1418a4626; initial rolling report a1f2d569d847c9ad8ef2d39f979d0373cdf9593c; initial handoff role index 1bc2b7412ac4a143e91352f04f9215672751d0ed; final master-brief DLC-map addendum e1611f60784ecd7e6e718f50b830d4d5a8f00aa5; progress-report DLC-map update 7bd25a608abcb40af00d90046e2812a4e8102837.
- This entry records the earlier 2026-11-21 role allocation only. It is superseded by OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md below: Claude now has Project Director/autonomous execution authority; ChatGPT performs research synthesis and requirements intelligence; Gemini Hydrogen supports visual/media research; DeepSeek is retired.
- The previous review-first task sequence is superseded. Claude's current first deliverables are a full code/data/parity audit, execution plan and AI assignment register, followed immediately by the first dependency-ready implementation slice.
- Historical gate states such as DEV-007 READY_FOR_REVIEW, B4/B7 READY_FOR_REVIEW, S1 NOT_STARTED, S22 DESIGN_ONLY, G0.7 BLOCKED, G0.8 PARTIAL and full-S0 G0.9 BLOCKED remain historical facts. The 2026-11-21 owner directive authorizes Claude to continue ordinary implementation without per-phase approval, while preserving the underlying save/data/security integrity checks.
- This work changed documentation/governance only. No runtime, gameplay, data, save schema, asset, UI, Android, Gradle, workflow or signing files changed. All documentation commits use [skip ci]; no code test/build/device QA was run or claimed.
- Current owner directive commit: bf4d28f4252c85439bd01d5e318968197c7007b8; master brief updates: a00223f01051f90185f41dc29cb7012a1259d2de, 0f8c55f897ea145adf1bf76035648f510a88d0d6 and 0af04a20539d4d2bc5f722b580967eaa56f8837b; protocol update 256e0e51d681d241c7c5133e167d376c875105bb; latest rolling report 5aab66c605e52e03cbe63961f9e182e79cfdf6fe. Re-fetch actual branch HEAD before next task.

---

# CURRENT OWNER EXECUTION DIRECTIVE — 2026-11-21

- **Project Director / Lead Systems Architect / Primary Engineer:** Claude Code has project-wide authority to research, plan, decompose, delegate, sequence and implement until the agreed completion criteria are met. No routine per-task or per-phase owner approval is required.
- **ChatGPT:** research synthesis, requirements intelligence, source reconciliation, technical briefs, documentation and visual-planning support. Claude directs tasks and makes final technical decisions.
- **Gemini Hydrogen:** visual research and media support to ChatGPT: historical image references, maps, flags, coats of arms, portraits, clothing, buildings, ships, animation/video and audio direction with provenance and rights.
- **DeepSeek:** retired from active project work. No new tasks, review requests or dependencies. Any older mention is archival history only.
- **Owner-reserved actions:** spending/paid services, credentials/secrets/signing, public release/store submission, personal-device installation, unapproved external data transfer and irreversible external actions remain outside Claude's autonomous authority.
- **Clock policy (owner refinement 2026-11-21):** default AUTO targets 12 in-game hours/real second while healthy and visibly falls back to 6h/s under sustained measured load, especially late-game. The 6h/s mode preserves all simulation detail and hourly events; it changes wall-clock pacing only. Users can also choose fixed speed presets. Campaign remains 01/01/1836–31/12/2026 inclusive. Existing monthly tick is not considered compliant until migrated and benchmarked.
- **Mandatory Claude deliverables:** docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md and docs/coordination/AI_TASK_ASSIGNMENTS.md; parity audit; then begin first dependency-ready implementation slice without waiting for another routine owner prompt.
- **Full directive:** [OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md](OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md).
- **Execution entrypoints synchronized:** CLAUDE.md ed0acd756deaee02ef4434f2368264dccd22a934; AGENTS.md 3a4835ec7400f95d17045bea1048d5f9767d40da; AI_START_HERE.md 46732f004ab919d62977237abd38b2304f2b01e5.
- **Directive commit:** bf4d28f4252c85439bd01d5e318968197c7007b8. **Master brief expanded:** a00223f01051f90185f41dc29cb7012a1259d2de. **Protocol aligned:** 256e0e51d681d241c7c5133e167d376c875105bb. **Current handoff/entrypoints:** see latest checkpoint commit chain.
- **Master product brief:** [CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md](CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md).
- **Latest execution baseline before this documentation update:** re-fetch branch HEAD; do not rely on historical SHA references below.


---

## DEV-007 — Campaign calendar 1836–2026 — READY_FOR_REVIEW (20/11/2026)

- **Owner authorization:** `docs/coordination/OWNER_DIRECTIVE_CAMPAIGN_RANGE_2026-11-20.md`; the owner changed the campaign period to January 1836–December 2026 inclusive for Historical and Sandbox.
- **Base:** `01e57d57a5715fadb13f54fa67b56f1cdbdef7ac`.
- **Implementation:** `f26d62041de74f2b28897229be8982f23b84910f` (campaign constants, engine boundary, controller and UI); `255734d70f4f3ea95638feeccf0f9b149899cdc9` (mock `stepMonth()` return type); `85e0ad35fc709806048edc04b829089a6817b087` (isolated shared spy history); **final code/test target `387ae24eae91b560b0f10cec6d59febb11396401`** (fast-forward stops on `stepMonth() === false`, plus `runMonths()` and terminal save/load tests).
- **Tests-only CI:** [run 44782634519](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44782634519) — SUCCESS on exact `head_sha=387ae24eae91b560b0f10cec6d59febb11396401`; 15/15 test files, 139/139 tests, 0 failed/pending/todo; Vitest exit 0; report_valid=true.
- **Android CI:** [run 44782634368](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44782634368) — SUCCESS on the same exact code/test SHA; 15/15 test files, 139/139 tests; Gradle `BUILD SUCCESSFUL in 1m 31s` (85 tasks).
- **APK:** 18,052,808 bytes; SHA-256 `9377c9c3aac053b193e96d2fbd151b6fd59cb333a6169e1df542ddff54e067b9`. APK artifact ID `14652853298`, ZIP size 17,564,905 bytes, ZIP SHA-256 `a81d22f0b674202c843b6070dfbb186da65046e141d9ebb8a1b176c5375d8ab8`.
- **CI evidence:** artifact ID `14652978121`, ZIP size 113,056 bytes, SHA-256 `a21823e13e5a9ba1818fae2f59e9db0760a4b5d37136a304f027a46a3a632911`. Both downloaded ZIPs were independently hashed and matched GitHub's artifact digests.
- **APK signature:** Android Debug signer only; certificate SHA-256 `c7d887ef3db71536110f1c8d609621a05726e36575257ed2516bc0d8dc3820d8`; V1/V2 verification true; `apksigner_exit_code=0`. This is not release signing.
- **Payload measurement:** the APK `assets/public` manifest contains 592 entries / 17,793,573 bytes (including application/static bundle assets); this is not a complete history/media library. No media packs or new historical datasets were added in DEV-007.
- **Implementation:** Jan 1836 is tick 0; Dec 2026 is tick 2291 and the final playable month. `stepMonth()` is a strict no-op after the end; `runMonths()` stops; controller RAF/manual step/fast-forward cannot advance beyond the end; fast-forward clamps remaining months and leaves a completed campaign paused. Setup and date HUD display 1836–2026. Current save schema is unchanged; a terminal save/load round-trip is tested.
- **Intermediate test-fixture failures, retained transparently:** `f26d620` first exposed a TypeScript mock returning `void` after `stepMonth()` changed to boolean; fixed in `255734d`. The first tests-only run on `255734d` had 136/137 pass because a shared spy retained calls from earlier tests; fixed by clearing spy history in `85e0ad3`. The final exact target `387ae24` passed 139/139 and Android CI.
- **Not delivered by this task:** source-backed historical events/data for 1937–2026; daily tick conversion; Victoria 3 gameplay parity; full offline packs; full image/video/animation/music/sound library; approximately 4–5 GB installed footprint. Current APK remains a ~18 MB bootstrap/debug build, not the finished game. No padding, duplicate files or quality degradation was used.
- **Device/release limitations:** no physical iQOO QA; no APK installation; no release signing. R14/save-backup risk remains. No phase gate or S0 verdict changed.
- **Task lifecycle:** `READY_FOR_REVIEW` for DEV-007 only. Claude independent no-write review is pending; owner acceptance is separate. This does not mark the full game complete or open S1/S22/S23.
- **Claude review packet:** `docs/audit/s0/DEV007_CAMPAIGN_CALENDAR_CLAUDE_REVIEW_REQUEST_2026-11-20.md`; exact no-write review target `387ae24eae91b560b0f10cec6d59febb11396401`.
## LATEST OWNER AMENDMENT — CAMPAIGN 1836–2026 (20/11/2026)

- Owner decision: `docs/coordination/OWNER_DIRECTIVE_CAMPAIGN_RANGE_2026-11-20.md` supersedes the older 1836–1936 campaign-period target only; the full campaign is January 1836 through December 2026 inclusive for Historical and Sandbox modes.
- The new period does not imply that post-1936 history is already researched or calibrated. Historical records/events for 1937–2026 still require sources, temporal/geographic validity, method, uncertainty and rights evidence; unknown data stays unknown.
- **DEV-007 — Campaign calendar boundary 1836–2026:** authorized bounded slice on base `01e57d57a5715fadb13f54fa67b56f1cdbdef7ac`. Scope: central engine date range, strict December 2026 stop, bounded manual/RAF/fast-forward behavior, setup/HUD display and regression tests. No save schema, daily tick, historical data invention or stage transition.
- Product delivery remains an APK bootstrap plus explicit-opt-in verified offline packs. A small APK or 40 MB runtime is not full content. The 4–5 GB installed target must be real, used, licensed/provenanced data and media; never padding or duplicate files.
- Existing S0/B4/B7 verdicts, independent review and owner-acceptance rules remain separate and unchanged.
## LATEST OWNER CLARIFICATION — FULL VICTORIA 3 PARITY + 4–5 GB COMPLETE GAME + FULL MEDIA (20/11/2026)

**This is the newest owner clarification and supersedes earlier ambiguous 3–4 GB / 4–5 GB “allowance” descriptions in the historical R15/S0 notes. Do not interpret those old entries as the current size target.** Full details and copy-ready next-session prompt: [OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md](OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md).

- **Feature scope:** learn and independently implement the complete functional scope of Victoria 3, not a simplified subset: the base game plus all gameplay-bearing mechanics/features from expansion, immersion and mechanics packs released in the chosen reference version. Keep a feature-by-feature parity matrix; include DLC systems and interactions (for example ship design, flagships, ship-purchase treaties and gunboat diplomacy from The Great Wave). Track future-announced content separately until released/researched. Never copy proprietary code, data, text, images, video, music or sound.
- **Actual full-game size target:** approximately **4–5 GB installed on the Android device after all full-game content packs have been installed and verified**. A compact ~18 MB APK can be the bootstrap/runtime shell only; it is not the finished game and must never be represented as one. The complete footprint must be meaningful gameplay/history/map data and in-game media, not filler.
- **Required media:** broad period-valid image library (flags, coats of arms, portraits, buildings, ships, armies, events, UI/map art), high-quality animation/video for suitable presentations and events, original/licensed music, ambience, UI/industrial/battle/naval sound effects and voice/narration where designed. Required offline media must work without streaming after packs are installed.
- **No excessive quality loss to shrink downloads:** do not mass-downscale images, crush video bitrates/resolution/frame rates, reduce audio quality, strip scenes or repeatedly recompress already-compressed media just to keep the package tiny. Use lossless/high-quality encoding where practical and measure trade-offs. LOD, lazy loading and streaming are runtime memory/performance techniques, not permission to delete high-quality installed media.
- **No fake size:** no empty/random/duplicate/repeated/unused files, silent audio or copied asset padding. Every pack must have real in-game purpose, provenance/license, coverage metadata, integrity hashes and quality checks.
- **Measure separately:** source media/data size, compressed download size, expanded installed full-game footprint, temporary staging/rollback space and peak decoded/resident RAM. The 4–5 GB target is the full installed product footprint, not the APK-only size, not RAM and not a requirement to fill space with junk.
- **Delivery/privacy:** base APK + user-visible, explicit opt-in offline packs under the approved delivery architecture. No automatic mobile-data download, no paid provider requirement, and no executable code in data packs. Full campaign/simulation/map/save-load must work offline after all required packs have been installed.
- **Current implementation status:** the latest landscape APK/CI checkpoint does not fulfil this target. Build log counted only 502 generated image records / 8,715,750 bytes (176 flags, 99 coats of arms, 227 portraits); no complete video/audio library or 4–5 GB installed content was verified. This remains a product gap, not a finished milestone.
- **Documentation synchronization commits:** `47b1c0553d57034518eb24998ac56f1295f3b257` (owner directive expanded); `b903da9aecb07db0336d15abef283d89c1979c06` (AI_START_HERE requirements); `3cf933fee708cbad3256fd5aca07a35fd71f89d9` (this handoff clarification); `540838e2ccedd9110178c52548e4ae2ab9cf00d0` (deduplicated full-read entry and corrected index numbering, [skip ci]). All four changes are documentation-only; no runtime, gameplay, asset, data, save schema or APK source was modified.
- **Push-triggered Android workflows:** because the repository's existing workflow runs on every push, documentation commits `7378a24`, `47b1c05`, `b903da9` and `3cf933f` triggered runs [44774687002](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44774687002), [44775490311](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44775490311), [44775559514](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44775559514) and [44775640449](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44775640449). At the last status query (20/11/2026 16:40 UTC), all four were `IN_PROGRESS`. They are incidental builds of an unchanged product codebase, not gameplay validation, full-content validation or physical-device QA. The corrective documentation commit `540838e` uses `[skip ci]`; no workflow configuration was changed. Re-check these runs before reporting final status.
- **Research starting points (official):** https://www.paradoxinteractive.com/games/victoria-3/about ; https://www.paradoxinteractive.com/games/victoria-3/add-ons ; https://www.paradoxinteractive.com/media/press-releases/press-release/volume-3-for-victoria-3-adds-3-significant-packs ; https://www.paradoxinteractive.com/games/victoria-3/news .

## ANDROID-LANDSCAPE-01 — latest exact test target and CI handoff (20/11/2026)

- **Current code/test target:** `d1623e7d38337b757a1907029f5b0bd85e4ad71d`. **Test blob:** `a343a6f2f555d160352dcc0318a5ec0b2b8993f1`. The corrected regex was fetched back from GitHub and verified byte-for-byte; launcher test asserts `.MainActivity`, `screenOrientation="landscape"`, MAIN and LAUNCHER intent filters.
- **Android manifest:** blob `293e3fed0cb82c8b0570c9115276711f5930ce2d`; the launcher activity now declares `android:screenOrientation="landscape"`. Source/UI viewport logic selects the already-existing landscape rail/window layout after rotation.
- **History:** first code commit `84ea62272ea7e865eff924ac745e2b50cfd268c3` introduced the orientation fix, but its initial test regex was over-escaped; Android run [44772252460](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772252460) failed at TypeScript compile (TS1161). The regex was corrected in `d7e9069c8471c9e7530cbe79f51309207d807a88`. A subsequent docs tree was inadvertently based on the earlier test blob; this was detected by refetching the file and corrected again in `d1623e7d38337b757a1907029f5b0bd85e4ad71d`. Do not use the failed 84ea or superseded d7 run as final CI evidence.
- **Exact-current-HEAD CI:** Android debug [44772973803](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772973803) was IN_PROGRESS; tests-only [44772973670](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772973670) was QUEUED at the time of this handoff. These are the only runs to use for final validation of this candidate.
- No APK from target `d1623e7` has yet been verified. No physical-device orientation check has been performed. This slice addresses launch orientation only; it is not a completed premium UI redesign or full Victoria 3 gameplay parity. S0/S1/S22 gate states remain unchanged.
- **Next action:** poll exact runs 44772973803 and 44772973670, inspect their logs/artifacts, then record test counts, Gradle result and APK SHA. If either fails, fix only the demonstrated issue and rerun on a new exact HEAD.


## Latest ANDROID-LANDSCAPE-01 checkpoint — landscape launch enforced; exact CI pending (20/11/2026)

- Owner correction: the primary Android gameplay experience must open in landscape. At base HEAD `0f61841288510fc5713e26dc29599c8fa93f4462`, `android/app/src/main/AndroidManifest.xml` did not declare `screenOrientation`; `src/ui/App.tsx` selects the portrait dock/sheet layout whenever viewport width <= height. This caused normal portrait launches to use the portrait UI.
- Implementation commit: `84ea62272ea7e865eff924ac745e2b50cfd268c3` adds `android:screenOrientation="landscape"` to the launcher `.MainActivity`. It also introduced `tests/android-orientation.test.ts` to assert the launcher activity, orientation and MAIN/LAUNCHER intent filter.
- Test-source correction: the initial regex was over-escaped; Android workflow [44772252460](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772252460) failed during `tsc --noEmit` with TS1161 (unterminated regular expression). This intermediate SHA is not a passing candidate. The corrected regex was committed as `d7e9069c8471c9e7530cbe79f51309207d807a88`; the exact test file blob is `a343a6f2f555d160352dcc0318a5ec0b2b8993f1`.
- Exact corrected-target workflows at the time of this checkpoint: tests-only [44772331109](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772331109) and Android debug [44772331108](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772331108), both checked out `d7e9069c8471c9e7530cbe79f51309207d807a88` and were still IN_PROGRESS. `npm ci`, generated data/map/content and web build had passed in Android job; test step was still running. No APK/result is claimed yet.
- No physical-device orientation verification has been performed. This slice enforces landscape at Android launcher level; it does not complete the broader Victoria 3-class UI redesign or gameplay parity. S0/S1/S22 gates and review states remain unchanged.
- Next action: poll only the two exact-target workflows above; if successful, record test counts, Gradle result, artifact ID and APK hash, then build the updated handoff. If failed, inspect logs and fix only the demonstrated failure.


## Latest S0-B4 / S0-B7 review handoff — baseline/current save-contract distinction (20/11/2026)

## Additional current-candidate G0.6 save-continuation evidence (20/11/2026)

- Candidate `96042077abeef8b89fe9e46fdce97a2b566d70da` (current schema v2) ran the four 24-month Historical/Sandbox × tick-6/tick-12 save/load cases in Android workflow [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668). Run `head_sha` is exactly 9604207; Android result: 44/44 suites, 131/131 tests, Gradle success. All four cases logged MATCH; Historical final hash `9933f1310849ea8126171e515276b0ba7319bcba49586c1bb2d22706b8cea1c1`; Sandbox final hash `1fdde5dc52f4e902d3b45cd284fbace48eb36f7678ea93e411f14bf85eb10564`.
- The test log's `baselineProductSha` field is a hard-coded comparison reference, not the current source SHA; use workflow `head_sha` for actual provenance. Baseline B4 run 44041104723 remains the frozen 2240a8f evidence; 44765197668 is current candidate v2 evidence.
- Missing RNG continues to throw TypeError on continuation and remains B4-R1. Reviewer must assess this exact candidate evidence; independent review and owner ACCEPTED remain pending; S1 remains NOT_STARTED.


- Frozen B4 baseline evidence remains exact and valid: product `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`; B4 test source `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`, blob `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`; tested HEAD `d2ae88e557e9895413462c5b069886bfc606adc7`; tests-only run [44041104723](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723), 6/6 files, 70/70 tests; four valid-save cases MATCH.
- Later current-save test delta: `14bd56848b8db429b9037880b08887af7118d61f` changes only the missing-envelope-state assertion to the current v2 validation error. Current test blob `e3d960725e1e1b41fc4f63d303a5b5d36cdb6ad7`; current save implementation blob `e54cce0397d25735540071b53d8291e30e332360`. Current exact-target CI on `9604207` (runs [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664), [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668)) passes 131/131 tests and validates the current v2 test contract, not the frozen baseline.
- Both review requests distinguish these contracts: `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md` and `docs/audit/s0/S0_B7_REVIEW_REQUEST.md`. Technical self-review details are in `S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md` and `S0_B7_RESULTS.md` §14.
- B4 remains READY_FOR_REVIEW; B7 remains READY_FOR_REVIEW. Claude independent verdict and owner ACCEPTED remain pending. S1 remains NOT_STARTED; G0.7 BLOCKED, G0.8 PARTIAL, full-S0 G0.9 BLOCKED. No runtime/gameplay/data/save changes authorized or made by this handoff update.

## Latest DEV-006 code/test target — exact CI_PASS / READY_FOR_REVIEW (9604207)

- Exact code/test review target: `96042077abeef8b89fe9e46fdce97a2b566d70da`; runtime source remains `e5eb5e4744b4c5569f7fe997c523cebe64ff3250`.
- Test-only change: `tests/controller-fast-forward.test.ts` (+32 lines). Five deterministic cases cover RAF pause/resume, overlap and player-action blocking, invalidation after `load()`, invalidation after `newGame()`, and thrown-step recovery.
- Tests-only workflow [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664) **SUCCESS** on exact target: 13/13 test files, 131/131 tests, 0 failed, 0 pending, 0 todo.
- Android debug workflow [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668) **SUCCESS** on exact target: 44/44 suites, 131/131 tests, `report_valid=true`, Gradle `BUILD SUCCESSFUL in 1m 28s`.
- APK: 18,052,461 bytes; SHA-256 `efde0291f9420fcd7ffbea4db9b1dc66ee4ad82b208bf946e76eaacb5ab12fd6`. APK artifact [14645545593](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668/artifacts/14645545593); ZIP size 17,564,620 bytes; ZIP SHA-256 `8890cdd38d7559faaf156f4946b47f9adf98dad96992654ffb3ca122d9b160df`. The ZIP digest is not the APK digest.
- Downloaded APK artifact ZIP and CI evidence ZIP were independently SHA-256 checked against GitHub. Evidence artifact [14646635377](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668/artifacts/14646635377), size 112,086 bytes; ZIP SHA-256 `702a8fcf6cb371fa89331604430746bb1f95158743a55bd13f300f5e7cef254c`.
- Android Debug certificate SHA-256 `919f750786571b8dcbf2d484e31bad9c35d50e9cfda09daaf053c9d7b6edbf38`; v1/v2 verification true; `apksigner_exit_code=0`. This is debug signing, not release signing.
- Independent Claude review PENDING; owner acceptance PENDING; physical Android QA NOT_TESTED; release signing NOT_PERFORMED. Monthly clock only; no daily tick, gameplay expansion or phase-gate change.

## Latest DEV-006 exact-target verification — CI_PASS / READY_FOR_REVIEW (1a1e10d)

- Exact code/test review target: `1a1e10d8aeb49d54058dddfe0a220a344125a12f`; runtime source implementation remains `e5eb5e4744b4c5569f7fe997c523cebe64ff3250`. The follow-up commit only adds the exception-recovery regression in `tests/controller-fast-forward.test.ts`.
- The four focused controller cases now cover RAF pause/resume, overlapping fast-forward/action blocking, stale async invalidation after load, and thrown-step recovery after the six-month yield.
- Tests-only [44763263753](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263753) SUCCESS: 13/13 files, 130/130 tests, zero failures/pending/todo.
- Android debug [44763263728](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263728) SUCCESS on exact target: 44/44 suites, 130/130 tests, Gradle `assembleDebug` success.
- APK: 18,052,461 bytes; SHA-256 `31f9553e9976f0c90898f41f7eed22fa595dd21a9beb8779577f810bc37107a9`; artifact [14643795730](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263728/artifacts/14643795730); ZIP SHA-256 `43f051e05aed0c19f8e8ecace86d5a9759b5218426b2e81d8ce4cda16e9404a9`.
- Debug certificate SHA-256 `3da135ad7744652c8fd80831914a5aa87ec9e8aa04842e64a69e9cd58b8a858f`; V1/V2 verified, apksigner exit 0. CI evidence artifact [14644310437](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263728/artifacts/14644310437), digest `15f2273c4249b0389c0c37c5eddbc51b37c9ac4ed46b3eeb4a7f179edba10480` (downloaded and digest-matched).
- Claude independent review PENDING; owner acceptance PENDING; physical Android QA NOT_TESTED; release signing NOT_PERFORMED. No daily tick, runtime cadence expansion or gate change.

## Latest DEV-006 test follow-up — exception-path regression added; CI pending 1a1e10d

- Runtime controller source remains at implementation `e5eb5e4744b4c5569f7fe997c523cebe64ff3250`; test-only follow-up commit `1a1e10d8aeb49d54058dddfe0a220a344125a12f` adds one failure-path case to `tests/controller-fast-forward.test.ts`.
- The new case advances six months, yields, throws on month seven, and asserts rejection, busy cleanup, restoration of the prior running state and RAF restart.
- Exact-target tests-only [44763263753](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263753) and Android debug [44763263728](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263728) were both `in_progress` at the last status fetch; results remain PENDING.
- DEV-006 review target is now `1a1e10d8aeb49d54058dddfe0a220a344125a12f`; independent Claude verdict PENDING; owner acceptance PENDING; physical Android QA NOT_TESTED. Monthly calendar unchanged; no daily tick or phase-gate change.

## Latest UI-REDESIGN-01 checkpoint — premium grand-strategy UI proposal (20/11/2026)

- Added `docs/spec/PREMIUM_GRAND_STRATEGY_UI_REDESIGN_PROPOSAL_VI.md` after inspecting App.tsx, theme.css and the World/Economy/Society/Politics/Tech/Diplomacy/Military screen structures at baseline a38749ba4f45bf8b05c3890874b10ac555905106.
- Finding: the project already has a custom map-first shell, typography and framed-window design; the main weakness is repetitive subsystem composition (metrics → generic sections/tables/key-value rows), weak causal/action hierarchy and insufficient domain-specific visual grammar.
- Proposal defines subsystem-specific command centers, global HUD/alerts, portrait/landscape behavior, historical identity fallbacks, typed component primitives, acceptance criteria and implementation sequence.
- Design only; no UI/runtime/assets/data/tests/Android changes. S0/S1/S22 gates unchanged.
- **Exact design-target CI:** workflow [44761419700](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44761419700) SUCCESS on `150bf857aac7dbc4905a14a932ec6157507325ed`; 44/44 suites, 129/129 tests, Gradle `assembleDebug` SUCCESS. APK artifact [14640599891](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44761419700/artifacts/14640599891), 18,052,470 bytes, APK SHA-256 `2a683948370ced167f814460cd21d1b357ad50d896b17e1266b767c9f3633ea6`; debug signing only. CI evidence artifact [14642660607](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44761419700/artifacts/14642660607).
- **Independent no-write design review request:** `docs/audit/s0/PREMIUM_GRAND_STRATEGY_UI_REDESIGN_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-20.md`; exact target commit `150bf857aac7dbc4905a14a932ec6157507325ed`, proposal blob `340b04e707794a1f146fe68642fd022e82f6d255`. Claude verdict PENDING. Review is limited to design quality/source accuracy; no UI implementation is authorized.

## Latest DEV-006 controller concurrency hardening — verified e5eb5e4744b4c5569f7fe997c523cebe64ff3250

- Source self-review: `docs/audit/s0/DEV006_FAST_FORWARD_CONCURRENCY_SELF_REVIEW_VI.md`. Found and fixed potential overlap between fastForward() and live RAF monthly stepping, plus stale async fast-forward continuing after load/newGame replaces the state.
- fastForward now validates positive safe-integer months, serializes against other busy work, pauses/stops RAF, preserves prior paused state, and uses operationToken + captured GameState identity to invalidate stale continuations. Player commands, manual step and pause toggle are blocked while busy.
- Added 3 deterministic controller tests in `tests/controller-fast-forward.test.ts`.
- Exact-target tests-only run 44759569097 PASS: 44 suites / 129 tests / 0 failures. Android debug run 44759568967 PASS.
- APK artifact 14640013380; 18,052,472 bytes; SHA-256 `365e9296b5d9d5b8dc63a0965e790bb407994056746b783440c857e58839285b`. ZIP SHA-256 `01d2fceaad3cc381f7c6bd80b79e7b8cc95e00e331185351681909188ca3c1f2`.
- Review request amended to exact code SHA `e5eb5e4744b4c5569f7fe997c523cebe64ff3250`. Independent Claude review and owner acceptance remain pending. Device QA NOT_TESTED. S0/S1/S22 gates unchanged.

## Latest IDENTITY-DISPLAY-01 checkpoint — historical identity asset coverage audit (20/11/2026)

- Audit: docs/audit/IDENTITY_ASSET_DISPLAY_COVERAGE_AUDIT_VI.md; baseline 77c03554ff11ffa587f5d25064a16b7cd8b8b650; source/asset coverage only, no implementation authorization.
- UI already renders flags, coats of arms and portraits when a matching period-valid asset exists; otherwise it intentionally falls back to generated emblems/monograms.
- Registry snapshot: 147 playable entities; 176 flag records, 99 arms records, 227 portraits for 473 historical character records. At 1836, period-valid flags cover 85/147 playable entities, arms cover 68/147, both cover 60/147.
- Current ruler portrait resolution is name-sensitive; stable character IDs are recommended. Content loader failure is not clearly differentiated from loading/asset absence in all UI states.
- Existing S0 asset audit says 492 image records have licences recorded but not reverified; do not add/repackage assets until rights and provenance are checked.
- No assets, source facts, UI/runtime/tests, generated DB, Android/build/signing files changed. No CI/device QA claimed. S0/S1/S22 gates unchanged.

## Latest TECH-START-01 checkpoint — country-specific starting technology audit (20/11/2026)

- Audit: `docs/audit/COUNTRY_SPECIFIC_TECHNOLOGY_STARTING_STATE_AUDIT_VI.md`; baseline `3ee40d4a66b403f05083846e9af106a13ebbc707`; status DESIGN/AUDIT ONLY, no runtime authorization.
- Verified current build assigns one of four broad tier bundles plus five country overrides. Registry has 181 entities; catalogue has 38 technologies; only 10/11 detailed polity files expose an explicit technology-level fact; 136 core profiles have no such field.
- Current research availability checks only prerequisites; global diffusion share is based on all living countries, not actual neighbor/trade relationships. Knowledge/adoption/domestic production/deployment are conflated.
- Initial tech/industrialization stage also affects seeded POP strata/buildings, so correcting tech requires reconciliation with starting economy and population.
- No historical facts or runtime data changed. S0/S1/S22 gates unchanged.

## Latest TIME-ARCH-01 code-grounded cadence audit (20/11/2026)

- Extended `docs/spec/DAILY_SIMULATION_CLOCK_CADENCE_ARCHITECTURE_PROPOSAL_VI.md` with §15 mapping the actual source functions, monthly fields, coefficients and thresholds to proposed daily/weekly/monthly/annual cadence. Source baseline `c5193894f5e2f344132a2334e1057d0b3a71f85a`.
- Critical constraints recorded: do not run `warMonth` daily; do not apply monthly economy/POP/politics/research coefficients daily; preserve January-boundary annual sample semantics unless owner changes it; migrate every monthly tick field by meaning rather than multiplying numeric fields globally.
- Identified global RNG ordering and save v2 calendar metadata as migration blockers. `fastForward()`/RAF concurrency is flagged for independent DEV-006 review; no current caller found in inspected App/Setup.
- Documentation-only. No runtime/test/data/assets/Android/workflow/signing changes; no phase/gate changes.

## Latest TIME-ARCH-01 checkpoint — daily calendar/cadence proposal (20/11/2026)

- Design document: `docs/spec/DAILY_SIMULATION_CLOCK_CADENCE_ARCHITECTURE_PROPOSAL_VI.md`; status DESIGN ONLY / PRE-IMPLEMENTATION, runtime authorization NONE.
- Proposal recommends hybrid daily calendar, event-driven/daily operations, weekly strategic evaluation, monthly economy/POP/politics/research settlement and annual sampling, subject to owner decisions.
- Explicitly records monthly-to-daily save migration, deterministic RNG, event ordering, Android performance and acceptance-test requirements.
- No runtime, tests, save schema, data, assets, Android, workflow, signing or gate changes. S0 remains PARTIAL/BLOCKED; S1 NOT_STARTED; S22 DESIGN_ONLY.
- Base HEAD: `88baaf9c076f615a721436da1fdba0a33d4b9326`. DEV-006 code review packet remains pending Claude no-write review.

## Latest DEV-006 checkpoint — monthly clock CI verified; Claude review packet ready (20/11/2026)

- Exact code target: `65bf85db91cbeaa276e00401e524749343ab305a`; exact CI: tests-only [44754295188](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295188) PASS (42/42 suites, 126/126 tests); Android debug [44754295107](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295107) SUCCESS.
- APK: 18,052,303 bytes; SHA-256 `b73eab755d53aabaae3192041296282343b1a442236232bb147d794e31de37fa`; artifact ID `14636409648`; debug signer only. Device QA NOT_TESTED.
- Independent no-write review request: `docs/audit/s0/DEV006_MONTHLY_CLOCK_CLAUDE_REVIEW_REQUEST_2026-11-20.md`. Claude verdict and owner acceptance are PENDING. Monthly tick only; no daily-tick conversion.
- Current branch HEAD before this documentation checkpoint: `ce6d17453bed0cce354b49bf85146451d7c1bf61`. This is documentation/review preparation only; no runtime or gate status changes.

## Latest benchmark-alternative checkpoint — MPD 2023 / GGDC HNA (19/11/2026)

- MPD 2023: official CC BY 4.0 metadata verified; 169 countries through 2022, country and aggregate-region series. Required Bolt & van Zanden (2024) dataset citation and source-sheet original-paper citations in specified cases are recorded. Official Excel download currently blocked at Dataverse→SURF signed object redirect; no row-level coverage/hash audit is claimed.
- Maddison Database 2010: the official legacy release page shows population/GDP/GDPpc from AD 1–2008 but no explicit licence statement. Its checked-in repository inputs require separate rights review; do not infer a licence from the 2023 release.
- GGDC Historical National Accounts: sectoral GDP/industry, selected national series, World Agriculture 1800–1938 and All Countries overview ca.1870–2005. Attribution source is identified, but no data reuse licence was found on the official datahub page; rights remain unresolved.
- Source candidate CSV, BEN-02, BEN-12, BEN-13, benchmark review, README and rolling report are updated. No data values/runtime/ETL imported or changed. MPD remains preferred pending official-file audit; HNA supplementary only after rights clearance.
- S1/S22/S23 remain closed; DEV-005 Claude review and owner acceptance remain pending.

## Latest research-rights checkpoint — CoW NMC v7 (19/11/2026)

- Official NMC v7 documentation confirms annual state-system series for six indicators from 1816–2022 and cautions that data quality/quantity vary by state/year and cross-time comparability differs across components.
- CoW Terms & Conditions prohibit commercial activity/financial-profit use and third-party redistribution without written permission of the CoW director and data host; other dissemination/posting/use also requires permission. Therefore `cow_nmc_v7` is `RIGHTS_REVIEW_REQUIRED`, not cleared for the game or offline data packs.
- Research audit only: no NMC v7 ZIP/data values downloaded, copied, transformed or imported. Coverage report, candidate CSV, BEN-01 and README now carry the rights gate.
- Product data-pack flow remains a documented requirement, not implemented or device-verified. S23 remains closed. DEV-005 code target and its exact CI evidence are unchanged; Claude verdict and owner acceptance remain pending.

## Latest DEV-005 review-preparation checkpoint (19/11/2026)

- **Rolling progress report + summary table:** `docs/audit/s0/S22_CONTINUOUS_PROGRESS_REPORT_VI.md`. The top section `BẢNG TÓM TẮT TRẠNG THÁI HIỆN TẠI` is the fast handover view; sections `0.8–0.9` record the latest research-rights and benchmark-alternative checkpoints; DEV-005 review history follows. Continue appending to this existing rolling report; do not create duplicate standalone reports unless a distinct scope requires one.

- Code/test target remains `c9868d7131d7de3fd8efd0263411fee9111f172c`; exact-target CI remains tests-only 122/122 PASS and Android debug build SUCCESS (run IDs `44540766509` and `44540766545`). No runtime source/test changes were made in the documentation follow-up.
- Review packet corrected: `tests/population-cohorts.test.ts` contains 13 focused cases; base-to-target compare is 24 paths (7 DEV-005 code/test + 17 concurrent governance/reporting paths).
- Collaboration protocol Purpose roles now match the owner-directed allocation: ChatGPT technical lead/authorized implementer; Claude independent no-write reviewer. This resolves contradictory stale role labels in that file.
- Additional state-flow note: legacy international migration changes regional POP totals but does not transfer migrant-origin stratum composition; the projection uses destination Region strata. This is explicitly recorded as an inherited limitation, not cohort-level migration.
- Pre-handoff compare from code target `c9868d7131d7de3fd8efd0263411fee9111f172c` to documentation HEAD `7e4fe869948b2f34fb791394a4d93159fff4b411` was re-fetched and confirmed exactly four changed paths, all documentation-only. No gameplay, historical data, assets, Android, Gradle, signing or workflow files changed.
- DEV-005 remains `CI_PASS / READY_FOR_REVIEW`; Claude independent verdict and owner acceptance are PENDING. Physical iQOO QA remains NOT_TESTED. No S0 PASS or S1/S23 opening is claimed.

---

- **Mandatory session/network recovery procedure (19/11/2026):** `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md`. Required for every new session and whenever chat responses, network, GitHub API or write outcomes are interrupted/ambiguous. Verify HEAD/commits/files/CI before retry; never duplicate writes or claim uncommitted work persisted.

- **Mandatory root entrypoint for every new AI/session (19/11/2026):** `AI_START_HERE.md` at repository root. It contains the detailed product target and subsystem-by-subsystem brief; read it first, then follow `AGENTS.md` / `CLAUDE.md`, this handoff, the collaboration protocol, owner principles, approved roadmap and task-specific spec. `README.md` links to it prominently.

# AI Handoff — Victori3-mobile

> Shared status index for Claude Code, ChatGPT, and the project owner. Never put secrets or personal data here.

- **Owner delegated execution and offline-data directive (19/11/2026):** `docs/coordination/OWNER_EXECUTION_DIRECTIVE_2026-11-19.md`. The owner delegated routine technical execution/coordination to ChatGPT under the existing roadmap and review gates. Target delivery is an Android base APK followed by explicit user-opt-in, verified offline data/content packs; the latest owner clarification sets approximately **4–5 GB as the complete installed game's full-content footprint** (gameplay/history/map data plus high-quality image, video and audio media), not a data allowance or a target to keep the app tiny. Compressed download size, expanded full-game storage, staging and runtime memory must be measured separately. Historical data must retain provenance, temporal/geographic coverage, method, uncertainty and license. This directive does not waive S0 gates, independent review, device QA, licensing or formal phase acceptance.

- **User-facing delivery flow reminder:** install the base APK first; on first launch, present the required/optional game data packs and their download/expanded sizes; the player explicitly starts downloads in-app; verify manifest/signature and per-file SHA-256; stage then activate safely; after required packs are installed, Historical/Sandbox campaign, simulation, map, full required media and save/load must operate offline. Do not silently download or switch to mobile data. This is a product requirement, **not yet implemented or device-verified**. The current target is approximately 4–5 GB of actual full-game content installed across the APK and activated packs; it is not one monolithic APK or a RAM target.

- **Standing owner product/engineering principles (19/11/2026):** `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`. This is the durable product direction for Victoria 3-class global systemic parity, source-backed research, landscape-first Android APK, explicit downloadable content packs, offline-first operation, measured performance/stability, and per-slice GitHub reports. It does not bypass roadmap/gates or independently authorize closed phases. Read this before every task.

## Latest verified checkpoint — DEV-005 tolerance correction and independent-review preparation (19/11/2026)

- DEV-005 remains a bounded, owner-authorized population-cohort projection/save-compatibility task. `Region.pop` and `Region.strata` remain authoritative; the slice is not full POP parity and does not open S7–S23.
- ChatGPT self-audit found and corrected a scale-dependent consistency defect: accepted regional strata rounding could create cohort mass that failed the tighter save invariant on a large region. Creation now normalizes accepted shares before multiplying by POP.
- Correction commits: source `816d077e07c9e41e0784bbd6d69bdddeec7f2490`; regression `0c171b9b615e4f91cce66749f8482837c8dfa9ef` (1,000,000,000 regional POP; tolerated 5e-8 share drift; serializer must accept and conserve mass).
- **Previous corrected code/test target:** `0c171b9b615e4f91cce66749f8482837c8dfa9ef` (119/119 tests and debug APK passed; superseded by malformed-save hardening).\n- Further hardening rejects null/non-object Region/cohort records and non-object save envelopes. v1 migration now requires valid Region data and validates the complete v2 projection before returning. Exact current code/test target: `c9868d7131d7de3fd8efd0263411fee9111f172c`. Previous target CI: tests-only [44534672142](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44534672142) PASS 119/119; Android debug [44534672171](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44534672171) SUCCESS. These runs do not validate the later malformed-save migration changes. APK 18,052,034 bytes; file SHA-256 `7a3c48b9761878111263c97fe39ca3fbad4026f82babb08bf78801b92174a528`; debug signer certificate SHA-256 `167f48e563b68c4aa12470941204b43936a8b218eccb54bc598738d52479bb7e`; artifact ID [14536836052](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44534672171/artifacts/14536836052), ZIP SHA-256 `0c761f7c47db189aa196d1c59b805b981394db7a95313e13e3c6e247afc38d82` (not the APK hash).
- **ChatGPT technical self-audit (not independent review):** `docs/audit/s0/DEV005_POPULATION_COHORTS_TECHNICAL_SELF_AUDIT_2026-11-19.md`. It records scope, state-flow scan, save migration observations, deviations (fractional person-equivalent size; no separate engine/data-build hash), no physical-device evidence and the CI state.
- **Claude independent review packet:** `docs/audit/s0/DEV005_POPULATION_COHORTS_CLAUDE_REVIEW_REQUEST_2026-11-19.md` points to exact code target `c9868d7131d7de3fd8efd0263411fee9111f172c`, lists all seven DEV-005 code/test paths, and discloses the full 24-path base-to-target compare (7 code/test + 17 governance/reporting paths).
- DEV-005 is `CI_PASS / READY_FOR_REVIEW`; tests-only on c9868d7 passed 11/11 files and 122/122 tests. Android debug run [44540766545](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44540766545) succeeded. APK 18,052,144 bytes; file SHA-256 `85e49cc530ce2e382c6af8575f04c2ee631a0be20fb32f841297bb37e17ee08e`; debug signer certificate SHA-256 `73a3c9a7f7e2ef2d489d37a5fb386d7d138f741f9c3dffcdb32fb886de9c27ad`; V1/V2 true; `apksigner_exit_code=0`; artifact ID [14538597513](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44540766545/artifacts/14538597513), ZIP SHA-256 `c34ae04acab4558e96cba69d5333bd63953471ddff064410fbda2962a249238a`. Independent Claude review and owner acceptance remain pending. Physical iQOO QA remains NOT_TESTED. No claim of S0 PASS, S1 acceptance or S7–S23 authorization.

## Latest verified checkpoint — R15 owner target and B7 review preparation (19/11/2026)

- The latest owner clarification makes **approximately 4–5 GB the target expanded footprint of the complete installed game**, including the base APK, meaningful gameplay/history/map data, and the full required high-quality media library across verified packs. Do not pad files or sacrifice image/video/audio quality merely to reduce size. Keep compressed download, expanded installed footprint, temporary staging and peak runtime/decoded memory as separate measured budgets. This clarification supersedes the earlier 3–4 GB target and any reading of 4–5 GB as only an allowance.
- The owner requires explicit user action before optional data downloads. For Google Play PAD, optional large packs must therefore use **on-demand**; do not use fast-follow because it starts automatically after installation. Keep install-time content to the minimum bootstrap. Sideload delivery must use an explicit in-app download/import action.
- Official references rechecked 19/11/2026: Google Play size limits (base 500 MB; individual asset pack 1.5 GB; install-time aggregate 4 GB; fast-follow + on-demand aggregate 30 GB; total compressed download 34 GB; up to 100 packs) and Play Asset Delivery delivery modes. See the current R15 references in `S0_B7_RESULTS.md` §13.5.
- Current R15 and review materials: `docs/audit/s0/S0_RISK_REGISTER.md`, `S0_SIGNOFF.md`, `S0_B7_RESULTS.md` §§13–13.5, `S0_B7_PACKAGE_SUMMARY_VI.md`, and `S0_B7_REVIEW_REQUEST.md`. The review request explicitly includes the owner directive and the opt-in/on-demand rule.
- **B7 remains READY_FOR_REVIEW, not REVIEW_PASS or ACCEPTED.** Claude's no-write independent review remains pending. S0 remains PARTIAL/BLOCKED (G0.7 BLOCKED, G0.8 PARTIAL, full-S0 G0.9 BLOCKED); S1 and S23 remain NOT_STARTED. This update does not open either phase.
- The final documentation/R15 package was revalidated at pre-handoff HEAD `8e4fd38dadb8b6a6e259517900f38590a6b85c62`. GitHub compare from the previous owner-delegation checkpoint `e785482da69e0a47afecbb91bc1ec4af47ece686` shows exactly seven changed paths, all under `docs/audit/s0/**` or `docs/coordination/**`; no runtime, historical product data, asset, Android/Gradle, workflow, signing, save implementation/schema or APK was changed. The exact HEAD has no associated workflow run/status; documentation commits use `[skip ci]`. No runtime tests are claimed for these report-only changes.

## Active AI role allocation — owner directive 2026-11-17

- **ChatGPT — technical lead/coordinator:** inspects the repository, controls scope, reviews architecture/algorithms, implements owner-authorized changes, writes/runs tests, verifies CI/logs, commits authorized work, and maintains documentation/handoff. ChatGPT self-audits must be labelled; they are not independent REVIEW_PASS.
- **Claude Code — independent reviewer:** reviews the exact HEAD and evidence for work ChatGPT or another agent implemented, does not modify the reviewed change set during review, and returns REVIEW_PASS or CHANGES_REQUESTED with evidence. Claude qualifies as independent only if it did not author/modify the target work.
- **Gemini Hydrogen — research/content support:** researches history, countries, people, events, geography, maps, images, provenance, licensing and specialist documents; deliverables must include sources, dates, methods and uncertainty.
- **DeepSeek — fallback reviewer:** may replace Claude when Claude is unavailable/out of quota only when the owner assigns it and DeepSeek did not author/modify the reviewed change set.
- **Project owner:** retains authority over scope, product decisions, acceptance and phase transitions.

This allocation supersedes the earlier default ChatGPT/Claude role assignment for subsequent tasks. Historical B3 review records and previous decisions remain unchanged. See docs/coordination/AI_COLLABORATION_PROTOCOL.md.

- **Victoria 3 parity re-audit (ChatGPT self-audit, 19/11/2026):** `docs/audit/VICTORIA3_PARITY_REAUDIT_2026-11-19.md` (audit HEAD `b18f0213ad4958ec95ff292d63ad661d010cffb1`; documentation commit `7defe399787eb1c919d285ad7e64c8657a7484f8`). Reconciles the 18/11 41-area parity snapshot with current construction queues and regional employment/wage aggregates; identifies remaining P0/P1/P2 gaps. No runtime patch or phase authorization; do not treat this self-audit as Claude REVIEW_PASS or owner acceptance.

## Owner authorization — DEV-005 (19/11/2026)

- The project owner explicitly instructed ChatGPT to proceed with DEV-005 and granted implementation authority for this bounded population-cohort foundation, including the save-contract and migration work required by it.
- Exact scope and evidence are recorded in `docs/audit/s0/DEV005_POPULATION_COHORTS_CLAUDE_REVIEW_REQUEST_2026-11-19.md`.
- This bounded authorization does **not** alter S0 gate verdicts, mark S0 accepted, accept the complete S1 phase, open S7–S23, approve unverified historical seed data, or waive Claude's independent review.

## Active DEV-005 review entry point

- **DEV-005 — Population cohort foundation:** `docs/audit/s0/DEV005_POPULATION_COHORTS_CLAUDE_REVIEW_REQUEST_2026-11-19.md`.
- **Exact current corrective code review HEAD:** `c9868d7131d7de3fd8efd0263411fee9111f172c` (all earlier corrections plus malformed record/envelope rejection and fail-closed v1 Region migration with post-migration validation). Exact-target CI is recorded in the latest checkpoint above.
- **Previous verified baseline CI (HEAD `1cf7869` only):** tests-only [44499872965](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44499872965) PASS, 11/11 suites and 115/115 tests; Android debug [44499872833](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44499872833) SUCCESS. These results do **not** validate the later corrective commits.
- **Intermediate corrective CI:** tests-only [44508941178](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44508941178) PASS (11/11 files, 116/116 tests) for d4cd28a.
- **Intermediate 24ae CI:** Android debug [44509983834](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44509983834) failed at TypeScript strict deletion (TS2790) in a test fixture; corrected in `75ad843` with an optional-property fixture type.
- **Intermediate 75ad Android build:** [44510279681](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44510279681) failed at TS1434 due to a multiline test type assertion; corrected by `36e5f64` and `b4620a5`.
- **Intermediate b462 test result:** [44510529456](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44510529456) failed 1/118 because an old test expected TypeError instead of the new explicit missing-state validation error; corrected in `14bd568`.
- **Verified corrective HEAD CI (exact code HEAD `14bd56848b8db429b9037880b08887af7118d61f`):** tests-only [44511298764](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511298764) — SUCCESS, 118/118 tests; Android debug [44511298947](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511298947) — SUCCESS, `assembleDebug`, checksum and signature verification. Artifact ID `14523552323` (17,564,233 bytes; artifact digest `ed2c5704aedfcc39ec0da2f8ddf9fa52ff05eef46ad0006356b9136a3c9f9c1c`).
- **Latest branch-tip confirmation:** docs-only HEAD `3ff6b3af883ce685f8438c24eb7a3c050b547155` passed Android debug run [44511435508](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511435508), including 118/118 tests and APK build. Artifact ID `14522638832` (17,564,282 bytes; artifact digest `d222d921b5a06ba0b450acd7297b867e875fda220aff4ea22323768d691b9354`). The later commits through current HEAD `485b43d` are protocol/documentation-only; no runtime or test source changes.
- **Next action:** Claude independent no-write review of exact corrected code SHA `c9868d7131d7de3fd8efd0263411fee9111f172c` using the updated review request and self-audit. Verdict remains pending; physical-device QA also remains NOT_TESTED.

## Current independent review entry point

- **DEV-005 / Claude — population cohort foundation:** review `docs/audit/s0/DEV005_POPULATION_COHORTS_CLAUDE_REVIEW_REQUEST_2026-11-19.md` against exact corrected code HEAD `c9868d7131d7de3fd8efd0263411fee9111f172c`; the current target has 122/122 tests and a successful Android debug build. Re-fetch the current branch tip and compare before review; verdict pending.
- **R4e / Claude — final collective/aggregate succession queue review:** start with `docs/audit/s0/GLOBAL_R4E_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`. R4e covers MAO (collective rangatira authority) and MLY (multiple Malay constituent polities); base SHA before R4e: `103ab66b227809fae358e082fa253c0e50a1f78c`. Fetch the exact latest branch HEAD before review.
- **R4e package:** `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/README_VI.md`; 2-entity evidence matrix, 19 non-executing decisions, 12 open evidence requests and 20 source records. Integration receipt: `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/GITHUB_INTEGRATION_RECEIPT_R4e.md`.
- **S20–S21 military organization/operations/logistics pre-design:** `docs/spec/MILITARY_ORGANIZATION_OPERATIONS_LOGISTICS_PROPOSAL_VI.md` (design commit `a82d59bcc01e6a57163f7acedd4930132f0767f5`). Includes force organization, LegacyForcePool safety, unit/formation, supply, movement, fronts, combat, sieges, occupation, navy and convoy. Design only; S20/S21 remain closed.
- **S20–S21 / Claude independent design review:** `docs/audit/s0/MILITARY_ORGANIZATION_OPERATIONS_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (request commit `109c7c30397e92d4151228605c24a9ab05415f1e`). No-write review; no implementation authorization.
- **S23a–S23c mobile UI/content packs/release QA pre-design:** docs/spec/MOBILE_UI_CONTENT_PACKS_RELEASE_ARCHITECTURE_PROPOSAL_VI.md (design commit e3a983b16717b18c755d74a1747e36e12ab27637). Covers integrated landscape/portrait UI, command-boundary/accessibility, signed multi-pack manifests, explicit offline/online consent, verified resume and atomic rollback, and physical Android QA/device budgets. Design only; S23 remains closed.
- **S23 / Claude independent design review:** docs/audit/s0/MOBILE_UI_CONTENT_PACKS_RELEASE_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md (request commit 2d6d34784ba12a91c49a2b3d6c0cbf6a00f9d6bf). No-write review; no implementation authorization.
- **S22 Historical Events and Global Calibration pre-design:** docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md (design commit df74ed35cbdb4161b531c9199bee1931e347f6c9 / blob f0b326823c76a01c353ab30ef72ee550a3aae990; §§14.1–14.15). S22 remains DESIGN_ONLY; no runtime authorization. Rolling report decision/evidence register updated in commit d9544d7f610b7b3c5077fad3f90e29cb90766ac6 (blob 6750c4b13c8b0344f4ff03a74d33a5ca5a1464c1); proposed OD-S22-01–OD-S22-08 labels are tracking aids only, not owner approvals. Claude no-write verdict remains pending.
- **S22 / Claude independent design review:** request latest commit 5eb49c5ab6f8441bfbd75c6dea4b868d6469df4f, blob fc5565ce5e4ac556efafd3f6d1965006a589b5a6; exact target design blob f0b326823c76a01c353ab30ef72ee550a3aae990, supporting code audit 8cf4fa017f321b1ca402da1117dc9c314b2faae7, traceability d50eac10872e57c406a62d6dee48971fd1bf3cee, test matrix 8e6b518a637a954fc0c9a4f80b9c22c33c594704, benchmark review d2d510f0f362da872b44f4f99515722cc4246d0a, entity matrix 9dd62fca2dad926f58fd52112c349a3d7fb3723d, and Maddison unit matrix f714e11a0ce7c8fe04f256035989d86c93b69c16. Review covers SA-01–SA-13 and §§14.1–14.15. Claude verdict pending; no implementation authorization.
- **Events and global calibration research / Gemini Hydrogen:** request latest update commit f7acf811b2bde6a1bca2f914fc73f09ac4e4d36a. It now requests independent event source review and CoW/MPD/HFS benchmark source audit, including verification of the 181×6 missingness matrix, geographic crosswalk and rights. Research-only; no product patch.
- **S22 benchmark coverage audit / ChatGPT:** `docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_AND_CALIBRATION/BENCHMARK_COVERAGE_REVIEW_VI.md` (updated in this slice), per-field inventory `BENCHMARK_FIELD_COVERAGE.csv`, 181×6 CoW entity-metric matrix (1,086 rows; 764 explicit missing), `MADDISON_2010_UNIT_COVERAGE.csv` (160 rows), source candidates and open requests. CoW NMC v7 remains `RIGHTS_REVIEW_REQUIRED`. MPD 2023 has official CC BY 4.0 metadata and is the preferred macro candidate, but official Excel file retrieval is blocked by Dataverse→SURF signed-object redirect; no row-level audit or file hash is claimed. Existing Maddison 2010 inputs are a separate rights issue because its official page inspected does not display a licence; do not inherit MPD 2023 terms. GGDC Historical National Accounts has valuable sectoral-output/World Agriculture coverage, but the official datahub page does not state a reuse licence; `RIGHTS_REVIEW_REQUIRED`. HFS remains rights-restricted. BEN-02 is `PARTIAL_METADATA_VERIFIED_DATA_ACCESS_BLOCKED`; BEN-12 (GGDC HNA rights) and BEN-13 (Maddison 2010 legacy rights) are open. Research-only; no data imported.
- **S18–S19 diplomacy/strategic AI pre-design:** `docs/spec/DIPLOMACY_STRATEGIC_AI_ARCHITECTURE_PROPOSAL_VI.md` (design commit `8f01556bd70fed05be6f880f287a0f3691cd7674`). Adds international actor/autonomy, treaty terms, diplomatic play/crisis, negotiation and explainable bounded strategic AI. Design only; S18/S19 remain closed.
- **S18–S19 / Claude independent design review:** `docs/audit/s0/DIPLOMACY_STRATEGIC_AI_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (request commit `661eaa7ef43ba176d3d42f6aabfa36dd122d6abb`). No-write review; no implementation authorization.
- **Military organization/logistics research / Gemini Hydrogen:** `docs/research/GLOBAL_HISTORICAL_1836_1936/MILITARY_ORGANIZATION_LOGISTICS_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (request commit `5d6d24bf6d8cd934a9e18159dacc7da32ca6049c`). All-world candidate evidence only; no unit data integration or runtime authorization.
- **S15–S17 local government, characters and political institutions pre-design:** `docs/spec/GOVERNANCE_CHARACTERS_POLITICS_ARCHITECTURE_PROPOSAL_VI.md` (design commit `207722d612354f4d1bccc74064d24616efa4511a`). Separates local authority/service access and urban capacity (S15), historical/generated characters and appointments/succession (S16), and institution-specific lawmaking/organizations/movements (S17). Design only; these phases remain closed.
- **S15–S17 / Claude independent design review:** `docs/audit/s0/GOVERNANCE_CHARACTERS_POLITICS_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (request commit `f81b6c929dc93b4b69414d25301bd3a15df51b6e`). No-write review against code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`; no implementation authorization.
- **Governance and institution research / Gemini Hydrogen:** `docs/research/GLOBAL_HISTORICAL_1836_1936/GOVERNANCE_INSTITUTIONS_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (request commit `907e7c781cc544d91d2175fba6f06fa419487b0f`). All-world, 1836–1936 evidence candidates only; collective authorities, local administration, offices/succession, laws, political organizations and movements; no runtime data changes.
- **S10–S11 BuildingType/ProductionMethod/BuildingSite pre-design:** `docs/spec/BUILDING_TYPES_PRODUCTION_METHODS_SITES_PROPOSAL_VI.md` (design commit `b1fa6abdeb3609c8acc31206405c05a0ee90898b`). Uses owner-approved sparse BuildingSite identity, level-status and PM split/merge rules; labels current region-level building counts as legacy aggregates, not historical facility records. Design only; S10/S11 remain closed.
- **S10–S11 / Claude independent review:** `docs/audit/s0/BUILDING_TYPES_SITES_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (request commit `4d1f058020651b128dd8d0a7e889944e9684db46`). No-write review against code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`; no implementation authorization.
- **S7–S8 goods/markets/transport pre-design:** `docs/spec/GOODS_MARKETS_TRANSPORT_ARCHITECTURE_PROPOSAL_VI.md` (design revision `98a9aef1356f73004a78590eb45d63321b4b0ee2`). Documents the current material-accounting mismatch, Goods Registry and monthly stock-flow conservation (S7), then temporal transport graph, capacity-constrained shipments and goods-specific market access (S8). Design only; S7/S8 remain closed.
- **S7–S8 / Claude independent design review:** `docs/audit/s0/GOODS_MARKETS_TRANSPORT_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (request revision `77449b1de2c17e739b97bb4857a85d7e6cf44ede`). No-write review against code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`; does not authorize implementation.
- **P0 engineering pre-design — Population Cohorts:** `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md` (design revision `b35c5367cfe41bea3036bec2b846d19060f495c0`). ChatGPT self-audit clarified age distribution vs cohort identity, canonical tuple IDs, integer population mass and unknown-vs-unaffiliated religion. Still design-only; no runtime authorization.
- **Population seed research — Gemini Hydrogen:** `docs/research/GLOBAL_HISTORICAL_1836_1936/POPULATION_COHORT_SEED_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (request commit `c17dc2a9031a6ca8cf4d19cf86391073154725ca`). All-world, c.1836, source-backed candidate data only; no runtime data patch or implementation authorization.
- **Population Cohorts — Claude independent design review:** start with `docs/audit/s0/POPULATION_COHORTS_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (request commit `c972b1b3844943e5df2f433936c8c21bb4fb464e`). No-write review of the design only; review target design commit `b35c5367cfe41bea3036bec2b846d19060f495c0`, code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`. This does not substitute for S0-B7 review/owner acceptance and does not open S1.
- **R4d / Claude — previous global succession + V3 parity review:** `docs/audit/s0/GLOBAL_R4D_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` remains open for the final 15 missing-profile cases and the requested 41-area Victoria 3 feature-parity audit. Base SHA: `f0745f1fd1eb381434cba4aa8576b3c2271d8732`.
- **R4d package:** `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/README_VI.md`; 15-polity audit, 26 non-executing decisions, 17 open evidence requests and 34 source entries. Feature parity files: `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md` and `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv`. R4d integration receipt: `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/GITHUB_INTEGRATION_RECEIPT_R4d.md`.
- **R4c / Claude:** `docs/audit/s0/GLOBAL_R4C_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` remains open for 15 previous profiles.
- **R4b / Claude:** `docs/audit/s0/GLOBAL_R4B_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` remains open for 15 previous profiles.
- **R4a / Claude:** `docs/audit/s0/GLOBAL_R4A_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` remains open for the first priority dossier and missing-profile triage.
- **GLOBAL Historical Mode / Claude — baseline review:** `docs/audit/s0/GLOBAL_HISTORICAL_MODE_CLAUDE_REVIEW_REQUEST_2026-11-18.md` remains open. It covers the global fidelity standard, 181-entity coverage baseline and current engine/data audit.
- **GLOBAL Historical Mode artifacts:** `docs/spec/GLOBAL_HISTORICAL_MODE_FIDELITY_STANDARD_VI.md`; `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`; `docs/audit/GLOBAL_HISTORICAL_SUCCESSION_COVERAGE_1836.csv`.
- **Owner direction 2026-11-18:** all-world scope; Historical Mode requires source-backed historical accuracy and temporal consistency for 1836–1936 without railroading outcomes; Sandbox may develop alternate history after start. Latest owner gameplay direction: pursue Victoria 3-like system depth in all major areas while using independent code/data/assets and Android-adapted presentation.
- **H01 R3af / Claude:** `docs/audit/s0/H01_R3AF_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` remains an earlier regional research package for Shewa, Zulu and Basotho.
- Fetch latest branch HEAD before every review. All ChatGPT self-audits are labelled and are not independent `REVIEW_PASS`. R4e and R4d reviews are no-write; neither authorizes runtime/game-data/schema/engine changes or S1.

## 1. Current project state

| Field | Value |
|---|---|
| Repository | `mtieu6470-maker/Victori3-mobile` |
| Development branch observed | `claude/game-historical-sandbox-modes-kg7rj7`; latest code/test target `96042077abeef8b89fe9e46fdce97a2b566d70da`; latest verified documentation HEAD before this review-reconciliation update `638f9d82e477807925d045d1c859d9fa0f10b017`. Re-fetch branch HEAD before the next task |
| Last independently observed baseline | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` (code baseline; later commits listed below are documentation-only) |
| Coordination setup commit | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Coordination correction commit | `6c4d02a36a30f7e82d973da59f569b379f85468d` |
| Handoff update commit | Identified by GitHub commit metadata: the commit that introduced this revision of this file (`git log -1 -- docs/coordination/AI_HANDOFF.md`). Not written here, because a commit cannot contain its own SHA |
| Canonical roadmap | `OWNER_APPROVED` (2026-11-16, OD-20261116-09): `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` with `docs/roadmap/SOURCE_REGISTER.v3.2.md`, committed verbatim in `574ddc7ac57267ecae2216cb9ee1d490f3b41626`. SHA-256 verified before and after commit: `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` / `1adc4fedb4311383723631fbe16ceaa92b54344223bda0f93ee2d8c8e06737a2`. The file's own header still says "S0 vẫn chờ phê duyệt" because it is the verbatim pre-approval text; the approval is recorded here |
| S0 v3.3 amendment | `OWNER_APPROVED` with amendments (2026-11-16, OD-20261116-11): `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` (SHA-256 `929c06f4b993a6c395d3633bcb8b207554c833d023debe073cb5252f51929cf5`) as amended by `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` (SHA-256 `582a8a4e3f0275f5b88debf8b90967c84c077684c104540fc6a5e961847267b6`); sources in `docs/roadmap/SOURCE_REGISTER.v3.3.md`. v3.2 stays canonical except the clauses v3.3 replaces. Both files are verbatim, so their headers still carry draft wording |
| G0.4 requirement source | `docs/spec/MASTER_SPEC_VI.md` — byte-for-byte copy, SHA-256 `d7fa8995dee96046da79d23dd16b2c56c2e0acd0330b28e05d8a0a3ff6afc2f8`, 50 355 bytes, 753 lines; normative §§0–17 (OD-20261116-11 §4) |
| Gate verdict vocabulary | Protocol "Status vocabulary" (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`); where the approved S0 document writes "NOT TESTED" it means `NOT_TESTED` |
| Legacy roadmaps and pre-protocol work | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (historical evidence, not authorization) |
| Current approved phase | S0-B3 → S0-B4 → S0-B7, sequential under OD-20261116-11. B3 has ChatGPT REVIEW_PASS; B4 corrected test source has passing tests-only CI (70/70, 6/6) and remains READY_FOR_REVIEW pending genuine second-party review; B7 risk register, gate ledger, signoff proposal, results and independent-review request are prepared and READY_FOR_REVIEW. S1 remains closed. |
| Current task status | S0-B3 REVIEW_PASS (bounded audit scope only). S0-B4 READY_FOR_REVIEW: B4-SA-01/02 corrected in test source ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad; tests-only CI run 44041104723 passed 70/70 tests across 6/6 suites, four valid-save continuation cases MATCH; independent Claude review and owner acceptance remain pending. S0-B7 READY_FOR_REVIEW: evidence-linked risk register, G0.1–G0.9 ledger, bounded S1-entry signoff proposal, B7 results, independent-review request and consolidated Vietnamese package summary are committed; independent review and owner decision are pending. S1 remains NOT_STARTED until the complete bounded package receives REVIEW_PASS and a separate owner ACCEPTED. S0-A READY_FOR_REVIEW (A1–A4 evidenced, A5 BLOCKED); S0-A not ACCEPTED. S0-B1 technical verdict PASS. |
| Latest verified development HEAD before this review-reconciliation update | `638f9d82e477807925d045d1c859d9fa0f10b017`; this documentation-only update is based on that exact HEAD |
| S22 current state | `DESIGN_ONLY / PRE-IMPLEMENTATION`; design §§14.1–14.15; code self-audit SA-01–SA-13; traceability present; test specification includes GEO-01–GEO-10 and BEN-11–BEN-18; no S22 runtime authorization |
| S22 independent review | Claude no-write request latest commit `5eb49c5ab6f8441bfbd75c6dea4b868d6469df4f`, blob `fc5565ce5e4ac556efafd3f6d1965006a589b5a6`; verdict pending |
| S22 implementation blockers | Canonical 12-macro-region taxonomy/boundaries need owner decision; benchmark/event research needs independent source review; design-level proposed parameters need owner approval; S1/S22 runtime gate remains closed |
| Current S0 gate ledger | G0.1–G0.6 PASS; G0.7 BLOCKED; G0.8 PARTIAL; full-S0 G0.9 BLOCKED. S0_SIGNOFF remains DRAFT; S1 NOT_STARTED pending independent REVIEW_PASS + owner ACCEPTED |
| Latest global research tranche | R4e READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH: MAO and MLY dossiers added; 54/54 original queue entries now have research dossiers. Claude review pending; no owner data-patch authorization. |
| S0-B3 evidence | `docs/audit/s0/S0_B3_RESULTS.md` (summary, gate self-assessment, finding index) with `S0_TEST_CATALOG.md`, `s0_test_catalog.json`, `S0_REQUIREMENT_MATRIX.csv`, `S0_GLOBAL_DATA_AUDIT.md`, `S0_ASSET_AUDIT.md`, `S0_PERFORMANCE_BASELINE.md/.json`, `b3/**` — tools commit `3d63061e4bd5b3fdf7c636370da462a5b0f5d721`, reports commit `55331c2bf629bb631701ec82020c7f9deaa7da81`; review-1 corrections: tools `ddea490`, reports and evidence `2c62b3d` (`b3/review1/**`; summary in `S0_B3_RESULTS.md` §8) |
| S0-B1 evidence | `docs/audit/s0/S0_B1_CI_EVIDENCE.md`, `docs/audit/s0/logs/b1/` (commit `e13d964f343ab1ba01fb705fbbd8bcac2674ea80`). B1 commit `382aaa84b2336854b4dbebfcdc719847ff463f41`; run `43834719406`, job `133188390842` success; 58/58 tests; `report_valid=true`; APK file SHA-256 `314c8ca11c1d747550bbdb982326675e5f9dbdac870f3fc1cf04b9de7c22585c`; artifact ZIP SHA-256 `7717a2b79dd46fbf613845e33bac3a17634eae5b0c808328d8b21b5abc150ba0` (a different file) |
| S0-A evidence | `docs/audit/s0/S0_A_RESULTS.md` (summary and gate verdicts), `S0_REPOSITORY_SNAPSHOT.md`, `S0_BUILD_TEST_REPORT.md`, `logs/`, `a4/`, `inputs/` — commits `7d6eec9d0601a7d983679ec7792b1aa96b954ca0`, `d5b9820aae9a96d57e9486845c164ae591fa69de`, `8073fac029463c0685435985a2968cd5a3aba4ab` |
| Pending owner action | Device steps 1–4 of approved document §6.5.1 on the installed baseline APK (listed in `docs/audit/s0/S0_A_RESULTS.md` §2); never paste secrets |
| S0 execution authorized | S0-A done (awaiting review). S0-B1 done. **S0-B3, then B4, then B7** authorized by OD-20261116-11 (B4 only after B3 `REVIEW_PASS`). **NOT AUTHORIZED:** B2/C3, B5, B6, the G0.6 remediation task, S1 and every later phase |
| Gameplay/engine/save changes authorized | NO within the S0-B3/B4/B7 audit lane. **Separate bounded exception:** DEV-005 was explicitly authorized by the owner on 2026-11-19 for the exact population-cohort projection + v1→v2 save compatibility scope recorded above; no general S1 or later-phase authorization is implied. |
| Signing/keystore/Secrets changes authorized | NO |

The SHA above is a historical observation. Re-check GitHub HEAD before every task.

## 2. Current gate — S0-B3/B4/B7 under v3.3 (OD-20261116-11)

Allowed:
- Audit scripts, catalogs, crosswalk, inventories, fixtures and characterization tests; reports, handoff updates and the audit commits they need.
- Work runs on the baseline `2240a8f` in a clean temporary worktree.
- Harnesses stay outside the product code.
- Order: B3, then stop for review, then B4, then B7.

Not allowed within the S0-B3/B4/B7 audit lane:
- No gameplay, engine logic, RNG, save serialization/schema, migration, shipped data, asset or content changes.

**Separate owner-authorized exception — DEV-005 only:** the owner explicitly authorized the bounded population-cohort projection and v1→v2 save compatibility implementation in the DEV-005 section above. Its exact code/test paths and corrected target SHA are recorded in the DEV-005 review packet and technical self-audit. This exception does not change the B3/B4/B7 boundaries, does not make cohorts authoritative, does not authorize gameplay parity expansion, and does not open S1 or S7–S23.
- No B2/C3, B5, B6; no keystore, signing Environment or Secrets.
- No uninstalling the baseline APK and no installing any APK on the iQOO (R14, O5).
- If B4 finds G0.6 `FAIL`: stop and propose `PRE-S1-SAVE-DETERMINISM-REMEDIATION` (decision §3). Never fix inside S0.
- No S1 before the bounded S1-entry package has independent reviewer `REVIEW_PASS` (Claude; owner-assigned DeepSeek fallback only if independent) and owner `ACCEPTED`.
- Never write `S0 = PASS` while any gate is `PARTIAL`, `BLOCKED`, `FAIL` or `NOT_TESTED`.

## 3. Coordination tasks

### 3.1. Coordination setup

| Field | Value |
|---|---|
| Task ID | `COORDINATION-SETUP` |
| Scope | Add collaboration protocol and shared handoff index only |
| Base SHA | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` |
| Result SHA | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Files | `docs/coordination/AI_COLLABORATION_PROTOCOL.md` (new), `docs/coordination/AI_HANDOFF.md` (new) — both byte-identical to the owner's setup package; `README.md` (one navigation line) |
| Status | `CHANGES_REQUESTED` — owner review of `bd5787f` (2026-11-16); stays so until the corrections in 3.2 are made and independently reviewed |
| Out of scope | All code, gameplay, workflows, Gradle, signing, secrets, save schema, assets, and S0 execution |

### 3.2. Corrections after review of `bd5787f`

| Field | Value |
|---|---|
| Task ID | `COORDINATION-REVIEW-BD5787F` |
| Scope | Owner decisions 1–7 and the source-of-truth correction from the review of `bd5787f` (section 7); documentation only |
| Base SHA | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Result SHAs | `6c4d02a36a30f7e82d973da59f569b379f85468d` (protocol, legacy notice, legacy index); then the handoff update commit (identified by GitHub commit metadata, see section 1) |
| Files | `docs/coordination/AI_COLLABORATION_PROTOCOL.md`; `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` (notice at the top only, body unchanged); `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (new); `docs/coordination/AI_HANDOFF.md` |
| Status | `READY_FOR_REVIEW` (Claude, unverified) |
| Out of scope | All code, gameplay, tests, save schema, Android, Gradle, CI workflows, signing, keystore, GitHub Secrets, PR creation, and S0 execution |

## 4. Phase register

| Phase | Status | Entry condition | Exit condition |
|---|---|---|---|
| S0-A — Baseline as-is (`BASELINE_ORIGINAL`), approved document §6.3 A1–A5 | `READY_FOR_REVIEW` (A1–A4 evidenced; A5 `BLOCKED`) | Owner approval of the S0 v3.2 document and S0-A authorization (OD-20261116-09, -10) — met | S0-A evidence committed; ChatGPT review; owner decision |
| S0-B1 — CI checksums and test report | Done; reviewer technical verdict `PASS` (v3.3 §2.1) | Owner instruction for B1 (OD-20261116-10B) — met | Evidence committed (`e13d964`) |
| S0-B3 — Audit scripts, catalog, coverage, crosswalk, asset inventory, Node/desktop harness | `READY_FOR_REVIEW` round 2 (Claude, unverified); round 1 `CHANGES_REQUESTED` | OD-20261116-11 — met | Reports committed (`3d63061`, `55331c2`; corrections `ddea490`, `2c62b3d`); ChatGPT re-review (B4 waits for B3 `REVIEW_PASS`) |
| S0-B4 — Characterization tests and fixtures (save/load determinism, v3.2 §6.7) | READY_FOR_REVIEW (B4-SA-01/02 source corrections committed; 8 isolated helper assertions passed; corrected tests-only CI run 44041104723 passed 70/70 tests across 6/6 suites; four Historical/Sandbox × tick-6/tick-12 save/load cases all MATCH; no APK artifacts; genuine second-party review pending) | B3 REVIEW_PASS + OD-20261116-11 — met | Independent review of exact corrected test source/evidence; then record B4 verdict. B7 may proceed with its already-authorized risk/signoff preparation under OD §6 step 6; B4 review is still required for the final complete S1-entry package. |
| S0-B7 — Risk register and signoff package | READY_FOR_REVIEW (risk register, G0.1–G0.9 ledger, bounded S1-entry signoff proposal, B7 results, reviewer request and consolidated Vietnamese package summary committed; S0 gate states retain G0.7 BLOCKED, G0.8 PARTIAL, G0.9 BLOCKED for full S0 while R14/C3 remain BLOCKED) | B3 REVIEW_PASS + B4 execution evidence recorded (G0.6 PASS) + OD-20261116-11 §6 step 6 — met | Obtain independent review REVIEW_PASS of the complete bounded S1-entry package and owner ACCEPTED of R7 residual risk, listed exceptions and exact S1 scope; only then may S1 begin. Overall S0 remains PARTIAL/BLOCKED while any gate is not PASS. |
| S0-B2 / B5 / B6 — signing, Diagnostic UI, instrumented measurements | `BLOCKED` / deferred | R14 proven on the baseline APK, O5 decided, protected `development-signing` Environment configured by the owner | Per v3.2 §4.1, §6.8 |
| S1 — Data architecture and save foundation | `NOT_STARTED` | S0 accepted and S1 scope separately approved | S1 acceptance criteria met; independent review; owner accepted |
| S2+ | `NOT_STARTED` | Previous phase accepted and next scope approved | Phase-specific acceptance and owner approval |

Detailed phase scope comes from the canonical roadmap (section 1), within the limits of explicit owner authorizations. This table is not a substitute for that roadmap.

Pre-protocol work:

| Work | Classification | Register | Note |
|---|---|---|---|
| Earlier stages 1–5 (identity/content, numbering of an earlier specification) | `PRE_PROTOCOL_IMPLEMENTED_REPORTED` | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` | Not `REVIEW_PASS` or `ACCEPTED`; part of the current baseline; S0 verifies what is present at the frozen SHA |

## 5. Work log

### 2026-11-18 — S23-MOBILE-UI-CONTENT-PACKS-RELEASE-PRE-DESIGN

- Added docs/spec/MOBILE_UI_CONTENT_PACKS_RELEASE_ARCHITECTURE_PROPOSAL_VI.md (design commit e3a983b16717b18c755d74a1747e36e12ab27637) against product/code baseline e4924ca48264f8d0818eface51a28a87cd363b89.
- Inspected current map-first Preact shell, landscape rail/portrait dock and sheets, lazy content registry, placeholder fallback, IndexedDB saves/yearly autosave, Blob/file-input export/import, WebGL+2D map renderer, Android manifest/Capacitor packaging and broad push-triggered Android APK workflow.
- Proposed S23a responsive navigation/view-model/command boundaries, contextual drill-down, provenance/uncertainty display, accessibility/localization and WebGL lifecycle recovery.
- Proposed S23b presentation-only multi-pack architecture: signed/canonical manifest, per-file hashes, compatibility/dependencies, opt-in online mode, verified resumable download, storage preflight, staged atomic activation/rollback, no executable content and LRU decoded-image/texture budgets. Simulation remains offline and independent from presentation packs.
- Proposed S23c physical-device matrix and release QA for lifecycle, IndexedDB, R14 export/import, WebGL context loss, 60-minute stability, RAM/thermal/battery, WebView versions and artifact identity. Package/version/signing/workflow changes remain separately gated.
- Added Claude no-write design review request docs/audit/s0/MOBILE_UI_CONTENT_PACKS_RELEASE_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md (commit 2d6d34784ba12a91c49a2b3d6c0cbf6a00f9d6bf).
- Design-only. No runtime, content assets, Android, Gradle, workflow, signing, save/schema, tests or APK changed. No tests/build/APK or device QA run. S1/S23 remain NOT_STARTED.

### 2026-11-18 — S22-HISTORICAL-EVENTS-GLOBAL-CALIBRATION-PRE-DESIGN

- Added `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md` (design commit `e546412b6d4b014bd35da4324d8e2d997dca4138`) against code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`.
- Characterized existing Historical Condition/Priority bias, date-triggered exogenous events, decision windows, switch-based option effects, historical succession/accessions, territory + milestone divergence scoring and limited yearly metrics.
- Proposed event classes (physical/exogenous, institutional process, historical pressure, conditional occurrence, decision opportunity, benchmark and narrative); causal preconditions/chains; typed effects/atomic idempotent handling; Historical/Sandbox event policies; benchmark registry; holdout calibration; multi-seed distributions; dimension-level diagnostics that never feed AI/rules.
- Added Claude no-write review request `docs/audit/s0/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` (commit `612c1c28f5ac6793110923644a0ce8b591dc8cae`).
- Added all-world Hydrogen event/benchmark research request `docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_CALIBRATION_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (commit `e03028c359eb850442b069b7d7606e9ae4a28999`).
- Updated Hydrogen's request with a measured repository inventory and explicit gap questions in commit `4d01454a7132eb32ca5583a43542a65ee4a17f9e`: CoW field-by-field counts/coverage, the non-compiled urban-population and military-expenditure series, Maddison present-day-territory limitations, lost benchmark provenance and the currently observed post-1914 coverage gap.
- Added ChatGPT source-level self-audit `docs/audit/s0/S22_CODE_BASELINE_SELF_AUDIT_2026-11-18.md` (created in `251c06ab815c45018cb59f09eed34c0017b8517a`, extended in `623afa1d9310edffca92d2b3e9bb051e20f5cba3` and `971d71af7e2fcca159dddb1921cb7b10f06da213`, Markdown formatting corrected in `31bf6f22198c086f9db1054ec5091338f742e269`), inspected code HEAD `a99b5712ea7f40fb6ca9bbe1d326abf39edb2ef3`; records twelve evidence-linked findings (SA-01–SA-12), including condition grammar, structural-rule source/runtime mismatch and incomplete event payload validation.
- Added ChatGPT design traceability supplement `docs/audit/s0/S22_DESIGN_TRACEABILITY_SELF_AUDIT_2026-11-18.md` (latest content blob `2671216d760efc4245db47b7bc3cc3d1613494be`), mapping SA-01–SA-12 to the amended design. All are design-covered only; runtime defects remain open.
- ChatGPT consolidated the S22 design-only amendments through commit `4b8efe94a4f37ad878c15bb4fa6a08d1c205af83`, exact design blob `fbbad73aae57a26a52aefadc630c8b6cb340040c`; §§14.1–14.14 now cover rank/utility, decision/effect atomicity, global measurement, event causal classes, structural rules, closed schemas, condition semantics, RNG isolation and Android performance.
- Updated Claude's independent no-write review request in commit `77483993cff15ee8a78aecaae249631c3444ea2b` to target the exact amended design blob and require review of SA-01–SA-12. Claude verdict remains pending.
- Hydrogen's all-world research request includes the repository benchmark inventory and source gaps; no `EVENTS_AND_CALIBRATION` research deliverable files have been added yet, so the research result remains pending.
- This is `CHATGPT_SELF_AUDIT_ONLY`, not an independent Claude verdict and not owner acceptance. No runtime/data/save/test/UI/workflow/Android/APK change; no tests/build/CI/device run. S1/S22 remain closed.

### 2026-11-18 — S18-S21-DIPLOMACY-AI-MILITARY-PRE-DESIGN

- Added `docs/spec/DIPLOMACY_STRATEGIC_AI_ARCHITECTURE_PROPOSAL_VI.md` (design commit `8f01556bd70fed05be6f880f287a0f3691cd7674`) against code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`.
- Characterized current diplomacy as typed but minimal treaties/relations with direct `declareWar()`; current strategic AI runs staggered budget/reform/diplomacy/war utility passes, and war selection proceeds directly from expected strength/goal value to declaration.
- Proposed S18 international actors/autonomy profiles, typed temporal relations/treaty terms/obligations and DiplomaticPlay state machine with backing/sway, escalation/de-escalation, mediation and settlement; proposed S19 goal hierarchy, bounded planning, shared command API, explainability, uncertainty and non-major polity agency.
- Added Claude no-write S18–S19 design review request `docs/audit/s0/DIPLOMACY_STRATEGIC_AI_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (commit `661eaa7ef43ba176d3d42f6aabfa36dd122d6abb`).
- Added `docs/spec/MILITARY_ORGANIZATION_OPERATIONS_LOGISTICS_PROPOSAL_VI.md` (design commit `a82d59bcc01e6a57163f7acedd4930132f0767f5`) with S20 diverse force organization, recruitment and LegacyForcePool; S21 movement/fronts/supply/combat/siege/occupation/navy/convoy/amphibious operations.
- Added Claude no-write S20–S21 design review request `docs/audit/s0/MILITARY_ORGANIZATION_OPERATIONS_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (commit `109c7c30397e92d4151228605c24a9ab05415f1e`).
- Added all-world military organization/logistics research request for Hydrogen `docs/research/GLOBAL_HISTORICAL_1836_1936/MILITARY_ORGANIZATION_LOGISTICS_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (commit `5d6d24bf6d8cd934a9e18159dacc7da32ca6049c`); candidate evidence only.
- Design/research only. No product runtime, historical data, tests, save/schema, UI, assets, Android, workflow, Gradle, signing or APK files changed. No tests/build/APK run. S1/S18/S19/S20/S21 remain closed.

### 2026-11-18 — S15-S17-GOVERNANCE-CHARACTERS-POLITICS-PRE-DESIGN

- Added `docs/spec/GOVERNANCE_CHARACTERS_POLITICS_ARCHITECTURE_PROPOSAL_VI.md` (design commit `207722d612354f4d1bccc74064d24616efa4511a`) against product/code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`.
- Characterized current fixed 8 IGS, 9 LawGroups, Region/strata-based clout, one generic legitimacy/revolution path, basic single leader/heir fields, leader record inputs and name-pool generated leaders.
- Proposed S15 overlapping/delegated authority, de jure vs de facto reach, public service capacity/access/quality, and population-conserving urbanization; S16 historical/generated/unknown character distinctions, office/appointment lifecycles and collective/non-monarchical succession; S17 institution profiles, authority-specific lawmaking, dynamic organizations and time-bounded movements with negotiation/resolution.
- Explicitly avoids assuming universal parliaments, one Head of State, one fixed IG taxonomy, or automatic revolution from a scalar radicalism threshold.
- Added Claude no-write design-review request `docs/audit/s0/GOVERNANCE_CHARACTERS_POLITICS_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (commit `f81b6c929dc93b4b69414d25301bd3a15df51b6e`).
- Added all-world Hydrogen source research task `docs/research/GLOBAL_HISTORICAL_1836_1936/GOVERNANCE_INSTITUTIONS_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (commit `907e7c781cc544d91d2175fba6f06fa419487b0f`). Candidate evidence only.
- Design/research request only. No engine, data, tests, save/schema, UI, assets, Android, workflows, Gradle, signing or APK files changed. No tests/build/APK run. S1/S15/S16/S17 remain closed.

### 2026-11-18 — S10-S11-BUILDING-PRODUCTION-SITE-PRE-DESIGN

- Added `docs/spec/BUILDING_TYPES_PRODUCTION_METHODS_SITES_PROPOSAL_VI.md` (design commit `b1fa6abdeb3609c8acc31206405c05a0ee90898b`) against code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`.
- Characterized the existing `Region.buildings` as region-level level counts, initial levels as heuristic estimates, `RECIPES` as fixed mappings and `build()` as immediate level increment. These are not historical facility, firm, hiring or wage records.
- Proposed S10 BuildingType/ProductionMethod definitions with era/source/resource/site-potential and monthly S7 unit contracts; proposed S11 sparse BuildingSite operations with owner-approved stable IDs, mutually exclusive level-status buckets, PM transitions, lineage, tombstones and deterministic projections.
- Legacy Region aggregates are preserved as labelled placeholders; no historical facility names/coordinates/owners/workers are invented. S12 remains real hiring/wages; S13 ownership; S14 construction.
- Added Claude no-write review request `docs/audit/s0/BUILDING_TYPES_SITES_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (commit `4d1f058020651b128dd8d0a7e889944e9684db46`).
- Design-only. No runtime, save/schema, historical data, tests, UI, assets, Android, workflow, Gradle, signing or APK files changed. No tests/build/APK run. S1/S10/S11 remain closed.

### 2026-11-18 — S7-S8-DESIGN-REVISION-AND-REVIEW-PACKET-PIN

- Revised design commit: `98a9aef1356f73004a78590eb45d63321b4b0ee2`. Added explicit inventory/transport policy distinctions: `storable`, `flow_only`, and `non_material_service`; physical mass/volume are nullable where non-material. This preserves the current engine's separately modelled service output and prevents service stock/shipment.
- Updated Claude's no-write review request to target the revised design commit; review request revision commit: `77449b1de2c17e739b97bb4857a85d7e6cf44ede`.
- The earlier design/review commits remain in the history; the revision above is the authoritative target. This is a ChatGPT author self-audit correction, not an independent REVIEW_PASS.
- No runtime, save/schema, historical data, tests, UI, assets, Android, workflow, Gradle, signing or APK files changed. No tests/build/APK run. S1/S7/S8 remain closed.

### 2026-11-18 — S7-S8-GOODS-MARKETS-TRANSPORT-PRE-DESIGN

- Added `docs/spec/GOODS_MARKETS_TRANSPORT_ARCHITECTURE_PROPOSAL_VI.md` (design commit `0b231f637bb0659bd170c7e4a0d1d76d44248922`) against product/code baseline `e4924ca48264f8d0818eface51a28a87cd363b89`.
- Characterized the current engine: no physical inventory ledger; current `MarketGoodStats` is only supply/demand/import/short snapshot; market pooling is country/customs-union based; openness and railway/coastline are scalar approximations; recipe supply is registered before input scarcity is applied later in the GDP calculation.
- Proposed S7 contracts for Goods Registry, explicit canonical units, monthly stock/flow separation, sparse inventory, material balance, staged input allocation, unmet-demand/rationing and price formation. Proposed S8 temporal transport graph, shared capacity, shipments/in-transit inventory, blockades and goods-specific market access.
- Preserved roadmap boundaries: S6 POP before cohort demand; S7 before S8; S10/S11 production/sites; S12 real jobs/wages; S13 ownership. No real hiring or wages in S7/S8.
- Added Claude no-write design-review request `docs/audit/s0/GOODS_MARKETS_TRANSPORT_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (commit `25b90a56b865ccdb4b75cd9f9f519bf949a9da2d`).
- Design-only. No engine, save/schema, tests, shipped historical data, UI, assets, Android, workflow, Gradle, signing or APK files changed. No tests/build/APK run. S1/S7/S8 remain closed.

### 2026-11-18 — POPULATION-COHORT-SEED-HYDROGEN-RESEARCH

- Added research-only request `docs/research/GLOBAL_HISTORICAL_1836_1936/POPULATION_COHORT_SEED_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md` (commit `c17dc2a9031a6ca8cf4d19cf86391073154725ca`).
- Requests global, c.1836 source-backed candidate evidence across total population, age, occupation/livelihood, strata, rural/urban, culture/language, religion, literacy, coercive labour status and carefully scoped wealth/income evidence.
- Requires complete entity coverage matrix, regional balance, source locators, units, population scope, quality, method, uncertainty, crosswalk provenance and explicit missing records. It prohibits inferring subgroup shares from totals or copying polity totals into every Strategic Region.
- Research-only handoff to Gemini Hydrogen. No historical runtime data, code, tests, save, assets, UI, workflow or Android files changed; no tests/build/APK run. Candidate data requires separate validation and owner authorization before integration.

### 2026-11-18 — POPULATION-COHORTS-DESIGN-REVIEW-PACKET

- Proposal revision committed: `b35c5367cfe41bea3036bec2b846d19060f495c0`; changed only `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`.
- ChatGPT author self-audit corrected the mismatch between age-distribution vectors and the cohort identity key; clarified canonical tuple serialization, cohort-key lifecycle, integer-safe population counts, age-count mass balance, and unknown religion vs explicit unaffiliated identity. This is a self-audit, not an independent review.
- Claude no-write independent design-review request added at `docs/audit/s0/POPULATION_COHORTS_CLAUDE_INDEPENDENT_DESIGN_REVIEW_REQUEST_2026-11-18.md` (commit `c972b1b3844943e5df2f433936c8c21bb4fb464e`).
- Review packet confines review to design commit `b35c536` against product/code baseline `e4924ca`; required verdict is `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.
- No engine, historical data, tests, save implementation/schema, UI, assets, Android, workflow, Gradle, signing or APK files changed. No tests/build/APK workflows were run. S1 remains `NOT_STARTED`; S0-B7 independent review and owner acceptance remain pending.

### 2026-11-18 — POPULATION-COHORTS-TECHNICAL-PRE-DESIGN

- Prepared `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md` as a design-only P0 engineering pre-design.
- Inspected the current code for `Region`, `GameState`, `createGame()/strataFor()`, `populationMonth()/shiftStrata()`, `computeEconomy()` and `save.ts`, plus the owner-approved roadmap S1/S6/S7/S10/S11/S12 and H01 R3l population-scope audit.
- Main technical conclusions: current population is region total + nine strata shares; strata migration is a building-capacity heuristic, not hiring; economy labor supply is derived as `pop * 0.45`; static RegionRecord has secondary culture/religion fields but runtime currently drops secondary religion on init; save loader only accepts v1 and has no migration chain.
- Proposal defines canonical mutable cohort state, stable cohort keys, Region read-model aggregates, source-quality and uncertainty rules, deterministic migration/split/merge, S1 save migration requirements, S6/S7/S10–S12 boundaries, and data/simulation/determinism/performance acceptance tests.
- No implementation started: S0-B7/R4e independent review and owner acceptance remain pending; S1 remains NOT_STARTED. No engine, historical data, test, save, UI, Android, workflow or APK files were changed. No tests/build/APK workflow was run.
- Status: `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`. Claude may review the design independently; only the project owner can approve phase/scope changes.

### 2026-11-18 — GLOBAL-HISTORICAL-R4E-COLLECTIVE-POLITIES

- R4e base HEAD: `103ab66b227809fae358e082fa253c0e50a1f78c`. Completed the two remaining entries in the original 54-profile missing-succession research queue: MAO and MLY.
- MAO is documented as collective rangatira authority under He Whakaputanga, not a monarchy or a single-person HOS. The dossier separates the 34 initial northern signatories, later 52-signature count, planned-but-not-evidenced annual congress, British Resident James Busby, and the scoped Waitangi Tribunal Stage 1 findings about te Tiriti.
- MLY is documented as a gameplay aggregate of multiple constituent polities, not a unified 1836 state. The dossier distinguishes Perak, Selangor, Johor Sultan/Temenggong, Pahang Bendahara, Negeri Sembilan customary institutions, and adjacent Kedah/Perlis/Kelantan/Terengganu authority relationships. FMS is not backdated from 1895/1896 to 1836.
- Added `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/`: two-row evidence matrix, 19 non-executing decisions, 12 open evidence requests, 20 source records, Vietnamese audit, README and GitHub integration receipt.
- Added `docs/audit/s0/GLOBAL_R4E_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`. Claude review is no-write and pending; owner approval for any future data-model/runtime patch remains separate.
- CSVs were re-fetched and parsed from GitHub: matrix 2×13, decisions 19×7, open requests 12×5, source registry 20×8; rows rectangular and first-column IDs non-empty/unique.
- Combined R3af/R4a/R4b/R4c/R4d/R4e research dossiers now cover 54/54 entries in the original queue. This is dossier coverage, not live-data approval or claim that all source gaps are closed.
- Every R4e commit uses `[skip ci]`. No `historical_data/`, leader arrays, political registry, runtime source, schema, engine, tests, assets, map, save, Android, Gradle, workflow, signing or APK changed. No test/build/APK workflow was run.
- Status: `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`; no product implementation authorization is inferred.

### 2026-11-18 — GLOBAL-HISTORICAL-R4D-AND-V3-PARITY-TRANCHE

- R4d base HEAD: `f0745f1fd1eb381434cba4aa8576b3c2271d8732`. Completed dossier research for 15 remaining original missing-array profile IDs: ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI, SUL.
- Added R4d audit, 15-row evidence matrix, 26 non-executing decisions, 17 open evidence requests and 34 source entries under `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/`.
- Added 41-area Victoria 3 parity audit: `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md` and `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv`. Compared against the existing monthly engine, types, economy, population, politics, diplomacy, military, events, AI and modes. Conclusion: foundation present, core depth partial, full V3 parity not achieved.
- Main R4d findings: ETH Emperor/Regent dual roles; BOR conflicting al-Kanemi death date (1835/1837) and possible overlapping Mai/Shehu roles; WAD formal/de facto accession conflict; DAR occupation/restoration; OYO polity collapse and successor states; MAS 1844/45 death conflict; FJA two competing Almami lines; LIB ACS colony → Commonwealth → Republic; BUG Suna II year discrepancy; TEX dual provisional-governor claim and Burnet ad interim; CAF federal/member-state sovereignty; RGS rebel movement vs republic start; HAI provisional executive; SUL 1842/44 succession conflict.
- With R3af/R4a/R4b/R4c/R4d deduplicated, the original 54 missing-array queue has dossier coverage for 52 IDs; MAO and MLY remain as collective/aggregate models, not missing individual kings.
- Official V3 reference updated to public 1.15/1.15.1 line; official Steam announcements show 1.15.1 hotfix 11 Nov 2026 and 1.15 War Support 0–100. The parity report does not imply permission to copy Paradox code, assets, strings, art, music or DLC.
- No `historical_data/`, src runtime, schema, engine, test, asset, save, Android, Gradle, workflow, signing or APK changes. No test/build/APK workflow run. Status: `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`; Claude verdict and owner implementation authorization pending.

### 2026-11-18 — GLOBAL-HISTORICAL-R4C-SUCCESSION-AUTHORITY-TRANCHE

- R4c base HEAD: `356a70116588a677adc4bda3f4a45772833ea002`. Researched 15 missing-array profile IDs: ION, CIR, IMM, CON, ABD, KAN, KOK, YEM, SND, KAL, BRD, PRI, BHU, SKM, LUA.
- Added `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/`: narrative audit, 15-row evidence matrix, 27 non-executing decisions, 18 open evidence requests, 34 source entries and README; added Claude review request at `docs/audit/s0/GLOBAL_R4C_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Key findings: ION High Commissioner vs Ionian constitutional institutions; CIR no single supreme ruler; IMM Shamil election vs Hamzat assassination; CON legal deposition vs 1837 conquest; ABD tribal election/treaties/surrender; KAN joint Dil brothers and 1839–42 interruption; KOK 1842 occupation/1844 coup; YEM candidate-only Imam pending primary chronicle; SND three Talpur branches; KAL British-appointed vs local-recognized successors; BRD year-level only; PRI is gameplay aggregate, no historical HOS; BHU Desi/Je Khenpo dual offices; SKM protectorate vs annexation; LUA interregnum and Siamese confirmation.
- Source registry openly records inspection limits: OUP Ionian abstract only; Circassia 2024 article extract only; Constantine page open timed out; Yemen exact 1830s succession still lacks direct Yemeni chronicle; SND large Hughes PDF only extract; Baroda Royal Archives returned 503; Stuart-Fox cited but not read directly. Full searchable text was inspected for other listed works; no false claim of image/page screenshot checks.
- CSV structural verification pending final fetch; expected matrix 15×13, decisions 27×7, open requests 18×5, source registry 34×8.
- Triage coverage: including R3af plus R4a/R4b/R4c, 37 distinct original missing-profile IDs have research dossiers; 17 remain: ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI, SUL, MAO, MLY. This is research coverage only, not approved game data.
- No `historical_data/`, HOS array, country profile, political registry, source runtime, schema, engine, events, tests, assets, save data, Android, Gradle, workflow, signing or APK changed. No test/build/APK workflow run. Status: `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

### 2026-11-18 — GLOBAL-HISTORICAL-R4B-SUCCESSION-AUTHORITY-TRANCHE

- R4b base HEAD: `e5dead90d15cab772a8a0fa00ee76f76e4d08916`. Focused 15 missing-array profile IDs across Central Asia, West Asia, South Asia, North Africa, East Asia, Southeast Asia and Africa: KHI, BUK, HER, NAJ, TUN, NAG, AWA, GWA, HOL, TIB, RYU, BRN, ACE, MER, NDE.
- Added `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/`: full audit, 15-row evidence matrix, 25 non-executing decisions, 18 open requests, 33 source records, README; independent review request `docs/audit/s0/GLOBAL_R4B_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Key findings: KHI/BUK profile source-scope mismatch (`levi_2017` is Kokand-centred); HER Kamran/Yar Muhammad role separation; NAJ Faisal's interrupted 1834–38 / 1843–65 rule; TUN Ahmad Bey succession from 1837; NAG personal ruler death 1853 vs annexation/Commissioner administration 1854; AWA contested 1837 succession; GWA/HOL regency and EIC intervention; TIB Dalai Lama vs Regent and calendar conversion; RYU dual Qing/Satsuma relationships and 1879 annexation; BRN accession vs coronation; ACE possible 1836 head mismatch and rival Sultan/control; MER Queen vs Prime Minister; NDE regency and contested 1868–70 succession.
- The source registry records inspection limitations, including PDF screenshot failures (Petech 403; Ryukyu 429; Maharashtra 502; Aitchison timeout; Cambridge excerpt 502; Aceh PDF timeout). Do not claim visual page-image verification for these sources.
- CSV structure re-fetched from GitHub: matrix 15×13, decisions 25×7, open requests 18×5, source registry 33×8; all rows rectangular and first-column IDs unique.
- No `historical_data/`, current leader arrays, profiles, political registry, source runtime, schema, engine, events, tests, assets, saves, Android, Gradle, workflows, signing or APK changed. No test/build/APK workflow run. R4b remains `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`; owner acceptance and Claude verdict remain pending.

### 2026-11-18 — GLOBAL-HISTORICAL-R4A-PRIORITY-TRANCHE

- R4a base HEAD: `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314`. All-world first tranche across 13 cases: USA, MEX, BRA, JAP, QNG, PRS, TUR, SOK, ZUL, ASH, MOR, WAL, MOL.
- Added package under `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/`: narrative source audit, 13-row evidence matrix, 24 non-executing decisions, 15 open requests, 28 source entries and README. Added `docs/audit/GLOBAL_HOS_MISSING_PROFILE_TRIAGE_R4a.csv` (54 rows × 20 columns) and `docs/audit/s0/GLOBAL_R4A_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Key findings: Mexico 33/33 Wikipedia-only and interim offices omitted; USA Tyler succession vs oath date semantics; JAP Shogun/Emperor office conflation; BRA Regency vs Emperor; PRS designation/accession/coronation distinctions; TUR record-level source gap and date conflict; SOK day-level precision unsupported; ASH 1883–1888 interregnum; ZUL interrupted/partial restoration; MOR Sultan/regent distinction; WAL/MOL local rulers vs suzerainty/occupation.
- Missing-profile triage: 30 individual ruler candidates, 10 subject-local authorities, 3 colonial/company/protectorate authorities, 5 collective/aggregate authorities, 4 unresolved leadership/source gaps, 2 rebel/provisional governments; priority 5 P1 / 46 P2 / 3 P3.
- R4a is not complete global validation; remaining 426 records and broader historical data audit remain open. No game data/runtime/schema/engine/tests/assets/Android/Gradle/workflow/APK changed. No build/test/APK workflow run. Status remains `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

### 2026-11-18 — GLOBAL-HISTORICAL-MODE-FIDELITY-BASELINE

- Owner direction recorded: research scope is the whole world, not Africa-only. Historical Mode must use accurate, source-backed and temporally consistent history for the full 1836–1936 campaign; Sandbox/Alternate History may be flexible after the 1836 starting snapshot. Historical outcomes remain conditional and may diverge when causes change; no railroad.
- Data baseline SHA inspected: `44ab55f34c2069207be6d5dd23b49ba5c38fdfd0`. Registry contains 181 political entities; profiles comprise 136 core + 11 detailed = 147. `heads_of_state.json` contains 93 arrays and 439 records; 54 profiles lack arrays.
- Provenance baseline: 288/439 records cite only `wikipedia_en`; 58 records include a non-Wikipedia source; 93 records have no record-level source reference. The HOS file declares two global `sources_default`, but these are not per-record locators and do not independently substantiate each of those 93 records. This is a quality/provenance risk, not a claim that those records are necessarily false.
- Temporal baseline: HOS file describes 1836–1900 while Master Spec campaign is 1836–1936. 92/93 arrays overlap 1836-01-01; 48 overlap 1900; only one overlaps 1936. Entity dissolution/merger and successor-state transitions must be distinguished from simple missing data.
- Documentation artifacts added: `docs/spec/GLOBAL_HISTORICAL_MODE_FIDELITY_STANDARD_VI.md`; `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`; `docs/audit/GLOBAL_HISTORICAL_SUCCESSION_COVERAGE_1836.csv` (181 registry rows); `docs/audit/s0/GLOBAL_HISTORICAL_MODE_CLAUDE_REVIEW_REQUEST_2026-11-18.md`.
- Commits: matrix `b63149242618c09d722f06068826f1651dc226ad`; global standard `1831c460eacfd8439820f505560dae96979c57fe`; baseline audit `f5ba6542ed2944f392d0d72b530122ce6f58b498`; Claude review request `29e61591e1cee0d925f3aa8d528f6c1593fc7975`.
- Engine audit flagged a possible `after_regime_change` selection inconsistency for Claude to verify. No code fix was applied.
- This work is documentation-only. No `historical_data/`, HOS arrays, country profiles, registry, source runtime, schema, engine, events, tests, assets, saves, Android, Gradle, workflows or APK files changed. No build/test workflow run. Status: `SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`; owner acceptance and S1 remain separate.

### 2026-11-18 — H01-R3AF-SHE-ZUL-BSO-SUCCESSION-1836-1900

- R3af base HEAD: `c4b5f08983961494542c7c938db4a32ae21378c4`. The initial research files were committed sequentially: audit `59ee3385459f37828eb05a787c6715a0b6e22045`; source matrix `6d820863c8831c605c928524eae3b405be12bd87`; patch decisions `6d7e115bd6219c5abcc4c1ea331f9994a2e716e6`; open evidence requests `8a45b66ff07b1f21ca6de8ffd28b130122b1162c`; source registry `6afac9e21d06c850c12ed388c7354828606e62b5`; Claude review request `a45743af1511f97e5954ff3854acb262f1398a94`.
- R3af researches post-1836 succession for Shewa, Zulu and Basotho. It distinguishes Menelik's 1855 proclamation from captivity and effective return in 1865; Cetshwayo's formal 1872 succession, 1879 exile and limited 1883 restoration; Zululand's 1887 British possession proclamation from 1897 Natal incorporation; and Letsie's 1891 death, chiefs' representation and Crown recognition communicated in 1892.
- R3af CSV checks: matrix 10 columns/17 rows; patch decisions 7/14; open requests 5/10; source registry 8/17. All rows rectangular; all matrix IDs map one-to-one to registry IDs; no collisions against cumulative registers before append.
- Cumulative H01 registers after integration: open evidence requests 70 data rows; source registry 77 data rows. R3af review request: `docs/audit/s0/H01_R3AF_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`. Fetch the latest HEAD and review no-write.
- R3af is documentation-only. No live country profiles, `heads_of_state.json`, historical_data, engine/runtime, events, map ownership, population, tests, assets, Android, Gradle, workflows, signing, save/schema or APK files changed. No test/build/APK workflow was run. Status remains `SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`; no owner acceptance or S1 transition.

### 2026-11-18 — H01-R3AE-SHE-ZUL-BSO-OFFICEHOLDER-AND-TITLE-AUDIT

- Owner direction: continue H01 research/document packaging. ChatGPT researches and integrates documentation; Claude is reserved for independent review of work it did not author. Existing authorization remains research/documentation only; no S1, live-data or runtime changes.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- R3ae base HEAD: `3ba97713c2e767f201c300de51fddcc888d45321`. Five primary research files were added in commits `06d1656ba7a271f112360528330ce063b45244c9`, `c223711e64ccb8ad5b09fca1c3bca3433cb8b584`, `9d0b9cfce302c679d64e30ab7ef6c80bebe78cf2`, `65a8dc27e74f17d5d532a8b2f02947a5822a472a` and `c12c526e5fa4c756ee3fea2253e20fce4b8b5800`.
- Audit scope: SHE/Sahle Selassie; ZUL/Dingane and Mpande succession; BSO/Moshoeshoe, Morena and Basotho polity formation. Main caveats: 1806/1813 Shewa start-year conflict and Ras/Negus title chronology; Dingane exact-day source basis and Mpande transition 1839 defection versus 1840 accession; Moshoeshoe's 1820 inherited chiefship versus uncertain exact Morena/Morena e Moholo chronology.
- R3ae did not change live profiles or succession data. `heads_of_state.json` has no dedicated SHE/ZUL/BSO entity arrays at the base HEAD; a source-backed succession task is recorded for later, without edits in R3ae.
- Claude review request: `docs/audit/s0/H01_R3AE_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`, created at pre-integration HEAD `c12c526e5fa4c756ee3fea2253e20fce4b8b5800`. Review must be no-write, exact-HEAD, source/CSV/diff checked.
- Cumulative H01 registers: R3ae adds 8 open evidence requests and 10 source registry records; cumulative totals validated from exact GitHub blobs are 60 open requests and 60 source registry rows.
- Status: `SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`. This does not constitute Claude `REVIEW_PASS`, owner acceptance, title/profile approval or S1 authorization.

 
### 2026-11-18 — H01-R3AD-ASANTE-DAHOMEY-MACINA-BUGANDA-OFFICEHOLDERS

- Owner direction: continue H01 research/document packaging. ChatGPT completes the documentation integration while Hydrogen packaging is unreliable; Claude is reserved for independent review of work it did not author. Scope remains H01 research/documentation only; no S1, gameplay, engine or live-data authorization.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- R3ad base HEAD: `b02af8dfc1ccac4ad5b3e0cbc42a51bf89ef1b79`. The five initial R3ad package files were already committed in `7c0888d`, `f8b7190`, `02e1a76`, `19a97a8` and `105ed64` (full SHAs and file mapping are in the integration receipt).
- Integrated cumulative H01 records: appended 9 R3ad requests to `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` (43 → 52 data rows) and 12 R3ad source entries to `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` (38 → 50 data rows). Updated integrated audit, repository integration map and validation report.
- Structural validation: R3ad matrix 10 columns/12 rows; patch decisions 7/6; open requests 5/9; source registry 8/12. Cumulative open requests 5/52 and cumulative source registry 8/50. Every row rectangular; no duplicate appended request IDs or registry IDs.
- Research disposition: ASH Kwaku Dua/Fredua Agyeman, 1834 succession retained with 25 August qualified as “most probably”; DAH Ghezo's 1818 accession framed as coup/revolution with Adandozan predecessor status contested; MAS separates Ahmād Lobbo personal rule from 1818–1862 Hamdallahi state and keeps 1844/1845 death-year conflict open; BUG identifies Ssuuna II at the 1836 snapshot while start-year remains disputed (c.1830/1832/1836).
- Independent review request: `docs/audit/s0/H01_R3AD_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`, created at pre-pointer-update HEAD `1cfc8bbf896e7606c46aa48e1bf87bc95b16b4ff`. Claude must fetch the latest HEAD, do a no-write review, and return evidence-linked PASS/CHANGES_REQUESTED/BLOCKED per category and one task verdict.
- GitHub receipt: `docs/research/H01_batch02_1836/GITHUB_INTEGRATION_RECEIPT_R3ad.md`. Original research commits and integration commits are enumerated there. All use `[skip ci]`; no APK workflow, tests-only workflow, tests, build or APK packaging was run.
- Scope check before documentation integration: compare from R3ad base to pre-integration HEAD `105ed649f2ce003f9a98b5543d03d989edecc243` showed five commits/five changed files, all under `docs/research/H01_batch02_1836/`. All subsequent R3ad integration and review files are documentation-only. No source, historical_data, tests, assets, maps, Android, Gradle or workflow changes.
- Status: `SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`. This does not constitute Claude `REVIEW_PASS`, owner acceptance, numeric approval or S1 authorization.

 
### 2026-11-18 — H01-R3AC-CENTRAL-SAHEL-RULERSHIP-AND-SOVEREIGNTY

- Owner direction: continue H01 research/document packaging. ChatGPT handles research and integration while Hydrogen document packaging is not dependable; Claude is reserved for independent review of work it did not author. This remains within H01 research/documentation scope and does not open S1 or authorize any game/runtime changes.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD before R3ac: `1dea95b089b8e2a661223e414f18ee2891c50ca8`.
- Research commits: `d51f2fe03bc6e17cbec7298ca9005f5f25a22bd2` (Vietnamese audit), `330dea2cbc60d62bfb727016abb0add5e807f120` (initial source matrix), `52557af822a2ffb00ed572d7e99be4c0733a869d` (patch decisions), `9dfa024f4d3d4f9506715c67fe13b2a9926b904f` (open evidence requests), `8edf88e37617f9641b13e2184f9689268b030283` (correct source matrix columns and URL placement), `ef04b44320acccc59fc618a75b253e6ab6067bef` (source registry), `9a73d06628f73afb66e1d90e5b977f0c106c4f58` (README), `dc1c85e3c689aa696977c1fd7cae37bc269e5dc7` (validation), `c4ea80cb019982b5045f350372b79285bf9a574c` (integrated audit), `102acffb9eb42d79e4dce1c0979b9af5d4ffd441` (integration map), `ff1c2ed064ce35c4452e0e8ad0cdb5d7e025e541` (cumulative requests), `1e50caa56dab9b97cc52ec2d34ac0504ef3ecca9` (cumulative source registry). All commit messages use `[skip ci]`.
- Research findings:
  - SOK: Muhammad Bello ruled 1817–1837; Naylor (2021) identifies `Amīr al-muʾminīn` as manuscript-preferred titulature; Last (1967) describes Gawakuke in March 1836.
  - BOR: al-Kanemi/Shehu de facto rule and Mai Ibrahim/Sayfawa traditional status must be separated; Sayfawa institution ended in 1846. Death date 1835/1837 conflict retained; 1837 is better supported.
  - WAD: Muhammad al-Sharif accession is contested (1834/1835/1838); do not present current 1835 `since` as verified or select an alternate ruler without stronger source collation.
  - DAR: Muhammad al-Fadl 1803–1838 and Muhammad al-Husayn 1838–1873.
- Files added: `H01_R3ac_CENTRAL_SAHEL_RULERSHIP_AND_SOVEREIGNTY_AUDIT_VI.md`, `H01_R3ac_SOURCE_EVIDENCE_MATRIX.csv`, `H01_R3ac_PATCH_DECISIONS.csv`, `H01_R3ac_OPEN_EVIDENCE_REQUESTS.csv`, `H01_R3ac_SOURCE_REGISTRY_DELTA.csv`, and `GITHUB_INTEGRATION_RECEIPT_R3ac.md`. Cumulative README, validation, integrated audit, integration map, open-evidence requests and source registry were updated.
- Structural checks: R3ac source matrix 10 columns/10 rows; patch decisions 7/6; open requests 5/7; source registry 8/10; cumulative open requests 5/43; cumulative source registry 8/38. Every checked row is rectangular. The initial source matrix draft was malformed and has been replaced by a corrected version; use the final CSV blob.
- GitHub compare from base `1dea95b` to pre-receipt HEAD `1e50caa`: 12 commits / 11 changed paths, all under `docs/research/H01_batch02_1836/`; zero non-document paths. No `src/`, `historical_data/`, tests, assets, map ownership/geometry, save/schema, Android, Gradle or workflow file changed.
- Receipt: `docs/research/H01_batch02_1836/GITHUB_INTEGRATION_RECEIPT_R3ac.md`, commit `529e063562f21ea36ce6975a87592ac5c28bf8fc`.
- Claude review request: `docs/audit/s0/H01_R3AC_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`, commit `dc1e3805b06e2798db26c90bc5661f885b941f6c`; pre-request HEAD was `529e063562f21ea36ce6975a87592ac5c28bf8fc`. It asks for a no-write independent review and exact source/date/CSV checks.
- README pointer update: commit `4f15d02d9cdcfd7b4626f487d7d051d69fbb6fa4`. Cumulative validation count update: `1045be37ab16a778ded47915823369fd5c4a3d1b`.
- No product patch, code test, build, APK workflow, device install, PR or merge. No product-data, officeholder, title, government, event, territorial, population or schema value was promoted. `SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`.
- R3ac review is distinct from R3ab; both await Claude. Owner acceptance and any future phase authorization remain separate.


### 2026-11-18 — H01-R3AA-NDE-1829-ARCHBELL-CHASE-RASMUSSEN-TRACE

- Owner instruction: continue H01 research; owner is prepared to have Claude review/fix later. Scope remains documentation/research only.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD before R3aa: `a2366f5ac830599549b51f6be478ab9ba1f9451f`.
- Research commits: `e472d68177e56e1e2685192e6462e38f21ec045e` (audit report), `68146decc7ebff57dd46cda584e07ff9f0697150` (source matrix), `24cb76613dc64759377b39ed1a5b249af9cdcb6c` (patch decisions), `63041c3aa89ba1c76ea89556f82d1416ed3986f3` (open requests), `1090e076585f513376440103783337e8601c6408` (source registry delta), `92389c4d322d742938353e60c6756ba565f68f2f` (update existing R3T-07), `2aff1a0b7baff8114dc5c635aafc79720812772c` (correct Delius locator), `0ef06128bb645dbda27359cfa896f03b441ecaf0` (integrated audit), `d2699ed7714dd944cb7026795a46650179d90b1c` (validation), `07491d963cc2dcdc8abae4a847a75e6cf9690735` (README), `1cfd9602a824bb906695b3f72e9db5737803c169` (integration map). Every commit uses `[skip ci]`.
- Chase (1830), *South African Quarterly Journal* 1(4), p.407: contemporary report says c.80,000 under Malacatzie, including conquered Batow/Bichuana dependants. It is a travel-report estimate, not a census.
- Archbell: Ferreira (2025 UCT thesis, printed p.38) corroborates a December 1829 Missionary Society letter and encounter with Mzilikazi at Plaatberg; the excerpt cites *Missionary Notices* VI no.179 p.356 and gives no population count. Lye (1969) footnotes link Chase and separate Archbell correspondence. Date/item/box references do not align cleanly (3 Dec vs 31 Dec; box II vs S.A. III listings); original letter not inspected.
- Kruger (2010 UCT thesis, p.140) indirectly attributes to Rasmussen (1978) about 20,000 people under Mzilikazi in the Rustenburg area in 1829 vs 60–80k attributed to Archbell. Official UCT record confirmed; download timed out and p.140 was read in accessible transcription. Rasmussen original pages remain unread.
- Scope caution: Chase's “country he now possesses” includes conquered Bichuana dependants; Kruger's reported 20k is “Rustenburg area”. Do not treat as like-for-like until geography/population universe is reconciled. Lye's 60–80k broad subject synthesis is not an independent census; 1836 1–5k is Nguni military force, not population.
- Disposition: NDE 60k remains provisional high-uncertainty composite polity-subject candidate; 45–85k interval remains unverified with no method; NDE_MOS 210k broad geography only. No numeric/game/owner/map patch.
- R3aa files: `H01_R3aa_NDE_1829_ARCHBELL_CHASE_RASMUSSEN_TRACE_VI.md`, source evidence matrix, patch decisions, open evidence requests; sources added to source registry; R3T-07 updated; consolidated audit, validation, README, integration map and handoff updated.
- No live historical data/population benchmarks/profiles/political registry/ownership/geometry/runtime/engine/save/tests/assets/Android/Gradle/workflow/APK files changed. No PR, merge or build.
- Status: `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`. ChatGPT self-audit only, not independent Claude `REVIEW_PASS`; owner acceptance pending.
- Cumulative-document title alignment after R3aa: commits `fc965152bfd30ecb90629aac0d917abd28a65b54` (README), `200c70d25f8670fa69ea8668f88de0f2f96f4b17` (validation), `75c7044b9664354e571b66911af86d3e2c8c1eac` (integration map), `3cc5f1902a4bb2f3d529f8d9d594a79d4adce7ea` (integrated audit). Only document title lines changed; all messages use `[skip ci]`.


### 2026-11-18 — H01-R3AB-1836-AFRICAN-POLITY-OFFICEHOLDER-AUDIT

- Owner direction in this chat: ChatGPT temporarily handles the H01 research and document packaging end-to-end while Hydrogen's document-packaging output is not usable; Claude is reserved for independent review of work it did not author. This continues the existing H01 research-only authorization and does not reopen S1, gameplay, data/schema or engine changes.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD before R3ab: `0f5685231569ed4c72783cdd79a8abed63819943`.
- Research package commits: `e5cbbf71bf0e1d4346ead29ac28cbd74de56174f` (Vietnamese audit), `7e34387abac79c7c641b4df171b5ed78a6519ac7` (source evidence matrix), `3bc81016434fecb0b6a8672493d6ea41e498a870` (patch decisions), `9b876a74015d3ba0a9c7a5f212786aed6cf229e5` (open evidence requests), `ea056881b0962d32e18e90b97693c3586303ce39` (source registry delta), `5b6d1de197b7f87f1b2d98ec4440670eabf96d28` (CSV URL/column correction). Cumulative updates: `73471e476c9b78f15ba78ea1137d7126bb77e6fe` (README), `3598b9ace2cc61872c98bab9f884993c6c3befe2` (validation), `ab7d1d004a4b5b54fd218d23d0a9afcd38191b65` (integrated audit), `f93db793055dba479ec6d3fc40028d502847b14e` (integration map), `b30ee3e3dbb44f61ac8ee2f8fe48ab730ceb439c` (cumulative evidence requests), `e7744f116451b84d34975e19a38385ef22bc8faf` (cumulative source registry), `b7408f8a8f50d3e936bc6bc938806b2869b447f4` (validation count correction). Every commit uses `[skip ci]`.
- Research findings:
  - FJA: Bubakar is a provisional Almami candidate at the 1836 snapshot based on Barry (1997, p.150); the exact print page and source chain still require verification. Futa Toro chronology was explicitly treated as a different polity.
  - ETH: Sahle Dengel identified as nominal emperor (1832–1840); Ras Ali Alula/Ali II as de facto power-holder; Mänän Libän Amäde's major role is time-qualified.
  - LIB: ACS-administered colony in 1836, not a sovereign state; Anthony D. Williams listed as agent; Thomas Buchanan arrived in January for Bassa settlements, and only became governor in 1839.
- New files: `H01_R3ab_1836_AFRICAN_POLITY_OFFICEHOLDER_AUDIT_VI.md`, `H01_R3ab_SOURCE_EVIDENCE_MATRIX.csv`, `H01_R3ab_PATCH_DECISIONS.csv`, `H01_R3ab_OPEN_EVIDENCE_REQUESTS.csv`, `H01_R3ab_SOURCE_REGISTRY_DELTA.csv`. Cumulative README, validation report, integrated audit, integration map, cumulative open-evidence file and cumulative source-registry delta were appended. This handoff entry records the task; the GitHub metadata identifies the handoff commit itself.
- Structural validation: source matrix 10 columns/9 rows; patch decisions 7/6; open requests 5/9; source registry delta 8/8; cumulative open requests 5/36; cumulative source registry 8/28. All checked CSV rows are rectangular.
- GitHub compare before this handoff entry: 12 commits, 11 changed paths, all under `docs/research/H01_batch02_1836/`. After this handoff update only this coordination document is additionally changed. No `src/`, `historical_data/`, tests, map-owner/geometry, assets, save/schema, Android, Gradle or workflow files changed.
- No code tests, build, APK workflow, APK install, PR or merge run; no such execution is relevant to a documentation-only source package. Commit messages use `[skip ci]` to avoid the broad Android APK push workflow.
- Claude status: independent review pending. ChatGPT validation is self-audit only; not `REVIEW_PASS`, not owner acceptance, no numeric or product-data promotion.
- Disposition: `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`. Exact-source gaps are listed in `H01_R3ab_OPEN_EVIDENCE_REQUESTS.csv`.


### 2026-11-18 — H01-R3AB-CLAUDE-INDEPENDENT-REVIEW-HANDOFF

- Owner instruction: after completing R3ab, prepare a durable GitHub review report for Claude so it is discoverable immediately when Claude connects.
- Review entry point: `docs/audit/s0/H01_R3AB_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`; linked from the top of `docs/research/H01_batch02_1836/README_VI.md` and from this handoff's “Current independent review entry point”.
- Review scope: R3ab documentation/research change set from base `0f5685231569ed4c72783cdd79a8abed63819943` to the exact current branch HEAD when Claude starts. The request lists the files, commits, source claims, expected validation and explicit exclusions.
- Required reviewer: Claude Code, independent (did not author or modify R3ab). Re-fetch branch HEAD before review; if it advanced, state the actual SHA and review the current bounded diff or report the change in scope.
- Required outcome: evidence-linked `REVIEW_PASS` or `CHANGES_REQUESTED`; `BLOCKED` only if the review cannot be completed. Review does not authorize runtime integration, S1, gameplay, engine, save, data or schema edits. Do not modify the target change set while reviewing.
- Status at handoff: `READY_FOR_INDEPENDENT_REVIEW`; ChatGPT's structural/source checks remain self-audit only. Owner acceptance remains a separate decision.

### 2026-11-18 — H01-R3Y-OYO-1831-1836-POLITICAL-GEOGRAPHY-AND-POPULATION-UNITS

- Owner direction: continue H01 research and documentation; owner is prepared to ask Claude to review/fix later. Scope remains existing H01 research layer only.
- New source: Henry B. Lovejoy, “Mapping Uncertainty: The Collapse of Oyo and the Trans-Atlantic Slave Trade, 1816–1836,” Journal of Global Slavery 4(2) (2019), pp.127–161, DOI 10.1163/2405836X-00402002. Open-access Brill PDF text inspected; screenshot endpoint returned 403, so no visual scan authentication.
- Verified source chronology: 1832 Ilorin expands across much of Oyo Ibarapa, Ago Oja allied with Ilorin, Saki/Iganna tributary; 1833 Ilorin destroys/subjugates most key Oyo towns; surviving independent southern Oyo powers include Ijaye, Abemo, Ibadan; Oyo/Bariba try to recover territory in 1834–35 with distinct allied forces; 1836 Old Oyo capital district abandoned, refugees move south, and Abeokuta, Ilorin, Ibadan, New Oyo, Ijaye, Ijebu, Ife compete for territory.
- Method caveat: Lovejoy says maps are fuzzy approximations and not authoritative. GIS rows use Jan 2 / Dec 31 as software dates with zero historical value; no day-level 1836-01-01 owner/date can be inferred. 75,000+ refers to Atlantic embarkations, not Oyo resident population or all refugees.
- Original H01 package reread: OYO=650k method refers to refugee displacement toward Ibadan/Ijaye/Abeokuta without cohort count or resident-stock definition; OYO_OYO=1.45m is broad Yorubaland Oyo/Ibadan/Abeokuta backward projection from Manning macro-series plus Law but no subregional workbook, denominator, polygon or migration formula. These are different population units and both remain quarantined.
- H01 crosswalk assigns 100% of SSA_REG_18 to OYO_OYO and owner OYO. Lovejoy separates Oyo, Ilorin, Ibadan, Abeokuta, Ijebu, Ife, Ijaye and Abemo with changing/contested relations. 1:1 allocation is arithmetic only, not proof of sovereignty. No owner or geometry patch.
- R3y files: `H01_R3y_OYO_1831_1836_POLITICAL_GEOGRAPHY_AND_POPULATION_AUDIT_VI.md`, source evidence matrix, source registry delta, patch decisions and open evidence requests; updated consolidated report, README, validation, integration map and this handoff. All commits use `[skip ci]`.
- Status `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`; ChatGPT self-audit only, not independent Claude REVIEW_PASS; owner acceptance pending. No runtime, shipped data, game, map, tests, assets, Android, workflow, APK, PR or merge changes.

### 2026-11-18 — H01-R3X-NDE-POPULATION-UNIVERSE-AND-RASMUSSEN-TRACE

- Owner direction: continue H01 work; Claude may review/fix independently later. Scope remains documentation/research only.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD before R3x: `6acc80a11a2457d6cec1bebdb9693a2d2910386a` (R3w receipt commit).
- New research commits: `ec241a91f5e4fbeec484dbf3ac0842156bc128c0` (NDE audit), `ebb797f4c0852532468357ae50643da4083b4d17` (source matrix), `d71a039bd94360ab72885be89e5b5adf54399ffc` (patch decisions), `ee6d46abca69e7a8a079d1ff2554473fae36596e` (open requests), `1461266b293b9e674026d4083436af994551a932` (source registry delta), `07a871c13ef19b8959a8f81e9f7a4c9618805bf6` (existing R3T-07 updated), `6a3688a6e1d73e64ba114011d541337b39d0731f` (request token correction), `9b204753333ec5480fa7f6c63d633aa70006426f` (integrated report), `44c38cecbfe8f0d26e45434e8d4f450f892c5e9f` (README), `1b1ca29900affd12e3e942f63ba7c31dcb65f3d0` (validation), `2f843b7b4512eb16f97d239002ac8dcb9e37d229` (integration map). All messages use `[skip ci]`.
- Lye (1969), pp.88, 91, 96–97 directly inspected from page-numbered text. p.88: about 300 young warriors and women in flight by end 1823. p.91: raids beyond Vaal/Limpopo did not equal control. p.96: 10k–20k who followed Mzilikazi beyond Limpopo belonged to later withdrawal after 1836–37; many subjects stayed behind and the majority of followers were Sotho. p.97: 1829 visitors estimated 60k–80k; 1836 Nguni military force 1k–5k plus subject groups; Lye's 60k–80k composite subject estimate includes Nguni/Sotho, military/subjugated, tributary/vassal people; indigenous Sotho the greater part.
- Delius (2010), *Journal of Southern African Studies* 36(1), pp.7–23, author full text inspected. It cites Rasmussen (1978), pp.23–26 and 90–94: plausible 300 initial departure (1821), most reliable end-1820s estimate around 20k, some sources 3–4x higher, ample error margin. Delius gives a different date for the 300 migration from Lye's end-1823 chronology; both retained without harmonization. Direct Rasmussen book pages remain unread.
- Warren, Hall & Ackermann (2014), *South African Journal of Science* 110(7–8), SciELO full text inspected: 300 to about 20k by late 1820s, significant Sotho-Tswana speakers included, cites Rasmussen. Cross-check only, not independent census.
- R3T-07 is now `PARTIALLY_RESOLVED`: Lye page-level estimate and military-force comparator directly verified; Rasmussen pages traced indirectly via Delius; direct pages and 45k–85k interval derivation remain open. New open requests R3X-01 to R3X-03 remain OPEN.
- Disposition: NDE 60k can only be described as a provisional approximate circa-1830s subject population of Mzilikazi-led polity, not ethnic Ndebele/Nguni core or exact census; 45k–85k remains an undocumented range; 1k–5k is a separate 1836 Nguni military-force estimate; 10k–20k is later out-migration, not 1836 total. NDE_MOS 210k remains broad geography, not proven direct control. No numeric or owner patch.
- No live historical_data/population profiles/benchmarks/political registry/map geometry/engine/runtime/save/test/assets/Android/Gradle/workflow/APK files changed. No PR, merge or build/APK workflow requested or run.
- Status: `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`. ChatGPT self-audit only; independent Claude review and owner acceptance remain pending.

### 2026-11-18 — H01-R3W-OYO-CITATION-AND-TRANSITION-CHRONOLOGY

- Owner direction: continue the H01 research work; Claude can independently review/fix later. Scope remains documentation/research only.
- New sources inspected: Asiwaju (1989) chapter 26, printed pp.703–706 and pp.710–711; Lovejoy (2012 UCLA PhD dissertation), printed pp.66–67; Morton-Williams (1967), printed p.45; Johnson (1921), printed pp.279–280.
- Asiwaju p.704: page-numbered accessible text describes Oyo core, tribute, influence/control of varying degrees, and autonomous/protected polities; it does not display >750,000 demographic value. Chapter text search did not find 750,000/750000/700,000 within Oyo chapter. Butcher & Griffiths (2021, p.385) cite that page for >750k c.1780; claim is retained as unverified secondary lead, not declared false.
- Chronology: Asiwaju gives Oyo collapse c.1835 and broad post-collapse demographic southward movements; Lovejoy says Old Oyo and surrounding district deserted/destroyed c.1836, after which displaced Oyo formed a working alliance at Ago Oja and Atiba was recognized by surviving senior chiefs/warriors; Morton-Williams describes formal ritual installation c.1838 and official reconstruction; Johnson places accession after Old Oyo's fall and Oluewu's death but gives no exact calendar year in passage. Staged chronology is recorded; no exact Jan 1 1836 border/owner derivation.
- R3w decisions: OYO 650k and OYO_OYO 1.45m remain quarantined; >750k claim/citation path not substantiated by inspected Asiwaju transcription and remains open; no numeric or control patch.
- R3w research files: `H01_R3w_OYO_CITATION_AND_TRANSITION_AUDIT_VI.md`, `H01_R3w_SOURCE_EVIDENCE_MATRIX.csv`, `H01_R3w_SOURCE_REGISTRY_DELTA.csv`, `H01_R3w_PATCH_DECISIONS.csv`, `H01_R3w_OPEN_EVIDENCE_REQUESTS.csv`; updates to consolidated audit, README, validation, integration map and this handoff. All commits use `[skip ci]`.
- Inspection caveat: Asiwaju read as page-numbered HTML transcription rather than authenticated page image; screenshot could not be obtained for relevant Lovejoy page image due PDF page mapping/rate limit; Forde PDF screenshot endpoint returned 404; searchable text only.
- Status: `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`. ChatGPT self-audit, not independent Claude `REVIEW_PASS`; owner acceptance pending. No live data/game/runtime/ownership/geometry/save/engine/assets/tests/Android/workflow/APK changes, no PR/merge/build.

### 2026-11-18 — H01-R3V-LIBERIA-PRIMARY-SERIES-RECONCILIATION

- Owner instruction: continue H01 work; owner accepts that Claude may later review/fix the implementation. Scope remains research documentation only under the existing H01 boundary.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD before R3v: `0643e7cd0f19a80e04c012182dfc98bd231c12b0`.
- R3v source/audit commits: `145c9b785fcbca7d262e6cbdc7e0218f1e39852e`, `f6e08af2fbe3f9973a99b19cfa56748b2be3a9c9`, `43576ee71e345764205d6949493e7fd9ac6d1c0e`, `a69a5a391c073879a20b9ac761b1ab77c667007a`, `864923c5d599ba88e29a0228915616e0aed97026`, `5ce071ce15a49ec9f9bb8400c03126c9d40ce751`. R3v report/index/map/handoff/receipt updates are recorded by GitHub commit metadata; all commit messages use `[skip ci]`.
- Starr (1913), printed pp.24–25: table is sourced to African Repository and presented as immigrant vital-statistics for Liberia excluding Maryland. The 1836 row has 209 arrivals, 145 deaths, 13 removals, 47 live births and Pop. 2,230. Starr separately distinguishes immigrant and aboriginal populations. A printed 1834 stock anomaly (1,016 vs 2,016 from displayed stock/flows) is flagged, not silently corrected.
- Shick (1971) reconstructs individual ACS emigrants from a Senate register: 242 arrivals in 1836, 4,571 arrivals 1820–1843 and 1,819 cohort members living in settlements in 1843. Starr's 1836 arrivals=209 differs, as do other years; source-series conflict confirmed but common reconciliation remains open.
- Hiller (1860), Section IV, attributes an approximate Monrovia population of 1,500 to Freeman writing in 1837. New Georgia and Millsburgh values are separate. Original Freeman publication unidentified; quotation is not a census.
- Located a seven-page transcription labelled September 1843 Monrovia census and attributed to Senate Document 150. Original scan pages were not visually authenticated, inclusion of Indigenous/local population is unknown, and it does not provide a 1836 count.
- R3U-08 advanced only to locating the 1843 transcription; 1836 count and additional 100 remain open. R3U-09 advanced to confirmed conflict between Starr and Shick, not resolved. R3V-01 to R3V-04 remain open for original African Repository issue, Freeman source, image verification, and source lineage of 3,500/+100.
- Disposition: LIB 3,500, LIB_MON 3,600 and extra 100 remain quarantined; Starr 2,230 and Shick 242 are source-series comparators only; Freeman ~1,500 is a c.1837 comparator only; DZ_KRU 356,400 is a conditional arithmetic residual only. No numerical/data approval.
- No live `historical_data/`, profile, population benchmark, political registry, owner/geometry, engine/runtime, save schema, test, asset, Android, Gradle, workflow or APK files changed. No PR, merge or build/APK workflow requested or run.
- Status: `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`. This is ChatGPT research and integration self-audit, not independent Claude `REVIEW_PASS`; Claude review and owner acceptance remain pending.

### 2026-11-18 — H01-R3U-SUPPLEMENTAL-RESEARCH-INTEGRATION

- Owner request: continue H01 review, integrate source-trace updates into the repository and provide one consolidated download.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD before R3u integration: `36d35315116720007fcc31bc7b043963ca34aebe`.
- R3u integration commit: `a0f32eabcd5d48ed66848951773b3b1d0b0b9a50` (9 paths; all under `docs/research/H01_batch02_1836/`; commit message contains `[skip ci]`).
- Added: supplemental source audit, source evidence matrix, patch decisions, open evidence requests, source registry delta; updated README, consolidated report, validation report and integration map.
- New evidence: Lye (1969, pp.91, 96–97) distinguishes Mzilikazi polity subjects (rough 60k–80k estimate) from Nguni military force (1k–5k warriors in 1836); subjects included Sotho and tributary/vassal groups. Thus R3l's “Ndebele/Nguni core” label is wrong; 45k–85k interval remains unsupported and NDE_MOS 210k remains broad geography, not direct-control population.
- Liberia: Hassell (1866, p.169) gives 3,500 US emigrants within Liberia-wide population c.5,000 in 1838, not Monrovia 1836; Shick (1971) gives 242 arrivals in 1836, 4,571 cumulative arrivals 1820–1843, and 1,819 living in settlements in 1843; Starr (1913) gives a different Liberia-wide series (2,230 in 1836; 2,281 in 1838). These are non-equivalent measures. The 100-person LIB_MON component remains unsupported.
- OYO: Butcher & Griffiths (2021, p.385) repeats >750k as a peak c.1780 estimate citing Asiwaju p.704; English p.704 and Law (1977) cited pages remain unread. Not a 1836 estimate.
- Disposition: OYO 650k and OYO_OYO 1.45m remain quarantined; NDE 60k reinterpreted as rough polity-subject estimate only; NDE interval unresolved; NDE_MOS 210k broad geographic only; LIB 3.5k/100 unverified; DZ_KRU 356.4k arithmetic-only. No numeric or ownership patch approved.
- No live historical_data, profile, population benchmark, political registry, map owner/geometry, engine, runtime, save schema, asset, test, Android, Gradle or workflow files changed. S1 remains closed.
- R3u is ChatGPT self-audit, not independent `REVIEW_PASS`. Claude review and owner acceptance remain pending. No PR, merge or APK build requested.
- Subsequent documentation commit message uses `[skip ci]` to prevent the repository's broad push-triggered APK workflow.

### 2026-11-18 — H01-R3T-RESEARCH-LAYER-INTEGRATION

- Owner request: complete H01 Batch 02 review, integrate the result into Victori3-mobile, and provide one consolidated download.
- Scope decision: documentation/research integration only. The current phase gate explicitly leaves S1 `NOT_STARTED`, prohibits shipped historical data/content changes and marks gameplay/engine/save changes unauthorized. No runtime population, political ownership, map, save, engine, assets, Android, workflow or APK files were changed.
- Repository/branch: `mtieu6470-maker/Victori3-mobile`, `claude/game-historical-sandbox-modes-kg7rj7`.
- Base HEAD: `d73b548108f1876e3ed9c4c44d175fe560028f28`.
- Research integration commit: `576010a10f75ad493bf8827622ecdc5ffceff3e5` — eight files added under `docs/research/H01_batch02_1836/`: Vietnamese README, consolidated audit report, 17-entity reconciliation, region scope/control flags, source-registry delta, open evidence/acceptance requests, validation report and repository integration map.
- Main findings retained as gated research: OYO 650k and OYO_OYO 1.45m are unverified/quarantined; NDE 60k is a provisional circa-1830s Mzilikazi-led polity estimate (not ethnic Ndebele core) and its 45k–85k range is unverified; NDE_MOS 210k is broad geographic reconstruction only; LIB 3,500 + 100 is unverified; DZ_KRU 356,400 is arithmetic residual only.
- Validation: 17 entities, 15 interval overlaps / 2 non-overlaps (OYO, NDE); 78 region facts; 90 crosswalk rows / 81 unique slots with allocation totals 1.000; 128 provenance claims. CSV rectangular parsing and source ZIP CRC checks PASS.
- Evidence package: `H01_R3t_Integrated_Research_Layer_2026-11-18.zip` (42 files; full R3s audit chain and frozen R3l source package included; SHA-256 recorded in the delivery manifest).
- Status: `RESEARCH_LAYER_INTEGRATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`. This is ChatGPT self-audit, not independent `REVIEW_PASS`; Claude review and owner acceptance remain pending. No PR or merge was created. **Workflow incident:** both documentation pushes auto-triggered `Android APK (debug)` via `push` because the two commit messages omitted `[skip ci]`. Runs `44228047126` (research commit) and `44228160144` (handoff commit) both subsequently completed `success`, each with `apk` job success and `dong-chay-lich-su-debug-apk` artifact (17,555,127 bytes and 17,555,063 bytes respectively). They are incidental debug builds from unchanged game source, not H01 release validation and not device-tested. No product/game source, Gradle, or workflow file changed. The available GitHub connector did not expose a cancel-run action. Subsequent documentation commits use `[skip ci]`.
- Handoff update is the next documentation-only commit after the research integration commit; identify its SHA from Git history rather than embedding a self-referential SHA here.

Append newest entries at the top. Do not overwrite earlier entries.

### 2026-11-17 — R15-PACK-DELIVERY-AND-REAL-CONTENT-ACCEPTANCE

- Project owner clarified that the complete 3–4 GB game must contain meaningful actual game data/assets, not code padded to a size. APK must not appear to be the complete game merely because it is about 18 MB.
- B7 Results §11.3–§11.5 now specifies two delivery paths using the same provider-neutral manifest:
  1. **Sideload/GitHub:** small core APK + multiple downloadable archives/content packs; verify archive and per-file SHA-256, stream extraction to staging, preflight free space, atomic activation/rollback, resume/retry tests, install into dedicated app-private content storage. GitHub Releases is a candidate for public initial distribution: each asset must be under 2 GiB, up to 1,000 assets per release, and GitHub documents no total release-size/bandwidth cap. Resume on redirect must be tested before commitment.
  2. **Google Play:** AAB + PAD with install-time/fast-follow/on-demand packs; do not assume PAD can deliver content for a sideload APK.
- Compression choices are evidence-based: text/JSON/CSV/vector geometry may compress substantially; already-compressed image/audio formats generally cannot be promised to shrink 10×. 3–4 GB compressed payload and 3–4 GB expanded footprint are distinct measures and must be reported separately.
- Runtime delivery: native Android downloader rather than WebView JavaScript for multi-GB downloads; a dedicated internal app-private content folder is mapped to WebView through AndroidX WebViewAssetLoader InternalStoragePathHandler, without exposing save/database/cache directories. Storage preflight includes staging, archives, existing packs for rollback and safety margin.
- B7 Results now prohibits fake size via empty/random/duplicate/padded files, silent/repeated audio, QA docs or source code. Each asset/data group must have actual in-game use, source/provenance/licence, dates/period validity and quality checks. Full Offline Ready is shown only once required packs, versions, dependencies and checksums are verified; otherwise the app explicitly reports Core Only / Missing Pack.
- The B7 review request question 13 now asks Claude to review this full delivery design, integrity/rollback/storage/WebView safeguards, evidence-based compression and genuine content acceptance; Vietnamese summary has section 3.2.
- No installer, assets, packs, images, audio, historical content or product code were implemented/created. This is review/design documentation only. B7 needs a fresh Claude independent review at the new exact HEAD; S1 remains NOT_STARTED.
- Current documentation commits continue to include [skip ci]; no APK workflow modification or intentional build.

### 2026-11-17 — B7-FINAL-REVALIDATION-R15-READY-FOR-CLAUDE

- B7 Results §12 records final pre-review revalidation against branch HEAD `7acd702559f6a51933d49b8b331910a63c8352e1`; compare from B7 preparation base `5d92101e56d6f60045f51f25f926b124eaf892ef` showed 58 commits and exactly eight modified/added paths, all under `docs/audit/s0/` and `docs/coordination/`. No source, engine, save schema, historical data, assets, Android resources, Gradle, tests or workflow changes in B7 range.
- Risk coverage was rechecked at that HEAD: all 42 inherited IDs remain; R3 remains narrowly CLOSED; B4-R1 and S0-SEC-01 remain recorded; owner target risk R15 is added. Eight P3 rows have six-field evidence/impact/mitigation/owner/stage/exit structure.
- Owner target 3–4 GB complete offline footprint is now in R15, signoff P1 table, B7 Results §11, review request question 13 and Vietnamese package summary. Interpreted as expanded offline content across core + packs, not one 3–4 GB APK or a RAM target. Delivery scope stays S23b/S23c; it does not open S1 or authorize implementation.
- Official Play constraints are referenced in the report: AAB/PAD path vs separate sideload pack channel. No hosting provider, paid CDN, asset download or generated media is selected.
- Gate states unchanged: G0.1–G0.6 proposed PASS on bounded evidence; G0.7 BLOCKED; G0.8 PARTIAL; full-S0 G0.9 BLOCKED; R7 open P0; R14/C3 blocked. B4 and B7 remain READY_FOR_REVIEW; S1 remains NOT_STARTED.
- The 21 documentation-triggered APK workflow incident is fully recorded; final status 20 success/1 failure/0 in progress; no new run after skip-ci containment. No APK was downloaded/installed on iQOO. Workflow remains unchanged.
- No product code/tests/assets changed and no build was intentionally run. Next reviewer must re-fetch the exact branch HEAD and inspect the updated B7 request (13 questions) and all R15/incident evidence. Claude remains the assigned independent reviewer; owner ACCEPTED is separate and pending.


### 2026-11-17 — OWNER-3-4GB-OFFLINE-CONTENT-TARGET-RECORDED

- The project owner stated a target of approximately **3–4 GB for the complete game**, prioritizing stability. This is recorded as total verified expanded offline footprint across the core application and content packs, not one monolithic APK size or a runtime RAM target.
- The target aligns with the existing v3.2 decision H (offline >3 GB, provider-neutral manifest/multiple packs) and S23b (image coverage, content packs and offline delivery). It does not open S1 or authorize S23b implementation.
- New B7 P1 risk **R15** added to `S0_RISK_REGISTER.md`: 17,764,559-byte/592-file baseline payload; static DB/map imports at boot; full 8,192 × 3,868 raster decode; whole content registry JSON load; no existing multi-pack installer/resume/atomic-update system; risks include temporary storage, partial pack, WebView/GPU memory, OOM/ANR and offline completeness.
- `S0_SIGNOFF.md` P1 owner/exit table now carries R15 for S23b/S23c only. `S0_B7_RESULTS.md` §11 records the owner target, repository evidence and delivery constraints. `S0_B7_REVIEW_REQUEST.md` now has question 13 requiring Claude to review R15 and ensure it does not expand S1. Vietnamese package summary includes the target and links to official Play Asset Delivery documentation.
- Delivery guidance distinguishes compressed download size, expanded disk footprint and resident RAM. Google Play path must evaluate AAB/PAD; sideload path requires a separate content-pack channel. No paid provider/CDN/hosting service was selected. No image, audio or research data was added.
- Current code observations: `src/ui/main.tsx` statically imports db/map JSON; `HistoricalData` indexes the full DB; `mapData.decodeGrid` allocates the entire grid; `content.ts` fetches the full metadata registry while image elements are lazy. This is an architecture risk to address through approved data/content contracts and later S23b/S23c, not a change made here.
- No product code, assets, historical data, save schema, tests, Gradle or workflows changed. No build or APK workflow was triggered; all documentation commits used `[skip ci]`.
- B7 remains `READY_FOR_REVIEW`; Claude must review the exact current HEAD, now including R15 and the 3–4 GB target. S1 remains `NOT_STARTED` pending independent `REVIEW_PASS` and owner `ACCEPTED`.


### 2026-11-17 — B7-UNINTENDED-APK-WORKFLOW-TRIGGER-INCIDENT

- **Root cause:** documentation commits in the B7 work sequence were pushed without `[skip ci]`. The existing `android-apk.yml` push trigger has no docs-only path exclusion. This safeguard had already been documented in the earlier B4 handoff/self-audit; ChatGPT failed to apply it. This is a coordinator error.
- Initial GitHub Actions query at 2026-11-17 09:16 UTC: 21 push-triggered `Android APK (debug)` runs in the B7 documentation push sequence (08:06:36–09:14:38 UTC): 19 success, 1 failure, 1 in progress. A final recheck after the last run completed recorded **20 success, 1 failure, 0 in progress**. The two final runs also completed successfully: `44053724459` uploaded APK artifact `14314562616` (17,555,134 bytes) and evidence artifact `14315162409`; `44053773347` uploaded APK artifact `14314174885` (17,555,116 bytes) and evidence artifact `14315660764`.
- Verified successful APK build: run `44053488213`, commit `0ec54d8b936369b294174ebd2b894b8b0603ab1b`, job `133936826466`. Job log confirms `./gradlew assembleDebug --no-daemon`, `BUILD SUCCESSFUL in 1m 30s`, and upload of APK artifact `14315256630` (17,555,130 bytes); evidence artifact `14314802216` (103,296 bytes). The raw log was fetched; artifacts were not downloaded.
- Second verified build: run `44053599571` succeeded with APK artifact `14314932258` (17,555,068 bytes) and evidence artifact `14315825776`.
- Failed run `44048307793`: tests still passed 70/70 across 6/6 suites; Gradle failed before APK artifact creation due Maven Central HTTP 429 dependency resolution. CI evidence artifact `14313265291` only; no APK artifact in its artifact listing.
- No APK was downloaded or installed on iQOO; no signature transition or R14 test occurred. The generated CI artifacts do not validate Export/Import or authorize installation.
- `.github/workflows/android-apk.yml` was not edited. The available GitHub connector has no run-cancellation action, so the one pending run could not be cancelled from this session.
- Subsequent document commits in this handoff use `[skip ci]`. Any permanent workflow/path-filter change still requires owner approval. See `S0_B7_RESULTS.md` §9 and `S0_B7_REVIEW_REQUEST.md` question 12.

### 2026-11-17 — B7-PRE-REVIEW-PACKET-READY-CLAUDE-PENDING

- Exact pre-handoff-update branch HEAD re-fetched: `51876c678a8e2700f2c2b2977734a739f2593b62` on `claude/game-historical-sandbox-modes-kg7rj7`.
- GitHub compare from B7 preparation base `5d92101e56d6f60045f51f25f926b124eaf892ef` to that HEAD reports 36 commits and exactly eight changed paths: `S0_B7_PACKAGE_SUMMARY_VI.md`, `S0_B7_RESULTS.md`, `S0_B7_REVIEW_REQUEST.md`, `S0_GATE_LEDGER.csv`, `S0_RISK_REGISTER.md`, `S0_SIGNOFF.md`, `AI_COLLABORATION_PROTOCOL.md` and `AI_HANDOFF.md`. The change set is documentation-only; no product source, engine, RNG, save implementation/schema, migrations, historical data, assets, Android resources, Gradle, workflow or test file changed in the B7 range.
- B7 review packet is ready for Claude: `docs/audit/s0/S0_B7_REVIEW_REQUEST.md`. It identifies Claude as the independent reviewer, asks for exact-HEAD re-fetch and 11 bounded review questions, and includes the current B7 result/summary, risk register, gate ledger, signoff, protocol, roadmap and B3/B4 evidence.
- Final consistency check: all 42 inherited risk IDs remain present; P3 risk entries now carry evidence, impact, mitigation, owner, stage and exit criteria; R11 cites baseline `android/app/build.gradle:10`; AS-F6 is linked to R6. REVIEW_PASS now refers to the assigned independent reviewer. Historical B3 ChatGPT review records remain unchanged.
- Gate values remain unchanged: G0.1–G0.6 proposed PASS on bounded evidence; G0.7 BLOCKED; G0.8 PARTIAL; full-S0 G0.9 BLOCKED while R14/C3 are BLOCKED. R7 remains open P0. B4 remains READY_FOR_REVIEW; B7 remains READY_FOR_REVIEW.
- No independent reviewer verdict is available while Claude is out of quota. This is not a REVIEW_PASS or ACCEPTED. The owner decision is still pending; S1 remains NOT_STARTED.
- No product tests were rerun because only audit/coordination documentation changed. B4's previously verified tests-only run remains the evidence: 44041104723, 6/6 suites, 70/70 tests, no APK artifacts. The B7 documentation pushes also triggered the separate APK workflow unintentionally; see the incident entry below. No APK was downloaded or installed on iQOO.


### 2026-11-17 — B7-RISK-REGISTER-DEEPENED-AND-GOVERNANCE-CONSISTENCY

- Risk register P3 records were expanded with source evidence, bounded impact, interim mitigation, accountable owner, stage and objective exit criteria for GD-F5/GD-F6, WD-F1/WD-F2, RM-F5 and AS-F5/AS-F6/AS-F7. The change preserves source severity and clearly distinguishes known mapping properties from demonstrated defects.
- R11 now cites the observed baseline `android/app/build.gradle:10` value `versionCode = 1` at product baseline `2240a8fb`.
- AS-F6 is explicitly cross-linked to R6 because both concern unpinned Natural Earth input provenance; the local committed-file hash is not treated as upstream version pinning.
- Collaboration protocol status vocabulary now defines REVIEW_PASS as the assigned independent reviewer's verdict (normally Claude; DeepSeek only if owner-assigned and independent). Historical B3 review records naming ChatGPT remain unchanged.
- B7 signoff now identifies Claude Code as the independent reviewer and DeepSeek only as owner-assigned fallback.
- Pre-review GitHub compare from B7 preparation base `5d92101e56d6f60045f51f25f926b124eaf892ef` to the checked HEAD `ead5c6e25e75e20e9d5709dd6164eb53c2809e8b` reported 33 commits and eight changed paths, all under `docs/audit/s0/` or `docs/coordination/`. No product source, engine, RNG, save implementation/schema, historical data, assets, Android resources, Gradle, workflow or test path changed in this range.
- No product tests were rerun because this slice changes documentation only. The existing B4 execution evidence was re-fetched from GitHub: run `44041104723`, job `133895641421`, tested SHA `d2ae88e557e9895413462c5b069886bfc606adc7`, 6/6 suites and 70/70 tests passed; no artifacts.
- B7 remains `READY_FOR_REVIEW`; this work is a ChatGPT technical pre-review, not an independent REVIEW_PASS. Claude's review and the owner's explicit ACCEPTED decision remain pending. S1 remains `NOT_STARTED`.


### 2026-11-17 — OWNER-ROLE-ALLOCATION-ALIGNED

- Owner-directed role allocation recorded in AI_COLLABORATION_PROTOCOL.md: ChatGPT technical lead/coordinator and authorized implementer; Claude independent reviewer; Gemini Hydrogen research/content support; DeepSeek owner-assigned independent fallback only when it did not author the reviewed work.
- The S1 gate now refers to the independent reviewer's REVIEW_PASS, not a ChatGPT self-review. Historical B3 review status is unchanged.
- Documentation/coordination only. No product code, tests, data, assets, workflow, signing or save schema changed.
- B7 remains READY_FOR_REVIEW; independent review and owner ACCEPTED remain pending; S1 remains NOT_STARTED.


### 2026-11-17 — S0-B7-CONSOLIDATED-SUMMARY-READY

- Created Vietnamese consolidation/index: docs/audit/s0/S0_B7_PACKAGE_SUMMARY_VI.md. Summary file commit: ef80c4afcc9f68584d11b8801992bf37765333db; relative-link correction commit: a9fec8f1b16e44cd88e3844a218e78ea7f7eca22.
- It links the risk register, G0.1–G0.9 ledger, signoff proposal, B7 results/review request, B3/B4 source evidence and this handoff; summarizes the exact B4 CI evidence and bounded S1 exceptions.
- Latest recorded B7 status remains READY_FOR_REVIEW. Full-S0 G0.9 remains BLOCKED while R14/C3 are BLOCKED; no S1 work is authorized by the summary.


### 2026-11-17 — S0-B7-G0.9-STATUS-CORRECTION

- Cross-check against OD-20261116-11 §2.1.1 found that full-S0 G0.9 must remain BLOCKED while R14/C3 are BLOCKED. Earlier B7 draft wording said PARTIAL; this was incorrect and has been corrected in S0_GATE_LEDGER.csv, S0_SIGNOFF.md, S0_B7_RESULTS.md and S0_RISK_REGISTER.md.
- Important distinction: the bounded S1-entry risk disposition may be independently reviewed under v3.3 if R7 has owner-accepted interim controls, R14/C3 are isolated as P1 with owner/mitigation/stage/exit criteria, and there is no uncontrolled P0. Such a review does not change the full-S0 G0.9 gate verdict.
- Updated S0_B7_REVIEW_REQUEST.md to make the distinction an explicit reviewer check. No product or workflow changes.


### 2026-11-17 — S0-B7-DRAFT-READY-FOR-REVIEW

- Date (UTC): 2026-11-17
- Task/phase: S0-B7 risk register and bounded S1-entry signoff proposal; preparation completed, awaiting independent review/owner decision.
- B7 deliverables:
  - docs/audit/s0/S0_RISK_REGISTER.md — commit 4f77d72d9d353fb53c95f6347487cc93edec23f1.
  - docs/audit/s0/S0_GATE_LEDGER.csv — commit 60754f8120ef54c508223a27fadd8979cf4b34f3.
  - docs/audit/s0/S0_SIGNOFF.md — commit fddbeb6f6a9100ef084cc43aaa2ab10315cc03af.
  - docs/audit/s0/S0_B7_RESULTS.md — commit ec627dbdf66884807b8a336afe90deace4b817bc.
  - docs/audit/s0/S0_B7_REVIEW_REQUEST.md — commit b1f82cc77e67ee807d3c0db08e75ba97ad7e9222.
- Validation: all five files re-fetched from GitHub; gate ledger contains G0.1–G0.9 rows; review request lists exact source evidence and eleven required reviewer questions. Compare from product baseline 2240a8f to B7 HEAD b1f82cc lists authorized workflows and documentation/audit deliverables only; no src/**, historical_data/**, assets/** or android/** paths changed. The pre-existing android-apk.yml remains unchanged at blob SHA 7a2639057272d2629f2d6b89cfc8fb07682dad31.
- B7 disposition: READY_FOR_REVIEW. The current gate ledger proposes G0.1–G0.6 PASS on bounded evidence; G0.7 BLOCKED overall; G0.8 PARTIAL; G0.9 BLOCKED for full S0 under v3.3 §2.1.1 because R14/C3 remain BLOCKED. Overall S0 is not PASS.
- S1 remains NOT_STARTED. B7 does not authorize implementation; independent REVIEW_PASS and separate owner ACCEPTED of R7 residual risk, G0.7/G0.8 exceptions and exact S1 scope are required.


### 2026-11-17 — S0-B7-RISK-REGISTER-AND-SIGNOFF-DRAFT

- Date (UTC): 2026-11-17
- Task/phase: S0-B7 preparation, explicitly authorized by OD-20261116-11 §6 step 6 after B4 execution evidence was recorded.
- Governance clarification: the owner decision expressly authorizes continuing B7 to prepare the risk register/signoff after B4 in both possible G0.6 outcomes. It does not require B4 independent REVIEW_PASS and owner ACCEPTED before B7 drafting. The earlier phase-register wording imposed that extra prerequisite and has been corrected here. Independent review and owner ACCEPTED remain mandatory for the final bounded S1-entry package; S1 has not started.
- Base HEAD before B7 documents: 5d92101e56d6f60045f51f25f926b124eaf892ef.
- B7 files added:
  - docs/audit/s0/S0_RISK_REGISTER.md — commit 4f77d72d9d353fb53c95f6347487cc93edec23f1.
  - docs/audit/s0/S0_GATE_LEDGER.csv — commit 60754f8120ef54c508223a27fadd8979cf4b34f3.
  - docs/audit/s0/S0_SIGNOFF.md — commit fddbeb6f6a9100ef084cc43aaa2ab10315cc03af.
- Draft gate ledger: G0.1–G0.6 PASS on their bounded evidence; G0.7 BLOCKED overall (Node PASS, desktop PARTIAL/SwiftShader, iQOO BLOCKED); G0.8 PARTIAL (inventory/checksum PASS, licence/attribution unresolved); G0.9 BLOCKED for full S0 while R14/C3 are BLOCKED under v3.3 §2.1.1. Overall S0 remains PARTIAL/BLOCKED, not PASS.
- P0: R7 remains open (no reliable lifecycle autosave/process-death or renderer/WebGL recovery). The owner-approved interim-control principle is recorded, but the signoff still requires explicit owner acknowledgement of residual exposure. No code fix is claimed.
- P1 risks include R1/R14 export/import and save-loss risk; R13 future signing-workflow constraints; content/image licence attribution; global data coverage; empty-pass tests; main-thread performance; dev-tool dependency audit findings; and B4 missing-RNG behavior (deserialize accepts missing rng, next stepMonth throws TypeError).
- Proposed S1-only exceptions are limited to G0.7 iQOO measurement deferral and pre-existing G0.8 licence records, with explicit no-runtime/no-content-change scope. R14 is not an S1 exception for device installation: it continues to block B2/C3, B5/B6 on-device and any different-signature APK install.
- No product source, gameplay, engine, save schema, data, assets, Gradle, signing, secrets or existing APK workflow changed. No APK was built or installed.
- B7 status: IN_PROGRESS; final independent review and owner ACCEPTED are pending. S1 remains NOT_STARTED.


### 2026-11-17 — S0-B4-TESTS-ONLY-CI-PASS

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 full-project test validation using the owner-authorized tests-only workflow; no product/gameplay/engine/save-schema/Android changes.
- Exact workflow run: [`44041104723`](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723); event `workflow_dispatch`; branch `claude/game-historical-sandbox-modes-kg7rj7`; exact checked-out `head_sha=d2ae88e557e9895413462c5b069886bfc606adc7`; job `133895641421`; conclusion `success`.
- Steps: checkout exact SHA — success; Node setup — success; `npm ci` — success; `npm run prepare-assets` — success; `npm run test:fast` — success.
- Generated-data preparation: `build-data: OK` — 274 entities (104 placeholder polities), 662 regions, 13 active alliances, 0 warnings. `build-map`: 8192×3868, 662 regions, 1,426 land borders, 423 sea links, 2,667 landmasses, 5,024 boundary lines; no single-cell regions. Content pack: 502 assets, 8,715,750 bytes (176 flags, 99 coats of arms, 227 portraits); 266 entities linked, 265 entity-text entries, 473 characters (275 linked).
- Vitest result: **6/6 test files passed; 70/70 tests passed; 0 failures; process exit success**. Vitest duration 80.59 s; whole workflow shown in GitHub as 1m35s.
- B4-SA-01: the missing-RNG test passed with current behavior still explicitly characterized as `deserialize` loading `rng=undefined`, then one-month continuation throwing `TypeError`; CI log records `oneMonthContinuation=throws`, `errorName=TypeError`.
- B4-SA-02: both JSON comparator regression tests passed (undefined/object and array ordering semantics; NaN, ±Infinity, and negative-zero normalization).
- Save/load matrix: Historical tick 6 and tick 12 both `MATCH`, final SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`; Sandbox tick 6 and tick 12 both `MATCH`, final SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`. All four report `firstDifferingPath=null`, seed 21, player GBR, 24 months, three scripted commands. Current generated `db.json` SHA-256 `4f4b1fef73aeae19a7fc3e26c2031740240f8306f19be08cf4805d2c1f0a25d6`; `map.json` SHA-256 `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.
- Artifact check: GitHub Actions run artifact list is empty. The tests-only workflow does not assemble or upload an APK. Existing `.github/workflows/android-apk.yml` remains unchanged (blob SHA `7a2639057272d2629f2d6b89cfc8fb07682dad31`).
- Source-diff boundary: compare from B4 test correction commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` to tested HEAD `d2ae88e` lists only the tests-only workflow and audit/handoff documentation; `tests/s0-save-determinism.test.ts` was not changed after `ae29c99`.
- Non-blocking log notes: Node/action deprecation warnings appeared during setup/cleanup; all workflow steps and tests completed successfully.
- Gate: B4 remains `READY_FOR_REVIEW`, not `REVIEW_PASS` or owner `ACCEPTED`. This CI pass is execution evidence, not an independent review. Await genuine second-party Claude review and explicit owner acceptance. B7 remains `NOT_STARTED`.
- Follow-up evidence commits: `c049987b0bf70da19ec3fe689463dd30864f72f6` appends the exact passing run/log details to the ChatGPT technical self-audit; `b831f6c83bcf553f0b5de38182971450429dfb10` appends the successful CI evidence to the independent review request packet. These documentation-only commits do not change the tested source or the tested SHA.


### 2026-11-17 — S0-B4-TESTS-ONLY-CI-GENERATED-DATA-CORRECTION

- Date (UTC): 2026-11-17
- Task/phase: Correct the previously owner-authorized tests-only B4 workflow; no product, gameplay, engine, save, data-source, or Android build changes.
- Base HEAD: `08ec7a3bb485ab0457a99ef77ddeb8ed9a3122e0`.
- CI evidence: tests-only run `44039619132`, exact head `08ec7a3bb485ab0457a99ef77ddeb8ed9a3122e0`; job `133890749856`. `npm ci` succeeded. `npm run test:fast` failed during suite collection: 6 test files failed with `ENOENT` for `src/generated/db.json`; zero assertions/tests ran. The generated directory is ignored by `.gitignore`.
- Root cause: `package.json` defines the canonical `test` script as `npm run prepare-assets && vitest run`; `prepare-assets` runs `data`, `map`, and `content` generators. The first tests-only workflow bypassed this required preparation by calling `test:fast` directly. Map/UI tests also require generated map outputs.
- Correction: the tests-only workflow now runs `npm run prepare-assets` followed by `npm run test:fast`. Push path filters now cover `src/**`, `tools/**`, `historical_data/**`, `assets/map/**`, `public/**`, tests and package/config files so changes to test inputs/generators can retrigger it.
- Explicit exclusions remain: Vite app build, Capacitor sync, Gradle, `assembleDebug`, APK signing/packaging, and artifact upload. Existing `.github/workflows/android-apk.yml` was not edited.
- Files changed for this correction: `.github/workflows/b4-tests-only.yml` and this handoff record only.
- Follow-up documentation commits: `cb4ea8582c503f99e08b40770130c5ff3ac9916f` updates `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md` with the run/log diagnosis and corrected workflow; `edd2f131b28a5511410e47f4661487430a42bd18` updates `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md` so the reviewer uses the corrected test-source commit `ae29c99` and does not reuse the older 69/69 CI result as post-correction evidence.
- Validation after correction: NOT_RUN yet; the corrected workflow needs a fresh manual `workflow_dispatch` run. Current connector has no workflow-dispatch write action. Do not claim the B4 project suite passed until the new run logs prove it.
- Gate status: B4 remains `READY_FOR_REVIEW`; the initial run does not test the B4 assertions. Independent review and owner `ACCEPTED` remain pending. B7 remains `NOT_STARTED`.



### 2026-11-17 — S0-B4-TEST-HARNESS-CORRECTIONS

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 test-harness correction only; no product source or workflow change.
- Base HEAD observed before edits: `a640f6e72da9b76a6504b8827eac2842663cf2b3`.
- Test-harness commit: `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`; changed file: `tests/s0-save-determinism.test.ts` only.
- B4-SA-01 correction: missing-RNG characterization now explicitly expects a `TypeError` during one-month continuation and asserts the error name; observed baseline behavior remains unchanged.
- B4-SA-02 correction: added a JSON stringify/parse round-trip before recursive key canonicalization in `firstJsonDifference`; added regression coverage for `NaN`, positive/negative infinity, negative zero, undefined/non-finite array entries, and array ordering.
- Validation: isolated Node helper smoke check passed 8 assertions. This is not the project Vitest suite and not CI evidence.
- Project Vitest/build/CI: `NOT_RUN` for this commit. Commit message contains `[skip ci]` to avoid triggering `.github/workflows/android-apk.yml`, which would assemble and upload an APK.
- Workflow authorization: no workflow changed. A tests-only CI path is still needed to validate test-harness changes without violating the R14 no-new-APK restriction.
- Audit report addendum: `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md`, follow-up recorded in commit `634c2c6b1d856751963c0e811318041717a992da`.
- Independent review: pending; Claude should review the exact final HEAD when quota is available. ChatGPT is not claiming a second-party `REVIEW_PASS`.
- Owner decision: B4 source corrections authorized by owner instruction in chat; acceptance and B7 transition remain pending.
- B7: `NOT_STARTED`.

### 2026-11-17 — S0-B4-CHATGPT-TECHNICAL-SELF-AUDIT

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 bounded technical self-audit; no product or test source changes.
- Assessed branch HEAD: `0b915ff75c9dab1a1195ac648d3c68acfd073a9c`.
- B4 implementation/test commit: `e4924ca48264f8d0818eface51a28a87cd363b89`; product baseline: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
- Audit report: `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md`, added in documentation-only commit `8cc48081737b8830ef5d4b4aca7749c1747b5321`.
- Evidence rechecked: coordination protocol/handoff, B4 test, B4 review packet, baseline types/init/save/core/simulation, Android APK workflow, GitHub compare metadata, CI run `44032178418` / job `133866471284` / job log / artifact metadata.
- Git range: `e4924ca` → assessed HEAD `0b915ff` contains five documentation-only commits affecting the review request and handoff; no B4 test-source change after the implementation commit.
- Positive evidence: CI reports 69/69 tests, 26/26 suites, `report_valid=true`; all four Historical/Sandbox × tick-6/tick-12 cases report `MATCH`, equal final hashes and `firstDifferingPath=null`.
- Findings:
  - B4-SA-01 (P2): `tests/s0-save-determinism.test.ts:316-339` records missing-RNG continuation result but never asserts `throws` / `TypeError`; add those expectations in the test harness.
  - B4-SA-02 (P2): `canonicalize` / `firstJsonDifference` handle undefined and ordering correctly but do not make the first-difference comparator fully equivalent to JSON for `NaN`, infinities and `-0`; normalize through actual JSON semantics (then sort object keys) and add regression cases, or explicitly reject non-finite numbers.
- No changes were made to test source because the currently triggered push workflow would also build and upload an APK; no tests-only CI path is authorized. No local test/build was run by this reviewer.
- Workflow/R14: run `44032178418` completed successfully and built/uploaded APK artifact `14304929645`; artifact metadata only was inspected. No APK/evidence artifact was downloaded, and no APK was installed. R14 remains unverified. No workflow change or `workflow_dispatch` was made.
- Technical self-audit conclusion: `CHANGES_REQUESTED` for the bounded B4 test/evidence package, not an independent second-party verdict. Formal B4 lifecycle remains pending independent review and owner acceptance; B7 remains `NOT_STARTED`.
- CI side effect control: this audit report and handoff update use `[skip ci]` documentation commits to avoid retriggering the existing APK workflow. This skips CI and is not a substitute for a tests-only workflow.
- Owner decision: pending; no phase transition authorized.

### 2026-11-17 — S0-B4-SAVE-LOAD-DETERMINISM-EVIDENCE

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 characterization tests under OD-20261116-11, after S0-B3 `REVIEW_PASS` (recorded in commit `2aa8c6c141fef2c060303be7a15df834a71e217e`). Scope limited to test harness/comparator and handoff evidence.
- Branch: `claude/game-historical-sandbox-modes-kg7rj7` (sole/default branch; re-verified).
- Product baseline SHA: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
- B4 commits:
  - `8502648f7ad8875eb0f07046cbdbf990c40c1224` — initial save/load characterization tests;
  - `c4dbd56dc02abd18fab62e2e90747fcd52a58f24` — corrected optional `marketStats` fixture typing;
  - `e4924ca48264f8d0818eface51a28a87cd363b89` — JSON-semantic comparator normalization and regression test.
- Changed file in the comparator correction: `tests/s0-save-determinism.test.ts` only. No `src/`, engine, RNG implementation, `save.ts`, save schema, data, asset, Android resource, or workflow file was changed by the B4 test patch.
- Root-cause check for `countries.ABD.group`: `Country.group` is optional (`src/engine/types.ts:41`); `src/engine/init.ts:179` assigns `group: e.group`; `src/engine/save.ts:7-13` serializes/deserializes with JSON. A review of all 22 TypeScript files under `src/engine/` found no engine use of `hasOwnProperty`, the `in` operator, `Object.keys`, or equivalent reflection to distinguish a missing `group` key from an own key whose value is `undefined`. JSON omits undefined-valued object properties and writes undefined array entries as `null`. The comparator now follows these JSON semantics while preserving array order; a focused regression test checks omission, array order, and undefined array entries.
- CI: [run 44032178418](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44032178418), job `133866471284`, exact HEAD `e4924ca48264f8d0818eface51a28a87cd363b89`, conclusion `success`.
- Test results: 69/69 tests passed; 26/26 suites passed; 0 failures; `vitest_exit_code=0`; `report_valid=true`.
- Determinism matrix (all 24 months, seed 21, player GBR, three scripted commands; same engine/data/map build):
  - Historical, save at tick 6 (1836-07): `MATCH`; uninterrupted/save-load state SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`.
  - Historical, save at tick 12 (1837-01): `MATCH`; same state SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`.
  - Sandbox, save at tick 6 (1836-07): `MATCH`; uninterrupted/save-load state SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`.
  - Sandbox, save at tick 12 (1837-01): `MATCH`; same state SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`.
  - All four cases reported `firstDifferingPath=null`. Data hashes: `db.json` `1ce3a4613e1b5c491b88386d25d297961d71baf78c2c8e67d58c8d54ccb3bd24`; `map.json` `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.
- Save compatibility observations:
  - malformed JSON: `SyntaxError`;
  - foreign format: rejected;
  - unsupported version 999: rejected;
  - missing envelope state: `TypeError`;
  - missing `marketStats`: deserializes with empty-object fallback and one-month continuation does not throw;
  - missing RNG: currently deserializes with `rng=undefined`, then `stepMonth` throws `TypeError`. This is a real compatibility/validation risk; B4 records it only and does not change engine/save/RNG.
- CI workflow side effect / R14 exception record: the existing push-triggered `android-apk.yml` continued automatically after tests passed and assembled/uploaded a debug APK, contrary to the explicit instruction not to generate a new APK before R14. APK artifact `14304929645` (`dong-chay-lich-su-debug-apk`, 17,555,167 bytes) was uploaded; its digest `sha256:6a6c9b49298950c8d096f0e7d4ceb1d4ed02120e4ba396d3c24a55499297034d` is the **artifact ZIP digest, not the APK file SHA**. CI evidence artifact `14305343860` was also uploaded (103,182 bytes; ZIP digest `sha256:bd84e0219336c206aff3a8ba4e8f9b3d8469e6b6b3146ffd701b2248cd75cebe`). ChatGPT did not download either artifact and did not install any APK on iQOO. R14 remains unverified; the automatically generated APK is not approved for device installation or R14 validation.
- Gate assessment: G0.6 technical characterization result `PASS` on baseline `2240a8f`, because both modes and both save cut points match, fixtures are non-vacuous, array order is retained, and malformed/legacy-save behavior is recorded. This is a technical evidence assessment, not an independent review verdict or owner acceptance. S0 overall is not PASS.
- Risks/limitations: missing RNG remains accepted by `deserialize` and crashes on continuation; R14 remains unverified; the CI workflow's automatic APK packaging is a known process hazard and was not modified in S0.
- Execution/review separation: ChatGPT made the comparator/test-only correction directly through GitHub. Therefore ChatGPT does **not** claim an independent `REVIEW_PASS` for its own correction. Task status is `READY_FOR_REVIEW`; independent review and owner `ACCEPTED` remain pending. B7 remains `NOT_STARTED`.
- ChatGPT review: independent review not claimed (reviewer authored the comparator change).
- Owner decision: pending; no B7/S1 transition authorized by this entry.
- Independent review packet: `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md` (added in commit `86ea7154415c3fca1fcefcc99428c03d607ca9af`; documentation only). It asks a second reviewer to independently assess JSON comparator semantics, missing-RNG characterization, B4 coverage, and the R14 workflow side effect. No repository writes requested from the reviewer.
### 2026-11-16 — S0-B3-REVIEW1-CORRECTIONS

- Date (UTC): 2026-11-16 (after the owner relayed the ChatGPT round-1 review)
- Task/phase: S0-B3 corrections for review round 1 (`CHANGES_REQUESTED`, points A–D in section 6). Audit tools and reports only
- Implementer: Claude Code
- Base SHA: `1d8ad6ec60923527cd86dd5b3d584913f3b9cd5f`. Audited code: `2240a8f` in a new clean temporary worktree (`npm ci` 0, `npm run build` 0)
- Head SHAs:
  - `ddea490` (tools);
  - `2c62b3d` (reports and evidence);
  - this handoff update (GitHub commit metadata).
- Changed files:
  - `tools/audit/s0/global_data_audit.ts`;
  - `tools/audit/s0/probe_war_duration.ts` (new);
  - `docs/audit/s0/S0_B3_RESULTS.md` (new §4.1, §8; P0 text in §4);
  - `docs/audit/s0/S0_GLOBAL_DATA_AUDIT.md` (§1, §1.1, §2.2, §2.3, §5);
  - `docs/audit/s0/S0_TEST_CATALOG.md` (TC-F2);
  - `docs/audit/s0/S0_REQUIREMENT_MATRIX.csv` (row MS-13.5-04 only);
  - `docs/audit/s0/b3/review1/**` (new);
  - `docs/coordination/AI_HANDOFF.md`.
- Summary:
  - A: the `estimated` category is described as label-based. Method coverage is added: 262 initial law sets are estimated without a method. RM-F1 is reproduced by the tool (270/334 estimated, 18/62 uncertain without a method).
  - B: 12 analysis groups, West Asia and Middle East merged; no claim of 13 independent regions.
  - C: no new P0 in B3. R7 (P0, pre-identified) is still open: grep found no lifecycle or WebGL context-loss handlers; only a game-date January autosave exists.
  - D: 145 is a counting convention. Initial wars are stored with `start = -1` (`init.ts:143`) and exist for exactly 144 month-ends; wars declared by the AI lasted at most 7–9 months in 4 scenarios.
  - New findings: WD-F1 (P3, latent 145-month asymmetry for declared wars), WD-F2 (P3, real pre-1836 start dates dropped), WD-F3 (P2, 5 of 8 initial wars end by capitulation at tick 5 in every scenario).
  - A proposed test is recorded; no test or engine change.
- Commands and exit codes: see `docs/audit/s0/b3/review1/logs/`.
  - Tool runs: all 0.
  - Before/after comparison: per-group counts unchanged.
  - `npx tsc --noEmit`: 0.
  - Product-source `git diff --quiet` against `2240a8f`: 0.
  - Secrets scan: no match.
  - `git commit`: 0.
- Test results (counts and failures): no product test run needed (no product or test change); CI on push
- CI run/jobs: recorded after push in the reply to the owner
- Artifacts: none
- Device evidence: none (`BLOCKED`)
- Risks/limitations: before-correction evidence kept at the old paths and in `55331c2`. The matrix row change was made through the same auditor-written source as before. WD-F3 is an observation from the engine and `db.wars`; historical end dates were not evaluated
- Claude status (unverified): `READY_FOR_REVIEW` (round 2)
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-B3-AUDIT-TOOLS-AND-REPORTS

- Date (UTC): 2026-11-16, about 09:45–10:57 (tools commit and reports commit pushed 10:57; this handoff update afterwards)
- Task/phase: S0-B3 (v3.3 §3.1), authorized by OD-20261116-11; stopped at `READY_FOR_REVIEW`; B4 not started
- Implementer: Claude Code
- Base SHA: `9a602f3d60456c014fb33d4ebd83f174af299077`. Audited code: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` in a clean temporary worktree, `npm ci` + `npm run build`. The worktree's `git status --porcelain` was empty after all runs
- Head SHAs:
  - `3d63061e4bd5b3fdf7c636370da462a5b0f5d721` (tools);
  - `55331c2bf629bb631701ec82020c7f9deaa7da81` (reports and evidence);
  - this handoff update (GitHub commit metadata).
- Changed files:
  - `tools/audit/s0/` (10 new files, outside product code);
  - `docs/audit/s0/`: `S0_B3_RESULTS.md`, `S0_TEST_CATALOG.md`, `s0_test_catalog.json`, `S0_REQUIREMENT_MATRIX.csv`, `S0_GLOBAL_DATA_AUDIT.md`, `S0_ASSET_AUDIT.md`, `S0_PERFORMANCE_BASELINE.md/.json`, `b3/**` (logs added with `-f`);
  - `docs/coordination/AI_HANDOFF.md`.
- Product source check: `git diff --quiet 2240a8f HEAD -- . ':(exclude)docs' ':(exclude)README.md' ':(exclude).github/workflows/android-apk.yml' ':(exclude)tools/audit/s0'` → exit 0. No product, test, generator, data, asset, save or RNG change
- Summary (self-assessed gates, details in `S0_B3_RESULTS.md`):
  - G0.3 test inventory `PASS`: 58/58 runtime tests catalogued with executed assertion counts and 7/7 stability.
  - Empty-pass findings: TC-F1 `simulation.test.ts:34` and TC-F2 `simulation.test.ts:43` ran 0 assertions; TC-F3 `content.test.ts:41` is core-vacuous; TC-F4 is the 1870/1875 mismatch at `simulation.test.ts:21`.
  - G0.4 requirement matrix `PASS`: 353 atomic requirements of MASTER_SPEC_VI §§0–17 — Implemented 24, Partial 173, Placeholder 6, Missing 140, Unverified 10, Broken 0; file:line re-verified at `2240a8f`.
  - G0.5 global data `PASS`: 12 macro-regions; sourced/estimated/default/missing/labelled-without-source; admin-1 × 662-region crosswalk with 4 374 pairs.
  - G0.8 asset/licence `PARTIAL`: 627-file SHA-256 manifest; 492 image licences recorded but not re-verified; 4 BY assets without author.
  - G0.7 runtime/performance `BLOCKED` (device): Node `PASS`, tick p50 ≈ 20–21 ms, p95 29–33 ms over 1 200 months × 3 runs × 2 modes; desktop `PARTIAL`, headless Chromium + SwiftShader, throughput 0.37–0.47 months/s at every speed (frame production bound), tick callback p95 39–63 ms; iQOO `BLOCKED`.
  - New findings RM-F1…F5 (P1: RM-F3, simulation on the main thread).
  - No P0 found.
- Commands and exit codes: every tool run is logged with `[exit N]` in `docs/audit/s0/b3/logs/` (all 0). Before push, `npx tsc --noEmit` found 2 type errors in the unpushed tools commit (`probe_empty_pass.ts:28`; `tsconfig.json` includes `tools/`); fixed with a type annotation and amended before the first push; `tsc` 0; probe re-run byte-identical. `git commit` 0; `git push` 0
- Test results (counts and failures): baseline suite 58/58 passed in the catalog run (`b3/logs/b3_assertion_count_run.log`); no failures
- CI run/jobs: push of `55331c2` triggered run `43853414428`, job `133251491545`: `success`, 10:57:23–11:00:44 UTC. All steps passed:
  - build with `tsc` over `tools/`;
  - unit and simulation tests with the B1 report validation;
  - APK assembly, checksum and manifest recording;
  - both artifact uploads (APK ZIP `14221065197`, digest `601c57b8…`; evidence ZIP `14220660343`, digest `7f3551f5…`).

  The artifacts are not part of the B3 evidence and were not downloaded
- Artifacts: none uploaded by B3; all evidence is committed under `docs/audit/s0/b3/`
- Device evidence: none (`BLOCKED`)
- Risks/limitations:
  - `actionlint` `NOT_TESTED` (running the downloaded binary was denied; not worked around).
  - Desktop numbers come from CPU-rendered WebGL; they are not representative and never substitute iQOO.
  - Runtime display of CC BY-SA attribution `NOT_TESTED` (static only).
  - Legacy licences not re-verified on Commons.
  - The matrix is auditor-written.
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-V3.3-ACCEPTANCE-DOCS

- Date (UTC): 2026-11-16 (this handoff update commit; GitHub commit metadata)
- Task/phase: record OD-20261116-11; commit the v3.3 documents, the G0.4 source and the protocol sentence
- Implementer: Claude Code
- Base SHA: `e13d964f343ab1ba01fb705fbbd8bcac2674ea80`
- Head SHA: this commit (GitHub commit metadata)
- Changed files:
  - `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` (new, verbatim);
  - `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` (new, verbatim);
  - `docs/roadmap/SOURCE_REGISTER.v3.3.md` (new);
  - `docs/spec/MASTER_SPEC_VI.md` (new, byte-for-byte);
  - `docs/coordination/AI_COLLABORATION_PROTOCOL.md` (one sentence, decision §2.2);
  - `docs/coordination/AI_HANDOFF.md`.
- Summary: the owner confirmed in the session that the uploaded decision document is the official OD-20261116-11. Files were copied unmodified and SHA-256 checked before commit (`929c06f4…`, `582a8a4e…`, `d7fa8995…`); the spec copy also matches its entry in the owner's handover ZIP
- Commands and exit codes: `cp` (0); `sha256sum` (0, equal to the expected values); `git commit` (0); `git push` (0)
- Test results (counts and failures): `NOT_APPLICABLE` — documentation only
- CI run/jobs: push-triggered B1 workflow; not observed when this entry was written
- Artifacts: none
- Device evidence: not applicable
- Risks/limitations: the verbatim headers still carry draft wording; acceptance is recorded here and in the source register
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-B1-CI-CHECKSUMS-TEST-REPORT

- Date (UTC): 2026-11-16 (plan and revisions in the session; workflow commit 08:51; evidence commit 09:34)
- Task/phase: S0-B1, authorized by the owner's B1 instructions (OD-20261116-10B); applied the reviewed candidate only
- Implementer: Claude Code
- Base SHA: `d6edfc1c008000b6048459b835dd0cf47f825f03`
- Head SHA: `382aaa84b2336854b4dbebfcdc719847ff463f41` (workflow); `e13d964f343ab1ba01fb705fbbd8bcac2674ea80` (evidence)
- Changed files: `.github/workflows/android-apk.yml` (+288/−1; SHA-256 `82458e9c…`; diff identical to the reviewed `fe6115b2…`); `docs/audit/s0/S0_B1_CI_EVIDENCE.md`, `docs/audit/s0/logs/b1/**`
- Summary: the CI now records provenance, generated-data and web-bundle hashes, a Vitest JSON report cross-validated against a task-tree reporter, Android/APK payload manifests, the APK file SHA-256 and, separately, the artifact ZIP digest, in an evidence artifact. Pipeline label `AUDIT_INSTRUMENTED`; product source identical to `2240a8f`
- Commands and exit codes: local pre-commit checks — `git diff --check` 0, YAML parse, `bash -n` ×11 0, `node --check` ×2 0, real suite 0, failing probe 1 (expected); `git commit`/`git push` 0
- Test results (counts and failures): CI 58/58 (5 files), 0 failures, `report_valid=true`; JSON and task-tree counters equal (22 suites / 58 tests)
- CI run/jobs: run `43834719406`, job `133188390842` success (17/17 steps); `GITHUB_TOKEN` Contents/Metadata read only
- Artifacts:
  - APK ZIP `14210308010`: ZIP SHA-256 `7717a2b7…`; APK file SHA-256 `314c8ca1…`, 18 042 486 bytes;
  - evidence ZIP `14209784110`: SHA-256 `53cab2e3…`.
  - All independently re-hashed after download.
  - Four-group payload classification: every difference is `built_at`/`generated` or the bundle name.
- Device evidence: none (`BLOCKED`)
- Risks/limitations: CI failure path only probed locally; `actionlint` `NOT_TESTED`; debug key changes per run (F2)
- Claude status (unverified): `READY_FOR_REVIEW`. The reviewer's technical verdict `PASS` is recorded from the v3.3 proposal §2.1
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-A (baseline as-is)

- Date (UTC): 2026-11-16, 06:28–06:39 (commits `7d6eec9` 06:30, `d5b9820` 06:31, `8073fac` 06:39; this handoff update afterwards)
- Task/phase: S0-A — approved document §6.3 A1–A5, authorized by OD-20261116-10
- Implementer: Claude Code
- Base SHA: `e4ef9539e97b15488394cea24e4ce5368d749368` (code baseline audited: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`)
- Head SHA: `8073fac029463c0685435985a2968cd5a3aba4ab`, then this handoff update commit (GitHub commit metadata)
- Changed files: only under `docs/audit/s0/` — `S0_REPOSITORY_SNAPSHOT.md`, `S0_BUILD_TEST_REPORT.md`, `S0_A_RESULTS.md`, `logs/a1/` (7), `logs/a2/` (23), `logs/a4/` (3), `a4/` (10), `inputs/APK_BASELINE_WEB_ASSETS_SHA256.csv` (reviewer file, SHA-256 unchanged `78c4a21f…`); plus this handoff
- Summary:
  - A1: snapshot; artifact `14193446122` re-downloaded and hashed (ZIP/APK SHA-256 equal the recorded values; 592-file manifest equals the reviewer CSV).
  - A2: clean build in a temporary worktree of `2240a8f`; all 9 standard commands exit 0; 58/58 tests ×3, identical test lists.
  - A3: generated-file SHA-256 before/after every step; tests write nothing.
  - A4: `web/data payload comparison completed` — 587 exact; the cordova files are written by Capacitor at packaging; three files differ only in `built_at`/`generated` and the bundle name, proven by diff.
  - A5: `BLOCKED`.
- Commands and exit codes: listed with their exit codes in `docs/audit/s0/logs/a1/*.log`, `logs/a2/summary.txt` and step logs, `logs/a4/*.log`; all build/test commands exit 0; `npm audit` exit 1 (findings, read-only)
- Test results (counts and failures): 3 local runs, each `Test Files 5 passed (5)`, `Tests 58 passed (58)`; 0 failures; CI baseline job `133056831671` 58/58
- CI run/jobs: documentation commits all `success` — `6c4d02a` run `43814947854`, `c74b606` run `43815102462`, `574ddc7` run `43816739598`, `e4ef953` run `43816839693`, `7d6eec9` run `43817262861`, `d5b9820` run `43817299052`; `8073fac` run `43818265471` was in progress when this entry was written
- Artifacts: none produced by S0-A in the repository (APK/ZIP not committed; hashes and manifests recorded)
- Device evidence: none yet — A5 device part `BLOCKED` pending owner (§6.5.1 steps 1–4)
- Risks/limitations:
  - F1: `npm audit` reports 6 dev/build-tool vulnerabilities, not fixed.
  - F2: the CI debug key differs per run (verified on two runs; confirms R1).
  - F4: `.gitignore` `*.log` required `git add -f`.
  - No Android SDK, so APK signature v2/v3 was not checked.
  - A5 Node/desktop needs the S0-B B3 harness (not authorized).
- Claude status (unverified): `READY_FOR_REVIEW`. Gate verdicts (self-assessed): G0.1 `PASS`, G0.2 `PASS`, G0.3 `PARTIAL`, G0.4 `NOT_TESTED`, G0.5 `NOT_TESTED`, G0.6 `NOT_TESTED`, G0.7 `BLOCKED`, G0.8 `NOT_TESTED`, G0.9 `NOT_TESTED`; S0 overall not complete
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-V3.2-APPROVED-DOCS

- Date (UTC): 2026-11-16 (commit `574ddc7` at 06:26 UTC; this handoff update afterwards)
- Task/phase: commit the owner-approved S0 v3.2 documents verbatim; record the approval and the S0-A authorization
- Implementer: Claude Code
- Base SHA: `c74b6068364db07f2b8d39bc64698001544cf468`
- Head SHA: `574ddc7ac57267ecae2216cb9ee1d490f3b41626`, then this handoff update commit (GitHub commit metadata)
- Changed files: `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` (new), `docs/roadmap/SOURCE_REGISTER.v3.2.md` (new); handoff update commit: `docs/coordination/AI_HANDOFF.md`, `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (canonical roadmap pointer), `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` (roadmap status sentence in the notice only)
- Summary: the two files were copied from the delivered versions; SHA-256 equal to the owner's values before commit (`sha256sum` on the working copies) and after commit (`git show HEAD:<path> | sha256sum`)
- Commands and exit codes: `cp` (0), `sha256sum` + `diff` against the owner's values (0, identical), `git commit` (0), `git show HEAD:<path> | sha256sum` (0, identical), `git push -u origin claude/game-historical-sandbox-modes-kg7rj7` (0)
- Test results (counts and failures): `NOT_APPLICABLE` — documentation only
- CI run/jobs: push-triggered `.github/workflows/android-apk.yml`; not observed when this entry was written
- Artifacts: none beyond the CI's automatic debug APK artifact
- Device evidence: not applicable
- Risks/limitations: the approved file's header keeps its pre-approval wording (verbatim requirement)
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision: approved (OD-20261116-09)

### 2026-11-16 — COORDINATION-REVIEW-BD5787F

- Date (UTC): 2026-11-16 (commit `6c4d02a` at 06:10 UTC; handoff update commit afterwards)
- Task/phase: `COORDINATION-REVIEW-BD5787F` — documentation corrections from the owner's review of `bd5787f`
- Implementer: Claude Code
- Base SHA: `bd5787f3e1763170ec7e5ad448466a5cc57c2b40`
- Head SHA: `6c4d02a36a30f7e82d973da59f569b379f85468d`, then the handoff update commit (GitHub commit metadata)
- Changed files: `docs/coordination/AI_COLLABORATION_PROTOCOL.md`, `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` (notice only), `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (new), `docs/coordination/AI_HANDOFF.md`
- Summary: protocol — sole/default-branch policy, PRs only on explicit owner request, task lifecycle separated from gate verdicts, `PRE_PROTOCOL_IMPLEMENTED_REPORTED`, canonical roadmap pending; legacy architecture proposal marked non-authoritative with its known conflicts listed; legacy roadmaps indexed and pre-protocol stages 1–5 registered; this handoff records the setup SHA, task states and owner decisions
- Commands and exit codes: `git commit` (0) and `git push -u origin claude/game-historical-sandbox-modes-kg7rj7` (0) for `6c4d02a`; the same two commands for the handoff update commit
- Test results (counts and failures): `NOT_TESTED` locally — documentation-only change, no build or test command run
- CI run/jobs: each push triggers `.github/workflows/android-apk.yml` automatically; results for `6c4d02a` and the handoff update commit were not yet observed when this entry was written — read them from GitHub Actions
- Artifacts: none beyond the CI's automatic debug APK artifact
- Device evidence: not applicable
- Risks/limitations: the canonical roadmap is not in the repository; the legacy architecture body is unchanged, only the notice was added; the notice's conflict list adds a fifth item (building IDs, decision E) beyond the owner's four; observation for the signing design (no change made): GitHub Actions runs from Claude's pushes list `mtieu6470-maker` as actor and triggering actor
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision:

### 2026-11-16 — COORDINATION-SETUP

- Date (UTC): 2026-11-16 (commit `bd5787f` at 06:02 UTC)
- Task/phase: `COORDINATION-SETUP`
- Implementer: Claude Code
- Base SHA: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
- Head SHA: `bd5787f3e1763170ec7e5ad448466a5cc57c2b40`
- Changed files: `docs/coordination/AI_COLLABORATION_PROTOCOL.md` (new, SHA-256 `eb1f86590a64fb6fb283aac50c1ffd7fb5f34fc532fcd218c8c430102822e997`), `docs/coordination/AI_HANDOFF.md` (new, SHA-256 `056912b880cc386df1067d3691d602613e12e437dd08190c4a2504919aa52dcd`) — both identical to the owner's setup package; `README.md` (+1 line)
- Summary: added the collaboration protocol and the shared handoff index; documentation only
- Commands and exit codes: `cp` of the two files from the package, `sha256sum` comparison (identical), `git commit` (0), `git push -u origin claude/game-historical-sandbox-modes-kg7rj7` (0)
- Test results (counts and failures): no local run; CI job log: `Test Files 5 passed (5)`, `Tests 58 passed (58)`, `Duration 74.23s`; `BUILD SUCCESSFUL in 1m 25s`
- CI run/jobs: run `43814108497` (https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43814108497), job `133122102826`, conclusion `success`
- Artifacts: `14201681874` `dong-chay-lich-su-debug-apk`, ZIP 17,555,085 bytes, ZIP digest `sha256:2b1cabe893509b3124e37428c4913d80331c4dcce955dc96fee0bf7dff4945c3` (ZIP digest, not an APK hash), expires 2027-02-14
- Device evidence: not applicable
- Risks/limitations: seven conflicts reported after the commit; decided by the owner (section 7) and corrected in `COORDINATION-REVIEW-BD5787F`
- Claude status (unverified): `READY_FOR_REVIEW` at commit time
- ChatGPT review:
- Owner decision: `CHANGES_REQUESTED` (owner review of `bd5787f`, 2026-11-16; section 7)

### Entry template

- Date (UTC):
- Task/phase:
- Implementer:
- Base SHA:
- Head SHA:
- Changed files:
- Summary:
- Commands and exit codes:
- Test results (counts and failures):
- CI run/jobs:
- Artifacts:
- Device evidence:
- Risks/limitations:
- Claude status (unverified):
- ChatGPT review:
- Owner decision:

## 6. Review findings

Source of the rows below: ChatGPT review of S0-B3 round 1 (verdict `CHANGES_REQUESTED`), relayed by the owner in the session on 2026-11-16. Checked commits: `3d63061`, `55331c2`, `1d8ad6e`; CI run `43853414428` success. The reviewer confirmed the audit scope was respected.

Gate results reported by the reviewer:

| Gate | Result |
|---|---|
| G0.3 | `PASS` |
| G0.4 | `PASS` |
| G0.5 | `PASS`, with a note on the grouping |
| G0.6 | `NOT_TESTED` (B4) |
| G0.7 | `BLOCKED` (iQOO) |
| G0.8 | `PARTIAL` |
| G0.9 | `NOT_TESTED` (B7) |

The Status column is Claude's claim, pending re-review.

| ID | Severity | Finding | Evidence | Status | Required action |
|---|---|---|---|---|---|
| B3-R1-A | Change request | The `estimated` category is assigned by quality label without checking `method`, but the report described it as data with an estimation method | `tools/audit/s0/global_data_audit.ts`; `S0_GLOBAL_DATA_AUDIT.md` §1 | Addressed in `ddea490`/`2c62b3d` (Claude, unverified) | Correct the wording; keep RM-F1 and count missing `method`; no data change |
| B3-R1-B | Change request | 12 statistical groups vs the 13 regions of MASTER_SPEC_VI §1.2 (West Asia and Middle East merged) | `tools/audit/regions.ts`; `S0_GLOBAL_DATA_AUDIT.md` | Addressed (Claude, unverified) | State 12 analysis groups and the merge; no claim of 13 independent regions; no partition change |
| B3-R1-C | Change request | "No P0" must distinguish no new P0 in B3 from the pre-identified, still-open R7 | `S0_B3_RESULTS.md` §4 | Addressed (Claude, unverified) | Record that R7 remains open and is not considered resolved |
| B3-R1-D | Change request | `tests/simulation.test.ts:43` runs 0 assertions; probe showed a longest war of 145 months while the engine ends wars at `months > 144` | `S0_B3_RESULTS.md` §4.1; `b3/review1/probe_war_duration_*.json` | Addressed (Claude, unverified): counting convention, findings WD-F1…F3, proposed test | Check `w.start`, `st.tick` and start/end timing; record a finding and a correct test; no engine or test change |

### 2026-11-17 — S0-B3-REVIEW-ROUND-2 (ChatGPT)

- Reviewer: ChatGPT (independent reviewer under AI_COLLABORATION_PROTOCOL.md)
- Exact reviewed branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Exact reviewed HEAD: `e80ddfc5aa030a625f7e95f1c551800642e6bd55`
- Audited product baseline: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
- Verdict: **`REVIEW_PASS` for the bounded S0-B3 audit deliverables only**. This is not `ACCEPTED`, does not declare S0 complete/PASS, and does not authorize gameplay, engine, save, data, asset, signing, or device changes.
- Scope check: GitHub compare baseline `2240a8f` → reviewed HEAD `e80ddfc` reports 18 commits / 146 changed paths. Independent path classification found no changes under `src/`, `historical_data/`, `public/`, `tests/`, or Android product resources. Changes are the already-authorized B1 workflow, audit tooling, audit reports/evidence, and coordination/roadmap documents.
- G0.3: **`PASS`** — catalog contains 58 runtime tests from 51 static call sites; 0 unmatched runtime tests; 0 tests without analysis; every catalogued test passed in all 7 recorded runs. The audit correctly exposes two zero-assertion tests (TC-F1, TC-F2) and the core-vacuous content test (TC-F3); these are findings, not hidden passes. The reviewer inspected the assertion counter, catalog generator, raw assertion log, catalog JSON and run log; execution was not independently rerun by this reviewer.
- G0.4: **`PASS`** — 353 unique requirement IDs cover MASTER_SPEC_VI §§0–17; statuses reconcile to 24 `Implemented`, 173 `Partial`, 6 `Placeholder`, 140 `Missing`, 10 `Unverified`, 0 `Broken`. All 24 `Implemented` rows have test evidence. This is a pass for audit-matrix coverage/traceability, not a claim that the product is complete.
- G0.5: **`PASS` with explicit grouping limitation** — audit accounts for 274/274 entities and 662 map regions; 12 analysis groups are disclosed, with West Asia and Middle East merged (not claimed as 13 independent groups); 0 entities are unassigned. It also discloses five supported head-of-state records without sources, 270/334 estimated and 18/62 uncertain entity facts without a recorded method, and the uneven regional coverage.
- G0.7: **`BLOCKED` overall** — Node measurements are recorded across three runs per mode; browser measurements are from headless Chromium + SwiftShader only and are explicitly marked non-representative; iQOO Z10 Turbo measurements are absent. No server/desktop value is treated as device evidence.
- G0.8: **`PARTIAL`** — 627-file inventory/checksum manifest; 492 image records retain licence metadata as recorded but not reverified; four CC BY/CC BY-SA records lack author attribution; 34/35 Android resources match Capacitor template defaults; portrait period metadata and third-party notices remain issues.
- G0.6: **`NOT_TESTED`** (reserved for B4). G0.9: **`NOT_TESTED`** (reserved for B7). S0 is not PASS.
- Review-1 corrections A–D: verified in the corrected tool/report outputs. The estimated category is label-based with method coverage counted separately; 12/13-region grouping is explicit; existing P0 R7 remains open; the four war-duration probes explain 145 as 144 active month-end states plus the `start=-1` counting convention for seeded wars. The latent asymmetry for wars declared during a run is retained as WD-F1, not silently dismissed.
- Unresolved risks retained: R7 remains an open P0 (no lifecycle/renderer/WebGL context-loss recovery found; only a January-in-game-year autosave); G0.7 device evidence is blocked; G0.8 is partial; Android save export/import risk R14 is not verified on device. R14 continues to block B2/C3 and installation of a new APK on iQOO; it does not invalidate this desktop/CI-only B3 review.
- Limitation of this review: the reviewer inspected exact GitHub source, reports, manifests, JSON outputs and committed logs and compared baseline-to-HEAD paths. The reviewer did not independently execute the scripts, tests, builds, or Android benchmark in a local runtime.
- Owner decision: **pending**. B4 remains `NOT_STARTED` until the owner proceeds under OD-20261116-11 and the protocol; no gameplay or S1 phase is opened by this review.

### Current S0-B4 technical evidence — 2026-11-17 (review pending)

This subsection updates the technical gate evidence after the historical B3 round-2 review above; it does not rewrite that review's as-of-date result.

| Item | Current result |
|---|---|
| B4 CI | Run `44032178418`, job `133866471284`, exact HEAD `e4924ca48264f8d0818eface51a28a87cd363b89`: `success` |
| Test report | 69/69 passed; 26/26 suites passed; 0 failed; `report_valid=true` |
| G0.6 technical assessment | `PASS` on baseline `2240a8f`; all four determinism cases `MATCH` with no differing path |
| Save compatibility | Malformed/foreign/version/missing-state behavior recorded; missing `marketStats` fallback continues; missing RNG loads but continuation throws `TypeError` |
| Task lifecycle | `READY_FOR_REVIEW`; independent review and owner acceptance pending |
| Next phase | B7 remains `NOT_STARTED`; do not begin before B4 independent `REVIEW_PASS` and owner `ACCEPTED` |

The CI workflow also auto-generated and uploaded a debug APK after the test step passed. This was contrary to the R14 no-new-APK instruction and is recorded as an unintended workflow side effect in the B4 work log. The artifact was not downloaded or installed; R14 remains unverified.

### 2026-11-17 — ChatGPT technical self-audit (same-author; not independent review)

Audit report: `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md` (commit `8cc48081737b8830ef5d4b4aca7749c1747b5321`).

| ID | Severity | Finding | Required action |
|---|---|---|---|
| B4-SA-01 | P2 | Missing-RNG test logs continuation outcome but does not assert that the current baseline throws `TypeError`; it could remain green if behavior changes | Add explicit expectations for `throws` and `TypeError` in the test harness; do not change engine/save/RNG behavior |
| B4-SA-02 | P2 | `firstJsonDifference` does not fully match JSON normalization for `NaN`, infinities and `-0`, although undefined object values, undefined array entries, key ordering and array ordering are handled | Normalize through JSON semantics before recursive key sorting, or explicitly reject non-finite numbers; add regression fixtures |

This is a technical self-audit by the same ChatGPT that authored the comparator correction. It is not a second-party independent review and does not set B4 to `REVIEW_PASS`. A safe tests-only CI path is not currently authorized; the existing push workflow also assembles and uploads an APK. Therefore the test source has not been changed and no new APK workflow was run. B4 remains pending genuine independent review and owner acceptance; B7 remains `NOT_STARTED`.

### Follow-up — test-harness fixes committed (2026-11-17)

- Commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` changes `tests/s0-save-determinism.test.ts` only.
- B4-SA-01 and B4-SA-02 source corrections described in the newest work-log entry are now implemented.
- Isolated Node helper validation: 8 assertions passed. Project Vitest, build and CI were not run for this commit.
- No workflow modification and no APK build was initiated. The current APK workflow remains a process hazard for future ordinary pushes.
- The original B4 self-audit remains a same-author technical review, not a genuine second-party review. B4 still requires project test evidence, Claude's independent review when available, and explicit owner acceptance. B7 remains `NOT_STARTED`.

## 7. Owner decisions

Only explicit owner decisions may be recorded here. Recommendations are not approvals.

| Date (UTC) | Decision ID | Decision | Scope | Evidence/reference |
|---|---|---|---|---|
| 2026-11-16 | OD-20261116-00 | Add the two coordination files to the repository on `claude/game-historical-sandbox-modes-kg7rj7`, with only minimal linking documentation changes | Task `COORDINATION-SETUP`; documentation only; S0 not authorized | Owner instruction in the Claude Code session, 2026-11-16 |
| 2026-11-16 | OD-20261116-01 | Branch policy: amend the protocol; do not create `main`; direct pushes to the sole/default branch only for owner-authorized scope; never force-push | Protocol "Branch and PR policy" | `OWNER_DECISIONS_REVIEW_BD5787F.md` (owner package `Victori3_Claude_Review_Response_bd5787f`, provided in chat, not committed), decision 1 |
| 2026-11-16 | OD-20261116-02 | Keep `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md`; mark it as a legacy, non-authoritative proposal and list its known conflicts | Notice at the top of that file | Same document, decision 2 |
| 2026-11-16 | OD-20261116-03 | Classify the old roadmaps as historical evidence in `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md`; do not delete, renumber or rewrite them | Legacy index | Same document, decision 3 |
| 2026-11-16 | OD-20261116-04 | Earlier stages 1–5 are `PRE_PROTOCOL_IMPLEMENTED_REPORTED`, not retroactively `REVIEW_PASS`/`ACCEPTED`; add an evidence register | Legacy index, protocol, phase register | Same document, decision 4 |
| 2026-11-16 | OD-20261116-05 | Separate task lifecycle statuses from gate verdicts (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`) | Protocol "Status vocabulary" | Same document, decision 5 |
| 2026-11-16 | OD-20261116-06 | PRs only on explicit owner request and only with a distinct target branch; never merge without explicit owner approval | Protocol | Same document, decision 6 |
| 2026-11-16 | OD-20261116-07 | Record the setup SHA in a second documentation-only commit; no self-referencing SHA; setup review state `CHANGES_REQUESTED` until corrected and independently reviewed; S0 execution authorized = NO | This handoff | Same document, decision 7 |
| 2026-11-16 | OD-20261116-09 | Approve `DECISIONS_AND_S0_REVISED_VI.v3.2.md` and `SOURCE_REGISTER.v3.2.md` exactly as delivered (SHA-256 `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` / `1adc4fedb4311383723631fbe16ceaa92b54344223bda0f93ee2d8c8e06737a2`); commit them verbatim; stop if hashes differ | Canonical roadmap and S0 specification | Owner instruction in the Claude Code session, 2026-11-16; committed in `574ddc7ac57267ecae2216cb9ee1d490f3b41626` |
| 2026-11-16 | OD-20261116-10 | Authorize S0-A only (audit and freeze the baseline, approved document §6.3); no gameplay, engine, data, UI, test, save-format or migration changes; S0-B, S1 and later not authorized; every result with evidence, log, SHA and a gate verdict; after S0-A update this handoff and stop for independent ChatGPT review; no self-acceptance or phase transition | S0-A | Owner instruction in the Claude Code session, 2026-11-16 |
| 2026-11-16 | OD-20261116-10B | (ID assigned by Claude for traceability.) S0-B1 only: plan first, then the reviewed revisions, then apply the reviewed candidate workflow (SHA-256 `82458e9c…`) as a workflow-only commit, run CI, report and stop | S0-B1 | Owner instructions in the Claude Code session, 2026-11-16 (`CLAUDE_TASK_S0B_B1_NEXT_STEP.md`, `CLAUDE_B1_REVISION_REQUEST.md`, `CLAUDE_S0_B1_APPLY_TASK.md`) |
| 2026-11-16 | OD-20261116-11 | Accept S0 v3.3 with amendments: B3/B4/B7 no longer wait for B2; B2/B5/B6 stay in the device/signing lane. Authorize B3, then B4 (after B3 `REVIEW_PASS`), then B7. S1 exceptions accepted in principle only for G0.7 (iQOO) and G0.8 (legacy licences). No waiver for G0.1–G0.6 or uncontrolled P0. G0.6 `FAIL` leads to a separate remediation proposal. G0.4 source is `MASTER_SPEC_VI.md` §§0–17. Commit v3.3, the spec copy, the source register and the protocol sentence. R7 interim containment recorded | S0-B3/B4/B7; S0 transition rules | `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md`, confirmed by the owner in the Claude Code session on 2026-11-16 |
| 2026-11-16 | OD-20261116-08 | Canonical roadmap is `PENDING_OWNER_APPROVAL` until approved and committed; the currently available proposal is identified only as a pending proposal | This handoff, protocol, legacy index | Same document, "Additional source-of-truth correction" |

### 2026-11-17 — S0-B4-TESTS-ONLY-CI

- Owner authorization: OD-20261117-12 — owner explicitly approved a separate B4 tests-only workflow; it must not build an APK and must not modify the existing Android APK workflow.
- Base HEAD: `ccf08135ed5b64ac66802ab2f5420312d81660d2`.
- Workflow commit: `f396258b22fb668af0c3abf2c42dfc582699a06d`.
- Changed file: `.github/workflows/b4-tests-only.yml` only.
- Workflow behavior: branch-scoped push trigger with path filters and manual `workflow_dispatch`; Node.js 22; `npm ci`; `npm run test:fast`.
- Explicitly excluded: `npm run build`, asset generation, Capacitor sync, Gradle, `assembleDebug`, signing, APK packaging, and artifact upload.
- Existing `.github/workflows/android-apk.yml` was re-fetched and its blob SHA remained `7a2639057272d2629f2d6b89cfc8fb07682dad31`; it was not modified.
- Commit message includes `[skip ci]` so the existing broad push-triggered APK workflow is not started by this workflow-addition commit. GitHub documents that skip directives affect push/pull_request events only; they do not suppress a manually dispatched workflow.
- Validation status: workflow source re-fetched and inspected. Tests have NOT run yet. The GitHub connector available in this session exposes workflow-run reads/re-runs but no workflow-dispatch write action. Because the new file is on the repository's sole/default branch, the owner can start it from Actions → S0-B4 Tests Only → Run workflow, selecting `claude/game-historical-sandbox-modes-kg7rj7`. This is the remaining execution step; do not claim Vitest PASS until its run log confirms success.
- B4 remains `READY_FOR_REVIEW`; project Vitest evidence, Claude independent review, and owner acceptance remain pending. B7 remains `NOT_STARTED`.

## 8. Update rules

- Claude updates status and implementation evidence after each approved task.
- ChatGPT appends independent review findings after checking GitHub.
- The owner-decision section changes only after an explicit owner decision.
- Preserve the work log; append rather than overwrite.
- If HEAD changes during review, report the new SHA and re-review that exact commit.
- A handoff update never substitutes for source code, logs, tests, or artifacts.
- A commit cannot record its own SHA. A commit that updates this file is identified by GitHub commit metadata (`git log -- docs/coordination/AI_HANDOFF.md`); the next update records it explicitly.

### 2026-11-18 — S22 source-audit extension (ChatGPT self-audit only)

- Extended `docs/audit/s0/S22_CODE_BASELINE_SELF_AUDIT_2026-11-18.md` in commit `623afa1d9310edffca92d2b3e9bb051e20f5cba3` after a second read-only pass over exact source blobs; corrected Markdown escaping in follow-up commit `31bf6f22198c086f9db1054ec5091338f742e269`.
- Added S22-SA-08: day precision in historical event dates is collapsed to month ticks and `dateStr()` logs day 01; source date and effective simulation date need separate semantics.
- Added S22-SA-09: `milestoneScore()` includes overdue-but-still-pending milestones in the denominator before their tolerance grace expires; define provisional vs resolved scoring and test it.
- Added source inventory counts: CoW series contain 612 population totals / 59 entities; 596 military-personnel observations / 59 entities; 612 iron-steel observations / 59 entities; 536 primary-energy observations / 50 entities, all with source files spanning 1816–1914. The builder selects these four CoW fields but drops units/source/method metadata. Maddison files include 574 population observations / 94 present-day-territory units and 365 GDP-per-capita observations / 66 units (1820–1913); GDP-per-capita is not retained as a dated compiled benchmark series. These are repository inventory facts, not proof no external sources exist.
- Added test-gap observations for rank resolution, day/month precision, pending-decision expiry/invalid options, effect atomicity, grace-period scoring, benchmark metadata and holdout separation. No tests were run.
- Added S22-SA-10: the open `Condition` string/index-signature type and incomplete build-time validation leave priority/decision conditions and nested payloads without a closed schema; malformed conditions may silently disable rules or throw during simulation. Report extension commit `971d71af7e2fcca159dddb1921cb7b10f06da213`.
- Updated the Hydrogen research request with the existing source inventory (commit `4d01454a7132eb32ca5583a43542a65ee4a17f9e`); this is a research-brief clarification only and does not constitute Hydrogen's research result.
- Exact code baseline inspected remains `a99b5712ea7f40fb6ca9bbe1d326abf39edb2ef3`; report now contains ten self-audit findings and is `CHATGPT_SELF_AUDIT_ONLY`. No runtime/data/save/test/UI/Android/workflow/APK changes. No build/CI/device test. S1/S22 remain closed.


### 2026-11-18 — S22 full design pass (ChatGPT self-audit only; Claude review pending)

- Expanded the design proposal through §§14.8–14.14: separated physical forcing, biological hazard propagation, human-mediated discovery and social consequences; defined a typed structural-rule registry; required closed schemas and source provenance for all executable event payloads; bounded historical option prior; specified deterministic RNG stream isolation and Android performance methodology; added per-condition and per-effect semantic contracts.
- Added SA-11: the authored Salic structural rule is compiled but the runtime uses a separate hard-coded succession branch, which detaches all British personal-union subjects although the source record names Hanover. Added SA-12: exogenous/decision/structural payloads are incompletely typed and validated.
- Expanded the implementation verification matrix at `docs/audit/s0/S22_IMPLEMENTATION_TEST_MATRIX_2026-11-18.md` (content blob `8c973460cf9333f003490154056e28c7e01353a9`). It defines condition, decision, effect, event, calibration, determinism, performance and device cases. It is a test plan only; no test code was added or run.
- Updated the Claude no-write review request to exact design blob `fbbad73aae57a26a52aefadc630c8b6cb340040c` and added review questions for SA-11/SA-12, §§14.8–14.14 and the test matrix.
- Current branch HEAD at handoff update: to be re-fetched after this commit. The design revision commit/blob and all supporting documents are exact-pinned above.
- No runtime, historical data, generated DB, save schema, tests, UI, assets, Android, workflow, signing or APK changes. No build, CI or device test was run. S0-B7 review/owner acceptance and S1 gate remain prerequisites; S22 remains closed.


### 2026-11-19 — S22 rolling report and event evidence research

- Created the single cumulative work log: `docs/audit/s0/S22_CONTINUOUS_PROGRESS_REPORT_VI.md` (creation commit `090e9db1411ee33df8040c67396bb4217004c9a2`). Future tasks should append a new entry to this report rather than create redundant progress reports.
- Reviewed the nine existing exogenous records against scholarly/institutional sources; added the research-only folder `docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_AND_CALIBRATION/`.
- Research outputs: README (commit `5d8dec8e2b323a3195623b7d0551bd646a4ec9ef`), event candidate CSV (commit `e9ea638ec71e2263e96a235c03ce70f20d477b24`), open evidence requests (commit `f537932f13481944d18aa5c1fb4db04c5b6bce76`), source registry delta (corrected rectangular CSV, commit `eebf50d9ca52668b57e59fb1ff11ecaf7c5d6d9a`).
- Three CSV files were structurally checked for consistent row widths. This is not game-data validation and does not authorize importing proposed sources into `historical_data/sources/sources.json`.
- Added a Hydrogen follow-up in commit `ecdfcfa4ff7b3b4310c36219951290bbbe1c4c26` covering cholera waves, Agra/India/China famine crosswalks, blight spread, California/Victoria/Witwatersrand discovery semantics, and Global Drought regional evidence. Independent Hydrogen findings are still pending.
- No engine, historical runtime data, source registry, save schema, test code, UI, Android, workflow or APK changes. No build/tests/CI/device run. S1/S22 remain closed pending gate and owner authorization.


### 2026-11-19 — S22 benchmark inventory extension

- Added a source-level inventory of six checked-in CoW indicator series and two Maddison 2010 series, including exact counts, quality, unit, date points, source locator completeness, registry match and builder compile status.
- Added official upgrade candidates CoW NMC v7.0 (1816–2022), Maddison Project Database 2023 (169 countries/regions to 2022) and Historical Financial Statistics (pre-1950 macro/financial sources with reuse restrictions).
- The rolling report is now updated through commit `3fd9a04e7f3cc425f2b28dd2400beb1d7b2550f3`, report content blob `c63dad12d9e1440c3a6dc652595b0a3146f76998`.
- Hydrogen's research request now includes independent benchmark source/codebook/rights audit. No NMC/MPD/HFS data has been downloaded or imported; no runtime/schema/ETL/test/build changes.


### 2026-11-19 — S22 macro-region taxonomy gap (SA-13)

- Added SA-13 (P1): the project standard requires twelve macro-regions, but the inspected RegionRecord, registry and strategic-region CSV do not encode stable macro-region IDs or crosswalks; a complete regional denominator cannot be reproduced.
- Added design §14.15 for WorldRegionTaxonomy, physical StrategicRegionGeography, HistoricalGeographicUnit, time-valid GeographicCrosswalk and PolityTerritoryMembership.
- Added GEO-01–GEO-10 acceptance cases covering owner-approved taxonomy, full physical-region mapping, temporal crosswalks, split/merge allocations, political border changes, missing regions and taxonomy versioning.
- Updated Claude review request to exact design blob `f0b326823c76a01c353ab30ef72ee550a3aae990`; verdict remains pending.
- Appended the SA-13 entry to the cumulative report at commit `2547080cfbd79a4961cc88149432dff86c484a1e2`. No taxonomy names or boundaries were invented; owner decision required.
- No engine/schema/runtime changes and no test/build/CI/device run; S1/S22 remain closed.


### 2026-11-19 — SA-13 and benchmark taxonomy gate

- Added SA-13 and design §14.15 defining the required twelve-region taxonomy/crosswalk contract. The twelve names/boundaries remain an owner decision; no inferred assignments are accepted.
- Updated self-audit, traceability report, implementation test matrix (GEO-01–GEO-10), and Claude request. Claude review is still pending.
- Updated rolling report through commit 528f531f53cbd2f85918c214ead2707c0ec4e25e.
- MPD 2023 workbook retrieval was attempted through the official release/Dataverse link but failed at its signed-object-store redirect. Metadata claims remain sourced to official release pages; no workbook row-level analysis is claimed.
- No product code/data/schema/test/build changes. S1/S22 remain closed.


### 2026-11-19 — Expanded entity-metric benchmark handoff

- Added the full 181×6 CoW entity/metric coverage matrix (1,086 rows, 764 missing) and the 160-row Maddison 2010 unit coverage list.
- Added BEN-11–BEN-18 to the S22 test matrix for complete registry enumeration, missingness preservation, CoW ID reconciliation, Maddison scope, urban/military expenditure inclusion decisions, raw-to-compiled parity and quality preservation.
- Updated research README, Hydrogen brief and rolling report; no benchmark values or runtime code were changed.


### 2026-11-19 — Claude review target synchronized with entity matrices

- Updated the Claude review request to commit `06445e5cf571bbf3b591b45ceafb9f3f6a2dd3c3`, blob `93521d0014630e3d5b1376e18b075435fae52172`.
- The request now points to the latest test matrix blob `8e6b518a637a954fc0c9a4f80b9c22c33c594704` and requests direct verification of the 1,086-row CoW entity/metric matrix and 160-row Maddison unit matrix.
- All review targets are exact-pinned; Claude's independent verdict remains pending.


### 2026-11-19 — Claude review package consistency verified

- Updated the Claude request to remove stale target SHA references and pin one consistent set of blobs for design, audits, test plan and benchmark coverage matrices.
- Updated the rolling report to include that cleanup (latest report commit 90837667cce318b4823ff4805a06515c8e5fe39d).
- Review remains no-write and pending; S1/S22 implementation gates are unchanged.


### 2026-11-19 — S22 GOVERNANCE AND ROLLING-REPORT RECONCILIATION

- Re-fetched the default branch and verified pre-update HEAD `f2db3c23c6c28d3bf58b526da4170c3419e37d0b`.
- Reconciled the S22 rolling report: current design §§14.1–14.15; self-audit SA-01–SA-13; traceability and test-matrix pointers; Claude review request pins.
- Gate check: G0.7 remains BLOCKED, G0.8 PARTIAL, full-S0 G0.9 BLOCKED; `S0_SIGNOFF.md` remains DRAFT. S1 and S22 runtime implementation remain closed.
- Updated report commit: `95e509f62efe3d69b267f3494969db0e882ffe58`; report blob: `956c9628f0c0683cac5cedb5388559b6a82757f8`.
- No product/runtime code, data, save schema, test implementation, UI, assets, Android, Gradle, workflow or APK changes; no build, test or device validation was run.


### 2026-11-19 — S22 OWNER DECISION REGISTER ADDED

- The rolling report now consolidates the eight explicit open design questions plus the additional taxonomy, decision-prior and device-envelope gates into proposed tracking labels OD-S22-01–OD-S22-08.
- These labels are not formal owner decisions. No region taxonomy, historical prior, calibration weights, seed count or performance budget has been approved or silently applied.
- Updated rolling report commit: `d9544d7f610b7b3c5077fad3f90e29cb90766ac6`; blob: `6750c4b13c8b0344f4ff03a74d33a5ca5a1464c1`.
- No runtime or product data changed; no tests/build/CI/device run.


## 9. Owner-directed staged development instruction — 2026-11-19

The project owner explicitly instructed ChatGPT in chat on 2026-11-19 to continue developing the game toward a Victoria 3-like global grand-strategy experience, let ChatGPT choose the technical implementation order, send completed code to Claude for one review/correction pass when available, and offer an APK for user testing only after the candidate is stable and verified.

**Working interpretation and controls**
- This authorizes staged product-code implementation on the existing development branch, beginning with narrow, testable slices. It supersedes the earlier task-local prohibition on gameplay/engine changes for these future owner-directed development slices.
- It does **not** rewrite historical S0 gate verdicts or complete the DRAFT S0 signoff. G0.7 remains BLOCKED, G0.8 PARTIAL and full-S0 G0.9 BLOCKED until separately evidenced/accepted.
- ChatGPT owns implementation and first-line tests. Claude may review and make one bounded corrective pass on the same slice. If Claude authors corrections, record this as a review/correction pass, not a false independent REVIEW_PASS of Claude's own corrected code; ChatGPT must re-fetch and re-run relevant tests/CI on the corrected exact HEAD.
- Do not claim a feature or APK is ready solely because source was committed. Offer an APK only after typecheck, relevant regression tests, app build/Gradle packaging, workflow/artifact verification and Claude's review/correction pass are complete.
- No signing secrets, keystore, GitHub Environment secrets, force-push, merge, automatic APK installation, baseline uninstall or device migration. APK delivery is for owner-controlled testing; existing R14/signature/backup risk remains visible.
- Keep each implementation slice small, evidence-backed and reviewable. Preserve the single rolling S22 progress report and update this handoff after each completed tranche.

### DEV-001 — canonical rank condition

- Base HEAD: `8608f9fc1db4ccabeeba0ba8c0cd046cacd69f70`.
- Implementation commit: `96f90338acc49beaed4313a116b2867ce3bacec3`.
- Scope: canonical `rank_at_most` implementation, per-tick immutable rank snapshot, nested condition-context reuse, matching tests and §14.1 payload clarification.
- Code/test files: `src/engine/metrics.ts`, `src/engine/historical.ts`, `src/engine/systems/events.ts`, `tests/modes.test.ts`.
- Focused Claude review request: `docs/audit/s0/DEV001_RANK_CONDITION_CLAUDE_REVIEW_REQUEST_2026-11-19.md`.
- CI: tests-only run `44430809753` passed 6/6 suites and 75/75 tests. Android debug workflow `44430809754` passed npm ci, build (including `tsc --noEmit`), tests, Capacitor sync and Gradle assembleDebug.
- No decision/effect transaction, structural-rule, exogenous-event redesign, benchmark ETL, save-schema, UI, asset, signing or Android application-ID change was included. DEV-001 is not yet accepted.


### DEV-001 verification result — 2026-11-19

- Tests-only run: [44430809753](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44430809753) — PASS, 6/6 suites, 75/75 tests, 0 failed, 0 pending.
- Android workflow: [44430809754](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44430809754) — SUCCESS; npm ci, data/map/web build, typecheck (`tsc --noEmit` via npm run build), Vite, Capacitor sync and Gradle assembleDebug all succeeded.
- APK: 18,043,425 bytes; SHA-256 `4942fe45e9b9aa168871c4c993bd3d5d0aa82cb8834d7621212b87e42e765d86`; Android Debug certificate SHA-256 `2f897a2e52acbaf803bf3ff0cb61037eedcecd98ed55c20433d281398b3205ff`; v1/v2 verification true.
- GitHub artifact ID `14485704529`; ZIP size 17,556,470 bytes; ZIP SHA-256 `b5011c9cd1bf504c233afdc490a8377aab1ae9d32b15c4240481e053418d6340`. Separate evidence artifact ID `14485579893`, ZIP SHA-256 `95b01c20b6255a6231440dba2b23cc324473c2d7614e59f45866b81c85dd1d75`.
- Artifact is retained for the review gate; it is not yet the user's approved test build. No device QA or Claude review/correction has occurred.


## 10. DEV-001–DEV-003 — code review and APK handoff

The owner requested one Claude review/correction pass after ChatGPT's first implementation slices, followed by an APK for user testing once the corrected exact HEAD has passed verification.

### Review target

- Repository: `mtieu6470-maker/Victori3-mobile`
- Branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Implementation base: `8608f9fc1db4ccabeeba0ba8c0cd046cacd69f70`
- Current implementation candidate: `751ae87a7b4a8e844e8e093937bad14589eb4225`
- Included implementation commits:
  - DEV-001 rank predicate: `96f90338acc49beaed4313a116b2867ce3bacec3`
  - DEV-002 player-decision revalidation: `a42a005c5da2ddf7570856558f0cb6feb9b4df7f`
  - DEV-003 staged effect transaction: `751ae87a7b4a8e844e8e093937bad14589eb4225`
- Focused aggregate review request: `docs/audit/s0/DEV001_DEV003_CLAUDE_CODE_REVIEW_REQUEST_2026-11-19.md` (latest request document prepared for one bounded review/correction pass).
- Scope is limited to the implementation files and tests listed in that request. Do not use this review as authorization for unrelated S22/engine/save/data/UI work.

### CI evidence

- DEV-001 tests-only: `44430809753`, PASS 75/75; Android workflow: `44430809754`, SUCCESS.
- DEV-002 tests-only: `44433012743`, PASS 83/83; Android workflow: `44433012918`, SUCCESS; its APK artifact is superseded by DEV-003.
- DEV-003 tests-only: `44433707994`, PASS, 6/6 files and 84/84 tests.
- DEV-003 Android workflow: `44433708015`, SUCCESS; Gradle BUILD SUCCESSFUL.
- Do not offer the superseded DEV-001/DEV-002 APK for test. The final candidate APK must come from a successful workflow on the exact Claude-corrected final code HEAD.

### Review/correction protocol

- Claude is asked to inspect exact current branch HEAD and do one bounded correction pass, not a broad redesign. If Claude changes code, classify the result as "Claude review + corrective pass" rather than an independent verdict on Claude's own fix.
- ChatGPT must re-fetch the exact corrected HEAD and rerun tests, build and artifact verification.
- APK test delivery requires the corrected final HEAD to pass typecheck, regression suite and Android Gradle packaging, and a verified APK artifact/checksum. No APK installation, signing-secret change, keystore access, force-push or merge is authorized.
- This process does not rewrite S0 gate ledger or signoff. Formal historical gate statuses remain G0.7 BLOCKED, G0.8 PARTIAL, whole-S0 G0.9 BLOCKED.


### DEV-003 final CI and APK identity

- Code HEAD tested: `751ae87a7b4a8e844e8e093937bad14589eb4225`.
- Tests-only run [44433707994](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44433707994): 6/6 files, 84/84 tests passed.
- Android workflow [44433708015](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44433708015): success; Gradle assembleDebug completed.
- APK: 18,045,142 bytes; SHA-256 `4264d0fb9b7d9fd23be23ac4520f29b598f04b383c51d172bfa43dbe85dfda9c`.
- APK signer: Android Debug, v1/v2 verified true, certificate SHA-256 `bdf18b1f25e95bb96dc4358daf9fb65082dc6e0c6540a9bfaeb06963f2d0f23e`.
- GitHub APK artifact ID `14488625201`, ZIP SHA-256 `08d66dea88002688040698925c5fd59b26b3ee1ba8d9ee48cd6c0097aca9d881`.
- GitHub CI evidence artifact ID `14486589363`, ZIP SHA-256 `f46054658354bbeb0f7bddf916f08c446d2bbbfe77600865aa08b402372c1477`.
- This is the pre-Claude-review debug artifact; no device installation or QA has occurred. It must not be called a final accepted test build until Claude's pass/correction and a new verification run on the corrected exact HEAD.


## 11. DEV-006 — bounded monthly simulation clock (2026-11-20)

- **Base HEAD:** `e4182491161e61065e4ac15228c5f59a8832ad1d`; **branch:** `claude/game-historical-sandbox-modes-kg7rj7`.
- **Owner authorization:** owner granted ChatGPT full discretion over technical priorities and execution in chat on 2026-11-20; this is a bounded clock/scheduler correction, not a phase-gate acceptance.
- **Root cause:** `SPEED_MS[5] = 0` made speed 5 call `stepMonth()` on every animation frame (typically about 60 simulated months/second). Speed 4 at 220 ms/month also advanced roughly 4.5 years of game time per real second. The scheduler additionally retained up to one full interval of backlog and could emit a catch-up burst after a background-tab pause.
- **Implementation:** speed intervals are now 8,000 / 5,000 / 3,500 / 2,500 / 2,000 ms per simulated month for speeds 1–5. A pure `consumeClockElapsed()` helper emits at most one month per callback and discards excess elapsed time after stalls; speed changes reset partial accumulated time. The top-bar tooltip now states the actual month interval.
- **Changed files:** `src/ui/game/controller.ts`, `src/ui/App.tsx`, `tests/monthly-clock.test.ts`, this handoff and the rolling S22 report.
- **Tests added:** positive/monotonic speed intervals; exact threshold crossing; 60-second background pause capped to one month; invalid/negative timing input handling.
- **Verification (updated 2026-11-20):** tests-only run [44754295188](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295188) passed 42/42 suites and 126/126 tests; Android debug run [44754295107](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295107) succeeded through Gradle `assembleDebug` on exact target `65bf85db91cbeaa276e00401e524749343ab305a`. APK: 18,052,303 bytes, SHA-256 `b73eab755d53aabaae3192041296282343b1a442236232bb147d794e31de37fa`; artifact ID `14636409648`. Device QA remains NOT_TESTED.
- **Important model limitation:** engine time remains monthly. This correction stops runaway month advancement; it does not yet provide Victoria 3-style daily simulation ticks. Converting to daily ticks requires a separately designed daily scheduler and a reviewed cadence contract for every economy, POP, politics, diplomacy, military, event and AI system.
- **Review/acceptance:** review packet `docs/audit/s0/DEV006_MONTHLY_CLOCK_CLAUDE_REVIEW_REQUEST_2026-11-20.md` is prepared for Claude's independent no-write review of exact code SHA `65bf85db91cbeaa276e00401e524749343ab305a`. Verdict and owner acceptance remain pending. This does not alter historical S0 gate verdicts or authorize unrelated subsystems.


- **CI verification update (2026-11-20; exact target 65bf85db91cbeaa276e00401e524749343ab305a):** tests-only run [44754295188](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295188) SUCCESS; 42/42 test suites and 126/126 tests passed, zero failed/pending. Android debug run [44754295107](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295107) SUCCESS; npm install, web/data build, simulation tests, Android sync and Gradle `assembleDebug` all completed successfully.
- **APK:** artifact ID `14636409648`, 18,052,303 bytes; APK SHA-256 `b73eab755d53aabaae3192041296282343b1a442236232bb147d794e31de37fa`. Artifact ZIP SHA-256 `380c6944f507cd54e72c1d7f011d5ffc09da34437156131b6aa98c7b2c3267f6`. CI evidence artifact ID `14637197150`, ZIP SHA-256 `9f54668e91f3081be18fe7e2adb79f0db36369696091f87a03ae9e2c77d4a988`.
- **Signing:** Android Debug certificate; APK v1 and v2 verification true; certificate SHA-256 `89f494b021eedecdb4d1ceaa6f1d22bd96380f361c3b0404ed99e13d9f6e4a33`. This is a debug APK, not a production/release-signed package.
- **Integrity check:** downloaded APK bytes were extracted from the CI artifact and independently SHA-256 hashed in the session; result exactly matches the CI evidence manifest.
- **Device QA:** NOT_TESTED — no installation, upgrade, save/load, lifecycle, thermal or performance test on the owner's iQOO device. Claude independent review and owner acceptance remain pending; this does not change any S0/S1/S22 gate verdict.
