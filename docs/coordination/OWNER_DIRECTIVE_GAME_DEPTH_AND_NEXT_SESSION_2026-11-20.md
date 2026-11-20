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

The target covers the breadth of Victoria 3's major systems, independently implemented and adapted for Android:

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

## 3. Visual identity, assets and historical quality

- Replace generic repeated metric/table screens with domain-specific command centers and clear information hierarchy.
- Landscape map remains the center of play; panels, lenses, alerts, context navigation, tooltips and dialogs must be readable and usable on a phone.
- Use period-appropriate, geographically valid flags, coats of arms, portraits, maps and event/building imagery where rights and sources permit. Generic icons are not a substitute for all missing identity assets.
- Measure historical data/asset coverage by entity and date. Missing/uncertain facts remain visibly missing/uncertain.
- Use original implementation and original/licensed/public-domain material. Victoria 3 is a design reference only; do not copy its source, extracted assets, text, music or proprietary data.

## 4. APK size, offline data and storage

The owner is dissatisfied that the current app is small and lacks the expected gameplay depth. This is a **gameplay/content completeness problem**, not an instruction to inflate the APK with arbitrary files.

- Keep the base APK reasonably sized and installable.
- Where approved, deliver large historical datasets, maps and optional high-resolution assets through a real, user-controlled offline data-pack system.
- The existing approximately **4–5 GB** owner allowance is a capacity/overall full-content allowance across packs, **not a minimum download, not a requirement to fill storage and not an APK-size target**.
- Distinguish compressed download size, expanded storage, temporary staging and runtime/decoded memory.
- Explicit user action is required before network access/downloads. No silent mobile-data use, no mandatory paid service, and no executable code in data packs.
- Verify provenance/licensing, signed manifest, per-file hashes, compatibility, resumable downloads, atomic activation, rollback and full offline campaign operation before claiming the pack system works.
- APK size, installed size, asset count and menu count are not proxies for gameplay depth.

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
- Build log: 502 bundled image records / 8,715,750 bytes of generated image assets (176 flags, 99 coats of arms, 227 portraits). This is not a full offline pack collection and does not prove complete historical visual coverage.
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
> Mục tiêu là xây dựng game grand strategy Android **landscape-first** có chiều sâu hệ thống ngang tầm tham chiếu Victoria 3: Pops/needs/SOL, sản xuất và chuỗi hàng hóa, thị trường/giá/tồn kho, việc làm/lương/ownership, thương mại/logistics, ngân khố/thuế/nợ, luật/thể chế/interest groups, công nghệ, ngoại giao/diplomatic plays/subjects/alliances, quân đội/navy/fronts/supply/war support/peace, characters/events/journal, AI toàn cầu, save/load và UI bản đồ/panel giải thích quan hệ nhân quả. Historical và Sandbox dùng chung engine; dữ liệu toàn cầu phải có nguồn và đúng niên đại. APK là landscape-first; dữ liệu lớn dùng pack offline có kiểm chứng và chỉ tải khi người chơi chủ động đồng ý. Không làm game dọc, không làm menu giả, không dùng số lượng file/asset hay dung lượng APK để giả vờ có chiều sâu.  
>
> Không tốn thêm phiên để lặp lại audit/kế hoạch đã có. Hãy tiếp tục **lát cắt triển khai gameplay thực tế tiếp theo được phép**; code phải tác động simulation, nối với hệ thống liên quan, có test tích hợp/regression và bằng chứng CI. Tuyệt đối tuân thủ phase gate và owner approval hiện hành; nếu bị khóa, nêu đúng blocker nhỏ nhất và xử lý theo protocol, không tự ý vượt gate. Mỗi lát cắt xong cập nhật report + AI_HANDOFF, commit/push và xác minh lại GitHub. **Báo cáo ngắn, làm nhiều hơn nói.**
