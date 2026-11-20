# PLAYER PLAYTEST TRIAGE & REDESIGN PLAN — VICTORI3 MOBILE

**Date:** 2026-11-20  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** experiment/vic3-visual-upgrade  
**Source baseline reviewed:** 477ceb078786219ca0faf202ba66d0bfac26b390  
**First implementation slice:** fcadf1d82edda6615503b79fa9a9c2532d4c197a  
**Evidence:** five owner screenshots and gameplay recording 1000100966.mp4 (85.6 seconds).  
**Status:** audit recorded; daily clock slice committed; full redesign IN_PROGRESS.

## 1. Executive conclusion

Owner feedback is valid. Several screens exist, but some core loops remain aggregate placeholders or partial mechanics. The response must be domain-model work, not only new visual skins.

A feature is complete only when its engine state, transition rules, player and AI commands, causal effects, historical data, UI, save/load and tests all work together. A decorative control does not count.

## 2. Findings from supplied screenshots/video and exact source inspection

### 2.1 Time progression — P0

At baseline, src/ui/game/controller.ts used requestAnimationFrame and SPEED_MS[5] = 0; each rendered frame therefore invoked stepMonth(). Speeds 1–4 also scheduled whole monthly passes at intervals as short as 220 ms. src/engine/simulation.ts only had stepMonth(); each month ran economy, population, politics, secession, technology, diplomacy, military, events, AI and divergence.

First correction committed: fcadf1d... adds a Gregorian day field and stepDay(), keeps the existing monthly system pipeline on month boundaries, replaces RAF progression with a one-day timer, adds date display and migrates old saves. Speed 5 is 2,000 ms/day (0.5 day/s maximum); lower speeds are slower. CI was pending at report checkpoint.

Still missing: Victoria 3-style regular six-hour tick, explicit daily/weekly/monthly/yearly tasks, dependency ordering, worker/off-main-thread scheduling, backlog/slowdown UI, target Android benchmark and process-death QA. Do not run the whole monthly pipeline four times per day and call that parity.

### 2.2 Nguyễn-era identity — P0

The country badge shows a generic red V shield rather than an era-appropriate Nguyễn imperial symbol; no ruler portrait appears.

In historical_data/assets/identity_assets.json, entity VNM has only coat_of_arms.VNM.0 (the Nguyễn dynastic seal, 1802–1945, metadata quality uncertain); it has no type=flag image. The common Flag component calls symbolFor(..., 'flag', year) and falls back to a generated monogram when no valid flag exists. This explains the V. It is a dataset/representation gap, not merely a CSS issue.

The VNM portrait registry contains portrait.VNM:tu_uc only. Its period is unspecified and it represents Tự Đức, not the ruler of November 1838. The registry should add the 1828 public-domain depiction of Minh Mạng in John Crawfurd's Journal of an Embassy to the Courts of Siam and Cochin-China (Wikimedia Commons identifies the illustration as 1828 and public domain), then bind it to the correct ruler, office and term. Do not show Tự Đức as the 1838 emperor.

Flag research caution: sources distinguish an imperial/royal standard from a modern national flag. A secondary source describes one Nguyễn Long Tinh banner form as 1802–1863, while the current Wikimedia “Imperial Standard of Nguyen Dynasty1” image is described as adopted in 1922. The 1922 flag must not be displayed as if it were the 1838 standard. Record exact form, date range, provenance and uncertainty; label it as an imperial standard/Long Tinh banner rather than asserting it was a modern nation-state flag without primary evidence.

### 2.3 Historical name/date — P0

The screenshot shows Việt Nam in November 1838. Vietnam National Archives and Vietnam National Museum of History sources report that the Nguyễn court changed the quốc hiệu from Việt Nam to Đại Nam in 1838, under Minh Mạng. Add date-effective display names; verify the exact effective day against the primary edict before changing the UI. Keep stable entity ID VNM separate from the historical name.

### 2.4 Technology — P1

The visible military branch looks sparse and does not communicate a full prerequisite progression.

What the code already does: src/engine/init.ts initializes each country from db.start_techs[entityId], so starting packages are keyed per country rather than intentionally identical. src/engine/systems/technology.ts enforces prerequisites, historical-year research cost and diffusion. Therefore, the accurate finding is not “all countries necessarily start identically”; the issues to audit are source coverage/quality of every start package, full technology inventory, prerequisite graph, effects/unlocks and the tree's presentation.

