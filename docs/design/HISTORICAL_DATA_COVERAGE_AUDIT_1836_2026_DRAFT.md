# HISTORICAL DATA COVERAGE AUDIT — CAMPAIGN 1836–2026

**Ngày audit:** 2026-11-20  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch snapshot:** experiment/owner-authorized-clock-runtime  
**Snapshot HEAD:** 713a6f0177a36d818d27876c498fa53f44d6899c  
**Trạng thái:** READ-ONLY AUDIT — không thay đổi dữ liệu game hoặc ETL  
**Mục đích:** phân biệt dữ liệu mà nguồn gốc tuyên bố có thể cung cấp, dữ liệu thực sự đã materialize trong repository, dữ liệu ETL đưa vào HistoricalDB và dữ liệu runtime thực sự sử dụng.

---

## 1. Kết luận điều hành

Repository hiện có nền dữ liệu khởi đầu 1836 khá đáng kể, nhiều nguồn học thuật/dataset được ghi provenance và một số timeline lịch sử. Tuy vậy, dữ liệu hiện tại **chưa đủ để chạy campaign lịch sử 1836–2026**.

Khoảng trống quan trọng không chỉ là thiếu file. Có ba tầng khác nhau:

1. **Source metadata:** nguồn gốc có thể bao phủ một khoảng thời gian dài hơn.
2. **Repository extract:** các bản ghi thực tế đã được tải/ETL vào historical_data có thể ngắn hơn source metadata.
3. **Runtime integration:** dù file tồn tại, build-data có thể không đọc nó; hoặc builder có đọc nhưng chỉ dùng để tạo mốc khởi đầu 1836, không cập nhật trạng thái thế giới theo thời gian.

Ví dụ điển hình: Source Register ghi COW National Material Capabilities (NMC) 1816–2016, nhưng các extract population/industry/military hiện trong repository chỉ có 17 mốc năm và kết thúc 1914. COW State System Membership có bản ghi tới 2024 nhưng builder hiện không đọc file này. COW territorial transfers có 414 records 1816–1914 nhưng builder cũng không đọc file này. COW war data có 291 records nhưng builder không nhập file chiến tranh này vào DB runtime.

**Đánh giá hiện tại:** dữ liệu khởi đầu 1836 có thể dùng để tạo một sandbox grand-strategy thế kỷ 19 có nhiều khoảng trống định lượng; chưa có historical world model liên tục cho 1914–2026, và chưa có dataset hiện đại đủ để biện minh cho terminal year 2026.

Không nên mở rộng campaign runtime bằng cách chỉ đổi GAME_END_YEAR sang 2026. Cần time-valid country/region model, dữ liệu theo năm, event/treaty timeline, technology/institution histories và migration/save contracts trước.

---

## 2. Phương pháp và ranh giới audit

Audit này đã đọc trực tiếp các file nguồn/ETL/runtime trên branch snapshot nêu trên:

- historical_data/sources/sources.json
- historical_data/political_entities/registry.json
- historical_data/political_entities/cow_system_membership.json
- historical_data/borders/regions_1836.csv
- historical_data/borders/historical_ownership_changes.json
- historical_data/borders/cow_territorial_changes_1816_1914.json
- historical_data/diplomacy/cow_alliances_1816_1914.json
- historical_data/events/cow_wars_1816_1914.json
- historical_data/events/historical_events.json
- historical_data/events/milestones.json
- historical_data/leaders/heads_of_state.json
- historical_data/population/population_totals_1836.json
- historical_data/population/cow_nmc_population.json
- historical_data/population/maddison_2010.json
- historical_data/economy/cow_nmc_industry.json
- historical_data/economy/cow_nmc_military.json
- historical_data/economy/maddison_2010_gdp.json
- historical_data/technologies/technologies.json
- tools/build-data.ts
- src/engine/data/db.ts
- src/engine/init.ts
- src/engine/historical.ts
- src/engine/simulation.ts
- docs/audit/s0/S0_GLOBAL_DATA_AUDIT.md

