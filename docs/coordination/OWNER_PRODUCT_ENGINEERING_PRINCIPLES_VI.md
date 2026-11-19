# OWNER PRODUCT & ENGINEERING PRINCIPLES — Victori3 Mobile

**Owner directive recorded:** 2026-11-19  
**Applies to:** product direction, research, design, implementation, QA, APK/data distribution and handoff.  
**Status:** standing owner direction; it does not bypass the repository's approved roadmap, phase gates, independent review or explicit scope controls.

## 1. Product objective: a complete Victoria 3-class grand strategy game

Build a serious Android grand-strategy/society simulation inspired by the breadth, systemic depth and player experience of Victoria 3. "Like Victoria 3" means functional and systemic parity across the major gameplay domains, not a superficial visual imitation or a collection of disconnected menus.

The target scope is global, not a showcase for a few countries or one continent:
- Playable worldwide political entities and a coherent global map.
- Historical Mode beginning in 1836, with source-backed starting conditions and historically grounded developments through the 19th and early 20th centuries (the project target period is 1836–1936).
- Sandbox / Alternate History uses the same underlying simulation engine and may diverge after the selected start; do not hard-code historical outcomes or railroad the player.
- Core systems must interact causally. Population affects labor, demand, wealth, politics and migration; production consumes inputs and labor and creates goods, wages and profits; markets and transport affect prices and shortages; laws and institutions change incentives and state capacity; diplomacy, military logistics and war affect trade, territory, population and public finances.
- Build complete playable loops, not isolated feature stubs. A meaningful campaign must allow a player to select a country, start in 1836, advance time, manage population/economy/politics, construct and operate industry, research, trade, conduct diplomacy and experience military conflict, then save/load and continue.

Victoria 3 is the reference for feature coverage, interaction patterns and systemic behavior. The project must use its own implementation, data compilation, writing, art, UI assets and branding. Do not copy proprietary source code, extracted game files, art, music, text or other assets. Research mechanics and reproduce the underlying design ideas with original, properly licensed material.

## 2. Research before design or implementation

Do not guess how Victoria 3 or real history works. Before implementing or changing a mechanic:
1. Identify the exact mechanic and the player-visible behavior to reproduce.
2. Research official Paradox material first (developer diaries, official game pages, patch notes and manuals where available); then consult reputable specialist documentation and carefully qualified community references.
3. For historical claims and 1836 starting data, use primary sources and reputable academic, archival, statistical or institutional sources where available. Prefer contemporaneous evidence for dates/borders/officeholders and documented historical datasets for population/economy.
4. Cross-check material claims with more than one independent source when feasible. Distinguish official game behavior, historical fact, community interpretation, and our own design adaptation.
5. Record source URL, title/author/publisher, publication date, access date, relevant passage/page/table, temporal/geographic coverage, method, license/usage rights, confidence and unresolved contradictions.
6. If sources disagree or evidence is missing, preserve the disagreement and mark the data/claim uncertain or blocked. Never invent a precise value to fill a gap; do not silently promote a candidate dataset to verified game data.
7. Turn research into traceable requirements: mechanic → source/evidence → game rule → data/schema → implementation → test/acceptance criterion.

Research is continuous: check current official documentation and updates when a mechanic is revisited. Do not assume an old diary describes the current live implementation if patches may have changed it.

Starting reference sources (not an exhaustive research set):
- Paradox official Victoria 3 overview: https://www.paradoxinteractive.com/games/victoria-3/about
- Paradox Developer Diary #57, design/gameplay overview: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far
- Paradox official release overview: https://www.paradoxinteractive.com/media/press-releases/paradox-interactive/build-a-shining-future-on-the-ashes-of-the-past-victoria-3-available-now
- Steam official product description/features: https://store.steampowered.com/app/529340/Victoria_3/

## 3. Major feature-parity coverage

Maintain a living feature-parity matrix against Victoria 3. At minimum, account for:
- World map, states/provinces, borders, terrain, strategic regions and map modes/lenses.
- Countries, governments, subject relationships, sovereignty and country formation.
- Population (Pops/cohorts), culture, religion, professions, wealth, needs, literacy, qualifications, migration, mortality, birth and standard of living.
- Goods, needs, production, buildings/sites, production methods, employment, wages, ownership, dividends and investment.
- Markets, prices, buy/sell orders, shortages/surpluses, trade routes, tariffs, market access, infrastructure, ports, railways and transport capacity.
- Treasury, taxation, debt, credit, budget, subsidies, government spending and monetary/economic feedback.
- Laws, institutions, bureaucracy, authority, legitimacy, government composition, interest groups, political movements, radicals/loyalists, revolutions and civil conflict.
- Technology, innovation, research, spread and era-dependent prerequisites.
- Diplomacy, relations, alliances, pacts, subjects, obligations, infamy, diplomatic plays, escalation, demands and negotiated outcomes.
- Military organization, formations/units, mobilization, commanders, fronts, battles, supply, attrition, naval forces, convoys, occupation, casualties and peace treaties.
- Colonization, migration, discrimination, slavery/serfdom and other historically relevant social systems, represented with historical care and without trivializing harms.
- Characters, institutions, events, journal/objective systems, decisions and country-specific historical context.
- Time controls, AI country behavior, save/load, settings, localization, accessibility, onboarding and useful tooltips/feedback.

