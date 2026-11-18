# Đề xuất kiến trúc — Hàng hóa, thị trường và vận tải (S7–S8)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày:** 18/11/2026  
**Code baseline được kiểm tra:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Tài liệu nền liên quan:** `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`  
**Roadmap chuẩn:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, áp dụng các sửa đổi owner-approved v3.3  
**Trạng thái:** `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`

> Đây là đề xuất kiến trúc, không phải implementation. S1 vẫn `NOT_STARTED`; S7 và S8 cũng chưa được mở. Không thay đổi engine, schema save, historical data, UI, tests, Android, workflows hoặc APK bằng tài liệu này.

---

## 1. Mục tiêu và nguyên tắc thiết kế

Hệ thống kinh tế phải chuyển từ các tổng số cung/cầu và công thức giá gần đúng sang một mô hình có thể kiểm toán:

- hàng hóa có định nghĩa, đơn vị và quy tắc chuyển đổi rõ ràng;
- tồn kho thực sự được mang từ tháng trước sang tháng sau;
- sản xuất chỉ tạo hàng hóa khi đầu vào thực sự được cấp phát;
- tiêu dùng, đầu vào sản xuất, nhập khẩu, xuất khẩu, hao hụt và tồn kho được hạch toán nhất quán;
- giá phản ánh độ khan hiếm trong thị trường mà người mua/người bán tiếp cận được;
- logistics có mạng lưới, capacity, thời gian vận chuyển và gián đoạn lịch sử;
- mỗi kết quả có thể truy ngược đến flow, market, good, producer/consumer aggregate và phương pháp;
- mô phỏng vẫn deterministic và đủ gọn cho 662 Strategic Regions trên Android.

Không xây một bản sao máy móc của một game khác. Phải đạt chiều sâu hệ thống tương đương bằng taxonomy, dữ liệu, code và assets độc lập, phù hợp thế giới 1836–1936.

### 1.1. Các bất biến không được phá

1. Không có hàng hóa tự sinh hoặc biến mất ngoài production, consumption, spoilage, destruction hoặc transfer đã ghi nhận.
2. Transfer nội bộ không làm thay đổi tổng số hàng hóa toàn hệ thống.
3. Sản lượng công trình không được ghi vào market supply trước khi input được cấp phát và sản xuất hoàn tất.
4. Không có tồn kho âm.
5. Không đồng nhất một market aggregate với khả năng tiếp cận vật lý của mọi vùng thuộc market đó; ranh giới này được giải quyết ở S8.
6. Không có hiring, firing hoặc wages thực ở S7/S8/S11 trước S12.
7. Historical và Sandbox bắt đầu từ cùng snapshot 1836, dùng cùng simulation pipeline; không khóa trước kết quả sau ngày bắt đầu.
8. Mọi đơn vị, hệ số, nguồn dữ liệu và fallback phải có version/provenance.

---

## 2. Kiểm tra hiện trạng tại code baseline

### 2.1. Dữ liệu và state hiện tại

- `src/engine/types.ts`: 12 loại `GOODS`; `GameState` có `worldPrices`, `marketPrices`, `marketStats`, nhưng chưa có market inventory hoặc goods flow ledger.
- `MarketGoodStats` chỉ lưu `supply`, `demand`, `imports`, `short`; đây là snapshot thống kê, không phải sổ cái vật chất.
- `src/engine/systems/economy.ts`: `marketOf()` nhóm theo customs union/quốc gia; `openness()` tạo hệ số mở cửa từ trade law, tech và coastline.
- `computeEconomy()` tổng hợp supply/demand theo region vào market group, tính chênh lệch cung/cầu, ước lượng nhập khẩu từ world surplus và điều chỉnh chỉ số giá.
- `src/engine/systems/population.ts`: household demand và demographic attributes hiện tính ở cấp Region; chưa có demand basket mutable theo từng cohort.
- `src/engine/save.ts`: save envelope hiện chỉ chấp nhận version 1; chưa có migration framework.

### 2.2. Sai lệch kế toán quan trọng trong pipeline hiện tại

Trong `src/engine/systems/economy.ts`:

- Khoảng dòng 90–113: sản lượng factory dự kiến được tính từ worker capacity; `factoryOut` được cộng đầy đủ vào `supply`, đồng thời `inputsNeed` được thêm vào demand.
- Khoảng dòng 128–164: market clearing dùng các giá trị supply/demand này để ghi `MarketGoodStats`.
- Khoảng dòng 173–182: chỉ khi tính GDP, output nhà máy mới bị scale theo shortage của input.

