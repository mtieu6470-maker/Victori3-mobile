# Kiểm toán độ phủ benchmark toàn cầu — S22

**Ngày:** 19/11/2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Trạng thái:** RESEARCH_ONLY / CHATGPT_SOURCE_AUDIT / NO_RUNTIME_PATCH

## 1. Kết luận điều hành

Bộ benchmark đang commit trong repository **chưa đủ để kiểm định trọn giai đoạn 1836–1936 và chưa đại diện đầy đủ 181 entity của game**. Tuy vậy, khoảng trống 1915–1936 không nên được kết luận là không có dữ liệu lịch sử: nguồn bên ngoài hiện có các bộ dữ liệu lớn hơn đáng kể.

- Checked-in CoW extracts có sáu field, 3.161 raw observations, 59 entity IDs và 17 mốc năm từ 1816 đến 1914. Builder chỉ compile bốn field (2.356 observations) và bỏ 805 observations về urban population / military expenditure.
- CoW Project hiện công bố NMC v7.0 với sáu chỉ tiêu annual từ 1816–2022. Trang chính thức nhấn mạnh độ phủ và chất lượng thay đổi theo state và year; raw series không thể mặc định so sánh hoàn toàn đồng nhất. Tuy nhiên, Terms & Conditions của CoW cấm sử dụng dữ liệu cho hoạt động thương mại, cấm phân phối cho bên thứ ba nếu chưa có văn bản đồng ý của CoW director và data host, đồng thời yêu cầu xin phép đối với việc phổ biến/đăng tải/sử dụng khác. Vì vậy NMC v7.0 được nâng trạng thái thành `RIGHTS_REVIEW_REQUIRED`: chỉ giữ metadata/coverage audit trong lúc chờ quyền; không đưa giá trị hoặc dữ liệu dẫn xuất vào APK/data pack trước khi có chấp thuận bằng văn bản.
- Maddison Project Database 2023 công bố GDP per capita và population cho 169 countries và aggregate regions, 1 AD–2022. Trang GGDC nêu rõ giấy phép CC BY 4.0 và quy tắc attribution/citation; đây là ứng viên macro phù hợp nhất hiện xác minh được quyền ở cấp metadata. Tuy nhiên, tải workbook chính thức bị chuyển hướng sang signed object-store URL không truy xuất được trong phiên này, nên chưa có row-level audit. Không được tuyên bố đã kiểm tra đủ 169 unit hay coverage 1836–1936.
- Maddison Database 2010 hiện có dữ liệu trong repository nhưng trang phát hành chính thức được kiểm tra không hiển thị giấy phép rõ ràng. Không áp dụng ngược CC BY 4.0 của MPD 2023 cho bản 2010; phải xác minh quyền riêng trước khi phát hành dữ liệu này trong game.
- GGDC Historical National Accounts là nguồn phụ tiềm năng cho sản lượng ngành: trang chính thức liệt kê GDP current/constant prices, agriculture/mining/manufacturing/industry, một số country series và World Agriculture 1800–1938. Tuy nhiên coverage theo nước/năm không đồng nhất và trang datahub không nêu licence tái sử dụng; cần quyền/điều khoản rõ trước khi tái phân phối.
- Historical Financial Statistics (HFS) bao phủ nhiều loại dữ liệu tài chính/kinh tế từ khoảng 1500–1950, nhưng trang chủ nêu rõ có hạn chế tái sử dụng dữ liệu trong cả database phi thương mại lẫn thương mại. Không nhập dữ liệu HFS vào game/package trước khi kiểm tra điều khoản và xin quyền khi cần.

**Khuyến nghị:** dùng MPD 2023 làm ứng viên ưu tiên cho macro GDP/population sau khi lấy được file chính thức và hoàn tất row-level/source-sheet/crosswalk audit; giữ nguyên phiên bản 2010 để so sánh, không nối hai bản thành một series. MPD 2010 đã có trong repository nhưng chưa được xác minh quyền, do đó không mặc định đưa các giá trị này vào bản phát hành. GGDC HNA là nguồn phụ tốt cho sector output và agriculture, nhưng rights review + provenance per-series là điều kiện trước khi dùng/đóng gói. Giữ CoW NMC v7 và HFS ở trạng thái rights hold. Không ép dữ liệu modern country units thành 1836 polities.

