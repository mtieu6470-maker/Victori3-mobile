# Đề xuất kiến trúc — Tổ chức quân đội, chiến dịch và hậu cần (S20–S21)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày:** 18/11/2026  
**Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Roadmap:** S20–S21, áp dụng owner-approved v3.2/v3.3  
**Thiết kế liên quan:** POP Cohorts, S7–S8 Goods/Transport, S10–S11 Building Sites, S15–S17 Governance/Characters, S18–S19 Diplomacy/AI  
**Trạng thái:** `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`

> Thiết kế trước triển khai. Không mở S1/S20/S21 và không sửa runtime, save schema, historical data, tests, UI, Android, workflows hoặc APK. Mọi cấu trúc bên dưới chỉ là đề xuất.

---

## 1. Mục tiêu

S20 phải chuyển quân đội hiện tại từ hai tổng Army/Navy thành lực lượng có cấu trúc, tổ chức, trang bị, chỉ huy, nguồn tuyển, dự bị và niên đại đúng bối cảnh từng polity.

S21 phải chuyển chiến tranh từ việc chọn một số region mục tiêu và so tổng manpower thành hoạt động quân sự có:
- kế hoạch chiến dịch và mục tiêu;
- di chuyển có thời gian trên mạng lưới;
- mặt trận/chiến trường có địa hình, công sự và giới hạn;
- tuyến tiếp tế, depot, convoy, attrition;
- giao tranh, bao vây, chiếm đóng và hậu quả;
- hải quân, phong tỏa, vận tải biển và đổ bộ;
- hòa đàm và kết thúc chiến tranh dựa trên mục tiêu/khả năng tiếp tục chiến đấu.

Toàn bộ phải phù hợp 1836–1936, đa dạng toàn cầu và đủ nhẹ cho Android. Không tạo một object cho mỗi binh sĩ, viên đạn hoặc chuyến vận tải nhỏ.

---

## 2. Hiện trạng code tại baseline

### 2.1. Quân đội và hải quân

- `src/engine/types.ts`: Army chỉ lưu `manpower/target/quality/morale/supply`; Navy chỉ lưu `strength/target/quality`.
- Country không có unit/formation/fleet/commander/depot/supply route collections.
- `src/engine/systems/military.ts:9–22`: quân đội được điều chỉnh bởi law multiplier và tech; armyStrength là manpower × quality × supply × morale; navalStrength là strength × quality × technology.
- `military.ts:24–40`: manpower tiến dần về target theo population share và law; navy strength tiến về target; không có recruit queue, training, reserve, equipment stock hoặc unit location.
- `military.ts:43–59`: sideStrength cộng sức mạnh quốc gia; frontTargets chọn các Region có tiếp giáp land/sea neighbor.
- `military.ts:62–129`: mỗi tháng tính một số battle từ tổng sức mạnh hai phía; random chọn bên/tỉnh mục tiêu; thắng đổi controller và tăng devastation; war score suy ra từ occupation/goal/capital/strength ratio.
- `military.ts:131–148`: endWar tự động áp WarGoals và trả controller về owner; không có negotiation terms đa phương chi tiết.

### 2.2. Diplomacy/AI integration

- `src/engine/systems/diplomacy.ts`: War participants được snapshot ở declareWar từ subjects, alliances, guarantees và great powers.
- `src/engine/ai/ai.ts:184–233`: AI tính utility chiến tranh và gọi declareWar trực tiếp.
- `src/engine/commands.ts`: player có declare_war và offer_white_peace; chưa có unit orders, mobilization plans, front orders hoặc negotiated settlement terms.

### 2.3. Save compatibility

- `src/engine/save.ts` hiện chỉ nhận version 1.
- Save cũ không lưu regiment, fleet, commander, depot hay vị trí đóng quân. Không có cơ sở để tái tạo chúng sau migration.

### 2.4. Hệ quả

