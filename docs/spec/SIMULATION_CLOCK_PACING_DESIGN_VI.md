# P0 — Thiết kế đồng hồ mô phỏng và nhịp độ thời gian

**Ngày:** 2026-11-20  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** experiment/vic3-visual-upgrade  
**Trạng thái:** DESIGN_ONLY — CHƯA ĐƯỢC PHÉP IMPLEMENT  
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

## 11. Scope boundary và trạng thái

- Đây là design-only preparation dựa trên owner feedback 2026-11-20 và source inspection tại experiment branch.
- Không có code, test, asset, data, workflow, dependency, Gradle, signing, APK hoặc save schema nào được sửa.
- Không có benchmark runtime/device mới được chạy trong slice này. Các tốc độ ở §2.2 là phép quy đổi lý thuyết từ source constants, không phải kết quả đo.
- Không tuyên bố clock đã sửa, không tuyên bố Victoria 3 pacing parity, và không mở S1.
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

### 12.2. Tốc độ tối đa — pacing guard đề xuất

Owner feedback chỉ rõ tốc độ cũ quá nhanh, có thể nhảy nhiều năm trong một giây. Thiết kế mới cần có một giới hạn lịch tối đa được kiểm thử độc lập với FPS.

**Mục tiêu bảo vệ ban đầu để đưa vào benchmark:** ở Speed 5, trần thiết kế là không quá **1 năm lịch game trong 60 giây thực** trên cấu hình tham chiếu, tương đương trung bình khoảng **6.1 ngày game/giây thực**. Đây là một pacing guard sơ bộ để ngăn bước nhảy nhiều năm mỗi giây, không phải số liệu đo Victoria 3 và không phải cam kết rằng iQOO hiện đạt throughput đó.

Quy tắc áp dụng:

1. Speed 5 luôn là mức nhanh nhất, nhưng không có nghĩa là "mỗi RAF callback tiến một tháng".
2. Scheduler dùng monotonic elapsed time và giới hạn số logical ticks được sinh ra theo pacing budget. Refresh 30/60/90/120 Hz phải tạo cùng số logical ticks trong cùng khoảng monotonic elapsed, sai số chỉ trong tolerance của clock test.
3. Nếu thiết bị không đủ sức xử lý target rate, game được phép chạy chậm hơn và hiển thị simulation slowdown/backlog; không được bỏ logical ticks, rút gọn kết quả chiến tranh hay bỏ qua hệ thống để giả lập tốc độ.
4. Nếu thiết bị nhanh hơn target guard, scheduler phải giữ ceiling đã duyệt; không để game tự tăng tốc theo FPS.
5. Speed 1–4 có tốc độ thấp hơn Speed 5 theo mapping được benchmark và owner chấp thuận. Các tỷ lệ giữa cấp tốc độ chưa được hard-code trong tài liệu này.
6. Đo calendar progress sau warm-up bằng ngày lịch Gregorian; không suy tốc độ từ số callback, FPS hay số lần UI render.
7. Trước khi khóa mapping cuối cùng, phải đo cả Victori3 Mobile lẫn Victoria 3 trong điều kiện ghi rõ. Nếu phép đo trực tiếp V3 cho thấy pacing khác đáng kể, đề xuất hiệu chỉnh guard và xin owner chấp thuận trước khi đổi tiêu chí.

Trần 1 năm/60 giây là **mục tiêu pacing sơ bộ** do implementer đề xuất để giải quyết phản hồi "nhiều năm trong một giây". Nó phải được kiểm chứng bằng benchmark, test scheduler và owner hands-on; không được ghi nhận thành kết quả đã PASS khi chưa có các bằng chứng này.

### 12.3. Hệ quả cho lịch 191 năm

- Tổng khoảng lịch từ 1836-01-01 đến boundary 2027-01-01 là 191 năm lịch tính theo mốc đầu/năm boundary; campaign chơi qua các ngày từ 1836 đến hết 2026.
- Với ceiling đề xuất ở §12.2, một lần chạy liên tục không pause sẽ cần xấp xỉ 191 phút (khoảng 3 giờ 11 phút) cho 191 năm lịch chơi (chính xác phụ thuộc leap days và cách tính elapsed/boundary). Đây là phép tính từ target guard, không phải benchmark.
- Các hệ thống economy/POP/politics/AI/diplomacy/military không được cập nhật tất cả ở mọi six-hour tick. Mỗi task phải có cadence, prerequisites và stable order; ví dụ:
  - six-hour: advance clock, movement/operation timers and explicitly required immediate effects;
  - daily: local logistics, selected military/market flows where justified;
  - weekly: AI planning, fronts/operations and selected aggregation;
  - monthly: accounts, production settlement, population/economic summaries and political processes that are monthly by design;
  - yearly: demographic/economic/national capability snapshots and annual historical reports.
- Đây là ví dụ phân bổ cadence, không phải quyết định cuối. Từng system owner phải xác định tần suất, độ trễ được chấp nhận, chi phí compute, ordering và RNG consumption trước implementation.
- Những event có hạn theo giờ/ngày (mobilization deadline, diplomatic escalation, election date, blockade, treaty expiration) phải được biểu diễn theo logical date/step, không chờ monthly tick rồi xảy ra trễ cả tháng.

### 12.4. Acceptance tests bổ sung

| ID | Tiêu chí | Kiểm chứng |
|---|---|---|
| CLK-11 | Campaign kết thúc đúng sau ngày 2026-12-31, không kết thúc đầu năm hoặc cuối tháng 12 sai lệch | Calendar boundary unit/integration tests |
| CLK-12 | Leap day (29 February) và độ dài các tháng được xử lý chính xác trong toàn bộ 1836–2026 | Gregorian calendar property tests |
| CLK-13 | Speed 5 không vượt pacing guard thiết kế ban đầu 1 game-year/60 real seconds trên reference benchmark harness | Fake-clock scheduler tests và device benchmark |
| CLK-14 | 30/60/90/120 Hz schedules cho cùng calendar progress trong cùng monotonic elapsed interval | Deterministic fake-clock matrix |
| CLK-15 | Overload chỉ tăng backlog/slowdown; không drop ticks hoặc chạy bù vô hạn | Stall, backlog and bounded-slice tests |
| CLK-16 | Save/load ở boundary ngày/tuần/tháng/năm và tại campaign end không chạy trùng hoặc bỏ task | Cross-cadence deterministic replay |

### 12.5. Giới hạn

- Chưa đo trực tiếp Victoria 3 hoặc iQOO Z10 Turbo trong lần cập nhật này.
- Không có runtime code hoặc save migration nào được thay đổi.
- Không tuyên bố scheduler, pacing guard, 1836–2026 campaign boundary hay các cadence trên đã được implement.
- Phần này chỉ là thiết kế để chuẩn bị một slice được cấp quyền sau phase review.
