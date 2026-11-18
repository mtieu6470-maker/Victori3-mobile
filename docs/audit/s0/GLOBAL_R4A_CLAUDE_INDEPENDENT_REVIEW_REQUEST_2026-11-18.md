# R4a — Global Historical Mode priority tranche: Claude independent review

**Task:** GLOBAL-HISTORICAL-R4A-PRIORITY-TRANCHE  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA:** `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314`  
**Implementer:** ChatGPT  
**Reviewer:** Claude Code only if Claude did not author/modify this tranche  
**Review type:** no-write independent evidence and documentation review  
**Status:** `PENDING / SELF_AUDIT_ONLY`

## Owner direction

Whole-world scope, not Africa-only. Historical Mode is expected to use the most accurate source-backed data for the 1836–1936 campaign while preserving the Master Spec rule that historical outcomes are conditional and may diverge when causes change. Sandbox / Alternate History can be flexible and is not forced to follow historical ruler/event sequences after the 1836 starting snapshot.

## Review files

- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/README_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_GLOBAL_SUCCESSION_SOURCE_AUDIT_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_SOURCE_EVIDENCE_MATRIX.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_PATCH_DECISIONS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_OPEN_EVIDENCE_REQUESTS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_SOURCE_REGISTRY_DELTA.csv`
- `docs/audit/GLOBAL_HOS_MISSING_PROFILE_TRIAGE_R4a.csv`
- `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`
- `docs/coordination/AI_HANDOFF.md`

## Mandatory checks

1. Re-fetch the latest HEAD and compare it to base `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314`. Confirm all R4a changed paths are under `docs/`.
2. Verify matrix has 13 polity rows and is rectangular; patch decisions 24 rows; open requests 15 rows; source registry 28 rows.
3. Verify missing-profile triage has 54 unique profile IDs and matches the missing-array subset of global coverage baseline. Validate priority/class totals: 5 P1, 46 P2, 3 P3; 30 individual, 10 subject local, 3 colonial/company/protectorate, 5 collective/aggregate, 4 unresolved, 2 rebel/provisional.
4. Reassess each cited fact and source locator. Pay particular attention to:
   - USA Tyler: NARA sources distinguish Apr 4 succession from Apr 6 oath; confirm the audit does not incorrectly call one date false.
   - Mexico: Chamber of Deputies official chronology and UNAM academic appendix differ at several boundaries; check that the audit preserves the conflict and accurately identifies omitted office-holders.
   - Japan: Shogunal government and Imperial office are distinct; verify that NDL sources support the role separation.
   - Qajar Persia: designation, accession and coronation are not interchangeable.
   - Ottoman: Mahmud II date disagreement TDV vs ONS; inspect calendar/definition ambiguity.
   - Sokoto: A.C. Burns and Al-Qalam year-level succession order vs the unsupported exact day granularity in the current array.
   - Asante: 1883–1888 civil/dynastic war and Kwaku Dua II’s brief rule; check no invented uninterrupted ruler chain.
   - Morocco: distinguish child Sultan Abd al-Aziz and regent Ba Ahmad.
   - Wallachia/Moldavia: separate local Princes from Ottoman/Russian overlordship, occupation and interregnum.
5. Ensure sources labelled archival, official, peer-reviewed, reference, museum or historical book are accurately characterized. Do not treat abstracts, bibliographies or search snippets as if full books/primary files were read.
6. Check the triage correctly avoids turning collective/aggregate/decentralized polities into fictitious individual rulers.
7. Do not modify the branch, add data, or author patches. Return only findings and one verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

## Review output required

For each finding, include file/row/locator and severity. Overall verdict must cover:
- factual/source accuracy;
- date precision and unresolved discrepancies;
- cross-office / sovereignty / authority modelling;
- triage accuracy and completeness;
- 1836–1936 temporal scope;
- docs-only scope integrity.

ChatGPT self-audit is not an independent verdict. Claude review does not constitute owner acceptance or authorize gameplay/runtime/data/schema changes or S1.
