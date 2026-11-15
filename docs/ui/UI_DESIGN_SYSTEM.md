# UI DESIGN SYSTEM — "Imperial Ledger" v3 (bản đã triển khai)

> Nguồn sự thật là mã: `src/ui/styles/theme.css` (token, thành phần), `src/ui/components/ui.tsx` (cửa sổ, plaque, biểu đồ, tooltip), `src/ui/components/icons.tsx` (biểu tượng), `src/ui/App.tsx` (bố cục), `src/ui/map/*` (bản đồ). Khi tài liệu lệch mã, mã thắng. Phân tích tham chiếu: `V3_REFERENCE_ANALYSIS.md`.

## 1. Nguyên tắc

1. **Bản đồ là nền.** Bản đồ chiến lược luôn tràn màn hình; mọi giao diện nổi lên trên và có thể thu gọn hoặc ẩn (chế độ toàn bản đồ).
2. **Vật thể có khung, không phải trang web.** Cửa sổ, thanh, nút là "vật thể" có viền đồng, gradient kim loại, bóng đổ; nội dung chia bằng plaque có dải tiêu đề khắc.
3. **Thứ bậc trước trang trí.** Một dải tiêu đề, một hình mờ, một vạch màu module cho mỗi cửa sổ; trang trí chỉ ở khung và tiêu đề.
4. **Mọi con số từ engine.** Không có biểu đồ hay giá trị minh họa.

## 2. Bảng màu (`theme.css :root`)

| Nhóm | Token | Giá trị | Dùng cho |
|---|---|---|---|
| Mực (bề mặt) | `--ink-0…4` | `#090e11` → `#26383f` | nền, thân cửa sổ, ô nổi |
| Đường kẻ | `--line`, `--line-2`, `--line-3` | đồng 16% / 30% / 50% | kẻ mảnh, viền ô, kẻ tiêu đề bảng |
| Đồng | `--gold-0…4` | `#5e4824` `#96773f` `#c9a45e` `#ecd39a` `#fff0c8` | viền, biểu tượng, tiêu đề, chữ nổi bật |
| Chữ | `--text`, `--text-2`, `--text-3` | ngà `#ece3cd`, `#b8b09b`, `#857f6e` | chữ chính / phụ / chú thích |
| Trạng thái | `--pos`, `--neg`, `--warn`, `--info` | `#8cc46b`, `#e2705a`, `#e6b450`, `#7fb2d6` | tốt/xấu/cảnh báo/thông tin — luôn kèm ký hiệu ▲▼◆ hoặc chữ |
| Màu module | `--m-country`… `--m-system` | đồng, vàng ô liu, đất nung, đỏ rượu, ngọc lam, xanh lam, đỏ gạch, giấy cũ… | huy chương, vạch đầu cửa sổ, nút rail |
| Bản đồ | `--map-sea`, `--map-sea-deep`, `--map-ink` | `#46727c`, `#1c3341`, `#a8c3c4` | biển nông, biển sâu, đường nước |

## 3. Chữ

| Vai trò | Phông | Cỡ / kiểu |
|---|---|---|
| Tiêu đề cửa sổ | EB Garamond 600, small-caps, giãn 0,05em | 20 px, `--gold-4`, bóng chữ |
| Tiêu đề banner (quốc gia, chính thể, vùng) | EB Garamond 600 | 20–23 px |
| Tiêu đề plaque / mục | EB Garamond 600 small-caps | 14,5–15,5 px, `--gold-3` |
| Tên riêng trong bảng, tên luật, tên hàng | EB Garamond 500–600 | 15–16,5 px |
| Số liệu | Source Sans 3 600–700, tabular-nums | 13–22 px |
| Tiêu đề cột bảng | Source Sans 3 600 chữ hoa giãn 0,05em | 11 px, `--gold-2`, được xuống dòng |
| Nhãn quốc gia trên bản đồ | EB Garamond 600, **chữ hoa giãn 0,24em**, mực nâu + quầng ngà, uốn theo lãnh thổ | 11–34 px theo diện tích |
| Nhãn biển | EB Garamond nghiêng chữ hoa, màu xanh nhạt trên biển sẫm | 11–20 px |
| Nhãn bang (zoom gần) | EB Garamond nghiêng | 11,5 px |