Hệ quả: market clearing có thể báo nguồn cung output cao hơn lượng hàng thực sự sản xuất sau khi thiếu nguyên liệu. GDP đã áp dụng một hạn chế mà market supply/stats chưa áp dụng. Đây là vấn đề kiến trúc kế toán, không thể giải quyết chỉ bằng đổi màu hoặc sửa số hiển thị.

### 2.3. Những giới hạn khác

- Không có tồn kho đầu kỳ/cuối kỳ, spoilage, inventory capacity hoặc stockpile.
- Không có shipment, bilateral trade flow hoặc xuất khẩu theo tuyến.
- World trade được ước lượng bằng surplus/deficit tổng hợp; không có buyer-seller matching hay transport cost.
- Giá là chỉ số số học theo good/market, chưa phải giá giao dịch có currency settlement.
- Market grouping chưa phải geography graph hoặc market hub.
- Railway, coastline và openness đang góp vào một access scalar tại khoảng dòng 185–188, không đại diện cho đường vận tải, công suất và bottleneck.
- `RECIPES` trong khoảng đầu file là fixed recipes theo Building enum, không phải ProductionMethod registry có era, province potential và input/output definitions.
- Labour supply là `region.pop * 0.45`; workers được phân phối theo thứ tự building recipe. Đây không phải hiring record hay wage settlement.
- `buildingReturn()` là heuristic đầu tư, không phải lợi nhuận kế toán của một firm.

Các giới hạn này được giữ làm baseline characterization; không sửa trong giai đoạn pre-design.

---

## 3. Định nghĩa miền và phân tách trách nhiệm

### 3.1. Goods Registry — static data

Mỗi `GoodDefinition` cần có tối thiểu:

| Thuộc tính | Ý nghĩa |
|---|---|
| `id` | ID ổn định, duy nhất |
| `family` | Food, raw_material, industrial_input, manufactured, military, service... |
| `canonical_unit` | Đơn vị mô phỏng chuẩn, không phụ thuộc đơn vị bản địa |
| `display_units` | Các đơn vị lịch sử/địa phương được phép hiển thị và hệ số chuyển đổi |
| `inventory_policy` | `storable`, `flow_only` hoặc `non_material_service`; quyết định có stock hay chỉ flow |
| `transportable` | Có thể vận chuyển vật lý hay không; phải tương thích với policy và mode |
| `mass_kg_per_unit` | Khối lượng vận tải trên mỗi đơn vị chuẩn; nullable với flow/service phi vật chất |
| `volume_m3_per_unit` | Thể tích vận tải trên mỗi đơn vị chuẩn; nullable khi không áp dụng |
| `perishability` | none, low, medium, high hoặc rate có nguồn; chỉ áp dụng với hàng phù hợp |
| `spoilage_method` | Phương pháp hao hụt khi tồn trữ/vận chuyển |
| `storage_constraints` | Điều kiện kho nếu mô hình hóa |
| `substitutes` | Hàng thay thế có điều kiện; không mặc định mọi hàng cùng family thay thế được |
| `valid_from / valid_to` | Niên đại hàng hóa/ứng dụng công nghiệp nếu có |
| `source_refs` | Provenance của taxonomy, unit và hệ số vật lý |

Không dùng cùng một con số cho grain, steel, tools và arms mà không xác định ý nghĩa đơn vị. Quy đổi sang tấn, bao, kiện hoặc đơn vị chuẩn khác phải thực hiện tại boundary nhập/xuất/hiển thị; không phụ thuộc locale.

Goods có ba inventory/transport policy khác nhau:
- `storable`: hàng vật chất có stock, spoilage/capacity và có thể tồn kho; mass/volume được khai báo để S8 tính logistics.
- `flow_only`: sản phẩm/đầu ra vật chất không được tích lũy trong inventory dài hạn; phải được tiêu thụ/settle trong kỳ hoặc có explicit buffer rule.
- `non_material_service`: dịch vụ phi vật chất, chỉ ghi nhận flow/value; không có mass, volume, physical inventory hoặc shipment. Phần `services` hiện tính riêng trong `economy.ts` là baseline phù hợp để giữ phân biệt này, không được tự biến thành goods stock.

Một good không được đổi policy chỉ vì UI muốn hiển thị nó trong cùng bảng với hàng hóa vật chất. Việc đổi policy cần data migration, conservation rules và test riêng.

