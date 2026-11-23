# CG-55 — Vietnam / Nguyễn dynasty story-event research batch (1836–1945)

Date: 2026-11-24  
Branch: `ccr-b27f3fb8-epfpd6`  
Status: **HISTORICAL RESEARCH QUEUE v1 — not yet runtime event JSON or image approval.**  
Priority: first national batch under MSG-126.

## 1. Registry and scenario identity — verified

The canonical entity is **`VNM`**, not a guessed alias:
- Registry: `historical_data/political_entities/registry.json`
- Entity: Việt Nam (Nguyễn dynasty), playable sovereign, capital `VNM_HUE`, historical existence 1802-06-01 through 1945-08-25.
- The registry explicitly notes the official name Việt Nam (1804) and adoption of Đại Nam around 1838–1839.
- Existing 1836 regions in `historical_data/borders/regions_1836.csv`: `VNM_HAN`, `VNM_TBC`, `VNM_THN`, `VNM_HUE`, `VNM_SCE`, `VNM_GDI`, `VNM_TTT`, `VNM_TNI`.
- Use `VNM` as the playable country/event owner. Do not create `ANN`, `DAI_NAM` or another country alias. Use the historically appropriate name in text according to date.
- French-side events belong in a future `FRA.json` with the Nguyễn response represented separately in `VNM.json`; one side's event must not substitute for the affected country's agency.

## 2. Production constraints from EVT-01

Before converting this queue to `historical_data/events/story/VNM.json`:
- Follow `docs/spec/STORY_EVENTS_SCHEMA_VI.md`: `story_events_v1`, unique `vnm_...` IDs, bilingual titles and narrative, 2–4 choices, source IDs, date window, trigger conditions.
- Each choice must have a concrete benefit and cost (timed modifier or other implemented effect); no free choices.
- Use only implemented conditions/effects. The current documented set includes `exists`, `owner_in`, `year_between`, `event_fired`, `flag`, `foreign_pressure`, `at_war`, `movement_strength_above`, etc.
- Region/country IDs must exist. If a historical region does not exist in the 1836 map, do not invent it; use an explicitly documented TODO or a country-level condition.
- Historical mode is conditional, not forced. If a precondition fails, a later branch should remain plausible.
- Every image candidate must be separately researched and added to `story_selection.json`; an event's `image.ref` must not be treated as ingested until the manifest contains the corresponding asset. Do not reuse one map across unrelated events simply to reach a quota.
- Target 40–60 authored events and 3–6 journals for this national file. The queue below contains 45 candidate beats; some can be combined if the final data would otherwise duplicate the same political decision.

## 3. Candidate event sequence (45 beats)

The date is a historical window/anchor for research, not an instruction to force-fire. "Affected-side counterpart" means create a linked event in FRA/JAP/QNG/another country's file when the other state is represented and the event materially changes its policy.