Không thể thay manpower scalar bằng một danh sách quân đoàn tùy ý rồi cho rằng lịch sử đã được mô phỏng. Trước hết phải định nghĩa organization data, population/recruitment rules, equipment/material supply, geography, movement và save migration.

---

## 3. S20 — Military Organization

### 3.1. Không có tổ chức quân đội toàn cầu duy nhất

Quân đội thế kỷ XIX–đầu XX gồm nhiều hình thức:
- standing/professional army;
- conscript army;
- militia/local defense;
- feudal/estate levies;
- retinue/household troops;
- tribal/confederate forces;
- irregular/light infantry;
- colonial and auxiliary formations;
- mercenary forces;
- naval fleets, coastal defense and river flotillas;
- gendarmerie/internal-security forces khi được mô hình hóa.

Đây là các military organization model candidates. Mỗi polity cần có source-backed doctrine/organization profile và sự thay đổi theo thời gian. Không áp cây battalion–regiment–division chuẩn hiện đại cho mọi force.

### 3.2. UnitTypeDefinition

Static definitions cần mô tả:
- stable `unitTypeId`;
- branch (land/naval/support/irregular);
- organizational scale;
- valid dates;
- eligible organization models;
- equipment requirements;
- manpower/crew range;
- skills/training requirements;
- movement and terrain capability;
- supply consumption profile;
- command requirements;
- recruitment/maintenance cost;
- source refs and quality.

Unit types có thể gồm infantry, cavalry, artillery, engineers, sappers, logistics/support, irregulars, militia, guard, naval vessel classes và auxiliaries. Danh mục cụ thể phải dựa trên dữ liệu 1836–1936 và mô hình hóa cần thiết, không phải số lượng unit trong game khác.

### 3.3. Unit hierarchy and aggregation

Tổ chức:
- `ForcePool` — manpower/equipment chưa tổ chức hoặc chưa triển khai.
- `Unit` — formation aggregate (ví dụ regiment/brigade/battalion tương ứng mô hình từng polity).
- `Formation` — nhóm nhiều unit để command/move.
- `Army/Corps/Column` — cấp tổ chức chiến dịch tùy doctrine.
- `Fleet/TaskForce/Flotilla` — lực lượng hải quân.

Không tạo object cho từng soldier/sailor. Mỗi cấp có quy mô giới hạn, liên kết ID ổn định và có thể gộp nếu cùng type/location/organization/command state mà không làm mất ý nghĩa.

Mỗi unit tối thiểu có:
- stable ID;
- unit type and organization model;
- strength/personnel aggregate;
- equipment status;
- training/readiness;
- morale/cohesion;
- organization/discipline;
- supply state;
- location and movement state;
- commander reference (nullable);
- parent formation reference;
- creation/retirement/effective dates;
- lineage/provenance where migrated or generated.

### 3.4. Recruitment, reserves and population accounting

Nguồn tuyển phải gắn POP:
- eligible cohort groups/regions;
- laws/service obligations;
- age/health/skill constraints only when supported by cohorts;
- local authority and administrative reach (S15);
- occupation disruption and economic impact;
- voluntary/paid, conscription, levy, corvée/obligation, mercenary/auxiliary recruitment;
- annual/monthly recruitment capacity and training throughput.

Không chỉ trừ tổng Region.pop. Recruitment phải:
- chuyển một số người từ available population sang military service/reserve;
- bảo toàn tổng dân số (active force + reserve + civilian cohort);
- giữ provenance/uncertainty nếu source không có age/sex/occupation detail;
- không vượt legal/administrative/manpower capacity;
- có mortality/desertion/retirement/return-to-civilian transitions;
- ảnh hưởng production/labor only after the relevant employment system exists; không tự tạo wage records trước S12.

