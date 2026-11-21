# Claude review — HY-01 v1 (Hydrogen, cờ và huy hiệu 1836)

- Bản nhận: `docs/research/media/HY01_FLAGS_ARMS_1836_v1.csv` (61 dòng, 44 chính thể; Hydrogen gửi qua owner ngày 22/11/2026).
- Verdict: **ACCEPTED_AS_HISTORICAL_REFERENCE — NOT ACCEPTED AS ASSET SOURCE.**

## Nhận xét

1. Giá trị: dòng thời gian cờ (valid_from/valid_to) và căn cứ pháp lý trong `notes` hữu ích để kiểm tra cờ nào đúng niên đại năm 1836.
2. Cả 61 dòng có `source_url`, `creator`, `license_exact`, `attribution_text`, `resolution`, `format`, `evidence_source_url` đều là `unknown`, nên không dòng nào dùng được làm tài sản phân phối.
3. 8 mã không khớp registry của game: BRZ→`BRA`, NET→`NED`, PER→`PEU`, UCA→`CAF`, DAI→ cần xác định (`WAD`?), CLM, HBC, PAN → không có trong registry 1836 (Gran Colombia đã tan năm 1831, nên `CLM` không hợp lệ năm 1836).
4. 21/44 chính thể đã có cờ có giấy phép trong `historical_data/assets/identity_assets.json` (Wikimedia Commons, có provenance). Phần trùng chỉ dùng để đối chiếu niên đại.
5. Hiện trạng game: 274 thực thể; 113 đã có cờ có giấy phép.

## Việc tiếp cho Hydrogen (HY-01 v2) — làm TRƯỚC HY-04

- Dùng đúng danh sách `docs/research/media/HY01_GAP_LIST_1836.csv` (186 chính thể còn thiếu cờ và/hoặc huy hiệu) và **đúng `polity_id` trong file đó**.
- Thứ tự: `sovereign` → `subject` → `de_facto_independent` → `rebel` → `decentralized`.
- Mỗi dòng phải có:
  - URL **trang file** Wikimedia Commons (`https://commons.wikimedia.org/wiki/File:...`) hoặc thư viện số;
  - `license_exact` lấy từ chính trang file (PD-self, PD-old-70, CC0, CC BY-SA 4.0…);
  - tác giả/`attribution_text` theo trang file;
  - kích thước gốc.
  - Không có trang file xác minh được thì để `unknown`.
- Với cộng đồng phi tập trung hoặc thực thể không có cờ lịch sử: ghi `asset_type=no_known_flag` kèm nguồn/ghi chú. **Không** tạo hay gán cờ hiện đại hoặc cờ suy đoán.
- Giữ cột `valid_from/valid_to` như v1. Cờ thay đổi trong 1836–2026 có thể ghi thêm dòng, nhưng ưu tiên trạng thái 1/1/1836.
- Sau HY-01 v2 mới chuyển sang HY-04 (nguồn bản đồ).

## Tích hợp

Claude sẽ chỉ nhập vào `identity_assets.json` những dòng có trang file và license cho phép phân phối + sửa đổi, sau khi kiểm tra lại từng trang file.
