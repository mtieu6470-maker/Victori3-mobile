# P0 — Thiết kế đồng hồ mô phỏng và nhịp độ thời gian

**Ngày:** 2026-11-20  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** experiment/vic3-visual-upgrade  
**Trạng thái:** CLK-A DAILY CALENDAR + RAF-INDEPENDENT TIMER COMMITTED (CI PENDING); CLK-B SIX-HOUR TASK SCHEDULER NOT IMPLEMENTED  
**Phạm vi:** phân tích và thiết kế P0 theo phản hồi chơi thử. Tài liệu này không thay đổi engine, gameplay, UI, save schema hoặc test.

---

## 1. Tóm tắt điều hành

Lỗi pacing không chỉ là một hệ số tốc độ đặt quá cao. Kiến trúc hiện tại dùng requestAnimationFrame (RAF) làm đồng hồ kích hoạt simulation. Đặc biệt, speed 5 tiến đúng một tháng mỗi frame. Vì vậy tốc độ lịch phụ thuộc FPS/refresh rate và tải thiết bị — vi phạm yêu cầu độc lập giữa simulation time và rendering.

**Khuyến nghị theo lát cắt, không viết lại toàn bộ engine:**

1. **CLK-A — tách wall-clock scheduler khỏi render loop**, ban đầu vẫn giữ monthly simulation tick để giảm phạm vi thay đổi. RAF chỉ vẽ UI; scheduler riêng quyết định khi nào phát logical simulation step. Không tự đặt tốc độ lịch mới trước khi đo đối chiếu.
2. **CLK-B — lập lịch tác vụ theo cadence**, chỉ sau khi có đặc tả cho từng hệ thống. Victoria 3 dùng regular six-hour tick cùng các cadence yearly/monthly/weekly/daily; không thể chỉ đổi một tháng thành bốn tick/ngày trong khi vẫn chạy toàn bộ pipeline tháng bốn lần.
3. **CLK-C — chuyển compute nặng sang Worker nếu profiling chứng minh cần thiết**, với state ownership, command boundary, snapshot và thứ tự deterministic được thiết kế rõ.
4. **Lifecycle/save-load:** vào nền phải auto-pause; quay lại vẫn paused; không cộng bù thời gian nền. Save lưu logical simulation state, không lưu wall-clock hoặc accumulator của thiết bị.

Mọi tốc độ wall-clock mới phải được chọn sau khi đo game-days/game-months per real second trong Victoria 3 và Victori3 Mobile trên cấu hình có thể so sánh. Không dùng con số cảm tính làm tiêu chuẩn nghiệm thu.

## 2. Bằng chứng code hiện tại

Các SHA dưới đây được đọc từ experiment branch tại checkpoint 32fac4d5ca30b559308dd3fabd97e126d0d3b841. Chúng là blob SHA của file, không phải commit SHA.

| File | Blob SHA | Phạm vi xác minh |
|---|---|---|
| src/ui/game/controller.ts | 491625530308c0feeff3dbba7bec1cad8bf3d17e | Speed constants, RAF loop, pause/resume, fast-forward |
| src/engine/simulation.ts | 19b6dd1e6487310e1694c56dc21c1daae9bcb422 | Monthly step pipeline, campaign end |
| src/engine/core.ts | b3eea8bcd2eb81ed17cd704973707e39142f080b | tickToDate, dateToTick |
| src/engine/init.ts | b17aa4345b8576ea386f856eb92d9f916125bddd | Initial date and tick |
| src/ui/App.tsx | 271e562a68e6ca7f8d1bacd94d9ec1696ac41eb5 | Speed UI, visibility/pagehide pause, autosave |
| src/ui/game/storage.ts | 826cba5c0b634ea752844af846719caef31da25b | IndexedDB transaction completion |
| src/engine/save.ts | eaff50ef9c5e64662b1fdfd58d2eade306b9e445 | Save envelope and in-game savedAt |
| android/.../MainActivity.java | 73469ff368e28e0d0ec4dd4a5498b4dcb01cd68a | Native activity lifecycle overrides |

### 2.1. Cơ chế hiện tại

Trong controller.ts:

- Speed = 1 | 2 | 3 | 4 | 5.
- SPEED_MS = {1: 2000, 2: 1000, 3: 500, 4: 220, 5: 0} milliseconds per game month.
- start() dùng requestAnimationFrame(loop).
- Mỗi frame, nếu accumulator đủ ngưỡng, code chỉ gọi tối đa một stepMonth().
- Speed 5 đặt ngưỡng bằng 0 nên mỗi RAF callback thực hiện một tháng mô phỏng.
- Speed 1–4 đặt khoảng wall-clock danh nghĩa giữa các tháng, nhưng callback vẫn bị giới hạn theo RAF; accumulator bị clamp sau mỗi bước.
- setSpeed() chỉ đổi speed; chưa có quy tắc rõ ràng về fractional progress/accumulator khi đổi tốc độ.
- stepMonth() chạy đồng bộ trên JavaScript thread gọi RAF.

