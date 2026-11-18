# R4b — Global Historical Mode: Claude independent review request

**Task:** GLOBAL-HISTORICAL-R4B-SUCCESSION-AUTHORITY-TRANCHE  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA:** `e5dead90d15cab772a8a0fa00ee76f76e4d08916`  
**Implementer:** ChatGPT  
**Reviewer:** Claude Code only if Claude did not author or modify this tranche  
**Review:** no-write / independent historical and documentation review  
**Status:** `PENDING / SELF_AUDIT_ONLY`

## Owner direction

Scope is the whole world, not Africa only. Historical Mode is expected to have source-backed, temporally consistent history for the 1836–1936 campaign, but historical outcomes remain conditional and may diverge when causes change. Sandbox / Alternate History may be flexible and must not be railroaded by post-1836 historical succession or event rails.

## Files to review

- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/README_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_GLOBAL_SUCCESSION_AND_AUTHORITY_AUDIT_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_SOURCE_EVIDENCE_MATRIX.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_PATCH_DECISIONS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_OPEN_EVIDENCE_REQUESTS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_SOURCE_REGISTRY_DELTA.csv`
- `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`
- `docs/coordination/AI_HANDOFF.md`

## Required checks

1. Fetch the latest branch HEAD. Compare it with base `e5dead90d15cab772a8a0fa00ee76f76e4d08916`. Confirm all R4b changed paths remain under `docs/`.
2. Validate CSVs: matrix 15 data rows / 13 columns; decisions 25 / 7; open evidence requests 18 / 5; source registry 33 / 8. Every row rectangular, unique first-column IDs.
3. Independently verify each historical finding and exact source locator. Distinguish full text, abstract, search snippet, catalog metadata, transcription, OCR and visually inspected page.
4. Priority factual checks:
   - **KHI:** Wood dissertation and Agahi chronicle date ranges for Allah Quli 1825–1843 and Rahim Quli 1843–1846; validate calendar conversions and note unpublished chronicle works.
   - **BUK:** Nasrullah 1827–1860 and source scope; check that `levi_2017` is not being misrepresented as a dedicated Bukhara source.
   - **HER:** Kamran 1826–1842; Yar Muhammad's de facto power, 1842 deposition/murder; distinguish Qajar claims and 1863 Afghan conquest.
   - **NAJ:** Faisal first reign 1834–1838, capture/interregnum/Egyptian occupation, return 1843 and second reign 1843–1865; account for Lorimer/QDL colonial perspective.
   - **TUN:** Ahmad Bey accession in 1837 after Mustafa Bey's death; no exact day unless supported.
   - **NAG:** Raghoji III death 11 December 1853 vs Commissioner administration from 13 March 1854; adoption controversy and annexation.
   - **AWA:** Nasir death night 7/8 July 1837, Muhammad Ali Shah installation 8 July, Badshah Begum/Munna Jan rival claim, later rulers and 1856 annexation.
   - **GWA/HOL:** regencies, adopted heirs, British Resident/Government intervention; do not collapse title succession and effective administration.
   - **TIB:** 10th/11th Dalai Lamas and Regents; check Petech's date caveat and calendar-conversion precision.
   - **RYU:** Shō Iku 1835–1847 and Shō Tai accession 1848, dual Satsuma/Qing relationships and 1879 annexation.
   - **BRN:** Omar Ali's competing accession traditions; Abdul Momin 1852–1885; Hashim accession 1885 vs coronation 1895.
   - **ACE:** check suspected baseline head mismatch. The source reports Ala’ad-Din Muhammad Shah 1823–1836, Sulayman/Ali Iskandar Shah 1836–1857, and uncle Tuanku Ibrahim/Ala’ad-Din Mansur as rival Sultan controlling the Kraton. Confirm with Acehnese primary genealogy before calling the current profile definitively wrong.
   - **MER:** separate queens from Rainilaiarivony as prime minister/effective ruler; differentiate protectorate, military conquest, colony proclamation and polity termination.
   - **NDE:** Mzilikazi death, regency, Lobengula's 1870 installation and Nkulumane succession dispute; do not infer unbroken succession.
5. Verify all source limitations are honest, including failure to retrieve PDF screenshots for several sources. Do not claim visual page inspection where only parsed text/search extract was available.
6. Check no runtime/game data, schema, engine, events, tests, assets, Android, Gradle, workflows, signing or APK changed. This is a no-write review; do not edit the branch.

## Expected verdict

Return one verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Report evidence-linked findings for historical accuracy, source reliability, date/calendar precision, authority/suzerainty modelling, the suspected ACE profile mismatch, CSV integrity and docs-only scope. ChatGPT self-audit is not independent review. Claude review does not equal owner acceptance or S1 authorization.
