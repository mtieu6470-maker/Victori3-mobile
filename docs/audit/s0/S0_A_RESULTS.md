# S0-A — kết quả và trạng thái (baseline nguyên trạng)

| Trường | Giá trị |
|---|---|
| Nhãn | `BASELINE_ORIGINAL` |
| Đặc tả | `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` §6.3 S0-A (A1–A5), §6.4, §6.5.1 — commit `574ddc7` |
| Uỷ quyền | OD-20261116-10: chỉ S0-A. S0-B (B1–B7), S1 và các giai đoạn sau: **chưa được phép** |
| Baseline code SHA | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` |
| Ngày | 2026-11-16 |
| Trạng thái nhiệm vụ | `READY_FOR_REVIEW`. Mọi kết quả dưới đây là Claude tự đánh giá, **chưa được kiểm tra độc lập**; chủ dự án chưa quyết định |

Từ vựng theo `docs/coordination/AI_COLLABORATION_PROTOCOL.md`. Bản v3.2 viết "NOT TESTED"; tài liệu này dùng `NOT_TESTED` với cùng nghĩa.

## 1. Các bước S0-A

| Bước | Nội dung (§6.3) | Kết quả | Bằng chứng |
|---|---|---|---|
| A1 | Commit snapshot + log nguyên văn | `PASS` | `S0_REPOSITORY_SNAPSHOT.md`, `logs/a1/`. Commit `7d6eec9`, cộng commit `d5b9820` thêm 4 tệp `.log` bị `.gitignore` chặn (F4) |
| A2 | Clean build trong worktree tạm đúng `2240a8f`; `npm ci`, data, map, content, typecheck, `vite build`, `vitest run` ×3 | `PASS` | `S0_BUILD_TEST_REPORT.md` §2, `logs/a2/` |
| A3 | Trạng thái tệp sinh trước/sau từng bước | `PASS` | `S0_BUILD_TEST_REPORT.md` §3, `logs/a2/state_*.txt` |
| A4 | So payload với manifest APK theo 4 nhóm | `PASS` — "web/data payload comparison completed" | `S0_BUILD_TEST_REPORT.md` §4, `logs/a4/`, `a4/`, `inputs/` |
| A5 | Đo `BASELINE_ORIGINAL`: Node, trình duyệt desktop, thiết bị | `BLOCKED` | Mục 2 |

## 2. A5 — vì sao `BLOCKED`, cần gì để gỡ

- **Node + trình duyệt desktop.** §6.3 A5 quy định harness đo nằm ngoài mã sản phẩm và được commit ở S0-B bước B3; A5 chạy sau B3 trên worktree baseline. S0-B chưa được phép, nên harness chưa có. Claude **không** tự viết harness tạm hay đưa ra số đo không có harness đã commit.
  - Phụ thuộc thiếu: uỷ quyền S0-B (bước B3).
  - Số đo cũ 26,4 ms/tháng trong tài liệu kiến trúc cũ (máy chủ, `2240a8f`) **không** được dùng làm kết quả A5.
- **Thiết bị (iQOO Z10 Turbo, APK baseline).** Cần chủ dự án thao tác trên thiết bị, theo §6.5.1 bước 1–4 (bên dưới).
  - Phụ thuộc thiếu: thiết bị và thao tác của chủ dự án.

### Việc chủ dự án làm được ngay trên thiết bị (§6.5.1 bước 1–4, APK baseline đang cài)

Những bước này không cần thay đổi mã. Chúng chỉ gỡ được một phần A5 (thông tin thiết bị và quan sát) và chuẩn bị điều kiện cho C3 ở S0-B.

1. Ghi model, phiên bản Android, phiên bản "Android System WebView" (Cài đặt → Ứng dụng → Android System WebView), refresh rate đang dùng.
2. Ghi quan sát khi chạy APK baseline ở từng tốc độ 1–5, ví dụ giật/khựng hoặc nóng máy, có ảnh hay video thì càng tốt. Không có công cụ đo thì ghi "không đo được"; không ước lượng thành số.
3. Trong game: Hệ thống → mục "Tệp" → "Xuất tệp". Ghi lại **có tạo được tệp hay không** và tệp nằm ở đâu.
   - Rủi ro R14: cơ chế tải `Blob` có thể không hoạt động trong WebView Android.
   - Nếu không có tệp: ghi `BLOCKED` và **không** gỡ APK baseline.
4. Nếu bước 3 có tệp: Hệ thống → "Tệp" → "Nhập tệp", chọn tệp vừa xuất, rồi kiểm ván mở đúng ngày trong game.

Gửi lại kết quả dạng văn bản/ảnh. **Không** gửi keystore, mật khẩu hay bất kỳ bí mật nào.

## 3. Các cổng G0.1–G0.9 sau S0-A

| Cổng | Kết quả | Ghi chú |
|---|---|---|
| G0.1 Snapshot | `PASS` | `S0_REPOSITORY_SNAPSHOT.md` §5 |
| G0.2 Build/CI | `PASS` | `S0_BUILD_TEST_REPORT.md` §5 |
| G0.3 Test catalog | `PARTIAL` | Có dữ liệu ổn định 3/3 cho cả 58 test; chưa có catalog phân tích (S0-B B3) |
| G0.4 Feature audit | `NOT_TESTED` | Thuộc S0-B |
| G0.5 Global data | `NOT_TESTED` | Thuộc S0-B (B3 crosswalk, coverage) |
| G0.6 Save/determinism | `NOT_TESTED` | Thuộc S0-B B4 (§6.7) |
| G0.7 Runtime/perf | `BLOCKED` | A5 (mục 2): chưa có harness (S0-B B3) và chưa có số đo iQOO |
| G0.8 Asset/license | `NOT_TESTED` | Thuộc S0-B |
| G0.9 Risk/signoff | `NOT_TESTED` | Risk register và sign-off thuộc S0-B B7 |

**S0 chưa PASS và chưa hoàn tất.** Phần S0-A đã có bằng chứng cho A1–A4; A5 `BLOCKED`. Theo §6.4, S0 chỉ PASS khi G0.1–G0.9 đều PASS. Thiếu số đo iQOO thì G0.7 ở `BLOCKED` và S0 ở `PARTIAL`.

## 4. Phát hiện đã ghi

- **F1** — `npm audit` báo 6 lỗ hổng ở công cụ dev/test/build. Chưa sửa; để vào risk register S0-B.
- **F2** — Khóa debug CI đổi mỗi lần chạy, đã xác minh trên 2 lần chạy. Khẳng định R1.
- **F3** — Số nội dung tại `2240a8f` do công cụ báo khớp với báo cáo giai đoạn cũ.
- **F4** — Quy tắc `.gitignore` `*.log`; log được thêm bằng `git add -f`.
- **F5** — Tên test "1870" so với mốc 1875.

Chi tiết ở `S0_BUILD_TEST_REPORT.md` §6. Ngoài ra, các nhận định "[SUY LUẬN]" và "[REVIEWER TÍNH ĐỘC LẬP]" của v3.2 §2.1 nay đã được Claude tự xác minh:
- mã băm ZIP và APK;
- manifest 592 tệp;
- khóa debug thay đổi theo từng lần chạy CI.

## 5. Phạm vi đã giữ

- Không sửa gameplay, engine, dữ liệu, UI, test, save format, migration, workflow, Gradle, signing, keystore hay GitHub Secrets.
- Mọi lệnh sinh tệp chạy trong worktree tạm, đã gỡ sau khi xong. Working tree chính sạch, HEAD không đổi trong lúc chạy (`logs/a2/99_worktree_remove.log`).
- Các commit S0-A chỉ thêm tệp dưới `docs/audit/s0/`. Handoff cập nhật trong commit riêng.
- Không bắt đầu S0-B hay S1. Không tự tuyên bố nghiệm thu. Dừng để ChatGPT kiểm tra độc lập và chủ dự án quyết định.