## 2. Phương pháp và phạm vi

Đã parse trực tiếp JSON checked-in:
- `historical_data/population/cow_nmc_population.json`
- `historical_data/military/cow_nmc_military.json`
- `historical_data/economy/cow_nmc_industry.json`
- `historical_data/population/maddison_2010.json`
- `historical_data/economy/maddison_2010_gdp.json`
- `historical_data/political_entities/registry.json`

Đã kiểm tra builder:
- `tools/build-data.ts` chỉ đưa `population.total`, `military.personnel`, `economy.iron_steel_kt` và `economy.primary_energy_kt_coal_eq` vào `HistoricalDB.benchmarks`.
- Urban population và military expenditure có trong input nhưng không được chọn.
- Khi compile, builder chỉ giữ `entity, field, date, value, quality`; không giữ unit, raw source locator, method, note hoặc uncertainty.
- `src/engine/data/dbTypes.ts` khai báo benchmark record cũng chỉ gồm năm trường trên.
- CoW records có locator ở raw input; việc metadata biến mất xảy ra ở compile step, không phải vì raw input không có nguồn.
- Tất cả 59 entity IDs trong CoW extracts hiện khớp ID một entity trong registry, nhưng ba entity có series không có CoW numeric code trong registry (ROM, NOR, ETH); đồng thời năm entity có CoW code trong registry nhưng không có observation trong ba extract đã kiểm (AFG, LUX, TRN, OFS, COS). Cần reconciliation, không tự sửa ID.
- 59 entity có series gồm 47 sovereign, 5 subject và 7 future. Không có đại diện đầy đủ cho các decentralized/local non-state actors chỉ từ tập CoW này.
- Maddison 2010 records dùng tên present-day units, không có direct entity-ID match với registry. Không được cộng các record này như historical 1836 polity totals.

## 3. Kết quả checked-in data

### 3.1. CoW input series

| Metric | Raw observations | Entities | Date points | Quality profile | Runtime compiled? |
|---|---:|---:|---:|---|---|
| Total population | 612 | 59 | 17 (1816–1914) | 368 verified / 115 supported / 129 estimated | Yes |
| Urban population >100k | 385 | 40 | 17 (1816–1914) | 385 supported | No |
| Military personnel | 596 | 59 | 17 (1816–1914) | 179 verified / 417 supported | Yes |
| Military expenditure | 420 | 55 | 17 (1816–1914) | 420 supported | No |
| Iron and steel | 612 | 59 | 17 (1816–1914) | 183 verified / 429 estimated | Yes |
| Primary energy | 536 | 50 | 17 (1816–1914) | 505 verified / 31 estimated | Yes |

The 17 observation years are: 1816, 1820, 1830, 1836, 1840, 1845, 1850, 1855, 1860, 1865, 1870, 1875, 1880, 1890, 1900, 1910 and 1914. These are sparse historical snapshots, not annual continuous series.

- Total raw CoW observations across the three checked-in files: 3,161.
- Currently compiled observations: 2,356.
- Omitted from compiled benchmark: 805 (385 urban population + 420 military expenditure).
- Current compile retains only 4 of 6 CoW indicator families.
- Every raw row in these six fields has a source locator in the checked-in extract, but those locators/units/methods are dropped in the compiled benchmark object.

### 3.2. Maddison 2010 input series

| Metric | Observations | Units | Date points | Quality | Territorial basis |
|---|---:|---:|---:|---|---|
| Population | 574 | 94 | 11 (1820–1913) | All estimated | Present-day territories |
| GDP per capita | 365 | 66 | 11 (1820–1913) | All estimated | Present-day territories |

Observation years: 1820, 1830, 1836, 1840, 1850, 1860, 1870, 1880, 1890, 1900 and 1913. Population values use thousand persons; GDP per capita uses 1990 international Geary-Khamis dollars. These are not historical-polity totals without an explicit allocation/crosswalk.

