# Tái kiểm toán mức độ tương đồng Victoria 3 — 19/11/2026

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Exact audited HEAD:** `b18f0213ad4958ec95ff292d63ad661d010cffb1`  
**Latest code/test target:** `ebac2290878cf7e7046de108bf2bf30491909250` (commit tài liệu `b18f021` đứng sau, không đổi runtime code)  
**Previous parity snapshot:** `f0745f1fd1eb381434cba4aa8576b3c2271d8732` — 18/11/2026  
**Status:** `REPOSITORY_REAUDIT / SELF_AUDIT / NO_RUNTIME_PATCH`

> Đây là kiểm toán repository tại HEAD nêu trên, không phải Claude REVIEW_PASS hay owner ACCEPTED. Không sửa runtime code, historical data, save schema, UI, assets hoặc workflow trong lượt audit này. Các giai đoạn S7–S23 được AI_HANDOFF ghi là design-only/closed; audit không tự mở quyền triển khai.

## 1. Kết luận

**Chưa đạt gameplay parity với Victoria 3.** Dự án đã có engine mô phỏng thật và vòng thời gian tháng, không chỉ là UI mẫu. Tuy nhiên, độ sâu mô phỏng, mô hình dữ liệu và các chuỗi nguyên nhân-hậu quả còn thiếu nhiều hệ thống cốt lõi.

Bản kiểm kê 41 khu vực chức năng trước đó (18/11) có 3 PRESENT, 30 PARTIAL, 3 MISSING và 5 NEEDS_QA. Tái kiểm tra HEAD hiện tại cho thấy một số ô trong bản cũ đã lỗi thời: **xây dựng hiện có hàng đợi/dự án/progress/hủy và tách vốn nhà nước-tư nhân; lao động hiện có employment/wage aggregates theo vùng**. Cả hai vẫn chỉ là PARTIAL, không phải các hệ thống hoàn chỉnh kiểu V3.

Mục tiêu nên là **tương đồng cơ chế và chiều sâu gameplay**, không sao chép code, hình ảnh, văn bản hay dữ liệu độc quyền của Paradox.

## 2. Những phần đã có thật ở HEAD này

- **World/simulation:** pipeline tháng dùng chung cho Historical và Sandbox; có Observer; có 662 vùng trên nền địa lý hiện đại được dùng làm xấp xỉ, cùng registry chính thể lịch sử và lớp provenance.
- **Economy:** 12 goods, 10 building IDs, recipe nhà máy, sản xuất/tiêu dùng/nhập khẩu, giá thị trường quốc gia/customs union và giá thế giới, ngân sách, thuế, nợ, lãi.
- **Construction:** state/private projects, queue, progress, cancel, reserve/funding separation; AI ước tính lợi suất có xét nhân lực, đầu vào, bão hòa đầu ra và công suất công trình đang xây.
- **Employment:** engine tính employment và wages theo 9 strata ở cấp Region; wage tháng trước tác động đến purchasing power và dịch chuyển strata. Đây chưa phải job market/hiring ledger.
- **Society/politics:** dân số vùng, 9 strata share, literacy, SoL, famine/epidemic, migration, nationalism; 8 IG với clout/approval; 9 law groups, reform, revolution/secession.
- **Diplomacy/war:** relations, rivalry, alliance, guarantee, customs union, subjects cơ bản, war goals, national army/navy aggregates, battle/occupation/war score.
- **Technology/events:** cây tech, prerequisite/diffusion, historical decision windows, exogenous shocks, succession, chronicle/log.
- **AI:** budget, research, investment/construction, reform, diplomacy và war heuristics có personality/historical bias.

## 3. Khoảng trống lớn nhất so với Victoria 3

### P0 — phải làm trước khi gọi là game có chiều sâu V3