Victoria 3 reference: a 1.15.1 community audit of game files and matching fresh saves reports 449 starting political entities, 179 technologies and seven country-specific starting packages. Great Britain, Belgium, France, Prussia and the USA begin with the largest packages; most countries start with substantially fewer. This is corroborated community extraction, not an official Paradox statement. Use it to design a coverage audit, not to import proprietary game data.

### 2.5 Construction/economy — P1

The screenshot shows a list of profitable projects with a simple “Xếp hàng” action; it does not communicate national construction capacity, sector throughput, funding, private/public queues, input-goods constraints or useful completion estimates.

Required model: construction capacity and sector capacity; separate government and private/investment-funded queues; capacity allocation by economic law; construction goods/market prices and supply; funding status; project progress/completion; location constraints and infrastructure; workforce and owner/investment return feedback. Queue priority/cancel rules must be explicit. AI and player must use the same construction command/rule path.

Victoria 3 reference: Paradox Dev Diary #71 describes capacity split between Private and Government queues according to economic law, with unused allocation available to the other queue; private projects are funded by the Investment Pool and construction-good market prices. Dev Diary #76 describes queue dependency/performance redesign. Current game patch notes also mention port and trade-center auto-expansion. Reproduce mechanics independently; do not copy Paradox code, assets or text.

### 2.6 Military — P1

The screenshot exposes only manpower and ship targets; there is no visible recruitment order, division/formation hierarchy, detailed battle progression or battle report.

Code baseline: Country.army is a national manpower/target/quality/morale/supply aggregate; Country.navy is aggregate ship strength/quality/target; War.battles is a numeric count. The monthly military system adjusts a national manpower pool and resolves abstract battles. Real unit/formation/battle objects do not yet exist.

Required model: historical unit types and unlocks; recruit/raise/reinforce/disband; battalion/ship strength, manpower, equipment, readiness, organization, training, supply, casualties and experience; command hierarchy suited to country and period; general/admiral assignment; mobilization and conscription; front/order/advance/defend/strategic redeploy; routes and supply; actual battle records with participants, commander, location, terrain, start/end, committed units, casualties, demoralized/retreated units and result. Do not synthesize divisions by splitting current national manpower; units must be recruited and supplied through engine rules.

Victoria 3 reference: Paradox Dev Diaries #44 and #77 describe front advancement, general-led battle selection, combat width/infrastructure limits and battle information, including committed units and demoralized manpower. Later patches continue to refine naval and army behavior; re-check current 1.15.2 rules before designing unit templates and commands.

### 2.7 Diplomacy — P1

The treaty tab reports “Chưa có hiệp ước nào” and has no clear negotiation/offer/signature loop.

Code baseline: treaty state and some Alliance/Guarantee/Customs Union actions exist, but there is no general article-based diplomatic proposal/counteroffer/ratification workflow. A treaty ledger alone is not a functioning negotiation system.

Required flow: open target country → select diplomatic action → draft one or more treaty articles → validate prerequisites/costs/influence/obligations → send proposal → AI/player accepts, rejects or counteroffers → ratify → track active terms → renewal, withdrawal, breach, penalties, expiry and history. Keep directional and mutual terms distinct. Add diplomatic plays with primary demands, participants, sway/offer, backing down, escalation, war transition and negotiated peace. Customs union, Alliance, Defensive Pact, Guarantee, NAP, access and reparations cannot be collapsed into one generic alliance.

Victoria 3 reference: Dev Diary #146 describes diplomatic treaty articles and negotiated agreements; the 1.15.0 update adds/updates treaty-like historical outcomes for state/money transfers. Vic3 Tabula's 1.15.0 extraction lists 34 treaty articles, including mutual Alliances and Defensive Pacts and directed Guarantee Independence; this is third-party reference material.

### 2.8 Overall UI/UX — P1, continuous

The current UI reads as dark framed windows and data cards. It lacks the depth hierarchy, iconography, portraits, flag/identity blocks, visual feedback, contextual explanations and focused action flows expected from a premium grand-strategy interface. Redesign must go beyond recoloring cards.

Required design direction:
- Consistent typography/spacing, fewer nested boxes, strong country/region identity.
- Properly licensed historical portraits, imperial standards/arms and character biographies; honest neutral fallback where provenance is missing.
- Actionable status, resources, market/budget trends and tooltips that expose causal calculations.
- Construction: capacity meter, public/private lanes, funded projects with material/progress/ETA.
- Military: force composition, recruitment orders, formations, commanders, orders and live battle cards/timeline.
- Diplomacy: target dossier, relationship status, selectable treaty articles, proposal/counteroffer and active agreement ledger.
- Technology: complete horizontally scrollable graph with categories/eras, prerequisites, known/available/locked state, national starting data and searchable unlocks.
- Keep landscape-first strategy map while making portrait sheets usable; avoid text clipping and hidden actions.

