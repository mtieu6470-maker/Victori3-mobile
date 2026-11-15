# Audit repository so với gói nghiên cứu Pass 16 (20_FEATURE_MATRIX.csv)

Ngày audit: 2026-11-15 · nhánh `claude/game-historical-sandbox-modes-kg7rj7` · đối chiếu bằng đọc mã nguồn và kiểm thử hiện có. “Có” chỉ được ghi khi có mã chạy thật và (nếu ghi) kiểm thử tự động; các đặc tả nghiệm thu trong `73_RUNTIME_ACCEPTANCE_MATRIX_SUPPLEMENT.csv` (606 dòng) **chưa được chạy** trừ các dòng ánh xạ vào kiểm thử nêu ở mục 3.

## 1. Tóm tắt

Tổng 146 hệ thống: **5 Có**, **58 Một phần**, **83 Chưa có**.

| Ưu tiên | Có | Một phần | Chưa có |
|---|---|---|---|
| P0 | 4 | 44 | 48 |
| P1 | 1 | 13 | 32 |
| P2 | 0 | 1 | 3 |

Kết luận thẳng: engine hiện tại (~2.400 dòng, `src/engine`) là mô hình **tổng hợp theo vùng và quốc gia** — đủ cho vòng lặp kinh tế/chính trị/ngoại giao/chiến tranh cơ bản với cùng một engine cho Lịch sử, Sandbox và Quan sát. Phần lớn các hệ thống chi tiết trong gói (Pop cohort, production method, sở hữu, bầu cử, diplomatic play, front/formation, hải quân theo tàu, năng lực nhà nước, chuỗi thuế, mùa vụ, mạng giao thông, các lớp quốc tế/xã hội/y tế của Pass 11–16) **chưa có**. Giao diện v2 chỉ hiển thị những gì engine thật sự tính; không có màn hình giả cho hệ thống chưa tồn tại.

## 2. Ma trận chi tiết

