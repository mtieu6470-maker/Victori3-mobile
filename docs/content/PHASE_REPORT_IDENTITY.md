# Báo cáo giai đoạn 1–5 (bản sắc quốc gia, nhân vật, tài sản) — 2026-11-16

Phạm vi: các giai đoạn 1–5 của lộ trình trong đặc tả (audit, danh mục, Asset Registry, hình ảnh & mô tả, bản sắc & nhân vật). Các hệ thống mô phỏng (xã hội, kinh tế, chính trị, ngoại giao, quân sự, AI, tỉnh/công trình) **không** thay đổi trong đợt này.

## Commit

| Commit | Nội dung |
|---|---|
| `2af632a` | Đặc tả design system v4 + bộ biểu tượng (việc tồn từ yêu cầu trước) |
| `93c264b` | Giai đoạn 1: kiểm toán độ phủ toàn cầu (`tools/audit/coverage.ts`) + audit repo theo đặc tả |
| `c0dd1e2` | Giai đoạn 2: liên kết 266/274 thực thể với Wikidata có kiểm tra niên đại 1836; danh sách 577 chính thể ứng viên còn thiếu |
| `2f89197` | Đường ống Asset Registry + giao diện bản sắc (quốc kỳ theo năm, khối bản sắc, tab Nhân vật, nguồn ảnh) |
| `0d5f3f6` | 275 quốc kỳ/huy hiệu cho 122 thực thể sau duyệt tay |
| `22e3f78` | Mô tả có trích dẫn cho 265 thực thể (142 tiếng Việt); kiểm thử nội dung |
| `71ae0ee` | Tên theo năm Việt Nam/Đại Nam (1839, có nguồn) |
| `3617c0a`, `e9fcd47` | 473 nhân vật, 275 đối chiếu Wikidata, 227 chân dung, 274 tiểu sử |

## Số liệu kiểm chứng được (từ `public/content/registry.json` và `docs/audit/`)

| Hạng mục | Trước | Sau |
|---|---:|---:|
| Thực thể liên kết Wikidata (có bằng chứng niên đại) | 0 | 266 / 274 |
| Quốc kỳ theo thời kỳ / huy hiệu | 0 / 0 | 176 / 99 (122 thực thể) |
| Mô tả có nguồn (vi / en) | 0 | 265 (142 vi) |
| Nhân vật có hồ sơ / đối chiếu Wikidata / chân dung / tiểu sử | 0 | 473 / 275 / 227 / 274 |
| Dung lượng gói nội dung | 0 | 8,7 MB (WebP) |
| Điểm độ phủ toàn cầu (16 khía cạnh) | 40 % | 52 % |
| Châu Phi hạ Sahara · Trung Mỹ & Caribe · Đông Nam Á | 32 · 24 · 37 % | 41 · 41 · 46 % |

## Kiểm thử

- `tests/content.test.ts` (7 test): tệp tồn tại; giấy phép trong danh sách cho phép; có trang nguồn Commons và mệnh đề Wikidata; biểu tượng không hiển thị ngoài thời kỳ; mọi tham chiếu thực thể/nhân vật tồn tại; văn bản có URL, bản sửa, CC BY-SA; chính thể liên kết vượt kiểm tra 1836; nhân vật khớp "strong" có năm sinh/mất lệch ≤ 2 năm so với CSDL.
- `npx tsc --noEmit` sạch; build Vite thành công; bộ test cũ không thay đổi logic mô phỏng.

## Duyệt tay (bắt buộc, không tự động hóa được)

`historical_data/assets/review.json` ghi lý do cho từng tệp bị loại: 45 quốc kỳ/huy hiệu (biểu tượng hiện đại hoặc phiên bản muộn gán ngược — cờ Thái Lan 1917 cho Xiêm, cờ Ba Tư 1907, huy hiệu Hy Lạp 1936, huy hiệu phiên vương Ấn Độ 1877+; phục dựng không nguồn; cờ Ottoman "ba trăng" mà chính Commons ghi là hư cấu) và 6 ảnh "chân dung" không phải chân dung (ảnh cắt từ tiền giấy, ảnh tượng đài, thư pháp tên, chiếu chỉ). Hai thời kỳ được sửa (cờ Hannover từ 1837, huy hiệu Hawaii từ 1845).

## Bằng chứng (ảnh chụp app thật, `docs/content/screenshots/`)

Chụp từ bản build production chạy trong Chromium (WebGL SwiftShader), 915×412 dp ở 2,625× = 2402×1082 px (và 1082×2402 dọc). **Đây không phải nghiệm thu trên thiết bị Android thật.**

| Ảnh | Cho thấy |
|---|---|
| `C01`–`C07` | Khối bản sắc: Việt Nam (tên 1836 "Việt Nam · 越南"), Xiêm, Ottoman (không có cờ vì cờ 1836 chưa có nguồn hợp lệ), Ba Tư, Asante (biểu tượng nhím), Brasil, Hawaii |
| `C08` | Vương quốc Kongo — chính thể "placeholder": có cờ/huy hiệu lịch sử nhưng tên tiếng Anh, nguyên thủ là nhân vật mô phỏng (khoảng trống được hiển thị, không che giấu) |
| `C09`–`C11` | Tab Nhân vật (Anh, Việt Nam) và chi tiết nhân vật (năm sinh/mất CSDL ↔ Wikidata, bằng chứng đối chiếu) |
| `C13`, `C14` | Gói nội dung trong cửa sổ Hệ thống, danh sách nguồn từng quốc kỳ |
| `C15` | Bảng Thế giới dùng quốc kỳ theo năm |
| `C16`, `C17`, `P03` | "Bối cảnh lịch sử" có trích dẫn (Wikipedia tiếng Việt / tiếng Anh) |
| `C18`, `C19` | Chạm bản đồ: thẻ ngữ cảnh có câu mô tả có nguồn về chủ vùng |
| `P01`, `P02` | Bố cục dọc |

## Vấn đề còn tồn tại (trung thực)

1. 152 / 274 thực thể chưa có quốc kỳ/huy hiệu hợp lệ cho thời kỳ (thường là chính thể ngoài châu Âu, nơi Commons chỉ có phục dựng không nguồn). Game hiển thị huy hiệu khiên do game tạo — đúng quy tắc, nhưng là khoảng trống nội dung.
2. 33 chân dung bị Wikimedia giới hạn tốc độ ("deferred"); chạy lại `python3 tools/etl/fetch_portraits.py` để lấy.
3. 198 bản ghi nhân vật chưa đối chiếu được (không có nhãn khớp trên Wikidata hoặc lệch ngày) — vẫn hiển thị, ghi "chưa đối chiếu".
4. Thực thể "placeholder" (104) vẫn mang tên tiếng Anh, không có nguyên thủ lịch sử, không chọn chơi được; mô tả của nhóm phi tập trung dựa trên bài về dân tộc/vùng (được ghi rõ trên giao diện).
5. Không có hình ảnh kinh tế, xã hội, quân sự, sự kiện, kiến trúc (đặc tả 6.2–6.5) — cần quy trình duyệt tay theo thời kỳ, chưa làm.
6. Nhân vật mới chỉ có vai trò mô phỏng ở nguyên thủ (kế vị, tuổi thọ); bộ trưởng, tướng, đô đốc chưa tồn tại trong engine.
7. Gói nội dung đóng trong APK (8,7 MB), chưa có gói tải riêng, đa độ phân giải, checksum (đặc tả mục 14).
8. Mô hình tầng lớp chung, `powerScore` đơn chỉ số, nhóm lợi ích đồng nhất — chưa sửa (giai đoạn sau).
