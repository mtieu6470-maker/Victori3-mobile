# GitHub Integration Receipt — Global Historical R4d + Victoria 3 parity audit

**Task:** `GLOBAL-HISTORICAL-R4D-AND-V3-PARITY-TRANCHE`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `f0745f1fd1eb381434cba4aa8576b3c2271d8732`  
**Pre-receipt HEAD:** `6d7d3884e17d573d45e988f56377d1e1382bb96e`  
**Date:** 18 November 2026  
**Disposition:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

## 1. R4d history dossier

| Artifact | Path | Latest relevant commit |
|---|---|---|
| Global polity/succession audit | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_GLOBAL_POLITY_AND_SUCCESSION_AUDIT_VI.md` | `4df0e2d737a29e6c8741ded0ad881b0bdd8a5c30` |
| 15-polity evidence matrix | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_SOURCE_EVIDENCE_MATRIX.csv` | `cda9aae6eab010886ab9d583cddaf3dae9ff1d1e` |
| Non-executing research decisions | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_PATCH_DECISIONS.csv` | `d68d4ca3c32a5f032c4dd164c3fd6f065d063710` |
| Open evidence requests | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_OPEN_EVIDENCE_REQUESTS.csv` | `b6bba0087d486d5e219ca23a1ba09beee51e6b10` |
| Source registry delta | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/R4d_SOURCE_REGISTRY_DELTA.csv` | `5ed81558b2769221f6baaa71a3ef33e62b8658c6` |
| Batch README | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4d/README_VI.md` | `2f67f2be3c429e05521af4607d5ed087e051f3f5` |
| Claude independent review request | `docs/audit/s0/GLOBAL_R4D_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` | `d467e25310cee1b23a28c9b06506650cf5077536` |

R4d covers: ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI and SUL.

## 2. Victoria 3 feature parity audit

| Artifact | Path | Commit |
|---|---|---|
| Feature parity audit | `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md` | `d5a4b1227c8e6cfa4e9b58bc3ef0c678045cbbc6` |
| 41-area feature parity matrix | `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv` | `7be4e0cb53f1d58d04795c440cfb1ce46c25383a` |

Reference version: public Victoria 3 1.15/1.15.1; official Steam announcements list Hotfix 1.15.1 on 11 November 2026 and document 1.15 War Support (0–100). The audit's overall finding is `FOUNDATION PRESENT / CORE DEPTH PARTIAL / FULL VICTORIA 3 PARITY NOT ACHIEVED`.

Top P0 gaps include detailed Pop cohorts, employment/wages, Production Methods, market/logistics, Interest Groups/political movements, Diplomatic Plays, land/naval warfare and War Support, and persistent Journal Entries. These are documented implementation priorities, not completed features or authorization to patch code. V3 is used only as a design-depth reference; proprietary code, data, assets, text, music, map art, UI or DLC content must not be copied.

## 3. Bornu evidence correction

During final review, the R4d Bornu dossier was corrected. Bosworth gives al-Kanemi's death as 1835, whereas the *Encyclopaedia of Islam* entry reports 1837. The dossier now treats this as an unresolved source conflict and does **not** assert that al-Kanemi was definitely dead by 1 January 1836. It flags the possible overlap between al-Kanemi's authority and Umar's de jure Shehu title, while keeping the titular Sayfawa Mai separate.

Relevant corrective commits:
- `4df0e2d737a29e6c8741ded0ad881b0bdd8a5c30` audit
- `cda9aae6eab010886ab9d583cddaf3dae9ff1d1e` matrix
- `d68d4ca3c32a5f032c4dd164c3fd6f065d063710` decisions
- `2f67f2be3c429e05521af4607d5ed087e051f3f5` README
- `a4b37feec87200798c4e87c799045ebe160068cc` global baseline audit
- `6d7d3884e17d573d45e988f56377d1e1382bb96e` AI handoff

## 4. Structural validation against exact GitHub blobs

All files were re-fetched from the branch and parsed after the Bornu correction.

| CSV | Columns | Data rows | Rectangular | Duplicate first-column IDs |
|---|---:|---:|---|---:|
| R4d source evidence matrix | 13 | 15 | PASS | 0 |
| R4d research decisions | 7 | 26 | PASS | 0 |
| R4d open evidence requests | 5 | 17 | PASS | 0 |
| R4d source registry | 8 | 34 | PASS | 0 |
| Victoria 3 parity matrix | 8 | 41 | PASS | 0 |

## 5. Original 54-profile queue

After deduplication across R3af/R4a/R4b/R4c/R4d, 52 of the original 54 missing-array profile IDs have research dossiers. Remaining:
- `MAO` — United Tribes of New Zealand, collective/confederated authority.
- `MLY` — Malay Peninsula Sultanates aggregate, multiple separate sultanates.

These should not receive an invented common ruler. Their next task is component-polity and authority decomposition, not a single head-of-state row. Research coverage does not equal Claude review or owner approval for live game data.

## 6. Diff and scope

GitHub compare from base `f0745f1fd1eb381434cba4aa8576b3c2271d8732` to pre-receipt HEAD `6d7d3884e17d573d45e988f56377d1e1382bb96e` showed **17 commits and 11 changed paths**, all under `docs/`. This receipt is also documentation-only; final HEAD and compare should be checked after its commit.

No changes were made to:
- `historical_data/`, HOS arrays, country profiles or political entity registry;
- `src/`, source runtime, schema, engine, event code or tests;
- save format, migrations, assets, Android, Gradle, workflows, signing or APK artifacts.

No tests, build or APK workflow was run. Every commit in this batch uses `[skip ci]`.

## 7. Review and acceptance

- Claude review request: `docs/audit/s0/GLOBAL_R4D_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Review is no-write and must use latest HEAD.
- ChatGPT source/diff/CSV checks are self-audit only, not independent `REVIEW_PASS`.
- No owner acceptance, live-data approval, feature implementation approval or S1 authorization is asserted.
