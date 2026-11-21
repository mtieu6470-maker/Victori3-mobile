# CG-12 — Independent re-review of Claude's CLOCK-01 fixes

- Review date: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Reviewed branch HEAD: `5e12b1e1a6fc3a88c5545e664f3c5873d9d6a6e0`
- Fix commit: `e79560841986b052e4834605f214eda165c82b78`
- Claude response: `docs/coordination/reviews/CLAUDE_RESPONSE_CG11_CLOCK01_2026-11-22.md`
- Scope: verify all five accepted CG-11 fixes against current source and tests; report only remaining/new issues.
- Code changes by reviewer: none.

## Executive result

**4/5 CG-11 findings are adequately fixed in the inspected code; CG11-03 is functionally improved but its new `dispose()` contract is incomplete.** The original background cancellation, backlog truncation, hour-chunking and calendar-input defects appear corrected. One new P2 lifecycle defect remains: a disposed controller can be used again to restart simulation or create new asynchronous work. There is also a documentation/test-coverage gap around the now conditionally unbounded backlog.

The branch response reports local `tsc`, 185 tests and build passing. GitHub combined commit status for the current branch HEAD returned no status entries in the inspected response; this review does not independently claim a new CI run or an Android benchmark.

## 1. Verification of CG-11 fixes

### CG11-01 — Background must cancel active Fast Forward
**Result: ACCEPTED / FIX VERIFIED**

- Source: `src/ui/game/controller.ts`, `onBackground()` and `fastForward()`.
- `onBackground()` now detects `busy`, increments `operationToken`, clears `busy`, sets `pausedByLifecycle`, pauses, stops RAF and resets pace.
- The asynchronous loop checks the token before every chunk; its `finally` block restores state only if the token and game-state identity still match.
- Regression test: `tests/controller-fast-forward.test.ts`, test `CG11-01: backgrounding cancels an active fast-forward and never auto-resumes it`.
- I found no remaining defect in this cancellation path. The test verifies cancellation after the first yielded chunk and verifies no auto-resume.

### CG11-02 — Changing speed must not delete owed hours
**Result: ACCEPTED / FIX VERIFIED**

- Source: `src/ui/game/controller.ts`, `setSpeedSetting()` and governor transition path; `src/engine/clock/pace.ts`, `creditElapsed()`.
- The two controller-side backlog clamps are removed.
- `creditElapsed()` computes room for new credit as `max(0, cap - backlog0)`; existing backlog remains untouched when it exceeds the new rate's cap.
- Refused new whole-hour credit is reflected in `droppedRealMs`, which the controller forwards to the governor as a per-frame delta.
- Regression test: `tests/clock-pace.test.ts`, `CG11-02`, covers 48→3 with 40 owed hours and AUTO 12→6 with 11 owed hours.
- No silent deletion of existing whole-hour debt found.

**Non-blocking contract mismatch:** `PaceState.backlogHours` is still commented as a “bounded backlog” and `MAX_BACKLOG_SECONDS` is described as bounding the backlog, but the accepted policy intentionally permits existing backlog to exceed the current cap after a rate drop. The cap now bounds *newly accepted credit*, not total backlog. Update the comments and any consumer/UI assumption so the invariant is explicit. This is a documentation/type-contract correction, not a confirmed runtime defect.

### CG11-03 — Visibility listener cleanup / controller disposal
**Result: PARTIAL / NEW P2 FINDING — see §2**

- Stable `onVisibility` reference is present.
- `dispose()` is idempotent, invalidates the current operation, stops RAF, removes the document listener and clears subscribers.
- Regression test verifies the same listener reference is removed exactly once.
- However, the object remains callable after disposal. No public mutator, `subscribe()`, `fastForward()`, `newGame()`, `load()` or `setPaused()` checks `disposed`; `start()` also has no disposed guard. See CG12-01.

### CG11-04 — Fast Forward must yield at hour-granular chunks
**Result: ACCEPTED / IMPLEMENTATION VERIFIED WITH A TEST LIMITATION**

- `fastForward()` now calls `advanceHours()` with a deadline based on `FAST_FORWARD_CHUNK_MS = 12`, and yields with `setTimeout(0)` after each incomplete chunk.
- `advanceHours()` checks `shouldYield` between hours. The monthly-boundary system execution remains indivisible, as explicitly documented and deferred to CLOCK-02 worker work.
- This is a meaningful improvement over six-month synchronous blocks.
- Test limitation: `tests/controller-fast-forward.test.ts` mocks `advanceHours()` to advance exactly one month per call and ignores the supplied `shouldYield` callback. It proves controller yield/invalidation sequencing but does **not** prove the 12 ms deadline or hour-granular interruption. The actual `advanceHours()` implementation does check the callback between hours, but a controller-level test with a deterministic fake clock/slow hourly loop would better protect this contract.
- No new production defect confirmed from the inspected implementation.

### CG11-05 — Invalid calendar inputs must be rejected
**Result: ACCEPTED / FIX VERIFIED**

