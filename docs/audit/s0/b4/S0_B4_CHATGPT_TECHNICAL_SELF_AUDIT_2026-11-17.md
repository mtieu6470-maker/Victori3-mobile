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
