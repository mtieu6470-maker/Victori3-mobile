# DEV-005 — Population cohort foundation: Claude independent review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Exact code review target:** `14bd56848b8db429b9037880b08887af7118d61f`  
**Implementation base:** `3d1b8dd24427f2993d561eb0c555d6e0b30b1d5a`  
**Status:** `READY_FOR_REVIEW`; ChatGPT self-audit only. No Claude verdict or owner acceptance is claimed.

## 1. Owner authorization and scope

The project owner explicitly instructed ChatGPT to proceed with DEV-005 and granted implementation authority for this bounded population-cohort foundation, including the save-contract and v1→v2 migration changes required by it.

This does **not** accept S0, change G0.7/G0.8/G0.9, mark the complete S1 phase accepted, open S7–S23, promote unverified historical research into runtime data, or waive independent review.

## 2. Commit range and changed files

Implementation commits:
- `bb386b73f3a295b69afc40ec820f63c9b241f155` — cohort model, save v2/migration and initial tests.
- `33fb01074b3086bfafe16b7288302fee065b9b46` — TypeScript contract and legacy test fixture corrections.
- `44ad1c9b0afae16bc11ed23cf4ae08f7c455ba36` — locale-independent ID ordering and regional read-model validation.
- `e429e8d701bb379a62f84717395d07681093284f` — relative floating-point tolerance for world-total mass.
- `8abdddbe57fdb6e943151ba2f7186644b54439d9` — finite/non-negative/normalized regional stratum validation and regressions.
- `1cf786987266c74e4b0d0ed3ac2e1efb55fe80ce` — end-of-tick projection refresh and late-system POP mutation regression.
- `bcc8e20dd975b9bc31292e07079d55f9180b1cea` — reject duplicate Region IDs during cohort creation and validation.
- `d4cd28a7359e580eec0a159fbb98542d8c7c70fb` — add regression for duplicate Region IDs.
- `2ec4728159f2d8833ec080dbaad7d32e60a4eedc` — reject missing/blank Region IDs in cohort creation and validation.
- `3fa719b06db08cf5c75b03b93a2387e6674368d7` — reject malformed save state and envelope/state version mismatch before migration.
- `24ae54882d723d45239611bed5da5291aa66b7d3` — add regressions for missing/blank Region IDs and invalid v1 save version.
- `75ad843b11c841a3a0191d2c256383b764cc180f` — introduce optional legacy fixture type for TypeScript strict delete rules.
- `36e5f6418f0f0f09702ba246858949bd8ac249ed` — keep the optional-property assertion attached to the fixture expression.
- `b4620a548455444ea26fc784f11dca2a13d9da56` — place the type assertion on one line to avoid TS1434 parsing failure.
- `14bd56848b8db429b9037880b08887af7118d61f` — update the pre-existing missing-save-state regression to expect the new explicit validation error.

Final changed paths from the implementation base:
- `src/engine/types.ts`
- `src/engine/init.ts`
- `src/engine/save.ts`
- `src/engine/simulation.ts`
- `src/engine/systems/populationCohorts.ts` (new)
- `tests/population-cohorts.test.ts` (new; extended with duplicate Region identity regression)

No historical runtime data, country profiles, source registry, map geometry, assets, UI, economy recipes, employment/wage implementation, Android resources, Gradle files, workflow definitions, signing configuration or secrets were changed.

## 3. Implemented behavior

### 3.1 Cohort record and identity

The current canonical ID is `pop:v1:` plus JSON serialization of `[regionId, cultureId, religionId, stratum, occupationId, qualificationId]`.

One cohort is generated for each non-empty Region × existing Stratum. Because the available 1836 inputs do not provide a verified culture × religion × occupation × qualification × age cross-tab, this bootstrap deliberately uses:
- `cultureId = null`, `religionId = null`
- `occupationId = unclassified`, `qualificationId = unknown`
- age profile absent
- literacy, radicalism, wealth and income values null rather than copying region-level estimates into unsupported subgroups.

State labels are `estimated`, method `region-strata-aggregate-v1`.

### 3.2 Authority and update boundary

