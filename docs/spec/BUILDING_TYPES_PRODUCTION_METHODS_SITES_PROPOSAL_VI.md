# Đề xuất kiến trúc — BuildingType, ProductionMethod và BuildingSite (S10–S11)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày:** 18/11/2026  
**Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Roadmap:** S10–S11, theo `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` và các sửa đổi owner-approved v3.3  
**Tài liệu liên quan:**  
- `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`
- `docs/spec/GOODS_MARKETS_TRANSPORT_ARCHITECTURE_PROPOSAL_VI.md`
**Trạng thái:** `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`

> Đây là đề xuất thiết kế trước triển khai. S1 và các giai đoạn S10/S11 vẫn đóng. Không sửa code, save schema, historical data, tests, UI, assets, Android, workflows hoặc APK.

---

## 1. Mục tiêu

Thay mô hình hiện tại `Region.buildings: Record<Building, number>` và các công thức recipe hard-coded bằng ba lớp có trách nhiệm riêng:

1. **BuildingType** — định nghĩa một loại hoạt động/cơ sở kinh tế, điều kiện địa lý, tài nguyên, hạ tầng, luật và thời kỳ.
2. **ProductionMethod (PM)** — mô tả cách thức sản xuất, goods inputs/outputs, công nghệ, công suất, năng suất và workforce template.
3. **BuildingSite** — một cơ sở/địa điểm vận hành độc lập với số cấp xây dựng, PM hiện hành, tình trạng, hiệu quả và tham chiếu địa lý.

Phải hỗ trợ:
- ngành nông nghiệp, khai khoáng, lâm nghiệp, thủ công, chế biến, công nghiệp, dịch vụ thiết yếu và quân dụng trong bối cảnh 1836–1936 toàn cầu;
- sự khác nhau theo resource, terrain, climate, technology, law, trade access và thời kỳ;
- nâng cấp, hư hại, đóng cửa, đổi PM, chia/gộp site;
- production nối trực tiếp vào S7 material ledger và S8 transport;
- population composition ở S6, nhưng **không** giả tuyển dụng/tiền lương trước S12;
- dữ liệu site sparse, ID ổn định, save/load deterministic và hiệu năng 662 Strategic Regions trên Android.

Đây không phải checklist loại công trình của Victoria 3. Danh mục cần phản ánh kinh tế toàn cầu thế kỷ XIX–đầu XX, bao gồm các hình thái tiền công nghiệp và phi công nghiệp, không áp cùng một mô hình nhà máy châu Âu cho mọi polity.

---

## 2. Hiện trạng code được xác minh

### 2.1. Runtime representation

- `src/engine/types.ts`: `Building` là union của 10 ID; `Region.buildings` lưu số cấp theo Region, không có site identity, production method, location hoặc condition theo từng cơ sở.
- `src/engine/init.ts:66–90`: mỗi Region khởi tạo các building level về 0, sau đó ước lượng ban đầu bằng workforce share, resource tags và stage công nghiệp hóa. Đây là heuristic tạo gameplay baseline; không phải kiểm kê nhà máy/đồn điền lịch sử theo từng cơ sở.
- `src/engine/systems/economy.ts:12–23`: `RECIPES` là map cố định cho một số Building IDs, mỗi recipe một output và input coefficients cố định.
- `src/engine/systems/economy.ts:90–97`: workers được lấy tuần tự theo thứ tự recipe, tối đa theo `LEVEL_WORKERS`; không có job slots hoặc qualification matching.
- `src/engine/systems/economy.ts:253–275`: `build()` trừ pool và tăng level ngay lập tức; chưa có ConstructionProject/queue/commissioning.
- `src/engine/systems/economy.ts:278–307`: `buildingReturn()` và `privateInvestment()` sử dụng heuristic expected return để chọn xây, không phải firm profit/ownership ledger.
- `src/engine/types.ts`: `GameState` không có `buildingSites`, `productionMethods` hoặc construction projects có cấu trúc.

### 2.2. Initial building values không đồng nghĩa cơ sở lịch sử

`init.ts:75–90` phân bổ cấp xưởng, mỏ, plantation, logging và railway từ workforce/resources/stage heuristics. Không thể diễn giải một giá trị `Region.buildings.mine = 15` như 15 mỏ có tên/vị trí/owner riêng. Nó chỉ là capacity aggregate do engine khởi tạo.

