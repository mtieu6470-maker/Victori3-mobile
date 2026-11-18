# Đề xuất kiến trúc — Sự kiện lịch sử và hiệu chuẩn toàn cầu (S22)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Ngày:** 18/11/2026  
**Code baseline:** e4924ca48264f8d0818eface51a28a87cd363b89  
**Roadmap:** S22, theo owner-approved roadmap v3.2/v3.3  
**Trạng thái:** DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION

> Đây là đề xuất thiết kế. Không mở S1/S22 và không sửa engine, save schema, historical data, tests, UI, assets, Android, workflows hay APK.

---

## 1. Mục tiêu và nguyên tắc

S22 phải giải quyết hai vấn đề khác nhau:

1. **Historical Event System:** biến lịch sử đã được nguồn hóa thành bối cảnh, áp lực, quyết định và sự kiện có điều kiện trong mô phỏng — không phải danh sách kết quả buộc phải xảy ra.
2. **Global Calibration and Validation:** kiểm định kết quả mô phỏng trên toàn thế giới 1836–1936 bằng chuỗi dữ liệu, khoảng bất định và nhiều seed — không chỉ so biên giới hoặc một vài con số của châu Âu.

Historical Mode phải có temporal consistency và tính lịch sử đáng tin cậy, nhưng vẫn cho phép các quyết định hợp lý tạo ra lịch sử khác. Sandbox bắt đầu cùng snapshot 1836 và cùng simulation pipeline, sau đó được tự do rẽ nhánh.

### 1.1. Nguyên tắc không railroad

- Một sự kiện có thật trong lịch sử không có nghĩa kết quả của sự kiện đó phải bị áp vào thế giới đã thay đổi.
- Một nhân vật/nhà nước đã thực hiện hành động trong lịch sử không có nghĩa cùng hành động đó sẽ luôn có lợi trong mô phỏng.
- Historical Priorities chỉ thêm context/bias có kiểm soát, không ghi state hoặc gọi command thay AI/player.
- Event conditions phải được đánh giá trên trạng thái hiện tại và temporal validity.
- Player/AI luôn có agency theo khả năng, luật, thể chế, nguồn lực và thông tin.
- Các mốc lịch sử là benchmark/analytics, không phải điều kiện thắng/thua hoặc force state.
- Khi data thiếu hoặc tranh chấp, game dùng uncertainty/fallback có nhãn; không tạo số chính xác giả.

---

## 2. Hiện trạng code tại baseline

### 2.1. Historical layer

Trong src/engine/historical.ts:
- evalCondition() hỗ trợ một tập Condition types như exists, owns, law, war, legitimacy, radicalism, food_shortage, IG clout, foreign pressure, regime change, etc.
- Một số điều kiện còn có nhánh cứng theo Europe (count_owner_european) hoặc fixed major-power ID trong strongestContinental().
- activePriorities() chỉ chạy khi Historical Mode bật historicalPriorities; priority được kích hoạt theo date window + conditions.
- historicalBias() trả về utility bias; layer không tự thực hiện action, nhưng các loại goal/target hiện vẫn hard-coded.

### 2.2. Event system

Trong src/engine/systems/events.ts:
- Historical Mode áp các exogenous events theo exact recorded date; Sandbox dùng các stochastic analogues.
- Leader succession đọc recorded leader records khi regime match và historicalSuccession còn bật.
- Election có nhánh republic và termEnds chung.
- Decision windows được kích hoạt theo date range + conditions; option effects dùng một switch type/effect.
- Historical custom-union accession windows có logic riêng.
- Decision option có historical flag và historicalWeight, AI chọn bằng random + weight; player nhận pending decision.

### 2.3. Divergence and calibration

Trong src/engine/divergence.ts:
- Territory similarity so historicalOwner theo Region và population-weighted square-root.
- Milestone score cộng trọng số các mốc achieved/missed.
- Mốc có tolerance years; late achievement bị giảm credit.
- Divergence entries ghi decision/territory/milestone mismatch và giới hạn 3000 entry.
- Similarity là measurement-only; không feed back AI/rules.

Trong src/engine/metrics.ts:
- Yearly history lưu pop, GDP, army, navy, literacy, power, regions và legitimacy.
- Ranking dùng một powerScore.

Trong src/engine/modes.ts:
- Historical bật priorities, decision windows, dated exogenous events, historical succession và customs accession.
- Sandbox tắt các lớp đó; cả hai chạy cùng SYSTEMS pipeline.

### 2.4. Các vấn đề cần xử lý

- Event categories không phân biệt rõ physical exogenous event, institutional/political decision, historical pressure và benchmark.
- Dated event có thể apply dù điều kiện nhân quả đã đổi nếu chỉ dựa vào date; nguy cơ railroad.
- Một số effect types là switch code-bound; schema chưa có effect registry/validation đầy đủ.
- Event data không thể hiện rõ confidence về ngày/địa điểm/participants/causal interpretation.
- Milestones có thể đo outcome lớn nhưng không đủ đánh giá các cơ chế/chuỗi nguyên nhân.
- Territory + milestone score không phản ánh population, GDP, goods, urbanization, literacy, inequality, migration, public services, military organization hoặc technology.
- Calibration có nguy cơ overfit vài quốc gia/benchmark đã có dữ liệu tốt và bỏ qua polity thiếu dữ liệu.
- Nếu sử dụng một Historical Similarity tổng hợp để điều khiển AI, game sẽ trở thành railroad.

---

## 3. S22-A — Event Taxonomy and Causal Model

### 3.1. Event classes

Mỗi event phải thuộc một lớp có semantics rõ:

1. **Physical/exogenous shock** — dịch bệnh, hạn hán, lũ, núi lửa, thiên tai, crop blight, discovery; có thể xảy ra độc lập với chính trị nhưng phạm vi/hậu quả vẫn phụ thuộc trạng thái hiện tại.
2. **Institutional/political process** — reform, election, succession, treaty negotiation, council decision, protest, strike, revolt, independence process.
3. **Historical pressure/context** — mối đe dọa, economic pressure, strategic incentive, diplomatic interest, demographic trend; không phải hành động hoặc kết quả được áp trực tiếp.
4. **Conditional historical occurrence** — sự kiện được ghi nhận trong lịch sử, chỉ có thể phát sinh nếu điều kiện causal/current-state được thỏa; outcome có thể khác.
5. **Player/AI decision opportunity** — một cửa sổ để actor chọn hành động trong phạm vi quyền hạn.
6. **Historical benchmark/milestone** — mốc đo lường để đánh giá kết quả; không apply effect vào simulation.
7. **Narrative/log record** — ghi nhận điều đã xảy ra trong campaign; không tự động tạo hậu quả mới.

