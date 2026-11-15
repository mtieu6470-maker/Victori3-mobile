# UI DESIGN SYSTEM — "Ledger & Atlas" (bản đã triển khai)

> Nguồn sự thật là mã: `src/ui/styles/theme.css` (token, thành phần), `src/ui/map/renderer.ts` (bản đồ), `src/ui/map/lenses.ts` (lớp bản đồ), `src/ui/map/labels.ts` (nhãn). Tài liệu này mô tả các quyết định; khi lệch, mã thắng.
> Tên làm việc của trò chơi: **Dòng chảy Lịch sử**. Tên thương mại do chủ dự án quyết định.

## 1. Định hướng

Phong cách đại chiến lược thế kỷ XIX, lấy Victoria 3 làm **chuẩn tham chiếu về ngôn ngữ thiết kế** (bản đồ là trung tâm, panel tối nhiều lớp, băng tiêu đề màu rượu vang viền đồng, chữ có chân cho tiêu đề, bảng dữ liệu dạng sổ cái, nút tròn viền đồng, bản đồ chính trị kiểu atlas tô màu nước) — chuyển thể cho màn hình cảm ứng Android dọc và ngang.

Không sao chép: không dùng logo, icon, font, texture, hình minh họa, mã hay chữ của Victoria 3. Mọi biểu tượng là đường nét SVG tự vẽ (`src/ui/components/icons.tsx`), khung trang trí làm bằng CSS, bản đồ do shader tự viết vẽ từ raster vùng của dự án. Phông chữ là phông mở được đóng gói kèm (chạy offline).

Đã bỏ hướng "dashboard thẻ bo góc" của bản wireframe trước: không bo góc lớn, không khoảng trống thừa; thông tin xếp theo dạng sổ cái, mục (entry) và băng tiêu đề.

## 2. Token màu (theme.css `:root`)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--ink-0` | `#0b1215` | nền ngoài cùng |
| `--panel` / `--panel-2` / `--panel-3` | `#1a2a2d` / `#203235` / `#273d40` | thân panel, dòng, dòng nổi |
| `--panel-inset` | `#13201f` | vùng chìm (ghi chú, danh sách mở rộng) |
| `--line` / `--line-2` | `#34494b` / `#4c6163` | đường phân cách mảnh |
| `--brass` / `--brass-dim` / `--brass-hi` | `#c3a05c` / `#7d6740` / `#ead096` | viền đồng, biểu tượng, lựa chọn |
| `--claret` / `--claret-2` | `#57202b` / `#74303b` | băng tiêu đề panel, tiêu đề mục |
| `--text` / `--text-2` / `--text-3` | `#ece0c4` / `#b8b39d` / `#8b917f` | chữ ngà, chữ phụ, chú thích |
| `--pos` / `--neg` / `--warn` / `--info` | `#93c47a` / `#e3806a` / `#e3b65e` / `#93bad6` | tăng, giảm, cảnh báo, thông tin |
| `--map-sea` / `--map-sea-deep` / `--map-ink` | `#b9ccc6` / `#8eabad` / `#2f3c3c` | biển giấy, biển sâu, mực bản đồ |

Quy tắc: trạng thái không chỉ dựa vào màu — luôn có ký hiệu (▲▼■), chữ ("Thiếu 89%", "Dư thừa") hoặc hoa văn (gạch chéo cho vùng bị chiếm).

## 3. Chữ

| Vai trò | Phông | Cỡ |
|---|---|---|
| Tiêu đề panel (small-caps) | EB Garamond 600 | 22px |
| Băng mục, tên mục, tên quốc gia, tên hàng hóa | EB Garamond 500–600 | 15–20px |
| Dữ liệu, số liệu (tabular-nums) | Source Sans 3 400–700 | 13–20px |
| Chú thích tối thiểu | Source Sans 3 | 11.5–12.5px |
| Nhãn bản đồ (quốc gia) | EB Garamond 600, giãn chữ 0,14em, mực nâu + viền sáng | 11–34px theo diện tích |
| Nhãn biển/đại dương | EB Garamond nghiêng, chữ hoa giãn rộng | 11–20px |

EB Garamond và Source Sans 3: SIL Open Font License 1.1, cài qua `@fontsource/*`, có bộ ký tự tiếng Việt, đóng gói vào bản build.

## 4. Thành phần

