# OWNER DIRECTIVE — ADAPTIVE 12/6-HOUR GAME CLOCK, CLAUDE PROJECT AUTHORITY AND THREE-AI TEAM
- Recorded: 2026-11-21
- Repository: mtieu6470-maker/Victori3-mobile
- Branch: claude/game-historical-sandbox-modes-kg7rj7
- Scope: campaign clock target, project leadership, AI roles, planning/delegation and autonomous execution.
- This is a new owner instruction. It supersedes only conflicting prior instructions about simulation cadence approval, per-phase/per-task owner authorization and active AI role allocation. It does not erase historical audit records or waive security, legal, data integrity, cost, privacy and release safeguards.

## 1. Campaign and calendar remain 1836–2026

- Historical Mode starts 1 January 1836 and can reach 31 December 2026 inclusive.
- Sandbox / Alternate History starts from the same 1836 world snapshot and shares the same engine, calendar and rules.
- December 2026 is the final playable month; January 2027 must not execute.
- This instruction does not claim the 1937–2026 historical data is already complete. Every fact/event still requires source, temporal/geographic validity, method, uncertainty and rights/provenance.

## 2. Owner-selected adaptive clock: 12 game-hours/second nominal, 6 game-hours/second under sustained load

The preferred simulation rate is **12 in-game hours per 1 real-world second (12h/s)** when the device can sustain it. The owner explicitly accepts reducing the effective rate to **6 in-game hours per real-world second (6h/s)** when late-game complexity or measured device load causes sustained lag. The default player-facing mode should therefore be **AUTO**: target 12h/s while healthy and visibly fall back to 6h/s when measured performance requires it.

Derived reference values:

| Quantity | Nominal 12h/s | Adaptive fallback 6h/s |
|---|---:|---:|
| 1 game hour | 1/12 real second | 1/6 real second |
| 1 game day | 2 real seconds | 4 real seconds |
| 1 game week | 14 real seconds | 28 real seconds |
| 28–31 day month | 56–62 real seconds | 112–124 real seconds |
| 365/366 day year | about 12m10s–12m12s | about 24m20s–24m24s |
| Full 01/01/1836–01/01/2027 campaign (69,762 days) | 139,524s = 38h45m24s | 279,048s = 77h30m48s |

The final playable date remains 31 December 2026; January 2027 must never execute. These rates control real-world pacing only. They must not change the order or logical result of simulation steps at the same canonical game time. The clock is hourly-canonical, but this does not require every subsystem to run a full expensive update at every hourly boundary.

### 2.1 Clock architecture requirements

1. Use a monotonic real-time source for elapsed wall-clock measurement; never use frame count or render FPS as the authoritative game clock.
2. Convert elapsed real time into accumulated simulation time using a fixed-point or otherwise numerically stable accumulator. Avoid floating-point drift over long campaigns.
3. Define one canonical simulation time unit and a deterministic ordering for hourly boundaries. The active scheduler must accurately account for the selected effective rate (12h/s nominal or 6h/s fallback) without silently dropping hours when rendering slows.
4. Separate simulation from rendering. A 30/60 FPS UI must not change economic, political, demographic, military or AI outcomes.
5. Use explicit subsystem cadence contracts:
   - hourly: clock boundary, queued commands/events that are hour-sensitive, movement/travel/combat substeps only where required, operation scheduling;
   - daily: needs/consumption or other daily flows where the approved model requires it, shipment progress, military supply/attrition, migration or demographic flows at their defined resolution;
   - weekly: selected AI planning, market/route maintenance or political processes only if their design requires it;
   - monthly: fiscal settlement, population/economic aggregation, market clearing, construction/production settlement, political/technology progress and monthly reports where appropriate;
   - yearly: age/year transitions, annual statistics, elections/events/reforms and long-range recalibration where the domain model requires it.
   This is a scheduling menu, not permission to update every system at every cadence. Each subsystem must document its actual cadence, inputs, outputs and deterministic order.