Không được nhập tất cả thành một Event type với một date và arbitrary effect list.

### 3.2. EventDefinition

Các trường khái niệm:
- stable event ID và event class;
- valid_from/valid_to, date_precision;
- geographic scope và actor references;
- preconditions và trigger model;
- option definitions và typed effects;
- source refs, quality và alternative interpretations.

Các trường phải phân biệt:
- exact date vs date range vs uncertain chronology;
- known location vs broad region vs uncertain;
- participant vs alleged participant vs later attribution;
- direct evidence vs secondary inference;
- trigger condition vs narrative interpretation;
- factual occurrence vs causal theory;
- alternative interpretation/disputed claim.

Event definitions là static data; EventInstance là mutable campaign state.

### 3.3. Causal gating

Event có:
- calendar eligibility;
- actor/geography preconditions;
- institution/authority preconditions;
- current economic/social/war state preconditions;
- trigger probability hoặc deterministic condition nếu nguồn hỗ trợ;
- outcome selection logic.

Nếu date đến nhưng preconditions không còn:
- không áp kết quả cũ;
- có thể event không xảy ra;
- có thể phát sinh analogue khác nếu event class cho phép;
- có thể log “historical precondition not met” để audit, không cộng penalty mô phỏng.

Không dùng exact date làm điều kiện duy nhất cho mọi sự kiện chính trị. Physical events có thể có exact date nhưng effects vẫn chỉ áp dụng cho địa lý/trạng thái hợp lệ.

### 3.4. Causal graph and event chains

Event chains phải biểu diễn prerequisite/causal dependency:
- parent/trigger event;
- actor decisions;
- state changes/conditions;
- dependent opportunities;
- branches and terminal states.

Không tạo chain bắt buộc theo lịch sử nếu nhánh trước đã diverged. Nếu một event branch bị ngắt, downstream events được invalidated/reevaluated chứ không tự fire.

Event dependencies phải acyclic hoặc có bounded recurrence rule. Không cho infinite event loop khi effect kích hoạt lại precondition.

---

## 4. S22-B — Decisions, Options and Typed Effects

### 4.1. Decision eligibility and authority

Một decision window phải xác định:
- actor/authority có quyền quyết định;
- date window và expiry;
- preconditions/cost/resource constraints;
- participant/consent requirements (S15–S17);
- player/AI availability;
- information available to decision maker;
- options có thể chọn và giải thích.

Một local ruler/council hoặc religious authority có thể là actor quyết định, không phải lúc nào cũng là Country.owner. Decision phải đi qua institution/authority model sau khi S15–S17 được triển khai.

### 4.2. Option scoring

AI score dựa trên:
- current goals/interests;
- resource cost and ability;
- institution/authority validity;
- population/coalition support;
- diplomatic/war/economic risk;
- uncertainty and expected future consequences;
- historical context bias (bounded and explainable).

Historical option chỉ nhận soft prior khi:
- actor/role liên quan tồn tại;
- regime/institution và preconditions phù hợp;
- decision maker có thể biết thông tin cần thiết;
- current-state facts không invalidate lựa chọn đó.

Không chọn option chỉ vì nó là historical. Player nhận options hợp lệ và hiểu được cost/risk; option invalid bị ẩn/disable kèm lý do.

### 4.3. Typed Effect Registry

Thay arbitrary unvalidated effect object payload bằng registry có version:
- allowed effect type;
- typed parameters;
- validation function;
- authority check;
- precondition;
- idempotency key;
- ordering/transaction boundary;
- reversible/irreversible classification;
- data version and source.

Effects gọi authorized domain commands, không mutate arbitrary object property paths. Unknown effect type phải bị reject/inert với diagnostic; không apply một phần decision rồi vẫn đánh dấu fired.

Atomicity:
1. validate all effects/options;
2. compute preconditions/resource constraints;
3. stage changes;
4. commit all or defined partial result;
5. record EventInstance and history exactly once.

### 4.4. Idempotency and duplicate prevention

- Event/decision IDs unique and stable.
- firedEvents legacy list có thể được project từ EventInstance state trong migration.
- Trigger evaluation idempotent; retry không duplicate goods/money/territory/character changes.
- Player pending decisions survives save/load với same options/expiry/authority.
- Stale pending decision invalidated deterministically nếu actor dies/regime changes/authority revoked.

---

## 5. S22-C — Historical and Sandbox event semantics

### 5.1. Historical Mode

Historical Mode:
- dùng source-backed historical seed/context/priorities;
- tuân thủ date ranges, actors, institution validity và evidence confidence;
- offer decisions khi historical context phù hợp;
- dùng historical actor/office identity chỉ khi regime/office rules còn hiệu lực;
- cho player/AI chọn alternative;
- cho phép sự kiện chưa từng xảy ra lịch sử phát sinh nếu simulation conditions tạo ra nó;
- không spawn historical result unconditional sau khi causal context diverges.

### 5.2. Sandbox Mode

Sandbox:
- bắt đầu từ cùng 1836 world/state và cùng simulation systems.
- không dùng post-start historical decision windows/priorities/outcomes làm action scripts.
- vẫn cho phép physical exogenous events khi date/conditions thực sự external, hoặc stochastic analogue theo policy explicit.
- tạo endogenous political/economic outcomes từ same state rules.
- ghi event generated với simulated provenance.
- không import fixed historical branch.

### 5.3. Mixed event classes

Một số historical events gồm cả exogenous trigger và political response. Phải tách:
- weather/epidemic/crop shock = exogenous physical record;
- policy/government response = actor decision;
- resulting unrest/migration/death = endogenous simulation;
- later political outcome = conditional emergent event.

Không bundle cả bốn phần thành một immutable one-shot event effect.

---

## 6. S22-D — Global Calibration Dataset

### 6.1. Calibration dimensions

