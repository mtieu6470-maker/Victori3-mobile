# OWNER DIRECTIVE — GAME DEPTH, DELIVERY EXPECTATION & NEXT-SESSION READ REQUIREMENTS

**Recorded:** 2026-11-20  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Status:** Durable owner product/delivery direction. This clarifies the required outcome and working discipline; it does not silently override approved phase gates, independent review, or explicit scope controls.

## 1. Direct expectation

The owner wants a real, substantial Android grand-strategy game at Victoria 3-class breadth and systemic depth. The owner is not asking for another sequence of reports, audits, generic menus, mock screens, or a small mobile game that merely resembles a strategy game.

The technical lead/implementation agent is expected to **build the game**, not repeatedly describe how it might be built. Use technical judgment and make implementation decisions autonomously inside the currently authorized scope. Keep owner-facing conversation short and spend the work on concrete repository progress.

The current project is not yet at Victoria 3 parity. The goal is to close actual gameplay gaps through integrated, tested and playable systems.

## 2. Product acceptance target

### 2.1 World, campaign and Android

- Installable Android APK; **landscape/horizontal is the primary gameplay orientation**. Map-first grand-strategy command layout. Do not deliver a portrait-first simplified game.
- Global political and geographic coverage; no single-country or single-continent showcase presented as complete.
- Historical campaign begins in 1836 with source-backed, date-valid starting data. Events create context and pressures, not forced outcomes.
- Sandbox/alternate history uses the same simulation engine/rules as Historical mode and can diverge through player/AI decisions.
- Preserve the currently canonical target period and approved historical-data scope unless the owner explicitly changes them in a separate decision.

### 2.2 Real gameplay systems — not decorative menus

The target is **full functional parity with Victoria 3 as a complete product**, not a selected subset. The parity inventory must cover every major system in the base game and every gameplay-bearing addition introduced by released expansion, immersion and mechanics packs in the chosen reference version. Include their system changes and interactions, not only menus or country-specific story content. For example, The Great Wave adds ship design, flagship customization, ship-purchase treaties and further gunboat-diplomacy options; these belong in the naval/diplomacy parity matrix, not an optional decorative checklist. Future-announced but unreleased content must be tracked separately, never falsely marked implemented. Implement all mechanics independently; do not copy proprietary code, data, text or media.

1. World map, states/regions, borders, terrain, strategic regions, ownership, occupation and useful map lenses.
2. Countries, sovereignty, governments, country formation, dependencies, subjects and changing political entities.
3. Population cohorts/Pops: professions, culture, religion, wealth/income, needs, literacy, qualifications, migration, births/deaths and standard of living. Unknown data remains unknown, not fabricated.
4. Goods registry, production chains, inventories/material balance, supply/demand, markets, shortages/surpluses and price formation.
5. Building types/sites, production methods, workforce, qualifications, employment, wages, ownership, profitability, investment and construction with real input/time/capacity costs.
6. Trade routes, imports/exports, tariffs, market access, ports, roads/railways/sea lanes, transport capacity, convoys and logistics constraints.
7. Treasury, taxation, spending, debt/credit, interest, subsidies, bureaucracy and fiscal consequences.
8. Laws, institutions, government composition, authority/capacity, interest groups, political movements, legitimacy, reform, unrest, revolution and civil conflict.
9. Technology, prerequisites, innovation, diffusion and historically/regionally appropriate starting differences; do not give every country identical starting technology without evidence.
10. Diplomacy, relations, alliances, guarantees, pacts, obligations, customs unions, subjects, power blocs where in scope, diplomatic plays/crises, escalation, negotiation and treaty outcomes.
11. Military organization/operations: formations/units, recruitment, mobilization, commanders, fronts, movement, supply, attrition, battles, occupation, naval forces, blockades, convoys, war support and negotiated peace.
12. Characters, journal entries/objectives, decisions, events and country/region-specific historical context.
13. Country AI and world AI using the same rules and constraints as the player, with explainable decisions and bounded computation.
14. Time progression, deterministic save/load/continuation, settings, localization, useful tooltips and clear causal feedback.

A system does not count as implemented merely because a menu, button, counter, static record or placeholder exists. It must expose meaningful state/actions, change simulation state, interact with dependent systems, persist correctly and have tests.

### 2.3 Causal gameplay loops

Prioritize complete loops over disconnected feature stubs. At minimum, prove:

- Pop needs/income → market demand → goods prices/availability → consumption and standard of living → migration/political pressure.
- Building production method → input demand and hiring → output, wages and profit → market supply/prices → tax base and Pop wealth.
- Infrastructure/transport capacity → shipment cost/time/access → regional shortages and industry viability → investment.
- Laws/institutions/interest groups → reform process and state capacity → changed incentives and measurable economic/social effects.
- Diplomatic crisis/treaty → relations, obligations, trade/territory and AI strategy.
- Mobilization/war → manpower, goods, supply, casualties, occupation, debt and political/peace consequences.
- These loops continue across time and survive save → app/process restart → load → deterministic continuation.

If a system does not affect its dependent systems in code and tests, it is not complete. Abstractions must be disclosed and justified, not hidden behind fake counters.

## 3. Visual identity, complete media library and historical quality

The complete game must have a rich, coherent media layer comparable in breadth and presentation quality to a major PC grand-strategy title, adapted to Android. **Images, video and audio are required parts of the game content**, not optional future extras that may be omitted to keep the download tiny.

- **Images and visual assets:** period-valid flags, coats of arms, country and character portraits, ruler portraits, clothing, buildings, factories, ships, armies, battle/industrial illustrations, event and journal artwork, map/terrain textures, country/region backgrounds, icons, interface art and contextual illustrations. Measure coverage by country/entity, character, period and feature; do not replace missing coverage with one generic icon or repeated artwork.
- **Video and animation:** original/licensed opening presentation, historical/event sequences, contextual transitions, naval/industrial/military sequences and suitable animated map/unit/building elements. Use video when it materially improves the experience; use real-time animation for interactive elements. The game must not depend on streaming video to operate offline.
- **Audio:** original/licensed era-appropriate music, regional/national musical variation where justified, ambient soundscapes, UI feedback, industry/building/transport sounds, battle/naval effects and optional narration/voice work where designed. Include volume/mute controls and accessibility alternatives/subtitles for spoken content.
- Assets must be date/geography aware, mapped to in-game events/entities and lazy-loaded/streamed with bounded caches so media richness does not cause ANRs or uncontrolled memory growth.
- Maintain a media inventory with asset ID, format, pixel dimensions, frame rate/duration or audio sample rate/bitrate as applicable, size, intended in-game use, entity/date coverage, source, license, attribution, integrity hash and quality checks.
- Preserve source-grade or high visual/auditory quality. **Do not aggressively downscale, lower bitrates, strip animations, discard video/audio, or repeatedly recompress already-compressed media just to force the game into an artificially tiny package.** Use lossless or high-quality encoding where practical; any quality/size trade-off must be measured and justified. Use runtime LOD/streaming for performance without deleting high-quality installed source assets.
- Missing/uncertain historical facts/assets remain identified as missing/uncertain; do not fabricate identities or provenance.
- Use original implementation and original/licensed/public-domain material. Victoria 3 is a reference for mechanics and presentation quality only; do not copy/extract its source, game files, assets, text, music, video or proprietary data.

## 4. Complete game footprint, APK and offline content packs

The owner explicitly clarifies on 2026-11-20 that the product target is a **genuinely complete game of approximately 4–5 GB installed on the device**. This replaces the earlier 3–4 GB/allowance wording in historical S0/R15 notes. It is not a demand for a 4–5 GB monolithic APK: the base APK may remain a compact launcher/runtime, but after the full content collection is installed, the actual application + verified game data + media must approach the 4–5 GB product target.

- A debug APK around 18 MB is only a small technical shell/build artifact; **it is not the complete game and is not an acceptable full-content delivery milestone**.
- The complete footprint must consist of meaningful, in-game content: gameplay/history datasets, world/map data, country/entity records, high-quality images/textures/portraits, video/animation and audio/music/SFX. Do not pad with empty, random, duplicate, silent, repeated or unused files, or count source code/reports/cache as game content.
- Deliver through the approved base-APK + explicit user-controlled offline content-pack architecture where appropriate. Show required/optional packs, installed sizes, download sizes, versions/dependencies, media coverage and verification state.
- Do not aggressively compress or degrade media merely to reduce a download number. Preserve high-resolution images, meaningful video quality and high-quality audio; use sensible lossless/high-quality encoding and documented trade-offs. Measure separately: source asset size, compressed download bytes, expanded installed game footprint, temporary staging/rollback space and peak decoded/resident memory.
- The 4–5 GB target is a **real full-installed-content target**, not a minimum to fill with junk and not a RAM target. The app must show Core Only, Partial Content or Full Offline Content accurately.
- Explicit user action is required before network access or downloads. No silent mobile-data use, no mandatory paid service, and no executable code in data packs.
- Verify provenance/licensing, signed manifest, per-file hashes, compatibility, resumable downloads, atomic activation, rollback and full offline campaign operation before claiming the pack system works.
- Keep runtime performance and memory bounded using streaming, lazy loading, texture/audio caches and LOD; these runtime techniques are not permission to discard high-quality source content.

