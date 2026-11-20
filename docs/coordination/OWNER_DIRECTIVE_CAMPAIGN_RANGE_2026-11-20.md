# OWNER AMENDMENT — CAMPAIGN PERIOD 1836–2026

**Recorded:** 2026-11-20  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Source:** Explicit project-owner instruction in the current ChatGPT session on 2026-11-20. This file records that instruction; it does not impersonate a signed external review.  
**Base HEAD:** `01e57d57a5715fadb13f54fa67b56f1cdbdef7ac`  
**Status:** Owner-directed product decision and bounded implementation authorization.

## 1. Campaign-period decision

The owner changes the full campaign period to **January 1836 through December 2026 inclusive**. This supersedes the earlier 1836–1936 period in the legacy master specification and earlier historical research requests **only for the campaign date range**. It does not silently replace their mechanics, data-quality, source, license, or stage-gate requirements.

- Historical Mode begins on 1 January 1836 and can progress through December 2026.
- Sandbox / Alternate History begins from the same 1836 world snapshot and uses the same simulation engine and campaign calendar through December 2026.
- December 2026 is the final playable month. The engine must not execute a January 2027 tick.
- Existing saves retain their current schema and deterministic month/tick semantics; this slice does not add campaign fields to the save schema.

## 2. Historical-data implications

Extending the playable period does **not** make the existing 1836–1936 historical research complete through 2026. The period 1937–2026 requires its own source-backed coverage across countries, borders, institutions, leaders, technology, economy, conflicts, events, and other date-valid facts.

- Historical facts must include source, publication/access date, temporal validity, geographic scope/crosswalk, units, method, uncertainty and license/rights where applicable.
- Unknown, estimated and disputed values remain distinct. Do not fill 1937–2026 with invented events, modern facts projected backward, or scripted outcomes.
- Historical Mode may continue using shared endogenous simulation where event/data coverage is incomplete, but it must not be described as fully historically calibrated for 1937–2026 until evidence is added and reviewed.
- Sandbox uses the same rules and may diverge; it is not a separate simplified engine.

## 3. Time-resolution decision

The current runtime calendar is monthly. This amendment sets the inclusive campaign range; it does **not** authorize an unreviewed daily-tick conversion. The monthly simulation cadence remains until a separately designed and accepted cadence change covers every subsystem, RNG ordering, save compatibility, performance and Android lifecycle.

## 4. Full game size and media interpretation

The existing owner target remains approximately **4–5 GB of meaningful full-game content installed after all verified packs are installed**. An 18 MB debug APK or a roughly 40 MB runtime snapshot is not the complete game. Do not make a binary/package larger by padding it.

- The full installed footprint must consist of real gameplay/history/map data and used, quality-preserving image, video, animation, music and sound assets with provenance/licensing and in-game usage.
- No empty, random, duplicate, repeated, silent or unreachable content counts toward the target.
- Keep APK bootstrap, compressed download, expanded installed footprint, staging/rollback space and peak decoded/runtime memory as separate measurements.
- Downloads remain explicit opt-in and offline packs must function after installation without streaming.

## 5. Victoria 3 feature-depth reference and IP boundary

The owner wants complete feature breadth and causal gameplay depth comparable to Victoria 3, including released gameplay-bearing expansion/immersion/mechanics-pack systems in the chosen reference version. The project must independently implement those mechanics and use original or appropriately licensed data, text, images, video, music and audio. Full parity does not authorize copying or extracting proprietary Victoria 3 code or expressive assets.

## 6. Implementation authority and governance

The owner grants the technical lead broad discretion to continue bounded implementation slices and choose their technical order, while following the repository's owner-approved requirements and collaboration protocol. This is not permission to falsify evidence, bypass an explicit stage gate, claim review/acceptance, change signing/secrets, force-push, merge, or install an APK on the owner's device.

This amendment explicitly authorizes the following bounded implementation task:

### DEV-007 — Campaign calendar boundary 1836–2026

**In scope:**
- Centralize the 1836 start and December 2026 inclusive end in the engine calendar contract.
- Prevent simulation from advancing beyond December 2026 in normal monthly ticks, manual stepping, and fast-forward.
- Ensure a fast-forward request is clamped to the number of remaining campaign months and a completed campaign remains paused.
- Display the supported range in new-campaign setup and the in-game date HUD.
- Add boundary, both-mode and controller regression tests.
- Update the rolling progress report and AI handoff, then commit/push and verify exact GitHub HEAD and CI.

**Out of scope:**
- No daily-tick conversion, subsystem formula changes, RNG algorithm change, save schema/migration change, fabricated post-1936 history, new historical facts without provenance, new assets/media, Android signing/secrets, release workflow, APK installation or phase-gate transition.

**Acceptance:** January 1836 maps to tick 0; December 2026 is reachable; the next step is a strict no-op; both modes share the same boundary; the controller cannot fast-forward or resume beyond the boundary; tests and exact-HEAD CI pass.

## 7. Preserved governance

S0/B4/B7 review state and all historical S0 gate verdicts remain as recorded. This product amendment is not S0 PASS, not S1 ACCEPTED, not a Claude REVIEW_PASS, and not a blanket opening of S7–S23. Any future slice that crosses a closed stage's explicit prerequisites must stop at that gate.

---

**Current task checkpoint:** DEV-007 is authorized on base `01e57d57a5715fadb13f54fa67b56f1cdbdef7ac`; implementation and CI evidence must be appended to the handoff/report after verification.
