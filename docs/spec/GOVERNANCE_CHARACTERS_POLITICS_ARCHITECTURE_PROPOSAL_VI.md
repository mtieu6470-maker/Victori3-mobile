# Đề xuất kiến trúc — Chính quyền địa phương, nhân vật và thể chế chính trị (S15–S17)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày:** 18/11/2026  
**Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Roadmap:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, áp dụng sửa đổi owner-approved v3.3  
**Các thiết kế phụ thuộc:** POP Cohorts (S6), Goods/Markets/Transport (S7–S8), BuildingType/BuildingSite (S10–S11)  
**Trạng thái:** `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`

> Tài liệu này không mở S1 hoặc S15–S17. Không thay đổi engine, schema save, historical data, tests, UI, assets, Android, workflows hoặc APK. Mọi schema dưới đây chỉ là khái niệm, phải qua data contract và owner authorization trước khi triển khai.

---

## 1. Mục tiêu và nguyên tắc

Xây dựng mô hình nhà nước/xã hội có chiều sâu mà không giả định mọi polity từ 1836 đến 1936 đều là một quốc gia dân tộc tập quyền, có nghị viện, bầu cử phổ thông, bộ máy hành chính hiện đại và các nhóm lợi ích giống châu Âu công nghiệp.

Thiết kế cần hỗ trợ:

- năng lực cai trị khác nhau giữa trung ương, địa phương, lãnh thổ phụ thuộc và vùng tự trị;
- cơ quan và office có thẩm quyền cụ thể, thời hạn và phạm vi;
- dịch vụ công theo năng lực, nguồn lực và khả năng tiếp cận, không chỉ theo ngân sách quốc gia;
- đô thị hóa gắn với việc làm, nhà ở, lương thực, nước, vệ sinh và hạ tầng;
- nhân vật lịch sử có nguồn, nhân vật mô phỏng có nhãn, chức vụ và kế nhiệm có kiểm soát;
- đa dạng thể chế: quân chủ, cộng hòa, đế chế, liên bang, hội đồng, liên minh bộ tộc, hệ thống chư hầu, chính quyền thuộc địa, chính quyền tôn giáo và các hình thức lai;
- nhóm lợi ích, phong trào, cải cách, phản kháng, đình công, cách mạng và ly khai phát sinh từ cấu trúc xã hội và luật;
- quan hệ nhân quả giữa cohort, địa phương, cơ quan, nhân vật, thể chế, quyền lực, legitimacy và năng lực thực thi;
- cùng một pipeline cho Historical/Sandbox, không ép kết quả lịch sử cố định sau ngày bắt đầu.

### 1.1. Không được đánh đồng các khái niệm

| Khái niệm | Không đồng nghĩa với |
|---|---|
| State / polity | dân tộc, quốc gia hiện đại hoặc một sắc tộc duy nhất |
| Sovereignty | quyền kiểm soát thực tế mọi vùng |
| Government | một cá nhân đứng đầu |
| Administration | toàn bộ nhà nước; có thể phân quyền hoặc dựa trên trung gian địa phương |
| Legitimacy | một số approval duy nhất |
| Political institution | luật viết hiện đại hoặc nghị viện |
| Interest group | một stratum/cohort duy nhất |
| Movement | một IG thường trực hoặc một event được script |
| Character | toàn bộ dân số; chỉ là cá nhân có vai trò mô phỏng đáng kể |
| Public service access | mức chi ngân sách hoặc một trường literacy/health trung bình |

---

## 2. Hiện trạng code tại baseline

### 2.1. Chính trị hiện hành