Do đó:
- không tạo facility objects với tên lịch sử giả;
- không tự tạo Settlement hoặc tọa độ site từ Region centroid rồi ghi là cơ sở có thật;
- không tự tạo proprietor/firm/capitalist owner;
- không chuyển số level cũ thành employment records hoặc wage ledger.

---

## 3. Những bất biến BuildingSite đã được owner chốt

Các quy tắc sau là nguồn ràng buộc, không phải phần tùy chọn của đề xuất:

### 3.1. Khóa gộp và identity

- Một BuildingSite biểu diễn công suất/cấp của **một loại công trình tại một địa điểm/cơ sở vận hành**.
- Khóa tìm site có thể gộp: địa điểm/cơ sở + BuildingType + ProductionMethod + operational identity.
- Không tạo object riêng cho từng cấp.
- ID site là định danh mờ, được cấp khi tạo; không suy ra từ array index, tên loại, PM hoặc khóa gộp.
- Aggregates Region/Settlement là projection/cache có thể tái tạo từ site, không phải mutable source thứ hai mâu thuẫn.

### 3.2. Trạng thái cấp loại trừ lẫn nhau

Các nhóm trạng thái của cấp đã xây:

| Field | Lưu hay suy ra | Quy tắc |
|---|---|---|
| `levels_built` | lưu | tổng số cấp hoàn tất |
| `levels_damaged` | lưu | `0 ≤ damaged ≤ built` |
| `levels_closed` | lưu | `0 ≤ closed ≤ built − damaged` |
| `levels_input_short` | suy ra | đang vận hành nhưng thiếu input |
| `levels_understaffed` | suy ra | đủ input nhưng thiếu lao động |
| `levels_active` | suy ra | vận hành đủ theo điều kiện hiện tại |

Bất biến:

`levels_built = levels_active + levels_understaffed + levels_input_short + levels_damaged + levels_closed`

- Mọi giá trị là số nguyên không âm.
- Ưu tiên phân loại: damaged → closed → input_short → understaffed → active.
- Sản lượng dùng hệ số liên tục theo mức input/workforce fulfillment; bucket status phục vụ UI/analytics và phải tái tạo được.
- `levels_under_construction` không phải phần của `levels_built`; nó được suy ra từ các ConstructionProject nhắm tới site và chỉ chuyển vào built khi project hoàn tất.

### 3.3. Đổi PM và chia/gộp site

- Đổi PM toàn site: giữ ID; PM mới chỉ có hiệu lực sau thời gian/chi phí chuyển đổi theo quy tắc đã định nghĩa; ghi history event.
- Đổi PM một phần level: tạo site mới với ID mới và lineage `parent + pm_split + tick`; site cũ giữ phần level còn lại.
- Gộp site trùng khóa: giữ ID cũ hơn; site còn lại thành tombstone `merged_into`; chuyển tham chiếu qua redirect table.
- Không re-key phá hủy ID site còn tồn tại.
- Tombstone/redirect cần tồn tại qua save migration khi còn bất kỳ reference nào cần resolve.

---

## 4. S10 — BuildingType và Site Potential

### 4.1. BuildingTypeDefinition

Schema khái niệm:

```ts
interface BuildingTypeDefinition {
  id: string;
  family: string;
  sector: string;
  validFrom: string | null;
  validTo: string | null;
  permittedMethodIds: string[];
  resourceRequirements: ResourceRequirement[];
  siteRequirements: SiteRequirement[];
  workforceTemplateIds: string[];
  infrastructureProfileId: string | null;
  constructionProfileId: string | null;
  sourceRefs: string[];
}
```

Các group trên chỉ là cấu trúc tĩnh; runtime không lưu nguyên definition vào mỗi site.

BuildingType phải mô tả **hoạt động kinh tế**, không phải mọi variation kỹ thuật. Ví dụ:
- agriculture/farms;
- plantation/specialized export agriculture;
- livestock/pastoral;
- fishing;
- forestry;
- mine/quarry;
- extraction wells;
- artisan workshops/cottage industry;
- textile/fabric/clothing;
- metalworking/iron/steel;
- tools/machinery;
- shipbuilding;
- paper/printing;
- chemicals/fertilizer;
- food processing;
- arms/artillery/munitions;
- rail/port/utility infrastructure;
- education/administration/health services khi cần.

