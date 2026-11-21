# ADAPTIVE HOURLY CLOCK — đặc tả kỹ thuật CLOCK-01 (AUTO 12h/s → 6h/s)

- Task: **CLOCK-01** (execution plan `docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md`, milestone M0).
- Owner directive: `docs/coordination/OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md` §2.
- Tác giả/integrator: Claude Code (Project Director). Trạng thái: **IMPLEMENTED — implementer self-review; chưa có Android device benchmark**.
- Base trước khi sửa: `94d0d28d78cf8184b41df6b70ae4e7c55a85d38c` (monthly tick, save schema v2).

## 1. Audit trạng thái cũ (trước CLOCK-01)

| Thành phần | Hành vi cũ | Vấn đề so với chỉ thị |
|---|---|---|
| `src/engine/simulation.ts` `stepMonth()` | Đơn vị thời gian duy nhất là tháng (`st.tick` = chỉ số tháng). | Không có giờ/ngày canonical; không có cadence contract. |
| `src/ui/game/controller.ts` | `SPEED_MS` 8000/5000/3500/2500/2000 ms mỗi tháng; RAF tối đa 1 tháng/callback; thời gian dư bị bỏ. | Không phải 12h/s hay 6h/s; tốc độ dạng "1–5"; không có AUTO/governor; không pause khi background. |
| `src/engine/save.ts` | Schema v2: không có canonical time ngoài `tick`. | Không thể lưu giữa tháng; không có cadence phase. |
| DEV-006/DEV-007 tests | Bao phủ RAF/fast-forward theo tháng và biên 12/2026 theo tháng. | Biên chiến dịch phải ở mức giờ (23:00 31/12/2026). |

Đo desktop (Node 22, `npx tsx tools/sim-cli.ts --years 10`): ~64 ms/tháng cho toàn pipeline tháng.

## 2. Thời gian canonical

- `GameState.clock.hour`: số nguyên giờ game kể từ `1836-01-01T00:00` (giờ 0). Đây là **nguồn chân lý duy nhất** về thời gian.
- `st.tick` (chỉ số tháng, 0 = 1/1836) và `st.date` được suy ra và **được kiểm tra** khớp với `clock.hour` (`assertClockConsistent`, `validateClockState`); lệch → lỗi, không tự sửa.
- Lịch Gregorian proleptic, số học nguyên chính xác (`src/engine/clock/calendar.ts`): 1836 và 2000 nhuận, 1900 không nhuận; 1/1/1836 là thứ Sáu (ISO weekday 5).
- Chiến dịch: 69.762 ngày = 1.674.288 giờ. Giờ chơi cuối cùng `CAMPAIGN_FINAL_HOUR = 1.674.287` = **2026-12-31T23:00**. Thời điểm 2027-01-01T00:00 và công việc tháng 1/2027 **không bao giờ chạy**.

## 3. Scheduler và cadence contracts

`advanceHour(st)` tăng đúng 1 giờ rồi chạy, tại thời điểm mới, theo thứ tự cố định:

1. hourly phase (mọi giờ);
2. daily phase (00:00);
3. weekly phase (thứ Hai 00:00);
4. monthly phase (ngày 1, 00:00): `tick += 1`, `date`, toàn bộ `SYSTEMS` theo đúng thứ tự cũ;
5. yearly phase (1/1 00:00, sau monthly): `annual-statistics` (`sampleYear`);
6. finalisation sau monthly: `refreshPopulationState`.

| Subsystem | Cadence hiện tại | Input → output | Ghi chú |
|---|---|---|---|
| economy, population, politics, secession, technology, diplomacy, military, events, ai, divergence | monthly | GameState → GameState (RNG chung `st.rng`) | Giữ nguyên thứ tự/RNG ⇒ kết quả tại cùng canonical time giống hệt runtime tháng cũ (test tương đương byte-for-byte 14 tháng, cả hai mode). |
| annual-statistics (`sampleYear`) | yearly | country stats → `st.history` | Trước đây nằm trong `stepMonth` khi `m === 1`; thứ tự giữ nguyên. |
| hourly / daily / weekly | **rỗng** | — | Chưa có subsystem nào được di chuyển xuống cadence mịn hơn. Một hệ thống chỉ được thêm vào sau khi có contract (inputs/outputs/order/RNG stream) và test (CLOCK-03). |

Không có batching/skip: mọi giờ được xử lý tuần tự; các phase rỗng chỉ tốn vài micro giây. Batching tương lai chỉ được phép khi có test chứng minh tương đương với bước từng giờ.

API: `advanceHour`, `advanceHours(st, n, shouldYield?)` (dừng giữa các giờ, không bao giờ cắt đôi giờ), `stepMonth` (tương thích cũ: chạy từng giờ tới hết ranh giới tháng kế tiếp; trả `false` không đổi state khi ranh giới nằm ngoài chiến dịch), `hoursToNextMonth`, `positionAtMonthStart` (chỉ cho test/tool).

## 4. Pacing thời gian thực (ngoài engine)

`src/engine/clock/pace.ts` (thuần, không DOM):

- Preset cố định: 3 (0.25x), 6 (0.5x), 12 (1x), 24 (2x), 48 (4x) giờ game/giây. Mặc định **AUTO**.
- Accumulator số nguyên: µs thực × (giờ/giây) ⇒ đơn vị 1e-6 giờ; không trôi (test 10 phút frame 60 fps ở mọi preset).
- Mỗi callback chỉ ghi có tối đa 250 ms thực (khoảng trống dài không thành burst catch-up); backlog giờ nợ bị chặn ở 1 giây theo tốc độ hiện hành. Phần thời gian không ghi có được cộng vào `droppedRealMs` = lag hiển thị. **Không giờ nào bị bỏ qua**: game chạy chậm hơn, không nhảy cóc.

