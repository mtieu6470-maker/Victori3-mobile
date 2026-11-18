# R4c — Global Historical Mode Research Batch 03

**Phạm vi:** toàn thế giới; 15 polity nghiên cứu sâu, campaign 1836–1936  
**Base SHA:** `356a70116588a677adc4bda3f4a45772833ea002`  
**Trạng thái:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

R4c nghiên cứu 15 profile còn thiếu succession array từ Địa Trung Hải, Kavkaz, Trung Đông, Nam Á và Himalaya. Không phải profile nào cũng cần một HOS cá nhân: Circassia là confederation phi tập trung, Sindh có ba nhánh Talpur, Bhutan có hệ thống Desi/Je Khenpo song song, PRI là một grouping gameplay chứ không phải polity lịch sử.

## Artifacts

- [Báo cáo R4c — succession and authority audit](R4c_GLOBAL_SUCCESSION_AND_AUTHORITY_AUDIT_VI.md)
- [Ma trận chứng cứ 15 polity](R4c_SOURCE_EVIDENCE_MATRIX.csv)
- [27 quyết định nghiên cứu không thực thi](R4c_PATCH_DECISIONS.csv)
- [18 yêu cầu chứng cứ còn mở](R4c_OPEN_EVIDENCE_REQUESTS.csv)
- [Registry delta — 34 nguồn](R4c_SOURCE_REGISTRY_DELTA.csv)
- [Claude independent review request](../../../audit/s0/GLOBAL_R4C_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md)
- [GitHub integration receipt](GITHUB_INTEGRATION_RECEIPT_R4c.md)

## Polities in this tranche

ION Ionian Islands; CIR Circassia; IMM Caucasian Imamate; CON Constantine; ABD Abd al-Qadir's Emirate; KAN Kandahar; KOK Kokand; YEM Zaydi Imamate; SND Talpur Sindh; KAL Kalat; BRD Baroda; PRI aggregate princely states; BHU Bhutan; SKM Sikkim; LUA Luang Prabang.

## Main findings

- **ION:** British Lord High Commissioner and Ionian elected/constitutional institutions are different offices.
- **CIR:** no single supreme ruler evidenced in 1836; do not invent a national monarch.
- **IMM:** Shamil's election/bay'a is separate from Hamzat Bek's assassination; authority is not identical with all Circassian communities.
- **CON:** French deposition claim in 1830 differs from actual loss of Constantine in 1837.
- **ABD:** tribal election and French treaty recognition are separate legitimacy events.
- **KAN:** Dil brothers' joint authority and 1839–1842 interruption should not be flattened to Kohandil alone.
- **KOK:** 1842 Bukharan invasion/occupation, revolt and 1844 coup create multiple distinct transitions.
- **YEM:** al-Mansur Ali II is a candidate for the 1836 snapshot, but primary Zaydi chronology is still required.
- **SND:** Hyderabad, Khairpur and Mirpur Talpur branches were separate authorities.
- **KAL:** Mehrab, British-installed Shah Nawaz and locally recalled Nasir Khan had different legitimacy bases.
- **BRD:** year-level Gaekwad chronology is provisional; British paramountcy is a separate layer.
- **PRI:** gameplay aggregation is not a historical polity; do not create a common ruler.
- **BHU:** Druk Desi and Je Khenpo are simultaneous secular/religious offices.
- **SKM:** 1861 Treaty of Tumlong created protectorate/control, not full annexation; Chogyal continued to 1863.
- **LUA:** Manthaturath's death, Oun Keo regency and Siamese recognition of Sukha Soem in 1839 are distinct events.

## Remaining missing profiles

The 54 original missing profiles now have R3af/R4a/R4b/R4c research coverage for 37 unique IDs. Remaining 17 IDs are:
`ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI, SUL, MAO, MLY`.

This is a work queue, not a statement that previously researched profiles are approved for game data. All 439 existing leader records still require source-quality and temporal review, and all relevant polity timelines must be connected through 1936.

## Guardrails

No `historical_data/`, country profile, political entity registry, source runtime, schema, engine, event, tests, save, assets, Android, Gradle, workflow, signing or APK file was changed. No test/build/APK workflow was run. All candidate corrections remain pending independent Claude review and a separate owner gate.