## 3. Victoria 3 reference facts

| Domain | Reference behavior | Evidence |
|---|---|---|
| Clock | Regular tick = six game hours; distinct daily, weekly, monthly, yearly tasks and dependencies | Paradox Dev Diary #76 |
| Construction | Capacity split between Government and Private queues; private projects depend on Investment Pool funding and market construction-good prices | Paradox Dev Diary #71 |
| Military | Front advancement precedes battle; generals and battalions determine battle force selection; reports show committed/demoralized manpower | Paradox Dev Diaries #44/#77 |
| Technology | Three branches and prerequisite graph; distinct country starting packages | Vic3 Tabula 1.15.0 + qualified 1.15.1 community audit |
| Diplomacy | Article-based agreements; distinguish mutual and directed terms such as Alliance and Guarantee Independence | Paradox Dev Diary #146 + Tabula 1.15.0 |
| Current version | 1.15.2 hotfix is live; patch includes automatic ship replacement and company/AI fixes | Official Victoria 3 Steam announcement |

## 4. Proposed implementation order and acceptance gates

### P0-A — Calendar/pacing (first slice committed; CI pending)
Daily calendar, FPS-independent scheduler, speed ceiling, legacy-save migration. Next: six-hour regular tick/task graph after dependency and migration design.
Acceptance: same seed/commands/logical date yields identical state across frame rates; pause/background does not fast-forward; Gregorian calendar correct; no lost months; speed 5 never exceeds 0.5 day/s; device performance and thermal tests.

### P0-B — Historical identity and date-aware naming
Add a period-correct Nguyễn imperial standard with exact provenance/uncertainty; add Minh Mạng's 1828 public-domain portrait and character-term binding; repair VNM identity registry and renderer. Add date-effective name timeline Việt Nam → Đại Nam, with exact effective day verified against primary sources.
Acceptance: in November 1838 UI shows Đại Nam, period-appropriate standard and Minh Mạng portrait; date progression selects the right asset/name; source/author/license/period are recorded; no 1922 standard appears in 1838.

### P1-A — Construction/economy
Construction capacity/sectors, public/private queues, goods/materials, funding, workforce, ETA, AI and save/load.
Acceptance: prices/shortages/capacity/funding alter completion; queues respect allocation; player/AI use shared rules; no instant free buildings.

### P1-B — Country-specific research
Audit every historical entity's starting package; complete tech registry/prerequisites/effects/unlocks and tree interaction.
Acceptance: no universal package; each country gets its own sourced start data; technology unlocks concrete production/legal/military actions; diffusion/cost is deterministic.

### P1-C — Recruitable military and battle timeline
Recruitment, units/battalions/ships, formations, commanders, mobilization, fronts/orders/logistics, battle reports and peace integration.
Acceptance: recruits cost POP/money/equipment/time; formations enter fronts; movement/supply/terrain/technology affect outcomes; casualties and equipment update; save/load across battles is deterministic.

### P1-D — Diplomatic negotiation and plays
Offer/counteroffer/ratification/active treaty lifecycle plus diplomatic plays and peace settlement.
Acceptance: proposals validate requirements/cost; AI has explainable accept/reject/counter; obligations execute; breach/withdrawal/expiry penalties work; no treaty appears without a successful state transition.

### P1-E — Visual system and usability, throughout
Rebuild screens as cohesive information-and-action spaces using independent design and licensed images.
Acceptance: touch targets work; no clipped labels/hidden actions; state and causality are clear; UI mutates state only through commands; device landscape/portrait validated.

## 5. Integrity and licensing

Do not copy Victoria 3 executable/source code, extracted game databases, icons, fonts, portrait art, UI screenshots or localization. Use references to derive independent mechanics. Historical art/symbols need source, author, date/period, license, local derivative path and attribution. A historical banner is not automatically a national flag. Prefer public-domain/CC0 or compatible licenses, verify rights of insignia, and mark uncertainty. Never invent historical numbers.

## 6. Sources

