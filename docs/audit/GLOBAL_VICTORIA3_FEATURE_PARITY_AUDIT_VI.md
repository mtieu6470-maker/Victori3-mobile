# Kiểm toán mức độ tương đồng Victoria 3 — Currents of History Mobile

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch audited:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Code baseline:** `f0745f1fd1eb381434cba4aa8576b3c2271d8732`  
**Ngày:** 18/11/2026  
**Mốc tham chiếu:** Victoria 3 public update 1.15 / hotfix 1.15.1 ngày 11/11/2026  
**Trạng thái:** `DOCUMENTATION_ONLY / CODEBASE_SNAPSHOT_AUDIT / NO_RUNTIME_PATCH`

## 1. Kết luận điều hành

Repository hiện đã có một **nền móng grand-strategy simulation thật**, không phải chỉ là giao diện giả lập: engine chạy theo tháng, có kinh tế/hàng hóa, dân cư, chính trị, công nghệ, ngoại giao, chiến tranh, sự kiện, AI và theo dõi lịch sử rẽ nhánh.

Tuy nhiên, code hiện tại **chưa đạt mức tương đồng gameplay với Victoria 3**. Khoảng cách lớn nhất nằm ở độ sâu và liên kết nhân quả của các hệ thống, không phải số lượng màn hình:
- Pop mới là tỷ lệ tầng lớp tổng hợp ở cấp region; chưa có Pop cohorts chi tiết theo nghề nghiệp, giàu nghèo, culture/religion, nhu cầu, quyền lợi và chính trị.
- Building/production còn ít loại và dùng recipe cố định; thiếu Production Methods lựa chọn được, tuyển dụng/sa thải, tiền lương, lợi nhuận và quyền sở hữu ở mức sâu.
- Market mới là country/customs-union market pha với world price; thiếu market hubs, route, convoy, access bottlenecks, local market price đầy đủ.
- Chính trị có 8 Interest Groups và 9 law groups, nhưng thiếu movement, agitation, party/election và institution capacity sâu.
- Ngoại giao có relations/rivalry/alliance/guarantee/customs union, nhưng chưa thấy full Diplomatic Play, sway/backing, obligations và Power Blocs.
- Quân sự có manpower, naval strength, regional front targets, battles và war score, nhưng chưa có mô hình formations/commanders/battalions/fleets/convoys/logistics tương ứng. War Exhaustion hiện tại không thay thế hoàn toàn War Support của V3 1.15.
- Decision windows, event, milestone và chronicle là nền tảng, chưa phải Journal Entry system đầy đủ với mục tiêu, tiến độ, nhánh, thời hạn và hậu quả.

Đánh giá tổng quát: **FOUNDATION PRESENT / CORE DEPTH PARTIAL / FULL VICTORIA 3 PARITY NOT ACHIEVED**.

## 2. Victoria 3 được dùng làm mốc thiết kế nào?

Trang chính thức của Paradox định nghĩa V3 xoay quanh Pops, xã hội, kinh tế và công nghiệp, thương mại, ngoại giao/chiến tranh và bản đồ động. Dev Diary #57 mô tả quan hệ cơ bản: Pops làm việc và nhận lương; building tiêu thụ/sản xuất goods, tuyển Pop, tạo lợi nhuận cho chủ sở hữu; lợi ích kinh tế của các nhóm Pop tạo Political Strength cho Interest Groups và Political Movements.

Mốc mới nhất được xác minh ở thời điểm audit là **Update 1.15 và hotfix 1.15.1 (11/11/2026)**. 1.15 bổ sung/điều chỉnh nhiều nội dung cho Nga cùng hệ thống War Support. War Support chạy từ 0–100, thay đổi theo việc tham chiến, trận đánh, chiếm đóng, tiến độ war goals, devastation, suy giảm kinh tế và thời gian chiến tranh; mức thấp làm dân cư radicalize, làm yếu quân đội và tăng liberty desire của subject belligerents. Hai bên cùng kiệt quệ có thể đi tới stalemate thay vì tự động capitulate.

