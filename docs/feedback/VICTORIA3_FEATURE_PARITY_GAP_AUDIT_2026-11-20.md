# VICTORI3 MOBILE — VICTORIA 3 FEATURE-PARITY GAP AUDIT
**Ngày:** 2026-11-20  
**Branch:** `experiment/vic3-visual-upgrade`  
**Base HEAD đã kiểm tra:** `28105b8ba5ffa62c1ad8700c874c0fe659e503e1`  
**Phạm vi:** đối chiếu yêu cầu tổng thể với mã nguồn tại HEAD; chỉ đọc, không sửa gameplay.

## 0. Kết luận

**APK hiện tại chưa đạt mức mô phỏng tương đương Victoria 3.** Đây không còn là vài lỗi cân chỉnh hoặc thiếu một số nút. Mức triển khai hiện tại phần lớn là **bộ khung mô phỏng cấp quốc gia/tỉnh với những hệ thống rút gọn**, trong khi mục tiêu đòi hỏi một mô phỏng xã hội–kinh tế–chính trị–ngoại giao–quân sự toàn cầu có quan hệ nhân quả liên tục.

Đặc biệt, không được lấy việc có màn hình “Kinh tế”, “Quân sự”, “Chính trị”, “Ngoại giao” làm bằng chứng những hệ thống này đã hoàn chỉnh. Một hệ thống chỉ được coi là hoàn chỉnh khi có:
1. Domain state đủ chi tiết và có vòng đời rõ ràng.
2. Quy tắc chuyển trạng thái thực sự chạy trong engine.
3. Người chơi và AI có thể ra quyết định thông qua cùng một command/rule path.
4. Có quan hệ nhân quả hai chiều với các hệ thống liên quan.
5. Có dữ liệu lịch sử đúng thời gian và có provenance.
6. Có test định lượng, deterministic, biên và save/load.
7. Có giao diện cho người chơi hiểu, kiểm soát và truy nguyên kết quả.

Đặc tả chuẩn đã có trong `docs/spec/MASTER_SPEC_VI.md` (754 dòng, gồm POP, công trình, thị trường, tài chính, thể chế, ngoại giao, quân đội, AI, bản đồ, Android và tiêu chí nghiệm thu). Tài liệu này không thay thế Master Spec; nó đối chiếu spec đó với code thật và ghi phần còn thiếu.

## 1. Sửa lại đánh giá tốc độ — không dùng sai chuẩn so sánh

