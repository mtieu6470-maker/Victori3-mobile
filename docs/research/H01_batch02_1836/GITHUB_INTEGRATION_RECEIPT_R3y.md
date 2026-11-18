# H01 R3y — GitHub integration receipt

- Repository: https://github.com/mtieu6470-maker/Victori3-mobile
- Branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Base HEAD before R3y: `5f58c2b6f12a0015ae43472d13fbe838ff9ad966`
- Final R3y handoff HEAD immediately before this receipt: `1ba51c53e91c50d5620ece7a16e8475dbe7d55d1`
- Scope: H01 research and provenance documentation only.

## R3y commits

| Commit | Change |
|---|---|
| `2bc4426704dbad24b2554a7147cc99b4ff8499aa` | Add Oyo 1831–36 political geography/population audit |
| `ea30b42609143cd30318ec92d528b5f3eb58b9bb` | Add source evidence matrix |
| `784b3e447b333ca3d4e6b02e21d0fb14568e5abd` | Add patch decisions |
| `9be1f391a3dccf6658736e52b92fc313749c26db` | Add open evidence requests |
| `8512dd6a092aab3a6f4319da74997477e38af636` | Add source registry delta |
| `841a97b5184fec9beed0938c0be1a698495706af` | Append R3y requests to consolidated request tracker |
| `f2a5b63a93f582aeed601f0f6587b0f33b4bd7b7` | Append R3y Oyo findings to consolidated audit |
| `7c019eceb15a3affe618b8855d898a068b64a802` | Append R3y validation |
| `de8c2737079cbb49d2bcca11e4d2034fe73ecc72` | Update README |
| `4606a826cce7491cd0ca973e8606dd1d4db1bfa4` | Update integration map |
| `1ba51c53e91c50d5620ece7a16e8475dbe7d55d1` | Update coordination handoff |

All commit messages use `[skip ci]`.

## Research outcome

- Lovejoy (2019) annual chronology shows political fragmentation and changing control: by 1833 Ilorin had destroyed or subjected most important Oyo towns; southern independent/competing powers included Ijaye, Abemo and Ibadan; after Oyo/Bariba recovery attempts in 1834–35, the Old Oyo capital district was abandoned in 1836 and multiple states competed for control.
- Lovejoy explicitly says map boundaries are fuzzy/approximate and that GIS Jan 2/Dec 31 timestamps are software placeholders with zero historical value. No day-level owner transition for 1836-01-01 can be inferred.
- The article's 75,000+ measure is Atlantic slave-ship embarkations, not all Oyo residents/refugees.
- Original H01 OYO=650,000 method describes refugee movement but has no cohort count, stock definition or calculation. OYO_OYO=1,450,000 is a broad Oyo/Ibadan/Abeokuta regional projection with no local workbook, polygon/denominator or reproducible growth/migration method. These are different population units and remain quarantined.
- SSA_REG_18 is technically mapped 100% to OYO_OYO/owner OYO. R3y shows this is an arithmetic join, not validated historical control over all constituent localities.
- No numeric or owner change approved.

## Scope and acceptance

No shipped historical data, population profiles/benchmarks, political entity registry, map geometry/owner, game runtime, engine, save schema, tests, assets, Android, Gradle, workflow or APK changed. No PR or merge. Status remains `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`. ChatGPT self-audit only; independent Claude review and owner acceptance remain pending.

This receipt's own commit is identified by GitHub metadata and is not self-referenced.
