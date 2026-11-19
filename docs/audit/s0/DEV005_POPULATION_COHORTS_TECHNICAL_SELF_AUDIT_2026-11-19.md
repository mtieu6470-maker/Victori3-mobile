# DEV-005 Technical Self-Audit — ChatGPT (not an independent verdict)

**Date:** 2026-11-19  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Audit target:** `0c171b9b615e4f91cce66749f8482837c8dfa9ef`  
**Implementation base:** `3d1b8dd24427f2993d561eb0c555d6e0b30b1d5a`  
**Status:** ChatGPT technical self-audit only. The tests-only CI for the audit target has passed; the Android debug build has also completed successfully. No Claude `REVIEW_PASS`, owner `ACCEPTED`, device QA or phase transition is claimed.

## 1. Executive result

The DEV-005 slice is a conservative **cohort projection and save-compatibility foundation**, not a cohort-authoritative population simulation. `Region.pop` and `Region.strata` remain authoritative. Unsupported historical cross-tabs are left unknown/unclassified rather than fabricated.

One concrete correctness defect was found during this self-audit and corrected before independent review:

- The creation path accepted regional stratum-share totals within an absolute `1e-7` tolerance, but multiplied the un-normalized shares by large regional population values.
- The validator applied a much tighter population-mass tolerance (`max(1e-7, abs(pop) * 1e-10)`). Therefore an input accepted by creation could produce a cohort projection that immediately failed save validation for a sufficiently large region.
- Creation now validates the total first, then normalizes the accepted shares before multiplying by `Region.pop`. Regional shares remain unchanged; the cohort projection represents the same shares within the declared share tolerance.
- A regression sets a regional population to 1,000,000,000 and introduces a tolerated `5e-8` stratum-total drift, then requires the projection to serialize and preserve mass.

Correction commits:
- `816d077e07c9e41e0784bbd6d69bdddeec7f2490` — normalize accepted stratum rounding before cohort creation.
- `0c171b9b615e4f91cce66749f8482837c8dfa9ef` — regression test for large regional population.

The exact-target CI runs are:
- Tests-only: [44534672142](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44534672142) — SUCCESS, 11/11 test files and 119/119 tests, 0 failures (Vitest duration 282.80 seconds).
- Android debug: [44534672171](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44534672171) — SUCCESS; web build/typecheck, 119 tests, Capacitor sync, Gradle `assembleDebug`, checksum and signing verification all completed.

Previous exact code HEAD `14bd56848b8db429b9037880b08887af7118d61f` had 118/118 tests and a successful debug APK build. Those results do **not** certify the corrected target above.

## 2. Scope and implementation boundary

The intended DEV-005 runtime/test files are:

- `src/engine/types.ts`
- `src/engine/init.ts`
- `src/engine/save.ts`
- `src/engine/simulation.ts`
- `src/engine/systems/populationCohorts.ts`
- `tests/population-cohorts.test.ts`
- `tests/s0-save-determinism.test.ts` — two-line expectation update for the new explicit missing-save-state error.

The full GitHub compare from implementation base `3d1b8dd24427f2993d561eb0c555d6e0b30b1d5a` to audit target `0c171b9b615e4f91cce66749f8482837c8dfa9ef` reports 23 changed paths. The other 16 are concurrent governance/reporting documents, not additional runtime changes:

- Root: `AGENTS.md`, `AI_START_HERE.md`, `CLAUDE.md`, `README.md`.
- Audit/report: `docs/audit/s0/DEV005_POPULATION_COHORTS_CLAUDE_REVIEW_REQUEST_2026-11-19.md`, `docs/audit/s0/S0_B7_PACKAGE_SUMMARY_VI.md`, `docs/audit/s0/S0_B7_RESULTS.md`, `docs/audit/s0/S0_B7_REVIEW_REQUEST.md`, `docs/audit/s0/S0_RISK_REGISTER.md`, `docs/audit/s0/S0_SIGNOFF.md`, `docs/audit/s0/S22_CONTINUOUS_PROGRESS_REPORT_VI.md`.
- Coordination: `docs/coordination/AI_COLLABORATION_PROTOCOL.md`, `docs/coordination/AI_HANDOFF.md`, `docs/coordination/OWNER_EXECUTION_DIRECTIVE_2026-11-19.md`, `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`, `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md`.

The review request previously listed only six implementation paths and omitted the legacy B4 test-fixture change plus concurrent documentation paths. This must be corrected so Claude can distinguish the DEV-005 code scope from the complete base-to-target compare.

No historical runtime datasets, source registry, map geometry, media/assets, UI, economy recipe, employment/wage implementation, Android resources, Gradle, workflow definitions, signing configuration or secrets were changed by DEV-005.

## 3. State-flow and mutation audit

### 3.1 Initialization

`createGame()` constructs all regional aggregates, then calls `createPopulationState(st.regions)`. Initial economy calibration and politics initialization occur after the regions are present. The cohort projection is explicitly tagged `estimated` and uses only existing regional strata.

### 3.2 Monthly refresh coverage

The inspected population writers are:

- `populationMonth()`: birth/death, emigration/immigration and `shiftStrata()`.
- `revolutionCheck()` in the politics system: a regional POP reduction when a revolution is crushed.

