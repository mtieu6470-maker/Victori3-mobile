# CG-11 — Independent critique of CLOCK-01

- Reviewer: ChatGPT, Independent Technical Lead
- Review date: 2026-11-22
- Branch reviewed: `ccr-b27f3fb8-epfpd6`
- Scope: calendar, pacing, governor, simulation scheduler, save v1/v2→v3 migration, controller lifecycle and the supplied CLOCK-01 tests.
- Mode: advisory / no production-code edits.
- Verdict: **NOT READY FOR ACCEPTANCE without fixes to backlog accounting and background fast-forward cancellation.** Calendar arithmetic and the tested v2→v3 boundary migration are generally sound, but the runtime has lifecycle and accounting gaps.

## 1. Findings

### CG11-01 — Backgrounding does not cancel an active Fast Forward
- Severity: **P1 — correctness / lifecycle**
- Files/lines:
  - `src/ui/game/controller.ts:55-59` — `onBackground()` returns when `this.busy` is truthy.
  - `src/ui/game/controller.ts:93-119` — `fastForward()` keeps running its loop and only yields every six completed months; it checks `operationToken`, but backgrounding never increments that token.
- Reproduction:
  1. Start a campaign and invoke `fastForward(120)`.
  2. After the first chunk starts, background the app / make `document.hidden === true`.
  3. `onBackground()` returns because `busy` is set. The operation remains valid and resumes after its timer yield; when the WebView is throttled/frozen and later resumed, remaining months continue without a player resume action.
- Impact: violates the stated lifecycle contract that simulation pauses in background and only resumes after explicit player action. It also means backgrounding during a long operation is not a reliable pause boundary.
- Required correction: background must invalidate/cancel the active operation even when busy, mark a lifecycle pause, and ensure the fast-forward loop checks cancellation after every yield and before every monthly step. Its `finally` block must not restore `wasPaused=false` after lifecycle cancellation. Prefer an explicit operation cancellation reason/token rather than overloading `busy`.

### CG11-02 — Changing speed silently truncates owed simulation hours
- Severity: **P1 — deterministic-time accounting**
- Files/lines:
  - `src/ui/game/controller.ts:153-162` — `setSpeedSetting()` clamps `pace.backlogHours` with `Math.min`.
  - `src/ui/game/controller.ts:203-214` — after a governor rate switch, `tickFrame()` also clamps backlog to the new maximum.
  - `src/engine/clock/pace.ts:53-55, 90-99` — backlog capacity is rate-dependent; `creditElapsed()` correctly records overflow as dropped real time, but the two controller-side clamps do not.
- Reproduction A (manual rate change):
  1. At fixed 48 h/s, create a backlog of 40 owed hours by making simulation processing slower than frame credit.
  2. Change to fixed 3 h/s.
  3. The cap becomes 3 hours and 37 owed hours disappear without being processed or reflected in `droppedRealMs`.
- Reproduction B (AUTO fallback):
  1. At AUTO 12 h/s, allow backlog to reach 10–12 hours.
  2. Trigger three overloaded governor windows so effective rate falls to 6 h/s.
  3. The post-switch clamp silently discards the excess owed hours.
- Impact: the simulation itself does not skip an hour once requested, but the controller discards already-earned hours before they reach the engine. The visible lag metric also understates the loss. This contradicts the comments/spec claim that every owed hour is processed and that overload slows the game rather than skipping work.
- Required correction: do not truncate owed backlog on rate changes. Either preserve existing debt independently of the new rate (with a separately bounded queue and explicit overload state), or convert discarded debt to a clearly reported dropped-time metric and revise the no-skipped-hours contract. Preferred behavior for the current design is preserve debt; cap incoming credit without deleting existing debt. Add regression tests for both manual 48→3 and AUTO 12→6 transitions.

### CG11-03 — Controller registers an unremovable document listener
- Severity: **P2 — memory/resource leak**
- Files/lines:
  - `src/ui/game/controller.ts:55-60` — constructor installs an anonymous `visibilitychange` listener without retaining its reference.
