# Đề xuất kiến trúc — Ngoại giao, trật tự quốc tế và Strategic AI (S18–S19)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày:** 18/11/2026  
**Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Roadmap:** S18–S19, theo roadmap owner-approved v3.2/v3.3  
**Thiết kế liên quan:** S15–S17 governance, S7–S8 markets/transport, S16 characters  
**Trạng thái:** `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`

> Đề xuất trước triển khai. Không mở S1/S18/S19 và không sửa runtime, save schema, historical data, tests, UI, Android, workflows hoặc APK.

---

## 1. Mục tiêu

S18 phải mô hình hóa quan hệ quốc tế như một tiến trình có actors, quyền lợi, điều khoản, nghĩa vụ, khủng hoảng và thương lượng — không chỉ là một con số relations và nút tuyên chiến.

S19 phải tạo AI chiến lược có:
- mục tiêu ngắn/trung/dài hạn;
- đánh giá nội bộ, kinh tế, quân sự, ngoại giao và địa lý;
- lập kế hoạch với nguồn lực/khả năng thực;
- quyết định giải thích được;
- khả năng của mọi polity có agency, kể cả nhỏ, yếu, phi tập trung hoặc có authority tập thể;
- giới hạn thông tin/uncertainty;
- cùng một logic cốt lõi cho player và AI thông qua command API.

Không giả định mọi actor quốc tế là một nation-state hiện đại có ngoại giao hoàn toàn độc lập. Có suzerain, tributary, protectorate, colony, confederation, city-state, chartered company, religious authority, local ruler và collective polity.

---

## 2. Hiện trạng code đã xác minh

### 2.1. Ngoại giao

- `src/engine/types.ts`: `Country` có overlord/subjectType/claims/customsUnion; `Treaty` chỉ gồm id/type/members/leader/start/source; `GameState` giữ relations map và rivalries list.
- `src/engine/systems/diplomacy.ts:13–21`: `powerScore()` gộp GDP, army, navy và prestige thành một điểm; `greatPowers()` chọn 8 quốc gia độc lập đứng đầu theo điểm đó.
- `diplomacy.ts:24–43`: quan hệ trôi theo alliance/rivalry/war/overlord/common nation/infamy.
- `diplomacy.ts:48–85`: acceptance của alliance, guarantee và customs union dựa trên công thức ngắn; customs union join chỉnh member ngay.
- `diplomacy.ts:93–128`: chiến tranh bắt đầu trực tiếp; các bên tham gia được quyết định tức thì qua subject/alliance/guarantee/great-power.
- `diplomacy.ts:131–138`: willingness có một random perturbation trực tiếp.
- `src/engine/commands.ts:20–30, 49–63`: player command gồm improve relations, propose/break alliance, rival, guarantee, join customs union, declare war và offer white peace.

### 2.2. Strategic AI

- `src/engine/ai/ai.ts:31–43`: một aiMonth chạy cho tất cả quốc gia không phải player; các module được stagger theo 3/4/12 tháng.
- `ai.ts:45–73`: budget dựa trên threat, GDP/country stats và personality scalar.
- `ai.ts:110–135`: reformAI thử các giá trị trong LAW_ALTERNATIVES; governance alternatives hiện đang rỗng.
- `ai.ts:137–182`: diplomacyAI chủ yếu chọn rivalry/alliance/guarantee/customs union/improve relation.
- `ai.ts:184–233`: warAI tìm mục tiêu láng giềng/claim/sea neighbor và tính utility từ win probability ước lượng, value, cost và personality.
- `ai.ts:236–245`: decision window AI chọn option bằng random + historicalWeight.
- `Country.personality` có aggression/expansionism/reformism/commerce/naval/isolationism/risk; `AIMemory` hiện có cooldowns/lawHistory/recent/planTarget.
- `simulation.ts`: cùng pipeline cho cả Historical và Sandbox; Historical mode bổ sung data/decision layer, không phải hai engine riêng.

