# H01 Sub-Saharan Africa — R3h Self-Review and Independent Review Request

**Date:** 17 November 2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Branch head reviewed before this docs-only commit:** 3177b0549940f5445b1ef024d0ed892f4ad9fa5f  
**Package:** H01_SubSaharan_Africa_Batch02_RepoJoin_R3h_LICENSE_AUDITED.zip  
**ZIP size:** 76,951 bytes  
**Uncompressed payload:** 284,235 bytes  
**SHA-256:** f393756b58f28eabdd9ec14648f6b2786e3bcbb0eca5466770aa3a28d4cbf264

This is an assistant-produced self-review of a data-only research package. It is not a Claude review, owner acceptance, runtime-import approval, or S1 gate transition.

## 1. Package integrity and structure

| Check | Result | Evidence |
|---|---|---|
| ZIP CRC and extraction | PASS | Full archive CRC test and round-trip extraction |
| Entry inventory | PASS | 12 entries: 8 CSV, 1 JSON, 3 Markdown |
| Text encoding / parsing | PASS | UTF-8; all CSV and JSON parse |
| Control characters | PASS | No unexpected ASCII control characters |
| Archive byte report | PASS | Validation report records 284,235 uncompressed bytes |
| Media binaries | NOT DELIVERED | No image/audio binary is included in the data archive |

## 2. Crosswalk and population reconciliation

The package has 90 crosswalk rows covering 81 H01 source slots. Every slot's allocation weights sum to 1.000.

The counting units must not be conflated:

- 77 source slots have verified repository targets.
- 2 further slots, SSA_REG_62 and SSA_REG_63, are provisionally aggregated to one target, POR_MOZ.
- 2 slots remain explicitly unresolved: SSA_REG_44 and SSA_REG_45.
- The package therefore has 76 distinct target IDs: 75 verified repository IDs plus one provisional aggregate target.
- Regional facts contain 78 rows: 75 verified rows, one provisional POR_MOZ aggregate, and two unresolved slot rows.

Population totals remain unchanged by the provisional aggregation:

| Component | Point estimate | Lower | Upper |
|---|---:|---:|---:|
| Verified region facts | 59,085,000 | 44,925,000 | 76,870,000 |
| Provisional POR_MOZ aggregate | 1,590,000 | 1,180,000 | 2,100,000 |
| Unresolved slots 44 and 45 | 2,030,000 | 1,500,000 | 2,670,000 |
| **Total** | **62,705,000** | **47,605,000** | **81,640,000** |

The POR_MOZ consolidation is a disjoint-additive research aggregation of SSA_REG_62 (940,000) and SSA_REG_63 (650,000). The repository region label explicitly describes Mozambique coast and Zambezi prazos, but the repository map centres/boundaries are approximate. This is a conceptual many-to-one mapping only, not a validated polygon join. Do not runtime-import it without a separate geography review.

SSA_REG_44 (Kordofan and Nuba Mountains) remains null because EGY_SUD is broader and does not provide an evidence-backed split. SSA_REG_45 (Bahr el-Ghazal and Sudd) remains null because the repository has no dedicated matching region; DZ_EAFRICA is an entity umbrella, not a region ID.

## 3. Referential integrity and dataset totals

| Check | Result |
|---|---:|
| Event records | 30, unique IDs |
| Event actor IDs | 33 distinct IDs, all present in repository registry |
| Event affected region IDs | 29 distinct IDs, all present in regions_1836.csv |
| Registered source IDs | 31 |
| Source tokens across package | 31; all resolve to the register, no orphan or unused IDs |
| Provenance claims | 123 unique claim IDs |
| Playable entity profiles | 17 |
| Entity crosswalk | 65 rows: 17 active playable, 4 decentralized umbrellas, 2 future entities, 42 annotation-only subjects |
| Asset manifest | 22 rows: 17 production briefs and 5 source-page candidates |
| 1836 GDP/capita | Missing for all 17 playable profiles; explicitly disclosed |

Repository cross-check snapshot:
- regions_1836.csv blob: 904bae66f03c36821e4f32d7526c61bd779d5c42 (662 region rows)
- registry.json blob: 97ba54d8d5547c2bbedfb4ed1a41833c7fe387ca (181 entities)