## 4. Hệ biểu tượng

- 24×24, **hai lớp**: lớp tô màu nhạt (16%) dưới nét vẽ tròn đầu 1,7 px (`icons.tsx`). ~70 biểu tượng (module, chỉ số, hàng hóa, địa hình, thao tác).
- **Huy chương** (`Mdl`): vòng đồng kép, nền tối tỏa sáng giữa, biểu tượng màu module; cỡ 24/32/44 px. Dùng ở thanh tài nguyên, đầu cửa sổ, lưới luật, outliner, menu lớp bản đồ.
- **Huy hiệu quốc gia** (`Flag`): khiên màu quốc gia, viền đồng, chữ cái đầu tên ngắn; cỡ nhỏ/thường/lớn.

## 5. Cửa sổ và panel

| Thành phần | Quy tắc |
|---|---|
| Cửa sổ chính | Nổi, viền đồng 1 px + ngoặc góc đồng, bóng đổ sâu. Ngang: neo trái cạnh rail, rộng 380–560 px, cao trọn vùng dưới thanh trên trừ lề. Có **thu gọn** (chỉ còn dải tiêu đề), **mở rộng** (phủ bản đồ), **đóng**; nhấp đúp dải tiêu đề để thu gọn. |
| Dải tiêu đề | 54 px: vạch màu module trên cùng, huy chương module, tiêu đề small-caps + dòng ngữ cảnh (quốc gia · tháng năm), hình mờ biểu tượng lớn, nút thao tác vuông. |
| Tab | 40 px, biểu tượng + chữ có chân; tab chọn sáng nền + vạch sáng đáy phát sáng. |
| Cửa sổ chi tiết | Mở cạnh cửa sổ chính (hàng hóa, công trình, luật, quốc gia ngoại giao, công nghệ, mục hồ sơ); tự đóng khi đổi tab. |
| Cửa sổ Vùng | Neo phải; banner theo màu chủ sở hữu. |
| Bottom sheet (dọc) | Ba độ cao (60% / 36% / toàn), kéo tay cầm để đổi, kéo xuống để đóng; thu gọn còn dải tiêu đề trên dock. |
| Banner | Dải đầu nội dung nhuộm màu chủ thể (quốc gia/chính thể), vân chéo mờ, huy hiệu lớn. |
| Plaque (`Sec`) | Ô có khung với dải tiêu đề khắc (biểu tượng, chú thích phải, mũi tên liên kết). |
| Ô số liệu (`Metric`) | Tấm tối có góc đồng: nhãn có biểu tượng, giá trị 22 px, biến động, đường xu hướng (≥ 3 mẫu năm). 4 ô → 2×2 khi hẹp. |
| Hộp thoại | Cùng khung cửa sổ, nền mờ phía sau; dùng cho xác nhận (xây, tuyên chiến) và thông báo. |

## 6. Nút và tab

- **Hành động** `.btn`: tấm kim loại gradient, viền đồng, chữ có chân 15 px; `.primary` xanh (xác nhận), `.danger` đỏ (nguy hiểm, tuyên chiến phải giữ 0,7 s), `.sm` 32 px.
- **Điều hướng** `.ib`: biểu tượng phẳng màu đồng, nền sáng khi rê/nhấn.
- **Bộ lọc** `.seg`: nhóm nút liền, nút chọn sáng nền + vạch đáy.
- **Rail** `.rbtn`: ô vuông kim loại 40–46 px, màu biểu tượng theo module, nút đang mở có viền sáng và mấu kim cương.

## 7. Bảng và trực quan hóa dữ liệu

