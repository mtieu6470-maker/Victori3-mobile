# R4d — Claude independent review request (global history + Victoria 3 parity)

**Task:** GLOBAL-HISTORICAL-R4D-AND-V3-PARITY-REVIEW  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA:** `f0745f1fd1eb381434cba4aa8576b3c2271d8732`  
**Implementer:** ChatGPT  
**Reviewer:** Claude Code only if Claude did not author or modify R4d  
**Review type:** no-write / independent factual and technical assessment  
**Status:** `PENDING / SELF_AUDIT_ONLY`

## Owner direction

- Scope is the whole world, not Africa only.
- Historical Mode: source-backed high historical accuracy for 1836–1936, causal divergence allowed, no railroad.
- Sandbox/Alternate History: no forced post-1836 historical succession/event rails.
- User additionally requests the game be like Victoria 3 “in every respect”. Treat V3 as a depth/feature benchmark but keep independent source code, data, art, UI, music and branding.
- Current authorization remains documentation-only. Do not implement or modify runtime/game data in this review.

## Files to review

- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/README_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_GLOBAL_POLITY_AND_SUCCESSION_AUDIT_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_SOURCE_EVIDENCE_MATRIX.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_PATCH_DECISIONS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_OPEN_EVIDENCE_REQUESTS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_SOURCE_REGISTRY_DELTA.csv`
- `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md`
- `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv`
- `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`
- `docs/coordination/AI_HANDOFF.md`

## Historical checks

1. Refetch latest branch HEAD and compare from base `f0745f1fd1eb381434cba4aa8576b3c2271d8732`; all changed files must be under docs/.
2. Verify R4d CSV structure: source evidence matrix 15 rows × 13 columns; decisions 26 × 7; open requests 17 × 5; source registry 34 × 8; all rows rectangular and IDs unique.
3. Verify the 15 case IDs are the next/last unprocessed original missing-array queue after R3af/R4a/R4b/R4c and that only MAO/MLY remain, if cumulative arithmetic is valid.
4. Critical historical points:
   - **ETH:** Sahle Dengel nominal Emperor and Ras Ali II de facto regent in 1836.
   - **BOR:** conflict on al-Kanemi death 1835 vs 1837; distinguish Umar Shehu and Mai Ibrahim IV.
   - **WAD:** Kolak Adam vs Muhammad Sharif formal/de facto rule; 1835 vs 1838 accession.
   - **DAR:** Muhammad al-Fadl → Muhammad al-Husayn; occupation and Ali Dinar restoration.
   - **DAH:** Ghezo 1818–1858; Glele's heir designation ≠ accession.
   - **OYO:** Old Oyo collapse and New Oyo/successor Yoruba states; no single uninterrupted polity.
   - **MAS:** Seku Amadu 1844 vs 1845 death; Almami title and successor dates.
   - **FJA:** Alfaya/Soriya contest and no verified 1836 incumbent in inspected sources.
   - **LIB:** ACS settlement in 1836; Commonwealth 1838/39; independence 1847; Roberts presidency 1848.
   - **BUG:** Suna II start 1832 vs 1836 source conflict.
   - **TEX:** Henry Smith and James W. Robinson dual claim; David Burnet ad interim after 2 March declaration.
   - **CAF:** Morazán as federal president vs state-level sovereignty and staged dissolution.
   - **RGS:** rebellion 1835 vs Republic proclaimed 11 Sep 1836; Bento's office not backdated.
   - **HAI:** Boyer resignation, provisional executive and Hérard formal presidency separated.
   - **SUL:** 1842 vs 1844 Pulalun accession conflict and 1915 Carpenter Agreement.

## Victoria 3 parity audit checks

1. Confirm 41-row matrix dimensions, unique IDs and status vocabulary.
2. Verify claims against exact code baseline:
   - simulation.ts shared monthly pipeline;
   - types.ts 12 goods, 10 building kinds, 9 population strata, 8 IG types;
   - economy fixed recipes/market model;
   - population aggregate stratum model;
   - politics clout/approval and reform;
   - diplomacy relations/rivalry/alliance/guarantee/customs union;
   - military manpower/navy/region fronts/battles/war exhaustion;
   - events and decision-window framework;
   - modes.ts History/Sandbox same systems with different historical data layers.
3. Check that the report distinguishes `PRESENT`, `PARTIAL`, `MISSING` and `NEEDS_QA`; a UI screen/enum must not be treated as a functioning mechanic.
4. Verify latest public V3 reference cited: official Steam page shows 1.15.1 hotfix 11 Nov 2026; 1.15 War Support (0–100) has consequences for Pop radicalism, military strength and subjects, and in-war enforcement of selected war goals.
5. Assess whether P0/P1/P2 ordering is coherent. Particularly ensure P0 covers cohort Pops, employment/wages, production methods, market/logistics, Interest Groups/movements, diplomatic plays, war depth/War Support and Journal Entries.
6. Verify that the report does not imply a license to clone proprietary code/assets/text/DLC. V3 is a gameplay depth benchmark; project implementation remains independent.
7. Ensure mobile adaptation changes presentation/performance, not systemic simulation depth.

## Required verdict

Return one verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Use evidence-linked findings with file/line/CSV row locators. This is a no-write review; do not edit the branch, create fixes or implement runtime features. ChatGPT self-audit is not independent review, and Claude review does not grant owner acceptance or S1 authorization.