### 2.3. Hạn chế kiến trúc

- Relations không lưu lý do, loại quan hệ, actor-level relationship, date validity hoặc treaty obligations.
- Treaty không có terms, scope, enforcement, guarantor, expiry, breach, ratification hoặc signatory authority.
- Không có diplomatic play/crisis trước chiến tranh.
- Không có backing/sway/neutrality/obligations hoặc escalation timer.
- Subject autonomy/independent policy được rút gọn bằng subjectType; không mô tả nhiều loại quyền tự trị.
- Một powerScore duy nhất có thể xếp sai actor nhỏ nhưng có vị trí chiến lược, hải quân, tài chính, liên minh, địa lý hoặc legitimacy đặc biệt.
- AI war intent có thể chuyển thành declareWar trực tiếp; không có domestic consultation, fiscal readiness, diplomatic risk hoặc alternative settlements.
- AI không có goal stack/horizon, plan state machine, belief/uncertainty hoặc decision explanation đầy đủ.
- Player và AI hiện gọi chung actions ở nhiều hệ thống; điều này cần được duy trì trong command architecture tương lai.

---

## 3. S18 — Actors and International Order

### 3.1. International Actor abstraction

Không nên khóa diplomacy vào `Country.id` duy nhất. Đề xuất một interface actor:

```ts
interface InternationalActor {
  id: string;
  actorTypeId: string;
  polityRef: string | null;
  authorityRef: string | null;
  activeFromTick: number;
  activeToTick: number | null;
  autonomyProfileId: string;
  recognitionStatus: string;
}
```

Actor types có thể bao gồm:
- sovereign polity;
- constituent polity/federation member;
- confederation/council;
- subject/vassal/tributary;
- protectorate/autonomous polity;
- colony/colonial administration;
- chartered company/concession;
- religious/institutional authority;
- rebel/secession authority;
- occupation authority;
- international conference/commission.

Không phải mọi loại actor đều có full treaty/war agency. `AutonomyProfile` quy định quyền:
- negotiate independently;
- sign treaty;
- declare war;
- enter customs/trade agreements;
- receive diplomatic recognition;
- appoint/recall representatives;
- secede or change status.

Quyền có thể được chia sẻ, ủy quyền, hạn chế hoặc tranh chấp. Một overlord relationship không mặc định cấm tất cả foreign policy; phải dựa vào profile và lịch sử.

### 3.2. Relations as typed, temporal records

Thay quan hệ scalar-only bằng:
- pairwise summary projection cho UI/AI;
- typed relation records (alliance, rivalry, hostility, recognition, claim, protectorate, trade access, dynastic tie, guarantee, debt/obligation, dispute);
- start/end ticks;
- reason/evidence/method;
- current status and disputed status;
- source/quality when historically seeded.

Summary `relations[a,b]` có thể giữ làm cache trong giai đoạn chuyển tiếp, nhưng không còn là truth duy nhất. Relation score phải explainable qua components: treaty, grievance, trade, dynastic ties, border dispute, past conflict, recognition, strategic competition, reputation.

### 3.3. Treaty and agreement model

TreatyDefinition/Template là static data; TreatyInstance là mutable campaign state.

Terms có thể quy định:
- parties/signatories and authorized representatives;
- type and objective;
- territorial/jurisdictional scope;
- trade/customs/tariff/access;
- alliance/defense/neutrality;
- vassalage/tribute/protection/autonomy;
- military basing/transit/occupation;
- indemnity/debt/payment/in-kind obligations;
- guarantees and enforcement;
- ratification/consent requirements;
- start/expiry/renewal/termination;
- breach, suspension, renegotiation and dispute resolution;
- source, text/version and language/translation.

Không biến mỗi treaty thành một loại enum với effects hard-coded. Dùng terms có schema, validation và effect handler rõ; tránh arbitrary executable payload trong historical data.

### 3.4. Subjects, protectorates and autonomy