- `src/engine/types.ts`: 8 IG được định nghĩa toàn cục: landowners, industrialists, intelligentsia, petty_bourgeoisie, clergy, armed_forces, rural_folk, trade_unions.
- `Country.igs` là Record cố định, mỗi nhóm có `clout` và `approval`; chưa có tổ chức, lãnh đạo, thành viên, cơ sở địa phương hoặc mục tiêu riêng.
- `src/engine/systems/politics.ts:9–28`: IG preferences và POWER_WEIGHTS hard-coded; cùng bảng dùng cho mọi polity.
- `politics.ts:36–79`: clout suy ra từ 9 strata/Region, literacy và manpower; không đọc occupation/ownership/cohort alignment.
- `politics.ts:81–118`: reform support là clout-weighted law approval; progress và thất bại bằng một công thức.
- `politics.ts:121–151`: cách mạng có ngưỡng radicalism/legitimacy; regime outcomes dùng danh sách thay đổi luật khá cố định.
- `politics.ts:201–219`: ly khai dựa trên cultureNation, nationalism và radical; không có movement organization, leadership hoặc negotiation.

### 2.2. Laws / data model

- `src/engine/data/dbTypes.ts:22–24`: 9 LawGroups gồm power, governance, economy, trade, labor, church, press, education, army.
- Law values và preference tables chưa có institution-specific validity hoặc rule definitions theo từng polity.
- `EntityRecord` có một trường government dạng string, laws dạng Fact, personality và priorities; chưa có constitutional/administrative structure đầy đủ.
- `DecisionWindow` hỗ trợ điều kiện, option và effects; chưa phải hệ thống luật/thiết chế có state machine và negotiation.

### 2.3. Nhân vật hiện tại

- `Country.leader` là một object duy nhất; `heir` là một object rất đơn giản.
- `LeaderRecord` trong historical DB có name/title/born/died/from/to/governance/end/quality, nhưng chưa phải Character registry có traits, skills, offices, faction ties, biography/provenance và quan hệ.
- `src/engine/systems/events.ts:25–35` xử lý succession và election theo các rule chung; bầu cử được gắn chủ yếu với `governance === 'republic'`.
- `politics.ts:156–199` tạo tên lãnh đạo từ NAME_POOLS theo language-family/religion proxy; đây là name-generation heuristic, không phải nguồn dữ liệu lịch sử.
- Generated names có nhãn generated trong UI/log, nhưng không có lifecycle/character identity/appointment ledger đầy đủ.

### 2.4. Chính quyền địa phương và dịch vụ công

- Runtime tập trung Country/Region; chưa có AdministrativeUnit lịch sử có validity, local authority hay office.
- S5/S15 roadmap yêu cầu administration, education, health, security, urbanization và housing/infrastructure.
- Current literacy/health/budget là các scalar hoặc national spending share; không thể phản ánh việc vùng xa không có trường, bệnh viện hoặc quan chức dù ngân sách quốc gia cao.
- Chưa có housing stock, sanitation, water, municipal revenue/capacity hoặc settlement-level public-service coverage.

### 2.5. Hệ quả

Không chỉ tăng thêm 20 luật, 10 IG và nhiều event. Cần chuyển sang mô hình:
- institution definitions (static);
- mutable government/office/authority state;
- character registry + appointments;
- political organizations/movements;
- local public-service capacity and coverage;
- query/projection cho UI.

---

## 3. S15 — Local Government, Public Services and Urban Development

### 3.1. Administrative geography boundary

S15 phụ thuộc S3/S4:

- StrategicRegion vẫn là đơn vị macro simulation ở giai đoạn đầu.
- AdministrativeUnit có `valid_from/valid_to`, tên thời kỳ, cấp, loại, parent/overlap, authority, owner/controller history và provenance.
- Settlement là thực thể địa điểm độc lập, có type/period/name/coordinates/uncertainty.
- Không coi admin-1 hiện đại là tỉnh năm 1836.
- Không tạo municipal government ở mọi Strategic Region chỉ vì map có region ID.
- Nhiều polity có hệ thống phân quyền, địa bàn bộ tộc, tributary/local rulers, village communities hoặc authority chồng lấn. Mô hình phải cho phép nhiều authority scopes thay vì bắt mọi địa bàn vào một cây hành chính cứng.

### 3.2. Authority and local administration

Schema khái niệm:

