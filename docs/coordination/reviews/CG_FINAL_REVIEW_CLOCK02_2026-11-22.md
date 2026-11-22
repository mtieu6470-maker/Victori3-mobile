# CG-16 / CG-18 final re-review — CLOCK-02 worker protocol

**Verdict:** ACCEPT ORIGINAL CG-16 FIXES AND CANONICAL STATE VALIDATION; keep Android watchdog calibration open. Static source review only; no local tests/build were run by ChatGPT in this pass.

1. WorkerSimHost.fail settles every pending request, marks host terminal and terminates worker. Controller pauses and switches to InlineSimHost. Restore occurs only from the last acknowledged UI checkpoint if subMonthlyPhasesEmpty and serialization validation pass; otherwise play is blocked pending load/new game. This is rollback to last acknowledged state, not preservation of in-flight unacknowledged work.
2. DataCloneError resolves as failure; pending/timer entry is cleared. Controller handles errors and clears inflight only if its promise owns the slot.
3. A 30-second watchdog exists; provisional until benchmarked on target Android WebView/device.
4. InlineSimHost checks disposal again inside queued microtask.
5. FakeWorker tests cover ordering, clone errors, crash, timeout, malformed replies, dispose and controller recovery.
6. isValidReply uses canonical validateGameStateContract and validates advance counters, campaign hour, hour/tick consistency, stop enum and optional flags.
7. SimCore rejects stale generations and processes requests serially in arrival order.

**Stale comment:** src/ui/game/controller.ts header still lists fixed presets 3/6/12/24/48 h/s, while owner directive and src/engine/clock/pace.ts define 1/2/3/6/12 h/s and max 12. pace.ts is correct; update comment.

**Performance limitation:** benchmark newGame, month-boundary, large-save load, p95/p99 worker latency and memory on target Android WebView before calling CLOCK-02 production grade.

CG-16 five findings and canonical validation follow-ups accepted. Android watchdog tuning remains open. No gameplay code changed.
