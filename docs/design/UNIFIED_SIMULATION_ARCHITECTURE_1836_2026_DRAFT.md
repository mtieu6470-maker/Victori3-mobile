# UNIFIED SIMULATION ARCHITECTURE — VICTORI3 MOBILE 1836–2026

**Ngày:** 2026-11-20  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** experiment/owner-authorized-clock-runtime  
**Trạng thái:** DRAFT — kiến trúc tích hợp và kế hoạch triển khai; chưa phải implementation authorization  
**Phạm vi sản phẩm:** hai luồng liên kết: (A) chiến dịch lịch sử 1836–2026 và dữ liệu theo thời gian; (B) chiều sâu mô phỏng kinh tế, POP, chính trị/thể chế, công nghệ, ngoại giao/chư hầu, quân đội/hậu cần và AI.

---

## 1. Mục tiêu và nguyên tắc không được phá vỡ

Victori3 Mobile phải phát triển thành grand-strategy simulation có thể chơi xuyên suốt từ 1836-01-01 đến hết 2026-12-31, với chiều sâu hệ thống tăng dần theo từng thời đại. Hai luồng không thể phát triển tách biệt hoàn toàn:

- Luồng A định nghĩa **thế giới nào tồn tại ở từng thời điểm**: quốc gia, biên giới, nhân vật, công nghệ, thể chế, kinh tế, chiến tranh, hiệp ước, sự kiện và các thay đổi lịch sử.
- Luồng B định nghĩa **thế giới vận hành như thế nào**: POP, sản xuất, thị trường, ngân sách, luật pháp, tổ chức chính trị, nghiên cứu, ngoại giao, quân đội, hậu cần, AI và hậu quả của quyết định người chơi.

Các nguyên tắc bắt buộc:

1. Historical và Sandbox dùng cùng một engine, cùng quy tắc vật lý/xã hội và cùng lịch. Khác nhau ở scenario initialization, historical events/bias và quyền quyết định AI/người chơi, không phải ở việc một mode có hệ thống đầy đủ hơn mode kia.
2. Mọi hệ thống phải có thời điểm hiệu lực rõ ràng, cadence rõ ràng, đơn vị đo, thứ tự xử lý và nguồn dữ liệu.
3. Không chạy toàn bộ monthly economy/POP/politics/AI pipeline ở mỗi regular six-hour tick.
4. Không để FPS, refresh rate, số lần render hoặc UI callback quyết định thời gian mô phỏng.
5. Không bỏ logical tick, task deadline, sự kiện hoặc nghĩa vụ hiệp ước một cách im lặng khi thiết bị chậm. Được phép slowdown và thông báo backlog.
6. Save phải deterministic, versioned, có migration được kiểm chứng và không ghi đè bản gốc khi migration lỗi.
7. Mọi số liệu lịch sử phải có provenance, observation year, định nghĩa, đơn vị, độ tin cậy và license; không biến ước lượng thành dữ kiện chính xác.
8. Chỉ tái tạo design concepts ở mức chức năng. Không sao chép code, artwork, UI assets, text, data tables hay nội dung có bản quyền của Victoria 3.

## 2. Đường cơ sở kỹ thuật đã xác minh

### 2.1. Calendar và engine hiện tại

Tại source snapshot được đọc trong lần thiết kế này:

- GameDate hiện chỉ có year và month; chưa có day/hour.
- GameState.tick là monthly tick.
- stepMonth() tăng tick, tính ngày tháng kế tiếp bằng tickToDate(), sau đó chạy toàn bộ system pipeline.
- Campaign hiện đóng tại GAME_END_YEAR = 1936.
- Save v1 lưu toàn bộ GameState dưới JSON, có version = 1; date lưu ở cấp tháng.
- Clock runtime experiment S1-CLK-01 đã tách controller khỏi RAF, nhưng chưa thay monthly logical tick.

### 2.2. Các hệ thống hiện tại