- **Bảng sổ cái** `.dt`: tiêu đề dính, sắp xếp được; dòng nhóm có dải màu đồng; dòng xen kẽ; dòng chọn có vạch trái; **cột theo bề rộng thật** (`useWidth`) — tên và tiêu đề tự xuống dòng, không cắt cột; padding thu nhỏ trong cửa sổ hẹp (container query).
- **Donut** (`Donut`): tỷ trọng (ảnh hưởng nhóm lợi ích, tầng lớp, văn hóa, tôn giáo, cơ cấu chi tiêu), số ở tâm, chú giải xếp giảm dần.
- **Biểu đồ đường-vùng** (`LineChart`): mẫu năm thật, vùng tô gradient, điểm cuối, khung nền, nhãn trục.
- **Thanh**: tiến độ (gradient đồng), lệch tâm (quan hệ, cán cân cung/cầu), thanh tỷ trọng ngang, đồng hồ đo (chất lượng, tinh thần, tiếp tế).

## 8. Bản đồ

- Lớp tô WebGL: màu chính trị nhân lớp phủ mặt đất Natural Earth I + bóng địa hình (mạnh hơn khi zoom gần, phẳng hơn khi zoom xa), dải đậm trong biên giới quốc gia, gạch chéo vùng bị chiếm; đại dương theo độ sâu với quầng nước nông, đường nước khắc, lưới kinh vĩ mờ.
- Chế độ **Địa hình**: màu tự nhiên đã chỉnh độ bão hòa/tương phản, biên giới đỏ nâu.
- Lớp vector: hồ, sông chính/phụ theo zoom, biên giới bang nét đứt (zoom gần), biên giới quốc gia (quầng + mực), bờ biển, viền chọn.
- Ranh giới mịn khi phóng to (bầu chọn Gaussian 3×3).
- **Chọn**: bang viền sáng kép, quốc gia viền vàng phát sáng, phần còn lại làm mờ; rê chuột làm sáng bang và hiện tooltip; chạm mở thẻ ngữ cảnh.
- Nhãn: quốc gia chữ hoa giãn uốn cong, biển nghiêng, bang khi zoom gần; thủ đô thưa (≥ 26 px); tránh mọi phần HUD.

## 9. Chuyển động

| Chuyển động | Thời lượng | Ghi chú |
|---|---|---|
| Mở cửa sổ (ngang: trượt từ trái; dọc: trượt lên) | 200–220 ms | `cubic-bezier(.2,.8,.2,1)` |
| Cửa sổ Vùng (trượt từ phải), thẻ ngữ cảnh/menu/popover (nổi lên) | 140–200 ms | |
| Nội dung tab | 160 ms mờ dần | |
| Camera bay tới vùng / zoom nút | 450 ms | nội suy zoom theo log, ease-out |
| Ẩn/hiện giao diện (toàn bản đồ) | 200 ms | |
| Tất cả | — | tắt khi hệ điều hành bật *giảm chuyển động* |

## 10. Bố cục

| | Ngang (ưu tiên, 915×412 dp) | Dọc (412×915 dp) |
|---|---|---|
| Thanh trên | 48 px: huy hiệu + tên · 4 chỉ số thiết yếu + dải phụ ▾ · thông báo · menu (Thế giới, Hệ thống, toàn bản đồ) · ngày · tốc độ · dừng/chạy | 2 hàng (85 px) |
| Điều hướng | Rail trái nổi | Dock đáy 64 px |
| Dock bản đồ | Dưới phải vùng bản đồ trống: zoom, 10 chế độ (thu gọn thành menu khi hẹp), toàn bản đồ | Trên trái: menu chế độ; zoom bên phải |
| Theo dõi | Trên phải (khi vùng trống ≥ 560 px) | — |
| Chú giải | Dưới trái vùng trống, xếp lên trên dock nếu chạm | Dưới trái trên sheet |
