# H01 Sub-Saharan Africa — R3l Self-Review

**Date:** 17 November 2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Branch head before this docs-only audit commit:** 2529d58176ce93bcbfd8bc2021568abc10949893  
**Package:** H01_SubSaharan_Africa_Batch02_RepoJoin_R3l_WWI_CHRONOLOGY_REVIEW.zip  
**ZIP size:** 85,348 bytes  
**Uncompressed payload:** 307,504 bytes  
**SHA-256:** dafbf7769d15f5ba062ad2913ff0b8be91bc22978927e6652ee16a638b6cd94e

This is an assistant-produced self-review, not an independent Claude review, owner acceptance, runtime-import approval, or S1 gate transition.

## 1. Archive and structural checks

| Check | Result |
|---|---|
| ZIP CRC / extraction | PASS |
| Inventory | 12 files: 8 CSV, 1 JSON, 3 Markdown |
| UTF-8 CSV / JSON parsing | PASS |
| Event records | 34 unique event IDs; all ISO dates valid and start <= end |
| Source register | 35 unique source IDs |
| Structured source references | 35 distinct IDs; all resolve; 0 orphan and 0 unused sources |
| Provenance | 128 unique claim IDs |
| Crosswalk | 90 rows, 81 source slots |
| Allocation weights | 81/81 slots sum to 1.000 |
| Asset manifest | 22 rows; 0 image/audio binaries delivered |

## 2. First World War chronology correction

The R3k package correctly separated Ethiopia's undeclared neutrality and Liberia's 1917 declaration of war from the general African campaign event. R3l adds a further date-precision correction:

- `PROP_H01_EVT_020` now spans **7 August 1914 to 25 November 1918**, with day-level `supported` confidence. Edward Paice's Africa Research Institute article dates the first shot fired by a British unit in the Great War to the Togoland invasion on 7 August 1914 and the last German troop surrender in Northern Rhodesia to 25 November 1918.
- These are the opening and final endpoints across different African theatres. They do not imply that Togoland, Cameroon, South-West Africa and East Africa all remained active for the entire interval.
- New source `SRC_H01_PAICE_2014` and provenance claim `CLM_128` support the endpoints.
- `PROP_H01_EVT_020C` (Ethiopia's undeclared neutrality) retains year-level precision and now uses year-boundary ISO placeholders (1914-01-01 to 1918-12-31). The event notes explicitly say these placeholders are not exact start/end dates.

The primary U.S. diplomatic record for Liberia remains clear: the Liberian Congress passed its war resolution on 4 August 1917; the U.S. Minister's telegram was sent on 5 August. Ethiopia's neutrality account is based on Jakob Zollmann's 1914-1918-online article.

## 3. Repository referential and temporal checks

Repository snapshots rechecked against the branch:
- `historical_data/political_entities/registry.json`: 181 entities, blob `97ba54d8d5547c2bbedfb4ed1a41833c7fe387ca`
- `historical_data/borders/regions_1836.csv`: 662 regions, blob `904bae66f03c36821e4f32d7526c61bd779d5c42`

Across the 34 event records:
- 33 distinct actor IDs; all exist in the registry.
- 29 distinct affected region IDs; all exist in the region registry.
- 32 event records contain state actor IDs, with 81 actor references.
- Rechecking all 81 actor references against registry `hist_from` / `hist_to` produced 0 dated-interval mismatches.
- 19 associations still use undated decentralized umbrella placeholders (`DZ_WAFRICA`, `DZ_CAFRICA`, `DZ_EAFRICA`, `DZ_SAFRICA`). These remain broad historical associations, not date-validated sovereign-state actors.

## 4. Population and geography

Regional facts remain 78 rows: 75 verified rows, one provisional `POR_MOZ` aggregate, and two unresolved null slots.

| Component | Point | Lower | Upper |
|---|---:|---:|---:|
| Verified facts | 59,085,000 | 44,925,000 | 76,870,000 |
| Provisional POR_MOZ | 1,590,000 | 1,180,000 | 2,100,000 |
| Unresolved SSA_REG_44 + SSA_REG_45 | 2,030,000 | 1,500,000 | 2,670,000 |
| **Total** | **62,705,000** | **47,605,000** | **81,640,000** |

- `SSA_REG_62` + `SSA_REG_63` remain a provisional disjoint aggregation to `POR_MOZ`; this is not a validated polygon match.
- `SSA_REG_44` (Kordofan/Nuba) and `SSA_REG_45` (Bahr el-Ghazal/Sudd) remain null.
- All 81 allocation-weight groups still sum to 1.000.

## 5. Remaining limitations and readiness

- 17 playable profiles still lack a supported 1836 GDP/capita observation; this remains explicitly missing.
- No image or audio binaries are included. The 22 asset rows remain text/metadata only; hashes, direct-file URLs and physical dimensions remain blank.
- Four region slots are not import-ready (two provisional slots feeding one aggregate target and two null slots).
- The undated umbrella actor associations remain semantically broad.
- Historical event interpretation and gameplay effects have not been independently accepted.

| Gate | Result |
|---|---|
| Archive / structural parsing | PASS |
| Structured source integrity | PASS |
| Event actor / region ID existence | PASS |
| Dated actor interval audit | PASS, 0 mismatches |
| Crosswalk weights / population arithmetic | PASS |
| Historical research completeness | PARTIAL |
| Region-binding completeness | PARTIAL |
| Media delivery | NOT DELIVERED |
| Engine import readiness | NO — DO NOT IMPORT |
| S1 | NOT STARTED |

## 6. Independent review requested

Claude or another independent reviewer should verify the exact R3l ZIP by SHA-256, reproduce the structural/source/population/actor-date checks, and review the historical interpretation and Paice/Zollmann/FRUS sources independently. Return PASS / REQUEST_CHANGES / BLOCKED with row-level evidence.

Do not change code, gameplay, runtime data, save schemas, workflows, APKs, or S1. Do not import R3l. Do not treat this assistant self-review as the independent REVIEW_PASS or owner ACCEPTED gate.

**Supersession:** R3l supersedes R3k as the latest assistant-produced H01 research QA candidate. R3k remains retained as history.