`src/ui/game/controller.ts`:

- RAF gọi `tickFrame(t)`: ghi có thời gian → xử lý giờ nợ với ngân sách `SIM_FRAME_BUDGET_MS = 8` ms (kiểm tra giữa các giờ) → phần còn lại ở backlog → đưa số đo vào governor → emit UI (throttle 250 ms, emit ngay khi qua ranh giới tháng hoặc đổi trạng thái tốc độ).
- Pause/AUTO/fixed; phím 1–5 = 3/6/12/24/48 h/s, 0 hoặc A = AUTO; nút HUD xoay vòng AUTO → 3 → 6 → 12 → 24 → 48.
- `stepOnce` (tới hết tháng), `stepDay` (24 giờ), `fastForward(months)` giữ nguyên cơ chế chunk + invalidation của DEV-006.
- Lifecycle: `visibilitychange` hidden ⇒ pause an toàn, xóa thời gian nợ; chỉ tiếp tục khi người chơi bấm. Không có tiến trình offline.
- Lựa chọn AUTO/fixed được lưu ở `localStorage` và trong save envelope (`clockPreference`), **không** nằm trong GameState nên không ảnh hưởng hash tất định.

## 5. AUTO governor (12h/s ↔ 6h/s)

`src/engine/clock/governor.ts`, thuần, không dùng lịch:

- Cửa sổ đo 2 s. Cửa sổ quá tải nếu: tỷ lệ thời gian mô phỏng > 0,45; hoặc > 50% frame bị chặn bởi ngân sách khi vẫn còn giờ nợ; hoặc lag > 2% thời gian thực; hoặc > 25% frame dài (> 50 ms) trong khi mô phỏng chiếm > 15%.
- 12 → 6 sau 3 cửa sổ quá tải liên tiếp (~6 s). 6 → 12 sau 15 cửa sổ liên tiếp (~30 s) có headroom dự phóng (tỷ lệ mô phỏng × 2 < 0,2, không saturation, không lag). Dải trễ ngăn dao động (test).
- Nếu ở 6h/s vẫn quá tải liên tục: trạng thái `overloaded`, hiển thị "quá tải (dưới 6 giờ/giây)"; vẫn xử lý đủ mọi giờ.
- Preset cố định không bao giờ bị đổi tốc độ; chỉ báo `fixed_overloaded`.
- Trạng thái governor là runtime-only; sau load/new game AUTO bắt đầu lại ở 12h/s và đo lại thiết bị hiện tại.
- **Ngưỡng là PROVISIONAL**: suy ra từ đo desktop và ngân sách frame 60 fps. Phải hiệu chỉnh bằng benchmark Android (task CLOCK-BENCH-ANDROID) trước release. Nhiệt độ thiết bị chưa đo được trong WebView; cần plugin native (CLOCK-02b) nếu muốn đưa thermal vào governor.

## 6. Save schema v3

- `SAVE_SCHEMA_VERSION = 3`; state có `clock: { hour }`.
- Migration tuần tự thuần (không RNG, không chạy mô phỏng): v1 → v2 (cohort projection, DEV-005) → v3 (`clock.hour = monthStartHour(tick)`, vì save tháng luôn được lấy tại ranh giới tháng sau khi hệ thống tháng đã chạy). Test: tiếp tục sau migration giống hệt chạy liên tục.
- Từ chối (không sửa): thiếu clock, giờ âm/thập phân/ngoài chiến dịch, giờ không khớp tick/date, save v2 mang trường clock mâu thuẫn.
- Lưu giữa tháng được hỗ trợ; tiếp tục sau save/load giữa tháng giống hệt (test).
- Sub-hour credit của pacing không được lưu (không phải trạng thái mô phỏng; tối đa < 1 giờ thời gian thực bị bỏ khi load).

## 7. Đo đạc (desktop, không phải Android)

Lệnh: `npx tsx tools/clock-bench.ts --years 0,10,30 --sample-months 12 --out <file>`. Kết quả được ghi trong rolling report. Ý nghĩa: với chi phí ranh giới tháng ~60–70 ms desktop, mô phỏng chỉ chiếm < 0,1% một core ở 12h/s; rủi ro thực là **giật frame tại ranh giới tháng** (một khối ~64 ms desktop, có thể 150–300 ms trên điện thoại) do mô phỏng còn chạy trên UI thread.

## 8. Chưa làm / tiếp theo

| ID | Nội dung |
|---|---|
| CLOCK-02 | Chuyển mô phỏng sang Web Worker (command queue có sequence ID, snapshot/read-model cho UI, hủy/invalidate khi load) để ranh giới tháng không chặn UI thread. |
| CLOCK-02b | Hook lifecycle native Capacitor (`App` pause/resume) + autosave khi vào nền; khả năng đọc thermal nếu có API. |
| CLOCK-03 | Di chuyển subsystem sang cadence mịn khi domain cần (daily: shipments, supply/attrition, migration flow; hourly: movement/battle substep), mỗi cái có contract + test tương đương/tất định; trải đều công việc tháng nếu mô hình cho phép. |
| CLOCK-BENCH-ANDROID | Benchmark trên thiết bị thật (iQOO Z10 Turbo cần owner cho phép cài APK) ở 12h/s và 6h/s, world late-game đại diện; hiệu chỉnh ngưỡng governor. |
| CLOCK-04 | Hàng đợi sự kiện theo giờ (scheduled events, treaty expiry, construction completion theo giờ) được lưu trong save. |
