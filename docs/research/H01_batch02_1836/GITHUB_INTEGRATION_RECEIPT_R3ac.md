# H01 R3ac — GitHub integration receipt

- Repository: https://github.com/mtieu6470-maker/Victori3-mobile
- Branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Base HEAD before R3ac: `1dea95b089b8e2a661223e414f18ee2891c50ca8`
- HEAD immediately before this receipt: `1e50caa56dab9b97cc52ec2d34ac0504ef3ecca9`
- Scope: H01 research/documentation only. No live product/game-data change.

## Commit chain

| Commit | Change |
|---|---|
| `d51f2fe03bc6e17cbec7298ca9005f5f25a22bd2` | Add Vietnamese R3ac audit |
| `330dea2cbc60d62bfb727016abb0add5e807f120` | Add source evidence matrix (initial draft; corrected below) |
| `52557af822a2ffb00ed572d7e99be4c0733a869d` | Add patch decisions |
| `9dfa024f4d3d4f9506715c67fe13b2a9926b904f` | Add open evidence requests |
| `8edf88e37617f9641b13e2184f9689268b030283` | Correct source evidence matrix CSV columns / URLs |
| `ef04b44320acccc59fc618a75b253e6ab6067bef` | Add source registry delta |
| `9a73d06628f73afb66e1d90e5b977f0c106c4f58` | Update H01 README |
| `dc1c85e3c689aa696977c1fd7cae37bc269e5dc7` | Append validation report |
| `c4ea80cb019982b5045f350372b79285bf9a574c` | Append integrated research audit |
| `102acffb9eb42d79e4dce1c0979b9af5d4ffd441` | Update repository integration map |
| `ff1c2ed064ce35c4452e0e8ad0cdb5d7e025e541` | Append cumulative open evidence requests |
| `1e50caa56dab9b97cc52ec2d34ac0504ef3ecca9` | Append cumulative source registry delta |

All commits use `[skip ci]`. The first R3ac source-matrix draft omitted the explicit `relevant_scope` column and did not place URLs in the correct column; it was replaced by the corrected rectangular 10-column version before this receipt. Claude must review the final blob, not the superseded draft.

## Changed paths and scope check

GitHub compare from base `1dea95b0` to pre-receipt HEAD `1e50caa5` reported 12 commits and 11 changed paths. All paths were under `docs/research/H01_batch02_1836/`.

Added:
- `H01_R3ac_CENTRAL_SAHEL_RULERSHIP_AND_SOVEREIGNTY_AUDIT_VI.md`
- `H01_R3ac_SOURCE_EVIDENCE_MATRIX.csv`
- `H01_R3ac_PATCH_DECISIONS.csv`
- `H01_R3ac_OPEN_EVIDENCE_REQUESTS.csv`
- `H01_R3ac_SOURCE_REGISTRY_DELTA.csv`

Updated:
- `README_VI.md`
- `H01_VALIDATION_REPORT.md`
- `H01_INTEGRATED_AUDIT_REPORT_VI.md`
- `H01_REPO_INTEGRATION_MAP.md`
- `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv`
- `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv`

No changes under `src/`, `historical_data/`, tests, assets, map-owner/geometry, engine, save/schema, Android, Gradle or workflow paths. No APK build, tests, PR or merge was run.

## Structural validation

| CSV | Columns | Data rows | Result |
|---|---:|---:|---|
| R3ac source evidence matrix | 10 | 10 | PASS |
| R3ac patch decisions | 7 | 6 | PASS |
| R3ac open evidence requests | 5 | 7 | PASS |
| R3ac source registry delta | 8 | 10 | PASS |
| Cumulative H01 open evidence requests | 5 | 43 | PASS |
| Cumulative H01 source registry delta | 8 | 38 | PASS |

All checked rows are rectangular. This is structural validation only; it does not certify the truth of every historical assertion.

## Research disposition

- **SOK:** Muhammad Bello's 1817–1837 rule is supported; Naylor (2021) identifies `Amīr al-muʾminīn` as a manuscript-preferred title, while Last (1967) documents the Gawakuke campaign in March 1836. Treat other titles as aliases/translation variants pending closer primary-document collation.
- **BOR:** al-Kanemi/Shehu as de facto ruler and Mai Ibrahim/Sayfawa as continuing traditional institution are distinct; the latter ended in 1846. Death-year sources conflict (1835 vs 1837), with 1837 better supported by NPG and *History of Nigeria 2*.
- **WAD:** Muhammad al-Sharif accession date remains contested between 1834, 1835 and 1838; Cordell documents at least six divergent king lists. Do not treat the current `since=1835` as fully verified.
- **DAR:** Muhammad al-Fadl ruled 1803–1838; Muhammad al-Husayn succeeded in 1838.

No role, title, ruler, government, territory, event or population value has been promoted into live gameplay data.

## Review and acceptance

Status: `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

Claude independent review remains pending. ChatGPT's source collation and CSV checks are self-audit, not `REVIEW_PASS`. Owner acceptance and any later product/schema authorization remain separate gates.