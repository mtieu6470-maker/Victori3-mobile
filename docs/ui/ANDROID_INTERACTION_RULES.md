# ANDROID INTERACTION RULES — Quy tắc tương tác cảm ứng

> **Cập nhật v3 (15/11/2026):** kiến trúc đã đổi sang bản đồ toàn màn hình với cửa sổ nổi thu gọn/mở rộng/đóng, rail và dock kim loại, thẻ ngữ cảnh khi chạm bản đồ, chế độ toàn bản đồ — xem `UI_DESIGN_SYSTEM.md` (v3). Phần dưới đây giữ nguyên như đặc tả v1; khi mâu thuẫn, `UI_DESIGN_SYSTEM.md` và mã nguồn được ưu tiên.

Áp dụng cho mọi màn hình trong SCREEN_SPECIFICATIONS. Thiết bị mục tiêu theo gói tài liệu: **iQOO Z10 Turbo** (màn hình ~6,8", tỷ lệ cao). Các con số dưới đây là quy tắc thiết kế; **chưa được đo trên thiết bị thật** — xem mục 10 về kiểm thử bắt buộc.

## 1. Vùng chạm & khoảng cách
| Quy tắc | Giá trị |
|---|---|
| Vùng chạm tối thiểu | 48×48dp (kể cả icon 24dp trong bảng — mở rộng hit-area) |
| Khoảng cách giữa hai vùng chạm | ≥ 8dp |
| Nút hành động chính | cao 48dp, rộng ≥ 96dp, có nhãn chữ |
| Dòng bảng | 48dp (1 dòng chữ), 56dp (2 dòng) |
| Thanh trượt | thumb 28dp, vùng chạm 48dp; luôn có nút −/+ bước nhỏ bên cạnh và ô nhập số |
| Lề an toàn | 16dp ở hai mép trái/phải (vùng cử chỉ Back); tôn trọng `DisplayCutout` |

## 2. Cử chỉ trên bản đồ
| Cử chỉ | Hành động |
|---|---|
| Chạm 1 ngón | Chọn vùng → ContextCard (ngang) / BottomSheet peek (dọc) |
| Chạm đúp | Phóng to 1 nấc tại điểm chạm |
| Kéo 1 ngón | Cuộn bản đồ (quán tính, có ma sát) |
| Chụm/mở 2 ngón | Thu/phóng (giới hạn 0,5×–12×), tâm là trung điểm hai ngón |
| Chạm 2 ngón | Thu nhỏ 1 nấc |
| Nhấn giữ (450ms) vùng | Menu nhanh: Xem chi tiết · Ghim · Hiện quốc gia · Hành động (nếu có) |
| Xoay 2 ngón | **Không dùng** (bản đồ luôn hướng Bắc) |
| Vuốt từ mép | **Không dùng** cho game (dành cho cử chỉ hệ thống) |

- Ngưỡng phân biệt chạm/kéo: 8dp di chuyển. Kéo bắt đầu trên ContextCard không làm cuộn bản đồ.
- Bản đồ cuộn ngang vô hạn (quấn qua kinh tuyến 180°), dọc có giới hạn.
- Nhãn quốc gia/vùng hiển thị theo mức zoom (3 cấp: quốc gia → vùng lớn → mọi vùng) để không chồng chữ.

## 3. Cuộn & panel
- Panel chỉ cuộn dọc; bảng rộng cuộn ngang **bên trong bảng** với cột đầu cố định — không bao giờ cuộn ngang cả trang.
- BottomSheet (dọc): 3 nấc peek 120dp / 50% / 92%; kéo tay cầm hoặc chạm tay cầm để đổi nấc; vuốt xuống ở nấc peek → đóng.
- SideSheet (ngang): rộng 56%; nút "Mở rộng" → toàn màn; kéo mép phải của sheet để đổi rộng 40–72% (lưu theo người dùng).
- Pull-to-refresh: **không dùng** (dữ liệu luôn trực tiếp từ engine).

## 4. Thông tin chi tiết thay cho tooltip
- Không có hover. Mọi con số có thể giải thích được đánh dấu bằng gạch chân chấm; **chạm** → ExplainSheet (phân rã nguyên nhân), **nhấn giữ** → xem nhanh (popover 1 đoạn, nhả tay → đóng).
- ExplainSheet xếp chồng tối đa 4 cấp; luôn có nút "‹ Quay lại" và "Đóng tất cả".
- Chấm chất lượng dữ liệu (●◆▲◇○) chạm → ProvenanceSheet.

## 5. Xác nhận, hoàn tác và an toàn
| Loại hành động | Ví dụ | Cách xác nhận | Hoàn tác |
|---|---|---|---|
| Có thể chỉnh lại ngay | thuế, ngân sách, nghiên cứu, mục tiêu quân số | Không cần xác nhận; áp dụng khi nhả tay | Snackbar "Hoàn tác" 5s (gửi lại giá trị cũ) |
| Tốn tài nguyên, đảo ngược được | xây công trình, cải thiện quan hệ | DecisionSheet, nút chạm thường | Không (engine trừ tiền ngay) → DecisionSheet phải nói rõ "Không hoàn tiền" |
| Không thể đảo ngược | tuyên chiến, hủy liên minh, tuyên bố đối thủ, bắt đầu cải cách | DecisionSheet + **giữ nút 600ms** (vòng tiến độ) | Không |
| Phá hủy dữ liệu | xóa save, ghi đè save | Dialog 2 nút; nút nguy hiểm màu `state/negative`, không phải nút mặc định | Không |

- Mọi lệnh gửi tới engine qua hàng đợi lệnh; kết quả (thành công / bị từ chối + lý do từ `execute()`) luôn hiện snackbar. **Không có nút không làm gì** — nếu engine từ chối, hiển thị đúng lý do.
- Khi game đang chạy ở tốc độ cao, mở DecisionSheet **tự tạm dừng** (cài đặt được) và tiếp tục sau khi đóng.

## 6. Thời gian
- Nút Pause luôn hiển thị, 48dp, cùng vị trí ở mọi màn hình. Phím vật lý: không giả định có bàn phím; nếu có (Bluetooth), Space = Pause, 1–5 = tốc độ.
- Tự tạm dừng theo loại thông báo (cài đặt): mặc định bật cho quyết định lịch sử, tuyên chiến nhắm vào ta, cách mạng, vỡ nợ, cái chết nguyên thủ.
- Ứng dụng xuống nền (onPause) → tạm dừng mô phỏng + lưu tự động.

## 7. Văn bản & nhập liệu
- Ô tìm kiếm dùng bàn phím hệ thống; bảng/khung không bị bàn phím che (cuộn tới ô đang nhập).
- Hỗ trợ cỡ chữ hệ thống tới 130% — không cắt chữ, bố cục xuống dòng.
- Song ngữ vi/en: chuỗi dài hơn 30% so với tiếng Anh phải vẫn vừa (kiểm thử chuỗi giả kéo dài).

## 8. Hướng màn hình
| Quy tắc | Ngang | Dọc |
|---|---|---|
| Điều hướng | NavRail trái 64dp | BottomNav 5 tab + Thêm |
| Panel | SideSheet 56%, map hiển thị phía phải | FullScreenPanel; bản đồ ẩn sau panel |
| Bảng | 5–7 cột | 3–4 cột + chọn cột |
| Biểu đồ | đặt cạnh bảng | đặt trên bảng, cao 160dp |
| Thông báo | InboxDrawer phải | Màn Inbox |
| Đổi hướng khi đang mở panel | giữ đối tượng đang xem, tab, bộ lọc, vị trí cuộn | như trên |

- Hai hướng đều được hỗ trợ đầy đủ; **không khóa hướng**. Không chức năng nào chỉ có ở một hướng.
- Màn hình gập/máy tính bảng (≥ 840dp rộng): dùng bố cục ngang với SideSheet + panel phụ thứ hai (chi tiết đối tượng) — giai đoạn sau.

## 9. Khả năng tiếp cận
- Mọi điều khiển có nhãn cho TalkBack (Godot: `accessibility_name` nếu bản Godot dùng hỗ trợ — **cần kiểm tra khả năng hỗ trợ TalkBack của Godot 4 trên Android** trước khi cam kết; ghi vào rủi ro).
- Tương phản chữ ≥ 4.5:1 (chữ thường), ≥ 3:1 (chữ ≥ 18sp đậm). Màu không phải kênh thông tin duy nhất.
- Chế độ giảm chuyển động; chế độ mù màu.

## 10. Kiểm thử bắt buộc (chưa thực hiện — sẽ làm khi có bản dựng Godot)
1. Kiểm tra tự động: mọi Control tương tác có kích thước ≥ 48dp (script quét cây scene).
2. Ảnh chụp màn hình mỗi màn ở 2 hướng × 2 cỡ chữ (100%, 130%) × 2 ngôn ngữ.
3. Trên thiết bị thật (iQOO Z10 Turbo): cuộn/zoom bản đồ, đo FPS và thời gian khung hình, nhiệt độ sau 30 phút, RAM, thời gian tải save. **Không công bố đạt mục tiêu khi chưa đo.**
4. Kiểm thử thủ công cử chỉ: chạm nhầm giữa hai vùng gần nhau ở zoom thấp, cử chỉ Back hệ thống không xung đột với kéo bản đồ.
