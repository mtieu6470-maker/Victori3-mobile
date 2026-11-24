

## Cập nhật tích hợp — CG-64 (2026-11-24)

- Nhánh `ccr-b27f3fb8-epfpd6` đã được fast-forward vào `claude/game-historical-sandbox-modes-kg7rj7`, HEAD tích hợp `d877a3ffd71e84726098b4a58ae8f5f404036351`. Diff chỉ gồm docs và historical data; không thay đổi `src/`, `tools/` hoặc tests.
- Tổng dữ liệu FRA/JAP/QNG/RUS/VNM: **265 sự kiện, 26 nhật ký, 530 lựa chọn**. Kiểm tra tĩnh: JSON, ID, nguồn, entity/region và modifier keys đều qua. Có 106 ứng viên ảnh, chưa ingest binary.
- **Chặn nghiệm thu:** FRA/JAP/VNM có 102 bước journal dùng `event_fired`; engine đang cộng lại điểm mỗi tháng vì điều kiện này là trạng thái tồn tại lâu dài. Cần Claude sửa one-shot milestone và thêm regression tests. QNG/RUS dùng tiến độ thời gian.
- 187 event có `fire_date` giữa tháng; engine chỉ đánh giá ở monthly tick. Cần test ngày kích hoạt thực tế và biên window/entity hist_to, đặc biệt QNG 1912-02-12 và RUS 1917-03-15.
- Chưa chạy `npm run data`, `npm run content`, tests, simulation, Android build/APK hoặc device QA. Không được gọi là release-ready.
- Báo cáo soát: `docs/research/history/CG64_CHATGPT_IMPORT_REVIEW_2026-11-24_VI.md`.
- **A1 tiếp theo:** PRU → USA → TUR. MSG-129 vẫn IN_PROGRESS.