```ts
interface AuthorityNode {
  id: string;
  polityId: string;
  authorityTypeId: string;
  scopeRefs: string[];
  superiorAuthorityId: string | null;
  officeIds: string[];
  effectiveFromTick: number;
  effectiveToTick: number | null;
  autonomy: number;
  capacity: number;
  legitimacy: number;
  sourceQuality: string;
}
```

AuthorityType static definitions phải mô tả:
- central court/government;
- provincial/district administration;
- municipal/city council;
- customary/local authority;
- tribal/confederate council;
- religious authority;
- chartered company/concession administration;
- colonial administration;
- military occupation administration;
- autonomous/tributary administration;
- other source-backed local arrangements.

Các ví dụ trên là loại authority có thể mô hình hóa, không phải taxonomy cuối cho mọi vùng. Có thể nhiều authority cùng có jurisdiction trong một địa bàn, nhưng mỗi action phải kiểm tra mandate, competing claims và rule priority.

### 3.3. Government capacity vs territorial control

Tách tối thiểu:

- `de_jure_scope`: nơi authority tuyên bố có quyền;
- `de_facto_scope`: nơi authority có khả năng thực thi;
- `delegated_scope`: quyền được giao cho local intermediary;
- `contested_scope`: authority đang bị tranh chấp/chồng lấn;
- `administrative_reach`: khả năng thu thuế/census/law enforcement/service delivery theo vùng.

Một vùng do state sở hữu trên bản đồ không tự động tạo ra đủ quan chức, roads, courts, tax collection hoặc public service. Occupation/control cũng không tự động tạo legitimacy.

### 3.4. Administrative capacity and cost

Capacity không nên là một chỉ số duy nhất quyết định tất cả. Đề xuất phân thành:

- personnel/qualified administrators;
- communications/transport access (S8);
- fiscal extraction capacity;
- record-keeping/literacy;
- institutional organization;
- local cooperation/elite mediation;
- coercive enforcement;
- legitimacy/acceptance;
- corruption/leakage;
- geographic distance and terrain.

Chi phí hành chính gắn với:
- number/complexity of offices;
- payroll/stipends or customary obligations;
- travel/communication;
- local intermediaries;
- enforcement and court costs;
- upkeep of records/buildings.

S15 không mặc định quan chức được trả lương kiểu viên chức hiện đại. Các hệ thống thuế thân, cống nạp, lao dịch, đất phong, quyền thu tô, office-holding revenue và customary service phải được phân biệt theo historical law/profile.

### 3.5. Public service systems

Mỗi service definition có:

| Thuộc tính | Mô tả |
|---|---|
| `serviceId` | education, health, sanitation, water, administration, justice, policing/security, poor relief… |
| `deliveryModels` | central, local, religious, private, customary, mixed |
| `eligibilityRules` | nhóm được tiếp cận theo law/status/geography |
| `staffTemplates` | workforce skill requirement, không phải hiring trước S12 |
| `facilityTypes` | facility definitions liên kết S10/S11/S15 |
| `goodsInputs` | supply theo S7, transport theo S8 |
| `coverageMetric` | population reachable, service capacity, quality |
| `qualityMethod` | source-backed/estimated/unknown |
| `validity` | temporal validity và scope |

Service output cần ít nhất ba đại lượng riêng:
- **capacity** — lượng phục vụ tối đa;
- **coverage/access** — dân số có thể tiếp cận;
- **quality/outcome** — hiệu quả hoặc kết quả ước lượng.

Không gộp 3 thứ thành một "health = 0.6". Một vùng có bệnh viện nhưng không có đường đến; một vùng có trường nhưng phụ nữ/nhóm xã hội nhất định bị loại trừ; hai trường hợp phải được thể hiện khác nhau.

### 3.6. Education, health and security

