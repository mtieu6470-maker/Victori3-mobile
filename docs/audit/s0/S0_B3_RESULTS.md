# S0_B3_RESULTS — tóm tắt S0-B3 và đánh giá gate (tự đánh giá)

| Trường | Giá trị |
|---|---|
| Task | S0-B3, ủy quyền bởi OD-20261116-11 (v3.3 §3.1) |
| Mã được kiểm | Baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` trong worktree tạm sạch (`git worktree add --detach`). Sau toàn bộ B3, `git status --porcelain` của worktree rỗng |
| Base của commit B3 | `9a602f3d60456c014fb33d4ebd83f174af299077` |
| Nhãn | `BASELINE_ORIGINAL` cho mọi số đo và kết quả test: mã, test, dữ liệu, asset và build của sản phẩm không đổi. Công cụ kiểm toán nằm ở `tools/audit/s0/`, ngoài mã sản phẩm. Sản phẩm trong repository giữ nguyên so với `2240a8f`, trừ workflow B1 đã được duyệt (kiểm bằng `git diff`, xem handoff) |
| Người lập | Claude Code, 2026-11-16. **Tự đánh giá, chưa được review độc lập.** Không có trạng thái `REVIEW_PASS` hay `ACCEPTED` nào được ghi ở đây |

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
| G0.5 Global data | `NOT_TESTED` | **PASS** | Đủ 12 vùng; phân loại sourced/estimated/default/missing/labelled_without_source; crosswalk 4 374 cặp |
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
| RM-F1 | P2 | 270/334 dữ kiện `estimated` và 18/62 `uncertain` không có `method`; chỉ 29 dữ kiện có `range`. Trái §2.1/§2.3 (ghi phương pháp, phạm vi) | Đếm trên `src/generated/db.json` của baseline | S1 |
| RM-F2 | P2 | Nhật ký bị cắt ở 4 000 mục (`src/engine/core.ts:38-42` `LOG_CAP`, `splice` mục cũ). Trong ván 100 năm, mục đầu bị xóa, trái §9.3 và §13.2 (không ghi đè lịch sử). Nhật ký lãnh thổ riêng (`territoryLog`) không bị cắt | mã | S1, S22 |
| RM-F3 | P1 | Mô phỏng chạy đồng bộ trên luồng chính. Tick p95 29–33 ms (Node) và 39–63 ms (callback khung hình, Chromium) vượt mục tiêu S2 (p95 ≤ 8 ms) | `S0_PERFORMANCE_BASELINE.md` §2, §3.2 | S2 |
| RM-F4 | P2 | Vòng lặp game gắn với `requestAnimationFrame` (`controller.ts:66-81`), nên tốc độ game bị giới hạn bởi tốc độ sinh khung. Trong môi trường SwiftShader, tốc độ 1–5 gần như cùng một thông lượng | `S0_PERFORMANCE_BASELINE.md` §3.3 | S2 |
| RM-F5 | P3 | Game không có điểm kết thúc 1936; mô phỏng tiếp tục sau tick 1 200 | `src/engine/core.ts:30`; không có kiểm tra năm kết thúc | S22 |

## 4. Chỉ mục phát hiện B3 (không sửa gì trong S0)

| Nhóm | ID | Tài liệu |
|---|---|---|
| Test | TC-F1 (P1, pass rỗng `simulation.test.ts:34`), TC-F2 (P1, pass rỗng `simulation.test.ts:43`), TC-F3 (P2, lõi pass rỗng `content.test.ts:41`), TC-F4 (P2, 1870/1875 `simulation.test.ts:21`), TC-F5 (P1, đầu vào B4), TC-F6, TC-F7 (P2) | `S0_TEST_CATALOG.md` §3 |
| Dữ liệu | GD-F1 (P2, 5 nhãn không nguồn), GD-F2 (P1, độ phủ không đều), GD-F3, GD-F4 (P2), GD-F5, GD-F6 (P3) | `S0_GLOBAL_DATA_AUDIT.md` §4 |
| Asset | AS-F1 (P1, giấy phép chưa xác minh lại), AS-F2, AS-F3, AS-F4 (P2), AS-F5, AS-F6, AS-F7 (P3) | `S0_ASSET_AUDIT.md` §4 |
| Ma trận/hiệu năng | RM-F1…RM-F5 | §3 ở trên |

Không phát hiện nào là P0. Rủi ro P0 tiềm tàng duy nhất đã biết là G0.6 (tất định save/load), sẽ được B4 kiểm.

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

## 7. Bước tiếp theo

Dừng ở `READY_FOR_REVIEW` để ChatGPT review B3. B4 **chưa bắt đầu** và chỉ bắt đầu sau `REVIEW_PASS` của B3. Nếu B4 cho G0.6 `FAIL`: dừng, chỉ đề xuất `PRE-S1-SAVE-DETERMINISM-REMEDIATION`, không tự sửa.