| Hệ thống | Hiện trạng quan sát được | Khoảng trống cần giải quyết |
|---|---|---|
| Economy | 12 goods, 10 building types; tính production, demand, employment, market price, finance, construction theo monthly pipeline; market stats có supply/demand/imports/shortage | Chưa có stock ledger/inventory đầy đủ, reserved goods, in-transit cargo, warehouse capacity, route capacity, firm cash-flow và stock-based price settlement |
| POP | 9 strata aggregate; annual birth/death rates được chia theo 12 để chạy monthly; có migration, literacy và employment flows | Chưa có age cohorts, dependency ratio, household balance sheet, cohort transitions theo tuổi, đầy đủ labor-force participation và historical demographic calibration |
| Politics | 8 interest groups cố định; clout/approval, laws, reform progress, legitimacy, radicalism và probabilistic revolution checks | Chưa có parties/elections/mandates, cabinet, parliamentary seats, movements, constitutional structure, federal/devolution layers và đầy đủ institutional capacity |
| Diplomacy | relation drift, rivalries, alliance, guarantee, customs union; direct war declaration; subject model dùng owner/subjectType scalar | Chưa có diplomatic play/escalation phases, treaty clauses/expiry/enforcement, subject autonomy/obligations, sway/neutrality và multi-party crisis lifecycle |
| Military | aggregate manpower/target/quality/morale/supply; navy aggregate strength/target/quality; war resolved monthly | Chưa có unit composition, equipment inventories/reserves, commanders, fronts, orders, operational movement, depot/convoy logistics, battle phases và mobilization lifecycle |
| Technology | technology IDs/prerequisites, research points monthly, diffusion discount dựa trên known share | Chưa tách research/access/diffusion/adoption/deployment/operational readiness và chưa đủ modern technology/institution coverage tới 2026 |
| AI | monthly utility/heuristic decisions; actions được stagger theo nhiều tháng | Chưa có strategic plans, budget horizons, diplomacy play strategy, operational military planner, long-horizon industrial/technology strategy và explainable intent |

Đây là source characterization, không phải kết luận rằng các hệ thống hiện tại vô dụng. Chúng là nền móng cần được mở rộng có kiểm soát, không nên thay toàn bộ cùng lúc.

### 2.3. Source blobs đã đọc

Các SHA dưới đây giúp tái lập chính xác snapshot được phân tích; reviewer/implementer phải re-fetch SHA ở branch HEAD mới trước khi dùng:

| File | Blob SHA |
|---|---|
| src/engine/types.ts | f3062911854fa1c2c8525b4685830785042bf5b9 |
| src/engine/simulation.ts | 19b6dd1e6487310e1694c56dc21c1daae9bcb422 |
| src/engine/save.ts | eaff50ef9c5e64662b1fdfd58d2eade306b9e445 |
| src/engine/clock.ts | f2995171144961a7bb7ff680af00d42d0a25a4a1 |
| src/ui/game/controller.ts | 9793d048aed1a1b217213c7193083f101dd7cbcd |
| src/engine/systems/economy.ts | 33825425d22c67a4da263fa18d09df0e517d926d |
| src/engine/systems/population.ts | aef141066fb278499904b47cbee5f5e333a2fc6d |
| src/engine/systems/politics.ts | 9180188249fb77d5447a9a1ffeaf7908930bea4a |
| src/engine/systems/diplomacy.ts | 4dc35fab32ffe36336e5e02c34523370fea90fa4 |
| src/engine/systems/military.ts | 5b36260b2eeedfb8ae978307ea97518dc2380b20 |
| src/engine/systems/technology.ts | a2a0c34a1ed71e08794da34ac1fa49f05e33d4cc |
| src/engine/ai/ai.ts | 9d6351cf1c6a77e7c870ccb60a91cf0cba08d838 |

---

## 3. Thời gian mô phỏng và scheduler đích

### 3.1. Calendar contract

- Campaign start: 1836-01-01 00:00.
- Last playable calendar date: 2026-12-31.
- Campaign completion boundary: 2027-01-01 00:00, sau khi xử lý tất cả task của ngày cuối.
- Dùng proleptic Gregorian calendar với quy tắc leap year đầy đủ.
- Một ngày có 4 regular logical steps, mỗi step 6 giờ.
- Logical step index là số nguyên tăng đơn điệu, bắt đầu tại 0 ở 1836-01-01 00:00.
- Không dùng floating-point hour accumulation làm nguồn sự thật của logical time.
- Với khoảng lịch 69.762 ngày, tổng regular six-hour steps là 279.048.