1. **Pop cohorts và needs:** hiện Region chỉ giữ tổng dân số + tỷ lệ strata. Thiếu cohort theo nghề/qualification, wealth, tuổi, culture/religion, discrimination, rights, needs basket, household consumption/savings và wealth distribution. Vì vậy giá hàng, lương và luật chưa tác động đúng đến từng nhóm dân.
2. **Production Methods + Building Sites:** chưa có PM để người chơi/AI đổi cách sản xuất; chưa có BuildingSite identity, operational state, đóng cửa/hư hại/tách-gộp site và unlock theo tech/era. Recipe hiện là vài công thức cố định. Chỉ số 10 building IDs không đủ đại diện nền kinh tế 1836–1936 toàn cầu.
3. **Goods ledger và thị trường:** thiếu inventory/stock-flow conservation đầy đủ, market hub/market area, buy/sell orders, local market access/price gradient và giao nhận hàng bị giới hạn bởi hạ tầng. Import abstraction không thay thế được trade route.
4. **Trade + logistics:** thiếu trade routes theo từng good, origin/destination, tariff/convoy cost, ports, sea lanes, transport capacity, blockades và bottlenecks đường sắt/đường thủy.
5. **Construction sector:** đã có queue và progress nhưng chưa có construction capacity/sector, weekly build rate, tiêu thụ vật liệu xây dựng, ưu tiên/đổi thứ tự theo capacity và tác động thiếu vật liệu lên tiến độ.
6. **Diplomatic Plays:** hiện có thể chuyển từ quan hệ/AI sang declareWar; chưa có lifecycle khủng hoảng từ demand → maneuver → sway/backing/neutrality → escalation hoặc peaceful settlement, obligations và negotiation.
7. **Warfare:** army/navy vẫn là số liệu tổng hợp cấp quốc gia. Thiếu formations/battalions, generals/admirals, fronts có đơn vị đóng quân, mobilization/conscription, battle order, logistics/supply depots, fleets/ship classes, convoy escort, naval invasion, blockade và straits. `warExhaustion` không thay thế được War Support riêng với nguyên nhân/hệ quả.
8. **Journal Entries:** có event windows/milestones/log nhưng chưa có Journal Entry tổng quát với objective, progress, conditions, branching, deadline, reward/penalty và history.
9. **Historical calibration:** có dữ liệu toàn cầu và nguồn, nhưng geography dùng hiện đại làm proxy; một số benchmark thiếu chuỗi/đơn vị/crosswalk địa lý. Không được coi mọi con số baseline là đã được hiệu chỉnh lịch sử.

### P1 — cần cho chiến dịch và chiều sâu xã hội/chiến lược

- **Ownership/companies:** chưa có firm/company, building owner, shareholders, dividends, reinvestment, nationalization/privatization và foreign investment.
- **Government/institutions:** thiếu authority/bureaucracy, institutional levels và coverage, taxation capacity, education/health/policing administration.
- **Political movements:** radicalism có nhưng chưa có movement entity với demands/support/leader/progress; party, election theo luật bầu cử, legislature/cabinet và political lobby còn thiếu.
- **Characters:** leader/head-of-state có, nhưng thiếu generic character framework cho politician, general, admiral, agitator, interest-group leader, appointment và traits/ideology.
- **Subjects/colonization:** quan hệ overlord/subject hiện đơn giản; thiếu autonomy, liberty desire, subject interactions, colonial claims/competition và local resistance.
- **Power Blocs:** chưa có bloc identity/principles, cohesion, leverage, membership benefits và influence.
- **Strategic interests/objectives:** chưa có mạng lợi ích chiến lược biển/khu vực, mục tiêu người chơi và pacing/campaign objectives đầy đủ.

### P2 / NEEDS_QA — hoàn thiện trải nghiệm mobile

- Map lenses còn thiếu market access, routes, culture/religion, infrastructure, fronts/naval routes/strategic interests đầy đủ.
- Cần end-to-end QA cho portrait/landscape, ledger search/filter/sort, contextual explanation, accessibility, notification/auto-pause.
- Visual assets (building sets, portraits, uniforms, reports) cần kiểm kê licensing/coverage và kiểm tra trong APK.
- Localization chưa đủ; kiểm tra tiếng Việt, tên lịch sử, ngày tháng, title và thuật ngữ.
- Android: chưa có bằng chứng device QA trên máy thật, long-campaign memory/thermal/battery, suspend/resume và save-recovery.

