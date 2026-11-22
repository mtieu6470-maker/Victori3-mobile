# CG-19 — Bộ kịch bản nghiệm thu ECON-02 / IND-02: sản lượng phản ứng lợi nhuận
Ngày: 2026-11-22  
Branch: `ccr-b27f3fb8-epfpd6`  
Phạm vi: kịch bản kiểm thử đo được và nguồn hiệu chỉnh lịch sử được CG-13 cho phép; đây là đề xuất nghiệm thu của ChatGPT, Claude giữ quyền quyết định kỹ thuật cuối cùng.

## 1. Kết luận / ranh giới bằng chứng

- Mục tiêu của ECON-02/IND-02 là chuyển sản lượng từ công thức gần như cố định theo số lao động/cấp công trình sang sản lượng có phản hồi theo doanh thu, chi phí đầu vào, tiền lương, tiền dự trữ và khả năng tiêu thụ.
- Engine hiện tại (đọc `src/engine/systems/economy.ts`) tạo sản lượng nông nghiệp/mỏ/lâm nghiệp/plantation theo lao động và năng suất; factory output dựa trên số lao động và recipe, chỉ bị giảm khi thiếu input. Giá điều chỉnh theo mất cân bằng cung/cầu; `marketStats.unsold` ghi phần hàng chưa dùng/xuất và chú thích hiện hành xác nhận hàng này bị mất cuối tháng, chưa có kho.
- Lương hiện là một phần cố định 34% value added (`monthlyWageBill = r.output * 0.34`), phân bổ theo wage premium. Chưa có bảng cash reserves riêng theo công trình, trạng thái profitability hay quyết định giảm lương/sa thải/ngừng hoạt động trong đoạn tính sản xuất được rà soát.
- CG-13 không xác nhận bất kỳ nguồn giá/lương/basket 1836 nào có license mở chuẩn và quyền phân phối thương mại rõ ràng đủ để nhúng trực tiếp vào game. GPIH, Allen–Unger, Gregory Clark và ACTD đều có giới hạn quyền như mô tả dưới đây. Vì vậy **không đưa số lịch sử cụ thể hoặc hệ số hiệu chỉnh giả định vào test oracle**. Chỉ dùng chúng làm nguồn nghiên cứu/đối chiếu nếu quyền được làm rõ; số liệu định lượng hiện cần ghi `unknown`.
- Các ngưỡng dưới đây là **acceptance thresholds do dự án đề xuất**, không phải công thức Victoria 3 và không phải số liệu lịch sử đã đo.

## 2. Dữ liệu lịch sử có thể dùng để hiệu chỉnh (theo CG-13)

| Nguồn CG-13 | Nội dung có ích | 1836 | Quyền sử dụng theo CG-13 | Kết luận cho game |
|---|---|---|---|---|
| GPIH / UC Davis (CG13-S01) | Giá, lương, một số household bundles đa khu vực | Một số chuỗi có range bao trùm 1836; phải mở workbook xác nhận observation chính xác | Không thấy license CC/CC0 chung; tải công khai không đồng nghĩa quyền phân phối | Không nhúng workbook hoặc số trích xuất vào asset pack khi chưa có phép; giá/lương chuẩn hóa: unknown |
| Allen–Unger Global Commodity Prices (CG13-S02) | Giá hàng hóa theo commodity-location, khoảng 1260–1914 | Range tổng thể bao trùm 1836; observation theo từng mặt hàng/địa điểm chưa xác nhận | Primary record không hiện license chuẩn; attribution ở catalogue thứ cấp không đủ xác lập quyền thương mại | Chỉ nghiên cứu/đối chiếu; không phân phối lại khi chưa làm rõ quyền |
| Gregory Clark, England data (CG13-S03) | Giá 22 nông sản, farm day wages, nominal/real wages | Range bao trùm 1836; cần xác nhận tần suất/hàng năm trong workbook | Không thấy license mở; không phân phối workbook | Không dùng làm test fixture có số raw khi chưa xin phép |
| Allen (2001), Allen et al. (2011) (CG13-S04/S05) | Phương pháp welfare ratio, basket, so sánh city-level giá/lương | Có khung phương pháp và các chuỗi lịch sử; không tạo panel toàn cầu 1836 | Publisher copyright; PDF học thuật không tự cấp quyền tái phân phối | Dùng phương pháp ở mức khái niệm, không chép bảng dữ liệu |
| GPIH bundles (CG13-S06) | Household basket / subsistence-respectability archetypes | Europe 1500–1832 kết thúc trước 1836; Lima có 1837, không phải 1836 | Không có license mở chung cho workbook | Không gọi là basket 1836; không nhập raw quantities |
| Mitchell IHS (CG13-S07) | Chỉ số wages, CPI/WPI, sản lượng và lao động theo quốc gia | Khung sách 1750–2010 nhưng coverage từng bảng không đồng nhất | Bản quyền Palgrave/Springer; không nhúng vào game | Chỉ tham khảo thư mục/bối cảnh; không sao chép bảng |
| ACTD 2.0 (CG13-S08) | Giá trị, lượng, unit values hàng xuất khẩu châu Phi | Range 1790–2020; phải xác nhận từng series | Miễn phí khi trích dẫn, nhưng license CC và quyền tái phân phối không được nêu rõ | Không coi unit value là retail price; không nhúng nếu chưa có xác nhận quyền |