Trong simulation.ts:

- stepMonth() tăng st.tick thêm một đơn vị, rồi gọi tickToDate(st.tick).
- Một tick hiện tương đương một tháng.
- Mỗi monthly step gọi tuần tự economy, population, politics, secession, technology, diplomacy, military, events, AI và divergence; tháng 1 còn gọi yearly sampling.
- GAME_END_TICK = (1936 - 1836) * 12; January 1936 là mốc kết thúc, không chạy thêm monthly systems pass.
- Historical và Sandbox dùng chung monthly pipeline.

Trong core.ts, tickToDate(t) ánh xạ tick thành tháng lịch từ January 1836; init.ts khởi tạo date = 1836-01, tick = 0.

### 2.2. Hệ quả định lượng từ cấu hình code — chưa phải benchmark thiết bị

Bảng này chỉ chuyển đổi hằng số hiện có sang đơn vị lịch. Không phải kết quả đo Android và không xác nhận đây là các tốc độ người chơi nên dùng.

| Speed | Ngưỡng danh nghĩa | Tháng game/giây danh nghĩa | Năm game/giây tương đương | Thời gian danh nghĩa cho 100 năm |
|---|---:|---:|---:|---:|
| 1 | 2,000 ms/tháng | 0.5 | 0.0417 | 40 phút |
| 2 | 1,000 ms/tháng | 1.0 | 0.0833 | 20 phút |
| 3 | 500 ms/tháng | 2.0 | 0.1667 | 10 phút |
| 4 | 220 ms/tháng | 4.545 | 0.3788 | 4.4 phút |
| 5 | 1 tháng/RAF | phụ thuộc refresh/FPS | phụ thuộc refresh/FPS | không ổn định |

Speed 5 có quan hệ trực tiếp với số callback mỗi giây. Nếu callback đạt 60 lần/giây, giới hạn lý thuyết từ scheduler là 60 tháng/giây; ở 120 lần/giây là 120 tháng/giây. Simulation compute và rendering có thể làm tốc độ thực thấp hơn, nhưng đó chính là sự phụ thuộc phần cứng cần loại bỏ.

Với speed 1–4, nếu event loop hoặc frame bị đình trệ lâu, code chỉ xử lý một tháng ở callback kế tiếp rồi clamp accumulator về tối đa một ngưỡng. Phần elapsed dư có thể bị bỏ đi thay vì được xử lý hoặc ghi nhận. Đây là nguy cơ **mất simulation time khi stall**, khác với yêu cầu “không chạy bù vô hạn”.

### 2.3. Lifecycle, autosave và save/load hiện tại

- App.tsx gắn visibilitychange và pagehide; khi document hidden/pagehide, code gọi game.setPaused(true) rồi yêu cầu autosave.
- Autosave cũng được gọi mỗi 3 simulated months. Ghi dữ liệu qua IndexedDB; helper chỉ resolve khi transaction hoàn tất.
- Tuy nhiên, event handler lifecycle không đợi IndexedDB promise hoàn tất trước khi WebView/process bị suspend hoặc terminate. Cần kiểm chứng Android thật; không coi lời gọi autosave là bằng chứng save đã commit.
- Khi start() được gọi lại, controller reset last và acc. Đây là cơ chế ngăn một phần thời gian nền bị cộng dồn trong đường chạy hiện tại.
- Native MainActivity hiện chỉ override onCreate và onWindowFocusChanged; chưa thấy native AppState bridge ở file này. package.json không khai báo @capacitor/app. Không được suy ra Android lifecycle đã được xử lý đầy đủ chỉ vì có browser visibility listeners.
- Save envelope hiện lưu savedAt là ngày trong game (YYYY-MM), không phải wall-clock timestamp. GameState lưu date và monthly tick; chưa có logical sub-month scheduler state.

## 3. Đối chiếu cơ chế tham chiếu Victoria 3

Nguồn chính thức:

- Paradox Interactive, **Victoria 3 — Dev Diary #76: Performance**, 2023-02-22: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-76-performance
- Các phần liên quan: “What is performance”, “Content of a tick”, “tick tasks”, “threads” và “Improvements in 1.2”.

