# UI DESIGN SYSTEM — "Ledger & Atlas" v2 (bản đã triển khai)

> Nguồn sự thật là mã: `src/ui/styles/theme.css` (token, thành phần), `src/ui/components/ui.tsx` (cửa sổ, bảng, tooltip, số liệu), `src/ui/App.tsx` (bố cục), `src/ui/map/*` (bản đồ). Khi tài liệu lệch mã, mã thắng.
> Tên làm việc: **Dòng chảy Lịch sử**. Tham chiếu thiết kế: gói nghiên cứu Pass 16, chương 13, 17, 38, 57, 59, 61 (đọc ngày 15/11/2026).

## 1. Định hướng v2

v1 thay "skin" (nút tròn viền vàng, khung dày, bóng, mọi thứ là thẻ). v2 thay **cấu trúc**:

- **Thứ bậc, không trang trí.** Mỗi cửa sổ có một băng tiêu đề màu rượu vang duy nhất; bên trong chỉ dùng đường kẻ mảnh, tiêu đề mục small-caps có đường kẻ chạy theo, bảng sổ cái. Không bo góc, không bóng trong nội dung.
- **Điều hướng ≠ hành động.** Điều hướng là biểu tượng phẳng (thanh công cụ, tab gạch chân); hành động là nút chữ có viền (`.btn`), hành động mạnh dùng `.primary`/`.danger`, hành động không hoàn tác được phải giữ 0,7 s.
- **Chữ:** EB Garamond (có chân) cho tiêu đề, tên riêng, tên luật, tên hàng hóa; Source Sans 3 (không chân, số dạng bảng) cho dữ liệu. Cả hai SIL OFL 1.1, đóng gói offline.
- **Mỗi module một cấu trúc** (mục 5), không dùng chung một khuôn.
- Không sao chép tài sản Victoria 3: biểu tượng SVG tự vẽ, bản đồ tự dựng từ Natural Earth (phạm vi công cộng).

## 2. Token (theme.css `:root`)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--bg-app`, `--chrome`, `--chrome-2` | `#0d1416`, `#151f22`, `#1b272a` | nền, thanh trên/thanh công cụ |
| `--win`, `--win-2`, `--win-3`, `--inset` | `#18242a` … `#121c1f` | thân cửa sổ, dòng nổi, vùng chìm |
| `--head`, `--head-2` | `#4b1d27`, `#5d2532` | băng tiêu đề cửa sổ (gradient) |
| `--rule`, `--rule-2` | ngà 12% / 24% | đường kẻ mảnh |
| `--accent`, `--accent-hi` | `#c9a65e`, `#e8cf96` | lựa chọn, tiêu đề mục, gạch chân tab |
| `--text`, `--text-2`, `--text-3` | `#ebe1c9`, `#b4ad98`, `#847e6d` | chữ |
| `--pos`, `--neg`, `--warn`, `--info` | xanh lá, đỏ gạch, hổ phách, xanh lam | tốt/xấu/cảnh báo/thông tin — luôn kèm ký hiệu ▲▼■ hoặc chữ |

## 3. Thành phần (`src/ui/components/ui.tsx`, `theme.css`)

