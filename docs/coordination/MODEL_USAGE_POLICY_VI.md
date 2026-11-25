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

## 5. Dành cho Sonnet: đọc kỹ trước khi sửa (không phá những gì đã làm)

Dự án này đã có nhiều hệ thống đan nhau và gần 470 test. **Giữ nguyên những gì đang chạy đúng là ưu tiên số một.** Khi làm ở Sonnet:

### 5.1 Chủ động đề nghị đổi sang Opus
- Đừng cố "làm thử cho xong". Nếu việc thuộc mục 3, hoặc bạn thấy chưa chắc mình hiểu hết các hệ thống liên quan, **dừng lại và nói với owner ngay ở tin nhắn đầu tiên**: "Việc này nên chuyển sang Opus vì <lý do>."
- Dấu hiệu cần đổi: phải sửa quá 3 file lõi trong `src/engine/`; phải đổi kiểu dữ liệu `GameState`/`Country`/`Treaty`; đụng tới đồng hồ, lưu và nạp game, bộ sinh số ngẫu nhiên; test ở module khác bắt đầu hỏng; không giải thích nổi vì sao kết quả mô phỏng đổi.
- Hỏi sớm rẻ hơn sửa hỏng rồi đi hoàn tác.

### 5.2 Hàng rào bắt buộc
1. **Không xóa, không bỏ qua (`skip`/`only`), không làm yếu test để cho qua.** Test hỏng nghĩa là code sai hoặc hành vi đã đổi; nói rõ với owner. Chỉ sửa test khi hành vi đổi là chủ ý của owner, và ghi lý do trong commit.
2. **Thay đổi theo kiểu cộng thêm.** Thêm hàm, trường tùy chọn, tệp mới; đừng viết lại hay đổi tên hàng loạt các hàm đang được dùng.
3. **Không đổi hợp đồng dữ liệu** (`src/engine/types.ts`, `stateContract.ts`, định dạng lưu game, `historical_data/` đã có) trừ khi việc yêu cầu đúng điều đó. Có đổi thì giữ tương thích với bản lưu cũ và cập nhật `stateContract.ts` cùng test.
4. **Giữ tính xác định:** mọi ngẫu nhiên đi qua `rand(st)` / `chance(st, …)`; không dùng `Math.random()`, `Date.now()` trong mô phỏng.
5. **Logic luật chơi không nằm trong UI** (`src/ui/`); UI chỉ đọc trạng thái và gửi lệnh.
6. **Không sinh lại cả tệp dữ liệu lớn** (`src/generated/`, `public/content/`, `story_selection.json`) bằng tay; dùng công cụ có sẵn (`npm run data`, `npm run content`, `loc_ingest.py`).
7. **Không đụng tới phần không liên quan** đến việc đang làm. Không "tiện tay" refactor.
8. **Không đổi tốc độ, bí mật, ký phát hành, thanh toán.** Giữ 3 mức 3/6/12 h/s. Không force-push.

### 5.3 Quy trình mỗi lần sửa
1. Đọc `AI_HANDOFF.md` và phần liên quan trong `docs/design/` trước khi sửa.
2. Sửa nhỏ, rồi chạy `npx tsc --noEmit -p .` và **test nhắm đúng phần đổi** (`npx vitest run tests/<file>`).
3. Commit nhỏ, rõ ràng, có đuôi `Co-Authored-By` và `Claude-Session`. Đẩy lên `ccr-b27f3fb8-epfpd6`.
4. **Chạy bộ test đầy đủ một lần ở chế độ nền** trước khi đẩy sang nhánh mirror `claude/game-historical-sandbox-modes-kg7rj7`. Chưa qua hết thì không đẩy mirror.
5. Cập nhật `AI_HANDOFF.md` (làm gì, test nào, còn gì dở) để phiên sau, kể cả mô hình khác, làm tiếp được.
6. Nếu một bước kiểm tra hỏng mà không hiểu nguyên nhân: **dừng, báo owner, đề nghị Opus**. Không sửa mò.