### Những dữ liệu hiệu chỉnh hiện phải để unknown

- Giá bán lẻ/giá đầu ra năm 1836 theo từng hàng hóa, quốc gia và thị trường: `unknown` cho đến khi xác nhận observation và quyền.
- Lương danh nghĩa theo nghề/cấp bậc ở mọi quốc gia ngoài các chuỗi được kiểm tra workbook: `unknown`.
- Rổ tiêu dùng thống nhất toàn cầu năm 1836, số ngày làm việc/năm và quy mô hộ gia đình: `unknown`; không áp mặc định giả định 250 ngày của một nghiên cứu Trung Quốc cho mọi quốc gia.
- Welfare ratio có thể so sánh xuyên quốc gia: `unknown` nếu không tái lập đúng basket, local units, city, nghề và assumptions.
- Tỷ lệ lao động nông nghiệp / cơ cấu sản lượng Anh, Pháp, Phổ, Qing từ các nguồn CG-13 có license phân phối game rõ: **chưa xác định**. Không bịa tỷ lệ để lấp chỗ trống.
- Có thể sử dụng các tỷ lệ tổng hợp đã được nhóm dự án tự tính từ nguồn mở có license phù hợp trong tương lai, nhưng phải giữ công thức, dữ liệu đầu vào, version, attribution và kiểm tra tính đại diện.

## 3. Quy ước kiểm thử

1. Dùng seed cố định và fixture nhỏ, độc lập với world data, để kết quả deterministic và chạy nhanh.
2. Chạy baseline và intervention trên hai bản sao state giống hệt; chỉ thay một yếu tố ở mỗi scenario.
3. Đo theo tháng, không theo giờ: ECON-02/IND-02 là monthly system cho đến khi có cadence migration khác.
4. Các biến tối thiểu cần expose trong test instrumentation: output theo good/building, sales/used, unsold, market price, revenue, intermediate-input cost, wage bill, cash reserves, employment, active/idle/closed state, shutdown duration.
5. Tính profit nhất quán: `revenue(realized sales) - intermediate input costs - wages - operating costs - applicable taxes/tariffs`. Không tính unsold goods là revenue; không tính cùng một input cost hai lần.
6. Hysteresis và smoothing phải có để tránh thay đổi trạng thái theo một tháng nhiễu. Không yêu cầu giá hoặc sản lượng lập tức nhảy tới equilibrium.
7. Bảo toàn: POP headcount không tự biến mất do sa thải; người mất việc phải chuyển sang unemployed/available labour pool theo mô hình POP đã chọn. Tiền chỉ chuyển giữa payer/receiver hoặc đi vào/ra khỏi ledger theo hạng mục rõ; hàng vật chất phải cân bằng giữa opening inventory + production + imports và sales/consumption + exports + closing inventory + spoilage. Nếu không có inventory thì unsold phải được ghi rõ là waste/loss, không được biến mất khỏi audit ledger.

## 4. Kịch bản nghiệm thu (10)

