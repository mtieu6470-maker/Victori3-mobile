# H01 package review — 2026-11-17

Input: `H01_SubSaharan_Africa_1836_1936_Package.zip`
Reviewed repository HEAD: `cc84a87a7d10d1b5a20aedd7abbaf5cd465a25bd`
Verdict: **RESEARCH-USEFUL / NOT READY FOR ENGINE IMPORT**.

## Structural checks
- 65 entity rows, no duplicate keys: 17 playable, 2 future, 4 existing umbrella IDs, 42 unresolved `UNSUPPLIED_BASELINE_DZ_01..42` placeholders.
- 17 profile JSON records exactly match the 17 playable IDs.
- 81 region rows, all use synthetic `SSA_REG_01..81` slot IDs; 0/81 are bound to actual repository region IDs.
- 22 event rows; 19 military/economy rows.
- 15 asset records: 9 marked verified, 1 needs URL check, 5 are text-only art briefs. No media binaries are in the ZIP (~132 KB uncompressed).

## P0 — block direct import
The 42 `UNSUPPLIED_BASELINE_DZ_*` identifiers are research placeholders, not runtime IDs. The `SSA_REG_*` keys are not map IDs. The repository's existing 81 Sub-Saharan Africa regions use IDs in `historical_data/borders/regions_1836.csv`; H01's logical geographic units may split or combine those regions. Require an evidence-backed one-to-many/many-to-one crosswalk with allocation weights and no duplicated population. Keep unmodeled historical polities as annotations under real umbrella entities unless separately approved; do not create new runtime IDs.

## P1 — data and source defects
- 81 point estimates sum to 62,705,000, matching the Markdown.
- Summed lower bounds = 47,605,000 (Markdown says 47,915,000; difference 310,000).
- Summed upper bounds = 81,640,000 (Markdown says 81,535,000; difference 105,000).
- Methodology says 80/81 rows are reconstructions, but CSV marks all 81 rows reconstruction/estimated.
- All 81 regional rows cite only `SRC_H01_MANN_2014`; region-level figures need row-specific method and supporting locators.
- `SRC_H01_LAW_1991` conflates distinct Robin Law and Edna Bay works. Split and update all references.
- `SRC_H01_CORD_1985` is used for Wadai-specific facts but is a work on Dar al-Kuti; add Wadai-specific evidence or downgrade the claims.
- All 17 profile records mark GDP/capita missing, but `H01_military_economy.csv` has only one explicit missing GDP row (ETH).
- Frankema & Jerven (2014) describes African population series 1850–2010; it is methodological context, not direct evidence for 1836 subnational counts.

## P1 — events
The `date_or_range` column mixes exact dates, year-only dates and slash ranges; replace with ISO `start_date`, `end_date`, `date_precision`, and `date_confidence`. Split separate events currently bundled together: Great Trek vs. Ndebele migration; Sand River vs. Bloemfontein conventions; Herero-Nama War vs. Maji Maji; Great Depression vs. Women's War (Aba); and distinct colonial campaigns where triggers/dates differ.

## P2 — assets
The plan targets 17 portraits, 17 banners, 22 event illustrations, 19 emblems and five ambience loops. Only 10 external image candidates and five text-only briefs exist; there are no image/audio files. Exact source URLs, licenses, author, dimensions and checksums must be confirmed before a candidate is treated as verified. This package does not advance the 3–4 GB content target.

## Preserve
The package correctly keeps Liberia's small ACS enclave distinct from the larger indigenous population; treats Oyo as collapsing around 1835–36; places the Ndebele in the western Transvaal before migration north; keeps TRN/OFS inactive in 1836; and leaves unsupported GDP/capita values missing.

## Gate
Do not import into runtime data, saves, map topology or APK. Re-review after corrected ID crosswalk, reconciled population bounds, source register, parseable event schema and real asset manifest arrive.

Reference repository files: `historical_data/political_entities/registry.json`, `historical_data/borders/regions_1836.csv`, `docs/audit/s0/b3/review1/global_data_audit.json`, `docs/audit/s0/S0_GLOBAL_DATA_AUDIT.md`.
