# Đề xuất thiết kế kỹ thuật — Population Cohorts (P0)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch mục tiêu:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Code baseline được kiểm tra:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Documentation HEAD khi lập đề xuất:** `b472b901da2eb3d5b53a5397b2907c8a94defcc1`  
**Ngày:** 18/11/2026  
**Trạng thái:** `DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION`

> Đây là đề xuất kỹ thuật để chuẩn bị lát cắt P0 Pop Cohorts. Tài liệu không mở S1/S6, không cấp quyền sửa engine, save schema, dữ liệu lịch sử đang chạy hoặc giao diện. S1 vẫn `NOT_STARTED` cho tới khi các điều kiện độc lập review và owner acceptance trong `AI_HANDOFF.md` được đáp ứng.

---

## 1. Quyết định thiết kế

Population Cohorts phải trở thành mô hình dân cư có trạng thái riêng, có thể giải thích và có thể tương tác với kinh tế/chính trị. Không tạo một object cho từng cá nhân. Một cohort đại diện một nhóm người có cùng các thuộc tính mô phỏng ở cùng một địa điểm.

Lựa chọn kiến trúc:

1. **Một nguồn dữ liệu dân cư mutable duy nhất:** `GameState.population.cohorts` là nguồn chính của quy mô và trạng thái nhóm dân cư sau khi migration được triển khai.
2. **Region aggregates là read model tương thích:** `Region.pop`, `Region.strata` và các trường tóm tắt hiện có được tính lại từ cohort state. Không cho phép một phần engine tự cập nhật cohort còn phần khác tự cập nhật tổng vùng.
3. **Static historical data tách khỏi GameState:** population seeds, occupation definitions, source references, quality và uncertainty nằm trong historical DB/data build; GameState chỉ lưu các giá trị thay đổi theo chiến dịch và tham chiếu đến seed/template cần thiết.
4. **Cohort identity không phải individual identity:** không có tên, ngày sinh cá nhân hay hồ sơ nhân vật cho từng người trong cohort.
5. **Historical và Sandbox dùng cùng pipeline:** cùng snapshot đầu năm 1836 và cùng công thức mô phỏng. Historical chỉ dùng các lớp lịch sử có điều kiện; Sandbox không bị ép kế vị/sự kiện sau 1836.
6. **Không tuyên bố employment/wages thật trong S6:** S6 cung cấp cơ cấu nghề, skill và thu nhập/tài sản ước lượng có nhãn. Tuyển dụng vào BuildingSite, job slots và wage clearing chỉ được nghiệm thu tại S12 theo roadmap v3.2.

## 2. Hiện trạng code đã xác minh

| Thành phần | Hiện trạng trong baseline | Hệ quả |
|---|---|---|
| `src/engine/types.ts` — `Region` | Chỉ lưu `pop`, mảng `strata` 9 phần tử, tối đa hai culture, một religion, literacy/SOL/radicalism dạng vùng | Không thể biểu diễn đồng thời nhiều nhóm dân cư độc lập trong một region |
| `src/engine/types.ts` — `GameState` | Chưa có `population` collection hoặc cohort index | Chưa có nguồn trạng thái POP riêng |
| `src/engine/init.ts` — `strataFor()` | Tạo 9 tỷ lệ tầng lớp theo mức công nghiệp hóa quốc gia và loại polity | Cơ cấu trong region hiện phần lớn là fallback tổng hợp, không phải phân bố quan sát được |
| `src/engine/init.ts` — `createGame()` | Gán literacy mặc định theo luật giáo dục; ước lượng slave share bằng culture proxy; tạo building ban đầu từ strata/resource | Một số con số khởi tạo là mô hình hóa, cần giữ nhãn chất lượng và không được gọi là census fact |
| `src/engine/systems/population.ts` — `populationMonth()` | Birth/death, literacy, migration, nationalism tính theo region | Phản ứng dân số không khác nhau theo nghề, tuổi, tôn giáo hay nhóm thu nhập |
| `population.ts` — `shiftStrata()` | Chuyển peasants sang workers/laborers/middle/capitalists theo capacity/heuristic | Đây là chuyển tầng lớp ước lượng, không phải hiring từ BuildingSite |
| `src/engine/systems/economy.ts` | Lao động = `pop * 0.45`; production sử dụng strata shares và capacity tổng hợp | Không có job slot, hiring, firing, wage hoặc thất nghiệp theo cohort |
| `src/engine/data/dbTypes.ts` | `RegionRecord` có `culture2/c2` và `religion2/r2` | Có một phần dữ liệu thành phần thứ hai trong static input |
| `init.ts` / `Region` | Runtime hiện chỉ giữ `culture2/c2`, không giữ `religion2/r2` | Thành phần tôn giáo thứ hai bị mất khi tạo GameState; cần sửa trong data-contract phase, không tự vá ở đây |
| `src/engine/save.ts` | Envelope đơn giản với `format`, `version`, `savedAt`; hiện chỉ nhận version 1 | Không có migration chain hoặc tách riêng engine/data/save schema version |

