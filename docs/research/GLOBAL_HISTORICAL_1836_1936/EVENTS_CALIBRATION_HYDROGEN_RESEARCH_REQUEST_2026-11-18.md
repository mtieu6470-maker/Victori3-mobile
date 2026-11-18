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

## 10. Handoff boundary

This task supplies source-backed research candidates only. It does not authorize runtime changes, event scripts, shipped data patches, code, save migration, tests, S22 implementation or APK builds. ChatGPT validates structure and methodology; Claude may independently review; project owner retains data acceptance and phase approval.
