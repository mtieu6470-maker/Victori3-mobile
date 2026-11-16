# Kiểm toán repo so với "Đặc tả tái cấu trúc toàn diện" (giai đoạn 1)

Ngày: 2026-11-16 · Nhánh `claude/game-historical-sandbox-modes-kg7rj7` · Số liệu độ phủ: `docs/audit/GLOBAL_COVERAGE.md` (tự sinh từ dữ liệu game, chạy lại bằng `npx tsx tools/audit/coverage.ts`).

Mục đích: ghi lại trung thực trạng thái **trước** khi tái cấu trúc, để mỗi giai đoạn sau có điểm so sánh. Không đánh dấu gì là "xong" chỉ vì có cấu trúc hoặc tài liệu.

## Tóm tắt

| Phần đặc tả | Trạng thái hiện tại | Bằng chứng | Khoảng trống lớn nhất |
|---|---|---|---|
| I.1–2 Phạm vi toàn cầu | 274 thực thể (113 có chủ quyền, 26 phụ thuộc, 106 phi tập trung, 19 tương lai, 5 de facto, 3 nổi dậy, 2 tổng hợp), 662 vùng, mọi lục địa có người ở | `historical_data/political_entities/registry.json`, `src/generated/db.json` | 104 thực thể "placeholder" do AI điều hành theo mô hình phi tập trung chung; nhiều chính thể thật (Kongo, Lunda, Luba, Bagirmi, Mossi, Benin, Swazi…) đang bị gộp vào nhóm này |
| I.3 Mức nền tảng cho mọi quốc gia | Điểm độ phủ trung bình 40%; châu Âu 48%, Trung Mỹ 24%, châu Phi hạ Sahara 32% | `docs/audit/GLOBAL_COVERAGE.md` | Không có hình ảnh, không có mô tả, không có tên bản địa; nguyên thủ chỉ có ở 48% thực thể |
| II.4 Country Profile | Hồ sơ có cấu trúc (chính trị, luật, nguyên thủ, quan hệ, ưu tiên) cho 147 thực thể; độ hoàn thiện nghiên cứu (`research_completeness`) phần lớn 0–0,25 | `historical_data/countries/*.json`, `_core_profiles_*.json`, `tools/build-data.ts` | Địa lý, xã hội, kinh tế, quân sự trong hồ sơ hầu như "missing" ngoài 11 quốc gia cấp A |
| II.5 Character System | Chỉ có nguyên thủ: 439 bản ghi kế vị cho 93 thực thể, nguyên thủ 1836 cho 132 thực thể; nhân vật có vai trò mô phỏng duy nhất là tuổi thọ/kế vị | `historical_data/leaders/heads_of_state.json`, `src/engine/systems/events.ts` (succession) | Không có bộ trưởng, tướng, đô đốc, nhà ngoại giao; không có chân dung, tiểu sử, tính cách, năng lực |
| III.6 Hình ảnh toàn cầu | **0 tài sản hình ảnh** ngoài bản đồ | `public/` chỉ có bản đồ | Toàn bộ |
| III.7 Asset Registry | Không có | — | Toàn bộ |
| III.8 Nội dung mô tả | Ghi chú ngắn tiếng Anh cho ~100 thực thể (`profile.notes`, `political.formation`) | `historical_data/countries/` | Không có mô tả thực chất cho quốc gia, vùng, nhà máy, tầng lớp, sự kiện |
| IV.9 Population & Society | 9 tầng lớp theo vùng, văn hóa/tôn giáo theo vùng (222 văn hóa, 21 tôn giáo), biết chữ, mức sống, cực đoan, di chuyển tầng lớp | `src/engine/systems/population.ts`, `src/engine/init.ts` | **Cơ cấu tầng lớp ban đầu dùng một hàm chung** `strataFor(stage, decentral)` cho mọi nước — đúng điều đặc tả cấm; chưa có nghề nghiệp, thu nhập theo tầng lớp, việc làm/thất nghiệp, y tế, di cư |
| IV.10 Economy & Industry | 12 hàng hóa, 10 loại công trình, thị trường theo liên minh thuế quan, giá thế giới, ngân sách, thuế, nợ, đầu tư tư nhân; GDP/người hiệu chỉnh theo Maddison (proxy) | `src/engine/systems/economy.ts` | Không có chăn nuôi, thủ công nghiệp riêng, dịch vụ/tài chính, vận tải, phương thức sản xuất; GDP/người của 165 thực thể là giá trị mặc định |
| IV.11 Politics & Government | 9 nhóm luật, 8 nhóm lợi ích, cải cách, cách mạng, ly khai, đổi chế độ | `src/engine/systems/politics.ts` | Nhóm lợi ích là mô hình chung kiểu châu Âu; không có đảng phái, quản trị địa phương, biểu tình |
| IV.12 Diplomacy | Quan hệ song phương, liên minh, bảo đảm, liên minh thuế quan, kình địch, chiến tranh có phe | `src/engine/systems/diplomacy.ts` | **Sức mạnh quy về một chỉ số `powerScore`** (đặc tả yêu cầu tách nhiều năng lực); không có trừng phạt, khủng hoảng, đàm phán nhiều bước |
| IV.13 Military | Quân số/mục tiêu/chất lượng/sĩ khí/tiếp tế, hải quân trừu tượng, chiếm đóng theo mặt trận vùng, mục tiêu chiến tranh | `src/engine/systems/military.ts` | Không có đơn vị, tướng lĩnh, trận đánh riêng, hạm đội, hậu cần chi tiết |
| IV.14 Technology | Cây công nghệ có lan tỏa (`knownShare`), điểm nghiên cứu theo biết chữ/đại học | `src/engine/systems/technology.ts` | Trình độ ban đầu gán theo nhóm (`start_techs`), chưa có khả năng tiếp nhận riêng |
| V.15–16 Historical / Sandbox | Hai chế độ dùng chung engine; Historical có cửa sổ quyết định có điều kiện, sự kiện ngoại sinh, mốc so sánh; Sandbox bỏ thiên lệch lịch sử | `src/engine/modes.ts`, `historical.ts`, `divergence.ts` | Cửa sổ quyết định chỉ có 19, sự kiện ngoại sinh 9 — tập trung vài cường quốc |
| V.17 Global AI | AI mỗi nước: ngân sách, xây dựng, luật, ngoại giao, chiến tranh, chống dao động | `src/engine/ai/ai.ts` | Tính cách nghiên cứu chỉ có ở 51 thực thể, còn lại suy ra; AI chưa giải thích quyết định |
| VI UI/UX | Bản đồ toàn màn hình, 10 chế độ bản đồ có chú giải, cửa sổ nổi, thẻ ngữ cảnh, bố cục ngang + dọc riêng | `src/ui/` | Không có hình ảnh, chân dung, mô tả; sự kiện chưa trình bày như nội dung lịch sử |
| VII Nội dung offline > 3 GB | Toàn bộ nội dung hiện ~4 MB (bản đồ) + 2,9 MB dữ liệu | `public/`, `historical_data/` | Toàn bộ |
| VIII.24 Global Coverage Audit | **Có từ giai đoạn này** | `tools/audit/coverage.ts` | — |
| VIII.25 Calibration đa khu vực | Có mốc so sánh lịch sử (milestones) nhưng chủ yếu châu Âu | `historical_data/events/milestones.json` | Chưa có bộ kiểm định theo 12 khu vực |
| VIII.26 Kiểm thử | 51 test (dữ liệu, chế độ, mô phỏng, UI) | `tests/` | Chưa có save/load test riêng, multi-seed, kiểm thử thiết bị thật, bộ nhớ/pin/nhiệt |