Audit không tải lại nguồn bên ngoài, không xác nhận giấy phép mới, không thay đổi source register, không chỉnh ETL và không thay đổi generated DB. Mọi khoảng thời gian dưới đây là khoảng dữ liệu đã quan sát trong repository, không phải cam kết rằng nguồn bên ngoài hiện có đầy đủ dữ liệu cho mọi quốc gia/năm.

---

## 3. Độ phủ thực tế theo dataset

| Miền dữ liệu | Dữ liệu thực trong repository | Khoảng thời gian thực quan sát được | Tình trạng ETL/runtime |
|---|---|---|---|
| Political entity registry | 181 entities; 147 playable; 19 future; 4 part_of | Hist_from từ các mốc cổ đại đến 1878; hist_to muộn nhất 1975 | Builder đọc registry để tạo entity mở đầu; registry là mô tả/validity metadata, không tự tạo đầy đủ lịch sử thay đổi quốc gia |
| Country opening profiles | 136 core profiles: Europe 62, Asia/Africa 59, Americas 15; 11 detailed country profiles | Chủ yếu là snapshot và historical context quanh 1785–1835, 1801–1835, 1814–1835; detailed files ghi as_of 1836-01-01 | Builder đọc để tạo trạng thái ban đầu; không phải chuỗi hồ sơ hàng năm |
| World regions/map | regions_1836.csv có 662 region records trong build hiện tại | 1836-01-01 snapshot | Builder đọc CSV làm geography, owner, population weight, culture/religion và resource khởi đầu; không phải lịch sử biên giới/địa hình động |
| Population start totals | 80 benchmark groups, population_totals_1836.json | 1836 | Builder phân bổ tổng nhóm vào vùng 1836; vùng không nằm trong nhóm giữ provisional weight và nhãn missing |
| COW NMC population | 997 records, 59 entities | 17 năm: 1816, 1820, 1830, 1836, 1840, 1845, 1850, 1855, 1860, 1865, 1870, 1875, 1880, 1890, 1900, 1910, 1914 | Builder đọc records, lọc một số fields vào benchmark DB; không phải population cohort time-series runtime được áp dụng từng năm |
| COW NMC industry | 1,148 records, 59 entities | Cùng 17 mốc năm, kết thúc 1914 | Builder đọc; chỉ một số chỉ tiêu (steel/energy) được giữ trong benchmark table |
| COW NMC military | 1,016 records, 59 entities | Cùng 17 mốc năm, kết thúc 1914 | Builder đọc; personnel được giữ trong benchmark table, chưa phải order-of-battle/equipment inventory |
| Maddison GDP | 365 records, 66 named units | 1820–1913 | Builder dùng để ước tính GDP/người 1836 theo mapping đơn vị lãnh thổ hiện đại và interpolation; không nhập toàn chuỗi GDP lịch sử cho runtime settlement |
| Maddison population | 574 records, 94 named units | 1820–1913 | Dùng làm trọng số/đầu vào cho proxy 1836; không phải time-varying polity population series |
| Historical ownership changes nội bộ | 71 changes | 1836-03-02 đến 1898-12-10 | Builder đọc và nạp historical_changes. HistoricalDB có helper truy vấn owner theo ISO date; comment trong DB API ghi rõ helper này không được dùng để drive simulation |
| COW territorial transfers | 414 records | 1816–1914 | File có mặt nhưng tools/build-data.ts không đọc file này; chưa vào HistoricalDB/runtime |
| COW State System Membership | 64 records | 1816–2024 | File có mặt nhưng tools/build-data.ts không đọc file này; chưa tạo lifecycle state membership trong runtime |
| COW formal alliances | 97 records | Records kết thúc muộn nhất 1921 | Builder đọc file và chỉ giữ alliance đang active tại ngày bắt đầu 1836 để tạo starting treaties; không replay toàn bộ alliance lifecycle |
| COW wars | 291 records | 1816-08-26 đến 1920-07-28 | File có mặt nhưng tools/build-data.ts không đọc file này; historical_events.json chỉ cung cấp initial wars có chọn lọc |
| Historical event script | 8 initial wars, 9 exogenous events, 19 decision windows và structural rules | 1763-01-01 đến 1888-10-15 trong các ngày được quan sát | Builder đọc và đưa vào HistoricalDB; không phải bộ lịch sử liên tục tới 2026 |
| Historical milestones | 40 milestones | 1838–1891 | Builder đọc thành DB milestones; không thay thế dataset lịch sử đầy đủ và không phủ các thế kỷ 20–21 |
| Heads of state | 93 entity keys, 439 leader records | Mốc dated record quan sát từ 1787 đến 1948-09-04 | Builder nạp danh sách leader; runtime có lookup theo date cho một số luồng tạo nation, nhưng độ phủ chỉ 93/181 registry entities |
| Technologies | 38 nodes: production 16, society 10, military 12 | historical_year từ 1780 đến 1913 | Builder nạp technology tree; chưa có công nghệ hậu 1913 trong dataset đang dùng |

