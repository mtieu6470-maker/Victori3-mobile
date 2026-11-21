# CG-04 — Simulation cadence and Web Worker advisory

Research date: 2026-11-22. Dependency CLOCK-01 was not available at the expected paths in the inspected HEAD, so this is a design advisory, not a code critique. Victoria 3's internal subsystem tick schedule is not established by public sources collected here; proposed cadence is explicitly estimated.

## Owner clock constraints

The owner directive dated 2026-11-21 requires hourly canonical time, simulation independent of render FPS, monotonic wall clock, stable accumulator, deterministic event ordering, bounded catch-up and safe save/load. It does not require every expensive subsystem to run a full update every hour. Background/process uncertainty should pause and persist safely; do not claim offline progress.

## Proposed cadence mapping (estimated, not a Victoria 3 claim)

| Subsystem | Suggested cadence |
|---|---|
| Canonical clock, commands, scheduled events | Hourly boundary |
| Army/fleet movement | Hourly/event-driven substeps |
| Battles | Event-driven with bounded hourly progress |
| Supply shipment | Daily progress; hourly interruption check if required |
| Pop needs/consumption | Daily accumulation, monthly reconciliation |
| Birth/death/migration | Daily deterministic flow, monthly aggregation |
| Building production | Daily accumulation |
| Hiring/wage optimization | Weekly or monthly, profile-driven |
| Market price/order clearing | Event deltas + daily/weekly clearing; monthly audit |
| Construction | Daily progress; exact completion event |
| Law enactment | Daily progress and event at completion |
| IG/movement | Daily deltas; weekly AI planning |
| Diplomatic Play | Event deadlines + daily escalation |
| War Support | Event-driven deltas + daily settlement |
| Budget | Daily ledger, monthly close |
| Technology/journal | Daily progress, monthly evaluation |
| Elections/year transitions | Calendar event |

Claude should revise this table from actual domain requirements and profiling. Do not copy these estimates as verified Paradox internals.

## Web Worker on Android WebView

Verified MDN behavior:
- Worker has a separate execution context/heap and communicates via postMessage.
- Ordinary messages are structured-cloned, so complex state is serialized/deserialized and duplicated. Large object graphs can cost CPU and memory.
- ArrayBuffer can be transferred rather than copied; sender's buffer becomes detached.
- SharedArrayBuffer can share memory but adds concurrency/determinism/security complexity; not a default recommendation.
- Do not post the full GameState every tick. Send compact commands in; return deltas or bounded UI projections out.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects
- https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/structuredClone

## Suggested worker architecture

Worker owns authoritative simulation state; UI thread owns rendering/view models and sends commands. Use command sequence IDs and expected revision. Return coalesced snapshots/deltas at render cadence. Use transferables for large binary buffers only when ownership transfer is safe. Keep batches bounded and cancellable; tag jobs with runId/generation so stale results from a previous loaded game are discarded. Add backpressure so snapshots do not queue without limit. Save from a consistent canonical boundary.

## Android thermal/lifecycle

Android PowerManager exposes getCurrentThermalStatus() and addThermalStatusListener() from API 29. Thermal status is not CPU/GPU utilization; combine it with backlog, step duration, frame time and memory. The API reference documents the callback/listener and thermal headroom on newer Android versions.

Sources:
- https://developer.android.com/reference/android/os/PowerManager
- https://developer.android.com/reference/android/os/PowerManager.html

Use a Capacitor native bridge to read thermal status; no special runtime permission is documented for these PowerManager methods. Keep listener callback lightweight. Pause simulation on background by default, checkpoint before process death where possible, and never rely on onDestroy as the only save point.

## Open questions / conflicts

- CLOCK-01 spec and requested source files were not found at expected paths in inspected branch HEAD; exact implementation critique is blocked.
- Public patch notes do not establish Victoria 3's internal cadence per subsystem.
- WebView memory ceilings vary by Android version/OEM/process pressure; no universal numeric cap should be asserted.
- Thermal status is a governor input, not a substitute for profiling.

## Recommended acceptance tests

1. Same seed/commands/canonical hours produce identical state hashes at 12h/s and 6h/s.
2. Render FPS does not alter simulation results.
3. Worker batches are bounded and UI remains responsive.
4. Large snapshots do not clone full GameState per hour.
5. Detached ArrayBuffers are never reused.
6. Stale messages after load/new game are ignored.
7. Snapshot queue is coalesced/backpressured.
8. Thermal callback does not perform heavy work on main thread.
9. Background pauses and checkpoints; foreground resumes deterministically.
10. Process kill after checkpoint restores safely.
