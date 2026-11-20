# S0_B3_RESULTS — tóm tắt S0-B3 và đánh giá gate (tự đánh giá)

| Trường | Giá trị |
|---|---|
| Task | S0-B3, ủy quyền bởi OD-20261116-11 (v3.3 §3.1) |
| Mã được kiểm | Baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` trong worktree tạm sạch (`git worktree add --detach`). Sau toàn bộ B3, `git status --porcelain` của worktree rỗng |
| Base của commit B3 | `9a602f3d60456c014fb33d4ebd83f174af299077` |
| Nhãn | `BASELINE_ORIGINAL` cho mọi số đo và kết quả test: mã, test, dữ liệu, asset và build của sản phẩm không đổi. Công cụ kiểm toán nằm ở `tools/audit/s0/`, ngoài mã sản phẩm. Sản phẩm trong repository giữ nguyên so với `2240a8f`, trừ workflow B1 đã được duyệt (kiểm bằng `git diff`, xem handoff) |
| Người lập | Claude Code, 2026-11-16. **Tự đánh giá.** Không có trạng thái `REVIEW_PASS` hay `ACCEPTED` nào được ghi ở đây |
| Review | Vòng 1: ChatGPT `CHANGES_REQUESTED` trên `3d63061`/`55331c2`/`1d8ad6e`, 4 điểm A–D. Claude sửa theo §8; ChatGPT sau đó review độc lập đúng hai commit `ddea490635c5d7c74ca6108549fd21806102487b` và `2c62b3de3955e3cd8a82a9c59401d9df77d69173`, kết luận `REVIEW_PASS` ngày 2026-11-16 **chỉ cho phạm vi audit B3**. B3 không đồng nghĩa sản phẩm hoàn thiện hoặc owner acceptance |

## 1. Sản phẩm bàn giao

| Hạng mục v3.3 §3.1 | Tệp | Gate |
|---|---|---|
| Test catalog | `S0_TEST_CATALOG.md`, `s0_test_catalog.json`; bằng chứng `b3/assertions.jsonl`, `b3/vitest-results.json`, `b3/probe_empty_pass.json`, `b3/test_annotations.json` | G0.3 |
| Requirement matrix | `S0_REQUIREMENT_MATRIX.csv` (353 yêu cầu nguyên tử, §§0–17) | G0.4 |
| Global data audit + crosswalk | `S0_GLOBAL_DATA_AUDIT.md`; `b3/global_data_audit.json`, `b3/region_admin1_crosswalk.csv`, `b3/region_admin1_crosswalk_summary.json` | G0.5 |
| Asset audit + checksum manifest | `S0_ASSET_AUDIT.md`; `b3/asset_manifest.csv` (627 tệp), `b3/asset_inventory_summary.json` | G0.8 |
| Harness Node/desktop + số đo baseline (A5) | `S0_PERFORMANCE_BASELINE.md`, `S0_PERFORMANCE_BASELINE.json`; `b3/perf/*.json` | G0.7 |
| Log lệnh | `b3/logs/*.log`: mỗi tệp ghi lệnh và `[exit N]` | — |

**Công cụ** (`tools/audit/s0/`, commit riêng trước báo cáo):

| Tệp | Vai trò |
|---|---|
| `vitest-assertion-counter.setup.ts`, `vitest.assertion-count.config.ts` | Đếm assertion |
| `test_catalog.ts` | Lập catalog test |
| `probe_empty_pass.ts` | Probe giải thích các test pass rỗng |
| `global_data_audit.ts` | Audit dữ liệu toàn cầu |
| `admin1_crosswalk.ts` | Crosswalk admin-1 × vùng |
| `asset_inventory.ts` | Kiểm kê asset |
| `perf_node.ts`, `perf_desktop.ts`, `perf_summary.ts` | Đo và tổng hợp hiệu năng |

## 2. Đánh giá gate (tự đánh giá, chờ ChatGPT review)

| Gate | Trước B3 | Sau B3 (tự đánh giá) | Căn cứ |
|---|---|---|---|
| G0.3 Test inventory | `PARTIAL` | **PASS** | 58/58 test runtime ghép được với 51 vị trí khai báo. Có số assertion thực chạy, độ ổn định 7/7 lượt, phân tích từng test. Pass rỗng được ghi thành phát hiện TC-F1…F7 và không bị sửa |
| G0.4 Requirement matrix | `NOT_TESTED` | **PASS** | §3 bên dưới. Đánh giá độ đầy đủ và trung thực của audit, không phải mức hoàn thiện tính năng |
| G0.5 Global data | `NOT_TESTED` | **PASS** | 12 **nhóm phân tích** của `regions.ts` (Tây Á và Trung Đông gộp; không phải 13 khu vực độc lập). Phân loại sourced/estimated/default/missing/labelled_without_source **theo nhãn chất lượng**; độ phủ `method` được đếm riêng. Crosswalk 4 374 cặp |
| G0.7 Runtime/perf | `BLOCKED` | **`BLOCKED`** (thiết bị) | Node `PASS`; desktop `PARTIAL` (SwiftShader); iQOO `BLOCKED` |
| G0.8 Asset/license | `NOT_TESTED` | **`PARTIAL`** | Inventory + checksum `PASS`; giấy phép chỉ theo bản ghi, chưa xác minh lại (AS-F1); thiếu ghi công (AS-F2, AS-F3) |
| G0.1, G0.2 | `PASS` | không đổi | Ngoài phạm vi B3 |
| G0.6 | `NOT_TESTED` | không đổi | Thuộc B4, chưa bắt đầu |
| G0.9 | `NOT_TESTED` | không đổi | Thuộc B7 |

**S0 không PASS.** G0.6 và G0.9 còn `NOT_TESTED`, G0.7 `BLOCKED`, G0.8 `PARTIAL`.

## 3. Ma trận yêu cầu (G0.4)

**Nguồn:** `docs/spec/MASTER_SPEC_VI.md` (SHA-256 `d7fa8995…`), đã đọc toàn bộ §§0–17.

- §§18–19 bị loại theo v3.3 §4.1.
- Không lấy yêu cầu từ ảnh concept.
- `docs/audit/MASTER_SPEC_AUDIT.md` (lập ở `26b6369`) chỉ dùng làm đầu vào đối chiếu. Mọi file:dòng được **xác minh lại** trên `2240a8f`.

**Quy ước áp dụng:**

- ID dạng `MS-<mục>-<số>` giữ section gốc, vì đặc tả không có ID riêng.
- Một danh sách mà các mục có trạng thái khác nhau được tách thành từng dòng, ví dụ:
  - 20 lớp bản đồ §3.6;
  - 20 registry §13.1;
  - 8 trạng thái cấp công trình §4.3;
  - các công cụ ngoại giao §7.3;
  - 13 + 7 + 15 ca test §15.6–§15.8;
  - 13 hạng mục QA §15.10;
  - 12 điều kiện §17.
- `Implemented` chỉ dùng khi có logic thật **và** test phù hợp (§15.1). Logic có mà không có test thì xếp `Partial`.
- Yêu cầu dạng công bố/quy trình (MS-3.4-01, MS-2.3-05, MS-15.1-01) dùng bằng chứng tài liệu và ghi rõ `N/A` ở cột test.
- `Unverified` dùng khi audit tĩnh không đủ để kết luận. Không dòng nào bị đổi thành trạng thái tốt hơn bằng chứng.

**Kết quả:** 353 dòng.

| Trạng thái | Số dòng |
|---|---|
| `Implemented` | 24 |
| `Partial` | 173 |
| `Placeholder` | 6 (MS-4.7-01 sở hữu, MS-5.4-01 tầng lớp, MS-7.4-01 powerScore, MS-8.1-01 quân đội, MS-8.12-01 và MS-12.4-01 UI quân sự) |
| `Missing` | 140 |
| `Unverified` | 10 |
| `Broken` | 0 |

Mỗi dòng có đủ: section, nội dung, trạng thái, bằng chứng mã, đường runtime, test/evidence (hoặc "không có"), mức, finding, stage roadmap.

**Phát hiện mới của ma trận** (ngoài các phát hiện đã có trong catalog/data/asset):

| ID | Mức | Phát hiện | Bằng chứng | Stage |
|---|---|---|---|---|
| RM-F1 | P2 | 270/334 dữ kiện `estimated` và 18/62 `uncertain` không có `method`; chỉ 29 dữ kiện có `range`. Trái §2.1/§2.3 (ghi phương pháp, phạm vi). Trong 6 trường của G0.5, phần thiếu `method` chủ yếu là 262 bộ luật khởi đầu | Ban đầu đếm bằng lệnh tạm trên `src/generated/db.json`. Sau review vòng 1, công cụ tái lập (`b3/review1/global_data_audit.json` → `all_entity_facts`, `method_coverage`; `S0_GLOBAL_DATA_AUDIT.md` §2.3) | S1 |
| RM-F2 | P2 | Nhật ký bị cắt ở 4 000 mục (`src/engine/core.ts:38-42` `LOG_CAP`, `splice` mục cũ). Trong ván 100 năm, mục đầu bị xóa, trái §9.3 và §13.2 (không ghi đè lịch sử). Nhật ký lãnh thổ riêng (`territoryLog`) không bị cắt | mã | S1, S22 |
| RM-F3 | P1 | Mô phỏng chạy đồng bộ trên luồng chính. Tick p95 29–33 ms (Node) và 39–63 ms (callback khung hình, Chromium) vượt mục tiêu S2 (p95 ≤ 8 ms) | `S0_PERFORMANCE_BASELINE.md` §2, §3.2 | S2 |
| RM-F4 | P2 | Vòng lặp game gắn với `requestAnimationFrame` (`controller.ts:66-81`), nên tốc độ game bị giới hạn bởi tốc độ sinh khung. Trong môi trường SwiftShader, tốc độ 1–5 gần như cùng một thông lượng | `S0_PERFORMANCE_BASELINE.md` §3.3 | S2 |
| RM-F5 | P3 | Game không có điểm kết thúc 1936; mô phỏng tiếp tục sau tick 1 200 | `src/engine/core.ts:30`; không có kiểm tra năm kết thúc | S22 |

## 4. Chỉ mục phát hiện B3 (không sửa gì trong S0)

| Nhóm | ID | Tài liệu |
|---|---|---|
| Test | TC-F1 (P1, pass rỗng `simulation.test.ts:34`), TC-F2 (P1, pass rỗng `simulation.test.ts:43`; con số 145 được giải thích ở §4.1), TC-F3 (P2, lõi pass rỗng `content.test.ts:41`), TC-F4 (P2, 1870/1875 `simulation.test.ts:21`), TC-F5 (P1, đầu vào B4), TC-F6, TC-F7 (P2) | `S0_TEST_CATALOG.md` §3 |
| Dữ liệu | GD-F1 (P2, 5 nhãn không nguồn), GD-F2 (P1, độ phủ không đều), GD-F3, GD-F4 (P2), GD-F5, GD-F6 (P3) | `S0_GLOBAL_DATA_AUDIT.md` §4 |
| Asset | AS-F1 (P1, giấy phép chưa xác minh lại), AS-F2, AS-F3, AS-F4 (P2), AS-F5, AS-F6, AS-F7 (P3) | `S0_ASSET_AUDIT.md` §4 |
| Ma trận/hiệu năng | RM-F1…RM-F5 | §3 ở trên |
| Thời lượng chiến tranh | WD-F1 (P3), WD-F2 (P3), WD-F3 (P2) | §4.1 |

**Về P0 (làm rõ sau review vòng 1, điểm C):**

- **B3 không phát hiện P0 mới.**
- **R7 là P0 đã được nhận diện từ trước** (v3.2 §4B: không autosave, không xử lý renderer/WebGL; giai đoạn xử lý S2). R7 **vẫn mở** và không được coi là đã hết rủi ro.
- B3 kiểm lại trên `2240a8f` (`b3/review1/logs/r1_r7_lifecycle_grep.log`): không có xử lý `visibilitychange`, `pagehide`, `beforeunload`, `webglcontextlost`, `webglcontextrestored`, `onRenderProcessGone` hay `appStateChange` (grep exit 1).
- Thứ duy nhất có là tự động lưu theo **ngày game** mỗi tháng Giêng (`src/ui/App.tsx:74`). Đây không phải lưu theo vòng đời ứng dụng: có thể mất tới 11 tháng game, và không phục hồi khi mất renderer.
- OD-20261116-11 chỉ ghi nhận **biện pháp kiểm soát tạm thời** (v3.3 §5.1), không phải sửa lỗi. R7 phải được B7 ghi vào risk register và chủ dự án chấp nhận bằng văn bản.
- Dòng MS-13.5-04 của ma trận đã được sửa để gắn mức P0 (R7).
- Rủi ro P0 tiềm tàng khác chưa kiểm là G0.6 (tất định save/load), thuộc B4.

## 4.1. Thời lượng chiến tranh — kiểm tra sai lệch 145 tháng (review vòng 1, điểm D)

**Công cụ:** `tools/audit/s0/probe_war_duration.ts` (chỉ đọc). Probe chạy engine baseline không sửa và ghi lại sau mỗi tick những chiến tranh đang tồn tại.

**Kịch bản và bằng chứng:**

- Kịch bản: Sandbox và Historical, seed 1, 40 và 100 năm.
- Đầu ra: `b3/review1/probe_war_duration_{sandbox,historical}_seed1_{40,100}y.json`.
- Log: `b3/review1/logs/r1_probe_war_duration.log` (4 lệnh, exit 0).

**Cách engine tính:**

| Điểm | Mã baseline | Hành vi |
|---|---|---|
| Thứ tự hệ thống mỗi tick | `simulation.ts:30-38` | `st.tick += 1` trước, rồi economy → … → military → events → ai → divergence |
| Chiến tranh do AI/sự kiện tuyên bố | `diplomacy.ts:117-128` | `start = st.tick` của tick tuyên bố. Hệ thống military của tick đó đã chạy xong, nên lần `warMonth` đầu tiên ở tick `start+1` có `months = 1`. Probe xác nhận `firstSeen = start` cho mọi cuộc |
| Chiến tranh khởi đầu (dữ liệu CoW và nguồn khác) | `init.ts:136-146`, dòng 143 | `start = dateToTick(w.start) < 0 ? -1 : 0`. Ngày bắt đầu thật (1763–1835 trong `db.wars`) bị bỏ; mọi cuộc bắt đầu trước 1836 có `start = -1` |
| Tháng chiến tranh | `military.ts:122` | `months = st.tick - w.start` |
| Quy tắc 12 năm | `military.ts:128` | `if (months > 144)` → kết thúc với lý do "exhaustion after twelve years" |

**Kết quả** (giống nhau ở mọi kịch bản):

| Nhóm | Số cuộc | `months` lúc kết thúc (tối đa) | Số trạng thái cuối tháng tồn tại (tối đa) | Lý do kết thúc |
|---|---|---|---|---|
| Khởi đầu, chạm quy tắc 12 năm | 2 (Historical) / 3 (Sandbox) | **145** | **144** | exhaustion after twelve years, ở tick 144 (1848-01) |
| Khởi đầu, khác | 6 / 5 | 6 hoặc 73 | 5 hoặc 72 | 5 cuộc capitulation ở tick 5; Texas Revolution stalemate ở tick 72 (chỉ Historical) |
| Do AI tuyên bố | 18–65 tùy kịch bản | **7–9** | 7–9 | capitulation, collapse, stalemate |

**Kết luận:**

- 145 là **khác biệt quy ước đếm**, không phải sai lệch logic quan sát được.
- Con số 145 trong probe trước chỉ đến từ chiến tranh khởi đầu. `start = -1` cộng một tháng vào `months`, trong khi các cuộc này chỉ tồn tại qua 144 trạng thái cuối tháng: 1836-01 → 1847-12, đúng 12 năm trong game.
- Ngưỡng 145 trong test khớp với cách engine tính `months` cho nhóm này.

**Phát hiện mới (không sửa trong S0):**

| ID | Mức | Phát hiện | Stage |
|---|---|---|---|
| WD-F1 | P3 | **Bất đối xứng tiềm ẩn.** Với chiến tranh tuyên bố trong ván ở tick `s`, quy tắc `months > 144` kết thúc nó ở tick `s+145`, sau **145** trạng thái cuối tháng (12 năm + 1 tháng). Chiến tranh khởi đầu dừng ở 144. Không quan sát được trong 4 kịch bản (cuộc tuyên bố dài nhất 9 tháng), nhưng mã cho phép. Cần một định nghĩa duy nhất: đếm số lần `warMonth` và dừng khi `>= 144`, hoặc ghi rõ quy ước | S21 |
| WD-F2 | P3 | Ngày bắt đầu thật của chiến tranh trước 1836 bị bỏ (`init.ts:143`). Quy tắc 12 năm đếm từ 1836, không theo ngày bắt đầu ghi trong dữ liệu (ví dụ Russo-Circassian 1763, First Carlist 1833). State không lưu ngày bắt đầu lịch sử | S1 (contract: lưu ngày bắt đầu thật và quy ước đếm), S21 |
| WD-F3 | P2 | **Quan sát hiệu chỉnh lịch sử.** 5/8 chiến tranh khởi đầu kết thúc bằng capitulation ở tick 5 (1836-06) trong cả 4 kịch bản: Murid War, Russo-Circassian, chiến tranh của Pháp với Abd al-Qadir, Second Seminole, Sixth Frontier War. Mọi chiến tranh AI tuyên bố kết thúc trong ≤ 9 tháng. `db.wars` ghi các cuộc này là đang diễn ra ngày 1836-01-01, với ngày bắt đầu từ 1763 đến 1835. B3 không đánh giá thời điểm kết thúc lịch sử | S21, S22 |

**Test đề xuất** (chỉ là đề xuất cho stage sau; **không** thêm vào `tests/` trong S0):

```ts
// 1) Bất biến trên toàn lượt chạy, có guard chống pass rỗng
it('every war, ended or active, exists for at most LIMIT month-ends', () => {
  const st = createGame({ mode: 'sandbox', seed: 1, player: null });
  const firstSeen = new Map(st.wars.map((w) => [w.id, 0]));
  let ended = 0;
  for (let i = 0; i < 480; i++) {
    const before = new Set(st.wars.map((w) => w.id));
    stepMonth(st);
    for (const w of st.wars) if (!firstSeen.has(w.id)) firstSeen.set(w.id, st.tick);
    for (const id of before) if (!st.wars.some((w) => w.id === id)) {
      ended++;
      expect(st.tick - firstSeen.get(id)!).toBeLessThanOrEqual(LIMIT);
    }
  }
  for (const w of st.wars) expect(st.tick - firstSeen.get(w.id)!).toBeLessThanOrEqual(LIMIT);
  expect(ended).toBeGreaterThan(0); // the run must actually exercise ended wars
});

// 2) Test biên cho quy tắc 12 năm: không phụ thuộc diễn biến mô phỏng
it('the twelve-year rule ends a war exactly at the agreed boundary', () => {
  // dựng một chiến tranh có |score| ≥ 20 (không stalemate, không capitulation),
  // đặt w.start sao cho tháng tiếp theo cho months = LIMIT, rồi LIMIT + 1;
  // khẳng định chiến tranh còn ở LIMIT và kết thúc với lý do "exhaustion after twelve years" ở LIMIT + 1
});
```

`LIMIT` phải do stage sửa quy tắc chốt:

- 144 nếu "12 năm" nghĩa là 144 trạng thái cuối tháng (cần đổi điều kiện ở `military.ts:128`, chỉ ở S21);
- 145 nếu giữ nguyên quy ước hiện tại và ghi rõ.

## 5. Giới hạn và trạng thái chưa kiểm

| Hạng mục | Trạng thái | Lý do |
|---|---|---|
| `actionlint` cho workflow | `NOT_TESTED` | Chạy binary bên thứ ba tải về bị từ chối trong phiên; không tìm cách vượt |
| Desktop | Chromium headless + SwiftShader | Không đại diện desktop GPU; không thay số đo iQOO |
| iQOO Z10 Turbo | `BLOCKED` | Không có số đo thiết bị; các bước thiết bị §6.5.1 vẫn chờ chủ dự án |
| Hiển thị ghi công CC BY-SA trên UI lúc chạy | `NOT_TESTED` | Chỉ đánh giá tĩnh (AS-F3) |
| Giấy phép tài sản trên Commons | Không xác minh lại | AS-F1 |
| Ma trận | Viết tay | Do người kiểm toán lập, từ một danh sách Python tạm trong scratchpad chỉ để quoting CSV; CSV là nguồn duy nhất được commit |

## 6. Kiểm tra trước commit

| Kiểm tra | Kết quả |
|---|---|
| `npx tsc --noEmit` trên repository có công cụ B3 | exit 0. `tsconfig.json` có `include: ["tools"]`, nên `npm run build` và CI cũng typecheck `tools/audit/s0/`. Lần chạy đầu phát hiện 2 lỗi kiểu ở `probe_empty_pass.ts:28`; đã sửa bằng chú thích `Set<string>` trước khi push |
| Chạy lại probe sau khi sửa kiểu | Đầu ra trùng từng byte với `b3/probe_empty_pass.json` (`b3/logs/b3_typecheck_and_probe_recheck.log`) |
| Harness hiệu năng tại thời điểm đo | SHA-256 ghi trong từng JSON đo khớp với tệp đã commit: `perf_node.ts` `e37140ae…`, `perf_desktop.ts` `4d145bb1…` |
| Vitest của sản phẩm | Không bị ảnh hưởng: chỉ chạy `tests/**/*.test.ts` (`vitest.config.ts`). Công cụ đếm assertion chỉ được nạp qua `--config` riêng |
| Secret, URL ký tạm, dữ liệu cá nhân trong bằng chứng | Quét bằng `grep`: không có |
| Review vòng 1: `tsc`, đối chiếu sản phẩm, quét secret | `b3/review1/logs/r1_checks.log` (xem §8) |

## 7. Bước tiếp theo

Dừng ở `READY_FOR_REVIEW` (vòng 2) để ChatGPT review lại B3. B4 **chưa bắt đầu** và chỉ bắt đầu sau `REVIEW_PASS` của B3. Nếu B4 cho G0.6 `FAIL`: dừng, chỉ đề xuất `PRE-S1-SAVE-DETERMINISM-REMEDIATION`, không tự sửa. **Lưu ý trạng thái:** chỉ dẫn này phản ánh checkpoint trước vòng review 2 và đã được thay thế bởi kết quả ở §9; không dùng nó làm trạng thái hiện tại.

## 8. Sửa đổi sau review vòng 1 (`CHANGES_REQUESTED`)

Phạm vi sửa: chỉ công cụ kiểm toán và báo cáo audit. Không sửa sản phẩm, test, generator, dữ liệu lịch sử, asset, save, RNG hay APK. Bằng chứng trước sửa được giữ nguyên ở đường dẫn cũ (và trong commit `55331c2`); bằng chứng sau sửa nằm ở `b3/review1/`.

| Điểm | Yêu cầu của review | Đã làm | Bằng chứng |
|---|---|---|---|
| A | Nhóm `estimated` phân loại theo nhãn, không kiểm `method`; sửa diễn đạt, giữ RM-F1 và thống kê thiếu `method` | Sửa mô tả nhóm trong công cụ (`categories.estimated`) và trong `S0_GLOBAL_DATA_AUDIT.md` §1. Thêm `method_coverage` theo 6 trường × 12 nhóm, và `all_entity_facts` (RM-F1 tái lập bằng công cụ: 270/334 estimated, 18/62 uncertain không có `method`). Số đếm phân loại không đổi | Trước: `b3/global_data_audit.json`. Sau: `b3/review1/global_data_audit.json`. Đối chiếu: `b3/review1/logs/r1_global_data_audit.log`. Báo cáo: `S0_GLOBAL_DATA_AUDIT.md` §1, §2.3 |
| B | 12 nhóm thống kê và 13 khu vực của đặc tả | Ghi rõ 12 **nhóm phân tích**, Tây Á và Trung Đông gộp, không tuyên bố phân tích độc lập 13 khu vực. Công cụ ghi `analysis_groups`. Không đổi phân vùng hay dữ liệu | `S0_GLOBAL_DATA_AUDIT.md` §1.1, §2.2, §5; §2 của tài liệu này; `tools/audit/s0/global_data_audit.ts` (chú thích đầu tệp) |
| C | Phân biệt "không có P0 mới" với R7 | §4: B3 không phát hiện P0 mới; R7 là P0 đã nhận diện từ trước, vẫn mở; grep xác nhận không có xử lý vòng đời/WebGL. Ma trận MS-13.5-04 đổi mức thành P0 (R7) | `b3/review1/logs/r1_r7_lifecycle_grep.log`; `S0_REQUIREMENT_MATRIX.csv` dòng MS-13.5-04 (chỉ dòng này đổi so với `55331c2`) |
| D | Kiểm tra `w.start`, `st.tick`, thời điểm bắt đầu/kết thúc; xác định 145 là lỗi hay quy ước; đề xuất test đúng | Probe mới `probe_war_duration.ts`, 4 kịch bản. Kết luận: quy ước đếm (do `start = -1` của chiến tranh khởi đầu), không phải sai lệch logic quan sát được. Phát hiện WD-F1…F3; test đề xuất ở §4.1 | `b3/review1/probe_war_duration_*.json`; `b3/review1/logs/r1_probe_war_duration.log`; `S0_TEST_CATALOG.md` TC-F2 |

Gate sau sửa (tự đánh giá):

- G0.3, G0.4, G0.5: `PASS`, không đổi. G0.5 có thêm giới hạn đã ghi rõ: 12 nhóm phân tích, phân loại theo nhãn.
- G0.7: `BLOCKED`. G0.8: `PARTIAL`.
- G0.6 và G0.9: `NOT_TESTED`.

## 9. Kết quả review vòng 2 — B3 bounded REVIEW_PASS (2026-11-16)

- Reviewer: ChatGPT (review độc lập đối với phần audit do Claude thực hiện; kết quả lịch sử, không phải self-review của lượt triển khai này).
- Exact reviewed commits: tools `ddea490635c5d7c74ca6108549fd21806102487b`; reports/evidence `2c62b3de3955e3cd8a82a9c59401d9df77d69173`.
- Verdict: **`REVIEW_PASS` cho phạm vi S0-B3 audit בלבד**. Bốn điểm A–D từ vòng 1 đã được xử lý: phân loại `estimated`/coverage `method`; 12 nhóm phân tích khác 13 vùng trong spec; R7 P0 có trước B3 và vẫn OPEN; quy ước 145/144 tháng và các phát hiện WD-F1…F3 được phân tích/ghi rõ.
- Điều kiện phạm vi: không có xác nhận tính năng sản phẩm đã hoàn thiện, không đóng G0.7/G0.8, không chấp nhận toàn bộ S0 và không tự động mở S1. B4 chỉ được phép tiếp tục sau verdict này theo OD-20261116-11; B4 sau đó đã có review riêng cho G0.6.
- Vì vậy, trạng thái Phase Register `S0-B3` trong `AI_HANDOFF.md` phải là `REVIEW_PASS` (bounded audit scope), không còn `READY_FOR_REVIEW`. Các dòng `READY_FOR_REVIEW` trong work log cũ được giữ nguyên như lịch sử tại thời điểm chúng được ghi.