| # | Ưu tiên | Hệ thống | Trạng thái | Bằng chứng (đường dẫn) | Ghi chú / khoảng trống |
|---|---|---|---|---|---|
| 1 | P0 | Core gameplay | Một phần | src/engine/systems/population.ts, src/engine/systems/economy.ts, src/engine/systems/politics.ts | Chuỗi dân cư → lao động/tiêu dùng → ảnh hưởng nhóm lợi ích → luật có ở mức tổng hợp theo vùng (tỷ lệ 9 tầng lớp). Chưa có Pop cá thể, thu nhập/tài sản theo nhóm. |
| 2 | P0 | Population | Một phần | src/engine/systems/population.ts; src/ui/screens/Society.tsx | Dân số vùng, tầng lớp, biết chữ, mức sống, thiếu lương thực, dịch bệnh, di cư trong/ngoài nước, phân bố SoL/biết chữ trên UI. Thiếu nhu cầu/thu nhập/chi tiêu theo nhóm. |
| 3 | P0 | Economy | Một phần | src/engine/systems/economy.ts (BUILDINGS, RECIPES, LEVEL_WORKERS); src/ui/screens/Economy.tsx | 10 loại công trình có cấp và việc làm, 5 công thức nhà máy. Chưa có phương pháp sản xuất (PM), tiền lương. |
| 4 | P1 | Ownership | Chưa có | — | Chỉ có quỹ nhà nước / quỹ tư nhân (statePool/privatePool); không có sổ sở hữu công trình. |
| 5 | P0 | Trade | Một phần | src/engine/systems/economy.ts (marketOf, worldPrices); src/engine/systems/diplomacy.ts (joinCustomsUnion) | Thị trường quốc gia + liên minh thuế quan + giá thế giới và nhập khẩu. Chưa có hub, tuyến thương mại, hiệp ước thương mại. |
| 6 | P0 | Finance | Một phần | src/engine/systems/economy.ts financeMonth; src/ui/screens/Economy.tsx BudgetTab | Ngân khố, thuế, thuế quan, nợ, lãi, vỡ nợ, các dòng chi thật (c.finance). Chưa có trợ cấp, năng lực (authority/bureaucracy). |
| 7 | P0 | Government | Một phần | src/engine/systems/politics.ts; src/ui/screens/Politics.tsx | 9 nhóm luật, chính danh, cải cách theo ủng hộ của nhóm lợi ích. Chưa có thể chế (institutions). |
| 8 | P0 | Interest groups | Một phần | src/engine/systems/politics.ts (igApproval, IG_PREFS) | 8 nhóm lợi ích với ảnh hưởng/thái độ/sở thích luật. Chưa có thủ lĩnh, hệ tư tưởng. |
| 9 | P1 | Movements/revolutions | Một phần | src/engine/systems/politics.ts revolutionCheck, secessionCheck | Cực đoan, cách mạng, ly khai, nội chiến. Chưa có phong trào chính trị, agitator. |
| 10 | P1 | Characters | Một phần | src/engine/data (leaders, 57 nước đã nghiên cứu); src/engine/systems/events.ts succession | Nguyên thủ và người kế vị (lịch sử/mô phỏng). Chưa có chính khách, tướng, đô đốc, giám đốc. |
| 11 | P0 | Diplomacy | Một phần | src/engine/systems/diplomacy.ts; src/ui/screens/Diplomacy.tsx | Quan hệ, liên minh, đối thủ, bảo đảm, chư hầu, liên minh thuế quan, xem trước phe tham chiến. Chưa có diplomatic play, treaty builder, power bloc, lobby. |
| 12 | P0 | Land warfare | Một phần | src/engine/systems/military.ts | Lục quân tổng hợp, điểm chiến tranh, chiếm đóng vùng. Chưa có formation/front/tướng/lệnh. |
| 13 | P1 | Naval warfare | Một phần | src/engine/systems/military.ts navalStrength | Hải quân chỉ là số tàu × chất lượng. Chưa có hạm đội, nút biển, phong tỏa. |
| 14 | P1 | Technology | Có | src/engine/systems/technology.ts; src/ui/screens/Tech.tsx | 38 công nghệ, 3 nhánh, tiền đề, lan tỏa làm giảm chi phí, cây có đường nối tiền đề. Hiệu ứng mở khóa còn ít. |
| 15 | P1 | Journal/events | Một phần | src/engine/systems/events.ts; src/ui/screens/Journal.tsx | 19 cửa sổ quyết định lịch sử, sự kiện ngoại sinh, nhật ký. Chưa có journal entry có tiến độ/điều kiện. |
| 16 | P0 | UI/UX | Một phần | src/ui/App.tsx, src/ui/components/ui.tsx, src/ui/map/* | Cửa sổ, bảng, 9 lớp bản đồ có chú giải, outliner, tooltip, popover KPI, thông báo. Chưa có lens hành động trên bản đồ, cài đặt thông báo/auto-pause. |
| 17 | P0 | Historical Mode | Có | src/engine/modes.ts, src/engine/historical.ts; tests/modes.test.ts | Kiểm thử: chế độ chỉ bật lớp dữ liệu lịch sử, không ép kết quả (một số mốc bị lỡ). |
| 18 | P0 | Sandbox Mode | Có | src/engine/modes.ts; tests/modes.test.ts | Kiểm thử: seed khác → thế giới khác, có kết quả phi lịch sử. |
| 19 | P0 | Observer Mode | Có | tests/modes.test.ts (Observer) | Kiểm thử: mọi nước còn sống đều ra quyết định AI; lệnh người chơi bị từ chối. Dòng thời gian thế giới hiện chỉ qua Biên niên/Thế giới. |
| 20 | P0 | Campaign | Một phần | src/engine/init.ts; src/ui/screens/Setup.tsx | Khởi đầu 1/1/1836, chọn chế độ/vai trò/quốc gia. Chưa có trạng thái công nhận quốc tế. |
| 21 | P0 | Geography | Một phần | tools/build-map.ts; assets/map | 662 vùng trên ranh giới tỉnh Natural Earth (xấp xỉ hiện đại), tài nguyên theo vùng, yêu sách (claims). Chưa có homeland, đất canh tác. |
| 22 | P0 | Construction | Một phần | src/engine/systems/economy.ts build; src/ui/screens/Economy.tsx ConstructionTab | Xây trả ngay từ quỹ, xếp hạng theo lợi suất của engine. Chưa có năng lực xây hằng tuần, hàng đợi, vật liệu. |
| 23 | P0 | PM detail | Chưa có | — | Chưa có phương pháp sản xuất. |
| 24 | P1 | Employment | Chưa có | — | Chưa có trạng thái tuyển dụng/lương. |
| 25 | P0 | Finance | Một phần | src/engine/systems/economy.ts | Thuế, nợ, lãi. Chưa có authority, bureaucracy, influence. |
| 26 | P1 | Elections | Chưa có | — | Có luật quyền bầu cử nhưng chưa có bầu cử. |
| 27 | P1 | Subjects | Một phần | types.ts overlord/subjectType | Loại chư hầu, tông chủ. Chưa có tự trị/trung thành/khủng hoảng chư hầu. |
| 28 | P1 | Colonization | Một phần | decentralized nations; goal colonize | Chính thể phi tập trung, mục tiêu thuộc địa hóa. Chưa có yêu sách thuộc địa, sốt rét, nổi dậy bản địa. |
| 29 | P0 | Strategic Interest | Chưa có | — |  |
| 30 | P0 | Army placement | Chưa có | — |  |
| 31 | P0 | War Support current | Một phần | src/engine/systems/military.ts warMonth; tests/simulation.test.ts (war support) | Mệt mỏi chiến tranh 0–100 (nghịch đảo war support). Đã sửa 2026-11-15: mệt mỏi một mình không còn buộc đầu hàng khi đang thắng (2 test). Còn lại: dàn xếp theo điểm sau 12 năm; chưa có nguyên nhân war support chi tiết. |
| 32 | P1 | War goal enforcement | Một phần | src/engine/systems/military.ts applyGoal | Mục tiêu chỉ được thi hành khi hòa bình; chưa có thi hành giữa cuộc chiến/mirror goal. |
| 33 | P0 | Navy ships | Chưa có | — |  |
| 34 | P1 | Naval administration | Chưa có | — |  |
| 35 | P0 | Military supply | Một phần | types.ts Army.supply | Tiếp tế là một hệ số. Chưa có tàu tiếp tế, trung tâm hậu cần. |
| 36 | P1 | Troop transport | Một phần | src/engine/systems/military.ts frontTargets (navalOk) | Cho phép chiếm vùng ven biển khi đủ hải quân; chưa có lệnh vận tải. |
| 37 | P1 | Straits | Chưa có | — |  |
| 38 | P1 | Cold & multi-hub trade | Chưa có | — |  |
| 39 | P2 | Glossary | Chưa có | — |  |
| 40 | P0 | Subsistence | Một phần | src/engine/systems/economy.ts (nông nghiệp theo địa hình) | Nông dân sản xuất lương thực theo địa hình; chưa có đất canh tác chưa dùng. |
| 41 | P0 | Resource deposits | Một phần | src/engine/systems/economy.ts canBuild | Tài nguyên vùng giới hạn đồn điền/mỏ/khai thác gỗ. |
| 42 | P1 | Urbanization | Chưa có | — |  |
| 43 | P0 | Culture/religion traits | Một phần | Region.culture/religion/nationalism | Văn hóa, tôn giáo, tinh thần dân tộc theo vùng. Chưa có đặc tính/chấp nhận. |
| 44 | P1 | Assimilation/conversion | Một phần | src/engine/systems/population.ts (culture2 qua di cư) | Văn hóa thứ hai lan theo di cư; chưa có đồng hóa/cải đạo theo thời gian. |
| 45 | P0 | Cultural secession | Một phần | src/engine/systems/politics.ts secessionCheck | Ly khai khi tinh thần dân tộc cao → chiến tranh độc lập. |
| 46 | P0 | Slavery/forced labor | Một phần | tầng lớp nô lệ, luật lao động, cửa sổ bãi nô | Có tầng lớp nô lệ và quyết định bãi nô lịch sử; chưa có xung đột chính trị chi tiết. |
| 47 | P1 | Land reform | Một phần | luật serfdom/tenancy; dw_russian_emancipation |  |
| 48 | P1 | Voting systems | Một phần | luật power (census/universal suffrage) | Chỉ là luật, không có cử tri. |
| 49 | P1 | Political parties | Chưa có | — |  |
| 50 | P2 | Expeditions | Chưa có | — |  |
| 51 | P1 | Colonization | Chưa có | — |  |
| 52 | P0 | Country AI edge cases | Một phần | src/engine/ai/ai.ts; tests/simulation.test.ts | AI ngân sách, nghiên cứu, xây dựng, cải cách, ngoại giao, chiến tranh, lịch xếp đều; kiểm thử chống dao động. Chưa có panel giải thích quyết định. |
| 53 | P0 | Unification | Một phần | src/engine/historical.ts (unify_nation), src/engine/systems/military.ts (unify) | Mục tiêu thống nhất có trong luật chiến tranh; chưa có màn hình hình thành quốc gia. |
| 54 | P1 | Customs Union | Một phần | src/engine/systems/diplomacy.ts joinCustomsUnion; data zollverein |  |
| 55 | P1 | Consumer preferences | Chưa có | — |  |
| 56 | P1 | Player Objectives | Chưa có | — |  |
| 57 | P1 | Objective pacing | Chưa có | — |  |
| 58 | P1 | Technology tree UX | Một phần | src/ui/screens/Tech.tsx | Đồ thị tiền đề, xem trước mở khóa, 4 trạng thái nút, lý do bị chặn, nút nghiên cứu tiền đề. Engine chỉ có 1 ô nghiên cứu nên chưa có hàng đợi. |
| 59 | P0 | AI edge cases | Một phần | tests/simulation.test.ts | Chiến tranh kết thúc, không đảo luật trong 15 năm, nghiên cứu/xây liên tục. |
| 60 | P2 | Living map | Một phần | src/ui/map/renderer.ts | Địa hình nổi, sông, hồ, đường nước khắc; chưa có đường bộ/đường sắt theo thời kỳ. |
| 61 | P2 | Power Bloc Monuments | Chưa có | — |  |
| 62 | P1 | 1.15 map strategy UI | Chưa có | — |  |
| 63 | P1 | 1.15 budget/military UI | Chưa có | — |  |
| 64 | P0 | Energy system | Chưa có | — | Chỉ có hàng hóa than. |
| 65 | P1 | Environment | Chưa có | — |  |
| 66 | P0 | Finance | Một phần | src/engine/systems/economy.ts (nợ, vỡ nợ) | Chỉ có nợ công và vỡ nợ; chưa có ngân hàng/tiền tệ. |
| 67 | P0 | Urbanization | Chưa có | — |  |
| 68 | P1 | Communications | Chưa có | — | Chỉ có công nghệ điện báo. |
| 69 | P0 | World order | Một phần | chư hầu, chiến tranh độc lập | Chưa có phi thực dân hóa, khối. |
| 70 | P0 | Historical data governance | Một phần | src/generated db.sources (64 nguồn), QualityMark/Provenance; tests/data.test.ts | Nguồn và 5 nhãn độ tin cậy cho dữ liệu 1836; kiểm thử tính toàn vẹn thời gian. |
| 71 | P0 | War economy | Chưa có | — |  |
| 72 | P0 | Global value chains | Chưa có | — |  |
| 73 | P0 | Human development | Một phần | biết chữ, ngân sách y tế/giáo dục | Chưa có cơ cấu tuổi. |
| 74 | P1 | Automation transition | Chưa có | — |  |
| 75 | P0 | Conflict data governance | Một phần | db.wars (CoW tại ngày bắt đầu); tests/data.test.ts |  |
| 76 | P0 | Historical windows | Có | src/engine/systems/events.ts; tests/modes.test.ts | Cửa sổ quyết định có điều kiện, không ép kết quả. |
| 77 | P0 | Campaign causal proof | Một phần | tests/modes.test.ts (paired seeds, player intervention) | Có kiểm thử ghép cặp; chưa có causal trace. |
| 78 | P0 | Android deterministic runtime | Một phần | src/engine/core.ts (RNG có seed), src/engine/save.ts; tests/simulation.test.ts save/load | Tải lại tiếp tục y hệt. Chưa có số liệu nhiệt/pin trên thiết bị thật. |
| 79 | P0 | National capability vector | Chưa có | src/engine/systems/diplomacy.ts powerScore | Sức mạnh là một con số, không phải vector. |
| 80 | P0 | Great-power transitions and polarity | Một phần | src/engine/systems/diplomacy.ts greatPowers |  |
| 81 | P0 | Hierarchical national AI planner | Chưa có | src/engine/ai/ai.ts | AI một tầng theo luật; chưa có planner chiến lược/tác chiến. |
| 82 | P0 | Alternate-history ensemble QA | Một phần | tests/modes.test.ts |  |
| 83 | P0 | Historical calibration and validation | Một phần | tests/data.test.ts, tests/simulation.test.ts (mốc 1870) |  |
| 84 | P0 | Treaty contracts | Chưa có | — |  |
| 85 | P0 | Alliance credibility | Chưa có | — |  |
| 86 | P0 | International crises | Chưa có | — |  |
| 87 | P0 | Sanctions | Chưa có | — |  |
| 88 | P0 | Economic coercion networks | Chưa có | — |  |
| 89 | P0 | Defence procurement transfers | Chưa có | — |  |
| 90 | P1 | International institutions | Chưa có | — |  |
| 91 | P1 | Peace operations | Chưa có | — |  |
| 92 | P1 | Polarity and order preferences | Chưa có | — |  |
| 93 | P0 | Foreign-policy AI belief state | Chưa có | — |  |
| 94 | P0 | International world graph | Chưa có | — |  |
| 95 | P0 | International law / statehood | Chưa có | — |  |
| 96 | P0 | Occupation / territorial status | Một phần | Region.owner vs Region.controller | Chiếm đóng (controller) tách khỏi chủ quyền (owner); chưa có trạng thái pháp lý chuyển giao. |
| 97 | P0 | Maritime law / sea access | Chưa có | — |  |
| 98 | P1 | Intelligence collection | Chưa có | — |  |
| 99 | P0 | Analytic tradecraft / belief state | Chưa có | — |  |
| 100 | P1 | Information environment | Chưa có | — |  |
| 101 | P1 | Cyber conflict | Chưa có | — |  |
| 102 | P0 | Nuclear deterrence | Chưa có | — |  |
| 103 | P0 | Nuclear non-proliferation / safeguards | Chưa có | — |  |
| 104 | P1 | Strategic arms control | Chưa có | — |  |
| 105 | P0 | Historical legal regime gating | Chưa có | — |  |
| 106 | P0 | AI hidden information governance | Chưa có | — |  |
| 107 | P1 | Cyber resilience | Chưa có | — |  |
| 108 | P0 | Nuclear crisis governance | Chưa có | — |  |
| 109 | P0 | Legal/data rights provenance | Một phần | db.sources (access, url, period) | Có trường truy cập/nguồn; chưa có trường quyền tái phân phối. |
| 110 | P0 | Social identity | Chưa có | — |  |
| 111 | P0 | Public opinion | Chưa có | — |  |
| 112 | P0 | Institutional trust | Chưa có | — |  |
| 113 | P1 | Civil society networks | Chưa có | — |  |
| 114 | P1 | Media diffusion | Chưa có | — |  |
| 115 | P0 | Internal conflict | Một phần | war kind civil/independence | Nội chiến và chiến tranh độc lập; chưa có đồ thị tác nhân. |
| 116 | P0 | Displacement | Chưa có | — |  |
| 117 | P0 | Peace implementation | Chưa có | — |  |
| 118 | P0 | Postwar recovery | Chưa có | — |  |
| 119 | P1 | Gender/children/social recovery | Chưa có | — |  |
| 120 | P0 | Deterministic social engine | Chưa có | — |  |
| 121 | P0 | Commercial social-data rights | Chưa có | — |  |
| 122 | P0 | Disease ecology | Một phần | src/engine/systems/events.ts applyExogenous (epidemic) | Dịch bệnh có tỷ lệ tử vong theo vùng; chưa tách incidence/prevalence/reporting. |
| 123 | P0 | Age-structured demography | Chưa có | — |  |
| 124 | P0 | Public health capacity | Chưa có | — |  |
| 125 | P0 | Epidemic response | Chưa có | — |  |
| 126 | P0 | Land tenure and agrarian relations | Chưa có | — |  |
| 127 | P0 | Local power and state penetration | Chưa có | — |  |
| 128 | P0 | Historical occupations and class | Một phần | 9 tầng lớp (STRATA) | Chưa có mã nghề nghiệp có phiên bản. |
| 129 | P0 | Household income and wealth | Chưa có | — |  |
| 130 | P0 | 1836–1914 historical calibration | Một phần | dữ liệu 1836 có nguồn; benchmark 1870 |  |
| 131 | P0 | Historical data rights | Một phần | docs + màn hình Ghi công | Có ghi công (Natural Earth phạm vi công cộng, font OFL); chưa có manifest quyền theo từng tệp. |
| 132 | P0 | Health and land causal integration | Chưa có | — |  |
| 133 | P0 | Android cohort efficiency | Chưa có | — |  |
| 134 | P0 | State capacity vector | Chưa có | — |  |
| 135 | P0 | Tax realization pipeline | Một phần | src/engine/systems/economy.ts financeMonth (taxEff) | Thuế suất × GDP × hiệu quả hành chính → thu; chưa có thẩm định/nợ đọng/thất thoát/giữ lại địa phương. |
| 136 | P0 | Cadastre and property interests | Chưa có | — |  |
| 137 | P0 | Resource-rent fiscal stabilization | Chưa có | — |  |
| 138 | P0 | Agricultural productivity | Chưa có | — |  |
| 139 | P0 | Seasonal crop and food balance | Một phần | Country.famine | Thiếu lương thực hằng tháng; chưa có mùa vụ/tồn kho. |
| 140 | P1 | Rural market access and processing | Chưa có | — |  |
| 141 | P0 | Transport network connectivity | Một phần | src/engine/systems/economy.ts (railway, coastal access) | Đường sắt và ven biển tăng tiếp cận thị trường; chưa có mạng giao thông. |
| 142 | P1 | Local government and transfers | Chưa có | — |  |
| 143 | P1 | Resource-dependence diagnostics | Chưa có | — |  |
| 144 | P1 | Regional divergence/convergence | Chưa có | — |  |
| 145 | P0 | National development portfolio AI | Chưa có | — |  |
| 146 | P0 | Fiscal-agriculture-infrastructure causal trace | Chưa có | — |  |

## 3. Kiểm thử tự động hiện có (log thật: `npx vitest run`, 51/51 đạt ngày 2026-11-15)

| Tệp | Nội dung | Ánh xạ tới đặc tả |
|---|---|---|
| tests/modes.test.ts | Một engine hai chế độ; Lịch sử không ép kết quả; Sandbox tự do; Quan sát chạy AI cho mọi nước; can thiệp người chơi tạo rẽ nhánh; kế vị lịch sử chỉ ở chế độ Lịch sử | Feature 17–19, 76, 82; 16 §8 |
| tests/data.test.ts | Nguồn tồn tại, 5 nhãn chất lượng, không dùng thông tin sau 1836, liên minh/chiến tranh CoW tại ngày bắt đầu, benchmark dân số | Feature 70, 75, 83, 130 |
| tests/simulation.test.ts | Không NaN/âm 40 năm, tăng dân số trong dải hợp lý, AI không dao động, chiến tranh kết thúc, lưu/tải tiếp tục y hệt, war support không tự đầu hàng | Feature 31, 52, 59, 78 |
| tests/ui.test.ts | Nhãn bản đồ không chồng lấn và nằm trong nước mình (3 camera); thống kê thị trường lưu qua save; dòng ngân sách cộng đúng thu/chi | Feature 16 (map labels), 5, 6 |

## 4. Xung đột với đặc tả và kiểm tra niên đại

1. **War Support (73: "zero alone does not auto-capitulate") — ĐÃ SỬA.** `src/engine/systems/military.ts`: trước đây `exA > 92` tự khiến bên tấn công thua; nay chỉ khi đồng thời đang thua (`score < 0`). Kiểm thử: `tests/simulation.test.ts` › *war support* (bên kiệt sức nhưng đang thắng vẫn ở lại; kiệt sức và đang thua thì rút). Vẫn còn quy tắc dàn xếp theo điểm sau 12 năm — giới hạn của mô hình, ghi rõ ở đây.
2. **Trade** — engine không dùng trade route cũ; dùng một giá thế giới và nhập khẩu theo độ mở thương mại. Không vi phạm đặc tả, nhưng chưa có World Market nhiều hub.
3. **Niên đại công nghệ (đã rà soát `historical_data/technologies/technologies.json`).** Trường `historical_year` được định nghĩa là *lần áp dụng thực tế đáng kể đầu tiên*, không phải năm phát minh. Theo định nghĩa đó: đường sắt 1830 (Liverpool–Manchester), tàu hơi nước 1838 (vượt Đại Tây Dương), điện báo 1845, gây mê 1847, súng Minié 1850, lò Bessemer 1860, tàu bọc sắt 1860 (Gloire 1859 / Warrior 1860), súng máy 1885 (Maxim 1884), dreadnought 1906 — phù hợp. Điểm đơn giản hóa: luyện gang bằng than cốc ghi 1800 và đứng sau luyện sắt khuấy (1790) — đúng thứ tự áp dụng ở lục địa châu Âu, nhưng ở Anh than cốc có từ 1709 (Darby) và phổ biến từ thập niên 1750; máy in hơi nước ghi 1830 trong khi The Times dùng từ 1814. Không đổi dữ liệu vì chi phí nghiên cứu các công nghệ trước 1836 không bị ảnh hưởng; ghi nhận để xem xét khi mở rộng cây công nghệ.
4. **Nguyên thủ 1836** — `tests/data.test.ts` bảo đảm người đứng đầu và người kế vị tại 1/1/1836 không nhậm chức hoặc sinh sau ngày bắt đầu; kế vị lịch sử (Victoria 6/1837, Hannover tách theo luật Salic) được kiểm thử trong `tests/modes.test.ts`.

## 5. Quyền dữ liệu (gate Pass 10–16)

Dữ liệu đóng gói trong APK: Natural Earth (phạm vi công cộng), số liệu tổng hợp từ CoW/Maddison với trích dẫn, phông chữ OFL. Không đóng gói WVS, IPUMS, GSDB, SIPRI, RShapes, ACLED hay các bộ dữ liệu có hạn chế thương mại được nêu trong gói. Chưa có manifest quyền theo từng tệp (Feature 109/131 = Một phần).

## 6. Lộ trình đề xuất (theo thứ tự phụ thuộc, mỗi bước kèm build + test + ảnh runtime)

1. War support: thay quy tắc dàn xếp 12 năm bằng áp lực đàm phán có nguyên nhân hiển thị (phần không tự đầu hàng đã xong).
2. Pop cohort tối thiểu theo vùng (nghề × văn hóa × tôn giáo) với thu nhập/nhu cầu, giữ một sổ dân số duy nhất (Pass 15) — nền cho Feature 1–2, 24, 129.
3. Production methods + tiền lương + tuyển dụng (Feature 3, 23, 24) và sở hữu (4).
4. Năng lực xây dựng + hàng đợi (22), authority/bureaucracy (25), chuỗi thuế thẩm định→thu→nộp (135).
5. Diplomatic play có lịch trình (11), war support/mục tiêu giữa chiến tranh (31–32).
6. Journal entry có tiến độ (15, 56–57) và hàng đợi nghiên cứu (58).
Các hệ thống Pass 11–16 (quốc tế, xã hội, y tế, nông nghiệp theo mùa, mạng giao thông) cần thiết kế dữ liệu riêng và không nên làm trước khi bước 2–4 ổn định.