Các ngưỡng số là ngưỡng test dự án, không phải lịch sử. Kịch bản factory dùng fixture 1 nhà máy với 100 worker-equivalents, một output good và recipe cố định; baseline output tháng đầu được chuẩn hóa là 100 unit. Kịch bản primary industry dùng fixture tương tự với 100 worker-equivalents. Mọi phép so sánh dùng cùng seed và cùng giá đầu vào ban đầu.

### ECON19-01 — Dư cung kéo dài làm giá và sản lượng giảm
- **Trạng thái ban đầu:** factory 100 workers, output 100 unit/tháng; demand 60; unsold 40; cash reserves 6 tháng operating cost; giá ban đầu 1.0.
- **Can thiệp:** giữ demand ở 60 trong 12 tháng, không có export capacity bổ sung.
- **Kỳ vọng:** giá giảm so với baseline; profit margin giảm; sau tín hiệu thua lỗ kéo dài, output tháng 12 giảm ít nhất 20% so với tháng 1; unsold tháng 12 giảm ít nhất 50% so với tháng 1. Không yêu cầu giá giảm ngay một tháng nếu smoothing/hysteresis đang hoạt động.
- **Khung thời gian:** 12 tháng.
- **Bất biến:** không bán quá lượng hàng khả dụng; unsold không được ghi nhận thành revenue; POP không giảm; cash ledger khớp opening + inflow − outflow = closing.

### ECON19-02 — Thiếu cung tạo tín hiệu mở rộng sản xuất
- **Trạng thái ban đầu:** factory 100 workers; output 70; demand 100; shortage 30%; cash reserves 6 tháng.
- **Can thiệp:** giữ demand 100 trong 12 tháng, cung cấp đủ input và lao động.
- **Kỳ vọng:** giá và profit margin cao hơn baseline; employment hoặc output tăng tối thiểu 10% trong 12 tháng, nhưng không vượt worker/input/building capacity; shortage giảm ít nhất 25% tương đối so với tháng 1.
- **Khung thời gian:** 12 tháng.
- **Bất biến:** không tạo worker, input hay building capacity; tiền đầu tư phải có nguồn tài trợ xác định.

### ECON19-03 — Cash reserves hấp thụ cú sốc ngắn hạn
- **Trạng thái ban đầu:** hai factory giống nhau, mỗi nhà máy có reserve 6 tháng chi phí; một factory có cú sốc giá đầu ra 2 tháng, factory còn lại là control.
- **Can thiệp:** giảm giá đầu ra 30% trong tháng 1–2, trở về bình thường tháng 3.
- **Kỳ vọng:** factory bị sốc ghi nhận lỗ và reserves giảm; không sa thải/đóng cửa ngay trong hai tháng đầu nếu reserve còn trên ngưỡng an toàn; sau khi giá phục hồi, hoạt động quay lại ổn định mà không cần reset thủ công.
- **Khung thời gian:** 6 tháng.
- **Bất biến:** reserve không âm; không phát sinh khoản vay ngầm; không ghi nhận doanh thu ở giá cũ trong giai đoạn sốc.

### ECON19-04 — Lỗ kéo dài kích hoạt chuỗi điều chỉnh theo thứ tự
- **Trạng thái ban đầu:** factory có reserves 2 tháng; revenue 80% total costs; workforce 100; output 100.
- **Can thiệp:** giữ doanh thu ở mức 80% chi phí trong 9 tháng.
- **Kỳ vọng:** chuỗi trạng thái có thể quan sát: reserve giảm → wage pressure/giảm wage offer hoặc wage arrears theo policy → layoffs/giảm employment → giảm output → nếu vẫn không thể hoạt động thì pause/close. Không được đảo thứ tự bằng cách đóng cửa trước khi áp dụng buffer đã định nghĩa, trừ trường hợp không có input/force majeure.
- **Khung thời gian:** 9 tháng.
- **Bất biến:** không chi lương vượt quỹ tiền được phép; số người có việc + thất nghiệp + nhóm POP khác = tổng POP; mọi khoản lương nợ phải được ghi là liability nếu mô hình cho phép nợ lương.