Paradox phân biệt rõ **tick speed** với FPS. Theo diary, một regular tick của Victoria 3 tương đương sáu giờ game (một phần tư ngày); ngoài regular tick, hệ thống có yearly, monthly, weekly và daily cadence. Một tick task là nhóm thao tác có lịch chạy và dependency với các task khác. Các task tốn kém không nhất thiết chạy ở mọi regular tick; nhiều task đắt nhất chạy theo weekly cadence. Diary cũng mô tả session/game-logic thread, task threads, main/UI thread và render thread, cùng các điểm đồng bộ để UI chỉ đọc state nhất quán.

Đây là mô tả kỹ thuật chính thức xuất bản năm 2023; không phải benchmark wall-clock hiện tại, cũng không cung cấp mapping công khai đủ để sao chép milliseconds-per-speed. Không dùng diary này để tự đặt tốc độ 1–5 của Victori3 Mobile.

**Kết luận parity:** Victori3 Mobile hiện là monthly-step simulation gắn vào RAF. Chỉ chỉnh SPEED_MS có thể giảm cảm giác quá nhanh, nhưng không giải quyết FPS coupling, không xử lý backlog đúng cách và không tạo cadence mô phỏng ngày/tuần như hệ thống tham chiếu.

## 4. Yêu cầu thiết kế bắt buộc

### 4.1. Clock contract

- Tách ba khái niệm: wall-clock elapsed (monotonic), logical game time và render/frame time.
- RAF chỉ render/đọc snapshot; không quyết định số bước mô phỏng cần tiến.
- Logical simulation step phải deterministic, có index tăng đơn điệu và không phụ thuộc FPS/refresh rate.
- Không sử dụng Date.now() để quyết định simulation progress. Wall-clock scheduler dùng monotonic source; logical calendar là nguồn sự thật trong save.
- Speed 0 là pause hoàn toàn: game date, simulation state, RNG, counters và task queue không thay đổi.
- Speed 1–5 có mapping tài liệu hóa và đo được, nhưng giá trị cuối cùng chỉ chốt sau benchmark so sánh Victoria 3.
- Đổi tốc độ không được tự tạo một tick; quy định rõ xử lý fractional progress/accumulator.
- Hai lần chạy cùng seed, cùng command sequence và cùng số logical ticks phải cho cùng state bất kể frame cadence hoặc thiết bị.

### 4.2. Backlog và overload

- Không drop logical ticks chỉ vì frame chậm hoặc một tác vụ UI dài.
- Không xử lý bù vô hạn trong một callback gây ANR/jank.
- Scheduler giới hạn công việc mỗi slice và giữ backlog/debt rõ ràng; nếu backlog vượt ngưỡng an toàn đã đo, phải pause an toàn hoặc thông báo slowdown, không xóa debt im lặng.
- Không cho phép chạy chồng hai batch mô phỏng; phải có một authoritative scheduler/worker và thứ tự task xác định.
- UI render có thể bỏ frame; logical simulation step không được bỏ.
- Khi app bị ẩn hoặc chuyển nền, pause và đặt lại wall-clock baseline khi quay lại; không chạy bù thời gian app ở nền.

### 4.3. Lifecycle và autosave

- Xử lý browser visibilitychange/pagehide và Android/Capacitor AppState khi có cầu nối phù hợp.
- Khi background: yêu cầu pause; yêu cầu checkpoint save; ghi rõ trạng thái IndexedDB transaction nếu còn thời gian. Không tuyên bố save đã commit chỉ vì đã gọi hàm save.
- Khi foreground/resume: app mở ở trạng thái paused; chỉ tiếp tục sau hành động người chơi.
- Process death, renderer recreation và app bị hệ điều hành thu hồi không được làm campaign tự nhảy tháng/năm.
- Trạng thái “đang lưu” và autosave failure phải quan sát được; không chặn UI thread bằng JSON serialization hoặc I/O lớn nếu profiling cho thấy nguy cơ.

### 4.4. Scheduler cadence — đề xuất hai bước

**A. Refactor scheduler trước, giữ monthly simulation semantics**

- Thay RAF-coupled tick driver bằng scheduler fixed-step độc lập.
- Giữ stepMonth và monthly task order tạm thời để giới hạn phạm vi.
- Đây là lát cắt sửa timing architecture, không phải tuyên bố parity với Victoria 3.

**B. Nâng độ phân giải logical calendar có kiểm soát**

- Thiết kế SimulationClock với ngày/giờ game và monotonic logical step.
- Đánh giá regular six-hour step làm reference target; calendar events và periodic systems dùng scheduler cadence (daily/weekly/monthly/yearly) thay vì chạy toàn bộ hệ thống ở mọi sub-day step.
- Xây task dependency graph: task frequency, prerequisites, stable ordering, deterministic RNG consumption và state mutation ownership.
- Không nhân bốn số lần chạy của monthly pipeline hiện tại và gọi đó là six-hour simulation.
- Giữ monthly tick legacy hoặc thay đổi semantics của GameState.tick phải được quyết định trong thiết kế migration riêng. Không âm thầm đổi nghĩa field đang được dùng bởi cooldown, logs, histories, wars, laws, tests và save files.