| # | Candidate ID | Historical anchor | Event focus / decision problem | Required counterpart / guard |
|---:|---|---|---|---|
| 1 | `vnm_minh_mang_centralisation_1836` | 1836 | Centralisation, provincial administration and court oversight | Require VNM exists |
| 2 | `vnm_catholic_policy_1836` | 1836–1837 | Missionary policy, local enforcement and diplomatic risk | Avoid treating all Christian communities as one actor |
| 3 | `vnm_tran_tay_thanh_1836` | 1836–1841 | Administration of Trấn Tây Thành / Cambodia | Only if `VNM_TTT` remains under VNM |
| 4 | `vnm_dai_nam_title_1838` | 1838–1839 | Adoption of Đại Nam state name and court legitimacy | Country name is narrative; entity ID remains VNM |
| 5 | `vnm_minh_mang_succession_1841` | 1841 | Death of Minh Mạng and accession of Thiệu Trị | Leader/date conditions |
| 6 | `vnm_tonkin_revolt_1841` | 1841–1843 | Northern unrest and court response | Region-specific ownership check |
| 7 | `vnm_siam_cambodia_pressure_1841` | 1841–1847 | Siamese-Vietnamese contest over Cambodia | Verify represented Siam/Cambodia entities before effects |
| 8 | `vnm_tu_duc_succession_1847` | 1847 | Accession of Tự Đức and court faction balance | Leader/date conditions |
| 9 | `vnm_french_naval_incident_1847` | 1847 | French naval coercion at Đà Nẵng and diplomatic response | Separate French and Vietnamese perspectives |
| 10 | `vnm_coastal_defence_reform_1850` | 1848–1856 | Coastal defence, arms procurement and fiscal trade-offs | Effects must use existing military/economy keys |
| 11 | `vnm_french_catholic_pressure_1856` | 1856–1857 | French pressure over missionary protection | No automatic war without a war effect |
| 12 | `vnm_tourane_invasion_1858` | 1858–1859 | French-Spanish attack at Đà Nẵng; defensive strategy | FRA counterpart; use actual mapped region IDs only |
| 13 | `vnm_saigon_fall_1859` | 1859 | Fall of Gia Định/Saigon and strategic reassessment | Check owner of `VNM_GDI` before event effects |
| 14 | `vnm_southern_resistance_1860` | 1860–1862 | Local resistance and coordination under military pressure | Do not assume one unified command |
| 15 | `vnm_treaty_saigon_1862` | 1862 | Cession of three eastern provinces, ports, indemnity and missionary clauses | Must model treaty articles separately; verify region transfer preconditions |
| 16 | `vnm_southern_court_debate_1863` | 1862–1864 | Court debate over resistance, diplomacy and reform | Consequences reflect lost fiscal/territorial capacity |
| 17 | `vnm_six_provinces_loss_1867` | 1867 | French annexation of remaining western southern provinces | Only transfer regions actually represented and still VNM-owned |
| 18 | `vnm_tu_duc_reform_debate_1868` | 1867–1870 | Fiscal, military and administrative reform proposals | Choice costs must be explicit |
| 19 | `vnm_nguyen_truong_to_memorials_1870` | 1863–1871 | Nguyễn Trường Tộ reform memorials and court response | Avoid implying all proposals were implementable |
| 20 | `vnm_tonkin_trade_pressure_1872` | 1872–1873 | Red River trade, local authority and foreign intervention | Distinguish merchants, officials and armed forces |
| 21 | `vnm_garnier_hanoi_1873` | 1873 | Francis Garnier's seizure of Hanoi and resistance | FRA counterpart; validate `VNM_HAN` ownership |
| 22 | `vnm_treaty_giap_tuat_1874` | 1874 | Treaty settlement and expanded French privileges | Separate legal concessions from sovereignty transfer |
| 23 | `vnm_black_flag_tonkin_1870s` | 1870s–1880s | Black Flag forces, local alliances and Tonkin security | Do not model Black Flags as a sovereign country without registry support |
| 24 | `vnm_harmand_hue_1883` | 1883 | French attack and Harmand Treaty pressure | FRA counterpart; only actual treaty effects |
| 25 | `vnm_patentotre_1884` | 1884 | Patenôtre Treaty and protectorate framework | Keep Nguyễn court/imperial institutions represented |
| 26 | `vnm_ham_nghi_regency_1884` | 1884–1885 | Court succession, regency and resistance faction | Leader and regime conditions |
| 27 | `vnm_can_vuong_1885` | 1885 | Cần Vương appeal and royalist mobilisation | Start a multi-year journal; do not treat movement as uniform |
| 28 | `vnm_ba_dinh_resistance_1886` | 1885–1887 | Ba Đình resistance and French counterinsurgency | Check regions/ownership before applying local effects |
| 29 | `vnm_bai_say_resistance_1887` | 1883–1892 | Bãi Sậy resistance in the Red River delta | Distinct local leadership and geography |
| 30 | `vnm_huong_khe_resistance_1896` | 1885–1896 | Phan Đình Phùng / Hương Khê resistance and end of major Cần Vương phase | Outcome depends on prior journal state |
| 31 | `vnm_french_indochina_union_1887` | 1887 | Formation of French Indochina and colonial administrative consolidation | FRA counterpart; do not create a fake VNM country |
| 32 | `vnm_doumer_reorganisation_1897` | 1897–1902 | Paul Doumer's fiscal/administrative centralisation | Model tax extraction and infrastructure costs distinctly |
| 33 | `vnm_yen_the_resistance_1900` | 1884–1913 | Hoàng Hoa Thám / Yên Thế resistance | Separate rural insurgency from court loyalism |
| 34 | `vnm_duy_tan_reform_1904` | 1903–1908 | Phan Châu Trinh's reformist mobilisation | Separate reformism from armed revolt |
| 35 | `vnm_dong_du_1905` | 1905–1909 | Phan Bội Châu's Đông Du movement and Japanese connection | JAP counterpart; no invented diplomatic guarantee |
| 36 | `vnm_dong_kinh_nghia_thuc_1907` | 1907 | Đông Kinh Nghĩa Thục and education reform | Distinguish school closure/repression from broad literacy change |
| 37 | `vnm_tax_protests_1908` | 1908 | Central Vietnam anti-tax protests and corvée grievances | Use `VNM_HUE`/`VNM_SCE` only if correct mapping is verified |
| 38 | `vnm_duy_tan_uprising_1916` | 1916 | Duy Tân uprising and court-linked opposition | Verify emperor and plot chronology; do not conflate with 1908 reform |
| 39 | `vnm_pham_hong_thai_1924` | 1924 | Phạm Hồng Thái's assassination attempt and exile networks | Treat as political shock, not an automatic regime change |
| 40 | `vnm_phan_boi_chau_trial_1925` | 1925 | Capture, trial, commutation and public mobilisation | Verify arrest chronology/location and amnesty |
| 41 | `vnm_phan_chu_trinh_funeral_1926` | 1926 | Funeral demonstrations and reformist-nationalist mobilisation | Avoid assuming all participants shared one ideology |
| 42 | `vnm_vnqdd_formation_1927` | 1927 | Formation of Việt Nam Quốc dân Đảng | Organisation must not be assigned a country ID |
| 43 | `vnm_yen_bai_uprising_1930` | 1930 | Yên Bái uprising, repression and consequences | Distinct from communist-led Nghe-Tinh movement |
| 44 | `vnm_icp_formation_1930` | 1930 | Formation of the Indochinese Communist Party and labour/peasant mobilisation | Organisation is not a sovereign entity |
| 45 | `vnm_nghe_tinh_soviets_1930` | 1930–1931 | Peasant/worker revolt, village soviets and French repression | Separate from Yên Bái; regional triggers and a failure/suppression outcome |

