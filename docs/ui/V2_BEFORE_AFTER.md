# So sánh trước / sau — UI v1 → v2 và bản đồ v1 → v2

Ảnh chụp từ **ứng dụng thật** (bản build production, `vite preview`, Chromium/SwiftShader) ở khung 412×915 và 915×412 dp, mật độ 2×,
cùng trạng thái ván chơi: chế độ Lịch sử, seed 1, Anh, sau 108 tháng mô phỏng (trừ ghi chú khác). Không có ảnh dựng tay.

- **Trước (v1):** `docs/ui/screenshots/after/` (đợt thiết kế lại trước) — và ảnh gốc của prototype trong `docs/ui/screenshots/before/`.
- **Sau (v2):** `docs/ui/screenshots/v2/`, cùng tên tệp. Ảnh 17–29 là trạng thái mới chỉ có ở v2 (cửa sổ chi tiết, popover, menu lớp…).
- Ảnh ghép so sánh: `docs/ui/screenshots/compare/v1_vs_v2_landscape.jpg` (thị trường, tổng quan quốc gia, bản đồ châu Âu, luật) và `v1_vs_v2_portrait.jpg` (thị trường, quốc gia, chọn vùng, chiến tranh, dân số).
- Tái tạo: `npm run build && npx tsx tools/ui-screenshots.ts docs/ui/screenshots/v2` và `npx tsx tools/ui-shots.ts …` (kế hoạch chụp trong commit).

| # | Màn hình | v1 | v2 | Thay đổi chính |
|---|---|---|---|---|
| 01 | Thị trường | `after/01_market_*` | `v2/01_market_*` | Nhóm theo loại hàng (dòng nhóm); cung/cầu dạng thanh lệch tâm + trạng thái; cột theo bề rộng thật; chạm → cửa sổ chi tiết hàng hóa bên cạnh thay vì hộp thoại che bản đồ. |
| 02 | Tổng quan quốc gia | `after/02_country_overview_*` | `v2/02_country_overview_*` | Khối nhận diện + dải 6 số liệu có xu hướng + sổ hai cột (chính quyền, kinh tế & xã hội, đối ngoại, vị thế, lãnh thổ, sự kiện) thay cho lưới thẻ. |
| 03 | Chọn vùng | `after/03_map_state_*` | `v2/03_map_state_*` | Cửa sổ Vùng neo phải (ngang) / sheet (dọc) có hành động, thay thẻ nổi che bản đồ. |
| 04 | Bản đồ châu Âu | `after/04_map_europe_labels_*` | `v2/04_map_europe_labels_*` | Ranh giới tỉnh Natural Earth 1:10m, địa hình nổi, đường nước khắc ven bờ, sông/hồ, biên giới phân cấp, nhãn uốn cong; thanh lớp/chú giải/zoom/"Theo dõi" phẳng, không chồng lấn. |
| 05 | Luật pháp | `after/05_laws_*` | `v2/05_laws_*` | Lưới 3 lĩnh vực; mỗi luật có số nhóm ủng hộ/phản đối; chi tiết so sánh từng phương án. |
| 06 | Nhóm lợi ích | `after/06_interest_groups_portrait` | `v2/06_interest_groups_portrait` | Bảng ảnh hưởng/thái độ/sở thích luật thay danh sách mục. |
| 07 | Công trình | `after/07_buildings_landscape` | `v2/07_buildings_landscape` | Bảng theo ngành (khai thác, công nghiệp, hạ tầng) với việc làm và sản phẩm; chi tiết theo vùng. |
| 08 | Xây dựng | `after/08_construction_portrait` | `v2/08_construction_portrait` | Bảng cơ hội có thanh lợi suất, lọc theo ngành. |
| 09 | Dân số | `after/09_population_portrait` | `v2/09_population_portrait` | Tỷ trọng tầng lớp + bảng; phân bố mức sống và biết chữ theo dân số (dữ liệu vùng thật). |
| 10 | Công nghệ | `after/10_technology_landscape` | `v2/10_technology_landscape` | Cây theo cột niên đại với đường nối tiền đề, 4 trạng thái nút, thay danh sách. |
| 11 | Ngoại giao | `after/11_diplomacy_landscape` | `v2/11_diplomacy_landscape` | Bảng có lọc láng giềng/quan hệ đặc biệt; chi tiết quốc gia mở cạnh bảng. |
| 12 | Chiến tranh | `after/12_military_wars_portrait` | `v2/12_military_wars_portrait` | Thẻ chiến tranh có hai phe, mục tiêu chiến tranh, điểm, mệt mỏi, vùng bị chiếm. |
| 13 | Quyết định | `after/13_journal_decision_*` | `v2/13_journal_decision_*` | Phương án lịch sử/rẽ nhánh có nhãn; bảng trạng thái cửa sổ quyết định. |
| 14 | Thế giới (Quan sát) | `after/14_world_observer_landscape` | `v2/14_world_observer_landscape` | Tổng thế giới + bảng xếp hạng sắp xếp được, cột theo bề rộng. |
| 15 | Lớp mức sống | `after/15_map_sol_layer_portrait` | `v2/15_map_sol_layer_portrait` | Chọn lớp dạng menu thả có mô tả; chú giải có đơn vị. |
| 16 | Ván mới | `after/16_new_game_*` | `v2/16_new_game_*` | Tiêu đề mục small-caps, bảng quốc gia dạng sổ cái. |

## Giới hạn còn lại (trung thực)

- Ranh giới là ranh giới hành chính **hiện đại** dùng làm xấp xỉ cho 1836; vùng của engine được gán theo tỉnh nên đường biên quốc gia đôi chỗ khác biên giới 1836.
- Cờ là ô màu của quốc gia (chưa có cờ vẽ riêng).
- Chưa có lens hành động trên bản đồ, hàng đợi nghiên cứu, phương pháp sản xuất, diplomatic play, front quân sự — vì engine chưa có các hệ thống này (xem `docs/research/PASS16_REPO_AUDIT.md`). Giao diện không giả lập chúng.
- Ảnh chụp bằng trình duyệt giả lập trên máy chủ CI-like; chưa đo trên thiết bị Android thật (APK debug do GitHub Actions build).

## Trạng thái chỉ có ở v2 (`docs/ui/screenshots/v2/`)

| # | Ảnh | Nội dung |
|---|---|---|
| 17 | `17_market_good_detail_landscape` | Cửa sổ chi tiết hàng hóa mở cạnh bảng thị trường (liên kết sang công trình sản xuất/tiêu thụ). |
| 18 | `18_law_detail_landscape` | Chi tiết luật: mức ủng hộ từng phương án và thay đổi thái độ của từng nhóm lợi ích. |
| 19 | `19_kpi_breakdown_landscape` | Popover phân rã ngân khố từ thanh trên + "Theo dõi". |
| 20 | `20_region_window_*` | Cửa sổ Vùng (ngang: neo phải; dọc: sheet thấp). |
| 21 | `21_tech_detail_landscape` | Cây công nghệ + chi tiết công nghệ đang nghiên cứu. |
| 22 | `22_budget_lines_landscape` | Dòng thu/chi thật của engine. |
| 23 | `23_diplomacy_detail_landscape` | Bảng quan hệ + cửa sổ quốc gia với hành động. |
| 24 | `24_military_forces_landscape` | Lực lượng: đồng hồ đo, chi quân sự. |
| 25–29 | `*_portrait` | Menu lớp bản đồ, sheet nửa màn hình, dải KPI phụ, cây công nghệ dọc, bảng nhóm lợi ích dọc. |