### 3.1. Không đồng nhất metadata với extract

Source metadata trong sources.json khai báo một số phạm vi dài hơn:

- COW NMC v7: 1816–2016.
- COW State System Membership v2024: 1816–2024.
- COW Major Powers v2024: 1816–2024.
- COW Formal Alliances v4.1: 1816–2012.
- COW wars: 1816–2007.
- COW territorial changes v6: 1816–2018.
- Maddison 2010: source period 1–2008.

Những dải trên mô tả nguồn/dataset, không chứng minh rằng bản extract hiện trong repository có đủ record tới năm cuối, càng không chứng minh builder/runtime đã sử dụng. Ví dụ NMC extracts chỉ materialize năm đến 1914; Maddison extracts hiện có GDP và population đến 1913.

Trước khi lập kế hoạch tải bổ sung, phải kiểm tra phiên bản nguồn, định dạng, license/redistribution, schema, quality codes và country/territory crosswalk. Không được tự kéo source metadata period vào làm coverage của game.

---

## 4. ETL và runtime: dữ liệu nào thực sự được sử dụng

### 4.1. Mô hình khởi đầu hiện tại

tools/build-data.ts hiện đọc registry, regions_1836.csv, population_totals_1836.json, country profiles, COW NMC population/industry/military, Maddison GDP/population, technologies, alliances, historical_events, leaders, historical_ownership_changes và milestones.

init.createGame() tạo GameState tại 1836-01-01, tick 0. Historical và Sandbox cùng khởi đầu từ cùng historical world; Sandbox không phải một world model riêng.

### 4.2. File hiện diện nhưng chưa được ETL

Các file dưới đây đang có trong historical_data nhưng không có đường đọc tương ứng trong tools/build-data.ts tại snapshot audit:

- political_entities/cow_system_membership.json
- borders/cow_territorial_changes_1816_1914.json
- events/cow_wars_1816_1914.json

Do đó không được mô tả rằng game runtime đã có đầy đủ state membership, territorial transfers hay COW war chronology chỉ vì các JSON tồn tại trong repository.

### 4.3. File có được đọc nhưng chỉ dùng làm starting state

- COW alliances: builder lọc các pact active tại START = 1836-01-01; không áp dụng tất cả treaty start/end khi calendar tiến qua các năm sau.
- Population totals 1836 và regions_1836.csv: tạo ownership/population baseline; không phải các mốc dân số theo từng năm.
- Maddison GDP/population: dùng như input để tạo GDP/người proxy tại 1836; mapping dùng lãnh thổ hiện đại làm proxy cho polity 1836 và phải giữ nhãn estimated.
- Country profiles: mở rộng dữ kiện cho start scenario; không phải state snapshots 1870/1914/1945/1991/2026.

### 4.4. Historical helper không đồng nghĩa simulation timeline

HistoricalDB có historicalOwnerAt(ISO date) và leader lookup. Comment của historicalOwnerAt ghi rõ helper phục vụ truy vấn lịch sử và không được dùng để drive simulation. GameState region owner vẫn xuất phát từ 1836 CSV; simulation.ts hiện chạy monthly pipeline với GAME_END_YEAR = 1936.

