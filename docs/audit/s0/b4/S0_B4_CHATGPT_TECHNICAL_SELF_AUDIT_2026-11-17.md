# S0-B4 ChatGPT Technical Self-Audit

**Date:** 2026-11-17  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Assessed handoff HEAD:** `0b915ff75c9dab1a1195ac648d3c68acfd073a9c`  
**B4 test implementation commit:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`

> **Status discipline:** This is a ChatGPT technical self-audit, not a second-party independent review. The reviewer authored the comparator change and therefore does not claim an independent `REVIEW_PASS`. No owner acceptance or phase transition is implied.

## 1. Scope and evidence inspected

The audit was limited to S0-B4 test and evidence quality. No product source, engine, RNG, save implementation/schema, generated data, assets, Android resources, or CI workflow was changed.

Reviewed:
- `docs/coordination/AI_HANDOFF.md` and `docs/coordination/AI_COLLABORATION_PROTOCOL.md` at the assessed handoff HEAD.
- `tests/s0-save-determinism.test.ts` and `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md`.
- Baseline `src/engine/types.ts`, `init.ts`, `save.ts`, `core.ts`, and `simulation.ts` at `2240a8f`.
- `.github/workflows/android-apk.yml` at the assessed handoff HEAD.
- GitHub compare metadata, CI job/step summaries, CI job log, and workflow artifact metadata for run [44032178418](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44032178418).

Git range checks:
- Baseline `2240a8f` to B4 implementation commit `e4924ca`: 22 commits. The changed-path response contains audit/documentation files, the B4 test file, and the previously authorized B1 workflow instrumentation; it contains no `src/engine/**` path.
- B4 implementation commit `e4924ca` to assessed handoff HEAD `0b915ff`: five later commits. The compare result lists only `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md` and `docs/coordination/AI_HANDOFF.md`; the B4 test source was not changed after `e4924ca`.

The audit did not locally execute tests or build the application. Test/build claims below are based on the recorded GitHub Actions run and logs.

## 2. Positive findings

### 2.1 Save/load determinism evidence

Run `44032178418`, job `133866471284`, checked out exact code HEAD `e4924ca48264f8d0818eface51a28a87cd363b89`. GitHub reports the job as `completed / success`. The job log records:
- Four determinism cases: Historical and Sandbox, each saved at tick 6 and tick 12, then continued to tick 24.
- Seed 21, player GBR, three scripted commands, identical data/map hashes for the paired runs.
- All four cases report `MATCH`, `firstDifferingPath: null`, and equal uninterrupted/save-load final SHA-256 values.
- Vitest exit code 0 and `report_valid=true`; the handoff records 69/69 tests and 26/26 suites passed.

The final-state hashes recorded in the log are:
- Historical: `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`.
- Sandbox: `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`.

The B4 test compares the full `GameState`, including RNG, and does not sort arrays. The non-vacuity checks require tick progression, populated regions/countries, system counters, three successful commands, and a change in RNG/economy/population. These are meaningful safeguards against an empty or inert test.

### 2.2 Country.group and JSON save behavior

At the product baseline:
- `Country.group` is optional (`group?: string`) in `src/engine/types.ts`.
- Country construction assigns `group: e.group` in `src/engine/init.ts`, so an undefined source value can create an own property whose value is undefined.
- `src/engine/save.ts` serializes the state with `JSON.stringify` and restores it with `JSON.parse`. JSON serialization omits an object property whose value is undefined.

That explains the `countries.ABD.group` representation difference observed by the first B4 run. The handoff reports a scan across all 22 engine TypeScript files for reflection-based dependence on the distinction (ownership checks, `in`, `Object.keys`, or equivalents), with no usage found. This self-audit rechecked the type, initialization and save paths, but did not independently reproduce that full 22-file scan. Subject to that recorded scan, treating an undefined-valued `group` property as absent is consistent with the persisted JSON representation.

### 2.3 Ordinary JSON semantics already handled correctly

The current comparator correctly:
- omits object properties whose value is `undefined`;
- converts undefined array entries and holes to `null` without moving their positions;
- sorts object keys for stable object comparison;
- preserves array order and reports the first differing array index.

## 3. Findings requiring correction in the test harness

These findings concern audit/test fidelity. They do not authorize changing product behavior.

### B4-SA-01 — Missing-RNG characterization is logged but not asserted

**Severity:** P2 — test coverage gap  
**Location:** `tests/s0-save-determinism.test.ts:316-339`

The test asserts that the deserialized RNG is undefined. It then catches the continuation error, stores `continuation` and `errorName`, and prints them to the CI log. It never asserts that continuation throws or that the error is a `TypeError`.

The current CI log does show:
`oneMonthContinuation: "throws"` and `errorName: "TypeError"`.
However, if a later change caused the malformed state to continue without throwing, the test would still pass. The test therefore does not lock down the behavior it claims to characterize.

**Required test-only correction:** retain the current deserialize observation and add explicit expectations that the current baseline continuation result is `throws` and the error name is `TypeError`. Do not change `deserialize`, RNG code, or engine behavior in S0. If the desired future contract changes, that must be a separately authorized product change with its own tests.

### B4-SA-02 — Comparator is not fully equivalent to JSON serialization for special numeric values

**Severity:** P2 — comparator semantic gap  
**Location:** `tests/s0-save-determinism.test.ts:67-84` and `:94-125`

The hash path calls `JSON.stringify(canonicalize(state))`, so JSON itself converts non-finite numbers to `null` and negative zero to `0`. But `firstJsonDifference` compares the canonicalized JavaScript values directly; it does not perform that final JSON normalization.

Consequences include false differences for values with the same persisted representation:
- `-0` versus `0`: `Object.is` reports a difference, while JSON serializes both as `0`.
- `NaN` or positive/negative infinity versus `null`: `Object.is` reports a difference, while JSON serializes each non-finite number as `null`.

The declared `GameState` contains many TypeScript `number` fields. TypeScript's `number` type does not enforce finiteness, and baseline `clamp` returns NaN unchanged. This audit has not established that a valid normal game run actually produces one of these values; it therefore does not claim that current production states contain them. The comparator should nonetheless either match the serializer's semantics or explicitly validate and reject non-JSON-safe values before comparison.

Function/symbol values and custom `toJSON` behavior are also part of general `JSON.stringify` semantics, but they are not represented in the declared plain-data `GameState` shape. They should not be described as observed product-state defects.

**Required test-only correction:** make the comparison normalization follow the actual JSON round trip, then recursively sort object keys while retaining array order. Add focused regression cases for `NaN`, `Infinity`, `-Infinity`, `-0`, undefined object properties, undefined array entries/holes, and array ordering. Alternatively, explicitly reject non-finite values before comparison, but that would be a different contract from silently comparing persisted JSON semantics and must be documented.

## 4. Missing-RNG and legacy-save observations

The CI log records:
- malformed JSON: `SyntaxError`;
- foreign save format: rejected;
- unsupported version 999: rejected;
- missing envelope state: `TypeError`;
- missing `marketStats`: defaulted to an empty object and one-month continuation did not throw;
- missing RNG: deserialization succeeded with `rng === undefined`, then continuation threw `TypeError`.

The first five behaviors are asserted in the test. The last one is only logged, as described in B4-SA-01. Missing RNG remains an observed compatibility/validation hazard. It must not be silently fixed in S0.

## 5. CI workflow and R14

At the assessed HEAD, `.github/workflows/android-apk.yml` runs on every push branch (`branches: ['**']`) and also supports `workflow_dispatch`. After the tests pass, the same job proceeds through Capacitor sync, `./gradlew assembleDebug`, APK checksum/signature recording and artifact upload.

For run `44032178418`, the fetched job steps confirm:
- Unit/simulation tests completed successfully.
- `Assemble debug APK` completed successfully.
- `dong-chay-lich-su-debug-apk` was uploaded as artifact ID `14304929645`, size 17,555,167 bytes, ZIP digest `sha256:6a6c9b49298950c8d096f0e7d4ceb1d4ed02120e4ba396d3c24a55499297034d`.
- CI evidence was uploaded as artifact ID `14305343860`, size 103,182 bytes, ZIP digest `sha256:bd84e0219336c206aff3a8ba4e8f9b3d8469e6b6b3146ffd701b2248cd75cebe`.

These are ZIP artifact digests, not the APK file SHA-256. Neither artifact was downloaded by this reviewer. No APK was installed or tested on the iQOO device. R14 remains unverified; the CI build is not device evidence and does not satisfy R14.

No workflow edit is authorized by the current S0-B4 scope. A `[skip ci]` documentation commit avoids triggering this push workflow, but it also skips CI checks; it is not a substitute for a tests-only CI path. To run future B4 harness corrections without producing another APK, the owner must authorize a workflow design change or a dedicated tests-only workflow outside the current S0 restrictions. Do not invoke `workflow_dispatch` on the existing APK workflow during this gate.

## 6. Required next action and bounded conclusion

1. Correct B4-SA-01 and B4-SA-02 in the test harness only, after an owner-authorized CI path exists that does not create/upload an APK. Do not edit engine, RNG, save implementation/schema, or workflow under the present authorization.
2. Preserve the four existing determinism results as valid evidence for the exact tested baseline/build; do not overstate them as device or product acceptance.
3. Obtain a genuine second-party review of the corrected test/evidence package, and then the owner's explicit `ACCEPTED` decision.
4. Keep B7 `NOT_STARTED` until both conditions are recorded.

**Initial technical self-audit conclusion (at HEAD `0b915ff`):** `CHANGES_REQUESTED` because of B4-SA-01 and B4-SA-02. The follow-up correction below records that both test-harness findings have since been addressed in source. This is not a second-party independent review verdict and does not change B4 to `REVIEW_PASS` or `ACCEPTED`. Project Vitest/CI validation and the genuine independent review remain pending; B7 remains `NOT_STARTED`.


## 7. Follow-up correction applied — 2026-11-17

**Current code commit:** `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`  
**Current branch:** `claude/game-historical-sandbox-modes-kg7rj7`

The two bounded findings were corrected in `tests/s0-save-determinism.test.ts` only:

- **B4-SA-01:** the missing-RNG characterization now captures the continuation error and explicitly asserts both `instanceof TypeError` and the `TypeError` name. It still records the current baseline failure; no engine, save, or RNG behavior was changed.
- **B4-SA-02:** added `jsonRoundTrip()`, which normalizes operands through `JSON.stringify/JSON.parse` before recursive object-key canonicalization and first-difference comparison. Regression cases cover `NaN`, positive/negative infinity, `-0`, non-finite/undefined array entries, and retained array ordering.

**Validation performed:** an isolated Node.js smoke script reimplemented the exact JSON-normalization/comparison helper and passed 8 assertions covering the new and existing cases. This is a narrow helper-level check, not a run of this repository's Vitest suite.

**Validation not performed:** the project Vitest suite, build, and GitHub CI were not run for this commit. The commit message includes `[skip ci]` to avoid triggering the existing `android-apk.yml` workflow, which proceeds to `assembleDebug` and APK upload. No workflow change was made under the current S0 governance. Do not report the correction as CI-verified.

**Current disposition:** both source-level test-harness corrections are committed. B4 remains pending a real project test/CI run on a safe tests-only path, independent Claude review when available, and explicit owner `ACCEPTED`. No phase transition is authorized; B7 remains `NOT_STARTED`.


## 8. Follow-up CI workflow diagnosis and correction — 2026-11-17

This addendum supersedes only the earlier statement that a tests-only CI run had not yet been made. It does not change the original code-review findings or gate verdict.

### 8.1 Initial tests-only run

- Owner authorization: OD-20261117-12 approved a dedicated tests-only workflow, with no edits to the existing APK workflow and no APK build/package step.
- Tests-only run: [44039619132](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44039619132), event `workflow_dispatch`, exact `head_sha=08ec7a3bb485ab0457a99ef77ddeb8ed9a3122e0`.
- Job: `133890749856`, “Vitest (no build, no APK)”.
- `npm ci`: success.
- `npm run test:fast`: failed during suite collection. Six test files failed with `ENOENT` for `src/generated/db.json`; Vitest reports “Tests no tests”. Zero test assertions ran.
- No workflow artifacts were uploaded for this run (artifact list empty). The failed job did not run an APK packaging step.

### 8.2 Root cause

The repository's `.gitignore` excludes `src/generated/` and `public/generated/`. The test entry point `src/engine/node.ts` reads `src/generated/db.json` and `src/generated/map.json`; UI tests additionally read `public/generated/map.bin`. These files must be recreated on a clean GitHub runner.

`package.json` defines:
- `prepare-assets`: `npm run data && npm run map && npm run content`;
- `test`: `npm run prepare-assets && vitest run`;
- `test:fast`: `vitest run` only.

The first tests-only workflow incorrectly chose `test:fast` without first preparing the generated inputs. This was a CI workflow setup defect, not evidence of a failure in any B4 assertion. The run cannot be counted as a test pass or test failure for B4-SA-01/02 because no tests executed.

### 8.3 Correction committed

- Workflow correction commit: `56cdbf46fea6ed2909a59b4b3f1db596f4a32104`.
- File: `.github/workflows/b4-tests-only.yml` only, apart from the coordination handoff update.
- Workflow now runs `npm run prepare-assets`, followed by `npm run test:fast`.
- Push path filters now include tests, source, build/generator tools, historical data, map source assets, public assets, and package/configuration files.
- The workflow still does not run the Vite app build, Capacitor sync, Gradle, `assembleDebug`, signing, APK packaging, or artifact upload.
- Existing `.github/workflows/android-apk.yml` was not modified; its blob SHA remains `7a2639057272d2629f2d6b89cfc8fb07682dad31`.

The correction was committed with `[skip ci]` so the existing all-branches APK workflow would not run. The corrected workflow has **not yet been executed**. The available GitHub connector exposes workflow-run reads and reruns, but no workflow-dispatch write action; a fresh manual dispatch is therefore still required.

### 8.4 Current bounded disposition

B4-SA-01 and B4-SA-02 remain corrected in the test source, but the repository test suite has not yet been run against those corrections with the fixed tests-only workflow. No new conclusion can be drawn about the assertions from run `44039619132`. B4 remains `READY_FOR_REVIEW`; obtain the corrected CI run, genuine independent second-party review, and explicit owner `ACCEPTED` before any B7 work. B7 remains `NOT_STARTED`.


## 9. Corrected tests-only CI execution — PASS (2026-11-17)

This section supersedes the "not yet executed" status in §8.3. It does not supersede the status discipline or convert this self-audit into an independent review.

### 9.1 Exact run and job

- [GitHub Actions run 44041104723](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723)
- Event: `workflow_dispatch`; branch: `claude/game-historical-sandbox-modes-kg7rj7`.
- Exact checked-out HEAD: `d2ae88e557e9895413462c5b069886bfc606adc7`.
- Job: `133895641421`, “Vitest (no build, no APK)”; run conclusion: `success`.
- Successful steps: dependency installation, generated-data preparation, Vitest execution.

### 9.2 Test results

- `npm ci`: success.
- `npm run prepare-assets`: success. Data compiler: 274 entities (104 placeholder polities), 662 regions, 13 active alliances, 0 warnings. Map compiler: 8192×3868, 662 regions, 1,426 land borders, 423 sea links, 2,667 landmasses, 5,024 boundary lines, no single-cell regions. Content registry: 502 licensed asset records, 8,715,750 bytes; 176 flags, 99 coats of arms, 227 portraits.
- `npm run test:fast`: success.
- Vitest summary: **6 test files passed, 70 tests passed, 0 failures**; duration 80.59 seconds.
- Both new comparator regression tests passed.
- Missing-RNG characterization passed with the expected baseline observation: deserialization still accepts `rng=undefined`; one-month continuation throws `TypeError`. No product behavior was changed.

### 9.3 Save/load results

All four B4 characterization cases passed and logged `result= MATCH` (exact log uses `"result":"MATCH"`) with `firstDifferingPath=null`:
- Historical, tick 6 (1836-07): continuous/save-load SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`.
- Historical, tick 12 (1837-01): same matching SHA-256.
- Sandbox, tick 6 (1836-07): continuous/save-load SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`.
- Sandbox, tick 12 (1837-01): same matching SHA-256.

Each uses baseline product SHA `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`, seed 21, player GBR, 24 months and three commands. The generated database SHA-256 for this run is `4f4b1fef73aeae19a7fc3e26c2031740240f8306f19be08cf4805d2c1f0a25d6`; map SHA-256 is `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.

### 9.4 APK/build side-effect verification

- The run's artifact list is empty.
- Job steps contain no app build, Capacitor, Gradle, `assembleDebug`, signing, APK packaging or upload.
- The original `.github/workflows/android-apk.yml` remains unchanged; blob SHA `7a2639057272d2629f2d6b89cfc8fb07682dad31`.
- The range from B4 test correction commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` to tested HEAD `d2ae88e` changes only the tests-only workflow and documentation; the corrected test source is unchanged during the tested range.

### 9.5 Bounded conclusion

**Project CI validation for the corrected B4 test source: PASS.** This is execution/test evidence only. ChatGPT authored the correction, so this does not qualify as independent second-party `REVIEW_PASS`. B4 stays `READY_FOR_REVIEW` until a genuine independent reviewer returns a bounded verdict and the owner records `ACCEPTED`. B7 remains `NOT_STARTED`.


## 10. Post-B4 test-source reconciliation — baseline vs. current v2 save validation (20/11/2026)

A later review of the live branch found that the B4 test file received one test-only change after the frozen baseline CI run. The distinction is material to audit fidelity:

- Frozen baseline test source `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` has blob `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`. It is byte-identical to the test file at exact B4 tests-only checkout `d2ae88e557e9895413462c5b069886bfc606adc7`.
- Frozen baseline run [44041104723](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723) therefore remains valid for that exact baseline test harness: 6/6 files, 70/70 tests, four valid save/load MATCH outcomes, baseline missing-envelope-state TypeError, and missing-RNG continuation TypeError.
- Later commit `14bd56848b8db429b9037880b08887af7118d61f` changes only the missing-envelope-state assertion/name. The current test blob is `e3d960725e1e1b41fc4f63d303a5b5d36cdb6ad7`.
- The change aligns that assertion with the post-DEV-005 v2 `src/engine/save.ts` contract, which validates the state envelope and throws `Save state is missing or invalid`. The frozen 2240a8f implementation does not have this validation: it dereferences `o.state` and then `st.marketStats`, so the missing-state case throws native `TypeError`.
- The current v2 test-source version is exercised by exact-target runs [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664) and [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668) on `9604207`; the Android log shows the explicit-message test passing and 131/131 tests overall. This is current-code validation, not a second frozen-baseline B4 run.
- Required review treatment: assess the old file/run as the B4 baseline evidence and assess the later assertion/current CI as a separate post-baseline save-contract test update. Do not merge their behaviors into one claimed baseline result.
- No product code, historical data, save schema, APK workflow, or release behavior was changed by this reconciliation. This is a ChatGPT self-audit, not independent REVIEW_PASS. B4 remains READY_FOR_REVIEW; Claude's independent verdict and owner ACCEPTED remain pending. B7 remains READY_FOR_REVIEW; S1 remains NOT_STARTED.



## 11. Current-candidate save continuation result and test-log identity (20/11/2026)

## CURRENT CANDIDATE G0.6 CONTINUATION EVIDENCE — post-DEV-005 v2 save state (20/11/2026)

In addition to the frozen 2240a8f baseline characterization above, the current code candidate has now exercised the same four valid-save continuation cases on its own current engine/save implementation:

- **Exact candidate code/test commit:** `96042077abeef8b89fe9e46fdce97a2b566d70da`. Both exact-target workflows [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664) and [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668) have `head_sha=96042077abeef8b89fe9e46fdce97a2b566d70da` and `conclusion=success`. The Android workflow completed 44/44 suites and 131/131 tests; `report_valid=true`; Gradle `BUILD SUCCESSFUL in 1m 28s`.
- **Why these are current-code cases:** the test imports `createGame`, `serialize` and `deserialize` from the same checkout. At this candidate, `src/engine/init.ts` creates `GameState.version = 2`; `src/engine/save.ts` uses `SAVE_SCHEMA_VERSION = 2`. The four 24-month continuity cases therefore execute against the current v2 candidate, not a copied frozen baseline tree.
- **Current-candidate results in Android run 44765197668 / job 136387820204:**
  - Historical cut tick 6 and 12: both `MATCH`, `firstDifferingPath=null`, final state SHA-256 `9933f1310849ea8126171e515276b0ba7319bcba49586c1bb2d22706b8cea1c1`.
  - Sandbox cut tick 6 and 12: both `MATCH`, `firstDifferingPath=null`, final state SHA-256 `1fdde5dc52f4e902d3b45cd284fbace48eb36f7678ea93e411f14bf85eb10564`.
  - Current compiled DB SHA-256 `af1b44aca4379106ab2ff11837dc6c3d9c7da5646bb9741bda486ce27d368949`; map SHA-256 `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.
- **Log-label caveat:** the current test source still defines `BASELINE_PRODUCT_SHA = 2240a8f…` and emits it as `baselineProductSha`, while the suite title retains “baseline only”. That constant is a historical reference label, **not** the actual checkout identity. The authoritative current code identity is the workflow metadata `head_sha=9604207`. Do not use the JSON field as proof that the Android run checked out 2240a8f.
- The current candidate also retains the B4-R1 observation: a save with missing `rng` is accepted by deserialization and one-month continuation throws `TypeError`. This remains an explicit save-validation/migration risk, not a passing compatibility case.
- This gives a separate, current-candidate save/load continuation result alongside the frozen baseline run 44041104723. It does not change the historic baseline report, clear B4-R1, establish device backup/export safety, or constitute independent review/owner acceptance. Reviewer must assess whether the test/log labeling is sufficiently clear and whether this evidence meets the candidate-SHA G0.6 requirement in OD-20261116-11 §2.

