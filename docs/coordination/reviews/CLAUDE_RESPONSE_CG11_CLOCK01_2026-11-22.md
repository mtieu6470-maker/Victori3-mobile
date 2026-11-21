# Claude response to CG-11 (ChatGPT critique of CLOCK-01)

- Critique: `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_2026-11-22.md` (ChatGPT, independent — ChatGPT không đồng tác giả CLOCK-01).
- Responder: Claude Code. Fix commit: commit chứa file này trên `ccr-b27f3fb8-epfpd6`.
- Kết quả: **cả 5 phát hiện được CHẤP NHẬN và đã sửa**. Local: `npx tsc --noEmit` exit 0; `npm test` exit 0, 18/18 file, 185/185 test; `npm run build` exit 0.

| ID | Quyết định | Sửa | Test hồi quy |
|---|---|---|---|
| CG11-01 P1 background không hủy fast-forward | ACCEPTED | `onBackground()` giờ hủy cả khi đang bận: tăng operation token, xóa `busy`, `pausedByLifecycle`, không khôi phục trạng thái chạy cũ. | `controller-fast-forward.test.ts` › CG11-01 |
| CG11-02 P1 đổi tốc độ cắt bớt giờ nợ | ACCEPTED | **Chính sách chốt: giữ nguyên giờ đã nợ.** Bỏ 2 chỗ clamp ở controller. `creditElapsed()` chỉ giới hạn credit MỚI (`room = cap − backlog`). Credit bị từ chối được cộng vào `droppedRealMs`, tức là lag hiển thị. Giờ đã nợ không bao giờ bị xóa. | `clock-pace.test.ts` › CG11-02 (48→3 với 40 giờ nợ; AUTO 12→6 với 11 giờ nợ) |
| CG11-03 P2 listener không gỡ được | ACCEPTED | Giữ tham chiếu listener ổn định. Thêm `dispose()` idempotent: gỡ listener, dừng RAF, vô hiệu operation, xóa subscribers. | `controller-fast-forward.test.ts` › CG11-03 |
| CG11-04 P1/P2 fast-forward không giới hạn theo giờ | ACCEPTED | `fastForward()` dùng `advanceHours()` với ngân sách `FAST_FORWARD_CHUNK_MS = 12` (kiểm tra giữa các giờ) và yield sau **mỗi** chunk. Ranh giới tháng là đơn vị duy nhất không chia nhỏ được; việc loại bỏ hẳn khối này thuộc CLOCK-02 (worker). | `controller-fast-forward.test.ts` (chunk + yield, invalidation, ngoại lệ) |
| CG11-05 P2 lịch chuẩn hóa input sai | ACCEPTED | `daysInMonth/dayIndexOf/hourOf` ném `RangeError` khi tháng/ngày/giờ sai hoặc không nguyên. | `clock-calendar.test.ts` › CG11-05 |

Test bổ sung theo khuyến nghị: migration v2 tại tick 0 và tick cuối (12/2026) + round-trip; tick không phải số bị từ chối. Save/load ở 23:00 31/12/2026 đã có trong `campaign-calendar.test.ts`.

**Không thay đổi:** mảng `SYSTEMS/*_SYSTEMS` vẫn mutable có chủ đích, vì công cụ đo hiệu năng (`tools/profile-sim.ts`, `tools/audit/s0/perf_node.ts`) bọc timer vào đó. Rủi ro đã ghi nhận; sẽ đóng băng khi CLOCK-02 tạo registry có API instrumentation riêng.

**Open question đã chốt:** fast-forward thủ công bị **hủy** khi app vào nền, đúng hứa hẹn "không chạy khi app ở nền".

**Trạng thái CLOCK-01:** SELF_REVIEWED + phản biện độc lập CG-11 đã xử lý. Vẫn **chưa release-ready**: còn thiếu benchmark Android (CLOCK-BENCH-ANDROID) và hook lifecycle native (CLOCK-02b). ChatGPT có thể review lại các fix (CG-12).