## 5. Kiến trúc kỹ thuật đề xuất

### 5.1. Các lớp trách nhiệm

| Thành phần | Trách nhiệm | Không được làm |
|---|---|---|
| MonotonicClock | Đọc elapsed wall time ổn định | Không ghi wall time vào campaign state |
| SimulationScheduler | Chuyển elapsed thành số logical steps theo speed; giữ backlog; áp dụng pause/resume | Không gọi từ RAF để “mỗi frame = một tick” |
| SimulationRunner | Chạy fixed logical steps có giới hạn mỗi slice | Không drop ticks; không chạy chồng |
| SimulationTaskScheduler | Chọn daily/weekly/monthly/yearly/regular tasks theo lịch | Không phụ thuộc thứ tự object/array không ổn định |
| GameState | Nắm logical date, seed/RNG và state ảnh hưởng tương lai | Không chứa FPS, wall-clock accumulator hoặc timestamp thiết bị để quyết định mô phỏng |
| UI/RAF | Vẽ snapshot mới nhất, hiển thị date/speed/backlog/pause | Không tiến lịch mô phỏng |
| Save adapter | Serialize logical state và schema version | Không lưu fractional wall-clock progress |

### 5.2. Main thread hay Worker

- Không mặc định chuyển Worker ngay. Trước tiên đo monthly step và main-thread latency theo G0.7.
- Nếu compute gây long task/ANR/jank trên Android, ưu tiên Worker sở hữu authoritative simulation state; UI gửi domain commands và nhận versioned snapshots/events.
- Nếu giữ compute trên main thread trong lát cắt đầu, scheduler phải chia batch/yield có giới hạn; mọi bước vẫn deterministic và không drop.
- Worker design phải xác định message ordering, command acknowledgement, cancellation semantics, snapshot ownership, deterministic RNG, save serialization và worker crash recovery.
- Không để UI mutate trực tiếp object state của Worker; chỉ command API được phép thay đổi state.
- Không tạo hai scheduler hoặc hai nguồn state authoritative.

### 5.3. Đổi tốc độ và pause

- Speed change áp dụng tại ranh giới logical-step an toàn.
- Fractional progress phải được xử lý nhất quán (ví dụ chuyển đổi theo tỷ lệ tiến độ của interval cũ sang interval mới) hoặc reset theo quy tắc đã chọn; không phụ thuộc thời điểm RAF.
- Pause dừng logical scheduler ngay; không thực hiện bước cuối ngoài ý muốn.
- Resume khởi tạo lại monotonic baseline, zero background elapsed; không tự catch-up.
- Speed 5 không được định nghĩa là “mỗi RAF”. Nó phải là một rate scheduler-controlled có giới hạn được đo.

## 6. Save/load, migration và determinism

- Lịch game là nguồn sự thật; wall-clock accumulator không được khôi phục sau process restart.
- Khi load, bắt đầu paused và rebase monotonic clock.
- Nếu nâng độ phân giải thời gian, tăng save schema version và cung cấp migration có kiểm tra. Không ghi đè save cũ khi migration chưa thành công; giữ bản gốc/rollback.
- Xác định canonical logical time mới (ví dụ date + hourOfDay + stepIndex) và quan hệ với legacy monthly tick; không suy diễn ngày/giờ chưa được lưu trong save v1.
- Mọi scheduled task phải có lịch chạy tái tạo được từ canonical state hoặc lưu đủ metadata. Tránh lưu queue dẫn tới double-run sau load.
- Kiểm chứng save/load giữa các ranh giới task (trong ngày, qua tuần, qua tháng, qua năm) khi cadence mới được duyệt.
- Cùng seed, cùng command stream, cùng logical tick count phải hash state giống nhau; test nhiều seed và cả Historical/Sandbox.

## 7. Kế hoạch benchmark và so sánh pacing

### 7.1. Đo hiện trạng Victori3 Mobile

Trên exact build SHA và data hash:

- Ghi thiết bị, Android version, WebView/Chromium version, refresh rate thực, power mode và trạng thái nhiệt chỉ khi có nguồn đáng tin cậy.
- Với từng speed 1–5, warm-up rồi đo tối thiểu 60 giây; thực hiện ít nhất ba lần.
- Ghi start/end game date, monthly tick delta, game-days elapsed theo lịch Gregorian, real elapsed seconds từ monotonic clock, simulation steps/sec, months/sec, game-days/sec.
- Đồng thời đo RAF/frame interval, long tasks, monthly-step compute p50/p95/p99/max, main-thread blocking, backlog size/high-water mark và UI input latency nếu hỗ trợ.
- Chạy test ở các refresh mode thiết bị thực sự hỗ trợ; không giả định refresh rate chưa được đo.
- Tách Node/server, desktop browser/SwiftShader và Android device; không quy đổi số liệu giữa ba môi trường.

### 7.2. Đối chiếu Victoria 3

Để đo “giống nhịp độ Victoria 3”, cần phép đo trực tiếp:

1. Ghi Victoria 3 game version/patch, DLC, platform, hardware, resolution và settings.
2. Dùng cùng start date (1836-01-01), cùng country nếu có thể, cùng trạng thái pause ban đầu.
3. Với từng speed 1–5, đo tối thiểu 60 real seconds sau warm-up; ghi game date trước và sau.
4. Lặp ít nhất ba lần; ghi phân phối game-days/sec hoặc days/min, không chỉ một mẫu.
5. Nếu độ phân giải logical tick khác nhau, so calendar elapsed và báo tick compute riêng.
6. Chủ dự án xác nhận cảm giác pacing bằng hands-on test. Nếu chưa có phép đo V3 trực tiếp, chỉ báo “chưa có benchmark tham chiếu”, không tuyên bố parity.

### 7.3. Chọn mapping speed

- Không chốt milliseconds cho speed 1–5 trong tài liệu này.
- Sau khi có benchmark V3 và Android, chọn mapping: tốc độ chậm đủ cho quyết định quản trị, trung gian để chơi thường, cao để tăng tốc, mức cao nhất không phụ thuộc FPS.
- Mỗi speed có measured calendar rate và độ dao động; nếu thiết bị yếu, simulation có thể chạy chậm hơn nhưng không được thay đổi số logical ticks theo cách không deterministic.
- Nếu Android không duy trì target wall-clock rate do compute quá nặng, phải báo slowdown/backlog và tối ưu hệ thống; không tăng tốc giả bằng cách bỏ bớt task.

## 8. Acceptance criteria P0

| ID | Tiêu chí | Kiểm chứng |
|---|---|---|
| CLK-01 | Pause giữ nguyên calendar và mọi state mô phỏng | Unit + integration test |
| CLK-02 | Speed 1–5 độc lập FPS/refresh rate | Fake-clock tests ở 30/60/90/120 callback schedules và Android measurement |
| CLK-03 | Không rơi logical tick khi frame/event loop bị stall | Stall/backlog tests; compare expected tick count |
| CLK-04 | Batch có giới hạn, không unbounded catch-up hoặc overlapping runner | Scheduler tests + profiling |
| CLK-05 | Speed change không tạo tick ngoài quy tắc | Boundary tests |
| CLK-06 | Background/resume không chạy bù; app trở lại paused | Browser lifecycle + physical Android tests |
| CLK-07 | Save/load/process death không đổi date, task order, RNG hoặc kết quả campaign | Multi-boundary deterministic tests |
| CLK-08 | Historical và Sandbox dùng chung clock/scheduler | Shared-engine tests |
| CLK-09 | Game-days/sec đo được cho từng speed và so sánh cùng điều kiện với V3 | Raw benchmark JSON + owner review |
| CLK-10 | Owner xác nhận pacing trên thiết bị thật | Owner hands-on acceptance |

Giữ yêu cầu G0.7/S0 v3.2: tick compute p50/p95/p99/max; main-thread blocking; frame interval/FPS; long task ≥50ms; seed/date/tick count; build SHA/data hash; ghi unsupported cho API không có, không điền 0. Node/desktop không thay thế iQOO Z10 Turbo.

## 9. Kế hoạch triển khai sau phase authorization

| Slice | Phạm vi | Deliverable | Stop condition |
|---|---|---|---|
| CLK-A0 | Baseline instrumentation/benchmark | Raw speed-vs-calendar report, RAF/frame and tick compute distributions | Stop nếu thiếu direct V3 measurement hoặc iQOO access; không tự đặt mapping |
| CLK-A1 | Fixed-step scheduler, vẫn monthly tick | Scheduler contract, fake-clock tests, RAF-independent clock | Không đổi save schema/cadence systems trong slice này |
| CLK-A2 | Foreground/background/Android AppState | Pause/resume policy, save checkpoint evidence, lifecycle tests | Stop nếu IndexedDB transaction completion chưa được chứng minh |
| CLK-A3 | Cadence/task scheduler | Logical clock design, task DAG, migration spec | Review subsystem dependencies trước implementation |
| CLK-A4 | Worker decision | Profile evidence và worker architecture decision | Không chuyển Worker nếu chưa đo hoặc chưa có state/command boundary |
| CLK-A5 | Speed mapping and calibration | Final measured 1–5 rates, owner-testable APK and changelog | No acceptance without owner pacing signoff |

