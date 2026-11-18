# Global Historical Events and Calibration Benchmarks — Gemini Hydrogen Research Task

**Project:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Research period:** 1836-01-01 through 1936-12-31  
**Reference snapshot:** 1836-01-01  
**Coverage:** every current baseline polity and all 12 project world regions; explicitly report the five macro-regions Europe, Africa, Asia, Americas and Oceania  
**Status:** `RESEARCH_REQUEST_ONLY / CANDIDATE_EVIDENCE / NO_RUNTIME_AUTHORIZATION`

## 1. Purpose and boundary

Prepare source-backed historical event candidates and multi-dimensional validation benchmarks for S22.

Design proposal:
`docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md`

This is research only. Do not modify runtime historical data, code, save, tests, UI, assets, Android, workflows or APK. Do not convert historical outcomes into forced game events or runtime benchmarks without a separate integration review and owner approval.

## 2. Coverage and geographic discipline

- Use existing baseline entity IDs and 662 Strategic Region IDs where defensible.
- Every current entity must appear in coverage reports, including explicit missing evidence.
- Include decentralized polities, confederations, tributaries, protectorates, colonies, chartered companies, indigenous authorities and game aggregates.
- Distinguish polity control, claimed territory, geographic population, tributary influence and contested jurisdiction.
- Do not assign an event or benchmark to every Strategic Region merely because it lies in a modern country polygon.
- Keep modern administrative geographies as spatial proxies only with temporal mismatch/crosswalk method noted.

## 3. Historical event candidate research

Build a balanced, source-backed candidate catalogue for 1836–1936. Research event classes separately:

### Physical and demographic shocks
- epidemic/pandemic;
- drought, flood, famine, crop blight, locusts and other agricultural shocks;
- earthquake, volcanic activity, cyclone, extreme winter and other natural hazard;
- resource discovery/depletion where source-backed;
- migration/displacement shocks, separating forced and voluntary movements.

### Political and institutional processes
- succession/accession/abdication/regency and office transitions;
- constitutional/institutional reforms and administrative change;
- councils, assemblies, treaties and political settlements;
- revolts, protests, strikes, rebellions, coups, revolutions and independence movements;
- abolition/emancipation, labor-law and land-tenure changes;
- confederation/federation/union formation or dissolution;
- local autonomy, subject/protectorate/colonial status changes.

### Diplomatic and military events
- treaty negotiation, ultimatum, crisis, guarantees and foreign intervention;
- war declarations, mobilization, alliances and peace settlements;
- campaigns, battles, sieges, blockades and occupations;
- borders/control changes, but distinguish de jure cession from de facto occupation;
- conferences and mediation.

### Economic, technological and infrastructure events
- major market disruptions, commodity booms/crashes and trade-route shifts;
- railways, canals, ports, roads, telegraph, industrial plant openings/closures where documented;
- technological arrival, diffusion or adoption by specific polity/region;
- major fiscal/debt/default/monetary reforms;
- urban/public service initiatives.

Do not make a complete list of every incident at the cost of source quality. Prioritize events with well-dated actors, geography, causal context and gameplay significance. Mark unknown and contested cases explicitly.

For each event candidate, distinguish:
- documented occurrence;
- date precision (exact/day/month/year/range/uncertain);
- physical/exogenous trigger vs actor decision vs resulting consequence;
- known historical outcome vs plausible alternatives;
- causal interpretation and competing scholarship;
- whether the event plausibly depends on current state, actor/institution or geography.

Do not present causation as settled merely because two events occurred close together. Separate primary evidence from historian interpretation.

## 4. Global calibration benchmarks

Collect dated quantitative observations, preferably multi-year series or benchmark intervals, not only isolated totals.

Research these dimensions separately:

| Dimension | Candidate indicators |
|---|---|
| Population | total, growth, urban/rural, age/sex where available, migration/displacement |
| Social | occupation, class/strata, literacy, education access, health/mortality, rights/status where measurable |
| Economy | GDP, GDP per capita, sector shares, agricultural/industrial output, productivity, wages/income, prices |
| Goods/trade | commodity output, imports/exports, trade volumes, trade-route dependency, port throughput where documented |
| Public finance | taxation, revenue, debt, expenditure, monetary/currency indicators |
| Infrastructure | railway/road/canal/port length or capacity, travel/transport time if evidence exists |
| Technology | date/range of adoption by polity/region, diffusion speed, industrial processes |
| Military | nominal vs active vs mobilized force, fleet/ship classes, equipment, spending, campaign loss ranges |
| Territorial/political | control/claims, administrative status, subject/autonomy/independence, institutional changes |
| Urban/public services | city population, housing/sanitation/water, schools/health facilities or service coverage where sources exist |

Every benchmark must include:
- stable benchmark ID;
- entity and geographic scope;
- metric definition;
- observation date/interval;
- value, unit and original source unit;
- lower/upper bound or uncertainty interval when possible;
- population/control scope;
- source locator and source ID;
- collection/interpolation method;
- known comparability limitations;
- quality label.

Do not infer a missing metric from GDP, industrialization label or modern data. Report missingness rather than fabricate.

## 5. Event causal and decision evidence

For major candidate events, provide:
- preconditions known before the event;
- triggering conditions;
- actors and authority involved;
- competing interests/coalitions;
- decision options considered or plausibly available;
- material constraints (fiscal, military, geography, law, communication);
- recorded outcome;
- alternative choices or counterfactuals only where specialist scholarship discusses them;
- outcome uncertainty and limits.

Do not supply invented game-ready effects such as “add 20 legitimacy” or “transfer 3 regions”. The engine team will derive mechanics from the evidence; Hydrogen supplies factual and interpretive context.

## 6. Calibration methodology and comparability

- Keep training/calibration candidates separate from validation/holdout candidates where possible.
- Avoid using the same source/table to tune and claim independent validation.
- Record historical boundary changes, currency changes, price-base years, national-account definitions, census scope, and territorial coverage.
- Use uncertainty bands; do not report false precision.
- Where a benchmark is polity aggregate and game simulation is region-level, keep it at polity level unless a documented crosswalk exists.
- For world-region comparison, explicitly disclose lower evidence density or data survival bias in Africa, Asia, Americas and Oceania.
- Recommend a small number of robust benchmark series for early model validation and a longer-term research backlog for weaker dimensions.

## 7. Source requirements

Prioritize archival census and fiscal records, published official statistical abstracts, peer-reviewed historical demography/economic history, specialist military and diplomatic histories, national archives, treaty collections and reputable institutional datasets.

For every source:
- source_id;
- author/institution/title;
- publication/archive date;
- direct URL or catalogue identifier;
- page/table/article/folio locator;
- original observation date and geography;
- data definition and unit;
- source type, collection method and limitations;
- licence/access/reuse notes.

No AI-generated citations, no fabricated locators and no Wikipedia-only quantitative claims.

## 8. Candidate deliverables

Create research-only directory:
`docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_AND_CALIBRATION/`

Recommended outputs:
1. `README_VI.md` — scope, methodology, limitations, global coverage.
2. `EVENT_CANDIDATES.csv` — one candidate event per row with event class, date precision, actors, geography, preconditions, evidence, quality, alternate interpretations and event causal class.
3. `EVENT_CHAIN_EVIDENCE.csv` — parent/trigger/dependent relationships supported by sources; do not imply deterministic script.
4. `HISTORICAL_BENCHMARKS.csv` — dated metric observations and uncertainty bands.
5. `BENCHMARK_COVERAGE_MATRIX.csv` — entity × metric × world region × time period, including missing evidence.
6. `CALIBRATION_METHODS_VI.md` — normalization, currency/unit conversion, boundary crosswalk and holdout suggestions.
7. `SOURCE_REGISTRY_DELTA.csv`.
8. `OPEN_EVIDENCE_REQUESTS.csv`.
9. `WORLD_REGION_COVERAGE_SUMMARY.csv`.

