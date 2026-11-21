# CG-08 — Android lifecycle, WebView and thermal API

Research date: 2026-11-22. Target architecture: Capacitor + Android WebView. This is platform research, not a claim that current code already implements these protections.

## 1. Android thermal API

Verified Android API:
- PowerManager.getCurrentThermalStatus() is available from API 29.
- PowerManager.addThermalStatusListener() is available from API 29.
- API 35 adds getThermalHeadroom() and getThermalHeadroomThresholds() on supported devices.
- These APIs expose system thermal state/headroom; they are not universal CPU/GPU utilization meters.
- The API reference does not document a special runtime permission requirement for these PowerManager methods.

Sources:
- https://developer.android.com/reference/android/os/PowerManager
- https://developer.android.com/reference/android/os/PowerManager.html

## 2. Capacitor bridge design

Create a small native plugin that obtains PowerManager from application Context, reads thermal status on demand, registers/unregisters OnThermalStatusChangedListener with plugin lifecycle, emits status changes to JS and returns explicit unsupported state on API <29. Do not poll aggressively. Listener callback should update a thread-safe snapshot and dispatch a lightweight event only; it must not run profiling, serialize GameState or perform simulation work on the main thread.

## 3. Lifecycle contract

- Pause simulation scheduling on background by default.
- Persist at canonical simulation boundaries, not only during onDestroy.
- On foreground, validate the last durable save, restore worker/runtime generation and resume only after integrity checks.
- Process death may occur without a reliable final callback. Autosave/checkpoint frequency must bound data loss.
- Do not assume background real-time progress. Any background mode needs explicit opt-in, battery/thermal analysis and separate tests.
- Unregister listeners and clear Activity/WebView references on plugin destroy to avoid leaks.

## 4. WebView memory and worker constraints

There is no single public fixed WebView heap ceiling guaranteed across Android/OEM versions. Actual process memory depends on OS pressure, WebView version, graphics resources and app allocations. Measure on physical devices; do not hard-code a guessed cap.

Worker messages are structured-cloned by default, so large object graphs can be serialized/deserialized and duplicated. Transferable ArrayBuffer can avoid a copy but detaches the sender's buffer. Avoid sending authoritative full simulation state every tick. Prefer compact commands and bounded deltas/snapshots.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects

## 5. Governor inputs

Combine simulation backlog, p50/p95 hourly step duration, catch-up duration, UI frame time, JS heap/process memory where measurable, thermal status/headroom, battery saver and lifecycle visibility. Thermal status is a pressure signal, not a direct utilization metric. Use sustained thresholds and hysteresis. If 6h/s cannot be sustained, surface overload and preserve queued work rather than skipping hours.

## Open questions / conflicts

- Capacitor version and current plugin lifecycle implementation must be inspected at latest HEAD.
- WebView memory cap is runtime/device dependent; no universal number is asserted.
- iQOO Z10 Turbo thermal behavior has not been measured in this research task.
- Actual app background behavior is not verified.

## Recommended acceptance tests

1. API <29 returns unsupported without crash.
2. API 29+ reads thermal status and listener updates correctly.
3. Plugin unregisters listener on destroy/reload; no Activity/WebView leak.
4. Thermal callback is lightweight and thread-safe.
5. AUTO governor reacts only after sustained evidence/hysteresis.
6. Background pauses and checkpoints.
7. Force-stop after checkpoint restores canonical state.
8. No simulation continues after process death.
9. Large worker snapshots do not duplicate full GameState every tick.
10. Test on iQOO Z10 Turbo and a lower-memory Android device before claiming device support.
