# Victoria 3–class system rebuild plan — 2026-11-20

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `experiment/vic3-visual-upgrade`  
**Design baseline:** `c1178d1dad35d77f43264894b61142076a9c3be6`  
**Owner mandate:** full technical execution delegated in `docs/coordination/OWNER_IMPLEMENTATION_AUTHORIZATION_2026-11-20.md`.  
**Status:** design / sequencing record; no claim of feature parity or device acceptance.

## 1. Product target and non-negotiable boundaries

Build an original grand-strategy simulation with a connected world economy, population, political institutions, diplomacy, military logistics, research and country AI, playable from 1836 through 2026. Victoria 3 is a mechanics reference, not a source-code, data, art, UI or localization source. All game code and presentation remain original. Historical content must carry source provenance, date range and quality/confidence. Missing evidence is not silently filled with invented numbers.

The current APK is an incremental checkpoint, not a completed remake. It proves a build can be generated at the current source commit; it does not prove physical-device performance, release signing, full historical coverage or parity.

## 2. Current verified baseline

### 2.1 Calendar and campaign boundary

- A daily Gregorian calendar and FPS-independent timer were added in `fcadf1d`.
- Current simulation still advances the expensive economy, population, politics, technology, diplomacy, military, events and AI pipeline only at month boundaries. There is not yet a six-hour regular tick or cadence task graph.
- The exclusive campaign end marker is now 2027-01-01, so the whole 2026 calendar year is playable. This is a timeline boundary correction only; modern content and system rules are not yet populated to the same depth.
- Speed 5 is owner-capped at no more than 0.5 Gregorian game-day per real second. That is a design ceiling, not an Android benchmark.

### 2.2 Country identity

- The 1838 Vietnam polity is rendered as Đại Nam according to Vietnamese National Archives / Nguyễn woodblock evidence for Minh Mạng's 1838 name change.
- Minh Mạng's 1828 public-domain portrait is packaged through a build-time asset downloader with fixed content hash and bounded retry.
- Current ruler portrait matching now requires the engine ruler name plus a source-dated head-of-state term covering the current Gregorian game date.
- A historically verified *national flag* for Đại Nam in November 1838 is still not committed. The Nguyễn seal/arms asset is not to be relabelled as a flag; the 1922 Long Tinh standard must not be shown as an 1838 flag.

### 2.3 Technologies — evidence from current data builder

- The technology registry has 48 nodes across Production, Society and Military, with 3 branches.
- Historical years: 13 before 1836; 12 in 1836–1850; 20 in 1851–1899; 3 in 1900–1949; zero after 1949.
- Three broad global start tiers exist (plus frontier) and five explicit overrides: PRU, BEL, USA, FRA, SAX. This does not provide a documented country-by-country start package.
- The 11 detailed country records include 10 authored `technology.level` facts; most 136 core country profiles have no technology fact and fall through to a coarse region tier/default. Four countries are additionally hardcoded as advanced in `tools/build-data.ts`.
- The intended Victoria 3 architecture is one shared three-branch graph, with countries differing by researched starting nodes, prerequisites, innovation capacity and diffusion—not a separate unrelated tech tree per country.
- Research/diffusion logic is currently monthly. A weekly diffusion rule cannot be implemented faithfully until the cadence scheduler exists.

### 2.4 Construction — current code

- Each country has one public `constructionQueue`, capacity 20. It has a state investment pool and a private investment pool display/funding mechanism.
- `advanceConstruction` advances only the first project in the national public queue, one project per country per monthly simulation pass.
- Private construction can occur through an immediate build path; it is not a distinct queued/capacity allocation pipeline.
- There is no national construction-sector capacity distributed over several projects each week, nor a complete sector workforce / production-method / construction-goods model.

### 2.5 Military — current code

- Current country military state is aggregate army manpower and navy ship targets.
- Wars retain aggregate sides, goals, score, exhaustion, occupied regions and a scalar battle count.
- There are no persisted battalion/recruitment orders, formations, generals, HQs, fronts, battle rounds or structured battle reports.
- This must not turn into a tactical RTS: use strategic fronts, orders, battalion allocation, battle resolution and logistics.