- Education service có school availability, curriculum/teaching model, literacy reach, language, eligibility, religious/mission/public/private provider.
- Health service có practitioners/facilities, access, epidemic response, sanitation/water, nutrition và treatment capabilities đúng thời kỳ.
- Security/justice phân biệt military, police, gendarmerie, customary enforcement, court, local protection và coercion.
- Không suy ra health/literacy thực chỉ từ national spending; phải có service delivery/capacity và cohort/region data.
- Service staff counts không trở thành employment records trước S12. Trước đó dùng capacity estimates có label.

### 3.7. Urban development and housing

Urbanization là quá trình, không phải một biến tăng tự động theo GDP:

- settlement population (từ cohorts);
- housing stock/capacity, overcrowding và rent burden;
- water/sanitation/food/energy access;
- employment and livelihood access (S12);
- transport connectivity (S8);
- public services (S15);
- fire, epidemic and urban hazard;
- migration and natural population change (S6);
- land/tenure/zoning/municipal authority.

Không cho phép:
- city population tăng mà không chuyển cohort từ nơi khác hoặc natural growth;
- settlement vượt housing/food/water capacity mà không tạo hậu quả;
- urban level tự tăng chỉ vì factories count;
- population biến mất khi settlement level bị xóa/gộp.

Population remains one source of truth in S6; settlement/region urban aggregates are projections. Housing/service capacity does not own a separate population counter.

---

## 4. S16 — Character Simulation Foundation

### 4.1. Character scope

Character là cá nhân có vai trò ảnh hưởng đáng kể tới quyết định/thiết chế: rulers, heirs, ministers, administrators, military commanders, diplomats, religious leaders, reformers, movement organizers, notable owners/intellectuals.

Không tạo một entity cho mỗi người trong population cohort. Không biến mỗi POP thành agent riêng. Character model phải có quy mô hạn chế, có retention/retirement rules và performance budget.

### 4.2. Historical vs generated characters

Bắt buộc phân biệt:

- `historical_verified`: identity/office dates có nguồn trực tiếp và xác định;
- `historical_supported`: nguồn học thuật/tổ chức hỗ trợ nhưng còn giới hạn;
- `historical_uncertain`: danh tính/niên đại/genealogy tranh chấp;
- `generated_simulated`: nhân vật được engine tạo ra, không được trình bày như nhân vật thật;
- `placeholder_unknown`: một chức vụ có người giữ nhưng danh tính chưa biết; không nhất thiết tạo một cá nhân hư cấu.

Mỗi Character phải lưu:
- stable ID;
- name variants/script/transliteration;
- name components và title;
- birth/death/active dates ở mức độ chứng cứ;
- gender/kinship chỉ khi có nguồn hoặc rule mô phỏng hợp lý;
- culture/language/religion khi evidence cho phép;
- traits/skills/education/experience với provenance;
- offices/appointments và effective time;
- dynasty/house/kinship relations khi có nguồn;
- source quality, source refs, confidence và disputed alternatives;
- generated flag/status rõ ràng.

Không suy luận tính cách/traits của nhân vật lịch sử từ tên, sắc tộc hoặc tôn giáo. Không suy luận sensitive attributes ngoài nguồn và nhu cầu mô phỏng hợp pháp.

### 4.3. Character lifecycle and appointments

Phân biệt:
- Character existence/lifespan;
- office definition;
- appointment/tenure;
- succession rule;
- vacancy/interregnum;
- acting/regency/delegation;
- deposition/abdication/exile;
- death/disappearance/unknown end.

Một character có thể giữ nhiều office; office có thể có nhiều người đồng giữ hoặc hội đồng; một office có thể bỏ trống. Không giả định mọi polity có một Head of State theo cùng một mô hình.

Schema khái niệm:

```ts
interface Appointment {
  id: string;
  characterId: string | null;
  officeId: string;
  authorityId: string;
  startedAtTick: number;
  endedAtTick: number | null;
  appointmentType: string;
  sourceQuality: string;
}
```

### 4.4. Succession models

SuccessionRule static definitions có thể gồm:
- hereditary primogeniture variants;
- agnatic/cognatic/other dynastic selection;
- elective monarchy;
- council selection/consensus;
- seniority rotation;
- appointment/merit;
- military selection;
- religious office succession;
- colonial appointment by external authority;
- regency/interregnum;
- collective/rangatira/shared authority;
- other source-backed rules.

