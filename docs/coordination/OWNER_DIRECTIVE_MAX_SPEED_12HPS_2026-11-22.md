# OWNER DIRECTIVE — 12 giờ game/giây là tốc độ tối đa (22/11/2026)

- Nguồn: chủ dự án nhắn Claude Code trong phiên ngày 22/11/2026: "Tôi nghĩ nên để 12h/s là cao nhất, có mấy mức thấp hơn thì hay hơn, chứ như thế mau endgame lắm".
- Phạm vi: chỉ thay thế danh sách preset tốc độ cố định trong `OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md` §2.1 mục 8 (0.25x = 3h/s … 4x = 48h/s). Mọi yêu cầu khác về đồng hồ giữ nguyên: AUTO 12h/s → 6h/s khi quá tải, giờ canonical, tất định, không bỏ giờ.

## Quyết định

1. **12 giờ game / 1 giây thực là tốc độ chơi tối đa.** Bỏ 24h/s và 48h/s.
2. Preset cố định (Claude chọn theo chỉ thị "có mấy mức thấp hơn"): **1, 2, 3, 6, 12 giờ/giây** = 24, 12, 8, 4, 2 giây thực cho mỗi ngày game.
3. AUTO mặc định giữ nguyên: 12h/s khi máy đủ tải, tự hạ xuống 6h/s khi quá tải kéo dài.
4. Preference cũ đã lưu là 24 hoặc 48 h/s được kẹp về 12h/s khi đọc.
5. `fastForward(months)` chỉ còn là công cụ QA/kiểm thử (tham số URL `?months=`), không phải nút cho người chơi. Không thêm nút tua nhanh nhiều tháng cho người chơi trừ khi owner yêu cầu.

## Triển khai

`src/engine/clock/pace.ts` (`FIXED_RATES_HPS = [1, 2, 3, 6, 12]`, `MAX_RATE_HPS = 12`), HUD `src/ui/App.tsx`, test `tests/clock-pace.test.ts` và các test controller.