Cần có một timeline event/state-transition scheduler thực sự để apply country formation/dissolution, border changes, treaties, leader succession và institutional changes vào live GameState. Không được chỉ hiển thị một lịch sử tham chiếu rồi tuyên bố simulation đã xử lý lịch sử đó.

---

## 5. Existing quality audit — giới hạn dữ liệu khởi đầu 1836

S0_GLOBAL_DATA_AUDIT.md (snapshot audit file SHA 338a624d6a3722fd45db7c529b99b7abe3503c1a) ghi coverage cho 274 entity records:

| Trường | Sourced | Estimated | Default | Missing | Nhận xét |
|---|---:|---:|---:|---:|---|
| Population | 22 | 96 | 0 | 156 | Độ phủ rất không đồng đều |
| Head of state | 122 | 6 | 0 | 141 | Có 5 facts gắn nhãn supported nhưng thiếu source |
| Army | 27 | 5 | 242 | 0 | Phần lớn là default theo population |
| Literacy | 0 | 9 | 265 | 0 | Gần như toàn bộ là default suy từ luật giáo dục |
| Laws | 12 | 262 | 0 | 0 | Hầu hết là interpretive estimate/preset |
| GDP per capita 1836 | 0 | 109 | 0 | 165 | Không có record sourced theo định nghĩa audit này |

Chỉ 20,2% dân số khởi đầu có nhãn population verified/supported; 60,3% nằm trong vùng uncertain và 5,9% missing. Châu Phi hạ Sahara có 84,8% dân số vùng nhãn missing; 51/65 entities không có population; 50/65 không có head of state và 0/65 có GDP/người. Đây là số liệu của audit khởi đầu 1836, không phải coverage năm 2026.

Độ phủ hiện tại đủ cho một số nhóm scenario khai cuộc nhưng không thể dùng như một mô hình quốc gia/kinh tế toàn cầu có chất lượng đồng đều qua 191 năm.

---

## 6. Các blockers dữ liệu cho campaign 1836–2026

| ID | Blocker | Tác động | Deliverable cần có |
|---|---|---|---|
| HD-01 | Geography chỉ là region map 1836; thiếu dated border/topology changes hậu 1914 | Border/control/country area sai khi qua các era sau | Versioned temporal region ownership and boundary history |
| HD-02 | Registry chỉ có 181 entities; 106 explicit end trước 1937, 10 end 1937–1999, 0 end từ 2000 trở đi; 65 open-ended | Open-ended không chứng minh state tồn tại/đúng status tới 2026 | Country existence, rename, merger, dissolution, recognition and successor timeline |
| HD-03 | State membership v2024 file chưa ingest | Thiếu state-system entry/exit and recognition timeline | COW state membership integration + 2025/2026 source update |
| HD-04 | COW territorial transfers 1816–1914 chưa ingest; custom ownership changes chỉ đến 1898 | Thiếu territorial state transitions kể từ cuối thế kỷ 19, đặc biệt 20–21 | Temporal territorial transfer ETL, adjudication and region crosswalk |
| HD-05 | COW wars extract 1816–1920 chưa ingest; event scripts hiện dừng 1888 | War chronology, casualties, war participants and postwar settlement không đủ | War dataset integration plus post-1920 conflict/war sources |
| HD-06 | Alliance records chỉ được materialize ở treaties active 1836 | Không có treaty lifecycle; thiếu post-1836 diplomatic alignment | Treaty/organization/obligation contracts plus dated records |
| HD-07 | Economic and population historical series currently stop 1913 in Maddison files and 1914 in NMC extracts | Không có đủ national macro calibration cho 1914–2026 | Country-year macro datasets, consistent definitions and territorial crosswalk |
| HD-08 | Technology tree has 38 technologies ending 1913 | Không có computer, internet, semiconductor, nuclear, biotech, modern energy, robotics, AI, space/digital infrastructure etc in shipped dataset | Versioned technology taxonomy to 2026 with prerequisites/access/adoption/deployment |
| HD-09 | Leaders coverage 93/181 entities and ends 1948 in observed data | Không có complete leader succession for postwar/modern era | Dated leaders/governments dataset with uncertainty and source coverage |
| HD-10 | 1836 opening profile quality highly uneven | Simulation may start with large numbers of defaults/estimates | Targeted country/region research and explicit quality display |
| HD-11 | Historical ownership helper is not used to mutate simulation | Stored history cannot drive live campaign transitions | Deterministic transition/task runner and historical state application |
| HD-12 | No explicit 2025–2026 complete observation set | Terminal year may be modeled with stale statistics | 2025/2026 observation policy; distinguish latest actual data from estimates/projections |