Tạo dated benchmark series:
- population totals and scope;
- population structure/urbanization where source exists;
- GDP/GDP per capita and economic composition;
- goods production/consumption/trade and price ranges;
- literacy/education/health indicators;
- building/site/industrial output and infrastructure;
- public finance/tax/debt where data exists;
- military personnel/equipment/naval capacity/organization;
- borders/ownership/control and polity status;
- technology adoption;
- migration/displacement and demographic shocks;
- institutional/political events where quantifiable.

Một số dimensions cần data trực tiếp; các dimensions khác có thể missing hoặc chỉ có scenario-specific. Không suy ra tất cả từ GDP hoặc một Maddison estimate.

### 6.2. Benchmark record

Mỗi benchmark observation cần:
- stable benchmark ID;
- entity/geography scope;
- metric ID;
- observation date or interval;
- value and unit;
- lower/upper bound or confidence interval;
- population/entity scope;
- source ID and page/table locator;
- collection method;
- comparability/definition note;
- quality and uncertainty;
- spatial crosswalk method nếu map vào Strategic Regions.

### 6.3. Global balance

- Coverage gồm 12 project world regions và polity types (sovereign, subject, colonial, company, decentralized, confederated, rebel/formed states).
- Theo dõi metric nào có strong/weak coverage theo region và period.
- Data gaps vẫn là gaps; không fill bằng defaults rồi trình bày như measured.
- Phân biệt population under direct control với claimed population.
- Không coi modern national statistical series có historical boundary constant.

### 6.4. Training vs validation holdout

Parameter calibration phải tránh dùng cùng data để tune và tuyên bố success:
- calibration/training benchmark set;
- validation/holdout benchmark set theo metric/time/entity;
- sensitivity runs and parameter version;
- exclusions and reasons;
- versioned parameter set with provenance.

Data thưa thì report low confidence, không tuyên bố statistical validation.

### 6.5. Multi-seed distribution

Historical Mode không được đánh giá bằng một deterministic path. Chạy nhiều fixed seeds và compare distributions:
- median/mean/ranges;
- probability of outcomes within benchmark bands;
- systematic bias by region/polity type;
- extreme/unrealistic outcomes;
- variance across seeds;
- player-intervention scenarios separate from AI-only runs.

Core historical facts (dated treaty/physical event) được kiểm tra temporal accuracy riêng với emergent outcome distribution.

---

## 7. S22-E — Metrics, Divergence and Evaluation

### 7.1. Keep outcome dimensions separate

Territorial và milestone similarity hiện tại có thể giữ làm indicators, nhưng bổ sung metric groups:
- territorial/political;
- demographic/social;
- macroeconomic/fiscal;
- goods/trade/transport;
- industrial/infrastructure;
- technology;
- military/war;
- institutional/public services.

Composite summary được phép để dashboard, nhưng không che dimension-level failures và không feed simulation/AI rules.

### 7.2. Score and uncertainty policy

- Compare simulated values với benchmark intervals, không dùng exact target khi historical data uncertain.
- Penalize systematic deviations và mass-balance failures mạnh hơn plausible alternate outcomes.
- Distinguish source uncertainty với simulation variance.
- Milestone achieved chỉ khi condition và evaluation scope source-valid.
- Late achievement, partial achievement và alternate institutional path cần tách.
- Không kết luận polity historically wrong chỉ vì chọn strategy khác; đánh giá causal consistency và initial conditions.

### 7.3. Causal validation

Với high-impact historical events:
- validate causal preconditions;
- validate event date/place/actors;
- test changed preconditions suppress/alter downstream event;
- verify no double-application;
- evaluate alternative choices/plausible consequences;
- retain historical outcome as benchmark/reference, not forced state.

### 7.4. Diagnostics vs gameplay

Metrics/similarity/milestone/validation warnings là diagnostic outputs. Chúng không được:
- change AI decisions;
- add/remove resources;
- force wars/treaties;
- alter political legitimacy;
- trigger game-over;
- secretly rebalance outcomes.

Nếu một future product feature dùng metric làm gameplay objective, phải specify tường minh là gameplay, tách khỏi historical calibration score.

---

## 8. Data quality, provenance and licensing

- Sources có stable IDs, citation, URL/archive locator, author/institution, dates và rights/reuse notes.
- Mỗi fact có field-level quality: verified/supported/estimated/uncertain/missing.
- Historical terms giữ bên cạnh normalized terms.
- Disputed date/identity/outcome phải hỗ trợ alternatives thay vì silent choose.
- Images, texts and archival scans cần licensing/attribution audit riêng theo S5; research citation không đồng nghĩa permission to redistribute.
- Generated/simulated history logs không phải historical source claims.

---

## 9. Determinism, save, and event history

S22 phụ thuộc S1 data/save foundations:
- static EventDefinition/BenchmarkDefinition tách mutable EventInstance/DecisionInstance;
- versioned dataBuildHash và event rule version;
- stable IDs và idempotent effect transactions;
- event lifecycle/pending decisions được save;
- exact RNG continuation;
- event logs compacted with references to detailed records;
- historical source metadata không duplicate mỗi tick;
- unknown schema/effect version xử lý an toàn;
- old firedEvents/milestones/divergence entries migrated with explicit legacy semantics, not deleted.

---

## 10. Acceptance tests

### Event system
1. Dated exogenous event fires once only when valid scope/conditions hold.
2. Political event with unmet preconditions suppressed/reevaluated, not force-applied.
3. Causal chain branches when previous decision diverges.
4. Event effect registry validates all types/parameters before commit.
5. Partial failure cannot leave half-applied effects unless an explicit transaction policy says so.
6. Pending player decision survives save/load and invalidates safely if authority changes.
7. Historical leader succession only applies when office/regime conditions match; unknown holder never fabricates identity.
8. Sandbox does not load historical political action windows post-start.
9. Physical exogenous policy is explicit for both modes.
10. No duplicate trade/territory/character/event effect on replay/load.
11. Historical Mode can diverge without downstream historical script firing.
12. Same seed/command stream yields exact event/decision continuation.

