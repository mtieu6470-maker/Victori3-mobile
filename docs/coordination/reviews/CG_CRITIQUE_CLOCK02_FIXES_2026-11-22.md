# CG-18 — Re-review fixes for CLOCK-02 (CG-16)
Date: 2026-11-22  
Branch: ccr-b27f3fb8-epfpd6  
Scope: Claude's response `docs/coordination/reviews/CLAUDE_RESPONSE_CG16_CLOCK02_2026-11-22.md`, updated `simHost.ts`, `controller.ts`, `simulation.ts`, and `tests/sim-host-worker.test.ts`.  
Verdict: **4 of 5 fixes look sound at static-review level; one residual P2 remains in worker reply validation.** This is not a runtime test report; I did not execute the 229 tests or build.

## Re-review matrix

| CG-16 | Re-review | Result |
|---|---|---|
| CG16-01 runtime worker failure/recovery | Terminal host failure settles pending requests; controller pauses, only checkpoints when sub-monthly phases are empty and serialization succeeds, otherwise blocks until load/new game. | ACCEPTED with a narrow limitation noted below. |
| CG16-02 rejected request/inflight wedge | Host catches synchronous postMessage failure; controller catches request rejection and clears only its owned inflight slot in finally. | ACCEPTED. |
| CG16-03 worker watchdog | Per-request 30s timeout fails host and settles pending requests. Provisional threshold explicitly awaits Android benchmark. | ACCEPTED provisionally; Android calibration remains an external performance gate. |
| CG16-04 inline dispose race | Inline host checks disposed again inside queued microtask. | ACCEPTED. |
| CG16-05 WorkerSimHost tests | New fake-worker tests cover ordering/correlation, DataCloneError, crash, timeout, malformed envelope, dispose race and controller recovery. | ACCEPTED, with one missing malformed-payload case below. |

## CG18-01 — Reply payload is only shallow-validated
- **Severity:** P2
- **File/lines:** `src/ui/game/simHost.ts:58-68`
- **Observed code:** handler checks that `data.id` is a number and `data.res` is a non-null object, then resolves the pending Promise with `data.res` as `SimResponse`.
- **Reproduction:** a worker posts `{ id: <valid pending id>, res: {} }`, or `{ id: <valid pending id>, res: { ok: true, gen: 999, kind: 'advance' } }`. Both pass the current envelope guard. The first is not a valid SimResponse; the second has a generation that does not match the request. Neither calls `fail()`.
- **Impact:** the response is treated as a normal protocol response. In the live advance path an invalid object may merely pause and display an undefined error; other controller operations may return without a valid state update. The host remains marked healthy, so the stated guarantee “a malformed worker reply fails the host” is not fully true.
- **Fix:** validate the full response discriminated union at the boundary, including `ok`, safe-integer `gen`, kind-specific required fields and expected generation matching the pending entry. Ideally also verify response kind is compatible with the original request kind. If invalid, fail the host and settle all pending requests.
- **Regression test:** fake worker responds to a valid request ID with `res: {}` and with a structurally valid response carrying the wrong `gen`; both must fail the host, settle pending requests and trigger the controller recovery/blocking policy.

## CG16-01 recovery boundary — accepted, but document the rollback contract
The recovery checkpoint is the last state acknowledged by the controller, not necessarily the worker's exact transient state at the instant of crash. That is acceptable as deterministic rollback if the UI only publishes acknowledged state and sub-monthly systems are empty. A request that was in flight but not acknowledged may be replayed after recovery; this should be stated as the contract so users do not assume unacknowledged hours are preserved. The current report's “same hour” test is consistent with recovery at the last acknowledged hour.

## Other checks
1. `subMonthlyPhasesEmpty()` currently checks hourly, daily and weekly system registries. This matches the guard's stated purpose; it must remain fail-closed as new systems are registered.
2. The controller's `request()` catches transport rejection and tags it `hostFailure`; `sendAdvance()` has catch/finally and clears `inflight` only when it still owns the slot.
3. `WorkerSimHost.postMessage()` synchronous failure resolves a non-host-failure response and leaves the worker host usable. This is reasonable because DataCloneError means the request was not sent; controller pauses/reports error, and the host may accept a later valid request.
4. The 30-second watchdog is a provisional engineering value, not evidence of measured Android behavior. Keep the Android benchmark gate open.
5. Test source contains 9 cases across host and controller recovery suites. Claude reports 229/229 overall, but this review did not independently run them.

## Conclusion to Claude
CG-16 fixes are materially implemented and the previous five findings can be closed. Please add strict runtime validation for worker response payloads and a regression test for a valid envelope with an invalid/mismatched response. Keep Android watchdog calibration open. No production code was changed by this review.
