# H01 R3l — 1836 Population Scope and Political-Control Audit

**Date:** 17 November 2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**R3l package SHA-256:** dafbf7769d15f5ba062ad2913ff0b8be91bc22978927e6652ee16a638b6cd94e

This is a follow-up audit of R3l research data. It does not change the package, gameplay, map ownership, runtime data, save schema, workflows, APK, or S1 status.

## 1. Why this audit was opened

The 17 playable-entity profiles and regional population facts are separate tables with different possible geographic units. A direct sum comparison is not automatically a contradiction. However, two entities have profile uncertainty intervals that do not overlap the totals of their mapped repository regions, and the regional descriptions explicitly include populations outside the named polity. This needs an evidence-backed scope reconciliation before regional population values are interpreted as state population or taxable population.

## 2. Reproduced profile-to-region comparison

The comparison sums each profile's `confirmed_repo_region_ids` against the corresponding rows in `H01_region_facts_RECONCILED.csv`.

| Entity | Profile point (range) | Mapped region point (range) | Interval overlap |
|---|---:|---:|---|
| ETH | 3,200,000 (2.5–4.0m) | 3,200,000 (2.5–4.08m) | Yes |
| SHE | 1,100,000 (0.85–1.4m) | 1,100,000 (0.85–1.4m) | Yes |
| SOK | 8,500,000 (6.5–10.5m) | 8,000,000 (6.2–10.15m) | Yes |
| BOR | 1,600,000 (1.2–2.1m) | 1,600,000 (1.2–2.1m) | Yes |
| WAD | 950,000 (0.7–1.3m) | 950,000 (0.7–1.3m) | Yes |
| DAR | 1,100,000 (0.8–1.5m) | 1,100,000 (0.8–1.5m) | Yes |
| ASH | 2,200,000 (1.8–2.8m) | 1,850,000 (1.48–2.35m) | Yes |
| DAH | 450,000 (0.35–0.6m) | 450,000 (0.35–0.6m) | Yes |
| **OYO** | **650,000 (0.4–1.0m)** | **1,450,000 (1.1–1.9m)** | **No** |
| MAS | 750,000 (0.55–0.95m) | 1,070,000 (0.77–1.39m) | Yes |
| FJA | 600,000 (0.45–0.8m) | 600,000 (0.45–0.8m) | Yes |
| LIB | 3,500 (3,000–4,000) | 3,600 (3,300–3,900) | Yes |
| ZUL | 250,000 (0.2–0.32m) | 340,000 (0.27–0.44m) | Yes |
| **NDE** | **60,000 (45,000–85,000)** | **210,000 (155,000–280,000)** | **No** |
| BSO | 45,000 (35,000–65,000) | 45,000 (35,000–65,000) | Yes |
| MER | 2,600,000 (2.2–3.2m) | 2,100,000 (1.74–2.6m) | Yes |
| BUG | 750,000 (0.55–1.0m) | 750,000 (0.55–1.0m) | Yes |

15/17 intervals overlap. OYO and NDE are the only non-overlap cases in this arithmetic check. Do not mechanically overwrite either value: the profile and region estimates may refer to different populations.

## 3. OYO — high-priority political and population scope conflict

Current data:
- Profile `OYO`: 650,000 (400,000–1,000,000), described as a collapsing polity with severe displacement after Old Oyo's collapse.
- Mapped region `OYO_OYO`: 1,450,000 (1,100,000–1,900,000), region name “Yorubaland (Oyo / Ibadan / Abeokuta)”.
- The regional fact currently sets `controlling_entities_1836 = OYO`.
- The repository map row is named “Oyo and the Yoruba states” and owner `OYO`.

Independent historical research indicates the southern Yoruba area cannot simply be equated with Oyo sovereign control in 1836:
- Robin Law's study of Oyo political disintegration states that by 1833 the only independent Oyo powers were newly established southern states including Ijaye, Abemo and Ibadan; it also discusses the collapse of Old Oyo and the reconstitution of a diminished New Oyo.
- Research on Abeokuta describes it as a city-state founded in 1830 by Egba refugees, with townships running their own affairs.
- Other syntheses describe Ibadan and Ijaye as autonomous successor power centres after Old Oyo's collapse.

**Required resolution:** distinguish (a) total population inside the coarse map region `OYO_OYO`, (b) population under New Oyo/Atiba's effective authority, and (c) populations of autonomous or rival successor states (Ibadan, Ijaye, Abeokuta/Egba, Ilorin where geographically included). Confirm whether `controlling_entities_1836=OYO` is historically defensible for the whole map region, or whether it must be explicitly marked mixed/contested. Do not create synthetic repo IDs.

## 4. NDE — high-priority regional population scope conflict

Current data:
- Profile `NDE`: 60,000 (45,000–85,000), described as the Ndebele core plus incorporated captives in the Marico valley.
- Mapped region `NDE_MOS`: 210,000 (155,000–280,000), region name “Mosega & Western Transvaal (Ndebele)”.
- The regional fact's method explicitly includes “Transvaal Highveld including Mzilikazi's Ndebele (~60,000) + Pedi/Venda/Tswana”.
- The regional fact currently sets `controlling_entities_1836 = NDE`; the repository region owner is also `NDE`.