This is a conservative transition, not the final cohort-authoritative engine:
- `Region.pop` and `Region.strata` remain authoritative in DEV-005.
- The projection is rebuilt after Region initialization.
- The monthly refresh occurs at the end of `stepMonth`, **after all systems**, including population, politics/secession, events and AI. This avoids a stale projection if a later monthly system changes regional POP after `populationMonth` has run.

A regression temporarily appends a final system that changes `Region.pop` after the regular system list and verifies the saved projection still matches the final Region total.

### 3.3 Numeric contract and known deviation

`PopulationCohort.size` is finite fractional person-equivalent to preserve existing continuous POP arithmetic and avoid rounding the 1836 baseline. The population design proposal's eventual integer safe-integer headcount contract is not fulfilled in this transitional slice. Please decide whether this deviation is acceptable, or whether deterministic integer/fixed-point headcounts are required before extending the schema.

### 3.4 Validation contract

Validation rejects an invalid envelope, duplicate Region IDs, unknown region references, duplicate/non-canonical cohort IDs, unsupported invented attributes, non-finite/non-positive cohort sizes, invalid Region POP, malformed/negative/non-finite regional stratum shares, non-normalized shares for populated regions, and region/cohort total or stratum-proportion mismatches.

### 3.5 Save migration

- `GameState.version` and save-envelope version are now 2.
- v1 deserialization performs deterministic, pure migration from existing Region POP/strata into the cohort projection.
- Migration does not consume RNG or use time, network, filesystem or external history.
- v2 saves missing cohort data or failing mass/stratum invariants are rejected, not silently repaired.
- Legacy defaults for `marketStats`, construction projects, state/private pools, employment and wages are retained.

The complete roadmap distinction between engine version, save schema version and data-build hash is not implemented by this slice. Please review whether this single bounded version bump is acceptable.

## 4. Regression and CI evidence

New suite: `tests/population-cohorts.test.ts` (6 focused cases):
- initialization and canonical/unknown cohort fields;
- 24-month projection synchronization;
- refresh after a later monthly system changes POP;
- pure v1→v2 migration preserving RNG and regional fields, followed by v2 round-trip;
- rejection of NaN, negative and non-normalized strata;
- rejection of missing/inconsistent v2 cohort state.

**Previously verified code HEADs:** `1cf786987266c74e4b0d0ed3ac2e1efb55fe80ce` and corrective intermediate `d4cd28a7359e580eec0a159fbb98542d8c7c70fb`.

### 4.1 Corrective self-audit pass — 19/11/2026

The first review found that duplicate `Region.id` values could evade the projection validator because a Map silently overwrote duplicate keys. The correction added duplicate guards to creation and validation, plus a regression. This intermediate code HEAD `d4cd28a7359e580eec0a159fbb98542d8c7c70fb` then passed tests-only CI: [44508941178](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44508941178), 11/11 files and 116/116 tests.

A second bounded review found two malformed-state gaps:
- Region IDs could be missing, non-string or whitespace-only. They are now rejected before sorting, key generation or Map insertion.
- A v1 envelope could contain a mismatched embedded `state.version` and still be silently migrated to v2. Deserialization now rejects missing/non-object state and requires the embedded version to equal the envelope version before applying legacy defaults or migration.

Regression coverage verifies missing and blank Region IDs, duplicate Region IDs, and v1 envelope/state version mismatch.

**Exact code review HEAD:** `14bd56848b8db429b9037880b08887af7118d61f`. The branch tip is documentation-only HEAD `3ff6b3af883ce685f8438c24eb7a3c050b547155`; no runtime/test source changed after the code review target.
**Verified corrective CI (exact code HEAD `14bd56848b8db429b9037880b08887af7118d61f`):**
- Tests-only run [44511298764](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511298764) — PASS, 11/11 test files, 118/118 tests, 0 failed, 0 pending.
- Android debug run [44511298947](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511298947) — SUCCESS, including web build/typecheck, 118/118 unit/simulation tests, Capacitor sync, Gradle `assembleDebug`, APK checksum and v1/v2 signature verification.
- The current branch-tip confirmation run [44511435508](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511435508) built documentation-only HEAD `3ff6b3af883ce685f8438c24eb7a3c050b547155` successfully; it also ran 118/118 tests.
- APK from current branch-tip run: 18,052,012 bytes; SHA-256 `2f90290c68eb4c8f60bc5478165a12df07295014c9445c8fa3f24984bff14418`; debug signer certificate SHA-256 `d33d761fd43643da99e87077e4a99ae89ff9870a18e23987dc904ba63d720acf`; apksigner exit code 0; v1 and v2 verification true. Artifact ID [14522638832](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44511435508/artifacts/14522638832). This is a debug APK, not release-signed and not physical-device QA.