6. Batch/aggregate repeated hourly steps only when equivalence to the canonical step-by-step result is proven by tests. Never skip an event boundary, command, battle, treaty expiry, construction completion or campaign boundary.
7. If the device falls behind, use bounded catch-up batches, backpressure and clear speed/lag feedback. AUTO may visibly change from 12h/s to 6h/s; never silently slow the game while still reporting the old rate. Do not run an unbounded loop on the UI thread.
8. Provide Pause and speed settings. Default mode is AUTO: 12h/s while healthy, 6h/s when sustained measured load requires the fallback. Also provide explicit fixed presets including 0.25x = 3h/s, 0.5x = 6h/s, 1x = 12h/s, 2x = 24h/s and 4x = 48h/s. A user-selected fixed rate must be clearly distinguished from AUTO. Claude may add presets after profiling.
9. A fast-forward command must be cancellable, bounded, deterministic and respect the 31 December 2026 campaign end. It must not overlap another simulation batch or continue against a replaced/loaded GameState.
10. Background behavior must be explicit. Default safe behavior: pause simulation when the app is backgrounded or process lifecycle is uncertain; persist safely and resume only on foreground. Do not claim real-time offline progress unless a separately tested, battery-safe background mode is implemented and user-enabled.
11. Save/load must persist canonical game time, pending scheduled events, cadence phase/accumulators and all RNG state required for deterministic continuation. Save migration is required if the clock representation changes.
12. Benchmark on the project Android target class, including the owner's iQOO Z10 Turbo / Dimensity 8400 Turbo / 12 GB RAM, but do not assume every Android device has the same capacity. Report sustained simulation throughput, frame-time, CPU, memory, thermal behavior and catch-up behavior at representative world sizes.
13. Benchmark both 12h/s and 6h/s, including representative late-game world size and state density. Claude must profile and optimize the scheduler, indexes, AI budgets, batching and data structures before accepting degraded pacing. If 12h/s cannot be sustained late-game after optimization, AUTO must fall back visibly to 6h/s rather than overload the device. Any further overload must remain visible; never corrupt simulation correctness or discard required work.

### 2.2 Adaptive late-game performance policy

1. AUTO is the normal default. Begin at 12h/s when measured simulation throughput and device headroom are healthy; transition to 6h/s only after sustained evidence of overload (for example, simulation backlog, hourly-step processing budget, frame-time degradation or thermal pressure). Calibrate thresholds through profiling on supported devices rather than inventing arbitrary thresholds.
2. Use hysteresis: require sustained overload before dropping to 6h/s and sustained headroom before returning to 12h/s. This prevents rapid oscillation. Show the current effective rate and whether it is AUTO or user-fixed.
3. Do not trigger the fallback merely because the calendar reaches a particular year. Late-game calendar time is a risk indicator, not a substitute for measuring actual workload.
4. Switching between 12h/s and 6h/s changes only how quickly canonical game time advances in real time. It must not remove Pops, buildings, goods, AI nations, market calculations, events or other gameplay detail to meet the target. Deterministic outcomes at the same canonical time must not depend on render frame rate or selected wall-clock pace.
5. Preserve the hourly canonical step, event ordering, RNG sequence and save/load continuation at both rates. Keep catch-up bounded and off the UI thread; do not skip hourly boundaries to recover apparent speed.
6. If even 6h/s cannot be sustained, surface an explicit overload/lag state and preserve queued simulation work. The player may pause or manually select a slower preset such as 3h/s; AUTO must not silently claim that 6h/s is being maintained when it is not.
7. Persist the user's selected mode/preset. In AUTO mode, recompute the effective 12h/s or 6h/s rate from current device conditions after load rather than treating a previous device's transient load as permanent save state.

### 2.3 Compatibility and implementation rule