Legacy v1 save không có cohort military allocation. Migration phải tạo `LegacyForcePool` hoặc `UnorganizedForce` giữ nguyên tổng manpower/quality/morale/supply như một pool estimate. Không tự sinh regiment, commander, unit location, flags hoặc lịch sử chiến đấu. Người chơi/AI tổ chức pool thành unit sau này qua action/decision có kiểm soát.

### 3.5. Equipment and military supply

S20 yêu cầu:
- equipment tables theo UnitType/era;
- quantity/condition/serviceability;
- replacement/repair/maintenance;
- ammunition/food/fuel/medical/animal fodder/engineering materials khi có mô hình;
- goods inputs theo S7 canonical units;
- local stock và delivered supply theo S8 transport;
- production/repair by BuildingSites S10/S11;
- construction of fortifications/depots/ports theo S14.

No free equipment from army size or technology. Không dùng giá arms toàn cầu làm supply factor thay cho tồn kho/đường giao hàng. Thiếu supply phải hạ readiness/organization và gây attrition theo thời gian, không biến thành số phạt tức thì không giải thích.

### 3.6. Commanders and S16 characters

- Commander là một Character có appointment vào command office.
- Character skill/traits tác động thông qua command scope, communications, doctrine and experience.
- Không tự tạo tướng lịch sử khi không có evidence.
- Commander vacancy/unknown, regency/collective command, staff/committee và local commander có thể tồn tại.
- Một Character không được đồng thời giữ các command appointment xung đột nếu institution/rules không cho phép.
- Death/transfer/dismissal/retirement tạo command transition event; unit ID không đổi.

### 3.7. Organization model and doctrine

OrganizationProfile xác định:
- command hierarchy;
- recruitment model;
- reserve/mobilization rules;
- unit scale;
- supply responsibilities;
- officer/NCO model;
- drill/training/discipline;
- staff and signal/communications;
- military jurisdiction and civil authority;
- temporal validity and source refs.

Doctrine/technology may affect movement, firepower, endurance, naval tactics and logistics, but must not make a country instantaneously capable of a modern organization simply by researching one technology.

### 3.8. Mobilization and demobilization

- Mobilization stages: alert, reserve call-up, assembly, training/equipment, deployment.
- Mobilization consumes time, money, supplies and civilian labor capacity.
- Some systems use seasonal/temporary levies; their effective service windows must be representable.
- Demobilization returns personnel/reserves according to law and service profile; cannot disappear troops.
- Escalation from crisis to war in S18 can trigger mobilization, but force readiness must reflect time and resources.

---

## 4. S21a — Movement, Fronts and Supply Lines

### 4.1. Military movement graph

Use S8 graph as shared geographic basis, with military-specific edge constraints:
- land passability/terrain/season;
- road/rail/river/port infrastructure and date;
- sea transport/convoy requirements;
- control/occupation/blockade;
- width/capacity and traffic congestion;
- weather/river conditions where modeled;
- treaties/neutral transit rights;
- unit type mobility and transport capability.

Do not route through modern roads/railways before historical validity. Do not let a unit teleport to a distant coastal region because the navy strength exceeds a threshold.

### 4.2. Movement orders and pathfinding

Order states:
- planned;
- accepted/authorized;
- assembling;
- moving;
- delayed/interdicted;
- arrived;
- cancelled/retreated.

Movement:
- route selected with Dijkstra/A* or equivalent deterministic algorithm;
- edge cost considers time, supply, risk, terrain and strategic priority;
- tie-break by stable node/edge/unit IDs;
- movement consumes simulation time and transport capacity;
- route cache invalidates when graph/control/blockade/season changes;
- units may be split or delayed only through explicit deterministic rule.

### 4.3. Fronts and operational objectives

A Front is a dynamic boundary/sector linking opposing forces and geography, not just a list of all adjacent regions.

Front state:
- participants/units assigned;
- front line nodes/edges/regions;
- command authority;
- objective and priority;
- width/capacity;
- supply reach;
- entrenchment/fortification;
- threat and intelligence estimates;
- effective tick and status.