Không ép một luật kế vị duy nhất lên mọi polity. Có polity không có một monarch/head-of-state đơn nhất; có polity có đồng trị, hội đồng, office luân phiên hoặc authority phân tán. Khi nguồn chỉ chứng minh office/authority nhưng không cho biết người cụ thể, dùng unknown/vacant status chứ không sinh tên giả.

### 4.5. Character decision effects

Traits/skills chỉ tác động thông qua office/authority:
- administrative competence affects execution capacity, not auto-law change;
- diplomatic skill affects negotiation options/credibility, not automatic acceptance;
- military command skill affects operational outcomes only after S20/S21;
- political influence depends on institution and supporters;
- succession eligibility depends on relevant rule and evidence.

Generated characters phải được engine seed deterministic; cùng seed/command stream tạo cùng IDs, date of birth bounds và traits. Tất cả generated characters phải được UI/log phân biệt rõ.

### 4.6. Character memory and relationships

Chỉ lưu relationships quan trọng cho gameplay: kinship, patronage, rivalry, mentorship, faction affiliation, marriage alliance, command/delegation. Không mô phỏng social graph toàn dân. Mọi relationship cần start/end tick, source/method, confidence và bounded count.

Retired/dead characters có thể được giữ làm history references; không xóa identity nếu office log, treaty, battle hoặc historical event đang tham chiếu.

---

## 5. S17 — Politics and Institutions

### 5.1. InstitutionProfile instead of universal regime shortcuts

Mỗi polity có một InstitutionProfile temporal:

- source-backed authority structure;
- executive/decision bodies;
- consultative/representative bodies (nếu có);
- law-making/customary decision process;
- local/central powers;
- succession/appointment rules;
- fiscal/administrative institutions;
- rights and status categories;
- coercive and military authority;
- religious/court/customary law relationships;
- membership/eligibility rules;
- veto, consent, quorum, ratification and dispute resolution;
- temporal validity and source quality.

Không mô tả mọi nhà nước bằng một chuỗi nhãn `monarchy/republic/autocracy`. Governance label hiện tại có thể là summary/legacy projection, không được tiếp tục là single source of truth.

### 5.2. Decision authority and checks

Political action có thể yêu cầu:
- proposer/initiator;
- authorized office/body;
- jurisdiction/scope;
- eligible participants;
- support/consent thresholds;
- veto/blocking authority;
- implementation capacity;
- effective date and public record.

Một law proposal có thể:
- be enacted by ruler/decree;
- require council/estate/assembly consent;
- need religious authority approval;
- depend on local ruler consultation;
- be imposed by conqueror/colonial authority;
- fail due to administrative inability despite formal enactment.

Không áp một parliamentary vote model cho polity không có parliament.

### 5.3. Political constituencies and interest organizations

IG/organization cần có:
- organization type and institution validity;
- support base as weighted cohort/region/occupation/ownership/religion/language/office references;
- leadership/representation;
- goals, demands and issue positions;
- resources, organization and mobilization capacity;
- legitimacy and relationship with authority;
- internal factions and cohesion;
- source/provenance for historically defined organizations.

Eight current IGS may remain legacy categories for analysis/UI during migration, but they should not be mandatory or mutually exclusive for every polity. A cohort may support different organizations on different issues; no cohort should be counted as a full person multiple times when computing aggregate support. Use weights and normalization.

Organization types may include:
- landed/estate elites;
- merchants/guilds;
- religious institutions;
- military corps;
- court factions;
- professional administrators;
- urban artisans/workers;
- rural communities/peasantry;
- anti-colonial or national movements;
- dynastic/tribal/clan networks;
- reformist societies;
- political parties/associations where historically valid.

These are candidate classes, not universal organizations. Absence of formal political organization must not mean absence of political agency.

### 5.4. Movements and agitation