Subject relationship phải tách:
- suzerainty/tribute;
- vassalage;
- personal union/dynastic union;
- protectorate;
- colonial administration;
- chartered-company rule;
- autonomous province/principality;
- military occupation;
- confederate membership;
- tributary/ritual relationship;
- contested subordination.

Mỗi relationship có:
- overlord/protecting actor;
- subject actor;
- reserved powers vs delegated powers;
- fiscal and military obligations;
- foreign policy restrictions;
- local ruler/office and succession;
- intervention rights;
- treaty date/validity;
- recognition and effective control;
- revolt/renegotiation/independence process.

Không coi tribute/suzerainty là direct annexation. Không chuyển mọi subject thành vassal cùng một cơ chế.

---

## 4. S18 — Diplomatic Plays, Crises and Negotiation

### 4.1. Diplomatic play lifecycle

Một diplomatic play là một khủng hoảng có mục tiêu, đối đầu, can thiệp và cơ hội thương lượng trước khi chiến tranh nổ ra.

State machine đề xuất:

1. `proposed` — actor nêu yêu sách/tối hậu thư.
2. `opening` — các actor liên quan nhận phản hồi, có thời gian để tham gia.
3. `maneuvering` — các bên tìm backers, sway, obligations, concessions.
4. `escalation` — demands tăng, deadlines và mobilization pressure.
5. `resolution_pending` — settlement, climbdown, conference, arbitration hoặc war declaration.
6. terminal states: `settled`, `withdrawn`, `expired`, `war_started`.

Không cần mỗi cuộc khủng hoảng phải dùng đủ mọi stage; nhưng transitions phải hợp lệ, có effective tick và deterministic.

### 4.2. Play objective and demands

Demand/goal definition có thể gồm:
- territorial transfer/cession;
- independence/autonomy;
- subjugation/protection;
- recognition/legitimacy;
- trade/market access;
- tariff/customs changes;
- disarmament/military withdrawal;
- reparations/indemnity;
- treaty enforcement/renegotiation;
- regime/office intervention (nếu historical/institution context cho phép);
- other source-backed concessions.

Mỗi demand cần:
- initiator and target;
- requested scope/terms;
- estimated cost/benefit/risk;
- backing/authority constraints;
- settlement alternatives;
- escalation consequences;
- legitimacy and infamy/reputation impacts.

WarGoal hiện có thể map vào objective sau migration, nhưng không mặc định objective luôn phải được giải quyết bằng chiến tranh.

### 4.3. Participants, backing and sway

Actor có thể:
- side initiator;
- side target;
- backer/supporter;
- mediator;
- guarantor;
- neutral observer;
- local/collective authority with disputed role.

Backing decision phụ thuộc:
- treaty obligations;
- strategic interests;
- relations and rivalry;
- actor autonomy;
- military capability and logistics;
- economic exposure/dependence;
- domestic legitimacy and movement pressure (S17);
- character/office influence (S16);
- credibility/expected costs;
- uncertainty and information quality.

Sway offers phải là explicit commitments: obligations, concessions, trade access, guarantee, debt relief, territorial promises (subject to rules) or diplomatic recognition. Không dùng một random willingness score để tham chiến mà không có cam kết/rationale.

### 4.4. Escalation and de-escalation

Escalation có thể đến từ:
- refused demand;
- mobilization/ultimatum;
- new backers;
- treaty breach;
- incidents/events;
- domestic pressure/elite faction;
- missed deadline.

De-escalation có thể đến từ:
- concession;
- face-saving withdrawal;
- mediation;
- arbitration/conference;
- guarantees;
- phased autonomy;
- compensation/trade access;
- temporary status quo.

Chính sách phải tạo lựa chọn trung gian; không chỉ "accept or fight".

### 4.5. War transition

Khi diplomatic play vào `war_started`:
- create War instance from accepted parties/backers;
- preserve objectives, obligations, reasons and opening context;
- update relations/reputation based on responsibility and treaty breach;
- hand military command to S20/S21;
- do not re-compute participant list randomly after transition;
- participants who refuse/leave must have explicit state change and consequence.

