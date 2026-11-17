# Hydrogen Batch 02 — H01 corrective pass

**Input:** `H01_SubSaharan_Africa_1836_1936_Package.zip`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Repository snapshot used by ChatGPT for the review:** `cc84a87a7d10d1b5a20aedd7abbaf5cd465a25bd`

Hydrogen is requested to return a corrected research package. Do not write code, change engine/save schemas, edit workflows, commit, invent runtime IDs, or claim APK integration.

## Mandatory outputs

1. **Entity binding:** `H01_entity_id_crosswalk.csv` for all 65 audited subjects. Bind only to exact IDs in `historical_data/political_entities/registry.json`. The 42 `UNSUPPLIED_BASELINE_DZ_*` values are placeholders, not runtime keys. Keep unmodeled polities as research annotations under existing umbrella IDs unless they are explicitly marked as candidates for a later owner decision.

2. **Region binding:** `H01_region_id_crosswalk.csv` and `H01_region_facts_RECONCILED.csv`. Use real IDs from `historical_data/borders/regions_1836.csv`. Do not force a 1:1 map because both lists contain 81 rows. Allow one-to-many/many-to-one mapping, show allocation weights, prevent population duplication, and preserve the distinction between geographic-region population and polity-effective population.

3. **Population reconciliation:** `H01_population_reconciliation.md`. The current CSV sums to 62,705,000 point estimate, 47,605,000 lower bound and 81,640,000 upper bound. The current methodology says 47,915,000 and 81,535,000 for the bounds. Identify and justify row-level corrections; do not merely edit summary totals. Resolve the 80/81-vs-81/81 reconstruction classification inconsistency.

4. **Sources/provenance:** `H01_sources_REVISED.csv`, `H01_bibliography_REVISED.md`, `H01_PROVENANCE_AUDIT.csv`. Split the mixed `SRC_H01_LAW_1991` record (Robin Law and Edna Bay works); review Wadai claims using `SRC_H01_CORD_1985`; add exact page/table/archival locators for numeric claims; use Frankema–Jerven 2014 only as context for its 1850–2010 series, not direct 1836 evidence. Explicitly mark GDP/capita missing for all 17 playable entities or document a deterministic omission-means-missing rule.

5. **Events:** `H01_events_REVISED.csv` with ISO `start_date` and `end_date`, `date_precision`, `date_confidence`, valid actor IDs and real map-region IDs. Split separate events currently merged together (Great Trek vs. Ndebele migration; Sand River vs. Bloemfontein conventions; Herero-Nama vs. Maji Maji; Great Depression vs. Women's War; separate conquest campaigns).

6. **Media:** `H01_asset_manifest_REVISED.csv`, `H01_visual_asset_briefs.md`, and `H01_ASSETS_PHASE1.zip` if assets are actually produced/cleared. The existing ZIP contains no image/audio binaries. Complete 17 playable leader portraits: five current candidate entries need exact URL/license/checksum verification; create art briefs for the other 12 leaders (ETH, SOK, BOR, WAD, DAR, ASH, OYO, MAS, FJA, LIB, NDE, BUG). The current five original-art briefs are not images. After portraits, plan banners, event illustrations, emblems and five original/licensed 60–90 second regional ambience loops. Do not use duplicate, padded or placeholder assets.

## Acceptance
- Every region link resolves to a real repo region ID at the specified snapshot.
- Population is assigned once, no duplicated people, allocation weights reconcile.
- CSV totals exactly agree with Markdown.
- Every source ID resolves and metadata is internally consistent.
- All events parse and all actor/region IDs resolve.
- Every verified asset has actual bytes, dimensions/duration, exact license, attribution and SHA-256.
- Report real package sizes. Do not claim this batch alone achieves the 3–4 GB download target.

Return one ZIP named `H01_SubSaharan_Africa_Batch02_Corrected.zip` with the outputs above, changelog and explicit blocked items. If any mapping or historical fact cannot be evidenced, leave it marked unresolved instead of guessing.
