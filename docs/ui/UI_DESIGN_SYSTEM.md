# UI DESIGN SYSTEM — "Imperial Ledger" v4

> Một hệ thống duy nhất cho mọi thành phần: các thành phần không được thiết kế riêng lẻ mà ghép từ cùng bộ token dưới đây. Token nằm trong `src/ui/styles/theme.css` (`:root`), biểu tượng trong `src/ui/components/icons.tsx`. Khi tài liệu và mã lệch nhau, mã thắng. Phân tích tham chiếu Victoria 3: `V3_REFERENCE_ANALYSIS.md`.

## 0. Bản sắc

**Sổ cái đế chế** — sơn mài xanh-đen, viền đồng thau đã ngả màu, mực ngà trên giấy cũ. Giao diện là *dụng cụ* của một văn phòng chính phủ thế kỷ XIX đặt trên bàn bản đồ: khay đồng chứa nút, thẻ ngà, con dấu sáp. Khác Victoria 3 ở chỗ: không minh họa, không chân dung, không hoa văn Art Nouveau; trang trí chỉ bằng đường kẻ khắc, góc đồng và hạt kim cương.

## 1. Màu

| Token | Giá trị | Vai trò |
|---|---|---|
| `--ink-950` | `#070b0d` | nền trang, giếng sâu |
| `--ink-900` | `#0c1317` | thân popover/tooltip, giếng (inset) |
| `--ink-850` | `#111a1f` | thân panel (đáy gradient) |
| `--ink-800` | `#17232a` | thân panel (đỉnh gradient), khay |
| `--ink-700` | `#1f2e36` | nền hover |
| `--ink-600` | `#2b3d46` | nền nổi bật, đầu cửa sổ |
| `--brz-800` | `#3a2b16` | viền tối nhất |
| `--brz-700` | `#5c4625` | **viền khung chuẩn** |
| `--brz-500` | `#8d7040` | viền nhấn, biểu tượng ở trạng thái nghỉ |
| `--gold-400` | `#b8965a` | biểu tượng HUD, kẻ trang trí |
| `--gold-300` | `#d5b574` | trạng thái chọn, tiêu đề mục |
| `--gold-200` | `#ecd6a2` | chữ nổi bật, biểu tượng khi hover |
| `--gold-100` | `#fbf0d2` | tiêu đề lớn, số liệu nổi bật |
| `--tx-1` / `--tx-2` / `--tx-3` / `--tx-4` | `#efe6d0` / `#bdb5a0` / `#8a8372` / `#5c574b` | chữ chính / phụ / chú thích / vô hiệu |
| `--pos` / `--neg` / `--warn` / `--info` | `#8fc96b` / `#e0715b` / `#e8b64f` / `#7db4da` | ngữ nghĩa — luôn đi kèm ký hiệu hoặc chữ |
| `--m-*` | xem bảng mục 3 | màu nhận diện module, chỉ dùng cho biểu tượng và vạch đánh dấu |

Quy tắc: nền luôn là mực; đồng chỉ cho viền, biểu tượng và chữ nhấn; màu ngữ nghĩa không bao giờ làm nền diện rộng (chỉ nền mờ ≤ 14%).

## 2. Chữ

| Cấp | Phông | Cỡ / trọng lượng | Dùng cho |
|---|---|---|---|
| Display | EB Garamond, small-caps, giãn 0,06em | 21 px / 600 | tiêu đề cửa sổ |
| Name | EB Garamond | 19 px / 600 | tên quốc gia trên HUD |
| Title | EB Garamond, small-caps, giãn 0,05em | 15 px / 600 | tiêu đề khối, nhóm Theo dõi |
| Item | EB Garamond | 15 px / 500 | tên mục, tên vùng |
| Label | Source Sans 3, CHỮ HOA giãn 0,1em | 9,5–10,5 px / 700 | nhãn tài nguyên HUD, nhãn nhóm thanh công cụ, tiêu đề cột |
| Value | Source Sans 3, số bảng | 16,5 px / 700 (HUD), 22 px (ô số liệu), 13 px (phụ) | số liệu |
| Body | Source Sans 3 | 14 px / 400 | văn bản |
| Caption | Source Sans 3 | 12 px / 400 | ghi chú, đơn vị |