### 3.3. Registry reconciliation

- Political entity registry: 181 entities.
- Registry entities with a CoW code: 61.
- CoW input extracts contain observations for 59 entity IDs.
- Extract entity IDs not assigned a CoW code in registry: ROM, NOR, ETH.
- Registry entities assigned a CoW code but absent from the three extracts: AFG, LUX, TRN, OFS, COS.
- The 59 entities with CoW records resolve to 47 sovereign, 5 subject and 7 future entities in the current registry.
- The benchmark set does not cover the full registry and should not be called a global polity-complete dataset. In particular, decentralized placeholders and collective/local authorities need separate research paths.

## 4. External source candidates and implications

### 4.1. CoW National Material Capabilities v7.0

Official CoW page states NMC v7.0 has annual values for six components — total population, urban population, iron/steel production, energy consumption, military personnel and military expenditure — from 1816 to 2022. It offers an abridged series and a supplemental source/quality dataset. It also cautions that data amount and quality vary by state and year, and component-specific idiosyncrasies limit cross-time comparability.

**Implication:** the checked-in 17-year rows are not enough to prove the current CoW NMC v7 source has no observations after 1914. The data team should compare the exact NMC v7 download/codebook/supplement against repo rows, determine whether the extract was deliberately thinned or based on an earlier subset, then import only with row-level source, quality, unit and anomaly metadata.

Official source: https://correlatesofwar.org/data-sets/national-material-capabilities/

### 4.1.1. Quyền sử dụng và phân phối CoW (đã kiểm tra 19/11/2026)

Trang Terms & Conditions chính thức của CoW quy định dữ liệu không được dùng cho hoạt động thương mại hoặc hoạt động tạo lợi nhuận tài chính; người dùng không được phân phối dataset cho bên thứ ba nếu chưa có **văn bản đồng ý của CoW director và data host**; đồng thời phải xin phép cho việc phổ biến, đăng tải hoặc cách sử dụng khác ngoài các trường hợp được cho phép. Vì vậy file tải miễn phí không thể được coi là dữ liệu có giấy phép mở.

**Quy tắc an toàn cho Victori3 Mobile:** đánh dấu `cow_nmc_v7` là `RIGHTS_REVIEW_REQUIRED`. Trong khi chờ quyền, chỉ ghi nhận metadata công khai và phạm vi mô tả; không tải dữ liệu, không chép/biến đổi giá trị, không đưa giá trị/derived rows vào runtime, APK hay data pack. Trước khi xem xét bất kỳ việc dùng hoặc phân phối nào, chủ dự án cần có xác nhận bằng văn bản của đúng các bên CoW nêu và kiểm tra rõ phạm vi đó bao phủ mục đích sử dụng của trò chơi, việc biến đổi dữ liệu và phân phối cho người chơi. Nếu không có quyền phù hợp, loại nguồn khỏi sản phẩm và chọn nguồn có điều khoản tương ứng.

Nguồn chính thức: https://correlatesofwar.org/data-sets/ (Terms and Conditions, truy cập 19/11/2026). NMC v7 page: https://correlatesofwar.org/data-sets/national-material-capabilities/ (mốc 1816–2022, sáu chỉ tiêu và cảnh báo chất lượng/khả năng so sánh, truy cập 19/11/2026).

### 4.2. Maddison Project Database 2023

The Groningen Growth and Development Centre states MPD 2023 covers 169 countries and aggregate regions, 1 AD–2022, with GDP per capita and population estimates. The official release page links to Dataverse DOI 10.34894/INZBF2 and specifies CC BY 4.0; it requires the dataset citation and citations to original papers for selected uses/subsets.

**Implication:** likely a stronger macroeconomic/population benchmark foundation than the checked-in Maddison 2010 files. However, it is still a country/aggregate-region dataset, with estimation and territorial definitions that must be mapped carefully to the 1836 game registry. Do not assume every historical polity has an independent series or that values are directly available for each region.

Sources:
- https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023?lang=en
- https://research.rug.nl/en/datasets/maddison-project-database-2023/
- Dataset DOI: https://doi.org/10.34894/INZBF2
- Paper: Bolt & van Zanden (2024), DOI 10.1111/joes.12618