### Calibration
1. Every benchmark has source/scope/unit/date/quality.
2. No value silently mapped to all regions from polity aggregate.
3. Training/validation split is reproducible.
4. All 12 world regions and entity types have coverage report.
5. Metrics handle uncertainty intervals and missing values.
6. Multiple seeds produce distributions with confidence/range summaries.
7. Dimension-level scores exposed; no hidden composite-only result.
8. Calibration/metrics do not mutate GameState/AI utility.
9. Population/Goods/Save mass-balance failures treated as hard invariants.
10. Regression scenarios span 1836–1876, 1836–1900 and 1836–1936, multiple seeds and major world regions.

---

## 11. Implementation slices after authorization

Planning only:
1. S1 data/save foundations.
2. S22-A typed EventDefinition and EffectRegistry.
3. S22-B event instance lifecycle/decision windows/authority validation.
4. S22-C causal chains and Historical/Sandbox event policies.
5. S22-D benchmark registry and source quality schemas.
6. S22-E multi-seed calibration harness and holdout analysis.
7. S22-F dimension-level divergence/diagnostic dashboard.
8. Integrate with S15–S21 after their data contracts and acceptance gates are stable.

No implementation until owner approves exact slice and S1 is accepted.

---

## 12. Open decisions

1. Which physical shocks are truly exogenous and which are historical interpretations/causal chains?
2. How much historical priority bias is useful before it becomes hidden railroading?
3. Which data dimensions have enough global evidence for calibration vs only regional scenarios?
4. How to weight different benchmark metrics without allowing well-documented Europe to dominate global calibration?
5. How to handle benchmark changes due to disputed state boundaries and population scope?
6. What multi-seed count is sufficient within Android/desktop CI budgets?
7. What does historical plausibility mean for alternate outcomes, beyond matching one observed path?
8. How to version parameters and event rules while preserving legacy saves?

Any normative roadmap change requires explicit owner decision trace.

---

## 13. Review boundary

Claude no-write review should assess event taxonomy/causality, no-railroad semantics, typed effects/idempotency, source confidence, global calibration quality, holdout/seed methodology, divergence score isolation and save/performance constraints.

A REVIEW_PASS here applies only to this design document. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S22 or authorize code/data/save/test/UI/Android/APK changes.

**Kết luận:** S22 phải làm lịch sử có căn cứ và kiểm định được, nhưng không biến năm 1836 thành một kịch bản đã viết sẵn cho 100 năm sau. Events tạo bối cảnh/quyết định; mô phỏng tạo hậu quả; benchmarks đo chất lượng, không điều khiển kết quả.


---

## 14. Normative design amendments — code-baseline traceability (2026-11-18)

This section is a design-only refinement responding to the ChatGPT self-audit supplement at
`docs/audit/s0/S22_DESIGN_TRACEABILITY_SELF_AUDIT_2026-11-18.md`.
It clarifies the intended contracts; it does not authorize implementation or alter the code baseline.

### 14.1 Deterministic rank condition semantics (SA-01)

The `rank_at_most` condition MUST use one canonical, versioned rank context shared with the public country-ranking definition. For the current code baseline, the intended compatibility source is the existing `rankings()` contract in `src/engine/metrics.ts`, which ranks living, non-decentralized countries by the existing `powerScore()` metric. It MUST NOT silently substitute GDP-only rank or a Europe-only candidate list.

The rank contract is:

