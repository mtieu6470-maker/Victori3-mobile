# GitHub Integration Receipt — Global Historical R4c

**Task:** `GLOBAL-HISTORICAL-R4C-SUCCESSION-AUTHORITY-TRANCHE`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `356a70116588a677adc4bda3f4a45772833ea002`  
**Pre-receipt HEAD:** `6f1aa0fe720fb3b5bf410e2d04a1aefa8bd3f7f3`  
**Date:** 18 November 2026  
**Disposition:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

## 1. R4c artifacts and commits

| Artifact | Path | Commit |
|---|---|---|
| Succession/authority audit | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_GLOBAL_SUCCESSION_AND_AUTHORITY_AUDIT_VI.md` | `72313fe866030140b5902c421b6823d033e0a93f` |
| 15-polity evidence matrix | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_SOURCE_EVIDENCE_MATRIX.csv` | `bc3166da05f76f1ddf47e3e3db0f307a2f7e6147` |
| Non-executing decisions | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_PATCH_DECISIONS.csv` | `f2959914da02be631942ba83e736094217e988b2` |
| Open evidence requests | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_OPEN_EVIDENCE_REQUESTS.csv` | `095224bafaeb4466c9248e6c0e5a089b19802a97` |
| Source registry delta | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/R4c_SOURCE_REGISTRY_DELTA.csv` | `ad05147ea0749624f5583a95200765f815759d36` |
| R4c README | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4c/README_VI.md` | `d6c6fb1dd1ad05dae2dfab1df47033b8a4f31182` |
| Claude review request | `docs/audit/s0/GLOBAL_R4C_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` | `c541339f8869a941a2f881002acebb56efe89e81` |
| Global baseline audit integration | `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md` | `06e29800180a17b9ede641ac5bed359e5b2f4f7b` |
| AI handoff review pointer/worklog | `docs/coordination/AI_HANDOFF.md` | `6f1aa0fe720fb3b5bf410e2d04a1aefa8bd3f7f3` |

## 2. Structural validation against exact GitHub blobs

All four R4c CSVs were re-fetched from GitHub and parsed after file creation.

| CSV | Columns | Data rows | Rectangular | Duplicate first-column IDs |
|---|---:|---:|---|---:|
| Source evidence matrix | 13 | 15 | PASS | 0 |
| Research decisions | 7 | 27 | PASS | 0 |
| Open evidence requests | 5 | 18 | PASS | 0 |
| Source registry delta | 8 | 34 | PASS | 0 |

The 15 dossiers cover ION, CIR, IMM, CON, ABD, KAN, KOK, YEM, SND, KAL, BRD, PRI, BHU, SKM and LUA.

## 3. Historical scope and evidence limitations

Important distinctions recorded by R4c:
- ION: British High Commissioner vs Ionian constitutional institutions.
- CIR: decentralized confederation; no supported single national ruler.
- IMM: Shamil election/bay'a vs Hamzat Bek assassination; separate geographic remit from Circassia.
- CON: French legal deposition vs actual loss of control in 1837.
- ABD: tribal election, treaties and surrender are separate.
- KAN: Dil brothers joint authority and British/Shah Shuja interruption.
- KOK: Bukharan occupation, revolt and 1844 coup.
- YEM: al-Mansur Ali II remains candidate-only pending direct Yemeni Zaydi chronicle evidence.
- SND: Hyderabad, Khairpur and Mirpur Talpur branches must not be collapsed into one HOS.
- KAL: Mehrab, Shah Nawaz and Nasir Khan have different legitimacy sources.
- BRD: year-level Gaekwad chronology is provisional; exact day not substantiated.
- PRI: project aggregation is not a historical polity and must not receive a shared ruler.
- BHU: Druk Desi and Je Khenpo are concurrent offices.
- SKM: 1861 protectorate is not full annexation.
- LUA: Manthaturath death, regency and Siamese recognition are separate.

The source registry reports inspection limitations. Examples: the OUP Ionian source was abstract-only; the 2024 Circassia article was available as search extract but publisher open returned 403; Constantine university page timed out; Yemen ruler dates still lack inspected primary chronicle; Hughes Sindh Gazetteer full download was rejected due size; Baroda Royal Archives returned 503; Stuart-Fox's Laos Dictionary is cited but not directly accessed. No unsupported claim of visual page-image inspection is made.

## 4. Cumulative missing-profile accounting

From the original 54 profiles without succession arrays, the completed research dossiers cover 37 unique IDs after R3af/R4a/R4b/R4c overlap is removed. Remaining 17 IDs are:

`ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI, SUL, MAO, MLY`.

This is research-dossier coverage, not a claim that those 37 records have passed Claude review or been approved for use in the game. Existing 439 leader records and all other historical data layers remain under audit.

## 5. Technical scope

Before this receipt was added, GitHub compare from base `356a70116588a677adc4bda3f4a45772833ea002` to `6f1aa0fe720fb3b5bf410e2d04a1aefa8bd3f7f3` showed **9 commits and 9 changed paths**, all under `docs/`. This receipt is also documentation-only; final HEAD/compare must be re-fetched after this commit.

No changes were made to:
- `historical_data/`, HOS arrays, country profiles or political entity registry;
- source runtime, schema, engine, events, tests, save format or migrations;
- assets, Android, Gradle, workflows, signing or APK artifacts.

No tests, build or APK workflow was run. Every R4c commit message includes `[skip ci]`.

## 6. Review and acceptance

- Claude review request: `docs/audit/s0/GLOBAL_R4C_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Review is no-write and must use latest branch HEAD.
- ChatGPT's audit/CSV validation is self-audit only, not independent `REVIEW_PASS`.
- No owner acceptance, live-data approval or S1 authorization is asserted.