Existing `declareWar()` may remain as compatibility/test helper but UI/AI strategic flow should use play/authorization rules after S18 is implemented.

---

## 5. S18 — Power, Reputation and International Status

### 5.1. Replace one powerScore as sole logic

Keep a vector:
- economic capacity (GDP, fiscal revenue, debt, market access);
- military capacity (organized forces, readiness, reserve, supply, navy, projection);
- diplomatic capacity (recognition, treaties, network, obligations, credibility);
- administrative reach/legitimacy (S15/S17);
- geographic/strategic position;
- population/resources/industrial capacity;
- technology and infrastructure;
- internal stability and mobilization capacity.

A scalar may be derived for display/ranking, but AI, great-power status and diplomatic outcomes must consume the vector and the context. A small polity can have diplomatic leverage due to strategic strait, legal treaty, port, debt, religious significance or great-power guarantee.

### 5.2. Great power / regional influence

Great-power status should be:
- derived over time with hysteresis to avoid month-to-month rank flicker;
- potentially region-specific or domain-specific;
- grounded in multiple dimensions and external recognition;
- distinct from formal title/imperial rank;
- not hardcoded to exactly eight actors for every date.

Influence network may include patrons, client states, trade dependence, treaty guarantees, cultural/religious prestige and mediation roles. Do not convert influence automatically into sovereign control.

---

## 6. S19 — Strategic AI

### 6.1. AI architecture and constraints

Replace single broad `aiMonth` utility pass with bounded strategic layers:

1. **Situation assessment** — observe internal/external facts and uncertainty.
2. **Goal selection** — set national/actor objectives with priorities and horizons.
3. **Planning** — choose candidate plans, dependencies, cost, risk and stopping conditions.
4. **Action selection** — issue only valid commands via shared Command API.
5. **Execution monitoring** — verify outcomes and update plan status.
6. **Learning/adaptation** — update memory/utility weights without violating determinism or data source rules.

AI must not manipulate state directly around command validation. Player and AI use same command validators/rules.

### 6.2. Goal hierarchy

Goals are typed and bounded:
- survival/security;
- autonomy/independence;
- territorial integrity/claims;
- regional influence/recognition;
- trade/market access;
- fiscal stability;
- industrial/technological development;
- internal reform/institutional stability;
- infrastructure/urban capacity;
- subjects/tributaries/alliances;
- military readiness/war aims;
- religious/dynastic/cultural objectives when source/game context supports them.

Each goal:
- owner actor;
- target/scope;
- priority;
- start/deadline/review tick;
- confidence and information basis;
- success/failure/abandonment conditions;
- resource envelope;
- allowed actions/constraints;
- explanation references.

### 6.3. Horizons

- tactical/operational decisions: monthly/seasonal;
- strategic plans: 1–5 years;
- grand-strategy priorities: 5–20 years.

Long horizon should not mean deep search over entire world state every month. Use event-driven replanning, bounded candidate generation, scoring and cooldowns. Escalate planning effort only when a crisis/war/major reform threatens core goals.

### 6.4. Explainable decision records

Every material AI action should be traceable:

- observed situation snapshot/hash;
- candidate actions evaluated;
- utility component values;
- constraints/rejections;
- goal and plan IDs;
- historical/data bias contribution if applicable;
- uncertainty estimate;
- selected command and expected consequence;
- actual result and plan revision.

The record can be compact and sampled; not every low-level budget adjustment needs a verbose serialized chain. UI/diagnostics should expose high-impact decisions and plain-language rationale.

### 6.5. Information and uncertainty

AI knowledge should distinguish:
- known own state;
- public/visible foreign state;
- estimated foreign capability;
- disputed/unverified intelligence;
- stale information;
- hidden commitments/secret treaties only if such mechanics are actually modeled.

Do not let AI read hidden player intentions or future event results. If full fog-of-war is not in scope, make information availability explicit and consistent for both sides.