Đây là family candidate, chưa phải danh mục cuối. Mỗi loại cần có source-backed historical terminology, region/era appropriateness và lý do gameplay.

### 4.2. Site potential không đồng nghĩa level đã xây

Tách:
- **Potential:** điều kiện địa lý/tài nguyên/đất đai/khí hậu/hạ tầng cho hoạt động.
- **Built capacity:** cấp site đã hoàn thành.
- **Operational capacity:** cấp có thể vận hành sau damage/closure/input/labor/access constraints.
- **Actual output:** quantity thực tế sau S7 allocation và S8 delivery/access.

Potential là derived assessment từ static Region/Settlement/resource data; không tự tăng supply. Một region có coal deposit chưa có nghĩa tồn tại mỏ với công suất; có thể chưa có vốn, công nghệ, quyền khai thác hoặc hạ tầng.

Các điều kiện có thể gồm:
- resource presence/reserve grade/quality và extraction limit;
- đất canh tác, rainfall, seasonality, soil, slope, elevation, water;
- coastal/river/port/settlement access;
- population/skills (chỉ suitability, không tự tuyển người);
- laws/rights/land tenure/forced-labor regime;
- technology, machinery, energy availability;
- strategic/security/war/foreign concession status;
- environmental constraints và depletion.

Mọi suitability score phải có explainable components, quality label và uncertainty. Tránh một hệ số “industrialization” toàn quốc thay thế dữ liệu địa phương.

### 4.3. Historical validity

- Definition và PM có `valid_from/valid_to` hoặc unlock conditions được nguồn hóa.
- Không mở steam-powered method sớm ở nơi chưa có kỹ thuật/thiết bị/nhân lực/hạ tầng.
- Một phát minh xuất hiện trong một nước không tự động có nghĩa mọi nước lập tức sử dụng được.
- Diffusion/adoption phụ thuộc S9 (technology), trade/access S8, institutions/laws, investment và capacity.
- Historical Mode dùng validity/source data, nhưng không ép output/level/owner vào đúng lịch sử; player/AI decisions và simulation có thể tạo alternate outcomes.
- Sandbox dùng cùng 1836 seed và cùng production pipeline; được phép lựa chọn khác sau start date.

---

## 5. S10 — ProductionMethod

### 5.1. ProductionMethodDefinition

Schema khái niệm:

```ts
interface ProductionMethodDefinition {
  id: string;
  buildingTypeId: string;
  groupId: string;
  validFrom: string | null;
  validTo: string | null;
  unlockConditions: Condition[];
  inputs: GoodRate[];
  outputs: GoodRate[];
  workforceTemplateId: string | null;
  infrastructureProfileId: string | null;
  throughputPerLevel: number;
  efficiencyModifiers: ModifierDefinition[];
  resourceUse: ResourceUse[];
  sourceRefs: string[];
}
```

Quy tắc:
- Rates chuẩn hóa theo canonical good units **mỗi cấp mỗi tháng** theo S7.
- Nếu nguồn kỹ thuật là output annual, normalize tại ETL/static data build đúng một lần và giữ original value, unit, citation/method.
- Mỗi method khai báo nhiều input và có thể nhiều output/by-products.
- Input và output tách rõ; không dùng output value làm proxy cho vật chất.
- Method phải có điều kiện era, tech, laws, resources, climate/terrain và infrastructure.
- Có thể có labor-intensive, animal-powered, water-powered, steam-powered, electrified hoặc hybrid method tùy thời kỳ/khu vực, nhưng mỗi method chỉ được thêm khi có evidence và balance design.
- Không gán PM theo châu lục; cùng một quốc gia có thể có nhiều phương thức theo vùng/ngành.
- PM không trực tiếp lưu employment assignments; workforce template chỉ nêu nhu cầu/kỹ năng tham chiếu cho S12.

### 5.2. WorkforceTemplate — không phải hiring

Một template có thể mô tả:
- occupation groups/skill bands;
- workers per level hoặc labor-hours per output;
- qualification thresholds;
- share estimate / uncertainty;
- roles theo giới/độ tuổi hoặc coercive status chỉ khi có dữ liệu và policy an toàn phù hợp.

S10/S11 chỉ đọc aggregate labor availability/placeholder có nhãn từ Region hoặc cohort projection. Đây **không** phải job contract, không giảm size cohort hoặc tạo wages. Real hiring, firing, vacancies, unemployment và wage clearing thuộc S12.

