# DEV-006 — Independent Claude review request: bounded monthly simulation clock

**Review mode:** no-write, independent code review  
**Target code commit:** `65bf85db91cbeaa276e00401e524749343ab305a`  
**Base code commit:** `e4182491161e61065e4ac15228c5f59a8832ad1d`  
**Current branch at packet creation:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Current documentation HEAD before this packet:** `ce6d17453bed0cce354b49bf85146451d7c1bf61`  
**CI target:** exact code SHA `65bf85db91cbeaa276e00401e524749343ab305a`  
**Owner authority:** routine technical execution was delegated to ChatGPT; this packet requests review only and does not request a phase transition or owner acceptance.

## 1. Review objective

Independently determine whether the DEV-006 scheduler correction reliably prevents runaway monthly simulation speed and post-background catch-up bursts without introducing clock regressions, UI inconsistencies, or lifecycle defects.

The review is deliberately limited to the bounded monthly clock implementation. It does not authorize a daily-tick conversion, simulation-system cadence changes, performance/Worker work, or other gameplay changes.

## 2. Exact scope

Review the following runtime/test files in the target commit:

- `src/ui/App.tsx`
- `src/ui/game/controller.ts`
- `tests/monthly-clock.test.ts`

Documentation changes in the same commit are context only. Do not broaden the review to unrelated historical/gameplay systems.

## 3. Implementation under review

- Real milliseconds per simulated month: speed 1–5 = 8,000 / 5,000 / 3,500 / 2,500 / 2,000.
- `consumeClockElapsed(accumulatorMs, elapsedMs, intervalMs)` sanitizes non-finite/negative values, caps accumulated time at one interval, emits at most one month, and discards excess elapsed time.
- The animation-frame loop calls `stepMonth()` only when the helper says one interval elapsed.
- Changing speed resets partial accumulation and the wall-clock baseline.
- The top-bar tooltip reports the active real-time interval per simulated month.
- Four focused tests cover monotonic positive intervals, exact threshold crossing, a 60-second stall, and invalid/negative input handling.

## 4. Required reviewer checks

1. **Clock arithmetic:** prove the helper cannot emit more than one month per callback, accumulate unbounded debt, or emit a month early for finite/invalid inputs.
2. **RAF integration:** inspect timestamp origin/units, first-frame behavior, speed changes, pause/resume, no-game state, callback cancellation and any stale callback edge case.
3. **Background/visibility behavior:** verify throttled or suspended tabs cannot create catch-up bursts; assess whether intentionally discarding elapsed time is consistent with the stated product contract.
4. **Fast-forward interaction:** confirm the interactive scheduler and `fastForward()` cannot concurrently advance the same state or create unexpected duplicate ticks.
5. **UI consistency:** ensure displayed speed and tooltip always correspond to the actual scheduler interval and no stale speed state can be used.
6. **Test adequacy:** identify missing deterministic tests, especially controller-level pause/resume/speed-switch behavior, and any browser lifecycle case that can be tested without a physical device.
7. **Performance and determinism:** check that this wall-clock policy does not alter engine RNG/order semantics except by limiting when monthly steps are invoked.
8. **Product semantics:** challenge whether the selected intervals are defensible as five distinct speeds; identify any misleading claim. Do not silently substitute a daily clock.

## 5. CI evidence for the exact target

- Tests-only workflow [44754295188](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295188): SUCCESS; 42/42 test suites, 126/126 tests, zero failures/pending.
- Android debug workflow [44754295107](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44754295107): SUCCESS; web/data build, unit/simulation tests, Capacitor sync and Gradle `assembleDebug` all completed.
- APK artifact ID `14636409648`, 18,052,303 bytes; APK SHA-256 `b73eab755d53aabaae3192041296282343b1a442236232bb147d794e31de37fa`.
- Debug signing only; no production signing.
- Physical Android QA: NOT_TESTED. No install, upgrade, save/load, lifecycle, thermal or device performance evidence is claimed.

## 6. Known limitations and explicit non-goals

- Engine calendar remains monthly: `GameDate` contains year/month and `stepMonth()` advances one month.
- This patch is a scheduler-rate hotfix, **not** a Victoria 3-style daily simulation.
- Daily scheduling requires a separate reviewed cadence contract for economy, POP, politics, secession, technology, diplomacy, military, events, AI, annual sampling, RNG ordering and save compatibility.
- Do not implement daily ticks, change engine tick units, alter save schema, tune unrelated system formulas, or change phase/gate status as part of this review.
- Existing S0/S1/S22 gate verdicts remain unchanged. Review verdict applies only to DEV-006.

## 7. Required response

Return exactly one bounded verdict: **REVIEW_PASS** or **CHANGES_REQUESTED**.

For every finding, include severity, exact file/line or symbol, reproducible scenario, impact, and a bounded correction recommendation. State the exact SHA inspected and confirm no files were modified. If no issue is found, explicitly state the remaining test/device limitations and that owner acceptance is still pending.