### 4.2.1. Kiểm tra quyền và khả năng truy xuất MPD 2023 (19/11/2026)

Trang GGDC công bố MPD 2023 do Jutta Bolt và Jan Luiten van Zanden biên soạn, bao phủ 169 quốc gia đến 2022; trang research portal mô tả cả country và aggregate-region series. Trang phát hành chỉ định CC BY 4.0. Theo điều kiện giấy phép CC BY 4.0, có thể chia sẻ và chuyển đổi kể cả cho mục đích thương mại nếu đáp ứng attribution, chỉ rõ thay đổi và không hàm ý endorsement. GGDC có yêu cầu citation bổ sung: cite bài Bolt & van Zanden (2024), DOI 10.1111/joes.12618; cite các original papers trong source sheet khi biểu diễn dữ liệu bằng đồ thị hoặc khi dùng subset dưới 12 countries cho phân tích/mục đích khác.

**Giới hạn đã xác minh:** click Excel từ trang chính thức chuyển tới dataverse.nl/api/access/datafile/421302, sau đó redirect sang URL ký tạm thời tại objectstore.surf.nl; cả truy xuất qua công cụ web và download thử trong phiên đều không lấy được tệp. Stata link cũng chưa được kiểm tra row-level. Vì vậy không có hash file do nhóm tự tính, sheet inventory, exact row counts, exact year coverage, source-sheet inventory hay crosswalk nào được tuyên bố. Chưa dùng bản mirror bên thứ ba thay cho bản phát hành chính thức.

Nguồn:
- GGDC release: https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023?lang=en
- Research portal: https://research.rug.nl/en/datasets/maddison-project-database-2023/
- DOI: https://doi.org/10.34894/INZBF2
- CC BY 4.0 deed: https://creativecommons.org/licenses/by/4.0/
- Paper: Bolt & van Zanden (2024), https://doi.org/10.1111/joes.12618

### 4.2.2. Maddison Database 2010 — legacy licence not established

Trang phát hành GGDC của Maddison Database 2010 xác nhận đây là bản cuối do Angus Maddison cung cấp, gồm population, GDP và GDP per capita từ AD 1–2008 và cung cấp Excel downloads. Tuy nhiên, trang đã kiểm tra không hiển thị licence statement tương tự những trang MPD 2018/2020/2023. Bởi vậy **không được suy diễn** licence CC BY 4.0 của MPD 2023 (hoặc các release sau) áp dụng hồi tố cho Maddison 2010.

Repository hiện có historical_data/population/maddison_2010.json và historical_data/economy/maddison_2010_gdp.json. Chưa thay đổi/xóa các file này trong research-only slice. Cần xác định chính xác nguồn gốc, file/release, rights của giá trị dữ liệu và phương án thay thế được cấp phép trước khi phân phối chúng trong APK/data pack.

Nguồn chính thức: https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-database-2010?lang=en

### 4.2.3. GGDC Historical National Accounts — sectoral-output candidate

Official GGDC HNA datahub mô tả GDP ở giá hiện hành và giá cố định, có phân rã ngành. Danh mục liệt kê nhiều chuỗi country-specific với thời đoạn không giống nhau: ví dụ Belgium 1835–1990, France 1815–1938, Netherlands 1807–1939, United Kingdom 1855–1965, United States 1869–1957, India (undivided) 1873–1947, Japan 1885–1940; ngoài ra có World Agricultural Production 1800–1938 và All Countries overview khoảng 1870–2005 cho agricultural, mining, manufacturing và industry output.

Đây là nguồn **bổ sung theo chuỗi cụ thể**, không phải một panel đồng nhất cho toàn thế giới: nhiều nước game không có chuỗi, năm bắt đầu/kết thúc khác nhau, đơn vị/giá cơ sở/industry classification cần rà soát. HNA yêu cầu citation Smits, Woltjer & Ma (2009), GD-107; trang datahub đã xem không hiển thị licence tái sử dụng/phân phối. Vì thế đánh dấu GGDC HNA là RIGHTS_REVIEW_REQUIRED, không tải/nhập/đóng gói cho đến khi rights được xác minh.

