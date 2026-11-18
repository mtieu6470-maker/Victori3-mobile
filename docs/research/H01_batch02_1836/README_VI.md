# H01 Batch 02 — gói tích hợp nghiên cứu R3t

**Trạng thái:** `RESEARCH_LAYER_INTEGRATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`.

Đây là gói tích hợp tài liệu nghiên cứu H01 lên repository Victori3-mobile, không phải bản cập nhật dân số chạy trong game.

## Thành phần
- `H01_INTEGRATED_AUDIT_REPORT_VI.md`: quyết định tổng hợp cho 17 entity và các tranh chấp về phạm vi dân số/quyền lực.
- `H01_INTEGRATED_17_ENTITY_RECONCILIATION.csv`: đối chiếu profile với tổng dân số vùng ánh xạ và trạng thái quyết định.
- `H01_REGION_SCOPE_AND_CONTROL_FLAGS.csv`: tách ánh xạ kỹ thuật khỏi chủ quyền lịch sử cho OYO, NDE, LIB và DZ_KRU.
- `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv`: metadata nguồn bổ sung và locator được hiệu chỉnh; không ghi đè source registry đang chạy.
- `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv`: chứng cứ còn thiếu và cổng phê duyệt.
- `H01_VALIDATION_REPORT.md`: kiểm tra cấu trúc/số học và giới hạn kiểm định.
- `H01_REPO_INTEGRATION_MAP.md`: ranh giới tích hợp và các tệp runtime cố ý không thay đổi.

## Kết luận ngắn
- OYO 650k và OYO_OYO 1.45m: chưa đủ căn cứ định lượng; cách ly, không thay số.
- NDE 60k: có thể mô tả là ước lượng dân số polity do Mzilikazi lãnh đạo trong thập niên 1830, không phải lõi sắc tộc; khoảng 45k–85k chưa xác minh.
- NDE_MOS 210k: vùng địa lý rộng, không phải dân số được Ndebele trực tiếp cai trị.
- LIB 3,500 + 100: chưa xác minh; ACS 2,230 (chuỗi Liberia năm 1836) và Freeman ~1,500 (Monrovia khoảng 1837) khác phạm vi/ngày, không thể thay trực tiếp.
- DZ_KRU 356,400 là phần dư số học, không phải census.

## Giới hạn
Không sửa population benchmark, profile, registry, map owner, engine/runtime, save schema, assets, Android, workflow hoặc APK. S1 vẫn chưa bắt đầu theo handoff hiện hành. Cần independent Claude review và owner gate riêng trước khi nâng trạng thái.


## R3u — cập nhật nguồn mới
- Lye (1969) làm rõ 60k–80k là ước lượng subject population của polity Mzilikazi, không phải ethnic Ndebele core; 1k–5k là lực lượng chiến binh Nguni năm 1836.
- Hassell (1866) ghi 3.5k emigrants trong toàn Liberia năm 1838, không phải Monrovia năm 1836. Shick và Starr cung cấp các chuỗi arrival/population movement khác phạm vi.
- Không có số tranh chấp nào được đưa vào dữ liệu gameplay. Xem `H01_R3u_SUPPLEMENTAL_SOURCE_AUDIT_VI.md`.