Operational objectives:
- defend region/line;
- capture/relieve strategic node;
- protect capital/port/railway/depot;
- cut supply;
- encircle/interdict;
- siege;
- withdraw/hold;
- conduct amphibious landing;
- maintain blockade.

### 4.4. Supply line and depot

Supply depends on:
- source depot/market stock;
- actual delivered goods via S8 network;
- route capacity and travel time;
- distance/consumption rate;
- enemy interdiction/blockade;
- local forage/requisition only where legal/contextual rules allow;
- unit size/type and weather/terrain;
- supply priority and competing formations.

No instant full replenishment. In-transit supplies are unavailable until arrival. Interdicted route may reroute if path available; otherwise supply deficit grows and attrition/operational penalty follows.

---

## 5. S21b — Combat, Sieges and Occupation

### 5.1. Battle resolution

Battle participants must come from units/formations that actually reached the engagement area. Combat factors may include:
- numerical strength and unit type;
- equipment/condition/ammunition;
- training, experience, organization, morale, cohesion;
- command and staff capability;
- terrain, climate and fortification;
- surprise, reconnaissance and entrenchment;
- supply, fatigue and communications;
- combat doctrine and technology valid at that date;
- local tactical initiative and bounded deterministic randomness.

Do not use raw total manpower as the sole outcome driver. Do not make a single random roll decide all regional campaign progress.

### 5.2. Battle record

Persist a compact record:
- battle ID, date, location;
- participants/commanders;
- estimated strength and actual engaged strength;
- tactical result and objective;
- casualties/prisoners/equipment losses;
- retreat/advance/occupation;
- supply and morale state;
- source/history classification (historical fact vs simulated outcome).

Do not persist individual soldier casualties; aggregate by unit/force.

### 5.3. Sieges and fortified positions

A siege is a separate operation:
- encirclement/isolation;
- garrison and fortification condition;
- besieger supply/ammunition/artillery;
- disease, sanitation and civilian hardship;
- relief forces and breakout;
- capitulation/negotiation;
- destruction and post-capture state.

No instant controller flip because a random battle occurred. Controller changes only via explicit operation/occupation/withdrawal resolution.

### 5.4. War score, support and peace

Keep distinct:
- operational control/occupation;
- war objective fulfilment;
- casualties and equipment loss;
- economic/fiscal cost;
- domestic war support/opposition;
- legitimacy and elite/council consent;
- supply and readiness;
- external diplomatic pressure/backing;
- time and bargaining position.

A summary war score can be derived for UI, but peace acceptance must evaluate goals, domestic constraints, supply and terms. War exhaustion should not alone determine capitulation. Negotiated peace can involve:
- territorial/status changes;
- autonomy/independence;
- tribute/indemnity;
- trade access;
- disarmament;
- guarantees;
- prisoner exchange;
- withdrawal/evacuation;
- amnesty/reforms;
- temporary armistice.

Terms must pass S18 treaty authority/ratification rules. A war can end inconclusively without automatically granting goal territory.

### 5.5. Occupation and civilian impact

Occupation:
- controller/occupier/owner remain separate;
- administrative reach and legitimacy can be low;
- requisition/looting/destruction have economic and population consequences;
- resistance/movement may develop under S17;
- local authorities may cooperate, remain neutral or resist;
- occupation duration and legal status are recorded.
No automatic annexation on occupation.

---

## 6. S21c — Navy, Blockade, Convoy and Amphibious Operations

### 6.1. Naval organization

Fleet/TaskForce contains aggregate vessel units by type:
- sailing/steam transports;
- frigate/corvette/cruiser/battleship classes as historically appropriate;
- river gunboats/flotillas;
- coastal defense;
- auxiliary and troop transport.

Do not use present-day naval categories before their valid dates. Design data per country/era, shipyard capacity, crew, maintenance, coal/fuel and naval doctrine.

