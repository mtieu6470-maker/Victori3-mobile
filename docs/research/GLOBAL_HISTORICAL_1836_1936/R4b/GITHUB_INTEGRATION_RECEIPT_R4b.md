# GitHub Integration Receipt — Global Historical R4b

**Task:** `GLOBAL-HISTORICAL-R4B-SUCCESSION-AUTHORITY-TRANCHE`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `e5dead90d15cab772a8a0fa00ee76f76e4d08916`  
**Pre-receipt HEAD:** `e51c5042af828372db52d0a7d3bc719ca57993b9`  
**Date:** 18 November 2026  
**Disposition:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

## 1. R4b artifacts and commits

| Artifact | Path | Commit |
|---|---|---|
| Succession and authority audit | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_GLOBAL_SUCCESSION_AND_AUTHORITY_AUDIT_VI.md` | `c5da8318b7df45f2f352e2fc0d076fb752786c58` |
| 15-polity evidence matrix | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_SOURCE_EVIDENCE_MATRIX.csv` | `4d9a4155ecbee7c632095226d7648d1b9eedf04d` |
| Non-executing decisions | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_PATCH_DECISIONS.csv` | `b73f5e34e564bd746b3a4d92fcf9968ee80e7361` |
| Open evidence requests | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_OPEN_EVIDENCE_REQUESTS.csv` | `aa6ca5d8ecfd51edc4d19641374dd39ca032d867` |
| Source registry delta | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/R4b_SOURCE_REGISTRY_DELTA.csv` | `d722fd68aa947808354aac426b95deddadf36f1e` |
| R4b README | `docs/research/GLOBAL_HISTORICAL_1836_1936/R4b/README_VI.md` | `1ededf1bee5852c8c987cb27d0b61f19dd0c6f3b` |
| Claude review request | `docs/audit/s0/GLOBAL_R4B_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` | `59c1605ab928b22d31691c886e6466c3f4190f48` |
| Global baseline audit integration | `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md` | `11622af4ab63bc72e9adbd1ae65ab49248c89625` |
| AI handoff review pointer/worklog | `docs/coordination/AI_HANDOFF.md` | `e51c5042af828372db52d0a7d3bc719ca57993b9` |

## 2. Structural validation against exact GitHub blobs

All R4b CSV blobs were re-fetched from the target branch and parsed after file creation.

| CSV | Columns | Data rows | Rectangular | Duplicate first-column IDs |
|---|---:|---:|---|---:|
| Source evidence matrix | 13 | 15 | PASS | 0 |
| Research decisions | 7 | 25 | PASS | 0 |
| Open evidence requests | 5 | 18 | PASS | 0 |
| Source registry delta | 8 | 33 | PASS | 0 |

The 15 polity rows are: KHI, BUK, HER, NAJ, TUN, NAG, AWA, GWA, HOL, TIB, RYU, BRN, ACE, MER and NDE.

## 3. Evidence and limitations

The source registry records what was actually inspected (full text, searchable transcription, abstract, metadata/search extract, or parsed PDF text), plus the limitation of each source.

PDF screenshot attempts were made where relevant. Page images could not be retrieved for the Petech Tibet PDF (403), University of the Ryukyus PDF (429), Maharashtra Gazetteer (502), Aitchison treaty volume (timeout), Cambridge Madagascar excerpt (502), and Aceh chronology PDF (timeout). The report does not claim those pages were visually inspected. Text parsing/searchable extracts were used only with explicit limitations.

High-priority issues include:
- Khiva/Bukhara profile source-scope mismatch (`levi_2017` is Kokand-centred);
- Herat Kamran Shah and Yar Muhammad authority split;
- Nejd Faisal's first reign, Egyptian capture/occupation and 1843 return;
- Nagpur ruler death in 1853 vs British administrative takeover in 1854;
- Tibet's Dalai Lama/Regent roles and calendar uncertainty;
- Aceh possible 1836 baseline-head mismatch and concurrent rival Sultan/territorial authority;
- Madagascar Queen vs Prime Minister/effective ruler;
- Ndebele contested succession and regency.

All are research findings/candidates, not approved data changes.

## 4. Technical scope

Before this receipt was added, GitHub compare from base `e5dead90d15cab772a8a0fa00ee76f76e4d08916` to `e51c5042af828372db52d0a7d3bc719ca57993b9` showed **9 commits and 9 changed paths**, all under `docs/`. This receipt is also a documentation-only file; re-fetch final HEAD/compare after its commit.

No changes were made to:
- `historical_data/`, HOS arrays, country profiles or political entity registry;
- source runtime, schema, engine, events, tests, save format or migrations;
- assets, Android, Gradle, workflows, signing or APK artifacts.

No tests, build or APK workflow was run. Every R4b commit message uses `[skip ci]`.

## 5. Review and acceptance

- Claude request: `docs/audit/s0/GLOBAL_R4B_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Review is no-write and must use the latest branch HEAD.
- ChatGPT's audit/CSV verification is self-audit only, not an independent `REVIEW_PASS`.
- No owner acceptance, game-data approval or S1 authorization is asserted.
