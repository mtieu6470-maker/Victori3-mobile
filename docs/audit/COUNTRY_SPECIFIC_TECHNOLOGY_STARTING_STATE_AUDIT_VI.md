# AUDIT — COUNTRY-SPECIFIC TECHNOLOGY STARTING STATE (1836)

**Task:** TECH-START-01  
**Status:** SOURCE/DATA AUDIT — DESIGN ONLY / NO RUNTIME AUTHORIZATION  
**Baseline:** `3ee40d4a66b403f05083846e9af106a13ebbc707`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Date:** 2026-11-20

## 1. Executive finding

The current technology start system is **not country-specific at the level of individual technologies**. It assigns a small technology bundle from one of four broad tiers, then adds five country-specific overrides. The data build has 181 registry entities, but the inspected country profile set has only 11 detailed polity files and just 10 of those contain an explicit technology-level fact. The 136 core profiles contain no explicit technology-level field. The remaining starting states are inferred from registry tier/default rules.

This is a concrete source-backed explanation for why different countries can appear to start with similar or historically implausible technology. It is not a judgment that every country must have a unique technology list; countries should differ where evidence and capabilities justify it.

## 2. Exact current implementation

### 2.1 Data model

- `src/engine/data/dbTypes.ts`: `TechRecord` contains `id`, `tree`, `cost`, `historical_year`, `prereqs`, `effects`. It has no per-technology source references, quality, adoption date/range, region, actor capability or deployment state.
- `EntityRecord` contains one scalar `tech_level` and `research_completeness`; no country-specific set of known technologies with evidence.
- `HistoricalDB.start_techs` is `Record<countryId, string[]>`; no per-entry provenance/quality.

### 2.2 Data build rules

At `tools/build-data.ts`:

1. Detailed entity records read `det.technology.level.value`; if missing, the builder defaults to `behind_frontier`.
2. Core-profile records have no technology level; they use registry tier B → `behind_frontier`, otherwise `pre_industrial`.
3. A hard-coded special case assigns `advanced` to NED, SWI, SAX and BEL.
4. The builder then creates `start_techs` by copying one of four arrays from `technologies.json`, plus per-country overrides.
5. Five overrides exist: PRU, BEL, USA, FRA and SAX.

### 2.3 Current tier bundles

| Tier | Starting technology count | Bundle |
|---|---:|---|
| frontier | 10 | mechanized_spinning, steam_engines, puddling_iron, coke_smelting, railways, general_staff, joint_stock_banking, public_schooling, steam_press, percussion_caps |
| advanced | 6 | mechanized_spinning, steam_engines, puddling_iron, joint_stock_banking, public_schooling, steam_press |
| behind_frontier | 3 | mechanized_spinning, steam_engines, public_schooling |
| pre_industrial | 0 | none |

Country overrides:
- PRU: general_staff, coke_smelting
- BEL: railways, coke_smelting
- USA: railways
- FRA: coke_smelting, percussion_caps
- SAX: coke_smelting

The tier bundles are nested only partially and contain assumptions that require validation. For example, the `frontier` bundle includes railways and percussion caps as already known; the `advanced` bundle omits both, while country overrides re-add some technologies. These are not per-technology adoption records.

### 2.4 Coverage snapshot from the repository files

- Registry: 181 entities; tier counts A=11, B=29, C=123, D=18.
- Country profile files: 11 detailed entity files plus three core-profile files covering 136 profiles.
- Detailed country files with an explicit `technology.level`: 10/11. EIC has no technology section.
- The 136 core profiles have no `technology.level` field.
- The technology catalogue has 38 records.
- Only five per-country starting-tech override entries exist.

This is a structural coverage count, not a claim that all 181 entities should be playable or that all have equal access to formal research institutions.

## 3. Additional systemic issues

### 3.1 Research availability is mostly universal

`src/engine/systems/technology.ts`:
- `availableTechs()` filters only whether the technology is already known and whether its prerequisite IDs are present.
- There are no country-specific institutional, resource, literacy, infrastructure, military-organization or production-site eligibility rules.
- `researchPoints()` does vary by literacy, strata, universities, education law, trade openness and education budget, but this affects speed, not the set of technologies a country can meaningfully research.
- `techCost()` uses one global historical-year penalty and a diffusion share calculated from all living countries. It does not currently calculate diffusion from actual neighbors, trade partners, migration, experts, captured equipment or institutional links, despite the catalogue description mentioning diffusion from neighbours/trade partners.

### 3.2 Technology and practical capability are conflated

A country knowing a concept does not prove it has:
- skilled engineers, artisans or trained operators;
- tooling, machine shops, foundries or precision instruments;
- reliable access to coal, iron, copper, nitrates, rubber or other inputs;
- institutions capable of teaching, financing and maintaining the technology;
- domestic production capacity rather than imported equipment;
- deployed infrastructure or units using the technology.

The current `techs: string[]` collapses knowledge, adoption, domestic production and deployment into one boolean.

### 3.3 Starting technology tier also leaks into other initial conditions

`src/engine/init.ts:stageOf()` derives a stage from `industrialization` when present, otherwise from `tech_level`. That stage is then used to seed regional strata, industrial building capacity and railway placement. A coarse or missing technology/industrialization profile can therefore affect more than the research screen: it can change starting POP composition and industry.

