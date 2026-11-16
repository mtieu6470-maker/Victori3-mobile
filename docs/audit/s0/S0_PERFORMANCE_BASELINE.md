# S0_PERFORMANCE_BASELINE — S0-B3 (G0.7, phần Node + desktop)

| Trường | Giá trị |
|---|---|
| Task | S0-B3 (OD-20261116-11); thực hiện phép đo A5 của v3.2 §6.3 bằng harness của B3 |
| Nhãn | **`BASELINE_ORIGINAL`**: mã sản phẩm, dữ liệu và bản build `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` không đổi. Harness nằm ngoài mã sản phẩm (`tools/audit/s0/`) và trỏ vào worktree tạm sạch của baseline. SHA commit của harness được ghi trong handoff |
| Giao thức | J (v3.2 §6.5). Ba môi trường báo cáo **riêng**, không quy đổi sang nhau |
| Dữ liệu | `docs/audit/s0/S0_PERFORMANCE_BASELINE.json` (SHA-256 `6ffeb9a67268e54c23ed0e56913081deda934e53e8194333607e65f29a2bea7c`), tổng hợp từ `docs/audit/s0/b3/perf/*.json` bằng `tools/audit/s0/perf_summary.ts` |
| Log | `b3/logs/b3_perf_node.log`, `b3/logs/b3_perf_desktop.log`, `b3/logs/b3_perf_summary.log`; mọi lệnh exit 0 |
| Người lập | Claude Code, 2026-11-16 (tự đánh giá, **chưa được review độc lập**) |

## 1. Môi trường

| Môi trường | Mô tả |
|---|---|
| Node/server | Node v22.23.4 (V8 12.4.254.21), Linux 6.18.44 x64, Intel Xeon @ 2.30 GHz, 4 CPU logic, 16 GB RAM; chạy với `--expose-gc` |
| Trình duyệt desktop | **Chromium headless 153.0.8010.12 + SwiftShader**. WebGL được render bằng CPU: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)`.<br>Cờ khởi chạy: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader` (giống công cụ QA của dự án).<br>Viewport 915 × 412, DPR 2, `isMobile`, `hasTouch` (khổ ngang điện thoại).<br>Cùng máy chủ như trên.<br>Không có màn hình vật lý, nên không có refresh rate thật.<br>`longtask`: supported. `performance.memory`: supported nhưng bị làm tròn.<br>**Không đại diện cho desktop có GPU và không bao giờ thay số đo iQOO Z10 Turbo** |
| Thiết bị Android (iQOO Z10 Turbo) | **`BLOCKED`**: không có số đo trong B3 |

**Kịch bản đo:**

- Node:
  - 1 200 tháng (1836-01 → 1936-01) cho mỗi chế độ `historical` và `sandbox`, seed 1, không có người chơi;
  - 3 lượt độc lập mỗi chế độ;
  - thêm 1 lượt phân rã theo hệ thống (bọc `SYSTEMS[i].run` trong tiến trình harness).
- Desktop:
  - trang được phục vụ từ `dist/` của baseline bằng máy chủ tĩnh cục bộ;
  - mỗi tốc độ 1–5 dùng một ván mới qua URL QA có sẵn trong sản phẩm (`?mode=historical&seed=1&player=observer&months=0`, `src/ui/main.tsx:38-50`);
  - tốc độ được đặt bằng `__qa.game.setSpeed/setPaused`, cùng phương thức mà nút tốc độ dùng;
  - mỗi tốc độ: warm-up 10 s rồi đo 60 s;
  - 2 lượt:
    - `observe_only`: không bọc hàm nào của trang;
    - `wrap_raf`: bọc `requestAnimationFrame` lúc chạy để đo nhóm 2, có overhead của bộ quan sát.

## 2. Node/server

### 2.1. Nhóm 1 — thời lượng `stepMonth` (ms, 1 200 tick mỗi lượt)