### 3.2. Relationship giữa clock, scheduler và renderer

Ba lớp phải tách rời:

1. Wall-clock pacer: chuyển monotonic elapsed time sang lượng logical time được phép tiến theo speed.
2. Simulation scheduler: xác định regular step và các cadence task đến hạn; duy trì stable order, backlog và idempotence.
3. Renderer/UI: đọc snapshot nhất quán và hiển thị trạng thái; không gọi engine step.

Speed 5 có hard ceiling do chủ dự án đặt: tối đa 0,5 Gregorian game-day mỗi real second. Ở six-hour resolution, điều này tương đương tối đa 2 regular steps/real second. Mapping Speed 1–4 đã thử ở monthly scheduler hiện tại là 0,1/0,2/0,3/0,4 game-days/second, nhưng vẫn là mapping sơ bộ cần thiết bị thật xác nhận.

### 3.3. Cadence matrix — candidate, phải đo và duyệt trước implementation

| Cadence | Công việc ứng viên | Không được làm |
|---|---|---|
| Six-hour regular step | Advance logical clock; deadlines; operation timers; movement order progress; deterministic task dispatch; immediate event triggers | Không chạy toàn bộ economy, POP, national politics, AI strategic scans hoặc market settlement |
| Daily | Tactical/logistics movement increments; convoy/route arrival; blockade pressure; battle engagement window; election/crisis deadlines; local supply depletion checks | Không tái tính toàn bộ world economy hoặc mọi country AI mỗi ngày |
| Weekly | Supply allocation, front/army operational review, route dispatch/market signals, bounded diplomacy/crisis AI review và các process có lý do cần tuần | Không cập nhật lại mọi national stock/POP cohort nếu không có dependency cần thiết |
| Monthly | Industrial production and consumption settlement; employment/wage/profit; household consumption; tax/tariff/debt/treasury; POP natural change/migration/strata; politics/law reform; research progress; treaty upkeep; force maintenance; monthly AI strategic decisions | Không dùng monthly task thay cho deadline ngày/giờ; không chạy một task nhiều lần khi scheduler resume |
| Yearly | Historical/statistical snapshots, annual reports, long-run capability indices, selected elections/terms where rules require | Không hard-code mọi quốc gia có election/leader change cùng một ngày |

Cadence thực tế của từng subsystem phải nằm trong registry có owner, period, stable order, dependencies, worst-case compute budget và tests. Bảng trên là candidate schedule, không phải lệnh gọi các hàm hiện tại ở cadence mới.

### 3.4. Boundary ordering và determinism

- Khi logical date tiến qua boundary 00:00 ngày đầu tháng, xử lý task theo thứ tự đã định: clock boundary → expiry/deadlines → daily/weekly due tasks → monthly economic/population/political/research/diplomacy/military settlement → annual snapshot nếu cùng thời điểm → log/event commit.
- Ordering cuối cùng phải khớp hành vi monthly engine hiện tại trong migration characterization trước khi thêm cơ chế mới.
- Mỗi task có stable ID; task recurring được tính due từ logical step/calendar, không tạo random timer.
- Task one-shot có due timestamp và idempotency key. Không execute hai lần khi load/resume.
- RNG chỉ lấy từ seeded GameState RNG theo thứ tự stable; không dùng wall-clock, Date.now hoặc object iteration order không ổn định làm random seed/order.
- Command của người chơi phải được áp dụng theo một boundary được định nghĩa trước, không trộn giữa hai logical step.
- Save/load replay phải khớp state, RNG, task cursor, logs, counters và tick index.

---

## 4. Data contracts đề xuất cho lịch độ phân giải cao

### 4.1. Calendar v2

Candidate shape:

- calendarVersion
- year, month, day, hour
- logicalStepIndex
- dayIndexFromCampaignStart
- completedCampaign flag / completion timestamp
- lastCommittedMonthlyBoundary

Các trường date hiển thị phải suy ra từ integer logicalStepIndex hoặc được validate hai chiều. Không cho phép state chứa year/month/day không khớp step index.

### 4.2. Periodic task registry

Mỗi task descriptor cần:

- stable taskId và version
- cadence: six_hour/daily/weekly/monthly/yearly/event
- phase/anchor và due predicate
- stable priority/order key
- dependency IDs
- enabled condition
- declared state mutation domains
- bounded work budget
- idempotency/replay policy
- task-specific tests

Không serialize toàn bộ recurring task queue nếu có thể suy ra từ calendar. Chỉ persist one-shot deadlines và task cursor cần thiết. Tránh queue phình theo 191 năm.

### 4.3. State ownership

Mỗi system chỉ được mutation các domain nó sở hữu. Ví dụ:

- Economy: market, firms/buildings, stocks, prices, finance, construction economy.
- Population: cohort sizes, composition, births/deaths, migration and labor supply.
- Politics/institutions: interest groups, parties, laws, cabinets, elections, state institutions.
- Diplomacy: relations, diplomatic plays, treaties, subjects and obligations.
- Military: units, commanders, equipment, fronts, supply lines, battles and mobilization.
- Technology: discovery, research, diffusion, adoption and deployment.
- AI: intentions/plans/orders; không trực tiếp sửa state domain khác ngoài Command API.

---

## 5. Economy v2 — từ aggregate monthly flow tới production/stock/market system

### 5.1. Nguyên tắc

Không chuyển ngay sang mô phỏng từng cá nhân hoặc từng sản phẩm. Dùng regional/state firm aggregates có stock ledger rõ ràng, để đảm bảo hiệu năng với hàng trăm vùng và hàng trăm quốc gia.

### 5.2. Contracts cần có

**Goods catalogue**: stable ID, category, unit, base value, perishability, strategic criticality, substitutability, storage properties, technology constraints, pollution coefficients.

**Building/Firm profile**: industry, region, ownership, level/capacity, production method, inputs/outputs recipes, labor demand by strata, wage policy, utilization, maintenance, profitability, construction/upgrade requirements.

**Inventory ledger**: opening stock, production, imports, internal transfers, exports, household consumption, firm input consumption, military requisition, spoilage, closing stock, reservations, in-transit stock. Bảo toàn vật chất:

opening + inflows - outflows - spoilage = closing

Không tạo hàng hóa âm; thiếu hàng phải thể hiện unmet demand/production curtailment, không tự tạo supply ẩn.

**Market node**: market membership, domestic suppliers, customs/tariff regime, price index, transaction volume, shortage, inventory cover, access cost and transport capacity.

**Trade route**: origin/destination market, goods basket, route capacity, tariff, transport mode, transit time, risk/blockade exposure, convoy demand, active/suspended state, owner and treaty restrictions.

### 5.3. Settlement order

1. Determine firm capacity and production method.
2. Reserve intermediate inputs and labor.
3. Apply infrastructure, technology, occupancy, energy and disruption modifiers.
4. Produce outputs; update inventories.
5. Satisfy military/state/essential household demand according to explicit priority rules.
6. Dispatch/arrive trade-route flows using travel-time model.
7. Clear remaining market and household demand.
8. Compute price/shortage using stock cover, unmet demand and market access.
9. Set wages, profits, ownership income and investment signals.
10. Post taxes, tariffs, subsidies, wages, interest, spending and treasury changes.
11. Persist ledger and validate conservation.

Avoid price updates that depend on iteration order. Use a snapshot of prior period market signals for a settlement pass, then commit outputs together.

### 5.4. Required balance equations

- Good stock conservation by region/market.
- Household disposable income = wages + ownership/transfer income − taxes − debt service.
- Firm cash flow = sales + subsidies − inputs − wages − maintenance − taxes/interest.
- State balance = revenue − expenditure − transfers − debt service.
- Trade balance records imports/exports by value and physical quantity separately.
- Construction consumes both money and materials; queue time depends on delivered goods and labor, not only treasury.

---

## 6. POP v2 — cohort demographics and social structure

### 6.1. Cohort representation

Use aggregated POP cohorts, not millions of individual agents. Minimum identity dimensions:

- region and country ownership at time of processing
- culture and religion
- age band (e.g. children, working-age, elderly; refined where data supports)
- social/economic stratum and occupation
- literacy/education band
- employment state
- political affiliation/support tendencies where historically justified
- population count and demographic rates

Cohort key must be stable and mergeable; avoid producing one object per person.