### ECON19-05 — Input shortage giảm output mà không tạo phantom goods
- **Trạng thái ban đầu:** tool works output 100 tools, yêu cầu 40 steel và 15 timber; market chỉ có 20 steel và đủ timber.
- **Can thiệp:** giữ steel availability ở 50% nhu cầu trong 6 tháng.
- **Kỳ vọng:** output tools không vượt 50% mức full-input output (nếu recipe tuyến tính); steel consumed khớp lượng input thực tế; wage/employment của phần worker idle phản ánh rõ; không tạo tools cho phần input thiếu.
- **Khung thời gian:** 6 tháng.
- **Bất biến:** material ledger cân bằng theo good; không trừ planned input như thể đã tiêu thụ toàn bộ; downstream factory chỉ nhận actual upstream output.

### ECON19-06 — Giá input tăng làm biên lợi nhuận và sản lượng co lại
- **Trạng thái ban đầu:** factory profit margin +10%, reserves 6 tháng; recipe có hai input.
- **Can thiệp:** giá một input tăng 50% trong 3 tháng, sản lượng và cầu đầu ra giữ nguyên.
- **Kỳ vọng:** input cost tăng, margin giảm; output/employment có thể giảm sau policy lag nếu factory chuyển sang lỗ; nếu vẫn có lãi thì không được cắt output chỉ vì giá input tăng. Sau khi input price trở về, hoạt động hồi phục có hysteresis.
- **Khung thời gian:** 6 tháng.
- **Bất biến:** không thay đổi recipe hoặc lượng input vật lý chỉ vì giá thay đổi; không có tiền/đầu vào âm.

### ECON19-07 — Một tháng nhiễu không gây đóng/mở liên tục
- **Trạng thái ban đầu:** factory ổn định với margin +5%, reserves 4 tháng.
- **Can thiệp:** xen kẽ 1 tháng margin −2%, 2 tháng +5%, lặp 4 chu kỳ.
- **Kỳ vọng:** không quá 2 lần chuyển trạng thái active/idle/closed trong 12 tháng; không oscillate output trên 25% giữa các tháng nếu cầu và capacity không đổi; có deadband/minimum duration hoặc cơ chế smoothing có thể kiểm tra.
- **Khung thời gian:** 12 tháng.
- **Bất biến:** tổng employment không vượt POP/capacity; không reset reserves khi đổi trạng thái.

### ECON19-08 — Sa thải không làm biến mất POP và không nhân đôi thu nhập
- **Trạng thái ban đầu:** POP 1,000; 100 người-equivalent làm trong factory; wages và employment đã được ghi nhận riêng.
- **Can thiệp:** factory sa thải 40 người-equivalent.
- **Kỳ vọng:** employment giảm 40; unemployed/available labour tăng tương ứng theo thiết kế cohort; tổng POP vẫn 1,000; wage bill giảm theo số lao động trả lương; household income chỉ nhận tiền lương thực trả, không vừa nhận wages vừa nhận trọn GDP share trùng lặp.
- **Khung thời gian:** 1–3 tháng.
- **Bất biến:** tổng POP bảo toàn; tiền lương được ghi đúng một lần; không tự thay đổi culture/strata/religion do thất nghiệp.

### ECON19-09 — Đóng cửa có thể phục hồi khi điều kiện kinh doanh trở lại
- **Trạng thái ban đầu:** factory reserves 0, margin âm 6 tháng, output bị giảm tới mức không hoạt động.
- **Can thiệp:** tháng 1–3 demand/price thấp; từ tháng 4 tăng demand để factory có projected positive margin và có đủ input, working capital.
- **Kỳ vọng:** factory không tiếp tục trả chi phí vận hành như đang active nếu đã đóng; khi điều kiện dương ổn định đủ reopening window, factory có thể tuyển lại/khởi động; không tự hồi sinh nếu thiếu input, worker hoặc cash.
- **Khung thời gian:** 9 tháng.
- **Bất biến:** không tạo reserves; reopening phải có chi phí/nguồn tiền và worker hợp lệ; building level không tự tăng.

### ECON19-10 — Nhiều nhà máy cạnh tranh input, kết quả không phụ thuộc thứ tự duyệt
- **Trạng thái ban đầu:** 2 factory cùng stage, cùng recipe, mỗi cái cần 60 steel nhưng thị trường có 60 steel.
- **Can thiệp:** đảo thứ tự hai factory trong array và chạy lại với cùng seed.
- **Kỳ vọng:** nếu ưu tiên phân bổ là proportional/fair, mỗi factory nhận cùng share (30 steel) và output tương ứng; nếu game chọn priority policy khác thì phải công bố policy và đảm bảo deterministic, không phụ thuộc thứ tự container vô tình.
- **Khung thời gian:** một tháng, lặp 10 seeds.
- **Bất biến:** tổng steel consumed không quá 60; tổng output bằng tổng production theo input thực nhận; hai thứ tự input cho cùng kết quả theo policy đã định.