Không dùng `Region.strata` như employment ledger. Một stratum và một occupation không đồng nhất; một cohort có thể chứa nhiều nghề, và cùng nghề có nhiều strata/ownership statuses.

### 5.3. Multi-input, multi-output và accounting

ProductionMethod phải tương thích S7:
- request input quantities;
- S7 allocator quyết định input thực được cấp;
- actual output được tính từ min ratio/input constraints và throughput;
- by-products/scrap/loss được ghi nhận riêng;
- output chỉ commit khi production settlement thành công;
- không thêm input vào demand rồi đồng thời ghi full output nếu thiếu input;
- goods flow và money/cost ledger tách biệt.

Recipe dependency graph phải được kiểm tra cycle. DAG production tiers là mặc định; cycle chỉ được phép khi solver bounded, deterministic và có residual accounting theo S7.

---

## 6. S11 — BuildingSite sparse operations

### 6.1. Runtime state khái niệm

```ts
interface BuildingSite {
  id: string;                    // opaque monotonic ID, assigned on creation
  locationRef: string;           // Settlement/site/region aggregate ref
  locationKind: string;
  buildingTypeId: string;
  productionMethodId: string;
  operationalIdentity: string;
  levelsBuilt: number;
  levelsDamaged: number;
  levelsClosed: number;
  condition: number;
  operationalSince: number | null;
  lineage?: { parentId: string; event: string; tick: number };
  mergedInto?: string | null;    // tombstone/redirect
}
```

Đây là bản khung; field cuối cùng phải theo S1 data contract. Không serialize static definition lặp lại trong mỗi site. Không nhúng source URLs lớn trong mutable site state; provenance liên kết qua definition/template/dataBuildHash.

Site identity không chứa:
- từng người lao động;
- object cho từng cấp xây;
- một row riêng cho mỗi hàng hóa tồn kho;
- shareholder objects trước S13;
- construction projects trước S14;
- wage/payment assignments trước S12.

### 6.2. LocationRef và dữ liệu thiếu

Ưu tiên tham chiếu theo thứ tự:
1. Settlement hoặc facility ID lịch sử có tọa độ/provenance;
2. địa điểm vận hành đã có trong dữ liệu;
3. Region aggregate placeholder chỉ khi dữ liệu hiện tại chỉ cho biết tổng cấp theo Region.

Không được đặt tên riêng/tọa độ giả cho Region aggregate placeholder rồi hiển thị như một nhà máy có thật.

Một loại site tạm có thể dùng `locationKind = region_aggregate_legacy`, gắn provenance `legacy_region_aggregate`, để giữ capacity của bản lưu cũ. UI phải hiển thị đó là tổng hợp chưa xác định cơ sở. Khi có dữ liệu/facility mới, chuyển đổi qua migration/split được kiểm chứng, không tự nhân bản site.

### 6.3. Status derivation và production

Mỗi tháng:
1. Validate built/damaged/closed invariants.
2. Tính số level bị damaged/closed.
3. Dựa trên PM, S7 availability và S11 operational constraints, xác định input-short.
4. Khi S12 chưa mở, workforce fulfillment chỉ là placeholder/aggregate estimate có quality label; không tạo worker assignment.
5. Số level còn lại phân thành active/understaffed theo threshold được phê duyệt.
6. S7 nhận production intents từ active/partially-operating levels.
7. Commit actual production sau khi S7 cấp input và settlement.
8. Persist only mutable site state; derived level buckets/caches có thể rebuild deterministically.

Sản lượng liên tục có thể là:

`actualOutput = throughputPerLevel × effectiveLevels × productivityFactor × inputFulfillment × infrastructureFactor × conditionFactor`

Trong đó:
- từng factor có contract/unit/bounds cụ thể;
- `effectiveLevels` không thay thế state bucket;
- không nhân cùng một penalty hai lần;
- inputFulfillment được S7 trả về từ actual allocation;
- transport/access factor chỉ đến từ S8 khi giai đoạn đó được triển khai;
- labor factor trước S12 phải mang nhãn estimate, không mang tên employment.

### 6.4. Site merge/split/change PM