The prior runtime currently has monthly tick semantics and DEV-007 calendar boundary tests. This owner instruction sets a new product target; it does not mean that the existing monthly runtime already satisfies it. Claude must first audit current clock code, DEV-006/DEV-007 tests, save envelope and all subsystem cadence assumptions; then design a migration plan and implement the new clock safely. Do not simply change a constant or call the monthly function twelve times per second. The clock migration may require versioned save migration, deterministic replay/continuation tests and a compatibility layer.

## 3. Claude receives project-wide execution authority

Claude Code is appointed **Project Director, Lead Systems Architect and Primary Implementation Engineer** until the project reaches its agreed completion criteria.

Claude has authority to:
- Research the complete Victoria 3 reference scope and translate it into a feature-by-feature parity inventory.
- Design and maintain the overall product architecture, system dependency graph, implementation roadmap, milestones and acceptance tests.
- Decide technical approach, internal architecture, data model, module boundaries, code structure, implementation order and optimization strategy.
- Break work into tasks, assign and reassign work to ChatGPT and Gemini Hydrogen, set priorities, request deliverables and integrate their results.
- Start, sequence, reorganize and progress implementation workstreams without asking the owner for routine per-task or per-phase permission.
- Implement and modify code, tests, data schemas, simulation systems, UI, asset registries, content-pack systems and ordinary CI configuration when necessary for the product, while preserving repository history and safety.
- Update project roadmap, task register, parity matrix, handoff and progress reports to reflect actual evidence.
- Decide when a subsystem is ready for integration and when a task needs more research, profiling or rework.
- Continue to the next dependency-ready task rather than repeatedly stopping to ask the owner to choose routine engineering details.

The old S0–S23 roadmap remains a useful dependency and audit map, but its phase labels are not a requirement to request a new owner approval before each ordinary implementation task. Claude may revise the execution sequence and mark workstreams open/in progress after verifying their technical prerequisites. Historical gate verdicts and past review records must not be falsified or rewritten as if they had passed. Where a legacy gate's purpose is a safety/integrity check, preserve the check and provide equivalent or stronger evidence; do not use a phase label as an excuse to leave the project permanently in documentation-only mode.

### 3.1 Decisions still reserved to the owner

Claude's broad technical authority does not authorize:
- Spending money, starting paid subscriptions, using paid APIs/cloud GPUs, enabling billing, or creating paid resources.
- Creating/using credentials, secrets, signing keys, keystores or external accounts on the owner's behalf.
- Publishing a production release, store submission, public launch, legal agreement or irreversible external action.
- Installing an APK on the owner's personal device or changing device settings without explicit permission.
- Sending personal data, save files, telemetry or project data to an external provider without an explicit approved data flow.
- Using copyrighted/proprietary Victoria 3 source, data, text, artwork, music, video or audio without rights.
- Force-pushing, deleting protected history, overwriting unrelated owner work or merging a PR without the repository's applicable authorization.
- Claiming owner acceptance or physical-device QA that did not occur.

Use free tools and local/offline-first methods by default. If a task genuinely requires a reserved action, continue all safe independent work and present the smallest decision required.

## 4. Active AI team — exactly three participants

DeepSeek is removed from the active project. Do not assign it tasks, request reviews, reference it as fallback, or make future work depend on it. Historical records of past activity may remain as archival history, but the active roster, current handoff and all new task assignments must not include DeepSeek.

### 4.1 Claude Code — Project Director and Lead Engineer
- Owns the end-to-end delivery and final integration.
- Writes the primary production code and tests.
- Owns the project execution plan, task breakdown, assignment register, technical decisions, architecture, dependency order, implementation and performance optimization.
- Delegates research and visual/content tasks to the other active AIs with concrete inputs, output formats, sources, acceptance checks and dependency order.
- Reviews and integrates all delegated work; rejects unsupported or unlicensed material.
- Runs tests/CI and records exact commit SHA, evidence and unresolved risks.
- May ask ChatGPT for a no-write technical critique, but is not required to wait for a separate AI to authorize routine implementation.
- Must perform self-review and clearly label it as implementer self-review, not an independent third-party verdict.