Movement is a time-bounded coordinated political/social campaign, not a permanent IG.

State:
- core demand(s);
- constituency support and geographic distribution;
- initiator/leader/organization;
- grievances and trigger conditions;
- organization/mobilization capacity;
- repression/coercion and negotiation channels;
- momentum/participation trend;
- escalation state (petition, assembly, protest, strike, rebellion, secession, revolution);
- legitimacy/public sympathy;
- deadlines/settlement/fragmentation/outcome;
- source-backed historical context or generated status.

Movement can be:
- labor/economic;
- land/tenure;
- constitutional/reform;
- religious;
- anti-colonial/independence;
- national/ethnic/cultural;
- dynastic/court faction;
- regional autonomy;
- tax/conscription resistance;
- abolition/emancipation;
- other locally grounded movement.

Do not reduce every resistance to modern nationalism or every labor dispute to a union strike. A movement must arise from condition + organization + opportunity; an event can be exogenous trigger but not the whole political system.

### 5.5. Law lifecycle

Tách:
1. proposal/initiative;
2. debate/consultation;
3. approval/consent;
4. promulgation;
5. implementation/administrative reach;
6. compliance/resistance;
7. amendment/repeal/suspension.

Law status không đồng nhất với actual enforcement. Một decree có hiệu lực de jure nhưng có thể không có khả năng thi hành tại vùng xa; một customary norm có thể được tuân thủ mà không tồn tại thành văn bản.

LawDefinition cần:
- group/category;
- compatible InstitutionProfiles;
- eligibility/rights effects;
- economic/social/military effects;
- office/body with authority;
- valid dates, source refs and confidence;
- local variations/exceptions;
- conflict/override rules.

Không chỉ thêm danh sách enum law values vào source; static data phải mô tả meaning/validity/effects và UI giải thích.

### 5.6. Legitimacy and political stability

Không dùng một số legitimacy duy nhất làm đại diện toàn bộ chính danh. Có thể tổng hợp từ:
- dynastic/customary/religious/legal legitimacy;
- performance/service delivery;
- elite/council consent;
- public support;
- local autonomy and compliance;
- military loyalty;
- recognition by external polities;
- coercion and repression.

Cần giữ các thành phần và chỉ dùng summary cho UI/AI. Các nguồn legitimacy có trọng số khác nhau theo institution profile; không dùng cùng công thức cho empire, council confederation, republic, theocracy và colonial regime.

### 5.7. Protest, strike, rebellion, revolution and secession

Các trạng thái phải tách:
- grievance and petition;
- nonviolent protest/assembly;
- strike/boycott/refusal;
- armed uprising;
- civil war;
- revolution/coup;
- secession/independence movement;
- foreign-backed intervention.

Escalation phụ thuộc:
- demands/goals;
- authority response;
- coercion/rights;
- organization and leadership;
- available resources;
- external support;
- administrative/security capacity;
- public/cohort support;
- local geography/transport;
- historical context.

Một movement có thể được giải quyết bằng concession/reform/autonomy/representation, không phải mọi lần đều trở thành civil war. Không tạo secession state nếu chưa có territory/authority/organization criteria; không giả lập toàn bộ population đồng lòng.

---

## 6. Quan hệ nhân quả liên hệ các giai đoạn

| Nguồn | Tác động | Giới hạn |
|---|---|---|
| S6 POP cohorts | support, grievance, eligibility, literacy, wealth/occupation/culture/religion | Không gán cohort cố định vào một IG duy nhất |
| S7 goods/markets | shortage, prices, tax base, livelihood shocks | Không tự quy shortage thành cách mạng |
| S8 transport/access | state reach, protest coordination, service access | Không bỏ qua địa lý |
| S10/S11 production/sites | industrial/agrarian structure, employer/sector interests | Chưa có real jobs trước S12 |
| S12 employment | wage disputes, unemployment, workplace organization | Chỉ sau khi hiring/wage thật hoạt động |
| S13 ownership | investor/landlord/merchant/capital interests | Không gán capitalist ownership cho mọi nền kinh tế |
| S14 construction | urban/public works and infrastructure projects | Không xây dựng tức thì trước S14 |
| S15 local government | service delivery, authority reach, local elite mediation | Không đồng nhất owner/controller với administrative capacity |
| S16 characters | office-holding, leadership, appointments, succession | Historical vs generated must remain explicit |
| S17 institutions | decision rules, rights, representation, reform and movement resolution | No universal parliament model |
| S18 diplomacy | foreign recognition, guarantee, support, pressure | External influence not deterministic outcome |
| S19 strategic AI | explainable political/economic/foreign policy priorities | AI must obey institution/authority constraints |