- Stable site IDs được cấp khi create; không derive từ location/type/PM.
- Whole-site PM change preserves ID; record transition event and effective tick.
- Partial PM conversion splits levels into a new ID with lineage; conservation `old levels = retained levels + moved levels`.
- Merge retains older ID, tombstones other ID and redirects references.
- PM/site keys are indexes for find-and-merge, not primary IDs.
- Merge chỉ khi hai site cùng identity/location/type/PM và có thể hợp nhất mà không làm mất khác biệt vận hành/provenance. Nếu không, giữ tách.
- Các thao tác phải deterministic, save/load exact và idempotent nếu command được replay.

### 6.5. Ownership, construction và hiring boundary

- **S13:** ownership/shareholder ledger, firm accounts, profit/dividends/state/foreign/cooperative ownership. S11 chỉ có reference slot để kết nối sau; không tự sáng tạo chủ sở hữu.
- **S14:** construction capacity, projects/queue, goods/money costs, build/upgrade/downgrade timelines. S11 không biến `build()` instant thành construction system hoàn chỉnh.
- **S12:** real jobs/hiring/firing, wage settlement, skill matching, labor competition and migration. S11 không tuyển người.
- Trước S12/S13/S14, các dữ liệu cần hiển thị phải có label `estimated`, `legacy_aggregate` hoặc `not_yet_modeled` phù hợp.

---

## 7. Chuyển đổi từ Region.buildings hiện tại

Không thực hiện migration trong tài liệu này. Đề xuất hướng chuyển đổi trong tương lai:

1. Lưu nguyên legacy `Region.buildings` trong version-1 baseline fixtures.
2. Tạo static BuildingType/PM registry có provenance trước.
3. Với những level hiện tại có dữ liệu chỉ ở cấp Region, tạo một legacy aggregate group theo Region + BuildingType + inferred/unknown PM; quality rõ ràng.
4. Không tự suy đoán số nhà máy/đồn điền/mỏ riêng, tên, tọa độ, proprietor, workers hay output history.
5. Khi PM không biết, dùng `legacy_unspecified` hoặc fallback có label; không gán một PM historical cụ thể để làm số liệu đẹp.
6. Giữ tổng levels theo Region/BuildingType bằng baseline trước/sau migration.
7. Migration phải idempotent và exact; nguồn save cũ không bị overwrite nếu validation lỗi.
8. Site mới được tạo sau này bởi ConstructionProject hoặc event/data có provenance; không làm mọi aggregate legacy site biến thành facility có thật.

### 7.1. Site count và memory

Benchmark actual site count từ baseline + seed + player construction + AI investment. Không suy ra site count chỉ từ số level hoặc dự đoán instance count.

Đo:
- số BuildingSite mutable;
- số BuildingType/PM static definitions;
- số site có actual output mỗi tick;
- size serialized bytes/site;
- init/load/migration time;
- tick cost p50/p95/p99;
- number of sites visible to map renderer;
- site split/merge churn qua nhiều thập kỷ.

Không tạo scene object cho mọi BuildingSite. UI/map dùng LOD, clustering, filters và virtualized lists.

---

## 8. Determinism, save và error handling

- Static definitions có version/hash; mutable site state có schema version.
- ID allocator phải được lưu/restore deterministic, không dựa vào wall-clock.
- Site order canonical theo stable ID khi tick.
- Split rounding remainder deterministic; level values là số nguyên.
- Unknown BuildingType/PM trong save phải được giữ, chuyển sang disabled/unknown representation hoặc reject an toàn theo policy S1; không tự xóa site.
- PM hết valid period sau một mốc lịch sử không có nghĩa tự động đổi PM; phải có transition/gameplay rule.
- Migration v1 không bịa site identity/owner/location. Legacy aggregate is explicit and reversible if possible.
- Save/load trong lúc đang PM transition, merge/tombstone hoặc project reference phải exact.
- Error khi site state vi phạm invariant phải fail closed và không ghi đè save nguồn.

---

## 9. Nghiệm thu và test contract

### S10 static data and potential

1. IDs unique, references resolve and schema is valid.
2. Era validity and unlock conditions prevent premature PM.
3. Resource/terrain/climate/site potential does not create built capacity.
4. Every quantity uses S7 unit and monthly rate contract.
5. Recipe inputs/outputs are valid; no cycles unless solver is declared.
6. Historical source coverage and uncertainty are explicit by world region and polity type.
7. PM/workforce templates are not employment records.
8. DataBuildHash changes when definitions/provenance change.

### S11 site state

