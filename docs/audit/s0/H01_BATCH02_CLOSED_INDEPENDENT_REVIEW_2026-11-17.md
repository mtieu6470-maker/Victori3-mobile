# H01 Batch 02 Closed — Independent Review

**Review date:** 2026-11-17  
**Input archive:** `H01_SubSaharan_Africa_Batch02_Closed.zip`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Repository HEAD reviewed:** `e3ba769ef78f2de71936886a97cea1511e6b2925`  
**Data snapshot in archive:** `cc84a87a7d10d1b5a20aedd7abbaf5cd465a25bd`  
**Verdict:** `PARTIAL — REPO JOIN IMPROVED, NOT READY FOR RUNTIME IMPORT`

## 1. ZIP integrity and inventory
- ZIP integrity: PASS.
- 14 files; 274,978 bytes uncompressed; archive size 67,773 bytes.
- No `H01_ASSETS_PHASE1.zip` and no actual image/audio binaries.
- The uploaded archive differs from its own `H01_VALIDATION_REPORT.md`: the report says 274,629 bytes uncompressed and 67,568 bytes compressed. Rebuild byte counts after final packaging.

## 2. Checks that pass
| Area | Result | Verdict |
|---|---|---|
| Entity subjects | 65 unique rows: 17 playable, 2 future, 4 umbrellas, 42 annotations | PASS for row structure |
| Region slots | 81 unique H01 slots, 85 mapping rows | PASS for key structure |
| Allocation weights | All 81 source slots sum to 1.000 | PASS for arithmetic conservation |
| Regional facts | 84 rows; enclave + rural components sum to each point estimate | PASS for component arithmetic |
| Population sums | Point 62,705,000; lower 47,605,000; upper 81,640,000 | PASS for row-summed arithmetic |
| Events | 29 unique IDs, ISO dates, no reversed ranges | PASS for date syntax |
| Source register | 25 unique source IDs | PASS for register uniqueness |
| Provenance | 120 unique claim IDs, including 81 source-slot population claims and 17 GDP-missing claims | PASS for claim-key uniqueness |
| Playable profiles | 17 JSON profiles | PASS for record count |

## 3. P0 — Region mapping is still incomplete
- 64/81 H01 source slots remain unresolved.
- Crosswalk has 85 rows; 65 mapping rows retain unresolved targets, while 20 resolved mapping rows point to 19 distinct repository IDs.
- Region facts have 84 rows: 65 have blank `repo_region_id` and `binding_status=unresolved_awaiting_regions_1836_csv`.
- 16/29 events still reference `unresolved_region_slot:SSA_REG_*`.
- Three macro events use `macro_scope:SUB_SAHARAN_AFRICA_81_SLOTS`, not a repository region ID. Use a documented structured event scope or expand to real IDs.

A repository lookup file is now committed at:
`docs/audit/s0/H01_REPO_REGION_REFERENCE_2026-11-17.json`
It contains all 81 Sub-Saharan African region rows selected with the project's `tools/audit/regions.ts` macro-region classifier, the 181-entity registry, snapshot commit and source blob SHAs. It is a lookup aid, not a pre-judged H01 crosswalk.

## 4. P0 — Entity-to-region lists remain partial
Exact repository region ownership at the reviewed snapshot:

| Entity | Region IDs |
|---|---|
| ETH | `ETH_GON`, `ETH_TIG` |
| SHE | `SHE_ANK` |
| SOK | `SOK_SOK`, `SOK_KAN`, `SOK_ZAR`, `SOK_ADA`, `SOK_ILO` |
| BOR | `BOR_KUK` |
| WAD | `WAD_ABE` |
| DAR | `DAR_FAS` |
| ASH | `ASH_KUM`, `ASH_NOR` |
| DAH | `DAH_ABO` |
| OYO | `OYO_OYO` |
| MAS | `MAS_HAM` |
| FJA | `FJA_TIM` |
| LIB | `LIB_MON` |
| ZUL | `ZUL_MGU` |
| NDE | `NDE_MOS` |
| BSO | `BSO_THA` |
| MER | `MER_CEN`, `MER_EAS` |
| BUG | `BUG_BUG` |

The four umbrella lists are recorded in `HYDROGEN_BATCH02C_REPO_JOIN_AND_FIX_REQUEST.md`. Repository ownership is not a licence to allocate every H01 population slot to every region; demographic mapping still needs geographic evidence.

## 5. P1 — Incorrect controller/entity metadata on mapped rows
- `GBR_GAM` is owned by `GBR`, but the regional fact lists only `DZ_WAFRICA`.
- `OMA_ZAN` and `OMA_SWA` are owned by `OMA`, but both regional facts list only `DZ_EAFRICA`.
- `GBR_CAP` and `GBR_CAE` are owned by `GBR`, but both regional facts list only `DZ_SAFRICA`.
- Recheck `DZ_FUTATORO`: it is owned by `DZ_WAFRICA`; do not conflate Futa Toro with Futa Jallon (`FJA`).

