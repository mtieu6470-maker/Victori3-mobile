# H01 batch 02 — repository integration map (R3z)

## Integration boundary
This R3t task integrates H01 research, provenance, reconciliation and audit decisions into the repository documentation layer. It does **not** integrate unresolved H01 estimates into shipped game data.

Repository: `mtieu6470-maker/Victori3-mobile`  
Branch: `claude/game-historical-sandbox-modes-kg7rj7`  
Base HEAD observed before integration: `d73b548108f1876e3ed9c4c44d175fe560028f28`

## Files added under `docs/research/H01_batch02_1836/`
- `README_VI.md` — entry point and status.
- `H01_INTEGRATED_AUDIT_REPORT_VI.md` — consolidated decision record for all 17 entities and three key scope disputes.
- `H01_INTEGRATED_17_ENTITY_RECONCILIATION.csv` — profile-vs-mapped-region arithmetic plus decisions.
- `H01_REGION_SCOPE_AND_CONTROL_FLAGS.csv` — explicit technical mapping vs historical sovereignty distinctions.
- `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` — source additions and bibliographic corrections; proposals, not silent rewrite of live source registry.
- `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` — unresolved evidence and phase/review gates.
- `H01_VALIDATION_REPORT.md` — structural/arithmetic checks and limits.
- This map — integration scope and deliberate exclusions.

## Deliberately not changed
- `historical_data/population/population_totals_1836.json`
- `historical_data/countries/_core_profiles_asia_africa.json`
- `historical_data/political_entities/registry.json`
- `historical_data/borders/regions_1836.csv`
- `tools/build-data.ts`, generated DB, source runtime inputs, map owners, game simulation, save schema/migrations, tests, assets, Android, workflows and APK.

Reason: the current `docs/coordination/AI_HANDOFF.md` says S1 is `NOT_STARTED`, gameplay/engine/save changes are not authorized, and the current phase does not allow shipped historical data/content changes. The collaboration protocol also says research must not be silently committed as verified game data; integration and acceptance are subject to phase scope.

## Next gate
Obtain readable Law (1977) pp.295–302 and pp.81–90, Asiwaju (1989) English p.704, transparent calculation for the 1.45m regional estimate, and page-level Everill/Rasmussen/Lye evidence. Then request owner authorization for a separately scoped S1 population/control-data patch. Claude must independently review this documentation commit; ChatGPT's checks are self-audit only.


## R3u supplemental documentation layer
- Added `H01_R3u_SUPPLEMENTAL_SOURCE_AUDIT_VI.md`, `H01_R3u_SOURCE_EVIDENCE_MATRIX.csv`, `H01_R3u_PATCH_DECISIONS.csv`, `H01_R3u_OPEN_EVIDENCE_REQUESTS.csv` and `H01_R3u_SOURCE_REGISTRY_DELTA.csv`.
- The consolidated audit/validation/README are updated. No live historical_data, map, runtime or workflow files changed.


## R3v supplemental Liberia source layer
Added under `docs/research/H01_batch02_1836/`:
- `H01_R3v_LIBERIA_PRIMARY_SERIES_RECONCILIATION_VI.md` — detailed source-lineage and scope assessment.
- `H01_R3v_SOURCE_EVIDENCE_MATRIX.csv` — source-level evidence, inspection level and caveats.
- `H01_R3v_SOURCE_REGISTRY_DELTA.csv` — candidate source registry additions; does not overwrite live registry.
- `H01_R3v_LIBERIA_SERIES_COMPARISON.csv` — unit/date/geography distinctions for Starr, Shick, Freeman, 1843 roster and Hassell.
- `H01_R3v_PATCH_DECISIONS.csv` — explicit disposition of disputed values.
- `H01_R3v_OPEN_EVIDENCE_REQUESTS.csv` — remaining source requests and statuses.
- `GITHUB_INTEGRATION_RECEIPT_R3v.md` — commit chain and boundary receipt.

R3v clarified that Starr's 1836 `2,230` belongs to a Liberia immigrant vital-statistics series excluding Maryland and excluding the aboriginal population definition; Shick's ACS individual-emigrant series records `242` arrivals in 1836 versus Starr's `209`, an unresolved source-series conflict. Freeman's approximate `1,500` Monrovia inhabitants is a c.1837 quotation carried by Hiller (1860), not a census. A September 1843 Monrovia roster transcription was located but original page images and inclusion coverage remain unverified.

**No numerical promotion:** R3l LIB 3,500, LIB_MON 3,600 and the extra 100 remain quarantined; DZ_KRU 356,400 remains a conditional arithmetic residual only. No live historical_data, population profiles/benchmarks, political registry, map owner/geometry, runtime, save schema, engine, tests, assets, Android, workflow or APK files changed. All R3v commits use `[skip ci]`; Claude independent review and owner acceptance remain pending.


## R3w Oyo research source layer
Added:
- `H01_R3w_OYO_CITATION_AND_TRANSITION_AUDIT_VI.md` — Asiwaju p.704 citation trace and staged collapse/Ago Oja/Atiba chronology.
- `H01_R3w_SOURCE_EVIDENCE_MATRIX.csv` and `H01_R3w_SOURCE_REGISTRY_DELTA.csv` — source/inspection/caveat records.
- `H01_R3w_PATCH_DECISIONS.csv` — OYO profile, broad region and >750k claim dispositions.
- `H01_R3w_OPEN_EVIDENCE_REQUESTS.csv` — remaining numeric/source and chronology requirements.

The accessible Asiwaju p.704 chapter text describes a multi-level Oyo influence/tribute geography but does not substantiate the >750k demographic claim attributed to it by Butcher & Griffiths. This citation chain remains open; no numerical replacement is offered. The historical sequence is documented as collapse/desertion c.1835–36, displaced alliance at Ago Oja, then formal ritual installation and fuller official reconstitution c.1838. These circa-year sources do not justify a precise 1836-01-01 border/owner change.