## 4. Additional journals to author (target 5)

1. `vnm_nguyen_state_reform` — court centralisation, fiscal capacity and military adaptation (1836–1858).
2. `vnm_defence_against_france` — French coercion, territorial losses, treaties and alternative resistance/diplomacy (1847–1885).
3. `vnm_can_vuong_resistance` — royalist mobilisation, regional campaigns, repression and decline (1885–1896).
4. `vnm_reform_and_national_awakening` — Duy Tân, Đông Du, Đông Kinh Nghĩa Thục and anti-tax movement (1903–1908).
5. `vnm_mass_politics_1925_1931` — nationalist organisations, party formation, revolt, strikes and repression (1925–1931).

Journals should have clear progress, milestone conditions, timeout/failure and distinct outcomes. Do not reward a failed uprising with the same result as a successful political reform.

## 5. Source register (initial research anchors)

- `vietnam_registry`: `historical_data/political_entities/registry.json` and `historical_data/borders/regions_1836.csv` — project entity/region facts.
- `vietnam_nguyen_closed_policy`: https://www.tandfonline.com/doi/full/10.1080/23311983.2021.1973648 — Nguyen foreign policy and changing relationship with Western powers.
- `vietnam_saigon_treaty`: https://www.bethanyipc.com/wp-content/uploads/2020/10/Volume-5-World-Christianities-C.1815-C.1914-Sheridan-Gilley-Brian-Stanley.pdf — source extract on 1858–1884 French campaigns and treaty terms; use a stronger primary treaty text before coding precise clauses.
- `vietnam_monarchy_colonial`: https://www.cambridge.org/core/journals/modern-asian-studies/article/abs/vietnamese-monarchy-under-french-colonial-rule-18841945/5B56A61EA3E216EEF3C29817CA5B845A — Nguyễn monarchy under colonial rule, 1884–1945.
- `vietnam_can_vuong_yen_the_dong_du`: https://nxbctqg.org.vn/dieuledang/pdfjs/web/SachOnline/t10.pdf — historical overview referencing Yên Thế, Đông Du, Đông Kinh Nghĩa Thục and 1908 tax protest; cross-check claims against specialist works.
- `vietnam_party_timeline`: https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-2-175 — chronology and documents for revolutionary organisations and 1930 activity.
- `nghe_tinh_cambridge`: https://www.cambridge.org/core/journals/journal-of-southeast-asian-studies/article/abs/red-soviets-of-nghetinh-an-early-communist-rebellion-in-vietnam/562FC650B6131E0845AD42C31172E886 — Nghe-Tinh revolt and repression in 1930–31.
- `nghe_tinh_local_archive`: https://nghean.dcs.vn/vi-vn/tin/cong-tac-van-dong-quan-chung-trong-phong-trao-cach-mang-1930---1931-va-xo-viet-nghe-tinh/6907-682955-748485 — local archival/historical account of 1930 demands.
- `vietnam_famine_ehs`: https://ehs.org.uk/article/causes-and-consequences-of-the-great-vietnam-famine-1944-5/ — scholarly analysis of 1944–45 famine and its political consequences.
- `vietnam_august_revolution`: https://www.cambridge.org/core/journals/journal-of-asian-studies/article/abs/vietnamese-august-revolution-reinterpreted/83FED82A8ABBA8ACB20DDDD47DF05062 — historiographical interpretation of March–August 1945.
- `vietnam_provisional_government`: https://www.cambridge.org/core/journals/modern-asian-studies/article/abs/work-of-the-provisional-government-of-vietnam-augustdecember-1945/A14FD6F998105F07065400A0A91AE4F0 — provisional government, Aug–Dec 1945.

## 6. Image research policy

This queue deliberately does **not** invent Commons filenames, licence tags or direct URLs. For each selected event:
1. Search national archives, Library of Congress, Gallica/BnF, British Library, Japan National Diet Library, and Wikimedia Commons.
2. Prefer one unique subject per major event: emperor/official portrait, treaty document, contemporary engraving, city/port, school, protest or campaign photograph.
3. Record actual creator, date/work year, repository, original dimensions, rights statement, original file URL and event relevance.
4. Distinguish event year from image work year.
5. Keep CC0 and PD-USA basis explicit; country-only PD without a US basis stays pending under the current ingest gate.
6. A candidate in `story_selection.json` is not an ingested asset. Only a generated WebP plus provenance record in `illustration_assets.json` counts as in-game.

## 7. What is not yet complete

- This document is the 45-beat research queue, not the final 40–60 bilingual event objects.
- No `VNM.json` story event file has been created in this commit.
- No journal objects have been authored into runtime data.
- No candidate image rows have been added to `story_selection.json`; rights and original dimensions need per-image verification first.
- France-side event chain, Japanese response to Đông Du, and Qing/Siamese/Cambodian counterpart events must be authored in their own country files only after their actual entity/region conditions are verified.