- Reproduction:
  1. Construct and discard multiple `GameController` instances while the document remains alive.
  2. Trigger `visibilitychange`.
  3. Every abandoned controller is still retained by the document listener and receives the callback.
- Impact: instances cannot be collected; duplicate callbacks and retained controller state accumulate if controllers are recreated by tests, hot reload, or future lifecycle wiring.
- Required correction: retain a stable listener reference and expose `dispose()` to remove it, cancel RAF, invalidate async operations, clear timers/listeners as appropriate. Ensure app-level singleton ownership calls dispose only when actually replaced.

### CG11-04 — Fast Forward is not bounded at the hour/frame level
- Severity: **P1/P2 — UI responsiveness; confirm on target device**
- Files/lines:
  - `src/ui/game/controller.ts:93-112` — fast-forward calls `stepMonth()` repeatedly and yields only after each six months.
  - `src/engine/simulation.ts:143-151` — `stepMonth()` loops through every canonical hour until the next monthly boundary and has no yield callback.
- Reproduction:
  1. Invoke `fastForward(6)` or more on a late-game save.
  2. Each six-month segment executes synchronously on the WebView/UI thread before the next `setTimeout(0)` yield.
- Impact: a single uninterrupted segment may include thousands of hourly scheduler iterations and six monthly system runs. Since the spec itself notes monthly simulation can take 150–300 ms on a phone, this can create long tasks and visible input/render stalls. This is not an engine determinism bug, but it weakens the claim that fast-forward is safely chunked.
- Required correction: make fast-forward call `advanceHours()` in small bounded chunks with a monotonic deadline / maximum hours per task, yield between chunks, and check the operation token and lifecycle state at every boundary. Keep month-boundary progress accounting separate from chunk size. Benchmark on the actual Android target before assigning a final threshold.

### CG11-05 — Calendar construction helpers normalize invalid inputs instead of rejecting them
- Severity: **P2 — API validation / edge-case safety**
- Files/lines:
  - `src/engine/clock/calendar.ts:55-68` — `daysInMonth()` indexes an array without validating month; `dayIndexOf()` and `hourOf()` pass unchecked fields to civil-date arithmetic.
- Reproduction:
  - `daysInMonth(2024, 13)` returns `undefined`.
  - `hourOf(2024, 2, 30, 0)` normalizes through arithmetic into a later date rather than rejecting an impossible February date.
  - `hourOf(2024, 1, 1, 24)` normalizes to the next day.
- Impact: current internal call sites pass valid constants, so this is not an observed in-campaign corruption. However, these exported helpers are easy to misuse in scenario/data ingestion and can turn invalid dates into valid-looking timestamps.
- Required correction: validate safe-integer year/month/day/hour, month range, day against `daysInMonth`, and hour 0–23; throw `RangeError`. Add invalid-month, invalid-day, invalid-hour and non-integer tests.

## 2. Areas reviewed with no confirmed defect in the current implementation

### Gregorian calendar and campaign terminal hour
- The civil-date conversion uses integer arithmetic and the Gregorian leap rule (divisible by 4 except centuries not divisible by 400).
- Existing tests cover 1836 leap, 1900 common, 2000 leap, weekday anchors, month-start round trips and final-hour formatting.
- `CAMPAIGN_FINAL_HOUR` is the valid 2026-12-31 23:00 state. `advanceHour()` returns false at that state, so the 2027-01-01 00:00 monthly boundary cannot run.
- I found no off-by-one defect in this terminal-hour path. Add a save/load round trip at the final hour and a direct test that `stepMonth()` from December 2026 leaves the state byte-identical.

### Save migration v2 → v3
- `migrateV2ToV3()` derives the hour from `monthStartHour(tick)`, rejects out-of-campaign ticks and inconsistent pre-existing clock fields, then validates tick/date consistency.
- The migration consumes no RNG and executes no simulation. This matches the old monthly model, where tick/date represented the next monthly boundary after the preceding monthly systems had run.
- Existing tests compare continuation against an uninterrupted run and verify RNG preservation.
- No confirmed migration defect found for the documented v2 monthly-save contract.
- Residual risk: current tests use ordinary early-game ticks. Add explicit v2 migration tests at tick 0, the final valid December 2026 tick, malformed tick types, and a round-trip after migration at campaign end.