---

## 7. Save, determinism and migration

S15–S17 depend on S1 foundations and cannot be added to version-1 save before a reviewed migration plan.

Requirements:
- static InstitutionProfile, AuthorityType, ServiceDefinition, OfficeDefinition, CharacterSeed, MovementType and LawDefinition separated from mutable campaign state;
- `dataBuildHash` records all static sources and methods;
- `saveSchemaVersion` and `engineVersion` are independent;
- no Character/Authority/Institution ID derived from UI order or array index;
- all generated IDs use deterministic allocator stored in GameState and restore on load;
- appointment, movement, office and authority effective dates use simulation tick, not Date.now;
- all collections update in canonical ID order;
- missing historical data becomes unknown/estimated with provenance; migration does not invent character names, councils, elections, local offices or public-service facilities;
- old eight IGS values and nine law group values preserved as legacy projection until adapter migration is tested;
- unknown institution/office types are retained or safely rejected per S1 policy, not silently deleted;
- save/load exact continuation includes RNG, office holders, movement state, pending proposals and political records.

---

## 8. Performance, state size and UI consequences

Do not create object per citizen, voter, protester or resident. Use:
- aggregated weighted cohorts;
- bounded notable character registry;
- sparse organizations and time-bounded movements;
- authority graph with only meaningful nodes;
- event/history log with retention and compaction policies;
- projections for country/region/settlement views.

Benchmark:
- number of active authority nodes/offices/characters/organizations/movements across all 181+ entities and 662 regions;
- monthly political update p50/p95/p99;
- movement evaluation and support aggregation cost;
- memory/save growth over 1836–1936;
- relationship/appointment history growth;
- map/list UI rendering, portrait asset decode and localization;
- Android 12GB RAM device and lower-memory test profile; actual device measurements cannot be claimed from Node/desktop.

UI is part of each phase, not deferred entirely to S23:
- S15: local authority/service coverage/housing/urbanization view;
- S16: character/office/succession screen;
- S17: institutions, organizations, movements and reform process.
Every generated/estimated/unknown status is visible to player. UI must not imply unsupported precision.

---

## 9. Test contract and acceptance criteria

### S15
1. Authority scope can be overlapping/contested/delegated without duplicate population.
2. De jure, de facto and administrative reach remain distinct.
3. Service capacity, coverage and quality are separately computed.
4. Public service access never exceeds reachable capacity.
5. Urban population is conserved across settlement changes; natural growth/migration flows are explicit.
6. Housing/food/water/service constraints can affect urban outcomes without silently deleting population.
7. Local authority variation and historical validity tested across all world regions and multiple polity types.
8. Administrative/service budget costs are traceable and do not create money/goods.

### S16
1. Historical and generated Character statuses never conflate.
2. Unknown office holder stays unknown/vacant; no fabricated historical identity.
3. Character IDs stable across save/load and event references.
4. Lifespan/appointment dates respect temporal validity.
5. Succession models support non-monarchical/collective authorities.
6. Office vacancy, regency, dual office and concurrent appointments behave deterministically.
7. Generated characters are seed-deterministic and explicitly labelled.
8. Historical source quality and disputed alternatives are retained.