### 2.6 Diplomacy — current code

- Existing treaty records are active agreements with type, members, start/end/source and a small terms object.
- Player “proposals” currently call `formAlliance` / `formDefensivePact`; when accepted by preconditions, they immediately create the active treaty. There is no draft/offer lifecycle, counteroffer, recipient response, ratification, article list, binding duration or breach state.
- The treaty tab is a ledger; it is not an offer inbox or negotiation workbench.
- Existing safeguards retained: treaty withdrawal by exact source treaty ID, preservation of overlapping historical pacts, and pure RNG-free war previews.
- User-requested multi-alliance capacity is a project-specific extension. Do not misstate it as vanilla Victoria 3's 1.15.0 rule; keep each treaty bilateral unless a later owner-approved multilateral design is specified.

## 3. Target mechanics and vertical slices

### CLK-B — six-hour regular tick and cadence scheduler

**Architecture**
- One logical regular tick = six in-game hours; four ticks/day; 1,460 ticks/year in a non-leap year.
- Scheduler uses a stable integer tick and explicit due-task queue. Task cadences: regular, daily, weekly, monthly, yearly.
- Each task has a stable ID, cadence, dependency list, execution order, state ownership and deterministic seed/input boundary.
- Avoid running expensive economy clearing four times/day. Regular tick should process only systems designed for that cadence; population, economy, politics, diplomacy, construction and strategic AI execute at their declared cadence.
- Weekly/monthly tasks have explicit “last processed period” or derived tick gates to prevent double-run on load and month/year transitions.
- Rendering is a read-only observer. UI previews must not mutate RNG or consume simulation time.
- Background lifecycle pauses and does not catch up elapsed wall-clock time; speed 5 stays at or below owner ceiling.

**Acceptance**
- Same seed + same command stream + same logical tick sequence -> byte-identical deterministic state and event journal.
- Cadence tasks run exactly once at boundaries, including 28/29/30/31-day months and year transition.
- Save/load mid-day and mid-cadence preserves due task state and has no duplicate/missed execution.
- Tests prove frame rate/render count has no effect.
- Performance profiling proves the scheduler does not trigger unbounded catch-up or UI-thread ANR.

### TECH-START — country-specific 1836 knowledge

**Architecture**
- Retain three shared technology branches and a prerequisite graph.
- Replace broad tier-only assignment with authored country packages keyed by entity ID and as-of date: known technology IDs, inferred knowledge level, source references, confidence, and explicit “unknown / not researched” notes.
- No silent universal package. If source data is incomplete, use a conservative documented fallback and mark it estimated.
- Remove hardcoded country-name exceptions from builder once equivalent source-backed entries exist.
- Research must check prerequisites and effects; technology unlocks production methods, institutions, laws, military equipment/doctrine or construction capabilities through engine commands.
- Add weekly knowledge diffusion as a separate deterministic rule when a country knows an eligible tech, weighted by literacy, trade/exposure and institutional factors; avoid immediate global spread.
- Extend historical nodes into 1950–2026 only with source-backed developments and meaningful game effects.

**Acceptance**
- Every playable entity's starting package is inspectable and traceable to a source or explicitly flagged estimate.
- No country receives modern technologies merely because it shares a broad tier.
- AI chooses legal research and spreads knowledge deterministically.
- The 1836 and 2026 trees have no missing prerequisite IDs, duplicate IDs or unhandled effect keys.

### CONSTRUCTION — national capacity and split investment

**Architecture**
- Introduce Construction Sector buildings/production methods that generate national construction points per week from workers, tools, steel, engines and infrastructure where applicable.
- Keep one nationally ordered project list, but allocate weekly capacity across multiple active projects according to priority/order and regional modifiers. Do not advance only queue[0].
- Distinguish Government and Private queues/investors with explicit ownership, funding pool, project status and construction point allocation.
- Private queue selection depends on investment law, eligible owners, expected return, market demand and profitability; players should not directly micromanage autonomous private investors unless a relevant law/institution enables it.
- Costs consume market goods at actual market prices. Funding, pauses, shortages, occupation, ownership change and cancellations must have explicit behavior.
- ETA must be an estimate derived from current available capacity and material access, not a fixed timer.