## 5. Chỉ số đo dao động và cảnh báo regression

Theo dõi cho từng building/good theo tháng:
- `output_cv_12m = stddev(output[12]) / max(mean(output[12]), epsilon)`.
- `price_cv_12m`, `wage_cv_12m`, `employment_cv_12m` tương tự.
- `state_flips_12m`: số lần active ↔ idle ↔ closed.
- `output_max_step_pct`: max `abs(output[t]-output[t-1]) / max(output[t-1], epsilon)`.
- `unsold_ratio = unsold / max(supply, epsilon)`.
- `reserve_runway_months = reserves / max(monthly_operating_cost, epsilon)`.
- `loss_streak_months`, `recovery_lag_months`, `layoff_rate`, `reopen_count`.

Ngưỡng cảnh báo ban đầu cho fixture ổn định (tune sau khi chạy baseline):
- `state_flips_12m <= 2` trong ECON19-07.
- Không cho `output` đổi dấu; `output >= 0`.
- `output_max_step_pct <= 0.25` khi cầu/capacity/input không có cú sốc tương ứng.
- `reserve_runway_months >= 0` và finite.
- Không để `unsold_ratio` tăng liên tục trong khi output bị giảm và demand không đổi; nếu có tăng, giải thích được bằng lag/inventory policy.
- Kiểm tra determinism: cùng seed + fixture + intervention cho cùng serialized economy state byte-for-byte hoặc canonical JSON equality.

## 6. Gợi ý tổ chức test

- Unit tests cho pure functions: profitability, target utilization, reserve update, wage adjustment, staffing target, state transitions.
- Scenario tests chạy 12–24 tháng với fixtures nhỏ, không dùng toàn bộ world để giảm flaky/performance cost.
- Property tests: material balance, cash balance, POP conservation, no negative stock/reserves, output bounded by capacity and input.
- Regression baseline: lưu golden metrics cho 1836 seed 1 trước khi bật ECON-02; không chấp nhận thay đổi lịch sử ban đầu không giải thích.
- Performance: benchmark 274 entities / full world; không thêm nested all-building × all-good scans mỗi giờ vì economy chỉ chạy tháng.
- Telemetry test-only: expose reasons for output reduction, layoffs, idle, closure and reopening. UI không cần hiển thị toàn bộ ledger trong gameplay.

## 7. Acceptance gate đề xuất cho Claude

ECON-02/IND-02 chưa được coi là hoàn thành chỉ vì một scenario oversupply pass. Tối thiểu:
1. 10/10 scenarios pass; deterministic.
2. Material, cash and POP invariants pass.
3. No phantom intermediate goods, no double-counted revenue/wages.
4. No one-month oscillation; explicit hysteresis and reopening behavior.
5. Historical calibration fields with no license-cleared source remain `unknown`; do not hardcode fabricated ratios.
6. Full-world performance does not regress beyond the agreed budget; report hardware/environment and measured p50/p95.
7. Claude records final design choice and any deliberately deferred cases in ECON-02/IND-02 spec.

## 8. Nguồn nội bộ

- `docs/research/history/CG13_1836_PRICES_WAGES_BASKETS_SOURCES_VI.md` — source register and licensing caveats.
- `docs/research/vic3/CG17_OVERSUPPLY_PROFITABILITY_VI.md` — official Victoria 3 source synthesis; project design vs V3 mechanics distinction.
- `src/engine/systems/economy.ts` — current supply, demand, prices, wages, output and unsold ledger.
- `src/engine/types.ts` — current goods, POP strata, market statistics and state fields.
- `src/engine/simulation.ts` — monthly economy cadence and deterministic ordering.

**Phân biệt cuối cùng:** Những scenario và ngưỡng ở tài liệu này là acceptance design của Victori3 Mobile. Chúng không khẳng định Victoria 3 dùng đúng chuỗi sa thải/đóng cửa hoặc các ngưỡng định lượng này.
