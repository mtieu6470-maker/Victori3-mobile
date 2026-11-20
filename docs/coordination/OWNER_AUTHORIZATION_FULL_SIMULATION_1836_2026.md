# OWNER AUTHORIZATION — FULL 1836–2026 GRAND-STRATEGY IMPLEMENTATION LANE

**Date:** 2026-11-20  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Implementation branch:** `development/owner-authorized-1836-2026-simulation`  
**Base commit:** `89f974747ec417f4cd1ac424ec57fd8509b6396e`  
**Owner instruction:** “Làm lại toàn bộ từ tốc độ game, chính trị quân sự kinh tế thể chế luật lệ ngoại giao giao thương xây dựng hiệp ước các thứ, rồi kéo dài game đến 2026, áp dụng toàn bộ vic 3 vào.”

## 1. Scope delegated by the owner

The owner expressly authorizes ChatGPT to move beyond the earlier narrow S1-CLK-01 runtime exception and implement the game's full grand-strategy simulation development programme on this isolated branch, including:

1. A correct deterministic simulation clock and cadence scheduler, with the owner-set Speed-5 ceiling of 0.5 Gregorian game-day per real second.
2. Calendar/campaign expansion from 1836-01-01 through the complete final day 2026-12-31, completing at 2027-01-01 00:00 only after all terminal-day work is processed.
3. One shared simulation engine for Historical and Sandbox; differences are scenario initialization and history rules, not missing core systems.
4. POP/social strata and cohorts; demography, migration, literacy, employment, needs, wages and political alignment.
5. An integrated economy: firms/buildings, production methods, inputs/outputs, workforce, inventories/stocks, markets, prices, trade, tariffs, infrastructure, construction, taxation, debt, investment and budget.
6. Political systems: parties, interest groups, movements, elections where applicable, government/cabinet, legitimacy, institutions, laws, reform lifecycle, revolution and state capacity.
7. Diplomacy: relations, diplomatic plays, escalation, alliances, guarantees, typed treaties, expiry/enforcement, subjects/client states, autonomy, obligations, customs unions, trade agreements and international organizations.
8. Military: formations, manpower, commanders, equipment, production, mobilization, fronts, operations, battles, naval/air capabilities by era, depots, supply lines, convoys, attrition and war exhaustion.
9. Technology and institutions from the industrial era through contemporary 2026, distinguishing discovery, access, diffusion, adoption, deployment and operational readiness.
10. Strategic, diplomatic, economic and operational AI with deterministic, explainable decisions and bounded compute.
11. Time-valid historical countries, borders, leaders, governments, wars, events, treaties, trade and quantitative data through 2026, with source provenance, uncertainty and missing-data handling.
12. Save versioning/migration, offline-first data packs, APK-first distribution, tests, performance profiling and Android QA.

The owner has delegated technical discretion to select implementation order and deliver bounded, integrated vertical slices without repeatedly asking which subsystem to do next.

## 2. Intellectual-property boundary

“Apply Victoria 3” is interpreted as a target for genre-level systems, mechanical depth, interconnected gameplay loops and comparable player-facing capabilities. This authorization does **not** authorize copying or extracting Victoria 3 source code, proprietary text, artwork, portraits, audio, UI assets, maps, data tables or other protected content. Implement original code and original/appropriately licensed data and assets. Personal use or later deletion does not change that boundary.

## 3. Branch and governance boundaries

- All new implementation in this authorization stays on `development/owner-authorized-1836-2026-simulation`.
- The default branch `claude/game-historical-sandbox-modes-kg7rj7`, the separate S0 audit branch `experiment/vic3-visual-upgrade`, and the source branch `experiment/owner-authorized-clock-runtime` remain untouched by product implementation.
- Preserve the frozen S0 baseline and existing audit evidence. Do not falsify or relabel historical S0 gate results. S0-B7 and previous S0 findings remain recorded as they were; this development lane is a separate owner-directed product implementation track.
- Do not merge to the default branch, release, publish a signed production APK, change keystore/secrets, or claim independent review without the corresponding actual authorization/evidence.
- The prior narrow S1-CLK-01 authorization is superseded for implementation scope on this new branch only; it remains historical evidence of the earlier isolated experiment.
- The user has paused Claude review. No Claude review is requested or claimed; ChatGPT self-audit and CI are not independent review.

## 4. Mandatory engineering controls

- Re-fetch live branch HEAD and relevant source before each work slice. Use expected-SHA updates to avoid clobbering concurrent commits.
- Preserve deterministic ordering, explicit units, bounded work, idempotent scheduled tasks and reproducible tests.
- No frame/FPS-driven simulation state changes; no dropped logical ticks; slowdown/backlog reporting is preferable to skipping.
- No false precision in historical data. Track observation year, territorial definition, source, license, uncertainty and coverage gaps.
- Save migration must preserve recoverable originals and activate only after complete validation.
- All data packs require signed manifests, pinned-key verification, per-file SHA-256, compatibility checks and crash-safe atomic activation.
- No silent paid API/hosting, auto-billing, login requirement or cloud simulation. Disclose any recurring cost and obtain owner approval first.
- Do not claim target-device performance without an actual device benchmark.

## 5. First delivery slices

The implementation is staged, but not limited to documentation:

- **F0 — Foundation:** current-source audit, branch isolation, owner authorization and executable test/build baseline.
- **F1 — Time kernel:** calendar v2, six-hour logical-step index, deterministic cadence registry, monthly legacy-system adapter and campaign terminal boundary; versioned save migration with characterization/replay tests.
- **F2 — World model:** date-valid polity/territory identity, scenario initialization, event/deadline model and provenance-aware data contracts.
- **F3 — Integrated simulation vertical slices:** economic stock/firm ledger, POP cohorts, institution/law lifecycle, treaty/subject/diplomatic-play system, military formations/logistics and AI in dependency order.
- **F4 — 1836–2026 historical content and modern technology/institution adoption:** data coverage and era scenarios, without fabricating missing observations.
- **F5 — APK/data distribution and production hardening:** APK first, post-install data center, resumable verified pack downloads, offline acceptance, profiling, Android tests.

Each slice must include executable tests/build evidence when feasible. This plan is not a claim that any listed feature is already implemented.

## 6. Initial verified repository facts

At the base commit `89f974747ec417f4cd1ac424ec57fd8509b6396e`:
- GameDate/GameState and save remain month-granularity; `GAME_END_YEAR` remains 1936.
- The experimental monthly clock refactor exists, with Speed-5 cap 0.5 game-day/real-second; it does not yet create six-hour logical ticks.
- Existing subsystem modules exist but are mostly aggregate monthly implementations and do not yet provide all target depth.
- Historical data audit identifies substantial temporal and country-level gaps after the early/mid-20th century.
- APK-first/offline data-pack requirements are designed but no production data-pack downloader/payload is implemented.
- Android Gradle identity still uses an experimental application ID; do not treat existing debug APK artifacts as production release APKs.

## 7. Completion reporting

After each implementation slice, update `docs/coordination/AI_HANDOFF.md` with exact base/result HEAD, changed files, tests/build outcomes, known limitations, and next slice. Keep user-facing reports short. Never equate a successful code build with game completeness or device acceptance.