**Acceptance**
- Multiple projects advance during the same week when capacity exists.
- Capacity shortage, goods price and workforce shortages change ETA/completion.
- Government budget and private investment are separate, auditable flows.
- Save/load, cancellation, conquered regions and AI use the same command/rule path.

### MILITARY — recruitable forces, fronts and battles

**Architecture**
- Add recruit/conscription orders tied to state/region barracks, population, wage, equipment, budget and time. Recruitment cannot create manpower instantly.
- Represent battalions as the recruitable/tactical-economic unit. Group battalions into country formations/armies under generals/HQ. Naval flotillas/ships are a separate model.
- Add commander traits, availability, rank, employment and general assignment; AI uses the same validation/commands.
- Fronts form from hostile borders / theatre topology; strategic orders are advance, defend, hold or strategic objective. No direct free movement of arbitrary troops.
- War tick progresses order preparation and front advance; battles occur at a selected strategic location with combat width, terrain, supply, equipment, technology, command and morale.
- Persist BattleRecord with date/location, committed battalions, commander, rounds, casualties, killed/wounded/captured, morale, retreat/occupation and result. UI timeline/report derives from that state.
- Peace settlement integrates occupied states, war goals, treaty articles and war exhaustion.

**Acceptance**
- Every recruit consumes a legal source of population, money, equipment and time.
- Every formation belongs to exactly one owner/HQ/front at a time.
- Battle outcomes are deterministic from saved RNG and explainable input factors.
- Save/load during recruiting, mobilization, battle and front movement preserves outcomes.
- AI and player can only use the same legal commands.

### DIPLOMACY — offer negotiation and treaty articles

**Architecture**
- Add a persisted DiplomaticOffer object separate from active Treaty. Lifecycle: DRAFT -> PENDING -> COUNTERED -> ACCEPTED/SIGNED, REJECTED, WITHDRAWN, EXPIRED or BREACHED.
- A draft contains parties, treaty category, article list, proposer, recipient, created tick, expiry tick and parent/counteroffer reference.
- Article model must distinguish mutual and directed obligations. Initial scope: alliance, defensive pact, non-aggression, guarantee independence, access/market access, transfer/subject terms only after their domain rules exist.
- Recipient can accept, reject or counter; counteroffer creates a new proposal and archives original rather than mutating signed agreements.
- The active treaty is created only after a successful accepted state transition. Existing historical treaty data must remain active after save migration.
- Duration/binding term, withdrawal, penalties and breach are explicit. No free arbitrary cancellation if the treaty term is binding.
- Player and AI use the same offer acceptance/rejection/counteroffer functions; AI explanation cites relation, power balance, interests, obligations and current wars.
- Diplomatic plays should be a separate multi-step escalation/de-escalation system, not simply a war button.

**Acceptance**
- No active treaty is created by pressing “propose”.
- Every state transition is validated and recorded; counters and history survive save/load.
- A treaty article is enforceable by war calls, access, guarantee, market and economic obligations.
- Expiration, withdrawal, breach and penalties are tested deterministically.

### IDENTITY + VISUAL UX

- Separate flag, coat-of-arms/dynastic seal and portrait asset types with date-valid intervals, provenance and licence. Never substitute one category for another.
- Create a country/period identity renderer with a proper fallback that communicates missing provenance, not a generic initial where an asset is available.
- Redesign all screens as a shared information system: high-contrast hierarchy, coherent density, state-change feedback, causal tooltips, mobile touch targets and responsive drawers. Maintain an original visual language.
- UI is read-only except through command APIs; no simulation rules or random mutation inside render.

**Acceptance**
- Every image has a date interval, source/license and verified local hash.
- No image appears outside its valid date/subject.
- Screens show actionable decisions, consequences and current state; touch targets and all text are validated on supported Android aspect ratios.

## 4. Implementation sequencing

