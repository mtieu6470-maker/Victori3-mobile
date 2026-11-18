# H01 R3ab — GitHub integration receipt

- Repository: https://github.com/mtieu6470-maker/Victori3-mobile
- Branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Base HEAD before R3ab: `0f5685231569ed4c72783cdd79a8abed63819943`
- HEAD immediately before this receipt: `1b6be7d3b5f90fe239a2d231b296cb3aa1bb80ae`
- Scope: H01 research/documentation only. No game/runtime/data patch.

## Commit chain

| Commit | Change |
|---|---|
| `e5cbbf71bf0e1d4346ead29ac28cbd74de56174f` | Add Vietnamese R3ab audit |
| `7e34387abac79c7c641b4df171b5ed78a6519ac7` | Add source evidence matrix |
| `3bc81016434fecb0b6a8672493d6ea41e498a870` | Add patch decisions |
| `9b876a74015d3ba0a9c7a5f212786aed6cf229e5` | Add open evidence requests |
| `ea056881b0962d32e18e90b97693c3586303ce39` | Add source registry delta |
| `5b6d1de197b7f87f1b2d98ec4440670eabf96d28` | Correct source registry CSV URL/column completeness |
| `73471e476c9b78f15ba78ea1137d7126bb77e6fe` | Update H01 README |
| `3598b9ace2cc61872c98bab9f884993c6c3befe2` | Append initial R3ab validation |
| `ab7d1d004a4b5b54fd218d23d0a9afcd38191b65` | Append integrated audit |
| `f93db793055dba479ec6d3fc40028d502847b14e` | Update integration map |
| `b30ee3e3dbb44f61ac8ee2f8fe48ab730ceb439c` | Append cumulative open evidence requests |
| `e7744f116451b84d34975e19a38385ef22bc8faf` | Append cumulative source registry |
| `b7408f8a8f50d3e936bc6bc938806b2869b447f4` | Correct R3ab validation counts |
| `1b6be7d3b5f90fe239a2d231b296cb3aa1bb80ae` | Update AI_HANDOFF with R3ab work log |

All commits use `[skip ci]`. This receipt is identified by subsequent GitHub commit metadata rather than a self-referencing SHA.

## Changed paths and scope check

GitHub compare from base `0f568523` to pre-receipt HEAD `1b6be7d3` reports 14 commits and 12 changed paths. Every changed path is under `docs/coordination/` or `docs/research/H01_batch02_1836/`.

Added:
- `H01_R3ab_1836_AFRICAN_POLITY_OFFICEHOLDER_AUDIT_VI.md`
- `H01_R3ab_SOURCE_EVIDENCE_MATRIX.csv`
- `H01_R3ab_PATCH_DECISIONS.csv`
- `H01_R3ab_OPEN_EVIDENCE_REQUESTS.csv`
- `H01_R3ab_SOURCE_REGISTRY_DELTA.csv`

Updated:
- `README_VI.md`
- `H01_VALIDATION_REPORT.md`
- `H01_INTEGRATED_AUDIT_REPORT_VI.md`
- `H01_REPO_INTEGRATION_MAP.md`
- `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv`
- `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv`
- `docs/coordination/AI_HANDOFF.md`

No changes under `src/`, `historical_data/`, tests, assets, map-owner/geometry, engine, save/schema, Android, Gradle or workflow paths. No PR, merge, tests, build, APK workflow or device install was run.

## Structural checks

| CSV | Columns | Data rows | Result |
|---|---:|---:|---|
| R3ab source evidence matrix | 10 | 9 | PASS |
| R3ab patch decisions | 7 | 6 | PASS |
| R3ab open evidence requests | 5 | 9 | PASS |
| R3ab source registry delta | 8 | 8 | PASS |
| Cumulative open evidence requests | 5 | 36 | PASS |
| Cumulative source registry delta | 8 | 28 | PASS |

All checked rows are rectangular. The first source-registry draft was found to be missing URL fields and was corrected before this receipt.

## Research disposition

- FJA: Bubakar is a provisional Almami candidate on the 1836 simulation snapshot; exact p.150 and underlying chronology evidence remain open.
- ETH: Sahle Dengel is the nominal emperor for 1832–1840; Ras Ali Alula/Ali II is separately described as the effective power-holder; Mänän's role is time-qualified.
- LIB: the ACS-administered colony is not a sovereign state in 1836; A.D. Williams is listed as agent, and Thomas Buchanan's Bassa-settlement jurisdiction is distinct from the later governor title.
- No officeholder, government, territorial-control, population, event or gameplay data has been promoted into runtime.

## Review and acceptance

Status: `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

Claude independent review remains pending. ChatGPT's structural/source checks do not constitute `REVIEW_PASS`. Owner acceptance and any later product-data/schema authorization remain separate gates.