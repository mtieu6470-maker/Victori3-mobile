# R4c — Global Historical Mode: Claude independent review request

**Task:** GLOBAL-HISTORICAL-R4C-SUCCESSION-AUTHORITY-TRANCHE  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA:** `356a70116588a677adc4bda3f4a45772833ea002`  
**Implementer:** ChatGPT  
**Reviewer:** Claude Code only if Claude did not author or modify R4c  
**Review:** no-write / independent historical and documentation review  
**Status:** `PENDING / SELF_AUDIT_ONLY`

## Owner direction

Scope is the whole world, not Africa only. Historical Mode must use source-backed, temporally consistent history for the 1836–1936 campaign, while historical outcomes remain conditional and may diverge when causes change. Sandbox / Alternate History may be flexible and must not be railroaded by post-1836 historical succession or event rails.

## Files to review

- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/README_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_GLOBAL_SUCCESSION_AND_AUTHORITY_AUDIT_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_SOURCE_EVIDENCE_MATRIX.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_PATCH_DECISIONS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_OPEN_EVIDENCE_REQUESTS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_SOURCE_REGISTRY_DELTA.csv`
- `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`
- `docs/coordination/AI_HANDOFF.md`

## Required checks

1. Fetch latest branch HEAD and compare from base `356a70116588a677adc4bda3f4a45772833ea002`. Confirm all R4c changed paths remain under `docs/`.
2. Re-fetch all CSVs. Expected: matrix 15 data rows × 13 columns; decisions 27 × 7; open requests 18 × 5; source registry 34 × 8. Confirm rectangular rows and unique first-column IDs.
3. Validate 15 profile IDs against global missing-profile triage and verify none already had a succession array at the base SHA.
4. Reassess all source claims and inspection grades; in particular:
   - **ION:** Pagratis's High Commissioner and 1817 constitutional institutions; distinguish British Commissioner from Ionian elected executive; 1864 cession.
   - **CIR:** no common representation/supreme authority in 1834–36; 1836 regional assembly does not prove a national unified government.
   - **IMM:** Shamil elected September 1834 vs Hamzat Bek's assassination 1 October New Style; distinguish election/bay'a, dates/calendar and geographic remit.
   - **CON:** failed 1836 French assault vs successful 1837 fall; 1830 French legal deposition vs effective Bey control to 1837.
   - **ABD:** tribal election 22 Nov 1832, Desmichels treaty 26 Feb 1834, Tafna 1837 and surrender 1847 are distinct.
   - **KAN:** joint Dil brothers vs Kohandil sole ruler; British/Shah Shuja interruption 1839–1842.
   - **KOK:** Bukhara invasion/occupation 1842, revolt, Shir Ali, short interlude and 1844 Qipchaq coup.
   - **YEM:** al-Mansur Ali II is candidate only; no primary Zaydi chronicle was directly inspected; do not mark exact 1836 ruler as verified.
   - **SND:** Hyderabad, Khairpur and Mirpur authority lines are separate; exact 1836 Mirs still open.
   - **KAL:** Mehrab's death, British-installed Shah Nawaz and local recall/recognition of Nasir Khan are distinct; reconcile November 1839 day.
   - **BRD:** Sayajirao II 1819–1847 is secondary year-level candidate; exact date in profile is not verified.
   - **PRI:** aggregate modelling unit is not a historical polity; no shared succession array should be invented.
   - **BHU:** verify Desi/Je Khenpo concurrent offices from Dorji Appendices G/H and Bhutan institutional research.
   - **SKM:** Treaty of Tumlong 1861 is a protectorate/control event, not full annexation; Tsugphud dies 1863.
   - **LUA:** Manthaturath start/date conflict; Oun Keo regency and Siamese confirmation of Sukha Soem in 1839.
5. Inspect source limitations honestly. Some sources are abstracts, metadata/search extracts, or secondary chronology. Do not claim page-image verification where only text parsing was possible.
6. Validate R4c's 37/54 cumulative distinct missing-profile count and remaining 17 IDs; if any prior batch overlaps, identify it rather than double-count.
7. No write access is requested. Do not edit files, update source data, create code or patch commits.

## Required verdict

Return one overall verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Include evidence-linked findings for historical accuracy, source quality, date/calendar precision, office/authority modelling, no-HOS and aggregate decisions, CSV integrity, cumulative coverage arithmetic and docs-only diff. ChatGPT self-audit is not independent review; Claude review does not constitute owner acceptance or S1 authorization.
