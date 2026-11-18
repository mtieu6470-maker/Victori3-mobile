# R4a — Global Historical Mode Research Batch 01

**Phạm vi:** toàn cầu; 13 case studies, 1836–1936  
**Base SHA:** `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314`  
**Trạng thái:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

R4a kiểm tra các chuỗi kế vị đang có và các profile còn thiếu theo hướng xuyên khu vực. Đây là tranche đầu tiên, không phải tuyên bố hoàn thành 439 records/54 profile.

## Files

- [R4a global succession/source audit](R4a_GLOBAL_SUCCESSION_SOURCE_AUDIT_VI.md)
- [Source/evidence matrix — 13 polity](R4a_SOURCE_EVIDENCE_MATRIX.csv)
- [24 patch/research decisions — no execution](R4a_PATCH_DECISIONS.csv)
- [15 open evidence requests](R4a_OPEN_EVIDENCE_REQUESTS.csv)
- [28 source registry entries](R4a_SOURCE_REGISTRY_DELTA.csv)
- [All 54 missing profile triage rows](../../../audit/GLOBAL_HOS_MISSING_PROFILE_TRIAGE_R4a.csv)
- [Claude independent review request](../../../audit/s0/GLOBAL_R4A_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md)
- [GitHub integration receipt](GITHUB_INTEGRATION_RECEIPT_R4a.md)

## 13 polity in this tranche

USA, Mexico, Brazil, Japan, Qing China, Qajar Persia, Ottoman Empire, Sokoto, Zulu, Asante, Morocco, Wallachia and Moldavia.

## Main findings

- Mexico: 33/33 existing ruler records cite Wikipedia only; official and academic chronologies identify omitted interim office-holders.
- Japan: Shogun and Emperor are different contemporaneous offices; the current series conflates the Tokugawa line with Emperor Meiji.
- Qajar Persia: succession designation, father’s death, accession at Tabriz and coronation are distinct events; current profile/array starts at 23 Oct 1834 without sufficient semantic explanation.
- Ottoman: all five records lack record-level references; TDV and a specialist regnal-year paper disagree on Mahmud II’s final date.
- Sokoto: 10/10 current records cite Wikipedia only; a year-level genealogical sequence is available, but exact days are not supported in this batch.
- Asante: 1883–1888 must be represented as dynastic/civil conflict and an interregnum, not as invented continuous succession.
- Zulu, Brazil, Japan, Qing, Morocco and the Romanian Principalities demonstrate the need to model offices, regencies, local authority, claimant status, foreign control and sovereignty separately.

## Missing-profile triage

The 54 missing profiles are not all “missing kings”. The triage classifies them into:
- 30 individual ruler/head-of-state research cases;
- 10 local-authority cases within a subject polity;
- 3 colonial/company/protectorate authority cases;
- 5 collective/aggregate authority cases;
- 4 unresolved leadership/source gaps;
- 2 rebel/provisional-government cases.

Priority: 5 P1, 46 P2, 3 P3. Priority is a research queue, not a quality verdict.

## Guardrails

No `historical_data/`, source runtime, schema, engine, event, test, save, asset, Android, Gradle, workflow or APK file was modified. No test/build/APK workflow was run. No unverified data was patched into the game. All decisions remain pending independent review and owner approval.

