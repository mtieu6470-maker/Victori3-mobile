# Phân tích tham chiếu Victoria 3 → quyết định thiết kế v3

Nguồn phân tích: gói nghiên cứu Pass 16 (chương 13 *Map, UI/UX & Data Visualization*, 17 *Android UI redesign*, 38 *UI inventory*, 57 *Tech tree UX*, 59 *Living map*, 61 *UI microdetails 1.15*), các nhật ký phát triển chính thức được trích trong gói, và quan sát bố cục giao diện của Victoria 3. Không dùng bất kỳ tài sản nào của trò chơi (mã, ảnh, biểu tượng, phông, khung, bản đồ); mọi thứ dưới đây là thiết kế riêng đạt cùng **cách tổ chức thông tin và cảm nhận thị giác**.

## 1. Victoria 3 làm gì (quan sát) và chúng ta học gì

| Thành phần | Victoria 3 (quan sát / theo nhật ký phát triển) | Rút ra cho bản Android | Đã triển khai ở |
|---|---|---|---|
| Bố cục tổng | Bản đồ là nền toàn màn hình; mọi panel nổi lên trên bản đồ, có thể đóng; bản đồ "đủ đẹp nhưng đủ êm" để không tranh với UI (art director, ch.13 §2) | Bỏ bố cục panel cố định chiếm nửa màn hình; bản đồ luôn tràn màn hình | `App.tsx` (stage toàn màn hình, HUD nổi) |
| Thanh trên | Dải tối viền đồng: cờ/tên nước bên trái, các "tài nguyên" (ngân khố + thu chi tuần, GDP, uy tín/xếp hạng, chính danh, năng lực hành chính…) mỗi mục là biểu tượng + giá trị + biến động; ngày và tốc độ bên phải | Chỉ giữ chỉ số thiết yếu, còn lại vào dải mở rộng; chạm mở bảng phân rã có liên kết (ch.17 §1) | `TopBar` |
| Điều hướng | Cột nút ô vuông khung đồng cho các mảng quản lý; nút đang mở sáng lên | Rail trái 8 nút vuông kim loại, màu nhấn theo module; dọc: dock đáy dạng tấm kim loại | `.rail`, `.dock` |
| Cửa sổ | Khung có viền trang trí ở đầu/khung (Art Nouveau tiết chế), tiêu đề chữ có chân, tab hình chữ nhật, thân tối nhiều lớp; tránh trang trí làm nhiễu thông tin (ch.13 §1) | Viền đồng + ngoặc góc, dải tiêu đề có huy chương module và hình mờ, tab có biểu tượng, nút thu gọn/mở rộng/đóng | `.window.frame`, `WinHead`, `Tabs` |
| Phân cấp nội dung | Ô nhóm có khung, danh sách dạng thẻ hàng, biểu đồ tròn cho tỷ trọng (pop, IG), biểu đồ đường cho xu hướng | Plaque (ô nhóm có dải tiêu đề khắc), ô số liệu có góc đồng, donut cho tỷ trọng, biểu đồ đường-vùng | `Plaque`/`Sec`, `Metric`, `Donut`, `LineChart` |
| Nút | Phân biệt nút điều hướng và nút hành động; hành động có nền mạnh hơn (ch.13 §1) | Điều hướng = biểu tượng phẳng; hành động = tấm kim loại có viền, xanh cho xác nhận, đỏ cho nguy hiểm, giữ 0,7 s cho tuyên chiến | `.btn`, `.btn.primary/.danger`, `.ib` |
| Tooltip | Tooltip lồng nhau có cấu trúc ("cooltip": tiêu đề, biểu tượng, phân rã) | Tooltip có tiêu đề + dòng nhãn/giá trị + ghi chú; trên cảm ứng nhấn giữ; KPI mở bảng phân rã thay vì tooltip chết | `Tip`, `.kpipop` |
| Outliner | Danh sách quá trình đang diễn ra ở cạnh phải | Khung "Theo dõi" (nghiên cứu, cải cách, chiến tranh, quyết định chờ, hàng thiếu), mỗi mục là liên kết | `Outliner` |
| Bản đồ chính trị | Màu quốc gia nhưng vẫn thấy địa hình; dải màu đậm dọc biên giới; ranh giới bang mảnh; nhãn quốc gia chữ hoa giãn, uốn theo lãnh thổ; đại dương xanh sẫm có độ sâu | Màu quốc gia nhân với lớp phủ mặt đất + bóng địa hình, dải biên giới, đại dương sâu có quầng nước nông ven bờ, nhãn chữ hoa giãn uốn cong | `renderer.ts`, `labels.ts` |
| Chế độ bản đồ | Một lớp dữ liệu chính + chú giải rõ (ch.13 §3) | 10 chế độ, có Địa hình mới; dock chế độ kèm zoom và nút toàn màn hình | `lenses.ts`, `MapDock` |
| Chọn trên bản đồ | Chọn bang làm nổi bật bang, mở panel ngữ cảnh có hành động (ch.17 §2) | Viền sáng cho bang, viền vàng phát sáng cho quốc gia, làm mờ phần còn lại; thẻ ngữ cảnh tại điểm chạm; cửa sổ Vùng | `MapView`, `ContextCard`, `RegionWindow` |
| Mức zoom | Ẩn bớt nhãn/đánh dấu theo zoom; giữ thứ bậc thị giác (ch.59 §3) | Tên bang khi zoom gần, thủ đô thưa, sông phụ chỉ khi gần, lưới kinh vĩ mờ; ranh giới mịn khi phóng to | `MapView`, shader `regionSmooth` |

## 2. Những gì cố ý **khác** Victoria 3

- **Huy hiệu thay cờ:** cơ sở dữ liệu không có cờ lịch sử đã kiểm chứng; dự án không vẽ cờ giả. Mỗi quốc gia có huy hiệu khiên màu bản đồ + chữ cái đầu — rõ là ký hiệu trò chơi.
- **Không có chân dung nhân vật** (không có tài sản minh họa được phép dùng); dùng huy chương biểu tượng.
- **Ít hệ thống hơn:** giao diện chỉ hiển thị hệ thống engine thật sự có (xem `docs/research/PASS16_REPO_AUDIT.md`), không làm màn hình giả cho production method, front, hạm đội…
- **Điện thoại trước:** rail 40–46 px, tab 40 px, vùng chạm ≥ 38 px; cửa sổ thu gọn được để luôn thấy bản đồ; dọc dùng bottom sheet 3 mức.

## 3. Kiểm tra chống "giống ứng dụng web"

| Dấu hiệu web-app | Cách đã loại bỏ |
|---|---|
| Bảng/thẻ phẳng màu xám, bo góc | Khung đồng, ngoặc góc, gradient kim loại, không bo góc |
| Tab dạng link gạch chân mảnh | Tab có biểu tượng, nền sáng và vạch sáng khi chọn |
| Thanh điều hướng đáy kiểu app | Dock tấm kim loại có biểu tượng màu module |
| Panel chiếm cố định nửa màn hình | Cửa sổ nổi, thu gọn/mở rộng/đóng; chế độ toàn bản đồ |
| Biểu tượng nét đơn | Biểu tượng hai lớp trong huy chương đồng |
| Bản đồ phẳng màu | Địa hình màu, bóng nổi, đại dương sâu, dải biên giới, nhãn bản đồ học |