1. **CLK-B scheduler foundation** — define task graph, migration, determinism and cadence tests before changing speed mapping.
2. **TECH-START data provenance** — source-backed individual start packages and diagnostics, then weekly diffusion after CLK-B.
3. **Construction capacity allocator** — capacity producers, multiple simultaneous projects, government/private paths and goods consumption.
4. **Military domain model** — recruitment, battalion/formation/general/HQ, front, BattleRecord and peace integration.
5. **Diplomatic offer lifecycle** — drafts, offers, responses, counters, signing, binding term and enforcement.
6. **Unified UI/visual overhaul** — rebuild surfaces on stable commands/domain models; historical identity art continues in parallel.
7. **1836–2026 content completion and integration** — modern laws/technologies/equipment/events, world trade/transport, save migration and balance/performance passes.

Each slice must be independently reviewable: exact base/head SHA, file list, source/provenance changes, unit/simulation/integration tests, save/load migration, CI and APK artifact, risks, device QA status and handoff. Avoid cross-cutting rewrites in one oversized commit.

## 5. Victoria 3 references (mechanics only)

- Paradox, Dev Diary #76 — Performance / six-hour tick and task cadence: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-76-performance
- Paradox, Dev Diary #36 — Construction: https://steamcommunity.com/games/529340/announcements/detail/3114807061127275120
- Paradox, Dev Diary #71 — Autonomous Investment: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-71-autonomous-investment-in-1-2
- Paradox, Dev Diary #44 — Battles: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-44-battles
- Paradox, Dev Diary #77 — Military Improvements: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-77-military-improvements
- Paradox, Dev Diary #146 — Diplomatic Treaties: https://forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-146-diplomatic-treaties.1747195/
- Extracted in-game localization/structure reference only: https://vic3tabula.com/en/tree and https://vic3tabula.com/en/treaties
- Vietnam National Archives / Đại Nam woodblock context: https://luutru.gov.vn/chu-de-trien-lam.htm?exhibitionId=d3c49b5e-549b-4ae9-b993-bdfe26277075&themeId=3d25f79f-558f-43d2-b2f2-9cb89b0c0969

These references are design evidence, not permission to copy protected source, assets or text. Vanilla Victoria 3 rules (including its 1936 end date and bilateral treaty constraints in the cited version) may be deliberately extended by this project to satisfy the owner-approved 2026 / multilateral-alliance scope; mark those as project extensions.

## 6. Status gates at baseline c1178d1

| Domain | Implementation status | CI status | Device status |
|---|---|---|---|
| Daily calendar + speed timer | PARTIAL; no six-hour task graph | PASS through #468 | NOT_TESTED |
| 1836–2026 end marker | Implemented; content not complete | PASS #468 | NOT_TESTED |
| Đại Nam name + Minh Mạng portrait date guard | Implemented for current verified asset | PASS #467/#468 | NOT_TESTED |
| 1838 Đại Nam national flag | NOT_IMPLEMENTED (no verified asset) | NOT_TESTED | NOT_TESTED |
| Country start technology | PARTIAL; broad tiers + five overrides | baseline builder passes | NOT_TESTED |
| Construction | PARTIAL; single queue head advances monthly | baseline tests pass | NOT_TESTED |
| Recruitment/armies/battles | NOT_IMPLEMENTED as detailed domain model | no new slice | NOT_TESTED |
| Treaty negotiation lifecycle | NOT_IMPLEMENTED; immediate sign after checks | existing treaty tests pass | NOT_TESTED |
| Visual redesign | PARTIAL / old screens remain | no visual acceptance | NOT_TESTED |
| Modern 1936–2026 content | NOT_IMPLEMENTED at required depth | no content completeness gate | NOT_TESTED |

**Overall Victoria 3–class parity: NOT_COMPLETE.**  
**Physical Android QA: NOT_TESTED.**  
**Independent review: PENDING.**  
**Owner acceptance: PENDING.**

## 7. Next task at end of this plan

Begin with **CLK-B scheduler foundation** (not a blanket rewrite to 4 ticks/day). Inspect all systems and classify each into cadence, derive deterministic period boundaries, migrate existing monthly tick/save fields additively, and add tests before moving any gameplay logic. Do not let the six-hour base tick execute monthly economy/society systems four times per day.
