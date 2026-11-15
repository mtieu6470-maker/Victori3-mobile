# Nghiệm thu thiết kế lại toàn bộ (v3) — ảnh chụp ứng dụng thật

Chụp từ **bản build production đang chạy** (Chromium, WebGL qua SwiftShader), khung điện thoại 915×412 dp (ngang) và 412×915 dp (dọc) ở mật độ **2,625×** — tức **2402×1082 px / 1082×2402 px**, độ phân giải gốc của một máy Android 420 dpi. Mỗi màn hình là **một ảnh riêng**, không ghép, không chỉnh sửa. Ván chơi: chế độ Lịch sử, seed 1, Anh, sau 60 tháng mô phỏng (1/1841). Mọi số liệu là trạng thái engine tại thời điểm chụp.

Tái tạo: `npm run build`, rồi `DSF=2.625 npx tsx tools/ui-shots.ts <thư mục> L "mode=historical&seed=1&player=GBR&months=60" <kế hoạch.json>` (kế hoạch: danh sách trạng thái; `tapRegion` chạm thật vào một vùng trên bản đồ).

## Luồng kiểm tra yêu cầu

| # | Yêu cầu | Ảnh (`docs/ui/screenshots/v3/`) |
|---|---|---|
| 1 | Màn hình chơi chính, không mở panel | `L01_ban_do_chinh_landscape.jpg`, `P01_ban_do_chinh_portrait.jpg` |
| 2 | Chọn một quốc gia (chạm vào bản đồ) | `L02_chon_quoc_gia_landscape.jpg` (chạm English Midlands), `P02_chon_quoc_gia_portrait.jpg` (chạm Île-de-France) |
| 3 | Country Overview | `L03_tong_quan_quoc_gia_landscape.jpg`, `P03_tong_quan_quoc_gia_portrait.jpg` |
| 4 | Economy | `L04_kinh_te_tong_quan_landscape.jpg`, `L05_thi_truong_chi_tiet_landscape.jpg`, `L18_ngan_sach_landscape.jpg`, `P04_thi_truong_portrait.jpg` |
| 5 | Construction | `L06_xay_dung_landscape.jpg`, `P05_xay_dung_portrait.jpg` |
| 6 | Diplomacy | `L07_ngoai_giao_landscape.jpg`, `P06_ngoai_giao_portrait.jpg` |
| 7 | Bản đồ toàn màn hình | `L08_ban_do_toan_man_hinh_landscape.jpg` |
| 8 | Các cửa sổ trên màn hình điện thoại | Politics `L09`, `L10`, `P07`; Population `L11`; Military `L12`; Technology `L13`; Journal `L14`; cửa sổ Vùng `L15`, `P10`; chế độ Địa hình `L16`; cửa sổ thu gọn `L17`, `P09`; Thế giới `L19`; bảng phân rã ngân khố `L20`; menu chế độ bản đồ `P08` |

## So sánh với v2

- `docs/ui/screenshots/compare/v2_vs_v3_landscape.jpg` — bản đồ chính, tổng quan quốc gia, thị trường + chi tiết, luật + chi tiết.
- `docs/ui/screenshots/compare/v2_vs_v3_portrait.jpg` — thị trường, quốc gia, chọn vùng, bản đồ.

| Khía cạnh | v2 | v3 |
|---|---|---|
| Kiến trúc | Panel neo cố định nửa trái màn hình | Bản đồ toàn màn hình; cửa sổ nổi thu gọn/mở rộng/đóng; chế độ toàn bản đồ |
| Bản đồ | Biển giấy nhạt, màu chính trị pastel, bờ biển bậc thang khi zoom gần | Đại dương sâu có độ sâu, địa hình màu thật, chế độ Địa hình, ranh giới mịn, nhãn chữ hoa bản đồ học, hiệu ứng chọn bang/quốc gia, tooltip |
| Khung cửa sổ | Dải tiêu đề phẳng màu rượu vang | Khung đồng + ngoặc góc, huy chương module, hình mờ, vạch màu module, nút thu gọn |
| Thanh trên | Biểu tượng nét đơn | Huy chương màu cho từng tài nguyên, ô ngày khung, nút chạy kim loại |
| Điều hướng | Thanh công cụ phẳng | Nút vuông kim loại nổi (rail) / dock kim loại (dọc) |
| Nội dung | Mục kẻ mảnh, thanh tỷ trọng | Plaque có dải tiêu đề, ô số liệu có góc đồng, donut, biểu đồ vùng, banner nhuộm màu chủ thể |
| Quốc gia | Ô màu | Huy hiệu khiên |

## Giới hạn (trung thực)

- Chưa đo trên điện thoại Android thật; APK debug do GitHub Actions build từ cùng mã. Ảnh dùng WebGL phần mềm (SwiftShader) nên hiệu năng trên máy thật cần kiểm tra riêng (shader bầu chọn 3×3 chỉ chạy khi phóng to).
- Ranh giới hành chính hiện đại dùng làm xấp xỉ địa lý 1836. Tên vùng theo cơ sở dữ liệu (tiếng Anh).
- Không có cờ lịch sử và chân dung nhân vật (không có tài sản được phép); dùng huy hiệu và huy chương.
- Giao diện chỉ hiển thị hệ thống engine có thật; các hệ thống chưa có (production method, front, hạm đội…) không có màn hình — xem `docs/research/PASS16_REPO_AUDIT.md`.