- `daysInMonth()` rejects non-safe-integer year/month and month outside 1–12.
- `dayIndexOf()` validates day against the actual month length.
- `hourOf()` rejects hour outside 0–23.
- Regression test `tests/clock-calendar.test.ts` covers invalid month/day/hour, leap-year boundaries and valid 1836/2000 leap days.
- No remaining defect found in the reviewed validation path.

## 2. New finding

### CG12-01 — Disposed GameController can be restarted and used again
- Severity: **P2 — lifecycle/resource leak / stale-owner correctness**
- Files/locations:
  - `src/ui/game/controller.ts`: `dispose()` sets `this.disposed = true`, but `subscribe()` and public operations do not reject a disposed instance.
  - `src/ui/game/controller.ts`: `fastForward()` has no `disposed` guard.
  - `src/ui/game/controller.ts`: `setPaused(false)` can call `start()`; `start()` checks only campaign completion and whether RAF already exists, not `this.disposed`.
  - `src/ui/game/controller.ts`: `newGame()` and `load()` also remain callable after disposal.
- Reproduction:
  1. Construct a `GameController`, attach a game state, and call `dispose()`.
  2. Call `setPaused(false)`.
  3. The method sets `paused = false` and calls `start()`; `start()` schedules a new RAF even though the visibility listener has been removed and the instance was declared disposed.
  4. Alternatively call `fastForward(12)` after disposal; the operation can mutate the game state and schedule yields.
  5. Alternatively call `subscribe(fn)` after disposal; the listener is retained in a set that will no longer be notified by the owning UI and will not be cleared by a second `dispose()` because disposal returns early.
- Impact: stale components/references can resurrect simulation after teardown, reintroduce RAF work and retain subscribers. This defeats the intended terminal cleanup guarantee and can produce duplicate/orphaned controllers.
- Recommended correction:
  - Treat `dispose()` as terminal. Add a small `assertNotDisposed()` or early-return guard to every public state-changing/lifecycle entry point; at minimum guard `subscribe`, `newGame`, `load`, `fastForward`, `setPaused`, `setSpeedSetting`, `stepOnce`, `stepDay`, `tickFrame`, `toast`, `onBackground`, and `start()`.
  - Prefer `subscribe()` after disposal to return a no-op unsubscribe without storing the callback, or throw a documented error.
  - Add a regression test that disposes, then calls `setPaused(false)` and `fastForward()`; assert no RAF, timer, listener, emit or state mutation occurs.
  - Keep the guard in `start()` even if public methods are guarded; it is the final resource-allocation boundary.

## 3. Secondary cleanup recommendations (not blocking findings)

1. Track and clear toast timeout handles in `dispose()`. Current `toast()` schedules an anonymous 3.8-second callback that retains the controller and calls `emit()` after disposal. This is short-lived rather than a permanent leak, but a controller with explicit disposal should own its timers.
2. Update the `PaceState.backlogHours` and `MAX_BACKLOG_SECONDS` comments to distinguish the maximum newly credited backlog from previously accrued debt.
3. Add one controller test that exercises a deterministic advancing clock so `advanceHours` actually stops at the 12 ms deadline; current mock does not call `shouldYield`.
4. Keep Android benchmark and native Capacitor lifecycle hook as separate release gates, as Claude's response correctly states. Browser `visibilitychange` alone is not proof of Android process-pause/process-death handling.

## 4. Release posture

- CG11-01: verified fixed.
- CG11-02: verified fixed; clarify backlog invariant in comments.
- CG11-03: original listener leak fixed, but disposal is not terminal; CG12-01 remains P2.
- CG11-04: implementation improved and appears correct; controller test does not directly prove the deadline.
- CG11-05: verified fixed.
- CLOCK-01 remains **not release-ready** pending CG12-01 decision/fix, Android device benchmark, and native lifecycle integration (CLOCK-02b).

## Open questions / conflicts

- Should post-dispose API use throw (fail fast) or no-op (defensive lifecycle)? Pick one policy and apply consistently.
- Is the singleton `game` ever disposed in production, or is `dispose()` intended only for replaceable test/component instances? Even if singleton ownership makes misuse unlikely, the public method currently promises a cleanup lifecycle without enforcing terminality.
- Android lifecycle pause/process death is still not established by this browser visibility listener.
- The 12 ms fast-forward budget cannot bound the time spent inside one monthly boundary; this is explicitly accepted as a temporary limitation until worker migration.

## Recommended acceptance tests

1. After `dispose()`, `setPaused(false)` must not schedule RAF.
2. After `dispose()`, `fastForward()` must not mutate state or schedule a timer.
3. After `dispose()`, `newGame()`/`load()` must follow the chosen throw/no-op policy and must not emit.
4. `subscribe()` after disposal must not retain a callback.
5. Pending toast timers are cleared or safely ignored after disposal.
6. A controller-level fake-clock test demonstrates yielding after the configured budget between hourly engine steps.
7. A backlog greater than the current cap remains owed after a rate transition and is drained without truncation.
8. Re-run typecheck, complete test suite and build; then run CLOCK-BENCH-ANDROID on the target Android device.