1. Paradox, Dev Diary #76 — Performance: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-76-performance
2. Paradox, Dev Diary #71 — Autonomous Investment in 1.2: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-71-autonomous-investment-in-1-2
3. Paradox, Dev Diary #44 — Battles: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-44-battles
4. Paradox, Dev Diary #77 — Military Improvements: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-77-military-improvements
5. Paradox, Dev Diary #146 — Diplomatic Treaties (official news index): https://www.paradoxinteractive.com/games/victoria-3/news
6. Official Victoria 3 Steam announcements, Hotfix 1.15.2: https://steamcommunity.com/app/529340/announcements/
7. Vic3 Tabula 1.15.0 reference: https://vic3tabula.com/en/treaties ; https://vic3tabula.com/en/tree
8. Jane, 1.15.1 starting technology/army/laws community audit: https://steamcommunity.com/sharedfiles/filedetails/?id=3819427569
9. Vietnam National Archives, Nguyễn-era era-name/edict records: https://www.archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/quy-dinh-ghi-nien-hieu-tren-van-ban-trieu-nguyen-1802-1945.htm
10. Vietnam National Archives, historical quốc hiệu: https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/quoc-hieu-viet-nam-quan-cac-thoi-ki-lich-su.htm
11. Vietnam National Museum of History, Minh Mạng and Đại Nam edict: https://baotanglichsu.vn/vi/Articles/3096/12689/minh-mang-djat-quoc-hieu-djai-nam-qua-moc-ban-trieu-nguyen.html
12. Wikimedia Commons, Minh Mang.gif (1828 John Crawfurd illustration; public-domain declaration): https://commons.wikimedia.org/wiki/File:Minh_Mang.gif
13. VOER, Quốc kỳ Việt Nam (secondary source for Long Tinh banner period; cross-check before use): https://www.voer.edu.vn/m/quoc-ky-viet-nam/729b029c
14. Wikimedia Commons, Imperial Standard of Nguyen Dynasty1.svg (described as adopted 1922; not valid for an 1838 scene): https://commons.wikimedia.org/wiki/File:Imperial_Standard_of_Nguyen_Dynasty1.svg

## 7. Current implementation/validation status

- Clock/calendar: daily calendar and independent timer committed as fcadf1d...; Actions #462 pending at report checkpoint.
- Identity/banner/portrait: audit only; no asset added yet. VNM identity gaps verified.
- Construction: audit only; no new construction mechanics committed in this playtest slice.
- Technology: source confirms per-country start_techs lookup; full data/coverage audit pending.
- Military: aggregate-only model confirmed; no recruitable formation/battle-domain implementation committed in this slice.
- Diplomacy: treaty ledger and some existing actions; full negotiation loop absent.
- Overall parity NOT_COMPLETE. Device QA NOT_TESTED. Independent review PENDING. Owner acceptance PENDING.


## 10. Verified implementation slice — date-gated current historical office

- Current ruler selection in the country panel now requires both a matching engine leader name and a historical `head_of_state` term that covers the actual Gregorian game date. This prevents an out-of-period portrait from appearing simply because the names match.
- Historical sources can be year-only, month-only or full-date. The resolver maps year/month starts and inclusive ends to the corresponding full Gregorian boundaries; impossible dates and malformed dates fail closed.
- The current dataset terms include Minh Mạng 1820-02-14 to 1841-01-20, Thiệu Trị from 1841-02-11, and Tự Đức from 1847-11-10. In November 1838, only Minh Mạng's term is valid.
- Added `tests/historical-identity.test.ts` for Nguyễn succession, inclusive endpoints, source precision, invalid dates and Gregorian leap years.
- Exact-source build/test/APK CI is required before calling this slice verified. Physical-device QA is still separate.

## 11. Campaign end-year blocker — extended to cover all of 2026 (CI pending)

- The simulation had a hard stop at January 1936 (`GAME_END_YEAR=1936`), contradicting the owner-approved 1836–2026 campaign scope. The terminal marker is now January 2027, which allows every month/day in 2026 to run.
- Updated `src/engine/simulation.ts`, the campaign status panel in `src/ui/screens/World.tsx`, and the package description. The UI now labels the playable range as 1836–2026 and the exclusive stop boundary as 01/01/2027.
- Added regression coverage for the full December 2026 boundary and legacy saves already beyond the new terminal tick. Existing monthly `tick` semantics remain unchanged.
- Important qualification: this removes the artificial 1936 stop; it does not add missing post-1949 technologies, post-1936 historical events, modern institutions, or modern military equipment. Those require separate sourced content and system implementations. Physical-device performance through 2026 must also be measured.