- Candidate set: countries with `alive === true` and `decentralized === false`; subjects remain eligible because the current ranking contract includes them. A future polity-type expansion must version and document any change to this candidate set.
- Metric: the same canonical `powerScore()` used by country rankings, with its formula/version recorded in the rule/data build identity.
- Ordering: descending finite power score, with normalized stable entity ID ascending as a deterministic secondary display ordering.
- Rank number: competition rank (`1 + count of eligible entities with strictly greater score)); exact ties share the same rank.
- Missing/dead/decentralized target, non-finite score, or unavailable ranking context: condition evaluates false and emits a diagnostic. It MUST never default to true.
- Composite `all`/`any` conditions in one evaluation share the same immutable rank snapshot for that tick; repeated evaluation cannot observe different ordering.
- Tests cover first/last eligible positions, exact threshold, one place outside threshold, ties, subject inclusion, decentralized exclusion, newly formed actors, missing IDs and non-finite scores.

If a later approved design chooses a different power model, the rank contract and its version must change explicitly with migration/compatibility tests; no hidden rank definition is permitted.

### 14.2 Regional historical indicators cannot become global actor classes (SA-07)

The African partition observation that currently uses `count_owner_european` is a specifically named, geographically scoped regional indicator. Its source-defined regions, time interval, actor classification and denominator must be retained with the observation.

- The indicator may contribute to an Africa-specific historical report only.
- It MUST NOT be reused as a generic worldwide ownership predicate, a universal definition of colonial/imperial actors, or a proxy for global historical fidelity.
- Global aggregates must be built from explicit region × period × polity/actor-class coverage records with source-backed classification. A Europe-derived class cannot be assumed valid in Asia, Africa, Oceania or the Americas.
- Regional indicators remain separately visible; they cannot compensate for missing or failing evidence in other regions or dimensions.
- Coverage reports show numerator, denominator, excluded entities, missingness and source strength by region and polity type. No evidence is treated as a zero observation.
- A future generalized actor-class condition must use a versioned, source-backed classification registry with geographic and temporal validity, not a hard-coded list embedded in the evaluator.

### 14.3 Milestone tolerance and resolved-score semantics (SA-09)

A milestone remains provisional while its own tolerance interval is open. A pending milestone MUST NOT be counted as a resolved failure merely because its nominal `check_date` has passed.

The resolved milestone score is defined as follows:

1. Before `check_date`, the milestone is not yet score-eligible.
2. From `check_date` through the inclusive `lastChance = dueTick + toleranceYears * ticksPerYear` boundary, status `pending` is excluded from both numerator and denominator.
3. A milestone that becomes `achieved` during this interval enters the resolved denominator and receives its explicitly documented late-achievement credit.
4. An unmet milestone transitions to `missed` at the inclusive `lastChance` boundary and then enters the denominator with zero numerator credit.
5. A resolved `achieved` or `missed` milestone is immutable unless a separately specified correction/migration operation changes it with an audit record.
6. If no milestones are resolved, the score is `NOT_SCORABLE` / null with a resolved-count of zero; it MUST NOT report a misleading perfect score of 1.0.
7. The dashboard reports provisional count, achieved count, missed count, resolved denominator and score independently. The score is never used as gameplay logic.

Late-achievement credit must have one versioned formula and be tested at the due tick, midpoint of grace, final grace tick and after expiry. Save/load and replay must preserve identical lifecycle and score results.

### 14.4 Decision command boundary and non-consumption on rejection (SA-03)

A pending player decision is not authority to execute arbitrary option data. At the command boundary, immediately before applying a choice, the implementation MUST:

- retrieve the canonical decision definition by stable ID;
- confirm the pending instance is still in `pending` state and belongs to the current player-controlled actor/authorized decision authority;
- confirm the submitted option exists in both the canonical definition and the pending option set;
- confirm the current date is within the inclusive/exclusive window semantics declared by that definition;
- re-evaluate actor existence, regime/institution authority, consent/participation rules, current causal conditions and resource/cost preconditions;
- validate every typed effect and target, stage the complete mutation set, and commit atomically;
- only after successful commit transition the instance to `resolved` and project its stable event ID into any legacy fired-event view.

Invalid option, stale definition, expired window, revoked authority, changed causal precondition or failed effect validation MUST NOT partially mutate game state, remove a still-valid pending item, or mark the event fired. The item instead receives a deterministic `expired` or `invalidated` lifecycle transition with a reason and audit entry where appropriate. A retry of the same accepted command is idempotent and cannot apply effects twice.

The command API is the enforcement boundary; UI hiding/disabling an option is not a security or correctness control. The decision instance must persist actor, definition/version, offered option IDs, creation tick, expiry semantics and lifecycle state sufficiently to validate after save/load.

### 14.5 Source-date precision and monthly effective-time policy (SA-08)

The source-recorded date and simulation-effective tick are separate fields. For a day-precision event in a monthly simulation:

- preserve the exact source date and declared precision unchanged;
- map it to the one monthly tick defined by the calendar policy (the containing month);
- retain the original source date, effective month/tick and aggregation policy in the event record;
- when multiple day-specific events fall in one month, process them deterministically by effective tick, source date, then stable event ID;
- logs and UI must say that the event is source-dated on the exact day but applied on the monthly simulation tick. They must not imply that the simulation resolved intra-month consequences.

Month/year/range-precision records use their declared precision and explicit effective-time policy. No ETL step may silently promote month precision to day precision or collapse a source day without retaining it.

### 14.7 Closed Condition schema and recursive validation (SA-10)

The historical condition language MUST be a closed, versioned grammar. The current open TypeScript shape `{ type: string; [k: string]: unknown }` is not an acceptable validation boundary for event, priority or benchmark data.

**Current source-data condition inventory**

The conditions found in the inspected country profiles, event decision windows and milestone definitions include:

- Entity/lifecycle: `exists`, `exists_independent`, `leader_changed_since_start`, `regime_changed`, `regime_changed_since_start`.
- Ownership/geography: `owns`, `owner_in`, `owner_not`, `same_owner`.
- Law/institution: `law`, `law_not`, `gov_power`.
- War/diplomacy: `not_at_war`, `not_subject_of`, `at_war_with_rebels`, `lost_war_recently`.
- Society/politics: `legitimacy_below`, `radicalism_above`, `food_shortage`, `ig_clout_above`, `foreign_naval_pressure`, `foreign_pressure`.
- Strategic ranking: `rank_at_most`.
- Composition: `any`, `all`.
- Existing regional historical indicator: `count_owner_european`, restricted by §14.2 to its specifically named Africa indicator; it is not a generic global classification primitive.

This is a source-inventory list, not permission to add new condition kinds without updating the grammar, validator and tests.

**Schema requirements**

- Replace the open string/index-signature structure with a TypeScript discriminated union, one branch per supported `type`.
- Every branch MUST declare its required fields and their primitive/value types. Optional fields must be explicit; unknown properties must be rejected unless a versioned extension mechanism allows them.
- Entity, region, IG and law-group references MUST resolve against the corresponding registries. `owner_in`/`owner_not` require non-empty entity arrays; `same_owner` requires a non-empty region array; `any`/`all` require non-empty child arrays.
- Numeric thresholds and durations MUST be finite and within documented ranges. Dates and date windows MUST be valid and ordered. Boolean/numeric defaults must never be introduced by JavaScript casts or `Number(undefined)`.
- Recursive composites MUST be validated with a fixed maximum depth and node count (initial design limit: depth 8, maximum 64 nodes per expression) to prevent pathological payloads and unbounded evaluation.
- The same validator MUST be used for strategic-priority conditions, decision-window conditions and milestone tests. No separate, weaker milestone-only walker may be treated as sufficient.
- Build-time validation MUST reject unknown types, missing required keys, wrong primitive/array shapes, invalid IDs/enums, empty composite arrays, out-of-range values and excessive recursion with a path-specific diagnostic.
- Runtime condition evaluation MUST be total over untrusted/corrupt data: malformed or unknown conditions return a structured non-match diagnostic and MUST NOT throw or partially advance the monthly simulation. Build-time rejection remains the primary safeguard.
- The regional `count_owner_european` branch remains bound to its explicitly named regional indicator, source-defined regions, valid period and denominator; it cannot be generalized through arbitrary condition data.

**Acceptance tests**

- Every current source condition passes the closed schema and maps to exactly one discriminated-union branch.
- The test suite exercises true and false results for every supported condition type, including missing/dead entities, ownership equivalence, war participants, rank context and nested `any`/`all`.
- Build fixtures reject misspelled types, missing fields, wrong types, invalid entity/region/IG/law IDs, empty arrays, invalid numeric thresholds, invalid dates and recursion beyond the declared limits.
- The same fixtures are tested under priority, decision-window and milestone paths to prove they share identical validation.
- Runtime evaluation of malformed data returns a diagnostic/non-match and never throws.
- Condition diagnostics and benchmark scoring remain measurement-only and cannot mutate simulation state or AI utility.

### 14.6 Acceptance additions

Add the following invariant-level tests to §10 before any runtime proposal:

- `rank_at_most` matches the canonical ranking candidate set and power metric; ties and missing ranks fail deterministically.
- Africa partition remains a regional indicator and is excluded from generic global actor-class aggregates.
- Pending milestones inside tolerance do not enter a resolved score; zero resolved milestones produce `NOT_SCORABLE`.
- A stale/invalid decision option or failed effect transaction leaves the simulation state and fired-event view unchanged, apart from the explicit deterministic invalidation/expiry transition.
- Day-specific source dates remain intact while the monthly effective tick and log label follow the declared policy.
- Replaying a resolved decision or reloading its save cannot double-apply effects.

These amendments close the design-level gaps identified in SA-01, SA-03, SA-07, SA-08, SA-09 and SA-10. SA-02, SA-04, SA-05 and SA-06 remain governed by §§4.2–4.4, 6 and 7 and must be independently checked against the concrete implementation design before any code authorization.


### 14.8 Mode contract for physical hazards, biological hazards and human discoveries

The current baseline uses one switch: Historical Mode applies all nine dated exogenous records, while Sandbox disables all dated records and substitutes stochastic drought/epidemic/blight/discovery analogues. This is a legacy implementation choice, not a sufficient semantic classification for a global 1836–1936 simulation. “Exogenous” MUST describe causal independence from campaign decisions, not merely “present in a historical source”.

Classify each occurrence into one of these causal inputs before assigning mode behavior:

1. **Physical forcing** — a meteorological/geophysical event whose occurrence is independent of polity decisions. A source-backed date/location can be a shared world input in both modes when the evidence and precision justify it. The event applies only the physical hazard; crop loss, hunger, mortality, migration, unrest and state response remain simulation outcomes.
2. **Biological hazard introduction** — an epidemic/pathogen/crop-blight introduction. Historical source evidence may support a dated origin or first observation in Historical Mode, but propagation and affected territory MUST be computed from the current campaign's population, transport, climate, trade and contact network. Do not blindly apply the full historical affected-region list after those networks diverge. Sandbox uses the same spread mechanics with its declared stochastic/conditional introduction policy, not a fixed historical footprint.
3. **Human-mediated discovery** — a mineral/resource discovery, scientific observation, exploration or settlement-dependent find. A geological deposit and knowledge/discovery are separate facts. A historical discovery MUST NOT add a resource to a region unconditionally merely because the calendar reaches a date. It requires a plausible actor, access, capability/knowledge and current preconditions; the historical record may contribute context or a bounded prior in Historical Mode. Sandbox discoveries emerge from the same capabilities and rules without a post-start historical discovery script.
4. **Social/economic consequence** — famine, mortality, migration, market collapse or political unrest. These are outcomes of hazards, institutions, infrastructure, market access, policy and population behavior. They MUST be simulated from state changes, not bundled into a one-shot “historical event” effect unless the source is measuring an independently observed quantity that is explicitly modeled as such.

**Current nine-record inventory requiring classification**

- Cholera wave records (`exo_cholera_2`, `exo_cholera_3`): biological hazard evidence; distinguish introduction/first observation from spread through the current contact network.
- Agra, Northern China and southern India drought/famine records (`exo_agra_famine`, `exo_north_china_famine`, `exo_great_indian_famine`): treat the sourced drought hazard separately from famine severity, mortality and relief outcomes.
- Potato blight (`exo_potato_blight`): biological hazard introduction/spread; historical affected-region list is evidence for the historical run, not a mandatory footprint after alternate trade/transport conditions.
- California, Victoria and Witwatersrand gold records (`exo_gold_california`, `exo_gold_victoria`, `exo_gold_witwatersrand`): human-mediated discovery. Geological resource presence, discovery knowledge, public announcement, rush migration and production are distinct states/processes.

Mode behavior:

- Both modes continue to use the same monthly `SYSTEMS` pipeline and the same 1836 starting world.
- Historical Mode may use source-backed historical origin/date, historical context, priorities and decision opportunities. It may not force a downstream spread, policy response or political result after causal preconditions diverge.
- Sandbox does not run post-start historical political decision scripts, historical successor scripts or historical priorities. It still uses the same physical/biological/economic systems; each hazard class explicitly declares whether its initial forcing is shared, conditional or stochastically generated.
- A source record MUST declare its mode applicability, causal class, date precision, geography semantics (origin vs observed spread vs affected-area estimate), uncertainty and downstream simulation model. No global rule such as “all dated events only in Historical Mode” or “all physical events always repeat in Sandbox” is permitted.
- If the available source only records the historical realization and cannot establish an independent exogenous origin, represent it as historical evidence/conditional context, not as a forced physical input.

Acceptance tests must change the campaign transport/contact network and verify that epidemic/blight spread changes; change actor access/knowledge and verify discovery can be suppressed or delayed; verify drought hazard does not directly script famine/mortality; prove Historical Mode can suppress downstream consequences after changed preconditions; and prove Sandbox does not silently import fixed political outcomes.

### 14.9 Structural rules are a separate, executable rule registry (SA-11)

A structural rule is a reusable institutional/constitutional constraint or transition, not a narrative event and not an untyped arbitrary effect. The current baseline stores one Salic-law rule in `historical_events.json` and compiles `structural_rules`, but the runtime succession path contains a hard-coded Salic-law branch. The builder only validates source references for the data rule. The source catalogue and runtime therefore do not yet have one enforced source of truth.

Before runtime work, define a versioned `StructuralRuleDefinition` with:

- stable rule ID, rule kind, version and validity interval;
- actor/institution/office scope and mode applicability;
- typed trigger predicate and exact authority context;
- typed effect/transition and deterministic precedence;
- source references, evidence quality and interpretation note;
- idempotency key and audit/log semantics.

The registry MUST use closed trigger/effect unions and registered handlers; it MUST NOT evaluate arbitrary code or object paths from JSON. Build-time validation resolves all actors, offices, subjects, law groups and other targets. At runtime, either the compiled rule registry is the actual source of truth or a rule explicitly marked `reference_only` is not presented as an executable game rule. Do not retain a second hard-coded copy of the same rule in `events.ts`.

For the current Salic-law example, specify whether the rule applies to succession of a British ruler, which heir attributes establish the rule trigger, which personal-union subjects are affected, what the effective tick is, and whether it runs before/after succession state commit. Avoid deriving a legal trigger from a name regex when a typed heir/office attribute is required by the source evidence.

Acceptance tests must prove that enabling/disabling a source rule changes only the expected transition; unknown trigger/effect kinds fail the data build; a rule cannot fire twice on replay; ordering with succession is deterministic; and no hard-coded duplicate applies the same transition independently.

### 14.10 Closed schemas for all executable event content (SA-12)

§14.7 closes the condition grammar. The same validation discipline is required for every other executable data surface; condition validation alone is insufficient.

Closed, versioned discriminated schemas are required for:

- `StrategicPriority` (goal, target shape, finite weight, ordered valid date window, condition list and source refs);
- `DecisionWindow` (unique ID, valid date window, date_historical semantics, owning actor/authority, conditions, unique options, historical-weight range and source refs);
- `OptionEffect` (every type and payload field);
- `ExogenousEvent` (causal class, hazard type, valid date/precision, origin/affected-scope semantics, duration, magnitudes, regional parameters, mode policy, quality and source refs);
- `StructuralRuleDefinition` (per §14.9);
- `Milestone` (unique ID, valid due date, non-negative tolerance/weight, typed condition and explicit geographic/entity denominator);
- benchmark definitions and observations (per §§6 and 7).

The current decision effect inventory is `set_law`, `legitimacy`, `relation`, `drop_claims`, `transfer_region`, `regime_change`, `merge`, `ig_approval` and `relation_all_naval_powers`. Each branch needs exact parameter types, target resolution, numeric bounds, authority checks, idempotency semantics and a defined transaction effect. An effect that is currently an intentional no-op (`ig_approval` in the inspected baseline) MUST be marked unsupported and rejected during build or given an explicitly approved semantic definition; silently accepting it is prohibited. `merge` and `transfer_region.create` must not rely on hidden hard-coded polity IDs/names when the authored payload expresses a target; target creation must be registry-backed and validated.

The current exogenous handler recognizes `epidemic`, `drought`, `crop_blight` and `resource_discovery`. These must be a closed union with domain-specific ranges and field combinations. For example, mortality, yield loss and per-region severity must be finite and bounded; a discovery must include a valid resource and discovery preconditions; a drought must not silently carry epidemic-only fields. Date values must be syntactically valid, precision explicit and duration bounded by a documented maximum.

The builder MUST reject duplicate IDs, unknown types, missing/wrong fields, invalid references, invalid dates, impossible intervals, non-finite/out-of-range numbers, duplicate option IDs, historical_weight outside its declared range, and unsupported effects with a source path and JSON path. It must validate all current decision options, event records and structural rules recursively before generating `db.json`.

Source normalization must be assigned into the compiled records, not merely called for side-effect validation and discarded. Event/decision/structural records retain normalized stable `SourceRef[]`, quality, locator, uncertainty, alternative interpretation and mode/causal metadata in their declared types. The compiled database must not depend on untyped extra JSON properties surviving serialization.

### 14.11 Historical option bias must be quantitatively subordinate to current utility (SA-02)

Decision selection has two stages: eligibility first, scoring second.

1. Remove options whose actor authority, date window, current conditions, costs, required resources or effect payloads fail validation. Player and AI cannot choose invalid options.
2. Score each remaining option from current-state expected utility: expected benefits, resource/fiscal cost, domestic coalition response, diplomatic/war risk, implementation capacity, uncertainty and opportunity cost.
3. Normalize utility to a documented common scale (initial design proposal: `[0,1]`) with versioned weights and missing-data policy.
4. In Historical Mode only, apply a source-backed historical prior of at most **0.05 absolute utility points** to a compatible historical option. This is a proposed initial ceiling, not a value derived from historical evidence; it must be sensitivity-tested and approved before implementation.
5. The historical prior MUST NOT reverse an option whose current-state utility is more than 0.05 below a feasible alternative. It is a weak tie/context signal, never a substitute for current utility.
6. Stochastic choice among near-equivalent options uses a bounded, documented choice model and an isolated deterministic random stream. Do not add unbounded `rand(st)` noise to each option score.
7. Sandbox receives no historical option prior. Player agency is not overwritten by the prior.

Test a materially worse historical option losing despite the prior, a materially better historical option winning, equal-utility options exhibiting only the bounded prior effect, current treasury/coalition/war-risk changes reversing a choice, invalid options never being selected, and multi-seed distributions remaining calibrated without a scripted historical frequency.

### 14.12 Deterministic random streams, save compatibility and mobile performance

The inspected runtime stores one mutable four-word RNG state in `GameState.rng`; `rand(st)` advances that shared stream. Adding or reordering one stochastic event check can therefore shift later AI, combat, mortality and economic random outcomes even when their own logic is unchanged.

S22 MUST preserve deterministic replay while preventing unrelated event additions from perturbing every downstream subsystem:

- Define stable, versioned random streams by subsystem and stable event/decision identity. Prefer keyed/counter-based draws derived from seed + stream ID + tick + actor/event ID + draw index, or an equivalently deterministic stream design.
- No `Math.random()`, wall-clock seed, iteration-order-dependent draw assignment or hidden ambient randomness.
- Save the RNG stream version and required counters/state; migration belongs to the S1 save/data foundation and must preserve continuation semantics.
- Replaying the same save, command sequence, data build and rule version yields exact event/decision continuation. A new unrelated event definition must not change unrelated actors' random draws.
- Multi-seed calibration records seed set, engine commit, data build hash, schema/rule versions, parameter manifest and run configuration.

Runtime evaluation must remain bounded for the full project world and 1836–1936 horizon:

- Index static definitions by effective date/interval, actor, geography and event class; evaluate only newly eligible/active definitions rather than scanning all historical records on every monthly tick.
- Bound causal graph depth, events activated per tick, pending decisions per actor, retained event-log detail and diagnostic volume. Define caps and deterministic overflow behavior; never silently drop unresolved player decisions.
- Use incremental propagation and cache immutable source/definition data. No repeated full-registry validation inside a monthly loop.
- Keep multi-seed calibration/holdout analysis in CI or an explicitly selected off-device analysis path; do not run large ensembles on the Android gameplay/UI thread.
- Device performance budgets must be measured against the S0 performance baseline on the minimum supported Android tier and the target iQOO-class device. Report p50/p95 monthly-step time, peak heap, GC pauses, temperature/throttling, battery cost and worst-case event/decision counts. Do not claim a numeric budget until measurements and the owner-approved device envelope are recorded.
- Event processing must not cause main-thread I/O, blocking source lookup, ANR or unbounded save/log growth.

Acceptance tests include deterministic replay across save/load, RNG isolation between subsystems, unrelated-event insertion invariance, worst-case 100-year multi-region simulation, event registry stress, bounded diagnostics/logs, and device profiling with both normal and worst-case event density.



### 14.13 Condition semantic contract and edge cases

A closed field schema is necessary but not sufficient: each predicate also needs one stable, documented meaning. The following semantics apply to the current evaluator contract and must be verified against its source data before implementation:

| Condition | Required semantics / fail-closed behavior |
|---|---|
| `exists` | Referenced entity resolves and is alive. Unknown ID is invalid at build and a runtime non-match. |
| `exists_independent` | Entity resolves, is alive and has no current overlord. Whether decentralized placeholders count as independent must be explicit in the actor taxonomy and covered by tests; do not infer sovereignty from missing overlord alone. |
| `owns` | Referenced region resolves and its current owner is the specified entity under the declared entity-equivalence policy. |
| `owner_in` / `owner_not` | Region resolves; owner is compared through the canonical equivalence registry. A missing/unknown region or owner is a non-match diagnostic, not an implicit “not in set”. |
| `same_owner` | At least two valid regions are required; all must have a known owner and resolve to the same canonical owner. |
| `law` / `law_not` | Country exists and law group/value pair is valid in that polity's law registry. `law_not` must not become true when the country/law is missing. |
| `gov_power` | Valid country and valid power-law value; exact equality only. |
| `not_at_war` | Both actors resolve; true only when they are not on opposing sides of any active war. Missing actors are not treated as “not at war”. |
| `not_subject_of` | Both actors resolve; true only when actor A's current overlord is not B. Missing A/B is a non-match diagnostic. |
| `regime_changed` / `regime_changed_since_start` | A valid country has a recorded regime-change transition after the scenario's start snapshot. Keep any legacy alias explicit; do not equate a null/missing baseline with “changed”. |
| `leader_changed_since_start` | A valid country has a leader identity/office succession after the scenario start snapshot. Do not hard-code 1836 inside the predicate; read the versioned scenario start. |
| `lost_war_recently` | Country exists and recorded loss tick is within the inclusive interval `[currentTick - years*ticksPerYear, currentTick]`; future ticks, missing loss and invalid duration are false/invalid. |
| `legitimacy_below` | Country exists; compare its documented 0–100 scale to a finite threshold in that same scale. |
| `radicalism_above` | Country exists; compare its documented 0–1 share to a finite threshold in [0,1]. |
| `food_shortage` | Country exists; current v1 threshold is famine share > 0.03. The 0.03 threshold is a versioned named constant, not an undocumented magic number; future tuning requires a schema/rule version. |
| `ig_clout_above` | Country and valid IG exist; clout and threshold use the same 0–1 scale. |
| `foreign_naval_pressure` | Country exists; pressure and threshold use the declared bounded pressure scale; validate finite values. |
| `foreign_pressure` | Country exists; current v1 threshold is the named rule constant > 0.8 and must be documented/versioned. |
| `at_war_with_rebels` | Requires a normalized civil-war participant model that explicitly identifies government and rebel actors. Do not rely only on arbitrary attackers/defenders array position; ambiguous or unclassified sides are a non-match diagnostic. |
| `rank_at_most` | Uses §14.1's immutable canonical ranking snapshot, never an independent caller-specific ranking. |
| `count_owner_european` | Only the source-defined Africa regional indicator in §14.2; region set, period, classification and denominator are mandatory. |
| `all` / `any` | Non-empty validated child list; deterministic short-circuit semantics; bounded depth/node count and one immutable evaluation context. |

For every condition kind, documentation and tests must cover: valid true, valid false, missing reference, wrong type, boundary value, current date/start-date behavior and interaction inside both `all` and `any`. The engine must not use a missing entity's default values (for example default legitimacy or zero pressure) to satisfy a predicate.

The source data currently uses `same_owner` with two or more regions and does not use every code-supported condition kind. New authored data must not assume an unused evaluator branch is safe merely because the TypeScript compiler accepts its open shape.

### 14.14 Current option-effect contract inventory

The existing nine effect kinds are a legacy inventory, not an approved implementation API. Before migration, each must receive a typed schema and a registered handler with explicit preconditions, authority, mutation plan, idempotency and test coverage:

| Legacy effect | Required payload contract | Domain behavior to specify |
|---|---|---|
| `set_law` | entity ID, law group, value | Value valid for that actor/institution; route through the law command and preserve institution/authority rules |
| `legitimacy` | entity ID, finite delta | Defined legitimacy scale and clamped result; missing target rejected before staging |
| `relation` | two actor IDs, finite delta | Symmetric/ordered relation key policy, bounds and treatment of self-relations |
| `drop_claims` | claimant entity ID, opposing entity ID | Remove only claims matching the declared scope; every referenced region/owner validated |
| `transfer_region` | region ID, target actor ID, optional typed create-target record | Validate current owner, recipient, sovereignty/subject setup and territorial invariants |
| `regime_change` | entity ID, non-empty valid law patch | All laws validated first; regime timestamp and institution-dependent side effects committed atomically |
| `merge` | source actor IDs, explicit destination actor/blueprint ID | Validate all sources and destination identity; no hard-coded nation archetype or ignored `into` field |
| `ig_approval` | entity ID, valid IG ID, finite delta | **Unsupported in the inspected baseline (no-op).** Reject until a formal IG approval meaning, bounds and mutation semantics are approved and implemented. |
| `relation_all_naval_powers` | source entity ID, finite delta, explicit naval-power classification/threshold version | Define whether this affects great powers, every qualifying navy or a source-defined actor class; keep the target set deterministic and auditable |

Effects are applied to a staged mutation plan, not sequentially to live state. Validation must cover the whole option before the first mutation. The plan records its idempotency key and expected state/version preconditions. If any command cannot commit, no earlier staged effect is visible. Irreversible effects require an explicit transaction policy and audit record.

No source-authored option may depend on ignored fields, implicit defaults, magic nation IDs, name-regex identity or a handler with no effect. The effect table must be reconciled against all current source JSON payloads and all handlers before the typed union is frozen.
