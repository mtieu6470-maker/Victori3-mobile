# Hydrogen — H01 Batch 02 gap-closure request (2026-11-17)

**This is a corrective continuation, not permission to invent IDs or change game code.**

Input files already reviewed:
- `H01_entity_id_crosswalk.csv`
- `H01_region_id_crosswalk.csv`
- `H01_region_facts_RECONCILED.csv`
- `H01_events_REVISED.csv`
- `H01_sources_REVISED.csv`
- `H01_PROVENANCE_AUDIT.csv`

Review report: `docs/audit/s0/H01_BATCH02_REVIEW_2026-11-17.md`.

## Repository files you must use

Re-fetch or inspect these exact files from the project branch; do not use guessed or cached ID lists:

- `historical_data/borders/regions_1836.csv`  
  https://github.com/mtieu6470-maker/Victori3-mobile/blob/claude/game-historical-sandbox-modes-kg7rj7/historical_data/borders/regions_1836.csv
- `historical_data/political_entities/registry.json`  
  https://github.com/mtieu6470-maker/Victori3-mobile/blob/claude/game-historical-sandbox-modes-kg7rj7/historical_data/political_entities/registry.json
- `docs/audit/s0/b3/review1/global_data_audit.json`  
  https://github.com/mtieu6470-maker/Victori3-mobile/blob/claude/game-historical-sandbox-modes-kg7rj7/docs/audit/s0/b3/review1/global_data_audit.json

The data files above were checked at repository snapshot `cc84a87a7d10d1b5a20aedd7abbaf5cd465a25bd`. The current branch has only later documentation commits; confirm the data-file blob hashes before relying on the snapshot.

## Required corrections

### A. Region crosswalk — P0
1. Replace all `BLOCKED_UNATTACHED_REGIONS_1836_CSV` with exact existing repository region IDs where evidence supports it. Never create a synthetic target ID.
2. Use one row per `h01_region_slot_id × repo_region_id` pair. A source slot may map to multiple target regions. For every source slot, allocation fractions across its target rows must sum to exactly 1 (within documented rounding tolerance).
3. If multiple source slots map into one target region, state whether the source populations are non-overlapping and can be added. Do not duplicate populations.
4. Keep historical subregions/ethnopolities as annotations where there is no separate runtime region/entity; do not upgrade them to new entities without owner approval.
5. Fix known questionable mappings:
   - `SSA_REG_02` / `SSA_REG_03`: separate the Cayor/Wolof hinterland, Gambia/Bathurst (`GBR_GAM`) and Casamance components where supported. Do not map both whole slots to `DZ_SENEGAMBIA` without a geographic split.
   - `SSA_REG_06`: separate the 3,500 ACS settlers from the 356,500 reconstructed indigenous/rural population. `LIB_MON` is the Monrovia map region, not a blanket whole-Grain-Coast target.
   - Consider exact repository candidates such as `ETH_TIG`, `SHE_ANK`, `BUG_BUG`, `OMA_ZAN`, `OMA_SWA`, `DZ_NYAMWEZI`, `GBR_CAP`, `GBR_CAE`, `MER_EAS`; only bind where geography/population ownership supports it.
6. In `H01_region_facts_RECONCILED.csv`, replace ambiguous `repo_region_id_verified` with an actual ID field (`repo_region_id`) and a separate `binding_status`. The final runtime-facing table should use actual repo region IDs. Keep source slot IDs only as provenance aliases.

### B. Population — P1
1. Correct the 81 row-level values or ranges responsible for the difference between the CSV sums and methodology's lower/upper totals.
2. Point total currently sums to 62,705,000; lower and upper sums currently 47,605,000 and 81,640,000. The previous method file stated 47,915,000 and 81,535,000. Reconcile at row level and explain all changes.
3. Include `H01_population_reconciliation.md` with per-row old/new estimate, old/new range, cited evidence, method and reason.
4. Explain why 80 rows are `estimated` while one row is `supported`, and how `data_class` distinguishes reconstruction from a census anchor.
5. Once regions are bound, aggregate by actual runtime region ID and prove each person is counted once.

