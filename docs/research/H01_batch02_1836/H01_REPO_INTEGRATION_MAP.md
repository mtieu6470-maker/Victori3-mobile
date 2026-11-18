# H01 batch 02 — repository integration map (R3v)

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