| Thành phần | Quy tắc |
|---|---|
| Cửa sổ (`.window` + `WinHead`) | Băng tiêu đề small-caps 19px + ngữ cảnh (nước · tháng/năm) + nút mở rộng/đóng phẳng. Dọc: có tay kéo, kéo để đổi độ cao hoặc đóng. |
| Tab (`Tabs`) | Chữ có chân, gạch chân vàng cho tab chọn; cuộn ngang khi nhiều. |
| Mục (`Sec`) | Tiêu đề small-caps + đường kẻ; tùy chọn chú thích phải (`x`) và liên kết `›` sang module khác. |
| Dải số liệu (`Metric`) | Ô ngăn bằng đường kẻ mảnh (không phải thẻ): nhãn, giá trị lớn, biến động theo năm, đường xu hướng **chỉ khi có ≥ 3 mẫu năm thật**. 4 ô → lưới 2×2 khi hẹp, 4 cột khi rộng. |
| Bảng sổ cái (`.dt`) | Tiêu đề dính, sắp xếp được (`useSort`), dòng nhóm (`tr.grp`), dòng chọn có vạch trái. **Cột chọn theo bề rộng thật** (`useWidth`): cột phụ ẩn khi hẹp, tên tự xuống dòng — không cắt cột, không cuộn ngang ngoài ý muốn. |
| Thanh tỷ trọng (`StackBar`) | Tầng lớp, nhóm lợi ích: một thanh xếp chồng + chú giải có %. |
| Thanh ngang (`HBars`) | Xếp hạng, phân bố, việc làm. |
| Tooltip (`Tip`) | Di chuột trên thiết bị có hover; nhấn giữ 450 ms trên cảm ứng. Nội dung có tiêu đề, các dòng nhãn–giá trị, ghi chú. |
| Popover KPI | Chạm KPI trên thanh trên → bảng phân rã có cấu trúc + nút "Mở …" (không phải tooltip chết). |
| Cửa sổ chi tiết (`details`) | Mở cạnh cửa sổ chính (ngang) hoặc chồng lên với nút quay lại (dọc); tự đóng khi đổi tab. |
| Ký hiệu độ tin cậy | ● ◆ ▲ ◇ ○ → chạm mở "Nguồn & độ tin cậy". |

## 4. Bố cục

| | Ngang (915×412 dp) | Dọc (412×915 dp) |
|---|---|---|
| Thanh trên | Nhận diện · 4 KPI thiết yếu (ngân khố, GDP, chính danh, hạng) · dải phụ ▾ (dân số, nghiên cứu, lục quân) · thông báo, Thế giới, Hệ thống · ngày · tốc độ · dừng/chạy | Hai hàng: nhận diện + thời gian; KPI |
| Điều hướng | Thanh công cụ trái 52px, 8 biểu tượng phẳng có tooltip | Thanh đáy 6 mục có nhãn: Bản đồ, Kinh tế, Chính trị, Ngoại giao, Quân sự, Thêm |
| Cửa sổ chính | Neo trái, rộng min(54%, 600px); mở rộng toàn ngang được | Bottom sheet 3 mức (66% / 40% / toàn màn) |
| Cửa sổ chi tiết | Neo ngay phải cửa sổ chính, min(36%, 380px) | Chồng lên sheet, có nút quay lại |
| Chọn vùng trên bản đồ | Cửa sổ Vùng neo phải (không phải thẻ nổi) | Sheet ở mức thấp |
| Phần điều khiển bản đồ | Thanh lớp (trên trái vùng bản đồ trống), chú giải (dưới trái), zoom (dưới phải), "Theo dõi" (trên phải) — luôn đặt trong phần bản đồ còn trống và được báo cho bộ đặt nhãn để nhãn không bị che | Chọn lớp dạng menu thả; chú giải và zoom phía trên sheet |

## 5. Cấu trúc theo module