Các kiểm tra này khớp với parity audit và roadmap: POP hiện tại là tỷ lệ tầng lớp ở cấp region; core cohort, needs, employment/wages và các liên kết nhân quả chưa được triển khai.

## 3. Ranh giới giai đoạn

Thứ tự phụ thuộc phải giữ theo roadmap đã được owner duyệt:

| Giai đoạn | Vai trò | Kết quả bắt buộc |
|---|---|---|
| S0-B7 review + owner decision | Cổng trước S1 | Independent `REVIEW_PASS` và owner `ACCEPTED` cho gói S1; S0 không được gọi là PASS khi còn gate bị BLOCKED/PARTIAL |
| S1 — Data contracts/schema/save compatibility | Nền tảng bắt buộc | Tách static DB khỏi mutable GameState; versioning; migration; hash; deterministic save/load |
| S6 — Population Cohorts | P0 POP foundation | Cohort identity, composition, aggregate read model, demographic/social attributes, migration và mass-balance |
| S7 — Goods/inventories/accounting | Nối kinh tế vật chất | Needs/consumption và market clearing theo nhóm dân cư |
| S10 — BuildingType/ProductionMethod | Định nghĩa phía cung | Catalog PM, input/output, workforce templates, unlock và era validity |
| S11 — BuildingSite operations | Vận hành công trình | Sparse BuildingSite, production/inputs/outputs, chưa tuyên bố hiring thật nếu S12 chưa có |
| S12 — Employment/wages/labor competition | Hiring thật | Job slots, qualification matching, hiring/firing, wage clearing và cạnh tranh lao động |

Không đảo S6/S7/S10/S11/S12 chỉ để có giao diện POP đẹp. Một màn hình có population breakdown nhưng không có data contract và simulation gate không phải feature hoàn thành.

## 4. Mô hình dữ liệu đề xuất

### 4.1. Static definitions và historical seed

Static DB cần cung cấp các định nghĩa riêng, không nhúng mô tả vào mutable GameState:

- `OccupationDefinition`: ID ổn định, tên bản địa hóa, family, economic role, era validity, yêu cầu skill/education và source refs.
- `QualificationDefinition`: các cấp kỹ năng/đào tạo được engine sử dụng; phải tương thích cơ cấu giáo dục thế kỷ XIX, không copy nhãn hiện đại thiếu căn cứ.
- `CohortSeed`: region + culture + religion + stratum + occupation/occupation-group + age profile (nếu có dữ liệu) + size/share + quality + uncertainty + source references + method.
- `NeedProfile`: nhu cầu hàng hóa/dịch vụ theo nhóm và mức sống; định nghĩa static, được S7 tiêu thụ.
- `PopulationMethod`: công thức fallback, phạm vi áp dụng, chất lượng đầu ra và version của phương pháp.

Nguồn dân số tổng 1836 hiện có trong `historical_data/population/population_totals_1836.json` dùng để scale tổng population cho tập region đã chỉ định. Nó **không** tự chứng minh occupation, age, literacy, wealth hoặc religion shares ở cấp cohort. Không suy ra chi tiết chưa có từ một population total.

### 4.2. Mutable runtime cohort

Schema khái niệm (không phải code đã tích hợp):