### 4.2 ChatGPT — Research Synthesis, Requirements Intelligence and Documentation Support
- Main responsibility is to collect, compare, reconcile and synthesize information needed by Claude: Victoria 3 mechanics, official patch/DLC behavior, historical research, architecture references, Android constraints, performance approaches, data standards and cross-system dependencies.
- Converts source material into concise, traceable technical briefs, comparison tables, requirement maps, research questions, acceptance criteria and risk notes.
- Maintains consistency between research, master brief, parity matrix and owner requirements when Claude requests support.
- Supports visual planning: art direction, image/asset taxonomy, period/style references, composition briefs, prompts, asset coverage maps and visual QA criteria.
- Does not take over primary code authorship or independently redirect Claude's implementation plan. Claude owns prioritization and integration.
- Can review a specific technical proposal when Claude requests it, but this is advisory input; Claude makes the final project decision.

### 4.3 Gemini Hydrogen — Visual Research and Media Support to ChatGPT
- Supports ChatGPT with visual research and media planning: historical image references, flags, coats of arms, portraits, uniforms, buildings, ships, maps, period-specific architecture, animations, cinematic references, music/sound direction and asset coverage.
- Supplies source links, date/region/entity mapping, license/rights status, provenance, confidence and recommended asset IDs/metadata.
- Distinguishes authentic historical references, generated concept art and licensed production assets.
- Provides visual boards, image-generation briefs, asset manifests and QA notes in the format requested by ChatGPT/Claude.
- Does not silently commit visual claims as historical fact or treat an unlicensed reference image as distributable game content.
- ChatGPT coordinates and synthesizes Hydrogen's visual support; Claude decides what enters the product and integrates it.

## 5. Claude's mandatory first deliverables — create the plan, then execute

Without waiting for another owner prompt, Claude must:

1. Read the latest repository entrypoints, master brief, owner directives, handoff, collaboration protocol, roadmap, current source and tests.
2. Verify exact branch and HEAD, uncommitted/remote changes where applicable, latest CI and all current project state.
3. Audit the current game against the full Victoria 3 feature inventory and the existing parity matrix. Distinguish IMPLEMENTED, PARTIAL, DESIGN_ONLY, DATA_MISSING, NOT_STARTED, BLOCKED and NOT_APPLICABLE with code/data/test evidence.
4. Create docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md containing:
   - product scope and definition of complete;
   - complete feature/system breakdown and parity IDs;
   - current-state audit with source paths and evidence;
   - dependency graph and critical path;
   - milestone sequence with deliverables and exit criteria;
   - simulation clock migration plan for 12h/s;
   - save/data migration plan;
   - global history/data coverage plan for 1836–2026;
   - asset/media and 4–5 GB content-pack plan;
   - Android performance/device QA plan;
   - risk register and contingency strategy;
   - task IDs, owners, dependencies, priority and status.
5. Create docs/coordination/AI_TASK_ASSIGNMENTS.md with the active three-AI roster and every delegated task. Each task must state objective, context, exact expected output, source/provenance requirements, format, acceptance checks, dependency, status and integration owner.
6. Update the parity matrix so every major Victoria 3 system and released gameplay-bearing pack has a traceable parity ID, implementation state, source path, data coverage, tests, UI path and known differences.
7. Create a critical-path task list and immediately begin the first dependency-ready implementation slice after the plan is committed. Do not stop after producing a plan or ask the owner to approve routine task ordering.
8. Maintain the plan and assignment register as living documents after every meaningful delivery. Reprioritize autonomously when tests, research, performance or dependencies reveal a better order.
9. Keep the owner-facing summary short; keep technical detail and evidence in GitHub.

## 6. Feature planning must be system-complete, not menu-complete