CSVs must be UTF-8, rectangular, stable unique IDs, source locator columns, one claim/observation per row and clear null/missing representation.

## 9. Acceptance checks

- Every current baseline entity appears in coverage, even if no event/benchmark is found.
- All 12 project world regions and five macro-regions represented.
- Event class distinguishes exogenous fact, political choice, historical pressure, benchmark and narrative.
- Date precision and causal confidence are explicit.
- Alternative interpretations are retained for contested events.
- Benchmarks have units, observation dates, scope, methods and source locators.
- No modern boundary or statistical definition is silently projected backward.
- No benchmark is filled from unsupported defaults.
- Holdout/calibration data usage is transparent.
- Historical outcomes are not converted into guaranteed gameplay results.
- No candidate files are imported to runtime or presented as accepted game data.

## 10. Existing repository data inventory — avoid duplication, expose gaps

A second source-level inspection by ChatGPT recorded the following counts from the current repository files. These are **input inventory counts**, not fresh independent validation of the original datasets and not a claim that they cover all world polities.

| Repository source | Observations | Entity/unit count | Date coverage | Existing compiled benchmark treatment |
|---|---:|---:|---|---|
| CoW NMC population total | 612 | 59 entities | 1816–1914 | Selected |
| CoW NMC urban population (cities over 100k) | 385 | 40 entities | 1816–1914 | Not selected |
| CoW NMC military personnel | 596 | 59 entities | 1816–1914 | Selected |
| CoW NMC military expenditure | 420 | 55 entities | 1816–1914 | Not selected |
| CoW NMC iron/steel | 612 | 59 entities | 1816–1914 | Selected |
| CoW NMC primary energy | 536 | 50 entities | 1816–1914 | Selected |
| Maddison population (present-day territory) | 574 | 94 units | 1820–1913 | Used as input where mapped; not same as 1836 polities |
| Maddison GDP per capita (present-day territory) | 365 | 66 units | 1820–1913 | Used for the 1836 setup estimate; not retained as a dated benchmark series |

