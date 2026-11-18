# Global Population Cohort Seed Research — Gemini Hydrogen Task

**Project:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Research role:** Gemini Hydrogen — historical research and source-backed content  
**Date:** 2026-11-18  
**Historical reference date:** 1 January 1836 (use nearest defensible observation when exact-date data do not exist)  
**Scope:** all-world playable/history dataset; use the current repository entity and 662 Strategic Region baselines  
**Status:** `RESEARCH_REQUEST_ONLY / CANDIDATE_DATA_ONLY / NO_RUNTIME_AUTHORIZATION`

## 1. Purpose

Prepare source-backed candidate inputs for the future Population Cohorts system. The current engine models population mainly as region totals plus nine strata shares; it does not yet represent independently simulated cohorts, age structure, detailed occupation, actual employment or wages.

The design proposal is:

- `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`
- Reviewed design revision: `b35c5367cfe41bea3036bec2b846d19060f495c0`

This task is **research only**. Do not edit runtime databases, `db.json`, historical seed files consumed by the game, `src/`, tests, save files, engine code, UI, assets, workflows or Android files. Do not imply that candidate values are already accepted or game-ready.

## 2. Global coverage requirements

Cover the complete set of historical/playable entities in the repository's current baseline, not only Europe and not only major powers. Use the existing entity IDs and source registries. Do not invent new country IDs or silently merge distinct historical polities.

The game currently uses 662 Strategic Regions as its macro simulation layer. Research should identify what evidence exists at each level:

1. polity/state total;
2. historically documented subregion or province;
3. settlement/city;
4. game Strategic Region, but only where a defensible crosswalk exists.

Do not assign modern administrative units to 1836 as if their boundaries were historically valid. A modern statistical unit may be used as a spatial proxy only when its period mismatch, crosswalk method and uncertainty are explicit.

Balance research coverage across Europe, Africa, Asia, the Americas and Oceania. If one region has poorer surviving records, report the evidence gap; do not replace missing evidence with unsupported estimates.

## 3. Population dimensions to research

For each polity and defensible geography, investigate the following dimensions separately. A total-population source does not establish any of the other dimensions.

| Dimension | Required research |
|---|---|
| Total population | 1836 estimate/observation, population scope, date, geographic coverage, range and method |
| Age structure | Age bands or age-specific counts/shares, exact band definitions and source date |
| Occupation / livelihood | Agriculture, pastoralism, fishing, mining, domestic service, craft/artisan, trade, transport, military, clergy, administration and other locally appropriate categories |
| Social/strata structure | Historically meaningful social/economic categories and how they map (or do not map) to the game's nine strata |
| Rural/urban | Urban share, settlement definition, city/town thresholds and geographic coverage |
| Culture / language | Historically appropriate population groups, terminology used by source, overlap and contested classification |
| Religion | Religious affiliation or community distribution; keep unknown separate from unaffiliated/non-practising where evidence distinguishes them |
| Literacy / education | Literacy or schooling evidence, sex/age scope, language and measurement definition |
| Enslavement / unfree status | Legally and socially distinct forms of slavery, serfdom, bonded labour and other coercive status; do not collapse all into a single globally uniform category |
| Wealth / income | Only direct evidence or defensible proxies; do not claim precise per-capita wealth from class labels or aggregate GDP alone |
| Migration / displacement | Only where dated and geographically scoped evidence exists; identify forced migration, seasonal movement and ordinary migration separately |

A dimension may be `verified`, `supported`, `estimated`, `uncertain` or `missing`. These labels apply per dimension/field, not automatically to the entire polity.

## 4. Population-scope discipline

For every total or subgroup, explicitly distinguish:

- people living inside a geographic boundary;
- people under effective administration/control;
- people claimed by a polity or ruler;
- populations in tributary, suzerain, confederated or contested relationships;
- mobile, pastoral, seasonal or displaced populations whose location may not match a fixed map polygon.

Do not assign every person inside a broad geographic region to the state that owns the game's map region if the historical control relationship was weaker, shared or disputed. Record overlapping claims and uncertainty rather than forcing one answer.

For confederations, federations, indigenous polities, decentralized societies and multi-state gameplay aggregates, do not invent a unified census or a single ruler/identity where no such polity existed.

## 5. Source and methodology standard

Prioritize:
1. archival census, tax, land, parish, military, port or administrative records with known scope;
2. peer-reviewed historical demography and specialist monographs;
3. academic historical datasets with documented construction and uncertainty;
4. official heritage/archive institutional histories for political and jurisdictional context;
5. reputable reference sources only as leads or corroboration, not as sole support for disputed quantitative claims.