```ts
type AgeBandId = string; // ID do static data định nghĩa; có reserved ID "unknown"

interface PopulationCohort {
  id: string;                    // "pop:v1:" + canonical JSON identity tuple; không phải ID cá thể lâu dài
  regionId: string;
  cultureId: string | null;      // null = chưa phân loại; không đồng nghĩa một culture cụ thể
  religionId: string | null;     // null = không rõ; "unaffiliated" phải là ID tường minh riêng
  stratum: Stratum;
  occupationId: string;          // "unclassified" khi chưa đủ bằng chứng
  qualificationId: string;       // "unknown" khi chưa đủ bằng chứng
  size: number;                  // số người nguyên, non-negative safe integer
  ageCounts?: Record<AgeBandId, number>; // nếu có, tổng các band (kể cả "unknown") phải đúng bằng size
  literacy: number;              // 0..1; estimate phải giữ provenance ở static seed/method
  health: number;                // 0..1 nếu model/data hỗ trợ; không tự điền giá trị giả
  wealthPerCapita: number;       // đơn vị kinh tế nội bộ được chuẩn hóa ở data/economy contract
  incomePerCapita: number;       // S6 có thể là estimate, không phải wage thực
  needsSatisfaction?: number;    // S7 cung cấp đầy đủ
  radicalism: number;            // 0..1
  templateId?: string;           // liên kết static seed/method và provenance
}
```

Quy tắc:

- `size` là số lượng người. Các thuộc tính liên tục là giá trị cohort-weighted, không lưu một mảng giá trị cho từng người.
- `religionId = null` hoặc `occupationId = unclassified` tốt hơn việc tự gán một nhãn sai khi historical data không đủ.
- `ageCounts` chỉ được khởi tạo khi có nguồn/ phương pháp công khai đủ cho polity hoặc nhóm vùng tương ứng. Nếu không, để thiếu và dùng mortality/fertility fallback đã gắn quality; không tự đặt tuổi chính xác.
- `employmentAssignment` không nằm trong cohort S6. Từ S12, employment relationship nên là assignment riêng giữa cohort và BuildingSite job slot, để cùng một cohort có thể phân bổ vào nhiều employer mà không nhân đôi population.
- Không lưu source URL/metadata lặp lại trên mọi cohort mỗi tick. Provenance nằm trong static seed/template và được liên kết thông qua `templateId` + `dataBuildHash`. Nếu một cohort gộp từ nhiều seed/method có quality khác nhau, implementation phải giữ được provenance tổng hợp và không nâng quality của nhóm lên cao hơn thành phần yếu nhất; quy tắc lưu provenance chi tiết phải được chốt ở S1 trước khi migration/runtime code được viết.

### 4.3. Cohort identity và split/merge

Identity key về mặt logic (không bao gồm phân bố tuổi):

`[regionId, cultureId-or-unknown, religionId-or-unknown, stratum, occupationId, qualificationId]`

- Serialize tuple theo canonical JSON để tạo `id = "pop:v1:" + canonicalTuple`; không ghép chuỗi bằng delimiter có thể xuất hiện trong ID thành phần.
- `ageCounts` là vector phân bố tuổi bên trong cohort, không phải một chiều identity. Nếu static data có tuổi, các band phải dùng ID từ AgeBand definitions và tổng số đếm (bao gồm band `unknown` cho phần chưa rõ) phải bằng `size`. Nếu không có age evidence, để `ageCounts` absent; không tự chia tỷ lệ.
- `size` và từng age count là số nguyên an toàn, không âm. Mọi split/migration phải chia cả `size` và các age counts theo cùng quy tắc remainder xác định.
- `religionId = null` chỉ có nghĩa là không rõ/không được ghi nhận; nhóm không theo tôn giáo hoặc không khai báo phải dùng ID tường minh riêng, không dùng null.
- ID là canonical key của cấu trúc cohort hiện tại, không phải định danh bền vững xuyên mọi biến đổi: đổi region/stratum/occupation/qualification sẽ tạo key mới. Không lưu foreign key lâu dài tới `cohort.id`; hệ thống cần liên kết bền vững phải dùng ID thực thể khác (ví dụ BuildingSite từ S12) hoặc event/lineage được thiết kế riêng.
- Khi migration chuyển cohort sang region mới, tạo key mới tại destination và trừ đúng số lượng khỏi source.
- Khi đổi stratum/occupation/qualification, thực hiện split/merge xác định: phần population chuyển sang key mới; phần còn lại giữ key cũ.
- Cohort có cùng key được hợp nhất theo quy tắc canonical: `size` và age counts cộng; các thuộc tính dạng bình quân được gộp theo trọng số population, không lấy trung bình đơn giản. Giá trị thiếu không được thay bằng 0; nếu hai record không thể gộp mà vẫn giữ provenance/quality thì phải giữ provenance tách biệt hoặc không gộp.
- Mọi phép xử lý cohort phải duyệt theo stable ID order hoặc canonical region order. Không dựa vào thứ tự property của object để tạo kết quả mô phỏng.