Relevant paths:
- \`historical_data/population/cow_nmc_population.json\`
- \`historical_data/military/cow_nmc_military.json\`
- \`historical_data/economy/cow_nmc_industry.json\`
- \`historical_data/population/maddison_2010.json\`
- \`historical_data/economy/maddison_2010_gdp.json\`
- \`tools/build-data.ts\` (current selection of four CoW fields into \`HistoricalDB.benchmarks\`)
- \`src/engine/data/dbTypes.ts\` (current compiled benchmark shape)

The current builder retains only \`population.total\`, \`military.personnel\`, \`economy.iron_steel_kt\` and \`economy.primary_energy_kt_coal_eq\` for the CoW benchmark array. It drops the source-record unit, source locator, method and note when constructing the compiled observation. The Maddison GDP-per-capita file is used to derive 1836 setup values but is not retained as a time-series benchmark in that array.

Research implications:
1. Do not merely repackage these datasets as “global 1836–1936 benchmarks”. Show the observation count, entity coverage, world-region coverage and time coverage for each field.
2. Explicitly identify the evidence gap between 1914 and 1936 in these currently inspected CoW/Maddison series; search for additional suitable series and state when no comparable source can be found.
3. Investigate whether CoW urban population and military expenditure fields can be reused with their original definitions/units and limitations preserved.
4. Distinguish CoW state-system entities from decentralized polities, colonies, subjects, companies and non-state actors. Do not infer that an entity absent from CoW had zero population, production or military capability.
5. Retain provenance through any normalized/exported rows: source ID, locator, unit, method, uncertainty/quality, original entity, original geography and crosswalk method.
6. Keep present-day-territory Maddison observations separate from historic polity totals unless a documented territorial allocation/crosswalk makes a comparison defensible.
7. Mark each requested metric as \`existing_repository_data\`, \`new_external_evidence\`, \`inferred_with_method\` or \`missing\`; never silently merge these categories.

## 11. Handoff boundary

This task supplies source-backed research candidates only. It does not authorize runtime changes, event scripts, shipped data patches, code, save migration, tests, S22 implementation or APK builds. ChatGPT validates structure and methodology; Claude may independently review; project owner retains data acceptance and phase approval.


## 12. Follow-up review — current nine exogenous events and the 1875–1878 global drought candidate

ChatGPT has added a preliminary, source-linked review package at:

`docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_AND_CALIBRATION/`

Files:
- `README_VI.md` — current-event causal/source review, 9 existing records and one additional global drought candidate.
- `EVENT_CANDIDATES.csv` — record-level proposed causal class, precision, geography assessment and treatment.
- `OPEN_EVIDENCE_REQUESTS.csv` — 13 unresolved evidence tasks.
- `SOURCE_REGISTRY_DELTA.csv` — external sources checked; these are proposed additions only and have NOT been inserted into canonical `historical_data/sources/sources.json`.

### 12.1 Independent verification requested

Do not copy the ChatGPT classifications as accepted facts. Independently verify and correct them with page/table/folio locators where possible:

1. **Cholera 1836–1837:** separate Naples/Two Sicilies waves from the rest of Italy; verify whether any evidence supports a June 1836 start for Sicily, the Papal States, Sardinia and Lombardy. A preliminary academic source reports Naples waves from 02 Oct 1836–08 Mar 1837 and 13 Apr–24 Oct 1837.
2. **Cholera 1846–1860:** provide a region-by-region chronology for the current 12 regions. A pandemic-level date range is not evidence that every region was affected in June 1847.
3. **Agra famine 1837–1838:** map the famine footprint to current regions EIC_DEL, EIC_ROH, AWA_LKO and PRI_RAJE; verify the 1837 month/season and any quantitative yield-loss estimate. Separate drought forcing from famine, disease, migration and Company policy.
4. **Potato blight 1843–1845:** resolve arrival chronology for Flanders, southern Netherlands, Rhineland, Ireland and Scotland; compare the mid-1845 Flanders reports across sources. Distinguish pathogen first report, seed trade, regional spread and crop consequences.
5. **California 1848:** verify the Coloma/Sutter's Mill site-to-region crosswalk and distinguish geological deposit, local knowledge, James Marshall/Sutter workforce access, discovery, public announcement and political control during the Mexican-American War.
6. **Victoria 1850–1851:** add Indigenous historical/archaeological evidence for First Nations prior knowledge; verify Clunes discovery, July 1851 public announcement, colonial separation/jurisdiction and the first major rushes. Do not describe this as the first human discovery of gold in the region.
7. **North China famine 1876–1879:** the five current province-level regions appear to match Shanxi, Henan, Shandong, Zhili and Shaanxi. Verify each date/season and distinguish drought, grain-market breakdown, relief response and famine outcomes.
8. **Great Indian famine 1876–1878:** map evidence separately for Madras, Ceded Districts, Mysore, Deccan and Hyderabad. Validate each start/end period and do not assume one 0.45 yield-loss figure fits every region.
9. **Witwatersrand:** distinguish first recorded finds in 1884 (Bantjes/Struben) from George Harrison's payable Main Reef discovery at Langlaagte in July 1886 and public diggings in September 1886. Provide a georeferenced crosswalk to current DZ_PEDI/NDE_MOS regions or recommend a missing region.
10. **Global Drought 1875–1878 candidate:** investigate regional evidence for India, East Asia, southern/northern Africa, Brazil, Australia and Southeast Asia. A climate reconstruction suggests different onset seasons and durations; do not create one same-day global event or infer famine everywhere from rainfall anomalies.

### 12.2 Required output additions

Create:
- `HYDROGEN_EVENT_EVIDENCE_REVIEW_VI.md` — independent findings, disagreements with ChatGPT, confidence and source limitations.
- `HYDROGEN_EVENT_EVIDENCE_MATRIX.csv` — one claim per row with exact locator, original date/precision, original geography, current region crosswalk, causal class, confidence and uncertainty.
- `HYDROGEN_EVENT_SOURCE_DELTA.csv` — proposed source IDs and full bibliographic metadata, including rights/reuse notes.
- `HYDROGEN_EVENT_OPEN_GAPS.csv` — unresolved regions/years/claims with next research steps.

Keep every candidate research-only. Do not edit live event JSON, region ownership, source registry, runtime schemas, engine code or tests. Do not invent gameplay effects. Owner acceptance is required before any candidate is migrated to canonical historical data.


## 13. Follow-up research — full global benchmark coverage (19/11/2026)

ChatGPT's repository audit found the checked-in CoW extracts contain only 17 year points through 1914 and the builder compiles only four of six available indicators. Official current-source pages identify newer candidates that should be independently reviewed:

1. **CoW NMC v7.0:** official documentation advertises annual six-component data (population, urban population, iron/steel, energy, military personnel, military expenditure) for 1816–2022. Compare official abridged and supplemental source/quality files to the exact checked-in files. Determine the version/extract provenance and preserve codebook definitions, quality, anomaly, source locator and unit. Do not infer that the state-system dataset covers decentralized/non-state actors.
2. **Maddison Project Database 2023:** official Groningen release covers GDP per capita and population for 169 countries and aggregate regions up to 2022; CC BY 4.0; DOI 10.34894/INZBF2. Compare its historical unit definitions and year/entity coverage with our Maddison 2010 files. Record original papers/citations as required. Do not use present-day territory values as historical polity totals without a documented crosswalk.
3. **Historical Financial Statistics:** CFS describes a large 1500–1950 collection of exchange rates, banking, interest rates, money supply, inflation, trade, government finance and national accounts. Its site states reuse restrictions for database reproduction, including commercial and noncommercial databases. Treat as a source-discovery catalogue until rights are cleared; do not copy bulk series into the product.

Required outputs:
- `HYDROGEN_BENCHMARK_SOURCE_AUDIT_VI.md`
- `HYDROGEN_BENCHMARK_COVERAGE.csv` (one metric/source/region/time observation group per row, with year count, entity count, unit, source IDs, quality, limitations)
- `HYDROGEN_BENCHMARK_CROSSWALK.csv` (source entity to 1836 game entity/region, temporal basis, method, uncertainty; do not auto-map)
- `HYDROGEN_BENCHMARK_RIGHTS_REVIEW.csv`
- `HYDROGEN_BENCHMARK_MISSINGNESS.csv` (181 registry entities × field × 1836–1936 period, including explicit missing rows)

Explicitly verify 1915–1936 coverage; 12 macro-region taxonomy; all polity types; five entity/CoW code reconciliation cases; and the unit/definition differences among each metric. Do not silently interpolate missing values or declare the benchmark global-complete. This task is research-only; no canonical data, source registry, ETL, runtime, test, save or APK change is authorized.


### 13.1 ChatGPT coverage matrices for independent review

Additional research-only artifacts are available in `EVENTS_AND_CALIBRATION`:
- `BENCHMARK_ENTITY_METRIC_COVERAGE.csv`: all 181 registry entities × 6 current CoW metrics (1,086 rows); 322 rows have observations and 764 are explicit missing. Please check the entity/CoW mapping and whether every missing row is truly absent from the checked-in extracts.
- `MADDISON_2010_UNIT_COVERAGE.csv`: 94 population units + 66 GDP-per-capita units (160 rows); unit names are present-day territorial units and were not matched automatically to game polity IDs.
- Do not interpret these rows as a macro-region-complete benchmark. The project’s twelve macro-region taxonomy is still awaiting owner approval and a canonical crosswalk.