### Determinism and cadence ordering
- `advanceHour()` advances one canonical hour and only mutates the world at declared cadence boundaries. Monthly systems retain their declared array order; yearly sampling runs after January monthly systems; population refresh runs last.
- Existing equivalence tests compare both game modes against the legacy monthly step for 14 boundaries and compare different hour chunk sizes.
- No confirmed order/RNG divergence found in the inspected path.
- Residual risk: `SYSTEMS`, `HOURLY_SYSTEMS`, `DAILY_SYSTEMS`, `WEEKLY_SYSTEMS` and `YEARLY_SYSTEMS` are exported mutable arrays. A runtime consumer or test can mutate the global execution order. Consider readonly/frozen registrations and explicit test-only injection.

### Governor thresholds and hysteresis
- The 3-window downgrade and 15-window recovery hysteresis are implemented as documented; fixed presets are not silently changed.
- The thresholds are explicitly provisional and there is no Android device evidence in the reviewed spec. They must not be treated as calibrated for the iQOO target.
- The controller-side backlog truncation in CG11-02 is the confirmed correctness defect associated with rate transitions. The threshold values themselves are a product/performance policy choice, not a determinism defect.

## 3. Recommended correction order

1. Fix CG11-01 background cancellation and ensure async Fast Forward cannot restart itself after lifecycle pause.
2. Fix CG11-02 backlog accounting; add tests proving no owed hours vanish on rate changes.
3. Bound Fast Forward chunks and yield at hour-level (or a small deterministic batch boundary); profile late-game on Android.
4. Add controller `dispose()` and listener cleanup.
5. Harden calendar input validation and add malformed-input tests.
6. Add final-hour save/load and final-tick v2 migration tests.
7. Run the full test suite and Android benchmark; record actual device, build, save fixture, thermal state, FPS/frame-time and measured thresholds.

## Open questions / conflicts

- The current spec says lifecycle hidden → pause and clear owed time; this is explicit for real-time pacing. It does not explicitly say whether an in-progress manual Fast Forward must cancel or may finish in the background. The user-facing promise says simulation does not run offline, so the safer interpretation is cancel/invalidate on background.
- The current spec says no hour is skipped, while controller-side rate-change clamps delete backlog. Decide whether the product contract is strict preservation of all accrued game-hour debt or explicit loss of real-time credit under overload. The UI must disclose whichever policy is chosen.
- `document.visibilitychange` may not cover every native Capacitor pause/process-death path. CLOCK-02b should subscribe to the native App lifecycle plugin and treat process death as a save/recovery event; do not rely on `onDestroy`.
- Governor thresholds cannot be accepted as tuned until tested on the target Android device. No Android benchmark was available in this review.
- No source-code edits were made by this critique.

## Recommended acceptance tests

1. Background during `fastForward(120)`: operation token invalidates; no more months advance after lifecycle pause; explicit resume does not auto-resume the cancelled operation.
2. Background while already paused: remains paused and does not create a spurious resume state.
3. Change fixed 48→3 with backlog 40: all 40 owed hours remain queued, or any intentionally dropped amount is explicitly reported and tested.
4. AUTO 12→6 while backlog exceeds 6: no silent truncation; debt accounting is exact.
5. Fast Forward yields within a bounded wall-time budget even when the next monthly boundary is expensive.
6. Repeated controller construction/disposal leaves exactly one active visibility listener and no RAF/timer from disposed instances.
7. `daysInMonth`, `dayIndexOf`, and `hourOf` reject invalid month/day/hour and non-integer inputs.
8. 1836-02-29, 1900-02-28, 2000-02-29 and 2026-12-31 23:00 round-trip correctly.
9. Save v3 at 2026-12-31 23:00 loads and remains terminal; no January 2027 event/system runs.
10. V2 migration at tick 0 and the final valid campaign tick preserves date, RNG and continuation semantics.
11. Historical and sandbox modes remain byte-identical to legacy monthly execution at the tested monthly boundaries.
12. Full CI test suite and target-device benchmark pass before CLOCK-01 is marked release-ready.
