# H01 Sub-Saharan Africa — R3j Self-Review

**Date:** 17 November 2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Branch head before this docs-only audit commit:** af85bebb8f140ace459133e52af4939c98ee32ac  
**Package:** H01_SubSaharan_Africa_Batch02_RepoJoin_R3j_RESEARCH_QA.zip  
**ZIP size:** 80,480 bytes  
**Uncompressed payload:** 294,453 bytes  
**SHA-256:** 4a61822280b9a5239279409ca35550d2fd2ae64b0ce79b9d782ae0c6f8478b95

This is an assistant-produced self-review, not an independent Claude review, owner acceptance, runtime-import approval, or S1 gate transition.

## 1. Archive and schema checks

| Check | Result |
|---|---|
| ZIP CRC and round-trip extraction | PASS |
| Inventory | 12 entries: 8 CSV, 1 JSON, 3 Markdown |
| UTF-8 and parse checks | PASS for all CSV and JSON files |
| Unexpected control characters | None |
| Event rows | 32 unique IDs; all dates parse as ISO calendar dates and start <= end |
| Provenance rows | 125 unique claims |
| Source register | 32 IDs, all 32 used in structured source fields; 0 orphan and 0 unused IDs |
| Event actor IDs | 33 distinct IDs, all exist in repository registry |
| Event affected region IDs | 29 distinct IDs, all exist in repository region registry |

Repository snapshot checked:
- historical_data/political_entities/registry.json: 181 entities, blob 97ba54d8d5547c2bbedfb4ed1a41833c7fe387ca
- historical_data/borders/regions_1836.csv: 662 regions, blob 904bae66f03c36821e4f32d7526c61bd779d5c42

## 2. Event actor-date interval audit

All 30 event records that contain state actor IDs were checked against the registry's hist_from / hist_to values.

- 80 actor references checked.
- 0 actor-date interval mismatches for entities that have dated validity bounds.
- 19 associations involve decentralized umbrella placeholders (DZ_WAFRICA, DZ_EAFRICA, DZ_CAFRICA, DZ_SAFRICA) with no hist_from / hist_to in the registry. These are intentionally broad historical associations, not independently dated state actors. They remain a semantic granularity limitation.
- Events PROP_H01_EVT_006B and PROP_H01_EVT_015A2 have no state actor_ids; their named historical participants are retained in non_state_historical_actors because no matching date-valid registry polity is available.
- The Berlin Conference event uses the currently represented registry IDs; France and Austria-Hungary are not represented by date-valid 1884 entities, and SWE is only a partial proxy for the Sweden-Norway union.

The date-precision update on PROP_H01_EVT_006 is deliberate: 1862-05-16 is retained as the repository MAS end-date alignment value, while the historical event is marked month-level because sources differ on the exact mid-May capture/occupation day.

## 3. Crosswalk and population arithmetic

- H01_region_id_crosswalk.csv: 90 rows, 81 distinct H01 slots; every slot's allocation_weight sums to 1.000.
- H01_region_facts_RECONCILED.csv: 78 rows = 75 verified facts + 1 provisional POR_MOZ aggregate + 2 unresolved null slots.
- Verified facts: 59,085,000 (range 44,925,000–76,870,000).
- Provisional POR_MOZ: 1,590,000 (range 1,180,000–2,100,000), from disjoint additive components SSA_REG_62 + SSA_REG_63.
- Unresolved SSA_REG_44 + SSA_REG_45: 2,030,000 (range 1,500,000–2,670,000).
- Continental totals: 62,705,000 (range 47,605,000–81,640,000); all integer sums reconcile.

The POR_MOZ join is provisional only. The region label includes the Mozambique coast and Zambezi prazos, but the game's generated boundaries are approximate and this review does not prove polygon equivalence. Do not runtime-import this binding yet. The two null slots also remain outside import.

## 4. Material research/data corrections carried forward

1. PROP_H01_EVT_006 ends at the repository MAS.hist_to boundary, with month-level historical precision. PROP_H01_EVT_006B separately records the post-conquest 1863–64 resistance and Umar Tall's death, without inventing a state ID.
2. PROP_H01_EVT_015A ends at DAH.hist_to (15 January 1894). PROP_H01_EVT_015A2 separately records the 26 January telegram reporting Béhanzin's personal submission, without extending the DAH sovereign actor.
3. PROP_H01_EVT_018 ends on 15 March 1903 when Sokoto loses sovereignty. The 20 March date remains the end of the British force's post-conquest wind-down.
4. Post-1848 FRA actor references remain removed because the registry's FRA entity is the July Monarchy ending 24 February 1848.
5. SRC_H01_NNR_1902, SRC_H01_CORNEVIN_1960, SRC_H01_SHD_WEB, and both SRC_H01_OLOR_1968 / SRC_H01_ROBI_1985 are now linked through structured source_id fields, not only locator prose.
6. Sahle Selassie's portrait candidate is labelled CC BY-SA 4.0 with attribution; Dingane, Moshoeshoe I and Ranavalona I creator/license metadata are corrected. The Ranavalona file is dated 1905 and is no longer described as a contemporary 19th-century lithograph.

## 5. Remaining limitations

- 2 region slots remain null: SSA_REG_44 (Kordofan/Nuba) and SSA_REG_45 (Bahr el-Ghazal/Sudd).
- POR_MOZ is provisional; no exact boundary match is claimed.
- 19 event actor associations use undated decentralized umbrella placeholders and should not be misread as precise sovereign-state participation.
- 17 playable profiles still have 1836 GDP/capita documented as missing.
- Asset manifest has 22 metadata/brief rows but 0 delivered image/audio binaries. No file hash, direct asset URL or dimensions are fabricated.
- Historical interpretation, event mechanics, and all runtime ingestion remain outside this package-only audit.

## 6. Readiness

| Gate | Result |
|---|---|
| Archive/structure | PASS |
| Structured source integrity | PASS |
| Actor/region ID existence | PASS |
| Dated actor interval check | PASS, 0 mismatches |
| Undated umbrella semantics | PARTIAL, 19 associations |
| Crosswalk weights and population arithmetic | PASS |
| Region-binding completeness | PARTIAL — provisional + 2 null |
| Historical research completeness | PARTIAL |
| Media delivery | NOT DELIVERED |
| Engine import readiness | NO — DO NOT IMPORT |
| S1 | NOT STARTED |

This package is ready for independent data-package review only. It is not a runtime integration candidate yet.

## 7. Independent review requested

Claude or another independent reviewer should verify the attached R3j ZIP by exact SHA-256, reproduce all checks above independently, inspect the underlying sources and row-level claims, and return PASS / REQUEST_CHANGES / BLOCKED with evidence.

Do not modify gameplay code, runtime data, save schemas, workflows, APKs, or S1. Do not import the package. Do not invent polygon joins, state IDs, source facts, media binaries or exact event dates.

**Supersession:** R3j supersedes R3h as the latest assistant-produced research QA candidate. The previous R3h handoff is retained as history only.