UNESCO's General History of Africa describes the Transvaal Highveld as predominantly occupied by Sotho-Tswana communities, and describes Mzilikazi's forces attacking those communities from the Mosega base. The South African Government historical summary places Mzilikazi at Mosega after the 1832 move and describes the later 1837 forced migration north.

**Required resolution:** separate the Ndebele polity population from the total geographic population of the coarse `NDE_MOS` map region. Determine which neighbouring communities were subjects, tributaries, conquered/incorporated groups, raided communities, or independent neighbours. Do not label the full 210,000 as NDE-controlled without evidence. If the repository region cannot be split, record the scope limitation and keep state-controlled population separate from geographic population.

## 5. LIB — stale/misleading method text despite a sound split

The crosswalk currently has a disjoint split:
- `SSA_REG_06 -> LIB_MON`: 1% / 3,600 persons (3,500 ACS settlers + 100 additional enclave residents).
- `SSA_REG_06 -> DZ_KRU`: 99% / 356,400 independent Kru/Bassa/Dei/Vai hinterland residents.
- `SSA_REG_07 -> DZ_KRU`: 100% / 480,000.
- `DZ_KRU` total: 836,400 = 356,400 + 480,000.

The `LIB_MON` fact itself is 3,600, but its `method` text still begins “Total geographic Grain Coast (360,000) is a backward reconstruction” and says 356,500 indigenous inhabitants are separated. This sentence is misleading in a row whose actual value is 3,600 and whose remaining 356,400 hinterland component is assigned to `DZ_KRU`. The locator and crosswalk are more explicit than the method field.

**Required resolution:** rewrite the `LIB_MON` method to describe only the 3,600-person enclave row; document the 356,400 disjoint hinterland component in `DZ_KRU`; reconcile the 356,500 vs 356,400 rounding/adjustment; ensure the regional total is not double-counted. Preserve the existing census/reconstruction distinction.

## 6. Other scope differences to explain, not automatically change

These profile/region point estimates differ, but their uncertainty intervals overlap:
- SOK: 8.5m vs 8.0m.
- ASH: 2.2m vs 1.85m.
- MAS: 0.75m vs 1.07m.
- ZUL: 0.25m vs 0.34m.
- MER: 2.6m vs 2.1m.
- LIB: 3,500 vs 3,600.

For each, state whether the difference is due to geographic coverage, tributary populations, rural enclaves, chronology, or rounding. Do not widen uncertainty ranges merely to force overlap.

## 7. Exact research deliverables requested from Hydrogen

Please return a focused evidence package, not a rewritten broad H01 dataset:

1. `H01_population_scope_reconciliation.csv` — one row per playable entity with profile point/range, mapped region point/range, whether intervals overlap, scope definitions, evidence, and recommended treatment.
2. `H01_OYO_1836_control_and_population_note.md` — source-backed split of New Oyo, autonomous southern Yoruba successor states, and the broader OYO_OYO map-region population.
3. `H01_NDE_1836_control_and_population_note.md` — source-backed split of Ndebele core, incorporated subjects, tributaries, independent neighbouring Sotho-Tswana/Pedi/Venda communities, and the NDE_MOS geographic total.
4. A corrected `LIB_MON` / `DZ_KRU` method-and-provenance proposal that reconciles 356,500 vs 356,400 without double-counting.
5. If and only if evidence supports it, propose exact revised values and row-level CSV patches. Every changed number must have a source locator, method, uncertainty interval and explicit scope.

Do not fabricate exact census totals from narrative sources. If no defensible exact split exists, retain the uncertainty and mark the item unresolved.

## 8. External research consulted for this audit

- Robin Law, “Making Sense of a Traditional Narrative: Political Disintegration in the Kingdom of Oyo,” *Cahiers d'Études africaines* (1982), Persée: https://www.persee.fr/doc/cea_0008-0055_1982_num_22_87_3384
- Robin Law, “Mapping Uncertainty: The Collapse of Oyo and the Trans-Atlantic Slave Trade, 1816–1836” (2019): https://doi.org/10.1163/2405836X-00402002
- Earl Phillips, “The Egba at Abeokuta: Acculturation and Political Change, 1830–1870,” *Journal of African History* 10(1), 1969: https://doi.org/10.1017/S0021853700009312
- UNESCO, *General History of Africa*, Vol. VI, “The Mfecane and the rise of new African states”: https://unesdoc.unesco.org/in/rest/annotationSVC/DownloadWatermarkedAttachment/attach_import_560cbf00-2ba7-4d84-a729-3355a87d3a9a?_=184295engo.pdf
- South African Government, “Appendix A: Indigenous systems of awards”: https://www.gov.za/st/about-government/appendix-indigenous-systems-awards
- South African History Online, “Political changes from 1750 to 1835”: https://sahistory.org.za/article/political-changes-1750-1835

## 9. Gate and scope

This is a data-quality issue only. R3l remains a research package; no runtime integration is approved. Do not change code, gameplay, map geometry, save schemas, workflows, APKs, or S1. Wait for the scoped research deliverables and then perform independent row-by-row QA before creating an R3m candidate.