### 6.2. Monthly/annual processes

- Birth and mortality by age band, public health, war, famine, epidemics, urbanization, nutrition and living standards.
- Age transitions derived from elapsed calendar time; age-band movement cannot depend on number of frames.
- Internal migration by employment, wages, land, housing, instability and region capacity.
- International migration by legal status, access, transport, push/pull factors and conflict.
- Strata transition from literacy, employment, land ownership, urbanization, industrialization and institutions.
- Labor force participation/employment feeds the economy; the economy does not count the same worker in multiple sectors.
- Population conservation is checked across migration: source losses equal destination gains, except explicit deaths/births.

### 6.3. Tests

- no negative cohort
- sum of cohort population matches region total within stated rounding tolerance
- migration mass conservation
- age transitions over leap/month boundaries
- war/famine/epidemic effects are bounded
- deterministic replay across save/load and different render frequencies
- aggregate world population calibration by observation year and uncertainty

---

## 7. Politics and institutions v2

### 7.1. Political representation

Retain current interest groups where they remain useful but allow them to form/change over time. Add:

- political parties and coalitions
- movements/protests and petitions
- elections, suffrage rules, districts/constituencies, turnout and mandates
- cabinets/government composition and confidence
- parliament/seats or equivalent representative institution where law requires
- constitutional monarchy/republic/federation/devolution and executive limits
- legitimacy, state capacity, administrative reach and corruption
- institutional coverage/effectiveness, not just nominal law selection

### 7.2. Law lifecycle

A law change is not an immediate boolean flip. It needs:

- eligibility and prerequisites
- sponsors/opposition
- legislative path
- debate/negotiation duration
- enactment timestamp
- implementation capacity and regional coverage
- resistance, court/constitutional constraints and enforcement
- repeal/amendment lifecycle

A revolution/coup/civil conflict is a process with actors, objectives, control, legitimacy, command loyalty, external involvement and outcome—not a single random regime mutation.

### 7.3. Historical time validity

Institutions and rights must have date ranges and applicability conditions. Do not make modern categories universally available in 1836. Transition rules should be data-driven and tested.

---

## 8. Diplomacy, subjects and treaties v2

### 8.1. Subject relationship model

Replace scalar overlord + subjectType as the sole legal representation with a typed relationship object:

- overlord and subject IDs
- type: protectorate, dominion, puppet, vassal, tributary, personal union, colony, chartered company or other approved types
- autonomy and foreign-policy control
- fiscal obligations/tribute, military obligations, market access and construction rights
- diplomatic freedom, succession/integration conditions
- start/end/termination triggers
- rebellion/independence and overlord enforcement state
- source/provenance and historical validity interval

Types must be legal only in appropriate historical context and scenario rules. Do not assume all empires use identical legal mechanics.

### 8.2. Treaty model

Each treaty has parties, clauses, start/end, renewal, ratification, status, obligations, violation penalties, enforcement and termination. Clauses are typed contracts, not unstructured free-form strings. Minimum clause families:

- alliance/defense obligation
- guarantee
- non-aggression
- access/transit/basing
- trade/customs/market access
- reparations/tribute
- spheres/influence
- subject/autonomy
- ceasefire/armistice/peace terms
- technology/industrial cooperation

### 8.3. Diplomatic play lifecycle

Candidate state machine:

proposed → opening demands → escalation → maneuver/sway → countdown/ultimatum → resolution → post-crisis treaty/cooldown

Each play defines:

- initiator and target
- primary/secondary demands
- participants, supporters, neutral states
- sway offers and obligations
- escalation pressure and deadlines
- war support / willingness / domestic constraints
- peaceful compromise paths
- deterministic resolution and audit log

Direct war declarations may remain as a legacy/special path but must not bypass mandatory crisis/ultimatum where the law/scenario requires one.

---

## 9. Military v2 — forces, equipment and operations

### 9.1. Force hierarchy

Candidate aggregate structure:

- national military institution and budget
- army/navy branches
- army groups/theaters
- formations/units with size, manpower, training, morale, doctrine, commander and equipment
- fronts/regions/sea zones
- orders and operations
- supply depots, transport routes and convoys

The engine should not create one entity for each soldier. Units may be cohorts/brigade-sized records with deterministic aggregation.