For each feature record: reference behavior, project behavior, dependency systems, data coverage, implementation status, tests, performance impact, known differences and next gap. Use honest states such as NOT_STARTED / PARTIAL / IMPLEMENTED_UNVERIFIED / VERIFIED; a menu or placeholder is not an implemented system. "Complete" requires integrated behavior and acceptance evidence.

## 4. Android application and landscape-first interface

- The deliverable is an installable Android APK, not merely a website or a desktop mock-up.
- The primary game experience is **landscape (horizontal)**. Design and test the map, top status bar, side panels, bottom controls, tooltips, dialogs and overlays for phone landscape first. Portrait may have a supported adapted layout where appropriate, but must not be the primary compromise that reduces gameplay functionality.
- Treat the phone screen as a constrained grand-strategy command interface: map remains legible, panels are navigable, text does not clip, touch targets are practical, and the player can inspect dense information without accidental actions.
- Optimize for actual Android WebView/Capacitor behavior and the target device class, not desktop browser assumptions.
- Orientation changes, background/foreground, process death, WebView context loss, save persistence, touch input, memory pressure and thermal behavior must be tested.
- UI is not allowed to own simulation rules. Mutations go through explicit domain commands; views render state and selectors. Keep navigation/context stable and avoid UI-only fake values.

## 5. APK first, then downloadable data/content packs

The intended distribution model is:
1. Install a reasonably sized base APK containing the application shell, engine/runtime, essential UI, pack manager, trust roots and minimum bootstrap data needed to open the app and reach a usable setup screen.
2. On first setup, show the available required and optional data packs, their sizes, versions, requirements and storage needs. Ask for explicit user action before network access or downloads. Never silently download or use mobile data.
3. Download packs to app-private storage with progress, pause/cancel and verified resume. Preflight free space.
4. Verify publisher authenticity (signed canonical manifest) and file integrity (per-file SHA-256), schema/version compatibility, IDs, paths, MIME types, size limits, provenance and licenses before activation.
5. Stage new content separately; activate atomically only after all checks pass. Keep the last known-good version and roll back safely on failure. Handle corrupt, incomplete, incompatible and missing packs without corrupting saves or blocking the base app.
6. Provide pack inventory, update controls, storage usage, retry, removal where safe, and clear offline status.
7. After packs are installed, the campaign, simulation, map essentials, save/load and core gameplay must work fully offline. Internet is optional and only used after an explicit user action.
8. Separate simulation/history data from optional presentation assets (high-resolution art, audio, language packs, etc.) where practical. Define dependencies and deterministic conflict resolution; content packs must never execute code or inject HTML/JavaScript.

Do not claim this architecture exists just because assets are compressed or generated into the APK. Verify actual APK contents, pack catalog, first-run flow, real download, resume, hash/signature verification, activation/rollback and offline play. Record actual pack sizes and physical-device storage behavior.

This direction is consistent with the existing S23 mobile/content-pack design proposal. S23 remains subject to its documented gate and authorization requirements; this owner principle does not independently open S23 or authorize changes to signing, package identity, versionCode, secrets or release workflows.

## 6. Smoothness, stability, correctness and resource discipline

Quality priorities, in order:
1. Correct simulation and save integrity.
2. Crash/ANR prevention and deterministic, recoverable state transitions.
3. Smooth map interaction and responsive UI.
4. Predictable simulation tick performance at global scale.
5. Controlled memory, storage, CPU/GPU, battery and thermal usage.
6. Visual polish and optional effects.