| Chế độ | Lượt | p50 | p95 | p99 | max | mean | tháng/giây liên tục |
|---|---|---|---|---|---|---|---|
| historical | 1 | 20,61 | 32,45 | 41,45 | 67,22 | 22,22 | 44,92 |
| historical | 2 | 20,74 | 32,00 | 39,37 | 68,31 | 22,11 | 45,13 |
| historical | 3 | 21,02 | 32,31 | 39,86 | 66,08 | 22,35 | 44,64 |
| sandbox | 1 | 19,89 | 28,98 | 36,01 | 56,89 | 20,94 | 47,65 |
| sandbox | 2 | 20,06 | 31,34 | 37,73 | 56,71 | 21,33 | 46,80 |
| sandbox | 3 | 20,58 | 32,85 | 42,05 | 77,18 | 22,09 | 45,18 |

- **Tái lập:**
  - Giữa 3 lượt, p50 lệch ≤ 0,7 ms và p95 lệch ≤ 3,9 ms.
  - Kích thước save tại start/middle/end **giống hệt** giữa các lượt cùng chế độ, đúng với mô phỏng tất định theo seed.
  - Cuối lượt còn 187 nước (historical) và 198 nước (sandbox).
- **Theo khoảng 120 tick** (historical, lượt 1): p95 từ 25,2 đến 40,7 ms. Cao nhất ở 120 tick đầu do warm-up JIT: p95 bỏ 12 tick đầu là 32,0 ms. Không thấy chi phí tăng dần theo thời gian.
- **Phân rã theo hệ thống** (historical, lượt có bọc; p50 / p95 / max, ms):

  | Hệ thống | p50 | p95 | max |
  |---|---|---|---|
  | economy | 9,44 | 14,85 | 29,27 |
  | ai | 8,05 | 13,22 | 34,32 |
  | population | 0,85 | 1,79 | 5,15 |
  | politics | 0,84 | 1,64 | 8,45 |
  | diplomacy | 0,00 | 1,48 | 4,58 |
  | divergence | 0,04 | 1,21 | 4,58 |
  | military | 0,10 | 0,57 | 6,96 |
  | events | 0,16 | 0,31 | 2,39 |
  | technology | 0,14 | 0,25 | 4,91 |
  | secession | 0,00 | 0,08 | 0,30 |

  economy và ai chiếm khoảng 85 % thời gian tick. Sandbox cho kết quả tương tự.

### 2.2. Nhóm 2 và 3

`NOT_APPLICABLE` trong Node: không có luồng UI và không có khung hình.

### 2.3. Nhóm 4 — thông lượng

- Chạy liên tục không có UI: **44,6–47,7 tháng/giây**. Đây là giới hạn trên của phần tính toán.
- Baseline chạy **tối đa một tick mỗi `requestAnimationFrame`** ở tốc độ 5 (`src/ui/game/controller.ts:66-81`). Thiết kế này không có hàng đợi, nên không có backlog; thông lượng bị giới hạn bởi tần số khung hình.

### 2.4. Save (`serialize` / `deserialize`)

| Thời điểm | Kích thước (byte, historical) | serialize (ms) | deserialize (ms) | Vòng lặp serialize→deserialize→serialize bằng nhau |
|---|---|---|---|---|
| Tháng 0 | 1 448 522 | 10,2–10,6 | 6,1–9,0 | có |
| Tháng 600 | 2 695 048 | 17,3–21,4 | 10,0–12,9 | có |
| Tháng 1 200 | 3 617 553 | 20,3–26,0 | 12,8–14,4 | có |

- Sandbox cuối kỳ: 3 658 673 byte.
- Heap V8 sau GC cưỡng bức: khoảng 13,7 MB lúc đầu và 18,3–18,5 MB lúc cuối. Đây là heap của tiến trình Node, không so sánh được với bộ nhớ WebView Android.

Vòng lặp chuỗi save chỉ là phép đo kích thước/thời gian, **không** thay cho kiểm tra tất định G0.6 của B4.

## 3. Trình duyệt desktop (Chromium headless + SwiftShader)