## Những điều đặc tả cấm mà code hiện đang làm

1. **Dùng chung mô hình xã hội**: `src/engine/init.ts` `strataFor()` tạo tỷ lệ tầng lớp chỉ từ giai đoạn công nghiệp hóa và cờ phi tập trung.
2. **Một chỉ số sức mạnh**: `src/engine/systems/diplomacy.ts` `powerScore()` được AI và xếp hạng dùng chung.
3. **Cùng một bộ nhóm lợi ích cho mọi chính thể** (`IGS` trong `src/engine/types.ts`).
4. **Nhiều chính thể thật bị xếp thành "placeholder"** (ví dụ `DZ_KONGO` Vương quốc Kongo, `DZ_LUNDA` Đế quốc Lunda, `DZ_BENIN`, `DZ_RWANDA`) — chúng có lãnh thổ và được AI điều hành nhưng không có dữ liệu riêng và không chọn chơi được.

Những điểm này được giữ nguyên trong giai đoạn 1–3 (không thay hệ thống đang chạy bằng thứ chưa kiểm thử); chúng là đầu việc của giai đoạn 6–11 trong lộ trình dưới đây.

## Lộ trình theo thứ tự đặc tả (mục 27) và phạm vi của đợt này

| # | Giai đoạn | Đợt này |
|---|---|---|
| 1 | Audit toàn bộ repository | **Làm**: tài liệu này + kiểm toán độ phủ tự sinh |
| 2 | Danh mục thực thể toàn cầu | **Làm một phần**: liên kết 266/274 thực thể với Wikidata, có bằng chứng kiểm tra niên đại (`historical_data/identity/wikidata_links.json`); chưa thêm thực thể mới |
| 3 | Dữ liệu lịch sử + Asset Registry | **Làm**: registry tài sản có nguồn, giấy phép, thời kỳ, kích thước, fallback; đường ống tải có kiểm tra giấy phép |
| 4 | Hình ảnh & mô tả toàn cầu | **Làm một phần**: quốc kỳ/huy hiệu đúng thời kỳ, chân dung nguyên thủ, mô tả có trích dẫn — chỉ khi có nguồn được phép |
| 5 | Country Identity & Character | **Làm một phần**: hồ sơ nhân vật (nguyên thủ, người đứng đầu chính phủ, người thừa kế) có liên kết Wikidata kiểm chứng ngày sinh/mất; UI hiển thị |
| 6–12 | Mô phỏng xã hội, kinh tế, chính trị, ngoại giao, quân sự, AI, chế độ | Chưa làm trong đợt này |
| 13 | Giao diện | Tích hợp nội dung mới vào cửa sổ Quốc gia và thẻ ngữ cảnh |
| 14–15 | Tối ưu Android, nghiệm thu thiết bị thật | Chưa làm — cần thiết bị thật |