### S17
1. Institution profile defines authority to enact each law.
2. A law can be enacted de jure but have incomplete implementation.
3. Non-parliamentary polities are not forced through an election/vote workflow.
4. Organizations are non-universal and can be issue-specific.
5. Cohort support is weighted and does not double count population.
6. Movements have state transitions, demands, leader/organization, geography and resolution paths.
7. Protest/strike/rebellion/civil war/secession remain distinct.
8. Reforms can pass, fail, stall, be vetoed, be negotiated or be implemented only partially.
9. Political outcomes arise from conditions and agency; Historical Mode does not hard-code future regime changes.
10. Sandbox uses same initial state and rules, without scripted post-start path.
11. Exact deterministic save/load continuation with pending reforms and movements.
12. Tests include decentralized, colonial, tributary, imperial, council-based, religious, agrarian, industrial and republican systems.

---

## 10. Implementation slices after authorization

Planning only; not permission:

1. **S1:** schema/static data/migration foundations.
2. **S15-A:** authority graph + administrative scope, no public services yet.
3. **S15-B:** service definitions, local capacity/access and funding.
4. **S15-C:** settlement housing/urban development links to S6/S8/S10/S11.
5. **S16-A:** character registry, historical/source fields, generated-character identity.
6. **S16-B:** offices/appointments/succession state machines.
7. **S17-A:** InstitutionProfile and decision authority.
8. **S17-B:** organization/faction model and cohort support projections.
9. **S17-C:** movements, protests, strikes, negotiation and resolution.
10. **S17-D:** law proposal/enactment/implementation lifecycle.
11. **S18:** diplomatic negotiation/crises/subjects/international order.
12. **S19:** strategic AI using explainable decisions with domestic/diplomatic/economic goals.

Each slice needs its own base SHA, scope authorization, data source, acceptance tests, performance budgets and independent review. Do not implement S15–S19 in one large patch.

---

## 11. Open design decisions

1. **Authority taxonomy:** which authority types are common enough for shared mechanics, and which should be polity-specific data adapters?
2. **Local administration baseline:** how to represent customary/intermediary governance without falsely translating it into modern ministries?
3. **Service financing:** distinguish public tax revenue, religious endowment, local dues, private fees, communal labour and in-kind obligations.
4. **Character retention:** define maximum active/archived character counts, and when generated characters retire.
5. **Historical uncertainty:** define how to represent alternative names/genealogies/office dates without picking one unsupported answer.
6. **IG adapter:** transition existing fixed 8 IGS into dynamic organizations while preserving save compatibility and UI.
7. **Law granularity:** define shared LawDefinition engine contract while keeping local/temporal variations in data.
8. **Movement thresholds:** no universal radicalism trigger; calibrate against evidence and multi-seed simulation.
9. **Collective and multi-head authority:** define how actions, treaties and succession are authorized when authority is shared.
10. **Political event sources:** differentiate dated exogenous facts from modeled movements and player/AI decisions.

Any normative roadmap change requires explicit owner decision trace.

---

## 12. Review boundary

Claude independent no-write review should check:
- baseline code characterization;
- global institutional coverage and non-European context;
- separation of authority/government/administration/legitimacy;
- S15 service/urbanization conservation;
- S16 historical/generated identity and collective succession;
- S17 law authority, organization support, movement and resolution;
- no forced parliamentary model;
- dependencies on POP/economy/transport/employment/ownership;
- save determinism, state growth and mobile performance.

A `REVIEW_PASS` applies only to this document. It does not satisfy S0-B7 review, owner acceptance or S1 entry. It does not open S15–S17 or authorize any code/data/save/test/UI/Android/APK change.

**Kết luận:** S15 mô hình hóa nhà nước hiện diện ở địa phương và dịch vụ mà dân cư thực sự tiếp cận; S16 biến nhân vật lịch sử/giả lập thành các thực thể có office và lifecycle; S17 mô hình hóa thể chế và quyền lực qua organizations, movements và luật có khả năng thực thi. Đây là nền để chính trị phát sinh từ xã hội và cơ quan, thay vì chỉ từ một chỉ số legitimacy và vài event cố định.
