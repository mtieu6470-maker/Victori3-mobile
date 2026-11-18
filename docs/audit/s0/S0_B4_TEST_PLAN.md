# S0-B4 — Save/load characterization test plan

**Task:** S0-B4 under owner decision OD-20261116-11  
**Status:** `IN_PROGRESS` — harness prepared; execution is still `NOT_TESTED`  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`  
**Audit branch:** `experiment/vic3-visual-upgrade`

## Scope and isolation

This task characterizes the existing save/load behavior only. It does not modify gameplay, simulation, RNG, the save serializer/deserializer, data, assets, or the save schema.

The tests-only workflow is `.github/workflows/s0-b4-tests.yml`. It is manual-dispatch only, uses `contents: read`, checks out the frozen baseline SHA, and overlays only the two B4 test files from the experiment branch. It runs Node dependency installation, generated-data preparation, TypeScript checking and the dedicated Vitest file. It does not run Vite production build, Capacitor sync, Gradle, Android SDK setup or APK assembly.

The workflow file is present on the default branch so GitHub exposes the manual workflow, and mirrored on the experiment branch. The existing Android APK workflow is unchanged. Audit commits use GitHub's documented skip annotation for push-triggered workflows so those commits do not invoke the APK workflow.

## Deterministic replay scenario

Scenario fixture: `tests/fixtures/s0-b4-scenario.ts`

| Parameter | Value |
|---|---|
| Baseline SHA | `2240a8f...` (full SHA recorded above) |
| Modes | Historical and Sandbox |
| Seed | `20261116` |
| Player | `GBR` |
| Total simulation | 24 months |
| Save checkpoints | K=6 (mid-year), K=12 (annual sampling boundary) |
| Player commands | Same fixed tax and budget commands in both branches |

For each mode/checkpoint, the test compares:

1. A continuous N-month simulation.
2. A same-seed simulation to K, serialized with the baseline's native save format, deserialized, then advanced to N using the same remaining command schedule.

The comparison covers the complete JSON-persisted `GameState`, including seed and RNG state. Object keys are canonicalized; arrays retain their original order. The test records the first differing state path and SHA-256 values for the save and initial/final states. Nontrivial-state guards verify the campaign advanced, countries and regions exist, the state changed from initialization, and player commands took effect.

## Save input characterization

The dedicated test records baseline behavior for malformed JSON, foreign format, unsupported version, missing state, and a legacy save without `marketStats`. Baseline `2240a8f` defaults absent `marketStats` to an empty object. It predates `constructionQueue`; the test explicitly checks that deserialization does not invent this later field.

## Execution and evidence

The manual workflow produces an artifact containing:

- Exact baseline and audit-source commit SHAs.
- Node/npm versions and SHA-256 hashes of the test fixture, test file and package lock.
- Generated `db.json` and `map.json` hashes.
- Logs and exit codes for `npm ci`, `npm run prepare-assets`, `npm run typecheck` and the dedicated Vitest run.
- Vitest JSON and test output, including state/save hashes and any first-difference path.

**No test result is claimed yet.** G0.6 remains `NOT_TESTED` until the owner starts the workflow from GitHub Actions with `experiment/vic3-visual-upgrade` selected and the resulting artifact is independently reviewed.

## Stop conditions

- Any reproducible difference between uninterrupted and resumed state is G0.6 `FAIL`; retain the state path, hashes, fixture and logs.
- Do not fix a failure in S0. Prepare the separate `PRE-S1-SAVE-DETERMINISM-REMEDIATION` proposal and wait for explicit owner authorization.
- Do not begin S1 or alter product code/save behavior as part of this task.