Mục tiêu của dự án là tương đồng về **độ sâu gameplay và quan hệ nhân quả**, không sao chép mã, tài sản, văn bản, UI, âm nhạc, dữ liệu độc quyền hay DLC của Paradox. Đặc tả `docs/spec/MASTER_SPEC_VI.md` §1.4 cũng yêu cầu độc lập triển khai và tài sản.

## 3. Code hiện có — bằng chứng từ repository

Tại baseline trên:
- `src/engine/simulation.ts`: pipeline hàng tháng gồm economy, population, politics, secession, technology, diplomacy, military, events, AI và divergence.
- `src/engine/types.ts`: goods có 12 mục; buildings có 10 loại; population có 9 strata shares; Interest Groups có 8 loại cố định; war và treaty là các cấu trúc tổng hợp.
- `src/engine/systems/economy.ts`: có sản xuất vật chất, recipe đầu vào/đầu ra, demand, market/country/customs union và world price; recipe hiện cố định.
- `population.ts`: sinh/tử, famine/epidemic, dịch chuyển strata, literacy, migration và nationalism.
- `politics.ts`: clout/approval của 8 IG, legitimacy, radicalism, reforms và secession.
- `technology.ts`: cây tech có prerequisites, cost, historical year và diffusion.
- `diplomacy.ts`: quan hệ, rivalry, alliance, guarantee, customs union và can thiệp vào chiến tranh.
- `military.ts`: national manpower/navy strength, chọn target vùng, battles xác suất, occupation, casualties, war score và peace resolution.
- `events.ts`: shocks theo ngày, leader mortality/succession, republic elections và decision windows.
- `ai/ai.ts`: AI ngân sách, investment, construction, research, reform, diplomacy và war theo heuristic/personality/historical bias.
- `modes.ts`: hai mode cùng chạy một pipeline; Historical bật lớp dữ liệu lịch sử, Sandbox tắt các lớp đó.

Các con số 12 goods / 10 buildings / 9 strata / 8 IG là inventory từ enum/type hiện tại, không phải một thống kê toàn bộ content art hoặc data ngoài runtime.

## 4. Ma trận chi tiết

File đi kèm `GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv` đánh giá từng hệ thống theo bốn trạng thái:
- **PRESENT:** mechanic cốt lõi có đường chạy trong runtime.
- **PARTIAL:** đã có nền tảng nhưng thiếu độ sâu hoặc dữ liệu cần thiết.
- **MISSING:** chưa thấy hệ thống tương đương trong các cấu trúc/runtime được kiểm tra.
- **NEEDS_QA:** đặc tả có yêu cầu hoặc code có dấu hiệu hỗ trợ, nhưng chưa được chứng minh bằng kiểm thử end-to-end trên thiết bị.

Ưu tiên:
- **P0:** core simulation parity — bắt buộc trước khi tuyên bố game có chiều sâu kiểu Victoria 3.
- **P1:** strategic depth — cần cho campaign dài và chính trị/ngoại giao phức tạp.
- **P2:** visual/presentation polish — quan trọng nhưng không được làm trước khi P0 vận hành đúng.

## 5. Những thứ cần xây trước để đạt parity

### P0 — hệ thống lõi
1. Pop cohorts thật: nghề nghiệp, wealth, culture/religion, literacy, needs, political alignment và rights.
2. Employment/wages: job slots, qualification, hiring, layoffs, wages, productivity, unemployment và profitability.
3. Buildings/Production Methods: phương thức sản xuất thay đổi labour mix, goods inputs/outputs, công suất, tech unlocks và lợi nhuận.
4. Market/logistics: market areas, local prices/access, port/convoy/route, tariffs, blockades và transport bottlenecks.
5. Interest Groups/political movements: clout từ Pop/ownership, approval, demands, radicalization, revolution và law outcomes.
6. Diplomatic Plays: demands, maneuvering, sway/backing, obligations, neutrality và peaceful settlement trước chiến tranh.
7. Warfare: army/formations/fronts/commanders/battalions, navy/fleets/admirals, mobilization, logistics, War Support và peace terms.
8. Journal Entries: objective, condition, progress, branches, deadlines, rewards/penalties, Historical/Sandbox triggers và chronicle.