1. Level state equation is true after every mutation/tick.
2. Each level belongs to exactly one status group.
3. Under-construction levels are derived from ConstructionProject and excluded from built.
4. IDs remain stable through whole-site PM changes.
5. Partial PM split preserves levels and records lineage.
6. Merge creates correct tombstone/redirect and preserves references.
7. Region aggregate projections equal sum of sites plus explicitly labelled legacy aggregate capacity.
8. Production output is committed only after S7 actual input settlement.
9. No employment/wage records appear before S12.
10. No shareholder/firm records are invented before S13.
11. No construction is instant if S14 is not yet implemented; legacy UI actions must be gated/labeled.
12. Save/load during split, merge, transition and invalid/unknown PM is deterministic and safe.

### Performance and historical coverage

- Multi-seed, multi-decade benchmark for all 662 Strategic Regions.
- Include decentralized, tributary, colonial, plantation, pastoral, agrarian, mining, early-industrial and industrial polities across all world regions.
- Count and benchmark real sites, not theoretical levels.
- Android baseline: peak memory, p95/p99 tick, save/load, map LOD and list rendering; Node/desktop timings are not device claims.
- Include large empire, sparse settlement, high migration, war damage, infrastructure loss, resource depletion, PM diffusion and many AI investment events.

---

## 10. Implementation sequence after authorization

This list is planning, not permission:

1. S1 — static/mutable data contracts, versioning, validation and save migration.
2. S6 — POP cohort state and social attributes.
3. S7 — Goods Registry, inventory, ledger and market clearing.
4. S8 — transport graph, shipments and market access.
5. S9 — technology and diffusion.
6. S10-A — BuildingType/ProductionMethod registry and source-backed data validation.
7. S10-B — SitePotential evaluation and explainable UI data.
8. S11-A — BuildingSite sparse state, stable IDs, migration placeholder and projections.
9. S11-B — status derivation, production intent and S7 settlement.
10. S12 — real hiring/wages/jobs/competition.
11. S13 — ownership/firms/profit/investment.
12. S14 — construction projects and time-based level changes, with interfaces coordinated so no stage relies on a future system prematurely.

Each slice needs a separate owner-authorized task, baseline SHA, test fixtures, performance budget and independent review. Do not merge S10–S14 into a single implementation.

---

## 11. Open design decisions

1. **Legacy PM mapping:** how much can be inferred from existing Region.buildings/resource/stage without false precision? Recommendation: unknown/fallback with explicit label.
2. **Site location granularity:** how much settlement/facility evidence is available at S11 entry? Region aggregate placeholders are permitted only as a transitional projection.
3. **Operational identity:** define what makes two production operations at the same location separate sites (different owners at S13, separate infrastructure, separate production lines, legal concessions).
4. **Workforce placeholder:** select a transparent aggregate availability estimate until S12, but do not let this estimate become persistent employment state.
5. **PM switching rules:** determine conversion cost/duration using Construction/technology rules without breaking ID stability.
6. **Resource depletion:** decide whether deposits are finite, renewable or unknown by commodity/region and require source/method.
7. **Site rendering:** map icon/cluster/LOD policy with actual mobile performance budgets.

Any normative change to the approved roadmap needs an owner decision trace. Do not change owner-approved rules in this proposal.

---

## 12. Review and gate boundary

Claude independent no-write review should focus on:
- compliance with the approved BuildingSite identity/status/merge/split rules;
- no invented historical facilities from Region aggregates;
- separation of BuildingType vs PM vs Site;
- production inputs/outputs and S7 accounting;
- S11 labor placeholder vs S12 employment;
- S13 ownership and S14 construction boundaries;
- deterministic IDs/migrations/save and Android performance.

A `REVIEW_PASS` for this document only reviews this design. It does not satisfy S0-B7 review, owner acceptance or phase authorization. It does not open S1, S10, S11, S12, S13 or S14 and does not authorize any runtime/data/save/test/UI/Android/APK change.

**Kết luận:** S10 định nghĩa công trình và phương thức sản xuất; S11 vận hành BuildingSite sparse có ID ổn định; S12 mới chịu trách nhiệm tuyển dụng/tiền lương; S13 mới mô hình hóa sở hữu; S14 mới quản lý xây dựng theo thời gian. Tách các ranh giới này là điều kiện để kinh tế có chiều sâu mà không giả dữ liệu lịch sử hay tạo nhiều nguồn truth mâu thuẫn.
