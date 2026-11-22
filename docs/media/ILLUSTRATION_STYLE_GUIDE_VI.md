# Hướng dẫn phong cách minh họa (MEDIA-ILL-01, 2026-11-22)

**Owner:** "về phần hình ảnh có thể kêu chatgpt tìm hoặc tự làm cho đẹp nhé, kiểu gì cũng phải có ảnh mà, chứ chỉ toàn con số với dòng chữ cũng mất hay."

## 1. Nguồn ảnh, theo thứ tự ưu tiên

1. **Tư liệu lịch sử thuộc phạm vi công cộng hoặc CC:** tranh, tranh khắc, ảnh chụp, áp phích, bản vẽ kỹ thuật cùng thời kỳ, ví dụ ảnh đầu máy năm 1830 hay tranh khắc nhà máy dệt Lancashire. Nguồn: Wikimedia Commons, Library of Congress, Rijksmuseum, The Met Open Access, Wellcome, Biodiversity Heritage Library... Ghi đủ trang nguồn, tệp, giấy phép, tác giả và năm.
2. **Minh họa gốc của dự án** (giấy phép `Project original`):
   - vẽ tay, vẽ bằng mã, hoặc tạo bằng AI;
   - bắt buộc có `provenance`: phương pháp, công cụ, người tạo, ngày, và prompt nếu dùng AI;
   - chỉ dùng khi không có tư liệu lịch sử phù hợp, hoặc cho chủ đề trừu tượng/hiện đại.
3. **Cấm:**
   - ảnh, giao diện, biểu tượng hoặc phong cách đặc trưng của Victoria 3/Paradox;
   - ảnh có bản quyền không rõ;
   - logo thương hiệu thật của công ty còn hoạt động (dùng hình minh họa ngành, không dùng logo);
   - ảnh tái dựng hiện đại mà gắn nhãn như tư liệu gốc.

## 2. Phong cách cho minh họa gốc

- **Tông màu:** giấy cũ, mực nâu sẫm, ánh vàng đồng, khớp với giao diện hiện có (nền tối, viền vàng `rgba(201,164,94)`).
- **Thời kỳ 1836–1900:** phong cách tranh khắc thép/khắc gỗ.
- **1900–1950:** phong cách áp phích in thạch bản.
- **1950–2026:** đồ họa phẳng ấm màu. Ba thời kỳ khác nhau nhưng cùng một bảng màu.
- **Bố cục:** khung ngang 16:9, chủ thể rõ ở giữa, không có chữ trong ảnh.
- **Kích thước giao:** WebP, cạnh dài 1280 px (bản lớn) + 480 px (bản nhỏ), chất lượng khoảng 80.
- **Không** dùng người thật còn sống, cờ hiện đại hay biểu tượng chính trị gây tranh cãi trừ khi đúng ngữ cảnh lịch sử.

## 3. Danh mục cần ảnh (ưu tiên)

| Nhóm | Số lượng | Khóa (`type:subject`) | Ghi chú |
|---|---|---|---|
| Công nghệ | 130 | `illustration_tech:<tech id>` | ưu tiên 60 công nghệ 1836–1913 bằng tư liệu lịch sử |
| Loại công ty | 97 | `illustration_company:<kind id>` | ảnh ngành/xưởng/thiết bị, không logo |
| Công trình | 10 | `illustration_building:<building>` | plantation, mine, logging, textile_mill, ironworks, tool_works, arms_works, luxury_workshop, railway, university |
| Hàng hóa | 12 | `illustration_good:<good>` | |
| Sự kiện lịch sử | ~40 decision windows | `illustration_event:<window id>` | ví dụ dw_japan_opening, dw_meiji_restoration |
| Thời kỳ | 6 | `illustration_era:<era>` | dùng cho màn hình tải và năm mới |

## 4. Cách giao nộp

- Tệp đặt dưới `public/content/illustrations/<nhóm>/<subject>.webp`.
- Bản ghi đặt trong `historical_data/assets/illustration_assets.json` (schema ở trường `description` của file).
- `tools/build-content.ts` tự kiểm tra: tệp phải tồn tại, giấy phép phải trong danh sách cho phép, `Project original` phải có provenance, type/subject phải hợp lệ.
- Giao theo lô 20–40 ảnh, mỗi lô một commit, có báo cáo nguồn.

## 5. Quy mô

Đây cũng là một phần nội dung thật hướng tới mục tiêu cài đặt đầy đủ 4–5 GB. Ảnh là nội dung có giá trị, không phải dữ liệu độn.

## Nguồn ảnh ưu tiên (cập nhật 2026-11-22, Claude — Project Director)

HY-02 lô 1 (40 SVG vẽ bằng mã, MSG-061) bị loại: hình đơn giản kiểu clip-art, dưới chuẩn của hướng dẫn này, và ảnh "nhà ga đường sắt" lại vẽ tàu thủy. Các tệp gốc được giữ để tham chiếu trong `docs/media/rejected/hy02_batch1/`; danh sách `rejected` trong `historical_data/assets/illustration_assets.json` ghi lý do từng mục.

Thứ tự ưu tiên từ nay:
1. **Ảnh/tranh lịch sử thật thuộc phạm vi công cộng** từ kho mở có bản ghi quyền rõ ràng: Library of Congress (chỉ nhận mục ghi "No known restrictions on publication" và xuất bản trước năm hiện tại − 95), The Met Open Access (CC0), Art Institute of Chicago (CC0). Wikimedia Commons chặn truy cập tự động từ môi trường này (HTTP 429).
2. Minh họa gốc của dự án chỉ khi không có ảnh lịch sử phù hợp, và phải đạt chất lượng tranh khắc/màu nước như mục trên, không phải biểu tượng.

Quy trình (có thể tái lập):
- `tools/media/loc_candidates.py` tạo bảng ảnh ứng viên đánh số cho từng chủ đề.
- Người duyệt xem từng ảnh, chọn và ghi vào `historical_data/assets/illustration_sources/loc_selection.json` (mã mục LoC, khung cắt, ghi chú duyệt).
- `tools/media/loc_ingest.py` kiểm tra lại quyền và năm trên loc.gov, cắt 16:9, xuất WebP 1280×720 và 480×270, ghi bản ghi nguồn đầy đủ (trang nguồn, số hiệu, tuyên bố quyền, dòng ghi công).
- Test `tests/content.test.ts` bắt buộc mỗi minh họa có chủ đề, trang nguồn mở hoặc bản ghi provenance, dòng ghi công và bản nhỏ.