## 5. Engineering and delivery discipline

- Correct simulation, conservation invariants, determinism and save integrity come before decorative polish.
- Avoid UI-thread simulation/heavy I/O; prevent crashes/ANRs; bound CPU/RAM/GPU/storage/battery/thermal use; profile on real Android devices when available.
- Historical data must be researched and traceable: source, date, geography, units, method, uncertainty and rights. Never invent exact values.
- Every implementation slice must include actual code/data changes, relevant unit + integration/regression tests, exact commands and exit codes, exact GitHub commit, CI evidence and updated handoff/progress report.
- For APKs, record the APK SHA-256 separately from the artifact ZIP digest. Physical-device claims require device evidence.
- Do not spend sessions repeating the same audits, proposals or plans when the next authorized implementation step is known. Do only the research needed to implement correctly, then produce a concrete tested change.
- If a genuine phase gate blocks implementation, identify the exact pending reviewer/owner action and resolve it through the existing protocol. Do not bypass gates or disguise another design-only document as gameplay progress.
- ChatGPT self-audit is never independent review. Claude remains the designated independent reviewer; DeepSeek is a fallback only when the owner assigns it.

## 6. Checkpoint when recorded (must be refreshed before acting)

- Last verified branch HEAD before this documentation change: `0de599fba8cd4ac46d720d1783e5c8bde26b1500`.
- Landscape launcher fix and regression test are committed in code/test target `d1623e7d38337b757a1907029f5b0bd85e4ad71d`.
- Tests-only workflow [44772973670](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772973670): SUCCESS, 14/14 test files, 132/132 tests.
- Android debug workflow [44772973803](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44772973803): SUCCESS on exact code/test SHA `d1623e7`; Gradle `BUILD SUCCESSFUL`; APK artifact ID `14648313489`; artifact ZIP SHA-256 `d5e30f3bd670ad5c055a5b59651c1e10f5c124c213a8b87458a4c452c8db1325`. This is the ZIP digest, not the APK file digest.
- Build log: 502 bundled image records / 8,715,750 bytes of generated image assets (176 flags, 99 coats of arms, 227 portraits). This is only the measured current image subset; it does not prove complete historical visual coverage and contains no verified evidence of the requested full video/audio library or 4–5 GB full-installed product.
- Physical iQOO orientation/performance QA: NOT_TESTED.
- This documentation checkpoint does not implement gameplay systems or open a phase.
- Last known governance: S0-B4 and S0-B7 READY_FOR_REVIEW; independent review and owner acceptance pending; S1 NOT_STARTED; S22 DESIGN_ONLY. Re-fetch HEAD and current governance records before acting; these statuses may have changed.

## 7. Mandatory full-read procedure for every new session

Before doing any work, the next agent must:

1. Fetch current branch HEAD, latest commits, changed-file diff and relevant GitHub Actions runs/artifacts. Never rely on SHA/status written here as current.
2. Read the **complete contents, not just the first section or a summary**, of:
   - `AI_START_HERE.md`
   - `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md`
   - `docs/coordination/AI_HANDOFF.md`
   - `docs/coordination/AI_COLLABORATION_PROTOCOL.md`
   - `AGENTS.md`
   - `CLAUDE.md` when using Claude Code
   - `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`
   - this file: `docs/coordination/OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md`
3. Read the **entire applicable canonical roadmap and every current owner decision/amendment**, not only the handoff summary. Confirm the open phase, exact approved task/scope, acceptance criteria, dependencies and blocked gates.
4. Read the full relevant subsystem specs, current Victoria 3 parity audit and matrix, latest rolling progress report, source/research register, audit findings, review packet, prior reviewer findings and actual source/tests. A title or summary is not the full requirement.
5. Reconcile conflicting dates, scopes, data definitions and owner decisions before editing. The newest explicit owner decision wins only within its stated scope; do not silently erase earlier normative constraints.
6. Prepare a short execution plan: exact gap, one bounded implementation slice, allowed/out-of-scope files, contracts/invariants, tests and expected artifact. Ask the owner only for an approval genuinely missing.
7. Implement the next authorized real gameplay/system slice. Do not spend the session merely rewriting the plan or producing another broad audit unless a concrete blocker requires it.
8. Run tests, inspect logs, update the relevant rolling report and `AI_HANDOFF.md`, commit/push, then re-fetch GitHub and verify exact HEAD/files/workflow. If chat/network fails, follow the recovery protocol and inspect before retrying any write.
9. End with a concise factual handoff: exact commit, actual changes, tests/CI, APK/artifact if produced, remaining blocker and next exact implementation task. Never claim unverified progress.

## 8. Copy-ready instruction for the next ChatGPT session