### 3.1. Nhóm 3 và 4, lượt `observe_only`

| Tốc độ (ms/tháng danh định) | tháng/giây đo được | FPS | Khoảng khung p50 / p95 / max (ms) | Khung trễ > 1,5× median | Long task ≥ 50 ms: số / p50 / max (ms) |
|---|---|---|---|---|---|
| 1 (2 000) | 0,416 | 3,9 | 16,7 / 2 766 / 5 267 | 38 | 14 / 61 / 152 |
| 2 (1 000) | 0,467 | 1,18 | 33,3 / 4 633 / 4 750 | 27 | 8 / 59 / 85 |
| 3 (500) | 0,416 | 1,02 | 33,3 / 4 783 / 5 033 | 20 | 5 / 57 / 65 |
| 4 (220) | 0,433 | 1,07 | 33,3 / 4 666 / 4 733 | 24 | 8 / 59 / 65 |
| 5 (0 = mỗi khung) | 0,400 | 0,38 | 66,7 / 9 233 / 9 350 | 11 | 4 / 57 / 147 |

**Ngày game tại đầu và cuối cửa sổ đo:**

| Tốc độ | Đầu | Cuối |
|---|---|---|
| 1 | 1836-06 | 1838-07 |
| 2 | 1836-08 | 1838-12 |
| 3 | 1836-11 | 1838-12 |
| 4 | 1836-09 | 1838-11 |
| 5 | 1837-07 | 1839-07 |

Không cửa sổ nào vượt quá năm 1936. Không có lỗi trang.

### 3.2. Nhóm 2, lượt `wrap_raf`

Đo thời gian của mỗi callback khung hình làm tăng tick: `stepMonth` + `emit` đồng bộ trên luồng chính.

| Tốc độ | n | p50 | p95 | p99 | max | ≥ 50 ms | Số tick tối đa trong một callback |
|---|---|---|---|---|---|---|---|
| 1 | 26 | 24,2 | 63,4 | 97,1 | 97,1 | 2 | 1 |
| 2 | 25 | 23,6 | 45,8 | 60,9 | 60,9 | 1 | 1 |
| 3 | 24 | 25,9 | 41,0 | 45,9 | 45,9 | 0 | 1 |
| 4 | 26 | 24,6 | 43,9 | 62,4 | 62,4 | 1 | 1 |
| 5 | 22 | 24,0 | 38,8 | 39,3 | 39,3 | 0 | 1 |

- Thông lượng lượt này: 0,37–0,45 tháng/giây, tương đương lượt `observe_only`.
- Nhóm 1 (`stepMonth` riêng lẻ) trong trình duyệt: **`unsupported`**. Muốn tách được phải instrument sản phẩm, việc này thuộc B5/B6 (chưa được phép).

### 3.3. Diễn giải và giới hạn (bắt buộc đọc cùng số liệu)

- **Số đo desktop bị chi phối bởi SwiftShader:**
  - Khi game dừng, khung hình đến đều 16,7 ms.
  - Sau mỗi tick, khung kế tiếp đến trễ 2,7–9,3 giây (p95).
  - Trong lúc đó luồng chính hầu như rảnh: chỉ 3–14 long task mỗi 60 s, và callback tick chỉ khoảng 24 ms.
  - Nút thắt nằm ở khâu sinh khung hình bằng CPU, không ở mô phỏng.
  - Mỗi tick kích hoạt cập nhật palette và vẽ lại toàn màn hình bản đồ WebGL (`src/ui/map/MapView.tsx:142-145`, `renderer.ts:193-207`).
  - **Giả thuyết, chưa kiểm:** shader toàn màn hình chạy trên CPU là phần tốn kém.
- **Hệ quả thiết kế đáng ghi nhận cho S2 (RM-F4):**
  - Vòng lặp game chạy theo `requestAnimationFrame`, nên mọi tốc độ đều bị giới hạn bởi tốc độ sinh khung.
  - Trong môi trường này, tốc độ 1–5 gần như **cùng một** thông lượng (0,37–0,47 tháng/giây), thấp hơn danh định của tốc độ 1 (0,5).
  - Trên thiết bị có GPU, con số sẽ khác. Số đo này **không** dự đoán được hiệu năng iQOO.