Avoid Wikipedia-only evidence, unsourced infographics, modern demographic projections presented as historical facts, and AI-generated citations.

For every source, record:
- stable `source_id`;
- author/institution/title;
- publication or archival date;
- direct URL/catalogue identifier and page/table/folio locator;
- original observation date and geographic scope;
- units and definitions;
- whether values are direct observations, interpolation, reconstruction or secondary estimates;
- limitations, bias, missing groups and known disputes;
- access/licence or reuse restrictions where relevant.

When estimating 1836 from a nearby year, document the formula, input values, assumptions and uncertainty interval. Do not silently interpolate across major wars, famine, epidemics, annexations or boundary changes.

Do not invent numerical ranges to make coverage appear complete. Use null/missing plus an open evidence request when the evidence is inadequate.

## 6. Candidate data format

Place research deliverables in a new, clearly labelled research-only directory, for example:

`docs/research/GLOBAL_HISTORICAL_1836_1936/POPULATION_COHORT_SEEDS/`

Suggested outputs:

1. `README_VI.md` — coverage, method, status and unresolved limitations.
2. `POPULATION_DIMENSION_COVERAGE.csv` — one row per entity/geography/dimension, including evidence status and scope.
3. `COHORT_SEED_CANDIDATES.csv` — candidate records only, with columns equivalent to:
   - `seed_candidate_id`
   - `entity_id`
   - `geography_id_or_label`
   - `geography_level`
   - `dimension`
   - `category_id_or_label`
   - `value`
   - `unit`
   - `lower_bound`
   - `upper_bound`
   - `observation_date`
   - `reference_date`
   - `population_scope`
   - `quality`
   - `method_id`
   - `source_id`
   - `crosswalk_id`
   - `notes`
4. `SOURCE_REGISTRY_DELTA.csv` — normalized source records.
5. `METHODS_AND_CROSSWALKS_VI.md` — explicit estimates, temporal adjustments and spatial mapping methods.
6. `OPEN_EVIDENCE_REQUESTS.csv` — missing, conflicting or low-confidence values and what evidence would resolve them.
7. `REGIONAL_COVERAGE_SUMMARY.csv` — coverage and gaps by world region, entity and dimension.

Keep one value per row and one source claim per row where possible. Preserve original source categories alongside any proposed normalized game category; never overwrite the historical term with the game's abstraction.

Do not create cohorts by blindly taking the Cartesian product of culture × religion × age × occupation × stratum. Only create a candidate cohort combination when the joint distribution is supported or a transparent, explicitly estimated method is documented.

## 7. Mapping candidate data to game regions

A polity-level value must not be copied to every owned Strategic Region. Regional allocation is allowed only with a defensible source or crosswalk.

For each proposed spatial mapping:
- identify the historical geography and its valid period;
- identify the game Strategic Region IDs involved;
- state the crosswalk method (area-weighted, settlement-weighted, population-weighted or another explicit method);
- record overlap fractions and any unallocated remainder;
- distinguish direct evidence from modeled allocation;
- include uncertainty and known boundary mismatch.

If reliable spatial allocation is impossible, retain the evidence at polity level and mark `geography_level=polity`; do not fabricate a region-level seed.

## 8. Acceptance checks for the research package

The research package is complete only when:

- every current baseline entity appears in the coverage matrix, even if all values are `missing`;
- all five world regions are represented and no continent is silently excluded;
- every non-null quantitative candidate has a source locator, unit, date, population scope and quality label;
- estimated values include reproducible method and uncertainty;
- totals and component shares reconcile where the source definitions make reconciliation possible;
- no unsupported occupation, age, religion, wealth or literacy values are inferred from the total-population table;
- modern geography is never silently labelled as an 1836 boundary;
- disputed and overlapping political control remains explicit;
- CSV files are rectangular, UTF-8, consistently quoted, with unique non-empty IDs;
- sources and methods can be independently checked by another reviewer.

Provide a short prioritized list of missing evidence that would most improve the first implementable cohort bootstrap. Avoid spending effort fabricating full detail for a polity with no reliable evidence.

## 9. Deliverable boundary

This task creates **research candidates only**. It does not:
- authorize changing production historical data;
- authorize any code or save-schema changes;
- approve a cohort seed for runtime;
- open S1 or S6;
- approve full historical data coverage or Victoria 3 feature parity.

Hydrogen must return source-backed files and a summary of what is verified, estimated, uncertain and missing. ChatGPT will validate structure and cross-check integration against the design. Claude may independently review the design/research package. The project owner retains data-patch and phase-acceptance authority.