| Module | Cấu trúc |
|---|---|
| Quốc gia | Khối nhận diện (cờ, tên đầy đủ, chính thể, nguyên thủ, thủ đô, hạng) · dải 6 số liệu có xu hướng · sổ hai cột: Chính quyền (+ tỷ trọng nhóm lợi ích), Kinh tế & xã hội, Đối ngoại, Vị thế thế giới (xếp hạng thanh), Lãnh thổ · Sự kiện gần đây có biểu tượng loại. Thẻ "Hồ sơ lịch sử" tách riêng dữ liệu 1836 và mức hoàn thiện nghiên cứu. |
| Kinh tế › Tổng quan | GDP, GDP/người, cán cân, ngân khố/nợ · biểu đồ GDP năm · việc làm theo công trình · vùng sản lượng cao nhất · tóm tắt thị trường. |
| Kinh tế › Thị trường | Bảng nhóm theo loại hàng (nông sản, nguyên liệu, công nghiệp, tiêu dùng); cung/cầu dạng thanh lệch tâm + trạng thái; chạm → cửa sổ chi tiết hàng hóa (giá, giá thế giới, sản lượng, chuỗi sản xuất). |
| Kinh tế › Công trình / Xây dựng / Ngân sách | Bảng theo ngành → cửa sổ chi tiết theo vùng · cơ hội xây xếp theo lợi suất engine, lọc theo ngành · dòng thu/chi thật của engine (`Country.finance`) + chính sách tài khóa. |
| Dân số | Số liệu, tỷ trọng tầng lớp + bảng, phân bố mức sống và biết chữ theo dân số, dân số theo năm · bảng vùng sắp xếp được · văn hóa/tôn giáo. |
| Chính trị | Chính phủ (chế độ, nguyên thủ, cải cách, tỷ trọng ảnh hưởng) · bảng nhóm lợi ích (ảnh hưởng, thái độ, sở thích luật) · lưới luật 3 lĩnh vực → cửa sổ chi tiết so sánh từng phương án với luật hiện hành bằng công thức ủng hộ của engine. |
| Công nghệ | Cây theo cột niên đại, đường nối tiền đề (tô sáng khi chọn), 4 trạng thái nút, thanh tiến độ · chi tiết: hiệu ứng, tiền đề (khác nhánh được ghi), mở đường cho, lan tỏa, lý do bị chặn, nút nghiên cứu tiền đề. |
| Ngoại giao | Bảng quan hệ có tìm kiếm, lọc láng giềng/quan hệ đặc biệt → cửa sổ quốc gia với các hành động engine cho phép; hiệp ước theo loại; chư hầu và đối thủ. Tuyên chiến: xem trước phe bằng `warSides()` + giữ để xác nhận. |
| Quân sự | Đồng hồ đo chất lượng/tinh thần/tiếp tế, hải quân, chi quân sự, mục tiêu lực lượng, các lục quân mạnh nhất · thẻ chiến tranh: hai phe, mục tiêu, điểm, mệt mỏi, trận, vùng bị chiếm. |
| Biên niên | Quyết định lịch sử với phương án lịch sử/rẽ nhánh + bảng trạng thái cửa sổ · nhật ký lọc theo loại có biểu tượng · bảng thay đổi lãnh thổ · mốc lịch sử và độ tương đồng. |

## 6. Bản đồ (v2)

- Nguồn: Natural Earth 1:10m ranh giới cấp 1 (tỉnh/bang), hồ, sông; 1:50m ảnh nổi địa hình. Ranh giới hiện đại là **xấp xỉ** cho năm 1836 (ghi trong Ghi công).
- Lưới 8192×3868 (≈ 22,8 ô/độ); 662 vùng gán theo tỉnh; trường khoảng cách bờ biển cho đường nước khắc; biên giới vector làm mịn.
- Phân cấp nét: biên giới quốc gia (quầng sáng + mực), vùng (nét đứt, chỉ khi zoom gần), bờ biển, sông chính/phụ, hồ.
- Nhãn: đặt tại cực khó tiếp cận, uốn theo trục lãnh thổ, cỡ theo diện tích; tên vùng khi zoom gần; đảo/vùng ngoài gần lãnh thổ chính dùng chung nhãn; không đè lên điều khiển bản đồ (kiểm thử `tests/ui.test.ts`).
- Thủ đô: chỉ khi zoom gần, nước lớn trước, cách nhau ≥ 26 px.
- 9 lớp: Chính trị, Mật độ dân số, Kinh tế (sản lượng/người), Mức sống, Biết chữ, Tài nguyên, Ngoại giao, Quân sự, Thị trường — mỗi lớp có tên, đơn vị/khoảng và chú giải.

## 7. Tương tác

- Vùng chạm ≥ 40 px; nhấn giữ = tooltip; vuốt tay kéo sheet để đổi độ cao, kéo xuống dưới 80% để đóng.
- Mọi lệnh đi qua engine; kết quả (thành công hoặc lý do bị từ chối) hiện thành thông báo nổi.
- Bàn phím: Space dừng/chạy, 1–5 tốc độ, Esc đóng (chi tiết → vùng → cửa sổ).