Claude must break Victoria 3 parity into domain systems and interactions, not just top-level labels. At minimum, the plan must cover:
- world map, geography, states/regions, borders, terrain, resources, strategic regions, sea nodes, claims and temporal map changes;
- countries/polities, sovereignty, state capacity, capitals, recognition, prestige/rank, country formation, succession, subjects and colonial administration;
- Pops/cohorts, strata, professions, culture, religion, literacy, qualifications, employment, needs, wealth, SoL, discrimination, migration, birth/death and political alignment;
- goods, buy/sell orders, inventories, material conservation, local markets, price formation, shortages/surpluses, market access, trade routes, tariffs, convoys and blockades;
- buildings, building sites, production methods, input/output recipes, workforce, qualifications, productivity, profitability, ownership, construction sectors, queues and investment;
- treasury, taxation, tariffs, minting, reserves, debt, credit, interest, subsidies, government wages and fiscal crises;
- laws, government types, legitimacy, authority, bureaucracy, institutions, elections where applicable, parties, interest groups, agitators, lobbies, movements, revolutions and civil wars;
- technology, innovation, research capacity, literacy effects, diffusion, adoption and era-specific unlocks;
- characters, rulers, traits, offices, generals/admirals, succession, court factions, journal entries, decisions, events and country-specific narratives;
- diplomacy, relations, attitudes, obligations, guarantees, alliances, treaties, subjects, autonomy, liberty desire, Power Blocs, principles, cohesion, leverage, foreign investment, diplomatic plays, sway, escalation, negotiation and colonization;
- army organization, battalions/formations, recruitment, conscription, commanders, equipment, mobilization, fronts, movement, supply, attrition, battles, tactics, casualties, occupation, war support, peace deals and post-war recovery;
- navy, ship design, hull/armament/propulsion/range, shipyards, fleets, flagships, naval missions, convoy protection/raiding, blockade, amphibious movement, sea control, ship purchase treaties and gunboat diplomacy;
- colonization, indigenous polity agency, slavery/coercive labor, discrimination, decolonization and historically valid legal/social systems;
- country AI, world AI, strategic goals, budgets, domestic stability, economic planning, diplomacy, military planning, explainable decisions and deterministic scheduling;
- map lenses, HUD, outliner, alerts, ledgers, tooltips, forecasts, history log, command queue, timeline, accessibility and landscape-first touch interaction;
- save/load, migrations, backup/restore, offline content, localization, original/licensed images, portraits, map art, video, animation, music, ambience and sound effects.

For every system, Claude must identify: entities, state, commands, rules, cadence, inputs/outputs, upstream/downstream dependencies, player controls, AI behavior, UI/inspection, persistence, historical data needs, tests, performance budget and parity gaps.

## 7. Completion definition

The project is complete only when the agreed product definition is met: a playable Android grand-strategy game with a coherent global 1836–2026 campaign, meaningful Historical and Sandbox modes on one engine, deep interconnected systems at the intended Victoria 3 feature breadth, country/world AI, reliable saves, usable landscape-first UI, source-backed historical coverage, licensed/original media, verified offline content packs targeting 4–5 GB installed, and tested performance on supported Android devices.

A small APK, a successful compile, a plan document, a collection of menus, or a large folder of unused assets is not completion.

## 8. Relationship to previous decisions

- This directive supersedes the 2026-11-20 campaign amendment §3 only as to the product's target clock and the need for a separately owner-approved cadence change. The owner-selected pacing policy is 12 game-hours/second nominal with a visible adaptive fallback to 6 game-hours/second under sustained measured load, implemented through a deterministic scheduler and safe save migration.
- It supersedes prior active role allocations that placed DeepSeek in the team or made Claude merely an implementer/reviewer subordinate to another AI.
- It supersedes the requirement to obtain a new owner approval for each ordinary phase/task. Claude may autonomously plan and execute the dependency-ordered project to completion.
- It does not alter the campaign date boundary 1836–2026, the no-January-2027 rule, historical source requirements, licensing/privacy/cost/security safeguards or owner-reserved external actions.
- Do not rewrite old CI/review records or claim that previous monthly-cadence code already meets either the 12h/s nominal target or the 6h/s fallback.