### 9.2. Equipment and logistics

Equipment inventory by type and location; production, imports, attrition, maintenance, replacement, reserve, transport and capture. Equipment demand scales from unit template and readiness. War performance depends on actual delivered equipment/supply, not only a national arms price.

Supply model includes:
- source depot and destination formation
- daily/weekly throughput and route capacity
- terrain/weather/rail/port/road/river/sea access
- blockade/interdiction and enemy control
- stock available and consumption rate
- supply state and readiness penalties
- delayed delivery and route disruption

### 9.3. Battle and operation lifecycle

Orders have issue/arrival time, validity, command delay, target, objective and cancellation. Battles are triggered by interaction between forces and tactical windows; casualty/morale/organization/equipment effects use deterministic seed and bounded resolution. Outcomes update occupation/control, logistics, exhaustion and peace leverage.

Mobilization and demobilization have lead time, economic opportunity cost, reserve/manpower constraints and political response.

---

## 10. Technology, industrial capability and modern institutions

Use the existing detailed design TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md as the source of the technology taxonomy and modern-era structure. This integrated design adds the following implementation contract:

Do not equate research completion with universal possession. Separate:

1. Research/discovery
2. Awareness and external access
3. Diffusion/knowledge transfer
4. Local adaptation and adoption
5. Industrial deployment/scale
6. Operational readiness and maintenance capability

Every technology includes prerequisites, historical earliest-known year or window, cost, research domain, required institutional capacity, inputs, infrastructure, skilled labor, import dependencies, diffusion channels, deployment lag and measurable effects.

Modern technology bands must cover computing, internet, semiconductors, automation, AI, biotechnology, renewable energy, advanced materials, satellites/communications, modern logistics and military systems. Access is constrained by institutions, capital, trade, sanctions, education, infrastructure and strategic controls.

---

## 11. AI architecture

AI should act at distinct planning horizons:

- Strategic (annual/multi-year): industrialization, fiscal policy, institutional reforms, alliances, technology priorities, subject policy and national goals.
- Operational (monthly/weekly): construction priorities, diplomatic plays, mobilization, force allocation, supply preparations and trade-route changes.
- Tactical (six-hour/daily where relevant): execute validated movement/operation orders; do not re-plan the entire country at every regular tick.

AI produces intents/plans through Command API. The engine validates them. The AI must not directly bypass system invariants. Each plan has objective, constraints, expected benefit, risk, expiry, cancellation condition and audit reason.

AI work must be staggered and budgeted. Candidate decision budget by country and cadence must be profiled on the 12 GB mobile reference device. Deterministic replay requires stable scheduling and random number use.

---

## 12. Historical campaign data 1836–2026

### 12.1. Time-dependent world model

A static country row cannot represent 191 years of history. Use dated records/intervals for:

- country existence, names, tags, regime, capital, claims and administrative divisions
- region ownership/control and border geometry
- rulers, cabinets, parties and succession
- laws/institutions and their start/end dates
- treaty/subjection/alliances and clauses
- wars, crises, territorial transfers and occupation
- technology availability/access/deployment
- infrastructure, industrial capacity and population/economic observations
- historical events and decision windows

All interval endpoints and source dates require clear inclusive/exclusive semantics. Avoid ambiguous current-country lookups for historical dates.

### 12.2. Era bands

Use the existing project design as a starting taxonomy:

- 1836–1870: early industrialization, agrarian transformation, rail/steam, state consolidation and imperial competition.
- 1871–1913: second industrial revolution, mass production, electrification, modern finance, organized labor and alliance systems.
- 1914–1945: total war, mobilization, revolution, economic controls, air/naval warfare and major state transformations.
- 1946–1991: Cold War, decolonization, nuclear deterrence, welfare states, mass education, computing and new international institutions.
- 1992–2010: globalization, trade/finance integration, internet, supply-chain specialization and post-Cold-War transitions.
- 2011–2026: platform/digital economy, AI, climate/energy transition, sanctions/interdependence, modern security and geopolitical fragmentation.

Era labels guide technology/institution unlocks but do not replace country-specific historical timing.

### 12.3. Provenance and uncertainty