All 33 distinct event actor IDs and all 29 distinct affected region IDs were checked against those repository snapshots; no missing IDs were found.

## 4. Event and chronology corrections

1. **Omani capital transfer:** event 004 is dated to 1832, matching Valerie J. Hoffman (2016), who dates Sayyid Sa'id's transfer of the Omani imperial capital from Muscat to Zanzibar to 1832.

2. **Rinderpest:** event 014 is dated 1888–1897 and scoped at continental Sub-Saharan Africa level, following Thaddeus Sunseri's Oxford Research Encyclopedia article.

3. **Berlin Conference:** event 012 now lists only currently represented participant IDs. The German Federal Foreign Office lists 14 participating states. The repository can represent 12 with current IDs; France and Austria-Hungary have no valid active 1884 entity IDs, and SWE is only a limited proxy for the Sweden-Norway union. African polities were removed from the participant actor list. The event states that the conference established rules and frameworks; it did not itself draw the later detailed colonial borders.

4. **Post-1848 France references:** FRA is the repository's Kingdom of the French / July Monarchy, ending 24 February 1848. Stale FRA actor links were removed from later Franco-Dahomean, Franco-Hova, Berlin Conference, and World War I events. French participation remains in historical narrative where appropriate. A correctly dated later French regime/succession entity is still missing and must be addressed at registry level, not by reusing FRA.

5. **Kano and Sokoto, 1903:** event 018 removes BOR and BOR_KUK because the Northern Nigeria Annual Report treats the Bornu expedition separately (section 153) from Kano/Sokoto operations (section 154). The affected region list is restricted to SOK_KAN and SOK_SOK. The annual report dates the field operation 29 January–20 March 1903. Sokoto's occupation is reported on 15 March in contemporary official accounts. The repository SOK entity ends on 15 March; the event notes distinguish the subsequent field-force wind-down and post-caliphate resistance from active SOK sovereignty.

6. **Dahomey, 1894–1895:** event 015A is retitled “Franco-Dahomean Wars and Fall of Behanzin” so the 1890–1894 event no longer claims to include the later formal protectorate. Cornevin (1960) distinguishes the royal intermediary's approach on 25 January from General Dodds's 26 January telegram reporting Behanzin's unconditional submission. The event endpoint is therefore 26 January 1894 and date confidence is “supported,” not “verified.” The Service historique de la Défense dates the protectorate proclamation to 29 January 1895, outside this event range.

### Unresolved temporal conflicts — do not silently normalize

- Repository DAH.hist_to is 1894-01-15, preceding the 26 January surrender-telegram endpoint. This requires an entity/event chronology correction at repository level.
- MAS.hist_to is 1862-05-16, while event 006 spans through 1864. The event covers the wider jihad and subsequent phase, but the current schema has no date-phased actor membership.
- SOK.hist_to is 1903-03-15, while event 018's field-operation window ends 20 March. The event notes distinguish the loss of sovereignty from the later end of field operations, but actor membership is not date-phased.
- The actor-ID field cannot encode the exact start/end date for each participant. These three cases require manual chronology review before runtime import.

## 5. Asset manifest and license audit

No image or audio binary is delivered in R3h. Hashes, direct-file URLs, and physical dimensions/durations remain blank. Four Wikimedia Commons portrait pages were independently rechecked and their metadata corrected:

| Asset | Verified page metadata | License recorded |
|---|---|---|
| Dingane (AST_PRT_ZUL_01) | Allen Francis Gardiner; dated 1836 | Public Domain, PD-old-100 |
| Moshoeshoe I (AST_PRT_BSO_01) | Artist unknown; Commons cites Scholefield (1975), p. 135, as the reproduction source for the 1833 image | Public Domain / PD-Art; Commons states no known restrictions |
| Ranavalona I (AST_PRT_MER_01) | Commons credits Philippe-Auguste Ramanankirahina; file date 1905, a copy/reproduction of an earlier painted portrait | Public Domain Mark 1.0 / PD-Art |
| Sahle Selassie (AST_PRT_SHE_01) | William Cornwallis Harris; c. 1844–1846, The Highlands of Aethiopia | CC BY-SA 4.0 — not public domain |

Sahle Selassie's asset row now contains attribution and the CC BY-SA 4.0 terms. Any later adaptation must identify changes and be distributed under CC BY-SA 4.0. The Ranavalona asset description now records the file's 1905 date rather than calling it a contemporary 19th-century lithograph.