## 6. P1 — Source ID orphaned in the full package
`H01_entity_profiles.json` and `H01_military_economy.csv` reference `SRC_H01_COBI_1976` for Ndebele claims, but this ID is absent from the 25-row source register and bibliography. Replace it with `SRC_H01_RASM_1978` and exact supporting locators if appropriate, or add a complete Cobi source record. Source resolution must scan JSON profiles and military/economy data too.

## 7. P1 — Population arithmetic fixed, uncertainty model not verified
The row-summed envelope now consistently reads 62,705,000 point estimate, 47,605,000 lower bound, and 81,640,000 upper bound.

However, the reconciliation reports `rho≈0.35` and a 95% continental interval of 54.2m–71.8m attributed to Frankema & Jerven (2014). The publicly available abstract describes African population series for 1850–2010, cases of Kenya, Nigeria and Ghana, and backwards projection; it does not substantiate that specific correlation coefficient or interval. Supply exact page/table evidence and a reproducible covariance formula, or remove the unsupported joint interval:
https://ehs.org.uk/article/writing-history-backwards-or-sideways-towards-a-consensus-on-african-population-1850-2010/

`H01_population_reconciliation.md` contains malformed control characters: a BEL character in the `\approx` expression and lone CR characters in `\rho` / `\rightarrow`. Re-encode as valid Unicode or escaped LaTeX and run a control-character scan.

The Cape Colony row's `supported` label refers to an 1836 Blue Book district enumeration but cites Iliffe (1995), a broad continental synthesis. Supply exact Blue Book source and table/page or downgrade quality.

## 8. P1 — Events syntactically valid but not semantically ready
Events still contain unresolved map regions. Several records identify only the African side while omitting the colonial/foreign combatant named in the title/cause:
- Third Anglo-Asante War: reconcile `GBR`.
- Anglo-Zulu War: reconcile `GBR`.
- Franco-Dahomean Wars and Second Franco-Hova War: reconcile `FRA`.
- Second Anglo-Boer War and British conquest of Sokoto: reconcile `GBR`.
- Herero-Nama War and Maji Maji: reconcile `GER`.
- Second Italo-Ethiopian War: reconcile `ITA`.
- Berlin Conference and WWI events need a sourced actor policy including imperial powers.

The Great Trek and Blood River entries use `DZ_SAFRICA` as a proxy for Boer/Voortrekker actors. That umbrella represents decentralized Southern African polities, not Boer settlers. Use an annotation-only actor or a supported structured event descriptor; do not activate `TRN`/`OFS` before 1852/1854.

`PROP_H01_EVT_003` combines Blood River (one-day battle, 1838-12-16) with the Zulu civil-war interval through 1840. Split if these represent distinct mechanics.

## 9. P1 — Media assets are still undelivered
The manifest has 22 rows (17 portraits, 5 audio loops), all briefs or external candidate pages whose binaries were not delivered. No hashes correspond to delivered files. The five external candidates have no fetched direct file; the 12 additional portraits and five loops are briefs only. There is no `H01_ASSETS_PHASE1.zip`.

The report is honest that media is not delivered, but this does not satisfy media delivery or contribute to the 3–4 GB content target. Verify the Futa Jallon dual-leader brief, the Buganda term `muzikiti`, and the combination of Shona `mbira dzavadzimu` with Basotho `lesiba` before production.

## 10. Validation-report defects
- `Zero UNSUPPLIED_* or BLOCKED_* tokens | no_blocked = False | PASS` is contradictory. State that deprecated placeholders are absent but 64 slots remain unresolved.
- The report correctly says a repository join is needed; it must not be summarized as import-ready.
- Archive byte counts are wrong.
- Full-package source scan found the orphan `SRC_H01_COBI_1976`.

## 11. Gate decision
| Gate | Result |
|---|---|
| ZIP integrity and CSV/JSON structure | PASS |
| Source-slot weight conservation | PASS |
| Point/min/max row arithmetic | PASS |
| Entity ID binding | PARTIAL |
| Region crosswalk and region fact IDs | FAIL / 64 slots unresolved |
| Owner/controller metadata | PARTIAL / corrections required |
| Complete-package source resolution | FAIL / `SRC_H01_COBI_1976` orphaned |
| Event date syntax | PASS |
| Event map binding and actor completeness | FAIL |
| Population joint uncertainty interval | NOT VERIFIED |
| Binary media assets | NOT DELIVERED |
| Direct engine import | **NO** |

Do not import into `historical_data`, generated DB, map topology, event engine or APK. This is a useful corrected research draft and is ready for a focused repo-join pass, not product integration.