Nguồn:
- Official datahub: https://www.rug.nl/ggdc/historicaldevelopment/na/?lang=en
- Research portal metadata: https://research.rug.nl/en/datasets/ggdc-historical-national-accounts/
- Required citation: Smits, Woltjer & Ma (2009), GD-107.


### 4.3. Historical Financial Statistics (HFS)

The Center for Financial Stability describes HFS as a free, noncommercial historical data collection focused roughly on 1500–1950, with about 150,000 annual and more than 2 million higher-frequency observations. Coverage includes exchange rates, bank balance sheets, interest rates, money supply, inflation, international trade, government finance and national accounts. Its site explicitly states reproduction restrictions for both commercial use and noncommercial database use.

**Implication:** excellent discovery/index candidate for fiscal, trade and monetary histories across the 1836–1936 period, but not a free-to-repackage game-data source. Record source-specific copyright/permission and locator details; do not ingest bulk values into the product without rights review.

Sources:
- https://centerforfinancialstability.org/hfs.php
- https://centerforfinancialstability.org/hfs/Data_notes.pdf

## 5. Gaps and recommended next actions

1. Acquire/review official CoW NMC v7.0 abridged + supplemental, compare each of the six current metrics and 1816–2022 coverage to the checked-in extracts; preserve source/quality/anomaly information.
2. Retrieve the official MPD 2023 workbook/Stata file through an accessible official route; validate file hash, all sheets, variable definitions, missingness, exact country/year coverage and source-sheet citation requirements; compare as a separate release against Maddison 2010. Resolve legacy 2010 rights independently.
3. Review GGDC Historical National Accounts series, sector definitions, country/time coverage and rights; use only after explicit rights clearance.
4. Obtain the 12 macro-region taxonomy and assign each registry entity/strategic region with temporal validity; this audit cannot compute region-level coverage without that canonical map.
5. Add all 181 game registry entities to a coverage matrix, including explicit missing rows. Distinguish sovereign, subject, future, decentralized, aggregate, rebel, colonial/company and local actors.
6. Treat 1915–1936 as an identified gap in current checked-in files, not as an absence of world historical data.
7. Research missing calibration dimensions: trade/commodity output, public finance, wages/prices, health/mortality, literacy/education, migration, transport/infrastructure, technology and military expenditure/organization.
8. Do not create single composite historical-fidelity scores until dimension coverage, units and uncertainty are transparent. Regional coverage deficits must be visible.
9. Keep the source inventory/research stage separate from runtime adoption; source licensing, data rights, owner acceptance and ETL validation are mandatory.

## 6. Limitations

- Counts above are exact for the five checked-in source JSON files inspected, not a complete external-source survey.
- Source presence is not evidence comparability; quality tags and interpolation methods require full codebook review.
- Registry entity-ID reconciliation does not establish historical boundary equivalence.
- No macro-region coverage figures are claimed because the inspected standard specifies twelve macro-regions but does not enumerate their taxonomy/mapping in the section reviewed.
- No external dataset was imported into the repository's canonical source registry or product data.
- MPD 2023 row-level workbook audit is blocked by official Dataverse→SURF signed-object redirect; no third-party mirror was treated as canonical.
- GGDC Historical National Accounts is catalogued from official metadata only; no underlying workbook was read, and no reuse licence was established on the landing page.
- The official Maddison 2010 page inspected shows no explicit licence statement; existing repository values remain a separate rights-review item.
- No code, tests, build or device operation were changed/run in this audit.


### Retrieval limitation (19/11/2026)

A direct workbook retrieval was attempted through the official Groningen/Dataverse Excel link. Dataverse redirected to a time-limited signed SURF object-store URL that could not be downloaded in this session. Therefore:
- MPD 2023 coverage statements in this review are based on the official dataset metadata/release documentation only.
- No row-level workbook parsing, entity crosswalk or metric coverage count for MPD 2023 is claimed.
- Hydrogen is explicitly asked to obtain and inspect the workbook/codebook/source sheet independently, or report an access blocker and exact file metadata.