### 4.4. Region aggregate read model

Trong giai đoạn chuyển tiếp, giữ `Region.pop` và `Region.strata` để tránh phải sửa đồng loạt tất cả consumer trong cùng một patch. Nhưng sau khi cohort system trở thành nguồn chính:

- `Region.pop = sum(cohort.size)`.
- `Region.strata[i] = sum(size của cohort có stratum i) / Region.pop`.
- Culture/religion summaries được tổng hợp từ cohort list, nhưng không ép các thành phần còn lại vào một trường culture/religion duy nhất.
- Mọi module được cấm tự chỉnh `Region.pop` hoặc `Region.strata` ngoài một aggregator duy nhất.
- Mỗi tick chạy invariant kiểm tra hữu hạn, không âm, tổng strata bằng 1 trong tolerance và tổng cohort theo region khớp read model.
- UI đọc dữ liệu từ query/selector; không tự tái tính quy luật mô phỏng.

## 5. Khởi tạo dữ liệu và kiểm soát độ chính xác lịch sử

### 5.1. New game năm 1836

Pipeline khởi tạo đề xuất:

1. Load RegionRecord và population benchmark đã normalize.
2. Load occupation/stratum/culture/religion seed đã được nguồn hóa nếu có.
3. Tách các dimension có evidence thành cohorts; scale cohort sizes để tổng bằng đúng `RegionRecord.pop`.
4. Với dimension thiếu, tạo cohort `unclassified/unknown` hoặc fallback được gắn quality; không giả vờ dữ liệu chính xác.
5. Lưu method/version/hash để chiến dịch có thể tái lập.
6. Tạo Region aggregates từ cohort state và chỉ sau đó khởi tạo các hệ thống phụ thuộc.

Không nhân chéo vô điều kiện culture × religion × stratum × age × occupation. Nếu một dimension không có share evidence, cross-product sẽ tạo hàng chục record có vẻ chính xác nhưng thực tế là giả. Chỉ split theo dimensions có shares có căn cứ hoặc fallback được phê duyệt.

### 5.2. Phân biệt lịch sử và ước lượng

Mỗi đầu vào cần phân loại tối thiểu:

- `verified`: census/table hoặc dataset có phạm vi và locator rõ ràng.
- `supported`: nguồn học thuật/thiết chế hỗ trợ trực tiếp nhưng không phải census đầy đủ.
- `estimated`: có method và uncertainty range có thể tái tạo.
- `uncertain`: các nguồn/mốc đo khác nhau hoặc phạm vi còn tranh chấp.
- `missing`: chưa có evidence đủ; gameplay fallback phải hiển thị rõ.

Không được dùng `quality=supported` cho một share nghề chỉ vì tổng dân số của nước có CoW benchmark. Quality của total population không truyền tự động sang occupation/culture/religion/age.

Đối với các region có population scope tranh chấp (ví dụ OYO/NDE trong H01 R3l), phải phân biệt population trong vùng địa lý, population dưới quyền kiểm soát thực tế và population của polity. Không quy toàn bộ địa lý cho một state chỉ vì map đang có một owner ID.

### 5.3. Chế độ game