**Tests-only CI:** [44499872965](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44499872965) — PASS, 11/11 test files, 115/115 tests, 0 failures, 0 pending.

**Android debug CI:** [44499872833](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44499872833) — SUCCESS. `npm ci`, generated data/map/content, web build/typecheck (`tsc --noEmit` through `npm run build`), Vitest, Capacitor sync, Gradle `assembleDebug`, APK checksum, asset manifest and `apksigner` verification all succeeded.

**APK identity:** 18,051,865 bytes; file SHA-256 `025faf6255c529397ce4fd3b59f5023493287bf5ccbb1c343716e7bc63f302b2`. Debug signer certificate SHA-256 `4c5cb13e69a17335ced627c6d6ff79b5d64c63a07ecd7c0fe1a44a49c5b216bd`; v1 and v2 signature verification true. GitHub APK artifact ID `14517545981`; artifact ZIP SHA-256 `1eae16246426dd6c35ebcdd89b02966ab8fd78c36b71fcd6011e23f7f915a646`. The ZIP hash is not the APK file hash.

No physical-device install/upgrade, iQOO QA, release signing, save migration on a user's live save, or Android performance/thermal benchmark has been performed.

## 5. Required independent review questions

1. Is the canonical JSON tuple complete and collision-safe? Is code-unit ordinal ordering stable across Node and Android WebView/JSC?
2. Is the null/unclassified policy appropriate with current evidence, or can a verified cross-tab be added without manufacturing demographic precision?
3. Does rebuilding at the end of `stepMonth` cover all current mutations of `Region.pop` and `Region.strata`? Search commands, events, secession, migration and direct system calls for stale-save paths.
4. Do the mass and strata invariants correctly reject NaN, Infinity, negative values, non-normalized shares, missing cohorts, duplicate IDs and unknown region IDs? Are tolerances sufficiently strict without false failures at world scale?
5. Is fractional person-equivalent `size` an acceptable transition, or must integer/fixed-point headcounts be implemented now?
6. Is v1→v2 migration pure, repeatable and backward-compatible? Does it preserve unrelated fields? Is bumping the single `GameState.version` safe without separate schema/data-build versioning?
7. Are nullable literacy/radicalism/wealth/income fields safe for downstream consumers? Check for implicit numeric assumptions.
8. Is the per-tick projection rebuild practical on Android with 662 regions and thousands of cohorts? Assess allocations, sorting costs, garbage churn and retained memory.
9. Are projection tests tautological because the model and the expected values derive from the same Region fields? What independent tests can catch an upstream Region calculation bug?
10. What is the smallest next slice to promote cohorts to the authoritative source of population dynamics without dual-writing Region aggregates?

## 6. Requested verdict

Please re-fetch the branch and review the exact current corrective code HEAD above. Earlier targets are superseded for review by `14bd56848b8db429b9037880b08887af7118d61f`; re-fetch the branch before inspecting. Return one bounded verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

For each finding, include severity, exact file/line, reproducible scenario, consequence and the smallest targeted correction/test. Keep any correction inside DEV-005. A Claude-authored correction is a corrective pass, not an independent review of that same correction; ChatGPT will re-fetch and rerun verification on the corrected HEAD.

## 7. Explicit non-claims

This is a population cohort bootstrap/projection, not full Victoria 3 POP parity. It does not implement cohort-level birth/death/migration, age structure, verified occupational/qualification data, wealth distribution, needs/consumption, market inventory/access, real hiring/wages, BuildingSites, cohort-based political influence, or multi-decade population calibration. No unverified Hydrogen data was imported. S0 gate and wider phase lifecycle statuses remain unchanged.