Every imported historical data point records:
- source organization and canonical URL/document identifier
- publication date and observation period
- variable definition and units
- country/region mapping method
- transformation/estimation method
- uncertainty range/confidence and missingness
- license/terms and permitted redistribution
- author/reviewer and ingestion timestamp

Use real observation years. Do not label partial or lagged datasets as complete 2026 facts. Estimates and interpolations must be marked as estimates and must not silently become authoritative facts.

---

## 13. Save schema and migration contract

### 13.1. Versioning

Separate:
- save format version
- simulation rules/version
- world data pack/version
- event/technology content version
- engine compatibility version

A save can be structurally readable but incompatible with a different data pack/ruleset; report this explicitly.

### 13.2. v1 monthly save migration proposal

Legacy v1 stores monthly date only. When a separately authorized v2 migration is implemented:

- Preserve original v1 bytes as immutable recovery input.
- Map each v1 monthly state to day 1, 00:00 of its recorded month; do not invent intramonth progress.
- Derive logical six-hour index from Gregorian days since 1836-01-01 multiplied by four.
- Preserve seed/RNG, countries, regions, wars, treaties, relations, counters, logs, histories and IDs byte/semantic-equivalently where possible.
- Introduce default values for new structures through explicit migration functions with schema-by-schema provenance.
- Rebuild derived indexes/caches instead of serializing stale caches.
- Run dry-run validation, migration, serialization, reload and comparison before atomic activation.
- Never overwrite the source v1 save if any validation fails. Keep rollback/recovery route.

### 13.3. Deterministic migration tests

For Historical and Sandbox:
- representative 1836 initial save
- save after a short monthly campaign
- save at a war, reform, construction and treaty boundary
- save with legacy/missing optional fields
- migrate v1→v2, run N logical steps, save/load, continue
- compare uninterrupted vs migrated runs by stable-state digest, RNG state, task cursor, logs and counters
- assert no double-run of month boundary tasks

---

## 14. Performance, memory and mobile safety

- Profile 279,048 six-hour steps for a full 191-year campaign at top speed; monthly/daily/weekly task work is additional.
- Avoid per-step allocations across all countries/regions if no task is due.
- Use stable precomputed schedules and incremental indexes, but invalidate caches deterministically when ownership, treaty, market or region topology changes.
- Bound work per scheduler slice; never execute unbounded catch-up loops in a single UI callback.
- Measure step p50/p95/p99/max, long tasks, frame interval/FPS, heap growth, peak memory and thermal/battery behavior.
- Use real iQOO Z10 Turbo device evidence. Node/desktop CI is not a substitute for Android runtime measurements.
- Define slowdown thresholds from measurement; do not claim the half-day cap is sustainable on device until measured.
- If Workers are considered later, define immutable snapshots/command boundary and a single authoritative state writer first.

---

## 15. Test and acceptance matrix

### Clock and calendar
- Gregorian month lengths, leap centuries, campaign start/end.
- 4 regular steps/day; no drift or date mismatch across 191 years.
- 30/60/90/120 Hz and dropped-frame schedules produce identical logical state for equal admitted time/steps.
- Speed 5 never exceeds 0.5 game-day/real-second.
- Pause/background/resume does not accumulate offline time.
- Bounded work per callback; no dropped task, double execution or runaway backlog.

### Cross-system economy/POP
- Stock conservation for every good/region/market.
- No negative stock or duplicate labor allocation.
- Firm cash flow and national finance reconciliation.
- POP mass balance and migration conservation.
- Cohort age/strata transitions across leap days and annual boundaries.
- Historical calibration by observation year with explicit uncertainty.

### Politics/diplomacy/military
- Law process cannot skip eligibility/implementation stages.
- Election terms and constitutional constraints persist across save/load.
- Treaty clauses/obligations/expiry and subject autonomy resolve deterministically.
- Diplomatic play reaches exactly one terminal outcome.
- Mobilization/equipment/supply constraints affect operational readiness.
- Army movement/convoy/battle orders are deterministic across pause/save/load.
- No unit, front, supply route or treaty can refer to removed country IDs without defined migration.

