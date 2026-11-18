# H01 batch 02 — repository integration map (R3t)

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