Tối thiểu trên điện thoại: 9,5 px chỉ cho nhãn chữ hoa đậm (đọc như ký hiệu); văn bản thường ≥ 12 px; số liệu chính ≥ 16 px.

## 3. Biểu tượng

- Lưới 24 px, vùng vẽ 20 px; **một nét 1,6 px**, đầu và khớp tròn.
- **Hai lớp**: thân (`b`) tô màu hiện hành 22% + viền nét; chi tiết (`l`) chỉ nét; điểm nhấn (`d`) tô đặc. Không biểu tượng nào chỉ là đường đơn khi có thể có thân.
- Cỡ dùng: 16 (trong chữ), 18 (trong huy chương HUD), 22 (khay sidebar, thanh công cụ), 20 (nút đầu cửa sổ).
- Màu: biểu tượng nhận màu từ ngữ cảnh — đồng ở trạng thái nghỉ, `--gold-200` khi hover, `--gold-100` khi chọn, màu module trong huy chương.
- **Huy chương**: vòng đồng 1,5 px + vành tối 1,5 px + lõi tối sáng dần lên giữa; 28–32 px.

| Module | Biểu tượng | Màu `--m-*` |
|---|---|---|
| Quốc gia | vương miện | `#d9b36a` |
| Kinh tế | nhà máy | `#cdb24e` |
| Dân số | hai người | `#d1955a` |
| Chính trị | điện đường cột | `#cb6672` |
| Công nghệ | bình cổ cong | `#5fbab3` |
| Ngoại giao | văn thư có dấu sáp | `#6fa4d7` |
| Quân sự | kiếm chéo | `#d6705f` |
| Biên niên | sách có dải đánh dấu | `#bcae8b` |

## 4. Panel (lớp)

| Lớp | Thành phần | Công thức |
|---|---|---|
| L0 | Bản đồ | WebGL + lớp vector |
| L1 | Khay HUD (thanh trên, khay sidebar, thanh công cụ, Theo dõi, chú giải) | gradient `--ink-800 → --ink-850`, viền `--brz-700`, kẻ sáng trên cùng 6%, bóng `--e2` |
| L2 | Cửa sổ | như L1 + góc đồng, đầu cửa sổ `--ink-600`, bóng `--e3` |
| L3 | Popover, menu, tooltip, thẻ ngữ cảnh | `--ink-900` đặc, viền `--gold-400`, bóng `--e4` |
| Giếng | ô giá trị, ô ngày, ô nhập | `--ink-950`, bóng trong |

## 5. Viền

`--bd-hair` (đồng 14%) phân cách trong khối · `--bd-div` (đồng 28%) phân cách khối · `--bd-frame` (`--brz-700`) khung panel · `--bd-accent` (`--gold-300`) trạng thái chọn · `--bd-focus` (2 px `--gold-200`) tiêu điểm bàn phím. Bo góc: 0 cho khung, 2 px cho nút ô, 50% cho huy chương.

## 6. Bóng (độ cao)

`--e1` 0 1px 2px /50% (nút) · `--e2` 0 4px 12px /45% + 0 1px 0 /60% (khay HUD) · `--e3` 0 14px 34px /60% (cửa sổ) · `--e4` 0 18px 44px /70% (popover) · `--glow` inset 0 0 12px vàng 18% (trạng thái chọn).

## 7. Nút

| Loại | Kích thước | Dùng |
|---|---|---|
| Ô khay (slot) | 40×40 (sidebar), 38×38 (thanh công cụ) | điều hướng, chế độ bản đồ, điều khiển |
| Tấm hành động | cao 38 / 32 (nhỏ) | hành động có chữ; `primary` xanh, `danger` đỏ |
| Nút đầu cửa sổ | 34×34 | thu gọn, mở rộng, đóng |
| Nút thời gian | 44×36 | chạy/dừng |