| Thành phần | Mô tả | Tệp |
|---|---|---|
| Thanh trên (top bar) | Nhận diện (cờ + tên ngắn + chế độ) · dải KPI (biểu tượng + giá trị + biến động, cuộn ngang có mép mờ) · cụm thời gian (thông báo, năm/tháng, vạch tốc độ, nút dừng/chạy tròn) | `App.tsx` `TopBar` |
| Thanh điều hướng | Ngang: rail trái 60px, 8 nút tròn viền đồng. Dọc: thanh đáy 66px, 6 nút có nhãn | `App.tsx` |
| Panel | Băng tiêu đề rượu vang + viền đồng + hai đường kẻ trang trí; nút tròn mở rộng/đóng; hàng tab phẳng (tab đang chọn: nền sáng hơn + viền đồng trên) | `components/ui.tsx` |
| Băng mục (`.shead`) | Dải rượu vang hẹp, chữ có chân căn giữa | `ui.tsx` `Section` |
| Mục (`.entry`) | Hàng có biểu tượng · nhãn nhóm nhỏ · tiêu đề chữ có chân · dòng phụ · cột phải số liệu/nút | dùng cho luật, nhóm lợi ích, công nghệ, công trình, cửa sổ quyết định |
| Bảng sổ cái (`.ledger`) | Tiêu đề dính, chữ có chân; dòng xen kẽ; số căn phải; cột đầu dính khi cuộn ngang | thị trường, vùng, quan hệ, xếp hạng |
| Ô số liệu (`.plate.stat`) | Tấm tối viền mảnh: nhãn + giá trị + biến động theo kỳ + đường xu hướng **chỉ khi có ≥ 3 mẫu năm thật** | `Stat` |
| Chip | Nền màu nhạt + ký hiệu ▲▼■ | `Chip` |
| Ký hiệu độ tin cậy | ● ◆ ▲ ◇ ○ → chạm mở hộp "Nguồn & độ tin cậy" (trích dẫn + vị trí + phương pháp) | `QualityMark`, `Provenance` |
| Hộp thoại | Cùng khung panel, nền mờ phía sau | `ModalHost` |
| Thẻ vùng | Băng rượu vang tên vùng, chủ sở hữu, 3 chỉ số, 2 nút | `screens/StateCard.tsx` |
| Thanh lớp bản đồ | Khay tròn giữa đáy bản đồ, 6 nút tròn + nút mô tả | `MapChrome` |

## 5. Bản đồ

- Raster vùng thật (`public/generated/map.bin`, 0,25°) → texture chỉ số vùng; shader chọn vùng bằng lọc song tuyến theo loại nên ranh giới mịn ở mọi mức zoom.
- Phong cách atlas: biển màu giấy xanh với lưới kinh vĩ tuyến (10°, 5° khi zoom gần) và nhãn độ ở mép; đường bờ mực; vùng đất tô màu nước nhạt; dải màu đậm hơn dọc biên giới quốc gia; biên giới vùng mờ, chỉ hiện khi zoom gần; vân giấy tạo bằng thuật toán trong shader.
- Lớp bản đồ ("Lớp bản đồ", không dùng "Lens"): Chính trị, Mật độ dân số, Mức sống, Biết chữ, Ngoại giao, Thị trường — đều có chú giải với đơn vị/khoảng.
- Nhãn quốc gia (`labels.ts`): đặt tại "cực khó tiếp cận" của lãnh thổ liền khối (ô xa biên giới nhất), xoay theo trục chính (±28°), cỡ theo diện tích, phải nằm ≥ 80% trong nước mình, không chồng nhau, không đè lên chú giải/thanh lớp/nút bản đồ; nước nhỏ bị ẩn ở mức zoom xa, tên có gạch nối được viết tắt; ưu tiên: quốc gia người chơi → cường quốc → diện tích. Kiểm thử tự động ở `tests/ui.test.ts` (châu Âu 1836, 3 khung nhìn).

## 6. Bố cục theo hướng màn hình

| | Ngang | Dọc |
|---|---|---|
| Điều hướng | Rail trái, chỉ biểu tượng (nhãn hiện khi màn cao ≥ 640px) | Thanh đáy 6 mục: Bản đồ, Kinh tế, Xã hội, Ngoại giao, Quân sự, Thêm |
| Panel | Bên trái, rộng min(50%, 560px), bản đồ vẫn thấy bên phải; nút mở rộng toàn chiều ngang | Toàn màn hình giữa thanh trên và thanh đáy |
| KPI | Có nhãn chữ nhỏ | Chỉ biểu tượng + giá trị (chạm để mở màn tương ứng) |
| Thị trường | Bảng sổ cái, cột hàng hóa dính khi cuộn ngang | Danh sách mục 2 dòng |
| Thẻ vùng | Góc phải dưới | Dải đáy toàn chiều ngang |

## 7. Tương tác
- Vùng chạm ≥ 44px (nút tròn 40px có vùng chạm mở rộng).
- Hành động không thể hoàn tác (tuyên chiến) phải **giữ nút 0,7 giây**.
- Mọi lệnh đi qua `execute()` của engine; kết quả (thành công hoặc lý do bị từ chối) hiện thành thông báo nổi — không có nút giả.
- Bàn phím (nếu có): Space = dừng/chạy, 1–5 = tốc độ, Esc = đóng.