Thứ tự đề xuất: CLK-A0 → CLK-A1 → CLK-A2 → CLK-A3 (sau khi đặc tả được duyệt) → CLK-A4 nếu profiling yêu cầu → CLK-A5. Mỗi lát cắt cần owner-authorized scope, test, review và migration plan phù hợp.

## 10. Rủi ro và câu hỏi chưa được khóa

- **Save migration:** legacy tick hiện là tháng; đổi thành giờ hoặc six-hour tick sẽ đổi nghĩa hàng loạt field. Cần schema mới và migration có kiểm chứng.
- **Throughput:** monthly pipeline hiện chạy đồng bộ trên main thread; fixed-step chỉ tách clock khỏi RAF chứ không tự làm compute nhanh hơn.
- **Backlog:** xử lý debt quá nhanh gây jank; drop debt gây mất simulation time. Cần bounded batches và overload policy có đo.
- **Lifecycle:** pagehide không bảo đảm IndexedDB transaction hoàn tất trước process death; cần test Android thật.
- **Cadence:** chạy monthly systems ở mọi daily/six-hour tick sẽ tăng compute quá lớn và sai mô hình; phải phân công cadence từng task.
- **Reference parity:** Dev Diary #76 là mô tả kỹ thuật xuất bản năm 2023, không phải pacing benchmark hiện tại. Cần benchmark trực tiếp V3 build người chơi sử dụng.
- **Chưa khóa:** tick resolution cuối cùng; speed wall-clock mapping; task frequency từng subsystem; Worker boundary; migration compatibility và autosave durability.

## 11. Scope boundary và trạng thái tại checkpoint thiết kế ban đầu

- Tại checkpoint thiết kế ban đầu, đây là design-only preparation dựa trên owner feedback 2026-11-20. Trạng thái hiện tại đã được cập nhật tại §13.
- Tại checkpoint thiết kế ban đầu chưa có code, test, asset, data, workflow, dependency, Gradle, signing, APK hoặc save schema nào được sửa; phần này được supersede bởi implementation slice ghi tại §13.
- Không có benchmark runtime/device mới được chạy trong slice này. Các tốc độ ở §2.2 là phép quy đổi lý thuyết từ source constants, không phải kết quả đo.
- Tại checkpoint ban đầu không tuyên bố clock đã sửa hoặc Victoria 3 pacing parity. Sau đó đã có daily-clock slice tại §13; chưa được coi là full parity.
- S1 vẫn cần independent review/owner ACCEPTED theo gate. Khi được mở, P0 clock/pacing phải đi trước các lát cắt gameplay P1 khác.


## 12. Hiệu chỉnh cho chiến dịch 1836–2026 và giới hạn tốc độ tối đa

Phần này bổ sung phạm vi thời gian của chiến dịch theo yêu cầu chủ dự án. Nó không sửa các kết luận kỹ thuật ở §§1–11 và không phải benchmark runtime.

### 12.1. Calendar contract mục tiêu

- Bắt đầu: **1836-01-01**.
- Ngày cuối có thể chơi: **2026-12-31**.
- Boundary kết thúc chuẩn: xử lý xong mọi task thuộc ngày 2026-12-31, sau đó chuyển sang trạng thái campaign-complete tại boundary **2027-01-01 00:00**. UI có thể hiển thị "31 December 2026 — completed"; save phải ghi rõ campaign đã hoàn tất.
- Historical, Sandbox và Observer phải dùng cùng calendar và scheduler. Khác biệt chỉ nằm ở người phát lệnh, mức AI điều khiển và quy tắc scenario.
- Logical state cần đủ độ phân giải để xác định ngày/giờ và thứ tự task; không thể chỉ đổi hằng số GAME_END_TICK trong khi vẫn giữ monthly-only tick.
- Các tháng có độ dài Gregorian đúng; leap year phải tuân thủ quy tắc lịch Gregorian. Không giả định mọi tháng có 30 ngày.
- Legacy monthly tick phải giữ nguyên ý nghĩa trong save cũ cho tới khi migration được phê duyệt, có version và test.

### 12.2. Tốc độ tối đa — trần mới theo yêu cầu chủ dự án

Chủ dự án chốt rằng Speed 5 **không được vượt quá nửa ngày game trong một giây thực**.