Victoria 3 không lấy FPS làm đồng hồ mô phỏng. Tài liệu kỹ thuật của Paradox mô tả một regular simulation tick tương đương **6 giờ trong game** (4 tick/ngày) và chia công việc theo regular, daily, weekly, monthly, yearly cadence. Tick tasks có dependency; tác vụ nặng không nhất thiết chạy trên mỗi tick. Paradox cũng phân biệt game/session logic thread, task threads, UI/main thread và render thread. Đây là cơ sở kiến trúc, không phải một bảng công khai quy định số ngày game/giây cho từng mức speed.  
Nguồn: [Paradox — Dev Diary #76: Performance](https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-76-performance), 2023-02-22.

Trong Victori3 Mobile:
- `GameDate` chỉ có năm/tháng; `GameState.tick` đang đại diện cho **một tháng**.
- `stepMonth()` tăng một tháng và gọi lần lượt economy, population, politics, secession, technology, diplomacy, military, events, AI, divergence; năm mới còn ghi yearly sample.
- `GameController` kích hoạt bước mô phỏng từ `requestAnimationFrame`; mức speed 5 có interval bằng 0 nên mỗi callback chạy một tháng.
- Vì vậy tốc độ lịch đang phụ thuộc tần số callback/FPS, còn toàn bộ engine vận hành ở độ phân giải tháng. Không thể xem đây là cách mô phỏng thời gian như Victoria 3.

**Đính chính nhận định trước:** con số “5 năm/giây” chỉ là phép tính lý thuyết từ mã hiện tại trong giả định 60 callback/giây; không phải phép đo trên điện thoại, không phải tốc độ chuẩn của Victoria 3, và không được dùng làm mục tiêu tuning. Mục tiêu đúng là tách logical tick khỏi render, dùng cadence tác vụ có dependency, sau đó đo thực tế và khóa speed 1–5 bằng dữ liệu. Thiết kế chuẩn đã có tại `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md`; không được nhân pipeline tháng hiện tại lên bốn lần rồi gọi đó là mô phỏng 6 giờ.

## 2. Bảng trạng thái tổng quan

Quy ước:
- **Nền tảng:** có mô hình và code có thể chạy.
- **Sơ khai/Partial:** đã có một phần quy tắc, nhưng mô hình hoặc tương tác còn quá tổng hợp so với Master Spec.
- **Thiếu:** domain hoặc vòng lặp gameplay cốt lõi chưa tồn tại ở mức yêu cầu.
- **Chưa chứng minh:** cần kiểm thử/quan sát runtime; không được tự nâng trạng thái chỉ từ đọc code.

| Hệ thống | Hiện trạng code | Khoảng cách so với đích | Ưu tiên |
|---|---|---|---|
| Clock/simulation cadence | Một tick = một tháng; tất cả hệ thống chủ yếu chạy monthly; tick driver gắn RAF | Thiếu logical six-hour/daily scheduler, task graph, FPS-independent clock, bounded backlog | P0 |
| POP/xã hội | 9 strata theo tỷ lệ ở cấp vùng; ledger việc làm/thu nhập/SoL tổng hợp | Thiếu Pop cohort đầy đủ theo nghề, tuổi, văn hóa/tôn giáo, tài sản, nhu cầu, sức mạnh chính trị và di chuyển | P1 |
| Công trình/công nghiệp | 10 building types, recipes cố định, production methods dạng multiplier, một phần staffing/profitability | Thiếu registry/firms/ownership ledger, đầu vào tồn kho, sản phẩm phụ, công suất/thiếu lao động/hạ tầng, đầu tư và phá sản đầy đủ | P1 |
| Market/trade | 12 hàng hóa; supply/demand/imports/shortage và giá aggregate theo market | Thiếu physical stock/inventory, trade routes, convoy/capacity, contracts, trade policy/treaty và logistics chi tiết | P1 |
| Tài chính | Tax, tariff, budget lines, debt/interest/default, pool đầu tư tổng hợp | Thiếu ngân hàng, tín dụng, trái phiếu, đầu tư xuyên biên giới và sổ cái hoàn chỉnh | P1 |
| Chính trị/thể chế | 8 IG cố định, preference table, clout/approval, legitimacy, radicalism, reform progress | Thiếu government formation, cabinet/party/movement, election đầy đủ, institutions, quyền lực địa phương và phản hồi thể chế sâu | P1 |
| Ngoại giao | Relation scalar, rivalries, alliance, guarantee, customs union; war side calls | Thiếu diplomatic play/crisis, sway, maneuvers, bargaining, treaty terms/lifecycle, influence/obligations đầy đủ | P1 |
| Chư hầu/subject | `overlord` + `subjectType`; một số loại quan hệ và kế thừa/chiến tranh | Thiếu subject agreement, liberty desire, autonomy spectrum, tribute/obligations, subject interaction và integration | P1 |
| Quân sự | Army manpower/quality/morale/supply scalar; navy strength/quality; war score/occupation theo vùng | Thiếu unit/formation/order of battle, generals/admirals, equipment stocks, fronts/operations, logistics, mobilization và battle report chi tiết | P1 |
| AI toàn cầu | Monthly utility heuristics cho ngân sách, xây dựng, cải cách, ngoại giao, chiến tranh | Thiếu hierarchical national strategy, kế hoạch dài hạn, cabinet/minister logic, military operations, market/trade planning và rationale đủ sâu | P1 |
| Historical identity | Leader records và content/portrait registry có nguồn, lookup theo tên | Đường hiển thị chân dung hiện chưa kiểm tra term/asset period ở nơi render; coverage/office mapping còn cần audit | P0 |
| Technology | Research tree, prerequisites, historical year/effects | Cần chứng minh đầy đủ ảnh hưởng chéo lên building/pop/military/ship/economy và tiến trình công nghệ theo thời đại | P2 |
| Scoring/rank | Một `powerScore` tổng hợp GDP, army, navy, prestige | Thiếu vector năng lực quốc gia và breakdown giải thích được | P2 |
| Save/reliability | IndexedDB, autosave định kỳ, visibility/pagehide listeners | R7 vẫn OPEN P0; chưa có chứng cứ process-death/WebView recovery trên iQOO | P0 |
| Map/settlement/visual | Bản đồ vùng và nhiều màn hình dữ liệu | Cần hoàn thiện cấp hành chính, settlement/city, map layers và phản ánh biến đổi vật lý theo thời gian | P2 |

## 3. Đồng hồ và simulation scheduler — P0

### Hiện có
- `src/engine/simulation.ts`: `stepMonth()` tăng `tick` và date theo tháng; các system được chạy theo một danh sách tuần tự.
- `src/ui/game/controller.ts`: speed 1–4 dùng khoảng milliseconds nhưng vẫn bị RAF-gating; speed 5 chạy một tháng mỗi RAF callback.
- Một số hệ thống tự giảm tần số bằng `tick % N`, nhưng đó không thay thế một scheduler thống nhất.

### Phải đạt
- Logical calendar cần độ phân giải nhỏ (mục tiêu tham chiếu 6 giờ/tick, 4 tick/ngày), có ngày/giờ, month/year boundary rõ ràng.
- Scheduler phải phân biệt regular, daily, weekly, monthly, yearly và event-triggered tasks; mỗi task khai báo cadence, dependency, thứ tự deterministic, input/output và quyền sửa state.
- Economy, POP, diplomacy, war, political movements, events và AI không được chạy cùng tần suất một cách máy móc.
- RAF chỉ render; simulation scheduler chạy độc lập. FPS giảm chỉ làm UI ít frame hơn, không làm mất logical tick hoặc tăng tốc lịch.
- Có backlog budget: không drop tick âm thầm, cũng không chạy catch-up vô hạn gây ANR. Khi quá tải phải slowdown/pause có cảnh báo và giữ debt rõ ràng.
- Pause/resume/background/save/load không nhảy lịch; speed đổi không tự tạo tick.
- Speed 1–5 phải được đo và tài liệu hóa trên thiết bị mục tiêu; không copy một con số wall-clock chưa kiểm chứng.

### Kiểm thử bắt buộc
60/90/120 Hz frame simulation cùng elapsed wall-time phải cho cùng logical ticks; test pause, resume, background, long stall, worker contention, save/load, RNG hash và campaign end 1836–1936.

## 4. POPs, xã hội và thị trường lao động — P1

### Hiện có
`src/engine/types.ts` có 9 strata; `Region` lưu dân số, tỷ lệ strata, văn hóa/tôn giáo cấp vùng, literacy, SoL, unrest/radicalism. `PopulationEconomy` lưu các mảng employed/income/wage/SoL theo strata và một số chỉ số công trình. `populationMonth()` cập nhật sinh/tử, literacy, strata, migration bằng công thức tổng hợp.

### Còn thiếu
- POP cohorts phải có identity theo nhóm: location/state, culture, religion, profession, strata/class, employment, dependents, wealth/assets, income, needs, SoL, literacy, political strength, radicals/loyalists và migration status.
- Một cohort có thể được gộp/tách deterministic khi thay đổi nghề, địa điểm, văn hóa, tôn giáo hoặc mức sống; không mô phỏng từng cá nhân nhưng không được chỉ lưu tỷ lệ chín nhóm ở cấp vùng.
- Labor market phải tuyển dụng theo qualification, wage offer, profitability, competing demand; thiếu kỹ năng và thất nghiệp phải có hệ quả.
- Demography cần age structure/cohort flow hợp lý: birth, mortality, disease, war casualties, migration, assimilation và displacement; không dùng một tỷ lệ đồng đều che phủ mọi khác biệt.
- POP demand phải dựa trên needs basket, income/wealth, prices, access và substitution; thay đổi giá làm thay đổi tiêu dùng thực.
- POP → IG/political movement phải được tính từ membership, wealth, occupation, laws và material conditions; IG/laws → POP phải tác động ngược lên quyền, nhu cầu, thu nhập, giáo dục, việc làm và migration.

### Nghiệm thu
Thay đổi thuế/giá/lương/luật/chiến tranh phải làm cohort ledger thay đổi có thể giải thích; tổng population, employment, wages, income và consumption phải reconcile theo tolerance được phê duyệt.

## 5. Công trình, công nghiệp, sở hữu và construction — P1

### Hiện có
`src/engine/types.ts` khai báo 10 loại công trình; `economy.ts` có RECIPES, PRODUCTION_METHODS, allocation lao động cạnh tranh, profitability/employment targets và construction queue.

### Còn thiếu
- Building Registry tách loại công trình khỏi Building Instance/site; site có level/capacity/condition, owner, workforce, production method, inputs, outputs, revenue, wage bill, operating costs, profit, subsidies và state.
- Phân loại phải đủ quy mô thời đại: agriculture/plantation/livestock/fishery/forestry/mines, textile/food/paper/furniture/glass, steel/machinery/chemicals/electricity, arms/ammunition/shipyards, ports/railways/roads/warehouses, universities/admin/health/barracks/naval bases.
- Production method phải định nghĩa input/output/byproduct, labor composition/qualification, machinery/energy, throughput, wage/cost, pollution và technology prerequisites.
- Factory chỉ hoạt động theo workforce thực, input available, market access, infrastructure, condition và profitability. Không có nguyên liệu hoặc lao động thì output phải giảm/đóng cửa.
- Ownership ledger phải hỗ trợ state/private/aristocrat/capitalist/company/cooperative/community/foreign ownership phù hợp lịch sử; profit/dividend/tax/reinvestment phải có nơi ghi nhận.
- Construction phải tiêu thụ capacity, labor, money và vật liệu theo tiến độ; có queue, priority, delay, pause, shortage, cancellation, damage/rebuild và completion effects.
- Resource deposits có trữ lượng/discovery/depletion/extraction cost; không để tài nguyên sinh ra vô hạn không nguyên nhân.

### Nghiệm thu
Mỗi công trình có production ledger cân bằng; mất đầu vào/hạ tầng/nhân lực phải tác động throughput và giá; xây dựng chỉ hoàn thành khi có đủ chi phí, vật liệu, capacity và thời gian.

## 6. Markets, trade, transport và finance — P1

### Hiện có
- 12 goods và aggregate market stats: supply, demand, imports, shortage.
- Giá thị trường và giá thế giới được cập nhật bằng công thức cung/cầu.
- Thuế, thuế quan, chi ngân sách, debt, interest và default đã có mức sơ khai.

### Còn thiếu
- Physical inventory/stockpile theo warehouse/site/market; nhập kho, xuất kho, spoilage/decay, strategic reserves, military reserves.
- Trade route thực sự giữa origin/destination qua land/sea network; convoy/port/rail capacity, distance, risk, tariffs, blockade, piracy, escort, wartime disruption.
- Trade agreement/market access phải ảnh hưởng đến ai mua/bán, giá, customs/tariff policy và supply priority.
- Customs Union phải là một market institution có rule về common market, internal trade, external tariffs, leadership, accession/exit và consequences; không chỉ là một tập country IDs cộng giá.
- Finance cần ledger rõ: household income/wealth, firm revenue/profit, private investment, government tax/tariff, loans, bonds, interest rate, subsidies, debt service, default/creditworthiness. Foreign investment phải gắn ownership và diplomatic protection.
- Các dòng vật chất và tiền tệ phải reconcile; không thể vừa tiêu thụ đầu vào vừa tính output mà không có inventory/debit-credit trail.

## 7. Chính trị, thể chế, luật và xã hội — P1

### Hiện có
- 8 interest group archetypes với một bảng preference chung.
- Tính clout, approval, legitimacy, radicalism; law reform progress và một số election/succession logic.
- Có secession/revolution logic ở mức nhất định.

### Còn thiếu
- IG membership phải lấy từ POP cohort, occupation, wealth, culture/religion, ideology và laws. IG có leaders/traits, approval và political goals.
- Political Movements riêng với IG: movement có issue, support, radicalism, leadership, demands, revolution threshold, state/region footprint.
- Government formation phải có head of state/head of government, cabinet/ministries, coalition/party where relevant, legitimacy và policy capacity.
- Regime-appropriate elections/appointments/succession; không ép decentralized polity hoặc empire vào một kiểu bầu cử hiện đại.
- Laws phải phân domain đầy đủ: power/franchise, governance, economy, trade, taxation, labor, slavery/serfdom, church, education, press, citizenship, migration, policing, welfare, healthcare, army/navy model, colonial policy.
- Enactment có debate/stages, enactment chance, stall, success/failure, opposition, enactment modifiers và consequences; laws thay đổi thực sự quyền, institutions, production, POP, tax, military và legitimacy.
- Institutions có level/funding/effect/capacity; taxes and budget affect service delivery and state capacity.
- Civil war/revolution phải có factions, territory, units, goals, support, intervention and aftermath.

## 8. Ngoại giao quốc tế — P1 (đặc biệt cần mở rộng)

### Hiện có
- Một relation value giữa cặp nước và rivalry boolean/list.
- Treaty type hiện chỉ có `alliance`, `guarantee`, `customs_union`; mỗi treaty chủ yếu chứa ID, members, leader/start/source.
- Có improve relations, propose/break alliance, declare rival, guarantee, join customs union, declare war và offer white peace.
- Một số subject tự động đi theo overlord trong chiến tranh; defensive alliance/guarantee/great-power intervention có rule đơn giản.
- AI chọn rival, alliance, guarantee, customs union, improve relations và war bằng utility heuristics.

### Vì sao hiện tại còn sơ khai
- `Treaty` chưa phải hợp đồng có điều khoản: thiếu duration/expiry, clauses, obligations, scope, enforcement, breach, renewal, withdrawal, diplomatic cost và cooldown.
- Relation scalar không đủ biểu diễn attitude, strategic interest, trust, infamy/threat, obligation, diplomatic leverage, influence và bilateral treaty status độc lập.
- Chiến tranh bắt đầu trực tiếp qua `declareWar`; chưa có Diplomatic Play/crisis phase với maneuvers, sway, backing down, escalation, mobilization, offers và participants joining over time.
- Hòa bình do UI hiện chỉ có offer white peace; war goals được áp dụng khi kết thúc nhưng chưa có full peace conference/negotiated settlement package, reparations, treaty transfer, demilitarization hoặc truce lifecycle.
- Không có full diplomatic action system: propose pact, make demand, threaten, bankroll, guarantee, revoke, invite, expel, offer obligation, transfer state, grant autonomy, request autonomy, ban/allow investment, open/close market, improve relations and manage subject.
- Không có sphere/interest region and declared strategic interest model đủ để AI/plays/country policy cân nhắc.

### Hệ thống cần xây
1. **Diplomatic Standing:** relations, attitude, trust, infamy/threat, obligations, influence, declared interests, strategic value — là các thuộc tính riêng, không gộp một số.
2. **Diplomatic Actions:** mọi hành động có actor/target, prerequisites, cost, acceptance formula, cooldown, AI rationale, expiry/result log.
3. **Treaty Registry:** treaty là object có parties, clauses, scope, start/end, renewal, withdrawal, breach/penalty, obligations, guarantor, enforcement and historical provenance.
4. **Pacts/agreements:** alliance (offensive/defensive terms), non-aggression, guarantee, access/transit, trade, customs union, investment, military access, mutual defence, subject agreement, peace/truce; từng loại có lifecycle/eligibility riêng.
5. **Diplomatic Plays:** issue, initiator, primary demand, war goals, participants, maneuvers, sway offers/obligations, backing down, escalation phases, mobilization and war transition.
6. **Great Power & strategic interests:** prestige/influence/region interests, leverage, power blocs/alliances, balancing and intervention.
7. **War settlement:** peace terms, state transfer, reparations/indemnities, humiliation, autonomy/independence, subject creation/release, treaty obligations, truce/no-war period.
8. **History-aware diplomacy:** historical priorities bias decisions but never hard-lock outcomes; dates and claims must be source-backed.

### Nghiệm thu ngoại giao
- Hai nước có thể đàm phán một thỏa thuận nhiều điều khoản; engine kiểm tra hiệu lực và vi phạm theo thời gian.
- Mỗi alliance/guarantee/access/trade pact có đúng hiệu lực, thời hạn, ràng buộc và kết thúc; phá vỡ thỏa thuận có hậu quả.
- Diplomatic Play phải cho các nước khác thời gian tham gia và thay đổi phe bằng sway/offer; back down và escalation phải có kết quả riêng.
- AI giải thích vì sao tham gia/không tham gia; không tự nhảy từ hòa bình sang chiến tranh vì một scalar.
- Peace settlement phải thay đổi bản đồ/chủ quyền/subject relation/war reparations và tạo truce có thời hạn.
- Save/load giữa mọi giai đoạn của play/treaty phải khôi phục nguyên trạng và deterministic.

## 9. Chư hầu, bảo hộ, liên minh và trật tự quốc tế — P1

### Hiện có
- Country lưu `overlord` và `subjectType` dạng string.
- Treaty model có alliance, guarantee, customs union.
- `warSides()` tự thêm một số subject khi overlord bị tấn công/tuyên chiến; war goals có subjugate/independence.

### Còn thiếu
- Subject relation cần registry riêng: subject, overlord, subject kind, autonomy, liberty desire, tribute/tax, military obligation, foreign policy restriction, market status, diplomatic rights, succession/inheritance, start/end, integration progress, rebellion risk.
- Phân biệt vassal, protectorate, dominion, puppet, tributary, personal union, colony/dependency, autonomous vassal và decentralized polity. Mỗi loại có rule khác nhau, không chỉ là label.
- Overlord phải có công cụ grant/request autonomy, change subject terms, integrate/annex where legal, transfer overlordship, call to arms, defend, collect tribute, control foreign policy, market integration.
- Subject phải có autonomy demand, liberty movement, refusal, seek protector, seek independence, call for support, negotiate terms and revolt.
- Subject relations phải ảnh hưởng thuế, market, trade, manpower, army, diplomacy and domestic legitimacy.
- Alliances và subjects là hai quan hệ khác nhau: một nước có thể là ally mà không phải subject; subject có nghĩa vụ khác tùy loại.
- Succession, regime change, treaty breach, war loss, overlord weakness and diplomatic pressure phải thay đổi subject status theo quy tắc có thể kiểm chứng.

### Nghiệm thu
Không được tự động giả định mọi subject đều tham chiến hoặc mọi ally đều tham chiến. Mỗi loại agreement phải có eligibility/obligation/choice; test cho succession, multi-overlord conflict, independence, annexation, treaty expiry và save/load.

## 10. Quân sự, chiến tranh, hậu cần và hải quân — P1

### Hiện có
- Army = manpower/target/quality/morale/supply; Navy = strength/target/quality.
- War có hai phe, danh sách member, goal, start, score, occupied regions, battle count và exhaustion.
- Monthly battle chọn bên tấn công, mục tiêu vùng và kết quả bằng sức mạnh tổng hợp, terrain và RNG.

### Còn thiếu
- MilitaryOrganization tree: theatre/army/corps/division/brigade/regiment/battalion hoặc structure phù hợp từng quốc gia/thời đại.
- Unit state: type, manpower, equipment, organization, readiness, training, experience, morale, commander, position, supply, attrition, casualties, reinforcement, history.
- General/admiral registry với traits, skills, rank, seniority, loyalty, politics, command capacity, relationships and biography.
- Recruitment/conscription/reserves/training/repair/demobilization phải tiêu thụ population, money, equipment and time.
- Equipment production and storage: small arms, artillery, ammunition, explosives, naval hull/engines, transport; shortages reduce unit effectiveness.
- Fronts, battle plans, movement, terrain, weather, forts, siege, occupation, naval patrol/blockade/escort/invasion and convoy raiding.
- Logistics: depots, supply route, ports/rail/road/river, distance, capacity, weather, enemy control; supply attrition and operational reach.
- War support/exhaustion, public opinion, casualties, debt and domestic politics must affect willingness to continue war.
- Technology/doctrine by date; no battleships/aircraft in early 1836 unless historically/technologically unlocked.

## 11. AI quốc gia — P1

### Hiện có
AI runs monthly and selects budget, investment, construction, diplomacy, reforms and war targets from utility heuristics and historical bias.

### Còn thiếu
- National strategic plan with goals/time horizon/constraints and explicit rationale.
- Economic planner: market shortages, resources, input chains, profitability, industry specialization, infrastructure and trade.
- Political planner: IG alignment, government stability, movement risk, election and law timing.
- Diplomatic planner: alliance network, subject strategy, treaty clauses, diplomatic plays, influence, commitments and reputation.
- Military planner: unit composition, recruitment, technology, fronts, supply, objectives, mobilization and peace decisions.
- Country-specific behavior based on geography, institutions, culture, economy, resources, historical interests and strategic situation, not only a small personality vector.
- Observer/world AI tests with many countries over 1836–1936; decisions must be bounded, reproducible and explainable.

## 12. Technology, history, map, characters and presentation — P0/P2

- Technology: tree with prerequisites, discovery dates, diffusion, adoption costs and concrete effects on buildings, goods, institutions, military doctrine and ships.
- Historical data: every ruler, office, government, treaty, leader, portrait, flag, historical change and benchmark must have source, date interval, identity matching, uncertainty and rights metadata.
- Character matching must use entity + role + valid term + date, not name alone; portrait asset validity period must also cover current game date. Otherwise use neutral fallback; never pass illustrative art as authentic.
- Geography: world/strategic region/state/administrative unit/settlement hierarchy; topology and control ownership must support trade, military movement, infrastructure and local governance.
- UI: strategic map layers, ledgers and drill-down to country/state/market/building/unit/treaty/character; show reasons and actual data sources.
- Notification/journal must expose causal events: price shock, trade disruption, law support, revolt, diplomatic maneuver, war goal, supply shortage, treaty breach and peace terms.
- Ranking must be a transparent vector (economy, industry, population/welfare, finance, military, navy, logistics, diplomacy, prestige, technology), not a single opaque scalar.

## 13. System integration — điều kiện quyết định “giống Victoria 3”

Các hệ thống không được triển khai rời nhau. Các vòng phản hồi cần có:

**POPs → labor/qualification → buildings/firms → goods/inventory → markets/trade/price → wages/profits/wealth → POP needs/SoL → IG/movement/radicalism → government/laws/institutions → back to POP/economy.**

**Economy/industry → tax/credit/budget → military recruitment/equipment/logistics → war casualties/occupation/blockade/debt → POP/politics/markets → peace treaty and diplomacy.**

**Diplomacy/subjects/customs unions → market access/tariffs/foreign investment/defence obligations → economic and military capabilities → great-power balance → diplomatic plays and treaties.**

**Technology → production methods/building throughput, transport, military equipment/doctrine, institutions, communications and new goods; adoption depends on population skill, infrastructure, capital and government policy.**

**Historical data → initial world state and strategic bias; after start the shared engine creates alternate outcomes in both Historical and Sandbox modes without hardcoding the known future.**

Nghiệm thu phải có scenario tests xuyên hệ thống, không chỉ unit test từng công thức riêng.

## 14. Lộ trình kỹ thuật sau khi được phép mở phase

Không viết lại cả game trong một commit. Dùng vertical slices, mỗi lát có spec, migration, test, benchmark và APK QA:

1. **Foundation/clock/save:** daily or six-hour logical time, cadence scheduler, command/event ordering, deterministic RNG, save migration and Android lifecycle.
2. **POP & labor:** cohort schema, migration from nine strata, job/qualification, wages, needs/SoL, migration/demography.
3. **Building/market/ownership:** building registry/site, input/output/inventory, employment, ownership and production accounting.
4. **Trade/infrastructure/finance:** route graph, ports/rail/roads, market access, tariffs, finance ledger, debt/credit/investment.
5. **Politics/institutions:** IG membership, movements, government, elections/appointments, law enactment and institution effects.
6. **Diplomacy/subjects:** treaty registry/lifecycle, subject relation, pacts, diplomatic actions, plays/sway/settlement/truces.
7. **Military:** organization/units, commanders, equipment, recruitment, logistics, fronts/battles, naval operations and wartime economics.
8. **AI:** global hierarchical planning for all country types and integrated diplomatic/economic/military decisions.
9. **Historical calibration/content:** date-valid leaders/portraits/flags, source/rights audits, historical scenarios and cross-region coverage.
10. **UI/map/Android performance:** operational ledgers, drilldowns, map layers, notifications, profiling, thermal/RAM/battery and physical-device acceptance.

Thứ tự cụ thể phải được đối chiếu roadmap/phase gate đã duyệt; danh sách này không tự mở phase hay cho phép sửa code.

## 15. Tiêu chuẩn Definition of Done

Một subsystem chỉ được đánh dấu **đạt** khi:
- Spec và data contract được duyệt, source-of-truth và migration được định nghĩa.
- Runtime path có thao tác người chơi và AI dùng chung rule validation.
- Unit, integration, scenario, determinism, edge and save/load tests pass.
- Có world coverage ở nhiều khu vực và loại chính thể, không phải chỉ Anh/Pháp/Phổ.
- Có đo hiệu năng trên target Android; không suy luận từ desktop/Node.
- UI thể hiện state, nguyên nhân, chi phí, điều kiện và hậu quả.
- Có ảnh chụp APK chạy thật, build/commit SHA, known gaps.
- Independent review và owner acceptance theo phase gate.

“Có màn hình”, “có nút”, “có con số”, “test xanh” hoặc “APK cài được” không đồng nghĩa gameplay parity.

## 16. Trạng thái và giới hạn hiện tại

- Owner playtest verdict: **NOT ACCEPTED**.
- S0-B7: **IN_PROGRESS**; Claude independent review và owner decision vẫn pending.
- S1: **NOT AUTHORIZED** theo handoff hiện hành.
- R7: OPEN P0; R14/G0.7 BLOCKED; G0.8 PARTIAL; G0.9 BLOCKED; DEP-F1 OPEN P1.
- Tài liệu này là đối chiếu/thiết kế, không phải implementation approval.
- Không có gameplay/engine/UI/save/data/asset/workflow change trong commit tài liệu này; không có runtime test, build, APK install hoặc iQOO device QA.