### 6.2. Sea routes and naval control

- Sea lanes are temporal edges from S8.
- Fleet operating range depends on supply/port access/technology/coal/fuel.
- Naval superiority is local/route/time-specific, not global scalar.
- Control can be contested, intermittent or limited by weather/maintenance.
- Blockade must identify target ports/sea zones, fleet assets, enforcement, neutral shipping rules and effective dates.

### 6.3. Convoys and shipping

- Convoy is a shipment group tied to S8 cargo flows.
- Naval escort and raider/interdiction can change loss probability/capacity.
- Goods remain in transit until arrival.
- Losses are recorded as physical loss with owner/contract/accounting.
- Troop transports compete for shipping capacity with trade and civilian movement.
- No teleport troop landing at any coastal node; port/landing capacity and local opposition matter.

### 6.4. Amphibious landing

Requires:
- embarked formations;
- transport fleet capacity;
- route/supply preparation;
- naval protection or acceptable risk;
- landing node/terrain and port capacity;
- landing order/time;
- beachhead supply and reinforcement plan.
Failed landing creates casualties/withdrawal/interdiction as defined; it does not move units inland automatically.

---

## 7. Military diversity, law and global fidelity

- Army Law current enum may remain legacy adapter; new military service model depends on polity InstitutionProfile/S17 and temporal rules.
- Distinguish voluntary service, professional standing forces, conscription, levies, retinues, military land obligations, mercenaries, auxiliaries and colonial troops.
- Do not treat enslaved persons, bonded laborers or civilian coerced labor as freely interchangeable with soldiers; source-backed legal status and historical context are mandatory.
- Decentralized polities may field warriors/retinues/confederate forces with non-state command structures; do not disable them by default.
- Colonial forces may have different recruitment/command/status rules; do not assume equal service rights.
- Military technology, unit composition, training and logistics diffuse unevenly.
- Historical battles/campaigns can inform data and calibration, not script exact victory outcomes.

---

## 8. Legacy migration and save safety

Current v1 save has only aggregate manpower/quality/morale/supply/strength:
- create `LegacyForcePool`/ `UnorganizedForce` retaining aggregate data;
- label provenance `migration_estimate`;
- do not create invented regiment IDs, commanders, province locations, fleet locations, depot stock or battle records;
- keep old metrics visible via projection until organized units are recruited/created by explicit action;
- no population subtraction during migration without source-backed allocation or an explicitly approved conversion method;
- backup/rollback and strict schema validation from S1;
- unknown unitType/organization profile must not be silently deleted;
- exact save/load with movement, battle, siege, occupation and shipment state.

---

## 9. Determinism, performance and mobile constraints

- Fixed monthly/weekly phase order.
- Unit/formation/edge/target lists processed in stable ID order.
- Route and target tie-breaks deterministic.
- RNG use explicit and serializable.
- No full per-soldier entity, no object per bullet/projectile, no unrestricted path matrix.
- Use sparse unit/formation state; aggregate inactive reserves.
- Fronts/operations update on triggers or bounded cadence.
- Rendering uses map LOD/clustering; never draw every regiment label at world zoom.
- Benchmark all 662 Strategic Regions and multiple force scales:
  - active unit/formation/fleet count;
  - movement pathfinding p50/p95/p99;
  - front/operation/battle tick cost;
  - supply/convoy calculation;
  - save bytes and load time;
  - memory growth over 100 years and in long wars;
  - map visible units at each zoom;
  - multi-front war with allies, blockade and multiple active convoys.
- Do not degrade simulation fidelity silently on mobile; use transparent LOD for rendering, not for hidden simulation outcome.

---

## 10. Acceptance tests