**Quy tắc pacing hiện được yêu cầu:**
- Speed 5: hard ceiling = **0,5 ngày lịch game / 1 giây thực** (12 giờ game/giây thực).
- Không được tăng tốc vượt trần này kể cả khi thiết bị, CPU hoặc màn hình có khả năng xử lý nhanh hơn.
- Speed 1–4 phải chậm hơn Speed 5; tỷ lệ cụ thể chỉ được chốt sau benchmark và thử nghiệm cảm nhận.
- Đây là yêu cầu sản phẩm đã được chủ dự án xác nhận về giới hạn tốc độ; tốc độ thực tế của build hiện tại chưa được benchmark.

Từ 1836-01-01 đến boundary 2027-01-01 có **69.762 ngày Gregorian**:
- Ở đúng 0,5 ngày/giây, riêng thời gian lịch lý thuyết để chạy hết chiến dịch liên tục là **139.524 giây = 38 giờ 45 phút 24 giây** (xấp xỉ 38,76 giờ).
- Thời gian thực tế có thể dài hơn do xử lý simulation, lưu game, pause, overload hoặc thiết bị không duy trì được trần.
- Không dùng con số này làm cam kết thời gian chơi thực tế hay benchmark hiệu năng.

Quy tắc scheduler:

1. Speed 5 luôn là cấp nhanh nhất, nhưng không có nghĩa là "mỗi RAF callback tiến một tháng".
2. Scheduler dựa trên monotonic elapsed time; render/RAF chỉ vẽ UI và không quyết định số logical ticks.
3. Nếu dùng logical six-hour tick thì trần 0,5 ngày/giây tương đương tối đa trung bình **2 logical ticks/giây**. Không chạy toàn bộ monthly economy/POP/politics/AI pipeline ở mỗi logical tick.
4. Nếu thiết bị không đủ sức xử lý, game được phép chạy chậm hơn và hiển thị slowdown/backlog; không được bỏ logical ticks hoặc bỏ qua hệ thống để giả lập tốc độ.
5. Nếu thiết bị nhanh hơn, scheduler vẫn phải giữ ceiling 0,5 ngày/giây; tuyệt đối không tự tăng theo FPS/refresh rate.
6. Đo calendar progress theo ngày Gregorian và monotonic elapsed time; không suy tốc độ từ callback count, FPS hoặc UI render count.
7. Benchmark Victoria 3 và Android vẫn cần thiết để hiệu chỉnh Speed 1–4 và xác nhận cảm giác chơi, nhưng không được vượt hard ceiling do chủ dự án vừa chốt nếu chưa có yêu cầu mới.

**Lịch sử thay đổi yêu cầu:** đề xuất cũ 1 năm/60 giây và sau đó 1–2 ngày/giây đã bị thay thế. Trần đang có hiệu lực trong thiết kế này là **0,5 ngày/giây**.

### 12.3. Hệ quả cho lịch 191 năm

- Tổng lịch từ 1836-01-01 tới boundary 2027-01-01 là **69.762 ngày Gregorian**, tương ứng chiến dịch chơi hết ngày 2026-12-31.
- Với tốc độ tối đa 0,5 ngày/giây, thời gian lịch lý thuyết để đi hết chiến dịch liên tục là **139.524 giây (38 giờ 45 phút 24 giây)**. Pause, lưu game, slowdown và chi phí tính toán làm thời gian thực tăng lên.
- Nếu logical tick là sáu giờ thì có tối đa hai logical ticks mỗi giây tại Speed 5. Tick này chỉ advance clock/deadlines/operation timers và các tác vụ nhẹ được chỉ định; không được chạy toàn bộ pipeline monthly ở cadence six-hour.
- Các hệ thống economy/POP/politics/AI/diplomacy/military phải có cadence riêng, dependency và stable order. Candidate cadence:
  - six-hour: clock, deadline/timer, movement/operation clock and explicitly required immediate effects;
  - daily: selected local logistics, crisis/election/deadline checks and daily processes where justified;
  - weekly: trade-route adjustment, selected logistics/operations and bounded AI operational reviews;
  - monthly: firm production, market settlement, wages/profits/household consumption, public accounts, POP/politics, research, diplomacy and force maintenance according to reviewed dependency order;
  - yearly: population/economic/national capability snapshots and annual reports.
- Đây là candidate cadence. Từng system phải có lý do tần suất, dependency, compute budget, state mutation owner và determinism tests trước implementation.
- Event có hạn theo giờ/ngày (mobilization deadline, diplomatic escalation, election, blockade, treaty expiry) phải được biểu diễn theo logical date/step, không chờ monthly tick rồi xảy ra trễ cả tháng.

### 12.4. Acceptance tests bổ sung

