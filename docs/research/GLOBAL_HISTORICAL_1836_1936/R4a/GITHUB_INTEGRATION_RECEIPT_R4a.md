# GitHub Integration Receipt — Global Historical R4a

**Task:** `GLOBAL-HISTORICAL-R4A-PRIORITY-TRANCHE`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314`  
**Pre-receipt HEAD:** `bea5f6b454e70ee7535927ab9891f37cc0a651a8`  
**Date:** 18 November 2026  
**Disposition:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

## 1. R4a artifacts and commits

| Artifact | Path | Commit |
|---|---|---|
| Global source audit | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_GLOBAL_SUCCESSION_SOURCE_AUDIT_VI.md` | `6a60567a9536d679235ec2351da1d3d594dead39` |
| 13-polity evidence matrix | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_SOURCE_EVIDENCE_MATRIX.csv` | `30063287bec80ea289baca57d4f5314b7fbef23e` |
| Research/patch decisions | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_PATCH_DECISIONS.csv` | `d4bca712fbe532b83c09dc19ef39e1a483f57699` |
| Open evidence requests | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_OPEN_EVIDENCE_REQUESTS.csv` | `98510fee25625353ee7681cb093e0922b243ea0e` |
| Source registry delta | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_SOURCE_REGISTRY_DELTA.csv` | `11f8a1d20a0889ecbc200ee15e963b0ed47a40bd` |
| All 54 missing-profile triage | `docs/audit/GLOBAL_HOS_MISSING_PROFILE_TRIAGE_R4a.csv` | `343e1c4da4264369a60659e197d329b7e8ac8002` |
| R4a README | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/README_VI.md` | `74928e1191cc52949189f6e04fdf47e83c1c4821` |
| Claude independent review request | `docs/audit/s0/GLOBAL_R4A_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` | `51c454a7d3f925e1bc5fbdea9fde6dd5a8e0da6c` |
| Global audit integration | `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md` | `7ed9982f60a48415906eb5a6755fb1b8557a9936` |
| Handoff pointer and worklog | `docs/coordination/AI_HANDOFF.md` | `d9b71a1b54a6c92f5e52a043302cc910318f89d5` |
| Source-registry rectangular-row correction | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4a/R4a_SOURCE_REGISTRY_DELTA.csv` | `bea5f6b454e70ee7535927ab9891f37cc0a651a8` |

## 2. Structural validation from exact GitHub file contents

Validation was performed after the source-registry row correction.

| CSV | Columns | Data rows | Rectangular | Duplicate first-column IDs |
|---|---:|---:|---|---:|
| R4a source evidence matrix | 13 | 13 | PASS | 0 |
| R4a decisions | 7 | 24 | PASS | 0 |
| R4a open evidence requests | 5 | 15 | PASS | 0 |
| R4a source registry delta | 8 | 28 | PASS | 0 |
| Global missing-profile triage | 20 | 54 | PASS | 0 |

Missing-profile triage totals:
- 30 individual ruler/head-of-state research cases;
- 10 subject local-authority cases;
- 3 colonial/company/protectorate authority cases;
- 5 collective/aggregate authority cases;
- 4 unresolved leadership/source gaps;
- 2 rebel/provisional-government cases.
- Priority: 5 P1, 46 P2, 3 P3.

The 13 polity evidence matrix contains USA, Mexico, Brazil, Japan, Qing China, Qajar Persia, Ottoman Empire, Sokoto, Zulu, Asante, Morocco, Wallachia and Moldavia.

## 3. Technical and scope validation

Before this receipt was added, GitHub compare from base `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314` to `bea5f6b454e70ee7535927ab9891f37cc0a651a8` showed **11 commits and 10 changed paths**, all beneath `docs/`. The receipt is also a documentation-only file; final HEAD/compare must be re-fetched after this commit.

No changes were made to:
- `historical_data/`, live HOS arrays or country profiles;
- political entity registry or source runtime;
- schema, engine, events, tests, save format or migrations;
- assets, Android, Gradle, workflows, signing or APK artifacts.

No test, build or APK workflow was run. Every R4a commit message includes `[skip ci]`.

## 4. Findings still requiring independent review

R4a identifies, but does not execute, proposed corrections or modelling changes:
- Mexico interim officeholders and differing 1839 date boundaries across official/academic sources.
- USA constitutional succession date vs oath date for John Tyler.
- Japan’s simultaneous Shogunate and Imperial offices.
- Brazil’s Regency vs Pedro II’s sovereign title.
- Qajar designation, accession and coronation date distinctions.
- Ottoman Mahmud II/Abdülmecid date disagreement and absent record-level sources.
- Sokoto exact-day timestamps unsupported by the year-level evidence located.
- Asante dynastic/civil conflict 1883–1888 and Kwaku Dua II’s short tenure.
- Zulu exile, truncated restoration and contested control.
- Morocco Sultan/regent distinction and 1908–1912 sovereignty questions.
- Wallachian/Moldavian local princes vs Ottoman/Russian authority, occupation and interim governance.

R4a is the first priority tranche, **not complete global validation** of 439 records or the wider world history.

## 5. Review and acceptance

- Claude review request: `docs/audit/s0/GLOBAL_R4A_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Review is no-write and must use the latest branch HEAD.
- ChatGPT's CSV/diff validation is self-audit only, not an independent `REVIEW_PASS`.
- No owner acceptance, live-data approval or S1 authorization is asserted.