### 3.2. Kiểm soát taxonomy hiện tại

12 ID hiện có là baseline legacy, không phải taxonomy hoàn chỉnh cho toàn giai đoạn:

`grain, cash_crops, cotton, timber, coal, iron, steel, textiles, tools, arms, luxury, opium`

Các vấn đề cần giải quyết trong data design:

- `cash_crops` gộp nhiều loại cây thương mại có chuỗi giá trị và nhu cầu khác nhau.
- `luxury` gộp hàng hóa khác bản chất (ví dụ kim loại quý và hàng xa xỉ chế tạo).
- `textiles` có thể che khuất sự khác biệt giữa raw fibre, yarn, fabric và clothing.
- `arms` quá rộng để đại diện riêng vũ khí bộ binh, artillery và ammunition.
- `grain` không nên tự động đồng nghĩa mọi lương thực; rice, maize, wheat và các cây lương thực khác có phạm vi địa lý, dinh dưỡng và phương thức sản xuất khác nhau.

Đề xuất phân lớp taxonomy:

1. `GoodFamily`: nhóm hiển thị/analytics; không được đem family đi giao dịch như một good.
2. `GoodDefinition`: đơn vị có thể sản xuất, tồn kho, vận chuyển và tiêu thụ.
3. `LegacyGoodMapping`: ánh xạ các ID cũ sang một hoặc nhiều good mới, kèm method, quality và uncertainty.
4. `RecipeInput / RecipeOutput`: tham chiếu GoodDefinition cụ thể.

Không chốt số lượng goods bằng số lượng của Victoria 3. Dữ liệu mới cần dựa trên relevance 1836–1936, chuỗi cung ứng xuyên lục địa, khả năng phân biệt trong gameplay và ngân sách performance.

### 3.3. Đơn vị mô phỏng, thời gian và tiền tệ

- Tất cả lượng hàng có một canonical unit cụ thể theo GoodDefinition.
- Mọi flow trong simulation được chuẩn hóa thành **lượng mỗi tháng**. Nếu nguồn/legacy recipe là annualized rate, chuyển đổi tại adapter bằng `annual_rate / 12` đúng một lần.
- Inventory là stock tại một thời điểm; production, consumption, imports, exports, spoilage là flow trong kỳ. Không cộng stock với annualized flow.
- Dùng số nguyên fixed-point theo precision được GoodDefinition công bố (ví dụ milli-unit) khi an toàn; không dùng `BigInt` trong JSON save. Phải chứng minh upper bounds nằm trong `Number.MAX_SAFE_INTEGER`. Nếu không đủ, thay đổi representation ở S1 với migration/test.
- Làm tròn phải xác định. Phần dư được phân bổ theo stable ID order; không phụ thuộc thứ tự object hoặc thời gian máy.
- Money ledger tách khỏi goods ledger. Giá danh nghĩa, currency, tax, tariff, wage, interest và GDP cần currency/unit contract riêng. Không coi price index 1.0 là một pound hoặc một đơn vị tiền nếu chưa có quy đổi.
- Nếu cần quy đổi giá lịch sử giữa local currency và internal currency, phải lưu exchange-rate method/date/provenance; không suy ra tỷ giá chỉ từ giá index.

---

## 4. S7 — Goods, inventories và accounting

### 4.1. State đề xuất

Tên dưới đây là schema khái niệm, chưa phải type/code được phê duyệt:

```ts
interface MarketInventory {
  marketId: string;
  goodId: string;
  quantity: number;       // canonical fixed-point stock
  updatedTick: number;
}

interface MarketGoodBalance {
  openingStock: number;
  domesticProduction: number;
  imports: number;
  exports: number;
  intermediateUse: number;
  householdUse: number;
  governmentUse: number;
  militaryUse: number;
  spoilage: number;
  destruction: number;
  closingStock: number;
}

interface MonthlyMarketFlow {
  tick: number;
  marketId: string;
  goodId: string;
  producerGroup?: string;
  consumerGroup?: string;
  flowType: string;
  quantity: number;
  methodId: string;
}
```

Yêu cầu:

- Sparse storage: chỉ lưu hàng hóa có inventory hoặc flow khác 0; không tạo object cho từng người hay từng đơn vị hàng.
- Inventory là mutable campaign state; Goods Registry, recipes và conversion tables là static data.
- MarketGoodBalance là aggregate kiểm toán theo tháng; không cần lưu mọi giao dịch cá thể.
- Ledger chi tiết chỉ dành cho transfer/contract/sự kiện quan trọng hoặc diagnostics; tránh hàng triệu event records làm phình save.
- Derived price/access/display caches phải có rebuild/invalidation rule và không mặc định serialize.

