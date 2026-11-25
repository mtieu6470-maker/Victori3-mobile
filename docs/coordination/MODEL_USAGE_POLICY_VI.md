# Chính sách chọn mô hình Claude (owner 2026-11-25)

Lý do: hạn mức gói 20 USD có hạn; owner muốn tiết kiệm. **Mặc định dùng Sonnet.** Chỉ dùng Opus khi việc khó.

## 1. Quy tắc cho Claude
1. **Mặc định Sonnet** cho mọi việc thường (mục 2). Cứ làm, không hỏi.
2. **Khi gặp việc khó (mục 3), dừng trước khi làm** và nói với owner đúng một câu, kiểu: "Việc này nên dùng Opus vì <lý do ngắn>. Bạn đổi sang Opus rồi nhắn 'tiếp' nhé." Không tự đốt hạn mức vào việc khó khi đang ở Sonnet.
3. **Tự nhận ra mình đang vật lộn:** hai lần sửa không xong cùng một lỗi, test hỏng ở nhiều module không rõ nguyên nhân, hoặc thiết kế còn mơ hồ → dừng và đề nghị đổi Opus, kèm tóm tắt đã thử gì.
4. **Mỗi đợt việc một phiên mới** (phiên dài làm mọi tin nhắn đắt hơn). Đọc `CLAUDE.md`, `docs/coordination/AI_HANDOFF.md`, `docs/roadmap/OPEN_WORK_FOR_CHATGPT_2026-11-24_VI.md` và bảng tin trước khi làm.
5. **Việc nhẹ giao cho trợ lý (subagent) chạy mô hình rẻ hơn** khi owner cho phép.
6. Không chờ lâu, không chạy bộ test đầy đủ liên tục: chạy test nhắm đúng phần đổi, chạy đầy đủ một lần ở cuối bằng chế độ nền.

## 2. Sonnet đủ (cứ làm)
- Nhập lô sự kiện, chạy `npm run data`, xem cảnh báo, sửa mã sai nhỏ.
- Chạy nhập ảnh, `npm run content`, build, đẩy APK, kiểm tra Actions.
- Sửa giao diện nhỏ: chữ, nhãn, định dạng số, màu, bố cục một màn hình.
- Cập nhật tài liệu, bảng tin, bàn giao, bảng đối chiếu.
- Viết test cho hành vi đã có; sửa lỗi có nguyên nhân rõ trong một file.
- Gộp nhánh, commit, đẩy.

## 3. Cần Opus (hỏi owner đổi trước khi làm)
- **Hệ thống mới đan nhiều module:** diplomatic play, mặt trận và tướng, hiệp ước có điều khoản, đảng phái và bầu cử, gói nội dung tải về.
- **Sửa lỗi khó:** mô phỏng ra kết quả lạ (ví dụ Ai Cập giữ Angola), lỗi chỉ lộ sau nhiều năm mô phỏng, lỗi xuyên module.
- **Cân chỉnh số liệu:** chạy mô phỏng nhiều thập kỷ và so với lịch sử.
- **Đổi hợp đồng dữ liệu:** cấu trúc `GameState`, lưu và nạp game, đồng hồ giờ, tính xác định (determinism).
- **Soát chất lượng một lô nội dung lớn** khi cần phán đoán (lời dẫn có rập khuôn không, hiệu ứng có hợp lý không).

## 4. Ghi chú
- Ranh giới không tuyệt đối: nếu thấy chưa chắc thì **hỏi owner**, đừng đoán.
- Sau mỗi việc ghi vào `AI_HANDOFF.md` để phiên sau (kể cả mô hình khác) làm tiếp được.
- Ràng buộc cũ vẫn giữ: không đụng thanh toán, bí mật, ký phát hành; không force-push; không bịa kết quả kiểm tra.
