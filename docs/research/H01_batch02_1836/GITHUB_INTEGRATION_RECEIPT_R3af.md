# GitHub integration receipt — H01 R3af

**Task:** H01-R3AF-SHE-ZUL-BSO-SUCCESSION-1836-1900  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7` (sole/default branch)  
**Base HEAD:** `c4b5f08983961494542c7c938db4a32ae21378c4`  
**Pre-receipt HEAD:** `d834f7590fc67fecce5afd41039a52edcc249e21`  
**Integration date:** 18 November 2026  
**Disposition:** `SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`

## 1. R3af research package

| Artifact | Path | Commit |
|---|---|---|
| Succession audit | `docs/research/H01_batch02_1836/H01_R3af_SHE_ZUL_BSO_SUCCESSION_AUDIT_VI.md` | `59ee3385459f37828eb05a787c6715a0b6e22045` |
| Source evidence matrix | `docs/research/H01_batch02_1836/H01_R3af_SOURCE_EVIDENCE_MATRIX.csv` | `6d820863c8831c605c928524eae3b405be12bd87` |
| Patch decisions | `docs/research/H01_batch02_1836/H01_R3af_PATCH_DECISIONS.csv` | `6d7e115bd6219c5abcc4c1ea331f9994a2e716e6` |
| Open evidence requests | `docs/research/H01_batch02_1836/H01_R3af_OPEN_EVIDENCE_REQUESTS.csv` | `8a45b66ff07b1f21ca6de8ffd28b130122b1162c` |
| Source registry delta | `docs/research/H01_batch02_1836/H01_R3af_SOURCE_REGISTRY_DELTA.csv` | `6afac9e21d06c850c12ed388c7354828606e62b5` |
| Claude review request | `docs/audit/s0/H01_R3AF_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md` | `a45743af1511f97e5954ff3854acb262f1398a94` |

## 2. H01 cumulative integration

| Updated artifact | Commit |
|---|---|
| `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` | `a7da6a33cb62830a06c4c5c1dae7c60f42d9660f` |
| `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` | `55c935e94d00d2f6890f5a4ef4bde53fdd1a8696` |
| `H01_INTEGRATED_AUDIT_REPORT_VI.md` | `4c32a2d1678fe4085919e1a3de9334855e6131f9` |
| `H01_REPO_INTEGRATION_MAP.md` | `6a24ed30058fd930506115dbad390662af81ba33` |
| `H01_VALIDATION_REPORT.md` | `0aa971e66a8fcb0e33c12db52c56db7fec64b495` |
| `README_VI.md` | `02bd4ebae3796d8792f50653991ad49b818eaa54` |
| `docs/coordination/AI_HANDOFF.md` | `d834f7590fc67fecce5afd41039a52edcc249e21` |

## 3. Structural validation

Validation was run against the exact GitHub file contents after integration.

| CSV | Columns | Data rows | Result |
|---|---:|---:|---|
| R3af source evidence matrix | 10 | 17 | PASS |
| R3af patch decisions | 7 | 14 | PASS |
| R3af open evidence requests | 5 | 10 | PASS |
| R3af source registry delta | 8 | 17 | PASS |
| Cumulative H01 open evidence register | 5 | 70 | PASS |
| Cumulative H01 source registry | 8 | 77 | PASS |

- Every parsed row is rectangular.
- All 17 matrix source IDs map one-to-one to a `SRC_H01_` source-registry ID.
- No duplicate IDs exist in the cumulative request or source registries; the 10 new request IDs and 17 new source IDs do not collide with pre-existing IDs.
- Before this receipt was created, GitHub compare from base `c4b5f08983961494542c7c938db4a32ae21378c4` to `d834f7590fc67fecce5afd41039a52edcc249e21` showed 13 commits and 13 changed paths; every changed path was under `docs/`. The receipt is itself a documentation-only addition; the final HEAD/compare must be re-fetched after this commit.

## 4. Scope and safety boundary

R3af is a research and documentation package. It did **not** change:

- `historical_data/`, `heads_of_state.json`, country profiles or game source/runtime;
- population, political entities, territorial ownership, map geometry or events;
- engine, tests, assets, save/schema or migrations;
- Android, Gradle, workflows, signing or APK artifacts.

No test, build or APK workflow was run. Every commit message in this R3af chain includes `[skip ci]` to avoid triggering the broad APK workflow.

## 5. Historical findings requiring independent review

- **SHE:** Menelik's 1855 proclamation is not continuous effective rule while in captivity; 1865 restoration, 1878 nəguś recognition and 1889 imperial transition are distinct. Haile Malakot's death month/day conflicts.
- **ZUL:** Cetshwayo's 1872 formal accession is separate from his earlier ascendancy; 1879 exile and restricted 1883 restoration interrupt the sequence; death date 1883/1884 remains conflicted. Dinuzulu's 1884 succession is separate from British possession in 1887 and Natal incorporation in 1897.
- **BSO:** Letsie's accession is retained at year-level 1870; the 1891–92 report gives a contemporary date/recognition sequence for Lerothodi, but customary legitimacy and Maama's claim remain open. Local paramount leadership is distinct from British/Cape colonial sovereignty.

## 6. Review and acceptance

- Claude independent review request: `docs/audit/s0/H01_R3AF_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`.
- Required review is no-write and must use the latest HEAD, not only the base/pre-receipt SHA in this document.
- ChatGPT's validation is self-audit only. No independent `REVIEW_PASS`, owner acceptance, product-data approval or S1 authorization is asserted.
- This file cannot contain its own commit SHA. Identify its commit and final branch HEAD from GitHub commit metadata.