### 4.2. Bảo toàn vật chất

Với từng `marketId + goodId` trong kỳ:

`closing = opening + production + imports - exports - intermediateUse - householdUse - governmentUse - militaryUse - spoilage - destruction`

Đối với toàn bộ các market:

- Transfer nội bộ A → B phải ghi `exports_A = imports_B` cùng một quantity và cùng shipment/transfer identity.
- Internal transfer triệt tiêu khi cộng tất cả market; chỉ external world trade mới thay đổi tổng hàng nằm trong game boundary.
- Inventory không âm; mọi quantity hữu hạn, nằm trong precision/range quy định.
- `unallocated` hoặc `unmet demand` là trạng thái thiếu hụt, không được trừ kho chưa tồn tại.
- Không được ghi một flow hai lần ở cả producer và market clearing.
- Spoilage/destruction phải có loại nguyên nhân và policy; không được xóa stock âm thầm.

### 4.3. Market grouping trong S7 trước khi có logistics

S7 có thể giữ abstraction quốc gia/customs union để không tạo price gradient theo khoảng cách trước S8, nhưng phải tách rõ:

- `EconomicMarket`: nhóm clearing và price formation; có membership history theo tick.
- `InventoryPool`: tồn kho aggregate theo market/good trong giai đoạn chưa có spatial transport.
- `ExternalTradePool`: external counterpart aggregate cho lượng xuất/nhập chưa có bilateral route.
- `MarketMembershipChange`: sự kiện gia nhập/tách customs union hoặc thay đổi overlord/market.

Chưa khẳng định hàng hóa trong InventoryPool có thể được giao đến mọi region ngay lập tức. Trước S8, đây là abstraction có nhãn. S8 sẽ phân bổ inventory/flows sang hub/node và áp dụng capacity/distance. Migration của pool ở S8 phải bảo toàn tổng stock và ghi rõ phương pháp phân bố ban đầu; không tự tạo tọa độ kho hay vị trí cảng khi không có nguồn.

### 4.4. Production và input clearing

Pipeline hiện tại phải được thay bằng mô hình hai giai đoạn, tránh ghi nhận output trước input:

1. Producer/legacy adapter gửi `ProductionIntent`: good outputs dự kiến, input demand, capacity, method, market và provenance.
2. Engine tính supply khả dụng gồm opening inventory sau spoilage và production đã được xác nhận từ các process không cần input trong kỳ.
3. Input allocation cấp số lượng thực tế cho từng ProductionIntent theo một priority policy deterministic.
4. Actual production chỉ được commit sau khi toàn bộ input requirement được xác định. Với recipe nhiều input, output bị giới hạn bởi input ratio thấp nhất sau allocation; phần input không dùng không bị tiêu thụ.
5. Actual outputs mới được cộng vào goods availability/ledger.
6. Consumption (cohort/household, government, military) được cấp phát từ số hàng còn lại theo priority/rationing contract.
7. Closing inventory và unmet demand được tính, kiểm tra conservation, sau đó mới publish prices/market stats.

**Chuỗi sản xuất nhiều tầng:**

- S10/S11 phải khai báo dependency của recipes.
- Recipe dependency không tạo cycle mặc định. Các chuỗi DAG có thể xử lý theo topological production tiers.
- Nếu một công nghệ/recipe về sau tạo chu trình vật chất, cần solver riêng có số vòng lặp hữu hạn, deterministic convergence rule, max-iteration policy và residual accounting; không âm thầm lặp đến khi số liệu "trông hợp lý".
- Không dùng output tạm tính như hàng hóa đã tồn tại để thỏa input cùng lúc nếu chưa có staged settlement.
- Các legacy recipes hiện tại được bọc bằng `LegacyProductionAdapter` có label; khi S10/S11 thay thế, adapter được loại bỏ theo migration/test, không chạy song song tạo duplicate supply.

### 4.5. Scarcity, rationing và price formation

Tách ba thứ vốn đang bị trộn:

- `desiredDemand`: nhu cầu muốn mua theo cohort/household và producer.
- `allocatedDemand`: lượng hàng thực sự được cấp.
- `unmetDemand`: phần thiếu, không phải hàng hóa đã tiêu thụ.

S7 cần một scarcity policy có version:

- essentials (đặc biệt lương thực/nhiên liệu ở bối cảnh lịch sử phù hợp) không mặc định cạnh tranh ngang hàng với luxury goods;
- intermediate input priority phải được khai báo theo production contracts, không do order tùy tiện của object/array;
- cohort demand được cấp theo need profile/priority và class/wealth trong S6/S7, không lấy trung bình Region rồi chia đều;
- government/military demand có chính sách rõ, có thể bị rationing;
- luật/biến cố có thể thay đổi priority nhưng phải là rule có nguồn hoặc là gameplay rule được khai báo.

Price formation dùng market-level excess demand, inventories và external supply elasticity; mọi thành phần có bounds/units rõ. Giai đoạn đầu có thể dùng deterministic bounded adjustment thay vì solver toàn cầu, nhưng:
- price target phải dựa trên allocated/available physical quantity;
- marketStats phải xuất chính quantity dùng để tính price;
- smoothing không được che mất một cú sốc thiếu hàng nghiêm trọng;
- price floor/ceiling và damping phải được calibrate bằng benchmark, không tự chọn số tùy ý;
- không được dùng một price index như tiền giao dịch trước khi currency contract tồn tại.

### 4.6. Sản phẩm chuyển tiếp theo thứ tự roadmap

Vì S6 → S7 → S8 → S10 → S11 → S12 là phụ thuộc nhiều giai đoạn:

- S6 đưa vào cohort needs/consumption profiles và income/wealth estimates có nhãn.
- S7 thêm Goods Registry, unit contract, inventory pool, monthly flow ledger, material-balance checks và price/shortage accounting.
- Trong khi S10/S11 chưa mở, output hiện tại chỉ được đưa qua legacy adapter có provenance, không giả thành firm/site thật.
- S7 không tạo employment assignments hoặc wage payments.
- Sau S10/S11, BuildingSite production trở thành producer source duy nhất; legacy adapter bị retired.
- S12 mới thêm jobs/hiring/firing/wages/labor competition và gắn wage ledger với cohort.
- S13 mới phân phối profit/dividends/ownership/investment thật.

---

## 5. S8 — Infrastructure, transport và market access

### 5.1. Network model

Các thực thể khái niệm:

| Thành phần | Vai trò |
|---|---|
| `TransportNode` | Strategic Region access point, settlement, port, station, canal/river port hoặc logistics hub |
| `TransportEdge` | Road, river, sea lane, canal, railway hoặc mode hợp lệ khác |
| `InfrastructureAsset` | Cầu, cảng, ga, kênh, đường sắt; có owner, condition, capacity, valid dates |
| `TransportShipment` | Quantity được gửi, tuyến, mode, departure/arrival tick, trạng thái |
| `MarketHub` | Node nơi inventory được gom/phân phối |
| `Blockade/Disruption` | Giảm hoặc khóa capacity theo chiến tranh, phong tỏa, thiên tai, phá hoại, chiếm đóng |
| `MarketAccessSnapshot` | Kết quả tổng hợp khả năng tiếp cận theo region/good/market và tick |

### 5.2. Temporal validity và lịch sử

Mọi hạ tầng/route phải có:

- `valid_from`, `valid_to` hoặc event history tương đương;
- construction/completion/upgrade/closure tick;
- owner/controller history khi cần;
- source/provenance, date và confidence;
- capacity baseline, technology dependencies, terrain/climate constraints;
- damage, repair, blockade/disruption state.

Không được bật railway/kênh/port trước khi tồn tại hoặc trước khi địa phương có khả năng kỹ thuật phù hợp. Không được dùng bản đồ đường hiện đại như đường 1836. Sea lane/river navigation chỉ tồn tại nếu dữ liệu và điều kiện cho phép; không cho mọi region ven biển kết nối trực tiếp với nhau miễn phí.

### 5.3. Edge cost, capacity và travel time

Mỗi edge cần tách:

- `capacity_per_month`: giới hạn throughput theo mode/asset;
- `travel_time_days` hoặc simulation-month approximation đã chuẩn hóa;
- `cost_per_unit`: chi phí vận chuyển theo quantity/mass/volume, mode và terrain;
- `reliability`: tỷ lệ hàng đến/đúng hẹn nếu hệ thống có cơ sở;
- `access_policy`: quyền sử dụng, customs, neutral access, blockade;
- `effective_capacity`: capacity sau damage, congestion, season, blockade và occupation.