R3w updates research and coordination documentation only. Live historical_data, populations, owner registry, map geometry, runtime/engine/save schema, tests, assets, Android and workflows remain unchanged. No numeric approval, PR, merge or APK build.


## R3x NDE source layer
Added:
- `H01_R3x_NDE_POPULATION_AND_CONTROL_SCOPE_AUDIT_VI.md` — Lye direct page audit and Rasmussen trace through Delius.
- `H01_R3x_SOURCE_EVIDENCE_MATRIX.csv` and `H01_R3x_SOURCE_REGISTRY_DELTA.csv` — source-level evidence, page locations and inspection caveats.
- `H01_R3x_PATCH_DECISIONS.csv` — NDE profile description, range, military force, broad region and migration unit dispositions.
- `H01_R3x_OPEN_EVIDENCE_REQUESTS.csv` — remaining direct Rasmussen pages, interval derivation and dated territorial boundary requests.

R3x changes the research wording of NDE 60k from an alleged Ndebele/Nguni core to an approximate broad subject population of Mzilikazi's polity, circa 1830s. Lye's 1k–5k is a separate 1836 Nguni military-force estimate; 10k–20k is a later departure stream; Delius records 20k as the most reliable end-1820s estimate and some estimates three to four times higher. R3l's 45k–85k band remains methodologically unverified. NDE_MOS 210k remains broad geography only.

No shipped population/profile/ownership/geometry/runtime/save/test/assets/Android/build/workflow change. No numeric approval, PR, merge or APK build.


## R3y Oyo political geography source layer
Added:
- `H01_R3y_OYO_1831_1836_POLITICAL_GEOGRAPHY_AND_POPULATION_AUDIT_VI.md` — year-by-year Oyo/Ilorin/southern successor-state chronology and demographic-unit analysis.
- `H01_R3y_SOURCE_EVIDENCE_MATRIX.csv` and `H01_R3y_SOURCE_REGISTRY_DELTA.csv` — source scope, locators, inspection levels and limitations.
- `H01_R3y_PATCH_DECISIONS.csv` — disposition of OYO 650k, OYO_OYO 1.45m, SSA_REG_18 control assignment, transition year and 75k Atlantic embarkation metric.
- `H01_R3y_OPEN_EVIDENCE_REQUESTS.csv` — unresolved Law pages, population derivation, ownership table and successor-state crosswalk requests.

R3y establishes that the 1831–36 political geography was fragmented and changing. By 1833 Ilorin had destroyed or subjected most major Oyo towns; in 1836 the old capital district was abandoned and several states competed for control. The 1:1 SSA_REG_18 join to OYO is technical only. OYO 650k (refugee/polity scope) and OYO_OYO 1.45m (broad regional resident reconstruction) are different units with no reproducible quantitative derivation supplied, so both remain quarantined.

No live historical_data, population, profiles, political registry, map owner/geometry, engine/runtime/save schema, tests, assets, Android, Gradle, workflows or APK changed. No numeric approval, PR, merge or build.


## R3z Rasmussen source-quality layer
Added:
- `H01_R3z_RASMUSSEN_SOURCE_QUALITY_REVIEW_VI.md` — contemporary source critique of Rasmussen's *Migrant Kingdom*.
- `H01_R3z_SOURCE_EVIDENCE_MATRIX.csv` — review and Google Books evidence with access caveats.
- `H01_R3z_PATCH_DECISIONS.csv` — disposition of the Rasmussen-derived NDE candidate and unsupported interval.
- `H01_R3z_OPEN_EVIDENCE_REQUESTS.csv` — full review metadata, original Rasmussen pages and interval derivation.

R3z adds a contemporary methodological caveat but does not reject Rasmussen or replace any demographic estimate. It reinforces that war/migration narratives and scarce, uneven evidence are inadequate to construct a statistical range without an explicit denominator and method. Direct Rasmussen pp.23–26 and pp.90–94 remain unavailable; no new number is approved.

No live historic data/profile/benchmark/owner/geometry/runtime/save/test/assets/Android/workflow/APK files changed.


## R3aa NDE 1829 source-chain layer
Added under `docs/research/H01_batch02_1836/`:
- `H01_R3aa_NDE_1829_ARCHBELL_CHASE_RASMUSSEN_TRACE_VI.md` — trace of Chase's 80k report, Archbell correspondence, Rasmussen as quoted by Kruger, and Lye's composite subject estimate.
- `H01_R3aa_SOURCE_EVIDENCE_MATRIX.csv` — source inspection level and precise limitations.
- `H01_R3aa_PATCH_DECISIONS.csv` — semantic dispositions for NDE 60k, 45–85k, source estimates, military units and broad mapped geography.
- `H01_R3aa_OPEN_EVIDENCE_REQUESTS.csv` — original Archbell letter, Rasmussen pages, scope comparison and interval-method requests.
- R3aa sources are added to `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv`; the R3x request R3T-07 is advanced with Chase and indirect Rasmussen evidence.

The main distinction is that Chase's c.80k covers the country Malacatzie had conquered, including Batow/Bichuana dependants, while Rasmussen's c.20k figure is reported by Kruger as referring to the Rustenburg area. The numbers may have different geographical universes and cannot be treated as like-for-like. The original Archbell letter is not inspected; the archive date/box/item references remain inconsistent. Lye's 1836 1–5k estimate is a military force, not a population count.

No H01 numeric value is approved. No shipped data, profile, owner registry, geometry, runtime, engine, save schema, tests, assets, Android, Gradle, workflow or APK changed. No PR or merge.