- **Nhóm 2 so với mục tiêu S2** (chỉ để tham chiếu, S0 không yêu cầu đạt ngưỡng):
  - Callback tick p95 38,8–63,4 ms và Node tick p95 29–33 ms đều vượt mục tiêu S2 (p95 ≤ 8 ms, p99 ≤ 16,7 ms).
  - Có callback tick ≥ 50 ms ở tốc độ 1, 2, 4.
  - Mô phỏng chạy đồng bộ trên luồng chính (RM-F3).
- **Bỏ ngỏ:**
  - Không đo độ trễ chạm → phản hồi (không có input script trong cửa sổ đo): `not_measured`.
  - Không đo bộ nhớ GPU hoặc RSS native.
  - `performance.memory` làm tròn (97–139 MB `usedJSHeapSize`) và chỉ mang tính tham khảo.
  - Tự động lưu mỗi tháng Giêng (`src/ui/App.tsx:74`, serialize 1,4–3,6 MB + IndexedDB) là một nguồn long task có thể có. B3 không tách riêng.
- **Một lượt cho mỗi cấu hình desktop.** Thông lượng của 2 lượt (observe/wrap) lệch nhau ≤ 0,04 tháng/giây ở mọi tốc độ. Riêng FPS ở tốc độ 1 khác nhau (3,9 so với 7,5) vì phụ thuộc vào thời điểm tick rơi vào cửa sổ đo.

## 4. Kết luận G0.7 (tự đánh giá, chờ review)

| Thành phần | Trạng thái | Căn cứ |
|---|---|---|
| Node/server, 4 nhóm theo J | **PASS** (đo được, tái lập) | §2: 3 lượt × 2 chế độ, phân rã hệ thống, save; nhóm 2–3 `NOT_APPLICABLE` có lý do |
| Desktop browser | **PARTIAL** | Có số đo tái lập cho nhóm 2, 3, 4 ở 5 tốc độ, nhưng môi trường SwiftShader không đại diện; nhóm 1 `unsupported`; độ trễ input `not_measured` |
| Thiết bị iQOO Z10 Turbo | **BLOCKED** | Không có số đo; không được thay bằng số máy chủ/desktop |
| **G0.7 tổng** | **BLOCKED** (phần thiết bị) | Theo v3.2 §6.5 và v3.3 §5. Có thể xin ngoại lệ **chỉ cho S1** ở B7 theo v3.3 §4; không đổi thành PASS |

## 5. Tái lập

```bash
git worktree add --detach <tmp>/base 2240a8fb865e0021eec2f2f4f1c6803528be9e2c
(cd <tmp>/base && npm ci && npm run build)
for m in historical sandbox; do for r in 1 2 3; do
  node --expose-gc --import tsx tools/audit/s0/perf_node.ts <tmp>/base $m 1 1200 docs/audit/s0/b3/perf/node_${m}_seed1_run$r.json
done; node --expose-gc --import tsx tools/audit/s0/perf_node.ts <tmp>/base $m 1 1200 docs/audit/s0/b3/perf/node_${m}_seed1_per_system.json --per-system; done
npx tsx tools/audit/s0/perf_desktop.ts <tmp>/base docs/audit/s0/b3/perf/desktop_observe.json --warmup 10 --measure 60 --speeds 1,2,3,4,5
npx tsx tools/audit/s0/perf_desktop.ts <tmp>/base docs/audit/s0/b3/perf/desktop_wrap_raf.json --wrap-raf --warmup 10 --measure 60 --speeds 1,2,3,4,5
npx tsx tools/audit/s0/perf_summary.ts docs/audit/s0/b3/perf docs/audit/s0/S0_PERFORMANCE_BASELINE.json
```

Các lượt chạy tuần tự, không chạy song song với nhau.