Một route bị nghẽn phải làm giảm lượng thực sự giao được, không chỉ tăng giá trên UI. Hai shipment dùng chung bottleneck phải cùng tiêu thụ edge capacity; không tính mỗi tuyến độc lập rồi vượt tổng capacity.

### 5.4. Route selection và shipment settlement

- Dijkstra (hoặc algorithm tương đương) với stable tie-break là baseline route search. Tie-break theo node/edge ID chuẩn hóa, không theo thứ tự mảng tùy tiện.
- Không lưu full all-pairs path. Lưu graph + cache route có version/invalidation theo infrastructure/disruption tick.
- Flow solver ban đầu có thể dùng deterministic capacity allocation theo priority/contract và route cost; multi-commodity global max-flow chỉ triển khai khi benchmark chứng minh cần thiết.
- Shipment có `quantity_requested`, `quantity_departed`, `quantity_arrived`, `loss`, `departure_tick`, `arrival_tick`, `route_id/hash`, `status`.
- Goods đang in-transit không nằm trong kho đến và không được tiêu thụ trước arrival. Khi save/load phải khôi phục ETA, route và residual capacity deterministically.
- Nếu route bị cắt khi hàng đang trên đường, chính sách diversion/return/loss phải được định nghĩa; không teleport shipment sang destination.
- Customs/tariff/fees phải hạch toán theo các border crossing/contract rules. Thuế không tạo hay xóa hàng hóa; nó chỉ chuyển money giữa accounts.

### 5.5. Market access

Market access không phải một trường railway bonus. Nó được suy ra từ:

- nguồn cung tại region/hub;
- đường đi có capacity còn lại;
- transport cost/time;
- hàng đến được trong cửa sổ mô phỏng;
- market membership và legal/customs access;
- blockade/disruption;
- nhu cầu theo good và household/producer.

Gợi ý output:

`access(region, good, market, tick) = delivered_available / desired_demand`

được clamp theo định nghĩa, đồng thời giữ các thành phần riêng: local availability, reachable imports, unmet demand, delivery cost và reliability.

Không gộp một chỉ số access tổng duy nhất nếu lương thực, than, thép và hàng xa xỉ có thể dùng route/capacity khác nhau. UI có thể trình bày một summary weighted, nhưng engine phải giữ access theo good hoặc good family.

### 5.6. Chặn và gián đoạn

- Naval blockade giảm/khóa edge capacity hoặc tăng cost theo vùng phong tỏa và thời gian.
- Occupation không mặc định cắt mọi flow; phải tính control, infrastructure damage và access policy.
- Chiến tranh, đình công, mùa đông, hạn hán, lũ lụt, dịch bệnh có thể làm gián đoạn những edge có liên quan.
- Hạ tầng bị phá hủy không lập tức biến mất khỏi save; trạng thái condition/repair và project phục hồi cần rõ.
- Nếu không có dữ liệu đủ, disruption là gameplay estimate có label, không tự khẳng định historical fact.

---

## 6. Quan hệ với POP, production, finance và diplomacy

| Hệ thống | Interface | Boundary |
|---|---|---|
| S6 Population Cohorts | Cohort need profiles, income/wealth estimates, household demand | Không dùng region average để thay tất cả cohort |
| S7 Goods/Accounting | Goods flow, inventories, market prices, shortage | Không tự tạo goods khi shortage |
| S8 Transport | Hub/region routes, shipment, delivered availability | Không dùng một global openness factor thay network |
| S10 ProductionMethod | Input/output, units, era, site potential, workforce template | Không cho S7 định nghĩa recipe lịch sử không có nguồn |
| S11 BuildingSite | Actual production intents and output settlement | Output chỉ commit sau input allocation |
| S12 Employment | Jobs, wages, unemployment, labor competition | Không giả hiring trong S7/S11 |
| S13 Ownership | Revenue, input cost, wages, profit, dividend, taxes | Không dùng GDP proxy để tuyên bố firm profit |
| Government finance | Taxes, tariffs, subsidies, procurement, debt | Tách money ledger với goods ledger |
| Military | Arms/ammunition/food/fuel supply by location/route | Không chỉ trừ demand ở cấp quốc gia nếu cần logistics |
| Diplomacy | Customs union, treaty access, embargo, sanctions, trade agreements | Member changes có effective date và settlement rules |

---

## 7. Save, migrations và deterministic behavior

S7/S8 phụ thuộc S1 save/data foundations; không triển khai trực tiếp lên version-1 save.

Bắt buộc trước runtime:

- `engineVersion`, `saveSchemaVersion`, `dataBuildHash` riêng biệt;
- v1 legacy migration thuần, deterministic, có fixtures;
- inventory migration không tự tạo lịch sử kho chưa từng tồn tại;
- nếu save v1 không lưu goods stocks, khởi tạo stock theo quy tắc migration được owner/reviewer chấp nhận (ví dụ zero stock và chỉ sản xuất/flow từ tick tiếp theo) hoặc explicit estimate có nhãn; không tự gán kho lịch sử;
- custom union membership changes không được nhân đôi inventory khi member join/leave;
- unknown schema/data hash bị xử lý an toàn, không ghi đè save gốc;
- save/load continuation khôi phục prices, stocks, pending shipments, ledgers cần thiết và RNG state chính xác;
- cache route/market access có thể rebuild nhưng phải deterministic.

Tại mỗi tick, stable order phải rõ cho:
- market IDs, goods IDs;
- producer and consumer group IDs;
- edge/node IDs;
- shipment allocation and tie-breaks;
- rounding residuals;
- market membership transitions.

Không dùng `Math.random()`, wall-clock hoặc asynchronous completion order trong simulation.

---

## 8. Performance và mobile constraints

Không tạo object cho mỗi unit hàng, người dân, transaction hoặc đường đi toàn cặp.

Benchmark theo độ lớn thực của 662 Strategic Regions và số node/edge/shipment thật ở nhiều seed:

- monthly S7 market clearing p50/p95/p99;
- S8 route search/cache hit rate và shipment settlement p50/p95/p99;
- số market/good inventory rows, non-zero flows, shipments và active edges;
- memory peak và heap growth qua 10/25/50 năm;
- save bytes, serialize/deserialize, migration time;
- route recomputation khi railway/canal/port/war blockade thay đổi;
- stress case trade war, customs union split, blockade, port loss, famine, damaged railway and mass migration.

Ưu tiên sparse arrays/typed storage nếu benchmark chứng minh. Không cache state mutable nếu chưa có invalidation key/hash. Không giảm simulation fidelity âm thầm theo máy; mọi quality/performance tier phải là gameplay rule minh bạch và deterministic.

---

## 9. Test và tiêu chí nghiệm thu

### S7 material accounting

1. Zero-initial inventory: closing stock đúng theo flow; không có free goods.
2. Inventory carryover: stock tháng N trở thành opening stock tháng N+1.
3. Spoilage: stock giảm đúng rate/quantity và được ghi nhận là loss.
4. Production input shortage: output chỉ được tính từ input thực đã cấp; market supply/stats/GDP dùng cùng actual output.
5. Multi-input recipe: input bottleneck giới hạn output; phần input dư không bị tiêu thụ.
6. Transfer conservation: export/import internal khớp chính xác; total world stock không đổi.
7. Customs union join/leave: stock được chuyển một lần, không duplicate hoặc destroy.
8. Rationing: allocated consumption không vượt availability; unmet demand được ghi riêng.
9. Determinism: cùng seed/commands/data hash cho cùng balances, prices và closing inventory.
10. Save/load: continuation exact, gồm inventory, pending flows và RNG.
11. Currency separation: tariffs/tax/subsidy chỉ tác động money accounts, không thay physical stock.
12. Legacy adapter: supply không bị đếm hai lần khi S10/S11 được kích hoạt.

### S8 logistics

1. Route không vượt edge capacity khi nhiều shipments dùng cùng bottleneck.
2. Không có path/capacity thì không có arrival.
3. Shipment chỉ usable sau arrival; in-transit không nằm trong destination inventory.
4. War/blockade/occupation thay đổi capacity và có effective tick; không hồi tố flow đã settled.
5. Rail/port/canal không hoạt động trước valid date/technology/commissioning.
6. Route selection deterministic khi cost bằng nhau.
7. Infrastructure change invalidates đúng cache.
8. Market access phản ánh goods-specific delivered availability, không chỉ coastline/rail count.
9. 662-region stress suite đạt ngân sách p95/p99 đã được phê duyệt trước khi runtime merge.
10. Save/load continuation exact khi đang có shipments in transit.

### Historical and global coverage

- Kiểm thử nhiều khu vực và loại polity, không chỉ châu Âu/các cường quốc.
- Nguồn taxonomy, output coefficients, transport capacity, route dates và local units có provenance/quality.
- Không backdate railway, steam shipping, telegraph, canals hoặc industrial recipes.
- Historical Mode giữ temporal validity; Sandbox được phép rẽ nhánh sau 1836 nhưng cùng pipeline ban đầu.
- Không khóa giá, output, trade path hoặc chiến tranh theo kết quả lịch sử có sẵn.