> Tiếp quản Victori3 Mobile từ GitHub. **Trước khi làm bất cứ việc gì, bắt buộc đọc TOÀN BỘ yêu cầu**, không chỉ đọc tóm tắt: `AI_START_HERE.md`, `SESSION_RECOVERY_PROTOCOL_VI.md`, `AI_HANDOFF.md`, `AI_COLLABORATION_PROTOCOL.md`, `AGENTS.md`, `CLAUDE.md`, `OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`, và `OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md`. Sau đó đọc đầy đủ roadmap/owner decisions và amendments đang có hiệu lực, phase gate, spec subsystem liên quan, parity audit + matrix, báo cáo tiến độ mới nhất, review packet và code/test thực tế.  
>
> Kiểm tra trực tiếp GitHub: đúng repository/branch, HEAD mới nhất, commit/diff/file thay đổi, GitHub Actions, logs và artifacts; không dùng SHA/trạng thái cũ trong chat làm sự thật hiện tại. Nếu chat hoặc mạng treo, kiểm tra thao tác trước khi retry; tuyệt đối không làm trùng hoặc ghi đè.  
>
> Mục tiêu là xây dựng game grand strategy Android **landscape-first** có chiều sâu hệ thống ngang tầm tham chiếu Victoria 3: Pops/needs/SOL, sản xuất và chuỗi hàng hóa, thị trường/giá/tồn kho, việc làm/lương/ownership, thương mại/logistics, ngân khố/thuế/nợ, luật/thể chế/interest groups, công nghệ, ngoại giao/diplomatic plays/subjects/alliances, quân đội/navy/fronts/supply/war support/peace, characters/events/journal, AI toàn cầu, save/load và UI bản đồ/panel giải thích quan hệ nhân quả. Historical và Sandbox dùng chung engine; dữ liệu toàn cầu phải có nguồn và đúng niên đại. APK là landscape-first. Full content sau cài đặt hướng tới khoảng **4–5 GB thực chất**, gồm đầy đủ dữ liệu gameplay/lịch sử và thư viện hình ảnh, video, animation, âm nhạc, âm thanh chất lượng cao; không ép game về 18 MB bằng cách bỏ hoặc nén mất nội dung. APK lõi có thể nhỏ nhưng không được coi là toàn bộ game. Bao phủ toàn bộ hệ thống Victoria 3 (base game và các expansion/immersion/mechanics pack gameplay đã phát hành trong mốc tham chiếu), bằng code và media độc lập, không sao chép tài sản độc quyền. Pack offline phải được kiểm chứng và chỉ tải khi người chơi chủ động đồng ý. Không làm game dọc, không làm menu giả, không padding file rỗng/trùng lặp.  
>
> Không tốn thêm phiên để lặp lại audit/kế hoạch đã có. Hãy tiếp tục **lát cắt triển khai gameplay thực tế tiếp theo được phép**; code phải tác động simulation, nối với hệ thống liên quan, có test tích hợp/regression và bằng chứng CI. Tuyệt đối tuân thủ phase gate và owner approval hiện hành; nếu bị khóa, nêu đúng blocker nhỏ nhất và xử lý theo protocol, không tự ý vượt gate. Mỗi lát cắt xong cập nhật report + AI_HANDOFF, commit/push và xác minh lại GitHub. **Báo cáo ngắn, làm nhiều hơn nói.**


## 9. Official Victoria 3 parity research starting points

Refresh the parity inventory against the official live product and released gameplay content, not an old base-game-only list. Official references checked for this clarification on 2026-11-20:

- Official Victoria 3 overview and core pillars: https://www.paradoxinteractive.com/games/victoria-3/about
- Official add-ons catalogue: https://www.paradoxinteractive.com/games/victoria-3/add-ons
- Volume 3 / The Great Wave announcement (12 March 2026), including ship designer, flagships, ship-purchase treaties, gunboat diplomacy, Japan narrative and art: https://www.paradoxinteractive.com/media/press-releases/press-release/volume-3-for-victoria-3-adds-3-significant-packs
- The Great Wave release announcement (28 April 2026): https://www.paradoxinteractive.com/media/press-releases/paradox-interactive/build-a-navy-grand-enough-for-your-ambitions
- Sphere of Influence announcement and Power Blocs/diplomacy scope: https://www.paradoxinteractive.com/media/press-releases/paradox-interactive/friendship-is-power-in-upcoming-victoria-3-expansion
- Official developer diary/news archive for current mechanics and version changes: https://www.paradoxinteractive.com/games/victoria-3/news

These sources are research entry points, not permission to copy proprietary materials. Record released vs announced/future content accurately and keep feature-by-feature evidence in the parity matrix.