- Historical Mode bắt đầu cùng snapshot 1836, dùng dữ liệu nguồn hóa và các sự kiện exogenous có điều kiện. Không ép fertility, mortality, migration hoặc strata path thành kết quả lịch sử cố định.
- Sandbox Mode dùng cùng snapshot 1836 và cùng thuật toán dân cư; sau ngày bắt đầu, kết quả có thể rẽ nhánh do người chơi/AI và điều kiện khác.
- Cùng seed + cùng command stream + cùng data build phải cho cùng cohort state ở cả save/load continuation.
- Không hardcode hậu quả sau 1836 vào cohort seeds chỉ để tăng milestone similarity.

## 6. Mô phỏng cohort — thứ tự xử lý đề xuất

Một monthly population pipeline ở giai đoạn S6/S7/S12 cần có các bước tách biệt, với input/output rõ:

1. **Demographic update:** births/deaths theo nhóm đủ dữ liệu; nếu age profile thiếu, sử dụng fallback tổng hợp có nhãn và không tạo age bands giả.
2. **Economic attributes:** cập nhật income/wealth theo estimate của S6; sau S12 thay thế estimate bằng wage/dividend thực của các job/ownership systems.
3. **Needs and consumption:** ở S7, tính basket theo cohort/wealth, phân bổ demand vào market clearing, cập nhật satisfaction/shortage từ kết quả thực.
4. **Occupation/qualification transitions:** chuyển nhóm theo literacy, training, urbanization, technology, laws và cơ hội địa phương; không coi đây là building hiring.
5. **Migration:** chọn destination theo attractiveness, job/land access, market availability, legal restrictions, conflict và family/community factors khi có dữ liệu. Migration phải chuyển population, không copy population.
6. **Political/social aggregation:** tổng hợp interest alignment, radicalism và pressure vào region/country/IG; một cohort không được đếm nhiều lần.
7. **Read-model rebuild:** cập nhật Region/ Country aggregates từ cohort state một lần, cuối pipeline hoặc theo dependency đã khóa.

Các phép tính phải tách khỏi UI và dùng fixed monthly cadence ban đầu. Nếu hiệu năng vượt ngân sách, dùng deterministic batching/worker/chunking theo S2; không bỏ cohort hoặc giảm độ sâu mô phỏng âm thầm trên mobile.

## 7. Quan hệ với hệ thống khác

| Hệ thống | Kết nối cần có | Điều không được làm sớm |
|---|---|---|
| Economy / S7 | Cohort needs → goods demand; shortage/price → needs satisfaction, SOL, radicalism | Không tạo local goods inventory hoặc market access giả trước khi S7/S8 định nghĩa |
| Building / S10–S11 | BuildingType/PM định nghĩa workforce template và output | Không cho công trình tự “hút” workers bằng cách sửa strata share |
| Employment / S12 | Job slots, qualification matching, hiring/firing và wage payments là assignment thực | Không gọi `Region.strata` là employment records |
| Ownership / S13 | Wage bill, profit, dividends, investor/cooperative/state ownership phân phối đúng đối tượng | Không cộng income estimate của S6 như dividend thật |
| Politics / S17 | Wealth/occupation/culture/religion/law/rights/approval góp trọng số vào IG/movements | Không gán mỗi cohort cố định vào một IG duy nhất; alignment có thể xác suất/trọng số |
| Migration / S6–S8 | Chuyển người giữa region/state, theo legal/geographic/market/war constraints | Không vượt biên giới hoặc đổi identity chỉ từ một heuristic không giải thích |
| History / Journal | Các thay đổi xã hội là kết quả mô phỏng; lịch sử ghi nhận khi có ý nghĩa | Không biến một mục tiêu lịch sử thành cưỡng chế số POP |

## 8. Save/schema và migration bắt buộc trước runtime

Hiện tại `save.ts` chỉ nhận save version 1 và không có migration chain. Do đó không được thêm `population.cohorts` trực tiếp vào bản phát hành mà không có S1:

- Tách `engineVersion`, `saveSchemaVersion`, `dataBuildHash` khỏi version cũ theo đúng roadmap; giữ nguyên backward-compatibility contract được owner duyệt.
- Migration v1 → v2 phải thuần, xác định và không gọi RNG. Không gọi clock, network hoặc đọc nguồn bên ngoài.
- Với legacy save, dùng chính `Region.pop`, `Region.strata`, culture/culture2 trong save để tạo cohort nền. Chỉ dùng primary religion đang có trong save; phần religion thứ hai đã không được lưu ở runtime cũ thì không được tự tái tạo. Đánh dấu thiếu/legacy estimate thay vì suy đoán.
- Mọi region sau migration phải giữ nguyên tổng `pop`, tổng strata shares, owner/controller, culture summary và tất cả field khác không liên quan.
- Migration lỗi phải giữ nguyên file nguồn; tạo bản backup trước khi commit save mới; activation chỉ sau khi validation thành công.
- Unknown schema version phải bị từ chối an toàn với thông báo có thể hiểu được; không “best effort” rồi ghi đè save.
- Fixture v1 từ baseline, fixture malformed, fixture unknown version, fixture legacy missing field và fixture cohort v2 phải được version-control và test.
- Chạy round-trip serialize → deserialize → tiếp tục mô phỏng; state phải khớp exact theo canonical comparison, bao gồm RNG và cohort records.

## 9. Determinism, performance và memory

### Determinism

- Không dùng `Math.random()`, Date.now hoặc unordered asynchronous completion trong simulation.
- Mọi split/merge/rounding phải có quy tắc remainder xác định: sort cohort keys và gán phần remainder theo thứ tự cố định.
- Migration destination ranking và tie-break phải deterministic.
- Không tăng RNG consumption ngoài nơi đã được thiết kế/test; nếu cohort system cần randomness, dùng RNG state của GameState và cập nhật tests/hash.
- Historical/Sandbox dùng cùng các system stages, không skip pipeline theo mode.

### Performance

Không đặt trước một “số cohort tối đa” không có benchmark. Đo trên 662 region/actual cohort count và nhiều seed:

- cold start/init time và peak memory;
- average/p95/p99 population tick, economy tick và full monthly tick;
- cohort count growth/split/merge churn;
- save serialized bytes và load/migration time;
- heap/object retention qua nhiều năm mô phỏng;
- Android baseline device iQOO Z10 Turbo bằng workflow/device procedure được phép. Node/desktop không được thay số đo thật.

Thiết kế ban đầu ưu tiên group cohorts, typed data nếu đã benchmark chứng minh, derived caches không serialize, indexes được rebuild sau load. Không cache dữ liệu mutable mà không có invalidation rule.

## 10. Test contract — điều kiện nghiệm thu

### Data/init

- Cohort seed IDs duy nhất; region/culture/religion/occupation IDs phải tồn tại hoặc là explicit unknown.
- Sum cohort population theo region khớp total source/fallback trong tolerance đã định.
- Composition share không âm, hữu hạn, tổng bằng 1 trong tolerance.
- Các region có multi-culture/multi-religion giữ đúng phần share đã có trong static source; thiếu source không bị tự chuyển thành 100% majority.

### Simulation

- Birth/death làm thay đổi tổng population đúng theo cohort; không âm/NaN.
- Migration bảo toàn tổng trước demographic deltas; source giảm đúng bằng destination tăng.
- Split/merge bảo toàn số người và các weighted attributes.
- Mọi region/country aggregates khớp tổng cohort.
- Không có cohort key trùng.
- Luật slavery/serfdom và polity context áp dụng theo data/rights, không dùng một quy tắc giản lược toàn cầu.
- Không tạo actual building employment/wages trước S12.
- Cùng command stream/seed chạy Historical hoặc Sandbox giữ parity pipeline; khác biệt chỉ đến từ lớp dữ liệu/mode được khai báo.
- Save/load continuation bằng nhau chính xác trên nhiều seed, năm dài và cohort churn.

### Regression và acceptance