| ID | Tiêu chí | Kiểm chứng |
|---|---|---|
| CLK-11 | Campaign kết thúc đúng sau ngày 2026-12-31, không kết thúc đầu năm hoặc cuối tháng 12 sai lệch | Calendar boundary unit/integration tests |
| CLK-12 | Leap day (29 February) và độ dài các tháng được xử lý chính xác trong toàn bộ 1836–2026 | Gregorian calendar property tests |
| CLK-13 | Speed 5 không vượt hard ceiling 0,5 game-day/real-second (12 game-hours/real-second) | Fake-clock scheduler tests và device benchmark |
| CLK-14 | 30/60/90/120 Hz schedules cho cùng calendar progress trong cùng monotonic elapsed interval | Deterministic fake-clock matrix |
| CLK-15 | Overload chỉ tăng backlog/slowdown; không drop ticks hoặc chạy bù vô hạn | Stall, backlog and bounded-slice tests |
| CLK-16 | Save/load ở boundary ngày/tuần/tháng/năm và tại campaign end không chạy trùng hoặc bỏ task | Cross-cadence deterministic replay |

### 12.5. Giới hạn

- Chưa đo trực tiếp Victoria 3 hoặc iQOO Z10 Turbo trong lần cập nhật này.
- Không có runtime code hoặc save migration nào được thay đổi.
- Không tuyên bố scheduler, pacing guard, 1836–2026 campaign boundary hay các cadence trên đã được implement.
- Phần này chỉ là thiết kế để chuẩn bị một slice được cấp quyền sau phase review.


## 13. Implementation checkpoint — daily calendar and RAF-independent pacing (2026-11-20)

Authorization: the owner explicitly requested correction of the overly fast clock after reviewing the current screenshots and gameplay recording. The implementation uses the standing hard ceiling for speed 5: no more than 0.5 Gregorian game-day per real second.

Source commit: fcadf1d82edda6615503b79fa9a9c2532d4c197a on experiment/vic3-visual-upgrade.

### Delivered in this slice
- GameState.dayOfMonth is additive. New campaigns start on 1836-01-01; old v1 saves without this property resume on day 1.
- stepDay() advances Gregorian days and observes leap years. Existing monthly systems run only when the calendar crosses into the next month; GameState.tick keeps its legacy meaning of completed months.
- GameController no longer drives simulation from RAF. It uses a timer that advances one game day per interval; delayed callbacks do not trigger a catch-up burst.
- Top bar exposes day/month/year.
- Candidate speed schedule: 10s/day, 6s/day, 4s/day, 3s/day, 2s/day for speeds 1–5. Speed 5 is exactly the owner ceiling. This is not a measured Victoria 3 benchmark.

| Speed | Milliseconds / game day | Nominal calendar rate |
|---|---:|---:|
| 1 | 10,000 | 0.10 day/s |
| 2 | 6,000 | 0.167 day/s |
| 3 | 4,000 | 0.25 day/s |
| 4 | 3,000 | 0.333 day/s |
| 5 | 2,000 | 0.50 day/s (hard ceiling) |

### Explicitly not delivered
- No six-hour/regular logical tick.
- No daily, weekly, monthly and yearly task dependency graph; non-monthly systems have not been moved to new cadences.
- Economy, population, politics, secession, technology, diplomacy, military, events, AI and divergence still run monthly.
- No Worker-based simulation, backlog visualization, device benchmark, Android process-death QA or verified autosave durability.
- This is a pacing correction, not full Victoria 3 clock architecture parity.

### Validation
At this checkpoint, Actions #462 (ID 44737688243) was still running on the exact source SHA. Record a PASS and APK only after checking the completed run and its evidence artifact.


### 13.1 CI verification addendum — Actions #462

The exact source SHA \`fcadf1d82edda6615503b79fa9a9c2532d4c197a\` passed GitHub Actions run #462 (\`44737688243\`): 8 test files, 50 suites, 148 tests, zero failures/unhandled errors; data/map/web build, Capacitor sync and Android \`assembleDebug\` all passed.

Verified APK: artifact \`14629388175\`, size 18,063,738 bytes, SHA-256 \`c26ce32d38b077df2311759d43d7eba87f89c67f2e57cc4527401931980a0135\`. APK artifact ZIP SHA-256: \`c0d4ac56a54583c5a9333629777d97ffb56e2d8d123232824ee22080befa9428\`. CI evidence artifact \`14629567697\`, SHA-256 \`606a75daa7f32495609f47b1ad5186ede609ef7f8a02123cfa548feccedb7254\`. APK hash was independently recomputed after download and matches the CI evidence.

Signing remains debug-only, not release. No physical Android QA, independent review or owner acceptance has occurred. The daily-clock slice is CI-verified but not yet device-accepted or full Victoria 3 clock parity.