---

## 10. Slices triển khai đề xuất sau khi các gate mở

Các bước này là kế hoạch tương lai, không phải authorization:

1. **S1 — Data/save foundations:** version/hash, static vs mutable state, migration, strict validation, deterministic serialization.
2. **S6 completion:** cohort demand profiles, estimate labels, population mass balance and save/load.
3. **S7-A — Goods Registry and unit contract:** canonical units, conversion tables, data provenance and legacy mapping.
4. **S7-B — Inventory and accounting core:** sparse stock, monthly balances, conservation assertions and save/load tests; không đổi production rules cùng lúc.
5. **S7-C — Deterministic market clearing:** demand allocation, shortage, price formation, external pool; marketStats chỉ đọc từ ledger.
6. **S7-D — Legacy production adapter:** đưa sản xuất hiện tại qua intent/input allocation, loại bỏ double counting; benchmark/calibration.
7. **S8-A — Temporal transport graph:** nodes, edges, dates, capacities, modes and source registry.
8. **S8-B — Route/shipment:** capacity allocation, in-transit goods, arrival/loss and deterministic save/load.
9. **S8-C — Market access:** goods-specific delivered availability, blockade and transport price.
10. **S9 — Technology and diffusion:** mở hạ tầng/production capability theo thời kỳ.
11. **S10/S11 — ProductionMethod and BuildingSite:** thay hẳn legacy recipe/building-level adapter theo từng slice.
12. **S12/S13 — Labor and ownership:** jobs/wages, then firms/profit/dividends/capital.

Mỗi slice có task scope riêng, code diff nhỏ, baseline, fixture, performance budget, independent review và owner acceptance. Không triển khai S7/S8 cùng lúc với migration S1 trong một change set lớn.

---

## 11. Các quyết định còn cần chốt trước code

1. **Inventory location trong S7:** đề xuất market-level aggregate pool trước S8; không giả vờ có vị trí vật lý. S8 chuyển sang node/hub inventory theo migration có bảo toàn.
2. **Legacy stock v1:** đề xuất không bịa stock ban đầu; cần quyết định zero stock hoặc một initial estimate có nguồn và label.
3. **Goods granularity:** ưu tiên đủ phân biệt chuỗi cung ứng, nhưng không tạo taxonomy khổng lồ vượt khả năng dữ liệu và performance.
4. **Rationing priority:** essentials, producer inputs, government và military phải có policy rõ; tránh một quy tắc ưu tiên ẩn.
5. **External world trade:** trước S8 là pool aggregate có giới hạn; S8 mới có route/capacity. Cần xác định rõ trade boundary và tiền/thuế.
6. **Transport scale:** chọn node model gắn 662 Strategic Regions + settlements/ports; không biến toàn bộ raster cells thành entity mô phỏng mutable.
7. **Price contract:** giá nội bộ là index hay monetary unit; nếu cả hai, phải tách và có conversion/benchmark.

Các quyết định normative làm thay đổi roadmap phải có owner decision trace. Không tự sửa roadmap hoặc gắn nhãn owner-approved.

---

## 12. Review và gate boundary

Claude nên review độc lập đề xuất này theo no-write scope, tập trung vào:
- tính nhất quán vật chất và tránh double counting;
- thứ tự production/input/market clearing;
- stock migration và custom union membership;
- unit/currency contract;
- S7/S8 boundary với S6/S9/S10/S11/S12/S13;
- graph algorithms, bottleneck capacity và mobile performance;
- Historical/Sandbox determinism.

Ngay cả `REVIEW_PASS` cũng chỉ áp dụng cho tài liệu thiết kế. Nó không:
- thay thế review S0-B7;
- tạo owner acceptance;
- mở S1, S6, S7 hoặc S8;
- cho phép sửa engine, save schema, shipped data, tests, UI, Android hoặc APK.

**Kết luận:** S7 phải là hệ thống hạch toán hàng hóa có tồn kho và conservation; S8 phải là mạng logistics có capacity và shipment. Market price, GDP, POP needs, production và trade phải được tính từ cùng một tập flow đã settled. Đây là nền tảng cần thiết để kinh tế có chiều sâu kiểu Victoria 3 mà vẫn kiểm chứng được, deterministic và phù hợp mobile.
