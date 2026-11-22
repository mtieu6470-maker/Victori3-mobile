# HY-02 — Batch 1: 40 minh họa lịch sử (2026-11-22)

**Status: PARTIAL / source artwork committed; WebP packaging and runtime content-build validation remain open.**  
**Branch:** ccr-b27f3fb8-epfpd6  
**Commit artwork + manifest:** 60de94a6836ff5b097c722e58fb3b7b91cb090c2; subject corrections/priorities: 30c217512ae18e1fe3c45ed430b516b5107bd7cc.

## 1. Phạm vi đã tạo

Tổng cộng **40 minh họa gốc** trong historical_data/assets/illustration_assets.json và public/content/illustrations/:

### 10 công trình
- plantation — Đồn điền
- mine — Mỏ khai thác
- logging — Trại khai thác gỗ
- textile_mill — Nhà máy dệt
- ironworks — Xưởng luyện sắt thép
- tool_works — Xưởng cơ khí
- arms_works — Xưởng quân dụng
- luxury_workshop — Xưởng hàng xa xỉ
- railway — Nhà ga đường sắt
- university — Đại học

### 20 công nghệ
- railways — Đường sắt (historical_year 1830; ngoại lệ có chủ ý vì đây là công nghệ đã có tại ngày bắt đầu 1-1-1836 và là ví dụ ưu tiên trong chỉ thị)
- steamships — Tàu hơi nước (1838)
- mechanical_reaper — Máy gặt cơ khí (1845)
- telegraph — Điện báo (1845)
- chemical_fertilizers — Phân bón hóa học (1850)
- rifled_muskets — Súng trường rãnh xoắn (1850)
- vulcanized_rubber — Cao su lưu hóa (1850)
- sewing_machine — Máy may (1850)
- interchangeable_parts — Linh kiện thay thế đồng nhất (1853)
- rifled_artillery — Pháo rãnh xoắn (1859)
- bessemer_steel — Thép Bessemer (1860)
- ironclads — Thiết giáp hạm (1860)
- oil_refining — Lọc dầu (1862)
- railway_mobilization — Huy động đường sắt (1866)
- open_hearth — Lò Martin (1870)
- dynamo — Máy phát điện dynamo (1870)
- oil_drilling — Khoan dầu (1870)
- urban_metro — Tàu điện ngầm đô thị (1870)
- transatlantic_cable — Cáp điện tín xuyên Đại Tây Dương (1870)
- reinforced_concrete — Bê tông cốt thép (1875)

### 10 sự kiện / decision windows
- dw_belgium_recognition
- dw_tanzimat
- dw_corn_laws
- dw_french_abolition
- dw_prussian_constitution
- dw_statuto_albertino
- dw_japan_opening (Kanagawa)
- dw_meiji_restoration
- dw_siam_bowring
- zollverein_accessions (các đợt gia nhập liên minh thuế quan; event-series key trong historical_events.json, không phải một dw_* decision-window ID đơn lẻ)

## 2. Nguồn, giấy phép và provenance

- Lô này dùng **Project original, code-generated vector art** thay vì gắn nhãn các bản dựng mới là ảnh tư liệu lịch sử. Không sao chép tranh/ảnh của Paradox/Victoria 3, không dùng logo doanh nghiệp thật.
- Mỗi asset có provenance: method=code_generated, tool=Custom SVG illustration generator, creator=ChatGPT for Victori3 Mobile, date=2026-11-22, prompt mô tả chủ thể và phong cách.
- Source page ghi rõ “Original code-generated SVG illustration”; không giả mạo nguồn lưu trữ, tác giả lịch sử hay giấy phép Public Domain.
- Phong cách: giấy parchment, mực nâu, đường khắc/crosshatching, 16:9, 1280×720, không chữ/không watermark.
- Công nghệ và event IDs đối chiếu cây technologies.json và historical_events.json. Railways được nêu riêng vì practical-adoption year 1830, sớm hơn cửa sổ 1836–1880 nhưng đã là start-date capability.

## 3. Kiểm tra dữ liệu

Đã đọc lại illustration_assets.json và kiểm tra:
- 40 assets đúng tổng số: 10 illustration_building, 20 illustration_tech, 10 illustration_event.
- Mỗi record có subject, path, width=1280, height=720, license.short=Project original và provenance method/creator/date.
- Kiểm tra trực tiếp file SVG railways và zollverein_accessions tồn tại, có XML/SVG root.
- Không có asset record thiếu subject/path/provenance/source.page.

**Chưa xác nhận:** chưa chạy được npm run content trong môi trường Node của branch; không ghi nhận đây là test PASS. Theo build-content.ts, script kiểm tra file tồn tại, license allow-list và provenance; manifest hiện dùng .svg path hợp lệ về mặt kiểm tra tồn tại, nhưng style guide giao WebP.

## 4. Việc còn lại để đóng HY-02 Batch 1

1. Convert 40 SVG master thành WebP 1280×720 quality ~80 và thumbnail WebP 480×270.
2. Chuyển path trong illustration_assets.json sang WebP sau khi các tệp thực sự tồn tại.
3. Chạy npm run content; xác minh public/content/registry.json đếm đủ 40 illustrations và không có lỗi.
4. Kiểm tra render trên UI cho 10 công trình, 20 tech, 10 events, đặc biệt tỷ lệ crop và độ tương phản ở màn hình điện thoại.

**Không đánh dấu Batch 1 DONE trước khi WebP variants và npm run content được xác minh.** Đây là lô source art đã commit, còn packaging/render validation đang chờ.

## 5. WebP conversion automation

Added:
- `tools/convert_illustrations.py` — converts each SVG master into a 1280×720 WebP (quality 80) and a 480×270 WebP thumbnail, updates each manifest path and retains the SVG as provenance source.
- `.github/workflows/convert-illustrations.yml` — manual GitHub Actions workflow: installs Cairo/Pillow, converts assets, runs `npm ci` + `npm run content`, then commits WebP files, manifest and generated registry to the selected branch.

Commits: converter `b593e7df6a9ff3d04e3898af15ce0f83d5cd7382`; workflow `5cb61b9a4e8a18023f6e614e0d0e06b4d8d75878`.

**Still not executed in this session.** Until the workflow run succeeds and the generated WebP/registry commit exists, Batch 1 remains PARTIAL.