Both execute inside the ordered `SYSTEMS` pipeline invoked by `stepMonth()`. `refreshPopulationState()` runs after every system has completed, including secession, events and AI. The regression that appends a late system mutating `Region.pop` tests this end-of-pipeline boundary.

The projection is **not** rebuilt when an arbitrary caller mutates `Region.pop` or `Region.strata` outside `stepMonth()`. Such mutations are not a supported public command path in the inspected engine flow; any future editor, scenario loader or out-of-band population command must either call the refresh function or move through a single population write boundary. Save serialization deliberately rejects a stale projection rather than silently repairing it.

### 3.3 Authority and historical-data honesty

- `Region.pop` and `Region.strata` remain the runtime source of truth in this slice.
- One cohort is created per populated regional stratum.
- Culture/religion remain null; occupation is `unclassified`; qualification is `unknown`; age profile is absent.
- Cohort literacy, radicalism, wealth and income remain null. The bootstrap does not copy region-level aggregates into unsupported cohort-level attributes.
- This is not yet cohort-level birth/death, migration, needs, consumption, household wealth, hiring, wages, or cohort political influence.

This avoids false precision but does not deliver full Victoria 3 POP parity.

## 4. Save/load and validation observations

- The save envelope and `GameState.version` move from v1 to v2; `PopulationState.schemaVersion` is separately set to 1.
- v1 migration derives the transitional projection from existing regional POP/strata and does not consume RNG or access time, filesystem, network or external historical data.
- The migration mutates the in-memory object parsed from the save JSON; no caller-owned object is exposed to this helper. “Pure” in the code comment means deterministic/no external side effects, not immutable-input functional purity.
- v2 load requires a population payload and validates envelope metadata, region identities, canonical cohort IDs, supported attribution fields, finite positive size, regional mass and stratum consistency.
- Legacy fallback normalization remains for pre-existing optional state fields (market stats, construction queues/pools, employment and wages). Reviewers should distinguish this compatibility normalization from the fail-closed handling of missing/inconsistent v2 population state.
- The implementation has not yet separated engine version, save-schema version and data-build hash into independent envelope fields; this was explicitly listed for reviewer disposition.

## 5. Design deviations and remaining review questions

### D1 — fractional person-equivalent size

`PopulationCohort.size` is a finite fractional number, preserving the legacy engine's continuous POP arithmetic. The data-model proposal ultimately specifies non-negative safe-integer headcounts and deterministic remainder handling. This is an intentional transitional deviation, not compliance with the final schema. My recommendation is to retain it only for this projection bridge; do not promote cohorts to authoritative simulation or implement cohort split/merge until the integer/fixed-point contract and deterministic mass-conservation strategy are separately approved and tested. Claude should explicitly accept or request changes.

### D2 — save/version envelope completeness

The slice uses one `GameState.version`/envelope version plus a separate population schema version. It does not add engine-version or data-build-hash compatibility checks. The current migration is bounded to v1→v2 and should not be represented as the final long-lived pack/save compatibility architecture.

### D3 — mobile performance evidence

The monthly rebuild allocates cohort objects and sorts the resulting list by canonical ID. With several thousand cohorts this may be acceptable, but there is no iQOO measurement, allocation/GC profile, memory peak, frame-time/ANR or thermal evidence. CI and desktop builds cannot substitute for physical-device profiling. Keep this as unverified; optimize only from measured evidence in its authorized stage.

### D4 — transitional model boundaries

The schema does not include age distribution, health, household/wealth distribution, needs satisfaction, employment assignment or source-level provenance per mutable cohort. This is deliberate for DEV-005, not a completed population subsystem. Static seed/method provenance and cohort-authoritative simulation remain future gated work.

## 6. Verification state

| Evidence | Result |
|---|---|
| Earlier exact HEAD `14bd56848b8db429b9037880b08887af7118d61f` tests-only | PASS, 118/118 tests; superseded by this correction |
| Earlier exact HEAD `14bd56848b8db429b9037880b08887af7118d61f` Android debug | SUCCESS; superseded as validation of the corrected source |
| Corrected audit target `0c171b9b615e4f91cce66749f8482837c8dfa9ef` tests-only run 44534672142 | PASS, 11/11 files and 119/119 tests |
| Corrected audit target `0c171b9b615e4f91cce66749f8482837c8dfa9ef` Android debug run 44534672171 | SUCCESS; `assembleDebug`, checksum and apksigner v1/v2 verification passed |
| Physical iQOO install/save-load/performance/thermal QA | NOT_TESTED |
| APK debug output | 18,052,034 bytes; SHA-256 `7a3c48b9761878111263c97fe39ca3fbad4026f82babb08bf78801b92174a528`; signer certificate SHA-256 `167f48e563b68c4aa12470941204b43936a8b218eccb54bc598738d52479bb7e`; V1/V2 true; apksigner exit 0 |
| Claude independent review | PENDING |
| Owner acceptance | PENDING |

Do not treat this self-audit as an independent review. Do not mark DEV-005 fully accepted, S0 PASS, S1 accepted, or any S7–S23 phase open because of this report.
