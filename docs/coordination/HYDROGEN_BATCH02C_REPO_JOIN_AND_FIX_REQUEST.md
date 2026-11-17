# Hydrogen Batch 02C — Repository Join & Final Corrections

**Input:** `H01_SubSaharan_Africa_Batch02_Closed.zip`  
**Independent review:** `docs/audit/s0/H01_BATCH02_CLOSED_INDEPENDENT_REVIEW_2026-11-17.md`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Reference snapshot:** `cc84a87a7d10d1b5a20aedd7abbaf5cd465a25bd`

## Important new reference file
The repository-side reference is committed at:
`docs/audit/s0/H01_REPO_REGION_REFERENCE_2026-11-17.json`

Link:
https://github.com/mtieu6470-maker/Victori3-mobile/blob/claude/game-historical-sandbox-modes-kg7rj7/docs/audit/s0/H01_REPO_REGION_REFERENCE_2026-11-17.json

It contains the exact 81 Sub-Saharan African region rows selected using the project's `tools/audit/regions.ts` classifier, the 181-entity registry, snapshot commit and source blob SHAs. It is a lookup aid, not a pre-judged H01-to-region crosswalk. If the Hydrogen sandbox cannot read GitHub, ask the user to upload this JSON alongside the H01 ZIP.

## 1. Complete exact entity region bindings
Use the exact repository ownership lists below. Record full lists in both entity crosswalk and profiles. Do not keep an entity marked partial when the list below is exhaustive.

### 17 playable H01 entities
- ETH: `ETH_GON`, `ETH_TIG`
- SHE: `SHE_ANK`
- SOK: `SOK_SOK`, `SOK_KAN`, `SOK_ZAR`, `SOK_ADA`, `SOK_ILO`
- BOR: `BOR_KUK`
- WAD: `WAD_ABE`
- DAR: `DAR_FAS`
- ASH: `ASH_KUM`, `ASH_NOR`
- DAH: `DAH_ABO`
- OYO: `OYO_OYO`
- MAS: `MAS_HAM`
- FJA: `FJA_TIM`
- LIB: `LIB_MON`
- ZUL: `ZUL_MGU`
- NDE: `NDE_MOS`
- BSO: `BSO_THA`
- MER: `MER_CEN`, `MER_EAS`
- BUG: `BUG_BUG`

### Four decentralized umbrella entities
- `DZ_WAFRICA`: `DZ_SENEGAMBIA`, `DZ_FUTATORO`, `POR_GUI_X`, `DZ_SLE_INT`, `DZ_KRU`, `DZ_KONG`, `DZ_SEGOU`, `DZ_MOSSI`, `DZ_FANTE`, `DZ_BENIN`, `DZ_IGBO`, `DZ_BAGIRMI`.
- `DZ_CAFRICA`: `DZ_CAMEROON`, `DZ_GABON`, `DZ_LOANGO`, `DZ_KONGO`, `DZ_KASANJE`, `DZ_OVIMBUNDU`, `DZ_LUNDA`, `DZ_LUBA`, `DZ_KUBA`, `DZ_CONGO_W`, `DZ_AZANDE`.
- `DZ_EAFRICA`: `DZ_MOMBASA`, `DZ_NYAMWEZI`, `DZ_KENYA_INT`, `DZ_BUNYORO`, `DZ_RWANDA`, `DZ_OROMO`, `DZ_HARAR`, `DZ_SOMALI`, `DZ_AFAR`.
- `DZ_SAFRICA`: `DZ_OVAMBO`, `DZ_NAMA`, `DZ_XHOSA`, `DZ_TSWANA`, `DZ_GRIQUA`, `DZ_PEDI`, `DZ_MPONDO`, `DZ_SWAZI`, `DZ_GAZA`, `DZ_SHONA`, `DZ_LOZI`, `DZ_YAO`, `DZ_MARAVI`, `DZ_SAKALAVA`.

These are repository map ownership lists, not a licence to allocate every H01 population slot to all listed regions. Complete entity ownership and demographic crosswalk separately.

## 2. Complete all 81 demographic region slots
Current state: 64/81 slots unresolved; 16/29 events still reference unresolved slots.