### 6.6. Agency for non-major and decentralized polities

AI for every polity with agency must:
- have feasible objectives within its administrative/ military/ economic capacity;
- seek autonomy, protection, survival, trade or internal legitimacy rather than always conquest/industrialization;
- negotiate through collective authority where needed;
- respond to encroachment, tribute, land/rights threats and internal movements;
- understand asymmetric warfare/resistance and diplomatic patrons where models exist;
- not be disabled simply because army/industry is small.

A decentralized polity may have different decision cadence, authority node, collective approval, mobilization and foreign policy profile; it is not an inert province.

### 6.7. Personality and strategic doctrine

Keep personality as bias rather than destiny:
- aggression/risk can influence willingness but cannot override resource/legitimacy/authority constraints;
- commerce can favor trade/market access;
- naval preference only matters where coast/port/shipbuilding capability exists;
- reformism should be compatible with institutions and political actors;
- isolationism is a policy/strategic preference, not an inability to trade.
- Add doctrine/culture only with source-backed evidence or explicit generated policy; do not use ethnicity/religion as deterministic AI personality.

### 6.8. Historical Mode and Sandbox

- Shared AI pipeline for both modes.
- Historical data can alter starting beliefs, recognized claims, treaties, institutions, priorities, threat assessments and available information when source-backed.
- Historical bias must not override legal command validity, resources, institution authority or simulation consequences.
- No hidden "must follow history" action.
- Sandbox begins from same 1836 snapshot; decisions then diverge from player/AI agency.
- Historical milestones are evaluation/analytics, not forced end-state.
- Counters should measure AI actions, plan quality, oscillation, inactivity and reason categories without imposing historical outcomes.

---

## 7. Integration with S15–S17 and S20–S21

| System | S18/S19 interface | Boundary |
|---|---|---|
| S15 local government | autonomy, administrative reach, service capacity, local authority | Do not assume central state commands all local authorities |
| S16 characters | authorized diplomats, rulers, ministers, commanders, regents | Character skill influences but does not replace institution authority |
| S17 institutions | war authorization, treaty ratification, movement pressure, legitimacy | Political consent varies by institution |
| S7/S8 economy/logistics | sanctions, customs, trade access, tariffs, routes, convoy exposure | Trade terms cannot create goods/instant shipment |
| S10/S11 production | arms/shipbuilding/industrial mobilization | Output must settle through S7 |
| S12/S13 labor/ownership | fiscal and domestic support, strikes, firms and finance | Do not assume wages/profit before phases |
| S20 organization | force readiness, unit/commander structure | War declaration does not create fictional formations |
| S21 operations | objectives, supply lines, movement, combat and blockade | War does not auto-teleport units or supply |

---

## 8. Save, determinism and state machines

S18/S19 depend on S1 save/data contracts and must not be inserted directly into current v1 save.

Requirements:
- versioned static diplomacy/institution templates and data hash;
- mutable play/negotiation/treaty/goal/plan states in GameState;
- deterministic IDs and phase transitions;
- all deadlines based on game tick;
- no Date.now/network/random service;
- RNG use centrally defined and covered by continuation tests;
- AI candidate sorting and tie-breaks stable by ID;
- command replay/validation idempotency contract;
- play participant and war side snapshots are persisted;
- treaty terms and obligations survive load;
- AI plan/goal state and cooldowns restore exactly;
- unknown treaty/objective/goal type fails safe or remains inert with warning; never silently apply arbitrary effects.

---

## 9. Performance and mobile budget

No unbounded planning or all-pairs treaty evaluation every month.

Benchmark:
- diplomacy relation/actor graph for all current entities;
- active diplomatic plays/crises/treaties/terms/obligations;
- AI plan counts, candidate action counts and actions/entity/month;
- p50/p95/p99 CPU time for assessment, planning and diplomacy;
- memory and save growth across 100 years;
- worst case with multiple simultaneous crises, many subject relationships and global alliances;
- deterministic performance under fast-forward.