The technology audit must be reconciled with the economy, population and historical baseline before any runtime patch.

## 4. Recommended replacement data contract

Do not replace the four tiers with arbitrary country-by-country hand-authored lists. Use a country × technology evidence matrix with explicit epistemic and capability states.

Suggested record:

```ts
interface CountryTechnologyFact {
  entityId: string;
  technologyId: string;
  status: 'known' | 'adopting' | 'accessible' | 'unknown' | 'not_adopted';
  knowledgeDate?: string;
  adoptionDate?: string;
  deployedFrom?: string;
  evidenceQuality: 'verified' | 'supported' | 'estimated' | 'uncertain' | 'missing';
  sources: SourceRef[];
  method?: string;
  geographicScope?: string;
  confidenceNote?: string;
}
```

Required distinctions:
- **Known:** documented knowledge, design or practical understanding existed.
- **Adopting:** adoption process underway, but not yet widespread.
- **Accessible:** can be imported/licensed/learned under current conditions, not yet domestically deployed.
- **Not adopted:** evidence supports absence or a meaningful lag; do not infer merely from lack of a source.
- **Unknown:** evidence insufficient; never convert unknown to false/zero.

Technology effects should be layered:
1. Knowledge unlocks research/blueprints and may provide limited theoretical effects.
2. Institutional capacity, skills, finance and material inputs gate adoption.
3. Production methods/buildings gate domestic manufacture.
4. Infrastructure/equipment/unit records gate actual deployment.
5. Diffusion channels modify access/adoption rates; they must use actual trade, diplomacy, migration, education or captured-equipment relationships, not a global average alone.

## 5. Historical research and provenance requirements

For each country-technology fact:
- identify source title, author/publisher, publication date, URL and precise page/chapter/table/archival locator;
- state whether evidence concerns invention, first prototype, first practical adoption, widespread adoption, domestic production or deployment;
- preserve source date precision and regional scope;
- record uncertainty and conflicting evidence;
- distinguish imported technology from domestic invention/production;
- do not infer absence from silence;
- check source redistribution rights before packaging source text/data; citations and factual conclusions still need provenance.

Existing `sources_default` in `technologies.json` is not sufficient to prove each technology was known by each country on 1836-01-01. The two general references can remain discovery/background references, but each material starting assignment needs its own support.

## 6. Required validation tests before implementation

1. Every starting technology ID exists and has valid prerequisites.
2. A country cannot start with a technology whose prerequisite is not satisfied unless a reviewed exception explicitly models an alternative historical pathway.
3. No technology dated after 1836-01-01 is marked known at start without direct evidence of earlier adoption/knowledge; historical_year is not itself a hard invention date.
4. Known/access/adoption/deployment states are distinct and do not create free production bonuses without required capabilities.
5. Countries with incomplete evidence remain `unknown`, not silently assigned a generic advanced or pre-industrial technology bundle.
6. Historical and Sandbox start from the same accepted 1836 facts; divergence comes from subsequent simulation.
7. Same country and seed produce stable starting tech state and save/load round-trip.
8. Technology unlock, industrial buildings, production inputs and military equipment all consume the same canonical technology/capability state.
9. Country-level comparisons cover all 12 macro-regions and include sovereign, subject, colony/company, rebel and decentralized polities where the data model supports them.
10. Report coverage by evidence quality and temporal/geographic scope, not only by number of nonempty technology arrays.

## 7. Recommended implementation sequence — not authorized yet

1. Extend source schema to store per-country/per-technology facts and quality.
2. Build a validation-only report showing current country × technology coverage and prerequisite conflicts.
3. Research a representative set across macro-regions and polity types; independent review each evidence tranche.
4. Reconcile country technology facts with industrialization, initial buildings, literacy, universities, resources and military organization.
5. Add runtime eligibility/capability rules only after the relevant phase/scope is open.
6. Migrate existing `start_techs` into the new contract without silently granting or deleting knowledge; preserve legacy behavior behind an explicit compatibility version until owner approval.

## 8. Scope and gate

- This is a source/data architecture audit only.
- No historical fact values were added or changed.
- No technology definitions, starting technology assignments, runtime code, tests, generated DB, save schema, assets, UI, Android, Gradle, workflow or APK were changed.
- S0 remains PARTIAL/BLOCKED; S1 remains NOT_STARTED; S22 remains DESIGN_ONLY. This audit does not authorize technology implementation or alter any phase gate.

## 9. Files inspected

- `tools/build-data.ts`
- `src/engine/data/dbTypes.ts`
- `src/engine/init.ts`
- `src/engine/systems/technology.ts`
- `historical_data/technologies/technologies.json`
- `historical_data/political_entities/registry.json`
- `historical_data/countries/GBR.json`, `FRA.json`, `PRU.json`, `RUS.json`, `JAP.json`, `QNG.json`, `EIC.json`, `EGY.json`, `TUR.json`, `USA.json`, `AUS.json`
- `historical_data/countries/_core_profiles_europe.json`, `_core_profiles_asia_africa.json`, `_core_profiles_americas.json`
