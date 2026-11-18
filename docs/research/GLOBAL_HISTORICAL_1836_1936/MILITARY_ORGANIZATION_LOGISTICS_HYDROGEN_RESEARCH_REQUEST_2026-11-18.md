# Global Military Organization, Operations and Logistics — Gemini Hydrogen Research Task

**Project:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Period:** 1836–1936 (with exact 1836 starting baseline)  
**Coverage:** every current historical/playable polity and all five world regions  
**Status:** `RESEARCH_REQUEST_ONLY / CANDIDATE_EVIDENCE / NO_RUNTIME_AUTHORIZATION`

## 1. Purpose and boundary

Research source-backed evidence for future S20 Military Organization and S21 Operations/Combat/Logistics.

Design proposal:
`docs/spec/MILITARY_ORGANIZATION_OPERATIONS_LOGISTICS_PROPOSAL_VI.md`

Research only. Do not edit runtime data, code, saves, tests, UI, assets, Android, workflows or APKs. Do not invent units, commanders, force locations or battle outcomes to fill gaps.

## 2. Global coverage

Every current baseline entity must appear in a coverage matrix, including entities with missing evidence. Cover Europe, Africa, Asia, Americas and Oceania. For aggregate gameplay entities, list historical constituents and clarify if they shared a command or military institution. Do not backdate later federations/armies or treat modern borders as historical military districts.

## 3. Research dimensions

For each polity and defensible date/geography, investigate separately:

### Force structure
- standing/professional army, militia, levies, retinues, confederate forces, tribal/local warriors, mercenaries, auxiliaries, colonial formations and irregular forces;
- unit/formation names in original language and translated terms;
- hierarchy/scale (company, regiment, brigade, corps, army, flotilla, fleet) only where documented;
- command authority, local autonomy and shared/collective command;
- recruitment method and legal obligations;
- reserve/mobilization practices, training/drill and service duration;
- officer/NCO/staff structures and appointment/succession context.

### Equipment and technology
- infantry weapons, artillery, cavalry, fortifications, engineering and communications;
- vessel/ship classes, transports and river/coastal/naval forces;
- technology adoption dates by polity and geography;
- supply, ammunition, animal fodder, fuel/coal, medical and repair requirements;
- manufacturing/arsenal/shipyard base where documented.

### Operations and logistics
- roads, river routes, ports, canals, railways and military transport by valid date;
- depots, magazines, arsenals, supply lines, convoy and procurement systems;
- typical movement range/time, seasonal constraints and terrain;
- siege, blockade, amphibious landing, naval control and expeditionary capability;
- command-and-control/communications limits;
- attrition, disease, desertion, casualties and replacement systems.

### Historical conflict evidence
- named campaigns/battles/sieges only where sources document dates, actors, locations and outcomes;
- participant force estimates with range, method and reliability;
- distinguish official reports, contemporary claims and modern scholarly reconstruction;
- do not use historical victory as deterministic outcome target;
- capture strategic objective, operations, logistics, losses and aftermath rather than just winner/loser.

## 4. Evidence and uncertainty

Prioritize archives, official military histories, museum/archive catalogues, peer-reviewed specialist scholarship and published campaign studies. Every quantitative or contested claim must have:
- source_id;
- author/institution/title;
- publication/archive date;
- direct URL/catalogue identifier;
- page/table/folio locator;
- observation date and spatial scope;
- original units and conversion;
- direct observation vs estimate/reconstruction;
- uncertainty bounds/method;
- known bias, exclusions and disagreement;
- licence/access/reuse notes.

Use field-level quality: `verified`, `supported`, `estimated`, `uncertain`, `missing`. A unit roster source does not verify actual field strength; a campaign narrative does not verify exact casualties; a treaty does not prove effective mobilization.

Do not generate exact battalion strengths, battle casualties, supply rates or route distances without source/method. Preserve ranges and conflicting estimates.

## 5. Legacy force pool constraint

Current game save only records aggregate army manpower/quality/morale/supply and navy strength/quality. It does not preserve:
- historical regiment/unit identities;
- formation hierarchy;
- unit garrison locations;
- commanders;
- reserve composition;
- depot stock or supply routes;
- battle records.

Research outputs must not recommend fabricating any of these during legacy migration. Where data is unavailable, use `unknown`, `unorganized_force_pool` or explicit estimated aggregate, never an invented unit roster.

## 6. Candidate deliverables

Create research-only folder:
`docs/research/GLOBAL_HISTORICAL_1836_1936/MILITARY_ORGANIZATION/`

Suggested files:
1. `README_VI.md` — method, coverage and uncertainty.
2. `POLITY_MILITARY_COVERAGE.csv` — one row per entity and dimension.
3. `ORGANIZATION_MODELS_CANDIDATES.csv` — force types, hierarchy, recruitment, command and dates.
4. `UNIT_TYPE_EVIDENCE.csv` — source-backed unit/ship types and temporal validity.
5. `EQUIPMENT_TECHNOLOGY_EVIDENCE.csv` — equipment, production, adoption, maintenance.
6. `MOBILIZATION_RECRUITMENT_EVIDENCE.csv` — manpower obligations, reserve, training, service terms.
7. `LOGISTICS_TRANSPORT_EVIDENCE.csv` — roads/rail/rivers/ports/depot/supply and dated capacity estimates.
8. `CAMPAIGN_BATTLE_EVIDENCE.csv` — battles/sieges/campaigns, strength/casualty ranges, methods and source locators.
9. `COMMANDER_CHARACTER_CANDIDATES.csv` — historical commanders/officers with exact office/service dates and provenance; do not infer unsupported traits.
10. `SOURCE_REGISTRY_DELTA.csv`.
11. `OPEN_EVIDENCE_REQUESTS.csv`.
12. `WORLD_REGION_COVERAGE_SUMMARY.csv`.

One sourced claim per row where possible. Keep original terms and proposed normalized game category side by side. CSVs must be rectangular with unique stable IDs.

## 7. Acceptance checks

- Every current baseline entity appears, even where evidence is missing.
- Coverage spans all five world regions and varied polity types.
- Every unit/force/commander/campaign claim has a dated source locator and quality.
- Unit type/organization has temporal validity; no anachronistic deployment.
- Recruitment and force estimates distinguish authorized strength, nominal strength, mobilized strength and field strength.
- Equipment/supply rates have units and methods.
- Logistics geography is period-valid.
- Modern military categories are not projected backward without justification.
- Historical wins/losses are not treated as scripted simulation outcomes.
- No candidate roster is converted into runtime unit records without review/owner approval.

## 8. Handoff boundary

This is research evidence only. It does not authorize runtime military data changes, code, save migration, tests, UI, S20/S21 implementation or APK build. ChatGPT validates structure; Claude may independently review the research; the project owner accepts data and authorizes phases.