### C. Events — P1
1. Remove every `BLOCKED_SSA_REG_*` region reference; all event region references must resolve to a real ID in `regions_1836.csv` or to a documented, engine-supported structured scope.
2. Define `ALL` and `ALL_REGIONS` as formal special tokens only if the event contract supports them. Otherwise replace them with explicit structured fields.
3. Do not use `TRN` or `OFS` as actors before their entity start dates (1852 and 1854 respectively). Great Trek starts in 1835; Ndebele migration starts in 1837; Blood River starts in 1838. Use contemporaneous, supported actors or an annotation-only actor.
4. Re-evaluate Omani relocation to Zanzibar: verify whether the actor should include `OMA`, not only `DZ_EAFRICA`.
5. Split campaigns into distinct events where there are different triggers or intervals; ensure all actor IDs and source-region IDs resolve.
6. Keep ISO dates, `date_precision`, `date_confidence`, and one source locator per claim.

### D. Provenance and bibliography — P1
1. Expand provenance from 40 rows to complete coverage: each of the 81 numeric region facts must have its own auditable record; include material values from all entity profiles and military/economy data.
2. If a method cites Manning plus a local monograph, include both source IDs in a machine-readable multi-source field.
3. Keep exact page/table/archival locators and mark estimates with method/range.
4. Supply `H01_bibliography_REVISED.md` and ensure every source ID resolves exactly once in the revised source CSV.
5. Keep the Law (1991) and Bay (1998) source entries separate. Wadai claims need Wadai-specific support (Nachtigal) rather than unsupported use of Cordell's Dar al-Kuti study.

### E. Entity crosswalk — finish exact bindings
1. Keep 42 unmodeled historic polities annotation-only under existing umbrellas; no new runtime IDs.
2. Populate all 17 active playable entities with exact 1836 region IDs from repo ownership.
3. Populate the four decentralized umbrellas with their exact existing owned region IDs.
4. Add supported region references for the 42 annotation-only polities, or keep an explicit `unresolved` state with rationale. Do not put `BLOCKED_REPO_CSV_UNATTACHED` into a file described as completed.

### F. Missing media/document outputs
The previous six-file upload did not include:
- `H01_population_reconciliation.md`
- `H01_bibliography_REVISED.md`
- `H01_asset_manifest_REVISED.csv`
- `H01_visual_asset_briefs.md`
- `H01_ASSETS_PHASE1.zip`
- `H01_CHANGELOG_AND_LIMITATIONS.md`
- revised `H01_entity_profiles.json`
- revised `H01_military_economy.csv`

For assets, actual binaries are required for any item marked delivered/verified. Every image needs exact source URL, author, license/permission, attribution, dimensions and SHA-256. Every audio file needs duration, codec, license/permission and SHA-256. If no images/audio were made, state `not delivered`; do not mark briefs as media assets. Use original/generated art or properly licensed historical images; do not pad using duplicates, empty files, upscales or placeholders.

## Return contract

Return one complete archive named:

`H01_SubSaharan_Africa_Batch02_Closed.zip`

It must contain:
- all six revised CSVs;
- `H01_population_reconciliation.md`;
- `H01_bibliography_REVISED.md`;
- `H01_entity_profiles.json`;
- `H01_military_economy.csv`;
- `H01_asset_manifest_REVISED.csv`;
- `H01_visual_asset_briefs.md`;
- `H01_ASSETS_PHASE1.zip` if media were actually produced;
- `H01_CHANGELOG_AND_LIMITATIONS.md`;
- `H01_VALIDATION_REPORT.md` with row counts, uniqueness checks, source resolution, ID resolution, population sums, event validation and byte sizes.

No code, engine schema, save data or GitHub workflow changes. If a historical boundary or population split cannot be evidenced, leave it unresolved with its exact blocker and do not label the archive ready for import.