### Campaign and historical data
- Every active country/region history valid at the tested date.
- No overlapping contradictory ownership intervals.
- Every historical event has valid participants, trigger window, source and deterministic fallback.
- Technology access/deployment obeys prerequisites and era/country conditions.
- Campaign processes final 2026-12-31 tasks before ending at 2027-01-01.

---

## 16. Implementation sequence — two coordinated workstreams

### Stream A — 1836–2026 world and campaign

| Order | Work package | Deliverable | Dependencies |
|---|---|---|---|
| A0 | Versioned product requirements | Superseding 1836–2026 PRD/SRS; preserve frozen S0 master spec | Owner scope |
| A1 | Historical data source register and coverage audit | Country/region/time/source matrix; missing data ledger | A0 |
| A2 | Time-dependent world history | Dated country, region, border, leader, government, treaty and event records | A1, schema v2 |
| A3 | Era/event scenario coverage | Historical scenarios and Sandbox divergence rules | A2 |
| A4 | Technology/institution content integration | Tech tree and institutions with provenance and date validity | Existing technology draft, A1 |
| A5 | Historical calibration | Observation-year validation, uncertainty and source audit | A1–A4 |

### Stream B — simulation depth and operations

| Order | Work package | Deliverable | Dependencies |
|---|---|---|---|
| B0 | Calendar v2 and migration design | Six-hour logical step contract, v1→v2 migration plan | CLK-A1 tested; separate authorization |
| B1 | Cadence registry and deterministic task runner | Stable six-hour/daily/weekly/monthly/yearly scheduler | B0 |
| B2 | Economy stock ledger and firms | Inventory conservation, recipes, labor, market clearing | B1 |
| B3 | POP cohorts | Age/strata/employment/migration mass balance | B1, B2 |
| B4 | Political institutions | Parties/elections/cabinets/law lifecycle/state capacity | B1, B3 |
| B5 | Diplomacy and subject/treaty lifecycle | Diplomatic plays, multi-party treaties and subject autonomy | B1, B4 |
| B6 | Military formations and logistics | Equipment, depots, fronts, operations and battles | B1, B2, B5 |
| B7 | Technology adoption and AI horizons | Research/access/adoption/deployment; strategic/operational/tactical planners | B2–B6, Stream A4 |
| B8 | Integrated historical calibration and mobile profiling | End-to-end deterministic campaign tests, device benchmark and tuning | A5, B2–B7 |

### Critical dependency order

Calendar v2 and save migration precede any six-hour subsystem semantics. Cadence registry precedes daily/weekly task extraction. Economy stock ledger precedes POP purchasing-power and military supply dependencies. Diplomacy/subject lifecycle precedes multi-state war obligation resolution. Historical data and technology content must carry date validity before campaign completion is extended.

Parallelize Stream A research/data work and Stream B architecture work where their contracts are stable. Do not parallelize competing mutations to GameState/schema.

---

## 17. Immediate next milestones

1. Freeze this integrated architecture draft and create a traceability matrix linking each existing system limitation to a proposed contract, source data requirement, test and implementation package.
2. Create the superseding formal 1836–2026 product requirements document; keep the existing 1836–1936 S0 master specification immutable for baseline audit.
3. Complete a read-only historical data coverage audit: current countries, regions, borders, leaders, treaties, events, technologies and institutions by era.
4. Prepare a separate, narrow owner authorization request for B0/B1 (calendar v2 + save migration + cadence registry); do not infer it from S1-CLK-01.
5. Only then begin code changes for the next slice, with source SHA pinning, baseline comparison, tests, CI and separate review/owner disposition.

## 18. Current authorization boundary and implementation truth

- The only runtime authorization recorded so far is S1-CLK-01 on experiment/owner-authorized-clock-runtime.
- The tested clock slice is a monthly scheduler refactor, not the six-hour logical engine.
- Economy, POP, politics, diplomacy, military, AI, GameState, save schema and campaign-end runtime remain unchanged.
- S0-B7 remains IN_PROGRESS; overall S0 remains PARTIAL — NOT COMPLETE; bounded S1-entry remains NOT_TESTED. Claude independent review has not been performed.
- This document is a design/roadmap deliverable. It does not authorize implementation of B0–B8 or Stream A content/data changes.
- Do not merge to the default branch or label the product as Victoria 3 equivalent / 1836–2026 complete based on this document.