## 8. Trạng thái tương tác (áp dụng cho mọi nút)

| Trạng thái | Nền | Viền | Biểu tượng/chữ | Khác |
|---|---|---|---|---|
| Normal | trong suốt trên khay | không | `--brz-500`→`--gold-400` | — |
| Hover | `--ink-700` | `--bd-div` | `--gold-200` | tooltip sau 350 ms (chuột) |
| Pressed | `--ink-900` | `--bd-div` | `--gold-200` | bóng trong, dịch xuống 1 px |
| Active / selected | vàng 16% gradient | `--bd-accent` | `--gold-100` | `--glow` + vạch hoặc hạt đánh dấu |
| Disabled | trong suốt | không | `--tx-4` | 45% độ đậm, không hover, `aria-disabled` |
| Focus (bàn phím) | — | `--bd-focus` | — | outline 2 px |

Ví dụ trạng thái vô hiệu đang dùng thật: nút phóng to ở mức zoom gần nhất, thu nhỏ ở mức xa nhất.

## 9. Chuyển động

`--dur-1` 90 ms (nhấn) · `--dur-2` 150 ms (hover, mờ dần) · `--dur-3` 220 ms (mở/thu panel, thanh công cụ) · `--dur-4` 450 ms (camera bản đồ). Đường cong `--ease-out` `cubic-bezier(.2,.8,.2,1)`. Hiệu ứng chọn trên bản đồ: làm mờ thế giới và viền vùng mờ dần vào trong 220 ms, gợn sóng tại điểm chạm 380 ms — chỉ vẽ trong thời gian hiệu ứng, không có vòng lặp liên tục. Tôn trọng *giảm chuyển động*.

## 10. Màn hình gameplay (landscape, 915×412 dp)

```
┌ HUD ───────────────────────────────────────────────────────────────────────┐
│ [Quốc gia] │ [Ngân khố][GDP][Chính danh][Xếp hạng][+3 ▾] │ [🔔][☰] │ [Ngày][▮▮▮][▶] │
└────────────────────────────────────────────────────────────────────────────┘
 ┌Khay┐                                                        ┌ Theo dõi ─┐
 │ ♛  │                                                        │ NGHIÊN CỨU│
 │ ⚙  │                     BẢN ĐỒ (L0)                         │ CHIẾN TRANH│
 │ …  │                                                        │ KINH TẾ   │
 └────┘   [Chú giải]                 ┌ Thanh công cụ ─────────────────────┐
                                      │ BẢN ĐỒ │ XÃ HỘI │ KINH TẾ │ … │ ĐIỀU KHIỂN │⌄│
                                      └────────────────────────────────────┘
```

- HUD chia **bốn vùng** có nền và vạch ngăn riêng: quốc gia · tài nguyên (4 chỉ số thiết yếu, mỗi chỉ số = huy chương + nhãn + giá trị, phần còn lại trong nút ▾) · thông báo/menu · thời gian (ô ngày giếng sâu, vạch tốc độ, nút chạy).
- Khay sidebar là **một tấm đồng liền** chia ô, nhóm theo chức năng (Quốc gia · Chính trị · Dân số | Kinh tế · Công nghệ | Ngoại giao · Quân sự | Biên niên).
- Thanh công cụ dưới phải nhóm theo chủ đề với nhãn nhóm; mục chọn sáng và hiện tên; thu gọn thành một nút hiện chế độ đang chọn; tự thu gọn khi cửa sổ chiếm phần lớn bản đồ.
- Theo dõi: khay L1, nhóm có tiêu đề (Nghiên cứu, Chính trị, Chiến tranh, Kinh tế), mỗi dòng = huy chương màu trạng thái + tên + dòng phụ + giá trị + thanh tiến độ; thu gọn được cả khay và từng nhóm.