Requirements:
- Exact repo IDs only; never create synthetic target IDs.
- One row per `h01_region_slot_id × repo_region_id`.
- Every slot's allocation weights sum to 1.000.
- Many-to-one/one-to-many links specify whether components are disjoint and additive; no duplicate persons.
- Unresolved target is null/empty with explicit unresolved status/reason.
- Region facts must use actual repo IDs when verified; never fake key strings.
- Reconcile slot totals and final target-region totals.

Correct/re-evaluate current rows:
- `GBR_GAM` owned by `GBR`, not only `DZ_WAFRICA`.
- `OMA_ZAN` and `OMA_SWA` owned by `OMA`, not only `DZ_EAFRICA`.
- `GBR_CAP` and `GBR_CAE` owned by `GBR`, not only `DZ_SAFRICA`.
- `DZ_FUTATORO` owned by `DZ_WAFRICA`; do not conflate Futa Toro with Futa Jallon (`FJA`).
- Preserve `LIB_MON` vs Grain Coast hinterland. Keep unsupported hinterland allocation unresolved.

## 3. Repair all source references
`SRC_H01_COBI_1976` appears in Ndebele profile fields and military/economy CSV but is absent from sources and bibliography. Replace with registered `SRC_H01_RASM_1978` and exact locators if appropriate, or add a complete Cobi entry. Scan all JSON/CSV references, not only three CSV subsets.

## 4. Reconcile uncertainty model
- Keep row-summed totals 62,705,000 / 47,605,000 / 81,640,000 unless row evidence justifies changes.
- Frankema & Jerven 2014 concerns African population 1850–2010; its public abstract discusses population data reliability and backward projection, not the specific `rho≈0.35` or 95% joint interval 54.2m–71.8m.
- Provide exact page/table and a reproducible covariance formula, or remove the unsupported joint interval.
- Fix malformed control characters in `H01_population_reconciliation.md` (use Unicode `ρ`, `≈`, `→` or escaped LaTeX).
- Cape Colony `supported` row needs the actual 1836 Blue Book table/page; otherwise lower quality.

## 5. Finish events
- Resolve all `unresolved_region_slot:SSA_REG_*` references or leave event explicitly blocked.
- Replace `macro_scope:SUB_SAHARAN_AFRICA_81_SLOTS` with a supported structured scope.
- Reconcile colonial actors: GBR in Anglo-Asante, Anglo-Zulu, Boer, and Sokoto conquest events; FRA in Dahomey and Hova wars; GER in Herero-Nama and Maji Maji; ITA in Second Italo-Ethiopian War. Berlin Conference and WWI need documented actor policy for imperial powers.
- Do not use `DZ_SAFRICA` as Boer/Voortrekker actor; do not activate TRN/OFS before their start dates.
- Split Blood River one-day battle (1838-12-16) from civil-war period to 1840 where they are distinct events.
- Validate actor chronology and region/scope resolution.

## 6. Deliver real assets or state not delivered
Current manifest: 22 rows (17 portraits, 5 audio); no binaries delivered.
- For five historical portrait candidates, fetch exact file, confirm page/rights/attribution, dimensions and SHA-256.
- Produce the 12 original portrait assets only after checking cultural details; do not claim historical likeness for interpretive reconstructions.
- Do not count art briefs as delivered assets or silent audio as sound.
- Include `H01_ASSETS_PHASE1.zip` only if actual binaries exist.
- Verify Futa Jallon dual-leader succession, Buganda term `muzikiti`, and cultural fit of Shona mbira + Basotho lesiba in one soundscape.

## 7. Rebuild validation report after final archive
- Resolve the contradiction `no_blocked=False` shown as PASS.
- State clearly 64 slots unresolved until actually resolved.
- Regenerate compressed/uncompressed byte sizes from the final ZIP.
- Separate structure pass, research complete, repo IDs resolved, media delivered, and engine import ready.

## Return
Return `H01_SubSaharan_Africa_Batch02_RepoJoin.zip` containing revised crosswalks, region facts, events, sources, provenance, profiles, military/economy, population reconciliation, bibliography, asset manifest and actual media if delivered, changelog and a regenerated validation report.

No game code, runtime schema, save format, workflow or APK modifications. Unresolved historical mappings must remain explicitly unresolved.
