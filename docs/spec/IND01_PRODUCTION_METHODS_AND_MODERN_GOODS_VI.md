# IND-01 / ECON-GOODS-01 — Phương thức sản xuất và hàng hóa theo thời kỳ (đặc tả, 2026-11-22)

**Căn cứ:**
- Chỉ thị owner 2026-11-22: tham chiếu cấu trúc Victoria 3 + các mod kéo dài tới hiện đại, không sao chép nội dung.
- Scorecard MPD2023 1836–2022 (`tools/growth-report.ts 1 2022`): các nước tiên phong khớp lịch sử tới khoảng 1950, rồi tăng quá chậm. Ví dụ Anh 1950→2022: engine ×1.83, MPD ×3.47.
- Lý do: engine chỉ có 12 hàng hóa của thế kỷ 19. Tăng trưởng thế kỷ 20–21 đến từ sản phẩm mới (điện, ô tô, hóa chất, điện tử, dịch vụ), và từ chuyển dịch cơ cấu ra khỏi nông nghiệp (Crafts 2020, CG-27).

## 1. Phương thức sản xuất (IND-01)

- Mỗi loại công trình có một danh sách phương thức. Mỗi phương thức có các thuộc tính sau:
  - `requires`: các công nghệ cần có;
  - `perWorker`: sản lượng trên mỗi công nhân;
  - `inputs`: nguyên liệu đầu vào;
  - `outputs`: sản phẩm đầu ra;
  - `skill`: tỷ lệ lao động lành nghề.
- Chủ công trình chọn phương thức có lợi nhuận cao nhất trong số các phương thức đã được mở khóa. Cách chọn giống IND-02a: có độ trễ, chuyển đổi tốn chi phí.
- Ví dụ minh họa (tên và số liệu là của dự án):
  - Dệt: máy hơi nước (than) → máy điện (điện) → sợi tổng hợp (hóa dầu).
  - Luyện kim: puddling → Bessemer → lò Martin → lò điện hồ quang.
  - Nông nghiệp: sức kéo động vật → máy kéo (nhiên liệu) → cơ giới hóa và phân đạm.
- Thay đổi cấu trúc: sản lượng không còn chỉ là hằng số công thức cộng với hiệu ứng `*_efficiency`.

## 2. Hàng hóa theo thời kỳ (ECON-GOODS-01)

| Hàng mới | Mở khóa bởi | Công trình | Cầu |
|---|---|---|---|
| `electricity` | central_power_stations | power_plant | công nghiệp, hộ gia đình (theo mức giàu) |
| `fuel` (dầu) | oil_drilling / oil_refining | oil_field, refinery | giao thông, máy kéo, phát điện |
| `chemicals` | nitrogen_fixation / synthetic_polymers | chemical_plant | phân bón, sợi tổng hợp, nhựa |
| `automobiles` | motor_cars | motor_works | hộ gia đình (đồ bền), vận tải |
| `electronics` | transistor / integrated_circuit | electronics_plant | hộ gia đình, công nghiệp, dịch vụ |
| `services_modern` (dịch vụ hiện đại, giao dịch được một phần) | internet / enterprise_software | office/services | tăng theo mức giàu (độ co giãn > 1) |

**Nguyên tắc:**
- Mọi cầu đều theo **độ co giãn thu nhập** (Engel): lương thực < 1, đồ bền ≈ 1–2, dịch vụ > 1. Hệ số được hiệu chỉnh để thị trường cân bằng gần đúng ở năm mở khóa và theo cơ cấu ngành có nguồn. Cần nghiên cứu CG-30.
- **Chuyển dịch cơ cấu:** lao động rời nông nghiệp khi năng suất nông nghiệp tăng và cầu lương thực bão hòa.
- **Không buff nước nào** (owner 2026-11-22): mọi cơ chế là quy luật chung có điều kiện (công nghệ, vốn, dân trí, độ mở thương mại).

## 3. Lát triển khai đề xuất

1. **GOODS-1:** mở rộng `GOODS` có version, kèm save migration v3→v4 và hợp đồng state. Thêm `electricity` + `power_plant`; phương thức dệt và luyện kim dùng điện.
2. **GOODS-2:** `fuel`, `chemicals` + phân đạm; nông nghiệp cơ giới.
3. **GOODS-3:** `automobiles`, `electronics` (đồ bền tiêu dùng).
4. **GOODS-4:** dịch vụ hiện đại và chuyển dịch cơ cấu.
5. **Mỗi lát** chạy scorecard 1836–2022 và longrun; tiêu chí là sai số 2022 của nhóm tiên phong < 0.3 log mà không làm xấu mốc 1913.

## 4. Rủi ro

- Thêm hàng hóa làm thay đổi kích thước mọi bảng thị trường (hiệu năng, kích thước save, giao diện). Cần đo hiệu năng mỗi tháng và kích thước snapshot.
- Phải migrate save: v3 → v4 thêm hàng mới với cung/cầu bằng 0 và giá cơ sở.

## 5. PM-1 đã triển khai (2026-11-23)

- **Dữ liệu:** `historical_data/production/production_methods.json` chứa phương thức cho dệt, luyện kim, công cụ và vũ khí, được build-data kiểm tra.
- **Phạm vi:** phương thức chỉ quyết định **cơ cấu đầu vào**. Sản lượng trên mỗi công nhân vẫn lấy từ RECIPES × hiệu ứng công nghệ.
- **Quy tắc chọn:** chủ sở hữu dùng **phương thức mới nhất đã mở khóa**. Chọn theo giá đầu vào rẻ nhất đã được thử và bị loại, vì khi đó cả thế giới dùng than củi mãi: than củi rẻ về nguyên liệu nhưng thua về quy mô và năng suất. Người chơi có thể cố định phương thức (lệnh `set_production_method`); giao diện nằm trong cửa sổ chi tiết công trình.
- **Kết quả (seed 1):**
  - 1837: Anh, Pháp, Phổ dùng than cốc; Mỹ, Nga, Áo, Nhật dùng than củi.
  - 1860: tất cả dùng than cốc.
  - 1880: lò Martin hoặc Bessemer.
  - 1900: nhà máy dệt chạy điện ở các nước dẫn đầu.
  - Scorecard 1913 giữ 0,140.
- **Tiếp theo:** GOODS-1 (hàng `electricity`, `power_plant`), rồi thêm hệ số năng suất của phương thức khi tách được khỏi hiệu ứng công nghệ.