---

## 7. Data acquisition and integration plan

### A1 — Freeze a data contract before ingesting more files

For every record require:
- stable entity/region identifier and crosswalk version
- variable, numeric/text value, unit, denominator and definition
- reference date or validity interval
- observation year vs publication year
- source identifier, locator and exact claim supported
- quality code and estimation/interpolation method
- uncertainty range/confidence and missingness reason
- license and redistribution/derivative rights
- ETL version and content hash

### A2 — Temporal world history

Build explicit histories for:
- state membership/existence and successor relationships
- territorial ownership/control and disputed claims
- leader/government/law/institution transitions
- wars, crises, ceasefires and peace settlements
- treaties, alliances, organizations and subject obligations
- infrastructure and industrial capacity changes

Every change needs date validity, source provenance and conflict-resolution policy. Do not apply records solely from name matching.

### A3 — Macro-historical observations

Separate real observed values, interpolated estimates, modeled values and scenario projections. GDP/population/industrial/military/energy series must not be merged across incompatible definitions without normalization metadata. Do not infer missing national data from a global average and label it sourced.

### A4 — Technology and institutions

Extend the current 38-node 1780–1913 tree only after a complete taxonomy, historical invention window, adoption/diffusion distinction, prerequisite, required input/skills/institutions, infrastructure, cost, uncertainty and gameplay effect are defined.

### A5 — Country and era coverage report

Before any modern historical content ships, report coverage by country x era x domain:
- existence/territory
- population/demography
- GDP/industry/energy/trade
- government/institutions/leaders
- diplomacy/treaties
- wars/military
- technology/access/adoption

A blank cell must be explicitly labelled missing, estimated or not applicable.

---

## 8. Priority and exit criteria

1. Establish A0 superseding 1836–2026 PRD/SRS and data contract; preserve frozen S0 master specification.
2. Audit country/region IDs and crosswalks; define temporal country/region timeline.
3. Ingest and validate state membership, territorial changes, wars and treaties in staged, versioned packs.
4. Expand macroeconomic/demographic series and calibrate observations by country and year.
5. Extend technology/institution content after provenance/legal review.
6. Only after Calendar v2 and deterministic cadence/save design is separately authorized, integrate these time-dependent records with the simulation scheduler.

Exit criteria for historical coverage:
- every modeled country has defined existence and status at every campaign date, or explicitly missing/unknown state
- every region has defined owner/control and boundary applicability at each relevant date
- every historical event has source, date, participants, effects and fallback behavior
- all quantitative records have unit, definition, observation year, quality and provenance
- data pack is hash-verified, reproducible and compatible with save/ruleset version
- no silent interpolation or extrapolation into 2026

---

## 9. Scope and authorization boundary

This document records a read-only audit and proposed data work packages. It does not authorize importing datasets into product runtime, changing historical_data, generated DB, schema, game content, assets, engine, event logic, save migration or Android package.

The existing owner authorization S1-CLK-01 remains limited to the monthly wall-clock scheduler experiment. B0/B1 calendar v2, six-hour logical ticks, save v2 migration, new data ingestion and Stream A historical content require separate scope authorization and review/owner disposition.

No claim is made that current data is complete through 2026, that the game has Victoria 3 historical parity, or that the current simulation replays the historical timeline stored in the repository.