## 4. Những hiệu chỉnh phải áp vào ma trận cũ

| Khu vực | Trạng thái đúng tại HEAD | Lý do |
|---|---|---|
| Construction | PARTIAL — tiến bộ đáng kể | Có `ConstructionProject`, queue, progress, cancel và tách state/private funding; thiếu construction sector/capacity/material inputs |
| Employment & wages | PARTIAL — tiến bộ đáng kể | Có `Region.employment` và `Region.wages`; thiếu job contracts, qualifications, hiring/firing, unemployment market |
| Production Methods | MISSING | Không có PM entity/selector; recipe vẫn hard-coded |
| Diplomatic Plays | MISSING | Không có play/crisis/maneuver lifecycle; war declaration vẫn là hành động trực tiếp |
| Power Blocs | MISSING | Treaty types hiện chỉ alliance, guarantee, customs union; không có bloc model |
| War Support | PARTIAL | Có war exhaustion, chưa có support/willingness score và các nguồn thay đổi tương đương V3 |
| Ownership/Companies | PARTIAL | Có private investment pool, chưa có legal owner/company/shareholder/profit distribution |

## 5. Thứ tự phát triển đề xuất

Không làm UI trang trí trước. Cần xây các chuỗi mô phỏng có thể kiểm chứng:

1. **Population cohorts + needs + identity/rights** — nền tảng cho consumption, SoL, discrimination và political strength.
2. **Goods registry + inventory/flow ledger + market accounting** — bảo toàn vật chất, định lượng theo tháng, không tạo hàng hóa từ hư không.
3. **BuildingType + ProductionMethod + BuildingSite** — nhiều ngành nghề, multi-input/output, technology/era gates, capacity và site lifecycle.
4. **Employment/qualification + wage market + ownership/profit** — nối production tới thu nhập, wealth, IG clout, investment và thuế.
5. **Transport graph + ports/routes/convoys + local access** — nối thị trường với địa lý và chiến tranh.
6. **Institutions + movements + parties/elections + characters** — làm chính trị có tác nhân và hệ quả.
7. **Diplomatic Play + negotiation + strategic interests + Power Blocs** — ngoại giao trước chiến tranh.
8. **Formations/fronts/supply/fleets/War Support/peace terms** — quân sự thực sự thay cho national-strength abstraction.
9. **Journal Entry + world objectives + historical calibration** — campaign dài và khác biệt Historical/Sandbox có nguyên nhân.
10. **Mobile UI/visual/QA** — hiển thị đúng hệ thống sau khi engine và data ổn định.

Mỗi hệ thống chỉ được đánh dấu hoàn thành khi đủ: data schema → simulation effects → player/AI decision → integration/invariant tests → multi-decade deterministic run → UI explanation → Android device QA.

## 6. Quyết định và giới hạn

- Đây là **self-audit** tại HEAD hiện tại, chưa có Claude độc lập review.
- DEV-004 code target trước đó có CI 109/109 tests pass và Android debug APK build thành công; đây không chứng minh balance, device QA hoặc V3 parity.
- S7/S8, S10/S11, S15–S17, S18/S19, S20/S21, S22 và S23 đang được AI_HANDOFF ghi là design-only/closed hoặc chưa có runtime authorization. Không tự ý mở các phase đó bằng một yêu cầu audit chung.
- Không merge, không đổi default branch, không phát hành APK production.

## 7. Tham chiếu

- Repository parity snapshot 18/11: `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md` và `GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv`.
- Detailed economy/PM/transport/population design: `docs/spec/GOODS_MARKETS_TRANSPORT_ARCHITECTURE_PROPOSAL_VI.md`, `BUILDING_TYPES_PRODUCTION_METHODS_SITES_PROPOSAL_VI.md`, `POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`.
- Official Victoria 3 feature overview: https://www.paradoxinteractive.com/games/victoria-3/about
- Official Victoria 3 update announcements: https://store.steampowered.com/app/529340/
- Official The Great Wave expansion overview: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-the-great-wave
