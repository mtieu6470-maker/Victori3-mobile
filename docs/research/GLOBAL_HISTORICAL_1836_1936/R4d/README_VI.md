# R4d — Global Historical Mode Research Batch 04

**Phạm vi:** toàn cầu; 15 polity cuối trong queue succession 54 profile, chiến dịch 1836–1936  
**Base SHA:** `f0745f1fd1eb381434cba4aa8576b3c2271d8732`  
**Trạng thái:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

R4d xử lý 15 profile: ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI và SUL. Tài liệu nêu các vấn đề về emperor/regent, Shehu/Mai, de facto/formal accession, nội chiến và succession contested, chính thể chuyển pha, colony-to-Commonwealth-to-Republic, rebel movement-to-republic.

## Artifacts

- [R4d — global polity and succession audit](R4d_GLOBAL_POLITY_AND_SUCCESSION_AUDIT_VI.md)
- [Ma trận chứng cứ 15 polity](R4d_SOURCE_EVIDENCE_MATRIX.csv)
- [26 quyết định nghiên cứu không thực thi](R4d_PATCH_DECISIONS.csv)
- [17 yêu cầu chứng cứ còn mở](R4d_OPEN_EVIDENCE_REQUESTS.csv)
- [34 nguồn và giới hạn kiểm tra](R4d_SOURCE_REGISTRY_DELTA.csv)
- [Victoria 3 feature-parity audit](../../../audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md)
- [Victoria 3 parity matrix — 41 hệ thống](../../../audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv)
- [Claude independent review request](../../../audit/s0/GLOBAL_R4D_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md)
- [GitHub integration receipt](GITHUB_INTEGRATION_RECEIPT_R4d.md)

## Main historical findings

- **ETH:** 1836 needs Emperor Sahle Dengel and Regent Ras Ali II as separate concurrent authorities.
- **BOR:** Muhammad al-Amin al-Kanemi's death year itself conflicts between sources; more importantly, he cannot be casually carried forward as 1836 HOS. Umar and the nominal Sayfawa Mai need separate roles.
- **WAD:** Muhammad Sharif's de facto power and formal enthronement are dated differently (c.1835 vs 1838); Kolak Adam appears in some lists.
- **DAR:** Muhammad al-Fadl → Muhammad al-Husayn; occupation and Ali Dinar restoration must be separate political phases.
- **DAH:** Ghezo's reign 1818–1858; heir designation is not accession.
- **OYO:** Old Oyo's political disintegration and New Oyo/Yoruba successor states cannot be represented as one uninterrupted state.
- **MAS/FJA:** source-date conflict in Massina; Futa Jallon has two competing Almami dynastic lines and no secure 1836 incumbent in the evidence inspected.
- **LIB:** ACS colony in 1836; Commonwealth from 1838/39; independence 1847; first President inauguration 1848.
- **BUG:** Suna II accession year 1832 vs 1836 remains disputed.
- **TEX:** Henry Smith / James W. Robinson dual claim in Jan 1836; David Burnet's ad interim government follows independence declaration.
- **CAF:** Morazán as Federal President is not the same thing as control over every member state; dissolution staged 1838–41.
- **RGS:** rebellion starts 1835, but republic is proclaimed 11 Sep 1836; Bento's presidency must not be backdated to 1835.
- **HAI:** Boyer's resignation 13 Mar 1843 precedes Hérard's provisional executive and formal presidency in Jan 1844.
- **SUL:** Jamalul Kiram/Pulalun handover is 1842 in Majul vs 1844 in current Sulu royal genealogy.

## Original 54-profile queue

R3af/R4a/R4b/R4c/R4d now have research dossiers for **52 of the 54 original missing succession profiles** (deduplicated). The two still to address are:
- **MAO:** United Tribes of New Zealand — confederation of rangatira, not one national monarch.
- **MLY:** Malay Peninsula Sultanates aggregate — multiple independent sultanates, not one shared Sultan.

These two must be handled as collective/aggregate entity design and constituent-polity research, not as two missing names in a ruler list. Dossier coverage is not the same as Claude approval or live-data readiness.

## Victoria 3 parity audit

The parity audit reviews 41 feature areas against the codebase snapshot: Pop cohorts, needs, employment/wages, buildings, production methods, markets/logistics, ownership, construction, fiscal system, Interest Groups, movements, diplomacy, warfare, War Support, Journal Entries, AI, UI and Android performance.

Overall assessment: `FOUNDATION PRESENT / CORE DEPTH PARTIAL / FULL VICTORIA 3 PARITY NOT ACHIEVED`.

The most important P0 gaps are detailed Pop cohorts, production methods, labour/wages, market/logistics, political movements, diplomatic plays, detailed military/war support and persistent Journal Entries. P0 indicates build priority, not authorization to alter runtime. Use V3 as design benchmark only; do not copy proprietary code, assets, strings, maps, music or DLC material.

## Guardrails

No `historical_data/`, country profile, leader array, political entity registry, runtime source, schema, engine, event, tests, save, assets, Android, Gradle, workflow, signing or APK file was changed. No build/test/APK workflow was run. All proposed corrections and future features await Claude independent review and an explicit owner implementation gate.