Use event-driven updates, stable caches and bounded candidate sets. Cache keys must include relation/treaty/authority versions; no stale cache after membership or map changes.

---

## 10. Acceptance test contract

### S18
1. Actor autonomy profile allows/blocks the correct diplomatic action.
2. Collective authority can negotiate through authorized representative/council rules.
3. Treaty term/date/scope/ratification is validated.
4. Subject/protectorate/tributary status preserves reserved and delegated powers.
5. Diplomatic play reaches only legal state transitions.
6. Backers/sway commitments are persisted and resolved.
7. Crisis settlement can concede, arbitrate, withdraw, expire or escalate to war.
8. War participants/objectives are frozen at play transition and are not rerolled.
9. Breach, suspension, expiry and renegotiation affect relations/reputation correctly.
10. Great-power vector ranking avoids rank flicker and handles non-state/strategic leverage.
11. Save/load exact continuation with active crisis and treaties.
12. Global test coverage across all world regions and polity types.

### S19
1. Goal plans satisfy authority/resource/technology/transport/institution constraints.
2. AI never uses commands unavailable to player/authority.
3. Candidate evaluation is deterministic under same seed/state/command stream.
4. AI produces reason records for material choices.
5. AI does not use hidden/future information.
6. AI can choose non-military alternatives to conquest.
7. Small/decentralized polity retains feasible agency.
8. No month-to-month oscillation; cooldown/hysteresis are tested.
9. Planning budget remains bounded at current global entity count.
10. Historical and Sandbox share pipeline; bias does not force outcome.
11. Save/load exact continuation with active plans.
12. Multi-seed tests show non-stagnation without universal expansion/war.

---

## 11. Implementation slices after authorization

Planning only:

1. S1 data/save foundations.
2. S15–S17 authority, characters and institutions.
3. S18-A international actors, autonomy profiles and typed relation graph.
4. S18-B TreatyInstance/terms/obligations and lifecycle.
5. S18-C DiplomaticPlay state machine, participants/backing/sway.
6. S18-D negotiation/settlement and war transition.
7. S18-E power vector, recognition and regional influence.
8. S19-A goal hierarchy and strategic memory.
9. S19-B situation assessment and explainable decision records.
10. S19-C bounded planning and execution monitoring.
11. S19-D agency/performance suite for minor/decentralized polities.
12. S20/S21 military systems consume diplomacy objectives only after their own phase gates.

Each slice needs owner-approved scope, exact baseline, deterministic tests, performance budget and independent review.

---

## 12. Open decisions

1. Which non-state or collective actors have treaty agency versus internal authority only?
2. How to model recognized-but-contested sovereignty and multiple overlapping suzerainty claims?
3. Which treaties have terms, ratification, duration and obligations versus one-off agreements?
4. How diplomatic play timers vary by geography, communications and historical negotiation norms?
5. What constitutes a valid backer/sway obligation and what happens if it is breached?
6. How to transition current WarGoal and Treaty legacy saves without inventing terms?
7. How much AI foreign information is public, estimated or hidden?
8. What planning budget is feasible on the iQOO baseline and low-memory devices?
9. How to measure AI agency without rewarding aggression or forcing historical outcomes?

Normative changes to roadmap require explicit owner decision trace.

---

## 13. Review boundary

Claude independent no-write review should assess actor autonomy, treaty terms, crisis lifecycle, power vector, war transition, AI goals/horizons, explainability, non-major agency, determinism, phase dependencies and mobile performance.

A `REVIEW_PASS` here applies only to this design document. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S18/S19 or any runtime/data/save/test/UI/Android/APK work.

**Kết luận:** S18 biến ngoại giao thành mạng lưới actor–treaty–obligation–crisis–negotiation. S19 biến AI từ vài utility score rời rạc thành strategic goal/plan/execution có lý do và giới hạn. Chiến tranh là một kết quả có thể xảy ra của khủng hoảng, không phải hành động đầu tiên và duy nhất.