Engineering requirements:
- Profile before optimizing; do not claim "smooth" from desktop CI or source inspection.
- Measure frame time/jank, map draw cost, tick p50/p95/p99, startup and panel latency, JS/native memory, texture/cache usage, save/load time and size, and long-session memory growth.
- Use spatial/LOD/visibility culling, virtualization, bounded caches, incremental work and background workers where justified. Avoid blocking the UI thread with simulation, parsing, decompression, file I/O or large list construction.
- Bound work per tick and avoid repeated full-world scans when incremental indexes or deterministic partitions are suitable.
- Keep deterministic simulation and reproducible saves; protect RNG state and all state needed for continuation.
- Use atomic save writes, validation, versioned migrations and recovery/backup behavior. Never destroy the last valid save on a failed write or migration.
- Test cold/warm launch, offline play, save/load, process death, orientation, long sessions, memory pressure, low storage, corrupt packs and interrupted downloads.
- Record exact device/OS/WebView/app build and commit for physical measurements. Mark unavailable device tests BLOCKED / NOT_TESTED, not PASS.

## 7. Delivery, reports and GitHub as the durable project memory

GitHub is the shared source of truth across ChatGPT, Claude and other contributors. Do not rely on chat history as the only record.

For every work slice:
- Inspect the latest branch HEAD, this document, AI_HANDOFF, AI_COLLABORATION_PROTOCOL, approved roadmap and relevant phase spec before editing.
- Work in a bounded, reviewable slice. Do not make unrelated edits or bypass phase gates.
- Keep a rolling progress report in the relevant report file and update AI_HANDOFF when status, review target, risks or next action changes.
- Record what changed, why, exact files, base SHA, commit SHA, tests/commands and exit codes, CI URLs/results, APK/artifact hash if produced, device evidence if available, limitations, open risks and next concrete task.
- Commit and push the report together with the completed slice; do not leave the only progress record in chat.
- If implementation is incomplete or blocked, record the partial state and exact blocker. Do not report an uncommitted change as delivered.
- Keep reports concise but sufficiently specific for Claude to independently inspect without asking the owner to reconstruct context.
- Never claim tests/builds/device checks passed unless the evidence exists for the exact commit.
- Claude's independent review and owner acceptance remain separate from ChatGPT's implementation/self-audit.

If a chat freezes or a session changes, the next session must read GitHub handoff and current state, inspect the latest commit and CI, and resume from the last committed checkpoint. If work was not committed, state that it cannot be assumed preserved.

## 8. Accuracy, legal/ethical and data-quality guardrails

- Treat Victoria 3 as a design and feature reference, not a source of assets/code to extract or redistribute.
- Prefer original code, original UI/art/text/audio, public-domain or appropriately licensed assets and independently researched datasets.
- Every historical record must carry provenance and temporal validity; record conflicting claims and confidence.
- Keep unknown, estimated, disputed and verified values distinct in schema and UI. Do not turn missing values into zero or fabricated certainty.
- Preserve correct historical names, borders, dates, government structures, rulers, institutions and relationships with source citations.
- Be explicit about abstractions made for mobile performance; abstractions must preserve causal behavior and must not become decorative counters.
- Avoid anachronistic data leakage between dates. Historical Mode should be historically grounded at start and evolve plausibly without fixed outcomes; Sandbox should permit divergence.

## 9. Definition of done

A feature slice is done only when:
- Its requirement and Victoria 3 reference behavior are documented.
- Historical/technical research and provenance are recorded where relevant.
- It is integrated with dependent systems, not just a standalone screen or placeholder.
- Unit/integration/regression tests cover normal, edge and failure paths.
- Performance and save compatibility risks are evaluated.
- CI evidence is attached to the exact commit; physical-device claims have physical-device evidence.
- The rolling report and AI_HANDOFF are updated and pushed.
- The exact change is ready for independent review; owner acceptance is recorded where required.

A game milestone is not complete merely because an APK builds or the map opens. Acceptance requires an end-to-end playable campaign slice and evidence against the feature-parity matrix.

## 10. Relationship to existing project governance

This file records the owner's standing product/quality direction. It does **not**:
- Override the approved roadmap, S0 decisions, phase sequencing or gate definitions.
- Grant blanket permission to change any closed phase, save schema, Android package/signing, GitHub secrets or release process.
- Convert a design proposal into implementation authorization.
- Mark any feature, phase or gate accepted.
- Replace Claude's independent review or the owner's explicit acceptance.

If this directive conflicts with an existing owner-approved decision or normative spec, document the conflict in AI_HANDOFF and request a precise owner decision; do not silently rewrite the old decision.

## 11. Reference basis and current research entry points

Official Victoria 3 feature framing identifies Pops and their needs/political desires, laws and institutions, technology, production, trade, diplomacy, warfare and a changing world map as core pillars. See the official sources in §2. This is an initial feature map, not proof that every current patch or DLC mechanic has been exhaustively researched. The parity matrix and source register must be expanded system by system, including current patches and DLC scope where relevant.

