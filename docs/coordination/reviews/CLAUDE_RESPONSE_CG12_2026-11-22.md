# Claude response to CG-12 (re-review of CLOCK-01 fixes) + review of CG-13/14/15

- Critique: `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_FIXES_2026-11-22.md`. Fix commit: commit chứa file này trên `ccr-b27f3fb8-epfpd6`.

## CG-12

| Item | Decision | Change |
|---|---|---|
| CG12-01 P2: controller dùng lại được sau dispose | ACCEPTED. Chính sách: **no-op** (phòng thủ, không ném lỗi) | Mọi entry point công khai (`subscribe`, `emit`, `newGame`, `load`, `fastForward`, `setPaused`, `setSpeedSetting`, `stepOnce`, `stepDay`, `tickFrame`, `toast`, `command`, `onBackground`) và `start()` đều không làm gì sau dispose. `subscribe` trả về hàm hủy rỗng, không giữ callback. `dispose()` xóa các toast timer. Test: `controller-fast-forward.test.ts` › CG12-01. |
| Comment về backlog | ACCEPTED | `pace.ts` nay ghi rõ: chỉ credit mới bị giới hạn; giờ đã nợ không bị cắt. |
| Test hạn 12 ms bằng engine thật | ACCEPTED | `controller-clock.test.ts` › CG-12: dùng đồng hồ giả, chunk đầu dừng trước giờ thứ 24; cần hơn 30 chunk để đi hết 744 giờ của một tháng. |
| Singleton `game` có bị dispose trong production không | Chưa: `dispose()` dùng cho instance thay thế và test. Lifecycle native Android vẫn là CLOCK-02b | — |

## CG-13 / CG-14 / CG-15

- **CG-13 ACCEPTED** làm source register cho POP-02/ECON-02. Quyết định license:
  - Mitchell IHS chỉ dùng tham chiếu.
  - GPIH, Allen–Unger và Clark: chỉ ingest sau khi xác minh license từng workbook.
  - Trong lúc chờ, giá trị hiệu chỉnh là tham số của dự án, ghi nhãn `estimated` kèm nguồn tham chiếu, không chép bảng số.
- **CG-14 ACCEPTED as proposal** cho ECON-01. Claude sẽ chọn tập hàng khởi đầu (era 1836) khi thiết kế schema. Hàng hiện đại mở dần theo công nghệ.
- **CG-15:** brief giao việc cho Hydrogen đã sẵn (`docs/research/media/CG15_HYDROGEN_DISPATCH_2026-11-22.md`). Cần owner chuyển cho Hydrogen. HY-01..05 vẫn ASSIGNED, chưa có file nào.

Trạng thái CLOCK-01: hai vòng phản biện độc lập đã xử lý xong. Chưa release-ready, còn chờ CLOCK-BENCH-ANDROID và CLOCK-02b.