### S20 organization
1. LegacyForcePool migration preserves total manpower/quality/morale/supply and creates no invented positions.
2. UnitType validity blocks premature equipment/organization.
3. Recruitment reduces civilian cohort by exact amount and increases force by the same amount.
4. Reserve/mobilization/demobilization is mass-balanced and deterministic.
5. Equipment demand/stock uses S7 units and cannot exceed inventory.
6. Commander appointment/transfer/death uses S16 Character state and valid office authority.
7. Unit hierarchy and parent references survive split/merge/save/load.
8. Different polity OrganizationProfiles produce distinct feasible structures across world regions.
9. No per-soldier entities or unbounded unit growth.

### S21 operations
1. Units move only along valid reachable path and need elapsed time.
2. Movement consumes edge/transport capacity and respects control/neutral transit rules.
3. Supply in transit cannot be used before arrival.
4. Supply deficits cause bounded attrition/readiness effects; no free restock.
5. Front assignment/operation objectives remain stable and deterministic.
6. Battles include only units actually engaged in the area.
7. Siege/occupation/controller/owner distinction is preserved.
8. Naval blockade is route/port/time scoped.
9. Convoy loss is reflected in S7 physical balances and S8 shipment state.
10. Amphibious operations require transport/capacity/supply and can fail.
11. Peace settlement applies only terms authorized by S18.
12. Save/load exact continuation during movement, active battle, siege, blockade and in-transit supply.

### Historical and performance
- Tests include decentralized, tributary, colonial, agrarian, pastoral, early-industrial and industrial forces from all world regions.
- No unit/date/equipment/commander claims without temporal provenance.
- Multi-decade and multi-war determinism tests.
- Android p95/p99 and memory/save budgets on representative devices.

---

## 11. Implementation slices after authorization

Planning only:

1. S1 data contracts/save migration.
2. S18–S19 diplomacy/AI command and war authorization.
3. S20-A organization/unit/force pool data definitions.
4. S20-B LegacyForcePool migration + recruit/reserve/mobilization.
5. S20-C unit hierarchy, equipment and command appointments.
6. S21a movement graph, orders, fronts and supply lines.
7. S21b battle, siege, occupation and war support/peace calculations.
8. S21c navy, blockade, convoy and amphibious operations.
9. Device/performance and global historical calibration after each slice.

Do not create full S20/S21 in a single patch. Each slice requires owner authorization, exact baseline, fixtures, deterministic tests, performance budget and independent review.

---

## 12. Open design decisions

1. Unit scale baseline per polity: battalion/regiment/warband/flotilla or aggregated formation.
2. Which force types have individual commander/office versus collective command.
3. Recruitment age/eligibility where source data is missing.
4. Treatment of mercenary, auxiliary, colonial and coerced military service.
5. Supply consumption and equipment replacement rates by unit type/era.
6. Front width and battle resolution granularity on 662 Strategic Regions.
7. How to convert legacy aggregate force pool into newly organized units without fabricating historical location.
8. War support and negotiation weights consistent with institutions and domestic agency.
9. Naval control and convoy interception data granularity.
10. Mobile performance threshold and acceptable active-unit count.

Normative changes to owner-approved roadmap need an explicit decision trace.

---

## 13. Review boundary

Claude independent no-write review should assess:
- accuracy of baseline characterization;
- LegacyForcePool migration safety;
- military organization diversity/global fidelity;
- recruitment population conservation;
- S7/S8 equipment and logistics accounting;
- S16 commander linkage;
- S18 war authorization and peace treaty links;
- deterministic pathfinding/combat and save/load;
- Android performance.

A `REVIEW_PASS` applies only to this design document. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S20/S21 or authorize any code/data/save/test/UI/Android/APK change.

**Kết luận:** S20 tạo lực lượng có tổ chức mà không bịa unit từ manpower cũ; S21 tạo chiến dịch, tiếp tế, giao tranh và hậu cần có thời gian/vị trí. Mỗi chiến thắng phải đến từ lực lượng thật sự đến nơi, được cấp hậu cần và thực hiện mục tiêu — không phải chỉ từ một phép so tổng quân số.