The Gezo / NYPL legacy item URL returned HTTP 403 in this review session, so it was not independently revalidated here; the existing manifest record was preserved but no binary was downloaded. Direct image downloads from Wikimedia also failed in the current runtime due unavailable network/DNS access. Thus no asset is marked as delivered and no hashes or dimensions were fabricated.

## 6. Readiness decision

| Gate | Self-review result |
|---|---|
| Archive integrity and structural parsing | PASS |
| Source-token referential integrity | PASS |
| Event actor/region ID existence | PASS |
| Population arithmetic and allocation-weight conservation | PASS |
| Historical research completeness | PARTIAL |
| Region binding completeness | PARTIAL — two provisional, two null |
| Event chronology | PARTIAL — DAH/MAS/SOK conflicts remain |
| Media delivery | NOT DELIVERED |
| Engine import readiness | NO — DO NOT IMPORT |
| S1 | NOT STARTED |

This package is suitable for independent data-package review only. It is not runtime-import ready and does not satisfy the exact-head independent REVIEW_PASS plus owner ACCEPTED gate.

## 7. Independent review requested

Claude (or another independent reviewer) should:

1. Verify the exact attached ZIP SHA-256: f393756b58f28eabdd9ec14648f6b2786e3bcbb0eca5466770aa3a28d4cbf264.
2. Independently re-parse all 12 files and reproduce archive, source-token, crosswalk, population, and entity/region ID checks.
3. Recheck the historical sources and the event changes in Section 4, especially the Berlin participants, the separate Bornu and Kano/Sokoto operations, and the Dahomey surrender/protectorate dates.
4. Audit all actor-date overlaps against registry hist_from/hist_to values and report every conflict by event ID and actor ID.
5. Recheck every license and attribution in the asset manifest, including CC BY-SA obligations.
6. Return PASS / REQUEST_CHANGES / BLOCKED with precise evidence and file/row references.

Do not change code, gameplay, save schemas, workflows, APKs, runtime data, or S1. Do not import this package. Do not silently resolve null or provisional region bindings. Do not alter registry entity dates without a separately documented proposal and review.

## 8. Sources checked during this self-review

- German Federal Foreign Office, “General Act of the Berlin West Africa Conference, 26 February 1885”: https://archiv.diplo.de/arc-en/the-political-archive/general-act-2684414
- Government of Northern Nigeria, Annual Report for 1902, sections 153–154: https://libsysdigi.library.illinois.edu/ilharvest/Africana/Books2011-05/3064634/3064634_1902_northern_nigeria/3064634_1902_northern_nigeria_opt.pdf
- UK Parliament, Hansard, “Sokoto Expedition,” 30 March 1903: https://api.parliament.uk/historic-hansard/commons/1903/mar/30/sokoto-expedition
- Valerie J. Hoffman, “Muscat and Zanzibar, Sultanate of” (2016), DOI: https://doi.org/10.1002/9781118455074.wbeoe342
- Thaddeus Sunseri, “The African Rinderpest Panzootic, 1888–1897” (2018), DOI: https://doi.org/10.1093/acrefore/9780190277734.013.375
- Robert Cornevin, “Les divers épisodes de la lutte contre le royaume d’Abomey (1887–1894)” (1960), DOI: https://doi.org/10.3406/outre.1960.1319
- Service historique de la Défense, “The conquest of Dahomey (1890–1894)”: https://www.servicehistorique.sga.defense.gouv.fr/en/thematic-topics/conquest-dahomey-1890-1894
- Commons file pages: Dingane https://commons.wikimedia.org/wiki/File:Gardiner_-_Dingane_in_Ordinary_and_Dancing_Dresses_(1836).png ; Moshoeshoe https://commons.wikimedia.org/wiki/File:Moshoeshoe_I_in_1833.png ; Ranavalona https://commons.wikimedia.org/wiki/File:Ranavalona_I_(USC).jpg ; Sahle Selassie https://commons.wikimedia.org/wiki/File:King_Sahle_Selassie.jpg

**Supersession:** This R3h request supersedes the earlier R3a review handoff. R3h is still a data-only research candidate and awaits independent review plus owner acceptance.