### P1 — chiến lược và thể chế
9. Companies/financial institutions, ownership, dividends và foreign investment.
10. Generic character system cho monarchs, politicians, generals, admirals, agitators.
11. Institution levels/capacity, bureaucracy, taxation, education, healthcare, policing và colonial administration.
12. Power blocs, subject autonomy, protectorate/tributary/chartered-company legal states.
13. Technology trees sâu hơn, innovation/diffusion và unlock của ngành nghề/PM/đơn vị.
14. Hierarchical AI planner có mục tiêu nhiều năm, kế hoạch trung hạn, hành động tháng và lý do giải thích được.

### P2 — trình bày và chiều sâu hình ảnh
15. Map modes cho market access, trade routes, culture, religion, infrastructure, strategic regions, fronts, naval routes và claims.
16. Original/licensed portraits, building sets, city development, uniforms, flags, newspapers và event illustrations.
17. Chronicle, newspaper, contextual reports, sound/animation.
18. Mobile UI cho landscape/portrait, ledgers có search/filter/sort, context panels, touch-first và accessibility.

## 6. Nguyên tắc Android: giữ chiều sâu, thích ứng giao diện

Không giảm chiều sâu mô phỏng để “vừa màn hình”. Chỉ thay cách trình bày:
- Landscape: bản đồ chính, panel hai bên có thể thu gọn, ledger dưới.
- Portrait: bản đồ và sheet theo ngữ cảnh, drill-down theo tầng, không ép bảng rộng vào cột hẹp.
- Bảng phức tạp phải có tìm kiếm/lọc/sắp xếp; tooltip giải thích dữ liệu và nguyên nhân.
- Level-of-detail chỉ áp dụng cho hình ảnh/nhãn bản đồ, không làm giản lược luật mô phỏng.
- Simulation speed/catch-up phải deterministic và cho cùng kết quả trên các form factor.
- Mọi hành động AI phải có giải thích về mục tiêu, yếu tố đầu vào và hậu quả.

## 7. Tiêu chí đóng một hệ thống

Một tính năng chỉ được coi là hoàn thành khi đủ bốn cổng:
1. **Data gate:** schema chứa đúng thực thể và granularity.
2. **Simulation gate:** engine cập nhật giá trị và tạo tương tác với hệ thống khác.
3. **Decision gate:** player và AI có quyết định thực sự, có đánh đổi và hậu quả.
4. **Verification gate:** unit/integration tests và multi-decade deterministic runs chứng minh hành vi; UI giải thích được nguyên nhân.

Ví dụ: building icon không đủ chứng minh building system hoàn chỉnh. Building phải tuyển Pop, chọn Production Method, mua input, tạo output, trả lương, sinh lãi/lỗ, phân phối lợi nhuận, ảnh hưởng thuế và market prices.

War score không đủ chứng minh military system hoàn chỉnh. Mobilization, formations, supply, commanders, fronts, naval capacity, War Support, goals và peace phải tương tác với nhau.

Journal popup không đủ chứng minh Journal Entry. Nó phải có điều kiện, tiến độ, nhánh, thời hạn, kết quả, phần thưởng/phạt và record lâu dài.

## 8. Tài liệu tham chiếu công khai

- Paradox Interactive, Victoria 3 — About / Main Features: https://www.paradoxinteractive.com/games/victoria-3/about
- Paradox Interactive, Dev Diary #57 — The Journey So Far (31 Aug 2022): https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far
- Victoria 3 official Steam announcements — Update 1.15 / State and Revolution (5 Nov 2026) and Hotfix 1.15.1 (11 Nov 2026): https://steamcommunity.com/app/529340/announcements/
- Official 1.15.1 announcement specifically covers AI accounting for wages and PM input/output multipliers; the 1.15 changelog documents War Support and in-war enforcement of some war goals.

**Kết luận:** code hiện có nền engine tốt để phát triển, nhưng chưa phải một bản Victoria 3 rút gọn hoàn chỉnh. Muốn đạt “giống V3 về mọi mặt”, phải ưu tiên P0 và chứng minh các chuỗi nhân quả bằng test trước khi đầu tư phần giao diện trang trí. Tài liệu này không thực hiện hoặc cho phép bất kỳ patch code/data runtime nào.