- Re-run tất cả baseline tests hiện có và test mới.
- Multi-decade tests (ít nhất 1836–1876, 1836–1900, và 1836–1936 cho các kịch bản được chọn) phải kiểm tra population, urban/rural mix, class shares, migration, literacy, market prices và political composition.
- Kiểm tra invariants sau mỗi tháng ở test mode; không cần bật assertion tốn kém trong release build nếu không có diagnostic flag.
- So sánh Historical/Sandbox paired seeds; không ép hai mode giống nhau về outcome, nhưng phải giống pipeline và initial population.
- UI chỉ được nghiệm thu sau khi data/simulation tests đạt; màn hình POP phải giải thích quality, estimate, unknown và nguyên nhân thay đổi.

## 11. Rủi ro chính và cách giảm thiểu

| Rủi ro | Mức | Kiểm soát |
|---|---|---|
| False precision: chia population tổng thành hàng chục cohort không có nguồn | P0 | Unknown/unclassified cohorts; source quality riêng từng dimension; uncertainty intervals |
| Save cũ không giữ religion2/r2 | P1 | Migration v1 không bịa dữ liệu; static new-game seeds được kiểm riêng |
| Hai nguồn truth Region và cohort cùng ghi được | P0 | Cohorts canonical; region aggregates read-only/rebuilt |
| Cohort explosion do cross-product | P1 | Chỉ split theo dimension được hỗ trợ; merge key canonical; đo actual count |
| Economy dùng labor supply tổng, cohort system lại tạo employment giả | P0 | S6 estimated composition; S12 mới tạo assignment/job slots |
| Non-deterministic split/migration rounding | P0 | Stable sort, deterministic tie-break, exact continuation tests |
| Khác biệt dữ liệu Historical/Sandbox ngay lúc bắt đầu | P0 | Cùng 1836 seeds; mode chỉ thay historical layers sau start |
| Mobile frame/tick/save bloat | P1 | Benchmark ngay ở stage tạo cohort; cache derived, không serialize static data |

## 12. Implementation slices sau khi được phép

1. **S1-A — Save contract:** envelope/versioning/hash, strict validator, migration framework, baseline v1 fixtures. Chưa thêm gameplay.
2. **S1-B — Mutable data boundary:** static DB immutable, GameState mutable data contracts, stable ID rules, deterministic indexes.
3. **S6-A — Read-only cohort bootstrap:** tạo cohort từ population seed; Region aggregates được dựng lại và so khớp baseline; chưa thay demographic formula.
4. **S6-B — Social attributes:** literacy/health/wealth/quality và transition rules; chưa có real hiring/wages.
5. **S6-C — Demography and migration:** cohort-level birth/death/migration với mass-balance và deterministic save/load.
6. **S7 — Needs and material consumption:** nối cohort needs vào goods/market accounting.
7. **S10/S11 — Production definitions/site:** tách BuildingType/PM/BuildingSite và output calculation.
8. **S12 — Employment and wages:** job slots, hiring/firing, qualification, wage clearing; thay thế placeholder employment.
9. **S13/S17 — Ownership and politics:** income/dividends và Interest Groups/movements theo cohort weight.

Mỗi slice phải có diff nhỏ, test contract rõ và independent review trước khi nối tiếp. Không làm toàn bộ POP, economy, production và politics trong một commit lớn.

## 13. Việc cần review/owner decision trước code

- Claude độc lập rà soát schema proposal, nhất là việc giữ Region aggregates làm read model và cách migration legacy save.
- Owner chấp nhận phạm vi S1 và các rủi ro save/device trước khi bắt đầu S1; review R4e/R4d không tự mở S1.
- Owner quyết định chính sách về age/occupation fallback và dữ liệu nguồn cần Hydrogen nghiên cứu.
- Chỉ sau các quyết định trên mới lập implementation task cụ thể, chỉ rõ file code/test, base SHA và acceptance gates.
- Nếu cần thay đổi normative roadmap hoặc spec, phải cập nhật có decision trace; không tự sửa roadmap v3.2 trong proposal này.

**Kết luận:** Đây là đường kỹ thuật khả thi để chuyển hệ dân số hiện tại từ region totals + strata shares sang cohort simulation có thể kiểm chứng, đồng thời không tạo fake hiring/wages và không làm mất tính xác thực lịch sử. Nó chuẩn bị cho Victoria 3-like systemic depth nhưng không tuyên bố parity đã đạt.
